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
