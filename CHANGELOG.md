# Changelog

All notable changes to the PokeWeak project will be documented in this file.

## [Unreleased] - 2026-06-30

### Added
- **Meta Analysis Page** - New page for viewing top meta Pokémon and team compositions
  - Single Battle and Double Battle format support
  - Top 15 most used Pokémon per format
  - Popular team compositions with synergy analysis
  - Usage percentage display

- **Team Weakness Checker** - New page for analyzing team vulnerabilities
  - 6 Pokémon team builder with search functionality
  - Aggregated weakness analysis
  - Coverage gap identification
  - Suggested counter Pokémon

- **Manual Type Checker** - Enhancement to cheatsheet page
  - Input manual type combinations
  - Real-time weakness calculation
  - Support for single and dual-type combinations

- **Ability Field** - Added to Pokémon data
  - Most used ability per Pokémon (competitive format)
  - Displayed on Pokémon detail pages

### Fixed
- Added missing Rotom forms (Rotom-Wash, Rotom-Heat, Rotom-Mow, Rotom-Frost)
- Added other missing Pokémon forms and variants

### Changed
- Updated BottomNav with new "Meta" and "Team" tabs
- Enhanced Pokémon detail page to show ability information

---

## Implementation Details

### File Structure Changes

```
src/
├── components/
│   ├── MetaIsland.jsx       # NEW: Meta analysis component
│   ├── TypeCheckerIsland.jsx # NEW: Manual type checker
│   ├── TeamBuilderIsland.jsx # NEW: Team builder component
│   └── BottomNav.astro       # MODIFIED: Added Meta & Team nav items
├── data/
│   ├── meta.json            # NEW: Meta usage data
│   └── pokemon.json         # MODIFIED: Added ability field, missing Pokémon
├── pages/
│   ├── meta.astro           # NEW: Meta analysis page
│   ├── team.astro           # NEW: Team weakness checker
│   └── cheatsheet.astro     # MODIFIED: Added type input feature
└── utils/
    └── typeCalc.ts          # MODIFIED: Added team aggregation function
```

### Data Updates

#### Pokemon Interface
```typescript
interface Pokemon {
  id: number;
  name: string;
  types: string[];
  speed: number;
  sprite?: string;
  ability: string;  // NEW
}
```

#### Meta Data Structure
```typescript
interface MetaData {
  single: {
    topPokemon: Array<{
      name: string;
      usage: number;
      rank: number;
    }>;
    topTeams: Array<{
      team: string[];
      usage: number;
    }>;
  };
  double: {
    topPokemon: Array<{
      name: string;
      usage: number;
      rank: number;
    }>;
    topTeams: Array<{
      team: string[];
      usage: number;
    }>;
  };
}
```

### UI Components

#### MetaIsland.jsx Features
- Tab switching between Single/Double formats
- Ranked Pokémon list with usage percentages
- Team composition display (6 Pokémon grid)
- Responsive design for mobile

#### TeamBuilderIsland.jsx Features
- 6 selectable Pokémon slots
- Search integration per slot
- Real-time weakness aggregation
- Visual indicators for common weaknesses

#### TypeCheckerIsland.jsx Features
- Dual type selection dropdowns
- Instant weakness calculation
- Visual display of ×4, ×2, ×½, ×¼, ×0 results

---

## Future Considerations

- [ ] Add filtering by tier (OU, UU, RU, etc.)
- [ ] Add export/import team functionality
- [ ] Add damage calculator integration
- [ ] Add type effectiveness calculator for moves
- [ ] Add comparison between multiple teams