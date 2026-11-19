(function (global) {
  'use strict';

  var ATRIBUTOS = ['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'];
  var ATTR_EN = { str: 'FOR', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR' };
  var ATTR_PT = { forca: 'FOR', destreza: 'DES', constituicao: 'CON', inteligencia: 'INT', sabedoria: 'SAB', carisma: 'CAR' };
  var NOME_ATTR = { FOR: 'Força', DES: 'Destreza', CON: 'Constituição', INT: 'Inteligência', SAB: 'Sabedoria', CAR: 'Carisma' };
  var CLASSES_MAESTRIA = ['Bárbaro', 'Guerreiro', 'Paladino', 'Guardião', 'Ladino'];
  var XP_POR_ND = { '0': 10, '0.125': 25, '0.25': 50, '0.5': 100, '1': 200, '2': 450, '3': 700, '4': 1100, '5': 1800, '6': 2300, '7': 2900, '8': 3900, '9': 5000, '10': 5900, '11': 7200, '12': 8400, '13': 10000, '14': 11500, '15': 13000, '16': 15000, '17': 18000, '18': 20000, '19': 22000, '20': 25000, '21': 33000, '22': 41000, '23': 50000, '24': 62000, '25': 75000, '26': 90000, '27': 105000, '28': 120000, '29': 135000, '30': 155000 };

  var CONDICOES = {
    cego: 'Cego', surdo: 'Surdo', enfeiticado: 'Enfeitiçado', amedrontado: 'Amedrontado', agarrado: 'Agarrado',
    incapacitado: 'Incapacitado', invisivel: 'Invisível', paralisado: 'Paralisado', petrificado: 'Petrificado',
    envenenado: 'Envenenado', caido: 'Caído', contido: 'Contido', atordoado: 'Atordoado', inconsciente: 'Inconsciente'
  };
  var COND_ALIAS = [
    ['enfeitic', 'enfeiticado'], ['charmed', 'enfeiticado'], ['amedront', 'amedrontado'], ['assustad', 'amedrontado'], ['frightened', 'amedrontado'],
    ['agarrad', 'agarrado'], ['grappled', 'agarrado'], ['incapacit', 'incapacitado'], ['invisiv', 'invisivel'], ['invisible', 'invisivel'],
    ['paralis', 'paralisado'], ['paralyzed', 'paralisado'], ['petrific', 'petrificado'], ['petrified', 'petrificado'],
    ['envenen', 'envenenado'], ['poisoned', 'envenenado'], ['prostrad', 'caido'], ['caid', 'caido'], ['prone', 'caido'],
    ['contid', 'contido'], ['restrained', 'contido'], ['atordo', 'atordoado'], ['stunned', 'atordoado'],
    ['inconscien', 'inconsciente'], ['unconscious', 'inconsciente'], ['ceg', 'cego'], ['blinded', 'cego'], ['surd', 'surdo'], ['deafened', 'surdo']
  ];
  var TIPOS_DANO = {
    contundente: 'contundente', bludgeoning: 'contundente', cortante: 'cortante', slashing: 'cortante', perfurante: 'perfurante', piercing: 'perfurante',
    fogo: 'fogo', fire: 'fogo', gelo: 'gelo', frio: 'gelo', cold: 'gelo', acido: 'acido', acid: 'acido',
    eletrico: 'eletrico', relampago: 'eletrico', lightning: 'eletrico', trovejante: 'trovejante', trovao: 'trovejante', thunder: 'trovejante',
    venenoso: 'venenoso', veneno: 'venenoso', poison: 'venenoso', necrotico: 'necrotico', necrotic: 'necrotico',
    radiante: 'radiante', radiant: 'radiante', psiquico: 'psiquico', psychic: 'psiquico', energetico: 'energetico', energia: 'energetico', force: 'energetico'
  };
  var ROTULO_DANO = {
    contundente: 'contundente', cortante: 'cortante', perfurante: 'perfurante', fogo: 'fogo', gelo: 'gelo', acido: 'ácido',
    eletrico: 'elétrico', trovejante: 'trovejante', venenoso: 'venenoso', necrotico: 'necrótico', radiante: 'radiante',
    psiquico: 'psíquico', energetico: 'energético'
  };
  var FISICOS = ['contundente', 'cortante', 'perfurante'];
  var PALAVRAS_NUM = { um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6 };

  function norm(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
  function d(n) { return 1 + Math.floor(Math.random() * n); }
  function mod(score) { return Math.floor((Number(score) - 10) / 2); }
  function sinal(n) { n = Number(n) || 0; return (n >= 0 ? '+' : '') + n; }
  function nomeTipo(t) { return ROTULO_DANO[t] || t || 'sem tipo'; }

  function rolar(expr, critico) {
    var s = String(expr == null ? '0' : expr).replace(/\s/g, '').toLowerCase().replace(/−/g, '-');
    if (!s) s = '0';
    var re = /([+-]?)(\d*)d(\d+)|([+-]?)(\d+)/g, m, dados = [], fixo = 0, total = 0, achou = false;
    while ((m = re.exec(s))) {
      achou = true;
      if (m[3]) {
        var sinalDado = m[1] === '-' ? -1 : 1;
        var qtd = Math.max(1, Math.min(60, Number(m[2] || 1))) * (critico ? 2 : 1);
        var lados = Math.max(2, Math.min(1000, Number(m[3])));
        for (var i = 0; i < qtd; i++) { var v = d(lados); dados.push(sinalDado * v); total += sinalDado * v; }
      } else {
        var n = (m[4] === '-' ? -1 : 1) * Number(m[5]);
        fixo += n; total += n;
      }
    }
    if (!achou) return null;
    return { total: Math.max(0, total), dados: dados, fixo: fixo, formula: s, critico: !!critico };
  }
  function mediaDano(expr) {
    var s = String(expr || '0').replace(/\s/g, '').toLowerCase(), re = /([+-]?)(\d*)d(\d+)|([+-]?)(\d+)/g, m, t = 0;
    while ((m = re.exec(s))) {
      if (m[3]) t += (m[1] === '-' ? -1 : 1) * Math.max(1, Number(m[2] || 1)) * (Number(m[3]) + 1) / 2;
      else t += (m[4] === '-' ? -1 : 1) * Number(m[5]);
    }
    return t;
  }
  function d20(modo) {
    var a = d(20), b = modo ? d(20) : null;
    var r = modo === 1 ? Math.max(a, b) : modo === -1 ? Math.min(a, b) : a;
    return { dado: r, dados: modo ? [a, b] : [a], modo: modo || 0 };
  }
  function modoFinal(vant, desv) {
    if (vant.length && desv.length) return 0;
    return vant.length ? 1 : desv.length ? -1 : 0;
  }
  function textoD20(r, bonus, total) {
    var base = '1d20' + (r.modo === 1 ? ' (vantagem: ' + r.dados.join(' e ') + ')' : r.modo === -1 ? ' (desvantagem: ' + r.dados.join(' e ') + ')' : ' (' + r.dado + ')');
    return base + ' ' + sinal(bonus) + ' = ' + total;
  }

  function canonicoDano(texto) {
    var s = norm(texto), chaves = Object.keys(TIPOS_DANO).sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < chaves.length; i++) if (s.indexOf(chaves[i]) >= 0) return TIPOS_DANO[chaves[i]];
    return null;
  }
  function idCondicao(texto) {
    var s = norm(texto);
    for (var i = 0; i < COND_ALIAS.length; i++) if (s.indexOf(COND_ALIAS[i][0]) >= 0) return COND_ALIAS[i][1];
    return null;
  }
  function atributoDeTexto(texto) {
    var s = norm(texto), chaves = Object.keys(ATTR_PT);
    for (var i = 0; i < chaves.length; i++) if (s.indexOf(chaves[i]) >= 0) return ATTR_PT[chaves[i]];
    return null;
  }
  function parseDefesas(lista) {
    var out = {};
    var texto = (lista || []).join(', ');
    texto.split(';').forEach(function (seg) {
      var naoMagico = /nonmagical|nao magic|nao-magic|non-magical/.test(norm(seg));
      seg.split(',').forEach(function (parte) {
        var tipo = canonicoDano(parte);
        if (!tipo) return;
        var qual = naoMagico && FISICOS.indexOf(tipo) >= 0;
        out[tipo] = { naoMagico: qual };
      });
    });
    return out;
  }
  function cellsDeMedida(valor, unidade) {
    var n = Number(String(valor).replace(',', '.'));
    if (!isFinite(n)) return 0;
    var u = norm(unidade);
    if (u.indexOf('pe') === 0 || u === 'ft') return Math.max(1, Math.round(n / 5));
    return Math.max(1, Math.round(n / 1.5));
  }
  function proficienciaPorND(nd) {
    var n = Number(nd) || 0;
    return Math.max(2, Math.ceil(n / 4) + 1);
  }

  function parseAcaoMonstro(a, todas) {
    var desc = String(a.description || '');
    var nome = String(a.name || 'Ação');
    var baixo = norm(desc);
    var recarga = nome.match(/Recarga\s*(\d)(?:\s*[-–]\s*(\d))?/i);
    var base = { nome: nome, descricao: desc, recarga: recarga ? Number(recarga[1]) : null };
    if (/multiataque|multiattack/.test(norm(nome))) {
      var q = null, mq = baixo.match(/(\d+)d(\d+)\s+ataques/);
      if (mq) q = { dados: mq[1] + 'd' + mq[2] };
      else {
        var mn = baixo.match(/(?:faz|realiza|efetua|executa)\s+(um|uma|dois|duas|tres|quatro|cinco|seis)\s+ataques?/);
        q = { n: mn ? PALAVRAS_NUM[mn[1]] : 2 };
      }
      base.tipo = 'multi'; base.qtd = q; base.texto = baixo;
      return base;
    }
    var bonusDesc = desc.match(/Ataque[^:]*:\s*([+-]\d+)\s+para acertar/i);
    var bonusAtq = a.attack_bonus != null ? Number(a.attack_bonus) : (bonusDesc ? Number(bonusDesc[1]) : null);
    if (bonusAtq != null) {
      var corpo = /corpo a corpo/.test(baixo), dist = /a distancia|de longo alcance|longo alcance|distancia/.test(baixo);
      var alc = {};
      var reach = baixo.match(/alcance\s+([\d,.]+)\s*(m|metros?|pes|pés|ft)\b(?!\s*\/)/);
      var rng = baixo.match(/([\d,.]+)\s*\/\s*([\d,.]+)\s*(m|metros?|pes|ft)/);
      var rng1 = baixo.match(/alcance de\s+([\d,.]+)\s*(m|metros?|pes|ft)/);
      var reachCells = reach ? cellsDeMedida(reach[1], reach[2]) : 1;
      var distN = 0, distM = 0;
      if (rng) { distN = cellsDeMedida(rng[1], rng[3]); distM = cellsDeMedida(rng[2], rng[3]); }
      else if (rng1) { distN = distM = cellsDeMedida(rng1[1], rng1[2]); }
      var tipoAtq = corpo && distN ? 'ambos' : (dist && !corpo) || (!corpo && distN) ? 'distancia' : 'corpo';
      if (tipoAtq === 'distancia' && !distN) { distN = distM = reachCells; }
      var danos = (a.damage || []).map(function (x) { return { dados: String(x.dice).replace(/\s/g, ''), tipo: canonicoDano(x.type) }; });
      if (!danos.length) {
        var trecho = desc.slice(Math.max(0, desc.search(/Acerto\s*:/i)));
        var corte = trecho.search(/teste de resist/i);
        if (corte > 0) trecho = trecho.slice(0, corte);
        var reD = /\((\d+d\d+(?:\s*[+-]\s*\d+)?)\)\s*de dano\s+(?:de\s+)?([A-Za-zÀ-ú]+)/gi, mdn;
        while ((mdn = reD.exec(trecho))) danos.push({ dados: mdn[1].replace(/\s/g, ''), tipo: canonicoDano(mdn[2]) });
        if (!danos.length) {
          var mf = trecho.match(/Acerto\s*:\s*(\d+)\s+(?:de\s+)?dano\s+(?:de\s+)?([A-Za-zÀ-ú]+)/i);
          if (mf) danos.push({ dados: mf[1], tipo: canonicoDano(mf[2]) });
        }
      }
      var extra = parseEfeitoAcerto(desc);
      var item = {
        nome: nome, descricao: desc, tipo: 'ataque', modo: tipoAtq, bonus: bonusAtq,
        alcanceCorpo: reachCells, alcanceNormal: distN, alcanceMax: distM, dano: danos, extra: extra,
        magico: /magico/.test(baixo.split('acerto')[0] || ''), recarga: base.recarga
      };
      return item;
    }
    var sv = desc.match(/teste de resist[eê]ncia de\s+([A-Za-zÀ-ú]+)\s+CD\s+(\d+)/i);
    if (sv) {
      var atr = atributoDeTexto(sv[1]);
      var dmg = desc.match(/\((\d+d\d+(?:\s*[+-]\s*\d+)?)\)\s*de dano\s+(?:de\s+)?([A-Za-zÀ-ú]+)/i);
      var area = baixo.match(/(?:cone|linha|raio|esfera|cubo|emanacao)[^.]*?([\d,.]+)\s*(metros?|m|pes|ft)\b/) || baixo.match(/a ate\s+([\d,.]+)\s*(metros?|m|pes|ft)/);
      var cond = null;
      var mc = baixo.match(/(ficara|fica|ficam|ficaria)\s+([a-z]+)/);
      if (mc) cond = idCondicao(mc[2]);
      if (!cond) {
        var tentativas = ['amedront', 'assustad', 'paralis', 'envenen', 'contid', 'atordo', 'inconscien', 'enfeitic', 'cego', 'cegad', 'agarrad', 'prostrad', 'caid'];
        for (var i = 0; i < tentativas.length; i++) if (baixo.indexOf(tentativas[i]) >= 0) { cond = idCondicao(tentativas[i]); break; }
      }
      var dur = baixo.match(/por\s+(\d+)\s+(minuto|hora|rodada|turno)/);
      var rodadas = dur ? (dur[2] === 'minuto' ? Number(dur[1]) * 10 : dur[2] === 'hora' ? 600 : Number(dur[1])) : null;
      return {
        nome: nome, descricao: desc, tipo: 'salva', atributo: atr || 'CON', cd: Number(sv[2]),
        dano: dmg ? [{ dados: dmg[1].replace(/\s/g, ''), tipo: canonicoDano(dmg[2]) }] : [],
        metade: /metade do dano/.test(baixo), condicao: cond, rodadas: rodadas,
        area: area ? cellsDeMedida(area[1], area[2]) : 0, recarga: base.recarga,
        repete: /repetir o teste de resistencia/.test(baixo)
      };
    }
    base.tipo = 'texto';
    return base;
  }
  function parseEfeitoAcerto(desc) {
    var pos = desc.search(/Acerto\s*:/i);
    if (pos < 0) return null;
    var resto = desc.slice(pos), baixo = norm(resto);
    var out = {};
    var sv = resto.match(/teste de resist[eê]ncia de\s+([A-Za-zÀ-ú]+)\s+CD\s+(\d+)/i);
    if (sv) {
      out.salva = { atributo: atributoDeTexto(sv[1]) || 'CON', cd: Number(sv[2]) };
      var depois = resto.slice(resto.indexOf(sv[0]));
      var dmg = depois.match(/(\d+)\s*\((\d+d\d+(?:\s*[+-]\s*\d+)?)\)\s*de dano\s+(?:de\s+)?([A-Za-zÀ-ú]+)/i);
      if (dmg) { out.dano = dmg[2].replace(/\s/g, ''); out.tipo = canonicoDano(dmg[3]); out.metade = /metade do dano/.test(norm(depois)); }
      var tentativas = ['envenen', 'paralis', 'contid', 'atordo', 'amedront', 'assustad', 'prostrad', 'caid', 'cego', 'agarrad', 'inconscien'];
      for (var i = 0; i < tentativas.length; i++) if (norm(depois).indexOf(tentativas[i]) >= 0) { out.condicao = idCondicao(tentativas[i]); break; }
      var dur = norm(depois).match(/por\s+(\d+)\s+(minuto|hora|rodada|turno)/);
      out.rodadas = dur ? (dur[2] === 'minuto' ? Number(dur[1]) * 10 : dur[2] === 'hora' ? 600 : Number(dur[1])) : 10;
      out.repete = /repetir o teste de resistencia/.test(norm(depois));
    } else if (/contid[oa] por uma teia|fica contid/.test(baixo)) {
      out.condicao = 'contido'; out.rodadas = null;
    } else if (/agarrad/.test(baixo)) {
      var esc = resto.match(/CD\s+(?:de\s+)?escape\s+(\d+)|escape\s+CD\s+(\d+)/i);
      out.condicao = 'agarrado'; out.escape = esc ? Number(esc[1] || esc[2]) : null; out.rodadas = null;
    }
    var extraDano = resto.match(/mais\s+\d+\s*\((\d+d\d+(?:\s*[+-]\s*\d+)?)\)\s*(?:de\s+)?dano\s+(?:de\s+)?([A-Za-zÀ-ú]+)/i);
    if (extraDano && !out.salva) { out.danoAdicional = extraDano[1].replace(/\s/g, ''); out.tipoAdicional = canonicoDano(extraDano[2]); }
    return Object.keys(out).length ? out : null;
  }

  function criar(env) {
    var C = {};
    var cacheMonstros = null;

    function est() {
      var s = env.estado();
      if (!s.ordem) { s.ativo = false; s.rodada = 0; s.turno = 0; s.ordem = []; s.registro = []; }
      if (!s.registro) s.registro = [];
      return s;
    }
    function toks() { return env.tokens(); }
    function porId(id) { return toks().find(function (t) { return t.id === id; }) || null; }
    function monstro(t) {
      if (!t || !t.monsterId) return null;
      if (!cacheMonstros) { cacheMonstros = {}; (env.monstros() || []).forEach(function (m) { cacheMonstros[m.id] = m; }); }
      return cacheMonstros[t.monsterId] || null;
    }
    function ehJogador(t) { return !!t && (t.tipo === 'player' || t.heroi === true); }
    function faccao(t) {
      if (t.faccao) return t.faccao;
      return ehJogador(t) || t.aliado ? 'jogadores' : 'monstros';
    }
    function hostis(a, b) { return faccao(a) !== faccao(b); }
    function registrar(linhas) {
      var s = est();
      (linhas || []).forEach(function (l) { s.registro.push(l); });
      if (s.registro.length > 120) s.registro.splice(0, s.registro.length - 120);
    }

    function statsMonstro(t) {
      var m = monstro(t);
      var atrib = {}, mods = {};
      ATRIBUTOS.forEach(function (a) { atrib[a] = 10; });
      if (m) Object.keys(m.atributos || {}).forEach(function (k) { if (ATTR_EN[k]) atrib[ATTR_EN[k]] = Number(m.atributos[k]) || 10; });
      ATRIBUTOS.forEach(function (a) { mods[a] = mod(atrib[a]); });
      var prof = proficienciaPorND(m ? m.ndNumerico : 0);
      var salvas = {};
      ATRIBUTOS.forEach(function (a) { salvas[a] = mods[a]; });
      if (m) Object.keys(m.salvaguardas || {}).forEach(function (k) { if (ATTR_EN[k]) salvas[ATTR_EN[k]] = Number(m.salvaguardas[k]); });
      var ataques = [];
      var todas = m ? (m.acoes || []) : [];
      todas.forEach(function (a) { ataques.push(parseAcaoMonstro(a, todas)); });
      if (!m) ataques.push({ nome: 'Golpe', tipo: 'ataque', modo: 'corpo', bonus: Number(t.bonusAtaque) || 2, alcanceCorpo: 1, alcanceNormal: 0, alcanceMax: 0, dano: [{ dados: t.dano || '1d6', tipo: 'contundente' }], extra: null });
      var veloc = m && m.deslocamento ? Math.round((Number(m.deslocamento.deslocamento) || 30) / 5) : 6;
      var tracos = m ? (m.tracos || []) : [];
      return {
        tipo: 'monstro', nome: t.nome, ca: Number(t.ca || t.classeArmadura || (m && m.classeArmadura) || 10), pvMax: Number(t.hpMax || (m && m.pontosVida) || 10),
        veloc: Math.max(0, veloc), atrib: atrib, mods: mods, prof: prof, salvas: salvas, tam: Math.max(1, Number(t.raio) || 1),
        defesas: { resist: parseDefesas(m && m.resistenciasDano), imune: parseDefesas(m && m.imunidadesDano), vuln: parseDefesas(m && m.vulnerabilidadesDano) },
        imunCond: (m ? m.imunidadesCondicao || [] : []).map(idCondicao).filter(Boolean),
        ataques: ataques, ataquesPorAcao: 1, iniciativa: m ? Number(m.iniciativa) || mods.DES : mods.DES, classe: '', maestria: false,
        tracos: tracos, nd: m ? m.nd : t.nd, ndNumerico: m ? m.ndNumerico : 0, nivel: 0
      };
    }
    function statsPC(t) {
      var sh = env.pcStats ? env.pcStats(t) : null;
      var atrib = {}, mods = {};
      ATRIBUTOS.forEach(function (a) { atrib[a] = sh && sh.atrib && sh.atrib[a] != null ? sh.atrib[a] : 10; mods[a] = mod(atrib[a]); });
      var prof = sh && sh.prof ? sh.prof : 2;
      var salvas = {};
      ATRIBUTOS.forEach(function (a) { salvas[a] = sh && sh.salvas && sh.salvas[a] != null ? sh.salvas[a] : mods[a]; });
      var classe = sh && sh.classe ? sh.classe : '';
      return {
        tipo: 'pc', nome: t.nome, ca: Number(t.ca || (sh && sh.ca) || 10), pvMax: Number((sh && sh.pvMax) || t.hpMax || 10),
        veloc: sh && sh.veloc ? sh.veloc : 6, atrib: atrib, mods: mods, prof: prof, salvas: salvas, tam: Math.max(1, Number(t.raio) || 1),
        defesas: { resist: {}, imune: {}, vuln: {} }, imunCond: [], ataques: [], ataquesPorAcao: (sh && sh.ataquesPorAcao) || 1,
        iniciativa: mods.DES, classe: classe, maestria: !!(sh && sh.maestria), tracos: [], nivel: (sh && sh.nivel) || 1,
        pericias: (sh && sh.pericias) || {}
      };
    }
    function stats(t) { return ehJogador(t) || !monstro(t) && t.tipo === 'player' ? statsPC(t) : statsMonstro(t); }

    function novaEco() {
      return { acao: true, bonus: true, reacao: true, mov: 0, movExtra: 0, ataquesRestantes: 0, furtivo: false, leve: false, nick: false, cleave: false, esquiva: false, desengajou: false, ajudou: null, ajudado: false };
    }
    function preparar(t) {
      var s = stats(t);
      if (t.hpMax == null || t.hpMax <= 0) t.hpMax = s.pvMax;
      if (t.hp == null) t.hp = t.hpMax;
      if (t.hpTemp == null) t.hpTemp = 0;
      if (!Array.isArray(t.condicoes)) t.condicoes = [];
      if (t.exaustao == null) t.exaustao = 0;
      if (!t.mortes) t.mortes = { s: 0, f: 0 };
      if (!t.eco) t.eco = novaEco();
      if (!t.efeitos) t.efeitos = {};
      if (t.cobertura == null) t.cobertura = 0;
      if (!t.recargas) t.recargas = {};
      if (!t.usos) t.usos = {};
      return s;
    }

    function condSet(t) {
      var set = {};
      (t.condicoes || []).forEach(function (c) { set[c.id] = true; });
      if (set.paralisado || set.petrificado || set.atordoado || set.inconsciente) set.incapacitado = true;
      if (set.inconsciente) set.caido = true;
      return set;
    }
    function tem(t, id) { return !!condSet(t)[id]; }
    function incapacitado(t) { return !!t.morto || tem(t, 'incapacitado'); }
    function condicaoFonte(t, id) {
      var c = (t.condicoes || []).find(function (x) { return x.id === id; });
      return c ? c.fonte : null;
    }
    function imuneCondicao(t, id) {
      if (id === 'amedrontado' && t.efeitos && t.efeitos.imuneMedo) return true;
      return stats(t).imunCond.indexOf(id) >= 0;
    }
    function aplicarCondicao(t, id, opts) {
      opts = opts || {};
      if (!CONDICOES[id]) return null;
      if (imuneCondicao(t, id)) return (t.nome || 'Criatura') + ' é imune à condição ' + CONDICOES[id] + '.';
      if (id === 'caido' && tem(t, 'caido')) return null;
      var existente = (t.condicoes || []).find(function (c) { return c.id === id && c.fonte === (opts.fonte || null); });
      if (existente) {
        if (opts.rodadas != null) existente.rodadas = opts.rodadas;
        return null;
      }
      t.condicoes.push({ id: id, fonte: opts.fonte || null, rodadas: opts.rodadas == null ? null : opts.rodadas, salva: opts.salva || null });
      if (id === 'inconsciente' || id === 'paralisado' || id === 'atordoado') t.preparada = null;
      return (t.nome || 'Criatura') + ' fica ' + CONDICOES[id] + '.';
    }
    function removerCondicao(t, id) {
      var antes = (t.condicoes || []).length;
      t.condicoes = (t.condicoes || []).filter(function (c) { return c.id !== id; });
      return antes !== t.condicoes.length;
    }

    function veloc(t) {
      var s = stats(t), v = s.veloc - (t.exaustao || 0);
      var set = condSet(t);
      if (set.agarrado || set.contido || set.paralisado || set.petrificado || set.atordoado || set.inconsciente || t.morto) return 0;
      if (t.efeitos && t.efeitos.lento) v -= t.efeitos.lento.celulas || 2;
      return Math.max(0, v);
    }
    function movimentoRestante(t) {
      if (!t.eco) return veloc(t);
      return Math.max(0, veloc(t) + (t.eco.movExtra || 0) - (t.eco.mov || 0));
    }

    function pegadaDist(ax, ay, ra, bx, by, rb) {
      var dx = Math.max(0, ax - (bx + rb - 1), bx - (ax + ra - 1));
      var dy = Math.max(0, ay - (by + rb - 1), by - (ay + ra - 1));
      return Math.max(dx, dy);
    }
    function dist(a, b) {
      return pegadaDist(a.x, a.y, Math.max(1, a.raio || 1), b.x, b.y, Math.max(1, b.raio || 1));
    }
    function celulasEm(m) { return m / 1.5; }

    C.CONDICOES = CONDICOES;
    C.NOME_ATTR = NOME_ATTR;
    C.ATRIBUTOS = ATRIBUTOS;
    C.util = { rolar: rolar, d20: d20, d: d, mod: mod, sinal: sinal, norm: norm, nomeTipo: nomeTipo, canonicoDano: canonicoDano, idCondicao: idCondicao, mediaDano: mediaDano, parseAcaoMonstro: parseAcaoMonstro, parseDefesas: parseDefesas };
    C._interno = {
      est: est, toks: toks, porId: porId, monstro: monstro, ehJogador: ehJogador, faccao: faccao, hostis: hostis, registrar: registrar,
      stats: stats, preparar: preparar, novaEco: novaEco, condSet: condSet, tem: tem, incapacitado: incapacitado, condicaoFonte: condicaoFonte,
      aplicarCondicao: aplicarCondicao, removerCondicao: removerCondicao, veloc: veloc, movimentoRestante: movimentoRestante, dist: dist,
      pegadaDist: pegadaDist, celulasEm: celulasEm, modoFinal: modoFinal, textoD20: textoD20, XP_POR_ND: XP_POR_ND, CLASSES_MAESTRIA: CLASSES_MAESTRIA,
      env: env, FISICOS: FISICOS
    };
    function mts(n) { return String(Math.round(n * 15) / 10).replace('.', ','); }
    function nomeDe(t) { return (t && t.nome) || 'Criatura'; }
    function viva(t) { return !!t && !t.morto; }
    function adjacentesInimigos(t) {
      return toks().filter(function (o) { return o !== t && viva(o) && hostis(t, o) && !incapacitado(o) && dist(t, o) <= 1; });
    }
    function bonusPericia(t, nome, attrPadrao) {
      var s = stats(t);
      if (s.pericias && s.pericias[nome] != null) return Number(s.pericias[nome]);
      return s.mods[attrPadrao || 'DES'];
    }
    function pontosDeVidaTexto(t) {
      return 'PV ' + Math.max(0, t.hp) + '/' + t.hpMax + (t.hpTemp ? ' (+' + t.hpTemp + ' temp.)' : '');
    }

    function vantagemAtaque(att, alvo, atq, distancia) {
      var v = [], ds = [];
      var ca = condSet(att), cd = condSet(alvo);
      var sa = stats(att);
      if (ca.cego) ds.push('atacante cego');
      if (ca.envenenado) ds.push('atacante envenenado');
      if (ca.contido) ds.push('atacante contido');
      if (ca.caido) ds.push('atacante caído');
      if (ca.amedrontado) {
        var fo = porId(condicaoFonte(att, 'amedrontado'));
        if (!fo || env.linhaVisao(att, fo)) ds.push('atacante amedrontado');
      }
      if (ca.agarrado) {
        var g = condicaoFonte(att, 'agarrado');
        if (g && g !== alvo.id) ds.push('atacante agarrado');
      }
      if (ca.invisivel) v.push('atacante invisível');
      if (att.escondido) v.push('atacante escondido');
      if (cd.cego) v.push('alvo cego');
      if (cd.contido) v.push('alvo contido');
      if (cd.paralisado) v.push('alvo paralisado');
      if (cd.petrificado) v.push('alvo petrificado');
      if (cd.atordoado) v.push('alvo atordoado');
      if (cd.inconsciente) v.push('alvo inconsciente');
      if (cd.invisivel) ds.push('alvo invisível');
      if (alvo.escondido) ds.push('alvo escondido');
      if (cd.caido) {
        if (distancia <= 1) v.push('alvo caído ao alcance'); else ds.push('alvo caído à distância');
      }
      if (alvo.eco && alvo.eco.esquiva && !incapacitado(alvo) && veloc(alvo) > 0) ds.push('alvo esquivando');
      if (atq.distancia && adjacentesInimigos(att).length) ds.push('inimigo adjacente');
      if (atq.distancia && distancia > (atq.alcanceNormal || 0) && atq.alcanceNormal) ds.push('alcance longo');
      if (att.efeitos && att.efeitos.vex && att.efeitos.vex.alvo === alvo.id) v.push('Vex');
      if (att.efeitos && att.efeitos.sap) ds.push('Sap');
      if (att.efeitos && att.efeitos.ajudadoPor) v.push('ajudado');
      if (alvo.efeitos && alvo.efeitos.distraido) {
        var helper = porId(alvo.efeitos.distraido);
        if (helper && faccao(helper) === faccao(att)) v.push('alvo distraído');
      }
      var pack = (sa.tracos || []).some(function (tr) { return /t[aá]ticas de matilha|pack tactics/i.test(tr.name || tr.nome || ''); });
      if (pack) {
        var aliado = toks().some(function (o) { return o !== att && viva(o) && faccao(o) === faccao(att) && !incapacitado(o) && dist(o, alvo) <= 1; });
        if (aliado) v.push('Táticas de matilha');
      }
      return { modo: modoFinal(v, ds), v: v, ds: ds };
    }

    function consumirEfeitosDeAtaque(att, alvo) {
      if (att.efeitos) {
        if (att.efeitos.vex && att.efeitos.vex.alvo === alvo.id) delete att.efeitos.vex;
        delete att.efeitos.sap;
        delete att.efeitos.ajudadoPor;
        att.efeitos.furiaAtividade = true;
      }
      if (alvo.efeitos && alvo.efeitos.distraido) delete alvo.efeitos.distraido;
      att.escondido = false;
    }

    function derrotar(t, L) {
      t.hp = 0; t.morto = true; t.condicoes = []; t.concentracao = null; t.preparada = null; t.escondido = false;
      toks().forEach(function (o) {
        if (o.condicoes) o.condicoes = o.condicoes.filter(function (c) { return !(c.id === 'agarrado' && c.fonte === t.id); });
      });
      L.push(nomeDe(t) + ' foi derrotado.');
    }

    function aplicarDano(t, partes, ctx) {
      ctx = ctx || {};
      var L = [], s = preparar(t), totalCausado = 0, detalhes = [];
      if (t.morto) return { linhas: [nomeDe(t) + ' já está derrotado.'], total: 0 };
      var restante = 0;
      (partes || []).forEach(function (p) {
        var v = Math.max(0, Math.round(Number(p.valor) || 0));
        if (!v) return;
        var tipo = p.tipo || null, nota = '';
        var imune = tipo && s.defesas.imune[tipo] && (!s.defesas.imune[tipo].naoMagico || !ctx.magico);
        var res = tipo && s.defesas.resist[tipo] && (!s.defesas.resist[tipo].naoMagico || !ctx.magico);
        var vul = tipo && s.defesas.vuln[tipo];
        if (t.efeitos && t.efeitos.furia && FISICOS.indexOf(tipo) >= 0) res = true;
        if (tem(t, 'petrificado')) res = true;
        if (imune) { v = 0; nota = ' (imune)'; }
        else {
          if (res) { v = Math.floor(v / 2); nota = ' (resistência)'; }
          if (vul) { v = v * 2; nota = res ? ' (resistência e vulnerabilidade)' : ' (vulnerabilidade)'; }
        }
        restante += v;
        detalhes.push(v + ' ' + nomeTipo(tipo) + nota);
      });
      totalCausado = restante;
      if (!totalCausado) {
        L.push(nomeDe(t) + ' não sofre dano' + (detalhes.length ? ' [' + detalhes.join(', ') + ']' : '') + '.');
        return { linhas: L, total: 0 };
      }
      if (t.efeitos) t.efeitos.furiaAtividade = true;
      var jaCaido = t.hp <= 0;
      if (t.hpTemp > 0) {
        var abs = Math.min(t.hpTemp, restante);
        t.hpTemp -= abs; restante -= abs;
        if (abs) detalhes.push(abs + ' absorvidos pelos PV temporários');
      }
      L.push(nomeDe(t) + ' sofre ' + totalCausado + ' de dano [' + detalhes.join(', ') + '].');
      if (!restante) { L.push(pontosDeVidaTexto(t) + '.'); return { linhas: L, total: totalCausado }; }
      if (ehJogador(t) && jaCaido) {
        if (restante >= t.hpMax) { derrotar(t, L); L[L.length - 1] = nomeDe(t) + ' morre por dano maciço.'; return { linhas: L, total: totalCausado }; }
        t.mortes.f += ctx.critico ? 2 : 1;
        t.estavel = false;
        L.push(nomeDe(t) + ' sofre dano com 0 PV: ' + (ctx.critico ? '2 falhas' : '1 falha') + ' na salvaguarda contra a morte (' + t.mortes.f + '/3).');
        if (t.mortes.f >= 3) { derrotar(t, L); L[L.length - 1] = nomeDe(t) + ' morre.'; }
        return { linhas: L, total: totalCausado };
      }
      var novo = t.hp - restante;
      if (novo > 0) {
        t.hp = novo;
        L.push(pontosDeVidaTexto(t) + '.');
        if (t.concentracao) {
          var cd = Math.min(30, Math.max(10, Math.floor(totalCausado / 2)));
          var rs = C.salvar(t, 'CON', cd, { chave: 'concentracao' });
          L.push(rs.texto + ' (Concentração em ' + t.concentracao + ')');
          if (!rs.sucesso) { L.push(nomeDe(t) + ' perde a concentração em ' + t.concentracao + '.'); t.concentracao = null; }
        }
        return { linhas: L, total: totalCausado };
      }
      var excesso = -novo;
      t.hp = 0;
      if (ehJogador(t)) {
        t.concentracao = null;
        if (excesso >= t.hpMax) { derrotar(t, L); L[L.length - 1] = nomeDe(t) + ' morre por dano maciço.'; }
        else {
          t.mortes = { s: 0, f: 0 }; t.estavel = false;
          aplicarCondicao(t, 'inconsciente', {});
          if (!tem(t, 'caido')) aplicarCondicao(t, 'caido', {});
          if (t.efeitos) { delete t.efeitos.furia; }
          L.push(nomeDe(t) + ' cai a 0 PV e fica inconsciente.');
        }
      } else derrotar(t, L);
      return { linhas: L, total: totalCausado };
    }

    function curar(t, valor) {
      var L = [];
      if (t.morto) return [nomeDe(t) + ' está morto e não pode ser curado desta forma.'];
      var v = Math.max(0, Math.round(valor));
      var estava0 = t.hp <= 0;
      t.hp = Math.min(t.hpMax, t.hp + v);
      if (estava0 && t.hp > 0) {
        removerCondicao(t, 'inconsciente');
        t.mortes = { s: 0, f: 0 }; t.estavel = false;
        L.push(nomeDe(t) + ' recupera a consciência.');
      }
      L.unshift(nomeDe(t) + ' recupera ' + v + ' PV. ' + pontosDeVidaTexto(t) + '.');
      return L;
    }

    function salvar(t, atributo, cd, opts) {
      opts = opts || {};
      var s = stats(t), set = condSet(t);
      var texto;
      if ((atributo === 'FOR' || atributo === 'DES') && (set.paralisado || set.petrificado || set.atordoado || set.inconsciente)) {
        texto = nomeDe(t) + ': salvaguarda de ' + NOME_ATTR[atributo] + ' falha automaticamente.';
        return { sucesso: false, auto: true, dado: 0, total: 0, texto: texto };
      }
      var v = [], ds = [];
      if (opts.vantagem) v.push('efeito');
      if (opts.desvantagem) ds.push('efeito');
      if (t.efeitos && t.efeitos.furia && atributo === 'FOR') v.push('fúria');
      if (set.contido && atributo === 'DES') ds.push('contido');
      if (opts.magico && (s.tracos || []).some(function (tr) { return /resist[eê]ncia (m[aá]gica|[àa] magia)|magic resistance/i.test(tr.name || tr.nome || ''); })) v.push('Resistência Mágica');
      var r = d20(modoFinal(v, ds));
      var b = (s.salvas[atributo] != null ? s.salvas[atributo] : s.mods[atributo]) - 2 * (t.exaustao || 0);
      var total = r.dado + b;
      var ok = total >= cd;
      texto = nomeDe(t) + ': salvaguarda de ' + NOME_ATTR[atributo] + ' ' + textoD20(r, b, total) + ' contra CD ' + cd + ' — ' + (ok ? 'sucesso' : 'falha') + '.';
      return { sucesso: ok, auto: false, dado: r.dado, total: total, texto: texto };
    }
    C.salvar = salvar;

    function salvaContraMorte(t) {
      var r = d(20), L = [];
      if (r === 20) {
        t.hp = 1; t.mortes = { s: 0, f: 0 }; t.estavel = false; removerCondicao(t, 'inconsciente');
        L.push(nomeDe(t) + ': salvaguarda contra a morte (20) — recupera 1 PV e a consciência.');
        return L;
      }
      if (r === 1) { t.mortes.f += 2; L.push(nomeDe(t) + ': salvaguarda contra a morte (1) — 2 falhas (' + t.mortes.f + '/3).'); }
      else if (r >= 10) { t.mortes.s += 1; L.push(nomeDe(t) + ': salvaguarda contra a morte (' + r + ') — sucesso (' + t.mortes.s + '/3).'); }
      else { t.mortes.f += 1; L.push(nomeDe(t) + ': salvaguarda contra a morte (' + r + ') — falha (' + t.mortes.f + '/3).'); }
      if (t.mortes.f >= 3) { derrotar(t, L); L[L.length - 1] = nomeDe(t) + ' morre.'; }
      else if (t.mortes.s >= 3) { t.estavel = true; L.push(nomeDe(t) + ' está estável.'); }
      return L;
    }

    function aplicarEfeitosAcerto(att, alvo, atq, L) {
      var ex = atq.extra;
      if (!ex) return;
      if (ex.danoAdicional) {
        var rd = rolar(ex.danoAdicional, false);
        if (rd) L.push.apply(L, aplicarDano(alvo, [{ valor: rd.total, tipo: ex.tipoAdicional }], { magico: !!atq.magico, fonte: att }).linhas);
      }
      if (ex.salva) {
        var rs = salvar(alvo, ex.salva.atributo, ex.salva.cd, { magico: !!atq.magico });
        L.push(rs.texto);
        var parts = [];
        if (ex.dano) {
          var rdx = rolar(ex.dano, false);
          if (rdx) {
            var val = rs.sucesso ? (ex.metade ? Math.floor(rdx.total / 2) : 0) : rdx.total;
            if (val > 0) parts.push({ valor: val, tipo: ex.tipo });
          }
        }
        if (parts.length) L.push.apply(L, aplicarDano(alvo, parts, { magico: !!atq.magico, fonte: att }).linhas);
        if (!rs.sucesso && ex.condicao && !alvo.morto) {
          var msg = aplicarCondicao(alvo, ex.condicao, { fonte: att.id, rodadas: ex.rodadas, salva: ex.repete ? { atributo: ex.salva.atributo, cd: ex.salva.cd } : null });
          if (msg) L.push(msg);
        }
      } else if (ex.condicao === 'agarrado' && !alvo.morto) {
        var msg2 = aplicarCondicao(alvo, 'agarrado', { fonte: att.id, rodadas: null });
        var cg = (alvo.condicoes || []).find(function (c) { return c.id === 'agarrado' && c.fonte === att.id; });
        if (cg && ex.escape) cg.escape = ex.escape;
        if (msg2) L.push(msg2 + (ex.escape ? ' CD de escape ' + ex.escape + '.' : ''));
      }
    }

    function nomeMaestria(txt) {
      var n = norm(txt);
      var mapa = { cleave: 'cleave', nick: 'nick', vex: 'vex', sap: 'sap', lento: 'lento', slow: 'lento', empurrar: 'empurrar', push: 'empurrar', derrubar: 'derrubar', topple: 'derrubar', raspar: 'raspar', graze: 'raspar' };
      return mapa[n] || null;
    }

    function atacar(att, alvo, atq, opts) {
      opts = opts || {};
      var L = [];
      var sa = preparar(att), sd = preparar(alvo);
      var nA = nomeDe(att), nD = nomeDe(alvo);
      var falha = function (m) { return { ok: false, linhas: [m], acertou: false, critico: false, dano: 0 }; };
      if (alvo.morto) return falha(nD + ' já foi derrotado.');
      if (incapacitado(att)) return falha(nA + ' está incapacitado e não pode atacar.');
      if (tem(att, 'enfeiticado') && condicaoFonte(att, 'enfeiticado') === alvo.id) return falha(nA + ' está enfeitiçado e não pode atacar ' + nD + '.');
      var distancia = dist(att, alvo);
      var alcMax = atq.alcanceMax || atq.alcanceNormal || 1;
      if (distancia > alcMax) return falha(nD + ' está fora do alcance de ' + atq.nome + ' (' + distancia + ' > ' + alcMax + ' quadrículas).');
      if (!opts.ignorarVisao && !env.linhaVisao(att, alvo)) return falha(nA + ' não tem linha de visão para ' + nD + '.');
      if (alvo.cobertura >= 99) return falha(nD + ' tem cobertura total.');
      var vant = vantagemAtaque(att, alvo, atq, distancia);
      var r = d20(vant.modo);
      var bonus = (Number(atq.bonus) || 0) - 2 * (att.exaustao || 0);
      var total = r.dado + bonus;
      var ca = sd.ca + (alvo.cobertura === 2 || alvo.cobertura === 5 ? alvo.cobertura : 0);
      var natCrit = r.dado === 20, natFalha = r.dado === 1;
      var acertou = natCrit || (!natFalha && total >= ca);
      var razoes = vant.modo === 1 ? ' [vantagem: ' + vant.v.join(', ') + ']' : vant.modo === -1 ? ' [desvantagem: ' + vant.ds.join(', ') + ']' : (vant.v.length && vant.ds.length ? ' [vantagem e desvantagem se anulam]' : '');
      L.push(nA + ' ataca ' + nD + ' com ' + atq.nome + ': ' + textoD20(r, bonus, total) + ' contra CA ' + ca + (alvo.cobertura === 2 ? ' (cobertura parcial)' : alvo.cobertura === 5 ? ' (cobertura de três quartos)' : '') + razoes + '.');
      var maestriaAtiva = sa.maestria && atq.arma && atq.maestria ? nomeMaestria(atq.maestria) : null;
      var resultado = { ok: true, acertou: acertou, critico: false, dano: 0 };
      var haviaVex = att.efeitos && att.efeitos.vex && att.efeitos.vex.alvo === alvo.id;
      var eraVant = vant.modo === 1;
      var haviaAliado = toks().some(function (o) { return o !== att && viva(o) && faccao(o) === faccao(att) && !incapacitado(o) && dist(o, alvo) <= 1; });
      consumirEfeitosDeAtaque(att, alvo);
      if (!acertou) {
        L.push(natFalha ? 'Falha crítica: o ataque erra.' : 'O ataque erra.');
        if (maestriaAtiva === 'raspar' && atq.modAtributo > 0 && atq.dano && atq.dano[0]) {
          L.push.apply(L, aplicarDano(alvo, [{ valor: atq.modAtributo, tipo: atq.dano[0].tipo }], { magico: !!atq.magico, fonte: att }).linhas);
          L[L.length - 1] += ' (Raspar)';
        }
        return Object.assign(resultado, { linhas: L });
      }
      var crit = natCrit || (distancia <= 1 && (tem(alvo, 'paralisado') || tem(alvo, 'inconsciente')));
      resultado.critico = crit;
      if (crit) L.push(natCrit ? 'Acerto crítico!' : 'Acerto crítico automático (alvo indefeso ao alcance).');
      var partes = [], textoDano = [];
      (atq.dano || []).forEach(function (p) {
        var rd = rolar(p.dados, crit);
        if (!rd) return;
        partes.push({ valor: rd.total, tipo: p.tipo });
        textoDano.push(rd.total + ' ' + nomeTipo(p.tipo) + ' (' + p.dados + (crit ? ', dados dobrados' : '') + (rd.dados.length ? ': ' + rd.dados.join('+') : '') + ')');
      });
      var tipoBase = atq.dano && atq.dano[0] ? atq.dano[0].tipo : null;
      if (att.efeitos && att.efeitos.furia && atq.arma && !atq.distancia && atq.atributoMod === 'FOR') {
        partes.push({ valor: Math.max(2, 2 + Math.floor(((sa.nivel || 1) - 1) / 8)), tipo: tipoBase });
        textoDano.push('+2 de Fúria');
      }
      if (sa.classe === 'Ladino' && atq.arma && !att.eco.furtivo && (atq.acuidade || atq.distancia) && !(vant.modo === -1)) {
        if (eraVant || haviaVex || (!eraVant && haviaAliado)) {
          var dadosFurtivo = Math.ceil((sa.nivel || 1) / 2) + 'd6';
          var rf = rolar(dadosFurtivo, crit);
          if (rf) { partes.push({ valor: rf.total, tipo: tipoBase }); textoDano.push(rf.total + ' de Ataque Furtivo (' + dadosFurtivo + ')'); att.eco.furtivo = true; }
        }
      }
      if (textoDano.length) L.push('Dano: ' + textoDano.join(' + ') + '.');
      var res = aplicarDano(alvo, partes, { critico: crit, magico: !!atq.magico, fonte: att });
      L.push.apply(L, res.linhas);
      resultado.dano = res.total;
      if (!alvo.morto) aplicarEfeitosAcerto(att, alvo, atq, L);
      if (maestriaAtiva && res.total > 0 && !alvo.morto) {
        if (maestriaAtiva === 'vex') { att.efeitos.vex = { alvo: alvo.id, turnos: 2 }; L.push('Maestria Vex: vantagem no próximo ataque de ' + nA + ' contra ' + nD + '.'); }
        else if (maestriaAtiva === 'sap') { alvo.efeitos.sap = { fonte: att.id }; L.push('Maestria Sap: ' + nD + ' terá desvantagem no próximo ataque.'); }
        else if (maestriaAtiva === 'lento') { alvo.efeitos.lento = { fonte: att.id, celulas: 2 }; L.push('Maestria Lento: deslocamento de ' + nD + ' reduzido em 3 m.'); }
        else if (maestriaAtiva === 'empurrar') {
          if (sd.tam <= 2 && env.empurrar) {
            var n = env.empurrar(alvo, att, 2);
            L.push('Maestria Empurrar: ' + nD + (n ? ' é empurrado ' + mts(n) + ' m.' : ' não pode ser empurrado (obstáculo).'));
          } else L.push('Maestria Empurrar: ' + nD + ' é grande demais para ser empurrado.');
        } else if (maestriaAtiva === 'derrubar') {
          var cdT = 8 + (atq.modAtributo || 0) + sa.prof;
          var rt = salvar(alvo, 'CON', cdT, {});
          L.push('Maestria Derrubar: ' + rt.texto);
          if (!rt.sucesso) { var mq = aplicarCondicao(alvo, 'caido', {}); if (mq) L.push(mq); }
        } else if (maestriaAtiva === 'cleave' && !att.eco.cleave && atq.pesada && !opts.semCleave) {
          var outro = toks().find(function (o) { return o !== alvo && o !== att && viva(o) && hostis(att, o) && dist(o, alvo) <= 1 && dist(att, o) <= alcMax; });
          if (outro) {
            att.eco.cleave = true;
            var atqC = Object.assign({}, atq, { dano: (atq.dano || []).map(function (p) { return { dados: p.dados.replace(/[+-]\d+$/, ''), tipo: p.tipo }; }), nome: atq.nome + ' (Cleave)' });
            var rc = atacar(att, outro, atqC, { semCleave: true });
            L.push.apply(L, rc.linhas);
          }
        }
      }
      return Object.assign(resultado, { linhas: L });
    }
    C.atacar = atacar;
    C.aplicarDano = aplicarDano;
    C.curar = curar;
    C.salvaContraMorte = salvaContraMorte;

    C.alvosPossiveis = function (att, atq, incluirAliados) {
      var alcMax = atq.alcanceMax || atq.alcanceNormal || 1;
      return toks().filter(function (o) {
        if (o === att || !viva(o)) return false;
        if (!incluirAliados && !hostis(att, o)) return false;
        if (o.cobertura >= 99) return false;
        if (dist(att, o) > alcMax) return false;
        return env.linhaVisao(att, o);
      }).map(function (o) { return { token: o, distancia: dist(att, o) }; }).sort(function (a, b) { return a.distancia - b.distancia; });
    };

    function limparEfeitosDaFonte(id) {
      toks().forEach(function (o) {
        if (!o.efeitos) return;
        if (o.efeitos.lento && o.efeitos.lento.fonte === id) delete o.efeitos.lento;
        if (o.efeitos.sap && o.efeitos.sap.fonte === id) delete o.efeitos.sap;
        if (o.efeitos.ajudadoPor === id) delete o.efeitos.ajudadoPor;
        if (o.efeitos.distraido === id) delete o.efeitos.distraido;
      });
    }

    function iniciarTurno(t) {
      var L = [], s = preparar(t);
      var recarga = t.recargas || {};
      t.eco = novaEco();
      limparEfeitosDaFonte(t.id);
      L.push('— Turno de ' + nomeDe(t) + ' —');
      if (t.efeitos && t.efeitos.furia) {
        if (!t.efeitos.furiaAtividade) { delete t.efeitos.furia; L.push(nomeDe(t) + ' não atacou nem sofreu dano desde o último turno: a Fúria termina.'); }
        t.efeitos.furiaAtividade = false;
      }
      (s.ataques || []).forEach(function (a) {
        if (a.recarga && recarga[a.nome] === false) {
          var r = d(6);
          if (r >= a.recarga) { recarga[a.nome] = true; L.push(a.nome + ' recarregou (d6 = ' + r + ').'); }
          else L.push(a.nome + ' não recarregou (d6 = ' + r + ').');
        }
      });
      t.recargas = recarga;
      if (ehJogador(t) && t.hp <= 0 && !t.morto && !t.estavel) L.push.apply(L, salvaContraMorte(t));
      return L;
    }

    function encerrarTurno(t) {
      var L = [];
      (t.condicoes || []).slice().forEach(function (c) {
        if (c.salva) {
          var fonte = porId(c.fonte);
          var rs = salvar(t, c.salva.atributo, c.salva.cd, { desvantagem: c.id === 'amedrontado' && fonte && env.linhaVisao(t, fonte) && c.salva.desvDeVisao });
          L.push(rs.texto);
          if (rs.sucesso) { t.condicoes = t.condicoes.filter(function (x) { return x !== c; }); L.push(CONDICOES[c.id] + ' termina em ' + nomeDe(t) + '.'); return; }
        }
        if (c.rodadas != null) {
          c.rodadas -= 1;
          if (c.rodadas <= 0) { t.condicoes = t.condicoes.filter(function (x) { return x !== c; }); L.push(CONDICOES[c.id] + ' termina em ' + nomeDe(t) + '.'); }
        }
      });
      if (t.efeitos && t.efeitos.vex) { t.efeitos.vex.turnos -= 1; if (t.efeitos.vex.turnos <= 0) delete t.efeitos.vex; }
      return L;
    }

    C.atual = function () {
      var s = est();
      if (!s.ativo || !s.ordem.length) return null;
      var item = s.ordem[s.turno];
      return item ? porId(item.id) : null;
    };
    C.ativo = function () { return !!est().ativo; };
    C.preparar = preparar;
    C.stats = stats;
    C.veloc = veloc;
    C.movimentoRestante = movimentoRestante;
    C.condicoesDe = function (t) { return Object.keys(condSet(t)); };
    C.tem = tem;
    C.aplicarCondicao = aplicarCondicao;
    C.removerCondicao = removerCondicao;
    C.faccao = faccao;
    C.hostis = hostis;
    C.dist = dist;
    C.incapacitado = incapacitado;
    C.ehJogador = ehJogador;
    C.pontosDeVidaTexto = pontosDeVidaTexto;
    C.nomeDe = nomeDe;
    C.viva = viva;
    C.monstro = monstro;
    C.bonusPericia = bonusPericia;
    C.registrar = registrar;
    C.novaEco = novaEco;

    function verificarFim() {
      var vivos = toks().filter(function (t) { return viva(t) && faccao(t) === 'monstros' && t.hp > 0; });
      var herois = toks().filter(function (t) { return viva(t) && faccao(t) === 'jogadores' && (t.hp > 0 || (ehJogador(t) && !t.estavel)); });
      if (!vivos.length) return 'vitoria';
      if (!herois.length) return 'derrota';
      return null;
    }

    C.iniciar = function (opts) {
      opts = opts || {};
      var s = est(), L = [];
      var lista = toks().filter(function (t) { return !t.morto && (t.tipo === 'player' || t.monsterId || t.tipo === 'npc' || t.tipo === 'enemy' || t.hpMax != null); });
      if (!lista.length) return ['Não há criaturas no mapa para entrar em combate.'];
      var rolagens = lista.map(function (t) {
        var st = preparar(t);
        t.eco = novaEco(); t.efeitos = {}; t.escondido = false;
        var r = d20(t.surpreso ? -1 : 0);
        var bonus = st.iniciativa + (Number(t.bonusIniciativa) || 0) - 2 * (t.exaustao || 0);
        return { id: t.id, nome: nomeDe(t), valor: r.dado + bonus, des: st.mods.DES, desempate: Math.random() };
      });
      rolagens.sort(function (a, b) { return b.valor - a.valor || b.des - a.des || b.desempate - a.desempate; });
      s.ativo = true; s.rodada = 1; s.turno = 0;
      s.ordem = rolagens.map(function (x) { return { id: x.id, valor: x.valor }; });
      s.registro = [];
      s.xpGanho = 0;
      lista.forEach(function (t) { delete t.surpreso; });
      L.push('Combate iniciado! Iniciativa: ' + rolagens.map(function (x) { return x.nome + ' ' + x.valor; }).join(', ') + '.');
      L.push('— Rodada 1 —');
      var primeiro = C.atual();
      if (primeiro) L.push.apply(L, iniciarTurno(primeiro));
      registrar(L);
      return L;
    };

    C.encerrar = function (motivo) {
      var s = est(), L = [];
      if (!s.ativo) return L;
      s.ativo = false;
      toks().forEach(function (t) { t.eco = novaEco(); if (t.efeitos) { delete t.efeitos.lento; delete t.efeitos.sap; delete t.efeitos.vex; delete t.efeitos.ajudadoPor; delete t.efeitos.distraido; } });
      if (motivo === 'vitoria') {
        var xp = 0;
        toks().forEach(function (t) { if (t.morto && t.monsterId) { var m = monstro(t); if (m) xp += XP_POR_ND[String(m.ndNumerico)] || 0; } });
        L.push('Vitória! Todos os inimigos foram derrotados.' + (xp ? ' XP total dos inimigos: ' + xp + '.' : ''));
      } else if (motivo === 'derrota') L.push('O grupo foi derrotado.');
      else L.push('Combate encerrado.');
      registrar(L);
      return L;
    };

    C.proximoTurno = function () {
      var s = est(), L = [];
      if (!s.ativo) return L;
      var cur = C.atual();
      if (cur) L.push.apply(L, encerrarTurno(cur));
      var fim = verificarFim();
      if (fim) { L.push.apply(L, C.encerrar(fim)); registrar(L); return L; }
      var guarda = 0;
      while (guarda++ < s.ordem.length + 2) {
        s.turno += 1;
        if (s.turno >= s.ordem.length) { s.turno = 0; s.rodada += 1; L.push('— Rodada ' + s.rodada + ' —'); }
        var cand = porId(s.ordem[s.turno].id);
        if (!cand || cand.morto) continue;
        var ls = iniciarTurno(cand);
        L.push.apply(L, ls);
        if (ehJogador(cand) && cand.hp <= 0) {
          if (cand.morto) { var f2 = verificarFim(); if (f2) { L.push.apply(L, C.encerrar(f2)); registrar(L); return L; } }
          continue;
        }
        break;
      }
      var fim2 = verificarFim();
      if (fim2) L.push.apply(L, C.encerrar(fim2));
      registrar(L);
      return L;
    };

    C.entrarNoCombate = function (t) {
      var s = est(), L = [];
      if (!s.ativo || s.ordem.some(function (x) { return x.id === t.id; })) return L;
      var st = preparar(t);
      var r = d20(0), valor = r.dado + st.iniciativa;
      var atual = C.atual();
      s.ordem.push({ id: t.id, valor: valor });
      var idAtual = atual ? atual.id : null;
      s.ordem.sort(function (a, b) { return b.valor - a.valor; });
      s.turno = Math.max(0, s.ordem.findIndex(function (x) { return x.id === idAtual; }));
      L.push(nomeDe(t) + ' entra no combate com iniciativa ' + valor + '.');
      registrar(L);
      return L;
    };

    C.gastar = function (t, tipo) {
      if (!est().ativo) return { ok: true };
      var atual = C.atual();
      if (tipo !== 'reacao' && atual && atual !== t) return { ok: false, motivo: 'Não é o turno de ' + nomeDe(t) + '.' };
      if (incapacitado(t)) return { ok: false, motivo: nomeDe(t) + ' está incapacitado.' };
      if (!t.eco) t.eco = novaEco();
      if (!t.eco[tipo]) return { ok: false, motivo: tipo === 'acao' ? 'A ação deste turno já foi usada.' : tipo === 'bonus' ? 'A ação bônus deste turno já foi usada.' : 'A reação já foi usada.' };
      t.eco[tipo] = false;
      return { ok: true };
    };
    C.devolver = function (t, tipo) { if (est().ativo && t.eco) t.eco[tipo] = true; };
    C.podeAgir = function (t, tipo) {
      if (!est().ativo) return true;
      var atual = C.atual();
      if (tipo !== 'reacao' && atual && atual !== t) return false;
      return !incapacitado(t) && !!(t.eco && t.eco[tipo]);
    };

    function raio(t) { return Math.max(1, t.raio || 1); }
    function atqDeMonstro(a, modo) {
      var m = modo || (a.modo === 'distancia' ? 'distancia' : 'corpo');
      var danos = a.dano || [];
      if (a.modo === 'ambos' && danos.length > 1) danos = [m === 'corpo' ? danos[0] : danos[1]];
      return {
        nome: a.nome, bonus: a.bonus, distancia: m === 'distancia',
        alcanceNormal: m === 'corpo' ? a.alcanceCorpo : (a.alcanceNormal || a.alcanceCorpo), alcanceMax: m === 'corpo' ? a.alcanceCorpo : (a.alcanceMax || a.alcanceCorpo),
        dano: danos, extra: a.extra, magico: !!a.magico, arma: false, atributoMod: null
      };
    }
    function alcanceCorpoDe(t) {
      var s = stats(t);
      if (s.tipo === 'pc') {
        var a = env.pcAtaquePadrao ? env.pcAtaquePadrao(t) : null;
        return a && !a.distancia ? (a.alcanceMax || 1) : 1;
      }
      var r = 0;
      (s.ataques || []).forEach(function (x) { if (x.tipo === 'ataque' && x.modo !== 'distancia') r = Math.max(r, x.alcanceCorpo || 1); });
      return r;
    }
    function ataqueOportunidade(e) {
      var s = stats(e);
      if (s.tipo === 'pc') return env.pcAtaquePadrao ? env.pcAtaquePadrao(e) : null;
      var melhor = null, mm = -1;
      (s.ataques || []).forEach(function (x) {
        if (x.tipo !== 'ataque' || x.modo === 'distancia') return;
        var m = (x.dano || []).reduce(function (acc, p) { return acc + mediaDano(p.dados); }, 0);
        if (m > mm) { mm = m; melhor = x; }
      });
      return melhor ? atqDeMonstro(melhor, 'corpo') : null;
    }
    function ataquesDeOportunidade(mover, de, para) {
      var L = [];
      if (mover.eco && mover.eco.desengajou) return L;
      toks().slice().forEach(function (e) {
        if (e === mover || !viva(e) || !hostis(e, mover) || incapacitado(e) || !mover || mover.morto) return;
        if (!e.eco || !e.eco.reacao) return;
        var alc = alcanceCorpoDe(e);
        if (!alc) return;
        var antes = pegadaDist(de.x, de.y, raio(mover), e.x, e.y, raio(e));
        var depois = pegadaDist(para.x, para.y, raio(mover), e.x, e.y, raio(e));
        if (antes > alc || depois <= alc) return;
        var atq = ataqueOportunidade(e);
        if (!atq) return;
        e.eco.reacao = false;
        L.push(nomeDe(e) + ' usa a reação para um ataque de oportunidade contra ' + nomeDe(mover) + '.');
        var px = mover.x, py = mover.y;
        mover.x = de.x; mover.y = de.y;
        var r = atacar(e, mover, atq, { ignorarVisao: true });
        mover.x = px; mover.y = py;
        L.push.apply(L, r.linhas);
      });
      return L;
    }

    C.podeMover = function (t, de, para) {
      if (!est().ativo) return { ok: true, custo: 0 };
      var s = est();
      if (s.ordem.every(function (x) { return x.id !== t.id; })) return { ok: true, custo: 0 };
      var atual = C.atual();
      if (atual && atual !== t) return { ok: false, motivo: 'Não é o turno de ' + nomeDe(t) + '.' };
      if (incapacitado(t) || t.hp <= 0) return { ok: false, motivo: nomeDe(t) + ' não pode se mover.' };
      if (!t.eco) t.eco = novaEco();
      var custo = tem(t, 'caido') ? 2 : 1;
      if (movimentoRestante(t) < custo) return { ok: false, motivo: 'Sem deslocamento restante neste turno.' };
      if (tem(t, 'amedrontado')) {
        var f = porId(condicaoFonte(t, 'amedrontado'));
        if (f && pegadaDist(para.x, para.y, raio(t), f.x, f.y, raio(f)) < pegadaDist(de.x, de.y, raio(t), f.x, f.y, raio(f))) return { ok: false, motivo: nomeDe(t) + ' está amedrontado e não se aproxima da fonte do medo.' };
      }
      return { ok: true, custo: custo };
    };
    C.aposMover = function (t, de, para, custo) {
      var L = [];
      if (!est().ativo || !t.eco) return L;
      var dx = Math.abs(para.x - de.x), dy = Math.abs(para.y - de.y);
      t.eco.mov += (custo || 1) * Math.max(1, Math.max(dx, dy));
      L = ataquesDeOportunidade(t, de, para);
      if (L.length) registrar(L);
      return L;
    };
    C.levantar = function (t) {
      if (!tem(t, 'caido') || tem(t, 'inconsciente')) return ['Não é possível se levantar agora.'];
      var custo = Math.floor(stats(t).veloc / 2);
      if (est().ativo && movimentoRestante(t) < custo) return ['Deslocamento insuficiente para se levantar (' + custo + ' quadrículas).'];
      if (est().ativo && t.eco) t.eco.mov += custo;
      removerCondicao(t, 'caido');
      return [nomeDe(t) + ' se levanta' + (est().ativo ? ' (gasta ' + mts(custo) + ' m de deslocamento)' : '') + '.'];
    };

    function usar(t, tipo, fn) {
      preparar(t);
      var g = C.gastar(t, tipo);
      if (!g.ok) return { ok: false, linhas: [g.motivo] };
      var L = fn() || [];
      registrar(L);
      return { ok: true, linhas: L };
    }
    C.disparada = function (t) {
      return usar(t, 'acao', function () {
        if (est().ativo) t.eco.movExtra += Math.max(0, veloc(t));
        return [nomeDe(t) + ' usa Disparada: deslocamento adicional de ' + mts(Math.max(0, veloc(t))) + ' m neste turno.'];
      });
    };
    C.desengajar = function (t) {
      return usar(t, 'acao', function () { t.eco.desengajou = true; return [nomeDe(t) + ' usa Desengajar: seu movimento não provoca ataques de oportunidade neste turno.']; });
    };
    C.esquivar = function (t) {
      return usar(t, 'acao', function () { t.eco.esquiva = true; return [nomeDe(t) + ' usa Esquivar: ataques contra ele têm desvantagem e ele tem vantagem em salvaguardas de Destreza até o início do próximo turno.']; });
    };
    C.ajudar = function (t, alvo, tipo) {
      return usar(t, 'acao', function () {
        if (!alvo.efeitos) alvo.efeitos = {};
        if (tipo === 'distrair') {
          alvo.efeitos.distraido = t.id;
          return [nomeDe(t) + ' usa Ajudar: o próximo ataque de um aliado contra ' + nomeDe(alvo) + ' tem vantagem.'];
        }
        alvo.efeitos.ajudadoPor = t.id;
        return [nomeDe(t) + ' usa Ajudar: ' + nomeDe(alvo) + ' terá vantagem no próximo ataque ou teste de habilidade.'];
      });
    };
    C.esconder = function (t) {
      return usar(t, 'acao', function () {
        var b = bonusPericia(t, 'Furtividade', 'DES') - 2 * (t.exaustao || 0);
        var armaduraPesada = env.armaduraDesvantagem ? env.armaduraDesvantagem(t) : false;
        var r = d20(armaduraPesada ? -1 : 0);
        var total = r.dado + b;
        if (total >= 15) {
          t.escondido = true; t.escondidoCD = total;
          return [nomeDe(t) + ' usa Esconder: Furtividade ' + textoD20(r, b, total) + ' contra CD 15 — sucesso; está escondido.'];
        }
        return [nomeDe(t) + ' usa Esconder: Furtividade ' + textoD20(r, b, total) + ' contra CD 15 — falha.'];
      });
    };
    C.procurar = function (t) {
      return usar(t, 'acao', function () {
        var b = bonusPericia(t, 'Percepção', 'SAB') - 2 * (t.exaustao || 0);
        var r = d20(0), total = r.dado + b, L = [nomeDe(t) + ' usa Procurar: Percepção ' + textoD20(r, b, total) + '.'];
        var achou = false;
        toks().forEach(function (o) {
          if (o.escondido && hostis(t, o) && env.linhaVisao(t, o)) {
            if (total >= (o.escondidoCD || 15)) { o.escondido = false; achou = true; L.push(nomeDe(o) + ' foi encontrado.'); }
          }
        });
        if (!achou) L.push('Nenhuma criatura escondida foi encontrada.');
        return L;
      });
    };
    C.preparar_acao = function (t, descricao) {
      return usar(t, 'acao', function () { t.preparada = descricao || 'ação preparada'; return [nomeDe(t) + ' prepara uma ação: ' + t.preparada + '. Usa a reação quando o gatilho ocorrer.']; });
    };
    C.usarPreparada = function (t) {
      if (!t.preparada) return { ok: false, linhas: ['Não há ação preparada.'] };
      var g = C.gastar(t, 'reacao');
      if (!g.ok) return { ok: false, linhas: [g.motivo] };
      var texto = t.preparada; t.preparada = null;
      var L = [nomeDe(t) + ' executa a ação preparada: ' + texto + '.'];
      registrar(L);
      return { ok: true, linhas: L };
    };
    C.utilizar = function (t, descricao) {
      return usar(t, 'acao', function () { return [nomeDe(t) + ' usa Utilizar: ' + (descricao || 'interage com um objeto') + '.']; });
    };
    C.interagirObjeto = function (t, descricao) {
      preparar(t);
      if (est().ativo && t.eco.interacao) return { ok: false, linhas: ['A interação gratuita com objeto deste turno já foi usada. Use a ação Utilizar.'] };
      if (est().ativo) t.eco.interacao = true;
      var L = [nomeDe(t) + ' interage com um objeto: ' + (descricao || 'saca ou guarda um item') + '.'];
      registrar(L);
      return { ok: true, linhas: L };
    };
    C.testePericia = function (t, pericia, attr, cd, tipoAcao, rotulo) {
      return usar(t, tipoAcao || 'acao', function () {
        var v = [], ds = [];
        if (t.efeitos && t.efeitos.ajudadoPor) { v.push('ajudado'); delete t.efeitos.ajudadoPor; }
        if (tem(t, 'envenenado')) ds.push('envenenado');
        if (tem(t, 'amedrontado')) ds.push('amedrontado');
        var b = bonusPericia(t, pericia, attr) - 2 * (t.exaustao || 0);
        var r = d20(modoFinal(v, ds)), total = r.dado + b;
        var txt = nomeDe(t) + ' usa ' + (rotulo || pericia) + ': ' + pericia + ' ' + textoD20(r, b, total);
        if (cd) txt += ' contra CD ' + cd + ' — ' + (total >= cd ? 'sucesso' : 'falha');
        return [txt + '.'];
      });
    };

    C.agarrar = function (att, alvo, gastarAtaque) {
      var L = [];
      var sa = preparar(att), sd = preparar(alvo);
      if (dist(att, alvo) > 1) return { ok: false, linhas: [nomeDe(alvo) + ' não está ao alcance para ser agarrado.'] };
      if (sd.tam > sa.tam + 1) return { ok: false, linhas: [nomeDe(alvo) + ' é grande demais para ser agarrado.'] };
      var cd = 8 + sa.mods.FOR + sa.prof;
      var rF = salvar(alvo, 'FOR', cd, {}), rD = salvar(alvo, 'DES', cd, {});
      var melhor = (rF.sucesso || rD.sucesso);
      L.push(nomeDe(att) + ' tenta agarrar ' + nomeDe(alvo) + ' (CD ' + cd + '). ' + (rF.sucesso ? rF.texto : rD.texto));
      if (!melhor) {
        var m = aplicarCondicao(alvo, 'agarrado', { fonte: att.id, rodadas: null });
        var c = (alvo.condicoes || []).find(function (x) { return x.id === 'agarrado' && x.fonte === att.id; });
        if (c) c.escape = cd;
        if (m) L.push(m + ' CD de escape ' + cd + '.');
      } else L.push(nomeDe(alvo) + ' resiste ao agarrão.');
      consumirEfeitosDeAtaque(att, alvo);
      return { ok: true, linhas: L };
    };
    C.empurrar = function (att, alvo, modo) {
      var L = [];
      var sa = preparar(att), sd = preparar(alvo);
      if (dist(att, alvo) > 1) return { ok: false, linhas: [nomeDe(alvo) + ' não está ao alcance.'] };
      if (sd.tam > sa.tam + 1) return { ok: false, linhas: [nomeDe(alvo) + ' é grande demais para ser empurrado.'] };
      var cd = 8 + sa.mods.FOR + sa.prof;
      var rF = salvar(alvo, 'FOR', cd, {}), rD = salvar(alvo, 'DES', cd, {});
      var resistiu = rF.sucesso || rD.sucesso;
      L.push(nomeDe(att) + ' tenta empurrar ' + nomeDe(alvo) + ' (CD ' + cd + '). ' + (rF.sucesso ? rF.texto : rD.texto));
      if (resistiu) L.push(nomeDe(alvo) + ' resiste ao empurrão.');
      else if (modo === 'derrubar') { var m = aplicarCondicao(alvo, 'caido', {}); if (m) L.push(m); }
      else if (env.empurrar) { var n = env.empurrar(alvo, att, 1); L.push(nomeDe(alvo) + (n ? ' é empurrado 1,5 m.' : ' não pode ser empurrado (obstáculo).')); }
      consumirEfeitosDeAtaque(att, alvo);
      return { ok: true, linhas: L };
    };
    C.escapar = function (t) {
      return usar(t, 'acao', function () {
        var c = (t.condicoes || []).find(function (x) { return x.id === 'agarrado'; });
        if (!c) return [nomeDe(t) + ' não está agarrado.'];
        var cd = c.escape || 10;
        var s = stats(t), ba = bonusPericia(t, 'Atletismo', 'FOR'), bc = bonusPericia(t, 'Acrobacia', 'DES');
        var b = Math.max(ba, bc) - 2 * (t.exaustao || 0);
        var r = d20(0), total = r.dado + b;
        if (total >= cd) { t.condicoes = t.condicoes.filter(function (x) { return x !== c; }); return [nomeDe(t) + ' tenta escapar: ' + textoD20(r, b, total) + ' contra CD ' + cd + ' — escapa do agarrão.']; }
        return [nomeDe(t) + ' tenta escapar: ' + textoD20(r, b, total) + ' contra CD ' + cd + ' — falha.'];
      });
    };
    C.estabilizar = function (t, alvo) {
      return usar(t, 'acao', function () {
        if (alvo.hp > 0 || alvo.morto) return [nomeDe(alvo) + ' não precisa ser estabilizado.'];
        if (dist(t, alvo) > 1) return [nomeDe(alvo) + ' está fora do alcance.'];
        var b = bonusPericia(t, 'Medicina', 'SAB') - 2 * (t.exaustao || 0);
        var r = d20(0), total = r.dado + b;
        if (total >= 10) { alvo.estavel = true; alvo.mortes = { s: 0, f: 0 }; return [nomeDe(t) + ' estabiliza ' + nomeDe(alvo) + ': Medicina ' + textoD20(r, b, total) + ' contra CD 10 — sucesso.']; }
        return [nomeDe(t) + ' tenta estabilizar ' + nomeDe(alvo) + ': Medicina ' + textoD20(r, b, total) + ' contra CD 10 — falha.'];
      });
    };

    C.magia = function (t, p) {
      return usar(t, p.tipoAcao || 'acao', function () {
        var L = [nomeDe(t) + ' conjura ' + (p.nome || 'uma magia') + '.'];
        if (p.concentracao) {
          if (t.concentracao) L.push('Concentração em ' + t.concentracao + ' foi encerrada.');
          t.concentracao = p.nome || 'magia';
        }
        (p.alvos || []).forEach(function (alvo) {
          if (alvo.morto) return;
          if (p.efeito === 'cura') {
            var rc = rolar(p.dados, false);
            if (rc) L.push.apply(L, curar(alvo, rc.total));
          } else if (p.efeito === 'ataque') {
            var atq = { nome: p.nome || 'Magia', bonus: p.bonus, distancia: true, alcanceNormal: p.alcance || 99, alcanceMax: p.alcance || 99, dano: [{ dados: p.dados, tipo: p.tipoDano }], magico: true, arma: false };
            L.push.apply(L, atacar(t, alvo, atq, {}).linhas);
          } else if (p.efeito === 'salva') {
            var rs = salvar(alvo, p.atributo, p.cd, { magico: true });
            L.push(rs.texto);
            var rd = p.dados ? rolar(p.dados, false) : null;
            var val = rd ? (rs.sucesso ? (p.metade ? Math.floor(rd.total / 2) : 0) : rd.total) : 0;
            if (val > 0) L.push.apply(L, aplicarDano(alvo, [{ valor: val, tipo: p.tipoDano }], { magico: true, fonte: t }).linhas);
            if (!rs.sucesso && p.condicao) { var m = aplicarCondicao(alvo, p.condicao, { fonte: t.id, rodadas: p.rodadas == null ? 10 : p.rodadas }); if (m) L.push(m); }
          }
        });
        return L;
      });
    };

    C.caracteristicas = function (t) {
      var s = stats(t), out = [];
      if (s.tipo !== 'pc') return out;
      preparar(t);
      var u = t.usos;
      if (s.classe === 'Guerreiro') {
        if (u.retomar == null) u.retomar = 2;
        out.push({ id: 'retomar', nome: 'Retomar o Fôlego', custo: 'bonus', restante: u.retomar, desc: 'Cura 1d10 + nível de Guerreiro.' });
      }
      if (s.classe === 'Bárbaro') {
        if (u.furia == null) u.furia = 2;
        out.push({ id: 'furia', nome: (t.efeitos && t.efeitos.furia) ? 'Encerrar Fúria' : 'Fúria', custo: 'bonus', restante: u.furia, desc: 'Resistência a dano físico, +2 de dano com Força e vantagem em testes e salvaguardas de Força.' });
      }
      if (s.classe === 'Paladino') {
        if (u.maos == null) u.maos = 5 * (s.nivel || 1);
        out.push({ id: 'maos', nome: 'Mãos Consagradas', custo: 'bonus', restante: u.maos, desc: 'Gasta pontos da reserva para curar uma criatura tocada.' });
      }
      return out;
    };
    C.usarCaracteristica = function (t, id, param) {
      var s = stats(t);
      var cars = C.caracteristicas(t), car = cars.find(function (c) { return c.id === id; });
      if (!car) return { ok: false, linhas: ['Característica indisponível.'] };
      if (id === 'furia' && t.efeitos && t.efeitos.furia) {
        delete t.efeitos.furia;
        var L0 = [nomeDe(t) + ' encerra a Fúria.'];
        registrar(L0);
        return { ok: true, linhas: L0 };
      }
      if (car.restante <= 0) return { ok: false, linhas: [car.nome + ' não tem usos restantes.'] };
      return usar(t, car.custo, function () {
        if (id === 'retomar') {
          t.usos.retomar -= 1;
          var r = rolar('1d10+' + (s.nivel || 1), false);
          return [nomeDe(t) + ' usa Retomar o Fôlego (1d10+' + (s.nivel || 1) + ' = ' + r.total + ').'].concat(curar(t, r.total));
        }
        if (id === 'furia') {
          t.usos.furia -= 1;
          t.efeitos.furia = true; t.efeitos.furiaAtividade = true;
          return [nomeDe(t) + ' entra em Fúria: resistência a dano contundente, cortante e perfurante, +2 de dano com Força e vantagem em testes e salvaguardas de Força.'];
        }
        if (id === 'maos') {
          var alvo = param && param.alvo ? param.alvo : t;
          var q = Math.max(1, Math.min(t.usos.maos, Math.round(Number(param && param.quantidade) || 1)));
          if (dist(t, alvo) > 1) return [nomeDe(alvo) + ' está fora do alcance.'];
          t.usos.maos -= q;
          return [nomeDe(t) + ' usa Mãos Consagradas (' + q + ' pontos).'].concat(curar(alvo, q));
        }
        return [];
      });
    };
    C.descansarCurto = function (t, dadoVida) {
      var s = stats(t), L = [];
      if (s.tipo !== 'pc') return L;
      preparar(t);
      if (t.usos.dadosVida == null) t.usos.dadosVida = s.nivel || 1;
      if (t.usos.dadosVida > 0 && t.hp < t.hpMax && dadoVida) {
        t.usos.dadosVida -= 1;
        var r = d(dadoVida) + s.mods.CON;
        L.push(nomeDe(t) + ' gasta 1 Dado de Vida (d' + dadoVida + (s.mods.CON ? sinal(s.mods.CON) : '') + ' = ' + Math.max(1, r) + ').');
        L.push.apply(L, curar(t, Math.max(1, r)));
      }
      if (s.classe === 'Guerreiro') t.usos.retomar = Math.min(2, (t.usos.retomar == null ? 0 : t.usos.retomar) + 1);
      L.push(nomeDe(t) + ' termina um descanso curto.');
      registrar(L);
      return L;
    };
    C.descansarLongo = function (t) {
      var s = stats(t), L = [];
      preparar(t);
      t.hp = t.hpMax; t.hpTemp = 0; t.mortes = { s: 0, f: 0 }; t.estavel = false; t.morto = false;
      t.condicoes = []; t.efeitos = {}; t.concentracao = null; t.escondido = false;
      if (t.exaustao > 0) t.exaustao -= 1;
      t.usos = {};
      L.push(nomeDe(t) + ' termina um descanso longo: PV restaurados e usos de características recuperados.');
      registrar(L);
      return L;
    };

    function expandirMultiataque(multi, atkAcoes) {
      var seq = [];
      if (!atkAcoes.length) return seq;
      var texto = multi.texto || '';
      atkAcoes.forEach(function (a) {
        var tronco = norm(a.nome).slice(0, 4);
        var pos = tronco.length >= 3 ? texto.indexOf(tronco) : -1;
        if (pos < 0) return;
        var antes = texto.slice(Math.max(0, pos - 22), pos);
        var mm = antes.match(/(um|uma|dois|duas|tres|quatro|cinco|seis)\s+(?:ataques?\s+)?(?:com\s+)?(?:a|as|o|os|sua|suas|seu|seus)?\s*$/);
        var n = mm ? PALAVRAS_NUM[mm[1]] : 1;
        for (var i = 0; i < n; i++) seq.push(a);
      });
      var total = multi.qtd && multi.qtd.dados ? (rolar(multi.qtd.dados, false) || { total: 2 }).total : (multi.qtd && multi.qtd.n) || 2;
      if (!seq.length) {
        var ordenados = atkAcoes.slice().sort(function (a, b) { return somaMedia(b) - somaMedia(a); });
        for (var j = 0; j < total; j++) seq.push(ordenados[j % ordenados.length]);
      } else if (seq.length < total) {
        while (seq.length < total) seq.push(seq[seq.length - 1]);
      }
      return seq.slice(0, 8);
    }
    function somaMedia(a) { return (a.dano || []).reduce(function (acc, p) { return acc + mediaDano(p.dados); }, 0); }

    function escolherAlvoIA(t) {
      var cand = toks().filter(function (o) { return o !== t && viva(o) && hostis(t, o) && o.hp > 0 && !o.escondido; });
      if (!cand.length) cand = toks().filter(function (o) { return o !== t && viva(o) && hostis(t, o) && ehJogador(o) && o.hp <= 0 && !o.estavel; });
      if (!cand.length) return null;
      cand.sort(function (a, b) { return dist(t, a) - dist(t, b) || a.hp - b.hp; });
      return cand[0];
    }

    function passoIA(t, cel, L) {
      var de = { x: t.x, y: t.y }, custo = tem(t, 'caido') ? 2 : 1;
      if (movimentoRestante(t) < custo) return false;
      env.mover(t, cel.x, cel.y);
      t.eco.mov += custo;
      var oa = ataquesDeOportunidade(t, de, { x: cel.x, y: cel.y });
      if (oa.length) L.push.apply(L, oa);
      return !t.morto;
    }

    C.turnoIA = function (t) {
      var L = [], s = preparar(t);
      if (incapacitado(t) || t.hp <= 0) { L.push(nomeDe(t) + ' está incapacitado e perde o turno.'); registrar(L); return L; }
      if (tem(t, 'caido')) { L.push.apply(L, C.levantar(t)); }
      var alvo = escolherAlvoIA(t);
      if (!alvo) { registrar(L); return L; }
      var acoes = s.ataques || [];
      var atkAcoes = acoes.filter(function (a) { return a.tipo === 'ataque'; });
      var salvaAcoes = acoes.filter(function (a) { return a.tipo === 'salva' && a.recarga && t.recargas[a.nome] !== false; });
      var usouSalva = false;
      salvaAcoes.forEach(function (a) {
        if (usouSalva) return;
        var raioAcao = a.area || 6;
        var alvos = toks().filter(function (o) { return o !== t && viva(o) && hostis(t, o) && o.hp > 0 && dist(t, o) <= raioAcao && env.linhaVisao(t, o); });
        if (!alvos.length) return;
        usouSalva = true;
        t.recargas[a.nome] = false;
        t.eco.acao = false;
        L.push(nomeDe(t) + ' usa ' + a.nome + '.');
        alvos.forEach(function (o) { L.push.apply(L, aplicarAcaoSalva(t, o, a)); });
      });
      if (usouSalva) { registrar(L); return L; }
      var seq = [], multi = acoes.find(function (a) { return a.tipo === 'multi'; });
      if (atkAcoes.length) {
        if (multi) seq = expandirMultiataque(multi, atkAcoes);
        if (!seq.length) { var melhor = atkAcoes.slice().sort(function (a, b) { return somaMedia(b) - somaMedia(a); })[0]; seq = [melhor]; }
      }
      if (!seq.length) {
        var salvaLivre = acoes.find(function (a) { return a.tipo === 'salva' && !a.recarga && a.area; });
        if (salvaLivre) {
          var area = toks().filter(function (o) { return o !== t && viva(o) && hostis(t, o) && o.hp > 0 && dist(t, o) <= salvaLivre.area && env.linhaVisao(t, o); });
          if (area.length) { L.push(nomeDe(t) + ' usa ' + salvaLivre.nome + '.'); area.forEach(function (o) { L.push.apply(L, aplicarAcaoSalva(t, o, salvaLivre)); }); }
        }
        if (!L.length) L.push(nomeDe(t) + ' não tem ataques utilizáveis e aguarda.');
        registrar(L); return L;
      }
      var primeira = seq[0];
      var distancia = dist(t, alvo);
      var modoPrim = primeira.modo === 'ambos' ? (distancia <= primeira.alcanceCorpo ? 'corpo' : 'distancia') : (primeira.modo === 'distancia' ? 'distancia' : 'corpo');
      var alcNec = modoPrim === 'corpo' ? primeira.alcanceCorpo : primeira.alcanceNormal;
      if (distancia > alcNec) {
        var rota = env.caminho ? env.caminho(t, alvo, alcNec, 200) : null;
        if (rota && rota.length) {
          var passos = 0;
          for (var i = 0; i < rota.length; i++) {
            if (movimentoRestante(t) < (tem(t, 'caido') ? 2 : 1)) {
              if (t.eco.acao && !t.eco.dash && i < rota.length && veloc(t) > 0) { t.eco.dash = true; t.eco.movExtra += veloc(t); t.eco.acao = false; L.push(nomeDe(t) + ' usa Disparada.'); }
              else break;
            }
            if (!passoIA(t, rota[i], L)) break;
            passos++;
            if (pegadaDist(t.x, t.y, raio(t), alvo.x, alvo.y, raio(alvo)) <= alcNec) break;
          }
          if (passos) L.unshift(nomeDe(t) + ' avança ' + mts(passos) + ' m.');
        }
        distancia = dist(t, alvo);
      }
      if (t.morto) { registrar(L); return L; }
      if (!t.eco.acao) { registrar(L); return L; }
      t.eco.acao = false;
      var alvoAtual = alvo;
      var fez = false;
      seq.forEach(function (a) {
        if (t.morto || incapacitado(t)) return;
        if (alvoAtual.morto || (alvoAtual.hp <= 0 && !ehJogador(alvoAtual))) {
          var novo = escolherAlvoIA(t);
          if (!novo) return;
          alvoAtual = novo;
        }
        var d0 = dist(t, alvoAtual);
        var modo = a.modo === 'ambos' ? (d0 <= a.alcanceCorpo ? 'corpo' : 'distancia') : (a.modo === 'distancia' ? 'distancia' : 'corpo');
        var atq = atqDeMonstro(a, modo);
        var r = atacar(t, alvoAtual, atq, {});
        if (!r.ok && /fora do alcance|linha de visão/.test(r.linhas[0])) { if (!fez) L.push(r.linhas[0]); return; }
        fez = true;
        L.push.apply(L, r.linhas);
      });
      registrar(L);
      return L;
    };

    function aplicarAcaoSalva(t, alvo, a) {
      var L = [];
      var rs = salvar(alvo, a.atributo, a.cd, { magico: false });
      L.push(rs.texto);
      var parts = [];
      (a.dano || []).forEach(function (p) {
        var r = rolar(p.dados, false);
        if (!r) return;
        var val = rs.sucesso ? (a.metade ? Math.floor(r.total / 2) : 0) : r.total;
        if (val > 0) parts.push({ valor: val, tipo: p.tipo });
      });
      if (parts.length) L.push.apply(L, aplicarDano(alvo, parts, { fonte: t, magico: false }).linhas);
      if (!rs.sucesso && a.condicao && !alvo.morto) {
        var m = aplicarCondicao(alvo, a.condicao, { fonte: t.id, rodadas: a.rodadas == null ? 10 : a.rodadas, salva: a.repete ? { atributo: a.atributo, cd: a.cd, desvDeVisao: true } : null });
        if (m) L.push(m);
      }
      return L;
    }
    C.aplicarAcaoSalva = aplicarAcaoSalva;

    C.controladoPorIA = function (t) {
      if (!t || ehJogador(t)) return false;
      return est().autoIA !== false;
    };
    C.executarTurnosAutomaticos = function () {
      var s = est(), L = [], guarda = 0;
      while (s.ativo && guarda++ < s.ordem.length * 2 + 2) {
        var cur = C.atual();
        if (!cur || !C.controladoPorIA(cur)) break;
        L.push.apply(L, C.turnoIA(cur));
        if (est().ativo) L.push.apply(L, C.proximoTurno());
      }
      return L;
    };
    C.encerrarTurnoAtual = function () {
      var L = C.proximoTurno();
      if (est().ativo) L.push.apply(L, C.executarTurnosAutomaticos());
      return L;
    };
    C.iniciarCombate = function () {
      var L = C.iniciar();
      if (est().ativo) L.push.apply(L, C.executarTurnosAutomaticos());
      return L;
    };
    C.resumoOrdem = function () {
      var s = est();
      return s.ordem.map(function (x, i) {
        var t = porId(x.id);
        return { id: x.id, nome: t ? nomeDe(t) : '?', valor: x.valor, atual: i === s.turno && s.ativo, morto: !t || !!t.morto, caido: !!t && t.hp <= 0 && !t.morto, token: t };
      });
    };
    return C;
  }

  global.RPGCombate = { criar: criar, util: { rolar: rolar, d20: d20, mod: mod, norm: norm, parseAcaoMonstro: parseAcaoMonstro, parseDefesas: parseDefesas, canonicoDano: canonicoDano, CONDICOES: CONDICOES } };
})(window);
