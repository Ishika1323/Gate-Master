import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
    BrainCircuit,
    Layers,
    LogOut,
    User
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useGateExamDates } from '../../hooks/useGateExamDates';
import GateExamBanner from './GateExamBanner';

export default function Navbar() {
    const { theme, toggleTheme, user } = useAppStore();
    const { gateCse, gateDa } = useGateExamDates();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Get user initials or first name
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const userAvatar = user?.user_metadata?.avatar_url;

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/timer', label: 'Focus Timer', icon: <Timer size={20} /> },
        { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
        { path: '/plan', label: 'Study Plan', icon: <Calendar size={20} /> },
        { path: '/syllabus', label: 'Syllabus', icon: <BookOpen size={20} /> },
        { path: '/analysis', label: 'Analytics', icon: <BarChart2 size={20} /> },
        { path: '/topics', label: 'Topic Board', icon: <Layers size={20} /> },
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
                    <GateExamBanner gateCse={gateCse} gateDa={gateDa} className="mt-4 border-t-0 pt-0" />
                </div>

                <div className="px-6 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        {userAvatar ? (
                            <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full border-2 border-brand-500/20" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-500 truncate">{user?.email}</p>
                        </div>
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
                        <button
                            onClick={() => navigate('/logout')}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            aria-label="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                    <div className="mt-4 px-2">
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            v1.0.0 • GATE {gateCse.getFullYear()}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 px-4 py-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 shrink-0 rounded-md bg-brand-600 flex items-center justify-center text-white font-bold">
                            G
                        </div>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                            Gate<span className="text-brand-600">Master</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
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
                <GateExamBanner
                    gateCse={gateCse}
                    gateDa={gateDa}
                    className="mt-2 border-t border-slate-100 dark:border-slate-800 pt-2"
                />
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-slate-900 pt-32 px-4 pb-6 overflow-y-auto w-full h-screen">
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
                        
                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                             <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-4">
                                {userAvatar ? (
                                    <img src={userAvatar} alt={userName} className="w-12 h-12 rounded-full border-2 border-brand-500/20" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xl">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{user?.email}</p>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => { setIsMobileMenuOpen(false); navigate('/logout'); }}
                                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
}
