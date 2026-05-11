// Datos de Líderes de Gimnasio - Generaciones 1-5
// Sprites por versión de juego para mostrar los correctos

const POKEMON_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function getGymPokemonSprite(pokemonName, gameVersion) {
  const ids = {
    'Bulbasaur': 1, 'Ivysaur': 2, 'Venusaur': 3, 'Charmander': 4, 'Charmeleon': 5, 'Charizard': 6,
    'Squirtle': 7, 'Wartortle': 8, 'Blastoise': 9, 'Caterpie': 10, 'Metapod': 11, 'Butterfree': 12,
    'Weedle': 13, 'Kakuna': 14, 'Beedrill': 15, 'Pidgey': 16, 'Pidgeotto': 17, 'Pidgeot': 18,
    'Rattata': 19, 'Raticate': 20, 'Spearow': 21, 'Fearow': 22, 'Ekans': 23, 'Arbok': 24,
    'Pikachu': 25, 'Raichu': 26, 'Sandshrew': 27, 'Sandslash': 28, 'Nidoran-f': 29, 'Nidorina': 30,
    'Nidoqueen': 31, 'Nidoran-m': 32, 'Nidorino': 33, 'Nidoking': 34, 'Clefairy': 35, 'Clefable': 36,
    'Vulpix': 37, 'Ninetales': 38, 'Jigglypuff': 39, 'Wigglytuff': 40, 'Zubat': 41, 'Golbat': 42,
    'Oddish': 43, 'Gloom': 44, 'Vileplume': 45, 'Paras': 46, 'Parasect': 47, 'Venonat': 48,
    'Venomoth': 49, 'Diglett': 50, 'Dugtrio': 51, 'Meowth': 52, 'Persian': 53, 'Psyduck': 54,
    'Golduck': 55, 'Mankey': 56, 'Primeape': 57, 'Growlithe': 58, 'Arcanine': 59, 'Poliwag': 60,
    'Poliwhirl': 61, 'Poliwrath': 62, 'Abra': 63, 'Kadabra': 64, 'Alakazam': 65, 'Machop': 66,
    'Machoke': 67, 'Machamp': 68, 'Bellsprout': 69, 'Weepinbell': 70, 'Victreebel': 71, 'Tentacool': 72,
    'Tentacruel': 73, 'Geodude': 74, 'Graveler': 75, 'Golem': 76, 'Ponyta': 77, 'Rapidash': 78,
    'Slowpoke': 79, 'Slowbro': 80, 'Magnemite': 81, 'Magneton': 82, 'Farfetchd': 83, 'Doduo': 84,
    'Dodrio': 85, 'Seel': 86, 'Dewgong': 87, 'Grimer': 88, 'Muk': 89, 'Shellder': 90, 'Cloyster': 91,
    'Gastly': 92, 'Haunter': 93, 'Gengar': 94, 'Onix': 95, 'Drowzee': 96, 'Hypno': 97, 'Krabby': 98,
    'Kingler': 99, 'Voltorb': 100, 'Electrode': 101, 'Exeggcute': 102, 'Exeggutor': 103, 'Cubone': 104,
    'Marowak': 105, 'Hitmonlee': 106, 'Hitmonchan': 107, 'Lickitung': 108, 'Koffing': 109, 'Weezing': 110,
    'Rhyhorn': 111, 'Rhydon': 112, 'Chansey': 113, 'Tangela': 114, 'Kangaskhan': 115, 'Horsea': 116,
    'Seadra': 117, 'Goldeen': 118, 'Seaking': 119, 'Staryu': 120, 'Starmie': 121, 'Mr-mime': 122,
    'Scyther': 123, 'Jynx': 124, 'Electabuzz': 125, 'Magmar': 126, 'Pinsir': 127, 'Tauros': 128,
    'Magikarp': 129, 'Gyarados': 130, 'Lapras': 131, 'Ditto': 132, 'Eevee': 133, 'Vaporeon': 134,
    'Jolteon': 135, 'Flareon': 136, 'Porygon': 137, 'Omanyte': 138, 'Omastar': 139, 'Kabuto': 140,
    'Kabutops': 141, 'Aerodactyl': 142, 'Snorlax': 143, 'Articuno': 144, 'Zapdos': 145, 'Moltres': 146,
    'Dratini': 147, 'Dragonair': 148, 'Dragonite': 149, 'Mewtwo': 150, 'Mew': 151,
    'Chikorita': 152, 'Bayleef': 153, 'Meganium': 154, 'Cyndaquil': 155, 'Quilava': 156, 'Typhlosion': 157,
    'Totodile': 158, 'Croconaw': 159, 'Feraligatr': 160, 'Sentret': 161, 'Furret': 162, 'Hoothoot': 163,
    'Noctowl': 164, 'Ledyba': 165, 'Ledian': 166, 'Spinarak': 167, 'Ariados': 168, 'Crobat': 169,
    'Chinchou': 170, 'Lanturn': 171, 'Pichu': 172, 'Cleffa': 173, 'Igglybuff': 174, 'Togepi': 175,
    'Togetic': 176, 'Natu': 177, 'Xatu': 178, 'Mareep': 179, 'Flaaffy': 180, 'Ampharos': 181, 'Bellossom': 182,
    'Marill': 183, 'Azumarill': 184, 'Sudowoodo': 185, 'Politoed': 186, 'Hoppip': 187, 'Skiploom': 188,
    'Jumpluff': 189, 'Aipom': 190, 'Sunkern': 191, 'Sunflora': 192, 'Yanma': 193, 'Wooper': 194,
    'Quagsire': 195, 'Espeon': 196, 'Umbreon': 197, 'Murkrow': 198, 'Slowking': 199, 'Misdreavus': 200,
    'Unown': 201, 'Wobbuffet': 202, 'Girafarig': 203, 'Pineco': 204, 'Forretress': 205, 'Dunsparce': 206,
    'Gligar': 207, 'Steelix': 208, 'Snubbull': 209, 'Granbull': 210, 'Qwilfish': 211, 'Scizor': 212,
    'Shuckle': 213, 'Heracross': 214, 'Sneasel': 215, 'Teddiursa': 216, 'Ursaring': 217, 'Slugma': 218,
    'Magcargo': 219, 'Swinub': 220, 'Piloswine': 221, 'Corsola': 222, 'Remoraid': 223, 'Octillery': 224,
    'Delibird': 225, 'Mantine': 226, 'Skarmory': 227, 'Houndour': 228, 'Houndoom': 229, 'Kingdra': 230,
    'Phanpy': 231, 'Donphan': 232, 'Porygon2': 233, 'Stantler': 234, 'Smeargle': 235, 'Tyrogue': 236,
    'Hitmontop': 237, 'Smoochum': 238, 'Elekid': 239, 'Magby': 240, 'Miltank': 241, 'Blissey': 242,
    'Raikou': 243, 'Entei': 244, 'Suicune': 245, 'Larvitar': 246, 'Pupitar': 247, 'Tyranitar': 248,
    'Lugia': 249, 'Ho-oh': 250, 'Celebi': 251,
    'Treecko': 252, 'Grovyle': 253, 'Sceptile': 254, 'Torchic': 255, 'Combusken': 256, 'Blaziken': 257,
    'Mudkip': 258, 'Marshtomp': 259, 'Swampert': 260, 'Poochyena': 261, 'Mightyena': 262, 'Zigzagoon': 263,
    'Linoone': 264, 'Wurmple': 265, 'Silcoon': 266, 'Beautifly': 267, 'Cascoon': 268, 'Dustox': 269,
    'Lotad': 270, 'Lombre': 271, 'Ludicolo': 272, 'Seedot': 273, 'Nuzleaf': 274, 'Shiftry': 275,
    'Taillow': 276, 'Swellow': 277, 'Wingull': 278, 'Pelipper': 279, 'Ralts': 280, 'Kirlia': 281,
    'Gardevoir': 282, 'Surskit': 283, 'Masquerain': 284, 'Shroomish': 285, 'Breloom': 286, 'Slakoth': 287,
    'Vigoroth': 288, 'Slaking': 289, 'Nincada': 290, 'Ninjask': 291, 'Shedinja': 292, 'Whismur': 293,
    'Loudred': 294, 'Exploud': 295, 'Makuhita': 296, 'Hariyama': 297, 'Azurill': 298, 'Nosepass': 299,
    'Skitty': 300, 'Delcatty': 301, 'Sableye': 302, 'Mawile': 303, 'Aron': 304, 'Lairon': 305, 'Aggron': 306,
    'Meditite': 307, 'Medicham': 308, 'Electrike': 309, 'Manectric': 310, 'Plusle': 311, 'Minun': 312,
    'Volbeat': 313, 'Illumise': 314, 'Roselia': 315, 'Gulpin': 316, 'Swalot': 317, 'Carvanha': 318,
    'Sharpedo': 319, 'Wailmer': 320, 'Wailord': 321, 'Numel': 322, 'Camerupt': 323, 'Torkoal': 324,
    'Spoink': 325, 'Grumpig': 326, 'Spinda': 327, 'Trapinch': 328, 'Vibrava': 329, 'Flygon': 330,
    'Cacnea': 331, 'Cacturne': 332, 'Swablu': 333, 'Altaria': 334, 'Zangoose': 335, 'Seviper': 336,
    'Lunatone': 337, 'Solrock': 338, 'Barboach': 339, 'Whiscash': 340, 'Corphish': 341, 'Crawdaunt': 342,
    'Baltoy': 343, 'Claydol': 344, 'Lileep': 345, 'Cradily': 346, 'Anorith': 347, 'Armaldo': 348,
    'Feebas': 349, 'Milotic': 350, 'Castform': 351, 'Kecleon': 352, 'Shuppet': 353, 'Banette': 354,
    'Duskull': 355, 'Dusclops': 356, 'Tropius': 357, 'Chimecho': 358, 'Absol': 359, 'Wynaut': 360,
    'Snorunt': 361, 'Glalie': 362, 'Spheal': 363, 'Sealeo': 364, 'Walrein': 365, 'Clamperl': 366,
    'Huntail': 367, 'Gorebyss': 368, 'Relicanth': 369, 'Luvdisc': 370, 'Bagon': 371, 'Shelgon': 372,
    'Salamence': 373, 'Beldum': 374, 'Metang': 375, 'Metagross': 376, 'Regirock': 377, 'Regice': 378,
    'Registeel': 379, 'Latias': 380, 'Latios': 381, 'Kyogre': 382, 'Groudon': 383, 'Rayquaza': 384,
    'Jirachi': 385, 'Deoxys': 386,
    'Turtwig': 387, 'Grotle': 388, 'Torterra': 389, 'Chimchar': 390, 'Monferno': 391, 'Infernape': 392,
    'Piplup': 393, 'Prinplup': 394, 'Empoleon': 395, 'Starly': 396, 'Staravia': 397, 'Staraptor': 398,
    'Bidoof': 399, 'Bibarel': 400, 'Kricketot': 401, 'Kricketune': 402, 'Shinx': 403, 'Luxio': 404,
    'Luxray': 405, 'Budew': 406, 'Roserade': 407, 'Cranidos': 408, 'Rampardos': 409, 'Shieldon': 410,
    'Bastiodon': 411, 'Burmy': 412, 'Wormadam': 413, 'Mothim': 414, 'Combee': 415, 'Vespiquen': 416,
    'Pachirisu': 417, 'Buizel': 418, 'Floatzel': 419, 'Cherubi': 420, 'Cherrim': 421, 'Shellos': 422,
    'Gastrodon': 423, 'Ambipom': 424, 'Drifloon': 425, 'Drifblim': 426, 'Buneary': 427, 'Lopunny': 428,
    'Mismagius': 429, 'Honchkrow': 430, 'Glameow': 431, 'Purugly': 432, 'Chingling': 433, 'Stunky': 434,
    'Skuntank': 435, 'Bronzor': 436, 'Bronzong': 437, 'Bonsly': 438, 'Mime-jr': 439, 'Happiny': 440,
    'Chatot': 441, 'Spiritomb': 442, 'Gible': 443, 'Gabite': 444, 'Garchomp': 445, 'Munchlax': 446,
    'Riolu': 447, 'Lucario': 448, 'Hippopotas': 449, 'Hippowdon': 450, 'Skorupi': 451, 'Drapion': 452,
    'Croagunk': 453, 'Toxicroak': 454, 'Carnivine': 455, 'Finneon': 456, 'Lumineon': 457, 'Mantyke': 458,
    'Snover': 459, 'Abomasnow': 460, 'Weavile': 461, 'Magnezone': 462, 'Lickilicky': 463, 'Rhyperior': 464,
    'Tangrowth': 465, 'Electivire': 466, 'Magmortar': 467, 'Togekiss': 468, 'Yanmega': 469, 'Leafeon': 470,
    'Glaceon': 471, 'Gliscor': 472, 'Mamoswine': 473, 'Porygon-z': 474, 'Gallade': 475, 'Probopass': 476,
    'Dusknoir': 477, 'Froslass': 478, 'Rotom': 479, 'Uxie': 480, 'Mesprit': 481, 'Azelf': 482,
    'Dialga': 483, 'Palkia': 484, 'Heatran': 485, 'Regigigas': 486, 'Giratina': 487, 'Cresselia': 488,
    'Phione': 489, 'Manaphy': 490, 'Darkrai': 491, 'Shaymin': 492, 'Arceus': 493,
    'Victini': 494, 'Snivy': 495, 'Servine': 496, 'Serperior': 497, 'Tepig': 498, 'Pignite': 499,
    'Emboar': 500, 'Oshawott': 501, 'Dewott': 502, 'Samurott': 503, 'Patrat': 504, 'Watchog': 505,
    'Lillipup': 506, 'Herdier': 507, 'Stoutland': 508, 'Purrloin': 509, 'Liepard': 510, 'Pansage': 511,
    'Simisage': 512, 'Pansear': 513, 'Simisear': 514, 'Panpour': 515, 'Simipour': 516, 'Munna': 517,
    'Musharna': 518, 'Pidove': 519, 'Tranquill': 520, 'Unfezant': 521, 'Blitzle': 522, 'Zebstrika': 523,
    'Roggenrola': 524, 'Boldore': 525, 'Gigalith': 526, 'Woobat': 527, 'Swoobat': 528, 'Drilbur': 529,
    'Excadrill': 530, 'Audino': 531, 'Timburr': 532, 'Gurdurr': 533, 'Conkeldurr': 534, 'Tympole': 535,
    'Palpitoad': 536, 'Seismitoad': 537, 'Throh': 538, 'Sawk': 539, 'Sewaddle': 540, 'Swadloon': 541,
    'Leavanny': 542, 'Venipede': 543, 'Whirlipede': 544, 'Scolipede': 545, 'Cottonee': 546, 'Whimsicott': 547,
    'Petilil': 548, 'Lilligant': 549, 'Basculin': 550, 'Sandile': 551, 'Krokorok': 552, 'Krookodile': 553,
    'Darumaka': 554, 'Darmanitan': 555, 'Maractus': 556, 'Dwebble': 557, 'Crustle': 558, 'Scraggy': 559,
    'Scrafty': 560, 'Sigilyph': 561, 'Yamask': 562, 'Cofagrigus': 563, 'Tirtouga': 564, 'Carracosta': 565,
    'Archen': 566, 'Archeops': 567, 'Trubbish': 568, 'Garbodor': 569, 'Zorua': 570, 'Zoroark': 571,
    'Minccino': 572, 'Cinccino': 573, 'Gothita': 574, 'Gothorita': 575, 'Gothitelle': 576, 'Solosis': 577,
    'Duosion': 578, 'Reuniclus': 579, 'Ducklett': 580, 'Swanna': 581, 'Vanillite': 582, 'Vanillish': 583,
    'Vanilluxe': 584, 'Deerling': 585, 'Sawsbuck': 586, 'Emolga': 587, 'Karrablast': 588, 'Escavalier': 589,
    'Foongus': 590, 'Amoonguss': 591, 'Frillish': 592, 'Jellicent': 593, 'Alomomola': 594, 'Joltik': 595,
    'Galvantula': 596, 'Ferroseed': 597, 'Ferrothorn': 598, 'Klink': 599, 'Klang': 600, 'Klinklang': 601,
    'Tynamo': 602, 'Eelektrik': 603, 'Eelektross': 604, 'Elgyem': 605, 'Beheeyem': 606, 'Litwick': 607,
    'Lampent': 608, 'Chandelure': 609, 'Axew': 610, 'Fraxure': 611, 'Haxorus': 612, 'Cubchoo': 613,
    'Beartic': 614, 'Cryogonal': 615, 'Shelmet': 616, 'Accelgor': 617, 'Stunfisk': 618, 'Mienfoo': 619,
    'Mienshao': 620, 'Druddigon': 621, 'Golett': 622, 'Golurk': 623, 'Pawniard': 624, 'Bisharp': 625,
    'Bouffalant': 626, 'Rufflet': 627, 'Braviary': 628, 'Vullaby': 629, 'Mandibuzz': 630, 'Heatmor': 631,
    'Durant': 632, 'Deino': 633, 'Zweilous': 634, 'Hydreigon': 635, 'Larvesta': 636, 'Volcarona': 637,
    'Cobalion': 638, 'Terrakion': 639, 'Virizion': 640, 'Tornadus': 641, 'Thundurus': 642, 'Reshiram': 643,
    'Zekrom': 644, 'Landorus': 645, 'Kyurem': 646, 'Keldeo': 647, 'Meloetta': 648, 'Genesect': 649
  };

  const id = ids[pokemonName] || ids[pokemonName.toLowerCase().replace(/[.\s']/g, '').replace(/^mr/, 'mr-')] || null;
  if (!id) return `${POKEMON_SPRITE_BASE}/0.png`;

  const spriteMap = {
    'firered-leafgreen': `versions/generation-iii/firered-leafgreen/${id}.png`,
    'ruby-sapphire': `versions/generation-iii/ruby-sapphire/${id}.png`,
    'emerald': `versions/generation-iii/emerald/${id}.png`,
    'heartgold-soulsilver': `versions/generation-iv/heartgold-soulsilver/${id}.png`,
    'platinum': `versions/generation-iv/platinum/${id}.png`,
    'diamond-pearl': `versions/generation-iv/diamond-pearl/${id}.png`,
    'black-white': `versions/generation-v/black-white/${id}.png`,
  };

  const path = spriteMap[gameVersion] || `${id}.png`;
  return `${POKEMON_SPRITE_BASE}/${path}`;
}

// Tipos con colores
export const TYPE_COLORS = {
  normal: '#a8a878', fire: '#f08030', water: '#6890f0', electric: '#f8d030',
  grass: '#78c850', ice: '#98d8d8', fighting: '#c03028', poison: '#a040a0',
  ground: '#e0c068', flying: '#a890f0', psychic: '#f85888', bug: '#a8b820',
  rock: '#b8a038', ghost: '#705898', dragon: '#7038f8', dark: '#705848',
  steel: '#b8b8d0', fairy: '#ee99ac',
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

// === KANTO (Fuego Rojo / Verde Hoja - Gen 3) ===
export const KANTO_GYMS = [
  {
    id: 'brock', name: 'Brock', name_es: 'Brock',
    gym: { es: 'Ciudad Plateada', en: 'Pewter City' },
    type: 'rock', type_es: 'Roca', gen: 3, gameVersion: 'firered-leafgreen',
    badge: { es: 'Medalla Roca', en: 'Boulder Badge' },
    image: '/images/leaders/Brock.png',
    team: [
      { name: 'Geodude', level: 12, moves: ['Tackle', 'Defense Curl', 'Rock Throw'], item: null },
      { name: 'Onix', level: 14, moves: ['Tackle', 'Screech', 'Bind', 'Rock Tomb'], item: null }
    ],
    reward: { es: 'MT39 (Tumba Rocas)', en: 'TM39 (Rock Tomb)' },
    tips: {
      es: [
      'Bulbasaur / Squirtle: Usa Látigo Cepa o Burbuja. Es un paseo.',
      'Charmander: Estrategia Crítica. No uses ataques de fuego. Captura un Mankey en la Ruta 22 (al oeste de Ciudad Verde) y súbelo al nivel 9 para que aprenda Puntapié. Un solo golpe debilita a Geodude y Onix.',
      'Objeto: Baya Aranja (equipada) por si el Tumba Rocas de Onix te baja mucho la velocidad.'
      ],
      en: [
      'Bulbasaur / Squirtle: Use Vine Whip or Bubble. It is a walk in the park.',
      'Charmander: Critical Strategy. Do not use fire attacks. Catch a Mankey on Route 22 (west of Viridian City) and level it to 9 so it learns Low Kick. A single hit weakens Geodude and Onix.',
      'Item: Equip an Oran Berry in case Onix Rock Tomb lowers your speed too much.'
      ]
    }
  },
  {
    id: 'misty', name: 'Misty', name_es: 'Misty',
    gym: { es: 'Ciudad Celeste', en: 'Cerulean City' },
    type: 'water', type_es: 'Agua', gen: 3, gameVersion: 'firered-leafgreen',
    badge: { es: 'Medalla Cascada', en: 'Cascade Badge' },
    image: '/images/leaders/Misty.png',
    team: [
      { name: 'Staryu', level: 18, moves: ['Tackle', 'Water Gun', 'Swift', 'Recover'], item: null },
      { name: 'Starmie', level: 21, moves: ['Tackle', 'Water Gun', 'Swift', 'Bubble Beam'], item: null }
    ],
    reward: { es: 'MT03 (Pistola Agua)', en: 'TM03 (Water Pulse)' },
    tips: {
      es: [
      'Bulbasaur: Ivysaur con Hoja Afilada gana solo.',
      'Squirtle: Wartortle conoce Mordisco, que ayuda con el daño neutral, pero necesitas apoyo. Captura un Pikachu en el Bosque Verde o un Oddish/Bellsprout en la Ruta 24.',
      'Charmander: Charmeleon sufrirá mucho. Captura obligatoria: Un Pikachu o un Oddish. Usa Paralizador de Oddish para frenar la velocidad del Starmie de Misty, que es letal con Pulsos de Agua.'
      ],
      en: [
      'Bulbasaur: Ivysaur with Razor Leaf wins alone.',
      'Squirtle: Wartortle knows Bite, which helps with neutral damage, but you need support. Catch a Pikachu in Viridian Forest or an Oddish/Bellsprout on Route 24.',
      'Charmander: Charmeleon will struggle a lot. Mandatory catch: A Pikachu or Oddish. Use Oddish Stun Spore to slow down Misty Starmie, which is lethal with Water Pulses.'
      ]
    }
  },
  {
    id: 'lt-surge', name: 'Lt. Surge', name_es: 'Surge',
    gym: { es: 'Ciudad Carmín', en: 'Vermilion City' },
    type: 'electric', type_es: 'Eléctrico', gen: 3, gameVersion: 'firered-leafgreen',
    badge: { es: 'Medalla Trueno', en: 'Thunder Badge' },
    image: '/images/leaders/Surge.png',
    team: [
      { name: 'Voltorb', level: 21, moves: ['Sonic Boom', 'Screech', 'Spark', 'Self-Destruct'], item: null },
      { name: 'Pikachu', level: 18, moves: ['Thunder Shock', 'Thunder Wave', 'Quick Attack', 'Double Team'], item: null },
      { name: 'Raichu', level: 24, moves: ['Thunder Shock', 'Thunder Wave', 'Quick Attack', 'Shock Wave'], item: null }
    ],
    reward: { es: 'MT34 (Onda Trueno)', en: 'TM34 (Shock Wave)' },
    tips: {
      es: [
      'Cualquier Inicial: No importa cuál elijas, el Raichu de Surge tiene mucha velocidad.',
      'Captura Clave: Ve a la Cueva Diglett justo al lado y atrapa un Dugtrio (o un Diglett de nivel alto). Su movimiento Magnitud o Excavar termina el combate en dos turnos. Al ser tipo Tierra, los ataques eléctricos no te tocarán.'
      ],
      en: [
      'Any Starter: No matter which you choose, Surge Raichu has high speed.',
      'Key Catch: Go to Diglett Cave right next door and catch a Dugtrio (or a high-level Diglett). Its Magnitude or Dig move ends the battle in two turns. Being Ground type, electric attacks won not touch you.'
      ]
    }
  },
  {
    id: 'erika', name: 'Erika', name_es: 'Erika',
    gym: { es: 'Ciudad Azulona', en: 'Celadon City' },
    type: 'grass', type_es: 'Planta', gen: 3, gameVersion: 'firered-leafgreen',
    badge: { es: 'Medalla Arcoíris', en: 'Rainbow Badge' },
    image: '/images/leaders/Erika.png',
    team: [
      { name: 'Victreebel', level: 29, moves: ['Stun Spore', 'Acid', 'Poison Powder', 'Giga Drain'], item: null },
      { name: 'Tangela', level: 24, moves: ['Ingrain', 'Constrict', 'Vine Whip', 'Poison Powder'], item: null },
      { name: 'Vileplume', level: 29, moves: ['Sleep Powder', 'Acid', 'Stun Spore', 'Giga Drain'], item: null }
    ],
    reward: { es: 'MT19 (Giga Drain)', en: 'TM19 (Giga Drain)' },
    tips: {
      es: [
      'Charmander: Charmeleon con Lanzallamas o Pirotecnia limpia el gimnasio.',
      'Bulbasaur/Squirtle: Necesitas cobertura aérea. Captura un Doduo (Ruta 16) o usa el Pidgeotto que seguramente ya tienes.',
      'Estrategia: El Vileplume de Erika usa Paralizador y Giga Drenado. Equipa Bayas Ciruela para despertar o curar parálisis al instante sin perder el turno de ataque.'
      ],
      en: [
      'Charmander: Charmeleon with Flamethrower or Fire Spin sweeps the gym.',
      'Bulbasaur/Squirtle: You need aerial coverage. Catch a Doduo (Route 16) or use the Pidgeotto you probably already have.',
      'Strategy: Erika Vileplume uses Stun Spore and Giga Drain. Equip Chesto Berries to wake up or cure paralysis instantly without losing your attack turn.'
      ]
    }
  },
  {
    id: 'koga', name: 'Koga', name_es: 'Koga',
    gym: { es: 'Ciudad Fucsia', en: 'Fuchsia City' },
    type: 'poison', type_es: 'Veneno', gen: 3, gameVersion: 'firered-leafgreen',
    badge: { es: 'Medalla Alma', en: 'Soul Badge' },
    image: '/images/leaders/Koga.png',
    team: [
      { name: 'Koffing', level: 37, moves: ['Self-Destruct', 'Sludge', 'Smokescreen', 'Toxic'], item: null },
      { name: 'Muk', level: 39, moves: ['Minimize', 'Sludge', 'Screech', 'Toxic'], item: null },
      { name: 'Koffing', level: 37, moves: ['Self-Destruct', 'Sludge', 'Smokescreen', 'Toxic'], item: null },
      { name: 'Weezing', level: 43, moves: ['Sludge Bomb', 'Toxic', 'Smokescreen', 'Explosion'], item: null }
    ],
    reward: { es: 'MT06 (Tóxico)', en: 'TM06 (Toxic)' },
    tips: {
      es: [
      'Estrategia General: Sus Weezing tienen la habilidad Levitación, así que los ataques de Tierra no sirven.',
      'Movimiento Clave: Usa la MT Psíquico (que te da el Sr. Psíquico en Ciudad Azafrán) en un Pokémon como Kadabra (atrapando un Abra en la Ruta 24).',
      'Inicial: Si tienes a Charizard, usa Lanzallamas. Si tienes a Venusaur, cuidado: el Veneno es súper efectivo contra ti.'
      ],
      en: [
      'General Strategy: His Weezing have the Levitate ability, so Ground attacks won not work.',
      'Key Move: Use the Psychic TM (given by Mr. Psychic in Saffron City) on a Pokémon like Kadabra (catching an Abra on Route 24).',
      'Starter: If you have Charizard, use Flamethrower. If you have Venusaur, be careful: Poison is super effective against you.'
      ]
    }
  },
  {
    id: 'sabrina', name: 'Sabrina', name_es: 'Sabrina',
    gym: { es: 'Ciudad Azafrán', en: 'Saffron City' },
    type: 'psychic', type_es: 'Psíquico', gen: 3, gameVersion: 'firered-leafgreen',
    badge: { es: 'Medalla Pantano', en: 'Marsh Badge' },
    image: '/images/leaders/Sabrina.png',
    team: [
      { name: 'Kadabra', level: 38, moves: ['Psybeam', 'Reflect', 'Future Sight', 'Calm Mind'], item: null },
      { name: 'Mr. Mime', level: 37, moves: ['Psybeam', 'Barrier', 'Baton Pass', 'Calm Mind'], item: null },
      { name: 'Venomoth', level: 38, moves: ['Psybeam', 'Gust', 'Supersonic', 'Calm Mind'], item: null },
      { name: 'Alakazam', level: 43, moves: ['Psybeam', 'Recover', 'Future Sight', 'Calm Mind'], item: null }
    ],
    reward: { es: 'MT04 (Cabezazo Zen)', en: 'TM04 (Calm Mind)' },
    tips: {
      es: [
      'Estrategia de Iniciales: Los iniciales de Kanto tienen mala defensa especial frente a Alakazam.',
      'Captura Clave: Un Snorlax (el que bloquea la ruta). Tiene una defensa especial altísima y su ataque Cuerpo Pesado o Retroceso destrozará a los Pokémon de Sabrina, que tienen una defensa física de papel.',
      'Objeto: Baya Caqui (para la confusión).'
      ],
      en: [
      'Starter Strategy: The Kanto starters have low special defense against Alakazam.',
      'Key Catch: A Snorlax (the one blocking the route). It has extremely high special defense and its Body Slam or Take Down will destroy Sabrina Pokémon, which have paper-thin physical defense.',
      'Item: Persim Berry (for confusion).'
      ]
    }
  },
  {
    id: 'blaine', name: 'Blaine', name_es: 'Blaine',
    gym: { es: 'Isla Canela', en: 'Cinnabar Island' },
    type: 'fire', type_es: 'Fuego', gen: 3, gameVersion: 'firered-leafgreen',
    badge: { es: 'Medalla Volcán', en: 'Volcano Badge' },
    image: '/images/leaders/Blaine.png',
    team: [
      { name: 'Growlithe', level: 42, moves: ['Bite', 'Roar', 'Take Down', 'Fire Spin'], item: null },
      { name: 'Ponyta', level: 40, moves: ['Stomp', 'Bounce', 'Fire Spin', 'Take Down'], item: null },
      { name: 'Rapidash', level: 42, moves: ['Stomp', 'Bounce', 'Fire Spin', 'Take Down'], item: null },
      { name: 'Arcanine', level: 47, moves: ['Bite', 'Roar', 'Take Down', 'Fire Blast'], item: null }
    ],
    reward: { es: 'MT38 (Giro Fuego)', en: 'TM38 (Fire Blast)' },
    tips: {
      es: [
      'Squirtle: Blastoise con Surf es suficiente.',
      'Bulbasaur / Charmander: Necesitas un tipo Agua potente. Si no tienes a Lapras (regalo en Silph Co.), usa la Supercaña para pescar un Gyarados o un Starmie.',
      'Cuidado con: El Llamarada de Arcanine. Si el clima es soleado, el daño aumenta un 50%. Usa Danza Lluvia para neutralizarlo.'
      ],
      en: [
      'Squirtle: Blastoise with Surf is enough.',
      'Bulbasaur / Charmander: You need a powerful Water type. If you don not have Lapras (gift at Silph Co.), use the Super Rod to fish a Gyarados or Starmie.',
      'Watch out for: Arcanine Fire Blast. If the weather is sunny, damage increases by 50%. Use Rain Dance to neutralize it.'
      ]
    }
  },
  {
    id: 'giovanni', name: 'Giovanni', name_es: 'Giovanni',
    gym: { es: 'Ciudad Verde', en: 'Viridian City' },
    type: 'ground', type_es: 'Tierra', gen: 3, gameVersion: 'firered-leafgreen',
    badge: { es: 'Medalla Tierra', en: 'Earth Badge' },
    image: '/images/leaders/Giovanni.png',
    team: [
      { name: 'Rhyhorn', level: 45, moves: ['Stomp', 'Tail Whip', 'Fury Attack', 'Scary Face'], item: null },
      { name: 'Dugtrio', level: 42, moves: ['Dig', 'Sand Tomb', 'Mud-Slap', 'Slash'], item: null },
      { name: 'Nidoqueen', level: 44, moves: ['Double Kick', 'Tail Whip', 'Poison Sting', 'Body Slam'], item: null },
      { name: 'Nidoking', level: 45, moves: ['Double Kick', 'Poison Sting', 'Thrash', 'Earthquake'], item: null },
      { name: 'Rhydon', level: 50, moves: ['Stomp', 'Tail Whip', 'Fury Attack', 'Earthquake'], item: null }
    ],
    reward: { es: 'MT26 (Terremoto)', en: 'TM26 (Earthquake)' },
    tips: {
      es: [
      'Bulbasaur / Squirtle: Venusaur con Giga Drenado o Blastoise con Hidrobomba/Surf. Giovanni no tiene oportunidad.',
      'Charmander: Charizard es inmune a los ataques de Tierra (Terremoto) por ser Volador. Usa ataques especiales, ya que los Pokémon de Giovanni (Rhydon, Nidoking) tienen mucha defensa física pero poca especial.'
      ],
      en: [
      'Bulbasaur / Squirtle: Venusaur with Giga Drain or Blastoise with Hydro Pump/Surf. Giovanni has no chance.',
      'Charmander: Charizard is immune to Ground attacks (Earthquake) for being Flying type. Use special attacks, since Giovanni Pokémon (Rhydon, Nidoking) have high physical defense but low special.'
      ]
    }
  }
];

// === JOHTO (HeartGold / SoulSilver - Gen 4) ===
export const JOHTO_GYMS = [
  {
    id: 'falkner', name: 'Falkner', name_es: 'Pegaso',
    gym: { es: 'Ciudad Malva', en: 'Violet City' },
    type: 'flying', type_es: 'Volador', gen: 4, gameVersion: 'heartgold-soulsilver',
    badge: { es: 'Medalla Aligeradora', en: 'Zephyr Badge' },
    image: '/images/leaders/Pegaso.png',
    team: [
      { name: 'Pidgey', level: 7, moves: ['Tackle', 'Sand Attack', 'Gust'], item: null },
      { name: 'Pidgeotto', level: 9, moves: ['Tackle', 'Sand Attack', 'Gust', 'Quick Attack'], item: null }
    ],
    reward: { es: 'MT51 (Viento Plata)', en: 'TM51 (Roost)' },
    tips: {
      es: [
      'Cyndaquil: Úsalo para desgastar a Pidgey, pero cuidado con Pidgeotto y su Respiro.',
      'Totodile: Daño neutral. Si lo subes al nivel 13, Pistola Agua ayuda.',
      'Chikorita: Peligro. Es muy débil aquí.',
      'Captura obligatoria: Ve a la Ruta 31 (noche) y atrapa un Gastly (su movimiento Maldición o Tinieblas ignora la defensa) o, mejor aún, un Geodude en la Cueva Unión. Geodude es inmune a los ataques de tierra y resiste el tipo Volador; con Lanzarrocas ganas solo.'
      ],
      en: [
      'Cyndaquil: Use it to wear down Pidgey, but beware of Pidgeotto and its Roost.',
      'Totodile: Neutral damage. If you level it to 13, Water Gun helps.',
      'Chikorita: Danger. It is very weak here.',
      'Mandatory catch: Go to Route 31 (night) and catch a Gastly (its Curse or Night Shade ignores defense) or, even better, a Geodude in Union Cave. Geodude is immune to Ground attacks and resists Flying type; with Rock Throw you win alone.'
      ]
    }
  },
  {
    id: 'bugsy', name: 'Bugsy', name_es: 'Anton',
    gym: { es: 'Pueblo Azalea', en: 'Azalea Town' },
    type: 'bug', type_es: 'Bicho', gen: 4, gameVersion: 'heartgold-soulsilver',
    badge: { es: 'Medalla Colmena', en: 'Hive Badge' },
    image: '/images/leaders/Anton.png',
    team: [
      { name: 'Metapod', level: 14, moves: ['Tackle', 'String Shot', 'Harden', 'Bug Bite'], item: null },
      { name: 'Kakuna', level: 14, moves: ['Poison Sting', 'String Shot', 'Harden', 'Bug Bite'], item: null },
      { name: 'Scyther', level: 16, moves: ['Quick Attack', 'Leer', 'U-turn', 'Focus Energy'], item: null }
    ],
    reward: { es: 'MT89 (Golpe U-turn)', en: 'TM89 (U-turn)' },
    tips: {
      es: [
      'Cyndaquil: Quilava con Rueda Fuego barre a Scyther.',
      'Totodile: Colmillo Hielo (nivel 21) es ideal, pero es difícil llegar a ese nivel tan pronto.',
      'Chikorita: Usa Reflejo para aguantar los golpes físicos de Scyther.',
      'Estrategia: El Scyther de Antón usa Ida y Vuelta. Usa un Geodude con Pulimento para ser más rápido y rematar con rocas. No dejes que Scyther use Foco Energía.'
      ],
      en: [
      'Cyndaquil: Quilava with Flame Wheel sweeps Scyther.',
      'Totodile: Ice Fang (level 21) is ideal, but it is hard to reach that level so early.',
      'Chikorita: Use Reflect to withstand Scyther physical hits.',
      'Strategy: Bugsy Scyther uses U-turn. Use a Geodude with Rock Polish to be faster and finish with rocks. Don not let Scyther use Focus Energy.'
      ]
    }
  },
  {
    id: 'whitney', name: 'Whitney', name_es: 'Blanca',
    gym: { es: 'Ciudad Trigal', en: 'Goldenrod City' },
    type: 'normal', type_es: 'Normal', gen: 4, gameVersion: 'heartgold-soulsilver',
    badge: { es: 'Medalla Planicie', en: 'Plain Badge' },
    image: '/images/leaders/Blanca.png',
    team: [
      { name: 'Clefairy', level: 17, moves: ['Double Slap', 'Attract', 'Sing', 'Mimic'], item: null },
      { name: 'Miltank', level: 19, moves: ['Stomp', 'Attract', 'Milk Drink', 'Rollout'], item: 'Lum Berry' }
    ],
    reward: { es: 'MT45 (Atracción)', en: 'TM45 (Attract)' },
    tips: {
      es: [
      'El Reto: Su Miltank usa Atracción y Desenrollar.',
      'Estrategia Maestra: Ve al Centro Comercial de Trigal y cambia un Drowzee por el Machop hembra que te ofrece un NPC. Al ser hembra, el Miltank de Blanca no puede enamorarlo con Atracción. Usa Low Kick (Puntapié) y Miltank caerá rápido debido a su peso.',
      'Objeto: Equipa una Baya Ciruela o Baya Caqui para evitar el retroceso por Pisotón.'
      ],
      en: [
      'The Challenge: Her Miltank uses Attract and Rollout.',
      'Master Strategy: Go to the Goldenrod Department Store and trade a Drowzee for the female Machop an NPC offers. Being female, Whitney Miltank cannot infatuate it with Attract. Use Low Kick and Miltank will fall quickly due to its weight.',
      'Item: Equip a Chesto Berry or Persim Berry to avoid the flinch from Stomp.'
      ]
    }
  },
  {
    id: 'morty', name: 'Morty', name_es: 'Morti',
    gym: { es: 'Ciudad Iris', en: 'Ecruteak City' },
    type: 'ghost', type_es: 'Fantasma', gen: 4, gameVersion: 'heartgold-soulsilver',
    badge: { es: 'Medalla Niebla', en: 'Fog Badge' },
    image: '/images/leaders/Morti.png',
    team: [
      { name: 'Gastly', level: 21, moves: ['Hypnosis', 'Lick', 'Spite', 'Mean Look'], item: null },
      { name: 'Haunter', level: 21, moves: ['Hypnosis', 'Lick', 'Spite', 'Curse'], item: null },
      { name: 'Haunter', level: 23, moves: ['Hypnosis', 'Lick', 'Spite', 'Curse'], item: null },
      { name: 'Gengar', level: 25, moves: ['Hypnosis', 'Shadow Ball', 'Dream Eater', 'Mean Look'], item: null }
    ],
    reward: { es: 'MT30 (Bola Sombra)', en: 'TM30 (Shadow Ball)' },
    tips: {
      es: [
      'Cyndaquil/Totodile: Quilava con Nitrocarga (si juegas remakes) o Totodile con Mordisco.',
      'Chikorita: Úsalo solo para poner pantallas (Reflejo/Velo Sagrado).',
      'Estrategia: El Gengar de Morti usa Sombra Vil (prioridad) y Hipnosis.',
      'Captura Clave: Un Raticate con la habilidad Agallas. Al ser tipo Normal, es inmune a los ataques Fantasma. Si lo equipas con una Baya Ataca y usa Mordisco o Golpe Bajo, limpiarás el gimnasio.'
      ],
      en: [
      'Cyndaquil/Totodile: Quilava with Flame Charge (if playing remakes) or Totodile with Bite.',
      'Chikorita: Use it only to set up screens (Reflect/Light Screen).',
      'Strategy: Morty Gengar uses Shadow Sneak (priority) and Hypnosis.',
      'Key Catch: A Raticate with the Guts ability. Being Normal type, it is immune to Ghost attacks. If you equip it with a Figy Berry and use Bite or Sucker Punch, you will sweep the gym.'
      ]
    }
  },
  {
    id: 'chuck', name: 'Chuck', name_es: 'Marcial',
    gym: { es: 'Ciudad Orquídea', en: 'Cianwood City' },
    type: 'fighting', type_es: 'Lucha', gen: 4, gameVersion: 'heartgold-soulsilver',
    badge: { es: 'Medalla Tormenta', en: 'Storm Badge' },
    image: '/images/leaders/Marcial.png',
    team: [
      { name: 'Primeape', level: 29, moves: ['Leer', 'Rage', 'Karate Chop', 'Fury Swipes'], item: null },
      { name: 'Poliwrath', level: 31, moves: ['Hypnosis', 'Mind Reader', 'Surf', 'Dynamic Punch'], item: null }
    ],
    reward: { es: 'MT01 (Foco Energía)', en: 'TM01 (Focus Punch)' },
    tips: {
      es: [
      'Cualquier inicial: Ninguno tiene ventaja clara.',
      'Captura Clave: Un Pidgeot o un Fearow con Pico Taladro/Ala de Acero. Pero la mejor opción es un Tentacruel (surfeando hacia la ciudad); resiste sus golpes de Lucha y puede desgastar con Surf.',
      'Cuidado: Su Poliwrath usa Puño Dinámico. Si falla, genial; si acierta, te confundirá. Usa Baya Caqui.'
      ],
      en: [
      'Any starter: None has a clear advantage.',
      'Key Catch: A Pidgeot or Fearow with Drill Peck/Steel Wing. But the best option is a Tentacruel (surfing towards the city); it resists his Fighting hits and can wear him down with Surf.',
      'Caution: His Poliwrath uses Dynamic Punch. If it misses, great; if it hits, you will be confused. Use a Persim Berry.'
      ]
    }
  },
  {
    id: 'jasmine', name: 'Jasmine', name_es: 'Yasmina',
    gym: { es: 'Ciudad Olivo', en: 'Olivine City' },
    type: 'steel', type_es: 'Acero', gen: 4, gameVersion: 'heartgold-soulsilver',
    badge: { es: 'Medalla Mineral', en: 'Mineral Badge' },
    image: '/images/leaders/Yasmina.png',
    team: [
      { name: 'Magnemite', level: 30, moves: ['Thunderbolt', 'Supersonic', 'Sonic Boom', 'Thunder Wave'], item: null },
      { name: 'Magnemite', level: 30, moves: ['Thunderbolt', 'Supersonic', 'Sonic Boom', 'Thunder Wave'], item: null },
      { name: 'Steelix', level: 35, moves: ['Screech', 'Rock Throw', 'Iron Tail', 'Sandstorm'], item: null }
    ],
    reward: { es: 'MT23 (Cola Férrea)', en: 'TM23 (Iron Tail)' },
    tips: {
      es: [
      'Cyndaquil: Quilava/Typhlosion con Lanzallamas destruye a Steelix.',
      'Totodile/Chikorita: Sufrirán contra Steelix.',
      'Estrategia: Los Magnemite tienen Onda Trueno. Captura un Quagsire (Ruta 32 surfeando o en la Cueva Unión). Su tipo Tierra lo hace inmune a los rayos y sus ataques de agua/tierra son súper efectivos contra todo su equipo.'
      ],
      en: [
      'Cyndaquil: Quilava/Typhlosion with Flamethrower destroys Steelix.',
      'Totodile/Chikorita: They will struggle against Steelix.',
      'Strategy: The Magnemite have Thunder Wave. Catch a Quagsire (Route 32 surfing or in Union Cave). Its Ground type makes it immune to electric shocks and its Water/Ground attacks are super effective against her entire team.'
      ]
    }
  },
  {
    id: 'pryce', name: 'Pryce', name_es: 'Fredo',
    gym: { es: 'Pueblo Caoba', en: 'Mahogany Town' },
    type: 'ice', type_es: 'Hielo', gen: 4, gameVersion: 'heartgold-soulsilver',
    badge: { es: 'Medalla Glaciar', en: 'Glacier Badge' },
    image: '/images/leaders/Fredo.png',
    team: [
      { name: 'Seel', level: 30, moves: ['Aurora Beam', 'Rest', 'Sleep Talk', 'Take Down'], item: null },
      { name: 'Dewgong', level: 32, moves: ['Aurora Beam', 'Rest', 'Sleep Talk', 'Ice Shard'], item: null },
      { name: 'Piloswine', level: 34, moves: ['Blizzard', 'Ice Shard', 'Earthquake', 'Hail'], item: null }
    ],
    reward: { es: 'MT07 (Granizo)', en: 'TM07 (Hail)' },
    tips: {
      es: [
      'Cyndaquil: Ventaja total con fuego.',
      'Totodile: Feraligatr con Colmillo Hielo resiste, pero usa Fuerza o Surf para daño neutral.',
      'Chikorita: Peligro total. Mantén a Meganium guardado.',
      'Apoyo: Un Heracross (usando Golpe Cabeza en árboles de Ciudad Azalea) con A bocajarro o Demolición destroza a su Piloswine.'
      ],
      en: [
      'Cyndaquil: Total advantage with fire.',
      'Totodile: Feraligatr with Ice Fang resists, but use Strength or Surf for neutral damage.',
      'Chikorita: Total danger. Keep Meganium stored away.',
      'Support: A Heracross (using Headbutt on trees in Azalea Town) with Close Combat or Brick Break destroys his Piloswine.'
      ]
    }
  },
  {
    id: 'clair', name: 'Clair', name_es: 'Debora',
    gym: { es: 'Ciudad Endrino', en: 'Blackthorn City' },
    type: 'dragon', type_es: 'Dragón', gen: 4, gameVersion: 'heartgold-soulsilver',
    badge: { es: 'Medalla Ascuas', en: 'Rising Badge' },
    image: '/images/leaders/Debora.png',
    team: [
      { name: 'Dragonair', level: 38, moves: ['Thunder Wave', 'Surf', 'Slam', 'Dragon Pulse'], item: null },
      { name: 'Dragonair', level: 38, moves: ['Thunder Wave', 'Surf', 'Slam', 'Dragon Pulse'], item: null },
      { name: 'Gyarados', level: 38, moves: ['Bite', 'Dragon Rage', 'Twister', 'Hydro Pump'], item: null },
      { name: 'Kingdra', level: 41, moves: ['Smoke Screen', 'Surf', 'Hyper Beam', 'Dragon Pulse'], item: 'Sitrus Berry' }
    ],
    reward: { es: 'MT59 (Pulso Dragón)', en: 'TM59 (Dragon Pulse)' },
    tips: {
      es: [
      'Totodile: Feraligatr con Colmillo Hielo es tu mejor arma contra sus Dragonair.',
      'Cyndaquil/Chikorita: Muy difícil. Kingdra solo es débil al tipo Dragón (que no tendrás fácilmente).',
      'Estrategia Maestra: El Kingdra de Débora abusa de Cortina Humo y Pulso Dragón.',
      'Captura Clave: Un Lanturn (pescando con Supercaña). Resiste casi todos los ataques de Kingdra y puede paralizarlo con Onda Trueno para que tu inicial pueda rematarlo.',
      'Objeto: Baya Ziuela para curar cualquier estado alterado.'
      ],
      en: [
      'Totodile: Feraligatr with Ice Fang is your best weapon against her Dragonair.',
      'Cyndaquil/Chikorita: Very difficult. Kingdra is only weak to Dragon type (which you won not have easily).',
      'Master Strategy: Clair Kingdra abuses Smoke Screen and Dragon Pulse.',
      'Key Catch: A Lanturn (fishing with Super Rod). It resists almost all of Kingdra attacks and can paralyze it with Thunder Wave so your starter can finish it.',
      'Item: Lum Berry to cure any status condition.'
      ]
    }
  }
];

// === HOENN (Rubí / Zafiro / Esmeralda - Gen 3) ===
export const HOENN_GYMS = [
  {
    id: 'roxanne', name: 'Roxanne', name_es: 'Petra',
    gym: { es: 'Ciudad Férrica', en: 'Rustboro City' },
    type: 'rock', type_es: 'Roca', gen: 3, gameVersion: 'ruby-sapphire',
    badge: { es: 'Medalla Piedra', en: 'Stone Badge' },
    image: '/images/leaders/Petra.png',
    team: [
      { name: 'Geodude', level: 14, moves: ['Tackle', 'Defense Curl', 'Rock Throw'], item: null },
      { name: 'Nosepass', level: 15, moves: ['Tackle', 'Harden', 'Rock Throw', 'Block'], item: 'Potion' }
    ],
    reward: { es: 'MT39 (Tumba Rocas)', en: 'TM39 (Rock Tomb)' },
    tips: {
      es: [
      'Mudkip / Treecko: Es un combate sencillo. Pistola Agua o Absorber ganan solos.',
      'Torchic: Estrategia Crítica. Debes evolucionarlo a Combusken (nivel 16) antes del combate para que aprenda Doble Patada. Con eso ignoras la defensa de roca de sus Geodude y Nosepass.',
      'Objeto: Equipa una Baya Aranja para aguantar el movimiento Tumba Rocas, que baja la velocidad.'
      ],
      en: [
      'Mudkip / Treecko: It is an easy battle. Water Gun or Absorb win alone.',
      'Torchic: Critical Strategy. You must evolve it to Combusken (level 16) before the battle so it learns Double Kick. With that you bypass the rock defense of her Geodude and Nosepass.',
      'Item: Equip an Oran Berry to withstand the Rock Tomb move, which lowers speed.'
      ]
    }
  },
  {
    id: 'brawly', name: 'Brawly', name_es: 'Anibal',
    gym: { es: 'Pueblo Dewford', en: 'Dewford Town' },
    type: 'fighting', type_es: 'Lucha', gen: 3, gameVersion: 'ruby-sapphire',
    badge: { es: 'Medalla Puño', en: 'Knuckle Badge' },
    image: '/images/leaders/Anibal.png',
    team: [
      { name: 'Machop', level: 17, moves: ['Karate Chop', 'Low Kick', 'Seismic Toss', 'Focus Energy'], item: null },
      { name: 'Makuhita', level: 18, moves: ['Arm Thrust', 'Vital Throw', 'Fake Out', 'Sand Attack'], item: null }
    ],
    reward: { es: 'MT08 (Puño Incremento)', en: 'TM08 (Bulk Up)' },
    tips: {
      es: [
      'Treecko / Mudkip: Daño neutral. Usa Tumba Rocas (MT de Petra) para bajarles la velocidad.',
      'Torchic: Combusken (Fuego/Lucha) resiste sus golpes, pero cuidado con el Corpulencia de su Makuhita.',
      'Captura Clave: Un Taillow (Ruta 104) o un Wingull. El movimiento Ataque Ala es demoledor aquí. Si juegas Esmeralda, un Sableye (Cueva Granito) es inmune a todos sus ataques de Lucha.'
      ],
      en: [
      'Treecko / Mudkip: Neutral damage. Use Rock Tomb (TM from Roxanne) to lower their speed.',
      'Torchic: Combusken (Fire/Fighting) resists his hits, but beware of Makuhita Bulk Up.',
      'Key Catch: A Taillow (Route 104) or a Wingull. The move Wing Attack is devastating here. If playing Emerald, a Sableye (Granite Cave) is immune to all his Fighting attacks.'
      ]
    }
  },
  {
    id: 'watson', name: 'Wattson', name_es: 'Erico',
    gym: { es: 'Ciudad Malvalona', en: 'Mauville City' },
    type: 'electric', type_es: 'Eléctrico', gen: 3, gameVersion: 'ruby-sapphire',
    badge: { es: 'Medalla Dinamo', en: 'Dynamo Badge' },
    image: '/images/leaders/Erico.png',
    team: [
      { name: 'Magnemite', level: 22, moves: ['Sonic Boom', 'Thunder Wave', 'Supersonic', 'Spark'], item: null },
      { name: 'Voltorb', level: 20, moves: ['Rollout', 'Spark', 'Self-Destruct', 'Charge'], item: null },
      { name: 'Magneton', level: 23, moves: ['Sonic Boom', 'Thunder Wave', 'Supersonic', 'Spark'], item: null },
      { name: 'Manectric', level: 24, moves: ['Quick Attack', 'Thunder Wave', 'Shock Wave', 'Howl'], item: null }
    ],
    reward: { es: 'MT34 (Onda Trueno)', en: 'TM34 (Shock Wave)' },
    tips: {
      es: [
      'Mudkip: Marshtomp es tipo Tierra. Es inmune a los ataques eléctricos. Usa Disparo Lodo y ganarás sin recibir daño.',
      'Torchic / Treecko: Sufrirán contra Magneton.',
      'Captura Clave: Si no elegiste a Mudkip, captura un Geodude en la Cueva Granito o un Gulpin (Ruta 110) para intoxicar a sus Pokémon.',
      'Estrategia: Magneton tiene mucha defensa física; usa ataques especiales como Lanzallamas o Gigadrenado.'
      ],
      en: [
      'Mudkip: Marshtomp is Ground type. It is immune to electric attacks. Use Mud Shot and you will win without taking damage.',
      'Torchic / Treecko: They will struggle against Magneton.',
      'Key Catch: If you didn not choose Mudkip, catch a Geodude in Granite Cave or a Gulpin (Route 110) to poison his Pokémon.',
      'Strategy: Magneton has very high physical defense; use special attacks like Flamethrower or Giga Drain.'
      ]
    }
  },
  {
    id: 'flannery', name: 'Flannery', name_es: 'Candela',
    gym: { es: 'Pueblo Lavacalda', en: 'Lavaridge Town' },
    type: 'fire', type_es: 'Fuego', gen: 3, gameVersion: 'ruby-sapphire',
    badge: { es: 'Medalla Calor', en: 'Heat Badge' },
    image: '/images/leaders/Candela.png',
    team: [
      { name: 'Numel', level: 26, moves: ['Ember', 'Magnitude', 'Take Down', 'Overheat'], item: null },
      { name: 'Slugma', level: 26, moves: ['Ember', 'Rock Throw', 'Light Screen', 'Overheat'], item: null },
      { name: 'Camerupt', level: 28, moves: ['Ember', 'Magnitude', 'Take Down', 'Overheat'], item: null },
      { name: 'Torkoal', level: 29, moves: ['Ember', 'Body Slam', 'Flail', 'Overheat'], item: 'White Herb' }
    ],
    reward: { es: 'MT50 (Sofoco)', en: 'TM50 (Overheat)' },
    tips: {
      es: [
      'Mudkip: Marshtomp con Disparo Lodo o Surf (MT de tu padre Norman) barre el gimnasio.',
      'Torchic / Treecko: Muy difícil. El Torkoal de Candela usa Sofoco bajo el sol, lo cual es casi un KO instantáneo.',
      'Captura Clave: Un Marill o Pelipper. La clave es usar el movimiento Danza Lluvia para quitarle el clima soleado y reducir la potencia de sus ataques de fuego a la mitad.'
      ],
      en: [
      'Mudkip: Marshtomp with Mud Shot or Surf (TM from your father Norman) sweeps the gym.',
      'Torchic / Treecko: Very difficult. Flannery Torkoal uses Overheat under the sun, which is almost an instant KO.',
      'Key Catch: A Marill or Pelipper. The key is to use the move Rain Dance to remove the sunny weather and reduce the power of her fire attacks by half.'
      ]
    }
  },
  {
    id: 'norman', name: 'Norman', name_es: 'Norman',
    gym: { es: 'Ciudad Petalia', en: 'Petalburg City' },
    type: 'normal', type_es: 'Normal', gen: 3, gameVersion: 'ruby-sapphire',
    badge: { es: 'Medalla Equilibrio', en: 'Balance Badge' },
    image: '/images/leaders/Norman.png',
    team: [
      { name: 'Spinda', level: 27, moves: ['Teeter Dance', 'Psybeam', 'Facade', 'Encore'], item: null },
      { name: 'Vigoroth', level: 27, moves: ['Slash', 'Facade', 'Encore', 'Faint Attack'], item: null },
      { name: 'Linoone', level: 29, moves: ['Slash', 'Facade', 'Headbutt', 'Belly Drum'], item: null },
      { name: 'Slaking', level: 31, moves: ['Counter', 'Yawn', 'Facade', 'Faint Attack'], item: 'Sitrus Berry' }
    ],
    reward: { es: 'MT42 (Imagen)', en: 'TM42 (Facade)' },
    tips: {
      es: [
      'El Reto: Sus Slaking tienen estadísticas de Pokémon Legendario, pero la habilidad Ausente (atacan un turno sí y otro no).',
      'Estrategia Maestra: Usa movimientos de protección. Usa Protección (MT que puedes comprar o aprender) en los turnos que Slaking ataca, y golpéalo en sus turnos de descanso.',
      'Inicial: Combusken con Doble Patada es muy útil. Marshtomp puede aguantar golpes con su alta defensa.',
      'Captura Clave: Un Machoke o un Hariyama (atrapando a Makuhita en la Cueva Granito).'
      ],
      en: [
      'The Challenge: His Slaking have Legendary Pokémon stats, but the Truant ability (they attack one turn and loaf the next).',
      'Master Strategy: Use protection moves. Use Protect (TM you can buy or learn) on the turns Slaking attacks, and hit it on its loafing turns.',
      'Starter: Combusken with Double Kick is very useful. Marshtomp can take hits with its high defense.',
      'Key Catch: A Machoke or Hariyama (catching Makuhita in Granite Cave).'
      ]
    }
  },
  {
    id: 'winona', name: 'Winona', name_es: 'Alana',
    gym: { es: 'Ciudad Arborada', en: 'Fortree City' },
    type: 'flying', type_es: 'Volador', gen: 3, gameVersion: 'ruby-sapphire',
    badge: { es: 'Medalla Pluma', en: 'Feather Badge' },
    image: '/images/leaders/Alana.png',
    team: [
      { name: 'Swablu', level: 29, moves: ['Peck', 'Astonish', 'Sing', 'Fury Attack'], item: null },
      { name: 'Tropius', level: 29, moves: ['Stomp', 'Gust', 'Razor Leaf', 'Aerial Ace'], item: null },
      { name: 'Pelipper', level: 31, moves: ['Wing Attack', 'Supersonic', 'Mist', 'Aerial Ace'], item: null },
      { name: 'Skarmory', level: 31, moves: ['Peck', 'Agility', 'Steel Wing', 'Aerial Ace'], item: null },
      { name: 'Altaria', level: 33, moves: ['Earthquake', 'Dragon Breath', 'Dragon Dance', 'Aerial Ace'], item: 'Hyper Potion' }
    ],
    reward: { es: 'MT40 (Tajo Aéreo)', en: 'TM40 (Aerial Ace)' },
    tips: {
      es: [
      'Mudkip: Swampert con Tumba Rocas o Rayo Hielo (si ya fuiste a la Nao Abandonada).',
      'Torchic / Treecko: Cuidado con Altaria y su Danza Dragón.',
      'Captura Clave: Un Manectric (atrapando a Electrike en la Ruta 110) con Onda Voltio o Rayo.',
      'Estrategia: El Altaria de Alana tiene un Terremoto devastador en Esmeralda. No uses tipos Eléctricos contra él; usa un Pokémon con ataques de Hielo (como un Castform con Nieve Polvo).'
      ],
      en: [
      'Mudkip: Swampert with Rock Tomb or Ice Beam (if you already went to the Abandoned Ship).',
      'Torchic / Treecko: Beware of Altaria and its Dragon Dance.',
      'Key Catch: A Manectric (catching Electrike on Route 110) with Shock Wave or Thunderbolt.',
      'Strategy: Winona Altaria has a devastating Earthquake in Emerald. Do not use Electric types against it; use a Pokémon with Ice attacks (like a Castform with Hail).'
      ]
    }
  },
  {
    id: 'tate-liza', name: 'Tate & Liza', name_es: 'Vito y Leti',
    gym: { es: 'Ciudad Algaria', en: 'Mossdeep City' },
    type: 'psychic', type_es: 'Psíquico', gen: 3, gameVersion: 'ruby-sapphire',
    badge: { es: 'Medalla Mente', en: 'Mind Badge' },
    image: '/images/leaders/Vito_Leti.png',
    team: [
      { name: 'Claydol', level: 41, moves: ['Earthquake', 'Ancient Power', 'Psychic', 'Light Screen'], item: null },
      { name: 'Xatu', level: 41, moves: ['Psychic', 'Aerial Ace', 'Confuse Ray', 'Sunny Day'], item: null },
      { name: 'Lunatone', level: 42, moves: ['Psychic', 'Hypnosis', 'Light Screen', 'Calm Mind'], item: null },
      { name: 'Solrock', level: 42, moves: ['Psychic', 'Sunny Day', 'Solar Beam', 'Flamethrower'], item: null }
    ],
    reward: { es: 'MT04 (Cabezazo Zen)', en: 'TM04 (Calm Mind)' },
    tips: {
      es: [
      'Estrategia General: Es un combate 2 vs 2. Se centran en Solrock y Lunatone.',
      'Inicial: Swampert y Blaziken son débiles a sus ataques psíquicos. Sceptile con Hoja Afilada es bueno, pero frágil.',
      'Captura Clave: Un Sharpedo (pescando con Supercaña). Al ser tipo Siniestro, es inmune a sus ataques Psíquicos. Usa Surf para golpear a ambos oponentes a la vez (pero cuidado, también golpeará a tu compañero si no tiene Protección).'
      ],
      en: [
      'General Strategy: It is a 2 vs 2 battle. They focus on Solrock and Lunatone.',
      'Starter: Swampert and Blaziken are weak to their Psychic attacks. Sceptile with Leaf Blade is good, but fragile.',
      'Key Catch: A Sharpedo (fishing with Super Rod). Being Dark type, it is immune to their Psychic attacks. Use Surf to hit both opponents at once (but careful, it will also hit your partner if they don not have Protect).'
      ]
    }
  },
  {
    id: 'juan', name: 'Juan', name_es: 'Plubio',
    gym: { es: 'Ciudad Calagua', en: 'Lilycove City' },
    type: 'water', type_es: 'Agua', gen: 3, gameVersion: 'ruby-sapphire',
    badge: { es: 'Medalla Lluvia', en: 'Rain Badge' },
    image: '/images/leaders/Plubio.png',
    team: [
      { name: 'Luvdisc', level: 41, moves: ['Water Pulse', 'Attract', 'Sweet Kiss', 'Flail'], item: 'Cheri Berry' },
      { name: 'Whiscash', level: 41, moves: ['Water Pulse', 'Amnesia', 'Magnitude', 'Rest'], item: null },
      { name: 'Sealeo', level: 43, moves: ['Water Pulse', 'Body Slam', 'Aurora Beam', 'Encore'], item: null },
      { name: 'Crawdaunt', level: 43, moves: ['Water Pulse', 'Taunt', 'Crabhammer', 'Swords Dance'], item: null },
      { name: 'Kingdra', level: 46, moves: ['Water Pulse', 'Ice Beam', 'Dragon Breath', 'Body Slam'], item: 'Chesto Berry' }
    ],
    reward: { es: 'MT03 (Pistola Agua)', en: 'TM03 (Water Pulse)' },
    tips: {
      es: [
      'Treecko: Sceptile con Hoja Afilada o Gigadrenado domina aquí.',
      'Mudkip / Torchic: Necesitan cobertura.',
      'Estrategia: Su Kingdra es el mayor problema por Doble Equipo y Descanso.',
      'Captura Clave: Un Lanturn o un Manectric. Usa movimientos que no fallen, como Onda Voltio, para contrarrestar su evasión. Un Pokémon con la habilidad Absorbe Agua (como Vaporeon o Cradily) hace que este combate sea imposible de perder.'
      ],
      en: [
      'Treecko: Sceptile with Leaf Blade or Giga Drain dominates here.',
      'Mudkip / Torchic: They need coverage.',
      'Strategy: His Kingdra is the biggest problem due to Double Team and Rest.',
      'Key Catch: A Lanturn or Manectric. Use moves that never miss, like Shock Wave, to counter his evasion. A Pokémon with the Water Absorb ability (like Vaporeon or Cradily) makes this battle impossible to lose.'
      ]
    }
  }
];

// === SINNOH (Platino - Gen 4) ===
export const SINNOH_GYMS = [
  {
    id: 'roark', name: 'Roark', name_es: 'Roco',
    gym: { es: 'Ciudad Pirita', en: 'Oreburgh City' },
    type: 'rock', type_es: 'Roca', gen: 4, gameVersion: 'platinum',
    badge: { es: 'Medalla Carbón', en: 'Coal Badge' },
    image: '/images/leaders/Roco.png',
    team: [
      { name: 'Geodude', level: 12, moves: ['Stealth Rock', 'Rock Throw', 'Mud Sport'], item: null },
      { name: 'Onix', level: 12, moves: ['Stealth Rock', 'Rock Throw', 'Screech', 'Mud Sport'], item: null },
      { name: 'Cranidos', level: 14, moves: ['Headbutt', 'Pursuit', 'Leer'], item: null }
    ],
    reward: { es: 'MT76 (Giro Roca)', en: 'TM76 (Stealth Rock)' },
    tips: {
      es: [
      'Turtwig / Piplup: Es una victoria asegurada con Absorber o Burbuja.',
      'Chimchar: Estrategia Obligatoria. Debes evolucionarlo a Monferno (nivel 14) para que aprenda Ultrapuño. Al ser un movimiento de prioridad y tipo Lucha, derrotarás a su Cranidos antes de que él pueda tocarte con su altísimo ataque físico.'
      ],
      en: [
      'Turtwig / Piplup: It is a guaranteed victory with Absorb or Bubble.',
      'Chimchar: Mandatory Strategy. You must evolve it to Monferno (level 14) so it learns Mach Punch. Being a priority Fighting move, you will defeat his Cranidos before it can touch you with its extremely high physical attack.'
      ]
    }
  },
  {
    id: 'gardenia', name: 'Gardenia', name_es: 'Gardenia',
    gym: { es: 'Ciudad Vetusta', en: 'Eterna City' },
    type: 'grass', type_es: 'Planta', gen: 4, gameVersion: 'platinum',
    badge: { es: 'Medalla Bosque', en: 'Forest Badge' },
    image: '/images/leaders/Gardenia.png',
    team: [
      { name: 'Cherubi', level: 19, moves: ['Grass Knot', 'Growth', 'Leech Seed', 'Take Down'], item: null },
      { name: 'Turtwig', level: 19, moves: ['Grass Knot', 'Razor Leaf', 'Sunny Day', 'Reflect'], item: null },
      { name: 'Roserade', level: 22, moves: ['Grass Knot', 'Magical Leaf', 'Poison Sting', 'Stun Spore'], item: 'Sitrus Berry' }
    ],
    reward: { es: 'MT86 (Nudo Hierba)', en: 'TM86 (Grass Knot)' },
    tips: {
      es: [
      'Chimchar: Monferno con Rueda Fuego barre el gimnasio.',
      'Piplup / Turtwig: Sufrirán mucho contra su Roserade.',
      'Captura Clave: Un Staravia (evolución de Starly). Su movimiento Ataque Ala es fundamental.',
      'Estrategia: El Roserade de Gardenia usa Hierba Lazo. Como este movimiento hace más daño cuanto más pesado es tu Pokémon, evita usar a tu inicial si ya ha evolucionado y es pesado. Usa a Staravia.'
      ],
      en: [
      'Chimchar: Monferno with Flame Wheel sweeps the gym.',
      'Piplup / Turtwig: They will struggle a lot against her Roserade.',
      'Key Catch: A Staravia (evolution of Starly). Its Wing Attack move is fundamental.',
      'Strategy: Gardenia Roserade uses Grass Knot. Since this move does more damage the heavier your Pokémon is, avoid using your starter if it has already evolved and is heavy. Use Staravia.'
      ]
    }
  },
  {
    id: 'maylene', name: 'Maylene', name_es: 'Brega',
    gym: { es: 'Ciudad Rocavelo', en: 'Veilstone City' },
    type: 'fighting', type_es: 'Lucha', gen: 4, gameVersion: 'platinum',
    badge: { es: 'Medalla Cíclope', en: 'Cobble Badge' },
    image: '/images/leaders/Brega.png',
    team: [
      { name: 'Meditite', level: 28, moves: ['Drain Punch', 'Confusion', 'Fake Out', 'Detect'], item: null },
      { name: 'Machoke', level: 29, moves: ['Brick Break', 'Rock Tomb', 'Focus Energy', 'Foresight'], item: null },
      { name: 'Lucario', level: 32, moves: ['Drain Punch', 'Force Palm', 'Metal Claw', 'Bone Rush'], item: 'Sitrus Berry' }
    ],
    reward: { es: 'MT60 (Puño Drenaje)', en: 'TM60 (Drain Punch)' },
    tips: {
      es: [
      'Chimchar: Monferno/Infernape resiste, pero cuidado con el Lucario de Brega que conoce Garra Metal.',
      'Piplup / Turtwig: Daño neutral.',
      'Estrategia Maestra: Usa un Staraptor con Ataque Ala o un Kadabra (atrapando un Abra en la Ruta 203) con Psíquico. El Lucario de Brega es parte tipo Acero, así que los ataques de Fuego o Tierra de tus iniciales también le duelen mucho.'
      ],
      en: [
      'Chimchar: Monferno/Infernape resists, but beware of Maylene Lucario which knows Metal Claw.',
      'Piplup / Turtwig: Neutral damage.',
      'Master Strategy: Use a Staraptor with Wing Attack or a Kadabra (catching an Abra on Route 203) with Psychic. Maylene Lucario is part Steel type, so the Fire or Ground attacks from your starters also hurt it a lot.'
      ]
    }
  },
  {
    id: 'crasher-wake', name: 'Crasher Wake', name_es: 'Manati',
    gym: { es: 'Ciudad Pastoria', en: 'Pastoria City' },
    type: 'water', type_es: 'Agua', gen: 4, gameVersion: 'platinum',
    badge: { es: 'Medalla Fanal', en: 'Fen Badge' },
    image: '/images/leaders/Manati.png',
    team: [
      { name: 'Gyarados', level: 33, moves: ['Brine', 'Ice Fang', 'Waterfall', 'Bite'], item: null },
      { name: 'Quagsire', level: 34, moves: ['Brine', 'Mud Bomb', 'Mud Sport', 'Water Pulse'], item: null },
      { name: 'Floatzel', level: 37, moves: ['Brine', 'Ice Fang', 'Crunch', 'Aqua Jet'], item: 'Sitrus Berry' }
    ],
    reward: { es: 'MT55 (Brisa Agua)', en: 'TM55 (Brine)' },
    tips: {
      es: [
      'Turtwig: Torterra con Hoja Afilada es excelente, pero cuidado con el Rayo Hielo de su Floatzel.',
      'Chimchar / Piplup: Necesitan apoyo eléctrico.',
      'Captura Clave: Un Luxray (evolución de Shinx). Su habilidad Intimidación bajará el ataque de Gyarados y Floatzel.',
      'Objeto: Baya Gualda en tu planta o eléctrico para curar la parálisis o el sueño.'
      ],
      en: [
      'Turtwig: Torterra with Razor Leaf is excellent, but beware of Floatzel Ice Beam.',
      'Chimchar / Piplup: They need electric support.',
      'Key Catch: A Luxray (evolution of Shinx). Its Intimidate ability will lower the attack of Gyarados and Floatzel.',
      'Item: Sitrus Berry on your Grass or Electric type to cure paralysis or sleep.'
      ]
    }
  },
  {
    id: 'fantina', name: 'Fantina', name_es: 'Fantina',
    gym: { es: 'Ciudad Corazón', en: 'Hearthome City' },
    type: 'ghost', type_es: 'Fantasma', gen: 4, gameVersion: 'platinum',
    badge: { es: 'Medalla Relicario', en: 'Relic Badge' },
    image: '/images/leaders/Fantina.png',
    team: [
      { name: 'Duskull', level: 24, moves: ['Will-O-Wisp', 'Shadow Sneak', 'Pursuit', 'Future Sight'], item: null },
      { name: 'Haunter', level: 24, moves: ['Hypnosis', 'Shadow Ball', 'Night Shade', 'Sucker Punch'], item: null },
      { name: 'Mismagius', level: 26, moves: ['Shadow Ball', 'Psybeam', 'Magical Leaf', 'Confuse Ray'], item: 'Sitrus Berry' }
    ],
    reward: { es: 'MT65 (Golpe Fantasma)', en: 'TM65 (Shadow Claw)' },
    tips: {
      es: [
      'Cualquier Inicial: No tienen ventaja de tipo.',
      'Captura Clave: Un Staravia que conozca Esfuerzo o un Luxio con Mordisco.',
      'Estrategia: Su Mismagius es rapidísimo y pega muy fuerte por el lado especial. Usa un Pokémon de tipo Normal (como Staravia o Bibarel) para ser inmune a sus ataques de tipo Fantasma, y golpéalos con movimientos físicos (donde son débiles).'
      ],
      en: [
      'Any Starter: They have no type advantage.',
      'Key Catch: A Staravia that knows Endeavor or a Luxio with Bite.',
      'Strategy: Her Mismagius is extremely fast and hits very hard on the special side. Use a Normal type Pokémon (like Staravia or Bibarel) to be immune to her Ghost attacks, and hit them with physical moves (where they are weak).'
      ]
    }
  },
  {
    id: 'byron', name: 'Byron', name_es: 'Aceron',
    gym: { es: 'Ciudad Canal', en: 'Canalave City' },
    type: 'steel', type_es: 'Acero', gen: 4, gameVersion: 'platinum',
    badge: { es: 'Medalla Acero', en: 'Mine Badge' },
    image: '/images/leaders/Aceron.png',
    team: [
      { name: 'Magneton', level: 36, moves: ['Thunderbolt', 'Supersonic', 'Mirror Shot', 'Flash Cannon'], item: null },
      { name: 'Steelix', level: 36, moves: ['Earthquake', 'Ice Fang', 'Flash Cannon', 'Sandstorm'], item: null },
      { name: 'Bastiodon', level: 39, moves: ['Iron Head', 'Ancient Power', 'Flash Cannon', 'Taunt'], item: 'Sitrus Berry' }
    ],
    reward: { es: 'MT91 (Cañón Flash)', en: 'TM91 (Flash Cannon)' },
    tips: {
      es: [
      'Chimchar: Infernape con A bocajarro o Lanzallamas gana solo.',
      'Turtwig: Torterra con Terremoto (lo aprende al nivel 32) es una bestia aquí.',
      'Piplup: Empoleon resiste el acero, pero no hace mucho daño. Usa Surf.',
      'Estrategia: Su Bastiodon tiene defensas altísimas. No intentes desgastarlo, usa movimientos de Lucha o Tierra que son x4 efectivos contra él.'
      ],
      en: [
      'Chimchar: Infernape with Close Combat or Flamethrower wins alone.',
      'Turtwig: Torterra with Earthquake (learns it at level 32) is a beast here.',
      'Piplup: Empoleon resists steel, but does not do much damage. Use Surf.',
      'Strategy: His Bastiodon has extremely high defenses. Don not try to wear it down, use Fighting or Ground moves that are x4 effective against it.'
      ]
    }
  },
  {
    id: 'candice', name: 'Candice', name_es: 'Inverna',
    gym: { es: 'Ciudad Nevagua', en: 'Snowpoint City' },
    type: 'ice', type_es: 'Hielo', gen: 4, gameVersion: 'platinum',
    badge: { es: 'Medalla Hielo', en: 'Icicle Badge' },
    image: '/images/leaders/Inverna.png',
    team: [
      { name: 'Sneasel', level: 38, moves: ['Faint Attack', 'Ice Shard', 'Slash', 'Aerial Ace'], item: null },
      { name: 'Piloswine', level: 38, moves: ['Earthquake', 'Ice Fang', 'Stone Edge', 'Hail'], item: null },
      { name: 'Abomasnow', level: 40, moves: ['Wood Hammer', 'Ice Shard', 'Avalanche', 'Ingrain'], item: 'Sitrus Berry' },
      { name: 'Froslass', level: 42, moves: ['Blizzard', 'Shadow Ball', 'Psychic', 'Hail'], item: 'Sitrus Berry' }
    ],
    reward: { es: 'MT72 (Alud)', en: 'TM72 (Avalanche)' },
    tips: {
      es: [
      'Chimchar: Infernape es el rey aquí.',
      'Turtwig: Peligro Extremo. Torterra tiene debilidad x4 al hielo. No lo saques.',
      'Piplup: Empoleon (Acero) resiste el hielo. Usa Foco Resplandor.',
      'Captura Clave: Un Houndoom (Ruta 214) si no elegiste a Chimchar. El fuego es vital para derretir a su Froslass antes de que use Doble Equipo.'
      ],
      en: [
      'Chimchar: Infernape is the king here.',
      'Turtwig: Extreme Danger. Torterra has a x4 weakness to Ice. Don not send it out.',
      'Piplup: Empoleon (Steel) resists ice. Use Flash Cannon.',
      'Key Catch: A Houndoom (Route 214) if you didn not choose Chimchar. Fire is vital to melt her Froslass before it uses Double Team.'
      ]
    }
  },
  {
    id: 'volkner', name: 'Volkner', name_es: 'Electro',
    gym: { es: 'Ciudad Marina', en: 'Sunyshore City' },
    type: 'electric', type_es: 'Eléctrico', gen: 4, gameVersion: 'platinum',
    badge: { es: 'Medalla Faro', en: 'Beacon Badge' },
    image: '/images/leaders/Electro.png',
    team: [
      { name: 'Jolteon', level: 46, moves: ['Thunder', 'Charge Beam', 'Quick Attack', 'Iron Tail'], item: null },
      { name: 'Raichu', level: 46, moves: ['Thunder', 'Charge Beam', 'Focus Blast', 'Quick Attack'], item: null },
      { name: 'Luxray', level: 48, moves: ['Thunder', 'Ice Fang', 'Crunch', 'Fire Fang'], item: 'Sitrus Berry' },
      { name: 'Electivire', level: 50, moves: ['Thunder', 'Fire Punch', 'Giga Impact', 'Quick Attack'], item: 'Sitrus Berry' }
    ],
    reward: { es: 'MT57 (Rayo Carga)', en: 'TM57 (Charge Beam)' },
    tips: {
      es: [
      'Turtwig: Torterra es inmune a la electricidad. Usa Terremoto.',
      'Chimchar / Piplup: Cuidado con el Puño Trueno de Electivire.',
      'Captura Clave: Un Garchomp (atrapando un Gible en la Cueva Extravío bajo el camino de bicis). Es el Pokémon más fuerte de Sinnoh.',
      'Estrategia: Lectro suele usar Voltiocambio para marearte. Si usas un tipo Tierra, el movimiento fallará y no podrá cambiar de Pokémon, dejándolo expuesto.'
      ],
      en: [
      'Turtwig: Torterra is immune to electricity. Use Earthquake.',
      'Chimchar / Piplup: Beware of Electivire Thunder Punch.',
      'Key Catch: A Garchomp (catching a Gible in Wayward Cave under the bike path). It is the strongest Pokémon in Sinnoh.',
      'Strategy: Volkner often uses Volt Switch to mess with you. If you use a Ground type, the move will fail and he won not be able to switch Pokémon, leaving him exposed.'
      ]
    }
  }
];

// === UNOVA (Negro / Blanco - Gen 5) ===
export const UNOVA_GYMS = [
  {
    id: 'cilan', name: 'Cilan', name_es: 'Ciprian',
    gym: { es: 'Ciudad Gres', en: 'Striaton City' },
    type: 'grass', type_es: 'Planta', gen: 5, gameVersion: 'black-white',
    badge: { es: 'Medalla Trío', en: 'Trio Badge' },
    image: '/images/leaders/Ciprian.png',
    note: { es: 'Solo si eliges Tepig', en: 'Only if you chose Tepig' },
    team: [
      { name: 'Lillipup', level: 12, moves: ['Bite', 'Work Up', 'Helping Hand', 'Odor Sleuth'], item: null },
      { name: 'Pansage', level: 14, moves: ['Vine Whip', 'Work Up', 'Lick', 'Fury Swipes'], item: 'Potion' }
    ],
    reward: { es: 'MT83 (Trabajo en Equipo)', en: 'TM83 (Work Up)' },
    tips: {
      es: [
      'Estrategia Fija: El líder siempre será el que tenga ventaja sobre tu inicial.',
      'Captura Obligatoria: Ve al Solar de los Sueños (a la derecha del gimnasio). Un NPC te regalará al mono elemental (Pansear, Pansage o Panpour) que tiene ventaja sobre el líder. Úsalo y el combate será un trámite.'
      ],
      en: [
      'Fixed Strategy: The leader will always be the one with advantage over your starter.',
      'Mandatory Catch: Go to the Dreamyard (to the right of the gym). An NPC will give you the elemental monkey (Pansear, Pansage, or Panpour) that has advantage over the leader. Use it and the battle will be trivial.'
      ]
    }
  },
  {
    id: 'lenora', name: 'Lenora', name_es: 'Aloe',
    gym: { es: 'Ciudad Loza', en: 'Nacrene City' },
    type: 'normal', type_es: 'Normal', gen: 5, gameVersion: 'black-white',
    badge: { es: 'Medalla Base', en: 'Basic Badge' },
    image: '/images/leaders/Aloe.png',
    team: [
      { name: 'Herdier', level: 18, moves: ['Take Down', 'Helping Hand', 'Retaliate', 'Leer'], item: 'Potion' },
      { name: 'Watchog', level: 20, moves: ['Retaliate', 'Hypnosis', 'Crunch', 'Leer'], item: 'Hyper Potion' }
    ],
    reward: { es: 'MT67 (Represalia)', en: 'TM67 (Retaliate)' },
    tips: {
      es: [
      'El Reto: Su Watchog usa Represalia. Si debilitas a su Herdier justo antes, Watchog te hará un OHKO (K.O. de un golpe).',
      'Captura Clave: Un Sawk o Throh (en la hierba de las afueras del Bosque Azulejo). Son tipo Lucha puro y aguantan los golpes físicos.',
      'Objeto: Baya Aranja en tu inicial para sobrevivir al Hipnosis.'
      ],
      en: [
      'The Challenge: Her Watchog uses Retaliate. If you faint her Herdier right before, Watchog will OHKO you (one-hit knockout).',
      'Key Catch: A Sawk or Throh (in the grass outside Pinwheel Forest). They are pure Fighting type and withstand physical hits.',
      'Item: Oran Berry on your starter to survive Hypnosis.'
      ]
    }
  },
  {
    id: 'burgh', name: 'Burgh', name_es: 'Gerania',
    gym: { es: 'Ciudad Porcelana', en: 'Castelia City' },
    type: 'bug', type_es: 'Bicho', gen: 5, gameVersion: 'black-white',
    badge: { es: 'Medalla Coleóptero', en: 'Insect Badge' },
    image: '/images/leaders/Gerania.png',
    team: [
      { name: 'Whirlipede', level: 21, moves: ['Poison Tail', 'Screech', 'Pursuit', 'Protect'], item: null },
      { name: 'Dwebble', level: 21, moves: ['Faint Attack', 'Smack Down', 'Sand Attack', 'Struggle Bug'], item: null },
      { name: 'Leavanny', level: 23, moves: ['Protect', 'String Shot', 'Razor Leaf', 'Struggle Bug'], item: 'Hyper Potion' }
    ],
    reward: { es: 'MT76 (Bicho Lucha)', en: 'TM76 (Struggle Bug)' }
  },
  {
    id: 'elesa', name: 'Elesa', name_es: 'Camila',
    gym: { es: 'Ciudad Mayólica', en: 'Nimbasa City' },
    type: 'electric', type_es: 'Eléctrico', gen: 5, gameVersion: 'black-white',
    badge: { es: 'Medalla Relámpago', en: 'Bolt Badge' },
    image: '/images/leaders/Camila.png',
    team: [
      { name: 'Emolga', level: 27, moves: ['Quick Attack', 'Pursuit', 'Aerial Ace', 'Volt Switch'], item: null },
      { name: 'Zebstrika', level: 27, moves: ['Quick Attack', 'Flame Charge', 'Spark', 'Volt Switch'], item: null },
      { name: 'Emolga', level: 27, moves: ['Quick Attack', 'Pursuit', 'Aerial Ace', 'Volt Switch'], item: 'Hyper Potion' },
      { name: 'Zebstrika', level: 29, moves: ['Quick Attack', 'Flame Charge', 'Spark', 'Volt Switch'], item: 'Sitrus Berry' }
    ],
    reward: { es: 'MT72 (Cambio Voltio)', en: 'TM72 (Volt Switch)' },
    tips: {
      es: [
      'Estrategia: Sus dos Emolga tienen Voltiocambio. Entran, pegan y salen.',
      'Captura Clave: Un Sandile (Ruta 4) con la habilidad Intimidación. Al ser tipo Tierra, corta en seco el Voltiocambio (el movimiento falla si el objetivo es inmune) y evita que cambien de Pokémon.',
      'Inicial: Si tienes a Pignite, usa Nitrocarga para subir tu velocidad y atacar antes que sus Emolga.'
      ],
      en: [
      'Strategy: Her two Emolga have Volt Switch. They come in, hit, and leave.',
      'Key Catch: A Sandile (Route 4) with the Intimidate ability. Being Ground type, it completely shuts down Volt Switch (the move fails if the target is immune) and prevents them from switching Pokémon.',
      'Starter: If you have Pignite, use Flame Charge to boost your speed and attack before her Emolga.'
      ]
    }
  },
  {
    id: 'clay', name: 'Clay', name_es: 'Yakon',
    gym: { es: 'Ciudad Loza', en: 'Driftveil City' },
    type: 'ground', type_es: 'Tierra', gen: 5, gameVersion: 'black-white',
    badge: { es: 'Medalla Temblor', en: 'Quake Badge' },
    image: '/images/leaders/Yakon.png',
    team: [
      { name: 'Krokorok', level: 31, moves: ['Crunch', 'Bulldoze', 'Sand Tomb', 'Torment'], item: null },
      { name: 'Sandslash', level: 31, moves: ['Crush Claw', 'Bulldoze', 'Fury Cutter', 'Sand Attack'], item: null },
      { name: 'Excadrill', level: 33, moves: ['Slash', 'Rock Slide', 'Bulldoze', 'Hone Claws'], item: 'Hyper Potion' }
    ],
    reward: { es: 'MT78 (Terratemblor)', en: 'TM78 (Bulldoze)' },
    tips: {
      es: [
      'Oshawott / Snivy: Dewott o Servine tienen ventaja clara. Cuidado con el Afilagarras de su Excadrill.',
      'Tepig: Emboar sufre mucho aquí.',
      'Estrategia Maestra: Captura un Ducklett (en el Puente de Fayenza). Es tipo Agua/Volador, lo que lo hace inmune a los ataques de tierra de Yakón y puede contratacar con agua.'
      ],
      en: [
      'Oshawott / Snivy: Dewott or Servine have clear advantage. Beware of Excadrill Slash.',
      'Tepig: Emboar struggles a lot here.',
      'Master Strategy: Catch a Ducklett (on Driftveil Drawbridge). It is Water/Flying type, which makes it immune to Clay Ground attacks and can counter with Water.'
      ]
    }
  },
  {
    id: 'skyla', name: 'Skyla', name_es: 'Maiz',
    gym: { es: 'Ciudad Teja', en: 'Mistralton City' },
    type: 'flying', type_es: 'Volador', gen: 5, gameVersion: 'black-white',
    badge: { es: 'Medalla Jet', en: 'Jet Badge' },
    image: '/images/leaders/Maiz.png',
    team: [
      { name: 'Swoobat', level: 33, moves: ['Amnesia', 'Air Slash', 'Attract', 'Heart Stamp'], item: null },
      { name: 'Unfezant', level: 33, moves: ['Quick Attack', 'Air Slash', 'Razor Wind', 'Leer'], item: null },
      { name: 'Skarmory', level: 33, moves: ['Agility', 'Air Slash', 'Steel Wing', 'Fury Attack'], item: null },
      { name: 'Swanna', level: 35, moves: ['Aqua Ring', 'Aerial Ace', 'Air Slash', 'Roost'], item: 'Hyper Potion' }
    ],
    reward: { es: 'MT62 (Viento Afín)', en: 'TM62 (Acrobatics)' },
    tips: {
      es: [
      'Estrategia General: Su Swanna es peligrosa.',
      'Inicial: Usa a tu inicial como cebo y cambia a un tipo Eléctrico o Roca.',
      'Captura Clave: Un Joltik (Cueva Electrolita). Su movimiento Electrotela baja la velocidad de sus pájaros y les hace daño x4 (en el caso de Sigilyph o Swoobat es x2).'
      ],
      en: [
      'General Strategy: Her Swanna is dangerous.',
      'Starter: Use your starter as bait and switch to an Electric or Rock type.',
      'Key Catch: A Joltik (Chargestone Cave). Its Electroweb move lowers the speed of her birds and does x4 damage (x2 in the case of Sigilyph or Swoobat).'
      ]
    }
  },
  {
    id: 'brycen', name: 'Brycen', name_es: 'Hiedra',
    gym: { es: 'Pueblo Lodos', en: 'Icirrus City' },
    type: 'ice', type_es: 'Hielo', gen: 5, gameVersion: 'black-white',
    badge: { es: 'Medalla Helada', en: 'Freeze Badge' },
    image: '/images/leaders/Hiedra.png',
    team: [
      { name: 'Vanillish', level: 37, moves: ['Astonish', 'Blizzard', 'Hail', 'Mirror Shot'], item: null },
      { name: 'Cryogonal', level: 37, moves: ['Aurora Beam', 'Reflect', 'Slash', 'Ice Beam'], item: null },
      { name: 'Beartic', level: 39, moves: ['Swagger', 'Slash', 'Icicle Crash', 'Brick Break'], item: 'Hyper Potion' }
    ],
    reward: { es: 'MT79 (Hielo Puntiagudo)', en: 'TM79 (Frost Breath)' }
  },
  {
    id: 'drayden', name: 'Drayden', name_es: 'Iris',
    gym: { es: 'Ciudad Caolín', en: 'Opelucid City' },
    type: 'dragon', type_es: 'Dragón', gen: 5, gameVersion: 'black-white',
    badge: { es: 'Medalla Legendario', en: 'Legend Badge' },
    image: '/images/leaders/Iris.png',
    note: { es: 'Versión Negro', en: 'Black version' },
    team: [
      { name: 'Fraxure', level: 41, moves: ['Dragon Dance', 'Dragon Rage', 'Assurance', 'Slash'], item: null },
      { name: 'Druddigon', level: 41, moves: ['Crunch', 'Dragon Claw', 'Revenge', 'Chip Away'], item: null },
      { name: 'Haxorus', level: 43, moves: ['Dragon Dance', 'Assurance', 'Dragon Tail', 'X-Scissor'], item: 'Hyper Potion' }
    ],
    reward: { es: 'MT82 (Cola Dragón)', en: 'TM82 (Dragon Tail)' },
    tips: {
      es: [
      'Estrategia: Sus dragones usan Danza Dragón. Si se cargan dos veces, perdiste.',
      'Captura Clave: Un Haxorus (evolucionando a Axew de la Cueva Loza) o un Mamoswine (evolucionando a Piloswine en las rutas heladas). El tipo Hielo es fundamental.',
      'Objeto: Baya Ziuela para evitar que te confundan con Enfado.'
      ],
      en: [
      'Strategy: His dragons use Dragon Dance. If they set up twice, you lost.',
      'Key Catch: A Haxorus (evolving from Axew in Mistralton Cave) or a Mamoswine (evolving from Piloswine on the icy routes). Ice type is essential.',
      'Item: Lum Berry to prevent confusion from Outrage.'
      ]
    }
  }
];

export const ALL_GYM_LEADERS = [
  { region: 'kanto', label_es: 'Kanto', label_en: 'Kanto', gen: 3, color: '#ef5350', leaders: KANTO_GYMS },
  { region: 'johto', label_es: 'Johto', label_en: 'Johto', gen: 4, color: '#42a5f5', leaders: JOHTO_GYMS },
  { region: 'hoenn', label_es: 'Hoenn', label_en: 'Hoenn', gen: 3, color: '#66bb6a', leaders: HOENN_GYMS },
  { region: 'sinnoh', label_es: 'Sinnoh', label_en: 'Sinnoh', gen: 4, color: '#ab47bc', leaders: SINNOH_GYMS },
  { region: 'unova', label_es: 'Unova', label_en: 'Unova', gen: 5, color: '#ffa726', leaders: UNOVA_GYMS },
];
