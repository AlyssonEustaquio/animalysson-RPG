(function () {
'use strict';

var MAPS = {
  tumba: {
    nome: 'Tumba dos Horrores', icone: '☠',
    key: 'animalysson-vtt-v4',
    cell: 36, cols: 72, rows: 95, w: 2592, h: 3420,
    spawn: { x: 35, y: 88 },
    parts: [
      { src: 'mapas/tumba-dos-horrores/hi_part1.webp', x: 0,    y: 0,    w: 1332, h: 1692 },
      { src: 'mapas/tumba-dos-horrores/hi_part2.webp', x: 1332, y: 0,    w: 1260, h: 1692 },
      { src: 'mapas/tumba-dos-horrores/hi_part3.webp', x: 0,    y: 1692, w: 1332, h: 1728 },
      { src: 'mapas/tumba-dos-horrores/hi_part4.webp', x: 1332, y: 1692, w: 1260, h: 1728 }
    ]
  },
  flanaess: {
    nome: 'Flanaess 598 CY', icone: '🌍',
    key: 'animalysson-vtt-flanaess-v1',
    cell: 40, cols: 220, rows: 262, w: 8800, h: 10480,
    spawn: { x: 110, y: 131 },
    fit: true,
    maxZoom: 4,
    // Escala exclusiva de Flanaess. A imagem lógica tem 1/4 da resolução de referência.
    // Grade pointy-top: a distância entre centros de hexágonos vizinhos é igual à largura.
    scale: {
      referenceWidth: 35200,
      referenceHeight: 41920,
      referencePixelsPerLogicalPixel: 4,
      pixelsPerMile: 8,
      bars: [
        { miles: 50, referencePixels: 400 },
        { miles: 100, referencePixels: 800 }
      ],
      hexagons: {
        large: { miles: 30, referenceWidthPixels: 240 },
        small: { miles: 6, referenceWidthPixels: 48 }
      }
    },
    detail: { src: 'mapas/flanaess_mapa/detalhe/d_{r}_{c}.webp', n: 8, minZoom: 1.1 },
    parts: [
      { src: 'mapas/flanaess_mapa/hi_part1.webp', x: 0,    y: 0,     w: 4400, h: 5240 },
      { src: 'mapas/flanaess_mapa/hi_part2.webp', x: 4400, y: 0,     w: 4400, h: 5240 },
      { src: 'mapas/flanaess_mapa/hi_part3.webp', x: 0,    y: 5240,  w: 4400, h: 5240 },
      { src: 'mapas/flanaess_mapa/hi_part4.webp', x: 4400, y: 5240,  w: 4400, h: 5240 }
    ]
  }
};
var MAP_ID_KEY = 'animalysson-vtt-mapa-atual';
var HEX_SIZE_KEY = 'animalysson-vtt-flanaess-hex-size';
var mapId = 'tumba', MAPINFO = null;
var hexSize = 'small';
var KEY, CELL, COLS, ROWS, MAP_W, MAP_H, PARTS;
try { mapId = localStorage.getItem(MAP_ID_KEY) || 'tumba'; } catch (e) {}
// Flanaess usa exclusivamente hexágonos pequenos de 6 milhas (48 px de referência).
// Ignora preferências antigas de tamanho para impedir retorno à grade grande.
var FLANAESS_GRID_MODE = 'hex-small-6mi';
var FLANAESS_ZOOM = 3; // Zoom fixo em 300%.

function isHexMap() { return !!(MAPINFO && MAPINFO.scale && mapId === 'flanaess'); }
function hexMetrics() {
  if (!isHexMap()) return null;
  var h = MAPINFO.scale.hexagons[hexSize];
  var width = h.referenceWidthPixels / MAPINFO.scale.referencePixelsPerLogicalPixel;
  var height = width * 2 / Math.sqrt(3);
  return { width: width, height: height, rowStep: height * 0.75, miles: h.miles };
}
function applyMap(id) {
  if (!MAPS[id]) id = 'tumba';
  mapId = id; MAPINFO = MAPS[id];
  MAP_W = MAPINFO.w; MAP_H = MAPINFO.h; PARTS = MAPINFO.parts;
  KEY = MAPINFO.key;
  if (isHexMap()) {
    var hm = hexMetrics();
    CELL = hm.width;
    COLS = Math.ceil(MAP_W / hm.width) + 1;
    ROWS = Math.ceil(MAP_H / hm.rowStep) + 1;
  } else {
    CELL = MAPINFO.cell; COLS = MAPINFO.cols; ROWS = MAPINFO.rows;
  }
}
function mapOptions() {
  return Object.keys(MAPS).map(function (id) {
    return '<option value="' + id + '"' + (id === mapId ? ' selected' : '') + '>' + MAPS[id].icone + ' ' + MAPS[id].nome + '</option>';
  }).join('');
}
applyMap(mapId);

var EDGE_NONE = 0, EDGE_MURO = 1, EDGE_DOOR_C = 2, EDGE_DOOR_O = 3;

var SIZE_SQ = {
  Tiny:1, Small:1, Medium:1, Large:2, Huge:3, Gargantuan:4,
  Minúsculo:1, Pequeno:1, Médio:1, Grande:2, Enorme:3, Imenso:4
};

var R = null, cv = null, cx = null;
var zoom = 0.35, ox = 40, oy = 40;
var tool = 'select';
var drag = null, space = false;
var showGrid = true, showFog = true, dynLight = true, showWalls = true;
var lightRadius = 6;
var selected = null;
var measurePts = null;
var pendingMonster = null;
var blockMove = true;
var previewPointer = null;
var worldTravelTimer = null;
var worldTravelPath = [];
var worldTravelTarget = null;
var WORLD_TRAVEL_STEP_MS = 2000;

var state = load() || defaultState();
// Migra tokens salvos na antiga grade quadrada sem perder as áreas de névoa já reveladas.
function migrateFlanaessState(s) {
  if (!isHexMap() || !s) return s;
  if (s._legacySquareTokens) {
    (s.tokens || []).forEach(function (t) {
      var oldWorldX = (Number(t.x) + 0.5) * MAPS.flanaess.cell;
      var oldWorldY = (Number(t.y) + 0.5) * MAPS.flanaess.cell;
      var migrated = worldToCell(oldWorldX, oldWorldY);
      t.x = migrated.x; t.y = migrated.y;
    });
    delete s._legacySquareTokens;
  } else if (s.gridMode && s.gridMode !== FLANAESS_GRID_MODE) {
    var oldMode = s.gridMode === 'hex-small' ? 'small' : (s.gridMode === 'hex-large' ? 'large' : null);
    if (oldMode) {
      // Dimensões da grade anterior: pequeno=96 px e grande=240 px de referência.
      var oldReferenceWidth = oldMode === 'small' ? 96 : 240;
      var oldWidth = oldReferenceWidth / MAPINFO.scale.referencePixelsPerLogicalPixel;
      var oldHeight = oldWidth * 2 / Math.sqrt(3), oldStep = oldHeight * 0.75;
      (s.tokens || []).forEach(function (t) {
        var oldWorldX = oldWidth / 2 + t.x * oldWidth + (t.y & 1) * oldWidth / 2;
        var oldWorldY = oldHeight / 2 + t.y * oldStep;
        var migrated = worldToCell(oldWorldX, oldWorldY);
        t.x = migrated.x; t.y = migrated.y;
      });
    }
  }
  s.gridMode = FLANAESS_GRID_MODE;
  s.fog = []; s.walls = []; s.hEdges = []; s.vEdges = [];
  state = s;
  save();
  return s;
}
state = migrateFlanaessState(state);
var travelSpeedMilesPerDay = 0;
var bgImages = [];
var bgReady = 0;

function defaultState() {
  return {
    v: 4,
    nome: MAPINFO.nome,
    gridMode: isHexMap() ? FLANAESS_GRID_MODE : 'square',
    tokens: [
      { id: 'p1', nome: 'Aventureiro', tipo: 'player', x: isHexMap() ? worldToCell(MAP_W / 2, MAP_H / 2).x : MAPINFO.spawn.x, y: isHexMap() ? worldToCell(MAP_W / 2, MAP_H / 2).y : MAPINFO.spawn.y, cor: '#4fc3f7', raio: 1, luz: 6, hp: null, hpMax: null }
    ],
    fog: isHexMap() ? [] : makeGrid(1),
    walls: isHexMap() ? [] : makeGrid(0),
    hEdges: isHexMap() ? [] : makeArr(COLS * (ROWS + 1), 0),
    vEdges: isHexMap() ? [] : makeArr((COLS + 1) * ROWS, 0)
  };
}

function makeGrid(val) {
  var a = new Array(COLS * ROWS);
  for (var i = 0; i < a.length; i++) a[i] = val;
  return a;
}
function makeArr(n, val) {
  var a = new Array(n);
  for (var i = 0; i < n; i++) a[i] = val;
  return a;
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return null;
    var s = JSON.parse(raw);
    if (!s || !s.tokens) return null;
    if (isHexMap()) {
      if (!s.gridMode && s.fog && s.fog.length === MAPS.flanaess.cols * MAPS.flanaess.rows) s._legacySquareTokens = true;
      s.fog = []; s.walls = []; s.hEdges = []; s.vEdges = [];
      return s;
    }
    if (!s.fog || s.fog.length !== COLS * ROWS) s.fog = makeGrid(1);
    if (!s.walls || s.walls.length !== COLS * ROWS) s.walls = makeGrid(0);
    if (!s.hEdges || s.hEdges.length !== COLS * (ROWS + 1)) s.hEdges = makeArr(COLS * (ROWS + 1), 0);
    if (!s.vEdges || s.vEdges.length !== (COLS + 1) * ROWS) s.vEdges = makeArr((COLS + 1) * ROWS, 0);
    return s;
  } catch (e) { return null; }
}

function save() {
  try {
    if (isHexMap()) {
      state.gridMode = FLANAESS_GRID_MODE;
      localStorage.setItem(KEY, JSON.stringify({ v: 4, nome: MAPINFO.nome, gridMode: state.gridMode, tokens: state.tokens || [] }));
    } else {
      localStorage.setItem(KEY, JSON.stringify(state));
    }
  } catch (e) {}
}

function $(s) { return R.querySelector(s); }
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function idx(x, y) { return y * COLS + x; }
function hIdx(x, yEdge) { return yEdge * COLS + x; }
function vIdx(xEdge, y) { return y * (COLS + 1) + xEdge; }

function isCellWall(x, y) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
  if (isHexMap()) return false;
  return !!state.walls[idx(x, y)];
}

function getH(x, yEdge) {
  if (x < 0 || x >= COLS || yEdge < 0 || yEdge > ROWS) return EDGE_MURO;
  return state.hEdges[hIdx(x, yEdge)] || 0;
}
function getV(xEdge, y) {
  if (y < 0 || y >= ROWS || xEdge < 0 || xEdge > COLS) return EDGE_MURO;
  return state.vEdges[vIdx(xEdge, y)] || 0;
}
function setH(x, yEdge, val) {
  if (x < 0 || x >= COLS || yEdge < 0 || yEdge > ROWS) return;
  state.hEdges[hIdx(x, yEdge)] = val;
}
function setV(xEdge, y, val) {
  if (y < 0 || y >= ROWS || xEdge < 0 || xEdge > COLS) return;
  state.vEdges[vIdx(xEdge, y)] = val;
}

function edgeBlocks(val) {
  return val === EDGE_MURO || val === EDGE_DOOR_C;
}

function blocksBetween(x0, y0, x1, y1) {
  if (x0 === x1 && y0 === y1) return false;
  if (isCellWall(x1, y1)) return true;
  if (y0 === y1) {
    if (x1 > x0) return edgeBlocks(getV(x1, y0));
    return edgeBlocks(getV(x0, y0));
  }
  if (x0 === x1) {
    if (y1 > y0) return edgeBlocks(getH(x0, y1));
    return edgeBlocks(getH(x0, y0));
  }
  return blocksBetween(x0, y0, x1, y0) || blocksBetween(x0, y0, x0, y1);
}

function sizeSquares(m) {
  if (!m) return 1;
  var s = m.tamanhoEn || m.tamanho || 'Medium';
  return SIZE_SQ[s] || 1;
}

function colorForMonster(m) {
  if (!m) return '#e57373';
  var t = (m.tipoEn || m.tipo || '').toLowerCase();
  if (t.indexOf('undead') >= 0 || t.indexOf('morto') >= 0) return '#b39ddb';
  if (t.indexOf('dragon') >= 0 || t.indexOf('dragão') >= 0) return '#ef5350';
  if (t.indexOf('beast') >= 0 || t.indexOf('fera') >= 0) return '#81c784';
  if (t.indexOf('fiend') >= 0 || t.indexOf('demônio') >= 0 || t.indexOf('diabo') >= 0) return '#e53935';
  if (t.indexOf('celestial') >= 0) return '#ffd54f';
  if (t.indexOf('construct') >= 0 || t.indexOf('constructo') >= 0) return '#90a4ae';
  if (t.indexOf('elemental') >= 0) return '#4dd0e1';
  if (t.indexOf('ooze') >= 0 || t.indexOf('gosma') >= 0) return '#aed581';
  if (t.indexOf('plant') >= 0 || t.indexOf('planta') >= 0) return '#66bb6a';
  return '#e57373';
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
    if (stepX) { err -= dy; nx = x + sx; }
    if (stepY) { err += dx; ny = y + sy; }

    if (nx !== x && ny !== y) {
      if (blocksBetween(x, y, nx, y) || blocksBetween(x, y, x, ny)) return false;
      if (blocksBetween(nx, y, nx, ny) || blocksBetween(x, ny, nx, ny)) return false;
      if (isCellWall(nx, y) || isCellWall(x, ny)) return false;
    } else {
      if (blocksBetween(x, y, nx, ny)) return false;
    }
    x = nx; y = ny;
    if (!(x === x1 && y === y1) && isCellWall(x, y)) return false;
  }
  return true;
}

function loadBackgrounds(cb) {
  bgImages = [];
  bgReady = 0;
  PARTS.forEach(function (p, i) {
    var img = new Image();
    img.onload = function () { bgReady++; if (bgReady === PARTS.length && cb) cb(); draw(); };
    img.onerror = function () { bgReady++; draw(); };
    img.src = p.src;
    bgImages[i] = img;
  });
}

function screenToWorld(sx, sy) { return { x: (sx - ox) / zoom, y: (sy - oy) / zoom }; }
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
function hexNeighbors(cell) {
  var o = cell.y & 1;
  var offsets = o
    ? [[1,0],[-1,0],[0,-1],[1,-1],[0,1],[1,1]]
    : [[1,0],[-1,0],[0,-1],[-1,-1],[0,1],[-1,1]];
  return offsets.map(function (d) { return { x: cell.x + d[0], y: cell.y + d[1] }; });
}
function heapPush(heap, item) {
  var i = heap.length; heap.push(item);
  while (i > 0) {
    var p = (i - 1) >> 1;
    if (heap[p].f <= item.f) break;
    heap[i] = heap[p]; i = p;
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
      heap[i] = heap[c]; i = c;
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
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth || 1 / zoom; ctx.stroke(); }
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
  return { x0: minX, x1: maxX, y0: y0, y1: y1 };
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
        if (d < bestD) { bestD = d; best = { x: cc, y: rr }; }
      }
    }
    return { x: Math.max(0, Math.min(COLS - 1, best.x)), y: Math.max(0, Math.min(ROWS - 1, best.y)) };
  }
  return {
    x: Math.max(0, Math.min(COLS - 1, Math.floor(wx / CELL))),
    y: Math.max(0, Math.min(ROWS - 1, Math.floor(wy / CELL)))
  };
}
function cellCenter(cx, cy) {
  if (isHexMap()) {
    var hm = hexMetrics();
    return { x: hm.width / 2 + cx * hm.width + (cy & 1) * hm.width / 2, y: hm.height / 2 + cy * hm.rowStep };
  }
  return { x: (cx + 0.5) * CELL, y: (cy + 0.5) * CELL };
}

function mapDistanceMiles(a, b) {
  if (!isHexMap()) return null;
  var route = hexRoute(a, b);
  return route ? Math.max(0, route.length - 1) * hexMetrics().miles : null;
}
function formatMapDistance(a, b) {
  if (isHexMap()) {
    var route = hexRoute(a, b);
    if (!route) return 'Sem rota: hexágono bloqueado';
    var steps = Math.max(0, route.length - 1), miles = steps * hexMetrics().miles;
    var label = steps.toLocaleString('pt-BR') + (steps === 1 ? ' hexágono' : ' hexágonos') + ' · ' +
      miles.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' milhas';
    if (travelSpeedMilesPerDay > 0) {
      var days = miles / travelSpeedMilesPerDay;
      label += ' · ' + days.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + (days === 1 ? ' dia' : ' dias');
    }
    return label;
  }
  var dx = (b.x - a.x), dy = (b.y - a.y);
  var squares = Math.sqrt(dx * dx + dy * dy);
  return squares.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' quadrículas';
}

function nearestEdge(wx, wy) {
  var gx = wx / CELL, gy = wy / CELL;
  var cx = Math.floor(gx), cy = Math.floor(gy);
  var fx = gx - cx, fy = gy - cy;
  var distV = Math.min(fx, 1 - fx);
  var distH = Math.min(fy, 1 - fy);
  if (distV <= distH) {
    var xEdge = fx < 0.5 ? cx : cx + 1;
    var y = Math.max(0, Math.min(ROWS - 1, cy));
    xEdge = Math.max(0, Math.min(COLS, xEdge));
    return { dir: 'v', xEdge: xEdge, y: y };
  } else {
    var yEdge = fy < 0.5 ? cy : cy + 1;
    var x = Math.max(0, Math.min(COLS - 1, cx));
    yEdge = Math.max(0, Math.min(ROWS, yEdge));
    return { dir: 'h', x: x, yEdge: yEdge };
  }
}

function getEdgeVal(edge) {
  if (edge.dir === 'h') return getH(edge.x, edge.yEdge);
  return getV(edge.xEdge, edge.y);
}
function setEdgeVal(edge, val) {
  if (edge.dir === 'h') setH(edge.x, edge.yEdge, val);
  else setV(edge.xEdge, edge.y, val);
}

function isDoorEdge(val) {
  return val === EDGE_DOOR_C || val === EDGE_DOOR_O;
}

function getDoorRun(edge) {
  if (!edge || !isDoorEdge(getEdgeVal(edge))) return edge ? [edge] : [];
  var run = [];
  if (edge.dir === 'h') {
    var startX = edge.x, endX = edge.x, ye = edge.yEdge;
    while (startX > 0 && isDoorEdge(getH(startX - 1, ye))) startX--;
    while (endX + 1 < COLS && isDoorEdge(getH(endX + 1, ye))) endX++;
    for (var x = startX; x <= endX; x++) run.push({ dir: 'h', x: x, yEdge: ye });
  } else {
    var startY = edge.y, endY = edge.y, xe = edge.xEdge;
    while (startY > 0 && isDoorEdge(getV(xe, startY - 1))) startY--;
    while (endY + 1 < ROWS && isDoorEdge(getV(xe, endY + 1))) endY++;
    for (var y = startY; y <= endY; y++) run.push({ dir: 'v', xEdge: xe, y: y });
  }
  return run;
}

function setDoorRunValue(edge, val) {
  getDoorRun(edge).forEach(function (part) { setEdgeVal(part, val); });
}

function doorRunIsClosed(edge) {
  var run = getDoorRun(edge);
  return run.every(function (part) { return getEdgeVal(part) === EDGE_DOOR_C; });
}

var detailCache = {};
var DETAIL_MAX = 6;

function drawDetail(W, H) {
  var d = MAPINFO && MAPINFO.detail;
  if (!d || zoom < d.minZoom) return;
  var tw = MAP_W / d.n, th = MAP_H / d.n;
  var c0 = Math.max(0, Math.floor((-ox / zoom) / tw));
  var c1 = Math.min(d.n - 1, Math.floor(((W - ox) / zoom) / tw));
  var r0 = Math.max(0, Math.floor((-oy / zoom) / th));
  var r1 = Math.min(d.n - 1, Math.floor(((H - oy) / zoom) / th));
  var now = Date.now(), visible = {};
  for (var r = r0; r <= r1; r++) {
    for (var c = c0; c <= c1; c++) {
      var k = r + '_' + c;
      visible[k] = 1;
      var t = detailCache[k];
      if (!t) {
        t = detailCache[k] = { img: new Image(), t: now };
        t.img.onload = function () { draw(); };
        t.img.src = d.src.replace('{r}', r).replace('{c}', c);
      }
      t.t = now;
      if (t.img.complete && t.img.naturalWidth) cx.drawImage(t.img, c * tw, r * th, tw + 0.5, th + 0.5);
    }
  }
  var keys = Object.keys(detailCache);
  if (keys.length > DETAIL_MAX) {
    keys.filter(function (k) { return !visible[k]; })
      .sort(function (a, b) { return detailCache[a].t - detailCache[b].t; })
      .slice(0, keys.length - DETAIL_MAX)
      .forEach(function (k) { detailCache[k].img.onload = null; detailCache[k].img.src = ''; delete detailCache[k]; });
  }
}

function drawScaleBars(viewW, viewH) {
  if (!isHexMap()) return;
  var scale = MAPINFO.scale;
  var factor = scale.referencePixelsPerLogicalPixel;
  var w50 = 400 / factor * zoom;
  var w100 = 800 / factor * zoom;
  var x = viewW - Math.max(w100, 72) - 18;
  var y = viewH - 48;
  cx.save();
  cx.font = '11px sans-serif';
  cx.textAlign = 'left';
  cx.textBaseline = 'bottom';
  cx.fillStyle = 'rgba(0,0,0,0.68)';
  cx.fillRect(x - 8, y - 36, Math.max(w100, 72) + 16, 42);
  cx.strokeStyle = '#fff'; cx.fillStyle = '#fff'; cx.lineWidth = 2;
  cx.beginPath(); cx.moveTo(x, y - 20); cx.lineTo(x + w100, y - 20); cx.stroke();
  cx.beginPath(); cx.moveTo(x, y - 24); cx.lineTo(x, y - 16); cx.moveTo(x + w100, y - 24); cx.lineTo(x + w100, y - 16); cx.stroke();
  cx.fillText('100 milhas', x, y - 22);
  cx.beginPath(); cx.moveTo(x, y - 4); cx.lineTo(x + w50, y - 4); cx.stroke();
  cx.beginPath(); cx.moveTo(x, y - 8); cx.lineTo(x, y); cx.moveTo(x + w50, y - 8); cx.lineTo(x + w50, y); cx.stroke();
  cx.fillText('50 milhas', x, y + 12);
  cx.restore();
}


function focusCameraOnPlayer(viewW, viewH) {
  if (!isHexMap() || !cv) return;
  zoom = FLANAESS_ZOOM; // Flanaess fixo em 300%.
  var player = currentPlayer();
  if (!player) return;
  var center = cellCenter(player.x, player.y);
  // O canvas aplica translate(ox, oy) antes de scale(zoom, zoom).
  // Portanto, o deslocamento precisa compensar a coordenada já multiplicada pelo zoom.
  var width = viewW == null ? cv.clientWidth : viewW;
  var height = viewH == null ? cv.clientHeight : viewH;
  ox = width / 2 - center.x * zoom;
  oy = height / 2 - center.y * zoom;
}

function stopWorldTravel(shouldSave) {
  if (worldTravelTimer != null) {
    window.clearInterval(worldTravelTimer);
    worldTravelTimer = null;
  }
  worldTravelPath = [];
  worldTravelTarget = null;
  if (shouldSave && isHexMap()) save();
}

function startWorldTravel(destination) {
  var player = currentPlayer();
  if (!isHexMap() || !player || !destination) return;
  stopWorldTravel(false);
  if (destination.x === player.x && destination.y === player.y) { draw(); return; }
  var path = hexLine({ x: player.x, y: player.y }, destination);
  worldTravelPath = path.slice(1);
  worldTravelTarget = { x: destination.x, y: destination.y };
  if (!worldTravelPath.length) { draw(); return; }

  worldTravelTimer = window.setInterval(function () {
    var activePlayer = currentPlayer();
    if (!activePlayer || !isHexMap() || !cv) {
      stopWorldTravel(false);
      return;
    }
    var next = worldTravelPath.shift();
    if (next) {
      activePlayer.x = next.x;
      activePlayer.y = next.y;
      selected = activePlayer;
      save();
    }
    if (!worldTravelPath.length) {
      window.clearInterval(worldTravelTimer);
      worldTravelTimer = null;
      worldTravelTarget = null;
      save();
    }
    draw();
  }, WORLD_TRAVEL_STEP_MS);
  draw();
}

function drawWorldTravelPath() {
  if (!isHexMap() || !worldTravelPath.length) return;
  var player = currentPlayer();
  if (!player) return;
  cx.save();
  cx.strokeStyle = 'rgba(255, 215, 75, 0.9)';
  cx.fillStyle = 'rgba(255, 215, 75, 0.95)';
  cx.lineWidth = 3 / zoom;
  cx.setLineDash([7 / zoom, 5 / zoom]);
  cx.beginPath();
  var start = cellCenter(player.x, player.y);
  cx.moveTo(start.x, start.y);
  worldTravelPath.forEach(function (cell) {
    var point = cellCenter(cell.x, cell.y);
    cx.lineTo(point.x, point.y);
  });
  cx.stroke();
  var end = cellCenter(worldTravelPath[worldTravelPath.length - 1].x, worldTravelPath[worldTravelPath.length - 1].y);
  cx.setLineDash([]);
  cx.beginPath(); cx.arc(end.x, end.y, 9 / zoom, 0, Math.PI * 2); cx.stroke();
  cx.restore();
}

function draw() {
  if (!cv || !cx) return;
  var dpr = window.devicePixelRatio || 1;
  var W = cv.clientWidth, H = cv.clientHeight;
  if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
  }
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (isHexMap()) focusCameraOnPlayer(W, H);
  cx.fillStyle = '#0a0a0b';
  cx.fillRect(0, 0, W, H);

  cx.save();
  cx.translate(ox, oy);
  cx.scale(zoom, zoom);

  PARTS.forEach(function (p, i) {
    var img = bgImages[i];
    if (img && img.complete && img.naturalWidth) cx.drawImage(img, p.x, p.y, p.w, p.h);
    else { cx.fillStyle = '#1a1a1c'; cx.fillRect(p.x, p.y, p.w, p.h); }
  });
  // No Flanaess, sobrepõe os tiles detalhados para usar a resolução máxima.
  if (isHexMap()) drawDetail(W, H);

  if (showWalls && !isHexMap()) {
    var wallBounds = visibleCellBounds(W, H);
    if (isHexMap()) {
      var hmWalls = hexMetrics();
      cx.beginPath();
      for (var wy = wallBounds.y0; wy <= wallBounds.y1; wy++) for (var wx = wallBounds.x0; wx <= wallBounds.x1; wx++) {
        if (state.walls[idx(wx, wy)]) appendHexPath(cx, cellCenter(wx, wy), hmWalls);
      }
      cx.fillStyle = 'rgba(180, 40, 40, 0.45)'; cx.fill();
    } else {
      cx.fillStyle = 'rgba(180, 40, 40, 0.45)';
      for (var y = wallBounds.y0; y <= wallBounds.y1; y++) for (var x = wallBounds.x0; x <= wallBounds.x1; x++) {
        if (state.walls[idx(x, y)]) cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
      }
    }
  }

  if (showWalls && !isHexMap()) {
    drawEdges();
  }

  if (showGrid) {
    cx.strokeStyle = 'rgba(255,255,255,0.50)';
    cx.lineWidth = 1 / zoom;
    if (isHexMap()) {
      var gridBounds = visibleCellBounds(W, H), hmGrid = hexMetrics();
      cx.beginPath();
      for (var hy = gridBounds.y0; hy <= gridBounds.y1; hy++) {
        for (var hx = gridBounds.x0; hx <= gridBounds.x1; hx++) appendHexPath(cx, cellCenter(hx, hy), hmGrid);
      }
      cx.strokeStyle = 'rgba(0,0,0,0.10)'; cx.lineWidth = 1 / zoom; cx.stroke(); // Flanaess: grid preto com 10% de opacidade
    } else {
      cx.beginPath();
      for (var gx = 0; gx <= COLS; gx++) { cx.moveTo(gx * CELL, 0); cx.lineTo(gx * CELL, ROWS * CELL); }
      for (var gy = 0; gy <= ROWS; gy++) { cx.moveTo(0, gy * CELL); cx.lineTo(COLS * CELL, gy * CELL); }
      cx.stroke();
    }
  }

  if (showFog && !isHexMap()) drawFogAndLight(W, H);

  if (selected && !isTokenVisible(selected)) selected = null;
  state.tokens.forEach(function (t) {
    if (isTokenVisible(t)) drawToken(t, t === selected);
  });

  if (!isHexMap()) drawToolPreview();
  else drawWorldTravelPath();

  if (measurePts && measurePts.length === 2) {
    var a = cellCenter(measurePts[0].x, measurePts[0].y);
    var b = cellCenter(measurePts[1].x, measurePts[1].y);
    cx.strokeStyle = '#ffeb3b';
    cx.lineWidth = 2 / zoom;
    cx.setLineDash(isHexMap() ? [] : [6 / zoom, 4 / zoom]);
    if (isHexMap()) {
      var routeCells = hexRoute(measurePts[0], measurePts[1]);
      if (routeCells) {
        cx.beginPath();
        routeCells.forEach(function (part, i) { var pt = cellCenter(part.x, part.y); if (!i) cx.moveTo(pt.x, pt.y); else cx.lineTo(pt.x, pt.y); });
        cx.stroke();
      } else { cx.strokeStyle = '#ef5350'; cx.setLineDash([6 / zoom, 4 / zoom]); cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); cx.setLineDash([]); }
    } else {
      cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
    }
    cx.setLineDash([]);
    var distanceLabel = formatMapDistance(measurePts[0], measurePts[1]);
    var mid;
    if (isHexMap() && routeCells && routeCells.length) mid = cellCenter(routeCells[Math.floor((routeCells.length - 1) / 2)].x, routeCells[Math.floor((routeCells.length - 1) / 2)].y);
    else mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    cx.fillStyle = 'rgba(0,0,0,0.75)';
    cx.font = (14 / zoom) + 'px sans-serif';
    cx.textAlign = 'center';
    cx.fillText(distanceLabel, mid.x, mid.y - 8 / zoom);
  }

  cx.restore();
  drawScaleBars(W, H);
  updateHud();
  updateDetailPanel();
}

function drawEdges() {
  var lw = Math.max(2.5, 3.5 / zoom);
  for (var ye = 0; ye <= ROWS; ye++) {
    for (var x = 0; x < COLS; x++) {
      var v = getH(x, ye);
      if (v === EDGE_MURO) {
        cx.strokeStyle = '#c62828';
        cx.lineWidth = lw;
        cx.beginPath(); cx.moveTo(x * CELL, ye * CELL); cx.lineTo((x + 1) * CELL, ye * CELL); cx.stroke();
      } else if (isDoorEdge(v)) {
        if (x > 0 && isDoorEdge(getH(x - 1, ye))) continue;
        var endX = x;
        while (endX + 1 < COLS && isDoorEdge(getH(endX + 1, ye))) endX++;
        var closed = false;
        for (var hx = x; hx <= endX; hx++) if (getH(hx, ye) === EDGE_DOOR_C) closed = true;
        var x0 = x * CELL, x1 = (endX + 1) * CELL, y0 = ye * CELL;
        cx.strokeStyle = closed ? '#8d6e63' : 'rgba(141,110,99,0.35)';
        cx.lineWidth = closed ? lw : lw * 0.7;
        if (!closed) cx.setLineDash([6 / zoom, 4 / zoom]);
        cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y0); cx.stroke();
        if (!closed) cx.setLineDash([]);
        cx.fillStyle = closed ? '#ffcc80' : '#a5d6a7';
        cx.beginPath(); cx.arc((x0 + x1) / 2, y0, 4 / zoom, 0, Math.PI * 2); cx.fill();
      }
    }
  }

  for (var y = 0; y < ROWS; y++) {
    for (var xe = 0; xe <= COLS; xe++) {
      var vv = getV(xe, y);
      if (vv === EDGE_MURO) {
        cx.strokeStyle = '#c62828';
        cx.lineWidth = lw;
        cx.beginPath(); cx.moveTo(xe * CELL, y * CELL); cx.lineTo(xe * CELL, (y + 1) * CELL); cx.stroke();
      } else if (isDoorEdge(vv)) {
        if (y > 0 && isDoorEdge(getV(xe, y - 1))) continue;
        var endY = y;
        while (endY + 1 < ROWS && isDoorEdge(getV(xe, endY + 1))) endY++;
        var vClosed = false;
        for (var vy = y; vy <= endY; vy++) if (getV(xe, vy) === EDGE_DOOR_C) vClosed = true;
        var xx = xe * CELL, yy0 = y * CELL, yy1 = (endY + 1) * CELL;
        cx.strokeStyle = vClosed ? '#8d6e63' : 'rgba(141,110,99,0.35)';
        cx.lineWidth = vClosed ? lw : lw * 0.7;
        if (!vClosed) cx.setLineDash([6 / zoom, 4 / zoom]);
        cx.beginPath(); cx.moveTo(xx, yy0); cx.lineTo(xx, yy1); cx.stroke();
        if (!vClosed) cx.setLineDash([]);
        cx.fillStyle = vClosed ? '#ffcc80' : '#a5d6a7';
        cx.beginPath(); cx.arc(xx, (yy0 + yy1) / 2, 4 / zoom, 0, Math.PI * 2); cx.fill();
      }
    }
  }
}

function isCurrentlyVisible(x, y, px, py, r) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
  if (isHexMap()) return true;
  if (!dynLight) return !state.fog[idx(x, y)];
  if (px < 0) return false;
  var dist;
  if (isHexMap()) dist = hexDistance({ x: x, y: y }, { x: px, y: py });
  else { var dx = x - px, dy = y - py; dist = Math.sqrt(dx * dx + dy * dy); }
  if (dist > r + 0.01) return false;
  return hasLOS(px, py, x, y);
}

function isTokenVisible(t) {
  if (!t) return false;
  if (isHexMap() || t.tipo === 'player') return true;
  var player = currentPlayer();
  if (!player) return false;
  var sq = t.raio || 1;
  var radius = player.luz || lightRadius;
  if (isHexMap()) return isCurrentlyVisible(t.x, t.y, player.x, player.y, radius);
  for (var dy = 0; dy < sq; dy++) {
    for (var dx = 0; dx < sq; dx++) {
      if (!isCurrentlyVisible(t.x + dx, t.y + dy, player.x, player.y, radius)) return false;
    }
  }
  return true;
}

function currentPlayer() {
  return state.tokens.find(function (t) { return t.tipo === 'player'; }) || state.tokens[0] || null;
}

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
  return value === EDGE_DOOR_C || value === EDGE_DOOR_O ? edge : null;
}

function previewDescription(cell) {
  if (tool === 'pan') return 'Arraste para deslocar a câmera sem alterar o mapa.';
  if (!cell) return 'Mova o cursor sobre o mapa para visualizar a ação.';
  var pos = ' (' + (cell.x + 1) + ', ' + (cell.y + 1) + ')';
  if (tool === 'select') {
    var hit = previewHoveredToken(cell);
    if (hit) return 'Selecionar/mover ' + hit.nome + pos + '. Clique e arraste.';
    if (previewDoorEdge()) return 'Alternar esta porta entre aberta e fechada.';
    return 'Selecionar um token visível ou clicar em uma porta para alterná-la.';
  }
  if (tool === 'wall') return 'Adicionar uma parede no ' + (isHexMap() ? 'hexágono' : 'quadrado') + pos + '. Bloqueia passagem e visão.';
  if (tool === 'erasewall') return 'Apagar a parede do ' + (isHexMap() ? 'hexágono' : 'quadrado') + pos + ', se houver.';
  if (tool === 'muro') return 'Adicionar um muro na borda mais próxima deste quadrado.';
  if (tool === 'porta') {
    var pe = previewEdge(), pv = pe ? getEdgeVal(pe) : 0;
    return pv === EDGE_DOOR_C ? 'A porta será aberta.' : pv === EDGE_DOOR_O ? 'A porta será fechada.' : 'Criar uma porta fechada nesta borda.';
  }
  if (tool === 'eraseedge') return 'Apagar o muro ou a porta na borda mais próxima.';
  if (tool === 'spawn') return 'Mover o início do jogador para' + pos + ' e recalcular a área iluminada.';
  if (tool === 'reveal') return 'Revelar ' + (isHexMap() ? 'o hexágono e seus 6 vizinhos' : 'um pincel de 3 × 3 quadrados') + ' ao redor de' + pos + '.';
  if (tool === 'hide') return 'Cobrir com névoa ' + (isHexMap() ? 'o hexágono e seus 6 vizinhos' : 'um pincel de 3 × 3 quadrados') + ' ao redor de' + pos + '.';
  if (tool === 'token') {
    if (pendingMonster) return 'Colocar ' + pendingMonster.nome + ' (ND ' + pendingMonster.nd + ')' + pos + '.';
    return 'Criar um token livre em' + pos + '. Ao clicar, você poderá definir o nome.';
  }
  if (tool === 'measure') {
    if (measurePts && measurePts.length === 1) {
      var startPoint = cellCenter(measurePts[0].x, measurePts[0].y);
      var endPoint = cellCenter(cell.x, cell.y);
      return 'Finalizar a medição: ' + formatMapDistance(measurePts[0], cell) + '.';
    }
    if (measurePts && measurePts.length === 2) return 'Medição concluída. Clique para iniciar outra distância.';
    return 'Marcar o ponto inicial da medição em' + pos + '.';
  }
  return 'Prévia da ferramenta ' + toolLabel(tool) + '.';
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
  if (edge.dir === 'h') {
    var x0 = first.x * CELL, y0 = first.yEdge * CELL;
    var x1 = (last.x + 1) * CELL;
    cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y0); cx.stroke();
    if (door) { cx.setLineDash([]); cx.beginPath(); cx.arc((x0 + x1) / 2, y0, 5 / zoom, 0, Math.PI * 2); cx.fill(); }
  } else {
    var xx = first.xEdge * CELL, yy0 = first.y * CELL;
    var yy1 = (last.y + 1) * CELL;
    cx.beginPath(); cx.moveTo(xx, yy0); cx.lineTo(xx, yy1); cx.stroke();
    if (door) { cx.setLineDash([]); cx.beginPath(); cx.arc(xx, (yy0 + yy1) / 2, 5 / zoom, 0, Math.PI * 2); cx.fill(); }
  }
  cx.restore();
}

function drawToolPreview() {
  if (!previewPointer || !cv) return;
  var cell = previewCell();
  var edge = previewEdge();
  var center = cellCenter(cell.x, cell.y);
  var ghost;

  if (tool === 'wall') drawPreviewCell(cell, 'rgba(229,57,53,0.38)', '#ff5252');
  else if (tool === 'erasewall') drawPreviewCell(cell, 'rgba(102,187,106,0.28)', '#81c784');
  else if (tool === 'muro') drawEdgePreview(edge, '#ff5252', false);
  else if (tool === 'porta') drawEdgePreview(edge, '#ffb74d', true);
  else if (tool === 'eraseedge') drawEdgePreview(edge, '#80deea', isDoorEdge(getEdgeVal(edge)));
  else if (tool === 'reveal' || tool === 'hide') {
    cx.save();
    cx.fillStyle = tool === 'reveal' ? 'rgba(255,235,59,0.22)' : 'rgba(0,0,0,0.5)';
    cx.strokeStyle = tool === 'reveal' ? '#fff176' : '#b0bec5';
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
  } else if (tool === 'spawn') {
    var player = currentPlayer();
    var radius = (player && player.luz) || lightRadius;
    cx.save();
    cx.fillStyle = 'rgba(255,213,79,0.08)';
    cx.strokeStyle = 'rgba(255,213,79,0.9)';
    cx.lineWidth = 2 / zoom;
    cx.setLineDash([8 / zoom, 5 / zoom]);
    cx.beginPath(); cx.arc(center.x, center.y, radius * CELL, 0, Math.PI * 2); cx.fill(); cx.stroke();
    cx.restore();
    ghost = { nome: 'J', tipo: 'player', x: cell.x, y: cell.y, cor: '#4fc3f7', raio: 1 };
    cx.save(); cx.globalAlpha = 0.55; drawToken(ghost, false); cx.restore();
  } else if (tool === 'token') {
    var m = pendingMonster;
    ghost = m ? {
      nome: m.nome, tipo: 'npc', x: cell.x, y: cell.y,
      cor: colorForMonster(m), raio: sizeSquares(m), hp: m.pontosVida,
      hpMax: m.pontosVida
    } : { nome: '?', tipo: 'npc', x: cell.x, y: cell.y, cor: '#e57373', raio: 1 };
    cx.save(); cx.globalAlpha = 0.48; drawToken(ghost, false); cx.restore();
  } else if (tool === 'measure') {
    if (measurePts && measurePts.length === 1) {
      var start = cellCenter(measurePts[0].x, measurePts[0].y);
      var distanceLabel = formatMapDistance(measurePts[0], cell);
      cx.save();
      cx.strokeStyle = '#ffeb3b'; cx.lineWidth = 2 / zoom;
      cx.setLineDash(isHexMap() ? [] : [6 / zoom, 4 / zoom]);
      var liveRoute = null;
      if (isHexMap()) {
        liveRoute = hexRoute(measurePts[0], cell);
        if (liveRoute) {
          cx.beginPath();
          liveRoute.forEach(function (part, i) { var pt = cellCenter(part.x, part.y); if (!i) cx.moveTo(pt.x, pt.y); else cx.lineTo(pt.x, pt.y); });
          cx.stroke();
        } else { cx.strokeStyle = '#ef5350'; cx.setLineDash([6 / zoom, 4 / zoom]); cx.beginPath(); cx.moveTo(start.x, start.y); cx.lineTo(center.x, center.y); cx.stroke(); }
      } else { cx.beginPath(); cx.moveTo(start.x, start.y); cx.lineTo(center.x, center.y); cx.stroke(); }
      cx.setLineDash([]);
      cx.fillStyle = 'rgba(0,0,0,0.8)';
      cx.font = (14 / zoom) + 'px sans-serif'; cx.textAlign = 'center';
      var liveMid = isHexMap() && liveRoute && liveRoute.length ? cellCenter(liveRoute[Math.floor((liveRoute.length - 1) / 2)].x, liveRoute[Math.floor((liveRoute.length - 1) / 2)].y) : { x: (start.x + center.x) / 2, y: (start.y + center.y) / 2 };
      cx.fillText(distanceLabel, liveMid.x, liveMid.y - 8 / zoom);
      cx.restore();
    } else drawPreviewCell(cell, 'rgba(255,235,59,0.14)', '#ffeb3b');
  } else if (tool === 'select') {
    var doorEdge = previewDoorEdge();
    var hovered = previewHoveredToken(cell);
    if (doorEdge) drawEdgePreview(doorEdge, '#ffb74d', true);
    else if (hovered) {
      var sq = hovered.raio || 1;
      cx.save(); cx.strokeStyle = '#ffeb3b'; cx.lineWidth = 3 / zoom;
      cx.setLineDash([5 / zoom, 3 / zoom]);
      if (isHexMap()) hexPath(cx, cellCenter(hovered.x, hovered.y), null, '#ffeb3b', 3 / zoom);
      else cx.strokeRect(hovered.x * CELL + 2, hovered.y * CELL + 2, sq * CELL - 4, sq * CELL - 4);
      cx.restore();
    } else drawPreviewCell(cell, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.65)');
  }

  var info = $('#mp-preview');
  if (info) info.textContent = previewDescription(cell);
}

function drawFogAndLight(viewW, viewH) {
  var player = state.tokens.find(function (t) { return t.tipo === 'player'; }) || state.tokens[0];
  var px = player ? player.x : -1;
  var py = player ? player.y : -1;
  var r = player ? (player.luz || lightRadius) : 0;

  var fogBounds = visibleCellBounds(viewW, viewH);
  if (isHexMap()) {
    var hmFog = hexMetrics();
    cx.beginPath();
    for (var fy = fogBounds.y0; fy <= fogBounds.y1; fy++) for (var fx = fogBounds.x0; fx <= fogBounds.x1; fx++) {
      if (state.fog[idx(fx, fy)] && !isCurrentlyVisible(fx, fy, px, py, r)) appendHexPath(cx, cellCenter(fx, fy), hmFog);
    }
    cx.fillStyle = 'rgba(0,0,0,1)'; cx.fill();
    if (dynLight) {
      cx.beginPath();
      for (var dy = fogBounds.y0; dy <= fogBounds.y1; dy++) for (var dx = fogBounds.x0; dx <= fogBounds.x1; dx++) {
        if (!state.fog[idx(dx, dy)] && !isCurrentlyVisible(dx, dy, px, py, r)) appendHexPath(cx, cellCenter(dx, dy), hmFog);
      }
      cx.fillStyle = 'rgba(0,0,0,0.5)'; cx.fill();
    }
  } else {
    for (var y = fogBounds.y0; y <= fogBounds.y1; y++) for (var x = fogBounds.x0; x <= fogBounds.x1; x++) {
      if (isCurrentlyVisible(x, y, px, py, r)) continue;
      if (state.fog[idx(x, y)]) { cx.fillStyle = 'rgba(0,0,0,1)'; cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5); }
      else if (dynLight) { cx.fillStyle = 'rgba(0,0,0,0.5)'; cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5); }
    }
  }

  if (dynLight && player) {
    var c = cellCenter(px, py);
    var rPx = r * CELL;
    var grd = cx.createRadialGradient(c.x, c.y, rPx * 0.12, c.x, c.y, rPx);
    grd.addColorStop(0, 'rgba(255,220,140,0.16)');
    grd.addColorStop(0.65, 'rgba(255,180,80,0.05)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = grd;
    cx.beginPath();
    cx.arc(c.x, c.y, rPx, 0, Math.PI * 2);
    cx.fill();
  }
}

function drawToken(t, sel) {
  var sq = t.raio || 1;
  var c = isHexMap() ? cellCenter(t.x, t.y) : cellCenter(t.x + (sq - 1) / 2, t.y + (sq - 1) / 2);
  var r = isHexMap() ? CELL * 0.31 * Math.max(1, Math.sqrt(sq)) : sq * CELL * 0.42;
  cx.beginPath();
  cx.arc(c.x, c.y, r, 0, Math.PI * 2);
  cx.fillStyle = t.cor || '#e57373';
  cx.fill();
  if (sel) {
    cx.strokeStyle = '#fff';
    cx.lineWidth = 3 / zoom;
    cx.stroke();
  } else {
    cx.strokeStyle = 'rgba(0,0,0,0.55)';
    cx.lineWidth = 1.5 / zoom;
    cx.stroke();
  }
  cx.fillStyle = '#111';
  cx.font = 'bold ' + Math.max(10, (11 + sq * 2) / zoom) + 'px sans-serif';
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.fillText((t.nome || '?').charAt(0).toUpperCase(), c.x, c.y + 1);

  if (t.hpMax != null && t.hp != null && t.hpMax > 0) {
    var pct = Math.max(0, Math.min(1, t.hp / t.hpMax));
    var bw = sq * CELL * 0.7, bh = 4 / zoom;
    var bx = c.x - bw / 2, by = c.y + r + 3 / zoom;
    cx.fillStyle = 'rgba(0,0,0,0.6)';
    cx.fillRect(bx, by, bw, bh);
    cx.fillStyle = pct > 0.5 ? '#66bb6a' : pct > 0.25 ? '#ffb74d' : '#ef5350';
    cx.fillRect(bx, by, bw * pct, bh);
  }
}

function updateHud() {
  var h = $('#mp-hud');
  if (!h) return;
  var t = selected;
  var info = t
    ? '<b>' + esc(t.nome) + '</b> (' + t.x + ',' + t.y + ')' +
      (t.nd != null ? ' · ND ' + esc(t.nd) : '') +
      (!isHexMap() && t.tipo === 'player' ? ' · Luz ' + (t.luz || lightRadius) : '')
    : (pendingMonster ? 'Coloque: <b>' + esc(pendingMonster.nome) + '</b>' : 'Nenhum token selecionado');
  var hm = hexMetrics();
  var scaleInfo = hm
    ? 'Grade hexagonal: 6 mi / 48 px · 1 mi = 8 px'
    : 'Medição em quadrículas';
  if (isHexMap()) {
    var travelInfo = worldTravelPath.length ? ' · ' + worldTravelPath.length + ' hexágonos restantes' : ' · Clique no mapa para viajar';
    h.innerHTML = '<b>' + esc((currentPlayer() || {}).nome || 'Aventureiro') + '</b> · Câmera presa ao personagem' +
      '<br><small>Zoom 300% · Resolução máxima · 1 movimento a cada 2 segundos' + travelInfo + ' · ' + scaleInfo + '</small>';
  } else {
    h.innerHTML = info + '<br><small>' + toolLabel(tool) + ' · Zoom ' + Math.round(zoom * 100) + '% · ' + scaleInfo + '</small>';
  }
}

function toolLabel(t) {
  return ({
    select: 'Selecionar/Mover', pan: 'Mover vista',
    wall: 'Parede', erasewall: 'Apagar parede',
    muro: 'Muro (linha)', porta: 'Porta (linha)', eraseedge: 'Apagar muro/porta',
    reveal: 'Revelar névoa', hide: 'Ocultar névoa',
    token: 'Colocar token', spawn: 'Início do jogador', measure: 'Medir'
  })[t] || t;
}

function updateDetailPanel() {
  var box = $('#mp-detail');
  if (!box) return;
  var t = selected;
  if (!t) {
    box.innerHTML = '<div class="mp-detail-empty">Selecione um token no mapa.</div>';
    return;
  }
  var hpHtml = '';
  if (t.hpMax != null) {
    hpHtml = '<div class="mp-hp-row">' +
      '<label>PV <input type="number" id="mp-hp" value="' + (t.hp != null ? t.hp : t.hpMax) + '" min="0" style="width:56px">' +
      ' / ' + t.hpMax + '</label>' +
      '<button type="button" id="mp-hp-full">Máx</button></div>';
  }
  var extra = '';
  if (t.monsterId && window.MONSTERS) {
    var m = (window.MONSTERS || []).find(function (x) { return x.id === t.monsterId; });
    if (m) {
      extra = '<div class="mp-stat-grid">' +
        '<span>CA <b>' + esc(m.classeArmadura) + '</b></span>' +
        '<span>PV <b>' + esc(m.pontosVida) + '</b></span>' +
        '<span>ND <b>' + esc(m.nd) + '</b></span>' +
        '<span>' + esc(m.tamanho) + ' · ' + esc(m.tipo) + '</span></div>';
      if (m.acoes && m.acoes.length) {
        extra += '<div class="mp-actions"><b>Ações</b><ul>' +
          m.acoes.slice(0, 4).map(function (a) {
            var desc = a.description || a.descricao || '';
            return '<li><b>' + esc(a.name || a.nome) + '</b>' +
              (desc ? ': ' + esc(String(desc).slice(0, 110)) + (String(desc).length > 110 ? '…' : '') : '') +
              '</li>';
          }).join('') + '</ul></div>';
      }
    }
  }
  box.innerHTML =
    '<div class="mp-detail-head"><strong>' + esc(t.nome) + '</strong>' +
    (t.nd != null ? '<span class="card-tag">ND ' + esc(t.nd) + '</span>' : '') + '</div>' +
    hpHtml + extra +
    '<div class="mp-detail-tools">' +
    (t.tipo !== 'player' ? '<button type="button" id="mp-del-tok">Remover token</button>' : '') +
    '</div>';

  var hpIn = $('#mp-hp');
  if (hpIn) hpIn.onchange = function () { t.hp = +this.value; save(); draw(); };
  var hpFull = $('#mp-hp-full');
  if (hpFull) hpFull.onclick = function () { t.hp = t.hpMax; save(); draw(); };
  var del = $('#mp-del-tok');
  if (del) del.onclick = function () {
    state.tokens = state.tokens.filter(function (x) { return x !== t; });
    selected = null; save(); draw();
  };
}

function renderMonsterList(query) {
  var list = $('#mp-ml');
  if (!list) return;
  var q = (query || '').trim().toLowerCase();
  var monsters = window.MONSTERS || [];
  var filtered = monsters.filter(function (m) {
    if (!q) return true;
    return [m.nome, m.nomeEn, m.tipo, m.nd, m.id].join(' ').toLowerCase().indexOf(q) >= 0;
  }).slice(0, 50);
  if (!monsters.length) { list.innerHTML = '<small>Carregando bestiário…</small>'; return; }
  if (!filtered.length) { list.innerHTML = '<small>Nenhum monstro encontrado.</small>'; return; }
  list.innerHTML = filtered.map(function (m) {
    return '<button type="button" class="mp-mbtn" data-id="' + esc(m.id) + '">' +
      '<span class="mp-mn">' + esc(m.nome) + '</span>' +
      '<small>ND ' + esc(m.nd) + ' · ' + esc(m.tamanho) + '</small></button>';
  }).join('');
}

function placeMonsterFromId(id, cell) {
  var m = (window.MONSTERS || []).find(function (x) { return x.id === id; });
  if (!m) return;
  if (blockMove && isCellWall(cell.x, cell.y)) return;
  var sq = sizeSquares(m);
  var tok = {
    id: 't' + Date.now().toString(36),
    monsterId: m.id, nome: m.nome, tipo: 'npc',
    x: cell.x, y: cell.y, cor: colorForMonster(m), raio: sq, luz: 0,
    nd: m.nd, hp: m.pontosVida, hpMax: m.pontosVida
  };
  state.tokens.push(tok);
  selected = tok;
  pendingMonster = null;
  setTool('select');
  save();
  draw();
}

function canOccupy(x, y, token) {
  if (!blockMove) return true;
  var sq = (token && token.raio) || 1;
  for (var dy = 0; dy < sq; dy++) {
    for (var dx = 0; dx < sq; dx++) {
      if (isCellWall(x + dx, y + dy)) return false;
    }
  }
  return true;
}

function canStep(fromX, fromY, toX, toY, token) {
  if (!canOccupy(toX, toY, token)) return false;
  if (!blockMove) return true;
  if (isHexMap()) return !!hexRoute({ x: fromX, y: fromY }, { x: toX, y: toY });
  if (Math.abs(toX - fromX) <= 1 && Math.abs(toY - fromY) <= 1) {
    if (blocksBetween(fromX, fromY, toX, toY)) return false;
  }
  return true;
}

function applyWallBrush(cx, cy, val, radius) {
  var r = radius == null ? 0 : radius;
  for (var dy = -r; dy <= r; dy++) {
    for (var dx = -r; dx <= r; dx++) {
      var x = cx + dx, y = cy + dy;
      if (x >= 0 && x < COLS && y >= 0 && y < ROWS) state.walls[idx(x, y)] = val;
    }
  }
}

function applyFogBrush(cx, cy, val) {
  for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
      var x = cx + dx, y = cy + dy;
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
      if (isHexMap() && hexDistance({ x: cx, y: cy }, { x: x, y: y }) > 1) continue;
      state.fog[idx(x, y)] = val;
    }
  }
}

function revealAround(cx, cy, radius) {
  var r = Math.ceil(radius);
  for (var dy = -r; dy <= r; dy++) {
    for (var dx = -r; dx <= r; dx++) {
      if (isHexMap() ? (hexDistance({ x: cx, y: cy }, { x: cx + dx, y: cy + dy }) > radius) : (dx * dx + dy * dy > radius * radius + 0.5)) continue;
      var x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
      if (hasLOS(cx, cy, x, y)) state.fog[idx(x, y)] = 0;
    }
  }
}

function onPointerDown(e) {
  if (isHexMap()) {
    e.preventDefault();
    var worldRect = cv.getBoundingClientRect();
    var worldPoint = screenToWorld(e.clientX - worldRect.left, e.clientY - worldRect.top);
    if (worldPoint.x < 0 || worldPoint.y < 0 || worldPoint.x > MAP_W || worldPoint.y > MAP_H) return;
    startWorldTravel(worldToCell(worldPoint.x, worldPoint.y));
    return;
  }
  cv.setPointerCapture(e.pointerId);
  var previewRect = cv.getBoundingClientRect();
  previewPointer = screenToWorld(e.clientX - previewRect.left, e.clientY - previewRect.top);
  var rect = cv.getBoundingClientRect();
  var world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
  var cell = worldToCell(world.x, world.y);

  if (tool === 'pan' || e.button === 1 || e.button === 2 || space) {
    drag = { pan: true, x: e.clientX, y: e.clientY, ox: ox, oy: oy };
    return;
  }

  if (!isHexMap() && (tool === 'muro' || tool === 'porta' || tool === 'eraseedge')) {
    var edge = nearestEdge(world.x, world.y);
    var cur = getEdgeVal(edge);
    if (tool === 'muro') {
      setEdgeVal(edge, EDGE_MURO);
      drag = { edgePaint: true, mode: 'muro' };
    } else if (tool === 'porta') {
      if (isDoorEdge(cur)) setDoorRunValue(edge, doorRunIsClosed(edge) ? EDGE_DOOR_O : EDGE_DOOR_C);
      else setEdgeVal(edge, EDGE_DOOR_C);
      drag = { edgePaint: true, mode: 'porta' };
    } else {
      if (isDoorEdge(cur)) setDoorRunValue(edge, EDGE_NONE);
      else setEdgeVal(edge, EDGE_NONE);
      drag = { edgePaint: true, mode: 'erase' };
    }
    save();
    draw();
    return;
  }

  if (tool === 'wall') {
    drag = { wall: true, val: 1 };
    applyWallBrush(cell.x, cell.y, 1, 0);
    draw();
    return;
  }
  if (tool === 'erasewall') {
    drag = { wall: true, val: 0 };
    applyWallBrush(cell.x, cell.y, 0, 0);
    draw();
    return;
  }

  if (tool === 'spawn') {
    var player = state.tokens.find(function (t) { return t.tipo === 'player'; });
    if (!player) {
      player = { id: 'p1', nome: 'Aventureiro', tipo: 'player', x: cell.x, y: cell.y, cor: '#4fc3f7', raio: 1, luz: lightRadius, hp: null, hpMax: null };
      state.tokens.unshift(player);
    } else {
      if (blockMove && isCellWall(cell.x, cell.y)) {
        alert('Não é possível iniciar em cima de uma parede.');
        return;
      }
      player.x = cell.x;
      player.y = cell.y;
    }
    selected = player;
    if (dynLight) revealAround(player.x, player.y, player.luz || lightRadius);
    save();
    draw();
    return;
  }

  if (pendingMonster && (tool === 'token' || tool === 'select')) {
    placeMonsterFromId(pendingMonster.id, cell);
    return;
  }

  if (tool === 'select') {
    var edge2 = isHexMap() ? null : nearestEdge(world.x, world.y);
    var ev = edge2 ? getEdgeVal(edge2) : EDGE_NONE;
    var gx = world.x / CELL, gy = world.y / CELL;
    var fx = Math.abs(gx - Math.round(gx)), fy = Math.abs(gy - Math.round(gy));
    var nearLine = !isHexMap() && Math.min(fx, fy) < 0.12;
    if (nearLine && isDoorEdge(ev)) {
      setDoorRunValue(edge2, doorRunIsClosed(edge2) ? EDGE_DOOR_O : EDGE_DOOR_C);
      save();
      draw();
      return;
    }

    var hit = null;
    for (var i = state.tokens.length - 1; i >= 0; i--) {
      var t = state.tokens[i];
      if (!isTokenVisible(t)) continue;
      var sq = t.raio || 1;
      if (cell.x >= t.x && cell.x < t.x + sq && cell.y >= t.y && cell.y < t.y + sq) {
        hit = t; break;
      }
    }
    selected = hit;
    if (hit) drag = { moveToken: hit, fromX: hit.x, fromY: hit.y };
    draw();
    return;
  }

  if (tool === 'reveal' || tool === 'hide') {
    drag = { brush: true, mode: tool };
    applyFogBrush(cell.x, cell.y, tool === 'reveal' ? 0 : 1);
    draw();
    return;
  }

  if (tool === 'token' && !pendingMonster) {
    var nome = prompt('Nome do token:', 'Criatura');
    if (!nome) return;
    if (blockMove && isCellWall(cell.x, cell.y)) return;
    var tok = {
      id: 't' + Date.now().toString(36),
      nome: nome, tipo: 'npc', x: cell.x, y: cell.y,
      cor: '#e57373', raio: 1, luz: 0, hp: null, hpMax: null
    };
    state.tokens.push(tok);
    selected = tok;
    save();
    draw();
    return;
  }

  if (tool === 'measure') {
    if (!measurePts) measurePts = [cell];
    else if (measurePts.length === 1) { measurePts.push(cell); draw(); }
    else { measurePts = [cell]; draw(); }
  }
}

function onPointerMove(e) {
  if (isHexMap()) return;
  var previewRect = cv.getBoundingClientRect();
  previewPointer = screenToWorld(e.clientX - previewRect.left, e.clientY - previewRect.top);
  if (!drag) { draw(); return; }
  if (drag.pan) {
    ox = drag.ox + (e.clientX - drag.x);
    oy = drag.oy + (e.clientY - drag.y);
    draw();
    return;
  }
  if (drag.edgePaint && !isHexMap()) {
    var rectE = cv.getBoundingClientRect();
    var worldE = screenToWorld(e.clientX - rectE.left, e.clientY - rectE.top);
    var edge = nearestEdge(worldE.x, worldE.y);
    if (drag.mode === 'muro') setEdgeVal(edge, EDGE_MURO);
    else if (drag.mode === 'porta') {
      var c = getEdgeVal(edge);
      if (c !== EDGE_DOOR_C && c !== EDGE_DOOR_O) setEdgeVal(edge, EDGE_DOOR_C);
    } else if (isDoorEdge(getEdgeVal(edge))) setDoorRunValue(edge, EDGE_NONE);
    else setEdgeVal(edge, EDGE_NONE);
    draw();
    return;
  }
  if (drag.wall) {
    var rect = cv.getBoundingClientRect();
    var world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    var cell = worldToCell(world.x, world.y);
    applyWallBrush(cell.x, cell.y, drag.val, 0);
    draw();
    return;
  }
  if (drag.moveToken) {
    var rect2 = cv.getBoundingClientRect();
    var world2 = screenToWorld(e.clientX - rect2.left, e.clientY - rect2.top);
    var cell2 = worldToCell(world2.x, world2.y);
    var t = drag.moveToken;
    if (canStep(t.x, t.y, cell2.x, cell2.y, t)) {
      t.x = cell2.x;
      t.y = cell2.y;
      if (t.tipo === 'player' && dynLight) {
        revealAround(cell2.x, cell2.y, t.luz || lightRadius);
      }
    }
    draw();
    return;
  }
  if (drag.brush) {
    var rect3 = cv.getBoundingClientRect();
    var world3 = screenToWorld(e.clientX - rect3.left, e.clientY - rect3.top);
    var cell3 = worldToCell(world3.x, world3.y);
    applyFogBrush(cell3.x, cell3.y, drag.mode === 'reveal' ? 0 : 1);
    draw();
  }
}

function onPointerUp() {
  if (drag && (drag.moveToken || drag.brush || drag.wall || drag.edgePaint)) save();
  drag = null;
}

function onPointerLeave() {
  if (isHexMap()) return;
  if (!drag) { previewPointer = null; draw(); }
}

function onWheel(e) {
  e.preventDefault();
  if (isHexMap()) { zoom = FLANAESS_ZOOM; draw(); return; }
  var rect = cv.getBoundingClientRect();
  var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
  var before = screenToWorld(sx, sy);
  var factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
  zoom = Math.max(0.04, Math.min(MAPINFO.maxZoom || 2.5, zoom * factor));
  var after = screenToWorld(sx, sy);
  ox += (after.x - before.x) * zoom;
  oy += (after.y - before.y) * zoom;
  draw();
}

function onKey(e) {
  if (isHexMap()) {
    if (e.key === 'Escape') { stopWorldTravel(true); draw(); }
    return;
  }
  if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.code === 'Space') { space = true; e.preventDefault(); return; }
  if ((e.key === 'Delete' || e.key === 'Backspace') && selected && selected.tipo !== 'player') {
    state.tokens = state.tokens.filter(function (t) { return t !== selected; });
    selected = null; save(); draw();
  }
  if (e.key === 'g' || e.key === 'G') { showGrid = !showGrid; draw(); }
  if (e.key === 'f' || e.key === 'F') { showFog = !showFog; draw(); }
  if (e.key === 'l' || e.key === 'L') { dynLight = !dynLight; draw(); }
  if (e.key === 'w' || e.key === 'W') { showWalls = !showWalls; draw(); }
  if (e.key === 'Escape') { pendingMonster = null; selected = null; measurePts = null; draw(); }
}

function onKeyUp(e) { if (e.code === 'Space') space = false; }

function setTool(t) {
  tool = t;
  measurePts = null;
  if (t !== 'token') pendingMonster = null;
  R.querySelectorAll('#mp-tools button').forEach(function (b) {
    b.classList.toggle('on', b.dataset.t === t);
  });
  var info = $('#mp-preview');
  if (info) info.textContent = toolPreviewHelp(t);
  if (cv) cv.style.cursor = t === 'pan' ? 'grab' : t === 'select' ? 'pointer' : 'crosshair';
  draw();
}

function toolPreviewHelp(t) {
  return ({
    select: 'Selecionar: passe sobre um token visível para destacá-lo; clique e arraste para mover.',
    pan: 'Mover vista: arraste o mapa para mudar a área da câmera.',
    wall: 'Parede: o espaço destacado ficará bloqueado para movimento e visão.',
    erasewall: 'Apagar parede: o espaço destacado ficará livre.',
    muro: 'Muro: a linha destacada bloqueará passagem e linha de visão.',
    porta: 'Porta: a linha destacada receberá uma porta; clique novamente para alternar aberta/fechada.',
    eraseedge: 'Apagar linha: o muro ou a porta destacados serão removidos.',
    spawn: 'Início: o marcador e o círculo mostram a nova posição e o alcance de luz.',
    reveal: 'Revelar: a área destacada perderá a névoa.',
    hide: 'Ocultar: a área destacada ficará coberta pela névoa.',
    token: 'Token: a silhueta mostra onde a criatura selecionada será colocada.',
    measure: 'Medir: marque início e destino para ver a rota hexagonal, a distância e o tempo conforme a velocidade informada.'
  })[t] || 'A prévia acompanha o cursor.';
}

function mount(el) {
  R = el;
  R.innerHTML =
    '<div class="mp vtt" id="mp-root">' +
    '<div class="mp-bar">' +
    '<select id="mp-map" class="mp-title" title="Trocar de mapa">' + mapOptions() + '</select>' +
    '<label id="mp-hex-wrap" class="mp-luz" style="display:none">Hexágono <select id="mp-hex-size" disabled><option value="small" selected>Pequeno · 6 mi</option></select></label>' +
    '<label id="mp-speed-wrap" class="mp-luz" style="display:none">Velocidade <input id="mp-speed" type="number" min="0.1" step="0.1" placeholder="mi/dia" style="width:62px"></label>' +
    '<div class="mp-g" id="mp-tools">' +
    '<button data-t="select" class="on" title="Selecionar / Mover · clique na porta para abrir/fechar">↖ Selecionar</button>' +
    '<button data-t="pan" title="Mover vista">✋ Mover</button>' +
    '<button data-t="wall" title="Parede no espaço atual (bloqueia tudo)">🧱 Parede</button>' +
    '<button data-t="erasewall" title="Apagar parede do espaço atual">🧹 Apagar parede</button>' +
    '<button data-t="muro" title="Muro na linha do grid (bloqueia luz e passagem)">─ Muro</button>' +
    '<button data-t="porta" title="Porta na linha · clique de novo para abrir/fechar">🚪 Porta</button>' +
    '<button data-t="eraseedge" title="Apagar muro/porta da linha">✂ Apagar linha</button>' +
    '<button data-t="spawn" title="Definir início do jogador">📍 Início</button>' +
    '<button data-t="reveal" title="Revelar névoa">☀ Revelar</button>' +
    '<button data-t="hide" title="Ocultar névoa">🌑 Ocultar</button>' +
    '<button data-t="token" title="Token livre">♟ Token</button>' +
    '<button data-t="measure" title="Medir">📏 Medir</button>' +
    '</div>' +
    '<button id="mp-grid" title="Grid (G)">Grid</button>' +
    '<button id="mp-fog" title="Névoa (F)">Névoa</button>' +
    '<button id="mp-light" title="Luz dinâmica (L)">Luz</button>' +
    '<button id="mp-walls-vis" title="Mostrar paredes/muros (W)">Ver muros</button>' +
    '<label class="mp-luz"><input id="mp-block" type="checkbox" checked> Bloquear movimento</label>' +
    '<label class="mp-luz">Raio <input id="mp-lr" type="number" min="0" max="20" value="6" style="width:44px"></label>' +
    '<button id="mp-reset-fog" title="Cobrir novamente todas as áreas do mapa">Reset Névoa</button>' +
    '<button id="mp-clear-fog" title="Remover a névoa de todo o mapa (pede confirmação)">Revelar Tudo</button>' +
    '<button id="mp-clear-walls" title="Remover todas as paredes (pede confirmação)">Limpar paredes</button>' +
    '<button id="mp-clear-edges" title="Remover todos os muros e portas das linhas (pede confirmação)">Limpar muros/portas</button>' +
    '<button id="mp-zo">−</button><button id="mp-zi">+</button>' +
    '</div>' +
    '<div class="mp-wrap vtt-wrap">' +
    '<aside class="mp-side" id="mp-side">' +
    '<h4>Bestiário</h4>' +
    '<input id="mp-q" type="search" placeholder="Buscar monstro…" style="width:100%;margin-bottom:6px">' +
    '<div id="mp-ml" class="mp-ml"></div>' +
    '<h4 style="margin-top:12px">Token selecionado</h4>' +
    '<div id="mp-detail" class="mp-detail"><div class="mp-detail-empty">Selecione um token.</div></div>' +
    '<small style="display:block;margin-top:10px;color:var(--mute)">' +
    (isHexMap() ? '<b>Parede</b> = hexágono bloqueado.<br><b>Flanaess</b> usa deslocamento e medição em hexágonos; muros e portas lineares ficam desativados.' : '<b>Parede</b> = quadrado inteiro.<br><b>Muro</b> = linha do grid (bloqueia luz 100%).<br><b>Porta</b> = linha; laranja=fechada, verde=aberta. Clique de novo ou use Selecionar na porta para abrir/fechar.') + '</small>' +
    '</aside>' +
    '<div class="mp-main">' +
    '<canvas id="mp-cv"></canvas>' +
    '<div id="mp-hud"></div>' +
    '<div id="mp-preview" class="mp-preview">Selecione uma ferramenta para ver a prévia da ação.</div>' +
    '<div id="mp-st">Roda=zoom · Espaço=pan · G grid · F névoa · L luz · W muros</div>' +
    '</div></div></div>';

  cv = $('#mp-cv');
  cx = cv.getContext('2d');
  if ('imageSmoothingQuality' in cx) cx.imageSmoothingQuality = 'high';

  cv.addEventListener('pointerdown', onPointerDown);
  cv.addEventListener('pointermove', onPointerMove);
  cv.addEventListener('pointerleave', onPointerLeave);
  cv.addEventListener('pointerup', onPointerUp);
  cv.addEventListener('pointercancel', onPointerUp);
  cv.addEventListener('wheel', onWheel, { passive: false });
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  $('#mp-map').onchange = function () {
    var host = R, id = this.value;
    stopWorldTravel(false);
    save();
    try { localStorage.setItem(MAP_ID_KEY, id); } catch (e) {}
    unmount();
    applyMap(id);
    if (isHexMap() && ['muro', 'porta', 'eraseedge'].indexOf(tool) >= 0) tool = 'select';
    state = migrateFlanaessState(load() || defaultState());
    selected = null; pendingMonster = null; measurePts = null; drag = null;
    mount(host);
  };
  if ($('#mp-hex-wrap')) $('#mp-hex-wrap').style.display = 'none';
  if ($('#mp-speed-wrap')) $('#mp-speed-wrap').style.display = isHexMap() ? 'inline-flex' : 'none';
  if (isHexMap()) {
    var worldRoot = $('#mp-root');
    worldRoot.classList.add('mp-world-map');
    var worldStyle = document.createElement('style');
    worldStyle.textContent =
      '#mp-root.mp-world-map .mp-g,' +
      '#mp-root.mp-world-map #mp-grid,' +
      '#mp-root.mp-world-map #mp-fog,' +
      '#mp-root.mp-world-map #mp-light,' +
      '#mp-root.mp-world-map #mp-walls-vis,' +
      '#mp-root.mp-world-map #mp-speed-wrap,' +
      '#mp-root.mp-world-map #mp-reset-fog,' +
      '#mp-root.mp-world-map #mp-clear-fog,' +
      '#mp-root.mp-world-map #mp-clear-walls,' +
      '#mp-root.mp-world-map #mp-clear-edges,' +
      '#mp-root.mp-world-map #mp-zo,' +
      '#mp-root.mp-world-map #mp-zi,'+
      '#mp-root.mp-world-map .mp-side,'+
      '#mp-root.mp-world-map #mp-preview {display:none !important;}' +
      '#mp-root.mp-world-map .mp-wrap {display:block !important;height:calc(100vh - 150px) !important;min-height:420px !important;}' +
      '#mp-root.mp-world-map .mp-main {display:block !important;width:100% !important;height:100% !important;min-width:0 !important;position:relative !important;}' +
      '#mp-root.mp-world-map #mp-cv {display:block;width:100%;height:100%;cursor:crosshair;touch-action:manipulation;}' +
      '#mp-root.mp-world-map #mp-hex-wrap {display:none !important;}';
    worldRoot.appendChild(worldStyle);
    var blockLabel = $('#mp-block'); if (blockLabel && blockLabel.parentElement) blockLabel.parentElement.style.display = 'none';
    var radiusInput = $('#mp-lr'); if (radiusInput && radiusInput.parentElement) radiusInput.parentElement.style.display = 'none';
    var speedWrap = $('#mp-speed-wrap'); if (speedWrap) speedWrap.style.display = 'none';
    showFog = false; dynLight = false; showWalls = false; showGrid = true;
    zoom = FLANAESS_ZOOM;
    var status = $('#mp-st');
    if (status) status.textContent = 'Clique no mapa para viajar · Hexágono de 6 milhas (48 px de referência) · 1 movimento a cada 2 segundos · Câmera presa ao personagem · Zoom 300% · Resolução máxima';
  }
  // O Flanaess não oferece mais seletor: o tamanho pequeno é fixo.
  if ($('#mp-speed')) $('#mp-speed').oninput = function () {
    travelSpeedMilesPerDay = Math.max(0, Number(this.value) || 0);
    draw();
  };

  $('#mp-tools').onclick = function (e) {
    var b = e.target.closest('button');
    if (b) setTool(b.dataset.t);
  };
  $('#mp-grid').onclick = function () { showGrid = !showGrid; this.classList.toggle('on', showGrid); draw(); };
  $('#mp-fog').onclick = function () { showFog = !showFog; this.classList.toggle('on', showFog); draw(); };
  $('#mp-light').onclick = function () { dynLight = !dynLight; this.classList.toggle('on', dynLight); draw(); };
  $('#mp-walls-vis').onclick = function () { showWalls = !showWalls; this.classList.toggle('on', showWalls); draw(); };
  $('#mp-block').onchange = function () { blockMove = this.checked; };
  $('#mp-lr').onchange = function () {
    lightRadius = +this.value || 0;
    var p = state.tokens.find(function (t) { return t.tipo === 'player'; });
    if (p) { p.luz = lightRadius; save(); }
    draw();
  };
  $('#mp-reset-fog').onclick = function () {
    if (confirm('Cobrir o mapa com névoa novamente?')) {
      state.fog = makeGrid(1); save(); draw();
    }
  };
  $('#mp-clear-fog').onclick = function () {
    if (confirm('Revelar o mapa inteiro? A névoa será removida de todas as células.')) {
      state.fog = makeGrid(0); save(); draw();
    }
  };
  $('#mp-clear-walls').onclick = function () {
    if (confirm('Apagar todas as paredes das células?')) {
      state.walls = makeGrid(0); save(); draw();
    }
  };
  $('#mp-clear-edges').onclick = function () {
    if (confirm('Apagar todos os muros e portas de linha?')) {
      state.hEdges = makeArr(COLS * (ROWS + 1), 0);
      state.vEdges = makeArr((COLS + 1) * ROWS, 0);
      save(); draw();
    }
  };
  $('#mp-zo').onclick = function () { if (isHexMap()) { zoom = FLANAESS_ZOOM; } else { zoom = Math.max(0.04, zoom / 1.2); } draw(); };
  $('#mp-zi').onclick = function () { if (isHexMap()) { zoom = FLANAESS_ZOOM; } else { zoom = Math.min(MAPINFO.maxZoom || 2.5, zoom * 1.2); } draw(); };

  $('#mp-q').oninput = function () { renderMonsterList(this.value); };
  $('#mp-ml').onclick = function (e) {
    var b = e.target.closest('button[data-id]');
    if (!b) return;
    var m = (window.MONSTERS || []).find(function (x) { return x.id === b.dataset.id; });
    if (!m) return;
    pendingMonster = m;
    setTool('token');
    R.querySelectorAll('#mp-ml button').forEach(function (btn) { btn.classList.toggle('on', btn === b); });
  };

  document.addEventListener('keydown', onKey);
  document.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', draw);

  ['muro', 'porta', 'eraseedge'].forEach(function (name) {
    var btn = R.querySelector('#mp-tools button[data-t="' + name + '"]');
    if (btn) btn.style.display = isHexMap() ? 'none' : '';
  });
  var clearEdgesButton = $('#mp-clear-edges');
  if (clearEdgesButton) clearEdgesButton.style.display = isHexMap() ? 'none' : '';
  $('#mp-grid').classList.toggle('on', showGrid);
  $('#mp-fog').classList.toggle('on', showFog);
  $('#mp-light').classList.toggle('on', dynLight);
  $('#mp-walls-vis').classList.toggle('on', showWalls);
  if ($('#mp-preview')) $('#mp-preview').textContent = toolPreviewHelp(tool);

  function tryMonsters() { renderMonsterList($('#mp-q') ? $('#mp-q').value : ''); }
  tryMonsters();
  if (window.MONSTERS_READY) window.MONSTERS_READY.then(tryMonsters);

  loadBackgrounds(function () {
    if (!cv) return;
    if (isHexMap()) {
      zoom = FLANAESS_ZOOM;
      focusCameraOnPlayer();
    } else if (MAPINFO.fit) {
      zoom = Math.max(0.04, Math.min((cv.clientWidth - 160) / MAP_W, (cv.clientHeight - 160) / MAP_H));
      ox = 80; oy = 80;
    } else {
      zoom = 0.4;
      ox = 80;
      oy = -MAP_H * zoom + (cv.clientHeight || 500) - 80;
    }
    draw();
  });
  draw();
}

function unmount() {
  stopWorldTravel(false);
  document.removeEventListener('keydown', onKey);
  document.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('resize', draw);
  R = null; cv = null; cx = null; bgImages = []; detailCache = {}; previewPointer = null;
}

window.MapEditor = { mount: mount, unmount: unmount };
})();
