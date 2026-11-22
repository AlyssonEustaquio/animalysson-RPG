(function(global) {
  const LB = 0.4536;
  const kg = (lb) => Math.round(lb * LB * 100) / 100;
  const SLOTS = [
    { id: "cabeca", nome: "Cabeça", tipo: "cabeca" },
    { id: "pescoco", nome: "Pescoço", tipo: "pescoco" },
    { id: "capa", nome: "Capa", tipo: "capa" },
    { id: "corpo", nome: "Armadura", tipo: "corpo" },
    { id: "maoPrincipal", nome: "Mão principal", tipo: "mao" },
    { id: "maoSecundaria", nome: "Mão secundária", tipo: "mao" },
    { id: "luvas", nome: "Luvas", tipo: "luvas" },
    { id: "cinto", nome: "Cinto", tipo: "cinto" },
    { id: "botas", nome: "Botas", tipo: "botas" },
    { id: "anel1", nome: "Anel 1", tipo: "anel" },
    { id: "anel2", nome: "Anel 2", tipo: "anel" }
  ];
  const SLOT_TIPOS = [
    ["", "Não equipável"],
    ["cabeca", "Cabeça"],
    ["pescoco", "Pescoço"],
    ["capa", "Capa"],
    ["corpo", "Armadura"],
    ["mao", "Mão"],
    ["luvas", "Luvas"],
    ["cinto", "Cinto"],
    ["botas", "Botas"],
    ["anel", "Anel"]
  ];
  const TIPOS = [
    ["arma", "Arma"],
    ["armadura", "Armadura"],
    ["escudo", "Escudo"],
    ["equipamento", "Equipamento"],
    ["ferramenta", "Ferramenta"],
    ["consumivel", "Consumível"],
    ["magico", "Item mágico"],
    ["montaria", "Montaria"],
    ["sela", "Sela"],
    ["veiculo", "Veículo"],
    ["tesouro", "Tesouro"],
    ["outro", "Outro"]
  ];
  const MOEDAS = [
    { id: "pc", nome: "Cobre", sigla: "PC", cp: 1 },
    { id: "pp", nome: "Prata", sigla: "PP", cp: 10 },
    { id: "pe", nome: "Electro", sigla: "PE", cp: 50 },
    { id: "po", nome: "Ouro", sigla: "PO", cp: 100 },
    { id: "pl", nome: "Platina", sigla: "PL", cp: 1e3 }
  ];
  const TAMANHOS = [
    ["miudo", "Miúdo"],
    ["pequeno", "Pequeno"],
    ["medio", "Médio"],
    ["grande", "Grande"],
    ["enorme", "Enorme"],
    ["imenso", "Imenso"]
  ];
  const MULT_TAMANHO = [0.5, 1, 1, 2, 3, 4];
  const MONTARIAS = {
    "Mount, Camel": { vel: 15, tam: "grande" },
    "Mount, Elephant": { vel: 12, tam: "enorme" },
    "Mount, Draft Horse": { vel: 12, tam: "grande" },
    "Mount, Riding Horse": { vel: 18, tam: "grande" },
    "Mount, Mastiff": { vel: 12, tam: "medio" },
    "Mount, Mule": { vel: 12, tam: "medio" },
    "Mount, Pony": { vel: 12, tam: "medio" },
    "Mount, Warhorse": { vel: 18, tam: "grande" }
  };
  const CLASSES_REGRAS = {
    artifice: { armadura: ["leve", "media", "escudo"], marcial: "", maestria: false },
    barbaro: { armadura: ["leve", "media", "escudo"], marcial: "todas", maestria: true },
    bardo: { armadura: ["leve"], marcial: "", maestria: false },
    bruxo: { armadura: ["leve"], marcial: "", maestria: false },
    clerigo: { armadura: ["leve", "media", "escudo"], marcial: "", maestria: false },
    druida: { armadura: ["leve", "escudo"], marcial: "", maestria: false },
    feiticeiro: { armadura: [], marcial: "", maestria: false },
    guardiao: { armadura: ["leve", "media", "escudo"], marcial: "todas", maestria: true },
    guerreiro: { armadura: ["leve", "media", "pesada", "escudo"], marcial: "todas", maestria: true },
    ladino: { armadura: ["leve"], marcial: "leve-acuidade", maestria: true },
    mago: { armadura: [], marcial: "", maestria: false },
    monge: { armadura: [], marcial: "leve", maestria: false },
    paladino: { armadura: ["leve", "media", "pesada", "escudo"], marcial: "todas", maestria: true }
  };
  const MAX_SINTONIA = 3;
  const PESO_MOEDA = kg(1) / 50;
  const MAPA_SLOTS = {
    cabeca: ["cabeca"],
    pescoco: ["pescoco"],
    capa: ["capa"],
    corpo: ["corpo"],
    mao: ["maoPrincipal", "maoSecundaria"],
    luvas: ["luvas"],
    cinto: ["cinto"],
    botas: ["botas"],
    anel: ["anel1", "anel2"]
  };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const norm = (s) => String(s == null ? "" : s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const num = (v, padrao) => {
    const n = parseFloat(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : padrao || 0;
  };
  const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("pt-BR");
  const sinal = (n) => (n >= 0 ? "+" : "−") + Math.abs(n);
  const uid = () => global.crypto && crypto.randomUUID ? crypto.randomUUID() : "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const mod = (v) => Math.floor((num(v, 10) - 10) / 2);
  const tamIdx = (chave) => TAMANHOS.findIndex((t) => t[0] === chave);
  const tamNome = (chave) => (TAMANHOS.find((t) => t[0] === chave) || [0, ""])[1];
  const tamanhoDe = (txt) => {
    const t = norm(txt);
    const achados = [];
    TAMANHOS.forEach((tm, i) => {
      if (t.includes(tm[0])) achados.push(i);
    });
    return achados.length ? Math.min.apply(null, achados) : 2;
  };
  const garantir = (p) => {
    if (!p.inventario || typeof p.inventario !== "object") p.inventario = {};
    const inv = p.inventario;
    if (!Array.isArray(inv.itens)) inv.itens = [];
    inv.moedas = Object.assign({ pc: 0, pp: 0, pe: 0, po: 0, pl: 0 }, inv.moedas || {});
    inv.itens.forEach((i) => {
      if (!i.id) i.id = uid();
      if (!i.qtd && i.qtd !== 0) i.qtd = 1;
    });
    return inv;
  };
  const carregarLocal = (p, o) => {
    if (o && o.chaveLocal && (!p.inventario || !Array.isArray(p.inventario.itens))) {
      try {
        const bruto = localStorage.getItem(o.chaveLocal);
        if (bruto) p.inventario = JSON.parse(bruto);
      } catch (e) {
      }
    }
    return garantir(p);
  };
  const persistir = (p, o) => {
    if (o && o.chaveLocal) {
      try {
        localStorage.setItem(o.chaveLocal, JSON.stringify(p.inventario));
      } catch (e) {
      }
    }
    if (o && typeof o.aoMudar === "function") o.aoMudar(p.inventario, p);
  };
  const mesmoEmpilhavel = (a, b) => a !== b && !a.equipado && !b.equipado && (a.local || "") === (b.local || "") && a.nome === b.nome && a.tipo !== "montaria" && !a.requerSintonia && !b.requerSintonia && !a.sintonizado && !b.sintonizado && num(a.bonus) === num(b.bonus);
  const empilhar = (inv, base) => {
    const copia = JSON.parse(JSON.stringify(base));
    delete copia.busca;
    const novo = Object.assign({ qtd: 1, equipado: "", sintonizado: false, local: "" }, copia, { id: uid() });
    const existente = inv.itens.find((i) => mesmoEmpilhavel(i, novo));
    if (existente) existente.qtd = num(existente.qtd, 1) + num(novo.qtd, 1);
    else inv.itens.push(novo);
  };
  const numero = (txt) => {
    let t = String(txt == null ? "" : txt).trim();
    const f = t.match(/(\d+)\s*\/\s*(\d+)/);
    if (f && +f[2]) return +f[1] / +f[2];
    const m = t.match(/\d[\d.,]*/);
    if (!m) return 0;
    t = m[0].replace(/[.,]+$/, "");
    if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) t = t.replace(/,/g, "");
    else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, "").replace(",", ".");
    else t = t.replace(",", ".");
    const n = parseFloat(t);
    return Number.isFinite(n) ? n : 0;
  };
  const pesoDe = (txt) => {
    const t = String(txt == null ? "" : txt);
    if (!t || /carga|capacidade/i.test(t) || /^\s*[—–-]\s*$/.test(t)) return 0;
    const m = t.match(/(\d+\s*\/\s*\d+|\d[\d.,]*)\s*(lb|libras?|kg)?/i);
    if (!m) return 0;
    const v = numero(m[1]);
    return /kg/i.test(m[2] || "") ? Math.round(v * 100) / 100 : kg(v);
  };
  const capacidadeDe = (txt) => {
    const m = String(txt == null ? "" : txt).match(/(?:carga|capacidade)[^\d]*(\d[\d.,]*)\s*(lb|kg)?/i);
    if (!m) return 0;
    const v = numero(m[1]);
    return /kg/i.test(m[2] || "") ? v : kg(v);
  };
  const MOEDA_PO = { CP: 0.01, SP: 0.1, EP: 0.5, GP: 1, PP: 10, PC: 0.01, PE: 0.5, PO: 1, PL: 10 };
  const valorDe = (txt) => {
    const m = String(txt == null ? "" : txt).match(/(\d+\s*\/\s*\d+|\d[\d.,]*)\s*(CP|SP|EP|GP|PP|PC|PE|PO|PL)\b/i);
    if (!m) return 0;
    return Math.round(numero(m[1]) * MOEDA_PO[m[2].toUpperCase()] * 1e4) / 1e4;
  };
  const valorMagico = (x, consumivel) => {
    const tabela = { comum: 100, incomum: 400, rara: 4e3, "muito rara": 4e4, lendaria: 2e5 };
    const v = tabela[norm(x.raridade)];
    if (!v) return 0;
    return consumivel && !/spell scroll/i.test(x.en || "") ? Math.round(v / 2) : v;
  };
  const bonusDe = (nome, en) => {
    const achados = String(nome).match(/\+\s*\d\b/g) || String(en || "").match(/\+\s*\d\b/g) || [];
    return achados.length === 1 ? parseInt(achados[0].replace(/\D/g, ""), 10) : 0;
  };
  const deCatalogo = (x) => {
    const nome = x.n || x.en || "Item";
    const cat = norm(x.categoria);
    const tp = norm(x.tipo);
    const alvo = norm(nome + " " + (x.en || ""));
    const item = {
      nome,
      tipo: "equipamento",
      slot: "",
      qtd: 1,
      peso: pesoDe(x.peso),
      valor: valorDe(x.preco),
      descricao: x.descricao ? String(x.descricao).trim() : "",
      busca: norm(nome + " " + (x.en || "")),
      grupo: x.categoria ? String(x.categoria) : ""
    };
    if (x.id) item.itemId = x.id;
    if (x.raridade) item.raridade = x.raridade;
    const bonus = bonusDe(nome, x.en);
    if (x.magico) {
      const consumivel = /pocao|oleo|pergaminho/.test(tp) || /municao|ammunition/.test(alvo);
      item.valor = valorMagico(x, consumivel);
      if (consumivel) {
        item.tipo = "consumivel";
      } else if (tp.indexOf("armadura") === 0) {
        if (/escudo|shield/.test(alvo)) {
          item.tipo = "escudo";
          item.slot = "mao";
          item.caBonus = 2;
        } else {
          item.tipo = "armadura";
          item.slot = "corpo";
        }
        if (bonus) item.bonus = bonus;
        item.requerSintonia = true;
      } else {
        item.tipo = "magico";
        item.requerSintonia = true;
        if (bonus) item.bonus = bonus;
        if (tp === "arma" || /varinha|cajado|bastao/.test(tp)) item.slot = "mao";
        else if (/(^|\s)(anel|ring)(\s|$)/.test(tp + " " + alvo)) item.slot = "anel";
        else if (/capa|cloak|manto|cape/.test(alvo)) item.slot = "capa";
        else if (/botas|boots|sandalias|slippers/.test(alvo)) item.slot = "botas";
        else if (/luvas|gauntlets?|gloves|bracers?|braceletes?|manoplas/.test(alvo)) item.slot = "luvas";
        else if (/cinto|belt/.test(alvo)) item.slot = "cinto";
        else if (/amuleto|colar|medalhao|amulet|necklace|periapt|brooch|broche|pingente/.test(alvo)) item.slot = "pescoco";
        else if (/elmo|chapeu|capacete|helm|hat|circlet|tiara|goggles|oculos|coroa|crown|headband|faixa/.test(alvo)) item.slot = "cabeca";
      }
      return item;
    }
    if (/^armas?$/.test(cat)) {
      item.tipo = "arma";
      item.slot = "mao";
      item.dano = x.dano ? String(x.dano) : "";
      item.propriedades = x.propriedades && x.propriedades !== "—" ? String(x.propriedades).replace(/\s*;\s*/g, ", ") : "";
      item.duasMaos = /duas maos|two-handed/.test(norm(x.propriedades));
      item.proficiencia = /simples/.test(tp) ? "simples" : /marcial/.test(tp) ? "marcial" : "";
      item.distancia = /distancia/.test(tp);
      if (x.maestria && x.maestria !== "—") item.maestria = String(x.maestria);
    } else if (/^armaduras?$/.test(cat)) {
      const ca = String(x.classeArmadura || "").match(/\d+/);
      if (tp === "escudo") {
        item.tipo = "escudo";
        item.slot = "mao";
        item.caBonus = ca ? +ca[0] : 2;
      } else {
        item.tipo = "armadura";
        item.slot = "corpo";
        item.caBase = ca ? +ca[0] : 10;
        const ct = norm(x.categoriaArmadura || x.tipo);
        item.categoria = /pesad/.test(ct) ? "pesada" : /med/.test(ct) ? "media" : "leve";
        const dm = String(x.classeArmadura || "").match(/m[aá]x\.?\s*\+?\s*(\d+)/i);
        if (dm) item.dexMax = +dm[1];
        const fm = String(x.forcaMinima || "").match(/\d+/);
        if (fm) item.forcaMin = +fm[0];
        item.furtividade = /desvantagem/i.test(String(x.furtividade || ""));
        if (x.tempoVestir) item.tempoVestir = String(x.tempoVestir);
      }
    } else if (cat.indexOf("ferramenta") === 0) {
      item.tipo = "ferramenta";
    } else if (cat.indexOf("montaria") === 0) {
      if (tp === "montaria") {
        const info = MONTARIAS[x.en] || {};
        item.tipo = "montaria";
        item.capacidade = capacidadeDe(x.peso);
        item.peso = 0;
        if (info.vel) item.deslocamento = info.vel;
        if (info.tam) item.tamanho = info.tam;
      } else if (tp === "sela") {
        item.tipo = "sela";
      } else if (/veiculo|embarcacao/.test(tp)) {
        item.tipo = "veiculo";
      } else if (tp === "servico") {
        item.tipo = /racao|feed/.test(alvo) ? "consumivel" : "outro";
      }
    } else if (/consumivel|municao|substancia|pergaminho/.test(tp)) {
      item.tipo = "consumivel";
    }
    return item;
  };
  const slotsDoItem = (item) => {
    if (!item.slot) return [];
    if (item.tipo === "escudo") return ["maoSecundaria"];
    if (item.duasMaos) return ["maoPrincipal"];
    return MAPA_SLOTS[item.slot] || [];
  };
  const ctxDe = (p, o) => {
    const a = p.atributos || {};
    const base = {
      FOR: num(a.forca != null ? a.forca : p.forca, 10),
      DES: num(a.destreza != null ? a.destreza : p.destreza, 10),
      CON: num(a.constituicao, 10),
      SAB: num(a.sabedoria, 10),
      pb: 2,
      classe: "",
      tamanho: "Médio",
      deslocamento: null
    };
    const extra = typeof o.getCtx === "function" ? o.getCtx() : {};
    if (typeof o.getForca === "function") base.FOR = num(o.getForca(), 10);
    if (typeof o.getDestreza === "function") base.DES = num(o.getDestreza(), 10);
    return Object.assign(base, extra);
  };
  const calcularCA = (itens, ctx) => {
    if (typeof ctx === "number") ctx = { DES: ctx };
    ctx = ctx || {};
    const des = mod(ctx.DES);
    const armadura = itens.find((i) => i.equipado === "corpo" && i.tipo === "armadura" && i.caBase != null && i.caBase !== "");
    const escudo = itens.find((i) => i.equipado === "maoSecundaria" && i.tipo === "escudo");
    const cl = norm(ctx.classe);
    let ca;
    if (armadura) {
      let d = des;
      if (armadura.categoria === "pesada") d = 0;
      else if (armadura.dexMax != null && armadura.dexMax !== "") d = Math.min(des, num(armadura.dexMax));
      else if (armadura.categoria === "media") d = Math.min(des, 2);
      ca = num(armadura.caBase, 10) + d + num(armadura.bonus);
    } else if (cl === "barbaro") {
      ca = 10 + des + mod(ctx.CON);
    } else if (cl === "monge" && !escudo) {
      ca = 10 + des + mod(ctx.SAB);
    } else {
      ca = 10 + des;
    }
    if (escudo) ca += num(escudo.caBonus, 2) + num(escudo.bonus);
    return ca;
  };
  const proficienteArma = (classe, item) => {
    const cl = CLASSES_REGRAS[norm(classe)];
    if (!cl || !item.proficiencia || item.proficiencia === "simples") return true;
    if (cl.marcial === "todas") return true;
    const p = norm(item.propriedades);
    if (cl.marcial === "leve") return /leve|light/.test(p);
    if (cl.marcial === "leve-acuidade") return /leve|acuidade|light|finesse/.test(p);
    return false;
  };
  const calcularAtaque = (item, ctx) => {
    const f = mod(ctx.FOR);
    const d = mod(ctx.DES);
    const p = norm(item.propriedades);
    const m = item.distancia || /municao|ammunition/.test(p) ? d : /acuidade|finesse/.test(p) ? Math.max(f, d) : f;
    const prof = proficienteArma(ctx.classe, item);
    const cl = CLASSES_REGRAS[norm(ctx.classe)];
    const dm = m + num(item.bonus);
    return {
      nome: item.nome,
      acerto: m + (prof ? num(ctx.pb, 2) : 0) + num(item.bonus),
      dano: item.dano ? item.dano + " " + sinal(dm) : "",
      prof,
      maestria: cl && cl.maestria && item.maestria ? item.maestria : ""
    };
  };
  const ataquesDe = (itens, ctx) => itens.filter((i) => i.tipo === "arma" && i.equipado && !i.local).map((i) => calcularAtaque(i, ctx));
  const penalidadeForca = (itens, ctx) => {
    const a = itens.find((i) => i.equipado === "corpo" && i.tipo === "armadura");
    return a && a.forcaMin && num(ctx.FOR, 10) < num(a.forcaMin) ? 3 : 0;
  };
  const avisosDe = (itens, ctx) => {
    const av = [];
    const cl = CLASSES_REGRAS[norm(ctx.classe)];
    const armadura = itens.find((i) => i.equipado === "corpo" && i.tipo === "armadura");
    const escudo = itens.find((i) => i.equipado === "maoSecundaria" && i.tipo === "escudo");
    if (armadura && (armadura.caBase == null || armadura.caBase === "")) {
      av.push({ nivel: "alerta", texto: armadura.nome + ": defina a armadura base em Editar para entrar no cálculo da CA." });
    }
    if (cl) {
      const falta = [];
      if (armadura && armadura.categoria && cl.armadura.indexOf(armadura.categoria) < 0) {
        falta.push("armadura " + (armadura.categoria === "media" ? "média" : armadura.categoria));
      }
      if (escudo && cl.armadura.indexOf("escudo") < 0) falta.push("escudo");
      if (falta.length) {
        av.push({ nivel: "perigo", texto: "Sem treinamento em " + falta.join(" e ") + ": desvantagem em testes de D20 com Força ou Destreza e não pode conjurar magias." });
      }
    }
    if (penalidadeForca(itens, ctx)) {
      av.push({ nivel: "alerta", texto: armadura.nome + " exige FOR " + armadura.forcaMin + ": deslocamento reduzido em 3 m." });
    }
    if (armadura && armadura.furtividade) {
      av.push({ nivel: "alerta", texto: armadura.nome + " impõe desvantagem em testes de Furtividade." });
    }
    itens.filter((i) => i.tipo === "arma" && i.equipado && !i.local && !proficienteArma(ctx.classe, i)).forEach((i) => {
      av.push({ nivel: "alerta", texto: "Sem proficiência com " + i.nome + ": não soma o bônus de proficiência no ataque." });
    });
    return av;
  };
  const erroMontar = (m, c) => m.tamanho && tamIdx(m.tamanho) < tamanhoDe(c.tamanho) + 1 ? `${m.nome} é ${tamNome(m.tamanho)}. A montaria precisa ser pelo menos um tamanho maior que o seu e ter anatomia adequada.` : "";
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
  const CSS = `
.inv,.inv-dlg{--f:var(--bg,#121212);--p:var(--card,#1e1e20);--p2:var(--box,#252528);--b:var(--line,#3a3a3f);--t:var(--ink,#f2f2f2);--s:var(--mute,#a0a0a6);--d:var(--red,#c53131);--g:var(--ok,#5bbf8f);--a:#e0a84a;--r:#ff6f64;--on:var(--redink,#fff)}
.inv{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;color:var(--t);font:14px/1.4 Roboto,system-ui,-apple-system,"Segoe UI",sans-serif;box-sizing:border-box}
.inv *{box-sizing:border-box}
.inv button,.inv input,.inv select,.inv textarea,.inv-dlg button,.inv-dlg input,.inv-dlg select,.inv-dlg textarea{font:inherit;color:inherit}
.inv-topo{display:flex;flex-direction:column;gap:8px}
.inv-resumo{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
.inv-card{background:var(--p);border:1px solid var(--b);border-radius:8px;padding:8px 12px;min-width:0}
.inv-card small{display:block;color:var(--s);font-size:12px}
.inv-card strong{font-size:20px;font-weight:600}
.inv-peso{grid-column:span 2}
.inv-barra{height:8px;border-radius:4px;background:var(--f);margin-top:6px;overflow:hidden}
.inv-barra i{display:block;height:100%;background:var(--g);transition:width .2s}
.inv-barra.alto i{background:var(--a)}
.inv-barra.excesso i{background:var(--r)}
.inv-avisos{display:flex;flex-wrap:wrap;gap:6px}
.inv-aviso{font-size:12px;border:1px solid var(--a);color:var(--a);border-radius:6px;padding:4px 8px}
.inv-aviso.perigo{border-color:var(--r);color:var(--r)}
.inv-corpo{display:grid;grid-template-columns:minmax(220px,280px) minmax(0,1fr) minmax(190px,230px);gap:10px;min-height:0}
.inv-col{background:var(--p);border:1px solid var(--b);border-radius:8px;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.inv-col>h3{margin:0;padding:10px 12px;font-size:15px;font-weight:600;border-bottom:1px solid var(--b)}
.inv-abas{display:flex;border-bottom:1px solid var(--b)}
.inv-abas button{flex:1;background:transparent;border:0;border-bottom:2px solid transparent;padding:10px;cursor:pointer;font-weight:600;color:var(--s)}
.inv-abas button.on{color:var(--t);border-bottom-color:var(--d)}
.inv-painel{display:flex;flex-direction:column;min-height:0;flex:1}
.inv-rolagem{overflow:auto;min-height:0;flex:1;padding:10px}
.inv-slot{width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px;text-align:left;background:var(--p2);border:1px dashed var(--b);border-radius:6px;padding:7px 10px;margin-bottom:6px;cursor:pointer}
.inv-slot span{color:var(--s);font-size:12px;flex:none}
.inv-slot b{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.inv-slot.cheio{border-style:solid;border-color:var(--d)}
.inv-slot:hover,.inv button:hover{border-color:var(--d)}
.inv-barra-ferr{display:flex;gap:6px;padding:10px;border-bottom:1px solid var(--b);flex-wrap:wrap;align-items:center}
.inv-barra-ferr input,.inv-barra-ferr select{background:var(--f);border:1px solid var(--b);border-radius:6px;padding:6px 8px;min-width:0}
.inv-barra-ferr input{flex:1 1 140px}
.inv-btn{background:var(--p2);border:1px solid var(--b);border-radius:6px;padding:6px 10px;cursor:pointer}
.inv-btn.pri{background:var(--d);border-color:var(--d);color:var(--on);font-weight:600}
.inv-btn.mini{padding:3px 8px;font-size:12px}
.inv-btn.perigo:hover{border-color:var(--r);color:var(--r)}
.inv-btn.on{border-color:var(--d);color:var(--d)}
.inv-item{border:1px solid var(--b);border-radius:6px;padding:8px 10px;margin-bottom:6px;background:var(--p2)}
.inv-item.eqp{border-left:3px solid var(--d)}
.inv-linha1{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.inv-nome{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.inv-meta{color:var(--s);font-size:12px;margin-top:2px}
.inv-acoes{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;align-items:center}
.inv-qtd{display:inline-flex;align-items:center;gap:2px}
.inv-qtd span{min-width:28px;text-align:center}
.inv-tag{display:inline-block;font-size:11px;border:1px solid var(--b);border-radius:10px;padding:0 7px;margin-left:4px;color:var(--s)}
.inv-tag.sint{border-color:var(--a);color:var(--a)}
.inv-tag.mont{border-color:var(--g);color:var(--g)}
.inv-vazio{color:var(--s);text-align:center;padding:24px 8px}
.inv-mont{border:1px solid var(--b);border-radius:8px;padding:10px;margin-bottom:10px;background:var(--p2)}
.inv-mont.ativa{border-color:var(--g)}
.inv-mont h4{margin:0;font-size:15px;display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.inv-mont .inv-item{background:var(--p);margin:6px 0 0}
.inv-moeda{display:flex;align-items:center;gap:6px;margin-bottom:8px}
.inv-moeda label{width:54px;color:var(--s);font-size:12px}
.inv-moeda input{width:100%;min-width:0;background:var(--f);border:1px solid var(--b);border-radius:6px;padding:5px 8px;text-align:right}
.inv-dlg{font:14px/1.4 Roboto,system-ui,sans-serif;background:var(--p);color:var(--t);border:1px solid var(--b);border-radius:10px;padding:0;width:min(560px,94vw);max-height:90vh}
.inv-dlg *{box-sizing:border-box}
.inv-dlg::backdrop{background:rgba(0,0,0,.6)}
.inv-dlg-c{padding:14px;max-height:90vh;overflow:auto;display:flex;flex-direction:column;gap:10px}
.inv-dlg h3{margin:0;font-size:16px}
.inv-dlg h4{margin:8px 0 2px;font-size:14px}
.inv-dlg ul{margin:0;padding-left:18px}
.inv-dlg li{margin-bottom:3px}
.inv-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.inv-grid label{display:flex;flex-direction:column;gap:3px;color:var(--s);font-size:12px}
.inv-grid label[hidden]{display:none}
.inv-grid .l{grid-column:1/-1}
.inv-grid input,.inv-grid select,.inv-grid textarea{background:var(--f);border:1px solid var(--b);border-radius:6px;padding:6px 8px;color:var(--t)}
.inv-chk{flex-direction:row!important;align-items:center;gap:6px!important;color:var(--t)!important;font-size:14px!important}
.inv-dlg-rod{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}
.inv-cat{display:flex;justify-content:space-between;gap:8px;align-items:center;border:1px solid var(--b);border-radius:6px;padding:6px 10px;background:var(--p2)}
.inv-cat small{color:var(--s)}
.inv button:focus-visible,.inv input:focus-visible,.inv select:focus-visible,.inv-dlg button:focus-visible,.inv-dlg input:focus-visible,.inv-dlg select:focus-visible,.inv-dlg textarea:focus-visible{outline:2px solid var(--d);outline-offset:1px}
@media (max-width:900px){
.inv{height:auto;min-height:100%;display:block}
.inv-corpo{display:flex;flex-direction:column;margin-top:10px}
.inv-col{max-height:none}
.inv-peso{grid-column:auto}
}
`;
  const montar = (container, personagem, opcoes) => {
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
  };
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
})(window);
