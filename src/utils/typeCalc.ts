export interface WeaknessResult {
  quadWeak: string[];
  doubleWeak: string[];
  neutral: string[];
  resist: string[];
  doubleResist: string[];
  immune: string[];
}

export interface StrengthResult {
  superEffective: string[];        // Single types hit for ×2
  notVeryEffective: string[];      // Single types that resist (×½)
  noEffect: string[];              // Single types immune (×0)
  extremelyEffective: string[][];  // Dual-type combos hit for ×4
}

export function calculateStrengths(
  types: string[],
  typeChart: Record<string, Record<string, number>>
): StrengthResult {
  const result: StrengthResult = {
    superEffective: [],
    notVeryEffective: [],
    noEffect: [],
    extremelyEffective: [],
  };

  const allTypes = Object.keys(typeChart);

  // Single-type effectiveness
  for (const defender of allTypes) {
    let bestMult = 0;
    for (const attacker of types) {
      const mult = typeChart[attacker]?.[defender] ?? 1;
      bestMult = Math.max(bestMult, mult);
    }

    if (bestMult >= 2) result.superEffective.push(defender);
    else if (bestMult === 0) result.noEffect.push(defender);
    else if (bestMult <= 0.5) result.notVeryEffective.push(defender);
  }

  // Dual-type combo ×4 effectiveness
  for (let i = 0; i < allTypes.length; i++) {
    for (let j = i + 1; j < allTypes.length; j++) {
      const def1 = allTypes[i];
      const def2 = allTypes[j];

      let bestMult = 0;
      for (const attacker of types) {
        const mult = (typeChart[attacker]?.[def1] ?? 1) * (typeChart[attacker]?.[def2] ?? 1);
        bestMult = Math.max(bestMult, mult);
      }

      if (bestMult >= 4) {
        result.extremelyEffective.push([def1, def2]);
      }
    }
  }

  return result;
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
