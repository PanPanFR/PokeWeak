import { describe, it, expect } from 'vitest';
import { calculateWeaknesses, calculateStrengths } from '../src/utils/typeCalc';
import typeChart from '../src/data/types.json';

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
    // Rock + Flying = 4x weak to Electric? No: Rock(1) * Flying(2) = 2x
    // But Ice(2) * Flying(2) = 4x for some combos
    const result = calculateWeaknesses(['Bug', 'Grass'], typeChart);
    expect(result.quadWeak).toContain('Fire');
  });

  it('handles Electric vs Rock correctly (should be 1x)', () => {
    const result = calculateWeaknesses(['Rock', 'Flying'], typeChart);
    // Electric: Rock=1, Flying=2 → 1*2 = 2x (super effective)
    expect(result.doubleWeak).toContain('Electric');
    expect(result.quadWeak).not.toContain('Electric');
  });
});

describe('calculateStrengths', () => {
  it('returns correct super effective types', () => {
    const result = calculateStrengths(['Water'], typeChart);
    expect(result.superEffective).toContain('Fire');
    expect(result.superEffective).toContain('Ground');
    expect(result.superEffective).toContain('Rock');
  });
});
