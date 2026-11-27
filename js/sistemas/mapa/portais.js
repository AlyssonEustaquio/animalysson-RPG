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
      if (dynLight) revealAround(player.x, player.y, typeof creativeGetVisibilityRadius === "function" ? creativeGetVisibilityRadius(player, player.x, player.y) : player.luz || lightRadius);
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
        player = { id: "p1", nome: "Aventureiro", tipo: "player", x: spawn.x, y: spawn.y, cor: "#4fc3f7", raio: 1, luz: 0, visao: 6, hp: null, hpMax: null };
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
