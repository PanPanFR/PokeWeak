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
        gap: '4px',
        marginBottom: '16px',
        background: 'var(--bg-card)',
        borderRadius: '10px',
        padding: '3px',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--bg-focus)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'matchups' && <TypeCheckerIsland />}
      {activeTab === 'hidden' && <HiddenMechanicsIsland />}
    </div>
  );
}
