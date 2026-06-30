import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const pokemonPath = join(projectRoot, 'src/data/pokemon.json');

const data = JSON.parse(readFileSync(pokemonPath, 'utf-8'));
const keys = Object.keys(data);
const total = keys.length;

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

async function main() {
  for (let i = 0; i < total; i++) {
    const key = keys[i];
    const entry = data[key];

    if (entry.abilities && entry.abilities.length > 0) {
      console.log(`[${i + 1}/${total}] ${entry.name}: SKIP (already has abilities)`);
      continue;
    }

    let name = key;

    if (key.startsWith('mega-')) {
      // Convert mega-venusaur -> venusaur-mega, mega-charizard-x -> charizard-mega-x
      const rest = key.slice(5);
      if (rest.endsWith('-x')) name = rest.slice(0, -2) + '-mega-x';
      else if (rest.endsWith('-y')) name = rest.slice(0, -2) + '-mega-y';
      else name = rest + '-mega';
    }

    try {
      const json = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const abilities = json.abilities
        .map(a => a.ability.name.replace(/-/g, ' '))
        .sort();
      entry.abilities = abilities;
      console.log(`[${i + 1}/${total}] ${entry.name}: ${abilities.join(', ')}`);
    } catch (err) {
      console.error(`[${i + 1}/${total}] ${entry.name}: FAILED - ${err.message}`);
      entry.abilities = [];
    }

    await new Promise(r => setTimeout(r, 150));
  }

  writeFileSync(pokemonPath, JSON.stringify(data, null, 2) + '\n');
  console.log('\nDone! All abilities saved to pokemon.json');
}

main();
