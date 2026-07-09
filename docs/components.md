# Components

Detailed documentation for all Preact and Astro components in PokeWeak.

## Component Overview

| Component | Type | Purpose |
|-----------|------|---------|
| `SearchIsland.jsx` | Preact | Main search with Pokémon list |
| `TypeCheckerIsland.jsx` | Preact | Manual type weakness calculator |
| `TeamBuilderIsland.jsx` | Preact | Team builder (6 slots) |
| `VersusIsland.jsx` | Preact | 1v1 Pokémon comparison |
| `SpeedIsland.jsx` | Preact | Speed leaderboard |
| `CheatsheetTabs.jsx` | Preact | Type cheatsheet + hidden mechanics |
| `TypeFilterButtons.jsx` | Preact | Shared type filter UI |
| `TypeIcon.jsx` | Preact | Type icon (client-side) |
| `TypeIcon.astro` | Astro | Type icon (static) |
| `BottomNav.astro` | Astro | Mobile bottom navigation |
| `QuickSearch.jsx` | Preact | Search for detail pages |
| `SearchSelect.jsx` | Preact | Reusable search dropdown |
| `ErrorBoundary.jsx` | Preact | Error boundary wrapper |

---

## SearchIsland.jsx

The main search interface with autocomplete functionality.

### Features

- Real-time search as you type
- Type filter buttons (1-2 types)
- Instant type weakness display
- Responsive list with lazy rendering

### Props

None (self-contained component).

### State

| State | Type | Description |
|-------|------|-------------|
| `query` | `string` | Current search input |
| `filterTypes` | `string[]` | Selected type filters (max 2) |
| `selectedPokemon` | `Pokemon \| null` | Currently selected Pokémon |

### Key Functions

```typescript
// Search filter logic
const results = useMemo(() => {
  let filtered = pokemonList;
  
  // Filter by name
  if (query) {
    filtered = filtered.filter(([name]) => 
      name.includes(query.toLowerCase())
    );
  }
  
  // Filter by type
  if (filterTypes.length > 0) {
    filtered = filtered.filter(([, data]) =>
      filterTypes.some(t => data.types.includes(t))
    );
  }
  
  return filtered.slice(0, 20); // Limit to 20 results
}, [query, filterTypes]);
```

### Usage

```astro
---
import SearchIsland from '@components/SearchIsland.jsx';
---

<SearchIsland client:load />
```

---

## TypeCheckerIsland.jsx

Manual type input calculator for checking weaknesses without a specific Pokémon name.

### Features

- Select 1-2 types from dropdown
- Real-time weakness calculation
- Visual display of ×4, ×2, ×½, ×¼, ×0

### Props

None (self-contained component).

### State

| State | Type | Description |
|-------|------|-------------|
| `selectedTypes` | `string[]` | Selected types (max 2) |

### Calculation Logic

```typescript
function calculateWeaknesses(types: string[], typeChart: TypeChart) {
  const results = {
    quadWeak: [],    // ×4 weakness
    doubleWeak: [],  // ×2 weakness
    neutral: [],     // ×1 neutral
    resist: [],      // ×½ resistance
    doubleResist: [],// ×¼ double resistance
    immune: [],      // ×0 immunity
  };
  
  for (const attacking of Object.keys(typeChart)) {
    let multiplier = 1;
    
    for (const defender of types) {
      multiplier *= typeChart[attacking][defender];
    }
    
    // Categorize by multiplier
    if (multiplier === 4) results.quadWeak.push(attacking);
    else if (multiplier === 2) results.doubleWeak.push(attacking);
    else if (multiplier === 1) results.neutral.push(attacking);
    else if (multiplier === 0.5) results.resist.push(attacking);
    else if (multiplier === 0.25) results.doubleResist.push(attacking);
    else if (multiplier === 0) results.immune.push(attacking);
  }
  
  return results;
}
```

### Usage

```astro
---
import TypeCheckerIsland from '@components/TypeCheckerIsland.jsx';
---

<TypeCheckerIsland client:load />
```

---

## TeamBuilderIsland.jsx

Build teams of up to 6 Pokémon and analyze shared weaknesses.

### Features

- 6 Pokémon slots with add/remove
- Type filter in search modal
- Aggregated team weakness analysis
- Team strength (offensive coverage) display
- Persists to localStorage

### Props

None (self-contained component).

### State

| State | Type | Description |
|-------|------|-------------|
| `team` | `(Pokemon \| null)[]` | Array of 6 Pokémon slots |
| `searchSlot` | `{ type: 'player', index: number } \| null` | Which slot is being searched |
| `query` | `string` | Search input |
| `filterTypes` | `string[]` | Selected type filters |

### Team Weakness Aggregation

```typescript
// Count how many team members are weak to each type
const aggregatedWeaknesses = useMemo(() => {
  const weaknessCounts = {};
  
  team.forEach((pokemon) => {
    const weaknesses = calculateWeaknesses(pokemon.types, typeChart);
    const allWeak = [...weaknesses.quadWeak, ...weaknesses.doubleWeak];
    
    allWeak.forEach((type) => {
      if (!weaknessCounts[type]) {
        weaknessCounts[type] = { count: 0, maxMultiplier: 0 };
      }
      weaknessCounts[type].count++;
      weaknessCounts[type].maxMultiplier = Math.max(
        weaknessCounts[type].maxMultiplier,
        weaknesses.quadWeak.includes(type) ? 4 : 2
      );
    });
  });
  
  return Object.entries(weaknessCounts)
    .sort(([, a], [, b]) => b.count - a.count);
}, [team]);
```

### localStorage Persistence

```typescript
// Load team from localStorage on mount
const [team, setTeam] = useState(() => {
  try {
    const saved = localStorage.getItem('pokeweak-team');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 6) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load team from localStorage:', e);
  }
  return Array(6).fill(null);
});

// Save team to localStorage on change
useEffect(() => {
  try {
    localStorage.setItem('pokeweak-team', JSON.stringify(team));
  } catch (e) {
    console.warn('Failed to save team to localStorage:', e);
  }
}, [team]);
```

### Usage

```astro
---
import TeamBuilderIsland from '@components/TeamBuilderIsland.jsx';
---

<TeamBuilderIsland client:load />
```

---

## VersusIsland.jsx

1v1 Pokémon matchup comparison.

### Features

- Select two Pokémon
- Offensive type matchup analysis
- Defensive type matchup analysis
- Visual comparison display

### Props

None (self-contained component).

### State

| State | Type | Description |
|-------|------|-------------|
| `pokemonA` | `Pokemon \| null` | First Pokémon |
| `pokemonB` | `Pokemon \| null` | Second Pokémon |

### Calculation

```typescript
// Calculate matchup between two Pokémon
function calculateMatchup(pokemonA: Pokemon, pokemonB: Pokemon) {
  const weakA = calculateWeaknesses(pokemonA.types, typeChart);
  const weakB = calculateWeaknesses(pokemonB.types, typeChart);
  const strongA = calculateStrengths(pokemonA.types, typeChart);
  const strongB = calculateStrengths(pokemonB.types, typeChart);
  
  return {
    // How A hits B
    aOffense: {
      superEffective: strongA.superEffective.filter(t => 
        pokemonB.types.includes(t)
      ),
      // ...
    },
    // How B hits A
    bOffense: {
      superEffective: strongB.superEffective.filter(t => 
        pokemonA.types.includes(t)
      ),
      // ...
    },
  };
}
```

### Usage

```astro
---
import VersusIsland from '@components/VersusIsland.jsx';
---

<VersusIsland client:load />
```

---

## SpeedIsland.jsx

VGC Level 50 speed leaderboard with competitive filters.

### Features

- Sortable speed table
- Speed tier calculation (No Invest, MAX, Tailwind)
- Type filter buttons
- Responsive table layout

### Props

None (self-contained component).

### Speed Tiers

| Tier | Formula | Description |
|------|---------|-------------|
| No Invest | Base + 20 | 0 EV, Neutral Nature |
| No Invest+ | floor((Base + 20) × 1.1) | 0 EV, Positive Nature |
| MAX | Base + 52 | 252 EV, Neutral Nature |
| MAX+ | floor((Base + 52) × 1.1) | 252 EV, Positive Nature |
| Tailwind | MAX+ × 2 | Under Tailwind |

### Usage

```astro
---
import SpeedIsland from '@components/SpeedIsland.jsx';
---

<SpeedIsland client:load />
```

---

## CheatsheetTabs.jsx

Two-tab reference for type matchups and hidden mechanics.

### Features

- Tab navigation (Type Matchups / Hidden Mechanics)
- 18-type grid with weaknesses/resistances
- Battle mechanics reference (abilities, items, double battle)

### Props

None (self-contained component).

### Tabs

1. **Type Matchups** — Visual grid showing all type interactions
2. **Hidden Mechanics** — Reference for abilities, items, and double battle rules

### Usage

```astro
---
import CheatsheetTabs from '@components/CheatsheetTabs.jsx';
---

<CheatsheetTabs client:load />
```

---

## BottomNav.astro

Mobile bottom navigation bar.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `currentPath` | `string` | Current route path (for active state) |

### Navigation Items

| Label | Path | Icon |
|-------|------|------|
| Search | `/` | Search icon |
| Speed | `/speed` | Lightning icon |
| Cheatsheet | `/cheatsheet` | Grid icon |
| Versus | `/versus` | VS icon |
| Team | `/team` | Users icon |

### Usage

```astro
---
import BottomNav from '@components/BottomNav.astro';
---

<BottomNav currentPath="/" />
```

---

## TypeIcon.jsx / TypeIcon.astro

Renders Pokémon type icons with correct colors.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `type` | `string` | Type name (e.g., "Fire", "Water") |
| `size` | `number` | Icon size in pixels |
| `ariaHidden` | `boolean` | Hide from screen readers (optional) |

### Type Colors

All 18 types have dedicated color variables:

```css
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
```

### Usage

```jsx
// Preact component
<TypeIcon type="Fire" size={24} />

// Astro component
<TypeIcon type="Water" size={20} ariaHidden={true} />
```

---

## TypeFilterButtons.jsx

Shared type filter UI used across multiple components.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `selectedTypes` | `string[]` | Currently selected types |
| `onToggle` | `(type: string) => void` | Toggle type selection |
| `maxSelections` | `number` | Maximum types selectable (default: 2) |

### Usage

```jsx
<TypeFilterButtons
  selectedTypes={filterTypes}
  onToggle={(type) => setFilterTypes(prev => 
    prev.includes(type) 
      ? prev.filter(t => t !== type)
      : [...prev, type]
  )}
  maxSelections={2}
/>
```

---

## QuickSearch.jsx

Search component for Pokémon detail pages.

### Features

- Compact search input
- Pokémon autocomplete
- Navigate to detail page on select

### Props

None (self-contained component).

### Usage

```astro
---
import QuickSearch from '@components/QuickSearch.jsx';
---

<QuickSearch client:load />
```

---

## ErrorBoundary.jsx

React error boundary wrapper for graceful error handling.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ComponentNode` | Child components |
| `fallback` | `ComponentNode` | Fallback UI on error |

### Usage

```jsx
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <SearchIsland />
</ErrorBoundary>
```
