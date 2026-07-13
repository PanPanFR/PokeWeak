import { useState, useMemo, useRef, useEffect, useCallback } from 'preact/hooks';
import { pokemonData } from '../data/pokemonData';
import { typeChart } from '../data/typeChart';
import { championFormPatterns, championPokemonNames } from '../data/champions';
import TypeIcon from './TypeIcon.jsx';
import { getSprite, formatName } from '../utils/pokemon';
import { filterPokemonEntries } from '../utils/pokemonSearch';

const allTypes = Object.keys(typeChart);

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return [
    text.slice(0, idx),
    <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{text.slice(idx, idx + query.length)}</strong>,
    text.slice(idx + query.length),
  ];
}

const championsPokemon = championPokemonNames.filter(name => pokemonData[name]);

// Add mega and alternative forms
const megaAndForms = Object.keys(pokemonData).filter(name => 
  championFormPatterns.some((pattern) => name.includes(pattern))
  && !championsPokemon.includes(name)
);

const allChampionsPokemon = [...championsPokemon, ...megaAndForms];

export default function SearchIsland() {
  const [query, setQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const dropdownRef = useRef(null);

  const sortedChampions = useMemo(() =>
    allChampionsPokemon
      .map(name => [name, pokemonData[name]])
      .sort((a, b) => a[0].localeCompare(b[0])),
  []);

  const results = useMemo(() => {
    return filterPokemonEntries(sortedChampions, {
      query,
      types: filterTypes,
      limit: 20,
      sortDualTypeMatchesFirst: true,
    });
  }, [query, filterTypes, sortedChampions]);

  const toggleFilterType = useCallback((type) => {
    setFilterTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      if (prev.length >= 2) return prev;
      return [...prev, type];
    });
  }, []);

  const handleInput = useCallback((e) => {
    setQuery(e.target.value);
    setFocusedIdx(-1);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && focusedIdx >= 0 && results[focusedIdx]) {
      const [name] = results[focusedIdx];
      window.location.href = `/pokemon/${name}`;
    } else if (e.key === 'Escape') {
      setQuery('');
      setFilterTypes([]);
      inputRef.current?.blur();
    }
  }, [results, focusedIdx]);

  useEffect(() => {
    if (focusedIdx >= 0 && listRef.current) {
      const el = listRef.current.children[focusedIdx];
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIdx]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isInput = inputRef.current && inputRef.current.contains(e.target);
      const isDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);
      const isFilter = e.target.closest('[data-type-filter]');
      const isPokemonLink = e.target.closest('a[href*="/pokemon/"]');
      if (!isInput && !isDropdown && !isFilter && !isPokemonLink) {
        setQuery('');
        setFilterTypes([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasQuery = query.trim().length > 0;
  const hasResults = results.length > 0;
  const showDropdown = hasQuery && hasResults;
  const showNoResults = hasQuery && !hasResults;

  return (
    <div>
      <p style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        margin: '0 0 12px',
        lineHeight: 1.4,
      }}>
        Search any Champion Pokémon to check its type weaknesses, resistances, and immunities.
      </p>
      <div style={{
        background: 'var(--bg-elevated)',
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        marginBottom: '16px',
      }}>
        <div style={{ position: 'relative' }}>
          <svg
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--text-muted)',
              zIndex: 1,
            }}
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Pokémon…"
            value={query}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            aria-label="Search Pokémon by name"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showDropdown ? 'true' : 'false'}
            aria-controls="search-results-list"
            aria-activedescendant={focusedIdx >= 0 ? `search-result-${focusedIdx}` : undefined}
            class="search-input-glow"
            style={{
              width: '100%',
              padding: '12px 40px 12px 42px',
              borderRadius: '12px',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '16px',
              fontFamily: 'inherit',
              minHeight: '44px',
            }}
          />
          {hasQuery && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--bg-hover)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: 700,
                padding: 0,
              }}
            >
              ×
            </button>
          )}
          {showDropdown && (
            <div
              ref={dropdownRef}
              role="listbox"
              id="search-results-list"
              aria-label="Search results"
              class="scrollbar-thin dropdown-animate"
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '12px',
                maxHeight: 'min(320px, 50vh)',
                overflowY: 'auto',
                zIndex: 100,
              }}
            >
              <div ref={listRef}>
                {results.map(([name, data], idx) => (
                  <a
                    key={name}
                    id={`search-result-${idx}`}
                    role="option"
                    aria-selected={focusedIdx === idx}
                    href={`/pokemon/${name}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 16px',
                      background: focusedIdx === idx ? 'var(--bg-focus)' : 'transparent',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      minHeight: '44px',
                      textAlign: 'left',
                      textDecoration: 'none',
                      borderBottom: 'none',
                      borderRadius: '8px',
                      transition: 'background 150ms ease',
                    }}
                  >
                    <img
                      src={getSprite(data)}
                      alt={formatName(name, data)}
                      width={40}
                      height={40}
                      loading={idx < 8 ? "eager" : "lazy"}
                      fetchpriority={idx < 4 ? "high" : "auto"}
                      decoding="async"
                      style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                    />
                    <span style={{ fontWeight: 500 }}>{highlightMatch(formatName(name, data), query)}</span>
                    <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                      {data.types.map((t) => (
                        <TypeIcon key={t} type={t} size={16} />
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          {showNoResults && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '13px',
                zIndex: 100,
              }}
            >
              No Pokémon found for "{query.trim()}"
            </div>
          )}
        </div>

        <div
          data-type-filter
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '8px',
          }}
        >
          <button
            onClick={() => setFilterTypes([])}
            aria-label="Show all types"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '28px',
              padding: '0 8px',
              borderRadius: '6px',
              border: filterTypes.length === 0 ? '1.5px solid var(--text-primary)' : '1.5px solid transparent',
              background: filterTypes.length === 0 ? 'var(--bg-focus)' : 'var(--bg-card)',
              color: filterTypes.length === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            All
          </button>
          {allTypes.map((t) => {
            const isSelected = filterTypes.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleFilterType(t)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '28px',
                  padding: '0 4px',
                  borderRadius: '6px',
                  border: isSelected ? '1.5px solid var(--text-primary)' : '1.5px solid transparent',
                  background: isSelected ? 'var(--bg-focus)' : 'var(--bg-card)',
                  cursor: 'pointer',
                }}
                title={t}
                aria-label={`Filter by ${t} type${isSelected ? ' (active)' : ''}`}
              >
                <TypeIcon type={t} size={16} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      {!hasQuery && filterTypes.length === 0 && (
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 4000px' }}>
          {sortedChampions.map(([name, data], idx) => (
            <a
              key={name}
              href={`/pokemon/${name}`}
              class="pk-list-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px 16px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'inherit',
                minHeight: '44px',
                textAlign: 'left',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border-subtle)',
                borderRadius: '8px',
              }}
            >
              <img
                src={getSprite(data)}
                alt={formatName(name, data)}
                width={36}
                height={36}
                loading={idx < 8 ? "eager" : "lazy"}
                fetchpriority={idx < 4 ? "high" : "auto"}
                decoding="async"
                style={{ imageRendering: 'pixelated', flexShrink: 0 }}
              />
              <span style={{ fontWeight: 500 }}>{formatName(name, data)}</span>
              <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                {data.types.map((t) => (
                  <TypeIcon key={t} type={t} size={14} />
                ))}
              </div>
            </a>
          ))}
        </div>
      )}

      {!hasQuery && filterTypes.length > 0 && (
        <div>
          {results.map(([name, data]) => (
            <a
              key={name}
              href={`/pokemon/${name}`}
              class="pk-list-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px 16px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'inherit',
                minHeight: '44px',
                textAlign: 'left',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border-subtle)',
                borderRadius: '8px',
              }}
            >
              <img
                src={getSprite(data)}
                alt={formatName(name, data)}
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                style={{ imageRendering: 'pixelated', flexShrink: 0 }}
              />
              <span style={{ fontWeight: 500 }}>{formatName(name, data)}</span>
              <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                {data.types.map((t) => (
                  <TypeIcon key={t} type={t} size={14} />
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
