import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import pokemonData from '../data/pokemon.json';
import typeChart from '../data/types.json';
import { calculateWeaknesses } from '../utils/typeCalc';
import { calculateSpeedTiers } from '../utils/speedCalc';
import { getSprite, displayName } from '../utils/pokemon';
import TypeIcon from './TypeIcon.jsx';
import SearchSelect from './SearchSelect.jsx';

const allPokemon = Object.entries(pokemonData);


function AttackAnalysis({ attacker, defender }) {
  const defWeaknesses = calculateWeaknesses(defender.types, typeChart);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {attacker.types.map(atkType => {
        let effectiveness = 'Neutral (×1)';
        let color = 'var(--text-secondary)';
        let bg = 'var(--bg-card)';
        
        if (defWeaknesses.quadWeak.includes(atkType)) {
          effectiveness = 'Extremely Effective (×4)';
          color = '#FFFFFF';
          bg = '#E63946';
        } else if (defWeaknesses.doubleWeak.includes(atkType)) {
          effectiveness = 'Super Effective (×2)';
          color = '#FFFFFF';
          bg = '#FF6B35';
        } else if (defWeaknesses.resist.includes(atkType)) {
          effectiveness = 'Resisted (×½)';
          color = '#FFFFFF';
          bg = '#7AC74C';
        } else if (defWeaknesses.doubleResist.includes(atkType)) {
          effectiveness = 'Double Resisted (×¼)';
          color = '#FFFFFF';
          bg = '#6390F0';
        } else if (defWeaknesses.immune.includes(atkType)) {
          effectiveness = 'Immune (×0)';
          color = '#FFFFFF';
          bg = '#A0A0A0';
        }

        return (
          <div key={atkType} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'var(--bg-surface-alt)',
            padding: '6px 8px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TypeIcon type={atkType} size={16} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{atkType} STAB</span>
            </div>
            <div style={{
              background: bg,
              color: color,
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
            }}>
              {effectiveness}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MatchupSummary({ attackerA, defenderB, speedA, speedB }) {
  const weakB = calculateWeaknesses(defenderB.types, typeChart);
  const weakA = calculateWeaknesses(attackerA.types, typeChart);
  
  let aMult = 1;
  attackerA.types.forEach(t => {
    if (weakB.quadWeak.includes(t)) aMult = Math.max(aMult, 4);
    else if (weakB.doubleWeak.includes(t)) aMult = Math.max(aMult, 2);
    else if (weakB.resist.includes(t)) aMult = Math.max(aMult, 0.5);
    else if (weakB.doubleResist.includes(t)) aMult = Math.max(aMult, 0.25);
    else if (weakB.immune.includes(t)) aMult = 0;
  });

  let bMult = 1;
  defenderB.types.forEach(t => {
    if (weakA.quadWeak.includes(t)) bMult = Math.max(bMult, 4);
    else if (weakA.doubleWeak.includes(t)) bMult = Math.max(bMult, 2);
    else if (weakA.resist.includes(t)) bMult = Math.max(bMult, 0.5);
    else if (weakA.doubleResist.includes(t)) bMult = Math.max(bMult, 0.25);
    else if (weakA.immune.includes(t)) bMult = 0;
  });

  const aFaster = speedA.maxPlus > speedB.maxPlus;
  const bFaster = speedB.maxPlus > speedA.maxPlus;
  const tie = speedA.maxPlus === speedB.maxPlus;

  let summary = "";
  if (tie) {
    if (aMult > bMult) summary = `${displayName(attackerA.name, attackerA)} has a better type advantage, but it's a speed tie. Could go either way!`;
    else if (bMult > aMult) summary = `${displayName(defenderB.name, defenderB)} has a better type advantage, but it's a speed tie. Could go either way!`;
    else summary = "A completely balanced matchup. Stats and movesets will decide the winner.";
  } else {
    if (aFaster && aMult > 1 && bMult <= 1) summary = `${displayName(attackerA.name, attackerA)} is faster and has a type advantage! Likely an easy win.`;
    else if (bFaster && bMult > 1 && aMult <= 1) summary = `${displayName(defenderB.name, defenderB)} is faster and has a type advantage! Likely an easy win.`;
    else if (aFaster && aMult > 1 && bMult > 1) summary = `${displayName(attackerA.name, attackerA)} is faster and both have super-effective moves. First to strike wins!`;
    else if (bFaster && bMult > 1 && aMult > 1) summary = `${displayName(defenderB.name, defenderB)} is faster and both have super-effective moves. First to strike wins!`;
    else if (aFaster && aMult <= 1 && bMult > 1) summary = `${displayName(attackerA.name, attackerA)} is faster, but ${displayName(defenderB.name, defenderB)} can hit super-effectively if it survives!`;
    else if (bFaster && bMult <= 1 && aMult > 1) summary = `${displayName(defenderB.name, defenderB)} is faster, but ${displayName(attackerA.name, attackerA)} can hit super-effectively if it survives!`;
    else if (aFaster && aMult > bMult) summary = `${displayName(attackerA.name, attackerA)} has the speed and type advantage.`;
    else if (bFaster && bMult > aMult) summary = `${displayName(defenderB.name, defenderB)} has the speed and type advantage.`;
    else summary = "A relatively neutral matchup. Stats and movesets will decide the winner.";
  }

  return (
    <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-medium)', textAlign: 'center', marginTop: '4px' }}>
      <h3 style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--text-primary)' }}>Matchup Summary</h3>
      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {summary}
      </p>
    </div>
  );
}

export default function VersusIsland() {
  const [pokeA, setPokeA] = useState('');
  const [pokeB, setPokeB] = useState('');

  const aData = pokeA ? pokemonData[pokeA] : null;
  const bData = pokeB ? pokemonData[pokeB] : null;

  const speedA = aData ? calculateSpeedTiers(aData.speed) : null;
  const speedB = bData ? calculateSpeedTiers(bData.speed) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '16px', textAlign: 'center', color: 'var(--text-primary)' }}>Select Matchup</h2>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          margin: '0 0 16px',
          lineHeight: 1.4,
          textAlign: 'center',
        }}>
          Pick two Pokémon for a 1v1 matchup breakdown — type effectiveness, speed comparison, and battle prediction.
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <SearchSelect value={pokeA} onChange={setPokeA} placeholder="Pokémon A" />
          <div style={{ fontWeight: 800, fontSize: '14px', color: '#E63946' }}>VS</div>
          <SearchSelect value={pokeB} onChange={setPokeB} placeholder="Pokémon B" />
        </div>
      </div>

      {aData && bData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
          {/* Sprites & Types */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
              <img src={getSprite(aData)} alt={pokeA} width={80} height={80} style={{ imageRendering: 'pixelated', transform: 'scaleX(-1)' }} />
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', textAlign: 'center' }}>{displayName(pokeA, aData)}</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {aData.types.map(t => <TypeIcon key={t} type={t} size={16} />)}
              </div>
            </div>
            
            <div style={{ fontWeight: 800, fontSize: '24px', color: 'var(--text-muted)', opacity: 0.5 }}>VS</div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
              <img src={getSprite(bData)} alt={pokeB} width={80} height={80} style={{ imageRendering: 'pixelated' }} />
              <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', textAlign: 'center' }}>{displayName(pokeB, bData)}</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {bData.types.map(t => <TypeIcon key={t} type={t} size={16} />)}
              </div>
            </div>
          </div>

          {/* Speed Comparison */}
          <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--text-primary)', textAlign: 'center' }}>Speed Comparison</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: '8px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right', fontWeight: 600, color: speedA.maxPlus > speedB.maxPlus ? '#7AC74C' : 'var(--text-primary)' }}>{speedA.maxPlus}</div>
              <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '4px', borderRadius: '4px' }}>MAX+</div>
              <div style={{ textAlign: 'left', fontWeight: 600, color: speedB.maxPlus > speedA.maxPlus ? '#7AC74C' : 'var(--text-primary)' }}>{speedB.maxPlus}</div>
              
              <div style={{ textAlign: 'right', fontWeight: 600, color: speedA.max > speedB.max ? '#7AC74C' : 'var(--text-primary)' }}>{speedA.max}</div>
              <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '4px', borderRadius: '4px' }}>MAX</div>
              <div style={{ textAlign: 'left', fontWeight: 600, color: speedB.max > speedA.max ? '#7AC74C' : 'var(--text-primary)' }}>{speedB.max}</div>

              <div style={{ textAlign: 'right', fontWeight: 600, color: speedA.basePlus > speedB.basePlus ? '#7AC74C' : 'var(--text-primary)' }}>{speedA.basePlus}</div>
              <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '4px', borderRadius: '4px' }}>No Invest</div>
              <div style={{ textAlign: 'left', fontWeight: 600, color: speedB.basePlus > speedA.basePlus ? '#7AC74C' : 'var(--text-primary)' }}>{speedB.basePlus}</div>

              <div style={{ textAlign: 'right', fontWeight: 600, color: speedA.noInvestPlus > speedB.noInvestPlus ? '#7AC74C' : 'var(--text-primary)' }}>{speedA.noInvestPlus}</div>
              <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '4px', borderRadius: '4px' }}>No Invest+</div>
              <div style={{ textAlign: 'left', fontWeight: 600, color: speedB.noInvestPlus > speedA.noInvestPlus ? '#7AC74C' : 'var(--text-primary)' }}>{speedB.noInvestPlus}</div>

              <div style={{ textAlign: 'right', fontWeight: 600, color: speedA.base > speedB.base ? '#7AC74C' : 'var(--text-primary)' }}>{speedA.base}</div>
              <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '4px', borderRadius: '4px' }}>BASE</div>
              <div style={{ textAlign: 'left', fontWeight: 600, color: speedB.base > speedA.base ? '#7AC74C' : 'var(--text-primary)' }}>{speedB.base}</div>
            </div>
            <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: speedA.maxPlus === speedB.maxPlus ? 'var(--text-secondary)' : '#E63946' }}>
              {speedA.maxPlus > speedB.maxPlus 
                ? `${displayName(pokeA, aData)} is faster! (Max Speed)`
                : speedB.maxPlus > speedA.maxPlus
                  ? `${displayName(pokeB, bData)} is faster! (Max Speed)`
                  : 'Speed Tie! (Max Speed)'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--text-primary)' }}>
                {displayName(pokeA, aData)} <span style={{ color: 'var(--text-secondary)' }}>Attacking</span> {displayName(pokeB, bData)}
              </h3>
              <AttackAnalysis attacker={aData} defender={bData} />
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--text-primary)' }}>
                {displayName(pokeB, bData)} <span style={{ color: 'var(--text-secondary)' }}>Attacking</span> {displayName(pokeA, aData)}
              </h3>
              <AttackAnalysis attacker={bData} defender={aData} />
            </div>
          </div>
          
          <MatchupSummary attackerA={aData} defenderB={bData} speedA={speedA} speedB={speedB} />
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
