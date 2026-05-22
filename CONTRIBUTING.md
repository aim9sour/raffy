# Contributing to Raffy

Thank you for helping improve Raffy. The goal is to keep the project practical, accessible, bilingual, and pleasant to use on both desktop and mobile.

## Before You Start

- Open an issue for major changes so the direction can be discussed first.
- Keep pull requests focused and easy to review.
- Preserve Arabic and English support when touching user-facing text.
- Treat accessibility as part of the feature, not an optional polish step.

## Development Setup

```bash
npm install
cp .env.example .env.local
npm run db:generate
npm run db:migrate
npm run dev
```

## Checks

Run these before opening a pull request:

```bash
npm test
npm run lint
npm run build
```

## Pull Request Style

A strong pull request includes:

- A clear description of the change.
- Screenshots or screen recordings for visible UI changes.
- Notes about offline behavior if the change affects syncing.
- Tests for new behavior or bug fixes.
- No committed secrets, local logs, database URLs, or generated caches.

## Product Principles

- Keep Raffy fast and calm.
- Make the primary workflow obvious without extra explanation.
- Use familiar controls for actions, filtering, importing, exporting, and editing.
- Keep required fields minimal.
- Make mobile usage feel first-class.
- Avoid regressions in PWA installability and offline behavior.

## Reporting Bugs

Please include:

- Steps to reproduce.
- Expected behavior.
- Actual behavior.
- Browser and device.
- Screenshots when useful.

## License

By contributing, you agree that your contributions are licensed under the MIT License.
