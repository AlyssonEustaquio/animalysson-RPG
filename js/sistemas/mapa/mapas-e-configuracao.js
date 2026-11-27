var MAPS = {
    tumba: {
      nome: "Tumba dos Horrores",
      icone: "☠",
      key: "animalysson-vtt-v4",
      stateFile: "mapas/tumba-dos-horrores/Tumba dos Horrores.json",
      cell: 36,
      cols: 72,
      rows: 95,
      w: 2592,
      h: 3420,
      spawn: { x: 35, y: 88 },
      parts: [
        { src: "mapas/tumba-dos-horrores/hi_part1.webp", x: 0, y: 0, w: 1332, h: 1692 },
        { src: "mapas/tumba-dos-horrores/hi_part2.webp", x: 1332, y: 0, w: 1260, h: 1692 },
        { src: "mapas/tumba-dos-horrores/hi_part3.webp", x: 0, y: 1692, w: 1332, h: 1728 },
        { src: "mapas/tumba-dos-horrores/hi_part4.webp", x: 1332, y: 1692, w: 1260, h: 1728 }
      ]
    },
    flanaess: {
      nome: "Flanaess 598 CY",
      icone: "🌍",
      key: "animalysson-vtt-flanaess-v1",
      stateFile: "mapas/flanaess_mapa/Flanaess 598 CY.json",
      cell: 40,
      cols: 220,
      rows: 262,
      w: 8800,
      h: 10480,
      spawn: { x: 110, y: 131 },
      fit: true,
      maxZoom: 4,
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
      detail: { src: "mapas/flanaess_mapa/detalhe/d_{r}_{c}.webp", n: 8, minZoom: 1.1 },
      parts: [
        { src: "mapas/flanaess_mapa/hi_part1.webp", x: 0, y: 0, w: 4400, h: 5240 },
        { src: "mapas/flanaess_mapa/hi_part2.webp", x: 4400, y: 0, w: 4400, h: 5240 },
        { src: "mapas/flanaess_mapa/hi_part3.webp", x: 0, y: 5240, w: 4400, h: 5240 },
        { src: "mapas/flanaess_mapa/hi_part4.webp", x: 4400, y: 5240, w: 4400, h: 5240 }
      ]
    }
  };
var MAP_ID_KEY = "animalysson-vtt-mapa-atual";
var HEX_SIZE_KEY = "animalysson-vtt-flanaess-hex-size";
var MAP_TILE_SIZE_KEY = "animalysson-vtt-tile-sizes-v1";
var CUSTOM_MAPS_KEY = "animalysson-vtt-mapas-customizados-v1";
var DELETED_CUSTOM_MAPS_KEY = "animalysson-vtt-mapas-excluidos-v1";
var MAP_CATALOG_FILE = "mapas/mapas.json";
var mapId = "tumba", MAPINFO = null;
var preferredMapId = "tumba";
var hexSize = "small";
var KEY, CELL, COLS, ROWS, MAP_W, MAP_H, PARTS;
try {
    preferredMapId = localStorage.getItem(MAP_ID_KEY) || "tumba";
    mapId = preferredMapId;
  } catch (e) {
  }
function serializableMapConfig(info) {
    var copy = JSON.parse(JSON.stringify(info || {}));
    (copy.parts || []).forEach(function(part) {
      delete part.localSrc;
    });
    if (copy.detail) delete copy.detail.runtimeTiles;
    delete copy.packageState;
    delete copy.packageStateExportedAt;
    return copy;
  }
function customMapEntries() {
    return Object.keys(MAPS).filter(function(id) {
      return !!MAPS[id].custom;
    }).map(function(id) {
      return { id, config: serializableMapConfig(MAPS[id]) };
    });
  }
function persistCustomMaps() {
    try {
      if (MAPS[mapId] && MAPS[mapId].custom) MAPS[mapId].settingsUpdatedAt = ( new Date()).toISOString();
      localStorage.setItem(CUSTOM_MAPS_KEY, JSON.stringify(customMapEntries()));
    } catch (e) {
    }
  }
function deletedCustomMapIds() {
    try {
      var ids = JSON.parse(localStorage.getItem(DELETED_CUSTOM_MAPS_KEY) || "[]");
      return Array.isArray(ids) ? ids : [];
    } catch (e) {
      return [];
    }
  }
function isCustomMapDeleted(id) {
    return deletedCustomMapIds().indexOf(id) >= 0;
  }
function rememberDeletedCustomMap(id) {
    var ids = deletedCustomMapIds();
    if (ids.indexOf(id) < 0) ids.push(id);
    try {
      localStorage.setItem(DELETED_CUSTOM_MAPS_KEY, JSON.stringify(ids));
    } catch (e) {
    }
  }
function clearDeletedCustomMap(id) {
    var ids = deletedCustomMapIds().filter(function(savedId) {
      return savedId !== id;
    });
    try {
      localStorage.setItem(DELETED_CUSTOM_MAPS_KEY, JSON.stringify(ids));
    } catch (e) {
    }
  }
function registerCustomMap(id, config, runtimeImageSrc) {
    if (!id || !config || !config.nome || !config.w || !config.h || !config.parts || !config.parts.length) return false;
    var previous = MAPS[id];
    var saved = serializableMapConfig(config);
    var packageState = config.packageState || previous && previous.packageState || null;
    var packageStateExportedAt = config.packageStateExportedAt || previous && previous.packageStateExportedAt || null;
    if (packageState) saved.packageState = packageState;
    if (packageStateExportedAt) saved.packageStateExportedAt = packageStateExportedAt;
    saved.custom = true;
    saved.parts.forEach(function(part, index) {
      var fresh = config.parts[index], old = previous && previous.parts && previous.parts[index];
      if (fresh && fresh.localSrc) part.localSrc = fresh.localSrc;
      else if (old && old.localSrc && old.src === part.src) part.localSrc = old.localSrc;
    });
    if (runtimeImageSrc && saved.parts[0] && !saved.parts[0].localSrc) saved.parts[0].localSrc = runtimeImageSrc;
    if (config.detail && config.detail.runtimeTiles && saved.detail) {
      saved.detail.runtimeTiles = config.detail.runtimeTiles;
    }
    MAPS[id] = saved;
    return true;
  }
var FLANAESS_GRID_MODE = "hex-profile-v1";
var FLANAESS_ZOOM = 3;
var MESSAGE_SETTINGS_KEY = "animalysson-vtt-messages-v1";
var MESSAGE_OVERRIDES = {};
try {
    var savedMessageOverrides = JSON.parse(localStorage.getItem(MESSAGE_SETTINGS_KEY) || "{}");
    if (savedMessageOverrides && typeof savedMessageOverrides === "object" && !Array.isArray(savedMessageOverrides)) {
      MESSAGE_OVERRIDES = savedMessageOverrides;
    }
  } catch (messageLoadError) {
    MESSAGE_OVERRIDES = {};
  }
function resolveAppMessage(id, originalMessage) {
    var original = String(originalMessage == null ? "" : originalMessage);
    if (!Object.prototype.hasOwnProperty.call(MESSAGE_OVERRIDES, id)) return original;
    var configured = String(MESSAGE_OVERRIDES[id] == null ? "" : MESSAGE_OVERRIDES[id]);
    return configured.replace(/\{mensagem\}|\{original\}|\{textoOriginal\}/gi, original);
  }
function appAlertMessage(id, message) {
    var resolved = resolveAppMessage(id, message);
    if (!resolved.trim()) return;
    window.alert(resolved);
  }
function appConfirmMessage(id, message) {
    return window.confirm(resolveAppMessage(id, message));
  }
function appPromptMessage(id, message, defaultValue) {
    return window.prompt(resolveAppMessage(id, message), defaultValue);
  }
function isHexMap() {
    return !!(MAPINFO && MAPINFO.scale && mapId === "flanaess");
  }
function hexMetrics() {
    if (!isHexMap()) return null;
    var h = MAPINFO.scale.hexagons[hexSize];
    var width = h.referenceWidthPixels / MAPINFO.scale.referencePixelsPerLogicalPixel;
    var height = width * 2 / Math.sqrt(3);
    return { width, height, rowStep: height * 0.75, miles: h.miles };
  }
function readMapTileSizes() {
    try {
      var saved = JSON.parse(localStorage.getItem(MAP_TILE_SIZE_KEY) || "{}");
      return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    } catch (e) {
      return {};
    }
  }
function getSavedMapTileSize(id) {
    var value = Number(readMapTileSizes()[id]);
    return isFinite(value) && value >= 8 && value <= 512 ? Math.round(value) : null;
  }
function saveMapTileSize(id, value) {
    try {
      var saved = readMapTileSizes();
      saved[id] = Math.round(Number(value));
      localStorage.setItem(MAP_TILE_SIZE_KEY, JSON.stringify(saved));
      return true;
    } catch (e) {
      return false;
    }
  }
function readSavedHexGridProfile() {
    try {
      var raw = localStorage.getItem(HEX_SIZE_KEY);
      if (!raw) return null;
      var value = JSON.parse(raw);
      if (typeof value === "number") value = { width: value };
      if (!value || typeof value !== "object") return null;
      var width = Number(value.width), miles = Number(value.miles);
      if (!isFinite(width) || width < 4 || width > 240) return null;
      return { width, miles: isFinite(miles) && miles > 0 ? miles : null };
    } catch (e) {
      return null;
    }
  }
function saveHexGridProfile(width, miles) {
    try {
      localStorage.setItem(HEX_SIZE_KEY, JSON.stringify({ width: Number(width), miles: Number(miles), updatedAt: ( new Date()).toISOString() }));
      return true;
    } catch (e) {
      return false;
    }
  }
function applySavedHexGridProfile() {
    var saved = readSavedHexGridProfile();
    var info = MAPS.flanaess;
    if (!saved || !info || !info.scale || !info.scale.hexagons) return;
    var scale = info.scale;
    var factor = Number(scale.referencePixelsPerLogicalPixel) || 4;
    var ppm = Number(scale.pixelsPerMile) || 8;
    var miles = saved.miles || saved.width * factor / ppm;
    info.scale.hexagons.small = { miles, referenceWidthPixels: saved.width * factor };
  }
function hexGridSnapshot() {
    if (!isHexMap()) return null;
    var hm = hexMetrics();
    return { width: hm.width, miles: hm.miles };
  }
function applyExportedHexGridProfile(payload) {
    if (!isHexMap() || !payload || !payload.mapConfig || !payload.mapConfig.scale) return false;
    var remoteScale = payload.mapConfig.scale;
    var profile = remoteScale.hexagons && remoteScale.hexagons.small;
    if (!profile) return false;
    var factor = Number(MAPINFO.scale.referencePixelsPerLogicalPixel) || 4;
    var ppm = Number(MAPINFO.scale.pixelsPerMile) || 8;
    var referenceWidth = Number(profile.referenceWidthPixels);
    var miles = Number(profile.miles);
    var width = referenceWidth / factor;
    if (!isFinite(width) || width < 4 || width > 240 || !isFinite(miles) || miles <= 0) return false;
    MAPINFO.scale.hexagons.small = { referenceWidthPixels: referenceWidth, miles };
    saveHexGridProfile(width, miles);
    applyMap(mapId);
    return true;
  }
applySavedHexGridProfile();
function applyMap(id) {
    if (!MAPS[id]) id = "tumba";
    mapId = id;
    MAPINFO = MAPS[id];
    MAP_W = MAPINFO.w;
    MAP_H = MAPINFO.h;
    PARTS = MAPINFO.parts;
    KEY = MAPINFO.key;
    if (isHexMap()) {
      var hm = hexMetrics();
      CELL = hm.width;
      COLS = Math.ceil(MAP_W / hm.width) + 1;
      ROWS = Math.ceil(MAP_H / hm.rowStep) + 1;
    } else {
      var savedCell = getSavedMapTileSize(id);
      if (savedCell) MAPINFO.cell = savedCell;
      CELL = Math.max(8, Math.min(512, Math.round(Number(MAPINFO.cell) || 36)));
      COLS = Math.ceil(MAP_W / CELL);
      ROWS = Math.ceil(MAP_H / CELL);
      MAPINFO.cell = CELL;
      MAPINFO.cols = COLS;
      MAPINFO.rows = ROWS;
    }
  }
function mapOptions() {
    return Object.keys(MAPS).map(function(id) {
      return '<option value="' + esc(id) + '"' + (id === mapId ? " selected" : "") + ">" + esc(MAPS[id].icone + " " + MAPS[id].nome) + "</option>";
    }).join("");
  }
applyMap(mapId);
