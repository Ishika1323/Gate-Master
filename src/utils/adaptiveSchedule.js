/**
 * Past-due sessions are spread evenly across remaining study days (not stacked on "tomorrow").
 * Completing a carry-over still marks the original (source) day + session in planProgress.
 */

import { STUDY_PLAN_TOTAL_DAYS } from '../data/studyPlan';

function isSessionMarkedDone(planProgress, dayNum, sessionId) {
    const dayProg = planProgress.find((p) => p.day === dayNum);
    return !!dayProg?.sessions?.find((s) => s.id === sessionId)?.completed;
}

/**
 * Incomplete sessions from plan days strictly before currentDay (committed past only).
 */
export function getPastBacklog(currentDay, planProgress, studyPlan) {
    if (currentDay <= 1) return [];

    const entries = [];
    for (let d = 1; d < currentDay; d++) {
        const template = studyPlan.find((x) => x.day === d);
        if (!template?.sessions?.length) continue;

        for (const sess of template.sessions) {
            if (sess.type === 'exam') continue;
            if (!isSessionMarkedDone(planProgress, d, sess.id)) {
                entries.push({
                    sourceDay: d,
                    sourceSessionId: sess.id,
                    duration: sess.duration,
                    subject: sess.subject,
                    topics: sess.topics || [],
                    type: sess.type,
                });
            }
        }
    }

    entries.sort((a, b) => {
        if (a.sourceDay !== b.sourceDay) return a.sourceDay - b.sourceDay;
        return String(a.sourceSessionId).localeCompare(String(b.sourceSessionId));
    });

    return entries;
}

/**
 * Spread backlog items evenly across [spreadStartDay, spreadEndDay] inclusive.
 * Oldest backlog items are placed on earlier spread days.
 */
function distributeBacklogAcrossDays(backlog, spreadStartDay, spreadEndDay) {
    /** @type {Record<number, typeof backlog>} */
    const byDay = {};
    if (
        !backlog.length ||
        spreadStartDay > spreadEndDay
    ) {
        return byDay;
    }

    const span = spreadEndDay - spreadStartDay + 1;
    const base = Math.floor(backlog.length / span);
    let extra = backlog.length % span;
    let idx = 0;

    for (let d = spreadStartDay; d <= spreadEndDay; d++) {
        const take = base + (extra > 0 ? 1 : 0);
        if (extra > 0) extra -= 1;
        byDay[d] = backlog.slice(idx, idx + take);
        idx += take;
    }

    return byDay;
}

/**
 * @returns {{ byDay: Record<number, Array>, backlogTotal: number, spreadStart: number, spreadEnd: number }}
 */
export function getSpreadAssignments(currentDay, planProgress, studyPlan) {
    const backlog = getPastBacklog(currentDay, planProgress, studyPlan);
    const lastStudyDay = STUDY_PLAN_TOTAL_DAYS - 1;
    // Include the current day in spread so backlog shows up TODAY
    const spreadStart = currentDay;
    const spreadEnd = lastStudyDay;

    /** @type {Record<number, typeof backlog>} */
    let byDay = {};

    if (backlog.length && spreadStart <= spreadEnd) {
        byDay = distributeBacklogAcrossDays(backlog, spreadStart, spreadEnd);
    } else if (backlog.length && spreadStart > spreadEnd && lastStudyDay >= 1) {
        byDay[lastStudyDay] = [...backlog];
    }

    return {
        byDay,
        backlogTotal: backlog.length,
        spreadStart: Math.min(spreadStart, lastStudyDay),
        spreadEnd,
    };
}

function toCarryRows(entries) {
    return (entries || []).map((c) => ({
        kind: 'carry',
        rowKey: `carry-${c.sourceDay}-${c.sourceSessionId}`,
        sourceDay: c.sourceDay,
        sourceSessionId: c.sourceSessionId,
        duration: c.duration,
        subject: c.subject,
        type: c.type,
        topics: [
            `Deferred from Day ${c.sourceDay} · Session ${c.sourceSessionId}`,
            ...(c.topics || []),
        ],
    }));
}

/**
 * Spread carry-overs only appear on days after `currentDay` (assignments start tomorrow).
 * Past / today views show template-only carry (none from spread).
 */
export function buildMergedScheduleRows(targetDay, currentDay, planProgress, studyPlan) {
    const templateDay = studyPlan.find((x) => x.day === targetDay);
    if (!templateDay) {
        return {
            mergedRows: [],
            assignedCarryCount: 0,
            backlogTotal: 0,
            spreadStart: currentDay + 1,
            spreadEnd: STUDY_PLAN_TOTAL_DAYS - 1,
        };
    }

    const { byDay, backlogTotal, spreadStart, spreadEnd } = getSpreadAssignments(
        currentDay,
        planProgress,
        studyPlan
    );

    // Show carry-overs on current day AND future days (not just future)
    const assigned = targetDay >= currentDay ? byDay[targetDay] || [] : [];
    const carryRows = toCarryRows(assigned);

    const baseRows = templateDay.sessions.map((sess) => ({
        kind: 'base',
        rowKey: `base-${targetDay}-${sess.id}`,
        sourceDay: targetDay,
        sourceSessionId: sess.id,
        duration: sess.duration,
        subject: sess.subject,
        type: sess.type,
        topics: sess.topics || [],
    }));

    return {
        mergedRows: [...carryRows, ...baseRows],
        assignedCarryCount: assigned.length,
        backlogTotal,
        spreadStart,
        spreadEnd,
    };
}

export function countCompletedInRows(rows, planProgress) {
    let n = 0;
    for (const row of rows) {
        if (isSessionMarkedDone(planProgress, row.sourceDay, row.sourceSessionId)) {
            n += 1;
        }
    }
    return n;
}

/**
 * Returns a summary of how backlog is distributed across days,
 * showing each day's assigned carry-over items with source info.
 * Useful for showing "Your backlog is spread across these days" on the current day.
 */
export function getBacklogDistributionSummary(currentDay, planProgress, studyPlan) {
    const { byDay, backlogTotal, spreadStart, spreadEnd } = getSpreadAssignments(
        currentDay,
        planProgress,
        studyPlan
    );

    const distribution = [];
    for (let d = spreadStart; d <= spreadEnd; d++) {
        const items = byDay[d];
        if (!items?.length) continue;
        distribution.push({
            day: d,
            count: items.length,
            items: items.map((item) => ({
                sourceDay: item.sourceDay,
                sessionId: item.sourceSessionId,
                subject: item.subject,
                topics: item.topics || [],
                type: item.type,
                duration: item.duration,
            })),
        });
    }

    return { distribution, backlogTotal, spreadStart, spreadEnd };
}
