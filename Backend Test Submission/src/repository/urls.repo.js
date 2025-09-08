// urls.repo.js
// In-memory storage for the 2-hour assessment.

const store = new Map(); // code -> record

export const hasCode = (code) => store.has(code);
export const getByCode = (code) => store.get(code) || null;

export function saveNew(code, rec) {
    store.set(code, rec);
    return rec;
}

export function appendClick(code, click) {
    const r = store.get(code);
    if (r) r.clicks.push(click);
}

export function allStats(code) {
    const r = store.get(code);
    if (!r) return null;
    return {
        totalClicks: r.clicks.length,
        originalUrl: r.url,
        createdAt: r.createdAt,
        expiry: r.expiresAt,
        clicks: r.clicks
    };
}
