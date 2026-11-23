global.Inventario = {
    montar,
    carregar: carregarLocal,
    adicionarDireto: (personagem, base, opcoes) => {
      const inv = carregarLocal(personagem, opcoes);
      empilhar(inv, base);
      persistir(personagem, opcoes);
    },
    deCatalogo,
    calcularCA,
    calcularAtaque,
    estatisticas,
    alternarMontaria,
    montadoDe,
    proficienteArma,
    slots: SLOTS,
    moedas: MOEDAS
  };
