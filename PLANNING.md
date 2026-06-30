# PokeWeak Improvement Planning

## Overview
This document outlines the implementation plan for 5 major improvements to the PokeWeak application.

---

## 1. Meta Analysis Page (New Feature)

### Description
Create a new page/tab in the navbar for viewing top meta Pokémon and top meta teams, with support for both Single and Double battle formats.

### Implementation Plan

#### 1.1 Data Structure
- Create `src/data/meta.json` containing:
  - Top 10-15 most used Pokémon in Single format
  - Top 10-15 most used Pokémon in Double format
  - Popular team compositions (6 Pokémon per team)
  - Source: Pikalytics, Smogon, or similar competitive Pokémon sites

#### 1.2 New Page: `src/pages/meta.astro`
- Tab navigation: Single | Double
- Section 1: Top Meta Pokémon (ranked list with usage %)
- Section 2: Top Meta Teams (team compositions with synergy analysis)
- Each Pokémon shows: sprite, name, types, ability, speed

#### 1.3 Update BottomNav.astro
- Add new nav item: "Meta" with chart/analytics icon
- Path: `/meta`

#### 1.4 UI Components Needed
- `MetaIsland.jsx` - Main component with tab switching
- Team display component with 6 Pokémon grid
- Usage percentage badges

---

## 2. Add Ability Field to Pokémon Data

### Description
Add "ability" field to each Pokémon using the most commonly used ability in competitive play.

### Implementation Plan

#### 2.1 Update Pokemon Interface
```typescript
interface Pokemon {
  id: number;
  name: string;
  types: string[];
  speed: number;
  sprite?: string;
  ability: string;  // NEW: Most used ability
}
```

#### 2.2 Data Update Strategy
- Source: Pikalytics, Smogon, or Pokémon Database
- For each Pokémon, add the most popular ability:
  - Example: Charizard → "Blaze" or "Solar Power" (depending on format)
  - Rotom-Wash → "Levitation"

#### 2.3 Update Files
- `src/data/pokemon.json` - Add ability field to all entries
- `src/pages/pokemon/[name].astro` - Display ability on detail page
- `src/components/SearchIsland.jsx` - Show ability in search results (optional)

---

## 3. Add Missing Pokémon

### Description
Ensure all Pokémon are included, especially forms like Rotom-Wash that are currently missing.

### Implementation Plan

#### 3.1 Missing Pokémon to Add
Based on user report, add:
- Rotom-Wash (Electric/Water form)
- Other Rotom forms: Rotom-Heat, Rotom-Mow, Rotom-Frost
- Any other missing forms/variants

#### 3.2 Update Files
- `src/data/pokemon.json` - Add missing entries
- `src/components/SearchIsland.jsx` - Add to champions list if applicable

---

## 4. Cheatsheet Type Input Enhancement

### Description
Add a manual type input button on the cheatsheet page to check weaknesses for custom type combinations.

### Implementation Plan

#### 4.1 UI Enhancement
- Add "Manual Type Check" button on `src/pages/cheatsheet.astro`
- Modal or inline form with:
  - Type 1 dropdown (all 18 types)
  - Type 2 dropdown (optional, all 18 types + "None")
  - Submit button

#### 4.2 New Component: `TypeCheckerIsland.jsx`
- Multi-select type input
- Real-time weakness calculation
- Display results similar to Pokémon detail page:
  - ×4 weaknesses (extremely weak)
  - ×2 weaknesses
  - ×½ resistances
  - ×¼ double resistances
  - ×0 immunities

#### 4.3 Example Use Case
- User inputs: Fire + Flying (Charizard types)
- Result shows: Rock (×4), Water/Electric (×2), etc.

---

## 5. Team Weakness Checker (New Feature)

### Description
Add a button in the navbar to check weaknesses for a team of 6 selected Pokémon.

### Implementation Plan

#### 5.1 New Page: `src/pages/team.astro`
- Search interface for selecting 6 Pokémon
- Visual team builder (6 slots)
- Aggregated weakness analysis showing:
  - Combined team weaknesses (most common weaknesses across all 6)
  - Coverage gaps (types not covered by team)
  - Suggested counters

#### 5.2 New Component: `TeamBuilderIsland.jsx`
- 6 Pokémon selection slots
- Search integration for each slot
- Remove/clear functionality
- Real-time weakness aggregation

#### 5.3 Update BottomNav.astro
- Add new nav item: "Team" with team/users icon
- Path: `/team`

#### 5.4 Weakness Aggregation Logic
- Combine all types from 6 Pokémon
- Calculate combined weaknesses (types that hit multiple team members)
- Show breakdown: how many Pokémon are weak to each type

---

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `src/pages/meta.astro` | Meta analysis page |
| `src/pages/team.astro` | Team weakness checker page |
| `src/components/MetaIsland.jsx` | Meta page component |
| `src/components/TypeCheckerIsland.jsx` | Manual type checker |
| `src/components/TeamBuilderIsland.jsx` | Team builder component |
| `src/data/meta.json` | Meta data (usage stats, teams) |

### Modified Files
| File | Changes |
|------|---------|
| `src/data/pokemon.json` | Add ability field, add missing Pokémon |
| `src/components/BottomNav.astro` | Add Meta and Team nav items |
| `src/pages/pokemon/[name].astro` | Display ability |
| `src/pages/cheatsheet.astro` | Add manual type check feature |
| `src/components/SearchIsland.jsx` | Add missing Pokémon to list |

---

## Implementation Order

1. **Phase 1**: Add missing Pokémon (Rotom forms) - Quick fix
2. **Phase 2**: Add ability field to Pokémon data - Data update
3. **Phase 3**: Team Weakness Checker - New feature
4. **Phase 4**: Cheatsheet type input - Enhancement
5. **Phase 5**: Meta Analysis Page - New feature

---

## Technical Considerations

### Data Sources
- **Meta Data**: Pikalytics (https://pikalytics.com/), Smogon forums
- **Abilities**: Pokémon Database, Bulbapedia, or Pikalytics
- **Missing Forms**: Check all Rotom forms, Mega evolutions, regional variants

### UI/UX Design
- Mobile-first responsive design (existing pattern)
- Dark theme consistency
- Touch-friendly interactions
- Sticky headers for search inputs

### Performance
- Static generation for meta page (pre-computed data)
- Client-side calculation for team checker
- Lazy loading for sprites

---

## User Answers (2026-06-30)

1. **Meta Data Source**: Use whatever is easiest/best available
2. **Abilities**: All abilities for each Pokémon (not just most used)
3. **Team Weakness Display**: Only aggregated weaknesses for simplicity
4. **Meta Page Format**: Button to switch between Single and Double (Double first default)

---

## Implementation Notes

- Meta data is embedded in MetaIsland.jsx for simplicity (can be extracted to meta.json later)
- Team weakness shows count of Pokémon weak to each type (e.g., "×4 ×2" means 2 Pokémon weak to this type)
- All abilities field will be added to Pokemon interface in a future update