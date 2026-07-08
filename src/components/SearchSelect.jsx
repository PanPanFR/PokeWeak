import { useState, useMemo } from 'preact/hooks';
import pokemonData from '../data/pokemon.json';
import TypeIcon from './TypeIcon.jsx';
import { getSprite, formatName } from '../utils/pokemon';

import typeChart from '../data/types.json';

const allPokemon = Object.entries(pokemonData);
const allTypes = Object.keys(typeChart);

export default function SearchSelect({ value, onChange, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);

  const toggleFilterType = (type) => {
    setFilterTypes((prev) => {
      if (prev.includes(type)) return prev.filter((t) => t !== type);
      if (prev.length >= 2) return prev;
      return [...prev, type];
    });
  };

  const filtered = useMemo(() => {
    let list = allPokemon;
    const lower = query.trim().toLowerCase();
    
    if (lower) {
      const normalizedLower = lower.replace(/\s+/g, '-');
      list = list.filter(([k, v]) => 
        k.includes(lower) || k.includes(normalizedLower) || (v.name && v.name.toLowerCase().includes(lower)) || v.types.some(t => t.toLowerCase().includes(lower))
      );
    }
    
    if (filterTypes.length > 0) {
      list = list.filter(([, v]) => filterTypes.some(t => v.types.includes(t)));
    }
    
    return list.slice(0, 50);
  }, [query, filterTypes]);

  const selectedData = value ? pokemonData[value] : null;

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <div 
        onClick={() => !disabled && setOpen(!open)}
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
        }}
      >
        {selectedData ? (
          <>
            <img src={getSprite(selectedData)} alt={value} width={32} height={32} style={{ imageRendering: 'pixelated' }} />
            <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{formatName(value, selectedData)}</span>
          </>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{placeholder}</span>
        )}
      </div>

      {open && (
        <div style={{
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
        }}>
          <input 
            type="text" 
            autoFocus
            placeholder="Search..." 
            value={query}
            onInput={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              outline: 'none',
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
                  onClick={(e) => { e.stopPropagation(); toggleFilterType(t); }}
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
                  <TypeIcon type={t} size={14} />
                </button>
              );
            })}
          </div>
          {filtered.map(([k, v]) => (
            <div 
              key={k}
              onClick={() => { onChange(k); setOpen(false); setQuery(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-subtle)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <img src={getSprite(v)} alt={k} width={32} height={32} style={{ imageRendering: 'pixelated' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{formatName(k, v)}</div>
                <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                  {v.types.map(t => <TypeIcon key={t} type={t} size={10} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
