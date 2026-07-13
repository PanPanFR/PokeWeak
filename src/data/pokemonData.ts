import pokemonRaw from './pokemon.json';
import { validatePokemonData } from './schemas';

export const pokemonData = validatePokemonData(pokemonRaw);
