import { Log } from "./src/logger.js";

(async () => {
    try {
        const res = await Log("backend", "info", "service", "demo test log");
        console.log(res);
    } catch (err) {
        console.error("Log failed:", err.message);
    }
})();
