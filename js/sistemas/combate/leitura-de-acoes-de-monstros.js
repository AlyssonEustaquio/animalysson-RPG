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
