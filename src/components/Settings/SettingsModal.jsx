import React, { useMemo } from 'react';
import { Target, AlertTriangle } from 'lucide-react';
import Modal from '../UI/Modal';
import Badge from '../UI/Badge';
import useAppStore from '../../store/useAppStore';
import {
    WEAK_FOCUS_LEVELS,
    DEFAULT_WEAK_FOCUS,
    buildSubjectPriority,
    getPrioritizedWeakSubjects,
} from '../../ai/prioritization';

export default function SettingsModal({ isOpen, onClose }) {
    const {
        settings,
        updateSettings,
        topicStrengths,
        pyqAttempts,
        subjectStats,
        completedSyllabusTopics,
    } = useAppStore();

    const focus = settings.weakAreaFocus || DEFAULT_WEAK_FOCUS;

    // Live preview of which subjects the current focus would prioritize.
    const topWeak = useMemo(() => {
        const map = buildSubjectPriority({
            topicStrengths,
            pyqAttempts,
            subjectStats,
            completedSyllabusTopics,
            focus,
        });
        return getPrioritizedWeakSubjects(map).slice(0, 5);
    }, [topicStrengths, pyqAttempts, subjectStats, completedSyllabusTopics, focus]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="md">
            <div className="space-y-8">
                {/* AI Personalisation */}
                <section>
                    <div className="flex items-center gap-2 mb-1">
                        <Target size={18} className="text-brand-600" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            AI Personalisation
                        </h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Choose how strongly your weak topics are prioritized over completed ones.
                        This reshapes both your daily plan and the AI-generated schedule.
                    </p>

                    <div className="space-y-2">
                        {Object.values(WEAK_FOCUS_LEVELS).map((level) => {
                            const active = focus === level.key;
                            return (
                                <button
                                    key={level.key}
                                    onClick={() => updateSettings({ weakAreaFocus: level.key })}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                                        active
                                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500/40'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {level.label}
                                        </span>
                                        {active && <Badge variant="primary" size="sm">Active</Badge>}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {level.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Live preview of prioritized weak subjects */}
                <section>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <AlertTriangle size={15} className="text-amber-500" />
                        Currently prioritized
                    </h4>
                    {topWeak.length > 0 ? (
                        <div className="space-y-1.5">
                            {topWeak.map((s, idx) => (
                                <div
                                    key={s.subjectId}
                                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-xs font-mono text-slate-400 w-4">{idx + 1}</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                            {s.name}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[55%] text-right">
                                        {s.reasons.join(' · ') || 'weak zone'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            No weak areas yet. Mark topics on the Topic Board or log PYQ attempts and
                            they'll be prioritized here.
                        </p>
                    )}
                </section>
            </div>
        </Modal>
    );
}
