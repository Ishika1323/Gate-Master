import { useMemo } from 'react';
import useAppStore from '../store/useAppStore';
import { buildStudyPlan, defaultPlanStart } from '../data/studyPlan';

/**
 * useMasterStudyPlan
 * 
 * Returns the global 311-day study plan. Merges the static baseline plan
 * with dynamic AI overrides fetched from Gemini, ensuring standardized format
 * for UI components.
 */
export function useMasterStudyPlan() {
    const planStartDate = useAppStore(state => state.planStartDate);
    const aiOverrides = useAppStore(state => state.aiOverrides);

    const mergedStudyPlan = useMemo(() => {
        const basePlan = buildStudyPlan(planStartDate || defaultPlanStart());

        return basePlan.map(dayNode => {
            const override = aiOverrides[dayNode.day];
            
            if (override && override.sessions) {
                // Map Gemini's flat structure `{ topicName, pyqsToSolve, type, id, duration }`
                // back into the `StudyPlanPage` UI expected footprint`
                const standardizedSessions = override.sessions.map((aiSession, idx) => {
                    const topics = [aiSession.topicName];
                    if (aiSession.pyqsToSolve > 0) {
                        topics.push(`Target: Solve ${aiSession.pyqsToSolve} PYQs`);
                    }
                    
                    return {
                        id: aiSession.id || aiSession.topicId || `ai-sess-${idx}`,
                        duration: aiSession.duration,
                        subject: aiSession.subjectId?.toLowerCase() || 'all',
                        topics: topics,
                        type: aiSession.type || 'study',
                        isAiGenerated: true // flag for UI tracing
                    };
                });

                return {
                    ...dayNode,
                    phase: dayNode.phase || 'AI Optimized Day',
                    phaseSubtitle: override.optimizationNote || 'Dynamically rescheduled by Gemini',
                    sessions: standardizedSessions
                };
            }

            return dayNode;
        });

    }, [planStartDate, aiOverrides]);

    return mergedStudyPlan;
}
