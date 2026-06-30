export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getSprite(data: { id: number; sprite?: string }): string {
  return data.sprite || getSpriteUrl(data.id);
}

export function displayName(key: string, data: { name?: string }): string {
  return data.name || key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function makeChampionsSet(champions: string[]): Set<string> {
  return new Set(champions);
}
