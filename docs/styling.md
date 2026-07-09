# Styling

Documentation for CSS variables, theming, animations, and type colors.

## CSS Variables

PokeWeak uses CSS custom properties for theming. All variables are defined in `src/styles/global.css`.

### Dark Theme (Default)

```css
:root {
  --bg-body: #121212;
  --bg-surface: #1E1E1E;
  --bg-surface-alt: #2A2A2A;
  --bg-elevated: rgba(14, 18, 25, 0.9);
  --bg-dropdown: #10151F;
  --bg-card: rgba(255, 255, 255, 0.035);
  --bg-hover: rgba(255, 255, 255, 0.06);
  --bg-focus: rgba(255, 255, 255, 0.08);
  
  --text-primary: #FFFFFF;
  --text-secondary: #A0A0A0;
  --text-muted: #AEB7C4;
  --text-inverse: #111827;
  
  --border-subtle: rgba(255, 255, 255, 0.09);
  --border-medium: rgba(255, 255, 255, 0.13);
  --border-strong: rgba(255, 255, 255, 0.2);
  
  --scrollbar-thumb: #444;
  --scrollbar-thumb-hover: #555;
  --scrollbar-track: #1E1E1E;
  
  --nav-bg: #1A1A1A;
  --overlay-bg: rgba(0, 0, 0, 0.8);
}
```

### Light Theme

```css
[data-theme="light"] {
  --bg-body: #EAE8E3;
  --bg-surface: #F5F3EC;
  --bg-surface-alt: #DFDDD6;
  --bg-elevated: rgba(245, 243, 236, 0.95);
  --bg-dropdown: #F5F3EC;
  --bg-card: rgba(0, 0, 0, 0.04);
  --bg-hover: rgba(0, 0, 0, 0.06);
  --bg-focus: rgba(0, 0, 0, 0.09);
  
  --text-primary: #333333;
  --text-secondary: #5C5C5C;
  --text-muted: #7A7A7A;
  --text-inverse: #FFFFFF;
  
  --border-subtle: rgba(0, 0, 0, 0.07);
  --border-medium: rgba(0, 0, 0, 0.13);
  --border-strong: rgba(0, 0, 0, 0.22);
  
  --scrollbar-thumb: #CCC8C0;
  --scrollbar-thumb-hover: #AFAAA0;
  --scrollbar-track: #EAE8E3;
  
  --nav-bg: #F0EDE8;
  --overlay-bg: rgba(0, 0, 0, 0.4);
}
```

---

## Type Colors

All 18 Pokémon types have dedicated color variables for consistent visual representation.

```css
@theme {
  --color-pk-normal: #A8A77A;
  --color-pk-fire: #EE8130;
  --color-pk-water: #6390F0;
  --color-pk-electric: #F7D02C;
  --color-pk-grass: #7AC74C;
  --color-pk-ice: #96D9D6;
  --color-pk-fighting: #C22E28;
  --color-pk-poison: #A33EA1;
  --color-pk-ground: #E2BF65;
  --color-pk-flying: #A98FF3;
  --color-pk-psychic: #F95587;
  --color-pk-bug: #A6B91A;
  --color-pk-rock: #B6A136;
  --color-pk-ghost: #735797;
  --color-pk-dragon: #6F35FC;
  --color-pk-dark: #705746;
  --color-pk-steel: #B7B7CE;
  --color-pk-fairy: #D685AD;
}
```

### Color Usage

```css
/* Type badge background */
.type-badge-fire {
  background: color-mix(in srgb, var(--color-pk-fire) 14%, transparent);
  color: var(--color-pk-fire);
}

/* Type icon */
.type-icon {
  color: var(--color-pk-water);
}
```

---

## Animations

### fadeInUp

Entry animation for list items and components.

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 250ms ease-out both;
}
```

### Staggered Animation

For list items with sequential delay.

```css
.animate-stagger {
  animation: fadeInUp 250ms ease-out both;
  animation-delay: calc(var(--i, 0) * 30ms);
}
```

Usage in JSX:

```jsx
{items.map((item, index) => (
  <div 
    key={item.id}
    class="animate-stagger"
    style={{ '--i': index }}
  >
    {item.name}
  </div>
))}
```

### Shimmer

Loading skeleton animation.

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface) 25%,
    var(--bg-surface-alt) 50%,
    var(--bg-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### Hover Effects

```css
/* Scale on hover */
.pk-list-item {
  transition: background 150ms ease, transform 150ms ease;
}

.pk-list-item:hover {
  background: var(--bg-hover);
  transform: scale(1.01);
}

.pk-list-item:active {
  transform: scale(0.98);
}

/* Glow effect */
.heading-glow {
  text-shadow: 0 0 20px rgba(230, 57, 70, 0.3);
}

/* Search focus glow */
.search-input-glow:focus {
  box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.25);
  border-color: rgba(230, 57, 70, 0.5) !important;
}
```

---

## Reduced Motion

Respects user's prefers-reduced-motion setting.

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-stagger {
    animation: none !important;
  }

  .pk-list-item {
    transition: none !important;
  }

  .search-input-glow {
    transition: none !important;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Utility Classes

### Pixelated Rendering

For crisp pixel art sprites.

```css
.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
```

### Scrollbar Styling

Thin, styled scrollbars.

```css
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 3px;
}
```

### Screen Reader Only

Accessible hiding for visually hidden content.

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Focus Styles

Visible focus indicators for keyboard navigation.

```css
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid #FBBF24;
  outline-offset: 3px;
}
```

---

## Touch Targets

Minimum touch target size for mobile accessibility.

```css
button,
a,
input,
[role="option"] {
  touch-action: manipulation;
}

/* Minimum 44px hit target */
.nav-item {
  min-width: 44px;
  min-height: 44px;
}
```
