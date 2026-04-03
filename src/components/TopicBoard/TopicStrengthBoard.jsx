import { useState, useMemo, useCallback } from 'react';
import { Layers, ChevronDown, ChevronRight, GripVertical, AlertTriangle, RefreshCw, Zap, Search, BarChart3 } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import useAppStore from '../../store/useAppStore';
import { SYLLABUS_DATA } from '../../data/syllabus';

const COLUMNS = [
    { id: 'weak', label: 'Weak', icon: AlertTriangle, color: 'red', bgClass: 'bg-red-50 dark:bg-red-950/30', borderClass: 'border-red-200 dark:border-red-900/50', headerBg: 'bg-red-500', badgeBg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    { id: 'revision', label: 'Need Revision', icon: RefreshCw, color: 'amber', bgClass: 'bg-amber-50 dark:bg-amber-950/30', borderClass: 'border-amber-200 dark:border-amber-900/50', headerBg: 'bg-amber-500', badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    { id: 'strong', label: 'Strong', icon: Zap, color: 'emerald', bgClass: 'bg-emerald-50 dark:bg-emerald-950/30', borderClass: 'border-emerald-200 dark:border-emerald-900/50', headerBg: 'bg-emerald-500', badgeBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
];

function getSubjectColor(subjectTitle) {
    const colors = {
        'Engineering Mathematics': 'from-blue-500 to-indigo-600',
        'Programming': 'from-purple-500 to-violet-600',
        'Data Structures': 'from-cyan-500 to-teal-600',
        'Algorithms': 'from-green-500 to-emerald-600',
        'Digital Logic': 'from-yellow-500 to-orange-600',
        'Computer Organization': 'from-orange-500 to-red-600',
        'Operating Systems': 'from-red-500 to-pink-600',
        'Databases': 'from-pink-500 to-rose-600',
        'Computer Networks': 'from-sky-500 to-blue-600',
        'Theory of Computation': 'from-violet-500 to-purple-600',
        'Compiler Design': 'from-fuchsia-500 to-pink-600',
        'GATE DA': 'from-teal-500 to-cyan-600',
        'General Aptitude': 'from-slate-500 to-gray-600',
    };
    for (const [key, val] of Object.entries(colors)) {
        if (subjectTitle.includes(key)) return val;
    }
    return 'from-slate-500 to-gray-600';
}

export default function TopicStrengthBoard() {
    const { topicStrengths, setTopicStrength } = useAppStore();
    const [expandedSubjects, setExpandedSubjects] = useState({});
    const [dragData, setDragData] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubject, setFilterSubject] = useState('all');

    // Build flat topic list from syllabus
    const allTopics = useMemo(() => {
        const topics = [];
        SYLLABUS_DATA.forEach(section => {
            section.topics.forEach(topic => {
                topic.subtopics.forEach(subtopic => {
                    const key = `${section.id}::${topic.id}::${subtopic}`;
                    topics.push({
                        key,
                        sectionId: section.id,
                        sectionTitle: section.title,
                        topicId: topic.id,
                        topicTitle: topic.title,
                        subtopic,
                        strength: topicStrengths[key] || null,
                    });
                });
            });
        });
        return topics;
    }, [topicStrengths]);

    // Filter topics
    const filteredTopics = useMemo(() => {
        return allTopics.filter(t => {
            if (filterSubject !== 'all' && t.sectionId !== filterSubject) return false;
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                return t.subtopic.toLowerCase().includes(search) ||
                    t.topicTitle.toLowerCase().includes(search) ||
                    t.sectionTitle.toLowerCase().includes(search);
            }
            return true;
        });
    }, [allTopics, filterSubject, searchTerm]);

    // Group by column → subject → topic
    const columnData = useMemo(() => {
        const result = {};
        for (const col of COLUMNS) {
            const items = filteredTopics.filter(t => t.strength === col.id);
            // Group by section
            const bySection = {};
            items.forEach(item => {
                if (!bySection[item.sectionId]) {
                    bySection[item.sectionId] = { title: item.sectionTitle, topics: {} };
                }
                if (!bySection[item.sectionId].topics[item.topicId]) {
                    bySection[item.sectionId].topics[item.topicId] = { title: item.topicTitle, subtopics: [] };
                }
                bySection[item.sectionId].topics[item.topicId].subtopics.push(item);
            });
            result[col.id] = { items, bySection };
        }
        // Unassigned
        const unassigned = filteredTopics.filter(t => !t.strength);
        const bySection = {};
        unassigned.forEach(item => {
            if (!bySection[item.sectionId]) {
                bySection[item.sectionId] = { title: item.sectionTitle, topics: {} };
            }
            if (!bySection[item.sectionId].topics[item.topicId]) {
                bySection[item.sectionId].topics[item.topicId] = { title: item.topicTitle, subtopics: [] };
            }
            bySection[item.sectionId].topics[item.topicId].subtopics.push(item);
        });
        result['unassigned'] = { items: unassigned, bySection };
        return result;
    }, [filteredTopics]);

    // Stats
    const stats = useMemo(() => {
        const total = allTopics.length;
        const weak = allTopics.filter(t => t.strength === 'weak').length;
        const revision = allTopics.filter(t => t.strength === 'revision').length;
        const strong = allTopics.filter(t => t.strength === 'strong').length;
        const unassigned = total - weak - revision - strong;
        return { total, weak, revision, strong, unassigned };
    }, [allTopics]);

    const toggleSubject = useCallback((sectionId, columnId) => {
        const key = `${columnId}-${sectionId}`;
        setExpandedSubjects(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    // ── Drag & Drop handlers ──────────────────────────────────────────────
    const handleDragStart = useCallback((e, topicKey) => {
        setDragData(topicKey);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', topicKey);
    }, []);

    const handleDragOver = useCallback((e, columnId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(columnId);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOverColumn(null);
    }, []);

    const handleDrop = useCallback((e, columnId) => {
        e.preventDefault();
        const topicKey = e.dataTransfer.getData('text/plain') || dragData;
        if (topicKey && columnId !== 'unassigned') {
            setTopicStrength(topicKey, columnId);
        }
        setDragData(null);
        setDragOverColumn(null);
    }, [dragData, setTopicStrength]);

    const handleDragEnd = useCallback(() => {
        setDragData(null);
        setDragOverColumn(null);
    }, []);

    // Move topic via button click (for accessibility / mobile)
    const moveToColumn = useCallback((topicKey, targetColumn) => {
        setTopicStrength(topicKey, targetColumn);
    }, [setTopicStrength]);

    // ── Render a subtopic card ─────────────────────────────────────────
    const renderSubtopicCard = (item, columnId) => {
        const isDragging = dragData === item.key;
        return (
            <div
                key={item.key}
                draggable
                onDragStart={(e) => handleDragStart(e, item.key)}
                onDragEnd={handleDragEnd}
                className={`group relative flex items-start gap-2 px-3 py-2.5 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
                    isDragging
                        ? 'opacity-40 scale-95 border-brand-400 bg-brand-50 dark:bg-brand-900/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-sm'
                }`}
            >
                <GripVertical size={14} className="shrink-0 mt-0.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                        {item.subtopic}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                        {item.topicTitle}
                    </p>
                </div>
                {/* Quick-move buttons */}
                <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    {COLUMNS.filter(c => c.id !== columnId).map(col => (
                        <button
                            key={col.id}
                            onClick={() => moveToColumn(item.key, col.id)}
                            className={`p-1 rounded transition-colors ${
                                col.id === 'weak' ? 'hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500' :
                                col.id === 'revision' ? 'hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-500' :
                                'hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-500'
                            }`}
                            title={`Move to ${col.label}`}
                        >
                            <col.icon size={12} />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    // ── Render a section within a column ────────────────────────────────
    const renderSection = (sectionId, sectionData, columnId) => {
        const expandKey = `${columnId}-${sectionId}`;
        const isExpanded = expandedSubjects[expandKey] !== false; // default expanded
        const totalSubtopics = Object.values(sectionData.topics).reduce((s, t) => s + t.subtopics.length, 0);
        const gradient = getSubjectColor(sectionData.title);

        return (
            <div key={`${columnId}-${sectionId}`} className="mb-3">
                <button
                    onClick={() => toggleSubject(sectionId, columnId)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
                >
                    {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`} />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate flex-1 text-left">
                        {sectionData.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {totalSubtopics}
                    </span>
                </button>
                {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1.5">
                        {Object.entries(sectionData.topics).map(([topicId, topicData]) => (
                            <div key={topicId}>
                                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 py-1">
                                    {topicData.title}
                                </p>
                                <div className="space-y-1">
                                    {topicData.subtopics.map(item => renderSubtopicCard(item, columnId))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Layers className="w-8 h-8 text-brand-600" />
                        Topic Strength Board
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Drag topics between columns to track your mastery. Organized by subject & subtopic.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="stat-card bg-white dark:bg-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                        <BarChart3 size={14} className="text-brand-500" />
                        <span className="text-xs font-medium text-slate-400">Total</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">{stats.total}</div>
                </div>
                <div className="stat-card bg-white dark:bg-slate-800 border-l-2 border-l-red-500">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={14} className="text-red-500" />
                        <span className="text-xs font-medium text-slate-400">Weak</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-red-600">{stats.weak}</div>
                </div>
                <div className="stat-card bg-white dark:bg-slate-800 border-l-2 border-l-amber-500">
                    <div className="flex items-center gap-2 mb-1">
                        <RefreshCw size={14} className="text-amber-500" />
                        <span className="text-xs font-medium text-slate-400">Revision</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-amber-600">{stats.revision}</div>
                </div>
                <div className="stat-card bg-white dark:bg-slate-800 border-l-2 border-l-emerald-500">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap size={14} className="text-emerald-500" />
                        <span className="text-xs font-medium text-slate-400">Strong</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-emerald-600">{stats.strong}</div>
                </div>
                <div className="stat-card bg-white dark:bg-slate-800">
                    <div className="text-xs font-medium text-slate-400 mb-1">Unassigned</div>
                    <div className="text-2xl font-mono font-bold text-slate-400">{stats.unassigned}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                {stats.strong > 0 && (
                    <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                        style={{ width: `${(stats.strong / stats.total) * 100}%` }}
                        title={`Strong: ${stats.strong}`}
                    />
                )}
                {stats.revision > 0 && (
                    <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                        style={{ width: `${(stats.revision / stats.total) * 100}%` }}
                        title={`Revision: ${stats.revision}`}
                    />
                )}
                {stats.weak > 0 && (
                    <div
                        className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                        style={{ width: `${(stats.weak / stats.total) * 100}%` }}
                        title={`Weak: ${stats.weak}`}
                    />
                )}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-9"
                    />
                </div>
                <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="input sm:w-64"
                >
                    <option value="all">All Subjects</option>
                    {SYLLABUS_DATA.map(section => (
                        <option key={section.id} value={section.id}>{section.title}</option>
                    ))}
                </select>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {COLUMNS.map((col) => {
                    const data = columnData[col.id];
                    const isDragOver = dragOverColumn === col.id;
                    const Icon = col.icon;

                    return (
                        <div
                            key={col.id}
                            onDragOver={(e) => handleDragOver(e, col.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, col.id)}
                            className={`rounded-xl border-2 transition-all duration-200 ${col.bgClass} ${
                                isDragOver
                                    ? `${col.borderClass} ring-2 ring-offset-2 ring-${col.color}-400 dark:ring-offset-slate-900 scale-[1.01]`
                                    : `${col.borderClass}`
                            }`}
                        >
                            {/* Column Header */}
                            <div className={`${col.headerBg} px-4 py-3 rounded-t-[10px] flex items-center justify-between`}>
                                <div className="flex items-center gap-2 text-white">
                                    <Icon size={16} />
                                    <span className="font-bold text-sm">{col.label}</span>
                                </div>
                                <span className="bg-white/20 text-white text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                                    {data.items.length}
                                </span>
                            </div>

                            {/* Column Content */}
                            <div className="p-3 max-h-[60vh] overflow-y-auto min-h-[200px]">
                                {data.items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <Icon size={24} className="text-slate-300 dark:text-slate-600 mb-2" />
                                        <p className="text-sm text-slate-400 dark:text-slate-500">
                                            Drag topics here
                                        </p>
                                    </div>
                                ) : (
                                    Object.entries(data.bySection).map(([sectionId, sectionData]) =>
                                        renderSection(sectionId, sectionData, col.id)
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Unassigned Topics */}
            {columnData.unassigned?.items.length > 0 && (
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Layers size={20} className="text-slate-400" />
                            Unassigned Topics
                            <Badge variant="neutral" size="sm">{columnData.unassigned.items.length}</Badge>
                        </h3>
                        <p className="text-xs text-slate-500">Drag these into Weak, Need Revision, or Strong</p>
                    </div>
                    <div className="max-h-[40vh] overflow-y-auto">
                        {Object.entries(columnData.unassigned.bySection).map(([sectionId, sectionData]) =>
                            renderSection(sectionId, sectionData, 'unassigned')
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
