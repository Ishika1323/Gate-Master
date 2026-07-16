import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Layout/Navbar';
import ProgressDashboard from './components/Dashboard/ProgressDashboard';
import LoginPage from './components/Auth/LoginPage';
import LogoutPage from './components/Auth/LogoutPage';
import { supabase } from './lib/supabase';
import useAppStore from './store/useAppStore';
import { defaultPlanStart } from './data/studyPlan';
import './styles/index.css';

/**
 * Reconcile the plan start date between the local store and the signed-in
 * Supabase account.
 *
 * The 311-day plan was re-anchored to start "today". For guests this happens
 * via the localStorage persist migration (useAppStore v1). Signed-in accounts
 * carry their own plan_start_date in user_metadata, which would otherwise be
 * pulled back down and re-pin the old date — including on a fresh browser where
 * the localStorage migration never runs. We mirror the reset here, once per
 * account, guarded by a plan_reset_v1 metadata flag so the plan advances
 * normally after the one-time re-anchor.
 */
async function reconcilePlanStartWithAccount() {
    const state = useAppStore.getState();
    if (!supabase || !state.session || state.session.isGuest) return;

    const meta = state.session.user?.user_metadata || {};
    const metaStart = meta.plan_start_date;

    // One-time account re-anchor to today.
    if (!meta.plan_reset_v1) {
        const today = defaultPlanStart();
        state.setPlanStartDate(today);
        // Spread existing metadata so we never clobber OAuth profile fields
        // (name, avatar, etc.) regardless of merge/replace semantics.
        await supabase.auth.updateUser({
            data: { ...meta, plan_start_date: today, plan_reset_v1: true },
        });
        return;
    }

    // Normal steady-state sync between account metadata and local store.
    if (metaStart && !state.planStartDate) {
        state.setPlanStartDate(metaStart);
    } else if (state.planStartDate && metaStart !== state.planStartDate) {
        await supabase.auth.updateUser({
            data: { ...meta, plan_start_date: state.planStartDate },
        });
    }
}

// Route-level code splitting: keep only the dashboard (landing route) eager.
const PomodoroTimer = lazy(() => import('./components/Timer/PomodoroTimer'));
const TasksPage = lazy(() => import('./components/Tasks/TasksPage'));
const AnalyticsPage = lazy(() => import('./components/Analytics/AnalyticsPage'));
const StudyPlanPage = lazy(() => import('./components/StudyPlan/StudyPlanPage'));
const PYQPage = lazy(() => import('./components/PYQ/PYQPage'));
const SyllabusPage = lazy(() => import('./components/Syllabus/SyllabusPage'));
const TopicStrengthBoard = lazy(() => import('./components/TopicBoard/TopicStrengthBoard'));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center py-24 text-slate-400 animate-pulse">
      Loading...
    </div>
  );
}

/**
 * ProtectedRoute Wrapper
 * Redirects to /login if not authenticated.
 */
function ProtectedRoute({ children }) {
  const { session, authLoading } = useAppStore();
  const location = useLocation();

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-bold tracking-widest uppercase animate-pulse">Initializing GateMaster AI...</div>;
  }

  if (!session && supabase) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * UnprotectedRoute Wrapper
 * Redirects to dashboard if already logged in.
 */
function AuthRoute({ children }) {
    const { session, authLoading } = useAppStore();
    
    if (authLoading) {
        return null;
    }

    if (session && supabase) {
        return <Navigate to="/" replace />;
    }
    
    return children;
}

function App() {
  const { theme, hydrateFromDb, syncStudyPlan, initializeCurrentDay } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    let dataLoaded = false;

    const load = async () => {
      if (dataLoaded) return;
      dataLoaded = true;
      initializeCurrentDay();
      const { bootstrapLocalFromPersisted } = await import('./services/db');
      await bootstrapLocalFromPersisted(useAppStore.getState());
      await hydrateFromDb();
      syncStudyPlan();
    };

    // SAFETY FALLBACK: If auth initialization hangs for more than 5s,
    // force-disable the loading screen to prevent a blank page.
    const lockTimer = setTimeout(() => {
        if (useAppStore.getState().authLoading) {
            console.warn("Auth initialization timed out after 5s. Bypassing loading screen.");
            useAppStore.getState().setAuthLoading(false);
            void load();
        }
    }, 5000);

    // Auth Listener
    if (supabase) {
        // 1. Register listener FIRST to catch events during refresh/redirect
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentState = useAppStore.getState();
            const isGuest = currentState.session?.isGuest || currentState.session?.user?.email === 'guest@gatemaster.ai';
            
            if (!session && isGuest) {
                // Keep guest session, ignore null from Supabase
            } else {
                useAppStore.getState().setAuth(session);
            }
            await reconcilePlanStartWithAccount();

            if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED' || isGuest) {
                void load();
            }
        });

        // 2. Fetch session immediately
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            const currentState = useAppStore.getState();
            const isGuest = currentState.session?.isGuest || currentState.session?.user?.email === 'guest@gatemaster.ai';

            if (!session && isGuest) {
                // Keep guest session, ignore null from Supabase
                useAppStore.getState().setAuthLoading(false);
            } else {
                useAppStore.getState().setAuth(session);
            }
            await reconcilePlanStartWithAccount();

            // Hydration safety: ensure store is ready before loading DB content
            if (useAppStore.persist?.hasHydrated && useAppStore.persist.hasHydrated()) {
                void load();
            } else if (useAppStore.persist?.onFinishHydration) {
                useAppStore.persist.onFinishHydration(() => {
                    void load();
                });
            } else {
                void load();
            }
        });

        return () => {
            clearTimeout(lockTimer);
            subscription.unsubscribe();
        };
    } else {
        // No Supabase configured -> treat as local-only / guest immediately
        useAppStore.getState().setAuthLoading(false);
        useAppStore.persist.onFinishHydration(() => {
            void load();
        });
        clearTimeout(lockTimer);
        return () => {};
    }
  }, [hydrateFromDb, syncStudyPlan, initializeCurrentDay]);

  return (
    <Router>
      <Routes>
        {/* Auth Pages (Unprotected) */}
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/logout" element={<LogoutPage />} />

        {/* Dashboard Pages (Protected) */}
        <Route path="*" element={
          <ProtectedRoute>
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 font-sans text-slate-900 dark:text-slate-100">
              <Navbar />
              <div className="flex-1 w-full min-w-0 md:pl-64 transition-all duration-200">
                <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto mt-[7.5rem] md:mt-0">
                  <Suspense fallback={<RouteFallback />}>
                    <Routes>
                      <Route path="/" element={<ProgressDashboard />} />
                      <Route path="/timer" element={<PomodoroTimer />} />
                      <Route path="/tasks" element={<TasksPage />} />
                      <Route path="/analysis" element={<AnalyticsPage />} />
                      <Route path="/plan" element={<StudyPlanPage />} />
                      <Route path="/pyq" element={<PYQPage />} />
                      <Route path="/syllabus" element={<SyllabusPage />} />
                      <Route path="/topics" element={<TopicStrengthBoard />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
