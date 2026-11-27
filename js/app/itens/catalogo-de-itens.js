let ITEM_QUERY = "";
let ITEM_CATEGORY = "Todas";
let SELECTED_ITEM_INDEX = 0;
function itemCategoryList() {
  return ["Todas"].concat(Array.from(new Set((ITEMS || []).map(function(x) {
    return x.categoria || "Outros";
  }))).sort(function(a, b) {
    return a.localeCompare(b, "pt-BR");
  }));
}
function filteredItems() {
  const q = norm(ITEM_QUERY);
  return (ITEMS || []).map(function(item, index) {
    return { item, index };
  }).filter(function(row) {
    const x = row.item;
    const text = norm([x.n, x.en, x.categoria, x.tipo, x.raridade, x.preco, x.peso, x.descricao, x.uso, x.propriedades, x.maestria].filter(Boolean).join(" "));
    return (!q || text.includes(q)) && (ITEM_CATEGORY === "Todas" || (x.categoria || "Outros") === ITEM_CATEGORY);
  });
}
function renderItemCard(row) {
  const x = row.item, mag = x.magico ? "Mágico" : "Equipamento";
  const price = x.magico ? magicPriceByRarity(x) : x.preco || "Preço não informado";
  const weight = x.peso || "Peso não especificado";
  return `<button class="catalog-card${row.index === SELECTED_ITEM_INDEX ? " sel" : ""}" onclick="selectItem(${row.index})"><div class="card-topline"><span class="card-icon">${itemIcon(x)}</span><span class="card-tag">${escHtml(x.raridade || x.categoria || mag)}</span></div><strong>${escHtml(x.n || x.en || "Item")}</strong><small>${escHtml(x.en || x.tipo || "")}</small><div class="card-stats"><span>${escHtml(formatItemPrice(price))}</span><span>${escHtml(formatItemWeight(weight))}</span></div></button>`;
}
function renderItemDetail(index) {
  const x = ITEMS[index];
  if (!x) return '<div class="empty-state">Selecione um item para ver seus dados.</div>';
  const price = x.magico ? magicPriceByRarity(x) : x.preco || "Não informado";
  const weight = x.peso || "Não especificado";
  let h = `<div class="card-topline"><span class="card-icon">${itemIcon(x)}</span><span class="card-tag">${escHtml(x.raridade || x.categoria || "Item")}</span></div><h2 style="margin-top:10px">${escHtml(x.n || x.en)}</h2><p class="detail-sub">${escHtml(x.en || "")}</p><button class="btn alt" style="margin:6px 0 10px" onclick="addToInventory(${index},this)">Adicionar ao inventário</button>`;
  h += `<div class="detail-grid"><div class="detail-stat"><b>${escHtml(formatItemPrice(price))}</b><small>Preço / valor</small></div><div class="detail-stat"><b>${escHtml(formatItemWeight(weight))}</b><small>${String(weight).startsWith("Carga") ? "Capacidade de carga" : "Peso"}</small></div><div class="detail-stat"><b>${escHtml(x.raridade || (x.magico ? "Não informado" : "—"))}</b><small>Raridade</small></div></div>`;
  if (x.tipo) h += `<div class="detail-line"><b>Tipo:</b> ${escHtml(x.tipo)}</div>`;
  if (x.dano) h += `<div class="detail-line"><b>Dano:</b> ${escHtml(x.dano)}</div>`;
  if (x.propriedades) {
    h += `<div class="detail-line"><b>Propriedades:</b> ${escHtml(x.propriedades)}</div>`;
    h += weaponPropertyExplanation(x);
  }
  if (x.maestria) {
    const mastery = x.maestriaDescricao || weaponMasteryExplanation(x.maestria);
    h += `<div class="detail-line"><b>Maestria:</b> ${escHtml(x.maestria)}${mastery ? " — " + escHtml(mastery) : ""}</div>`;
  }
  if (x.classeArmadura) h += `<div class="detail-line"><b>Classe de Armadura:</b> ${escHtml(x.classeArmadura)}</div>`;
  if (x.forcaMinima && x.forcaMinima !== "—") h += `<div class="detail-line"><b>Força mínima:</b> ${escHtml(x.forcaMinima)}</div>`;
  if (x.furtividade && x.furtividade !== "—") h += `<div class="detail-line"><b>Furtividade:</b> ${escHtml(x.furtividade)}</div>`;
  if (x.tempoVestir) h += `<div class="detail-line"><b>Tempo para vestir:</b> ${escHtml(x.tempoVestir)}</div>`;
  if (x.habilidade) h += `<div class="detail-line"><b>Atributo:</b> ${escHtml(x.habilidade)}</div>`;
  if (x.sintonia) h += `<div class="detail-line"><b>Sintonia:</b> ${escHtml(x.sintonia)}</div>`;
  if (x.cargas) h += `<div class="detail-line"><b>Cargas:</b> ${escHtml(x.cargas)}</div>`;
  if (x.duracao) h += `<div class="detail-line"><b>Duração:</b> ${escHtml(x.duracao)}</div>`;
  h += `<section class="item-description"><h3>Descrição e utilização</h3><p>${escHtml(x.descricao || "Descrição ainda não disponível neste registro.")}</p>`;
  if (x.uso && !x.magico && x.uso !== x.descricao) h += `<p><b>Uso:</b> ${escHtml(x.uso)}</p>`;
  h += "</section>";
  if (x.nota && !x.magico) h += `<div class="detail-note">${escHtml(x.nota)}</div>`;
  return h;
}
function updateItemResults() {
  const rows = filteredItems();
  const count = document.getElementById("items-count");
  const grid = document.getElementById("items-grid");
  const detail = document.getElementById("item-detail");
  if (rows.length && !rows.some(function(row) {
    return row.index === SELECTED_ITEM_INDEX;
  })) SELECTED_ITEM_INDEX = rows[0].index;
  if (count) count.textContent = rows.length + " de " + (ITEMS || []).length + " itens";
  if (grid) grid.innerHTML = rows.length ? rows.map(renderItemCard).join("") : '<div class="empty-state">Nenhum item encontrado.</div>';
  if (detail) detail.innerHTML = renderItemDetail(SELECTED_ITEM_INDEX);
}
function selectItem(index) {
  SELECTED_ITEM_INDEX = index;
  updateItemResults();
}
function itemSearch(value) {
  ITEM_QUERY = value;
  updateItemResults();
}
function itemCategory(value) {
  ITEM_CATEGORY = value;
  updateItemResults();
}
function renderItemsPage() {
  const cats = itemCategoryList();
  let h = `<div class="catalog-head"><div><h2>Itens</h2><p>Explore armas, armaduras, equipamentos e itens mágicos.</p></div><span class="card-tag">${(ITEMS || []).length} registros</span></div><div class="catalog-tools"><input type="search" placeholder="Buscar por nome, tipo ou raridade…" value="${escHtml(ITEM_QUERY)}" oninput="itemSearch(this.value)"><select onchange="itemCategory(this.value)">${cats.map((c) => `<option value="${escHtml(c)}"${c === ITEM_CATEGORY ? " selected" : ""}>${escHtml(c)}</option>`).join("")}</select></div><div class="catalog-count" id="items-count"></div><div class="catalog-layout"><section><div class="catalog-grid" id="items-grid"></div></section><aside class="catalog-detail" id="item-detail"></aside></div>`;
  document.getElementById("app").innerHTML = h;
  updateItemResults();
  renderModal();
}
