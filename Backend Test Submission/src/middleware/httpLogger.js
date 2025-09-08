// httpLogger.js
// Logs each request + response timing; never blocks main flow.

import { Log } from "../lib/logger.js";

// request/response log
export function httpLogger(req, res, next) {
    const start = Date.now();

    // note: fire-and-forget (log failure should not break API)
    Log("backend", "info", "middleware", `REQ ${req.method} ${req.originalUrl}`).catch(() => { });

    res.on("finish", () => {
        const ms = Date.now() - start;
        const level = res.statusCode >= 500 ? "error"
            : res.statusCode >= 400 ? "warn"
                : "info";
        Log("backend", level, "middleware",
            `RES ${req.method} ${req.originalUrl} -> ${res.statusCode} in ${ms}ms`
        ).catch(() => { });
    });

    next();
}

// central error reporter
export function errorHandler(err, req, res, next) {
    Log("backend", "error", "handler", err?.message || "Unhandled error").catch(() => { });
    res.status(500).json({ error: "Internal Server Error" });
}
