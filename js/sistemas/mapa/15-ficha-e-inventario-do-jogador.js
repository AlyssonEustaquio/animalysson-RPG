var RPG_SKILL_ABILITIES = {
    "Acrobacia": "DES",
    "Adestrar Animais": "SAB",
    "Arcanismo": "INT",
    "Atletismo": "FOR",
    "Atuação": "CAR",
    "Enganação": "CAR",
    "Furtividade": "DES",
    "História": "INT",
    "Intimidação": "CAR",
    "Intuição": "SAB",
    "Investigação": "INT",
    "Medicina": "SAB",
    "Natureza": "INT",
    "Percepção": "SAB",
    "Persuasão": "CAR",
    "Prestidigitação": "DES",
    "Religião": "INT",
    "Sobrevivência": "SAB"
  };

function getCharacterSheetActionData() {
    try {
      let base = function(attr) {
        if (S.method === "std" || S.method === "rnd") return S.std && S.std[attr] != null ? Number(S.std[attr]) : 10;
        if (S.method === "pb") return S.pb && S.pb[attr] != null ? Number(S.pb[attr]) : 8;
        return S.man && S.man[attr] != null ? Number(S.man[attr]) : 10;
      }, originBonus = function(attr) {
        if (!bg || !Array.isArray(bg.a) || bg.a.indexOf(attr) < 0) return 0;
        if (S.mode === "111") return 1;
        return attr === S.p2 ? 2 : attr === S.p1 ? 1 : 0;
      };
      if (typeof S === "undefined" || !S || S.cls == null) return null;
      var classes = typeof CL !== "undefined" && Array.isArray(CL) ? CL : window.CLASSES;
      var backgrounds = typeof BG !== "undefined" && Array.isArray(BG) ? BG : window.BACKGROUNDS;
      var cls = classes && classes[S.cls];
      if (!cls) return null;
      var bg = backgrounds && S.bg != null ? backgrounds[S.bg] : null;
      var scores = {}, abilityMods = {};
      ["FOR", "DES", "CON", "INT", "SAB", "CAR"].forEach(function(attr) {
        scores[attr] = Math.min(20, base(attr) + originBonus(attr));
        abilityMods[attr] = Math.floor((scores[attr] - 10) / 2);
      });
      var proficiencyBonus = cls ? 2 : 0;
      var proficiencies = new Set((Array.isArray(S.skills) ? S.skills : []).concat(bg && Array.isArray(bg.s) ? bg.s : []));
      var skillBonuses = {};
      Object.keys(RPG_SKILL_ABILITIES).forEach(function(skill) {
        var ability = RPG_SKILL_ABILITIES[skill];
        skillBonuses[skill] = abilityMods[ability] + (proficiencies.has(skill) ? proficiencyBonus : 0);
      });
      var speedText = typeof SP !== "undefined" && Array.isArray(SP) && S.sp != null && SP[S.sp] ? String(SP[S.sp].mov || "9 m") : "9 m";
      var speedMatch = speedText.match(/(\d+(?:[.,]\d+)?)/);
      var speedMeters = speedMatch ? Number(speedMatch[1].replace(",", ".")) : 9;
      if (invAtivo()) {
        var invSp = invSpeedMeters();
        if (invSp.montado) speedMeters = invSp.atual;
        else if (invSp.penalidade) speedMeters = Math.max(1.5, speedMeters - invSp.penalidade);
      }
      var speedCells = Math.max(1, Math.round((speedMeters || 9) / 1.5));
      var toolsBonus = abilityMods.DES + (bg && normalizeRpgText(bg.i || "") === "ferramentas de ladrao" ? proficiencyBonus : 0);
      return {
        name: String(S.name || "Personagem"),
        className: cls.n || "",
        scores,
        abilityMods,
        skillBonuses,
        proficiencies: Array.from(proficiencies),
        proficiencyBonus,
        passivePerception: 10 + skillBonuses["Percepção"],
        meleeAttack: abilityMods.FOR + proficiencyBonus,
        rangedAttack: abilityMods.DES + proficiencyBonus,
        toolsBonus,
        hp: Math.max(1, Number(cls.d || 0) + abilityMods.CON),
        armorClass: 10 + abilityMods.DES,
        saveProficiencies: Array.isArray(cls.s) ? cls.s : [],
        hitDie: Number(cls.d) || 8,
        speedCells
      };
    } catch (e) {
      return null;
    }
  }

function playerActionProfile(player) {
    if (!player) return null;
    if (!player.actionProfile || typeof player.actionProfile !== "object") player.actionProfile = {};
    var profile = player.actionProfile;
    var previousConfigVersion = profile.configVersion;
    var defaults = {
      perception: 0,
      investigation: 0,
      attack: 0,
      athletics: 0,
      tools: 0,
      skillBonuses: {},
      damage: "1d8+0",
      attackRange: 0,
      weaponId: "",
      weaponMode: "melee",
      damageOverride: "",
      useSheet: true,
      configVersion: 2,
      armorId: "",
      shield: false,
      maestria: null,
      ataquesPorAcao: 1
    };
    Object.keys(defaults).forEach(function(key) {
      if (profile[key] == null) profile[key] = defaults[key];
    });
    if (!profile.skillBonuses || typeof profile.skillBonuses !== "object") profile.skillBonuses = {};
    if (profile.skillBonuses["Percepção"] == null) profile.skillBonuses["Percepção"] = Number(profile.perception) || 0;
    if (profile.skillBonuses["Investigação"] == null) profile.skillBonuses["Investigação"] = Number(profile.investigation) || 0;
    if (profile.skillBonuses["Atletismo"] == null) profile.skillBonuses["Atletismo"] = Number(profile.athletics) || 0;
    if (previousConfigVersion !== 2) {
      if (profile.damage && profile.damage !== "1d8+0") profile.damageOverride = profile.damage;
      if (Number(profile.attackRange) === 6) profile.attackRange = 0;
      profile.weaponId = profile.weaponId || "";
      profile.configVersion = 2;
    }
    var sheet = getCharacterSheetActionData();
    if (sheet) {
      profile.useSheet = true;
      profile.perception = sheet.skillBonuses["Percepção"];
      profile.investigation = sheet.skillBonuses["Investigação"];
      profile.athletics = sheet.skillBonuses["Atletismo"];
      profile.tools = sheet.toolsBonus;
      player.percepcaoPassiva = sheet.passivePerception;
      profile.sheetName = sheet.name;
    }
    return profile;
  }

function normalizeRpgText(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

function invAtivo() {
    try {
      return typeof Inventario !== "undefined" && typeof S !== "undefined" && !!S && !!S.inventario && Array.isArray(S.inventario.itens) && S.inventario.itens.length > 0;
    } catch (e) {
      return false;
    }
  }

function invWeaponAsCatalog(it) {
    var items = window.ITEMS || [];
    var base = it.itemId && items.find(function(x) {
      return x.id === it.itemId;
    }) || items.find(function(x) {
      return x.categoria === "Armas" && x.n === it.nome;
    }) || null;
    var out = base ? Object.assign({}, base) : {
      n: it.nome,
      categoria: "Armas",
      tipo: it.distancia ? "Arma à distância" : "Arma corpo a corpo",
      uso: it.distancia ? "Ataque à distância" : "Ataque corpo a corpo",
      dano: it.dano || "1d4 contundente",
      propriedades: it.propriedades || "",
      maestria: it.maestria || ""
    };
    out.id = "inv:" + it.id;
    out._inv = it;
    return out;
  }

function invEquippedWeapons() {
    if (!invAtivo()) return [];
    var list = S.inventario.itens.filter(function(i) {
      return i.tipo === "arma" && i.equipado && !i.local;
    });
    list.sort(function(a, b) {
      return (a.equipado === "maoPrincipal" ? 0 : 1) - (b.equipado === "maoPrincipal" ? 0 : 1);
    });
    return list.map(invWeaponAsCatalog);
  }

function invWeaponProf(weapon, sheet) {
    if (!sheet) return 0;
    if (!weapon || !weapon._inv || typeof Inventario === "undefined") return sheet.proficiencyBonus;
    return Inventario.proficienteArma(sheet.className, weapon._inv) ? sheet.proficiencyBonus : 0;
  }

function invWeaponMagic(weapon) {
    return weapon && weapon._inv ? Number(weapon._inv.bonus) || 0 : 0;
  }

function invOpts() {
    return typeof INV_OPTS !== "undefined" ? INV_OPTS : { chaveLocal: "animalysson-inventario" };
  }

function invMov() {
    var sp = typeof S !== "undefined" && S && S.sp != null && typeof SP !== "undefined" ? SP[S.sp] : null;
    var m = String(sp && sp.mov || "9 m").match(/\d+(?:[.,]\d+)?/);
    return m ? parseFloat(m[0].replace(",", ".")) : 9;
  }

function invCtx() {
    var sc = function(k) {
      try {
        return typeof score === "function" ? score(k) : 10;
      } catch (e) {
        return 10;
      }
    };
    var sp = typeof S !== "undefined" && S && S.sp != null && typeof SP !== "undefined" ? SP[S.sp] : null;
    var cl = typeof S !== "undefined" && S && S.cls != null && typeof CL !== "undefined" ? CL[S.cls] : null;
    return { FOR: sc("FOR"), DES: sc("DES"), CON: sc("CON"), SAB: sc("SAB"), pb: 2, classe: cl ? cl.n : "", tamanho: sp ? sp.sz : "Médio", deslocamento: invMov() };
  }

function invStats() {
    if (typeof Inventario === "undefined" || typeof S === "undefined" || !S) return null;
    Inventario.carregar(S, invOpts());
    return Inventario.estatisticas(S, invCtx());
  }

function invSpeedMeters() {
    var base = invMov();
    var atual = base;
    var st = invStats();
    var montado = !!(st && st.montaria && Number(st.montaria.deslocamento) > 0);
    var pen = st ? st.penalidadeDeslocamento : 0;
    if (montado) atual = Number(st.montaria.deslocamento);
    else if (pen) atual = Math.max(1.5, base - pen);
    return { base, atual, montado, montaria: montado ? st.montaria.nome : "", penalidade: pen };
  }

function invOwnSpeedCells() {
    var m = invMov();
    var st = invStats();
    if (st && st.penalidadeDeslocamento) m = Math.max(0, m - st.penalidadeDeslocamento);
    return Math.max(1, Math.round(m / 1.5));
  }

function travelSpeedEffective() {
    var sp = invSpeedMeters();
    var ratio = sp.base > 0 ? sp.atual / sp.base : 1;
    if (travelSpeedMilesPerDay > 0) return Math.round(travelSpeedMilesPerDay * ratio * 10) / 10;
    if (typeof S === "undefined" || !S || S.cls == null) return 0;
    return Math.round(24 * sp.atual / 9 * 10) / 10;
  }

window.invDiagnostico = function() {
    var sp = invSpeedMeters();
    return {
      inventarioAtivo: invAtivo(),
      itensNoInventario: typeof S !== "undefined" && S && S.inventario ? S.inventario.itens.length : 0,
      velocidadeBaseM: sp.base,
      velocidadeAtualM: sp.atual,
      celulasPorTurno: Math.max(1, Math.round(sp.atual / 1.5)),
      montaria: sp.montaria || null,
      penalidadeForcaM: sp.penalidade,
      viagemMundoMiPorDia: travelSpeedEffective()
    };
  };

function playerWeaponCatalog() {
    var items = window.ITEMS || window.EQUIPMENT || [];
    return Array.isArray(items) ? items.filter(function(item) {
      return item && item.categoria === "Armas" && item.dano && !item.magico;
    }) : [];
  }

function playerCurrentWeapon(profile) {
    if (invAtivo()) {
      var eq = invEquippedWeapons();
      return eq.length ? eq[0] : null;
    }
    return playerWeaponById(profile.weaponId);
  }

function playerWeaponById(id) {
    if (!id) return null;
    if (String(id).indexOf("inv:") === 0) return invEquippedWeapons().find(function(w) {
      return w.id === id;
    }) || null;
    return playerWeaponCatalog().find(function(item) {
      return item.id === id;
    }) || null;
  }

function playerWeaponRange(item, weaponMode) {
    var props = normalizeRpgText(item && item.propriedades || "");
    var use = normalizeRpgText((item && item.uso || "") + " " + (item && item.tipo || ""));
    var ammo = props.match(/Municao\s*\(\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*([0-9]+(?:[.,][0-9]+)?)\s*m/i);
    var thrown = props.match(/Arremesso\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*([0-9]+(?:[.,][0-9]+)?)\s*m/i);
    function cells(meters) {
      return Math.max(1, Math.ceil(Number(String(meters).replace(",", ".")) / 1.5));
    }
    if (ammo) return { normal: cells(ammo[1]), max: cells(ammo[2]), ranged: true, thrown: false };
    var listedAsRanged = /a distancia|ataque a distancia/.test(use);
    if (thrown && (listedAsRanged || weaponMode === "thrown")) {
      return { normal: cells(thrown[1]), max: cells(thrown[2]), ranged: listedAsRanged, thrown: true };
    }
    var reach = props.indexOf("alcance") >= 0 ? 2 : 1;
    return { normal: reach, max: reach, ranged: listedAsRanged, thrown: !!thrown };
  }

function playerWeaponDamageDice(item) {
    var raw = String(item && item.dano || "");
    var match = raw.match(/(?:^|\s)(\d*d\d+|\d+)(?=\s|$)/i);
    return match ? match[1] : "";
  }

function resolvePlayerAttackData(player, profile) {
    var sheet = getCharacterSheetActionData();
    var weapon = playerCurrentWeapon(profile);
    if (!weapon) return {
      weapon: null,
      sheet,
      bonus: sheet ? sheet.meleeAttack : Number(profile.attack) || 0,
      damage: String(profile.damageOverride || profile.damage || "1d8+0"),
      normalRange: Number(profile.attackRange) || 6,
      maxRange: Number(profile.attackRange) || 6,
      ranged: false,
      ability: "FOR"
    };
    var range = playerWeaponRange(weapon, profile.weaponMode);
    var props = normalizeRpgText(weapon.propriedades || "");
    var finesse = props.indexOf("acuidade") >= 0;
    var ability = range.ranged ? "DES" : "FOR";
    if (finesse && sheet) ability = sheet.abilityMods.DES > sheet.abilityMods.FOR ? "DES" : "FOR";
    var abilityMod = sheet ? sheet.abilityMods[ability] : 0;
    var dice = playerWeaponDamageDice(weapon) || "1d4";
    var derivedMod = abilityMod + invWeaponMagic(weapon);
    var derivedDamage = dice + (derivedMod > 0 ? "+" + derivedMod : derivedMod < 0 ? String(derivedMod) : "");
    var customRange = Number(profile.attackRange) > 0;
    return {
      weapon,
      sheet,
      bonus: sheet ? abilityMod + invWeaponProf(weapon, sheet) + invWeaponMagic(weapon) : Number(profile.attack) || 0,
      damage: String(profile.damageOverride || derivedDamage),
      normalRange: customRange ? Number(profile.attackRange) : range.normal,
      maxRange: customRange ? Number(profile.attackRange) : range.max,
      ranged: range.ranged,
      thrown: range.thrown,
      ability,
      abilityMod
    };
  }

function playerSkillOptionsHtml() {
    return Object.keys(RPG_SKILL_ABILITIES).map(function(skill) {
      return '<option value="' + esc(skill) + '">' + esc(skill) + " (" + RPG_SKILL_ABILITIES[skill] + ")</option>";
    }).join("");
  }

function rollDie(sides) {
    var n = Math.max(2, Number(sides) || 20);
    var v = 1 + Math.floor(Math.random() * n);
    if (window.Dados3D) window.Dados3D.lancar(n, v);
    return v;
  }

function rollCheck(bonus) {
    var die = rollDie(20), mod = Number(bonus) || 0;
    return { die, bonus: mod, total: die + mod };
  }

function rollDamageExpression(expression, critical) {
    var raw = String(expression || "1d8").trim();
    var constant = raw.match(/^([0-9]+)\s*([+-]\s*\d+)?$/);
    if (constant) {
      var flat = Number(constant[1]) + (Number(String(constant[2] || "0").replace(/\s/g, "")) || 0);
      return { rolls: [], modifier: 0, total: Math.max(0, flat), formula: raw, critical: !!critical };
    }
    var match = raw.match(/^\s*(\d*)d(\d+)\s*([+-]\s*\d+)?\s*$/i);
    if (!match) return null;
    var count = Math.max(1, Math.min(20, Number(match[1] || 1)));
    var sides = Math.max(2, Math.min(100, Number(match[2] || 8)));
    var modifier = Number(String(match[3] || "0").replace(/\s/g, "")) || 0;
    var rolls = [];
    for (var i = 0; i < count; i++) rolls.push(rollDie(sides));
    var diceTotal = rolls.reduce(function(sum, value) {
      return sum + value;
    }, 0);
    return { rolls, modifier, total: diceTotal * (critical ? 2 : 1) + modifier, formula: count + "d" + sides + (modifier ? (modifier > 0 ? "+" : "") + modifier : ""), critical: !!critical };
  }

function playerVisionRadius(player) {
    return Math.max(1, Number(player && player.luz) || Number(lightRadius) || 6);
  }

function edgeInPlayerVision(edge, player, range) {
    if (!edge || !player || isHexMap()) return false;
    var cells = [];
    if (edge.custom) {
      var c = edge.custom, mid = edgeMidpoint(edge);
      var ex = c.x2 - c.x1, ey = c.y2 - c.y1, len = Math.sqrt(ex * ex + ey * ey) || 1;
      var nx = -ey / len * CELL * 0.3, ny = ex / len * CELL * 0.3;
      cells.push(worldToCell(mid.x + nx, mid.y + ny), worldToCell(mid.x - nx, mid.y - ny), worldToCell(mid.x, mid.y));
    } else if (edge.dir === "h") {
      cells.push({ x: edge.x, y: edge.yEdge - 1 }, { x: edge.x, y: edge.yEdge });
    } else {
      cells.push({ x: edge.xEdge - 1, y: edge.y }, { x: edge.xEdge, y: edge.y });
    }
    return cells.some(function(cell) {
      return cell && cell.x >= 0 && cell.y >= 0 && cell.x < COLS && cell.y < ROWS && isCurrentlyVisible(cell.x, cell.y, player.x, player.y, range) && hasLOS(player.x, player.y, cell.x, cell.y);
    });
  }

function visibleEdgesForPlayer(player, range) {
    if (!player || isHexMap()) return [];
    return nearbyEdgesForCell({ x: player.x, y: player.y }, range + 0.5).filter(function(item) {
      return item.val !== EDGE_NONE && edgeInPlayerVision(item.edge, player, range);
    });
  }

var chatFree = 0;

function postRollChat(title, lines, buttons, done) {
    var now = Date.now();
    var at = Math.max(now, chatFree, actionBusy && now < actionBusy.until ? actionBusy.until + 300 : 0);
    chatFree = at + 1;
    function run() {
      window.ChatRolagens.postar(title, lines, buttons, done);
    }
    if (at <= now) run();
    else window.setTimeout(run, at - now);
  }

function playerActionResult(title, lines) {
    postRollChat(title, lines);
  }
