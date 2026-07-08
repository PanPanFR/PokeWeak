export function getSpriteUrl(id: number, name?: string): string {
  // Use PokeAPI sprites via raw.githubusercontent.com (allowed by CSP)
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getSprite(data: { id: number; name?: string; sprite?: string }): string {
  if (data.sprite) return data.sprite;
  return getSpriteUrl(data.id, data.name);
}

export function formatName(key: string, data: { name?: string }): string {
  return data.name || key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
