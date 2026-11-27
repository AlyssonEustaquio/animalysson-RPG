function combatDialog(title, description, width) {
    var dlg = createPortalDialog(title, description || "");
    if (!dlg) return null;
    dlg.panel.style.width = "min(" + (width || 480) + "px,100%)";
    dlg.panel.style.maxHeight = "88%";
    dlg.panel.style.overflow = "auto";
    return dlg;
  }
function combatButton(label, onclick, options) {
    options = options || {};
    var b = document.createElement("button");
    b.type = "button";
    b.className = "mp-cb-btn" + (options.primary ? " primary" : "");
    b.textContent = label;
    if (options.title) b.title = options.title;
    if (options.disabled) {
      b.disabled = true;
      b.classList.add("off");
    } else b.onclick = onclick;
    return b;
  }
function combatClose(dlg) {
    if (dlg) closePortalDialog(dlg.overlay);
  }
function combatRefreshUi() {
    combatHudSig = "";
    renderCombatHud();
    updateCombatPanelUi();
    save();
    draw();
  }
function updateCombatPanelUi() {
    if (!R) return;
    var panel = R.querySelector("#mp-combat-panel");
    if (!panel) return;
    var C = getCombat();
    var active = !!(C && !isHexMap() && combatState().ativo);
    var start = panel.querySelector('[data-cb="start"]');
    var stop = panel.querySelector('[data-cb="stop"]');
    var status = panel.querySelector("#mp-cb-panel-status");
    if (start) {
      start.hidden = active;
      start.disabled = !C || isHexMap();
    }
    if (stop) stop.hidden = !active;
    if (status) {
      if (!C || isHexMap()) status.textContent = "O combate está disponível em mapas de masmorra com grade quadrada.";
      else if (active) {
        var current = C.atual();
        status.textContent = "Rodada " + combatState().rodada + " · turno de " + (current ? current.nome : "—") + ". Ações e fim do turno ficam na barra do mapa.";
      } else status.textContent = "Nenhum combate ativo. Posicione os participantes e inicie quando estiver pronto.";
    }
  }
function combatShowLog(title, lines, onClose, extraButtons) {
    if (title !== "Registro do combate") {
      postRollChat(title, lines, extraButtons, onClose);
      return;
    }
    var dlg = combatDialog(title, "", 620);
    if (!dlg) {
      if (onClose) onClose();
      return;
    }
    var list = document.createElement("div");
    list.className = "mp-cb-log";
    (lines || []).forEach(function(line) {
      var item = document.createElement("div");
      item.textContent = String(line);
      if (/^—/.test(line)) item.className = "mp-cb-head";
      list.appendChild(item);
    });
    dlg.panel.appendChild(list);
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    (extraButtons || []).forEach(function(b) {
      actions.appendChild(combatButton(b.label, function() {
        combatClose(dlg);
        b.run();
      }, { primary: !!b.primary }));
    });
    actions.appendChild(combatButton("Fechar", function() {
      combatClose(dlg);
      if (onClose) onClose();
    }, { primary: !extraButtons || !extraButtons.length }));
    dlg.panel.appendChild(actions);
    list.scrollTop = list.scrollHeight;
  }
function combatToast(text) {
    var hud = R && R.querySelector("#mp-combat-toast");
    if (!hud) return;
    hud.textContent = text;
    hud.style.display = "block";
    if (combatToastTimer) window.clearTimeout(combatToastTimer);
    combatToastTimer = window.setTimeout(function() {
      hud.style.display = "none";
    }, 2600);
  }
function combatTokenLabel(t) {
    var C = getCombat();
    var conds = C.condicoesDe(t).map(function(c) {
      return C.CONDICOES[c];
    });
    return (t.nome || "Criatura") + " — " + C.pontosDeVidaTexto(t) + (conds.length ? " · " + conds.join(", ") : "");
  }
function combatPickToken(title, description, candidates, onPick) {
    var dlg = combatDialog(title, description, 460);
    if (!dlg) return;
    var C = getCombat();
    if (!candidates.length) {
      var p = document.createElement("p");
      p.textContent = "Nenhum alvo válido (alcance, linha de visão e cobertura).";
      dlg.panel.appendChild(p);
    }
    var list = document.createElement("div");
    list.className = "mp-cb-list";
    candidates.forEach(function(c) {
      var t = c.token || c;
      var label = combatTokenLabel(t) + (c.distancia != null ? " · " + (Math.round(c.distancia * 15) / 10).toString().replace(".", ",") + " m" : "");
      list.appendChild(combatButton(label, function() {
        combatClose(dlg);
        onPick(t);
      }));
    });
    dlg.panel.appendChild(list);
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    actions.appendChild(combatButton("Cancelar", function() {
      combatClose(dlg);
    }));
    dlg.panel.appendChild(actions);
  }
function combatSelect(options, value) {
    var s = document.createElement("select");
    s.className = "mp-cb-input";
    options.forEach(function(o) {
      var op = document.createElement("option");
      op.value = o[0];
      op.textContent = o[1];
      s.appendChild(op);
    });
    if (value != null) s.value = value;
    return s;
  }
function combatField(dlgPanel, label, control) {
    var wrap = document.createElement("label");
    wrap.className = "mp-cb-field";
    var span = document.createElement("span");
    span.textContent = label;
    wrap.appendChild(span);
    wrap.appendChild(control);
    dlgPanel.appendChild(wrap);
    return control;
  }
function combatInput(type, value) {
    var i = document.createElement("input");
    i.type = type;
    i.value = value == null ? "" : value;
    i.className = "mp-cb-input";
    return i;
  }
