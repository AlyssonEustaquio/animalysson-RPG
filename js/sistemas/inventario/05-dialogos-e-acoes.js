const abrirCatalogo = (tipoFixo) => {
      const grupos = Array.from(new Set(catalogo.map((c) => c.grupo).filter(Boolean))).sort((a, b) => a.localeCompare(b, "pt-BR"));
      const estadoCat = { busca: "", grupo: "", limite: 100 };
      const base = tipoFixo ? catalogo.filter((c) => c.tipo === tipoFixo) : catalogo.filter((c) => c.tipo !== "montaria");
      const desenhar = () => {
        const t = norm(estadoCat.busca).trim();
        const achados = [];
        base.forEach((c) => {
          if (estadoCat.grupo && c.grupo !== estadoCat.grupo) return;
          if (t && !(c.busca || norm(c.nome)).includes(t)) return;
          achados.push(c);
        });
        const html = achados.slice(0, estadoCat.limite).map((c) => {
          const info = [
            c.dano,
            c.tipo === "armadura" && c.caBase != null ? "CA " + c.caBase : "",
            c.tipo === "escudo" ? "CA +" + c.caBonus : "",
            c.tipo === "montaria" ? [c.tamanho ? tamNome(c.tamanho) : "", c.deslocamento ? fmt(c.deslocamento) + " m" : "", "carga " + fmt(c.capacidade) + " kg"].filter(Boolean).join(" · ") : "",
            c.raridade || "",
            c.peso ? fmt(c.peso) + " kg" : "",
            c.valor ? fmt(c.valor) + " PO" : ""
          ].filter(Boolean).join(" · ");
          return `<div class="inv-cat"><div><b>${esc(c.nome)}</b><br><small>${esc(info)}</small></div>
            <button class="inv-btn mini" data-d="cat" data-i="${catalogo.indexOf(c)}">Adicionar</button></div>`;
        }).join("");
        const mais = achados.length > estadoCat.limite ? `<button class="inv-btn" data-d="mais-cat">Mostrar mais (${achados.length - estadoCat.limite} restantes)</button>` : "";
        dlg.querySelector('[data-d="lista-cat"]').innerHTML = (html || '<div class="inv-vazio">Nada encontrado.</div>') + mais;
        dlg.querySelector('[data-d="total-cat"]').textContent = achados.length + " de " + base.length + " itens";
      };
      abrir(`
        <h3>${tipoFixo === "montaria" ? "Adicionar montaria" : "Adicionar item"}</h3>
        <div class="inv-barra-ferr">
          <input type="search" data-d="busca-cat" placeholder="Buscar no catálogo" aria-label="Buscar no catálogo" style="flex:1 1 140px;background:var(--f);border:1px solid var(--b);border-radius:6px;padding:6px 8px">
          ${tipoFixo ? "" : `<select data-d="grupo-cat" aria-label="Filtrar por categoria" style="background:var(--f);border:1px solid var(--b);border-radius:6px;padding:6px 8px"><option value="">Todas</option>${grupos.map((g) => `<option value="${esc(g)}">${esc(g)}</option>`).join("")}</select>`}
          <button class="inv-btn pri" data-d="novo" data-t="${tipoFixo || ""}">${tipoFixo === "montaria" ? "Montaria personalizada" : "Item personalizado"}</button>
        </div>
        <div class="inv-meta" data-d="total-cat"></div>
        <div data-d="lista-cat" style="display:flex;flex-direction:column;gap:6px;overflow:auto;max-height:50vh"></div>
        <div class="inv-dlg-rod"><button class="inv-btn" data-d="fechar">Fechar</button></div>`);
      dlg._cat = { estado: estadoCat, desenhar };
      desenhar();
    };

const abrirSlot = (slotId) => {
      const s = SLOTS.find((x) => x.id === slotId);
      const atual = emSlot(slotId);
      const compat = inv.itens.filter((i) => !i.equipado && !i.local && slotsDoItem(i).concat(i.slot && !i.duasMaos && i.tipo !== "escudo" ? MAPA_SLOTS[i.slot] || [] : []).includes(slotId));
      abrir(`
        <h3>${s.nome}</h3>
        ${atual ? `<div class="inv-cat"><div><b>${esc(atual.nome)}</b></div><button class="inv-btn mini" data-d="desequipar" data-id="${atual.id}">Desequipar</button></div>` : ""}
        <div style="display:flex;flex-direction:column;gap:6px;overflow:auto;max-height:50vh">
          ${compat.length ? compat.map((i) => `<div class="inv-cat"><div><b>${esc(i.nome)}</b></div><button class="inv-btn mini" data-d="equipar-em" data-id="${i.id}" data-s="${slotId}">Equipar</button></div>`).join("") : '<div class="inv-vazio">Nenhum item compatível na mochila.</div>'}
        </div>
        <div class="inv-dlg-rod"><button class="inv-btn" data-d="fechar">Fechar</button></div>`);
    };

const abrirPagar = () => {
      abrir(`
        <h3>Gastar ouro</h3>
        <div class="inv-grid"><label class="l">Valor em PO<input type="number" min="0" step="0.01" data-f="valor" value="0"></label></div>
        <div class="inv-meta">Disponível: ${fmt(totalPO())} PO. As moedas de maior valor são usadas primeiro e o troco volta em moedas menores.</div>
        <div class="inv-dlg-rod"><button class="inv-btn" data-d="fechar">Cancelar</button><button class="inv-btn pri" data-d="confirmar-pagar">Gastar</button></div>`);
    };

const abrirCarregar = (m) => {
      const lista = inv.itens.filter((i) => !i.local && !i.equipado && i.tipo !== "montaria" && i.tipo !== "veiculo");
      abrir(`
        <h3>Carregar em ${esc(m.nome)}</h3>
        <div class="inv-meta">Itens carregados pela montaria deixam de pesar na sua carga.</div>
        <div style="display:flex;flex-direction:column;gap:6px;overflow:auto;max-height:50vh">
          ${lista.length ? lista.map((i) => `<div class="inv-cat"><div><b>${esc(i.nome)}</b><br><small>× ${i.qtd} · ${fmt(num(i.peso) * num(i.qtd, 1))} kg</small></div>
            <span style="display:flex;gap:4px">${num(i.qtd, 1) > 1 ? `<button class="inv-btn mini" data-d="carregar" data-q="1" data-id="${i.id}" data-m="${m.id}">1</button>` : ""}<button class="inv-btn mini" data-d="carregar" data-q="${i.qtd}" data-id="${i.id}" data-m="${m.id}">${num(i.qtd, 1) > 1 ? "Tudo" : "Carregar"}</button></span></div>`).join("") : '<div class="inv-vazio">Nenhum item disponível na mochila.</div>'}
        </div>
        <div class="inv-dlg-rod"><button class="inv-btn" data-d="fechar">Fechar</button></div>`);
    };

const gastar = (po) => {
      const restante = Math.round(po * 100);
      const total = Math.round(totalPO() * 100);
      if (restante <= 0 || restante > total) return false;
      let cp = total - restante;
      const novo = { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 };
      [...MOEDAS].reverse().forEach((m) => {
        if (m.id === "pe") return;
        novo[m.id] = Math.floor(cp / m.cp);
        cp -= novo[m.id] * m.cp;
      });
      inv.moedas = novo;
      return true;
    };

const alternarMontaria2 = (m) => {
      if (typeof opcoes.aoAlternarMontaria === "function" && opcoes.aoAlternarMontaria(m, personagem) === true) return;
      if (m.montado) {
        m.montado = false;
        salvar();
        const c2 = ctx();
        aviso("Você desmontou", `Desmontar custa metade do seu deslocamento${c2.deslocamento != null ? " (" + fmt(Math.floor(num(c2.deslocamento) / 2 * 10) / 10) + " m)" : ""}. Você sai em um espaço a até 1,5 m da montaria.`);
        return;
      }
      const c = ctx();
      if (m.tamanho && tamIdx(m.tamanho) < tamanhoDe(c.tamanho) + 1) {
        aviso("Não é possível montar", `${esc(m.nome)} é ${tamNome(m.tamanho)}. A montaria precisa ser pelo menos um tamanho maior que o seu e ter anatomia adequada.`);
        return;
      }
      inv.itens.forEach((i) => {
        if (i.tipo === "montaria") i.montado = false;
      });
      m.montado = true;
      salvar();
      aviso("Você montou", `Montar custa metade do seu deslocamento${c.deslocamento != null ? " (" + fmt(Math.floor(num(c.deslocamento) / 2 * 10) / 10) + " m)" : ""}. Montado, você usa o deslocamento da montaria${m.deslocamento ? " (" + fmt(num(m.deslocamento)) + " m)" : ""}. ${m.controle === "independente" ? "Modo independente selecionado. Atenção: esta versão do motor ainda não cria uma iniciativa separada para a montaria; ela não recebe um turno autônomo." : "Montaria controlada: age na sua iniciativa e só pode Correr (Dash), Desengajar ou Esquivar."}`);
    };

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
