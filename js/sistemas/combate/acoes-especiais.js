function usar(t, tipo, fn) {
      preparar(t);
      var g = C.gastar(t, tipo);
      if (!g.ok) return { ok: false, linhas: [g.motivo] };
      var L = fn() || [];
      registrar(L);
      return { ok: true, linhas: L };
    }
C.disparada = function(t) {
      return usar(t, "acao", function() {
        if (est().ativo) t.eco.movExtra += Math.max(0, veloc(t));
        return [nomeDe(t) + " usa Disparada: deslocamento adicional de " + mts(Math.max(0, veloc(t))) + " m neste turno."];
      });
    };
C.desengajar = function(t) {
      return usar(t, "acao", function() {
        t.eco.desengajou = true;
        return [nomeDe(t) + " usa Desengajar: seu movimento não provoca ataques de oportunidade neste turno."];
      });
    };
C.esquivar = function(t) {
      return usar(t, "acao", function() {
        t.eco.esquiva = true;
        return [nomeDe(t) + " usa Esquivar: ataques contra ele têm desvantagem e ele tem vantagem em salvaguardas de Destreza até o início do próximo turno."];
      });
    };
C.ajudar = function(t, alvo, tipo) {
      return usar(t, "acao", function() {
        if (!alvo.efeitos) alvo.efeitos = {};
        if (tipo === "distrair") {
          alvo.efeitos.distraido = t.id;
          return [nomeDe(t) + " usa Ajudar: o próximo ataque de um aliado contra " + nomeDe(alvo) + " tem vantagem."];
        }
        alvo.efeitos.ajudadoPor = t.id;
        return [nomeDe(t) + " usa Ajudar: " + nomeDe(alvo) + " terá vantagem no próximo ataque ou teste de habilidade."];
      });
    };
C.esconder = function(t) {
      return usar(t, "acao", function() {
        var b = bonusPericia(t, "Furtividade", "DES") - 2 * (t.exaustao || 0);
        var armaduraPesada = env.armaduraDesvantagem ? env.armaduraDesvantagem(t) : false;
        var r = d20(armaduraPesada ? -1 : 0);
        var total = r.dado + b;
        if (total >= 15) {
          t.escondido = true;
          t.escondidoCD = total;
          return [nomeDe(t) + " usa Esconder: Furtividade " + textoD20(r, b, total) + " contra CD 15 — sucesso; está escondido."];
        }
        return [nomeDe(t) + " usa Esconder: Furtividade " + textoD20(r, b, total) + " contra CD 15 — falha."];
      });
    };
C.procurar = function(t) {
      return usar(t, "acao", function() {
        var b = bonusPericia(t, "Percepção", "SAB") - 2 * (t.exaustao || 0);
        var r = d20(0), total = r.dado + b, L = [nomeDe(t) + " usa Procurar: Percepção " + textoD20(r, b, total) + "."];
        var achou = false;
        toks().forEach(function(o) {
          if (o.escondido && hostis(t, o) && env.linhaVisao(t, o)) {
            if (total >= (o.escondidoCD || 15)) {
              o.escondido = false;
              achou = true;
              L.push(nomeDe(o) + " foi encontrado.");
            }
          }
        });
        if (!achou) L.push("Nenhuma criatura escondida foi encontrada.");
        return L;
      });
    };
C.preparar_acao = function(t, descricao) {
      return usar(t, "acao", function() {
        t.preparada = descricao || "ação preparada";
        return [nomeDe(t) + " prepara uma ação: " + t.preparada + ". Usa a reação quando o gatilho ocorrer."];
      });
    };
C.usarPreparada = function(t) {
      if (!t.preparada) return { ok: false, linhas: ["Não há ação preparada."] };
      var g = C.gastar(t, "reacao");
      if (!g.ok) return { ok: false, linhas: [g.motivo] };
      var texto = t.preparada;
      t.preparada = null;
      var L = [nomeDe(t) + " executa a ação preparada: " + texto + "."];
      registrar(L);
      return { ok: true, linhas: L };
    };
C.utilizar = function(t, descricao) {
      return usar(t, "acao", function() {
        return [nomeDe(t) + " usa Utilizar: " + (descricao || "interage com um objeto") + "."];
      });
    };
C.interagirObjeto = function(t, descricao) {
      preparar(t);
      if (est().ativo && t.eco.interacao) return { ok: false, linhas: ["A interação gratuita com objeto deste turno já foi usada. Use a ação Utilizar."] };
      if (est().ativo) t.eco.interacao = true;
      var L = [nomeDe(t) + " interage com um objeto: " + (descricao || "saca ou guarda um item") + "."];
      registrar(L);
      return { ok: true, linhas: L };
    };
C.testePericia = function(t, pericia, attr, cd, tipoAcao, rotulo) {
      return usar(t, tipoAcao || "acao", function() {
        var v = [], ds = [];
        if (t.efeitos && t.efeitos.ajudadoPor) {
          v.push("ajudado");
          delete t.efeitos.ajudadoPor;
        }
        if (tem(t, "envenenado")) ds.push("envenenado");
        if (tem(t, "amedrontado")) ds.push("amedrontado");
        var b = bonusPericia(t, pericia, attr) - 2 * (t.exaustao || 0);
        var r = d20(modoFinal(v, ds)), total = r.dado + b;
        var txt = nomeDe(t) + " usa " + (rotulo || pericia) + ": " + pericia + " " + textoD20(r, b, total);
        if (cd) txt += " contra CD " + cd + " — " + (total >= cd ? "sucesso" : "falha");
        return [txt + "."];
      });
    };
C.agarrar = function(att, alvo, gastarAtaque) {
      var L = [];
      var sa = preparar(att), sd = preparar(alvo);
      if (dist(att, alvo) > 1) return { ok: false, linhas: [nomeDe(alvo) + " não está ao alcance para ser agarrado."] };
      if (sd.tam > sa.tam + 1) return { ok: false, linhas: [nomeDe(alvo) + " é grande demais para ser agarrado."] };
      var cd = 8 + sa.mods.FOR + sa.prof;
      var rF = salvar(alvo, "FOR", cd, {}), rD = salvar(alvo, "DES", cd, {});
      var melhor = rF.sucesso || rD.sucesso;
      L.push(nomeDe(att) + " tenta agarrar " + nomeDe(alvo) + " (CD " + cd + "). " + (rF.sucesso ? rF.texto : rD.texto));
      if (!melhor) {
        var m = aplicarCondicao(alvo, "agarrado", { fonte: att.id, rodadas: null });
        var c = (alvo.condicoes || []).find(function(x) {
          return x.id === "agarrado" && x.fonte === att.id;
        });
        if (c) c.escape = cd;
        if (m) L.push(m + " CD de escape " + cd + ".");
      } else L.push(nomeDe(alvo) + " resiste ao agarrão.");
      consumirEfeitosDeAtaque(att, alvo);
      return { ok: true, linhas: L };
    };
C.empurrar = function(att, alvo, modo) {
      var L = [];
      var sa = preparar(att), sd = preparar(alvo);
      if (dist(att, alvo) > 1) return { ok: false, linhas: [nomeDe(alvo) + " não está ao alcance."] };
      if (sd.tam > sa.tam + 1) return { ok: false, linhas: [nomeDe(alvo) + " é grande demais para ser empurrado."] };
      var cd = 8 + sa.mods.FOR + sa.prof;
      var rF = salvar(alvo, "FOR", cd, {}), rD = salvar(alvo, "DES", cd, {});
      var resistiu = rF.sucesso || rD.sucesso;
      L.push(nomeDe(att) + " tenta empurrar " + nomeDe(alvo) + " (CD " + cd + "). " + (rF.sucesso ? rF.texto : rD.texto));
      if (resistiu) L.push(nomeDe(alvo) + " resiste ao empurrão.");
      else if (modo === "derrubar") {
        var m = aplicarCondicao(alvo, "caido", {});
        if (m) L.push(m);
      } else if (env.empurrar) {
        var n = env.empurrar(alvo, att, 1);
        L.push(nomeDe(alvo) + (n ? " é empurrado 1,5 m." : " não pode ser empurrado (obstáculo)."));
      }
      consumirEfeitosDeAtaque(att, alvo);
      return { ok: true, linhas: L };
    };
C.escapar = function(t) {
      return usar(t, "acao", function() {
        var c = (t.condicoes || []).find(function(x) {
          return x.id === "agarrado";
        });
        if (!c) return [nomeDe(t) + " não está agarrado."];
        var cd = c.escape || 10;
        var s = stats(t), ba = bonusPericia(t, "Atletismo", "FOR"), bc = bonusPericia(t, "Acrobacia", "DES");
        var b = Math.max(ba, bc) - 2 * (t.exaustao || 0);
        var r = d20(0), total = r.dado + b;
        if (total >= cd) {
          t.condicoes = t.condicoes.filter(function(x) {
            return x !== c;
          });
          return [nomeDe(t) + " tenta escapar: " + textoD20(r, b, total) + " contra CD " + cd + " — escapa do agarrão."];
        }
        return [nomeDe(t) + " tenta escapar: " + textoD20(r, b, total) + " contra CD " + cd + " — falha."];
      });
    };
C.estabilizar = function(t, alvo) {
      return usar(t, "acao", function() {
        if (alvo.hp > 0 || alvo.morto) return [nomeDe(alvo) + " não precisa ser estabilizado."];
        if (dist(t, alvo) > 1) return [nomeDe(alvo) + " está fora do alcance."];
        var b = bonusPericia(t, "Medicina", "SAB") - 2 * (t.exaustao || 0);
        var r = d20(0), total = r.dado + b;
        if (total >= 10) {
          alvo.estavel = true;
          alvo.mortes = { s: 0, f: 0 };
          return [nomeDe(t) + " estabiliza " + nomeDe(alvo) + ": Medicina " + textoD20(r, b, total) + " contra CD 10 — sucesso."];
        }
        return [nomeDe(t) + " tenta estabilizar " + nomeDe(alvo) + ": Medicina " + textoD20(r, b, total) + " contra CD 10 — falha."];
      });
    };
C.magia = function(t, p) {
      return usar(t, p.tipoAcao || "acao", function() {
        var L = [nomeDe(t) + " conjura " + (p.nome || "uma magia") + "."];
        if (p.concentracao) {
          if (t.concentracao) L.push("Concentração em " + t.concentracao + " foi encerrada.");
          t.concentracao = p.nome || "magia";
        }
        (p.alvos || []).forEach(function(alvo) {
          if (alvo.morto) return;
          if (p.efeito === "cura") {
            var rc = rolar(p.dados, false);
            if (rc) L.push.apply(L, curar(alvo, rc.total));
          } else if (p.efeito === "ataque") {
            var atq = { nome: p.nome || "Magia", bonus: p.bonus, distancia: true, alcanceNormal: p.alcance || 99, alcanceMax: p.alcance || 99, dano: [{ dados: p.dados, tipo: p.tipoDano }], magico: true, arma: false };
            L.push.apply(L, atacar(t, alvo, atq, {}).linhas);
          } else if (p.efeito === "salva") {
            var rs = salvar(alvo, p.atributo, p.cd, { magico: true });
            L.push(rs.texto);
            var rd = p.dados ? rolar(p.dados, false) : null;
            var val = rd ? rs.sucesso ? p.metade ? Math.floor(rd.total / 2) : 0 : rd.total : 0;
            if (val > 0) L.push.apply(L, aplicarDano(alvo, [{ valor: val, tipo: p.tipoDano }], { magico: true, fonte: t }).linhas);
            if (!rs.sucesso && p.condicao) {
              var m = aplicarCondicao(alvo, p.condicao, { fonte: t.id, rodadas: p.rodadas == null ? 10 : p.rodadas });
              if (m) L.push(m);
            }
          }
        });
        return L;
      });
    };
C.caracteristicas = function(t) {
      var s = stats(t), out = [];
      if (s.tipo !== "pc") return out;
      preparar(t);
      var u = t.usos;
      if (s.classe === "Guerreiro") {
        if (u.retomar == null) u.retomar = 2;
        out.push({ id: "retomar", nome: "Retomar o Fôlego", custo: "bonus", restante: u.retomar, desc: "Cura 1d10 + nível de Guerreiro." });
      }
      if (s.classe === "Bárbaro") {
        if (u.furia == null) u.furia = 2;
        out.push({ id: "furia", nome: t.efeitos && t.efeitos.furia ? "Encerrar Fúria" : "Fúria", custo: "bonus", restante: u.furia, desc: "Resistência a dano físico, +2 de dano com Força e vantagem em testes e salvaguardas de Força." });
      }
      if (s.classe === "Paladino") {
        if (u.maos == null) u.maos = 5 * (s.nivel || 1);
        out.push({ id: "maos", nome: "Mãos Consagradas", custo: "bonus", restante: u.maos, desc: "Gasta pontos da reserva para curar uma criatura tocada." });
      }
      return out;
    };
C.usarCaracteristica = function(t, id, param) {
      var s = stats(t);
      var cars = C.caracteristicas(t), car = cars.find(function(c) {
        return c.id === id;
      });
      if (!car) return { ok: false, linhas: ["Característica indisponível."] };
      if (id === "furia" && t.efeitos && t.efeitos.furia) {
        delete t.efeitos.furia;
        var L0 = [nomeDe(t) + " encerra a Fúria."];
        registrar(L0);
        return { ok: true, linhas: L0 };
      }
      if (car.restante <= 0) return { ok: false, linhas: [car.nome + " não tem usos restantes."] };
      return usar(t, car.custo, function() {
        if (id === "retomar") {
          t.usos.retomar -= 1;
          var r = rolar("1d10+" + (s.nivel || 1), false);
          return [nomeDe(t) + " usa Retomar o Fôlego (1d10+" + (s.nivel || 1) + " = " + r.total + ")."].concat(curar(t, r.total));
        }
        if (id === "furia") {
          t.usos.furia -= 1;
          t.efeitos.furia = true;
          t.efeitos.furiaAtividade = true;
          return [nomeDe(t) + " entra em Fúria: resistência a dano contundente, cortante e perfurante, +2 de dano com Força e vantagem em testes e salvaguardas de Força."];
        }
        if (id === "maos") {
          var alvo = param && param.alvo ? param.alvo : t;
          var q = Math.max(1, Math.min(t.usos.maos, Math.round(Number(param && param.quantidade) || 1)));
          if (dist(t, alvo) > 1) return [nomeDe(alvo) + " está fora do alcance."];
          t.usos.maos -= q;
          return [nomeDe(t) + " usa Mãos Consagradas (" + q + " pontos)."].concat(curar(alvo, q));
        }
        return [];
      });
    };
C.descansarCurto = function(t, dadoVida) {
      var s = stats(t), L = [];
      if (s.tipo !== "pc") return L;
      preparar(t);
      if (t.usos.dadosVida == null) t.usos.dadosVida = s.nivel || 1;
      if (t.usos.dadosVida > 0 && t.hp < t.hpMax && dadoVida) {
        t.usos.dadosVida -= 1;
        var r = d(dadoVida) + s.mods.CON;
        L.push(nomeDe(t) + " gasta 1 Dado de Vida (d" + dadoVida + (s.mods.CON ? sinal(s.mods.CON) : "") + " = " + Math.max(1, r) + ").");
        L.push.apply(L, curar(t, Math.max(1, r)));
      }
      if (s.classe === "Guerreiro") t.usos.retomar = Math.min(2, (t.usos.retomar == null ? 0 : t.usos.retomar) + 1);
      L.push(nomeDe(t) + " termina um descanso curto.");
      registrar(L);
      return L;
    };
C.descansarLongo = function(t) {
      var s = stats(t), L = [];
      preparar(t);
      t.hp = t.hpMax;
      t.hpTemp = 0;
      t.mortes = { s: 0, f: 0 };
      t.estavel = false;
      t.morto = false;
      t.condicoes = [];
      t.efeitos = {};
      t.concentracao = null;
      t.escondido = false;
      if (t.exaustao > 0) t.exaustao -= 1;
      t.usos = {};
      L.push(nomeDe(t) + " termina um descanso longo: PV restaurados e usos de características recuperados.");
      registrar(L);
      return L;
    };
