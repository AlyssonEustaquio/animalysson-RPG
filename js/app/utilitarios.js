const mod = (s) => Math.floor((s - 10) / 2), fmt = (n) => (n >= 0 ? "+" : "") + n;
function norm(s) {
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuf = (a) => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const d4 = () => {
  const d = [1, 2, 3, 4].map(() => {
    const v = 1 + Math.floor(Math.random() * 6);
    if (window.Dados3D) window.Dados3D.lancar(6, v);
    return v;
  }).sort((x, y) => x - y);
  return d[1] + d[2] + d[3];
};
function escHtml(value) {
  return String(value === void 0 || value === null ? "" : value).replace(/[&<>"']/g, function(ch) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
  });
}
