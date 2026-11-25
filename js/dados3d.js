(function () {
  if (window.Dados3D) return;
  var PHI = (1 + Math.sqrt(5)) / 2;
  var GRAV = 2600, REST = 0.5, MU = 0.38, DT = 1 / 240;
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
    if (kind === 4) {
      s = buildShape([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]], numbers(1, 4), false, 0.5);
      s.vlabels = numbers(1, 4);
    }
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
    s.inR = 9;
    s.faces.forEach(function (f) { s.inR = Math.min(s.inR, dot(f.n, f.c)); });
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

  function simular(shape, R, s0) {
    var verts = shape.verts.map(function (v) { return mul(v, R); }), nv = verts.length;
    var I = 0.4 * Math.pow(R * 0.62, 2);
    var p = [s0.x, s0.y, s0.z], v = [s0.vx, s0.vy, s0.vz], q = s0.q.slice(), w = s0.w.slice();
    var M = R * 0.9, out = [], quieto = 0, rs = new Array(nv), calmo = false;
    for (var n = 0; n < 1440; n++) {
      v[2] -= GRAV * DT;
      p[0] += v[0] * DT; p[1] += v[1] * DT; p[2] += v[2] * DT;
      var hw = 0.5 * DT, dq = qmul([w[0] * hw, w[1] * hw, w[2] * hw, 0], q);
      q = qnorm([q[0] + dq[0], q[1] + dq[1], q[2] + dq[2], q[3] + dq[3]]);
      for (var i = 0; i < nv; i++) rs[i] = rot(q, verts[i]);
      for (var it = 0; it < 4; it++) {
        for (i = 0; i < nv; i++) {
          var r = rs[i];
          if (p[2] + r[2] > 0) continue;
          var vz = v[2] + w[0] * r[1] - w[1] * r[0];
          if (vz >= 0) continue;
          var e = vz < -240 ? REST : 0;
          var j = -(1 + e) * vz / (1 + (r[0] * r[0] + r[1] * r[1]) / I);
          v[2] += j;
          w[0] += r[1] * j / I;
          w[1] -= r[0] * j / I;
          var cx0 = v[0] + w[1] * r[2] - w[2] * r[1], cy0 = v[1] + w[2] * r[0] - w[0] * r[2];
          var sp = Math.hypot(cx0, cy0);
          if (sp > 1e-3) {
            var tx = cx0 / sp, ty = cy0 / sp, rt = cross(r, [tx, ty, 0]);
            var jt = Math.min(sp / (1 + dot(rt, rt) / I), MU * j);
            v[0] -= tx * jt; v[1] -= ty * jt;
            var tq = cross(r, [-tx * jt, -ty * jt, 0]);
            w[0] += tq[0] / I; w[1] += tq[1] / I; w[2] += tq[2] / I;
          }
        }
      }
      var minZ = 0;
      for (i = 0; i < nv; i++) minZ = Math.min(minZ, p[2] + rs[i][2]);
      if (minZ < 0) p[2] -= minZ;
      var dm = Math.exp(-0.3 * DT);
      w[0] *= dm; w[1] *= dm; w[2] *= dm;
      if (p[0] < M) { p[0] = M; if (v[0] < 0) v[0] *= -0.5; }
      if (p[0] > W - M) { p[0] = W - M; if (v[0] > 0) v[0] *= -0.5; }
      if (p[1] < M) { p[1] = M; if (v[1] < 0) v[1] *= -0.5; }
      if (p[1] > H - M) { p[1] = H - M; if (v[1] > 0) v[1] *= -0.5; }
      if (n % 2 === 1) out.push(p[0], p[1], p[2], q[0], q[1], q[2], q[3]);
      if (Math.hypot(v[0], v[1], v[2]) < 30 && Math.hypot(w[0], w[1], w[2]) < 1.5) {
        quieto += DT;
        if (quieto > 0.25) { calmo = true; break; }
      } else quieto = 0;
    }
    return { data: Float32Array.from(out), n: out.length / 7, dt: 2 * DT, rest: calmo, q: q };
  }

  function topo(shape, q) {
    var best = 0, bz = -2, lista = shape.vlabels ? shape.verts : shape.faces.map(function (f) { return f.n; });
    for (var i = 0; i < lista.length; i++) {
      var z = rot(q, lista[i])[2];
      if (z > bz) { bz = z; best = i; }
    }
    return { idx: best, plano: bz > 0.985 };
  }

  function lancarFisico(d, geraInicio, evitar) {
    var alt = null, ult = null, achou = null;
    for (var k = 0; k < 120 && !achou; k++) {
      var r = simular(d.shape, d.R, geraInicio());
      ult = r;
      if (!r.rest) continue;
      var tp = topo(d.shape, r.q);
      if (!tp.plano) continue;
      var o = (r.n - 1) * 7, fx = r.data[o], fy = r.data[o + 1];
      if (evitar.some(function (e) { return Math.hypot(e.x - fx, e.y - fy) < d.R * 2.1; })) continue;
      if (tp.idx === d.alvo) achou = r;
      else if (!alt) alt = { r: r, idx: tp.idx };
    }
    if (!achou) {
      var base = alt ? alt.r : ult, idx = alt ? alt.idx : topo(d.shape, ult.q).idx;
      if (d.shape.vlabels) {
        d.vl = d.shape.vlabels.slice();
        var vt = d.vl[idx]; d.vl[idx] = d.vl[d.alvo]; d.vl[d.alvo] = vt;
      } else {
        d.fl = d.shape.faces.map(function (f) { return f.label; });
        var ft = d.fl[idx]; d.fl[idx] = d.fl[d.alvo]; d.fl[d.alvo] = ft;
      }
      achou = base;
    }
    var f = (achou.n - 1) * 7;
    evitar.push({ x: achou.data[f], y: achou.data[f + 1] });
    d.traj = achou;
  }

  function spawn(kind, value, atraso) {
    var shape = getShape(kind);
    var label = String(value);
    var fi = 0;
    if (shape.vlabels) fi = Math.max(0, Math.min(3, Number(value) - 1));
    else for (var i = 0; i < shape.faces.length; i++) if (shape.faces[i].label.replace(".", "") === label) { fi = i; break; }
    var R = Math.max(20, Math.min(40, Math.min(W, H) * 0.055));
    var nd = {
      kind: kind, shape: shape, R: R, x: W / 2, y: H / 2, h: 0, alvo: fi, fl: null, vl: null, traj: null,
      q: qrandom(), w: [0, 0, 0], alpha: 1, color: COLORS[kind === "units" ? 10 : kind], fase: "voo",
      t0: Date.now() + atraso * 1000, tl: 0, fimEm: 0, fimT: 0, rate: 1, linger: 1, st: 0, swt: 0, ph: rnd(0, Math.PI * 2), dir: 1, etapa: null
    };
    dice.push(nd);
    return nd;
  }

  function inicioLivre(d, orig, evitarOrig) {
    var R = d.R, x, y, tx, ty;
    if (orig) {
      x = orig.x + rnd(-8, 8);
      y = orig.y + rnd(-8, 8);
      tx = orig.x + (W / 2 - orig.x) * rnd(0.35, 0.8) + rnd(-1, 1) * W * 0.12;
      ty = orig.y + (H / 2 - orig.y) * rnd(0.35, 0.8) + rnd(-1, 1) * H * 0.12;
    } else {
      x = rnd(W * 0.15, W * 0.85);
      y = H - R * 1.2;
      tx = rnd(W * 0.15, W * 0.85);
      ty = rnd(H * 0.2, H * 0.6);
    }
    var dx = tx - x, dy = ty - y, dist = Math.hypot(dx, dy) || 1, sp = rnd(1100, 2000);
    return { x: x, y: y, z: R * 1.3 + 90, vx: dx / dist * sp, vy: dy / dist * sp, vz: rnd(450, 950), q: qrandom(), w: mul(aleatorio3(), rnd(12, 30)) };
  }

  function inicioCopo(d) {
    var tx = Math.min(W * 0.92, Math.max(W * 0.08, d.x + d.dir * rnd(0.3, 0.65) * W)), ty = rnd(H * 0.12, H * 0.5);
    var dx = tx - d.x, dy = ty - d.y, dist = Math.hypot(dx, dy) || 1, sp = rnd(1100, 1900);
    return { x: d.x, y: d.y, z: d.h + d.shape.inR * d.R, vx: dx / dist * sp, vy: dy / dist * sp, vz: rnd(250, 600), q: d.q.slice(), w: mul(aleatorio3(), rnd(15, 32)) };
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

  function lancarDoCopo(d) {
    lancarFisico(d, function () { return inicioCopo(d); }, []);
    var agora = Date.now(), dur = (d.traj.n - 1) * d.traj.dt, resta = Math.max(0.4, (d.fimEm - agora) / 1000);
    d.rate = Math.min(1.3, Math.max(0.75, dur / resta));
    d.fase = "voo";
    d.tl = agora;
    d.fimEm = agora + dur * 1000 / d.rate;
    if (d.etapa) d.etapa.fim = d.etapa.objs.reduce(function (m, o) { return Math.max(m, o.fimEm); }, 0);
  }

  function aplicarFrame(d, i, f) {
    var a = i * 7, b = Math.min(d.traj.n - 1, i + 1) * 7, D = d.traj.data;
    d.x = D[a] + (D[b] - D[a]) * f;
    d.y = D[a + 1] + (D[b + 1] - D[a + 1]) * f;
    d.h = Math.max(0, D[a + 2] + (D[b + 2] - D[a + 2]) * f - d.shape.inR * d.R);
    d.q = qnlerp([D[a + 3], D[a + 4], D[a + 5], D[a + 6]], [D[b + 3], D[b + 4], D[b + 5], D[b + 6]], f);
  }

  function finalizar(d) {
    aplicarFrame(d, d.traj.n - 1, 0);
    d.fase = "fim";
    d.fimT = 0;
    d.linger = fila.length ? 0.5 : 1.8;
  }

  function step(d, dt) {
    var now = Date.now();
    if (now < d.t0) return;
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
    var pos = (now - d.tl) / 1000 * d.rate / d.traj.dt, i = Math.floor(pos);
    if (i >= d.traj.n - 1) {
      finalizar(d);
      return;
    }
    aplicarFrame(d, i, pos - i);
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
    d.shape.faces.forEach(function (f, fi) {
      var n = rot(d.q, f.n);
      if (n[2] > 0) list.push({ f: f, n: n, fi: fi });
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
      if (d.shape.vlabels) {
        if (n[2] > 0.12) {
          var vl = d.vl || d.shape.vlabels;
          f.idx.forEach(function (vi) {
            var vv = d.shape.verts[vi], dirv = norm(sub(vv, f.c));
            var P = rot(d.q, add(f.c, mul(sub(vv, f.c), 0.5)));
            var V2 = mul(dirv, -1), U = rot(d.q, cross(V2, f.n)), V = rot(d.q, V2);
            cx.save();
            cx.transform(U[0] * S, U[1] * S, V[0] * S, V[1] * S, px + P[0] * S, py + P[1] * S);
            cx.font = "700 " + d.shape.fs + "px Roboto, Arial, sans-serif";
            cx.textAlign = "center";
            cx.textBaseline = "middle";
            cx.fillStyle = "rgba(255,255,255," + Math.min(1, n[2] * 3) + ")";
            cx.shadowColor = "rgba(0,0,0,0.6)";
            cx.shadowBlur = 2;
            cx.fillText(vl[vi], 0, 0);
            cx.restore();
          });
        }
      } else if (n[2] > 0.3) {
        var u = rot(d.q, f.u), v = rot(d.q, f.v), c = rot(d.q, f.c);
        cx.save();
        cx.transform(u[0] * S, u[1] * S, v[0] * S, v[1] * S, px + c[0] * S, py + c[1] * S);
        cx.font = "700 " + d.shape.fs + "px Roboto, Arial, sans-serif";
        cx.textAlign = "center";
        cx.textBaseline = "middle";
        cx.fillStyle = "rgba(255,255,255," + Math.min(1, n[2] * 1.4) + ")";
        cx.shadowColor = "rgba(0,0,0,0.6)";
        cx.shadowBlur = 2;
        cx.fillText(d.fl ? d.fl[it.fi] : f.label, 0, 0);
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
    atual.objs = [];
    var evitar = [];
    atual.dados.forEach(function (dd, i) {
      var d = spawn(dd.kind, dd.value, i * 0.07);
      d.etapa = atual;
      atual.objs.push(d);
      if (atual.agitar) {
        d.fase = "agitar";
        d.fimEm = d.t0 + atual.agitar;
        d.shakeStart = now;
        d.wt = [0, 0, 0];
        ancoraBaixo(d);
        d.x = d.ax;
        d.y = d.ay;
        d.h = 40;
        var sondas = [0, 1, 2].map(function () { var r = simular(d.shape, d.R, inicioCopo(d)); return (r.n - 1) * r.dt; }).sort();
        d.shakeEnd = Math.max(now + 150, d.fimEm - sondas[1] * 1000 - 300);
      } else {
        lancarFisico(d, function () { return inicioLivre(d, atual.orig); }, evitar);
        d.tl = d.t0;
        d.fimEm = d.t0 + (d.traj.n - 1) * d.traj.dt * 1000;
        aplicarFrame(d, 0, 0);
      }
    });
    atual.fim = atual.objs.reduce(function (m, o) { return Math.max(m, o.fimEm); }, 0);
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
