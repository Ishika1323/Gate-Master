import { useState } from 'react';
import { BookOpen, AlertCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { SUBJECTS } from '../../data/subjects';
import { adaptiveEngine } from '../../ai/adaptiveEngine';

export default function PYQPage() {
    const { addPYQAttempt, pyqAttempts, tasks, sessions, mistakes, currentDay } = useAppStore();

    // Form State
    const [subject, setSubject] = useState('');
    const [year, setYear] = useState('');
    const [topic, setTopic] = useState('');
    const [correct, setCorrect] = useState('');
    const [total, setTotal] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!subject || !correct || !total) return;

        addPYQAttempt({
            date: new Date().toISOString(),
            subject,
            year: parseInt(year) || 2023,
            topic,
            correct: parseInt(correct),
            total: parseInt(total),
            notes
        });

        // Reset form
        setTopic('');
        setCorrect('');
        setTotal('');
        setNotes('');
    };

    // Derived State
    const accuracy = adaptiveEngine.calculateAccuracy(pyqAttempts, subject);
    const weakAreas = adaptiveEngine.identifyWeakAreas(pyqAttempts, {});
    const recentAttempts = [...pyqAttempts].reverse().slice(0, 5);

    const inputClasses = "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">PYQ Tracker</h1>
                <p className="text-slate-500 mt-1">
                    Log your Previous Year Question attempts to track accuracy and identify weak areas.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Log Form */}
                <div className="lg:col-span-1">
                    <Card>
                        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-brand-600" />
                            Log Attempt
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={labelClasses}>Subject</label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className={inputClasses}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {Object.values(SUBJECTS).map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClasses}>Year (Optional)</label>
                                <input
                                    type="number"
                                    placeholder="2023"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Topic</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Paging"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className={inputClasses}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>Correct</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={correct}
                                        onChange={(e) => setCorrect(e.target.value)}
                                        className={inputClasses}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>Total</label>
                                    <input
                                        type="number"
                                        placeholder="10"
                                        value={total}
                                        onChange={(e) => setTotal(e.target.value)}
                                        className={inputClasses}
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>Notes / Mistakes</label>
                                <textarea
                                    placeholder="What did you learn?"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className={`${inputClasses} min-h-[100px] resize-none`}
                                />
                            </div>

                            <Button type="submit" className="w-full" variant="primary">
                                Log Attempt
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Right Column: Stats & History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Weak Areas Alert */}
                    {weakAreas.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
                            <h3 className="text-red-700 dark:text-red-400 font-semibold mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Focus Needed
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {weakAreas.slice(0, 4).map((area, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-red-100 dark:border-red-900/20 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <span className="font-medium text-slate-800 dark:text-slate-200">{area.subject}</span>
                                            <Badge variant="danger" size="sm">{area.accuracy}%</Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">{area.recommendation}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent History */}
                    <Card>
                        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                            <RotateCcw className="w-5 h-5 text-slate-400" />
                            Recent Activity
                        </h2>

                        {recentAttempts.length > 0 ? (
                            <div className="space-y-4">
                                {recentAttempts.map((attempt, idx) => {
                                    const percentage = Math.round((attempt.correct / attempt.total) * 100);
                                    let statusColor = 'text-red-500';
                                    if (percentage >= 80) statusColor = 'text-green-500';
                                    else if (percentage >= 60) statusColor = 'text-amber-500';

                                    return (
                                        <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-slate-900 dark:text-white capitalize">
                                                            {attempt.subject}
                                                        </span>
                                                        {attempt.topic && (
                                                            <span className="text-slate-500 text-sm">• {attempt.topic}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-1">
                                                        {new Date(attempt.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className={`text-xl font-mono font-bold ${statusColor}`}>
                                                    {percentage}%
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm mt-3">
                                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    <span>{attempt.correct} Correct</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                    <span>{attempt.total - attempt.correct} Incorrect</span>
                                                </div>
                                            </div>

                                            {attempt.notes && (
                                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 italic">
                                                    "{attempt.notes}"
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                No attempts logged yet. Start practicing!
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
