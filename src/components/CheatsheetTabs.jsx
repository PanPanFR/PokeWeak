import { useState } from 'preact/hooks';
import TypeCheckerIsland from './TypeCheckerIsland.jsx';
import HiddenMechanicsIsland from './HiddenMechanicsIsland.jsx';

const tabs = [
  { id: 'matchups', label: 'Type Matchups' },
  { id: 'hidden', label: 'Hidden Mechanics' },
];

export default function CheatsheetTabs() {
  const [activeTab, setActiveTab] = useState('matchups');

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '16px',
        background: 'var(--bg-card)',
        borderRadius: '10px',
        padding: '3px',
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
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'var(--bg-focus)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'inherit',
                transition: 'background 150ms, color 150ms',
              }}
            >
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
