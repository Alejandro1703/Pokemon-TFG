// Datos extra para Líderes de Gimnasio
// Movimientos traducidos, tipos de Pokémon, URLs de medallas e items

import rawData from './gymExtraData.json';

// ===== MOVIMIENTOS =====
export const MOVE_DATA = {
  ...rawData.moves,
  'feint-attack': { names: { es: 'Finta', en: 'Feint Attack' }, type: 'dark' },
  'smokescreen': { names: { es: 'Pantalla de Humo', en: 'Smokescreen' }, type: 'normal' },
};

// ===== TIPOS DE POKÉMON =====
export const POKEMON_TYPES = {
  ...rawData.pokemonTypes,
  'Mr. Mime': ['psychic', 'fairy'],
  'Farfetch\'d': ['normal', 'flying'],
};

// ===== MEDALLAS (badge URLs) =====
export const BADGE_IMAGES = {
  // Kanto
  'Boulder Badge': 'https://archives.bulbagarden.net/media/upload/d/dd/Boulder_Badge.png',
  'Cascade Badge': 'https://archives.bulbagarden.net/media/upload/9/9c/Cascade_Badge.png',
  'Thunder Badge': 'https://archives.bulbagarden.net/media/upload/a/a6/Thunder_Badge.png',
  'Rainbow Badge': 'https://archives.bulbagarden.net/media/upload/b/b5/Rainbow_Badge.png',
  'Soul Badge': 'https://archives.bulbagarden.net/media/upload/7/7d/Soul_Badge.png',
  'Marsh Badge': 'https://archives.bulbagarden.net/media/upload/6/6b/Marsh_Badge.png',
  'Volcano Badge': 'https://archives.bulbagarden.net/media/upload/1/12/Volcano_Badge.png',
  'Earth Badge': 'https://archives.bulbagarden.net/media/upload/7/78/Earth_Badge.png',
  // Johto
  'Zephyr Badge': 'https://archives.bulbagarden.net/media/upload/4/4a/Zephyr_Badge.png',
  'Hive Badge': 'https://archives.bulbagarden.net/media/upload/0/08/Hive_Badge.png',
  'Plain Badge': 'https://archives.bulbagarden.net/media/upload/a/a7/Plain_Badge.png',
  'Fog Badge': 'https://archives.bulbagarden.net/media/upload/4/48/Fog_Badge.png',
  'Storm Badge': 'https://archives.bulbagarden.net/media/upload/b/b9/Storm_Badge.png',
  'Mineral Badge': 'https://archives.bulbagarden.net/media/upload/7/7b/Mineral_Badge.png',
  'Glacier Badge': 'https://archives.bulbagarden.net/media/upload/e/e6/Glacier_Badge.png',
  'Rising Badge': 'https://archives.bulbagarden.net/media/upload/5/58/Rising_Badge.png',
  // Hoenn
  'Stone Badge': 'https://archives.bulbagarden.net/media/upload/6/63/Stone_Badge.png',
  'Knuckle Badge': 'https://archives.bulbagarden.net/media/upload/9/97/Knuckle_Badge.png',
  'Dynamo Badge': 'https://archives.bulbagarden.net/media/upload/3/34/Dynamo_Badge.png',
  'Heat Badge': 'https://archives.bulbagarden.net/media/upload/c/c4/Heat_Badge.png',
  'Balance Badge': 'https://archives.bulbagarden.net/media/upload/6/63/Balance_Badge.png',
  'Feather Badge': 'https://archives.bulbagarden.net/media/upload/6/62/Feather_Badge.png',
  'Mind Badge': 'https://archives.bulbagarden.net/media/upload/c/cc/Mind_Badge.png',
  'Rain Badge': 'https://archives.bulbagarden.net/media/upload/9/9b/Rain_Badge.png',
  // Sinnoh
  'Coal Badge': 'https://archives.bulbagarden.net/media/upload/0/0b/Coal_Badge.png',
  'Forest Badge': 'https://archives.bulbagarden.net/media/upload/8/8c/Forest_Badge.png',
  'Cobble Badge': 'https://archives.bulbagarden.net/media/upload/2/27/Cobble_Badge.png',
  'Fen Badge': 'https://archives.bulbagarden.net/media/upload/1/13/Fen_Badge.png',
  'Relic Badge': 'https://archives.bulbagarden.net/media/upload/2/28/Relic_Badge.png',
  'Mine Badge': 'https://archives.bulbagarden.net/media/upload/f/fe/Mine_Badge.png',
  'Icicle Badge': 'https://archives.bulbagarden.net/media/upload/0/09/Icicle_Badge.png',
  'Beacon Badge': 'https://archives.bulbagarden.net/media/upload/0/0c/Beacon_Badge.png',
  // Unova
  'Trio Badge': 'https://archives.bulbagarden.net/media/upload/7/74/Trio_Badge.png',
  'Basic Badge': 'https://archives.bulbagarden.net/media/upload/8/85/Basic_Badge.png',
  'Insect Badge': 'https://archives.bulbagarden.net/media/upload/8/8a/Insect_Badge.png',
  'Bolt Badge': 'https://archives.bulbagarden.net/media/upload/5/5b/Bolt_Badge.png',
  'Quake Badge': 'https://archives.bulbagarden.net/media/upload/2/29/Quake_Badge.png',
  'Jet Badge': 'https://archives.bulbagarden.net/media/upload/9/9c/Jet_Badge.png',
  'Freeze Badge': 'https://archives.bulbagarden.net/media/upload/a/ac/Freeze_Badge.png',
  'Legend Badge': 'https://archives.bulbagarden.net/media/upload/c/c0/Legend_Badge.png',
};

// ===== SPRITES DE ITEMS =====
export const ITEM_SPRITES = {
  'Potion': 'potion',
  'Hyper Potion': 'hyper-potion',
  'Sitrus Berry': 'sitrus-berry',
  'Lum Berry': 'lum-berry',
  'White Herb': 'white-herb',
  'Cheri Berry': 'cheri-berry',
  'Chesto Berry': 'chesto-berry',
};

export function getItemSpriteUrl(itemName) {
  const key = ITEM_SPRITES[itemName];
  if (!key) return null;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${key}.png`;
}

export function getMoveTranslation(moveName, language = 'es') {
  const key = moveName.toLowerCase().replace(/\s/g, '-').replace(/\./g, '');
  const data = MOVE_DATA[key];
  if (!data) return moveName;
  return data.names[language] || data.names.en || moveName;
}

export function getMoveType(moveName) {
  const key = moveName.toLowerCase().replace(/\s/g, '-').replace(/\./g, '');
  const data = MOVE_DATA[key];
  return data?.type || 'normal';
}

export function getPokemonTypes(pokemonName) {
  return POKEMON_TYPES[pokemonName] || ['normal'];
}

export function getBadgeImage(badgeNameEn) {
  return BADGE_IMAGES[badgeNameEn] || null;
}
