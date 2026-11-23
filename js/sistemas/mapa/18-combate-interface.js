function combatShowLog(title, lines, onClose, extraButtons) {
    var dlg = combatDialog(title, "", 620);
    if (!dlg) {
      if (onClose) onClose();
      return;
    }
    var list = document.createElement("div");
    list.className = "mp-cb-log";
    (lines || []).forEach(function(line) {
      var item = document.createElement("div");
      item.textContent = String(line);
      if (/^—/.test(line)) item.className = "mp-cb-head";
      list.appendChild(item);
    });
    dlg.panel.appendChild(list);
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    (extraButtons || []).forEach(function(b) {
      actions.appendChild(combatButton(b.label, function() {
        combatClose(dlg);
        b.run();
      }, { primary: !!b.primary }));
    });
    actions.appendChild(combatButton("Fechar", function() {
      combatClose(dlg);
      if (onClose) onClose();
    }, { primary: !extraButtons || !extraButtons.length }));
    dlg.panel.appendChild(actions);
    list.scrollTop = list.scrollHeight;
  }

function combatToast(text) {
    var hud = R && R.querySelector("#mp-combat-toast");
    if (!hud) return;
    hud.textContent = text;
    hud.style.display = "block";
    if (combatToastTimer) window.clearTimeout(combatToastTimer);
    combatToastTimer = window.setTimeout(function() {
      hud.style.display = "none";
    }, 2600);
  }

function combatTokenLabel(t) {
    var C = getCombat();
    var conds = C.condicoesDe(t).map(function(c) {
      return C.CONDICOES[c];
    });
    return (t.nome || "Criatura") + " — " + C.pontosDeVidaTexto(t) + (conds.length ? " · " + conds.join(", ") : "");
  }

function combatPickToken(title, description, candidates, onPick) {
    var dlg = combatDialog(title, description, 460);
    if (!dlg) return;
    var C = getCombat();
    if (!candidates.length) {
      var p = document.createElement("p");
      p.textContent = "Nenhum alvo válido (alcance, linha de visão e cobertura).";
      dlg.panel.appendChild(p);
    }
    var list = document.createElement("div");
    list.className = "mp-cb-list";
    candidates.forEach(function(c) {
      var t = c.token || c;
      var label = combatTokenLabel(t) + (c.distancia != null ? " · " + (Math.round(c.distancia * 15) / 10).toString().replace(".", ",") + " m" : "");
      list.appendChild(combatButton(label, function() {
        combatClose(dlg);
        onPick(t);
      }));
    });
    dlg.panel.appendChild(list);
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    actions.appendChild(combatButton("Cancelar", function() {
      combatClose(dlg);
    }));
    dlg.panel.appendChild(actions);
  }

function combatSelect(options, value) {
    var s = document.createElement("select");
    s.className = "mp-cb-input";
    options.forEach(function(o) {
      var op = document.createElement("option");
      op.value = o[0];
      op.textContent = o[1];
      s.appendChild(op);
    });
    if (value != null) s.value = value;
    return s;
  }

function combatField(dlgPanel, label, control) {
    var wrap = document.createElement("label");
    wrap.className = "mp-cb-field";
    var span = document.createElement("span");
    span.textContent = label;
    wrap.appendChild(span);
    wrap.appendChild(control);
    dlgPanel.appendChild(wrap);
    return control;
  }

function combatInput(type, value) {
    var i = document.createElement("input");
    i.type = type;
    i.value = value == null ? "" : value;
    i.className = "mp-cb-input";
    return i;
  }

function combatFinishAction(res, extraButtons) {
    var C = getCombat();
    combatRefreshUi();
    combatShowLog("Resultado", res.linhas || [], function() {
      if (C.ativo() && appMode === "player") combatAfterPlayerAction();
      combatRefreshUi();
    }, extraButtons);
  }

function combatAfterPlayerAction() {
    var C = getCombat();
    if (!C.ativo()) return;
    var cur = C.atual();
    if (cur && C.controladoPorIA(cur)) {
      var lines = C.executarTurnosAutomaticos();
      if (lines.length) combatShowLog("Turnos dos monstros", lines, combatRefreshUi);
    }
  }

function combatWeaponDialog(actor, title, filter, semMod, onChosen) {
    var dlg = combatDialog(title, "Escolha a arma do ataque.", 480);
    if (!dlg) return;
    var profile = playerActionProfile(actor);
    var weapons = (invAtivo() ? invEquippedWeapons() : playerWeaponCatalog()).filter(filter || function() {
      return true;
    });
    var options = weapons.map(function(w) {
      return [w.id, w.n + " — " + w.dano + (w.maestria ? " · " + w.maestria : "")];
    });
    if (!filter) options.unshift(["", "Golpe desarmado"]);
    if (!options.length) {
      combatClose(dlg);
      combatShowLog(title, ["Nenhuma arma equipada serve para este ataque."]);
      return;
    }
    var sel = combatField(dlg.panel, "Arma", combatSelect(options, invAtivo() && weapons.length ? weapons[0].id : profile.weaponId && options.some(function(o) {
      return o[0] === profile.weaponId;
    }) ? profile.weaponId : options[0][0]));
    var mode = combatField(dlg.panel, "Modo", combatSelect([["melee", "Corpo a corpo / padrão"], ["thrown", "Arremessar"]], "melee"));
    var two = combatField(dlg.panel, "Empunhadura versátil", combatSelect([["0", "Uma mão"], ["1", "Duas mãos"]], "0"));
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    actions.appendChild(combatButton("Cancelar", function() {
      combatClose(dlg);
    }));
    actions.appendChild(combatButton("Escolher alvo", function() {
      var weapon = sel.value ? playerWeaponById(sel.value) : null;
      var atq = weapon ? combatWeaponAttack(actor, weapon, mode.value, { semMod, duasMaos: two.value === "1" }) : combatUnarmedAttack(actor);
      combatClose(dlg);
      onChosen(atq);
    }, { primary: true }));
    dlg.panel.appendChild(actions);
  }

function combatPayAttack(actor, st) {
    var C = getCombat();
    if (!C.ativo()) return { ok: true, novo: false };
    if (!actor.eco) C.preparar(actor);
    if (actor.eco.emAtaque && actor.eco.ataquesRestantes > 0) return { ok: true, novo: false };
    var g = C.gastar(actor, "acao");
    if (!g.ok) return g;
    actor.eco.emAtaque = true;
    var multi = (st.ataques || []).find(function(a) {
      return a.tipo === "multi";
    });
    actor.eco.ataquesRestantes = st.tipo === "monstro" ? multi ? Math.max(1, multi.qtd && multi.qtd.n || 2) : 1 : st.ataquesPorAcao;
    return { ok: true, novo: true };
  }

function combatPerformAttack(actor, atq, bonusMode) {
    var C = getCombat(), st = C.stats(actor), pay = { ok: true, novo: false };
    if (!bonusMode) {
      pay = combatPayAttack(actor, st);
      if (!pay.ok) {
        combatShowLog("Ataque", [pay.motivo]);
        return;
      }
    } else if (C.ativo()) {
      var g = bonusMode === "nick" ? { ok: !actor.eco.nick } : C.gastar(actor, "bonus");
      if (!g.ok) {
        combatShowLog("Ataque", [g.motivo || "Esta opção já foi usada neste turno."]);
        return;
      }
      if (bonusMode === "nick") actor.eco.nick = true;
    }
    var candidates = C.alvosPossiveis(actor, atq, false);
    if (!candidates.length && pay.novo) {
      actor.eco.acao = true;
      actor.eco.emAtaque = false;
      actor.eco.ataquesRestantes = 0;
    }
    if (!candidates.length && bonusMode === "nick") actor.eco.nick = false;
    if (!candidates.length && bonusMode === "bonus") actor.eco.bonus = true;
    combatPickToken("Alvo de " + atq.nome, "Criaturas visíveis dentro do alcance.", candidates, function(target) {
      var started = null;
      if (!C.ativo() && actor.tipo === "player") {
        started = autoCombatBegin({ player: actor, victims: [target], first: actor, reason: "⚔ O personagem atacou " + target.nome + "! O combate começou." });
        if (started && !bonusMode) {
          var pay2 = combatPayAttack(actor, st);
          if (!pay2.ok) {
            combatShowLog("Ataque", started.concat([pay2.motivo]));
            return;
          }
        }
      }
      var res = C.atacar(actor, target, atq, {});
      if (res.ok && !bonusMode) {
        actor.eco.atacou = true;
        if (C.ativo()) {
          actor.eco.ataquesRestantes = Math.max(0, actor.eco.ataquesRestantes - 1);
          if (atq.leve && atq.melee) actor.eco.leve = true;
        }
      }
      C.registrar(res.linhas);
      if (started) res.linhas = started.concat(res.linhas);
      var buttons = [];
      var nick = C.stats(actor).maestria && atq.maestria && C.util.norm(atq.maestria) === "nick";
      if (res.ok && !bonusMode && atq.leve && atq.melee && nick && !actor.eco.nick && C.ativo()) {
        buttons.push({ label: "Ataque extra (Nick)", run: function() {
          combatLightExtra(actor, "nick");
        } });
      }
      if (res.ok && !bonusMode && C.ativo() && actor.eco.ataquesRestantes > 0) {
        buttons.push({ label: "Próximo ataque (" + actor.eco.ataquesRestantes + ")", primary: true, run: function() {
          combatAttackFlow(actor);
        } });
      }
      combatFinishAction(res, buttons);
    });
  }

function combatLightExtra(actor, mode) {
    combatWeaponDialog(actor, mode === "nick" ? "Ataque extra (Nick)" : "Ataque com arma Leve (ação bônus)", function(w) {
      var props = normalizeRpgText(w.propriedades || "");
      return /\bleve\b/.test(props) && (w.tipo || "").indexOf("corpo a corpo") >= 0;
    }, true, function(atq) {
      combatPerformAttack(actor, atq, mode);
    });
  }

function combatMonsterAttackFlow(actor) {
    var C = getCombat(), st = C.stats(actor);
    var attacks = st.ataques.filter(function(a) {
      return a.tipo === "ataque";
    });
    if (!attacks.length) {
      combatShowLog("Ataque", [actor.nome + " não possui ataques cadastrados."]);
      return;
    }
    var dlg = combatDialog("Ataque de " + actor.nome, "Escolha a ação de ataque.", 480);
    if (!dlg) return;
    var list = document.createElement("div");
    list.className = "mp-cb-list";
    attacks.forEach(function(a) {
      list.appendChild(combatButton(a.nome + " — " + (a.bonus >= 0 ? "+" : "") + a.bonus + " · " + a.dano.map(function(d) {
        return d.dados;
      }).join(" + "), function() {
        combatClose(dlg);
        var modo = a.modo === "ambos" ? "corpo" : a.modo === "distancia" ? "distancia" : "corpo";
        var atq = {
          nome: a.nome,
          bonus: a.bonus,
          distancia: modo === "distancia",
          alcanceNormal: modo === "corpo" ? a.alcanceCorpo : a.alcanceNormal || a.alcanceCorpo,
          alcanceMax: modo === "corpo" ? a.alcanceCorpo : a.alcanceMax || a.alcanceCorpo,
          dano: a.modo === "ambos" && a.dano.length > 1 ? [a.dano[0]] : a.dano,
          extra: a.extra,
          magico: !!a.magico,
          arma: false
        };
        if (a.modo === "ambos") {
          var alt = Object.assign({}, atq, { nome: a.nome + " (distância)", distancia: true, alcanceNormal: a.alcanceNormal, alcanceMax: a.alcanceMax, dano: a.dano.length > 1 ? [a.dano[1]] : a.dano });
          combatPickMode(actor, atq, alt);
        } else combatPerformAttack(actor, atq, null);
      }));
    });
    dlg.panel.appendChild(list);
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    actions.appendChild(combatButton("Cancelar", function() {
      combatClose(dlg);
    }));
    dlg.panel.appendChild(actions);
  }

function combatPickMode(actor, melee, ranged) {
    var dlg = combatDialog("Modo do ataque", "Corpo a corpo ou à distância?", 380);
    if (!dlg) return;
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    actions.appendChild(combatButton("Corpo a corpo", function() {
      combatClose(dlg);
      combatPerformAttack(actor, melee, null);
    }, { primary: true }));
    actions.appendChild(combatButton("À distância", function() {
      combatClose(dlg);
      combatPerformAttack(actor, ranged, null);
    }));
    dlg.panel.appendChild(actions);
  }

function combatAttackFlow(actor) {
    var C = getCombat();
    if (!C) return;
    var st = C.stats(actor);
    if (st.tipo === "monstro") {
      combatMonsterAttackFlow(actor);
      return;
    }
    if (C.ativo() && !C.podeAgir(actor, "acao") && !(actor.eco.emAtaque && actor.eco.ataquesRestantes > 0)) {
      combatShowLog("Ataque", [actor !== C.atual() ? "Não é o turno de " + actor.nome + "." : "A ação deste turno já foi usada."]);
      return;
    }
    combatWeaponDialog(actor, "Ação Atacar", null, false, function(atq) {
      combatPerformAttack(actor, atq, null);
    });
  }

function combatSpellDialog(actor) {
    var C = getCombat(), st = C.stats(actor);
    var abil = COMBAT_SPELL_ABILITY[st.classe] || "INT";
    var mod = st.mods[abil], dc = 8 + st.prof + mod, atk = st.prof + mod;
    var dlg = combatDialog("Conjurar magia", "CD de magia " + dc + " · bônus de ataque " + (atk >= 0 ? "+" : "") + atk + " (" + C.NOME_ATTR[abil] + ").", 520);
    if (!dlg) return;
    var nome = combatField(dlg.panel, "Nome da magia", combatInput("text", ""));
    var efeito = combatField(dlg.panel, "Efeito", combatSelect([["ataque", "Ataque de magia"], ["salva", "Salvaguarda"], ["cura", "Cura"], ["nenhum", "Sem dano (utilitária)"]], "ataque"));
    var dados = combatField(dlg.panel, "Dano ou cura (ex.: 3d6)", combatInput("text", "1d10"));
    var tipo = combatField(dlg.panel, "Tipo de dano", combatSelect(COMBAT_DAMAGE_TYPES, "fogo"));
    var attr = combatField(dlg.panel, "Salvaguarda do alvo", combatSelect(C.ATRIBUTOS.map(function(a) {
      return [a, C.NOME_ATTR[a]];
    }), "DES"));
    var metade = combatField(dlg.panel, "Em sucesso na salvaguarda", combatSelect([["1", "Metade do dano"], ["0", "Nenhum dano"]], "1"));
    var alcance = combatField(dlg.panel, "Alcance (m)", combatInput("number", "18"));
    var acao = combatField(dlg.panel, "Tempo de conjuração", combatSelect([["acao", "Ação"], ["bonus", "Ação bônus"]], "acao"));
    var conc = combatField(dlg.panel, "Concentração", combatSelect([["0", "Não"], ["1", "Sim"]], "0"));
    var list = document.createElement("div");
    list.className = "mp-cb-list";
    var alvoChecks = [];
    state.tokens.forEach(function(t) {
      if (t.morto) return;
      var row = document.createElement("label");
      row.className = "mp-cb-check";
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = t !== actor && C.hostis(actor, t) && combatLineOfSight(actor, t);
      row.appendChild(cb);
      row.appendChild(document.createTextNode(" " + combatTokenLabel(t) + " · " + (Math.round(C.dist(actor, t) * 15) / 10).toString().replace(".", ",") + " m"));
      list.appendChild(row);
      alvoChecks.push({ cb, token: t });
    });
    var cap = document.createElement("p");
    cap.textContent = "Alvos:";
    dlg.panel.appendChild(cap);
    dlg.panel.appendChild(list);
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    actions.appendChild(combatButton("Cancelar", function() {
      combatClose(dlg);
    }));
    actions.appendChild(combatButton("Conjurar", function() {
      var alvos = alvoChecks.filter(function(x) {
        return x.cb.checked;
      }).map(function(x) {
        return x.token;
      });
      var cells = Math.max(1, Math.round((Number(alcance.value) || 18) / 1.5));
      var ef = efeito.value;
      if (ef !== "nenhum" && ef !== "cura" && ef !== "ataque" && ef !== "salva") ef = "nenhum";
      if ((ef === "ataque" || ef === "salva") && alvos.length) {
        alvos = alvos.filter(function(t) {
          return C.dist(actor, t) <= cells;
        });
      }
      var autoLines = null;
      if (!C.ativo() && actor.tipo === "player" && (ef === "ataque" || ef === "salva") && alvos.length) {
        autoLines = autoCombatBegin({ player: actor, victims: alvos.filter(function(t) {
          return t !== actor;
        }), first: actor, reason: "⚔ O personagem atacou com " + (nome.value.trim() || "uma magia") + "! O combate começou." });
      }
      var res = C.magia(actor, {
        nome: nome.value.trim() || "Magia",
        efeito: ef,
        dados: dados.value.trim(),
        tipoDano: tipo.value,
        atributo: attr.value,
        cd: dc,
        bonus: atk,
        metade: metade.value === "1",
        alcance: cells,
        alvos,
        concentracao: conc.value === "1",
        tipoAcao: acao.value
      });
      combatClose(dlg);
      if (autoLines) res.linhas = autoLines.concat(res.linhas || []);
      combatFinishAction(res);
    }, { primary: true }));
    dlg.panel.appendChild(actions);
  }

function combatSkillDialog(actor, title, skills, kind) {
    var C = getCombat();
    var dlg = combatDialog(title, "Rolagem automática com o bônus da ficha.", 420);
    if (!dlg) return;
    var sel = combatField(dlg.panel, "Perícia", combatSelect(skills.map(function(s) {
      return [s, s + " (" + RPG_SKILL_ABILITIES[s] + ")"];
    }), skills[0]));
    var cd = combatField(dlg.panel, "CD (opcional)", combatInput("number", "15"));
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    actions.appendChild(combatButton("Cancelar", function() {
      combatClose(dlg);
    }));
    actions.appendChild(combatButton("Rolar", function() {
      var skill = sel.value, value = Number(cd.value) || 0;
      combatClose(dlg);
      combatFinishAction(C.testePericia(actor, skill, RPG_SKILL_ABILITIES[skill], value, "acao", title));
    }, { primary: true }));
    dlg.panel.appendChild(actions);
  }
