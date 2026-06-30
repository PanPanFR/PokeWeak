export interface WeaknessResult {
  quadWeak: string[];
  doubleWeak: string[];
  neutral: string[];
  resist: string[];
  doubleResist: string[];
  immune: string[];
}

export function calculateWeaknesses(
  types: string[],
  typeChart: Record<string, Record<string, number>>
): WeaknessResult {
  const results: WeaknessResult = {
    quadWeak: [],
    doubleWeak: [],
    neutral: [],
    resist: [],
    doubleResist: [],
    immune: [],
  };

  const attackingTypes = Object.keys(typeChart);

  for (const attacking of attackingTypes) {
    let multiplier = 1;

    for (const defender of types) {
      multiplier *= typeChart[attacking]?.[defender] ?? 1;
    }

    if (multiplier === 4) results.quadWeak.push(attacking);
    else if (multiplier === 2) results.doubleWeak.push(attacking);
    else if (multiplier === 1) results.neutral.push(attacking);
    else if (multiplier === 0.5) results.resist.push(attacking);
    else if (multiplier === 0.25) results.doubleResist.push(attacking);
    else if (multiplier === 0) results.immune.push(attacking);
  }

  return results;
}
