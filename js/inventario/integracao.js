function invMov() {
  const sp = S.sp !== null ? SP[S.sp] : null;
  if (!sp) return null;
  const m = String(sp.mov || "9 m").match(/\d+(?:[.,]\d+)?/);
  return m ? parseFloat(m[0].replace(",", ".")) : 9;
}
function invCtx() {
  return { FOR: score("FOR"), DES: score("DES"), CON: score("CON"), SAB: score("SAB"), pb: 2, classe: S.cls !== null ? CL[S.cls].n : "", tamanho: S.sp !== null ? SP[S.sp].sz : "Médio", deslocamento: invMov() };
}
const INV_OPTS = { chaveLocal: "animalysson-inventario", getCtx: invCtx, catalogo: null };
function invStats() {
  if (!window.Inventario) return null;
  Inventario.carregar(S, INV_OPTS);
  return Inventario.estatisticas(S, invCtx());
}
function equippedAttacksHtml() {
  const st = invStats();
  if (!st || !st.ataques.length) return "";
  return st.ataques.map(function(a) {
    return "<p><b>" + escHtml(a.nome) + "</b>: " + (a.acerto >= 0 ? "+" : "") + a.acerto + " para acertar" + (a.dano ? " · " + escHtml(a.dano) : "") + (a.maestria ? " · Maestria: " + escHtml(a.maestria) : "") + "</p>";
  }).join("");
}
function movFicha(sp) {
  if (!sp) return "—";
  const st = invStats();
  const base2 = sp.mov || "9 m";
  if (!st) return base2;
  if (st.montaria && st.montaria.deslocamento) return String(st.montaria.deslocamento).replace(".", ",") + " m (montado)";
  if (st.penalidadeDeslocamento) {
    const n = invMov() - st.penalidadeDeslocamento;
    return String(n).replace(".", ",") + " m (−" + st.penalidadeDeslocamento + ")";
  }
  return base2;
}
function addToInventory(index, btn) {
  const x = ITEMS[index];
  if (!x || !window.Inventario) return;
  Inventario.adicionarDireto(S, Inventario.deCatalogo(x), INV_OPTS);
  if (btn) {
    const old = btn.textContent;
    btn.textContent = "Adicionado ✓";
    btn.disabled = true;
    setTimeout(function() {
      btn.textContent = old;
      btn.disabled = false;
    }, 1400);
  }
}
function renderInventoryPage() {
  const app = document.getElementById("app");
  if (!window.Inventario) {
    app.innerHTML = '<div class="empty-state">inventario.js não encontrado.</div>';
    return;
  }
  if (!INV_OPTS.catalogo) {
    const vistos = /* @__PURE__ */ new Set(), todos = [];
    ITEMS.concat(Array.isArray(MAGIC_ITEMS) ? MAGIC_ITEMS.map(function(m) {
      return Object.assign({ magico: true }, m);
    }) : []).forEach(function(x) {
      const k = norm((x.n || "") + "|" + (x.en || ""));
      if (vistos.has(k)) return;
      vistos.add(k);
      todos.push(Inventario.deCatalogo(x));
    });
    INV_OPTS.catalogo = todos;
  }
  app.innerHTML = '<div id="inv-host"></div>';
  Inventario.montar(document.getElementById("inv-host"), S, INV_OPTS);
}
