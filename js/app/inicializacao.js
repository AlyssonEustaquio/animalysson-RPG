if (window.Bestiary) Bestiary.onChange(function() {
  if (ACTIVE_VIEW === "monsters" && document.querySelector(".catalog-layout")) updateMonsterResults();
});
if (window.Inventario) Inventario.carregar(S, INV_OPTS);
render();

