# Logging Middleware

Reusable log function to call Affordmed Logs API.

## Usage
```js
import { Log } from "./src/logger.js";

await Log("backend", "error", "handler", "something went wrong");
