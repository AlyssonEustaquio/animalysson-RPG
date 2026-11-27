function previewCell() {
    if (!previewPointer) return null;
    return worldToCell(previewPointer.x, previewPointer.y);
  }
function previewHoveredToken(cell) {
    if (!cell) return null;
    for (var i = state.tokens.length - 1; i >= 0; i--) {
      var t = state.tokens[i], sq = t.raio || 1;
      if (!isTokenVisible(t)) continue;
      if (cell.x >= t.x && cell.x < t.x + sq && cell.y >= t.y && cell.y < t.y + sq) return t;
    }
    return null;
  }
function previewEdge() {
    if (!previewPointer) return null;
    return nearestEdge(previewPointer.x, previewPointer.y);
  }
function previewDoorEdge() {
    if (isHexMap() || !previewPointer) return null;
    var gx = previewPointer.x / CELL, gy = previewPointer.y / CELL;
    var fx = Math.abs(gx - Math.round(gx)), fy = Math.abs(gy - Math.round(gy));
    if (Math.min(fx, fy) >= 0.12) return null;
    var edge = previewEdge(), value = edge ? getEdgeVal(edge) : EDGE_NONE;
    return isDoorEdge(value) ? edge : null;
  }
function drawPreviewCell(cell, fill, stroke) {
    if (!cell) return;
    cx.save();
    cx.setLineDash([5 / zoom, 3 / zoom]);
    if (isHexMap()) hexPath(cx, cellCenter(cell.x, cell.y), fill, stroke, 2 / zoom);
    else {
      cx.fillStyle = fill;
      cx.fillRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2);
      cx.strokeStyle = stroke;
      cx.lineWidth = 2 / zoom;
      cx.strokeRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2);
    }
    cx.setLineDash([]);
    cx.restore();
  }
function drawEdgePreview(edge, color, door) {
    if (!edge) return;
    var run = door && isDoorEdge(getEdgeVal(edge)) ? getDoorRun(edge) : [edge];
    var first = run[0], last = run[run.length - 1];
    cx.save();
    cx.strokeStyle = color;
    cx.fillStyle = color;
    cx.lineWidth = Math.max(4, 5 / zoom);
    cx.setLineDash([7 / zoom, 4 / zoom]);
    if (edge.dir === "h") {
      var x0 = first.x * CELL, y0 = first.yEdge * CELL;
      var x1 = (last.x + 1) * CELL;
      cx.beginPath();
      cx.moveTo(x0, y0);
      cx.lineTo(x1, y0);
      cx.stroke();
      if (door) {
        cx.setLineDash([]);
        cx.beginPath();
        cx.arc((x0 + x1) / 2, y0, 5 / zoom, 0, Math.PI * 2);
        cx.fill();
      }
    } else {
      var xx = first.xEdge * CELL, yy0 = first.y * CELL;
      var yy1 = (last.y + 1) * CELL;
      cx.beginPath();
      cx.moveTo(xx, yy0);
      cx.lineTo(xx, yy1);
      cx.stroke();
      if (door) {
        cx.setLineDash([]);
        cx.beginPath();
        cx.arc(xx, (yy0 + yy1) / 2, 5 / zoom, 0, Math.PI * 2);
        cx.fill();
      }
    }
    cx.restore();
  }
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
