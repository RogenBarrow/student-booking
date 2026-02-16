/**
 * Build an ISO date range for booking queries.
 * If `start`/`end` are missing, it falls back to now -> now + `days`.
 *
 * @param {{ start?: string | null, end?: string | null, days?: number }} params
 * @returns {{ startIso: string, endIso: string }}
 */

export const bookingFallback = ({ start, end }) => {

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const now = new Date();
    
    const startIso = start ?? now.toISOString();
    const endIso = end ?? new Date(now.getTime() + SEVEN_DAYS_MS).toISOString();

 return { startIso, endIso }; 

}

