import { Lightbulb, CheckCircle2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { taskSuggester } from '../../ai/taskSuggester';
import TaskCard from './TaskCard';

export default function TaskList({ tasks }) {
    const { pyqAttempts, currentDay } = useAppStore();

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                    <CheckCircle2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">All caught up!</h3>
                <p className="text-slate-500 mt-1">No tasks matching your filters.</p>
            </div>
        );
    }

    // Get AI suggestions
    const incompleteTasks = tasks.filter(t => !t.completed);
    const suggestedTasks = taskSuggester.getSuggestedTasks(
        incompleteTasks,
        pyqAttempts,
        currentDay,
        {},
        3
    );

    const suggestedIds = new Set(suggestedTasks.map(s => s.task.id));

    return (
        <div className="space-y-8 animate-slide-up">
            {/* AI Suggested Section */}
            {suggestedTasks.length > 0 && (
                <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-1 border border-amber-100 dark:border-amber-900/20">
                    <div className="flex items-center space-x-2 px-3 py-2">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        <h3 className="font-semibold text-slate-900 dark:text-white">Recommended for You</h3>
                    </div>
                    <div className="space-y-3 p-2">
                        {suggestedTasks.map(({ task, reasons }) => (
                            <TaskCard key={task.id} task={task} aiReason={reasons} highlighted={true} />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Tasks */}
            {tasks.filter(t => !suggestedIds.has(t.id)).length > 0 && (
                <div>
                    {suggestedTasks.length > 0 && <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white px-1">Other Tasks</h3>}
                    <div className="space-y-3">
                        {tasks
                            .filter(t => !suggestedIds.has(t.id))
                            .map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
