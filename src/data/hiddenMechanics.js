export const hiddenMechanics = [
  {
    id: 'type-immunities',
    title: 'Type Immunities',
    items: [
      { type: 'Fire', text: 'Cannot be Burned' },
      { type: 'Electric', text: 'Cannot be Paralyzed' },
      { types: ['Poison', 'Steel'], text: 'Cannot be Poisoned' },
      { type: 'Grass', text: 'Immune to Powder moves & Leech Seed' },
      { type: 'Ghost', text: 'Cannot be trapped' },
      { type: 'Dark', text: 'Immune to opposing Prankster-boosted status moves' },
      { type: 'Rock', text: 'Gains 1.5× Special Defense during Sandstorm' },
      { type: 'Ice', text: 'Gains 1.5× Defense during Snow' },
    ],
  },
  {
    id: 'move-interactions',
    title: 'Move Interactions',
    items: [
      { name: 'Rage Powder', text: 'Does not affect Grass-types, Overcoat, or Safety Goggles' },
      { name: 'Fake Out', text: 'Only works on the first turn the user is on the field' },
      { name: 'Protect', text: 'Consecutive uses have a lower success rate' },
      { name: 'Trick Room', text: 'Has the lowest priority (−7)' },
      { name: 'Powder Moves', text: 'Fail against Grass-types, Overcoat, and Safety Goggles' },
    ],
  },
  {
    id: 'ability-interactions',
    title: 'Ability Interactions',
    items: [
      { name: 'Mold Breaker', text: 'Ignores many defensive abilities (Levitate, Sturdy, etc.)' },
      { name: 'Soundproof', text: 'Blocks sound-based moves' },
      { name: 'Bulletproof', text: 'Blocks bomb and ball moves' },
      { name: 'Overcoat', text: 'Blocks Powder moves and weather damage' },
      { name: 'Dancer', text: 'Automatically copies another Pokémon\'s dance move' },
    ],
  },
  {
    id: 'item-interactions',
    title: 'Item Interactions',
    items: [
      { name: 'Safety Goggles', text: 'Immune to Powder moves and Sandstorm damage' },
      { name: 'Covert Cloak', text: 'Prevents additional move effects' },
      { name: 'Mental Herb', text: 'Removes Taunt, Encore, Disable, Torment, Heal Block, and Attract once' },
      { name: 'Clear Amulet', text: 'Prevents stat drops caused by opponents' },
    ],
  },
  {
    id: 'double-battle',
    title: 'Double Battle',
    items: [
      { name: 'Spread Moves', text: 'Deal reduced damage when hitting multiple targets' },
      { name: 'Redirection', text: 'Rage Powder does not affect Grass-types, Overcoat, or Safety Goggles. Snipe Shot ignores redirection.' },
    ],
  },
];
