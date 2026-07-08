import { useState } from 'preact/hooks';
import TypeIcon from './TypeIcon.jsx';
import { hiddenMechanics } from '../data/hiddenMechanics.js';

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
        transition: 'transform 200ms ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function TypeImmunityRow({ item }) {
  const types = item.types || [item.type];
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        {types.map((t) => (
          <span key={t} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-hover)',
            borderRadius: '6px',
            padding: '3px 7px',
            fontSize: '11px',
            fontWeight: 600,
          }}>
            <TypeIcon type={t} size={13} />
            {t}
          </span>
        ))}
      </div>
      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
        {item.text}
      </span>
    </div>
  );
}

function MechanicRow({ item }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      padding: '6px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
        {item.name}
      </span>
      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
        {item.text}
      </span>
    </div>
  );
}

function AccordionSection({ section, isOpen, onToggle }) {
  const isTypeImmunity = section.id === 'type-immunities';

  return (
    <div style={{
      borderRadius: '10px',
      border: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
      overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '10px 12px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          gap: '8px',
        }}
      >
        <span style={{
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          textAlign: 'left',
          flex: 1,
        }}>
          {section.title}
        </span>
        <span style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
          background: 'var(--bg-hover)',
          borderRadius: '8px',
          padding: '2px 7px',
          fontWeight: 600,
        }}>
          {section.items.length}
        </span>
        <ChevronIcon open={isOpen} />
      </button>
      {isOpen && (
        <div style={{
          padding: '0 12px 10px',
        }}>
          {isTypeImmunity ? (
            section.items.map((item, i) => (
              <TypeImmunityRow key={i} item={item} />
            ))
          ) : (
            section.items.map((item, i) => (
              <MechanicRow key={i} item={item} />
            ))
          )}
        </div>
      )}
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
