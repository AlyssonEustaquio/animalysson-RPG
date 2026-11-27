function renderCombatHud() {
    var hud = R && R.querySelector("#mp-combat-hud");
    if (!hud) return;
    var C = getCombat();
    if (!C || isHexMap() || !combatState().ativo) {
      if (hud.dataset.on !== "0") {
        hud.dataset.on = "0";
        hud.style.display = "none";
      }
      combatHudSig = "";
      updateCombatPanelUi();
      return;
    }
    var cur = C.atual();
    var parts = [combatState().rodada, cur ? cur.id : "", cur && cur.eco ? [cur.eco.acao, cur.eco.bonus, cur.eco.reacao, C.movimentoRestante(cur)].join(",") : "", C.resumoOrdem().map(function(o) {
      return o.id + o.morto + o.caido;
    }).join("|"), appMode];
    var sig = parts.join("#");
    if (sig === combatHudSig) return;
    combatHudSig = sig;
    hud.dataset.on = "1";
    hud.style.display = "flex";
    var order = C.resumoOrdem().map(function(o) {
      return '<span class="mp-cb-chip' + (o.atual ? " now" : "") + (o.morto ? " dead" : "") + (o.caido ? " down" : "") + '" data-id="' + esc(o.id) + '">' + esc(o.nome.slice(0, 12)) + " <small>" + o.valor + "</small></span>";
    }).join("");
    var eco = "";
    if (cur && cur.eco) {
      eco = '<span class="mp-cb-eco' + (cur.eco.acao ? " ok" : "") + '">Ação</span><span class="mp-cb-eco' + (cur.eco.bonus ? " ok" : "") + '">Bônus</span><span class="mp-cb-eco' + (cur.eco.reacao ? " ok" : "") + '">Reação</span><span class="mp-cb-eco ok">Mov ' + (Math.round(C.movimentoRestante(cur) * 15) / 10).toString().replace(".", ",") + " m</span>";
    }
    hud.innerHTML = '<div class="mp-cb-order">' + order + '</div><div class="mp-cb-row"><strong>Rodada ' + combatState().rodada + " · " + esc(cur ? cur.nome : "—") + "</strong>" + eco + '</div><div class="mp-cb-row"><button type="button" data-cb="menu">⚔ Ações</button><button type="button" data-cb="end">⏭ Fim do turno</button><button type="button" data-cb="log">📜 Registro</button></div>';
    updateCombatPanelUi();
  }
function combatDrawOverlay(t, c, r) {
    var C = getCombat();
    if (!C || isHexMap()) return;
    var s = combatState();
    if (t.morto) {
      cx.save();
      cx.fillStyle = "rgba(0,0,0,0.55)";
      cx.beginPath();
      cx.arc(c.x, c.y, r, 0, Math.PI * 2);
      cx.fill();
      cx.fillStyle = "#fff";
      cx.font = "bold " + Math.max(12, r * 1.1) + "px sans-serif";
      cx.textAlign = "center";
      cx.textBaseline = "middle";
      cx.fillText("✝", c.x, c.y);
      cx.restore();
      return;
    }
    var cur = s.ativo ? C.atual() : null;
    if (cur === t) {
      cx.save();
      cx.strokeStyle = "#ffd54f";
      cx.lineWidth = 3.5 / zoom;
      cx.setLineDash([6 / zoom, 4 / zoom]);
      cx.beginPath();
      cx.arc(c.x, c.y, r + 5 / zoom, 0, Math.PI * 2);
      cx.stroke();
      cx.restore();
    }
    var tags = [];
    if (t.hp != null && t.hp <= 0 && C.ehJogador(t)) tags.push("💤");
    if (t.efeitos && t.efeitos.furia) tags.push("🔥");
    if (t.concentracao) tags.push("C");
    if (t.escondido) tags.push("👁");
    (t.condicoes || []).forEach(function(cd) {
      if (tags.length < 5) tags.push(COMBAT_COND_ABBR[cd.id] || "?");
    });
    if (t.exaustao) tags.push("E" + t.exaustao);
    if (tags.length) {
      cx.save();
      var fs = Math.max(8, 9 / zoom * (zoom < 0.6 ? 0.8 : 1));
      cx.font = "bold " + fs + "px sans-serif";
      cx.textAlign = "center";
      cx.textBaseline = "middle";
      var text = tags.join(" "), w = cx.measureText(text).width + 6 / zoom, h = fs + 4 / zoom;
      var y = c.y - r - h / 2 - 2 / zoom;
      cx.fillStyle = "rgba(15,15,20,0.82)";
      cx.fillRect(c.x - w / 2, y - h / 2, w, h);
      cx.fillStyle = "#ffe082";
      cx.fillText(text, c.x, y);
      cx.restore();
    }
  }
function combatDetailHtml(t) {
    var C = getCombat();
    if (!C || isHexMap()) return "";
    C.preparar(t);
    var conds = Object.keys(C.CONDICOES).map(function(id) {
      var on = (t.condicoes || []).some(function(c) {
        return c.id === id;
      });
      return '<button type="button" class="mp-cb-cond' + (on ? " on" : "") + '" data-cond="' + id + '">' + esc(C.CONDICOES[id]) + "</button>";
    }).join("");
    var inOrder = combatState().ativo && combatState().ordem.some(function(o) {
      return o.id === t.id;
    });
    return '<div class="mp-cb-detail"><b>Combate</b><div class="mp-hp-row"><label>CA <input type="number" id="mp-cb-ca" value="' + esc(t.ca || C.stats(t).ca) + '" style="width:52px"></label><label>PV temp. <input type="number" id="mp-cb-temp" value="' + (t.hpTemp || 0) + '" min="0" style="width:52px"></label><label>Exaustão <input type="number" id="mp-cb-exa" value="' + (t.exaustao || 0) + '" min="0" max="6" style="width:44px"></label></div><div class="mp-hp-row"><label>Cobertura <select id="mp-cb-cob"><option value="0">Nenhuma</option><option value="2">Parcial (+2)</option><option value="5">¾ (+5)</option><option value="99">Total</option></select></label><label>Lado <select id="mp-cb-fac"><option value="jogadores">Jogadores</option><option value="monstros">Monstros</option></select></label></div><div class="mp-cb-conds">' + conds + '</div><div class="mp-detail-tools"><button type="button" id="mp-cb-dmg">Causar dano</button><button type="button" id="mp-cb-heal">Curar</button>' + (combatState().ativo && !inOrder ? '<button type="button" id="mp-cb-join">Pôr no combate</button>' : "") + (t.morto ? '<button type="button" id="mp-cb-revive">Reviver</button>' : "") + "</div></div>";
  }
function combatDetailBind(box, t) {
    var C = getCombat();
    if (!C || isHexMap()) return;
    var cob = box.querySelector("#mp-cb-cob"), fac = box.querySelector("#mp-cb-fac");
    if (cob) {
      cob.value = String(t.cobertura || 0);
      cob.onchange = function() {
        t.cobertura = Number(cob.value) || 0;
        save();
      };
    }
    if (fac) {
      fac.value = C.faccao(t);
      fac.onchange = function() {
        t.faccao = fac.value;
        save();
      };
    }
    var ca = box.querySelector("#mp-cb-ca");
    if (ca) ca.onchange = function() {
      t.ca = Math.max(0, Math.round(Number(ca.value) || 0)) || void 0;
      save();
    };
    var temp = box.querySelector("#mp-cb-temp");
    if (temp) temp.onchange = function() {
      t.hpTemp = Math.max(0, Math.round(Number(temp.value) || 0));
      save();
      draw();
    };
    var exa = box.querySelector("#mp-cb-exa");
    if (exa) exa.onchange = function() {
      t.exaustao = Math.max(0, Math.min(6, Math.round(Number(exa.value) || 0)));
      if (t.exaustao >= 6) {
        t.hp = 0;
        t.morto = true;
      }
      save();
      draw();
    };
    box.querySelectorAll(".mp-cb-cond").forEach(function(b) {
      b.onclick = function() {
        var id = b.getAttribute("data-cond");
        if ((t.condicoes || []).some(function(c) {
          return c.id === id;
        })) C.removerCondicao(t, id);
        else C.aplicarCondicao(t, id, {});
        save();
        draw();
        updateDetailPanel();
      };
    });
    var dmg = box.querySelector("#mp-cb-dmg");
    if (dmg) dmg.onclick = function() {
      combatNumberDialog("Causar dano", "Dano (sem tipo, aplicado integralmente)", 1, 0, 999, function(v) {
        var r = C.aplicarDano(t, [{ valor: v, tipo: null }], {});
        C.registrar(r.linhas);
        combatRefreshUi();
        updateDetailPanel();
        combatShowLog("Dano", r.linhas);
      });
    };
    var heal = box.querySelector("#mp-cb-heal");
    if (heal) heal.onclick = function() {
      combatNumberDialog("Curar", "PV recuperados", 1, 1, 999, function(v) {
        var l = C.curar(t, v);
        C.registrar(l);
        combatRefreshUi();
        updateDetailPanel();
        combatShowLog("Cura", l);
      });
    };
    var join = box.querySelector("#mp-cb-join");
    if (join) join.onclick = function() {
      var l = C.entrarNoCombate(t);
      combatRefreshUi();
      updateDetailPanel();
      combatShowLog("Combate", l);
    };
    var revive = box.querySelector("#mp-cb-revive");
    if (revive) revive.onclick = function() {
      t.morto = false;
      t.hp = 1;
      t.mortes = { s: 0, f: 0 };
      t.estavel = false;
      C.removerCondicao(t, "inconsciente");
      save();
      draw();
      updateDetailPanel();
    };
  }
function updateModeUi() {
    if (!R) return;
    var root = R.querySelector("#mp-root");
    if (root) {
      root.classList.toggle("player-mode", appMode === "player");
      root.classList.toggle("editor-mode", appMode === "editor");
    }
    var editorOnlyNodes = R.querySelectorAll(".mp-editor-only");
    editorOnlyNodes.forEach(function(node) {
      if (appMode === "player") {
        node.style.setProperty("display", "none", "important");
        node.setAttribute("aria-hidden", "true");
        node.setAttribute("inert", "");
      } else {
        node.style.removeProperty("display");
        node.removeAttribute("aria-hidden");
        node.removeAttribute("inert");
      }
    });
    var actionTray = R.querySelector("#mp-player-actions");
    if (actionTray) actionTray.style.display = appMode === "player" ? "block" : "none";
    var playerButton = R.querySelector("#mp-mode-player");
    var editorButton = R.querySelector("#mp-mode-editor");
    if (playerButton) playerButton.classList.toggle("active", appMode === "player");
    if (editorButton) editorButton.classList.toggle("active", appMode === "editor");
    var gridButton = R.querySelector("#mp-grid");
    var fogButton = R.querySelector("#mp-fog");
    var lightButton = R.querySelector("#mp-light");
    var wallsButton = R.querySelector("#mp-walls-vis");
    var secretsButton = R.querySelector("#mp-secret-view");
    if (gridButton) gridButton.classList.toggle("on", showGrid);
    if (fogButton) fogButton.classList.toggle("on", showFog);
    if (lightButton) lightButton.classList.toggle("on", dynLight);
    if (wallsButton) wallsButton.classList.toggle("on", showWalls);
    if (secretsButton) secretsButton.classList.toggle("on", showSecrets);
    var block = R.querySelector("#mp-block");
    if (block) block.checked = blockMove;
    var radius = R.querySelector("#mp-lr");
    if (radius) radius.value = lightRadius;
  }
function setMode(nextMode) {
    appMode = nextMode === "editor" ? "editor" : "player";
    showGrid = appMode === "editor";
    showSecrets = appMode === "editor";
    showFog = appMode === "player";
    dynLight = appMode === "player";
    showWalls = true;
    blockMove = true;
    pendingStructureStart = null;
    pendingLocalPortal = null;
    pendingMonster = null;
    measurePts = null;
    selected = null;
    if (appMode === "player") {
      stopKeyMove();
      stopWorldTravel(false);
    }
    if (R) {
      setTool("select");
      updateModeUi();
      var inventoryOverlay = R.querySelector("#mp-inventory-overlay");
      if (inventoryOverlay && inventoryOverlay.classList.contains("open")) mountMapInventory(true);
      else if (mapInventoryInstance) {
        mapInventoryInstance.destruir();
        mapInventoryInstance = null;
        mapInventoryMode = null;
      }
      draw();
    }
  }
