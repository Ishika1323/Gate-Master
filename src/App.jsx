import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import ProgressDashboard from './components/Dashboard/ProgressDashboard';
import PomodoroTimer from './components/Timer/PomodoroTimer';
import TasksPage from './components/Tasks/TasksPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import StudyPlanPage from './components/StudyPlan/StudyPlanPage';
import PYQPage from './components/PYQ/PYQPage';
import SyllabusPage from './components/Syllabus/SyllabusPage';
import TopicStrengthBoard from './components/TopicBoard/TopicStrengthBoard';
import LoginPage from './components/Auth/LoginPage';
import LogoutPage from './components/Auth/LogoutPage';
import { supabase } from './lib/supabase';
import useAppStore from './store/useAppStore';
import './styles/index.css';

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
    let authChecked = false;

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
            authChecked = true;
            
            const state = useAppStore.getState();
            const metaStart = state.session?.user?.user_metadata?.plan_start_date;
            if (metaStart && !state.planStartDate) {
                state.setPlanStartDate(metaStart);
            } else if (state.planStartDate && metaStart !== state.planStartDate && state.session && !state.session.isGuest) {
                await supabase.auth.updateUser({ data: { plan_start_date: state.planStartDate } });
            }

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
            authChecked = true;
            
            const state = useAppStore.getState();
            const metaStart = state.session?.user?.user_metadata?.plan_start_date;
            if (metaStart && !state.planStartDate) {
                state.setPlanStartDate(metaStart);
            } else if (state.planStartDate && metaStart !== state.planStartDate && state.session && !state.session.isGuest) {
                await supabase.auth.updateUser({ data: { plan_start_date: state.planStartDate } });
            }
            
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

  const { session } = useAppStore();

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
