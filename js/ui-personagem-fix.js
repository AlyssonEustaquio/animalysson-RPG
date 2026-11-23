/*
 * Ajustes pontuais da ficha sem alterar a lógica original do personagem.
 * Funciona mesmo quando a aplicação renderiza o conteúdo de forma assíncrona.
 */
(function () {
  "use strict";

  var fraseAjuda = "Sua ficha fica nesta área. Clique nos campos destacados para editar.";

  function normalizar(texto) {
    return String(texto || "").replace(/\s+/g, " ").trim();
  }

  function removerAjuda(root) {
    if (!root || !root.querySelectorAll) return;

    // Remove primeiro elementos cujo único conteúdo é a frase de ajuda.
    var elementos = root.querySelectorAll("#app p, #app small, #app div, #app span, #app em, #app label");
    elementos.forEach(function (el) {
      if (normalizar(el.textContent) === fraseAjuda) {
        el.remove();
      }
    });

    // Também trata a frase caso esteja misturada a outro texto no mesmo elemento.
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nos = [];
    while (walker.nextNode()) nos.push(walker.currentNode);
    nos.forEach(function (no) {
      if (no.nodeValue && no.nodeValue.indexOf(fraseAjuda) !== -1) {
        no.nodeValue = no.nodeValue.replace(fraseAjuda, "").replace(/[ \t]{2,}/g, " ");
        var pai = no.parentElement;
        if (pai && !normalizar(pai.textContent) && pai.children.length === 0) {
          pai.remove();
        }
      }
    });
  }

  function transformarBotao(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll("#app button, #app [role='button']").forEach(function (botao) {
      if (botao.classList.contains("sortear-personagem-icone")) return;
      var texto = normalizar(botao.textContent);
      if (!/sortear\s+personagem/i.test(texto)) return;

      // Mantém o próprio elemento para preservar onclick/listeners já registrados.
      botao.textContent = "🎲";
      botao.classList.add("sortear-personagem-icone");
      botao.setAttribute("aria-label", "Sortear personagem");
      botao.setAttribute("title", "Sortear personagem");
    });
  }

  function aplicar() {
    removerAjuda(document.body);
    transformarBotao(document.body);
  }

  aplicar();

  if (window.MutationObserver && document.body) {
    var observador = new MutationObserver(function () {
      aplicar();
    });
    observador.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
})();
