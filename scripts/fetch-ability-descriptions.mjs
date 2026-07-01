import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pokemonFilePath = path.join(__dirname, '../src/data/pokemon.json');

// Cache untuk abilities yang sudah di-fetch
const abilityCache = new Map();

async function fetchAbilityDescription(abilityName) {
  if (abilityCache.has(abilityName)) {
    return abilityCache.get(abilityName);
  }

  try {
    // Convert ability name to PokeAPI format (spaces to hyphens)
    const pokeapiName = abilityName.replace(/\s+/g, '-').toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${pokeapiName}`);
    if (!response.ok) throw new Error(`Failed to fetch ${pokeapiName}`);
    
    const data = await response.json();
    
    // Get English description
    const effectEntry = data.effect_entries.find(e => e.language.name === 'en');
    const description = effectEntry?.effect || 'No description available';
    
    abilityCache.set(abilityName, description);
    console.log(`✓ Fetched: ${abilityName}`);
    return description;
  } catch (error) {
    console.error(`✗ Error fetching ability ${abilityName}:`, error.message);
    abilityCache.set(abilityName, 'No description available');
    return 'No description available';
  }
}

async function main() {
  console.log('📖 Reading pokemon.json...');
  const pokemonData = JSON.parse(fs.readFileSync(pokemonFilePath, 'utf-8'));
  
  console.log(`📊 Found ${Object.keys(pokemonData).length} pokemon entries\n`);
  
  // Collect all unique abilities from pokemon.json only
  const allAbilities = new Set();
  const pokemonAbilityMap = new Map();
  
  for (const [pokemonKey, pokemon] of Object.entries(pokemonData)) {
    if (pokemon.abilities && Array.isArray(pokemon.abilities)) {
      pokemon.abilities.forEach(ability => {
        const abilityName = typeof ability === 'string' ? ability : ability.name;
        allAbilities.add(abilityName);
        
        if (!pokemonAbilityMap.has(abilityName)) {
          pokemonAbilityMap.set(abilityName, []);
        }
        pokemonAbilityMap.get(abilityName).push(pokemon.name);
      });
    }
  }
  
  console.log(`🎯 Found ${allAbilities.size} unique abilities from pokemon.json:\n`);
  
  // List all abilities
  const sortedAbilities = Array.from(allAbilities).sort();
  sortedAbilities.forEach(ability => {
    const pokemonList = pokemonAbilityMap.get(ability);
    console.log(`  • ${ability} (${pokemonList.length} pokemon)`);
  });
  
  console.log(`\n🔄 Fetching descriptions from PokeAPI...\n`);
  
  // Fetch descriptions for all abilities
  let fetchedCount = 0;
  for (const ability of sortedAbilities) {
    await fetchAbilityDescription(ability);
    fetchedCount++;
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  
  console.log(`\n✅ Fetched ${fetchedCount} ability descriptions\n`);
  
  // Update pokemon data with ability descriptions
  console.log('🔨 Updating pokemon data...');
  for (const pokemon of Object.values(pokemonData)) {
    if (pokemon.abilities && Array.isArray(pokemon.abilities)) {
      pokemon.abilities = pokemon.abilities.map((ability) => {
        const abilityName = typeof ability === 'string' ? ability : ability.name;
        const description = abilityCache.get(abilityName);
        return {
          name: abilityName,
          description: description
        };
      });
    }
  }
  
  // Save updated data
  console.log('\n💾 Saving updated pokemon.json...');
  fs.writeFileSync(
    pokemonFilePath,
    JSON.stringify(pokemonData, null, 2) + '\n',
    'utf-8'
  );
  
  console.log('✓ Done! Pokemon data updated with ability descriptions.');
}

main().catch(console.error);
