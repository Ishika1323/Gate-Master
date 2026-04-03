// AI Coach that provides daily tips, recommendations, and strategic advice

import { getStudyPlanPhase, STUDY_PLAN_TOTAL_DAYS } from '../data/studyPlan';

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
    // Generate daily recommendation based on day and performance (planStartISO = YYYY-MM-DD from store)
    getDailyRecommendation: (currentDay, subjectStats, tasks, planStartISO) => {
        const phase = getStudyPlanPhase(currentDay, planStartISO);
        const daysRemaining = STUDY_PLAN_TOTAL_DAYS - currentDay;

        if (phase.key === 'exam') {
            return {
                phase: phase.title,
                focus: 'Logistics, admit card, calm attempts — no new content.',
                priority: 'Execution + rest',
            };
        }
        if (phase.key === 'testseries') {
            return {
                phase: phase.title,
                focus: 'Timed tests in sheet order — strict timer, log scores, same-day solution pass on misses.',
                priority: 'Test discipline + error taxonomy',
            };
        }
        if (phase.key === 'wave') {
            return {
                phase: phase.title,
                focus: 'Monthly Deepak/Sachin grid: go deep on that window’s subjects + daily PYQ reps.',
                priority: 'Subject depth + timed MCQs',
            };
        }
        if (phase.key === 'ramp') {
            return {
                phase: phase.title,
                focus: 'Build rhythm: DS, algorithms, C, math touch-up until the structured wave months.',
                priority: 'Habits + foundations',
            };
        }
        return {
            phase: phase.title,
            focus:
                phase.subtitle +
                (daysRemaining <= 14
                    ? ` (~${daysRemaining} planner days to mock capstone).`
                    : ''),
            priority: 'Execute calmly',
        };
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
    suggestWhatNotToStudy: (currentDay, planStartISO) => {
        const phase = getStudyPlanPhase(currentDay, planStartISO);
        const daysRemaining = STUDY_PLAN_TOTAL_DAYS - currentDay;
        const fracLeft = daysRemaining / STUDY_PLAN_TOTAL_DAYS;

        if (phase.key === 'testseries' || phase.key === 'exam') {
            return lowValueTopics.late;
        }
        if (fracLeft > 0.35) {
            return lowValueTopics.early;
        } else if (fracLeft > 0.12) {
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

    // Strategic advice based on exam proximity and calendar phase
    getStrategicAdvice: (currentDay, planStartISO) => {
        const phase = getStudyPlanPhase(currentDay, planStartISO);
        const daysRemaining = STUDY_PLAN_TOTAL_DAYS - currentDay;
        const fracLeft = daysRemaining / STUDY_PLAN_TOTAL_DAYS;

        if (phase.key === 'exam') {
            return '🎯 Exam day mindset — checklist, calm attempts, no cramming.';
        }
        if (phase.key === 'testseries') {
            return '📝 Test series phase — honor sheet order; analysis beats volume of new theory.';
        }
        if (fracLeft <= 0.03) {
            return '🎯 Final stretch. No new topics — crisp notes, logistics, sleep.';
        } else if (fracLeft <= 0.08) {
            return '📚 Lock in PYQ patterns and formula sheets. Short mock analysis only.';
        } else if (fracLeft <= 0.2) {
            return '💪 Intensive integration phase — mixed papers, weak-topic repairs, accuracy first.';
        } else if (fracLeft <= 0.45) {
            return '🔧 Deep blocks on the monthly grid — numerical discipline and proof intuition.';
        } else {
            return '🏗️ Long-haul foundation — DS/algo/C rigor; never skip structured revision slots.';
        }
    },
};
