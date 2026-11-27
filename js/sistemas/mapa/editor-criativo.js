/*
 * Editor criativo de mapas do Animalysson RPG.
 * Camadas procedurais e objetos são armazenados no estado nativo do mapa;
 * não substituem o sistema de VTT, paredes, névoa, tokens ou combate.
 */
var CREATIVE_MATERIALS = {
  stone: { id: 1, label: "Pedra", color: "#77736a" },
  wood: { id: 2, label: "Madeira", color: "#896044" },
  grass: { id: 3, label: "Grama", color: "#456d43" },
  sand: { id: 4, label: "Areia", color: "#b49a68" },
  water: { id: 5, label: "Água", color: "#367e9a" },
  lava: { id: 6, label: "Lava", color: "#a94424" },
  dirt: { id: 7, label: "Terra", color: "#70503c" },
  snow: { id: 8, label: "Neve", color: "#b9c8cf" }
};
var CREATIVE_MATERIAL_BY_ID = Object.keys(CREATIVE_MATERIALS).reduce(function(out, key) {
  out[CREATIVE_MATERIALS[key].id] = key;
  return out;
}, {});
var CREATIVE_OBJECTS = {
  tree: { label: "Árvore", glyph: "🌳" },
  pine: { label: "Pinheiro", glyph: "🌲" },
  bush: { label: "Arbusto", glyph: "🌿" },
  rock: { label: "Rocha", glyph: "🪨" },
  table: { label: "Mesa", glyph: "🪑" },
  bed: { label: "Cama", glyph: "🛏️" },
  chest: { label: "Baú", glyph: "🧰" },
  crate: { label: "Caixote", glyph: "📦" },
  fire: { label: "Fogueira", glyph: "🔥" },
  stairs: { label: "Escada", glyph: "🪜" },
  pillar: { label: "Coluna", glyph: "🏛️" },
  bones: { label: "Ossos", glyph: "🦴" }
};
var creativeMaterial = "stone";
var creativeObjectKind = "tree";
var creativeSelectedAssetId = null;
var creativeImageCache = {};
var creativeBrushSize = 1;
var creativeLightRadius = 5;
var creativeLightColor = "#ffd36a";
var creativeHistoryUndo = [];
var creativeHistoryRedo = [];
var creativeTransaction = null;
var creativeSelected = null;
var creativeTextureCache = {};
var creativeUiReady = false;
var creativeTextureSeed = 0;

function creativeClone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}
function creativeTerrainBytes(s) {
  if (!s) return null;
  return s._terrainBytes instanceof Uint8Array ? s._terrainBytes : null;
}
function creativeStoreTerrainBytes(bytes, count) {
  if (!state) return;
  try {
    Object.defineProperty(state, "_terrainBytes", { value: bytes, writable: true, configurable: true, enumerable: false });
    Object.defineProperty(state, "_terrainCount", { value: Number(count) || 0, writable: true, configurable: true, enumerable: false });
  } catch (e) {
    state._terrainBytes = bytes;
    state._terrainCount = Number(count) || 0;
  }
}
function creativeCompactTerrainState() {
  if (!state || creativeTerrainBytes(state)) return;
  var terrain = state.terrain || {}, keys = Object.keys(terrain);
  if (keys.length <= 4096) return;
  var bytes = creativeTerrainToBytes(), count = bytes.reduce(function(sum, value) { return sum + (value ? 1 : 0); }, 0);
  creativeStoreTerrainBytes(bytes, count);
  state.terrain = {};
}
function creativeGetTerrain(index) {
  var bytes = creativeTerrainBytes(state);
  if (bytes) return CREATIVE_MATERIAL_BY_ID[bytes[index]] || null;
  return state.terrain && state.terrain[String(index)] || null;
}
function creativeSetTerrain(index, material) {
  if (!state || index < 0 || index >= COLS * ROWS) return;
  var bytes = creativeTerrainBytes(state);
  var nextId = material ? CREATIVE_MATERIALS[material] && CREATIVE_MATERIALS[material].id || 0 : 0;
  if (bytes) {
    var prev = bytes[index] || 0;
    if (prev === nextId) return;
    if (creativeTransaction && !creativeTransaction.terrainBefore) creativeRecordCreativeChange("terrain:" + index, { kind: "terrain", index: index, before: prev, after: nextId });
    bytes[index] = nextId;
    state._terrainCount = Math.max(0, (state._terrainCount || 0) + (prev ? 0 : 1) - (nextId ? 0 : 1));
    return;
  }
  if (!state.terrain || typeof state.terrain !== "object") state.terrain = {};
  var key = String(index), before = state.terrain[key] || null;
  if (before === (material || null)) return;
  if (creativeTransaction && !creativeTransaction.terrainBefore) creativeRecordCreativeChange("terrain:" + index, { kind: "terrainSparse", index: index, before: before, after: material || null });
  if (material) state.terrain[key] = material;
  else delete state.terrain[key];
}
function creativeTerrainToBytes() {
  var current = creativeTerrainBytes(state);
  if (current) return current.slice();
  var bytes = new Uint8Array(COLS * ROWS), terrain = state.terrain || {};
  Object.keys(terrain).forEach(function(key) {
    var index = Number(key), material = terrain[key], meta = CREATIVE_MATERIALS[material];
    if (Number.isInteger(index) && index >= 0 && index < bytes.length && meta) bytes[index] = meta.id;
  });
  return bytes;
}
function creativeEncodeTerrain(bytes) {
  if (!bytes || !bytes.length) return "";
  var binary = "", chunk = 0x8000;
  for (var i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunk, bytes.length)));
  return btoa(binary);
}
function creativeDecodeTerrain(encoded, length) {
  try {
    var binary = atob(String(encoded || "")), bytes = new Uint8Array(length), count = Math.min(binary.length, length), used = 0;
    for (var i = 0; i < count; i++) {
      var value = binary.charCodeAt(i);
      if (value <= 8) {
        bytes[i] = value;
        if (value) used++;
      }
    }
    return { bytes: bytes, count: used };
  } catch (e) {
    return { bytes: new Uint8Array(length), count: 0 };
  }
}
function serializeMapState(source) {
  // Nunca serializar buffers de trabalho (Uint8Array) como objetos JSON.
  var plain = {};
  Object.keys(source || {}).forEach(function(key) {
    if (key !== "_terrainBytes" && key !== "_terrainCount") plain[key] = source[key];
  });
  var snapshot = JSON.parse(JSON.stringify(plain));
  var bytes = creativeTerrainBytes(source);
  if (bytes) {
    var count = Number(source._terrainCount) || 0;
    if (count > 0) snapshot.terrainPacked = creativeEncodeTerrain(bytes);
    else delete snapshot.terrainPacked;
    delete snapshot.terrain;
  } else if (source && source.terrain && Object.keys(source.terrain).length > 4096) {
    var packed = creativeTerrainToBytes();
    snapshot.terrainPacked = creativeEncodeTerrain(packed);
    delete snapshot.terrain;
  } else if (source && source.terrain && Object.keys(source.terrain).length === 0) {
    delete snapshot.terrainPacked;
  }
  return snapshot;
}
function creativeBeginTransaction() {
  creativeTransaction = { changes: [], lookup: Object.create(null) };
  return creativeTransaction;
}
function creativeBeginTerrainTransaction() {
  creativeBeginTransaction();
  creativeTransaction.terrainBefore = creativeTerrainToBytes();
  return creativeTransaction;
}
function creativeRecordCreativeChange(key, change) {
  if (!creativeTransaction) return;
  var found = creativeTransaction.lookup[key];
  if (found != null) {
    creativeTransaction.changes[found].after = change.after;
  } else {
    creativeTransaction.lookup[key] = creativeTransaction.changes.length;
    creativeTransaction.changes.push(change);
  }
}
function creativeRecordArrayChange(collection, item, before, after) {
  if (!creativeTransaction || !item) return;
  creativeRecordCreativeChange(collection + ":" + item.id, {
    kind: "record", collection: collection, id: item.id,
    before: before == null ? null : creativeClone(before),
    after: after == null ? null : creativeClone(after)
  });
}
function creativeCommitTransaction() {
  if (!creativeTransaction) return false;
  var tx = creativeTransaction;
  creativeTransaction = null;
  if (tx.terrainBefore) {
    var terrainAfter = creativeTerrainToBytes();
    tx.changes = tx.changes.filter(function(change) { return change.kind !== "terrain" && change.kind !== "terrainSparse" && change.kind !== "terrainSnapshot"; });
    tx.changes.push({ kind: "terrainSnapshot", before: tx.terrainBefore, after: terrainAfter });
    delete tx.terrainBefore;
  }
  tx.changes = tx.changes.filter(function(change) {
    if (change.kind === "terrainSnapshot") {
      var a = change.before, b = change.after;
      if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array) || a.length !== b.length) return true;
      for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return true;
      return false;
    }
    return JSON.stringify(change.before) !== JSON.stringify(change.after);
  });
  delete tx.lookup;
  if (!tx.changes.length) return false;
  creativeCompactTerrainState();
  creativeHistoryUndo.push(tx);
  // Limita memória do histórico em mapas grandes.
  if (creativeHistoryUndo.length > 8) creativeHistoryUndo.shift();
  creativeHistoryRedo = [];
  creativeUpdateHistoryButtons();
  return true;
}
function creativeApplyHistoryChange(change, side) {
  var value = change.kind === "terrainSnapshot" && change[side] instanceof Uint8Array ? change[side] : creativeClone(change[side]);
  if (change.kind === "terrain" || change.kind === "terrainSparse") {
    var bytes = creativeTerrainBytes(state);
    if (bytes) {
      var before = bytes[change.index] || 0;
      var next = change.kind === "terrain" ? Number(value) || 0 : value ? CREATIVE_MATERIALS[value].id : 0;
      bytes[change.index] = next;
      state._terrainCount = Math.max(0, (state._terrainCount || 0) + (before ? 0 : 1) - (next ? 0 : 1));
    } else {
      if (!state.terrain) state.terrain = {};
      if (value) state.terrain[String(change.index)] = value;
      else delete state.terrain[String(change.index)];
    }
  } else if (change.kind === "edge") {
    var arr = change.dir === "h" ? state.hEdges : state.vEdges;
    if (arr) arr[change.index] = Number(value) || 0;
  } else if (change.kind === "record") {
    var list = state[change.collection] || (state[change.collection] = []);
    var index = list.findIndex(function(item) { return item && item.id === change.id; });
    if (index >= 0) list.splice(index, 1);
    if (value) list.push(value);
  } else if (change.kind === "terrainSnapshot") {
    var restoredBytes = value instanceof Uint8Array ? value.slice() : new Uint8Array(value || []);
    creativeStoreTerrainBytes(restoredBytes, restoredBytes.reduce(function(sum, v) { return sum + (v ? 1 : 0); }, 0));
    state.terrain = {};
  }
}
function creativeUndo() {
  if (!creativeHistoryUndo.length) return;
  var tx = creativeHistoryUndo.pop();
  tx.changes.slice().reverse().forEach(function(change) { creativeApplyHistoryChange(change, "before"); });
  creativeHistoryRedo.push(tx);
  creativeSelected = null;
  save();
  creativeUpdateHistoryButtons();
  draw();
  creativeRenderInspector();
}
function creativeRedo() {
  if (!creativeHistoryRedo.length) return;
  var tx = creativeHistoryRedo.pop();
  tx.changes.forEach(function(change) { creativeApplyHistoryChange(change, "after"); });
  creativeHistoryUndo.push(tx);
  creativeSelected = null;
  save();
  creativeUpdateHistoryButtons();
  draw();
  creativeRenderInspector();
}
function creativeUpdateHistoryButtons() {
  if (!R) return;
  var undo = R.querySelector("#mp-creator-undo"), redo = R.querySelector("#mp-creator-redo");
  if (undo) undo.disabled = !creativeHistoryUndo.length;
  if (redo) redo.disabled = !creativeHistoryRedo.length;
}
function creativeTexture(material) {
  if (creativeTextureCache[material]) return creativeTextureCache[material];
  var canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  var c = canvas.getContext("2d"), base = CREATIVE_MATERIALS[material] || CREATIVE_MATERIALS.stone;
  c.fillStyle = base.color;
  c.fillRect(0, 0, 128, 128);
  var seed = material.split("").reduce(function(n, ch) { return n * 31 + ch.charCodeAt(0); }, 17);
  function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  if (material === "stone") {
    c.strokeStyle = "rgba(20,18,16,.42)"; c.lineWidth = 3;
    [0, 42, 85, 127].forEach(function(y) { c.beginPath(); c.moveTo(0, y); c.lineTo(128, y); c.stroke(); });
    [0, 64, 128].forEach(function(x, i) { c.beginPath(); c.moveTo(x, i % 2 ? 0 : 42); c.lineTo(x, i % 2 ? 42 : 85); c.stroke(); c.moveTo(x, 85); c.lineTo(x, 128); c.stroke(); });
    c.strokeStyle = "rgba(230,224,210,.16)"; c.lineWidth = 1;
    for (var sy = 4; sy < 128; sy += 42) { c.beginPath(); c.moveTo(3, sy); c.lineTo(125, sy); c.stroke(); }
  } else if (material === "wood") {
    for (var wy = 0; wy < 128; wy += 32) {
      c.fillStyle = "rgba(45,22,12,.16)"; c.fillRect(0, wy, 128, 2);
      c.strokeStyle = "rgba(35,18,11,.45)"; c.lineWidth = 2; c.beginPath(); c.moveTo((wy / 32 % 2) * 42, wy); c.lineTo((wy / 32 % 2) * 42, wy + 32); c.moveTo(85 + (wy / 32 % 2) * 42 - 42, wy); c.lineTo(85 + (wy / 32 % 2) * 42 - 42, wy + 32); c.stroke();
      c.strokeStyle = "rgba(245,195,125,.13)"; c.lineWidth = 1;
      for (var g = 0; g < 4; g++) { var yy = wy + 5 + g * 6; c.beginPath(); c.moveTo(4, yy); c.bezierCurveTo(36, yy - 3, 80, yy + 3, 124, yy); c.stroke(); }
    }
  } else if (material === "grass" || material === "snow" || material === "dirt" || material === "sand") {
    for (var p = 0; p < 320; p++) {
      var px = random() * 128, py = random() * 128, alpha = 0.08 + random() * 0.22;
      c.fillStyle = material === "grass" ? "rgba(194,220,130," + alpha + ")" : material === "snow" ? "rgba(255,255,255," + alpha + ")" : material === "sand" ? "rgba(75,49,25," + alpha + ")" : "rgba(30,16,8," + alpha + ")";
      c.beginPath(); c.ellipse(px, py, 1 + random() * 2.5, 1 + random() * 1.5, random(), 0, Math.PI * 2); c.fill();
    }
    if (material === "grass") {
      c.strokeStyle = "rgba(25,75,30,.35)";
      for (var t = 0; t < 70; t++) { var tx = random() * 128, ty = random() * 128; c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx + (random() - .5) * 8, ty - 3 - random() * 5); c.stroke(); }
    }
  } else if (material === "water") {
    c.fillStyle = "rgba(130,215,235,.10)"; c.fillRect(0, 0, 128, 128);
    c.strokeStyle = "rgba(185,235,245,.38)"; c.lineWidth = 2;
    for (var wy2 = 12; wy2 < 128; wy2 += 22) {
      c.beginPath();
      for (var wx = 0; wx <= 128; wx += 4) { var yy2 = wy2 + Math.sin((wx + wy2) / 12) * 3; if (!wx) c.moveTo(wx, yy2); else c.lineTo(wx, yy2); }
      c.stroke();
    }
  } else if (material === "lava") {
    c.fillStyle = "rgba(45,16,10,.45)"; c.fillRect(0, 0, 128, 128);
    c.strokeStyle = "rgba(255,170,45,.88)"; c.lineWidth = 4;
    for (var crack = 0; crack < 12; crack++) {
      var sx = random() * 128, sy2 = random() * 128;
      c.beginPath(); c.moveTo(sx, sy2);
      for (var st = 0; st < 4; st++) { sx += (random() - .5) * 28; sy2 += (random() - .5) * 28; c.lineTo(sx, sy2); }
      c.stroke();
    }
    c.strokeStyle = "rgba(255,225,110,.42)"; c.lineWidth = 1; c.strokeRect(2, 2, 124, 124);
  }
  creativeTextureCache[material] = canvas;
  return canvas;
}
function creativeCellVisible(x, y, bounds) {
  return x >= bounds.x0 && y >= bounds.y0 && x <= bounds.x1 && y <= bounds.y1;
}
function creativeSquareVisibleBounds(viewW, viewH) {
  var left = -ox / zoom, top = -oy / zoom;
  var right = (viewW - ox) / zoom, bottom = (viewH - oy) / zoom;
  return {
    x0: Math.max(0, Math.floor(left / CELL) - 1),
    y0: Math.max(0, Math.floor(top / CELL) - 1),
    x1: Math.min(COLS - 1, Math.ceil(right / CELL) + 1),
    y1: Math.min(ROWS - 1, Math.ceil(bottom / CELL) + 1)
  };
}
function creativeDrawLayer(viewW, viewH) {
  if (!state || isHexMap()) return;
  var bounds = creativeSquareVisibleBounds(viewW, viewH), bytes = creativeTerrainBytes(state), terrain = state.terrain || {};
  var hasTerrain = bytes ? (state._terrainCount || 0) > 0 : Object.keys(terrain).length > 0;
  if (hasTerrain) {
    for (var y = bounds.y0; y <= bounds.y1; y++) for (var x = bounds.x0; x <= bounds.x1; x++) {
      var index = idx(x, y), material = bytes ? CREATIVE_MATERIAL_BY_ID[bytes[index]] : terrain[String(index)];
      if (!material || !CREATIVE_MATERIALS[material]) continue;
      cx.drawImage(creativeTexture(material), x * CELL, y * CELL, CELL + .25, CELL + .25);
    }
  }
  (state.decorations || []).forEach(function(item) {
    if (!creativeCellVisible(item.x, item.y, bounds)) return;
    var def = CREATIVE_OBJECTS[item.kind] || { glyph: item.glyph || "◆", label: "Objeto" };
    var center = cellCenter(item.x, item.y), size = CELL * Math.max(.28, Math.min(1.8, Number(item.size) || .82));
    cx.save(); cx.translate(center.x, center.y); cx.rotate((Number(item.rotation) || 0) * Math.PI / 180);
    var asset = item.kind === "image" ? creativeFindRecord("assets", item.assetId) : null;
    var image = asset ? creativeGetImage(asset) : null;
    if (image) {
      cx.shadowColor = "rgba(0,0,0,.55)"; cx.shadowBlur = size * .12;
      cx.drawImage(image, -size / 2, -size / 2, size, size);
    } else {
      cx.font = Math.round(size) + "px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif";
      cx.textAlign = "center"; cx.textBaseline = "middle";
      cx.shadowColor = "rgba(0,0,0,.7)"; cx.shadowBlur = size * .18; cx.fillText(def.glyph, 0, 1 / zoom);
    }
    cx.restore();
    if (creativeSelected && creativeSelected.type === "decoration" && creativeSelected.id === item.id) {
      cx.strokeStyle = "#ffe082"; cx.lineWidth = 2 / zoom;
      cx.strokeRect(item.x * CELL + 2 / zoom, item.y * CELL + 2 / zoom, CELL - 4 / zoom, CELL - 4 / zoom);
    }
  });
  (state.labels || []).forEach(function(label) {
    if (!creativeCellVisible(label.x, label.y, bounds)) return;
    var center = cellCenter(label.x, label.y), size = Math.max(10, Math.min(40, Number(label.size) || 16));
    cx.save(); cx.font = (label.bold === false ? "500 " : "700 ") + size / zoom + "px Roboto, Arial, sans-serif";
    cx.textAlign = label.align || "center"; cx.textBaseline = "middle";
    if (label.bubble) {
      var width = Math.min(CELL * 7, cx.measureText(label.text).width + 18 / zoom);
      cx.fillStyle = "rgba(12,15,20,.82)"; cx.strokeStyle = "rgba(255,255,255,.6)"; cx.lineWidth = 1 / zoom;
      cx.beginPath();
      var bx = center.x - width / 2, by = center.y - (size / zoom + 16 / zoom) / 2, bh = size / zoom + 16 / zoom, br = 6 / zoom;
      if (typeof cx.roundRect === "function") cx.roundRect(bx, by, width, bh, br); else cx.rect(bx, by, width, bh);
      cx.fill(); cx.stroke();
    }
    cx.lineWidth = 3 / zoom; cx.strokeStyle = "rgba(0,0,0,.78)"; cx.strokeText(label.text, center.x, center.y);
    cx.fillStyle = /^#[0-9a-f]{6}$/i.test(label.color || "") ? label.color : "#ffffff";
    cx.fillText(label.text, center.x, center.y);
    cx.restore();
    if (creativeSelected && creativeSelected.type === "label" && creativeSelected.id === label.id) {
      cx.strokeStyle = "#ffe082"; cx.lineWidth = 2 / zoom;
      cx.strokeRect(label.x * CELL + 2 / zoom, label.y * CELL + 2 / zoom, CELL - 4 / zoom, CELL - 4 / zoom);
    }
  });
}
function creativeHexRgb(hex) {
  var value = String(hex || "#ffffff").replace("#", "");
  return [parseInt(value.slice(0, 2), 16) || 255, parseInt(value.slice(2, 4), 16) || 255, parseInt(value.slice(4, 6), 16) || 255];
}
function creativeDrawLights(viewW, viewH) {
  if (!state || isHexMap() || !state.lights || !state.lights.length) return;
  var bounds = creativeSquareVisibleBounds(viewW, viewH);
  cx.save();
  // A luz decorativa nunca revela células cobertas pela névoa de guerra.
  if (showFog && state.fog) {
    cx.beginPath();
    for (var y = bounds.y0; y <= bounds.y1; y++) for (var x = bounds.x0; x <= bounds.x1; x++) {
      if (!state.fog[idx(x, y)]) cx.rect(x * CELL, y * CELL, CELL + .5, CELL + .5);
    }
    cx.clip();
  }
  state.lights.forEach(function(light) {
    if (!creativeCellVisible(light.x, light.y, bounds)) return;
    var center = cellCenter(light.x, light.y), radius = CELL * Math.max(1, Number(light.radius) || creativeLightRadius);
    var color = /^#[0-9a-f]{6}$/i.test(light.color || "") ? light.color : "#ffd36a";
    var rgb = creativeHexRgb(color), gradient = cx.createRadialGradient(center.x, center.y, 1, center.x, center.y, radius);
    var intensity = Math.max(.08, Math.min(.85, Number(light.intensity) || .42));
    gradient.addColorStop(0, "rgba(" + rgb.join(",") + "," + intensity + ")");
    gradient.addColorStop(.45, "rgba(" + rgb.join(",") + "," + (intensity * .28) + ")");
    gradient.addColorStop(1, "rgba(" + rgb.join(",") + ",0)");
    cx.fillStyle = gradient; cx.beginPath(); cx.arc(center.x, center.y, radius, 0, Math.PI * 2); cx.fill();
  });
  cx.restore();
}
function creativeGetImage(asset) {
  if (!asset || !asset.id || !asset.src) return null;
  var cached = creativeImageCache[asset.id];
  if (!cached || cached.src !== asset.src) {
    var image = new Image();
    cached = creativeImageCache[asset.id] = { src: asset.src, image: image, ready: false };
    image.onload = function() { cached.ready = true; if (R && state) draw(); };
    image.onerror = function() { cached.ready = false; };
    image.src = asset.src;
  }
  return cached.ready && cached.image.complete && cached.image.naturalWidth ? cached.image : null;
}
function creativeImportImageFile(file) {
  if (!file) return;
  if (!/^image\//i.test(file.type || "")) { appAlertMessage("msg008", "Selecione um arquivo de imagem válido."); return; }
  if (file.size > 10 * 1024 * 1024) { appAlertMessage("msg008", "A imagem original precisa ter até 10 MB."); return; }
  if ((state.assets || []).length >= 16) { appAlertMessage("msg008", "Limite de 16 imagens personalizadas por mapa. Remova uma imagem antiga antes de importar outra."); return; }
  var objectUrl = URL.createObjectURL(file), image = new Image();
  image.onload = function() {
    try {
      var side = 256, scale = Math.min(1, side / Math.max(image.naturalWidth, image.naturalHeight));
      var canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      var context = canvas.getContext("2d", { alpha: true });
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      var data = canvas.toDataURL("image/webp", .72);
      if (data.indexOf("data:image/webp") !== 0) data = canvas.toDataURL("image/png");
      if (data.length > 64000) {
        var smaller = document.createElement("canvas"), shrink = 192 / Math.max(canvas.width, canvas.height);
        smaller.width = Math.max(1, Math.round(canvas.width * shrink));
        smaller.height = Math.max(1, Math.round(canvas.height * shrink));
        smaller.getContext("2d").drawImage(canvas, 0, 0, smaller.width, smaller.height);
        data = smaller.toDataURL("image/webp", .52);
      }
      if (data.length > 64000) throw new Error("A imagem continua muito pesada após a otimização. Use uma imagem menor ou mais simples.");
      var id = "asset-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
      var asset = { id: id, name: String(file.name || "Imagem").replace(/\.[^.]+$/, "").slice(0, 80), src: data, width: canvas.width, height: canvas.height };
      creativeBeginTransaction(); creativeAddRecord("assets", asset); creativeCommitTransaction();
      creativeSelectedAssetId = id; creativeObjectKind = "image"; setTool("object");
      creativeRenderAssetPalette(); creativeUpdateUi(); save();
    } catch (error) {
      appAlertMessage("msg008", error && error.message ? error.message : "Não foi possível importar a imagem.");
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };
  image.onerror = function() { URL.revokeObjectURL(objectUrl); appAlertMessage("msg008", "Não foi possível abrir esta imagem."); };
  image.src = objectUrl;
}
function creativeRenderAssetPalette() {
  if (!R) return;
  var host = R.querySelector("#mp-creator-custom-assets");
  if (!host) return;
  host.innerHTML = "";
  (state.assets || []).forEach(function(asset) {
    var button = document.createElement("button");
    button.type = "button"; button.className = "mp-creator-custom-asset";
    button.setAttribute("data-asset-id", asset.id); button.title = asset.name || "Imagem";
    var img = document.createElement("img"); img.src = asset.src; img.alt = "";
    var label = document.createElement("small"); label.textContent = asset.name || "Imagem";
    button.appendChild(img); button.appendChild(label);
    button.classList.toggle("active", creativeSelectedAssetId === asset.id);
    host.appendChild(button);
  });
}
function creativeDrawPreview() {
  if (!R || appMode !== "editor" || isHexMap()) return;
  if (drag && drag.creativeRoom) {
    var a = drag.startCell, b = drag.currentCell || a;
    var x = Math.min(a.x, b.x), y = Math.min(a.y, b.y), w = Math.abs(a.x - b.x) + 1, h = Math.abs(a.y - b.y) + 1;
    cx.fillStyle = "rgba(88,174,220,.18)"; cx.strokeStyle = "rgba(130,215,255,.95)"; cx.lineWidth = 2 / zoom;
    cx.fillRect(x * CELL, y * CELL, w * CELL, h * CELL); cx.strokeRect(x * CELL, y * CELL, w * CELL, h * CELL);
  } else if (previewPointer && ["ground", "corridor", "eraseGround"].indexOf(tool) >= 0) {
    var cell = worldToCell(previewPointer.x, previewPointer.y), size = creativeBrushSize, radius = Math.floor((size - 1) / 2);
    cx.fillStyle = tool === "eraseGround" ? "rgba(255,90,90,.16)" : "rgba(100,190,235,.18)";
    cx.strokeStyle = "rgba(210,235,255,.9)"; cx.lineWidth = 1.5 / zoom;
    cx.fillRect((cell.x - radius) * CELL, (cell.y - radius) * CELL, size * CELL, size * CELL);
    cx.strokeRect((cell.x - radius) * CELL, (cell.y - radius) * CELL, size * CELL, size * CELL);
  }
}
function creativePaintBrush(cell, material) {
  if (!cell || cell.x < 0 || cell.y < 0 || cell.x >= COLS || cell.y >= ROWS) return;
  var side = creativeBrushSize, radius = Math.floor((side - 1) / 2);
  for (var dy = -radius; dy <= radius; dy++) for (var dx = -radius; dx <= radius; dx++) {
    var x = cell.x + dx, y = cell.y + dy;
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
    creativeSetTerrain(idx(x, y), material);
  }
}
function creativeFloodFill(cell, material) {
  if (!cell || cell.x < 0 || cell.y < 0 || cell.x >= COLS || cell.y >= ROWS) return false;
  var total = COLS * ROWS, bytes = creativeTerrainToBytes(), target = bytes[idx(cell.x, cell.y)], nextId = CREATIVE_MATERIALS[material] ? CREATIVE_MATERIALS[material].id : 0;
  if (target === nextId) return false;
  var visited = new Uint8Array(total), queue = new Int32Array(total), head = 0, tail = 0, changedCount = 0;
  queue[tail++] = idx(cell.x, cell.y); visited[queue[0]] = 1;
  while (head < tail) {
    var current = queue[head++];
    if (bytes[current] !== target) continue;
    bytes[current] = nextId; changedCount++;
    var x = current % COLS, y = Math.floor(current / COLS);
    var neighbors = [x > 0 ? current - 1 : -1, x + 1 < COLS ? current + 1 : -1, y > 0 ? current - COLS : -1, y + 1 < ROWS ? current + COLS : -1];
    for (var n = 0; n < 4; n++) {
      var at = neighbors[n];
      if (at >= 0 && !visited[at] && bytes[at] === target) { visited[at] = 1; queue[tail++] = at; }
    }
  }
  if (!changedCount) return false;
  // O preenchimento foi aplicado em bytes separados; só então troca o estado.
  creativeStoreTerrainBytes(bytes, bytes.reduce(function(sum, v) { return sum + (v ? 1 : 0); }, 0));
  state.terrain = {};
  return true;
}
function creativeApplyRoom(start, end) {
  if (!start || !end) return;
  var x0 = Math.max(0, Math.min(start.x, end.x)), x1 = Math.min(COLS - 1, Math.max(start.x, end.x));
  var y0 = Math.max(0, Math.min(start.y, end.y)), y1 = Math.min(ROWS - 1, Math.max(start.y, end.y));
  if (x1 < x0 || y1 < y0 || (x1 - x0 + 1) * (y1 - y0 + 1) < 4) return;
  for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) creativeSetTerrain(idx(x, y), creativeMaterial);
  function setRoomEdge(dir, x, yEdge) {
    var array = dir === "h" ? state.hEdges : state.vEdges;
    var index = dir === "h" ? hIdx(x, yEdge) : vIdx(x, yEdge);
    if (!array) return;
    var key = "edge:" + dir + ":" + index, before = array[index] || 0;
    if (before !== EDGE_NONE) return;
    creativeRecordCreativeChange(key, { kind: "edge", dir: dir, index: index, before: before, after: EDGE_MURO });
    array[index] = EDGE_MURO;
  }
  for (var xx = x0; xx <= x1; xx++) { setRoomEdge("h", xx, y0); setRoomEdge("h", xx, y1 + 1); }
  for (var yy = y0; yy <= y1; yy++) { setRoomEdge("v", x0, yy); setRoomEdge("v", x1 + 1, yy); }
}
function creativeAddRecord(collection, item) {
  if (!Array.isArray(state[collection])) state[collection] = [];
  state[collection].push(item);
  creativeRecordArrayChange(collection, item, null, item);
}
function creativeFindRecord(collection, id) {
  return (state[collection] || []).find(function(item) { return item && item.id === id; }) || null;
}
function creativeHitTest(worldX, worldY) {
  var best = null, bestDist = CELL * .55;
  ["decorations", "labels", "lights"].forEach(function(collection) {
    (state[collection] || []).forEach(function(item) {
      var p = cellCenter(item.x, item.y), d = Math.sqrt(Math.pow(worldX - p.x, 2) + Math.pow(worldY - p.y, 2));
      var limit = collection === "lights" ? CELL * .35 : bestDist;
      if (d <= limit && d < bestDist) { best = { collection: collection, item: item }; bestDist = d; }
    });
  });
  if (!best) return null;
  return { type: best.collection === "decorations" ? "decoration" : best.collection === "labels" ? "label" : "light", id: best.item.id, item: best.item };
}
function creativeDeleteSelected() {
  if (!creativeSelected) return false;
  var collection = creativeSelected.type === "decoration" ? "decorations" : creativeSelected.type === "label" ? "labels" : "lights";
  var item = creativeFindRecord(collection, creativeSelected.id);
  if (!item) { creativeSelected = null; return false; }
  creativeBeginTransaction();
  creativeRecordArrayChange(collection, item, item, null);
  state[collection] = state[collection].filter(function(entry) { return entry.id !== item.id; });
  creativeCommitTransaction();
  creativeSelected = null;
  save(); draw(); creativeRenderInspector();
  return true;
}
function creativeRotateSelected() {
  if (!creativeSelected || creativeSelected.type !== "decoration") return;
  var item = creativeFindRecord("decorations", creativeSelected.id);
  if (!item) return;
  creativeBeginTransaction();
  var before = creativeClone(item);
  item.rotation = ((Number(item.rotation) || 0) + 45) % 360;
  creativeRecordArrayChange("decorations", item, before, item);
  creativeCommitTransaction(); save(); draw(); creativeRenderInspector();
}
function creativeResizeSelected(delta) {
  if (!creativeSelected) return;
  var collection = creativeSelected.type === "decoration" ? "decorations" : creativeSelected.type === "label" ? "labels" : "lights";
  var item = creativeFindRecord(collection, creativeSelected.id);
  if (!item) return;
  var before = creativeClone(item);
  if (creativeSelected.type === "decoration") item.size = Math.max(.28, Math.min(1.8, (Number(item.size) || .84) + delta));
  else if (creativeSelected.type === "label") item.size = Math.max(10, Math.min(40, (Number(item.size) || 17) + delta * 2));
  else item.radius = Math.max(1, Math.min(16, (Number(item.radius) || 5) + delta));
  creativeBeginTransaction();
  creativeRecordArrayChange(collection, item, before, item);
  creativeCommitTransaction(); save(); draw(); creativeRenderInspector();
}
function creativeEditSelectedLabel() {
  if (!creativeSelected || creativeSelected.type !== "label") return;
  var label = creativeFindRecord("labels", creativeSelected.id);
  if (!label) return;
  var next = appPromptMessage("msg009", "Editar texto do mapa:", label.text || "");
  if (next == null) return;
  creativeBeginTransaction();
  var before = creativeClone(label);
  label.text = String(next).trim().slice(0, 160);
  creativeRecordArrayChange("labels", label, before, label);
  creativeCommitTransaction(); save(); draw(); creativeRenderInspector();
}
function creativeRenderInspector() {
  if (!R) return;
  var box = R.querySelector("#mp-creator-inspector");
  if (!box) return;
  if (!creativeSelected) { box.innerHTML = '<span class="mp-creator-muted">Selecione um objeto no mapa para editar, mover, girar ou excluir.</span>'; return; }
  var collection = creativeSelected.type === "decoration" ? "decorations" : creativeSelected.type === "label" ? "labels" : "lights";
  var item = creativeFindRecord(collection, creativeSelected.id);
  if (!item) { box.innerHTML = '<span class="mp-creator-muted">Nenhum objeto selecionado.</span>'; return; }
  var assetInfo = item.kind === "image" ? creativeFindRecord("assets", item.assetId) : null;
  var title = creativeSelected.type === "decoration" ? assetInfo && assetInfo.name || (CREATIVE_OBJECTS[item.kind] || {}).label || "Objeto" : creativeSelected.type === "label" ? "Texto" : "Fonte de luz";
  var editActions = creativeSelected.type === "decoration" ? '<button type="button" data-creator-action="smaller">− Tamanho</button><button type="button" data-creator-action="larger">＋ Tamanho</button><button type="button" data-creator-action="rotate">↻ Girar</button>' : creativeSelected.type === "label" ? '<button type="button" data-creator-action="smaller">− Texto</button><button type="button" data-creator-action="larger">＋ Texto</button><button type="button" data-creator-action="edit-label">✎ Editar texto</button>' : '<span>Raio: ' + (item.radius || creativeLightRadius) + ' células</span><button type="button" data-creator-action="smaller">− Raio</button><button type="button" data-creator-action="larger">＋ Raio</button>';
  box.innerHTML = '<div class="mp-creator-selection"><strong>' + esc(title) + '</strong><span>Coluna ' + (item.x + 1) + ' · Linha ' + (item.y + 1) + '</span><div class="mp-creator-selection-actions">' + editActions + '<button type="button" class="danger" data-creator-action="delete">Excluir</button></div></div>';
}
function creativeToolButton(toolName, label, icon, hint) {
  return '<button type="button" class="mp-creator-tool" data-creator-tool="' + toolName + '" title="' + (hint || label) + '"><span class="mp-creator-tool-icon">' + icon + '</span><span>' + label + '</span></button>';
}
function creativeInstallUi() {
  if (!R || R.querySelector(".mp-creator-ui")) return;
  creativeUiReady = true;
  var main = R.querySelector(".mp-main");
  if (!main) return;
  var shell = document.createElement("div");
  shell.className = "mp-creator-ui";
  shell.innerHTML = '<header class="mp-creator-topbar"><div class="mp-creator-brand"><span class="mp-creator-mark">✣</span><div><strong>Animalysson Studio</strong><small>EDITOR DE MAPAS</small></div></div><div class="mp-creator-map-host"></div><div class="mp-creator-top-actions"><button type="button" id="mp-new-map" title="Criar um mapa vazio com grade">＋ Novo mapa</button><button type="button" id="mp-creator-undo" title="Desfazer (Ctrl+Z)" disabled>↶</button><button type="button" id="mp-creator-redo" title="Refazer (Ctrl+Y)" disabled>↷</button><button type="button" id="mp-creator-save">⬇ Exportar</button></div></header><aside class="mp-creator-panel mp-editor-only"><div class="mp-creator-panel-head"><div><small>CONSTRUÇÃO</small><strong>Ferramentas</strong></div><span class="mp-creator-hotkey">B · R · E</span></div><div class="mp-creator-toolgrid">' +
    creativeToolButton("select", "Selecionar", "↖", "Selecionar e mover elementos") +
    creativeToolButton("pan", "Mover visão", "✥", "Arrastar o mapa") +
    creativeToolButton("room", "Sala", "▱", "Arraste para criar uma sala com paredes") +
    creativeToolButton("ground", "Pincel", "🖌", "Pintar o terreno selecionado") +
    creativeToolButton("corridor", "Corredor", "〰", "Pintar um corredor com pincel largo") +
    creativeToolButton("eraseGround", "Borracha", "⌫", "Apagar terreno") +
    creativeToolButton("wall", "Parede", "▥", "Bloquear células") +
    creativeToolButton("muro", "Muro", "━", "Desenhar muro entre dois pontos") +
    creativeToolButton("porta", "Porta", "▣", "Desenhar porta") +
    creativeToolButton("editStructure", "Editar muro", "⚙", "Editar propriedades da estrutura") +
    creativeToolButton("object", "Objetos", "♧", "Posicionar decoração") +
    creativeToolButton("text", "Texto", "T", "Adicionar texto e identificação") +
    creativeToolButton("light", "Luz ambiente", "☼", "Adicionar brilho decorativo sem alterar a visão dos tokens") +
    creativeToolButton("reveal", "Revelar névoa", "◉", "Revelar áreas") +
    creativeToolButton("hide", "Cobrir névoa", "◌", "Cobrir áreas") +
    creativeToolButton("measure", "Medir", "↔", "Medir distâncias") +
    '</div><section class="mp-creator-section"><div class="mp-creator-section-title">Piso e textura <span>SHIFT + clique: preencher área</span></div><div class="mp-creator-materials">' +
    Object.keys(CREATIVE_MATERIALS).map(function(key) { return '<button type="button" data-material="' + key + '" title="' + CREATIVE_MATERIALS[key].label + '"><i style="--material:' + CREATIVE_MATERIALS[key].color + '"></i><span>' + CREATIVE_MATERIALS[key].label + '</span></button>'; }).join("") +
    '</div><label class="mp-creator-range">Tamanho do pincel <output id="mp-creator-brush-value">1 × 1</output><input id="mp-creator-brush" type="range" min="1" max="9" step="2" value="1"></label></section><section class="mp-creator-section"><div class="mp-creator-section-title">Objetos de cenário</div><div class="mp-creator-objects">' +
    Object.keys(CREATIVE_OBJECTS).map(function(key) { return '<button type="button" data-object-kind="' + key + '" title="' + CREATIVE_OBJECTS[key].label + '"><span>' + CREATIVE_OBJECTS[key].glyph + '</span><small>' + CREATIVE_OBJECTS[key].label + '</small></button>'; }).join("") +
    '</div><button type="button" id="mp-creator-import-image" class="mp-creator-import-image">＋ Importar imagem / ícone</button><input type="file" id="mp-creator-image-input" accept="image/*" hidden><div id="mp-creator-custom-assets" class="mp-creator-custom-assets"></div></section><section class="mp-creator-section"><div class="mp-creator-section-title">Luz ambiente</div><p class="mp-creator-muted">Brilho visual decorativo; não altera o alcance de visão nem revela a névoa.</p><div class="mp-creator-light-controls"><label>Cor <input id="mp-creator-light-color" type="color" value="#ffd36a"></label><label>Raio <input id="mp-creator-light-radius" type="range" min="1" max="16" value="5"><output id="mp-creator-light-value">5</output></label></div></section><section class="mp-creator-section"><div class="mp-creator-section-title">Propriedades</div><div id="mp-creator-inspector"><span class="mp-creator-muted">Selecione um objeto no mapa para editar, mover, girar ou excluir.</span></div></section><footer class="mp-creator-footer"><span id="mp-creator-map-stats"></span><button type="button" id="mp-creator-more">⚙ Ferramentas avançadas</button></footer></aside>';
  main.insertBefore(shell, main.firstChild);
  var oldMapHost = R.querySelector(".mp-creator-map-host"), mapSelector = R.querySelector(".mp-map-selector"), addMapBtn = R.querySelector("#mp-add-map");
  if (mapSelector) oldMapHost.appendChild(mapSelector);
  if (addMapBtn) shell.querySelector(".mp-creator-top-actions").insertBefore(addMapBtn, shell.querySelector("#mp-new-map"));
  // O seletor de modo integra a barra para não sobrepor os botões do editor.
  var modeSwitch = R.querySelector(".mp-mode-switch");
  if (modeSwitch) shell.querySelector(".mp-creator-topbar").appendChild(modeSwitch);
  // Exportação avançada e importação continuam disponíveis no menu original.
  var burger = R.querySelector("#mp-burger");
  if (burger) { burger.style.left = "auto"; burger.style.right = "14px"; burger.style.top = "66px"; }
  shell.querySelector("#mp-creator-save").onclick = function() {
    save();
    if (MAPINFO && MAPINFO.custom) exportMapPackage(); else exportMapFile();
  };
  shell.querySelector("#mp-new-map").onclick = creativeCreateBlankMap;
  shell.querySelector("#mp-creator-undo").onclick = creativeUndo;
  shell.querySelector("#mp-creator-redo").onclick = creativeRedo;
  shell.querySelector("#mp-creator-more").onclick = function() { setMenu(true); };
  shell.addEventListener("click", function(event) {
    var toolButton = event.target.closest("[data-creator-tool]");
    if (toolButton) {
      var chosenTool = toolButton.getAttribute("data-creator-tool");
      if (chosenTool === "corridor") { creativeBrushSize = 3; var range = shell.querySelector("#mp-creator-brush"); if (range) range.value = "3"; shell.querySelector("#mp-creator-brush-value").textContent = "3 × 3"; }
      setTool(chosenTool); creativeRenderInspector(); return;
    }
    var materialButton = event.target.closest("[data-material]");
    if (materialButton) { creativeMaterial = materialButton.getAttribute("data-material"); creativeUpdateUi(); return; }
    var objectButton = event.target.closest("[data-object-kind]");
    if (objectButton) { creativeObjectKind = objectButton.getAttribute("data-object-kind"); creativeSelectedAssetId = null; setTool("object"); creativeUpdateUi(); creativeRenderAssetPalette(); return; }
    var assetButton = event.target.closest("[data-asset-id]");
    if (assetButton) { creativeSelectedAssetId = assetButton.getAttribute("data-asset-id"); creativeObjectKind = "image"; setTool("object"); creativeUpdateUi(); creativeRenderAssetPalette(); return; }
    var actionButton = event.target.closest("[data-creator-action]");
    if (actionButton) {
      var action = actionButton.getAttribute("data-creator-action");
      if (action === "delete") creativeDeleteSelected();
      else if (action === "rotate") creativeRotateSelected();
      else if (action === "edit-label") creativeEditSelectedLabel();
      else if (action === "smaller") creativeResizeSelected(-1);
      else if (action === "larger") creativeResizeSelected(1);
    }
  });
  var importImageButton = shell.querySelector("#mp-creator-import-image"), imageInput = shell.querySelector("#mp-creator-image-input");
  importImageButton.onclick = function() { imageInput.click(); };
  imageInput.onchange = function() { if (this.files && this.files[0]) creativeImportImageFile(this.files[0]); this.value = ""; };
  var brush = shell.querySelector("#mp-creator-brush");
  brush.oninput = function() { creativeBrushSize = Number(this.value) || 1; shell.querySelector("#mp-creator-brush-value").textContent = creativeBrushSize + " × " + creativeBrushSize; draw(); };
  var lightColor = shell.querySelector("#mp-creator-light-color");
  lightColor.oninput = function() { creativeLightColor = this.value; };
  var lightRadius = shell.querySelector("#mp-creator-light-radius");
  lightRadius.oninput = function() { creativeLightRadius = Number(this.value) || 5; shell.querySelector("#mp-creator-light-value").textContent = creativeLightRadius; };
  creativeUiReady = true;
  creativeUpdateUi();
  creativeRenderAssetPalette();
  creativeUpdateHistoryButtons();
  creativeRenderInspector();
}
function creativeUpdateUi() {
  if (!R) return;
  var shell = R.querySelector(".mp-creator-ui");
  if (!shell) return;
  shell.querySelectorAll("[data-creator-tool]").forEach(function(button) { button.classList.toggle("active", button.getAttribute("data-creator-tool") === tool); });
  shell.querySelectorAll("[data-material]").forEach(function(button) { button.classList.toggle("active", button.getAttribute("data-material") === creativeMaterial); });
  shell.querySelectorAll("[data-object-kind]").forEach(function(button) { button.classList.toggle("active", button.getAttribute("data-object-kind") === creativeObjectKind); });
  shell.querySelectorAll("[data-asset-id]").forEach(function(button) { button.classList.toggle("active", button.getAttribute("data-asset-id") === creativeSelectedAssetId); });
  creativeRenderAssetPalette();
  var stats = shell.querySelector("#mp-creator-map-stats");
  if (stats && MAPINFO) stats.textContent = COLS + " × " + ROWS + " células · " + CELL + " px";
}
function creativeRenderInspectorOnMode() {
  if (!R) return;
  var root = R.querySelector("#mp-root"), shell = R.querySelector(".mp-creator-ui");
  if (shell) shell.classList.toggle("is-hex-disabled", isHexMap());
  if (root && isHexMap()) {
    var stats = R.querySelector("#mp-creator-map-stats");
    if (stats) stats.textContent = "Mapa-múndi · grade hexagonal";
  }
}
function updateCreativeToolUi() { creativeUpdateUi(); }
function updateCreativeModeUi() { creativeRenderInspectorOnMode(); }
function creativeCreateBlankMap() {
  if (isHexMap()) { appAlertMessage("msg009", "Crie mapas de batalha no modo de grade quadrada. O mapa-múndi hexagonal continua separado para viagens e portais."); return; }
  var name = appPromptMessage("msg006", "Nome do novo mapa:", "Nova masmorra");
  if (!name || !name.trim()) return;
  name = name.trim().slice(0, 64);
  var cols = Number(appPromptMessage("msg007", "Largura do mapa em células (16 a 200):", "48"));
  var rows = Number(appPromptMessage("msg007", "Altura do mapa em células (16 a 200):", "36"));
  var cell = Number(appPromptMessage("msg007", "Tamanho da célula em pixels (16 a 96):", "40"));
  if (!Number.isFinite(cols) || !Number.isFinite(rows) || !Number.isFinite(cell) || cols < 16 || cols > 200 || rows < 16 || rows > 200 || cell < 16 || cell > 96 || cols * rows > 40000) {
    appAlertMessage("msg008", "Dimensões inválidas. Use 16–200 células por lado, no máximo 40.000 células, e células entre 16 e 96 px.");
    return;
  }
  cols = Math.round(cols); rows = Math.round(rows); cell = Math.round(cell);
  var id = slugifyMapName(name), suffix = 2;
  while (MAPS[id]) { id = slugifyMapName(name) + "-" + suffix++; }
  var width = cols * cell, height = rows * cell;
  var config = {
    nome: name, icone: "🗺️", key: "animalysson-vtt-custom-" + id,
    custom: true, blank: true, backgroundColor: "#34312c", folder: "mapas/", stateFile: null,
    cell: cell, cols: cols, rows: rows, w: width, h: height,
    spawn: { x: Math.floor(cols / 2), y: Math.floor(rows / 2) }, fit: true, maxZoom: 4,
    parts: [{ src: "blank-background.png", x: 0, y: 0, w: width, h: height }]
  };
  if (!registerCustomMap(id, config)) { appAlertMessage("msg008", "Não foi possível criar o mapa."); return; }
  persistCustomMaps();
  var host = R;
  stopWorldTravel(false); save(); unmount(); applyMap(id); preferredMapId = id;
  try { localStorage.setItem(MAP_ID_KEY, id); } catch (e) {}
  state = defaultState();
  showGrid = true; showFog = true; dynLight = true; showWalls = true;
  creativeHistoryUndo = []; creativeHistoryRedo = []; creativeSelected = null;
  save(); mount(host);
}
function creativeMakeBlankImage(color, width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = 16; canvas.height = 16;
  var context = canvas.getContext("2d"); context.fillStyle = /^#[0-9a-f]{6}$/i.test(color || "") ? color : "#34312c";
  context.fillRect(0, 0, 16, 16);
  var blobPromise = new Promise(function(resolve, reject) {
    canvas.toBlob(function(blob) { if (blob) resolve(blob); else reject(new Error("Não foi possível gerar o fundo do mapa.")); }, "image/png");
  });
  return blobPromise;
}
function creativeMakeBlankDataUrl(color) {
  var canvas = document.createElement("canvas"); canvas.width = canvas.height = 16;
  var context = canvas.getContext("2d"); context.fillStyle = /^#[0-9a-f]{6}$/i.test(color || "") ? color : "#34312c"; context.fillRect(0, 0, 16, 16);
  return canvas.toDataURL("image/png");
}
function creativePrepareBackgrounds() {
  if (!MAPINFO || !MAPINFO.blank) return;
  var source = creativeMakeBlankDataUrl(MAPINFO.backgroundColor);
  (MAPINFO.parts || []).forEach(function(part) { if (!part.localSrc) part.localSrc = source; });
}
function creativeHandlePointerDown(event, world, cell) {
  if (appMode !== "editor" || isHexMap()) return false;
  if (["ground", "corridor", "eraseGround"].indexOf(tool) >= 0) {
    creativeBeginTerrainTransaction();
    if (event.shiftKey && tool === "ground") {
      creativeFloodFill(cell, creativeMaterial);
      creativeCommitTransaction(); save(); draw(); return true;
    }
    drag = { creativeTerrain: true, material: tool === "eraseGround" ? null : creativeMaterial, lastX: -9999, lastY: -9999 };
    creativePaintBrush(cell, drag.material); drag.lastX = cell.x; drag.lastY = cell.y; draw(); return true;
  }
  if (tool === "room") {
    creativeBeginTerrainTransaction();
    drag = { creativeRoom: true, startCell: cell, currentCell: cell };
    draw(); return true;
  }
  if (tool === "object") {
    creativeBeginTransaction();
    var def = CREATIVE_OBJECTS[creativeObjectKind] || CREATIVE_OBJECTS.tree;
    if (creativeObjectKind === "image" && !creativeFindRecord("assets", creativeSelectedAssetId)) { appAlertMessage("msg008", "Importe ou selecione uma imagem antes de posicioná-la."); return true; }
    var item = { id: "dec-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6), kind: creativeObjectKind, assetId: creativeObjectKind === "image" ? creativeSelectedAssetId : null, glyph: def.glyph, x: cell.x, y: cell.y, size: creativeObjectKind === "image" ? 1.35 : .84, rotation: 0 };
    creativeAddRecord("decorations", item); creativeCommitTransaction(); creativeSelected = { type: "decoration", id: item.id }; save(); draw(); creativeRenderInspector(); return true;
  }
  if (tool === "text") {
    var text = appPromptMessage("msg009", "Texto ou identificação para o mapa:", "Entrada");
    if (text == null || !String(text).trim()) return true;
    creativeBeginTransaction();
    var label = { id: "label-" + Date.now().toString(36), text: String(text).trim().slice(0, 160), x: cell.x, y: cell.y, color: "#ffffff", size: 17, bubble: true };
    creativeAddRecord("labels", label); creativeCommitTransaction(); creativeSelected = { type: "label", id: label.id }; save(); draw(); creativeRenderInspector(); return true;
  }
  if (tool === "light") {
    creativeBeginTransaction();
    var light = { id: "light-" + Date.now().toString(36), x: cell.x, y: cell.y, color: creativeLightColor, radius: creativeLightRadius, intensity: .42 };
    creativeAddRecord("lights", light); creativeCommitTransaction(); creativeSelected = { type: "light", id: light.id }; save(); draw(); creativeRenderInspector(); return true;
  }
  if (tool === "select") {
    var hit = creativeHitTest(world.x, world.y);
    if (hit) {
      creativeSelected = { type: hit.type, id: hit.id };
      creativeBeginTransaction();
      drag = { creativeMove: true, selected: creativeSelected, before: creativeClone(hit.item) };
      creativeRenderInspector(); draw(); return true;
    }
  }
  return false;
}
function creativeHandlePointerMove(event, world, cell) {
  if (!drag || appMode !== "editor" || isHexMap()) return false;
  if (drag.creativeTerrain) {
    if (cell.x !== drag.lastX || cell.y !== drag.lastY) {
      creativePaintBrush(cell, drag.material); drag.lastX = cell.x; drag.lastY = cell.y;
    }
    return true;
  }
  if (drag.creativeRoom) { drag.currentCell = cell; return true; }
  if (drag.creativeMove) {
    var collection = drag.selected.type === "decoration" ? "decorations" : drag.selected.type === "label" ? "labels" : "lights";
    var item = creativeFindRecord(collection, drag.selected.id);
    if (item && cell.x >= 0 && cell.y >= 0 && cell.x < COLS && cell.y < ROWS) { item.x = cell.x; item.y = cell.y; }
    return true;
  }
  return false;
}
function creativeFinishPointerAction() {
  if (!drag) return false;
  if (drag.creativeTerrain) {
    creativeCommitTransaction(); save(); drag = null; draw(); creativeUpdateHistoryButtons(); return true;
  }
  if (drag.creativeRoom) {
    creativeApplyRoom(drag.startCell, drag.currentCell || drag.startCell);
    creativeCommitTransaction(); save(); drag = null; draw(); creativeUpdateHistoryButtons(); return true;
  }
  if (drag.creativeMove) {
    var collection = drag.selected.type === "decoration" ? "decorations" : drag.selected.type === "label" ? "labels" : "lights";
    var item = creativeFindRecord(collection, drag.selected.id);
    if (item) creativeRecordArrayChange(collection, item, drag.before, item);
    creativeCommitTransaction(); save(); drag = null; draw(); creativeRenderInspector(); creativeUpdateHistoryButtons(); return true;
  }
  return false;
}
function creativeHandleDoubleClick(event) {
  if (appMode !== "editor" || isHexMap() || !cv) return;
  var rect = cv.getBoundingClientRect(), world = screenToWorld(event.clientX - rect.left, event.clientY - rect.top);
  var hit = creativeHitTest(world.x, world.y);
  if (hit && hit.type === "label") { creativeSelected = { type: hit.type, id: hit.id }; creativeEditSelectedLabel(); }
}
function creativeHandleKeyboard(event) {
  if (appMode !== "editor") return false;
  if (/INPUT|SELECT|TEXTAREA/.test(event.target && event.target.tagName || "")) return false;
  if ((event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === "z" || event.key.toLowerCase() === "y")) {
    event.preventDefault(); event.stopPropagation();
    if (event.key.toLowerCase() === "z" && !event.shiftKey) creativeUndo(); else creativeRedo();
    return true;
  }
  if ((event.key === "Delete" || event.key === "Backspace") && creativeSelected) {
    event.preventDefault(); creativeDeleteSelected(); return true;
  }
  if (event.key === "r" || event.key === "R") { if (creativeSelected && creativeSelected.type === "decoration") { creativeRotateSelected(); return true; } }
  var shortcuts = { b: "ground", B: "ground", e: "eraseGround", E: "eraseGround", r: "room", R: "room", t: "text", T: "text", o: "object", O: "object", l: "light", L: "light", v: "select", V: "select" };
  if (shortcuts[event.key]) { setTool(shortcuts[event.key]); return true; }
  return false;
}
