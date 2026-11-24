function configurePlayerActionProfile(player) {
    if (!player) return;
    var profile = playerActionProfile(player);
    var sheet = getCharacterSheetActionData();
    var dlg = createPortalDialog("Configurar ações do personagem", sheet ? "Os bônus de perícias e atributos vêm diretamente da ficha aberta no site." + (invAtivo() ? " Arma, armadura, escudo e velocidade vêm do Inventário (itens equipados e montaria). Velocidade atual: " + String(invSpeedMeters().atual).replace(".", ",") + " m" + (invSpeedMeters().montado ? " (montado em " + invSpeedMeters().montaria + ")" : "") + "." : " Escolha a arma usada no Ataque; dano e alcance serão calculados pelo catálogo.") : "Preencha os bônus manuais ou conclua a ficha do personagem para sincronizar os atributos e perícias automaticamente.");
    if (!dlg) return;
    dlg.panel.style.width = "min(560px,100%)";
    dlg.panel.style.maxHeight = "88%";
    dlg.panel.style.overflow = "auto";
    var form = document.createElement("div");
    form.style.cssText = "display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:10px 0 14px;";
    var inputs = {};
    function addField(captionText, key, type, value, full) {
      var label = document.createElement("label");
      label.style.cssText = "display:flex;flex-direction:column;gap:4px;color:#d5d9e2;font-size:12px;" + (full ? "grid-column:1/-1;" : "");
      var caption = document.createElement("span");
      caption.textContent = captionText;
      label.appendChild(caption);
      var input = document.createElement("input");
      input.type = type;
      input.value = value == null ? "" : value;
      input.style.cssText = "width:100%;min-width:0;box-sizing:border-box;padding:8px;border:1px solid #555d6c;border-radius:6px;background:#252a34;color:#fff;";
      if (type === "number") {
        input.step = "1";
        input.min = key === "attackRange" ? "0" : "-20";
        input.max = key === "attackRange" ? "120" : "30";
        if (key === "ataquesPorAcao") {
          input.min = "1";
          input.max = "4";
        }
      }
      inputs[key] = input;
      label.appendChild(input);
      form.appendChild(label);
    }
    if (sheet) {
      var summary = document.createElement("div");
      summary.style.cssText = "grid-column:1/-1;padding:10px;border:1px solid rgba(100,190,230,.3);border-radius:7px;background:rgba(38,92,125,.18);font-size:12px;line-height:1.55;color:#e9f5fc;";
      summary.textContent = "Ficha sincronizada: " + sheet.name + (sheet.className ? " · " + sheet.className : "") + ". Percepção " + signed(sheet.skillBonuses["Percepção"]) + " (passiva " + sheet.passivePerception + "), Investigação " + signed(sheet.skillBonuses["Investigação"]) + ", Atletismo " + signed(sheet.skillBonuses["Atletismo"]) + ", ataque corpo a corpo " + signed(sheet.meleeAttack) + " e à distância " + signed(sheet.rangedAttack) + ".";
      form.appendChild(summary);
    } else {
      addField("Bônus de Ataque", "attack", "number", profile.attack);
      addField("Bônus de Ferramentas de Ladrão", "tools", "number", profile.tools);
      Object.keys(RPG_SKILL_ABILITIES).forEach(function(skill) {
        var legacyKey = skill === "Percepção" ? "perception" : skill === "Investigação" ? "investigation" : skill === "Atletismo" ? "athletics" : null;
        var value = legacyKey ? profile[legacyKey] : profile.skillBonuses[skill];
        addField("Bônus de " + skill + " (" + RPG_SKILL_ABILITIES[skill] + ")", "skillBonus_" + skill, "number", value);
      });
    }
    var weaponLabel = document.createElement("label");
    weaponLabel.style.cssText = "grid-column:1/-1;display:flex;flex-direction:column;gap:4px;color:#d5d9e2;font-size:12px;";
    var weaponCaption = document.createElement("span");
    weaponCaption.textContent = "Arma usada no Ataque";
    weaponLabel.appendChild(weaponCaption);
    var weaponSelect = document.createElement("select");
    weaponSelect.style.cssText = "width:100%;padding:8px;border:1px solid #555d6c;border-radius:6px;background:#252a34;color:#fff;";
    var emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Sem arma selecionada (usar configuração manual)";
    weaponSelect.appendChild(emptyOption);
    playerWeaponCatalog().forEach(function(item) {
      var option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.n + " — " + item.dano + (item.uso ? " · " + item.uso.replace("Arma de ataque ", "") : "");
      weaponSelect.appendChild(option);
    });
    weaponSelect.value = profile.weaponId || "";
    inputs.weaponId = weaponSelect;
    weaponLabel.appendChild(weaponSelect);
    form.appendChild(weaponLabel);
    var weaponModeLabel = document.createElement("label");
    weaponModeLabel.style.cssText = "grid-column:1/-1;display:flex;flex-direction:column;gap:4px;color:#d5d9e2;font-size:12px;";
    var weaponModeCaption = document.createElement("span");
    weaponModeCaption.textContent = "Armas com propriedade Arremesso";
    weaponModeLabel.appendChild(weaponModeCaption);
    var weaponModeSelect = document.createElement("select");
    weaponModeSelect.style.cssText = "width:100%;padding:8px;border:1px solid #555d6c;border-radius:6px;background:#252a34;color:#fff;";
    [{ value: "melee", label: "Usar corpo a corpo" }, { value: "thrown", label: "Arremessar (usar alcance de arremesso)" }].forEach(function(entry) {
      var option = document.createElement("option");
      option.value = entry.value;
      option.textContent = entry.label;
      weaponModeSelect.appendChild(option);
    });
    weaponModeSelect.value = profile.weaponMode || "melee";
    inputs.weaponMode = weaponModeSelect;
    weaponModeLabel.appendChild(weaponModeSelect);
    form.appendChild(weaponModeLabel);
    addField("Alcance personalizado (quadrículas; 0 = automático)", "attackRange", "number", Number(profile.attackRange) || 0);
    addField("Dano personalizado (vazio = automático)", "damageOverride", "text", profile.damageOverride || "");
    weaponSelect.addEventListener("change", function() {
      var item = playerWeaponById(weaponSelect.value);
      if (!item) return;
      var selectedProfile = Object.assign({}, profile, { weaponId: item.id, weaponMode: weaponModeSelect.value, attackRange: 0, damageOverride: "" });
      var resolved = resolvePlayerAttackData(player, selectedProfile);
      inputs.attackRange.value = "";
      inputs.damageOverride.value = "";
      var preview = dlg.panel.querySelector("#mp-weapon-preview");
      if (!preview) {
        preview = document.createElement("p");
        preview.id = "mp-weapon-preview";
        preview.style.cssText = "grid-column:1/-1;margin:0;color:#aebdcb;font-size:11px;";
        form.appendChild(preview);
      }
      preview.textContent = "Cálculo da arma: ataque " + signed(resolved.bonus) + ", dano " + resolved.damage + ", alcance normal " + resolved.normalRange + " e máximo " + resolved.maxRange + " quadrículas.";
    });
    weaponModeSelect.addEventListener("change", function() {
      weaponSelect.dispatchEvent(new Event("change"));
    });
    function addSelectField(captionText, key, options, value) {
      var label = document.createElement("label");
      label.style.cssText = "display:flex;flex-direction:column;gap:4px;color:#d5d9e2;font-size:12px;";
      var caption = document.createElement("span");
      caption.textContent = captionText;
      label.appendChild(caption);
      var select = document.createElement("select");
      select.style.cssText = "width:100%;padding:8px;border:1px solid #555d6c;border-radius:6px;background:#252a34;color:#fff;";
      options.forEach(function(o) {
        var op = document.createElement("option");
        op.value = o[0];
        op.textContent = o[1];
        select.appendChild(op);
      });
      select.value = value;
      inputs[key] = select;
      label.appendChild(select);
      form.appendChild(label);
    }
    addSelectField("Armadura", "armorId", [["", "Sem armadura"]].concat(combatArmorCatalog().filter(function(a) {
      return a.tipo !== "Escudo";
    }).map(function(a) {
      return [a.id, a.n + " (" + a.classeArmadura + ")"];
    })), profile.armorId || "");
    addSelectField("Escudo", "shield", [["0", "Não"], ["1", "Sim (+2 CA)"]], profile.shield ? "1" : "0");
    addSelectField("Maestria de arma", "maestria", [["auto", "Automático pela classe"], ["1", "Ativada"], ["0", "Desativada"]], profile.maestria == null ? "auto" : profile.maestria ? "1" : "0");
    addField("Ataques por ação Atacar", "ataquesPorAcao", "number", profile.ataquesPorAcao || 1);
    var note = document.createElement("p");
    note.style.cssText = "grid-column:1/-1;margin:0;color:#aeb5c0;font-size:11px;line-height:1.4;";
    note.textContent = "As ações usam a área iluminada/visível ao redor do personagem e respeitam paredes e linha de visão. Ataque faz uma rolagem para cada criatura visível no alcance.";
    form.appendChild(note);
    dlg.panel.appendChild(form);
    if (weaponSelect.value) weaponSelect.dispatchEvent(new Event("change"));
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    var cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancelar";
    cancel.onclick = function() {
      closePortalDialog(dlg.overlay);
    };
    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "primary";
    saveBtn.textContent = "Salvar";
    saveBtn.onclick = function() {
      profile.useSheet = true;
      if (!sheet) {
        ["attack", "tools"].forEach(function(key) {
          if (inputs[key]) profile[key] = Math.max(-20, Math.min(30, Math.round(Number(inputs[key].value) || 0)));
        });
        Object.keys(RPG_SKILL_ABILITIES).forEach(function(skill) {
          var key = "skillBonus_" + skill;
          if (!inputs[key]) return;
          var value = Math.max(-20, Math.min(30, Math.round(Number(inputs[key].value) || 0)));
          profile.skillBonuses[skill] = value;
          if (skill === "Percepção") profile.perception = value;
          else if (skill === "Investigação") profile.investigation = value;
          else if (skill === "Atletismo") profile.athletics = value;
        });
      }
      profile.weaponId = String(inputs.weaponId.value || "");
      profile.weaponMode = String(inputs.weaponMode.value || "melee");
      profile.attackRange = Math.max(0, Math.min(120, Math.round(Number(inputs.attackRange.value) || 0)));
      profile.armorId = String(inputs.armorId.value || "");
      profile.shield = inputs.shield.value === "1";
      profile.maestria = inputs.maestria.value === "auto" ? null : inputs.maestria.value === "1";
      profile.ataquesPorAcao = Math.max(1, Math.min(4, Math.round(Number(inputs.ataquesPorAcao.value) || 1)));
      profile.damageOverride = String(inputs.damageOverride.value || "").trim();
      if (profile.damageOverride && !rollDamageExpression(profile.damageOverride, false)) {
        appAlertMessage("msg014", "Informe um dano válido, como 1d8+3 ou 2d6.");
        return;
      }
      save();
      closePortalDialog(dlg.overlay);
      draw();
    };
    actions.appendChild(cancel);
    actions.appendChild(saveBtn);
    dlg.panel.appendChild(actions);
  }

function signed(value) {
    var n = Number(value) || 0;
    return (n >= 0 ? "+" : "") + n;
  }

function runPlayerPerception(player, profile, range) {
    var check = rollCheck(profile.perception), found = [], edges = visibleEdgesForPlayer(player, range);
    edges.forEach(function(item) {
      if (item.val !== EDGE_SECRET_WALL && item.val !== EDGE_SECRET_DOOR_C && item.val !== EDGE_SECRET_DOOR_O) return;
      var meta = getEdgeMeta(item.edge);
      if (!meta || meta.detected) return;
      var dc = Number(meta.dcDetection || 15);
      if (check.total >= dc) {
        meta.detected = true;
        found.push((meta.kind === "secretDoor" || item.val === EDGE_SECRET_DOOR_C || item.val === EDGE_SECRET_DOOR_O ? "Porta secreta" : "Parede secreta") + " descoberta (CD " + dc + ").");
      }
    });
    var lines = ["Percepção: 1d20 (" + check.die + ") + " + check.bonus + " = " + check.total + "."];
    if (found.length) lines = lines.concat(found);
    else lines.push(isHexMap() ? "Nenhuma estrutura secreta deste tipo está cadastrada neste mapa." : "Nenhum segredo com CD igual ou inferior ao resultado foi encontrado na área visível.");
    save();
    draw();
    playerActionResult("👁 Percepção", lines);
  }

function runPlayerInvestigation(player, profile, range) {
    var check = rollCheck(profile.investigation), found = [], edges = visibleEdgesForPlayer(player, range);
    edges.forEach(function(item) {
      var meta = getEdgeMeta(item.edge);
      if (!meta) return;
      if (item.val === EDGE_ILLUSION_WALL && !meta.detected) {
        var illusionDc = Number(meta.dcDetection || 15);
        if (check.total >= illusionDc) {
          meta.detected = true;
          found.push("Parede ilusória identificada (CD " + illusionDc + "); ela não bloqueia a passagem.");
        }
      } else if ((item.val === EDGE_SECRET_WALL || item.val === EDGE_SECRET_DOOR_C || item.val === EDGE_SECRET_DOOR_O) && meta.detected && !meta.mechanismKnown) {
        var mechanismDc = Number(meta.dcMechanism || 15);
        if (check.total >= mechanismDc) {
          meta.mechanismKnown = true;
          found.push("Mecanismo descoberto (CD " + mechanismDc + ")." + (meta.mechanismHint ? " Como acionar: " + meta.mechanismHint : ""));
        }
      }
    });
    var lines = ["Investigação: 1d20 (" + check.die + ") + " + check.bonus + " = " + check.total + "."];
    if (found.length) lines = lines.concat(found);
    else lines.push("Nenhuma ilusão ou mecanismo detectado pôde ser identificado na área visível.");
    save();
    draw();
    playerActionResult("🔎 Investigação", lines);
  }

function runPlayerAttack(player, profile, visionRange) {
    if (!getCombat()) {
      playerActionResult("⚔ Ataque", ["O módulo de combate (combate.js) não foi carregado."]);
      return;
    }
    combatAttackFlow(player);
  }

function runPlayerDoorCheck(player, profile, range, useTools) {
    var edges = visibleEdgesForPlayer(player, Math.min(1.5, range)), relevant = edges.filter(function(item) {
      return useTools ? item.val === EDGE_LOCKED_DOOR : item.val === EDGE_LOCKED_DOOR || item.val === EDGE_JAMMED_DOOR;
    });
    var label = useTools ? "Ferramentas de Ladrão" : "Atletismo";
    var check = rollCheck(useTools ? profile.tools : profile.athletics);
    var lines = [label + ": 1d20 (" + check.die + ") + " + check.bonus + " = " + check.total + "."];
    if (!relevant.length) lines.push("Nenhuma porta compatível com esta ação está adjacente e visível.");
    relevant.forEach(function(item) {
      var meta = ensureEdgeStructureMeta(item.edge);
      var dc = useTools ? Number(meta.lockDC || 15) : Number(meta.dcForce || 18);
      if (meta.arcaneLock) dc += 10;
      if (meta.barred && !useTools) {
        lines.push("Porta barrada por dentro: é necessário alcançar a barra pelo lado correto; o teste de Atletismo não a abre automaticamente.");
        return;
      }
      if (check.die === 20 || check.die !== 1 && check.total >= dc) {
        meta.open = true;
        if (!meta.arcaneLock) meta.locked = false;
        lines.push(edgeActionLabel(item.val, meta) + ": sucesso contra CD " + dc + "; porta aberta.");
      } else lines.push(edgeActionLabel(item.val, meta) + ": falha contra CD " + dc + "; continua fechada.");
    });
    save();
    draw();
    playerActionResult(useTools ? "🗝 Ferramentas de Ladrão" : "💪 Atletismo", lines);
  }

function runPlayerSkill(player, profile) {
    var selector = R && R.querySelector("#mp-player-skill");
    var skill = selector ? selector.value : "Percepção";
    var sheet = getCharacterSheetActionData();
    var ability = RPG_SKILL_ABILITIES[skill] || "SAB";
    var bonus = sheet && sheet.skillBonuses[skill] != null ? sheet.skillBonuses[skill] : 0;
    if (!sheet) {
      if (profile.skillBonuses && profile.skillBonuses[skill] != null) bonus = Number(profile.skillBonuses[skill]) || 0;
      else if (skill === "Percepção") bonus = Number(profile.perception) || 0;
      else if (skill === "Investigação") bonus = Number(profile.investigation) || 0;
      else if (skill === "Atletismo") bonus = Number(profile.athletics) || 0;
    }
    var check = rollCheck(bonus);
    playerActionResult("🎲 " + skill, [skill + " (" + ability + "): 1d20 (" + check.die + ") " + signed(check.bonus) + " = " + check.total + "."]);
  }

function runPlayerInteract(player, range) {
    var edges = visibleEdgesForPlayer(player, Math.min(1.5, range)), changed = [], lines = [];
    edges.forEach(function(item) {
      var val = item.val, meta = getEdgeMeta(item.edge);
      if ((val === EDGE_SECRET_WALL || val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) && meta && meta.detected && meta.mechanismKnown) {
        if (val === EDGE_SECRET_WALL) {
          meta.open = !meta.open;
          changed.push(meta.open ? "Passagem secreta aberta." : "Passagem secreta fechada.");
        } else {
          var open = val !== EDGE_SECRET_DOOR_O;
          setEdgeVal(item.edge, open ? EDGE_SECRET_DOOR_O : EDGE_SECRET_DOOR_C);
          setEdgeMeta(item.edge, meta);
          changed.push(open ? "Porta secreta aberta." : "Porta secreta fechada.");
        }
      }
    });
    lines.push(changed.length ? changed.join(" ") : "Nenhum mecanismo secreto descoberto está ao alcance imediato.");
    save();
    draw();
    playerActionResult("✋ Interagir", lines);
  }

var ACTION_MS = { perception: 6000, investigation: 6000, athletics: 6000, tools: 6000, interact: 1000, skill: 6000 };

var COMBAT_COST_MS = { acao: 6000, bonus: 3000, reacao: 0 };

var actionBusy = null;

var combatSkipWait = false;

function actionLocked() {
    return !!(actionBusy && Date.now() < actionBusy.until);
  }

function weaponSwingMs(weapon, twoHands, thrown) {
    if (!weapon) return 700;
    var props = normalizeRpgText(weapon.propriedades || "");
    var lb = parseFloat(String(weapon.peso || "").replace(",", ".")) || 3;
    var ms = lb <= 2 ? 1000 : lb <= 4 ? 1500 : lb <= 8 ? 2000 : 3000;
    var ranged = /distancia/.test(normalizeRpgText(weapon.tipo || ""));
    if (/\bleve\b/.test(props)) ms -= 300;
    if (props.indexOf("acuidade") >= 0) ms -= 100;
    if (props.indexOf("pesada") >= 0) ms += 1000;
    if (props.indexOf("alcance") >= 0) ms += 500;
    if (props.indexOf("duas maos") >= 0 || twoHands) ms += 500;
    if (props.indexOf("municao") >= 0) ms += 500;
    if (props.indexOf("recarga") >= 0 || props.indexOf("carregamento") >= 0) ms += 1000;
    if (thrown) ms = Math.min(ms, 1200);
    if (ranged && ms < 1500) ms = 1500;
    return Math.max(700, Math.min(5000, ms));
  }

function spellCastMs(name, castType) {
    var spell = null;
    if (name && typeof window.findSpell === "function") {
      var key = normalizeRpgText(name).trim();
      spell = (window.SPELLS || []).find(function(sp) {
        return normalizeRpgText(sp.n) === key || normalizeRpgText(sp.en) === key;
      }) || null;
    }
    var time = spell ? normalizeRpgText(spell.tempo) : castType === "bonus" ? "1 acao bonus" : "1 acao";
    var level = spell ? Number(spell.lvl) || 0 : 1;
    if (/reacao/.test(time)) return 0;
    var minutes = time.match(/(\d+)\s*minuto/), hours = time.match(/(\d+)\s*hora/);
    if (minutes) return Math.min(60000, Number(minutes[1]) * 60000);
    if (hours) return 60000;
    var ms = level === 0 ? 2000 : 2600 + 400 * level;
    if (/bonus/.test(time)) ms = Math.round(ms * 0.6);
    return ms;
  }

function beginActionWait(ms) {
    if (!(ms > 0)) return;
    stopKeyMove();
    actionBusy = { until: Date.now() + ms };
    if (window.Dados3D) window.Dados3D.segurar(ms);
  }

function runPlayerAction(action) {
    if (action !== "menu" && action !== "combat" && ACTION_MS[action]) {
      if (actionLocked()) {
        combatToast("Aguarde: o personagem ainda está concluindo a ação.");
        return;
      }
      var ms = ACTION_MS[action];
      beginActionWait(ms);
      window.setTimeout(function() {
        actionBusy = null;
        runPlayerActionNow(action);
      }, ms);
      return;
    }
    if (action !== "menu" && actionLocked()) {
      combatToast("Aguarde: o personagem ainda está concluindo a ação.");
      return;
    }
    runPlayerActionNow(action);
  }

function runPlayerActionNow(action) {
    if (appMode !== "player") return;
    var player = currentPlayer();
    if (!player || player.tipo !== "player") {
      playerActionResult("Ações do personagem", ["Não há um personagem jogador neste mapa."]);
      return;
    }
    var profile = playerActionProfile(player), range = playerVisionRadius(player);
    if (action === "menu") openPlayerActionMenu();
    else if (action === "perception") runPlayerPerception(player, profile, range);
    else if (action === "investigation") runPlayerInvestigation(player, profile, range);
    else if (action === "attack") runPlayerAttack(player, profile, range);
    else if (action === "combat") openCombatMenu();
    else if (action === "athletics") runPlayerDoorCheck(player, profile, range, false);
    else if (action === "tools") runPlayerDoorCheck(player, profile, range, true);
    else if (action === "interact") runPlayerInteract(player, range);
    else if (action === "skill") runPlayerSkill(player, profile);
  }

function openPlayerActionMenu() {
    var player = currentPlayer();
    if (!player || player.tipo !== "player") {
      playerActionResult("Ações do personagem", ["Não há um personagem jogador neste mapa."]);
      return;
    }
    var profile = playerActionProfile(player), range = playerVisionRadius(player);
    var dlg = combatDialog("Ações do personagem", "Escolha uma ação. As opções estão agrupadas por finalidade.", 500);
    if (!dlg) return;
    function group(title) {
      var box = document.createElement("section");
      box.className = "mp-action-group";
      var heading = document.createElement("h4");
      heading.textContent = title;
      box.appendChild(heading);
      var grid = document.createElement("div");
      grid.className = "mp-cb-grid";
      box.appendChild(grid);
      dlg.panel.appendChild(box);
      return grid;
    }
    function add(grid, label, hint, fn) {
      grid.appendChild(combatButton(label, function() {
        combatClose(dlg);
        fn();
      }, { title: hint || "" }));
    }
    var combat = group("Combate");
    add(combat, "⚔ Ataque", "Escolher arma e alvo", function() {
      runPlayerAttack(player, profile, range);
    });
    if (!combatActive()) add(combat, "🛡 Ações avançadas de combate", "Magias, ações, bônus, movimento e descanso", function() {
      openCombatMenu();
    });
    var explore = group("Exploração");
    add(explore, "👁 Percepção", "Observar o ambiente e procurar detalhes visíveis", function() {
      runPlayerPerception(player, profile, range);
    });
    add(explore, "🔎 Investigação", "Examinar objetos, pistas e mecanismos próximos", function() {
      runPlayerInvestigation(player, profile, range);
    });
    var interact = group("Obstáculos e interação");
    add(interact, "💪 Atletismo", "Forçar portas e obstáculos", function() {
      runPlayerDoorCheck(player, profile, range, false);
    });
    add(interact, "🗝 Ferramentas", "Abrir fechaduras e mecanismos com ferramentas", function() {
      runPlayerDoorCheck(player, profile, range, true);
    });
    add(interact, "✋ Interagir", "Acionar mecanismos secretos já descobertos", function() {
      runPlayerInteract(player, range);
    });
    var footer = document.createElement("div");
    footer.className = "mp-portal-dialog-actions";
    footer.appendChild(combatButton("Fechar", function() {
      combatClose(dlg);
    }, { primary: true }));
    dlg.panel.appendChild(footer);
  }

var combatEngine = null, combatHudSig = "", combatToastTimer = null, combatCostPending = 1;

var COMBAT_COND_ABBR = { cego: "CG", surdo: "SD", enfeiticado: "EF", amedrontado: "AM", agarrado: "AG", incapacitado: "IN", invisivel: "IV", paralisado: "PA", petrificado: "PE", envenenado: "EN", caido: "CD", contido: "CT", atordoado: "AT", inconsciente: "IC" };

var COMBAT_DAMAGE_TYPES = [["cortante", "Cortante"], ["perfurante", "Perfurante"], ["contundente", "Contundente"], ["fogo", "Fogo"], ["gelo", "Gelo"], ["acido", "Ácido"], ["eletrico", "Elétrico"], ["trovejante", "Trovejante"], ["venenoso", "Venenoso"], ["necrotico", "Necrótico"], ["radiante", "Radiante"], ["psiquico", "Psíquico"], ["energetico", "Energético"]];

var COMBAT_SPELL_ABILITY = { "Bardo": "CAR", "Bruxo": "CAR", "Feiticeiro": "CAR", "Paladino": "CAR", "Clérigo": "SAB", "Druida": "SAB", "Guardião": "SAB", "Mago": "INT", "Artífice": "INT" };

function combatState() {
    if (!state.combate || typeof state.combate !== "object") state.combate = { ativo: false, rodada: 0, turno: 0, ordem: [], registro: [], autoIA: true };
    return state.combate;
  }

function combatItemById(id) {
    var items = window.ITEMS || window.EQUIPMENT || [];
    return Array.isArray(items) ? items.find(function(item) {
      return item && item.id === id;
    }) || null : null;
  }

function combatArmorCatalog() {
    var items = window.ITEMS || window.EQUIPMENT || [];
    return Array.isArray(items) ? items.filter(function(item) {
      return item && item.categoria === "Armaduras" && !item.magico;
    }) : [];
  }
