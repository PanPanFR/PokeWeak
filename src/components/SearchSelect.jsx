import { useState, useMemo, useRef, useEffect, useCallback } from 'preact/hooks';
import { pokemonData } from '../data/pokemonData';
import { typeChart } from '../data/typeChart';
import { getSprite, formatName } from '../utils/pokemon';
import { filterPokemonEntries } from '../utils/pokemonSearch';
import TypeIcon from './TypeIcon.jsx';

const allPokemon = Object.entries(pokemonData);
const allTypes = Object.keys(typeChart);

export default function SearchSelect({ value, onChange, placeholder, disabled }) {
  const listboxId = `pokemon-select-${placeholder.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const triggerRef = useRef(null);

  const toggleFilterType = (type) => {
    setFilterTypes((prev) => {
      if (prev.includes(type)) return prev.filter((t) => t !== type);
      if (prev.length >= 2) return prev;
      return [...prev, type];
    });
  };

  const filtered = useMemo(() => {
    return filterPokemonEntries(allPokemon, { query, types: filterTypes, limit: 50 });
  }, [query, filterTypes]);

  const selectedData = value ? pokemonData[value] : null;

  const handleSelect = useCallback((pokemonKey) => {
    onChange(pokemonKey);
    setOpen(false);
    setQuery('');
    setFilterTypes([]);
    setFocusedIdx(-1);
  }, [onChange]);

  const handleKeyDown = useCallback((e) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && focusedIdx >= 0 && filtered[focusedIdx]) {
      e.preventDefault();
      handleSelect(filtered[focusedIdx][0]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setQuery('');
      setFilterTypes([]);
      setFocusedIdx(-1);
      triggerRef.current?.focus();
    }
  }, [open, filtered, focusedIdx, handleSelect]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Auto-scroll focused item into view
  useEffect(() => {
    if (focusedIdx >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      const el = items[focusedIdx];
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIdx]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target) &&
          listRef.current && !listRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
        setFilterTypes([]);
        setFocusedIdx(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={selectedData ? `Selected: ${formatName(value, selectedData)}. Press to change.` : placeholder}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          padding: '8px 12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          minHeight: '48px',
          opacity: disabled ? 0.6 : 1,
          width: '100%',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        {selectedData ? (
          <>
            <img src={getSprite(selectedData)} alt="" width={32} height={32} style={{ imageRendering: 'pixelated' }} />
            <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{formatName(value, selectedData)}</span>
          </>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{placeholder}</span>
        )}
      </button>

      {open && (
        <div 
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label="Pokémon options"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-strong)',
            borderRadius: '12px',
            zIndex: 100,
            maxHeight: '300px',
            overflowY: 'auto',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search..." 
            value={query}
            onInput={(e) => { setQuery(e.target.value); setFocusedIdx(-1); }}
            onKeyDown={handleKeyDown}
            aria-label="Search Pokémon"
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            padding: '8px',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {allTypes.map((t) => {
              const isSelected = filterTypes.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleFilterType(t); }}
                  aria-label={`Filter by ${t} type${isSelected ? ' (active)' : ''}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: isSelected ? '1px solid var(--text-primary)' : '1px solid transparent',
                    background: isSelected ? 'var(--bg-focus)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    padding: '0',
                  }}
                  title={t}
                >
                  <TypeIcon type={t} size={14} aria-hidden="true" />
                </button>
              );
            })}
          </div>
          {filtered.map(([k, v], idx) => (
            <button
              key={k}
              type="button"
              role="option"
              id={`${listboxId}-option-${idx}`}
              aria-selected={focusedIdx === idx}
              onClick={() => handleSelect(k)}
              onMouseEnter={() => setFocusedIdx(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-subtle)',
                background: focusedIdx === idx ? 'var(--bg-hover)' : 'transparent',
                border: 'none',
                borderRadius: 0,
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'background 0.15s ease',
              }}
            >
              <img src={getSprite(v)} alt="" width={32} height={32} style={{ imageRendering: 'pixelated' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{formatName(k, v)}</div>
                <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                  {v.types.map(t => <TypeIcon key={t} type={t} size={10} aria-hidden="true" />)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
