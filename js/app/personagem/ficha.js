function vFicha() {
  const c = S.cls !== null ? CL[S.cls] : null;
  const sp = S.sp !== null ? SP[S.sp] : null;
  const b = S.bg !== null ? BG[S.bg] : null;
  const pb = c ? 2 : 0;
  const prof =  new Set([...S.skills, ...b ? b.s : []]);
  const hp = c ? Math.max(1, c.d + mod(score("CON"))) : 0;
  const ac = c ? window.Inventario ? Inventario.calcularCA(Inventario.carregar(S, INV_OPTS).itens, invCtx()) : 10 + mod(score("DES")) : 0;
  const per = 10 + mod(score("SAB")) + (prof.has("Percepção") ? pb : 0);
  const ini = fmt(mod(score("DES")));
  let h = `<div class="ficha">
  <div class="f-top">
   <div class="box f-fields">
    <div class="f-field clickable" onclick="openModal('ident')"><span class="edit">editar</span><span class="lbl">Nome do personagem</span><span class="val">${S.name || "—"}</span></div>
    <div class="row2">
     <div class="f-field clickable" onclick="openModal('bg')"><span class="edit">editar</span><span class="lbl">Origem</span><span class="val">${b ? b.n : "—"}</span></div>
     <div class="f-field clickable" onclick="openModal('cls')"><span class="edit">editar</span><span class="lbl">Classe</span><span class="val">${c ? c.n : "—"}</span></div>
    </div>
    <div class="row2">
     <div class="f-field clickable" onclick="openModal('sp')"><span class="edit">editar</span><span class="lbl">Espécie</span><span class="val">${sp ? sp.n : "—"}</span></div>
     <div class="f-field"><span class="lbl">Nível</span><span class="val">${c ? 1 : 0}</span></div>
    </div>
   </div>
   <div class="box f-combat">
    <div class="f-ac"><span class="lbl">CA</span><div class="big">${ac}</div></div>
    <div class="f-hp">
     <div class="cell"><span class="lbl">PV atuais</span><div class="big">${hp}</div></div>
     <div class="cell"><span class="lbl">PV máx.</span><div class="big">${hp}</div></div>
     <div class="cell" style="grid-column:1/-1"><span class="lbl">Dado de vida</span><div class="big">${c ? "1d" + c.d : "0"}</div></div>
    </div>
    <div class="f-ac"><span class="lbl">Bônus prof.</span><div class="big">${fmt(pb)}</div></div>
   </div>
   <div class="box" style="display:flex;flex-direction:column;gap:6px">
    <div class="f-field clickable" onclick="openModal('align')"><span class="edit">editar</span><span class="lbl">Alinhamento</span><span class="val">${S.align || "—"}</span></div>
    <div class="f-field clickable" onclick="openModal('lang')"><span class="edit">editar</span><span class="lbl">Idiomas</span><span class="val">Comum${S.lang.length ? ", " + S.lang.join(", ") : ""}</span></div>
   </div>
  </div>

  <div class="f-mid">
   <div class="f-abilities">
    ${AB.map((a) => {
    const sc = score(a), m = mod(sc), ps = c ? c.s.includes(a) : false;
    return `<div class="box clickable ability" onclick="openModal('atr')">
        <span class="edit">editar</span>
        <div class="name">${ABN[a].toUpperCase()}</div>
        <div class="score">${sc}</div>
        <div class="mod">${fmt(m)}</div>
        <div class="sv"><span class="dot${ps ? " p" : ""}"></span>salv. ${fmt(m + (ps ? pb : 0))}</div>
      </div>`;
  }).join("")}
   </div>
   <div class="f-center">
    <div class="f-stats-row">
     <div class="box"><span class="lbl">Iniciativa</span><div class="big">${ini}</div></div>
     <div class="box clickable" onclick="openModal('sp')"><span class="edit">editar</span><span class="lbl">Deslocamento</span><div class="big">${movFicha(sp)}</div></div>
     <div class="box clickable" onclick="openModal('sp')"><span class="edit">editar</span><span class="lbl">Tamanho</span><div class="big" style="font-size:.95rem">${sp ? sp.sz : "—"}</div></div>
     <div class="box"><span class="lbl">Percepção passiva</span><div class="big">${per}</div></div>
    </div>
    <div class="box clickable f-skills" onclick="openModal('per')">
     <span class="edit">editar</span>
     <div class="skill-col">
      ${["Acrobacia", "Adestrar Animais", "Arcanismo", "Atletismo", "Atuação", "Enganação", "Furtividade", "História", "Intimidação"].map((k) => {
    const p = prof.has(k);
    return `<div class="skill-row"><span class="dot${p ? " p" : ""}"></span><span class="nm">${k}</span><span class="bon">${fmt(mod(score(SK[k])) + (p ? pb : 0))}</span></div>`;
  }).join("")}
     </div>
     <div class="skill-col">
      ${["Intuição", "Investigação", "Medicina", "Natureza", "Percepção", "Persuasão", "Prestidigitação", "Religião", "Sobrevivência"].map((k) => {
    const p = prof.has(k);
    return `<div class="skill-row"><span class="dot${p ? " p" : ""}"></span><span class="nm">${k}</span><span class="bon">${fmt(mod(score(SK[k])) + (p ? pb : 0))}</span></div>`;
  }).join("")}
     </div>
    </div>
    <div class="f-bottom">
     <div class="box clickable f-features" onclick="openModal('bg')">
      <span class="edit">editar</span>
      <span class="lbl">Talentos / Antecedente</span>
      ${b ? `<p><b>${b.n}</b> — ${b.f}</p><p>Perícias: ${b.s.join(" e ")}</p><p>Ferramenta: ${b.i}</p>` : "<p>—</p>"}
     </div>
    </div>
    <div class="box clickable f-features" onclick="openModal('cls')">
     <span class="edit">editar</span>
     <span class="lbl">Características de classe</span>
     ${c ? `<p><b>${c.n}</b> — ${CLD[c.n]}</p><p>Dado de vida d${c.d} · Salvaguardas ${c.s.map((a) => ABN[a]).join(", ")} · Atributo principal: ${c.p}</p>${SC[c.n] ? `<p>Conjuração (${ABN[SC[c.n]]}): CD ${8 + mod(score(SC[c.n])) + pb} · ataque ${fmt(mod(score(SC[c.n])) + pb)}</p>` : ""}` : "<p>—</p>"}
    </div>
    <div class="box">
     <span class="lbl">Ataques</span>
     <p>Corpo a corpo: ${fmt(mod(score("FOR")) + pb)} · À distância: ${fmt(mod(score("DES")) + pb)}</p>${equippedAttacksHtml(pb)}
    </div>
   </div>
  </div>
 </div>`;
  return h;
}
function renderCharacterPage() {
  const dado = '<div class="ficha-acoes"><button class="sortear-dado" onclick="rand()" title="Sortear personagem" aria-label="Sortear personagem">🎲</button></div>';
  document.getElementById("app").innerHTML = dado + vFicha();
  renderModal();
}
