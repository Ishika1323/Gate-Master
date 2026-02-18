import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Timer,
    CheckSquare,
    BookOpen,
    BarChart2,
    Calendar,
    Menu,
    X,
    Sun,
    Moon,
    Settings,
    BrainCircuit
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function Navbar() {
    const { theme, toggleTheme } = useAppStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/timer', label: 'Focus Timer', icon: <Timer size={20} /> },
        { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
        { path: '/plan', label: 'Study Plan', icon: <Calendar size={20} /> },
        { path: '/syllabus', label: 'Syllabus', icon: <BookOpen size={20} /> },
        { path: '/analysis', label: 'Analytics', icon: <BarChart2 size={20} /> },
        { path: '/pyq', label: 'PYQ Training', icon: <BrainCircuit size={20} /> },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex flex-col w-64 fixed h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-colors duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xl">
                            G
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Gate<span className="text-brand-600">Master</span>
                        </h1>
                    </div>
                </div>

                <div className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/10 dark:text-brand-300 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}
              `}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between px-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Settings"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                    <div className="mt-4 px-2">
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            v1.0.0 • GATE 2026
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center text-white font-bold">
                        G
                    </div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                        Gate<span className="text-brand-600">Master</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-500"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-slate-600 dark:text-slate-300"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-slate-900 pt-16 px-4 pb-6 overflow-y-auto w-full h-screen">
                    <div className="space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium transition-all
                  ${isActive
                                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/10 dark:text-brand-300'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
                `}
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}


        </>
    );
}
