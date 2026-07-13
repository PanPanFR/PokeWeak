import { describe, expect, it } from 'vitest';
import { championFormPatterns, championPokemonNames } from '../src/data/champions';
import { pokemonData } from '../src/data/pokemonData';
import { tryValidatePokemonData } from '../src/data/schemas';
import { getTypeIconSrc } from '../src/utils/typeIcon';

describe('audit regressions', () => {
  it('returns safe validation errors with Zod v4', () => {
    const result = tryValidatePokemonData({ bad: { id: -1 } });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toHaveProperty('path');
      expect(result.errors[0]).toHaveProperty('message');
    }
  });

  it('keeps champion search data outside the component', () => {
    expect(championPokemonNames).toContain('charizard');
    expect(championPokemonNames.every((name) => pokemonData[name])).toBe(true);
    expect(championFormPatterns).toContain('mega-');
  });

  it('uses one shared type icon path helper', () => {
    expect(getTypeIconSrc('Fire')).toBe('/icons/types/fire.svg');
  });
});
