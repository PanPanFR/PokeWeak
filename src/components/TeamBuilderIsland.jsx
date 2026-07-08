import { useState, useMemo, useRef, useEffect, useCallback } from 'preact/hooks';
import pokemonData from '../data/pokemon.json';
import TypeIcon from './TypeIcon.jsx';
import { getSprite, formatName } from '../utils/pokemon';
import { calculateWeaknesses, calculateStrengths } from '../utils/typeCalc';
import typeChart from '../data/types.json';

const pokemonList = Object.entries(pokemonData);
const allTypes = Object.keys(typeChart);

function TeamSlot({ slotIndex, pokemon, onRemove, onSearch, label }) {
  if (pokemon) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px',
        background: 'var(--bg-surface)',
        borderRadius: '10px',
        border: '1px solid var(--border-medium)',
        minHeight: '44px',
      }}>
        <img
          src={getSprite(pokemon)}
          alt={pokemon.name}
          width={36}
          height={36}
          style={{ imageRendering: 'pixelated', flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{formatName(pokemon.name, pokemon)}</div>
          <div style={{ display: 'flex', gap: '3px', marginTop: '2px' }}>
            {pokemon.types.map((t) => (
              <TypeIcon key={t} type={t} size={12} />
            ))}
          </div>
        </div>
        <button
          onClick={() => onRemove(slotIndex)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '4px',
          }}
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => onSearch(slotIndex)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px',
        background: 'var(--bg-surface)',
        border: '1px dashed var(--border-medium)',
        borderRadius: '10px',
        minHeight: '44px',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'background 0.2s',
        fontFamily: 'inherit',
        width: '100%',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
    >
      <span style={{ fontSize: '16px' }}>+</span>
      <span>{label || `Slot ${slotIndex + 1}`}</span>
    </button>
  );
}

function TypeBadge({ type, count, multiplier }) {
  const label = multiplier === 4 ? '×4' : '×2';
  const color = multiplier === 4 ? '#E63946' : '#FF6B35';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        background: 'var(--bg-focus)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '6px 10px',
        fontSize: '12px',
        color: 'var(--text-primary)'
      }}
    >
      <TypeIcon type={type} size={16} />
      <span style={{ fontWeight: 500 }}>{type}</span>
      <span style={{
        marginLeft: '4px',
        fontWeight: 700,
        color,
        background: 'var(--bg-card)',
        borderRadius: '4px',
        padding: '2px 6px',
        fontSize: '11px',
      }}>
        {label} · {count}
      </span>
    </span>
  );
}

function TeamWeaknessDisplay({ team }) {
  const aggregatedWeaknesses = useMemo(() => {
    if (team.length === 0) return null;

    const weaknessCounts = {};
    const allTeamTypes = [];

    team.forEach((p) => {
      p.types.forEach((t) => {
        if (!allTeamTypes.includes(t)) allTeamTypes.push(t);
      });
    });

    // Pre-compute weaknesses per team member
    const teamWeaknesses = team.map((p) => calculateWeaknesses(p.types, typeChart));

    allTypes.forEach((attackingType) => {
      let count = 0;
      let maxMultiplier = 0;

      teamWeaknesses.forEach((weaknesses) => {
        const allWeak = [...weaknesses.quadWeak, ...weaknesses.doubleWeak];
        if (allWeak.includes(attackingType)) {
          count++;
          if (weaknesses.quadWeak.includes(attackingType)) {
            maxMultiplier = Math.max(maxMultiplier, 4);
          } else {
            maxMultiplier = Math.max(maxMultiplier, 2);
          }
        }
      });

      if (count > 0) {
        weaknessCounts[attackingType] = { count, multiplier: maxMultiplier };
      }
    });

    return Object.entries(weaknessCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([type, data]) => ({ type, ...data }));
  }, [team]);

  if (!aggregatedWeaknesses || aggregatedWeaknesses.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        color: '#7AC74C',
        padding: '20px',
        fontSize: '13px',
        fontWeight: 500,
      }}>
        No significant weaknesses found for this team!
      </div>
    );
  }

  const quadWeak = aggregatedWeaknesses.filter(w => w.multiplier === 4);
  const doubleWeak = aggregatedWeaknesses.filter(w => w.multiplier === 2);

  return (
    <div>
      <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px', color: 'var(--text-primary)' }}>
        Team Weaknesses
      </h3>
      <p style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        margin: '0 0 12px',
        lineHeight: 1.4,
      }}>
        Types your team is weak to. Higher count = more Pokémon vulnerable.
      </p>

      {quadWeak.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#E63946', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ×4 Weak
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {quadWeak.map(({ type, count }) => (
              <TypeBadge key={type} type={type} count={count} multiplier={4} />
            ))}
          </div>
        </div>
      )}

      {doubleWeak.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#FF6B35', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ×2 Weak
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {doubleWeak.map(({ type, count }) => (
              <TypeBadge key={type} type={type} count={count} multiplier={2} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TeamStrengthDisplay({ team }) {
  const aggregatedStrengths = useMemo(() => {
    if (team.length === 0) return null;

    const strengthCounts = {};

    team.forEach((p) => {
      const strengths = calculateStrengths(p.types, typeChart);
      strengths.superEffective.forEach((defType) => {
        if (!strengthCounts[defType]) {
          strengthCounts[defType] = { count: 0 };
        }
        strengthCounts[defType].count++;
      });
    });

    return Object.entries(strengthCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([type, data]) => ({ type, ...data }));
  }, [team]);

  if (!aggregatedStrengths || aggregatedStrengths.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        color: 'var(--text-muted)',
        padding: '20px',
        fontSize: '13px',
        fontWeight: 500,
      }}>
        No offensive coverage data.
      </div>
    );
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px', color: 'var(--text-primary)' }}>
        Team Strong Against
      </h3>
      <p style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        margin: '0 0 12px',
        lineHeight: 1.4,
      }}>
        Types your team can hit super effectively. Higher count = more Pokémon with coverage.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {aggregatedStrengths.map(({ type, count }) => (
          <span
            key={type}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'var(--bg-focus)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '12px',
              color: 'var(--text-primary)'
            }}
          >
            <TypeIcon type={type} size={16} />
            <span style={{ fontWeight: 500 }}>{type}</span>
            <span style={{
              marginLeft: '4px',
              fontWeight: 700,
              color: '#7AC74C',
              background: 'var(--bg-card)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '11px',
            }}>
              {count}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TeamBuilderIsland() {
  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem('pokeweak-team');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 6) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load team from localStorage:', e);
    }
    return Array(6).fill(null);
  });
  
  const [searchSlot, setSearchSlot] = useState(null);
  const [query, setQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);
  const modalRef = useRef(null);

  // Persist team to localStorage
  useEffect(() => {
    try { localStorage.setItem('pokeweak-team', JSON.stringify(team)); } catch (e) { console.warn('Failed to save team to localStorage:', e); }
  }, [team]);

  const closeModal = useCallback(() => {
    setSearchSlot(null);
    setQuery('');
    setFilterTypes([]);
  }, []);

  useEffect(() => {
    if (searchSlot === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [searchSlot, closeModal]);

  const toggleFilterType = (type) => {
    setFilterTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      if (prev.length >= 2) return prev;
      return [...prev, type];
    });
  };

  const handleSelect = (slotInfo, name) => {
    const selected = pokemonData[name];
    if (selected) {
      if (slotInfo.type === 'player') {
        const newTeam = [...team];
        newTeam[slotInfo.index] = selected;
        setTeam(newTeam);
      }
    }
    setSearchSlot(null);
    setQuery('');
    setFilterTypes([]);
  };

  const handleRemovePlayer = (slotIndex) => {
    const newTeam = [...team];
    newTeam[slotIndex] = null;
    setTeam(newTeam);
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = pokemonList;

    if (q) {
      const normalizedQ = q.replace(/\s+/g, '-');
      filtered = filtered.filter(([name]) => name.includes(q) || name.includes(normalizedQ));
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

    return filtered.slice(0, 20);
  }, [query, filterTypes]);

  const activePlayerTeam = team.filter(Boolean);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
          Team Builder
        </h2>
      </div>

      <p style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        margin: '0 0 16px',
        lineHeight: 1.4,
      }}>
        Build your team of 6 Pokémon. Analyze shared weaknesses and type coverage at a glance.
      </p>

      <div style={{ display: 'grid', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Your Team
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activePlayerTeam.length} / 6</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
            {team.map((pokemon, idx) => (
              <TeamSlot
                key={idx}
                slotIndex={idx}
                pokemon={pokemon}
                onRemove={handleRemovePlayer}
                onSearch={(index) => setSearchSlot({ type: 'player', index })}
                label={`Your Slot ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {activePlayerTeam.length > 0 && (
          <div style={{
            background: 'var(--bg-elevated)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid var(--border-medium)',
          }}>
            <TeamWeaknessDisplay team={activePlayerTeam} />
            <TeamStrengthDisplay team={activePlayerTeam} />
          </div>
        )}
      </div>

      {searchSlot !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--overlay-bg)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Select Pokémon for your team"
            style={{
            background: 'var(--bg-elevated)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '85vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
            border: '1px solid var(--border-medium)'
          }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Select for Your Team
              </h3>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={query}
                onInput={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-body)',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  marginBottom: '12px',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                <button
                  onClick={() => setFilterTypes([])}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '36px',
                    padding: '0 14px',
                    borderRadius: '8px',
                    border: filterTypes.length === 0 ? '1.5px solid var(--text-primary)' : '1.5px solid transparent',
                    background: filterTypes.length === 0 ? 'var(--bg-focus)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: filterTypes.length === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
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
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid var(--text-primary)' : '1.5px solid transparent',
                        background: isSelected ? 'var(--bg-focus)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        padding: '0',
                      }}
                      title={t}
                      aria-label={`Filter by ${t} type${isSelected ? ' (active)' : ''}`}
                    >
                      <TypeIcon type={t} size={20} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div class="scrollbar-thin" style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
              {results.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No Pokémon found.
                </div>
              ) : (
                results.map(([name, data]) => (
                  <button
                    key={name}
                    onClick={() => handleSelect(searchSlot, name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 12px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <img
                      src={getSprite(data)}
                      alt={name}
                      width={40}
                      height={40}
                      style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{formatName(name, data)}</span>
                    <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                      {data.types.map((t) => (
                        <TypeIcon key={t} type={t} size={14} />
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
            <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
              <button
                onClick={closeModal}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
