import { buildStudyPlan, defaultPlanStart, STUDY_PLAN_TOTAL_DAYS } from '../data/studyPlan';
import { GATE_CS_SUBJECTS } from '../data/gateSubjects';
import useAppStore from '../store/useAppStore';

export const progressCalculator = {
    /**
     * Calculate global completion % across all subjects based on weightage
     */
    getGlobalCompletion(completedSyllabusTopics, allTopicsCount) {
        if (!allTopicsCount) {
            allTopicsCount = GATE_CS_SUBJECTS.reduce((acc, subj) => acc + subj.totalTopics, 0);
        }
        return allTopicsCount > 0 ? (completedSyllabusTopics.length / allTopicsCount) * 100 : 0;
    },

    /**
     * Returns projection curves for actual vs projected progress over time
     */
    getProjectionData(totalDays, planProgress, currentDay) {
        // Mocking projected vs actual curve logic based on standard ideal burn down
        const data = [];
        
        let actualAccumulated = 0;
        
        for (let i = 1; i <= totalDays; i++) {
            const projected = (i / totalDays) * 100;
            
            let actual = null;
            if (i <= currentDay && planProgress) {
                // Find day in plan
                const dayPlan = planProgress.find(p => p.day === i);
                if (dayPlan && dayPlan.sessions) {
                    const completedSessions = dayPlan.sessions.filter(s => s.completed).length;
                    const totalSessions = dayPlan.sessions.length;
                    const dailyPercent = totalSessions > 0 ? completedSessions / totalSessions : 0;
                    
                    // Simple cumulative increment (this could be mapped properly to weightage)
                    actualAccumulated += (dailyPercent * (100 / totalDays));
                }
                actual = Math.min(100, actualAccumulated);
            }
            
            data.push({
                day: i,
                projected: Math.min(100, Math.round(projected)),
                actual: actual !== null ? Math.round(actual) : null
            });
        }
        
        return data;
    },
    
    /**
     * Generate 7xN grid data for heatmap visualization
     * Tracks forward for the entire plan duration (e.g. 311 days until GATE)
     */
    getHeatmapData(planProgress, totalDays = null) {
        if (!totalDays) totalDays = STUDY_PLAN_TOTAL_DAYS || 311;
        const data = [];
        
        const planStartDate = getPlanStart();
        planStartDate.setHours(0,0,0,0);
        
        for (let i = 0; i < totalDays; i++) {
            const loopDate = new Date(planStartDate.getTime() + i * 24 * 60 * 60 * 1000);
            const dayDiff = i + 1; // 1-indexed to match planProgress
            
            let intensity = 0;
            if (planProgress) {
                const dayPlan = planProgress.find(p => p.day === dayDiff);
                if (dayPlan) {
                    intensity = dayPlan.sessions?.filter(s => s.completed).length || 0;
                }
            }
            
            data.push({
                date: loopDate.toISOString().split('T')[0],
                count: intensity,
                dayDiff
            });
        }
        return data;
    }
};

function getPlanStart() {
    const storeStart = useAppStore.getState().planStartDate;
    if (storeStart) return new Date(storeStart);
    return new Date('2026-04-03'); // Enforce April 3rd start default
}
