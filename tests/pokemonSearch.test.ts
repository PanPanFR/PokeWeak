import { describe, expect, it } from 'vitest';
import { filterPokemonEntries, sortDualTypeMatchesFirst } from '../src/utils/pokemonSearch';

const pokemon = [
  ['charizard', { name: 'Charizard', types: ['Fire', 'Flying'] }],
  ['mr-rime', { name: 'Mr. Rime', types: ['Ice', 'Psychic'] }],
  ['rotom-wash', { name: 'Rotom Wash', types: ['Electric', 'Water'] }],
  ['volcarona', { name: 'Volcarona', types: ['Bug', 'Fire'] }],
] as const;

describe('filterPokemonEntries', () => {
  it('matches keys, display names, spaced form names, and type names', () => {
    expect(filterPokemonEntries(pokemon, { query: 'mr rime' }).map(([key]) => key)).toEqual(['mr-rime']);
    expect(filterPokemonEntries(pokemon, { query: 'rotom wash' }).map(([key]) => key)).toEqual(['rotom-wash']);
    expect(filterPokemonEntries(pokemon, { query: 'psychic' }).map(([key]) => key)).toEqual(['mr-rime']);
  });

  it('filters by selected types and respects result limits', () => {
    expect(filterPokemonEntries(pokemon, { types: ['Fire'], limit: 1 }).map(([key]) => key)).toEqual(['charizard']);
  });

  it('can prioritize Pokemon that match both selected types', () => {
    const results = filterPokemonEntries(pokemon, {
      types: ['Fire', 'Bug'],
      sortDualTypeMatchesFirst: true,
    }).map(([key]) => key);

    expect(results[0]).toBe('volcarona');
  });
});

describe('sortDualTypeMatchesFirst', () => {
  it('keeps order unchanged unless exactly two types are selected', () => {
    expect(sortDualTypeMatchesFirst([...pokemon], ['Fire']).map(([key]) => key)).toEqual(
      pokemon.map(([key]) => key)
    );
  });
});
