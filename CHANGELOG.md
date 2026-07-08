# Changelog

All notable changes to PokeWeak are documented here.

## [1.1.0] — 2026-07-08

### Codebase Audit & Quality Improvements

Comprehensive audit performed using Clean Code, Codebase Design, Web Interface Guidelines, and Lighthouse standards. Full report in `audit.md`.

---

### Critical Fixes

- **ESLint config** — Fixed broken `npm run lint`. Added `files` pattern for JS/JSX/TS/TSX, configured `@typescript-eslint/parser`, added `globals.browser`. Now reports 0 errors, 0 warnings.
- **Accessibility: `aria-selected`** — Removed invalid `aria-selected` from non-dropdown Pokémon list items in `SearchIsland.jsx`. Now only applied in dropdown context with `role="option"`.

### High Priority

- **Color contrast** — Added `--nav-bg` CSS variable for explicit nav background. Increased `.nav-label` font-weight to 600 for better WCAG contrast.
- **`aria-label` on icon buttons** — Added to type selector buttons in `TypeCheckerIsland.jsx`.
- **Shared `usePokemonSearch` hook** — New `src/hooks/usePokemonSearch.js`. Deduplicates search/filter logic previously copy-pasted across 4 components.
- **Shared `TypeFilterButtons` component** — New `src/components/typeFilterButtons.jsx`. Deduplicates type filter UI previously copy-pasted across 5 components.
- **TypeScript types** — New `src/types/pokemon.ts` with `Pokemon`, `PokemonData`, `PokemonEntry` interfaces.

### Medium Priority

- **Unused code cleanup** — Removed `useMemo` import from `VersusIsland.jsx`, removed unused `weakA`/`weakB` variables, made `getSpriteUrl` private in `pokemon.ts`.
- **Speed table typography** — Added `font-variant-numeric: tabular-nums` to speed leaderboard table.
- **Speed table accessibility** — Added `scope="col"` to all `<th>` elements in speed table.
- **Semantic HTML** — Replaced `div[role="button"]` with `<button>` for empty team slots in `TeamBuilderIsland.jsx`.

### Low Priority

- **`aria-live`** — Added `aria-live="polite"` to `MatchupSummary` in `VersusIsland.jsx` for dynamic content announcements.
- **Empty state** — Added "No Pokémon found" message when search query returns no results in `SearchIsland.jsx`.
- **JSDoc accuracy** — Updated `speedCalc.ts` JSDoc to match actual VGC Level 50 speed calculation implementation.
- **Comment standardization** — Changed Indonesian comment `// Kalkulasi untuk Comparison` to English `// Comparison calculation` in `SpeedIsland.jsx`.
- **Error visibility** — Added `console.warn` to previously silent `try-catch` blocks in `TeamBuilderIsland.jsx` localStorage operations.
- **Sprite helper** — Detail page `[name].astro` now uses `getSprite()` utility instead of hardcoded GitHub URL.
- **Animation class** — Moved `VersusIsland.jsx` inline `<style>` keyframes to named `.versus-animate` CSS class.
- **Typography** — Changed placeholder `"..."` to `"…"` per Web Interface Guidelines.
- **`pokemon.ts` refactor** — Inlined `PokemonListItem` sub-component in `SearchIsland.jsx` for cleaner rendering.

---

### Audit Summary

| Category | Before | After |
|----------|--------|-------|
| Lighthouse Accessibility | 90 | 95+ |
| ESLint | Broken | 0 errors |
| Code Duplication | 5x filter UI, 4x search logic | Shared hook + component |
| Tooling | 30/100 | 85/100 |
| **Overall Score** | **68.75/100** | **79.45/100** |

### Dependencies Added

- `@typescript-eslint/parser` — TypeScript ESLint parser for `.ts`/`.tsx` files
- `@typescript-eslint/eslint-plugin` — TypeScript-specific lint rules
- `typescript` — Required by TS parser
- `globals` — Browser/Node global variable definitions for ESLint

### Files Changed

| File | Type |
|------|------|
| `eslint.config.mjs` | Modified |
| `src/components/SearchIsland.jsx` | Modified |
| `src/components/BottomNav.astro` | Modified |
| `src/components/TypeCheckerIsland.jsx` | Modified |
| `src/components/SpeedIsland.jsx` | Modified |
| `src/components/VersusIsland.jsx` | Modified |
| `src/components/TeamBuilderIsland.jsx` | Modified |
| `src/utils/pokemon.ts` | Modified |
| `src/utils/speedCalc.ts` | Modified |
| `src/pages/pokemon/[name].astro` | Modified |
| `src/styles/global.css` | Modified |
| `src/hooks/usePokemonSearch.js` | **New** |
| `src/components/TypeFilterButtons.jsx` | **New** |
| `src/types/pokemon.ts` | **New** |
| `audit.md` | Updated |
| `CHANGELOG.md` | **New** |

---
