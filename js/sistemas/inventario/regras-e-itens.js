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
