/* mapa.js — VTT estilo Roll20
 * Parede (quadrado) + Muro/Porta (linha do grid) + fog 100%/50% + luz com LOS
 */
(function () {
'use strict';

var KEY = 'animalysson-vtt-v4';
var CELL = 36;
var COLS = 72, ROWS = 95;
var MAP_W = 2592, MAP_H = 3420;

// Arestas: 0=livre, 1=muro, 2=porta fechada, 3=porta aberta
var EDGE_NONE = 0, EDGE_MURO = 1, EDGE_DOOR_C = 2, EDGE_DOOR_O = 3;

var PARTS = [
  { src: 'mapas/tumba-dos-horrores/hi_part1.webp', x: 0,    y: 0,    w: 1332, h: 1692 },
  { src: 'mapas/tumba-dos-horrores/hi_part2.webp', x: 1332, y: 0,    w: 1260, h: 1692 },
  { src: 'mapas/tumba-dos-horrores/hi_part3.webp', x: 0,    y: 1692, w: 1332, h: 1728 },
  { src: 'mapas/tumba-dos-horrores/hi_part4.webp', x: 1332, y: 1692, w: 1260, h: 1728 }
];

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
// Posição do cursor usada para desenhar a prévia da ferramenta antes do clique.
var previewPointer = null;

var state = load() || defaultState();
var bgImages = [];
var bgReady = 0;

function defaultState() {
  return {
    v: 4,
    nome: 'Tumba dos Horrores',
    tokens: [
      { id: 'p1', nome: 'Aventureiro', tipo: 'player', x: 35, y: 88, cor: '#4fc3f7', raio: 1, luz: 6, hp: null, hpMax: null }
    ],
    fog: makeGrid(1),
    walls: makeGrid(0),
    hEdges: makeArr(COLS * (ROWS + 1), 0), // aresta horizontal acima da célula (x, yEdge)
    vEdges: makeArr((COLS + 1) * ROWS, 0)  // aresta vertical à esquerda da célula (xEdge, y)
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
    if (!s.fog || s.fog.length !== COLS * ROWS) s.fog = makeGrid(1);
    if (!s.walls || s.walls.length !== COLS * ROWS) s.walls = makeGrid(0);
    if (!s.hEdges || s.hEdges.length !== COLS * (ROWS + 1)) s.hEdges = makeArr(COLS * (ROWS + 1), 0);
    if (!s.vEdges || s.vEdges.length !== (COLS + 1) * ROWS) s.vEdges = makeArr((COLS + 1) * ROWS, 0);
    return s;
  } catch (e) { return null; }
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
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

// Bloqueio ao cruzar de célula A para B
function blocksBetween(x0, y0, x1, y1) {
  if (x0 === x1 && y0 === y1) return false;
  if (isCellWall(x1, y1)) return true;
  if (y0 === y1) {
    // movimento horizontal
    if (x1 > x0) return edgeBlocks(getV(x1, y0));
    return edgeBlocks(getV(x0, y0));
  }
  if (x0 === x1) {
    // movimento vertical
    if (y1 > y0) return edgeBlocks(getH(x0, y1));
    return edgeBlocks(getH(x0, y0));
  }
  // diagonal: bloqueia se QUALQUER aresta do canto estiver fechada
  // (impede passar/luz na união das linhas)
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

// LOS: Bresenham + bloqueio por célula e por aresta
// Diagonais usam OR (não AND) para não vazar luz na união/canto das linhas
function hasLOS(x0, y0, x1, y1) {
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
      // passo diagonal: bloqueia se QUALQUER lado do canto tiver muro/porta fechada
      // (evita luz passando na união das linhas)
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
function worldToCell(wx, wy) {
  return {
    x: Math.max(0, Math.min(COLS - 1, Math.floor(wx / CELL))),
    y: Math.max(0, Math.min(ROWS - 1, Math.floor(wy / CELL)))
  };
}
function cellCenter(cx, cy) { return { x: (cx + 0.5) * CELL, y: (cy + 0.5) * CELL }; }

// Encontra a aresta mais próxima do ponto no mundo
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

// Retorna todas as partes de uma porta contínua na mesma linha.
// Portas que apenas se tocam pelas pontas formam um único conjunto.
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

// ---------- Draw ----------
function draw() {
  if (!cv || !cx) return;
  var dpr = window.devicePixelRatio || 1;
  var W = cv.clientWidth, H = cv.clientHeight;
  if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
  }
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

  // paredes de célula (preenchimento)
  if (showWalls) {
    cx.fillStyle = 'rgba(180, 40, 40, 0.45)';
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        if (state.walls[idx(x, y)]) {
          cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
        }
      }
    }
  }

  // muros e portas nas arestas
  if (showWalls) {
    drawEdges();
  }

  if (showGrid) {
    cx.strokeStyle = 'rgba(255,255,255,0.18)';
    cx.lineWidth = 1 / zoom;
    cx.beginPath();
    for (var gx = 0; gx <= COLS; gx++) { cx.moveTo(gx * CELL, 0); cx.lineTo(gx * CELL, ROWS * CELL); }
    for (var gy = 0; gy <= ROWS; gy++) { cx.moveTo(0, gy * CELL); cx.lineTo(COLS * CELL, gy * CELL); }
    cx.stroke();
  }

  if (showFog) drawFogAndLight();

  // Um token só aparece quando TODA a sua área ocupada está visível.
  // Assim, criaturas fora do alcance de luz ou atrás de paredes não vazam pela névoa.
  if (selected && !isTokenVisible(selected)) selected = null;
  state.tokens.forEach(function (t) {
    if (isTokenVisible(t)) drawToken(t, t === selected);
  });

  drawToolPreview();

  if (measurePts && measurePts.length === 2) {
    var a = cellCenter(measurePts[0].x, measurePts[0].y);
    var b = cellCenter(measurePts[1].x, measurePts[1].y);
    cx.strokeStyle = '#ffeb3b';
    cx.lineWidth = 2 / zoom;
    cx.setLineDash([6 / zoom, 4 / zoom]);
    cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
    cx.setLineDash([]);
    var dist = Math.max(Math.abs(measurePts[0].x - measurePts[1].x), Math.abs(measurePts[0].y - measurePts[1].y));
    var mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    cx.fillStyle = 'rgba(0,0,0,0.75)';
    cx.font = (14 / zoom) + 'px sans-serif';
    cx.textAlign = 'center';
    cx.fillText(dist + ' quad. (' + (dist * 1.5).toFixed(1) + ' m)', mid.x, mid.y - 8 / zoom);
  }

  cx.restore();
  updateHud();
  updateDetailPanel();
}

function drawEdges() {
  var lw = Math.max(2.5, 3.5 / zoom);
  // Horizontais: muros continuam individuais; portas encostadas viram um único vão.
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

  // Verticais: mesma regra para portas encostadas na mesma coluna.
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
  if (!dynLight) return !state.fog[idx(x, y)];
  if (px < 0) return false;
  var dx = x - px, dy = y - py;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > r + 0.01) return false;
  return hasLOS(px, py, x, y);
}

function isTokenVisible(t) {
  if (!t) return false;
  // O marcador do jogador é sempre mostrado para orientar a exploração.
  if (t.tipo === 'player') return true;
  var player = currentPlayer();
  if (!player) return false;
  var sq = t.raio || 1;
  var radius = player.luz || lightRadius;
  // Só revela o token quando toda a sua área ocupada está dentro da visão.
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
  if (!previewPointer) return null;
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
  if (tool === 'wall') return 'Adicionar uma parede no quadrado' + pos + '. Bloqueia passagem e visão.';
  if (tool === 'erasewall') return 'Apagar a parede do quadrado' + pos + ', se houver.';
  if (tool === 'muro') return 'Adicionar um muro na borda mais próxima deste quadrado.';
  if (tool === 'porta') {
    var pe = previewEdge(), pv = pe ? getEdgeVal(pe) : 0;
    return pv === EDGE_DOOR_C ? 'A porta será aberta.' : pv === EDGE_DOOR_O ? 'A porta será fechada.' : 'Criar uma porta fechada nesta borda.';
  }
  if (tool === 'eraseedge') return 'Apagar o muro ou a porta na borda mais próxima.';
  if (tool === 'spawn') return 'Mover o início do jogador para' + pos + ' e recalcular a área iluminada.';
  if (tool === 'reveal') return 'Revelar um pincel de 3 × 3 quadrados ao redor de' + pos + '.';
  if (tool === 'hide') return 'Cobrir com névoa um pincel de 3 × 3 quadrados ao redor de' + pos + '.';
  if (tool === 'token') {
    if (pendingMonster) return 'Colocar ' + pendingMonster.nome + ' (ND ' + pendingMonster.nd + ')' + pos + '.';
    return 'Criar um token livre em' + pos + '. Ao clicar, você poderá definir o nome.';
  }
  if (tool === 'measure') {
    if (measurePts && measurePts.length === 1) {
      var d = Math.max(Math.abs(cell.x - measurePts[0].x), Math.abs(cell.y - measurePts[0].y));
      return 'Finalizar a medição: ' + d + ' quadrado(s) · ' + (d * 1.5).toFixed(1) + ' m.';
    }
    if (measurePts && measurePts.length === 2) return 'Medição concluída. Clique para iniciar outra distância.';
    return 'Marcar o ponto inicial da medição em' + pos + '.';
  }
  return 'Prévia da ferramenta ' + toolLabel(tool) + '.';
}

function drawPreviewCell(cell, fill, stroke) {
  if (!cell) return;
  cx.save();
  cx.fillStyle = fill;
  cx.fillRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2);
  cx.strokeStyle = stroke;
  cx.lineWidth = 2 / zoom;
  cx.setLineDash([5 / zoom, 3 / zoom]);
  cx.strokeRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2);
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
    cx.fillRect((cell.x - 1) * CELL, (cell.y - 1) * CELL, CELL * 3, CELL * 3);
    cx.strokeRect((cell.x - 1) * CELL, (cell.y - 1) * CELL, CELL * 3, CELL * 3);
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
      var dist = Math.max(Math.abs(cell.x - measurePts[0].x), Math.abs(cell.y - measurePts[0].y));
      cx.save();
      cx.strokeStyle = '#ffeb3b'; cx.lineWidth = 2 / zoom;
      cx.setLineDash([6 / zoom, 4 / zoom]);
      cx.beginPath(); cx.moveTo(start.x, start.y); cx.lineTo(center.x, center.y); cx.stroke();
      cx.setLineDash([]);
      cx.fillStyle = 'rgba(0,0,0,0.8)';
      cx.font = (14 / zoom) + 'px sans-serif'; cx.textAlign = 'center';
      cx.fillText(dist + ' quad. (' + (dist * 1.5).toFixed(1) + ' m)', (start.x + center.x) / 2, (start.y + center.y) / 2 - 8 / zoom);
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
      cx.strokeRect(hovered.x * CELL + 2, hovered.y * CELL + 2, sq * CELL - 4, sq * CELL - 4);
      cx.restore();
    } else drawPreviewCell(cell, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.65)');
  }

  var info = $('#mp-preview');
  if (info) info.textContent = previewDescription(cell);
}

function drawFogAndLight() {
  var player = state.tokens.find(function (t) { return t.tipo === 'player'; }) || state.tokens[0];
  var px = player ? player.x : -1;
  var py = player ? player.y : -1;
  var r = player ? (player.luz || lightRadius) : 0;

  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      if (isCurrentlyVisible(x, y, px, py, r)) continue;
      if (state.fog[idx(x, y)]) {
        cx.fillStyle = 'rgba(0,0,0,1)';
        cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
      } else if (dynLight) {
        cx.fillStyle = 'rgba(0,0,0,0.5)';
        cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
      }
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
  var c = cellCenter(t.x + (sq - 1) / 2, t.y + (sq - 1) / 2);
  var r = sq * CELL * 0.42;
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
      (t.tipo === 'player' ? ' · Luz ' + (t.luz || lightRadius) : '')
    : (pendingMonster ? 'Coloque: <b>' + esc(pendingMonster.nome) + '</b>' : 'Nenhum token selecionado');
  h.innerHTML = info + '<br><small>' + toolLabel(tool) + ' · Zoom ' + Math.round(zoom * 100) + '%</small>';
}

function toolLabel(t) {
  return ({
    select: 'Selecionar/Mover', pan: 'Mover vista',
    wall: 'Parede (quadrado)', erasewall: 'Apagar parede',
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
  // se veio de posição anterior, checa arestas no caminho (só ortho step-by-step feito no move)
  return true;
}

function canStep(fromX, fromY, toX, toY, token) {
  if (!canOccupy(toX, toY, token)) return false;
  if (!blockMove) return true;
  // movimento em um passo: se não for adjacente, permite (drag livre) mas checa destino
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
      if (x >= 0 && x < COLS && y >= 0 && y < ROWS) state.fog[idx(x, y)] = val;
    }
  }
}

function revealAround(cx, cy, radius) {
  var r = Math.ceil(radius);
  for (var dy = -r; dy <= r; dy++) {
    for (var dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > radius * radius + 0.5) continue;
      var x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
      if (hasLOS(cx, cy, x, y)) state.fog[idx(x, y)] = 0;
    }
  }
}

// ---------- Input ----------
function onPointerDown(e) {
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

  // Muro / Porta / Apagar aresta — trabalha na linha mais próxima
  if (tool === 'muro' || tool === 'porta' || tool === 'eraseedge') {
    var edge = nearestEdge(world.x, world.y);
    var cur = getEdgeVal(edge);
    if (tool === 'muro') {
      setEdgeVal(edge, EDGE_MURO);
      drag = { edgePaint: true, mode: 'muro' };
    } else if (tool === 'porta') {
      // Uma sequência de portas encostadas abre/fecha como uma única porta.
      if (isDoorEdge(cur)) setDoorRunValue(edge, doorRunIsClosed(edge) ? EDGE_DOOR_O : EDGE_DOOR_C);
      else setEdgeVal(edge, EDGE_DOOR_C);
      drag = { edgePaint: true, mode: 'porta' };
    } else {
      // Apagar qualquer trecho de uma porta agrupada remove o conjunto inteiro.
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
    // clique em porta para abrir/fechar rapidamente (atalho)
    var edge2 = nearestEdge(world.x, world.y);
    var ev = getEdgeVal(edge2);
    // só se clicou bem perto da linha
    var gx = world.x / CELL, gy = world.y / CELL;
    var fx = Math.abs(gx - Math.round(gx)), fy = Math.abs(gy - Math.round(gy));
    var nearLine = Math.min(fx, fy) < 0.12;
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
  var previewRect = cv.getBoundingClientRect();
  previewPointer = screenToWorld(e.clientX - previewRect.left, e.clientY - previewRect.top);
  if (!drag) { draw(); return; }
  if (drag.pan) {
    ox = drag.ox + (e.clientX - drag.x);
    oy = drag.oy + (e.clientY - drag.y);
    draw();
    return;
  }
  if (drag.edgePaint) {
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
  if (!drag) { previewPointer = null; draw(); }
}

function onWheel(e) {
  e.preventDefault();
  var rect = cv.getBoundingClientRect();
  var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
  var before = screenToWorld(sx, sy);
  var factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
  zoom = Math.max(0.12, Math.min(2.5, zoom * factor));
  var after = screenToWorld(sx, sy);
  ox += (after.x - before.x) * zoom;
  oy += (after.y - before.y) * zoom;
  draw();
}

function onKey(e) {
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
    wall: 'Parede: o quadrado destacado ficará bloqueado para movimento e visão.',
    erasewall: 'Apagar parede: o quadrado destacado ficará livre.',
    muro: 'Muro: a linha destacada bloqueará passagem e linha de visão.',
    porta: 'Porta: a linha destacada receberá uma porta; clique novamente para alternar aberta/fechada.',
    eraseedge: 'Apagar linha: o muro ou a porta destacados serão removidos.',
    spawn: 'Início: o marcador e o círculo mostram a nova posição e o alcance de luz.',
    reveal: 'Revelar: a área destacada de 3 × 3 quadrados perderá a névoa.',
    hide: 'Ocultar: a área destacada de 3 × 3 quadrados ficará coberta pela névoa.',
    token: 'Token: a silhueta mostra onde a criatura selecionada será colocada.',
    measure: 'Medir: clique para marcar o início e mova o cursor para ver a distância.'
  })[t] || 'A prévia acompanha o cursor.';
}

function mount(el) {
  R = el;
  R.innerHTML =
    '<div class="mp vtt" id="mp-root">' +
    '<div class="mp-bar">' +
    '<span class="mp-title">☠ Tumba dos Horrores</span>' +
    '<div class="mp-g" id="mp-tools">' +
    '<button data-t="select" class="on" title="Selecionar / Mover · clique na porta para abrir/fechar">↖ Selecionar</button>' +
    '<button data-t="pan" title="Mover vista">✋ Mover</button>' +
    '<button data-t="wall" title="Parede no quadrado (bloqueia tudo)">🧱 Parede</button>' +
    '<button data-t="erasewall" title="Apagar parede de quadrado">🧹 Apagar parede</button>' +
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
    '<button id="mp-clear-walls" title="Remover todas as paredes dos quadrados (pede confirmação)">Limpar paredes</button>' +
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
    '<b>Parede</b> = quadrado inteiro.<br>' +
    '<b>Muro</b> = linha do grid (bloqueia luz 100%).<br>' +
    '<b>Porta</b> = linha; laranja=fechada, verde=aberta. Clique de novo ou use Selecionar na porta para abrir/fechar.</small>' +
    '</aside>' +
    '<div class="mp-main">' +
    '<canvas id="mp-cv"></canvas>' +
    '<div id="mp-hud"></div>' +
    '<div id="mp-preview" class="mp-preview">Selecione uma ferramenta para ver a prévia da ação.</div>' +
    '<div id="mp-st">Roda=zoom · Espaço=pan · G grid · F névoa · L luz · W muros</div>' +
    '</div></div></div>';

  cv = $('#mp-cv');
  cx = cv.getContext('2d');

  cv.addEventListener('pointerdown', onPointerDown);
  cv.addEventListener('pointermove', onPointerMove);
  cv.addEventListener('pointerleave', onPointerLeave);
  cv.addEventListener('pointerup', onPointerUp);
  cv.addEventListener('pointercancel', onPointerUp);
  cv.addEventListener('wheel', onWheel, { passive: false });
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });

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
    if (confirm('Revelar o mapa inteiro? A névoa será removida de todos os quadrados.')) {
      state.fog = makeGrid(0); save(); draw();
    }
  };
  $('#mp-clear-walls').onclick = function () {
    if (confirm('Apagar todas as paredes de quadrado?')) {
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
  $('#mp-zo').onclick = function () { zoom = Math.max(0.12, zoom / 1.2); draw(); };
  $('#mp-zi').onclick = function () { zoom = Math.min(2.5, zoom * 1.2); draw(); };

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

  $('#mp-grid').classList.toggle('on', showGrid);
  $('#mp-fog').classList.toggle('on', showFog);
  $('#mp-light').classList.toggle('on', dynLight);
  $('#mp-walls-vis').classList.toggle('on', showWalls);
  if ($('#mp-preview')) $('#mp-preview').textContent = toolPreviewHelp(tool);

  function tryMonsters() { renderMonsterList($('#mp-q') ? $('#mp-q').value : ''); }
  tryMonsters();
  if (window.MONSTERS_READY) window.MONSTERS_READY.then(tryMonsters);

  loadBackgrounds(function () {
    zoom = 0.4;
    ox = 80;
    oy = -MAP_H * zoom + (cv.clientHeight || 500) - 80;
    draw();
  });
  draw();
}

function unmount() {
  document.removeEventListener('keydown', onKey);
  document.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('resize', draw);
  R = null; cv = null; cx = null; bgImages = []; previewPointer = null;
}

window.MapEditor = { mount: mount, unmount: unmount };
})();
