import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import ProgressDashboard from './components/Dashboard/ProgressDashboard';
import PomodoroTimer from './components/Timer/PomodoroTimer';
import TasksPage from './components/Tasks/TasksPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import StudyPlanPage from './components/StudyPlan/StudyPlanPage';
import PYQPage from './components/PYQ/PYQPage';
import SyllabusPage from './components/Syllabus/SyllabusPage';
import useAppStore from './store/useAppStore';
import './styles/index.css';


function App() {
  const { theme, hydrateFromDb, syncStudyPlan, initializeCurrentDay } = useAppStore();

  useEffect(() => {
    // Initialize current day based on today's date
    initializeCurrentDay();
    // Sync with DB on load
    hydrateFromDb();
    // Ensure local storage plan matches current code structure
    syncStudyPlan();

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, initializeCurrentDay]);

  // Original Layout Logic
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 font-sans text-slate-900 dark:text-slate-100">
        <Navbar />
        <div className="flex-1 md:pl-64 transition-all duration-200">
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto mt-16 md:mt-0">
            <Routes>
              <Route path="/" element={<ProgressDashboard />} />
              <Route path="/timer" element={<PomodoroTimer />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/analysis" element={<AnalyticsPage />} />
              <Route path="/plan" element={<StudyPlanPage />} />
              <Route path="/pyq" element={<PYQPage />} />
              <Route path="/syllabus" element={<SyllabusPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
