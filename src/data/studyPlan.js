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

import { differenceInCalendarDays } from 'date-fns';
import {
    addPlanDays,
    monthName,
    parsePlanStart,
} from './calendarCurriculum';
import { getMathAlternatingTopic } from './detailedCurriculum';
import {
    buildDeepDivePrimarySequence,
    getDeepDiveDays,
    nextSubtopic,
    pickSecondarySubject,
} from './planScheduler';
import { TEST_SERIES } from './testSeries';
import { getExamDateForPlan } from '../utils/gateExamDates';

// Fallback length only — the real plan length is computed from the start date to
// the actual GATE exam date (see getPlanTotalDays).
export const STUDY_PLAN_TOTAL_DAYS = 311;
export const STUDY_PLAN_EXAM_DAY = STUDY_PLAN_TOTAL_DAYS;

/**
 * Number of plan days from the start date up to and including the GATE exam
 * date, so the plan spans exactly start → exam (Day N = exam day). Falls back
 * to the fixed length if the exam date can't be resolved sensibly.
 * @param {string} planStartISO - YYYY-MM-DD
 */
export function getPlanTotalDays(planStartISO) {
    const startISO = planStartISO || defaultPlanStart();
    const start = parsePlanStart(startISO);
    const exam = getExamDateForPlan(startISO);
    const total = differenceInCalendarDays(exam, start) + 1;
    if (!Number.isFinite(total) || total < 7) return STUDY_PLAN_TOTAL_DAYS;
    return total;
}

export function planDateKey(planStartISO, dayIndex0) {
    return addPlanDays(planStartISO, dayIndex0).toISOString().split('T')[0];
}

/** @param {string} planStartISO - YYYY-MM-DD */
export function getStudyPlanPhase(day, planStartISO) {
    const start = planStartISO || defaultPlanStart();
    const total = getPlanTotalDays(start);
    if (day >= total) {
        return {
            key: 'exam',
            title: 'GATE Exam Day',
            subtitle: 'Final execution: stay calm, strategic time management',
        };
    }
    const deepDiveDays = getDeepDiveDays(total);
    if (day <= deepDiveDays) {
        return {
            key: 'wave',
            title: 'Core Curriculum · Deep Dive',
            subtitle: 'Full-syllabus subject deep-dives, weighted by exam marks',
        };
    }
    // Test-series + revision tail, with the last ~2 weeks reserved for final revision.
    if (total - day <= 14) {
        return {
            key: 'testseries',
            title: 'Final Revision & Mocks',
            subtitle: 'Full-length mocks + rapid revision — no new theory',
        };
    }
    return {
        key: 'testseries',
        title: 'Test Series & Revision',
        subtitle: 'Timed mock tests + full-syllabus revision & error analysis',
    };
}

/**
 * A single deep-dive day: primary + secondary subject lectures & PYQ drills
 * (drawn from the weighted window schedule), plus daily Eng. Math and reflection.
 */
function buildDeepDiveDay(dayInPhase, planDayNumber, primarySeq, counters) {
    const primary = primarySeq[dayInPhase - 1];
    const secondary = pickSecondarySubject(dayInPhase, primary);
    const pri = nextSubtopic(primary, counters);
    const sec = nextSubtopic(secondary, counters);
    const mathTopic = getMathAlternatingTopic(planDayNumber);

    return [
        {
            id: 'L1',
            duration: 120,
            subject: primary,
            topics: [
                pri.subtopic,
                '📖 Deep theory, derivations & worked examples',
                '📝 Create concise short notes for revision',
            ],
            type: 'study',
        },
        {
            id: 'L2',
            duration: 120,
            subject: secondary,
            topics: [
                sec.subtopic,
                '📖 Concept building & standard problem patterns',
                '📝 Formula sheet & key theorem notes',
            ],
            type: 'study',
        },
        {
            id: 'P1',
            duration: 120,
            subject: primary,
            topics: [
                `PYQ Practice: ${pri.subtopic.split(':')[0]}`,
                '⏱️ Timed drill — 25 GATE PYQs (strict 2h limit)',
                '📊 Log accuracy, identify weak patterns',
            ],
            type: 'pyq',
        },
        {
            id: 'P2',
            duration: 120,
            subject: secondary,
            topics: [
                `PYQ Practice: ${sec.subtopic.split(':')[0]}`,
                '⏱️ Timed drill — 25 GATE PYQs (strict 2h limit)',
                '📊 Error tagging & mistake notebook entry',
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
function buildTestSeriesMain(ctx, day) {
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
    const start = planStartISO || defaultPlanStart();
    const totalDays = getPlanTotalDays(start);
    const examDay = totalDays;
    const deepDiveDays = getDeepDiveDays(totalDays);

    // Weighted deep-dive primary schedule covering ALL subjects across the window.
    const primarySeq = buildDeepDivePrimarySequence(deepDiveDays);
    const counters = {}; // per-subject subtopic progress
    const ctx = {
        catchupQueue: [], // full syllabus is covered in the deep-dive phase now
        catchIdx: { i: 0 },
        testIdx: { i: 0 },
    };

    const days = [];
    for (let day = 1; day <= totalDays; day++) {
        const dateString = planDateKey(start, day - 1);
        const phase = getStudyPlanPhase(day, start);

        let sessions;
        if (day === examDay) {
            sessions = [
                {
                    id: 'L1',
                    duration: 180,
                    subject: 'all',
                    topics: ['GATE Exam: Strategic execution, report early, keep mindset positive'],
                    type: 'exam',
                },
            ];
        } else if (day <= deepDiveDays) {
            sessions = buildDeepDiveDay(day, day, primarySeq, counters);
        } else {
            sessions = buildTestSeriesMain(ctx, day);
        }

        days.push({
            day,
            date: dateString,
            phase: phase.title,
            phaseSubtitle: phase.subtitle,
            sessions,
        });
    }

    return days;
}

export function defaultPlanStart() {
    // Anchor the plan to "today" (local time) so Day 1 is the day the user
    // first opens the app, rather than a frozen hardcoded date that rots over time.
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Fallback for code paths that do not yet read planStartDate */
export const STUDY_PLAN = buildStudyPlan(defaultPlanStart());

export const getDayPlan = (dayNumber, planStartISO) =>
    buildStudyPlan(planStartISO || defaultPlanStart()).find((d) => d.day === dayNumber);

export const getPlanByDate = (dateString, planStartISO) =>
    buildStudyPlan(planStartISO || defaultPlanStart()).find((d) => d.date === dateString);
