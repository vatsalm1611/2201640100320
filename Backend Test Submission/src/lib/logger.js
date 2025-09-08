// logger.js
// Small helper to send logs to Affordmed server

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// allowed values (taken from problem statement)
const STACKS = new Set(["backend", "frontend"]);
const LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);
const BACKEND_ONLY = new Set([
    "cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"
]);
const BOTH = new Set(["component", "hook", "page", "state", "style", "auth", "config", "middleware", "utils"]);

function allowed(stack, pkg) {
    if (BOTH.has(pkg)) return true;
    return stack === "backend" && BACKEND_ONLY.has(pkg);
}

// main export: Log()
export async function Log(stack, level, pkg, message) {
    stack = String(stack || "").toLowerCase();
    level = String(level || "").toLowerCase();
    pkg = String(pkg || "").toLowerCase();
    message = String(message || "");

    if (!STACKS.has(stack)) throw new Error("invalid stack");
    if (!LEVELS.has(level)) throw new Error("invalid level");
    if (!allowed(stack, pkg)) throw new Error(`package ${pkg} not allowed`);
    if (!process.env.LOG_TOKEN) throw new Error("missing LOG_TOKEN in .env");

    const url = `${process.env.LOG_BASE_URL}/evaluation-service/logs`;
    const res = await axios.post(url,
        { stack, level, package: pkg, message },
        { headers: { Authorization: `Bearer ${process.env.LOG_TOKEN}` } }
    );
    return res.data;
}
