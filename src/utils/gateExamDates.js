import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns';

/**
 * Nth Sunday of February for a calendar year (1 = first Sunday, 2 = second Sunday).
 */
export function getFebruaryNthSunday(year, ordinal) {
    const feb1 = new Date(year, 1, 1);
    const firstSundayDay = 1 + ((7 - feb1.getDay()) % 7);
    const dayOfMonth = firstSundayDay + (ordinal - 1) * 7;
    return startOfDay(new Date(year, 1, dayOfMonth));
}

/**
 * Next GATE CSE (1st Sunday Feb) and GATE DA (2nd Sunday Feb) cycle.
 * Year rolls forward only after the DA date has passed.
 */
export function getUpcomingComputedDates(now = new Date()) {
    const today = startOfDay(now);
    let year = today.getFullYear();
    let gateCse = getFebruaryNthSunday(year, 1);
    let gateDa = getFebruaryNthSunday(year, 2);
    while (today > gateDa) {
        year += 1;
        gateCse = getFebruaryNthSunday(year, 1);
        gateDa = getFebruaryNthSunday(year, 2);
    }
    return { gateCse, gateDa, year };
}

function parseEnvDate(iso) {
    if (!iso || typeof iso !== 'string') return null;
    try {
        const d = parseISO(iso.trim());
        return Number.isNaN(d.getTime()) ? null : startOfDay(d);
    } catch {
        return null;
    }
}

/**
 * Try Wikipedia summary for "GATE 20xx" to align the exam year with public info (CORS-friendly API).
 */
export async function fetchGateYearFromWikipedia() {
    const url =
        'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&explaintext&titles=Graduate_Aptitude_Test_in_Engineering';
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const page = data.query?.pages ? Object.values(data.query.pages)[0] : null;
    const text = page?.extract || '';
    const m = text.match(/GATE\s+(\d{4})/i);
    if (!m) return null;
    const y = Number.parseInt(m[1], 10);
    if (y < 2000 || y > 2100) return null;
    return y;
}

let resolveCache = null;
let resolveInflight = null;

/**
 * Env overrides (optional): VITE_GATE_CSE_DATE=2027-02-07, VITE_GATE_DA_DATE=2027-02-14
 * Result is cached for the session so Wikipedia is fetched at most once.
 */
export async function resolveGateExamDatesAsync(now = new Date()) {
    if (resolveCache) return resolveCache;
    if (!resolveInflight) {
        resolveInflight = (async () => {
            const cseEnv = parseEnvDate(import.meta.env.VITE_GATE_CSE_DATE);
            const daEnv = parseEnvDate(import.meta.env.VITE_GATE_DA_DATE);
            if (cseEnv && daEnv) {
                return {
                    gateCse: cseEnv,
                    gateDa: daEnv,
                    source: 'env',
                };
            }

            const fallback = getUpcomingComputedDates(now);
            try {
                const wikiYear = await fetchGateYearFromWikipedia();
                const currentY = now.getFullYear();
                if (wikiYear && wikiYear >= currentY) {
                    let gateCse = getFebruaryNthSunday(wikiYear, 1);
                    let gateDa = getFebruaryNthSunday(wikiYear, 2);
                    const today = startOfDay(now);
                    if (today > gateDa) {
                        const y2 = wikiYear + 1;
                        gateCse = getFebruaryNthSunday(y2, 1);
                        gateDa = getFebruaryNthSunday(y2, 2);
                    }
                    return {
                        gateCse,
                        gateDa,
                        source: 'wikipedia+year',
                    };
                }
            } catch {
                /* use formula */
            }

            return {
                gateCse: fallback.gateCse,
                gateDa: fallback.gateDa,
                source: 'formula',
            };
        })()
            .then((r) => {
                resolveCache = r;
                resolveInflight = null;
                return r;
            })
            .catch(() => {
                resolveInflight = null;
                const fb = getUpcomingComputedDates(now);
                const r = {
                    gateCse: fb.gateCse,
                    gateDa: fb.gateDa,
                    source: 'formula',
                };
                resolveCache = r;
                return r;
            });
    }
    return resolveInflight;
}

export function getDaysLeftLabel(examDate, now = new Date()) {
    const d = differenceInCalendarDays(startOfDay(examDate), startOfDay(now));
    if (d < 0) return { text: 'Ended', days: d };
    if (d === 0) return { text: 'Today', days: 0 };
    return { text: `${d} days left`, days: d };
}
