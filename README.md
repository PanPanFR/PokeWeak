# PokeWeak — Pokémon Type Weakness Checker

Search any Pokémon to find its type weaknesses, resistances, and immunities. Built with [Astro](https://astro.build) + [Preact](https://preactjs.com/).

**Live Demo:** [pokeweak.my.id](https://pokeweak.my.id)

## Features

- Search Pokémon by name with autocomplete
- View type weakness breakdown (×4, ×2, ×½, ×¼, ×0)
- Speed leaderboard with VGC Level 50 tiers
- Type matchup cheatsheet
- Hidden battle mechanics reference
- Versus mode (1v1 Pokémon comparison)
- Team builder (up to 6 Pokémon)
- PWA support with offline caching
- Dark/Light theme
- Mobile-first responsive design

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Astro](https://astro.build) 7.x |
| UI Library | [Preact](https://preactjs.com) 10.x |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4.x |
| Language | TypeScript 6.x |
| Testing | Vitest 4.x |
| Deployment | Vercel |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Access at http://localhost:4321
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint source |

## Project Structure

```
src/
├── components/        # Preact & Astro components
├── data/              # Pokémon data & type chart
├── layouts/           # Astro layouts
├── pages/             # Route pages
├── styles/            # Global CSS & variables
├── types/             # TypeScript interfaces
└── utils/             # Utility functions
```

## Documentation

Detailed documentation available in [`docs/`](./docs/) folder:

- [Getting Started](./docs/getting-started.md)
- [Architecture](./docs/architecture.md)
- [Components](./docs/components.md)
- [Data Structures](./docs/data-structures.md)
- [Styling](./docs/styling.md)
- [PWA](./docs/pwa.md)
- [Deployment](./docs/deployment.md)
- [Contributing](./docs/contributing.md)

## Contributing

See [Contributing Guide](./docs/contributing.md).

1. Fork the repository
2. Create a feature branch
3. Make changes and ensure `npm run lint` passes
4. Run `npm run test` to verify tests pass
5. Submit a Pull Request

## License

MIT