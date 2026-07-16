// Weak-topic prioritization engine.
//
// Combines every weakness signal the app collects into one per-subject priority
// score, so the daily plan and the Gemini schedule can push weak areas ahead of
// already-completed / strong ones. A tunable "focus scale" controls how hard
// weak areas outrank the rest.
//
// Signals combined (per the product decision "combine all signals"):
//   - Topic Strength Board marks (weak / revision / strong)   [topicStrengths]
//   - Logged PYQ accuracy per subject (<60% = weak)           [pyqAttempts]
//   - subjectStats.needsOptimization flag                     [subjectStats]
//   - Completion ratio (completed topics deprioritize)        [completedSyllabusTopics]

import { SUBJECTS } from '../data/subjects';

// SYLLABUS_DATA section ids (used by the Topic Board & syllabus grid) mapped to
// the canonical SUBJECTS ids that the study plan sessions and PYQ log use.
// Section '12' (GATE DA) has no CSE-subject equivalent and is intentionally omitted.
export const SYLLABUS_SECTION_TO_SUBJECT = {
    '1': 'math',
    '2': 'c_prog',
    '3': 'ds',
    '4': 'algo',
    '5': 'digital',
    '6': 'coa',
    '7': 'os',
    '8': 'dbms',
    '9': 'cn',
    '10': 'toc',
    '11': 'compiler',
    '13': 'aptitude',
};

// Tunable "personalisation scale". weakMultiplier scales how strongly weak/
// revision signals outrank completed & strong topics; reorder controls whether
// the local daily agenda is physically resorted by priority.
export const WEAK_FOCUS_LEVELS = {
    balanced: {
        key: 'balanced',
        label: 'Balanced',
        weakMultiplier: 1,
        reorder: false,
        description: 'Follow the planned order; only flag weak areas.',
    },
    high: {
        key: 'high',
        label: 'High',
        weakMultiplier: 2,
        reorder: true,
        description: 'Surface weak topics first and lighten completed ones.',
    },
    aggressive: {
        key: 'aggressive',
        label: 'Aggressive',
        weakMultiplier: 3.5,
        reorder: true,
        description: 'Aggressively front-load weak areas over everything else.',
    },
};

export const DEFAULT_WEAK_FOCUS = 'high';

export function getFocusLevel(focus) {
    return WEAK_FOCUS_LEVELS[focus] || WEAK_FOCUS_LEVELS[DEFAULT_WEAK_FOCUS];
}

// Base signal weights (before the focus multiplier is applied to weak signals).
const W = {
    weakMark: 30,
    revisionMark: 12,
    strongMark: -10,
    lowAccuracy: 45, // accuracy < 60%
    midAccuracy: 20, // 60% <= accuracy < 75%
    highAccuracy: -12, // accuracy >= 85%
    needsOptimization: 25,
    completedPenaltyMax: -25, // fully-completed subject
};

function subjectIdList() {
    return Object.values(SUBJECTS).map((s) => s.id);
}

/**
 * Aggregate Topic Board marks per canonical subject id.
 * topicStrengths keys look like `${sectionId}::${topicId}::${subtopic}`.
 */
function tallyTopicStrengths(topicStrengths = {}) {
    const bySubject = {};
    for (const [key, strength] of Object.entries(topicStrengths)) {
        const sectionId = String(key).split('::')[0];
        const subjectId = SYLLABUS_SECTION_TO_SUBJECT[sectionId];
        if (!subjectId) continue;
        if (!bySubject[subjectId]) bySubject[subjectId] = { weak: 0, revision: 0, strong: 0 };
        if (strength === 'weak') bySubject[subjectId].weak += 1;
        else if (strength === 'revision') bySubject[subjectId].revision += 1;
        else if (strength === 'strong') bySubject[subjectId].strong += 1;
    }
    return bySubject;
}

/** Aggregate logged PYQ accuracy per subject id. */
function tallyPyqAccuracy(pyqAttempts = []) {
    const bySubject = {};
    for (const a of pyqAttempts) {
        if (!a?.subject) continue;
        if (!bySubject[a.subject]) bySubject[a.subject] = { correct: 0, total: 0 };
        bySubject[a.subject].correct += a.correct || 0;
        bySubject[a.subject].total += a.total || 0;
    }
    const acc = {};
    for (const [sub, v] of Object.entries(bySubject)) {
        acc[sub] = v.total > 0 ? (v.correct / v.total) * 100 : null;
    }
    return acc;
}

/** Completion ratio per subject id from syllabus-topic completion ids. */
function tallyCompletion(completedSyllabusTopics = []) {
    // completed ids look like `${sectionId}-${topicId}-${idx}` -> section is first segment
    const bySubject = {};
    for (const uid of completedSyllabusTopics) {
        const sectionId = String(uid).split('-')[0];
        const subjectId = SYLLABUS_SECTION_TO_SUBJECT[sectionId];
        if (!subjectId) continue;
        bySubject[subjectId] = (bySubject[subjectId] || 0) + 1;
    }
    return bySubject;
}

/**
 * Build a per-subject priority map.
 *
 * @returns {Record<string, {
 *   subjectId: string, score: number, isWeak: boolean,
 *   weakCount: number, revisionCount: number, accuracy: number|null,
 *   needsOptimization: boolean, reasons: string[]
 * }>}
 */
export function buildSubjectPriority({
    topicStrengths = {},
    pyqAttempts = [],
    subjectStats = {},
    completedSyllabusTopics = [],
    focus = DEFAULT_WEAK_FOCUS,
} = {}) {
    const level = getFocusLevel(focus);
    const mult = level.weakMultiplier;

    const strengthTally = tallyTopicStrengths(topicStrengths);
    const accuracyBySubject = tallyPyqAccuracy(pyqAttempts);
    const completedCounts = tallyCompletion(completedSyllabusTopics);

    const map = {};
    for (const subjectId of subjectIdList()) {
        const marks = strengthTally[subjectId] || { weak: 0, revision: 0, strong: 0 };
        const accuracy = accuracyBySubject[subjectId] ?? null;
        const stats = subjectStats[subjectId] || {};
        const needsOptimization = !!stats.needsOptimization;
        const reasons = [];

        let score = 0;

        // Topic Board marks (weak/revision boosted by the focus scale).
        if (marks.weak) {
            score += marks.weak * W.weakMark * mult;
            reasons.push(`${marks.weak} weak topic${marks.weak === 1 ? '' : 's'} on board`);
        }
        if (marks.revision) score += marks.revision * W.revisionMark * mult;
        if (marks.strong) score += marks.strong * W.strongMark;

        // Logged PYQ accuracy.
        if (accuracy !== null) {
            if (accuracy < 60) {
                score += W.lowAccuracy * mult;
                reasons.push(`${Math.round(accuracy)}% PYQ accuracy`);
            } else if (accuracy < 75) {
                score += W.midAccuracy * mult;
                reasons.push(`${Math.round(accuracy)}% PYQ accuracy`);
            } else if (accuracy >= 85) {
                score += W.highAccuracy;
            }
        }

        // Explicit optimization flag from the PYQ sync.
        if (needsOptimization) {
            score += W.needsOptimization * mult;
            if (!reasons.length) reasons.push('flagged for optimization');
        }

        // Deprioritize subjects that are largely completed.
        const completed = completedCounts[subjectId] || 0;
        if (completed > 0) {
            // Soft penalty that grows with completion, capped.
            score += Math.max(W.completedPenaltyMax, -completed * 2);
        }

        const isWeak = marks.weak > 0 || (accuracy !== null && accuracy < 60) || needsOptimization;

        map[subjectId] = {
            subjectId,
            score: Math.round(score),
            isWeak,
            weakCount: marks.weak,
            revisionCount: marks.revision,
            accuracy,
            needsOptimization,
            reasons,
        };
    }

    return map;
}

/** Ranked list (highest priority first) of subjects that are in the weak zone. */
export function getPrioritizedWeakSubjects(priorityMap) {
    return Object.values(priorityMap)
        .filter((p) => p.isWeak)
        .sort((a, b) => b.score - a.score)
        .map((p) => {
            const subject = SUBJECTS[Object.keys(SUBJECTS).find((k) => SUBJECTS[k].id === p.subjectId)];
            return { ...p, name: subject?.name || p.subjectId };
        });
}

/**
 * Stable-sort base plan rows so higher-priority (weaker) subjects come first.
 * Carry-over rows keep their leading position; only same-kind rows are reordered.
 */
export function sortRowsByPriority(rows, priorityMap) {
    const scoreOf = (row) => priorityMap[row.subject]?.score ?? 0;
    const kindRank = (row) => (row.kind === 'carry' ? 0 : 1);
    return [...rows]
        .map((row, index) => ({ row, index }))
        .sort((a, b) => {
            if (kindRank(a.row) !== kindRank(b.row)) return kindRank(a.row) - kindRank(b.row);
            const diff = scoreOf(b.row) - scoreOf(a.row);
            if (diff !== 0) return diff;
            return a.index - b.index; // stable within equal priority
        })
        .map((x) => x.row);
}
