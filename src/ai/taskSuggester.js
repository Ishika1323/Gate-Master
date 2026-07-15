// AI Task Suggester - Analyzes tasks and recommends next best action

export const taskSuggester = {
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
};

// Helper function to calculate subject accuracy
function getSubjectAccuracy(subject, pyqAttempts) {
    const attempts = pyqAttempts.filter(a => a.subject === subject);
    if (attempts.length === 0) return null;

    const totalCorrect = attempts.reduce((sum, a) => sum + a.correct, 0);
    const totalQuestions = attempts.reduce((sum, a) => sum + a.total, 0);

    return totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
}
