import { describe, it, expect } from 'vitest';
import { formatName, getSprite } from '../src/utils/pokemon';

describe('formatName', () => {
  it('returns data.name if available', () => {
    expect(formatName('charizard', { name: 'Charizard' })).toBe('Charizard');
  });

  it('formats key when name is missing', () => {
    expect(formatName('mega-charizard-x', {})).toBe('Mega Charizard X');
  });

  it('handles empty data', () => {
    expect(formatName('pikachu', {})).toBe('Pikachu');
  });
});

describe('getSprite', () => {
  it('returns custom sprite if provided', () => {
    expect(getSprite({ id: 25, sprite: 'custom.png' })).toBe('custom.png');
  });

  it('falls back to PokeAPI URL', () => {
    const url = getSprite({ id: 25 });
    expect(url).toContain('25.png');
  });
});
