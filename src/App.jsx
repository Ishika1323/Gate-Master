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
    const load = async () => {
      if (dataLoaded) return;
      dataLoaded = true;
      initializeCurrentDay();
      const { bootstrapLocalFromPersisted } = await import('./services/db');
      await bootstrapLocalFromPersisted(useAppStore.getState());
      await hydrateFromDb();
      syncStudyPlan();
    };

    // Auth Listener
    if (supabase) {
        // 1. Register the auth state change listener FIRST so we never miss
        //    the SIGNED_IN event that fires on OAuth redirect callbacks.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            useAppStore.getState().setAuth(session);
            
            // Sync plan_start_date from metadata or push local state up
            const state = useAppStore.getState();
            const metaStart = session?.user?.user_metadata?.plan_start_date;
            if (metaStart && !state.planStartDate) {
                state.setPlanStartDate(metaStart);
            } else if (state.planStartDate && metaStart !== state.planStartDate) {
                await supabase.auth.updateUser({ data: { plan_start_date: state.planStartDate } });
            }

            // Trigger data load on sign-in to handle post-OAuth redirect
            if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
                void load();
            }
        });

        // 2. Then check for an existing session. This handles page refreshes
        //    where the user is already authenticated.
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            useAppStore.getState().setAuth(session);
            
            const state = useAppStore.getState();
            const metaStart = session?.user?.user_metadata?.plan_start_date;
            if (metaStart && !state.planStartDate) {
                state.setPlanStartDate(metaStart);
            } else if (state.planStartDate && metaStart !== state.planStartDate && session) {
                await supabase.auth.updateUser({ data: { plan_start_date: state.planStartDate } });
            }
            
            // Load data after we know the auth state
            void load();
        });

        return () => {
            subscription.unsubscribe();
        };
    } else {
        useAppStore.getState().setAuthLoading(false);
        void load();
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
