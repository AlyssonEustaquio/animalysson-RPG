function customEdgeAt(wx, wy, tolerance) {
    var list = state.customEdges || [], best = null, bestD = tolerance == null ? CELL * 0.22 : tolerance;
    list.forEach(function(item) {
      var ax = item.x1, ay = item.y1, bx = item.x2, by = item.y2;
      var dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
      var t = len2 ? Math.max(0, Math.min(1, ((wx - ax) * dx + (wy - ay) * dy) / len2)) : 0;
      var px = ax + t * dx, py = ay + t * dy, d = Math.sqrt((wx - px) * (wx - px) + (wy - py) * (wy - py));
      if (d < bestD) {
        bestD = d;
        best = { dir: "custom", custom: item };
      }
    });
    return best;
  }
function segmentCrosses(a, b, c, d) {
    function orient(p, q, r) {
      return (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
    }
    var o1 = orient(a, b, c), o2 = orient(a, b, d), o3 = orient(c, d, a), o4 = orient(c, d, b);
    return (o1 === 0 || o2 === 0 || o1 < 0 !== o2 < 0) && (o3 === 0 || o4 === 0 || o3 < 0 !== o4 < 0);
  }
function createCustomStructure(a, b, kind) {
    if (!a || !b || Math.abs(a.x - b.x) < 1 && Math.abs(a.y - b.y) < 1) {
      appAlertMessage("msg012", "Escolha dois cantos diferentes do grid.");
      return;
    }
    var val = kind === "muro" ? EDGE_MURO : kind === "porta" ? EDGE_DOOR_C : null;
    if (kind !== "muro" && kind !== "porta") {
      var map = { paredeSecreta: "secretWall", portaSecreta: "secretDoor", portaTrancada: "lockedDoor", portaEmperrada: "jammedDoor", paredeIlusoria: "illusionWall", muralhaForca: "forceWall", paredeMagica: "magicWall" };
      var temp = { dir: "custom", custom: { x1: a.x, y1: a.y, x2: b.x, y2: b.y, val: 0, meta: null } };
      createSpecialEdge(temp, map[kind]);
      if (temp.custom.val) {
        state.customEdges.push(temp.custom);
        save();
        draw();
      }
      return;
    }
    var item = { id: "line-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7), x1: a.x, y1: a.y, x2: b.x, y2: b.y, val, meta: null };
    state.customEdges.push(item);
    save();
    draw();
  }
function nearestEdge(wx, wy) {
    var gx = wx / CELL, gy = wy / CELL;
    var cx2 = Math.floor(gx), cy = Math.floor(gy);
    var fx = gx - cx2, fy = gy - cy;
    var distV = Math.min(fx, 1 - fx);
    var distH = Math.min(fy, 1 - fy);
    if (distV <= distH) {
      var xEdge = fx < 0.5 ? cx2 : cx2 + 1;
      var y = Math.max(0, Math.min(ROWS - 1, cy));
      xEdge = Math.max(0, Math.min(COLS, xEdge));
      return { dir: "v", xEdge, y };
    } else {
      var yEdge = fy < 0.5 ? cy : cy + 1;
      var x = Math.max(0, Math.min(COLS - 1, cx2));
      yEdge = Math.max(0, Math.min(ROWS, yEdge));
      return { dir: "h", x, yEdge };
    }
  }
function getEdgeVal(edge) {
    if (edge && edge.custom) return edge.custom.val || 0;
    if (edge.dir === "h") return getH(edge.x, edge.yEdge);
    return getV(edge.xEdge, edge.y);
  }
function setEdgeVal(edge, val) {
    if (edge && edge.custom) {
      edge.custom.val = val;
      if (!val && state.customEdges) {
        var ci = state.customEdges.indexOf(edge.custom);
        if (ci >= 0) state.customEdges.splice(ci, 1);
      }
      return;
    }
    if (edge.dir === "h") setH(edge.x, edge.yEdge, val);
    else setV(edge.xEdge, edge.y, val);
  }
function findEraseEdgeAt(wx, wy) {
    var eraseTolerance = Math.max(5 / zoom, 2);
    var edge = customEdgeAt(wx, wy, eraseTolerance);
    if (!edge) {
      var gx = wx / CELL, gy = wy / CELL;
      var distanceToGridEdge = Math.min(
        Math.abs(gx - Math.round(gx)) * CELL,
        Math.abs(gy - Math.round(gy)) * CELL
      );
      if (distanceToGridEdge <= eraseTolerance) {
        var legacyEdge = nearestEdge(wx, wy);
        if (getEdgeVal(legacyEdge) !== EDGE_NONE) edge = legacyEdge;
      }
    }
    return edge && getEdgeVal(edge) !== EDGE_NONE ? edge : null;
  }
function isDoorEdge(val) {
    return val === EDGE_DOOR_C || val === EDGE_DOOR_O || val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O || val === EDGE_LOCKED_DOOR || val === EDGE_JAMMED_DOOR;
  }
function getDoorRun(edge) {
    if (!edge || !isDoorEdge(getEdgeVal(edge))) return edge ? [edge] : [];
    var meta = getEdgeMeta(edge);
    var groupId = meta && meta.doorGroupId;
    if (!groupId) return [edge];
    var run = [];
    if (edge.dir === "h") {
      for (var x = 0; x < COLS; x++) {
        var candidate = { dir: "h", x, yEdge: edge.yEdge };
        var cm = getEdgeMeta(candidate);
        if (isDoorEdge(getEdgeVal(candidate)) && cm && cm.doorGroupId === groupId) run.push(candidate);
      }
    } else {
      for (var y = 0; y < ROWS; y++) {
        var candidateV = { dir: "v", xEdge: edge.xEdge, y };
        var vm = getEdgeMeta(candidateV);
        if (isDoorEdge(getEdgeVal(candidateV)) && vm && vm.doorGroupId === groupId) run.push(candidateV);
      }
    }
    return run.length ? run : [edge];
  }
function setDoorRunValue(edge, val) {
    getDoorRun(edge).forEach(function(part) {
      var meta = getEdgeMeta(part);
      setEdgeVal(part, val);
      if (meta) setEdgeMeta(part, meta);
    });
  }
function doorRunIsClosed(edge) {
    var run = getDoorRun(edge);
    return run.every(function(part) {
      return edgeBlocks(getEdgeVal(part), part);
    });
  }
