function edgeActionLabel(val, meta) {
    if (val === EDGE_SECRET_WALL || val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) return meta && meta.kind === "secretDoor" ? "porta secreta" : "parede secreta";
    if (val === EDGE_LOCKED_DOOR) return "porta trancada";
    if (val === EDGE_JAMMED_DOOR) return "porta emperrada/barrada";
    if (val === EDGE_ILLUSION_WALL) return "parede ilusória";
    if (val === EDGE_FORCE_WALL) return "Muralha de Energia";
    if (val === EDGE_MAGIC_WALL) return "parede mágica";
    if (val === EDGE_MURO) return "muro";
    return "porta";
  }
function openDoorEdge(edge, open) {
    var val = getEdgeVal(edge), meta = getEdgeMeta(edge);
    if (val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) {
      setEdgeVal(edge, open ? EDGE_SECRET_DOOR_O : EDGE_SECRET_DOOR_C);
      setEdgeMeta(edge, meta);
    } else if (val === EDGE_LOCKED_DOOR || val === EDGE_JAMMED_DOOR) {
      if (meta) meta.open = !!open;
    } else setEdgeVal(edge, open ? EDGE_DOOR_O : EDGE_DOOR_C);
    save();
    draw();
  }
function interactWithEdge(edge) {
    var val = getEdgeVal(edge), meta = getEdgeMeta(edge);
    if (val === EDGE_SECRET_WALL || val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) {
      if (!meta || !meta.detected) {
        appAlertMessage("msg030", "Você não percebe nada incomum nesta parte da parede.");
        return;
      }
      if (!meta.mechanismKnown) {
        appAlertMessage("msg031", "Você encontrou a passagem, mas ainda não descobriu como acioná-la. Use Investigar mecanismo.");
        return;
      }
      if (val === EDGE_SECRET_WALL) {
        meta.open = !meta.open;
        appAlertMessage("msg032", meta.open ? "O mecanismo foi acionado e a passagem secreta se abriu." : "A passagem secreta foi fechada.");
        save();
        draw();
        return;
      }
      openDoorEdge(edge, val !== EDGE_SECRET_DOOR_O);
      return;
    }
    if (val === EDGE_LOCKED_DOOR) {
      if (!meta) {
        meta = makeStructureMeta("madeira", "lockedDoor", 1);
        meta.locked = true;
        setEdgeMeta(edge, meta);
      }
      if (meta.open) {
        meta.open = false;
        save();
        draw();
        appAlertMessage("msg033", "A porta foi fechada.");
        return;
      }
      var now = Date.now();
      var arcaneConfigured = !!meta.arcaneLock;
      var arcaneSuppressed = arcaneConfigured && now < Number(meta.arcaneSuppressedUntil || 0);
      if (!meta.locked && !arcaneSuppressed) {
        meta.open = true;
      } else if (arcaneSuppressed) {
        meta.open = true;
        appAlertMessage("msg034", "A Tranca Arcana está suprimida; a porta pode ser aberta durante os 10 minutos restantes.");
      } else {
        var approach = appPromptMessage(
          "msg035",
          "Como deseja abrir a porta trancada?\n1 = Ferramentas de Ladrão (Destreza/Prestidigitação) — " + (meta.lockComplexity === "complex" ? "1 minuto" : "1 ação") + "\n2 = Forçar fisicamente (Força/Atletismo)" + (meta.keyName ? "\nCHAVE = usar a chave (" + meta.keyName + ")" : "") + "\nDigite ARROMBAR para usar a magia Knock/Arrombar.",
          "1"
        );
        if (approach == null) return;
        var command = String(approach).trim().toLowerCase();
        if (command === "arrombar" || command === "knock") {
          meta.open = true;
          if (arcaneConfigured) {
            meta.arcaneSuppressedUntil = now + 10 * 60 * 1e3;
            appAlertMessage("msg036", "Arrombar abriu a porta. A Tranca Arcana fica suprimida por 10 minutos.");
          } else {
            meta.locked = false;
            appAlertMessage("msg037", "Arrombar abriu instantaneamente a fechadura mundana.");
          }
        } else if (command === "chave" && meta.keyName) {
          var usedKey = String(appPromptMessage("msg038", "Digite o nome da chave utilizada:", "") || "").trim().toLocaleLowerCase();
          if (usedKey && usedKey === meta.keyName.toLocaleLowerCase()) {
            if (arcaneConfigured && !arcaneSuppressed) {
              appAlertMessage("msg039", "A chave física não supera a Tranca Arcana. Use um teste com CD +10 ou a magia Arrombar.");
            } else {
              meta.locked = false;
              meta.open = true;
              appAlertMessage("msg040", "A chave correta destranca e abre a porta.");
            }
          } else {
            appAlertMessage("msg041", "Esta chave não corresponde à fechadura.");
          }
        } else {
          var checkIsForce = command === "2";
          var baseDC = checkIsForce ? Number(meta.dcForce || 18) : Number(meta.lockDC || 15);
          var dc = baseDC + (arcaneConfigured ? 10 : 0);
          var testName = checkIsForce ? "Força (Atletismo)" : "Destreza (Prestidigitação) com Ferramentas de Ladrão";
          var roll = numberPrompt(testName + " — CD " + dc + ". Informe o total:", dc, 0, 60);
          if (roll == null) return;
          if (roll >= dc) {
            meta.open = true;
            if (!arcaneConfigured) meta.locked = false;
            appAlertMessage("msg042", checkIsForce ? "Sucesso! Você força a porta e consegue abri-la." : "Sucesso! Você vence a fechadura e abre a porta.");
          } else {
            appAlertMessage("msg043", "Falha. A porta continua trancada.");
          }
        }
      }
      save();
      draw();
      return;
    }
    if (val === EDGE_JAMMED_DOOR) {
      if (!meta) {
        meta = makeStructureMeta("madeira", "jammedDoor", 1);
        setEdgeMeta(edge, meta);
      }
      if (meta.open) {
        meta.open = false;
        save();
        draw();
        appAlertMessage("msg044", "A porta foi fechada.");
        return;
      }
      if (meta.barred && appConfirmMessage("msg045", "O personagem está do lado em que consegue alcançar e levantar a barra? (OK = ação Utilizar)")) {
        meta.open = true;
        save();
        draw();
        appAlertMessage("msg046", "Você levanta a barra com uma ação Utilizar e abre a porta.");
        return;
      }
      var forceRoll = numberPrompt("Força (Atletismo) para forçar a porta — CD " + Number(meta.dcForce || 15) + ". Informe o total:", 15, 0, 60);
      if (forceRoll == null) return;
      if (forceRoll >= Number(meta.dcForce || 15)) {
        meta.open = true;
        appAlertMessage("msg047", "Você força a porta e consegue abri-la.");
      } else appAlertMessage("msg089", "A porta não cede.");
      save();
      draw();
      return;
    }
    if (val === EDGE_DOOR_C || val === EDGE_DOOR_O) {
      openDoorEdge(edge, val === EDGE_DOOR_C);
      return;
    }
    if (val === EDGE_FORCE_WALL) {
      appAlertMessage("msg048", "Muralha de Energia: invisível, imune a dano comum e bloqueia a passagem. Só Desintegrar a destrói; teletransporte pode atravessá-la.");
      return;
    }
    if (val === EDGE_ILLUSION_WALL) {
      if (meta) meta.detected = true;
      save();
      draw();
      appAlertMessage("msg049", "Você percebe a ilusão: ela não bloqueia a passagem.");
      return;
    }
    if (val === EDGE_MAGIC_WALL || val === EDGE_SECRET_WALL || val === EDGE_MURO) appAlertMessage("msg050", edgeActionLabel(val, meta) + ". Use Atacar estrutura para tentar destruí-la.");
  }
function ensureEdgeStructureMeta(edge) {
    var meta = getEdgeMeta(edge), val = getEdgeVal(edge);
    if (meta) return meta;
    var isWall = val === EDGE_MURO || val === EDGE_SECRET_WALL || val === EDGE_MAGIC_WALL;
    var material = isWall || val === EDGE_FORCE_WALL ? "pedra" : "madeira";
    var kind = val === EDGE_MURO ? "wallLine" : val === EDGE_SECRET_WALL ? "secretWall" : val === EDGE_MAGIC_WALL ? "magicWall" : val === EDGE_FORCE_WALL ? "forceWall" : val === EDGE_LOCKED_DOOR ? "lockedDoor" : val === EDGE_JAMMED_DOOR ? "jammedDoor" : val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O ? "secretDoor" : "door";
    meta = makeStructureMeta(material, kind, isWall ? 2 : 1);
    if (val === EDGE_FORCE_WALL) {
      meta.material = "force";
      meta.ac = null;
      meta.hp = null;
      meta.maxHp = null;
    }
    setEdgeMeta(edge, meta);
    return meta;
  }
function damageObject(meta, label, destroy) {
    if (!meta) return;
    if (meta.material === "force") {
      var command = appPromptMessage("msg051", "Muralha de Energia só pode ser destruída por Desintegrar. Digite DESINTEGRAR para aplicar a magia:", "");
      if (String(command || "").trim().toLowerCase() === "desintegrar") {
        destroy();
        appAlertMessage("msg052", label + " foi dissipada.");
      } else appAlertMessage("msg090", "Nenhum dano foi causado.");
      return;
    }
    if (meta.material === "illusion") {
      appAlertMessage("msg053", "A barreira é ilusória; não há estrutura física para destruir.");
      return;
    }
    var stats = OBJECT_MATERIALS[meta.material] || OBJECT_MATERIALS.pedra;
    var ac = Number(meta.ac || stats.ac);
    var attack = numberPrompt("Ataque contra " + label + " — CA " + ac + ". Informe o total da jogada:", ac, 0, 60);
    if (attack == null) return;
    if (attack < ac) {
      appAlertMessage("msg054", "Ataque não atingiu a CA " + ac + ".");
      return;
    }
    var damage = numberPrompt("Dano causado em um único golpe (PV restantes: " + Number(meta.hp || 0) + "):", 8, 0, 500);
    if (damage == null) return;
    var damageType = appPromptMessage("msg055", "Tipo de dano (cortante, contundente, perfurante, fogo, ácido, elétrico, psíquico, venenoso etc.):", "contundente");
    if (damageType == null) return;
    damageType = String(damageType).toLowerCase();
    if ((stats.immune || []).some(function(t) {
      return damageType.indexOf(t) >= 0;
    })) {
      appAlertMessage("msg056", "Este material é imune a dano " + damageType + ".");
      return;
    }
    if (meta.material === "ferro" && damageType.indexOf("perfurante") >= 0 && !appConfirmMessage("msg057", "Ferro/aço resiste a perfuração comum. Este ataque é mágico? (Cancelar = não)")) {
      appAlertMessage("msg058", "A estrutura é imune a perfuração não mágica.");
      return;
    }
    if (stats.needsMagic && !appConfirmMessage("msg059", "O ataque é mágico? (Cancelar = não)")) {
      appAlertMessage("msg060", "Este material não sofre dano de armas não mágicas.");
      return;
    }
    var applied = damage;
    if (stats.vulnerableFire && damageType.indexOf("fogo") >= 0) applied *= 2;
    var isStoneWall = (meta.material === "pedra" || meta.material === "pedraMagica") && /wall/i.test(meta.kind || "");
    if (isStoneWall && appConfirmMessage("msg061", "O personagem é proficiente com Ferramentas de Pedreiro?")) applied *= 2;
    var threshold = Number(meta.threshold || 0);
    if (applied < threshold) {
      appAlertMessage("msg062", "O golpe não alcançou o limiar de dano " + threshold + ". Nenhum PV foi removido.");
      return;
    }
    meta.hp = Math.max(0, Number(meta.hp || 0) - applied);
    if (meta.hp <= 0) {
      destroy();
      appAlertMessage("msg063", label + " foi destruído!");
    } else appAlertMessage("msg091", label + " sofreu " + applied + " de dano. PV restantes: " + meta.hp + "/" + meta.maxHp + ".");
  }
function damageEdgeStructure(edge) {
    var val = getEdgeVal(edge);
    if (val === EDGE_NONE) {
      appAlertMessage("msg064", "Não há parede ou porta nesta linha.");
      return;
    }
    if (val === EDGE_ILLUSION_WALL) {
      appAlertMessage("msg065", "A barreira é uma ilusão e não possui PV.");
      return;
    }
    var meta = ensureEdgeStructureMeta(edge);
    damageObject(meta, edgeActionLabel(val, meta), function() {
      setEdgeVal(edge, EDGE_NONE);
    });
    save();
    draw();
  }
function damageCellWall(cell) {
    var i = idx(cell.x, cell.y);
    if (!state.walls[i]) {
      appAlertMessage("msg066", "Não há uma parede nesta quadrícula.");
      return;
    }
    if (!state.wallMeta) state.wallMeta = makeArr(COLS * ROWS, null);
    var meta = state.wallMeta[i] || makeStructureMeta("pedra", "wall", 2);
    state.wallMeta[i] = meta;
    damageObject(meta, "parede de pedra", function() {
      state.walls[i] = 0;
      state.wallMeta[i] = null;
    });
    save();
    draw();
  }
