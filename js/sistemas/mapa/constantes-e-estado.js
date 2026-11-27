var EDGE_NONE = 0, EDGE_MURO = 1, EDGE_DOOR_C = 2, EDGE_DOOR_O = 3;
var EDGE_SECRET_WALL = 4, EDGE_SECRET_DOOR_C = 5, EDGE_SECRET_DOOR_O = 6;
var EDGE_LOCKED_DOOR = 7, EDGE_JAMMED_DOOR = 8, EDGE_ILLUSION_WALL = 9;
var EDGE_FORCE_WALL = 10, EDGE_MAGIC_WALL = 11;
var SIZE_SQ = {
    Tiny: 1,
    Small: 1,
    Medium: 1,
    Large: 2,
    Huge: 3,
    Gargantuan: 4,
    Minúsculo: 1,
    Pequeno: 1,
    Médio: 1,
    Grande: 2,
    Enorme: 3,
    Imenso: 4
  };
var R = null, cv = null, cx = null;
var mapInventoryInstance = null;
var mapInventoryMode = null;
var zoom = 0.35, ox = 40, oy = 40;
var tool = "select";
var appMode = "player";
var pendingStructureStart = null;
var drag = null, space = false;
var showGrid = false, showFog = true, dynLight = true, showWalls = true;
var showSecrets = false;
var lightRadius = 6;
var selected = null;
var measurePts = null;
var pendingMonster = null;
var pendingLocalPortal = null;
var blockMove = true;
var previewPointer = null;
var worldTravelRaf = null;
var worldTravelStep = null;
var worldTravelPos = null;
var worldTravelCarry = null;
var worldTravelPath = [];
var worldTravelTarget = null;
var camPan = { x: 0, y: 0 };
function localStepMs() {
    var sp = typeof invSpeedMeters === "function" ? invSpeedMeters() : null;
    var m = sp && Number(sp.atual) > 0 ? Number(sp.atual) : 9;
    return 9000 / m;
  }
var MOVE_KEYS = { ArrowLeft: 1, ArrowRight: 1, ArrowUp: 1, ArrowDown: 1 };
var keysHeld = {};
var keyMoveRaf = null;
var keyMoveStep = null;
var keyMoveVis = null;
var keyMoveCarry = null;
var clickMoveExitPending = false;
var keyMoveLastSave = 0;
var clickMovePath = [];
var WORLD_TRAVEL_STEP_MS = 1e3;
var WORLD_TRAVEL_DAY_SECONDS = 8 * 3600;
var WORLD_TRAVEL_TIME_SCALE = 600;
function worldTravelStepDurationMs() {
    var perDay = travelSpeedEffective();
    if (!(perDay > 0)) perDay = 24;
    var miles = hexMetrics().miles;
    return Math.max(150, Math.round(miles / perDay * WORLD_TRAVEL_DAY_SECONDS * 1e3 / WORLD_TRAVEL_TIME_SCALE));
  }
var state = loadCurrentMapState();
function savedHexMetricsForState(s) {
    if (s && s.gridMetrics && isFinite(Number(s.gridMetrics.width)) && Number(s.gridMetrics.width) > 0) {
      var w = Number(s.gridMetrics.width);
      return { width: w, height: w * 2 / Math.sqrt(3), rowStep: w * Math.sqrt(3) / 2, miles: Number(s.gridMetrics.miles) || w / 2 };
    }
    var mode = s && String(s.gridMode || "");
    if (mode === "hex-small-6mi") return { width: 12, height: 24 / Math.sqrt(3), rowStep: 18 / Math.sqrt(3), miles: 6 };
    if (mode === "hex-large-30mi") return { width: 60, height: 120 / Math.sqrt(3), rowStep: 90 / Math.sqrt(3), miles: 30 };
    if (mode === "hex-small") return { width: 24, height: 48 / Math.sqrt(3), rowStep: 36 / Math.sqrt(3), miles: 6 };
    if (mode === "hex-large") return { width: 60, height: 120 / Math.sqrt(3), rowStep: 90 / Math.sqrt(3), miles: 30 };
    return null;
  }
function worldPointFromHexCell(point, metrics) {
    if (!point || !metrics) return null;
    var x = Number(point.x), y = Number(point.y);
    return {
      x: metrics.width / 2 + x * metrics.width + (y & 1) * metrics.width / 2,
      y: metrics.height / 2 + y * metrics.rowStep
    };
  }
function migrateFlanaessState(s) {
    if (!isHexMap() || !s) return s;
    var oldMetrics = savedHexMetricsForState(s);
    var legacySquare = !!s._legacySquareTokens;
    var oldSquareCell = Number(MAPS.flanaess.cell) || 40;
    var points = [];
    function rememberPoint(object, xKey, yKey) {
      if (!object || !isFinite(Number(object[xKey])) || !isFinite(Number(object[yKey]))) return;
      var world;
      if (legacySquare) world = { x: (Number(object[xKey]) + 0.5) * oldSquareCell, y: (Number(object[yKey]) + 0.5) * oldSquareCell };
      else world = worldPointFromHexCell({ x: object[xKey], y: object[yKey] }, oldMetrics);
      if (world) points.push({ object, xKey, yKey, world });
    }
    if (legacySquare || oldMetrics && Math.abs(oldMetrics.width - hexMetrics().width) > 1e-3) {
      (s.tokens || []).forEach(function(token) {
        rememberPoint(token, "x", "y");
      });
      rememberPoint(s.spawn, "x", "y");
      (s.portals || []).forEach(function(portal) {
        rememberPoint(portal, "x", "y");
        if (!portal.destMapId) rememberPoint(portal, "destX", "destY");
      });
    }
    points.forEach(function(entry) {
      var mapped = worldToCell(entry.world.x, entry.world.y);
      entry.object[entry.xKey] = mapped.x;
      entry.object[entry.yKey] = mapped.y;
    });
    delete s._legacySquareTokens;
    s.gridMode = FLANAESS_GRID_MODE;
    s.gridMetrics = hexGridSnapshot();
    s.fog = [];
    s.walls = [];
    s.wallMeta = [];
    s.hEdges = [];
    s.vEdges = [];
    s.hEdgeMeta = [];
    s.vEdgeMeta = [];
    if (s.spawn) MAPINFO.spawn = { x: s.spawn.x, y: s.spawn.y };
    state = s;
    return s;
  }
state = migrateFlanaessState(state);
var travelSpeedMilesPerDay = 0;
var bgImages = [];
var bgReady = 0;
