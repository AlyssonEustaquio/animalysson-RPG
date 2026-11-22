(function () {
  var dados = [
    "js/dados/especies.js", "js/dados/classes.js", "js/dados/antecedentes.js", "js/dados/spells.js", "js/dados/itens.js", "js/dados/monsters.js",
    "js/sistemas/bestiario.js", "js/sistemas/combate.js", "js/sistemas/inventario.js", "js/sistemas/mapa.js"
  ];
  var app = [
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
  ];
  var v = Date.now();
  dados.concat(app).forEach(function (f) {
    document.write('<script src="' + f + "?v=" + v + '"><\/script>');
  });
})();
