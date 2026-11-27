let ACTIVE_VIEW = "character";
function switchView(view) {
  ACTIVE_VIEW = view;
  S.modal = null;
  ITEM_QUERY = "";
  MONSTER_QUERY = "";
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
