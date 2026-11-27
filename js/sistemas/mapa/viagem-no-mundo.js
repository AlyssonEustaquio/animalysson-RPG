function stopWorldTravel(shouldSave) {
    if (worldTravelRaf != null) {
      window.cancelAnimationFrame(worldTravelRaf);
      worldTravelRaf = null;
    }
    worldTravelPath = [];
    worldTravelTarget = null;
    worldTravelStep = null;
    worldTravelPos = null;
    worldTravelCarry = null;
    if (shouldSave && isHexMap()) save();
  }
function haltWorldTravel() {
    worldTravelPath = [];
    worldTravelTarget = null;
    if (!worldTravelStep) stopWorldTravel(true);
    draw();
  }
function worldTravelFrame(now) {
    worldTravelRaf = null;
    var player = currentPlayer();
    if (!player || !isHexMap() || !cv) {
      stopWorldTravel(false);
      return;
    }
    while (true) {
      if (!worldTravelStep) {
        var next = worldTravelPath.shift();
        if (!next) break;
        var toPt = cellCenter(next.x, next.y);
        worldTravelStep = {
          from: cellCenter(player.x, player.y),
          to: next,
          toPt,
          dur: worldTravelStepDurationMs(),
          t0: worldTravelCarry != null ? worldTravelCarry : now
        };
        worldTravelCarry = null;
      }
      var st = worldTravelStep;
      var stepDuration = Number(st.dur) > 0 ? Number(st.dur) : WORLD_TRAVEL_STEP_MS;
      var p = (now - st.t0) / stepDuration;
      if (p >= 1) {
        player.x = st.to.x;
        player.y = st.to.y;
        selected = player;
        save();
        var arrivedAtTarget = worldTravelPath.length === 0 && !!worldTravelTarget && worldTravelTarget.x === player.x && worldTravelTarget.y === player.y;
        var reachedLocalPortal = arrivedAtTarget ? findLocalPortalAt(player.x, player.y) : null;
        if (reachedLocalPortal) {
          var localDestination = localPortalDestination(reachedLocalPortal, player.x, player.y);
          if (localDestination) {
            player.x = localDestination.x;
            player.y = localDestination.y;
            worldTravelPath = [];
            worldTravelTarget = null;
            worldTravelStep = null;
            worldTravelPos = null;
            worldTravelCarry = null;
            selected = player;
            save();
            draw();
            return;
          }
        }
        var reachedPortal = arrivedAtTarget ? findWorldPortalAt(player.x, player.y) : null;
        if (reachedPortal) {
          worldTravelPath = [];
          worldTravelTarget = null;
          worldTravelStep = null;
          worldTravelPos = null;
          worldTravelCarry = null;
          teleportThroughWorldPortal(reachedPortal);
          return;
        }
        worldTravelCarry = st.t0 + stepDuration;
        worldTravelStep = null;
        continue;
      }
      worldTravelPos = {
        x: st.from.x + (st.toPt.x - st.from.x) * p,
        y: st.from.y + (st.toPt.y - st.from.y) * p
      };
      draw();
      worldTravelRaf = window.requestAnimationFrame(worldTravelFrame);
      return;
    }
    worldTravelPos = null;
    worldTravelCarry = null;
    worldTravelTarget = null;
    save();
    draw();
  }
function startWorldTravel(destination) {
    var player = currentPlayer();
    if (!isHexMap() || !player || !destination) return;
    camPan.x = camPan.y = 0;
    stopKeyMove();
    var origin = worldTravelStep ? worldTravelStep.to : { x: player.x, y: player.y };
    if (destination.x === origin.x && destination.y === origin.y) {
      var standingLocalPortal = findLocalPortalAt(destination.x, destination.y);
      if (standingLocalPortal) {
        var localDestination = localPortalDestination(standingLocalPortal, destination.x, destination.y);
        if (localDestination) {
          player.x = localDestination.x;
          player.y = localDestination.y;
          selected = player;
          save();
          draw();
          return;
        }
      }
      var standingPortal = findWorldPortalAt(destination.x, destination.y);
      if (standingPortal) {
        teleportThroughWorldPortal(standingPortal);
        return;
      }
      worldTravelPath = [];
      worldTravelTarget = null;
      draw();
      return;
    }
    worldTravelPath = hexLine(origin, destination).slice(1);
    worldTravelTarget = { x: destination.x, y: destination.y };
    if (worldTravelRaf == null) worldTravelRaf = window.requestAnimationFrame(worldTravelFrame);
    draw();
  }
