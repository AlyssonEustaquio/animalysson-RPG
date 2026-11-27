function combatTextDialog(title, label, placeholder, onOk) {
    var dlg = combatDialog(title, "", 420);
    if (!dlg) return;
    var input = combatField(dlg.panel, label, combatInput("text", placeholder || ""));
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    actions.appendChild(combatButton("Cancelar", function() {
      combatClose(dlg);
    }));
    actions.appendChild(combatButton("Confirmar", function() {
      var v = input.value.trim();
      combatClose(dlg);
      onOk(v);
    }, { primary: true }));
    dlg.panel.appendChild(actions);
  }
function combatNumberDialog(title, label, value, min, max, onOk) {
    var dlg = combatDialog(title, "", 380);
    if (!dlg) return;
    var input = combatField(dlg.panel, label, combatInput("number", value));
    input.min = min;
    input.max = max;
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    actions.appendChild(combatButton("Cancelar", function() {
      combatClose(dlg);
    }));
    actions.appendChild(combatButton("Confirmar", function() {
      var v = Math.max(min, Math.min(max, Math.round(Number(input.value) || min)));
      combatClose(dlg);
      onOk(v);
    }, { primary: true }));
    dlg.panel.appendChild(actions);
  }
function combatNearby(actor, filter) {
    var C = getCombat();
    return state.tokens.filter(function(t) {
      return t !== actor && !t.morto && (!filter || filter(t));
    }).map(function(t) {
      return { token: t, distancia: C.dist(actor, t) };
    }).sort(function(a, b) {
      return a.distancia - b.distancia;
    });
  }
function openCombatMenu() {
    var C = getCombat();
    if (!C) {
      appAlertMessage("msg014", "O módulo de combate não foi carregado (combate.js).");
      return;
    }
    if (isHexMap()) {
      combatToast("O combate funciona nos mapas de masmorra (grade quadrada).");
      return;
    }
    var actor = combatActor();
    if (!actor) {
      combatShowLog("Combate", ["Selecione um token para agir (modo Editor) ou crie o personagem jogador."]);
      return;
    }
    C.preparar(actor);
    var live = C.ativo(), st = C.stats(actor);
    var info = C.pontosDeVidaTexto(actor) + " · CA " + (actor.ca || st.ca) + (live ? " · Movimento " + (Math.round(C.movimentoRestante(actor) * 15) / 10).toString().replace(".", ",") + " m" : "");
    var dlg = combatDialog("⚔ " + actor.nome, info, 560);
    if (!dlg) return;
    var bloqueadas = [], secoes = [];
    function section(title, openByDefault) {
      var details = document.createElement("details");
      details.className = "mp-cb-accordion";
      details.open = !!openByDefault;
      var h = document.createElement("summary");
      h.className = "mp-cb-section";
      h.textContent = title;
      details.appendChild(h);
      var g = document.createElement("div");
      g.className = "mp-cb-grid";
      details.appendChild(g);
      dlg.panel.appendChild(details);
      secoes.push({ details: details, grid: g });
      return g;
    }
    function add(grid, label, kind, run, extraOff, hint) {
      var off = false, why = "";
      if (extraOff) {
        off = true;
        why = extraOff;
      } else if (live && kind && !C.podeAgir(actor, kind)) {
        off = true;
        why = actor !== C.atual() && kind !== "reacao" ? "Não é o turno desta criatura." : kind === "acao" ? "Ação já usada." : kind === "bonus" ? "Ação bônus já usada." : "Reação já usada.";
        if (kind === "acao" && actor.eco.emAtaque && actor.eco.ataquesRestantes > 0 && label === "Atacar") {
          off = false;
          why = "";
        }
      }
      var botao = combatButton(label, function() {
        combatClose(dlg);
        run();
      }, { disabled: off, title: off ? why : hint });
      if (off) {
        if (why) {
          var motivo = document.createElement("small");
          motivo.textContent = why;
          motivo.style.cssText = "display:block;font-weight:400;opacity:.75;font-size:.75em";
          botao.appendChild(motivo);
        }
        bloqueadas.push(botao);
      } else grid.appendChild(botao);
    }
    var acao = section("Ação principal", true);
    add(acao, "Atacar", "acao", function() {
      combatAttackFlow(actor);
    }, null, "Ataque com arma, golpe desarmado ou ação do monstro");
    if (st.tipo === "monstro") {
      st.ataques.filter(function(a) {
        return a.tipo === "salva";
      }).forEach(function(a) {
        var off = a.recarga && actor.recargas && actor.recargas[a.nome] === false ? "Aguardando recarga." : null;
        add(acao, a.nome.replace(/\s*\(Recarga[^)]*\)/, ""), "acao", function() {
          var area = a.area || 6;
          var alvos = state.tokens.filter(function(t) {
            return t !== actor && !t.morto && C.hostis(actor, t) && t.hp > 0 && C.dist(actor, t) <= area && combatLineOfSight(actor, t);
          });
          if (!alvos.length) {
            combatShowLog(a.nome, ["Nenhum inimigo na área (" + (Math.round(area * 15) / 10).toString().replace(".", ",") + " m)."]);
            return;
          }
          var g = C.gastar(actor, "acao");
          if (!g.ok) {
            combatShowLog(a.nome, [g.motivo]);
            return;
          }
          if (a.recarga) actor.recargas[a.nome] = false;
          var lines = [actor.nome + " usa " + a.nome + "."];
          alvos.forEach(function(t) {
            lines = lines.concat(C.aplicarAcaoSalva(actor, t, a));
          });
          C.registrar(lines);
          combatFinishAction({ linhas: lines });
        }, off, a.descricao);
      });
    }
    add(acao, "Agarrar", "acao", function() {
      combatPickToken("Agarrar", "Alvo adjacente (CD 8 + Força + proficiência).", combatNearby(actor, function(t) {
        return C.hostis(actor, t) && C.dist(actor, t) <= 1;
      }), function(t) {
        var g = C.gastar(actor, "acao");
        if (!g.ok) {
          combatShowLog("Agarrar", [g.motivo]);
          return;
        }
        var r = C.agarrar(actor, t);
        C.registrar(r.linhas);
        combatFinishAction(r);
      });
    });
    add(acao, "Empurrar", "acao", function() {
      combatPickToken("Empurrar", "Alvo adjacente (CD 8 + Força + proficiência).", combatNearby(actor, function(t) {
        return C.hostis(actor, t) && C.dist(actor, t) <= 1;
      }), function(t) {
        var dlg2 = combatDialog("Empurrar", "Escolha o efeito.", 380);
        var actions2 = document.createElement("div");
        actions2.className = "mp-portal-dialog-actions";
        [["afastar", "Afastar 1,5 m"], ["derrubar", "Derrubar"]].forEach(function(o) {
          actions2.appendChild(combatButton(o[1], function() {
            combatClose(dlg2);
            var g = C.gastar(actor, "acao");
            if (!g.ok) {
              combatShowLog("Empurrar", [g.motivo]);
              return;
            }
            var r = C.empurrar(actor, t, o[0]);
            C.registrar(r.linhas);
            combatFinishAction(r);
          }, { primary: o[0] === "afastar" }));
        });
        dlg2.panel.appendChild(actions2);
      });
    });
    add(acao, "Disparada", "acao", function() {
      combatFinishAction(C.disparada(actor));
    });
    add(acao, "Desengajar", "acao", function() {
      combatFinishAction(C.desengajar(actor));
    });
    add(acao, "Esquivar", "acao", function() {
      combatFinishAction(C.esquivar(actor));
    });
    add(acao, "Ajudar", "acao", function() {
      combatPickToken("Ajudar", "Aliado (ataque ou teste) ou inimigo adjacente (distrair).", combatNearby(actor, function(t) {
        return C.hostis(actor, t) ? C.dist(actor, t) <= 1 : true;
      }), function(t) {
        combatFinishAction(C.ajudar(actor, t, C.hostis(actor, t) ? "distrair" : "aliado"));
      });
    });
    add(acao, "Esconder", "acao", function() {
      combatFinishAction(C.esconder(actor));
    });
    add(acao, "Procurar", "acao", function() {
      combatFinishAction(C.procurar(actor));
    });
    add(acao, "Preparar", "acao", function() {
      combatTextDialog("Preparar ação", "Gatilho e ação (ex.: atacar quando o goblin entrar na sala)", "", function(v) {
        combatFinishAction(C.preparar_acao(actor, v));
      });
    });
    add(acao, "Utilizar", "acao", function() {
      combatTextDialog("Utilizar objeto", "O que será utilizado?", "", function(v) {
        combatFinishAction(C.utilizar(actor, v));
      });
    });
    if (st.tipo === "pc") {
      add(acao, "Magia", "acao", function() {
        combatSpellDialog(actor);
      });
      add(acao, "Influenciar", "acao", function() {
        combatSkillDialog(actor, "Influenciar", ["Enganação", "Intimidação", "Atuação", "Persuasão", "Adestrar Animais"], "influenciar");
      });
      add(acao, "Estudar", "acao", function() {
        combatSkillDialog(actor, "Estudar", ["Arcanismo", "História", "Investigação", "Natureza", "Religião"], "estudar");
      });
    }
    add(acao, "Escapar de agarrão", "acao", function() {
      combatFinishAction(C.escapar(actor));
    }, C.tem(actor, "agarrado") ? null : "Não está agarrado.");
    add(acao, "Estabilizar", "acao", function() {
      combatPickToken("Estabilizar", "Criatura adjacente com 0 PV (Medicina CD 10).", combatNearby(actor, function(t) {
        return t.hp <= 0 && C.dist(actor, t) <= 1;
      }), function(t) {
        combatFinishAction(C.estabilizar(actor, t));
      });
    });
    var bonus = section("Ação bônus", false);
    add(bonus, "Ataque com arma Leve", "bonus", function() {
      combatLightExtra(actor, "bonus");
    }, st.tipo !== "pc" ? "Somente personagens." : live && !actor.eco.leve ? "Ataque antes com uma arma corpo a corpo Leve." : null);
    if (st.classe === "Monge") add(bonus, "Artes Marciais (golpe desarmado)", "bonus", function() {
      combatPerformAttack(actor, combatUnarmedAttack(actor), "bonus");
    }, live && !actor.eco.atacou ? "Use a ação Atacar antes." : null);
    C.caracteristicas(actor).forEach(function(car) {
      add(bonus, car.nome + " (" + car.restante + ")", car.custo, function() {
        if (car.id === "maos") {
          combatPickToken("Mãos Consagradas", "Criatura tocada.", [{ token: actor, distancia: 0 }].concat(combatNearby(actor, function(t) {
            return C.dist(actor, t) <= 1 && !C.hostis(actor, t);
          })), function(t) {
            combatNumberDialog("Mãos Consagradas", "Pontos gastos (reserva " + car.restante + ")", 1, 1, car.restante, function(q) {
              combatFinishAction(C.usarCaracteristica(actor, car.id, { alvo: t, quantidade: q }));
            });
          });
        } else combatFinishAction(C.usarCaracteristica(actor, car.id));
      }, null, car.desc);
    });
    var mov = section("Movimento e interação", false);
    add(mov, "Levantar-se", null, function() {
      var l = C.levantar(actor);
      C.registrar(l);
      combatFinishAction({ linhas: l });
    }, C.tem(actor, "caido") ? null : "Não está caído.");
    if (st.tipo === "pc" && invAtivo()) {
      var invMontarias = S.inventario.itens.filter(function(i) {
        return i.tipo === "montaria";
      });
      var invAtual = invMontarias.find(function(m) {
        return m.montado;
      });
      if (invMontarias.length) {
        add(
          mov,
          invAtual ? "Desmontar" : "Montar",
          null,
          function() {
            combatToggleMount(actor);
          },
          live && actor.eco && actor.eco.montou ? "Já montou ou desmontou neste turno." : null,
          "Custa metade do seu deslocamento."
        );
        if (invAtual && invAtual.controle !== "independente") {
          var montOff = !live ? "Disponível durante o combate." : actor.eco && actor.eco.montariaAgiu ? "A montaria já agiu neste turno." : null;
          add(mov, "Montaria: Disparada", null, function() {
            combatMountAction(actor, "disparada");
          }, montOff, "A montaria controlada age na sua iniciativa.");
          add(mov, "Montaria: Desengajar", null, function() {
            combatMountAction(actor, "desengajar");
          }, montOff, "A montaria controlada age na sua iniciativa.");
          add(mov, "Montaria: Esquivar", null, function() {
            combatMountAction(actor, "esquivar");
          }, montOff, "A montaria controlada age na sua iniciativa.");
        }
      }
    }
    add(mov, "Interagir com objeto", null, function() {
      combatTextDialog("Interagir com objeto", "Qual objeto? (1 interação gratuita por turno)", "", function(v) {
        combatFinishAction(C.interagirObjeto(actor, v));
      });
    });
    add(mov, "Ação preparada (reação)", "reacao", function() {
      combatFinishAction(C.usarPreparada(actor));
    }, actor.preparada ? null : "Nenhuma ação preparada.");
    if (!live && st.tipo === "pc") {
      var rest = section("Descanso", false);
      add(rest, "Descanso curto", null, function() {
        var l = C.descansarCurto(actor, st.dadoVida || 8);
        combatFinishAction({ linhas: l });
      });
      add(rest, "Descanso longo", null, function() {
        var l = C.descansarLongo(actor);
        combatFinishAction({ linhas: l });
      });
    }
    secoes.forEach(function(s) {
      if (!s.grid.children.length) s.details.remove();
    });
    if (bloqueadas.length) {
      var gradeBloqueadas = section("Indisponíveis agora", false);
      bloqueadas.forEach(function(b) {
        gradeBloqueadas.appendChild(b);
      });
    }
    var primeira = secoes.find(function(s) {
      return s.details.parentNode;
    });
    if (primeira) primeira.details.open = true;
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    actions.appendChild(combatButton("Fechar", function() {
      combatClose(dlg);
    }, { primary: true }));
    dlg.panel.appendChild(actions);
  }
