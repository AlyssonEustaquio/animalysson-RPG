opcoes = opcoes || {};
const editorMode = opcoes.modo !== "player";
if (!document.getElementById("inv-css")) {
      const st = document.createElement("style");
      st.id = "inv-css";
      st.textContent = CSS;
      document.head.appendChild(st);
    }
let inv = carregarLocal(personagem, opcoes);
const catalogo = Array.isArray(opcoes.catalogo) && opcoes.catalogo.length ? opcoes.catalogo : [];
const estado = { busca: "", tipo: "", aba: "mochila" };
const ctx = () => ctxDe(personagem, opcoes);
const noCorpo = (i) => !i.local && i.tipo !== "montaria" && i.tipo !== "veiculo";
const capacidade = () => {
      const c = ctx();
      return Math.round(num(c.FOR, 10) * 15 * LB * MULT_TAMANHO[tamanhoDe(c.tamanho)] * 10) / 10;
    };
const pesoItens = () => inv.itens.filter(noCorpo).reduce((s, i) => s + num(i.peso) * num(i.qtd, 1), 0);
const pesoMoedas = () => opcoes.pesoMoedas === false ? 0 : MOEDAS.reduce((s, m) => s + num(inv.moedas[m.id]), 0) * PESO_MOEDA;
const pesoTotal = () => pesoItens() + pesoMoedas();
const sintonias = () => inv.itens.filter((i) => i.sintonizado).length;
const valorItens = () => inv.itens.reduce((s, i) => s + num(i.valor) * num(i.qtd, 1), 0);
const totalPO = () => MOEDAS.reduce((s, m) => s + num(inv.moedas[m.id]) * m.cp, 0) / 100;
const emSlot = (id) => inv.itens.find((i) => i.equipado === id && !i.local);
const carregadoPor = (m) => inv.itens.filter((i) => i.local === m.id);
const pesoNaMontaria = (m) => carregadoPor(m).reduce((s, i) => s + num(i.peso) * num(i.qtd, 1), 0);
const montariaAtual = () => inv.itens.find((i) => i.tipo === "montaria" && i.montado);
