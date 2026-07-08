import { useState, useMemo } from 'preact/hooks';
import pokemonData from '../data/pokemon.json';
import typeChart from '../data/types.json';
import TypeIcon from './TypeIcon.jsx';
import { getSprite as getPokemonSprite, formatName } from '../utils/pokemon';
import { calculateSpeedTiers } from '../utils/speedCalc';
import SearchSelect from './SearchSelect.jsx';

const pokemonList = Object.entries(pokemonData);
const allTypes = Object.keys(typeChart);

function getRankColor(rank) {
  if (rank === 1) return '#FFD700';
  if (rank === 2) return '#C0C0C0';
  if (rank === 3) return '#CD7F32';
  return 'var(--text-primary)';
}

export default function SpeedIsland() {
  const [sortDesc, setSortDesc] = useState(true);
  const [query, setQuery] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  const [compA_Pokemon, setCompA_Pokemon] = useState(pokemonList[0][0]);
  const [compA_Tier, setCompA_Tier] = useState('maxPlus');
  const [compB_Pokemon, setCompB_Pokemon] = useState(pokemonList[1] ? pokemonList[1][0] : pokemonList[0][0]);
  const [compB_Tier, setCompB_Tier] = useState('maxPlus');

  const [filterTypes, setFilterTypes] = useState([]);

  const toggleFilterType = (type) => {
    setFilterTypes((prev) => {
      if (prev.includes(type)) return prev.filter((t) => t !== type);
      if (prev.length >= 2) return prev;
      return [...prev, type];
    });
  };

  const sorted = useMemo(() => {
    let list = [...pokemonList];
    const q = query.trim().toLowerCase();
    
    if (q) {
      const normalizedQ = q.replace(/\s+/g, '-');
      list = list.filter(([name, data]) => 
        name.includes(q) || name.includes(normalizedQ) ||
        (data.name && data.name.toLowerCase().includes(q)) || 
        data.types.some(t => t.toLowerCase().includes(q))
      );
    }
    
    if (filterTypes.length > 0) {
      list = list.filter(([, data]) => filterTypes.some(t => data.types.includes(t)));
    }
    
    list.sort(([, a], [, b]) => sortDesc ? b.speed - a.speed : a.speed - b.speed);
    // Pre-compute speed tiers to avoid recalculation per row
    return list.map(([name, data]) => [name, data, calculateSpeedTiers(data.speed)]);
  }, [sortDesc, query, filterTypes]);

  // Comparison calculation
  const compA_Data = pokemonData[compA_Pokemon];
  const compB_Data = pokemonData[compB_Pokemon];
  const compA_Tiers = compA_Data ? calculateSpeedTiers(compA_Data.speed) : null;
  const compB_Tiers = compB_Data ? calculateSpeedTiers(compB_Data.speed) : null;
  
  const compA_Speed = compA_Tiers ? compA_Tiers[compA_Tier] : 0;
  const compB_Speed = compB_Tiers ? compB_Tiers[compB_Tier] : 0;

  return (
    <div style={{ paddingBottom: '20px', overflow: 'visible' }}>
      <div style={{
        paddingTop: '20px',
        paddingBottom: '16px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Speed Tiers
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowCompare(!showCompare)}
              style={{
                background: showCompare ? 'var(--bg-hover)' : 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Compare
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              style={{
                background: showInfo ? 'var(--bg-hover)' : 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Info
            </button>
            <button
              onClick={() => setSortDesc((v) => !v)}
              aria-pressed={sortDesc}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {sortDesc ? 'Fastest ↓' : 'Slowest ↑'}
            </button>
          </div>
        </div>
      </div>

      {showInfo && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '12px',
          fontSize: '12px',
          lineHeight: 1.5,
          color: 'var(--text-secondary)'
        }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Speed Calculation Guide:</strong>
          <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li><strong style={{ color: 'var(--text-primary)' }}>BASE:</strong> Raw speed stat with no additions.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>No Invest:</strong> Speed with 0 EV investment and neutral nature.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>No Invest+:</strong> Speed with 0 EV investment AND a speed-boosting nature (+10%).</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>MAX:</strong> Speed with max EV investment (32 SP) and a neutral nature.</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>MAX+:</strong> Speed with max EV investment (32 SP) AND a speed-boosting nature (+10%).</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>TAILWIND:</strong> The MAX+ speed multiplied by 2.</li>
          </ul>
        </div>
      )}

      {showCompare && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '12px',
          color: 'var(--text-primary)',
          fontSize: '13px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Pokemon A Select */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '24px', textAlign: 'center', fontWeight: 'bold', color: '#EF4444' }}>A</div>
              <SearchSelect 
                value={compA_Pokemon} 
                onChange={setCompA_Pokemon} 
                placeholder="Select Pokémon A" 
              />
              <select 
                value={compA_Tier} 
                onChange={(e) => setCompA_Tier(e.target.value)}
                style={{ width: '100px', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
              >
                <option value="base">BASE</option>
                <option value="basePlus">No Invest</option>
                <option value="noInvestPlus">No Invest+</option>
                <option value="max">MAX</option>
                <option value="maxPlus">MAX+</option>
                <option value="tailwind">Tailwind</option>
              </select>
              <div style={{ width: '40px', textAlign: 'right', fontWeight: 'bold' }}>{compA_Speed}</div>
            </div>

            {/* Pokemon B Select */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '24px', textAlign: 'center', fontWeight: 'bold', color: '#3B82F6' }}>B</div>
              <SearchSelect 
                value={compB_Pokemon} 
                onChange={setCompB_Pokemon} 
                placeholder="Select Pokémon B" 
              />
              <select 
                value={compB_Tier} 
                onChange={(e) => setCompB_Tier(e.target.value)}
                style={{ width: '100px', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
              >
                <option value="base">BASE</option>
                <option value="basePlus">No Invest</option>
                <option value="noInvestPlus">No Invest+</option>
                <option value="max">MAX</option>
                <option value="maxPlus">MAX+</option>
                <option value="tailwind">Tailwind</option>
              </select>
              <div style={{ width: '40px', textAlign: 'right', fontWeight: 'bold' }}>{compB_Speed}</div>
            </div>

            {/* Result */}
            <div style={{
              marginTop: '4px',
              padding: '8px',
              background: 'var(--bg-body)',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: 600,
              color: compA_Speed === compB_Speed ? 'var(--text-secondary)' : (compA_Speed > compB_Speed ? '#EF4444' : '#3B82F6')
            }}>
              {compA_Speed > compB_Speed 
                ? `${formatName(compA_Pokemon, compA_Data)} is faster by ${compA_Speed - compB_Speed} points!` 
                : compB_Speed > compA_Speed 
                  ? `${formatName(compB_Pokemon, compB_Data)} is faster by ${compB_Speed - compA_Speed} points!` 
                  : "It's a Speed Tie!"}
            </div>
          </div>
        </div>
      )}

      <div 
        style={{
        background: 'var(--bg-elevated)',
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        marginBottom: '16px',
      }}>
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
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            marginTop: '12px',
          }}>
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
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid var(--text-primary)' : '1.5px solid transparent',
                    background: isSelected ? 'var(--bg-focus)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    padding: '0',
                  }}
                  title={t}
                  aria-label={`Filter by ${t} type${isSelected ? ' (active)' : ''}`}
                >
                  <TypeIcon type={t} size={16} aria-hidden="true" />
                </button>
              );
            })}
          </div>
          
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
            Showing {sorted.length} Pokémon
          </div>
      </div>

      <div style={{ overflowX: 'auto', marginTop: '12px', paddingBottom: '16px' }}>
        <table aria-label="Speed tiers leaderboard" style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '600px', // Ensures it scrolls on mobile instead of squishing
          textAlign: 'left',
          fontSize: '13px',
          fontVariantNumeric: 'tabular-nums',
        }}>
          <thead>
            <tr style={{
              background: '#0B2239', // Dark blue header from image
              color: '#FFFFFF',
            }}>
              <th scope="col" style={{ padding: '12px 16px', fontWeight: 600, borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>#</th>
              <th scope="col" style={{ padding: '12px 16px', fontWeight: 600 }}>Pokémon</th>
              <th scope="col" style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>Base</th>
              <th scope="col" style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>No Invest</th>
              <th scope="col" style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>No Invest+</th>
              <th scope="col" style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>MAX</th>
              <th scope="col" style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>MAX+</th>
              <th scope="col" style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Tailwind / +2</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(([name, data, tiers], idx) => {
              const rank = idx + 1;
              return (
                <tr 
                  key={name}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: idx % 2 === 0 ? 'transparent' : 'var(--bg-surface)',
                    transition: 'background 0.2s',
                    contentVisibility: 'auto',
                    containIntrinsicSize: 'auto 56px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'var(--bg-surface)'}
                >
                  <td style={{ padding: '8px 16px', fontWeight: 700, color: getRankColor(rank) }}>
                    {rank}
                  </td>
                  <td style={{ padding: '8px 16px' }}>
                    <a 
                      href={`/pokemon/${name}`}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                    >
                      <img
                        src={getPokemonSprite(data)}
                        alt={formatName(name, data)}
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#3182CE', marginBottom: '2px', textDecoration: 'underline' }}>
                          {formatName(name, data)}
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {data.types.map((t) => (
                            <TypeIcon key={t} type={t} size={12} />
                          ))}
                        </div>
                      </div>
                    </a>
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {data.speed}
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'center', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {tiers.basePlus}
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'center', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {tiers.noInvestPlus}
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'center', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {tiers.max}
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {tiers.maxPlus}
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'center', fontWeight: 600, color: '#6390F0' }}>
                    {tiers.tailwind}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
