/**
 * TypeScript types for pokemon.json data structure.
 */

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  speed: number;
  sprite?: string;
  abilities?: (string | { name: string; description: string })[];
}

export type PokemonData = Record<string, Pokemon>;
export type PokemonEntry = [string, Pokemon];
