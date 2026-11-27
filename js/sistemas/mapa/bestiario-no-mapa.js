var bestiaryHooked = false;
function bestiaryContext(token) {
    return {
      token: token || null,
      tokens: function() {
        return state.tokens || [];
      },
      sizeSquares,
      place: function(id) {
        var m = (window.MONSTERS || []).find(function(x) {
          return x.id === id;
        });
        if (!m) return;
        pendingMonster = m;
        setTool("token");
        setMenu(false);
      },
      changed: function() {
        save();
        draw();
        updateDetailPanel();
      }
    };
  }
function openBestiary(token) {
    if (!window.Bestiary) return;
    var id = token && token.monsterId ? token.monsterId : pendingMonster ? pendingMonster.id : null;
    window.Bestiary.open({ id, ctx: bestiaryContext(token) });
  }
function renderMonsterList(query) {
    var list = $("#mp-ml");
    if (!list) return;
    var q = (query || "").trim().toLowerCase();
    var monsters = window.MONSTERS || [];
    var filtered = monsters.filter(function(m) {
      if (!q) return true;
      return [m.nome, m.nomeEn, m.tipo, m.nd, m.id].join(" ").toLowerCase().indexOf(q) >= 0;
    }).slice(0, 50);
    if (!monsters.length) {
      list.innerHTML = "<small>Carregando bestiário…</small>";
      return;
    }
    if (!filtered.length) {
      list.innerHTML = "<small>Nenhum monstro encontrado.</small>";
      return;
    }
    list.innerHTML = filtered.map(function(m) {
      return '<button type="button" class="mp-mbtn" data-id="' + esc(m.id) + '"><span class="mp-mn">' + esc(m.nome) + "</span><small>ND " + esc(m.nd) + " · " + esc(m.tamanho) + "</small></button>";
    }).join("");
  }
function placeMonsterFromId(id, cell) {
    var m = (window.MONSTERS || []).find(function(x) {
      return x.id === id;
    });
    if (!m) return;
    if (blockMove && isCellWall(cell.x, cell.y)) return;
    var sq = sizeSquares(m);
    var tok = {
      id: "t" + Date.now().toString(36),
      monsterId: m.id,
      nome: m.nome,
      tipo: "npc",
      x: cell.x,
      y: cell.y,
      cor: colorForMonster(m),
      raio: sq,
      luz: 0,
      nd: m.nd,
      hp: m.pontosVida,
      hpMax: m.pontosVida
    };
    state.tokens.push(tok);
    if (combatActive()) getCombat().entrarNoCombate(tok);
    selected = tok;
    pendingMonster = null;
    setTool("select");
    save();
    draw();
  }
