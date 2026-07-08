## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Project Overview

**PokeWeak** is a Pokémon Type Weakness Checker built with [Astro](https://astro.build) + [Preact](https://preactjs.com/) + [Tailwind CSS](https://tailwindcss.com).

### Features
- Search Pokémon by name with autocomplete
- View type weakness breakdown (×4, ×2, ×½, ×¼, ×0)
- Speed leaderboard with filtering
- Type matchup cheatsheet
- Versus mode (1v1 Pokémon comparison)
- Team builder (up to 6 Pokémon)
- PWA support with offline caching
- Mobile-first responsive design

## Project Structure

```
src/
├── components/
│   ├── BottomNav.astro         # Mobile bottom navigation
│   ├── QuickSearch.jsx         # Search component for detail pages
│   ├── SearchIsland.jsx        # Main search with Pokémon list
│   ├── SearchSelect.jsx        # Reusable search dropdown
│   ├── SpeedIsland.jsx         # Speed leaderboard with filters
│   ├── TeamBuilderIsland.jsx   # Team builder (6 Pokémon)
│   ├── TypeCheckerIsland.jsx   # Type checker component
│   ├── TypeIcon.astro          # Astro type icon component
│   ├── TypeIcon.jsx            # Preact type icon component
│   └── VersusIsland.jsx        # Versus mode (1v1 comparison)
├── data/
│   ├── pokemon.json            # Pokémon data (id, name, types, speed, sprite)
│   └── types.json              # Type effectiveness chart
├── layouts/
│   └── MainLayout.astro        # Base layout with PWA meta tags
├── pages/
│   ├── index.astro             # Home - search page
│   ├── speed.astro             # Speed leaderboard
│   ├── cheatsheet.astro        # Type matchups reference
│   ├── team.astro              # Team builder page
│   ├── versus.astro            # Versus mode page
│   └── pokemon/
│       └── [name].astro        # Dynamic Pokémon detail page
├── styles/
│   └── global.css              # Global styles
└── utils/
    ├── pokemon.ts              # Helper functions (getSprite, displayName)
    ├── speedCalc.ts            # Speed calculation utilities
    ├── typeCalc.ts             # Type weakness calculation logic
    └── versusCalc.ts           # Versus mode calculation logic
```

## Data Structure

### Pokemon Data (`src/data/pokemon.json`)
```typescript
interface Pokemon {
  id: number;           // National Pokédex number
  name: string;         // Display name
  types: string[];      // One or two type names
  speed: number;        // Speed stat (1-200)
  sprite?: string;      // Custom sprite URL
}
```

### Type Chart (`src/data/types.json`)
Type effectiveness multipliers:
- `4` = Quad weakness (×4 damage)
- `2` = Double weakness (×2 damage)
- `1` = Neutral (×1 damage)
- `0.5` = Resistance (×½ damage)
- `0.25` = Double resistance (×¼ damage)
- `0` = Immunity (×0 damage)

## Available Skills

| Skill | Description |
|-------|-------------|
| `clean-code` | Code quality and maintainability improvements |
| `codebase-design` | Architecture and structure analysis |
| `documentation` | Documentation writing and improvement |
| `documentation-writer` | Technical documentation generation |
| `frontend-design` | UI/UX design best practices |
| `improve-codebase-architecture` | Codebase architecture improvements |
| `pwa-development` | Progressive Web App features |
| `test-driven-development` | TDD approach for new features |
| `testing-strategy` | Testing strategy and implementation |
| `ui-ux-pro-max` | Advanced UI/UX design guidance |
| `vercel-react-best-practices` | React/Preact best practices |
| `web-design-guidelines` | Web design principles |
| `webapp-testing` | Web application testing |
| `audit-speed` | Performance auditing |

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI commands |

## Deploy

Push to the `main` branch → GitHub Actions → auto-deploys to Cloudflare Pages.
