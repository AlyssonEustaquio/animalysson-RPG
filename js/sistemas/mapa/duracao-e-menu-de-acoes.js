var ACTION_MS = { perception: 6000, investigation: 6000, athletics: 6000, tools: 6000, interact: 1000, skill: 6000 };
var COMBAT_COST_MS = { acao: 6000, bonus: 3000, reacao: 0 };
var actionBusy = null;
var combatSkipWait = false;
function actionLocked() {
    return !!(actionBusy && Date.now() < actionBusy.until) || !!(window.Dados3D && window.Dados3D.ocupado());
  }
function weaponSwingMs(weapon, twoHands, thrown) {
    if (!weapon) return 700;
    var props = normalizeRpgText(weapon.propriedades || "");
    var lb = parseFloat(String(weapon.peso || "").replace(",", ".")) || 3;
    var ms = lb <= 2 ? 1000 : lb <= 4 ? 1500 : lb <= 8 ? 2000 : 3000;
    var ranged = /distancia/.test(normalizeRpgText(weapon.tipo || ""));
    if (/\bleve\b/.test(props)) ms -= 300;
    if (props.indexOf("acuidade") >= 0) ms -= 100;
    if (props.indexOf("pesada") >= 0) ms += 1000;
    if (props.indexOf("alcance") >= 0) ms += 500;
    if (props.indexOf("duas maos") >= 0 || twoHands) ms += 500;
    if (props.indexOf("municao") >= 0) ms += 500;
    if (props.indexOf("recarga") >= 0 || props.indexOf("carregamento") >= 0) ms += 1000;
    if (thrown) ms = Math.min(ms, 1200);
    if (ranged && ms < 1500) ms = 1500;
    return Math.max(700, Math.min(5000, ms));
  }
function spellCastMs(name, castType) {
    var spell = null;
    if (name && typeof window.findSpell === "function") {
      var key = normalizeRpgText(name).trim();
      spell = (window.SPELLS || []).find(function(sp) {
        return normalizeRpgText(sp.n) === key || normalizeRpgText(sp.en) === key;
      }) || null;
    }
    var time = spell ? normalizeRpgText(spell.tempo) : castType === "bonus" ? "1 acao bonus" : "1 acao";
    var level = spell ? Number(spell.lvl) || 0 : 1;
    if (/reacao/.test(time)) return 0;
    var minutes = time.match(/(\d+)\s*minuto/), hours = time.match(/(\d+)\s*hora/);
    if (minutes) return Math.min(60000, Number(minutes[1]) * 60000);
    if (hours) return 60000;
    var ms = level === 0 ? 2000 : 2600 + 400 * level;
    if (/bonus/.test(time)) ms = Math.round(ms * 0.6);
    return ms;
  }
function beginActionWait(ms) {
    if (!(ms > 0)) return;
    stopKeyMove();
    actionBusy = { until: Date.now() + ms };
  }
function runPlayerAction(action) {
    if (action !== "menu" && action !== "combat" && ACTION_MS[action]) {
      if (actionLocked()) {
        combatToast("Aguarde: o personagem ainda está concluindo a ação.");
        return;
      }
      var ms = ACTION_MS[action];
      if (action !== "interact" && window.Dados3D) window.Dados3D.prever(20, ms);
      beginActionWait(ms);
      window.setTimeout(function() {
        actionBusy = null;
        runPlayerActionNow(action);
      }, ms);
      return;
    }
    if (action !== "menu" && actionLocked()) {
      combatToast("Aguarde: o personagem ainda está concluindo a ação.");
      return;
    }
    runPlayerActionNow(action);
  }
function runPlayerActionNow(action) {
    if (appMode !== "player") return;
    var player = currentPlayer();
    if (!player || player.tipo !== "player") {
      playerActionResult("Ações do personagem", ["Não há um personagem jogador neste mapa."]);
      return;
    }
    var profile = playerActionProfile(player), range = playerVisionRadius(player);
    if (action === "menu") openPlayerActionMenu();
    else if (action === "perception") runPlayerPerception(player, profile, range);
    else if (action === "investigation") runPlayerInvestigation(player, profile, range);
    else if (action === "attack") runPlayerAttack(player, profile, range);
    else if (action === "combat") openCombatMenu();
    else if (action === "athletics") runPlayerDoorCheck(player, profile, range, false);
    else if (action === "tools") runPlayerDoorCheck(player, profile, range, true);
    else if (action === "interact") runPlayerInteract(player, range);
    else if (action === "skill") runPlayerSkill(player, profile);
  }
function openPlayerActionMenu() {
    var player = currentPlayer();
    if (!player || player.tipo !== "player") {
      playerActionResult("Ações do personagem", ["Não há um personagem jogador neste mapa."]);
      return;
    }
    var profile = playerActionProfile(player), range = playerVisionRadius(player);
    var dlg = combatDialog("Ações do personagem", "Escolha uma ação. As opções estão agrupadas por finalidade.", 500);
    if (!dlg) return;
    function group(title) {
      var box = document.createElement("section");
      box.className = "mp-action-group";
      var heading = document.createElement("h4");
      heading.textContent = title;
      box.appendChild(heading);
      var grid = document.createElement("div");
      grid.className = "mp-cb-grid";
      box.appendChild(grid);
      dlg.panel.appendChild(box);
      return grid;
    }
    function add(grid, label, hint, fn) {
      grid.appendChild(combatButton(label, function() {
        combatClose(dlg);
        fn();
      }, { title: hint || "" }));
    }
    var combat = group("Combate");
    add(combat, "⚔ Ataque", "Escolher arma e alvo", function() {
      runPlayerAttack(player, profile, range);
    });
    if (!combatActive()) add(combat, "🛡 Ações avançadas de combate", "Magias, ações, bônus, movimento e descanso", function() {
      openCombatMenu();
    });
    var explore = group("Exploração");
    add(explore, "👁 Percepção", "Observar o ambiente e procurar detalhes visíveis", function() {
      runPlayerPerception(player, profile, range);
    });
    add(explore, "🔎 Investigação", "Examinar objetos, pistas e mecanismos próximos", function() {
      runPlayerInvestigation(player, profile, range);
    });
    var interact = group("Obstáculos e interação");
    add(interact, "💪 Atletismo", "Forçar portas e obstáculos", function() {
      runPlayerDoorCheck(player, profile, range, false);
    });
    add(interact, "🗝 Ferramentas", "Abrir fechaduras e mecanismos com ferramentas", function() {
      runPlayerDoorCheck(player, profile, range, true);
    });
    add(interact, "✋ Interagir", "Acionar mecanismos secretos já descobertos", function() {
      runPlayerInteract(player, range);
    });
    var footer = document.createElement("div");
    footer.className = "mp-portal-dialog-actions";
    footer.appendChild(combatButton("Fechar", function() {
      combatClose(dlg);
    }, { primary: true }));
    dlg.panel.appendChild(footer);
  }
