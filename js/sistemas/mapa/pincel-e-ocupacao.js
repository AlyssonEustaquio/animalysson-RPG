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
function canStep(fromX, fromY, toX, toY, token, detectTouch) {
    if (!canOccupy(toX, toY, token)) return false;
    if (isHexMap()) return !!hexRoute({ x: fromX, y: fromY }, { x: toX, y: toY });
    if (Math.abs(toX - fromX) <= 1 && Math.abs(toY - fromY) <= 1) {
      var crossedEdges = edgesBetweenStep(fromX, fromY, toX, toY);
      if (detectTouch && token && token.tipo === "player") {
        crossedEdges.forEach(function(edge) {
          var val = getEdgeVal(edge), meta = getEdgeMeta(edge);
          if (val === EDGE_ILLUSION_WALL && meta && !meta.detected) {
            meta.detected = true;
            window.setTimeout(function() {
              if (cv) {
                save();
                draw();
                appAlertMessage("msg079", "Ao tocar a parede, você percebe que ela é uma ilusão e pode atravessá-la.");
              }
            }, 0);
          }
          if (val === EDGE_FORCE_WALL && meta && !meta.detected) {
            meta.detected = true;
            window.setTimeout(function() {
              if (cv) {
                save();
                draw();
                appAlertMessage("msg080", "Você toca uma barreira invisível: Muralha de Energia.");
              }
            }, 0);
          }
        });
      }
      if (crossedEdges.some(function(edge) {
        return getEdgeVal(edge) === EDGE_FORCE_WALL;
      })) return false;
      if (!blockMove) return true;
      if (blocksBetween(fromX, fromY, toX, toY)) return false;
      return true;
    }
    return !blockMove;
  }
function applyWallBrush(cx2, cy, val, radius) {
    var r = radius == null ? 0 : radius;
    if (!state.wallMeta) state.wallMeta = makeArr(COLS * ROWS, null);
    for (var dy = -r; dy <= r; dy++) {
      for (var dx = -r; dx <= r; dx++) {
        var x = cx2 + dx, y = cy + dy;
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
        var i = idx(x, y);
        state.walls[i] = val;
        if (val) {
          if (!state.wallMeta[i]) state.wallMeta[i] = makeStructureMeta("pedra", "wall", 2);
        } else state.wallMeta[i] = null;
      }
    }
  }
function applyFogBrush(cx2, cy, val) {
    for (var dy = -1; dy <= 1; dy++) {
      for (var dx = -1; dx <= 1; dx++) {
        var x = cx2 + dx, y = cy + dy;
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
        if (isHexMap() && hexDistance({ x: cx2, y: cy }, { x, y }) > 1) continue;
        state.fog[idx(x, y)] = val;
      }
    }
  }
function revealAround(cx2, cy, radius) {
    var r = Math.ceil(radius);
    for (var dy = -r; dy <= r; dy++) {
      for (var dx = -r; dx <= r; dx++) {
        if (isHexMap() ? hexDistance({ x: cx2, y: cy }, { x: cx2 + dx, y: cy + dy }) > radius : dx * dx + dy * dy > radius * radius + 0.5) continue;
        var x = cx2 + dx, y = cy + dy;
        if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
        if (hasLOS(cx2, cy, x, y)) state.fog[idx(x, y)] = 0;
      }
    }
  }
