var portalClickTarget = null;
var pendingTouchMove = null;

function runOrDeferMove(e, fn) {
    if (e && e.pointerType === "touch") {
      pendingTouchMove = { id: e.pointerId, x0: e.clientX, y0: e.clientY, fn: fn };
      return;
    }
    fn();
  }

function attachTouchGestures() {
    var pts = {}, ignored = {}, g = null, hold = null;
    cv.style.webkitTouchCallout = "none";
    cv.style.userSelect = "none";
    cv.style.webkitUserSelect = "none";
    function clearHold() {
      if (hold && hold.timer) window.clearTimeout(hold.timer);
      hold = null;
    }
    function startHold(e) {
      clearHold();
      if (appMode !== "editor") return;
      hold = { id: e.pointerId, x0: e.clientX, y0: e.clientY, cx: e.clientX, cy: e.clientY, timer: null };
      hold.timer = window.setTimeout(function() {
        var h = hold;
        hold = null;
        if (!h || !pts[h.id] || Object.keys(pts).length !== 1 || g) return;
        if (appMode !== "editor" || tool !== "select" && tool !== "pan") return;
        if (drag && (drag.moveToken || drag.wall || drag.brush || drag.edgePaint || drag.pan)) return;
        pendingTouchMove = null;
        clickMovePath = [];
        clickMoveExitPending = false;
        if (isHexMap()) stopWorldTravel(false);
        drag = { pan: true, startX: h.cx, startY: h.cy, originX: ox, originY: oy };
        cv.style.cursor = "grabbing";
        try {
          cv.setPointerCapture(h.id);
        } catch (err) {
        }
        if (navigator.vibrate) navigator.vibrate(15);
      }, 420);
    }
    function localPoint(e) {
      var r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function pair() {
      var ids = Object.keys(pts);
      if (ids.length < 2) return null;
      var a = pts[ids[0]], b = pts[ids[1]];
      return { dist: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
    }
    function block(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
    function cancelFirstFinger() {
      pendingTouchMove = null;
      drag = null;
      clickMovePath = [];
      clickMoveExitPending = false;
      previewPointer = null;
      if (isHexMap()) stopWorldTravel(false);
    }
    function applyGesture() {
      var p = pair();
      if (!p || !g) return;
      var f = g.dist > 0 ? p.dist / g.dist : 1;
      if (appMode === "editor") {
        var z = Math.max(0.02, Math.min(32, g.zoom * f));
        var wx = (g.mx - g.ox) / g.zoom, wy = (g.my - g.oy) / g.zoom;
        zoom = z;
        ox = p.mx - wx * z;
        oy = p.my - wy * z;
        draw();
        return;
      }
      if (isHexMap()) return;
      zoom = Math.max(visionZoom(), Math.min(16, g.zoom * f));
      centerCameraOnPlayer();
      draw();
    }
    var pan1 = null;
    function startPan1(e) {
      pan1 = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox0: ox, oy0: oy, px0: camPan.x, py0: camPan.y };
    }
    cv.addEventListener("pointerdown", function(e) {
      if (e.pointerType !== "touch") return;
      if (Object.keys(pts).length === 0 && (appMode !== "editor" || tool === "select" || tool === "pan")) startPan1(e);
      else pan1 = null;
      if (Object.keys(pts).length >= 2) {
        ignored[e.pointerId] = true;
        block(e);
        return;
      }
      pts[e.pointerId] = localPoint(e);
      if (Object.keys(pts).length < 2) {
        startHold(e);
        return;
      }
      clearHold();
      cancelFirstFinger();
      var p = pair();
      g = { zoom: zoom, ox: ox, oy: oy, dist: p.dist, mx: p.mx, my: p.my };
      Object.keys(pts).forEach(function(id) {
        ignored[id] = true;
      });
      block(e);
    }, true);
    cv.addEventListener("pointermove", function(e) {
      if (e.pointerType !== "touch") return;
      if (pts[e.pointerId]) pts[e.pointerId] = localPoint(e);
      if (hold && hold.id === e.pointerId) {
        hold.cx = e.clientX;
        hold.cy = e.clientY;
        if (Math.hypot(e.clientX - hold.x0, e.clientY - hold.y0) > 10) clearHold();
      }
      if (pendingTouchMove && pendingTouchMove.id === e.pointerId && Math.hypot(e.clientX - pendingTouchMove.x0, e.clientY - pendingTouchMove.y0) > 10) pendingTouchMove = null;
      if (pan1 && pan1.id === e.pointerId && !g) {
        var ddx = e.clientX - pan1.sx, ddy = e.clientY - pan1.sy;
        if (pan1.on || Math.hypot(ddx, ddy) > 10 && !(drag && (drag.moveToken || drag.wall || drag.brush || drag.edgePaint))) {
          if (!pan1.on) {
            pan1.on = true;
            clearHold();
            pendingTouchMove = null;
            drag = null;
          }
          if (appMode === "editor") {
            ox = pan1.ox0 + ddx;
            oy = pan1.oy0 + ddy;
          } else {
            camPan.x = pan1.px0 + ddx;
            camPan.y = pan1.py0 + ddy;
          }
          draw();
          block(e);
          return;
        }
      }
      if (!ignored[e.pointerId]) return;
      if (g) applyGesture();
      block(e);
    }, true);
    function end(e) {
      if (e.pointerType !== "touch") return;
      var wasIgnored = ignored[e.pointerId];
      var panned = pan1 && pan1.id === e.pointerId && pan1.on;
      if (pan1 && pan1.id === e.pointerId) pan1 = null;
      if (hold && hold.id === e.pointerId) clearHold();
      if (pendingTouchMove && pendingTouchMove.id === e.pointerId) {
        var move = pendingTouchMove;
        pendingTouchMove = null;
        if (e.type === "pointerup" && !wasIgnored && !g) move.fn();
      }
      delete pts[e.pointerId];
      delete ignored[e.pointerId];
      if (Object.keys(pts).length < 2) g = null;
      if (wasIgnored || panned) block(e);
    }
    cv.addEventListener("pointerup", end, true);
    cv.addEventListener("pointercancel", end, true);
  }
