import TypeIcon from './TypeIcon.jsx';
import { allTypes } from '../hooks/usePokemonSearch.js';

/**
 * Shared type filter button row.
 * Deduplicates filter UI across SearchIsland, SpeedIsland, TeamBuilderIsland, SearchSelect, TypeCheckerIsland.
 *
 * @param {object} props
 * @param {string[]} props.filterTypes - Currently selected types
 * @param {(type: string) => void} props.toggleFilterType - Toggle a type on/off
 * @param {number} [props.buttonSize=28] - Button size in px
 * @param {number} [props.iconSize=16] - Icon size in px
 * @param {boolean} [props.showAll=true] - Show "All" reset button
 * @param {number} [props.maxSelect=2] - Max types selectable
 */
export default function TypeFilterButtons({ filterTypes, toggleFilterType, buttonSize = 28, iconSize = 16, showAll = true }) {
  const resetAll = () => {
    filterTypes.forEach(t => toggleFilterType(t));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {showAll && (
        <button
          onClick={resetAll}
          aria-label="Show all types"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: `${buttonSize}px`,
            padding: '0 8px',
            borderRadius: '6px',
            border: filterTypes.length === 0 ? '1.5px solid var(--text-primary)' : '1.5px solid transparent',
            background: filterTypes.length === 0 ? 'var(--bg-focus)' : 'var(--bg-card)',
            color: filterTypes.length === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          All
        </button>
      )}
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
              width: `${buttonSize}px`,
              height: `${buttonSize}px`,
              borderRadius: '6px',
              border: isSelected ? '1.5px solid var(--text-primary)' : '1.5px solid transparent',
              background: isSelected ? 'var(--bg-focus)' : 'var(--bg-card)',
              cursor: 'pointer',
              padding: '0',
            }}
            title={t}
            aria-label={`Filter by ${t} type${isSelected ? ' (active)' : ''}`}
          >
            <TypeIcon type={t} size={iconSize} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
