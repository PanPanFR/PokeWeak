/**
 * Calculates VGC Level 50 Speed stats based on base speed.
 * Formula at Lv 50: floor( (2 * Base + IV + floor(EV/4)) * 50/100 + 5 ) * Nature
 * Assuming 31 IVs (perfect): floor( Base + 15.5 + EV/8 + 5 ) * Nature
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
