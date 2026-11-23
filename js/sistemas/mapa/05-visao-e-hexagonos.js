function blocksBetween(x0, y0, x1, y1) {
    if (x0 === x1 && y0 === y1) return false;
    var moveA = { x: (x0 + 0.5) * CELL, y: (y0 + 0.5) * CELL }, moveB = { x: (x1 + 0.5) * CELL, y: (y1 + 0.5) * CELL };
    if ((state.customEdges || []).some(function(e) {
      return edgeBlocks(e.val, { custom: e }) && segmentCrosses(moveA, moveB, { x: e.x1, y: e.y1 }, { x: e.x2, y: e.y2 });
    })) return true;
    if (isCellWall(x1, y1)) return true;
    if (y0 === y1) {
      var vertical = { dir: "v", xEdge: x1 > x0 ? x1 : x0, y: y0 };
      return edgeBlocks(getEdgeVal(vertical), vertical);
    }
    if (x0 === x1) {
      var horizontal = { dir: "h", x: x0, yEdge: y1 > y0 ? y1 : y0 };
      return edgeBlocks(getEdgeVal(horizontal), horizontal);
    }
    return blocksBetween(x0, y0, x1, y0) || blocksBetween(x0, y0, x0, y1);
  }

function edgeBlocksVision(val, edge) {
    if (val === EDGE_FORCE_WALL || val === EDGE_NONE) return false;
    if (val === EDGE_ILLUSION_WALL) {
      var illusionMeta = getEdgeMeta(edge);
      return !(illusionMeta && illusionMeta.detected);
    }
    return edgeBlocks(val, edge);
  }

function blocksVisionBetween(x0, y0, x1, y1) {
    if (x0 === x1 && y0 === y1) return false;
    var sightA = { x: (x0 + 0.5) * CELL, y: (y0 + 0.5) * CELL }, sightB = { x: (x1 + 0.5) * CELL, y: (y1 + 0.5) * CELL };
    if ((state.customEdges || []).some(function(e) {
      return edgeBlocksVision(e.val, { custom: e }) && segmentCrosses(sightA, sightB, { x: e.x1, y: e.y1 }, { x: e.x2, y: e.y2 });
    })) return true;
    if (isCellWall(x1, y1)) return true;
    if (y0 === y1) {
      var vertical = { dir: "v", xEdge: x1 > x0 ? x1 : x0, y: y0 };
      return edgeBlocksVision(getEdgeVal(vertical), vertical);
    }
    if (x0 === x1) {
      var horizontal = { dir: "h", x: x0, yEdge: y1 > y0 ? y1 : y0 };
      return edgeBlocksVision(getEdgeVal(horizontal), horizontal);
    }
    return blocksVisionBetween(x0, y0, x1, y0) || blocksVisionBetween(x0, y0, x0, y1);
  }

function sizeSquares(m) {
    if (!m) return 1;
    var s = m.tamanhoEn || m.tamanho || "Medium";
    return SIZE_SQ[s] || 1;
  }

function colorForMonster(m) {
    if (!m) return "#e57373";
    var t = (m.tipoEn || m.tipo || "").toLowerCase();
    if (t.indexOf("undead") >= 0 || t.indexOf("morto") >= 0) return "#b39ddb";
    if (t.indexOf("dragon") >= 0 || t.indexOf("dragão") >= 0) return "#ef5350";
    if (t.indexOf("beast") >= 0 || t.indexOf("fera") >= 0) return "#81c784";
    if (t.indexOf("fiend") >= 0 || t.indexOf("demônio") >= 0 || t.indexOf("diabo") >= 0) return "#e53935";
    if (t.indexOf("celestial") >= 0) return "#ffd54f";
    if (t.indexOf("construct") >= 0 || t.indexOf("constructo") >= 0) return "#90a4ae";
    if (t.indexOf("elemental") >= 0) return "#4dd0e1";
    if (t.indexOf("ooze") >= 0 || t.indexOf("gosma") >= 0) return "#aed581";
    if (t.indexOf("plant") >= 0 || t.indexOf("planta") >= 0) return "#66bb6a";
    return "#e57373";
  }

function hasLOS(x0, y0, x1, y1) {
    if (isHexMap()) {
      var path = hexLine({ x: x0, y: y0 }, { x: x1, y: y1 });
      for (var hi = 1; hi < path.length - 1; hi++) {
        if (isCellWall(path[hi].x, path[hi].y)) return false;
      }
      return !isCellWall(x1, y1);
    }
    if (x0 === x1 && y0 === y1) return true;
    if (isCellWall(x1, y1) && !(x1 === x0 && y1 === y0)) return false;
    var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    var sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    var err = dx - dy;
    var x = x0, y = y0;
    while (!(x === x1 && y === y1)) {
      var e2 = 2 * err;
      var stepX = e2 > -dy;
      var stepY = e2 < dx;
      var nx = x, ny = y;
      if (stepX) {
        err -= dy;
        nx = x + sx;
      }
      if (stepY) {
        err += dx;
        ny = y + sy;
      }
      if (nx !== x && ny !== y) {
        if (blocksVisionBetween(x, y, nx, y) || blocksVisionBetween(x, y, x, ny)) return false;
        if (blocksVisionBetween(nx, y, nx, ny) || blocksVisionBetween(x, ny, nx, ny)) return false;
        if (isCellWall(nx, y) || isCellWall(x, ny)) return false;
      } else {
        if (blocksVisionBetween(x, y, nx, ny)) return false;
      }
      x = nx;
      y = ny;
      if (!(x === x1 && y === y1) && isCellWall(x, y)) return false;
    }
    return true;
  }

function loadBackgrounds(cb) {
    bgImages = [];
    bgReady = 0;
    PARTS.forEach(function(p, i) {
      var img = new Image();
      img.onload = function() {
        bgReady++;
        if (bgReady === PARTS.length && cb) cb();
        draw();
      };
      img.onerror = function() {
        bgReady++;
        draw();
      };
      img.src = p.localSrc || p.src;
      bgImages[i] = img;
    });
  }

function screenToWorld(sx, sy) {
    return { x: (sx - ox) / zoom, y: (sy - oy) / zoom };
  }

function offsetToAxial(col, row) {
    return { q: col - (row - (row & 1)) / 2, r: row };
  }

function axialToOffset(q, r) {
    return { x: q + (r - (r & 1)) / 2, y: r };
  }

function hexDistance(a, b) {
    var aa = offsetToAxial(a.x, a.y), bb = offsetToAxial(b.x, b.y);
    var dq = bb.q - aa.q, dr = bb.r - aa.r;
    return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
  }

function hexLine(a, b) {
    var aa = offsetToAxial(a.x, a.y), bb = offsetToAxial(b.x, b.y);
    var n = hexDistance(a, b), out = [];
    if (!n) return [{ x: a.x, y: a.y }];
    var ax = aa.q, az = aa.r, ay = -ax - az;
    var bx = bb.q, bz = bb.r, by = -bx - bz;
    for (var i = 0; i <= n; i++) {
      var t = i / n;
      var x = ax + (bx - ax) * t, y = ay + (by - ay) * t, z = az + (bz - az) * t;
      var rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);
      var dx = Math.abs(rx - x), dy = Math.abs(ry - y), dz = Math.abs(rz - z);
      if (dx > dy && dx > dz) rx = -ry - rz;
      else if (dy > dz) ry = -rx - rz;
      else rz = -rx - ry;
      var cell = axialToOffset(rx, rz);
      if (!out.length || out[out.length - 1].x !== cell.x || out[out.length - 1].y !== cell.y) out.push(cell);
    }
    return out;
  }

function heapPush(heap, item) {
    var i = heap.length;
    heap.push(item);
    while (i > 0) {
      var p = i - 1 >> 1;
      if (heap[p].f <= item.f) break;
      heap[i] = heap[p];
      i = p;
    }
    heap[i] = item;
  }

function heapPop(heap) {
    if (!heap.length) return null;
    var root = heap[0], last = heap.pop();
    if (heap.length) {
      var i = 0;
      while (true) {
        var l = i * 2 + 1, r = l + 1;
        if (l >= heap.length) break;
        var c = r < heap.length && heap[r].f < heap[l].f ? r : l;
        if (heap[c].f >= last.f) break;
        heap[i] = heap[c];
        i = c;
      }
      heap[i] = last;
    }
    return root;
  }

function hexRoute(start, end) {
    if (!isHexMap()) return [start, end];
    return hexLine(start, end);
  }

function appendHexPath(ctx, center, hm) {
    var w = hm.width, h = hm.height;
    ctx.moveTo(center.x, center.y - h / 2);
    ctx.lineTo(center.x + w / 2, center.y - h / 4);
    ctx.lineTo(center.x + w / 2, center.y + h / 4);
    ctx.lineTo(center.x, center.y + h / 2);
    ctx.lineTo(center.x - w / 2, center.y + h / 4);
    ctx.lineTo(center.x - w / 2, center.y - h / 4);
    ctx.closePath();
  }

function hexPath(ctx, center, fill, stroke, lineWidth) {
    var hm = hexMetrics();
    if (!hm) return;
    ctx.beginPath();
    appendHexPath(ctx, center, hm);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth || 1 / zoom;
      ctx.stroke();
    }
  }

function visibleCellBounds(viewW, viewH) {
    if (!isHexMap()) return { x0: 0, x1: COLS - 1, y0: 0, y1: ROWS - 1 };
    var hm = hexMetrics();
    var left = -ox / zoom, right = (viewW - ox) / zoom;
    var top = -oy / zoom, bottom = (viewH - oy) / zoom;
    var y0 = Math.max(0, Math.floor((top - hm.height / 2) / hm.rowStep) - 2);
    var y1 = Math.min(ROWS - 1, Math.ceil((bottom - hm.height / 2) / hm.rowStep) + 2);
    var minX = COLS - 1, maxX = 0;
    for (var row = y0; row <= y1; row++) {
      var offset = hm.width / 2 + (row & 1) * hm.width / 2;
      var c0 = Math.floor((left - offset) / hm.width) - 2;
      var c1 = Math.ceil((right - offset) / hm.width) + 2;
      minX = Math.min(minX, Math.max(0, c0));
      maxX = Math.max(maxX, Math.min(COLS - 1, c1));
    }
    return { x0: minX, x1: maxX, y0, y1 };
  }

function worldToCell(wx, wy) {
    if (isHexMap()) {
      var hm = hexMetrics();
      var rowGuess = Math.round((wy - hm.height / 2) / hm.rowStep);
      var best = null, bestD = Infinity;
      for (var rr = rowGuess - 1; rr <= rowGuess + 1; rr++) {
        var colGuess = Math.round((wx - hm.width / 2 - (rr & 1) * hm.width / 2) / hm.width);
        for (var cc = colGuess - 1; cc <= colGuess + 1; cc++) {
          var center = cellCenter(cc, rr);
          var dx = wx - center.x, dy = wy - center.y, d = dx * dx + dy * dy;
          if (d < bestD) {
            bestD = d;
            best = { x: cc, y: rr };
          }
        }
      }
      return { x: Math.max(0, Math.min(COLS - 1, best.x)), y: Math.max(0, Math.min(ROWS - 1, best.y)) };
    }
    return {
      x: Math.max(0, Math.min(COLS - 1, Math.floor(wx / CELL))),
      y: Math.max(0, Math.min(ROWS - 1, Math.floor(wy / CELL)))
    };
  }

function cellCenter(cx2, cy) {
    if (isHexMap()) {
      var hm = hexMetrics();
      return { x: hm.width / 2 + cx2 * hm.width + (cy & 1) * hm.width / 2, y: hm.height / 2 + cy * hm.rowStep };
    }
    return { x: (cx2 + 0.5) * CELL, y: (cy + 0.5) * CELL };
  }

function formatMapDistance(a, b) {
    if (isHexMap()) {
      var route = hexRoute(a, b);
      if (!route) return "Sem rota: hexágono bloqueado";
      var steps = Math.max(0, route.length - 1), miles = steps * hexMetrics().miles;
      var label = steps.toLocaleString("pt-BR") + (steps === 1 ? " hexágono" : " hexágonos") + " · " + miles.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " milhas";
      var travelEff = travelSpeedEffective();
      if (travelEff > 0) {
        var days = miles / travelEff;
        label += " · " + days.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + (days === 1 ? " dia" : " dias");
      }
      return label;
    }
    var dx = b.x - a.x, dy = b.y - a.y;
    var squares = Math.sqrt(dx * dx + dy * dy);
    return squares.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " quadrículas";
  }

function snapGridPoint(wx, wy) {
    return {
      x: Math.max(0, Math.min(COLS, Math.round(wx / CELL))) * CELL,
      y: Math.max(0, Math.min(ROWS, Math.round(wy / CELL))) * CELL
    };
  }

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

var OBJECT_MATERIALS = {
    madeira: { label: "Madeira", ac: 15, hp: 18, threshold: 0, vulnerableFire: true },
    pedra: { label: "Pedra", ac: 17, hp: 27, threshold: 10, immune: ["psíquico", "venenoso"] },
    ferro: { label: "Ferro/aço", ac: 19, hp: 27, threshold: 10, immune: ["psíquico", "venenoso"] },
    mithral: { label: "Mithral", ac: 21, hp: 36, threshold: 15, immune: ["psíquico", "venenoso"], needsMagic: true },
    adamantina: { label: "Adamantina", ac: 23, hp: 45, threshold: 15, immune: ["psíquico", "venenoso"], needsMagic: true },
    pedraMagica: { label: "Pedra mágica", ac: 15, hp: 30, threshold: 10, immune: ["psíquico", "venenoso"] }
  };
