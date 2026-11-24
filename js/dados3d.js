(function () {
  if (window.Dados3D) return;
  var PHI = (1 + Math.sqrt(5)) / 2;
  var G = 1900;
  var MAX_DICE = 26;
  var cv = null, cx = null, dice = [], raf = null, last = 0, W = 0, H = 0, dpr = 1;
  var burstAt = 0, burstN = 0, holdAte = 0, shakeAte = 0;
  var shapes = {};
  var LIGHT = [-0.35, -0.5, 0.8];
  var COLORS = { 4: [67, 160, 71], 6: [211, 47, 47], 8: [30, 136, 229], 10: [142, 68, 173], 12: [239, 140, 20], 20: [0, 137, 123], tens: [94, 53, 177] };

  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function qmul(a, b) {
    return [
      a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
      a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
      a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
      a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
    ];
  }
  function qnorm(q) { var l = Math.hypot(q[0], q[1], q[2], q[3]) || 1; return [q[0] / l, q[1] / l, q[2] / l, q[3] / l]; }
  function rot(q, v) {
    var x = v[0], y = v[1], z = v[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    var ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
    return [ix * qw + iw * -qx + iy * -qz - iz * -qy, iy * qw + iw * -qy + iz * -qx - ix * -qz, iz * qw + iw * -qz + ix * -qy - iy * -qx];
  }
  function qFromTo(a, b) {
    var d = dot(a, b);
    if (d > 0.999999) return [0, 0, 0, 1];
    if (d < -0.999999) {
      var perp = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
      var ax = norm(cross(a, perp));
      return [ax[0], ax[1], ax[2], 0];
    }
    var ax2 = cross(a, b);
    return qnorm([ax2[0], ax2[1], ax2[2], 1 + d]);
  }
  function qnlerp(a, b, k) {
    if (dot4(a, b) < 0) b = [-b[0], -b[1], -b[2], -b[3]];
    return qnorm([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k]);
  }
  function dot4(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]; }
  function qrandom() { return qnorm([rnd(-1, 1), rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)]); }

  function buildShape(verts, strings, pairs, fontSize) {
    var maxLen = 0;
    verts.forEach(function (v) { maxLen = Math.max(maxLen, Math.hypot(v[0], v[1], v[2])); });
    verts = verts.map(function (v) { return mul(v, 1 / maxLen); });
    var faces = [], seen = {};
    var n = verts.length;
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) for (var k = j + 1; k < n; k++) {
      var nr = cross(sub(verts[j], verts[i]), sub(verts[k], verts[i]));
      if (Math.hypot(nr[0], nr[1], nr[2]) < 1e-9) continue;
      nr = norm(nr);
      var d = dot(nr, verts[i]);
      if (d < 0) { nr = mul(nr, -1); d = -d; }
      var ok = true, on = [];
      for (var m = 0; m < n; m++) {
        var s = dot(nr, verts[m]) - d;
        if (s > 1e-4) { ok = false; break; }
        if (Math.abs(s) <= 1e-4) on.push(m);
      }
      if (!ok || on.length < 3) continue;
      var key = nr.map(function (c) { return Math.round(c * 1000); }).join(",");
      if (seen[key]) continue;
      seen[key] = true;
      var c = [0, 0, 0];
      on.forEach(function (idx) { c = add(c, verts[idx]); });
      c = mul(c, 1 / on.length);
      var u = norm(sub(verts[on[0]], c));
      var v = cross(nr, u);
      on.sort(function (p, q) {
        var pp = sub(verts[p], c), qq = sub(verts[q], c);
        return Math.atan2(dot(pp, v), dot(pp, u)) - Math.atan2(dot(qq, v), dot(qq, u));
      });
      faces.push({ n: nr, idx: on, c: c, u: u, v: v, label: "" });
    }
    var used = {};
    if (pairs) {
      var k2 = 0;
      faces.forEach(function (f, fi) {
        if (used[fi]) return;
        var opp = -1;
        for (var q = 0; q < faces.length; q++) if (!used[q] && q !== fi && dot(faces[q].n, f.n) < -0.98) { opp = q; break; }
        used[fi] = true;
        f.label = strings[k2];
        if (opp >= 0) { used[opp] = true; faces[opp].label = strings[strings.length - 1 - k2]; }
        k2++;
      });
    } else {
      faces.forEach(function (f, fi) { f.label = strings[fi % strings.length]; });
    }
    return { verts: verts, faces: faces, fs: fontSize };
  }

  function numbers(from, to) {
    var out = [];
    for (var i = from; i <= to; i++) out.push(String(i));
    return out;
  }

  function getShape(kind) {
    if (shapes[kind]) return shapes[kind];
    var s;
    if (kind === 4) s = buildShape([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]], numbers(1, 4), false, 0.5);
    else if (kind === 6) {
      var cube = [];
      [-1, 1].forEach(function (x) { [-1, 1].forEach(function (y) { [-1, 1].forEach(function (z) { cube.push([x, y, z]); }); }); });
      s = buildShape(cube, numbers(1, 6).map(function (t) { return t === "6" ? "6." : t; }), true, 0.95);
    } else if (kind === 8) s = buildShape([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], numbers(1, 8), true, 0.62);
    else if (kind === 10 || kind === "tens" || kind === "units") {
      var a = 0.12, ring = [];
      for (var k = 0; k < 10; k++) ring.push([Math.cos(k * Math.PI / 5), Math.sin(k * Math.PI / 5), k % 2 ? -a : a]);
      var nr = cross(sub(ring[1], ring[0]), sub(ring[2], ring[0]));
      var h = dot(nr, ring[0]) / nr[2];
      var vs = ring.concat([[0, 0, h], [0, 0, -h]]);
      var labels = kind === "tens" ? ["10", "20", "30", "40", "50", "60", "70", "80", "90", "00"] : kind === "units" ? numbers(0, 9) : numbers(1, 9).concat(["0"]);
      s = buildShape(vs, labels, true, kind === "tens" ? 0.4 : 0.5);
    } else if (kind === 12) {
      var p = 1 / PHI, dv = [];
      [-1, 1].forEach(function (x) { [-1, 1].forEach(function (y) { [-1, 1].forEach(function (z) { dv.push([x, y, z]); }); }); });
      [-1, 1].forEach(function (x) { [-1, 1].forEach(function (y) { dv.push([0, x * p, y * PHI]); dv.push([x * p, y * PHI, 0]); dv.push([x * PHI, 0, y * p]); }); });
      s = buildShape(dv, numbers(1, 12).map(function (t) { return t === "6" || t === "9" ? t + "." : t; }), true, 0.42);
    } else {
      var iv = [];
      [-1, 1].forEach(function (x) { [-1, 1].forEach(function (y) { iv.push([0, x, y * PHI]); iv.push([x, y * PHI, 0]); iv.push([x * PHI, 0, y]); }); });
      s = buildShape(iv, numbers(1, 20).map(function (t) { return t === "6" || t === "9" ? t + "." : t; }), true, 0.36);
    }
    shapes[kind] = s;
    return s;
  }

  function ensure() {
    if (cv) return;
    cv = document.createElement("canvas");
    cv.style.cssText = "position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:100000";
    document.body.appendChild(cv);
    cx = cv.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }

  function resize() {
    if (!cv) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    for (var i = 0; i < dice.length; i++) {
      var d = dice[i];
      if (d.R) {
        d.x = Math.min(Math.max(d.x, d.R), W - d.R);
        d.y = Math.min(Math.max(d.y, d.R), H - d.R);
      }
    }
  }

  function spawn(kind, value, delay) {
    var shape = getShape(kind);
    var label = String(value);
    var fi = 0;
    for (var i = 0; i < shape.faces.length; i++) if (shape.faces[i].label.replace(".", "") === label) { fi = i; break; }
    var R = Math.max(20, Math.min(40, Math.min(W, H) * 0.055));
    var sx = rnd(W * 0.12, W * 0.88), sy = H + R * 0.3;
    var tx = rnd(W * 0.15, W * 0.85), ty = rnd(H * 0.22, H * 0.7);
    var dx = tx - sx, dy = ty - sy, dist = Math.hypot(dx, dy);
    var speed = dist * 3.1 * rnd(0.85, 1.15);
    var ang = Math.atan2(dy, dx) + rnd(-0.12, 0.12);
    var qAlign = qFromTo(shape.faces[fi].n, [0, 0, 1]);
    var za = rnd(0, Math.PI * 2);
    var qt = qmul([0, 0, Math.sin(za / 2), Math.cos(za / 2)], qAlign);
    var color = COLORS[kind === "units" ? 10 : kind];
    for (var pi = 0; pi < dice.length; pi++) {
      if (!dice[pi].pend) continue;
      var c = dice[pi];
      c.pend = false;
      c.kind = kind;
      c.shape = shape;
      c.color = color;
      c.R = R;
      c.qt = qt;
      c.done = false;
      c.doneAt = 0;
      c.grace = 0;
      c.alpha = 1;
      c.age = 0;
      c.lockedFace = false;
      if (!(c.hold > Date.now()) && c.h <= 0 && Math.hypot(c.vx, c.vy) < 80) {
        calmar(c);
        c.vz = 260;
      }
      return c;
    }
    var nd = {
      kind: kind, shape: shape, R: R, delay: delay, x: sx, y: sy, h: 90, vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed, vz: rnd(600, 850),
      q: qrandom(), w: [rnd(-1, 1) * 22, rnd(-1, 1) * 22, rnd(-1, 1) * 22], qt: qt, age: 0, done: false, doneAt: 0, alpha: 1,
      color: color, hold: holdAte > Date.now() ? holdAte : 0, calm: false, pend: false, grace: 0, born: Date.now(),
      phase: holdAte > Date.now() ? "shake" : "", shakeEnd: shakeAte, shakeStart: Date.now(), st: 0, swt: 0, ph: rnd(0, Math.PI * 2), dir: 1,
      lockedFace: false
    };
    dice.push(nd);
    if (nd.phase === "shake" && shakeAte > Date.now()) {
      ancoraBaixo(nd);
      nd.x = nd.ax;
      nd.y = nd.ay;
      nd.h = 40;
    }
    return nd;
  }

  function aleatorio3() {
    return norm([rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)]);
  }

  function girar(d, dt) {
    var wl = Math.hypot(d.w[0], d.w[1], d.w[2]);
    if (wl > 1e-6) {
      var half = 0.5 * dt;
      var dq = qmul([d.w[0] * half, d.w[1] * half, d.w[2] * half, 0], d.q);
      d.q = qnorm([d.q[0] + dq[0], d.q[1] + dq[1], d.q[2] + dq[2], d.q[3] + dq[3]]);
    }
  }

  function faceMaisBaixa(d) {
    var best = null, bz = -2;
    d.shape.faces.forEach(function (f) {
      var z = rot(d.q, f.n)[2];
      if (z > bz) { bz = z; best = f; }
    });
    return qmul(qFromTo(rot(d.q, best.n), [0, 0, 1]), d.q);
  }

  function ancoraBaixo(d) {
    var par = null;
    for (var i = 0; i < dice.length; i++) if (dice[i] !== d && dice[i].phase === "shake" && dice[i].ax !== undefined) { par = dice[i]; break; }
    if (par) {
      d.ax = Math.min(W - d.R * 2, Math.max(d.R * 2, par.ax + (Math.random() < 0.5 ? -1 : 1) * d.R * 2.6));
      d.ay = par.ay;
    } else {
      d.ax = rnd(W * 0.12, W * 0.88);
      d.ay = H - d.R * rnd(1.4, 2.8);
    }
    d.dir = d.ax > W / 2 ? -1 : 1;
    d.shakeStart = Date.now();
  }

  function agitar(d, dt) {
    d.st += dt;
    if (d.ax === undefined) ancoraBaixo(d);
    var span = Math.max(300, d.shakeEnd - d.shakeStart);
    var ramp = Math.min(1, Math.max(0, (Date.now() - d.shakeStart) / span));
    ramp = ramp * ramp;
    d.ph += (7 + 5 * ramp) * dt;
    var a = d.R * (0.35 + 1.15 * ramp);
    d.x = d.ax + Math.sin(d.ph) * a;
    d.y = d.ay + Math.sin(d.ph * 0.8 + 0.7) * d.R * 0.12;
    d.h = 26 + (0.5 + 0.5 * Math.sin(d.ph * 1.25)) * d.R * (0.9 + 0.8 * ramp);
    d.vx = d.vy = d.vz = 0;
    d.swt -= dt;
    if (d.swt <= 0) {
      d.swt = rnd(0.3, 0.6);
      d.wt = mul(aleatorio3(), 5 + 10 * ramp);
    }
    if (!d.wt) d.wt = [0, 0, 0];
    var k = Math.min(1, dt * 4);
    d.w = [d.w[0] + (d.wt[0] - d.w[0]) * k, d.w[1] + (d.wt[1] - d.w[1]) * k, d.w[2] + (d.wt[2] - d.w[2]) * k];
    girar(d, dt);
  }

  function lancarDoCopo(d) {
    d.phase = "throw";
    d.age = 0;
    if (d.ax === undefined) return;
    var tx = Math.min(W * 0.92, Math.max(W * 0.08, d.x + d.dir * rnd(0.3, 0.65) * W)), ty = rnd(H * 0.12, H * 0.5);
    var dx = tx - d.x, dy = ty - d.y, dist = Math.hypot(dx, dy) || 1, sp = dist * 3 * rnd(0.9, 1.15);
    d.vx = dx / dist * sp;
    d.vy = dy / dist * sp;
    d.vz = rnd(750, 1000);
    d.w = mul(aleatorio3(), rnd(22, 34));
  }

  function calmar(d) {
    d.calm = true;
    d.vz = Math.min(d.vz, 0);
  }

  function step(d, dt) {
    if (d.delay > 0) { d.delay -= dt; return; }
    d.age += dt;
    var holding = d.hold > 0;
    if (holding && Date.now() >= d.hold) {
      d.hold = 0;
      holding = false;
      d.age = 0;
      if (d.pend) {
        d.pend = false;
        d.done = true;
        d.doneAt = 2.6;
        d.alpha = 0;
        return;
      }
      if (d.phase === "shake") lancarDoCopo(d);
      if (d.pend) d.grace = 0.3;
    }
    if (d.grace > 0) {
      d.grace -= dt;
      if (d.grace <= 0 && d.pend) { d.done = true; d.doneAt = 2.6; }
    }
    if (holding && d.phase === "shake") {
      var agora = Date.now();
      if (agora < d.shakeEnd || (d.ax !== undefined && -d.dir * Math.cos(d.ph) < 0.8 && agora < d.shakeEnd + 700)) {
        agitar(d, dt);
        return;
      }
      lancarDoCopo(d);
    }
    d.vz -= G * dt;
    d.h += d.vz * dt;
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    var onGround = false;
    if (d.h <= 0) {
      d.h = 0;
      if (Math.abs(d.vz) > 130 && !d.calm) {
        d.vz = -d.vz * (holding ? 0.55 : 0.5);
        var bk = holding ? 0.95 : 0.88;
        d.vx *= bk;
        d.vy *= bk;
        d.w = mul(aleatorio3(), Math.min(30, 8 + Math.hypot(d.vx, d.vy) / 70));
      } else {
        d.vz = 0;
        onGround = true;
      }
    }
    var speed = Math.hypot(d.vx, d.vy);
    if (onGround) {
      var ns;
      if (holding) {
        var rem = Math.max(0.2, (d.hold - Date.now()) / 1000);
        var kk = Math.min(6, Math.max(0.25, Math.log(Math.max(speed, 31) / 30) / rem));
        ns = speed * Math.exp(-kk * dt);
      } else ns = Math.max(0, speed * Math.exp(-1.1 * dt) - 45 * dt);
      var k = speed > 0 ? ns / speed : 0;
      d.vx *= k;
      d.vy *= k;
      speed = ns;
      d.w = mul(d.w, Math.exp(-3.5 * dt));
    }
    var S = d.R, wr2 = holding ? 0.9 : 0.72;
    if (d.x < S) { d.x = S; d.vx = Math.abs(d.vx) * wr2; }
    if (d.x > W - S) { d.x = W - S; d.vx = -Math.abs(d.vx) * wr2; }
    if (d.y < S) { d.y = S; d.vy = Math.abs(d.vy) * wr2; }
    if (d.y > H - S && d.age > 0.6) { d.y = H - S; d.vy = -Math.abs(d.vy) * wr2; }
    girar(d, dt);
    if (d.calm) {
      var kc = Math.exp(-8 * dt);
      d.vx *= kc;
      d.vy *= kc;
      d.w = mul(d.w, Math.exp(-7 * dt));
      d.q = qnlerp(d.q, d.qt, 1 - Math.exp(-dt * 6));
    } else if (holding) {
      var remS = (d.hold - Date.now()) / 1000;
      var rate = d.h === 0 ? (1 - Math.min(1, speed / 350)) * 5 : 0;
      if (!d.pend && remS < 1) rate = Math.max(rate, (1 - Math.max(0, remS)) * 6);
      if (rate > 0) {
        d.q = qnlerp(d.q, d.pend ? faceMaisBaixa(d) : d.qt, 1 - Math.exp(-dt * rate));
        d.w = mul(d.w, Math.exp(-dt * rate * 0.5));
      }
    } else if (!holding && !d.pend && d.h === 0 && speed < 110) {
      d.q = qnlerp(d.q, d.qt, 1 - Math.exp(-dt * 5));
      d.w = mul(d.w, Math.exp(-4 * dt));
    }
    if (!d.done && !holding && !d.pend && d.h === 0 && speed < 8 && Math.abs(dot4(d.q, d.qt)) > 0.9995) {
      d.done = true;
      d.doneAt = 0;
      d.q = d.qt;
    }
    if (!d.done && !holding && !d.pend && d.age > 9) { d.done = true; d.q = d.qt; d.vx = d.vy = 0; d.h = 0; }
    if (d.done) {
      d.doneAt += dt;
      if (d.doneAt > 2.6) d.alpha = Math.max(0, 1 - (d.doneAt - 2.6) / 0.6);
    }
  }

  function collide() {
    for (var i = 0; i < dice.length; i++) for (var j = i + 1; j < dice.length; j++) {
      var a = dice[i], b = dice[j];
      if (a.delay > 0 || b.delay > 0 || a.h > a.R || b.h > b.R) continue;
      var dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy), min = (a.R + b.R) * 0.95;
      if (dist >= min || dist === 0) continue;
      var nx = dx / dist, ny = dy / dist, push = (min - dist) / 2;
      a.x -= nx * push; a.y -= ny * push;
      b.x += nx * push; b.y += ny * push;
      var rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (rel < 0) {
        var imp = -rel * 0.6;
        a.vx -= nx * imp; a.vy -= ny * imp;
        b.vx += nx * imp; b.vy += ny * imp;
      }
      if (a.done) { a.done = false; a.doneAt = 0; a.alpha = 1; }
      if (b.done) { b.done = false; b.doneAt = 0; b.alpha = 1; }
    }
  }

  function render(d) {
    if (d.delay > 0 || d.alpha <= 0) return;
    var S = d.R * (1 + d.h / 500), px = d.x, py = d.y - d.h * 0.4;
    cx.save();
    cx.globalAlpha = d.alpha;
    cx.fillStyle = "rgba(0,0,0," + Math.max(0.1, 0.38 - d.h / 700) + ")";
    cx.beginPath();
    cx.ellipse(d.x + 4 + d.h * 0.12, d.y + 7 + d.h * 0.12, S * 0.95, S * 0.8, 0, 0, Math.PI * 2);
    cx.fill();
    var vs = d.shape.verts.map(function (v) { return rot(d.q, v); });
    var list = [];
    d.shape.faces.forEach(function (f) {
      var n = rot(d.q, f.n);
      if (n[2] > 0) list.push({ f: f, n: n });
    });
    list.sort(function (a, b) { return a.n[2] - b.n[2]; });
    list.forEach(function (it) {
      var f = it.f, n = it.n;
      var l = Math.max(0, dot(n, norm(LIGHT)));
      var br = 0.42 + 0.58 * l;
      cx.beginPath();
      f.idx.forEach(function (vi, k) {
        var x = px + vs[vi][0] * S, y = py + vs[vi][1] * S;
        if (k === 0) cx.moveTo(x, y);
        else cx.lineTo(x, y);
      });
      cx.closePath();
      cx.fillStyle = "rgb(" + Math.round(d.color[0] * br) + "," + Math.round(d.color[1] * br) + "," + Math.round(d.color[2] * br) + ")";
      cx.fill();
      cx.strokeStyle = "rgba(0,0,0,0.55)";
      cx.lineWidth = 1.3;
      cx.lineJoin = "round";
      cx.stroke();
      if (n[2] > 0.3) {
        var u = rot(d.q, f.u), v = rot(d.q, f.v), c = rot(d.q, f.c);
        cx.save();
        cx.transform(u[0] * S, u[1] * S, v[0] * S, v[1] * S, px + c[0] * S, py + c[1] * S);
        cx.font = "700 " + d.shape.fs + "px Roboto, Arial, sans-serif";
        cx.textAlign = "center";
        cx.textBaseline = "middle";
        cx.fillStyle = "rgba(255,255,255," + Math.min(1, n[2] * 1.4) + ")";
        cx.shadowColor = "rgba(0,0,0,0.6)";
        cx.shadowBlur = 2;
        cx.fillText(f.label, 0, 0);
        cx.restore();
      }
    });
    cx.restore();
  }

  function frame(now) {
    raf = null;
    var dt = Math.min(0.033, (now - last) / 1000 || 0.016);
    last = now;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, W, H);
    dice.forEach(function (d) { step(d, dt); });
    collide();
    dice = dice.filter(function (d) { return d.alpha > 0; });
    dice.forEach(render);
    if (dice.length) raf = window.requestAnimationFrame(frame);
    else cx.clearRect(0, 0, W, H);
  }

  function start() {
    if (raf == null) {
      last = performance.now();
      raf = window.requestAnimationFrame(frame);
    }
  }

  function lancar(sides, value) {
    try {
      if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      sides = Number(sides);
      value = Number(value);
      if (!isFinite(sides) || !isFinite(value)) return;
      if (dice.length >= MAX_DICE && !dice.some(function (x) { return x.pend; })) return;
      ensure();
      var now = performance.now();
      var gap = now - burstAt;
      if (gap > 900 || burstN >= 4) burstN = 0;
      burstAt = now;
      var delay = Math.min(burstN * 0.55, 1.65);
      burstN++;
      if (sides === 100) {
        var tens = value >= 100 ? "00" : String(Math.floor(value / 10) * 10 || "00");
        if (value < 10) tens = "00";
        spawn("tens", tens, delay);
        spawn("units", String(value % 10), delay + 0.03);
      } else if ([4, 6, 8, 10, 12, 20].indexOf(sides) >= 0) {
        spawn(sides, sides === 10 && value === 10 ? "0" : String(value), delay);
      } else return;
      for (var i = 0; i < dice.length; i++) {
        if (dice[i].pend && !(dice[i].hold > Date.now())) {
          dice[i].pend = false;
          dice[i].alpha = 0;
        }
      }
      dice = dice.filter(function (d) { return d.alpha > 0; });
      start();
    } catch (e) {
    }
  }

  function segurar(ms) {
    try {
      if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      ms = Number(ms);
      if (!isFinite(ms) || ms <= 0) return;
      ensure();
      var now = Date.now(), until = now + ms;
      var throwMs = Math.min(3600, Math.max(1400, ms * 0.65));
      holdAte = until;
      shakeAte = Math.max(now + 150, until - throwMs);
      var list = dice.filter(function (d) {
        return d.pend || d.hold > now || now - d.born < 1500;
      });
      if (list.length > 1) list = [list[list.length - 1]];
      list.forEach(function (d) {
        d.hold = until;
        d.calm = false;
        d.done = false;
        d.doneAt = 0;
        d.grace = 0;
        d.alpha = 1;
        d.delay = 0;
        d.pend = true;
        d.phase = "shake";
        d.shakeEnd = shakeAte;
        if (d.ax === undefined) ancoraBaixo(d);
      });
      if (!list.length && dice.length < MAX_DICE) {
        var p = spawn(20, 20, 0);
        p.pend = true;
        p.hold = until;
        p.phase = "shake";
        p.shakeEnd = shakeAte;
      }
      start();
    } catch (e) {
    }
  }

  window.Dados3D = { lancar: lancar, segurar: segurar };
})();
