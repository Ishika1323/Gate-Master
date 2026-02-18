import { useState } from 'react';
import { Plus, Filter, ArrowUpDown } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

export default function TasksPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('priority');
    const { tasks } = useAppStore();

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        if (filter === 'pyq') return task.type === 'pyq';
        if (filter === 'revision') return task.type === 'revision';
        if (filter === 'reattempt') return task.reattemptRequired;
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            // Sort by priority desc, then completion status (incomplete first)
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        }
        if (sortBy === 'time') {
            return (a.estimatedTime || 0) - (b.estimatedTime || 0);
        }
        if (sortBy === 'subject') {
            return (a.subject || '').localeCompare(b.subject || '');
        }
        return 0;
    });

    const activeCount = tasks.filter(t => !t.completed).length;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tasks</h1>
                    <p className="text-slate-500 mt-1">
                        You have <span className="font-semibold text-brand-600">{activeCount}</span> active tasks remaining.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />}>
                    Add New Task
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-64 space-y-6">
                    {/* Filters Sidebar */}
                    <Card className="sticky top-24">
                        <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Filter size={16} /> Filters
                        </h3>
                        <div className="space-y-1">
                            {[
                                { id: 'all', label: 'All Tasks' },
                                { id: 'active', label: 'Active' },
                                { id: 'completed', label: 'Completed' },
                                { id: 'pyq', label: 'PYQs' },
                                { id: 'revision', label: 'Revision' },
                                { id: 'reattempt', label: 'Reattempts' }
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.id
                                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <div className="my-6 border-t border-slate-100 dark:border-slate-800"></div>

                        <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ArrowUpDown size={16} /> Sort By
                        </h3>
                        <div className="space-y-1">
                            {[
                                { id: 'priority', label: 'Priority' },
                                { id: 'time', label: 'Estimated Time' },
                                { id: 'subject', label: 'Subject' }
                            ].map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSortBy(s.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === s.id
                                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="flex-1">
                    {/* Task List */}
                    {sortedTasks.length > 0 ? (
                        <TaskList tasks={sortedTasks} />
                    ) : (
                        <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Plus className="text-slate-400" size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No tasks found</h3>
                            <p className="text-slate-500 mb-6">Create a new task to get started on your goals.</p>
                            <Button variant="outline" onClick={() => setIsModalOpen(true)}>Create Task</Button>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Task"
            >
                <TaskForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
}
