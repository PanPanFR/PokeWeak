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