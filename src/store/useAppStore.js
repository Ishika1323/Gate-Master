import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STUDY_PLAN } from '../data/studyPlan';

const useAppStore = create(
    persist(
        (set, get) => ({
            // Theme
            theme: 'dark', // 'dark' | 'light'
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'dark' ? 'light' : 'dark'
            })),

            // Plan start date - stored to calculate current day
            planStartDate: null,
            setPlanStartDate: (date) => set({ planStartDate: date }),

            // Current day (1-32) - calculated based on planStartDate
            currentDay: (() => {
                // This will be recalculated on initialization
                return 1;
            })(),
            setCurrentDay: (day) => set({ currentDay: day }),
            initializeCurrentDay: () => {
                const state = get();
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // If no planStartDate stored, set it to today and currentDay to 1
                if (!state.planStartDate) {
                    const todayStr = today.toISOString().split('T')[0];
                    set({ planStartDate: todayStr, currentDay: 1 });
                    return 1;
                }
                
                // Calculate days since plan start
                const startDate = new Date(state.planStartDate);
                startDate.setHours(0, 0, 0, 0);
                const diffTime = today - startDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                // Current day is days since start + 1 (Day 1 is the start date)
                const calculatedDay = Math.min(Math.max(diffDays + 1, 1), 32);
                set({ currentDay: calculatedDay });
                return calculatedDay;
            },

            // Timer state
            timer: {
                isActive: false,
                isPaused: false,
                mode: '25/5', // '25/5', '50/10', '90/20', 'custom'
                workDuration: 25,
                breakDuration: 5,
                timeRemaining: 25 * 60,
                isBreak: false,
                currentSubject: null,
                currentTopic: null,
            },
            setTimer: (timerData) => set({ timer: { ...get().timer, ...timerData } }),
            resetTimer: () => set({
                timer: {
                    ...get().timer,
                    isActive: false,
                    isPaused: false,
                    timeRemaining: get().timer.workDuration * 60,
                    isBreak: false,
                }
            }),

            // Focus sessions history
            sessions: [],
            addSession: (session) => {
                const newSession = { ...session, id: Date.now() };
                set({ sessions: [...get().sessions, newSession] });
                import('../services/db').then(({ db }) => db.addSession(newSession));
            },

            // Tasks
            tasks: [],
            addTask: (task) => {
                const newTask = {
                    ...task,
                    id: Date.now(),
                    completed: false,
                    createdAt: new Date().toISOString()
                };
                set({ tasks: [...get().tasks, newTask] });
                import('../services/db').then(({ db }) => db.addTask(newTask));
            },
            updateTask: (id, updates) => set({
                tasks: get().tasks.map(t => t.id === id ? { ...t, ...updates } : t)
            }),
            deleteTask: (id) => set({ tasks: get().tasks.filter(t => t.id !== id) }),
            toggleTask: (id) => set({
                tasks: get().tasks.map(t =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                )
            }),

            // PYQ Attempts
            pyqAttempts: [],
            addPyqAttempt: (attempt) => {
                const newAttempt = {
                    ...attempt,
                    id: Date.now(),
                    timestamp: new Date().toISOString(),
                };
                set({ pyqAttempts: [...get().pyqAttempts, newAttempt] });
                import('../services/db').then(({ db }) => db.addPyqAttempt(newAttempt));
            },

            // Mistake Notebook
            mistakes: [],
            addMistake: (mistake) => {
                const newMistake = {
                    ...mistake,
                    id: Date.now(),
                    reattemptScheduled: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    reattempted: false,
                };
                set({ mistakes: [...get().mistakes, newMistake] });
                import('../services/db').then(({ db }) => db.addMistake(newMistake));
            },
            markMistakeReattempted: (id) => set({
                mistakes: get().mistakes.map(m => m.id === id ? { ...m, reattempted: true } : m)
            }),

            // Study Plan Progress
            planProgress: STUDY_PLAN.map(day => ({
                day: day.day,
                completed: false,
                sessions: day.sessions.map(s => ({ id: s.id, completed: false }))
            })),
            toggleSessionComplete: (day, sessionId) => {
                const state = get();
                const progress = [...(state.planProgress || [])];

                // Find day index
                let dayIndex = progress.findIndex(p => p.day === day);

                if (dayIndex === -1) {
                    // Day doesn't exist, create it
                    progress.push({
                        day,
                        completed: false,
                        sessions: [{ id: sessionId, completed: true }]
                    });
                } else {
                    // Day exists, find session
                    const dayProg = { ...progress[dayIndex] };
                    const sessions = [...(dayProg.sessions || [])];
                    const sessionIndex = sessions.findIndex(s => s.id === sessionId);

                    if (sessionIndex === -1) {
                        // Session doesn't exist, create it (marked true)
                        sessions.push({ id: sessionId, completed: true });
                    } else {
                        // Toggle existing
                        sessions[sessionIndex] = {
                            ...sessions[sessionIndex],
                            completed: !sessions[sessionIndex].completed
                        };
                    }

                    dayProg.sessions = sessions;
                    progress[dayIndex] = dayProg;
                }

                set({ planProgress: progress });
                // Async persist to DB if needed
                import('../services/db').then(({ db }) => {
                    // Ensure DB has a way to handle this if we were strictly syncing
                    // For now, local state priority
                });
            },

            // Syncs the persisted progress with the latest STUDY_PLAN structure
            syncStudyPlan: () => {
                const state = get();
                const existingProgress = state.planProgress;

                // Safety: If no progress or empty, init from scratch
                if (!Array.isArray(existingProgress) || existingProgress.length === 0) {
                    const defaultProgress = STUDY_PLAN.map(day => ({
                        day: day.day,
                        completed: false,
                        sessions: day.sessions.map(s => ({ id: s.id, completed: false }))
                    }));
                    set({ planProgress: defaultProgress });
                    return;
                }

                // Robust Sync: Create a fresh tree based on source of truth (STUDY_PLAN)
                // and attempts to rehydrate only the 'completed' flags from persisted state.
                const newProgress = STUDY_PLAN.map(dayPlan => {
                    const existingDay = existingProgress.find(p => p.day === dayPlan.day);
                    return {
                        day: dayPlan.day,
                        completed: existingDay ? !!existingDay.completed : false,
                        sessions: dayPlan.sessions.map(session => {
                            let isCompleted = false;

                            // Try to find status in existing state
                            if (existingDay && Array.isArray(existingDay.sessions)) {
                                const existingSession = existingDay.sessions.find(s => s.id === session.id);
                                if (existingSession) {
                                    isCompleted = !!existingSession.completed;
                                }
                            }

                            return {
                                id: session.id,
                                completed: isCompleted
                            };
                        })
                    };
                });

                // Force replace the state
                set({ planProgress: newProgress });
                console.log("Study Plan Synced & Repaired", newProgress);
            },

            // Performance tracking
            subjectStats: {},
            updateSubjectStats: (subject, stats) => set({
                subjectStats: {
                    ...get().subjectStats,
                    [subject]: {
                        ...get().subjectStats[subject],
                        ...stats,
                    }
                }
            }),

            // User settings
            settings: {
                notifications: true,
                soundEnabled: true,
                autoStartBreak: true,
                autoStartWork: false,
            },
            updateSettings: (updates) => set({
                settings: { ...get().settings, ...updates }
            }),

            // AI Coach state
            dailyTip: null,
            setDailyTip: (tip) => set({ dailyTip: tip }),

            // Helper functions
            getSubjectFocusHours: (subject) => {
                const sessions = get().sessions.filter(s => s.subject === subject);
                return sessions.reduce((total, s) => total + (s.duration / 60), 0);
            },

            getSubjectAccuracy: (subject) => {
                const attempts = get().pyqAttempts.filter(a => a.subject === subject);
                if (attempts.length === 0) return null;
                const totalCorrect = attempts.reduce((sum, a) => sum + a.correct, 0);
                const totalQuestions = attempts.reduce((sum, a) => sum + a.total, 0);
                return totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
            },

            getTotalStudyHours: () => {
                const sessions = get().sessions;
                return sessions.reduce((total, s) => total + (s.duration / 60), 0);
            },

            // Syllabus Tracking
            completedSyllabusTopics: [], // Array of topic IDs
            toggleSyllabusTopic: (topicId) => {
                const current = get().completedSyllabusTopics;
                const isCompleted = !current.includes(topicId);

                const newCompleted = isCompleted
                    ? [...current, topicId]
                    : current.filter(id => id !== topicId);

                set({ completedSyllabusTopics: newCompleted });
                import('../services/db').then(({ db }) => db.toggleSyllabusTopic(topicId, isCompleted));
            },

            // PYQ Coverage Tracking (subject-wise & topic-wise)
            // Uses same ID format as syllabus topics but kept in a separate list
            completedPyqTopics: [], // Array of PYQ topic IDs
            togglePyqTopic: (topicId) => {
                const current = get().completedPyqTopics || [];
                const isCompleted = !current.includes(topicId);

                const newCompleted = isCompleted
                    ? [...current, topicId]
                    : current.filter(id => id !== topicId);

                set({ completedPyqTopics: newCompleted });
                // Optional: sync to DB later with a dedicated table if needed
            },

            // Database Sync
            hydrateFromDb: async () => {
                const { db } = await import('../services/db');
                const data = await db.fetchAllData();
                if (data) {
                    set({
                        sessions: data.sessions.map(s => ({
                            ...s,
                            duration: s.duration,
                            date: s.date
                        })),
                        tasks: data.tasks.map(t => ({
                            ...t,
                            estimatedTime: t.estimated_time,
                            createdAt: t.created_at
                        })),
                        pyqAttempts: data.pyqAttempts.map(p => ({
                            ...p,
                            timestamp: p.created_at
                        })),
                        mistakes: data.mistakes.map(m => ({
                            ...m,
                            questionSource: m.question_source,
                            type: m.mistake_type,
                            reattemptScheduled: new Date(new Date(m.created_at).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
                        })),
                        completedSyllabusTopics: data.syllabus
                            .filter(s => s.completed)
                            .map(s => s.topic_id),
                    });
                }
            },
        }),
        {
            name: 'gate-study-planner',
        }
    )
);

export default useAppStore;
