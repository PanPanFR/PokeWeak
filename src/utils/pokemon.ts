const SPRITE_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

/** Build the PokeAPI sprite URL for a Pokédex id (raw.githubusercontent.com is allowed by CSP). */
function getSpriteUrl(id: number): string {
  return `${SPRITE_BASE_URL}/${id}.png`;
}

export function getSprite(data: { id: number; sprite?: string }): string {
  return data.sprite ?? getSpriteUrl(data.id);
}

export function formatName(key: string, data: { name?: string }): string {
  return data.name || key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Returns keys for Mega forms and alternative regional forms
 * related to the given Pokémon key, excluding the key itself.
 *
 * Logic:
 * - Mega forms: keys starting with "mega-" whose base name matches the
 *   current Pokémon's base name (e.g. "charizard" matches "mega-charizard-x").
 * - Alt forms: keys that share the same first dash-segment as currentKey
 *   but aren't mega forms and aren't currentKey itself.
 */
export function getRelatedForms(
  currentKey: string,
  allKeys: string[]
): { megaForms: string[]; alternativeForms: string[] } {
  // Strip "mega-" prefix then take the first dash-segment as the base name.
  const baseName = currentKey.replace(/^mega-/, '').split('-')[0];

  const megaForms = allKeys.filter((key) => {
    if (!key.startsWith('mega-')) return false;
    const keyBase = key.slice(5).split('-')[0]; // strip "mega-" then take first segment
    return keyBase === baseName;
  });

  const alternativeForms = allKeys.filter((key) => {
    if (key === currentKey || key.startsWith('mega-')) return false;
    const keyBase = key.split('-')[0];
    return keyBase === baseName;
  });

  return { megaForms, alternativeForms };
}