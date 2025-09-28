# Personal Finance Tracker - Starter (MERN + Vite React)

This repo is a starter project that includes:
- Backend: Node.js + Express + MongoDB + Mongoose
- Frontend: Vite + React + Chart.js
- Features: auth, transactions, budgets, simple prediction endpoint, CSV export, budget cron alerts (email)

## How to use
- Start backend: `cd backend && npm install && npm run dev` (set .env)
- Start frontend: `cd frontend && npm install && npm run dev` (set VITE_API_URL to backend)
- The starter includes a simple cron job that runs daily to check budgets. For local testing, run the cron function manually or adjust timings.

The code is intentionally compact to help you iterate quickly. Expand components, add styling (Tailwind), and improve security/validation for production.
