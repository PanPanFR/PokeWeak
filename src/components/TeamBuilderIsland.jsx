import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import pokemonData from '../data/pokemon.json';
import TypeIcon from './TypeIcon.jsx';
import { getSprite, displayName } from '../utils/pokemon';
import { calculateWeaknesses } from '../utils/typeCalc';
import typeChart from '../data/types.json';

const pokemonList = Object.entries(pokemonData);
const allTypes = Object.keys(typeChart);

function TeamSlot({ slotIndex, pokemon, onRemove, onSearch }) {
  if (pokemon) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px',
        background: '#1E1E1E',
        borderRadius: '10px',
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
           <div style={{ fontSize: '13px', fontWeight: 500 }}>{displayName(pokemon.name, pokemon)}</div>
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
            color: '#A0A0A0',
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
    <div
      onClick={() => onSearch(slotIndex)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px',
        background: '#1E1E1E',
        borderRadius: '10px',
        minHeight: '44px',
        color: '#A0A0A0',
        cursor: 'pointer',
        fontSize: '13px',
      }}
    >
      <span style={{ fontSize: '16px' }}>+</span>
      <span>Slot {slotIndex + 1}</span>
    </div>
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
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '8px',
        padding: '6px 10px',
        fontSize: '12px',
      }}
    >
      <TypeIcon type={type} size={16} />
      <span style={{ fontWeight: 500 }}>{type}</span>
      <span style={{
        marginLeft: '4px',
        fontWeight: 700,
        color,
        background: 'rgba(255,255,255,0.1)',
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

    allTypes.forEach((attackingType) => {
      let count = 0;
      let maxMultiplier = 0;

      team.forEach((p) => {
        const weaknesses = calculateWeaknesses(p.types, typeChart);
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
      <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>
        Team Weaknesses
      </h3>
      <p style={{
        fontSize: '12px',
        color: '#A0A0A0',
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

export default function TeamBuilderIsland() {
  const [team, setTeam] = useState(Array(6).fill(null));
  const [searchSlot, setSearchSlot] = useState(null);
  const [query, setQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);

  const toggleFilterType = (type) => {
    setFilterTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      if (prev.length >= 2) return prev;
      return [...prev, type];
    });
  };

  const handleSelect = (slotIndex, name) => {
    const selected = pokemonData[name];
    if (selected) {
      const newTeam = [...team];
      newTeam[slotIndex] = selected;
      setTeam(newTeam);
    }
    setSearchSlot(null);
    setQuery('');
    setFilterTypes([]);
  };

  const handleRemove = (slotIndex) => {
    const newTeam = [...team];
    newTeam[slotIndex] = null;
    setTeam(newTeam);
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = pokemonList;

    if (q) {
      filtered = filtered.filter(([name]) => name.includes(q));
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

  const activeTeam = team.filter(Boolean);

  return (
    <div>
      <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 12px' }}>
        Team Builder
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {team.map((pokemon, idx) => (
          <TeamSlot
            key={idx}
            slotIndex={idx}
            pokemon={pokemon}
            onRemove={handleRemove}
            onSearch={setSearchSlot}
          />
        ))}
      </div>

      {activeTeam.length > 0 && (
        <div style={{
          background: '#1E1E1E',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '16px',
        }}>
          <TeamWeaknessDisplay team={activeTeam} />
        </div>
      )}

      {searchSlot !== null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}>
          <div style={{
            background: '#1E1E1E',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={query}
                onInput={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#121212',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  marginBottom: '8px',
                }}
                autoFocus
              />
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}>
                <button
                  onClick={() => setFilterTypes([])}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: filterTypes.length === 0 ? '2px solid #FFFFFF' : '2px solid transparent',
                    background: filterTypes.length === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                    cursor: 'pointer',
                    padding: '0',
                    fontSize: '10px',
                    color: '#A0A0A0',
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
                        border: isSelected ? '2px solid #FFFFFF' : '2px solid transparent',
                        background: isSelected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                        cursor: 'pointer',
                        padding: '0',
                      }}
                      title={t}
                    >
                      <TypeIcon type={t} size={20} />
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {results.map(([name, data]) => (
                <button
                  key={name}
                  onClick={() => handleSelect(searchSlot, name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 14px',
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <img
                    src={getSprite(data)}
                    alt={name}
                    width={36}
                    height={36}
                    style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                  />
                  <span style={{ fontWeight: 500 }}>{displayName(name, data)}</span>
                  <div style={{ display: 'flex', gap: '3px', marginLeft: 'auto' }}>
                    {data.types.map((t) => (
                      <TypeIcon key={t} type={t} size={14} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                onClick={() => {
                  setSearchSlot(null);
                  setQuery('');
                  setFilterTypes([]);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#2A2A2A',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
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
