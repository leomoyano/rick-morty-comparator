# Rick & Morty Episode Comparator

Frontend take-home challenge built with Next.js App Router and TypeScript.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict)
- CSS (global styles)
- Vitest (unit testing)

## Features

- Two independent paginated character lists: `Character #1` and `Character #2`
- Character cards with name, status, and species
- One-character selection per list
- Episode comparison rendered only after both characters are selected:
  - `Character #1 - Only Episodes`
  - `Shared Episodes`
  - `Character #2 - Only Episodes`
- Loading, empty, and error states for characters and episodes
- Rate-limit aware UX (`429` handling with auto-retry messaging)

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:coverage
```

## Demo

- Vercel: _pending_
