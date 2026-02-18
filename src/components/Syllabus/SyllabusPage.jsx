import { useState, useMemo } from 'react';
import useAppStore from '../../store/useAppStore';
import { SYLLABUS_DATA } from '../../data/syllabus';
import Card from '../UI/Card';
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function SyllabusPage() {
    const { completedSyllabusTopics, toggleSyllabusTopic } = useAppStore();
    const [expandedSections, setExpandedSections] = useState({});
    const safeCompleted = completedSyllabusTopics || [];

    // Toggle section expansion
    const toggleSection = (id) => {
        setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Calculate Analytics
    const analytics = useMemo(() => {
        let totalItems = 0;
        let completedItems = 0;
        const sectionStats = [];

        SYLLABUS_DATA.forEach(section => {
            let sectionTotal = 0;
            let sectionCompleted = 0;

            section.topics.forEach(topic => {
                topic.subtopics.forEach((sub, idx) => {
                    const uniqueId = `${section.id}-${topic.id}-${idx}`;
                    sectionTotal++;
                    const safeCompleted = completedSyllabusTopics || [];
                    if (safeCompleted.includes(uniqueId)) {
                        sectionCompleted++;
                    }
                });
            });

            totalItems += sectionTotal;
            completedItems += sectionCompleted;
            sectionStats.push({
                id: section.id,
                title: section.title,
                total: sectionTotal,
                completed: sectionCompleted,
                percentage: sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0
            });
        });

        return {
            total: totalItems,
            completed: completedItems,
            percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
            sections: sectionStats
        };
    }, [completedSyllabusTopics]);

    const pieData = [
        { name: 'Completed', value: analytics.completed, color: '#10b981' },
        { name: 'Remaining', value: analytics.total - analytics.completed, color: '#e2e8f0' }
    ];

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            {/* Header / Analytics Dashboard */}
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-brand-600" />
                        Syllabus Tracker
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Track your coverage of the GATE CSE + DA Data Science syllabus.
                        Synced with your database for long-term progress.
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <Card className="p-4 border-l-4 border-l-brand-600">
                            <p className="text-sm text-slate-500 uppercase font-medium">Topic Coverage</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                {analytics.percentage}%
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {analytics.completed} / {analytics.total} Sub-topics
                            </p>
                        </Card>
                        <Card className="p-4 border-l-4 border-l-emerald-500">
                            <p className="text-sm text-slate-500 uppercase font-medium">Sections Started</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                {analytics.sections.filter(s => s.completed > 0).length} / {analytics.sections.length}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Active Study Areas</p>
                        </Card>
                    </div>
                </div>

                {/* Pie Chart */}
                <Card className="w-full md:w-64 flex flex-col items-center justify-center p-4">
                    <h3 className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-300">Overall Progress</h3>
                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePie>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={40}
                                    outerRadius={60}
                                    stroke="none"
                                    paddingAngle={2}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </RePie>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Syllabus Sections */}
            <div className="space-y-4">
                {SYLLABUS_DATA.map((section) => {
                    const stats = analytics.sections.find(s => s.id === section.id);
                    const isExpanded = expandedSections[section.id];

                    return (
                        <Card key={section.id} className="overflow-hidden">
                            {/* Section Header */}
                            <div
                                onClick={() => toggleSection(section.id)}
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${stats.percentage === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'} dark:bg-slate-800 dark:text-slate-400`}>
                                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                                            {section.title}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${stats.percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">{stats.percentage}% completed</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:block text-right">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {stats.completed}/{stats.total}
                                    </span>
                                </div>
                            </div>

                            {/* Topics & Subtopics (Collapsible) */}
                            {isExpanded && (
                                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-6">
                                    {section.topics.map((topic) => (
                                        <div key={topic.id} className="ml-2 sm:ml-6">
                                            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                                                {topic.title}
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
                                                {topic.subtopics.map((subtopic, idx) => {
                                                    const uniqueId = `${section.id}-${topic.id}-${idx}`;
                                                    const isChecked = safeCompleted.includes(uniqueId);

                                                    return (
                                                        <label
                                                            key={uniqueId}
                                                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isChecked
                                                                ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/30'
                                                                : 'bg-white border-slate-200 hover:border-brand-300 dark:bg-slate-800 dark:border-slate-700'
                                                                }`}
                                                        >
                                                            <div className="mt-0.5 relative">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleSyllabusTopic(uniqueId)}
                                                                    className="sr-only"
                                                                />
                                                                {isChecked ? (
                                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                                ) : (
                                                                    <Circle className="w-5 h-5 text-slate-400 group-hover:text-brand-400" />
                                                                )}
                                                            </div>
                                                            <span className={`text-sm select-none ${isChecked ? 'text-slate-700 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                                                {subtopic}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
