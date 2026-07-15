// Adaptive Learning Engine - Adjusts study plan based on performance

export const adaptiveEngine = {
    // Calculate accuracy for a specific subject or overall
    calculateAccuracy: (pyqAttempts, subject = null) => {
        const attempts = subject
            ? pyqAttempts.filter(a => a.subject === subject)
            : pyqAttempts;

        if (attempts.length === 0) return 0;

        const totalCorrect = attempts.reduce((sum, a) => sum + a.correct, 0);
        const totalQuestions = attempts.reduce((sum, a) => sum + a.total, 0);

        return totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    },

    // Calculate exam readiness score (0-100)
    calculateReadinessScore: (sessions, pyqAttempts, mistakes, currentDay, tasks) => {
        let score = 0;

        // 1. Study hours (max 30 points) — ~4.5 h effective focus/day target over long plan
        const totalHours = sessions.reduce((sum, s) => sum + (s.duration / 60), 0);
        const dailyTargetHours = 4.5;
        const expectedHours = Math.max(1, currentDay) * dailyTargetHours;
        const hoursScore = Math.min(30, (totalHours / expectedHours) * 30);
        score += hoursScore;

        // 2. PYQ accuracy (max 35 points)
        if (pyqAttempts.length > 0) {
            const totalCorrect = pyqAttempts.reduce((sum, a) => sum + a.correct, 0);
            const totalQuestions = pyqAttempts.reduce((sum, a) => sum + a.total, 0);
            const accuracy = (totalCorrect / totalQuestions) * 100;
            const accuracyScore = (accuracy / 100) * 35;
            score += accuracyScore;
        }

        // 3. Task completion (max 20 points)
        const completedTasks = tasks.filter(t => t.completed).length;
        const totalTasks = tasks.length;
        if (totalTasks > 0) {
            const taskScore = (completedTasks / totalTasks) * 20;
            score += taskScore;
        } else {
            score += 10; // Partial credit if no tasks yet
        }

        // 4. Mistake reattempts (max 15 points)
        const reattemptedMistakes = mistakes.filter(m => m.reattempted).length;
        const totalMistakes = mistakes.length;
        if (totalMistakes > 0) {
            const mistakeScore = (reattemptedMistakes / totalMistakes) * 15;
            score += mistakeScore;
        } else {
            score += 15; // Full credit if no mistakes yet
        }

        return Math.round(Math.min(100, score));
    },

    // Identify weak areas needing attention
    identifyWeakAreas: (pyqAttempts) => {
        const weakAreas = [];

        // Group PYQs by subject
        const subjectGroups = {};
        pyqAttempts.forEach(attempt => {
            if (!subjectGroups[attempt.subject]) {
                subjectGroups[attempt.subject] = [];
            }
            subjectGroups[attempt.subject].push(attempt);
        });

        // Calculate accuracy per subject
        Object.keys(subjectGroups).forEach(subject => {
            const attempts = subjectGroups[subject];
            const totalCorrect = attempts.reduce((sum, a) => sum + a.correct, 0);
            const totalQuestions = attempts.reduce((sum, a) => sum + a.total, 0);
            const accuracy = (totalCorrect / totalQuestions) * 100;

            if (accuracy < 65) {
                weakAreas.push({
                    subject,
                    accuracy: accuracy.toFixed(1),
                    attempts: attempts.length,
                    recommendation: 'Needs focused revision and concept clarification',
                });
            }
        });

        return weakAreas.sort((a, b) => parseFloat(a.accuracy) - parseFloat(b.accuracy));
    },
};
