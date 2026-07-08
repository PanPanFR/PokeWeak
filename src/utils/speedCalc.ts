/**
 * Calculates VGC Level 50 Speed stats based on base speed.
 * Assumes 31 IVs (perfect).
 * - No Invest (0 EV, Neutral): base + 20
 * - No Invest+ (0 EV, Positive Nature): floor((base + 20) * 1.1)
 * - MAX (252 EV, Neutral): base + 52
 * - MAX+ (252 EV, Positive Nature): floor((base + 52) * 1.1)
 * - Tailwind: MAX+ * 2
 */
export function calculateSpeedTiers(baseSpeed: number) {
  const base = baseSpeed;
  const noInvest = baseSpeed + 20; // 0 EV, Neutral Nature at Level 50
  const noInvestPlus = Math.floor((baseSpeed + 20) * 1.1); // 0 EV, Positive Nature at Level 50
  const max = baseSpeed + 52; // 252 EV (32 SP), Neutral Nature
  const maxPlus = Math.floor((baseSpeed + 52) * 1.1); // 252 EV, Positive Nature
  const tailwind = maxPlus * 2; // Tailwind multiplier

  // To keep compatibility with existing code that uses 'basePlus', we'll map No Invest to basePlus
  // and keep max and maxPlus.
  return {
    base,
    basePlus: noInvest,
    noInvestPlus,
    max,
    maxPlus,
    tailwind
  };
}
