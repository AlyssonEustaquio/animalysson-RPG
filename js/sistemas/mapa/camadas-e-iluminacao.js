/* Sistema de níveis, relevo, passagens e iluminação ambiental do Animalysson RPG. */
var CREATIVE_LEVEL_DATA_KEYS = [
  "fog", "walls", "wallMeta", "hEdges", "vEdges", "hEdgeMeta", "vEdgeMeta",
  "customEdges", "terrain", "terrainPacked", "terrainHeights", "decorations",
  "labels", "lights", "lightZones", "portals"
];
var creativePendingTransition = null;
var creativeLevelUiInstalled = false;
var creativeLastTransitionNotice = 0;

function creativeLevelId() {
  return state && state.activeLevelId || "surface";
}
function creativePlayerTokenAnyLevel() {
  if (!state || !Array.isArray(state.tokens)) return null;
  return state.tokens.find(function(token) { return token && token.tipo === "player"; }) || state.tokens[0] || null;
}
function creativeGetTokenLightRadius(token) {
  var value = token && token.luz != null ? Number(token.luz) : Number(lightRadius);
  return Number.isFinite(value) ? Math.max(0, Math.min(30, value)) : 0;
}
function creativeGetTokenVisionRadius(token) {
  var value = token && token.visao != null ? Number(token.visao) : 6;
  return Number.isFinite(value) ? Math.max(0, Math.min(60, value)) : 6;
}
function creativeGetVisibilityRadius(token, x, y) {
  var px = x == null ? token && token.x : x, py = y == null ? token && token.y : y;
  return creativeIsDarkCell(Number(px), Number(py)) ? creativeGetTokenLightRadius(token) : creativeGetTokenVisionRadius(token);
}
function creativeTorchRadius() {
  return creativeGetTokenLightRadius(creativePlayerTokenAnyLevel());
}
function creativeSetTorchRadius(value) {
  var radius = Math.max(0, Math.min(30, Math.round(Number(value) || 0)));
  lightRadius = radius;
  var player = creativePlayerTokenAnyLevel();
  if (player) player.luz = radius;
  var input = R && R.querySelector("#mp-creator-torch-radius");
  var output = R && R.querySelector("#mp-creator-torch-value");
  if (input) input.value = String(radius);
  if (output) output.textContent = String(radius) + " células";
  var legacySlider = R && R.querySelector("#mp-lr");
  if (legacySlider) legacySlider.value = String(radius);
  save();
  draw();
}
function creativeCurrentLevel() {
  if (!state || !Array.isArray(state.levels)) return null;
  return state.levels.find(function(level) { return level && level.id === creativeLevelId(); }) || state.levels[0] || null;
}
function creativeEnvironmentName(environment) {
  return ({ outdoor: "Exterior · luz do sol", interior: "Interior · luz limitada", cavern: "Caverna · escuro", basement: "Porão · escuro" })[environment] || "Exterior · luz do sol";
}
function creativeLevelIsDark() {
  var level = creativeCurrentLevel();
  return !!level && level.environment !== "outdoor";
}
function creativeIsDarkCell(x, y) {
  var level = creativeCurrentLevel();
  if (!level) return false;
  if (level.environment !== "outdoor") return true;
  return (state.lightZones || []).some(function(zone) {
    return zone && zone.mode === "dark" && x >= zone.x && y >= zone.y && x <= zone.x + zone.w && y <= zone.y + zone.h;
  });
}
function creativeHasDarkness() {
  var level = creativeCurrentLevel();
  return !!(level && level.environment !== "outdoor") || !!(state && Array.isArray(state.lightZones) && state.lightZones.length);
}
function creativeMakeEmptyLevelData(environment) {
  var count = COLS * ROWS;
  return {
    fog: makeGrid(environment === "outdoor" ? 0 : 1),
    walls: makeGrid(0), wallMeta: makeArr(count, null),
    hEdges: makeArr(COLS * (ROWS + 1), 0), vEdges: makeArr((COLS + 1) * ROWS, 0),
    hEdgeMeta: makeArr(COLS * (ROWS + 1), null), vEdgeMeta: makeArr((COLS + 1) * ROWS, null),
    customEdges: [], terrain: {}, terrainHeights: {}, decorations: [], labels: [], lights: [], lightZones: [], portals: []
  };
}
function creativeCaptureLevelData(source) {
  source = source || state;
  var data = {};
  CREATIVE_LEVEL_DATA_KEYS.forEach(function(key) {
    if (key === "terrain" || key === "terrainPacked") return;
    data[key] = creativeClone(source[key] == null ? (key === "terrainHeights" || key === "lightZones" ? {} : []) : source[key]);
  });
  var bytes = creativeTerrainBytes(source);
  if (bytes) {
    var count = Number(source._terrainCount) || bytes.reduce(function(sum, value) { return sum + (value ? 1 : 0); }, 0);
    if (count) data.terrainPacked = creativeEncodeTerrain(bytes);
    else data.terrain = {};
  } else {
    data.terrain = creativeClone(source.terrain || {});
    if (source.terrainPacked) data.terrainPacked = source.terrainPacked;
  }
  if (!Array.isArray(data.lightZones)) data.lightZones = [];
  if (!data.terrainHeights || typeof data.terrainHeights !== "object") data.terrainHeights = {};
  return data;
}
function creativeRestoreLevelData(level) {
  var data = level && level.data || creativeMakeEmptyLevelData(level && level.environment || "outdoor");
  var count = COLS * ROWS;
  state.fog = Array.isArray(data.fog) && data.fog.length === count ? data.fog.slice() : makeGrid(level && level.environment === "outdoor" ? 0 : 1);
  state.walls = Array.isArray(data.walls) && data.walls.length === count ? data.walls.slice() : makeGrid(0);
  state.wallMeta = Array.isArray(data.wallMeta) && data.wallMeta.length === count ? data.wallMeta.slice() : makeArr(count, null);
  state.hEdges = Array.isArray(data.hEdges) && data.hEdges.length === COLS * (ROWS + 1) ? data.hEdges.slice() : makeArr(COLS * (ROWS + 1), 0);
  state.vEdges = Array.isArray(data.vEdges) && data.vEdges.length === (COLS + 1) * ROWS ? data.vEdges.slice() : makeArr((COLS + 1) * ROWS, 0);
  state.hEdgeMeta = Array.isArray(data.hEdgeMeta) && data.hEdgeMeta.length === COLS * (ROWS + 1) ? data.hEdgeMeta.slice() : makeArr(COLS * (ROWS + 1), null);
  state.vEdgeMeta = Array.isArray(data.vEdgeMeta) && data.vEdgeMeta.length === (COLS + 1) * ROWS ? data.vEdgeMeta.slice() : makeArr((COLS + 1) * ROWS, null);
  state.customEdges = Array.isArray(data.customEdges) ? creativeClone(data.customEdges) : [];
  state.decorations = Array.isArray(data.decorations) ? creativeClone(data.decorations) : [];
  state.labels = Array.isArray(data.labels) ? creativeClone(data.labels) : [];
  state.lights = Array.isArray(data.lights) ? creativeClone(data.lights) : [];
  state.lightZones = Array.isArray(data.lightZones) ? creativeClone(data.lightZones) : [];
  state.portals = Array.isArray(data.portals) ? creativeClone(data.portals) : [];
  state.terrainHeights = data.terrainHeights && typeof data.terrainHeights === "object" ? creativeClone(data.terrainHeights) : {};
  state.terrain = data.terrain && typeof data.terrain === "object" ? creativeClone(data.terrain) : {};
  if (data.terrainPacked) {
    var decoded = creativeDecodeTerrain(data.terrainPacked, count);
    creativeStoreTerrainBytes(decoded.bytes, decoded.count);
    state.terrain = {};
  } else {
    try { delete state._terrainBytes; delete state._terrainCount; } catch (e) { state._terrainBytes = null; state._terrainCount = 0; }
  }
}
function creativeEnsureLevelState(source) {
  if (!source || isHexMap()) return source;
  if (!Array.isArray(source.levels) || !source.levels.length) {
    source.levels = [{ id: "surface", name: "Superfície", elevation: 0, environment: "outdoor", data: null }];
    source.activeLevelId = "surface";
  }
  var clean = [];
  source.levels.forEach(function(level, index) {
    if (!level || typeof level !== "object") return;
    var id = String(level.id || "level-" + index).replace(/[^a-z0-9_-]/gi, "-").slice(0, 80);
    if (clean.some(function(existing) { return existing.id === id; })) id += "-" + index;
    var environment = ["outdoor", "interior", "cavern", "basement"].indexOf(level.environment) >= 0 ? level.environment : "outdoor";
    clean.push({
      id: id,
      name: String(level.name || (index === 0 ? "Superfície" : "Nível " + (index + 1))).slice(0, 48),
      elevation: Math.max(-500, Math.min(500, Number(level.elevation) || 0)),
      environment: environment,
      data: level.data && typeof level.data === "object" ? level.data : null
    });
  });
  if (!clean.length) clean.push({ id: "surface", name: "Superfície", elevation: 0, environment: "outdoor", data: null });
  source.levels = clean;
  if (!clean.some(function(level) { return level.id === source.activeLevelId; })) source.activeLevelId = clean[0].id;
  if (!Array.isArray(source.transitions)) source.transitions = [];
  var validIds = clean.map(function(level) { return level.id; });
  source.transitions = source.transitions.filter(function(link) {
    return link && validIds.indexOf(link.fromLevelId) >= 0 && validIds.indexOf(link.toLevelId) >= 0 && link.fromLevelId !== link.toLevelId && [link.fromX, link.fromY, link.toX, link.toY].every(function(v) { return isFinite(Number(v)) && Number(v) >= 0; });
  }).map(function(link) {
    return {
      id: String(link.id || "passage-" + Math.random().toString(36).slice(2)),
      fromLevelId: link.fromLevelId, fromX: Math.max(0, Math.min(COLS - 1, Math.round(Number(link.fromX)))), fromY: Math.max(0, Math.min(ROWS - 1, Math.round(Number(link.fromY)))),
      toLevelId: link.toLevelId, toX: Math.max(0, Math.min(COLS - 1, Math.round(Number(link.toX)))), toY: Math.max(0, Math.min(ROWS - 1, Math.round(Number(link.toY)))),
      kind: ["stairs", "ladder", "hatch", "cave"].indexOf(link.kind) >= 0 ? link.kind : "stairs",
      label: String(link.label || "Passagem").slice(0, 48)
    };
  });
  source.tokens = Array.isArray(source.tokens) ? source.tokens : [];
  source.tokens.forEach(function(token) {
    if (!token.layerId || validIds.indexOf(token.layerId) < 0) token.layerId = source.activeLevelId;
    if (token.visao == null || !Number.isFinite(Number(token.visao))) token.visao = 6;
    else token.visao = Math.max(0, Math.min(60, Number(token.visao)));
    if (token.luz == null || !Number.isFinite(Number(token.luz))) token.luz = Math.max(0, Number(lightRadius) || 0);
    else token.luz = Math.max(0, Math.min(30, Number(token.luz)));
  });
  if (!Array.isArray(source.lightZones)) source.lightZones = [];
  source.lightZones = source.lightZones.filter(function(zone) {
    return zone && isFinite(Number(zone.x)) && isFinite(Number(zone.y)) && isFinite(Number(zone.w)) && isFinite(Number(zone.h));
  }).map(function(zone) {
    return { id: String(zone.id || "light-zone-" + Math.random().toString(36).slice(2)), x: Math.max(0, Math.min(COLS - 1, Math.round(Number(zone.x)))), y: Math.max(0, Math.min(ROWS - 1, Math.round(Number(zone.y)))), w: Math.max(0, Math.min(COLS - 1, Math.round(Number(zone.w)))), h: Math.max(0, Math.min(ROWS - 1, Math.round(Number(zone.h)))), mode: "dark", name: String(zone.name || "Interior").slice(0, 40) };
  });
  if (!source.terrainHeights || typeof source.terrainHeights !== "object") source.terrainHeights = {};
  Object.keys(source.terrainHeights).forEach(function(key) {
    var index = Number(key), height = Number(source.terrainHeights[key]);
    if (!Number.isInteger(index) || index < 0 || index >= COLS * ROWS || !Number.isFinite(height)) delete source.terrainHeights[key];
    else source.terrainHeights[key] = Math.max(-10, Math.min(10, Math.round(height)));
  });
  return source;
}
function creativeStoreActiveLevelData(source) {
  source = source || state;
  if (!source || isHexMap() || !Array.isArray(source.levels)) return;
  var level = source.levels.find(function(item) { return item.id === source.activeLevelId; });
  if (level) level.data = creativeCaptureLevelData(source);
}
function creativeSwitchLevel(levelId, options) {
  options = options || {};
  if (!state || isHexMap() || appMode !== "editor" && !options.playerTransition) return false;
  var target = (state.levels || []).find(function(level) { return level.id === levelId; });
  if (!target || target.id === creativeLevelId()) return false;
  creativeStoreActiveLevelData(state);
  state.activeLevelId = target.id;
  creativeRestoreLevelData(target);
  creativeSelected = null;
  selected = null;
  if (options.playerTransition && options.player) { options.player.layerId = target.id; if (typeof revealAround === "function") revealAround(options.player.x, options.player.y, creativeGetVisibilityRadius(options.player, options.player.x, options.player.y)); }
  if (!options.keepTool) {
    setTool("select");
  } else if (cv) cv.style.cursor = "crosshair";
  creativeHistoryUndo = [];
  creativeHistoryRedo = [];
  creativeUpdateHistoryButtons();
  creativeUpdateLevelUi();
  creativeRenderInspector();
  save();
  draw();
  return true;
}
function creativeAddLevel() {
  if (!state || isHexMap()) return;
  var kindInput = R && R.querySelector("#mp-creator-new-environment");
  var environment = kindInput ? kindInput.value : "cavern";
  var defaultName = ({ outdoor: "Área externa", interior: "Interior", cavern: "Caverna", basement: "Porão" })[environment] || "Novo nível";
  var name = appPromptMessage("msg006", "Nome do novo nível:", defaultName);
  if (!name || !name.trim()) return;
  creativeStoreActiveLevelData(state);
  var level = {
    id: "level-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6),
    name: name.trim().slice(0, 48),
    elevation: environment === "basement" || environment === "cavern" ? -3 : environment === "interior" ? 0 : 3,
    environment: environment,
    data: creativeMakeEmptyLevelData(environment)
  };
  state.levels.push(level);
  var currentPlayerToken = currentPlayer();
  if (currentPlayerToken && appMode === "editor") {
    // A troca de nível no Editor não move o personagem; ele continua vinculado ao andar anterior.
  }
  creativeSwitchLevel(level.id, { keepTool: false });
  save();
}
function creativeDeleteActiveLevel() {
  if (!state || !state.levels || state.levels.length <= 1) {
    appAlertMessage("msg008", "O mapa precisa manter pelo menos um nível.");
    return;
  }
  var active = creativeCurrentLevel();
  if (!active || !appConfirmMessage("msg008", "Excluir o nível '" + active.name + "'? As passagens ligadas a ele também serão removidas.")) return;
  var fallback = state.levels.find(function(level) { return level.id !== active.id; });
  state.tokens.forEach(function(token) { if (token.layerId === active.id) token.layerId = fallback.id; });
  state.transitions = (state.transitions || []).filter(function(link) { return link.fromLevelId !== active.id && link.toLevelId !== active.id; });
  state.levels = state.levels.filter(function(level) { return level.id !== active.id; });
  state.activeLevelId = fallback.id;
  creativeRestoreLevelData(fallback);
  creativeSelected = null; selected = null;
  save(); draw(); creativeUpdateLevelUi(); creativeRenderInspector();
}
function creativeSetActiveLevelEnvironment(environment) {
  var level = creativeCurrentLevel();
  if (!level || ["outdoor", "interior", "cavern", "basement"].indexOf(environment) < 0) return;
  level.environment = environment;
  if (environment === "outdoor" && state.fog && state.fog.length === COLS * ROWS) {
    // Não revela automaticamente áreas que o Mestre já cobriu; apenas altera a luz ambiente.
  }
  creativeUpdateLevelUi(); save(); draw();
}
function creativeUpdateLevelUi() {
  if (!R) return;
  var panel = R.querySelector(".mp-creator-level-manager");
  if (!panel) return;
  var level = creativeCurrentLevel();
  var activeSelect = panel.querySelector("#mp-creator-level-select");
  var targetSelect = panel.querySelector("#mp-creator-transition-target");
  var envSelect = panel.querySelector("#mp-creator-level-environment");
  var elevationInput = panel.querySelector("#mp-creator-level-elevation");
  var newEnv = panel.querySelector("#mp-creator-new-environment");
  var torchSlider = panel.querySelector("#mp-creator-torch-radius");
  var torchOutput = panel.querySelector("#mp-creator-torch-value");
  if (torchSlider && document.activeElement !== torchSlider) torchSlider.value = String(creativeTorchRadius());
  if (torchOutput) torchOutput.textContent = String(creativeTorchRadius()) + " células";
  var legacyTorchSlider = R.querySelector("#mp-lr");
  if (legacyTorchSlider && document.activeElement !== legacyTorchSlider) legacyTorchSlider.value = String(creativeTorchRadius());
  if (activeSelect) activeSelect.innerHTML = (state.levels || []).map(function(item) { return '<option value="' + esc(item.id) + '">' + esc(item.name) + ' · ' + (Number(item.elevation) > 0 ? "+" : "") + Number(item.elevation) + ' m</option>'; }).join("");
  if (activeSelect && level) activeSelect.value = level.id;
  if (targetSelect) {
    targetSelect.innerHTML = (state.levels || []).filter(function(item) { return !level || item.id !== level.id; }).map(function(item) { return '<option value="' + esc(item.id) + '">' + esc(item.name) + '</option>'; }).join("");
    if (!targetSelect.options.length) targetSelect.innerHTML = '<option value="">Crie outro nível primeiro</option>';
  }
  if (envSelect && level) envSelect.value = level.environment;
  if (elevationInput && level && document.activeElement !== elevationInput) elevationInput.value = String(level.elevation);
  if (newEnv && !newEnv.value) newEnv.value = "cavern";
  var deleteButton = panel.querySelector("#mp-creator-level-delete");
  if (deleteButton) deleteButton.disabled = !state.levels || state.levels.length <= 1;
  var status = panel.querySelector("#mp-creator-level-status");
  if (status) {
    if (creativePendingTransition) status.textContent = "Clique no nível de destino para posicionar a outra ponta da passagem.";
    else status.textContent = "" + creativeEnvironmentName(level && level.environment) + " · use ↑/↓ para criar desníveis e 'Passagem' para ligar andares.";
  }
}
function creativeInstallLevelUi() {
  if (!R || isHexMap()) return;
  var panel = R.querySelector(".mp-creator-panel"), toolGrid = panel && panel.querySelector(".mp-creator-toolgrid");
  if (!panel || !toolGrid || panel.querySelector(".mp-creator-level-manager")) return;
  var section = document.createElement("section");
  section.className = "mp-creator-section mp-creator-level-manager";
  section.innerHTML = '<div class="mp-creator-section-title">Camadas e níveis <span>andares, cavernas e relevo</span></div>' +
    '<label class="mp-creator-level-label">Nível ativo<select id="mp-creator-level-select"></select></label>' +
    '<div class="mp-creator-level-actions"><button type="button" id="mp-creator-level-add">＋ Criar nível</button><button type="button" id="mp-creator-level-delete" class="danger">Excluir</button></div>' +
    '<label class="mp-creator-level-label">Tipo de novo nível<select id="mp-creator-new-environment"><option value="outdoor">Exterior · luz do sol</option><option value="interior">Interior · luz limitada</option><option value="cavern" selected>Caverna · escuro</option><option value="basement">Porão · escuro</option></select></label>' +
    '<div class="mp-creator-level-properties"><label>Ambiente atual<select id="mp-creator-level-environment"><option value="outdoor">Exterior / sol</option><option value="interior">Interior</option><option value="cavern">Caverna</option><option value="basement">Porão</option></select></label><label>Altitude (m)<input id="mp-creator-level-elevation" type="number" min="-500" max="500" step="0.5" value="0"></label></div>' +
    '<label class="mp-creator-level-label">Conectar com<select id="mp-creator-transition-target"></select></label>' +
    '<label class="mp-creator-torch-control"><span>Tocha / lanterna do personagem <output id="mp-creator-torch-value">' + creativeTorchRadius() + ' células</output></span><input id="mp-creator-torch-radius" type="range" min="0" max="30" step="1" value="' + creativeTorchRadius() + '"><small>0 = sem luz carregada. O Mestre ajusta o alcance conforme a tocha/lanterna do personagem.</small></label>' +
    '<small id="mp-creator-level-status" class="mp-creator-muted"></small>';
  panel.insertBefore(section, toolGrid);
  var tools = document.createElement("div");
  tools.className = "mp-creator-level-tools";
  tools.innerHTML = '<button type="button" class="mp-creator-tool" data-creator-tool="raiseTerrain" title="Elevar terreno em um nível"><span class="mp-creator-tool-icon">⛰</span><span>Elevar</span></button><button type="button" class="mp-creator-tool" data-creator-tool="lowerTerrain" title="Abaixar terreno em um nível"><span class="mp-creator-tool-icon">▽</span><span>Abaixar</span></button><button type="button" class="mp-creator-tool" data-creator-tool="interiorZone" title="Desenhar uma área interna sem luz solar; a tocha ilumina o interior"><span class="mp-creator-tool-icon">⌂</span><span>Zona interna</span></button><button type="button" class="mp-creator-tool" data-creator-tool="transition" title="Conectar este nível ao nível escolhido acima"><span class="mp-creator-tool-icon">↕</span><span>Passagem</span></button>';
  panel.insertBefore(tools, toolGrid.nextSibling);
  section.addEventListener("change", function(event) {
    var target = event.target;
    if (target.id === "mp-creator-level-select") {
      if (creativePendingTransition) creativeCancelPendingTransition();
      creativeSwitchLevel(target.value);
    } else if (target.id === "mp-creator-level-environment") {
      creativeSetActiveLevelEnvironment(target.value);
    } else if (target.id === "mp-creator-level-elevation") {
      var level = creativeCurrentLevel(); if (level) { level.elevation = Math.max(-500, Math.min(500, Number(target.value) || 0)); save(); creativeUpdateLevelUi(); }
    }
  });
  var torchSlider = section.querySelector("#mp-creator-torch-radius");
  if (torchSlider) torchSlider.addEventListener("input", function() {
    var output = section.querySelector("#mp-creator-torch-value");
    if (output) output.textContent = String(this.value) + " células";
    creativeSetTorchRadius(this.value);
  });
  section.addEventListener("click", function(event) {
    if (event.target.closest("#mp-creator-level-add")) creativeAddLevel();
    else if (event.target.closest("#mp-creator-level-delete")) creativeDeleteActiveLevel();
  });
  tools.addEventListener("click", function(event) {
    var button = event.target.closest("[data-creator-tool]");
    if (!button) return;
    setTool(button.getAttribute("data-creator-tool"));
    creativeUpdateLevelUi();
  });
  var shell = R.querySelector(".mp-creator-ui");
  if (shell) {
    shell.addEventListener("change", function(event) {
      var field = event.target;
      if (field.matches("[data-level-transition-field]")) {
        var transition = (state.transitions || []).find(function(item) { return item.id === field.getAttribute("data-id"); });
        if (transition) { transition[field.getAttribute("data-level-transition-field")] = field.value; save(); draw(); }
      }
      if (field.matches("[data-level-zone-name]")) {
        var zone = (state.lightZones || []).find(function(item) { return item.id === field.getAttribute("data-id"); });
        if (zone) { var beforeZone = creativeClone(zone); creativeBeginTransaction(); zone.name = String(field.value || "Interior").slice(0, 40); creativeRecordArrayChange("lightZones", zone, beforeZone, zone); creativeCommitTransaction(); save(); draw(); }
      }
      if (field.matches("[data-level-cell-height]")) {
        var index = Number(field.getAttribute("data-index"));
        creativeBeginTransaction(); creativeSetHeight(index, field.value); creativeCommitTransaction();
        save(); draw(); creativeRenderInspector(); creativeUpdateHistoryButtons();
      }
    });
    shell.addEventListener("click", function(event) {
      if (event.target.closest("[data-level-transition-delete]")) {
        var id = event.target.closest("[data-level-transition-delete]").getAttribute("data-id");
        var transition = (state.transitions || []).find(function(item) { return item.id === id; });
        if (transition) { creativeBeginTransaction(); state.transitions = state.transitions.filter(function(item) { return item.id !== id; }); creativeRecordArrayChange("transitions", transition, transition, null); creativeCommitTransaction(); }
        creativeSelected = null; save(); draw(); creativeRenderInspector(); creativeUpdateHistoryButtons();
      }
      if (event.target.closest("[data-level-zone-delete]")) {
        var zoneId = event.target.closest("[data-level-zone-delete]").getAttribute("data-id");
        var selectedZone = (state.lightZones || []).find(function(item) { return item.id === zoneId; });
        if (selectedZone) { creativeBeginTransaction(); state.lightZones = state.lightZones.filter(function(item) { return item.id !== zoneId; }); creativeRecordArrayChange("lightZones", selectedZone, selectedZone, null); creativeCommitTransaction(); }
        creativeSelected = null; save(); draw(); creativeRenderInspector(); creativeUpdateHistoryButtons();
      }
    });
  }
  creativeLevelUiInstalled = true;
  creativeUpdateLevelUi();
}
function creativeCancelPendingTransition() {
  if (!creativePendingTransition) return;
  creativePendingTransition = null;
  if (tool === "transition") setTool("select");
  creativeUpdateLevelUi();
  if (R) draw();
}
function creativePlaceTransitionPoint(cell) {
  if (!creativePendingTransition) {
    var targetSelect = R && R.querySelector("#mp-creator-transition-target");
    var targetId = targetSelect && targetSelect.value;
    if (!targetId || targetId === creativeLevelId()) {
      appAlertMessage("msg008", "Escolha outro nível no campo 'Conectar com' antes de marcar a passagem.");
      return true;
    }
    creativePendingTransition = { fromLevelId: creativeLevelId(), fromX: cell.x, fromY: cell.y, toLevelId: targetId };
    creativeSwitchLevel(targetId, { keepTool: true });
    creativeUpdateLevelUi();
    return true;
  }
  var pending = creativePendingTransition;
  if (creativeLevelId() !== pending.toLevelId) {
    appAlertMessage("msg008", "Abra o nível de destino indicado para posicionar a outra ponta.");
    return true;
  }
  var link = {
    id: "passage-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 5),
    fromLevelId: pending.fromLevelId, fromX: pending.fromX, fromY: pending.fromY,
    toLevelId: pending.toLevelId, toX: cell.x, toY: cell.y,
    kind: "stairs", label: "Escada"
  };
  creativeBeginTransaction();
  state.transitions.push(link);
  creativeRecordArrayChange("transitions", link, null, link);
  creativeCommitTransaction();
  creativePendingTransition = null;
  creativeSelected = { type: "transition", id: link.id, endpoint: "to" };
  setTool("select"); save(); draw(); creativeRenderInspector(); creativeUpdateLevelUi();
  return true;
}
function creativeHeightAt(x, y) {
  if (!state || x < 0 || y < 0 || x >= COLS || y >= ROWS) return 0;
  return Number(state.terrainHeights && state.terrainHeights[String(idx(x, y))]) || 0;
}
function creativeSetHeight(index, value) {
  if (!state || index < 0 || index >= COLS * ROWS) return;
  if (!state.terrainHeights || typeof state.terrainHeights !== "object") state.terrainHeights = {};
  var before = Number(state.terrainHeights[String(index)]) || 0;
  var after = Math.max(-10, Math.min(10, Math.round(Number(value) || 0)));
  if (before === after) return;
  creativeRecordCreativeChange("height:" + index, { kind: "height", index: index, before: before, after: after });
  if (after) state.terrainHeights[String(index)] = after;
  else delete state.terrainHeights[String(index)];
}
function creativeApplyHeightBrush(cell, delta) {
  if (!cell || cell.x < 0 || cell.y < 0 || cell.x >= COLS || cell.y >= ROWS) return;
  var radius = Math.max(0, Math.floor((Number(creativeBrushSize) - 1) / 2));
  for (var y = cell.y - radius; y <= cell.y + radius; y++) for (var x = cell.x - radius; x <= cell.x + radius; x++) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
    var index = idx(x, y);
    creativeSetHeight(index, creativeHeightAt(x, y) + delta);
  }
}
function creativeDrawLevelBackdrop() {
  var level = creativeCurrentLevel();
  if (!level || level.environment === "outdoor") return;
  var colors = { interior: "#332a22", cavern: "#171a1e", basement: "#211d1b" };
  cx.save();
  cx.fillStyle = colors[level.environment] || "#171a1e";
  cx.fillRect(0, 0, MAP_W, MAP_H);
  cx.restore();
}
function creativeDrawTerrainRelief(viewW, viewH) {
  if (!state || isHexMap()) return;
  var bounds = creativeSquareVisibleBounds(viewW, viewH), heights = state.terrainHeights || {};
  for (var y = bounds.y0; y <= bounds.y1; y++) for (var x = bounds.x0; x <= bounds.x1; x++) {
    var height = Number(heights[String(idx(x, y))]) || 0;
    if (!height) continue;
    var px = x * CELL, py = y * CELL, magnitude = Math.abs(height), face = Math.min(CELL * .24, magnitude * CELL * .035);
    cx.save();
    if (height > 0) {
      cx.fillStyle = "rgba(255,232,174," + Math.min(.2, .035 * magnitude) + ")";
      cx.fillRect(px, py, CELL, CELL);
      var south = y + 1 < ROWS ? creativeHeightAt(x, y + 1) : 0;
      var east = x + 1 < COLS ? creativeHeightAt(x + 1, y) : 0;
      var dropSouth = Math.max(0, height - south), dropEast = Math.max(0, height - east);
      if (dropSouth) { cx.fillStyle = "rgba(15,12,10," + Math.min(.72, .16 + dropSouth * .07) + ")"; cx.fillRect(px, py + CELL - face * Math.min(3, dropSouth), CELL, face * Math.min(3, dropSouth)); }
      if (dropEast) { cx.fillStyle = "rgba(8,8,8," + Math.min(.62, .14 + dropEast * .07) + ")"; cx.fillRect(px + CELL - face * Math.min(3, dropEast), py, face * Math.min(3, dropEast), CELL); }
      cx.strokeStyle = "rgba(255,238,190,.45)"; cx.lineWidth = 1 / zoom; cx.strokeRect(px + 2 / zoom, py + 2 / zoom, CELL - 4 / zoom, CELL - 4 / zoom);
    } else {
      cx.fillStyle = "rgba(0,0,0," + Math.min(.34, .045 * magnitude) + ")";
      cx.fillRect(px, py, CELL, CELL);
      cx.strokeStyle = "rgba(20,15,12,.65)"; cx.lineWidth = 2 / zoom;
      cx.beginPath(); cx.moveTo(px + 3 / zoom, py + 3 / zoom); cx.lineTo(px + CELL - 3 / zoom, py + CELL - 3 / zoom); cx.moveTo(px + CELL - 3 / zoom, py + 3 / zoom); cx.lineTo(px + 3 / zoom, py + CELL - 3 / zoom); cx.stroke();
    }
    if (appMode === "editor") {
      cx.fillStyle = "rgba(255,245,215,.9)"; cx.font = "bold " + (10 / zoom) + "px sans-serif"; cx.textAlign = "right"; cx.textBaseline = "top";
      cx.fillText((height > 0 ? "+" : "") + height, px + CELL - 3 / zoom, py + 3 / zoom);
    }
    cx.restore();
  }
}
function creativeDrawLightingZones() {
  if (appMode !== "editor" || !state || isHexMap()) return;
  (state.lightZones || []).forEach(function(zone) {
    var x = zone.x * CELL, y = zone.y * CELL, w = (zone.w + 1) * CELL, h = (zone.h + 1) * CELL;
    cx.save();
    cx.fillStyle = "rgba(9,12,16,.16)"; cx.fillRect(x, y, w, h);
    cx.strokeStyle = creativeSelected && creativeSelected.type === "lightZone" && creativeSelected.id === zone.id ? "#ffe08a" : "rgba(238,190,112,.9)";
    cx.lineWidth = (creativeSelected && creativeSelected.type === "lightZone" && creativeSelected.id === zone.id ? 3 : 1.5) / zoom;
    cx.setLineDash([7 / zoom, 4 / zoom]); cx.strokeRect(x, y, w, h); cx.setLineDash([]);
    cx.fillStyle = "#ffe0a4"; cx.font = "bold " + (11 / zoom) + "px sans-serif"; cx.textAlign = "left"; cx.textBaseline = "top";
    cx.fillText((zone.name || "INTERIOR") + " · SEM LUZ SOLAR", x + 5 / zoom, y + 5 / zoom);
    cx.restore();
  });
  if (drag && drag.creativeLightZone && drag.zonePreview) {
    var preview = drag.zonePreview;
    cx.save(); cx.fillStyle = "rgba(216,157,75,.14)"; cx.strokeStyle = "#e7bb76"; cx.lineWidth = 2 / zoom; cx.setLineDash([6 / zoom, 4 / zoom]);
    cx.fillRect(preview.x * CELL, preview.y * CELL, (preview.w + 1) * CELL, (preview.h + 1) * CELL);
    cx.strokeRect(preview.x * CELL, preview.y * CELL, (preview.w + 1) * CELL, (preview.h + 1) * CELL); cx.restore();
  }
}
function creativeDrawLevelTransitions() {
  if (!state || isHexMap()) return;
  var activeId = creativeLevelId();
  (state.transitions || []).forEach(function(link) {
    var endpoint = null, other = null;
    if (link.fromLevelId === activeId) { endpoint = { x: link.fromX, y: link.fromY }; other = link.toLevelId; }
    else if (link.toLevelId === activeId) { endpoint = { x: link.toX, y: link.toY }; other = link.fromLevelId; }
    if (!endpoint) return;
    var center = cellCenter(endpoint.x, endpoint.y), selectedLink = creativeSelected && creativeSelected.type === "transition" && creativeSelected.id === link.id;
    cx.save(); cx.translate(center.x, center.y);
    cx.fillStyle = "rgba(20,17,13,.94)"; cx.strokeStyle = selectedLink ? "#fff0b8" : "#d4a65d"; cx.lineWidth = (selectedLink ? 2.6 : 1.8) / zoom;
    cx.beginPath(); cx.arc(0, 0, 11 / zoom, 0, Math.PI * 2); cx.fill(); cx.stroke();
    cx.fillStyle = "#ffe0a2"; cx.font = "bold " + 13 / zoom + "px sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.fillText(link.kind === "ladder" ? "↕" : link.kind === "hatch" ? "⌄" : "⇵", 0, 0);
    if (appMode === "editor") { cx.font = "bold " + 9 / zoom + "px sans-serif"; cx.fillText(String(((state.levels || []).find(function(l) { return l.id === other; }) || {}).name || "Nível"), 0, 19 / zoom); }
    cx.restore();
  });
}
function creativeFindTransitionHit(worldX, worldY) {
  var activeId = creativeLevelId(), links = state.transitions || [];
  for (var i = links.length - 1; i >= 0; i--) {
    var link = links[i], endpoint = null, side = "from";
    if (link.fromLevelId === activeId) endpoint = { x: link.fromX, y: link.fromY };
    else if (link.toLevelId === activeId) { endpoint = { x: link.toX, y: link.toY }; side = "to"; }
    if (!endpoint) continue;
    var center = cellCenter(endpoint.x, endpoint.y);
    if (Math.hypot(worldX - center.x, worldY - center.y) <= Math.max(CELL * .38, 12 / zoom)) return { type: "transition", id: link.id, item: link, endpoint: side };
  }
  return null;
}
function creativeFindLightZoneBorderHit(worldX, worldY) {
  var zones = state.lightZones || [], tolerance = Math.max(7 / zoom, CELL * .12);
  for (var i = zones.length - 1; i >= 0; i--) {
    var zone = zones[i], x1 = zone.x * CELL, y1 = zone.y * CELL, x2 = (zone.x + zone.w + 1) * CELL, y2 = (zone.y + zone.h + 1) * CELL;
    var nearHorizontal = (Math.abs(worldY - y1) <= tolerance || Math.abs(worldY - y2) <= tolerance) && worldX >= x1 - tolerance && worldX <= x2 + tolerance;
    var nearVertical = (Math.abs(worldX - x1) <= tolerance || Math.abs(worldX - x2) <= tolerance) && worldY >= y1 - tolerance && worldY <= y2 + tolerance;
    if (nearHorizontal || nearVertical) return { type: "lightZone", id: zone.id, item: zone };
  }
  return null;
}
function creativeTryTraverseLayerTransition(player) {
  if (!player || appMode !== "player" || isHexMap()) return false;
  var activeId = creativeLevelId(), link = null, target = null;
  (state.transitions || []).some(function(item) {
    if (item.fromLevelId === activeId && item.fromX === player.x && item.fromY === player.y) { link = item; target = { id: item.toLevelId, x: item.toX, y: item.toY }; return true; }
    if (item.toLevelId === activeId && item.toX === player.x && item.toY === player.y) { link = item; target = { id: item.fromLevelId, x: item.fromX, y: item.fromY }; return true; }
    return false;
  });
  if (!link || !target) return false;
  creativeLastTransitionNotice = Date.now();
  player.x = target.x; player.y = target.y; player.layerId = target.id;
  if (typeof stopKeyMove === "function") stopKeyMove();
  creativeSwitchLevel(target.id, { playerTransition: true, player: player });
  if (R) {
    var toast = R.querySelector("#mp-combat-toast");
    if (toast) { toast.textContent = "Você entrou em " + ((state.levels || []).find(function(level) { return level.id === target.id; }) || {}).name + "."; toast.style.display = "block"; window.setTimeout(function() { toast.style.display = "none"; }, 1800); }
  }
  return true;
}
function creativeCanSeeCellFromLight(x, y, px, py, radius) {
  var dx = x - px, dy = y - py;
  return dx * dx + dy * dy <= radius * radius + .5 && hasLOS(px, py, x, y);
}
function creativeApplyLayerToolDown(event, world, cell) {
  if (tool === "transition") return creativePlaceTransitionPoint(cell);
  if (tool === "raiseTerrain" || tool === "lowerTerrain") {
    creativeBeginTransaction();
    var delta = tool === "raiseTerrain" ? 1 : -1;
    drag = { creativeHeight: true, delta: delta, lastX: cell.x, lastY: cell.y };
    creativeApplyHeightBrush(cell, delta); draw(); return true;
  }
  if (tool === "interiorZone") {
    if (cell.x < 0 || cell.y < 0 || cell.x >= COLS || cell.y >= ROWS) return true;
    drag = { creativeLightZone: true, startX: cell.x, startY: cell.y, zonePreview: { x: cell.x, y: cell.y, w: 0, h: 0 } };
    draw(); return true;
  }
  return false;
}
function creativeRenderLevelInspector() {
  if (!creativeSelected || !R) return false;
  var box = R.querySelector("#mp-creator-inspector");
  if (!box) return false;
  if (creativeSelected.type === "transition") {
    var link = (state.transitions || []).find(function(item) { return item.id === creativeSelected.id; });
    if (!link) { box.innerHTML = '<span class="mp-creator-muted">Passagem não encontrada.</span>'; return true; }
    var fromLevel = (state.levels || []).find(function(item) { return item.id === link.fromLevelId; });
    var toLevel = (state.levels || []).find(function(item) { return item.id === link.toLevelId; });
    box.innerHTML = '<div class="mp-creator-selection"><strong>Passagem entre níveis</strong><span>' + esc(fromLevel && fromLevel.name || "Origem") + ' ↔ ' + esc(toLevel && toLevel.name || "Destino") + '</span></div><div class="mp-creator-fields"><label class="mp-creator-field"><span>Nome</span><input data-level-transition-field="label" data-id="' + esc(link.id) + '" value="' + esc(link.label || "Passagem") + '"></label><label class="mp-creator-field"><span>Tipo</span><select data-level-transition-field="kind" data-id="' + esc(link.id) + '"><option value="stairs" ' + (link.kind === "stairs" ? "selected" : "") + '>Escada</option><option value="ladder" ' + (link.kind === "ladder" ? "selected" : "") + '>Escada vertical</option><option value="hatch" ' + (link.kind === "hatch" ? "selected" : "") + '>Alçapão</option><option value="cave" ' + (link.kind === "cave" ? "selected" : "") + '>Entrada de caverna</option></select></label><div class="mp-creator-muted mp-creator-field-full">Origem: coluna ' + (link.fromX + 1) + ', linha ' + (link.fromY + 1) + ' · Destino: coluna ' + (link.toX + 1) + ', linha ' + (link.toY + 1) + '</div></div><div class="mp-creator-selection-actions"><button type="button" class="danger" data-level-transition-delete data-id="' + esc(link.id) + '">Excluir passagem</button></div>';
    return true;
  }
  if (creativeSelected.type === "lightZone") {
    var zone = (state.lightZones || []).find(function(item) { return item.id === creativeSelected.id; });
    if (!zone) { box.innerHTML = '<span class="mp-creator-muted">Zona não encontrada.</span>'; return true; }
    box.innerHTML = '<div class="mp-creator-selection"><strong>Zona interna / sem luz solar</strong><span>O personagem precisa de uma fonte de luz para enxergar dentro desta área.</span></div><div class="mp-creator-fields"><label class="mp-creator-field mp-creator-field-full"><span>Nome da área</span><input data-level-zone-name data-id="' + esc(zone.id) + '" value="' + esc(zone.name || "Interior") + '"></label><div class="mp-creator-muted mp-creator-field-full">Área: ' + (zone.w + 1) + ' × ' + (zone.h + 1) + ' células.</div></div><div class="mp-creator-selection-actions"><button type="button" class="danger" data-level-zone-delete data-id="' + esc(zone.id) + '">Remover zona interna</button></div>';
    return true;
  }
  if (creativeSelected.type === "height") {
    var height = creativeHeightAt(creativeSelected.x, creativeSelected.y);
    box.innerHTML = '<div class="mp-creator-selection"><strong>Altura do terreno</strong><span>Desnível relativo nesta célula.</span></div><div class="mp-creator-fields"><label class="mp-creator-field"><span>Altura (níveis)</span><input type="number" min="-10" max="10" step="1" data-level-cell-height data-index="' + creativeSelected.index + '" value="' + height + '"></label><div class="mp-creator-muted">Diferenças acima de 1 nível bloqueiam a passagem sem uma escada ou acesso.</div></div>';
    return true;
  }
  return false;
}

/* Integração com o editor existente sem substituir os dados de combate/VTT. */
var creativeBaseInstallUi = creativeInstallUi;
creativeInstallUi = function() { creativeBaseInstallUi(); creativeInstallLevelUi(); };
var creativeBaseUpdateUi = creativeUpdateUi;
creativeUpdateUi = function() { creativeBaseUpdateUi(); creativeUpdateLevelUi(); };
var creativeBaseRenderInspector = creativeRenderInspector;
creativeRenderInspector = function() {
  if (creativeRenderLevelInspector()) return;
  creativeBaseRenderInspector();
  if (creativeSelected && creativeSelected.type === "terrain" && R) {
    var inspector = R.querySelector("#mp-creator-inspector");
    if (inspector) {
      var currentHeight = creativeHeightAt(creativeSelected.x, creativeSelected.y);
      inspector.insertAdjacentHTML("beforeend", '<div class="mp-creator-fields mp-creator-level-height-field"><label class="mp-creator-field"><span>Desnível (níveis)</span><input type="number" min="-10" max="10" step="1" data-level-cell-height data-index="' + creativeSelected.index + '" value="' + currentHeight + '"></label></div>');
    }
  }
};
var creativeBaseHandlePointerDown = creativeHandlePointerDown;
creativeHandlePointerDown = function(event, world, cell) {
  if (appMode === "editor" && !isHexMap()) {
    if (creativeApplyLayerToolDown(event, world, cell)) return true;
    if (tool === "select") {
      var transitionHit = creativeFindTransitionHit(world.x, world.y);
      if (transitionHit) {
        creativeSelected = { type: "transition", id: transitionHit.id, endpoint: transitionHit.endpoint };
        creativeBeginTransaction();
        var coordinateX = transitionHit.endpoint === "from" ? transitionHit.item.fromX : transitionHit.item.toX;
        var coordinateY = transitionHit.endpoint === "from" ? transitionHit.item.fromY : transitionHit.item.toY;
        drag = { creativeTransitionDrag: true, id: transitionHit.id, endpoint: transitionHit.endpoint, offsetX: cell.x - coordinateX, offsetY: cell.y - coordinateY, before: creativeClone(transitionHit.item) };
        creativeRenderInspector(); draw(); return true;
      }
      var zoneHit = creativeFindLightZoneBorderHit(world.x, world.y);
      if (zoneHit) { creativeSelected = { type: "lightZone", id: zoneHit.id }; creativeRenderInspector(); draw(); return true; }
      var baseHit = creativeHitTest(world.x, world.y);
      if (!baseHit && cell.x >= 0 && cell.y >= 0 && cell.x < COLS && cell.y < ROWS && creativeHeightAt(cell.x, cell.y)) {
        creativeSelected = { type: "height", id: String(idx(cell.x, cell.y)), index: idx(cell.x, cell.y), x: cell.x, y: cell.y };
        creativeRenderInspector(); draw(); return true;
      }
    }
  }
  return creativeBaseHandlePointerDown(event, world, cell);
};
var creativeBaseHandlePointerMove = creativeHandlePointerMove;
creativeHandlePointerMove = function(event, world, cell) {
  if (drag && drag.creativeHeight) {
    if (cell.x !== drag.lastX || cell.y !== drag.lastY) { creativeApplyHeightBrush(cell, drag.delta); drag.lastX = cell.x; drag.lastY = cell.y; }
    return true;
  }
  if (drag && drag.creativeLightZone) {
    var x = Math.max(0, Math.min(drag.startX, cell.x)), y = Math.max(0, Math.min(drag.startY, cell.y));
    drag.zonePreview = { x: x, y: y, w: Math.abs(cell.x - drag.startX), h: Math.abs(cell.y - drag.startY) };
    return true;
  }
  if (drag && drag.creativeTransitionDrag) {
    var link = (state.transitions || []).find(function(item) { return item.id === drag.id; });
    if (link) {
      var nx = Math.max(0, Math.min(COLS - 1, cell.x - drag.offsetX)), ny = Math.max(0, Math.min(ROWS - 1, cell.y - drag.offsetY));
      if (drag.endpoint === "from") { link.fromX = nx; link.fromY = ny; } else { link.toX = nx; link.toY = ny; }
    }
    return true;
  }
  return creativeBaseHandlePointerMove(event, world, cell);
};
var creativeBaseFinishPointerAction = creativeFinishPointerAction;
creativeFinishPointerAction = function() {
  if (drag && drag.creativeHeight) {
    creativeCommitTransaction(); drag = null; save(); draw(); creativeUpdateHistoryButtons(); return true;
  }
  if (drag && drag.creativeLightZone) {
    var preview = drag.zonePreview || { x: drag.startX, y: drag.startY, w: 0, h: 0 };
    state.lightZones = state.lightZones || [];
    var newZone = { id: "light-zone-" + Date.now().toString(36), x: preview.x, y: preview.y, w: preview.w, h: preview.h, mode: "dark", name: "Interior" };
    creativeBeginTransaction(); state.lightZones.push(newZone); creativeRecordArrayChange("lightZones", newZone, null, newZone); creativeCommitTransaction();
    drag = null; setTool("select"); creativeSelected = { type: "lightZone", id: newZone.id }; save(); draw(); creativeUpdateLevelUi(); creativeRenderInspector(); creativeUpdateHistoryButtons(); return true;
  }
  if (drag && drag.creativeTransitionDrag) {
    var link = (state.transitions || []).find(function(item) { return item.id === drag.id; });
    if (link) creativeRecordArrayChange("transitions", link, drag.before, link);
    creativeCommitTransaction(); drag = null; save(); draw(); creativeRenderInspector(); creativeUpdateHistoryButtons(); return true;
  }
  return creativeBaseFinishPointerAction();
};
var creativeBaseHitTest = creativeHitTest;
creativeHitTest = function(worldX, worldY) {
  var transition = creativeFindTransitionHit(worldX, worldY);
  if (transition) return transition;
  var base = creativeBaseHitTest(worldX, worldY);
  if (base) return base;
  var zone = creativeFindLightZoneBorderHit(worldX, worldY);
  if (zone) return zone;
  var x = Math.floor(worldX / CELL), y = Math.floor(worldY / CELL);
  if (x >= 0 && y >= 0 && x < COLS && y < ROWS && creativeHeightAt(x, y)) return { type: "height", id: idx(x, y), index: idx(x, y), x: x, y: y };
  return null;
};
var creativeBaseDeleteSelected = creativeDeleteSelected;
creativeDeleteSelected = function() {
  if (creativeSelected && creativeSelected.type === "transition") {
    var id = creativeSelected.id; creativeBeginTransaction();
    var link = (state.transitions || []).find(function(item) { return item.id === id; });
    if (link) { state.transitions = state.transitions.filter(function(item) { return item.id !== id; }); creativeRecordArrayChange("transitions", link, link, null); }
    creativeCommitTransaction(); creativeSelected = null; save(); draw(); creativeRenderInspector(); return;
  }
  if (creativeSelected && creativeSelected.type === "lightZone") {
    var selectedZone = (state.lightZones || []).find(function(item) { return item.id === creativeSelected.id; });
    if (selectedZone) {
      creativeBeginTransaction();
      state.lightZones = state.lightZones.filter(function(item) { return item.id !== selectedZone.id; });
      creativeRecordArrayChange("lightZones", selectedZone, selectedZone, null);
      creativeCommitTransaction();
    }
    creativeSelected = null; save(); draw(); creativeRenderInspector(); creativeUpdateHistoryButtons(); return;
  }
  if (creativeSelected && creativeSelected.type === "height") {
    creativeBeginTransaction(); creativeSetHeight(creativeSelected.index, 0); creativeCommitTransaction();
    creativeSelected = null; save(); draw(); creativeRenderInspector(); return;
  }
  creativeBaseDeleteSelected();
};
var creativeBaseKeyboard = creativeHandleKeyboard;
creativeHandleKeyboard = function(event) {
  if (event.key === "Escape" && creativePendingTransition) { creativeCancelPendingTransition(); return true; }
  return creativeBaseKeyboard(event);
};
var creativeBaseDrawLayer = creativeDrawLayer;
creativeDrawLayer = function(viewW, viewH) {
  creativeDrawLevelBackdrop();
  creativeBaseDrawLayer(viewW, viewH);
  creativeDrawTerrainRelief(viewW, viewH);
  creativeDrawLightingZones();
};
var creativeBaseDefaultState = defaultState;
defaultState = function() { var result = creativeBaseDefaultState(); return creativeEnsureLevelState(result); };
var creativeBaseNormalizeState = normalizeMapState;
normalizeMapState = function(source) { var result = creativeBaseNormalizeState(source); return result ? creativeEnsureLevelState(result) : result; };
var creativeBaseSerializeState = serializeMapState;
serializeMapState = function(source) { creativeStoreActiveLevelData(source); return creativeBaseSerializeState(source); };
var creativeBaseCurrentPlayer = currentPlayer;
currentPlayer = function() {
  if (state && !isHexMap() && Array.isArray(state.tokens)) {
    var active = state.tokens.find(function(token) { return token && token.tipo === "player" && (!token.layerId || token.layerId === creativeLevelId()); });
    if (active) return active;
    var fallback = state.tokens.find(function(token) { return token && (!token.layerId || token.layerId === creativeLevelId()); });
    return fallback || null;
  }
  return creativeBaseCurrentPlayer();
};
var creativeBaseIsTokenVisible = isTokenVisible;
isTokenVisible = function(token) { if (!token) return false; if (!isHexMap() && !token.layerId) token.layerId = creativeLevelId(); if (!isHexMap() && token.layerId !== creativeLevelId()) return false; return creativeBaseIsTokenVisible(token); };
var creativeBaseVisibility = isCurrentlyVisible;
isCurrentlyVisible = function(x, y, px, py, radius) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
  if (isHexMap() || appMode === "editor") return true;
  var darkCell = creativeIsDarkCell(x, y);
  if (!darkCell) {
    if (!dynLight) return !state.fog[idx(x, y)];
    if (px < 0) return false;
    var viewer = currentPlayer();
    var dayRadius = viewer ? creativeGetTokenVisionRadius(viewer) : Math.max(1, Number(radius) || 6);
    return creativeCanSeeCellFromLight(x, y, px, py, dayRadius);
  }
  if (px >= 0) {
    var viewerToken = currentPlayer();
    var radiusValue = viewerToken ? creativeGetTokenLightRadius(viewerToken) : (radius != null && Number.isFinite(Number(radius)) ? Math.max(0, Number(radius)) : 0);
    if (creativeCanSeeCellFromLight(x, y, px, py, radiusValue)) return true;
  }
  return (state.lights || []).some(function(light) {
    var lightRadiusCells = Math.max(1, Number(light.radius) || 0);
    return creativeCanSeeCellFromLight(x, y, Number(light.x), Number(light.y), lightRadiusCells);
  });
};
var creativeBaseCanStep = canStep;
canStep = function(fromX, fromY, toX, toY, token, detectTouch) {
  if (!isHexMap()) {
    var fromHeight = creativeHeightAt(fromX, fromY), toHeight = creativeHeightAt(toX, toY);
    if (Math.abs(toHeight - fromHeight) > 1 && !(token && token.climbTerrain)) return false;
  }
  return creativeBaseCanStep(fromX, fromY, toX, toY, token, detectTouch);
};
