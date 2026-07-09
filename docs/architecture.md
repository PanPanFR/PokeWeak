# Architecture

PokeWeak is a static-first web application built with Astro and Preact. This document covers the project architecture, tech stack, and key design decisions.

## Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | [Astro](https://astro.build) 7.x | Static site generation, page routing |
| UI Library | [Preact](https://preactjs.com) 10.x | Interactive components (client-side) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4.x | Utility-first CSS, CSS variables |
| Language | TypeScript 6.x | Type safety, better DX |
| PWA | [@vite-pwa/astro](https://vite-pwa-org.netlify.app/) | Service worker, offline support |
| Testing | [Vitest](https://vitest.dev/) 4.x | Unit testing |
| Linting | ESLint 9.x + Prettier | Code quality, formatting |

## Design Principles

### 1. Static-First

All pages are pre-rendered at build time. Interactive features use Preact islands with `client:load` directive.

### 2. Mobile-First

The UI is designed for phones first, then scales up. Key patterns:
- Bottom navigation for mobile
- Responsive grid layouts
- Touch-friendly hit targets (44px minimum)
- Safe area insets for notched devices

### 3. Performance

- Static generation eliminates server-side rendering overhead
- Preact (3KB gzipped) instead of React (42KB gzipped)
- PokeAPI sprites cached via Workbox service worker
- Font loading optimized with preconnect and preload

### 4. Accessibility

- WCAG 2.1 AA compliance (Lighthouse 95+)
- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation support
- Reduced motion support

## Project Structure

```
pokeweak/
├── public/                    # Static assets
│   ├── icons/                 # PWA icons, favicons, type icons
│   │   ├── types/             # SVG type icons (18 types)
│   │   ├── pwa-*.png          # PWA icons (64, 192, 512px)
│   │   └── icon-*.svg         # App icons
│   ├── _headers               # Cloudflare headers
│   └── robots.txt
│
├── src/
│   ├── components/            # UI Components
│   │   ├── BottomNav.astro    # Mobile bottom navigation
│   │   ├── SearchIsland.jsx   # Main search with Pokémon list
│   │   ├── TeamBuilderIsland.jsx # Team builder (6 slots)
│   │   ├── TypeCheckerIsland.jsx # Type weakness calculator
│   │   ├── VersusIsland.jsx   # 1v1 comparison mode
│   │   ├── SpeedIsland.jsx    # Speed leaderboard
│   │   ├── CheatsheetTabs.jsx # Type cheatsheet tabs
│   │   ├── TypeIcon.jsx       # Preact type icon
│   │   └── TypeIcon.astro     # Astro type icon
│   │
│   ├── data/                  # Static data
│   │   ├── pokemon.json       # All Pokémon data
│   │   └── types.json         # Type effectiveness chart
│   │
│   ├── layouts/
│   │   └── MainLayout.astro   # Base layout with PWA, SEO, theme
│   │
│   ├── pages/                 # Route pages
│   │   ├── index.astro        # Home — search page
│   │   ├── speed.astro        # Speed leaderboard
│   │   ├── cheatsheet.astro   # Type matchups + hidden mechanics
│   │   ├── versus.astro       # Versus mode (1v1)
│   │   ├── team.astro         # Team builder
│   │   ├── 404.astro          # Not found page
│   │   └── pokemon/
│   │       └── [name].astro   # Dynamic Pokémon detail page
│   │
│   ├── styles/
│   │   └── global.css         # Global styles, CSS variables, animations
│   │
│   ├── types/
│   │   └── pokemon.ts         # TypeScript interfaces
│   │
│   └── utils/                 # Utility functions
│       ├── pokemon.ts         # getSprite(), formatName()
│       ├── typeCalc.ts        # calculateWeaknesses(), calculateStrengths()
│       └── speedCalc.ts       # calculateSpeedTiers()
│
├── tests/                     # Test files
├── scripts/                   # Build/utility scripts
│
├── astro.config.mjs           # Astro config (PWA, Tailwind, Sitemap)
├── eslint.config.mjs          # ESLint config
├── tsconfig.json              # TypeScript config with path aliases
├── vitest.config.ts           # Vitest config
└── package.json
```

## Routing

Astro uses file-based routing. Each `.astro` file in `src/pages/` becomes a route.

### Static Routes

| File | Route |
|------|-------|
| `src/pages/index.astro` | `/` |
| `src/pages/speed.astro` | `/speed` |
| `src/pages/cheatsheet.astro` | `/cheatsheet` |
| `src/pages/versus.astro` | `/versus` |
| `src/pages/team.astro` | `/team` |
| `src/pages/404.astro` | 404 page |

### Dynamic Routes

| File | Route | Example |
|------|-------|---------|
| `src/pages/pokemon/[name].astro` | `/pokemon/:name` | `/pokemon/pikachu` |

## Path Aliases

Configured in `tsconfig.json` for cleaner imports:

```typescript
// Instead of:
import SearchIsland from '../components/SearchIsland.jsx';

// Use:
import SearchIsland from '@components/SearchIsland.jsx';
```

| Alias | Path |
|-------|------|
| `@components/*` | `src/components/*` |
| `@utils/*` | `src/utils/*` |
| `@data/*` | `src/data/*` |
| `@layouts/*` | `src/layouts/*` |
| `@styles/*` | `src/styles/*` |

## Client Hydration

Astro components are static by default. Interactive components use the `client:load` directive:

```astro
---
import SearchIsland from '@components/SearchIsland.jsx';
---

<!-- Static HTML -->
<h1>PokeWeak</h1>

<!-- Interactive Preact component -->
<SearchIsland client:load />
```

The `client:load` directive tells Astro to hydrate the component on page load. Other options:

- `client:idle` — Hydrate when the browser is idle
- `client:visible` — Hydrate when scrolled into view
- `client:media` — Hydrate when a media query matches

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Build Time                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  pokemon.json ──────┬──► SearchIsland (autocomplete)       │
│                     │                                       │
│                     ├──► TeamBuilderIsland (team slots)     │
│                     │                                       │
│                     ├──► VersusIsland (1v1 compare)        │
│                     │                                       │
│                     ├──► SpeedIsland (speed leaderboard)   │
│                     │                                       │
│                     └──► [name].astro (detail page)        │
│                                                             │
│  types.json ────────┬──► typeCalc.ts (weakness calc)       │
│                     │                                       │
│                     └──► CheatsheetTabs (reference)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Runtime (Client)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Input ──► SearchIsland ──► calculateWeaknesses()     │
│                    │                    │                    │
│                    ▼                    ▼                    │
│              Filter Results ──► Display Weaknesses         │
│                                                             │
│  localStorage ──► TeamBuilderIsland (persist team)         │
│                                                             │
│  Service Worker ──► Cache PokeAPI sprites                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### Why Preact over React?

- **Size:** 3KB gzipped vs 42KB gzipped
- **Performance:** Faster hydration, smaller bundle
- **Compatibility:** Full React API compatibility via `preact/compat`

### Why Astro?

- **Static-first:** Perfect for content-heavy sites
- **Islands architecture:** Hydrate only what's needed
- **Built-in optimizations:** Image optimization, sitemap, RSS

### Why Tailwind CSS 4?

- **Zero-config:** Works out of the box with Vite
- **CSS variables:** Native support for theming
- **Utility-first:** Fast development, consistent design

### Why localStorage for Team?

- **No backend needed:** Simple persistence without database
- **Offline support:** Works without network connection
- **Privacy:** No server-side data storage
