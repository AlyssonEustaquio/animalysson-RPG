function mapInventoryOptions() {
    var base = typeof INV_OPTS !== "undefined" ? INV_OPTS : { chaveLocal: "animalysson-inventario" };
    var options = Object.assign({}, base, { modo: appMode });
    options.aoMudar = function() {
      if (typeof creativeInvalidateTorchCache === "function") creativeInvalidateTorchCache();
      if (R && cv) {
        draw();
        updateCombatPanelUi();
        if (typeof creativeUpdateLevelUi === "function") creativeUpdateLevelUi();
      }
    };
    options.estadoTocha = function(item) {
      return typeof creativeTorchStatus === "function" ? creativeTorchStatus(item) : { lit: !!item.tochaAcesa, burned: !!item.tochaQueimada, remainingMs: Number(item.tochaRestanteMs) || 0 };
    };
    options.formatarTempoTocha = function(ms) {
      return typeof creativeFormatTorchTime === "function" ? creativeFormatTorchTime(ms) : "";
    };
    options.aoAlternarTocha = function(item, acender) {
      return typeof creativeSetTorchItemState === "function" && creativeSetTorchItemState(item, acender) === true;
    };
    options.aoAlternarMontaria = function(montaria) {
      if (!combatActive()) return false;
      combatToggleMount(currentPlayer(), montaria && montaria.id);
      return true;
    };
    options.aoAlternarControleMontaria = function() {
      if (!combatActive()) return false;
      combatToast("O controle da montaria só pode ser alterado fora do combate.");
      return true;
    };
    return options;
  }
function mountMapInventory(force) {
    if (!R || typeof Inventario === "undefined" || typeof S === "undefined" || !S) return false;
    var host = R.querySelector("#mp-inventory-host");
    if (!host) return false;
    if (!force && mapInventoryInstance && mapInventoryMode === appMode) {
      mapInventoryInstance.atualizar();
      return true;
    }
    if (mapInventoryInstance) mapInventoryInstance.destruir();
    mapInventoryInstance = Inventario.montar(host, S, mapInventoryOptions());
    mapInventoryMode = appMode;
    return true;
  }
function openMapInventory() {
    if (!R) return;
    var overlay = R.querySelector("#mp-inventory-overlay");
    if (!overlay) return;
    if (!mountMapInventory(false)) {
      appAlertMessage("msg093", "Não foi possível abrir o inventário: verifique se o personagem e inventario.js estão carregados.");
      return;
    }
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  }
function closeMapInventory() {
    if (!R) return;
    var overlay = R.querySelector("#mp-inventory-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }
function menuIsOpen() {
    var d = R && R.querySelector("#mp-drawer");
    return !!(d && d.classList.contains("open"));
  }
function setMenu(open) {
    if (!R) return;
    var d = R.querySelector("#mp-drawer"), b = R.querySelector("#mp-burger");
    if (!d || !b) return;
    d.classList.toggle("open", open);
    b.classList.toggle("open", open);
    b.setAttribute("aria-expanded", open ? "true" : "false");
    b.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    d.setAttribute("aria-hidden", open ? "false" : "true");
  }
