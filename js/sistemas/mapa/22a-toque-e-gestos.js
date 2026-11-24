function attachTouchGestures() {
    var pts = {}, ignored = {}, g = null;
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
    cv.addEventListener("pointerdown", function(e) {
      if (e.pointerType !== "touch") return;
      if (Object.keys(pts).length >= 2) {
        ignored[e.pointerId] = true;
        block(e);
        return;
      }
      pts[e.pointerId] = localPoint(e);
      if (Object.keys(pts).length < 2) return;
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
      if (!ignored[e.pointerId]) return;
      if (g) applyGesture();
      block(e);
    }, true);
    function end(e) {
      if (e.pointerType !== "touch") return;
      var wasIgnored = ignored[e.pointerId];
      delete pts[e.pointerId];
      delete ignored[e.pointerId];
      if (Object.keys(pts).length < 2) g = null;
      if (wasIgnored) block(e);
    }
    cv.addEventListener("pointerup", end, true);
    cv.addEventListener("pointercancel", end, true);
  }

function attachDpad() {
    if (!window.matchMedia || !window.matchMedia("(pointer:coarse)").matches) return;
    var host = R && R.querySelector(".mp-main");
    if (!host || host.querySelector("#mp-dpad")) return;
    if (!document.getElementById("mp-dpad-style")) {
      var st = document.createElement("style");
      st.id = "mp-dpad-style";
      st.textContent = "#mp-root #mp-dpad{position:absolute;right:calc(12px + env(safe-area-inset-right,0px));bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:20;display:grid;grid-template-columns:repeat(3,54px);grid-template-rows:repeat(3,54px);gap:6px;user-select:none;-webkit-user-select:none;touch-action:none;opacity:.88}#mp-root #mp-dpad[hidden]{display:none}#mp-root #mp-dpad button{width:54px;height:54px;padding:0;border-radius:12px;border:1px solid rgba(255,255,255,.28);background:rgba(15,15,18,.86);color:#fff;font-size:22px;line-height:1;touch-action:none;-webkit-touch-callout:none}#mp-root #mp-dpad button.on{background:rgba(55,145,190,.7);border-color:#66c8ed}#mp-root #mp-dpad-toggle{position:absolute;right:calc(12px + env(safe-area-inset-right,0px));bottom:calc(190px + env(safe-area-inset-bottom,0px));z-index:20;width:44px;height:44px;padding:0;border-radius:10px;border:1px solid rgba(255,255,255,.28);background:rgba(15,15,18,.86);color:#fff;font-size:20px}";
      document.head.appendChild(st);
    }
    var KEYS = {
      up: { code: "ArrowUp", kc: 38, label: "▲", cell: "1 / 2" },
      left: { code: "ArrowLeft", kc: 37, label: "◀", cell: "2 / 1" },
      down: { code: "ArrowDown", kc: 40, label: "▼", cell: "3 / 2" },
      right: { code: "ArrowRight", kc: 39, label: "▶", cell: "2 / 3" }
    };
    function fire(type, k) {
      var target = cv || document.body;
      var ev = new KeyboardEvent(type, { key: k.code, code: k.code, bubbles: true, cancelable: true });
      try {
        Object.defineProperty(ev, "keyCode", { get: function() { return k.kc; } });
        Object.defineProperty(ev, "which", { get: function() { return k.kc; } });
      } catch (err) {
      }
      target.dispatchEvent(ev);
    }
    var pad = document.createElement("div");
    pad.id = "mp-dpad";
    Object.keys(KEYS).forEach(function(name) {
      var k = KEYS[name], b = document.createElement("button"), down = false;
      b.type = "button";
      b.textContent = k.label;
      b.setAttribute("aria-label", "Mover " + name);
      var cell = k.cell.split(" / ");
      b.style.gridRow = cell[0];
      b.style.gridColumn = cell[1];
      function release() {
        if (!down) return;
        down = false;
        b.classList.remove("on");
        fire("keyup", k);
      }
      b.addEventListener("pointerdown", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (down) return;
        down = true;
        b.classList.add("on");
        try {
          b.setPointerCapture(e.pointerId);
        } catch (err) {
        }
        fire("keydown", k);
      });
      b.addEventListener("pointerup", release);
      b.addEventListener("pointercancel", release);
      b.addEventListener("lostpointercapture", release);
      b.addEventListener("contextmenu", function(e) {
        e.preventDefault();
      });
      pad.appendChild(b);
    });
    var toggle = document.createElement("button");
    toggle.id = "mp-dpad-toggle";
    toggle.type = "button";
    toggle.textContent = "🎮";
    toggle.setAttribute("aria-label", "Mostrar ou esconder o direcional");
    var hidden = false;
    try {
      hidden = localStorage.getItem("mp-dpad-oculto") === "1";
    } catch (err) {
    }
    pad.hidden = hidden;
    toggle.onclick = function() {
      pad.hidden = !pad.hidden;
      try {
        localStorage.setItem("mp-dpad-oculto", pad.hidden ? "1" : "0");
      } catch (err) {
      }
    };
    host.appendChild(pad);
    host.appendChild(toggle);
  }
