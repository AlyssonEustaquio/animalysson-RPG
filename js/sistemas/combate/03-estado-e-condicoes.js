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

function condSet(t) {
      var set = {};
      (t.condicoes || []).forEach(function(c) {
        set[c.id] = true;
      });
      if (set.paralisado || set.petrificado || set.atordoado || set.inconsciente) set.incapacitado = true;
      if (set.inconsciente) set.caido = true;
      return set;
    }

function tem(t, id) {
      return !!condSet(t)[id];
    }

function incapacitado(t) {
      return !!t.morto || tem(t, "incapacitado");
    }

function condicaoFonte(t, id) {
      var c = (t.condicoes || []).find(function(x) {
        return x.id === id;
      });
      return c ? c.fonte : null;
    }

function imuneCondicao(t, id) {
      if (id === "amedrontado" && t.efeitos && t.efeitos.imuneMedo) return true;
      return stats(t).imunCond.indexOf(id) >= 0;
    }

function aplicarCondicao(t, id, opts) {
      opts = opts || {};
      if (!CONDICOES[id]) return null;
      if (imuneCondicao(t, id)) return (t.nome || "Criatura") + " é imune à condição " + CONDICOES[id] + ".";
      if (id === "caido" && tem(t, "caido")) return null;
      var existente = (t.condicoes || []).find(function(c) {
        return c.id === id && c.fonte === (opts.fonte || null);
      });
      if (existente) {
        if (opts.rodadas != null) existente.rodadas = opts.rodadas;
        return null;
      }
      t.condicoes.push({ id, fonte: opts.fonte || null, rodadas: opts.rodadas == null ? null : opts.rodadas, salva: opts.salva || null });
      if (id === "inconsciente" || id === "paralisado" || id === "atordoado") t.preparada = null;
      return (t.nome || "Criatura") + " fica " + CONDICOES[id] + ".";
    }

function removerCondicao(t, id) {
      var antes = (t.condicoes || []).length;
      t.condicoes = (t.condicoes || []).filter(function(c) {
        return c.id !== id;
      });
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

function celulasEm(m) {
      return m / 1.5;
    }

C.CONDICOES = CONDICOES;

C.NOME_ATTR = NOME_ATTR;

C.ATRIBUTOS = ATRIBUTOS;

C.util = { rolar, d20, d, mod, sinal, norm, nomeTipo, canonicoDano, idCondicao, mediaDano, parseAcaoMonstro, parseDefesas };

C._interno = {
      est,
      toks,
      porId,
      monstro,
      ehJogador,
      faccao,
      hostis,
      registrar,
      stats,
      preparar,
      novaEco,
      condSet,
      tem,
      incapacitado,
      condicaoFonte,
      aplicarCondicao,
      removerCondicao,
      veloc,
      movimentoRestante,
      dist,
      pegadaDist,
      celulasEm,
      modoFinal,
      textoD20,
      XP_POR_ND,
      CLASSES_MAESTRIA,
      env,
      FISICOS
    };

function mts(n) {
      return String(Math.round(n * 15) / 10).replace(".", ",");
    }

function nomeDe(t) {
      return t && t.nome || "Criatura";
    }

function viva(t) {
      return !!t && !t.morto;
    }

function adjacentesInimigos(t) {
      return toks().filter(function(o) {
        return o !== t && viva(o) && hostis(t, o) && !incapacitado(o) && dist(t, o) <= 1;
      });
    }

function bonusPericia(t, nome, attrPadrao) {
      var s = stats(t);
      if (s.pericias && s.pericias[nome] != null) return Number(s.pericias[nome]);
      return s.mods[attrPadrao || "DES"];
    }

function pontosDeVidaTexto(t) {
      return "PV " + Math.max(0, t.hp) + "/" + t.hpMax + (t.hpTemp ? " (+" + t.hpTemp + " temp.)" : "");
    }

function vantagemAtaque(att, alvo, atq, distancia) {
      var v = [], ds = [];
      var ca = condSet(att), cd = condSet(alvo);
      var sa = stats(att);
      if (ca.cego) ds.push("atacante cego");
      if (ca.envenenado) ds.push("atacante envenenado");
      if (ca.contido) ds.push("atacante contido");
      if (ca.caido) ds.push("atacante caído");
      if (ca.amedrontado) {
        var fo = porId(condicaoFonte(att, "amedrontado"));
        if (!fo || env.linhaVisao(att, fo)) ds.push("atacante amedrontado");
      }
      if (ca.agarrado) {
        var g = condicaoFonte(att, "agarrado");
        if (g && g !== alvo.id) ds.push("atacante agarrado");
      }
      if (ca.invisivel) v.push("atacante invisível");
      if (att.escondido) v.push("atacante escondido");
      if (cd.cego) v.push("alvo cego");
      if (cd.contido) v.push("alvo contido");
      if (cd.paralisado) v.push("alvo paralisado");
      if (cd.petrificado) v.push("alvo petrificado");
      if (cd.atordoado) v.push("alvo atordoado");
      if (cd.inconsciente) v.push("alvo inconsciente");
      if (cd.invisivel) ds.push("alvo invisível");
      if (alvo.escondido) ds.push("alvo escondido");
      if (cd.caido) {
        if (distancia <= 1) v.push("alvo caído ao alcance");
        else ds.push("alvo caído à distância");
      }
      if (alvo.eco && alvo.eco.esquiva && !incapacitado(alvo) && veloc(alvo) > 0) ds.push("alvo esquivando");
      if (atq.distancia && adjacentesInimigos(att).length) ds.push("inimigo adjacente");
      if (atq.distancia && distancia > (atq.alcanceNormal || 0) && atq.alcanceNormal) ds.push("alcance longo");
      if (att.efeitos && att.efeitos.vex && att.efeitos.vex.alvo === alvo.id) v.push("Vex");
      if (att.efeitos && att.efeitos.sap) ds.push("Sap");
      if (att.efeitos && att.efeitos.ajudadoPor) v.push("ajudado");
      if (alvo.efeitos && alvo.efeitos.distraido) {
        var helper = porId(alvo.efeitos.distraido);
        if (helper && faccao(helper) === faccao(att)) v.push("alvo distraído");
      }
      var pack = (sa.tracos || []).some(function(tr) {
        return /t[aá]ticas de matilha|pack tactics/i.test(tr.name || tr.nome || "");
      });
      if (pack) {
        var aliado = toks().some(function(o) {
          return o !== att && viva(o) && faccao(o) === faccao(att) && !incapacitado(o) && dist(o, alvo) <= 1;
        });
        if (aliado) v.push("Táticas de matilha");
      }
      return { modo: modoFinal(v, ds), v, ds };
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
      t.hp = 0;
      t.morto = true;
      t.condicoes = [];
      t.concentracao = null;
      t.preparada = null;
      t.escondido = false;
      toks().forEach(function(o) {
        if (o.condicoes) o.condicoes = o.condicoes.filter(function(c) {
          return !(c.id === "agarrado" && c.fonte === t.id);
        });
      });
      L.push(nomeDe(t) + " foi derrotado.");
    }
