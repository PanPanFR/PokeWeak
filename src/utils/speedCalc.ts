/**
 * Calculates VGC Level 50 Speed stats based on base speed.
 * Assumes 31 IVs (perfect).
 * - No Invest (0 EV, Neutral): base + 20
 * - No Invest+ (0 EV, Positive Nature): floor((base + 20) * 1.1)
 * - MAX (252 EV, Neutral): base + 52
 * - MAX+ (252 EV, Positive Nature): floor((base + 52) * 1.1)
 * - Tailwind: MAX+ * 2
 *
 * Note: `basePlus` is the No Invest tier, kept under this name for API stability.
 */
export function calculateSpeedTiers(baseSpeed: number) {
  const noInvest = baseSpeed + 20;
  const noInvestPlus = Math.floor(noInvest * 1.1);
  const max = baseSpeed + 52;
  const maxPlus = Math.floor(max * 1.1);
  const tailwind = maxPlus * 2;

  return {
    base: baseSpeed,
    basePlus: noInvest,
    noInvestPlus,
    max,
    maxPlus,
    tailwind,
  };
}