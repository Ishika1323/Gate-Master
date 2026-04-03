import Dexie from 'dexie';

class GateLocalDB extends Dexie {
    constructor() {
        super('gate-study-planner-local');
        this.version(1).stores({
            sessions: 'id, date, subject',
            tasks: 'id, completed, createdAt',
            pyqAttempts: 'id',
            mistakes: 'id',
            syllabusProgress: 'topicId',
            meta: 'key',
        });
    }
}

export const localDb = new GateLocalDB();

export async function localPutMeta(key, value) {
    await localDb.meta.put({
        key,
        value,
        updatedAt: new Date().toISOString(),
    });
}

export async function localGetMeta(key) {
    const row = await localDb.meta.get(key);
    return row?.value ?? null;
}

export async function localGetMetaUpdatedAt(key) {
    const row = await localDb.meta.get(key);
    return row?.updatedAt ? new Date(row.updatedAt).getTime() : 0;
}

export async function localSaveSession(session) {
    await localDb.sessions.put(session);
}

export async function localSaveTask(task) {
    await localDb.tasks.put(task);
}

export async function localDeleteTask(id) {
    await localDb.tasks.delete(id);
}

export async function localSavePyqAttempt(attempt) {
    await localDb.pyqAttempts.put(attempt);
}

export async function localSaveMistake(mistake) {
    await localDb.mistakes.put(mistake);
}

export async function localPutSyllabus(topicId, completed) {
    await localDb.syllabusProgress.put({
        topicId,
        completed,
        updatedAt: new Date().toISOString(),
    });
}

export async function localSavePlanProgress(planProgress) {
    await localPutMeta('planProgress', planProgress);
}

export async function localSaveCompletedPyqTopics(topicIds) {
    await localPutMeta('completedPyqTopics', topicIds);
}

export async function localSaveTopicStrengths(topicStrengths) {
    await localPutMeta('topicStrengths', topicStrengths);
}

export async function localSaveSkippedSessions(skippedSessions) {
    await localPutMeta('skippedSessions', skippedSessions);
}

function sessionFingerprint(s) {
    const date = s.date ?? '';
    const subject = s.subject ?? '';
    const duration = s.duration ?? '';
    const topic = s.topic ?? '';
    return `${date}|${subject}|${duration}|${topic}`;
}

export async function loadAllLocalProgress() {
    const [
        sessions,
        tasks,
        pyqAttempts,
        mistakes,
        syllabusRows,
        planProgress,
        completedPyqTopics,
    ] = await Promise.all([
        localDb.sessions.toArray(),
        localDb.tasks.toArray(),
        localDb.pyqAttempts.toArray(),
        localDb.mistakes.toArray(),
        localDb.syllabusProgress.toArray(),
        localGetMeta('planProgress'),
        localGetMeta('completedPyqTopics'),
    ]);

    return {
        sessions,
        tasks,
        pyqAttempts,
        mistakes,
        syllabus: syllabusRows,
        planProgress,
        completedPyqTopics: Array.isArray(completedPyqTopics) ? completedPyqTopics : [],
        topicStrengths: await localGetMeta('topicStrengths'),
        skippedSessions: await localGetMeta('skippedSessions'),
    };
}

export async function replaceTasksFromMerged(tasks) {
    await localDb.tasks.clear();
    for (const t of tasks) {
        await localDb.tasks.put(t);
    }
}

export async function isLocalDbEmpty() {
    const [sc, tc, pc, mc, syllabus, planMeta, pyqMeta] = await Promise.all([
        localDb.sessions.count(),
        localDb.tasks.count(),
        localDb.pyqAttempts.count(),
        localDb.mistakes.count(),
        localDb.syllabusProgress.count(),
        localDb.meta.get('planProgress'),
        localDb.meta.get('completedPyqTopics'),
    ]);
    const hasMeta =
        (planMeta?.value && Array.isArray(planMeta.value) && planMeta.value.length > 0) ||
        (pyqMeta?.value && Array.isArray(pyqMeta.value) && pyqMeta.value.length > 0);
    return sc + tc + pc + mc + syllabus === 0 && !hasMeta;
}

export { sessionFingerprint };
