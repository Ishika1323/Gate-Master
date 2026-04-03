/**
 * Day Boundary Utility
 *
 * The study day starts at 5:00 AM. Any time before 5 AM is still
 * considered part of the previous calendar day.
 *
 * Example: 2026-04-04 at 01:57 AM → treated as 2026-04-03.
 *          2026-04-04 at 05:00 AM → treated as 2026-04-04.
 */

const DAY_START_HOUR = 5; // 5:00 AM

/**
 * Returns a Date object representing the "effective today" based on the
 * 5 AM boundary. If the current time is before 5 AM, the effective date
 * is yesterday. The returned date has hours zeroed to midnight.
 *
 * @param {Date} [now] - Optional. Defaults to new Date().
 * @returns {Date} The effective calendar date (midnight-zeroed).
 */
export function getEffectiveToday(now = new Date()) {
    const effective = new Date(now);

    // Day strictly reflects physical calendar day to ensure correct
    // identification of past days on the planner UI.
    effective.setHours(0, 0, 0, 0);
    return effective;
}

export { DAY_START_HOUR };
