(function () {
  var versao = Date.now();

  var modulos = [
    { nome: "dados3d", arquivos: ["js/dados3d.js"] },
    { nome: "dados", arquivos: [
      "js/dados/especies.js",
      "js/dados/classes.js",
      "js/dados/antecedentes.js",
      "js/dados/spells.js",
      "js/dados/itens.js",
      "js/dados/monsters.js"
    ] },
    { nome: "bestiario", arquivos: [
      "js/sistemas/bestiario/00-abertura.js",
      "js/sistemas/bestiario/01-dados-e-armazenamento.js",
      "js/sistemas/bestiario/02-editor.js",
      "js/sistemas/bestiario/03-api.js",
      "js/sistemas/bestiario/04-fechamento.js"
    ] },
    { nome: "combate", arquivos: [
      "js/sistemas/combate/00-abertura.js",
      "js/sistemas/combate/01-constantes-e-dados.js",
      "js/sistemas/combate/02-abertura-criar.js",
      "js/sistemas/combate/03-estado-e-condicoes.js",
      "js/sistemas/combate/04-dano-e-ataques.js",
      "js/sistemas/combate/05-controle-do-combate.js",
      "js/sistemas/combate/06-acoes-especiais-e-ia.js",
      "js/sistemas/combate/07-resumo-e-retorno.js",
      "js/sistemas/combate/08-fechamento-criar.js",
      "js/sistemas/combate/09-api.js",
      "js/sistemas/combate/10-fechamento.js"
    ] },
    { nome: "inventario", arquivos: [
      "js/sistemas/inventario/00-abertura.js",
      "js/sistemas/inventario/01-regras-e-dados.js",
      "js/sistemas/inventario/02-montaria-e-estatisticas.js",
      "js/sistemas/inventario/03-abertura-montar.js",
      "js/sistemas/inventario/04-painel-e-calculos.js",
      "js/sistemas/inventario/05-dialogos-e-acoes.js",
      "js/sistemas/inventario/06-fechamento-montar.js",
      "js/sistemas/inventario/07-api.js",
      "js/sistemas/inventario/08-fechamento.js"
    ] },
    { nome: "mapa", arquivos: [
      "js/sistemas/mapa/00-abertura.js",
      "js/sistemas/mapa/01-configuracao-e-persistencia.js",
      "js/sistemas/mapa/02-estado-e-pacotes.js",
      "js/sistemas/mapa/03-catalogo-e-exportacao.js",
      "js/sistemas/mapa/04-imagens-e-utilitarios.js",
      "js/sistemas/mapa/05-visao-e-hexagonos.js",
      "js/sistemas/mapa/06-estruturas-e-segredos.js",
      "js/sistemas/mapa/07-editor-de-estruturas.js",
      "js/sistemas/mapa/08-interacao-e-camera.js",
      "js/sistemas/mapa/09-viagem-e-portais.js",
      "js/sistemas/mapa/10-visibilidade-e-grade.js",
      "js/sistemas/mapa/11-portais-e-previa.js",
      "js/sistemas/mapa/12-desenho-e-bestiario.js",
      "js/sistemas/mapa/13-pincel-e-ponteiro.js",
      "js/sistemas/mapa/14-movimento.js",
      "js/sistemas/mapa/15-ficha-e-inventario-do-jogador.js",
      "js/sistemas/mapa/16-acoes-do-jogador.js",
      "js/sistemas/mapa/17-combate-calculos.js",
      "js/sistemas/mapa/18-combate-interface.js",
      "js/sistemas/mapa/19-combate-turnos.js",
      "js/sistemas/mapa/20-combate-hud-e-modo.js",
      "js/sistemas/mapa/21-montagem.js",
      "js/sistemas/mapa/22-desmontagem.js",
      "js/sistemas/mapa/22a-toque-e-gestos.js",
      "js/sistemas/mapa/23-fechamento.js"
    ] },
    { nome: "app", arquivos: [
      "js/nucleo/util.js",
      "js/personagem/dados.js",
      "js/personagem/atributos.js",
      "js/personagem/modais.js",
      "js/personagem/ficha.js",
      "js/personagem/sorteio.js",
      "js/itens/regras.js",
      "js/itens/pagina.js",
      "js/monstros/pagina.js",
      "js/inventario/integracao.js",
      "js/mapas/pagina.js",
      "js/nucleo/navegacao.js",
      "js/app.js"
    ] }
  ];

  function baixar(url) {
    return fetch(url + "?v=" + versao).then(function (resposta) {
      if (!resposta.ok) throw new Error("Não foi possível carregar " + url);
      return resposta.text();
    });
  }

  function executar(modulo, partes) {
    var script = document.createElement("script");
    script.textContent = partes.join("\n") + "\n//# sourceURL=" + modulo.nome + ".js";
    document.head.appendChild(script);
    script.remove();
  }

  Promise.all(modulos.map(function (modulo) {
    return Promise.all(modulo.arquivos.map(baixar));
  })).then(function (resultado) {
    modulos.forEach(function (modulo, i) { executar(modulo, resultado[i]); });
    window.__appPronto = true;
    window.dispatchEvent(new Event("animalysson:pronto"));
  }).catch(function (erro) {
    document.body.insertAdjacentHTML("beforeend", '<p style="padding:16px;color:#c53131">' + erro.message + "</p>");
    throw erro;
  });
})();
