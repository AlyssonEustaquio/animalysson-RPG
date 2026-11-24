"use strict";

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

function parseAcaoMonstro(a, todas) {
    var desc = String(a.description || "");
    var nome = String(a.name || "Ação");
    var baixo = norm(desc);
    var recarga = nome.match(/Recarga\s*(\d)(?:\s*[-–]\s*(\d))?/i);
    var base = { nome, descricao: desc, recarga: recarga ? Number(recarga[1]) : null };
    if (/multiataque|multiattack/.test(norm(nome))) {
      var q = null, mq = baixo.match(/(\d+)d(\d+)\s+ataques/);
      if (mq) q = { dados: mq[1] + "d" + mq[2] };
      else {
        var mn = baixo.match(/(?:faz|realiza|efetua|executa)\s+(um|uma|dois|duas|tres|quatro|cinco|seis)\s+ataques?/);
        q = { n: mn ? PALAVRAS_NUM[mn[1]] : 2 };
      }
      base.tipo = "multi";
      base.qtd = q;
      base.texto = baixo;
      return base;
    }
    var bonusDesc = desc.match(/Ataque[^:]*:\s*([+-]\d+)\s+para acertar/i);
    var bonusAtq = a.attack_bonus != null ? Number(a.attack_bonus) : bonusDesc ? Number(bonusDesc[1]) : null;
    if (bonusAtq != null) {
      var corpo = /corpo a corpo/.test(baixo), dist = /a distancia|de longo alcance|longo alcance|distancia/.test(baixo);
      var alc = {};
      var reach = baixo.match(/alcance\s+([\d,.]+)\s*(m|metros?|pes|pés|ft)\b(?!\s*\/)/);
      var rng = baixo.match(/([\d,.]+)\s*\/\s*([\d,.]+)\s*(m|metros?|pes|ft)/);
      var rng1 = baixo.match(/alcance de\s+([\d,.]+)\s*(m|metros?|pes|ft)/);
      var reachCells = reach ? cellsDeMedida(reach[1], reach[2]) : 1;
      var distN = 0, distM = 0;
      if (rng) {
        distN = cellsDeMedida(rng[1], rng[3]);
        distM = cellsDeMedida(rng[2], rng[3]);
      } else if (rng1) {
        distN = distM = cellsDeMedida(rng1[1], rng1[2]);
      }
      var tipoAtq = corpo && distN ? "ambos" : dist && !corpo || !corpo && distN ? "distancia" : "corpo";
      if (tipoAtq === "distancia" && !distN) {
        distN = distM = reachCells;
      }
      var danos = (a.damage || []).map(function(x) {
        return { dados: String(x.dice).replace(/\s/g, ""), tipo: canonicoDano(x.type) };
      });
      if (!danos.length) {
        var trecho = desc.slice(Math.max(0, desc.search(/Acerto\s*:/i)));
        var corte = trecho.search(/teste de resist/i);
        if (corte > 0) trecho = trecho.slice(0, corte);
        var reD = /\((\d+d\d+(?:\s*[+-]\s*\d+)?)\)\s*de dano\s+(?:de\s+)?([A-Za-zÀ-ú]+)/gi, mdn;
        while (mdn = reD.exec(trecho)) danos.push({ dados: mdn[1].replace(/\s/g, ""), tipo: canonicoDano(mdn[2]) });
        if (!danos.length) {
          var mf = trecho.match(/Acerto\s*:\s*(\d+)\s+(?:de\s+)?dano\s+(?:de\s+)?([A-Za-zÀ-ú]+)/i);
          if (mf) danos.push({ dados: mf[1], tipo: canonicoDano(mf[2]) });
        }
      }
      var extra = parseEfeitoAcerto(desc);
      var item = {
        nome,
        descricao: desc,
        tipo: "ataque",
        modo: tipoAtq,
        bonus: bonusAtq,
        alcanceCorpo: reachCells,
        alcanceNormal: distN,
        alcanceMax: distM,
        dano: danos,
        extra,
        magico: /magico/.test(baixo.split("acerto")[0] || ""),
        recarga: base.recarga
      };
      return item;
    }
    var sv = desc.match(/teste de resist[eê]ncia de\s+([A-Za-zÀ-ú]+)\s+CD\s+(\d+)/i);
    if (sv) {
      var atr = atributoDeTexto(sv[1]);
      var dmg = desc.match(/\((\d+d\d+(?:\s*[+-]\s*\d+)?)\)\s*de dano\s+(?:de\s+)?([A-Za-zÀ-ú]+)/i);
      var area = baixo.match(/(?:cone|linha|raio|esfera|cubo|emanacao)[^.]*?([\d,.]+)\s*(metros?|m|pes|ft)\b/) || baixo.match(/a ate\s+([\d,.]+)\s*(metros?|m|pes|ft)/);
      var cond = null;
      var mc = baixo.match(/(ficara|fica|ficam|ficaria)\s+([a-z]+)/);
      if (mc) cond = idCondicao(mc[2]);
      if (!cond) {
        var tentativas = ["amedront", "assustad", "paralis", "envenen", "contid", "atordo", "inconscien", "enfeitic", "cego", "cegad", "agarrad", "prostrad", "caid"];
        for (var i = 0; i < tentativas.length; i++) if (baixo.indexOf(tentativas[i]) >= 0) {
          cond = idCondicao(tentativas[i]);
          break;
        }
      }
      var dur = baixo.match(/por\s+(\d+)\s+(minuto|hora|rodada|turno)/);
      var rodadas = dur ? dur[2] === "minuto" ? Number(dur[1]) * 10 : dur[2] === "hora" ? 600 : Number(dur[1]) : null;
      return {
        nome,
        descricao: desc,
        tipo: "salva",
        atributo: atr || "CON",
        cd: Number(sv[2]),
        dano: dmg ? [{ dados: dmg[1].replace(/\s/g, ""), tipo: canonicoDano(dmg[2]) }] : [],
        metade: /metade do dano/.test(baixo),
        condicao: cond,
        rodadas,
        area: area ? cellsDeMedida(area[1], area[2]) : 0,
        recarga: base.recarga,
        repete: /repetir o teste de resistencia/.test(baixo)
      };
    }
    base.tipo = "texto";
    return base;
  }

function parseEfeitoAcerto(desc) {
    var pos = desc.search(/Acerto\s*:/i);
    if (pos < 0) return null;
    var resto = desc.slice(pos), baixo = norm(resto);
    var out = {};
    var sv = resto.match(/teste de resist[eê]ncia de\s+([A-Za-zÀ-ú]+)\s+CD\s+(\d+)/i);
    if (sv) {
      out.salva = { atributo: atributoDeTexto(sv[1]) || "CON", cd: Number(sv[2]) };
      var depois = resto.slice(resto.indexOf(sv[0]));
      var dmg = depois.match(/(\d+)\s*\((\d+d\d+(?:\s*[+-]\s*\d+)?)\)\s*de dano\s+(?:de\s+)?([A-Za-zÀ-ú]+)/i);
      if (dmg) {
        out.dano = dmg[2].replace(/\s/g, "");
        out.tipo = canonicoDano(dmg[3]);
        out.metade = /metade do dano/.test(norm(depois));
      }
      var tentativas = ["envenen", "paralis", "contid", "atordo", "amedront", "assustad", "prostrad", "caid", "cego", "agarrad", "inconscien"];
      for (var i = 0; i < tentativas.length; i++) if (norm(depois).indexOf(tentativas[i]) >= 0) {
        out.condicao = idCondicao(tentativas[i]);
        break;
      }
      var dur = norm(depois).match(/por\s+(\d+)\s+(minuto|hora|rodada|turno)/);
      out.rodadas = dur ? dur[2] === "minuto" ? Number(dur[1]) * 10 : dur[2] === "hora" ? 600 : Number(dur[1]) : 10;
      out.repete = /repetir o teste de resistencia/.test(norm(depois));
    } else if (/contid[oa] por uma teia|fica contid/.test(baixo)) {
      out.condicao = "contido";
      out.rodadas = null;
    } else if (/agarrad/.test(baixo)) {
      var esc = resto.match(/CD\s+(?:de\s+)?escape\s+(\d+)|escape\s+CD\s+(\d+)/i);
      out.condicao = "agarrado";
      out.escape = esc ? Number(esc[1] || esc[2]) : null;
      out.rodadas = null;
    }
    var extraDano = resto.match(/mais\s+\d+\s*\((\d+d\d+(?:\s*[+-]\s*\d+)?)\)\s*(?:de\s+)?dano\s+(?:de\s+)?([A-Za-zÀ-ú]+)/i);
    if (extraDano && !out.salva) {
      out.danoAdicional = extraDano[1].replace(/\s/g, "");
      out.tipoAdicional = canonicoDano(extraDano[2]);
    }
    return Object.keys(out).length ? out : null;
  }
