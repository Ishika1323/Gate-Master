import { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import Button from '../UI/Button';
import { SUBJECTS } from '../../data/subjects';

export default function TaskForm({ onClose, task = null }) {
    const { addTask, updateTask } = useAppStore();

    const [formData, setFormData] = useState({
        title: task?.title || '',
        subject: task?.subject || '',
        topic: task?.topic || '',
        priority: task?.priority || 'medium',
        estimatedTime: task?.estimatedTime || '',
        examWeight: task?.examWeight || 'medium',
        type: task?.type || 'general',
        reattemptRequired: task?.reattemptRequired || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.subject) {
            alert('Please fill in title and subject');
            return;
        }

        if (task) {
            updateTask(task.id, formData);
        } else {
            addTask(formData);
        }

        onClose();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const inputClasses = "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-400";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className={labelClasses}>
                    Task Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Solve 20 PYQs on Dynamic Programming"
                    className={inputClasses}
                    required
                    autoFocus
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className={labelClasses}>
                        Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                    >
                        <option value="">Select subject</option>
                        {Object.values(SUBJECTS).map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={labelClasses}>Topic</label>
                    <input
                        type="text"
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        placeholder="e.g., Dynamic Programming"
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                    <label className={labelClasses}>Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div>
                    <label className={labelClasses}>
                        Time (min)
                    </label>
                    <input
                        type="number"
                        name="estimatedTime"
                        value={formData.estimatedTime}
                        onChange={handleChange}
                        placeholder="60"
                        min="5"
                        max="300"
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label className={labelClasses}>Exam Weight</label>
                    <select
                        name="examWeight"
                        value={formData.examWeight}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <div>
                <label className={labelClasses}>Task Type</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={inputClasses}
                >
                    <option value="general">General Study</option>
                    <option value="pyq">PYQ Practice</option>
                    <option value="revision">Revision</option>
                </select>
            </div>

            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <input
                    type="checkbox"
                    name="reattemptRequired"
                    checked={formData.reattemptRequired}
                    onChange={handleChange}
                    id="reattemptRequired"
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="reattemptRequired" className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    Flag as 'Reattempt Required' (for difficult topics)
                </label>
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                    {task ? 'Update Task' : 'Create Task'}
                </Button>
            </div>
        </form>
    );
}
