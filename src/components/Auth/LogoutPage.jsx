import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { LogOut, CheckCircle2, ArrowRight, Brain } from 'lucide-react';

export default function LogoutPage() {
    const { signOut } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        // Trigger signout on mount
        signOut();
    }, [signOut]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-white/10 shadow-2xl p-8 md:p-10 text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Logged Out</h2>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                            You have successfully signed out of your account. We'll be ready when you're back for your next session!
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Button 
                            className="w-full h-12 flex items-center justify-center gap-2 text-lg font-bold shadow-xl shadow-brand-500/20"
                            onClick={() => window.location.href = '/login'}
                        >
                            Sign In Again <ArrowRight size={20} />
                        </Button>
                        
                        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-2 opacity-50">
                            <Brain size={18} className="text-brand-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                GateMaster AI
                            </span>
                        </div>
                    </div>
                </Card>
                
                <p className="mt-8 text-center text-sm text-slate-500">
                    Need help? <button className="text-brand-600 font-bold hover:underline">Support</button>
                </p>
            </div>
        </div>
    );
}
