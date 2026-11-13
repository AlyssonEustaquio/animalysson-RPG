/* mapa.js — VTT estilo Roll20
 * Fundo Tumba dos Horrores + grid + fog + luz dinâmica com paredes + movimento + spawn
 */
(function () {
'use strict';

var KEY = 'animalysson-vtt-v3';
var CELL = 36;
var COLS = 72, ROWS = 95;
var MAP_W = 2592, MAP_H = 3420;

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
var blockMove = true; // impedir tokens de atravessar paredes

var state = load() || defaultState();
var bgImages = [];
var bgReady = 0;

function defaultState() {
  return {
    v: 3,
    nome: 'Tumba dos Horrores',
    tokens: [
      { id: 'p1', nome: 'Aventureiro', tipo: 'player', x: 35, y: 88, cor: '#4fc3f7', raio: 1, luz: 6, hp: null, hpMax: null }
    ],
    fog: makeGrid(1),   // 1 = coberto
    walls: makeGrid(0)  // 1 = parede (bloqueia luz e movimento)
  };
}

function makeGrid(val) {
  var a = new Array(COLS * ROWS);
  for (var i = 0; i < a.length; i++) a[i] = val;
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
function isWall(x, y) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
  return !!state.walls[idx(x, y)];
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

// ---------- LOS (Bresenham) ----------
function hasLOS(x0, y0, x1, y1) {
  // linha do centro do origin até o centro do target; paredes bloqueiam
  if (x0 === x1 && y0 === y1) return true;
  var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  var sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;
  var x = x0, y = y0;
  while (true) {
    if (x === x1 && y === y1) return true;
    // não bloqueia a própria célula de origem
    if (!(x === x0 && y === y0) && isWall(x, y)) return false;
    var e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += sx; }
    if (e2 < dx) { err += dx; y += sy; }
    // se o próximo passo cair na parede antes do destino, bloqueia
    if (!(x === x1 && y === y1) && isWall(x, y)) return false;
  }
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

  // paredes (semi-transparent overlay para o GM ver)
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

  // marcador de spawn do jogador
  var player = state.tokens.find(function (t) { return t.tipo === 'player'; });
  if (player && tool === 'spawn') {
    var sc = cellCenter(player.x, player.y);
    cx.strokeStyle = '#4fc3f7';
    cx.lineWidth = 2 / zoom;
    cx.setLineDash([4 / zoom, 4 / zoom]);
    cx.strokeRect(player.x * CELL, player.y * CELL, CELL, CELL);
    cx.setLineDash([]);
  }

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

function drawFogAndLight() {
  var player = state.tokens.find(function (t) { return t.tipo === 'player'; }) || state.tokens[0];
  var px = player ? player.x : -1;
  var py = player ? player.y : -1;
  var r = player ? (player.luz || lightRadius) : 0;

  cx.fillStyle = 'rgba(0,0,0,0.92)';
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      // paredes sempre "sólidas" visualmente na névoa? não — fog só em células cobertas
      if (!state.fog[idx(x, y)]) continue;

      if (dynLight && player) {
        var dx = x - px, dy = y - py;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= r + 0.01) {
          // só revela se houver linha de visão livre de paredes
          if (hasLOS(px, py, x, y)) continue; // iluminado → sem fog
          // sem LOS: mantém fog (luz não passa da parede)
        } else if (dist <= r + 1.5) {
          if (hasLOS(px, py, x, y)) {
            cx.fillStyle = 'rgba(0,0,0,0.55)';
            cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
            cx.fillStyle = 'rgba(0,0,0,0.92)';
            continue;
          }
        }
      }
      cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
    }
  }

  // brilho suave só onde há LOS
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
    reveal: 'Revelar névoa', hide: 'Ocultar névoa',
    wall: 'Pintar parede', erasewall: 'Apagar parede',
    token: 'Colocar token', spawn: 'Definir início do jogador',
    measure: 'Medir'
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
  if (blockMove && isWall(cell.x, cell.y)) return;
  var sq = sizeSquares(m);
  var tok = {
    id: 't' + Date.now().toString(36),
    monsterId: m.id,
    nome: m.nome,
    tipo: 'npc',
    x: cell.x, y: cell.y,
    cor: colorForMonster(m),
    raio: sq,
    luz: 0,
    nd: m.nd,
    hp: m.pontosVida,
    hpMax: m.pontosVida
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
      if (isWall(x + dx, y + dy)) return false;
    }
  }
  return true;
}

function applyWallBrush(cx, cy, val, radius) {
  var r = radius == null ? 0 : radius;
  for (var dy = -r; dy <= r; dy++) {
    for (var dx = -r; dx <= r; dx++) {
      var x = cx + dx, y = cy + dy;
      if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
        state.walls[idx(x, y)] = val;
      }
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
      if (blockMove && !canOccupy(cell.x, cell.y, player)) {
        alert('Não é possível iniciar em cima de uma parede.');
        return;
      }
      player.x = cell.x;
      player.y = cell.y;
    }
    selected = player;
    // revela área inicial
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
    if (blockMove && isWall(cell.x, cell.y)) return;
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
    if (canOccupy(cell2.x, cell2.y, drag.moveToken)) {
      drag.moveToken.x = cell2.x;
      drag.moveToken.y = cell2.y;
      if (drag.moveToken.tipo === 'player' && dynLight) {
        revealAround(cell2.x, cell2.y, drag.moveToken.luz || lightRadius);
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
  if (drag && (drag.moveToken || drag.brush || drag.wall)) save();
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
    '<button data-t="select" class="on" title="Selecionar / Mover">↖ Selecionar</button>' +
    '<button data-t="pan" title="Mover vista">✋ Mover</button>' +
    '<button data-t="wall" title="Pintar parede (bloqueia luz e movimento)">🧱 Parede</button>' +
    '<button data-t="erasewall" title="Apagar parede">🧹 Apagar muro</button>' +
    '<button data-t="spawn" title="Definir onde o jogador começa">📍 Início</button>' +
    '<button data-t="reveal" title="Revelar névoa">☀ Revelar</button>' +
    '<button data-t="hide" title="Ocultar névoa">🌑 Ocultar</button>' +
    '<button data-t="token" title="Token livre">♟ Token</button>' +
    '<button data-t="measure" title="Medir">📏 Medir</button>' +
    '</div>' +
    '<button id="mp-grid" title="Grid (G)">Grid</button>' +
    '<button id="mp-fog" title="Névoa (F)">Névoa</button>' +
    '<button id="mp-light" title="Luz dinâmica (L)">Luz</button>' +
    '<button id="mp-walls-vis" title="Mostrar paredes (W)">Ver muros</button>' +
    '<label class="mp-luz"><input id="mp-block" type="checkbox" checked> Bloquear movimento</label>' +
    '<label class="mp-luz">Raio <input id="mp-lr" type="number" min="0" max="20" value="6" style="width:44px"></label>' +
    '<button id="mp-reset-fog">Reset Névoa</button>' +
    '<button id="mp-clear-fog">Revelar Tudo</button>' +
    '<button id="mp-clear-walls" title="Apagar todas as paredes">Limpar muros</button>' +
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
    'Parede bloqueia luz e movimento. Use <b>Início</b> para definir o spawn do jogador. Tecla <b>W</b> mostra/oculta muros.</small>' +
    '</aside>' +
    '<div class="mp-main">' +
    '<canvas id="mp-cv"></canvas>' +
    '<div id="mp-hud"></div>' +
    '<div id="mp-st">Roda = zoom · Espaço = pan · G grid · F névoa · L luz · W muros</div>' +
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
    if (confirm('Apagar todas as paredes do mapa?')) {
      state.walls = makeGrid(0); save(); draw();
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
