var ATRIBUTOS = ["FOR", "DES", "CON", "INT", "SAB", "CAR"];
var ATTR_EN = { str: "FOR", dex: "DES", con: "CON", int: "INT", wis: "SAB", cha: "CAR" };
var ATTR_PT = { forca: "FOR", destreza: "DES", constituicao: "CON", inteligencia: "INT", sabedoria: "SAB", carisma: "CAR" };
var NOME_ATTR = { FOR: "Força", DES: "Destreza", CON: "Constituição", INT: "Inteligência", SAB: "Sabedoria", CAR: "Carisma" };
var CLASSES_MAESTRIA = ["Bárbaro", "Guerreiro", "Paladino", "Guardião", "Ladino"];
var XP_POR_ND = { "0": 10, "0.125": 25, "0.25": 50, "0.5": 100, "1": 200, "2": 450, "3": 700, "4": 1100, "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5e3, "10": 5900, "11": 7200, "12": 8400, "13": 1e4, "14": 11500, "15": 13e3, "16": 15e3, "17": 18e3, "18": 2e4, "19": 22e3, "20": 25e3, "21": 33e3, "22": 41e3, "23": 5e4, "24": 62e3, "25": 75e3, "26": 9e4, "27": 105e3, "28": 12e4, "29": 135e3, "30": 155e3 };
var CONDICOES = {
    cego: "Cego",
    surdo: "Surdo",
    enfeiticado: "Enfeitiçado",
    amedrontado: "Amedrontado",
    agarrado: "Agarrado",
    incapacitado: "Incapacitado",
    invisivel: "Invisível",
    paralisado: "Paralisado",
    petrificado: "Petrificado",
    envenenado: "Envenenado",
    caido: "Caído",
    contido: "Contido",
    atordoado: "Atordoado",
    inconsciente: "Inconsciente"
  };
var COND_ALIAS = [
    ["enfeitic", "enfeiticado"],
    ["charmed", "enfeiticado"],
    ["amedront", "amedrontado"],
    ["assustad", "amedrontado"],
    ["frightened", "amedrontado"],
    ["agarrad", "agarrado"],
    ["grappled", "agarrado"],
    ["incapacit", "incapacitado"],
    ["invisiv", "invisivel"],
    ["invisible", "invisivel"],
    ["paralis", "paralisado"],
    ["paralyzed", "paralisado"],
    ["petrific", "petrificado"],
    ["petrified", "petrificado"],
    ["envenen", "envenenado"],
    ["poisoned", "envenenado"],
    ["prostrad", "caido"],
    ["caid", "caido"],
    ["prone", "caido"],
    ["contid", "contido"],
    ["restrained", "contido"],
    ["atordo", "atordoado"],
    ["stunned", "atordoado"],
    ["inconscien", "inconsciente"],
    ["unconscious", "inconsciente"],
    ["ceg", "cego"],
    ["blinded", "cego"],
    ["surd", "surdo"],
    ["deafened", "surdo"]
  ];
var TIPOS_DANO = {
    contundente: "contundente",
    bludgeoning: "contundente",
    cortante: "cortante",
    slashing: "cortante",
    perfurante: "perfurante",
    piercing: "perfurante",
    fogo: "fogo",
    fire: "fogo",
    gelo: "gelo",
    frio: "gelo",
    cold: "gelo",
    acido: "acido",
    acid: "acido",
    eletrico: "eletrico",
    relampago: "eletrico",
    lightning: "eletrico",
    trovejante: "trovejante",
    trovao: "trovejante",
    thunder: "trovejante",
    venenoso: "venenoso",
    veneno: "venenoso",
    poison: "venenoso",
    necrotico: "necrotico",
    necrotic: "necrotico",
    radiante: "radiante",
    radiant: "radiante",
    psiquico: "psiquico",
    psychic: "psiquico",
    energetico: "energetico",
    energia: "energetico",
    force: "energetico"
  };
var ROTULO_DANO = {
    contundente: "contundente",
    cortante: "cortante",
    perfurante: "perfurante",
    fogo: "fogo",
    gelo: "gelo",
    acido: "ácido",
    eletrico: "elétrico",
    trovejante: "trovejante",
    venenoso: "venenoso",
    necrotico: "necrótico",
    radiante: "radiante",
    psiquico: "psíquico",
    energetico: "energético"
  };
var FISICOS = ["contundente", "cortante", "perfurante"];
var PALAVRAS_NUM = { um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6 };
function norm(s) {
    return String(s == null ? "" : s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
function d(n) {
    var v = 1 + Math.floor(Math.random() * n);
    if (window.Dados3D) window.Dados3D.lancar(n, v);
    return v;
  }
function mod(score) {
    return Math.floor((Number(score) - 10) / 2);
  }
function sinal(n) {
    n = Number(n) || 0;
    return (n >= 0 ? "+" : "") + n;
  }
function nomeTipo(t) {
    return ROTULO_DANO[t] || t || "sem tipo";
  }
function rolar(expr, critico) {
    var s = String(expr == null ? "0" : expr).replace(/\s/g, "").toLowerCase().replace(/−/g, "-");
    if (!s) s = "0";
    var re = /([+-]?)(\d*)d(\d+)|([+-]?)(\d+)/g, m, dados = [], fixo = 0, total = 0, achou = false;
    while (m = re.exec(s)) {
      achou = true;
      if (m[3]) {
        var sinalDado = m[1] === "-" ? -1 : 1;
        var qtd = Math.max(1, Math.min(60, Number(m[2] || 1))) * (critico ? 2 : 1);
        var lados = Math.max(2, Math.min(1e3, Number(m[3])));
        for (var i = 0; i < qtd; i++) {
          var v = d(lados);
          dados.push(sinalDado * v);
          total += sinalDado * v;
        }
      } else {
        var n = (m[4] === "-" ? -1 : 1) * Number(m[5]);
        fixo += n;
        total += n;
      }
    }
    if (!achou) return null;
    return { total: Math.max(0, total), dados, fixo, formula: s, critico: !!critico };
  }
function mediaDano(expr) {
    var s = String(expr || "0").replace(/\s/g, "").toLowerCase(), re = /([+-]?)(\d*)d(\d+)|([+-]?)(\d+)/g, m, t = 0;
    while (m = re.exec(s)) {
      if (m[3]) t += (m[1] === "-" ? -1 : 1) * Math.max(1, Number(m[2] || 1)) * (Number(m[3]) + 1) / 2;
      else t += (m[4] === "-" ? -1 : 1) * Number(m[5]);
    }
    return t;
  }
function d20(modo) {
    var a = d(20), b = modo ? d(20) : null;
    var r = modo === 1 ? Math.max(a, b) : modo === -1 ? Math.min(a, b) : a;
    return { dado: r, dados: modo ? [a, b] : [a], modo: modo || 0 };
  }
function modoFinal(vant, desv) {
    if (vant.length && desv.length) return 0;
    return vant.length ? 1 : desv.length ? -1 : 0;
  }
function textoD20(r, bonus, total) {
    var base = "1d20" + (r.modo === 1 ? " (vantagem: " + r.dados.join(" e ") + ")" : r.modo === -1 ? " (desvantagem: " + r.dados.join(" e ") + ")" : " (" + r.dado + ")");
    return base + " " + sinal(bonus) + " = " + total;
  }
function canonicoDano(texto) {
    var s = norm(texto), chaves = Object.keys(TIPOS_DANO).sort(function(a, b) {
      return b.length - a.length;
    });
    for (var i = 0; i < chaves.length; i++) if (s.indexOf(chaves[i]) >= 0) return TIPOS_DANO[chaves[i]];
    return null;
  }
function idCondicao(texto) {
    var s = norm(texto);
    for (var i = 0; i < COND_ALIAS.length; i++) if (s.indexOf(COND_ALIAS[i][0]) >= 0) return COND_ALIAS[i][1];
    return null;
  }
function atributoDeTexto(texto) {
    var s = norm(texto), chaves = Object.keys(ATTR_PT);
    for (var i = 0; i < chaves.length; i++) if (s.indexOf(chaves[i]) >= 0) return ATTR_PT[chaves[i]];
    return null;
  }
function parseDefesas(lista) {
    var out = {};
    var texto = (lista || []).join(", ");
    texto.split(";").forEach(function(seg) {
      var naoMagico = /nonmagical|nao magic|nao-magic|non-magical/.test(norm(seg));
      seg.split(",").forEach(function(parte) {
        var tipo = canonicoDano(parte);
        if (!tipo) return;
        var qual = naoMagico && FISICOS.indexOf(tipo) >= 0;
        out[tipo] = { naoMagico: qual };
      });
    });
    return out;
  }
function cellsDeMedida(valor, unidade) {
    var n = Number(String(valor).replace(",", "."));
    if (!isFinite(n)) return 0;
    var u = norm(unidade);
    if (u.indexOf("pe") === 0 || u === "ft") return Math.max(1, Math.round(n / 5));
    return Math.max(1, Math.round(n / 1.5));
  }
function proficienciaPorND(nd) {
    var n = Number(nd) || 0;
    return Math.max(2, Math.ceil(n / 4) + 1);
  }
