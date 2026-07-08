import { describe, it, expect } from 'vitest';
import { calculateSpeedTiers } from '../src/utils/speedCalc';

describe('calculateSpeedTiers', () => {
  it('calculates correct tiers for base 100', () => {
    const tiers = calculateSpeedTiers(100);
    expect(tiers.base).toBe(100);
    expect(tiers.basePlus).toBe(120); // 100 + 20
    expect(tiers.noInvestPlus).toBe(132); // floor(120 * 1.1)
    expect(tiers.max).toBe(152); // 100 + 52
    expect(tiers.maxPlus).toBe(167); // floor(152 * 1.1)
    expect(tiers.tailwind).toBe(334); // 167 * 2
  });

  it('calculates correct tiers for base 130 (Aerodactyl)', () => {
    const tiers = calculateSpeedTiers(130);
    expect(tiers.base).toBe(130);
    expect(tiers.maxPlus).toBe(200); // floor(182 * 1.1)
  });
});
