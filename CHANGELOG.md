# Changelog PokeWeak

## v1.1.0 — 2026-07-08

### Data
- Added Kommo-o to champion list
- Fixed Electric→Rock type chart (`0.5` → `1`) — Aerodactyl now weak to Electric (×2)

### Bugs
- Theme fallback: `dark:dark` → `dark:light` (system preference now works)
- Removed conflicting manual service worker registration
- BottomNav: `@container` → `@media` (queries now match)
- Unified theme-color meta to `#EAE8E3`
- VersusIsland: multiplier now multiplies per-type, not `Math.max`
- `onmouseover`/`onmouseout` → CSS `:hover`
- Renamed `displayName` → `formatName` (avoids React collision)

### SEO
- Added OG + Twitter Card meta tags, canonical URL, JSON-LD schema
- Added sitemap (`@astrojs/sitemap`) + `robots.txt`
- Set `site` in astro config

### Accessibility
- Added skip-to-content link, `color-scheme: dark` on `<html>`
- Search: `role="combobox"` + query highlight in results
- Type filter buttons: `aria-label` + `aria-hidden` on TypeIcon
- Speed table: `aria-label` + `aria-pressed` on sort button
- Team modal: `role="dialog"`, Escape handler, focus trap, `aria-modal`
- Empty slot: keyboard accessible (`role="button"`, `tabIndex`, `onKeyDown`)

### Performance
- Pre-computed `calculateSpeedTiers` and `calculateWeaknesses` (no longer per-row)
- `content-visibility: auto` on long lists
- `client:load` → `client:idle` on Speed/Team/Versus/Cheatsheet
- Removed ~200 lines dead CSS + dead imports/files

### PWA
- Added `navigateFallback` for offline navigation
- Added install prompt button + `visualViewport` fix
- Removed redundant deps (`vite-plugin-pwa`, `workbox-build`, `workbox-window`)

### UX
- Added 404 page, error boundary, search highlight
- Team builder persists to `localStorage`
- PWA install button

### Security
- Added `_headers` (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)

### Code Quality
- Package name: `extra-heliosphere` → `pokeweak`
- Removed `@vercel/analytics` (migrated to Cloudflare Pages)
- Added path aliases, ESLint, Prettier, Vitest (11 tests)
- New scripts: `test`, `lint`, `format`
