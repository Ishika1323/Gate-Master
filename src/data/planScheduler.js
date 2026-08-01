/**
 * Window-relative plan scheduler.
 *
 * Instead of locking subject deep-dives to absolute calendar months (which
 * short-changed whichever subjects fell outside the start→exam months), this
 * distributes ALL GATE CSE subjects' deep-dives across the available window,
 * weighted by exam marks, so every subject gets proper coverage before the
 * test-series + revision phase that ends on exam day.
 */

import { MONTHLY_DETAILED } from './detailedCurriculum';

// Approximate GATE CSE mark weightage per canonical subject id (drives how many
// deep-dive days each subject earns).
export const SUBJECT_WEIGHTAGE = {
    aptitude: 15,
    math: 13,
    ds: 10,
    algo: 10,
    os: 8,
    coa: 8,
    dbms: 8,
    cn: 8,
    toc: 8,
    digital: 6,
    compiler: 6,
    c_prog: 5,
};

// Pedagogical study order: foundations first, then core theory, then applied.
export const SUBJECT_ORDER = [
    'math', 'c_prog', 'digital', 'ds', 'coa', 'algo', 'toc', 'os', 'dbms', 'cn', 'compiler', 'aptitude',
];

// Curated General Aptitude deep-dive topics (not present in MONTHLY_DETAILED).
const APTITUDE_SUBTOPICS = [
    'Quantitative: Number System, HCF/LCM & Divisibility',
    'Quantitative: Percentages, Profit & Loss, Discounts',
    'Quantitative: Ratio, Proportion & Partnership',
    'Quantitative: Averages, Ages & Mixtures',
    'Quantitative: Time, Speed, Distance & Work',
    'Quantitative: Permutations, Combinations & Probability',
    'Data Interpretation: Tables, Bar/Line Charts & Pie Charts',
    'Data Interpretation: Caselets & Data Sufficiency',
    'Logical Reasoning: Series, Analogies & Coding-Decoding',
    'Logical Reasoning: Blood Relations, Directions & Syllogisms',
    'Verbal Ability: Reading Comprehension & Critical Reasoning',
    'Verbal Ability: Grammar, Vocabulary & Sentence Correction',
    'Aptitude: Mixed Timed GATE PYQ Set',
];

/**
 * Flatten MONTHLY_DETAILED into per-subject ordered subtopic lists (+ aptitude).
 * @returns {Record<string, { label: string, subtopics: string[] }>}
 */
function buildSubjectCurriculum() {
    const map = {};
    const add = (sub, label, subtopics) => {
        if (!sub || !subtopics?.length) return;
        if (!map[sub]) map[sub] = { label, subtopics: [] };
        map[sub].subtopics.push(...subtopics);
    };

    for (const month of Object.values(MONTHLY_DETAILED)) {
        if (month.primary) add(month.primary.sub, month.primary.label, month.primary.subtopics);
        if (month.secondary) {
            add(month.secondary.sub, month.secondary.label, month.secondary.subtopics);
            if (month.secondary.secondaryAlt && month.secondary.subtopicsAlt) {
                add(month.secondary.secondaryAlt.sub, month.secondary.secondaryAlt.label, month.secondary.subtopicsAlt);
            }
        }
    }

    map.aptitude = { label: 'General Aptitude', subtopics: APTITUDE_SUBTOPICS };
    return map;
}

export const SUBJECT_CURRICULUM = buildSubjectCurriculum();

/** Subjects that actually have deep-dive content, in study order. */
export function getScheduledSubjects() {
    return SUBJECT_ORDER.filter((s) => SUBJECT_CURRICULUM[s]?.subtopics?.length);
}

/**
 * How many of the plan's days are the subject deep-dive phase (~70%), leaving a
 * test-series + revision tail before the exam. Degrades gracefully for short
 * windows.
 * @param {number} totalDays - full plan length (incl. exam day)
 */
export function getDeepDiveDays(totalDays) {
    const studyDays = Math.max(totalDays - 1, 1); // exclude exam day
    let deep = Math.round(studyDays * 0.7);
    const minTest = Math.min(30, Math.floor(studyDays * 0.25));
    deep = Math.min(deep, studyDays - minTest);
    return Math.max(deep, 1);
}

/**
 * Allocate deep-dive days per subject, proportional to weightage, with a floor
 * so even light subjects get real coverage, reconciled to sum exactly to
 * deepDiveDays.
 * @returns {Record<string, number>}
 */
export function allocateSubjectDays(deepDiveDays) {
    const subjects = getScheduledSubjects();
    const totalW = subjects.reduce((a, s) => a + (SUBJECT_WEIGHTAGE[s] || 5), 0);
    const MIN_DAYS = Math.min(4, Math.max(1, Math.floor(deepDiveDays / (subjects.length * 2))));

    const alloc = {};
    let assigned = 0;
    for (const s of subjects) {
        const d = Math.max(MIN_DAYS, Math.round((deepDiveDays * (SUBJECT_WEIGHTAGE[s] || 5)) / totalW));
        alloc[s] = d;
        assigned += d;
    }

    // Reconcile to hit deepDiveDays exactly — adjust the highest-weight subjects first.
    const byWeightDesc = [...subjects].sort((a, b) => (SUBJECT_WEIGHTAGE[b] || 5) - (SUBJECT_WEIGHTAGE[a] || 5));
    let diff = deepDiveDays - assigned;
    let i = 0;
    while (diff !== 0 && subjects.length) {
        const s = byWeightDesc[i % byWeightDesc.length];
        if (diff > 0) {
            alloc[s] += 1;
            diff -= 1;
        } else if (alloc[s] > MIN_DAYS) {
            alloc[s] -= 1;
            diff += 1;
        }
        i += 1;
        // Safety: if every subject is at the floor and we still need to remove, break.
        if (i > subjects.length * 1000) break;
    }
    return alloc;
}

/**
 * Ordered primary-subject sequence for the deep-dive phase (blocks per subject,
 * in study order, sized by allocateSubjectDays).
 * @returns {string[]} length === deepDiveDays
 */
export function buildDeepDivePrimarySequence(deepDiveDays) {
    const subjects = getScheduledSubjects();
    const alloc = allocateSubjectDays(deepDiveDays);
    const seq = [];
    for (const s of subjects) {
        for (let i = 0; i < alloc[s]; i++) seq.push(s);
    }
    // Guard length (rounding safety).
    if (seq.length > deepDiveDays) return seq.slice(0, deepDiveDays);
    while (seq.length < deepDiveDays) seq.push(subjects[subjects.length - 1]);
    return seq;
}

/** Secondary subject for a deep-dive day — rotates for variety, never equals primary. */
export function pickSecondarySubject(dayInPhase, primary) {
    const subjects = getScheduledSubjects();
    let idx = (dayInPhase * 2) % subjects.length;
    if (subjects[idx] === primary) idx = (idx + 1) % subjects.length;
    return subjects[idx];
}

/**
 * Next subtopic for a subject, progressing through its list across the plan.
 * `counters` is a mutable map of per-subject visit counts.
 */
export function nextSubtopic(subjectId, counters) {
    const data = SUBJECT_CURRICULUM[subjectId];
    if (!data?.subtopics?.length) return { label: subjectId, subtopic: 'Core Concepts & Practice' };
    const n = counters[subjectId] || 0;
    counters[subjectId] = n + 1;
    return { label: data.label, subtopic: data.subtopics[n % data.subtopics.length] };
}
