var autoCombatTimer = null, autoCombatBusy = false, autoCombatWasActive = false, autoCombatCooldown = 0;
var AUTO_COMBAT_SIGHT = 12, AUTO_COMBAT_JOIN = 6;
function autoCombatAggressive(t) {
    var C = getCombat();
    if (!C || !t || t.tipo === "player" || t.morto || t.agressivo === false) return false;
    if (t.hp != null && t.hp <= 0) return false;
    if (t.aliado || t.faccao && t.faccao !== "monstros") return false;
    if (C.incapacitado(t)) return false;
    if (t.agressivo === true) return true;
    var m = t.monsterId ? C.monstro(t) : null;
    return !!m && m.categoria !== "NPC";
  }
function autoCombatSees(mon, pl) {
    var C = getCombat();
    if (pl.escondido || (pl.condicoes || []).some(function(c) {
      return c.id === "invisivel";
    })) return false;
    if (C.dist(mon, pl) > AUTO_COMBAT_SIGHT) return false;
    return combatLineOfSight(mon, pl);
  }
function autoCombatBegin(opts) {
    var C = getCombat();
    if (!C || !combatAvailable() || C.ativo()) return null;
    var join = {}, seeds = (opts.aggressors || []).concat(opts.victims || []);
    (opts.victims || []).forEach(function(v) {
      if (v.tipo !== "player" && C.faccao(v) !== "monstros") {
        v.faccao = "monstros";
        delete v.aliado;
      }
    });
    seeds.forEach(function(sd) {
      join[sd.id] = true;
    });
    state.tokens.forEach(function(o) {
      if (o.morto || join[o.id]) return;
      if (o.tipo === "player") {
        join[o.id] = true;
        return;
      }
      if (o.hp != null && o.hp <= 0) return;
      if (autoCombatAggressive(o) && seeds.some(function(sd) {
        return C.dist(sd, o) <= AUTO_COMBAT_JOIN;
      })) join[o.id] = true;
      else if (o.aliado && opts.player && C.dist(o, opts.player) <= AUTO_COMBAT_SIGHT) join[o.id] = true;
    });
    var lines = C.iniciarCombate({ filtro: function(t) {
      return !!join[t.id];
    }, primeiro: opts.first ? opts.first.id : null });
    if (!C.ativo()) return null;
    stopKeyMove();
    clickMovePath = [];
    clickMoveExitPending = false;
    if (opts.reason) lines.unshift(opts.reason);
    combatRefreshUi();
    return lines;
  }
function autoCombatTick() {
    if (!R || !cv || autoCombatBusy || appMode !== "player" || !combatAvailable()) return;
    var C = getCombat();
    if (C.ativo()) {
      autoCombatWasActive = true;
      return;
    }
    if (autoCombatWasActive) {
      autoCombatWasActive = false;
      autoCombatCooldown = Date.now() + 15e3;
    }
    if (Date.now() < autoCombatCooldown || R.querySelector(".mp-portal-dialog-overlay")) return;
    var pl = currentPlayer();
    if (!pl || pl.tipo !== "player" || pl.hp != null && pl.hp <= 0) return;
    var seers = state.tokens.filter(function(t) {
      return autoCombatAggressive(t) && autoCombatSees(t, pl);
    });
    if (!seers.length) return;
    autoCombatBusy = true;
    try {
      var names = seers.slice(0, 3).map(function(t) {
        return t.nome;
      }).join(", ") + (seers.length > 3 ? " e outros" : "");
      var lines = autoCombatBegin({ player: pl, aggressors: seers, reason: "⚔ " + names + (seers.length > 1 ? " viram" : " viu") + " o personagem! O combate começou." });
      if (lines) combatShowLog("⚔ Combate iniciado", lines, combatRefreshUi);
    } finally {
      autoCombatBusy = false;
    }
  }
function combatStart() {
    var C = getCombat();
    if (!combatAvailable()) {
      combatToast("O combate funciona nos mapas de masmorra (grade quadrada).");
      return;
    }
    if (C.ativo()) {
      combatToast("O combate já está em andamento.");
      return;
    }
    var lines = C.iniciarCombate();
    combatRefreshUi();
    combatShowLog("⚔ Início do combate", lines, combatRefreshUi);
  }
function combatEndTurn() {
    var C = getCombat();
    if (!combatActive()) return;
    var cur = C.atual();
    if (appMode === "player" && cur && cur.tipo !== "player") {
      combatToast("Aguarde: não é o turno do personagem.");
      return;
    }
    var lines = C.encerrarTurnoAtual();
    combatRefreshUi();
    combatShowLog("Fim do turno", lines, combatRefreshUi);
  }
function combatStop() {
    var C = getCombat();
    if (!combatActive()) return;
    var lines = C.encerrar("manual");
    combatRefreshUi();
    combatShowLog("Combate encerrado", lines, combatRefreshUi);
  }
function combatShowRegistry() {
    var C = getCombat();
    if (!C) return;
    var lines = combatState().registro || [];
    combatShowLog("Registro do combate", lines.length ? lines.slice(-60) : ["Nenhum evento registrado ainda."]);
  }
function combatStepAllowed(token, next) {
    var C = getCombat();
    if (!C || isHexMap() || !combatState().ativo) return true;
    var r = C.podeMover(token, { x: token.x, y: token.y }, next);
    if (!r.ok) {
      combatToast(r.motivo);
      return false;
    }
    combatCostPending = r.custo || 1;
    return true;
  }
function combatAfterStep(token, from, to) {
    var C = getCombat();
    if (token && token.tipo === "player") window.setTimeout(autoCombatTick, 0);
    if (!C || isHexMap() || !combatState().ativo) return;
    var lines = C.aposMover(token, from, to, combatCostPending);
    combatCostPending = 1;
    if (lines.length) {
      stopKeyMove();
      window.setTimeout(function() {
        combatShowLog("Ataque de oportunidade", lines, combatRefreshUi);
        save();
        draw();
      }, 0);
    }
  }
