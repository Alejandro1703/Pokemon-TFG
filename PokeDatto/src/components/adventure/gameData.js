// ==========================================
// CONFIGURACIÓN DE DATOS PARA AVENTURAS
// ==========================================

import { MEDICINA_ITEMS, POKEBALL_ITEMS } from './itemsCatalogData';
import { OBJETOS_ITEMS } from './itemsCatalogData2';
import { COMBATE_ITEMS, BAYA_ITEMS, GEMA_ITEMS, CLAVE_ITEMS, TM_HM_ITEMS } from './itemsCatalogData3';

const ITEM_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

// --- ESTRUCTURA DE BOLSILLOS POR GENERACIÓN ---
export const POCKET_STRUCTURES = {
  gen1_remake: [
    { key: 'objetos', label: 'Objetos', icon: '🎒', color: '#4fc3f7' },
    { key: 'pokeballs', label: 'Poké Balls', icon: '⚪', color: '#ef5350' },
    { key: 'tm_hm', label: 'MT y MO', icon: '💿', color: '#ab47bc' },
    { key: 'bayas', label: 'Bayas', icon: '🍇', color: '#66bb6a' },
    { key: 'objetos_clave', label: 'Objetos Clave', icon: '🔑', color: '#ffa726' },
  ],
  gen2_remake: [
    { key: 'objetos', label: 'Objetos', icon: '🎒', color: '#4fc3f7' },
    { key: 'medicina', label: 'Medicina', icon: '💊', color: '#e91e63' },
    { key: 'pokeballs', label: 'Poké Balls', icon: '⚪', color: '#ef5350' },
    { key: 'tm_hm', label: 'MT y MO', icon: '💿', color: '#ab47bc' },
    { key: 'bayas', label: 'Bayas', icon: '🍇', color: '#66bb6a' },
    { key: 'objetos_combate', label: 'Objetos de Combate', icon: '⚔️', color: '#ff7043' },
    { key: 'objetos_clave', label: 'Objetos Clave', icon: '🔑', color: '#ffa726' },
  ],
  gen3: [
    { key: 'objetos', label: 'Objetos', icon: '🎒', color: '#4fc3f7' },
    { key: 'pokeballs', label: 'Poké Balls', icon: '⚪', color: '#ef5350' },
    { key: 'tm_hm', label: 'MT y MO', icon: '💿', color: '#ab47bc' },
    { key: 'bayas', label: 'Bayas', icon: '🍇', color: '#66bb6a' },
    { key: 'objetos_clave', label: 'Objetos Clave', icon: '🔑', color: '#ffa726' },
  ],
  gen4: [
    { key: 'objetos', label: 'Objetos', icon: '🎒', color: '#4fc3f7' },
    { key: 'medicina', label: 'Medicina', icon: '💊', color: '#e91e63' },
    { key: 'pokeballs', label: 'Poké Balls', icon: '⚪', color: '#ef5350' },
    { key: 'tm_hm', label: 'MT y MO', icon: '💿', color: '#ab47bc' },
    { key: 'bayas', label: 'Bayas', icon: '🍇', color: '#66bb6a' },
    { key: 'objetos_combate', label: 'Objetos de Combate', icon: '⚔️', color: '#ff7043' },
    { key: 'objetos_clave', label: 'Objetos Clave', icon: '🔑', color: '#ffa726' },
  ],
  gen5: [
    { key: 'objetos', label: 'Objetos', icon: '🎒', color: '#4fc3f7' },
    { key: 'medicina', label: 'Medicina', icon: '💊', color: '#e91e63' },
    { key: 'pokeballs', label: 'Poké Balls', icon: '⚪', color: '#ef5350' },
    { key: 'tm_hm', label: 'MT y MO', icon: '💿', color: '#ab47bc' },
    { key: 'bayas', label: 'Bayas', icon: '🍇', color: '#66bb6a' },
    { key: 'objetos_clave', label: 'Objetos Clave', icon: '🔑', color: '#ffa726' },
    { key: 'objetos_libres', label: 'Objetos Libres', icon: '📦', color: '#78909c' },
  ],
};

// --- MAPEO JUEGO → TIPO DE BOLSILLOS ---
export const GAME_TO_POCKET_TYPE = {
  'Rojo Fuego': 'gen1_remake',
  'Verde Hoja': 'gen1_remake',
  'Rubi': 'gen3',
  'Zafiro': 'gen3',
  'Esmeralda': 'gen3',
  'Diamante': 'gen4',
  'Perla': 'gen4',
  'Platino': 'gen4',
  'Oro HeartGold': 'gen2_remake',
  'Plata SoulSilver': 'gen2_remake',
  'Negro': 'gen5',
  'Blanco': 'gen5',
  'Negro 2': 'gen5',
  'Blanco 2': 'gen5',
};

// --- MAPEO JUEGO → REGIÓN ---
export const GAME_TO_REGION = {
  'Rojo Fuego': 'kanto',
  'Verde Hoja': 'kanto',
  'Rubi': 'hoenn',
  'Zafiro': 'hoenn',
  'Esmeralda': 'hoenn',
  'Diamante': 'sinnoh',
  'Perla': 'sinnoh',
  'Platino': 'sinnoh',
  'Oro HeartGold': 'johto',
  'Plata SoulSilver': 'johto',
  'Negro': 'unova',
  'Blanco': 'unova',
  'Negro 2': 'unova',
  'Blanco 2': 'unova',
};

export const REGION_NAMES = {
  kanto: 'Kanto',
  johto: 'Johto',
  hoenn: 'Hoenn',
  sinnoh: 'Sinnoh',
  unova: 'Teselia (Unova)',
};

// --- MAPAS DE REGIÓN (el usuario debe proporcionar las imágenes) ---
export const REGION_MAPS = {
  kanto: '/images/maps/kanto.png',
  johto: '/images/maps/johto.png',
  hoenn: '/images/maps/hoenn.png',
  sinnoh: '/images/maps/sinnoh.png',
  unova: '/images/maps/unova.png',
};

// --- MEDALLAS DE GIMNASIO POR JUEGO ---
export const GYM_BADGES = {
  kanto: [
    { name: 'Medalla Roca', leader: 'Brock', type: 'roca', image: '/images/badges/kanto/boulder.png' },
    { name: 'Medalla Cascada', leader: 'Misty', type: 'agua', image: '/images/badges/kanto/cascade.png' },
    { name: 'Medalla Trueno', leader: 'Lt. Surge', type: 'electrico', image: '/images/badges/kanto/thunder.png' },
    { name: 'Medalla Arcoíris', leader: 'Erika', type: 'planta', image: '/images/badges/kanto/rainbow.png' },
    { name: 'Medalla Alma', leader: 'Koga', type: 'veneno', image: '/images/badges/kanto/soul.png' },
    { name: 'Medalla Pantano', leader: 'Sabrina', type: 'psiquico', image: '/images/badges/kanto/marsh.png' },
    { name: 'Medalla Volcán', leader: 'Blaine', type: 'fuego', image: '/images/badges/kanto/volcano.png' },
    { name: 'Medalla Tierra', leader: 'Giovanni', type: 'tierra', image: '/images/badges/kanto/earth.png' },
  ],
  johto: [
    { name: 'Medalla Céfiro', leader: 'Pegaso', type: 'volador', image: '/images/badges/johto/zephyr.png' },
    { name: 'Medalla Colmena', leader: 'Antón', type: 'bicho', image: '/images/badges/johto/hive.png' },
    { name: 'Medalla Planicie', leader: 'Blanca', type: 'normal', image: '/images/badges/johto/plain.png' },
    { name: 'Medalla Niebla', leader: 'Morti', type: 'fantasma', image: '/images/badges/johto/fog.png' },
    { name: 'Medalla Tormenta', leader: 'Aníbal', type: 'lucha', image: '/images/badges/johto/storm.png' },
    { name: 'Medalla Mineral', leader: 'Yasmina', type: 'acero', image: '/images/badges/johto/mineral.png' },
    { name: 'Medalla Glaciar', leader: 'Fresno', type: 'hielo', image: '/images/badges/johto/glacier.png' },
    { name: 'Medalla Dragón', leader: 'Débora', type: 'dragon', image: '/images/badges/johto/rising.png' },
  ],
  hoenn: [
    { name: 'Medalla Piedra', leader: 'Petra', type: 'roca', image: '/images/badges/hoenn/stone.png' },
    { name: 'Medalla Puño', leader: 'Marcial', type: 'lucha', image: '/images/badges/hoenn/knuckle.png' },
    { name: 'Medalla Dinamo', leader: 'Erico', type: 'electrico', image: '/images/badges/hoenn/dynamo.png' },
    { name: 'Medalla Calor', leader: 'Candela', type: 'fuego', image: '/images/badges/hoenn/heat.png' },
    { name: 'Medalla Equilibrio', leader: 'Norman', type: 'normal', image: '/images/badges/hoenn/balance.png' },
    { name: 'Medalla Pluma', leader: 'Alana', type: 'volador', image: '/images/badges/hoenn/feather.png' },
    { name: 'Medalla Mente', leader: 'Vito y Leti', type: 'psiquico', image: '/images/badges/hoenn/mind.png' },
    { name: 'Medalla Lluvia', leader: 'Juan', type: 'agua', image: '/images/badges/hoenn/rain.png' },
  ],
  sinnoh: [
    { name: 'Medalla Carbón', leader: 'Roco', type: 'roca', image: '/images/badges/sinnoh/coal.png' },
    { name: 'Medalla Bosque', leader: 'Gardenia', type: 'planta', image: '/images/badges/sinnoh/forest.png' },
    { name: 'Medalla Muro', leader: 'Brega', type: 'lucha', image: '/images/badges/sinnoh/cobble.png' },
    { name: 'Medalla Pantano', leader: 'Mananti', type: 'agua', image: '/images/badges/sinnoh/fen.png' },
    { name: 'Medalla Reliquia', leader: 'Fantina', type: 'fantasma', image: '/images/badges/sinnoh/relic.png' },
    { name: 'Medalla Mina', leader: 'Acerón', type: 'acero', image: '/images/badges/sinnoh/mine.png' },
    { name: 'Medalla Témpano', leader: 'Inverna', type: 'hielo', image: '/images/badges/sinnoh/icicle.png' },
    { name: 'Medalla Faro', leader: 'Lectro', type: 'electrico', image: '/images/badges/sinnoh/beacon.png' },
  ],
  unova_bw: [
    { name: 'Medalla Trío', leader: 'Cilan/Zeo/Maíz', type: 'planta', image: '/images/badges/unova/trio.png' },
    { name: 'Medalla Básica', leader: 'Aloe', type: 'normal', image: '/images/badges/unova/basic.png' },
    { name: 'Medalla Insecto', leader: 'Camus', type: 'bicho', image: '/images/badges/unova/insect.png' },
    { name: 'Medalla Voltio', leader: 'Camila', type: 'electrico', image: '/images/badges/unova/bolt.png' },
    { name: 'Medalla Temblor', leader: 'Yakón', type: 'tierra', image: '/images/badges/unova/quake.png' },
    { name: 'Medalla Avión', leader: 'Gerania', type: 'volador', image: '/images/badges/unova/jet.png' },
    { name: 'Medalla Carámbano', leader: 'Junco', type: 'hielo', image: '/images/badges/unova/freeze.png' },
    { name: 'Medalla Leyenda', leader: 'Lirio', type: 'dragon', image: '/images/badges/unova/legend.png' },
  ],
  unova_b2w2: [
    { name: 'Medalla Básica', leader: 'Cheren', type: 'normal', image: '/images/badges/unova/basic_b2w2.png' },
    { name: 'Medalla Tóxico', leader: 'Hiedra', type: 'veneno', image: '/images/badges/unova/toxic.png' },
    { name: 'Medalla Insecto', leader: 'Camus', type: 'bicho', image: '/images/badges/unova/insect.png' },
    { name: 'Medalla Voltio', leader: 'Camila', type: 'electrico', image: '/images/badges/unova/bolt.png' },
    { name: 'Medalla Temblor', leader: 'Yakón', type: 'tierra', image: '/images/badges/unova/quake.png' },
    { name: 'Medalla Avión', leader: 'Gerania', type: 'volador', image: '/images/badges/unova/jet.png' },
    { name: 'Medalla Leyenda', leader: 'Lirio', type: 'dragon', image: '/images/badges/unova/legend.png' },
    { name: 'Medalla Ola', leader: 'Ciprián', type: 'agua', image: '/images/badges/unova/wave.png' },
  ],
};

// Mapeo juego → set de medallas
export const GAME_TO_BADGES = {
  'Rojo Fuego': 'kanto',
  'Verde Hoja': 'kanto',
  'Rubi': 'hoenn',
  'Zafiro': 'hoenn',
  'Esmeralda': 'hoenn',
  'Diamante': 'sinnoh',
  'Perla': 'sinnoh',
  'Platino': 'sinnoh',
  'Oro HeartGold': 'johto',
  'Plata SoulSilver': 'johto',
  'Negro': 'unova_bw',
  'Blanco': 'unova_bw',
  'Negro 2': 'unova_b2w2',
  'Blanco 2': 'unova_b2w2',
};

// --- CATÁLOGO COMPLETO DE OBJETOS (Gen 1-5) ---
// Cada item: { id, name, sprite, pocket, gens: [1-5], effect }
export const ITEMS_CATALOG = [
  ...MEDICINA_ITEMS,
  ...POKEBALL_ITEMS,
  ...OBJETOS_ITEMS,
  ...COMBATE_ITEMS,
  ...BAYA_ITEMS,
  ...GEMA_ITEMS,
  ...CLAVE_ITEMS,
  ...TM_HM_ITEMS,
];

// Helper: Obtener URL del sprite de un item
export const getItemSpriteUrl = (spriteName) => {
  return `${ITEM_SPRITE_BASE}/${spriteName}.png`;
};

// Helper: Obtener la estructura de bolsillos para un juego concreto
export const getPocketsForGame = (gameName) => {
  const pocketType = GAME_TO_POCKET_TYPE[gameName];
  return POCKET_STRUCTURES[pocketType] || POCKET_STRUCTURES.gen3;
};

// Helper: Obtener las medallas para un juego concreto
export const getBadgesForGame = (gameName) => {
  const badgeSet = GAME_TO_BADGES[gameName];
  return GYM_BADGES[badgeSet] || [];
};

// Helper: Obtener la región para un juego concreto
export const getRegionForGame = (gameName) => {
  const regionKey = GAME_TO_REGION[gameName];
  return {
    key: regionKey,
    name: REGION_NAMES[regionKey] || regionKey,
    mapUrl: REGION_MAPS[regionKey],
  };
};

// Helper: Filtrar items del catálogo por bolsillo
export const getItemsByPocket = (pocketKey) => {
  // Para gen 1 remakes, medicina va dentro de "objetos"
  if (pocketKey === 'objetos') {
    return ITEMS_CATALOG.filter(i => i.pocket === 'objetos');
  }
  return ITEMS_CATALOG.filter(i => i.pocket === pocketKey);
};

// Helper: Obtener generación numérica de un juego
export const getGameGenNumber = (gameName) => {
  const genMap = {
    'Rojo Fuego': 1, 'Verde Hoja': 1,
    'Oro HeartGold': 2, 'Plata SoulSilver': 2,
    'Rubi': 3, 'Zafiro': 3, 'Esmeralda': 3,
    'Diamante': 4, 'Perla': 4, 'Platino': 4,
    'Negro': 5, 'Blanco': 5, 'Negro 2': 5, 'Blanco 2': 5,
  };
  return genMap[gameName] || 3;
};
