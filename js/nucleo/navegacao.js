let ACTIVE_VIEW = "character";
function setRail(open) {
  const slot = document.getElementById("rail-slot"), btn = document.getElementById("rail-toggle");
  if (!slot || !btn) return;
  slot.classList.toggle("collapsed", !open);
  btn.textContent = open ? ">" : "<";
  btn.title = open ? "Esconder seções" : "Mostrar seções";
  btn.setAttribute("aria-label", btn.title);
  btn.setAttribute("aria-expanded", open ? "true" : "false");
}
function toggleRail() {
  const slot = document.getElementById("rail-slot");
  setRail(!!(slot && slot.classList.contains("collapsed")));
}
function switchView(view) {
  ACTIVE_VIEW = view;
  S.modal = null;
  ITEM_QUERY = "";
  MONSTER_QUERY = "";
  setRail(false);
  render();
}
function updateTabs() {
  ["character", "items", "inventory", "monsters", "maps"].forEach(function(v) {
    const el = document.getElementById("tab-" + v);
    if (el) el.classList.toggle("on", ACTIVE_VIEW === v);
  });
}
function render() {
  const appEl = document.getElementById("app");
  if (appEl) appEl.className = "view-" + ACTIVE_VIEW;
  updateTabs();
  if (ACTIVE_VIEW !== "maps" && window.MapEditor) window.MapEditor.unmount();
  if (ACTIVE_VIEW === "maps") {
    renderMapsPage();
    return;
  }
  if (ACTIVE_VIEW === "character") renderCharacterPage();
  else if (ACTIVE_VIEW === "items") renderItemsPage();
  else if (ACTIVE_VIEW === "inventory") renderInventoryPage();
  else renderMonstersPage();
}
