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

container.innerHTML = "";

const raiz = document.createElement("div");

raiz.className = "inv";

raiz.innerHTML = `
      <div class="inv-topo"><div class="inv-resumo" data-r="resumo"></div><div class="inv-avisos" data-r="avisos"></div></div>
      <div class="inv-corpo">
        <section class="inv-col"><h3>Equipado</h3><div class="inv-rolagem" data-r="slots"></div></section>
        <section class="inv-col">
          <div class="inv-abas" data-r="abas"></div>
          <div class="inv-painel" data-r="painel"></div>
        </section>
        <section class="inv-col"><h3>Moedas</h3><div class="inv-rolagem" data-r="moedas"></div></section>
      </div>`;

container.appendChild(raiz);

const dlg = document.createElement("dialog");

dlg.className = "inv-dlg";

container.appendChild(dlg);

const q = (r) => raiz.querySelector(`[data-r="${r}"]`);

const abrir = (html) => {
      dlg.innerHTML = `<div class="inv-dlg-c">${html}</div>`;
      if (!dlg.open) dlg.showModal();
    };

const fechar = () => {
      if (dlg.open) dlg.close();
    };

dlg.addEventListener("click", (e) => {
      if (e.target === dlg) fechar();
    });

const aviso = (titulo, corpo) => abrir(`<h3>${titulo}</h3><div>${corpo}</div><div class="inv-dlg-rod"><button class="inv-btn pri" data-d="fechar">Entendi</button></div>`);

const salvar = () => {
      persistir(personagem, opcoes);
      renderizar();
    };

const renderResumo = () => {
      const c = ctx();
      const cap = capacidade();
      const peso = pesoTotal();
      const pct = Math.min(100, peso / cap * 100);
      const cls = peso > cap ? "excesso" : peso > cap * 0.75 ? "alto" : "";
      const mont = montariaAtual();
      const pen = penalidadeForca(inv.itens, c);
      let desloc = "";
      if (mont && mont.deslocamento) {
        desloc = `<div class="inv-card"><small>Deslocamento (montado)</small><strong>${fmt(num(mont.deslocamento))} m</strong></div>`;
      } else if (c.deslocamento != null) {
        desloc = `<div class="inv-card"><small>Deslocamento${pen ? " (FOR insuficiente)" : ""}</small><strong>${fmt(Math.max(0, num(c.deslocamento) - pen))} m</strong></div>`;
      }
      q("resumo").innerHTML = `
        <div class="inv-card"><small>Classe de Armadura</small><strong>${calcularCA(inv.itens, c)}</strong></div>
        ${desloc}
        <div class="inv-card inv-peso"><small>Carga: ${fmt(peso)} / ${fmt(cap)} kg · empurrar, arrastar ou levantar até ${fmt(cap * 2)} kg${peso > cap ? " — acima da capacidade" : ""}</small>
          <div class="inv-barra ${cls}"><i style="width:${pct}%"></i></div></div>
        <div class="inv-card"><small>Sintonia</small><strong>${sintonias()} / ${MAX_SINTONIA}</strong></div>
        <div class="inv-card"><small>Patrimônio</small><strong>${fmt(totalPO() + valorItens())} PO</strong></div>`;
      q("avisos").innerHTML = avisosDe(inv.itens, c).map((a) => `<div class="inv-aviso ${a.nivel}">${esc(a.texto)}</div>`).join("");
    };

const renderSlots = () => {
      q("slots").innerHTML = SLOTS.map((s) => {
        const it = emSlot(s.id);
        return `<button class="inv-slot ${it ? "cheio" : ""}" data-a="slot" data-s="${s.id}">
          <span>${s.nome}</span><b>${it ? esc(it.nome) : "Vazio"}</b></button>`;
      }).join("");
    };

const renderAbas = () => {
      q("abas").innerHTML = `
        <button class="${estado.aba === "mochila" ? "on" : ""}" data-a="aba" data-v="mochila">Mochila</button>
        <button class="${estado.aba === "montaria" ? "on" : ""}" data-a="aba" data-v="montaria">Montaria</button>`;
    };

const renderPainel = () => {
      renderAbas();
      if (estado.aba === "mochila") {
        q("painel").innerHTML = `
          <div class="inv-barra-ferr" style="padding:10px;border-bottom:1px solid var(--b)">
            <input type="search" placeholder="Buscar item" data-r="busca" aria-label="Buscar item" value="${esc(estado.busca)}">
            <select data-r="filtro" aria-label="Filtrar por tipo"><option value="">Todos</option>${TIPOS.filter((t) => t[0] !== "montaria").map((t) => `<option value="${t[0]}" ${estado.tipo === t[0] ? "selected" : ""}>${t[1]}</option>`).join("")}<option value="__eq" ${estado.tipo === "__eq" ? "selected" : ""}>Equipados</option></select>
            ${editorMode ? '<button class="inv-btn pri" data-a="catalogo">Adicionar item</button>' : ""}
          </div>
          <div class="inv-rolagem" data-r="lista"></div>`;
      } else {
        q("painel").innerHTML = `
          <div class="inv-barra-ferr" style="padding:10px;border-bottom:1px solid var(--b)">
            ${editorMode ? '<button class="inv-btn pri" data-a="catalogo-montaria">Adicionar montaria</button>' : ""}
            <span class="inv-meta">Monte, carregue equipamento e controle sua montaria.</span>
          </div>
          <div class="inv-rolagem" data-r="lista"></div>`;
      }
      renderLista();
    };

const itensFiltrados = () => {
      const b = norm(estado.busca).trim();
      return inv.itens.filter((i) => {
        if (i.local || i.tipo === "montaria") return false;
        if (estado.tipo === "__eq" && !i.equipado) return false;
        if (estado.tipo && estado.tipo !== "__eq" && i.tipo !== estado.tipo) return false;
        if (b && !norm(i.nome).includes(b)) return false;
        return true;
      });
    };

const nomeSlot = (id) => (SLOTS.find((s) => s.id === id) || {}).nome || "";

const detalhesItem = (i) => {
      const dano = i.tipo === "arma" && i.dano ? `Dano ${esc(i.dano)}${i.bonus ? " " + sinal(num(i.bonus)) : ""}` : "";
      let ca = "";
      if (i.tipo === "armadura" && i.caBase != null && i.caBase !== "") {
        const cat = i.categoria === "leve" ? " + Des" : i.categoria === "media" ? " + Des (máx. " + (i.dexMax != null ? i.dexMax : 2) + ")" : "";
        ca = `CA ${i.caBase}${cat}${i.bonus ? " " + sinal(num(i.bonus)) : ""}${i.forcaMin ? " · FOR " + i.forcaMin : ""}`;
      } else if (i.tipo === "armadura") {
        ca = "Defina a armadura base em Editar";
      }
      if (i.tipo === "escudo") ca = `CA +${num(i.caBonus, 2) + num(i.bonus)}`;
      return [
        dano,
        ca,
        i.maestria ? "Maestria: " + esc(i.maestria) : "",
        i.propriedades ? esc(i.propriedades) : "",
        i.raridade ? esc(i.raridade) : "",
        num(i.peso) ? `${fmt(num(i.peso) * num(i.qtd, 1))} kg` : "",
        i.valor ? `${fmt(num(i.valor) * num(i.qtd, 1))} PO` : ""
      ].filter(Boolean).join(" · ");
    };

const descricaoItem = (i) => i.descricao ? `<div class="inv-meta" title="${esc(i.descricao)}">${esc(i.descricao.length > 170 ? i.descricao.slice(0, 170) + "…" : i.descricao)}</div>` : "";

const renderMochila = () => {
      const itens = itensFiltrados();
      if (!itens.length) {
        q("lista").innerHTML = `<div class="inv-vazio">${inv.itens.length ? "Nenhum item encontrado." : "A mochila está vazia. Use “Adicionar item” para começar."}</div>`;
        return;
      }
      q("lista").innerHTML = itens.map((i) => {
        const podeEquipar = slotsDoItem(i).length > 0;
        const podeSintonizar = i.requerSintonia && i.tipo !== "consumivel";
        return `<div class="inv-item ${i.equipado ? "eqp" : ""}" data-id="${i.id}">
          <div class="inv-linha1">
            <span class="inv-nome" title="${esc(i.nome)}">${esc(i.nome)}${i.equipado ? `<span class="inv-tag">${nomeSlot(i.equipado)}</span>` : ""}${i.sintonizado ? '<span class="inv-tag sint">Sintonizado</span>' : ""}</span>
            <span class="inv-qtd">${editorMode ? '<button class="inv-btn mini" data-a="menos" aria-label="Diminuir">−</button>' : ""}<span>${i.qtd}</span>${editorMode ? '<button class="inv-btn mini" data-a="mais" aria-label="Aumentar">+</button>' : ""}</span>
          </div>
          <div class="inv-meta">${detalhesItem(i)}</div>
          ${descricaoItem(i)}
          <div class="inv-acoes">
            ${podeEquipar ? `<button class="inv-btn mini ${i.equipado ? "on" : ""}" data-a="equipar">${i.equipado ? "Desequipar" : "Equipar"}</button>` : ""}
            ${podeSintonizar ? `<button class="inv-btn mini ${i.sintonizado ? "on" : ""}" data-a="sintonizar">${i.sintonizado ? "Romper sintonia" : "Sintonizar"}</button>` : ""}
            ${i.tipo === "consumivel" ? '<button class="inv-btn mini" data-a="usar">Usar</button>' : ""}
            ${editorMode ? '<button class="inv-btn mini" data-a="editar">Editar</button><button class="inv-btn mini perigo" data-a="remover">Descartar</button>' : ""}
          </div>
        </div>`;
      }).join("");
    };

const renderMontarias = () => {
      const montarias = inv.itens.filter((i) => i.tipo === "montaria");
      if (!montarias.length) {
        q("lista").innerHTML = '<div class="inv-vazio">Nenhuma montaria. Use “Adicionar montaria” para escolher cavalo, pônei, camelo e outras.</div>';
        return;
      }
      q("lista").innerHTML = montarias.map((m) => {
        const cap = num(m.capacidade);
        const carga = pesoNaMontaria(m);
        const pct = cap ? Math.min(100, carga / cap * 100) : 0;
        const cls = cap && carga > cap ? "excesso" : cap && carga > cap * 0.75 ? "alto" : "";
        const itens = carregadoPor(m);
        const militar = itens.some((i) => i.tipo === "sela" && /militar|military/.test(norm(i.nome)));
        const exotica = itens.some((i) => i.tipo === "sela" && /exotic/.test(norm(i.nome)));
        const info = [
          m.tamanho ? tamNome(m.tamanho) : "",
          m.deslocamento ? fmt(num(m.deslocamento)) + " m" : "",
          cap ? "capacidade " + fmt(cap) + " kg" : ""
        ].filter(Boolean).join(" · ");
        return `<div class="inv-mont ${m.montado ? "ativa" : ""}" data-id="${m.id}">
          <h4><span class="inv-nome">${esc(m.nome)}${m.montado ? '<span class="inv-tag mont">Montado</span>' : ""}${m.montado ? `<span class="inv-tag">${m.controle === "independente" ? "Independente" : "Controlada"}</span>` : ""}</span></h4>
          <div class="inv-meta">${esc(info)}</div>
          ${cap ? `<div class="inv-barra ${cls}"><i style="width:${pct}%"></i></div><div class="inv-meta">Carga: ${fmt(carga)} / ${fmt(cap)} kg${carga > cap ? " — acima da capacidade" : ""}</div>` : ""}
          ${militar ? '<div class="inv-meta">Sela militar: vantagem em testes de atributo para permanecer montado.</div>' : ""}
          ${exotica ? '<div class="inv-meta">Sela exótica: necessária para montarias aquáticas ou voadoras.</div>' : ""}
          <div class="inv-acoes">
            <button class="inv-btn mini ${m.montado ? "on" : ""}" data-a="montar">${m.montado ? "Desmontar" : "Montar"}</button>
            <button class="inv-btn mini" data-a="controle" title="O modo independente ainda não recebe iniciativa própria no motor de combate desta versão">Controle: ${m.controle === "independente" ? "independente" : "controlada"}</button>
            <button class="inv-btn mini" data-a="carregar">Carregar item</button>
            ${editorMode ? '<button class="inv-btn mini" data-a="editar">Editar</button><button class="inv-btn mini perigo" data-a="remover">Descartar</button>' : ""}
          </div>
          ${m.controle === "independente" ? '<div class="inv-meta" style="color:#f0bd75">Atenção: o modo Independente ainda não cria um turno de iniciativa separado nesta versão.</div>' : ""}
          ${itens.map((i) => `<div class="inv-item" data-id="${i.id}">
            <div class="inv-linha1"><span class="inv-nome">${esc(i.nome)}</span><span class="inv-meta">× ${i.qtd} · ${fmt(num(i.peso) * num(i.qtd, 1))} kg</span></div>
            <div class="inv-acoes"><button class="inv-btn mini" data-a="tirar">Pegar de volta</button></div>
          </div>`).join("")}
        </div>`;
      }).join("");
    };

const renderLista = () => {
      if (estado.aba === "mochila") renderMochila();
      else renderMontarias();
    };

const renderMoedas = () => {
      q("moedas").innerHTML = MOEDAS.map((m) => editorMode ? `
        <div class="inv-moeda"><label for="inv-m-${m.id}">${m.nome} (${m.sigla})</label>
        <input id="inv-m-${m.id}" type="number" min="0" step="1" value="${num(inv.moedas[m.id])}" data-a="moeda" data-m="${m.id}"></div>` : `
        <div class="inv-moeda"><label>${m.nome} (${m.sigla})</label><strong>${num(inv.moedas[m.id])}</strong></div>`).join("") + `
        <div class="inv-meta" style="margin:10px 0">Total: ${fmt(totalPO())} PO · 50 moedas pesam ${fmt(kg(1))} kg</div>
        ${editorMode ? '<button class="inv-btn" data-a="consolidar" style="width:100%;margin-bottom:6px">Consolidar moedas</button>' : ""}
        <button class="inv-btn" data-a="pagar" style="width:100%">Gastar ouro</button>`;
    };

const renderizar = () => {
      renderResumo();
      renderSlots();
      renderAbas();
      renderLista();
      renderMoedas();
    };

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
