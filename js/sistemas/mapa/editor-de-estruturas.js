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
function openStructureEditor(edge) {
    if (!edge || getEdgeVal(edge) === EDGE_NONE) {
      appAlertMessage("msg064", "Não há parede ou porta nesta linha.");
      return;
    }
    var oldMeta = getEdgeMeta(edge) || {};
    var initialKind = structureKindFromEdge(edge);
    var DOOR_KINDS = ["porta", "secretDoor", "lockedDoor", "jammedDoor"];
    var isDoor = DOOR_KINDS.indexOf(initialKind) >= 0;
    var kinds = isDoor ? [
      ["porta", "Porta comum"],
      ["secretDoor", "Porta secreta"],
      ["lockedDoor", "Porta trancada"],
      ["jammedDoor", "Porta emperrada / barrada"]
    ] : [
      ["muro", "Muro comum"],
      ["secretWall", "Parede secreta"],
      ["illusionWall", "Parede ilusória"],
      ["forceWall", "Muralha de Energia"],
      ["magicWall", "Parede mágica"]
    ];
    var STRUCT = ["material", "ac", "hp", "maxHp", "threshold"];
    var KIND_FIELDS = {
      muro: ["ac", "hp", "maxHp", "threshold"],
      porta: STRUCT.concat(["open"]),
      secretDoor: STRUCT.concat(["dcDetection", "dcMechanism", "mechanismHint", "detected", "mechanismKnown", "open"]),
      secretWall: STRUCT.concat(["dcDetection", "dcMechanism", "mechanismHint", "detected", "mechanismKnown", "open"]),
      lockedDoor: STRUCT.concat(["lockDC", "dcForce", "lockComplexity", "keyName", "arcaneLock", "open"]),
      jammedDoor: STRUCT.concat(["dcForce", "barred", "open"]),
      illusionWall: ["dcDetection", "detected"],
      forceWall: [],
      magicWall: ["ac", "hp", "maxHp", "threshold"]
    };
    var KIND_LABELS = {
      porta: { open: "Porta aberta" },
      secretDoor: { dcDetection: "CD para detectar a porta", detected: "Porta secreta já detectada", open: "Porta aberta" },
      secretWall: { dcDetection: "CD para detectar a parede", detected: "Parede secreta já detectada", open: "Passagem aberta" },
      lockedDoor: { dcForce: "CD de Força (Atletismo) para arrombar", open: "Porta aberta" },
      jammedDoor: { dcForce: "CD de Força (Atletismo) para forçar", open: "Porta aberta" },
      illusionWall: { dcDetection: "CD para identificar a ilusão (Investigação)", detected: "Ilusão já identificada" }
    };
    var KIND_NOTES = {
      illusionWall: "A parede ilusória parece sólida, mas não bloqueia a passagem. Ela deixa de bloquear a visão depois de identificada.",
      forceWall: "A Muralha de Energia é invisível, bloqueia o movimento, não bloqueia a visão e não tem propriedades ajustáveis."
    };
    var dlg = createPortalDialog(
      isDoor ? "Editar porta" : "Editar muro",
      isDoor ? "Edite somente esta porta. Escolha o tipo da porta e ajuste suas propriedades." : "Edite somente este muro. Escolha o tipo do muro e ajuste suas propriedades."
    );
    if (!dlg) return;
    dlg.panel.style.width = "min(620px,100%)";
    dlg.panel.style.maxHeight = "88%";
    dlg.panel.style.overflow = "auto";
    var form = document.createElement("div");
    form.style.cssText = "display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:10px 0 16px;";
    var fieldWraps = {}, fieldLabels = {}, defaultLabels = {};
    function field(label, key, value, type) {
      var wrap = document.createElement("label");
      wrap.style.cssText = "display:flex;flex-direction:column;gap:4px;font-size:12px;color:#d5d9e2;";
      var span = document.createElement("span");
      span.textContent = label;
      wrap.appendChild(span);
      var input = document.createElement(type === "select" ? "select" : "input");
      if (type !== "select") input.type = type || "text";
      input.dataset.key = key;
      input.style.cssText = "width:100%;min-width:0;box-sizing:border-box;padding:8px;border:1px solid #555d6c;border-radius:6px;background:#252a34;color:#fff;";
      if (type === "select" && key === "kind") kinds.forEach(function(k) {
        var o = document.createElement("option");
        o.value = k[0];
        o.textContent = k[1];
        input.appendChild(o);
      });
      if (type === "select" && key === "material") Object.keys(OBJECT_MATERIALS).forEach(function(k) {
        var o = document.createElement("option");
        o.value = k;
        o.textContent = OBJECT_MATERIALS[k].label;
        input.appendChild(o);
      });
      if (type === "checkbox") input.checked = !!value;
      else input.value = value == null ? "" : String(value);
      wrap.appendChild(input);
      form.appendChild(wrap);
      fieldWraps[key] = wrap;
      fieldLabels[key] = span;
      defaultLabels[key] = label;
      return input;
    }
    var kind = field(isDoor ? "Tipo da porta" : "Tipo do muro", "kind", initialKind, "select");
    var material = field("Material", "material", oldMeta.material || "pedra", "select");
    var ac = field("Classe de Armadura (CA)", "ac", oldMeta.ac == null ? 17 : oldMeta.ac, "number");
    var hp = field("Pontos de Vida (PV)", "hp", oldMeta.hp == null ? 27 : oldMeta.hp, "number");
    var maxHp = field("PV máximo", "maxHp", oldMeta.maxHp == null ? oldMeta.hp == null ? 27 : oldMeta.hp : oldMeta.maxHp, "number");
    var threshold = field("Limiar de dano", "threshold", oldMeta.threshold == null ? 0 : oldMeta.threshold, "number");
    var dcDetection = field("CD para detectar", "dcDetection", oldMeta.dcDetection == null ? 15 : oldMeta.dcDetection, "number");
    var dcMechanism = field("CD para descobrir mecanismo", "dcMechanism", oldMeta.dcMechanism == null ? 15 : oldMeta.dcMechanism, "number");
    var mechanismHint = field("Dica do mecanismo", "mechanismHint", oldMeta.mechanismHint || "", "text");
    var lockDC = field("CD das Ferramentas de Ladrão", "lockDC", oldMeta.lockDC == null ? 15 : oldMeta.lockDC, "number");
    var dcForce = field("CD de Força / Atletismo", "dcForce", oldMeta.dcForce == null ? 15 : oldMeta.dcForce, "number");
    var lockComplexity = field("Complexidade da fechadura", "lockComplexity", oldMeta.lockComplexity || "simple", "select");
    ["simple", "complex"].forEach(function(v) {
      var o = document.createElement("option");
      o.value = v;
      o.textContent = v === "simple" ? "Simples (1 ação)" : "Complexa (1 minuto)";
      lockComplexity.appendChild(o);
    });
    lockComplexity.value = oldMeta.lockComplexity || "simple";
    var keyName = field("Nome da chave", "keyName", oldMeta.keyName || "", "text");
    var barred = field("Barrada por dentro", "barred", oldMeta.barred, "checkbox");
    var arcane = field("Possui Tranca Arcana", "arcaneLock", oldMeta.arcaneLock, "checkbox");
    var detected = field("Já detectado", "detected", oldMeta.detected, "checkbox");
    var mechanismKnown = field("Mecanismo descoberto", "mechanismKnown", oldMeta.mechanismKnown, "checkbox");
    var opened = field("Aberta", "open", oldMeta.open, "checkbox");
    dlg.panel.appendChild(form);
    var note = document.createElement("p");
    dlg.panel.appendChild(note);
    function applyKind() {
      var k = kind.value, list = KIND_FIELDS[k] || [], labels = KIND_LABELS[k] || {};
      Object.keys(fieldWraps).forEach(function(key) {
        if (key === "kind") return;
        fieldWraps[key].style.display = list.indexOf(key) >= 0 ? "" : "none";
        fieldLabels[key].textContent = labels[key] || defaultLabels[key];
      });
      note.textContent = KIND_NOTES[k] || "";
      note.style.display = KIND_NOTES[k] ? "" : "none";
    }
    kind.addEventListener("change", applyKind);
    applyKind();
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    var cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancelar";
    cancel.onclick = function() {
      closePortalDialog(dlg.overlay);
    };
    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger";
    remove.textContent = isDoor ? "Remover porta" : "Remover muro";
    remove.onclick = function() {
      setEdgeVal(edge, EDGE_NONE);
      setEdgeMeta(edge, null);
      save();
      draw();
      closePortalDialog(dlg.overlay);
    };
    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "primary";
    saveBtn.textContent = "Salvar alterações";
    saveBtn.onclick = function() {
      var k = kind.value, list = KIND_FIELDS[k] || [], m = Object.assign({}, oldMeta);
      function has(key) {
        return list.indexOf(key) >= 0;
      }
      m.kind = k;
      if (has("material")) m.material = material.value;
      if (has("ac")) m.ac = Math.max(0, Number(ac.value) || 0);
      if (has("hp")) m.hp = Math.max(0, Number(hp.value) || 0);
      if (has("maxHp")) m.maxHp = Math.max(0, Number(maxHp.value) || m.hp);
      if (has("threshold")) m.threshold = Math.max(0, Number(threshold.value) || 0);
      if (has("dcDetection")) m.dcDetection = Math.max(1, Number(dcDetection.value) || 15);
      if (has("dcMechanism")) m.dcMechanism = Math.max(1, Number(dcMechanism.value) || 15);
      if (has("mechanismHint")) m.mechanismHint = mechanismHint.value;
      if (has("lockDC")) m.lockDC = Math.max(1, Number(lockDC.value) || 15);
      if (has("dcForce")) m.dcForce = Math.max(1, Number(dcForce.value) || 15);
      if (has("lockComplexity")) m.lockComplexity = lockComplexity.value;
      if (has("keyName")) m.keyName = keyName.value;
      if (has("barred")) m.barred = barred.checked;
      if (has("arcaneLock")) m.arcaneLock = arcane.checked;
      if (has("detected")) m.detected = detected.checked;
      if (has("mechanismKnown")) m.mechanismKnown = mechanismKnown.checked;
      m.open = has("open") ? opened.checked : false;
      m.locked = k === "lockedDoor" || k === "jammedDoor";
      var isOpen = !!m.open;
      var vals = { muro: EDGE_MURO, porta: isOpen ? EDGE_DOOR_O : EDGE_DOOR_C, secretWall: EDGE_SECRET_WALL, secretDoor: isOpen ? EDGE_SECRET_DOOR_O : EDGE_SECRET_DOOR_C, lockedDoor: EDGE_LOCKED_DOOR, jammedDoor: EDGE_JAMMED_DOOR, illusionWall: EDGE_ILLUSION_WALL, forceWall: EDGE_FORCE_WALL, magicWall: EDGE_MAGIC_WALL };
      if (k === "muro") m.material = "pedra";
      if (k === "illusionWall") {
        m.material = "illusion";
        m.hp = null;
        m.maxHp = null;
        m.ac = null;
        m.threshold = 0;
      }
      if (k === "forceWall") {
        m.material = "force";
        m.hp = null;
        m.maxHp = null;
        m.ac = null;
        m.threshold = 999999;
      }
      if (k === "magicWall") {
        m.material = "pedraMagica";
      }
      setEdgeVal(edge, vals[k]);
      setEdgeMeta(edge, m);
      save();
      draw();
      closePortalDialog(dlg.overlay);
    };
    actions.appendChild(remove);
    actions.appendChild(cancel);
    actions.appendChild(saveBtn);
    dlg.panel.appendChild(actions);
  }
function openCellWallEditor(cell) {
    if (!cell || cell.x < 0 || cell.y < 0 || cell.x >= COLS || cell.y >= ROWS || !state.walls[idx(cell.x, cell.y)]) {
      appAlertMessage("msg066", "Não há uma parede nesta quadrícula.");
      return;
    }
    var i = idx(cell.x, cell.y);
    if (!state.wallMeta) state.wallMeta = makeArr(COLS * ROWS, null);
    var oldMeta = state.wallMeta[i] || makeStructureMeta("pedra", "wall", 2);
    var dlg = createPortalDialog("Editar parede", "Edite somente esta parede (uma quadrícula). Ajuste o material e a resistência dela.");
    if (!dlg) return;
    dlg.panel.style.width = "min(520px,100%)";
    dlg.panel.style.maxHeight = "88%";
    dlg.panel.style.overflow = "auto";
    var form = document.createElement("div");
    form.style.cssText = "display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:10px 0 16px;";
    function field(label, value, type) {
      var wrap = document.createElement("label");
      wrap.style.cssText = "display:flex;flex-direction:column;gap:4px;font-size:12px;color:#d5d9e2;";
      var span = document.createElement("span");
      span.textContent = label;
      wrap.appendChild(span);
      var input = document.createElement(type === "select" ? "select" : "input");
      if (type !== "select") input.type = type || "text";
      input.style.cssText = "width:100%;min-width:0;box-sizing:border-box;padding:8px;border:1px solid #555d6c;border-radius:6px;background:#252a34;color:#fff;";
      if (type === "select") Object.keys(OBJECT_MATERIALS).forEach(function(k) {
        var o = document.createElement("option");
        o.value = k;
        o.textContent = OBJECT_MATERIALS[k].label;
        input.appendChild(o);
      });
      input.value = value == null ? "" : String(value);
      wrap.appendChild(input);
      form.appendChild(wrap);
      return input;
    }
    var material = field("Material", OBJECT_MATERIALS[oldMeta.material] ? oldMeta.material : "pedra", "select");
    var ac = field("Classe de Armadura (CA)", oldMeta.ac == null ? 17 : oldMeta.ac, "number");
    var hp = field("Pontos de Vida (PV)", oldMeta.hp == null ? 54 : oldMeta.hp, "number");
    var maxHp = field("PV máximo", oldMeta.maxHp == null ? oldMeta.hp == null ? 54 : oldMeta.hp : oldMeta.maxHp, "number");
    var threshold = field("Limiar de dano", oldMeta.threshold == null ? 15 : oldMeta.threshold, "number");
    material.addEventListener("change", function() {
      var base = OBJECT_MATERIALS[material.value] || OBJECT_MATERIALS.pedra;
      ac.value = base.ac;
      hp.value = base.hp * 2;
      maxHp.value = base.hp * 2;
      threshold.value = base.threshold * 1.5;
    });
    dlg.panel.appendChild(form);
    var actions = document.createElement("div");
    actions.className = "mp-portal-dialog-actions";
    var cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancelar";
    cancel.onclick = function() {
      closePortalDialog(dlg.overlay);
    };
    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger";
    remove.textContent = "Remover parede";
    remove.onclick = function() {
      state.walls[i] = 0;
      state.wallMeta[i] = null;
      save();
      draw();
      closePortalDialog(dlg.overlay);
    };
    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "primary";
    saveBtn.textContent = "Salvar alterações";
    saveBtn.onclick = function() {
      var m = Object.assign({}, oldMeta);
      m.kind = "wall";
      m.material = material.value;
      m.ac = Math.max(0, Number(ac.value) || 0);
      m.hp = Math.max(0, Number(hp.value) || 0);
      m.maxHp = Math.max(0, Number(maxHp.value) || m.hp);
      m.threshold = Math.max(0, Number(threshold.value) || 0);
      state.wallMeta[i] = m;
      save();
      draw();
      closePortalDialog(dlg.overlay);
    };
    actions.appendChild(remove);
    actions.appendChild(cancel);
    actions.appendChild(saveBtn);
    dlg.panel.appendChild(actions);
  }
