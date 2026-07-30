// Hidden battle mechanics data for the Cheatsheet page.

export interface TypeImmunityItem {
  type?: string;
  types?: string[];
  text: string;
}

export interface MechanicItem {
  name?: string;
  type?: string;
  types?: string[];
  text: string;
}

export interface MechanicSection {
  id: string;
  title: string;
  items: (TypeImmunityItem | MechanicItem)[];
}

export const hiddenMechanics: MechanicSection[] = [
  {
    id: 'type-immunities',
    title: 'Type Immunities',
    items: [
      { type: 'Fire', text: 'Cannot be burned' },
      { type: 'Electric', text: 'Cannot be paralyzed' },
      { types: ['Poison', 'Steel'], text: 'Cannot be poisoned' },
      { type: 'Grass', text: 'Immune to Powder moves (Spore, Sleep Powder, Stun Spore) and Leech Seed' },
      { type: 'Ghost', text: 'Cannot be trapped (Mean Look, Shadow Tag, Arena Trap)' },
      { type: 'Dark', text: 'Immune to opposing Prankster-boosted status moves' },
      { type: 'Rock', text: '1.5× Special Defense during Sandstorm' },
      { type: 'Ice', text: '1.5× Defense during Snow' },
    ],
  },
  {
    id: 'move-hidden-effects',
    title: 'Move Hidden Effects',
    items: [
      { name: 'Roost', text: 'Temporarily removes your Flying type for the rest of the turn' },
      { name: 'Defense Curl', text: 'Boosts damage of Rollout and Ice Ball by 2×' },
      { name: 'Gust / Twister', text: 'Double power against targets using Fly, Bounce, or Sky Drop' },
      { name: 'Earthquake', text: 'Double power against targets using Dig' },
      { name: 'Surf / Muddy Water', text: 'Double power against targets using Dive' },
      { name: 'Thunder', text: '100% accuracy in rain. Can hit Pokémon using Fly/Bounce' },
      { name: 'Hurricane', text: '100% accuracy in rain' },
      { name: 'Blizzard', text: '100% accuracy in hail/snow' },
      { name: 'Growth', text: '+2 Atk & Sp.Atk in harsh sunlight (normally +1)' },
      { name: 'Solar Beam', text: 'Skip charging turn in sun' },
      { name: 'Minimize', text: 'Stomp, Body Slam, Heavy Slam, Heat Crash, Phantom Force deal 2× damage and never miss' },
      { name: 'Splash', text: 'Cannot be used under Gravity' },
    ],
  },
  {
    id: 'field-weather',
    title: 'Field & Weather',
    items: [
      { name: 'Gravity', text: 'Grounds Flying-types & Levitate. Blocks Fly, Bounce, Sky Drop, Splash. Boosts accuracy' },
      { name: 'Spikes', text: 'Does not affect Flying-types or Pokémon with Levitate' },
      { name: 'Toxic Spikes', text: 'Removed when a Poison-type switches in (not Poison/Flying or Levitate)' },
      { name: 'Sheer Force + Life Orb', text: 'Moves with secondary effects get both boosts, but no Life Orb recoil' },
      { name: 'Ingrain', text: 'Removes Ground immunity from Flying-types and Levitate users' },
      { name: 'Fake Out', text: "Only works on the user's first turn on the field. Ghost-types immune. Encoring into Fake Out forces Struggle" },
      { name: 'Protect / Endure', text: 'Consecutive uses have decreasing success rate (100% → 50% → 25%...)' },
      { name: 'Trick Room', text: 'Priority −7, slowest priority bracket in the game' },
    ],
  },
  {
    id: 'champions-changes',
    title: 'Champions-Specific',
    items: [
      { name: 'Sleep', text: 'Max 2 turns. Turn 1: asleep. Turn 2: 1/3 chance to wake. Turn 3: guaranteed wake' },
      { name: 'Paralysis', text: 'Immobilization chance reduced from 25% → 12.5% (1 in 8)' },
      { name: 'Freeze', text: '25% self-thaw each turn. Guaranteed thaw by turn 3' },
      { name: 'Intimidate', text: 'Now drops Attack of both opposing Pokémon simultaneously' },
      { name: 'PP Cap', text: 'All moves capped at 20 max PP (formula: 4 × (basePP ÷ 5 + 1))' },
      { name: 'Time Expiry', text: 'Match ends in a Draw when timer runs out. No VP awarded' },
      { name: 'Unseen Fist', text: 'Damage through Protect reduced from 100% → 25%' },
      { name: 'Slicing Moves', text: 'Dragon Claw, Shadow Claw, Dire Claw now benefit from Sharpness' },
    ],
  },
  {
    id: 'double-battle',
    title: 'Double Battle',
    items: [
      { name: 'Spread Moves', text: 'Deal 75% damage when hitting multiple targets (Earthquake, Rock Slide, Dazzling Gleam)' },
      { name: 'Earthquake', text: 'Hits all adjacent Pokémon including allies. Combine with Flying-type or Protect' },
      { name: 'Ally Targeting', text: 'Some moves can target allies (Helping Hand, Swagger) for combo plays' },
      { name: 'Rage Powder', text: 'Redirects single-target moves to the user. Does not affect Grass-types, Overcoat, Safety Goggles' },
    ],
  },
];
