import { useMemo } from 'react';
import useAppStore from '../store/useAppStore';
import { defaultPlanStart } from '../data/studyPlan';
import { buildPlanById, getPlanTotalDays } from '../data/planRegistry';

/**
 * useMasterStudyPlan
 *
 * Returns the active study plan (the global 311-day roadmap, or the user
 * profile's custom plan such as Ishika's 28-week battle plan). Merges the
 * static baseline plan with dynamic AI overrides fetched from Gemini,
 * ensuring standardized format for UI components.
 */
export function useMasterStudyPlan() {
    const planStartDate = useAppStore(state => state.planStartDate);
    const activePlanId = useAppStore(state => state.activePlanId);
    const aiOverrides = useAppStore(state => state.aiOverrides);

    const mergedStudyPlan = useMemo(() => {
        const basePlan = buildPlanById(activePlanId, planStartDate || defaultPlanStart());

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

    }, [activePlanId, planStartDate, aiOverrides]);

    return mergedStudyPlan;
}

/** Total day count of the active plan (custom plans may differ from 311). */
export function usePlanTotalDays() {
    const activePlanId = useAppStore(state => state.activePlanId);
    return getPlanTotalDays(activePlanId);
}
