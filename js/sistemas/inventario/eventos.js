raiz.addEventListener("input", (e) => {
      const el = e.target;
      if (el.dataset.r === "busca") {
        estado.busca = el.value;
        renderLista();
      }
    });
raiz.addEventListener("change", (e) => {
      const el = e.target;
      if (el.dataset.r === "filtro") {
        estado.tipo = el.value;
        renderLista();
      }
      if (el.dataset.a === "moeda") {
        if (!editorMode) return;
        inv.moedas[el.dataset.m] = Math.max(0, Math.floor(num(el.value)));
        salvar();
      }
    });
raiz.addEventListener("click", (e) => {
      const b = e.target.closest("[data-a]");
      if (!b || b.tagName === "INPUT") return;
      const a = b.dataset.a;
      if (!editorMode && ["catalogo", "catalogo-montaria", "consolidar", "mais", "menos", "editar", "remover"].includes(a)) return;
      if (a === "aba") {
        estado.aba = b.dataset.v;
        renderPainel();
        return;
      }
      if (a === "catalogo") return abrirCatalogo("");
      if (a === "catalogo-montaria") return abrirCatalogo("montaria");
      if (a === "slot") return abrirSlot(b.dataset.s);
      if (a === "consolidar") {
        let cp = MOEDAS.reduce((s, m) => s + num(inv.moedas[m.id]) * m.cp, 0);
        const novo = { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 };
        novo.pl = Math.floor(cp / 1e3);
        cp -= novo.pl * 1e3;
        novo.po = Math.floor(cp / 100);
        cp -= novo.po * 100;
        novo.pp = Math.floor(cp / 10);
        cp -= novo.pp * 10;
        novo.pc = cp;
        inv.moedas = novo;
        return salvar();
      }
      if (a === "pagar") return abrirPagar();
      const it = acharItem(b);
      if (!it) return;
      if (a === "tocha") {
        const acender = b.dataset.acender === "1";
        if (typeof opcoes.aoAlternarTocha !== "function" || opcoes.aoAlternarTocha(it, acender) !== true) return;
        salvar();
        return;
      }
      if (a === "mais") it.qtd = num(it.qtd, 1) + 1;
      if (a === "menos") {
        it.qtd = Math.max(0, num(it.qtd, 1) - 1);
        if (it.qtd === 0) inv.itens = inv.itens.filter((x) => x !== it);
      }
      if (a === "equipar") {
        if (it.equipado) desequipar(it);
        else equipar(it);
      }
      if (a === "sintonizar") {
        if (it.sintonizado) it.sintonizado = false;
        else if (sintonias() >= MAX_SINTONIA) {
          aviso("Sintonia no limite", `Um personagem só pode estar sintonizado com ${MAX_SINTONIA} itens ao mesmo tempo. Rompa a sintonia de outro item primeiro.`);
          return;
        } else it.sintonizado = true;
      }
      if (a === "usar") {
        if (typeof opcoes.aoUsar === "function") opcoes.aoUsar(it, personagem);
        it.qtd = Math.max(0, num(it.qtd, 1) - 1);
        if (it.qtd === 0) inv.itens = inv.itens.filter((x) => x !== it);
      }
      if (a === "editar") return formItem(it, false);
      if (a === "montar") return alternarMontaria2(it);
      if (a === "controle") {
        if (typeof opcoes.aoAlternarControleMontaria === "function" && opcoes.aoAlternarControleMontaria(it, personagem) === true) return;
        it.controle = it.controle === "independente" ? "controlada" : "independente";
      }
      if (a === "carregar") return abrirCarregar(it);
      if (a === "tirar") mover(it, num(it.qtd, 1), "");
      if (a === "remover") {
        abrir(`<h3>Descartar ${esc(it.nome)}?</h3><div class="inv-meta">${it.tipo === "montaria" ? "Os itens que ela carrega voltam para a sua mochila." : "O item será removido."}</div><div class="inv-dlg-rod"><button class="inv-btn" data-d="fechar">Cancelar</button><button class="inv-btn perigo" data-d="confirmar-remover" data-id="${it.id}">Descartar</button></div>`);
        return;
      }
      salvar();
    });
dlg.addEventListener("input", (e) => {
      if (e.target.dataset.d === "busca-cat" && dlg._cat) {
        dlg._cat.estado.busca = e.target.value;
        dlg._cat.estado.limite = 100;
        dlg._cat.desenhar();
      }
    });
dlg.addEventListener("change", (e) => {
      if (e.target.dataset.d === "grupo-cat" && dlg._cat) {
        dlg._cat.estado.grupo = e.target.value;
        dlg._cat.estado.limite = 100;
        dlg._cat.desenhar();
      }
      if (e.target.dataset.f === "tipo") atualizarCampos();
    });
dlg.addEventListener("click", (e) => {
      const b = e.target.closest("[data-d]");
      if (!b || b.tagName === "INPUT" || b.tagName === "SELECT") return;
      const d = b.dataset.d;
      if (d === "fechar") return fechar();
      if (!editorMode && ["novo", "salvar-item", "cat", "confirmar-remover"].includes(d)) return;
      if (d === "novo") {
        formItem(b.dataset.t === "montaria" ? { nome: "", tipo: "montaria", qtd: 1, peso: 0, valor: 0, slot: "", capacidade: 0 } : null, true);
        return;
      }
      if (d === "salvar-item") return salvarForm();
      if (d === "mais-cat" && dlg._cat) {
        dlg._cat.estado.limite += 100;
        dlg._cat.desenhar();
        return;
      }
      if (d === "cat") {
        const base = catalogo[+b.dataset.i];
        adicionarItem(base);
        const novoBtn = dlg.querySelector(`[data-d="cat"][data-i="${b.dataset.i}"]`);
        if (novoBtn) novoBtn.textContent = base.tipo === "montaria" ? "Adicionado ✓ (aba Montaria)" : "Adicionado ✓";
        return;
      }
      const it = b.dataset.id ? inv.itens.find((x) => x.id === b.dataset.id) : null;
      if (d === "desequipar" && it) {
        desequipar(it);
        fechar();
        return salvar();
      }
      if (d === "equipar-em" && it) {
        equipar(it, b.dataset.s);
        fechar();
        return salvar();
      }
      if (d === "carregar" && it) {
        mover(it, num(b.dataset.q, 1), b.dataset.m);
        salvar();
        const m = inv.itens.find((x) => x.id === b.dataset.m);
        if (m) abrirCarregar(m);
        return;
      }
      if (d === "confirmar-remover" && it) {
        inv.itens.forEach((i) => {
          if (i.local === it.id) i.local = "";
        });
        inv.itens = inv.itens.filter((x) => x !== it);
        fechar();
        return salvar();
      }
      if (d === "confirmar-pagar") {
        const v = num(dlg.querySelector('[data-f="valor"]').value);
        if (gastar(v)) {
          fechar();
          salvar();
        } else dlg.querySelector('[data-f="valor"]').style.borderColor = "var(--r)";
      }
    });
renderPainel();
renderizar();
return {
      atualizar() {
        inv = garantir(personagem);
        renderPainel();
        renderizar();
      },
      dados() {
        return inv;
      },
      adicionar(item) {
        adicionarItem(item);
      },
      getCA() {
        return calcularCA(inv.itens, ctx());
      },
      pesoTotal,
      capacidade,
      destruir() {
        container.innerHTML = "";
      }
    };
