(function (global) {
  const LB = 0.4536;
  const kg = (lb) => Math.round(lb * LB * 100) / 100;

  const SLOTS = [
    { id: 'cabeca', nome: 'Cabeça', tipo: 'cabeca' },
    { id: 'pescoco', nome: 'Pescoço', tipo: 'pescoco' },
    { id: 'capa', nome: 'Capa', tipo: 'capa' },
    { id: 'corpo', nome: 'Armadura', tipo: 'corpo' },
    { id: 'maoPrincipal', nome: 'Mão principal', tipo: 'mao' },
    { id: 'maoSecundaria', nome: 'Mão secundária', tipo: 'mao' },
    { id: 'luvas', nome: 'Luvas', tipo: 'luvas' },
    { id: 'cinto', nome: 'Cinto', tipo: 'cinto' },
    { id: 'botas', nome: 'Botas', tipo: 'botas' },
    { id: 'anel1', nome: 'Anel 1', tipo: 'anel' },
    { id: 'anel2', nome: 'Anel 2', tipo: 'anel' }
  ];

  const SLOT_TIPOS = [
    ['', 'Não equipável'],
    ['cabeca', 'Cabeça'],
    ['pescoco', 'Pescoço'],
    ['capa', 'Capa'],
    ['corpo', 'Armadura'],
    ['mao', 'Mão'],
    ['luvas', 'Luvas'],
    ['cinto', 'Cinto'],
    ['botas', 'Botas'],
    ['anel', 'Anel']
  ];

  const TIPOS = [
    ['arma', 'Arma'],
    ['armadura', 'Armadura'],
    ['escudo', 'Escudo'],
    ['equipamento', 'Equipamento'],
    ['ferramenta', 'Ferramenta'],
    ['consumivel', 'Consumível'],
    ['magico', 'Item mágico'],
    ['tesouro', 'Tesouro'],
    ['outro', 'Outro']
  ];

  const MOEDAS = [
    { id: 'pc', nome: 'Cobre', sigla: 'PC', cp: 1 },
    { id: 'pp', nome: 'Prata', sigla: 'PP', cp: 10 },
    { id: 'pe', nome: 'Electro', sigla: 'PE', cp: 50 },
    { id: 'po', nome: 'Ouro', sigla: 'PO', cp: 100 },
    { id: 'pl', nome: 'Platina', sigla: 'PL', cp: 1000 }
  ];

  const MAX_SINTONIA = 3;
  const PESO_MOEDA = kg(1) / 50;

  const arma = (nome, dano, peso, valor, extra) =>
    Object.assign({ nome, tipo: 'arma', slot: 'mao', dano, peso: kg(peso), valor }, extra || {});
  const arm = (nome, caBase, categoria, peso, valor) =>
    ({ nome, tipo: 'armadura', slot: 'corpo', caBase, categoria, peso: kg(peso), valor });
  const eq = (nome, peso, valor, extra) =>
    Object.assign({ nome, tipo: 'equipamento', slot: '', peso: kg(peso), valor }, extra || {});

  const CATALOGO = [
    arma('Adaga', '1d4 perfurante', 1, 2, { propriedades: 'Acuidade, leve, arremesso (6/18 m)' }),
    arma('Bordão', '1d6 contundente', 4, 0.2, { propriedades: 'Versátil (1d8)' }),
    arma('Maça', '1d6 contundente', 4, 5),
    arma('Lança', '1d6 perfurante', 3, 1, { propriedades: 'Arremesso (6/18 m), versátil (1d8)' }),
    arma('Machadinha', '1d6 cortante', 2, 5, { propriedades: 'Leve, arremesso (6/18 m)' }),
    arma('Espada curta', '1d6 perfurante', 2, 10, { propriedades: 'Acuidade, leve' }),
    arma('Rapieira', '1d8 perfurante', 2, 25, { propriedades: 'Acuidade' }),
    arma('Espada longa', '1d8 cortante', 3, 15, { propriedades: 'Versátil (1d10)' }),
    arma('Machado grande', '1d12 cortante', 7, 30, { duasMaos: true, propriedades: 'Pesada, duas mãos' }),
    arma('Montante', '2d6 cortante', 6, 50, { duasMaos: true, propriedades: 'Pesada, duas mãos' }),
    arma('Arco curto', '1d6 perfurante', 2, 25, { duasMaos: true, propriedades: 'Munição (24/96 m), duas mãos' }),
    arma('Arco longo', '1d8 perfurante', 2, 50, { duasMaos: true, propriedades: 'Munição (45/180 m), pesada, duas mãos' }),
    arma('Besta leve', '1d8 perfurante', 5, 25, { duasMaos: true, propriedades: 'Munição (24/96 m), recarga, duas mãos' }),
    arm('Acolchoada', 11, 'leve', 8, 5),
    arm('Couro', 11, 'leve', 10, 10),
    arm('Couro batido', 12, 'leve', 13, 45),
    arm('Gibão de peles', 12, 'media', 12, 10),
    arm('Camisão de malha', 13, 'media', 20, 50),
    arm('Brunea', 14, 'media', 45, 50),
    arm('Peitoral', 14, 'media', 20, 400),
    arm('Meia-armadura', 15, 'media', 40, 750),
    arm('Cota de anéis', 14, 'pesada', 40, 30),
    arm('Cota de malha', 16, 'pesada', 55, 75),
    arm('Talas', 17, 'pesada', 60, 200),
    arm('Armadura de placas', 18, 'pesada', 65, 1500),
    { nome: 'Escudo', tipo: 'escudo', slot: 'mao', caBonus: 2, peso: kg(6), valor: 10 },
    eq('Mochila', 5, 2),
    eq('Saco de dormir', 7, 1),
    eq('Barraca (2 pessoas)', 20, 2),
    eq('Corda de cânhamo (15 m)', 10, 1),
    eq('Pé de cabra', 5, 2),
    eq('Lanterna', 2, 5),
    eq('Pederneira e isqueiro', 1, 0.5),
    eq('Odre', 5, 0.2),
    { nome: 'Tocha', tipo: 'equipamento', slot: '', peso: kg(1), valor: 0.01 },
    { nome: 'Frasco de óleo', tipo: 'equipamento', slot: '', peso: kg(1), valor: 0.1 },
    { nome: 'Ração (1 dia)', tipo: 'consumivel', slot: '', peso: kg(2), valor: 0.5 },
    { nome: 'Poção de cura', tipo: 'consumivel', slot: '', peso: kg(0.5), valor: 50, descricao: 'Recupera 2d4 + 2 pontos de vida.' },
    { nome: 'Kit de curandeiro', tipo: 'consumivel', slot: '', peso: kg(3), valor: 5, descricao: '10 usos. Estabiliza uma criatura a 0 PV.' },
    { nome: 'Ferramentas de ladrão', tipo: 'ferramenta', slot: '', peso: kg(1), valor: 25 }
  ];

  const MAPA_SLOTS = {
    cabeca: ['cabeca'],
    pescoco: ['pescoco'],
    capa: ['capa'],
    corpo: ['corpo'],
    mao: ['maoPrincipal', 'maoSecundaria'],
    luvas: ['luvas'],
    cinto: ['cinto'],
    botas: ['botas'],
    anel: ['anel1', 'anel2']
  };

  const esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const num = (v, padrao) => {
    const n = parseFloat(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : padrao || 0;
  };

  const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString('pt-BR');

  const uid = () =>
    (global.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  const mod = (v) => Math.floor((num(v, 10) - 10) / 2);

  const garantir = (p) => {
    if (!p.inventario || typeof p.inventario !== 'object') p.inventario = {};
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
      } catch (e) {}
    }
    return garantir(p);
  };

  const persistir = (p, o) => {
    if (o && o.chaveLocal) {
      try { localStorage.setItem(o.chaveLocal, JSON.stringify(p.inventario)); } catch (e) {}
    }
    if (o && typeof o.aoMudar === 'function') o.aoMudar(p.inventario, p);
  };

  const empilhar = (inv, base) => {
    const copia = JSON.parse(JSON.stringify(base));
    delete copia.busca;
    const existente = inv.itens.find(
      (i) => i.nome === copia.nome && !i.equipado && !i.requerSintonia && i.tipo !== 'magico' && !i.bonus
    );
    if (existente) {
      existente.qtd = num(existente.qtd, 1) + 1;
    } else {
      inv.itens.push(Object.assign({ qtd: 1, equipado: '', sintonizado: false }, copia, { id: uid() }));
    }
  };

  const norm = (s) => String(s == null ? '' : s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const numero = (txt) => {
    let t = String(txt == null ? '' : txt).trim();
    const f = t.match(/(\d+)\s*\/\s*(\d+)/);
    if (f && +f[2]) return +f[1] / +f[2];
    const m = t.match(/\d[\d.,]*/);
    if (!m) return 0;
    t = m[0];
    if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) t = t.replace(/,/g, '');
    else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, '').replace(',', '.');
    else t = t.replace(',', '.');
    const n = parseFloat(t);
    return Number.isFinite(n) ? n : 0;
  };

  const pesoDe = (txt) => {
    const t = String(txt == null ? '' : txt);
    if (!t || /carga|capacidade/i.test(t) || /^\s*[—–-]\s*$/.test(t)) return 0;
    const m = t.match(/(\d+\s*\/\s*\d+|\d[\d.,]*)\s*(lb|libras?|kg)?/i);
    if (!m) return 0;
    const v = numero(m[1]);
    return /kg/i.test(m[2] || '') ? Math.round(v * 100) / 100 : kg(v);
  };

  const MOEDA_PO = { CP: 0.01, SP: 0.1, EP: 0.5, GP: 1, PP: 10, PC: 0.01, PE: 0.5, PO: 1, PL: 10 };

  const valorDe = (txt) => {
    const m = String(txt == null ? '' : txt).match(/(\d+\s*\/\s*\d+|\d[\d.,]*)\s*(CP|SP|EP|GP|PP|PC|PE|PO|PL)\b/i);
    if (!m) return 0;
    return Math.round(numero(m[1]) * MOEDA_PO[m[2].toUpperCase()] * 10000) / 10000;
  };

  const deCatalogo = (x) => {
    const nome = x.n || x.en || 'Item';
    const cat = norm((x.categoria || '') + ' ' + (x.tipo || ''));
    const todo = norm(cat + ' ' + nome + ' ' + (x.en || ''));
    const prop = norm(x.propriedades);
    const sint = String(x.sintonia == null ? '' : x.sintonia).trim();
    const requerSintonia = !!sint && !/^[—–-]$/.test(sint) && !/^(n[aã]o|no)\b/i.test(sint);
    const bonusM = nome.match(/\+\s*(\d)\b/) || String(x.en || '').match(/\+\s*(\d)\b/);
    const item = {
      nome,
      tipo: 'equipamento',
      slot: '',
      qtd: 1,
      peso: pesoDe(x.peso),
      valor: valorDe(x.preco),
      descricao: x.descricao ? String(x.descricao).trim() : '',
      busca: norm(nome + ' ' + (x.en || '')),
      requerSintonia
    };
    if (x.raridade) item.raridade = x.raridade;
    const ehArmadura = /armadura|armor/.test(cat) && !/escudo|shield/.test(norm(nome + ' ' + (x.en || '')));
    const ehEscudo = /(^|\s)(escudo|shield)(\s|$)/.test(norm(nome)) || /^shield$/i.test(String(x.en || '').trim());
    const ehArma = /(^|\s)(arma|weapon)/.test(cat);
    if (ehEscudo && /armadura|armor|escudo|shield/.test(cat + ' ' + norm(nome))) {
      item.tipo = 'escudo';
      item.slot = 'mao';
      const ca = String(x.classeArmadura || '').match(/\d+/);
      item.caBonus = ca ? +ca[0] : 2;
      if (bonusM) item.bonus = +bonusM[1];
    } else if (ehArmadura) {
      item.tipo = 'armadura';
      item.slot = 'corpo';
      const ca = String(x.classeArmadura || '').match(/\d+/);
      item.caBase = ca ? +ca[0] : 10;
      item.categoria = /pesad|heavy/.test(cat + ' ' + norm(x.classeArmadura)) ? 'pesada'
        : /med|medium/.test(cat) ? 'media' : 'leve';
      if (x.classeArmadura) item.propriedades = String(x.classeArmadura);
      if (bonusM) item.bonus = +bonusM[1];
    } else if (ehArma) {
      item.tipo = 'arma';
      item.slot = 'mao';
      item.dano = x.dano ? String(x.dano) : '';
      item.propriedades = x.propriedades && x.propriedades !== '—' ? String(x.propriedades) : '';
      item.duasMaos = /duas maos|two-handed/.test(prop);
      if (bonusM) item.bonus = +bonusM[1];
    } else if (x.magico) {
      item.tipo = 'magico';
      if (/(^|\s)(anel|ring)(\s|$)/.test(todo)) item.slot = 'anel';
      else if (/capa|cloak|manto|cape/.test(todo)) item.slot = 'capa';
      else if (/botas|boots|sandalias|slippers/.test(todo)) item.slot = 'botas';
      else if (/luvas|gauntlets?|gloves|bracers?|braceletes?|manoplas/.test(todo)) item.slot = 'luvas';
      else if (/cinto|belt/.test(todo)) item.slot = 'cinto';
      else if (/amuleto|colar|medalhao|amulet|necklace|periapt|brooch|broche|pingente/.test(todo)) item.slot = 'pescoco';
      else if (/elmo|chapeu|capacete|helm|hat|circlet|tiara|goggles|oculos|coroa|crown|headband|faixa/.test(todo)) item.slot = 'cabeca';
      if (/pocao|potion|elixir|pergaminho|scroll|municao|ammunition|oleo|oil/.test(todo)) {
        item.tipo = 'consumivel';
        item.slot = '';
      }
    } else if (/pocao|potion|elixir|pergaminho|scroll|municao|ammunition|antitoxina|antitoxin|fogo de alquimista|acido|acid/.test(todo)) {
      item.tipo = 'consumivel';
    } else if (/ferramenta|tool|kit/.test(cat)) {
      item.tipo = 'ferramenta';
    }
    return item;
  };

  const slotsDoItem = (item) => {
    if (!item.slot) return [];
    if (item.tipo === 'escudo') return ['maoSecundaria'];
    if (item.duasMaos) return ['maoPrincipal'];
    return MAPA_SLOTS[item.slot] || [];
  };

  const calcularCA = (itens, destreza) => {
    const d = mod(destreza);
    const armadura = itens.find((i) => i.equipado === 'corpo' && i.tipo === 'armadura');
    const escudo = itens.find((i) => i.equipado === 'maoSecundaria' && i.tipo === 'escudo');
    let ca = 10 + d;
    if (armadura) {
      const base = num(armadura.caBase, 10);
      if (armadura.categoria === 'pesada') ca = base;
      else if (armadura.categoria === 'media') ca = base + Math.min(d, 2);
      else ca = base + d;
      ca += num(armadura.bonus, 0);
    }
    if (escudo) ca += num(escudo.caBonus, 2) + num(escudo.bonus, 0);
    return ca;
  };

  const CSS = `
.inv,.inv-dlg{--f:var(--bg,#121212);--p:var(--card,#1e1e20);--p2:var(--box,#252528);--b:var(--line,#3a3a3f);--t:var(--ink,#f2f2f2);--s:var(--mute,#a0a0a6);--d:var(--red,#c53131);--g:var(--ok,#5bbf8f);--a:#e0a84a;--r:#ff6f64;--on:var(--redink,#fff)}
.inv{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;color:var(--t);font:14px/1.4 Roboto,system-ui,-apple-system,"Segoe UI",sans-serif;box-sizing:border-box}
.inv *{box-sizing:border-box}
.inv button,.inv input,.inv select,.inv textarea,.inv-dlg button,.inv-dlg input,.inv-dlg select,.inv-dlg textarea{font:inherit;color:inherit}
.inv-resumo{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
.inv-card{background:var(--p);border:1px solid var(--b);border-radius:8px;padding:8px 12px;min-width:0}
.inv-card small{display:block;color:var(--s);font-size:12px}
.inv-card strong{font-size:20px;font-weight:600}
.inv-peso{grid-column:span 2}
.inv-barra{height:8px;border-radius:4px;background:var(--f);margin-top:6px;overflow:hidden}
.inv-barra i{display:block;height:100%;background:var(--g);transition:width .2s}
.inv-barra.alto i{background:var(--a)}
.inv-barra.excesso i{background:var(--r)}
.inv-corpo{display:grid;grid-template-columns:minmax(220px,280px) minmax(0,1fr) minmax(190px,230px);gap:10px;min-height:0}
.inv-col{background:var(--p);border:1px solid var(--b);border-radius:8px;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.inv-col>h3{margin:0;padding:10px 12px;font-size:15px;font-weight:600;border-bottom:1px solid var(--b)}
.inv-rolagem{overflow:auto;min-height:0;flex:1;padding:10px}
.inv-slot{width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px;text-align:left;background:var(--p2);border:1px dashed var(--b);border-radius:6px;padding:7px 10px;margin-bottom:6px;cursor:pointer}
.inv-slot span{color:var(--s);font-size:12px;flex:none}
.inv-slot b{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.inv-slot.cheio{border-style:solid;border-color:var(--d)}
.inv-slot:hover,.inv button:hover{border-color:var(--d)}
.inv-barra-ferr{display:flex;gap:6px;padding:10px;border-bottom:1px solid var(--b);flex-wrap:wrap}
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
.inv-dlg *{box-sizing:border-box}
.inv-vazio{color:var(--s);text-align:center;padding:24px 8px}
.inv-moeda{display:flex;align-items:center;gap:6px;margin-bottom:8px}
.inv-moeda label{width:54px;color:var(--s);font-size:12px}
.inv-moeda input{width:100%;min-width:0;background:var(--f);border:1px solid var(--b);border-radius:6px;padding:5px 8px;text-align:right}
.inv-dlg{font:14px/1.4 Roboto,system-ui,sans-serif;background:var(--p);color:var(--t);border:1px solid var(--b);border-radius:10px;padding:0;width:min(520px,94vw);max-height:90vh}
.inv-dlg::backdrop{background:rgba(0,0,0,.6)}
.inv-dlg-c{padding:14px;max-height:90vh;overflow:auto;display:flex;flex-direction:column;gap:10px}
.inv-dlg h3{margin:0;font-size:16px}
.inv-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.inv-grid label{display:flex;flex-direction:column;gap:3px;color:var(--s);font-size:12px}
.inv-grid .l{grid-column:1/-1}
.inv-grid input,.inv-grid select,.inv-grid textarea{background:var(--f);border:1px solid var(--b);border-radius:6px;padding:6px 8px;color:var(--t)}
.inv-chk{flex-direction:row!important;align-items:center;gap:6px!important;color:var(--t)!important;font-size:14px!important}
.inv-dlg-rod{display:flex;justify-content:flex-end;gap:8px}
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
    if (!document.getElementById('inv-css')) {
      const st = document.createElement('style');
      st.id = 'inv-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    let inv = carregarLocal(personagem, opcoes);
    const catalogo = Array.isArray(opcoes.catalogo) && opcoes.catalogo.length ? opcoes.catalogo : CATALOGO;
    const estado = { busca: '', tipo: '' };

    const forca = () => {
      if (typeof opcoes.getForca === 'function') return num(opcoes.getForca(), 10);
      const a = personagem.atributos || {};
      return num(a.forca != null ? a.forca : a.for != null ? a.for : personagem.forca, 10);
    };
    const destreza = () => {
      if (typeof opcoes.getDestreza === 'function') return num(opcoes.getDestreza(), 10);
      const a = personagem.atributos || {};
      return num(a.destreza != null ? a.destreza : a.des != null ? a.des : personagem.destreza, 10);
    };

    const capacidade = () => Math.round(forca() * 15 * LB * 10) / 10;
    const pesoItens = () => inv.itens.reduce((s, i) => s + num(i.peso) * num(i.qtd, 1), 0);
    const pesoMoedas = () =>
      opcoes.pesoMoedas === false
        ? 0
        : MOEDAS.reduce((s, m) => s + num(inv.moedas[m.id]), 0) * PESO_MOEDA;
    const pesoTotal = () => pesoItens() + pesoMoedas();
    const sintonias = () => inv.itens.filter((i) => i.sintonizado).length;
    const valorItens = () => inv.itens.reduce((s, i) => s + num(i.valor) * num(i.qtd, 1), 0);
    const totalPO = () => MOEDAS.reduce((s, m) => s + num(inv.moedas[m.id]) * m.cp, 0) / 100;
    const emSlot = (id) => inv.itens.find((i) => i.equipado === id);

    container.innerHTML = '';
    const raiz = document.createElement('div');
    raiz.className = 'inv';
    raiz.innerHTML = `
      <div class="inv-resumo" data-r="resumo"></div>
      <div class="inv-corpo">
        <section class="inv-col"><h3>Equipado</h3><div class="inv-rolagem" data-r="slots"></div></section>
        <section class="inv-col">
          <h3>Mochila</h3>
          <div class="inv-barra-ferr">
            <input type="search" placeholder="Buscar item" data-r="busca" aria-label="Buscar item">
            <select data-r="filtro" aria-label="Filtrar por tipo"><option value="">Todos</option>${TIPOS.map((t) => `<option value="${t[0]}">${t[1]}</option>`).join('')}<option value="__eq">Equipados</option></select>
            <button class="inv-btn pri" data-a="catalogo">Adicionar item</button>
          </div>
          <div class="inv-rolagem" data-r="lista"></div>
        </section>
        <section class="inv-col"><h3>Moedas</h3><div class="inv-rolagem" data-r="moedas"></div></section>
      </div>`;
    container.appendChild(raiz);

    const dlg = document.createElement('dialog');
    dlg.className = 'inv-dlg';
    container.appendChild(dlg);

    const q = (r) => raiz.querySelector(`[data-r="${r}"]`);

    const salvar = () => {
      persistir(personagem, opcoes);
      renderizar();
    };

    const abrir = (html) => {
      dlg.innerHTML = `<div class="inv-dlg-c">${html}</div>`;
      if (!dlg.open) dlg.showModal();
    };
    const fechar = () => { if (dlg.open) dlg.close(); };
    dlg.addEventListener('click', (e) => { if (e.target === dlg) fechar(); });

    const renderResumo = () => {
      const cap = capacidade();
      const peso = pesoTotal();
      const pct = Math.min(100, (peso / cap) * 100);
      const cls = peso > cap ? 'excesso' : peso > cap * 0.75 ? 'alto' : '';
      q('resumo').innerHTML = `
        <div class="inv-card"><small>Classe de Armadura</small><strong>${calcularCA(inv.itens, destreza())}</strong></div>
        <div class="inv-card inv-peso"><small>Carga: ${fmt(peso)} / ${fmt(cap)} kg${peso > cap ? ' — acima da capacidade' : ''}</small>
          <div class="inv-barra ${cls}"><i style="width:${pct}%"></i></div></div>
        <div class="inv-card"><small>Sintonia</small><strong>${sintonias()} / ${MAX_SINTONIA}</strong></div>
        <div class="inv-card"><small>Patrimônio</small><strong>${fmt(totalPO() + valorItens())} PO</strong></div>`;
    };

    const renderSlots = () => {
      q('slots').innerHTML = SLOTS.map((s) => {
        const it = emSlot(s.id);
        return `<button class="inv-slot ${it ? 'cheio' : ''}" data-a="slot" data-s="${s.id}">
          <span>${s.nome}</span><b>${it ? esc(it.nome) : 'Vazio'}</b></button>`;
      }).join('');
    };

    const itensFiltrados = () => {
      const b = estado.busca.trim().toLowerCase();
      return inv.itens.filter((i) => {
        if (estado.tipo === '__eq' && !i.equipado) return false;
        if (estado.tipo && estado.tipo !== '__eq' && i.tipo !== estado.tipo) return false;
        if (b && !(i.nome || '').toLowerCase().includes(b)) return false;
        return true;
      });
    };

    const nomeSlot = (id) => (SLOTS.find((s) => s.id === id) || {}).nome || '';

    const renderLista = () => {
      const itens = itensFiltrados();
      if (!itens.length) {
        q('lista').innerHTML = `<div class="inv-vazio">${inv.itens.length ? 'Nenhum item encontrado.' : 'A mochila está vazia. Use “Adicionar item” para começar.'}</div>`;
        return;
      }
      q('lista').innerHTML = itens.map((i) => {
        const podeEquipar = slotsDoItem(i).length > 0;
        const detalhes = [
          i.tipo === 'arma' && i.dano ? `Dano ${esc(i.dano)}${i.bonus ? ' +' + i.bonus : ''}` : '',
          i.tipo === 'armadura' ? `CA ${i.caBase}${i.categoria === 'leve' ? ' + Des' : i.categoria === 'media' ? ' + Des (máx. 2)' : ''}${i.bonus ? ' +' + i.bonus : ''}` : '',
          i.tipo === 'escudo' ? `CA +${num(i.caBonus, 2) + num(i.bonus)}` : '',
          i.propriedades ? esc(i.propriedades) : '',
          `${fmt(num(i.peso) * num(i.qtd, 1))} kg`,
          i.valor ? `${fmt(num(i.valor) * num(i.qtd, 1))} PO` : ''
        ].filter(Boolean).join(' · ');
        return `<div class="inv-item ${i.equipado ? 'eqp' : ''}" data-id="${i.id}">
          <div class="inv-linha1">
            <span class="inv-nome" title="${esc(i.nome)}">${esc(i.nome)}${i.equipado ? `<span class="inv-tag">${nomeSlot(i.equipado)}</span>` : ''}${i.sintonizado ? '<span class="inv-tag sint">Sintonizado</span>' : ''}</span>
            <span class="inv-qtd"><button class="inv-btn mini" data-a="menos" aria-label="Diminuir">−</button><span>${i.qtd}</span><button class="inv-btn mini" data-a="mais" aria-label="Aumentar">+</button></span>
          </div>
          <div class="inv-meta">${detalhes}</div>
          ${i.descricao ? `<div class="inv-meta" title="${esc(i.descricao)}">${esc(i.descricao.length > 170 ? i.descricao.slice(0, 170) + '…' : i.descricao)}</div>` : ''}
          <div class="inv-acoes">
            ${podeEquipar ? `<button class="inv-btn mini ${i.equipado ? 'on' : ''}" data-a="equipar">${i.equipado ? 'Desequipar' : 'Equipar'}</button>` : ''}
            ${i.requerSintonia ? `<button class="inv-btn mini ${i.sintonizado ? 'on' : ''}" data-a="sintonizar">${i.sintonizado ? 'Romper sintonia' : 'Sintonizar'}</button>` : ''}
            ${i.tipo === 'consumivel' ? '<button class="inv-btn mini" data-a="usar">Usar</button>' : ''}
            <button class="inv-btn mini" data-a="editar">Editar</button>
            <button class="inv-btn mini perigo" data-a="remover">Descartar</button>
          </div>
        </div>`;
      }).join('');
    };

    const renderMoedas = () => {
      q('moedas').innerHTML = MOEDAS.map((m) => `
        <div class="inv-moeda"><label for="inv-m-${m.id}">${m.nome} (${m.sigla})</label>
        <input id="inv-m-${m.id}" type="number" min="0" step="1" value="${num(inv.moedas[m.id])}" data-a="moeda" data-m="${m.id}"></div>`).join('') + `
        <div class="inv-meta" style="margin:10px 0">Total: ${fmt(totalPO())} PO</div>
        <button class="inv-btn" data-a="consolidar" style="width:100%;margin-bottom:6px">Consolidar moedas</button>
        <button class="inv-btn" data-a="pagar" style="width:100%">Gastar ouro</button>`;
    };

    const renderizar = () => {
      renderResumo();
      renderSlots();
      renderLista();
      renderMoedas();
    };

    const equipar = (item, slotId) => {
      const candidatos = slotsDoItem(item);
      if (!candidatos.length) return;
      let alvo = slotId && candidatos.includes(slotId) ? slotId : candidatos.find((s) => !emSlot(s)) || candidatos[0];
      const ocupante = emSlot(alvo);
      if (ocupante) ocupante.equipado = '';
      if (item.duasMaos) {
        const sec = emSlot('maoSecundaria');
        if (sec) sec.equipado = '';
      }
      if (alvo === 'maoSecundaria') {
        const prin = emSlot('maoPrincipal');
        if (prin && prin.duasMaos) prin.equipado = '';
      }
      item.equipado = alvo;
    };

    const acharItem = (el) => {
      const c = el.closest('[data-id]');
      return c ? inv.itens.find((i) => i.id === c.dataset.id) : null;
    };

    const formItem = (item, novo) => {
      const i = item || { nome: '', tipo: 'equipamento', qtd: 1, peso: 0, valor: 0, slot: '' };
      abrir(`
        <h3>${novo ? 'Novo item' : 'Editar item'}</h3>
        <div class="inv-grid">
          <label class="l">Nome<input data-f="nome" value="${esc(i.nome)}"></label>
          <label>Tipo<select data-f="tipo">${TIPOS.map((t) => `<option value="${t[0]}" ${i.tipo === t[0] ? 'selected' : ''}>${t[1]}</option>`).join('')}</select></label>
          <label>Onde equipa<select data-f="slot">${SLOT_TIPOS.map((t) => `<option value="${t[0]}" ${(i.slot || '') === t[0] ? 'selected' : ''}>${t[1]}</option>`).join('')}</select></label>
          <label>Quantidade<input type="number" min="0" step="1" data-f="qtd" value="${num(i.qtd, 1)}"></label>
          <label>Peso unitário (kg)<input type="number" min="0" step="0.01" data-f="peso" value="${num(i.peso)}"></label>
          <label>Valor unitário (PO)<input type="number" min="0" step="0.01" data-f="valor" value="${num(i.valor)}"></label>
          <label>Bônus mágico<input type="number" step="1" data-f="bonus" value="${num(i.bonus)}"></label>
          <label>Dano<input data-f="dano" value="${esc(i.dano || '')}" placeholder="1d8 cortante"></label>
          <label>CA base (armadura)<input type="number" step="1" data-f="caBase" value="${i.caBase != null ? i.caBase : ''}"></label>
          <label>Categoria da armadura<select data-f="categoria"><option value="">—</option>${['leve', 'media', 'pesada'].map((c) => `<option value="${c}" ${i.categoria === c ? 'selected' : ''}>${c === 'media' ? 'média' : c}</option>`).join('')}</select></label>
          <label>Bônus de CA (escudo)<input type="number" step="1" data-f="caBonus" value="${i.caBonus != null ? i.caBonus : ''}"></label>
          <label>Propriedades<input data-f="propriedades" value="${esc(i.propriedades || '')}"></label>
          <label class="l">Descrição<textarea data-f="descricao" rows="3">${esc(i.descricao || '')}</textarea></label>
          <label class="inv-chk"><input type="checkbox" data-f="duasMaos" ${i.duasMaos ? 'checked' : ''}> Duas mãos</label>
          <label class="inv-chk"><input type="checkbox" data-f="requerSintonia" ${i.requerSintonia ? 'checked' : ''}> Requer sintonia</label>
        </div>
        <div class="inv-dlg-rod"><button class="inv-btn" data-d="fechar">Cancelar</button><button class="inv-btn pri" data-d="salvar-item">Salvar</button></div>`);
      dlg.dataset.editando = novo ? '' : i.id;
    };

    const lerForm = () => {
      const o = {};
      dlg.querySelectorAll('[data-f]').forEach((el) => {
        o[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value;
      });
      return o;
    };

    const salvarForm = () => {
      const f = lerForm();
      const nome = (f.nome || '').trim();
      if (!nome) { dlg.querySelector('[data-f="nome"]').focus(); return; }
      const dados = {
        nome,
        tipo: f.tipo,
        slot: f.slot,
        qtd: Math.max(0, Math.floor(num(f.qtd, 1))),
        peso: Math.max(0, num(f.peso)),
        valor: Math.max(0, num(f.valor)),
        bonus: Math.floor(num(f.bonus)),
        dano: f.dano.trim(),
        caBase: f.caBase === '' ? undefined : Math.floor(num(f.caBase)),
        categoria: f.categoria || undefined,
        caBonus: f.caBonus === '' ? undefined : Math.floor(num(f.caBonus)),
        propriedades: f.propriedades.trim(),
        descricao: f.descricao.trim(),
        duasMaos: !!f.duasMaos,
        requerSintonia: !!f.requerSintonia
      };
      const idEd = dlg.dataset.editando;
      if (idEd) {
        const it = inv.itens.find((x) => x.id === idEd);
        if (it) {
          Object.assign(it, dados);
          if (!it.requerSintonia) it.sintonizado = false;
          if (it.equipado && !slotsDoItem(it).concat(MAPA_SLOTS[it.slot] || []).includes(it.equipado)) it.equipado = '';
        }
      } else {
        inv.itens.push(Object.assign({ id: uid(), equipado: '', sintonizado: false }, dados));
      }
      fechar();
      salvar();
    };

    const adicionarItem = (base) => {
      empilhar(inv, base);
      salvar();
    };

    const abrirCatalogo = () => {
      const montarLista = (b) => {
        const t = norm(b).trim();
        const achados = catalogo.filter((c) => !t || (c.busca || norm(c.nome)).includes(t));
        const html = achados.slice(0, 80).map((c) => {
          const orig = catalogo.indexOf(c);
          const info = [
            c.dano,
            c.tipo === 'armadura' ? 'CA ' + c.caBase : '',
            c.tipo === 'escudo' ? 'CA +' + c.caBonus : '',
            c.raridade || '',
            fmt(c.peso) + ' kg',
            c.valor ? fmt(c.valor) + ' PO' : ''
          ].filter(Boolean).join(' · ');
          return `<div class="inv-cat"><div><b>${esc(c.nome)}</b><br><small>${esc(info)}</small></div>
            <button class="inv-btn mini" data-d="cat" data-i="${orig}">Adicionar</button></div>`;
        }).join('');
        const resto = achados.length > 80 ? `<div class="inv-vazio">Mostrando 80 de ${achados.length}. Refine a busca.</div>` : '';
        return html ? html + resto : '<div class="inv-vazio">Nada encontrado.</div>';
      };
      abrir(`
        <h3>Adicionar item</h3>
        <div class="inv-barra-ferr" style="padding:0;border:0">
          <input type="search" data-d="busca-cat" placeholder="Buscar no catálogo" aria-label="Buscar no catálogo">
          <button class="inv-btn pri" data-d="novo">Item personalizado</button>
        </div>
        <div data-d="lista-cat" style="display:flex;flex-direction:column;gap:6px;overflow:auto;max-height:50vh">${montarLista('')}</div>
        <div class="inv-dlg-rod"><button class="inv-btn" data-d="fechar">Fechar</button></div>`);
      dlg._montarLista = montarLista;
    };

    const abrirSlot = (slotId) => {
      const s = SLOTS.find((x) => x.id === slotId);
      const atual = emSlot(slotId);
      const compat = inv.itens.filter((i) => !i.equipado && slotsDoItem(i).concat(i.slot && !i.duasMaos && i.tipo !== 'escudo' ? MAPA_SLOTS[i.slot] || [] : []).includes(slotId));
      abrir(`
        <h3>${s.nome}</h3>
        ${atual ? `<div class="inv-cat"><div><b>${esc(atual.nome)}</b></div><button class="inv-btn mini" data-d="desequipar" data-id="${atual.id}">Desequipar</button></div>` : ''}
        <div style="display:flex;flex-direction:column;gap:6px;overflow:auto;max-height:50vh">
          ${compat.length ? compat.map((i) => `<div class="inv-cat"><div><b>${esc(i.nome)}</b></div><button class="inv-btn mini" data-d="equipar-em" data-id="${i.id}" data-s="${slotId}">Equipar</button></div>`).join('') : '<div class="inv-vazio">Nenhum item compatível na mochila.</div>'}
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

    const gastar = (po) => {
      let restante = Math.round(po * 100);
      const total = Math.round(totalPO() * 100);
      if (restante <= 0 || restante > total) return false;
      let cp = total - restante;
      const novo = { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 };
      [...MOEDAS].reverse().forEach((m) => {
        if (m.id === 'pe') return;
        novo[m.id] = Math.floor(cp / m.cp);
        cp -= novo[m.id] * m.cp;
      });
      inv.moedas = novo;
      return true;
    };

    raiz.addEventListener('input', (e) => {
      const el = e.target;
      if (el.dataset.r === 'busca') { estado.busca = el.value; renderLista(); }
    });

    raiz.addEventListener('change', (e) => {
      const el = e.target;
      if (el.dataset.r === 'filtro') { estado.tipo = el.value; renderLista(); }
      if (el.dataset.a === 'moeda') {
        inv.moedas[el.dataset.m] = Math.max(0, Math.floor(num(el.value)));
        salvar();
      }
    });

    raiz.addEventListener('click', (e) => {
      const b = e.target.closest('[data-a]');
      if (!b || b.tagName === 'INPUT') return;
      const a = b.dataset.a;
      if (a === 'catalogo') return abrirCatalogo();
      if (a === 'slot') return abrirSlot(b.dataset.s);
      if (a === 'consolidar') {
        let cp = MOEDAS.reduce((s, m) => s + num(inv.moedas[m.id]) * m.cp, 0);
        const novo = { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 };
        novo.pl = Math.floor(cp / 1000); cp -= novo.pl * 1000;
        novo.po = Math.floor(cp / 100); cp -= novo.po * 100;
        novo.pp = Math.floor(cp / 10); cp -= novo.pp * 10;
        novo.pc = cp;
        inv.moedas = novo;
        return salvar();
      }
      if (a === 'pagar') return abrirPagar();
      const it = acharItem(b);
      if (!it) return;
      if (a === 'mais') it.qtd = num(it.qtd, 1) + 1;
      if (a === 'menos') {
        it.qtd = Math.max(0, num(it.qtd, 1) - 1);
        if (it.qtd === 0) inv.itens = inv.itens.filter((x) => x !== it);
      }
      if (a === 'equipar') { if (it.equipado) it.equipado = ''; else equipar(it); }
      if (a === 'sintonizar') {
        if (it.sintonizado) it.sintonizado = false;
        else if (sintonias() >= MAX_SINTONIA) {
          abrir(`<h3>Sintonia no limite</h3><div class="inv-meta">Um personagem só pode estar sintonizado com ${MAX_SINTONIA} itens ao mesmo tempo. Rompa a sintonia de outro item primeiro.</div><div class="inv-dlg-rod"><button class="inv-btn pri" data-d="fechar">Entendi</button></div>`);
          return;
        } else it.sintonizado = true;
      }
      if (a === 'usar') {
        if (typeof opcoes.aoUsar === 'function') opcoes.aoUsar(it, personagem);
        it.qtd = Math.max(0, num(it.qtd, 1) - 1);
        if (it.qtd === 0) inv.itens = inv.itens.filter((x) => x !== it);
      }
      if (a === 'editar') return formItem(it, false);
      if (a === 'remover') {
        abrir(`<h3>Descartar ${esc(it.nome)}?</h3><div class="inv-meta">O item será removido da mochila.</div><div class="inv-dlg-rod"><button class="inv-btn" data-d="fechar">Cancelar</button><button class="inv-btn perigo" data-d="confirmar-remover" data-id="${it.id}">Descartar</button></div>`);
        return;
      }
      salvar();
    });

    dlg.addEventListener('input', (e) => {
      if (e.target.dataset.d === 'busca-cat' && dlg._montarLista) {
        dlg.querySelector('[data-d="lista-cat"]').innerHTML = dlg._montarLista(e.target.value);
      }
    });

    dlg.addEventListener('click', (e) => {
      const b = e.target.closest('[data-d]');
      if (!b || b.tagName === 'INPUT') return;
      const d = b.dataset.d;
      if (d === 'fechar') return fechar();
      if (d === 'novo') return formItem(null, true);
      if (d === 'salvar-item') return salvarForm();
      if (d === 'cat') { adicionarItem(catalogo[+b.dataset.i]); const novoBtn = dlg.querySelector(`[data-d="cat"][data-i="${b.dataset.i}"]`); if (novoBtn) novoBtn.textContent = 'Adicionado ✓'; return; }
      const it = b.dataset.id ? inv.itens.find((x) => x.id === b.dataset.id) : null;
      if (d === 'desequipar' && it) { it.equipado = ''; fechar(); return salvar(); }
      if (d === 'equipar-em' && it) { equipar(it, b.dataset.s); fechar(); return salvar(); }
      if (d === 'confirmar-remover' && it) { inv.itens = inv.itens.filter((x) => x !== it); fechar(); return salvar(); }
      if (d === 'confirmar-pagar') {
        const v = num(dlg.querySelector('[data-f="valor"]').value);
        if (gastar(v)) { fechar(); salvar(); }
        else dlg.querySelector('[data-f="valor"]').style.borderColor = 'var(--r)';
      }
    });

    renderizar();

    return {
      atualizar() { inv = garantir(personagem); renderizar(); },
      dados() { return inv; },
      adicionar(item) { adicionarItem(item); },
      getCA() { return calcularCA(inv.itens, destreza()); },
      pesoTotal,
      capacidade,
      destruir() { container.innerHTML = ''; }
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
    catalogo: CATALOGO,
    calcularCA,
    slots: SLOTS,
    moedas: MOEDAS
  };
})(window);
