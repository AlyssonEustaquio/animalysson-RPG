function combatArmorClassFor(sheet, profile) {
    if (invAtivo()) return Inventario.calcularCA(S.inventario.itens, invCtx());
    var des = sheet.abilityMods.DES, base = 10 + des;
    var armor = profile.armorId ? combatItemById(profile.armorId) : null;
    var shield = !!profile.shield;
    if (armor && armor.tipo !== "Escudo") {
      var text = String(armor.classeArmadura || "");
      var m = text.match(/(\d+)/);
      if (m) {
        var value = Number(m[1]);
        if (/DES/.test(text)) {
          var cap = text.match(/m[áa]x\.\s*\+?(\d+)/i);
          value += cap ? Math.min(des, Number(cap[1])) : des;
        }
        base = value;
      }
    } else if (sheet.className === "Bárbaro") base = 10 + des + sheet.abilityMods.CON;
    else if (sheet.className === "Monge" && !shield) base = 10 + des + sheet.abilityMods.SAB;
    return base + (shield ? 2 : 0);
  }

function combatPcStats(token) {
    var sheet = getCharacterSheetActionData();
    if (!sheet || !token || token.tipo !== "player") return null;
    var profile = playerActionProfile(token);
    var saves = {};
    ["FOR", "DES", "CON", "INT", "SAB", "CAR"].forEach(function(attr) {
      saves[attr] = sheet.abilityMods[attr] + (sheet.saveProficiencies.indexOf(attr) >= 0 ? sheet.proficiencyBonus : 0);
    });
    var masteryDefault = ["Bárbaro", "Guerreiro", "Paladino", "Guardião", "Ladino"].indexOf(sheet.className) >= 0;
    return {
      atrib: sheet.scores,
      prof: sheet.proficiencyBonus,
      salvas: saves,
      ca: combatArmorClassFor(sheet, profile),
      pvMax: sheet.hp,
      veloc: sheet.speedCells,
      classe: sheet.className,
      maestria: profile.maestria == null ? masteryDefault : !!profile.maestria,
      nivel: 1,
      ataquesPorAcao: Math.max(1, Math.min(4, Number(profile.ataquesPorAcao) || 1)),
      pericias: sheet.skillBonuses,
      dadoVida: sheet.hitDie
    };
  }

function combatWeaponAttack(token, weapon, mode, opts) {
    opts = opts || {};
    var sheet = getCharacterSheetActionData(), profile = playerActionProfile(token);
    var range = playerWeaponRange(weapon, mode);
    var props = normalizeRpgText(weapon.propriedades || "");
    var finesse = props.indexOf("acuidade") >= 0;
    var ability = range.ranged ? "DES" : "FOR";
    if (finesse && sheet) ability = sheet.abilityMods.DES > sheet.abilityMods.FOR ? "DES" : "FOR";
    var abilityMod = sheet ? sheet.abilityMods[ability] : 0;
    var bonus = sheet ? abilityMod + invWeaponProf(weapon, sheet) + invWeaponMagic(weapon) : Number(profile.attack) || 0;
    var dice = playerWeaponDamageDice(weapon) || "1d4";
    if (opts.duasMaos) {
      var versatile = String(weapon.propriedades || "").match(/Vers[áa]til\s*\((\d*d\d+)\)/i);
      if (versatile) dice = versatile[1];
    }
    var damageMod = (opts.semMod ? Math.min(0, abilityMod) : abilityMod) + invWeaponMagic(weapon);
    var damage = dice + (damageMod > 0 ? "+" + damageMod : damageMod < 0 ? String(damageMod) : "");
    if (profile.damageOverride && !opts.semMod && profile.weaponId === weapon.id) damage = profile.damageOverride;
    var type = RPGCombate.util.canonicoDano(weapon.dano) || "contundente";
    var thrown = mode === "thrown" && range.thrown;
    var normal = range.normal, max = range.max;
    if (profile.weaponId === weapon.id && Number(profile.attackRange) > 0) normal = max = Number(profile.attackRange);
    return {
      nome: weapon.n,
      bonus,
      distancia: !!(range.ranged || thrown),
      alcanceNormal: normal,
      alcanceMax: max,
      dano: [{ dados: damage, tipo: type }],
      arma: true,
      leve: /\bleve\b/.test(props),
      acuidade: finesse,
      pesada: props.indexOf("pesada") >= 0,
      maestria: weapon.maestria || "",
      atributoMod: ability,
      modAtributo: abilityMod,
      magico: false,
      melee: !range.ranged
    };
  }

function combatUnarmedAttack(token) {
    var sheet = getCharacterSheetActionData();
    var monk = sheet && sheet.className === "Monge";
    var ability = monk && sheet.abilityMods.DES > sheet.abilityMods.FOR ? "DES" : "FOR";
    var mod = sheet ? sheet.abilityMods[ability] : 0;
    var bonus = sheet ? mod + sheet.proficiencyBonus : 0;
    var damage = monk ? "1d6" + (mod > 0 ? "+" + mod : mod < 0 ? String(mod) : "") : String(Math.max(1, 1 + mod));
    return { nome: "Golpe desarmado", bonus, distancia: false, alcanceNormal: 1, alcanceMax: 1, dano: [{ dados: damage, tipo: "contundente" }], arma: true, leve: false, acuidade: monk, pesada: false, maestria: "", atributoMod: ability, modAtributo: mod, magico: false, melee: true, desarmado: true };
  }

function combatDefaultAttack(token) {
    var profile = playerActionProfile(token);
    var weapon = playerCurrentWeapon(profile);
    if (weapon) return combatWeaponAttack(token, weapon, profile.weaponMode === "thrown" ? "thrown" : "melee", {});
    return combatUnarmedAttack(token);
  }

function combatMtsTxt(cells) {
    return (Math.round(cells * 15) / 10).toString().replace(".", ",");
  }

function combatToggleMount(actor, preferredId) {
    var C = getCombat();
    if (!C || !invAtivo()) return;
    actor = actor && actor.tipo === "player" ? actor : currentPlayer();
    if (!actor || actor.tipo !== "player") {
      combatToast("Não há personagem jogador vinculado ao inventário.");
      return;
    }
    var live = C.ativo();
    var montarias = S.inventario.itens.filter(function(i) {
      return i.tipo === "montaria";
    });
    var atual = montarias.find(function(m) {
      return m.montado;
    });
    var escolhido = preferredId ? montarias.find(function(m) {
      return m.id === preferredId;
    }) : null;
    var custo = Math.max(1, Math.floor(invOwnSpeedCells() / 2));
    if (!montarias.length) return;
    if (live && C.atual() !== actor) {
      combatToast("A montaria só pode ser montada ou desmontada no turno do personagem.");
      return;
    }
    var alvoParaMontar = escolhido || (!atual && montarias.length === 1 ? montarias[0] : null);
    if (live && alvoParaMontar && !alvoParaMontar.montado && alvoParaMontar.controle === "independente") {
      combatShowLog("Montaria", ["O modo Independente ainda não possui iniciativa própria integrada ao motor de combate. Durante o combate, selecione o modo Controlada para usar as ações de montaria no turno do personagem."]);
      return;
    }
    if (atual && escolhido && atual.id !== escolhido.id) {
      combatShowLog("Montaria", ["Desmonte da montaria atual antes de montar outra. Cada mudança custa metade do deslocamento e só pode ocorrer uma vez por turno."]);
      return;
    }
    function aplicar(alvo) {
      if (live) {
        if (!actor.eco) C.preparar(actor);
        if (actor.eco.montou) {
          combatShowLog("Montaria", ["Você já montou ou desmontou neste turno."]);
          return;
        }
        if (C.movimentoRestante(actor) < custo) {
          combatShowLog("Montaria", ["Movimento insuficiente: montar ou desmontar custa metade do seu deslocamento (" + combatMtsTxt(custo) + " m)."]);
          return;
        }
      }
      var r = Inventario.alternarMontaria(S, alvo.id, invCtx(), invOpts());
      if (!r.ok) {
        combatShowLog("Montaria", [r.erro]);
        return;
      }
      var linhas = [actor.nome + (r.montado ? " monta em " : " desmonta de ") + r.nome + (live ? ". Custo: " + combatMtsTxt(custo) + " m de movimento." : ".")];
      if (r.montado && r.deslocamento) linhas.push("Montado, o deslocamento passa a ser " + String(r.deslocamento).replace(".", ",") + " m.");
      if (r.montado) linhas.push("Montaria controlada: age na sua iniciativa e só pode usar Disparada, Desengajar ou Esquivar.");
      if (live) {
        actor.eco.mov += custo;
        actor.eco.montou = true;
        actor.eco.montariaAgiu = false;
        C.registrar(linhas);
      }
      combatShowLog("Montaria", linhas);
      combatRefreshUi();
    }
    if (atual) {
      aplicar(atual);
      return;
    }
    if (escolhido) {
      aplicar(escolhido);
      return;
    }
    if (montarias.length === 1) {
      aplicar(montarias[0]);
      return;
    }
    var dlg = combatDialog("Montar", "Escolha a montaria controlada. Montar custa metade do deslocamento.", 420);
    if (!dlg) return;
    var opcoesMontaria = montarias.filter(function(m) {
      return m.controle !== "independente";
    });
    if (!opcoesMontaria.length) {
      combatClose(dlg);
      combatShowLog("Montaria", ["Todas as montarias estão no modo Independente, que ainda não possui turno autônomo integrado. Altere o controle fora do combate."]);
      return;
    }
    var sel = combatField(dlg.panel, "Montaria", combatSelect(opcoesMontaria.map(function(m) {
      return [m.id, m.nome];
    }), opcoesMontaria[0].id));
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    actions.appendChild(combatButton("Cancelar", function() {
      combatClose(dlg);
    }));
    actions.appendChild(combatButton("Montar", function() {
      var alvo = opcoesMontaria.find(function(m) {
        return m.id === sel.value;
      });
      combatClose(dlg);
      if (alvo) aplicar(alvo);
    }, { primary: true }));
    dlg.panel.appendChild(actions);
  }

function combatMountAction(actor, tipo) {
    var C = getCombat();
    if (!C || !invAtivo() || !C.ativo()) return;
    if (!actor || actor.tipo !== "player" || C.atual() !== actor) {
      combatToast("A montaria só pode agir durante o turno do personagem que a está conduzindo.");
      return;
    }
    var m = S.inventario.itens.find(function(i) {
      return i.tipo === "montaria" && i.montado;
    });
    if (!m || m.controle === "independente") return;
    if (!actor.eco) C.preparar(actor);
    if (actor.eco.montariaAgiu) {
      combatShowLog("Montaria", ["A montaria já agiu neste turno."]);
      return;
    }
    var linha;
    if (tipo === "disparada") {
      var extra = Math.max(0, C._interno.veloc(actor));
      actor.eco.movExtra += extra;
      linha = actor.nome + " e " + m.nome + " usam Disparada: " + combatMtsTxt(extra) + " m adicionais de movimento neste turno.";
    } else if (tipo === "desengajar") {
      actor.eco.desengajou = true;
      linha = m.nome + " usa Desengajar: o movimento não provoca ataques de oportunidade neste turno.";
    } else {
      actor.eco.esquiva = true;
      linha = m.nome + " usa Esquivar: ataques contra o conjunto têm desvantagem até o início do próximo turno.";
    }
    actor.eco.montariaAgiu = true;
    C.registrar([linha]);
    combatShowLog("Montaria", [linha]);
    combatRefreshUi();
  }

function combatTokenCenter(t) {
    var sq = Math.max(1, t.raio || 1);
    return { x: Math.round(t.x + (sq - 1) / 2), y: Math.round(t.y + (sq - 1) / 2) };
  }

function combatLineOfSight(a, b) {
    if (isHexMap()) return true;
    var ca = combatTokenCenter(a), cb = combatTokenCenter(b);
    return hasLOS(ca.x, ca.y, cb.x, cb.y);
  }

function combatOccupied(x, y, sq, ignore) {
    return state.tokens.some(function(o) {
      if (o === ignore || o.morto) return false;
      var os = Math.max(1, o.raio || 1);
      return x < o.x + os && x + sq > o.x && y < o.y + os && y + sq > o.y;
    });
  }

function combatPath(token, target, reach, maxSteps) {
    var C = getCombat(), sq = Math.max(1, token.raio || 1);
    function key(x, y) {
      return x + "," + y;
    }
    var start = { x: token.x, y: token.y }, seen = {}, prev = {}, queue = [start], head = 0, best = null, bestScore = Infinity;
    seen[key(start.x, start.y)] = 0;
    var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    function goal(x, y) {
      var ghost = { x, y, raio: sq };
      return C.dist(ghost, target) <= reach && combatLineOfSight(ghost, target);
    }
    var goalCell = null;
    while (head < queue.length && queue.length < 3e4) {
      var cur = queue[head++], depth = seen[key(cur.x, cur.y)];
      if (depth > 0 && goal(cur.x, cur.y)) {
        goalCell = cur;
        break;
      }
      var score2 = C.dist({ x: cur.x, y: cur.y, raio: sq }, target) * 1e3 + depth;
      if (score2 < bestScore) {
        bestScore = score2;
        best = cur;
      }
      if (depth >= (maxSteps || 200)) continue;
      for (var i = 0; i < dirs.length; i++) {
        var nx = cur.x + dirs[i][0], ny = cur.y + dirs[i][1], k = key(nx, ny);
        if (seen[k] != null) continue;
        if (!canStep(cur.x, cur.y, nx, ny, token, false)) continue;
        if (combatOccupied(nx, ny, sq, token)) continue;
        seen[k] = depth + 1;
        prev[k] = cur;
        queue.push({ x: nx, y: ny });
      }
    }
    var end = goalCell || best;
    if (!end || end.x === start.x && end.y === start.y) return [];
    var path = [], node = end;
    while (node && !(node.x === start.x && node.y === start.y)) {
      path.unshift({ x: node.x, y: node.y });
      node = prev[key(node.x, node.y)];
    }
    return path;
  }

function combatPush(target, from, cells) {
    var sq = Math.max(1, target.raio || 1), moved = 0;
    var dx = Math.sign(target.x - from.x), dy = Math.sign(target.y - from.y);
    if (!dx && !dy) return 0;
    for (var i = 0; i < cells; i++) {
      var nx = target.x + dx, ny = target.y + dy;
      if (!canStep(target.x, target.y, nx, ny, target, false) || combatOccupied(nx, ny, sq, target)) break;
      target.x = nx;
      target.y = ny;
      moved++;
    }
    return moved;
  }

function getCombat() {
    if (combatEngine) return combatEngine;
    if (!window.RPGCombate) return null;
    combatEngine = window.RPGCombate.criar({
      estado: combatState,
      tokens: function() {
        return state.tokens;
      },
      monstros: function() {
        return window.MONSTERS || [];
      },
      pcStats: combatPcStats,
      pcAtaquePadrao: combatDefaultAttack,
      linhaVisao: combatLineOfSight,
      mover: function(t, x, y) {
        t.x = x;
        t.y = y;
      },
      caminho: combatPath,
      empurrar: combatPush,
      armaduraDesvantagem: function(t) {
        if (t.tipo === "player" && invAtivo()) {
          return S.inventario.itens.some(function(i) {
            return i.tipo === "armadura" && i.equipado === "corpo" && !i.local && i.furtividade;
          });
        }
        var profile = t.tipo === "player" ? playerActionProfile(t) : null;
        var armor = profile && profile.armorId ? combatItemById(profile.armorId) : null;
        return !!(armor && armor.furtividade === "Desvantagem");
      }
    });
    return combatEngine;
  }

function combatAvailable() {
    return !!getCombat() && !isHexMap();
  }

function combatActive() {
    return combatAvailable() && !!combatState().ativo;
  }

function combatActor() {
    var C = getCombat();
    if (!C) return null;
    if (appMode === "editor") return C.ativo() ? C.atual() : selected && selected.tipo !== void 0 ? selected : null;
    return currentPlayer();
  }

function combatDialog(title, description, width) {
    var dlg = createPortalDialog(title, description || "");
    if (!dlg) return null;
    dlg.panel.style.width = "min(" + (width || 480) + "px,100%)";
    dlg.panel.style.maxHeight = "88%";
    dlg.panel.style.overflow = "auto";
    return dlg;
  }

function combatButton(label, onclick, options) {
    options = options || {};
    var b = document.createElement("button");
    b.type = "button";
    b.className = "mp-cb-btn" + (options.primary ? " primary" : "");
    b.textContent = label;
    if (options.title) b.title = options.title;
    if (options.disabled) {
      b.disabled = true;
      b.classList.add("off");
    } else b.onclick = onclick;
    return b;
  }

function combatClose(dlg) {
    if (dlg) closePortalDialog(dlg.overlay);
  }

function combatRefreshUi() {
    combatHudSig = "";
    renderCombatHud();
    updateCombatPanelUi();
    save();
    draw();
  }

function updateCombatPanelUi() {
    if (!R) return;
    var panel = R.querySelector("#mp-combat-panel");
    if (!panel) return;
    var C = getCombat();
    var active = !!(C && !isHexMap() && combatState().ativo);
    var start = panel.querySelector('[data-cb="start"]');
    var stop = panel.querySelector('[data-cb="stop"]');
    var status = panel.querySelector("#mp-cb-panel-status");
    if (start) {
      start.hidden = active;
      start.disabled = !C || isHexMap();
    }
    if (stop) stop.hidden = !active;
    if (status) {
      if (!C || isHexMap()) status.textContent = "O combate está disponível em mapas de masmorra com grade quadrada.";
      else if (active) {
        var current = C.atual();
        status.textContent = "Rodada " + combatState().rodada + " · turno de " + (current ? current.nome : "—") + ". Ações e fim do turno ficam na barra do mapa.";
      } else status.textContent = "Nenhum combate ativo. Posicione os participantes e inicie quando estiver pronto.";
    }
  }
