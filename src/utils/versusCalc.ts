import typeChart from '../data/types.json';
import pokemonData from '../data/pokemon.json';

export function getMatchupMultiplier(attackingType: string, defendingTypes: string[]): number {
  let multiplier = 1;
  const chart = typeChart as Record<string, Record<string, number>>;
  for (const defender of defendingTypes) {
    multiplier *= chart[attackingType]?.[defender] ?? 1;
  }
  return multiplier;
}

export function calculateBestAttack(attackerName: string, defenderName: string) {
  const attacker = (pokemonData as Record<string, any>)[attackerName];
  const defender = (pokemonData as Record<string, any>)[defenderName];
  
  if (!attacker || !defender) return { multiplier: 1, type: '' };

  let maxMultiplier = -1;
  let bestType = '';

  for (const type of attacker.types) {
    const mult = getMatchupMultiplier(type, defender.types);
    if (mult > maxMultiplier) {
      maxMultiplier = mult;
      bestType = type;
    }
  }

  return { multiplier: maxMultiplier, type: bestType, speedDiff: attacker.speed - defender.speed };
}
