(function () {
  var versao = Date.now();

  var modulos = [
    { nome: "rolagem", partes: [
      "js/rolagem/dados-3d.js",
      "js/rolagem/chat-rolagens.js"
    ] },
    { nome: "dados", partes: [
      "js/dados/especies.js",
      "js/dados/classes.js",
      "js/dados/antecedentes.js",
      "js/dados/magias.js",
      "js/dados/itens.js",
      "js/dados/monstros.js"
    ] },
    { nome: "bestiario", partes: [
      "(function() {\n\"use strict\";",
      "js/sistemas/bestiario/constantes-e-armazenamento.js",
      "js/sistemas/bestiario/modelo-do-monstro.js",
      "js/sistemas/bestiario/estilos-e-html.js",
      "js/sistemas/bestiario/editor.js",
      "js/sistemas/bestiario/api-publica.js",
      "\n\n})();"
    ] },
    { nome: "combate", partes: [
      "(function(global) {\n\"use strict\";",
      "js/sistemas/combate/constantes-e-rolagens.js",
      "js/sistemas/combate/leitura-de-acoes-de-monstros.js",
      "function criar(env) {",
      "js/sistemas/combate/participantes-e-estatisticas.js",
      "js/sistemas/combate/condicoes-e-movimento.js",
      "js/sistemas/combate/dano-e-ataques.js",
      "js/sistemas/combate/turnos-e-iniciativa.js",
      "js/sistemas/combate/movimento-e-oportunidade.js",
      "js/sistemas/combate/acoes-especiais.js",
      "js/sistemas/combate/ia-e-turnos-automaticos.js",
      "\n\n  }",
      "js/sistemas/combate/api-publica.js",
      "\n\n})(window);"
    ] },
    { nome: "inventario", partes: [
      "(function(global) {",
      "js/sistemas/inventario/regras-e-itens.js",
      "js/sistemas/inventario/montaria-e-estatisticas.js",
      "js/sistemas/inventario/estilos.js",
      "const montar = (container, personagem, opcoes) => {",
      "js/sistemas/inventario/montagem-e-calculos.js",
      "js/sistemas/inventario/painel.js",
      "js/sistemas/inventario/acoes-sobre-itens.js",
      "js/sistemas/inventario/dialogos.js",
      "js/sistemas/inventario/eventos.js",
      "\n\n  };",
      "js/sistemas/inventario/api-publica.js",
      "\n\n})(window);"
    ] },
    { nome: "mapa", partes: [
      "(function() {\n\"use strict\";",
      "js/sistemas/mapa/mapas-e-configuracao.js",
      "js/sistemas/mapa/editor-criativo.js",
      "js/sistemas/mapa/camadas-e-iluminacao.js",
      "js/sistemas/mapa/constantes-e-estado.js",
      "js/sistemas/mapa/estado-do-mapa.js",
      "js/sistemas/mapa/pacotes-e-catalogo-de-mapas.js",
      "js/sistemas/mapa/otimizacao-de-imagens.js",
      "js/sistemas/mapa/grade-e-geometria.js",
      "js/sistemas/mapa/estruturas-e-portas.js",
      "js/sistemas/mapa/segredos-e-materiais.js",
      "js/sistemas/mapa/editor-de-estruturas.js",
      "js/sistemas/mapa/interacao-com-estruturas.js",
      "js/sistemas/mapa/detalhes-e-camera.js",
      "js/sistemas/mapa/viagem-no-mundo.js",
      "js/sistemas/mapa/desenho-do-mapa.js",
      "js/sistemas/mapa/visibilidade-e-tamanho-da-grade.js",
      "js/sistemas/mapa/portais.js",
      "js/sistemas/mapa/previa-das-ferramentas.js",
      "js/sistemas/mapa/nevoa-e-tokens.js",
      "js/sistemas/mapa/bestiario-no-mapa.js",
      "js/sistemas/mapa/pincel-e-ocupacao.js",
      "js/sistemas/mapa/ponteiro-e-roda.js",
      "js/sistemas/mapa/movimento-por-clique-e-teclado.js",
      "js/sistemas/mapa/ficha-e-inventario-do-jogador.js",
      "js/sistemas/mapa/armas-e-rolagens-do-jogador.js",
      "js/sistemas/mapa/acoes-do-jogador.js",
      "js/sistemas/mapa/duracao-e-menu-de-acoes.js",
      "js/sistemas/mapa/combate-calculos.js",
      "js/sistemas/mapa/combate-dialogos.js",
      "js/sistemas/mapa/combate-ataques.js",
      "js/sistemas/mapa/combate-menu.js",
      "js/sistemas/mapa/combate-automatico-e-turnos.js",
      "js/sistemas/mapa/combate-hud-e-modo.js",
      "js/sistemas/mapa/inventario-e-menu-do-mapa.js",
      "js/sistemas/mapa/montagem-e-desmontagem.js",
      "js/sistemas/mapa/toque-e-gestos.js",
      "\n\n})();"
    ] },
    { nome: "app", partes: [
      "js/app/utilitarios.js",
      "js/app/personagem/constantes-e-estado.js",
      "js/app/personagem/atributos.js",
      "js/app/personagem/modais-de-edicao.js",
      "js/app/personagem/ficha.js",
      "js/app/personagem/sorteio.js",
      "js/app/itens/descricoes-e-precos.js",
      "js/app/itens/catalogo-de-itens.js",
      "js/app/monstros/catalogo-de-monstros.js",
      "js/app/inventario/pagina-do-inventario.js",
      "js/app/mapas/pagina-do-mapa.js",
      "js/app/navegacao.js",
      "js/app/inicializacao.js"
    ] }
  ];

  function ehArquivo(parte) {
    return /^js\/.+\.js$/.test(parte);
  }

  function baixar(parte) {
    if (!ehArquivo(parte)) return Promise.resolve(parte);
    return fetch(parte + "?v=" + versao).then(function (resposta) {
      if (!resposta.ok) throw new Error("Não foi possível carregar " + parte);
      return resposta.text();
    });
  }

  function executar(modulo, textos) {
    var script = document.createElement("script");
    script.textContent = textos.join("\n") + "\n//# sourceURL=" + modulo.nome + ".js";
    document.head.appendChild(script);
    script.remove();
  }

  Promise.all(modulos.map(function (modulo) {
    return Promise.all(modulo.partes.map(baixar));
  })).then(function (resultado) {
    modulos.forEach(function (modulo, i) { executar(modulo, resultado[i]); });
    window.__appPronto = true;
    window.dispatchEvent(new Event("animalysson:pronto"));
  }).catch(function (erro) {
    document.body.insertAdjacentHTML("beforeend", '<p style="padding:16px;color:#c53131">' + erro.message + "</p>");
    throw erro;
  });
})();
