# Rick & Morty Episode Comparator

Take-home challenge built with Next.js App Router + TypeScript.

## What it does

- Displays two independent paginated character lists: `Character #1` and `Character #2`.
- Lets you select exactly one character in each list.
- Shows episode comparison only after both selections are made:
  - Character #1 - only episodes
  - Shared episodes
  - Character #2 - only episodes

## Tech stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict)
- CSS (no UI framework)

## Why REST (instead of GraphQL)

For this challenge, REST keeps complexity low and delivery speed high.

- Pagination is direct with `/character?page=N`.
- Episodes can be fetched in batch by ids with `/episode/[1,2,3]`.
- No client/schema setup overhead, which helps stay within a 4-hour scope.

## Project structure

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  features/
    characters/
      components/
      hooks/
    episodes/
      components/
      hooks/
  services/
    rick-and-morty-api.ts
  types/
    rick-and-morty.ts
  utils/
    episodes.ts
```

## Key implementation notes

- `features/characters` handles independent pagination and character selection state.
- `features/episodes` handles gated rendering and episode comparison fetch lifecycle.
- `utils/episodes.ts` contains pure Set-based logic for:
  - intersection (shared episodes)
  - differences (only #1 / only #2)
- Loading, empty and error states are implemented for both character lists and episode comparison.

## Setup

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

## Testing

Current unit tests focus on core business logic and service edge cases:

- `src/utils/episodes.test.ts`
  - Set-based shared/only episode calculation
  - invalid URL filtering and id deduplication
  - bucket materialization from episode map
- `src/services/rick-and-morty-api.test.ts`
  - empty id short-circuit behavior
  - single-response normalization to array
  - sorted/deduped batch endpoint generation
  - `429` and timeout (`408`) error mapping

## Tradeoffs

- Chosen native `fetch + useEffect` instead of React Query to keep dependencies minimal.
- No SSR/data prefetch optimization yet; current approach favors clarity and speed of implementation.
- UI integration tests are not included yet; current test scope prioritizes business logic reliability.

## What I would add next

- Unit tests for `src/utils/episodes.ts` and service edge cases.
- React Query for caching/retries and cleaner query state handling.
- Deploy (Vercel) and add live URL to this README.
