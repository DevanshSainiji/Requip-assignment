# Requip User Management System

A production-ready, highly optimized User Management system built as part of the Requip assignment.

## Project Overview

This project is a complete full-stack application for managing user records, featuring a robust REST API backend and a responsive, premium frontend. It supports full CRUD operations with soft-deletion, pagination, comprehensive input validation, and a beautiful UI built with a custom "Aurora Copper" design system.

## Tech Stack

**Backend:**
- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** Prisma
- **Validation:** Zod
- **Testing:** Jest + Supertest
- **Docs:** Swagger UI

**Frontend:**
- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **State/Data:** React Query (TanStack)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Architecture Diagram

```ascii
+-----------------------+       HTTP / JSON        +-----------------------+
|     React Client      | <======================> |    Express Backend    |
|-----------------------|                          |-----------------------|
| - React Router        |                          | - Routes & Validation |
| - React Query         |                          | - Controllers         |
| - React Hook Form     |                          | - Services (Logic)    |
| - Tailwind Components |                          | - Repositories (Data) |
+-----------------------+                          +-----------+-----------+
                                                               |
                                                               v
                                                      +-----------------+
                                                      |   Prisma ORM    |
                                                      +-----------------+
                                                               |
                                                               v
                                                      +-----------------+
                                                      |  MySQL Database |
                                                      +-----------------+
```

## Folder Structure

```
requip/
├── backend/
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── controllers/    # Request handling
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Database access layer
│   │   ├── routes/         # Express routing & Swagger
│   │   ├── validations/    # Zod schemas
│   │   └── tests/          # Jest + Supertest suites
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # UI and Domain components
    │   ├── hooks/          # React Query data hooks
    │   ├── pages/          # Route components
    │   ├── lib/            # Axios and utilities
    │   └── types/          # Shared TypeScript interfaces
    ├── tailwind.config.js  # Aurora Copper theme
    └── package.json
```

## Database Design

The `User` table is designed with the following constraints:
- `id` (Primary Key, Auto-increment)
- `email`, `pan`, `aadhaar` (Unique Indexes)
- `deletedAt` (Nullable timestamp for soft-deletion)
- **Composite Index:** `@@index([deletedAt, createdAt])` for highly optimized paginated querying.

## API Documentation Summary

The API is fully documented using OpenAPI (Swagger). Once running, visit `http://localhost:3000/api-docs`.

- `GET /api/v1/users` - Fetch paginated users
- `GET /api/v1/users/stats` - Fetch dashboard metrics
- `GET /api/v1/users/:id` - Fetch single user
- `POST /api/v1/users` - Create a new user
- `PUT /api/v1/users/:id` - Update an existing user
- `DELETE /api/v1/users/:id` - Soft-delete a user

## Setup Instructions

### Environment Variables

**Backend (`backend/.env`):**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://root:password@localhost:3306/requip"
CLIENT_URL="http://localhost:5173"
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL="http://localhost:3000/api/v1"
```

### Running Backend

```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### Running Frontend

```bash
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
cd backend
npm run test
```
*(Note: Ensure your test database is configured and running as per the `DATABASE_URL` in `.env.test`)*

## Design Decisions

1. **Repository Pattern:** Separating database logic from business logic allows for easier testing and a cleaner controller layer.
2. **Soft Deletion:** Records are never truly deleted, preventing accidental data loss and preserving relational integrity for future features.
3. **Optimized Pagination:** Used parallel promises (`Promise.all`) for Prisma `findMany` and `count` to halve the database round-trip time.
4. **React Query:** Chosen to handle complex loading states, aggressive caching, and background refetching seamlessly without Redux boilerplate.
5. **Aurora Copper Theme:** Designed a custom, high-end Tailwind theme rather than a generic template to showcase UI/UX capabilities.

## Challenges Faced

- **Typescript strictness with Zod and Prisma:** Handling the subtle differences between `undefined` (Zod optionals), `null` (Prisma nullables), and empty strings required careful mapping in the API layer and the frontend mutations to satisfy the compiler without `any` overrides.

## Learnings

- Deeply integrating `react-hook-form` with `zod` alongside a custom design system components requires careful `forwardRef` management.
- Verbatim module syntax (`import type`) is essential for optimal Vite build performance.

## Future Improvements

- Add robust authentication (JWT or session-based).
- Implement rate limiting (`express-rate-limit`) on the backend.
- Write E2E tests using Cypress or Playwright.
- Add virtualization to the User Table for handling 10,000+ rows efficiently.
