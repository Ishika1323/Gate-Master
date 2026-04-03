import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAppStore from './useAppStore'; // For cross-store triggers if needed

const usePyqStore = create(
    persist(
        (set, get) => ({
            topicStats: {}, // { [topicId]: { solved: number, total: number, accuracy: number, history: [] } }
            weakAreas: [], // array of topicIds where accuracy < 60%

            updatePyqAttempt: (topicId, subjectId, total, correct) => {
                const accuracy = total > 0 ? (correct / total) * 100 : 0;
                const prevStats = get().topicStats[topicId] || { solved: 0, total: 0, accuracy: 0, history: [] };
                
                const newTotal = prevStats.total + total;
                const newSolved = prevStats.solved + correct;
                const newAccuracy = (newSolved / newTotal) * 100;
                
                const newHistory = [...prevStats.history, { date: new Date().toISOString(), accuracy }];
                
                const updatedStats = {
                    ...get().topicStats,
                    [topicId]: {
                        solved: newSolved,
                        total: newTotal,
                        accuracy: newAccuracy,
                        history: newHistory
                    }
                };
                
                // Determine weak areas
                let updatedWeakAreas = [...get().weakAreas];
                if (newAccuracy < 60 && !updatedWeakAreas.includes(topicId)) {
                    updatedWeakAreas.push(topicId);
                } else if (newAccuracy >= 60 && updatedWeakAreas.includes(topicId)) {
                    updatedWeakAreas = updatedWeakAreas.filter(id => id !== topicId);
                }

                set({ 
                    topicStats: updatedStats,
                    weakAreas: updatedWeakAreas
                });
            },
            
            getSubjectAccuracy: (subjectId, subjectTopics) => {
                // Get all topics for this subject
                const topicsStats = subjectTopics
                    .filter(t => t.subjectId === subjectId)
                    .map(t => get().topicStats[t.id])
                    .filter(Boolean);
                
                if (topicsStats.length === 0) return 0;
                
                const totalQuestions = topicsStats.reduce((sum, s) => sum + s.total, 0);
                const totalSolved = topicsStats.reduce((sum, s) => sum + s.solved, 0);
                
                return totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;
            }
        }),
        {
            name: 'gate-pyq-storage',
        }
    )
);

export default usePyqStore;
