URL Shortener Backend
=====================

Simple Node.js + Express backend to create and manage short URLs.

Features:
- Create short URL with custom or auto-generated code
- Redirect to original URL
- Track stats (clicks, referrer, timestamps)
- Health check endpoint
- Logging middleware for external logs

Endpoints:
- GET  /health
- POST /shorturls
- GET  /:shortcode
- GET  /shorturls/:shortcode

Setup:
1. cd "Backend Test Submission"
2. npm install
3. cp .env.example .env   # add valid LOG_TOKEN (raw, no 'Bearer ')
4. npm start

Notes:
- Data stored in-memory (lost on restart)
- Ensure port (default 5173) is set Public in Codespaces
