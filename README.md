# Rick & Morty Episode Comparator

Frontend take-home challenge built with Next.js App Router + TypeScript.

![Next.js](https://img.shields.io/badge/Next.js-15.5.12-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Tests](https://img.shields.io/badge/Tests-Vitest-green)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)

## Live Demo

- Vercel: `https://rick-morty-comparator-zt6d.vercel.app/`

## What this app does

Compare episodes between two independently selected Rick & Morty characters.

- Left panel: `Character #1` (paginated)
- Right panel: `Character #2` (paginated)
- Once both are selected, the app shows:
  - `Character #1 - Only Episodes`
  - `Shared Episodes`
  - `Character #2 - Only Episodes`

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict)
- CSS (global styles)
- Vitest (unit tests)

## Core Features

- Two independent paginated lists: `Character #1` and `Character #2`
- Character cards with name, status and species
- One selected character per panel
- Episode comparison shown only when both characters are selected:
  - `Character #1 - Only Episodes`
  - `Shared Episodes`
  - `Character #2 - Only Episodes`

## Plus Features

- Independent character search by name in each panel
- Search is client-side over current page results and memoized with `useMemo`
- Rate-limit aware UX (`429`) with automatic retry messaging
- Loading, empty and error states for both characters and episodes
- Unit tests for critical logic and API edge cases
- Layout-safe truncation for very long character names

## Architecture

- Feature-first structure (`features/characters`, `features/episodes`)
- `services/` for API integration
- `utils/` for pure business logic (Set-based episode comparison)
- `types/` for shared domain contracts

## Project Structure

```text
src/
  app/
  features/
    characters/
    episodes/
  services/
  types/
  utils/
```

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

## Testing Scope

- `src/utils/episodes.test.ts`
  - shared/only episode calculation
  - invalid URL filtering and deduplication
- `src/services/rick-and-morty-api.test.ts`
  - response normalization
  - batch endpoint generation
  - `429` and timeout error mapping
- `src/utils/characters.test.ts`
  - search filtering (empty, case-insensitive, trim, partial match, no results)

## Notes

- The public Rick & Morty API may throttle requests (`429`); the app handles this with retry-aware loading UX.
