function limparEfeitosDaFonte(id) {
      toks().forEach(function(o) {
        if (!o.efeitos) return;
        if (o.efeitos.lento && o.efeitos.lento.fonte === id) delete o.efeitos.lento;
        if (o.efeitos.sap && o.efeitos.sap.fonte === id) delete o.efeitos.sap;
        if (o.efeitos.ajudadoPor === id) delete o.efeitos.ajudadoPor;
        if (o.efeitos.distraido === id) delete o.efeitos.distraido;
      });
    }
function iniciarTurno(t) {
      var L = [], s = preparar(t);
      var recarga = t.recargas || {};
      t.eco = novaEco();
      limparEfeitosDaFonte(t.id);
      L.push("— Turno de " + nomeDe(t) + " —");
      if (t.efeitos && t.efeitos.furia) {
        if (!t.efeitos.furiaAtividade) {
          delete t.efeitos.furia;
          L.push(nomeDe(t) + " não atacou nem sofreu dano desde o último turno: a Fúria termina.");
        }
        t.efeitos.furiaAtividade = false;
      }
      (s.ataques || []).forEach(function(a) {
        if (a.recarga && recarga[a.nome] === false) {
          var r = d(6);
          if (r >= a.recarga) {
            recarga[a.nome] = true;
            L.push(a.nome + " recarregou (d6 = " + r + ").");
          } else L.push(a.nome + " não recarregou (d6 = " + r + ").");
        }
      });
      t.recargas = recarga;
      if (ehJogador(t) && t.hp <= 0 && !t.morto && !t.estavel) L.push.apply(L, salvaContraMorte(t));
      return L;
    }
function encerrarTurno(t) {
      var L = [];
      (t.condicoes || []).slice().forEach(function(c) {
        if (c.salva) {
          var fonte = porId(c.fonte);
          var rs = salvar(t, c.salva.atributo, c.salva.cd, { desvantagem: c.id === "amedrontado" && fonte && env.linhaVisao(t, fonte) && c.salva.desvDeVisao });
          L.push(rs.texto);
          if (rs.sucesso) {
            t.condicoes = t.condicoes.filter(function(x) {
              return x !== c;
            });
            L.push(CONDICOES[c.id] + " termina em " + nomeDe(t) + ".");
            return;
          }
        }
        if (c.rodadas != null) {
          c.rodadas -= 1;
          if (c.rodadas <= 0) {
            t.condicoes = t.condicoes.filter(function(x) {
              return x !== c;
            });
            L.push(CONDICOES[c.id] + " termina em " + nomeDe(t) + ".");
          }
        }
      });
      if (t.efeitos && t.efeitos.vex) {
        t.efeitos.vex.turnos -= 1;
        if (t.efeitos.vex.turnos <= 0) delete t.efeitos.vex;
      }
      return L;
    }
C.atual = function() {
      var s = est();
      if (!s.ativo || !s.ordem.length) return null;
      var item = s.ordem[s.turno];
      return item ? porId(item.id) : null;
    };
C.ativo = function() {
      return !!est().ativo;
    };
C.preparar = preparar;
C.stats = stats;
C.veloc = veloc;
C.movimentoRestante = movimentoRestante;
C.condicoesDe = function(t) {
      return Object.keys(condSet(t));
    };
C.tem = tem;
C.aplicarCondicao = aplicarCondicao;
C.removerCondicao = removerCondicao;
C.faccao = faccao;
C.hostis = hostis;
C.dist = dist;
C.incapacitado = incapacitado;
C.ehJogador = ehJogador;
C.pontosDeVidaTexto = pontosDeVidaTexto;
C.nomeDe = nomeDe;
C.viva = viva;
C.monstro = monstro;
C.bonusPericia = bonusPericia;
C.registrar = registrar;
C.novaEco = novaEco;
function verificarFim() {
      var vivos = toks().filter(function(t) {
        return viva(t) && faccao(t) === "monstros" && t.hp > 0;
      });
      var herois = toks().filter(function(t) {
        return viva(t) && faccao(t) === "jogadores" && (t.hp > 0 || ehJogador(t) && !t.estavel);
      });
      if (!vivos.length) return "vitoria";
      if (!herois.length) return "derrota";
      return null;
    }
C.iniciar = function(opts) {
      opts = opts || {};
      var s = est(), L = [];
      var lista = toks().filter(function(t) {
        return !t.morto && (t.tipo === "player" || t.monsterId || t.tipo === "npc" || t.tipo === "enemy" || t.hpMax != null);
      });
      if (typeof opts.filtro === "function") lista = lista.filter(opts.filtro);
      if (!lista.length) return ["Não há criaturas no mapa para entrar em combate."];
      var rolagens = lista.map(function(t) {
        var st = preparar(t);
        t.eco = novaEco();
        t.efeitos = {};
        t.escondido = false;
        if (window.Dados3D) window.Dados3D.lancador(t.id);
        var r = d20(t.surpreso ? -1 : 0);
        var bonus = st.iniciativa + (Number(t.bonusIniciativa) || 0) - 2 * (t.exaustao || 0);
        return { id: t.id, nome: nomeDe(t), valor: r.dado + bonus, des: st.mods.DES, desempate: Math.random() };
      });
      if (window.Dados3D) window.Dados3D.lancador(null);
      rolagens.sort(function(a, b) {
        return b.valor - a.valor || b.des - a.des || b.desempate - a.desempate;
      });
      if (opts.primeiro) {
        var ip = rolagens.findIndex(function(x) {
          return x.id === opts.primeiro;
        });
        if (ip > 0) {
          var topo = Math.max.apply(null, rolagens.map(function(x) {
            return x.valor;
          }));
          var pri = rolagens.splice(ip, 1)[0];
          pri.valor = topo;
          rolagens.unshift(pri);
        }
      }
      s.ativo = true;
      s.rodada = 1;
      s.turno = 0;
      s.ordem = rolagens.map(function(x) {
        return { id: x.id, valor: x.valor };
      });
      s.registro = [];
      s.xpGanho = 0;
      lista.forEach(function(t) {
        delete t.surpreso;
      });
      L.push("Combate iniciado! Iniciativa: " + rolagens.map(function(x) {
        return x.nome + " " + x.valor;
      }).join(", ") + ".");
      L.push("— Rodada 1 —");
      var primeiro = C.atual();
      if (primeiro) L.push.apply(L, iniciarTurno(primeiro));
      registrar(L);
      return L;
    };
C.encerrar = function(motivo) {
      var s = est(), L = [];
      if (!s.ativo) return L;
      s.ativo = false;
      toks().forEach(function(t) {
        t.eco = novaEco();
        if (t.efeitos) {
          delete t.efeitos.lento;
          delete t.efeitos.sap;
          delete t.efeitos.vex;
          delete t.efeitos.ajudadoPor;
          delete t.efeitos.distraido;
        }
      });
      if (motivo === "vitoria") {
        var xp = 0;
        toks().forEach(function(t) {
          if (t.morto && t.monsterId) {
            var m = monstro(t);
            if (m) xp += XP_POR_ND[String(m.ndNumerico)] || 0;
          }
        });
        L.push("Vitória! Todos os inimigos foram derrotados." + (xp ? " XP total dos inimigos: " + xp + "." : ""));
      } else if (motivo === "derrota") L.push("O grupo foi derrotado.");
      else L.push("Combate encerrado.");
      registrar(L);
      return L;
    };
C.proximoTurno = function() {
      var s = est(), L = [];
      if (!s.ativo) return L;
      var cur = C.atual();
      if (cur) L.push.apply(L, encerrarTurno(cur));
      var fim = verificarFim();
      if (fim) {
        L.push.apply(L, C.encerrar(fim));
        registrar(L);
        return L;
      }
      var guarda = 0;
      while (guarda++ < s.ordem.length + 2) {
        s.turno += 1;
        if (s.turno >= s.ordem.length) {
          s.turno = 0;
          s.rodada += 1;
          L.push("— Rodada " + s.rodada + " —");
        }
        var cand = porId(s.ordem[s.turno].id);
        if (!cand || cand.morto) continue;
        var ls = iniciarTurno(cand);
        L.push.apply(L, ls);
        if (ehJogador(cand) && cand.hp <= 0) {
          if (cand.morto) {
            var f2 = verificarFim();
            if (f2) {
              L.push.apply(L, C.encerrar(f2));
              registrar(L);
              return L;
            }
          }
          continue;
        }
        break;
      }
      var fim2 = verificarFim();
      if (fim2) L.push.apply(L, C.encerrar(fim2));
      registrar(L);
      return L;
    };
C.entrarNoCombate = function(t) {
      var s = est(), L = [];
      if (!s.ativo || s.ordem.some(function(x) {
        return x.id === t.id;
      })) return L;
      var st = preparar(t);
      var r = d20(0), valor = r.dado + st.iniciativa;
      var atual = C.atual();
      s.ordem.push({ id: t.id, valor });
      var idAtual = atual ? atual.id : null;
      s.ordem.sort(function(a, b) {
        return b.valor - a.valor;
      });
      s.turno = Math.max(0, s.ordem.findIndex(function(x) {
        return x.id === idAtual;
      }));
      L.push(nomeDe(t) + " entra no combate com iniciativa " + valor + ".");
      registrar(L);
      return L;
    };
C.gastar = function(t, tipo) {
      if (!est().ativo) return { ok: true };
      var atual = C.atual();
            if (tipo !== "reacao" && atual && atual !== t) return { ok: false, motivo: "Não é o turno de " + nomeDe(t) + "." };
      if (incapacitado(t)) return { ok: false, motivo: nomeDe(t) + " está incapacitado." };
      if (!t.eco) t.eco = novaEco();
      if (!t.eco[tipo]) return { ok: false, motivo: tipo === "acao" ? "A ação deste turno já foi usada." : tipo === "bonus" ? "A ação bônus deste turno já foi usada." : "A reação já foi usada." };
      t.eco[tipo] = false;
      return { ok: true };
    };
C.devolver = function(t, tipo) {
      if (est().ativo && t.eco) t.eco[tipo] = true;
    };
C.podeAgir = function(t, tipo) {
      if (!est().ativo) return true;
      var atual = C.atual();
      if (tipo !== "reacao" && atual && atual !== t) return false;
      return !incapacitado(t) && !!(t.eco && t.eco[tipo]);
    };
