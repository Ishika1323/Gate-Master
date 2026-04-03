import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { FileText, TrendingDown, TrendingUp, Minus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SYLLABUS_DATA } from '../../data/syllabus';

/**
 * PYQTrackerPanel
 * 
 * Reads pyqAttempts directly from useAppStore (passed as prop).
 * pyqAttempts shape: [{ id, subject, year, total, correct, incorrect, timestamp }]
 * 
 * Maps attempts onto SYLLABUS_DATA sections so IDs & names stay consistent
 * with the rest of the app.
 */
export default function PYQTrackerPanel({ pyqAttempts = [] }) {
    const navigate = useNavigate();

    const subjectStats = SYLLABUS_DATA.map(section => {
        // Match legacy subject IDs (ds, os, etc.) or numeric section IDs (1, 2, 3...)
        // pyqAttempts.subject may be the section.id ('1','2'...) or a short key
        const sectionAttempts = pyqAttempts.filter(a =>
            String(a.subject) === String(section.id) ||
            // Also match section title first word in lowercase (fallback for legacy data)
            a.subject?.toLowerCase() === section.title.split(' ')[0].toLowerCase()
        );

        let totalSolved = 0;
        let totalCorrect = 0;
        let lastAttemptedDate = null;

        sectionAttempts.forEach(a => {
            totalSolved += a.total || 0;
            totalCorrect += a.correct || 0;
            const d = new Date(a.timestamp);
            if (!lastAttemptedDate || d > lastAttemptedDate) lastAttemptedDate = d;
        });

        const accuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : null;
        
        // Count total subtopics as a proxy for "available PYQs"
        let totalSubtopics = 0;
        section.topics.forEach(t => { totalSubtopics += t.subtopics.length; });

        // Short display name — first 2 words
        const words = section.title.split(' ');
        const shortName = words.slice(0, 2).join(' ');

        return {
            id: section.id,
            name: shortName,
            fullName: section.title,
            totalAvailable: totalSubtopics,
            totalSolved,
            totalCorrect,
            accuracy,
            lastAttempted: lastAttemptedDate
                ? lastAttemptedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'Never',
            attempts: sectionAttempts.length
        };
    }).sort((a, b) => b.totalSolved - a.totalSolved);

    // Overall summary stats
    const overallSolved = subjectStats.reduce((s, x) => s + x.totalSolved, 0);
    const overallCorrect = subjectStats.reduce((s, x) => s + x.totalCorrect, 0);
    const overallAccuracy = overallSolved > 0 ? Math.round((overallCorrect / overallSolved) * 100) : 0;
    const subjectsTouched = subjectStats.filter(s => s.totalSolved > 0).length;

    return (
        <Card className="overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">PYQ Tracker</h3>
                        <p className="text-xs text-slate-500">Synced with your logged attempts</p>
                    </div>
                </div>
                <Button onClick={() => navigate('/pyq')} variant="primary" size="sm">
                    Log PYQ
                </Button>
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-3 mb-5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-center">
                    <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">{overallSolved}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Solved</div>
                </div>
                <div className="text-center border-x border-slate-200 dark:border-slate-700">
                    <div className={`text-xl font-bold font-mono ${overallAccuracy >= 70 ? 'text-emerald-600' : overallAccuracy >= 50 ? 'text-amber-600' : overallAccuracy > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        {overallSolved > 0 ? `${overallAccuracy}%` : '—'}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Accuracy</div>
                </div>
                <div className="text-center">
                    <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">{subjectsTouched}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Subjects</div>
                </div>
            </div>

            {overallSolved === 0 && (
                <div className="text-center py-8 text-slate-400">
                    <FileText size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No PYQ attempts logged yet.</p>
                    <p className="text-xs mt-1">Go to the <button onClick={() => navigate('/pyq')} className="text-brand-500 underline">PYQ page</button> to log your first attempt.</p>
                </div>
            )}

            {overallSolved > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 dark:bg-slate-800/50">
                                <th className="p-2.5 font-semibold rounded-tl-lg">Subject</th>
                                <th className="p-2.5 font-semibold text-center">Solved</th>
                                <th className="p-2.5 font-semibold text-center">Accuracy</th>
                                <th className="p-2.5 font-semibold text-center hidden sm:table-cell">Last Attempt</th>
                                <th className="p-2.5 font-semibold text-right rounded-tr-lg">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                            {subjectStats.filter(s => s.totalSolved > 0).map(stat => (
                                <tr key={stat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-2.5">
                                        <div className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[130px]" title={stat.fullName}>
                                            {stat.name}
                                        </div>
                                    </td>
                                    <td className="p-2.5 text-center">
                                        <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                                            {stat.totalSolved}
                                        </span>
                                        <span className="text-slate-400 text-xs"> / {stat.totalCorrect}✓</span>
                                    </td>
                                    <td className="p-2.5 text-center">
                                        <span className={`inline-flex px-2 py-0.5 rounded font-mono font-bold text-xs ${
                                            stat.accuracy >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            stat.accuracy >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                            {stat.accuracy}%
                                        </span>
                                    </td>
                                    <td className="p-2.5 text-center text-xs text-slate-500 hidden sm:table-cell">
                                        {stat.lastAttempted}
                                    </td>
                                    <td className="p-2.5 text-right">
                                        {stat.accuracy === null ? (
                                            <Minus className="text-slate-300 ml-auto" size={16} />
                                        ) : stat.accuracy >= 60 ? (
                                            <TrendingUp className="text-emerald-500 ml-auto" size={17} />
                                        ) : (
                                            <TrendingDown className="text-red-500 ml-auto" size={17} />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
}
