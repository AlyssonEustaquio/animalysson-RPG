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
