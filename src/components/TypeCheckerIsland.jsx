import { useState, useMemo } from 'preact/hooks';
import TypeIcon from './TypeIcon.jsx';
import { calculateWeaknesses, calculateStrengths } from '../utils/typeCalc';
import typeChart from '../data/types.json';

const allTypes = Object.keys(typeChart);

function TypeBadge({ type, size = 14, label, opacity = 1 }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        background: 'var(--bg-hover)',
        borderRadius: '8px',
        padding: '4px 8px',
        fontSize: '12px',
        opacity,
      }}
    >
      <TypeIcon type={type} size={size} />
      {label !== false && <span>{type}</span>}
    </span>
  );
}

function DualTypeBadge({ types }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        background: 'var(--bg-hover)',
        borderRadius: '8px',
        padding: '4px 8px',
        fontSize: '11px',
      }}
    >
      <TypeIcon type={types[0]} size={13} />
      <span>{types[0]}</span>
      <span style={{ color: 'var(--text-muted)', margin: '0 1px' }}>/</span>
      <TypeIcon type={types[1]} size={13} />
      <span>{types[1]}</span>
    </span>
  );
}

function CheatsheetGrid({ mode }) {
  const gridData = useMemo(() => {
    return allTypes.map((type) => {
      if (mode === 'weak') {
        const w = calculateWeaknesses([type], typeChart);
        return {
          type,
          row1: { show: true, label: 'Weak', items: [...w.quadWeak, ...w.doubleWeak] },
          row2: { show: true, label: 'Resist', items: w.resist, badgeClass: 'cs-badge--resist' },
          special: {
            show: w.immune.length > 0 || w.doubleResist.length > 0,
            label: 'Imm',
            immuneItems: w.immune,
            resistItems: w.doubleResist,
          },
        };
      } else {
        const strong = [];
        const resisted = [];
        const noEffect = [];
        for (const defender of allTypes) {
          const mult = typeChart[type]?.[defender] ?? 1;
          if (mult >= 2) strong.push(defender);
          else if (mult === 0) noEffect.push(defender);
          else if (mult <= 0.5) resisted.push(defender);
        }
        return {
          type,
          row1: { show: true, label: 'Strong', items: strong },
          row2: { show: false },
          special: {
            show: noEffect.length > 0,
            label: 'No Eff',
            immuneItems: noEffect,
            resistItems: [],
          },
        };
      }
    });
  }, [mode]);

  return (
    <div class="cs-grid" style={{ marginTop: '20px' }}>
      {gridData.map(({ type, row1, row2, special }) => {
        const c = `var(--color-pk-${type.toLowerCase()})`;
        return (
          <div class="cs-card" key={type} style={{ '--tc': c }}>
            <div class="cs-head">
              <TypeIcon type={type} size={16} />
              <span class="cs-name">{type}</span>
            </div>
            <div class="cs-body">
              {row1.show !== false && (
                <div class="cs-row">
                  <span class="cs-label">{row1.label}</span>
                  <span class="cs-badges">
                    {row1.items.length > 0 ? row1.items.map((atk) => (
                      <span class="cs-badge" key={atk} title={atk}>
                        <TypeIcon type={atk} size={12} />
                      </span>
                    )) : <span class="cs-none">—</span>}
                  </span>
                </div>
              )}
              {row2.show !== false && (
                <div class="cs-row">
                  <span class="cs-label">{row2.label}</span>
                  <span class="cs-badges">
                    {row2.items.length > 0 ? row2.items.map((atk) => (
                      <span class={`cs-badge ${row2.badgeClass || ''}`} key={atk} title={atk}>
                        <TypeIcon type={atk} size={12} />
                      </span>
                    )) : <span class="cs-none">—</span>}
                  </span>
                </div>
              )}
              {special.show && (
                <div class="cs-row">
                  <span class="cs-label cs-label--special">{special.label}</span>
                  <span class="cs-badges">
                    {special.immuneItems.map((atk) => (
                      <span class="cs-badge cs-badge--immune" key={atk} title={atk}>
                        <TypeIcon type={atk} size={12} />
                      </span>
                    ))}
                    {special.resistItems.map((atk) => (
                      <span class="cs-badge cs-badge--resist" key={atk} title={atk}>
                        <TypeIcon type={atk} size={12} />
                      </span>
                    ))}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function TypeCheckerIsland() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [mode, setMode] = useState('weak');

  const toggleType = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) return prev.filter((t) => t !== type);
      if (prev.length >= 2) return prev;
      return [...prev, type];
    });
  };

  const weaknesses = useMemo(() => {
    if (selectedTypes.length === 0 || selectedTypes.length > 2) return null;
    return calculateWeaknesses(selectedTypes, typeChart);
  }, [selectedTypes]);

  const strengths = useMemo(() => {
    if (selectedTypes.length === 0 || selectedTypes.length > 2) return null;
    return calculateStrengths(selectedTypes, typeChart);
  }, [selectedTypes]);

  const isInvalid = selectedTypes.length > 2;

  return (
    <div>
      {/* Mode Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
          Manual Type Check
        </h3>
        <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
          {[
            { key: 'weak', label: 'Weak Against' },
            { key: 'strong', label: 'Strong Against' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: mode === key ? '1.5px solid var(--text-primary)' : '1.5px solid transparent',
                background: mode === key ? 'var(--bg-focus)' : 'var(--bg-card)',
                color: mode === key ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Type Selector Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '12px',
      }}>
        {allTypes.map((t) => {
          const isSelected = selectedTypes.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggleType(t)}
              aria-label={`${isSelected ? 'Deselect' : 'Select'} ${t} type`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: isSelected ? '2px solid var(--text-primary)' : '2px solid transparent',
                background: isSelected ? 'var(--bg-focus)' : 'var(--bg-card)',
                cursor: 'pointer',
                padding: '0',
                transition: 'all 0.15s ease',
              }}
              title={t}
            >
              <TypeIcon type={t} size={24} />
            </button>
          );
        })}
      </div>

      {/* Selected Types Info */}
      {selectedTypes.length > 0 && (
        <div style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '8px',
          minHeight: '18px',
        }}>
          {isInvalid ? (
            <span style={{ color: '#E63946', fontWeight: 600 }}>
              Invalid: Maximum 2 types only
            </span>
          ) : (
            <span>
              Selected: {selectedTypes.map((t) => (
                <span key={t} style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t}</span>
              )).reduce((prev, curr) => [prev, ' + ', curr])}
              <span style={{ marginLeft: '8px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                {mode === 'weak' ? '(Defending)' : '(Attacking)'}
              </span>
            </span>
          )}
        </div>
      )}

      {/* ===== WEAK AGAINST RESULTS (Defensive) ===== */}
      {!isInvalid && mode === 'weak' && weaknesses && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {weaknesses.quadWeak.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#E63946', marginBottom: '6px' }}>
                Extremely Weak (×4)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {weaknesses.quadWeak.map((t) => <TypeBadge key={t} type={t} />)}
              </div>
            </div>
          )}
          {weaknesses.doubleWeak.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#FF6B35', marginBottom: '6px' }}>
                Weak (×2)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {weaknesses.doubleWeak.map((t) => <TypeBadge key={t} type={t} />)}
              </div>
            </div>
          )}
          {weaknesses.resist.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#7AC74C', marginBottom: '6px' }}>
                Resists (×½)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {weaknesses.resist.map((t) => <TypeBadge key={t} type={t} opacity={0.8} />)}
              </div>
            </div>
          )}
          {weaknesses.doubleResist.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#6390F0', marginBottom: '6px' }}>
                Double Resists (×¼)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {weaknesses.doubleResist.map((t) => <TypeBadge key={t} type={t} opacity={0.6} />)}
              </div>
            </div>
          )}
          {weaknesses.immune.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#A0A0A0', marginBottom: '6px' }}>
                Immune (×0)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {weaknesses.immune.map((t) => <TypeBadge key={t} type={t} opacity={0.4} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== STRONG AGAINST RESULTS (Offensive) ===== */}
      {!isInvalid && mode === 'strong' && strengths && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {strengths.extremelyEffective.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#E63946', marginBottom: '6px' }}>
                Extremely Effective (×4)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {strengths.extremelyEffective.map((pair) => (
                  <DualTypeBadge key={pair.join('-')} types={pair} />
                ))}
              </div>
            </div>
          )}
          {strengths.superEffective.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#7AC74C', marginBottom: '6px' }}>
                Super Effective (×2)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {strengths.superEffective.map((t) => <TypeBadge key={t} type={t} />)}
              </div>
            </div>
          )}
          {strengths.notVeryEffective.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#FF6B35', marginBottom: '6px' }}>
                Not Very Effective (×½)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {strengths.notVeryEffective.map((t) => <TypeBadge key={t} type={t} opacity={0.8} />)}
              </div>
            </div>
          )}
          {strengths.noEffect.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#A0A0A0', marginBottom: '6px' }}>
                No Effect (×0)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {strengths.noEffect.map((t) => <TypeBadge key={t} type={t} opacity={0.4} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== CHEATSHEET GRID ===== */}
      <CheatsheetGrid mode={mode} />
    </div>
  );
}
