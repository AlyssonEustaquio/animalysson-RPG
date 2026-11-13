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

  state.tokens.forEach(function (t) { drawToken(t, t === selected); });

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
  // horizontais
  for (var ye = 0; ye <= ROWS; ye++) {
    for (var x = 0; x < COLS; x++) {
      var v = getH(x, ye);
      if (!v) continue;
      var x0 = x * CELL, y0 = ye * CELL, x1 = (x + 1) * CELL;
      if (v === EDGE_MURO) {
        cx.strokeStyle = '#c62828';
        cx.lineWidth = lw;
        cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y0); cx.stroke();
      } else if (v === EDGE_DOOR_C) {
        cx.strokeStyle = '#8d6e63';
        cx.lineWidth = lw;
        cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y0); cx.stroke();
        // marca de porta fechada
        cx.fillStyle = '#ffcc80';
        cx.beginPath();
        cx.arc((x0 + x1) / 2, y0, 4 / zoom, 0, Math.PI * 2);
        cx.fill();
      } else if (v === EDGE_DOOR_O) {
        cx.strokeStyle = 'rgba(141,110,99,0.35)';
        cx.lineWidth = lw * 0.7;
        cx.setLineDash([6 / zoom, 4 / zoom]);
        cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y0); cx.stroke();
        cx.setLineDash([]);
        cx.fillStyle = '#a5d6a7';
        cx.beginPath();
        cx.arc((x0 + x1) / 2, y0, 4 / zoom, 0, Math.PI * 2);
        cx.fill();
      }
    }
  }
  // verticais
  for (var y = 0; y < ROWS; y++) {
    for (var xe = 0; xe <= COLS; xe++) {
      var vv = getV(xe, y);
      if (!vv) continue;
      var xx = xe * CELL, yy0 = y * CELL, yy1 = (y + 1) * CELL;
      if (vv === EDGE_MURO) {
        cx.strokeStyle = '#c62828';
        cx.lineWidth = lw;
        cx.beginPath(); cx.moveTo(xx, yy0); cx.lineTo(xx, yy1); cx.stroke();
      } else if (vv === EDGE_DOOR_C) {
        cx.strokeStyle = '#8d6e63';
        cx.lineWidth = lw;
        cx.beginPath(); cx.moveTo(xx, yy0); cx.lineTo(xx, yy1); cx.stroke();
        cx.fillStyle = '#ffcc80';
        cx.beginPath();
        cx.arc(xx, (yy0 + yy1) / 2, 4 / zoom, 0, Math.PI * 2);
        cx.fill();
      } else if (vv === EDGE_DOOR_O) {
        cx.strokeStyle = 'rgba(141,110,99,0.35)';
        cx.lineWidth = lw * 0.7;
        cx.setLineDash([6 / zoom, 4 / zoom]);
        cx.beginPath(); cx.moveTo(xx, yy0); cx.lineTo(xx, yy1); cx.stroke();
        cx.setLineDash([]);
        cx.fillStyle = '#a5d6a7';
        cx.beginPath();
        cx.arc(xx, (yy0 + yy1) / 2, 4 / zoom, 0, Math.PI * 2);
        cx.fill();
      }
    }
  }
}

function isCurrentlyVisible(x, y, px, py, r) {
  if (!dynLight) return !state.fog[idx(x, y)];
  if (px < 0) return false;
  var dx = x - px, dy = y - py;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > r + 0.01) return false;
  return hasLOS(px, py, x, y);
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
      // se já é porta, alterna aberta/fechada; senão cria fechada
      if (cur === EDGE_DOOR_C) setEdgeVal(edge, EDGE_DOOR_O);
      else if (cur === EDGE_DOOR_O) setEdgeVal(edge, EDGE_DOOR_C);
      else setEdgeVal(edge, EDGE_DOOR_C);
      drag = { edgePaint: true, mode: 'porta' };
    } else {
      setEdgeVal(edge, EDGE_NONE);
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
    if (nearLine && (ev === EDGE_DOOR_C || ev === EDGE_DOOR_O)) {
      setEdgeVal(edge2, ev === EDGE_DOOR_C ? EDGE_DOOR_O : EDGE_DOOR_C);
      save();
      draw();
      return;
    }

    var hit = null;
    for (var i = state.tokens.length - 1; i >= 0; i--) {
      var t = state.tokens[i];
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
  if (!drag) return;
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
    } else setEdgeVal(edge, EDGE_NONE);
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
  draw();
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
    '<button id="mp-reset-fog">Reset Névoa</button>' +
    '<button id="mp-clear-fog">Revelar Tudo</button>' +
    '<button id="mp-clear-walls">Limpar paredes</button>' +
    '<button id="mp-clear-edges">Limpar muros/portas</button>' +
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
    '<div id="mp-st">Roda=zoom · Espaço=pan · G grid · F névoa · L luz · W muros</div>' +
    '</div></div></div>';

  cv = $('#mp-cv');
  cx = cv.getContext('2d');

  cv.addEventListener('pointerdown', onPointerDown);
  cv.addEventListener('pointermove', onPointerMove);
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
  $('#mp-clear-fog').onclick = function () { state.fog = makeGrid(0); save(); draw(); };
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
  R = null; cv = null; cx = null; bgImages = [];
}

window.MapEditor = { mount: mount, unmount: unmount };
})();
