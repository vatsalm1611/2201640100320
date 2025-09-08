// urls.controller.js
// Thin HTTP layer: validate inputs, call service, shape responses.

import { isValidHttpUrl, coarseRegionFromIP } from "../utils/validators.js";
import { createShortUrl, resolve, recordClick, stats } from "../services/urls.service.js";
import { Log } from "../lib/logger.js";

// POST /shorturls
export async function createShort(req, res, next) {
    try {
        const { url, validity, shortcode } = req.body || {};
        if (!isValidHttpUrl(url)) {
            await Log("backend", "warn", "controller", "invalid url");
            return res.status(400).json({ error: "invalid url" });
        }
        const base = `${req.protocol}://${req.get("host")}`;
        const out = await createShortUrl({ url, validity, shortcode }, base);
        return res.status(201).json({ shortLink: out.shortLink, expiry: out.expiry });
    } catch (e) {
        next(e);
    }
}

// GET /:code -> 302
export async function redirect(req, res) {
    const code = req.params.code;
    const r = resolve(code);

    if (r.status === 404) {
        await Log("backend", "error", "handler", `unknown code ${code}`);
        return res.status(404).json({ error: "not found" });
    }
    if (r.status === 410) {
        await Log("backend", "warn", "handler", `expired code ${code}`);
        return res.status(410).json({ error: "expired" });
    }

    const ref = req.get("referer") || "";
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().replace("::ffff:", "");
    const region = coarseRegionFromIP(ip);

    await recordClick(code, { ts: new Date().toISOString(), referrer: ref, ip, region });
    await Log("backend", "info", "route", `redirect ${code} -> ${r.rec.url}`);

    return res.redirect(302, r.rec.url);
}

// GET /shorturls/:code
export async function getStats(req, res) {
    const code = req.params.code;
    const s = stats(code);
    if (!s) {
        await Log("backend", "error", "controller", `stats missing ${code}`);
        return res.status(404).json({ error: "not found" });
    }
    await Log("backend", "info", "controller", `stats ${code}`);
    return res.json(s);
}
