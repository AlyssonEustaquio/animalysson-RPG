(function () {
'use strict';

var MAPS = {
  tumba: {
    nome: 'Tumba dos Horrores', icone: '☠',
    key: 'animalysson-vtt-v4',
    stateFile: 'mapas/tumba-dos-horrores/Tumba dos Horrores.json',
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
    stateFile: 'mapas/flanaess_mapa/Flanaess 598 CY.json',
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
var CUSTOM_MAPS_KEY = 'animalysson-vtt-mapas-customizados-v1';
var DELETED_CUSTOM_MAPS_KEY = 'animalysson-vtt-mapas-excluidos-v1';
var MAP_CATALOG_FILE = 'mapas/mapas.json';
var mapId = 'tumba', MAPINFO = null;
var preferredMapId = 'tumba';
var hexSize = 'small';
var KEY, CELL, COLS, ROWS, MAP_W, MAP_H, PARTS;
try { preferredMapId = localStorage.getItem(MAP_ID_KEY) || 'tumba'; mapId = preferredMapId; } catch (e) {}

function serializableMapConfig(info) {
  var copy = JSON.parse(JSON.stringify(info || {}));
  (copy.parts || []).forEach(function (part) { delete part.localSrc; });
  if (copy.detail) delete copy.detail.runtimeTiles;
  return copy;
}
function customMapEntries() {
  return Object.keys(MAPS).filter(function (id) { return !!MAPS[id].custom; }).map(function (id) {
    return { id: id, config: serializableMapConfig(MAPS[id]) };
  });
}
function persistCustomMaps() {
  try { localStorage.setItem(CUSTOM_MAPS_KEY, JSON.stringify(customMapEntries())); } catch (e) {}
}
function deletedCustomMapIds() {
  try {
    var ids = JSON.parse(localStorage.getItem(DELETED_CUSTOM_MAPS_KEY) || '[]');
    return Array.isArray(ids) ? ids : [];
  } catch (e) { return []; }
}
function isCustomMapDeleted(id) {
  return deletedCustomMapIds().indexOf(id) >= 0;
}
function rememberDeletedCustomMap(id) {
  var ids = deletedCustomMapIds();
  if (ids.indexOf(id) < 0) ids.push(id);
  try { localStorage.setItem(DELETED_CUSTOM_MAPS_KEY, JSON.stringify(ids)); } catch (e) {}
}
function clearDeletedCustomMap(id) {
  var ids = deletedCustomMapIds().filter(function (savedId) { return savedId !== id; });
  try { localStorage.setItem(DELETED_CUSTOM_MAPS_KEY, JSON.stringify(ids)); } catch (e) {}
}
function registerCustomMap(id, config, runtimeImageSrc) {
  if (!id || !config || !config.nome || !config.w || !config.h || !config.parts || !config.parts.length) return false;
  var saved = serializableMapConfig(config);
  saved.custom = true;
  if (runtimeImageSrc && saved.parts[0]) saved.parts[0].localSrc = runtimeImageSrc;
  if (config.detail && config.detail.runtimeTiles && saved.detail) {
    saved.detail.runtimeTiles = config.detail.runtimeTiles;
  }
  MAPS[id] = saved;
  return true;
}
function loadStoredCustomMaps() {
  try {
    var entries = JSON.parse(localStorage.getItem(CUSTOM_MAPS_KEY) || '[]');
    if (!Array.isArray(entries)) return;
    entries.forEach(function (entry) {
      if (entry && entry.id && !MAPS[entry.id] && !isCustomMapDeleted(entry.id)) registerCustomMap(entry.id, entry.config);
    });
  } catch (e) {}
}
loadStoredCustomMaps();
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
    return '<option value="' + esc(id) + '"' + (id === mapId ? ' selected' : '') + '>' + esc(MAPS[id].icone + ' ' + MAPS[id].nome) + '</option>';
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
var worldTravelRaf = null;   // id do requestAnimationFrame da viagem
var worldTravelStep = null;  // passo em andamento: { from, to, toPt, t0 }
var worldTravelPos = null;   // posição visual (px do mapa) do personagem durante a viagem
var worldTravelCarry = null; // instante em que o passo anterior terminou (evita engasgo entre hexágonos)
var worldTravelPath = [];
var worldTravelTarget = null;
var KEY_STEP_MS = 140;       // tempo para andar 1 quadrado com as setas (velocidade constante)
var MOVE_KEYS = { ArrowLeft: 1, ArrowRight: 1, ArrowUp: 1, ArrowDown: 1 };
var keysHeld = {};           // setas atualmente pressionadas
var keyMoveRaf = null;       // requestAnimationFrame do movimento por teclado
var keyMoveStep = null;      // passo em andamento: { from, to, dur, t0 }
var keyMoveVis = null;       // posição visual (px do mapa) do personagem enquanto desliza
var keyMoveCarry = null;     // instante em que o passo anterior terminou (sem engasgo entre quadrados)
var keyMoveLastSave = 0;
var WORLD_TRAVEL_STEP_MS = 2000; // tempo para atravessar 1 hexágono (velocidade constante, sem pulos)

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
  // Não grava a migração automaticamente. Primeiro precisamos comparar o
  // salvamento local com o JSON versionado no GitHub, se ele existir.
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
    spawn: { x: MAPINFO.spawn.x, y: MAPINFO.spawn.y },
    portals: isHexMap() ? [] : undefined,
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

function normalizeMapState(s) {
  if (!s || !Array.isArray(s.tokens)) return null;
  var fallbackSpawn = MAPINFO.spawn || { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) };
  if (!s.spawn || !isFinite(Number(s.spawn.x)) || !isFinite(Number(s.spawn.y))) {
    s.spawn = { x: fallbackSpawn.x, y: fallbackSpawn.y };
  }
  s.spawn = {
    x: Math.max(0, Math.min(COLS - 1, Math.round(Number(s.spawn.x)))),
    y: Math.max(0, Math.min(ROWS - 1, Math.round(Number(s.spawn.y))))
  };
  MAPINFO.spawn = { x: s.spawn.x, y: s.spawn.y };
  if (isHexMap()) {
    if (!s.gridMode && s.fog && s.fog.length === MAPS.flanaess.cols * MAPS.flanaess.rows) s._legacySquareTokens = true;
    if (!Array.isArray(s.portals)) s.portals = [];
    s.portals = s.portals.filter(function (portal) {
      return portal && isFinite(Number(portal.x)) && isFinite(Number(portal.y)) && portal.destMapId;
    }).map(function (portal) {
      var portalColor = String(portal.color || '#36a9e1');
      if (!/^#[0-9a-f]{6}$/i.test(portalColor)) portalColor = '#36a9e1';
      return {
        id: portal.id || ('portal-' + String(portal.x) + '-' + String(portal.y)),
        x: Math.max(0, Math.min(COLS - 1, Math.round(Number(portal.x)))),
        y: Math.max(0, Math.min(ROWS - 1, Math.round(Number(portal.y)))),
        destMapId: String(portal.destMapId),
        color: portalColor.toLowerCase()
      };
    });
    s.fog = []; s.walls = []; s.hEdges = []; s.vEdges = [];
    return s;
  }
  if (!s.fog || s.fog.length !== COLS * ROWS) s.fog = makeGrid(1);
  if (!s.walls || s.walls.length !== COLS * ROWS) s.walls = makeGrid(0);
  if (!s.hEdges || s.hEdges.length !== COLS * (ROWS + 1)) s.hEdges = makeArr(COLS * (ROWS + 1), 0);
  if (!s.vEdges || s.vEdges.length !== (COLS + 1) * ROWS) s.vEdges = makeArr((COLS + 1) * ROWS, 0);
  return s;
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return normalizeMapState(JSON.parse(raw));
  } catch (e) { return null; }
}

function loadRepositoryMapCatalog(done) {
  if (typeof window.fetch !== 'function') { done(); return; }
  fetch(MAP_CATALOG_FILE + '?v=' + Date.now(), { cache: 'no-store' })
    .then(function (response) { if (!response.ok) return null; return response.json(); })
    .then(function (payload) {
      if (!payload || payload.format !== 'animalysson-rpg-map-catalog' || !Array.isArray(payload.maps)) return;
      payload.maps.forEach(function (entry) {
        if (!entry || !entry.id || !entry.config || isCustomMapDeleted(entry.id) || MAPS[entry.id] && !MAPS[entry.id].custom) return;
        var localInfo = MAPS[entry.id];
        var runtimeSrc = localInfo && localInfo.parts && localInfo.parts[0] ? localInfo.parts[0].localSrc : null;
        registerCustomMap(entry.id, entry.config, runtimeSrc);
      });
      persistCustomMaps();
    })
    .catch(function () {
      // O catálogo ainda não foi publicado. Os mapas locais continuam disponíveis.
    })
    .then(function () { done(); });
}

function loadRepositoryMapState(done) {
  var requestedMapId = mapId;
  var file = MAPINFO && MAPINFO.stateFile;
  if (!file || typeof window.fetch !== 'function') { done(); return; }

  var localSavedAt = Number(state && state._savedAt) || 0;
  fetch(encodeURI(file) + '?v=' + Date.now(), { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) return null;
      return response.json();
    })
    .then(function (payload) {
      if (mapId !== requestedMapId || !payload) return;
      if (payload.format !== 'animalysson-rpg-map' || payload.mapId !== requestedMapId || !payload.state) return;
      var remoteSavedAt = Date.parse(payload.exportedAt) || 0;
      if (remoteSavedAt <= localSavedAt) return;
      var remoteState = normalizeMapState(payload.state);
      if (!remoteState) return;
      remoteState._savedAt = remoteSavedAt;
      state = migrateFlanaessState(remoteState);
    })
    .catch(function () {
      // JSON ainda não publicado (ou execução local sem servidor): segue com o estado local.
    })
    .then(function () { done(); });
}

function downloadBlob(blob, filename) {
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
}

function exportMapCatalog(allowEmpty) {
  var entries = customMapEntries();
  if (!entries.length && !allowEmpty) {
    alert('Ainda não há mapas adicionados pelo botão +.');
    return;
  }
  var payload = {
    format: 'animalysson-rpg-map-catalog',
    version: 1,
    updatedAt: new Date().toISOString(),
    maps: entries
  };
  downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }), 'mapas.json');
}

function exportMapFile() {
  var mapFolder = MAPINFO.folder || (MAPINFO.stateFile ? MAPINFO.stateFile.substring(0, MAPINFO.stateFile.lastIndexOf('/') + 1) : 'mapas/');
  var assets = (MAPINFO.parts || []).map(function (part) { return part.src; });
  if (MAPINFO.detail) {
    for (var detailRow = 0; detailRow < MAPINFO.detail.n; detailRow++) {
      for (var detailCol = 0; detailCol < MAPINFO.detail.n; detailCol++) {
        assets.push(MAPINFO.detail.src.replace('{r}', detailRow).replace('{c}', detailCol));
      }
    }
  }
  var exportedState = isHexMap()
    ? { v: 4, nome: MAPINFO.nome, gridMode: FLANAESS_GRID_MODE, spawn: state.spawn || MAPINFO.spawn, portals: state.portals || [], tokens: state.tokens || [] }
    : JSON.parse(JSON.stringify(state));
  if (exportedState && Object.prototype.hasOwnProperty.call(exportedState, '_savedAt')) delete exportedState._savedAt;
  var payload = {
    format: 'animalysson-rpg-map',
    version: 1,
    mapId: mapId,
    mapName: MAPINFO.nome,
    exportedAt: new Date().toISOString(),
    dimensions: { width: MAP_W, height: MAP_H, columns: COLS, rows: ROWS },
    imageFolder: mapFolder,
    images: assets,
    mapConfig: serializableMapConfig(MAPINFO),
    catalogFile: MAPINFO.custom ? MAP_CATALOG_FILE : null,
    state: exportedState
  };
  downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }), safeMapFileName(MAPINFO.nome) + '.json');
}

function revokeMapRuntimeUrls(info) {
  if (!info) return;
  (info.parts || []).forEach(function (part) {
    if (part.localSrc && String(part.localSrc).indexOf('blob:') === 0) {
      try { URL.revokeObjectURL(part.localSrc); } catch (e) {}
    }
  });
  var tiles = info.detail && info.detail.runtimeTiles;
  if (tiles) Object.keys(tiles).forEach(function (key) {
    if (String(tiles[key]).indexOf('blob:') === 0) {
      try { URL.revokeObjectURL(tiles[key]); } catch (e) {}
    }
  });
}

function deleteCurrentCustomMap() {
  if (!MAPINFO || !MAPINFO.custom) {
    alert('Os mapas originais do projeto não podem ser excluídos. Este botão remove somente mapas adicionados pelo botão +.');
    return;
  }

  var deletedId = mapId;
  var deletedInfo = MAPINFO;
  var host = R;
  var confirmed = window.confirm(
    'Excluir o mapa "' + deletedInfo.nome + '"?\n\n' +
    'Ele será removido do seletor e os dados salvos deste mapa serão apagados deste navegador.\n\n' +
    'Um novo mapas.json será baixado para atualizar o catálogo no GitHub. Os arquivos já publicados na pasta mapas/' + deletedId + '/ não são apagados automaticamente; remova essa pasta do GitHub se também quiser excluir as imagens e o JSON.'
  );
  if (!confirmed) return;

  save();
  try { localStorage.removeItem(deletedInfo.key); } catch (e) {}
  rememberDeletedCustomMap(deletedId);
  revokeMapRuntimeUrls(deletedInfo);
  delete MAPS[deletedId];
  persistCustomMaps();

  preferredMapId = 'tumba';
  try { localStorage.setItem(MAP_ID_KEY, 'tumba'); } catch (e) {}
  exportMapCatalog(true);

  stopWorldTravel(false);
  unmount();
  applyMap('tumba');
  state = migrateFlanaessState(load() || defaultState());
  selected = null; pendingMonster = null; measurePts = null; drag = null;
  mount(host);
  alert('Mapa excluído do seletor neste navegador. O catálogo mapas.json atualizado foi baixado. Publique esse arquivo em mapas/mapas.json no GitHub e, se desejar apagar também as imagens e dados antigos, exclua a pasta mapas/' + deletedId + '/ do repositório.');
}

function canvasToWebp(canvas, quality) {
  return new Promise(function (resolve, reject) {
    if (!canvas.toBlob) { reject(new Error('Este navegador não oferece conversão WebP pelo canvas.')); return; }
    canvas.toBlob(function (blob) {
      if (!blob) { reject(new Error('Não foi possível gerar a imagem WebP.')); return; }
      if (blob.type !== 'image/webp') { reject(new Error('O navegador não conseguiu exportar WebP. Use uma versão atualizada do Chrome, Edge ou Firefox.')); return; }
      resolve(blob);
    }, 'image/webp', quality);
  });
}

function imageRegionToWebp(image, sx, sy, sw, sh, outW, outH, quality) {
  var canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(outW));
  canvas.height = Math.max(1, Math.round(outH));
  var context = canvas.getContext('2d', { alpha: false });
  if (!context) return Promise.reject(new Error('Não foi possível preparar o canvas de otimização.'));
  context.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in context) context.imageSmoothingQuality = 'high';
  context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvasToWebp(canvas, quality).then(function (blob) {
    canvas.width = 1; canvas.height = 1;
    return blob;
  }, function (error) {
    canvas.width = 1; canvas.height = 1;
    throw error;
  });
}

function crc32Bytes(bytes) {
  var crc = 0xFFFFFFFF;
  for (var i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (var bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ZIP sem compressão adicional: os WebP já chegam comprimidos pelo encoder.
function createImagesZip(entries) {
  return Promise.all(entries.map(function (entry) {
    return entry.blob.arrayBuffer().then(function (buffer) {
      var bytes = new Uint8Array(buffer);
      return { name: entry.name, nameBytes: new TextEncoder().encode(entry.name), bytes: bytes, crc: crc32Bytes(bytes) };
    });
  })).then(function (files) {
    var localParts = [], centralParts = [], offset = 0, centralSize = 0;
    var now = new Date();
    var dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
    var dosDate = ((Math.max(1980, now.getFullYear()) - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    files.forEach(function (file) {
      var local = new Uint8Array(30 + file.nameBytes.length);
      var lv = new DataView(local.buffer);
      lv.setUint32(0, 0x04034B50, true); lv.setUint16(4, 20, true);
      lv.setUint16(6, 0x0800, true); lv.setUint16(8, 0, true);
      lv.setUint16(10, dosTime, true); lv.setUint16(12, dosDate, true);
      lv.setUint32(14, file.crc, true); lv.setUint32(18, file.bytes.length, true);
      lv.setUint32(22, file.bytes.length, true); lv.setUint16(26, file.nameBytes.length, true);
      lv.setUint16(28, 0, true); local.set(file.nameBytes, 30);
      localParts.push(local, file.bytes);

      var central = new Uint8Array(46 + file.nameBytes.length);
      var cv = new DataView(central.buffer);
      cv.setUint32(0, 0x02014B50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true); cv.setUint16(10, 0, true);
      cv.setUint16(12, dosTime, true); cv.setUint16(14, dosDate, true);
      cv.setUint32(16, file.crc, true); cv.setUint32(20, file.bytes.length, true);
      cv.setUint32(24, file.bytes.length, true); cv.setUint16(28, file.nameBytes.length, true);
      cv.setUint16(30, 0, true); cv.setUint16(32, 0, true); cv.setUint16(34, 0, true);
      cv.setUint32(36, 0, true); cv.setUint32(38, 0, true); cv.setUint32(42, offset, true);
      central.set(file.nameBytes, 46);
      centralParts.push(central);
      offset += local.length + file.bytes.length;
      centralSize += central.length;
    });
    var end = new Uint8Array(22), ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054B50, true); ev.setUint16(4, 0, true); ev.setUint16(6, 0, true);
    ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true);
    ev.setUint32(12, centralSize, true); ev.setUint32(16, offset, true); ev.setUint16(20, 0, true);
    return new Blob(localParts.concat(centralParts, [end]), { type: 'application/zip' });
  });
}

function optimizeMapImage(image, width, height) {
  var maxEdge = Math.max(width, height);
  var baseMaxEdge = 3000;
  var baseScale = Math.min(1, baseMaxEdge / maxEdge);
  var baseW = Math.max(1, Math.round(width * baseScale));
  var baseH = Math.max(1, Math.round(height * baseScale));
  var tasks = [{ name: 'imagem.webp', sx: 0, sy: 0, sw: width, sh: height, outW: baseW, outH: baseH, quality: 0.84 }];
  var detailN = maxEdge > baseMaxEdge ? Math.ceil(maxEdge / 4096) : 0;
  if (detailN) {
    var tileW = width / detailN, tileH = height / detailN;
    for (var r = 0; r < detailN; r++) {
      for (var c = 0; c < detailN; c++) {
        var sx = c * tileW, sy = r * tileH;
        var sw = Math.min(tileW, width - sx), sh = Math.min(tileH, height - sy);
        tasks.push({
          name: 'detalhe/d_' + r + '_' + c + '.webp',
          sx: sx, sy: sy, sw: sw, sh: sh,
          outW: Math.ceil(sw), outH: Math.ceil(sh), quality: 0.86
        });
      }
    }
  }
  var files = [], chain = Promise.resolve();
  // Processa um canvas por vez para não manter vários mapas gigantes na memória.
  tasks.forEach(function (task) {
    chain = chain.then(function () {
      return imageRegionToWebp(image, task.sx, task.sy, task.sw, task.sh, task.outW, task.outH, task.quality)
        .then(function (blob) { files.push({ name: task.name, blob: blob }); });
    });
  });
  return chain.then(function () {
    return { baseBlob: files[0].blob, files: files, detailN: detailN };
  });
}

function slugifyMapName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'novo-mapa';
}
function safeMapFileName(value) {
  return String(value || '').replace(/[\\/:*?"<>|]/g, '-').replace(/[\r\n]+/g, ' ').trim() || 'mapa';
}

function createCustomMapFromFile(file) {
  if (!file || !file.type || file.type.indexOf('image/') !== 0) {
    alert('Selecione um arquivo de imagem válido.');
    return;
  }
  var suggestedName = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Novo mapa';
  var name = window.prompt('Nome do novo mapa:', suggestedName);
  if (!name || !name.trim()) return;
  name = name.trim();
  var cellInput = window.prompt('Tamanho da célula da grade em pixels:', '36');
  if (cellInput == null) return;
  var cell = Number(cellInput);
  if (!isFinite(cell) || cell < 8 || cell > 512) {
    alert('Informe um tamanho de célula entre 8 e 512 pixels.');
    return;
  }

  var imageUrl = URL.createObjectURL(file);
  var image = new Image();
  image.onload = function () {
    (async function () {
      var runtimeUrls = [];
      try {
        var width = image.naturalWidth || image.width;
        var height = image.naturalHeight || image.height;
        if (!width || !height) throw new Error('Não foi possível identificar as dimensões da imagem.');
        if (width * height > 160000000) throw new Error('A imagem ultrapassa o limite de 160 megapixels para otimização segura no navegador. Reduza a imagem antes de importar.');
        var optimized = await optimizeMapImage(image, width, height);
        var zipBlob = await createImagesZip(optimized.files);
        var id = slugifyMapName(name);
        var suffix = 2;
        while (MAPS[id]) { id = slugifyMapName(name) + '-' + suffix; suffix++; }
        var cols = Math.ceil(width / cell), rows = Math.ceil(height / cell);
        if (cols * rows > 500000) throw new Error('A grade ficaria grande demais. Escolha um tamanho de célula maior.');

        clearDeletedCustomMap(id);
        var folder = 'mapas/' + id + '/';
        var stateFileName = safeMapFileName(name) + '.json';
        var baseUrl = URL.createObjectURL(optimized.baseBlob);
        runtimeUrls.push(baseUrl);
        var runtimeTiles = {};
        optimized.files.forEach(function (entry) {
          if (entry.name.indexOf('detalhe/') !== 0) return;
          var tileMatch = entry.name.match(/d_(\d+)_(\d+)\.webp$/);
          if (!tileMatch) return;
          var tileUrl = URL.createObjectURL(entry.blob);
          runtimeUrls.push(tileUrl);
          runtimeTiles[tileMatch[1] + '_' + tileMatch[2]] = tileUrl;
        });
        var config = {
          nome: name,
          icone: '🗺️',
          key: 'animalysson-vtt-custom-' + id,
          custom: true,
          folder: folder,
          stateFile: folder + stateFileName,
          cell: cell,
          cols: cols,
          rows: rows,
          w: width,
          h: height,
          spawn: { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
          fit: true,
          maxZoom: 4,
          parts: [{ src: folder + 'imagem.webp', x: 0, y: 0, w: width, h: height }]
        };
        config.parts[0].localSrc = baseUrl;
        if (optimized.detailN) {
          config.detail = {
            src: folder + 'detalhe/d_{r}_{c}.webp',
            n: optimized.detailN,
            minZoom: 1.1,
            runtimeTiles: runtimeTiles
          };
        }
        if (!registerCustomMap(id, config, baseUrl)) throw new Error('Não foi possível adicionar este mapa.');
        persistCustomMaps();

        var zipName = safeMapFileName(name) + '-imagens-webp.zip';
        downloadBlob(zipBlob, zipName);

        var host = R;
        stopWorldTravel(false);
        save();
        unmount();
        applyMap(id);
        try { localStorage.setItem(MAP_ID_KEY, id); } catch (e) {}
        state = defaultState();
        showGrid = true; showFog = true; dynLight = true; showWalls = true;
        selected = null; pendingMonster = null; measurePts = null; drag = null;
        save();
        mount(host);
        var detailMessage = optimized.detailN
          ? 'O ZIP contém imagem.webp e ' + (optimized.detailN * optimized.detailN) + ' blocos WebP de detalhe, carregados conforme o zoom.'
          : 'O ZIP contém imagem.webp otimizada em WebP.';
        alert('Mapa adicionado e otimizado! ' + detailMessage + '\n\nExtraia o ZIP dentro de "' + folder + '". Depois baixe o catálogo mapas.json pelo menu e coloque-o em "mapas/mapas.json". Use Salvar mapa para baixar "' + stateFileName + '" na mesma pasta.');
      } catch (error) {
        runtimeUrls.forEach(function (url) { try { URL.revokeObjectURL(url); } catch (e) {} });
        alert(error && error.message ? error.message : 'Não foi possível otimizar a imagem do mapa.');
      } finally {
        URL.revokeObjectURL(imageUrl);
      }
    })();
  };
  image.onerror = function () {
    URL.revokeObjectURL(imageUrl);
    alert('Não foi possível abrir essa imagem.');
  };
  image.src = imageUrl;
}

function save() {
  try {
    state._savedAt = Date.now();
    if (isHexMap()) {
      state.gridMode = FLANAESS_GRID_MODE;
      localStorage.setItem(KEY, JSON.stringify({
        v: 4, nome: MAPINFO.nome, gridMode: state.gridMode,
        spawn: state.spawn || MAPINFO.spawn,
        portals: state.portals || [],
        tokens: state.tokens || [], _savedAt: state._savedAt
      }));
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
    img.src = p.localSrc || p.src;
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
        var runtimeTile = d.runtimeTiles && d.runtimeTiles[k];
        t.img.src = runtimeTile || d.src.replace('{r}', r).replace('{c}', c);
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

function focusCameraOnPlayer(viewW, viewH) {
  if (!isHexMap() || !cv) return;
  zoom = FLANAESS_ZOOM; // Flanaess fixo em 300%.
  var player = currentPlayer();
  if (!player) return;
  var center = worldTravelPos || cellCenter(player.x, player.y);
  // O canvas aplica translate(ox, oy) antes de scale(zoom, zoom).
  // Portanto, o deslocamento precisa compensar a coordenada já multiplicada pelo zoom.
  var width = viewW == null ? cv.clientWidth : viewW;
  var height = viewH == null ? cv.clientHeight : viewH;
  ox = width / 2 - center.x * zoom;
  oy = height / 2 - center.y * zoom;
}

function stopWorldTravel(shouldSave) {
  if (worldTravelRaf != null) {
    window.cancelAnimationFrame(worldTravelRaf);
    worldTravelRaf = null;
  }
  worldTravelPath = [];
  worldTravelTarget = null;
  worldTravelStep = null;
  worldTravelPos = null;
  worldTravelCarry = null;
  if (shouldSave && isHexMap()) save();
}

// Para a viagem de forma suave: termina o hexágono atual e não continua o resto do caminho.
function haltWorldTravel() {
  worldTravelPath = [];
  worldTravelTarget = null;
  if (!worldTravelStep) stopWorldTravel(true);
  draw();
}

function worldTravelFrame(now) {
  worldTravelRaf = null;
  var player = currentPlayer();
  if (!player || !isHexMap() || !cv) { stopWorldTravel(false); return; }

  while (true) {
    if (!worldTravelStep) {
      var next = worldTravelPath.shift();
      if (!next) break;
      var toPt = cellCenter(next.x, next.y);
      worldTravelStep = {
        from: cellCenter(player.x, player.y), to: next, toPt: toPt,
        t0: worldTravelCarry != null ? worldTravelCarry : now
      };
      worldTravelCarry = null;
    }
    var st = worldTravelStep;
    var p = (now - st.t0) / WORLD_TRAVEL_STEP_MS;
    if (p >= 1) {
      // Chegou ao hexágono: grava a posição lógica e segue para o próximo sem pausa.
      player.x = st.to.x; player.y = st.to.y;
      selected = player;
      save();
      var reachedPortal = findWorldPortalAt(player.x, player.y);
      if (reachedPortal) {
        worldTravelPath = []; worldTravelTarget = null;
        worldTravelStep = null; worldTravelPos = null; worldTravelCarry = null;
        teleportThroughWorldPortal(reachedPortal);
        return;
      }
      worldTravelCarry = st.t0 + WORLD_TRAVEL_STEP_MS;
      worldTravelStep = null;
      continue;
    }
    worldTravelPos = {
      x: st.from.x + (st.toPt.x - st.from.x) * p,
      y: st.from.y + (st.toPt.y - st.from.y) * p
    };
    draw();
    worldTravelRaf = window.requestAnimationFrame(worldTravelFrame);
    return;
  }

  worldTravelPos = null;
  worldTravelCarry = null;
  worldTravelTarget = null;
  save();
  draw();
}

function startWorldTravel(destination) {
  var player = currentPlayer();
  if (!isHexMap() || !player || !destination) return;
  // Se já está andando, o novo caminho parte do hexágono para onde ele está indo agora.
  var origin = worldTravelStep ? worldTravelStep.to : { x: player.x, y: player.y };
  if (destination.x === origin.x && destination.y === origin.y) {
    var standingPortal = findWorldPortalAt(destination.x, destination.y);
    if (standingPortal) { teleportThroughWorldPortal(standingPortal); return; }
    worldTravelPath = [];
    worldTravelTarget = null;
    draw();
    return;
  }
  worldTravelPath = hexLine(origin, destination).slice(1);
  worldTravelTarget = { x: destination.x, y: destination.y };
  if (worldTravelRaf == null) worldTravelRaf = window.requestAnimationFrame(worldTravelFrame);
  draw();
}

function drawWorldPortals() {
  if (!isHexMap() || !Array.isArray(state.portals)) return;
  state.portals.forEach(function (portal) {
    var center = cellCenter(portal.x, portal.y);
    var color = /^#[0-9a-f]{6}$/i.test(String(portal.color || '')) ? portal.color : '#36a9e1';
    cx.save();
    // Destaque discreto: apenas o contorno do tile, com 40% de opacidade
    // e a mesma espessura da linha normal da grade.
    cx.globalAlpha = 0.40;
    hexPath(cx, center, null, color, 1 / zoom);
    cx.restore();
  });
}

function drawWorldTravelPath() {
  if (!isHexMap()) return;
  var player = currentPlayer();
  if (!player || (!worldTravelPath.length && !worldTravelStep)) return;
  var points = [];
  if (worldTravelStep) points.push(worldTravelStep.toPt);
  worldTravelPath.forEach(function (cell) { points.push(cellCenter(cell.x, cell.y)); });
  if (!points.length) return;
  var start = worldTravelPos || cellCenter(player.x, player.y);
  cx.save();
  cx.strokeStyle = 'rgba(255, 215, 75, 0.9)';
  cx.fillStyle = 'rgba(255, 215, 75, 0.95)';
  cx.lineWidth = 3 / zoom;
  cx.setLineDash([7 / zoom, 5 / zoom]);
  cx.beginPath();
  cx.moveTo(start.x, start.y);
  points.forEach(function (pt) { cx.lineTo(pt.x, pt.y); });
  cx.stroke();
  var end = points[points.length - 1];
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
  else {
    drawWorldTravelPath();
    drawWorldPortals();
  }

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

function setMapSpawn(cell, player) {
  if (!cell) return;
  var point = {
    x: Math.max(0, Math.min(COLS - 1, Math.round(cell.x))),
    y: Math.max(0, Math.min(ROWS - 1, Math.round(cell.y)))
  };
  state.spawn = point;
  MAPINFO.spawn = { x: point.x, y: point.y };
  if (MAPINFO.custom) persistCustomMaps();
  if (player) { player.x = point.x; player.y = point.y; }
  save();
}

function findWorldPortalAt(x, y) {
  if (!isHexMap() || !Array.isArray(state.portals)) return null;
  return state.portals.find(function (portal) { return portal.x === x && portal.y === y; }) || null;
}

function closePortalDialog(overlay) {
  if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
}

function createPortalDialog(titleText, descriptionText) {
  var root = R && R.querySelector('#mp-root');
  if (!root) return null;
  var overlay = document.createElement('div');
  overlay.className = 'mp-portal-dialog-overlay';
  var panel = document.createElement('div');
  panel.className = 'mp-portal-dialog';
  var title = document.createElement('h3');
  title.textContent = titleText;
  var description = document.createElement('p');
  description.textContent = descriptionText;
  panel.appendChild(title);
  panel.appendChild(description);
  overlay.appendChild(panel);
  root.appendChild(overlay);
  return { overlay: overlay, panel: panel };
}

function showPortalColorPicker(initialColor, onApply) {
  var dialog = createPortalDialog('Cor do teleporte', 'Escolha uma cor para o contorno discreto do hexágono.');
  if (!dialog) return;
  var colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = /^#[0-9a-f]{6}$/i.test(String(initialColor || '')) ? initialColor : '#36a9e1';
  colorInput.className = 'mp-portal-color-input';
  colorInput.setAttribute('aria-label', 'Escolher cor do hexágono do teleporte');
  dialog.panel.appendChild(colorInput);

  var actions = document.createElement('div');
  actions.className = 'mp-portal-dialog-actions';
  var cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.textContent = 'Cancelar';
  cancel.onclick = function () { closePortalDialog(dialog.overlay); };
  var apply = document.createElement('button');
  apply.type = 'button';
  apply.className = 'primary';
  apply.textContent = 'Confirmar cor';
  apply.onclick = function () {
    var chosenColor = colorInput.value;
    closePortalDialog(dialog.overlay);
    if (typeof onApply === 'function') onApply(chosenColor);
  };
  actions.appendChild(cancel);
  actions.appendChild(apply);
  dialog.panel.appendChild(actions);
  colorInput.click();
}

function showExistingPortalActions(portal) {
  var destinationName = (MAPS[portal.destMapId] && MAPS[portal.destMapId].nome) || portal.destMapId;
  var dialog = createPortalDialog('Teleporte existente', 'Destino: ' + destinationName + '. Você pode mudar a cor deste hexágono ou remover o teleporte.');
  if (!dialog) return;
  var actions = document.createElement('div');
  actions.className = 'mp-portal-dialog-actions mp-portal-dialog-actions-stack';

  var recolor = document.createElement('button');
  recolor.type = 'button';
  recolor.className = 'primary';
  recolor.textContent = '🎨 Mudar cor';
  recolor.onclick = function () {
    closePortalDialog(dialog.overlay);
    showPortalColorPicker(portal.color || '#36a9e1', function (color) {
      portal.color = color;
      save(); draw();
    });
  };

  var remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'danger';
  remove.textContent = '🗑 Remover teleporte';
  remove.onclick = function () {
    closePortalDialog(dialog.overlay);
    if (window.confirm('Remover o teleporte deste hexágono?')) {
      state.portals = state.portals.filter(function (item) { return item !== portal; });
      save(); draw();
    }
  };

  var cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.textContent = 'Cancelar';
  cancel.onclick = function () { closePortalDialog(dialog.overlay); };

  actions.appendChild(recolor);
  actions.appendChild(remove);
  actions.appendChild(cancel);
  dialog.panel.appendChild(actions);
}

function placeWorldPortal(cell) {
  if (!isHexMap() || !cell) return;
  if (!Array.isArray(state.portals)) state.portals = [];
  var existing = findWorldPortalAt(cell.x, cell.y);
  if (existing) {
    showExistingPortalActions(existing);
    return;
  }
  var options = Object.keys(MAPS).filter(function (id) { return id !== mapId; });
  if (!options.length) { alert('Adicione outro mapa primeiro usando o botão + do seletor.'); return; }
  var menu = options.map(function (id, index) { return (index + 1) + '. ' + MAPS[id].nome; }).join('\n');
  var answer = window.prompt('Escolha o mapa de destino digitando o número:\n\n' + menu, '1');
  if (answer == null || !String(answer).trim()) return;
  var destination = options[Number(answer) - 1];
  if (!destination) {
    destination = options.find(function (id) {
      return id.toLowerCase() === String(answer).trim().toLowerCase() || MAPS[id].nome.toLowerCase() === String(answer).trim().toLowerCase();
    });
  }
  if (!destination) { alert('Destino inválido. Nenhum teleporte foi criado.'); return; }
  showPortalColorPicker('#36a9e1', function (color) {
    state.portals.push({
      id: 'portal-' + Date.now().toString(36),
      x: cell.x,
      y: cell.y,
      destMapId: destination,
      color: color
    });
    save(); draw();
  });
}

function teleportThroughWorldPortal(portal) {
  if (!portal || !MAPS[portal.destMapId]) {
    alert('O mapa de destino deste teleporte não está disponível. Atualize o catálogo mapas/mapas.json.');
    draw();
    return;
  }
  var destinationId = portal.destMapId;
  var host = R;
  save();
  stopWorldTravel(false);
  tool = 'select';
  preferredMapId = destinationId;
  try { localStorage.setItem(MAP_ID_KEY, destinationId); } catch (e) {}
  unmount();
  applyMap(destinationId);
  state = migrateFlanaessState(load() || defaultState());
  loadRepositoryMapState(function () {
    if (!host || !MAPS[destinationId] || mapId !== destinationId) return;
    var spawn = state.spawn || MAPINFO.spawn || { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) };
    spawn = {
      x: Math.max(0, Math.min(COLS - 1, Math.round(Number(spawn.x) || 0))),
      y: Math.max(0, Math.min(ROWS - 1, Math.round(Number(spawn.y) || 0)))
    };
    state.spawn = { x: spawn.x, y: spawn.y };
    MAPINFO.spawn = { x: spawn.x, y: spawn.y };
    var player = currentPlayer();
    if (!player) {
      player = { id: 'p1', nome: 'Aventureiro', tipo: 'player', x: spawn.x, y: spawn.y, cor: '#4fc3f7', raio: 1, luz: 6, hp: null, hpMax: null };
      state.tokens.unshift(player);
    } else {
      player.x = spawn.x; player.y = spawn.y;
      if (!player.tipo) player.tipo = 'player';
    }
    selected = player;
    save();
    mountNow(host);
  });
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
    var c = (!isHexMap() && keyMoveVis && player === currentPlayer()) ? keyMoveVis : cellCenter(px, py);
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
  var c = isHexMap()
    ? ((worldTravelPos && t === currentPlayer()) ? worldTravelPos : cellCenter(t.x, t.y))
    : ((keyMoveVis && t === currentPlayer()) ? keyMoveVis : cellCenter(t.x + (sq - 1) / 2, t.y + (sq - 1) / 2));
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
    var worldCell = worldToCell(worldPoint.x, worldPoint.y);
    if (tool === 'portal') { placeWorldPortal(worldCell); return; }
    if (tool === 'spawn') {
      stopWorldTravel(false);
      var worldPlayer = currentPlayer();
      if (!worldPlayer) {
        worldPlayer = { id: 'p1', nome: 'Aventureiro', tipo: 'player', x: worldCell.x, y: worldCell.y, cor: '#4fc3f7', raio: 1, luz: 6, hp: null, hpMax: null };
        state.tokens.unshift(worldPlayer);
      }
      setMapSpawn(worldCell, worldPlayer);
      selected = worldPlayer;
      draw();
      return;
    }
    startWorldTravel(worldCell);
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
    setMapSpawn(cell, player);
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

// ---------- Movimento do personagem com as setas (mapas de quadrados, ex.: Tumba) ----------
function tokenAnchor(t, x, y) {
  var sq = t.raio || 1;
  return cellCenter(x + (sq - 1) / 2, y + (sq - 1) / 2);
}

function heldDirection() {
  var dx = (keysHeld.ArrowRight ? 1 : 0) - (keysHeld.ArrowLeft ? 1 : 0);
  var dy = (keysHeld.ArrowDown ? 1 : 0) - (keysHeld.ArrowUp ? 1 : 0);
  return (dx || dy) ? { dx: dx, dy: dy } : null;
}

// Diagonal bloqueada? Tenta deslizar só na horizontal ou só na vertical.
function pickKeyStep(pl, dir) {
  var cands = [];
  if (dir.dx && dir.dy) cands.push({ x: pl.x + dir.dx, y: pl.y + dir.dy }, { x: pl.x + dir.dx, y: pl.y }, { x: pl.x, y: pl.y + dir.dy });
  else cands.push({ x: pl.x + dir.dx, y: pl.y + dir.dy });
  for (var i = 0; i < cands.length; i++) {
    if (canStep(pl.x, pl.y, cands[i].x, cands[i].y, pl)) return cands[i];
  }
  return null;
}

// A câmera acompanha o personagem suavemente quando ele se aproxima das bordas da tela.
function followKeyMove() {
  if (!keyMoveVis || !cv) return;
  var W = cv.clientWidth, H = cv.clientHeight;
  var sx = keyMoveVis.x * zoom + ox, sy = keyMoveVis.y * zoom + oy;
  var mx = W * 0.3, my = H * 0.3;
  var tx = sx < mx ? mx - sx : (sx > W - mx ? (W - mx) - sx : 0);
  var ty = sy < my ? my - sy : (sy > H - my ? (H - my) - sy : 0);
  ox += tx * 0.25;
  oy += ty * 0.25;
}

function stopKeyMove() {
  if (keyMoveRaf != null) { window.cancelAnimationFrame(keyMoveRaf); keyMoveRaf = null; }
  keyMoveStep = null; keyMoveVis = null; keyMoveCarry = null; keysHeld = {};
}

function keyMoveFrame(now) {
  keyMoveRaf = null;
  var pl = currentPlayer();
  if (!pl || isHexMap() || !cv) { stopKeyMove(); return; }

  while (true) {
    if (!keyMoveStep) {
      var dir = heldDirection();
      var next = dir ? pickKeyStep(pl, dir) : null;
      if (!next) break;
      var from = tokenAnchor(pl, pl.x, pl.y), to = tokenAnchor(pl, next.x, next.y);
      var cells = Math.sqrt(Math.pow(next.x - pl.x, 2) + Math.pow(next.y - pl.y, 2));
      keyMoveStep = { from: from, to: to, dur: KEY_STEP_MS * cells, t0: keyMoveCarry != null ? keyMoveCarry : now };
      keyMoveCarry = null;
      // A posição lógica (luz, névoa, colisão) avança na hora; só o desenho desliza até lá.
      pl.x = next.x; pl.y = next.y;
      if (dynLight) revealAround(pl.x, pl.y, pl.luz || lightRadius);
    }
    var st = keyMoveStep;
    var p = (now - st.t0) / st.dur;
    if (p >= 1) { keyMoveCarry = st.t0 + st.dur; keyMoveStep = null; continue; }
    keyMoveVis = { x: st.from.x + (st.to.x - st.from.x) * p, y: st.from.y + (st.to.y - st.from.y) * p };
    followKeyMove();
    if (now - keyMoveLastSave > 1000) { save(); keyMoveLastSave = now; }
    draw();
    keyMoveRaf = window.requestAnimationFrame(keyMoveFrame);
    return;
  }

  keyMoveVis = null; keyMoveCarry = null;
  save();
  draw();
}

function onKey(e) {
  if (e.key === 'Escape' && menuIsOpen()) { setMenu(false); return; }
  if (isHexMap()) {
    if (e.key === 'Escape') haltWorldTravel();
    return;
  }
  if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (MOVE_KEYS[e.code] && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    if (drag || !currentPlayer()) return;
    keysHeld[e.code] = true;
    if (keyMoveRaf == null) keyMoveRaf = window.requestAnimationFrame(keyMoveFrame);
    return;
  }
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

function onKeyUp(e) {
  if (e.code === 'Space') space = false;
  if (MOVE_KEYS[e.code]) delete keysHeld[e.code];
}
function onWindowBlur() { keysHeld = {}; }

function setTool(t) {
  tool = t;
  measurePts = null;
  if (t !== 'token') pendingMonster = null;
  R.querySelectorAll('#mp-tools button').forEach(function (b) {
    b.classList.toggle('on', b.dataset.t === t);
  });
  var worldSpawnButton = R.querySelector('#mp-world-spawn');
  var worldPortalButton = R.querySelector('#mp-world-portal');
  if (worldSpawnButton) worldSpawnButton.classList.toggle('active', t === 'spawn');
  if (worldPortalButton) worldPortalButton.classList.toggle('active', t === 'portal');
  if (cv) cv.style.cursor = t === 'pan' ? 'grab' : t === 'select' ? 'pointer' : 'crosshair';
  draw();
}

function menuIsOpen() {
  var d = R && R.querySelector('#mp-drawer');
  return !!(d && d.classList.contains('open'));
}

function setMenu(open) {
  if (!R) return;
  var d = R.querySelector('#mp-drawer'), b = R.querySelector('#mp-burger');
  if (!d || !b) return;
  d.classList.toggle('open', open);
  b.classList.toggle('open', open);
  b.setAttribute('aria-expanded', open ? 'true' : 'false');
  b.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  d.setAttribute('aria-hidden', open ? 'false' : 'true');
}

var mountRequestId = 0;
function mount(el) {
  var requestId = ++mountRequestId;
  if (el) el.innerHTML = '<div class="empty-state" style="padding:24px">Carregando mapas e dados salvos…</div>';
  loadRepositoryMapCatalog(function () {
    if (requestId !== mountRequestId) return;
    var desiredMap = preferredMapId;
    try { desiredMap = localStorage.getItem(MAP_ID_KEY) || preferredMapId; } catch (e) {}
    applyMap(MAPS[desiredMap] ? desiredMap : 'tumba');
    state = migrateFlanaessState(load() || defaultState());
    loadRepositoryMapState(function () {
      if (requestId !== mountRequestId) return;
      mountNow(el);
    });
  });
}

function mountNow(el) {
  R = el;
  R.innerHTML =
    '<div class="mp vtt" id="mp-root">' +
    '<div class="mp-wrap vtt-wrap">' +
    '<div class="mp-main">' +
    '<canvas id="mp-cv"></canvas>' +
    '<button type="button" id="mp-burger" class="mp-burger" title="Menu" aria-label="Abrir menu" aria-expanded="false" aria-controls="mp-drawer"><span></span><span></span><span></span></button>' +
    '<div id="mp-drawer" class="mp-drawer" aria-hidden="true">' +
    '<div class="mp-bar">' +
    '<div class="mp-map-selector"><select id="mp-map" class="mp-title" title="Trocar de mapa">' + mapOptions() + '</select>' +
    '<button type="button" id="mp-add-map" class="mp-map-add" title="Adicionar mapa" aria-label="Adicionar mapa">＋</button></div>' +
    '<input type="file" id="mp-add-map-file" accept="image/*" style="display:none">' +
    '<button type="button" id="mp-export" title="Baixar os dados deste mapa em JSON">⬇ Salvar mapa</button>' +
    '<button type="button" id="mp-export-catalog" title="Baixar o catálogo para publicar os mapas adicionados">🗂 Baixar catálogo de mapas</button>' +
    '<label id="mp-hex-wrap" class="mp-luz" style="display:none">Hexágono <select id="mp-hex-size" disabled><option value="small" selected>Pequeno · 6 mi</option></select></label>' +
    '<label id="mp-speed-wrap" class="mp-luz" style="display:none">Velocidade <input id="mp-speed" type="number" min="0.1" step="0.1" placeholder="mi/dia" style="width:62px"></label>' +
    '<button type="button" id="mp-world-spawn" class="mp-world-action" title="Definir o ponto de início deste mapa">📍 Definir início</button>' +
    '<button type="button" id="mp-world-portal" class="mp-world-action" title="Adicionar um teleporte para outro mapa">🌀 Adicionar teleporte</button>' +
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
    '<aside class="mp-side" id="mp-side">' +
    '<h4>Bestiário</h4>' +
    '<input id="mp-q" type="search" placeholder="Buscar monstro…" style="width:100%;margin-bottom:6px">' +
    '<div id="mp-ml" class="mp-ml"></div>' +
    '<h4 style="margin-top:12px">Token selecionado</h4>' +
    '<div id="mp-detail" class="mp-detail"><div class="mp-detail-empty">Selecione um token.</div></div>' +
    '<small style="display:block;margin-top:10px;color:var(--mute)">' +
    (isHexMap() ? '<b>Parede</b> = hexágono bloqueado.<br><b>Flanaess</b> usa deslocamento e medição em hexágonos; muros e portas lineares ficam desativados.' : '<b>Parede</b> = quadrado inteiro.<br><b>Muro</b> = linha do grid (bloqueia luz 100%).<br><b>Porta</b> = linha; laranja=fechada, verde=aberta. Clique de novo ou use Selecionar na porta para abrir/fechar.') + '</small>' +
    '</aside>' +
    '<div class="mp-menu-footer"><button type="button" id="mp-delete-map" class="mp-delete-map" title="Excluir somente mapas adicionados pelo botão +">🗑 Excluir mapa</button></div>' +
    '</div>' + // fim do menu lateral (drawer)
    '</div></div></div>';

  var menuStyle = document.createElement('style');
  menuStyle.textContent =
    '#mp-root{flex:1 1 0;min-height:0;}' +
    '#mp-root .mp-wrap{display:block !important;position:relative !important;flex:1 1 0 !important;height:auto !important;min-height:0 !important;}' +
    '#mp-root .mp-main{display:block !important;position:absolute !important;top:0 !important;right:0 !important;bottom:0 !important;left:0 !important;width:auto !important;height:auto !important;min-width:0 !important;min-height:0 !important;overflow:hidden;}' +
    '#mp-root #mp-cv{display:block;width:100%;height:100%;}' +
    '#mp-root .mp-burger{position:absolute;top:10px;left:10px;z-index:30;width:44px;height:44px;padding:0;border-radius:10px;' +
      'border:1px solid rgba(255,255,255,.28);background:rgba(15,15,18,.82);cursor:pointer;display:flex;flex-direction:column;' +
      'justify-content:center;align-items:center;gap:5px;}' +
    '#mp-root .mp-burger:hover{background:rgba(40,40,46,.92);}' +
    '#mp-root .mp-map-selector{display:flex;align-items:stretch;gap:6px;width:100%;}' +
    '#mp-root .mp-map-selector select{flex:1 1 auto;min-width:0;width:auto !important;}' +
    '#mp-root .mp-map-selector .mp-map-add{flex:0 0 44px;width:44px !important;min-width:44px;height:42px;padding:0;font-size:24px;line-height:1;' +
      'border:1px solid rgba(255,255,255,.25);border-radius:8px;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;}' +
    '#mp-root .mp-map-selector .mp-map-add:hover{background:rgba(255,255,255,.17);}' +
    '#mp-root #mp-export,#mp-root #mp-export-catalog{width:100%;box-sizing:border-box;}' +
    '#mp-root .mp-burger span{display:block;width:22px;height:2px;border-radius:2px;background:#fff;transition:transform .2s,opacity .2s;}' +
    '#mp-root .mp-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}' +
    '#mp-root .mp-burger.open span:nth-child(2){opacity:0;}' +
    '#mp-root .mp-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}' +
    '#mp-root .mp-drawer{position:absolute;top:0;left:0;bottom:0;z-index:25;box-sizing:border-box;width:min(330px,88vw);' +
      'padding:64px 12px 16px;overflow-y:auto;background:rgba(14,14,17,.97);border-right:1px solid rgba(255,255,255,.14);' +
      'box-shadow:4px 0 18px rgba(0,0,0,.45);transform:translateX(-104%);visibility:hidden;' +
      'transition:transform .22s ease,visibility 0s linear .22s;}' +
    '#mp-root .mp-drawer.open{transform:none;visibility:visible;transition:transform .22s ease,visibility 0s;}' +
    '#mp-root .mp-drawer .mp-bar{display:flex !important;flex-direction:column !important;flex-wrap:nowrap !important;align-items:stretch !important;' +
      'gap:8px !important;position:static !important;width:auto !important;height:auto !important;margin:0 !important;padding:0 !important;' +
      'background:none !important;border:0 !important;}' +
    '#mp-root .mp-drawer .mp-bar > button,#mp-root .mp-drawer .mp-bar > select,#mp-root .mp-drawer .mp-bar > label{width:100%;box-sizing:border-box;}' +
    '#mp-root:not(.mp-world-map) .mp-drawer .mp-g{display:grid !important;grid-template-columns:1fr 1fr;gap:6px;}' +
    '#mp-root .mp-drawer .mp-g button{width:100%;box-sizing:border-box;}' +
    '#mp-root .mp-drawer .mp-side{position:static !important;width:auto !important;height:auto !important;max-height:none !important;' +
      'overflow:visible !important;margin:14px 0 0 !important;padding:12px 0 0 !important;border:0 !important;border-top:1px solid rgba(255,255,255,.14) !important;}' +
    '#mp-root .mp-menu-footer{margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,.14);}' +
    '#mp-root .mp-world-action{display:none;width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid rgba(90,210,235,.45);border-radius:8px;background:rgba(35,125,150,.18);color:#d9fbff;font-weight:600;cursor:pointer;}' +
    '#mp-root .mp-world-action:hover{background:rgba(35,155,180,.3);}' +
    '#mp-root .mp-world-action.active{background:rgba(35,155,180,.48);border-color:#55e6ff;}' +
    '#mp-root .mp-delete-map{display:block;width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid rgba(220,70,70,.65);border-radius:8px;' +
      'background:rgba(150,35,35,.2);color:#ffb6b6;font-weight:600;cursor:pointer;}' +
    '#mp-root .mp-delete-map:hover:not(:disabled){background:rgba(180,45,45,.38);}' +
    '#mp-root .mp-delete-map:disabled{opacity:.42;cursor:not-allowed;}' +
    '#mp-root .mp-portal-dialog-overlay{position:absolute;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;background:rgba(0,0,0,.72);}' +
    '#mp-root .mp-portal-dialog{width:min(340px,100%);box-sizing:border-box;padding:18px;border:1px solid rgba(255,255,255,.2);border-radius:12px;background:#17191f;color:#f4f5f7;box-shadow:0 12px 40px rgba(0,0,0,.55);}' +
    '#mp-root .mp-portal-dialog h3{margin:0 0 8px;font-size:17px;}' +
    '#mp-root .mp-portal-dialog p{margin:0 0 14px;color:#c5c9d2;font-size:13px;line-height:1.45;}' +
    '#mp-root .mp-portal-color-input{display:block;width:100%;height:48px;margin:4px 0 16px;padding:3px;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:#252832;cursor:pointer;}' +
    '#mp-root .mp-portal-dialog-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;}' +
    '#mp-root .mp-portal-dialog-actions-stack{flex-direction:column;}' +
    '#mp-root .mp-portal-dialog-actions button{min-height:38px;padding:8px 12px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:#30343e;color:#fff;cursor:pointer;}' +
    '#mp-root .mp-portal-dialog-actions button.primary{border-color:#3c9bc7;background:#17688f;}' +
    '#mp-root .mp-portal-dialog-actions button.danger{border-color:#9a3b3b;background:#742d35;}';
  R.querySelector('#mp-root').appendChild(menuStyle);

  cv = $('#mp-cv');
  cx = cv.getContext('2d');
  if ('imageSmoothingQuality' in cx) cx.imageSmoothingQuality = 'high';

  // Se o menu estiver aberto, o primeiro toque no mapa só fecha o menu (não pinta/move nada).
  cv.addEventListener('pointerdown', function (e) {
    if (menuIsOpen()) { e.preventDefault(); e.stopImmediatePropagation(); setMenu(false); }
  });
  $('#mp-burger').onclick = function () { setMenu(!menuIsOpen()); };
  $('#mp-export').onclick = function () {
    save();
    exportMapFile();
  };
  $('#mp-export-catalog').style.display = customMapEntries().length ? '' : 'none';
  $('#mp-export-catalog').onclick = function () { exportMapCatalog(); };
  var deleteMapButton = $('#mp-delete-map');
  deleteMapButton.disabled = !MAPINFO.custom;
  deleteMapButton.title = MAPINFO.custom
    ? 'Excluir este mapa personalizado do seletor'
    : 'Os mapas originais do projeto não podem ser excluídos';
  deleteMapButton.onclick = function () { deleteCurrentCustomMap(); };
  $('#mp-add-map').onclick = function () { $('#mp-add-map-file').click(); };
  $('#mp-add-map-file').onchange = function () {
    var file = this.files && this.files[0];
    this.value = '';
    if (file) createCustomMapFromFile(file);
  };
  $('#mp-world-spawn').onclick = function () {
    if (!isHexMap()) return;
    setTool('spawn'); setMenu(false);
  };
  $('#mp-world-portal').onclick = function () {
    if (!isHexMap()) return;
    setTool('portal'); setMenu(false);
  };
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
    tool = 'select';
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
      '#mp-root.mp-world-map .mp-side {display:none !important;}' +
      '#mp-root.mp-world-map .mp-world-action {display:block !important;}' +
      '#mp-root.mp-world-map #mp-cv {display:block;width:100%;height:100%;cursor:crosshair;touch-action:manipulation;}' +
      '#mp-root.mp-world-map #mp-hex-wrap {display:none !important;}';
    worldRoot.appendChild(worldStyle);
    var blockLabel = $('#mp-block'); if (blockLabel && blockLabel.parentElement) blockLabel.parentElement.style.display = 'none';
    var radiusInput = $('#mp-lr'); if (radiusInput && radiusInput.parentElement) radiusInput.parentElement.style.display = 'none';
    var speedWrap = $('#mp-speed-wrap'); if (speedWrap) speedWrap.style.display = 'none';
    showFog = false; dynLight = false; showWalls = false; showGrid = true;
    zoom = FLANAESS_ZOOM;
  }
  // O Flanaess não oferece mais seletor: o tamanho pequeno é fixo.
  if ($('#mp-speed')) $('#mp-speed').oninput = function () {
    travelSpeedMilesPerDay = Math.max(0, Number(this.value) || 0);
    draw();
  };

  $('#mp-tools').onclick = function (e) {
    var b = e.target.closest('button');
    if (b) { setTool(b.dataset.t); setMenu(false); }
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
    setMenu(false);
  };

  document.addEventListener('keydown', onKey);
  document.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onWindowBlur);
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
  mountRequestId++;
  stopWorldTravel(false);
  stopKeyMove();
  document.removeEventListener('keydown', onKey);
  document.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('blur', onWindowBlur);
  window.removeEventListener('resize', draw);
  R = null; cv = null; cx = null; bgImages = []; detailCache = {}; previewPointer = null;
}

window.MapEditor = { mount: mount, unmount: unmount };
})();
