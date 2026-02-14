# Work Hour Tracker

Full-stack app to track work time per job with:

- Create unlimited jobs
- Clock in / clock out per job
- Auto-calculate duration after clock out
- Add manual entries (by hours or by custom clock-in/out range)
- Add and edit comments on each time entry
- Persist data in PostgreSQL

## Tech Stack

- Frontend: React + Vite + TailwindCSS
- Backend: Express + Prisma
- Database: PostgreSQL

## Project Structure

- `client/` - React app
- `server/` - Express API and Prisma schema/migrations

## Prerequisites

- Node.js 18+
- PostgreSQL running locally (optional)

### Option A (recommended): Prisma Dev Postgres (no local Postgres required)

From `server/`, start a local Prisma Postgres in the background:

```bash
cd server
npx prisma dev -n work-hour-tracker -d --port 4010 -P 5434 --shadow-db-port 5435
```

This project is already configured to use it via `server/.env`.

### Option B: Your own local PostgreSQL

Create a database, for example:

```sql
CREATE DATABASE work_tracker;
```

## Server Setup

1. Go to the server:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` if your DB credentials differ

4. Apply migrations:

   ```bash
   npm run prisma:migrate
   ```

5. Start API:

   ```bash
   npm run dev
   ```

Server runs on `http://localhost:4000`.

## Client Setup

1. Open a new terminal and go to client:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start frontend:

   ```bash
   npm run dev
   ```

Client runs on `http://localhost:5173`.
If that port is taken, Vite will pick another (e.g. `5174`).

## API Overview

- `GET /api/jobs` - list jobs with totals + active clock status
- `POST /api/jobs` - create job
- `DELETE /api/jobs/:id` - delete job and entries
- `GET /api/jobs/:jobId/entries` - list entries for a job
- `POST /api/jobs/:jobId/clock-in` - start timer for job
- `POST /api/jobs/:jobId/clock-out` - stop timer for job
- `POST /api/jobs/:jobId/entries` - add manual entry
- `PATCH /api/entries/:id` - update entry comment
- `DELETE /api/entries/:id` - delete entry

## Notes

- Only one active clock-in is allowed per job at a time.
- If `prisma migrate dev` fails with `P1001`, start PostgreSQL and verify `DATABASE_URL`.
