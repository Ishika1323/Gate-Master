import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import { STUDY_PLAN } from '../../data/studyPlan';
import { getSubjectById } from '../../data/subjects';
import useAppStore from '../../store/useAppStore';

export default function StudyPlanPage() {
    const { currentDay, planProgress, toggleSessionComplete } = useAppStore();
    const [viewDay, setViewDay] = useState(currentDay);

    const dayPlan = STUDY_PLAN.find(d => d.day === viewDay);

    // Helper to check if a specific session is done
    const isSessionDone = (sessionId) => {
        const dayProg = planProgress.find(p => p.day === viewDay);
        return dayProg?.sessions.find(s => s.id === sessionId)?.completed || false;
    };

    // Helper to get day completion status
    const getDayCompletion = (dayNum) => {
        const dayProg = planProgress.find(p => p.day === dayNum);
        if (!dayProg) return 0;
        const total = STUDY_PLAN.find(d => d.day === dayNum)?.sessions.length || 0;
        if (total === 0) return 0;
        const completed = dayProg.sessions.filter(s => s.completed).length;
        if (completed === total) return 2; // Full
        if (completed > 0) return 1; // Partial
        return 0; // None
    };

    // Analytics helpers
    const getDayStats = (dayNum) => {
        const plan = STUDY_PLAN.find(d => d.day === dayNum);
        const dayProg = planProgress.find(p => p.day === dayNum);

        const totalSessions = plan?.sessions.length || 0;
        const completedSessions = dayProg?.sessions.filter(s => s.completed).length || 0;
        const pendingSessions = Math.max(totalSessions - completedSessions, 0);
        const completionPercent = totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0;

        return { totalSessions, completedSessions, pendingSessions, completionPercent };
    };

    const getOverallStats = () => {
        const totalSessions = STUDY_PLAN.reduce((sum, day) => sum + day.sessions.length, 0);
        const completedSessions = planProgress.reduce(
            (sum, dayProg) => sum + (dayProg.sessions?.filter(s => s.completed).length || 0),
            0
        );
        const pendingSessions = Math.max(totalSessions - completedSessions, 0);
        const completionPercent = totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0;

        return { totalSessions, completedSessions, pendingSessions, completionPercent };
    };

    if (!dayPlan) return null;

    const currentDayStats = getDayStats(viewDay);
    const overallStats = getOverallStats();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-brand-600" />
                        32-Day Plan
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-slate-500">
                            Your roadmap to GATE success.
                        </p>
                        <button
                            onClick={() => { useAppStore.getState().syncStudyPlan(); window.location.reload(); }}
                            className="text-xs text-brand-600 underline hover:text-brand-700"
                        >
                            (Fix Buttons)
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setViewDay(Math.max(1, viewDay - 1))}
                        disabled={viewDay === 1}
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md disabled:opacity-30 transition-shadow hover:shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <span className="px-4 font-mono font-bold text-slate-900 dark:text-white">
                        Day {viewDay}
                    </span>
                    <button
                        onClick={() => setViewDay(Math.min(32, viewDay + 1))}
                        disabled={viewDay === 32}
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md disabled:opacity-30 transition-shadow hover:shadow-sm"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Day Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-t-4 border-t-brand-500">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Day {viewDay} Agenda
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    {dayPlan.date}
                                </p>
                            </div>
                            {viewDay === currentDay && (
                                <Badge variant="primary" className="text-sm px-3 py-1">
                                    Today
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-4">
                            {dayPlan.sessions.map((session) => {
                                const subject = getSubjectById(session.subject);
                                const done = isSessionDone(session.id);

                                return (
                                    <div
                                        key={session.id}
                                        className={`group relative pl-8 py-4 border-l-2 transition-all ${done
                                            ? 'border-emerald-500'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                                            }`}
                                    >
                                        <div className={`absolute -left-[9px] top-5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-800 transition-colors ${done
                                            ? 'border-emerald-500 text-emerald-500'
                                            : 'border-slate-300 dark:border-slate-600 text-transparent'
                                            }`}>
                                            {done && <div className="w-2 h-2 bg-emerald-500 rounded-full m-0.5" />}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-mono text-sm text-slate-400">Session {session.id}</span>
                                                    <Badge variant="neutral" size="sm" className="uppercase tracking-wider text-[10px]">
                                                        {session.type}
                                                    </Badge>
                                                    {subject && <Badge variant="primary" size="sm">{subject.shortName}</Badge>}
                                                </div>

                                                <h3 className={`font-semibold text-lg ${done ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                                                    {subject ? subject.name : session.type.toUpperCase()}
                                                </h3>

                                                <div className="mt-2 space-y-1">
                                                    {session.topics.map((topic, i) => (
                                                        <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400"></span>
                                                            <span className={done ? 'line-through opacity-70' : ''}>{topic}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                                    <Clock className="w-4 h-4" />
                                                    {session.duration}m
                                                </div>

                                                {viewDay <= currentDay && (
                                                    <button
                                                        onClick={() => toggleSessionComplete(viewDay, session.id)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all w-full flex items-center justify-center gap-2 ${done
                                                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                            : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow-brand-500/20'
                                                            }`}
                                                    >
                                                        {done ? (
                                                            <>Completed <CheckCircle2 className="w-4 h-4" /></>
                                                        ) : (
                                                            <>Mark Done <Circle className="w-4 h-4 opacity-50" /></>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Calendar Grid */}
                <div>
                    <Card className="sticky top-24">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-slate-400" /> Plan Overview
                        </h3>

                        <div className="grid grid-cols-7 gap-2">
                            {STUDY_PLAN.map((day) => {
                                const status = getDayCompletion(day.day);
                                const isCurrent = day.day === currentDay;
                                const isSelected = day.day === viewDay;

                                let bgClass = "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700";
                                if (status === 2) bgClass = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"; // Full
                                else if (status === 1) bgClass = "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"; // Partial

                                if (isCurrent) bgClass += " ring-2 ring-brand-500 ring-offset-1 dark:ring-offset-slate-900";
                                if (isSelected) bgClass = "bg-brand-600 text-white shadow-md transform scale-105 z-10";

                                return (
                                    <button
                                        key={day.day}
                                        onClick={() => setViewDay(day.day)}
                                        className={`aspect-square rounded-md text-xs font-bold transition-all flex flex-col items-center justify-center ${bgClass}`}
                                        title={`Day ${day.day}`}
                                    >
                                        {day.day}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900/30"></div>
                                <span>Completed Day</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <div className="w-3 h-3 rounded bg-blue-50 dark:bg-blue-900/20"></div>
                                <span>In Progress</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <div className="w-3 h-3 rounded border-2 border-brand-500"></div>
                                <span>Current Day</span>
                            </div>
                        </div>

                        {/* Study Plan Analytics */}
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Study Plan Analytics
                            </h4>

                            {/* Current Day Stats */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                                    <p className="text-slate-500 mb-1">Day {viewDay} Sessions</p>
                                    <p className="font-mono text-sm text-slate-900 dark:text-white">
                                        {currentDayStats.completedSessions}/{currentDayStats.totalSessions}{' '}
                                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                                            ({currentDayStats.completionPercent}% done)
                                        </span>
                                    </p>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                                    <p className="text-slate-500 mb-1">Pending Today</p>
                                    <p className="font-mono text-sm text-amber-600 dark:text-amber-400">
                                        {currentDayStats.pendingSessions} session{currentDayStats.pendingSessions === 1 ? '' : 's'}
                                    </p>
                                </div>
                            </div>

                            {/* Overall Stats */}
                            <div className="space-y-2">
                                <p className="text-xs text-slate-500">Overall Plan Progress</p>
                                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-brand-500 transition-all"
                                        style={{ width: `${overallStats.completionPercent}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 flex justify-between">
                                    <span>
                                        {overallStats.completedSessions}/{overallStats.totalSessions} sessions done
                                    </span>
                                    <span className="font-mono text-slate-700 dark:text-slate-300">
                                        {overallStats.completionPercent}%
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
