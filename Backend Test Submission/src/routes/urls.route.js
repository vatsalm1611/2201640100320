// urls.route.js
// Small router: order matters (keep the generic code route last)

import { Router } from "express";
import { createShort, redirect, getStats } from "../controllers/urls.controller.js";
import { Log } from "../lib/logger.js";

const r = Router();

// create a short url
r.post("/shorturls", async (req, res, next) => {
    await Log("backend", "info", "route", "POST /shorturls").catch(() => { });
    return createShort(req, res, next);
});

// fetch stats for a code
r.get("/shorturls/:code([A-Za-z0-9_-]+)", async (req, res) => {
    await Log("backend", "info", "route", `GET /shorturls/${req.params.code}`).catch(() => { });
    return getStats(req, res);
});

// redirect handler (generic match) — keep this LAST
r.get("/:code([A-Za-z0-9_-]+)", redirect);

export default r;
