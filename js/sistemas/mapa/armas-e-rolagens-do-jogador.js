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
var PLAYER_SKILL_STORAGE_KEY = "animalysson-rpg-player-skill";
var playerSelectedSkill = (function() {
    try {
      var saved = localStorage.getItem(PLAYER_SKILL_STORAGE_KEY);
      if (saved && Object.prototype.hasOwnProperty.call(RPG_SKILL_ABILITIES, saved)) return saved;
    } catch (e) {
    }
    return "Percepção";
  })();
function setPlayerSkillSelection(skill) {
    var selected = Object.prototype.hasOwnProperty.call(RPG_SKILL_ABILITIES, String(skill || "")) ? String(skill) : "Percepção";
    playerSelectedSkill = selected;
    try {
      localStorage.setItem(PLAYER_SKILL_STORAGE_KEY, selected);
    } catch (e) {
    }
    return selected;
  }
function playerSkillOptionsHtml() {
    return Object.keys(RPG_SKILL_ABILITIES).map(function(skill) {
      var selected = skill === playerSelectedSkill;
      return '<button type="button" class="mp-player-skill-option' + (selected ? ' selected' : '') + '" role="option" data-player-skill-option="' + esc(skill) + '" aria-selected="' + (selected ? 'true' : 'false') + '"><span>' + esc(skill) + '</span><small>' + esc(RPG_SKILL_ABILITIES[skill]) + '</small></button>';
    }).join("");
  }
function updatePlayerSkillDropdown() {
    var trigger = R && R.querySelector ? R.querySelector("#mp-player-skill") : null;
    var value = R && R.querySelector ? R.querySelector("#mp-player-skill-value") : null;
    var options = R && R.querySelector ? R.querySelector("#mp-player-skill-options") : null;
    var selected = setPlayerSkillSelection(playerSelectedSkill);
    if (value) value.textContent = selected;
    if (trigger) trigger.setAttribute("aria-label", "Escolher perícia. Selecionada: " + selected);
    if (options) {
      options.querySelectorAll("[data-player-skill-option]").forEach(function(option) {
        var isSelected = option.getAttribute("data-player-skill-option") === selected;
        option.classList.toggle("selected", isSelected);
        option.setAttribute("aria-selected", isSelected ? "true" : "false");
      });
    }
  }
function setPlayerSkillDropdownOpen(open) {
    var trigger = R && R.querySelector ? R.querySelector("#mp-player-skill") : null;
    var options = R && R.querySelector ? R.querySelector("#mp-player-skill-options") : null;
    if (!trigger || !options) return;
    var isOpen = !!open;
    trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    trigger.classList.toggle("open", isOpen);
    options.hidden = !isOpen;
  }
function rollDie(sides) {
    var n = Math.max(2, Number(sides) || 20);
    var previsto = window.Dados3D ? window.Dados3D.consumir(n) : null;
    if (previsto != null) return previsto;
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
    return Math.max(1, typeof creativeGetVisibilityRadius === "function" ? creativeGetVisibilityRadius(player, player && player.x, player && player.y) : Number(player && player.luz) || Number(lightRadius) || 6);
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
function postRollChat(title, lines, buttons, done) {
    function run() {
      window.ChatRolagens.postar(title, lines, buttons, done);
    }
    if (window.Dados3D) window.Dados3D.aoTerminar(run);
    else run();
  }
function playerActionResult(title, lines) {
    postRollChat(title, lines);
  }
