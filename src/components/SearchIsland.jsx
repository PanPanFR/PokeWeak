import { h } from 'preact';
import { useState, useMemo, useRef, useEffect, useCallback } from 'preact/hooks';
import pokemonData from '../data/pokemon.json';
import TypeIcon from './TypeIcon.jsx';
import { getSprite, displayName } from '../utils/pokemon';

const pokemonList = Object.entries(pokemonData);

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
  'roserade','rotom','runerigus','sableye','salazzle','samurott','sandaconda','sceptile','scizor',
  'scolipede','scovillain','scrafty','serperior','sharpedo','simipour','simisage','simisear','sinistcha',
  'skarmory','skeledirge','slowbro','slowking','slurpuff','sneasler','snorlax','spiritomb','staraptor',
  'starmie','steelix','stunfisk','swampert','sylveon','talonflame','tauros','tinkaton','torkoal',
  'torterra','toucannon','toxapex','toxicroak','trevenant','tsareena','typhlosion','tyranitar','tyrantrum',
  'umbreon','vanilluxe','vaporeon','venusaur','victreebel','vileplume','vivillon','volcarona','watchog',
  'weavile','whimsicott','wyrdeer','zoroark'
].filter(name => pokemonData[name]);

export default function SearchIsland() {
  const [query, setQuery] = useState('');
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
    if (!q) return [];
    return pokemonList
      .filter(([name]) => championsSet.has(name) && name.includes(q))
      .slice(0, 20);
  }, [query]);

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
      if (!isInput && !isDropdown) {
        setQuery('');
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
      </div>

      {!query.trim() && (
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
    </div>
  );
}
