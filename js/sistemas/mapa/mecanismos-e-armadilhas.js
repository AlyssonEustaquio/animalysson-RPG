/* Mecanismos e armadilhas configuráveis para mapas quadrados. Inspiração em armadilhas clássicas de masmorras. */
var MECHANISM_TYPES = {
  lethal: { label: "Rosto verde / esfera de aniquilação", icon: "☠", description: "Efeito mágico letal ao ser acionado." },
  trappedDoor: { label: "Porta falsa armadilhada", icon: "🚪", description: "Ao abrir a porta associada, dispara o efeito configurado." },
  pit: { label: "Alçapão / fosso oculto", icon: "⌄", description: "O piso cede, causa dano de queda e deixa o fosso aberto." },
  spikePit: { label: "Fosso com estacas envenenadas", icon: "⚠", description: "Queda, estacas e veneno." },
  ceiling: { label: "Teto desabando", icon: "▼", description: "Desabamento causa dano contundente no local." },
  slidingBlock: { label: "Bloco de pedra deslizante", icon: "▰", description: "Um bloco surge à frente do movimento e bloqueia o corredor." },
  rearWall: { label: "Parede que surge atrás", icon: "▥", description: "Uma parede aparece no tile que o personagem acabou de deixar." },
  poisonNeedle: { label: "Agulha envenenada", icon: "⌁", description: "Agulha oculta injeta veneno ao pisar, abrir ou interagir." },
  projectile: { label: "Dardos / lanças ocultas", icon: "➶", description: "Dispara projéteis contra quem aciona a placa ou porta." },
  poisonGas: { label: "Gás venenoso", icon: "☁", description: "Nuvem de veneno afeta criaturas próximas." },
  fearGas: { label: "Gás do medo", icon: "◉", description: "Nuvem causa a condição amedrontado nas criaturas próximas." },
  mist: { label: "Névoa dourada/prateada", icon: "✧", description: "Névoa desorienta e desloca a vítima para outro ponto livre." },
  teleport: { label: "Falsa porta / portal enganoso", icon: "⤴", description: "Transporta a vítima para uma coordenada escolhida." },
  magicArch: { label: "Arco mágico / passagem ilusória", icon: "⤴", description: "Atravessar o arco teletransporta a vítima para outro ponto." },
  phaseDoor: { label: "Porta de fase / passagem unidirecional", icon: "⇥", description: "Transfere a vítima para outro ponto e funciona em apenas um sentido." },
  oneWay: { label: "Passagem de mão única", icon: "⇥", description: "Fecha a passagem atrás do personagem." },
  remoteWall: { label: "Alavanca / mecanismo remoto", icon: "⚙", description: "Alterna uma parede em outra coordenada do mapa." },
  falseFloor: { label: "Piso instável / sala móvel", icon: "≋", description: "Desloca a vítima para um tile adjacente livre e pode causar dano." },
  heavingFloor: { label: "Piso oscilante / câmara agitada", icon: "∿", description: "O piso se move sob os personagens, causando dano e deslocamento." },
  rollingStone: { label: "Pedra rolante esmagadora", icon: "◉", description: "Uma massa de pedra atinge e empurra a vítima pelo corredor." },
  crusher: { label: "Parede ou bloco esmagador", icon: "▣", description: "O mecanismo fecha o corredor e esmaga quem estiver na passagem." },
  electricDoor: { label: "Porta elétrica / arco azul", icon: "ϟ", description: "A porta descarrega energia ao ser aberta." },
  bloodTrap: { label: "Válvula / armadilha de sangue", icon: "🩸", description: "Uma válvula libera uma descarga mágica que fere quem a aciona." },
  upwardLift: { label: "Piso elevatório / câmara ascendente", icon: "⇧", description: "O piso transporta a vítima para outra coordenada ou nível representado no mapa." },
  cursedTreasure: { label: "Tesouro ou gema amaldiçoada", icon: "◆", description: "Tocar ou recolher o objeto desperta uma maldição e causa dano." }
};
function mechanismEnsureState() {
  if (!state) return [];
  if (!Array.isArray(state.traps)) state.traps = [];
  return state.traps;
}
function mechanismDefaultDamage(type) {
  return ({ pit: "3d6", spikePit: "2d10", ceiling: "5d10", trappedDoor: "5d10", slidingBlock: "4d10", poisonNeedle: "1d4", projectile: "3d6", poisonGas: "4d10", falseFloor: "2d6", heavingFloor: "2d6", rollingStone: "8d10", crusher: "10d10", electricDoor: "4d10", bloodTrap: "4d8", cursedTreasure: "4d8" })[type] || "2d6";
}
function mechanismRoll(expression) {
  if (typeof rollDamageExpression === "function") {
    var result = rollDamageExpression(expression || "1d6", false);
    if (result && Number.isFinite(Number(result.total))) return Number(result.total);
  }
  var m = String(expression || "1d6").trim().match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  if (!m) return Math.max(0, Number(expression) || 0);
  var count = Math.max(1, Math.min(20, Number(m[1] || 1))), sides = Math.max(2, Math.min(100, Number(m[2]))), total = Number(m[3] || 0);
  for (var i = 0; i < count; i++) total += 1 + Math.floor(Math.random() * sides);
  return Math.max(0, total);
}
function mechanismGetMaxHp(token) {
  var max = Number(token && token.hpMax);
  if (max > 0) return max;
  if (token && token.tipo === "player" && typeof getCharacterSheetActionData === "function") {
    var sheet = getCharacterSheetActionData();
    if (sheet && Number(sheet.hp) > 0) return Number(sheet.hp);
  }
  if (token && token.monsterId && Array.isArray(window.MONSTERS)) {
    var mon = window.MONSTERS.find(function(item) { return item.id === token.monsterId; });
    if (mon && Number(mon.pontosVida) > 0) return Number(mon.pontosVida);
  }
  return 10;
}
function mechanismDamageToken(token, expression, damageType, sourceName) {
  if (!token || token.morto) return 0;
  var amount = mechanismRoll(expression);
  var maxHp = mechanismGetMaxHp(token);
  if (token.hpMax == null || Number(token.hpMax) <= 0) token.hpMax = maxHp;
  if (token.hp == null || !Number.isFinite(Number(token.hp))) token.hp = maxHp;
  token.hp = Math.max(0, Number(token.hp) - amount);
  if (token.hp <= 0) {
    token.inconsciente = true;
    mechanismAddCondition(token, "inconsciente", "Inconsciente", sourceName || "armadilha");
    mechanismAddCondition(token, "caido", "Caído", sourceName || "armadilha");
  }
  if (damageType === "venenoso" || damageType === "veneno") mechanismAddCondition(token, "envenenado", "Envenenado", sourceName || "armadilha");
  return amount;
}
function mechanismAddCondition(token, id, label, source) {
  if (!token) return;
  if (!Array.isArray(token.condicoes)) token.condicoes = [];
  if (!token.condicoes.some(function(item) { return item && item.id === id && item.fonte === source; })) {
    token.condicoes.push({ id: id, fonte: source || "armadilha", rodadas: 10, salva: null, nota: label || "" });
  }
}
function mechanismPlaceWall(x, y) {
  x = Math.round(Number(x)); y = Math.round(Number(y));
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
  var player = currentPlayer();
  if (player && player.x === x && player.y === y) return false;
  if (!Array.isArray(state.walls) || state.walls.length !== COLS * ROWS) state.walls = makeGrid(0);
  state.walls[idx(x, y)] = 1;
  if (!Array.isArray(state.wallMeta) || state.wallMeta.length !== COLS * ROWS) state.wallMeta = makeArr(COLS * ROWS, null);
  state.wallMeta[idx(x, y)] = { kind: "trapWall", material: "pedra", ac: 17, hp: 27, maxHp: 27, threshold: 10, trapCreated: true };
  return true;
}
function mechanismFindFreeCell(x, y, radius, token) {
  var candidates = [];
  for (var dy = -radius; dy <= radius; dy++) for (var dx = -radius; dx <= radius; dx++) {
    var tx = x + dx, ty = y + dy;
    if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS || isCellWall(tx, ty)) continue;
    if (state.tokens.some(function(other) { return other !== token && !other.morto && other.x === tx && other.y === ty; })) continue;
    candidates.push({ x: tx, y: ty, score: Math.abs(dx) + Math.abs(dy) });
  }
  if (!candidates.length) return null;
  candidates.sort(function(a, b) { return a.score - b.score; });
  var band = candidates.filter(function(item) { return item.score >= 1 && item.score <= Math.max(1, radius); });
  return band[Math.floor(Math.random() * Math.max(1, band.length))] || candidates[0];
}
function mechanismApplyArea(trap, token, type) {
  var radius = Math.max(1, Math.min(8, Number(trap.radius) || 2));
  var affected = state.tokens.filter(function(target) {
    return target && !target.morto && Math.max(Math.abs(Number(target.x) - trap.x), Math.abs(Number(target.y) - trap.y)) <= radius;
  });
  var total = 0;
  affected.forEach(function(target) {
    if (type === "poisonGas") total += mechanismDamageToken(target, trap.damage || "4d10", "venenoso", trap.name);
    else mechanismAddCondition(target, "amedrontado", "Gás do medo", "armadilha:" + trap.id);
  });
  return { affected: affected.length, damage: total };
}
function mechanismActivate(trap, token, fromX, fromY) {
  if (!trap || !token || !trap.active) return { stop: false };
  var type = trap.type, message = trap.message || "";
  var dx = Number(token.x) - Number(fromX), dy = Number(token.y) - Number(fromY);
  var damage = 0, stop = false;
  if (trap.once !== false) trap.active = false;
  trap.triggered = true;
  trap.triggerCount = (Number(trap.triggerCount) || 0) + 1;
  trap.lastTriggeredAt = Date.now();
  trap.discovered = true;
  if (type === "lethal") {
    token.hp = 0; token.hpMax = Number(token.hpMax) || mechanismGetMaxHp(token); token.morto = true; token.inconsciente = false;
    message = message || (trap.name || "A armadilha") + " consome a vítima instantaneamente!";
    stop = true;
  } else if (["pit", "spikePit", "ceiling", "trappedDoor", "poisonNeedle", "projectile", "falseFloor", "slidingBlock", "heavingFloor", "rollingStone", "crusher", "electricDoor", "bloodTrap", "cursedTreasure"].indexOf(type) >= 0) {
    var damageTypeDefault = ["spikePit", "poisonNeedle", "projectile"].indexOf(type) >= 0 ? "perfurante" : type === "electricDoor" ? "eletrico" : type === "bloodTrap" || type === "cursedTreasure" ? "necrotico" : "contundente";
    var defaultDamage = mechanismDefaultDamage(type);
    damage += mechanismDamageToken(token, trap.damage || defaultDamage, damageTypeDefault, trap.name);
    if (type === "spikePit" || type === "poisonNeedle" || (type === "projectile" && trap.poisoned)) damage += mechanismDamageToken(token, trap.poisonDamage || "4d10", "venenoso", trap.name);
    if (type === "bloodTrap") mechanismAddCondition(token, "envenenado", "Sangue amaldiçoado", "armadilha:" + trap.id);
    if (type === "electricDoor") mechanismAddCondition(token, "atordoado", "Choque elétrico", "armadilha:" + trap.id);
    if (type === "cursedTreasure") mechanismAddCondition(token, "amedrontado", "Maldição do tesouro", "armadilha:" + trap.id);
    if (type === "pit" || type === "spikePit") {
      trap.opened = true;
      mechanismAddCondition(token, "caido", "Caiu no fosso", "armadilha:" + trap.id);
      stop = true;
    }
    if (type === "slidingBlock") {
      var bx = token.x + (dx || 1), by = token.y + (dy || 0);
      if (!mechanismPlaceWall(bx, by)) mechanismPlaceWall(fromX, fromY);
    }
    if (type === "falseFloor" || type === "heavingFloor") {
      var moved = mechanismFindFreeCell(token.x, token.y, type === "heavingFloor" ? 3 : 2, token);
      if (moved) { token.x = moved.x; token.y = moved.y; stop = true; }
      mechanismAddCondition(token, "caido", "Derrubado pelo piso móvel", "armadilha:" + trap.id);
    }
    if (type === "rollingStone") {
      var pushX = token.x + Math.sign(dx || 1), pushY = token.y + Math.sign(dy || 0);
      var pushed = mechanismFindFreeCell(pushX, pushY, 2, token);
      if (pushed) { token.x = pushed.x; token.y = pushed.y; }
      mechanismAddCondition(token, "caido", "Derrubado pela pedra rolante", "armadilha:" + trap.id);
      stop = true;
    }
    if (type === "crusher") {
      mechanismAddCondition(token, "atordoado", "Esmagado pelo bloco", "armadilha:" + trap.id);
      if (Number.isFinite(Number(fromX)) && Number.isFinite(Number(fromY))) mechanismPlaceWall(fromX, fromY);
      stop = true;
    }
    message = message || (trap.name || "A armadilha") + " foi acionada! " + damage + " de dano.";
  } else if (type === "rearWall" || type === "oneWay") {
    var wallX = Number(fromX), wallY = Number(fromY);
    if (!Number.isFinite(wallX) || !Number.isFinite(wallY) || (wallX === Number(token.x) && wallY === Number(token.y))) {
      if (Number.isFinite(Number(token.lastMoveFromX)) && Number.isFinite(Number(token.lastMoveFromY))) {
        wallX = Number(token.lastMoveFromX); wallY = Number(token.lastMoveFromY);
      } else { wallX = Number(token.x) - 1; wallY = Number(token.y); }
    }
    var placed = mechanismPlaceWall(wallX, wallY);
    message = message || (placed ? "Uma parede de pedra despenca atrás de você, fechando a passagem!" : "O mecanismo foi acionado, mas não havia espaço livre para a parede surgir.");
  } else if (type === "poisonGas" || type === "fearGas") {
    var area = mechanismApplyArea(trap, token, type);
    message = message || (type === "poisonGas" ? "Uma nuvem de gás venenoso se espalha e afeta " : "Uma nuvem de gás do medo se espalha e afeta ") + area.affected + " criatura(s)." + (area.damage ? " Dano total: " + area.damage + "." : "");
  } else if (type === "mist") {
    mechanismAddCondition(token, "amedrontado", "Névoa desorientadora", "armadilha:" + trap.id);
    var mistDestination = mechanismFindFreeCell(token.x, token.y, 5, token);
    if (mistDestination) { token.x = mistDestination.x; token.y = mistDestination.y; }
    message = message || "A névoa dourada e prateada desorienta você e altera sua posição!";
    stop = true;
  } else if (type === "teleport" || type === "magicArch" || type === "phaseDoor" || type === "upwardLift") {
    var tx = Math.max(0, Math.min(COLS - 1, Number(trap.targetX) || 0));
    var ty = Math.max(0, Math.min(ROWS - 1, Number(trap.targetY) || 0));
    if (isCellWall(tx, ty)) {
      var free = mechanismFindFreeCell(tx, ty, 4, token);
      if (free) { tx = free.x; ty = free.y; }
    }
    token.x = tx; token.y = ty;
    message = message || (type === "upwardLift" ? "O piso se eleva e transporta você para outra parte da masmorra!" : type === "magicArch" ? "O arco mágico se fecha em névoa e transporta você para outro ponto!" : type === "phaseDoor" ? "A porta de fase se fecha atrás de você e só permite a passagem em um sentido!" : "A passagem enganosa transporta você para outro ponto da masmorra!");
    stop = true;
  } else if (type === "remoteWall") {
    var rx = Math.max(0, Math.min(COLS - 1, Number(trap.targetX) || 0));
    var ry = Math.max(0, Math.min(ROWS - 1, Number(trap.targetY) || 0));
    if (rx !== token.x || ry !== token.y) {
      if (!Array.isArray(state.walls) || state.walls.length !== COLS * ROWS) state.walls = makeGrid(0);
      state.walls[idx(rx, ry)] = state.walls[idx(rx, ry)] ? 0 : 1;
      if (state.walls[idx(rx, ry)]) {
        if (!Array.isArray(state.wallMeta) || state.wallMeta.length !== COLS * ROWS) state.wallMeta = makeArr(COLS * ROWS, null);
        state.wallMeta[idx(rx, ry)] = { kind: "trapWall", material: "pedra", ac: 17, hp: 27, maxHp: 27, threshold: 10, trapCreated: true };
      } else if (state.wallMeta) state.wallMeta[idx(rx, ry)] = null;
    }
    message = message || "O mecanismo remoto range e altera a parede em outra parte da sala.";
  }
  save(); draw();
  if (message) appAlertMessage("msg-armadilha-" + trap.id, message);
  return { stop: stop || !!token.morto || Number(token.hp) === 0 };
}
function mechanismTriggerAt(x, y, fromX, fromY, token) {
  if (isHexMap()) return { stop: false };
  var player = token || currentPlayer();
  if (!player || player.morto) return { stop: false };
  var traps = mechanismEnsureState(), triggered = false, stop = false;
  traps.slice().forEach(function(trap) {
    if (!trap || !trap.active || trap.trigger !== "step" || Number(trap.x) !== Number(x) || Number(trap.y) !== Number(y)) return;
    var result = mechanismActivate(trap, player, fromX, fromY);
    triggered = true; stop = stop || result.stop;
  });
  return { triggered: triggered, stop: stop };
}
function mechanismFindAt(x, y) {
  return mechanismEnsureState().find(function(trap) { return trap && Number(trap.x) === Number(x) && Number(trap.y) === Number(y); }) || null;
}
function mechanismEdgeKey(edge) {
  if (!edge) return null;
  if (edge.custom) {
    if (edge.custom.id != null && String(edge.custom.id)) return "custom:" + String(edge.custom.id);
    return "customxy:" + [edge.custom.x1, edge.custom.y1, edge.custom.x2, edge.custom.y2].map(Number).join(",");
  }
  if (edge.dir === "h") return "h:" + Number(edge.x) + ":" + Number(edge.yEdge);
  if (edge.dir === "v") return "v:" + Number(edge.xEdge) + ":" + Number(edge.y);
  return null;
}
function mechanismResolveEdgeKey(key) {
  if (!key) return null;
  var parts = String(key).split(":");
  if (parts[0] === "custom") {
    var item = (state.customEdges || []).find(function(edge) { return String(edge.id || "") === parts.slice(1).join(":"); });
    return item ? { dir: "custom", custom: item } : null;
  }
  if (parts[0] === "customxy") {
    var coords = parts.slice(1).join(":").split(",").map(Number);
    var legacyItem = (state.customEdges || []).find(function(edge) {
      return [edge.x1, edge.y1, edge.x2, edge.y2].every(function(value, index) { return Number(value) === coords[index]; }) ||
        [edge.x2, edge.y2, edge.x1, edge.y1].every(function(value, index) { return Number(value) === coords[index]; });
    });
    return legacyItem ? { dir: "custom", custom: legacyItem } : null;
  }
  if (parts[0] === "h") return { dir: "h", x: Number(parts[1]), yEdge: Number(parts[2]) };
  if (parts[0] === "v") return { dir: "v", xEdge: Number(parts[1]), y: Number(parts[2]) };
  return null;
}
function mechanismEdgeMidpoint(edge) {
  if (!edge) return null;
  if (edge.custom) return { x: (Number(edge.custom.x1) + Number(edge.custom.x2)) / 2, y: (Number(edge.custom.y1) + Number(edge.custom.y2)) / 2 };
  if (edge.dir === "h") return { x: (Number(edge.x) + .5) * CELL, y: Number(edge.yEdge) * CELL };
  return { x: Number(edge.xEdge) * CELL, y: (Number(edge.y) + .5) * CELL };
}
function mechanismTrapPosition(trap) {
  var edge = trap && trap.edgeKey ? mechanismResolveEdgeKey(trap.edgeKey) : null;
  if (edge) {
    var mid = mechanismEdgeMidpoint(edge);
    if (mid) return { x: mid.x, y: mid.y, cell: worldToCell(mid.x, mid.y) };
  }
  return { x: (Number(trap.x) + .5) * CELL, y: (Number(trap.y) + .5) * CELL, cell: { x: Number(trap.x), y: Number(trap.y) } };
}
function mechanismEdgeAt(worldX, worldY) {
  var tolerance = Math.max(8 / zoom, CELL * .18);
  var edge = customEdgeAt(worldX, worldY, tolerance);
  if (!edge) {
    var gx = worldX / CELL, gy = worldY / CELL;
    var near = Math.min(Math.abs(gx - Math.round(gx)), Math.abs(gy - Math.round(gy))) * CELL;
    if (near <= tolerance) edge = nearestEdge(worldX, worldY);
  }
  return edge && isDoorEdge(getEdgeVal(edge)) ? edge : null;
}
function mechanismDoorIsOpen(edge) {
  if (!edge) return false;
  var value = getEdgeVal(edge), meta = getEdgeMeta(edge) || {};
  return value === EDGE_DOOR_O || value === EDGE_SECRET_DOOR_O || ((value === EDGE_LOCKED_DOOR || value === EDGE_JAMMED_DOOR) && !!meta.open);
}
function mechanismTriggerDoor(edge) {
  var key = mechanismEdgeKey(edge), player = currentPlayer();
  if (!key || !player || player.morto) return false;
  var triggered = false, stop = false;
  mechanismEnsureState().slice().forEach(function(trap) {
    if (!trap || !trap.active || trap.edgeKey !== key || trap.trigger !== "door") return;
    var result = mechanismActivate(trap, player, Number(player.lastMoveFromX), Number(player.lastMoveFromY));
    triggered = true; stop = stop || result.stop;
  });
  return triggered && stop;
}
function mechanismDisarmAt(trap, token) {
  if (!trap || !trap.active) return "inactive";
  var rawChoice = appPromptMessage("mechanism-action", (trap.name || "Armadilha") + "\n1 = Tentar desarmar\n2 = Acionar mecanismo\n3 = Ignorar", "1");
  if (rawChoice == null) return "cancelled";
  var choice = String(rawChoice).trim();
  if (choice === "1") {
    var dc = Math.max(1, Math.min(40, Number(trap.dcDisarm) || 15));
    var roll = numberPrompt("Teste de Destreza (Prestidigitação/Ferramentas de Ladrão) — CD " + dc + ". Informe o total:", dc, 0, 60);
    if (roll == null) return "cancelled";
    if (roll >= dc) {
      trap.active = false; trap.disarmed = true; trap.discovered = true;
      save(); draw(); appAlertMessage("mechanism-disarmed", "Sucesso! Você desarmou " + (trap.name || "a armadilha") + ".");
      return "disarmed";
    }
    appAlertMessage("mechanism-failed", "Falha! O mecanismo dispara.");
    mechanismActivate(trap, token, token.x, token.y);
    return "triggered";
  }
  if (choice === "2") {
    mechanismActivate(trap, token, token.x, token.y);
    return "triggered";
  }
  return "ignored";
}
function mechanismDiscoverNearby(player, radius) {
  if (!player || player.tipo !== "player" || isHexMap()) return [];
  var passive = Number(player.percepcaoPassiva);
  if (!Number.isFinite(passive) && typeof getCharacterSheetActionData === "function") {
    var sheet = getCharacterSheetActionData(); if (sheet) passive = Number(sheet.passivePerception);
  }
  if (!Number.isFinite(passive)) passive = 10;
  var found = [];
  mechanismEnsureState().forEach(function(trap) {
    if (!trap || !trap.active || !trap.hidden || trap.discovered) return;
    var pos = mechanismTrapPosition(trap), targetCell = pos.cell;
    var distance = Math.max(Math.abs(Number(targetCell.x) - Number(player.x)), Math.abs(Number(targetCell.y) - Number(player.y)));
    if (distance > radius || !hasLOS(player.x, player.y, targetCell.x, targetCell.y) || passive < Number(trap.dcDetection || 15)) return;
    trap.discovered = true; found.push(trap.name || (MECHANISM_TYPES[trap.type] || MECHANISM_TYPES.pit).label);
  });
  if (found.length) {
    save(); draw();
    appAlertMessage("mechanism-found", "Você percebe sinais de perigo: " + found.join(", ") + ".");
  }
  return found;
}
function mechanismSearchAt(cell) {
  var roll = numberPrompt("Busca ativa — Sabedoria (Percepção) para encontrar armadilhas:", 15, 0, 60);
  if (roll == null) return;
  var found = [];
  mechanismEnsureState().forEach(function(trap) {
    if (!trap || !trap.active || !trap.hidden || trap.discovered) return;
    var targetCell = mechanismTrapPosition(trap).cell;
    var distance = Math.max(Math.abs(Number(targetCell.x) - cell.x), Math.abs(Number(targetCell.y) - cell.y));
    if (distance <= 3 && hasLOS(cell.x, cell.y, targetCell.x, targetCell.y) && roll >= Number(trap.dcDetection || 15)) { trap.discovered = true; found.push(trap.name || (MECHANISM_TYPES[trap.type] || MECHANISM_TYPES.pit).label); }
  });
  save(); draw();
  appAlertMessage("mechanism-search", found.length ? "Armadilhas encontradas: " + found.join(", ") + "." : "Você não encontrou armadilhas nesta área.");
}
function mechanismInstallStyles() {
  if (!R || R.querySelector("#mp-mechanism-style")) return;
  var style = document.createElement("style"); style.id = "mp-mechanism-style";
  style.textContent = "#mp-root .mp-mechanism-overlay{position:absolute;inset:0;z-index:160;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;background:rgba(0,0,0,.78)}#mp-root .mp-mechanism-dialog{width:min(560px,96vw);max-height:92%;overflow:auto;box-sizing:border-box;padding:16px;border:1px solid #626b79;border-radius:12px;background:#171b22;color:#f3f5f8;box-shadow:0 14px 50px #000}#mp-root .mp-mechanism-dialog h3{margin:0 0 6px;font-size:18px}#mp-root .mp-mechanism-dialog p{margin:0 0 12px;color:#b8c1cf;font-size:12px;line-height:1.45}#mp-root .mp-mechanism-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}#mp-root .mp-mechanism-field{display:flex;flex-direction:column;gap:4px;min-width:0;color:#d8deea;font-size:12px}#mp-root .mp-mechanism-field.full{grid-column:1/-1}#mp-root .mp-mechanism-field input,#mp-root .mp-mechanism-field select,#mp-root .mp-mechanism-field textarea{width:100%;box-sizing:border-box;padding:8px;border:1px solid #596271;border-radius:6px;background:#242a34;color:#fff;font:inherit}#mp-root .mp-mechanism-field textarea{min-height:58px;resize:vertical}#mp-root .mp-mechanism-check{display:flex;align-items:center;gap:7px;padding:7px 8px;border:1px solid #414957;border-radius:7px;color:#d9deea;font-size:12px}#mp-root .mp-mechanism-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:14px;padding-top:12px;border-top:1px solid #3b424e}#mp-root .mp-mechanism-actions button{min-height:36px;padding:7px 12px;border:1px solid #525d6b;border-radius:7px;background:#303846;color:#fff;cursor:pointer}#mp-root .mp-mechanism-actions .primary{background:#185b79;border-color:#3484a5}#mp-root .mp-mechanism-actions .danger{background:#702b35;border-color:#9b424b}#mp-root .mp-mechanism-note{margin-top:10px;color:#aab4c3;font-size:11px}@media(max-width:520px){#mp-root .mp-mechanism-grid{grid-template-columns:1fr}}";
  R.querySelector("#mp-root").appendChild(style);
}
function mechanismOpenEditor(cell, existing, attachedEdge) {
  mechanismInstallStyles();
  var old = existing || null, type = old && MECHANISM_TYPES[old.type] ? old.type : attachedEdge ? "trappedDoor" : "pit";
  var escFn = typeof esc === "function" ? esc : function(v) { return String(v == null ? "" : v).replace(/[&<>\"']/g, function(c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#39;" })[c]; }); };
  var options = Object.keys(MECHANISM_TYPES).map(function(key) { return '<option value="' + key + '"' + (type === key ? ' selected' : '') + '>' + escFn(MECHANISM_TYPES[key].label) + '</option>'; }).join("");
  var layer = document.createElement("div"); layer.className = "mp-mechanism-overlay";
  layer.innerHTML = '<section class="mp-mechanism-dialog" role="dialog" aria-modal="true" aria-label="Configurar armadilha ou mecanismo">' +
    '<h3>' + (old ? "Editar mecanismo" : "Criar armadilha ou mecanismo") + '</h3>' +
    '<p>Configure o gatilho, a detecção e o efeito. Armadilhas ocultas não aparecem aos jogadores até serem descobertas.</p>' +
    '<form id="mp-mechanism-form"><div class="mp-mechanism-grid">' +
    '<label class="mp-mechanism-field full">Nome<input name="name" maxlength="60" value="' + escFn(old && old.name || MECHANISM_TYPES[type].label) + '"></label>' +
    '<label class="mp-mechanism-field full">Tipo de mecanismo<select name="type">' + options + '</select></label>' +
    '<label class="mp-mechanism-field">Gatilho<select name="trigger"><option value="step"' + (!old || old.trigger === "step" ? " selected" : "") + '>Ao pisar no tile</option><option value="interact"' + (old && old.trigger === "interact" ? " selected" : "") + '>Ao interagir com o tile</option><option value="door"' + ((attachedEdge || old && old.trigger === "door") ? " selected" : "") + '>Ao abrir esta porta</option></select></label>' +
    '<label class="mp-mechanism-field">Dano principal<input name="damage" value="' + escFn(old && old.damage || mechanismDefaultDamage(type)) + '" placeholder="Ex.: 5d10"></label>' +
    '<label class="mp-mechanism-field">Dano de veneno<input name="poisonDamage" value="' + escFn(old && old.poisonDamage || "4d10") + '"></label>' +
    '<label class="mp-mechanism-field">Raio de efeito (tiles)<input name="radius" type="number" min="1" max="8" value="' + escFn(old && old.radius || 2) + '"></label>' +
    '<label class="mp-mechanism-field">CD para detectar<input name="dcDetection" type="number" min="1" max="40" value="' + escFn(old && old.dcDetection || 15) + '"></label>' +
    '<label class="mp-mechanism-field">CD para desarmar<input name="dcDisarm" type="number" min="1" max="40" value="' + escFn(old && old.dcDisarm || 15) + '"></label>' +
    '<label class="mp-mechanism-field">Coluna alvo<input name="targetX" type="number" min="1" max="' + COLS + '" value="' + escFn(old && old.targetX != null ? Number(old.targetX) + 1 : Math.min(COLS, cell.x + 4)) + '"></label>' +
    '<label class="mp-mechanism-field">Linha alvo<input name="targetY" type="number" min="1" max="' + ROWS + '" value="' + escFn(old && old.targetY != null ? Number(old.targetY) + 1 : cell.y + 1) + '"></label>' +
    '<label class="mp-mechanism-field">Descrição quando dispara<textarea name="message" maxlength="240">' + escFn(old && old.message || "") + '</textarea></label>' +
    '<div class="mp-mechanism-field"><label class="mp-mechanism-check"><input type="checkbox" name="hidden"' + (!old || old.hidden !== false ? ' checked' : '') + '> Oculta para jogadores</label><label class="mp-mechanism-check"><input type="checkbox" name="once"' + (!old || old.once !== false ? ' checked' : '') + '> Dispara uma única vez</label><label class="mp-mechanism-check"><input type="checkbox" name="armed"' + (!old || old.active !== false ? ' checked' : '') + '> Mecanismo armado</label><label class="mp-mechanism-check"><input type="checkbox" name="poisoned"' + (old && old.poisoned ? ' checked' : '') + '> Dardos também envenenados</label></div>' +
    '</div><div class="mp-mechanism-note">Para armadilhar uma porta, clique diretamente sobre a linha dela com esta ferramenta e use o gatilho “Ao abrir esta porta”. Para a parede atrás de quem acionou, escolha “Parede que surge atrás”. Para alterar uma parede distante, escolha “Alavanca / mecanismo remoto” e informe a coluna e a linha alvo.</div>' +
    '<div class="mp-mechanism-actions">' + (old ? '<button type="button" class="danger" data-action="delete">Excluir</button>' : '') + '<button type="button" data-action="cancel">Cancelar</button><button type="submit" class="primary">Salvar mecanismo</button></div></form></section>';
  R.querySelector("#mp-root").appendChild(layer);
  var form = layer.querySelector("#mp-mechanism-form");
  var typeSelect = form.elements.type, damageInput = form.elements.damage, previousType = type;
  typeSelect.addEventListener("change", function() { if (!old || damageInput.value === mechanismDefaultDamage(previousType)) damageInput.value = mechanismDefaultDamage(typeSelect.value); previousType = typeSelect.value; });
  layer.addEventListener("click", function(event) {
    if (event.target === layer || event.target.closest('[data-action="cancel"]')) layer.remove();
    if (event.target.closest('[data-action="delete"]')) {
      if (appConfirmMessage("mechanism-delete", "Excluir este mecanismo do mapa?")) {
        state.traps = mechanismEnsureState().filter(function(item) { return item.id !== old.id; }); save(); draw();
      }
      layer.remove();
    }
  });
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    var data = new FormData(form), selectedType = String(data.get("type") || "pit");
    var record = old || { id: "trap-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7), x: cell.x, y: cell.y, active: true, triggered: false, triggerCount: 0 };
    record.name = String(data.get("name") || MECHANISM_TYPES[selectedType].label).trim().slice(0, 60);
    record.type = selectedType;
    record.trigger = data.get("trigger") === "door" ? "door" : data.get("trigger") === "interact" ? "interact" : "step";
    record.edgeKey = attachedEdge ? mechanismEdgeKey(attachedEdge) : old && old.edgeKey || null;
    record.damage = String(data.get("damage") || mechanismDefaultDamage(selectedType)).trim().slice(0, 20);
    record.poisonDamage = String(data.get("poisonDamage") || "4d10").trim().slice(0, 20);
    record.radius = Math.max(1, Math.min(8, Number(data.get("radius")) || 2));
    record.dcDetection = Math.max(1, Math.min(40, Number(data.get("dcDetection")) || 15));
    record.dcDisarm = Math.max(1, Math.min(40, Number(data.get("dcDisarm")) || 15));
    record.targetX = Math.max(0, Math.min(COLS - 1, (Number(data.get("targetX")) || 1) - 1));
    record.targetY = Math.max(0, Math.min(ROWS - 1, (Number(data.get("targetY")) || 1) - 1));
    record.message = String(data.get("message") || "").trim().slice(0, 240);
    record.hidden = form.elements.hidden.checked;
    record.discovered = !record.hidden;
    record.once = form.elements.once.checked;
    record.poisoned = form.elements.poisoned.checked;
    record.active = form.elements.armed.checked;
    record.disarmed = false;
    if (!old) mechanismEnsureState().push(record);
    save(); draw(); layer.remove();
  });
}
function drawMapMechanisms() {
  if (!state || isHexMap() || !Array.isArray(state.traps)) return;
  mechanismEnsureState().forEach(function(trap) {
    if (!trap || (appMode !== "editor" && !trap.active && !trap.opened)) return;
    if (appMode !== "editor" && trap.hidden && !trap.discovered) return;
    var trapPosition = mechanismTrapPosition(trap);
    var point = trap.edgeKey ? { x: trapPosition.x, y: trapPosition.y } : cellCenter(Number(trap.x), Number(trap.y));
    var type = MECHANISM_TYPES[trap.type] || MECHANISM_TYPES.pit;
    cx.save();
    cx.globalAlpha = trap.active ? 0.96 : 0.45;
    cx.fillStyle = trap.opened ? "rgba(8,8,10,.94)" : trap.hidden && appMode === "editor" ? "rgba(150,105,35,.88)" : "rgba(105,35,37,.88)";
    cx.strokeStyle = trap.active ? "#ffd36a" : "#9299a5"; cx.lineWidth = 2 / zoom;
    cx.beginPath(); cx.arc(point.x, point.y, Math.max(9, CELL * .22), 0, Math.PI * 2); cx.fill(); cx.stroke();
    cx.fillStyle = "#fff"; cx.font = "bold " + Math.max(11, CELL * .28) + "px sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.fillText(trap.opened ? "⬛" : type.icon, point.x, point.y + 1 / zoom);
    if (appMode === "editor") {
      cx.fillStyle = "#fff1c7"; cx.font = "bold " + Math.max(8, 10 / zoom) + "px sans-serif";
      cx.fillText(trap.active ? "ARMADILHA" : "DESARMADA", point.x, point.y + CELL * .38);
    }
    cx.restore();
  });
}
function mechanismPreDoorAction(edge) {
  if (appMode === "editor") return false;
  var key = mechanismEdgeKey(edge), player = currentPlayer();
  if (!key || !player || player.morto) return false;
  var trap = mechanismEnsureState().find(function(item) {
    return item && item.active && item.trigger === "door" && item.edgeKey === key && (item.discovered || !item.hidden);
  });
  if (!trap) return false;
  var result = mechanismDisarmAt(trap, player);
  return result === "triggered" || result === "cancelled";
}
var mechanismBaseSetDoorRunValue = setDoorRunValue;
setDoorRunValue = function(edge, value) {
  if ((value === EDGE_DOOR_O || value === EDGE_SECRET_DOOR_O) && mechanismPreDoorAction(edge)) return;
  mechanismBaseSetDoorRunValue(edge, value);
  if (value === EDGE_DOOR_O || value === EDGE_SECRET_DOOR_O) mechanismTriggerDoor(edge);
};
var mechanismBaseInteractWithEdge = interactWithEdge;
interactWithEdge = function(edge) {
  var wasOpen = mechanismDoorIsOpen(edge);
  if (!wasOpen && mechanismPreDoorAction(edge)) return;
  mechanismBaseInteractWithEdge(edge);
  if (!wasOpen && mechanismDoorIsOpen(edge)) mechanismTriggerDoor(edge);
};
var mechanismBasePointerDown = onPointerDown;
onPointerDown = function(event) {
  if (appMode === "editor" && tool === "mechanism" && !isHexMap() && cv) {
    event.preventDefault();
    if (cv.setPointerCapture) cv.setPointerCapture(event.pointerId);
    var rect = cv.getBoundingClientRect(), world = screenToWorld(event.clientX - rect.left, event.clientY - rect.top), cell = worldToCell(world.x, world.y);
    if (cell.x < 0 || cell.y < 0 || cell.x >= COLS || cell.y >= ROWS) return;
    var attachedEdge = mechanismEdgeAt(world.x, world.y);
    if (attachedEdge) {
      var key = mechanismEdgeKey(attachedEdge), midpoint = mechanismEdgeMidpoint(attachedEdge), anchor = worldToCell(midpoint.x, midpoint.y);
      if (anchor.x < 0 || anchor.y < 0 || anchor.x >= COLS || anchor.y >= ROWS) anchor = cell;
      var edgeTrap = mechanismEnsureState().find(function(item) { return item && item.edgeKey === key; }) || null;
      mechanismOpenEditor(anchor, edgeTrap, attachedEdge);
    } else mechanismOpenEditor(cell, mechanismFindAt(cell.x, cell.y));
    return;
  }
  if (appMode !== "editor" && !isHexMap() && tool === "select" && cv) {
    var player = currentPlayer(), rectPlayer = cv.getBoundingClientRect();
    if (player) {
      var point = screenToWorld(event.clientX - rectPlayer.left, event.clientY - rectPlayer.top), cellPlayer = worldToCell(point.x, point.y);
      var trap = mechanismFindAt(cellPlayer.x, cellPlayer.y);
      if (trap && (trap.discovered || !trap.hidden) && Math.abs(player.x - cellPlayer.x) <= 0 && Math.abs(player.y - cellPlayer.y) <= 0) {
        mechanismDisarmAt(trap, player); return;
      }
    }
  }
  return mechanismBasePointerDown(event);
};
var mechanismBaseCheckPassive = checkPassiveSecretDetection;
checkPassiveSecretDetection = function(player) {
  if (typeof mechanismBaseCheckPassive === "function") mechanismBaseCheckPassive(player);
  mechanismDiscoverNearby(player, Math.max(2, typeof playerVisionRadius === "function" ? playerVisionRadius(player) : 3));
};
var mechanismBaseSearch = performActiveSecretSearch;
performActiveSecretSearch = function(cell) {
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
  mechanismEnsureState().forEach(function(trap) {
    if (!trap || !trap.active || !trap.hidden || trap.discovered) return;
    var targetCell = mechanismTrapPosition(trap).cell;
    var distance = Math.max(Math.abs(Number(targetCell.x) - cell.x), Math.abs(Number(targetCell.y) - cell.y));
    if (distance <= 3 && hasLOS(cell.x, cell.y, targetCell.x, targetCell.y) && roll >= Number(trap.dcDetection || 15)) {
      trap.discovered = true;
      found.push(trap.name || (MECHANISM_TYPES[trap.type] || MECHANISM_TYPES.pit).label);
    }
  });
  save(); draw();
  appAlertMessage("mechanism-search", found.length ? "Você encontrou: " + found.join(", ") + "." : "Você não encontrou passagens secretas ou armadilhas nesta área.");
};
