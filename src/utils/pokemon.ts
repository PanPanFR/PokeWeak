export function getSpriteUrl(id: number, name?: string): string {
  // Handle special cases like rotom forms
  if (name && name.includes('Rotom-')) {
    const form = name.split('-')[1].toLowerCase();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}-${form}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getSprite(data: { id: number; name?: string; sprite?: string }): string {
  // Override local serebii URLs with PokeAPI to avoid hotlink blocks on Vercel
  if (data.sprite && !data.sprite.includes('serebii.net')) return data.sprite;
  return getSpriteUrl(data.id, data.name);
}

export function displayName(key: string, data: { name?: string }): string {
  return data.name || key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function makeChampionsSet(champions: string[]): Set<string> {
  return new Set(champions);
}
