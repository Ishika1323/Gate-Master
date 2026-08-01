/**
 * Plan registry — resolves which study plan drives the app.
 *
 * The default 311-day GateMaster plan stays untouched; user profiles can
 * point at a custom plan (e.g. Ishika's imported 28-week battle plan) via
 * their `planId`. Every consumer (store, hooks, dashboards) resolves the
 * plan through this registry so switching users switches plans cleanly.
 */

import { buildStudyPlan, defaultPlanStart, STUDY_PLAN_TOTAL_DAYS } from './studyPlan';
import {
    buildIshikaStudyPlan,
    ISHIKA_PLAN_ID,
    ISHIKA_PLAN_NAME,
    ISHIKA_PLAN_START,
    ISHIKA_PLAN_TOTAL_DAYS,
} from './ishikaWeeklyPlan';

export const DEFAULT_PLAN_ID = 'gatemaster-311';

export function buildPlanById(planId, planStartISO) {
    if (planId === ISHIKA_PLAN_ID) {
        return buildIshikaStudyPlan();
    }
    return buildStudyPlan(planStartISO || defaultPlanStart());
}

export function getPlanTotalDays(planId) {
    if (planId === ISHIKA_PLAN_ID) {
        return ISHIKA_PLAN_TOTAL_DAYS;
    }
    return STUDY_PLAN_TOTAL_DAYS;
}

export function getPlanMeta(planId) {
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
    return {
        id: DEFAULT_PLAN_ID,
        name: `${STUDY_PLAN_TOTAL_DAYS}-Day GATE CSE Roadmap`,
        start: defaultPlanStart(),
        totalDays: STUDY_PLAN_TOTAL_DAYS,
        description: 'Phased, subject-wise sessions with daily math, aptitude, and revision.',
    };
}
