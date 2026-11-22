(function() {
  "use strict";
  if (window.Bestiary) return;
  var STORE_KEY = "animalysson:bestiario:v1";
  var SIZE_EN = { "Miúdo": "Tiny", "Pequeno": "Small", "Médio": "Medium", "Grande": "Large", "Enorme": "Huge", "Imenso": "Gargantuan" };
  var SIZES = Object.keys(SIZE_EN);
  var ATTRS = [["str", "FOR"], ["dex", "DES"], ["con", "CON"], ["int", "INT"], ["wis", "SAB"], ["cha", "CAR"]];
  var SECTIONS = [
    ["tracos", "Características", false],
    ["acoes", "Ações", true],
    ["acoesBonus", "Ações bônus", true],
    ["reacoes", "Reações", true],
    ["acoesLendarias", "Ações lendárias", true]
  ];
  var KVS = [
    ["deslocamento", "Deslocamento (em pés)", "deslocamento", "30"],
    ["salvaguardas", "Salvaguardas", "str", "3"],
    ["pericias", "Perícias", "perception", "4"],
    ["sentidos", "Sentidos", "visão no escuro", "60"]
  ];
  var LISTS = [
    ["idiomas", "Idiomas"],
    ["resistenciasDano", "Resistências a dano"],
    ["vulnerabilidadesDano", "Vulnerabilidades a dano"],
    ["imunidadesDano", "Imunidades a dano"],
    ["imunidadesCondicao", "Imunidades a condições"]
  ];
  var DMG_PT = {
    acid: "ácido",
    bludgeoning: "contundente",
    cold: "frio",
    fire: "fogo",
    force: "energia",
    lightning: "elétrico",
    necrotic: "necrótico",
    piercing: "perfurante",
    poison: "veneno",
    psychic: "psíquico",
    radiant: "radiante",
    slashing: "cortante",
    thunder: "trovejante"
  };
  var DMG_EN = {};
  Object.keys(DMG_PT).forEach(function(k) {
    DMG_EN[plain(DMG_PT[k])] = k;
  });
  var listeners = [];
  var store = readStore();
  window.MONSTERS = window.MONSTERS || [];
  var ORIG = window.MONSTERS.slice();
  var origById = {};
  ORIG.forEach(function(m) {
    origById[m.id] = m;
  });
  var root = null;
  var ui = { q: "", type: "Todos", cat: "Todos", sel: null, mode: "view", draft: null, isNew: false, ctx: null };
  function plain(s) {
    return String(s == null ? "" : s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function e(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function clone(o) {
    return o == null ? o : JSON.parse(JSON.stringify(o));
  }
  function toInt(v, def, min) {
    var n = parseInt(String(v).replace(",", "."), 10);
    if (!isFinite(n)) n = def;
    if (min != null && n < min) n = min;
    return n;
  }
  function crNum(s) {
    s = String(s == null ? "" : s).trim();
    var m = s.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (m) return Number(m[1]) / Number(m[2]);
    var n = Number(s.replace(",", "."));
    return isFinite(n) ? n : 0;
  }
  function modOf(v) {
    var n = Math.floor((Number(v) - 10) / 2);
    return isFinite(n) ? n : 0;
  }
  function fmtMod(v) {
    if (v == null || v === "" || !isFinite(Number(v))) return "—";
    var n = modOf(v);
    return n >= 0 ? "+" + n : String(n);
  }
  function isEmpty(v) {
    if (Array.isArray(v)) return !v.length;
    if (v && typeof v === "object") return !Object.keys(v).length;
    return v == null || v === "";
  }
  function newId() {
    return "custom:" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function readStore() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (s && typeof s === "object") {
        return {
          custom: Array.isArray(s.custom) ? s.custom : [],
          edits: s.edits && typeof s.edits === "object" ? s.edits : {}
        };
      }
    } catch (err) {
    }
    return { custom: [], edits: {} };
  }
  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
      return true;
    } catch (err) {
      return false;
    }
  }
  function legList(m) {
    var l = m.acoesLendarias;
    if (Array.isArray(l)) return l;
    if (l && Array.isArray(l.actions)) return l.actions;
    return [];
  }
  function setLeg(m, arr) {
    var l = m.acoesLendarias;
    if (l && !Array.isArray(l) && typeof l === "object") m.acoesLendarias = Object.assign({}, l, { actions: arr });
    else m.acoesLendarias = arr;
  }
  function entriesOf(m, key) {
    return key === "acoesLendarias" ? legList(m) : Array.isArray(m[key]) ? m[key] : [];
  }
  function statBlock(m) {
    var s = Object.assign({}, m.dados || {});
    function put(key, val) {
      if (isEmpty(val)) delete s[key];
      else s[key] = val;
    }
    s.schema_version = 1;
    s.ability_scores = m.atributos;
    s.speed = m.deslocamento;
    put("saving_throws", m.salvaguardas);
    put("skills", m.pericias);
    put("senses", m.sentidos);
    put("languages", m.idiomas);
    put("damage_resistances", m.resistenciasDano);
    put("damage_vulnerabilities", m.vulnerabilidadesDano);
    put("damage_immunities", m.imunidadesDano);
    put("condition_immunities", m.imunidadesCondicao);
    put("traits", m.tracos);
    put("actions", m.acoes);
    put("bonus_actions", m.acoesBonus);
    put("reactions", m.reacoes);
    put("legendary_actions", m.acoesLendarias);
    return s;
  }
  function finalize(d) {
    var m = clone(d);
    m.nome = String(m.nome || "").trim() || "Criatura sem nome";
    m.nomePt = m.nome;
    m.nomeEn = String(m.nomeEn || "").trim() || m.nome;
    m.tamanho = SIZE_EN[m.tamanho] ? m.tamanho : "Médio";
    m.tamanhoEn = SIZE_EN[m.tamanho];
    m.tipo = String(m.tipo || "").trim() || "Humanoide";
    var o = origById[m.id];
    if (!o || o.tipo !== m.tipo) m.tipoEn = m.tipo;
    m.nd = String(m.nd == null || m.nd === "" ? "0" : m.nd).trim();
    m.ndNumerico = crNum(m.nd);
    m.classeArmadura = toInt(m.classeArmadura, 10, 0);
    m.pontosVida = toInt(m.pontosVida, 1, 1);
    m.formulaVida = String(m.formulaVida || "").trim();
    var at = {};
    ATTRS.forEach(function(a) {
      at[a[0]] = toInt((m.atributos || {})[a[0]], 10, 1);
    });
    m.atributos = at;
    m.iniciativa = toInt(m.iniciativa, modOf(at.dex));
    KVS.forEach(function(k) {
      m[k[0]] = m[k[0]] || {};
    });
    LISTS.forEach(function(l) {
      m[l[0]] = Array.isArray(m[l[0]]) ? m[l[0]] : [];
    });
    SECTIONS.forEach(function(s) {
      if (s[0] === "acoesLendarias") {
        setLeg(m, legList(m).filter(keepEntry));
      } else {
        m[s[0]] = (Array.isArray(m[s[0]]) ? m[s[0]] : []).filter(keepEntry);
      }
    });
    m.categoria = m.categoria === "NPC" ? "NPC" : "Monstro";
    m.fonte = m.personalizado ? "Criatura personalizada" : m.fonte || "SRD 5.2.1 (PT-BR)";
    m.dados = statBlock(m);
    return m;
  }
  function keepEntry(x) {
    return x && (String(x.name || "").trim() || String(x.description || "").trim());
  }
  function rebuild() {
    var out = ORIG.map(function(m) {
      var ed = store.edits[m.id];
      if (ed) {
        var c = clone(ed);
        c.editado = true;
        return c;
      }
      return m;
    });
    store.custom.forEach(function(m) {
      var c = clone(m);
      c.personalizado = true;
      out.push(c);
    });
    var A = window.MONSTERS;
    A.length = 0;
    out.forEach(function(m) {
      A.push(m);
    });
    window.MONSTERS_VERSION = (window.MONSTERS_VERSION || 0) + 1;
    listeners.forEach(function(fn) {
      try {
        fn();
      } catch (err) {
      }
    });
  }
  function byId(id) {
    return window.MONSTERS.find(function(m) {
      return m.id === id;
    }) || null;
  }
  function blank() {
    var at = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    return {
      id: newId(),
      nome: "Novo NPC",
      nomePt: "Novo NPC",
      nomeEn: "Novo NPC",
      tamanho: "Médio",
      tamanhoEn: "Medium",
      tipo: "Humanoide",
      tipoEn: "Humanoide",
      nd: "0",
      ndNumerico: 0,
      classeArmadura: 10,
      pontosVida: 4,
      formulaVida: "",
      iniciativa: 0,
      atributos: at,
      deslocamento: { deslocamento: 30 },
      salvaguardas: {},
      pericias: {},
      sentidos: { "percepção passiva": 10 },
      idiomas: ["Comum"],
      resistenciasDano: [],
      vulnerabilidadesDano: [],
      imunidadesDano: [],
      imunidadesCondicao: [],
      tracos: [],
      acoes: [],
      acoesBonus: [],
      reacoes: [],
      acoesLendarias: [],
      categoria: "NPC",
      personalizado: true
    };
  }
  function dmgToText(list) {
    return (list || []).map(function(x) {
      var t = x.type ? DMG_PT[x.type] || x.type : "";
      return (String(x.dice || "") + (t ? " " + t : "")).trim();
    }).join("; ");
  }
  function parseDamage(text) {
    var out = [];
    String(text || "").split(";").forEach(function(seg) {
      var m = seg.match(/^\s*(\d+d\d+(?:\s*[+-]\s*\d+)?|\d+)\s*(.*)$/i);
      if (!m) return;
      var raw = m[2].trim();
      out.push({ dice: m[1].replace(/\s/g, ""), type: DMG_EN[plain(raw)] || raw });
    });
    return out;
  }
  function avgDice(dice) {
    var m = String(dice).match(/^(\d+)d(\d+)\s*([+-]\s*\d+)?$/i);
    if (!m) return toInt(dice, 0);
    var mod = m[3] ? parseInt(m[3].replace(/\s/g, ""), 10) : 0;
    return Math.max(0, Math.floor(Number(m[1]) * (Number(m[2]) + 1) / 2 + mod));
  }
  function kindOf(desc) {
    var s = plain(desc);
    if (/corpo a corpo/.test(s)) return "corpo";
    if (/distancia/.test(s)) return "dist";
    return "";
  }
  function genDesc(kind, bonus, reach, dmg) {
    var b = (bonus >= 0 ? "+" : "") + bonus;
    var r = String(reach || 1.5).replace(".", ",");
    var head = kind === "dist" ? "Ataque à distância com arma: " + b + " para acertar, alcance " + r + "/" + String(Math.round(Number(reach || 1.5) * 4 * 10) / 10).replace(".", ",") + " m, um alvo." : "Ataque corpo a corpo com arma: " + b + " para acertar, alcance " + r + " m, um alvo.";
    var parts = dmg.map(function(x) {
      return avgDice(x.dice) + " (" + x.dice.replace(/([+-])/g, " $1 ") + ") de dano " + (DMG_PT[x.type] || x.type || "");
    });
    return head + (parts.length ? " Acerto: " + parts.join(" mais ") + "." : "");
  }
  function injectStyle() {
    if (document.getElementById("bst-style")) return;
    var st = document.createElement("style");
    st.id = "bst-style";
    st.textContent = ".bst-ov{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:10px;box-sizing:border-box;font:14px/1.4 Roboto,system-ui,sans-serif;color:#f2f2f2}.bst-box{display:flex;flex-direction:column;width:min(1180px,100%);height:min(92vh,100%);background:#1e1e20;border:1px solid #3a3a3f;border-radius:10px;overflow:hidden}.bst-head{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #3a3a3f;background:#18181a}.bst-head h3{margin:0;font-size:17px;flex:1}.bst-head small{color:#a0a0a6}.bst-body{display:flex;flex:1;min-height:0}.bst-left{width:300px;flex:0 0 300px;display:flex;flex-direction:column;gap:8px;padding:10px;border-right:1px solid #3a3a3f;min-height:0;box-sizing:border-box}.bst-right{flex:1;min-width:0;overflow-y:auto;padding:14px;box-sizing:border-box}.bst-list{flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:5px}.bst-row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.bst-row>*{flex:1 1 0;min-width:0}.bst-ov input,.bst-ov select,.bst-ov textarea{font:inherit;color:#f2f2f2;background:#121212;border:1px solid #3a3a3f;border-radius:6px;padding:6px 8px;box-sizing:border-box;max-width:100%}.bst-ov textarea{width:100%;min-height:62px;resize:vertical}.bst-ov button{font:inherit;color:#f2f2f2;background:#2a2a2e;border:1px solid #3a3a3f;border-radius:6px;padding:7px 10px;cursor:pointer}.bst-ov button:hover{background:#34343a}.bst-ov button.pri{background:#c53131;border-color:#c53131;color:#fff}.bst-ov button.dng{border-color:#8a2a2a;color:#ff9b9b}.bst-item{display:flex;flex-direction:column;align-items:flex-start;gap:1px;text-align:left;width:100%}.bst-item.on{border-color:#c53131;background:#252528;box-shadow:inset 3px 0 0 #c53131}.bst-item small,.bst-mute{color:#a0a0a6;font-size:12px}.bst-tag{display:inline-block;margin-left:6px;padding:0 6px;border-radius:9px;background:#3a2a2a;color:#ffb4b4;font-size:11px}.bst-bar{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px}.bst-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:8px;margin:10px 0}.bst-stat{background:#121212;border:1px solid #3a3a3f;border-radius:8px;padding:8px;text-align:center}.bst-stat b{display:block;font-size:18px}.bst-stat small{color:#a0a0a6}.bst-line{margin:4px 0}.bst-h{margin:14px 0 6px;font-size:15px;color:#ffb4b4;border-bottom:1px solid #3a3a3f;padding-bottom:3px}.bst-ent{margin:6px 0}.bst-ent p{margin:2px 0 0;color:#d8d8dc}.bst-box2{background:#18181a;border:1px solid #3a3a3f;border-radius:8px;padding:10px;margin:0 0 14px}.bst-f{display:flex;flex-direction:column;gap:3px;font-size:12px;color:#a0a0a6}.bst-f input,.bst-f select{font-size:14px}.bst-fg{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:6px 0}.bst-kv{display:flex;gap:6px;margin:4px 0}.bst-kv input:first-child{flex:2}.bst-kv input:nth-child(2){flex:1}.bst-card{background:#18181a;border:1px solid #3a3a3f;border-radius:8px;padding:8px;margin:8px 0}.bst-card .bst-fg{grid-template-columns:2fr 1fr 2fr 1.2fr 1fr}.bst-sticky{position:sticky;bottom:-14px;display:flex;gap:8px;padding:10px 0;background:#1e1e20;border-top:1px solid #3a3a3f;margin-top:14px}@media(max-width:760px){.bst-body{flex-direction:column}.bst-left{width:auto;flex:0 0 auto;max-height:38%;border-right:0;border-bottom:1px solid #3a3a3f}.bst-card .bst-fg{grid-template-columns:1fr 1fr}}";
    document.head.appendChild(st);
  }
  function fmtObj(o) {
    return Object.keys(o || {}).map(function(k) {
      return e(k) + ": " + e(o[k]);
    }).join(" · ");
  }
  function entriesHtml(title, list) {
    if (!list || !list.length) return "";
    return '<h4 class="bst-h">' + e(title) + "</h4>" + list.map(function(x) {
      return '<div class="bst-ent"><b>' + e(x.name || "") + "</b>" + (x.description ? "<p>" + e(x.description) + "</p>" : "") + "</div>";
    }).join("");
  }
  function sheetHtml(m) {
    var ab = ATTRS.map(function(a) {
      var v = (m.atributos || {})[a[0]];
      return '<div class="bst-stat"><b>' + e(v == null ? "—" : v) + "</b><small>" + a[1] + " (" + fmtMod(v) + ")</small></div>";
    }).join("");
    var h = '<h2 style="margin:0">' + e(m.nome) + (m.personalizado ? '<span class="bst-tag">' + e(m.categoria || "Personalizado") + "</span>" : m.editado ? '<span class="bst-tag">Editado</span>' : "") + '</h2><div class="bst-mute">' + e(m.tamanho) + " · " + e(m.tipo) + (m.nomeEn && m.nomeEn !== m.nome ? " · " + e(m.nomeEn) : "") + '</div><div class="bst-grid"><div class="bst-stat"><b>' + e(m.classeArmadura) + '</b><small>CA</small></div><div class="bst-stat"><b>' + e(m.pontosVida) + "</b><small>PV" + (m.formulaVida ? " (" + e(m.formulaVida) + ")" : "") + '</small></div><div class="bst-stat"><b>' + e(m.nd) + '</b><small>ND</small></div><div class="bst-stat"><b>' + (m.iniciativa >= 0 ? "+" : "") + e(m.iniciativa) + '</b><small>Iniciativa</small></div></div><div class="bst-grid">' + ab + "</div>";
    KVS.forEach(function(k) {
      if (!isEmpty(m[k[0]])) h += '<div class="bst-line"><b>' + e(k[1]) + ":</b> " + fmtObj(m[k[0]]) + "</div>";
    });
    LISTS.forEach(function(l) {
      if (!isEmpty(m[l[0]])) h += '<div class="bst-line"><b>' + e(l[1]) + ":</b> " + e(m[l[0]].join(", ")) + "</div>";
    });
    SECTIONS.forEach(function(s) {
      h += entriesHtml(s[1], entriesOf(m, s[0]));
    });
    return h;
  }
  function tokenBoxHtml(t) {
    return '<div class="bst-box2" id="bst-tokbox"><b>Token selecionado no mapa</b><div class="bst-fg"><label class="bst-f">Nome<input data-t="nome" value="' + e(t.nome) + '"></label><label class="bst-f">PV atual<input data-t="hp" type="number" value="' + e(t.hp != null ? t.hp : t.hpMax != null ? t.hpMax : "") + '"></label><label class="bst-f">PV máximo<input data-t="hpMax" type="number" value="' + e(t.hpMax != null ? t.hpMax : "") + '"></label><label class="bst-f">CA (deste token)<input data-t="ca" type="number" value="' + e(t.ca != null ? t.ca : "") + '" placeholder="da ficha"></label><label class="bst-f">Tamanho (quadrados)<input data-t="raio" type="number" min="1" max="8" value="' + e(t.raio || 1) + '"></label><label class="bst-f">Cor<input data-t="cor" type="color" value="' + e(/^#[0-9a-f]{6}$/i.test(t.cor || "") ? t.cor : "#e57373") + '"></label><label class="bst-f">Agressivo (ataca ao ver)<select data-t="agressivo"><option value=""' + (t.agressivo == null ? " selected" : "") + '>Padrão (monstros sim, NPCs não)</option><option value="sim"' + (t.agressivo === true ? " selected" : "") + '>Sim</option><option value="nao"' + (t.agressivo === false ? " selected" : "") + '>Não</option></select></label></div><div class="bst-bar" style="margin:8px 0 0"><button type="button" class="pri" data-a="tok-apply">Aplicar ao token</button></div></div>';
  }
  function field(label, name, val, type, extra) {
    return '<label class="bst-f">' + e(label) + '<input data-f="' + name + '" type="' + (type || "text") + '" value="' + e(val == null ? "" : val) + '"' + (extra || "") + "></label>";
  }
  function kvHtml(k, obj) {
    var rows = Object.keys(obj || {}).map(function(key) {
      return kvRow(key, obj[key]);
    }).join("");
    return '<div class="bst-line"><b>' + e(k[1]) + '</b></div><div data-kv="' + k[0] + '">' + rows + '</div><button type="button" data-a="kv-add" data-k="' + k[0] + '">＋ Adicionar</button>';
  }
  function kvRow(key, val) {
    return '<div class="bst-kv"><input class="k-key" placeholder="nome" value="' + e(key) + '"><input class="k-val" placeholder="valor" value="' + e(val) + '"><button type="button" class="dng" data-a="kv-del" title="Remover">✕</button></div>';
  }
  function entHtml(key, withAtk, list) {
    var cards = list.map(function(x, i) {
      var atk = withAtk ? '<label class="bst-f">Bônus de ataque<input class="e-atk" type="number" value="' + e(x.attack_bonus != null ? x.attack_bonus : "") + '"></label><label class="bst-f">Dano (ex: 1d6+2 cortante; 1d4 fogo)<input class="e-dmg" value="' + e(dmgToText(x.damage)) + '"></label><label class="bst-f">Tipo<select class="e-kind">' + [["", "—"], ["corpo", "Corpo a corpo"], ["dist", "À distância"]].map(function(o) {
        return '<option value="' + o[0] + '"' + (kindOf(x.description) === o[0] ? " selected" : "") + ">" + o[1] + "</option>";
      }).join("") + '</select></label><label class="bst-f">Alcance (m)<input class="e-reach" type="number" step="0.5" value="1.5"></label>' : "";
      return '<div class="bst-card" data-i="' + i + '"><div class="bst-fg"><label class="bst-f">Nome<input class="e-name" value="' + e(x.name || "") + '"></label>' + atk + '</div><label class="bst-f">Descrição<textarea class="e-desc">' + e(x.description || "") + '</textarea></label><div class="bst-bar" style="margin:6px 0 0"><button type="button" class="dng" data-a="ent-del" data-k="' + key + '" data-i="' + i + '">Remover</button></div></div>';
    }).join("");
    return '<div data-ent="' + key + '" data-atk="' + (withAtk ? 1 : 0) + '">' + cards + "</div>";
  }
  function formHtml(d) {
    var h = '<h2 style="margin:0 0 8px">' + (ui.isNew ? "Nova criatura" : "Editando: " + e(d.nome)) + '</h2><div class="bst-fg">' + field("Nome", "nome", d.nome) + field("Nome em inglês", "nomeEn", d.nomeEn) + '<label class="bst-f">Categoria<select data-f="categoria"><option value="Monstro"' + (d.categoria !== "NPC" ? " selected" : "") + '>Monstro</option><option value="NPC"' + (d.categoria === "NPC" ? " selected" : "") + '>NPC</option></select></label><label class="bst-f">Tamanho<select data-f="tamanho">' + SIZES.map(function(s) {
      return "<option" + (s === d.tamanho ? " selected" : "") + ">" + s + "</option>";
    }).join("") + "</select></label>" + field("Tipo", "tipo", d.tipo) + field("Nível de Desafio", "nd", d.nd, "text", ' placeholder="1/4, 1, 5…"') + field("Classe de Armadura", "classeArmadura", d.classeArmadura, "number") + field("Pontos de Vida", "pontosVida", d.pontosVida, "number") + field("Fórmula de PV", "formulaVida", d.formulaVida, "text", ' placeholder="2d8+2"') + field("Iniciativa", "iniciativa", d.iniciativa, "number") + '</div><h4 class="bst-h">Atributos</h4><div class="bst-fg">' + ATTRS.map(function(a) {
      return field(a[1], "atributos." + a[0], (d.atributos || {})[a[0]], "number");
    }).join("") + "</div>";
    KVS.forEach(function(k) {
      h += kvHtml(k, d[k[0]]);
    });
    h += '<h4 class="bst-h">Defesas e idiomas (separe por vírgula)</h4><div class="bst-fg">' + LISTS.map(function(l) {
      return '<label class="bst-f">' + e(l[1]) + '<input data-list="' + l[0] + '" value="' + e((d[l[0]] || []).join(", ")) + '"></label>';
    }).join("") + "</div>";
    SECTIONS.forEach(function(s) {
      h += '<h4 class="bst-h">' + e(s[1]) + "</h4>" + entHtml(s[0], s[2], entriesOf(d, s[0])) + '<button type="button" data-a="ent-add" data-k="' + s[0] + '">＋ Adicionar</button>';
    });
    if (ui.ctx && ui.ctx.tokens && !ui.isNew && origOrCustomExists(d.id)) {
      h += '<label class="bst-line" style="display:block;margin-top:14px"><input type="checkbox" id="bst-sync" checked> Atualizar também os tokens desta criatura que já estão no mapa (nome, PV máx. e tamanho, se não foram alterados à mão)</label>';
    }
    h += '<div class="bst-sticky"><button type="button" class="pri" data-a="save">💾 Salvar</button><button type="button" data-a="cancel">Cancelar</button></div>';
    return h;
  }
  function origOrCustomExists(id) {
    return !!byId(id);
  }
  function setPath(o, path, val) {
    var p = path.split("."), cur = o;
    for (var i = 0; i < p.length - 1; i++) {
      cur[p[i]] = cur[p[i]] || {};
      cur = cur[p[i]];
    }
    cur[p[p.length - 1]] = val;
  }
  function collect(d) {
    var pane = root.querySelector("#bst-pane");
    pane.querySelectorAll("[data-f]").forEach(function(el) {
      setPath(d, el.dataset.f, el.value);
    });
    pane.querySelectorAll("[data-kv]").forEach(function(box) {
      var obj = {};
      box.querySelectorAll(".bst-kv").forEach(function(row) {
        var k = row.querySelector(".k-key").value.trim();
        var v = row.querySelector(".k-val").value.trim();
        if (!k) return;
        obj[k] = v !== "" && isFinite(Number(v)) ? Number(v) : v;
      });
      d[box.dataset.kv] = obj;
    });
    pane.querySelectorAll("[data-list]").forEach(function(el) {
      d[el.dataset.list] = el.value.split(",").map(function(s) {
        return s.trim();
      }).filter(Boolean);
    });
    pane.querySelectorAll("[data-ent]").forEach(function(box) {
      var key = box.dataset.ent, withAtk = box.dataset.atk === "1";
      var old = entriesOf(d, key);
      var arr = [];
      box.querySelectorAll(".bst-card").forEach(function(card) {
        var i = Number(card.dataset.i);
        var x = Object.assign({}, old[i] || {});
        x.name = card.querySelector(".e-name").value.trim();
        x.description = card.querySelector(".e-desc").value.trim();
        if (withAtk) {
          var b = card.querySelector(".e-atk").value.trim();
          var dm = parseDamage(card.querySelector(".e-dmg").value);
          if (b !== "" && isFinite(Number(b))) x.attack_bonus = Number(b);
          else delete x.attack_bonus;
          if (dm.length) x.damage = dm;
          else delete x.damage;
          var kind = card.querySelector(".e-kind").value;
          if (!x.description && x.attack_bonus != null && kind) {
            x.description = genDesc(kind, x.attack_bonus, card.querySelector(".e-reach").value, dm);
          }
        }
        arr.push(x);
      });
      if (key === "acoesLendarias") setLeg(d, arr);
      else d[key] = arr;
    });
  }
  function notify() {
    listeners.forEach(function(fn) {
      try {
        fn();
      } catch (err) {
      }
    });
  }
  function renderList() {
    var box = root.querySelector("#bst-list");
    if (!box) return;
    var q = plain(ui.q);
    var rows = window.MONSTERS.filter(function(m) {
      if (ui.type !== "Todos" && m.tipo !== ui.type) return false;
      if (ui.cat !== "Todos" && (m.categoria || "Monstro") !== ui.cat) return false;
      if (!q) return true;
      return plain([m.nome, m.nomeEn, m.tipo, m.nd, m.id].join(" ")).indexOf(q) >= 0;
    }).sort(function(a, b) {
      return String(a.nome).localeCompare(String(b.nome), "pt-BR");
    });
    var total = rows.length;
    rows = rows.slice(0, 120);
    box.innerHTML = rows.map(function(m) {
      return '<button type="button" class="bst-item' + (m.id === ui.sel ? " on" : "") + '" data-a="sel" data-id="' + e(m.id) + '"><span>' + e(m.nome) + (m.personalizado ? '<span class="bst-tag">' + e(m.categoria || "Novo") + "</span>" : m.editado ? '<span class="bst-tag">Editado</span>' : "") + "</span><small>ND " + e(m.nd) + " · " + e(m.tamanho) + " · " + e(m.tipo) + "</small></button>";
    }).join("") || '<div class="bst-mute">Nenhuma criatura encontrada.</div>';
    var c = root.querySelector("#bst-count");
    if (c) c.textContent = total + " de " + window.MONSTERS.length + " criaturas" + (total > 120 ? " (mostrando 120)" : "");
  }
  function renderPane() {
    var pane = root.querySelector("#bst-pane");
    var top = pane.scrollTop;
    var h = "";
    if (ui.ctx && ui.ctx.token) h += tokenBoxHtml(ui.ctx.token);
    if (ui.mode === "edit" && ui.draft) {
      h += formHtml(ui.draft);
    } else {
      var m = ui.sel ? byId(ui.sel) : null;
      if (!m) {
        h += '<div class="bst-mute">Escolha uma criatura na lista para ver a ficha, ou crie um monstro/NPC novo.</div>';
      } else {
        h += '<div class="bst-bar"><button type="button" class="pri" data-a="edit">✎ Editar</button>' + (ui.ctx && ui.ctx.place ? '<button type="button" data-a="place">📍 Colocar no mapa</button>' : "") + '<button type="button" data-a="dup">⧉ Duplicar</button>' + (m.editado ? '<button type="button" data-a="restore">↺ Restaurar original</button>' : "") + (m.personalizado ? '<button type="button" class="dng" data-a="del">🗑 Excluir</button>' : "") + "</div>" + sheetHtml(m);
      }
    }
    pane.innerHTML = h;
    pane.scrollTop = top;
  }
  function typeOptions() {
    var set = {};
    window.MONSTERS.forEach(function(m) {
      set[m.tipo || "Outros"] = 1;
    });
    return ["Todos"].concat(Object.keys(set).sort(function(a, b) {
      return a.localeCompare(b, "pt-BR");
    }));
  }
  function build() {
    injectStyle();
    root = document.createElement("div");
    root.className = "bst-ov";
    root.innerHTML = '<div class="bst-box" role="dialog" aria-label="Bestiário"><div class="bst-head"><h3>👹 Bestiário · monstros e NPCs</h3><small id="bst-count"></small><button type="button" data-a="close" aria-label="Fechar">✕</button></div><div class="bst-body"><aside class="bst-left"><input id="bst-q" type="search" placeholder="Buscar por nome, tipo ou ND…"><div class="bst-row"><select id="bst-type"></select><select id="bst-cat"><option>Todos</option><option>Monstro</option><option>NPC</option></select></div><button type="button" class="pri" data-a="new">＋ Novo monstro/NPC</button><div class="bst-list" id="bst-list"></div><div class="bst-row"><button type="button" data-a="export">⬇ Exportar</button><button type="button" data-a="import">⬆ Importar</button></div><input type="file" id="bst-file" accept=".json,application/json" hidden></aside><section class="bst-right" id="bst-pane"></section></div></div>';
    document.body.appendChild(root);
    var sel = root.querySelector("#bst-type");
    sel.innerHTML = typeOptions().map(function(t) {
      return "<option>" + e(t) + "</option>";
    }).join("");
    root.addEventListener("keydown", function(ev) {
      ev.stopPropagation();
      if (ev.key === "Escape") requestClose();
    });
    root.addEventListener("keyup", function(ev) {
      ev.stopPropagation();
    });
    root.addEventListener("click", onClick);
    root.querySelector("#bst-q").addEventListener("input", function() {
      ui.q = this.value;
      renderList();
    });
    sel.addEventListener("change", function() {
      ui.type = this.value;
      renderList();
    });
    root.querySelector("#bst-cat").addEventListener("change", function() {
      ui.cat = this.value;
      renderList();
    });
    root.querySelector("#bst-file").addEventListener("change", onImport);
  }
  function confirmDiscard() {
    return ui.mode !== "edit" || window.confirm("Descartar as alterações que não foram salvas?");
  }
  function requestClose() {
    if (!confirmDiscard()) return;
    close();
  }
  function close() {
    if (root && root.parentNode) root.parentNode.removeChild(root);
    root = null;
    ui.ctx = null;
    ui.mode = "view";
    ui.draft = null;
    ui.isNew = false;
  }
  function startEdit(m, isNew) {
    ui.draft = clone(m);
    ui.isNew = !!isNew;
    ui.mode = "edit";
    renderPane();
  }
  function saveDraft() {
    collect(ui.draft);
    var m = finalize(ui.draft);
    var prev = byId(m.id);
    var existsOrig = !!origById[m.id];
    if (existsOrig) {
      delete m.personalizado;
      store.edits[m.id] = m;
    } else {
      m.personalizado = true;
      var i = store.custom.findIndex(function(x) {
        return x.id === m.id;
      });
      if (i >= 0) store.custom[i] = m;
      else store.custom.push(m);
    }
    if (!persist()) window.alert("Não foi possível salvar no navegador (armazenamento cheio ou bloqueado).");
    var sync = root.querySelector("#bst-sync");
    if (prev && sync && sync.checked && ui.ctx && ui.ctx.tokens) syncTokens(prev, byIdAfter(m));
    rebuild();
    ui.sel = m.id;
    ui.mode = "view";
    ui.draft = null;
    ui.isNew = false;
    var sel = root.querySelector("#bst-type");
    var keep = ui.type;
    sel.innerHTML = typeOptions().map(function(t) {
      return "<option" + (t === keep ? " selected" : "") + ">" + e(t) + "</option>";
    }).join("");
    renderList();
    renderPane();
    if (ui.ctx && ui.ctx.changed) ui.ctx.changed();
  }
  function byIdAfter(m) {
    return m;
  }
  function syncTokens(prev, next) {
    var sq = ui.ctx.sizeSquares || function() {
      return 1;
    };
    ui.ctx.tokens().forEach(function(t) {
      if (t.monsterId !== next.id) return;
      if (t.nome === prev.nome) t.nome = next.nome;
      if (t.hpMax === prev.pontosVida) {
        if (t.hp === t.hpMax) t.hp = next.pontosVida;
        else if (t.hp > next.pontosVida) t.hp = next.pontosVida;
        t.hpMax = next.pontosVida;
      }
      if (t.raio === sq(prev)) t.raio = sq(next);
      t.nd = next.nd;
    });
  }
  function applyToken() {
    var t = ui.ctx && ui.ctx.token;
    if (!t) return;
    var box = root.querySelector("#bst-tokbox");
    function v(n) {
      return box.querySelector('[data-t="' + n + '"]').value;
    }
    t.nome = v("nome").trim() || t.nome;
    var hpMax = v("hpMax"), hp = v("hp"), ca = v("ca");
    if (hpMax !== "") t.hpMax = toInt(hpMax, t.hpMax || 1, 1);
    if (hp !== "") t.hp = Math.max(0, toInt(hp, t.hp || 0));
    else if (t.hpMax != null && t.hp == null) t.hp = t.hpMax;
    if (ca !== "") t.ca = toInt(ca, 10, 0);
    else delete t.ca;
    t.raio = Math.max(1, Math.min(8, toInt(v("raio"), t.raio || 1, 1)));
    t.cor = v("cor");
    var ag = v("agressivo");
    if (ag === "sim") t.agressivo = true;
    else if (ag === "nao") t.agressivo = false;
    else delete t.agressivo;
    if (ui.ctx.changed) ui.ctx.changed();
    renderPane();
  }
  function onImport() {
    var f = this.files && this.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function() {
      try {
        var data = JSON.parse(String(r.result));
        var n = 0;
        (data.custom || []).forEach(function(m) {
          if (!m || !m.id) return;
          var i = store.custom.findIndex(function(x) {
            return x.id === m.id;
          });
          if (i >= 0) store.custom[i] = m;
          else store.custom.push(m);
          n++;
        });
        Object.keys(data.edits || {}).forEach(function(id) {
          if (origById[id]) {
            store.edits[id] = data.edits[id];
            n++;
          }
        });
        persist();
        rebuild();
        renderList();
        renderPane();
        window.alert(n + " criatura(s) importada(s).");
      } catch (err) {
        window.alert("Arquivo inválido.");
      }
    };
    r.readAsText(f);
    this.value = "";
  }
  function onClick(ev) {
    var b = ev.target.closest("[data-a]");
    if (!b || !root || !root.contains(b)) return;
    var a = b.dataset.a;
    if (a === "close") {
      requestClose();
      return;
    }
    if (a === "sel") {
      if (!confirmDiscard()) return;
      ui.sel = b.dataset.id;
      ui.mode = "view";
      ui.draft = null;
      ui.isNew = false;
      renderList();
      renderPane();
      return;
    }
    if (a === "new") {
      if (!confirmDiscard()) return;
      var n = blank();
      ui.sel = null;
      startEdit(n, true);
      renderList();
      return;
    }
    if (a === "edit") {
      var m = byId(ui.sel);
      if (m) startEdit(m, false);
      return;
    }
    if (a === "cancel") {
      ui.mode = "view";
      ui.draft = null;
      ui.isNew = false;
      renderPane();
      return;
    }
    if (a === "save") {
      saveDraft();
      return;
    }
    if (a === "dup") {
      var src = byId(ui.sel);
      if (!src) return;
      var c = clone(src);
      c.id = newId();
      c.nome = src.nome + " (cópia)";
      c.nomePt = c.nome;
      c.personalizado = true;
      delete c.editado;
      if (!c.categoria) c.categoria = "Monstro";
      ui.sel = null;
      startEdit(c, true);
      return;
    }
    if (a === "restore") {
      if (!window.confirm("Voltar esta criatura para a ficha original?")) return;
      delete store.edits[ui.sel];
      persist();
      rebuild();
      renderList();
      renderPane();
      if (ui.ctx && ui.ctx.changed) ui.ctx.changed();
      return;
    }
    if (a === "del") {
      if (!window.confirm("Excluir esta criatura personalizada?")) return;
      store.custom = store.custom.filter(function(x) {
        return x.id !== ui.sel;
      });
      persist();
      rebuild();
      ui.sel = null;
      renderList();
      renderPane();
      if (ui.ctx && ui.ctx.changed) ui.ctx.changed();
      return;
    }
    if (a === "place") {
      var id = ui.sel;
      var place = ui.ctx && ui.ctx.place;
      close();
      if (place) place(id);
      return;
    }
    if (a === "tok-apply") {
      applyToken();
      return;
    }
    if (a === "export") {
      var blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "bestiario-animalysson.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 1e3);
      return;
    }
    if (a === "import") {
      root.querySelector("#bst-file").click();
      return;
    }
    if (ui.mode === "edit" && ui.draft) {
      var key = b.dataset.k;
      if (a === "kv-add") {
        collect(ui.draft);
        ui.draft[key] = ui.draft[key] || {};
        var kv = KVS.find(function(x) {
          return x[0] === key;
        });
        var nk = kv ? kv[2] : "novo";
        while (ui.draft[key][nk] !== void 0) nk += "2";
        ui.draft[key][nk] = kv ? Number(kv[3]) : "";
        renderPane();
        return;
      }
      if (a === "kv-del") {
        var row = b.closest(".bst-kv");
        if (row) row.parentNode.removeChild(row);
        return;
      }
      if (a === "ent-add") {
        collect(ui.draft);
        var list = entriesOf(ui.draft, key).slice();
        list.push({ name: "", description: "" });
        if (key === "acoesLendarias") setLeg(ui.draft, list);
        else ui.draft[key] = list;
        renderPane();
        return;
      }
      if (a === "ent-del") {
        collect(ui.draft);
        var l2 = entriesOf(ui.draft, key).slice();
        l2.splice(Number(b.dataset.i), 1);
        if (key === "acoesLendarias") setLeg(ui.draft, l2);
        else ui.draft[key] = l2;
        renderPane();
        return;
      }
    }
  }
  function open(opts) {
    opts = opts || {};
    if (root) close();
    ui.ctx = opts.ctx || null;
    ui.q = "";
    ui.type = "Todos";
    ui.cat = "Todos";
    ui.sel = opts.id && byId(opts.id) ? opts.id : null;
    ui.mode = "view";
    ui.draft = null;
    ui.isNew = false;
    build();
    renderList();
    renderPane();
    if (opts.edit && ui.sel) startEdit(byId(ui.sel), false);
    if (opts.create) startEdit(blank(), true);
    if (ui.sel) {
      var el = root.querySelector(".bst-item.on");
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "center" });
    }
  }
  rebuild();
  window.Bestiary = {
    open,
    edit: function(id, opts) {
      open(Object.assign({}, opts || {}, { id, edit: true }));
    },
    create: function(opts) {
      open(Object.assign({}, opts || {}, { create: true }));
    },
    onChange: function(fn) {
      if (typeof fn === "function") listeners.push(fn);
    }
  };
})();
