# Deployment

Documentation for building, deploying, and CI/CD pipeline.

## Build

### Production Build

```bash
npm run build
```

Output goes to `./dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally at `http://localhost:4321`.

---

## Deployment Platforms

### Vercel (Current)

PokeWeak is deployed to Vercel via GitHub Actions.

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### Required Secrets

| Secret | Description |
|--------|-------------|
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `VERCEL_TOKEN` | Vercel API token |

#### Setup Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Copy values to GitHub repository secrets

### Cloudflare Pages (Alternative)

The project includes Cloudflare headers in `public/_headers`.

#### Setup

1. Connect repository to Cloudflare Pages
2. Build command: `npm run build`
3. Build output directory: `dist`

---

## Environment Variables

No runtime environment variables needed. All configuration is static.

---

## Domain Configuration

### Current Domain

- **URL:** [pokeweak.my.id](https://pokeweak.my.id)

### SEO Meta Tags

Configured in `MainLayout.astro`:

```html
<link rel="canonical" href="https://pokeweak.my.id" />
<meta property="og:url" content="https://pokeweak.my.id" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PokeWeak",
  "url": "https://pokeweak.my.id",
  "description": "Pokémon Type Weakness Checker",
  "applicationCategory": "GameApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
</script>
```

---

## Performance Optimization

### Static Generation

All pages are pre-rendered at build time:

- `/` — Home page
- `/speed` — Speed leaderboard
- `/cheatsheet` — Type cheatsheet
- `/versus` — Versus mode
- `/team` — Team builder
- `/pokemon/[name]` — Dynamic Pokémon pages

### Asset Optimization

- **Tailwind CSS 4:** Purges unused styles
- **Image optimization:** Pixelated sprites, lazy loading
- **Font loading:** Preconnect + preload with fallback

### Caching

- **Service Worker:** Caches all static assets
- **PokeAPI Sprites:** CacheFirst strategy, 30 days
- **Browser Caching:** Set via hosting platform headers

---

## Monitoring

### Lighthouse

Run Lighthouse audit:

```bash
npx lighthouse http://localhost:4321 --output=html --output-path=./lighthouse-report.html
```

Current scores (from `lighthouse-report.json`):

| Category | Score |
|----------|-------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 90+ |
| SEO | 100 |

---

## Rollback

### Vercel

1. Go to Vercel dashboard
2. Select project
3. Go to Deployments tab
4. Find previous working deployment
5. Click "..." → "Promote to Production"

### Cloudflare Pages

1. Go to Cloudflare dashboard
2. Select Pages project
3. Go to Deployments tab
4. Find previous working deployment
5. Click "Rollback to this deployment"

---

## CI/CD Pipeline

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Push to   │───►│   GitHub    │───►│   Build     │───►│   Deploy    │
│   main      │    │   Actions   │    │   (npm)     │    │   (Vercel)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Pipeline Steps

1. **Trigger:** Push to `main` branch
2. **Checkout:** Clone repository
3. **Setup:** Install Node.js 22, cache npm
4. **Install:** `npm ci` (clean install)
5. **Build:** `npm run build`
6. **Deploy:** Push to Vercel production
