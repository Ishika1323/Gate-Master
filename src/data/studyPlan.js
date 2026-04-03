/**
 * 311-day planner: Structured multi-track GATE preparation.
 * (Feb–Sep) monthly deep-dives, October+ test series.
 * Dates follow planStartDate from the store.
 *
 * DAILY SESSION FORMAT:
 *   L1  — Lecture 1: Primary subject (2 h)
 *   L2  — Lecture 2: Secondary subject (2 h)
 *   P1  — PYQ Session 1: Primary subject PYQs (2 h)
 *   P2  — PYQ Session 2: Secondary subject PYQs (2 h)
 *   M   — Engineering Mathematics: Alternating topic (2 h)
 *   R   — Daily Reflection & Mistake Logging (30 min)
 */

import {
    addPlanDays,
    buildCatchupQueue,
    buildWaveDaySessions,
    calendarMonthOf,
    getMissedWaveMonths,
    isTestSeriesPhase,
    monthName,
    WAVE_MONTHS,
} from './calendarCurriculum';
import { getMathAlternatingTopic } from './detailedCurriculum';
import { TEST_SERIES } from './testSeries';

export const STUDY_PLAN_TOTAL_DAYS = 311;
export const STUDY_PLAN_EXAM_DAY = STUDY_PLAN_TOTAL_DAYS;

export function planDateKey(planStartISO, dayIndex0) {
    return addPlanDays(planStartISO, dayIndex0).toISOString().split('T')[0];
}

/** @param {string} planStartISO - YYYY-MM-DD */
export function getStudyPlanPhase(day, planStartISO) {
    const start = planStartISO || new Date().toISOString().split('T')[0];
    if (day >= STUDY_PLAN_EXAM_DAY) {
        return {
            key: 'exam',
            title: 'GATE Exam Day',
            subtitle: 'Final execution: stay calm, strategic time management',
        };
    }
    const date = addPlanDays(start, day - 1);
    const cm = calendarMonthOf(date);
    if (isTestSeriesPhase(date)) {
        const missed = getMissedWaveMonths(start);
        return {
            key: 'testseries',
            title: `Test Season · ${monthName(cm)}`,
            subtitle:
                missed.length > 0
                    ? `Timed mocks + Catch-up for: ${missed.map(monthName).join(', ')}`
                    : 'Systematic Mock Tests & performance profiling',
        };
    }
    if (WAVE_MONTHS.includes(cm)) {
        return {
            key: 'wave',
            title: `${monthName(cm)} · Core Curriculum`,
            subtitle: 'Intensive monthly subject deep-dives',
        };
    }
    return {
        key: 'ramp',
        title: 'Foundation Ramp-up',
        subtitle: 'Building core habits: Math, Aptitude & Problem Solving',
    };
}

function bridgeRampSessions(day) {
    const mathTopic = getMathAlternatingTopic(day);
    return [
        {
            id: 'L1',
            duration: 120,
            subject: 'ds',
            topics: [
                'Data Structures Foundation: Arrays, Linked Lists & Complexity',
                '📖 Big-O analysis of standard operations',
                '📝 Create template notes for DS patterns',
            ],
            type: 'study',
        },
        {
            id: 'L2',
            duration: 120,
            subject: 'math',
            topics: [
                'Discrete Math Foundations: Set Theory & Logic Basics',
                '📖 Proof techniques: Direct, Contradiction, Induction',
                '📝 Key definitions & theorem list',
            ],
            type: 'study',
        },
        {
            id: 'P1',
            duration: 120,
            subject: 'ds',
            topics: [
                'PYQ Practice: Stack & Queue Implementations',
                '⏱️ Timed drill — 25 GATE PYQs',
                '📊 Mistake log & pattern identification',
            ],
            type: 'pyq',
        },
        {
            id: 'P2',
            duration: 120,
            subject: 'math',
            topics: [
                'PYQ Practice: Discrete Mathematics Basics',
                '⏱️ Timed drill — 25 GATE PYQs',
                '📊 Error tagging & accuracy tracking',
            ],
            type: 'pyq',
        },
        {
            id: 'M',
            duration: 120,
            subject: 'math',
            topics: [
                `Eng. Math — ${mathTopic.label}: ${mathTopic.subtopic}`,
                '📖 Theory + formula review + solved examples',
                '📝 Practice 10–15 GATE-level numerical problems',
            ],
            type: 'practice',
        },
        {
            id: 'R',
            duration: 30,
            subject: 'all',
            topics: [
                'Daily Reflection: Log 3 key mistakes & weak points',
                'Set tomorrow\'s priority objectives',
            ],
            type: 'revision',
        },
    ];
}

/**
 * @param {{ catchupQueue: Array, catchIdx: { i: number }, testIdx: { i: number } }} ctx
 */
function buildTestSeriesMain(ctx, day, date) {
    const { catchupQueue, catchIdx, testIdx } = ctx;
    const mathTopic = getMathAlternatingTopic(day);

    let sessionL1;
    if (catchIdx.i < catchupQueue.length) {
        const b = catchupQueue[catchIdx.i];
        catchIdx.i += 1;
        sessionL1 = {
            id: 'L1',
            duration: 120,
            subject: b.sub,
            topics: [
                `Catch-up: ${b.label} (missed from ${monthName(b.sourceMonth)})`,
                '📖 Compressed review of key topics & theorems',
                '📝 Selective Top-50 PYQ rapid practice',
            ],
            type: 'study',
        };
    } else {
        sessionL1 = {
            id: 'L1',
            duration: 120,
            subject: 'all',
            topics: [
                'Subject-wise Revision Sweep (High-weightage Topics)',
                '📖 Formula Sheet Active Recall & Flash Cards',
                '📝 Conceptual Gap Analysis (No new theory)',
            ],
            type: 'revision',
        };
    }

    // Second catch-up or revision
    let sessionL2;
    if (catchIdx.i < catchupQueue.length) {
        const b = catchupQueue[catchIdx.i];
        catchIdx.i += 1;
        sessionL2 = {
            id: 'L2',
            duration: 120,
            subject: b.sub,
            topics: [
                `Catch-up: ${b.label} (missed from ${monthName(b.sourceMonth)})`,
                '📖 Rapid review & key pattern recognition',
                '📝 Weak-point identification & targeted practice',
            ],
            type: 'study',
        };
    } else {
        sessionL2 = {
            id: 'L2',
            duration: 120,
            subject: 'all',
            topics: [
                'Cross-subject Revision: Interconnected Concepts',
                '📖 Review notes from previous months',
                '📝 Fill gaps identified from mock test analysis',
            ],
            type: 'revision',
        };
    }

    const test = TEST_SERIES[testIdx.i % TEST_SERIES.length];
    testIdx.i += 1;
    const bDur = Math.min(test.durationMin, 180);

    const sessionP1 = {
        id: 'P1',
        duration: bDur,
        subject: 'all',
        topics: [
            `Mock Test: ${test.name}`,
            `📋 Focus: ${test.topic}`,
            `⏱️ ${test.marks} marks · Strict timer execution`,
        ],
        type: 'test',
    };

    const sessionP2 = {
        id: 'P2',
        duration: Math.min(120, Math.max(60, 240 - bDur)),
        subject: 'all',
        topics: [
            'Post-test: Deep Error Taxonomy & Analysis',
            '📊 Numerical/Calculative mistake review',
            '📝 Solution review for every missed question',
        ],
        type: 'revision',
    };

    const sessionM = {
        id: 'M',
        duration: 120,
        subject: 'math',
        topics: [
            `Eng. Math — ${mathTopic.label}: ${mathTopic.subtopic}`,
            '📖 Theory + formula review + solved examples',
            '📝 Practice 10–15 GATE-level numerical problems',
        ],
        type: 'practice',
    };

    const sessionR = {
        id: 'R',
        duration: 30,
        subject: 'all',
        topics: [
            'Daily Reflection: Log 3 key mistakes & weak points',
            'Set tomorrow\'s priority objectives',
        ],
        type: 'revision',
    };

    return [sessionL1, sessionL2, sessionP1, sessionP2, sessionM, sessionR];
}

/**
 * Build full plan from canonical start date (store planStartDate).
 */
export function buildStudyPlan(planStartISO) {
    const start = planStartISO || new Date().toISOString().split('T')[0];
    const catchupQueue = buildCatchupQueue(start);
    const ctx = {
        catchupQueue,
        catchIdx: { i: 0 },
        testIdx: { i: 0 },
    };

    const days = [];
    for (let day = 1; day <= STUDY_PLAN_TOTAL_DAYS; day++) {
        const date = addPlanDays(start, day - 1);
        const dateString = planDateKey(start, day - 1);
        const phase = getStudyPlanPhase(day, start);

        if (day === STUDY_PLAN_EXAM_DAY) {
            days.push({
                day,
                date: dateString,
                phase: phase.title,
                phaseSubtitle: phase.subtitle,
                sessions: [
                    {
                        id: 'L1',
                        duration: 180,
                        subject: 'all',
                        topics: ['GATE Exam: Strategic execution, report early, keep mindset positive'],
                        type: 'exam',
                    },
                ],
            });
            continue;
        }

        let sessions;
        const cm = calendarMonthOf(date);

        if (isTestSeriesPhase(date)) {
            sessions = buildTestSeriesMain(ctx, day, date);
        } else if (WAVE_MONTHS.includes(cm)) {
            sessions = buildWaveDaySessions(cm, day, start);
        } else {
            sessions = bridgeRampSessions(day);
        }

        days.push({
            day,
            date: dateString,
            phase: phase.title,
            phaseSubtitle: phase.subtitle,
            sessions: sessions || bridgeRampSessions(day),
        });
    }

    return days;
}

export function defaultPlanStart() {
    return '2026-04-03';
}

/** Fallback for code paths that do not yet read planStartDate */
export const STUDY_PLAN = buildStudyPlan(defaultPlanStart());

export const getDayPlan = (dayNumber, planStartISO) =>
    buildStudyPlan(planStartISO || defaultPlanStart()).find((d) => d.day === dayNumber);

export const getPlanByDate = (dateString, planStartISO) =>
    buildStudyPlan(planStartISO || defaultPlanStart()).find((d) => d.date === dateString);
