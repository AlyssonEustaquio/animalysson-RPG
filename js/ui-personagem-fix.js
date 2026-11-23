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

  function encontrarTituloNome(root) {
    if (!root || !root.querySelectorAll) return null;
    var seletor = "h1,h2,h3,h4,h5,h6,label,strong,b,span,div,p";
    var prioridade = { H1: 0, H2: 1, H3: 2, H4: 3, H5: 4, H6: 5, LABEL: 6, STRONG: 7, B: 8, SPAN: 9, DIV: 10, P: 11 };
    return Array.from(root.querySelectorAll(seletor))
      .filter(function (el) {
        var texto = normalizar(el.textContent).replace(/[：:]$/, "");
        return texto.toLowerCase() === "nome do personagem" && el.getClientRects().length > 0;
      })
      .sort(function (a, b) {
        return (Object.prototype.hasOwnProperty.call(prioridade, a.tagName) ? prioridade[a.tagName] : 99) -
          (Object.prototype.hasOwnProperty.call(prioridade, b.tagName) ? prioridade[b.tagName] : 99);
      })[0] || null;
  }

  function posicionarDadoAoLadoDoNome(root) {
    if (!root || !root.querySelector) return;
    var botao = root.querySelector("#app .sortear-personagem-icone");
    var titulo = encontrarTituloNome(root);
    if (!botao || !titulo) return;

    var linha = titulo.closest ? titulo.closest(".ficha-nome-titulo-row") : null;
    if (!linha) {
      linha = document.createElement("span");
      linha.className = "ficha-nome-titulo-row";
      titulo.parentNode.insertBefore(linha, titulo);
      linha.appendChild(titulo);
    }
    if (botao.parentNode !== linha) linha.appendChild(botao);
    titulo.classList.add("ficha-nome-personagem-titulo");
  }

  function removerCaixaExterna(root) {
    var titulo = encontrarTituloNome(root);
    if (!titulo) return;

    var candidatos = [];
    var atual = titulo.parentElement;
    while (atual && atual !== root && atual.id !== "app") {
      var estilo = window.getComputedStyle(atual);
      var borda = ["Top", "Right", "Bottom", "Left"].some(function (lado) {
        return parseFloat(estilo["border" + lado + "Width"]) > 0 && estilo["border" + lado + "Style"] !== "none";
      });
      var sombra = estilo.boxShadow && estilo.boxShadow !== "none";
      var classeDeCaixa = /(^|[-_ ])(card|panel|sheet|ficha)([-_ ]|$)/i.test(String(atual.className || ""));
      if (borda || sombra || classeDeCaixa) candidatos.push(atual);
      atual = atual.parentElement;
    }

    // Retira somente a moldura externa mais abrangente, preservando os campos internos.
    if (candidatos.length) candidatos[candidatos.length - 1].classList.add("ficha-sem-caixa-externa");
  }

  function aplicar() {
    removerAjuda(document.body);
    transformarBotao(document.body);
    posicionarDadoAoLadoDoNome(document.body);
    removerCaixaExterna(document.getElementById("app"));
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
