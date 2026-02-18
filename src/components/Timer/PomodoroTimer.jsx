import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX, Maximize2, Minimize2, CheckCircle2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { formatTime, getTimerMode, calculateProgress } from '../../utils/timerUtils';
import { getSubjectById, SUBJECTS } from '../../data/subjects';

export default function PomodoroTimer() {
    const { timer, setTimer, resetTimer, addSession } = useAppStore();
    const [showSettings, setShowSettings] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (timer.isActive && !timer.isPaused) {
            intervalRef.current = setInterval(() => {
                setTimer({ timeRemaining: timer.timeRemaining - 1 });

                if (timer.timeRemaining <= 1) {
                    handleTimerComplete();
                }
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [timer.isActive, timer.isPaused, timer.timeRemaining]);

    const handleTimerComplete = () => {
        // Play sound logic would go here
        if (soundEnabled) {
            // playAudio(); 
        }

        if (!timer.isBreak && timer.currentSubject) {
            addSession({
                subject: timer.currentSubject,
                topic: timer.currentTopic,
                duration: timer.workDuration,
                date: new Date().toISOString(),
            });
        }

        if (timer.isBreak) {
            setTimer({
                isBreak: false,
                timeRemaining: timer.workDuration * 60,
                isActive: false,
            });
        } else {
            setTimer({
                isBreak: true,
                timeRemaining: timer.breakDuration * 60,
                isActive: false,
            });
        }
    };

    const handlePlayPause = () => {
        if (!timer.isActive) {
            setTimer({ isActive: true, isPaused: false });
        } else {
            setTimer({ isPaused: !timer.isPaused });
        }
    };

    const handleReset = () => {
        resetTimer();
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const handleModeChange = (mode) => {
        const { work, break: breakTime } = getTimerMode(mode);
        setTimer({
            mode,
            workDuration: work,
            breakDuration: breakTime,
            timeRemaining: work * 60,
            isActive: false,
            isPaused: false,
            isBreak: false,
        });
    };

    const totalTime = timer.isBreak ? timer.breakDuration * 60 : timer.workDuration * 60;
    const progress = calculateProgress(timer.timeRemaining, totalTime);
    const currentSubjectData = getSubjectById(timer.currentSubject);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 flex items-center justify-center p-8' : 'space-y-6'}`}>

            <div className={`w-full ${isFullscreen ? 'max-w-4xl' : 'max-w-xl mx-auto'}`}>
                {/* Header Controls */}
                <div className="flex justify-between items-center mb-6">
                    {!isFullscreen && <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Focus Timer</h2>}
                    <div className={`flex gap-2 ${isFullscreen ? 'absolute top-6 right-6' : ''}`}>
                        <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>
                        <button onClick={toggleFullscreen} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </button>
                    </div>
                </div>

                <Card className={`text-center ${isFullscreen ? 'border-0 shadow-none bg-transparent' : ''}`}>
                    {/* Mode Selector */}
                    <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-10">
                        {['25/5', '50/10', '90/20'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => handleModeChange(mode)}
                                disabled={timer.isActive}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${timer.mode === mode
                                    ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="px-3 py-2 text-slate-400 hover:text-slate-600 transition-colors border-l border-slate-200 dark:border-slate-700 ml-1"
                        >
                            <Settings size={16} />
                        </button>
                    </div>

                    {/* Timer Display */}
                    <div className="relative mb-12">
                        <svg className="w-80 h-80 mx-auto transform -rotate-90">
                            {/* Background Circle */}
                            <circle
                                cx="160"
                                cy="160"
                                r="148"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                className="text-slate-100 dark:text-slate-800"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="160"
                                cy="160"
                                r="148"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 148}`}
                                strokeDashoffset={`${2 * Math.PI * 148 * (1 - progress / 100)}`}
                                className={`transition-all duration-1000 ease-linear ${timer.isBreak
                                    ? 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                    : 'text-brand-600 drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                                    }`}
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className={`font-mono font-bold tracking-tight ${isFullscreen ? 'text-9xl' : 'text-7xl'} ${timer.isBreak ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                                }`}>
                                {formatTime(timer.timeRemaining)}
                            </div>

                            <div className={`mt-4 text-lg font-medium tracking-wide uppercase ${timer.isBreak ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                {timer.isBreak ? 'Rest & Recharge' : 'Deep Focus'}
                            </div>

                            {timer.currentSubject && !timer.isBreak && (
                                <Badge variant="neutral" size="lg" className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800">
                                    {getSubjectById(timer.currentSubject)?.name}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={handleReset}
                            className="p-4 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:text-slate-600"
                            title="Reset Timer"
                        >
                            <RotateCcw size={24} />
                        </button>

                        <button
                            onClick={handlePlayPause}
                            className={`p-6 rounded-full text-white shadow-lg transform transition-all hover:scale-105 active:scale-95 ${timer.isActive && !timer.isPaused
                                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                                : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/30'
                                }`}
                        >
                            {timer.isActive && !timer.isPaused ? (
                                <Pause size={32} fill="currentColor" />
                            ) : (
                                <Play size={32} fill="currentColor" className="ml-1" />
                            )}
                        </button>

                        <button
                            className="p-4 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:text-emerald-600"
                            title="Complete Early"
                            onClick={handleTimerComplete}
                            disabled={!timer.isActive}
                        >
                            <CheckCircle2 size={24} />
                        </button>
                    </div>

                    {/* Subject Selection */}
                    {!timer.isBreak && !timer.isActive && (
                        <div className="mt-10 max-w-xs mx-auto animate-fade-in">
                            <label className="block text-sm font-medium text-slate-500 mb-2">
                                What are you working on?
                            </label>
                            <select
                                value={timer.currentSubject || ''}
                                onChange={(e) => setTimer({ currentSubject: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="">Select a Subject</option>
                                {Object.values(SUBJECTS).slice(0, 11).map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
