type PokemonEntry = readonly [string, { name?: string; types: readonly string[] }];

interface FilterPokemonOptions {
  query?: string;
  types?: string[];
  limit?: number;
  sortDualTypeMatchesFirst?: boolean;
}

function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}

function matchesQuery([key, pokemon]: PokemonEntry, query: string): boolean {
  if (!query) return true;

  const dashedQuery = query.replace(/\s+/g, '-');
  const displayName = pokemon.name?.toLowerCase() ?? '';

  return (
    key.includes(query) ||
    key.includes(dashedQuery) ||
    displayName.includes(query) ||
    pokemon.types.some((type) => type.toLowerCase().includes(query))
  );
}

function matchesAnyType([, pokemon]: PokemonEntry, types: string[]): boolean {
  return types.length === 0 || types.some((type) => pokemon.types.includes(type));
}

export function sortDualTypeMatchesFirst<T extends PokemonEntry>(entries: T[], types: string[]): T[] {
  if (types.length !== 2) return entries;

  return entries.sort(([, firstPokemon], [, secondPokemon]) => {
    const firstHasBoth = types.every((type) => firstPokemon.types.includes(type));
    const secondHasBoth = types.every((type) => secondPokemon.types.includes(type));
    if (firstHasBoth === secondHasBoth) return 0;
    return firstHasBoth ? -1 : 1;
  });
}

export function filterPokemonEntries<T extends PokemonEntry>(
  entries: readonly T[],
  options: FilterPokemonOptions = {}
): T[] {
  const query = normalizeSearchText(options.query ?? '');
  const types = options.types ?? [];
  const filtered = entries.filter((entry) => matchesQuery(entry, query) && matchesAnyType(entry, types));
  const sorted = options.sortDualTypeMatchesFirst ? sortDualTypeMatchesFirst(filtered, types) : filtered;

  return typeof options.limit === 'number' ? sorted.slice(0, options.limit) : sorted;
}
