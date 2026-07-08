import { useState, useMemo, useCallback } from 'preact/hooks';
import pokemonData from '../data/pokemon.json';
import typeChart from '../data/types.json';

const pokemonList = Object.entries(pokemonData);
const allTypes = Object.keys(typeChart);

/**
 * Shared hook for Pokémon search with type filtering.
 * Deduplicates search/filter logic across SearchIsland, SpeedIsland, TeamBuilderIsland, SearchSelect.
 */
export function usePokemonSearch({ maxResults = 50, filterChampions = false, championsSet = null } = {}) {
  const [query, setQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);

  const toggleFilterType = useCallback((type) => {
    setFilterTypes((prev) => {
      if (prev.includes(type)) return prev.filter((t) => t !== type);
      if (prev.length >= 2) return prev;
      return [...prev, type];
    });
  }, []);

  const resetFilters = useCallback(() => {
    setQuery('');
    setFilterTypes([]);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = pokemonList;

    if (q) {
      const normalizedQ = q.replace(/\s+/g, '-');
      filtered = filtered.filter(([name, data]) => {
        const matchesQuery = name.includes(q) || name.includes(normalizedQ)
          || (data.name && data.name.toLowerCase().includes(q))
          || data.types.some(t => t.toLowerCase().includes(q));
        if (filterChampions && championsSet) {
          return matchesQuery && championsSet.has(name);
        }
        return matchesQuery;
      });
    } else if (filterChampions && championsSet) {
      filtered = filtered.filter(([name]) => championsSet.has(name));
    }

    if (filterTypes.length > 0) {
      filtered = filtered.filter(([, data]) =>
        filterTypes.some(t => data.types.includes(t))
      );
    }

    if (filterTypes.length === 2) {
      filtered.sort(([, a], [, b]) => {
        const aHasBoth = filterTypes.every(t => a.types.includes(t));
        const bHasBoth = filterTypes.every(t => b.types.includes(t));
        if (aHasBoth && !bHasBoth) return -1;
        if (!aHasBoth && bHasBoth) return 1;
        return 0;
      });
    }

    return filtered.slice(0, maxResults);
  }, [query, filterTypes, filterChampions, championsSet, maxResults]);

  return {
    query,
    setQuery,
    filterTypes,
    setFilterTypes,
    toggleFilterType,
    resetFilters,
    results,
    allTypes,
    pokemonList,
  };
}

export { pokemonList, allTypes };
