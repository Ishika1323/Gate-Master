import { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useGateExamDates } from '../../hooks/useGateExamDates';
import GateExamBanner from './GateExamBanner';
import SettingsModal from '../Settings/SettingsModal';

// Command deck navigation — each route carries a single-key shortcut so the
// whole app is keyboard-drivable (Terminal × Ascent).
const navItems = [
    { path: '/', label: 'Command Deck', icon: <LayoutDashboard size={16} />, glyph: '◉', key: 'D' },
    { path: '/plan', label: 'Study Plan', icon: <Calendar size={16} />, glyph: '▚', key: 'P' },
    { path: '/analysis', label: 'Analytics', icon: <BarChart2 size={16} />, glyph: '◈', key: 'A' },
    { path: '/timer', label: 'Focus Timer', icon: <Timer size={16} />, glyph: '⧗', key: 'T' },
    { path: '/pyq', label: 'PYQ Log', icon: <BrainCircuit size={16} />, glyph: '✎', key: 'Q' },
    { path: '/topics', label: 'Topic Board', icon: <Layers size={16} />, glyph: '▦', key: 'B' },
    { path: '/tasks', label: 'Missions', icon: <CheckSquare size={16} />, glyph: '☑', key: 'M' },
    { path: '/syllabus', label: 'Syllabus', icon: <BookOpen size={16} />, glyph: '▤', key: 'S' },
];

export default function Navbar() {
    const { theme, toggleTheme, user } = useAppStore();
    const { gateCse, gateDa } = useGateExamDates();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'operator';
    const userAvatar = user?.user_metadata?.avatar_url;

    // Keyboard shortcuts: press a route's letter to jump there (ignoring typing
    // inside inputs / when a modifier is held).
    const handleKey = useCallback((e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
        const item = navItems.find((n) => n.key.toLowerCase() === e.key.toLowerCase());
        if (item) {
            e.preventDefault();
            navigate(item.path);
        }
    }, [navigate]);

    useEffect(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleKey]);

    const navLinkClass = ({ isActive }) => `deck-navlink${isActive ? ' on' : ''}`;

    return (
        <>
            {/* Desktop terminal sidebar */}
            <nav className="deck-side hidden md:flex flex-col w-64 fixed h-full z-50 px-3 py-4">
                <div className="flex items-center gap-2.5 px-2 pb-3">
                    <div className="deck-logo w-7 h-7 rounded-lg grid place-items-center text-white font-extrabold font-sans">
                        G
                    </div>
                    <b className="font-sans tracking-tight text-deck-inkb text-[15px]">
                        Gate<span className="text-deck-violet">Master</span>
                    </b>
                </div>

                <GateExamBanner gateCse={gateCse} gateDa={gateDa} className="mb-2 border-t-0 pt-0" />

                {/* User chip */}
                <div className="flex items-center gap-2.5 mb-3 p-2.5 rounded-xl border border-deck-line2 bg-deck-panel2">
                    {userAvatar ? (
                        <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full border border-deck-violet/30" />
                    ) : (
                        <div className="w-8 h-8 rounded-full grid place-items-center text-deck-cyan font-bold bg-deck-panel border border-deck-line2">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-deck-inkb truncate">{userName}</p>
                        <p className="text-[10px] text-deck-muted truncate">{user?.email || 'local session'}</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-0.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink key={item.path} to={item.path} end={item.path === '/'} className={navLinkClass}>
                            <span className="deck-ic">{item.glyph}</span>
                            {item.label}
                            <span className="deck-kbd">{item.key}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="mt-3 pt-3 border-t border-deck-line">
                    <div className="flex items-center justify-between px-1">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-deck-muted2 hover:text-deck-inkb hover:bg-deck-panel2 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 rounded-lg text-deck-muted2 hover:text-deck-inkb hover:bg-deck-panel2 transition-colors"
                            aria-label="Settings"
                        >
                            <Settings size={18} />
                        </button>
                        <button
                            onClick={() => navigate('/logout')}
                            className="p-2 rounded-lg text-deck-bad hover:bg-deck-bad/10 transition-colors"
                            aria-label="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                    <div className="mt-3 px-1 text-[10.5px] text-deck-muted font-mono leading-tight">
                        v2.0 · GATE {gateCse.getFullYear()}<br />Season · {gateCse.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).replace(' ', ' ’')}
                    </div>
                </div>
            </nav>

            {/* Mobile header */}
            <div className="deck-side md:hidden fixed top-0 w-full z-50 px-4 py-2 border-r-0 border-b border-deck-line">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="deck-logo w-7 h-7 shrink-0 rounded-md grid place-items-center text-white font-bold font-sans">
                            G
                        </div>
                        <b className="font-sans text-base text-deck-inkb truncate">
                            Gate<span className="text-deck-violet">Master</span>
                        </b>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <button onClick={toggleTheme} className="p-2 text-deck-muted2">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-deck-ink"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
                <GateExamBanner
                    gateCse={gateCse}
                    gateDa={gateDa}
                    className="mt-2 border-t border-deck-line pt-2"
                />
            </div>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div className="deck-shell md:hidden fixed inset-0 z-40 pt-32 px-4 pb-6 overflow-y-auto w-full h-screen">
                    <div className="flex flex-col gap-1.5">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/'}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => `deck-navlink text-sm py-3${isActive ? ' on' : ''}`}
                            >
                                <span className="deck-ic">{item.glyph}</span>
                                {item.label}
                                <span className="deck-kbd">{item.key}</span>
                            </NavLink>
                        ))}

                        <div className="pt-4 mt-3 border-t border-deck-line">
                            <div className="flex items-center gap-3 p-3 rounded-2xl border border-deck-line2 bg-deck-panel2 mb-3">
                                {userAvatar ? (
                                    <img src={userAvatar} alt={userName} className="w-11 h-11 rounded-full border border-deck-violet/30" />
                                ) : (
                                    <div className="w-11 h-11 rounded-full grid place-items-center text-deck-cyan font-bold text-lg bg-deck-panel border border-deck-line2">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-deck-inkb truncate">{userName}</p>
                                    <p className="text-xs text-deck-muted truncate">{user?.email || 'local session'}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => { setIsMobileMenuOpen(false); setIsSettingsOpen(true); }}
                                className="deck-navlink w-full text-sm py-3"
                            >
                                <span className="deck-ic"><Settings size={16} /></span>
                                Settings
                            </button>
                            <button
                                onClick={() => { setIsMobileMenuOpen(false); navigate('/logout'); }}
                                className="deck-navlink w-full text-sm py-3 text-deck-bad"
                            >
                                <span className="deck-ic" style={{ color: 'var(--deck-bad)' }}><LogOut size={16} /></span>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
}
