import { h } from 'preact';
import { useState, useMemo, useRef, useEffect, useCallback } from 'preact/hooks';
import pokemonData from '../data/pokemon.json';
import TypeIcon from './TypeIcon.jsx';
import { getSprite, displayName } from '../utils/pokemon';

const pokemonList = Object.entries(pokemonData);

export default function QuickSearch() {
  const [query, setQuery] = useState('');
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const dropdownRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return pokemonList
      .filter(([name]) => name.includes(q))
      .slice(0, 30);
  }, [query]);

  const handleInput = useCallback((e) => {
    setQuery(e.target.value);
    setFocusedIdx(-1);
  }, []);

  const navigate = useCallback((name) => {
    setQuery('');
    window.location.href = `/pokemon/${name}`;
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && focusedIdx >= 0 && results[focusedIdx]) {
      navigate(results[focusedIdx][0]);
    } else if (e.key === 'Enter' && query.trim()) {
      navigate(query.trim().toLowerCase());
    } else if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    }
  }, [results, focusedIdx, query, navigate]);

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
      if (!isInput && !isDropdown) setQuery('');
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
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
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Pokémon..."
          value={query}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          aria-label="Search Pokémon by name"
          class="search-input-glow"
          style={{
            width: '100%',
            padding: '12px 36px 12px 38px',
            borderRadius: '12px',
            border: '1px solid var(--border-medium)',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            fontSize: '16px',
            fontFamily: 'inherit',
            outline: 'none',
            minHeight: '44px',
          }}
        />
        {query.trim() && (
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
      </div>
      {query.trim() && results.length > 0 && (
        <div
          ref={dropdownRef}
          class="scrollbar-thin dropdown-animate"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: '12px',
            maxHeight: 'min(480px, 70vh)',
            overflowY: 'auto',
            zIndex: 100,
          }}
        >
          <div ref={listRef}>
            {results.map(([name, data], idx) => (
              <a
                key={name}
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
                }}
              >
                <img
                  src={getSprite(data)}
                  alt={displayName(name, data)}
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                />
                <span style={{ fontWeight: 500 }}>{displayName(name, data)}</span>
                <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                  {data.types.map((t) => (
                    <TypeIcon key={t} type={t} />
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
