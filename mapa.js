/* mapa.js — VTT estilo Roll20 para animalysson RPG
 * Mapa com imagem de fundo, grid, tokens, fog of war e iluminação dinâmica.
 * Uso: MapEditor.mount(el) / MapEditor.unmount()
 */
(function () {
'use strict';

var KEY = 'animalysson-vtt-v1';
var CELL = 36; // px por quadrado (72×95 → ~2592×3420)
var COLS = 72, ROWS = 95;
var MAP_W = 2592, MAP_H = 3420;

// Partes da imagem de fundo (Tumba dos Horrores)
var PARTS = [
  { src: 'mapas/tumba-dos-horrores/hi_part1.webp', x: 0,    y: 0,    w: 1332, h: 1692 },
  { src: 'mapas/tumba-dos-horrores/hi_part2.webp', x: 1332, y: 0,    w: 1260, h: 1692 },
  { src: 'mapas/tumba-dos-horrores/hi_part3.webp', x: 0,    y: 1692, w: 1332, h: 1728 },
  { src: 'mapas/tumba-dos-horrores/hi_part4.webp', x: 1332, y: 1692, w: 1260, h: 1728 }
];

var R = null, cv = null, cx = null;
var zoom = 0.35, ox = 40, oy = 40;
var tool = 'select'; // select | pan | reveal | hide | token | light | measure
var drag = null, space = false;
var showGrid = true, showFog = true, dynLight = true;
var lightRadius = 6; // quadrados (tocha ≈ 6)
var selected = null;
var measurePts = null;

// Estado do mapa
var state = load() || defaultState();

function defaultState() {
  return {
    v: 1,
    nome: 'Tumba dos Horrores',
    tokens: [
      { id: 'p1', nome: 'Aventureiro', tipo: 'player', x: 35, y: 88, cor: '#4fc3f7', raio: 1, luz: 6 }
    ],
    fog: makeFog(true)
  };
}

function makeFog(covered) {
  var f = new Array(COLS * ROWS);
  for (var i = 0; i < f.length; i++) f[i] = covered ? 1 : 0;
  return f;
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return null;
    var s = JSON.parse(raw);
    if (!s || !s.tokens) return null;
    if (!s.fog || s.fog.length !== COLS * ROWS) s.fog = makeFog(true);
    return s;
  } catch (e) { return null; }
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}

function $(s) { return R.querySelector(s); }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

// ---------- Imagens de fundo ----------
var bgImages = [];
var bgReady = 0;

function loadBackgrounds(cb) {
  bgImages = [];
  bgReady = 0;
  PARTS.forEach(function (p, i) {
    var img = new Image();
    img.onload = function () {
      bgReady++;
      if (bgReady === PARTS.length && cb) cb();
      draw();
    };
    img.onerror = function () { bgReady++; draw(); };
    img.src = p.src;
    bgImages[i] = img;
  });
}

// ---------- Conversões ----------
function screenToWorld(sx, sy) {
  return { x: (sx - ox) / zoom, y: (sy - oy) / zoom };
}
function worldToCell(wx, wy) {
  return {
    x: Math.max(0, Math.min(COLS - 1, Math.floor(wx / CELL))),
    y: Math.max(0, Math.min(ROWS - 1, Math.floor(wy / CELL)))
  };
}
function cellCenter(cx, cy) {
  return { x: (cx + 0.5) * CELL, y: (cy + 0.5) * CELL };
}

// ---------- Desenho ----------
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

  // 1. Fundo (imagem da Tumba)
  PARTS.forEach(function (p, i) {
    var img = bgImages[i];
    if (img && img.complete && img.naturalWidth) {
      cx.drawImage(img, p.x, p.y, p.w, p.h);
    } else {
      cx.fillStyle = '#1a1a1c';
      cx.fillRect(p.x, p.y, p.w, p.h);
    }
  });

  // 2. Grid
  if (showGrid) {
    cx.strokeStyle = 'rgba(255,255,255,0.18)';
    cx.lineWidth = 1 / zoom;
    cx.beginPath();
    for (var x = 0; x <= COLS; x++) {
      cx.moveTo(x * CELL, 0);
      cx.lineTo(x * CELL, ROWS * CELL);
    }
    for (var y = 0; y <= ROWS; y++) {
      cx.moveTo(0, y * CELL);
      cx.lineTo(COLS * CELL, y * CELL);
    }
    cx.stroke();
  }

  // 3. Fog of war + iluminação dinâmica
  if (showFog) {
    drawFogAndLight();
  }

  // 4. Tokens
  state.tokens.forEach(function (t) {
    drawToken(t, t === selected);
  });

  // 5. Medição
  if (measurePts && measurePts.length === 2) {
    var a = cellCenter(measurePts[0].x, measurePts[0].y);
    var b = cellCenter(measurePts[1].x, measurePts[1].y);
    cx.strokeStyle = '#ffeb3b';
    cx.lineWidth = 2 / zoom;
    cx.setLineDash([6 / zoom, 4 / zoom]);
    cx.beginPath();
    cx.moveTo(a.x, a.y);
    cx.lineTo(b.x, b.y);
    cx.stroke();
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
}

function drawFogAndLight() {
  var player = state.tokens.find(function (t) { return t.tipo === 'player'; }) || state.tokens[0];

  cx.fillStyle = 'rgba(0,0,0,0.92)';
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      if (state.fog[y * COLS + x]) {
        if (dynLight && player) {
          var dx = x - player.x, dy = y - player.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var r = (player.luz || lightRadius);
          if (dist <= r) continue;
          if (dist <= r + 1.5) {
            cx.fillStyle = 'rgba(0,0,0,0.55)';
            cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
            cx.fillStyle = 'rgba(0,0,0,0.92)';
            continue;
          }
        }
        cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
      }
    }
  }

  if (dynLight && player) {
    var c = cellCenter(player.x, player.y);
    var rPx = (player.luz || lightRadius) * CELL;
    var grd = cx.createRadialGradient(c.x, c.y, rPx * 0.15, c.x, c.y, rPx);
    grd.addColorStop(0, 'rgba(255, 220, 140, 0.18)');
    grd.addColorStop(0.7, 'rgba(255, 180, 80, 0.06)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = grd;
    cx.beginPath();
    cx.arc(c.x, c.y, rPx, 0, Math.PI * 2);
    cx.fill();
  }
}

function drawToken(t, sel) {
  var c = cellCenter(t.x, t.y);
  var r = (t.raio || 1) * CELL * 0.42;
  cx.beginPath();
  cx.arc(c.x, c.y, r, 0, Math.PI * 2);
  cx.fillStyle = t.cor || (t.tipo === 'player' ? '#4fc3f7' : '#e57373');
  cx.fill();
  if (sel) {
    cx.strokeStyle = '#fff';
    cx.lineWidth = 3 / zoom;
    cx.stroke();
  } else {
    cx.strokeStyle = 'rgba(0,0,0,0.6)';
    cx.lineWidth = 1.5 / zoom;
    cx.stroke();
  }
  cx.fillStyle = '#111';
  cx.font = 'bold ' + (Math.max(10, 13 / zoom)) + 'px sans-serif';
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.fillText((t.nome || '?').charAt(0).toUpperCase(), c.x, c.y + 1);
}

function updateHud() {
  var h = $('#mp-hud');
  if (!h) return;
  var t = selected;
  var info = t
    ? '<b>' + esc(t.nome) + '</b> (' + t.x + ', ' + t.y + ')' +
      (t.tipo === 'player' ? ' · Luz: ' + (t.luz || lightRadius) + ' quad.' : '')
    : 'Nenhum token selecionado';
  h.innerHTML = info +
    '<br><small>Ferramenta: <b>' + toolLabel(tool) + '</b> · Zoom: ' + Math.round(zoom * 100) + '%</small>';
}

function toolLabel(t) {
  return {
    select: 'Selecionar / Mover',
    pan: 'Mover vista',
    reveal: 'Revelar névoa',
    hide: 'Ocultar névoa',
    token: 'Colocar token',
    light: 'Raio de luz',
    measure: 'Medir'
  }[t] || t;
}

// ---------- Interação ----------
function onPointerDown(e) {
  cv.setPointerCapture(e.pointerId);
  var rect = cv.getBoundingClientRect();
  var sx = e.clientX - rect.left, sy = e.clientY - rect.top;
  var world = screenToWorld(sx, sy);
  var cell = worldToCell(world.x, world.y);

  if (tool === 'pan' || e.button === 1 || e.button === 2 || space) {
    drag = { pan: true, x: e.clientX, y: e.clientY, ox: ox, oy: oy };
    return;
  }

  if (tool === 'select') {
    var hit = null;
    for (var i = state.tokens.length - 1; i >= 0; i--) {
      var t = state.tokens[i];
      if (Math.abs(t.x - cell.x) <= (t.raio || 1) - 0.1 && Math.abs(t.y - cell.y) <= (t.raio || 1) - 0.1) {
        hit = t; break;
      }
    }
    selected = hit;
    if (hit) {
      drag = { moveToken: hit, startX: hit.x, startY: hit.y };
    }
    draw();
    return;
  }

  if (tool === 'reveal' || tool === 'hide') {
    drag = { brush: true, mode: tool };
    applyBrush(cell.x, cell.y, tool === 'reveal' ? 0 : 1);
    draw();
    return;
  }

  if (tool === 'token') {
    var nome = prompt('Nome do token:', 'Monstro');
    if (!nome) return;
    var tok = {
      id: 't' + Date.now().toString(36),
      nome: nome,
      tipo: 'npc',
      x: cell.x, y: cell.y,
      cor: '#e57373',
      raio: 1,
      luz: 0
    };
    state.tokens.push(tok);
    selected = tok;
    save();
    draw();
    return;
  }

  if (tool === 'measure') {
    if (!measurePts) measurePts = [cell];
    else if (measurePts.length === 1) {
      measurePts.push(cell);
      draw();
    } else {
      measurePts = [cell];
      draw();
    }
    return;
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
  if (drag.moveToken) {
    var rect = cv.getBoundingClientRect();
    var world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    var cell = worldToCell(world.x, world.y);
    drag.moveToken.x = cell.x;
    drag.moveToken.y = cell.y;
    if (drag.moveToken.tipo === 'player' && dynLight) {
      revealAround(cell.x, cell.y, drag.moveToken.luz || lightRadius);
    }
    draw();
    return;
  }
  if (drag.brush) {
    var rect2 = cv.getBoundingClientRect();
    var world2 = screenToWorld(e.clientX - rect2.left, e.clientY - rect2.top);
    var cell2 = worldToCell(world2.x, world2.y);
    applyBrush(cell2.x, cell2.y, drag.mode === 'reveal' ? 0 : 1);
    draw();
  }
}

function onPointerUp(e) {
  if (drag && (drag.moveToken || drag.brush)) save();
  drag = null;
}

function applyBrush(cx, cy, val) {
  var r = 1;
  for (var dy = -r; dy <= r; dy++) {
    for (var dx = -r; dx <= r; dx++) {
      var x = cx + dx, y = cy + dy;
      if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
        state.fog[y * COLS + x] = val;
      }
    }
  }
}

function revealAround(cx, cy, radius) {
  var r = Math.ceil(radius);
  for (var dy = -r; dy <= r; dy++) {
    for (var dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= radius * radius + 0.5) {
        var x = cx + dx, y = cy + dy;
        if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
          state.fog[y * COLS + x] = 0;
        }
      }
    }
  }
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
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selected && selected.tipo !== 'player') {
      state.tokens = state.tokens.filter(function (t) { return t !== selected; });
      selected = null;
      save();
      draw();
    }
  }
  if (e.key === 'g' || e.key === 'G') { showGrid = !showGrid; draw(); }
  if (e.key === 'f' || e.key === 'F') { showFog = !showFog; draw(); }
  if (e.key === 'l' || e.key === 'L') { dynLight = !dynLight; draw(); }
}

function onKeyUp(e) {
  if (e.code === 'Space') space = false;
}

// ---------- UI ----------
function setTool(t) {
  tool = t;
  measurePts = null;
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
    '<button data-t="select" class="on" title="Selecionar / Mover token">↖ Selecionar</button>' +
    '<button data-t="pan" title="Mover a vista">✋ Mover</button>' +
    '<button data-t="reveal" title="Revelar névoa (GM)">☀ Revelar</button>' +
    '<button data-t="hide" title="Ocultar névoa">🌑 Ocultar</button>' +
    '<button data-t="token" title="Colocar token">♟ Token</button>' +
    '<button data-t="measure" title="Medir distância">📏 Medir</button>' +
    '</div>' +
    '<button id="mp-grid" title="Alternar grid (G)">Grid</button>' +
    '<button id="mp-fog" title="Alternar névoa (F)">Névoa</button>' +
    '<button id="mp-light" title="Iluminação dinâmica (L)">Luz</button>' +
    '<label class="mp-luz">Raio luz <input id="mp-lr" type="number" min="0" max="20" value="6" style="width:48px"></label>' +
    '<button id="mp-reset-fog" title="Cobrir tudo de novo">Reset Névoa</button>' +
    '<button id="mp-clear-fog" title="Revelar mapa inteiro">Revelar Tudo</button>' +
    '<button id="mp-zo">−</button><button id="mp-zi">+</button>' +
    '</div>' +
    '<div class="mp-main">' +
    '<canvas id="mp-cv"></canvas>' +
    '<div id="mp-hud"></div>' +
    '<div id="mp-st">Arraste tokens · Roda = zoom · Espaço/botão meio = pan · G grid · F névoa · L luz</div>' +
    '</div></div>';

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
  $('#mp-lr').onchange = function () {
    lightRadius = +this.value || 0;
    var p = state.tokens.find(function (t) { return t.tipo === 'player'; });
    if (p) { p.luz = lightRadius; save(); }
    draw();
  };
  $('#mp-reset-fog').onclick = function () {
    if (confirm('Cobrir todo o mapa com névoa novamente?')) {
      state.fog = makeFog(true);
      save();
      draw();
    }
  };
  $('#mp-clear-fog').onclick = function () {
    state.fog = makeFog(false);
    save();
    draw();
  };
  $('#mp-zo').onclick = function () {
    zoom = Math.max(0.12, zoom / 1.2);
    draw();
  };
  $('#mp-zi').onclick = function () {
    zoom = Math.min(2.5, zoom * 1.2);
    draw();
  };

  document.addEventListener('keydown', onKey);
  document.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', draw);

  $('#mp-grid').classList.toggle('on', showGrid);
  $('#mp-fog').classList.toggle('on', showFog);
  $('#mp-light').classList.toggle('on', dynLight);

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
  R = null;
  cv = null;
  cx = null;
  bgImages = [];
}

window.MapEditor = { mount: mount, unmount: unmount };
})();
