# C21 Backend

REST API for the Century 21 real estate platform. Built with Express, TypeScript, Prisma, and PostgreSQL.

---

## Running the Backend

Follow these steps every time you want to start the backend.

### Prerequisites

- Node.js v18+
- Docker (for the database)

---

### Step 1 — Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL container on port `5432`. Only needed once per machine restart (the container persists data in a Docker volume).

---

### Step 2 — Set up environment variables (first time only)

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `ACCESS_TOKEN_TTL` | Access token expiry (e.g. `15m`) |
| `REFRESH_TOKEN_TTL_DAYS` | Refresh token expiry in days (e.g. `30`) |
| `PORT` | Port the server listens on (default `4000`) |

---

### Step 3 — Install dependencies (first time only)

```bash
npm install
```

---

### Step 4 — Run database migrations (first time, or after schema changes)

```bash
npm run prisma:migrate
```

---

### Step 5 — Start the dev server

```bash
npm run dev
```

The server will be available at **http://localhost:4000**.

---

## Daily workflow (after first setup)

```bash
# 1. Start the database (if not already running)
docker compose up -d

# 2. Start the server
npm run dev
```

---

## Other useful commands

| Command | Description |
|---|---|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm run prisma:studio` | Open Prisma Studio (visual DB browser) |
| `npm run seed` | Seed the database with initial data |
| `docker compose down` | Stop the database container |
| `docker compose down -v` | Stop and delete the database volume |
