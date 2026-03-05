# ديوان تميم — Tamim Diwan MVP

An informative mobile application for the Tamim tribe community in Saudi Arabia.

## Features
- Family Tree (interactive, zoom/pan)
- Tribe News with categories
- Events Calendar
- Suggestions & Complaints system

## Monorepo Structure

```
/
├── mobile/    # React Native (TypeScript) — iOS + Android
├── server/    # NestJS REST API + Swagger
├── admin/     # Next.js Admin Dashboard
└── README.md
```

---

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9
- React Native CLI + Xcode (iOS) / Android Studio (Android)

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd tamim-diwan

# Install all dependencies
npm run install:all
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb tamim_diwan

# Copy env template
cp server/.env.example server/.env
# Edit server/.env with your DB credentials

# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

### 3. Start Backend

```bash
npm run server
# API runs at: http://localhost:3001
# Swagger docs: http://localhost:3001/api/docs
```

### 4. Start Admin Dashboard

```bash
cp admin/.env.example admin/.env.local
npm run admin
# Dashboard runs at: http://localhost:3000
# Default admin: admin@tamim.sa / Admin@1234
```

### 5. Start Mobile App

```bash
cd mobile
cp .env.example .env
# Edit .env — set API_URL to your server

# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

---

## API Documentation

Swagger UI is available at `http://localhost:3001/api/docs` once the server is running.

---

## Environment Variables

### server/.env.example
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/tamim_diwan
JWT_SECRET=change_this_secret_in_production
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=10
ADMIN_EMAIL=admin@tamim.sa
ADMIN_PASSWORD=Admin@1234
CORS_ORIGIN=http://localhost:3000
```

### admin/.env.example
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### mobile/.env.example
```
API_URL=http://localhost:3001
```

---

## Database Schema

See `server/prisma/schema.prisma` for the full data model.

Key tables:
- `branches` — tribe branches (hierarchical)
- `persons` — family tree members
- `relationships` — parent/spouse links (adjacency list)
- `person_tree_paths` — closure table for fast ancestor/descendant queries
- `news` — tribe news articles
- `events` — community events
- `tickets` — suggestions & complaints

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native (TypeScript), React Navigation, React Query, Zod |
| Backend | NestJS, Prisma ORM, PostgreSQL, JWT, Multer |
| Admin | Next.js 14 App Router, TanStack Table, React Hook Form |
| API Docs | Swagger / OpenAPI 3.0 |

---

## Running Tests

```bash
cd server && npm run test
```

---

## Deployment Notes

- Set `NODE_ENV=production` in server
- Use a proper S3-compatible storage for `UPLOAD_DIR` in production
- Set strong `JWT_SECRET`
- Configure PostgreSQL connection pool settings

---

## License

MIT — Tamim Diwan Team
