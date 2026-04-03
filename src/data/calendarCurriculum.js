/**
 * Standard CSE monthly pattern (Feb–Sep), plus October+ test series.
 * Late starts: months in the wave before planStartDate move to October catch-up.
 *
 * SESSION STRUCTURE (per day):
 *   L1  —  Lecture 1: Primary subject theory (2 h)
 *   L2  —  Lecture 2: Secondary subject theory (2 h)
 *   P1  —  PYQ Session 1: Primary subject PYQ practice (2 h)
 *   P2  —  PYQ Session 2: Secondary subject PYQ practice (2 h)
 *   M   —  Engineering Mathematics: Alternating track (2 h)
 *   R   —  Daily Reflection & Revision (30 min)
 */

import {
    getPrimarySubtopic,
    getSecondarySubtopic,
    getMathAlternatingTopic,
    MONTHLY_DETAILED,
} from './detailedCurriculum';

/** Calendar month 1–12 */
export const WAVE_MONTHS = [2, 3, 4, 5, 6, 7, 8, 9];

/**
 * @typedef {{ sub: string, label: string }} TrackCell
 */

/** @type {Record<number, { primary: TrackCell[], secondary: TrackCell[] }>} */
export const MONTHLY_TRACKS = {
    2: {
        primary: [{ sub: 'math', label: 'Fundamentals & Discrete Mathematics' }],
        secondary: [],
    },
    3: {
        primary: [{ sub: 'math', label: 'Discrete Mathematics' }],
        secondary: [{ sub: 'math', label: 'Linear Algebra' }],
    },
    4: {
        primary: [{ sub: 'math', label: 'Discrete Mathematics' }],
        secondary: [{ sub: 'math', label: 'Probability & Statistics' }],
    },
    5: {
        primary: [{ sub: 'digital', label: 'Digital Logic' }],
        secondary: [{ sub: 'math', label: 'Calculus' }],
    },
    6: {
        primary: [{ sub: 'coa', label: 'Computer Organization & Architecture' }],
        secondary: [
            { sub: 'c_prog', label: 'C Programming' },
            { sub: 'cn', label: 'Computer Networks' },
        ],
    },
    7: {
        primary: [{ sub: 'dbms', label: 'Database Management Systems' }],
        secondary: [{ sub: 'os', label: 'Operating Systems' }],
    },
    8: {
        primary: [{ sub: 'toc', label: 'Theory of Computation' }],
        secondary: [{ sub: 'ds', label: 'Data Structures' }],
    },
    9: {
        primary: [{ sub: 'compiler', label: 'Compiler Design' }],
        secondary: [{ sub: 'algo', label: 'Algorithms' }],
    },
};

export function parsePlanStart(planStartISO) {
    const d = new Date(`${planStartISO}T12:00:00`);
    return Number.isNaN(d.getTime()) ? new Date() : d;
}

export function addPlanDays(planStartISO, dayIndex0) {
    const d = parsePlanStart(planStartISO);
    d.setDate(d.getDate() + dayIndex0);
    d.setHours(0, 0, 0, 0);
    return d;
}

/** Calendar month 1–12 */
export function calendarMonthOf(date) {
    return date.getMonth() + 1;
}

/** Oct–Dec or Jan (continuation of test season into next calendar year) */
export function isTestSeriesPhase(date) {
    const m = date.getMonth();
    return m === 9 || m === 10 || m === 11 || m === 0;
}

/**
 * Prep-wave months (Feb–Sep) strictly before the start month are "missed"
 * and folded into October catch-up. Starting in October+ ⇒ entire wave missed.
 */
export function getMissedWaveMonths(planStartISO) {
    const d = parsePlanStart(planStartISO);
    const sm = calendarMonthOf(d);

    if (sm >= 10) {
        return [...WAVE_MONTHS];
    }

    return WAVE_MONTHS.filter((m) => m < sm);
}

/**
 * Flat catch-up blocks (one per track cell lost), ordered Feb→Sep.
 * @returns {Array<{ sub: string, label: string, role: string, sourceMonth: number }>}
 */
export function buildCatchupQueue(planStartISO) {
    const missed = getMissedWaveMonths(planStartISO);
    const blocks = [];
    for (const month of missed) {
        const t = MONTHLY_TRACKS[month];
        if (!t) continue;
        for (const c of t.primary) {
            blocks.push({ ...c, role: 'Track 1', sourceMonth: month });
        }
        for (const c of t.secondary) {
            blocks.push({ ...c, role: 'Track 2', sourceMonth: month });
        }
    }
    return blocks;
}

const MONTH_NAMES = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export function monthName(cm) {
    return MONTH_NAMES[cm] || '';
}

/**
 * Build 5 main sessions + 1 reflection for a wave day (Feb–Sep).
 * Format: 2 Lecture + 2 PYQ + 1 Engineering Math + 1 Reflection
 *
 * @param {number} calendarMonth   1-12 calendar month
 * @param {number} planDayNumber   1-indexed plan day
 * @param {string} planStartISO    YYYY-MM-DD plan start
 */
export function buildWaveDaySessions(calendarMonth, planDayNumber, planStartISO) {
    const t = MONTHLY_TRACKS[calendarMonth];
    if (!t) return null;

    const date = addPlanDays(planStartISO, planDayNumber - 1);
    const dayOfMonth = date.getDate();

    // ── Resolve primary & secondary subjects/subtopics ─────────────────────
    const pri = t.primary[0];
    const priDetail = getPrimarySubtopic(calendarMonth, dayOfMonth);

    // Secondary: handle June alternation and months with no secondary
    let secSub, secLabel, secSubtopic;
    if (calendarMonth === 6 && t.secondary.length > 1) {
        const secDetail = getSecondarySubtopic(calendarMonth, dayOfMonth);
        if (secDetail) {
            secSub = secDetail.sub;
            secLabel = secDetail.label;
            secSubtopic = secDetail.subtopic;
        } else {
            secSub = t.secondary[0].sub;
            secLabel = t.secondary[0].label;
            secSubtopic = `${secLabel}: Core Concepts`;
        }
    } else if (t.secondary.length > 0) {
        const sec = t.secondary[0];
        const secDetail = getSecondarySubtopic(calendarMonth, dayOfMonth);
        secSub = sec.sub;
        secLabel = sec.label;
        secSubtopic = secDetail?.subtopic || `${secLabel}: Core Concepts`;
    } else {
        // No secondary → duplicate primary for second lecture
        secSub = pri.sub;
        secLabel = pri.label;
        secSubtopic = priDetail
            ? `${pri.label}: Advanced Problem Solving & Proofs`
            : `${pri.label}: Deep Theory Review`;
    }

    // ── Primary subtopic (fall back to label if detailed data missing) ─────
    const priSubtopic = priDetail?.subtopic || `${pri.label}: Core Concepts & Theory`;

    // ── Engineering Mathematics alternating topic ──────────────────────────
    const mathTopic = getMathAlternatingTopic(planDayNumber);

    // ── Build 6 sessions ──────────────────────────────────────────────────
    return [
        // L1 — Lecture 1: Primary Subject Theory
        {
            id: 'L1',
            duration: 120,
            subject: pri.sub,
            topics: [
                priSubtopic,
                `📖 Deep theory, derivations & worked examples`,
                `📝 Create concise short notes for revision`,
            ],
            type: 'study',
        },
        // L2 — Lecture 2: Secondary Subject Theory
        {
            id: 'L2',
            duration: 120,
            subject: secSub,
            topics: [
                secSubtopic,
                `📖 Concept building & standard problem patterns`,
                `📝 Formula sheet & key theorem notes`,
            ],
            type: 'study',
        },
        // P1 — PYQ Session 1: Primary Subject PYQs
        {
            id: 'P1',
            duration: 120,
            subject: pri.sub,
            topics: [
                `PYQ Practice: ${priSubtopic.split(':')[0]}`,
                `⏱️ Timed drill — 25 GATE PYQs (strict 2h limit)`,
                `📊 Log accuracy, identify weak patterns`,
            ],
            type: 'pyq',
        },
        // P2 — PYQ Session 2: Secondary Subject PYQs
        {
            id: 'P2',
            duration: 120,
            subject: secSub,
            topics: [
                `PYQ Practice: ${secSubtopic.split(':')[0]}`,
                `⏱️ Timed drill — 25 GATE PYQs (strict 2h limit)`,
                `📊 Error tagging & mistake notebook entry`,
            ],
            type: 'pyq',
        },
        // M — Engineering Mathematics (alternating track)
        {
            id: 'M',
            duration: 120,
            subject: 'math',
            topics: [
                `Eng. Math — ${mathTopic.label}: ${mathTopic.subtopic}`,
                `📖 Theory + formula review + solved examples`,
                `📝 Practice 10–15 GATE-level numerical problems`,
            ],
            type: 'practice',
        },
        // R — Daily Reflection
        {
            id: 'R',
            duration: 30,
            subject: 'all',
            topics: [
                `Daily Reflection: Log 3 key mistakes & weak points`,
                `Set tomorrow's priority objectives`,
            ],
            type: 'revision',
        },
    ];
}
