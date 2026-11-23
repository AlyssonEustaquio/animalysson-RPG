/*
 * Ajustes visuais da ficha sem alterar a lógica do personagem.
 * Remove o texto de ajuda e integra o dado ao fluxo normal do título/conteúdo.
 */
(function () {
  "use strict";

  var fraseAjuda = "Sua ficha fica nesta área. Clique nos campos destacados para editar.";

  function normalizar(texto) {
    return String(texto || "").replace(/\s+/g, " ").trim();
  }

  function removerAjuda(root) {
    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll("#app p, #app small, #app div, #app span, #app em, #app label").forEach(function (el) {
      if (normalizar(el.textContent) === fraseAjuda) el.remove();
    });

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nos = [];
    while (walker.nextNode()) nos.push(walker.currentNode);
    nos.forEach(function (no) {
      if (no.nodeValue && no.nodeValue.indexOf(fraseAjuda) !== -1) {
        no.nodeValue = no.nodeValue.replace(fraseAjuda, "").replace(/[ \t]{2,}/g, " ");
        var pai = no.parentElement;
        if (pai && !normalizar(pai.textContent) && pai.children.length === 0) pai.remove();
      }
    });
  }

  function limparEstiloInline(botao) {
    [
      "border", "border-width", "border-style", "border-color", "border-radius",
      "outline", "outline-offset", "background", "background-color",
      "box-shadow", "padding", "min-width", "width", "min-height", "height",
      "appearance", "-webkit-appearance"
    ].forEach(function (propriedade) {
      botao.style.removeProperty(propriedade);
    });
  }

  function transformarBotao(root) {
    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll("#app button, #app [role='button']").forEach(function (botao) {
      var texto = normalizar(botao.textContent);
      if (!botao.classList.contains("sortear-personagem-icone") && !/sortear\s+personagem/i.test(texto)) return;

      // Mantém o próprio botão, onclick e listeners existentes.
      botao.textContent = "🎲";
      botao.classList.add("sortear-personagem-icone");
      botao.setAttribute("aria-label", "Sortear personagem");
      botao.setAttribute("title", "Sortear personagem");
      limparEstiloInline(botao);
    });
  }

  function aplicar() {
    removerAjuda(document.body);
    transformarBotao(document.body);
  }

  aplicar();

  if (window.MutationObserver && document.body) {
    var agendado = false;
    var observador = new MutationObserver(function () {
      if (agendado) return;
      agendado = true;
      window.requestAnimationFrame(function () {
        agendado = false;
        aplicar();
      });
    });
    observador.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
})();
