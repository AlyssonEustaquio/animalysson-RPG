function drawFogAndLight(viewW, viewH) {
    var player = typeof currentPlayer === "function" ? currentPlayer() : state.tokens.find(function(t) {
      return t.tipo === "player";
    }) || state.tokens[0];
    var px = player ? player.x : -1;
    var py = player ? player.y : -1;
    var r = player ? (typeof creativeGetVisibilityRadius === "function" ? creativeGetVisibilityRadius(player, player.x, player.y) : player.luz || lightRadius) : 0;
    var fogBounds = visibleCellBounds(viewW, viewH);
    if (isHexMap()) {
      var hmFog = hexMetrics();
      cx.beginPath();
      for (var fy = fogBounds.y0; fy <= fogBounds.y1; fy++) for (var fx = fogBounds.x0; fx <= fogBounds.x1; fx++) {
        if (state.fog[idx(fx, fy)] && !isCurrentlyVisible(fx, fy, px, py, r)) appendHexPath(cx, cellCenter(fx, fy), hmFog);
      }
      cx.fillStyle = "rgba(0,0,0,1)";
      cx.fill();
      if (dynLight) {
        cx.beginPath();
        for (var dy = fogBounds.y0; dy <= fogBounds.y1; dy++) for (var dx = fogBounds.x0; dx <= fogBounds.x1; dx++) {
          if (!state.fog[idx(dx, dy)] && !isCurrentlyVisible(dx, dy, px, py, r)) appendHexPath(cx, cellCenter(dx, dy), hmFog);
        }
        cx.fillStyle = "rgba(0,0,0,0.5)";
        cx.fill();
      }
    } else {
      for (var y = fogBounds.y0; y <= fogBounds.y1; y++) for (var x = fogBounds.x0; x <= fogBounds.x1; x++) {
        if (isCurrentlyVisible(x, y, px, py, r)) continue;
        if (showFog && state.fog[idx(x, y)]) {
          cx.fillStyle = "rgba(0,0,0,1)";
          cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
        } else if (appMode !== "editor" && typeof creativeIsDarkCell === "function" && creativeIsDarkCell(x, y)) {
          cx.fillStyle = "rgba(0,0,0,0.84)";
          cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
        }
      }
    }
    // A visão do personagem continua sendo calculada por isCurrentlyVisible().
    // Removido somente o brilho radial desenhado sobre o token do jogador.
  }
function drawToken(t, sel) {
    var sq = t.raio || 1;
    var c = isHexMap() ? worldTravelPos && t === currentPlayer() ? worldTravelPos : cellCenter(t.x, t.y) : keyMoveVis && t === currentPlayer() ? keyMoveVis : cellCenter(t.x + (sq - 1) / 2, t.y + (sq - 1) / 2);
    var r = isHexMap() ? CELL * 0.31 * Math.max(1, Math.sqrt(sq)) : sq * CELL * 0.42;
    cx.beginPath();
    cx.arc(c.x, c.y, r, 0, Math.PI * 2);
    cx.fillStyle = t.cor || "#e57373";
    cx.fill();
    if (sel) {
      cx.strokeStyle = "#fff";
      cx.lineWidth = 3 / zoom;
      cx.stroke();
    } else {
      cx.strokeStyle = "rgba(0,0,0,0.55)";
      cx.lineWidth = 1.5 / zoom;
      cx.stroke();
    }
    cx.fillStyle = "#111";
    cx.font = "bold " + Math.max(10, (11 + sq * 2) / zoom) + "px sans-serif";
    cx.textAlign = "center";
    cx.textBaseline = "middle";
    cx.fillText((t.nome || "?").charAt(0).toUpperCase(), c.x, c.y + 1);
    combatDrawOverlay(t, c, r);
    if (t.hpMax != null && t.hp != null && t.hpMax > 0) {
      var pct = Math.max(0, Math.min(1, t.hp / t.hpMax));
      var bw = sq * CELL * 0.7, bh = 4 / zoom;
      var bx = c.x - bw / 2, by = c.y + r + 3 / zoom;
      cx.fillStyle = "rgba(0,0,0,0.6)";
      cx.fillRect(bx, by, bw, bh);
      cx.fillStyle = pct > 0.5 ? "#66bb6a" : pct > 0.25 ? "#ffb74d" : "#ef5350";
      cx.fillRect(bx, by, bw * pct, bh);
    }
  }
function updateDetailPanel() {
    var box = $("#mp-detail");
    if (!box) return;
    var t = selected;
    if (!t) {
      box.innerHTML = '<div class="mp-detail-empty">Selecione um token no mapa.</div>';
      return;
    }
    var hpHtml = "";
    if (t.hpMax != null) {
      hpHtml = '<div class="mp-hp-row"><label>PV <input type="number" id="mp-hp" value="' + (t.hp != null ? t.hp : t.hpMax) + '" min="0" style="width:56px"> / ' + t.hpMax + '</label><button type="button" id="mp-hp-full">Máx</button></div>';
    }
    var extra = "";
    var passiveHtml = t.tipo === "player" ? '<div class="mp-hp-row"><span>Percepção passiva: <b>' + (t.percepcaoPassiva != null ? Number(t.percepcaoPassiva) : 10) + '</b></span> <button type="button" id="mp-passive-perception">Editar</button></div>' : "";
    if (t.monsterId && window.MONSTERS) {
      var m = (window.MONSTERS || []).find(function(x) {
        return x.id === t.monsterId;
      });
      if (m) {
        extra = '<div class="mp-stat-grid"><span>CA <b>' + esc(m.classeArmadura) + "</b></span><span>PV <b>" + esc(m.pontosVida) + "</b></span><span>ND <b>" + esc(m.nd) + "</b></span><span>" + esc(m.tamanho) + " · " + esc(m.tipo) + "</span></div>";
        if (m.acoes && m.acoes.length) {
          extra += '<div class="mp-actions"><b>Ações</b><ul>' + m.acoes.slice(0, 4).map(function(a) {
            var desc = a.description || a.descricao || "";
            return "<li><b>" + esc(a.name || a.nome) + "</b>" + (desc ? ": " + esc(String(desc).slice(0, 110)) + (String(desc).length > 110 ? "…" : "") : "") + "</li>";
          }).join("") + "</ul></div>";
        }
      }
    }
    box.innerHTML = '<div class="mp-detail-head"><strong>' + esc(t.nome) + "</strong>" + (t.nd != null ? '<span class="card-tag">ND ' + esc(t.nd) + "</span>" : "") + "</div>" + hpHtml + passiveHtml + extra + '<div class="mp-detail-tools">' + (t.tipo !== "player" ? '<button type="button" id="mp-edit-tok">✎ Editar monstro/NPC</button><button type="button" id="mp-del-tok">Remover token</button>' : "") + "</div>";
    if (appMode === "editor" && combatAvailable()) {
      box.insertAdjacentHTML("beforeend", combatDetailHtml(t));
      combatDetailBind(box, t);
    }
    var hpIn = $("#mp-hp");
    if (hpIn) hpIn.onchange = function() {
      t.hp = +this.value;
      save();
      draw();
    };
    var passiveButton = $("#mp-passive-perception");
    if (passiveButton) passiveButton.onclick = function() {
      var value = numberPrompt("Valor de Sabedoria (Percepção) passiva do personagem:", t.percepcaoPassiva != null ? t.percepcaoPassiva : 10, 0, 40);
      if (value == null) return;
      t.percepcaoPassiva = value;
      save();
      draw();
    };
    var hpFull = $("#mp-hp-full");
    if (hpFull) hpFull.onclick = function() {
      t.hp = t.hpMax;
      save();
      draw();
    };
    var editTok = $("#mp-edit-tok");
    if (editTok) editTok.onclick = function() {
      openBestiary(t);
    };
    var del = $("#mp-del-tok");
    if (del) del.onclick = function() {
      state.tokens = state.tokens.filter(function(x) {
        return x !== t;
      });
      selected = null;
      save();
      draw();
    };
  }
