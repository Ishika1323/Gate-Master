import { useState, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock, AlertTriangle, ChevronDown, ArrowRight } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import { STUDY_PLAN_TOTAL_DAYS } from '../../data/studyPlan';
import { useMasterStudyPlan } from '../../hooks/useMasterStudyPlan';
import { getSubjectById } from '../../data/subjects';
import useAppStore from '../../store/useAppStore';
import { buildMergedScheduleRows, countCompletedInRows, getBacklogDistributionSummary } from '../../utils/adaptiveSchedule';
import { getEffectiveToday } from '../../utils/dayBoundary';

export default function StudyPlanPage() {
    const { currentDay, planProgress, toggleSessionComplete, initializeCurrentDay } =
        useAppStore();
    const studyPlan = useMasterStudyPlan();
    const [viewDay, setViewDay] = useState(currentDay);

    // Initialize current day on mount and sync viewDay with currentDay
    useEffect(() => {
        initializeCurrentDay();
        const store = useAppStore.getState();
        setViewDay(store.currentDay);
    }, [initializeCurrentDay]);

    // Sync viewDay when store's currentDay changes
    useEffect(() => {
        setViewDay(currentDay);
    }, [currentDay]);

    const dayPlan = useMemo(() => 
        studyPlan.find((d) => d.day === viewDay) || studyPlan[0], 
    [studyPlan, viewDay]);

    // Group study plan by months for the calendar view
    const months = useMemo(() => {
        const groups = {};
        studyPlan.forEach((day) => {
            const date = new Date(day.date);
            const key = `${date.getFullYear()}-${date.getMonth()}`; // month is 0-indexed
            if (!groups[key]) {
                groups[key] = {
                    name: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    days: [],
                };
            }
            groups[key].days.push(day);
        });
        return Object.values(groups);
    }, [studyPlan]);

    const [monthIdx, setMonthIdx] = useState(0);

    // Initialize active month to the month containing today/currentDay
    useEffect(() => {
        const today = getEffectiveToday();
        const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
        const monthIndex = months.findIndex(m => {
            const firstDay = new Date(m.days[0].date);
            return `${firstDay.getFullYear()}-${firstDay.getMonth()}` === currentMonthKey;
        });
        
        if (monthIndex !== -1) {
            setMonthIdx(monthIndex);
        } else {
            // Fallback to month of dayPlan
            const dayDate = new Date(dayPlan.date);
            const dayMonthKey = `${dayDate.getFullYear()}-${dayDate.getMonth()}`;
            const idx = months.findIndex(m => {
                const firstDay = new Date(m.days[0].date);
                return `${firstDay.getFullYear()}-${firstDay.getMonth()}` === dayMonthKey;
            });
            if (idx !== -1) setMonthIdx(idx);
        }
    }, [months]); // Run when months are ready

    const currentMonth = months[monthIdx] || (months.length > 0 ? months[0] : { name: 'Plan', days: [] });

    // Helper to format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Helper to get day of month from date string
    const getDayOfMonth = (dateString) => {
        const date = new Date(dateString);
        return date.getDate();
    };

    const isSourceSessionDone = (dayNum, sessionId) => {
        const dayProg = planProgress.find(p => p.day === dayNum);
        return dayProg?.sessions.find(s => s.id === sessionId)?.completed || false;
    };

    // Helper to get day completion status
    const getDayCompletion = (dayNum) => {
        const dayProg = planProgress.find(p => p.day === dayNum);
        if (!dayProg) return 0;
        const total = studyPlan.find((d) => d.day === dayNum)?.sessions.length || 0;
        if (total === 0) return 0;
        const completed = dayProg.sessions.filter(s => s.completed).length;
        if (completed === total) return 2; // Full
        if (completed > 0) return 1; // Partial
        return 0; // None
    };

    // Analytics: merged agenda (carry-over + native sessions) for the viewed day
    const getMergedDayStats = (dayNum) => {
        const { mergedRows } = buildMergedScheduleRows(dayNum, currentDay, planProgress, studyPlan);
        const totalSessions = mergedRows.length;
        const completedSessions = countCompletedInRows(mergedRows, planProgress);
        const pendingSessions = Math.max(totalSessions - completedSessions, 0);
        const completionPercent = totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0;

        return { totalSessions, completedSessions, pendingSessions, completionPercent };
    };

    const getOverallStats = () => {
        const totalSessions = studyPlan.reduce((sum, day) => sum + day.sessions.length, 0);
        const completedSessions = planProgress.reduce(
            (sum, dayProg) => sum + (dayProg.sessions?.filter(s => s.completed).length || 0),
            0
        );
        const pendingSessions = Math.max(totalSessions - completedSessions, 0);
        const completionPercent = totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0;

        return { totalSessions, completedSessions, pendingSessions, completionPercent };
    };

    if (!dayPlan) return null;

    const {
        mergedRows,
        assignedCarryCount,
        backlogTotal,
        spreadStart,
        spreadEnd,
    } = buildMergedScheduleRows(viewDay, currentDay, planProgress, studyPlan);

    const currentDayStats = getMergedDayStats(viewDay);
    const overallStats = getOverallStats();

    // Backlog distribution summary — shows where all backlog items are scheduled
    const backlogSummary = useMemo(() => {
        if (backlogTotal === 0) return null;
        return getBacklogDistributionSummary(currentDay, planProgress, studyPlan);
    }, [currentDay, planProgress, studyPlan, backlogTotal]);

    const [showBacklogDetails, setShowBacklogDetails] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-brand-600" />
                        {STUDY_PLAN_TOTAL_DAYS}-Day Planner
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Full GATE CSE roadmap (~10.5 months): phased, subject-wise sessions with daily math, aptitude, and revision.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setViewDay(Math.max(1, viewDay - 1))}
                        disabled={viewDay === 1}
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md disabled:opacity-30 transition-shadow hover:shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <div className="px-4 text-center">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                            Day {viewDay}
                        </div>
                        {dayPlan && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                {formatDate(dayPlan.date)}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setViewDay(Math.min(STUDY_PLAN_TOTAL_DAYS, viewDay + 1))}
                        disabled={viewDay === STUDY_PLAN_TOTAL_DAYS}
                        className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-md disabled:opacity-30 transition-shadow hover:shadow-sm"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 items-start">
                {/* Main Content: Day Schedule */}
                <div className="flex-1 w-full space-y-6 min-w-0">
                    <Card className="border-t-4 border-t-brand-500">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Day {viewDay} Agenda
                                </h2>
                                {dayPlan.phase && (
                                    <p className="text-sm text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
                                        {dayPlan.phase}
                                    </p>
                                )}
                                {dayPlan.phaseSubtitle && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                                        {dayPlan.phaseSubtitle}
                                    </p>
                                )}
                                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                                    {formatDate(dayPlan.date)}
                                </p>
                                {backlogTotal > 0 && viewDay <= currentDay && (
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                                        <span className="font-semibold text-amber-700 dark:text-amber-300/90">
                                            {backlogTotal}
                                        </span>{' '}
                                        incomplete session{backlogTotal === 1 ? '' : 's'} from earlier days
                                        {assignedCarryCount > 0 ? (
                                            <> — <span className="font-semibold text-brand-600 dark:text-brand-400">{assignedCarryCount}</span> assigned to today, rest spread across days{' '}
                                            <span className="font-mono">{spreadStart}–{spreadEnd}</span>.</>
                                        ) : (
                                            <> are <span className="font-medium">spread evenly</span> across plan days{' '}
                                            <span className="font-mono">{spreadStart}–{spreadEnd}</span>.</>
                                        )}
                                    </p>
                                )}
                                {viewDay >= currentDay && assignedCarryCount > 0 && (
                                    <p className="text-xs text-amber-700 dark:text-amber-300/90 mt-2 max-w-2xl leading-relaxed">
                                        {viewDay === currentDay ? 'Today' : 'This day'} includes{' '}
                                        <span className="font-semibold">{assignedCarryCount}</span> catch-up
                                        block{assignedCarryCount === 1 ? '' : 's'} from your backlog (of{' '}
                                        {backlogTotal} total deferred — distributed across days {spreadStart}–
                                        {spreadEnd}). Marking done clears the original day's session.
                                    </p>
                                )}
                            </div>
                            {viewDay === currentDay && (
                                <Badge variant="primary" className="text-sm px-3 py-1">
                                    Today
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-4">
                            {mergedRows.map((row) => {
                                const subject = getSubjectById(row.subject);
                                const done = isSourceSessionDone(row.sourceDay, row.sourceSessionId);
                                const isCarry = row.kind === 'carry';
                                
                                // Session type labels and colors
                                const sessionTypeLabels = {
                                    'L1': { label: 'Lecture 1', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
                                    'L2': { label: 'Lecture 2', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
                                    'P1': { label: 'PYQ Session 1', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
                                    'P2': { label: 'PYQ Session 2', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
                                    'M':  { label: 'Eng. Math', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
                                    'R':  { label: 'Reflection', color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300' },
                                };
                                const meta = sessionTypeLabels[row.sourceSessionId] || { label: row.sourceSessionId, color: 'bg-slate-100 text-slate-600' };

                                const borderDone = done ? 'border-emerald-500' : '';
                                const borderIdle = isCarry
                                    ? 'border-amber-300 dark:border-amber-700/80 hover:border-amber-400'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-brand-300';

                                return (
                                    <div
                                        key={row.rowKey}
                                        className={`group relative pl-8 py-4 border-l-2 transition-all ${done ? borderDone : borderIdle}`}
                                    >
                                        <div className={`absolute -left-[9px] top-5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-800 transition-colors ${done
                                            ? 'border-emerald-500 text-emerald-500'
                                            : 'border-slate-300 dark:border-slate-600 text-transparent'
                                            }`}>
                                            {done && <div className="w-2 h-2 bg-emerald-500 rounded-full m-0.5" />}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                                    {isCarry && (
                                                        <Badge variant="warning" size="sm" className="text-[10px] uppercase tracking-wider">
                                                            Carry-over
                                                        </Badge>
                                                    )}
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.color}`}>
                                                        {meta.label}
                                                    </span>
                                                    {subject && <Badge variant="primary" size="sm">{subject.shortName}</Badge>}
                                                    {isCarry && (
                                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                                            was Day {row.sourceDay}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className={`font-semibold text-lg ${done ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                                                    {row.topics[0] || (subject ? subject.name : row.type.toUpperCase())}
                                                </h3>

                                                <div className="mt-2 space-y-1">
                                                    {row.topics.slice(1).map((topic, i) => (
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
                                                    {row.duration}m
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        toggleSessionComplete(row.sourceDay, row.sourceSessionId)
                                                    }
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
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Backlog Distribution Summary */}
                    {backlogSummary && backlogSummary.backlogTotal > 0 && viewDay === currentDay && (
                        <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20">
                            <button
                                onClick={() => setShowBacklogDetails(!showBacklogDetails)}
                                className="w-full flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    <div className="text-left">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                            Backlog Distribution
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            {backlogSummary.backlogTotal} session{backlogSummary.backlogTotal === 1 ? '' : 's'} spread across {backlogSummary.distribution.length} day{backlogSummary.distribution.length === 1 ? '' : 's'}
                                        </p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${showBacklogDetails ? 'rotate-180' : ''}`} />
                            </button>

                            {showBacklogDetails && (
                                <div className="mt-4 space-y-3 pt-4 border-t border-amber-200 dark:border-amber-800/40">
                                    {backlogSummary.distribution.map((entry) => (
                                        <div key={entry.day} className="rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setViewDay(entry.day); }}
                                                    className="flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline"
                                                >
                                                    {entry.day === currentDay ? (
                                                        <Badge variant="primary" size="sm">Today</Badge>
                                                    ) : (
                                                        <>Day {entry.day} <ArrowRight className="w-3.5 h-3.5" /></>
                                                    )}
                                                </button>
                                                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-full">
                                                    {entry.count} session{entry.count === 1 ? '' : 's'}
                                                </span>
                                            </div>
                                            <div className="space-y-1.5">
                                                {entry.items.map((item, idx) => {
                                                    const subj = getSubjectById(item.subject);
                                                    return (
                                                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                            <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-500 flex-shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                                    {subj ? subj.shortName : item.subject}
                                                                </span>
                                                                {item.topics.length > 0 && (
                                                                    <span className="text-slate-500"> · {item.topics[0]}</span>
                                                                )}
                                                                <span className="text-slate-400 ml-1">
                                                                    (from Day {item.sourceDay}, {item.duration}m)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    )}
                </div>

                {/* Right Column: Month-Paginated Calendar Grid */}
                <div className="w-full xl:w-[380px] shrink-0">
                    <Card className="sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-slate-400" /> Plan Overview
                            </h3>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setMonthIdx(Math.max(0, monthIdx - 1))}
                                    disabled={monthIdx === 0}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                </button>
                                <button
                                    onClick={() => setMonthIdx(Math.min(months.length - 1, monthIdx + 1))}
                                    disabled={monthIdx === months.length - 1}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30"
                                >
                                    <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>
                        </div>

                        <div className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300 text-center bg-slate-50 dark:bg-slate-800/50 py-1.5 rounded-md border border-slate-100 dark:border-slate-800/50">
                            {currentMonth.name}
                        </div>

                        <div className="grid grid-cols-7 gap-1.5">
                            {/* Empty cells to align first day of month if needed - for simplicity we just show the grid of study days */}
                            {currentMonth.days.map((day) => {
                                const status = getDayCompletion(day.day);
                                const isCurrent = day.day === currentDay;
                                const isPast = day.day < currentDay;
                                const isSelected = day.day === viewDay;

                                let bgClass = "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700";
                                if (status === 2) bgClass = "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"; // Full
                                else if (status === 1) bgClass = "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"; // Partial
                                else if (isPast && status === 0) bgClass = "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30"; // Passed & missed

                                if (isCurrent) bgClass += " ring-2 ring-brand-500 ring-offset-1 dark:ring-offset-slate-900";
                                if (isSelected) bgClass = "bg-brand-600 !text-white shadow-md transform scale-105 z-10 border-transparent";

                                const dayOfMonth = getDayOfMonth(day.date);

                                return (
                                    <button
                                        key={day.day}
                                        onClick={() => setViewDay(day.day)}
                                        className={`aspect-square min-h-[2.5rem] rounded-md text-[10px] sm:text-xs font-bold transition-all flex flex-col items-center justify-center ${bgClass}`}
                                        title={`Day ${day.day} - ${formatDate(day.date)}`}
                                    >
                                        <span className="text-sm">{dayOfMonth}</span>
                                        <span className="text-[9px] opacity-70 font-normal">Day {day.day}</span>
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
                                <div className="w-3 h-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30"></div>
                                <span>Missed Day (0% Done)</span>
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
