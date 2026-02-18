// AI Coach that provides daily tips, recommendations, and strategic advice

const motivationalMessages = [
    "You're making excellent progress! Stay focused and trust your preparation.",
    "Consistency is key. Every hour of focused study counts!",
    "Remember: Quality over quantity. Deep focus beats long hours.",
    "You're building knowledge brick by brick. Keep going!",
    "Trust the process. Your hard work will pay off.",
    "Stay disciplined. The exam is closer than you think!",
    "Your future self will thank you for the effort you're putting in today.",
];

const lowValueTopics = {
    early: ['Compiler Design - Advanced topics', 'TOC - Advanced Automata'],
    mid: ['Deep COA internals', 'Advanced Compiler Optimization'],
    late: ['New topics', 'Low-weight subjects', 'Deep theoretical concepts'],
};

export const aiCoach = {
    // Generate daily recommendation based on day and performance
    getDailyRecommendation: (currentDay, subjectStats, tasks) => {
        const daysRemaining = 32 - currentDay;

        if (currentDay <= 17) {
            return {
                phase: 'Phase 1: GATE PYQ Coverage',
                focus: 'Cover all listed topics daily. Solve timed PYQs. Build error notebook.',
                priority: 'Coverage + Accuracy',
            };
        } else if (currentDay <= 27) {
            return {
                phase: 'Phase 2: BARC PYQ + Repair',
                focus: 'Solve BARC sets. Identify and fix weak areas immediately. Re-solve wrong questions.',
                priority: 'Speed + Weak Area Fixing',
            };
        } else {
            return {
                phase: 'Phase 3: Final Revision',
                focus: 'Rapid revision of mistakes and formulas. No heavy solving. Sleep well.',
                priority: 'Confidence + Retention',
            };
        }
    },

    // Generate daily tip with task suggestions
    generateDailyTip: (currentDay, tasks, pyqAttempts, sessions) => {
        const incompleteTasks = tasks.filter(t => !t.completed);
        const highPriorityTasks = incompleteTasks.filter(t => t.priority === 'high');
        const reattemptTasks = incompleteTasks.filter(t => t.reattemptRequired);

        let tip = motivationalMessages[currentDay % motivationalMessages.length];

        // Add task-specific advice
        if (reattemptTasks.length > 0) {
            tip += `\n\n🔄 **Focus on reattempt tasks**: You have ${reattemptTasks.length} task(s) flagged for reattempt. Prioritize these to strengthen weak areas.`;
        }

        if (highPriorityTasks.length > 0) {
            tip += `\n\n⭐ **High priority**: ${highPriorityTasks.length} high-priority task(s) need your attention today.`;
        }

        // Check recent PYQ performance
        const recentPYQs = pyqAttempts.slice(-5);
        if (recentPYQs.length > 0) {
            const avgAccuracy = recentPYQs.reduce((sum, a) => sum + (a.correct / a.total * 100), 0) / recentPYQs.length;
            if (avgAccuracy < 60) {
                tip += `\n\n⚠️ **Alert**: Your recent PYQ accuracy is ${avgAccuracy.toFixed(0)}%. Slow down and focus on understanding rather than speed.`;
            } else if (avgAccuracy > 80) {
                tip += `\n\n🎯 **Great work**: Your PYQ accuracy is ${avgAccuracy.toFixed(0)}%! Consider increasing difficulty.`;
            }
        }

        return tip;
    },

    // Suggest what NOT to study based on time remaining
    suggestWhatNotToStudy: (currentDay) => {
        const daysRemaining = 32 - currentDay;

        if (daysRemaining > 20) {
            return lowValueTopics.early;
        } else if (daysRemaining > 10) {
            return lowValueTopics.mid;
        } else {
            return lowValueTopics.late;
        }
    },

    // Detect burnout based on session patterns
    detectBurnout: (sessions) => {
        const recentSessions = sessions.slice(-10);
        if (recentSessions.length < 5) return null;

        // Check for consecutive long sessions
        const longSessions = recentSessions.filter(s => s.duration > 120);
        if (longSessions.length === recentSessions.length) {
            return {
                detected: true,
                message: '⚠️ You\'ve been pushing hard! Consider taking shorter sessions or a longer break to avoid burnout.',
                suggestion: 'Try 25/5 Pomodoro instead of longer sessions for the next few hours.',
            };
        }

        // Check for irregular patterns (sessions at odd times)
        // This is simplified - in a real scenario, we'd check timestamps
        return null;
    },

    // Generate mini quiz for quick revision
    generateMiniQuiz: (subject) => {
        // This is a placeholder - in a full implementation, 
        // you'd have a question bank
        return {
            subject,
            questions: [
                'Quick quiz generated for ' + subject,
                'Review your notes and test yourself on key concepts',
            ],
        };
    },

    // Strategic advice based on exam proximity
    getStrategicAdvice: (currentDay) => {
        const daysRemaining = 32 - currentDay;

        if (daysRemaining <= 5) {
            return '🎯 Exam is very close. No new topics. Only revise what you know.';
        } else if (daysRemaining <= 10) {
            return '📚 Focus on PYQ patterns and formula revision. Speed practice is important.';
        } else if (daysRemaining <= 20) {
            return '💪 Perfect time for intensive practice. Build accuracy and speed together.';
        } else {
            return '🏗️ Foundation phase. Understand concepts deeply before moving to practice.';
        }
    },
};
