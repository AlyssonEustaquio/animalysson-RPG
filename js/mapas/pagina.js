function renderMapsPage() {
  var app = document.getElementById("app");
  app.innerHTML = "";
  if (window.MapEditor) window.MapEditor.mount(app);
  else app.innerHTML = '<div class="empty-state">mapa.js não encontrado.</div>';
}
