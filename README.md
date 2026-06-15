# Team Task Manager + Analytics Dashboard

A full-stack web application for managing personal tasks, with a built-in
analytics dashboard for visualizing task data through charts and summary
statistics.

## Features

- User registration and login (JWT-based authentication)
- Create, edit, delete, search, and filter tasks
- Set status (To Do / In Progress / Done), priority (Low / Medium / High),
  and due dates
- Analytics dashboard with:
  - Summary stat cards (Total, Completed, In Progress, Overdue)
  - Bar chart of tasks by status
  - Pie chart of tasks by priority
  - Line chart of completion trend over time
  - Date range filter (7 days / 30 days / custom)
  - CSV export of all tasks

## Tech Stack

**Frontend:** React, React Router, Axios, Recharts, CSS Modules
**Backend:** Node.js, Express, PostgreSQL, node-postgres (pg), bcrypt, jsonwebtoken, dotenv, cors

## Project Structure

- `client/` — React frontend (Vite)
- `server/` — Express + PostgreSQL backend

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Backend Setup

1. `cd server && npm install`
2. `cp .env.example .env` and update with your database connection details and a JWT secret
3. Run `src/config/schema.sql` against your PostgreSQL database (e.g. via pgAdmin's Query Tool or `psql`)
4. `npm start`

The API runs on `http://localhost:5000/api` by default.

### Frontend Setup

1. `cd client && npm install`
2. `cp .env.example .env` and update if your backend runs on a different URL
3. `npm run dev`

The app runs on `http://localhost:5173` by default.

## API Overview

| Resource  | Base Route       |
|-----------|------------------|
| Auth      | `/api/auth`      |
| Tasks     | `/api/tasks`     |
| Analytics | `/api/analytics` |

All responses follow the format:

```json
{ "success": true, "data": {}, "message": "Optional message" }
```

## Notes

- Authentication tokens are stored in memory (React Context), not localStorage — refreshing the page will log the user out.