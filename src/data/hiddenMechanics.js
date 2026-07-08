export const hiddenMechanics = [
  {
    id: 'type-immunities',
    title: 'Type Immunities',
    items: [
      { type: 'Fire', text: 'Cannot be burned' },
      { type: 'Electric', text: 'Cannot be paralyzed' },
      { types: ['Poison', 'Steel'], text: 'Cannot be poisoned' },
      { type: 'Grass', text: 'Immune to Powder moves (Spore, Sleep Powder, etc.) and Leech Seed' },
      { type: 'Ghost', text: 'Cannot be trapped by moves, abilities, or items (Mean Look, Shadow Tag, etc.)' },
      { type: 'Dark', text: 'Immune to opposing Prankster-boosted status moves' },
      { type: 'Rock', text: 'Gains 1.5× Special Defense during Sandstorm' },
      { type: 'Ice', text: 'Gains 1.5× Defense during Snow' },
    ],
  },
  {
    id: 'move-interactions',
    title: 'Move Interactions',
    items: [
      { name: 'Fake Out', text: 'Only works on the first turn the user is on the field. Ghost-types are immune.' },
      { name: 'Protect', text: 'Consecutive uses have decreasing success rate' },
      { name: 'Trick Room', text: 'Priority −7, slowest priority bracket in the game' },
      { name: 'Endure', text: 'Consecutive uses have decreasing success rate, same as Protect' },
    ],
  },
  {
    id: 'double-battle',
    title: 'Double Battle',
    items: [
      { name: 'Spread Moves', text: 'Deal 75% damage when hitting multiple targets (Earthquake, Rock Slide, etc.)' },
      { name: 'Ally Targeting', text: 'Some moves can target allies (e.g. Helping Hand, Swagger) for combo plays' },
    ],
  },
];
