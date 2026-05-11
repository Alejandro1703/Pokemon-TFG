// Liga Pokémon - Elite Four + Campeones (Gen 1-5)
// Basado en remakes: FRLG, HGSS, RSE, DPPt, BW

export const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

export const TYPE_NAMES_ES = {
  normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico',
  grass: 'Planta', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
  ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
  rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
  steel: 'Acero', fairy: 'Hada',
};

export const TYPE_NAMES_EN = {
  normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric',
  grass: 'Grass', ice: 'Ice', fighting: 'Fighting', poison: 'Poison',
  ground: 'Ground', flying: 'Flying', psychic: 'Psychic', bug: 'Bug',
  rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon', dark: 'Dark',
  steel: 'Steel', fairy: 'Fairy',
};

const POKEMON_IDS = {
  'Dewgong': 87, 'Cloyster': 91, 'Slowbro': 80, 'Jynx': 124, 'Lapras': 131,
  'Onix': 95, 'Hitmonchan': 107, 'Hitmonlee': 106, 'Machamp': 68, 'Golem': 76,
  'Gengar': 94, 'Golbat': 42, 'Haunter': 93, 'Arbok': 24, 'Vileplume': 45,
  'Gyarados': 130, 'Dragonair': 148, 'Aerodactyl': 142, 'Dragonite': 149, 'Charizard': 6,
  'Pidgeot': 18, 'Alakazam': 65, 'Rhydon': 112, 'Exeggutor': 103, 'Tauros': 128,
  'Arcanine': 59, 'Venusaur': 3, 'Blastoise': 9,
  'Xatu': 178, 'Grumpig': 326, 'Starmie': 121, 'Gardevoir': 282, 'Bronzong': 437,
  'Skuntank': 435, 'Toxicroak': 454, 'Swalot': 317, 'Venomoth': 49, 'Crobat': 169,
  'Steelix': 208, 'Lucario': 448,
  'Umbreon': 197, 'Houndoom': 229, 'Murkrow': 198, 'Honchkrow': 430, 'Weavile': 461,
  'Piloswine': 221, 'Glalie': 362, 'Sealeo': 364, 'Froslass': 478, 'Mamoswine': 473,
  'Altaria': 334, 'Flygon': 330, 'Kingdra': 230, 'Shelgon': 372, 'Salamence': 373,
  'Drapion': 452, 'Vespiquen': 416, 'Heracross': 214, 'Spiritomb': 442,
  'Whiscash': 340, 'Gliscor': 472, 'Hippowdon': 450, 'Rhyperior': 464,
  'Rapidash': 78, 'Drifblim': 426, 'Lopunny': 428, 'Infernape': 392,
  'Mr. Mime': 122, 'Girafarig': 203, 'Medicham': 308,
  'Cofagrigus': 563, 'Jellicent': 593, 'Golurk': 623, 'Chandelure': 609,
  'Conkeldurr': 534, 'Mienshao': 620, 'Sawk': 539, 'Throh': 538,
  'Liepard': 510, 'Krookodile': 553, 'Scrafty': 560, 'Bisharp': 625,
  'Reuniclus': 579, 'Sigilyph': 561, 'Gothitelle': 576,
  'Dusclops': 356, 'Banette': 354, 'Walrein': 365, 'Claydol': 344, 'Cradily': 346, 'Armaldo': 348, 'Metagross': 376,
  'Skarmory': 227, 'Yanmega': 469, 'Scizor': 212, 'Espeon': 196, 'Gallade': 475,
  'Flareon': 136, 'Magmortar': 467,
  'Escavalier': 589, 'Musharna': 518, 'Hitmontop': 237,
  'Accelgor': 617, 'Bouffalant': 626, 'Druddigon': 621, 'Braviary': 628, 'Volcarona': 637,
  'Hydreigon': 635, 'Aggron': 306, 'Garchomp': 445, 'Milotic': 350,
  'Roserade': 407, 'Togekiss': 468,
  'Wailord': 321, 'Tentacruel': 73, 'Ludicolo': 272,
  'Shiftry': 275, 'Cacturne': 332, 'Sharpedo': 319, 'Mightyena': 262, 'Absol': 359,
};

function getId(name) {
  return POKEMON_IDS[name] || 0;
}

export function getLeaguePokemonSprite(name) {
  const id = getId(name);
  if (!id) return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png`;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

// Helper para tips: retorna una función que reemplaza {{name}} según idioma
function t(es, en) {
  return (nameEs, nameEn) => ({
    es: es.map(s => s.replace(/\{\{name\}\}/g, nameEs)),
    en: en.map(s => s.replace(/\{\{name\}\}/g, nameEn)),
  });
}

// === KANTO (FRLG - Gen 3) ===
const KANTO_E4 = [
  {
    id: 'lorelei', name: 'Lorelei', name_es: 'Lorelei',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'ice', gen: 3, gameVersion: 'firered-leafgreen',
    image: '/images/leaders/Lorelei.png',
    team: [
      { name: 'Dewgong', level: 52, moves: ['Surf', 'Ice Beam', 'Aurora Beam', 'Rest'], item: null },
      { name: 'Cloyster', level: 51, moves: ['Ice Beam', 'Spike Cannon', 'Dive', 'Protect'], item: null },
      { name: 'Slowbro', level: 52, moves: ['Ice Beam', 'Surf', 'Psychic', 'Amnesia'], item: null },
      { name: 'Jynx', level: 54, moves: ['Ice Beam', 'Psychic', 'Lovely Kiss', 'Body Slam'], item: null },
      { name: 'Lapras', level: 54, moves: ['Ice Beam', 'Surf', 'Thunderbolt', 'Body Slam'], item: null },
    ],
    tips: t(
      ['Estrategia: Usa Pokémon de tipo Eléctrico o Lucha. El Agua/Hielo es débil a ambos.', 'Captura Clave: un Jolteon o Electabuzz. Sus ataques eléctricos derrotan a Dewgong y Lapras rápidamente.', 'Cuidado con Jynx: tiene Alta Defensa Especial. Usa ataques físicos como Shadow Ball.'],
      ['Strategy: Use Electric or Fighting type Pokémon. Water/Ice is weak to both.', 'Key Catch: a Jolteon or Electabuzz. Their electric attacks defeat Dewgong and Lapras quickly.', 'Watch out for Jynx: it has high Special Defense. Use physical attacks like Shadow Ball.']
    ),
  },
  {
    id: 'bruno', name: 'Bruno', name_es: 'Bruno',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'fighting', gen: 3, gameVersion: 'firered-leafgreen',
    image: '/images/leaders/bruno.png',
    team: [
      { name: 'Onix', level: 51, moves: ['Rock Tomb', 'Iron Tail', 'Earthquake', 'Roar'], item: null },
      { name: 'Hitmonchan', level: 53, moves: ['Sky Uppercut', 'Mach Punch', 'Rock Tomb', 'Counter'], item: null },
      { name: 'Hitmonlee', level: 53, moves: ['Mega Kick', 'Brick Break', 'Foresight', 'Facade'], item: null },
      { name: 'Onix', level: 54, moves: ['Double-Edge', 'Iron Tail', 'Earthquake', 'Sand Tomb'], item: null },
      { name: 'Machamp', level: 56, moves: ['Cross Chop', 'Rock Tomb', 'Facade', 'Bulk Up'], item: null },
    ],
    tips: t(
      ['Estrategia: Los Pokémon de tipo Volador o Psíquico son efectivos contra Lucha. Steelix cae con Agua o Fuego.', 'Captura Clave: un Alakazam o Gengar para los tipos Lucha. Un Gyarados o Vaporeon para Steelix.', 'Machamp pega muy fuerte. Prioriza velocidad para golpear primero.'],
      ['Strategy: Flying or Psychic types are effective against Fighting. Steelix falls to Water or Fire.', 'Key Catch: an Alakazam or Gengar for Fighting types. A Gyarados or Vaporeon for Steelix.', 'Machamp hits very hard. Prioritize speed to strike first.']
    ),
  },
  {
    id: 'agatha', name: 'Agatha', name_es: 'Agatha',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'ghost', gen: 3, gameVersion: 'firered-leafgreen',
    image: '/images/leaders/Agatha.png',
    team: [
      { name: 'Gengar', level: 54, moves: ['Shadow Ball', 'Hypnosis', 'Dream Eater', 'Thunderbolt'], item: null },
      { name: 'Golbat', level: 54, moves: ['Air Cutter', 'Confuse Ray', 'Bite', 'Poison Fang'], item: null },
      { name: 'Haunter', level: 53, moves: ['Shadow Ball', 'Hypnosis', 'Dream Eater', 'Psychic'], item: null },
      { name: 'Arbok', level: 56, moves: ['Sludge Bomb', 'Earthquake', 'Bite', 'Iron Tail'], item: null },
      { name: 'Gengar', level: 58, moves: ['Shadow Ball', 'Hypnosis', 'Dream Eater', 'Destiny Bond'], item: null },
    ],
    tips: t(
      ['Estrategia: Los Fantasma son inmunes a Normal y Lucha. Usa Siniestro o tus propios Fantasma.', 'Captura Clave: un Persian con Bite o un Gyarados con Bite. Golbat cae con Hielo o Eléctrico.', 'Cuidado con Gengar: es rápido y usa Hypnosis + Dream Eater. Lleva Awakening/Baya Mentha.'],
      ['Strategy: Ghost types are immune to Normal and Fighting. Use Dark or your own Ghost types.', 'Key Catch: a Persian with Bite or a Gyarados with Bite. Golbat falls to Ice or Electric.', 'Watch out for Gengar: it is fast and uses Hypnosis + Dream Eater. Bring Awakening/Chesto Berry.']
    ),
  },
  {
    id: 'lance', name: 'Lance', name_es: 'Lance',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'dragon', gen: 3, gameVersion: 'firered-leafgreen',
    image: '/images/leaders/Lance.png',
    team: [
      { name: 'Gyarados', level: 56, moves: ['Hyper Beam', 'Dragon Rage', 'Bite', 'Twister'], item: null },
      { name: 'Dragonair', level: 54, moves: ['Hyper Beam', 'Safeguard', 'Outrage', 'Thunder Wave'], item: null },
      { name: 'Dragonair', level: 54, moves: ['Hyper Beam', 'Safeguard', 'Outrage', 'Ice Beam'], item: null },
      { name: 'Aerodactyl', level: 58, moves: ['Hyper Beam', 'Rock Slide', 'Wing Attack', 'Earthquake'], item: null },
      { name: 'Dragonite', level: 60, moves: ['Hyper Beam', 'Outrage', 'Wing Attack', 'Flamethrower'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Los Dragon son débiles a Hielo y Dragon. Los Pokémon de {{name}} tienen debilidad al Hielo excepto Aerodactyl (Roca).', 'Captura Clave: un Lapras con Ice Beam o un Cloyster con Ice Beam/Ice Shard. Destruye al Dragonite de {{name}}.', 'Aerodactyl es rápido y frágil. Un ataque de Agua o Eléctrico lo derrota fácilmente.', 'El Dragonite de {{name}} tiene alta defensa. Gólpéalo fuerte de una vez.'],
      ['Strategy: Dragons are weak to Ice and Dragon. All of {{name}}\'s Pokémon have Ice weakness except Aerodactyl (Rock).', 'Key Catch: a Lapras with Ice Beam or a Cloyster with Ice Beam/Ice Shard. Destroys {{name}}\'s Dragonite.', 'Aerodactyl is fast and fragile. A Water or Electric attack defeats it easily.', '{{name}}\'s Dragonite has high defense. Hit it hard in one go.']
    ),
  },
];

const KANTO_CHAMPION = {
  id: 'blue', name: 'Blue', name_es: 'Azul',
  role: { es: 'Campeón', en: 'Champion' },
  type: 'normal', gen: 3, gameVersion: 'firered-leafgreen',
  image: '/images/leaders/Azul.png',
  note: { es: 'Equipo variable según tu inicial', en: 'Team varies based on your starter' },
  team: [
    { name: 'Pidgeot', level: 59, moves: ['Aerial Ace', 'Feather Dance', 'Whirlwind', 'Steel Wing'], item: null },
    { name: 'Alakazam', level: 57, moves: ['Psychic', 'Shadow Ball', 'Reflect', 'Recover'], item: null },
    { name: 'Rhydon', level: 59, moves: ['Rock Slide', 'Earthquake', 'Take Down', 'Scary Face'], item: null },
    { name: 'Exeggutor', level: 59, moves: ['Giga Drain', 'Psychic', 'Sleep Powder', 'Light Screen'], item: null },
    { name: 'Gyarados', level: 61, moves: ['Hydro Pump', 'Dragon Rage', 'Bite', 'Thrash'], item: null },
    { name: 'Charizard', level: 63, moves: ['Flamethrower', 'Wing Attack', 'Slash', 'Fire Blast'], item: 'Sitrus Berry' },
  ],
  tips: t(
    ['Estrategia: Su equipo es variado. Lleva cobertura de tipo Fuego, Agua, Planta, Hielo y Eléctrico.', 'Pidgeot cae con Hielo o Eléctrico. Alakazam cae con Siniestro o Bicho. Exeggutor cae con Hielo o Bicho.', 'Gyarados tiene Intimidate. Envía un Pokémon especial (no físico) primero.', 'Charizard es su más fuerte. Un ataque de Agua o Roca lo derrota. Cuidado con Fire Blast.'],
    ['Strategy: His team is varied. Bring coverage of Fire, Water, Grass, Ice, and Electric types.', 'Pidgeot falls to Ice or Electric. Alakazam falls to Dark or Bug. Exeggutor falls to Ice or Bug.', 'Gyarados has Intimidate. Send a special attacker (not physical) first.', 'Charizard is his strongest. A Water or Rock attack defeats it. Watch out for Fire Blast.']
  ),
};

// === JOHTO (HGSS - Gen 4) ===
const JOHTO_E4 = [
  {
    id: 'will', name: 'Will', name_es: 'Mento',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'psychic', gen: 4, gameVersion: 'heartgold-soulsilver',
    image: '/images/leaders/Mento.png',
    team: [
      { name: 'Xatu', level: 40, moves: ['Psychic', 'Confuse Ray', 'Aerial Ace', 'U-turn'], item: null },
      { name: 'Jynx', level: 41, moves: ['Psychic', 'Lovely Kiss', 'Blizzard', 'Double Slap'], item: null },
      { name: 'Exeggutor', level: 41, moves: ['Psychic', 'Egg Bomb', 'Reflect', 'Hypnosis'], item: null },
      { name: 'Slowbro', level: 41, moves: ['Psychic', 'Amnesia', 'Surf', 'Yawn'], item: null },
      { name: 'Xatu', level: 42, moves: ['Psychic', 'Aerial Ace', 'Ominous Wind', 'Calm Mind'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Todos sus Pokémon son Psíquico (excepto Jynx que es Hielo/Psíquico). Siniestro, Bicho y Fantasma son efectivos.', 'Captura Clave: un Houndoom con Bite/Faint Attack o un Tyranitar. Destruye todo su equipo.', 'Xatu tiene Flying/Psychic. Un ataque de Hielo o Eléctrico funciona bien.'],
      ['Strategy: All his Pokémon are Psychic (except Jynx which is Ice/Psychic). Dark, Bug and Ghost are effective.', 'Key Catch: a Houndoom with Bite/Faint Attack or a Tyranitar. Destroys his entire team.', 'Xatu is Flying/Psychic. An Ice or Electric attack works well.']
    ),
  },
  {
    id: 'koga-e4', name: 'Koga', name_es: 'Koga',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'poison', gen: 4, gameVersion: 'heartgold-soulsilver',
    image: '/images/leaders/Koga.png',
    team: [
      { name: 'Skuntank', level: 40, moves: ['Poison Jab', 'Night Slash', 'Dig', 'Flamethrower'], item: null },
      { name: 'Toxicroak', level: 40, moves: ['Poison Jab', 'Brick Break', 'Sucker Punch', 'X-Scissor'], item: null },
      { name: 'Swalot', level: 42, moves: ['Sludge Bomb', 'Amnesia', 'Yawn', 'Body Slam'], item: null },
      { name: 'Venomoth', level: 41, moves: ['Bug Buzz', 'Psychic', 'Sludge Bomb', 'Double Team'], item: null },
      { name: 'Crobat', level: 43, moves: ['Cross Poison', 'Fly', 'Toxic', 'Double Team'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Veneno es débil a Tierra y Psíquico. Crobat es Veneno/Volador: usa Hielo o Eléctrico.', 'Captura Clave: un Espeon o Alakazam con Psíquico. Un Golem o Rhydon con Earthquake.', 'Cuidado con Toxic + veneno residual. Lleva Antídotos o Restaura Total.'],
      ['Strategy: Poison is weak to Ground and Psychic. Crobat is Poison/Flying: use Ice or Electric.', 'Key Catch: an Espeon or Alakazam with Psychic. A Golem or Rhydon with Earthquake.', 'Watch out for Toxic + poison damage. Bring Antidotes or Full Restores.']
    ),
  },
  {
    id: 'bruno-e4', name: 'Bruno', name_es: 'Bruno',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'fighting', gen: 4, gameVersion: 'heartgold-soulsilver',
    image: '/images/leaders/bruno.png',
    team: [
      { name: 'Hitmontop', level: 42, moves: ['Close Combat', 'Triple Kick', 'Dig', 'Quick Attack'], item: null },
      { name: 'Hitmonlee', level: 42, moves: ['Hi Jump Kick', 'Blaze Kick', 'Reversal', 'Bulk Up'], item: null },
      { name: 'Hitmonchan', level: 42, moves: ['Mach Punch', 'Ice Punch', 'Thunder Punch', 'Fire Punch'], item: null },
      { name: 'Onix', level: 43, moves: ['Earthquake', 'Iron Tail', 'Rock Slide', 'Sand Tomb'], item: null },
      { name: 'Machamp', level: 46, moves: ['Cross Chop', 'Rock Slide', 'Revenge', 'Foresight'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Lucha es débil a Volador y Psíquico. Onix es Roca/Tierra: usa Agua o Planta.', 'Captura Clave: un Espeon o Xatu con Psíquico. Un Gyarados o Vaporeon para Onix.', 'Machamp tiene No Guard (en HGSS): sus ataques nunca fallan, pero los tuyos tampoco.'],
      ['Strategy: Fighting is weak to Flying and Psychic. Onix is Rock/Ground: use Water or Grass.', 'Key Catch: an Espeon or Xatu with Psychic. A Gyarados or Vaporeon for Onix.', 'Machamp has No Guard (in HGSS): its attacks never miss, but yours against it neither.']
    ),
  },
  {
    id: 'karen', name: 'Karen', name_es: 'Karen',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'dark', gen: 4, gameVersion: 'heartgold-soulsilver',
    image: '/images/leaders/Karen.png',
    team: [
      { name: 'Umbreon', level: 42, moves: ['Dark Pulse', 'Confuse Ray', 'Shadow Ball', 'Psychic'], item: null },
      { name: 'Houndoom', level: 45, moves: ['Dark Pulse', 'Flamethrower', 'Crunch', 'Will-O-Wisp'], item: null },
      { name: 'Murkrow', level: 44, moves: ['Dark Pulse', 'Wing Attack', 'Whirlwind', 'Psychic'], item: null },
      { name: 'Honchkrow', level: 47, moves: ['Dark Pulse', 'Drill Peck', 'Sucker Punch', 'Psychic'], item: null },
      { name: 'Weavile', level: 47, moves: ['Ice Punch', 'Dark Pulse', 'Shadow Ball', 'Slash'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Siniestro es débil a Lucha y Bicho. Houndoom es Fuego/Siniestro: usa Agua, Tierra o Lucha.', 'Captura Clave: un Heracross con Megahorn/Close Combat. Un Machamp con Cross Chop.', 'Umbreon es muy defensivo. Usa ataques de Lucha o Bicho, no Fantasma (inmune).'],
      ['Strategy: Dark is weak to Fighting and Bug. Houndoom is Fire/Dark: use Water, Ground or Fighting.', 'Key Catch: a Heracross with Megahorn/Close Combat. A Machamp with Cross Chop.', 'Umbreon is very defensive. Use Fighting or Bug attacks, not Ghost (immune).']
    ),
  },
];

const JOHTO_CHAMPION = {
  id: 'lance-champion', name: 'Lance', name_es: 'Lance',
  role: { es: 'Campeón', en: 'Champion' },
  type: 'dragon', gen: 4, gameVersion: 'heartgold-soulsilver',
  image: '/images/leaders/Lance_C.png',
  team: [
    { name: 'Gyarados', level: 46, moves: ['Waterfall', 'Ice Fang', 'Thunder Wave', 'Dragon Dance'], item: null },
    { name: 'Dragonite', level: 49, moves: ['Dragon Rush', 'Thunder', 'Safeguard', 'Hyper Beam'], item: null },
    { name: 'Aerodactyl', level: 48, moves: ['Rock Slide', 'Aerial Ace', 'Crunch', 'Thunder Fang'], item: null },
    { name: 'Kingdra', level: 49, moves: ['Surf', 'Ice Beam', 'Dragon Pulse', 'Smoke Screen'], item: null },
    { name: 'Charizard', level: 48, moves: ['Flamethrower', 'Wing Attack', 'Slash', 'Dragon Claw'], item: null },
    { name: 'Dragonite', level: 50, moves: ['Outrage', 'Fire Punch', 'Thunder Punch', 'Hyper Beam'], item: 'Sitrus Berry' },
  ],
  tips: t(
    ['Estrategia: Varios Dragonites. Hielo es súper efectivo x4 contra Dragon/Volador.', 'Captura Clave: un Piloswine o Mamoswine con Ice Shard (prioridad) para derribar Dragonites.', 'Kingdra es Agua/Dragón: solo débil a Dragón. Usa tu propio Dragonite o Outrage.', 'Gyarados tiene Intimidate. Usa ataques especiales contra él.'],
    ['Strategy: Multiple Dragonites. Ice is super effective x4 against Dragon/Flying.', 'Key Catch: a Piloswine or Mamoswine with Ice Shard (priority) to take down Dragonites.', 'Kingdra is Water/Dragon: only weak to Dragon. Use your own Dragonite or Outrage.', 'Gyarados has Intimidate. Use special attacks against it.']
  ),
};

// === HOENN (Emerald - Gen 3) ===
const HOENN_E4 = [
  {
    id: 'sidney', name: 'Sidney', name_es: 'Sixto',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'dark', gen: 3, gameVersion: 'emerald',
    image: '/images/leaders/Sixto.png',
    team: [
      { name: 'Mightyena', level: 46, moves: ['Crunch', 'Take Down', 'Howl', 'Roar'], item: null },
      { name: 'Shiftry', level: 48, moves: ['Extrasensory', 'Double Team', 'Swagger', 'Fake Out'], item: null },
      { name: 'Cacturne', level: 46, moves: ['Needle Arm', 'Faint Attack', 'Spikes', 'Ingrain'], item: null },
      { name: 'Sharpedo', level: 48, moves: ['Crunch', 'Slash', 'Taunt', 'Surf'], item: null },
      { name: 'Absol', level: 49, moves: ['Slash', 'Swords Dance', 'Aerial Ace', 'Snatch'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Siniestro es débil a Lucha y Bicho. Absol tiene alta defensa física; usa ataques especiales.', 'Captura Clave: un Breloom con Mach Punch o un Heracross con Brick Break.', 'Sharpedo es rápido pero frágil. Un ataque de Lucha o Eléctrico lo derrota fácilmente.'],
      ['Strategy: Dark is weak to Fighting and Bug. Absol has high physical defense; use special attacks.', 'Key Catch: a Breloom with Mach Punch or a Heracross with Brick Break.', 'Sharpedo is fast but fragile. A Fighting or Electric attack defeats it easily.']
    ),
  },
  {
    id: 'phoebe', name: 'Phoebe', name_es: 'Fátima',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'ghost', gen: 3, gameVersion: 'emerald',
    image: '/images/leaders/Fatima.png',
    team: [
      { name: 'Dusclops', level: 48, moves: ['Shadow Punch', 'Confuse Ray', 'Curse', 'Will-O-Wisp'], item: null },
      { name: 'Dusclops', level: 49, moves: ['Shadow Punch', 'Curse', 'Will-O-Wisp', 'Protect'], item: null },
      { name: 'Banette', level: 49, moves: ['Shadow Ball', 'Grudge', 'Will-O-Wisp', 'Faint Attack'], item: null },
      { name: 'Banette', level: 50, moves: ['Shadow Ball', 'Thunderbolt', 'Will-O-Wisp', 'Skill Swap'], item: null },
      { name: 'Dusclops', level: 51, moves: ['Shadow Punch', 'Earthquake', 'Curse', 'Protect'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Fantasma es débil a Siniestro y Fantasma. Dusclops es muy defensivo; usa Siniestro.', 'Captura Clave: un Mightyena con Bite o un Absol con Bite/Night Slash. Destruye a Dusclops.', 'Cuidado con Destiny Bond de Gengar. No lo debilites si no puedes sobrevivir el recoil.'],
      ['Strategy: Ghost is weak to Dark and Ghost. Dusclops is very defensive; use Dark.', 'Key Catch: a Mightyena with Bite or an Absol with Bite/Night Slash. Destroys Dusclops.', 'Watch out for Gengar Destiny Bond. Do not faint it if you cannot survive the recoil.']
    ),
  },
  {
    id: 'glacia', name: 'Glacia', name_es: 'Nívea',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'ice', gen: 3, gameVersion: 'emerald',
    image: '/images/leaders/Nivea.png',
    team: [
      { name: 'Glalie', level: 50, moves: ['Ice Beam', 'Crunch', 'Hail', 'Light Screen'], item: null },
      { name: 'Sealeo', level: 50, moves: ['Ice Beam', 'Surf', 'Body Slam', 'Hail'], item: null },
      { name: 'Glalie', level: 52, moves: ['Ice Beam', 'Crunch', 'Hail', 'Shadow Ball'], item: null },
      { name: 'Sealeo', level: 52, moves: ['Ice Beam', 'Surf', 'Body Slam', 'Attract'], item: null },
      { name: 'Walrein', level: 53, moves: ['Ice Beam', 'Surf', 'Body Slam', 'Sheer Cold'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Hielo es débil a Fuego, Lucha, Roca y Acero. Fuego es tu mejor opción.', 'Captura Clave: un Blaziken con Blaze Kick/Flamethrower o un Camerupt con Eruption.', 'Walrein tiene mucha defensa y usa Sheer Cold (KO instantáneo). Golpéalo fuerte rápido.', 'Glalie usa Hail. Un Pokémon con Ice Body o Snow Cloak puede ser útil.'],
      ['Strategy: Ice is weak to Fire, Fighting, Rock and Steel. Fire is your best option.', 'Key Catch: a Blaziken with Blaze Kick/Flamethrower or a Camerupt with Eruption.', 'Walrein has high defense and uses Sheer Cold (instant KO). Hit it hard and fast.', 'Glalie uses Hail. A Pokémon with Ice Body or Snow Cloak can be useful.']
    ),
  },
  {
    id: 'drake', name: 'Drake', name_es: 'Dracón',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'dragon', gen: 3, gameVersion: 'emerald',
    image: '/images/leaders/Dracon.png',
    team: [
      { name: 'Shelgon', level: 52, moves: ['Dragon Claw', 'Rock Tomb', 'Protect', 'Double-Edge'], item: null },
      { name: 'Altaria', level: 54, moves: ['Dragon Dance', 'Aerial Ace', 'Dragon Breath', 'Earthquake'], item: null },
      { name: 'Flygon', level: 52, moves: ['Dragon Breath', 'Flamethrower', 'Crunch', 'Earthquake'], item: null },
      { name: 'Kingdra', level: 53, moves: ['Surf', 'Ice Beam', 'Smokescreen', 'Dragon Dance'], item: null },
      { name: 'Salamence', level: 55, moves: ['Fly', 'Dragon Dance', 'Crunch', 'Flamethrower'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Dragón es débil a Hielo y Dragón. Todos sus Pokémon (excepto Flygon) son Dragón puro o Dragón/Volador.', 'Captura Clave: un Walrein o Piloswine con Ice Beam. Destruye a todos sus dragones.', 'Salamence es su más fuerte. Tiene Intimidate. Usa ataques especiales o Ice Shard.', 'Flygon es Dragón/Tierra: débil a Hielo x4. Un solo Ice Beam lo derrota.'],
      ['Strategy: Dragon is weak to Ice and Dragon. All his Pokémon (except Flygon) are pure Dragon or Dragon/Flying.', 'Key Catch: a Walrein or Piloswine with Ice Beam. Destroys all his dragons.', 'Salamence is his strongest. It has Intimidate. Use special attacks or Ice Shard.', 'Flygon is Dragon/Ground: weak to Ice x4. A single Ice Beam defeats it.']
    ),
  },
];

const HOENN_CHAMPION = {
  id: 'steven', name: 'Steven', name_es: 'Máximo',
  role: { es: 'Campeón', en: 'Champion' },
  type: 'steel', gen: 3, gameVersion: 'emerald',
  image: '/images/leaders/Maximo.png',
  team: [
    { name: 'Skarmory', level: 57, moves: ['Steel Wing', 'Aerial Ace', 'Spikes', 'Roar'], item: null },
    { name: 'Claydol', level: 55, moves: ['Reflect', 'Light Screen', 'Earthquake', 'Psychic'], item: null },
    { name: 'Aggron', level: 56, moves: ['Iron Tail', 'Earthquake', 'Dragon Claw', 'Thunder Wave'], item: null },
    { name: 'Cradily', level: 56, moves: ['Giga Drain', 'Ancient Power', 'Confuse Ray', 'Ingrain'], item: null },
    { name: 'Armaldo', level: 56, moves: ['Water Pulse', 'Ancient Power', 'Aerial Ace', 'Slash'], item: null },
    { name: 'Metagross', level: 58, moves: ['Earthquake', 'Psychic', 'Meteor Mash', 'Shadow Ball'], item: 'Sitrus Berry' },
  ],
  tips: t(
    ['Estrategia: Acero es débil a Fuego, Lucha y Tierra. Metagross es Psíquico/Acero: Fuego x4.', 'Captura Clave: un Blaziken con Sky Uppercut/Flamethrower. Un Swampert con Earthquake.', 'Skarmory es inmune a Veneno y Tierra (por Levitate). Úsalo con Fuego o Eléctrico.', 'Cradily es Planta/Roca: débil a Hielo x4. Armaldo es Roca/Bicho: débil a Agua o Roca.'],
    ['Strategy: Steel is weak to Fire, Fighting and Ground. Metagross is Psychic/Steel: Fire x4.', 'Key Catch: a Blaziken with Sky Uppercut/Flamethrower. A Swampert with Earthquake.', 'Skarmory is immune to Poison and Ground (via Levitate). Hit it with Fire or Electric.', 'Cradily is Grass/Rock: weak to Ice x4. Armaldo is Rock/Bug: weak to Water or Rock.']
  ),
};

// === SINNOH (Platinum - Gen 4) ===
const SINNOH_E4 = [
  {
    id: 'aaron', name: 'Aaron', name_es: 'Alejandro',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'bug', gen: 4, gameVersion: 'platinum',
    image: '/images/leaders/Alecran.png',
    team: [
      { name: 'Yanmega', level: 49, moves: ['Bug Buzz', 'Air Slash', 'U-turn', 'Detect'], item: null },
      { name: 'Scizor', level: 49, moves: ['Iron Head', 'X-Scissor', 'Aerial Ace', 'U-turn'], item: null },
      { name: 'Vespiquen', level: 51, moves: ['Attack Order', 'Defend Order', 'Heal Order', 'Power Gem'], item: null },
      { name: 'Heracross', level: 50, moves: ['Close Combat', 'Megahorn', 'Night Slash', 'Stone Edge'], item: null },
      { name: 'Drapion', level: 53, moves: ['Cross Poison', 'Ice Fang', 'Aerial Ace', 'X-Scissor'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Bicho es débil a Volador, Fuego y Roca. Drapion es Veneno/Siniestro: usa Tierra o Lucha.', 'Captura Clave: un Infernape con Flamethrower/Flare Blitz o un Staraptor con Close Combat.', 'Vespiquen tiene Attack Order (tipo Bicho potente). Un ataque de Fuego la derrota rápido.', 'Heracross es Bicho/Lucha: Volador x4. Un Brave Bird o Aerial Ace lo derrota.'],
      ['Strategy: Bug is weak to Flying, Fire and Rock. Drapion is Poison/Dark: use Ground or Fighting.', 'Key Catch: an Infernape with Flamethrower/Flare Blitz or a Staraptor with Close Combat.', 'Vespiquen has Attack Order (powerful Bug move). A Fire attack defeats it quickly.', 'Heracross is Bug/Fighting: Flying x4. A Brave Bird or Aerial Ace defeats it.']
    ),
  },
  {
    id: 'bertha', name: 'Bertha', name_es: 'Gaia',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'ground', gen: 4, gameVersion: 'platinum',
    image: '/images/leaders/Gaia.png',
    team: [
      { name: 'Whiscash', level: 50, moves: ['Earthquake', 'Aqua Tail', 'Zen Headbutt', 'Sandstorm'], item: null },
      { name: 'Gliscor', level: 53, moves: ['Earthquake', 'Ice Fang', 'Fire Fang', 'Thunder Fang'], item: null },
      { name: 'Golem', level: 52, moves: ['Earthquake', 'Fire Punch', 'Thunder Punch', 'Sandstorm'], item: null },
      { name: 'Rhyperior', level: 52, moves: ['Earthquake', 'Rock Wrecker', 'Megahorn', 'Thunder Fang'], item: null },
      { name: 'Hippowdon', level: 55, moves: ['Earthquake', 'Stone Edge', 'Crunch', 'Yawn'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Tierra es débil a Agua, Planta y Hielo. Todos sus Pokémon son Tierra o Tierra/Agua.', 'Captura Clave: un Torterra con Wood Hammer/Razor Leaf o un Floatzel con Surf/Aqua Jet.', 'Rhyperior tiene Solid Rock (reduce daño super efectivo). Usa Agua o Planta fuerte.', 'Hippowdon crea Sandstorm al entrar. Lleva un Pokémon que no sea afectado por arena.'],
      ['Strategy: Ground is weak to Water, Grass and Ice. All his Pokémon are Ground or Ground/Water.', 'Key Catch: a Torterra with Wood Hammer/Razor Leaf or a Floatzel with Surf/Aqua Jet.', 'Rhyperior has Solid Rock (reduces super effective damage). Use strong Water or Grass.', 'Hippowdon creates Sandstorm on entry. Bring a Pokémon not affected by sand.']
    ),
  },
  {
    id: 'flint', name: 'Flint', name_es: 'Fausto',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'fire', gen: 4, gameVersion: 'platinum',
    image: '/images/leaders/Fausto.png',
    team: [
      { name: 'Houndoom', level: 52, moves: ['Flamethrower', 'Dark Pulse', 'Solar Beam', 'Sludge Bomb'], item: null },
      { name: 'Flareon', level: 55, moves: ['Fire Fang', 'Giga Impact', 'Quick Attack', 'Will-O-Wisp'], item: null },
      { name: 'Rapidash', level: 53, moves: ['Fire Blast', 'Sunny Day', 'Bounce', 'Megahorn'], item: null },
      { name: 'Infernape', level: 55, moves: ['Flare Blitz', 'Thunder Punch', 'Mach Punch', 'U-turn'], item: null },
      { name: 'Magmortar', level: 57, moves: ['Flamethrower', 'Thunderbolt', 'Solar Beam', 'Hyper Beam'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Fuego es débil a Agua, Tierra y Roca. Magmortar e Infernape son los más peligrosos.', 'Captura Clave: un Gastrodon o Quagsire (Tierra/Agua, inmune a Electric y resiste Fuego).', 'Flareon es lento pero pega fuerte. Un ataque de Agua o Tierra lo derrota antes de que ataque.', 'Magmortar usa Thunderbolt para contrarrestar Agua. Usa un Pokémon de Tierra puro.'],
      ['Strategy: Fire is weak to Water, Ground and Rock. Magmortar and Infernape are the most dangerous.', 'Key Catch: a Gastrodon or Quagsire (Ground/Water, immune to Electric and resists Fire).', 'Flareon is slow but hits hard. A Water or Ground attack defeats it before it attacks.', 'Magmortar uses Thunderbolt to counter Water. Use a pure Ground type.']
    ),
  },
  {
    id: 'lucian', name: 'Lucian', name_es: 'Delos',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'psychic', gen: 4, gameVersion: 'platinum',
    image: '/images/leaders/Delos.png',
    team: [
      { name: 'Mr. Mime', level: 53, moves: ['Psychic', 'Reflect', 'Light Screen', 'Thunderbolt'], item: null },
      { name: 'Espeon', level: 55, moves: ['Psychic', 'Shadow Ball', 'Quick Attack', 'Signal Beam'], item: null },
      { name: 'Bronzong', level: 54, moves: ['Psychic', 'Flash Cannon', 'Earthquake', 'Calm Mind'], item: null },
      { name: 'Alakazam', level: 56, moves: ['Psychic', 'Focus Blast', 'Shadow Ball', 'Recover'], item: null },
      { name: 'Gallade', level: 59, moves: ['Drain Punch', 'Psycho Cut', 'Leaf Blade', 'Stone Edge'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Psíquico es débil a Siniestro, Bicho y Fantasma. Gallade es Psíquico/Lucha: Volador o Fantasma.', 'Captura Clave: un Honchkrow con Sucker Punch/Night Slash o un Weavile con Ice Shard/Dark Pulse.', 'Alakazam tiene muy baja defensa física. Un Sucker Punch lo derrota siempre.', 'Bronzong puede tener Levitate (inmune a Tierra) o Heatproof (resiste Fuego). Prueba con Fuego primero.'],
      ['Strategy: Psychic is weak to Dark, Bug and Ghost. Gallade is Psychic/Fighting: Flying or Ghost.', 'Key Catch: an Honchkrow with Sucker Punch/Night Slash or a Weavile with Ice Shard/Dark Pulse.', 'Alakazam has very low physical defense. A Sucker Punch always defeats it.', 'Bronzong may have Levitate (immune to Ground) or Heatproof (resists Fire). Test with Fire first.']
    ),
  },
];

const SINNOH_CHAMPION = {
  id: 'cynthia', name: 'Cynthia', name_es: 'Cintia',
  role: { es: 'Campeón', en: 'Champion' },
  type: 'dragon', gen: 4, gameVersion: 'platinum',
  image: '/images/leaders/Cintia.png',
  team: [
    { name: 'Spiritomb', level: 58, moves: ['Dark Pulse', 'Psychic', 'Silver Wind', 'Hypnosis'], item: null },
    { name: 'Roserade', level: 58, moves: ['Energy Ball', 'Sludge Bomb', 'Shadow Ball', 'Extrasensory'], item: null },
    { name: 'Togekiss', level: 60, moves: ['Air Slash', 'Aura Sphere', 'Water Pulse', 'Shock Wave'], item: null },
    { name: 'Lucario', level: 60, moves: ['Aura Sphere', 'Dragon Pulse', 'Psychic', 'Earthquake'], item: null },
    { name: 'Milotic', level: 58, moves: ['Surf', 'Ice Beam', 'Mirror Coat', 'Aqua Ring'], item: null },
    { name: 'Garchomp', level: 62, moves: ['Dragon Rush', 'Earthquake', 'Brick Break', 'Giga Impact'], item: 'Sitrus Berry' },
  ],
  tips: t(
    ['Estrategia: El equipo de {{name}} es muy variado. Necesitas cobertura de Fuego, Hielo, Lucha, Bicho y Agua.', 'Captura Clave: un Weavile con Ice Shard (prioridad) para derrotar a Garchomp y Togekiss de {{name}}.', 'El Spiritomb de {{name}} no tiene debilidades (Siniestro/Fantasma). Usa ataques fuertes neutrales o tóxicos.', 'Garchomp es Tierra/Dragón: Hielo x4. Un Ice Beam o Ice Shard lo derrota. Cuidado con Earthquake de {{name}}.', 'Milotic usa Mirror Coat (devuelve daño especial). Usa ataques físicos contra el Milotic de {{name}}.'],
    ['Strategy: {{name}}\'s team is very varied. You need coverage of Fire, Ice, Fighting, Bug and Water.', 'Key Catch: a Weavile with Ice Shard (priority) to defeat {{name}}\'s Garchomp and Togekiss.', '{{name}}\'s Spiritomb has no weaknesses (Dark/Ghost). Use strong neutral attacks or Toxic.', 'Garchomp is Ground/Dragon: Ice x4. An Ice Beam or Ice Shard defeats it. Watch out for {{name}}\'s Earthquake.', 'Milotic uses Mirror Coat (returns special damage). Use physical attacks against {{name}}\'s Milotic.']
  ),
};

// === UNOVA (Black/White - Gen 5) ===
const UNOVA_E4 = [
  {
    id: 'shauntal', name: 'Shauntal', name_es: 'Anís',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'ghost', gen: 5, gameVersion: 'black-white',
    image: '/images/leaders/Anis.png',
    team: [
      { name: 'Cofagrigus', level: 48, moves: ['Shadow Ball', 'Will-O-Wisp', 'Psychic', 'Toxic'], item: null },
      { name: 'Jellicent', level: 48, moves: ['Surf', 'Shadow Ball', 'Energy Ball', 'Recover'], item: null },
      { name: 'Golurk', level: 48, moves: ['Shadow Punch', 'Earthquake', 'Hammer Arm', 'Curse'], item: null },
      { name: 'Chandelure', level: 50, moves: ['Shadow Ball', 'Flamethrower', 'Psychic', 'Confuse Ray'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Fantasma es débil a Siniestro y Fantasma propio. Golurk es Tierra/Fantasma: Agua o Hielo.', 'Captura Clave: un Krookodile con Crunch o un Scrafty con Crunch/Hi Jump Kick.', 'Chandelure es Fuego/Fantasma: Agua, Tierra, Roca o Fantasma. No uses Planta o Bicho.', 'Cofagrigus tiene muy alta defensa. Usa ataques especiales o Siniestro.'],
      ['Strategy: Ghost is weak to Dark and own Ghost. Golurk is Ground/Ghost: Water or Ice.', 'Key Catch: a Krookodile with Crunch or a Scrafty with Crunch/Hi Jump Kick.', 'Chandelure is Fire/Ghost: Water, Ground, Rock or Ghost. Do not use Grass or Bug.', 'Cofagrigus has very high defense. Use special attacks or Dark.']
    ),
  },
  {
    id: 'marshal', name: 'Marshal', name_es: 'Lotto',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'fighting', gen: 5, gameVersion: 'black-white',
    image: '/images/leaders/Lotto.png',
    team: [
      { name: 'Throh', level: 48, moves: ['Storm Throw', 'Payback', 'Bulk Up', 'Rock Slide'], item: null },
      { name: 'Sawk', level: 48, moves: ['Brick Break', 'Payback', 'Bulk Up', 'Rock Slide'], item: null },
      { name: 'Conkeldurr', level: 48, moves: ['Hammer Arm', 'Stone Edge', 'Retaliate', 'Grass Knot'], item: null },
      { name: 'Mienshao', level: 50, moves: ['Hi Jump Kick', 'U-turn', 'Bounce', 'Fake Out'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Lucha es débil a Volador, Psíquico y Hada. Conkeldurr tiene Guts (potencia si quemado/paralizado).', 'Captura Clave: un Reuniclus con Psychic o un Sigilyph con Psycho Shift/Psychic.', 'Mienshao es rápido y frágil. Un ataque de Volador o Psíquico rápido lo derrota.', 'No uses ataques que causen quemadura/parálisis contra Conkeldurr (activa Guts).'],
      ['Strategy: Fighting is weak to Flying, Psychic and Fairy. Conkeldurr has Guts (boosts if burned/paralyzed).', 'Key Catch: a Reuniclus with Psychic or a Sigilyph with Psycho Shift/Psychic.', 'Mienshao is fast and fragile. A quick Flying or Psychic attack defeats it.', 'Do not use attacks that cause burn/paralysis against Conkeldurr (activates Guts).']
    ),
  },
  {
    id: 'grimsley', name: 'Grimsley', name_es: 'Aza',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'dark', gen: 5, gameVersion: 'black-white',
    image: '/images/leaders/Aza.png',
    team: [
      { name: 'Liepard', level: 48, moves: ['Fake Out', 'Night Slash', 'Aerial Ace', 'Attract'], item: null },
      { name: 'Scrafty', level: 48, moves: ['Crunch', 'Facade', 'Rock Tomb', 'Poison Jab'], item: null },
      { name: 'Krookodile', level: 48, moves: ['Crunch', 'Dragon Claw', 'Earthquake', 'Outrage'], item: null },
      { name: 'Bisharp', level: 50, moves: ['Night Slash', 'X-Scissor', 'Aerial Ace', 'Metal Claw'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Siniestro es débil a Lucha y Bicho. Bisharp es Acero/Siniestro: Fuego x4 o Lucha x4.', 'Captura Clave: un Conkeldurr con Mach Punch o un Emboar con Flamethrower/Heat Crash.', 'Liepard usa Fake Out + Attract. Equipa un Pokémon del mismo género o con Oblivious.', 'Krookodile es Tierra/Siniestro: Agua x4 o Hielo x4. Un Surf lo derrota fácilmente.'],
      ['Strategy: Dark is weak to Fighting and Bug. Bisharp is Steel/Dark: Fire x4 or Fighting x4.', 'Key Catch: a Conkeldurr with Mach Punch or an Emboar with Flamethrower/Heat Crash.', 'Liepard uses Fake Out + Attract. Equip a Pokémon of the same gender or with Oblivious.', 'Krookodile is Ground/Dark: Water x4 or Ice x4. A Surf defeats it easily.']
    ),
  },
  {
    id: 'caitlin', name: 'Caitlin', name_es: 'Catleya',
    role: { es: 'Alto Mando', en: 'Elite Four' },
    type: 'psychic', gen: 5, gameVersion: 'black-white',
    image: '/images/leaders/Catleya.png',
    team: [
      { name: 'Musharna', level: 48, moves: ['Psychic', 'Shadow Ball', 'Energy Ball', 'Yawn'], item: null },
      { name: 'Sigilyph', level: 48, moves: ['Psychic', 'Air Slash', 'Shadow Ball', 'Cosmic Power'], item: null },
      { name: 'Reuniclus', level: 48, moves: ['Psychic', 'Focus Blast', 'Shadow Ball', 'Recover'], item: null },
      { name: 'Gothitelle', level: 50, moves: ['Psychic', 'Shadow Ball', 'Thunderbolt', 'Calm Mind'], item: 'Sitrus Berry' },
    ],
    tips: t(
      ['Estrategia: Psíquico es débil a Siniestro, Bicho y Fantasma. Gothitelle tiene Shadow Tag (no puedes cambiar).', 'Captura Clave: un Bisharp con Night Slash o un Krookodile con Crunch.', 'Musharna es lenta pero defensiva. Usa Siniestro o Bicho fuerte.', 'Reuniclus tiene muy baja velocidad pero pega fuerte con Focus Blast. Golpéala primero.'],
      ['Strategy: Psychic is weak to Dark, Bug and Ghost. Gothitelle has Shadow Tag (you cannot switch).', 'Key Catch: a Bisharp with Night Slash or a Krookodile with Crunch.', 'Musharna is slow but defensive. Use strong Dark or Bug attacks.', 'Reuniclus has very low speed but hits hard with Focus Blast. Hit it first.']
    ),
  },
];

const UNOVA_CHAMPION = {
  id: 'alder', name: 'Alder', name_es: 'Mirto',
  role: { es: 'Campeón', en: 'Champion' },
  type: 'bug', gen: 5, gameVersion: 'black-white',
  image: '/images/leaders/Mirto.png',
  team: [
    { name: 'Accelgor', level: 60, moves: ['Bug Buzz', 'Focus Blast', 'Giga Drain', 'Me First'], item: null },
    { name: 'Bouffalant', level: 60, moves: ['Head Charge', 'Wild Charge', 'Megahorn', 'Earthquake'], item: null },
    { name: 'Druddigon', level: 60, moves: ['Outrage', 'Superpower', 'Dragon Tail', 'Chip Away'], item: null },
    { name: 'Braviary', level: 60, moves: ['Brave Bird', 'Crush Claw', 'Retaliate', 'U-turn'], item: null },
    { name: 'Volcarona', level: 60, moves: ['Bug Buzz', 'Overheat', 'Quiver Dance', 'Hyper Beam'], item: null },
    { name: 'Escavalier', level: 63, moves: ['X-Scissor', 'Iron Head', 'Giga Impact', 'Reversal'], item: 'Sitrus Berry' },
  ],
  tips: t(
    ['Estrategia: Bicho es débil a Volador, Fuego y Roca. El equipo de {{name}} es muy ofensivo.', 'Captura Clave: un Chandelure con Fire Blast o un Archeops con Rock Slide/Acrobatics contra {{name}}.', 'Bouffalant tiene Sap Sipper (inmune a Planta y sube ataque). No uses Planta contra {{name}}.', 'Volcarona es Bicho/Fuego: Roca x4 o Volador x4. Un Stone Edge derrota al Volcarona de {{name}} fácilmente.', 'Braviary es Normal/Volador: Eléctrico, Hielo o Roca. No uses Lucha o Planta contra {{name}}.'],
    ['Strategy: Bug is weak to Flying, Fire and Rock. {{name}}\'s team is very offensive.', 'Key Catch: a Chandelure with Fire Blast or an Archeops with Rock Slide/Acrobatics against {{name}}.', 'Bouffalant has Sap Sipper (immune to Grass and boosts attack). Do not use Grass against {{name}}.', 'Volcarona is Bug/Fire: Rock x4 or Flying x4. A Stone Edge defeats {{name}}\'s Volcarona easily.', 'Braviary is Normal/Flying: Electric, Ice or Rock. Do not use Fighting or Grass against {{name}}.']
  ),
};

// === REGIONS ARRAY ===
export const ALL_LEAGUES = [
  {
    region: 'kanto',
    label_es: 'Kanto',
    label_en: 'Kanto',
    gen: 3,
    color: '#ef5350',
    members: KANTO_E4,
    champion: KANTO_CHAMPION,
    recommendedTeam: {
      es: ['Jolteon (Eléctrico) - Derrota a Lorelei y ayuda contra Lance', 'Alakazam (Psíquico) - Destruye a Bruno y Agatha', 'Lapras (Agua/Hielo) - Hielo para Lance, Agua para todo', 'Gyarados (Agua/Volador) - Intimidate + Surf fuerte', 'Machamp (Lucha) - Para Lorelei (con Rock Slide) y Bruno', 'Gengar (Fantasma/Veneno) - Inmune a Normal/Fantasma de Agatha'],
      en: ['Jolteon (Electric) - Defeats Lorelei and helps against Lance', 'Alakazam (Psychic) - Destroys Bruno and Agatha', 'Lapras (Water/Ice) - Ice for Lance, Water for everything', 'Gyarados (Water/Flying) - Intimidate + strong Surf', 'Machamp (Fighting) - For Lorelei (with Rock Slide) and Bruno', 'Gengar (Ghost/Poison) - Immune to Normal/Ghost from Agatha']
    },
  },
  {
    region: 'johto',
    label_es: 'Johto',
    label_en: 'Johto',
    gen: 4,
    color: '#ab47bc',
    members: JOHTO_E4,
    champion: JOHTO_CHAMPION,
    recommendedTeam: {
      es: ['Tyranitar (Roca/Siniestro) - Destruye a Mento y Koga', 'Heracross (Bicho/Lucha) - Karen y Bruno caen fácilmente', 'Mamoswine (Hielo/Tierra) - Hielo para Lance, Tierra para Koga', 'Houndoom (Fuego/Siniestro) - Mento y Karen', 'Gyarados (Agua/Volador) - Bruno y ayuda general', 'Ampharos (Eléctrico) - Lorelei y Agua en general'],
      en: ['Tyranitar (Rock/Dark) - Destroys Will and Koga', 'Heracross (Bug/Fighting) - Karen and Bruno fall easily', 'Mamoswine (Ice/Ground) - Ice for Lance, Ground for Koga', 'Houndoom (Fire/Dark) - Will and Karen', 'Gyarados (Water/Flying) - Bruno and general help', 'Ampharos (Electric) - Lorelei and Water in general']
    },
  },
  {
    region: 'hoenn',
    label_es: 'Hoenn',
    label_en: 'Hoenn',
    gen: 3,
    color: '#ffa726',
    members: HOENN_E4,
    champion: HOENN_CHAMPION,
    recommendedTeam: {
      es: ['Blaziken (Fuego/Lucha) - Sixto, Nívea, Máximo (Metagross)', 'Walrein/Piloswine (Hielo) - Dracón y Nívea completos', 'Breloom (Planta/Lucha) - Sixto, Nívea, Máximo', 'Swampert (Agua/Tierra) - Flannery, Máximo (Aggron/Armaldo)', 'Absol (Siniestro) - Fátima completa', 'Gardevoir (Psíquico/Hada) - Fátima y Sixto'],
      en: ['Blaziken (Fire/Fighting) - Sidney, Glacia, Steven (Metagross)', 'Walrein/Piloswine (Ice) - Drake and Glacia completely', 'Breloom (Grass/Fighting) - Sidney, Glacia, Steven', 'Swampert (Water/Ground) - Flannery, Steven (Aggron/Armaldo)', 'Absol (Dark) - Phoebe completely', 'Gardevoir (Psychic/Fairy) - Phoebe and Sidney']
    },
  },
  {
    region: 'sinnoh',
    label_es: 'Sinnoh',
    label_en: 'Sinnoh',
    gen: 4,
    color: '#42a5f5',
    members: SINNOH_E4,
    champion: SINNOH_CHAMPION,
    recommendedTeam: {
      es: ['Infernape (Fuego/Lucha) - Alejandro, Gaia, Fausto, Delos', 'Weavile (Siniestro/Hielo) - Cintia (Garchomp/Togekiss), Delos', 'Gastrodon (Agua/Tierra) - Fausto, Gaia, Cintia (Spiritomb)', 'Togekiss (Hada/Volador) - Alejandro, Gaia, Delos', 'Garchomp (Tierra/Dragón) - Fausto, Cintia (Lucario)', 'Lucario (Lucha/Acero) - Delos, Gaia, Cintia'],
      en: ['Infernape (Fire/Fighting) - Aaron, Bertha, Flint, Lucian', 'Weavile (Dark/Ice) - Cynthia (Garchomp/Togekiss), Lucian', 'Gastrodon (Water/Ground) - Flint, Bertha, Cynthia (Spiritomb)', 'Togekiss (Fairy/Flying) - Aaron, Bertha, Lucian', 'Garchomp (Ground/Dragon) - Flint, Cynthia (Lucario)', 'Lucario (Fighting/Steel) - Lucian, Bertha, Cynthia']
    },
  },
  {
    region: 'unova',
    label_es: 'Teselia',
    label_en: 'Unova',
    gen: 5,
    color: '#66bb6a',
    members: UNOVA_E4,
    champion: UNOVA_CHAMPION,
    recommendedTeam: {
      es: ['Chandelure (Fuego/Fantasma) - Anís, Lotto, Mirto', 'Krookodile (Tierra/Siniestro) - Anís, Catleya, Aza', 'Conkeldurr (Lucha) - Aza, Lotto, Mirto (Volcarona/Braviary)', 'Sigilyph (Psíquico/Volador) - Lotto, Catleya, Mirto (Volcarona)', 'Archeops (Roca/Volador) - Mirto (Volcarona/Braviary), Anís', 'Haxorus (Dragón) - Catleya, Lotto, Aza'],
      en: ['Chandelure (Fire/Ghost) - Shauntal, Marshal, Alder', 'Krookodile (Ground/Dark) - Shauntal, Caitlin, Grimsley', 'Conkeldurr (Fighting) - Grimsley, Marshal, Alder (Volcarona/Braviary)', 'Sigilyph (Psychic/Flying) - Marshal, Caitlin, Alder (Volcarona)', 'Archeops (Rock/Flying) - Alder (Volcarona/Braviary), Shauntal', 'Haxorus (Dragon) - Caitlin, Marshal, Grimsley']
    },
  },
];
