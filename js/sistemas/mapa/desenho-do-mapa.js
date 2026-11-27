function drawWorldPortals() {
    if (!isHexMap() || !Array.isArray(state.portals)) return;
    state.portals.forEach(function(portal) {
      if (!portal.destMapId) return;
      var center = cellCenter(portal.x, portal.y);
      var color = /^#[0-9a-f]{6}$/i.test(String(portal.color || "")) ? portal.color : "#36a9e1";
      cx.save();
      cx.globalAlpha = 0.4;
      hexPath(cx, center, null, color, 1 / zoom);
      cx.restore();
    });
  }
function drawLocalPortals() {
    if (!Array.isArray(state.portals)) return;
    function drawEndpoint(x, y, label, color) {
      var center = cellCenter(x, y);
      cx.save();
      cx.globalAlpha = 0.88;
      cx.strokeStyle = color;
      cx.fillStyle = color;
      cx.lineWidth = 2 / zoom;
      if (isHexMap()) {
        hexPath(cx, center, "rgba(30,170,220,0.12)", color, 2 / zoom);
      } else {
        cx.strokeRect(x * CELL + 2 / zoom, y * CELL + 2 / zoom, CELL - 4 / zoom, CELL - 4 / zoom);
      }
      cx.beginPath();
      cx.arc(center.x, center.y, (isHexMap() ? 7 : 6) / zoom, 0, Math.PI * 2);
      cx.fill();
      cx.globalAlpha = 1;
      cx.fillStyle = "#071018";
      cx.font = "bold " + 10 / zoom + "px sans-serif";
      cx.textAlign = "center";
      cx.textBaseline = "middle";
      cx.fillText(label, center.x, center.y);
      cx.restore();
    }
    state.portals.forEach(function(portal) {
      if (portal.destMapId || !isFinite(Number(portal.destX)) || !isFinite(Number(portal.destY))) return;
      var color = /^#[0-9a-f]{6}$/i.test(String(portal.color || "")) ? portal.color : "#36a9e1";
      drawEndpoint(portal.x, portal.y, "A", color);
      drawEndpoint(portal.destX, portal.destY, "B", color);
    });
    if (pendingLocalPortal) drawEndpoint(pendingLocalPortal.x, pendingLocalPortal.y, "A", "#ffd54f");
  }
function drawWorldTravelPath() {
    if (!isHexMap()) return;
    var player = currentPlayer();
    if (!player || !worldTravelPath.length && !worldTravelStep) return;
    var points = [];
    if (worldTravelStep) points.push(worldTravelStep.toPt);
    worldTravelPath.forEach(function(cell) {
      points.push(cellCenter(cell.x, cell.y));
    });
    if (!points.length) return;
    var start = worldTravelPos || cellCenter(player.x, player.y);
    cx.save();
    cx.strokeStyle = "rgba(255, 215, 75, 0.9)";
    cx.fillStyle = "rgba(255, 215, 75, 0.95)";
    cx.lineWidth = 3 / zoom;
    cx.setLineDash([7 / zoom, 5 / zoom]);
    cx.beginPath();
    cx.moveTo(start.x, start.y);
    points.forEach(function(pt) {
      cx.lineTo(pt.x, pt.y);
    });
    cx.stroke();
    var end = points[points.length - 1];
    cx.setLineDash([]);
    cx.beginPath();
    cx.arc(end.x, end.y, 9 / zoom, 0, Math.PI * 2);
    cx.stroke();
    cx.restore();
  }
function draw() {
    if (!cv || !cx) return;
    renderCombatHud();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = cv.clientWidth, H = cv.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    }
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (appMode !== "editor") {
      if (isHexMap()) focusCameraOnPlayer(W, H);
      else centerCameraOnPlayer(W, H);
    }
    cx.fillStyle = "#0a0a0b";
    cx.fillRect(0, 0, W, H);
    cx.save();
    cx.translate(ox, oy);
    cx.scale(zoom, zoom);
    var viewX0 = -ox / zoom, viewY0 = -oy / zoom, viewX1 = (W - ox) / zoom, viewY1 = (H - oy) / zoom;
    var partSeam = 0.5 / zoom;
    PARTS.forEach(function(p, i) {
      if (p.x > viewX1 || p.y > viewY1 || p.x + p.w < viewX0 || p.y + p.h < viewY0) return;
      var img = bgImages[i];
      var partW = p.w + (p.x + p.w < MAP_W ? partSeam : 0), partH = p.h + (p.y + p.h < MAP_H ? partSeam : 0);
      if (img && img.complete && img.naturalWidth) cx.drawImage(img, p.x, p.y, partW, partH);
      else {
        cx.fillStyle = "#1a1a1c";
        cx.fillRect(p.x, p.y, partW, partH);
      }
    });
    if (isHexMap()) drawDetail(W, H);
    if (!isHexMap() && typeof creativeDrawLayer === "function") creativeDrawLayer(W, H);
    if (showWalls && !isHexMap()) {
      var wallBounds = visibleCellBounds(W, H);
      if (isHexMap()) {
        var hmWalls = hexMetrics();
        cx.beginPath();
        for (var wy = wallBounds.y0; wy <= wallBounds.y1; wy++) for (var wx = wallBounds.x0; wx <= wallBounds.x1; wx++) {
          if (state.walls[idx(wx, wy)]) appendHexPath(cx, cellCenter(wx, wy), hmWalls);
        }
        cx.fillStyle = "rgba(180, 40, 40, 0.45)";
        cx.fill();
      } else {
        cx.fillStyle = "rgba(180, 40, 40, 0.45)";
        for (var y = wallBounds.y0; y <= wallBounds.y1; y++) for (var x = wallBounds.x0; x <= wallBounds.x1; x++) {
          if (state.walls[idx(x, y)]) cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
        }
      }
    }
    if (showWalls && !isHexMap()) {
      drawEdges();
    }
    if (showGrid) {
      cx.strokeStyle = "rgba(255,255,255,0.50)";
      cx.lineWidth = 1 / zoom;
      if (isHexMap()) {
        var gridBounds = visibleCellBounds(W, H), hmGrid = hexMetrics();
        cx.beginPath();
        for (var hy = gridBounds.y0; hy <= gridBounds.y1; hy++) {
          for (var hx = gridBounds.x0; hx <= gridBounds.x1; hx++) appendHexPath(cx, cellCenter(hx, hy), hmGrid);
        }
        cx.strokeStyle = "rgba(0,0,0,0.10)";
        cx.lineWidth = 1 / zoom;
        cx.stroke();
      } else {
        cx.beginPath();
        for (var gx = 0; gx <= COLS; gx++) {
          cx.moveTo(gx * CELL, 0);
          cx.lineTo(gx * CELL, ROWS * CELL);
        }
        for (var gy = 0; gy <= ROWS; gy++) {
          cx.moveTo(0, gy * CELL);
          cx.lineTo(COLS * CELL, gy * CELL);
        }
        cx.stroke();
      }
    }
    if (showFog && !isHexMap()) drawFogAndLight(W, H);
    if (!isHexMap() && typeof creativeDrawLights === "function") creativeDrawLights(W, H);
    if (selected && !isTokenVisible(selected)) selected = null;
    state.tokens.forEach(function(t) {
      if (isTokenVisible(t)) drawToken(t, t === selected);
    });
    drawLocalPortals();
    if (!isHexMap() && typeof creativeDrawSelectionOverlay === "function") creativeDrawSelectionOverlay();
    if (!isHexMap()) {
      drawToolPreview();
      if (typeof creativeDrawPreview === "function") creativeDrawPreview();
    } else {
      drawWorldTravelPath();
      drawWorldPortals();
    }
    if (measurePts && measurePts.length === 2) {
      var a = cellCenter(measurePts[0].x, measurePts[0].y);
      var b = cellCenter(measurePts[1].x, measurePts[1].y);
      cx.strokeStyle = "#ffeb3b";
      cx.lineWidth = 2 / zoom;
      cx.setLineDash(isHexMap() ? [] : [6 / zoom, 4 / zoom]);
      if (isHexMap()) {
        var routeCells = hexRoute(measurePts[0], measurePts[1]);
        if (routeCells) {
          cx.beginPath();
          routeCells.forEach(function(part, i) {
            var pt = cellCenter(part.x, part.y);
            if (!i) cx.moveTo(pt.x, pt.y);
            else cx.lineTo(pt.x, pt.y);
          });
          cx.stroke();
        } else {
          cx.strokeStyle = "#ef5350";
          cx.setLineDash([6 / zoom, 4 / zoom]);
          cx.beginPath();
          cx.moveTo(a.x, a.y);
          cx.lineTo(b.x, b.y);
          cx.stroke();
          cx.setLineDash([]);
        }
      } else {
        cx.beginPath();
        cx.moveTo(a.x, a.y);
        cx.lineTo(b.x, b.y);
        cx.stroke();
      }
      cx.setLineDash([]);
      var distanceLabel = formatMapDistance(measurePts[0], measurePts[1]);
      var mid;
      if (isHexMap() && routeCells && routeCells.length) mid = cellCenter(routeCells[Math.floor((routeCells.length - 1) / 2)].x, routeCells[Math.floor((routeCells.length - 1) / 2)].y);
      else mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      cx.fillStyle = "rgba(0,0,0,0.75)";
      cx.font = 14 / zoom + "px sans-serif";
      cx.textAlign = "center";
      cx.fillText(distanceLabel, mid.x, mid.y - 8 / zoom);
    }
    cx.restore();
    updateDetailPanel();
  }
function drawEdges() {
    var lw = Math.max(2.5, 3.5 / zoom);
    function drawOne(edge, val) {
      if (val === EDGE_NONE || edgeIsHidden(edge, val)) return;
      var meta = getEdgeMeta(edge) || {};
      if (appMode === "player" && (val === EDGE_MURO || val === EDGE_ILLUSION_WALL && !meta.detected)) return;
      if (val === EDGE_SECRET_WALL && meta.open) return;
      var a, b;
      if (edge.dir === "h") {
        a = { x: edge.x * CELL, y: edge.yEdge * CELL };
        b = { x: (edge.x + 1) * CELL, y: edge.yEdge * CELL };
      } else {
        a = { x: edge.xEdge * CELL, y: edge.y * CELL };
        b = { x: edge.xEdge * CELL, y: (edge.y + 1) * CELL };
      }
      var isDoor = isDoorEdge(val);
      var opened = val === EDGE_DOOR_O || val === EDGE_SECRET_DOOR_O || !!meta.open;
      var color = "#c62828", width = lw, dash = [];
      if (val === EDGE_SECRET_WALL) {
        color = "#ab47bc";
        dash = [5 / zoom, 3 / zoom];
      } else if (val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) color = opened ? "rgba(142,36,170,0.38)" : "#8e24aa";
      else if (val === EDGE_LOCKED_DOOR) color = opened ? "#81c784" : "#42a5f5";
      else if (val === EDGE_JAMMED_DOOR) color = opened ? "#81c784" : "#ff8f00";
      else if (val === EDGE_ILLUSION_WALL) {
        if (meta.detected) {
          color = "#26c6da";
          dash = [3 / zoom, 4 / zoom];
        } else color = "#c62828";
      } else if (val === EDGE_FORCE_WALL) {
        color = "#80deea";
        width = lw * 1.5;
        dash = [2 / zoom, 3 / zoom];
      } else if (val === EDGE_MAGIC_WALL) {
        color = "#7e57c2";
        width = lw * 1.5;
      } else if (val === EDGE_MURO) color = "#c62828";
      else if (isDoor) {
        color = opened ? "rgba(141,110,99,0.45)" : "#8d6e63";
        if (opened) dash = [6 / zoom, 4 / zoom];
      }
      cx.save();
      cx.strokeStyle = color;
      cx.lineWidth = width;
      if ((val === EDGE_SECRET_DOOR_O || isDoor && opened) && !dash.length) dash = [6 / zoom, 4 / zoom];
      if (dash.length) cx.setLineDash(dash);
      cx.beginPath();
      cx.moveTo(a.x, a.y);
      cx.lineTo(b.x, b.y);
      cx.stroke();
      cx.setLineDash([]);
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      if (isDoor) {
        cx.fillStyle = color;
        cx.beginPath();
        cx.arc(mx, my, 4.5 / zoom, 0, Math.PI * 2);
        cx.fill();
        if (val === EDGE_LOCKED_DOOR && !opened) {
          cx.fillStyle = "#e3f2fd";
          cx.font = "bold " + 10 / zoom + "px sans-serif";
          cx.textAlign = "center";
          cx.fillText("🔒", mx, my - 7 / zoom);
        }
        if ((val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) && meta.detected) {
          cx.fillStyle = "#f3e5f5";
          cx.font = "bold " + 9 / zoom + "px sans-serif";
          cx.textAlign = "center";
          cx.fillText("✦", mx, my - 7 / zoom);
        }
      } else if (val === EDGE_SECRET_WALL || val === EDGE_FORCE_WALL || val === EDGE_MAGIC_WALL || val === EDGE_ILLUSION_WALL && meta.detected) {
        cx.fillStyle = color;
        cx.beginPath();
        cx.arc(mx, my, 3.5 / zoom, 0, Math.PI * 2);
        cx.fill();
      }
      cx.restore();
    }
    for (var ye = 0; ye <= ROWS; ye++) for (var x = 0; x < COLS; x++) drawOne({ dir: "h", x, yEdge: ye }, getH(x, ye));
    for (var y = 0; y < ROWS; y++) for (var xe = 0; xe <= COLS; xe++) drawOne({ dir: "v", xEdge: xe, y }, getV(xe, y));
    (state.customEdges || []).forEach(function(item) {
      var val = item.val, meta = item.meta || {};
      if (!val || edgeIsHidden({ custom: item }, val)) return;
      if (val === EDGE_SECRET_WALL && meta.open) return;
      if (appMode === "player" && (val === EDGE_MURO || val === EDGE_ILLUSION_WALL && !meta.detected)) return;
      var isDoor = isDoorEdge(val), opened = val === EDGE_DOOR_O || val === EDGE_SECRET_DOOR_O || !!meta.open;
      var color = val === EDGE_MURO ? "#c62828" : val === EDGE_SECRET_WALL ? "#ab47bc" : val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O ? "#8e24aa" : val === EDGE_LOCKED_DOOR ? "#42a5f5" : val === EDGE_JAMMED_DOOR ? "#ff8f00" : val === EDGE_ILLUSION_WALL ? "#26c6da" : val === EDGE_FORCE_WALL ? "#80deea" : val === EDGE_MAGIC_WALL ? "#7e57c2" : opened ? "rgba(141,110,99,0.45)" : "#8d6e63";
      cx.save();
      cx.strokeStyle = color;
      cx.lineWidth = Math.max(2.5, 3.5 / zoom);
      if (val === EDGE_SECRET_WALL || val === EDGE_FORCE_WALL || val === EDGE_ILLUSION_WALL || opened) cx.setLineDash([6 / zoom, 4 / zoom]);
      cx.beginPath();
      cx.moveTo(item.x1, item.y1);
      cx.lineTo(item.x2, item.y2);
      cx.stroke();
      cx.setLineDash([]);
      if (isDoor) {
        cx.fillStyle = color;
        cx.beginPath();
        cx.arc((item.x1 + item.x2) / 2, (item.y1 + item.y2) / 2, 4.5 / zoom, 0, Math.PI * 2);
        cx.fill();
      }
      cx.restore();
    });
  }
