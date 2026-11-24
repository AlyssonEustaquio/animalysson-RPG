(function () {
  if (window.Dados3D) return;
  var PHI = (1 + Math.sqrt(5)) / 2;
  var G = 1900;
  var MAX_DICE = 26;
  var cv = null, cx = null, dice = [], raf = null, last = 0, W = 0, H = 0, dpr = 1;
  var burstAt = 0, burstN = 0, holdAte = 0, shakeAte = 0;
  var shapes = {};
  var filaRolagens = Promise.resolve();
  var painelResultados = null;
  var historicoResultados = [];
  var LIGHT = [-0.35, -0.5, 0.8];
  var COLORS = { 4: [67, 160, 71], 6: [211, 47, 47], 8: [30, 136, 229], 10: [142, 68, 173], 12: [239, 140, 20], 20: [0, 137, 123], tens: [94, 53, 177] };

  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  // Sorteio uniforme antes da animação, como na referência do Club Martech.
  // A amostragem por rejeição evita o viés de usar simplesmente resto (%) do uint32.
  function inteiroAleatorio(max) {
    max = Math.floor(Number(max));
    if (!isFinite(max) || max < 1) throw new Error("Limite de sorteio inválido.");
    if (window.crypto && typeof window.crypto.getRandomValues === "function") {
      var limite = Math.floor(4294967296 / max) * max;
      var buffer = new Uint32Array(1);
      var valor;
      do {
        window.crypto.getRandomValues(buffer);
        valor = buffer[0];
      } while (valor >= limite);
      return (valor % max) + 1;
    }
    return Math.floor(Math.random() * max) + 1;
  }

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
  function qrandom() {
    // Amostragem uniforme de orientações (Shoemake), sem escolher uma face-alvo.
    var u1 = Math.random(), u2 = Math.random(), u3 = Math.random();
    return [
      Math.sqrt(1 - u1) * Math.sin(2 * Math.PI * u2),
      Math.sqrt(1 - u1) * Math.cos(2 * Math.PI * u2),
      Math.sqrt(u1) * Math.sin(2 * Math.PI * u3),
      Math.sqrt(u1) * Math.cos(2 * Math.PI * u3)
    ];
  }

  function valorDoRotulo(kind, label) {
    var limpo = String(label).replace(/\./g, "");
    if (kind === 10 && limpo === "0") return 10;
    if (kind === "tens" && limpo === "00") return 0;
    return Number(limpo);
  }

  function orientacaoDoResultado(kind, value, shape) {
    var faceAlvo = null;
    for (var i = 0; i < shape.faces.length; i++) {
      if (valorDoRotulo(kind, shape.faces[i].label) === Number(value)) {
        faceAlvo = shape.faces[i];
        break;
      }
    }
    if (!faceAlvo) return qrandom();
    // Face sorteada voltada para cima, com giro aleatório em torno do eixo vertical.
    var alinhamento = qFromTo(faceAlvo.n, [0, 0, 1]);
    var torcao = rnd(0, Math.PI * 2);
    return qnorm(qmul([0, 0, Math.sin(torcao / 2), Math.cos(torcao / 2)], alinhamento));
  }

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

  function origemDoLancamento(origin, R) {
    var x = W / 2, y = H - R * 1.5;
    if (origin && typeof origin.getBoundingClientRect === "function") {
      var rect = origin.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if (origin && isFinite(Number(origin.x)) && isFinite(Number(origin.y))) {
      x = Number(origin.x);
      y = Number(origin.y);
    }
    return {
      x: Math.max(R, Math.min(W - R, x)),
      y: Math.max(R, Math.min(H - R, y))
    };
  }

  function spawn(kind, delay, options, resolve, onStop, targetValue) {
    options = options || {};
    var shape = getShape(kind);
    var R = Math.max(20, Math.min(40, Math.min(W, H) * 0.055));
    var origin = origemDoLancamento(options.origem || options.origin || options.element || options.source, R);
    var sx = origin.x, sy = origin.y;
    var tx = rnd(W * 0.15, W * 0.85), ty = rnd(H * 0.22, H * 0.68);
    var dx = tx - sx, dy = ty - sy, dist = Math.hypot(dx, dy) || 1;
    var speed = dist * 3.1 * rnd(0.85, 1.15);
    var ang = Math.atan2(dy, dx) + rnd(-0.12, 0.12);
    var color = COLORS[kind === "units" ? 10 : kind];

    // Um dado reservado pelo modo de agitação pode ser reaproveitado, mas
    // nunca recebe uma face ou resultado pré-definido.
    for (var pi = 0; pi < dice.length; pi++) {
      if (!dice[pi].pend) continue;
      var c = dice[pi];
      c.pend = false;
      c.kind = kind;
      c.shape = shape;
      c.color = color;
      c.R = R;
      c.x = sx;
      c.y = sy;
      c.h = 90;
      c.vx = Math.cos(ang) * speed;
      c.vy = Math.sin(ang) * speed;
      c.vz = rnd(600, 850);
      c.q = qrandom();
      c.qt = orientacaoDoResultado(kind, targetValue, shape);
      c.targetValue = targetValue;
      c.w = [rnd(-1, 1) * 22, rnd(-1, 1) * 22, rnd(-1, 1) * 22];
      c.age = 0;
      c.done = false;
      c.doneAt = 0;
      c.alpha = 1;
      c.calm = false;
      c.delay = delay;
      c.resolve = resolve;
      c.onStop = onStop;
      c.resultShown = false;
      c.notified = false;
      c.resolved = false;
      c.grace = 0;
      c.born = Date.now();
      c.phase = "throw";
      return c;
    }

    var nd = {
      kind: kind, shape: shape, R: R, delay: delay, x: sx, y: sy, h: 90,
      vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed, vz: rnd(600, 850),
      q: qrandom(), qt: orientacaoDoResultado(kind, targetValue, shape),
      targetValue: targetValue,
      w: [rnd(-1, 1) * 22, rnd(-1, 1) * 22, rnd(-1, 1) * 22],
      age: 0, done: false, doneAt: 0, alpha: 1, color: color,
      hold: holdAte > Date.now() ? holdAte : 0, calm: false, pend: false,
      grace: 0, born: Date.now(), phase: holdAte > Date.now() ? "shake" : "throw",
      shakeEnd: shakeAte, shakeStart: Date.now(), st: 0, swt: 0,
      ph: rnd(0, Math.PI * 2), dir: 1, resolve: resolve, onStop: onStop,
      resultShown: false, notified: false, resolved: false
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

  function valorDaFaceSuperior(d) {
    var melhor = null, maiorZ = -Infinity;
    d.shape.faces.forEach(function (face) {
      var z = rot(d.q, face.n)[2];
      if (z > maiorZ) { maiorZ = z; melhor = face; }
    });
    if (!melhor) return NaN;
    var label = String(melhor.label).replace(/\./g, "");
    var value = Number(label);
    if (d.kind === 10 && label === "0") return 10;
    if (d.kind === "tens" && label === "00") return 0;
    return value;
  }

  function obterPainelResultados() {
    if (painelResultados || !document || !document.body) return painelResultados;
    painelResultados = document.createElement("div");
    painelResultados.id = "dados3d-resultados";
    painelResultados.setAttribute("role", "status");
    painelResultados.setAttribute("aria-live", "polite");
    painelResultados.style.cssText = [
      "position:fixed", "left:50%", "bottom:22px", "transform:translateX(-50%)",
      "z-index:100001", "padding:10px 16px", "border-radius:12px",
      "background:rgba(18,22,30,.94)", "border:1px solid rgba(255,255,255,.25)",
      "box-shadow:0 8px 28px rgba(0,0,0,.35)", "color:#fff",
      "font:700 16px/1.35 Roboto,Arial,sans-serif", "text-align:center",
      "pointer-events:none", "white-space:pre-line", "max-width:90vw"
    ].join(";");
    document.body.appendChild(painelResultados);
    return painelResultados;
  }

  function registrarLinhaResultado(linha) {
    historicoResultados.push(linha);
    if (historicoResultados.length > 5) historicoResultados.shift();
    var painel = obterPainelResultados();
    if (painel) painel.textContent = historicoResultados.join("\n");
  }

  function mostrarResultado(tipo, valor, options) {
    registrarLinhaResultado(tipo + " = " + valor);
    if (typeof window.CustomEvent === "function") {
      window.dispatchEvent(new window.CustomEvent("dados3d:resultado", {
        detail: { dado: tipo, resultado: valor }
      }));
    }
    if (options && typeof options.onResult === "function") {
      try { options.onResult(valor, tipo); } catch (e) { setTimeout(function () { throw e; }, 0); }
    }
  }

  function mostrarResumo(titulo, detalhe, total) {
    var linha = total === undefined ? (titulo + ": " + detalhe) : (titulo + ": " + detalhe + " = " + total);
    registrarLinhaResultado(linha);
    if (typeof window.CustomEvent === "function") {
      window.dispatchEvent(new window.CustomEvent("dados3d:resumo", {
        detail: { titulo: titulo, detalhe: detalhe, total: total }
      }));
    }
  }

  function concluirRolagem(d) {
    if (d.resolved) return;
    // O valor já foi sorteado de forma uniforme; a física faz o dado repousar
    // com essa face para cima, em vez de girar artificialmente depois de parar.
    d.resolved = true;
    d.result = isFinite(Number(d.targetValue)) ? Number(d.targetValue) : valorDaFaceSuperior(d);
    if (!d.resultShown) {
      d.resultShown = true;
      if (typeof d.onStop === "function") d.onStop(d.result);
    }
  }

  function entregarResultadoQuandoSumir(d) {
    if (!d.notified && d.resolved && d.alpha <= 0) {
      d.notified = true;
      if (typeof d.resolve === "function") d.resolve(d.result);
    }
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
    if (holding) {
      var remS = (d.hold - Date.now()) / 1000;
      if (d.h === 0 && remS < 0.7) d.w = mul(d.w, Math.exp(-dt * 1.5));
    } else if (!d.pend && d.h === 0 && speed < 130) {
      // Atrito de contato: desacelera a rotação enquanto a face sorteada
      // se acomoda durante o rolamento, não depois que o dado já parou.
      d.w = mul(d.w, Math.exp(-3.8 * dt));
    }
    var angularSpeed = Math.hypot(d.w[0], d.w[1], d.w[2]);
    if (!holding && !d.pend && d.qt && d.h === 0) {
      var taxaAcomodacao = 0.9 + 2.1 * (1 - Math.min(1, angularSpeed / 18));
      d.q = qnlerp(d.q, d.qt, 1 - Math.exp(-taxaAcomodacao * dt));
    }
    if (!d.done && !holding && !d.pend && d.h === 0 && speed < 5 && angularSpeed < 0.12) {
      d.done = true;
      d.doneAt = 0;
      concluirRolagem(d);
    }
    if (!d.done && !holding && !d.pend && d.age > 9) {
      d.done = true;
      d.vx = d.vy = d.vz = 0;
      d.w = [0, 0, 0];
      d.h = 0;
      if (d.qt) d.q = d.qt;
      d.doneAt = 0;
      concluirRolagem(d);
    }
    if (d.done) {
      d.doneAt += dt;
      if (d.doneAt > 2.6) d.alpha = Math.max(0, 1 - (d.doneAt - 2.6) / 0.6);
      entregarResultadoQuandoSumir(d);
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
    if (d.delay > 0) return;
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

  function lancarImediato(sides, options) {
    sides = Number(sides);
    // Compatibilidade com chamadas antigas lancar(lados, valor): o segundo
    // argumento numérico não é aceito como resultado; o sorteio é independente.
    if (!options || typeof options !== "object") options = {};
    if ([4, 6, 8, 10, 12, 20, 100].indexOf(sides) < 0) {
      return Promise.reject(new Error("Tipo de dado não suportado: d" + sides));
    }
    return new Promise(function (resolve, reject) {
      try {
        ensure();
        if (dice.length >= MAX_DICE && !dice.some(function (x) { return x.pend; })) {
          reject(new Error("Limite de dados simultâneos atingido."));
          return;
        }
        if (sides === 100) {
          var target = inteiroAleatorio(100);
          var tens = target === 100 ? 0 : Math.floor(target / 10) * 10;
          var units = target === 100 ? 0 : target % 10;
          var stopped = [false, false], completed = [false, false];
          var values = [tens, units];
          function onPartStop(index, value) {
            values[index] = value;
            stopped[index] = true;
            if (stopped[0] && stopped[1]) mostrarResultado("d100", target, options);
          }
          function onPartFade(index, value) {
            values[index] = value;
            completed[index] = true;
            if (completed[0] && completed[1]) resolve(target);
          }
          spawn("tens", 0, options, function (v) { onPartFade(0, v); }, function (v) { onPartStop(0, v); }, tens);
          spawn("units", 0.04, options, function (v) { onPartFade(1, v); }, function (v) { onPartStop(1, v); }, units);
        } else {
          var targetValue = inteiroAleatorio(sides);
          spawn(sides, 0, options, resolve, function (value) {
            mostrarResultado("d" + sides, value, options);
          }, targetValue);
        }
        start();
      } catch (e) {
        reject(e);
      }
    });
  }

  function lancar(sides, options) {
    var executar = function () { return lancarImediato(sides, options); };
    // Serializa chamadas simultâneas: uma jogada termina antes da próxima começar.
    var proxima = filaRolagens.then(executar, executar);
    filaRolagens = proxima.then(function () {}, function () {});
    return proxima;
  }

  async function lancarVarios(quantidade, lados, options) {
    quantidade = Math.floor(Number(quantidade));
    if (!isFinite(quantidade) || quantidade < 1 || quantidade > 100) {
      throw new Error("Quantidade de dados inválida (use de 1 a 100)." );
    }
    var resultados = [];
    for (var i = 0; i < quantidade; i++) {
      // Espera a rolagem atual terminar antes de lançar a próxima.
      resultados.push(await lancar(lados, options || {}));
    }
    var total = resultados.reduce(function (a, b) { return a + b; }, 0);
    mostrarResumo(quantidade + "d" + Number(lados), resultados.join(" + "), total);
    return { quantidade: quantidade, lados: Number(lados), resultados: resultados, total: total };
  }

  async function rolarFormula(formula, options) {
    var texto = String(formula || "").replace(/\s+/g, "");
    var partes = texto.match(/[+-]?[^+-]+/g);
    if (!partes || partes.join("") !== texto) throw new Error("Fórmula de dano inválida: " + formula);
    var termos = [], total = 0;
    for (var i = 0; i < partes.length; i++) {
      var parte = partes[i], sinal = 1;
      if (parte.charAt(0) === "-") { sinal = -1; parte = parte.slice(1); }
      else if (parte.charAt(0) === "+") parte = parte.slice(1);
      var match = parte.match(/^(\d*)d(4|6|8|10|12|20|100)$/i);
      if (match) {
        var qtd = match[1] ? Number(match[1]) : 1;
        var lados = Number(match[2]);
        var bloco = await lancarVarios(qtd, lados, options || {});
        termos.push({ formula: (sinal < 0 ? "-" : "") + parte, resultados: bloco.resultados, total: bloco.total * sinal });
        total += bloco.total * sinal;
      } else if (/^\d+$/.test(parte)) {
        var fixo = Number(parte) * sinal;
        termos.push({ formula: (sinal < 0 ? "-" : "") + parte, resultados: [], total: fixo });
        total += fixo;
      } else {
        throw new Error("Termo de dado inválido: " + parte);
      }
    }
    var detalhe = termos.map(function (termo) {
      return termo.formula + (termo.resultados.length ? " [" + termo.resultados.join(", ") + "]" : "");
    }).join(" ");
    mostrarResumo(texto, detalhe, total);
    return { formula: texto, termos: termos, total: total };
  }

  async function rolarIniciativa(participantes, options) {
    if (!Array.isArray(participantes) || !participantes.length) return [];
    var resultados = [];
    for (var i = 0; i < participantes.length; i++) {
      var participante = participantes[i] || {};
      var opts = Object.assign({}, options || {});
      opts.origem = participante.origem || participante.elemento || opts.origem;
      var dado = await lancar(20, opts);
      var bonus = Number(participante.bonus || participante.modificador || 0);
      resultados.push({ participante: participante.nome || participante.id || ("Participante " + (i + 1)), dado: dado, bonus: bonus, total: dado + bonus });
    }
    resultados.sort(function (a, b) { return b.total - a.total; });
    mostrarResumo("Iniciativa", resultados.map(function (r) { return r.participante + " " + r.total; }).join(" | "));
    return resultados;
  }

  async function rolarAtaque(options) {
    options = options || {};
    var quantidade = Number(options.quantidadeD20 || options.d20 || 1);
    if (quantidade !== 1 && quantidade !== 2) throw new Error("Ataque deve rolar 1 ou 2d20.");
    var valores = [];
    for (var i = 0; i < quantidade; i++) valores.push(await lancar(20, options));
    var dados = { quantidade: quantidade, lados: 20, resultados: valores, total: valores.reduce(function (a, b) { return a + b; }, 0) };
    var escolhido = options.modo === "desvantagem" ? Math.min.apply(Math, dados.resultados) : Math.max.apply(Math, dados.resultados);
    var bonus = Number(options.bonus || options.modificador || 0);
    var total = escolhido + bonus;
    var ca = Number(options.ca);
    var temCA = isFinite(ca);
    var acerto = temCA ? (escolhido === 20 ? true : escolhido === 1 ? false : total >= ca) : null;
    mostrarResumo("Ataque", dados.resultados.join(" / ") + " → usado " + escolhido + (bonus ? (" + bônus " + bonus) : "") + (temCA ? (acerto ? " • ACERTO" : " • ERRO") : ""), total);
    return {
      resultados: dados.resultados,
      escolhido: escolhido,
      bonus: bonus,
      total: total,
      ca: temCA ? ca : null,
      acerto: acerto,
      critico: escolhido === 20,
      falhaCritica: escolhido === 1
    };
  }

  async function executarAtaque(options) {
    options = options || {};
    if (options.ca == null || !isFinite(Number(options.ca))) {
      throw new Error("Informe a Classe de Armadura (CA) do alvo para resolver o acerto.");
    }
    var ataque = await rolarAtaque(options);
    if (!ataque.acerto) {
      mostrarResumo("Dano", "não rolado: ataque errou");
      return { ataque: ataque, dano: null, acertou: false };
    }
    var dano = options.dano ? await rolarFormula(options.dano, options) : null;
    if (dano) mostrarResumo("Dano aplicado", options.dano, dano.total);
    return { ataque: ataque, dano: dano, acertou: true };
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
      list.forEach(function (d) {
        d.hold = until;
        d.calm = false;
        d.done = false;
        d.doneAt = 0;
        d.grace = 0;
        d.alpha = 1;
        d.delay = 0;
        if (d.phase === "throw") return;
        d.phase = "shake";
        d.shakeEnd = shakeAte;
        if (d.ax === undefined) ancoraBaixo(d);
      });
      if (!list.length && dice.length < MAX_DICE) {
        var p = spawn(20, 0, {}, null, null, 20);
        p.pend = true;
        p.hold = until;
        p.phase = "shake";
        p.shakeEnd = shakeAte;
      }
      start();
    } catch (e) {
    }
  }

  window.Dados3D = {
    lancar: lancar,
    lancarVarios: lancarVarios,
    rolarFormula: rolarFormula,
    rolarIniciativa: rolarIniciativa,
    rolarAtaque: rolarAtaque,
    executarAtaque: executarAtaque,
    segurar: segurar
  };
})();
