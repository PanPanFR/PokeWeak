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

  it('handles minimum base speed (1)', () => {
    const tiers = calculateSpeedTiers(1);
    expect(tiers.base).toBe(1);
    expect(tiers.basePlus).toBe(21); // 1 + 20
    expect(tiers.max).toBe(53); // 1 + 52
    expect(tiers.maxPlus).toBe(58); // floor(53 * 1.1)
    expect(tiers.tailwind).toBe(116); // 58 * 2
  });

  it('handles maximum base speed (200)', () => {
    const tiers = calculateSpeedTiers(200);
    expect(tiers.base).toBe(200);
    expect(tiers.basePlus).toBe(220); // 200 + 20
    expect(tiers.max).toBe(252); // 200 + 52
    expect(tiers.maxPlus).toBe(277); // floor(252 * 1.1)
    expect(tiers.tailwind).toBe(554); // 277 * 2
  });

  it('handles base 50 (common VGC tier)', () => {
    const tiers = calculateSpeedTiers(50);
    expect(tiers.base).toBe(50);
    expect(tiers.basePlus).toBe(70);
    expect(tiers.noInvestPlus).toBe(77); // floor(70 * 1.1)
    expect(tiers.max).toBe(102);
    expect(tiers.maxPlus).toBe(112); // floor(102 * 1.1)
    expect(tiers.tailwind).toBe(224);
  });

  it('handles base 0 (Shuckle edge case)', () => {
    const tiers = calculateSpeedTiers(0);
    expect(tiers.base).toBe(0);
    expect(tiers.basePlus).toBe(20);
    expect(tiers.max).toBe(52);
    expect(tiers.maxPlus).toBe(57); // floor(52 * 1.1)
    expect(tiers.tailwind).toBe(114);
  });
});
