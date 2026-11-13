(function () {
  'use strict';

  var MONSTER_MANUAL_URL = 'https://www.dndbeyond.com/sources/dnd/mm-2024';

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

  /* Converte {n,d} em {name,description}. Aceita também strings. */
  function entrada(item) {
    if (typeof item === 'string') return { name: '', description: item };
    return { name: item.n || '', description: item.d || '' };
  }
  function entradas(lista) {
    return (lista || []).map(entrada);
  }

  /* Monta o registro no formato que o restante do app espera. */
  function m(o) {
    return {
      id: o.id,
      name: o.en,
      nome_pt: o.pt,
      size: o.size,
      type: o.type,
      cr: o.cr,
      cr_numeric: o.crn,
      armor_class: o.ac,
      hp_max: o.hp,
      hp_formula: o.hpF,
      initiative_modifier: o.init,
      stat_block_json: {
        ability_scores: o.ab,
        speed: o.spd || { walk: 30 },
        saving_throws: o.sav || {},
        skills: o.sk || {},
        senses: o.sen || {},
        languages: o.lang || [],
        damage_resistances: o.res || [],
        damage_vulnerabilities: o.vuln || [],
        damage_immunities: o.imm || [],
        condition_immunities: o.cimm || [],
        traits: entradas(o.tr),
        actions: entradas(o.act),
        bonus_actions: entradas(o.ba),
        reactions: entradas(o.rea),
        legendary_actions: entradas(o.la)
      }
    };
  }

  /* ============================ CATÁLOGO ============================ */

  var CATALOGO = [

    m({
      id: 'srd-rat', en: 'Rat', pt: 'Rato', size: 'Tiny', type: 'beast',
      cr: '0', crn: 0, ac: 10, hp: 1, hpF: '1d6-1', init: 0,
      ab: { str: 2, dex: 11, con: 9, int: 2, wis: 10, cha: 4 },
      spd: { walk: 20 }, sen: { darkvision: 30, passive_perception: 10 },
      tr: [{ n: 'Olfato Aguçado', d: 'O rato tem vantagem em testes de Sabedoria (Percepção) baseados em olfato.' }],
      act: [{ n: 'Mordida', d: 'Ataque com Arma Corpo a Corpo: +0 para acertar, alcance 1,5 m, um alvo. Acerto: 1 de dano perfurante.' }]
    }),

    m({
      id: 'srd-kobold-warrior', en: 'Kobold Warrior', pt: 'Guerreiro Kobold', size: 'Small', type: 'humanoid',
      cr: '1/8', crn: 0.125, ac: 12, hp: 5, hpF: '2d6-2', init: 2,
      ab: { str: 7, dex: 15, con: 9, int: 8, wis: 7, cha: 8 },
      spd: { walk: 30 }, sen: { darkvision: 60, passive_perception: 8 },
      lang: ['Comum', 'Dracônico'],
      tr: [
        { n: 'Sensibilidade à Luz Solar', d: 'Sob luz solar direta, o kobold tem desvantagem em jogadas de ataque e em testes de Sabedoria (Percepção) baseados em visão.' },
        { n: 'Táticas de Matilha', d: 'O kobold tem vantagem na jogada de ataque contra uma criatura se pelo menos um aliado do kobold estiver a 1,5 m da criatura e não estiver incapacitado.' }
      ],
      act: [
        { n: 'Adaga', d: 'Ataque com Arma Corpo a Corpo: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d4 + 2) de dano perfurante.' },
        { n: 'Funda', d: 'Ataque com Arma à Distância: +4 para acertar, alcance 9/36 m, um alvo. Acerto: 4 (1d4 + 2) de dano contundente.' }
      ]
    }),

    m({
      id: 'srd-goblin-warrior', en: 'Goblin Warrior', pt: 'Guerreiro Goblin', size: 'Small', type: 'humanoid',
      cr: '1/4', crn: 0.25, ac: 15, hp: 7, hpF: '2d6', init: 2,
      ab: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
      spd: { walk: 30 }, sk: { stealth: 6 }, sen: { darkvision: 60, passive_perception: 9 },
      lang: ['Comum', 'Goblin'],
      tr: [{ n: 'Fuga Ágil', d: 'O goblin pode usar a ação Desengajar ou Esconder-se como ação bônus em cada um de seus turnos.' }],
      act: [
        { n: 'Cimitarra', d: 'Ataque com Arma Corpo a Corpo: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano cortante.' },
        { n: 'Arco Curto', d: 'Ataque com Arma à Distância: +4 para acertar, alcance 24/96 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.' }
      ]
    }),

    m({
      id: 'srd-skeleton', en: 'Skeleton', pt: 'Esqueleto', size: 'Medium', type: 'undead',
      cr: '1/4', crn: 0.25, ac: 13, hp: 13, hpF: '2d8+4', init: 0,
      ab: { str: 10, dex: 14, con: 15, int: 6, wis: 8, cha: 5 },
      spd: { walk: 30 }, vuln: ['bludgeoning'], imm: ['poison'],
      cimm: ['Envenenado', 'Exausto'], sen: { darkvision: 60, passive_perception: 9 },
      lang: ['Comum'],
      act: [
        { n: 'Espada Curta', d: 'Ataque com Arma Corpo a Corpo: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.' },
        { n: 'Arco Curto', d: 'Ataque com Arma à Distância: +4 para acertar, alcance 24/96 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.' }
      ]
    }),

    m({
      id: 'srd-wolf', en: 'Wolf', pt: 'Lobo', size: 'Medium', type: 'beast',
      cr: '1/4', crn: 0.25, ac: 13, hp: 11, hpF: '2d8+2', init: 2,
      ab: { str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6 },
      spd: { walk: 40 }, sk: { perception: 3, stealth: 4 },
      sen: { passive_perception: 13 },
      tr: [
        { n: 'Olfato e Audição Aguçados', d: 'O lobo tem vantagem em testes de Sabedoria (Percepção) baseados em olfato ou audição.' },
        { n: 'Táticas de Matilha', d: 'O lobo tem vantagem na jogada de ataque contra uma criatura se pelo menos um aliado do lobo estiver a 1,5 m da criatura e não estiver incapacitado.' }
      ],
      act: [{ n: 'Mordida', d: 'Ataque com Arma Corpo a Corpo: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (2d4 + 2) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem-sucedido em um teste de resistência de Força CD 11 ou fica Caído.' }]
    }),

    m({
      id: 'srd-zombie', en: 'Zombie', pt: 'Zumbi', size: 'Medium', type: 'undead',
      cr: '1/4', crn: 0.25, ac: 8, hp: 22, hpF: '3d8+9', init: -2,
      ab: { str: 13, dex: 6, con: 16, int: 3, wis: 6, cha: 5 },
      spd: { walk: 20 }, sav: { wis: 0 }, imm: ['poison'],
      cimm: ['Envenenado'], sen: { darkvision: 60, passive_perception: 8 },
      lang: ['Comum'],
      tr: [{ n: 'Resiliência dos Mortos-vivos', d: 'Se o zumbi sofrer dano que o reduza a 0 pontos de vida, ele faz um teste de resistência de Constituição CD 5 + o dano sofrido, a menos que o dano seja radiante ou de um acerto crítico. Em sucesso, cai a 1 ponto de vida.' }],
      act: [{ n: 'Pancada', d: 'Ataque com Arma Corpo a Corpo: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d6 + 1) de dano contundente.' }]
    }),

    m({
      id: 'srd-hobgoblin-warrior', en: 'Hobgoblin Warrior', pt: 'Guerreiro Hobgoblin', size: 'Medium', type: 'humanoid',
      cr: '1/2', crn: 0.5, ac: 18, hp: 11, hpF: '2d8+2', init: 1,
      ab: { str: 13, dex: 12, con: 12, int: 10, wis: 10, cha: 9 },
      spd: { walk: 30 }, sen: { darkvision: 60, passive_perception: 10 },
      lang: ['Comum', 'Goblin'],
      tr: [{ n: 'Vantagem Marcial', d: 'Uma vez por turno, quando o hobgoblin acerta uma criatura com um ataque com arma, ele causa 7 (2d6) de dano adicional se a criatura estiver a 1,5 m de um aliado do hobgoblin que não esteja incapacitado.' }],
      act: [
        { n: 'Espada Longa', d: 'Ataque com Arma Corpo a Corpo: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d8 + 1) de dano cortante, ou 6 (1d10 + 1) se usada com as duas mãos.' },
        { n: 'Arco Longo', d: 'Ataque com Arma à Distância: +3 para acertar, alcance 45/180 m, um alvo. Acerto: 5 (1d8 + 1) de dano perfurante.' }
      ]
    }),

    m({
      id: 'srd-shadow', en: 'Shadow', pt: 'Sombra', size: 'Medium', type: 'undead',
      cr: '1/2', crn: 0.5, ac: 12, hp: 16, hpF: '3d8+3', init: 2,
      ab: { str: 6, dex: 14, con: 13, int: 6, wis: 10, cha: 8 },
      spd: { walk: 40 }, sk: { stealth: 4 },
      res: ['acid', 'cold', 'fire', 'lightning', 'thunder', 'bludgeoning', 'piercing', 'slashing'],
      imm: ['necrotic', 'poison'],
      cimm: ['Exausto', 'Amedrontado', 'Agarrado', 'Paralisado', 'Petrificado', 'Envenenado', 'Caído', 'Impedido', 'Inconsciente'],
      sen: { darkvision: 60, passive_perception: 10 },
      tr: [
        { n: 'Amorfo', d: 'A sombra pode se mover através de espaços de 2,5 cm de largura sem se comprimir.' },
        { n: 'Fraqueza à Luz Solar', d: 'Sob luz solar, a sombra tem desvantagem em jogadas de ataque, testes de atributo e testes de resistência.' }
      ],
      act: [{ n: 'Dreno de Força', d: 'Ataque Mágico Corpo a Corpo: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 9 (2d6 + 2) de dano necrótico, e o valor de Força do alvo é reduzido em 1d4. Se a Força do alvo chegar a 0, ele morre. A redução dura até o alvo terminar um descanso longo.' }]
    }),

    m({
      id: 'srd-specter', en: 'Specter', pt: 'Espectro', size: 'Medium', type: 'undead',
      cr: '1', crn: 1, ac: 12, hp: 22, hpF: '5d8', init: 2,
      ab: { str: 1, dex: 14, con: 11, int: 10, wis: 10, cha: 11 },
      spd: { walk: 0, fly: 50 }, res: ['acid', 'cold', 'fire', 'lightning', 'thunder', 'bludgeoning', 'piercing', 'slashing'],
      imm: ['necrotic', 'poison'],
      cimm: ['Enfeitiçado', 'Exausto', 'Agarrado', 'Paralisado', 'Petrificado', 'Envenenado', 'Caído', 'Impedido', 'Inconsciente'],
      sen: { darkvision: 60, passive_perception: 10 },
      tr: [
        { n: 'Movimento Incorpóreo', d: 'O espectro pode se mover através de outras criaturas e objetos como se fossem terreno difícil. Ele sofre 5 (1d10) de dano de energia se terminar seu turno dentro de um objeto.' },
        { n: 'Sensibilidade à Luz Solar', d: 'Sob luz solar, o espectro tem desvantagem em jogadas de ataque e testes de Sabedoria (Percepção) baseados em visão.' }
      ],
      act: [{ n: 'Dreno de Vida', d: 'Ataque Mágico Corpo a Corpo: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 10 (3d6) de dano necrótico. O alvo deve ser bem-sucedido em um teste de resistência de Constituição CD 10 ou seu máximo de pontos de vida é reduzido em uma quantidade igual ao dano sofrido.' }]
    }),

    m({
      id: 'srd-goblin-boss', en: 'Goblin Boss', pt: 'Chefe Goblin', size: 'Small', type: 'humanoid',
      cr: '1', crn: 1, ac: 17, hp: 21, hpF: '6d6', init: 2,
      ab: { str: 10, dex: 14, con: 10, int: 10, wis: 8, cha: 10 },
      spd: { walk: 30 }, sk: { stealth: 6 }, sen: { darkvision: 60, passive_perception: 9 },
      lang: ['Comum', 'Goblin'],
      tr: [{ n: 'Fuga Ágil', d: 'O goblin pode usar a ação Desengajar ou Esconder-se como ação bônus em cada um de seus turnos.' }],
      act: [
        { n: 'Ataque Múltiplo', d: 'O goblin faz dois ataques com a cimitarra ou o arco curto.' },
        { n: 'Cimitarra', d: 'Ataque com Arma Corpo a Corpo: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano cortante.' },
        { n: 'Arco Curto', d: 'Ataque com Arma à Distância: +4 para acertar, alcance 24/96 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.' }
      ],
      rea: [{ n: 'Redirecionar Ataque', d: 'Quando uma criatura que o goblin possa ver faz um ataque contra ele, o goblin escolhe um aliado a até 1,5 m e troca de lugar com ele, tornando-se o alvo do ataque.' }]
    }),

    m({
      id: 'srd-dire-wolf', en: 'Dire Wolf', pt: 'Lobo Atroz', size: 'Large', type: 'beast',
      cr: '1', crn: 1, ac: 14, hp: 37, hpF: '5d10+10', init: 2,
      ab: { str: 17, dex: 15, con: 15, int: 3, wis: 12, cha: 7 },
      spd: { walk: 50 }, sk: { perception: 3, stealth: 4 },
      sen: { passive_perception: 13 },
      tr: [
        { n: 'Olfato e Audição Aguçados', d: 'O lobo tem vantagem em testes de Sabedoria (Percepção) baseados em olfato ou audição.' },
        { n: 'Táticas de Matilha', d: 'O lobo tem vantagem na jogada de ataque contra uma criatura se pelo menos um aliado do lobo estiver a 1,5 m da criatura e não estiver incapacitado.' }
      ],
      act: [{ n: 'Mordida', d: 'Ataque com Arma Corpo a Corpo: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem-sucedido em um teste de resistência de Força CD 13 ou fica Caído.' }]
    }),

    m({
      id: 'srd-giant-spider', en: 'Giant Spider', pt: 'Aranha Gigante', size: 'Large', type: 'beast',
      cr: '1', crn: 1, ac: 14, hp: 26, hpF: '4d10+4', init: 3,
      ab: { str: 14, dex: 16, con: 12, int: 2, wis: 11, cha: 4 },
      spd: { walk: 30, climb: 30 }, sk: { stealth: 7 },
      sen: { blindsight: 10, darkvision: 60, passive_perception: 10 },
      tr: [
        { n: 'Escalada Aracnídea', d: 'A aranha pode escalar superfícies difíceis, inclusive de cabeça para baixo em tetos, sem precisar de teste de atributo.' },
        { n: 'Sentido de Teia', d: 'Enquanto em contato com uma teia, a aranha sabe a localização exata de qualquer criatura em contato com a mesma teia.' },
        { n: 'Andar na Teia', d: 'A aranha ignora restrições de movimento causadas por teias.' }
      ],
      act: [
        { n: 'Mordida', d: 'Ataque com Arma Corpo a Corpo: +5 para acertar, alcance 1,5 m, uma criatura. Acerto: 7 (1d8 + 3) de dano perfurante, e o alvo deve ser bem-sucedido em um teste de resistência de Constituição CD 11 ou sofre 9 (2d8) de dano de veneno, ou metade em sucesso.' },
        { n: 'Teia', d: 'Ataque com Arma à Distância: +5 para acertar, alcance 9/18 m, uma criatura. Acerto: o alvo fica Impedido pelas teias. Uma criatura agarrada pode usar uma ação para fazer um teste de Força CD 12 e se libertar.' }
      ]
    }),

    m({
      id: 'srd-imp', en: 'Imp', pt: 'Diabrete', size: 'Tiny', type: 'fiend',
      cr: '1', crn: 1, ac: 13, hp: 10, hpF: '3d4+3', init: 3,
      ab: { str: 6, dex: 17, con: 13, int: 11, wis: 12, cha: 14 },
      spd: { walk: 20, fly: 40 },
      sk: { deception: 4, insight: 3, persuasion: 4, stealth: 5 },
      res: ['cold', 'bludgeoning', 'piercing', 'slashing'],
      imm: ['fire', 'poison'], cimm: ['Envenenado'],
      sen: { darkvision: 120, passive_perception: 11 },
      lang: ['Comum', 'Infernal'],
      tr: [
        { n: 'Metamorfo', d: 'O diabrete pode usar sua ação para se transformar em uma forma de besta (rato, corvo ou aranha) ou voltar à sua forma verdadeira.' },
        { n: 'Visão do Diabo', d: 'A escuridão mágica não impede a visão no escuro do diabrete.' },
        { n: 'Resistência à Magia', d: 'O diabrete tem vantagem em testes de resistência contra magias e outros efeitos mágicos.' }
      ],
      act: [{ n: 'Ferroada', d: 'Ataque com Arma Corpo a Corpo: +5 para acertar, alcance 1,5 m, uma criatura. Acerto: 5 (1d4 + 3) de dano perfurante, e o alvo deve ser bem-sucedido em um teste de resistência de Constituição CD 11 ou sofre 10 (3d6) de dano de veneno, ou metade em sucesso.' }]
    }),

    m({
      id: 'srd-ogre', en: 'Ogre', pt: 'Ogro', size: 'Large', type: 'giant',
      cr: '2', crn: 2, ac: 11, hp: 59, hpF: '7d10+21', init: -1,
      ab: { str: 19, dex: 8, con: 16, int: 5, wis: 7, cha: 7 },
      spd: { walk: 40 }, sen: { darkvision: 60, passive_perception: 8 },
      lang: ['Comum', 'Gigante'],
      act: [
        { n: 'Porrete', d: 'Ataque com Arma Corpo a Corpo: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano contundente.' },
        { n: 'Azagaia', d: 'Ataque com Arma Corpo a Corpo ou à Distância: +6 para acertar, alcance 1,5 m ou 9/36 m, um alvo. Acerto: 11 (2d6 + 4) de dano perfurante.' }
      ]
    }),

    m({
      id: 'srd-ghoul', en: 'Ghoul', pt: 'Carniçal', size: 'Medium', type: 'undead',
      cr: '1', crn: 1, ac: 12, hp: 22, hpF: '5d8', init: 2,
      ab: { str: 13, dex: 15, con: 10, int: 7, wis: 10, cha: 6 },
      spd: { walk: 30 }, imm: ['poison'],
      cimm: ['Enfeitiçado', 'Exausto', 'Envenenado'],
      sen: { darkvision: 60, passive_perception: 10 },
      lang: ['Comum'],
      act: [
        { n: 'Mordida', d: 'Ataque com Arma Corpo a Corpo: +2 para acertar, alcance 1,5 m, uma criatura. Acerto: 9 (2d6 + 2) de dano perfurante.' },
        { n: 'Garras', d: 'Ataque com Arma Corpo a Corpo: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (2d4 + 2) de dano cortante. Se o alvo for uma criatura que não seja elfo nem morto-vivo, ele deve ser bem-sucedido em um teste de resistência de Constituição CD 10 ou fica Paralisado por 1 minuto, repetindo o teste ao fim de cada turno.' }
      ]
    }),

    m({
      id: 'srd-knight', en: 'Knight', pt: 'Cavaleiro', size: 'Medium', type: 'humanoid',
      cr: '3', crn: 3, ac: 18, hp: 52, hpF: '8d8+16', init: 0,
      ab: { str: 16, dex: 11, con: 14, int: 11, wis: 11, cha: 15 },
      spd: { walk: 30 }, sav: { con: 4, wis: 2 }, sen: { passive_perception: 10 },
      lang: ['Comum'],
      tr: [{ n: 'Corajoso', d: 'O cavaleiro tem vantagem em testes de resistência para evitar ficar Amedrontado.' }],
      act: [
        { n: 'Ataque Múltiplo', d: 'O cavaleiro faz dois ataques com a espada grande.' },
        { n: 'Espada Grande', d: 'Ataque com Arma Corpo a Corpo: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano cortante.' },
        { n: 'Besta Pesada', d: 'Ataque com Arma à Distância: +2 para acertar, alcance 30/120 m, um alvo. Acerto: 5 (1d10) de dano perfurante.' }
      ],
      rea: [{ n: 'Aparar', d: 'O cavaleiro adiciona 2 à sua Classe de Armadura contra um ataque corpo a corpo que o acertaria. Para isso, precisa ver o atacante e estar empunhando uma arma corpo a corpo.' }]
    }),

    m({
      id: 'srd-owlbear', en: 'Owlbear', pt: 'Urso-Coruja', size: 'Large', type: 'monstrosity',
      cr: '3', crn: 3, ac: 13, hp: 59, hpF: '7d10+21', init: 1,
      ab: { str: 20, dex: 12, con: 17, int: 3, wis: 12, cha: 7 },
      spd: { walk: 40 }, sk: { perception: 3 },
      sen: { darkvision: 60, passive_perception: 13 },
      tr: [{ n: 'Visão e Olfato Aguçados', d: 'O urso-coruja tem vantagem em testes de Sabedoria (Percepção) baseados em visão ou olfato.' }],
      act: [
        { n: 'Ataque Múltiplo', d: 'O urso-coruja faz um ataque com o bico e um com as garras.' },
        { n: 'Bico', d: 'Ataque com Arma Corpo a Corpo: +7 para acertar, alcance 1,5 m, uma criatura. Acerto: 10 (1d10 + 5) de dano perfurante.' },
        { n: 'Garras', d: 'Ataque com Arma Corpo a Corpo: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 14 (2d8 + 5) de dano cortante.' }
      ]
    }),

    m({
      id: 'srd-werewolf', en: 'Werewolf', pt: 'Lobisomem', size: 'Medium', type: 'humanoid',
      cr: '3', crn: 3, ac: 12, hp: 58, hpF: '9d8+18', init: 1,
      ab: { str: 15, dex: 13, con: 14, int: 10, wis: 11, cha: 10 },
      spd: { walk: 30 }, sk: { perception: 4, stealth: 3 },
      imm: ['bludgeoning', 'piercing', 'slashing'],
      sen: { passive_perception: 14 },
      lang: ['Comum'],
      tr: [
        { n: 'Metamorfo', d: 'O lobisomem pode usar sua ação para se transformar em um híbrido de lobo e humanoide ou em um lobo, ou voltar à forma humanoide. Suas estatísticas são as mesmas em todas as formas.' },
        { n: 'Imunidade a Armas Não Mágicas', d: 'O lobisomem é imune a dano contundente, cortante e perfurante de armas não mágicas que não sejam de prata.' }
      ],
      act: [
        { n: 'Ataque Múltiplo', d: 'Na forma de lobo, o lobisomem faz dois ataques com a mordida. Na forma híbrida, faz um ataque com a mordida e um com as garras.' },
        { n: 'Mordida', d: 'Ataque com Arma Corpo a Corpo: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d8 + 2) de dano perfurante. Se o alvo for um humanoide, deve ser bem-sucedido em um teste de resistência de Constituição CD 12 ou é amaldiçoado com licantropia.' },
        { n: 'Garras', d: 'Ataque com Arma Corpo a Corpo: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 7 (2d4 + 2) de dano cortante.' }
      ]
    }),

    m({
      id: 'srd-mummy', en: 'Mummy', pt: 'Múmia', size: 'Medium', type: 'undead',
      cr: '3', crn: 3, ac: 11, hp: 58, hpF: '9d8+18', init: -1,
      ab: { str: 16, dex: 8, con: 15, int: 6, wis: 10, cha: 12 },
      spd: { walk: 20 }, sav: { wis: 2 }, vuln: ['fire'],
      res: ['bludgeoning', 'piercing', 'slashing'],
      imm: ['necrotic', 'poison'],
      cimm: ['Enfeitiçado', 'Exausto', 'Amedrontado', 'Paralisado', 'Envenenado'],
      sen: { darkvision: 60, passive_perception: 10 },
      lang: ['Comum'],
      act: [
        { n: 'Ataque Múltiplo', d: 'A múmia faz um ataque com o punho apodrecido.' },
        { n: 'Punho Apodrecido', d: 'Ataque com Arma Corpo a Corpo: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano contundente mais 10 (3d6) de dano necrótico. Se o alvo for uma criatura, deve ser bem-sucedido em um teste de resistência de Constituição CD 12 ou é amaldiçoado com podridão da múmia.' }
      ]
    }),

    m({
      id: 'srd-troll', en: 'Troll', pt: 'Troll', size: 'Large', type: 'giant',
      cr: '5', crn: 5, ac: 15, hp: 84, hpF: '8d10+40', init: 1,
      ab: { str: 18, dex: 13, con: 20, int: 7, wis: 9, cha: 7 },
      spd: { walk: 30 }, sk: { perception: 2 },
      sen: { darkvision: 60, passive_perception: 12 },
      lang: ['Gigante'],
      tr: [
        { n: 'Olfato Aguçado', d: 'O troll tem vantagem em testes de Sabedoria (Percepção) baseados em olfato.' },
        { n: 'Regeneração', d: 'O troll recupera 10 pontos de vida no início de seu turno. Se sofrer dano de ácido ou de fogo, essa regeneração não funciona no início do próximo turno. O troll só morre se começar seu turno com 0 pontos de vida e não se regenerar.' }
      ],
      act: [
        { n: 'Ataque Múltiplo', d: 'O troll faz um ataque com a mordida e dois com as garras.' },
        { n: 'Mordida', d: 'Ataque com Arma Corpo a Corpo: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d6 + 4) de dano perfurante.' },
        { n: 'Garras', d: 'Ataque com Arma Corpo a Corpo: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.' }
      ]
    }),

    m({
      id: 'srd-fire-elemental', en: 'Fire Elemental', pt: 'Elemental do Fogo', size: 'Large', type: 'elemental',
      cr: '5', crn: 5, ac: 13, hp: 102, hpF: '12d10+36', init: 3,
      ab: { str: 10, dex: 17, con: 16, int: 6, wis: 10, cha: 7 },
      spd: { walk: 50 },
      res: ['bludgeoning', 'piercing', 'slashing'],
      imm: ['fire', 'poison'],
      cimm: ['Exausto', 'Agarrado', 'Paralisado', 'Petrificado', 'Envenenado', 'Caído', 'Impedido', 'Inconsciente'],
      sen: { darkvision: 60, passive_perception: 10 },
      lang: ['Primordial'],
      tr: [
        { n: 'Forma de Fogo', d: 'O elemental pode se mover através de espaços de 2,5 cm de largura sem se comprimir. Uma criatura que entre no elemental ou o toque sofre 5 (1d10) de dano de fogo.' },
        { n: 'Iluminação', d: 'O elemental emite luz plena em um raio de 9 m e penumbra por mais 9 m.' },
        { n: 'Susceptibilidade à Água', d: 'Para cada 1,5 m cúbico de água que o elemental toque, ele sofre 1 de dano de frio.' }
      ],
      act: [
        { n: 'Ataque Múltiplo', d: 'O elemental faz dois ataques de toque.' },
        { n: 'Toque', d: 'Ataque Mágico Corpo a Corpo: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano de fogo. Se o alvo for uma criatura ou objeto inflamável, ele começa a queimar.' }
      ]
    }),

    m({
      id: 'srd-chimera', en: 'Chimera', pt: 'Quimera', size: 'Large', type: 'monstrosity',
      cr: '6', crn: 6, ac: 14, hp: 114, hpF: '12d10+48', init: 0,
      ab: { str: 19, dex: 11, con: 19, int: 3, wis: 14, cha: 10 },
      spd: { walk: 30, fly: 60 }, sk: { perception: 8 },
      sen: { darkvision: 60, passive_perception: 18 },
      lang: ['Comum', 'Dracônico'],
      act: [
        { n: 'Ataque Múltiplo', d: 'A quimera faz três ataques: um com a mordida, um com os chifres e um com as garras.' },
        { n: 'Mordida', d: 'Ataque com Arma Corpo a Corpo: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano perfurante.' },
        { n: 'Chifres', d: 'Ataque com Arma Corpo a Corpo: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (1d12 + 4) de dano contundente.' },
        { n: 'Garras', d: 'Ataque com Arma Corpo a Corpo: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.' },
        { n: 'Sopro de Fogo (Recarga 5–6)', d: 'A cabeça de dragão exala fogo em um cone de 4,5 m. Cada criatura na área faz um teste de resistência de Destreza CD 15, sofrendo 31 (7d8) de dano de fogo em falha, ou metade em sucesso.' }
      ]
    }),

    m({
      id: 'srd-mage', en: 'Mage', pt: 'Mago', size: 'Medium', type: 'humanoid',
      cr: '6', crn: 6, ac: 12, hp: 40, hpF: '9d8', init: 2,
      ab: { str: 9, dex: 14, con: 11, int: 17, wis: 12, cha: 11 },
      spd: { walk: 30 }, sav: { int: 6, wis: 4 },
      sk: { arcana: 6, history: 6 }, sen: { passive_perception: 11 },
      lang: ['Comum', 'Dracônico', 'Anão', 'Élfico'],
      tr: [{ n: 'Conjuração', d: 'O mago é um conjurador de 9º nível. Seu atributo de conjuração é Inteligência (CD de resistência 14, +6 para acertar com ataques mágicos). Ele prepara magias como Mísseis Mágicos, Escudo Arcano, Bola de Fogo e Voo.' }],
      act: [
        { n: 'Adaga', d: 'Ataque com Arma Corpo a Corpo ou à Distância: +5 para acertar, alcance 1,5 m ou 6/18 m, um alvo. Acerto: 4 (1d4 + 2) de dano perfurante.' }
      ]
    }),

    m({
      id: 'srd-mind-flayer', en: 'Mind Flayer', pt: 'Devorador de Mentes', size: 'Medium', type: 'aberration',
      cr: '7', crn: 7, ac: 15, hp: 71, hpF: '13d8+13', init: 2,
      ab: { str: 11, dex: 12, con: 12, int: 19, wis: 17, cha: 17 },
      spd: { walk: 30, fly: 15 },
      sav: { int: 7, wis: 6, cha: 6 },
      sk: { arcana: 7, deception: 6, insight: 6, perception: 6, persuasion: 6, stealth: 5 },
      sen: { darkvision: 120, passive_perception: 16 },
      lang: ['Dialeto Obscuro', 'Subcomum'],
      tr: [
        { n: 'Resistência à Magia', d: 'O devorador de mentes tem vantagem em testes de resistência contra magias e outros efeitos mágicos.' },
        { n: 'Telepatia', d: 'O devorador de mentes pode se comunicar telepaticamente com qualquer criatura a até 36 m que compreenda ao menos um idioma.' }
      ],
      act: [
        { n: 'Tentáculos', d: 'Ataque Mágico Corpo a Corpo: +7 para acertar, alcance 1,5 m, uma criatura. Acerto: 15 (2d10 + 4) de dano psíquico. Se o alvo for Médio ou menor, fica Agarrado (CD 15 para escapar).' },
        { n: 'Explosão Mental (Recarga 5–6)', d: 'O devorador emite energia psíquica em um cone de 18 m. Cada criatura na área faz um teste de resistência de Inteligência CD 15, sofrendo 22 (4d8 + 4) de dano psíquico e ficando Atordoada por 1 minuto em falha, ou metade do dano em sucesso.' }
      ]
    }),

    m({
      id: 'srd-fire-giant', en: 'Fire Giant', pt: 'Gigante do Fogo', size: 'Huge', type: 'giant',
      cr: '9', crn: 9, ac: 18, hp: 162, hpF: '13d12+78', init: -1,
      ab: { str: 25, dex: 9, con: 23, int: 10, wis: 14, cha: 13 },
      spd: { walk: 30 }, sav: { dex: 3, con: 10, cha: 5 },
      sk: { athletics: 11, perception: 6 }, sen: { passive_perception: 16 },
      lang: ['Gigante'],
      act: [
        { n: 'Ataque Múltiplo', d: 'O gigante faz dois ataques com a espada grande.' },
        { n: 'Espada Grande', d: 'Ataque com Arma Corpo a Corpo: +11 para acertar, alcance 3 m, um alvo. Acerto: 28 (6d6 + 7) de dano cortante.' },
        { n: 'Rocha', d: 'Ataque com Arma à Distância: +11 para acertar, alcance 18/72 m, um alvo. Acerto: 29 (4d10 + 7) de dano contundente.' }
      ]
    }),

    m({
      id: 'srd-archmage', en: 'Archmage', pt: 'Arquimago', size: 'Medium', type: 'humanoid',
      cr: '12', crn: 12, ac: 12, hp: 99, hpF: '18d8+18', init: 2,
      ab: { str: 10, dex: 14, con: 12, int: 20, wis: 15, cha: 16 },
      spd: { walk: 30 }, sav: { int: 9, wis: 6 },
      sk: { arcana: 13, history: 13 }, sen: { passive_perception: 12 },
      lang: ['Comum', 'Dracônico', 'Anão', 'Élfico', 'Goblin', 'Infernal'],
      tr: [
        { n: 'Resistência à Magia', d: 'O arquimago tem vantagem em testes de resistência contra magias e outros efeitos mágicos.' },
        { n: 'Conjuração', d: 'O arquimago é um conjurador de 18º nível. Seu atributo de conjuração é Inteligência (CD de resistência 17, +9 para acertar com ataques mágicos). Ele prepara magias como Contramágica, Bola de Fogo, Teleporte e Parar o Tempo.' }
      ],
      act: [
        { n: 'Adaga', d: 'Ataque com Arma Corpo a Corpo ou à Distância: +6 para acertar, alcance 1,5 m ou 6/18 m, um alvo. Acerto: 4 (1d4 + 2) de dano perfurante.' }
      ]
    }),

    m({
      id: 'srd-beholder', en: 'Beholder', pt: 'Observador', size: 'Large', type: 'aberration',
      cr: '13', crn: 13, ac: 18, hp: 180, hpF: '19d10+76', init: 2,
      ab: { str: 10, dex: 14, con: 18, int: 17, wis: 15, cha: 17 },
      spd: { walk: 0, fly: 20 }, sav: { int: 8, wis: 7, cha: 8 },
      sk: { perception: 12 }, sen: { darkvision: 120, passive_perception: 22 },
      lang: ['Dialeto Obscuro'],
      tr: [
        { n: 'Cone Antimagia', d: 'O olho central do observador cria uma área de antimagia em um cone de 45 m. Nenhuma magia ou efeito mágico funciona nessa área, exceto efeitos de artefatos ou divindades.' },
        { n: 'Telepatia', d: 'O observador pode se comunicar telepaticamente com qualquer criatura a até 36 m que compreenda ao menos um idioma.' }
      ],
      act: [
        { n: 'Mordida', d: 'Ataque com Arma Corpo a Corpo: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 14 (4d6) de dano perfurante.' },
        { n: 'Raios Oculares', d: 'O observador dispara três raios oculares aleatórios contra alvos que possa ver a até 36 m. Cada raio tem um efeito próprio, como paralisia, medo, dano necrótico ou desintegração, com testes de resistência apropriados.' }
      ]
    }),

    m({
      id: 'srd-adult-red-dragon', en: 'Adult Red Dragon', pt: 'Dragão Vermelho Adulto', size: 'Huge', type: 'dragon',
      cr: '17', crn: 17, ac: 19, hp: 256, hpF: '19d12+133', init: 0,
      ab: { str: 27, dex: 10, con: 25, int: 16, wis: 13, cha: 21 },
      spd: { walk: 40, climb: 40, fly: 80 },
      sav: { dex: 6, con: 13, wis: 7, cha: 11 },
      sk: { perception: 13, stealth: 6 }, imm: ['fire'],
      sen: { blindsight: 60, darkvision: 120, passive_perception: 23 },
      lang: ['Comum', 'Dracônico'],
      tr: [
        { n: 'Resistência Lendária (3/dia)', d: 'Se o dragão falhar em um teste de resistência, pode escolher ser bem-sucedido.' }
      ],
      act: [
        { n: 'Ataque Múltiplo', d: 'O dragão usa sua Presença Aterradora e faz três ataques: um com a mordida e dois com as garras.' },
        { n: 'Mordida', d: 'Ataque com Arma Corpo a Corpo: +14 para acertar, alcance 3 m, um alvo. Acerto: 19 (2d10 + 8) de dano perfurante mais 7 (2d6) de dano de fogo.' },
        { n: 'Garra', d: 'Ataque com Arma Corpo a Corpo: +14 para acertar, alcance 1,5 m, um alvo. Acerto: 15 (2d6 + 8) de dano cortante.' },
        { n: 'Cauda', d: 'Ataque com Arma Corpo a Corpo: +14 para acertar, alcance 4,5 m, um alvo. Acerto: 17 (2d8 + 8) de dano contundente.' },
        { n: 'Sopro de Fogo (Recarga 5–6)', d: 'O dragão exala fogo em um cone de 18 m. Cada criatura na área faz um teste de resistência de Destreza CD 21, sofrendo 63 (18d6) de dano de fogo em falha, ou metade em sucesso.' },
        { n: 'Presença Aterradora', d: 'Cada criatura escolhida pelo dragão a até 36 m deve ser bem-sucedida em um teste de resistência de Sabedoria CD 19 ou fica Amedrontada por 1 minuto, repetindo o teste ao fim de cada turno.' }
      ],
      la: [
        { n: 'Detectar', d: 'O dragão faz um teste de Sabedoria (Percepção).' },
        { n: 'Ataque com a Cauda', d: 'O dragão faz um ataque com a cauda.' },
        { n: 'Ataque com Asas', d: 'O dragão bate as asas. Cada criatura a até 3 m deve ser bem-sucedida em um teste de resistência de Destreza CD 22 ou sofre 15 (2d6 + 8) de dano contundente e fica Caída.' }
      ]
    }),

    m({
      id: 'srd-lich', en: 'Lich', pt: 'Lich', size: 'Medium', type: 'undead',
      cr: '21', crn: 21, ac: 17, hp: 135, hpF: '18d8+54', init: 3,
      ab: { str: 11, dex: 16, con: 16, int: 20, wis: 14, cha: 16 },
      spd: { walk: 30 }, sav: { con: 10, int: 12, wis: 9 },
      sk: { arcana: 19, history: 12, insight: 9, perception: 9 },
      res: ['cold', 'lightning', 'necrotic', 'bludgeoning', 'piercing', 'slashing'],
      imm: ['poison'],
      cimm: ['Enfeitiçado', 'Exausto', 'Amedrontado', 'Paralisado', 'Envenenado'],
      sen: { truesight: 36, passive_perception: 19 },
      lang: ['Comum', 'Dialeto Obscuro', 'Infernal', 'Abissal', 'Dracônico'],
      tr: [
        { n: 'Resistência Lendária (3/dia)', d: 'Se o lich falhar em um teste de resistência, pode escolher ser bem-sucedido.' },
        { n: 'Rejuvenescimento', d: 'Se o lich for destruído, ele recupera a forma em 1d10 dias, desde que sua filactéria exista.' },
        { n: 'Conjuração', d: 'O lich é um conjurador de 18º nível. Seu atributo de conjuração é Inteligência (CD de resistência 20, +12 para acertar com ataques mágicos). Ele prepara magias como Dedo da Morte, Muralha de Força e Parar o Tempo.' }
      ],
      act: [
        { n: 'Toque Paralisante', d: 'Ataque Mágico Corpo a Corpo: +12 para acertar, alcance 1,5 m, uma criatura. Acerto: 10 (3d6) de dano de frio. O alvo deve ser bem-sucedido em um teste de resistência de Constituição CD 18 ou fica Paralisado por 1 minuto, repetindo o teste ao fim de cada turno.' }
      ],
      la: [
        { n: 'Truque', d: 'O lich lança um truque.' },
        { n: 'Toque Paralisante', d: 'O lich faz um ataque com o Toque Paralisante.' },
        { n: 'Olhar Aterrorizante', d: 'O lich olha para uma criatura a até 3 m. Se ela puder vê-lo, deve ser bem-sucedida em um teste de resistência de Sabedoria CD 18 ou fica Amedrontada por 1 minuto.' }
      ]
    }),

    m({
      id: 'srd-tarrasque', en: 'Tarrasque', pt: 'Tarrasque', size: 'Gargantuan', type: 'monstrosity',
      cr: '30', crn: 30, ac: 25, hp: 676, hpF: '33d20+330', init: 0,
      ab: { str: 30, dex: 11, con: 30, int: 3, wis: 11, cha: 11 },
      spd: { walk: 40 }, sav: { int: 5, wis: 9, cha: 9 },
      imm: ['fire', 'poison', 'bludgeoning', 'piercing', 'slashing'],
      cimm: ['Enfeitiçado', 'Amedrontado', 'Paralisado', 'Envenenado'],
      sen: { blindsight: 36, passive_perception: 10 },
      tr: [
        { n: 'Resistência Lendária (3/dia)', d: 'Se o tarrasque falhar em um teste de resistência, pode escolher ser bem-sucedido.' },
        { n: 'Resistência à Magia', d: 'O tarrasque tem vantagem em testes de resistência contra magias e outros efeitos mágicos.' },
        { n: 'Carapaça Refletora', d: 'Se o tarrasque for alvo de uma magia de raio e for bem-sucedido no teste de resistência, o raio é refletido de volta ao conjurador.' },
        { n: 'Monstro de Cerco', d: 'O tarrasque causa o dobro de dano a objetos e estruturas.' }
      ],
      act: [
        { n: 'Ataque Múltiplo', d: 'O tarrasque usa sua Presença Aterradora e faz cinco ataques: um com a mordida, dois com as garras, um com os chifres e um com a cauda.' },
        { n: 'Mordida', d: 'Ataque com Arma Corpo a Corpo: +19 para acertar, alcance 3 m, um alvo. Acerto: 36 (4d12 + 10) de dano perfurante. Se o alvo for uma criatura, fica Agarrado (CD 20 para escapar).' },
        { n: 'Garra', d: 'Ataque com Arma Corpo a Corpo: +19 para acertar, alcance 4,5 m, um alvo. Acerto: 28 (4d8 + 10) de dano cortante.' },
        { n: 'Chifres', d: 'Ataque com Arma Corpo a Corpo: +19 para acertar, alcance 3 m, um alvo. Acerto: 27 (4d8 + 9) de dano perfurante.' },
        { n: 'Cauda', d: 'Ataque com Arma Corpo a Corpo: +19 para acertar, alcance 6 m, um alvo. Acerto: 25 (4d6 + 10) de dano contundente.' },
        { n: 'Presença Aterradora', d: 'Cada criatura escolhida pelo tarrasque a até 36 m deve ser bem-sucedida em um teste de resistência de Sabedoria CD 17 ou fica Amedrontada por 1 minuto.' }
      ],
      la: [
        { n: 'Ataque', d: 'O tarrasque faz um ataque com a garra ou a cauda.' },
        { n: 'Mover-se', d: 'O tarrasque se move até metade de seu deslocamento.' },
        { n: 'Devorar', d: 'O tarrasque faz um ataque com a mordida contra uma criatura Agarrada por ele.' }
      ]
    })

  ];

  /* ============================ NORMALIZAÇÃO ============================ */

  function normalizeMonster(monster) {
    var stat = monster.stat_block_json || {};
    var ptName = monster.nome_pt || null;
    return {
      id: monster.id,
      nome: ptName || monster.name,
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
      tracos: stat.traits || [],
      acoes: stat.actions || [],
      acoesBonus: stat.bonus_actions || [],
      reacoes: stat.reactions || [],
      acoesLendarias: stat.legendary_actions || [],
      fonte: 'SRD 5.2.1 (embutido)',
      licenca: 'CC BY 4.0',
      dados: stat
    };
  }

  /* ============================ API PÚBLICA ============================ */

  window.MONSTERS = CATALOGO.map(normalizeMonster);
  window.SRD_MONSTERS = window.MONSTERS;
  window.MONSTER_MANUAL_URL = MONSTER_MANUAL_URL;
  window.MONSTERS_ERROR = null;

  window.MONSTERS_META = {
    sistema: 'Dungeons & Dragons 5e',
    manualAtual: 'Livro dos Monstros',
    srd: '5.2.1',
    blocosCompletosCarregados: window.MONSTERS.length,
    fonte: 'Dados embutidos diretamente em monsters.js (sem fetch, sem CDN)',
    licenca: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    urlSRD: 'https://www.dndbeyond.com/srd',
    urlLivro: MONSTER_MANUAL_URL,
    idiomaDadosDeRegra: 'PT-BR',
    idiomaNomes: 'PT-BR',
    cacheLocal: 'Não há cache: todo o bestiário está no arquivo e funciona offline.',
    aviso: 'Catálogo embutido e ampliável. Adicione novos monstros no array CATALOGO.'
  };

  /* Resolve imediatamente: nada é buscado de fora. */
  window.MONSTERS_READY = Promise.resolve(window.MONSTERS);

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
      return [m.nome, m.nomeEn].some(function (n) {
        return String(n || '').toLocaleLowerCase('pt-BR') === q;
      });
    }) || matches[0] || null;
  };
})();
