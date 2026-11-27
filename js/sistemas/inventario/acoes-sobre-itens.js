const reunir = (it, excluir) => {
      const outro = inv.itens.find((o) => o !== excluir && mesmoEmpilhavel(it, o));
      if (outro) {
        outro.qtd = num(outro.qtd, 1) + num(it.qtd, 1);
        inv.itens = inv.itens.filter((x) => x !== it);
      }
    };
const desequipar = (it, excluir) => {
      it.equipado = "";
      reunir(it, excluir);
    };
const equipar = (item, slotId) => {
      const candidatos = slotsDoItem(item);
      if (!candidatos.length) return;
      if (num(item.qtd, 1) > 1) {
        const unidade = Object.assign({}, item, { id: uid(), qtd: 1, equipado: "", sintonizado: false });
        item.qtd = num(item.qtd, 1) - 1;
        inv.itens.splice(inv.itens.indexOf(item) + 1, 0, unidade);
        item = unidade;
      }
      const alvo = slotId && candidatos.includes(slotId) ? slotId : candidatos.find((s) => !emSlot(s)) || candidatos[0];
      const ocupante = emSlot(alvo);
      if (ocupante) desequipar(ocupante, item);
      if (item.duasMaos) {
        const sec = emSlot("maoSecundaria");
        if (sec) desequipar(sec, item);
      }
      if (alvo === "maoSecundaria") {
        const prin = emSlot("maoPrincipal");
        if (prin && prin.duasMaos) desequipar(prin, item);
      }
      item.equipado = alvo;
    };
const mover = (item, qtd, destino) => {
      qtd = Math.min(qtd, num(item.qtd, 1));
      if (qtd <= 0) return;
      let alvo = item;
      if (qtd < num(item.qtd, 1)) {
        alvo = Object.assign({}, item, { id: uid(), qtd });
        item.qtd = num(item.qtd, 1) - qtd;
        inv.itens.splice(inv.itens.indexOf(item) + 1, 0, alvo);
      }
      alvo.local = destino;
      alvo.equipado = "";
      alvo.sintonizado = false;
      reunir(alvo);
    };
const acharItem = (el) => {
      const c = el.closest("[data-id]");
      return c ? inv.itens.find((i) => i.id === c.dataset.id) : null;
    };
const GRUPOS = {
      dano: "arma magico",
      propriedades: "arma magico",
      proficiencia: "arma",
      maestria: "arma",
      duasMaos: "arma",
      caBase: "armadura",
      categoria: "armadura",
      dexMax: "armadura",
      forcaMin: "armadura",
      furtividade: "armadura",
      caBonus: "escudo",
      capacidade: "montaria",
      deslocamento: "montaria",
      tamanho: "montaria"
    };
const atualizarCampos = () => {
      const tipo = dlg.querySelector('[data-f="tipo"]').value;
      dlg.querySelectorAll("label[data-g]").forEach((l) => {
        l.hidden = l.dataset.g.split(" ").indexOf(tipo) < 0;
      });
    };
const formItem = (item, novo) => {
      const i = item || { nome: "", tipo: "equipamento", qtd: 1, peso: 0, valor: 0, slot: "" };
      const campo = (id, rotulo, html) => `<label data-g="${GRUPOS[id]}">${rotulo}${html}</label>`;
      abrir(`
        <h3>${novo ? "Novo item" : "Editar item"}</h3>
        <div class="inv-grid">
          <label class="l">Nome<input data-f="nome" value="${esc(i.nome)}"></label>
          <label>Tipo<select data-f="tipo">${TIPOS.map((t) => `<option value="${t[0]}" ${i.tipo === t[0] ? "selected" : ""}>${t[1]}</option>`).join("")}</select></label>
          <label>Onde equipa<select data-f="slot">${SLOT_TIPOS.map((t) => `<option value="${t[0]}" ${(i.slot || "") === t[0] ? "selected" : ""}>${t[1]}</option>`).join("")}</select></label>
          <label>Quantidade<input type="number" min="0" step="1" data-f="qtd" value="${num(i.qtd, 1)}"></label>
          <label>Peso unitário (kg)<input type="number" min="0" step="0.01" data-f="peso" value="${num(i.peso)}"></label>
          <label>Valor unitário (PO)<input type="number" min="0" step="0.01" data-f="valor" value="${num(i.valor)}"></label>
          <label>Bônus mágico<input type="number" step="1" data-f="bonus" value="${num(i.bonus)}"></label>
          ${campo("dano", "Dano", `<input data-f="dano" value="${esc(i.dano || "")}" placeholder="1d8 cortante">`)}
          ${campo("propriedades", "Propriedades", `<input data-f="propriedades" value="${esc(i.propriedades || "")}">`)}
          ${campo("proficiencia", "Categoria da arma", `<select data-f="proficiencia"><option value="">—</option><option value="simples" ${i.proficiencia === "simples" ? "selected" : ""}>Simples</option><option value="marcial" ${i.proficiencia === "marcial" ? "selected" : ""}>Marcial</option></select>`)}
          ${campo("maestria", "Maestria", `<input data-f="maestria" value="${esc(i.maestria || "")}">`)}
          ${campo("caBase", "CA base", `<input type="number" step="1" data-f="caBase" value="${i.caBase != null ? i.caBase : ""}">`)}
          ${campo("categoria", "Categoria da armadura", `<select data-f="categoria"><option value="">—</option>${["leve", "media", "pesada"].map((c) => `<option value="${c}" ${i.categoria === c ? "selected" : ""}>${c === "media" ? "média" : c}</option>`).join("")}</select>`)}
          ${campo("dexMax", "Máx. de Des na CA", `<input type="number" step="1" data-f="dexMax" value="${i.dexMax != null ? i.dexMax : ""}" placeholder="padrão">`)}
          ${campo("forcaMin", "Força mínima", `<input type="number" step="1" data-f="forcaMin" value="${i.forcaMin != null ? i.forcaMin : ""}">`)}
          ${campo("caBonus", "Bônus de CA do escudo", `<input type="number" step="1" data-f="caBonus" value="${i.caBonus != null ? i.caBonus : ""}">`)}
          ${campo("capacidade", "Capacidade de carga (kg)", `<input type="number" min="0" step="0.1" data-f="capacidade" value="${num(i.capacidade)}">`)}
          ${campo("deslocamento", "Deslocamento (m)", `<input type="number" min="0" step="0.5" data-f="deslocamento" value="${i.deslocamento != null ? i.deslocamento : ""}">`)}
          ${campo("tamanho", "Tamanho", `<select data-f="tamanho"><option value="">—</option>${TAMANHOS.map((t) => `<option value="${t[0]}" ${i.tamanho === t[0] ? "selected" : ""}>${t[1]}</option>`).join("")}</select>`)}
          <label class="l">Descrição<textarea data-f="descricao" rows="3">${esc(i.descricao || "")}</textarea></label>
          <label class="inv-chk" data-g="arma"><input type="checkbox" data-f="duasMaos" ${i.duasMaos ? "checked" : ""}> Duas mãos</label>
          <label class="inv-chk" data-g="armadura"><input type="checkbox" data-f="furtividade" ${i.furtividade ? "checked" : ""}> Desvantagem em Furtividade</label>
          <label class="inv-chk"><input type="checkbox" data-f="requerSintonia" ${i.requerSintonia ? "checked" : ""}> Permite sintonia</label>
        </div>
        <div class="inv-dlg-rod"><button class="inv-btn" data-d="fechar">Cancelar</button><button class="inv-btn pri" data-d="salvar-item">Salvar</button></div>`);
      dlg.dataset.editando = novo ? "" : i.id;
      atualizarCampos();
    };
const lerForm = () => {
      const o = {};
      dlg.querySelectorAll("[data-f]").forEach((el) => {
        o[el.dataset.f] = el.type === "checkbox" ? el.checked : el.value;
      });
      return o;
    };
const opcional = (v) => v === "" || v == null ? void 0 : num(v);
const salvarForm = () => {
      const f = lerForm();
      const nome = (f.nome || "").trim();
      if (!nome) {
        dlg.querySelector('[data-f="nome"]').focus();
        return;
      }
      const dados = {
        nome,
        tipo: f.tipo,
        slot: f.slot,
        qtd: Math.max(0, Math.floor(num(f.qtd, 1))),
        peso: Math.max(0, num(f.peso)),
        valor: Math.max(0, num(f.valor)),
        bonus: Math.floor(num(f.bonus)),
        dano: (f.dano || "").trim(),
        propriedades: (f.propriedades || "").trim(),
        proficiencia: f.proficiencia || void 0,
        maestria: (f.maestria || "").trim() || void 0,
        caBase: opcional(f.caBase),
        categoria: f.categoria || void 0,
        dexMax: opcional(f.dexMax),
        forcaMin: opcional(f.forcaMin),
        caBonus: opcional(f.caBonus),
        capacidade: f.tipo === "montaria" ? Math.max(0, num(f.capacidade)) : void 0,
        deslocamento: opcional(f.deslocamento),
        tamanho: f.tamanho || void 0,
        descricao: (f.descricao || "").trim(),
        duasMaos: !!f.duasMaos,
        furtividade: !!f.furtividade,
        requerSintonia: !!f.requerSintonia
      };
      const idEd = dlg.dataset.editando;
      if (idEd) {
        const it = inv.itens.find((x) => x.id === idEd);
        if (it) {
          Object.assign(it, dados);
          if (!it.requerSintonia) it.sintonizado = false;
          if (it.equipado && slotsDoItem(it).indexOf(it.equipado) < 0 && (MAPA_SLOTS[it.slot] || []).indexOf(it.equipado) < 0) it.equipado = "";
        }
      } else {
        inv.itens.push(Object.assign({ id: uid(), equipado: "", sintonizado: false, local: "" }, dados));
      }
      fechar();
      salvar();
    };
const adicionarItem = (base) => {
      empilhar(inv, base);
      salvar();
    };
