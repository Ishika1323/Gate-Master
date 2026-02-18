import { useEffect } from 'react';
import { Calendar, Clock, TrendingUp, AlertCircle, Brain, Target, ArrowRight } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Badge from '../UI/Badge';
import { aiCoach } from '../../ai/aiCoach';
import { adaptiveEngine } from '../../ai/adaptiveEngine';
import { taskSuggester } from '../../ai/taskSuggester';
import { getDaysUntilExam } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

export default function ProgressDashboard() {
    const navigate = useNavigate();
    const {
        currentDay,
        tasks,
        pyqAttempts,
        sessions,
        mistakes,
        dailyTip,
        setDailyTip,
        completedSyllabusTopics // Select this
    } = useAppStore();

    // ...

    // Approx total subtopics is ~400 based on the data file. 
    // For exactness we could import SYLLABUS_DATA but for the dashboard summary 400 is a safe upper bound estimate for now to save imports
    // actually let's just show count
    const syllabusCount = completedSyllabusTopics.length;

    useEffect(() => {
        const tip = aiCoach.generateDailyTip(currentDay, tasks, pyqAttempts, sessions);
        setDailyTip(tip);
    }, [currentDay, tasks.length, pyqAttempts.length]);

    const daysUntilExam = getDaysUntilExam();
    const totalHours = sessions.reduce((sum, s) => sum + s.duration / 60, 0);
    const completedTasks = tasks.filter(t => t.completed).length;
    const readinessScore = adaptiveEngine.calculateReadinessScore(
        sessions,
        pyqAttempts,
        mistakes,
        currentDay,
        tasks
    );

    const recommendation = aiCoach.getDailyRecommendation(currentDay, {}, tasks);
    const strategicAdvice = aiCoach.getStrategicAdvice(currentDay);
    const weakAreas = adaptiveEngine.identifyWeakAreas(pyqAttempts, {});

    // Get AI suggested tasks (max 3)
    const suggestedTasks = taskSuggester.getSuggestedTasks(tasks, pyqAttempts, currentDay, {}, 3);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Welcome & Readiness */}
                <div className="lg:col-span-2">
                    <Card className="h-full bg-gradient-to-br from-brand-600 to-brand-800 text-white border-0 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-teal-400 opacity-10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                        <div className="relative z-10 p-2 flex flex-col h-full justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Ready to crush GATE? 🚀</h2>
                                <p className="text-brand-100 mb-6 max-w-lg">
                                    {dailyTip}
                                </p>
                            </div>

                            <div className="flex items-end gap-8">
                                <div>
                                    <div className="text-brand-200 text-sm font-medium mb-1 uppercase tracking-wider">Exam Readiness</div>
                                    <div className="text-5xl font-mono font-bold tracking-tighter">
                                        {readinessScore}%
                                    </div>
                                </div>

                                <div className="h-16 w-px bg-brand-500/50"></div>

                                <div>
                                    <div className="text-brand-200 text-sm font-medium mb-1 uppercase tracking-wider">Day</div>
                                    <div className="text-3xl font-mono font-bold">
                                        {currentDay}<span className="text-brand-300 text-lg">/32</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="stat-card bg-white dark:bg-slate-800">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                <Calendar size={18} />
                            </div>
                            <span className="text-xs font-medium text-slate-400">Days Left</span>
                        </div>
                        <div className="mt-3">
                            <div className="stat-value text-slate-900 dark:text-white">{daysUntilExam}</div>
                        </div>
                    </div>

                    <div className="stat-card bg-white dark:bg-slate-800">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                <Clock size={18} />
                            </div>
                            <span className="text-xs font-medium text-slate-400">Hours</span>
                        </div>
                        <div className="mt-3">
                            <div className="stat-value text-slate-900 dark:text-white">{totalHours.toFixed(1)}</div>
                        </div>
                    </div>

                    <div className="stat-card bg-white dark:bg-slate-800">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                                <Target size={18} />
                            </div>
                            <span className="text-xs font-medium text-slate-400">Tasks</span>
                        </div>
                        <div className="mt-3">
                            <div className="stat-value text-slate-900 dark:text-white">
                                {completedTasks}<span className="text-sm text-slate-400 font-normal">/{tasks.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card bg-white dark:bg-slate-800" onClick={() => navigate('/syllabus')}>
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                                <Brain size={18} />
                            </div>
                            <span className="text-xs font-medium text-slate-400">Syllabus</span>
                        </div>
                        <div className="mt-3">
                            <div className="stat-value text-slate-900 dark:text-white">
                                {syllabusCount} <span className="text-sm text-slate-400 font-normal">topics</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card bg-white dark:bg-slate-800 flex flex-col justify-center items-center cursor-pointer hover:border-brand-500 transition-colors" onClick={() => navigate('/timer')}>
                        <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-full mb-2">
                            <Clock size={20} />
                        </div>
                        <span className="text-sm font-medium text-brand-600">Start Study</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: AI Recommendations */}
                <div className="lg:col-span-2 space-y-6">
                    {/* AI Suggested Tasks */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Brain className="text-brand-600" size={20} />
                                AI Recommended Tasks
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')} className="text-brand-600">
                                View All <ArrowRight size={16} />
                            </Button>
                        </div>

                        <div className="grid gap-3">
                            {suggestedTasks.length > 0 ? suggestedTasks.map(({ task, reasons }) => (
                                <div key={task.id} className="group p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-all shadow-sm hover:shadow-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge size="sm" variant="neutral">{task.subject}</Badge>
                                                <Badge size="sm" variant="warning" className="bg-yellow-50 text-yellow-700 border border-yellow-100">AI Priority</Badge>
                                            </div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white">{task.title}</h4>
                                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                                <AlertCircle size={12} className="text-brand-500" /> {reasons}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-mono font-medium text-slate-700 dark:text-slate-300">
                                                {task.estimatedTime}<span className="text-sm text-slate-400">m</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                    <p className="text-slate-500">No pending tasks! Great job.</p>
                                    <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/tasks')}>Create Task</Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weak Areas */}
                    {weakAreas.length > 0 && (
                        <Card>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
                                <AlertCircle size={20} />
                                Focus Areas
                            </h3>
                            <div className="space-y-3">
                                {weakAreas.map((area, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                                        <div>
                                            <span className="font-medium text-red-900 dark:text-red-200">{area.subject}</span>
                                            <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">{area.recommendation}</p>
                                        </div>
                                        <div className="text-red-600 font-mono font-bold">
                                            {area.accuracy}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Column: Strategy & Phase */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Current Strategy</h3>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border-l-4 border-brand-500">
                                <div className="text-xs font-medium text-slate-500 mb-1">PHASE</div>
                                <div className="font-bold text-slate-900 dark:text-white capitalize text-lg">{recommendation.phase}</div>
                            </div>

                            <div>
                                <div className="text-xs font-medium text-slate-500 mb-1">FOCUS</div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{recommendation.focus}</p>
                            </div>

                            <div>
                                <div className="text-xs font-medium text-slate-500 mb-1">STRATEGIC ADVICE</div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    "{strategicAdvice}"
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Core Rules Card */}
                    <Card className="border-l-4 border-l-brand-600">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Target size={16} /> Core Rules
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">🎯 Non-Negotiables</h4>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-500 font-bold">•</span>
                                        <span>Solve PYQs timed</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-500 font-bold">•</span>
                                        <span>Maintain mistake notebook</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-500 font-bold">•</span>
                                        <span>Re-solve wrong Qs after 2 days</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-brand-500 font-bold">•</span>
                                        <span>No new sources/topics</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">⏰ Daily Structure (10.5h)</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded">
                                        <span className="font-medium">Sessions A, B, C (6h)</span>
                                        <span className="text-slate-500">Main Subject (2h each)</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded">
                                        <span className="font-medium">Session D (3h)</span>
                                        <span className="text-brand-600 font-medium">Engineering Math</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded">
                                        <span className="font-medium">Session E (1h)</span>
                                        <span className="text-slate-500">Aptitude (GATE + Job)</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded">
                                        <span className="font-medium">Session F (30m)</span>
                                        <span className="text-slate-500">Mistakes + Revision</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate('/pyq')}>Log PYQ</Button>
                            <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>Add Task</Button>
                            <Button variant="outline" size="sm" onClick={() => navigate('/plan')}>Study Plan</Button>
                            <Button variant="outline" size="sm" onClick={() => navigate('/analytics')}>Analytics</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
