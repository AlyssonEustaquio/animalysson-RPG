function openModal(m) {
  S.modal = m;
  render();
}
function closeModal() {
  S.modal = null;
  render();
}
function vAtr() {
  const ass = S.method === "std" || S.method === "rnd";
  let h = `<h2>Valores de atributo</h2><div class="row"><label>Método<select onchange="set('method',this.value)"><option value="std"${S.method === "std" ? " selected" : ""}>Conjunto padrão</option><option value="rnd"${S.method === "rnd" ? " selected" : ""}>Aleatório (4d6)</option><option value="pb"${S.method === "pb" ? " selected" : ""}>Compra de pontos</option><option value="man"${S.method === "man" ? " selected" : ""}>Manual</option></select></label></div>`;
  if (S.method === "pb") h += `<p>Pontos restantes: <b>${27 - spent()}</b></p>`;
  if (S.method === "std" && S.cls !== null) h += `<p><button class="btn alt" onclick="suggest()">Sugestão para ${CL[S.cls].n}</button></p>`;
  if (S.method === "rnd") h += `<p><button class="btn alt" onclick="roll6()">${S.rolled.length ? "Rolar de novo" : "Rolar atributos"}</button> ${S.rolled.length ? "Resultado: " + S.rolled.join(", ") : ""}</p>`;
  if (ass && S.method === "rnd" && !S.rolled.length) h += '<p class="warn">Role os atributos.</p>';
  if (ass && (S.rolled.length || S.method === "std") && !stdOk() && AB.some((a) => S.std[a])) h += '<p class="warn">Use cada valor uma vez.</p>';
  h += '<div class="ab">';
  AB.forEach((a) => {
    const t = score(a), b = bonus(a);
    let c = "";
    if (ass) c = sel("s" + a, [...new Set(pool())].map((v) => [v, v]), S.std[a], `mapset('std','${a}',this.value)`, "–");
    else if (S.method === "pb") c = `<button class="pm" onclick="pm('${a}',-1)"${S.pb[a] <= 8 ? " disabled" : ""}>−</button><b>${S.pb[a]}</b><button class="pm" onclick="pm('${a}',1)"${S.pb[a] >= 15 || spent() + (COST[S.pb[a] + 1] - COST[S.pb[a]]) > 27 ? " disabled" : ""}>+</button>`;
    else c = `<input type="number" min="3" max="18" value="${S.man[a]}" onchange="mapset('man','${a}',this.value)">`;
    h += `<div class="abc"><div>${ABN[a]}</div><div class="v">${t}</div><div class="m">mod ${fmt(mod(t))}${b ? ` · origem +${b}` : ""}</div><div class="ctl">${c}</div></div>`;
  });
  return h + "</div>";
}
function vPer() {
  const c = CL[S.cls];
  let h = `<h2>Perícias de ${c.n}</h2><p>Escolha ${c.k}. Selecionadas: ${S.skills.length}/${c.k}.</p><div class="sk">`;
  c.l.forEach((k) => {
    const lock = bgSk().includes(k), on = lock || S.skills.includes(k);
    h += `<label class="${lock ? "lock" : ""}"><input type="checkbox" ${on ? "checked" : ""} ${lock || !on && S.skills.length >= c.k ? "disabled" : ""} onchange="togSkill('${k}')">${k} (${SK[k]})</label>`;
  });
  return h + "</div>";
}
function modalIdent() {
  return `<h2>Identidade</h2>
  <label>Nome<br><input style="width:100%" value="${(S.name || "").replace(/"/g, "&quot;")}" oninput="S.name=this.value"></label>
  <p style="margin-top:12px;color:var(--mute)">Espécie, classe e origem têm seções próprias na ficha.</p>
  <div class="modal-actions"><button class="btn" onclick="closeModal()">Concluir</button></div>`;
}
function modalSp() {
  let h = `<h2>Espécie</h2>
  <div class="side" style="max-height:45vh">`;
  SP.forEach((s, i) => {
    h += `<button class="item${S.sp === i ? " sel" : ""}" onclick="set('sp',${i})"><span>${s.n}</span></button>`;
  });
  h += `</div><div class="modal-actions"><button class="btn" onclick="closeModal()">Concluir</button></div>`;
  return h;
}
function modalCls() {
  let h = `<h2>Classe</h2><div class="side" style="max-height:50vh">`;
  CL.forEach((c, i) => h += `<button class="item${S.cls === i ? " sel" : ""}" onclick="set('cls',${i})"><span>${c.n}</span></button>`);
  if (S.cls !== null) {
    const c = CL[S.cls];
    h += `</div><div class="info"><p>${CLD[c.n]}</p><p>d${c.d} · ${c.p}</p></div>`;
  } else h += "</div>";
  h += `<div class="modal-actions"><button class="btn" onclick="closeModal()">Concluir</button></div>`;
  return h;
}
function modalBg() {
  let h = `<h2>Antecedente</h2><div class="side" style="max-height:40vh">`;
  BG.forEach((b, i) => h += `<button class="item${S.bg === i ? " sel" : ""}" onclick="set('bg',${i})"><span>${b.n}</span></button>`);
  h += "</div>";
  if (S.bg !== null) {
    const b = BG[S.bg], o = b.a.map((a) => [a, ABN[a]]);
    h += `<div class="info"><p><b>${b.f}</b></p><p>${b.s.join(" e ")} · ${b.i}</p></div>
  <div class="row"><label>Bônus<select onchange="set('mode',this.value)"><option value="21"${S.mode === "21" ? " selected" : ""}>+2 e +1</option><option value="111"${S.mode === "111" ? " selected" : ""}>+1 nos três</option></select></label>`;
    if (S.mode === "21") h += `<label>+2${sel("p2", o, S.p2, "set('p2',this.value)", "?")}</label><label>+1${sel("p1", o, S.p1, "set('p1',this.value)", "?")}</label>`;
    h += "</div>";
  }
  h += `<div class="modal-actions"><button class="btn" onclick="closeModal()">Concluir</button></div>`;
  return h;
}
function modalAtr() {
  return `<h2>Atributos</h2>${vAtr()}<div class="modal-actions"><button class="btn" onclick="closeModal()">Concluir</button></div>`;
}
function modalPer() {
  if (S.cls === null) return `<h2>Perícias</h2><p>Escolha uma classe primeiro.</p><div class="modal-actions"><button class="btn" onclick="closeModal()">Fechar</button></div>`;
  return `<h2>Perícias</h2>${vPer()}<div class="modal-actions"><button class="btn" onclick="closeModal()">Concluir</button></div>`;
}
function modalAlign() {
  let h = '<h2>Alinhamento</h2><div class="grid">';
  ALN.forEach((a) => h += `<button class="opt${S.align === a ? " sel" : ""}" onclick="set('align','${a}')"><b>${a}</b></button>`);
  return h + '</div><div class="modal-actions"><button class="btn" onclick="closeModal()">Concluir</button></div>';
}
function modalLang() {
  let h = `<h2>Idiomas</h2><p>Comum + 2. Selecionados: ${S.lang.length}/2.</p><div class="sk">`;
  LANG.forEach((l) => {
    const on = S.lang.includes(l);
    h += `<label><input type="checkbox" ${on ? "checked" : ""} ${!on && S.lang.length >= 2 ? "disabled" : ""} onchange="const i=S.lang.indexOf('${l}');if(i>=0)S.lang.splice(i,1);else if(S.lang.length<2)S.lang.push('${l}');render()">${l}</label>`;
  });
  return h + '</div><div class="modal-actions"><button class="btn" onclick="closeModal()">Concluir</button></div>';
}
function renderModal() {
  if (!S.modal) {
    document.getElementById("modal-root").innerHTML = "";
    return;
  }
  const map = { ident: modalIdent, sp: modalSp, cls: modalCls, bg: modalBg, atr: modalAtr, per: modalPer, align: modalAlign, lang: modalLang };
  const body = (map[S.modal] || (() => "<p>…</p>"))();
  document.getElementById("modal-root").innerHTML = `<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal"><button class="close-x" onclick="closeModal()" aria-label="Fechar">×</button>${body}</div></div>`;
}
