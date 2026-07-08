import { useState } from 'preact/hooks';
import TypeIcon from './TypeIcon.jsx';
import { hiddenMechanics } from '../data/hiddenMechanics.js';

const sectionConfig = {
  'type-immunities': { color: '#FBBF24', icon: 'shield' },
  'move-interactions': { color: '#E63946', icon: 'sword' },
  'ability-interactions': { color: '#A855F7', icon: 'star' },
  'item-interactions': { color: '#3B82F6', icon: 'bag' },
  'double-battle': { color: '#14B8A6', icon: 'users' },
};

function SectionIcon({ icon, size = 16, color }) {
  const s = { width: size, height: size, flexShrink: 0, stroke: color, fill: 'none' };
  switch (icon) {
    case 'shield':
      return <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'sword':
      return <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={s}><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/></svg>;
    case 'star':
      return <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={s}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case 'bag':
      return <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={s}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
    case 'users':
      return <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={s}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
    default:
      return null;
  }
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      style={{
        transition: 'transform 200ms ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
        color: 'var(--text-muted)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function TypeImmunityCard({ item, index }) {
  const types = item.types || [item.type];
  const primaryColor = `var(--color-pk-${types[0].toLowerCase()})`;

  return (
    <div
      class="animate-stagger hm-immunity-card"
      style={{
        '--i': index,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '10px 12px',
        borderRadius: '10px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderLeft: `3px solid ${primaryColor}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {types.map((t) => {
          const c = `var(--color-pk-${t.toLowerCase()})`;
          return (
            <span key={t} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: `color-mix(in srgb, ${c} 18%, transparent)`,
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              <TypeIcon type={t} size={14} />
              {t}
            </span>
          );
        })}
      </div>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        {item.text}
      </span>
    </div>
  );
}

function MechanicCard({ item, index, color }) {
  return (
    <div
      class="animate-stagger hm-mechanic-card"
      style={{
        '--i': index,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '10px 12px',
        borderRadius: '10px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
        {item.name}
      </span>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        {item.text}
      </span>
    </div>
  );
}

function AccordionSection({ section, isOpen, onToggle }) {
  const config = sectionConfig[section.id] || { color: '#A0A0A0', icon: 'star' };
  const isTypeImmunity = section.id === 'type-immunities';

  return (
    <section
      aria-label={section.title}
      class="animate-stagger hm-section"
      style={{
        '--i': hiddenMechanics.indexOf(section),
        borderRadius: '12px',
        border: `1px solid ${config.color}30`,
        background: 'var(--bg-surface)',
        overflow: 'hidden',
        transition: 'border-color 200ms ease',
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
        }}
      >
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: `color-mix(in srgb, ${config.color} 15%, transparent)`,
          flexShrink: 0,
        }}>
          <SectionIcon icon={config.icon} size={16} color={config.color} />
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
          fontSize: '11px',
          color: config.color,
          background: `color-mix(in srgb, ${config.color} 12%, transparent)`,
          borderRadius: '999px',
          padding: '2px 8px',
          fontWeight: 700,
        }}>
          {section.items.length}
        </span>
        <ChevronIcon open={isOpen} />
      </button>
      <div
        class="hm-accordion-body"
        style={{
          maxHeight: isOpen ? '2000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 250ms ease',
        }}
      >
        <div style={{
          padding: '0 14px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {isTypeImmunity ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
            }}>
              {section.items.map((item, i) => (
                <TypeImmunityCard key={i} item={item} index={i} />
              ))}
            </div>
          ) : (
            section.items.map((item, i) => (
              <MechanicCard key={i} item={item} index={i} color={config.color} />
            ))
          )}
        </div>
      </div>
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
