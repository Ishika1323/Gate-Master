/**
 * Local credential auth — works with or without Supabase configured.
 *
 * Accounts are seeded here (passwords stored as SHA-256 hashes, verified via
 * Web Crypto). A successful sign-in produces a session object shaped like a
 * Supabase session ({ user: { email, user_metadata } }) so the rest of the
 * app treats it identically; `isLocal: true` marks it so the Supabase auth
 * listener never clobbers it.
 *
 * Each profile can carry a `planId` + `planStartDate`, which the store
 * applies on sign-in to activate that user's personal study plan.
 */

import { ISHIKA_PLAN_ID, ISHIKA_PLAN_START } from '../data/ishikaWeeklyPlan';

const LOCAL_USERS = [
    {
        id: 'local-ishika-bhatnagar',
        email: 'ishika.bhatnagar@geti.education',
        // SHA-256("IshikaGATE@2027")
        passwordHash: '0b666cf5fda509f331c9179e96016bc6886e35caddf440bc8478af4f6592a304',
        fullName: 'Ishika Bhatnagar',
        planId: ISHIKA_PLAN_ID,
        planStartDate: ISHIKA_PLAN_START,
    },
];

async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

export function findLocalUser(email) {
    const normalized = (email || '').trim().toLowerCase();
    return LOCAL_USERS.find((u) => u.email === normalized) || null;
}

/**
 * @returns {Promise<object>} session object compatible with setAuth()
 * @throws {Error} when the email is unknown or the password does not match
 */
export async function signInLocal(email, password) {
    const user = findLocalUser(email);
    if (!user) {
        throw new Error('No account found for this email.');
    }
    const hash = await sha256Hex(password || '');
    if (hash !== user.passwordHash) {
        throw new Error('Incorrect password. Please try again.');
    }

    return {
        isLocal: true,
        access_token: `local-${user.id}`,
        user: {
            id: user.id,
            email: user.email,
            user_metadata: {
                full_name: user.fullName,
                plan_id: user.planId,
                plan_start_date: user.planStartDate,
            },
        },
    };
}
