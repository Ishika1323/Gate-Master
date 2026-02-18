import { supabase } from '../lib/supabase';

export const db = {
    // --- Sessions ---
    async addSession(session) {
        if (!supabase) return;
        try {
            const { error } = await supabase.from('sessions').insert([{
                created_at: new Date().toISOString(),
                subject: session.subject,
                topic: session.topic || '',
                duration: session.duration, // minutes
                date: session.date,
            }]);
            if (error) throw error;
        } catch (err) {
            console.error('Error syncing session to DB:', err);
        }
    },

    // --- Tasks ---
    async addTask(task) {
        if (!supabase) return;
        try {
            const { error } = await supabase.from('tasks').insert([{
                title: task.title,
                subject: task.subject || null,
                completed: task.completed,
                estimated_time: task.estimatedTime || 0,
                deadline: task.deadline || null,
                created_at: task.createdAt || new Date().toISOString(),
            }]);
            if (error) throw error;
        } catch (err) {
            console.error('Error syncing task to DB:', err);
        }
    },

    async updateTask(id, updates) {
        // Note: This requires a mapping between local ID and remote ID if we want true 2-way sync.
        // For this simple integration, we might just log completed tasks, or we need a real ID map.
        // Since local IDs are timestamps, we can't easily update remote rows without more complex logic.
        // For "Insights", inserting completed tasks/sessions is the most high-value low-effort step.
        // The user asked for "insights", so let's focus on recording COMPLETED items.

        if (!supabase) return;

        // If completing a task, we might want to log it if we didn't insert it initially.
        // Or if we have a robust system, we insert on creation and update on completion.
        // Given existing local-first architecture, let's keep it simple: 
        // We log *events* to the DB for analytics.
    },

    // --- PYQ Attempts ---
    async addPyqAttempt(attempt) {
        if (!supabase) return;
        try {
            const { error } = await supabase.from('pyq_attempts').insert([{
                subject: attempt.subject,
                year: attempt.year || null,
                total: attempt.total,
                correct: attempt.correct,
                incorrect: attempt.incorrect,
                created_at: attempt.timestamp || new Date().toISOString(),
            }]);
            if (error) throw error;
        } catch (err) {
            console.error('Error syncing PYQ attempt to DB:', err);
        }
    },

    // --- Mistakes ---
    async addMistake(mistake) {
        if (!supabase) return;
        try {
            const { error } = await supabase.from('mistakes').insert([{
                subject: mistake.subject,
                topic: mistake.topic,
                question_source: mistake.questionSource || '',
                mistake_type: mistake.type || '',
                notes: mistake.notes || '',
                created_at: new Date().toISOString(),
            }]);
            if (error) throw error;
        } catch (err) {
            console.error('Error syncing mistake to DB:', err);
        }
    },

    // --- Syllabus ---
    async toggleSyllabusTopic(topicId, isCompleted) {
        if (!supabase) return;
        try {
            const { error } = await supabase.from('syllabus_progress').upsert({
                topic_id: topicId,
                completed: isCompleted,
                updated_at: new Date().toISOString()
            });
            if (error) throw error;
        } catch (err) {
            console.error('Error syncing syllabus to DB:', err);
        }
    },

    // --- Fetch Data ---
    async fetchAllData() {
        if (!supabase) return null;
        try {
            const [sessions, tasks, pyqAttempts, mistakes, syllabus] = await Promise.all([
                supabase.from('sessions').select('*').order('created_at', { ascending: false }),
                supabase.from('tasks').select('*').order('created_at', { ascending: false }),
                supabase.from('pyq_attempts').select('*').order('created_at', { ascending: false }),
                supabase.from('mistakes').select('*').order('created_at', { ascending: false }),
                supabase.from('syllabus_progress').select('*'),
            ]);

            return {
                sessions: sessions.data || [],
                tasks: tasks.data || [],
                pyqAttempts: pyqAttempts.data || [],
                mistakes: mistakes.data || [],
                syllabus: syllabus.data || [],
            };
        } catch (err) {
            console.error('Error fetching data from DB:', err);
            return null;
        }
    }
};
