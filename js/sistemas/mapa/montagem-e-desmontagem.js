var mountRequestId = 0;
function mount(el) {
    var requestId = ++mountRequestId;
    if (el) el.innerHTML = '<div class="empty-state" style="padding:24px">Carregando mapas e dados salvos…</div>';
    loadRepositoryMapCatalog(function() {
      if (requestId !== mountRequestId) return;
      var desiredMap = preferredMapId;
      try {
        desiredMap = localStorage.getItem(MAP_ID_KEY) || preferredMapId;
      } catch (e) {
      }
      applyMap(MAPS[desiredMap] ? desiredMap : "tumba");
      state = loadCurrentMapState();
      loadRepositoryMapState(function() {
        if (requestId !== mountRequestId) return;
        mountNow(el);
      });
    });
  }
function mountNow(el) {
    R = el;
    R.innerHTML = '<div class="mp vtt" id="mp-root"><div class="mp-wrap vtt-wrap"><div class="mp-main"><canvas id="mp-cv"></canvas><div id="mp-combat-hud" class="mp-combat-hud" style="display:none"></div><div id="mp-combat-toast" class="mp-combat-toast" style="display:none"></div><button type="button" id="mp-burger" class="mp-burger" title="Menu" aria-label="Abrir menu" aria-expanded="false" aria-controls="mp-drawer"><span></span><span></span><span></span></button><div class="mp-mode-switch" role="group" aria-label="Modo do mapa"><button type="button" id="mp-mode-player" class="active" title="Modo Jogador: sem ferramentas de edição">♟ Jogador</button><button type="button" id="mp-mode-editor" title="Modo Editor: liberar ferramentas e câmera livre">✎ Editor</button></div><div id="mp-drawer" class="mp-drawer" aria-hidden="true"><section class="mp-inventory-entry" aria-label="Inventário"><button type="button" id="mp-open-inventory">🎒 Abrir inventário</button></section><section id="mp-player-actions" class="mp-player-actions" aria-label="Ações do personagem"><div class="mp-player-actions-head"><strong>🎲 Ações do personagem</strong><button type="button" id="mp-action-config" title="Configurar bônus e dano">⚙</button></div><div class="mp-player-actions-buttons"><button type="button" data-player-action="menu">🎲 Abrir ações e interações</button></div><div class="mp-player-skill-row"><select id="mp-player-skill" aria-label="Escolher perícia">' + playerSkillOptionsHtml() + '</select><button type="button" data-player-action="skill">Rolar teste</button></div><small>Ataque, exploração e interação ficam reunidos em Ações. Use o teste de perícia para rolagens diretas.</small></section><section id="mp-combat-panel" class="mp-player-actions mp-combat-panel" aria-label="Combate"><div class="mp-player-actions-head"><strong>⚔ Controle do combate</strong></div><div id="mp-cb-panel-status" class="mp-cb-panel-status">Verificando disponibilidade do combate…</div><div class="mp-player-actions-buttons"><button type="button" data-cb="start">▶ Iniciar combate</button><button type="button" data-cb="stop" hidden>⏹ Encerrar combate</button></div><label class="mp-editor-only mp-cb-ai"><input type="checkbox" id="mp-cb-ai" checked> IA automática dos monstros</label></section><div class="mp-bar"><div class="mp-map-selector"><select id="mp-map" class="mp-title" title="Trocar de mapa">' + mapOptions() + '</select><button type="button" id="mp-add-map" class="mp-map-add" title="Adicionar imagem ou pacote ZIP de mapa" aria-label="Adicionar mapa">＋</button></div><input type="file" id="mp-add-map-file" accept=".zip,application/zip,image/*" hidden><button type="button" id="mp-export" title="Baixar pacote ZIP atualizado (mapas personalizados) ou dados JSON (mapas originais)">⬇ Salvar mapa</button><button type="button" id="mp-export-catalog" title="Baixar o catálogo para publicar os mapas adicionados">🗂 Baixar catálogo de mapas</button><label id="mp-hex-wrap" class="mp-luz mp-editor-only" title="Ajusta a largura dos hexágonos em pixels do mapa; o zoom da câmera não é alterado">Hexágono (px) <input id="mp-hex-size" type="number" min="4" max="240" step="1" inputmode="numeric" style="width:76px" aria-label="Largura do hexágono em pixels"><button type="button" id="mp-apply-hex-size">Aplicar</button><small id="mp-hex-miles" aria-live="polite"></small></label><label id="mp-speed-wrap" class="mp-luz" style="display:none">Velocidade <input id="mp-speed" type="number" min="0.1" step="0.1" placeholder="mi/dia" style="width:62px"></label><button type="button" id="mp-world-move" class="mp-world-action active" title="Desativa os modos de início e teleporte; use as setas ou clique para mover o personagem">🧭 Desativar ferramentas</button><button type="button" id="mp-world-spawn" class="mp-world-action" title="Definir o ponto de início deste mapa">📍 Definir início</button><button type="button" id="mp-world-portal" class="mp-world-action" title="No modo Editor: adicionar um teleporte para outro mapa">🌀 Teleporte para outro mapa</button><button type="button" id="mp-world-local-portal" class="mp-world-action" title="No modo Editor: clique no ponto A e depois no ponto B para criar um teleporte dentro deste mapa">🌀 Teleporte neste mapa</button><label id="mp-tile-size-wrap" class="mp-luz mp-editor-only" title="Ajusta o tamanho de cada quadrícula deste mapa">Tile (px) <input id="mp-tile-size" type="number" min="8" max="512" step="1" inputmode="numeric" style="width:76px" aria-label="Tamanho do tile em pixels"><button type="button" id="mp-apply-tile-size">Aplicar</button></label><div class="mp-g" id="mp-tools"><button data-t="wall" title="Posicionar parede em uma quadrícula">🧱 Parede</button><button data-t="muro" title="Desenhar muro: clique em um canto e depois em outro">─ Muro</button><button data-t="porta" title="Desenhar porta: clique em um canto e depois em outro">🚪 Porta</button><button data-t="editStructure" title="Clique em uma parede, muro ou porta para editar somente aquela estrutura">⚙ Editar</button></div><button id="mp-grid" title="Grid (G)">Grid</button><button id="mp-fog" title="Névoa (F)">Névoa</button><button id="mp-light" title="Luz dinâmica (L)">Luz</button><button id="mp-walls-vis" title="Mostrar paredes/muros (W)">Ver muros</button><button id="mp-secret-view" title="Alternar a visão do Mestre para estruturas secretas ainda não descobertas">👁 Segredos (Mestre)</button><label class="mp-luz"><input id="mp-block" type="checkbox" checked> Bloquear movimento</label><label class="mp-luz">Raio <input id="mp-lr" type="number" min="0" max="20" value="6" style="width:44px"></label><button id="mp-reset-fog" title="Cobrir novamente todas as áreas do mapa">Reset Névoa</button><button id="mp-clear-fog" title="Remover a névoa de todo o mapa (pede confirmação)">Revelar Tudo</button><button id="mp-clear-walls" title="Remover todas as paredes (pede confirmação)">Limpar paredes</button><button id="mp-clear-edges" title="Remover todos os muros e portas das linhas (pede confirmação)">Limpar muros/portas</button><button id="mp-zo">−</button><button id="mp-zi">+</button></div><aside class="mp-side" id="mp-side"><button type="button" id="mp-bestiary" title="Abrir o Bestiário: buscar, colocar no mapa, criar e editar monstros e NPCs" style="width:100%;box-sizing:border-box;padding:10px;font-weight:700;cursor:pointer">👹 Bestiário · editar monstros e NPCs</button><h4 style="margin-top:12px">Token selecionado</h4><div id="mp-detail" class="mp-detail"><div class="mp-detail-empty">Selecione um token.</div></div><small style="display:block;margin-top:10px;color:var(--mute)">' + (isHexMap() ? "<b>Parede</b> = hexágono bloqueado.<br><b>Flanaess</b> usa deslocamento e medição em hexágonos; muros e portas lineares ficam desativados." : "<b>Parede</b> = quadrícula bloqueada.<br><b>Segredos:</b> Percepção passiva/Busca ativa encontra; Investigação descobre o mecanismo.<br><b>Trancadas:</b> Ferramentas de Ladrão; <b>emperradas:</b> Atletismo.<br><b>Estruturas:</b> Atacar estrutura usa CA, PV e limiar de dano. Ilusões não bloqueiam; Muralha de Energia só cai com Desintegrar.") + '</small></aside><div class="mp-menu-footer"><button type="button" id="mp-delete-map" class="mp-delete-map" title="Excluir somente mapas adicionados pelo botão +">🗑 Excluir mapa</button></div></div><div id="mp-inventory-overlay" class="mp-inventory-overlay" aria-hidden="true"><section class="mp-inventory-dialog" role="dialog" aria-modal="true" aria-labelledby="mp-inventory-title"><header class="mp-inventory-head"><strong id="mp-inventory-title">🎒 Inventário do personagem</strong><button type="button" id="mp-close-inventory" aria-label="Fechar inventário">✕ Fechar</button></header><div id="mp-inventory-host" class="mp-inventory-host"></div></section></div></div></div></div>';
    if (typeof creativeInstallUi === "function") creativeInstallUi();
    creativeHistoryUndo = []; creativeHistoryRedo = []; creativeSelected = null; creativeTransaction = null;
    var menuStyle = document.createElement("style");
    menuStyle.textContent = '#mp-root{flex:1 1 0;min-height:0;}#mp-root .mp-wrap{display:block !important;position:relative !important;flex:1 1 0 !important;height:auto !important;min-height:0 !important;}#mp-root .mp-main{display:block !important;position:absolute !important;top:0 !important;right:0 !important;bottom:0 !important;left:0 !important;width:auto !important;height:auto !important;min-width:0 !important;min-height:0 !important;overflow:hidden;}#mp-root #mp-cv{display:block;width:100%;height:100%;}#mp-root .mp-burger{position:absolute;top:10px;left:10px;z-index:30;width:44px;height:44px;padding:0;border-radius:10px;border:1px solid rgba(255,255,255,.28);background:rgba(15,15,18,.82);cursor:pointer;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;}#mp-root .mp-burger:hover{background:rgba(40,40,46,.92);}#mp-root .mp-mode-switch{position:absolute;top:10px;right:10px;z-index:35;display:flex;gap:5px;padding:4px;border:1px solid rgba(255,255,255,.2);border-radius:11px;background:rgba(15,15,18,.88);backdrop-filter:blur(8px);}#mp-root .mp-mode-switch button{min-height:34px;padding:7px 11px;border:1px solid transparent;border-radius:7px;background:transparent;color:#e8eaf0;font-weight:600;cursor:pointer;}#mp-root .mp-mode-switch button.active{background:rgba(55,145,190,.38);border-color:#66c8ed;color:#fff;}#mp-root .mp-player-actions{position:static;width:auto;box-sizing:border-box;margin:0 0 14px;padding:10px;border:1px solid rgba(255,255,255,.2);border-radius:11px;background:rgba(255,255,255,.04);color:#f3f6fb;}#mp-root .mp-player-actions-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px;font-size:13px;}#mp-root .mp-player-actions-head button{width:30px;height:28px;border:1px solid rgba(255,255,255,.2);border-radius:6px;background:#30343e;color:#fff;cursor:pointer;}#mp-root .mp-player-actions-buttons{display:flex;flex-wrap:wrap;gap:6px;}#mp-root .mp-player-actions-buttons button{flex:1 1 100%;min-width:0;min-height:38px;padding:8px 10px;border:1px solid rgba(100,180,220,.35);border-radius:7px;background:rgba(38,92,125,.28);color:#eef8ff;font-size:13px;font-weight:700;cursor:pointer;}#mp-root .mp-player-actions-buttons button:hover{background:rgba(48,125,165,.48);}#mp-root .mp-player-actions small{display:block;margin-top:7px;color:#aab5c4;font-size:10px;line-height:1.35;}#mp-root .mp-player-skill-row{display:flex;gap:6px;margin-top:7px;}#mp-root .mp-player-skill-row select{flex:1;min-width:0;padding:7px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:#252a34;color:#eef8ff;font-size:12px;}#mp-root .mp-player-skill-row button{padding:7px 10px;border:1px solid rgba(100,180,220,.35);border-radius:7px;background:rgba(38,92,125,.28);color:#eef8ff;font-size:12px;font-weight:600;cursor:pointer;}#mp-root .mp-inventory-entry{margin:0 0 12px;padding:0;}#mp-root #mp-open-inventory{display:block;width:100%;min-height:42px;padding:9px 12px;border:1px solid rgba(90,190,140,.55);border-radius:8px;background:rgba(35,125,85,.28);color:#e7fff1;font-size:14px;font-weight:700;cursor:pointer;}#mp-root #mp-open-inventory:hover{background:rgba(35,155,100,.42);}#mp-root .mp-inventory-overlay{position:absolute;inset:10px;z-index:32;display:none;align-items:stretch;justify-content:center;padding:clamp(4px,2vw,18px);background:rgba(5,7,10,.88);backdrop-filter:blur(5px);}#mp-root .mp-inventory-overlay.open{display:flex;}#mp-root .mp-inventory-dialog{display:flex;flex-direction:column;width:min(1180px,100%);height:100%;min-height:0;padding:12px;border:1px solid rgba(255,255,255,.2);border-radius:12px;background:#141519;box-shadow:0 18px 60px rgba(0,0,0,.65);overflow:hidden;}#mp-root .mp-inventory-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex:none;padding:0 0 10px;border-bottom:1px solid rgba(255,255,255,.14);color:#f3f6fb;}#mp-root #mp-close-inventory{padding:7px 11px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:#30343e;color:#fff;cursor:pointer;}#mp-root .mp-inventory-host{flex:1;min-height:0;overflow:auto;padding-top:10px;}#mp-root .mp-inventory-host>.inv{min-height:100%;}@media(max-width:700px){#mp-root .mp-inventory-overlay{inset:4px;padding:4px;}#mp-root .mp-inventory-dialog{padding:8px;border-radius:8px;}#mp-root .mp-inventory-head{font-size:13px;}}#mp-root.editor-mode .mp-player-actions{display:none !important;}#mp-root.player-mode .mp-editor-only{display:none !important;}#mp-root.player-mode .mp-drawer .mp-g.mp-editor-only{display:none !important;}#mp-root .mp-canvas-pan{cursor:grab;}#mp-root .mp-map-selector{display:flex;align-items:stretch;gap:6px;width:100%;}#mp-root .mp-map-selector select{flex:1 1 auto;min-width:0;width:auto !important;}#mp-root .mp-map-selector .mp-map-add{flex:0 0 44px;width:44px !important;min-width:44px;height:42px;padding:0;font-size:24px;line-height:1;border:1px solid rgba(255,255,255,.25);border-radius:8px;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;}#mp-root .mp-map-selector .mp-map-add:hover{background:rgba(255,255,255,.17);}#mp-root #mp-export,#mp-root #mp-export-catalog{width:100%;box-sizing:border-box;}#mp-root .mp-burger span{display:block;width:22px;height:2px;border-radius:2px;background:#fff;transition:transform .2s,opacity .2s;}#mp-root .mp-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}#mp-root .mp-burger.open span:nth-child(2){opacity:0;}#mp-root .mp-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}#mp-root .mp-drawer{position:absolute;top:0;left:0;bottom:0;z-index:25;box-sizing:border-box;width:min(330px,88vw);padding:64px 12px 16px;overflow-y:auto;background:rgba(14,14,17,.97);border-right:1px solid rgba(255,255,255,.14);box-shadow:4px 0 18px rgba(0,0,0,.45);transform:translateX(-104%);visibility:hidden;transition:transform .22s ease,visibility 0s linear .22s;}#mp-root .mp-drawer.open{transform:none;visibility:visible;transition:transform .22s ease,visibility 0s;}#mp-root .mp-drawer .mp-bar{display:flex !important;flex-direction:column !important;flex-wrap:nowrap !important;align-items:stretch !important;gap:8px !important;position:static !important;width:auto !important;height:auto !important;margin:0 !important;padding:0 !important;background:none !important;border:0 !important;}#mp-root .mp-drawer .mp-bar > button,#mp-root .mp-drawer .mp-bar > select,#mp-root .mp-drawer .mp-bar > label{width:100%;box-sizing:border-box;}#mp-root:not(.mp-world-map) .mp-drawer .mp-g{display:grid !important;grid-template-columns:1fr 1fr;gap:6px;}#mp-root .mp-drawer .mp-g button{width:100%;box-sizing:border-box;}#mp-root .mp-drawer .mp-side{position:static !important;width:auto !important;height:auto !important;max-height:none !important;overflow:visible !important;margin:14px 0 0 !important;padding:12px 0 0 !important;border:0 !important;border-top:1px solid rgba(255,255,255,.14) !important;}#mp-root .mp-menu-footer{margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,.14);}#mp-root .mp-world-action{display:none;width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid rgba(90,210,235,.45);border-radius:8px;background:rgba(35,125,150,.18);color:#d9fbff;font-weight:600;cursor:pointer;}#mp-root .mp-world-action:hover{background:rgba(35,155,180,.3);}#mp-root .mp-world-action.active{background:rgba(35,155,180,.48);border-color:#55e6ff;}#mp-root.editor-mode:not(.mp-world-map) #mp-world-spawn{display:block !important;}#mp-root #mp-tile-size-wrap,#mp-root #mp-hex-wrap{display:flex;align-items:center;gap:7px;flex-wrap:wrap;padding:7px 9px;border:1px solid rgba(255,255,255,.14);border-radius:7px;background:rgba(255,255,255,.035);}#mp-root #mp-tile-size-wrap[hidden],#mp-root #mp-hex-wrap[hidden]{display:none!important;}#mp-root #mp-tile-size{max-width:80px;box-sizing:border-box;padding:6px;border:1px solid rgba(255,255,255,.2);border-radius:6px;background:#252a34;color:#fff;}#mp-root #mp-apply-tile-size,#mp-root #mp-apply-hex-size{min-height:30px;padding:5px 9px;border:1px solid rgba(90,180,220,.45);border-radius:6px;background:#24536b;color:#fff;cursor:pointer;}#mp-root #mp-hex-size{max-width:80px;box-sizing:border-box;padding:6px;border:1px solid rgba(255,255,255,.2);border-radius:6px;background:#252a34;color:#fff;}#mp-root #mp-hex-miles{font-size:11px;color:#aeb6c4;white-space:nowrap;}#mp-root .mp-delete-map{display:block;width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid rgba(220,70,70,.65);border-radius:8px;background:rgba(150,35,35,.2);color:#ffb6b6;font-weight:600;cursor:pointer;}#mp-root .mp-delete-map:hover:not(:disabled){background:rgba(180,45,45,.38);}#mp-root .mp-delete-map:disabled{opacity:.42;cursor:not-allowed;}#mp-root .mp-portal-dialog-overlay{position:absolute;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;background:rgba(0,0,0,.72);}#mp-root .mp-portal-dialog{width:min(340px,100%);box-sizing:border-box;padding:18px;border:1px solid rgba(255,255,255,.2);border-radius:12px;background:#17191f;color:#f4f5f7;box-shadow:0 12px 40px rgba(0,0,0,.55);}#mp-root .mp-portal-dialog h3{margin:0 0 8px;font-size:17px;}#mp-root .mp-portal-dialog p{margin:0 0 14px;color:#c5c9d2;font-size:13px;line-height:1.45;}#mp-root .mp-portal-color-input{display:block;width:100%;height:48px;margin:4px 0 16px;padding:3px;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:#252832;cursor:pointer;}#mp-root .mp-portal-dialog-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;}#mp-root .mp-combat-hud{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);z-index:60;max-width:calc(100% - 24px);flex-direction:column;gap:6px;padding:8px 10px;border:1px solid rgba(255,213,79,.5);border-radius:11px;background:rgba(14,16,22,.92);color:#f4f6fb;font-size:12px;box-shadow:0 4px 18px rgba(0,0,0,.5);}#mp-root .mp-cb-order{display:flex;gap:4px;overflow-x:auto;max-width:86vw;}#mp-root .mp-cb-chip{flex:0 0 auto;padding:3px 7px;border-radius:12px;background:#2b303b;border:1px solid transparent;white-space:nowrap;cursor:pointer;}#mp-root .mp-cb-chip.now{border-color:#ffd54f;background:#4a3d12;}#mp-root .mp-cb-chip.dead{opacity:.35;text-decoration:line-through;}#mp-root .mp-cb-chip.down{color:#ff8a80;}#mp-root .mp-cb-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;}#mp-root .mp-cb-eco{padding:2px 7px;border-radius:9px;background:#3a2326;color:#d9aaaa;}#mp-root .mp-cb-eco.ok{background:#1f4430;color:#c8f3d8;}#mp-root .mp-combat-hud button{min-height:32px;padding:5px 10px;border:1px solid rgba(255,255,255,.25);border-radius:8px;background:#30343e;color:#fff;font-size:12px;font-weight:600;cursor:pointer;}#mp-root .mp-combat-toast{position:absolute;left:50%;top:60px;transform:translateX(-50%);z-index:70;padding:8px 14px;border-radius:9px;background:rgba(160,40,40,.95);color:#fff;font-size:13px;}#mp-root .mp-cb-btn{min-height:36px;padding:7px 10px;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:#2b303b;color:#fff;font-size:13px;cursor:pointer;text-align:left;}#mp-root .mp-cb-btn.primary{background:#24536b;border-color:rgba(90,180,220,.55);font-weight:700;}#mp-root .mp-cb-btn.off{opacity:.38;cursor:not-allowed;}#mp-root .mp-cb-list{display:flex;flex-direction:column;gap:6px;margin:8px 0;}#mp-root .mp-cb-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:4px 0 10px;}#mp-root .mp-cb-accordion{margin:8px 0;border:1px solid rgba(255,255,255,.13);border-radius:8px;background:rgba(255,255,255,.025);overflow:hidden;}#mp-root .mp-cb-accordion>summary{list-style:none;cursor:pointer;padding:10px 12px;margin:0;background:rgba(255,255,255,.045);}#mp-root .mp-cb-accordion>summary::-webkit-details-marker{display:none;}#mp-root .mp-cb-accordion>summary:after{content:"＋";float:right;color:#ffd54f;font-weight:700;}#mp-root .mp-cb-accordion[open]>summary:after{content:"−";}#mp-root .mp-cb-accordion>.mp-cb-grid{padding:8px;margin:0;}#mp-root .mp-cb-section{font-size:12px;font-weight:700;color:#ffd54f;text-transform:uppercase;letter-spacing:.04em;}#mp-root .mp-action-group{margin:8px 0 12px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,.12);}#mp-root .mp-action-group h4{margin:4px 0 6px;color:#ffd54f;font-size:11px;text-transform:uppercase;letter-spacing:.05em;}#mp-root .mp-cb-panel-status{padding:8px 10px;margin:0 0 8px;border-radius:7px;background:rgba(255,255,255,.045);color:#c5cbd6;font-size:12px;line-height:1.4;}#mp-root .mp-combat-panel button[hidden]{display:none !important;}#mp-root .mp-cb-log{display:flex;flex-direction:column;gap:5px;max-height:55vh;overflow:auto;margin:8px 0 12px;font-size:13px;line-height:1.45;}#mp-root .mp-cb-log div{padding:6px 9px;border:1px solid rgba(255,255,255,.12);border-radius:7px;background:rgba(255,255,255,.045);white-space:pre-wrap;}#mp-root .mp-cb-log .mp-cb-head{border-color:rgba(255,213,79,.5);color:#ffe082;font-weight:700;}#mp-root .mp-cb-field{display:flex;flex-direction:column;gap:4px;margin:0 0 9px;color:#d5d9e2;font-size:12px;}#mp-root .mp-cb-input{width:100%;box-sizing:border-box;padding:8px;border:1px solid #555d6c;border-radius:6px;background:#252a34;color:#fff;}#mp-root .mp-cb-check{display:block;padding:6px 8px;border:1px solid rgba(255,255,255,.14);border-radius:7px;margin-bottom:5px;font-size:12px;}#mp-root .mp-cb-conds{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0;}#mp-root .mp-cb-cond{padding:3px 7px;border:1px solid rgba(255,255,255,.2);border-radius:10px;background:#2a2e38;color:#ccd;font-size:11px;cursor:pointer;}#mp-root .mp-cb-cond.on{background:#7a3030;color:#fff;border-color:#e57373;}#mp-root .mp-cb-detail{margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,.15);}#mp-root .mp-cb-ai{display:block;margin-top:8px;font-size:12px;color:#d5d9e2;}#mp-root.editor-mode .mp-combat-panel{display:block !important;}#mp-root:not(.editor-mode) .mp-combat-panel{display:none !important;}#mp-root .mp-portal-dialog-actions-stack{flex-direction:column;}#mp-root .mp-portal-dialog-actions button{min-height:38px;padding:8px 12px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:#30343e;color:#fff;cursor:pointer;}#mp-root .mp-portal-dialog-actions button.primary{border-color:#3c9bc7;background:#17688f;}#mp-root .mp-message-editor-overlay{position:absolute;inset:0;z-index:140;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;background:rgba(0,0,0,.78);}#mp-root .mp-message-editor{display:flex;flex-direction:column;width:min(900px,96vw);max-height:92%;min-height:0;box-sizing:border-box;padding:16px;border:1px solid rgba(255,255,255,.2);border-radius:12px;background:#17191f;color:#f4f5f7;box-shadow:0 12px 40px rgba(0,0,0,.6);}#mp-root .mp-message-editor-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}#mp-root .mp-message-editor-heading h3{margin:0 0 6px;font-size:18px;}#mp-root .mp-message-editor-heading p{margin:0 0 6px;color:#c5c9d2;font-size:12px;line-height:1.4;}#mp-root .mp-message-close{flex:0 0 34px;width:34px;height:34px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:#30343e;color:#fff;font-size:22px;cursor:pointer;}#mp-root .mp-message-filters{display:flex;gap:8px;align-items:center;margin:10px 0;}#mp-root .mp-message-filters input{flex:1 1 auto;min-width:80px;}#mp-root .mp-message-filters select{flex:0 0 190px;max-width:45%;}#mp-root #mp-message-count{flex:0 0 auto;color:#aeb6c4;font-size:11px;white-space:nowrap;}#mp-root .mp-message-list{flex:1 1 auto;min-height:0;overflow:auto;padding:2px 4px 2px 0;}#mp-root .mp-message-item{display:flex;flex-direction:column;gap:4px;margin:0 0 10px;padding:9px;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:rgba(255,255,255,.035);}#mp-root .mp-message-item label{font-size:12px;font-weight:600;color:#e4e8ef;line-height:1.35;}#mp-root .mp-message-item textarea{width:100%;min-height:42px;max-height:110px;box-sizing:border-box;resize:vertical;padding:7px;border:1px solid rgba(255,255,255,.18);border-radius:6px;background:#242832;color:#fff;font:12px/1.4 inherit;}#mp-root .mp-message-item small{font-size:10px;color:#9ea8b7;}#mp-root .mp-message-editor-footer{display:flex;align-items:center;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.12);}#mp-root .mp-message-editor-footer span{flex:1;}#mp-root .mp-message-editor-footer button{min-height:36px;padding:7px 11px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:#30343e;color:#fff;cursor:pointer;}#mp-root .mp-message-editor-footer button.primary{border-color:#3c9bc7;background:#17688f;}#mp-root .mp-message-editor-footer button:hover{filter:brightness(1.15);}@media(max-width:600px){#mp-root .mp-message-filters{flex-wrap:wrap;}#mp-root .mp-message-filters input{flex-basis:100%;}#mp-root .mp-message-filters select{max-width:none;flex:1;}#mp-root .mp-message-editor-footer{flex-wrap:wrap;}#mp-root .mp-message-editor-footer span{display:none;}#mp-root .mp-message-editor-footer button{flex:1;}}#mp-root .mp-portal-dialog-actions button.danger{border-color:#9a3b3b;background:#742d35;}';
    R.querySelector("#mp-root").appendChild(menuStyle);
    [
      ".mp-map-selector",
      "#mp-add-map",
      "#mp-add-map-file",
      "#mp-export",
      "#mp-export-catalog",
      "#mp-tools",
      "#mp-tile-size-wrap",
      "#mp-hex-wrap",
      "#mp-grid",
      "#mp-fog",
      "#mp-light",
      "#mp-walls-vis",
      "#mp-secret-view",
      "#mp-block",
      "#mp-lr",
      "#mp-reset-fog",
      "#mp-clear-fog",
      "#mp-clear-walls",
      "#mp-clear-edges",
      "#mp-zo",
      "#mp-zi",
      "#mp-side",
      "#mp-delete-map",
      ".mp-menu-footer",
      "#mp-world-move",
      "#mp-world-spawn",
      "#mp-world-portal",
      "#mp-world-local-portal"
    ].forEach(function(selector) {
      var node = R.querySelector(selector);
      if (!node) return;
      if (selector === "#mp-block" || selector === "#mp-lr") node = node.parentElement;
      if (node) node.classList.add("mp-editor-only");
    });
    var worldActionButtons = R.querySelectorAll(".mp-world-action");
    worldActionButtons.forEach(function(node) {
      node.classList.add("mp-editor-only");
    });
    var editStructureButton = R.querySelector('#mp-tools button[data-t="editStructure"]');
    if (editStructureButton) editStructureButton.onclick = function() {
      setTool("editStructure");
      setMenu(false);
    };
    $("#mp-mode-player").onclick = function() {
      setMode("player");
      setMenu(false);
    };
    $("#mp-mode-editor").onclick = function() {
      setMode("editor");
      setMenu(false);
    };
    var inventoryOpenButton = R.querySelector("#mp-open-inventory");
    var inventoryCloseButton = R.querySelector("#mp-close-inventory");
    if (inventoryOpenButton) inventoryOpenButton.onclick = function() {
      setMenu(false);
      openMapInventory();
    };
    if (inventoryCloseButton) inventoryCloseButton.onclick = closeMapInventory;
    var playerActionTray = R.querySelector("#mp-player-actions");
    if (playerActionTray) {
      playerActionTray.addEventListener("click", function(event) {
        var actionButton = event.target.closest("button[data-player-action]");
        if (actionButton) {
          setMenu(false);
          runPlayerAction(actionButton.getAttribute("data-player-action"));
          return;
        }
        if (event.target.closest("#mp-action-config")) configurePlayerActionProfile(currentPlayer());
      });
    }
    var combatRoot = R.querySelector("#mp-root");
    combatRoot.addEventListener("click", function(event) {
      var cbButton = event.target.closest("[data-cb]");
      if (cbButton) {
        var cbAction = cbButton.getAttribute("data-cb");
        setMenu(false);
        if (cbAction === "start") combatStart();
        else if (cbAction === "menu") openCombatMenu();
        else if (cbAction === "end") combatEndTurn();
        else if (cbAction === "stop") combatStop();
        else if (cbAction === "log") combatShowRegistry();
        return;
      }
      var chip = event.target.closest(".mp-cb-chip");
      if (chip) {
        var chipToken = state.tokens.find(function(tk) {
          return tk.id === chip.getAttribute("data-id");
        });
        if (chipToken && appMode === "editor") {
          selected = chipToken;
          updateDetailPanel();
          draw();
        }
      }
    });
    if (autoCombatTimer) window.clearInterval(autoCombatTimer);
    autoCombatTimer = window.setInterval(autoCombatTick, 600);
    var combatAi = R.querySelector("#mp-cb-ai");
    if (combatAi) {
      combatAi.checked = combatState().autoIA !== false;
      combatAi.addEventListener("change", function() {
        combatState().autoIA = combatAi.checked;
        save();
      });
    }
    cv = $("#mp-cv");
    cx = cv.getContext("2d");
    if ("imageSmoothingQuality" in cx) cx.imageSmoothingQuality = "high";
    cv.addEventListener("pointerdown", function(e) {
      if (menuIsOpen()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setMenu(false);
      }
    });
    $("#mp-burger").onclick = function() {
      setMenu(!menuIsOpen());
    };
    $("#mp-export").onclick = function() {
      save();
      if (MAPINFO && MAPINFO.custom) exportMapPackage();
      else exportMapFile();
    };
    $("#mp-export-catalog").style.display = customMapEntries().length ? "" : "none";
    $("#mp-export-catalog").onclick = function() {
      exportMapCatalog();
    };
    var deleteMapButton = $("#mp-delete-map");
    deleteMapButton.disabled = !MAPINFO.custom;
    deleteMapButton.title = MAPINFO.custom ? "Excluir este mapa personalizado do seletor" : "Os mapas originais do projeto não podem ser excluídos";
    deleteMapButton.onclick = function() {
      deleteCurrentCustomMap();
    };
    $("#mp-add-map").onclick = function() {
      $("#mp-add-map-file").click();
    };
    $("#mp-add-map-file").onchange = function() {
      var file = this.files && this.files[0];
      this.value = "";
      if (file) createCustomMapFromFile(file);
    };
    $("#mp-world-move").onclick = function() {
      if (!isHexMap()) return;
      setTool("select");
      setMenu(false);
    };
    $("#mp-world-spawn").onclick = function() {
      setTool("spawn");
      setMenu(false);
    };
    $("#mp-world-portal").onclick = function() {
      if (!isHexMap()) return;
      setTool("portal");
      setMenu(false);
    };
    $("#mp-world-local-portal").onclick = function() {
      if (!isHexMap()) return;
      setTool("localPortal");
      setMenu(false);
    };
    var tileSizeWrap = $("#mp-tile-size-wrap");
    var tileSizeInput = $("#mp-tile-size");
    var applyTileSizeButton = $("#mp-apply-tile-size");
    if (tileSizeWrap && tileSizeInput && applyTileSizeButton) {
      let applyRequestedTileSize = function() {
        var nextSize = Number(tileSizeInput.value);
        if (!isFinite(nextSize) || nextSize < 8 || nextSize > 512) {
          appAlertMessage("msg010", "Informe um tamanho de tile entre 8 e 512 pixels.");
          tileSizeInput.value = String(MAPINFO.cell || CELL);
          return;
        }
        var previousSize = Number(MAPINFO.cell) || CELL;
        if (resizeMapTileSize(nextSize)) {
          tileSizeInput.value = String(MAPINFO.cell || CELL);
          if (Math.round(nextSize) !== previousSize) {
            appAlertMessage("msg009", "Tamanho do tile atualizado para " + MAPINFO.cell + " px. A alteração foi salva neste navegador para este mapa. As posições dos tokens, o início, a névoa, as paredes e os muros/portas foram ajustados.");
          }
        } else {
          tileSizeInput.value = String(MAPINFO.cell || CELL);
        }
      };
      tileSizeWrap.hidden = isHexMap();
      tileSizeInput.value = String(MAPINFO.cell || CELL);
      applyTileSizeButton.onclick = applyRequestedTileSize;
      tileSizeInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          applyRequestedTileSize();
        }
      });
    }
    var hexSizeWrap = $("#mp-hex-wrap");
    var hexSizeInput = $("#mp-hex-size");
    var applyHexSizeButton = $("#mp-apply-hex-size");
    var hexMilesLabel = $("#mp-hex-miles");
    if (hexSizeWrap && hexSizeInput && applyHexSizeButton) {
      let updateHexSizeLabel = function() {
        if (!hexMilesLabel || !isHexMap()) return;
        hexMilesLabel.textContent = "· " + (Math.round(hexMetrics().miles * 100) / 100).toLocaleString("pt-BR") + " mi/hex";
      }, applyRequestedHexSize = function() {
        var nextSize = Number(hexSizeInput.value);
        if (!isFinite(nextSize) || nextSize < 4 || nextSize > 240) {
          appAlertMessage("msg010", "Informe uma largura de hexágono entre 4 e 240 pixels.");
          hexSizeInput.value = String(Math.round(hexMetrics().width * 100) / 100);
          return;
        }
        var previousSize = hexMetrics().width;
        if (resizeHexGridSize(nextSize)) {
          hexSizeInput.value = String(Math.round(hexMetrics().width * 100) / 100);
          updateHexSizeLabel();
          if (Math.abs(nextSize - previousSize) > 1e-3) {
            appAlertMessage("msg009", "Hexágonos ajustados para " + hexSizeInput.value + " px (" + (Math.round(hexMetrics().miles * 100) / 100).toLocaleString("pt-BR") + " milhas por hexágono). A posição dos tokens e teleportes foi preservada. Clique em Salvar mapa para exportar o ajuste para o GitHub.");
          }
        } else {
          hexSizeInput.value = String(Math.round(hexMetrics().width * 100) / 100);
          updateHexSizeLabel();
        }
      };
      hexSizeWrap.hidden = !isHexMap();
      if (isHexMap()) hexSizeInput.value = String(Math.round(hexMetrics().width * 100) / 100);
      updateHexSizeLabel();
      applyHexSizeButton.onclick = applyRequestedHexSize;
      hexSizeInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          applyRequestedHexSize();
        }
      });
    }
    attachTouchGestures();
    cv.addEventListener("pointerdown", onPointerDown);
    cv.addEventListener("pointermove", onPointerMove);
    cv.addEventListener("pointerleave", onPointerLeave);
    cv.addEventListener("pointerup", onPointerUp);
    cv.addEventListener("pointercancel", onPointerUp);
    cv.addEventListener("dblclick", creativeHandleDoubleClick);
    cv.addEventListener("wheel", onWheel, { passive: false });
    cv.addEventListener("contextmenu", function(e) {
      e.preventDefault();
    });
    $("#mp-map").onchange = function() {
      var host = R, id = this.value;
      stopWorldTravel(false);
      save();
      tool = "select";
      try {
        localStorage.setItem(MAP_ID_KEY, id);
      } catch (e) {
      }
      unmount();
      applyMap(id);
      zoom = isHexMap() ? FLANAESS_ZOOM : 0.35;
      ox = 40;
      oy = 40;
      if (isHexMap() && ["muro", "porta", "eraseedge"].indexOf(tool) >= 0) tool = "select";
      state = loadCurrentMapState();
      selected = null;
      pendingMonster = null;
      measurePts = null;
      drag = null;
      mount(host);
    };
    if ($("#mp-hex-wrap")) $("#mp-hex-wrap").hidden = !isHexMap();
    if ($("#mp-speed-wrap")) $("#mp-speed-wrap").style.display = isHexMap() ? "inline-flex" : "none";
    if (isHexMap()) {
      var worldRoot = $("#mp-root");
      worldRoot.classList.add("mp-world-map");
      var worldStyle = document.createElement("style");
      worldStyle.textContent = "#mp-root.mp-world-map #mp-fog,#mp-root.mp-world-map #mp-light,#mp-root.mp-world-map #mp-walls-vis,#mp-root.mp-world-map #mp-secret-view,#mp-root.mp-world-map #mp-speed-wrap,#mp-root.mp-world-map #mp-reset-fog,#mp-root.mp-world-map #mp-clear-fog,#mp-root.mp-world-map #mp-clear-walls,#mp-root.mp-world-map #mp-clear-edges,#mp-root.mp-world-map #mp-block,#mp-root.mp-world-map #mp-lr {display:none !important;}#mp-root.mp-world-map.editor-mode .mp-world-action {display:block !important;}#mp-root.editor-mode #mp-world-local-portal {display:block !important;}#mp-root:not(.mp-world-map).editor-mode #mp-world-move,#mp-root:not(.mp-world-map).editor-mode #mp-world-portal {display:none !important;}#mp-root.mp-world-map.editor-mode #mp-tools {display:grid !important;grid-template-columns:1fr 1fr;gap:6px;}#mp-root.mp-world-map.editor-mode #mp-tools button {width:100%;box-sizing:border-box;}#mp-root.mp-world-map #mp-side {display:none !important;}#mp-root.mp-world-map #mp-world-move.active{background:rgba(35,155,100,.32);border-color:#70d6a2;}#mp-root.mp-world-map #mp-cv {display:block;width:100%;height:100%;cursor:crosshair;touch-action:none;}";
      worldRoot.appendChild(worldStyle);
      var blockLabel = $("#mp-block");
      if (blockLabel && blockLabel.parentElement) blockLabel.parentElement.style.display = "none";
      var radiusInput = $("#mp-lr");
      if (radiusInput && radiusInput.parentElement) radiusInput.parentElement.style.display = "none";
      var speedWrap = $("#mp-speed-wrap");
      if (speedWrap) speedWrap.style.display = "none";
      if (appMode !== "editor") zoom = FLANAESS_ZOOM;
    }
    if ($("#mp-speed")) $("#mp-speed").oninput = function() {
      travelSpeedMilesPerDay = Math.max(0, Number(this.value) || 0);
      draw();
    };
    $("#mp-tools").onclick = function(e) {
      var b = e.target.closest("button");
      if (b) {
        setTool(b.dataset.t);
        setMenu(false);
      }
    };
    $("#mp-grid").onclick = function() {
      showGrid = !showGrid;
      this.classList.toggle("on", showGrid);
      draw();
    };
    $("#mp-fog").onclick = function() {
      showFog = !showFog;
      this.classList.toggle("on", showFog);
      draw();
    };
    $("#mp-light").onclick = function() {
      dynLight = !dynLight;
      this.classList.toggle("on", dynLight);
      draw();
    };
    $("#mp-walls-vis").onclick = function() {
      showWalls = !showWalls;
      this.classList.toggle("on", showWalls);
      draw();
    };
    $("#mp-block").onchange = function() {
      blockMove = this.checked;
    };
    $("#mp-lr").onchange = function() {
      lightRadius = +this.value || 0;
      var p = state.tokens.find(function(t) {
        return t.tipo === "player";
      });
      if (p) {
        p.luz = lightRadius;
        save();
      }
      centerCameraOnPlayer();
      draw();
    };
    $("#mp-reset-fog").onclick = function() {
      if (appConfirmMessage("msg083", "Cobrir o mapa com névoa novamente?")) {
        state.fog = makeGrid(1);
        save();
        draw();
      }
    };
    $("#mp-clear-fog").onclick = function() {
      if (appConfirmMessage("msg084", "Revelar o mapa inteiro? A névoa será removida de todas as células.")) {
        state.fog = makeGrid(0);
        save();
        draw();
      }
    };
    $("#mp-clear-walls").onclick = function() {
      if (appConfirmMessage("msg085", "Apagar todas as paredes das células?")) {
        state.walls = makeGrid(0);
        state.wallMeta = makeArr(COLS * ROWS, null);
        save();
        draw();
      }
    };
    $("#mp-clear-edges").onclick = function() {
      if (appConfirmMessage("msg086", "Apagar todos os muros e portas de linha?")) {
        state.hEdges = makeArr(COLS * (ROWS + 1), 0);
        state.vEdges = makeArr((COLS + 1) * ROWS, 0);
        state.hEdgeMeta = makeArr(COLS * (ROWS + 1), null);
        state.vEdgeMeta = makeArr((COLS + 1) * ROWS, null);
        save();
        draw();
      }
    };
    var secretViewButton = $("#mp-secret-view");
    if (secretViewButton) {
      secretViewButton.style.display = isHexMap() ? "none" : "";
      secretViewButton.classList.toggle("on", showSecrets);
      secretViewButton.onclick = function() {
        showSecrets = !showSecrets;
        this.classList.toggle("on", showSecrets);
        draw();
      };
    }
    $("#mp-zo").onclick = function() {
      if (appMode === "editor") changeCameraZoom(1 / 1.2);
      else if (isHexMap()) {
        zoom = FLANAESS_ZOOM;
        draw();
      } else changeCameraZoom(1 / 1.2);
    };
    $("#mp-zi").onclick = function() {
      if (appMode === "editor") changeCameraZoom(1.2);
      else if (isHexMap()) {
        zoom = FLANAESS_ZOOM;
        draw();
      } else changeCameraZoom(1.2);
    };
    $("#mp-bestiary").onclick = function() {
      openBestiary(null);
    };
    if (window.Bestiary && !bestiaryHooked) {
      bestiaryHooked = true;
      window.Bestiary.onChange(function() {
        try {
          if (R && cv) {
            updateDetailPanel();
            draw();
          }
        } catch (err) {
        }
      });
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("resize", onWindowResize);
    [
      "wall",
      "erasewall",
      "muro",
      "porta",
      "paredeSecreta",
      "portaSecreta",
      "portaTrancada",
      "portaEmperrada",
      "paredeIlusoria",
      "muralhaForca",
      "paredeMagica",
      "searchSecret",
      "investigateMechanism",
      "damageStructure",
      "eraseedge",
      "editStructure",
      "reveal",
      "hide",
      "token",
      "measure",
      "spawn",
      "localPortal"
    ].forEach(function(name) {
      var btn = R.querySelector('#mp-tools button[data-t="' + name + '"]');
      if (btn) btn.style.display = isHexMap() ? "none" : "";
    });
    var clearEdgesButton = $("#mp-clear-edges");
    if (clearEdgesButton) clearEdgesButton.style.display = isHexMap() ? "none" : "";
    setMode(appMode);
    $("#mp-grid").classList.toggle("on", showGrid);
    $("#mp-fog").classList.toggle("on", showFog);
    $("#mp-light").classList.toggle("on", dynLight);
    $("#mp-walls-vis").classList.toggle("on", showWalls);
    function tryMonsters() {
      renderMonsterList($("#mp-q") ? $("#mp-q").value : "");
    }
    tryMonsters();
    if (window.MONSTERS_READY) window.MONSTERS_READY.then(tryMonsters);
    loadBackgrounds(function() {
      if (!cv) return;
      if (isHexMap()) {
        if (appMode !== "editor") zoom = FLANAESS_ZOOM;
        focusCameraOnPlayer(null, null, true);
      } else {
        centerCameraOnPlayer(null, null, true);
      }
      draw();
    });
    if (!isHexMap()) {
      centerCameraOnPlayer(null, null, true);
      checkPassiveSecretDetection(currentPlayer());
      window.requestAnimationFrame(function() {
        centerCameraOnPlayer(null, null, true);
        draw();
      });
    }
    draw();
  }
function unmount() {
    mountRequestId++;
    if (autoCombatTimer) {
      window.clearInterval(autoCombatTimer);
      autoCombatTimer = null;
    }
    if (mapInventoryInstance) {
      mapInventoryInstance.destruir();
      mapInventoryInstance = null;
      mapInventoryMode = null;
    }
    stopWorldTravel(false);
    stopKeyMove();
    pendingLocalPortal = null;
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onWindowBlur);
    window.removeEventListener("resize", onWindowResize);
    R = null;
    cv = null;
    cx = null;
    bgImages = [];
    detailCache = {};
    previewPointer = null;
  }
window.MapEditor = { mount, unmount };
