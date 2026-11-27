var C = {};
var cacheMonstros = null;
var cacheVersao = -1;
function est() {
      var s = env.estado();
      if (!s.ordem) {
        s.ativo = false;
        s.rodada = 0;
        s.turno = 0;
        s.ordem = [];
        s.registro = [];
      }
      if (!s.registro) s.registro = [];
      return s;
    }
function toks() {
      return env.tokens();
    }
function porId(id) {
      return toks().find(function(t) {
        return t.id === id;
      }) || null;
    }
function monstro(t) {
      if (!t || !t.monsterId) return null;
      if (!cacheMonstros || cacheVersao !== window.MONSTERS_VERSION) {
        cacheMonstros = {};
        cacheVersao = window.MONSTERS_VERSION;
        (env.monstros() || []).forEach(function(m) {
          cacheMonstros[m.id] = m;
        });
      }
      return cacheMonstros[t.monsterId] || null;
    }
function ehJogador(t) {
      return !!t && (t.tipo === "player" || t.heroi === true);
    }
function faccao(t) {
      if (t.faccao) return t.faccao;
      return ehJogador(t) || t.aliado ? "jogadores" : "monstros";
    }
function hostis(a, b) {
      return faccao(a) !== faccao(b);
    }
function registrar(linhas) {
      var s = est();
      (linhas || []).forEach(function(l) {
        s.registro.push(l);
      });
      if (s.registro.length > 120) s.registro.splice(0, s.registro.length - 120);
    }
function statsMonstro(t) {
      var m = monstro(t);
      var atrib = {}, mods = {};
      ATRIBUTOS.forEach(function(a) {
        atrib[a] = 10;
      });
      if (m) Object.keys(m.atributos || {}).forEach(function(k) {
        if (ATTR_EN[k]) atrib[ATTR_EN[k]] = Number(m.atributos[k]) || 10;
      });
      ATRIBUTOS.forEach(function(a) {
        mods[a] = mod(atrib[a]);
      });
      var prof = proficienciaPorND(m ? m.ndNumerico : 0);
      var salvas = {};
      ATRIBUTOS.forEach(function(a) {
        salvas[a] = mods[a];
      });
      if (m) Object.keys(m.salvaguardas || {}).forEach(function(k) {
        if (ATTR_EN[k]) salvas[ATTR_EN[k]] = Number(m.salvaguardas[k]);
      });
      var ataques = [];
      var todas = m ? m.acoes || [] : [];
      todas.forEach(function(a) {
        ataques.push(parseAcaoMonstro(a, todas));
      });
      if (!m) ataques.push({ nome: "Golpe", tipo: "ataque", modo: "corpo", bonus: Number(t.bonusAtaque) || 2, alcanceCorpo: 1, alcanceNormal: 0, alcanceMax: 0, dano: [{ dados: t.dano || "1d6", tipo: "contundente" }], extra: null });
      var veloc2 = m && m.deslocamento ? Math.round((Number(m.deslocamento.deslocamento) || 30) / 5) : 6;
      var tracos = m ? m.tracos || [] : [];
      return {
        tipo: "monstro",
        nome: t.nome,
        ca: Number(t.ca || t.classeArmadura || m && m.classeArmadura || 10),
        pvMax: Number(t.hpMax || m && m.pontosVida || 10),
        veloc: Math.max(0, veloc2),
        atrib,
        mods,
        prof,
        salvas,
        tam: Math.max(1, Number(t.raio) || 1),
        defesas: { resist: parseDefesas(m && m.resistenciasDano), imune: parseDefesas(m && m.imunidadesDano), vuln: parseDefesas(m && m.vulnerabilidadesDano) },
        imunCond: (m ? m.imunidadesCondicao || [] : []).map(idCondicao).filter(Boolean),
        ataques,
        ataquesPorAcao: 1,
        iniciativa: m ? Number(m.iniciativa) || mods.DES : mods.DES,
        classe: "",
        maestria: false,
        tracos,
        nd: m ? m.nd : t.nd,
        ndNumerico: m ? m.ndNumerico : 0,
        nivel: 0
      };
    }
function statsPC(t) {
      var sh = env.pcStats ? env.pcStats(t) : null;
      var atrib = {}, mods = {};
      ATRIBUTOS.forEach(function(a) {
        atrib[a] = sh && sh.atrib && sh.atrib[a] != null ? sh.atrib[a] : 10;
        mods[a] = mod(atrib[a]);
      });
      var prof = sh && sh.prof ? sh.prof : 2;
      var salvas = {};
      ATRIBUTOS.forEach(function(a) {
        salvas[a] = sh && sh.salvas && sh.salvas[a] != null ? sh.salvas[a] : mods[a];
      });
      var classe = sh && sh.classe ? sh.classe : "";
      return {
        tipo: "pc",
        nome: t.nome,
        ca: Number(t.ca || sh && sh.ca || 10),
        pvMax: Number(sh && sh.pvMax || t.hpMax || 10),
        veloc: sh && sh.veloc ? sh.veloc : 6,
        atrib,
        mods,
        prof,
        salvas,
        tam: Math.max(1, Number(t.raio) || 1),
        defesas: { resist: {}, imune: {}, vuln: {} },
        imunCond: [],
        ataques: [],
        ataquesPorAcao: sh && sh.ataquesPorAcao || 1,
        iniciativa: mods.DES,
        classe,
        maestria: !!(sh && sh.maestria),
        tracos: [],
        nivel: sh && sh.nivel || 1,
        pericias: sh && sh.pericias || {}
      };
    }
function stats(t) {
      return ehJogador(t) || !monstro(t) && t.tipo === "player" ? statsPC(t) : statsMonstro(t);
    }
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
