import React from 'react';
import { Trash2, Clock, Flag, RotateCcw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { getSubjectById } from '../../data/subjects';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Button from '../UI/Button';

export default function TaskCard({ task, aiReason, highlighted = false }) {
    const { toggleTask, deleteTask, updateTask } = useAppStore();
    const subject = getSubjectById(task.subject);

    const priorityConfig = {
        high: { color: 'red', icon: '🔴' },
        medium: { color: 'yellow', icon: '🟡' },
        low: { color: 'green', icon: '🟢' },
    };

    const setCompletionStatus = (status) => {
        // If status is boolean, it's a toggle. But here we want explicit set.
        // If task.completed is already the status, do nothing? 
        // The store's toggleTask just flips it. We might need a direct update if we have two buttons.
        // But since it's a binary state, we can check before toggling.
        if (task.completed !== status) {
            toggleTask(task.id);
        }
    };

    return (
        <Card
            className={`transition-all border-l-4 ${highlighted ? 'border-l-brand-500 bg-blue-50/30' :
                    task.completed ? 'border-l-emerald-500 opacity-75' :
                        `border-l-${priorityConfig[task.priority]?.color || 'gray'}-500`
                }`}
        >
            <div className="flex flex-col gap-3">
                {/* Header: Title and Subject */}
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-gray-900 dark:text-gray-100 truncate ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {subject && (
                                <Badge variant="neutral" size="sm">
                                    {subject.shortName}
                                </Badge>
                            )}
                            {task.type && (
                                <Badge variant="primary" size="sm">
                                    {task.type}
                                </Badge>
                            )}
                            {task.reattemptRequired && (
                                <Badge variant="warning" size="sm" className="flex items-center gap-1">
                                    <RotateCcw className="w-3 h-3" /> Reattempt
                                </Badge>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete Task"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* AI Reason Box */}
                {aiReason && !task.completed && (
                    <div className="bg-brand-50 dark:bg-brand-900/10 p-2 rounded text-xs text-brand-700 dark:text-brand-300 flex gap-2 items-start">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{aiReason}</span>
                    </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {task.estimatedTime && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{task.estimatedTime}m</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Flag className="w-3.5 h-3.5" />
                        <span className="capitalize">{task.priority}</span>
                    </div>
                    {task.examWeight && (
                        <div className="text-xs">
                            Weight: <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{task.examWeight}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 mt-1">
                    <Button
                        variant={task.completed ? "ghost" : "primary"}
                        size="sm"
                        className={`flex-1 ${task.completed ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10' : ''}`}
                        onClick={() => setCompletionStatus(true)}
                        disabled={task.completed}
                        icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                        {task.completed ? "Completed" : "Mark Complete"}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex-1 ${!task.completed ? 'text-gray-400' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10'}`}
                        onClick={() => setCompletionStatus(false)}
                        disabled={!task.completed}
                        icon={<XCircle className="w-4 h-4" />}
                    >
                        Not Completed
                    </Button>
                </div>
            </div>
        </Card>
    );
}
