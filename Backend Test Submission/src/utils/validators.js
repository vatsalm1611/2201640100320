// validators.js
// Small, practical helpers used across layers.

export function isValidHttpUrl(str) {
    try {
        const u = new URL(str);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

// default validity = 30 minutes if not provided or invalid
export function minutesToMs(m) {
    const n = Number(m);
    return Number.isFinite(n) && n > 0 ? n * 60 * 1000 : 30 * 60 * 1000;
}

// coarse IP → region (no external lookups)
export function coarseRegionFromIP(ip) {
    if (!ip) return "unknown";
    if (
        ip.startsWith("10.") ||
        ip.startsWith("192.168.") ||
        ip.startsWith("172.16.")
    ) return "private";
    return "unknown";
}
