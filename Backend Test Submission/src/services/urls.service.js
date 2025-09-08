// urls.service.js
// Core rules: unique code, default validity, expiry checks, click logs.

import { getByCode, hasCode, saveNew, appendClick, allStats } from "../repository/urls.repo.js";
import { genCode, isAlnumCode } from "../utils/codegen.js";
import { minutesToMs } from "../utils/validators.js";
import { Log } from "../lib/logger.js";

// create + store a short link
export async function createShortUrl({ url, validity, shortcode }, baseLink) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + minutesToMs(validity)).toISOString();

    let code = (shortcode || "").trim();
    if (code) {
        if (!isAlnumCode(code)) {
            await Log("backend", "warn", "service", "invalid shortcode");
            const err = new Error("invalid shortcode"); err.status = 400; throw err;
        }
        if (hasCode(code)) {
            await Log("backend", "warn", "service", "shortcode collision");
            const err = new Error("shortcode already in use"); err.status = 409; throw err;
        }
    } else {
        do { code = genCode(6); } while (hasCode(code)); // tiny loop until unique
    }

    const rec = { code, url, createdAt: now.toISOString(), expiresAt, clicks: [] };
    saveNew(code, rec);

    const shortLink = `${baseLink}/${code}`;
    await Log("backend", "info", "service", `short created ${code}`);
    return { shortLink, expiry: expiresAt, code };
}

// quick resolver with expiry
export function resolve(code) {
    const rec = getByCode(code);
    if (!rec) return { status: 404, reason: "not found" };
    if (Date.now() > Date.parse(rec.expiresAt)) return { status: 410, reason: "expired", rec };
    return { status: 200, rec };
}

// record one click
export async function recordClick(code, meta) {
    appendClick(code, meta);
    await Log("backend", "info", "service", `click ${code}`);
}

// stats for a code
export function stats(code) {
    return allStats(code);
}
