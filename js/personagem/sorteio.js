function rSp() {
  S.sp = Math.floor(Math.random() * SP.length);
}
function rCls() {
  S.cls = Math.floor(Math.random() * CL.length);
  S.skills = [];
}
function rBg() {
  S.bg = Math.floor(Math.random() * BG.length);
  S.mode = Math.random() < 0.5 ? "21" : "111";
  const t = shuf(BG[S.bg].a);
  S.p2 = t[0];
  S.p1 = t[1];
}
function rAtr() {
  if (S.method === "std") {
    const v = shuf(STD);
    S.std = {};
    AB.forEach((a, i) => S.std[a] = v[i]);
  } else if (S.method === "rnd") {
    S.rolled = [0, 0, 0, 0, 0, 0].map(d4).sort((x, y) => y - x);
    const v = shuf(S.rolled);
    S.std = {};
    AB.forEach((a, i) => S.std[a] = v[i]);
  } else if (S.method === "pb") {
    AB.forEach((a) => S.pb[a] = 8);
    let pts = 27;
    for (let g = 0; g < 300; g++) {
      const a = pick(AB), n = S.pb[a] + 1;
      if (n <= 15 && COST[n] - COST[S.pb[a]] <= pts) {
        pts -= COST[n] - COST[S.pb[a]];
        S.pb[a] = n;
      }
    }
  } else AB.forEach((a) => S.man[a] = d4());
}
function rPer() {
  if (S.cls === null) return;
  const c = CL[S.cls];
  S.skills = shuf(c.l.filter((k) => !bgSk().includes(k))).slice(0, c.k);
}
function rDet() {
  S.align = pick(ALN.slice(0, 6));
  S.lang = shuf(LANG).slice(0, 2);
}
function rand() {
  const f = [rSp, rCls, rBg, rAtr, rPer, rDet];
  f.forEach((g) => g());
  render();
}
