import React, { useState } from 'react';
import Card from '../UI/Card';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Brain } from 'lucide-react';
import { SYLLABUS_DATA } from '../../data/syllabus';

/**
 * SubjectProgressGrid
 * 
 * Syncs directly with SYLLABUS_DATA + completedSyllabusTopics/completedPyqTopics
 * from useAppStore — the same IDs used by SyllabusPage.
 * 
 * ID format: `${section.id}-${topic.id}-${subtopicIndex}`
 */
export default function SubjectProgressGrid({ completedSyllabusTopics = [], completedPyqTopics = [] }) {
    const { toggleSyllabusTopic } = useAppStore();
    const [expandedIds, setExpandedIds] = useState(new Set());

    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            // "When one is expand only expand that" - enforce single-open on click
            if (prev.has(id) && prev.size === 1) {
                return new Set();
            }
            return new Set([id]);
        });
    };

    const toggleAll = () => {
        if (expandedIds.size === SYLLABUS_DATA.length) {
            setExpandedIds(new Set());
        } else {
            setExpandedIds(new Set(SYLLABUS_DATA.map(s => s.id)));
        }
    };

    // Compute per-section (subject) stats using canonical SYLLABUS_DATA IDs
    const subjects = SYLLABUS_DATA.map(section => {
        let totalSubtopics = 0;
        let completedConcepts = 0;
        let completedPyqs = 0;
        const topicsWithStatus = [];

        section.topics.forEach(topic => {
            topic.subtopics.forEach((subtopic, idx) => {
                const uid = `${section.id}-${topic.id}-${idx}`;
                totalSubtopics++;
                const conceptsDone = completedSyllabusTopics.includes(uid);
                const pyqsDone = completedPyqTopics.includes(uid);
                if (conceptsDone) completedConcepts++;
                if (pyqsDone) completedPyqs++;
                topicsWithStatus.push({ uid, label: subtopic, conceptsDone, pyqsDone, topicGroup: topic.title });
            });
        });

        const conceptPct = totalSubtopics > 0 ? Math.round((completedConcepts / totalSubtopics) * 100) : 0;
        const pyqPct = totalSubtopics > 0 ? Math.round((completedPyqs / totalSubtopics) * 100) : 0;

        // Color coding based on concept completion
        let ringColor = '#ef4444'; // red
        let badgeClass = 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
        if (conceptPct >= 70) {
            ringColor = '#10b981';
            badgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
        } else if (conceptPct >= 30) {
            ringColor = '#f59e0b';
            badgeClass = 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
        }

        return {
            id: section.id,
            name: section.title,
            totalSubtopics,
            completedConcepts,
            completedPyqs,
            conceptPct,
            pyqPct,
            ringColor,
            badgeClass,
            topicsWithStatus
        };
    });

    return (
        <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Brain className="text-brand-500" size={20} />
                    Subject-wise Mastery
                </h3>
                <button 
                    onClick={toggleAll}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                    {expandedIds.size === subjects.length ? 'Collapse All' : 'Expand All'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {subjects.map(subj => {
                    const isExpanded = expandedIds.has(subj.id);
                    const circumference = 2 * Math.PI * 20; // r=20

                    return (
                        <div
                            key={subj.id}
                            className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                        >
                            {/* Header row */}
                            <button
                                className="w-full flex items-center gap-3 p-3 text-left"
                                onClick={() => toggleExpand(subj.id)}
                            >
                                {/* SVG Circular Progress */}
                                <div className="shrink-0 relative w-12 h-12">
                                    <svg width="48" height="48" viewBox="0 0 48 48">
                                        <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="5" />
                                        <circle
                                            cx="24" cy="24" r="20"
                                            fill="none"
                                            stroke={subj.ringColor}
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={circumference - (subj.conceptPct / 100) * circumference}
                                            transform="rotate(-90 24 24)"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200">
                                        {subj.conceptPct}%
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate pr-1" title={subj.name}>
                                        {subj.name}
                                    </h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] text-slate-500">
                                            {subj.completedConcepts}/{subj.totalSubtopics} topics
                                        </span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${subj.badgeClass}`}>
                                            PYQ {subj.pyqPct}%
                                        </span>
                                    </div>
                                    {/* PYQ bar */}
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${subj.pyqPct}%`,
                                                backgroundColor: subj.pyqPct >= 60 ? '#3b82f6' : '#f59e0b'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="text-slate-400 shrink-0">
                                    <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            {/* Expanded topic list with fluid transition */}
                            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                <div className="overflow-hidden">
                                    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-3 space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                                        {subj.topicsWithStatus.map(t => (
                                            <div 
                                                key={t.uid} 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSyllabusTopic(t.uid);
                                                }}
                                                className="group flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all"
                                            >
                                                <div className="shrink-0 transition-transform group-active:scale-90">
                                                    {t.conceptsDone
                                                        ? <CheckCircle size={16} className="text-emerald-500" />
                                                        : <Circle size={16} className="text-slate-300 dark:text-slate-600" />
                                                    }
                                                </div>
                                                <span className={`text-xs flex-1 select-none transition-colors ${t.conceptsDone ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200 font-medium'}`}>
                                                    {t.label}
                                                </span>
                                                {t.pyqsDone && (
                                                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded shadow-sm shrink-0">PYQ✓</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
