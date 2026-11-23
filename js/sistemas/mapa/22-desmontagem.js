function unmount() {
    mountRequestId++;
    if (autoCombatTimer) {
      window.clearInterval(autoCombatTimer);
      autoCombatTimer = null;
    }
    if (mapInventoryInstance) {
      mapInventoryInstance.destruir();
      mapInventoryInstance = null;
      mapInventoryMode = null;
    }
    stopWorldTravel(false);
    stopKeyMove();
    pendingLocalPortal = null;
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onWindowBlur);
    window.removeEventListener("resize", onWindowResize);
    R = null;
    cv = null;
    cx = null;
    bgImages = [];
    detailCache = {};
    previewPointer = null;
  }

window.MapEditor = { mount, unmount };
