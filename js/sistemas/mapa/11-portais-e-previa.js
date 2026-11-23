function showExistingLocalPortalActions(portal) {
    var dialog = createPortalDialog("Teleporte interno", "Este par liga os pontos A e B do mapa atual. Você pode mudar a cor ou remover os dois lados.");
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
    remove.textContent = "🗑 Remover os dois pontos";
    remove.onclick = function() {
      closePortalDialog(dialog.overlay);
      if (appConfirmMessage("msg068", "Remover este par de teleporte? Os pontos A e B serão apagados.")) {
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

function placeLocalPortal(cell) {
    if (!cell) return;
    if (!Array.isArray(state.portals)) state.portals = [];
    var existingLocal = findLocalPortalAt(cell.x, cell.y);
    if (existingLocal) {
      if (pendingLocalPortal) {
        appAlertMessage("msg069", "Este local já faz parte de outro teleporte. Escolha um ponto B diferente.");
        return;
      }
      showExistingLocalPortalActions(existingLocal);
      return;
    }
    var existingWorld = findWorldPortalAt(cell.x, cell.y);
    if (existingWorld) {
      if (pendingLocalPortal) {
        appAlertMessage("msg070", "Este local já possui um teleporte para outro mapa. Escolha outro ponto.");
        return;
      }
      showExistingPortalActions(existingWorld);
      return;
    }
    var placementPlayer = currentPlayer();
    if (blockMove && !canOccupy(cell.x, cell.y, placementPlayer)) {
      appAlertMessage("msg071", "Não é possível criar um teleporte em uma célula bloqueada. Escolha um espaço livre.");
      return;
    }
    if (!pendingLocalPortal) {
      pendingLocalPortal = { x: cell.x, y: cell.y };
      draw();
      appAlertMessage("msg072", "Ponto A definido. Agora clique no local do ponto B para concluir o teleporte. Pressione Esc para cancelar.");
      return;
    }
    if (pendingLocalPortal.x === cell.x && pendingLocalPortal.y === cell.y) {
      appAlertMessage("msg073", "Escolha um ponto B diferente do ponto A.");
      return;
    }
    if (portalCellIsOccupied(cell.x, cell.y)) {
      appAlertMessage("msg074", "Este local já possui um teleporte. Escolha outro ponto para B.");
      return;
    }
    var pointA = pendingLocalPortal;
    showPortalColorPicker("#36a9e1", function(color) {
      state.portals.push({
        id: "local-portal-" + Date.now().toString(36),
        type: "local",
        x: pointA.x,
        y: pointA.y,
        destX: cell.x,
        destY: cell.y,
        color
      });
      pendingLocalPortal = null;
      setTool("select");
      save();
      draw();
    }, function() {
      pendingLocalPortal = null;
      setTool("select");
      draw();
    });
  }

function placeWorldPortal(cell) {
    if (!isHexMap() || !cell) return;
    if (!Array.isArray(state.portals)) state.portals = [];
    var existingLocal = findLocalPortalAt(cell.x, cell.y);
    if (existingLocal) {
      showExistingLocalPortalActions(existingLocal);
      return;
    }
    var existing = findWorldPortalAt(cell.x, cell.y);
    if (existing) {
      showExistingPortalActions(existing);
      return;
    }
    var options = Object.keys(MAPS).filter(function(id) {
      return id !== mapId;
    });
    if (!options.length) {
      appAlertMessage("msg075", "Adicione outro mapa primeiro usando o botão + do seletor.");
      return;
    }
    var menu = options.map(function(id, index) {
      return index + 1 + ". " + MAPS[id].nome;
    }).join("\n");
    var answer = appPromptMessage("msg076", "Escolha o mapa de destino digitando o número:\n\n" + menu, "1");
    if (answer == null || !String(answer).trim()) return;
    var destination = options[Number(answer) - 1];
    if (!destination) {
      destination = options.find(function(id) {
        return id.toLowerCase() === String(answer).trim().toLowerCase() || MAPS[id].nome.toLowerCase() === String(answer).trim().toLowerCase();
      });
    }
    if (!destination) {
      appAlertMessage("msg077", "Destino inválido. Nenhum teleporte foi criado.");
      return;
    }
    showPortalColorPicker("#36a9e1", function(color) {
      state.portals.push({
        id: "portal-" + Date.now().toString(36),
        x: cell.x,
        y: cell.y,
        destMapId: destination,
        color
      });
      save();
      draw();
    });
  }

function teleportThroughWorldPortal(portal) {
    if (!portal || !MAPS[portal.destMapId]) {
      appAlertMessage("msg078", "O mapa de destino deste teleporte não está disponível. Atualize o catálogo mapas/mapas.json.");
      draw();
      return;
    }
    var destinationId = portal.destMapId;
    var host = R;
    save();
    stopWorldTravel(false);
    tool = "select";
    preferredMapId = destinationId;
    try {
      localStorage.setItem(MAP_ID_KEY, destinationId);
    } catch (e) {
    }
    unmount();
    applyMap(destinationId);
    state = loadCurrentMapState();
    loadRepositoryMapState(function() {
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
        player = { id: "p1", nome: "Aventureiro", tipo: "player", x: spawn.x, y: spawn.y, cor: "#4fc3f7", raio: 1, luz: 6, hp: null, hpMax: null };
        state.tokens.unshift(player);
      } else {
        player.x = spawn.x;
        player.y = spawn.y;
        if (!player.tipo) player.tipo = "player";
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
    return isDoorEdge(value) ? edge : null;
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
    if (edge.dir === "h") {
      var x0 = first.x * CELL, y0 = first.yEdge * CELL;
      var x1 = (last.x + 1) * CELL;
      cx.beginPath();
      cx.moveTo(x0, y0);
      cx.lineTo(x1, y0);
      cx.stroke();
      if (door) {
        cx.setLineDash([]);
        cx.beginPath();
        cx.arc((x0 + x1) / 2, y0, 5 / zoom, 0, Math.PI * 2);
        cx.fill();
      }
    } else {
      var xx = first.xEdge * CELL, yy0 = first.y * CELL;
      var yy1 = (last.y + 1) * CELL;
      cx.beginPath();
      cx.moveTo(xx, yy0);
      cx.lineTo(xx, yy1);
      cx.stroke();
      if (door) {
        cx.setLineDash([]);
        cx.beginPath();
        cx.arc(xx, (yy0 + yy1) / 2, 5 / zoom, 0, Math.PI * 2);
        cx.fill();
      }
    }
    cx.restore();
  }
