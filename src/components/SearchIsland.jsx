import { h } from 'preact';
import { useState, useMemo, useRef, useEffect, useCallback } from 'preact/hooks';
import pokemonData from '../data/pokemon.json';
import typeChart from '../data/types.json';
import TypeIcon from './TypeIcon.jsx';
import { getSprite, displayName } from '../utils/pokemon';

const pokemonList = Object.entries(pokemonData);
const allTypes = Object.keys(typeChart);

const championsPokemon = [
  'abomasnow','absol','aegislash','aerodactyl','aggron','alakazam','alcremie','altaria','ampharos',
  'annihilape','appletun','araquanid','arbok','arcanine','archaludon','ariados','armarouge',
  'aromatisse','audino','aurorus','avalugg','azumarill','banette','barbaracle','basculegion',
  'bastiodon','beartic','beedrill','bellibolt','blastoise','blaziken','camerupt','castform',
  'ceruledge','chandelure','charizard','chesnaught','chimecho','clawitzer','clefable','cofagrigus',
  'conkeldurr','corviknight','crabominable','decidueye','dedenne','delphox','diggersby','ditto','dragalge',
  'dragapult','dragonite','drampa','eelektross','emboar','emolga','empoleon','espathra','espeon',
  'excadrill','farigiraf','feraligatr','flapple','flareon','floette','florges','forretress','froslass',
  'furfrou','gallade','garchomp','gardevoir','garganacl','gengar','gholdengo','glaceon','glalie',
  'glimmora','gliscor','golurk','goodra','gourgeist','greninja','grimmsnarl','gyarados','hatterene',
  'hawlucha','heliolisk','heracross','hippowdon','houndoom','houndstone','hydrapple','hydreigon',
  'incineroar','infernape','jolteon','kangaskhan','kingambit','kleavor','klefki','krookodile',
  'leafeon','liepard','lopunny','lucario','luxray','lycanroc','machamp','malamar','mamoswine',
  'manectric','maushold','mawile','medicham','meganium','meowscarada','meowstic','metagross',
  'milotic','mimikyu','morpeko','mudsdale','musharna','ninetales','noivern','oranguru','orthworm',
  'overqwil','palafin','pangoro','passimian','pelipper','pidgeot','pikachu','pinsir','politoed',
  'polteageist','primarina','pyroar','quaquaval','qwilfish','raichu','rampardos','reuniclus','rhyperior',
  'roserade','rotom','rotom-wash','rotom-heat','rotom-mow','rotom-frost','runerigus','sableye','salazzle',
  'samurott','sandaconda','sceptile','scizor','scolipede','scovillain','scrafty','serperior','sharpedo',
  'simipour','simisage','simisear','sinistcha','skarmory','skeledirge','slowbro','slowking','slurpuff',
  'sneasler','snorlax','spiritomb','staraptor','starmie','steelix','stunfisk','swampert','sylveon',
  'talonflame','tauros','tinkaton','torkoal','torterra','toucannon','toxapex','toxicroak','trevenant',
  'tsareena','typhlosion','tyranitar','tyrantrum','umbreon','vanilluxe','vaporeon','venusaur','victreebel',
  'vileplume','vivillon','volcarona','watchog','weavile','whimsicott','wyrdeer','zoroark'
].filter(name => pokemonData[name]);

export default function SearchIsland() {
  const [query, setQuery] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const dropdownRef = useRef(null);

  const championsSet = useMemo(() => new Set(championsPokemon), []);

  const sortedChampions = useMemo(() =>
    championsPokemon
      .map(name => [name, pokemonData[name]])
      .sort((a, b) => a[0].localeCompare(b[0])),
  []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = pokemonList;

    if (q) {
      filtered = filtered.filter(([name]) => championsSet.has(name) && name.includes(q));
    } else {
      filtered = sortedChampions;
    }

    if (filterTypes.length > 0) {
      filtered = filtered.filter(([, data]) =>
        filterTypes.some(t => data.types.includes(t))
      );
    }

    if (filterTypes.length === 2) {
      filtered.sort(([, a], [, b]) => {
        const aHasBoth = filterTypes.every(t => a.types.includes(t));
        const bHasBoth = filterTypes.every(t => b.types.includes(t));
        if (aHasBoth && !bHasBoth) return -1;
        if (!aHasBoth && bHasBoth) return 1;
        return 0;
      });
    }

    return filtered.slice(0, 20);
  }, [query, filterTypes, sortedChampions, championsSet]);

  const toggleFilterType = useCallback((type) => {
    setFilterTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      if (prev.length >= 2) return prev;
      return [...prev, type];
    });
  }, []);

  const handleInput = useCallback((e) => {
    setQuery(e.target.value);
    setFocusedIdx(-1);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && focusedIdx >= 0 && results[focusedIdx]) {
      const [name] = results[focusedIdx];
      window.location.href = `/pokemon/${name}`;
    } else if (e.key === 'Escape') {
      setQuery('');
      setFilterTypes([]);
      inputRef.current?.blur();
    }
  }, [results, focusedIdx]);

  useEffect(() => {
    if (focusedIdx >= 0 && listRef.current) {
      const el = listRef.current.children[focusedIdx];
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIdx]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isInput = inputRef.current && inputRef.current.contains(e.target);
      const isDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);
      const isFilter = e.target.closest('[data-type-filter]');
      if (!isInput && !isDropdown && !isFilter) {
        setQuery('');
        setFilterTypes([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#121212',
        paddingBottom: '8px',
      }}>
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Pokémon..."
            value={query}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#1E1E1E',
              color: '#FFFFFF',
              fontSize: '16px',
              fontFamily: 'inherit',
              outline: 'none',
              minHeight: '44px',
            }}
          />
          {query.trim() && results.length > 0 && (
            <div
              ref={dropdownRef}
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                background: '#1E1E1E',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                maxHeight: 'min(320px, 50vh)',
                overflowY: 'auto',
                zIndex: 100,
              }}
              class="scrollbar-thin"
            >
              <div ref={listRef}>
                {results.map(([name, data], idx) => (
                  <a
                    key={name}
                    href={`/pokemon/${name}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 16px',
                      background: focusedIdx === idx ? '#2A2A2A' : 'transparent',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      minHeight: '44px',
                      textAlign: 'left',
                      textDecoration: 'none',
                    }}
                  >
                    <img
                      src={getSprite(data)}
                      alt={name}
                      width={40}
                      height={40}
                      style={{ imageRendering: 'pixelated', flexShrink: 0 }}
                    />
                    <span style={{ fontWeight: 500 }}>{name}</span>
                    <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                      {data.types.map((t) => (
                        <TypeIcon key={t} type={t} size={16} />
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          data-type-filter
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '8px',
          }}
        >
          <button
            onClick={() => setFilterTypes([])}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '32px',
              padding: '0 10px',
              borderRadius: '8px',
              border: filterTypes.length === 0 ? '1.5px solid #FFFFFF' : '1.5px solid transparent',
              background: filterTypes.length === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
              color: filterTypes.length === 0 ? '#FFFFFF' : '#A0A0A0',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            All
          </button>
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
                  height: '32px',
                  padding: '0 6px',
                  borderRadius: '8px',
                  border: isSelected ? '1.5px solid #FFFFFF' : '1.5px solid transparent',
                  background: isSelected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                  cursor: 'pointer',
                }}
                title={t}
              >
                <TypeIcon type={t} size={18} />
              </button>
            );
          })}
        </div>
      </div>

      {!query.trim() && filterTypes.length === 0 && (
        <div>
          {sortedChampions.map(([name, data]) => (
            <a
              key={name}
              href={`/pokemon/${name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px 16px',
                background: 'transparent',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'inherit',
                minHeight: '44px',
                textAlign: 'left',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <img
                src={getSprite(data)}
                alt={name}
                width={36}
                height={36}
                style={{ imageRendering: 'pixelated', flexShrink: 0 }}
              />
              <span style={{ fontWeight: 500 }}>{name}</span>
              <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                {data.types.map((t) => (
                  <TypeIcon key={t} type={t} size={14} />
                ))}
              </div>
            </a>
          ))}
        </div>
      )}

      {!query.trim() && filterTypes.length > 0 && (
        <div>
          {results.map(([name, data]) => (
            <a
              key={name}
              href={`/pokemon/${name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px 16px',
                background: 'transparent',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'inherit',
                minHeight: '44px',
                textAlign: 'left',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <img
                src={getSprite(data)}
                alt={name}
                width={36}
                height={36}
                style={{ imageRendering: 'pixelated', flexShrink: 0 }}
              />
              <span style={{ fontWeight: 500 }}>{name}</span>
              <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                {data.types.map((t) => (
                  <TypeIcon key={t} type={t} size={14} />
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
