function findVisiblePath(start, goal, token, allowUnseenForExit) {
    if (!start || !goal || isHexMap()) return null;
    if (goal.x < 0 || goal.y < 0 || goal.x >= COLS || goal.y >= ROWS) return null;
    var radius = typeof creativeGetVisibilityRadius === "function" ? creativeGetVisibilityRadius(token, goal.x, goal.y) : token && token.luz || lightRadius;
    if (!allowUnseenForExit && !isCurrentlyVisible(goal.x, goal.y, start.x, start.y, radius)) return null;
    if (start.x === goal.x && start.y === goal.y) return [start];
    var dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
    ];
    function key(x, y) {
      return x + "," + y;
    }
    function heuristic(x, y) {
      var dx = Math.abs(goal.x - x), dy = Math.abs(goal.y - y);
      return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
    }
    var open = [], cameFrom = {}, gScore = {}, closed = {};
    var startKey = key(start.x, start.y), goalKey = key(goal.x, goal.y);
    gScore[startKey] = 0;
    heapPush(open, { x: start.x, y: start.y, g: 0, f: heuristic(start.x, start.y) });
    var visited = 0, maxVisited = Math.min(COLS * ROWS, 12e3);
    while (open.length && visited < maxVisited) {
      var current = heapPop(open);
      var currentKey = key(current.x, current.y);
      if (closed[currentKey]) continue;
      if (currentKey === goalKey) {
        var path = [{ x: goal.x, y: goal.y }];
        var cursor = goalKey;
        while (cursor !== startKey) {
          cursor = cameFrom[cursor];
          if (!cursor) return null;
          var parts = cursor.split(",");
          path.push({ x: Number(parts[0]), y: Number(parts[1]) });
        }
        path.reverse();
        return path;
      }
      closed[currentKey] = true;
      visited++;
      for (var i = 0; i < dirs.length; i++) {
        var nx = current.x + dirs[i][0], ny = current.y + dirs[i][1];
        var nextKey = key(nx, ny);
        if (closed[nextKey]) continue;
        if (!allowUnseenForExit && !isCurrentlyVisible(nx, ny, start.x, start.y, radius)) continue;
        if (!canStep(current.x, current.y, nx, ny, token)) continue;
        var tentative = current.g + (dirs[i][0] && dirs[i][1] ? Math.SQRT2 : 1);
        if (gScore[nextKey] != null && tentative >= gScore[nextKey]) continue;
        cameFrom[nextKey] = currentKey;
        gScore[nextKey] = tentative;
        heapPush(open, { x: nx, y: ny, g: tentative, f: tentative + heuristic(nx, ny) });
      }
    }
    return null;
  }
function startClickMove(destination, exitAfterArrival) {
    var player = currentPlayer();
    if (!player || isHexMap() || !destination) return false;
    if (typeof actionLocked === "function" && actionLocked()) return false;
    var path = findVisiblePath({ x: player.x, y: player.y }, destination, player, !!exitAfterArrival);
    if (!path) return false;
    camPan.x = camPan.y = 0;
    var andando = !!keyMoveStep && path.length >= 2;
    if (andando) {
      keysHeld = {};
      clickMovePath = [];
      portalClickTarget = null;
      clickMoveExitPending = false;
    } else stopKeyMove();
    if (path.length < 2) {
      if (exitAfterArrival) return returnToWorldMapFromExit();
      var standingLocalPortal = findLocalPortalAt(player.x, player.y);
      if (standingLocalPortal) return teleportPlayerWithinMap(standingLocalPortal, player);
      if (typeof creativeTryTraverseLayerTransition === "function" && creativeTryTraverseLayerTransition(player)) return true;
      return false;
    }
    clickMovePath = path.slice(1);
    portalClickTarget = exitAfterArrival ? null : { x: destination.x, y: destination.y };
    clickMoveExitPending = !!exitAfterArrival;
    if (keyMoveRaf == null) keyMoveRaf = window.requestAnimationFrame(keyMoveFrame);
    return true;
  }
function mapExitBorderCell(outsideWorldPoint, player) {
    var sq = Math.max(1, player && player.raio || 1);
    var maxX = Math.max(0, COLS - sq), maxY = Math.max(0, ROWS - sq);
    var sx = player.x, sy = player.y;
    var tx = outsideWorldPoint.x / CELL - 0.5 - (sq - 1) / 2;
    var ty = outsideWorldPoint.y / CELL - 0.5 - (sq - 1) / 2;
    var dx = tx - sx, dy = ty - sy;
    var hitT = Infinity, hitSide = "";
    var epsilon = 1e-9;
    if (dx < -epsilon) {
      var leftT = (0 - sx) / dx;
      if (leftT >= 0 && leftT < hitT) {
        hitT = leftT;
        hitSide = "left";
      }
    } else if (dx > epsilon) {
      var rightT = (maxX - sx) / dx;
      if (rightT >= 0 && rightT < hitT) {
        hitT = rightT;
        hitSide = "right";
      }
    }
    if (dy < -epsilon) {
      var topT = (0 - sy) / dy;
      if (topT >= 0 && topT < hitT) {
        hitT = topT;
        hitSide = "top";
      }
    } else if (dy > epsilon) {
      var bottomT = (maxY - sy) / dy;
      if (bottomT >= 0 && bottomT < hitT) {
        hitT = bottomT;
        hitSide = "bottom";
      }
    }
    if (!isFinite(hitT)) return null;
    var x = Math.max(0, Math.min(maxX, Math.round(sx + dx * hitT)));
    var y = Math.max(0, Math.min(maxY, Math.round(sy + dy * hitT)));
    if (hitSide === "left") x = 0;
    else if (hitSide === "right") x = maxX;
    else if (hitSide === "top") y = 0;
    else if (hitSide === "bottom") y = maxY;
    return { x, y };
  }
function startClickExit(outsideWorldPoint) {
    var player = currentPlayer();
    if (!player || !outsideWorldPoint || isHexMap()) return false;
    var borderCell = mapExitBorderCell(outsideWorldPoint, player);
    if (!borderCell) return false;
    return startClickMove(borderCell, true);
  }
function tokenAnchor(t, x, y) {
    var sq = t.raio || 1;
    return cellCenter(x + (sq - 1) / 2, y + (sq - 1) / 2);
  }
function heldDirection() {
    var dx = (keysHeld.ArrowRight ? 1 : 0) - (keysHeld.ArrowLeft ? 1 : 0);
    var dy = (keysHeld.ArrowDown ? 1 : 0) - (keysHeld.ArrowUp ? 1 : 0);
    return dx || dy ? { dx, dy } : null;
  }
function pickKeyStep(pl, dir) {
    var cands = [];
    if (dir.dx && dir.dy) cands.push({ x: pl.x + dir.dx, y: pl.y + dir.dy }, { x: pl.x + dir.dx, y: pl.y }, { x: pl.x, y: pl.y + dir.dy });
    else cands.push({ x: pl.x + dir.dx, y: pl.y + dir.dy });
    for (var i = 0; i < cands.length; i++) {
      if (canStep(pl.x, pl.y, cands[i].x, cands[i].y, pl, true)) return cands[i];
    }
    return null;
  }
function pickHexKeyStep(pl) {
    var next = null, odd = pl.y & 1;
    if (keysHeld.ArrowLeft) next = { x: pl.x - 1, y: pl.y };
    else if (keysHeld.ArrowRight) next = { x: pl.x + 1, y: pl.y };
    else if (keysHeld.ArrowUp) next = { x: pl.x + (odd ? 1 : 0), y: pl.y - 1 };
    else if (keysHeld.ArrowDown) next = { x: pl.x + (odd ? 0 : -1), y: pl.y + 1 };
    return next && canStep(pl.x, pl.y, next.x, next.y, pl) ? next : null;
  }
function keyMoveWouldExitMap(pl, dir) {
    if (!pl || !dir || isHexMap()) return false;
    var sq = pl.raio || 1;
    var nx = pl.x + dir.dx, ny = pl.y + dir.dy;
    return nx < 0 || ny < 0 || nx + sq > COLS || ny + sq > ROWS;
  }
function returnToWorldMapFromExit() {
    if (isHexMap() || !MAPS.flanaess) return false;
    var host = R;
    save();
    stopKeyMove();
    stopWorldTravel(false);
    selected = null;
    pendingMonster = null;
    measurePts = null;
    drag = null;
    tool = "select";
    preferredMapId = "flanaess";
    try {
      localStorage.setItem(MAP_ID_KEY, "flanaess");
    } catch (e) {
    }
    unmount();
    mount(host);
    return true;
  }
function followKeyMove() {
    if (!cv) return;
    if (isHexMap()) focusCameraOnPlayer();
    else centerCameraOnPlayer();
  }
function stopKeyMove() {
    if (keyMoveRaf != null) {
      window.cancelAnimationFrame(keyMoveRaf);
      keyMoveRaf = null;
    }
    keyMoveStep = null;
    keyMoveVis = null;
    keyMoveCarry = null;
    clickMovePath = [];
    portalClickTarget = null;
    keysHeld = {};
    clickMoveExitPending = false;
    worldTravelPos = null;
  }
function keyMoveFrame(now) {
    keyMoveRaf = null;
    var pl = currentPlayer();
    var hexMode = isHexMap();
    if (!pl || !cv) {
      stopKeyMove();
      return;
    }
    while (true) {
      if (!keyMoveStep) {
        if (!hexMode) checkPassiveSecretDetection(pl);
        var dir = heldDirection();
        var next = hexMode ? pickHexKeyStep(pl) : dir ? pickKeyStep(pl, dir) : clickMovePath.length ? clickMovePath.shift() : null;
        if (!next) {
          if (!hexMode && clickMoveExitPending && clickMovePath.length === 0) {
            clickMoveExitPending = false;
            if (returnToWorldMapFromExit()) return;
          }
          if (!hexMode && keyMoveWouldExitMap(pl, dir) && returnToWorldMapFromExit()) return;
          break;
        }
        if (!canStep(pl.x, pl.y, next.x, next.y, pl, true)) {
          if (!hexMode) {
            clickMovePath = [];
            clickMoveExitPending = false;
          }
          break;
        }
        if (!hexMode && !combatStepAllowed(pl, next)) {
          clickMovePath = [];
          clickMoveExitPending = false;
          break;
        }
        var from = tokenAnchor(pl, pl.x, pl.y), to = tokenAnchor(pl, next.x, next.y);
        var cells = Math.sqrt(Math.pow(next.x - pl.x, 2) + Math.pow(next.y - pl.y, 2));
        keyMoveStep = { from, to, dur: (hexMode ? worldTravelStepDurationMs() : localStepMs()) * cells, t0: keyMoveCarry != null ? keyMoveCarry : now };
        keyMoveCarry = null;
        var combatFrom = { x: pl.x, y: pl.y };
        pl.x = next.x;
        pl.y = next.y;
        selected = pl;
        if (!hexMode && typeof creativeTryTraverseLayerTransition === "function" && creativeTryTraverseLayerTransition(pl)) return;
        if (!hexMode) combatAfterStep(pl, combatFrom, { x: next.x, y: next.y });
        if (!hexMode) checkPassiveSecretDetection(pl);
        if (dynLight && !hexMode) revealAround(pl.x, pl.y, typeof creativeGetVisibilityRadius === "function" ? creativeGetVisibilityRadius(pl, pl.x, pl.y) : pl.luz || lightRadius);
      }
      var st = keyMoveStep;
      var p = (now - st.t0) / st.dur;
      if (p >= 1) {
        keyMoveCarry = st.t0 + st.dur;
        keyMoveStep = null;
        var clickedHere = !hexMode && !heldDirection() && clickMovePath.length === 0 && !!portalClickTarget && portalClickTarget.x === pl.x && portalClickTarget.y === pl.y;
        var reachedLocalPortal = clickedHere ? findLocalPortalAt(pl.x, pl.y) : null;
        if (reachedLocalPortal) {
          var localDestination = localPortalDestination(reachedLocalPortal, pl.x, pl.y);
          if (localDestination) {
            pl.x = localDestination.x;
            pl.y = localDestination.y;
            selected = pl;
            keyMoveVis = null;
            clickMovePath = [];
            clickMoveExitPending = false;
            if (hexMode) worldTravelPos = null;
            else {
              if (dynLight) revealAround(pl.x, pl.y, typeof creativeGetVisibilityRadius === "function" ? creativeGetVisibilityRadius(pl, pl.x, pl.y) : pl.luz || lightRadius);
              checkPassiveSecretDetection(pl);
            }
            save();
            draw();
            continue;
          }
        }
        if (hexMode) {
          worldTravelPos = null;
          var reachedPortal = null;
          if (reachedPortal) {
            stopKeyMove();
            teleportThroughWorldPortal(reachedPortal);
            return;
          }
        }
        continue;
      }
      keyMoveVis = { x: st.from.x + (st.to.x - st.from.x) * p, y: st.from.y + (st.to.y - st.from.y) * p };
      if (hexMode) worldTravelPos = keyMoveVis;
      followKeyMove();
      if (now - keyMoveLastSave > 1e3) {
        save();
        keyMoveLastSave = now;
      }
      draw();
      keyMoveRaf = window.requestAnimationFrame(keyMoveFrame);
      return;
    }
    keyMoveVis = null;
    keyMoveCarry = null;
    if (hexMode) worldTravelPos = null;
    save();
    draw();
  }
function onKey(e) {
    if (typeof creativeHandleKeyboard === "function" && creativeHandleKeyboard(e)) return;
    if (e.key === "Escape" && menuIsOpen()) {
      setMenu(false);
      return;
    }
    if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName || "")) return;
    if (MOVE_KEYS[e.code] && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (isHexMap()) {
        e.preventDefault();
        if (tool !== "select" || drag || !currentPlayer()) return;
        if (keyMoveRaf == null) stopWorldTravel(false);
      } else {
        e.preventDefault();
        if (drag || !currentPlayer()) return;
        clickMovePath = [];
        clickMoveExitPending = false;
      }
      if (typeof actionLocked === "function" && actionLocked()) return;
      keysHeld[e.code] = true;
      camPan.x = camPan.y = 0;
      portalClickTarget = null;
      if (keyMoveRaf == null) keyMoveRaf = window.requestAnimationFrame(keyMoveFrame);
      return;
    }
    if (appMode === "editor" && e.code === "Space") {
      space = true;
      e.preventDefault();
      return;
    }
    if (appMode !== "editor") {
      if (e.key === "Escape" && isHexMap()) haltWorldTravel();
      return;
    }
    if (isHexMap()) {
      if (e.key === "Escape") {
        if (tool === "portal" || tool === "spawn" || tool === "localPortal") setTool("select");
        else haltWorldTravel();
      }
      return;
    }
    if (e.key === "Escape" && pendingStructureStart) {
      pendingStructureStart = null;
      draw();
      return;
    }
    if (e.key === "Escape" && tool === "localPortal") {
      pendingLocalPortal = null;
      setTool("select");
      return;
    }
    if ((e.key === "Delete" || e.key === "Backspace") && selected && selected.tipo !== "player") {
      state.tokens = state.tokens.filter(function(t) {
        return t !== selected;
      });
      selected = null;
      save();
      draw();
    }
    if (e.key === "g" || e.key === "G") {
      showGrid = !showGrid;
      draw();
    }
    if (e.key === "f" || e.key === "F") {
      showFog = !showFog;
      draw();
    }
    if (e.key === "l" || e.key === "L") {
      dynLight = !dynLight;
      draw();
    }
    if (e.key === "w" || e.key === "W") {
      showWalls = !showWalls;
      draw();
    }
    if (e.key === "Escape") {
      pendingMonster = null;
      selected = null;
      measurePts = null;
      draw();
    }
  }
function onKeyUp(e) {
    if (e.code === "Space") space = false;
    if (MOVE_KEYS[e.code]) delete keysHeld[e.code];
  }
function onWindowBlur() {
    keysHeld = {};
    space = false;
    if (drag && drag.pan) drag = null;
  }
function setTool(t) {
    if (appMode !== "editor" && t !== "select") t = "select";
    if (isHexMap() && ["select", "pan", "spawn", "portal", "localPortal"].indexOf(t) < 0) t = "select";
    tool = t;
    pendingStructureStart = null;
    measurePts = null;
    if (t !== "token") pendingMonster = null;
    R.querySelectorAll("#mp-tools button").forEach(function(b) {
      b.classList.toggle("on", b.dataset.t === t);
    });
    if (t !== "localPortal") pendingLocalPortal = null;
    var worldSpawnButton = R.querySelector("#mp-world-spawn");
    var worldPortalButton = R.querySelector("#mp-world-portal");
    var worldLocalPortalButton = R.querySelector("#mp-world-local-portal");
    var worldMoveButton = R.querySelector("#mp-world-move");
    if (worldSpawnButton) worldSpawnButton.classList.toggle("active", t === "spawn");
    if (worldPortalButton) worldPortalButton.classList.toggle("active", t === "portal");
    if (worldLocalPortalButton) worldLocalPortalButton.classList.toggle("active", t === "localPortal");
    if (worldMoveButton) worldMoveButton.classList.toggle("active", t === "select");
    if (cv) cv.style.cursor = t === "pan" && appMode === "editor" ? "grab" : t === "select" ? "pointer" : "crosshair";
    if (typeof updateCreativeToolUi === "function") updateCreativeToolUi();
    draw();
  }
