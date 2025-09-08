// app.js
// Express bootstrap: JSON, request logger, routes, central error handler.

import express from "express";
import dotenv from "dotenv";
import urlsRoute from "./routes/urls.route.js";
import { httpLogger, errorHandler } from "./middleware/httpLogger.js";
import { Log } from "./lib/logger.js";

dotenv.config();

const app = express();
app.use(express.json());

// log every request/response (non-blocking)
app.use(httpLogger);

// tiny healthcheck for quick sanity tests
app.get("/health", async (_req, res) => {
    await Log("backend", "info", "handler", "health ok").catch(() => { });
    res.json({ ok: true });
});

// main routes
app.use("/", urlsRoute);

// central error reporter
app.use(errorHandler);

const port = process.env.PORT || 5173;
app.listen(port, () => {
    console.log(`URL shortener running on http://localhost:${port}`);
});
