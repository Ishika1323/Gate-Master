// Adaptive Learning Engine - Adjusts study plan based on performance

import { STUDY_PLAN_TOTAL_DAYS } from '../data/studyPlan';

export const adaptiveEngine = {
    // Adjust next day's load based on performance
    adjustNextDayLoad: (currentDay, pyqAttempts, sessions, studyPlan) => {
        const recentPYQs = pyqAttempts.slice(-5);

        if (recentPYQs.length === 0) {
            return { adjusted: false, message: 'No recent PYQ data to analyze' };
        }

        const avgAccuracy = recentPYQs.reduce((sum, a) => sum + (a.correct / a.total * 100), 0) / recentPYQs.length;

        // Low accuracy - add repair session
        if (avgAccuracy < 60) {
            return {
                adjusted: true,
                type: 'repair',
                message: `Accuracy is ${avgAccuracy.toFixed(0)}%. Adding repair session for weak topics.`,
                suggestion: 'Focus on understanding concepts before attempting more PYQs.',
                action: 'reduce_new_topics',
            };
        }

        // High accuracy - increase difficulty
        if (avgAccuracy > 80) {
            return {
                adjusted: true,
                type: 'advance',
                message: `Excellent accuracy of ${avgAccuracy.toFixed(0)}%! Ready for more challenging topics.`,
                suggestion: 'Try harder PYQs or move to advanced topics.',
                action: 'increase_difficulty',
            };
        }

        return {
            adjusted: false,
            message: `Good progress. Accuracy at ${avgAccuracy.toFixed(0)}%. Continue as planned.`,
        };
    },

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

    // Reschedule skipped sessions
    rescheduleSkippedSessions: (planProgress, currentDay) => {
        const skippedSessions = [];

        planProgress.forEach(dayPlan => {
            if (dayPlan.day < currentDay) {
                const incomplete = dayPlan.sessions.filter(s => !s.completed);
                if (incomplete.length > 0) {
                    skippedSessions.push({
                        day: dayPlan.day,
                        sessions: incomplete,
                    });
                }
            }
        });

        if (skippedSessions.length === 0) {
            return { hasSkipped: false };
        }

        // Calculate how many sessions to redistribute
        const totalSkipped = skippedSessions.reduce((sum, d) => sum + d.sessions.length, 0);

        return {
            hasSkipped: true,
            count: totalSkipped,
            message: `You have ${totalSkipped} skipped session(s). Consider adding 1-2 extra sessions over the next few days.`,
            suggestion: 'Use evening slots or extend existing sessions by 30 minutes.',
        };
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
    identifyWeakAreas: (pyqAttempts, subjectStats) => {
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

    // Suggest study intensity for today
    suggestIntensity: (currentDay, sessions) => {
        const daysRemaining = STUDY_PLAN_TOTAL_DAYS - currentDay;
        const recentSessions = sessions.slice(-7); // Last 7 sessions

        if (recentSessions.length === 0) {
            return { level: 'moderate', message: 'Start with moderate intensity' };
        }

        const avgDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length;

        // Check if user has been going hard
        if (avgDuration > 90 && recentSessions.length >= 5) {
            return {
                level: 'lighter',
                message: 'You\'ve been working hard! Consider lighter sessions today to avoid burnout.',
            };
        }

        if (daysRemaining <= 21) {
            return {
                level: 'moderate',
                message: 'Exam window approaching — favor revision and mock analysis over brand-new theory.',
            };
        }

        return {
            level: 'high',
            message: 'Good time for intense study sessions. Build momentum!',
        };
    },
};
