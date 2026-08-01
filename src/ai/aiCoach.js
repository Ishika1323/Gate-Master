// AI Coach that provides daily tips, recommendations, and strategic advice

import { getStudyPlanPhase, getPlanTotalDays } from '../data/studyPlan';

const motivationalMessages = [
    "You're making excellent progress! Stay focused and trust your preparation.",
    "Consistency is key. Every hour of focused study counts!",
    "Remember: Quality over quantity. Deep focus beats long hours.",
    "You're building knowledge brick by brick. Keep going!",
    "Trust the process. Your hard work will pay off.",
    "Stay disciplined. The exam is closer than you think!",
    "Your future self will thank you for the effort you're putting in today.",
];

export const aiCoach = {
    // Generate daily recommendation based on day and performance (planStartISO = YYYY-MM-DD from store).
    // planContext ({ totalDays, phase, phaseSubtitle }) is supplied when a custom
    // plan is active — its phases replace the built-in 311-day phase model.
    getDailyRecommendation: (currentDay, subjectStats, tasks, planStartISO, planContext) => {
        if (planContext) {
            const daysRemaining = Math.max(planContext.totalDays - currentDay, 0);
            return {
                phase: planContext.phase,
                focus:
                    (planContext.phaseSubtitle || 'Execute today\'s scheduled blocks.') +
                    (daysRemaining <= 14 ? ` (~${daysRemaining} days to exam week.)` : ''),
                priority: 'Hold the daily frame: math dawn » technical dawn » evening burn',
            };
        }
        const phase = getStudyPlanPhase(currentDay, planStartISO);
        const daysRemaining = getPlanTotalDays(planStartISO) - currentDay;

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
    generateDailyTip: (currentDay, tasks, pyqAttempts) => {
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

    // Strategic advice based on exam proximity and calendar phase.
    // planContext.totalDays overrides the built-in plan length for custom plans.
    getStrategicAdvice: (currentDay, planStartISO, planContext) => {
        const totalDays = planContext?.totalDays || getPlanTotalDays(planStartISO);
        const daysRemaining = totalDays - currentDay;
        const fracLeft = daysRemaining / totalDays;

        if (!planContext) {
            const phase = getStudyPlanPhase(currentDay, planStartISO);
            if (phase.key === 'exam') {
                return '🎯 Exam day mindset — checklist, calm attempts, no cramming.';
            }
            if (phase.key === 'testseries') {
                return '📝 Test series phase — honor sheet order; analysis beats volume of new theory.';
            }
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
