function onPointerDown(e) {
    if (appMode === "editor" && (tool === "pan" || e.button === 1 || e.button === 2 || space)) {
      e.preventDefault();
      if (cv.setPointerCapture) cv.setPointerCapture(e.pointerId);
      drag = { pan: true, startX: e.clientX, startY: e.clientY, originX: ox, originY: oy };
      cv.style.cursor = "grabbing";
      return;
    }
    if (appMode !== "editor") tool = "select";
    if (isHexMap()) {
      e.preventDefault();
      var worldRect = cv.getBoundingClientRect();
      var worldPoint = screenToWorld(e.clientX - worldRect.left, e.clientY - worldRect.top);
      if (worldPoint.x < 0 || worldPoint.y < 0 || worldPoint.x > MAP_W || worldPoint.y > MAP_H) return;
      var worldCell = worldToCell(worldPoint.x, worldPoint.y);
      if (tool === "portal") {
        placeWorldPortal(worldCell);
        return;
      }
      if (tool === "localPortal") {
        placeLocalPortal(worldCell);
        return;
      }
      if (tool === "spawn") {
        stopWorldTravel(false);
        var worldPlayer = currentPlayer();
        if (!worldPlayer) {
          worldPlayer = { id: "p1", nome: "Aventureiro", tipo: "player", x: worldCell.x, y: worldCell.y, cor: "#4fc3f7", raio: 1, luz: 6, percepcaoPassiva: 10, hp: null, hpMax: null };
          state.tokens.unshift(worldPlayer);
        }
        setMapSpawn(worldCell, worldPlayer);
        selected = worldPlayer;
        draw();
        return;
      }
      if (tool === "select") runOrDeferMove(e, function() {
        startWorldTravel(worldCell);
      });
      return;
    }
    cv.setPointerCapture(e.pointerId);
    var previewRect = cv.getBoundingClientRect();
    previewPointer = screenToWorld(e.clientX - previewRect.left, e.clientY - previewRect.top);
    var rect = cv.getBoundingClientRect();
    var world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    var cell = worldToCell(world.x, world.y);
    if (tool === "localPortal") {
      placeLocalPortal(cell);
      return;
    }
    if (tool === "editStructure") {
      var structureEdge = customEdgeAt(world.x, world.y, Math.max(8 / zoom, CELL * 0.18));
      if (!structureEdge) {
        var nearGrid = Math.min(Math.abs(world.x / CELL - Math.round(world.x / CELL)), Math.abs(world.y / CELL - Math.round(world.y / CELL))) * CELL;
        if (nearGrid <= Math.max(8 / zoom, CELL * 0.18)) structureEdge = nearestEdge(world.x, world.y);
      }
      if (structureEdge && getEdgeVal(structureEdge) !== EDGE_NONE) openStructureEditor(structureEdge);
      else if (!isHexMap() && cell.x >= 0 && cell.y >= 0 && cell.x < COLS && cell.y < ROWS && state.walls[idx(cell.x, cell.y)]) openCellWallEditor(cell);
      else appAlertMessage("msg064", "Não há parede, muro ou porta neste ponto.");
      return;
    }
    if (tool === "eraseedge") {
      var edgeToErase = findEraseEdgeAt(world.x, world.y);
      if (edgeToErase) {
        setEdgeVal(edgeToErase, EDGE_NONE);
        save();
        draw();
      }
      return;
    }
    if (!isHexMap() && tool === "select" && !pendingMonster && currentPlayer() && (world.x < 0 || world.y < 0 || world.x >= MAP_W || world.y >= MAP_H)) {
      runOrDeferMove(e, function() {
        startClickExit(world);
      });
      return;
    }
    if (!isHexMap() && ["muro", "porta", "paredeSecreta", "portaSecreta", "portaTrancada", "portaEmperrada", "paredeIlusoria", "muralhaForca", "paredeMagica"].indexOf(tool) >= 0) {
      var point = snapGridPoint(world.x, world.y);
      if (!pendingStructureStart) {
        pendingStructureStart = point;
        draw();
        return;
      }
      var firstPoint = pendingStructureStart;
      pendingStructureStart = null;
      createCustomStructure(firstPoint, point, tool);
      return;
    }
    if (!isHexMap() && tool === "searchSecret") {
      performActiveSecretSearch(cell);
      setTool("select");
      return;
    }
    if (!isHexMap() && tool === "investigateMechanism") {
      investigateEdgeMechanism(customEdgeAt(world.x, world.y) || nearestEdge(world.x, world.y));
      setTool("select");
      return;
    }
    if (!isHexMap() && tool === "damageStructure") {
      var damageEdge = customEdgeAt(world.x, world.y) || nearestEdge(world.x, world.y);
      var gxDamage = world.x / CELL, gyDamage = world.y / CELL;
      var nearDamageLine = Math.min(Math.abs(gxDamage - Math.round(gxDamage)), Math.abs(gyDamage - Math.round(gyDamage))) < 0.12;
      if ((damageEdge && damageEdge.custom || nearDamageLine) && getEdgeVal(damageEdge) !== EDGE_NONE) damageEdgeStructure(damageEdge);
      else damageCellWall(cell);
      setTool("select");
      return;
    }
    if (tool === "wall") {
      drag = { wall: true, val: 1 };
      applyWallBrush(cell.x, cell.y, 1, 0);
      draw();
      return;
    }
    if (tool === "erasewall") {
      drag = { wall: true, val: 0 };
      applyWallBrush(cell.x, cell.y, 0, 0);
      draw();
      return;
    }
    if (tool === "spawn") {
      var player = state.tokens.find(function(t2) {
        return t2.tipo === "player";
      });
      if (!player) {
        player = { id: "p1", nome: "Aventureiro", tipo: "player", x: cell.x, y: cell.y, cor: "#4fc3f7", raio: 1, luz: lightRadius, percepcaoPassiva: 10, hp: null, hpMax: null };
        state.tokens.unshift(player);
      } else {
        if (blockMove && isCellWall(cell.x, cell.y)) {
          appAlertMessage("msg081", "Não é possível iniciar em cima de uma parede.");
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
    if (pendingMonster && (tool === "token" || tool === "select")) {
      placeMonsterFromId(pendingMonster.id, cell);
      return;
    }
    if (tool === "select") {
      var edge2 = isHexMap() ? null : customEdgeAt(world.x, world.y) || nearestEdge(world.x, world.y);
      var ev = edge2 ? getEdgeVal(edge2) : EDGE_NONE;
      if (edge2 && edge2.custom) {
        interactWithEdge(edge2);
        return;
      }
      var gx = world.x / CELL, gy = world.y / CELL;
      var fx = Math.abs(gx - Math.round(gx)), fy = Math.abs(gy - Math.round(gy));
      var nearLine = !isHexMap() && Math.min(fx, fy) < 0.12;
      if (nearLine && (ev === EDGE_DOOR_C || ev === EDGE_DOOR_O)) {
        setDoorRunValue(edge2, doorRunIsClosed(edge2) ? EDGE_DOOR_O : EDGE_DOOR_C);
        save();
        draw();
        return;
      }
      if (nearLine && isDoorEdge(ev)) {
        interactWithEdge(edge2);
        return;
      }
      if (nearLine && (ev === EDGE_SECRET_WALL || ev === EDGE_ILLUSION_WALL || ev === EDGE_FORCE_WALL || ev === EDGE_MAGIC_WALL || ev === EDGE_MURO)) {
        interactWithEdge(edge2);
        return;
      }
      var hit = null;
      for (var i = state.tokens.length - 1; i >= 0; i--) {
        var t = state.tokens[i];
        if (!isTokenVisible(t)) continue;
        var sq = t.raio || 1;
        if (cell.x >= t.x && cell.x < t.x + sq && cell.y >= t.y && cell.y < t.y + sq) {
          hit = t;
          break;
        }
      }
      selected = hit;
      if (hit) {
        if (appMode === "editor" && hit.tipo !== "player") {
          drag = { moveToken: hit, fromX: hit.x, fromY: hit.y };
        }
        if (hit.tipo === "player" && hit.x === cell.x && hit.y === cell.y) {
          var standingLocalPortalClick = findLocalPortalAt(hit.x, hit.y);
          if (standingLocalPortalClick) runOrDeferMove(e, function() {
            teleportPlayerWithinMap(standingLocalPortalClick, hit);
          });
        }
      } else {
        var movingPlayer = currentPlayer();
        if (movingPlayer && isCurrentlyVisible(cell.x, cell.y, movingPlayer.x, movingPlayer.y, movingPlayer.luz || lightRadius)) {
          runOrDeferMove(e, function() {
            startClickMove(cell);
          });
        }
      }
      draw();
      return;
    }
    if (tool === "reveal" || tool === "hide") {
      drag = { brush: true, mode: tool };
      applyFogBrush(cell.x, cell.y, tool === "reveal" ? 0 : 1);
      draw();
      return;
    }
    if (tool === "token" && !pendingMonster) {
      var nome = appPromptMessage("msg082", "Nome do token:", "Criatura");
      if (!nome) return;
      if (blockMove && isCellWall(cell.x, cell.y)) return;
      var tok = {
        id: "t" + Date.now().toString(36),
        nome,
        tipo: "npc",
        x: cell.x,
        y: cell.y,
        cor: "#e57373",
        raio: 1,
        luz: 0,
        hp: null,
        hpMax: null
      };
      state.tokens.push(tok);
      selected = tok;
      save();
      draw();
      return;
    }
    if (tool === "measure") {
      if (!measurePts) measurePts = [cell];
      else if (measurePts.length === 1) {
        measurePts.push(cell);
        draw();
      } else {
        measurePts = [cell];
        draw();
      }
    }
  }
function onPointerMove(e) {
    if (drag && drag.pan) {
      ox = drag.originX + (e.clientX - drag.startX);
      oy = drag.originY + (e.clientY - drag.startY);
      draw();
      return;
    }
    if (isHexMap()) return;
    var previewRect = cv.getBoundingClientRect();
    previewPointer = screenToWorld(e.clientX - previewRect.left, e.clientY - previewRect.top);
    if (!drag) {
      draw();
      return;
    }
    if (drag.pan) {
      return;
    }
    if (drag.edgePaint && !isHexMap()) {
      var rectE = cv.getBoundingClientRect();
      var worldE = screenToWorld(e.clientX - rectE.left, e.clientY - rectE.top);
      var edge = nearestEdge(worldE.x, worldE.y);
      if (drag.mode === "muro") setEdgeVal(edge, EDGE_MURO);
      else if (drag.mode === "porta") {
        var c = getEdgeVal(edge);
        if (c === EDGE_NONE) setEdgeVal(edge, EDGE_DOOR_C);
      } else {
        var eraseVal = getEdgeVal(edge);
        if (eraseVal === EDGE_DOOR_C || eraseVal === EDGE_DOOR_O) setDoorRunValue(edge, EDGE_NONE);
        else setEdgeVal(edge, EDGE_NONE);
      }
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
      if (canStep(t.x, t.y, cell2.x, cell2.y, t, true)) {
        t.x = cell2.x;
        t.y = cell2.y;
        if (t.tipo === "player") checkPassiveSecretDetection(t);
        if (t.tipo === "player" && dynLight) {
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
      applyFogBrush(cell3.x, cell3.y, drag.mode === "reveal" ? 0 : 1);
      draw();
    }
  }
function onPointerUp() {
    var teleported = false;
    if (drag && drag.moveToken && drag.moveToken.tipo === "player") {
      var localPortal = findLocalPortalAt(drag.moveToken.x, drag.moveToken.y);
      if (localPortal) teleported = teleportPlayerWithinMap(localPortal, drag.moveToken);
    }
    if (drag && (drag.moveToken || drag.brush || drag.wall || drag.edgePaint)) save();
    drag = null;
    if (cv) cv.style.cursor = tool === "pan" && appMode === "editor" ? "grab" : tool === "select" ? "pointer" : "crosshair";
    if (teleported) draw();
  }
function onPointerLeave() {
    if (!drag) {
      previewPointer = null;
      draw();
    }
  }
function onWheel(e) {
    e.preventDefault();
    if (!e.deltaY) return;
    if (appMode === "editor") {
      var rect = cv.getBoundingClientRect();
      changeCameraZoom(Math.exp(-e.deltaY * 15e-4), e.clientX - rect.left, e.clientY - rect.top);
      return;
    }
    if (isHexMap()) {
      zoom = FLANAESS_ZOOM;
      draw();
      return;
    }
    changeCameraZoom(Math.exp(-e.deltaY * 15e-4));
  }
