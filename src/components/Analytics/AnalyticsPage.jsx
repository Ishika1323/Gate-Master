import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import useAppStore from '../../store/useAppStore';
import Card from '../UI/Card';
import { SUBJECTS } from '../../data/subjects';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';

export default function AnalyticsPage() {
    const { sessions, pyqAttempts, getSubjectFocusHours, getSubjectAccuracy } = useAppStore();

    // Subject-wise study hours
    const subjectHoursData = Object.values(SUBJECTS).map(subject => ({
        name: subject.shortName,
        hours: getSubjectFocusHours(subject.id),
        color: subject.color
    })).filter(d => d.hours > 0).sort((a, b) => b.hours - a.hours);

    // PYQ accuracy trend
    const accuracyTrend = pyqAttempts.map((attempt, idx) => ({
        attempt: idx + 1,
        accuracy: attempt.accuracy,
        subject: attempt.subject,
    }));

    // Subject-wise accuracy
    const subjectAccuracyData = Object.values(SUBJECTS)
        .map(subject => ({
            name: subject.shortName,
            accuracy: getSubjectAccuracy(subject.id),
            color: subject.color
        }))
        .filter(d => d.accuracy !== null)
        .sort((a, b) => b.accuracy - a.accuracy);

    const totalHours = sessions.reduce((sum, s) => sum + s.duration / 60, 0);
    const avgAccuracy = pyqAttempts.length > 0
        ? (pyqAttempts.reduce((sum, a) => sum + a.accuracy, 0) / pyqAttempts.length).toFixed(1)
        : 0;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg text-sm">
                    <p className="font-semibold mb-1">{label}</p>
                    <p className="text-brand-600 dark:text-brand-400">
                        {payload[0].value} {payload[0].dataKey === 'accuracy' ? '%' : 'hours'}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-brand-600" />
                        Performance Analytics
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Deep dive into your study habits and accuracy trends.
                    </p>
                </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="flex items-center gap-4 p-5 border-l-4 border-l-brand-600">
                    <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-full text-brand-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Focus</p>
                        <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{totalHours.toFixed(1)} <span className="text-sm font-sans font-normal text-slate-400">hrs</span></p>
                    </div>
                </Card>

                <Card className="flex items-center gap-4 p-5 border-l-4 border-l-emerald-500">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-emerald-600">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg Accuracy</p>
                        <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{avgAccuracy}%</p>
                    </div>
                </Card>

                <Card className="flex items-center gap-4 p-5 border-l-4 border-l-purple-500">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Sessions</p>
                        <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{sessions.length}</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Study Hours Chart */}
                <Card>
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        Study Distribution
                    </h2>
                    {subjectHoursData.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjectHoursData} layout="vertical" margin={{ left: 40, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        width={60}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                    <Bar dataKey="hours" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            No study sessions logged yet
                        </div>
                    )}
                </Card>

                {/* Accuracy Trend Chart */}
                <Card>
                    <h2 className="text-lg font-semibold mb-6">Accuracy Trend</h2>
                    {accuracyTrend.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={accuracyTrend}>
                                    <defs>
                                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="attempt" hide />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="accuracy"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorAccuracy)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            No PYQ attempts logged yet
                        </div>
                    )}
                </Card>

                {/* Subject Accuracy Comparison - Full Width */}
                <Card className="lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-6">Subject Proficiency</h2>
                    {subjectAccuracyData.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjectAccuracyData} margin={{ top: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <YAxis
                                        hide
                                        domain={[0, 100]}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                    <Bar dataKey="accuracy" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            No data available yet
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
