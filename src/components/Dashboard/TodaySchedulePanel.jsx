import React, { useState } from 'react';
import Card from '../UI/Card';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { Clock, CheckCircle2, Circle, Brain, BookOpen, Sparkles, XCircle, AlertTriangle, Target } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { buildMergedScheduleRows } from '../../utils/adaptiveSchedule';
import { getSubjectById } from '../../data/subjects';
import Badge from '../UI/Badge';
import { getEffectiveToday } from '../../utils/dayBoundary';

/**
 * TodaySchedulePanel
 *
 * Priority chain:
 *  1. If an AI override exists for today (from Gemini) → show those rich sessions
 *  2. Else → fall back to the built-in 311-day plan sessions via buildMergedScheduleRows
 *
 * NEW: Skip-session emergency flow
 *  - User clicks "Can't Complete" → modal for reason
 *  - After submitting, prompted to solve 25 PYQs on weakest topic
 *  - Skipped session is auto-rescheduled to Day +3
 */
export default function TodaySchedulePanel({ currentDay, dayPlan, planProgress, studyPlan }) {
    const {
        dailyTip,
        aiOverrides,
        handleSessionCompleteSync,
        toggleSessionComplete,
        skipSession,
        markPyqPenaltyDone,
        getWeakestSubject,
        skippedSessions,
    } = useAppStore();

    // Skip-session modal state
    const [skipModalOpen, setSkipModalOpen] = useState(false);
    const [skipTarget, setSkipTarget] = useState(null); // { day, sessionId, sessionData }
    const [skipReason, setSkipReason] = useState('');
    const [pyqPenaltyModal, setPyqPenaltyModal] = useState(false);
    const [pendingPenalty, setPendingPenalty] = useState(null);

    // Check if Gemini has generated an AI override for today
    const aiSchedule = aiOverrides?.[currentDay];

    // ── Fallback: use built-in plan ──────────────────────────────────────────
    const { mergedRows } = buildMergedScheduleRows(currentDay, currentDay, planProgress, studyPlan);

    const isSourceSessionDone = (dayNum, sessionId) => {
        const dayProg = planProgress.find(p => p.day === dayNum);
        return dayProg?.sessions?.find(s => s.id === sessionId)?.completed || false;
    };

    const handleToggle = (dayNum, sessionId) => {
        if (handleSessionCompleteSync) {
            handleSessionCompleteSync(dayNum, sessionId);
        } else {
            toggleSessionComplete(dayNum, sessionId);
        }
    };

    // ── AI override check: mark an AI session complete via schedule store ────
    const isAiSessionDone = (sessionId) => {
        const dayProg = planProgress.find(p => p.day === currentDay);
        return dayProg?.sessions?.find(s => s.id === sessionId)?.completed || false;
    };

    // ── Skip session handlers ───────────────────────────────────────────────
    const openSkipModal = (dayNum, sessionId, sessionData) => {
        setSkipTarget({ day: dayNum, sessionId, sessionData });
        setSkipReason('');
        setSkipModalOpen(true);
    };

    const handleSkipConfirm = () => {
        if (!skipTarget || !skipReason.trim()) return;

        const entry = skipSession(
            skipTarget.day,
            skipTarget.sessionId,
            skipReason.trim(),
            skipTarget.sessionData
        );

        setSkipModalOpen(false);
        setSkipTarget(null);
        setSkipReason('');

        // Show PYQ penalty modal
        setPendingPenalty(entry);
        setPyqPenaltyModal(true);
    };

    const handlePyqPenaltyComplete = () => {
        if (pendingPenalty) {
            markPyqPenaltyDone(pendingPenalty.id);
        }
        setPyqPenaltyModal(false);
        setPendingPenalty(null);
    };

    const weakestSubject = getWeakestSubject();
    const weakestSubjectDetails = getSubjectById(weakestSubject);

    // ── Determine mode ────────────────────────────────────────────────────────
    const useAiMode = !!(aiSchedule && aiSchedule.sessions?.length);

    // Session type labels and colors
    const sessionTypeLabels = {
        'L1': { label: 'Lecture 1', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
        'L2': { label: 'Lecture 2', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
        'P1': { label: 'PYQ Session 1', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
        'P2': { label: 'PYQ Session 2', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
        'M':  { label: 'Eng. Math', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
        'R':  { label: 'Reflection', color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300' },
    };

    const getSessionMeta = (sessionId) => {
        return sessionTypeLabels[sessionId] || { label: sessionId, color: 'bg-slate-100 text-slate-600' };
    };

    return (
        <>
            <Card className="h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock size={20} className="text-brand-500" />
                            Today's Schedule
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-1 pl-7">
                            {getEffectiveToday().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    {useAiMode && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/50">
                            <Sparkles size={10} /> Gemini AI
                        </span>
                    )}
                </div>

                {/* Gemini Optimization Note */}
                {(dailyTip || (useAiMode && aiSchedule.optimizationNote)) && (
                    <div className="mb-4 text-sm bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50 rounded-lg p-3 text-brand-800 dark:text-brand-300">
                        <div className="flex gap-2">
                            <Brain size={15} className="shrink-0 mt-0.5 text-brand-500" />
                            <span className="leading-relaxed text-xs">
                                <strong className="font-semibold mr-1">AI Note:</strong>
                                {useAiMode && aiSchedule.optimizationNote ? aiSchedule.optimizationNote : dailyTip}
                            </span>
                        </div>
                    </div>
                )}

                {/* ── AI Mode: Gemini-generated rich sessions ────────────────────── */}
                {useAiMode ? (
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        {aiSchedule.sessions.map((session, idx) => {
                            const sessionId = session.id || session.topicId;
                            const isCompleted = isAiSessionDone(sessionId);
                            const meta = getSessionMeta(sessionId);

                            return (
                                <div
                                    key={sessionId || idx}
                                    className={`p-3 rounded-lg border transition-all ${
                                        isCompleted
                                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-brand-300 dark:hover:border-brand-700'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <button
                                            onClick={() => handleToggle(currentDay, sessionId)}
                                            className={`shrink-0 mt-0.5 transition-colors ${isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-brand-500'}`}
                                        >
                                            {isCompleted
                                                ? <CheckCircle2 size={20} className="fill-emerald-500 text-white" />
                                                : <Circle size={20} />}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.color}`}>
                                                        {meta.label}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                        {session.subjectId}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                                    {session.duration}m
                                                </span>
                                            </div>
                                            <h5 className={`font-semibold text-sm mb-2 ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                                {session.topicName}
                                            </h5>
                                            {session.pyqsToSolve > 0 && (
                                                <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full w-fit">
                                                    <BookOpen size={9} /> {session.pyqsToSolve} PYQs
                                                </span>
                                            )}
                                        </div>
                                        {/* Skip button */}
                                        {!isCompleted && (
                                            <button
                                                onClick={() => openSkipModal(currentDay, sessionId, session)}
                                                className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                title="Can't complete"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* ── Fallback Mode: Built-in plan sessions ───────────────────── */
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        {mergedRows.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <BookOpen size={28} className="mb-3 opacity-50" />
                                <p className="text-sm">No sessions scheduled for today.</p>
                            </div>
                        )}
                        {mergedRows.map((row) => {
                            const subject = getSubjectById(row.subject);
                            const done = isSourceSessionDone(row.sourceDay, row.sourceSessionId);
                            const isCarry = row.kind === 'carry';
                            const meta = getSessionMeta(row.sourceSessionId);

                            return (
                                <div
                                    key={row.rowKey}
                                    className={`relative pl-6 py-3 border-l-2 transition-colors ${
                                        done ? 'border-emerald-500' :
                                        isCarry ? 'border-amber-400 dark:border-amber-700' :
                                        'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                                    }`}
                                >
                                    {/* Timeline dot */}
                                    <div className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-800 ${done ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                        {done && <div className="w-2 h-2 bg-emerald-500 rounded-full m-0.5" />}
                                    </div>

                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                {isCarry && <Badge variant="warning" size="sm" className="text-[9px]">Carry-over</Badge>}
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.color}`}>
                                                    {meta.label}
                                                </span>
                                                {subject && <Badge variant="primary" size="sm" className="text-[9px]">{subject.shortName}</Badge>}
                                                <span className="text-[10px] text-slate-400 font-mono">{row.duration}m</span>
                                            </div>
                                            <h4 className={`font-semibold text-sm ${done ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                                                {row.topics[0] || (subject ? subject.name : row.type.toUpperCase())}
                                            </h4>
                                            <div className="mt-1 space-y-0.5">
                                                {row.topics.slice(1, 3).map((t, i) => (
                                                    <p key={i} className={`text-xs truncate ${done ? 'text-slate-400 line-through' : 'text-slate-500 dark:text-slate-400'}`}>
                                                        {t}
                                                    </p>
                                                ))}
                                                {row.topics.length > 3 && (
                                                    <p className="text-xs text-slate-400">+{row.topics.length - 3} more…</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {/* Skip button */}
                                            {!done && (
                                                <button
                                                    onClick={() => openSkipModal(row.sourceDay, row.sourceSessionId, {
                                                        subject: row.subject,
                                                        topics: row.topics,
                                                        type: row.type,
                                                        duration: row.duration,
                                                    })}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Can't complete — skip with reason"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                            {/* Complete button */}
                                            <button
                                                onClick={() => handleToggle(row.sourceDay, row.sourceSessionId)}
                                                className={`shrink-0 p-2 rounded-lg transition-colors ${
                                                    done
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'
                                                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600'
                                                }`}
                                            >
                                                {done ? <CheckCircle2 size={20} /> : <Circle size={20} className="opacity-50" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer summary */}
                {useAiMode && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm font-medium text-slate-500">
                        <span>{aiSchedule.sessions.length} sessions</span>
                        <span className="text-brand-600 dark:text-brand-400">{aiSchedule.totalHours}h target</span>
                    </div>
                )}
            </Card>

            {/* ── Skip Session Modal ─────────────────────────────────────────── */}
            <Modal
                isOpen={skipModalOpen}
                onClose={() => { setSkipModalOpen(false); setSkipTarget(null); }}
                title="⚠️ Skip Session"
                size="sm"
            >
                <div className="space-y-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg">
                        <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                            You're about to skip a session. This will:
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-amber-700 dark:text-amber-400">
                            <li>• Require you to solve <strong>25 PYQs</strong> on your weakest topic</li>
                            <li>• Reschedule this session to <strong>Day {Math.min((useAppStore.getState().currentDay || 1) + 3, 310)}</strong></li>
                            <li>• Log the reason for your accountability review</li>
                        </ul>
                    </div>

                    {skipTarget && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                                Session: {getSessionMeta(skipTarget.sessionId).label}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {skipTarget.sessionData?.topics?.[0] || 'Study session'}
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Why can't you complete this session? <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={skipReason}
                            onChange={(e) => setSkipReason(e.target.value)}
                            placeholder="e.g., Medical emergency, family commitment, unexpected travel..."
                            rows={3}
                            className="input resize-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => { setSkipModalOpen(false); setSkipTarget(null); }}
                        >
                            Cancel
                        </Button>
                        <button
                            onClick={handleSkipConfirm}
                            disabled={!skipReason.trim()}
                            className="flex-1 btn btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Skip & Accept Penalty
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ── PYQ Penalty Modal ──────────────────────────────────────────── */}
            <Modal
                isOpen={pyqPenaltyModal}
                onClose={() => {}} // Can't close without completing
                title="🎯 PYQ Penalty — 25 Questions Required"
                size="sm"
            >
                <div className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg text-center">
                        <AlertTriangle size={32} className="text-red-500 mx-auto mb-2" />
                        <h4 className="text-lg font-bold text-red-800 dark:text-red-300">
                            Penalty: Solve 25 PYQs Now
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                            Since you skipped a session, you must practice on your weakest area.
                        </p>
                    </div>

                    <div className="p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-100 dark:bg-brand-900/40 rounded-lg">
                                <Target size={20} className="text-brand-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-brand-800 dark:text-brand-300">
                                    Target Subject: {weakestSubjectDetails?.name || weakestSubject}
                                </p>
                                <p className="text-xs text-brand-600 dark:text-brand-400">
                                    This is your weakest area based on PYQ accuracy & topic strength
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Instructions:</h5>
                        <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                            <li className="flex gap-2"><span className="font-bold text-brand-600">1.</span> Open GATE PYQ papers for <strong>{weakestSubjectDetails?.name || weakestSubject}</strong></li>
                            <li className="flex gap-2"><span className="font-bold text-brand-600">2.</span> Solve exactly <strong>25 questions</strong> under timed conditions</li>
                            <li className="flex gap-2"><span className="font-bold text-brand-600">3.</span> Log mistakes in your mistake notebook</li>
                            <li className="flex gap-2"><span className="font-bold text-brand-600">4.</span> Click "I've Completed 25 PYQs" below when done</li>
                        </ol>
                    </div>

                    {pendingPenalty && (
                        <div className="text-xs text-slate-500 text-center">
                            <p>Skipped reason: <em>"{pendingPenalty.reason}"</em></p>
                            <p>Session rescheduled to: <strong>Day {pendingPenalty.rescheduledTo}</strong></p>
                        </div>
                    )}

                    <button
                        onClick={handlePyqPenaltyComplete}
                        className="w-full btn btn-primary bg-emerald-600 hover:bg-emerald-700 py-3 text-base font-bold"
                    >
                        ✅ I've Completed 25 PYQs
                    </button>
                </div>
            </Modal>
        </>
    );
}
