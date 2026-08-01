/**
 * Plan registry — resolves which study plan drives the app.
 *
 * The default plan (dynamically sized from the user's start date to exam
 * day) stays untouched; user profiles can point at a custom plan (e.g.
 * Ishika's imported 28-week battle plan) via their `planId`. Every consumer
 * (store, hooks, dashboards) resolves the plan through this registry so
 * switching users switches plans cleanly.
 */

import {
    buildStudyPlan,
    defaultPlanStart,
    getPlanTotalDays as getDefaultPlanTotalDays,
} from './studyPlan';
import {
    buildIshikaStudyPlan,
    ISHIKA_PLAN_ID,
    ISHIKA_PLAN_NAME,
    ISHIKA_PLAN_START,
    ISHIKA_PLAN_TOTAL_DAYS,
} from './ishikaWeeklyPlan';

export const DEFAULT_PLAN_ID = 'gatemaster-default';

export function buildPlanById(planId, planStartISO) {
    if (planId === ISHIKA_PLAN_ID) {
        return buildIshikaStudyPlan();
    }
    return buildStudyPlan(planStartISO || defaultPlanStart());
}

export function getPlanTotalDays(planId, planStartISO) {
    if (planId === ISHIKA_PLAN_ID) {
        return ISHIKA_PLAN_TOTAL_DAYS;
    }
    return getDefaultPlanTotalDays(planStartISO || defaultPlanStart());
}

export function getPlanMeta(planId, planStartISO) {
    if (planId === ISHIKA_PLAN_ID) {
        return {
            id: ISHIKA_PLAN_ID,
            name: ISHIKA_PLAN_NAME,
            start: ISHIKA_PLAN_START,
            totalDays: ISHIKA_PLAN_TOTAL_DAYS,
            description:
                '28-week dual-paper (CSE + DA) battle plan · Jul 27, 2026 » Feb 6, 2027 · fixed dawn/evening frame',
        };
    }
    const start = planStartISO || defaultPlanStart();
    const totalDays = getDefaultPlanTotalDays(start);
    return {
        id: DEFAULT_PLAN_ID,
        name: `${totalDays}-Day GATE CSE Roadmap`,
        start,
        totalDays,
        description: 'Phased, subject-wise sessions with daily math, aptitude, and revision.',
    };
}
