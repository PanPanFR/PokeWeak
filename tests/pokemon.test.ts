import { describe, it, expect } from 'vitest';
import { formatName, getSprite, getRelatedForms } from '../src/utils/pokemon';

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

describe('getRelatedForms', () => {
  const fakeKeys = [
    'charizard',
    'mega-charizard-x',
    'mega-charizard-y',
    'mega-venusaur',
    'ninetales',
    'ninetales-alola',
    'rotom-wash',
    'rotom-heat',
  ];

  it('finds mega forms for a base pokemon', () => {
    const { megaForms } = getRelatedForms('charizard', fakeKeys);
    expect(megaForms).toContain('mega-charizard-x');
    expect(megaForms).toContain('mega-charizard-y');
    expect(megaForms).not.toContain('mega-venusaur');
  });

  it('does not include self in mega forms', () => {
    const { megaForms } = getRelatedForms('mega-charizard-x', fakeKeys);
    // mega-charizard-x is in fakeKeys but filter should still work
    expect(megaForms).toContain('mega-charizard-x');
    expect(megaForms).toContain('mega-charizard-y');
  });

  it('finds alternative regional forms', () => {
    const { alternativeForms } = getRelatedForms('ninetales', fakeKeys);
    expect(alternativeForms).toContain('ninetales-alola');
    expect(alternativeForms).not.toContain('ninetales'); // excludes self
  });

  it('excludes self from alternative forms', () => {
    const { alternativeForms } = getRelatedForms('ninetales-alola', fakeKeys);
    expect(alternativeForms).toContain('ninetales');
    expect(alternativeForms).not.toContain('ninetales-alola');
  });

  it('finds rotom forms', () => {
    const { alternativeForms } = getRelatedForms('rotom-wash', fakeKeys);
    expect(alternativeForms).toContain('rotom-heat');
    expect(alternativeForms).not.toContain('rotom-wash');
  });

  it('returns empty arrays when no related forms exist', () => {
    const { megaForms, alternativeForms } = getRelatedForms('charizard', ['charizard', 'pikachu']);
    expect(megaForms).toHaveLength(0);
    expect(alternativeForms).toHaveLength(0);
  });
});

