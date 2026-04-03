import { supabase } from '../lib/supabase';
import {
    localDb,
    loadAllLocalProgress,
    localSaveSession,
    localSaveTask,
    localDeleteTask,
    localSavePyqAttempt,
    localSaveMistake,
    localPutSyllabus,
    localSavePlanProgress,
    localSaveCompletedPyqTopics,
    localSaveTopicStrengths,
    localSaveSkippedSessions,
    localGetMetaUpdatedAt,
    replaceTasksFromMerged,
    isLocalDbEmpty,
    sessionFingerprint,
} from './localDb';

export function normalizeTask(t) {
    const et = t.estimatedTime;
    const estimatedTime =
        typeof et === 'string' ? parseInt(et, 10) || 0 : Number(et) || 0;
    return {
        ...t,
        estimatedTime,
        id: t.id,
    };
}

function mapRemoteSession(row) {
    return {
        id: Date.now() + Math.floor(Math.random() * 10000),
        subject: row.subject,
        topic: row.topic ?? '',
        duration: row.duration,
        date: row.date,
    };
}

function mapRemoteTask(row) {
    const createdAt = row.created_at ?? new Date().toISOString();
    const id =
        row.local_id != null
            ? Number(row.local_id)
            : Number(
                  `1${String(row.id || createdAt)
                      .replace(/\D/g, '')
                      .slice(-15)}`
              ) || Date.now();
    return normalizeTask({
        id,
        title: row.title,
        subject: row.subject ?? undefined,
        topic: row.topic ?? undefined,
        completed: !!row.completed,
        estimatedTime: row.estimated_time ?? 0,
        deadline: row.deadline ?? undefined,
        priority: row.priority ?? 'medium',
        type: row.task_type ?? row.type ?? undefined,
        reattemptRequired: !!row.reattempt_required,
        examWeight: row.exam_weight ?? undefined,
        createdAt,
    });
}

function mapRemotePyq(row) {
    return {
        id:
            row.local_id != null
                ? Number(row.local_id)
                : Date.now() + Math.floor(Math.random() * 10000),
        subject: row.subject,
        year: row.year ?? undefined,
        total: row.total,
        correct: row.correct,
        incorrect: row.incorrect ?? undefined,
        timestamp: row.created_at,
    };
}

function mapRemoteMistake(row) {
    return {
        id:
            row.local_id != null
                ? Number(row.local_id)
                : Date.now() + Math.floor(Math.random() * 10000),
        subject: row.subject,
        topic: row.topic,
        questionSource: row.question_source ?? '',
        type: row.mistake_type ?? '',
        notes: row.notes ?? '',
        reattempted: !!row.reattempted,
        reattemptScheduled: row.reattempt_scheduled ?? undefined,
        timestamp: row.created_at,
    };
}

function mergeById(localRows, remoteRows, mapRemote, preferLocal = true) {
    const byId = new Map(localRows.map((r) => [r.id, r]));
    for (const row of remoteRows) {
        const mapped = mapRemote(row);
        const id = mapped.id;
        if (byId.has(id)) {
            const loc = byId.get(id);
            byId.set(
                id,
                preferLocal ? { ...mapped, ...loc, id } : { ...loc, ...mapped, id }
            );
        } else {
            byId.set(id, mapped);
        }
    }
    return [...byId.values()];
}

function mergeTasks(localTasks, remoteRows) {
    const byId = new Map(localTasks.map((t) => [t.id, normalizeTask({ ...t })]));
    for (const row of remoteRows) {
        const remote = mapRemoteTask(row);
        const lid = row.local_id != null ? Number(row.local_id) : null;
        if (lid != null && byId.has(lid)) {
            const loc = byId.get(lid);
            byId.set(lid, {
                ...loc,
                ...remote,
                id: lid,
                completed: loc.completed || remote.completed,
            });
        } else if (lid != null) {
            byId.set(lid, { ...remote, id: lid });
        } else {
            const exists = [...byId.values()].some(
                (t) => t.title === remote.title && t.createdAt === remote.createdAt
            );
            if (!exists) {
                byId.set(remote.id, remote);
            }
        }
    }
    return [...byId.values()];
}

function mergeSyllabus(localRows, remoteRows) {
    const map = new Map(localRows.map((r) => [r.topicId, r]));
    for (const row of remoteRows) {
        const topicId = row.topic_id;
        const completed = !!row.completed;
        const existing = map.get(topicId);
        if (!existing) {
            map.set(topicId, {
                topicId,
                completed,
                updatedAt: row.updated_at,
            });
        } else {
            map.set(topicId, {
                topicId,
                completed: existing.completed || completed,
                updatedAt: row.updated_at ?? existing.updatedAt,
            });
        }
    }
    return [...map.values()];
}

function pickNewerProgress(localJson, remoteJson, localTs, remoteTs) {
    if (!localJson) return remoteJson;
    if (!remoteJson) return localJson;
    return remoteTs > localTs ? remoteJson : localJson;
}

async function fetchSupabaseAggregate() {
    const snapResult = await supabase
        .from('app_progress_snapshots')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

    const [sessions, tasks, pyqAttempts, mistakes, syllabus] = await Promise.all([
        supabase.from('sessions').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('pyq_attempts').select('*').order('created_at', { ascending: false }),
        supabase.from('mistakes').select('*').order('created_at', { ascending: false }),
        supabase.from('syllabus_progress').select('*'),
    ]);

    const tables = [sessions, tasks, pyqAttempts, mistakes, syllabus];
    for (const t of tables) {
        if (t.error) {
            const msg = t.error.message || '';
            if (
                t.error.code === '42P01' ||
                msg.includes('does not exist') ||
                msg.includes('schema cache')
            ) {
                t.data = t.data || [];
            } else {
                console.warn('Supabase:', t.error.message);
            }
        }
    }

    let snapshot = null;
    if (!snapResult.error && snapResult.data) {
        snapshot = snapResult.data;
    } else if (
        snapResult.error &&
        !String(snapResult.error.message || '').includes('does not exist')
    ) {
        console.warn('Supabase snapshot:', snapResult.error.message);
    }

    return {
        sessions: sessions.data || [],
        tasks: tasks.data || [],
        pyqAttempts: pyqAttempts.data || [],
        mistakes: mistakes.data || [],
        syllabus: syllabus.data || [],
        snapshot,
    };
}

async function persistMergedToLocal(merged) {
    await localDb.sessions.clear();
    for (const s of merged.sessions) {
        await localDb.sessions.put(s);
    }
    await replaceTasksFromMerged(merged.tasks);
    await localDb.pyqAttempts.clear();
    for (const p of merged.pyqAttempts) {
        await localDb.pyqAttempts.put(p);
    }
    await localDb.mistakes.clear();
    for (const m of merged.mistakes) {
        await localDb.mistakes.put(m);
    }
    await localDb.syllabusProgress.clear();
    for (const row of merged.syllabusTable) {
        await localDb.syllabusProgress.put(row);
    }
    if (merged.planProgress != null) {
        await localSavePlanProgress(merged.planProgress);
    }
    if (merged.completedPyqTopics != null) {
        await localSaveCompletedPyqTopics(merged.completedPyqTopics);
    }
}

export async function bootstrapLocalFromPersisted(state) {
    if (!state || !(await isLocalDbEmpty())) return;

    for (const s of state.sessions || []) {
        await localSaveSession(s);
    }
    for (const t of state.tasks || []) {
        await localSaveTask(normalizeTask(t));
    }
    for (const p of state.pyqAttempts || []) {
        await localSavePyqAttempt(p);
    }
    for (const m of state.mistakes || []) {
        await localSaveMistake(m);
    }
    for (const topicId of state.completedSyllabusTopics || []) {
        await localPutSyllabus(topicId, true);
    }
    if (Array.isArray(state.planProgress) && state.planProgress.length > 0) {
        await localSavePlanProgress(state.planProgress);
    }
    const pyqTopics = state.completedPyqTopics;
    if (Array.isArray(pyqTopics) && pyqTopics.length > 0) {
        await localSaveCompletedPyqTopics(pyqTopics);
    }
    if (state.topicStrengths) {
        await localSaveTopicStrengths(state.topicStrengths);
    }
    if (state.skippedSessions) {
        await localSaveSkippedSessions(state.skippedSessions);
    }
}

export const db = {
    async addSession(session) {
        await localSaveSession(session);
        if (!supabase) return;
        try {
            const { error } = await supabase.from('sessions').insert([
                {
                    created_at: new Date().toISOString(),
                    subject: session.subject,
                    topic: session.topic || '',
                    duration: session.duration,
                    date: session.date,
                },
            ]);
            if (error) throw error;
        } catch (err) {
            console.error('Error syncing session to Supabase:', err);
        }
    },

    async addTask(task) {
        const normalized = normalizeTask(task);
        await localSaveTask(normalized);
        if (!supabase) return;
        try {
            const payload = {
                title: normalized.title,
                subject: normalized.subject || null,
                topic: normalized.topic || null,
                completed: normalized.completed,
                estimated_time: normalized.estimatedTime || 0,
                deadline: normalized.deadline || null,
                created_at: normalized.createdAt || new Date().toISOString(),
                local_id: normalized.id,
                priority: normalized.priority || 'medium',
                task_type: normalized.type || null,
                reattempt_required: !!normalized.reattemptRequired,
                exam_weight: normalized.examWeight || null,
            };
            const { error } = await supabase.from('tasks').upsert(payload, {
                onConflict: 'local_id',
            });
            if (error && /local_id|unique|violates/i.test(String(error.message))) {
                const { error: e2 } = await supabase.from('tasks').insert([
                    {
                        title: normalized.title,
                        subject: normalized.subject || null,
                        completed: normalized.completed,
                        estimated_time: normalized.estimatedTime || 0,
                        deadline: normalized.deadline || null,
                        created_at: normalized.createdAt || new Date().toISOString(),
                    },
                ]);
                if (e2) throw e2;
            } else if (error) throw error;
        } catch (err) {
            console.error('Error syncing task to Supabase:', err);
        }
    },

    async updateTask(id, updates) {
        const prev = (await localDb.tasks.get(id)) || {};
        const full = normalizeTask({ ...prev, ...updates, id });
        await localSaveTask(full);
        if (!supabase) return;
        try {
            const payload = {
                local_id: id,
                title: full.title,
                subject: full.subject ?? null,
                topic: full.topic ?? null,
                completed: full.completed,
                estimated_time: full.estimatedTime ?? 0,
                deadline: full.deadline ?? null,
                priority: full.priority ?? 'medium',
                task_type: full.type ?? null,
                reattempt_required: !!full.reattemptRequired,
                exam_weight: full.examWeight ?? null,
                created_at: full.createdAt || new Date().toISOString(),
            };
            const { error } = await supabase
                .from('tasks')
                .upsert(payload, { onConflict: 'local_id' });
            if (error && !/local_id|unique|violates/i.test(String(error.message))) {
                console.warn('Supabase task update:', error.message);
            } else if (error) {
                throw error;
            }
        } catch (err) {
            console.error('Error updating task on Supabase:', err);
        }
    },

    async deleteTask(id) {
        await localDeleteTask(id);
        if (!supabase) return;
        try {
            const { error } = await supabase.from('tasks').delete().eq('local_id', id);
            if (error && error.code !== 'PGRST116') {
                console.warn('Supabase task delete:', error.message);
            }
        } catch (err) {
            console.error('Error deleting task on Supabase:', err);
        }
    },

    async addPyqAttempt(attempt) {
        await localSavePyqAttempt(attempt);
        if (!supabase) return;
        const base = {
            subject: attempt.subject,
            year: attempt.year || null,
            total: attempt.total,
            correct: attempt.correct,
            incorrect: attempt.incorrect,
            created_at: attempt.timestamp || new Date().toISOString(),
        };
        try {
            let { error } = await supabase
                .from('pyq_attempts')
                .insert([{ ...base, local_id: attempt.id }]);
            if (error) {
                const second = await supabase.from('pyq_attempts').insert([base]);
                if (second.error) throw second.error;
            }
        } catch (err) {
            console.error('Error syncing PYQ attempt to Supabase:', err);
        }
    },

    async addMistake(mistake) {
        await localSaveMistake(mistake);
        if (!supabase) return;
        try {
            const row = {
                subject: mistake.subject,
                topic: mistake.topic,
                question_source: mistake.questionSource || '',
                mistake_type: mistake.type || '',
                notes: mistake.notes || '',
                created_at: mistake.timestamp || new Date().toISOString(),
                local_id: mistake.id,
                reattempted: !!mistake.reattempted,
                reattempt_scheduled: mistake.reattemptScheduled || null,
            };
            const { error } = await supabase.from('mistakes').insert([row]);
            if (error && /local_id|column/i.test(String(error.message))) {
                const { error: e2 } = await supabase.from('mistakes').insert([
                    {
                        subject: mistake.subject,
                        topic: mistake.topic,
                        question_source: mistake.questionSource || '',
                        mistake_type: mistake.type || '',
                        notes: mistake.notes || '',
                        created_at: mistake.timestamp || new Date().toISOString(),
                    },
                ]);
                if (e2) throw e2;
            } else if (error) throw error;
        } catch (err) {
            console.error('Error syncing mistake to Supabase:', err);
        }
    },

    async updateMistake(id, updates) {
        const existing = await localDb.mistakes.get(id);
        if (existing) {
            await localSaveMistake({ ...existing, ...updates, id });
        }
        if (!supabase) return;
        try {
            const { error } = await supabase
                .from('mistakes')
                .update({
                    reattempted: updates.reattempted,
                    reattempt_scheduled: updates.reattemptScheduled ?? null,
                })
                .eq('local_id', id);
            if (error && !/local_id|column/i.test(String(error.message))) {
                /* optional */
            }
        } catch (err) {
            console.error('Error updating mistake on Supabase:', err);
        }
    },

    async toggleSyllabusTopic(topicId, isCompleted) {
        await localPutSyllabus(topicId, isCompleted);
        if (!supabase) return;
        try {
            const { error } = await supabase.from('syllabus_progress').upsert({
                topic_id: topicId,
                completed: isCompleted,
                updated_at: new Date().toISOString(),
            });
            if (error) throw error;
        } catch (err) {
            console.error('Error syncing syllabus to Supabase:', err);
        }
    },

    async savePlanProgress(planProgress) {
        await localSavePlanProgress(planProgress);
        if (!supabase) return;
        try {
            const { data: existing } = await supabase
                .from('app_progress_snapshots')
                .select('completed_pyq_topics')
                .eq('id', 'default')
                .maybeSingle();
            const topics = existing?.completed_pyq_topics ?? [];
            const { error } = await supabase.from('app_progress_snapshots').upsert(
                {
                    id: 'default',
                    plan_progress: planProgress,
                    completed_pyq_topics: topics,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'id' }
            );
            if (error) throw error;
        } catch (err) {
            const msg = String(err.message || err);
            if (!msg.includes('does not exist') && !msg.includes('schema cache')) {
                console.error('Error syncing plan progress to Supabase:', err);
            }
        }
    },

    async saveCompletedPyqTopics(topicIds) {
        await localSaveCompletedPyqTopics(topicIds);
        // ... (Supabase logic)
    },

    async saveTopicStrength(topicStrengths) {
        await localSaveTopicStrengths(topicStrengths);
    },

    async saveSkippedSessions(skippedSessions) {
        await localSaveSkippedSessions(skippedSessions);
    },

    async fetchAllData() {
        const local = await loadAllLocalProgress();
        const localMetaPlanTs = await localGetMetaUpdatedAt('planProgress');
        const localMetaPyqTs = await localGetMetaUpdatedAt('completedPyqTopics');

        if (!supabase) {
            return {
                sessions: local.sessions,
                tasks: local.tasks.map(normalizeTask),
                pyqAttempts: local.pyqAttempts,
                mistakes: local.mistakes,
                syllabus: local.syllabus,
                planProgress: local.planProgress,
                completedPyqTopics: local.completedPyqTopics,
                topicStrengths: local.topicStrengths,
                skippedSessions: local.skippedSessions,
            };
        }

        let remote;
        try {
            remote = await fetchSupabaseAggregate();
        } catch (e) {
            console.error(e);
            remote = null;
        }

        if (!remote) {
            return {
                sessions: local.sessions,
                tasks: local.tasks.map(normalizeTask),
                pyqAttempts: local.pyqAttempts,
                mistakes: local.mistakes,
                syllabus: local.syllabus,
                planProgress: local.planProgress,
                completedPyqTopics: local.completedPyqTopics,
            };
        }

        const seenSessions = new Set(local.sessions.map(sessionFingerprint));
        const extraSessions = [];
        for (const row of remote.sessions) {
            const m = mapRemoteSession(row);
            const fp = sessionFingerprint(m);
            if (!seenSessions.has(fp)) {
                seenSessions.add(fp);
                extraSessions.push(m);
            }
        }
        const mergedSessions = [...local.sessions, ...extraSessions];

        const mergedTasks = mergeTasks(
            local.tasks.map(normalizeTask),
            remote.tasks
        );

        const mergedPyq = mergeById(
            local.pyqAttempts,
            remote.pyqAttempts,
            mapRemotePyq,
            true
        );

        const mergedMistakes = mergeById(
            local.mistakes,
            remote.mistakes,
            mapRemoteMistake,
            true
        );

        const mergedSyllabusRows = mergeSyllabus(local.syllabus, remote.syllabus);

        const snap = remote.snapshot;
        const remoteSnapTs = snap?.updated_at
            ? new Date(snap.updated_at).getTime()
            : 0;

        let planProgress = local.planProgress;
        if (snap?.plan_progress != null) {
            planProgress = pickNewerProgress(
                local.planProgress,
                snap.plan_progress,
                localMetaPlanTs,
                remoteSnapTs
            );
        }

        let completedPyqTopics = local.completedPyqTopics;
        if (snap?.completed_pyq_topics != null) {
            const remoteTopics = Array.isArray(snap.completed_pyq_topics)
                ? snap.completed_pyq_topics
                : [];
            completedPyqTopics =
                pickNewerProgress(
                    local.completedPyqTopics?.length ? local.completedPyqTopics : null,
                    remoteTopics.length ? remoteTopics : null,
                    localMetaPyqTs,
                    remoteSnapTs
                ) ?? local.completedPyqTopics ?? [];
        }

        const merged = {
            sessions: mergedSessions,
            tasks: mergedTasks,
            pyqAttempts: mergedPyq,
            mistakes: mergedMistakes,
            syllabusTable: mergedSyllabusRows,
            planProgress,
            completedPyqTopics,
            topicStrengths: local.topicStrengths,
            skippedSessions: local.skippedSessions,
        };

        try {
            await persistMergedToLocal(merged);
        } catch (e) {
            console.error('Failed to persist merged data locally:', e);
        }

        return {
            sessions: merged.sessions,
            tasks: merged.tasks,
            pyqAttempts: merged.pyqAttempts,
            mistakes: merged.mistakes,
            syllabus: merged.syllabusTable,
            planProgress: merged.planProgress,
            completedPyqTopics: merged.completedPyqTopics,
            topicStrengths: merged.topicStrengths,
            skippedSessions: merged.skippedSessions,
        };
    },
};
