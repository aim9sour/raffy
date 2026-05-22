# Library PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-friendly PWA for organizing a personal book library with shelves, categories, notes, import/export, dark mode, and Postgres persistence.

**Architecture:** Use Next.js App Router with Prisma as the database boundary and server route handlers for CRUD/import/export. Keep filtering and dashboard interactions in focused client components, with validation and serialization helpers tested separately.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Prisma, Postgres/Neon, Vitest, PWA manifest/service worker.

---

### Task 1: Scaffold And Database Boundary

**Files:**
- Create: `package.json`
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `src/lib/books.ts`
- Create: `src/lib/book-schema.ts`
- Create: `src/lib/book-import-export.ts`

- [ ] Scaffold Next.js with TypeScript, Tailwind, App Router, and npm.
- [ ] Add Prisma, Vitest, Zod, Lucide React, and PWA support files.
- [ ] Define the `Book` model with title, author, cover URL, category, shelf, acquired date, status, rating, notes, timestamps.
- [ ] Implement lazy Prisma initialization to avoid build-time env failures.
- [ ] Test validation and import/export transforms before implementing helpers.

### Task 2: CRUD And Import/Export API

**Files:**
- Create: `src/app/api/books/route.ts`
- Create: `src/app/api/books/[id]/route.ts`
- Create: `src/app/api/books/import/route.ts`
- Create: `src/app/api/books/export/route.ts`

- [ ] Add route handlers for listing, creating, updating, deleting, importing, and exporting books.
- [ ] Validate request bodies with Zod.
- [ ] Return useful 400/404 responses for bad input and missing books.

### Task 3: PWA Library Interface

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/library-app.tsx`
- Create: `src/components/book-form.tsx`
- Create: `src/components/book-card.tsx`
- Create: `src/components/theme-toggle.tsx`
- Create: `src/app/manifest.ts`
- Create: `public/sw.js`

- [ ] Build the library dashboard with search, category/shelf/status filters, cards, and details editing.
- [ ] Add dark mode toggle persisted in local storage.
- [ ] Add import/export buttons using the API.
- [ ] Add installable PWA metadata and service worker registration.

### Task 4: Verification And Local Link

**Files:**
- Modify as needed based on verification.

- [ ] Run unit tests.
- [ ] Run Prisma generate.
- [ ] Run Next build.
- [ ] Start the dev server and provide the local URL.
