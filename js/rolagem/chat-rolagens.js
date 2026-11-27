(function () {
  if (window.ChatRolagens) return;
  var MAX = 50, VIDA = 10000, SUMIR = 1000;
  var box = null, lista = null;

  function garantir() {
    if (box && document.body.contains(box)) return;
    box = document.createElement("div");
    box.id = "chat-rolagens";
    lista = document.createElement("div");
    lista.className = "chat-rolagens-lista";
    box.appendChild(lista);
    document.body.appendChild(box);
  }

  function agendarSumir(msg) {
    window.setTimeout(function () {
      msg.classList.add("chat-rolagens-sumindo");
      window.setTimeout(function () {
        if (msg.parentNode) msg.parentNode.removeChild(msg);
      }, SUMIR);
    }, VIDA);
  }

  function desativarBotoes() {
    lista.querySelectorAll(".chat-rolagens-botoes button").forEach(function (b) { b.disabled = true; });
    lista.querySelectorAll(".chat-rolagens-msg").forEach(function (m) {
      if (m.querySelector(".chat-rolagens-botoes") && !m.dataset.sumindo) {
        m.dataset.sumindo = "1";
        agendarSumir(m);
      }
    });
  }

  function postar(titulo, linhas, botoes, aoPostar) {
    garantir();
    var msg = document.createElement("div");
    msg.className = "chat-rolagens-msg";
    var t = document.createElement("div");
    t.className = "chat-rolagens-titulo";
    t.textContent = String(titulo || "");
    msg.appendChild(t);
    (linhas || []).forEach(function (linha) {
      var l = document.createElement("div");
      l.className = /^—/.test(linha) ? "chat-rolagens-cab" : "chat-rolagens-linha";
      l.textContent = String(linha);
      msg.appendChild(l);
    });
    if (botoes && botoes.length) {
      desativarBotoes();
      var bar = document.createElement("div");
      bar.className = "chat-rolagens-botoes";
      botoes.forEach(function (b) {
        var el = document.createElement("button");
        el.type = "button";
        el.textContent = b.label;
        el.onclick = function () {
          desativarBotoes();
          b.run();
        };
        bar.appendChild(el);
      });
      msg.appendChild(bar);
    }
    lista.appendChild(msg);
    while (lista.children.length > MAX) lista.removeChild(lista.firstChild);
    if (!botoes || !botoes.length) agendarSumir(msg);
    if (aoPostar) aoPostar();
  }

  window.ChatRolagens = { postar: postar };
})();
