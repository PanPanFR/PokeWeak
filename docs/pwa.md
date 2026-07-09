# PWA (Progressive Web App)

Documentation for Progressive Web App configuration, service worker, and caching.

## Overview

PokeWeak is a Progressive Web App that works offline and can be installed on mobile devices. It uses [@vite-pwa/astro](https://vite-pwa-org.netlify.app/) for PWA support.

## Configuration

Configured in `astro.config.mjs`:

```javascript
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PokeWeak',
        short_name: 'PokeWeak',
        description: 'Pokémon Type Weakness Checker',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#E63946',
        background_color: '#121212',
        icons: [
          {
            src: '/icons/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/',
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pokeapi-sprites',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 30,  // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
});
```

---

## Registration Type

`registerType: 'autoUpdate'` automatically updates the service worker when a new version is available.

### Other Options

| Type | Behavior |
|------|----------|
| `autoUpdate` | Automatically update without prompt |
| `prompt` | Show update prompt to user |
| `skipWaiting` | Skip waiting and activate immediately |

---

## Web App Manifest

The manifest file is generated at `/manifest.webmanifest`.

### Required Fields

| Field | Value | Description |
|-------|-------|-------------|
| `name` | `PokeWeak` | Full app name |
| `short_name` | `PokeWeak` | Abbreviated name |
| `description` | `Pokémon Type Weakness Checker` | App description |
| `start_url` | `/` | Entry point URL |
| `scope` | `/` | App scope |
| `display` | `standalone` | Standalone mode (no browser UI) |
| `orientation` | `portrait` | Lock to portrait |
| `theme_color` | `#E63946` | Theme color (red) |
| `background_color` | `#121212` | Background color (dark) |

### Icons

| Size | File | Purpose |
|------|------|---------|
| 64x64 | `pwa-64x64.png` | Small icon |
| 192x192 | `pwa-192x192.png` | Standard icon |
| 512x512 | `pwa-512x512.png` | Large icon |
| 512x512 | `maskable-icon-512x512.png` | Maskable icon (Android adaptive) |

---

## Service Worker

### Static Caching

Pre-caches all built assets:

```javascript
workbox: {
  globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
}
```

This includes:
- HTML pages
- JavaScript bundles
- CSS files
- Images (icons, sprites)
- JSON data files

### Runtime Caching

Caches PokeAPI sprites on first request:

```javascript
runtimeCaching: [
  {
    urlPattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'pokeapi-sprites',
      expiration: {
        maxEntries: 300,
        maxAgeSeconds: 60 * 60 * 24 * 30,  // 30 days
      },
    },
  },
]
```

### Cache Strategies

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| `CacheFirst` | Try cache, fallback to network | Static assets, sprites |
| `NetworkFirst` | Try network, fallback to cache | API calls |
| `StaleWhileRevalidate` | Use cache, update in background | Frequently updated content |
| `NetworkOnly` | Always fetch from network | Real-time data |
| `CacheOnly` | Always use cache | Offline-only content |

---

## Installation

### Android

1. Visit pokeweak.my.id in Chrome
2. Tap "Add to Home Screen" banner
3. Confirm installation

### iOS (Safari)

1. Visit pokeweak.my.id in Safari
2. Tap Share button
3. Scroll down and tap "Add to Home Screen"
4. Confirm installation

### Desktop

1. Visit pokeweak.my.id in Chrome/Edge
2. Click install icon in address bar
3. Confirm installation

---

## Offline Behavior

When offline:
- All cached pages are accessible
- Pokémon sprites load from cache
- Search and team builder work offline
- No network requests for static content

---

## PWA Meta Tags

Added in `MainLayout.astro`:

```html
<meta name="theme-color" content="#E63946" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="manifest" href="/manifest.webmanifest" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png" />
```

---

## PWA Viewport Fix

Handles dynamic viewport height on mobile devices:

```javascript
const setAppHeight = () => {
  document.documentElement.style.setProperty(
    '--app-height', 
    `${window.innerHeight}px`
  );
};

window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', setAppHeight);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', setAppHeight);
}
setAppHeight();
```

This fixes the "100vh" issue on mobile browsers where the address bar affects viewport height.

---

## Standalone Mode Detection

Detects when app is running in standalone mode (installed):

```javascript
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
  ('standalone' in navigator && navigator.standalone);

if (isStandalone) {
  // Intercept local links to prevent opening in external browser
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (target && target.href && target.href.includes(window.location.hostname)) {
      e.preventDefault();
      window.location.href = target.href;
    }
  });
}
```

---

## Icons Directory

```
public/icons/
├── apple-touch-icon-180x180.png  # iOS home screen icon
├── favicon.ico                   # Browser tab icon
├── icon-192.svg                  # App icon (small)
├── icon-512.svg                  # App icon (large)
├── icon-maskable.svg             # Maskable icon
├── maskable-icon-512x512.png     # Maskable icon (PNG)
├── pwa-64x64.png                 # PWA icon (small)
├── pwa-192x192.png               # PWA icon (medium)
├── pwa-512x512.png               # PWA icon (large)
└── types/                        # SVG type icons
    ├── fire.svg
    ├── water.svg
    ├── electric.svg
    └── ... (18 types)
```
