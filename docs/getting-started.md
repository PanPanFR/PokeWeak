# Getting Started

This guide walks you through setting up PokeWeak for development.

## Prerequisites

- **Node.js** ≥ 22.12.0 (check with `node -v`)
- **npm** ≥ 10.x (comes with Node.js)
- **Git** for version control

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pokeweak.git
cd pokeweak

# Install dependencies
npm install
```

## Development Server

```bash
# Start the dev server
npm run dev

# Access at http://localhost:4321
```

The dev server supports hot module replacement (HMR). Changes to `.astro`, `.jsx`, `.tsx`, and `.css` files will instantly update in the browser.

### Background Mode

For longer-running development sessions:

```bash
# Start in background
astro dev --background

# Manage background process
astro dev status    # Check if running
astro dev logs      # View output
astro dev stop      # Stop the server
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production bundle to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint source with ESLint |
| `npm run format` | Format source with Prettier |

## First Run

After starting the dev server:

1. Open `http://localhost:4321` in your browser
2. You'll see the home page with a search bar
3. Type a Pokémon name (e.g., "Pikachu") to see type weaknesses
4. Use the bottom navigation to explore other features

## IDE Setup

### VS Code

Recommended extensions:

- **Astro** (`astro-build.astro-vscode`) — Astro language support
- **ESLint** (`dbaeumer.vscode-eslint`) — Linting
- **Prettier** (`esbenp.prettier-vscode`) — Formatting

The project includes VS Code settings in `.vscode/` for consistent formatting.

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 4321
npx kill-port 4321

# Or use a different port
npm run dev -- --port 3000
```

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules .astro
npm install
npm run build
```

### Type Errors

```bash
# Run TypeScript compiler to check for errors
npx tsc --noEmit
```
