function drawToolPreview() {
    if (!previewPointer || !cv) return;
    var cell = previewCell();
    var edge = previewEdge();
    var center = cellCenter(cell.x, cell.y);
    var ghost;
    if (tool === "eraseedge") {
      var erasePreviewEdge = findEraseEdgeAt(previewPointer.x, previewPointer.y);
      if (erasePreviewEdge) {
        if (erasePreviewEdge.custom) {
          var eraseItem = erasePreviewEdge.custom;
          cx.save();
          cx.strokeStyle = "#ff1744";
          cx.fillStyle = "#ff1744";
          cx.lineWidth = Math.max(7, 9 / zoom);
          cx.setLineDash([8 / zoom, 4 / zoom]);
          cx.shadowColor = "rgba(255, 23, 68, 0.95)";
          cx.shadowBlur = 10 / zoom;
          cx.beginPath();
          cx.moveTo(eraseItem.x1, eraseItem.y1);
          cx.lineTo(eraseItem.x2, eraseItem.y2);
          cx.stroke();
          cx.setLineDash([]);
          var eraseMidX = (eraseItem.x1 + eraseItem.x2) / 2;
          var eraseMidY = (eraseItem.y1 + eraseItem.y2) / 2;
          cx.beginPath();
          cx.arc(eraseMidX, eraseMidY, 5 / zoom, 0, Math.PI * 2);
          cx.fill();
          cx.restore();
        } else {
          drawEdgePreview(erasePreviewEdge, "#ff1744", false);
        }
      }
      return;
    }
    var lineTools = ["muro", "porta", "paredeSecreta", "portaSecreta", "portaTrancada", "portaEmperrada", "paredeIlusoria", "muralhaForca", "paredeMagica"];
    if (lineTools.indexOf(tool) >= 0) {
      var target = snapGridPoint(previewPointer.x, previewPointer.y);
      var start = pendingStructureStart || target;
      var lineColor = tool === "porta" || tool.indexOf("porta") === 0 ? "#ffb74d" : tool === "paredeSecreta" ? "#ab47bc" : tool === "paredeIlusoria" ? "#26c6da" : tool === "muralhaForca" ? "#80deea" : tool === "paredeMagica" ? "#7e57c2" : tool === "eraseedge" ? "#80deea" : "#ff5252";
      cx.save();
      cx.strokeStyle = lineColor;
      cx.fillStyle = lineColor;
      cx.lineWidth = Math.max(4, 5 / zoom);
      cx.setLineDash([7 / zoom, 4 / zoom]);
      cx.beginPath();
      cx.moveTo(start.x, start.y);
      cx.lineTo(target.x, target.y);
      cx.stroke();
      cx.setLineDash([]);
      cx.beginPath();
      cx.arc(start.x, start.y, 5 / zoom, 0, Math.PI * 2);
      cx.fill();
      cx.beginPath();
      cx.arc(target.x, target.y, 5 / zoom, 0, Math.PI * 2);
      cx.fill();
      cx.restore();
      return;
    }
    if (tool === "wall") drawPreviewCell(cell, "rgba(229,57,53,0.38)", "#ff5252");
    else if (tool === "erasewall") drawPreviewCell(cell, "rgba(102,187,106,0.28)", "#81c784");
    else if (tool === "reveal" || tool === "hide") {
      cx.save();
      cx.fillStyle = tool === "reveal" ? "rgba(255,235,59,0.22)" : "rgba(0,0,0,0.5)";
      cx.strokeStyle = tool === "reveal" ? "#fff176" : "#b0bec5";
      cx.lineWidth = 2 / zoom;
      cx.setLineDash([5 / zoom, 3 / zoom]);
      if (isHexMap()) {
        for (var fy = cell.y - 1; fy <= cell.y + 1; fy++) for (var fx = cell.x - 1; fx <= cell.x + 1; fx++) {
          var fc = { x: fx, y: fy };
          if (fx >= 0 && fy >= 0 && fx < COLS && fy < ROWS && hexDistance(cell, fc) <= 1) hexPath(cx, cellCenter(fx, fy), cx.fillStyle, cx.strokeStyle, cx.lineWidth);
        }
      } else {
        cx.fillRect((cell.x - 1) * CELL, (cell.y - 1) * CELL, CELL * 3, CELL * 3);
        cx.strokeRect((cell.x - 1) * CELL, (cell.y - 1) * CELL, CELL * 3, CELL * 3);
      }
      cx.restore();
    } else if (tool === "spawn") {
      var player = currentPlayer();
      var radius = player && player.luz || lightRadius;
      cx.save();
      cx.fillStyle = "rgba(255,213,79,0.08)";
      cx.strokeStyle = "rgba(255,213,79,0.9)";
      cx.lineWidth = 2 / zoom;
      cx.setLineDash([8 / zoom, 5 / zoom]);
      cx.beginPath();
      cx.arc(center.x, center.y, radius * CELL, 0, Math.PI * 2);
      cx.fill();
      cx.stroke();
      cx.restore();
      ghost = { nome: "J", tipo: "player", x: cell.x, y: cell.y, cor: "#4fc3f7", raio: 1 };
      cx.save();
      cx.globalAlpha = 0.55;
      drawToken(ghost, false);
      cx.restore();
    } else if (tool === "token") {
      var m = pendingMonster;
      ghost = m ? {
        nome: m.nome,
        tipo: "npc",
        x: cell.x,
        y: cell.y,
        cor: colorForMonster(m),
        raio: sizeSquares(m),
        hp: m.pontosVida,
        hpMax: m.pontosVida
      } : { nome: "?", tipo: "npc", x: cell.x, y: cell.y, cor: "#e57373", raio: 1 };
      cx.save();
      cx.globalAlpha = 0.48;
      drawToken(ghost, false);
      cx.restore();
    } else if (tool === "measure") {
      if (measurePts && measurePts.length === 1) {
        var start = cellCenter(measurePts[0].x, measurePts[0].y);
        var distanceLabel = formatMapDistance(measurePts[0], cell);
        cx.save();
        cx.strokeStyle = "#ffeb3b";
        cx.lineWidth = 2 / zoom;
        cx.setLineDash(isHexMap() ? [] : [6 / zoom, 4 / zoom]);
        var liveRoute = null;
        if (isHexMap()) {
          liveRoute = hexRoute(measurePts[0], cell);
          if (liveRoute) {
            cx.beginPath();
            liveRoute.forEach(function(part, i) {
              var pt = cellCenter(part.x, part.y);
              if (!i) cx.moveTo(pt.x, pt.y);
              else cx.lineTo(pt.x, pt.y);
            });
            cx.stroke();
          } else {
            cx.strokeStyle = "#ef5350";
            cx.setLineDash([6 / zoom, 4 / zoom]);
            cx.beginPath();
            cx.moveTo(start.x, start.y);
            cx.lineTo(center.x, center.y);
            cx.stroke();
          }
        } else {
          cx.beginPath();
          cx.moveTo(start.x, start.y);
          cx.lineTo(center.x, center.y);
          cx.stroke();
        }
        cx.setLineDash([]);
        cx.fillStyle = "rgba(0,0,0,0.8)";
        cx.font = 14 / zoom + "px sans-serif";
        cx.textAlign = "center";
        var liveMid = isHexMap() && liveRoute && liveRoute.length ? cellCenter(liveRoute[Math.floor((liveRoute.length - 1) / 2)].x, liveRoute[Math.floor((liveRoute.length - 1) / 2)].y) : { x: (start.x + center.x) / 2, y: (start.y + center.y) / 2 };
        cx.fillText(distanceLabel, liveMid.x, liveMid.y - 8 / zoom);
        cx.restore();
      } else drawPreviewCell(cell, "rgba(255,235,59,0.14)", "#ffeb3b");
    } else if (tool === "select") {
      var doorEdge = previewDoorEdge();
      var hovered = previewHoveredToken(cell);
      if (doorEdge) drawEdgePreview(doorEdge, "#ffb74d", true);
      else if (hovered) {
        var sq = hovered.raio || 1;
        cx.save();
        cx.strokeStyle = "#ffeb3b";
        cx.lineWidth = 3 / zoom;
        cx.setLineDash([5 / zoom, 3 / zoom]);
        if (isHexMap()) hexPath(cx, cellCenter(hovered.x, hovered.y), null, "#ffeb3b", 3 / zoom);
        else cx.strokeRect(hovered.x * CELL + 2, hovered.y * CELL + 2, sq * CELL - 4, sq * CELL - 4);
        cx.restore();
      } else drawPreviewCell(cell, "rgba(255,255,255,0.05)", "rgba(255,255,255,0.65)");
    }
  }

function drawFogAndLight(viewW, viewH) {
    var player = state.tokens.find(function(t) {
      return t.tipo === "player";
    }) || state.tokens[0];
    var px = player ? player.x : -1;
    var py = player ? player.y : -1;
    var r = player ? player.luz || lightRadius : 0;
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
        if (state.fog[idx(x, y)]) {
          cx.fillStyle = "rgba(0,0,0,1)";
          cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
        } else if (dynLight) {
          cx.fillStyle = "rgba(0,0,0,0.5)";
          cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
        }
      }
    }
    if (dynLight && player) {
      var c = !isHexMap() && keyMoveVis && player === currentPlayer() ? keyMoveVis : cellCenter(px, py);
      var rPx = r * CELL;
      var grd = cx.createRadialGradient(c.x, c.y, rPx * 0.12, c.x, c.y, rPx);
      grd.addColorStop(0, "rgba(255,220,140,0.16)");
      grd.addColorStop(0.65, "rgba(255,180,80,0.05)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      cx.fillStyle = grd;
      cx.beginPath();
      cx.arc(c.x, c.y, rPx, 0, Math.PI * 2);
      cx.fill();
    }
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

var bestiaryHooked = false;

function bestiaryContext(token) {
    return {
      token: token || null,
      tokens: function() {
        return state.tokens || [];
      },
      sizeSquares,
      place: function(id) {
        var m = (window.MONSTERS || []).find(function(x) {
          return x.id === id;
        });
        if (!m) return;
        pendingMonster = m;
        setTool("token");
        setMenu(false);
      },
      changed: function() {
        save();
        draw();
        updateDetailPanel();
      }
    };
  }

function openBestiary(token) {
    if (!window.Bestiary) return;
    var id = token && token.monsterId ? token.monsterId : pendingMonster ? pendingMonster.id : null;
    window.Bestiary.open({ id, ctx: bestiaryContext(token) });
  }

function renderMonsterList(query) {
    var list = $("#mp-ml");
    if (!list) return;
    var q = (query || "").trim().toLowerCase();
    var monsters = window.MONSTERS || [];
    var filtered = monsters.filter(function(m) {
      if (!q) return true;
      return [m.nome, m.nomeEn, m.tipo, m.nd, m.id].join(" ").toLowerCase().indexOf(q) >= 0;
    }).slice(0, 50);
    if (!monsters.length) {
      list.innerHTML = "<small>Carregando bestiário…</small>";
      return;
    }
    if (!filtered.length) {
      list.innerHTML = "<small>Nenhum monstro encontrado.</small>";
      return;
    }
    list.innerHTML = filtered.map(function(m) {
      return '<button type="button" class="mp-mbtn" data-id="' + esc(m.id) + '"><span class="mp-mn">' + esc(m.nome) + "</span><small>ND " + esc(m.nd) + " · " + esc(m.tamanho) + "</small></button>";
    }).join("");
  }

function placeMonsterFromId(id, cell) {
    var m = (window.MONSTERS || []).find(function(x) {
      return x.id === id;
    });
    if (!m) return;
    if (blockMove && isCellWall(cell.x, cell.y)) return;
    var sq = sizeSquares(m);
    var tok = {
      id: "t" + Date.now().toString(36),
      monsterId: m.id,
      nome: m.nome,
      tipo: "npc",
      x: cell.x,
      y: cell.y,
      cor: colorForMonster(m),
      raio: sq,
      luz: 0,
      nd: m.nd,
      hp: m.pontosVida,
      hpMax: m.pontosVida
    };
    state.tokens.push(tok);
    if (combatActive()) getCombat().entrarNoCombate(tok);
    selected = tok;
    pendingMonster = null;
    setTool("select");
    save();
    draw();
  }

function canOccupy(x, y, token) {
    var sq = token && token.raio || 1;
    if (x < 0 || y < 0 || x + sq > COLS || y + sq > ROWS) return false;
    if (!blockMove) return true;
    for (var dy = 0; dy < sq; dy++) {
      for (var dx = 0; dx < sq; dx++) {
        if (isCellWall(x + dx, y + dy)) return false;
      }
    }
    return true;
  }

function edgesBetweenStep(x0, y0, x1, y1) {
    var found = [];
    if (x0 !== x1 && y0 !== y1) {
      found.push({ dir: "v", xEdge: Math.max(x0, x1), y: y0 });
      found.push({ dir: "h", x: x0, yEdge: Math.max(y0, y1) });
    } else if (x0 !== x1) found.push({ dir: "v", xEdge: Math.max(x0, x1), y: y0 });
    else if (y0 !== y1) found.push({ dir: "h", x: x0, yEdge: Math.max(y0, y1) });
    return found;
  }
