// Script to generate static Pokemon JSON data from PokeAPI
// Run: node scripts/generate-pokemon-json.mjs

const TOTAL = 649;
const BATCH_SIZE = 50;

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    types: data.types.map(t => t.type.name),
    stats: {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      specialAttack: data.stats[3].base_stat,
      specialDefense: data.stats[4].base_stat,
      speed: data.stats[5].base_stat
    },
    height: data.height,
    weight: data.weight
  };
}

async function main() {
  const allPokemon = [];
  
  for (let start = 1; start <= TOTAL; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE - 1, TOTAL);
    const batch = [];
    for (let i = start; i <= end; i++) {
      batch.push(fetchPokemon(i));
    }
    const results = await Promise.all(batch);
    results.forEach(p => { if (p) allPokemon.push(p); });
    console.log(`Fetched ${allPokemon.length}/${TOTAL}`);
  }

  const fs = await import('fs');
  const path = await import('path');
  const outPath = path.resolve('src/data/pokemonData.json');
  fs.writeFileSync(outPath, JSON.stringify(allPokemon));
  console.log(`Written ${allPokemon.length} Pokemon to ${outPath}`);
}

main().catch(console.error);
