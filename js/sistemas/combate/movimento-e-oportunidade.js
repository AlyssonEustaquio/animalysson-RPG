function raio(t) {
      return Math.max(1, t.raio || 1);
    }
function atqDeMonstro(a, modo) {
      var m = modo || (a.modo === "distancia" ? "distancia" : "corpo");
      var danos = a.dano || [];
      if (a.modo === "ambos" && danos.length > 1) danos = [m === "corpo" ? danos[0] : danos[1]];
      return {
        nome: a.nome,
        bonus: a.bonus,
        distancia: m === "distancia",
        alcanceNormal: m === "corpo" ? a.alcanceCorpo : a.alcanceNormal || a.alcanceCorpo,
        alcanceMax: m === "corpo" ? a.alcanceCorpo : a.alcanceMax || a.alcanceCorpo,
        dano: danos,
        extra: a.extra,
        magico: !!a.magico,
        arma: false,
        atributoMod: null
      };
    }
function alcanceCorpoDe(t) {
      var s = stats(t);
      if (s.tipo === "pc") {
        var a = env.pcAtaquePadrao ? env.pcAtaquePadrao(t) : null;
        return a && !a.distancia ? a.alcanceMax || 1 : 1;
      }
      var r = 0;
      (s.ataques || []).forEach(function(x) {
        if (x.tipo === "ataque" && x.modo !== "distancia") r = Math.max(r, x.alcanceCorpo || 1);
      });
      return r;
    }
function ataqueOportunidade(e) {
      var s = stats(e);
      if (s.tipo === "pc") return env.pcAtaquePadrao ? env.pcAtaquePadrao(e) : null;
      var melhor = null, mm = -1;
      (s.ataques || []).forEach(function(x) {
        if (x.tipo !== "ataque" || x.modo === "distancia") return;
        var m = (x.dano || []).reduce(function(acc, p) {
          return acc + mediaDano(p.dados);
        }, 0);
        if (m > mm) {
          mm = m;
          melhor = x;
        }
      });
      return melhor ? atqDeMonstro(melhor, "corpo") : null;
    }
function ataquesDeOportunidade(mover, de, para) {
      var L = [];
      if (mover.eco && mover.eco.desengajou) return L;
      toks().slice().forEach(function(e) {
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
        L.push(nomeDe(e) + " usa a reação para um ataque de oportunidade contra " + nomeDe(mover) + ".");
        var px = mover.x, py = mover.y;
        mover.x = de.x;
        mover.y = de.y;
        var r = atacar(e, mover, atq, { ignorarVisao: true });
        mover.x = px;
        mover.y = py;
        L.push.apply(L, r.linhas);
      });
      return L;
    }
C.podeMover = function(t, de, para) {
      if (!est().ativo) return { ok: true, custo: 0 };
      var s = est();
      if (s.ordem.every(function(x) {
        return x.id !== t.id;
      })) return { ok: true, custo: 0 };
      var atual = C.atual();
      if (atual && atual !== t) return { ok: false, motivo: "Não é o turno de " + nomeDe(t) + "." };
      if (incapacitado(t) || t.hp <= 0) return { ok: false, motivo: nomeDe(t) + " não pode se mover." };
      if (!t.eco) t.eco = novaEco();
      var custo = tem(t, "caido") ? 2 : 1;
      if (movimentoRestante(t) < custo) return { ok: false, motivo: "Sem deslocamento restante neste turno." };
      if (tem(t, "amedrontado")) {
        var f = porId(condicaoFonte(t, "amedrontado"));
        if (f && pegadaDist(para.x, para.y, raio(t), f.x, f.y, raio(f)) < pegadaDist(de.x, de.y, raio(t), f.x, f.y, raio(f))) return { ok: false, motivo: nomeDe(t) + " está amedrontado e não se aproxima da fonte do medo." };
      }
      return { ok: true, custo };
    };
C.aposMover = function(t, de, para, custo) {
      var L = [];
      if (!est().ativo || !t.eco) return L;
      var dx = Math.abs(para.x - de.x), dy = Math.abs(para.y - de.y);
      t.eco.mov += (custo || 1) * Math.max(1, Math.max(dx, dy));
      L = ataquesDeOportunidade(t, de, para);
      if (L.length) registrar(L);
      return L;
    };
C.levantar = function(t) {
      if (!tem(t, "caido") || tem(t, "inconsciente")) return ["Não é possível se levantar agora."];
      var custo = Math.floor(stats(t).veloc / 2);
      if (est().ativo && movimentoRestante(t) < custo) return ["Deslocamento insuficiente para se levantar (" + custo + " quadrículas)."];
      if (est().ativo && t.eco) t.eco.mov += custo;
      removerCondicao(t, "caido");
      return [nomeDe(t) + " se levanta" + (est().ativo ? " (gasta " + mts(custo) + " m de deslocamento)" : "") + "."];
    };
