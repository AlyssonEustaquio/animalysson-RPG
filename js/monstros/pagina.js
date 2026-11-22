let MONSTER_QUERY = "";
let MONSTER_TYPE = "Todos";
let SELECTED_MONSTER_ID = null;
let MONSTER_CACHE = [];
function monsterTypeList() {
  return ["Todos"].concat(Array.from(new Set((MONSTER_CACHE || []).map(function(m) {
    return m.tipo || "Outros";
  }))).sort(function(a, b) {
    return a.localeCompare(b, "pt-BR");
  }));
}
function filteredMonsters() {
  const q = norm(MONSTER_QUERY);
  return MONSTER_CACHE.map(function(m, index) {
    return { monster: m, index };
  }).filter(function(row) {
    const m = row.monster;
    const hay = norm([m.nome, m.nomePt, m.nomeEn, m.tipo, m.tamanho, m.nd].filter(Boolean).join(" "));
    return (!q || hay.includes(q)) && (MONSTER_TYPE === "Todos" || m.tipo === MONSTER_TYPE);
  }).sort(function(a, b) {
    return String(a.monster.nome || "").localeCompare(String(b.monster.nome || ""), "pt-BR");
  });
}
function monsterAttrEntries(m) {
  const a = m.atributos || {};
  const pairs = [["Força", ["strength", "str", "for"]], ["Destreza", ["dexterity", "dex", "des"]], ["Constituição", ["constitution", "con", "con"]], ["Inteligência", ["intelligence", "int", "int"]], ["Sabedoria", ["wisdom", "wis", "sab"]], ["Carisma", ["charisma", "cha", "car"]]];
  return pairs.map(function(pair) {
    let val = "—";
    for (const key of pair[1]) {
      if (a[key] !== void 0) {
        val = a[key];
        break;
      }
    }
    return { name: pair[0], value: val };
  });
}
function renderMonsterCard(row) {
  const m = row.monster;
  return `<button class="catalog-card${(m.id || m.nomeEn) === SELECTED_MONSTER_ID ? " sel" : ""}" onclick="selectMonster(${row.index})"><div class="card-topline"><span class="card-icon">♜</span><span class="card-tag">${m.personalizado ? escHtml(m.categoria || "Personalizado") + " · " : m.editado ? "Editado · " : ""}ND ${escHtml(m.nd || "—")}</span></div><strong>${escHtml(m.nome || "Criatura")}</strong><small>${escHtml(m.tipo || "")}</small><div class="card-stats"><span>CA ${escHtml(m.classeArmadura ?? "—")}</span><span>PV ${escHtml(m.pontosVida ?? "—")}</span><span>${escHtml(m.tamanho || "")}</span></div></button>`;
}
function formatMonsterValue(value, context) {
  if (value === null || value === void 0 || value === "") return "—";
  if (Array.isArray(value)) return value.map(function(v) {
    return formatMonsterValue(v, context);
  }).join(", ");
  if (typeof value === "object") return Object.entries(value).map(function(pair) {
    let k = pair[0];
    const maps = {
      saving: { str: "Força", dex: "Destreza", con: "Constituição", int: "Inteligência", wis: "Sabedoria", cha: "Carisma" },
      skills: { acrobatics: "Acrobacia", animal_handling: "Adestrar Animais", arcana: "Arcanismo", athletics: "Atletismo", deception: "Enganação", history: "História", insight: "Intuição", intimidation: "Intimidação", investigation: "Investigação", medicine: "Medicina", nature: "Natureza", perception: "Percepção", performance: "Atuação", persuasion: "Persuasão", religion: "Religião", sleight_of_hand: "Prestidigitação", stealth: "Furtividade", survival: "Sobrevivência" },
      senses: { darkvision: "Visão no escuro", blindsight: "Percepção às cegas", truesight: "Visão verdadeira", tremorsense: "Percepção sísmica", passive_perception: "Percepção passiva" },
      speed: { walk: "Deslocamento", climb: "Escalada", fly: "Voo", swim: "Natação", burrow: "Escavação" }
    };
    if (maps[context] && maps[context][k]) k = maps[context][k];
    else if (context === "damage") k = { "acid": "Ácido", "bludgeoning": "Contundente", "cold": "Frio", "fire": "Fogo", "force": "Energia", "lightning": "Elétrico", "necrotic": "Necrótico", "piercing": "Perfurante", "poison": "Veneno", "psychic": "Psíquico", "radiant": "Radiante", "slashing": "Cortante", "thunder": "Trovejante" }[k] || k;
    let v = pair[1];
    if (context === "speed" && typeof v === "number") v = Math.round(v * 0.3 * 10) / 10 + " m";
    return `<span>${escHtml(k)}: ${formatMonsterValue(v)}</span>`;
  }).join(" · ");
  if (typeof value === "string") {
    const langs = { Common: "Comum", Draconic: "Dracônico", Dwarvish: "Anão", Elvish: "Élfico", Giant: "Gigante", Gnomish: "Gnômico", Goblin: "Goblin", Halfling: "Halfling", Orc: "Orc", Abyssal: "Abissal", Celestial: "Celestial", "Deep Speech": "Dialeto Obscuro", Infernal: "Infernal", Primordial: "Primordial", Sylvan: "Silvestre", Undercommon: "Subcomum" };
    const damage = { acid: "ácido", bludgeoning: "contundente", cold: "frio", fire: "fogo", force: "energia", lightning: "elétrico", necrotic: "necrótico", piercing: "perfurante", poison: "veneno", psychic: "psíquico", radiant: "radiante", slashing: "cortante", thunder: "trovejante" };
    return escHtml(langs[value] || damage[value] || value);
  }
  return escHtml(value);
}
function renderMonsterEntries(title, entries) {
  if (!Array.isArray(entries) || !entries.length) return "";
  return `<h3>${escHtml(title)}</h3><div class="detail-entries">${entries.map(function(entry) {
    if (typeof entry === "string") return `<div class="detail-entry"><p>${escHtml(entry)}</p></div>`;
    const name = entry.name || entry.title || entry.nome || "";
    const desc = entry.desc || entry.description || entry.text || entry.value || "";
    const extras = Object.keys(entry).filter((k) => !["name", "title", "nome", "desc", "description", "text", "value"].includes(k)).map((k) => `${escHtml(k)}: ${formatMonsterValue(entry[k])}`).join(" · ");
    return `<div class="detail-entry">${name ? `<b>${escHtml(name)}</b>` : ""}${desc ? `<p>${escHtml(desc)}</p>` : ""}${extras ? `<p>${extras}</p>` : ""}</div>`;
  }).join("")}</div>`;
}
function renderMonsterDetail(m) {
  if (!m) return '<div class="empty-state">Clique em um monstro para abrir sua ficha.</div>';
  let h = `<div class="card-topline"><span class="card-icon">♜</span><span class="card-tag">ND ${escHtml(m.nd || "—")}</span></div><div class="row" style="margin:10px 0 0"><button class="btn" onclick="Bestiary.edit(${escHtml(JSON.stringify(m.id))})">✎ Editar monstro/NPC</button><button class="btn alt" onclick="Bestiary.create()">＋ Novo</button></div><h2 style="margin-top:10px">${escHtml(m.nome || m.nomeEn)}</h2><p class="detail-sub">${escHtml(m.tamanho || "")} ${escHtml(m.tipo || "")}</p><div class="detail-grid"><div class="detail-stat"><b>${escHtml(m.classeArmadura ?? "—")}</b><small>Classe de Armadura</small></div><div class="detail-stat"><b>${escHtml(m.pontosVida ?? "—")}</b><small>Pontos de Vida</small></div><div class="detail-stat"><b>${escHtml(m.nd || "—")}</b><small>Nível de Desafio</small></div></div>`;
  h += `<div class="detail-line"><b>Iniciativa:</b> ${formatMonsterValue(m.iniciativa)}</div><div class="detail-line"><b>Deslocamento:</b> ${formatMonsterValue(m.deslocamento)}</div>`;
  h += '<h3>Atributos</h3><div class="detail-grid">' + monsterAttrEntries(m).map(function(a) {
    return `<div class="detail-stat"><b>${escHtml(a.value)}</b><small>${escHtml(a.name)}</small></div>`;
  }).join("") + "</div>";
  [["Salvaguardas", m.salvaguardas, "saving"], ["Perícias", m.pericias, "skills"], ["Sentidos", m.sentidos, "senses"], ["Idiomas", m.idiomas, "languages"], ["Resistências a dano", m.resistenciasDano, "damage"], ["Vulnerabilidades a dano", m.vulnerabilidadesDano, "damage"], ["Imunidades a dano", m.imunidadesDano, "damage"], ["Imunidades a condições", m.imunidadesCondicao, "conditions"]].forEach(function(pair) {
    if (pair[1] && (Array.isArray(pair[1]) && pair[1].length || !Array.isArray(pair[1]) && Object.keys(pair[1]).length)) h += `<div class="detail-line"><b>${escHtml(pair[0])}:</b> ${formatMonsterValue(pair[1], pair[2])}</div>`;
  });
  h += renderMonsterEntries("Características", m.tracos);
  h += renderMonsterEntries("Ações", m.acoes);
  h += renderMonsterEntries("Ações bônus", m.acoesBonus);
  h += renderMonsterEntries("Reações", m.reacoes);
  h += renderMonsterEntries("Ações lendárias", m.acoesLendarias);
  return h;
}
function updateMonsterResults() {
  const rows = filteredMonsters();
  const count = document.getElementById("monsters-count"), grid = document.getElementById("monsters-grid"), detail = document.getElementById("monster-detail");
  if (count) count.textContent = rows.length + " de " + MONSTER_CACHE.length + " criaturas";
  if (grid) grid.innerHTML = rows.length ? rows.map(renderMonsterCard).join("") : '<div class="empty-state">Nenhum monstro encontrado.</div>';
  let selected = MONSTER_CACHE.find(function(m) {
    return (m.id || m.nomeEn) === SELECTED_MONSTER_ID;
  });
  if (rows.length && !rows.some(function(row) {
    return (row.monster.id || row.monster.nomeEn) === SELECTED_MONSTER_ID;
  })) {
    selected = rows[0].monster;
    SELECTED_MONSTER_ID = selected.id || selected.nomeEn;
  }
  if (!selected && rows.length) {
    selected = rows[0].monster;
    SELECTED_MONSTER_ID = selected.id || selected.nomeEn;
  }
  if (detail) detail.innerHTML = renderMonsterDetail(selected);
}
function selectMonster(index) {
  const m = MONSTER_CACHE[index];
  if (!m) return;
  SELECTED_MONSTER_ID = m.id || m.nomeEn;
  updateMonsterResults();
}
function monsterSearch(value) {
  MONSTER_QUERY = value;
  updateMonsterResults();
}
function monsterType(value) {
  MONSTER_TYPE = value;
  updateMonsterResults();
}
async function renderMonstersPage() {
  const types = monsterTypeList();
  let h = `<div class="catalog-head"><div><h2>Monstros</h2><p>Selecione uma criatura para abrir sua ficha e suas ações.</p></div><span class="card-tag">${MONSTER_CACHE.length || "…"} criaturas</span><button class="btn" onclick="Bestiary.create()">＋ Novo monstro/NPC</button></div><div class="catalog-tools"><input type="search" placeholder="Buscar monstro por nome, tipo ou ND…" value="${escHtml(MONSTER_QUERY)}" oninput="monsterSearch(this.value)"><select onchange="monsterType(this.value)">${types.map((t) => `<option value="${escHtml(t)}"${t === MONSTER_TYPE ? " selected" : ""}>${escHtml(t)}</option>`).join("")}</select></div><div id="monsters-count" class="catalog-count">Carregando bestiário…</div><div class="catalog-layout"><section><div class="catalog-grid" id="monsters-grid"><div class="empty-state">Carregando bestiário…</div></div></section><aside class="catalog-detail" id="monster-detail"><div class="empty-state">As fichas aparecerão aqui quando o catálogo terminar de carregar.</div></aside></div>`;
  document.getElementById("app").innerHTML = h;
  renderModal();
  try {
    if (window.MONSTERS_READY) MONSTER_CACHE = await window.MONSTERS_READY;
    else MONSTER_CACHE = window.MONSTERS || [];
    if (ACTIVE_VIEW === "monsters") {
      const sel2 = document.querySelector(".catalog-tools select");
      if (sel2) {
        const keep = MONSTER_TYPE;
        sel2.innerHTML = monsterTypeList().map((t) => `<option value="${escHtml(t)}"${t === keep ? " selected" : ""}>${escHtml(t)}</option>`).join("");
      }
      updateMonsterResults();
      const counter = document.querySelector(".catalog-head .card-tag");
      if (counter) counter.textContent = MONSTER_CACHE.length + " criaturas";
    }
  } catch (e) {
    const grid = document.getElementById("monsters-grid");
    if (grid) grid.innerHTML = '<div class="empty-state">Não foi possível abrir o bestiário.</div>';
  }
}
