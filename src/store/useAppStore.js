import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { buildStudyPlan, defaultPlanStart, STUDY_PLAN_TOTAL_DAYS } from '../data/studyPlan';
import { getEffectiveToday } from '../utils/dayBoundary';

const useAppStore = create(
    persist(
        (set, get) => ({
            // Theme
            theme: 'dark', // 'dark' | 'light'
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'dark' ? 'light' : 'dark'
            })),

            // Auth
            session: null,
            user: null,
            authLoading: true,
            setAuth: (session) => set({ session, user: session?.user || null, authLoading: false }),
            setAuthLoading: (loading) => set({ authLoading: loading }),
            signOut: async () => {
                const { supabase } = await import('../lib/supabase');
                if (supabase) {
                    await supabase.auth.signOut();
                    set({ session: null, user: null, authLoading: false });
                }
            },
            signInWithGoogle: async () => {
                const { supabase } = await import('../lib/supabase');
                if (supabase) {
                    const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: window.location.origin
                        }
                    });
                    if (error) throw error;
                }
            },

            // Plan start date - stored to calculate current day
            planStartDate: null,
            setPlanStartDate: (date) => set({ planStartDate: date }),

            // Current day (1..STUDY_PLAN_TOTAL_DAYS) - calculated based on planStartDate
            currentDay: (() => {
                // This will be recalculated on initialization
                return 1;
            })(),
            setCurrentDay: (day) => set({ currentDay: day }),
            initializeCurrentDay: () => {
                const state = get();
                const today = getEffectiveToday();
                const envStart = import.meta.env.VITE_PLAN_START_DATE;
                
                let activeStart = state.planStartDate;
                
                // 1. Env Var Master Override
                if (envStart && activeStart !== envStart) {
                    activeStart = envStart;
                    set({ planStartDate: activeStart });
                    // Anchor it publicly to Supabase
                    import('../lib/supabase').then(({ supabase }) => {
                        if (supabase && state.session?.user) {
                            supabase.auth.updateUser({
                                data: { plan_start_date: activeStart }
                            });
                        }
                    });
                } 
                // 2. Pure Fallback
                else if (!activeStart) {
                    activeStart = today.getFullYear() + '-' + 
                                     String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                                     String(today.getDate()).padStart(2, '0');
                    set({ planStartDate: activeStart });
                    
                    import('../lib/supabase').then(({ supabase }) => {
                        if (supabase && state.session?.user) {
                            supabase.auth.updateUser({
                                data: { plan_start_date: activeStart }
                            });
                        }
                    });
                }
                
                // Calculate days since plan start natively in Local Time to prevent UTC bugs
                const parts = activeStart.split('-');
                const startDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                startDate.setHours(0, 0, 0, 0);
                
                const diffTime = today.getTime() - startDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                // Current day is days since start + 1 (Day 1 is the start date)
                const calculatedDay = Math.min(Math.max(diffDays + 1, 1), STUDY_PLAN_TOTAL_DAYS);
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
                const et = task.estimatedTime;
                const estimatedTime =
                    typeof et === 'string' ? parseInt(et, 10) || 0 : Number(et) || 0;
                const newTask = {
                    ...task,
                    estimatedTime,
                    id: Date.now(),
                    completed: false,
                    createdAt: new Date().toISOString()
                };
                set({ tasks: [...get().tasks, newTask] });
                import('../services/db').then(({ db }) => db.addTask(newTask));
            },
            updateTask: (id, updates) => {
                const et = updates.estimatedTime;
                const normalized =
                    et !== undefined
                        ? {
                              ...updates,
                              estimatedTime:
                                  typeof et === 'string'
                                      ? parseInt(et, 10) || 0
                                      : Number(et) || 0,
                          }
                        : updates;
                const next = get().tasks.map(t =>
                    t.id === id ? { ...t, ...normalized } : t
                );
                set({ tasks: next });
                const merged = next.find(t => t.id === id);
                if (merged) {
                    import('../services/db').then(({ db }) => db.updateTask(id, merged));
                }
            },
            deleteTask: (id) => {
                set({ tasks: get().tasks.filter(t => t.id !== id) });
                import('../services/db').then(({ db }) => db.deleteTask(id));
            },
            toggleTask: (id) => {
                const tasks = get().tasks.map(t =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                );
                set({ tasks });
                const t = tasks.find(x => x.id === id);
                if (t) {
                    import('../services/db').then(({ db }) =>
                        db.updateTask(id, { completed: t.completed })
                    );
                }
            },

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
            
            handlePYQSync: (topicId, subjectId, total, correct) => {
                // Pass directly to the new pyq store
                import('./usePyqStore').then(({ default: usePyqStore }) => {
                    usePyqStore.getState().updatePyqAttempt(topicId, subjectId, total, correct);
                });
                
                // Keep the old tracking logic intact as requested
                const accuracy = total > 0 ? (correct / total) * 100 : 0;
                get().togglePyqTopic(topicId); // Simplified marker for demonstration
                
                if (accuracy < 60) {
                    get().setDailyTip(`Gemini Optimization Note: Alert! Detected <60% accuracy on ${topicId}. Weak area flagged. Adjusting upcoming revision schedule to prioritize ${subjectId}.`);
                } else {
                    get().setDailyTip(`Gemini Optimization Note: Great accuracy on ${topicId}! Schedule alignment optimized.`);
                }
                
                get().updateSubjectStats(subjectId, {
                    lastPyqAccuracy: accuracy,
                    needsOptimization: accuracy < 60
                });
            },

            // Mistake Notebook
            mistakes: [],
            addMistake: (mistake) => {
                const newMistake = {
                    ...mistake,
                    id: Date.now(),
                    timestamp: new Date().toISOString(),
                    reattemptScheduled: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    reattempted: false,
                };
                set({ mistakes: [...get().mistakes, newMistake] });
                import('../services/db').then(({ db }) => db.addMistake(newMistake));
            },
            markMistakeReattempted: (id) => {
                set({
                    mistakes: get().mistakes.map(m =>
                        m.id === id ? { ...m, reattempted: true } : m
                    ),
                });
                import('../services/db').then(({ db }) =>
                    db.updateMistake(id, { reattempted: true })
                );
            },

            // Study Plan Progress (re-synced after hydration via syncStudyPlan + buildStudyPlan(planStartDate))
            planProgress: buildStudyPlan(defaultPlanStart()).map((day) => ({
                day: day.day,
                completed: false,
                sessions: day.sessions.map((s) => ({ id: s.id, completed: false })),
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
                import('../services/db').then(({ db }) => db.savePlanProgress(progress));
            },

            // 4. Sync Logic (CRITICAL)
            handleSessionCompleteSync: (day, sessionId) => {
                // 1. Mark session.completed = true in state
                get().toggleSessionComplete(day, sessionId);

                // Also update the active Gemini schedule if it exists
                import('./useScheduleStore').then(({ default: useScheduleStore }) => {
                    useScheduleStore.getState().markSessionComplete(sessionId);
                });

                const currentProgress = get().planProgress;
                const dayProg = currentProgress.find(p => p.day === day);
                const sessionProg = dayProg?.sessions?.find(s => s.id === sessionId);
                
                // If it un-toggled (completed -> false), we can decide if we un-toggle topics.
                // Keeping it strictly to adding for simplicity as per requirement.
                if (!sessionProg?.completed) return;

                // 2. Mark topic.completed
                import('../data/studyPlan').then(({ buildStudyPlan, defaultPlanStart }) => {
                    const plan = buildStudyPlan(get().planStartDate || defaultPlanStart());
                    const aiOverrides = get().aiOverrides || {};
                    let session = plan.find(d => d.day === day)?.sessions?.find(s => s.id === sessionId);
                    
                    // Fallback to check AI Overrides if session isn't in baseline
                    if (!session && aiOverrides[day]) {
                        const aiSess = aiOverrides[day].sessions.find(s => s.id === sessionId || s.topicId === sessionId);
                        if (aiSess) {
                            session = {
                                topics: [aiSess.topicId || aiSess.topicName], // use explicit topic ID when available
                                type: aiSess.type || 'study'
                            };
                            if (aiSess.pyqsToSolve > 0) session.type = 'pyq';
                        }
                    }
                    
                    if (session && session.topics) {
                        const currentTopics = get().completedSyllabusTopics;
                        // Let's add all topics to completed (which inherently updates subject completedTopics count)
                        const promises = session.topics.map(topic => {
                            if (!currentTopics.includes(topic)) {
                                get().toggleSyllabusTopic(topic);
                            }
                        });
                        
                        // 5. Update PYQ status if it was a PYQ session
                        if (session.type === 'pyq') {
                            const currentPyqs = get().completedPyqTopics || [];
                            session.topics.forEach(topic => {
                                if (!currentPyqs.includes(topic)) {
                                    get().togglePyqTopic(topic);
                                }
                            });
                        }
                    }

                    // 8. If today's schedule is now 100% complete -> auto-call Gemini
                    const totalSessionsDay = dayPlan?.sessions?.length || 0;
                    const completedSessionsDay = dayProg?.sessions?.filter(s => s.completed).length || 0;
                    
                    if (totalSessionsDay > 0 && completedSessionsDay === totalSessionsDay) {
                        get().setDailyTip("Gemini Optimization Note: Incredible work clearing all sessions today! Schedule realigned. I've primed your weak areas for tomorrow. Take a rest.");
                        // Trigger actual Gemini call for tomorrow
                        import('../services/scheduleOptimizer').then(({ scheduleOptimizer }) => {
                            scheduleOptimizer.reoptimizeDailySchedule();
                        });
                    }
                });
            },

            // Syncs the persisted progress with the latest plan structure for planStartDate
            syncStudyPlan: () => {
                const state = get();
                const existingProgress = state.planProgress;
                const sourcePlan = buildStudyPlan(state.planStartDate || defaultPlanStart());

                // Safety: If no progress or empty, init from scratch
                if (!Array.isArray(existingProgress) || existingProgress.length === 0) {
                    const defaultProgress = sourcePlan.map((day) => ({
                        day: day.day,
                        completed: false,
                        sessions: day.sessions.map((s) => ({ id: s.id, completed: false })),
                    }));
                    set({ planProgress: defaultProgress });
                    import('../services/db').then(({ db }) =>
                        db.savePlanProgress(defaultProgress)
                    );
                    return;
                }

                // Robust Sync: Fresh tree from buildStudyPlan(planStartDate); preserve completed flags.
                const newProgress = sourcePlan.map((dayPlan) => {
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

                set({ planProgress: newProgress });
                import('../services/db').then(({ db }) =>
                    db.savePlanProgress(newProgress)
                );
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

            // AI Generated Dynamic Plan Overrides
            aiOverrides: {},
            setAiOverride: (day, overrideData) => {
                set({
                    aiOverrides: {
                        ...get().aiOverrides,
                        [day]: overrideData
                    }
                });
            },

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
                import('../services/db').then(({ db }) =>
                    db.saveCompletedPyqTopics(newCompleted)
                );
            },

            // ══════════════════════════════════════════════════════════════
            // TOPIC STRENGTH BOARD — Kanban state
            // Keys: "subjectId::subtopicName" → 'weak' | 'revision' | 'strong'
            // ══════════════════════════════════════════════════════════════
            topicStrengths: {},
            setTopicStrength: (key, strength) => {
                const updated = { ...get().topicStrengths, [key]: strength };
                set({ topicStrengths: updated });
            },
            removeTopicStrength: (key) => {
                const updated = { ...get().topicStrengths };
                delete updated[key];
                set({ topicStrengths: updated });
            },
            bulkSetTopicStrengths: (entries) => {
                // entries: { [key]: strength }
                set({ topicStrengths: { ...get().topicStrengths, ...entries } });
            },

            // ══════════════════════════════════════════════════════════════
            // SKIP SESSION — Emergency flow
            // Records why a session was skipped, triggers PYQ penalty,
            // and reschedules the skipped session to a future day.
            // ══════════════════════════════════════════════════════════════
            skippedSessions: [],
            skipSession: (day, sessionId, reason, sessionData) => {
                const entry = {
                    id: Date.now(),
                    day,
                    sessionId,
                    reason,
                    sessionData,
                    timestamp: new Date().toISOString(),
                    rescheduledTo: null,
                    pyqPenaltyCompleted: false,
                };

                // Find the next available day to reschedule (2-5 days out)
                const currentDay = get().currentDay;
                const rescheduleDay = Math.min(currentDay + 3, STUDY_PLAN_TOTAL_DAYS - 1);
                entry.rescheduledTo = rescheduleDay;

                const updated = [...get().skippedSessions, entry];
                set({ skippedSessions: updated });

                // Mark the PYQ penalty tip
                const subjectName = sessionData?.subject || 'the subject';
                get().setDailyTip(
                    `⚠️ Session skipped (${reason}). You must now solve 25 PYQs on your weakest topic to compensate. The skipped content has been rescheduled to Day ${rescheduleDay}.`
                );

                return entry;
            },
            markPyqPenaltyDone: (skippedId) => {
                const updated = get().skippedSessions.map(s =>
                    s.id === skippedId ? { ...s, pyqPenaltyCompleted: true } : s
                );
                set({ skippedSessions: updated });
            },
            getWeakestSubject: () => {
                const strengths = get().topicStrengths;
                const subjectWeakCounts = {};
                for (const [key, val] of Object.entries(strengths)) {
                    if (val === 'weak') {
                        const subject = key.split('::')[0];
                        subjectWeakCounts[subject] = (subjectWeakCounts[subject] || 0) + 1;
                    }
                }
                // Also check PYQ accuracy
                const pyqAttempts = get().pyqAttempts;
                const subjectAccuracy = {};
                for (const a of pyqAttempts) {
                    if (!subjectAccuracy[a.subject]) {
                        subjectAccuracy[a.subject] = { correct: 0, total: 0 };
                    }
                    subjectAccuracy[a.subject].correct += a.correct || 0;
                    subjectAccuracy[a.subject].total += a.total || 0;
                }

                let weakest = null;
                let maxWeak = 0;
                for (const [sub, count] of Object.entries(subjectWeakCounts)) {
                    if (count > maxWeak) {
                        weakest = sub;
                        maxWeak = count;
                    }
                }

                // Fallback to lowest PYQ accuracy subject
                if (!weakest) {
                    let minAcc = 101;
                    for (const [sub, data] of Object.entries(subjectAccuracy)) {
                        const acc = data.total > 0 ? (data.correct / data.total) * 100 : 100;
                        if (acc < minAcc) {
                            minAcc = acc;
                            weakest = sub;
                        }
                    }
                }

                return weakest || 'math'; // Ultimate fallback
            },

            // Database Sync (IndexedDB local-first, merged with Supabase when configured)
            hydrateFromDb: async () => {
                const { db } = await import('../services/db');
                const data = await db.fetchAllData();
                if (!data) return;

                const syllabusRows = data.syllabus || [];
                const patch = {
                    sessions: (data.sessions || []).map(s => ({
                        ...s,
                        duration: s.duration,
                        date: s.date,
                    })),
                    tasks: (data.tasks || []).map(t => ({
                        ...t,
                        estimatedTime: t.estimatedTime ?? t.estimated_time ?? 0,
                        createdAt: t.createdAt ?? t.created_at ?? new Date().toISOString(),
                    })),
                    pyqAttempts: (data.pyqAttempts || []).map(p => ({
                        ...p,
                        timestamp: p.timestamp ?? p.created_at,
                    })),
                    mistakes: (data.mistakes || []).map(m => {
                        const ts = m.timestamp || m.created_at;
                        return {
                            ...m,
                            questionSource: m.questionSource ?? m.question_source ?? '',
                            type: m.type ?? m.mistake_type ?? '',
                            reattempted: m.reattempted ?? false,
                            reattemptScheduled:
                                m.reattemptScheduled ??
                                m.reattempt_scheduled ??
                                new Date(
                                    new Date(ts).getTime() + 2 * 24 * 60 * 60 * 1000
                                ).toISOString(),
                        };
                    }),
                    completedSyllabusTopics: syllabusRows
                        .filter(s => s.completed)
                        .map(s => s.topic_id || s.topicId)
                        .filter(Boolean),
                    completedPyqTopics: Array.isArray(data.completedPyqTopics)
                        ? data.completedPyqTopics
                        : [],
                    aiOverrides: data.aiOverrides || {},
                };

                if (Array.isArray(data.planProgress) && data.planProgress.length > 0) {
                    patch.planProgress = data.planProgress;
                }
                if (data.topicStrengths && typeof data.topicStrengths === 'object') {
                    patch.topicStrengths = data.topicStrengths;
                }
                if (Array.isArray(data.skippedSessions)) {
                    patch.skippedSessions = data.skippedSessions;
                }

                set(patch);
            },
        }),
        {
            name: 'gate-study-planner',
            partialize: (state) => {
                // We now PERSIST the session/user to ensure Guest Mode survives refreshes
                // and to avoid layout flicker during slow auth SDK boot.
                // authLoading is still excluded so it always starts as true.
                const { authLoading, ...rest } = state;
                return rest;
            },
        }
    )
);

export default useAppStore;
