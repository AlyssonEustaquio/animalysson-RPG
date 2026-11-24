const spent = () => AB.reduce((t, a) => t + COST[S.pb[a]], 0);
function base(a) {
  return S.method === "std" || S.method === "rnd" ? S.std[a] ?? 10 : S.method === "pb" ? S.pb[a] : S.man[a];
}
function bonus(a) {
  if (S.bg === null) return 0;
  const b = BG[S.bg];
  if (!b.a.includes(a)) return 0;
  return S.mode === "111" ? 1 : a === S.p2 ? 2 : a === S.p1 ? 1 : 0;
}
const score = (a) => Math.min(20, base(a) + bonus(a));
function pool() {
  return S.method === "std" ? STD : S.rolled;
}
function stdOk() {
  const p = pool().slice().sort().join(), v = AB.map((a) => S.std[a]);
  return v.every(Boolean) && v.slice().sort().join() === p;
}
function set(k, v) {
  S[k] = v;
  if (k === "method") S.std = {};
  if (k === "cls") S.skills = [];
  if (k === "bg") {
    S.p2 = "";
    S.p1 = "";
  }
  render();
}
function mapset(m, a, v) {
  S[m][a] = +v;
  render();
}
function pm(a, d) {
  const n = S.pb[a] + d;
  if (n < 8 || n > 15) return;
  S.pb[a] = n;
  render();
}
function togSkill(k) {
  if (S.cls === null) return;
  const i = S.skills.indexOf(k);
  if (i >= 0) S.skills.splice(i, 1);
  else if (S.skills.length < CL[S.cls].k) S.skills.push(k);
  render();
}
function sel(id, opts, cur, fn, ph) {
  return `<select id="${id}" onchange="${fn}"><option value="">${ph}</option>` + opts.map((o) => `<option value="${o[0]}"${String(o[0]) === String(cur) ? " selected" : ""}>${o[1]}</option>`).join("") + "</select>";
}
function bgSk() {
  return S.bg === null ? [] : BG[S.bg].s;
}
function roll6() {
  const r = () => {
    const d = [1, 2, 3, 4].map(() => {
    const v = 1 + Math.floor(Math.random() * 6);
    if (window.Dados3D) window.Dados3D.lancar(6, v);
    return v;
  }).sort((x, y) => x - y);
    return d[1] + d[2] + d[3];
  };
  S.rolled = [0, 0, 0, 0, 0, 0].map(r).sort((x, y) => y - x);
  S.std = {};
  render();
}
function suggest() {
  if (S.cls === null) return;
  const t = SUG[CL[S.cls].n];
  if (!t) return;
  AB.forEach((a, i) => S.std[a] = t[i]);
  render();
}
