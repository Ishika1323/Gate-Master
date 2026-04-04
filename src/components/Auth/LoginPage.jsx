import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { LogIn, Github, Mail, Lock, Sparkles, Brain, Code2, Target } from 'lucide-react';

export default function LoginPage() {
    const { signInWithGoogle, session } = useAppStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Immediate redirect if session exists
    useEffect(() => {
        if (session) {
            navigate('/', { replace: true });
        }
    }, [session, navigate]);

    const handleGoogleLogin = async () => {
        if (!useAppStore.getState().signInWithGoogle) {
            alert('Supabase is not configured. Please check your .env file or use Guest Mode.');
            return;
        }
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to sign in with Google. Check console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestLogin = () => {
        // Mock session to bypass protection
        useAppStore.getState().setAuth({ isGuest: true, user: { email: 'guest@gatemaster.ai', user_metadata: { full_name: 'Guest Explorer' } } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-md relative z-10 transition-all duration-500 hover:scale-[1.01]">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-white/10 shadow-2xl p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 shadow-lg shadow-brand-500/20 mb-6 group hover:rotate-3 transition-transform">
                            <Brain className="w-9 h-9 text-white group-hover:scale-110 transition-transform" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                            Gate<span className="text-brand-500">Master</span> AI
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Your personalized path to GATE Excellence.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Google Sign-In */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-wait active:scale-95"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Sign in with Google</span>
                        </button>

                        <div className="relative flex items-center justify-center my-8">
                            <span className="absolute px-4 bg-white dark:bg-slate-900 text-slate-400 text-xs font-medium uppercase tracking-wider">
                                OR CONTINUE WITH
                            </span>
                            <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>
                        </div>

                        {/* Traditional Login (MOCK for now) */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-11 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-brand-500 dark:focus:border-brand-500 rounded-xl pl-10 pr-4 text-sm font-medium transition-all outline-none focus:ring-4 focus:ring-brand-500/10"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-11 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-brand-500 dark:focus:border-brand-500 rounded-xl pl-10 pr-4 text-sm font-medium transition-all outline-none focus:ring-4 focus:ring-brand-500/10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">Forgot password?</button>
                            </div>
                            <Button className="w-full h-12 rounded-xl font-bold text-base shadow-xl shadow-brand-500/20 active:scale-[0.98]">
                                Sign In
                            </Button>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
                        <button 
                            onClick={handleGuestLogin}
                            className="w-full text-xs font-bold text-slate-400 hover:text-brand-500 uppercase tracking-[0.2em] transition-colors"
                        >
                            Or Enter in Guest Mode
                        </button>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                <Sparkles size={12} className="text-brand-500" /> AI Planning
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                <Target size={12} className="text-brand-500" /> Focus Mode
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                <Code2 size={12} className="text-brand-500" /> PYQ Training
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                <LogIn size={12} className="text-brand-500" /> Cloud Sync
                            </div>
                        </div>
                    </div>
                </Card>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account? <button className="text-brand-600 font-bold hover:underline">Create One</button>
                </p>
            </div>
        </div>
    );
}
