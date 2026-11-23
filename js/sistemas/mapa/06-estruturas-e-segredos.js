function numberPrompt(label, fallback, min, max) {
    var raw = appPromptMessage("msg013", label, String(fallback));
    if (raw == null) return null;
    var n = Number(raw);
    if (!isFinite(n) || n < min || n > max) {
      appAlertMessage("msg014", "Informe um valor entre " + min + " e " + max + ".");
      return null;
    }
    return Math.round(n);
  }

function materialPrompt(defaultMaterial) {
    var choices = "Material:\n1. Madeira\n2. Pedra\n3. Ferro/aço\n4. Mithral\n5. Adamantina\n6. Pedra mágica";
    var initial = defaultMaterial === "pedra" ? "2" : defaultMaterial === "ferro" ? "3" : "1";
    var raw = appPromptMessage("msg015", choices, initial);
    if (raw == null) return null;
    return { "1": "madeira", "2": "pedra", "3": "ferro", "4": "mithral", "5": "adamantina", "6": "pedraMagica" }[String(raw).trim()] || null;
  }

function makeStructureMeta(material, kind, multiplier) {
    var base = OBJECT_MATERIALS[material] || OBJECT_MATERIALS.madeira;
    var factor = multiplier || 1;
    var hp = base.hp * factor;
    return {
      kind: kind || "structure",
      material,
      ac: base.ac,
      hp,
      maxHp: hp,
      threshold: base.threshold * (factor > 1 ? 1.5 : 1),
      detected: false,
      mechanismKnown: false,
      open: false,
      locked: false,
      lockDC: 15,
      lockComplexity: "simple",
      arcaneLock: false,
      arcaneSuppressedUntil: 0,
      dcDetection: 15,
      dcMechanism: 15,
      dcForce: 15
    };
  }

function edgeMidpoint(edge) {
    if (edge.custom) return { x: (edge.custom.x1 + edge.custom.x2) / 2, y: (edge.custom.y1 + edge.custom.y2) / 2 };
    return edge.dir === "h" ? { x: (edge.x + 0.5) * CELL, y: edge.yEdge * CELL } : { x: edge.xEdge * CELL, y: (edge.y + 0.5) * CELL };
  }

function edgeIsHidden(edge, val) {
    if (val === EDGE_FORCE_WALL) return !showSecrets;
    if (val === EDGE_ILLUSION_WALL) return false;
    if (val !== EDGE_SECRET_WALL && val !== EDGE_SECRET_DOOR_C && val !== EDGE_SECRET_DOOR_O) return false;
    var meta = getEdgeMeta(edge);
    return !showSecrets && !(meta && meta.detected);
  }

function nearbyEdgesForCell(cell, radiusCells) {
    var center = cellCenter(cell.x, cell.y), found = [];
    var limit2 = Math.pow(radiusCells * CELL, 2);
    var x0 = Math.max(0, Math.floor(cell.x - radiusCells - 1));
    var x1 = Math.min(COLS - 1, Math.ceil(cell.x + radiusCells + 1));
    var y0 = Math.max(0, Math.floor(cell.y - radiusCells - 1));
    var y1 = Math.min(ROWS - 1, Math.ceil(cell.y + radiusCells + 1));
    for (var hy = Math.max(0, y0); hy <= Math.min(ROWS, y1 + 1); hy++) {
      for (var hx = x0; hx <= x1; hx++) {
        var horizontal = { dir: "h", x: hx, yEdge: hy }, hv = getH(hx, hy);
        if (hv === EDGE_NONE) continue;
        var hm = edgeMidpoint(horizontal), hdx = hm.x - center.x, hdy = hm.y - center.y;
        if (hdx * hdx + hdy * hdy <= limit2) found.push({ edge: horizontal, val: hv });
      }
    }
    for (var vy = y0; vy <= y1; vy++) {
      for (var vx = Math.max(0, x0); vx <= Math.min(COLS, x1 + 1); vx++) {
        var vertical = { dir: "v", xEdge: vx, y: vy }, vv = getV(vx, vy);
        if (vv === EDGE_NONE) continue;
        var vm = edgeMidpoint(vertical), vdx = vm.x - center.x, vdy = vm.y - center.y;
        if (vdx * vdx + vdy * vdy <= limit2) found.push({ edge: vertical, val: vv });
      }
    }
    (state.customEdges || []).forEach(function(item) {
      var mid = { x: (item.x1 + item.x2) / 2, y: (item.y1 + item.y2) / 2 }, dx = mid.x - center.x, dy = mid.y - center.y;
      if (item.val && dx * dx + dy * dy <= limit2) found.push({ edge: { dir: "custom", custom: item }, val: item.val });
    });
    return found;
  }

function checkPassiveSecretDetection(player) {
    if (!player || player.tipo !== "player" || isHexMap()) return;
    var sheet = getCharacterSheetActionData();
    if (sheet) player.percepcaoPassiva = sheet.passivePerception;
    var passive = Number(player.percepcaoPassiva);
    if (!isFinite(passive)) passive = 10;
    var found = [];
    visibleEdgesForPlayer(player, playerVisionRadius(player)).forEach(function(item) {
      if (item.val !== EDGE_SECRET_WALL && item.val !== EDGE_SECRET_DOOR_C && item.val !== EDGE_SECRET_DOOR_O) return;
      var meta = getEdgeMeta(item.edge);
      if (!meta || meta.detected || passive < Number(meta.dcDetection || 15)) return;
      meta.detected = true;
      found.push(meta.kind === "secretDoor" ? "uma porta secreta" : "uma parede secreta");
    });
    if (found.length) {
      save();
      draw();
      appAlertMessage("msg016", "Percepção passiva " + passive + ": você percebe " + found.join(" e ") + ". Encontrar não revela como abrir; investigue o mecanismo.");
    }
  }

function performActiveSecretSearch(cell) {
    var roll = numberPrompt("Busca ativa — total de Sabedoria (Percepção):", 15, 0, 60);
    if (roll == null) return;
    var found = [];
    nearbyEdgesForCell(cell, 2).forEach(function(item) {
      if (item.val !== EDGE_SECRET_WALL && item.val !== EDGE_SECRET_DOOR_C && item.val !== EDGE_SECRET_DOOR_O) return;
      var meta = getEdgeMeta(item.edge);
      if (!meta || meta.detected || roll < Number(meta.dcDetection || 15)) return;
      meta.detected = true;
      found.push(meta.kind === "secretDoor" ? "porta secreta" : "parede secreta");
    });
    appAlertMessage("msg017", found.length ? "Sucesso! Você encontrou: " + found.join(", ") + ". Ainda é necessário descobrir o mecanismo." : "Nenhuma passagem secreta foi encontrada nesta seção de aproximadamente 3 metros.");
    save();
    draw();
  }

function investigateEdgeMechanism(edge) {
    var val = getEdgeVal(edge), meta = getEdgeMeta(edge);
    if (val === EDGE_ILLUSION_WALL) {
      var illusionRoll = numberPrompt("Teste de Inteligência (Investigação) para identificar a ilusão. Informe o total:", 15, 0, 60);
      if (illusionRoll == null) return;
      if (meta && illusionRoll >= Number(meta.dcDetection || 15)) {
        meta.detected = true;
        appAlertMessage("msg018", "Você identifica a ilusão. Ela não bloqueia passagem.");
      } else appAlertMessage("msg087", "Você não conseguiu identificar a ilusão.");
      save();
      draw();
      return;
    }
    if (val !== EDGE_SECRET_WALL && val !== EDGE_SECRET_DOOR_C && val !== EDGE_SECRET_DOOR_O) {
      appAlertMessage("msg019", "Não há um mecanismo secreto nesta linha.");
      return;
    }
    if (!meta || !meta.detected) {
      appAlertMessage("msg020", "Primeiro encontre a passagem com Percepção.");
      return;
    }
    if (meta.mechanismKnown) {
      appAlertMessage("msg021", "O mecanismo desta passagem já foi descoberto.");
      return;
    }
    var roll = numberPrompt("Teste de Inteligência (Investigação) para descobrir o mecanismo. Informe o total:", 15, 0, 60);
    if (roll == null) return;
    if (roll >= Number(meta.dcMechanism || 15)) {
      meta.mechanismKnown = true;
      var hint = meta.mechanismHint ? "\nComo acionar: " + meta.mechanismHint : "";
      appAlertMessage("msg022", "Mecanismo descoberto! Agora você pode acionar a passagem." + hint);
    } else appAlertMessage("msg088", "Você encontrou a passagem, mas ainda não descobriu como abri-la.");
    save();
    draw();
  }

function createSpecialEdge(edge, kind) {
    if (!edge) return;
    var existing = getEdgeVal(edge);
    if (existing !== EDGE_NONE && !appConfirmMessage("msg023", "Já existe uma parede ou porta nesta linha. Substituir?")) return;
    var isDoor = kind === "secretDoor" || kind === "lockedDoor" || kind === "jammedDoor";
    var material = kind === "forceWall" ? "force" : kind === "illusionWall" ? "illusion" : kind === "magicWall" ? "pedraMagica" : materialPrompt(isDoor ? "madeira" : "pedra");
    if (!material) return;
    var meta = makeStructureMeta(OBJECT_MATERIALS[material] ? material : "madeira", kind, kind === "secretWall" || kind === "magicWall" ? 2 : 1);
    var type = EDGE_SECRET_WALL;
    if (kind === "secretWall" || kind === "secretDoor") {
      meta.dcDetection = numberPrompt("CD para encontrar (10 fácil, 15 padrão, 20 muito bem escondida):", 15, 1, 40);
      if (meta.dcDetection == null) return;
      meta.dcMechanism = numberPrompt("CD de Inteligência (Investigação) para descobrir o mecanismo:", 15, 1, 40);
      if (meta.dcMechanism == null) return;
      meta.mechanismHint = String(appPromptMessage("msg024", "Descreva como o mecanismo é acionado (ex.: girar uma tocha, puxar um livro, apertar uma pedra):", "Um detalhe do ambiente esconde o mecanismo.") || "").trim();
      meta.detected = false;
      meta.mechanismKnown = false;
      type = kind === "secretWall" ? EDGE_SECRET_WALL : EDGE_SECRET_DOOR_C;
    } else if (kind === "lockedDoor") {
      meta.lockDC = numberPrompt("CD das Ferramentas de Ladrão (10–25 é o intervalo comum):", 15, 1, 50);
      if (meta.lockDC == null) return;
      meta.dcForce = numberPrompt("CD de Força (Atletismo) para arrombar fisicamente a porta:", 18, 1, 50);
      if (meta.dcForce == null) return;
      var complexity = appPromptMessage("msg025", "Complexidade: 1 = simples (1 ação); 2 = complexa (1 minuto).", "1");
      if (complexity == null) return;
      meta.lockComplexity = String(complexity).trim() === "2" ? "complex" : "simple";
      meta.keyName = String(appPromptMessage("msg026", "Nome da chave que abre esta porta (deixe em branco se não houver chave específica):", "") || "").trim();
      meta.arcaneLock = appConfirmMessage("msg027", "Esta fechadura possui Tranca Arcana? (Cancelar = não)");
      meta.locked = true;
      type = EDGE_LOCKED_DOOR;
    } else if (kind === "jammedDoor") {
      var jamMode = appPromptMessage("msg028", "Tipo de bloqueio: 1 = emperrada (Força/Atletismo); 2 = barrada por dentro (ação Utilizar do lado da barra).", "1");
      if (jamMode == null) return;
      meta.barred = String(jamMode).trim() === "2";
      meta.dcForce = numberPrompt(meta.barred ? "CD de Força (Atletismo) para arrombar a porta do lado oposto à barra:" : "CD de Força (Atletismo) para forçar a porta emperrada:", 15, 1, 50);
      if (meta.dcForce == null) return;
      meta.locked = true;
      type = EDGE_JAMMED_DOOR;
    } else if (kind === "illusionWall") {
      meta.dcDetection = numberPrompt("CD de Inteligência (Investigação) para identificar a ilusão:", 15, 1, 40);
      if (meta.dcDetection == null) return;
      meta.material = "illusion";
      meta.detected = false;
      type = EDGE_ILLUSION_WALL;
      meta.ac = null;
      meta.hp = null;
      meta.maxHp = null;
      meta.threshold = 0;
    } else if (kind === "forceWall") {
      meta.material = "force";
      meta.ac = null;
      meta.hp = null;
      meta.maxHp = null;
      meta.threshold = 999999;
      meta.detected = false;
      type = EDGE_FORCE_WALL;
    } else if (kind === "magicWall") {
      var thickness = numberPrompt("Espessura da parede mágica em polegadas (PV = 30 por polegada):", 1, 1, 36);
      if (thickness == null) return;
      meta.material = "pedraMagica";
      meta.ac = 15;
      meta.hp = 30 * thickness;
      meta.maxHp = meta.hp;
      meta.threshold = 10;
      meta.detected = true;
      type = EDGE_MAGIC_WALL;
    }
    setEdgeVal(edge, type);
    setEdgeMeta(edge, meta);
    save();
    draw();
    appAlertMessage("msg029", "Estrutura criada: " + { secretWall: "parede secreta", secretDoor: "porta secreta", lockedDoor: "porta trancada", jammedDoor: "porta emperrada", illusionWall: "parede ilusória", forceWall: "Muralha de Energia", magicWall: "parede mágica" }[kind] + ".");
  }

function structureKindFromEdge(edge) {
    var val = getEdgeVal(edge), meta = getEdgeMeta(edge) || {};
    if (val === EDGE_MURO) return "muro";
    if (val === EDGE_DOOR_C || val === EDGE_DOOR_O) return "porta";
    if (val === EDGE_SECRET_WALL) return "secretWall";
    if (val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) return "secretDoor";
    if (val === EDGE_LOCKED_DOOR) return "lockedDoor";
    if (val === EDGE_JAMMED_DOOR) return "jammedDoor";
    if (val === EDGE_ILLUSION_WALL) return "illusionWall";
    if (val === EDGE_FORCE_WALL) return "forceWall";
    if (val === EDGE_MAGIC_WALL) return "magicWall";
    return meta.kind || "muro";
  }
