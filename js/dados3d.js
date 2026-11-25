(function () {
  if (window.Dados3D) return;
  var PHI = (1 + Math.sqrt(5)) / 2;
  var G = 1900;
  var MAX_DICE = 26;
  var cv = null, cx = null, dice = [], raf = null, last = 0, W = 0, H = 0, dpr = 1;
  var fila = [], atual = null, lote = [], loteAgendado = false, previstos = [], aguardando = [], origemFn = null, lancadorId = null, flushTimer = null;
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
    if (d < -0.999999) return [1, 0, 0, 0];
    var ax = cross(a, b);
    return qnorm([ax[0], ax[1], ax[2], 1 + d]);
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
  }

  function reduzido() {
    return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
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

  function eixoAngulo(axis, ang) {
    var s = Math.sin(ang / 2);
    return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(ang / 2)];
  }

  function planejar(d) {
    var q0 = qmul(d.q, [-d.qt[0], -d.qt[1], -d.qt[2], d.qt[3]]);
    if (q0[3] < 0) q0 = [-q0[0], -q0[1], -q0[2], -q0[3]];
    var psi0 = 2 * Math.acos(Math.min(1, q0[3])), s = Math.sqrt(Math.max(0, 1 - q0[3] * q0[3]));
    d.plano = {
      axis: s > 1e-4 ? [q0[0] / s, q0[1] / s, q0[2] / s] : aleatorio3(),
      psi: psi0 + 2 * Math.PI * (Math.random() < 0.5 ? 1 : 2),
      ax2: aleatorio3(),
      th2: rnd(1.5, 3) * (Math.random() < 0.5 ? -1 : 1)
    };
  }

  function orientar(d, u) {
    var p = d.plano, f = Math.pow(1 - u, 3), g = Math.sin(Math.PI * u) * Math.pow(1 - u, 2);
    d.q = qmul(eixoAngulo(p.ax2, p.th2 * g), qmul(eixoAngulo(p.axis, p.psi * f), d.qt));
  }

  function spawn(kind, value, atraso) {
    var shape = getShape(kind);
    var label = String(value);
    var fi = 0;
    for (var i = 0; i < shape.faces.length; i++) if (shape.faces[i].label.replace(".", "") === label) { fi = i; break; }
    var R = Math.max(20, Math.min(40, Math.min(W, H) * 0.055));
    var qAlign = qFromTo(shape.faces[fi].n, [0, 0, 1]);
    var za = rnd(0, Math.PI * 2);
    var nd = {
      kind: kind, shape: shape, R: R, x: W / 2, y: H / 2, h: 0, vx: 0, vy: 0, vz: 0,
      q: qrandom(), w: [0, 0, 0], qt: qmul([0, 0, Math.sin(za / 2), Math.cos(za / 2)], qAlign),
      alpha: 1, color: COLORS[kind === "units" ? 10 : kind], fase: "voo", t0: Date.now() + atraso * 1000,
      fimEm: 0, tl: 0, plano: null, fimT: 0, linger: 1, st: 0, swt: 0, ph: rnd(0, Math.PI * 2), dir: 1, age: 0
    };
    dice.push(nd);
    return nd;
  }

  function ancoraBaixo(d) {
    var par = null;
    for (var i = 0; i < dice.length; i++) if (dice[i] !== d && dice[i].fase === "agitar" && dice[i].ax !== undefined) { par = dice[i]; break; }
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
    var span = Math.max(300, d.shakeEnd - d.shakeStart);
    var ramp = Math.min(1, Math.max(0, (Date.now() - d.shakeStart) / span));
    ramp = ramp * ramp;
    d.ph += (7 + 5 * ramp) * dt;
    var a = d.R * (0.35 + 1.15 * ramp);
    d.x = d.ax + Math.sin(d.ph) * a;
    d.y = d.ay + Math.sin(d.ph * 0.8 + 0.7) * d.R * 0.12;
    d.h = 26 + (0.5 + 0.5 * Math.sin(d.ph * 1.25)) * d.R * (0.9 + 0.8 * ramp);
    d.swt -= dt;
    if (d.swt <= 0) {
      d.swt = rnd(0.3, 0.6);
      d.wt = mul(aleatorio3(), 5 + 10 * ramp);
    }
    var k = Math.min(1, dt * 4);
    d.w = [d.w[0] + (d.wt[0] - d.w[0]) * k, d.w[1] + (d.wt[1] - d.w[1]) * k, d.w[2] + (d.wt[2] - d.w[2]) * k];
    girar(d, dt);
  }

  function impulso(d, alvoX, alvoY, vzMax) {
    var now = Date.now(), restante = Math.max(0.6, (d.fimEm - now) / 1000);
    var dx = alvoX - d.x, dy = alvoY - d.y, dist = Math.hypot(dx, dy) || 1, sp = dist * 3 * rnd(0.9, 1.15);
    d.vx = dx / dist * sp;
    d.vy = dy / dist * sp;
    d.vz = Math.min(vzMax || 1050, Math.max(450, restante * 299));
    d.fase = "voo";
    d.tl = now;
    planejar(d);
  }

  function lancarDoCopo(d) {
    var tx = Math.min(W * 0.92, Math.max(W * 0.08, d.x + d.dir * rnd(0.3, 0.65) * W)), ty = rnd(H * 0.12, H * 0.5);
    impulso(d, tx, ty);
  }

  function lancarLivre(d, orig) {
    var S = d.R;
    if (orig) {
      d.x = orig.x + rnd(-6, 6);
      d.y = orig.y + rnd(-6, 6);
      d.h = 55;
    } else {
      d.x = rnd(W * 0.12, W * 0.88);
      d.y = H + S * 0.3;
      d.h = 90;
    }
    var tx, ty;
    if (orig) {
      tx = orig.x + (W / 2 - orig.x) * rnd(0.35, 0.7) + rnd(-1, 1) * W * 0.1;
      ty = orig.y + (H / 2 - orig.y) * rnd(0.35, 0.7) + rnd(-1, 1) * H * 0.1;
    } else {
      tx = rnd(W * 0.15, W * 0.85);
      ty = rnd(H * 0.22, H * 0.7);
    }
    impulso(d, Math.min(W - S, Math.max(S, tx)), Math.min(H - S, Math.max(S, ty)));
  }

  function finalizar(d) {
    d.q = d.qt;
    d.h = 0;
    d.vx = d.vy = d.vz = 0;
    d.fase = "fim";
    d.fimT = 0;
    d.linger = fila.length ? 0.5 : 1.8;
  }

  function step(d, dt) {
    var now = Date.now();
    if (now < d.t0) return;
    d.age += dt;
    if (d.fase === "fim") {
      d.fimT += dt;
      if (d.fimT > d.linger) d.alpha = Math.max(0, 1 - (d.fimT - d.linger) / 0.4);
      return;
    }
    if (d.fase === "agitar") {
      if (now < d.shakeEnd || (-d.dir * Math.cos(d.ph) < 0.8 && now < d.shakeEnd + 450)) {
        agitar(d, dt);
        return;
      }
      lancarDoCopo(d);
    }
    var rem = (d.fimEm - now) / 1000;
    if (rem <= 0) {
      finalizar(d);
      return;
    }
    d.vz -= G * dt;
    d.h += d.vz * dt;
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    var speed = Math.hypot(d.vx, d.vy);
    if (d.h <= 0) {
      d.h = 0;
      if (Math.abs(d.vz) > 130) {
        d.vz = -d.vz * 0.58;
        d.vx *= 0.95;
        d.vy *= 0.95;
      } else {
        d.vz = 0;
        var kk = Math.min(6, Math.max(0.25, Math.log(Math.max(speed, 31) / 30) / Math.max(rem, 0.2)));
        var ns = speed * Math.exp(-kk * dt), k = speed > 0 ? ns / speed : 0;
        d.vx *= k;
        d.vy *= k;
      }
    }
    var S = d.R;
    if (d.x < S) { d.x = S; d.vx = Math.abs(d.vx) * 0.9; }
    if (d.x > W - S) { d.x = W - S; d.vx = -Math.abs(d.vx) * 0.9; }
    if (d.y < S) { d.y = S; d.vy = Math.abs(d.vy) * 0.9; }
    if (d.y > H - S && d.age > 0.6) { d.y = H - S; d.vy = -Math.abs(d.vy) * 0.9; }
    orientar(d, Math.min(1, Math.max(0, (now - d.tl) / Math.max(1, d.fimEm - d.tl))));
  }

  function collide() {
    for (var i = 0; i < dice.length; i++) for (var j = i + 1; j < dice.length; j++) {
      var a = dice[i], b = dice[j];
      if (a.fase !== "voo" || b.fase !== "voo" || a.h > a.R || b.h > b.R) continue;
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
    }
  }

  function render(d) {
    if (Date.now() < d.t0) return;
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

  function iniciarEtapa() {
    atual = fila.shift() || null;
    if (!atual) return;
    ensure();
    var now = Date.now(), n = atual.dados.length;
    while (dice.length + n > MAX_DICE) {
      var velho = -1;
      for (var i = 0; i < dice.length; i++) if (dice[i].fase === "fim") { velho = i; break; }
      if (velho < 0) break;
      dice.splice(velho, 1);
    }
    var dur = atual.agitar || 1500 + 90 * Math.min(n, 10);
    atual.fim = now + dur + (n - 1) * 70;
    atual.dados.forEach(function (dd, i) {
      var d = spawn(dd.kind, dd.value, i * 0.07);
      d.fimEm = d.t0 + dur;
      if (atual.agitar) {
        var throwMs = Math.min(3600, Math.max(1400, dur * 0.65));
        d.fase = "agitar";
        d.shakeStart = now;
        d.shakeEnd = Math.max(now + 150, d.fimEm - throwMs - 400);
        d.wt = [0, 0, 0];
        ancoraBaixo(d);
        d.x = d.ax;
        d.y = d.ay;
        d.h = 40;
      } else {
        lancarLivre(d, atual.orig);
        d.tl = d.t0;
      }
    });
    start();
  }

  function agendarFlush() {
    if (flushTimer) return;
    flushTimer = window.setTimeout(function () {
      flushTimer = null;
      if (ocupado()) return;
      var lista = aguardando;
      aguardando = [];
      lista.forEach(function (fn) {
        try { fn(); } catch (e) { }
      });
    }, 250);
  }

  function ocupado() {
    return !!(atual || fila.length || lote.length);
  }

  function fecharLote() {
    loteAgendado = false;
    var rolls = lote;
    lote = [];
    var etapa = null;
    rolls.forEach(function (r) {
      var chave = (r.lanc == null ? "x" : r.lanc) + "|" + (r.agitar ? "a" : "");
      var novo = !etapa || etapa.sides !== r.sides || etapa.chave !== chave || etapa.dados.length >= 12;
      if (novo) {
        etapa = { sides: r.sides, chave: chave, orig: r.orig, agitar: r.agitar || 0, dados: [] };
        fila.push(etapa);
      }
      if (r.sides === 100) {
        var tens = r.value >= 100 || r.value < 10 ? "00" : String(Math.floor(r.value / 10) * 10);
        etapa.dados.push({ kind: "tens", value: tens });
        etapa.dados.push({ kind: "units", value: String(r.value % 10) });
      } else etapa.dados.push({ kind: r.sides, value: r.sides === 10 && r.value === 10 ? "0" : String(r.value) });
    });
    if (!atual) iniciarEtapa();
    if (!ocupado()) agendarFlush();
    start();
  }

  function frame(now) {
    raf = null;
    var dt = Math.min(0.033, (now - last) / 1000 || 0.016);
    last = now;
    var agora = Date.now();
    if (atual && agora >= atual.fim) {
      if (!fila.length) {
        atual = null;
        agendarFlush();
      } else if (agora >= atual.fim + 350) iniciarEtapa();
    } else if (!atual && fila.length) iniciarEtapa();
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, W, H);
    dice.forEach(function (d) { step(d, dt); });
    collide();
    dice = dice.filter(function (d) { return d.alpha > 0; });
    dice.forEach(render);
    if (dice.length || atual || fila.length) raf = window.requestAnimationFrame(frame);
    else cx.clearRect(0, 0, W, H);
  }

  function start() {
    if (cv && raf == null) {
      last = performance.now();
      raf = window.requestAnimationFrame(frame);
    }
  }

  function enfileirar(sides, value, agitar) {
    ensure();
    var orig = null;
    if (!agitar && origemFn && lancadorId != null) {
      try { orig = origemFn(lancadorId) || null; } catch (e) { orig = null; }
    }
    lote.push({ sides: sides, value: value, orig: orig, lanc: agitar ? null : lancadorId, agitar: agitar || 0 });
    if (!loteAgendado) {
      loteAgendado = true;
      Promise.resolve().then(fecharLote);
    }
  }

  function lancar(sides, value) {
    try {
      if (reduzido()) return;
      sides = Number(sides);
      value = Number(value);
      if (!isFinite(sides) || !isFinite(value) || [4, 6, 8, 10, 12, 20, 100].indexOf(sides) < 0) return;
      enfileirar(sides, value, 0);
    } catch (e) {
    }
  }

  function prever(sides, ms) {
    var value = 1 + Math.floor(Math.random() * sides);
    previstos = previstos.filter(function (p) { return p.sides !== sides && Date.now() - p.t < 20000; });
    previstos.push({ sides: sides, value: value, t: Date.now() });
    try {
      if (!reduzido() && Number(ms) > 0 && [4, 6, 8, 10, 12, 20, 100].indexOf(sides) >= 0) enfileirar(sides, value, Number(ms));
    } catch (e) {
    }
    return value;
  }

  function consumir(sides) {
    for (var i = 0; i < previstos.length; i++) {
      if (previstos[i].sides === sides) return previstos.splice(i, 1)[0].value;
    }
    return null;
  }

  function aoTerminar(fn) {
    if (!ocupado()) fn();
    else aguardando.push(fn);
  }

  window.Dados3D = {
    lancar: lancar,
    prever: prever,
    consumir: consumir,
    ocupado: ocupado,
    aoTerminar: aoTerminar,
    lancador: function (id) { lancadorId = id == null ? null : id; },
    lancadorAtual: function () { return lancadorId; },
    provedorOrigem: function (fn) { origemFn = typeof fn === "function" ? fn : null; }
  };
})();
