// Métodos de obtención alternativa para Pokémon que no aparecen en encuentros salvajes
// Organizado por generación

export const POKEMON_OBTENCION = {
  // === GEN 1 (Kanto) ===
  // Starters
  'Bulbasaur': { method: 'gift', location_es: 'Pueblo Paleta (regalo del Profesor Oak)', location_en: 'Pallet Town (Professor Oak gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 1 },
  'Charmander': { method: 'gift', location_es: 'Pueblo Paleta (regalo del Profesor Oak)', location_en: 'Pallet Town (Professor Oak gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 1 },
  'Squirtle': { method: 'gift', location_es: 'Pueblo Paleta (regalo del Profesor Oak)', location_en: 'Pallet Town (Professor Oak gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 1 },
  
  // Fósiles
  'Omanyte': { method: 'fossil', location_es: 'Laboratorio Canela (resurrección de fósil)', location_en: 'Cinnabar Lab (fossil resurrection)', note_es: 'Fósil Helix', note_en: 'Helix Fossil', gen: 1 },
  'Kabuto': { method: 'fossil', location_es: 'Laboratorio Canela (resurrección de fósil)', location_en: 'Cinnabar Lab (fossil resurrection)', note_es: 'Fósil Dome', note_en: 'Dome Fossil', gen: 1 },
  'Aerodactyl': { method: 'fossil', location_es: 'Laboratorio Canela (resurrección de fósil)', location_en: 'Cinnabar Lab (fossil resurrection)', note_es: 'Amber Viejo', note_en: 'Old Amber', gen: 1 },
  
  // Regalos especiales
  'Lapras': { method: 'gift', location_es: 'Silph S.A. (piso 7)', location_en: 'Silph Co. (7th floor)', note_es: 'Regalo de empleado', note_en: 'Employee gift', gen: 1 },
  'Hitmonlee': { method: 'gift', location_es: 'Dojo de Lucha (Ciudad Azafrán)', location_en: 'Fighting Dojo (Saffron City)', note_es: 'Elegir entre Hitmonlee/Hitmonchan', note_en: 'Choose between Hitmonlee/Hitmonchan', gen: 1 },
  'Hitmonchan': { method: 'gift', location_es: 'Dojo de Lucha (Ciudad Azafrán)', location_en: 'Fighting Dojo (Saffron City)', note_es: 'Elegir entre Hitmonlee/Hitmonchan', note_en: 'Choose between Hitmonlee/Hitmonchan', gen: 1 },
  
  // Evoluciones por intercambio
  'Alakazam': { method: 'trade-evolution', location_es: 'Intercambiar Kadabra', location_en: 'Trade Kadabra', note_es: 'Evoluciona al intercambiar', note_en: 'Evolves when traded', gen: 1 },
  'Machamp': { method: 'trade-evolution', location_es: 'Intercambiar Machoke', location_en: 'Trade Machoke', note_es: 'Evoluciona al intercambiar', note_en: 'Evolves when traded', gen: 1 },
  'Golem': { method: 'trade-evolution', location_es: 'Intercambiar Graveler', location_en: 'Trade Graveler', note_es: 'Evoluciona al intercambiar', note_en: 'Evolves when traded', gen: 1 },
  'Gengar': { method: 'trade-evolution', location_es: 'Intercambiar Haunter', location_en: 'Trade Haunter', note_es: 'Evoluciona al intercambiar', note_en: 'Evolves when traded', gen: 1 },
  
  // Legendarios
  'Articuno': { method: 'legendary', location_es: 'Islas Espuma', location_en: 'Seafoam Islands', note_es: 'Nivel 50', note_en: 'Level 50', gen: 1 },
  'Zapdos': { method: 'legendary', location_es: 'Central Energía', location_en: 'Power Plant', note_es: 'Nivel 50', note_en: 'Level 50', gen: 1 },
  'Moltres': { method: 'legendary', location_es: 'Camino Victoria', location_en: 'Victory Road', note_es: 'Nivel 50', note_en: 'Level 50', gen: 1 },
  'Mewtwo': { method: 'legendary', location_es: 'Cueva Celeste', location_en: 'Cerulean Cave', note_es: 'Nivel 70', note_en: 'Level 70', gen: 1 },
  'Mew': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Solo por eventos oficiales', note_en: 'Only via official events', gen: 1 },
  
  // Pokémon de intercambio NPC
  'Farfetch\'d': { method: 'trade-npc', location_es: 'Ciudad Azulona (restaurante)', location_en: 'Celadon City (restaurant)', note_es: 'Intercambiar por Spearow', note_en: 'Trade for Spearow', gen: 1 },
  'Mr. Mime': { method: 'trade-npc', location_es: 'Ruta 2 (casa del intercambista)', location_en: 'Route 2 (trader house)', note_es: 'Intercambiar por Abra', note_en: 'Trade for Abra', gen: 1 },
  'Jynx': { method: 'trade-npc', location_es: 'Ciudad Carmín', location_en: 'Vermilion City', note_es: 'Intercambiar por Poliwhirl', note_en: 'Trade for Poliwhirl', gen: 1 },
  'Electabuzz': { method: 'gift', location_es: 'Central Energía', location_en: 'Power Plant', note_es: 'Área oculta', note_en: 'Hidden area', gen: 1 },
  'Magmar': { method: 'gift', location_es: 'Mansión Pokémon', location_en: 'Pokemon Mansion', note_es: 'Área oculta', note_en: 'Hidden area', gen: 1 },
  
  // Eeveelutions (evolución por piedra)
  'Vaporeon': { method: 'evolution-item', location_es: 'Evolucionar Eevee con Piedra Agua', location_en: 'Evolve Eevee with Water Stone', note_es: 'Piedra Agua', note_en: 'Water Stone', gen: 1 },
  'Jolteon': { method: 'evolution-item', location_es: 'Evolucionar Eevee con Piedra Trueno', location_en: 'Evolve Eevee with Thunder Stone', note_es: 'Piedra Trueno', note_en: 'Thunder Stone', gen: 1 },
  'Flareon': { method: 'evolution-item', location_es: 'Evolucionar Eevee con Piedra Fuego', location_en: 'Evolve Eevee with Fire Stone', note_es: 'Piedra Fuego', note_en: 'Fire Stone', gen: 1 },
  
  // Exeggutor y otros de piedra
  'Exeggutor': { method: 'evolution-item', location_es: 'Evolucionar Exeggcute con Leaf Stone', location_en: 'Evolve Exeggcute with Leaf Stone', note_es: 'Piedra Hoja', note_en: 'Leaf Stone', gen: 1 },
  'Ninetales': { method: 'evolution-item', location_es: 'Evolucionar Vulpix con Piedra Fuego', location_en: 'Evolve Vulpix with Fire Stone', note_es: 'Piedra Fuego', note_en: 'Fire Stone', gen: 1 },
  'Arcanine': { method: 'evolution-item', location_es: 'Evolucionar Growlithe con Piedra Fuego', location_en: 'Evolve Growlithe with Fire Stone', note_es: 'Piedra Fuego', note_en: 'Fire Stone', gen: 1 },
  'Poliwrath': { method: 'evolution-item', location_es: 'Evolucionar Poliwhirl con Piedra Agua', location_en: 'Evolve Poliwhirl with Water Stone', note_es: 'Piedra Agua', note_en: 'Water Stone', gen: 1 },
  'Clefable': { method: 'evolution-item', location_es: 'Evolucionar Clefairy con Piedra Lunar', location_en: 'Evolve Clefairy with Moon Stone', note_es: 'Piedra Lunar', note_en: 'Moon Stone', gen: 1 },
  'Wigglytuff': { method: 'evolution-item', location_es: 'Evolucionar Jigglypuff con Piedra Lunar', location_en: 'Evolve Jigglypuff with Moon Stone', note_es: 'Piedra Lunar', note_en: 'Moon Stone', gen: 1 },
  'Nidoqueen': { method: 'evolution-item', location_es: 'Evolucionar Nidorina con Piedra Lunar', location_en: 'Evolve Nidorina with Moon Stone', note_es: 'Piedra Lunar', note_en: 'Moon Stone', gen: 1 },
  'Nidoking': { method: 'evolution-item', location_es: 'Evolucionar Nidorino con Piedra Lunar', location_en: 'Evolve Nidorino with Moon Stone', note_es: 'Piedra Lunar', note_en: 'Moon Stone', gen: 1 },
  'Starmie': { method: 'evolution-item', location_es: 'Evolucionar Staryu con Piedra Agua', location_en: 'Evolve Staryu with Water Stone', note_es: 'Piedra Agua', note_en: 'Water Stone', gen: 1 },
  'Vileplume': { method: 'evolution-item', location_es: 'Evolucionar Gloom con Leaf Stone', location_en: 'Evolve Gloom with Leaf Stone', note_es: 'Piedra Hoja', note_en: 'Leaf Stone', gen: 1 },
  'Bellossom': { method: 'evolution-item', location_es: 'Evolucionar Gloom con Sun Stone', location_en: 'Evolve Gloom with Sun Stone', note_es: 'Piedra Solar (Gen 2+)', note_en: 'Sun Stone (Gen 2+)', gen: 2 },
  
  // === GEN 2 (Johto) ===
  'Chikorita': { method: 'gift', location_es: 'Pueblo Primavera (regalo del Profesor Elm)', location_en: 'New Bark Town (Professor Elm gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 2 },
  'Cyndaquil': { method: 'gift', location_es: 'Pueblo Primavera (regalo del Profesor Elm)', location_en: 'New Bark Town (Professor Elm gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 2 },
  'Totodile': { method: 'gift', location_es: 'Pueblo Primavera (regalo del Profesor Elm)', location_en: 'New Bark Town (Professor Elm gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 2 },
  
  // Legendarios Gen 2
  'Raikou': { method: 'legendary', location_es: 'Johto (deambula tras torre quemada)', location_en: 'Johto (roams after Burned Tower)', note_es: 'Deambulante', note_en: 'Roaming', gen: 2 },
  'Entei': { method: 'legendary', location_es: 'Johto (deambula tras torre quemada)', location_en: 'Johto (roams after Burned Tower)', note_es: 'Deambulante', note_en: 'Roaming', gen: 2 },
  'Suicune': { method: 'legendary', location_es: 'Torre Latón / Ruinas de Alfa / Meseta Añil', location_en: 'Tin Tower / Ruins of Alph / Indigo Plateau', note_es: 'Evento especial', note_en: 'Special event', gen: 2 },
  'Lugia': { method: 'legendary', location_es: 'Islas Remolino', location_en: 'Whirl Islands', note_es: 'Nivel 70', note_en: 'Level 70', gen: 2 },
  'Ho-Oh': { method: 'legendary', location_es: 'Torre Latón', location_en: 'Tin Tower', note_es: 'Nivel 70 (necesita Rainbow Wing)', note_en: 'Level 70 (needs Rainbow Wing)', gen: 2 },
  'Celebi': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Solo por eventos oficiales', note_en: 'Only via official events', gen: 2 },
  
  // Gen 2 trade evolutions
  'Steelix': { method: 'trade-evolution', location_es: 'Intercambiar Onix con Metal Coat', location_en: 'Trade Onix holding Metal Coat', note_es: 'Necesita Revestimiento Metálico', note_en: 'Needs Metal Coat', gen: 2 },
  'Scizor': { method: 'trade-evolution', location_es: 'Intercambiar Scyther con Metal Coat', location_en: 'Trade Scyther holding Metal Coat', note_es: 'Necesita Revestimiento Metálico', note_en: 'Needs Metal Coat', gen: 2 },
  'Kingdra': { method: 'trade-evolution', location_es: 'Intercambiar Seadra con Dragon Scale', location_en: 'Trade Seadra holding Dragon Scale', note_es: 'Necesita Escama Dragón', note_en: 'Needs Dragon Scale', gen: 2 },
  'Porygon2': { method: 'trade-evolution', location_es: 'Intercambiar Porygon con Upgrade', location_en: 'Trade Porygon holding Upgrade', note_es: 'Necesita mejora (Upgrade)', note_en: 'Needs Upgrade', gen: 2 },
  'Politoed': { method: 'trade-evolution', location_es: 'Intercambiar Poliwhirl con King\'s Rock', location_en: 'Trade Poliwhirl holding King\'s Rock', note_es: 'Necesita Roca del Rey', note_en: 'Needs King\'s Rock', gen: 2 },
  'Slowking': { method: 'trade-evolution', location_es: 'Intercambiar Slowpoke con King\'s Rock', location_en: 'Trade Slowpoke holding King\'s Rock', note_es: 'Necesita Roca del Rey', note_en: 'Needs King\'s Rock', gen: 2 },
  'Blissey': { method: 'friendship', location_es: 'Subir amistad de Chansey', location_en: 'Raise Chansey friendship', note_es: 'Evoluciona con alta amistad', note_en: 'Evolves with high friendship', gen: 2 },
  'Crobat': { method: 'friendship', location_es: 'Subir amistad de Golbat', location_en: 'Raise Golbat friendship', note_es: 'Evoluciona con alta amistad', note_en: 'Evolves with high friendship', gen: 2 },
  'Espeon': { method: 'friendship', location_es: 'Subir amistad de Eevee (día)', location_en: 'Raise Eevee friendship (day)', note_es: 'Alta amistad durante el día', note_en: 'High friendship during day', gen: 2 },
  'Umbreon': { method: 'friendship', location_es: 'Subir amistad de Eevee (noche)', location_en: 'Raise Eevee friendship (night)', note_es: 'Alta amistad durante la noche', note_en: 'High friendship during night', gen: 2 },
  
  // Gen 2 special
  'Togepi': { method: 'gift', location_es: 'Pueblo Primavera (regalo)', location_en: 'New Bark Town (gift)', note_es: 'Huevo del Profesor Elm', note_en: 'Professor Elm egg', gen: 2 },
  'Tyrogue': { method: 'gift', location_es: 'Monte Morto (regalo)', location_en: 'Mt. Mortar (gift)', note_es: 'Regalo de entrenador', note_en: 'Trainer gift', gen: 2 },
  
  // === GEN 3 (Hoenn) ===
  'Treecko': { method: 'gift', location_es: 'Pueblo Raíz (regalo del Profesor Birch)', location_en: 'Littleroot Town (Professor Birch gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 3 },
  'Torchic': { method: 'gift', location_es: 'Pueblo Raíz (regalo del Profesor Birch)', location_en: 'Littleroot Town (Professor Birch gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 3 },
  'Mudkip': { method: 'gift', location_es: 'Pueblo Raíz (regalo del Profesor Birch)', location_en: 'Littleroot Town (Professor Birch gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 3 },
  
  // Legendarios Gen 3
  'Regirock': { method: 'legendary', location_es: 'Tumba Antigua', location_en: 'Desert Ruins', note_es: 'Nivel 40', note_en: 'Level 40', gen: 3 },
  'Regice': { method: 'legendary', location_es: 'Cueva de la Isla', location_en: 'Island Cave', note_es: 'Nivel 40', note_en: 'Level 40', gen: 3 },
  'Registeel': { method: 'legendary', location_es: 'Cueva Losa Agostada', location_en: 'Ancient Tomb', note_es: 'Nivel 40', note_en: 'Level 40', gen: 3 },
  'Latias': { method: 'legendary', location_es: 'Deambula por Hoenn (después de liga)', location_en: 'Roams Hoenn (after league)', note_es: 'Deambulante', note_en: 'Roaming', gen: 3 },
  'Latios': { method: 'legendary', location_es: 'Deambula por Hoenn (después de liga)', location_en: 'Roams Hoenn (after league)', note_es: 'Deambulante', note_en: 'Roaming', gen: 3 },
  'Kyogre': { method: 'legendary', location_es: 'Caverna Abisal', location_en: 'Seafloor Cavern', note_es: 'Nivel 45', note_en: 'Level 45', gen: 3 },
  'Groudon': { method: 'legendary', location_es: 'Cueva Ancestral', location_en: 'Cave of Origin', note_es: 'Nivel 45', note_en: 'Level 45', gen: 3 },
  'Rayquaza': { method: 'legendary', location_es: 'Pilar Celeste', location_en: 'Sky Pillar', note_es: 'Nivel 70', note_en: 'Level 70', gen: 3 },
  'Jirachi': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Solo por eventos oficiales', note_en: 'Only via official events', gen: 3 },
  'Deoxys': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Solo por eventos oficiales', note_en: 'Only via official events', gen: 3 },
  
  // Trade evolutions Gen 3
  'Huntail': { method: 'trade-evolution', location_es: 'Intercambiar Clamperl con Deep Sea Tooth', location_en: 'Trade Clamperl holding Deep Sea Tooth', note_es: 'Necesita Diente Marino', note_en: 'Needs Deep Sea Tooth', gen: 3 },
  'Gorebyss': { method: 'trade-evolution', location_es: 'Intercambiar Clamperl con Deep Sea Scale', location_en: 'Trade Clamperl holding Deep Sea Scale', note_es: 'Necesita Escama Marina', note_en: 'Needs Deep Sea Scale', gen: 3 },
  
  // === GEN 4 (Sinnoh) ===
  'Turtwig': { method: 'gift', location_es: 'Lago Verdad (regalo del Profesor Rowan)', location_en: 'Lake Verity (Professor Rowan gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 4 },
  'Chimchar': { method: 'gift', location_es: 'Lago Verdad (regalo del Profesor Rowan)', location_en: 'Lake Verity (Professor Rowan gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 4 },
  'Piplup': { method: 'gift', location_es: 'Lago Verdad (regalo del Profesor Rowan)', location_en: 'Lake Verity (Professor Rowan gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 4 },
  
  // Legendarios Gen 4
  'Uxie': { method: 'legendary', location_es: 'Lago Agudeza', location_en: 'Lake Acuity', note_es: 'Nivel 50', note_en: 'Level 50', gen: 4 },
  'Mesprit': { method: 'legendary', location_es: 'Lago Valor', location_en: 'Lake Valor', note_es: 'Nivel 50 (deambula tras combate)', note_en: 'Level 50 (roams after battle)', gen: 4 },
  'Azelf': { method: 'legendary', location_es: 'Lago Verdad', location_en: 'Lake Verity', note_es: 'Nivel 50', note_en: 'Level 50', gen: 4 },
  'Dialga': { method: 'legendary', location_es: 'Pilar del Flecha', location_en: 'Spear Pillar', note_es: 'Nivel 47', note_en: 'Level 47', gen: 4 },
  'Palkia': { method: 'legendary', location_es: 'Pilar del Flecha', location_en: 'Spear Pillar', note_es: 'Nivel 47', note_en: 'Level 47', gen: 4 },
  'Heatran': { method: 'legendary', location_es: 'Monte Dura', location_en: 'Stark Mountain', note_es: 'Nivel 70', note_en: 'Level 70', gen: 4 },
  'Regigigas': { method: 'legendary', location_es: 'Sala del Origen', location_en: 'Hall of Origin', note_es: 'Necesita los 3 Regis', note_en: 'Needs all 3 Regis', gen: 4 },
  'Giratina': { method: 'legendary', location_es: 'Mundo Distorsión / Senda Retorno', location_en: 'Distortion World / Turnback Cave', note_es: 'Nivel 47', note_en: 'Level 47', gen: 4 },
  'Cresselia': { method: 'legendary', location_es: 'Isla Llena (deambula tras combate)', location_en: 'Fullmoon Island (roams after battle)', note_es: 'Deambulante', note_en: 'Roaming', gen: 4 },
  'Manaphy': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Solo por eventos oficiales', note_en: 'Only via official events', gen: 4 },
  'Phione': { method: 'breeding', location_es: 'Criar Manaphy', location_en: 'Breed Manaphy', note_es: 'Huevo de Manaphy en Guardería', note_en: 'Manaphy egg at Day Care', gen: 4 },
  'Darkrai': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Solo por eventos oficiales', note_en: 'Only via official events', gen: 4 },
  'Shaymin': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Solo por eventos oficiales', note_en: 'Only via official events', gen: 4 },
  'Arceus': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Solo por eventos oficiales', note_en: 'Only via official events', gen: 4 },
  
  // Trade evolutions Gen 4
  'Magmortar': { method: 'trade-evolution', location_es: 'Intercambiar Magmar con Magmarizer', location_en: 'Trade Magmar holding Magmarizer', note_es: 'Necesita Magmarizador', note_en: 'Needs Magmarizer', gen: 4 },
  'Electivire': { method: 'trade-evolution', location_es: 'Intercambiar Electabuzz con Electirizer', location_en: 'Trade Electabuzz holding Electirizer', note_es: 'Necesita Electrizador', note_en: 'Needs Electirizer', gen: 4 },
  'Rhyperior': { method: 'trade-evolution', location_es: 'Intercambiar Rhydon con Protector', location_en: 'Trade Rhydon holding Protector', note_es: 'Necesita Protector', note_en: 'Needs Protector', gen: 4 },
  'Togekiss': { method: 'evolution-item', location_es: 'Evolucionar Togetic con Shiny Stone', location_en: 'Evolve Togetic with Shiny Stone', note_es: 'Piedra Día', note_en: 'Shiny Stone', gen: 4 },
  'Yanmega': { method: 'evolution-levelup', location_es: 'Subir nivel de Yanma sabiendo AncientPower', location_en: 'Level up Yanma knowing AncientPower', note_es: 'Nivel con Poder Pasado', note_en: 'Level with AncientPower', gen: 4 },
  'Honchkrow': { method: 'evolution-item', location_es: 'Evolucionar Murkrow con Dusk Stone', location_en: 'Evolve Murkrow with Dusk Stone', note_es: 'Piedra Noche', note_en: 'Dusk Stone', gen: 4 },
  'Mismagius': { method: 'evolution-item', location_es: 'Evolucionar Misdreavus con Dusk Stone', location_en: 'Evolve Misdreavus with Dusk Stone', note_es: 'Piedra Noche', note_en: 'Dusk Stone', gen: 4 },
  'Gliscor': { method: 'evolution-levelup', location_es: 'Subir nivel de Gligar de noche con Razor Fang', location_en: 'Level up Gligar at night holding Razor Fang', note_es: 'Nivel de noche con Colmillo Agudo', note_en: 'Level at night holding Razor Fang', gen: 4 },
  'Mamoswine': { method: 'evolution-levelup', location_es: 'Subir nivel de Piloswine sabiendo AncientPower', location_en: 'Level up Piloswine knowing AncientPower', note_es: 'Nivel con Poder Pasado', note_en: 'Level with AncientPower', gen: 4 },
  'Froslass': { method: 'evolution-item', location_es: 'Evolucionar female Snorunt con Dawn Stone', location_en: 'Evolve female Snorunt with Dawn Stone', note_es: 'Piedra Alba (solo hembra)', note_en: 'Dawn Stone (female only)', gen: 4 },
  'Gallade': { method: 'evolution-item', location_es: 'Evolucionar male Kirlia con Dawn Stone', location_en: 'Evolve male Kirlia with Dawn Stone', note_es: 'Piedra Alba (solo macho)', note_en: 'Dawn Stone (male only)', gen: 4 },
  'Porygon-Z': { method: 'trade-evolution', location_es: 'Intercambiar Porygon2 con Dubious Disc', location_en: 'Trade Porygon2 holding Dubious Disc', note_es: 'Necesita Disco Extraño', note_en: 'Needs Dubious Disc', gen: 4 },
  'Dusknoir': { method: 'trade-evolution', location_es: 'Intercambiar Dusclops con Reaper Cloth', location_en: 'Trade Dusclops holding Reaper Cloth', note_es: 'Necesita Tela Terrible', note_en: 'Needs Reaper Cloth', gen: 4 },
  'Probopass': { method: 'evolution-levelup', location_es: 'Subir nivel de Nosepass en Monte Corona', location_en: 'Level up Nosepass at Mt. Coronet', note_es: 'Nivel en Monte Corona', note_en: 'Level at Mt. Coronet', gen: 4 },
  'Magnezone': { method: 'evolution-levelup', location_es: 'Subir nivel de Magneton en Monte Corona', location_en: 'Level up Magneton at Mt. Coronet', note_es: 'Nivel en Monte Corona', note_en: 'Level at Mt. Coronet', gen: 4 },
  'Leafeon': { method: 'evolution-levelup', location_es: 'Subir nivel de Eevee cerca de Roca Musgo', location_en: 'Level up Eevee near Moss Rock', note_es: 'Nivel en Bosque Vetusto', note_en: 'Level in Eterna Forest', gen: 4 },
  'Glaceon': { method: 'evolution-levelup', location_es: 'Subir nivel de Eevee cerca de Roca Hielo', location_en: 'Level up Eevee near Ice Rock', note_es: 'Nivel en Ruta 217', note_en: 'Level on Route 217', gen: 4 },
  'Sylveon': { method: 'evolution-levelup', location_es: 'Subir nivel de Eevee con movimiento de hada y amistad', location_en: 'Level up Eevee with Fairy move and friendship', note_es: 'Gen 6+', note_en: 'Gen 6+', gen: 6 },
  
  // === GEN 5 (Unova) ===
  'Snivy': { method: 'gift', location_es: 'Pueblo Gres (regalo de la Profesora Juniper)', location_en: 'Nuvema Town (Professor Juniper gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 5 },
  'Tepig': { method: 'gift', location_es: 'Pueblo Gres (regalo de la Profesora Juniper)', location_en: 'Nuvema Town (Professor Juniper gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 5 },
  'Oshawott': { method: 'gift', location_es: 'Pueblo Gres (regalo de la Profesora Juniper)', location_en: 'Nuvema Town (Professor Juniper gift)', note_es: 'Elegir como starter', note_en: 'Choose as starter', gen: 5 },
  
  // Legendarios Gen 5
  'Cobalion': { method: 'legendary', location_es: 'Guarida del Dragón', location_en: 'Mistralton Cave', note_es: 'Nivel 42', note_en: 'Level 42', gen: 5 },
  'Terrakion': { method: 'legendary', location_es: 'Ruta 13', location_en: 'Route 13', note_es: 'Nivel 45', note_en: 'Level 45', gen: 5 },
  'Virizion': { method: 'legendary', location_es: 'Ruta 11', location_en: 'Route 11', note_es: 'Nivel 42', note_en: 'Level 42', gen: 5 },
  'Tornadus': { method: 'legendary', location_es: 'Unova (deambula tras tormenta)', location_en: 'Unova (roams after storm)', note_es: 'Deambulante', note_en: 'Roaming', gen: 5 },
  'Thundurus': { method: 'legendary', location_es: 'Unova (deambula tras tormenta)', location_en: 'Unova (roams after storm)', note_es: 'Deambulante', note_en: 'Roaming', gen: 5 },
  'Reshiram': { method: 'legendary', location_es: 'Torre de N', location_en: 'N\'s Castle', note_es: 'Nivel 50', note_en: 'Level 50', gen: 5 },
  'Zekrom': { method: 'legendary', location_es: 'Torre de N', location_en: 'N\'s Castle', note_es: 'Nivel 50', note_en: 'Level 50', gen: 5 },
  'Landorus': { method: 'legendary', location_es: 'Puente de la Precipitación', location_en: 'Abundant Shrine', note_es: 'Necesita Tornadus + Thundurus', note_en: 'Needs Tornadus + Thundurus', gen: 5 },
  'Kyurem': { method: 'legendary', location_es: 'Gruta Gigante', location_en: 'Giant Chasm', note_es: 'Nivel 75', note_en: 'Level 75', gen: 5 },
  'Keldeo': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Solo por eventos oficiales', note_en: 'Only via official events', gen: 5 },
  'Meloetta': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Solo por eventos oficiales', note_en: 'Only via official events', gen: 5 },
  'Genesect': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Solo por eventos oficiales', note_en: 'Only via official events', gen: 5 },
  
  // Trade evolutions Gen 5
  'Escavalier': { method: 'trade-evolution', location_es: 'Intercambiar Karrablast por Shelmet', location_en: 'Trade Karrablast for Shelmet', note_es: 'Intercambio especial', note_en: 'Special trade', gen: 5 },
  'Accelgor': { method: 'trade-evolution', location_es: 'Intercambiar Shelmet por Karrablast', location_en: 'Trade Shelmet for Karrablast', note_es: 'Intercambio especial', note_en: 'Special trade', gen: 5 },
  
  // Gen 5 special
  'Larvesta': { method: 'gift', location_es: 'Yermo de los Sueños (huevo)', location_en: 'Relic Castle (egg)', note_es: 'Huevo de NPC', note_en: 'NPC egg', gen: 5 },
  'Volcarona': { method: 'legendary', location_es: 'Ruinas del Desierto', location_en: 'Relic Castle', note_es: 'Nivel 70', note_en: 'Level 70', gen: 5 },
  'Zorua': { method: 'event', location_es: 'Evento especial (huevo)', location_en: 'Special event (egg)', note_es: 'Necesita Celebi/Shiny Beast', note_en: 'Needs Celebi/Shiny Beast', gen: 5 },
  'Zoroark': { method: 'event', location_es: 'Evento especial', location_en: 'Special event', note_es: 'Necesita Celebi/Shiny Beast', note_en: 'Needs Celebi/Shiny Beast', gen: 5 },
};

// Métodos de obtención con iconos y colores
export const OBTENCION_METHODS = {
  'gift': { icon: '🎁', label_es: 'Regalo', label_en: 'Gift', color: '#4caf50' },
  'fossil': { icon: '🦴', label_es: 'Fósil', label_en: 'Fossil', color: '#795548' },
  'trade-evolution': { icon: '⇄', label_es: 'Intercambio evolutivo', label_en: 'Trade evolution', color: '#ff9800' },
  'trade-npc': { icon: '⇄', label_es: 'Intercambio NPC', label_en: 'NPC trade', color: '#ff9800' },
  'legendary': { icon: '👑', label_es: 'Legendario', label_en: 'Legendary', color: '#e91e63' },
  'event': { icon: '🎫', label_es: 'Evento', label_en: 'Event', color: '#9c27b0' },
  'evolution-item': { icon: '💎', label_es: 'Evolución con piedra', label_en: 'Stone evolution', color: '#00bcd4' },
  'evolution-levelup': { icon: '⬆', label_es: 'Subir nivel', label_en: 'Level up', color: '#8bc34a' },
  'friendship': { icon: '❤', label_es: 'Amistad', label_en: 'Friendship', color: '#f44336' },
  'breeding': { icon: '🥚', label_es: 'Crianza', label_en: 'Breeding', color: '#ffeb3b' },
};

export function getPokemonObtencion(name) {
  return POKEMON_OBTENCION[name] || null;
}

export function hasObtencionInfo(name) {
  return !!POKEMON_OBTENCION[name];
}
