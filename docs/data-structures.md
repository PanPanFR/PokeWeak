# Data Structures

Documentation for data files, TypeScript interfaces, and utility functions.

## TypeScript Interfaces

### Pokemon

```typescript
// src/types/pokemon.ts

export interface Pokemon {
  id: number;           // National Pokédex number
  name: string;         // Display name
  types: string[];      // One or two type names (e.g., ["Fire", "Flying"])
  speed: number;        // Base speed stat
  sprite?: string;      // Custom sprite URL (optional, falls back to PokeAPI)
  abilities?: (string | { name: string; description: string })[];
}

export type PokemonData = Record<string, Pokemon>;
export type PokemonEntry = [string, Pokemon];
```

### Type Chart

```typescript
// types.json structure
type TypeChart = Record<string, Record<string, number>>;

// Example:
{
  "Fire": {
    "Grass": 2,      // Fire is super effective against Grass
    "Water": 0.5,    // Fire is not very effective against Water
    "Fire": 0.5,     // Fire resists Fire
    "Dragon": 0.5,   // Fire is not very effective against Dragon
    // ...
  },
  // ...
}
```

### Weakness Result

```typescript
// src/utils/typeCalc.ts

export interface WeaknessResult {
  quadWeak: string[];      // ×4 weakness (e.g., ["Rock"])
  doubleWeak: string[];    // ×2 weakness (e.g., ["Water", "Electric"])
  neutral: string[];       // ×1 neutral (e.g., ["Grass"])
  resist: string[];        // ×½ resistance (e.g., ["Bug", "Steel"])
  doubleResist: string[];  // ×¼ double resistance (e.g., ["Fairy"])
  immune: string[];        // ×0 immunity (e.g., ["Ground"])
}
```

### Strength Result

```typescript
// src/utils/typeCalc.ts

export interface StrengthResult {
  superEffective: string[];        // Types hit for ×2
  notVeryEffective: string[];      // Types that resist (×½)
  noEffect: string[];              // Types immune (×0)
  extremelyEffective: string[][];  // Dual-type combos hit for ×4
}
```

---

## Data Files

### pokemon.json

Contains all Pokémon data with the following structure:

```json
{
  "pikachu": {
    "id": 25,
    "name": "Pikachu",
    "types": ["Electric"],
    "speed": 90,
    "sprite": null,
    "abilities": ["Static", "Lightning Rod"]
  },
  "charizard": {
    "id": 6,
    "name": "Charizard",
    "types": ["Fire", "Flying"],
    "speed": 100,
    "sprite": null,
    "abilities": ["Blaze", "Solar Power"]
  }
}
```

### types.json

Complete type effectiveness chart:

```json
{
  "Normal": {
    "Normal": 1,
    "Fire": 1,
    "Water": 1,
    "Electric": 1,
    "Grass": 1,
    "Ice": 1,
    "Fighting": 1,
    "Poison": 1,
    "Ground": 1,
    "Flying": 1,
    "Psychic": 1,
    "Bug": 1,
    "Rock": 0.5,
    "Ghost": 0,
    "Dragon": 1,
    "Dark": 1,
    "Steel": 0.5,
    "Fairy": 1
  },
  "Fire": {
    "Normal": 1,
    "Fire": 0.5,
    "Water": 0.5,
    "Electric": 1,
    "Grass": 2,
    "Ice": 2,
    "Fighting": 1,
    "Poison": 1,
    "Ground": 1,
    "Flying": 1,
    "Psychic": 1,
    "Bug": 2,
    "Rock": 0.5,
    "Ghost": 1,
    "Dragon": 0.5,
    "Dark": 1,
    "Steel": 2,
    "Fairy": 1
  }
  // ... all 18 types
}
```

---

## Utility Functions

### pokemon.ts

```typescript
// src/utils/pokemon.ts

/**
 * Get sprite URL for a Pokémon
 * Falls back to PokeAPI if no custom sprite
 */
function getSpriteUrl(id: number, _name?: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getSprite(data: { id: number; name?: string; sprite?: string }): string {
  if (data.sprite) return data.sprite;
  return getSpriteUrl(data.id, data.name);
}

/**
 * Format Pokémon name for display
 * Converts kebab-case to Title Case
 */
export function formatName(key: string, data: { name?: string }): string {
  return data.name || key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
```

### typeCalc.ts

```typescript
// src/utils/typeCalc.ts

/**
 * Calculate offensive strengths (what types this Pokémon hits super effectively)
 */
export function calculateStrengths(
  types: string[],
  typeChart: Record<string, Record<string, number>>
): StrengthResult {
  const result: StrengthResult = {
    superEffective: [],
    notVeryEffective: [],
    noEffect: [],
    extremelyEffective: [],
  };

  const allTypes = Object.keys(typeChart);

  // Single-type effectiveness
  for (const defender of allTypes) {
    let bestMult = 0;
    for (const attacker of types) {
      const mult = typeChart[attacker]?.[defender] ?? 1;
      bestMult = Math.max(bestMult, mult);
    }

    if (bestMult >= 2) result.superEffective.push(defender);
    else if (bestMult === 0) result.noEffect.push(defender);
    else if (bestMult <= 0.5) result.notVeryEffective.push(defender);
  }

  // Dual-type combo ×4 effectiveness
  for (let i = 0; i < allTypes.length; i++) {
    for (let j = i + 1; j < allTypes.length; j++) {
      const def1 = allTypes[i];
      const def2 = allTypes[j];

      let bestMult = 0;
      for (const attacker of types) {
        const mult = (typeChart[attacker]?.[def1] ?? 1) * (typeChart[attacker]?.[def2] ?? 1);
        bestMult = Math.max(bestMult, mult);
      }

      if (bestMult >= 4) {
        result.extremelyEffective.push([def1, def2]);
      }
    }
  }

  return result;
}

/**
 * Calculate defensive weaknesses (what types hit this Pokémon super effectively)
 */
export function calculateWeaknesses(
  types: string[],
  typeChart: Record<string, Record<string, number>>
): WeaknessResult {
  const results: WeaknessResult = {
    quadWeak: [],
    doubleWeak: [],
    neutral: [],
    resist: [],
    doubleResist: [],
    immune: [],
  };

  const attackingTypes = Object.keys(typeChart);

  for (const attacking of attackingTypes) {
    let multiplier = 1;

    for (const defender of types) {
      multiplier *= typeChart[attacking]?.[defender] ?? 1;
    }

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

### speedCalc.ts

```typescript
// src/utils/speedCalc.ts

/**
 * Calculate VGC Level 50 speed tiers
 * Assumes 31 IVs (perfect)
 */
export function calculateSpeedTiers(baseSpeed: number) {
  const base = baseSpeed;
  const noInvest = baseSpeed + 20;                    // 0 EV, Neutral Nature
  const noInvestPlus = Math.floor((baseSpeed + 20) * 1.1);  // 0 EV, Positive Nature
  const max = baseSpeed + 52;                         // 252 EV, Neutral Nature
  const maxPlus = Math.floor((baseSpeed + 52) * 1.1); // 252 EV, Positive Nature
  const tailwind = maxPlus * 2;                       // Under Tailwind

  return {
    base,
    basePlus: noInvest,
    noInvestPlus,
    max,
    maxPlus,
    tailwind
  };
}
```

---

## Type Effectiveness Multipliers

| Multiplier | Meaning | Example |
|------------|---------|---------|
| `4` | Quad weakness | Rock vs Charizard (Fire/Flying) |
| `2` | Double weakness | Water vs Charmander (Fire) |
| `1` | Neutral | Normal vs Pikachu (Electric) |
| `0.5` | Resistance | Fire vs Charmander (Fire) |
| `0.25` | Double resistance | Bug vs Charizard (Fire/Flying) |
| `0` | Immunity | Ground vs Charizard (Flying) |
