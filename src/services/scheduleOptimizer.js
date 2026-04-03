import { generateDailySchedule } from './geminiService';
import useAppStore from '../store/useAppStore';
import useScheduleStore from '../store/useScheduleStore';
import usePyqStore from '../store/usePyqStore';
import { ALL_GATE_TOPICS, GATE_CS_SUBJECTS } from '../data/gateSubjects';
import { getDaysLeftLabel } from '../utils/gateExamDates';
import { getEffectiveToday } from '../utils/dayBoundary';

export const scheduleOptimizer = {
    /**
     * Call this at the end of the day or when user is behind schedule to trigger Gemini.
     */
    async reoptimizeDailySchedule() {
        const setScheduleLoading = useScheduleStore.getState().setScheduleLoading;
        const setActiveSchedule = useScheduleStore.getState().setActiveSchedule;
        
        const completedTopics = useAppStore.getState().completedSyllabusTopics;
        const weakAreas = usePyqStore.getState().weakAreas;
        
        const targetDate = getEffectiveToday().toISOString().split('T')[0];
        // TODO: Get actual exam date from settings/hook if dynamic
        const daysToExam = getDaysLeftLabel({ date: new Date('2026-02-01') }).days || 100;
        const availableHours = 8; // could be from settings

        setScheduleLoading(true);
        try {
            const newSchedule = await generateDailySchedule({
                allSubjects: GATE_CS_SUBJECTS,
                allTopics: ALL_GATE_TOPICS,
                completedTopics,
                targetDate,
                availableHours,
                weakAreas,
                daysToExam
            });
            
            // Send to both isolated viewer and central architecture
            setActiveSchedule(newSchedule);
            const currentDay = useAppStore.getState().currentDay;
            useAppStore.getState().setAiOverride(currentDay, newSchedule);
            
            return newSchedule;
        } catch (error) {
            console.error("Reoptimization failed:", error);
        } finally {
            setScheduleLoading(false);
        }
    }
};
