function isCurrentlyVisible(x, y, px, py, r) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
    if (isHexMap()) return true;
    if (!dynLight) return !state.fog[idx(x, y)];
    if (px < 0) return false;
    var dist;
    if (isHexMap()) dist = hexDistance({ x, y }, { x: px, y: py });
    else {
      var dx = x - px, dy = y - py;
      dist = Math.sqrt(dx * dx + dy * dy);
    }
    if (dist > r + 0.01) return false;
    return hasLOS(px, py, x, y);
  }

function isTokenVisible(t) {
    if (!t) return false;
    if (isHexMap() || t.tipo === "player") return true;
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
    return state.tokens.find(function(t) {
      return t.tipo === "player";
    }) || state.tokens[0] || null;
  }

function resizeHexGridSize(requestedWidth) {
    if (!isHexMap() || !MAPINFO || !MAPINFO.scale || !MAPINFO.scale.hexagons) return false;
    var newWidth = Math.round(Number(requestedWidth) * 100) / 100;
    if (!isFinite(newWidth) || newWidth < 4 || newWidth > 240) {
      appAlertMessage("msg010", "Informe uma largura de hexágono entre 4 e 240 pixels.");
      return false;
    }
    var oldMetrics = hexMetrics();
    if (Math.abs(newWidth - oldMetrics.width) < 1e-3) return true;
    var referenceFactor = Number(MAPINFO.scale.referencePixelsPerLogicalPixel) || 4;
    var pixelsPerMile = Number(MAPINFO.scale.pixelsPerMile) || 8;
    var newMiles = newWidth * referenceFactor / pixelsPerMile;
    if (!saveHexGridProfile(newWidth, newMiles)) {
      appAlertMessage("msg010", "O navegador não permitiu salvar o tamanho dos hexágonos. Verifique o armazenamento local do site.");
      return false;
    }
    function rememberWorldPoint(point) {
      if (!point || !isFinite(Number(point.x)) || !isFinite(Number(point.y))) return null;
      var x = Number(point.x), y = Number(point.y);
      return {
        x: oldMetrics.width / 2 + x * oldMetrics.width + (y & 1) * oldMetrics.width / 2,
        y: oldMetrics.height / 2 + y * oldMetrics.rowStep
      };
    }
    var tokenPoints = (state.tokens || []).map(function(token) {
      return { token, world: rememberWorldPoint(token) };
    });
    var oldSpawn = rememberWorldPoint(state.spawn || MAPINFO.spawn);
    var portalPoints = (state.portals || []).map(function(portal) {
      return { portal, world: rememberWorldPoint(portal), destination: !portal.destMapId ? rememberWorldPoint({ x: portal.destX, y: portal.destY }) : null };
    });
    MAPINFO.scale.hexagons.small = { miles: newMiles, referenceWidthPixels: newWidth * referenceFactor };
    hexSize = "small";
    applyMap(mapId);
    tokenPoints.forEach(function(entry) {
      if (!entry.world) return;
      var cell = worldToCell(entry.world.x, entry.world.y);
      entry.token.x = cell.x;
      entry.token.y = cell.y;
    });
    if (oldSpawn) state.spawn = worldToCell(oldSpawn.x, oldSpawn.y);
    if (state.spawn) MAPINFO.spawn = { x: state.spawn.x, y: state.spawn.y };
    portalPoints.forEach(function(entry) {
      if (entry.world) {
        var point = worldToCell(entry.world.x, entry.world.y);
        entry.portal.x = point.x;
        entry.portal.y = point.y;
      }
      if (entry.destination) {
        var destination = worldToCell(entry.destination.x, entry.destination.y);
        entry.portal.destX = destination.x;
        entry.portal.destY = destination.y;
      }
    });
    state.gridMode = FLANAESS_GRID_MODE;
    state.gridMetrics = hexGridSnapshot();
    save();
    if (cv) draw();
    return true;
  }

function resizeMapTileSize(requestedCell) {
    if (!MAPINFO || isHexMap()) {
      appAlertMessage("msg010", "O ajuste de Tile (px) está disponível nos mapas com grade quadrada. O mapa-múndi usa grade hexagonal.");
      return false;
    }
    var newCell = Math.round(Number(requestedCell));
    if (!isFinite(newCell) || newCell < 8 || newCell > 512) {
      appAlertMessage("msg010", "Informe um tamanho de tile entre 8 e 512 pixels.");
      return false;
    }
    var oldCell = Number(MAPINFO.cell) || CELL;
    if (newCell === oldCell) return true;
    var oldCols = COLS, oldRows = ROWS;
    var newCols = Math.ceil(MAP_W / newCell), newRows = Math.ceil(MAP_H / newCell);
    var newCount = newCols * newRows;
    if (!newCols || !newRows || !isFinite(newCount) || newCount > 5e5) {
      appAlertMessage("msg010", "Esse tamanho criaria " + newCount.toLocaleString("pt-BR") + " tiles. Escolha um tile maior para manter a grade abaixo de 500.000 células.");
      return false;
    }
    var oldFog = state.fog || [], oldWalls = state.walls || [], oldWallMeta = state.wallMeta || [];
    var oldHEdges = state.hEdges || [], oldVEdges = state.vEdges || [];
    var oldHEdgeMeta = state.hEdgeMeta || [], oldVEdgeMeta = state.vEdgeMeta || [];
    var oldSpawn = state.spawn || MAPINFO.spawn || { x: Math.floor(oldCols / 2), y: Math.floor(oldRows / 2) };
    function remapCellPoint(point) {
      var worldX = (Number(point.x) + 0.5) * oldCell;
      var worldY = (Number(point.y) + 0.5) * oldCell;
      return {
        x: Math.max(0, Math.min(newCols - 1, Math.floor(worldX / newCell))),
        y: Math.max(0, Math.min(newRows - 1, Math.floor(worldY / newCell)))
      };
    }
    var newFog = new Array(newCount);
    var newWalls = new Array(newCount);
    var newWallMeta = new Array(newCount);
    for (var ny = 0; ny < newRows; ny++) {
      var sampleY = Math.min(oldRows - 1, Math.max(0, Math.floor((ny + 0.5) * newCell / oldCell)));
      for (var nx = 0; nx < newCols; nx++) {
        var sampleX = Math.min(oldCols - 1, Math.max(0, Math.floor((nx + 0.5) * newCell / oldCell)));
        var oldIndex = sampleY * oldCols + sampleX;
        var newIndex = ny * newCols + nx;
        newFog[newIndex] = oldFog[oldIndex] == null ? 1 : oldFog[oldIndex];
        newWalls[newIndex] = oldWalls[oldIndex] ? 1 : 0;
        newWallMeta[newIndex] = oldWallMeta[oldIndex] || null;
      }
    }
    if (newCell > oldCell) {
      for (var oy0 = 0; oy0 < oldRows; oy0++) {
        var targetY = Math.max(0, Math.min(newRows - 1, Math.floor((oy0 + 0.5) * oldCell / newCell)));
        for (var ox0 = 0; ox0 < oldCols; ox0++) {
          var sourceIndex = oy0 * oldCols + ox0;
          var targetX = Math.max(0, Math.min(newCols - 1, Math.floor((ox0 + 0.5) * oldCell / newCell)));
          var targetIndex = targetY * newCols + targetX;
          if (oldWalls[sourceIndex]) {
            newWalls[targetIndex] = 1;
            if (!newWallMeta[targetIndex] && oldWallMeta[sourceIndex]) newWallMeta[targetIndex] = oldWallMeta[sourceIndex];
          }
          if (oldFog[sourceIndex] === 0) newFog[targetIndex] = 0;
        }
      }
    }
    var newHEdges = new Array(newCols * (newRows + 1));
    var newHEdgeMeta = new Array(newCols * (newRows + 1));
    var newVEdges = new Array((newCols + 1) * newRows);
    var newVEdgeMeta = new Array((newCols + 1) * newRows);
    for (var hi = 0; hi < newHEdges.length; hi++) {
      newHEdges[hi] = 0;
      newHEdgeMeta[hi] = null;
    }
    for (var vi = 0; vi < newVEdges.length; vi++) {
      newVEdges[vi] = 0;
      newVEdgeMeta[vi] = null;
    }
    for (var oldYEdge = 0; oldYEdge <= oldRows; oldYEdge++) {
      var newYEdge = Math.round(oldYEdge * oldCell / newCell);
      if (newYEdge < 0 || newYEdge > newRows) continue;
      for (var oldXEdge = 0; oldXEdge < oldCols; oldXEdge++) {
        var oldHIndex = oldYEdge * oldCols + oldXEdge;
        var hValue = oldHEdges[oldHIndex] || 0;
        if (!hValue) continue;
        var hStart = oldXEdge * oldCell;
        var hEnd = Math.min(MAP_W, (oldXEdge + 1) * oldCell);
        var hFirst = Math.max(0, Math.floor(hStart / newCell));
        var hLast = Math.min(newCols - 1, Math.ceil(hEnd / newCell) - 1);
        for (var hX = hFirst; hX <= hLast; hX++) {
          var hIndex = newYEdge * newCols + hX;
          if (!newHEdges[hIndex]) {
            newHEdges[hIndex] = hValue;
            newHEdgeMeta[hIndex] = oldHEdgeMeta[oldHIndex] || null;
          }
        }
      }
    }
    for (var oldY = 0; oldY < oldRows; oldY++) {
      for (var oldXEdge2 = 0; oldXEdge2 <= oldCols; oldXEdge2++) {
        var oldVIndex = oldY * (oldCols + 1) + oldXEdge2;
        var vValue = oldVEdges[oldVIndex] || 0;
        if (!vValue) continue;
        var newXEdge = Math.round(oldXEdge2 * oldCell / newCell);
        if (newXEdge < 0 || newXEdge > newCols) continue;
        var vStart = oldY * oldCell;
        var vEnd = Math.min(MAP_H, (oldY + 1) * oldCell);
        var vFirst = Math.max(0, Math.floor(vStart / newCell));
        var vLast = Math.min(newRows - 1, Math.ceil(vEnd / newCell) - 1);
        for (var vY = vFirst; vY <= vLast; vY++) {
          var vIndex = vY * (newCols + 1) + newXEdge;
          if (!newVEdges[vIndex]) {
            newVEdges[vIndex] = vValue;
            newVEdgeMeta[vIndex] = oldVEdgeMeta[oldVIndex] || null;
          }
        }
      }
    }
    if (!saveMapTileSize(mapId, newCell)) {
      appAlertMessage("msg010", "O navegador não permitiu salvar o tamanho do tile. Verifique o armazenamento local do site e tente novamente.");
      return false;
    }
    (state.tokens || []).forEach(function(token) {
      var next = remapCellPoint(token);
      token.x = next.x;
      token.y = next.y;
    });
    state.spawn = remapCellPoint(oldSpawn);
    (state.portals || []).forEach(function(portal) {
      var next = remapCellPoint(portal);
      portal.x = next.x;
      portal.y = next.y;
      if (!portal.destMapId && isFinite(Number(portal.destX)) && isFinite(Number(portal.destY))) {
        var destination = remapCellPoint({ x: portal.destX, y: portal.destY });
        portal.destX = destination.x;
        portal.destY = destination.y;
      }
    });
    MAPINFO.cell = newCell;
    MAPINFO.cols = newCols;
    MAPINFO.rows = newRows;
    MAPINFO.spawn = { x: state.spawn.x, y: state.spawn.y };
    state.fog = newFog;
    state.walls = newWalls;
    state.wallMeta = newWallMeta;
    state.hEdges = newHEdges;
    state.vEdges = newVEdges;
    state.hEdgeMeta = newHEdgeMeta;
    state.vEdgeMeta = newVEdgeMeta;
    applyMap(mapId);
    persistCustomMaps();
    save();
    if (cv) draw();
    return true;
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
    if (player) {
      player.x = point.x;
      player.y = point.y;
    }
    save();
  }

function findWorldPortalAt(x, y) {
    if (!isHexMap() || !Array.isArray(state.portals)) return null;
    return state.portals.find(function(portal) {
      return !!portal.destMapId && portal.x === x && portal.y === y;
    }) || null;
  }

function findLocalPortalAt(x, y) {
    if (!Array.isArray(state.portals)) return null;
    return state.portals.find(function(portal) {
      if (portal.destMapId || !isFinite(Number(portal.destX)) || !isFinite(Number(portal.destY))) return false;
      return portal.x === x && portal.y === y || portal.destX === x && portal.destY === y;
    }) || null;
  }

function localPortalDestination(portal, x, y) {
    if (!portal || portal.destMapId) return null;
    if (portal.x === x && portal.y === y) return { x: portal.destX, y: portal.destY };
    if (portal.destX === x && portal.destY === y) return { x: portal.x, y: portal.y };
    return null;
  }

function portalCellIsOccupied(x, y) {
    return !!findWorldPortalAt(x, y) || !!findLocalPortalAt(x, y);
  }

function teleportPlayerWithinMap(portal, player) {
    if (!portal || !player) return false;
    var destination = localPortalDestination(portal, player.x, player.y);
    if (!destination) return false;
    player.x = destination.x;
    player.y = destination.y;
    selected = player;
    if (!isHexMap()) {
      if (dynLight) revealAround(player.x, player.y, player.luz || lightRadius);
      checkPassiveSecretDetection(player);
    }
    save();
    draw();
    return true;
  }

function closePortalDialog(overlay) {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

function createPortalDialog(titleText, descriptionText) {
    var root = R && R.querySelector("#mp-root");
    if (!root) return null;
    var overlay = document.createElement("div");
    overlay.className = "mp-portal-dialog-overlay";
    var panel = document.createElement("div");
    panel.className = "mp-portal-dialog";
    var title = document.createElement("h3");
    title.textContent = titleText;
    var description = document.createElement("p");
    description.textContent = descriptionText;
    panel.appendChild(title);
    panel.appendChild(description);
    overlay.appendChild(panel);
    root.appendChild(overlay);
    return { overlay, panel };
  }

function showPortalColorPicker(initialColor, onApply, onCancel) {
    var dialog = createPortalDialog("Cor do teleporte", "Escolha a cor que vai marcar os dois pontos ligados.");
    if (!dialog) return;
    var colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = /^#[0-9a-f]{6}$/i.test(String(initialColor || "")) ? initialColor : "#36a9e1";
    colorInput.className = "mp-portal-color-input";
    colorInput.setAttribute("aria-label", "Escolher cor do hexágono do teleporte");
    dialog.panel.appendChild(colorInput);
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    var cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancelar";
    cancel.onclick = function() {
      closePortalDialog(dialog.overlay);
      if (typeof onCancel === "function") onCancel();
    };
    var apply = document.createElement("button");
    apply.type = "button";
    apply.className = "primary";
    apply.textContent = "Confirmar cor";
    apply.onclick = function() {
      var chosenColor = colorInput.value;
      closePortalDialog(dialog.overlay);
      if (typeof onApply === "function") onApply(chosenColor);
    };
    actions.appendChild(cancel);
    actions.appendChild(apply);
    dialog.panel.appendChild(actions);
    colorInput.click();
  }

function showExistingPortalActions(portal) {
    var destinationName = MAPS[portal.destMapId] && MAPS[portal.destMapId].nome || portal.destMapId;
    var dialog = createPortalDialog("Teleporte existente", "Destino: " + destinationName + ". Você pode mudar a cor deste hexágono ou remover o teleporte.");
    if (!dialog) return;
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions mp-portal-dialog-actions-stack";
    var recolor = document.createElement("button");
    recolor.type = "button";
    recolor.className = "primary";
    recolor.textContent = "🎨 Mudar cor";
    recolor.onclick = function() {
      closePortalDialog(dialog.overlay);
      showPortalColorPicker(portal.color || "#36a9e1", function(color) {
        portal.color = color;
        save();
        draw();
      });
    };
    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger";
    remove.textContent = "🗑 Remover teleporte";
    remove.onclick = function() {
      closePortalDialog(dialog.overlay);
      if (appConfirmMessage("msg067", "Remover o teleporte deste hexágono?")) {
        state.portals = state.portals.filter(function(item) {
          return item !== portal;
        });
        save();
        draw();
      }
    };
    var cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancelar";
    cancel.onclick = function() {
      closePortalDialog(dialog.overlay);
    };
    actions.appendChild(recolor);
    actions.appendChild(remove);
    actions.appendChild(cancel);
    dialog.panel.appendChild(actions);
  }
