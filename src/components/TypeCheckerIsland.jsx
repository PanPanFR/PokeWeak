import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import TypeIcon from './TypeIcon.jsx';
import { calculateWeaknesses } from '../utils/typeCalc';
import typeChart from '../data/types.json';

const allTypes = Object.keys(typeChart);

export default function TypeCheckerIsland() {
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggleType = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      if (prev.length >= 2) return prev; // max 2 types
      return [...prev, type];
    });
  };

  const weaknesses = useMemo(() => {
    if (selectedTypes.length === 0) return null;
    if (selectedTypes.length > 2) return null; // invalid
    return calculateWeaknesses(selectedTypes, typeChart);
  }, [selectedTypes]);

  const isInvalid = selectedTypes.length > 2;

  return (
    <div style={{ marginTop: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>
        Manual Type Check
      </h3>

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
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: isSelected ? '2px solid #FFFFFF' : '2px solid transparent',
                background: isSelected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
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

      {selectedTypes.length > 0 && (
        <div style={{
          fontSize: '12px',
          color: '#A0A0A0',
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
                <span key={t} style={{ fontWeight: 500, color: '#FFFFFF' }}>{t}</span>
              )).reduce((prev, curr) => [prev, ' + ', curr])}
            </span>
          )}
        </div>
      )}

      {!isInvalid && weaknesses && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {weaknesses.quadWeak.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#E63946', marginBottom: '6px' }}>
                Extremely Weak (×4)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {weaknesses.quadWeak.map((t) => (
                  <span
                    key={t}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(255,255,255,0.07)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '12px',
                    }}
                  >
                    <TypeIcon type={t} size={14} />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {weaknesses.doubleWeak.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#FF6B35', marginBottom: '6px' }}>
                Weak (×2)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {weaknesses.doubleWeak.map((t) => (
                  <span
                    key={t}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(255,255,255,0.07)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '12px',
                    }}
                  >
                    <TypeIcon type={t} size={14} />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {weaknesses.resist.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#7AC74C', marginBottom: '6px' }}>
                Resists (×½)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {weaknesses.resist.map((t) => (
                  <span
                    key={t}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(255,255,255,0.07)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      opacity: 0.8,
                    }}
                  >
                    <TypeIcon type={t} size={14} />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {weaknesses.doubleResist.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#6390F0', marginBottom: '6px' }}>
                Double Resists (×¼)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {weaknesses.doubleResist.map((t) => (
                  <span
                    key={t}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(255,255,255,0.07)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      opacity: 0.6,
                    }}
                  >
                    <TypeIcon type={t} size={14} />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {weaknesses.immune.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#A0A0A0', marginBottom: '6px' }}>
                Immune (×0)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {weaknesses.immune.map((t) => (
                  <span
                    key={t}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(255,255,255,0.07)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      opacity: 0.4,
                    }}
                  >
                    <TypeIcon type={t} size={14} />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
