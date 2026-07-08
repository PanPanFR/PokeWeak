import { useState } from 'preact/hooks';
import TypeIcon from './TypeIcon.jsx';
import { hiddenMechanics } from '../data/hiddenMechanics.js';

const sectionColor = {
  'type-immunities': '#FBBF24',
  'move-hidden-effects': '#E63946',
  'field-weather': '#A855F7',
  'champions-changes': '#3B82F6',
  'double-battle': '#14B8A6',
};

function ChevronIcon({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      style={{
        transition: 'transform 150ms ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0)',
        flexShrink: 0,
        color: 'var(--text-muted)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function TypeImmunityCard({ item }) {
  const types = item.types || [item.type];
  const c = `var(--color-pk-${types[0].toLowerCase()})`;

  return (
    <div style={{
      padding: '10px 12px',
      borderRadius: '10px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderLeft: `3px solid ${c}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', flexWrap: 'wrap' }}>
        {types.map((t) => (
          <span key={t} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: `color-mix(in srgb, var(--color-pk-${t.toLowerCase()}) 18%, transparent)`,
            borderRadius: '6px',
            padding: '2px 7px',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            <TypeIcon type={t} size={13} />
            {t}
          </span>
        ))}
      </div>
      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        {item.text}
      </span>
    </div>
  );
}

function MechanicCard({ item, color }) {
  return (
    <div style={{
      padding: '10px 12px',
      borderRadius: '10px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>
        {item.name}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        {item.text}
      </div>
    </div>
  );
}

function AccordionSection({ section, isOpen, onToggle }) {
  const color = sectionColor[section.id] || '#A0A0A0';
  const isTypeImmunity = section.id === 'type-immunities';

  return (
    <section
      aria-label={section.title}
      style={{
        borderRadius: '12px',
        border: `1px solid ${color}30`,
        background: 'var(--bg-surface)',
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '12px 14px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          gap: '10px',
          minHeight: '48px',
          touchAction: 'manipulation',
        }}
      >
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          background: `color-mix(in srgb, ${color} 15%, transparent)`,
          flexShrink: 0,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            {section.id === 'type-immunities' && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
            {section.id === 'move-hidden-effects' && <><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" y1="19" x2="19" y2="13" /></>}
            {section.id === 'field-weather' && <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>}
            {section.id === 'champions-changes' && <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></>}
            {section.id === 'double-battle' && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>}
          </svg>
        </span>
        <span style={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textAlign: 'left',
          flex: 1,
        }}>
          {section.title}
        </span>
        <span style={{
          fontSize: '10px',
          color,
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          borderRadius: '999px',
          padding: '2px 8px',
          fontWeight: 700,
        }}>
          {section.items.length}
        </span>
        <ChevronIcon open={isOpen} />
      </button>
      {isOpen && (
        <div style={{
          padding: '0 14px 14px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
        }}>
          {section.items.map((item, i) => (
            isTypeImmunity ? (
              <TypeImmunityCard key={i} item={item} />
            ) : (
              <MechanicCard key={i} item={item} color={color} />
            )
          ))}
        </div>
      )}
    </section>
  );
}

export default function HiddenMechanicsIsland() {
  const [openSections, setOpenSections] = useState(() => {
    const initial = {};
    hiddenMechanics.forEach((s) => { initial[s.id] = true; });
    return initial;
  });

  const toggle = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {hiddenMechanics.map((section) => (
        <AccordionSection
          key={section.id}
          section={section}
          isOpen={openSections[section.id]}
          onToggle={() => toggle(section.id)}
        />
      ))}
    </div>
  );
}
