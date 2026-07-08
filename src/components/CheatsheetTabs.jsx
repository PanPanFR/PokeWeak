import { useState } from 'preact/hooks';
import TypeCheckerIsland from './TypeCheckerIsland.jsx';
import HiddenMechanicsIsland from './HiddenMechanicsIsland.jsx';

const tabs = [
  { id: 'matchups', label: 'Type Matchups', icon: 'grid' },
  { id: 'hidden', label: 'Hidden Mechanics', icon: 'eye' },
];

function TabIcon({ icon, active }) {
  const color = active ? 'var(--text-primary)' : 'var(--text-muted)';
  const s = { width: 14, height: 14, flexShrink: 0, stroke: color, fill: 'none' };
  if (icon === 'grid') {
    return (
      <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={s}>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={s}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function CheatsheetTabs() {
  const [activeTab, setActiveTab] = useState('matchups');

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '16px',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '4px',
        border: '1px solid var(--border-subtle)',
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '9px 12px',
                borderRadius: '9px',
                border: 'none',
                background: isActive ? 'var(--bg-focus)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <TabIcon icon={tab.icon} active={isActive} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'matchups' && <TypeCheckerIsland />}
      {activeTab === 'hidden' && <HiddenMechanicsIsland />}
    </div>
  );
}
