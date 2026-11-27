function defaultState() {
    return {
      v: 4,
      nome: MAPINFO.nome,
      gridMode: isHexMap() ? FLANAESS_GRID_MODE : "square",
      gridMetrics: isHexMap() ? hexGridSnapshot() : null,
      spawn: { x: MAPINFO.spawn.x, y: MAPINFO.spawn.y },
      portals: [],
      tokens: [
        { id: "p1", nome: "Aventureiro", tipo: "player", x: isHexMap() ? worldToCell(MAP_W / 2, MAP_H / 2).x : MAPINFO.spawn.x, y: isHexMap() ? worldToCell(MAP_W / 2, MAP_H / 2).y : MAPINFO.spawn.y, cor: "#4fc3f7", raio: 1, luz: 6, hp: null, hpMax: null }
      ],
      fog: isHexMap() ? [] : makeGrid(1),
      walls: isHexMap() ? [] : makeGrid(0),
      wallMeta: isHexMap() ? [] : makeArr(COLS * ROWS, null),
      hEdges: isHexMap() ? [] : makeArr(COLS * (ROWS + 1), 0),
      vEdges: isHexMap() ? [] : makeArr((COLS + 1) * ROWS, 0),
      hEdgeMeta: isHexMap() ? [] : makeArr(COLS * (ROWS + 1), null),
      vEdgeMeta: isHexMap() ? [] : makeArr((COLS + 1) * ROWS, null),
      customEdges: [],
      terrain: {},
      decorations: [],
      assets: [],
      labels: [],
      lights: []
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
    if (!Array.isArray(s.portals)) s.portals = [];
    if (!Array.isArray(s.assets)) s.assets = [];
    s.assets = s.assets.filter(function(asset) {
      return asset && /^[a-z0-9_-]{1,80}$/i.test(String(asset.id || "")) && /^data:image\/(webp|png|jpeg);base64,/i.test(String(asset.src || "")) && String(asset.src).length <= 64000;
    }).slice(0, 16).map(function(asset) {
      return { id: String(asset.id), name: String(asset.name || "Imagem").slice(0, 80), src: String(asset.src), width: 256, height: 256 };
    });
    if (!Array.isArray(s.decorations)) s.decorations = [];
    s.decorations = s.decorations.filter(function(item) {
      return item && isFinite(Number(item.x)) && isFinite(Number(item.y)) && !!item.kind;
    }).slice(0, 5000).map(function(item) {
      var assetId = item.kind === "image" && s.assets.some(function(asset) { return asset.id === item.assetId; }) ? String(item.assetId) : null;
      var kind = assetId ? "image" : CREATIVE_OBJECTS && CREATIVE_OBJECTS[item.kind] ? item.kind : "tree";
      return { id: String(item.id || "dec-" + Math.random().toString(36).slice(2)), kind: kind, assetId: assetId, glyph: CREATIVE_OBJECTS && CREATIVE_OBJECTS[kind] ? CREATIVE_OBJECTS[kind].glyph : "🌳", x: Math.max(0, Math.min(COLS - 1, Math.round(Number(item.x)))), y: Math.max(0, Math.min(ROWS - 1, Math.round(Number(item.y)))), size: Math.max(.28, Math.min(1.8, Number(item.size) || .84)), rotation: ((Number(item.rotation) || 0) % 360 + 360) % 360 };
    });
    if (!Array.isArray(s.labels)) s.labels = [];
    s.labels = s.labels.filter(function(item) {
      return item && isFinite(Number(item.x)) && isFinite(Number(item.y)) && String(item.text || "").trim();
    }).slice(0, 1000).map(function(item) {
      return { id: String(item.id || "label-" + Math.random().toString(36).slice(2)), text: String(item.text).slice(0, 160), x: Math.max(0, Math.min(COLS - 1, Math.round(Number(item.x)))), y: Math.max(0, Math.min(ROWS - 1, Math.round(Number(item.y)))), color: /^#[0-9a-f]{6}$/i.test(item.color || "") ? item.color : "#ffffff", size: Math.max(10, Math.min(40, Number(item.size) || 17)), bubble: item.bubble !== false, bold: item.bold !== false, align: ["left", "center", "right"].indexOf(item.align) >= 0 ? item.align : "center" };
    });
    if (!Array.isArray(s.lights)) s.lights = [];
    s.lights = s.lights.filter(function(item) {
      return item && isFinite(Number(item.x)) && isFinite(Number(item.y));
    }).slice(0, 200).map(function(item) {
      return { id: String(item.id || "light-" + Math.random().toString(36).slice(2)), x: Math.max(0, Math.min(COLS - 1, Math.round(Number(item.x)))), y: Math.max(0, Math.min(ROWS - 1, Math.round(Number(item.y)))), color: /^#[0-9a-f]{6}$/i.test(item.color || "") ? item.color : "#ffd36a", radius: Math.max(1, Math.min(16, Number(item.radius) || 5)), intensity: Math.max(.08, Math.min(.85, Number(item.intensity) || .42)) };
    });
    if (s._terrainBytes instanceof Uint8Array) {
      var liveBytes = s._terrainBytes;
      var liveCount = Number(s._terrainCount) || liveBytes.reduce(function(sum, value) { return sum + (value ? 1 : 0); }, 0);
      Object.defineProperty(s, "_terrainBytes", { value: liveBytes, writable: true, configurable: true, enumerable: false });
      Object.defineProperty(s, "_terrainCount", { value: liveCount, writable: true, configurable: true, enumerable: false });
    } else if (s.terrainPacked) {
      var decodedTerrain = creativeDecodeTerrain(s.terrainPacked, isHexMap() ? 0 : COLS * ROWS);
      Object.defineProperty(s, "_terrainBytes", { value: decodedTerrain.bytes, writable: true, configurable: true, enumerable: false });
      Object.defineProperty(s, "_terrainCount", { value: decodedTerrain.count, writable: true, configurable: true, enumerable: false });
      delete s.terrain;
    } else {
      if (!s.terrain || typeof s.terrain !== "object" || Array.isArray(s.terrain)) s.terrain = {};
      Object.keys(s.terrain).forEach(function(key) {
        var index = Number(key);
        if (!Number.isInteger(index) || index < 0 || index >= COLS * ROWS || !(CREATIVE_MATERIALS && CREATIVE_MATERIALS[s.terrain[key]])) delete s.terrain[key];
      });
    }
    s.portals = s.portals.filter(function(portal) {
      if (!portal || !isFinite(Number(portal.x)) || !isFinite(Number(portal.y))) return false;
      return !!portal.destMapId || isFinite(Number(portal.destX)) && isFinite(Number(portal.destY));
    }).map(function(portal) {
      var portalColor = String(portal.color || "#36a9e1");
      if (!/^#[0-9a-f]{6}$/i.test(portalColor)) portalColor = "#36a9e1";
      var normalized = {
        id: portal.id || "portal-" + String(portal.x) + "-" + String(portal.y),
        x: Math.max(0, Math.min(COLS - 1, Math.round(Number(portal.x)))),
        y: Math.max(0, Math.min(ROWS - 1, Math.round(Number(portal.y)))),
        color: portalColor.toLowerCase()
      };
      if (portal.destMapId) normalized.destMapId = String(portal.destMapId);
      else {
        normalized.type = "local";
        normalized.destX = Math.max(0, Math.min(COLS - 1, Math.round(Number(portal.destX))));
        normalized.destY = Math.max(0, Math.min(ROWS - 1, Math.round(Number(portal.destY))));
      }
      return normalized;
    });
    if (isHexMap()) {
      if (!s.gridMode && s.fog && s.fog.length === MAPS.flanaess.cols * MAPS.flanaess.rows) s._legacySquareTokens = true;
      s.fog = [];
      s.walls = [];
      s.wallMeta = [];
      s.hEdges = [];
      s.vEdges = [];
      s.hEdgeMeta = [];
      s.vEdgeMeta = [];
      return s;
    }
    if (!s.fog || s.fog.length !== COLS * ROWS) s.fog = makeGrid(1);
    if (!s.walls || s.walls.length !== COLS * ROWS) s.walls = makeGrid(0);
    if (!s.wallMeta || s.wallMeta.length !== COLS * ROWS) s.wallMeta = makeArr(COLS * ROWS, null);
    if (!s.hEdges || s.hEdges.length !== COLS * (ROWS + 1)) s.hEdges = makeArr(COLS * (ROWS + 1), 0);
    if (!s.vEdges || s.vEdges.length !== (COLS + 1) * ROWS) s.vEdges = makeArr((COLS + 1) * ROWS, 0);
    if (!s.hEdgeMeta || s.hEdgeMeta.length !== COLS * (ROWS + 1)) s.hEdgeMeta = makeArr(COLS * (ROWS + 1), null);
    if (!s.vEdgeMeta || s.vEdgeMeta.length !== (COLS + 1) * ROWS) s.vEdgeMeta = makeArr((COLS + 1) * ROWS, null);
    if (!Array.isArray(s.customEdges)) s.customEdges = [];
    s.customEdges = s.customEdges.filter(function(e) {
      return !!e && [e.x1, e.y1, e.x2, e.y2].every(function(v) {
        return isFinite(Number(v));
      }) && (Number(e.x1) !== Number(e.x2) || Number(e.y1) !== Number(e.y2));
    });
    return s;
  }
function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return normalizeMapState(JSON.parse(raw));
    } catch (e) {
      return null;
    }
  }
function loadCurrentMapState() {
    var localState = load();
    var packageState = MAPINFO && MAPINFO.packageState;
    var packageTime = MAPINFO && Date.parse(MAPINFO.packageStateExportedAt || "") || 0;
    var localTime = localState && Number(localState._savedAt) || 0;
    if (packageState && (!localState || packageTime > localTime)) {
      var remoteState = normalizeMapState(JSON.parse(JSON.stringify(packageState)));
      if (remoteState) {
        remoteState._savedAt = packageTime || Date.now();
        return migrateFlanaessState(remoteState);
      }
    }
    return migrateFlanaessState(localState || defaultState());
  }
