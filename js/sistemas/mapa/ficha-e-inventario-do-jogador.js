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
    if (it.armaTocha || it.itemId === "equip-140" || normalizeRpgText(it.nome) === "tocha") {
      out.n = it.nome || "Tocha";
      out.categoria = "Armas";
      out.tipo = "Arma corpo a corpo simples";
      out.uso = "Ataque corpo a corpo";
      out.dano = "1";
      out.propriedades = "simples";
      out.maestria = "";
      out.distancia = false;
      out._armaTocha = true;
    }
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
