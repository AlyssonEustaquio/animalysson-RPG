const alternarMontaria = (p, id, ctx, o) => {
    const inv = carregarLocal(p, o);
    const m = inv.itens.find((i) => i.id === id && i.tipo === "montaria");
    if (!m) return { ok: false, erro: "Montaria não encontrada." };
    if (m.montado) {
      m.montado = false;
      persistir(p, o);
      return { ok: true, montado: false, nome: m.nome };
    }
    const erro = erroMontar(m, ctx || {});
    if (erro) return { ok: false, erro };
    inv.itens.forEach((i) => {
      if (i.tipo === "montaria") i.montado = false;
    });
    m.montado = true;
    persistir(p, o);
    return { ok: true, montado: true, nome: m.nome, deslocamento: m.deslocamento, controle: m.controle };
  };
const montadoDe = (p) => {
    const inv = garantir(p);
    return inv.itens.find((i) => i.tipo === "montaria" && i.montado) || null;
  };
const estatisticas = (p, ctx) => {
    const inv = garantir(p);
    return {
      ca: calcularCA(inv.itens, ctx),
      avisos: avisosDe(inv.itens, ctx),
      ataques: ataquesDe(inv.itens, ctx),
      penalidadeDeslocamento: penalidadeForca(inv.itens, ctx),
      montaria: montadoDe(p)
    };
  };
