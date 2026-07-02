import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import pokemonData from '../data/pokemon.json';
import TypeIcon from './TypeIcon.jsx';
import { getSprite as getPokemonSprite, displayName } from '../utils/pokemon';

const pokemonList = Object.entries(pokemonData);
const MAX_SPEED = 200;

function getRankColor(rank) {
  if (rank === 1) return '#FFD700';
  if (rank === 2) return '#C0C0C0';
  if (rank === 3) return '#CD7F32';
  return '#A0A0A0';
}

export default function SpeedIsland() {
  const [sortDesc, setSortDesc] = useState(true);
  const [query, setQuery] = useState('');
  const [minSpeed, setMinSpeed] = useState('');
  const [maxSpeed, setMaxSpeed] = useState('');

  const sorted = useMemo(() => {
    let list = [...pokemonList];
    const q = query.trim().toLowerCase();
    if (q) list = list.filter(([name]) => name.includes(q));
    if (minSpeed) list = list.filter(([, d]) => d.speed >= Number(minSpeed));
    if (maxSpeed) list = list.filter(([, d]) => d.speed <= Number(maxSpeed));
    list.sort(([, a], [, b]) => sortDesc ? b.speed - a.speed : a.speed - b.speed);
    return list;
  }, [sortDesc, query, minSpeed, maxSpeed]);

  return (
    <div style={{ overflowX: 'hidden' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#121212',
        paddingBottom: '10px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
            Speed
          </h2>
          <button
            onClick={() => setSortDesc((v) => !v)}
            style={{
              background: '#1E1E1E',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#FFFFFF',
              padding: '8px 10px',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              minHeight: '44px',
              whiteSpace: 'nowrap',
            }}
          >
            {sortDesc ? 'Fastest ↓' : 'Slowest ↑'}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search Pokémon..."
          value={query}
          onInput={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#1E1E1E',
            color: '#FFFFFF',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            minHeight: '44px',
            marginBottom: '8px',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Min"
            value={minSpeed}
            onInput={(e) => setMinSpeed(e.target.value)}
            style={{
              width: 0,
              flex: '1 1 0',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#1E1E1E',
              color: '#FFFFFF',
              fontSize: '13px',
              fontFamily: 'inherit',
              outline: 'none',
              minHeight: '44px',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="number"
            placeholder="Max"
            value={maxSpeed}
            onInput={(e) => setMaxSpeed(e.target.value)}
            style={{
              width: 0,
              flex: '1 1 0',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#1E1E1E',
              color: '#FFFFFF',
              fontSize: '13px',
              fontFamily: 'inherit',
              outline: 'none',
              minHeight: '44px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ fontSize: '12px', color: '#A0A0A0', marginTop: '8px' }}>
          {sorted.length} Pokémon
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {sorted.map(([name, data], idx) => {
          const rank = idx + 1;
          const pct = (data.speed / MAX_SPEED) * 100;
          const barColor = data.speed >= 120
            ? 'linear-gradient(90deg, #E63946, #FF6B35)'
            : data.speed >= 80
            ? 'linear-gradient(90deg, #FF6B35, #F7D02C)'
            : 'linear-gradient(90deg, #7AC74C, #6390F0)';

          return (
            <a
              key={name}
              href={`/pokemon/${name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'inherit',
                background: 'transparent',
                minHeight: '44px',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1E1E1E'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{
                width: '28px',
                fontWeight: 700,
                fontSize: '13px',
                color: getRankColor(rank),
                textAlign: 'center',
                flexShrink: 0,
              }}>
                #{rank}
              </span>
              <img
                src={getPokemonSprite(data)}
                alt={displayName(name, data)}
                width={32}
                height={32}
                loading="lazy"
                decoding="async"
                style={{ imageRendering: 'pixelated', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>{displayName(name, data)}</div>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {data.types.map((t) => (
                    <TypeIcon key={t} type={t} size={14} />
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>{data.speed}</div>
                <div style={{
                  width: '60px',
                  height: '4px',
                  borderRadius: '2px',
                  background: '#2A2A2A',
                  marginTop: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    borderRadius: '2px',
                    background: barColor,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
