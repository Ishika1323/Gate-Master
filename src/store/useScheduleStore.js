import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useScheduleStore = create(
    persist(
        (set, get) => ({
            activeSchedule: null, // Holds today's Gemini-generated schedule
            upcomingSchedules: [], // Cache of future days
            isLoading: false,
            lastGeneratedDate: null, // Keep track to prevent re-generating too often

            setScheduleLoading: (loading) => set({ isLoading: loading }),
            
            setActiveSchedule: (schedule) => set({ 
                activeSchedule: schedule,
                lastGeneratedDate: new Date().toISOString().split('T')[0]
            }),

            markSessionComplete: (sessionId) => {
                const schedule = get().activeSchedule;
                if (!schedule) return;

                const updatedSessions = schedule.sessions.map(session => {
                    if (session.topicId === sessionId || session.id === sessionId) {
                        return { ...session, completed: true };
                    }
                    return session;
                });

                set({ activeSchedule: { ...schedule, sessions: updatedSessions } });
            },
            
            clearSchedule: () => set({ activeSchedule: null })
        }),
        {
            name: 'gate-schedule-storage',
        }
    )
);

export default useScheduleStore;
