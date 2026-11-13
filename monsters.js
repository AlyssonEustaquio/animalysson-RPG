/*
 * Catálogo de criaturas de Dungeons & Dragons — regras revisadas 2024 (5.5e).
 *
 * ESCOPO E PROCEDÊNCIA:
 * - Blocos de estatísticas completos: 322 criaturas do SRD 5.2.1 (edição revisada),
 *   texto aberto pela Wizards of the Coast sob Creative Commons Attribution 4.0.
 * - A base estruturada é distribuída pelo projeto adkinn/srd-5.2.1, que republica
 *   o conteúdo do SRD via Open5e, também sob CC BY 4.0.
 * - O Livro dos Monstros 2025 (edição revisada 5.5e) contém 510 criaturas na edição
 *   brasileira; seu conteúdo comercial completo não é reproduzido aqui. A Wizards
 *   disponibiliza apenas parte das criaturas no SRD. O índice oficial do livro está
 *   ligado em MONSTER_MANUAL_URL.
 * - Os nomes em `nomePt` são traduções de referência quando mapeadas. Quando não há
 *   tradução confirmada no conjunto aberto, `nomePt` fica null e `nome` usa o original.
 * - As descrições de traços, ações e demais regras permanecem no idioma de origem (EN)
 *   da base aberta. Os campos originais ficam preservados em `dados`.
 *
 * Atribuição exigida pela licença CC BY 4.0:
 * “This work includes material from the System Reference Document 5.2.1 (SRD 5.2.1)
 * by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1
 * is licensed under the Creative Commons Attribution 4.0 International License,
 * available at https://creativecommons.org/licenses/by/4.0/legalcode.”
 */
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

  function normalizeMonster(monster) {
    var stat = monster.stat_block_json || {};
    var ptName = PT_NAMES[monster.name] || null;
    return {
      id: monster.id,
      nome: ptName || monster.name,
      nomePt: ptName,
      nomeEn: monster.name,
      traducaoPtDisponivel: Boolean(ptName),
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
      tracos: stat.traits || [],
      acoes: stat.actions || [],
      acoesBonus: stat.bonus_actions || [],
      reacoes: stat.reactions || [],
      acoesLendarias: stat.legendary_actions || [],
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

  window.MONSTERS = [];
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
    idiomaDadosDeRegra: 'en',
    idiomaNomes: 'PT-BR de referência quando houver tradução mapeada; original preservado em nomeEn',
    aviso: 'Este catálogo contém os blocos abertos do SRD 5.2.1, não os 510 blocos comerciais integrais do Livro dos Monstros.'
  };

  window.MONSTERS_READY = loadFromSources(0).then(function (payload) {
    var records = Array.isArray(payload) ? payload : payload.monsters;
    if (!Array.isArray(records)) throw new Error('Formato inesperado da base de monstros SRD 5.2.1.');
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
