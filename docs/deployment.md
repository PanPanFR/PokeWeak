# Deployment

Documentation for building and deploying PokeWeak on Cloudflare Pages.

## Build

### Production Build

```bash
npm run build
```

Output goes to `./dist/`.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally at `http://localhost:4321`.

---

## Cloudflare Pages

PokeWeak is deployed with Cloudflare Pages.

### Project Settings

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `22` or newer |

### Headers

Cloudflare Pages reads security headers from `public/_headers`, which is copied into `dist/_headers` during the Astro build.

Current CSP keeps sprite/image sources restricted and removes `unsafe-eval` from scripts.

---

## CI

GitHub Actions runs tests and a production build on pushes and pull requests to `main`.

Cloudflare Pages handles deployment from the connected repository after the branch build succeeds.

Pipeline:

1. Checkout repository
2. Setup Node.js 22
3. Install dependencies with `npm ci`
4. Run `npm test`
5. Run `npm run build`
6. Cloudflare Pages deploys `dist/`

---

## Environment Variables

No runtime environment variables are required. All app configuration is static.

---

## Domain

- **URL:** [pokeweak.my.id](https://pokeweak.my.id)

SEO metadata is configured in `src/layouts/MainLayout.astro`.

---

## Rollback

1. Open the Cloudflare dashboard.
2. Select the Pages project.
3. Go to Deployments.
4. Select a previous working deployment.
5. Click Rollback.
