// AI Task Suggester - Analyzes tasks and recommends next best action

export const taskSuggester = {
    // Get the single next best task with reasoning
    getNextBestTask: (tasks, pyqAttempts, currentDay, subjectStats) => {
        const incompleteTasks = tasks.filter(t => !t.completed);

        if (incompleteTasks.length === 0) {
            return null;
        }

        // Scoring system
        const scoredTasks = incompleteTasks.map(task => {
            let score = 0;
            let reasons = [];

            // 1. Reattempt required (highest priority)
            if (task.reattemptRequired) {
                score += 100;
                reasons.push('Flagged for reattempt');
            }

            // 2. High priority
            if (task.priority === 'high') {
                score += 50;
                reasons.push('High priority');
            } else if (task.priority === 'medium') {
                score += 25;
            }

            // 3. High exam weight
            if (task.examWeight === 'high') {
                score += 40;
                reasons.push('High exam weight');
            } else if (task.examWeight === 'medium') {
                score += 20;
            }

            // 4. Low accuracy subject
            const subjectAccuracy = getSubjectAccuracy(task.subject, pyqAttempts);
            if (subjectAccuracy !== null && subjectAccuracy < 60) {
                score += 60;
                reasons.push(`Low accuracy in ${task.subject} (${subjectAccuracy.toFixed(0)}%)`);
            }

            // 5. PYQ type tasks are important
            if (task.type === 'pyq') {
                score += 30;
                reasons.push('PYQ practice');
            }

            // 6. Overdue (if we had due dates)
            // Placeholder for future enhancement

            // 7. Time estimate - prefer manageable tasks
            if (task.estimatedTime && task.estimatedTime <= 60) {
                score += 10;
                reasons.push('Quick task');
            }

            return {
                task,
                score,
                reasons,
            };
        });

        // Sort by score descending
        scoredTasks.sort((a, b) => b.score - a.score);

        const bestTask = scoredTasks[0];
        return {
            task: bestTask.task,
            reasoning: bestTask.reasons.join(', '),
            score: bestTask.score,
        };
    },

    // Get top N suggested tasks
    getSuggestedTasks: (tasks, pyqAttempts, currentDay, subjectStats, count = 3) => {
        const incompleteTasks = tasks.filter(t => !t.completed);

        if (incompleteTasks.length === 0) {
            return [];
        }

        const scoredTasks = incompleteTasks.map(task => {
            let score = 0;
            let reasons = [];

            if (task.reattemptRequired) {
                score += 100;
                reasons.push('Needs reattempt');
            }

            if (task.priority === 'high') {
                score += 50;
                reasons.push('High priority');
            } else if (task.priority === 'medium') {
                score += 25;
            }

            if (task.examWeight === 'high') {
                score += 40;
                reasons.push('High exam weight');
            } else if (task.examWeight === 'medium') {
                score += 20;
            }

            const subjectAccuracy = getSubjectAccuracy(task.subject, pyqAttempts);
            if (subjectAccuracy !== null && subjectAccuracy < 60) {
                score += 60;
                reasons.push(`Weak in ${task.subject}`);
            }

            if (task.type === 'pyq') {
                score += 30;
                reasons.push('PYQ');
            }

            if (task.estimatedTime && task.estimatedTime <= 45) {
                score += 10;
            }

            return {
                task,
                score,
                reasons: reasons.join(', '),
            };
        });

        scoredTasks.sort((a, b) => b.score - a.score);

        return scoredTasks.slice(0, count);
    },

    // Suggest tasks for a specific time block
    getTasksForTimeBlock: (tasks, availableMinutes) => {
        const incompleteTasks = tasks.filter(t => !t.completed && t.estimatedTime);

        return incompleteTasks.filter(t => t.estimatedTime <= availableMinutes)
            .sort((a, b) => {
                // Sort by priority first, then by estimated time
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                const aPriority = priorityOrder[a.priority] || 0;
                const bPriority = priorityOrder[b.priority] || 0;

                if (aPriority !== bPriority) {
                    return bPriority - aPriority;
                }

                return a.estimatedTime - b.estimatedTime;
            });
    },
};

// Helper function to calculate subject accuracy
function getSubjectAccuracy(subject, pyqAttempts) {
    const attempts = pyqAttempts.filter(a => a.subject === subject);
    if (attempts.length === 0) return null;

    const totalCorrect = attempts.reduce((sum, a) => sum + a.correct, 0);
    const totalQuestions = attempts.reduce((sum, a) => sum + a.total, 0);

    return totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
}
