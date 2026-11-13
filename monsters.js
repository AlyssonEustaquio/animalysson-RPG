(function () {
  'use strict';

  var DATA_URLS = [
    'https://cdn.jsdelivr.net/gh/adkinn/srd-5.2.1@main/data/monsters.json',
    'https://raw.githubusercontent.com/adkinn/srd-5.2.1/main/data/monsters.json'
  ];

  var MONSTER_MANUAL_URL = 'https://www.dndbeyond.com/sources/dnd/mm-2024';

  // Traduções de referência para nomes mais comuns. O nome inglês é sempre preservado.
  // Para nomes não mapeados, não se presume que uma tradução seja oficial.
  var PT_NAMES = {
    'Aboleth': 'Abolete',
    'Adult Black Dragon': 'Dragão Negro Adulto',
    'Adult Blue Dragon': 'Dragão Azul Adulto',
    'Adult Brass Dragon': 'Dragão de Latão Adulto',
    'Adult Bronze Dragon': 'Dragão de Bronze Adulto',
    'Adult Copper Dragon': 'Dragão de Cobre Adulto',
    'Adult Gold Dragon': 'Dragão de Ouro Adulto',
    'Adult Green Dragon': 'Dragão Verde Adulto',
    'Adult Red Dragon': 'Dragão Vermelho Adulto',
    'Adult Silver Dragon': 'Dragão de Prata Adulto',
    'Adult White Dragon': 'Dragão Branco Adulto',
    'Air Elemental': 'Elemental do Ar',
    'Animated Armor': 'Armadura Animada',
    'Animated Flying Sword': 'Espada Voadora Animada',
    'Animated Rug of Smothering': 'Tapete Sufocante Animado',
    'Ankheg': 'Ankheg',
    'Ape': 'Macaco',
    'Azer Sentinel': 'Sentinela Azer',
    'Baboon': 'Babuíno',
    'Badger': 'Texugo',
    'Balor': 'Balor',
    'Banshee': 'Banshee',
    'Basilisk': 'Basilisco',
    'Bat': 'Morcego',
    'Behir': 'Behir',
    'Beholder': 'Observador',
    'Blink Dog': 'Cão Teleportador',
    'Blood Hawk': 'Falcão Sangrento',
    'Boar': 'Javali',
    'Bone Devil': 'Diabo dos Ossos',
    'Brown Bear': 'Urso Pardo',
    'Bugbear Stalker': 'Perseguidor Bugbear',
    'Bugbear Warrior': 'Guerreiro Bugbear',
    'Bulette': 'Bulette',
    'Cambion': 'Cambion',
    'Camel': 'Camelo',
    'Carrion Crawler': 'Rastejador da Carniça',
    'Cat': 'Gato',
    'Centaur Trooper': 'Tropa Centauro',
    'Chain Devil': 'Diabo das Correntes',
    'Chimera': 'Quimera',
    'Chuul': 'Chuul',
    'Clay Golem': 'Golem de Argila',
    'Cloaker': 'Manto',
    'Cloud Giant': 'Gigante das Nuvens',
    'Cockatrice': 'Cocatriz',
    'Commoner': 'Plebeu',
    'Constrictor Snake': 'Cobra Constritora',
    'Couatl': 'Couatl',
    'Crab': 'Caranguejo',
    'Crocodile': 'Crocodilo',
    'Cultist': 'Cultista',
    'Cultist Fanatic': 'Fanático Cultista',
    'Cyclops': 'Ciclope',
    'Darkmantle': 'Manto Sombrio',
    'Death Dog': 'Cão da Morte',
    'Death Knight': 'Cavaleiro da Morte',
    'Deer': 'Cervo',
    'Demilich': 'Demilich',
    'Deva': 'Deva',
    'Dire Wolf': 'Lobo Atroz',
    'Displacer Beast': 'Fera Deslocadora',
    'Djinni': 'Djinni',
    'Doppelganger': 'Doppelganger',
    'Dracolich': 'Dracolich',
    'Dragon Turtle': 'Tartaruga-Dragão',
    'Drider': 'Drider',
    'Dryad': 'Dríade',
    'Eagle': 'Águia',
    'Earth Elemental': 'Elemental da Terra',
    'Efreeti': 'Efreeti',
    'Elephant': 'Elefante',
    'Elk': 'Alce',
    'Erinyes': 'Erínia',
    'Ettercap': 'Ettercap',
    'Ettin': 'Ettin',
    'Fire Elemental': 'Elemental do Fogo',
    'Fire Giant': 'Gigante do Fogo',
    'Flameskull': 'Caveira Flamejante',
    'Flesh Golem': 'Golem de Carne',
    'Flumph': 'Flumph',
    'Flying Snake': 'Cobra Voadora',
    'Fomorian': 'Fomoriano',
    'Frog': 'Sapo',
    'Frost Giant': 'Gigante do Gelo',
    'Galeb Duhr': 'Galeb Duhr',
    'Gargoyle': 'Gárgula',
    'Gelatinous Cube': 'Cubo Gelatinoso',
    'Ghast': 'Carniçal Maior',
    'Ghost': 'Fantasma',
    'Ghoul': 'Carniçal',
    'Giant Ape': 'Macaco Gigante',
    'Giant Badger': 'Texugo Gigante',
    'Giant Bat': 'Morcego Gigante',
    'Giant Boar': 'Javali Gigante',
    'Giant Centipede': 'Centípede Gigante',
    'Giant Crab': 'Caranguejo Gigante',
    'Giant Crocodile': 'Crocodilo Gigante',
    'Giant Eagle': 'Águia Gigante',
    'Giant Elk': 'Alce Gigante',
    'Giant Fire Beetle': 'Besouro-de-Fogo Gigante',
    'Giant Frog': 'Sapo Gigante',
    'Giant Goat': 'Cabra Gigante',
    'Giant Hyena': 'Hiena Gigante',
    'Giant Lizard': 'Lagarto Gigante',
    'Giant Octopus': 'Polvo Gigante',
    'Giant Owl': 'Coruja Gigante',
    'Giant Rat': 'Rato Gigante',
    'Giant Scorpion': 'Escorpião Gigante',
    'Giant Shark': 'Tubarão Gigante',
    'Giant Spider': 'Aranha Gigante',
    'Giant Toad': 'Sapo-Touro Gigante',
    'Giant Vulture': 'Abutre Gigante',
    'Giant Wasp': 'Vespa Gigante',
    'Giant Weasel': 'Doninha Gigante',
    'Gibbering Mouther': 'Boca Gorgolejante',
    'Glabrezu': 'Glabrezu',
    'Gladiator': 'Gladiador',
    'Gnoll Warrior': 'Guerreiro Gnoll',
    'Goblin Boss': 'Chefe Goblin',
    'Goblin Minion': 'Lacaio Goblin',
    'Goblin Warrior': 'Guerreiro Goblin',
    'Gold Dragon Wyrmling': 'Filhote de Dragão de Ouro',
    'Gorgon': 'Górgona',
    'Goristro': 'Goristro',
    'Gray Ooze': 'Gosma Cinzenta',
    'Green Hag': 'Bruxa Verde',
    'Grell': 'Grell',
    'Grick': 'Grick',
    'Griffon': 'Grifo',
    'Grimlock': 'Grimlock',
    'Guardian Naga': 'Naga Guardiã',
    'Guard': 'Guarda',
    'Guard Captain': 'Capitão da Guarda',
    'Half-Dragon': 'Meio-Dragão',
    'Harpy': 'Harpia',
    'Hawk': 'Falcão',
    'Hell Hound': 'Cão Infernal',
    'Helmed Horror': 'Horror de Elmo',
    'Hezrou': 'Hezrou',
    'Hill Giant': 'Gigante da Colina',
    'Hippogriff': 'Hipogrifo',
    'Hippopotamus': 'Hipopótamo',
    'Hobgoblin Captain': 'Capitão Hobgoblin',
    'Hobgoblin Warrior': 'Guerreiro Hobgoblin',
    'Homunculus': 'Homúnculo',
    'Hook Horror': 'Horror Gancho',
    'Horned Devil': 'Diabo Chifrudo',
    'Hunter Shark': 'Tubarão Caçador',
    'Hydra': 'Hidra',
    'Hyena': 'Hiena',
    'Ice Devil': 'Diabo do Gelo',
    'Imp': 'Diabrete',
    'Incubus': 'Íncubo',
    'Intellect Devourer': 'Devorador de Intelecto',
    'Invisible Stalker': 'Perseguidor Invisível',
    'Iron Golem': 'Golem de Ferro',
    'Jackal': 'Chacal',
    'Jackalwere': 'Chacal-homem',
    'Kenku': 'Kenku',
    'Killer Whale': 'Orca',
    'Knight': 'Cavaleiro',
    'Kobold Warrior': 'Guerreiro Kobold',
    'Kraken': 'Kraken',
    'Kuo-toa': 'Kuo-toa',
    'Kuo-toa Archpriest': 'Arquissacerdote Kuo-toa',
    'Kuo-toa Monitor': 'Monitor Kuo-toa',
    'Kuo-toa Whip': 'Chicote Kuo-toa',
    'Lamia': 'Lâmia',
    'Lemure': 'Lêmure',
    'Lich': 'Lich',
    'Lion': 'Leão',
    'Lizard': 'Lagarto',
    'Mage': 'Mago',
    'Mage Apprentice': 'Aprendiz de Mago',
    'Archmage': 'Arquimago',
    'Magmin': 'Magmin',
    'Mammoth': 'Mamute',
    'Manticore': 'Mantícora',
    'Marid': 'Marid',
    'Marilith': 'Marilith',
    'Mastiff': 'Mastim',
    'Medusa': 'Medusa',
    'Mephit': 'Mephit',
    'Merfolk Skirmisher': 'Escaramuçador Tritão',
    'Merrow': 'Merrow',
    'Mezzoloth': 'Mezzoloth',
    'Mimic': 'Mímico',
    'Mind Flayer': 'Devorador de Mentes',
    'Mind Flayer Arcanist': 'Arcanista Devorador de Mentes',
    'Minotaur of Baphomet': 'Minotauro de Bafomé',
    'Modron Monodrone': 'Monodrone Modron',
    'Modron Duodrone': 'Duodrone Modron',
    'Modron Tridrone': 'Tridrone Modron',
    'Modron Quadrone': 'Quadrone Modron',
    'Modron Pentadrone': 'Pentadrone Modron',
    'Mule': 'Mula',
    'Mummy': 'Múmia',
    'Mummy Lord': 'Lorde das Múmias',
    'Myconid Sprout': 'Broto Miconídeo',
    'Myconid Adult': 'Miconídeo Adulto',
    'Myconid Sovereign': 'Soberano Miconídeo',
    'Nalfeshnee': 'Nalfeshnee',
    'Night Hag': 'Bruxa da Noite',
    'Nightmare': 'Pesadelo',
    'Noble': 'Nobre',
    'Nothic': 'Nótico',
    'Nycaloth': 'Nycaloth',
    'Ochre Jelly': 'Geleia Ocre',
    'Octopus': 'Polvo',
    'Ogre': 'Ogro',
    'Oni': 'Oni',
    'Otyugh': 'Otyugh',
    'Owl': 'Coruja',
    'Owlbear': 'Urso-Coruja',
    'Primeval Owlbear': 'Urso-Coruja Primordial',
    'Panther': 'Pantera',
    'Pegasus': 'Pégaso',
    'Performer': 'Artista',
    'Peryton': 'Peryton',
    'Phase Spider': 'Aranha Etérea',
    'Piercer': 'Perfurador',
    'Piranha': 'Piranha',
    'Pirate': 'Pirata',
    'Pirate Captain': 'Capitão Pirata',
    'Pit Fiend': 'Diabo das Fossas',
    'Pixie': 'Pixie',
    'Planetar': 'Planetário',
    'Plesiosaurus': 'Plesiossauro',
    'Polar Bear': 'Urso Polar',
    'Poltergeist': 'Poltergeist',
    'Pony': 'Pônei',
    'Priest': 'Sacerdote',
    'Priest Acolyte': 'Acólito Sacerdote',
    'Pseudodragon': 'Pseudodragão',
    'Pteranodon': 'Pteranodonte',
    'Purple Worm': 'Verme Púrpura',
    'Quaggoth': 'Quaggoth',
    'Quasit': 'Quasit',
    'Rakshasa': 'Rakshasa',
    'Rat': 'Rato',
    'Raven': 'Corvo',
    'Reef Shark': 'Tubarão-de-Recife',
    'Remorhaz': 'Remorhaz',
    'Revenant': 'Revenante',
    'Rhinoceros': 'Rinoceronte',
    'Riding Horse': 'Cavalo de Montaria',
    'Roc': 'Roc',
    'Roper': 'Roper',
    'Rust Monster': 'Monstro da Ferrugem',
    'Saber-Toothed Tiger': 'Tigre-dentes-de-sabre',
    'Sahuagin Warrior': 'Guerreiro Sahuagin',
    'Salamander': 'Salamandra',
    'Satyr': 'Sátiro',
    'Scarecrow': 'Espantalho',
    'Scorpion': 'Escorpião',
    'Scout': 'Batedor',
    'Sea Hag': 'Bruxa do Mar',
    'Seahorse': 'Cavalo-Marinho',
    'Shadow': 'Sombra',
    'Shadow Demon': 'Demônio das Sombras',
    'Shambling Mound': 'Monte Errante',
    'Shield Guardian': 'Guardião do Escudo',
    'Skeleton': 'Esqueleto',
    'Slaad Tadpole': 'Girino Slaad',
    'Red Slaad': 'Slaad Vermelho',
    'Blue Slaad': 'Slaad Azul',
    'Green Slaad': 'Slaad Verde',
    'Gray Slaad': 'Slaad Cinzento',
    'Death Slaad': 'Slaad da Morte',
    'Solar': 'Solar',
    'Spectator': 'Espectador',
    'Specter': 'Espectro',
    'Sphinx of Wonder': 'Esfinge do Encanto',
    'Sphinx of Lore': 'Esfinge do Conhecimento',
    'Sphinx of Valor': 'Esfinge da Bravura',
    'Spy': 'Espião',
    'Spy Master': 'Mestre Espião',
    'Spined Devil': 'Diabo Espinhento',
    'Spirit Naga': 'Naga Espiritual',
    'Sprite': 'Fada Silvestre',
    'Stirge': 'Stirge',
    'Stone Giant': 'Gigante de Pedra',
    'Stone Golem': 'Golem de Pedra',
    'Storm Giant': 'Gigante da Tempestade',
    'Succubus': 'Súcubo',
    'Tarrasque': 'Tarrasque',
    'Thri-kreen': 'Thri-kreen',
    'Tiger': 'Tigre',
    'Tough': 'Brutamontes',
    'Tough Boss': 'Chefe Brutamontes',
    'Treant': 'Ent',
    'Triceratops': 'Tricerátops',
    'Troll': 'Troll',
    'Troll Limb': 'Membro de Troll',
    'Tyrannosaurus Rex': 'Tiranossauro Rex',
    'Ultroloth': 'Ultroloth',
    'Umber Hulk': 'Umber Hulk',
    'Unicorn': 'Unicórnio',
    'Vampire': 'Vampiro',
    'Vampire Familiar': 'Familiar Vampírico',
    'Vampire Spawn': 'Cria de Vampiro',
    'Venomous Snake': 'Cobra Venenosa',
    'Vrock': 'Vrock',
    'Vulture': 'Abutre',
    'Warhorse': 'Cavalo de Guerra',
    'Warrior Infantry': 'Soldado de Infantaria',
    'Warrior Veteran': 'Guerreiro Veterano',
    'Warrior Commander': 'Comandante Guerreiro',
    'Water Elemental': 'Elemental da Água',
    'Water Weird': 'Estranho Aquático',
    'Weasel': 'Doninha',
    'Werebear': 'Urso-Lobisomem',
    'Wereboar': 'Javali-Lobisomem',
    'Wererat': 'Rato-Lobisomem',
    'Weretiger': 'Tigre-Lobisomem',
    'Werewolf': 'Lobisomem',
    'White Dragon Wyrmling': 'Filhote de Dragão Branco',
    'Wight': 'Carniçal',
    'Will-o’-Wisp': 'Fogo-Fátuo',
    'Winter Wolf': 'Lobo Invernal',
    'Wolf': 'Lobo',
    'Worg': 'Worg',
    'Wraith': 'Aparição',
    'Wyvern': 'Serpe',
    'Xorn': 'Xorn',
    'Yeti': 'Yeti',
    'Abominable Yeti': 'Yeti Abominável',
    'Yochlol': 'Yochlol',
    'Zombie': 'Zumbi'
  };

  var SIZE_PT = {
    'Tiny': 'Miúdo', 'Small': 'Pequeno', 'Medium': 'Médio',
    'Large': 'Grande', 'Huge': 'Enorme', 'Gargantuan': 'Imenso'
  };
  var TYPE_PT = {
    'aberration': 'Aberração', 'beast': 'Fera', 'celestial': 'Celestial',
    'construct': 'Constructo', 'dragon': 'Dragão', 'elemental': 'Elemental',
    'fey': 'Fada', 'fiend': 'Ínfero', 'giant': 'Gigante',
    'humanoid': 'Humanoide', 'monstrosity': 'Monstruosidade', 'ooze': 'Gosma',
    'plant': 'Planta', 'undead': 'Morto-vivo'
  };


  // Traduções locais de termos recorrentes do bloco de estatísticas.
  // Os nomes e termos são apresentados em PT-BR; o identificador original fica interno
  // apenas para pesquisa cruzada e compatibilidade com os dados do SRD.
  var TERMOS_PT = {
    'Amphibious':'Anfíbio','False Appearance':'Aparência Falsa','Pack Tactics':'Táticas de Matilha',
    'Keen Smell':'Olfato Aguçado','Keen Hearing':'Audição Aguçada','Keen Sight':'Visão Aguçada',
    'Keen Senses':'Sentidos Aguçados','Echolocation':'Ecolocalização','Standing Leap':'Salto Parado',
    'Flyby':'Voo Rasante','Charge':'Investida','Pounce':'Atacar de Bote','Rampage':'Frenesi',
    'Regeneration':'Regeneração','Rejuvenation':'Rejuvenescimento','Incorporeal Movement':'Movimento Incorpóreo',
    'Legendary Resistance':'Resistência Lendária','Magic Resistance':'Resistência à Magia',
    'Magic Weapons':'Armas Mágicas','Sunlight Sensitivity':'Sensibilidade à Luz Solar',
    'Sunlight Weakness':'Fraqueza à Luz Solar','Water Breathing':'Respiração Aquática',
    'Hold Breath':'Prender a Respiração','Spider Climb':'Escalada Aracnídea','Web Sense':'Sentido de Teia',
    'Web Walker':'Andar na Teia','Shapechanger':'Metamorfo','Shape-Shifting':'Mudança de Forma',
    'Innate Spellcasting':'Conjuração Inata','Spellcasting':'Conjuração','Multiattack':'Ataque Múltiplo',
    'Bite':'Mordida','Claw':'Garra','Claws':'Garras','Slam':'Pancada','Rake':'Rasgar',
    'Sting':'Ferroada','Tail':'Cauda','Tentacle':'Tentáculo','Longsword':'Espada Longa',
    'Shortsword':'Espada Curta','Greatsword':'Espada Grande','Greataxe':'Machado Grande',
    'Battleaxe':'Machado de Batalha','Longbow':'Arco Longo','Shortbow':'Arco Curto',
    'Heavy Crossbow':'Besta Pesada','Light Crossbow':'Besta Leve','Dagger':'Adaga',
    'Spear':'Lança','Club':'Clava','Javelin':'Dardo','Rock':'Rocha','Fire Breath':'Sopro de Fogo',
    'Lightning Breath':'Sopro Elétrico','Frightful Presence':'Presença Aterradora',
    'Breath Weapon':'Arma de Sopro','Parry':'Aparar','Reactions':'Reações',
    'Legendary Actions':'Ações Lendárias','Bonus Actions':'Ações Bônus',
    'Damage Transfer':'Transferência de Dano','Death Burst':'Explosão Mortal',
    'Magic Resistance':'Resistência à Magia','Turn Resistance':'Resistência à Expulsão',
    'Undead Fortitude':'Resiliência dos Mortos-vivos','Pack Tactics':'Táticas de Matilha',
    'Aggressive':'Agressivo','Brute':'Brutalidade','Charge':'Investida','Keen Smell':'Olfato Aguçado',
    'Illumination':'Iluminação','Actions':'Ações'
  };
  var ATRIBUTOS_EN_PT = {str:'Força',dex:'Destreza',con:'Constituição',int:'Inteligência',wis:'Sabedoria',cha:'Carisma',strength:'Força',dexterity:'Destreza',constitution:'Constituição',intelligence:'Inteligência',wisdom:'Sabedoria',charisma:'Carisma'};
  var PERICIAS_EN_PT = {acrobatics:'Acrobacia',animal_handling:'Adestrar Animais',arcana:'Arcanismo',athletics:'Atletismo',deception:'Enganação',history:'História',insight:'Intuição',intimidation:'Intimidação',investigation:'Investigação',medicine:'Medicina',nature:'Natureza',perception:'Percepção',performance:'Atuação',persuasion:'Persuasão',religion:'Religião',sleight_of_hand:'Prestidigitação',stealth:'Furtividade',survival:'Sobrevivência'};
  var TIPOS_DANO_PT = {acid:'ácido',bludgeoning:'contundente',cold:'frio',fire:'fogo',force:'energia',lightning:'elétrico',necrotic:'necrótico',piercing:'perfurante',poison:'veneno',psychic:'psíquico',radiant:'radiante',slashing:'cortante',thunder:'trovejante'};
  var IDIOMAS_PT = {Common:'Comum',Draconic:'Dracônico',Dwarvish:'Anão',Elvish:'Élfico',Giant:'Gigante',Gnomish:'Gnômico',Goblin:'Goblin',Halfling:'Halfling',Orc:'Orc',Abyssal:'Abissal',Celestial:'Celestial','Deep Speech':'Dialeto Obscuro',Infernal:'Infernal',Primordial:'Primordial',Sylvan:'Silvestre',Undercommon:'Subcomum',Auran:'Auran',Aquan:'Aquan',Ignan:'Ignan',Terran:'Terran'};
  var SENTIDOS_PT = {darkvision:'visão no escuro',blindsight:'percepção às cegas',truesight:'visão verdadeira',tremorsense:'percepção sísmica',passive_perception:'Percepção passiva'};
  var VELOCIDADES_PT = {walk:'deslocamento',climb:'escalada',fly:'voo',swim:'natação',burrow:'escavação'};
  var FRASES_PT = [
    [/Melee Weapon Attack:/gi,'Ataque com Arma Corpo a Corpo:'],[/Ranged Weapon Attack:/gi,'Ataque com Arma à Distância:'],
    [/Melee Spell Attack:/gi,'Ataque Mágico Corpo a Corpo:'],[/Ranged Spell Attack:/gi,'Ataque Mágico à Distância:'],
    [/Saving Throw:/gi,'Teste de Resistência:'],[/Strength saving throw/gi,'teste de resistência de Força'],[/Dexterity saving throw/gi,'teste de resistência de Destreza'],[/Constitution saving throw/gi,'teste de resistência de Constituição'],[/Intelligence saving throw/gi,'teste de resistência de Inteligência'],[/Wisdom saving throw/gi,'teste de resistência de Sabedoria'],[/Charisma saving throw/gi,'teste de resistência de Carisma'],
    [/to hit/gi,'para acertar'],[/reach 5 ft\./gi,'alcance 1,5 m'],[/reach 10 ft\./gi,'alcance 3 m'],[/reach 15 ft\./gi,'alcance 4,5 m'],[/reach 20 ft\./gi,'alcance 6 m'],
    [/one target/gi,'um alvo'],[/one creature/gi,'uma criatura'],[/each creature/gi,'cada criatura'],[/Hit:/gi,'Acerto:'],[/Miss:/gi,'Erro:'],
    [/bludgeoning damage/gi,'dano contundente'],[/piercing damage/gi,'dano perfurante'],[/slashing damage/gi,'dano cortante'],[/acid damage/gi,'dano ácido'],[/cold damage/gi,'dano de frio'],[/fire damage/gi,'dano de fogo'],[/force damage/gi,'dano de energia'],[/lightning damage/gi,'dano elétrico'],[/necrotic damage/gi,'dano necrótico'],[/poison damage/gi,'dano de veneno'],[/psychic damage/gi,'dano psíquico'],[/radiant damage/gi,'dano radiante'],[/thunder damage/gi,'dano trovejante'],
    [/half as much damage/gi,'metade do dano'],[/magical darkness/gi,'escuridão mágica'],[/magical effects/gi,'efeitos mágicos'],[/attack roll/gi,'jogada de ataque'],[/ability check/gi,'teste de atributo'],[/hit points/gi,'pontos de vida'],[/temporary hit points/gi,'pontos de vida temporários'],[/difficult terrain/gi,'terreno difícil'],[/until the start of its next turn/gi,'até o início do próximo turno dela'],[/until the end of its next turn/gi,'até o fim do próximo turno dela'],
    [/The target must succeed on/gi,'O alvo precisa ser bem-sucedido em'],[/The target takes/gi,'O alvo sofre'],[/The creature takes/gi,'A criatura sofre'],[/the target is grappled/gi,'o alvo fica agarrado'],[/the target is restrained/gi,'o alvo fica impedido'],[/the target is frightened/gi,'o alvo fica amedrontado'],[/the target is poisoned/gi,'o alvo fica envenenado'],[/the target is paralyzed/gi,'o alvo fica paralisado'],[/the target is blinded/gi,'o alvo fica cego'],[/the target is charmed/gi,'o alvo fica enfeitiçado'],
    [/A creature that succeeds on the saving throw/gi,'Uma criatura bem-sucedida no teste de resistência'],[/On a failed save/gi,'Em caso de falha'],[/On a successful save/gi,'Em caso de sucesso'],[/Failure:/gi,'Falha:'],[/Success:/gi,'Sucesso:'],[/Recharge 5–6/gi,'Recarga 5–6'],[/Recharge 6/gi,'Recarga 6'],[/\bDC\s+(\d+)\b/g,'CD $1'],
    [/\b1 foot\b/gi,'30 cm'],[/\b5 feet\b/gi,'1,5 m'],[/\b10 feet\b/gi,'3 m'],[/\b15 feet\b/gi,'4,5 m'],[/\b20 feet\b/gi,'6 m'],[/\b30 feet\b/gi,'9 m'],[/\b40 feet\b/gi,'12 m'],[/\b60 feet\b/gi,'18 m'],[/\b80 feet\b/gi,'24 m'],[/\b100 feet\b/gi,'30 m'],[/\b120 feet\b/gi,'36 m']
  ];
  function termoPt(value){ return TERMOS_PT[value] || value; }
  function textoMonstroPt(value){
    var out=String(value||'');
    FRASES_PT.forEach(function(pair){out=out.replace(pair[0],pair[1]);});
    Object.keys(TERMOS_PT).sort(function(a,b){return b.length-a.length;}).forEach(function(k){out=out.replace(new RegExp('(^|[^A-Za-z])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^A-Za-z])','g'),function(_,p){return p+TERMOS_PT[k]});});
    return out;
  }
  function traduzirRegistro(registros){
    return (registros||[]).map(function(item){
      if(typeof item==='string') return textoMonstroPt(item);
      var copy=Object.assign({},item);
      if(copy.name) copy.name=termoPt(copy.name);
      if(copy.description) copy.description=textoMonstroPt(copy.description);
      return copy;
    });
  }

  function normalizeMonster(monster) {
    var stat = monster.stat_block_json || {};
    var ptName = PT_NAMES[monster.name] || null;
    return {
      id: monster.id,
      nome: ptName || textoMonstroPt(monster.name),
      nomePt: ptName,
      nomeEn: monster.name,
      traducaoPtDisponivel: true,
      tamanho: SIZE_PT[monster.size] || monster.size,
      tamanhoEn: monster.size,
      tipo: TYPE_PT[monster.type] || monster.type,
      tipoEn: monster.type,
      nd: monster.cr,
      ndNumerico: monster.cr_numeric,
      classeArmadura: monster.armor_class,
      pontosVida: monster.hp_max,
      formulaVida: monster.hp_formula,
      iniciativa: monster.initiative_modifier,
      atributos: stat.ability_scores || {},
      deslocamento: stat.speed || {},
      salvaguardas: stat.saving_throws || {},
      pericias: stat.skills || {},
      sentidos: stat.senses || {},
      idiomas: stat.languages || [],
      resistenciasDano: stat.damage_resistances || [],
      vulnerabilidadesDano: stat.damage_vulnerabilities || [],
      imunidadesDano: stat.damage_immunities || [],
      imunidadesCondicao: stat.condition_immunities || [],
      tracos: traduzirRegistro(stat.traits),
      acoes: traduzirRegistro(stat.actions),
      acoesBonus: traduzirRegistro(stat.bonus_actions),
      reacoes: traduzirRegistro(stat.reactions),
      acoesLendarias: traduzirRegistro(stat.legendary_actions),
      fonte: 'SRD 5.2.1',
      licenca: 'CC BY 4.0',
      dados: stat
    };
  }

  function loadJson(url) {
    return fetch(url, { method: 'GET', mode: 'cors', cache: 'force-cache' }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status + ' ao carregar ' + url);
      return response.json();
    });
  }

  function loadFromSources(index) {
    if (index >= DATA_URLS.length) {
      throw new Error('Não foi possível obter a base SRD 5.2.1. Verifique a conexão com a internet.');
    }
    return loadJson(DATA_URLS[index]).catch(function () {
      return loadFromSources(index + 1);
    });
  }

  var CACHE_KEY = 'animalysson-rpg-monsters-srd521-v1';
  var cachedRecords = null;
  try { cachedRecords = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (_) { cachedRecords = null; }
  window.MONSTERS = Array.isArray(cachedRecords) ? cachedRecords.map(normalizeMonster) : [];
  window.SRD_MONSTERS = window.MONSTERS;
  window.MONSTER_MANUAL_URL = MONSTER_MANUAL_URL;
  window.MONSTERS_ERROR = null;
  window.MONSTERS_META = {
    sistema: 'Dungeons & Dragons 5.5e (regras revisadas de 2024)',
    manualAtual: 'Livro dos Monstros (2025)',
    edicaoBrasileira: 'Livro dos Monstros 5.5e — lançado no Brasil em setembro de 2026',
    criaturasNoManual: 510,
    blocosNovosNoManual: 87,
    srd: '5.2.1',
    blocosCompletosAbertosEsperados: 322,
    blocosCompletosCarregados: 0,
    fonte: 'Wizards of the Coast / SRD 5.2.1, republicado via Open5e',
    licenca: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    urlSRD: 'https://www.dndbeyond.com/srd',
    urlLivro: MONSTER_MANUAL_URL,
    idiomaDadosDeRegra: 'PT-BR parcial por tradução local de termos recorrentes; descrições com trechos sem correspondência permanecem no idioma original',
    idiomaNomes: 'PT-BR',
    cacheLocal: 'Os dados são guardados no navegador após a primeira carga; a primeira abertura ainda requer internet.',
    aviso: 'Este catálogo contém os blocos abertos do SRD 5.2.1, não os 510 blocos comerciais integrais do Livro dos Monstros.'
  };

  window.MONSTERS_READY = window.MONSTERS.length ? Promise.resolve(window.MONSTERS) : loadFromSources(0).then(function (payload) {
    var records = Array.isArray(payload) ? payload : payload.monsters;
    if (!Array.isArray(records)) throw new Error('Formato inesperado da base de monstros SRD 5.2.1.');
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(records)); } catch (_) {}
    window.MONSTERS = records.map(normalizeMonster);
    window.SRD_MONSTERS = window.MONSTERS;
    window.MONSTERS_META.blocosCompletosCarregados = window.MONSTERS.length;
    return window.MONSTERS;
  }).catch(function (error) {
    window.MONSTERS_ERROR = error;
    console.error('[monsters.js] Falha ao carregar o catálogo SRD:', error);
    return window.MONSTERS;
  });

  window.getMonsters = async function (filters) {
    var list = await window.MONSTERS_READY;
    var f = filters || {};
    return list.filter(function (m) {
      if (f.nd && String(m.nd) !== String(f.nd)) return false;
      if (f.tipo && m.tipoEn !== f.tipo && m.tipo !== f.tipo) return false;
      if (f.tamanho && m.tamanhoEn !== f.tamanho && m.tamanho !== f.tamanho) return false;
      if (f.fonte && m.fonte !== f.fonte) return false;
      if (f.minND !== undefined && Number(m.ndNumerico) < Number(f.minND)) return false;
      if (f.maxND !== undefined && Number(m.ndNumerico) > Number(f.maxND)) return false;
      return true;
    });
  };

  window.findMonster = async function (query) {
    var list = await window.MONSTERS_READY;
    var q = String(query || '').trim().toLocaleLowerCase('pt-BR');
    if (!q) return [];
    return list.filter(function (m) {
      return [m.nome, m.nomePt, m.nomeEn, m.tipo, m.tipoEn, m.nd]
        .filter(Boolean)
        .some(function (value) { return String(value).toLocaleLowerCase('pt-BR').includes(q); });
    });
  };

  window.getMonster = async function (query) {
    var matches = await window.findMonster(query);
    var q = String(query || '').trim().toLocaleLowerCase('pt-BR');
    return matches.find(function (m) {
      return [m.nome, m.nomeEn].some(function (n) { return String(n || '').toLocaleLowerCase('pt-BR') === q; });
    }) || matches[0] || null;
  };
})();
