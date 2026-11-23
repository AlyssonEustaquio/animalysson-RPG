function collect(d) {
    var pane = root.querySelector("#bst-pane");
    pane.querySelectorAll("[data-f]").forEach(function(el) {
      setPath(d, el.dataset.f, el.value);
    });
    pane.querySelectorAll("[data-kv]").forEach(function(box) {
      var obj = {};
      box.querySelectorAll(".bst-kv").forEach(function(row) {
        var k = row.querySelector(".k-key").value.trim();
        var v = row.querySelector(".k-val").value.trim();
        if (!k) return;
        obj[k] = v !== "" && isFinite(Number(v)) ? Number(v) : v;
      });
      d[box.dataset.kv] = obj;
    });
    pane.querySelectorAll("[data-list]").forEach(function(el) {
      d[el.dataset.list] = el.value.split(",").map(function(s) {
        return s.trim();
      }).filter(Boolean);
    });
    pane.querySelectorAll("[data-ent]").forEach(function(box) {
      var key = box.dataset.ent, withAtk = box.dataset.atk === "1";
      var old = entriesOf(d, key);
      var arr = [];
      box.querySelectorAll(".bst-card").forEach(function(card) {
        var i = Number(card.dataset.i);
        var x = Object.assign({}, old[i] || {});
        x.name = card.querySelector(".e-name").value.trim();
        x.description = card.querySelector(".e-desc").value.trim();
        if (withAtk) {
          var b = card.querySelector(".e-atk").value.trim();
          var dm = parseDamage(card.querySelector(".e-dmg").value);
          if (b !== "" && isFinite(Number(b))) x.attack_bonus = Number(b);
          else delete x.attack_bonus;
          if (dm.length) x.damage = dm;
          else delete x.damage;
          var kind = card.querySelector(".e-kind").value;
          if (!x.description && x.attack_bonus != null && kind) {
            x.description = genDesc(kind, x.attack_bonus, card.querySelector(".e-reach").value, dm);
          }
        }
        arr.push(x);
      });
      if (key === "acoesLendarias") setLeg(d, arr);
      else d[key] = arr;
    });
  }

function renderList() {
    var box = root.querySelector("#bst-list");
    if (!box) return;
    var q = plain(ui.q);
    var rows = window.MONSTERS.filter(function(m) {
      if (ui.type !== "Todos" && m.tipo !== ui.type) return false;
      if (ui.cat !== "Todos" && (m.categoria || "Monstro") !== ui.cat) return false;
      if (!q) return true;
      return plain([m.nome, m.nomeEn, m.tipo, m.nd, m.id].join(" ")).indexOf(q) >= 0;
    }).sort(function(a, b) {
      return String(a.nome).localeCompare(String(b.nome), "pt-BR");
    });
    var total = rows.length;
    rows = rows.slice(0, 120);
    box.innerHTML = rows.map(function(m) {
      return '<button type="button" class="bst-item' + (m.id === ui.sel ? " on" : "") + '" data-a="sel" data-id="' + e(m.id) + '"><span>' + e(m.nome) + (m.personalizado ? '<span class="bst-tag">' + e(m.categoria || "Novo") + "</span>" : m.editado ? '<span class="bst-tag">Editado</span>' : "") + "</span><small>ND " + e(m.nd) + " · " + e(m.tamanho) + " · " + e(m.tipo) + "</small></button>";
    }).join("") || '<div class="bst-mute">Nenhuma criatura encontrada.</div>';
    var c = root.querySelector("#bst-count");
    if (c) c.textContent = total + " de " + window.MONSTERS.length + " criaturas" + (total > 120 ? " (mostrando 120)" : "");
  }

function renderPane() {
    var pane = root.querySelector("#bst-pane");
    var top = pane.scrollTop;
    var h = "";
    if (ui.ctx && ui.ctx.token) h += tokenBoxHtml(ui.ctx.token);
    if (ui.mode === "edit" && ui.draft) {
      h += formHtml(ui.draft);
    } else {
      var m = ui.sel ? byId(ui.sel) : null;
      if (!m) {
        h += '<div class="bst-mute">Escolha uma criatura na lista para ver a ficha, ou crie um monstro/NPC novo.</div>';
      } else {
        h += '<div class="bst-bar"><button type="button" class="pri" data-a="edit">✎ Editar</button>' + (ui.ctx && ui.ctx.place ? '<button type="button" data-a="place">📍 Colocar no mapa</button>' : "") + '<button type="button" data-a="dup">⧉ Duplicar</button>' + (m.editado ? '<button type="button" data-a="restore">↺ Restaurar original</button>' : "") + (m.personalizado ? '<button type="button" class="dng" data-a="del">🗑 Excluir</button>' : "") + "</div>" + sheetHtml(m);
      }
    }
    pane.innerHTML = h;
    pane.scrollTop = top;
  }

function typeOptions() {
    var set = {};
    window.MONSTERS.forEach(function(m) {
      set[m.tipo || "Outros"] = 1;
    });
    return ["Todos"].concat(Object.keys(set).sort(function(a, b) {
      return a.localeCompare(b, "pt-BR");
    }));
  }

function build() {
    injectStyle();
    root = document.createElement("div");
    root.className = "bst-ov";
    root.innerHTML = '<div class="bst-box" role="dialog" aria-label="Bestiário"><div class="bst-head"><h3>👹 Bestiário · monstros e NPCs</h3><small id="bst-count"></small><button type="button" data-a="close" aria-label="Fechar">✕</button></div><div class="bst-body"><aside class="bst-left"><input id="bst-q" type="search" placeholder="Buscar por nome, tipo ou ND…"><div class="bst-row"><select id="bst-type"></select><select id="bst-cat"><option>Todos</option><option>Monstro</option><option>NPC</option></select></div><button type="button" class="pri" data-a="new">＋ Novo monstro/NPC</button><div class="bst-list" id="bst-list"></div><div class="bst-row"><button type="button" data-a="export">⬇ Exportar</button><button type="button" data-a="import">⬆ Importar</button></div><input type="file" id="bst-file" accept=".json,application/json" hidden></aside><section class="bst-right" id="bst-pane"></section></div></div>';
    document.body.appendChild(root);
    var sel = root.querySelector("#bst-type");
    sel.innerHTML = typeOptions().map(function(t) {
      return "<option>" + e(t) + "</option>";
    }).join("");
    root.addEventListener("keydown", function(ev) {
      ev.stopPropagation();
      if (ev.key === "Escape") requestClose();
    });
    root.addEventListener("keyup", function(ev) {
      ev.stopPropagation();
    });
    root.addEventListener("click", onClick);
    root.querySelector("#bst-q").addEventListener("input", function() {
      ui.q = this.value;
      renderList();
    });
    sel.addEventListener("change", function() {
      ui.type = this.value;
      renderList();
    });
    root.querySelector("#bst-cat").addEventListener("change", function() {
      ui.cat = this.value;
      renderList();
    });
    root.querySelector("#bst-file").addEventListener("change", onImport);
  }

function confirmDiscard() {
    return ui.mode !== "edit" || window.confirm("Descartar as alterações que não foram salvas?");
  }

function requestClose() {
    if (!confirmDiscard()) return;
    close();
  }

function close() {
    if (root && root.parentNode) root.parentNode.removeChild(root);
    root = null;
    ui.ctx = null;
    ui.mode = "view";
    ui.draft = null;
    ui.isNew = false;
  }

function startEdit(m, isNew) {
    ui.draft = clone(m);
    ui.isNew = !!isNew;
    ui.mode = "edit";
    renderPane();
  }

function saveDraft() {
    collect(ui.draft);
    var m = finalize(ui.draft);
    var prev = byId(m.id);
    var existsOrig = !!origById[m.id];
    if (existsOrig) {
      delete m.personalizado;
      store.edits[m.id] = m;
    } else {
      m.personalizado = true;
      var i = store.custom.findIndex(function(x) {
        return x.id === m.id;
      });
      if (i >= 0) store.custom[i] = m;
      else store.custom.push(m);
    }
    if (!persist()) window.alert("Não foi possível salvar no navegador (armazenamento cheio ou bloqueado).");
    var sync = root.querySelector("#bst-sync");
    if (prev && sync && sync.checked && ui.ctx && ui.ctx.tokens) syncTokens(prev, byIdAfter(m));
    rebuild();
    ui.sel = m.id;
    ui.mode = "view";
    ui.draft = null;
    ui.isNew = false;
    var sel = root.querySelector("#bst-type");
    var keep = ui.type;
    sel.innerHTML = typeOptions().map(function(t) {
      return "<option" + (t === keep ? " selected" : "") + ">" + e(t) + "</option>";
    }).join("");
    renderList();
    renderPane();
    if (ui.ctx && ui.ctx.changed) ui.ctx.changed();
  }

function byIdAfter(m) {
    return m;
  }

function syncTokens(prev, next) {
    var sq = ui.ctx.sizeSquares || function() {
      return 1;
    };
    ui.ctx.tokens().forEach(function(t) {
      if (t.monsterId !== next.id) return;
      if (t.nome === prev.nome) t.nome = next.nome;
      if (t.hpMax === prev.pontosVida) {
        if (t.hp === t.hpMax) t.hp = next.pontosVida;
        else if (t.hp > next.pontosVida) t.hp = next.pontosVida;
        t.hpMax = next.pontosVida;
      }
      if (t.raio === sq(prev)) t.raio = sq(next);
      t.nd = next.nd;
    });
  }

function applyToken() {
    var t = ui.ctx && ui.ctx.token;
    if (!t) return;
    var box = root.querySelector("#bst-tokbox");
    function v(n) {
      return box.querySelector('[data-t="' + n + '"]').value;
    }
    t.nome = v("nome").trim() || t.nome;
    var hpMax = v("hpMax"), hp = v("hp"), ca = v("ca");
    if (hpMax !== "") t.hpMax = toInt(hpMax, t.hpMax || 1, 1);
    if (hp !== "") t.hp = Math.max(0, toInt(hp, t.hp || 0));
    else if (t.hpMax != null && t.hp == null) t.hp = t.hpMax;
    if (ca !== "") t.ca = toInt(ca, 10, 0);
    else delete t.ca;
    t.raio = Math.max(1, Math.min(8, toInt(v("raio"), t.raio || 1, 1)));
    t.cor = v("cor");
    var ag = v("agressivo");
    if (ag === "sim") t.agressivo = true;
    else if (ag === "nao") t.agressivo = false;
    else delete t.agressivo;
    if (ui.ctx.changed) ui.ctx.changed();
    renderPane();
  }

function onImport() {
    var f = this.files && this.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function() {
      try {
        var data = JSON.parse(String(r.result));
        var n = 0;
        (data.custom || []).forEach(function(m) {
          if (!m || !m.id) return;
          var i = store.custom.findIndex(function(x) {
            return x.id === m.id;
          });
          if (i >= 0) store.custom[i] = m;
          else store.custom.push(m);
          n++;
        });
        Object.keys(data.edits || {}).forEach(function(id) {
          if (origById[id]) {
            store.edits[id] = data.edits[id];
            n++;
          }
        });
        persist();
        rebuild();
        renderList();
        renderPane();
        window.alert(n + " criatura(s) importada(s).");
      } catch (err) {
        window.alert("Arquivo inválido.");
      }
    };
    r.readAsText(f);
    this.value = "";
  }

function onClick(ev) {
    var b = ev.target.closest("[data-a]");
    if (!b || !root || !root.contains(b)) return;
    var a = b.dataset.a;
    if (a === "close") {
      requestClose();
      return;
    }
    if (a === "sel") {
      if (!confirmDiscard()) return;
      ui.sel = b.dataset.id;
      ui.mode = "view";
      ui.draft = null;
      ui.isNew = false;
      renderList();
      renderPane();
      return;
    }
    if (a === "new") {
      if (!confirmDiscard()) return;
      var n = blank();
      ui.sel = null;
      startEdit(n, true);
      renderList();
      return;
    }
    if (a === "edit") {
      var m = byId(ui.sel);
      if (m) startEdit(m, false);
      return;
    }
    if (a === "cancel") {
      ui.mode = "view";
      ui.draft = null;
      ui.isNew = false;
      renderPane();
      return;
    }
    if (a === "save") {
      saveDraft();
      return;
    }
    if (a === "dup") {
      var src = byId(ui.sel);
      if (!src) return;
      var c = clone(src);
      c.id = newId();
      c.nome = src.nome + " (cópia)";
      c.nomePt = c.nome;
      c.personalizado = true;
      delete c.editado;
      if (!c.categoria) c.categoria = "Monstro";
      ui.sel = null;
      startEdit(c, true);
      return;
    }
    if (a === "restore") {
      if (!window.confirm("Voltar esta criatura para a ficha original?")) return;
      delete store.edits[ui.sel];
      persist();
      rebuild();
      renderList();
      renderPane();
      if (ui.ctx && ui.ctx.changed) ui.ctx.changed();
      return;
    }
    if (a === "del") {
      if (!window.confirm("Excluir esta criatura personalizada?")) return;
      store.custom = store.custom.filter(function(x) {
        return x.id !== ui.sel;
      });
      persist();
      rebuild();
      ui.sel = null;
      renderList();
      renderPane();
      if (ui.ctx && ui.ctx.changed) ui.ctx.changed();
      return;
    }
    if (a === "place") {
      var id = ui.sel;
      var place = ui.ctx && ui.ctx.place;
      close();
      if (place) place(id);
      return;
    }
    if (a === "tok-apply") {
      applyToken();
      return;
    }
    if (a === "export") {
      var blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "bestiario-animalysson.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 1e3);
      return;
    }
    if (a === "import") {
      root.querySelector("#bst-file").click();
      return;
    }
    if (ui.mode === "edit" && ui.draft) {
      var key = b.dataset.k;
      if (a === "kv-add") {
        collect(ui.draft);
        ui.draft[key] = ui.draft[key] || {};
        var kv = KVS.find(function(x) {
          return x[0] === key;
        });
        var nk = kv ? kv[2] : "novo";
        while (ui.draft[key][nk] !== void 0) nk += "2";
        ui.draft[key][nk] = kv ? Number(kv[3]) : "";
        renderPane();
        return;
      }
      if (a === "kv-del") {
        var row = b.closest(".bst-kv");
        if (row) row.parentNode.removeChild(row);
        return;
      }
      if (a === "ent-add") {
        collect(ui.draft);
        var list = entriesOf(ui.draft, key).slice();
        list.push({ name: "", description: "" });
        if (key === "acoesLendarias") setLeg(ui.draft, list);
        else ui.draft[key] = list;
        renderPane();
        return;
      }
      if (a === "ent-del") {
        collect(ui.draft);
        var l2 = entriesOf(ui.draft, key).slice();
        l2.splice(Number(b.dataset.i), 1);
        if (key === "acoesLendarias") setLeg(ui.draft, l2);
        else ui.draft[key] = l2;
        renderPane();
        return;
      }
    }
  }
