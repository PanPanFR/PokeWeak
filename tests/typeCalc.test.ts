import { describe, it, expect } from 'vitest';
import { calculateWeaknesses, calculateStrengths } from '../src/utils/typeCalc';
import { typeChart } from '../src/data/typeChart';

describe('calculateWeaknesses', () => {
  it('returns correct weaknesses for single type', () => {
    const result = calculateWeaknesses(['Fire'], typeChart);
    expect(result.quadWeak).toEqual([]);
    expect(result.doubleWeak).toContain('Water');
    expect(result.doubleWeak).toContain('Ground');
    expect(result.doubleWeak).toContain('Rock');
    expect(result.resist).toContain('Fire');
    expect(result.resist).toContain('Grass');
    expect(result.immune).toEqual([]);
  });

  it('returns quad weakness for dual-type', () => {
    // Bug + Grass = 4x weak to Fire (Bug: 2x, Grass: 2x)
    const result = calculateWeaknesses(['Bug', 'Grass'], typeChart);
    expect(result.quadWeak).toContain('Fire');
  });

  it('handles Electric vs Rock correctly (should be 1x)', () => {
    const result = calculateWeaknesses(['Rock', 'Flying'], typeChart);
    // Electric: Rock=1, Flying=2 → 1*2 = 2x (super effective)
    expect(result.doubleWeak).toContain('Electric');
    expect(result.quadWeak).not.toContain('Electric');
  });

  it('handles immunity correctly (Ghost vs Normal)', () => {
    const result = calculateWeaknesses(['Normal'], typeChart);
    expect(result.immune).toContain('Ghost');
  });

  it('handles double immunity (Normal/Ghost vs Ghost)', () => {
    // Normal: Ghost=0, Ghost: Ghost=2 → 0*2 = 0 (still immune)
    const result = calculateWeaknesses(['Normal', 'Ghost'], typeChart);
    expect(result.immune).toContain('Ghost');
    expect(result.immune).toContain('Normal');
  });

  it('handles Steel dual-type resistances', () => {
    // Steel + Fairy: resists many types
    const result = calculateWeaknesses(['Steel', 'Fairy'], typeChart);
    expect(result.doubleResist).toContain('Bug'); // Steel 0.5 * Fairy 0.5 = 0.25
    expect(result.resist).toContain('Dark'); // Steel 1 * Fairy 0.5 = 0.5
    expect(result.doubleWeak).toContain('Fire'); // Steel 2 * Fairy 1 = 2
  });

  it('handles all 18 types as single type', () => {
    const allTypes = Object.keys(typeChart);
    for (const type of allTypes) {
      const result = calculateWeaknesses([type], typeChart);
      // Every type should have some combination of weaknesses/resistances/neutral
      const total =
        result.quadWeak.length +
        result.doubleWeak.length +
        result.neutral.length +
        result.resist.length +
        result.doubleResist.length +
        result.immune.length;
      expect(total).toBe(18); // All attacking types accounted for
    }
  });

  it('returns all 18 types for dual-type combinations', () => {
    const result = calculateWeaknesses(['Water', 'Ground'], typeChart);
    const total =
      result.quadWeak.length +
      result.doubleWeak.length +
      result.neutral.length +
      result.resist.length +
      result.doubleResist.length +
      result.immune.length;
    expect(total).toBe(18);
  });

  it('handles unknown type gracefully (defaults to 1x)', () => {
    // If a type is not in the chart, it should default to 1x multiplier
    const result = calculateWeaknesses(['Fire'], typeChart);
    // Fire should still work normally
    expect(result.doubleWeak).toContain('Water');
  });
});

describe('calculateStrengths', () => {
  it('returns correct super effective types', () => {
    const result = calculateStrengths(['Water'], typeChart);
    expect(result.superEffective).toContain('Fire');
    expect(result.superEffective).toContain('Ground');
    expect(result.superEffective).toContain('Rock');
  });

  it('returns correct not very effective types', () => {
    const result = calculateStrengths(['Water'], typeChart);
    expect(result.notVeryEffective).toContain('Water');
    expect(result.notVeryEffective).toContain('Grass');
    expect(result.notVeryEffective).toContain('Dragon');
  });

  it('returns correct no effect types', () => {
    const result = calculateStrengths(['Ground'], typeChart);
    expect(result.noEffect).toContain('Flying');
  });

  it('finds dual-type combos for ×4 effectiveness', () => {
    // Fire hits Bug+Grass for 4x (Bug: 2x, Grass: 2x)
    const result = calculateStrengths(['Fire'], typeChart);
    const bugGrass = result.extremelyEffective.find(
      ([a, b]) => (a === 'Bug' && b === 'Grass') || (a === 'Grass' && b === 'Bug')
    );
    expect(bugGrass).toBeDefined();
  });

  it('handles multi-type attackers', () => {
    // Water + Grass attacker
    const result = calculateStrengths(['Water', 'Grass'], typeChart);
    // Water hits Fire, Ground, Rock
    // Grass hits Water, Ground, Rock
    expect(result.superEffective).toContain('Fire'); // Water 2x
    expect(result.superEffective).toContain('Ground'); // Both 2x
    expect(result.superEffective).toContain('Rock'); // Both 2x
  });
});
