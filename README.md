# Raffy

> A refined bilingual PWA for organizing personal libraries, book notes, authors, categories, shelves, and offline reading workflows.

[![Live Demo](https://img.shields.io/badge/Live-raffy--library.vercel.app-0f766e?style=for-the-badge)](https://raffy-library.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![Neon](https://img.shields.io/badge/Neon-Postgres-00E599?style=for-the-badge)](https://neon.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE)

Raffy is an open-source personal library platform built for people who want their books, notes, authors, shelves, categories, and reading history in one calm place. It runs in the browser, installs as a PWA, works offline, and syncs changes again when the connection returns.

## Preview

![Raffy Arabic home](./docs/screenshots/raffy-home-ar.png)

![Raffy English home](./docs/screenshots/raffy-home-en.png)

![Raffy creator page on mobile](./docs/screenshots/raffy-creator-mobile.png)

## Live Product

- Arabic: [raffy-library.vercel.app](https://raffy-library.vercel.app)
- English: [raffy-library.vercel.app/en](https://raffy-library.vercel.app/en)
- Creator profile: [raffy-library.vercel.app/creator](https://raffy-library.vercel.app/creator)
- AI discovery file: [raffy-library.vercel.app/llms.txt](https://raffy-library.vercel.app/llms.txt)

## What Raffy Does

- Organizes books with titles, covers, authors, categories, shelves, acquisition dates, reading status, and notes.
- Lets users create, edit, and delete authors, categories, and shelves independently.
- Works as a Progressive Web App with offline-first behavior and later synchronization.
- Supports Arabic and English across public pages and the library interface.
- Includes dark mode, responsive layouts, accessible controls, and mobile-friendly flows.
- Provides import and export so users can keep portable backups.
- Uses Neon Postgres and Neon Auth for production-ready persistence and email/password authentication.
- Ships with SEO, structured metadata, sitemap, robots rules, `llms.txt`, and `humans.txt`.

## Built By

Raffy was created by [Abdullah Mansour](https://github.com/aim9sour), an Egyptian Applied AI Engineer, accessibility-focused maker, open-source contributor, and creator of Raffy and Hassila.

Abdullah has worked across digital marketing and applied AI, contributed to open-source projects, helped more than 1,000 people start their path in online work, and holds certifications from Google, IBM, Microsoft, Amazon, and others across digital marketing and artificial intelligence.

Contact:

- WhatsApp: [+201006859116](https://wa.me/201006859116)
- Email: [abdullahmansour.marketing@gmail.com](mailto:abdullahmansour.marketing@gmail.com)
- LinkedIn: [linkedin.com/in/aim9sour](https://linkedin.com/in/aim9sour/)
- GitHub: [github.com/aim9sour](https://github.com/aim9sour)

## Tech Stack

- [Next.js 16](https://nextjs.org) App Router
- React 19
- TypeScript
- Tailwind CSS
- Neon Postgres
- Neon Auth
- Prisma
- Vitest
- next-sitemap
- Vercel

## Architecture

```mermaid
flowchart LR
  User["User / PWA"] --> UI["Next.js App Router"]
  UI --> Auth["Neon Auth"]
  UI --> API["Route Handlers"]
  API --> DB["Neon Postgres"]
  UI --> SW["Service Worker"]
  SW --> Queue["Offline action queue"]
  Queue --> API
  Build["next-sitemap"] --> Discovery["sitemap.xml / robots.txt / llms.txt"]
```

## Local Development

Requirements:

- Node.js 20+
- npm
- A Neon Postgres database
- Neon Auth configuration

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Required variables:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
NEON_AUTH_BASE_URL="https://YOUR_NEON_AUTH_URL/neondb/auth"
NEON_AUTH_COOKIE_SECRET="generate-a-32-byte-secret"
```

Install and prepare:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

Quality checks:

```bash
npm test
npm run lint
npm run build
```

## Data Model

Raffy keeps the library simple and flexible:

- Books: title, cover, author, category, shelf, notes, acquisition date, reading state, and optional metadata.
- Entities: authors, categories, and shelves can be managed separately.
- Users: each authenticated user owns their own library data.
- Import/export: portable backups are generated in a structured format that includes books and related entities.

## Deployment

The production app runs on Vercel:

[https://raffy-library.vercel.app](https://raffy-library.vercel.app)

Once the GitHub repository is connected to Vercel, pushes to the production branch trigger a fresh Vercel build automatically. Vercel keeps the public domain pointed at the latest successful production deployment.

## Contributing

Contributions are welcome. Good first areas:

- Accessibility polish
- Better import/export validation
- More language coverage
- Book cover improvements
- Offline sync hardening
- Tests for edge cases
- Documentation and translations

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## Security

Please do not open public issues for sensitive reports. Use the process in [SECURITY.md](./SECURITY.md).

## License

Raffy is open source under the [MIT License](./LICENSE).

---

Made with care by [Abdullah Mansour](https://github.com/aim9sour) as a gift to readers, students, researchers, and everyone building a calmer personal knowledge library.
