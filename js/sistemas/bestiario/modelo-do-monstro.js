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
