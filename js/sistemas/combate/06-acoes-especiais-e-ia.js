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

function expandirMultiataque(multi, atkAcoes) {
      var seq = [];
      if (!atkAcoes.length) return seq;
      var texto = multi.texto || "";
      atkAcoes.forEach(function(a) {
        var tronco = norm(a.nome).slice(0, 4);
        var pos = tronco.length >= 3 ? texto.indexOf(tronco) : -1;
        if (pos < 0) return;
        var antes = texto.slice(Math.max(0, pos - 22), pos);
        var mm = antes.match(/(um|uma|dois|duas|tres|quatro|cinco|seis)\s+(?:ataques?\s+)?(?:com\s+)?(?:a|as|o|os|sua|suas|seu|seus)?\s*$/);
        var n = mm ? PALAVRAS_NUM[mm[1]] : 1;
        for (var i = 0; i < n; i++) seq.push(a);
      });
      var total = multi.qtd && multi.qtd.dados ? (rolar(multi.qtd.dados, false) || { total: 2 }).total : multi.qtd && multi.qtd.n || 2;
      if (!seq.length) {
        var ordenados = atkAcoes.slice().sort(function(a, b) {
          return somaMedia(b) - somaMedia(a);
        });
        for (var j = 0; j < total; j++) seq.push(ordenados[j % ordenados.length]);
      } else if (seq.length < total) {
        while (seq.length < total) seq.push(seq[seq.length - 1]);
      }
      return seq.slice(0, 8);
    }

function somaMedia(a) {
      return (a.dano || []).reduce(function(acc, p) {
        return acc + mediaDano(p.dados);
      }, 0);
    }

function escolherAlvoIA(t) {
      var cand = toks().filter(function(o) {
        return o !== t && viva(o) && hostis(t, o) && o.hp > 0 && !o.escondido;
      });
      if (!cand.length) cand = toks().filter(function(o) {
        return o !== t && viva(o) && hostis(t, o) && ehJogador(o) && o.hp <= 0 && !o.estavel;
      });
      if (!cand.length) return null;
      cand.sort(function(a, b) {
        return dist(t, a) - dist(t, b) || a.hp - b.hp;
      });
      return cand[0];
    }

function passoIA(t, cel, L) {
      var de = { x: t.x, y: t.y }, custo = tem(t, "caido") ? 2 : 1;
      if (movimentoRestante(t) < custo) return false;
      env.mover(t, cel.x, cel.y);
      t.eco.mov += custo;
      var oa = ataquesDeOportunidade(t, de, { x: cel.x, y: cel.y });
      if (oa.length) L.push.apply(L, oa);
      return !t.morto;
    }

C.turnoIA = function(t) {
      var L = [], s = preparar(t);
      if (incapacitado(t) || t.hp <= 0) {
        L.push(nomeDe(t) + " está incapacitado e perde o turno.");
        registrar(L);
        return L;
      }
      if (tem(t, "caido")) {
        L.push.apply(L, C.levantar(t));
      }
      var alvo = escolherAlvoIA(t);
      if (!alvo) {
        registrar(L);
        return L;
      }
      var acoes = s.ataques || [];
      var atkAcoes = acoes.filter(function(a) {
        return a.tipo === "ataque";
      });
      var salvaAcoes = acoes.filter(function(a) {
        return a.tipo === "salva" && a.recarga && t.recargas[a.nome] !== false;
      });
      var usouSalva = false;
      salvaAcoes.forEach(function(a) {
        if (usouSalva) return;
        var raioAcao = a.area || 6;
        var alvos = toks().filter(function(o) {
          return o !== t && viva(o) && hostis(t, o) && o.hp > 0 && dist(t, o) <= raioAcao && env.linhaVisao(t, o);
        });
        if (!alvos.length) return;
        usouSalva = true;
        t.recargas[a.nome] = false;
        t.eco.acao = false;
        L.push(nomeDe(t) + " usa " + a.nome + ".");
        alvos.forEach(function(o) {
          L.push.apply(L, aplicarAcaoSalva(t, o, a));
        });
      });
      if (usouSalva) {
        registrar(L);
        return L;
      }
      var seq = [], multi = acoes.find(function(a) {
        return a.tipo === "multi";
      });
      if (atkAcoes.length) {
        if (multi) seq = expandirMultiataque(multi, atkAcoes);
        if (!seq.length) {
          var melhor = atkAcoes.slice().sort(function(a, b) {
            return somaMedia(b) - somaMedia(a);
          })[0];
          seq = [melhor];
        }
      }
      if (!seq.length) {
        var salvaLivre = acoes.find(function(a) {
          return a.tipo === "salva" && !a.recarga && a.area;
        });
        if (salvaLivre) {
          var area = toks().filter(function(o) {
            return o !== t && viva(o) && hostis(t, o) && o.hp > 0 && dist(t, o) <= salvaLivre.area && env.linhaVisao(t, o);
          });
          if (area.length) {
            L.push(nomeDe(t) + " usa " + salvaLivre.nome + ".");
            area.forEach(function(o) {
              L.push.apply(L, aplicarAcaoSalva(t, o, salvaLivre));
            });
          }
        }
        if (!L.length) L.push(nomeDe(t) + " não tem ataques utilizáveis e aguarda.");
        registrar(L);
        return L;
      }
      var primeira = seq[0];
      var distancia = dist(t, alvo);
      var modoPrim = primeira.modo === "ambos" ? distancia <= primeira.alcanceCorpo ? "corpo" : "distancia" : primeira.modo === "distancia" ? "distancia" : "corpo";
      var alcNec = modoPrim === "corpo" ? primeira.alcanceCorpo : primeira.alcanceNormal;
      if (distancia > alcNec) {
        var rota = env.caminho ? env.caminho(t, alvo, alcNec, 200) : null;
        if (rota && rota.length) {
          var passos = 0;
          for (var i = 0; i < rota.length; i++) {
            if (movimentoRestante(t) < (tem(t, "caido") ? 2 : 1)) {
              if (t.eco.acao && !t.eco.dash && i < rota.length && veloc(t) > 0) {
                t.eco.dash = true;
                t.eco.movExtra += veloc(t);
                t.eco.acao = false;
                L.push(nomeDe(t) + " usa Disparada.");
              } else break;
            }
            if (!passoIA(t, rota[i], L)) break;
            passos++;
            if (pegadaDist(t.x, t.y, raio(t), alvo.x, alvo.y, raio(alvo)) <= alcNec) break;
          }
          if (passos) L.unshift(nomeDe(t) + " avança " + mts(passos) + " m.");
        }
        distancia = dist(t, alvo);
      }
      if (t.morto) {
        registrar(L);
        return L;
      }
      if (!t.eco.acao) {
        registrar(L);
        return L;
      }
      t.eco.acao = false;
      var alvoAtual = alvo;
      var fez = false;
      seq.forEach(function(a) {
        if (t.morto || incapacitado(t)) return;
        if (alvoAtual.morto || alvoAtual.hp <= 0 && !ehJogador(alvoAtual)) {
          var novo = escolherAlvoIA(t);
          if (!novo) return;
          alvoAtual = novo;
        }
        var d0 = dist(t, alvoAtual);
        var modo = a.modo === "ambos" ? d0 <= a.alcanceCorpo ? "corpo" : "distancia" : a.modo === "distancia" ? "distancia" : "corpo";
        var atq = atqDeMonstro(a, modo);
        var r = atacar(t, alvoAtual, atq, {});
        if (!r.ok && /fora do alcance|linha de visão/.test(r.linhas[0])) {
          if (!fez) L.push(r.linhas[0]);
          return;
        }
        fez = true;
        L.push.apply(L, r.linhas);
      });
      registrar(L);
      return L;
    };

function aplicarAcaoSalva(t, alvo, a) {
      var L = [];
      var rs = salvar(alvo, a.atributo, a.cd, { magico: false });
      L.push(rs.texto);
      var parts = [];
      (a.dano || []).forEach(function(p) {
        var r = rolar(p.dados, false);
        if (!r) return;
        var val = rs.sucesso ? a.metade ? Math.floor(r.total / 2) : 0 : r.total;
        if (val > 0) parts.push({ valor: val, tipo: p.tipo });
      });
      if (parts.length) L.push.apply(L, aplicarDano(alvo, parts, { fonte: t, magico: false }).linhas);
      if (!rs.sucesso && a.condicao && !alvo.morto) {
        var m = aplicarCondicao(alvo, a.condicao, { fonte: t.id, rodadas: a.rodadas == null ? 10 : a.rodadas, salva: a.repete ? { atributo: a.atributo, cd: a.cd, desvDeVisao: true } : null });
        if (m) L.push(m);
      }
      return L;
    }

C.aplicarAcaoSalva = aplicarAcaoSalva;

C.controladoPorIA = function(t) {
      if (!t || ehJogador(t)) return false;
      return est().autoIA !== false;
    };

C.executarTurnosAutomaticos = function() {
      var s = est(), L = [], guarda = 0;
      while (s.ativo && guarda++ < s.ordem.length * 2 + 2) {
        var cur = C.atual();
        if (!cur || !C.controladoPorIA(cur)) break;
        L.push.apply(L, C.turnoIA(cur));
        if (est().ativo) L.push.apply(L, C.proximoTurno());
      }
      return L;
    };

C.encerrarTurnoAtual = function() {
      var L = C.proximoTurno();
      if (est().ativo) L.push.apply(L, C.executarTurnosAutomaticos());
      return L;
    };

C.iniciarCombate = function(opts) {
      var L = C.iniciar(opts);
      if (est().ativo) L.push.apply(L, C.executarTurnosAutomaticos());
      return L;
    };
