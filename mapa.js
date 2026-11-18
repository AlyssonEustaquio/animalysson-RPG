(function () {
'use strict';

var MAPS = {
  tumba: {
    nome: 'Tumba dos Horrores', icone: '☠',
    key: 'animalysson-vtt-v4',
    stateFile: 'mapas/tumba-dos-horrores/Tumba dos Horrores.json',
    cell: 36, cols: 72, rows: 95, w: 2592, h: 3420,
    spawn: { x: 35, y: 88 },
    parts: [
      { src: 'mapas/tumba-dos-horrores/hi_part1.webp', x: 0,    y: 0,    w: 1332, h: 1692 },
      { src: 'mapas/tumba-dos-horrores/hi_part2.webp', x: 1332, y: 0,    w: 1260, h: 1692 },
      { src: 'mapas/tumba-dos-horrores/hi_part3.webp', x: 0,    y: 1692, w: 1332, h: 1728 },
      { src: 'mapas/tumba-dos-horrores/hi_part4.webp', x: 1332, y: 1692, w: 1260, h: 1728 }
    ]
  },
  flanaess: {
    nome: 'Flanaess 598 CY', icone: '🌍',
    key: 'animalysson-vtt-flanaess-v1',
    stateFile: 'mapas/flanaess_mapa/Flanaess 598 CY.json',
    cell: 40, cols: 220, rows: 262, w: 8800, h: 10480,
    spawn: { x: 110, y: 131 },
    fit: true,
    maxZoom: 4,
    // Escala exclusiva de Flanaess. A imagem lógica tem 1/4 da resolução de referência.
    // Grade pointy-top: a distância entre centros de hexágonos vizinhos é igual à largura.
    scale: {
      referenceWidth: 35200,
      referenceHeight: 41920,
      referencePixelsPerLogicalPixel: 4,
      pixelsPerMile: 8,
      bars: [
        { miles: 50, referencePixels: 400 },
        { miles: 100, referencePixels: 800 }
      ],
      hexagons: {
        large: { miles: 30, referenceWidthPixels: 240 },
        small: { miles: 6, referenceWidthPixels: 48 }
      }
    },
    detail: { src: 'mapas/flanaess_mapa/detalhe/d_{r}_{c}.webp', n: 8, minZoom: 1.1 },
    parts: [
      { src: 'mapas/flanaess_mapa/hi_part1.webp', x: 0,    y: 0,     w: 4400, h: 5240 },
      { src: 'mapas/flanaess_mapa/hi_part2.webp', x: 4400, y: 0,     w: 4400, h: 5240 },
      { src: 'mapas/flanaess_mapa/hi_part3.webp', x: 0,    y: 5240,  w: 4400, h: 5240 },
      { src: 'mapas/flanaess_mapa/hi_part4.webp', x: 4400, y: 5240,  w: 4400, h: 5240 }
    ]
  }
};
var MAP_ID_KEY = 'animalysson-vtt-mapa-atual';
var HEX_SIZE_KEY = 'animalysson-vtt-flanaess-hex-size';
var CUSTOM_MAPS_KEY = 'animalysson-vtt-mapas-customizados-v1';
var DELETED_CUSTOM_MAPS_KEY = 'animalysson-vtt-mapas-excluidos-v1';
var MAP_CATALOG_FILE = 'mapas/mapas.json';
var mapId = 'tumba', MAPINFO = null;
var preferredMapId = 'tumba';
var hexSize = 'small';
var KEY, CELL, COLS, ROWS, MAP_W, MAP_H, PARTS;
try { preferredMapId = localStorage.getItem(MAP_ID_KEY) || 'tumba'; mapId = preferredMapId; } catch (e) {}

function serializableMapConfig(info) {
  var copy = JSON.parse(JSON.stringify(info || {}));
  (copy.parts || []).forEach(function (part) { delete part.localSrc; });
  if (copy.detail) delete copy.detail.runtimeTiles;
  return copy;
}
function customMapEntries() {
  return Object.keys(MAPS).filter(function (id) { return !!MAPS[id].custom; }).map(function (id) {
    return { id: id, config: serializableMapConfig(MAPS[id]) };
  });
}
function persistCustomMaps() {
  try { localStorage.setItem(CUSTOM_MAPS_KEY, JSON.stringify(customMapEntries())); } catch (e) {}
}
function deletedCustomMapIds() {
  try {
    var ids = JSON.parse(localStorage.getItem(DELETED_CUSTOM_MAPS_KEY) || '[]');
    return Array.isArray(ids) ? ids : [];
  } catch (e) { return []; }
}
function isCustomMapDeleted(id) {
  return deletedCustomMapIds().indexOf(id) >= 0;
}
function rememberDeletedCustomMap(id) {
  var ids = deletedCustomMapIds();
  if (ids.indexOf(id) < 0) ids.push(id);
  try { localStorage.setItem(DELETED_CUSTOM_MAPS_KEY, JSON.stringify(ids)); } catch (e) {}
}
function clearDeletedCustomMap(id) {
  var ids = deletedCustomMapIds().filter(function (savedId) { return savedId !== id; });
  try { localStorage.setItem(DELETED_CUSTOM_MAPS_KEY, JSON.stringify(ids)); } catch (e) {}
}
function registerCustomMap(id, config, runtimeImageSrc) {
  if (!id || !config || !config.nome || !config.w || !config.h || !config.parts || !config.parts.length) return false;
  var saved = serializableMapConfig(config);
  saved.custom = true;
  if (runtimeImageSrc && saved.parts[0]) saved.parts[0].localSrc = runtimeImageSrc;
  if (config.detail && config.detail.runtimeTiles && saved.detail) {
    saved.detail.runtimeTiles = config.detail.runtimeTiles;
  }
  MAPS[id] = saved;
  return true;
}
function loadStoredCustomMaps() {
  try {
    var entries = JSON.parse(localStorage.getItem(CUSTOM_MAPS_KEY) || '[]');
    if (!Array.isArray(entries)) return;
    entries.forEach(function (entry) {
      if (entry && entry.id && !MAPS[entry.id] && !isCustomMapDeleted(entry.id)) registerCustomMap(entry.id, entry.config);
    });
  } catch (e) {}
}
loadStoredCustomMaps();
// Flanaess usa exclusivamente hexágonos pequenos de 6 milhas (48 px de referência).
// Ignora preferências antigas de tamanho para impedir retorno à grade grande.
var FLANAESS_GRID_MODE = 'hex-small-6mi';
var FLANAESS_ZOOM = 3; // Zoom fixo em 300%.

// Mensagens editáveis: as preferências são globais e compartilhadas entre os mapas.
var MESSAGE_SETTINGS_KEY = 'animalysson-vtt-messages-v1';
var MESSAGE_CATALOG = [{"id":"msg001","type":"alert","dynamic":false,"default":"Ainda não há mapas adicionados pelo botão +.","pattern":"Ainda não há mapas adicionados pelo botão +."},{"id":"msg002","type":"alert","dynamic":false,"default":"Os mapas originais do projeto não podem ser excluídos. Este botão remove somente mapas adicionados pelo botão +.","pattern":"Os mapas originais do projeto não podem ser excluídos. Este botão remove somente mapas adicionados pelo botão +."},{"id":"msg003","type":"confirm","dynamic":true,"default":"{mensagem}","pattern":"Excluir o mapa \" / \"? / Ele será removido do seletor e os dados salvos deste mapa serão apagados deste navegador. / Um novo mapas.json será baixado para atualizar o catálogo no GitHub. Os arquivos já publicados na pasta mapas/ / / não são apagados automaticamente; remova essa pasta do GitHub se também quiser excluir as imagens e o JSON. …"},{"id":"msg004","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"Mapa excluído do seletor neste navegador. O catálogo mapas.json atualizado foi baixado. Publique esse arquivo em mapas/mapas.json no GitHub e, se desejar apagar também as imagens e dados antigos, exclua a pasta mapas/ … / do repositório. …"},{"id":"msg005","type":"alert","dynamic":false,"default":"Selecione um arquivo de imagem válido.","pattern":"Selecione um arquivo de imagem válido."},{"id":"msg006","type":"prompt","dynamic":false,"default":"Nome do novo mapa:","pattern":"Nome do novo mapa:"},{"id":"msg007","type":"prompt","dynamic":false,"default":"Tamanho da célula da grade em pixels:","pattern":"Tamanho da célula da grade em pixels:"},{"id":"msg008","type":"alert","dynamic":false,"default":"Informe um tamanho de célula entre 8 e 512 pixels.","pattern":"Informe um tamanho de célula entre 8 e 512 pixels."},{"id":"msg009","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"Mapa adicionado e otimizado! … Extraia o ZIP dentro de \" … \". Depois baixe o catálogo mapas.json pelo menu e coloque-o em \"mapas/mapas.json\". Use Salvar mapa para baixar \" … \" na mesma pasta. …"},{"id":"msg010","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"Não foi possível otimizar a imagem do mapa. …"},{"id":"msg011","type":"alert","dynamic":false,"default":"Não foi possível abrir essa imagem.","pattern":"Não foi possível abrir essa imagem."},{"id":"msg012","type":"alert","dynamic":false,"default":"Escolha dois cantos diferentes do grid.","pattern":"Escolha dois cantos diferentes do grid."},{"id":"msg013","type":"prompt","dynamic":true,"default":"{mensagem}","pattern":"Texto variável (definido pelo contexto)"},{"id":"msg014","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"Informe um valor entre … e … . …"},{"id":"msg015","type":"prompt","dynamic":true,"default":"{mensagem}","pattern":"Texto variável (definido pelo contexto)"},{"id":"msg016","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"Percepção passiva / : você percebe / e / . Encontrar não revela como abrir; investigue o mecanismo. …"},{"id":"msg017","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"Sucesso! Você encontrou: / , / . Ainda é necessário descobrir o mecanismo. / Nenhuma passagem secreta foi encontrada nesta seção de aproximadamente 3 metros. …"},{"id":"msg018","type":"alert","dynamic":false,"default":"Você identifica a ilusão. Ela não bloqueia passagem.","pattern":"Você identifica a ilusão. Ela não bloqueia passagem."},{"id":"msg019","type":"alert","dynamic":false,"default":"Não há um mecanismo secreto nesta linha.","pattern":"Não há um mecanismo secreto nesta linha."},{"id":"msg020","type":"alert","dynamic":false,"default":"Primeiro encontre a passagem com Percepção.","pattern":"Primeiro encontre a passagem com Percepção."},{"id":"msg021","type":"alert","dynamic":false,"default":"O mecanismo desta passagem já foi descoberto.","pattern":"O mecanismo desta passagem já foi descoberto."},{"id":"msg022","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"Mecanismo descoberto! Agora você pode acionar a passagem. …"},{"id":"msg023","type":"confirm","dynamic":false,"default":"Já existe uma parede ou porta nesta linha. Substituir?","pattern":"Já existe uma parede ou porta nesta linha. Substituir?"},{"id":"msg024","type":"prompt","dynamic":false,"default":"Descreva como o mecanismo é acionado (ex.: girar uma tocha, puxar um livro, apertar uma pedra):","pattern":"Descreva como o mecanismo é acionado (ex.: girar uma tocha, puxar um livro, apertar uma pedra):"},{"id":"msg025","type":"prompt","dynamic":false,"default":"Complexidade: 1 = simples (1 ação); 2 = complexa (1 minuto).","pattern":"Complexidade: 1 = simples (1 ação); 2 = complexa (1 minuto)."},{"id":"msg026","type":"prompt","dynamic":false,"default":"Nome da chave que abre esta porta (deixe em branco se não houver chave específica):","pattern":"Nome da chave que abre esta porta (deixe em branco se não houver chave específica):"},{"id":"msg027","type":"confirm","dynamic":false,"default":"Esta fechadura possui Tranca Arcana? (Cancelar = não)","pattern":"Esta fechadura possui Tranca Arcana? (Cancelar = não)"},{"id":"msg028","type":"prompt","dynamic":false,"default":"Tipo de bloqueio: 1 = emperrada (Força/Atletismo); 2 = barrada por dentro (ação Utilizar do lado da barra).","pattern":"Tipo de bloqueio: 1 = emperrada (Força/Atletismo); 2 = barrada por dentro (ação Utilizar do lado da barra)."},{"id":"msg029","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"Estrutura criada: / parede secreta / porta secreta / porta trancada / porta emperrada / parede ilusória / Muralha de Energia / parede mágica / . …"},{"id":"msg030","type":"alert","dynamic":false,"default":"Você não percebe nada incomum nesta parte da parede.","pattern":"Você não percebe nada incomum nesta parte da parede."},{"id":"msg031","type":"alert","dynamic":false,"default":"Você encontrou a passagem, mas ainda não descobriu como acioná-la. Use Investigar mecanismo.","pattern":"Você encontrou a passagem, mas ainda não descobriu como acioná-la. Use Investigar mecanismo."},{"id":"msg032","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"O mecanismo foi acionado e a passagem secreta se abriu. / A passagem secreta foi fechada. …"},{"id":"msg033","type":"alert","dynamic":false,"default":"A porta foi fechada.","pattern":"A porta foi fechada."},{"id":"msg034","type":"alert","dynamic":false,"default":"A Tranca Arcana está suprimida; a porta pode ser aberta durante os 10 minutos restantes.","pattern":"A Tranca Arcana está suprimida; a porta pode ser aberta durante os 10 minutos restantes."},{"id":"msg035","type":"prompt","dynamic":true,"default":"{mensagem}","pattern":"Como deseja abrir a porta trancada? 1 = Ferramentas de Ladrão (Destreza/Prestidigitação) — / complex / 1 minuto / 1 ação / 2 = Forçar fisicamente (Força/Atletismo) / CHAVE = usar a chave ( / ) / Digite ARROMBAR para usar a magia Knock/Arrombar. …"},{"id":"msg036","type":"alert","dynamic":false,"default":"Arrombar abriu a porta. A Tranca Arcana fica suprimida por 10 minutos.","pattern":"Arrombar abriu a porta. A Tranca Arcana fica suprimida por 10 minutos."},{"id":"msg037","type":"alert","dynamic":false,"default":"Arrombar abriu instantaneamente a fechadura mundana.","pattern":"Arrombar abriu instantaneamente a fechadura mundana."},{"id":"msg038","type":"prompt","dynamic":false,"default":"Digite o nome da chave utilizada:","pattern":"Digite o nome da chave utilizada:"},{"id":"msg039","type":"alert","dynamic":false,"default":"A chave física não supera a Tranca Arcana. Use um teste com CD +10 ou a magia Arrombar.","pattern":"A chave física não supera a Tranca Arcana. Use um teste com CD +10 ou a magia Arrombar."},{"id":"msg040","type":"alert","dynamic":false,"default":"A chave correta destranca e abre a porta.","pattern":"A chave correta destranca e abre a porta."},{"id":"msg041","type":"alert","dynamic":false,"default":"Esta chave não corresponde à fechadura.","pattern":"Esta chave não corresponde à fechadura."},{"id":"msg042","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"Sucesso! Você força a porta e consegue abri-la. / Sucesso! Você vence a fechadura e abre a porta. …"},{"id":"msg043","type":"alert","dynamic":false,"default":"Falha. A porta continua trancada.","pattern":"Falha. A porta continua trancada."},{"id":"msg044","type":"alert","dynamic":false,"default":"A porta foi fechada.","pattern":"A porta foi fechada."},{"id":"msg045","type":"confirm","dynamic":false,"default":"O personagem está do lado em que consegue alcançar e levantar a barra? (OK = ação Utilizar)","pattern":"O personagem está do lado em que consegue alcançar e levantar a barra? (OK = ação Utilizar)"},{"id":"msg046","type":"alert","dynamic":false,"default":"Você levanta a barra com uma ação Utilizar e abre a porta.","pattern":"Você levanta a barra com uma ação Utilizar e abre a porta."},{"id":"msg047","type":"alert","dynamic":false,"default":"Você força a porta e consegue abri-la.","pattern":"Você força a porta e consegue abri-la."},{"id":"msg048","type":"alert","dynamic":false,"default":"Muralha de Energia: invisível, imune a dano comum e bloqueia a passagem. Só Desintegrar a destrói; teletransporte pode atravessá-la.","pattern":"Muralha de Energia: invisível, imune a dano comum e bloqueia a passagem. Só Desintegrar a destrói; teletransporte pode atravessá-la."},{"id":"msg049","type":"alert","dynamic":false,"default":"Você percebe a ilusão: ela não bloqueia a passagem.","pattern":"Você percebe a ilusão: ela não bloqueia a passagem."},{"id":"msg050","type":"alert","dynamic":true,"default":"{mensagem}","pattern":". Use Atacar estrutura para tentar destruí-la. …"},{"id":"msg051","type":"prompt","dynamic":false,"default":"Muralha de Energia só pode ser destruída por Desintegrar. Digite DESINTEGRAR para aplicar a magia:","pattern":"Muralha de Energia só pode ser destruída por Desintegrar. Digite DESINTEGRAR para aplicar a magia:"},{"id":"msg052","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"foi dissipada. …"},{"id":"msg053","type":"alert","dynamic":false,"default":"A barreira é ilusória; não há estrutura física para destruir.","pattern":"A barreira é ilusória; não há estrutura física para destruir."},{"id":"msg054","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"Ataque não atingiu a CA … . …"},{"id":"msg055","type":"prompt","dynamic":false,"default":"Tipo de dano (cortante, contundente, perfurante, fogo, ácido, elétrico, psíquico, venenoso etc.):","pattern":"Tipo de dano (cortante, contundente, perfurante, fogo, ácido, elétrico, psíquico, venenoso etc.):"},{"id":"msg056","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"Este material é imune a dano … . …"},{"id":"msg057","type":"confirm","dynamic":false,"default":"Ferro/aço resiste a perfuração comum. Este ataque é mágico? (Cancelar = não)","pattern":"Ferro/aço resiste a perfuração comum. Este ataque é mágico? (Cancelar = não)"},{"id":"msg058","type":"alert","dynamic":false,"default":"A estrutura é imune a perfuração não mágica.","pattern":"A estrutura é imune a perfuração não mágica."},{"id":"msg059","type":"confirm","dynamic":false,"default":"O ataque é mágico? (Cancelar = não)","pattern":"O ataque é mágico? (Cancelar = não)"},{"id":"msg060","type":"alert","dynamic":false,"default":"Este material não sofre dano de armas não mágicas.","pattern":"Este material não sofre dano de armas não mágicas."},{"id":"msg061","type":"confirm","dynamic":false,"default":"O personagem é proficiente com Ferramentas de Pedreiro?","pattern":"O personagem é proficiente com Ferramentas de Pedreiro?"},{"id":"msg062","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"O golpe não alcançou o limiar de dano … . Nenhum PV foi removido. …"},{"id":"msg063","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"foi destruído! …"},{"id":"msg064","type":"alert","dynamic":false,"default":"Não há parede ou porta nesta linha.","pattern":"Não há parede ou porta nesta linha."},{"id":"msg065","type":"alert","dynamic":false,"default":"A barreira é uma ilusão e não possui PV.","pattern":"A barreira é uma ilusão e não possui PV."},{"id":"msg066","type":"alert","dynamic":false,"default":"Não há uma parede nesta quadrícula.","pattern":"Não há uma parede nesta quadrícula."},{"id":"msg067","type":"confirm","dynamic":false,"default":"Remover o teleporte deste hexágono?","pattern":"Remover o teleporte deste hexágono?"},{"id":"msg068","type":"confirm","dynamic":false,"default":"Remover este par de teleporte? Os pontos A e B serão apagados.","pattern":"Remover este par de teleporte? Os pontos A e B serão apagados."},{"id":"msg069","type":"alert","dynamic":false,"default":"Este local já faz parte de outro teleporte. Escolha um ponto B diferente.","pattern":"Este local já faz parte de outro teleporte. Escolha um ponto B diferente."},{"id":"msg070","type":"alert","dynamic":false,"default":"Este local já possui um teleporte para outro mapa. Escolha outro ponto.","pattern":"Este local já possui um teleporte para outro mapa. Escolha outro ponto."},{"id":"msg071","type":"alert","dynamic":false,"default":"Não é possível criar um teleporte em uma célula bloqueada. Escolha um espaço livre.","pattern":"Não é possível criar um teleporte em uma célula bloqueada. Escolha um espaço livre."},{"id":"msg072","type":"alert","dynamic":false,"default":"Ponto A definido. Agora clique no local do ponto B para concluir o teleporte. Pressione Esc para cancelar.","pattern":"Ponto A definido. Agora clique no local do ponto B para concluir o teleporte. Pressione Esc para cancelar."},{"id":"msg073","type":"alert","dynamic":false,"default":"Escolha um ponto B diferente do ponto A.","pattern":"Escolha um ponto B diferente do ponto A."},{"id":"msg074","type":"alert","dynamic":false,"default":"Este local já possui um teleporte. Escolha outro ponto para B.","pattern":"Este local já possui um teleporte. Escolha outro ponto para B."},{"id":"msg075","type":"alert","dynamic":false,"default":"Adicione outro mapa primeiro usando o botão + do seletor.","pattern":"Adicione outro mapa primeiro usando o botão + do seletor."},{"id":"msg076","type":"prompt","dynamic":true,"default":"{mensagem}","pattern":"Escolha o mapa de destino digitando o número: …"},{"id":"msg077","type":"alert","dynamic":false,"default":"Destino inválido. Nenhum teleporte foi criado.","pattern":"Destino inválido. Nenhum teleporte foi criado."},{"id":"msg078","type":"alert","dynamic":false,"default":"O mapa de destino deste teleporte não está disponível. Atualize o catálogo mapas/mapas.json.","pattern":"O mapa de destino deste teleporte não está disponível. Atualize o catálogo mapas/mapas.json."},{"id":"msg079","type":"alert","dynamic":false,"default":"Ao tocar a parede, você percebe que ela é uma ilusão e pode atravessá-la.","pattern":"Ao tocar a parede, você percebe que ela é uma ilusão e pode atravessá-la."},{"id":"msg080","type":"alert","dynamic":false,"default":"Você toca uma barreira invisível: Muralha de Energia.","pattern":"Você toca uma barreira invisível: Muralha de Energia."},{"id":"msg081","type":"alert","dynamic":false,"default":"Não é possível iniciar em cima de uma parede.","pattern":"Não é possível iniciar em cima de uma parede."},{"id":"msg082","type":"prompt","dynamic":false,"default":"Nome do token:","pattern":"Nome do token:"},{"id":"msg083","type":"confirm","dynamic":false,"default":"Cobrir o mapa com névoa novamente?","pattern":"Cobrir o mapa com névoa novamente?"},{"id":"msg084","type":"confirm","dynamic":false,"default":"Revelar o mapa inteiro? A névoa será removida de todas as células.","pattern":"Revelar o mapa inteiro? A névoa será removida de todas as células."},{"id":"msg085","type":"confirm","dynamic":false,"default":"Apagar todas as paredes das células?","pattern":"Apagar todas as paredes das células?"},{"id":"msg086","type":"confirm","dynamic":false,"default":"Apagar todos os muros e portas de linha?","pattern":"Apagar todos os muros e portas de linha?"},{"id":"msg087","type":"alert","dynamic":false,"default":"Você não conseguiu identificar a ilusão.","pattern":"Você não conseguiu identificar a ilusão."},{"id":"msg088","type":"alert","dynamic":false,"default":"Você encontrou a passagem, mas ainda não descobriu como abri-la.","pattern":"Você encontrou a passagem, mas ainda não descobriu como abri-la."},{"id":"msg089","type":"alert","dynamic":false,"default":"A porta não cede.","pattern":"A porta não cede."},{"id":"msg090","type":"alert","dynamic":false,"default":"Nenhum dano foi causado.","pattern":"Nenhum dano foi causado."},{"id":"msg091","type":"alert","dynamic":true,"default":"{mensagem}","pattern":"[nome da estrutura] sofreu [dano] de dano. PV restantes: [PV atual]/[PV máximo]."},{"id":"msg092","type":"confirm","dynamic":false,"default":"Restaurar os textos originais de todas as mensagens?","pattern":"Restaurar os textos originais de todas as mensagens?"},{"id":"msg093","type":"alert","dynamic":false,"default":"Não foi possível salvar as mensagens neste navegador.","pattern":"Não foi possível salvar as mensagens neste navegador."}];
var MESSAGE_OVERRIDES = {};
try {
  var savedMessageOverrides = JSON.parse(localStorage.getItem(MESSAGE_SETTINGS_KEY) || '{}');
  if (savedMessageOverrides && typeof savedMessageOverrides === 'object' && !Array.isArray(savedMessageOverrides)) {
    MESSAGE_OVERRIDES = savedMessageOverrides;
  }
} catch (messageLoadError) { MESSAGE_OVERRIDES = {}; }
function resolveAppMessage(id, originalMessage) {
  var original = String(originalMessage == null ? '' : originalMessage);
  if (!Object.prototype.hasOwnProperty.call(MESSAGE_OVERRIDES, id)) return original;
  var configured = String(MESSAGE_OVERRIDES[id] == null ? '' : MESSAGE_OVERRIDES[id]);
  return configured.replace(/\{mensagem\}|\{original\}|\{textoOriginal\}/gi, original);
}
function appAlertMessage(id, message) {
  var resolved = resolveAppMessage(id, message);
  // Campo vazio suprime completamente avisos informativos.
  if (!resolved.trim()) return;
  window.alert(resolved);
}
function appConfirmMessage(id, message) {
  // Mesmo sem texto, a confirmação permanece para não executar ações destrutivas sem consentimento.
  return window.confirm(resolveAppMessage(id, message));
}
function appPromptMessage(id, message, defaultValue) {
  // Mesmo sem texto, o campo de entrada permanece para que a operação continue utilizável.
  return window.prompt(resolveAppMessage(id, message), defaultValue);
}


function isHexMap() { return !!(MAPINFO && MAPINFO.scale && mapId === 'flanaess'); }
function hexMetrics() {
  if (!isHexMap()) return null;
  var h = MAPINFO.scale.hexagons[hexSize];
  var width = h.referenceWidthPixels / MAPINFO.scale.referencePixelsPerLogicalPixel;
  var height = width * 2 / Math.sqrt(3);
  return { width: width, height: height, rowStep: height * 0.75, miles: h.miles };
}
function applyMap(id) {
  if (!MAPS[id]) id = 'tumba';
  mapId = id; MAPINFO = MAPS[id];
  MAP_W = MAPINFO.w; MAP_H = MAPINFO.h; PARTS = MAPINFO.parts;
  KEY = MAPINFO.key;
  if (isHexMap()) {
    var hm = hexMetrics();
    CELL = hm.width;
    COLS = Math.ceil(MAP_W / hm.width) + 1;
    ROWS = Math.ceil(MAP_H / hm.rowStep) + 1;
  } else {
    CELL = MAPINFO.cell; COLS = MAPINFO.cols; ROWS = MAPINFO.rows;
  }
}
function mapOptions() {
  return Object.keys(MAPS).map(function (id) {
    return '<option value="' + esc(id) + '"' + (id === mapId ? ' selected' : '') + '>' + esc(MAPS[id].icone + ' ' + MAPS[id].nome) + '</option>';
  }).join('');
}
applyMap(mapId);

var EDGE_NONE = 0, EDGE_MURO = 1, EDGE_DOOR_C = 2, EDGE_DOOR_O = 3;
var EDGE_SECRET_WALL = 4, EDGE_SECRET_DOOR_C = 5, EDGE_SECRET_DOOR_O = 6;
var EDGE_LOCKED_DOOR = 7, EDGE_JAMMED_DOOR = 8, EDGE_ILLUSION_WALL = 9;
var EDGE_FORCE_WALL = 10, EDGE_MAGIC_WALL = 11;

var SIZE_SQ = {
  Tiny:1, Small:1, Medium:1, Large:2, Huge:3, Gargantuan:4,
  Minúsculo:1, Pequeno:1, Médio:1, Grande:2, Enorme:3, Imenso:4
};

var R = null, cv = null, cx = null;
var zoom = 0.35, ox = 40, oy = 40;
var tool = 'select';
var appMode = 'player'; // O aplicativo sempre inicia no modo Jogador.
var pendingStructureStart = null; // primeiro canto ao desenhar parede/porta
var drag = null, space = false;
var showGrid = false, showFog = true, dynLight = true, showWalls = true;
var showSecrets = false; // visão do Mestre: exibe estruturas secretas ainda não descobertas.
var lightRadius = 6;
var selected = null;
var measurePts = null;
var pendingMonster = null;
var pendingLocalPortal = null; // primeiro ponto enquanto um par de teleporte é configurado
var blockMove = true;
var previewPointer = null;
var worldTravelRaf = null;   // id do requestAnimationFrame da viagem
var worldTravelStep = null;  // passo em andamento: { from, to, toPt, t0 }
var worldTravelPos = null;   // posição visual (px do mapa) do personagem durante a viagem
var worldTravelCarry = null; // instante em que o passo anterior terminou (evita engasgo entre hexágonos)
var worldTravelPath = [];
var worldTravelTarget = null;
var KEY_STEP_MS = 140;       // tempo para andar 1 quadrado com as setas (velocidade constante)
var MOVE_KEYS = { ArrowLeft: 1, ArrowRight: 1, ArrowUp: 1, ArrowDown: 1 };
var keysHeld = {};           // setas atualmente pressionadas
var keyMoveRaf = null;       // requestAnimationFrame do movimento por teclado
var keyMoveStep = null;      // passo em andamento: { from, to, dur, t0 }
var keyMoveVis = null;       // posição visual (px do mapa) do personagem enquanto desliza
var keyMoveCarry = null;     // instante em que o passo anterior terminou (sem engasgo entre quadrados)
var clickMoveExitPending = false; // sai para o mapa-múndi somente depois de alcançar a borda
var keyMoveLastSave = 0;
var clickMovePath = [];      // caminho calculado ao clicar em um tile iluminado
var WORLD_TRAVEL_STEP_MS = 2000; // tempo para atravessar 1 hexágono ao clicar no mapa-múndi
var HEX_KEY_STEP_MS = WORLD_TRAVEL_STEP_MS; // setas usam exatamente a mesma velocidade do clique

var state = load() || defaultState();
// Migra tokens salvos na antiga grade quadrada sem perder as áreas de névoa já reveladas.
function migrateFlanaessState(s) {
  if (!isHexMap() || !s) return s;
  if (s._legacySquareTokens) {
    (s.tokens || []).forEach(function (t) {
      var oldWorldX = (Number(t.x) + 0.5) * MAPS.flanaess.cell;
      var oldWorldY = (Number(t.y) + 0.5) * MAPS.flanaess.cell;
      var migrated = worldToCell(oldWorldX, oldWorldY);
      t.x = migrated.x; t.y = migrated.y;
    });
    delete s._legacySquareTokens;
  } else if (s.gridMode && s.gridMode !== FLANAESS_GRID_MODE) {
    var oldMode = s.gridMode === 'hex-small' ? 'small' : (s.gridMode === 'hex-large' ? 'large' : null);
    if (oldMode) {
      // Dimensões da grade anterior: pequeno=96 px e grande=240 px de referência.
      var oldReferenceWidth = oldMode === 'small' ? 96 : 240;
      var oldWidth = oldReferenceWidth / MAPINFO.scale.referencePixelsPerLogicalPixel;
      var oldHeight = oldWidth * 2 / Math.sqrt(3), oldStep = oldHeight * 0.75;
      (s.tokens || []).forEach(function (t) {
        var oldWorldX = oldWidth / 2 + t.x * oldWidth + (t.y & 1) * oldWidth / 2;
        var oldWorldY = oldHeight / 2 + t.y * oldStep;
        var migrated = worldToCell(oldWorldX, oldWorldY);
        t.x = migrated.x; t.y = migrated.y;
      });
    }
  }
  s.gridMode = FLANAESS_GRID_MODE;
  s.fog = []; s.walls = []; s.wallMeta = []; s.hEdges = []; s.vEdges = []; s.hEdgeMeta = []; s.vEdgeMeta = [];
  state = s;
  // Não grava a migração automaticamente. Primeiro precisamos comparar o
  // salvamento local com o JSON versionado no GitHub, se ele existir.
  return s;
}
state = migrateFlanaessState(state);
var travelSpeedMilesPerDay = 0;
var bgImages = [];
var bgReady = 0;

function defaultState() {
  return {
    v: 4,
    nome: MAPINFO.nome,
    gridMode: isHexMap() ? FLANAESS_GRID_MODE : 'square',
    spawn: { x: MAPINFO.spawn.x, y: MAPINFO.spawn.y },
    portals: [],
    tokens: [
      { id: 'p1', nome: 'Aventureiro', tipo: 'player', x: isHexMap() ? worldToCell(MAP_W / 2, MAP_H / 2).x : MAPINFO.spawn.x, y: isHexMap() ? worldToCell(MAP_W / 2, MAP_H / 2).y : MAPINFO.spawn.y, cor: '#4fc3f7', raio: 1, luz: 6, hp: null, hpMax: null }
    ],
    fog: isHexMap() ? [] : makeGrid(1),
    walls: isHexMap() ? [] : makeGrid(0),
    wallMeta: isHexMap() ? [] : makeArr(COLS * ROWS, null),
    hEdges: isHexMap() ? [] : makeArr(COLS * (ROWS + 1), 0),
    vEdges: isHexMap() ? [] : makeArr((COLS + 1) * ROWS, 0),
    hEdgeMeta: isHexMap() ? [] : makeArr(COLS * (ROWS + 1), null),
    vEdgeMeta: isHexMap() ? [] : makeArr((COLS + 1) * ROWS, null),
    customEdges: []
  };
}

function makeGrid(val) {
  var a = new Array(COLS * ROWS);
  for (var i = 0; i < a.length; i++) a[i] = val;
  return a;
}
function makeArr(n, val) {
  var a = new Array(n);
  for (var i = 0; i < n; i++) a[i] = val;
  return a;
}

function normalizeMapState(s) {
  if (!s || !Array.isArray(s.tokens)) return null;
  var fallbackSpawn = MAPINFO.spawn || { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) };
  if (!s.spawn || !isFinite(Number(s.spawn.x)) || !isFinite(Number(s.spawn.y))) {
    s.spawn = { x: fallbackSpawn.x, y: fallbackSpawn.y };
  }
  s.spawn = {
    x: Math.max(0, Math.min(COLS - 1, Math.round(Number(s.spawn.x)))),
    y: Math.max(0, Math.min(ROWS - 1, Math.round(Number(s.spawn.y))))
  };
  MAPINFO.spawn = { x: s.spawn.x, y: s.spawn.y };
  // Portais para outros mapas mantêm o formato antigo (destMapId).
  // Portais internos ligam dois pontos do mesmo mapa (x/y <-> destX/destY).
  if (!Array.isArray(s.portals)) s.portals = [];
  s.portals = s.portals.filter(function (portal) {
    if (!portal || !isFinite(Number(portal.x)) || !isFinite(Number(portal.y))) return false;
    return !!portal.destMapId || (isFinite(Number(portal.destX)) && isFinite(Number(portal.destY)));
  }).map(function (portal) {
    var portalColor = String(portal.color || '#36a9e1');
    if (!/^#[0-9a-f]{6}$/i.test(portalColor)) portalColor = '#36a9e1';
    var normalized = {
      id: portal.id || ('portal-' + String(portal.x) + '-' + String(portal.y)),
      x: Math.max(0, Math.min(COLS - 1, Math.round(Number(portal.x)))),
      y: Math.max(0, Math.min(ROWS - 1, Math.round(Number(portal.y)))),
      color: portalColor.toLowerCase()
    };
    if (portal.destMapId) normalized.destMapId = String(portal.destMapId);
    else {
      normalized.type = 'local';
      normalized.destX = Math.max(0, Math.min(COLS - 1, Math.round(Number(portal.destX))));
      normalized.destY = Math.max(0, Math.min(ROWS - 1, Math.round(Number(portal.destY))));
    }
    return normalized;
  });
  if (isHexMap()) {
    if (!s.gridMode && s.fog && s.fog.length === MAPS.flanaess.cols * MAPS.flanaess.rows) s._legacySquareTokens = true;
    s.fog = []; s.walls = []; s.wallMeta = []; s.hEdges = []; s.vEdges = []; s.hEdgeMeta = []; s.vEdgeMeta = [];
    return s;
  }
  if (!s.fog || s.fog.length !== COLS * ROWS) s.fog = makeGrid(1);
  if (!s.walls || s.walls.length !== COLS * ROWS) s.walls = makeGrid(0);
  if (!s.wallMeta || s.wallMeta.length !== COLS * ROWS) s.wallMeta = makeArr(COLS * ROWS, null);
  if (!s.hEdges || s.hEdges.length !== COLS * (ROWS + 1)) s.hEdges = makeArr(COLS * (ROWS + 1), 0);
  if (!s.vEdges || s.vEdges.length !== (COLS + 1) * ROWS) s.vEdges = makeArr((COLS + 1) * ROWS, 0);
  if (!s.hEdgeMeta || s.hEdgeMeta.length !== COLS * (ROWS + 1)) s.hEdgeMeta = makeArr(COLS * (ROWS + 1), null);
  if (!s.vEdgeMeta || s.vEdgeMeta.length !== (COLS + 1) * ROWS) s.vEdgeMeta = makeArr((COLS + 1) * ROWS, null);
  if (!Array.isArray(s.customEdges)) s.customEdges = [];
  s.customEdges = s.customEdges.filter(function (e) { return !!e && [e.x1,e.y1,e.x2,e.y2].every(function(v){return isFinite(Number(v));}) && (Number(e.x1)!==Number(e.x2) || Number(e.y1)!==Number(e.y2)); });
  return s;
}

function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return normalizeMapState(JSON.parse(raw));
  } catch (e) { return null; }
}

function loadRepositoryMapCatalog(done) {
  if (typeof window.fetch !== 'function') { done(); return; }
  fetch(MAP_CATALOG_FILE + '?v=' + Date.now(), { cache: 'no-store' })
    .then(function (response) { if (!response.ok) return null; return response.json(); })
    .then(function (payload) {
      if (!payload || payload.format !== 'animalysson-rpg-map-catalog' || !Array.isArray(payload.maps)) return;
      payload.maps.forEach(function (entry) {
        if (!entry || !entry.id || !entry.config || isCustomMapDeleted(entry.id) || MAPS[entry.id] && !MAPS[entry.id].custom) return;
        var localInfo = MAPS[entry.id];
        var runtimeSrc = localInfo && localInfo.parts && localInfo.parts[0] ? localInfo.parts[0].localSrc : null;
        registerCustomMap(entry.id, entry.config, runtimeSrc);
      });
      persistCustomMaps();
    })
    .catch(function () {
      // O catálogo ainda não foi publicado. Os mapas locais continuam disponíveis.
    })
    .then(function () { done(); });
}

function loadRepositoryMapState(done) {
  var requestedMapId = mapId;
  var file = MAPINFO && MAPINFO.stateFile;
  if (!file || typeof window.fetch !== 'function') { done(); return; }

  var localSavedAt = Number(state && state._savedAt) || 0;
  fetch(encodeURI(file) + '?v=' + Date.now(), { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) return null;
      return response.json();
    })
    .then(function (payload) {
      if (mapId !== requestedMapId || !payload) return;
      if (payload.format !== 'animalysson-rpg-map' || payload.mapId !== requestedMapId || !payload.state) return;
      var remoteSavedAt = Date.parse(payload.exportedAt) || 0;
      if (remoteSavedAt <= localSavedAt) return;
      var remoteState = normalizeMapState(payload.state);
      if (!remoteState) return;
      remoteState._savedAt = remoteSavedAt;
      state = migrateFlanaessState(remoteState);
    })
    .catch(function () {
      // JSON ainda não publicado (ou execução local sem servidor): segue com o estado local.
    })
    .then(function () { done(); });
}

function downloadBlob(blob, filename) {
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
}

function exportMapCatalog(allowEmpty) {
  var entries = customMapEntries();
  if (!entries.length && !allowEmpty) {
    appAlertMessage('msg001', 'Ainda não há mapas adicionados pelo botão +.');
    return;
  }
  var payload = {
    format: 'animalysson-rpg-map-catalog',
    version: 1,
    updatedAt: new Date().toISOString(),
    maps: entries
  };
  downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }), 'mapas.json');
}

function exportMapFile() {
  var mapFolder = MAPINFO.folder || (MAPINFO.stateFile ? MAPINFO.stateFile.substring(0, MAPINFO.stateFile.lastIndexOf('/') + 1) : 'mapas/');
  var assets = (MAPINFO.parts || []).map(function (part) { return part.src; });
  if (MAPINFO.detail) {
    for (var detailRow = 0; detailRow < MAPINFO.detail.n; detailRow++) {
      for (var detailCol = 0; detailCol < MAPINFO.detail.n; detailCol++) {
        assets.push(MAPINFO.detail.src.replace('{r}', detailRow).replace('{c}', detailCol));
      }
    }
  }
  var exportedState = isHexMap()
    ? { v: 4, nome: MAPINFO.nome, gridMode: FLANAESS_GRID_MODE, spawn: state.spawn || MAPINFO.spawn, portals: state.portals || [], tokens: state.tokens || [] }
    : JSON.parse(JSON.stringify(state));
  if (exportedState && Object.prototype.hasOwnProperty.call(exportedState, '_savedAt')) delete exportedState._savedAt;
  var payload = {
    format: 'animalysson-rpg-map',
    version: 1,
    mapId: mapId,
    mapName: MAPINFO.nome,
    exportedAt: new Date().toISOString(),
    dimensions: { width: MAP_W, height: MAP_H, columns: COLS, rows: ROWS },
    imageFolder: mapFolder,
    images: assets,
    mapConfig: serializableMapConfig(MAPINFO),
    catalogFile: MAPINFO.custom ? MAP_CATALOG_FILE : null,
    state: exportedState
  };
  downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }), safeMapFileName(MAPINFO.nome) + '.json');
}

function revokeMapRuntimeUrls(info) {
  if (!info) return;
  (info.parts || []).forEach(function (part) {
    if (part.localSrc && String(part.localSrc).indexOf('blob:') === 0) {
      try { URL.revokeObjectURL(part.localSrc); } catch (e) {}
    }
  });
  var tiles = info.detail && info.detail.runtimeTiles;
  if (tiles) Object.keys(tiles).forEach(function (key) {
    if (String(tiles[key]).indexOf('blob:') === 0) {
      try { URL.revokeObjectURL(tiles[key]); } catch (e) {}
    }
  });
}

function deleteCurrentCustomMap() {
  if (!MAPINFO || !MAPINFO.custom) {
    appAlertMessage('msg002', 'Os mapas originais do projeto não podem ser excluídos. Este botão remove somente mapas adicionados pelo botão +.');
    return;
  }

  var deletedId = mapId;
  var deletedInfo = MAPINFO;
  var host = R;
  var confirmed = appConfirmMessage('msg003', 
    'Excluir o mapa "' + deletedInfo.nome + '"?\n\n' +
    'Ele será removido do seletor e os dados salvos deste mapa serão apagados deste navegador.\n\n' +
    'Um novo mapas.json será baixado para atualizar o catálogo no GitHub. Os arquivos já publicados na pasta mapas/' + deletedId + '/ não são apagados automaticamente; remova essa pasta do GitHub se também quiser excluir as imagens e o JSON.'
  );
  if (!confirmed) return;

  save();
  try { localStorage.removeItem(deletedInfo.key); } catch (e) {}
  rememberDeletedCustomMap(deletedId);
  revokeMapRuntimeUrls(deletedInfo);
  delete MAPS[deletedId];
  persistCustomMaps();

  preferredMapId = 'tumba';
  try { localStorage.setItem(MAP_ID_KEY, 'tumba'); } catch (e) {}
  exportMapCatalog(true);

  stopWorldTravel(false);
  unmount();
  applyMap('tumba');
  state = migrateFlanaessState(load() || defaultState());
  selected = null; pendingMonster = null; measurePts = null; drag = null;
  mount(host);
  appAlertMessage('msg004', 'Mapa excluído do seletor neste navegador. O catálogo mapas.json atualizado foi baixado. Publique esse arquivo em mapas/mapas.json no GitHub e, se desejar apagar também as imagens e dados antigos, exclua a pasta mapas/' + deletedId + '/ do repositório.');
}

function canvasToWebp(canvas, quality) {
  return new Promise(function (resolve, reject) {
    if (!canvas.toBlob) { reject(new Error('Este navegador não oferece conversão WebP pelo canvas.')); return; }
    canvas.toBlob(function (blob) {
      if (!blob) { reject(new Error('Não foi possível gerar a imagem WebP.')); return; }
      if (blob.type !== 'image/webp') { reject(new Error('O navegador não conseguiu exportar WebP. Use uma versão atualizada do Chrome, Edge ou Firefox.')); return; }
      resolve(blob);
    }, 'image/webp', quality);
  });
}

function imageRegionToWebp(image, sx, sy, sw, sh, outW, outH, quality) {
  var canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(outW));
  canvas.height = Math.max(1, Math.round(outH));
  var context = canvas.getContext('2d', { alpha: false });
  if (!context) return Promise.reject(new Error('Não foi possível preparar o canvas de otimização.'));
  context.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in context) context.imageSmoothingQuality = 'high';
  context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvasToWebp(canvas, quality).then(function (blob) {
    canvas.width = 1; canvas.height = 1;
    return blob;
  }, function (error) {
    canvas.width = 1; canvas.height = 1;
    throw error;
  });
}

function crc32Bytes(bytes) {
  var crc = 0xFFFFFFFF;
  for (var i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (var bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ZIP sem compressão adicional: os WebP já chegam comprimidos pelo encoder.
function createImagesZip(entries) {
  return Promise.all(entries.map(function (entry) {
    return entry.blob.arrayBuffer().then(function (buffer) {
      var bytes = new Uint8Array(buffer);
      return { name: entry.name, nameBytes: new TextEncoder().encode(entry.name), bytes: bytes, crc: crc32Bytes(bytes) };
    });
  })).then(function (files) {
    var localParts = [], centralParts = [], offset = 0, centralSize = 0;
    var now = new Date();
    var dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
    var dosDate = ((Math.max(1980, now.getFullYear()) - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    files.forEach(function (file) {
      var local = new Uint8Array(30 + file.nameBytes.length);
      var lv = new DataView(local.buffer);
      lv.setUint32(0, 0x04034B50, true); lv.setUint16(4, 20, true);
      lv.setUint16(6, 0x0800, true); lv.setUint16(8, 0, true);
      lv.setUint16(10, dosTime, true); lv.setUint16(12, dosDate, true);
      lv.setUint32(14, file.crc, true); lv.setUint32(18, file.bytes.length, true);
      lv.setUint32(22, file.bytes.length, true); lv.setUint16(26, file.nameBytes.length, true);
      lv.setUint16(28, 0, true); local.set(file.nameBytes, 30);
      localParts.push(local, file.bytes);

      var central = new Uint8Array(46 + file.nameBytes.length);
      var cv = new DataView(central.buffer);
      cv.setUint32(0, 0x02014B50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true); cv.setUint16(10, 0, true);
      cv.setUint16(12, dosTime, true); cv.setUint16(14, dosDate, true);
      cv.setUint32(16, file.crc, true); cv.setUint32(20, file.bytes.length, true);
      cv.setUint32(24, file.bytes.length, true); cv.setUint16(28, file.nameBytes.length, true);
      cv.setUint16(30, 0, true); cv.setUint16(32, 0, true); cv.setUint16(34, 0, true);
      cv.setUint32(36, 0, true); cv.setUint32(38, 0, true); cv.setUint32(42, offset, true);
      central.set(file.nameBytes, 46);
      centralParts.push(central);
      offset += local.length + file.bytes.length;
      centralSize += central.length;
    });
    var end = new Uint8Array(22), ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054B50, true); ev.setUint16(4, 0, true); ev.setUint16(6, 0, true);
    ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true);
    ev.setUint32(12, centralSize, true); ev.setUint32(16, offset, true); ev.setUint16(20, 0, true);
    return new Blob(localParts.concat(centralParts, [end]), { type: 'application/zip' });
  });
}

function optimizeMapImage(image, width, height) {
  var maxEdge = Math.max(width, height);
  var baseMaxEdge = 3000;
  var baseScale = Math.min(1, baseMaxEdge / maxEdge);
  var baseW = Math.max(1, Math.round(width * baseScale));
  var baseH = Math.max(1, Math.round(height * baseScale));
  var tasks = [{ name: 'imagem.webp', sx: 0, sy: 0, sw: width, sh: height, outW: baseW, outH: baseH, quality: 0.84 }];
  var detailN = maxEdge > baseMaxEdge ? Math.ceil(maxEdge / 4096) : 0;
  if (detailN) {
    var tileW = width / detailN, tileH = height / detailN;
    for (var r = 0; r < detailN; r++) {
      for (var c = 0; c < detailN; c++) {
        var sx = c * tileW, sy = r * tileH;
        var sw = Math.min(tileW, width - sx), sh = Math.min(tileH, height - sy);
        tasks.push({
          name: 'detalhe/d_' + r + '_' + c + '.webp',
          sx: sx, sy: sy, sw: sw, sh: sh,
          outW: Math.ceil(sw), outH: Math.ceil(sh), quality: 0.86
        });
      }
    }
  }
  var files = [], chain = Promise.resolve();
  // Processa um canvas por vez para não manter vários mapas gigantes na memória.
  tasks.forEach(function (task) {
    chain = chain.then(function () {
      return imageRegionToWebp(image, task.sx, task.sy, task.sw, task.sh, task.outW, task.outH, task.quality)
        .then(function (blob) { files.push({ name: task.name, blob: blob }); });
    });
  });
  return chain.then(function () {
    return { baseBlob: files[0].blob, files: files, detailN: detailN };
  });
}

function slugifyMapName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'novo-mapa';
}
function safeMapFileName(value) {
  return String(value || '').replace(/[\\/:*?"<>|]/g, '-').replace(/[\r\n]+/g, ' ').trim() || 'mapa';
}

function createCustomMapFromFile(file) {
  if (!file || !file.type || file.type.indexOf('image/') !== 0) {
    appAlertMessage('msg005', 'Selecione um arquivo de imagem válido.');
    return;
  }
  var suggestedName = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Novo mapa';
  var name = appPromptMessage('msg006', 'Nome do novo mapa:', suggestedName);
  if (!name || !name.trim()) return;
  name = name.trim();
  var cellInput = appPromptMessage('msg007', 'Tamanho da célula da grade em pixels:', '36');
  if (cellInput == null) return;
  var cell = Number(cellInput);
  if (!isFinite(cell) || cell < 8 || cell > 512) {
    appAlertMessage('msg008', 'Informe um tamanho de célula entre 8 e 512 pixels.');
    return;
  }

  var imageUrl = URL.createObjectURL(file);
  var image = new Image();
  image.onload = function () {
    (async function () {
      var runtimeUrls = [];
      try {
        var width = image.naturalWidth || image.width;
        var height = image.naturalHeight || image.height;
        if (!width || !height) throw new Error('Não foi possível identificar as dimensões da imagem.');
        if (width * height > 160000000) throw new Error('A imagem ultrapassa o limite de 160 megapixels para otimização segura no navegador. Reduza a imagem antes de importar.');
        var optimized = await optimizeMapImage(image, width, height);
        var zipBlob = await createImagesZip(optimized.files);
        var id = slugifyMapName(name);
        var suffix = 2;
        while (MAPS[id]) { id = slugifyMapName(name) + '-' + suffix; suffix++; }
        var cols = Math.ceil(width / cell), rows = Math.ceil(height / cell);
        if (cols * rows > 500000) throw new Error('A grade ficaria grande demais. Escolha um tamanho de célula maior.');

        clearDeletedCustomMap(id);
        var folder = 'mapas/' + id + '/';
        var stateFileName = safeMapFileName(name) + '.json';
        var baseUrl = URL.createObjectURL(optimized.baseBlob);
        runtimeUrls.push(baseUrl);
        var runtimeTiles = {};
        optimized.files.forEach(function (entry) {
          if (entry.name.indexOf('detalhe/') !== 0) return;
          var tileMatch = entry.name.match(/d_(\d+)_(\d+)\.webp$/);
          if (!tileMatch) return;
          var tileUrl = URL.createObjectURL(entry.blob);
          runtimeUrls.push(tileUrl);
          runtimeTiles[tileMatch[1] + '_' + tileMatch[2]] = tileUrl;
        });
        var config = {
          nome: name,
          icone: '🗺️',
          key: 'animalysson-vtt-custom-' + id,
          custom: true,
          folder: folder,
          stateFile: folder + stateFileName,
          cell: cell,
          cols: cols,
          rows: rows,
          w: width,
          h: height,
          spawn: { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
          fit: true,
          maxZoom: 4,
          parts: [{ src: folder + 'imagem.webp', x: 0, y: 0, w: width, h: height }]
        };
        config.parts[0].localSrc = baseUrl;
        if (optimized.detailN) {
          config.detail = {
            src: folder + 'detalhe/d_{r}_{c}.webp',
            n: optimized.detailN,
            minZoom: 1.1,
            runtimeTiles: runtimeTiles
          };
        }
        if (!registerCustomMap(id, config, baseUrl)) throw new Error('Não foi possível adicionar este mapa.');
        persistCustomMaps();

        var zipName = safeMapFileName(name) + '-imagens-webp.zip';
        downloadBlob(zipBlob, zipName);

        var host = R;
        stopWorldTravel(false);
        save();
        unmount();
        applyMap(id);
        try { localStorage.setItem(MAP_ID_KEY, id); } catch (e) {}
        state = defaultState();
        showGrid = true; showFog = true; dynLight = true; showWalls = true;
        selected = null; pendingMonster = null; measurePts = null; drag = null;
        save();
        mount(host);
        var detailMessage = optimized.detailN
          ? 'O ZIP contém imagem.webp e ' + (optimized.detailN * optimized.detailN) + ' blocos WebP de detalhe, carregados conforme o zoom.'
          : 'O ZIP contém imagem.webp otimizada em WebP.';
        appAlertMessage('msg009', 'Mapa adicionado e otimizado! ' + detailMessage + '\n\nExtraia o ZIP dentro de "' + folder + '". Depois baixe o catálogo mapas.json pelo menu e coloque-o em "mapas/mapas.json". Use Salvar mapa para baixar "' + stateFileName + '" na mesma pasta.');
      } catch (error) {
        runtimeUrls.forEach(function (url) { try { URL.revokeObjectURL(url); } catch (e) {} });
        appAlertMessage('msg010', error && error.message ? error.message : 'Não foi possível otimizar a imagem do mapa.');
      } finally {
        URL.revokeObjectURL(imageUrl);
      }
    })();
  };
  image.onerror = function () {
    URL.revokeObjectURL(imageUrl);
    appAlertMessage('msg011', 'Não foi possível abrir essa imagem.');
  };
  image.src = imageUrl;
}

function save() {
  try {
    state._savedAt = Date.now();
    if (isHexMap()) {
      state.gridMode = FLANAESS_GRID_MODE;
      localStorage.setItem(KEY, JSON.stringify({
        v: 4, nome: MAPINFO.nome, gridMode: state.gridMode,
        spawn: state.spawn || MAPINFO.spawn,
        portals: state.portals || [],
        tokens: state.tokens || [], _savedAt: state._savedAt
      }));
    } else {
      localStorage.setItem(KEY, JSON.stringify(state));
    }
  } catch (e) {}
}

function $(s) { return R.querySelector(s); }
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function idx(x, y) { return y * COLS + x; }
function hIdx(x, yEdge) { return yEdge * COLS + x; }
function vIdx(xEdge, y) { return y * (COLS + 1) + xEdge; }

function isCellWall(x, y) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
  if (isHexMap()) return false;
  return !!state.walls[idx(x, y)];
}

function getH(x, yEdge) {
  if (x < 0 || x >= COLS || yEdge < 0 || yEdge > ROWS) return EDGE_MURO;
  return state.hEdges[hIdx(x, yEdge)] || 0;
}
function getV(xEdge, y) {
  if (y < 0 || y >= ROWS || xEdge < 0 || xEdge > COLS) return EDGE_MURO;
  return state.vEdges[vIdx(xEdge, y)] || 0;
}
function edgeMetaIndex(edge) {
  if (!edge) return -1;
  return edge.dir === 'h' ? hIdx(edge.x, edge.yEdge) : vIdx(edge.xEdge, edge.y);
}
function getEdgeMeta(edge) {
  if (!edge) return null;
  if (edge.custom) return edge.custom.meta || null;
  var arr = edge.dir === 'h' ? state.hEdgeMeta : state.vEdgeMeta;
  return arr && arr[edgeMetaIndex(edge)] || null;
}
function setEdgeMeta(edge, meta) {
  if (!edge) return;
  if (edge.custom) { edge.custom.meta = meta || null; return; }
  var arr = edge.dir === 'h' ? state.hEdgeMeta : state.vEdgeMeta;
  if (!arr) {
    if (edge.dir === 'h') state.hEdgeMeta = makeArr(COLS * (ROWS + 1), null);
    else state.vEdgeMeta = makeArr((COLS + 1) * ROWS, null);
    arr = edge.dir === 'h' ? state.hEdgeMeta : state.vEdgeMeta;
  }
  arr[edgeMetaIndex(edge)] = meta || null;
}
function setH(x, yEdge, val) {
  if (x < 0 || x >= COLS || yEdge < 0 || yEdge > ROWS) return;
  var i = hIdx(x, yEdge), old = state.hEdges[i];
  state.hEdges[i] = val;
  if (old !== val && state.hEdgeMeta) state.hEdgeMeta[i] = null;
}
function setV(xEdge, y, val) {
  if (y < 0 || y >= ROWS || xEdge < 0 || xEdge > COLS) return;
  var i = vIdx(xEdge, y), old = state.vEdges[i];
  state.vEdges[i] = val;
  if (old !== val && state.vEdgeMeta) state.vEdgeMeta[i] = null;
}
function edgeBlocks(val, edge) {
  var meta = getEdgeMeta(edge);
  if (val === EDGE_NONE || val === EDGE_ILLUSION_WALL) return false;
  if (val === EDGE_SECRET_WALL) return !(meta && meta.open);
  if (val === EDGE_SECRET_DOOR_O || val === EDGE_DOOR_O) return false;
  if (val === EDGE_SECRET_DOOR_C || val === EDGE_DOOR_C || val === EDGE_MURO) return true;
  if (val === EDGE_LOCKED_DOOR || val === EDGE_JAMMED_DOOR) return !(meta && meta.open);
  return val === EDGE_FORCE_WALL || val === EDGE_MAGIC_WALL;
}
function blocksBetween(x0, y0, x1, y1) {
  if (x0 === x1 && y0 === y1) return false;
  var moveA={x:(x0+0.5)*CELL,y:(y0+0.5)*CELL}, moveB={x:(x1+0.5)*CELL,y:(y1+0.5)*CELL};
  if ((state.customEdges || []).some(function(e){ return edgeBlocks(e.val,{custom:e}) && segmentCrosses(moveA,moveB,{x:e.x1,y:e.y1},{x:e.x2,y:e.y2}); })) return true;
  if (isCellWall(x1, y1)) return true;
  if (y0 === y1) {
    var vertical = { dir: 'v', xEdge: x1 > x0 ? x1 : x0, y: y0 };
    return edgeBlocks(getEdgeVal(vertical), vertical);
  }
  if (x0 === x1) {
    var horizontal = { dir: 'h', x: x0, yEdge: y1 > y0 ? y1 : y0 };
    return edgeBlocks(getEdgeVal(horizontal), horizontal);
  }
  return blocksBetween(x0, y0, x1, y0) || blocksBetween(x0, y0, x0, y1);
}
function edgeBlocksVision(val, edge) {
  // Wall of Force é invisível e transparente: bloqueia movimento, não visão.
  if (val === EDGE_FORCE_WALL || val === EDGE_NONE) return false;
  // A parede ilusória parece sólida até ser identificada; depois disso a visão passa.
  if (val === EDGE_ILLUSION_WALL) {
    var illusionMeta = getEdgeMeta(edge);
    return !(illusionMeta && illusionMeta.detected);
  }
  return edgeBlocks(val, edge);
}
function blocksVisionBetween(x0, y0, x1, y1) {
  if (x0 === x1 && y0 === y1) return false;
  var sightA={x:(x0+0.5)*CELL,y:(y0+0.5)*CELL}, sightB={x:(x1+0.5)*CELL,y:(y1+0.5)*CELL};
  if ((state.customEdges || []).some(function(e){ return edgeBlocksVision(e.val,{custom:e}) && segmentCrosses(sightA,sightB,{x:e.x1,y:e.y1},{x:e.x2,y:e.y2}); })) return true;
  if (isCellWall(x1, y1)) return true;
  if (y0 === y1) {
    var vertical = { dir: 'v', xEdge: x1 > x0 ? x1 : x0, y: y0 };
    return edgeBlocksVision(getEdgeVal(vertical), vertical);
  }
  if (x0 === x1) {
    var horizontal = { dir: 'h', x: x0, yEdge: y1 > y0 ? y1 : y0 };
    return edgeBlocksVision(getEdgeVal(horizontal), horizontal);
  }
  return blocksVisionBetween(x0, y0, x1, y0) || blocksVisionBetween(x0, y0, x0, y1);
}

function sizeSquares(m) {
  if (!m) return 1;
  var s = m.tamanhoEn || m.tamanho || 'Medium';
  return SIZE_SQ[s] || 1;
}

function colorForMonster(m) {
  if (!m) return '#e57373';
  var t = (m.tipoEn || m.tipo || '').toLowerCase();
  if (t.indexOf('undead') >= 0 || t.indexOf('morto') >= 0) return '#b39ddb';
  if (t.indexOf('dragon') >= 0 || t.indexOf('dragão') >= 0) return '#ef5350';
  if (t.indexOf('beast') >= 0 || t.indexOf('fera') >= 0) return '#81c784';
  if (t.indexOf('fiend') >= 0 || t.indexOf('demônio') >= 0 || t.indexOf('diabo') >= 0) return '#e53935';
  if (t.indexOf('celestial') >= 0) return '#ffd54f';
  if (t.indexOf('construct') >= 0 || t.indexOf('constructo') >= 0) return '#90a4ae';
  if (t.indexOf('elemental') >= 0) return '#4dd0e1';
  if (t.indexOf('ooze') >= 0 || t.indexOf('gosma') >= 0) return '#aed581';
  if (t.indexOf('plant') >= 0 || t.indexOf('planta') >= 0) return '#66bb6a';
  return '#e57373';
}

function hasLOS(x0, y0, x1, y1) {
  if (isHexMap()) {
    var path = hexLine({ x: x0, y: y0 }, { x: x1, y: y1 });
    for (var hi = 1; hi < path.length - 1; hi++) {
      if (isCellWall(path[hi].x, path[hi].y)) return false;
    }
    return !isCellWall(x1, y1);
  }
  if (x0 === x1 && y0 === y1) return true;
  if (isCellWall(x1, y1) && !(x1 === x0 && y1 === y0)) return false;
  var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  var sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;
  var x = x0, y = y0;
  while (!(x === x1 && y === y1)) {
    var e2 = 2 * err;
    var stepX = e2 > -dy;
    var stepY = e2 < dx;
    var nx = x, ny = y;
    if (stepX) { err -= dy; nx = x + sx; }
    if (stepY) { err += dx; ny = y + sy; }

    if (nx !== x && ny !== y) {
      if (blocksVisionBetween(x, y, nx, y) || blocksVisionBetween(x, y, x, ny)) return false;
      if (blocksVisionBetween(nx, y, nx, ny) || blocksVisionBetween(x, ny, nx, ny)) return false;
      if (isCellWall(nx, y) || isCellWall(x, ny)) return false;
    } else {
      if (blocksVisionBetween(x, y, nx, ny)) return false;
    }
    x = nx; y = ny;
    if (!(x === x1 && y === y1) && isCellWall(x, y)) return false;
  }
  return true;
}

function loadBackgrounds(cb) {
  bgImages = [];
  bgReady = 0;
  PARTS.forEach(function (p, i) {
    var img = new Image();
    img.onload = function () { bgReady++; if (bgReady === PARTS.length && cb) cb(); draw(); };
    img.onerror = function () { bgReady++; draw(); };
    img.src = p.localSrc || p.src;
    bgImages[i] = img;
  });
}

function screenToWorld(sx, sy) { return { x: (sx - ox) / zoom, y: (sy - oy) / zoom }; }
function offsetToAxial(col, row) {
  return { q: col - (row - (row & 1)) / 2, r: row };
}
function axialToOffset(q, r) {
  return { x: q + (r - (r & 1)) / 2, y: r };
}
function hexDistance(a, b) {
  var aa = offsetToAxial(a.x, a.y), bb = offsetToAxial(b.x, b.y);
  var dq = bb.q - aa.q, dr = bb.r - aa.r;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}
function hexLine(a, b) {
  var aa = offsetToAxial(a.x, a.y), bb = offsetToAxial(b.x, b.y);
  var n = hexDistance(a, b), out = [];
  if (!n) return [{ x: a.x, y: a.y }];
  var ax = aa.q, az = aa.r, ay = -ax - az;
  var bx = bb.q, bz = bb.r, by = -bx - bz;
  for (var i = 0; i <= n; i++) {
    var t = i / n;
    var x = ax + (bx - ax) * t, y = ay + (by - ay) * t, z = az + (bz - az) * t;
    var rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);
    var dx = Math.abs(rx - x), dy = Math.abs(ry - y), dz = Math.abs(rz - z);
    if (dx > dy && dx > dz) rx = -ry - rz;
    else if (dy > dz) ry = -rx - rz;
    else rz = -rx - ry;
    var cell = axialToOffset(rx, rz);
    if (!out.length || out[out.length - 1].x !== cell.x || out[out.length - 1].y !== cell.y) out.push(cell);
  }
  return out;
}
function hexNeighbors(cell) {
  var o = cell.y & 1;
  var offsets = o
    ? [[1,0],[-1,0],[0,-1],[1,-1],[0,1],[1,1]]
    : [[1,0],[-1,0],[0,-1],[-1,-1],[0,1],[-1,1]];
  return offsets.map(function (d) { return { x: cell.x + d[0], y: cell.y + d[1] }; });
}
function heapPush(heap, item) {
  var i = heap.length; heap.push(item);
  while (i > 0) {
    var p = (i - 1) >> 1;
    if (heap[p].f <= item.f) break;
    heap[i] = heap[p]; i = p;
  }
  heap[i] = item;
}
function heapPop(heap) {
  if (!heap.length) return null;
  var root = heap[0], last = heap.pop();
  if (heap.length) {
    var i = 0;
    while (true) {
      var l = i * 2 + 1, r = l + 1;
      if (l >= heap.length) break;
      var c = r < heap.length && heap[r].f < heap[l].f ? r : l;
      if (heap[c].f >= last.f) break;
      heap[i] = heap[c]; i = c;
    }
    heap[i] = last;
  }
  return root;
}
function hexRoute(start, end) {
  if (!isHexMap()) return [start, end];
  return hexLine(start, end);
}

function appendHexPath(ctx, center, hm) {
  var w = hm.width, h = hm.height;
  ctx.moveTo(center.x, center.y - h / 2);
  ctx.lineTo(center.x + w / 2, center.y - h / 4);
  ctx.lineTo(center.x + w / 2, center.y + h / 4);
  ctx.lineTo(center.x, center.y + h / 2);
  ctx.lineTo(center.x - w / 2, center.y + h / 4);
  ctx.lineTo(center.x - w / 2, center.y - h / 4);
  ctx.closePath();
}
function hexPath(ctx, center, fill, stroke, lineWidth) {
  var hm = hexMetrics();
  if (!hm) return;
  ctx.beginPath();
  appendHexPath(ctx, center, hm);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth || 1 / zoom; ctx.stroke(); }
}
function visibleCellBounds(viewW, viewH) {
  if (!isHexMap()) return { x0: 0, x1: COLS - 1, y0: 0, y1: ROWS - 1 };
  var hm = hexMetrics();
  var left = -ox / zoom, right = (viewW - ox) / zoom;
  var top = -oy / zoom, bottom = (viewH - oy) / zoom;
  var y0 = Math.max(0, Math.floor((top - hm.height / 2) / hm.rowStep) - 2);
  var y1 = Math.min(ROWS - 1, Math.ceil((bottom - hm.height / 2) / hm.rowStep) + 2);
  var minX = COLS - 1, maxX = 0;
  for (var row = y0; row <= y1; row++) {
    var offset = hm.width / 2 + (row & 1) * hm.width / 2;
    var c0 = Math.floor((left - offset) / hm.width) - 2;
    var c1 = Math.ceil((right - offset) / hm.width) + 2;
    minX = Math.min(minX, Math.max(0, c0));
    maxX = Math.max(maxX, Math.min(COLS - 1, c1));
  }
  return { x0: minX, x1: maxX, y0: y0, y1: y1 };
}

function worldToCell(wx, wy) {
  if (isHexMap()) {
    var hm = hexMetrics();
    var rowGuess = Math.round((wy - hm.height / 2) / hm.rowStep);
    var best = null, bestD = Infinity;
    for (var rr = rowGuess - 1; rr <= rowGuess + 1; rr++) {
      var colGuess = Math.round((wx - hm.width / 2 - (rr & 1) * hm.width / 2) / hm.width);
      for (var cc = colGuess - 1; cc <= colGuess + 1; cc++) {
        var center = cellCenter(cc, rr);
        var dx = wx - center.x, dy = wy - center.y, d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; best = { x: cc, y: rr }; }
      }
    }
    return { x: Math.max(0, Math.min(COLS - 1, best.x)), y: Math.max(0, Math.min(ROWS - 1, best.y)) };
  }
  return {
    x: Math.max(0, Math.min(COLS - 1, Math.floor(wx / CELL))),
    y: Math.max(0, Math.min(ROWS - 1, Math.floor(wy / CELL)))
  };
}
function cellCenter(cx, cy) {
  if (isHexMap()) {
    var hm = hexMetrics();
    return { x: hm.width / 2 + cx * hm.width + (cy & 1) * hm.width / 2, y: hm.height / 2 + cy * hm.rowStep };
  }
  return { x: (cx + 0.5) * CELL, y: (cy + 0.5) * CELL };
}

function mapDistanceMiles(a, b) {
  if (!isHexMap()) return null;
  var route = hexRoute(a, b);
  return route ? Math.max(0, route.length - 1) * hexMetrics().miles : null;
}
function formatMapDistance(a, b) {
  if (isHexMap()) {
    var route = hexRoute(a, b);
    if (!route) return 'Sem rota: hexágono bloqueado';
    var steps = Math.max(0, route.length - 1), miles = steps * hexMetrics().miles;
    var label = steps.toLocaleString('pt-BR') + (steps === 1 ? ' hexágono' : ' hexágonos') + ' · ' +
      miles.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' milhas';
    if (travelSpeedMilesPerDay > 0) {
      var days = miles / travelSpeedMilesPerDay;
      label += ' · ' + days.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + (days === 1 ? ' dia' : ' dias');
    }
    return label;
  }
  var dx = (b.x - a.x), dy = (b.y - a.y);
  var squares = Math.sqrt(dx * dx + dy * dy);
  return squares.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' quadrículas';
}

function snapGridPoint(wx, wy) {
  return { x: Math.max(0, Math.min(COLS, Math.round(wx / CELL))) * CELL,
    y: Math.max(0, Math.min(ROWS, Math.round(wy / CELL))) * CELL };
}
function customEdgeAt(wx, wy, tolerance) {
  var list = state.customEdges || [], best = null, bestD = tolerance == null ? CELL * 0.22 : tolerance;
  list.forEach(function (item) {
    var ax=item.x1, ay=item.y1, bx=item.x2, by=item.y2;
    var dx=bx-ax, dy=by-ay, len2=dx*dx+dy*dy;
    var t=len2 ? Math.max(0,Math.min(1,((wx-ax)*dx+(wy-ay)*dy)/len2)) : 0;
    var px=ax+t*dx, py=ay+t*dy, d=Math.sqrt((wx-px)*(wx-px)+(wy-py)*(wy-py));
    if (d < bestD) { bestD=d; best={dir:'custom',custom:item}; }
  });
  return best;
}
function segmentCrosses(a,b,c,d) {
  function orient(p,q,r){return (q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);}
  var o1=orient(a,b,c), o2=orient(a,b,d), o3=orient(c,d,a), o4=orient(c,d,b);
  return ((o1===0 || o2===0 || (o1<0)!==(o2<0)) && (o3===0 || o4===0 || (o3<0)!==(o4<0)));
}
function createCustomStructure(a, b, kind) {
  if (!a || !b || (Math.abs(a.x-b.x)<1 && Math.abs(a.y-b.y)<1)) { appAlertMessage('msg012', 'Escolha dois cantos diferentes do grid.'); return; }
  var val = kind === 'muro' ? EDGE_MURO : kind === 'porta' ? EDGE_DOOR_C : null;
  if (kind !== 'muro' && kind !== 'porta') {
    var map = {paredeSecreta:'secretWall',portaSecreta:'secretDoor',portaTrancada:'lockedDoor',portaEmperrada:'jammedDoor',paredeIlusoria:'illusionWall',muralhaForca:'forceWall',paredeMagica:'magicWall'};
    var temp = {dir:'custom', custom:{x1:a.x,y1:a.y,x2:b.x,y2:b.y,val:0,meta:null}};
    createSpecialEdge(temp, map[kind]);
    if (temp.custom.val) { state.customEdges.push(temp.custom); save(); draw(); }
    return;
  }
  var item = { id:'line-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7), x1:a.x,y1:a.y,x2:b.x,y2:b.y,val:val,meta:null };
  state.customEdges.push(item); save(); draw();
}

function nearestEdge(wx, wy) {
  var gx = wx / CELL, gy = wy / CELL;
  var cx = Math.floor(gx), cy = Math.floor(gy);
  var fx = gx - cx, fy = gy - cy;
  var distV = Math.min(fx, 1 - fx);
  var distH = Math.min(fy, 1 - fy);
  if (distV <= distH) {
    var xEdge = fx < 0.5 ? cx : cx + 1;
    var y = Math.max(0, Math.min(ROWS - 1, cy));
    xEdge = Math.max(0, Math.min(COLS, xEdge));
    return { dir: 'v', xEdge: xEdge, y: y };
  } else {
    var yEdge = fy < 0.5 ? cy : cy + 1;
    var x = Math.max(0, Math.min(COLS - 1, cx));
    yEdge = Math.max(0, Math.min(ROWS, yEdge));
    return { dir: 'h', x: x, yEdge: yEdge };
  }
}

function getEdgeVal(edge) {
  if (edge && edge.custom) return edge.custom.val || 0;
  if (edge.dir === 'h') return getH(edge.x, edge.yEdge);
  return getV(edge.xEdge, edge.y);
}
function setEdgeVal(edge, val) {
  if (edge && edge.custom) { edge.custom.val = val; if (!val && state.customEdges) { var ci = state.customEdges.indexOf(edge.custom); if (ci >= 0) state.customEdges.splice(ci, 1); } return; }
  if (edge.dir === 'h') setH(edge.x, edge.yEdge, val);
  else setV(edge.xEdge, edge.y, val);
}

// Retorna exatamente a linha que seria apagada no clique, permitindo que a prévia
// e a ação de apagar usem o mesmo critério de proximidade.
function findEraseEdgeAt(wx, wy) {
  var eraseTolerance = Math.max(5 / zoom, 2);
  var edge = customEdgeAt(wx, wy, eraseTolerance);
  if (!edge) {
    var gx = wx / CELL, gy = wy / CELL;
    var distanceToGridEdge = Math.min(
      Math.abs(gx - Math.round(gx)) * CELL,
      Math.abs(gy - Math.round(gy)) * CELL
    );
    if (distanceToGridEdge <= eraseTolerance) {
      var legacyEdge = nearestEdge(wx, wy);
      if (getEdgeVal(legacyEdge) !== EDGE_NONE) edge = legacyEdge;
    }
  }
  return edge && getEdgeVal(edge) !== EDGE_NONE ? edge : null;
}

function isDoorEdge(val) {
  return val === EDGE_DOOR_C || val === EDGE_DOOR_O || val === EDGE_SECRET_DOOR_C ||
    val === EDGE_SECRET_DOOR_O || val === EDGE_LOCKED_DOOR || val === EDGE_JAMMED_DOOR;
}

function getDoorRun(edge) {
  if (!edge || !isDoorEdge(getEdgeVal(edge))) return edge ? [edge] : [];
  var meta = getEdgeMeta(edge);
  var groupId = meta && meta.doorGroupId;
  // Portas independentes continuam independentes, mesmo quando encostadas.
  if (!groupId) return [edge];
  var run = [];
  if (edge.dir === 'h') {
    for (var x = 0; x < COLS; x++) {
      var candidate = { dir: 'h', x: x, yEdge: edge.yEdge };
      var cm = getEdgeMeta(candidate);
      if (isDoorEdge(getEdgeVal(candidate)) && cm && cm.doorGroupId === groupId) run.push(candidate);
    }
  } else {
    for (var y = 0; y < ROWS; y++) {
      var candidateV = { dir: 'v', xEdge: edge.xEdge, y: y };
      var vm = getEdgeMeta(candidateV);
      if (isDoorEdge(getEdgeVal(candidateV)) && vm && vm.doorGroupId === groupId) run.push(candidateV);
    }
  }
  return run.length ? run : [edge];
}

function setDoorRunValue(edge, val) {
  getDoorRun(edge).forEach(function (part) {
    var meta = getEdgeMeta(part);
    setEdgeVal(part, val);
    // Alterar aberto/fechado não deve apagar os dados nem o grupo da porta.
    if (meta) setEdgeMeta(part, meta);
  });
}

function doorRunIsClosed(edge) {
  var run = getDoorRun(edge);
  return run.every(function (part) { return edgeBlocks(getEdgeVal(part), part); });
}


// ---------- Regras de portas secretas, trancadas e estruturas ----------
var OBJECT_MATERIALS = {
  madeira: { label: 'Madeira', ac: 15, hp: 18, threshold: 0, vulnerableFire: true },
  pedra: { label: 'Pedra', ac: 17, hp: 27, threshold: 10, immune: ['psíquico', 'venenoso'] },
  ferro: { label: 'Ferro/aço', ac: 19, hp: 27, threshold: 10, immune: ['psíquico', 'venenoso'] },
  mithral: { label: 'Mithral', ac: 21, hp: 36, threshold: 15, immune: ['psíquico', 'venenoso'], needsMagic: true },
  adamantina: { label: 'Adamantina', ac: 23, hp: 45, threshold: 15, immune: ['psíquico', 'venenoso'], needsMagic: true },
  pedraMagica: { label: 'Pedra mágica', ac: 15, hp: 30, threshold: 10, immune: ['psíquico', 'venenoso'] }
};
function numberPrompt(label, fallback, min, max) {
  var raw = appPromptMessage('msg013', label, String(fallback));
  if (raw == null) return null;
  var n = Number(raw);
  if (!isFinite(n) || n < min || n > max) { appAlertMessage('msg014', 'Informe um valor entre ' + min + ' e ' + max + '.'); return null; }
  return Math.round(n);
}
function materialPrompt(defaultMaterial) {
  var choices = 'Material:\n1. Madeira\n2. Pedra\n3. Ferro/aço\n4. Mithral\n5. Adamantina\n6. Pedra mágica';
  var initial = defaultMaterial === 'pedra' ? '2' : defaultMaterial === 'ferro' ? '3' : '1';
  var raw = appPromptMessage('msg015', choices, initial);
  if (raw == null) return null;
  return ({ '1':'madeira', '2':'pedra', '3':'ferro', '4':'mithral', '5':'adamantina', '6':'pedraMagica' })[String(raw).trim()] || null;
}
function makeStructureMeta(material, kind, multiplier) {
  var base = OBJECT_MATERIALS[material] || OBJECT_MATERIALS.madeira;
  var factor = multiplier || 1;
  var hp = base.hp * factor;
  return {
    kind: kind || 'structure', material: material, ac: base.ac, hp: hp, maxHp: hp,
    threshold: base.threshold * (factor > 1 ? 1.5 : 1), detected: false,
    mechanismKnown: false, open: false, locked: false, lockDC: 15,
    lockComplexity: 'simple', arcaneLock: false, arcaneSuppressedUntil: 0,
    dcDetection: 15, dcMechanism: 15, dcForce: 15
  };
}
function edgeMidpoint(edge) {
  if (edge.custom) return { x:(edge.custom.x1+edge.custom.x2)/2, y:(edge.custom.y1+edge.custom.y2)/2 };
  return edge.dir === 'h'
    ? { x: (edge.x + 0.5) * CELL, y: edge.yEdge * CELL }
    : { x: edge.xEdge * CELL, y: (edge.y + 0.5) * CELL };
}
function forEachEdge(callback) {
  for (var hy = 0; hy <= ROWS; hy++) for (var hx = 0; hx < COLS; hx++) callback({ dir: 'h', x: hx, yEdge: hy }, getH(hx, hy));
  for (var vy = 0; vy < ROWS; vy++) for (var vx = 0; vx <= COLS; vx++) callback({ dir: 'v', xEdge: vx, y: vy }, getV(vx, vy));
}
function edgeIsHidden(edge, val) {
  if (val === EDGE_FORCE_WALL) return !showSecrets; // continua invisível para os jogadores mesmo após o toque.
  if (val === EDGE_ILLUSION_WALL) return false; // a ilusão parece uma parede comum até ser tocada/investigada.
  if (val !== EDGE_SECRET_WALL && val !== EDGE_SECRET_DOOR_C && val !== EDGE_SECRET_DOOR_O) return false;
  var meta = getEdgeMeta(edge);
  return !showSecrets && !(meta && meta.detected);
}
function nearbyEdgesForCell(cell, radiusCells) {
  var center = cellCenter(cell.x, cell.y), found = [];
  var limit2 = Math.pow(radiusCells * CELL, 2);
  var x0 = Math.max(0, Math.floor(cell.x - radiusCells - 1));
  var x1 = Math.min(COLS - 1, Math.ceil(cell.x + radiusCells + 1));
  var y0 = Math.max(0, Math.floor(cell.y - radiusCells - 1));
  var y1 = Math.min(ROWS - 1, Math.ceil(cell.y + radiusCells + 1));
  for (var hy = Math.max(0, y0); hy <= Math.min(ROWS, y1 + 1); hy++) {
    for (var hx = x0; hx <= x1; hx++) {
      var horizontal = { dir: 'h', x: hx, yEdge: hy }, hv = getH(hx, hy);
      if (hv === EDGE_NONE) continue;
      var hm = edgeMidpoint(horizontal), hdx = hm.x - center.x, hdy = hm.y - center.y;
      if (hdx * hdx + hdy * hdy <= limit2) found.push({ edge: horizontal, val: hv });
    }
  }
  for (var vy = y0; vy <= y1; vy++) {
    for (var vx = Math.max(0, x0); vx <= Math.min(COLS, x1 + 1); vx++) {
      var vertical = { dir: 'v', xEdge: vx, y: vy }, vv = getV(vx, vy);
      if (vv === EDGE_NONE) continue;
      var vm = edgeMidpoint(vertical), vdx = vm.x - center.x, vdy = vm.y - center.y;
      if (vdx * vdx + vdy * vdy <= limit2) found.push({ edge: vertical, val: vv });
    }
  }
  (state.customEdges || []).forEach(function(item){
    var mid={x:(item.x1+item.x2)/2,y:(item.y1+item.y2)/2}, dx=mid.x-center.x, dy=mid.y-center.y;
    if(item.val && dx*dx+dy*dy<=limit2) found.push({edge:{dir:'custom',custom:item},val:item.val});
  });
  return found;
}
function checkPassiveSecretDetection(player) {
  if (!player || player.tipo !== 'player' || isHexMap()) return;
  var sheet = getCharacterSheetActionData();
  if (sheet) player.percepcaoPassiva = sheet.passivePerception;
  var passive = Number(player.percepcaoPassiva);
  if (!isFinite(passive)) passive = 10;
  var found = [];
  visibleEdgesForPlayer(player, playerVisionRadius(player)).forEach(function (item) {
    if (item.val !== EDGE_SECRET_WALL && item.val !== EDGE_SECRET_DOOR_C && item.val !== EDGE_SECRET_DOOR_O) return;
    var meta = getEdgeMeta(item.edge);
    if (!meta || meta.detected || passive < Number(meta.dcDetection || 15)) return;
    meta.detected = true;
    found.push(meta.kind === 'secretDoor' ? 'uma porta secreta' : 'uma parede secreta');
  });
  if (found.length) {
    save(); draw();
    appAlertMessage('msg016', 'Percepção passiva ' + passive + ': você percebe ' + found.join(' e ') + '. Encontrar não revela como abrir; investigue o mecanismo.');
  }
}
function performActiveSecretSearch(cell) {
  var roll = numberPrompt('Busca ativa — total de Sabedoria (Percepção):', 15, 0, 60);
  if (roll == null) return;
  var found = [];
  nearbyEdgesForCell(cell, 2).forEach(function (item) {
    if (item.val !== EDGE_SECRET_WALL && item.val !== EDGE_SECRET_DOOR_C && item.val !== EDGE_SECRET_DOOR_O) return;
    var meta = getEdgeMeta(item.edge);
    if (!meta || meta.detected || roll < Number(meta.dcDetection || 15)) return;
    meta.detected = true;
    found.push(meta.kind === 'secretDoor' ? 'porta secreta' : 'parede secreta');
  });
  appAlertMessage('msg017', found.length
    ? 'Sucesso! Você encontrou: ' + found.join(', ') + '. Ainda é necessário descobrir o mecanismo.'
    : 'Nenhuma passagem secreta foi encontrada nesta seção de aproximadamente 3 metros.');
  save(); draw();
}
function investigateEdgeMechanism(edge) {
  var val = getEdgeVal(edge), meta = getEdgeMeta(edge);
  if (val === EDGE_ILLUSION_WALL) {
    var illusionRoll = numberPrompt('Teste de Inteligência (Investigação) para identificar a ilusão. Informe o total:', 15, 0, 60);
    if (illusionRoll == null) return;
    if (meta && illusionRoll >= Number(meta.dcDetection || 15)) {
      meta.detected = true; appAlertMessage('msg018', 'Você identifica a ilusão. Ela não bloqueia passagem.');
    } else appAlertMessage('msg087', 'Você não conseguiu identificar a ilusão.');
    save(); draw(); return;
  }
  if (val !== EDGE_SECRET_WALL && val !== EDGE_SECRET_DOOR_C && val !== EDGE_SECRET_DOOR_O) {
    appAlertMessage('msg019', 'Não há um mecanismo secreto nesta linha.'); return;
  }
  if (!meta || !meta.detected) { appAlertMessage('msg020', 'Primeiro encontre a passagem com Percepção.'); return; }
  if (meta.mechanismKnown) { appAlertMessage('msg021', 'O mecanismo desta passagem já foi descoberto.'); return; }
  var roll = numberPrompt('Teste de Inteligência (Investigação) para descobrir o mecanismo. Informe o total:', 15, 0, 60);
  if (roll == null) return;
  if (roll >= Number(meta.dcMechanism || 15)) {
    meta.mechanismKnown = true;
    var hint = meta.mechanismHint ? '\nComo acionar: ' + meta.mechanismHint : '';
    appAlertMessage('msg022', 'Mecanismo descoberto! Agora você pode acionar a passagem.' + hint);
  } else appAlertMessage('msg088', 'Você encontrou a passagem, mas ainda não descobriu como abri-la.');
  save(); draw();
}
function createSpecialEdge(edge, kind) {
  if (!edge) return;
  var existing = getEdgeVal(edge);
  if (existing !== EDGE_NONE && !appConfirmMessage('msg023', 'Já existe uma parede ou porta nesta linha. Substituir?')) return;
  var isDoor = kind === 'secretDoor' || kind === 'lockedDoor' || kind === 'jammedDoor';
  // Parede mágica segue as estatísticas específicas de pedra mágica (CA 15; 30 PV/polegada).
  var material = kind === 'forceWall' ? 'force' : kind === 'illusionWall' ? 'illusion' :
    kind === 'magicWall' ? 'pedraMagica' : materialPrompt(isDoor ? 'madeira' : 'pedra');
  if (!material) return;
  var meta = makeStructureMeta(OBJECT_MATERIALS[material] ? material : 'madeira', kind, kind === 'secretWall' || kind === 'magicWall' ? 2 : 1);
  var type = EDGE_SECRET_WALL;
  if (kind === 'secretWall' || kind === 'secretDoor') {
    meta.dcDetection = numberPrompt('CD para encontrar (10 fácil, 15 padrão, 20 muito bem escondida):', 15, 1, 40);
    if (meta.dcDetection == null) return;
    meta.dcMechanism = numberPrompt('CD de Inteligência (Investigação) para descobrir o mecanismo:', 15, 1, 40);
    if (meta.dcMechanism == null) return;
    meta.mechanismHint = String(appPromptMessage('msg024', 'Descreva como o mecanismo é acionado (ex.: girar uma tocha, puxar um livro, apertar uma pedra):', 'Um detalhe do ambiente esconde o mecanismo.') || '').trim();
    meta.detected = false; meta.mechanismKnown = false;
    type = kind === 'secretWall' ? EDGE_SECRET_WALL : EDGE_SECRET_DOOR_C;
  } else if (kind === 'lockedDoor') {
    meta.lockDC = numberPrompt('CD das Ferramentas de Ladrão (10–25 é o intervalo comum):', 15, 1, 50);
    if (meta.lockDC == null) return;
    meta.dcForce = numberPrompt('CD de Força (Atletismo) para arrombar fisicamente a porta:', 18, 1, 50);
    if (meta.dcForce == null) return;
    var complexity = appPromptMessage('msg025', 'Complexidade: 1 = simples (1 ação); 2 = complexa (1 minuto).', '1');
    if (complexity == null) return;
    meta.lockComplexity = String(complexity).trim() === '2' ? 'complex' : 'simple';
    meta.keyName = String(appPromptMessage('msg026', 'Nome da chave que abre esta porta (deixe em branco se não houver chave específica):', '') || '').trim();
    meta.arcaneLock = appConfirmMessage('msg027', 'Esta fechadura possui Tranca Arcana? (Cancelar = não)');
    meta.locked = true; type = EDGE_LOCKED_DOOR;
  } else if (kind === 'jammedDoor') {
    var jamMode = appPromptMessage('msg028', 'Tipo de bloqueio: 1 = emperrada (Força/Atletismo); 2 = barrada por dentro (ação Utilizar do lado da barra).', '1');
    if (jamMode == null) return;
    meta.barred = String(jamMode).trim() === '2';
    meta.dcForce = numberPrompt(meta.barred
      ? 'CD de Força (Atletismo) para arrombar a porta do lado oposto à barra:'
      : 'CD de Força (Atletismo) para forçar a porta emperrada:', 15, 1, 50);
    if (meta.dcForce == null) return;
    meta.locked = true; type = EDGE_JAMMED_DOOR;
  } else if (kind === 'illusionWall') {
    meta.dcDetection = numberPrompt('CD de Inteligência (Investigação) para identificar a ilusão:', 15, 1, 40);
    if (meta.dcDetection == null) return;
    meta.material = 'illusion'; meta.detected = false; type = EDGE_ILLUSION_WALL;
    meta.ac = null; meta.hp = null; meta.maxHp = null; meta.threshold = 0;
  } else if (kind === 'forceWall') {
    meta.material = 'force'; meta.ac = null; meta.hp = null; meta.maxHp = null; meta.threshold = 999999;
    meta.detected = false; type = EDGE_FORCE_WALL;
  } else if (kind === 'magicWall') {
    var thickness = numberPrompt('Espessura da parede mágica em polegadas (PV = 30 por polegada):', 1, 1, 36);
    if (thickness == null) return;
    meta.material = 'pedraMagica'; meta.ac = 15;
    meta.hp = 30 * thickness; meta.maxHp = meta.hp; meta.threshold = 10;
    meta.detected = true; type = EDGE_MAGIC_WALL;
  }
  setEdgeVal(edge, type); setEdgeMeta(edge, meta); save(); draw();
  appAlertMessage('msg029', 'Estrutura criada: ' + ({ secretWall:'parede secreta', secretDoor:'porta secreta', lockedDoor:'porta trancada', jammedDoor:'porta emperrada', illusionWall:'parede ilusória', forceWall:'Muralha de Energia', magicWall:'parede mágica' })[kind] + '.');
}
function structureKindFromEdge(edge) {
  var val = getEdgeVal(edge), meta = getEdgeMeta(edge) || {};
  if (val === EDGE_MURO) return 'muro';
  if (val === EDGE_DOOR_C || val === EDGE_DOOR_O) return 'porta';
  if (val === EDGE_SECRET_WALL) return 'secretWall';
  if (val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) return 'secretDoor';
  if (val === EDGE_LOCKED_DOOR) return 'lockedDoor';
  if (val === EDGE_JAMMED_DOOR) return 'jammedDoor';
  if (val === EDGE_ILLUSION_WALL) return 'illusionWall';
  if (val === EDGE_FORCE_WALL) return 'forceWall';
  if (val === EDGE_MAGIC_WALL) return 'magicWall';
  return meta.kind || 'muro';
}
function openStructureEditor(edge) {
  if (!edge || getEdgeVal(edge) === EDGE_NONE) { appAlertMessage('msg064', 'Não há parede ou porta nesta linha.'); return; }
  var oldMeta = getEdgeMeta(edge) || {};
  var initialKind = structureKindFromEdge(edge);
  var DOOR_KINDS = ['porta', 'secretDoor', 'lockedDoor', 'jammedDoor'];
  var isDoor = DOOR_KINDS.indexOf(initialKind) >= 0;
  // Portas e muros têm editores separados: cada um lista só os tipos da sua categoria.
  var kinds = isDoor ? [
    ['porta','Porta comum'],['secretDoor','Porta secreta'],['lockedDoor','Porta trancada'],['jammedDoor','Porta emperrada / barrada']
  ] : [
    ['muro','Muro comum'],['secretWall','Parede secreta'],['illusionWall','Parede ilusória'],
    ['forceWall','Muralha de Energia'],['magicWall','Parede mágica']
  ];
  // Campos exibidos (e salvos) para cada tipo.
  var STRUCT = ['material','ac','hp','maxHp','threshold'];
  var KIND_FIELDS = {
    muro: ['ac','hp','maxHp','threshold'],
    porta: STRUCT.concat(['open']),
    secretDoor: STRUCT.concat(['dcDetection','dcMechanism','mechanismHint','detected','mechanismKnown','open']),
    secretWall: STRUCT.concat(['dcDetection','dcMechanism','mechanismHint','detected','mechanismKnown','open']),
    lockedDoor: STRUCT.concat(['lockDC','dcForce','lockComplexity','keyName','arcaneLock','open']),
    jammedDoor: STRUCT.concat(['dcForce','barred','open']),
    illusionWall: ['dcDetection','detected'],
    forceWall: [],
    magicWall: ['ac','hp','maxHp','threshold']
  };
  var KIND_LABELS = {
    porta: { open: 'Porta aberta' },
    secretDoor: { dcDetection: 'CD para detectar a porta', detected: 'Porta secreta já detectada', open: 'Porta aberta' },
    secretWall: { dcDetection: 'CD para detectar a parede', detected: 'Parede secreta já detectada', open: 'Passagem aberta' },
    lockedDoor: { dcForce: 'CD de Força (Atletismo) para arrombar', open: 'Porta aberta' },
    jammedDoor: { dcForce: 'CD de Força (Atletismo) para forçar', open: 'Porta aberta' },
    illusionWall: { dcDetection: 'CD para identificar a ilusão (Investigação)', detected: 'Ilusão já identificada' }
  };
  var KIND_NOTES = {
    illusionWall: 'A parede ilusória parece sólida, mas não bloqueia a passagem. Ela deixa de bloquear a visão depois de identificada.',
    forceWall: 'A Muralha de Energia é invisível, bloqueia o movimento, não bloqueia a visão e não tem propriedades ajustáveis.'
  };
  var dlg = createPortalDialog(isDoor ? 'Editar porta' : 'Editar muro',
    isDoor ? 'Edite somente esta porta. Escolha o tipo da porta e ajuste suas propriedades.'
           : 'Edite somente este muro. Escolha o tipo do muro e ajuste suas propriedades.');
  if (!dlg) return;
  dlg.panel.style.width = 'min(620px,100%)';
  dlg.panel.style.maxHeight = '88%'; dlg.panel.style.overflow = 'auto';
  var form = document.createElement('div');
  form.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:10px 0 16px;';
  var fieldWraps = {}, fieldLabels = {}, defaultLabels = {};
  function field(label, key, value, type) {
    var wrap=document.createElement('label'); wrap.style.cssText='display:flex;flex-direction:column;gap:4px;font-size:12px;color:#d5d9e2;';
    var span=document.createElement('span'); span.textContent=label; wrap.appendChild(span);
    var input=document.createElement(type==='select'?'select':'input');
    if(type!=='select') input.type=type||'text';
    input.dataset.key=key;
    input.style.cssText='width:100%;min-width:0;box-sizing:border-box;padding:8px;border:1px solid #555d6c;border-radius:6px;background:#252a34;color:#fff;';
    if(type==='select' && key==='kind') kinds.forEach(function(k){var o=document.createElement('option');o.value=k[0];o.textContent=k[1];input.appendChild(o);});
    if(type==='select' && key==='material') Object.keys(OBJECT_MATERIALS).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=OBJECT_MATERIALS[k].label;input.appendChild(o);});
    if(type==='checkbox') input.checked=!!value; else input.value=value==null?'':String(value);
    wrap.appendChild(input); form.appendChild(wrap);
    fieldWraps[key]=wrap; fieldLabels[key]=span; defaultLabels[key]=label;
    return input;
  }
  var kind=field(isDoor ? 'Tipo da porta' : 'Tipo do muro','kind',initialKind,'select');
  var material=field('Material','material',oldMeta.material||'pedra','select');
  var ac=field('Classe de Armadura (CA)','ac',oldMeta.ac==null?17:oldMeta.ac,'number');
  var hp=field('Pontos de Vida (PV)','hp',oldMeta.hp==null?27:oldMeta.hp,'number');
  var maxHp=field('PV máximo','maxHp',oldMeta.maxHp==null?(oldMeta.hp==null?27:oldMeta.hp):oldMeta.maxHp,'number');
  var threshold=field('Limiar de dano','threshold',oldMeta.threshold==null?0:oldMeta.threshold,'number');
  var dcDetection=field('CD para detectar','dcDetection',oldMeta.dcDetection==null?15:oldMeta.dcDetection,'number');
  var dcMechanism=field('CD para descobrir mecanismo','dcMechanism',oldMeta.dcMechanism==null?15:oldMeta.dcMechanism,'number');
  var mechanismHint=field('Dica do mecanismo','mechanismHint',oldMeta.mechanismHint||'','text');
  var lockDC=field('CD das Ferramentas de Ladrão','lockDC',oldMeta.lockDC==null?15:oldMeta.lockDC,'number');
  var dcForce=field('CD de Força / Atletismo','dcForce',oldMeta.dcForce==null?15:oldMeta.dcForce,'number');
  var lockComplexity=field('Complexidade da fechadura','lockComplexity',oldMeta.lockComplexity||'simple','select');
  ['simple','complex'].forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v==='simple'?'Simples (1 ação)':'Complexa (1 minuto)';lockComplexity.appendChild(o);});
  lockComplexity.value=oldMeta.lockComplexity||'simple';
  var keyName=field('Nome da chave','keyName',oldMeta.keyName||'','text');
  var barred=field('Barrada por dentro','barred',oldMeta.barred,'checkbox');
  var arcane=field('Possui Tranca Arcana','arcaneLock',oldMeta.arcaneLock,'checkbox');
  var detected=field('Já detectado','detected',oldMeta.detected,'checkbox');
  var mechanismKnown=field('Mecanismo descoberto','mechanismKnown',oldMeta.mechanismKnown,'checkbox');
  var opened=field('Aberta','open',oldMeta.open,'checkbox');
  dlg.panel.appendChild(form);
  var note=document.createElement('p'); dlg.panel.appendChild(note);
  function applyKind() {
    var k = kind.value, list = KIND_FIELDS[k] || [], labels = KIND_LABELS[k] || {};
    Object.keys(fieldWraps).forEach(function (key) {
      if (key === 'kind') return;
      fieldWraps[key].style.display = list.indexOf(key) >= 0 ? '' : 'none';
      fieldLabels[key].textContent = labels[key] || defaultLabels[key];
    });
    note.textContent = KIND_NOTES[k] || '';
    note.style.display = KIND_NOTES[k] ? '' : 'none';
  }
  kind.addEventListener('change', applyKind);
  applyKind();
  var actions=document.createElement('div'); actions.className='mp-portal-dialog-actions';
  var cancel=document.createElement('button'); cancel.type='button'; cancel.textContent='Cancelar'; cancel.onclick=function(){closePortalDialog(dlg.overlay);};
  var remove=document.createElement('button'); remove.type='button'; remove.className='danger'; remove.textContent=isDoor?'Remover porta':'Remover muro'; remove.onclick=function(){setEdgeVal(edge,EDGE_NONE);setEdgeMeta(edge,null);save();draw();closePortalDialog(dlg.overlay);};
  var saveBtn=document.createElement('button'); saveBtn.type='button'; saveBtn.className='primary'; saveBtn.textContent='Salvar alterações';
  saveBtn.onclick=function(){
    var k=kind.value, list=KIND_FIELDS[k]||[], m=Object.assign({},oldMeta);
    function has(key){ return list.indexOf(key)>=0; }
    m.kind=k;
    if(has('material')) m.material=material.value;
    if(has('ac')) m.ac=Math.max(0,Number(ac.value)||0);
    if(has('hp')) m.hp=Math.max(0,Number(hp.value)||0);
    if(has('maxHp')) m.maxHp=Math.max(0,Number(maxHp.value)||m.hp);
    if(has('threshold')) m.threshold=Math.max(0,Number(threshold.value)||0);
    if(has('dcDetection')) m.dcDetection=Math.max(1,Number(dcDetection.value)||15);
    if(has('dcMechanism')) m.dcMechanism=Math.max(1,Number(dcMechanism.value)||15);
    if(has('mechanismHint')) m.mechanismHint=mechanismHint.value;
    if(has('lockDC')) m.lockDC=Math.max(1,Number(lockDC.value)||15);
    if(has('dcForce')) m.dcForce=Math.max(1,Number(dcForce.value)||15);
    if(has('lockComplexity')) m.lockComplexity=lockComplexity.value;
    if(has('keyName')) m.keyName=keyName.value;
    if(has('barred')) m.barred=barred.checked;
    if(has('arcaneLock')) m.arcaneLock=arcane.checked;
    if(has('detected')) m.detected=detected.checked;
    if(has('mechanismKnown')) m.mechanismKnown=mechanismKnown.checked;
    m.open = has('open') ? opened.checked : false;
    m.locked = (k==='lockedDoor' || k==='jammedDoor');
    var isOpen = !!m.open;
    var vals={muro:EDGE_MURO,porta:isOpen?EDGE_DOOR_O:EDGE_DOOR_C,secretWall:EDGE_SECRET_WALL,secretDoor:isOpen?EDGE_SECRET_DOOR_O:EDGE_SECRET_DOOR_C,lockedDoor:EDGE_LOCKED_DOOR,jammedDoor:EDGE_JAMMED_DOOR,illusionWall:EDGE_ILLUSION_WALL,forceWall:EDGE_FORCE_WALL,magicWall:EDGE_MAGIC_WALL};
    if(k==='muro') m.material='pedra';
    if(k==='illusionWall'){m.material='illusion';m.hp=null;m.maxHp=null;m.ac=null;m.threshold=0;}
    if(k==='forceWall'){m.material='force';m.hp=null;m.maxHp=null;m.ac=null;m.threshold=999999;}
    if(k==='magicWall'){m.material='pedraMagica';}
    setEdgeVal(edge,vals[k]); setEdgeMeta(edge,m); save(); draw(); closePortalDialog(dlg.overlay);
  };
  actions.appendChild(remove); actions.appendChild(cancel); actions.appendChild(saveBtn); dlg.panel.appendChild(actions);
}

function edgeActionLabel(val, meta) {
  if (val === EDGE_SECRET_WALL || val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) return meta && meta.kind === 'secretDoor' ? 'porta secreta' : 'parede secreta';
  if (val === EDGE_LOCKED_DOOR) return 'porta trancada';
  if (val === EDGE_JAMMED_DOOR) return 'porta emperrada/barrada';
  if (val === EDGE_ILLUSION_WALL) return 'parede ilusória';
  if (val === EDGE_FORCE_WALL) return 'Muralha de Energia';
  if (val === EDGE_MAGIC_WALL) return 'parede mágica';
  if (val === EDGE_MURO) return 'muro';
  return 'porta';
}
function openDoorEdge(edge, open) {
  var val = getEdgeVal(edge), meta = getEdgeMeta(edge);
  if (val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) {
    setEdgeVal(edge, open ? EDGE_SECRET_DOOR_O : EDGE_SECRET_DOOR_C);
    setEdgeMeta(edge, meta);
  } else if (val === EDGE_LOCKED_DOOR || val === EDGE_JAMMED_DOOR) {
    if (meta) meta.open = !!open;
  } else setEdgeVal(edge, open ? EDGE_DOOR_O : EDGE_DOOR_C);
  save(); draw();
}
function interactWithEdge(edge) {
  var val = getEdgeVal(edge), meta = getEdgeMeta(edge);
  if (val === EDGE_SECRET_WALL || val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) {
    if (!meta || !meta.detected) { appAlertMessage('msg030', 'Você não percebe nada incomum nesta parte da parede.'); return; }
    if (!meta.mechanismKnown) { appAlertMessage('msg031', 'Você encontrou a passagem, mas ainda não descobriu como acioná-la. Use Investigar mecanismo.'); return; }
    if (val === EDGE_SECRET_WALL) {
      meta.open = !meta.open;
      appAlertMessage('msg032', meta.open ? 'O mecanismo foi acionado e a passagem secreta se abriu.' : 'A passagem secreta foi fechada.');
      save(); draw(); return;
    }
    openDoorEdge(edge, val !== EDGE_SECRET_DOOR_O); return;
  }
  if (val === EDGE_LOCKED_DOOR) {
    if (!meta) { meta = makeStructureMeta('madeira', 'lockedDoor', 1); meta.locked = true; setEdgeMeta(edge, meta); }
    if (meta.open) { meta.open = false; save(); draw(); appAlertMessage('msg033', 'A porta foi fechada.'); return; }

    var now = Date.now();
    var arcaneConfigured = !!meta.arcaneLock;
    var arcaneSuppressed = arcaneConfigured && now < Number(meta.arcaneSuppressedUntil || 0);
    if (!meta.locked && !arcaneSuppressed) {
      meta.open = true;
    } else if (arcaneSuppressed) {
      meta.open = true;
      appAlertMessage('msg034', 'A Tranca Arcana está suprimida; a porta pode ser aberta durante os 10 minutos restantes.');
    } else {
      var approach = appPromptMessage('msg035', 
        'Como deseja abrir a porta trancada?\n1 = Ferramentas de Ladrão (Destreza/Prestidigitação) — ' + (meta.lockComplexity === 'complex' ? '1 minuto' : '1 ação') +
        '\n2 = Forçar fisicamente (Força/Atletismo)' +
        (meta.keyName ? '\nCHAVE = usar a chave (' + meta.keyName + ')' : '') +
        '\nDigite ARROMBAR para usar a magia Knock/Arrombar.', '1');
      if (approach == null) return;
      var command = String(approach).trim().toLowerCase();
      if (command === 'arrombar' || command === 'knock') {
        meta.open = true;
        if (arcaneConfigured) {
          meta.arcaneSuppressedUntil = now + 10 * 60 * 1000;
          appAlertMessage('msg036', 'Arrombar abriu a porta. A Tranca Arcana fica suprimida por 10 minutos.');
        } else {
          meta.locked = false;
          appAlertMessage('msg037', 'Arrombar abriu instantaneamente a fechadura mundana.');
        }
      } else if (command === 'chave' && meta.keyName) {
        var usedKey = String(appPromptMessage('msg038', 'Digite o nome da chave utilizada:', '') || '').trim().toLocaleLowerCase();
        if (usedKey && usedKey === meta.keyName.toLocaleLowerCase()) {
          if (arcaneConfigured && !arcaneSuppressed) {
            appAlertMessage('msg039', 'A chave física não supera a Tranca Arcana. Use um teste com CD +10 ou a magia Arrombar.');
          } else {
            meta.locked = false; meta.open = true;
            appAlertMessage('msg040', 'A chave correta destranca e abre a porta.');
          }
        } else {
          appAlertMessage('msg041', 'Esta chave não corresponde à fechadura.');
        }
      } else {
        var checkIsForce = command === '2';
        var baseDC = checkIsForce ? Number(meta.dcForce || 18) : Number(meta.lockDC || 15);
        var dc = baseDC + (arcaneConfigured ? 10 : 0);
        var testName = checkIsForce ? 'Força (Atletismo)' : 'Destreza (Prestidigitação) com Ferramentas de Ladrão';
        var roll = numberPrompt(testName + ' — CD ' + dc + '. Informe o total:', dc, 0, 60);
        if (roll == null) return;
        if (roll >= dc) {
          meta.open = true;
          // Sem Tranca Arcana, vencer ou arrombar a fechadura a deixa inutilizada.
          // Com a magia, a proteção persiste e volta a valer quando a porta for fechada.
          if (!arcaneConfigured) meta.locked = false;
          appAlertMessage('msg042', checkIsForce
            ? 'Sucesso! Você força a porta e consegue abri-la.'
            : 'Sucesso! Você vence a fechadura e abre a porta.');
        } else {
          appAlertMessage('msg043', 'Falha. A porta continua trancada.');
        }
      }
    }
    save(); draw(); return;
  }
  if (val === EDGE_JAMMED_DOOR) {
    if (!meta) { meta = makeStructureMeta('madeira', 'jammedDoor', 1); setEdgeMeta(edge, meta); }
    if (meta.open) { meta.open = false; save(); draw(); appAlertMessage('msg044', 'A porta foi fechada.'); return; }
    if (meta.barred && appConfirmMessage('msg045', 'O personagem está do lado em que consegue alcançar e levantar a barra? (OK = ação Utilizar)')) {
      meta.open = true; save(); draw(); appAlertMessage('msg046', 'Você levanta a barra com uma ação Utilizar e abre a porta.'); return;
    }
    var forceRoll = numberPrompt('Força (Atletismo) para forçar a porta — CD ' + Number(meta.dcForce || 15) + '. Informe o total:', 15, 0, 60);
    if (forceRoll == null) return;
    if (forceRoll >= Number(meta.dcForce || 15)) { meta.open = true; appAlertMessage('msg047', 'Você força a porta e consegue abri-la.'); }
    else appAlertMessage('msg089', 'A porta não cede.');
    save(); draw(); return;
  }
  if (val === EDGE_DOOR_C || val === EDGE_DOOR_O) { openDoorEdge(edge, val === EDGE_DOOR_C); return; }
  if (val === EDGE_FORCE_WALL) { appAlertMessage('msg048', 'Muralha de Energia: invisível, imune a dano comum e bloqueia a passagem. Só Desintegrar a destrói; teletransporte pode atravessá-la.'); return; }
  if (val === EDGE_ILLUSION_WALL) { if (meta) meta.detected = true; save(); draw(); appAlertMessage('msg049', 'Você percebe a ilusão: ela não bloqueia a passagem.'); return; }
  if (val === EDGE_MAGIC_WALL || val === EDGE_SECRET_WALL || val === EDGE_MURO) appAlertMessage('msg050', edgeActionLabel(val, meta) + '. Use Atacar estrutura para tentar destruí-la.');
}
function ensureEdgeStructureMeta(edge) {
  var meta = getEdgeMeta(edge), val = getEdgeVal(edge);
  if (meta) return meta;
  var isWall = val === EDGE_MURO || val === EDGE_SECRET_WALL || val === EDGE_MAGIC_WALL;
  var material = isWall || val === EDGE_FORCE_WALL ? 'pedra' : 'madeira';
  var kind = val === EDGE_MURO ? 'wallLine' :
    val === EDGE_SECRET_WALL ? 'secretWall' :
    val === EDGE_MAGIC_WALL ? 'magicWall' :
    val === EDGE_FORCE_WALL ? 'forceWall' :
    val === EDGE_LOCKED_DOOR ? 'lockedDoor' :
    val === EDGE_JAMMED_DOOR ? 'jammedDoor' :
    val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O ? 'secretDoor' : 'door';
  meta = makeStructureMeta(material, kind, isWall ? 2 : 1);
  if (val === EDGE_FORCE_WALL) { meta.material = 'force'; meta.ac = null; meta.hp = null; meta.maxHp = null; }
  setEdgeMeta(edge, meta); return meta;
}
function damageObject(meta, label, destroy) {
  if (!meta) return;
  if (meta.material === 'force') {
    var command = appPromptMessage('msg051', 'Muralha de Energia só pode ser destruída por Desintegrar. Digite DESINTEGRAR para aplicar a magia:', '');
    if (String(command || '').trim().toLowerCase() === 'desintegrar') { destroy(); appAlertMessage('msg052', label + ' foi dissipada.'); }
    else appAlertMessage('msg090', 'Nenhum dano foi causado.');
    return;
  }
  if (meta.material === 'illusion') { appAlertMessage('msg053', 'A barreira é ilusória; não há estrutura física para destruir.'); return; }
  var stats = OBJECT_MATERIALS[meta.material] || OBJECT_MATERIALS.pedra;
  var ac = Number(meta.ac || stats.ac);
  var attack = numberPrompt('Ataque contra ' + label + ' — CA ' + ac + '. Informe o total da jogada:', ac, 0, 60);
  if (attack == null) return;
  if (attack < ac) { appAlertMessage('msg054', 'Ataque não atingiu a CA ' + ac + '.'); return; }
  var damage = numberPrompt('Dano causado em um único golpe (PV restantes: ' + Number(meta.hp || 0) + '):', 8, 0, 500);
  if (damage == null) return;
  var damageType = appPromptMessage('msg055', 'Tipo de dano (cortante, contundente, perfurante, fogo, ácido, elétrico, psíquico, venenoso etc.):', 'contundente');
  if (damageType == null) return;
  damageType = String(damageType).toLowerCase();
  if ((stats.immune || []).some(function (t) { return damageType.indexOf(t) >= 0; })) { appAlertMessage('msg056', 'Este material é imune a dano ' + damageType + '.'); return; }
  if (meta.material === 'ferro' && damageType.indexOf('perfurante') >= 0 && !appConfirmMessage('msg057', 'Ferro/aço resiste a perfuração comum. Este ataque é mágico? (Cancelar = não)')) {
    appAlertMessage('msg058', 'A estrutura é imune a perfuração não mágica.'); return;
  }
  if (stats.needsMagic && !appConfirmMessage('msg059', 'O ataque é mágico? (Cancelar = não)')) { appAlertMessage('msg060', 'Este material não sofre dano de armas não mágicas.'); return; }
  var applied = damage;
  if (stats.vulnerableFire && damageType.indexOf('fogo') >= 0) applied *= 2;
  var isStoneWall = (meta.material === 'pedra' || meta.material === 'pedraMagica') && /wall/i.test(meta.kind || '');
  if (isStoneWall && appConfirmMessage('msg061', 'O personagem é proficiente com Ferramentas de Pedreiro?')) applied *= 2;
  var threshold = Number(meta.threshold || 0);
  if (applied < threshold) { appAlertMessage('msg062', 'O golpe não alcançou o limiar de dano ' + threshold + '. Nenhum PV foi removido.'); return; }
  meta.hp = Math.max(0, Number(meta.hp || 0) - applied);
  if (meta.hp <= 0) { destroy(); appAlertMessage('msg063', label + ' foi destruído!'); }
  else appAlertMessage('msg091', label + ' sofreu ' + applied + ' de dano. PV restantes: ' + meta.hp + '/' + meta.maxHp + '.');
}
function damageEdgeStructure(edge) {
  var val = getEdgeVal(edge);
  if (val === EDGE_NONE) { appAlertMessage('msg064', 'Não há parede ou porta nesta linha.'); return; }
  if (val === EDGE_ILLUSION_WALL) { appAlertMessage('msg065', 'A barreira é uma ilusão e não possui PV.'); return; }
  var meta = ensureEdgeStructureMeta(edge);
  damageObject(meta, edgeActionLabel(val, meta), function () { setEdgeVal(edge, EDGE_NONE); });
  save(); draw();
}
function damageCellWall(cell) {
  var i = idx(cell.x, cell.y);
  if (!state.walls[i]) { appAlertMessage('msg066', 'Não há uma parede nesta quadrícula.'); return; }
  if (!state.wallMeta) state.wallMeta = makeArr(COLS * ROWS, null);
  var meta = state.wallMeta[i] || makeStructureMeta('pedra', 'wall', 2);
  state.wallMeta[i] = meta;
  damageObject(meta, 'parede de pedra', function () { state.walls[i] = 0; state.wallMeta[i] = null; });
  save(); draw();
}

var detailCache = {};
var DETAIL_MAX = 6;

function drawDetail(W, H) {
  var d = MAPINFO && MAPINFO.detail;
  if (!d || zoom < d.minZoom) return;
  var tw = MAP_W / d.n, th = MAP_H / d.n;
  var c0 = Math.max(0, Math.floor((-ox / zoom) / tw));
  var c1 = Math.min(d.n - 1, Math.floor(((W - ox) / zoom) / tw));
  var r0 = Math.max(0, Math.floor((-oy / zoom) / th));
  var r1 = Math.min(d.n - 1, Math.floor(((H - oy) / zoom) / th));
  var now = Date.now(), visible = {};
  for (var r = r0; r <= r1; r++) {
    for (var c = c0; c <= c1; c++) {
      var k = r + '_' + c;
      visible[k] = 1;
      var t = detailCache[k];
      if (!t) {
        t = detailCache[k] = { img: new Image(), t: now };
        t.img.onload = function () { draw(); };
        var runtimeTile = d.runtimeTiles && d.runtimeTiles[k];
        t.img.src = runtimeTile || d.src.replace('{r}', r).replace('{c}', c);
      }
      t.t = now;
      if (t.img.complete && t.img.naturalWidth) cx.drawImage(t.img, c * tw, r * th, tw + 0.5, th + 0.5);
    }
  }
  var keys = Object.keys(detailCache);
  if (keys.length > DETAIL_MAX) {
    keys.filter(function (k) { return !visible[k]; })
      .sort(function (a, b) { return detailCache[a].t - detailCache[b].t; })
      .slice(0, keys.length - DETAIL_MAX)
      .forEach(function (k) { detailCache[k].img.onload = null; detailCache[k].img.src = ''; delete detailCache[k]; });
  }
}

function focusCameraOnPlayer(viewW, viewH, force) {
  if (!isHexMap() || !cv || (appMode === 'editor' && !force)) return;
  zoom = FLANAESS_ZOOM; // Flanaess fixo em 300%.
  var player = currentPlayer();
  if (!player) return;
  var center = worldTravelPos || cellCenter(player.x, player.y);
  // O canvas aplica translate(ox, oy) antes de scale(zoom, zoom).
  // Portanto, o deslocamento precisa compensar a coordenada já multiplicada pelo zoom.
  var width = viewW == null ? cv.clientWidth : viewW;
  var height = viewH == null ? cv.clientHeight : viewH;
  ox = width / 2 - center.x * zoom;
  oy = height / 2 - center.y * zoom;
}

function visionZoom(viewW, viewH) {
  var p = currentPlayer();
  var r = Math.max(1, (p && p.luz) || lightRadius);
  var w = viewW == null ? cv.clientWidth : viewW;
  var h = viewH == null ? cv.clientHeight : viewH;
  return Math.max(0.04, Math.min(w, h) / ((r * 2 + 1) * CELL));
}

function centerCameraOnPlayer(viewW, viewH, force) {
  if (isHexMap() || !cv || (appMode === 'editor' && !force)) return;
  var p = currentPlayer();
  var width = viewW == null ? cv.clientWidth : viewW;
  var height = viewH == null ? cv.clientHeight : viewH;
  if (!p || !width || !height) return;

  // Limita o afastamento: a câmera não pode mostrar uma área maior
  // que o raio de visão atual do personagem. Aproximar continua permitido.
  var minZoom = visionZoom(width, height);
  zoom = Math.max(minZoom, zoom);

  // Durante a caminhada usa a posição interpolada para a câmera acompanhar
  // o personagem quadro a quadro, sem zona morta ou atraso.
  var c = keyMoveVis || tokenAnchor(p, p.x, p.y);
  ox = width / 2 - c.x * zoom;
  oy = height / 2 - c.y * zoom;
}

function changeCameraZoom(factor, anchorX, anchorY) {
  if (!cv) return;
  if (appMode === 'editor') {
    // Zoom livre, ancorado no cursor (ou no centro da tela pelos botões +/-).
    var viewW = cv.clientWidth, viewH = cv.clientHeight;
    var ax = anchorX == null ? viewW / 2 : anchorX;
    var ay = anchorY == null ? viewH / 2 : anchorY;
    var worldX = (ax - ox) / zoom, worldY = (ay - oy) / zoom;
    zoom = Math.max(0.02, Math.min(32, zoom * factor));
    ox = ax - worldX * zoom;
    oy = ay - worldY * zoom;
    draw();
    return;
  }
  // No modo Jogador, o mapa-múndi mantém o enquadramento automático.
  if (isHexMap()) return;
  var minZoom = visionZoom();
  var maxZoom = 16;
  zoom = Math.max(minZoom, Math.min(maxZoom, zoom * factor));
  centerCameraOnPlayer();
  draw();
}

function onWindowResize() {
  centerCameraOnPlayer();
  draw();
}

function stopWorldTravel(shouldSave) {
  if (worldTravelRaf != null) {
    window.cancelAnimationFrame(worldTravelRaf);
    worldTravelRaf = null;
  }
  worldTravelPath = [];
  worldTravelTarget = null;
  worldTravelStep = null;
  worldTravelPos = null;
  worldTravelCarry = null;
  if (shouldSave && isHexMap()) save();
}

// Para a viagem de forma suave: termina o hexágono atual e não continua o resto do caminho.
function haltWorldTravel() {
  worldTravelPath = [];
  worldTravelTarget = null;
  if (!worldTravelStep) stopWorldTravel(true);
  draw();
}

function worldTravelFrame(now) {
  worldTravelRaf = null;
  var player = currentPlayer();
  if (!player || !isHexMap() || !cv) { stopWorldTravel(false); return; }

  while (true) {
    if (!worldTravelStep) {
      var next = worldTravelPath.shift();
      if (!next) break;
      var toPt = cellCenter(next.x, next.y);
      worldTravelStep = {
        from: cellCenter(player.x, player.y), to: next, toPt: toPt,
        t0: worldTravelCarry != null ? worldTravelCarry : now
      };
      worldTravelCarry = null;
    }
    var st = worldTravelStep;
    var p = (now - st.t0) / WORLD_TRAVEL_STEP_MS;
    if (p >= 1) {
      // Chegou ao hexágono: grava a posição lógica e segue para o próximo sem pausa.
      player.x = st.to.x; player.y = st.to.y;
      selected = player;
      save();
      var reachedLocalPortal = findLocalPortalAt(player.x, player.y);
      if (reachedLocalPortal) {
        var localDestination = localPortalDestination(reachedLocalPortal, player.x, player.y);
        if (localDestination) {
          player.x = localDestination.x; player.y = localDestination.y;
          worldTravelPath = []; worldTravelTarget = null;
          worldTravelStep = null; worldTravelPos = null; worldTravelCarry = null;
          selected = player;
          save(); draw();
          return;
        }
      }
      var reachedPortal = findWorldPortalAt(player.x, player.y);
      if (reachedPortal) {
        worldTravelPath = []; worldTravelTarget = null;
        worldTravelStep = null; worldTravelPos = null; worldTravelCarry = null;
        teleportThroughWorldPortal(reachedPortal);
        return;
      }
      worldTravelCarry = st.t0 + WORLD_TRAVEL_STEP_MS;
      worldTravelStep = null;
      continue;
    }
    worldTravelPos = {
      x: st.from.x + (st.toPt.x - st.from.x) * p,
      y: st.from.y + (st.toPt.y - st.from.y) * p
    };
    draw();
    worldTravelRaf = window.requestAnimationFrame(worldTravelFrame);
    return;
  }

  worldTravelPos = null;
  worldTravelCarry = null;
  worldTravelTarget = null;
  save();
  draw();
}

function startWorldTravel(destination) {
  var player = currentPlayer();
  if (!isHexMap() || !player || !destination) return;
  stopKeyMove();
  // Se já está andando, o novo caminho parte do hexágono para onde ele está indo agora.
  var origin = worldTravelStep ? worldTravelStep.to : { x: player.x, y: player.y };
  if (destination.x === origin.x && destination.y === origin.y) {
    var standingLocalPortal = findLocalPortalAt(destination.x, destination.y);
    if (standingLocalPortal) {
      var localDestination = localPortalDestination(standingLocalPortal, destination.x, destination.y);
      if (localDestination) { player.x = localDestination.x; player.y = localDestination.y; selected = player; save(); draw(); return; }
    }
    var standingPortal = findWorldPortalAt(destination.x, destination.y);
    if (standingPortal) { teleportThroughWorldPortal(standingPortal); return; }
    worldTravelPath = [];
    worldTravelTarget = null;
    draw();
    return;
  }
  worldTravelPath = hexLine(origin, destination).slice(1);
  worldTravelTarget = { x: destination.x, y: destination.y };
  if (worldTravelRaf == null) worldTravelRaf = window.requestAnimationFrame(worldTravelFrame);
  draw();
}

function drawWorldPortals() {
  if (!isHexMap() || !Array.isArray(state.portals)) return;
  state.portals.forEach(function (portal) {
    if (!portal.destMapId) return;
    var center = cellCenter(portal.x, portal.y);
    var color = /^#[0-9a-f]{6}$/i.test(String(portal.color || '')) ? portal.color : '#36a9e1';
    cx.save();
    cx.globalAlpha = 0.40;
    hexPath(cx, center, null, color, 1 / zoom);
    cx.restore();
  });
}

function drawLocalPortals() {
  if (!Array.isArray(state.portals)) return;
  function drawEndpoint(x, y, label, color) {
    var center = cellCenter(x, y);
    cx.save();
    cx.globalAlpha = 0.88;
    cx.strokeStyle = color;
    cx.fillStyle = color;
    cx.lineWidth = 2 / zoom;
    if (isHexMap()) {
      hexPath(cx, center, 'rgba(30,170,220,0.12)', color, 2 / zoom);
    } else {
      cx.strokeRect(x * CELL + 2 / zoom, y * CELL + 2 / zoom, CELL - 4 / zoom, CELL - 4 / zoom);
    }
    cx.beginPath();
    cx.arc(center.x, center.y, (isHexMap() ? 7 : 6) / zoom, 0, Math.PI * 2);
    cx.fill();
    cx.globalAlpha = 1;
    cx.fillStyle = '#071018';
    cx.font = 'bold ' + (10 / zoom) + 'px sans-serif';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(label, center.x, center.y);
    cx.restore();
  }

  state.portals.forEach(function (portal) {
    if (portal.destMapId || !isFinite(Number(portal.destX)) || !isFinite(Number(portal.destY))) return;
    var color = /^#[0-9a-f]{6}$/i.test(String(portal.color || '')) ? portal.color : '#36a9e1';
    drawEndpoint(portal.x, portal.y, 'A', color);
    drawEndpoint(portal.destX, portal.destY, 'B', color);
  });
  if (pendingLocalPortal) drawEndpoint(pendingLocalPortal.x, pendingLocalPortal.y, 'A', '#ffd54f');
}

function drawWorldTravelPath() {
  if (!isHexMap()) return;
  var player = currentPlayer();
  if (!player || (!worldTravelPath.length && !worldTravelStep)) return;
  var points = [];
  if (worldTravelStep) points.push(worldTravelStep.toPt);
  worldTravelPath.forEach(function (cell) { points.push(cellCenter(cell.x, cell.y)); });
  if (!points.length) return;
  var start = worldTravelPos || cellCenter(player.x, player.y);
  cx.save();
  cx.strokeStyle = 'rgba(255, 215, 75, 0.9)';
  cx.fillStyle = 'rgba(255, 215, 75, 0.95)';
  cx.lineWidth = 3 / zoom;
  cx.setLineDash([7 / zoom, 5 / zoom]);
  cx.beginPath();
  cx.moveTo(start.x, start.y);
  points.forEach(function (pt) { cx.lineTo(pt.x, pt.y); });
  cx.stroke();
  var end = points[points.length - 1];
  cx.setLineDash([]);
  cx.beginPath(); cx.arc(end.x, end.y, 9 / zoom, 0, Math.PI * 2); cx.stroke();
  cx.restore();
}

function draw() {
  if (!cv || !cx) return;
  var dpr = window.devicePixelRatio || 1;
  var W = cv.clientWidth, H = cv.clientHeight;
  if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
  }
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (appMode !== 'editor') {
    if (isHexMap()) focusCameraOnPlayer(W, H);
    else centerCameraOnPlayer(W, H);
  }
  cx.fillStyle = '#0a0a0b';
  cx.fillRect(0, 0, W, H);

  cx.save();
  cx.translate(ox, oy);
  cx.scale(zoom, zoom);

  PARTS.forEach(function (p, i) {
    var img = bgImages[i];
    if (img && img.complete && img.naturalWidth) cx.drawImage(img, p.x, p.y, p.w, p.h);
    else { cx.fillStyle = '#1a1a1c'; cx.fillRect(p.x, p.y, p.w, p.h); }
  });
  // No Flanaess, sobrepõe os tiles detalhados para usar a resolução máxima.
  if (isHexMap()) drawDetail(W, H);

  if (showWalls && !isHexMap()) {
    var wallBounds = visibleCellBounds(W, H);
    if (isHexMap()) {
      var hmWalls = hexMetrics();
      cx.beginPath();
      for (var wy = wallBounds.y0; wy <= wallBounds.y1; wy++) for (var wx = wallBounds.x0; wx <= wallBounds.x1; wx++) {
        if (state.walls[idx(wx, wy)]) appendHexPath(cx, cellCenter(wx, wy), hmWalls);
      }
      cx.fillStyle = 'rgba(180, 40, 40, 0.45)'; cx.fill();
    } else {
      cx.fillStyle = 'rgba(180, 40, 40, 0.45)';
      for (var y = wallBounds.y0; y <= wallBounds.y1; y++) for (var x = wallBounds.x0; x <= wallBounds.x1; x++) {
        if (state.walls[idx(x, y)]) cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5);
      }
    }
  }

  if (showWalls && !isHexMap()) {
    drawEdges();
  }

  if (showGrid) {
    cx.strokeStyle = 'rgba(255,255,255,0.50)';
    cx.lineWidth = 1 / zoom;
    if (isHexMap()) {
      var gridBounds = visibleCellBounds(W, H), hmGrid = hexMetrics();
      cx.beginPath();
      for (var hy = gridBounds.y0; hy <= gridBounds.y1; hy++) {
        for (var hx = gridBounds.x0; hx <= gridBounds.x1; hx++) appendHexPath(cx, cellCenter(hx, hy), hmGrid);
      }
      cx.strokeStyle = 'rgba(0,0,0,0.10)'; cx.lineWidth = 1 / zoom; cx.stroke(); // Flanaess: grid preto com 10% de opacidade
    } else {
      cx.beginPath();
      for (var gx = 0; gx <= COLS; gx++) { cx.moveTo(gx * CELL, 0); cx.lineTo(gx * CELL, ROWS * CELL); }
      for (var gy = 0; gy <= ROWS; gy++) { cx.moveTo(0, gy * CELL); cx.lineTo(COLS * CELL, gy * CELL); }
      cx.stroke();
    }
  }

  if (showFog && !isHexMap()) drawFogAndLight(W, H);

  if (selected && !isTokenVisible(selected)) selected = null;
  state.tokens.forEach(function (t) {
    if (isTokenVisible(t)) drawToken(t, t === selected);
  });
  drawLocalPortals();

  if (!isHexMap()) drawToolPreview();
  else {
    drawWorldTravelPath();
    drawWorldPortals();
  }

  if (measurePts && measurePts.length === 2) {
    var a = cellCenter(measurePts[0].x, measurePts[0].y);
    var b = cellCenter(measurePts[1].x, measurePts[1].y);
    cx.strokeStyle = '#ffeb3b';
    cx.lineWidth = 2 / zoom;
    cx.setLineDash(isHexMap() ? [] : [6 / zoom, 4 / zoom]);
    if (isHexMap()) {
      var routeCells = hexRoute(measurePts[0], measurePts[1]);
      if (routeCells) {
        cx.beginPath();
        routeCells.forEach(function (part, i) { var pt = cellCenter(part.x, part.y); if (!i) cx.moveTo(pt.x, pt.y); else cx.lineTo(pt.x, pt.y); });
        cx.stroke();
      } else { cx.strokeStyle = '#ef5350'; cx.setLineDash([6 / zoom, 4 / zoom]); cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke(); cx.setLineDash([]); }
    } else {
      cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
    }
    cx.setLineDash([]);
    var distanceLabel = formatMapDistance(measurePts[0], measurePts[1]);
    var mid;
    if (isHexMap() && routeCells && routeCells.length) mid = cellCenter(routeCells[Math.floor((routeCells.length - 1) / 2)].x, routeCells[Math.floor((routeCells.length - 1) / 2)].y);
    else mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    cx.fillStyle = 'rgba(0,0,0,0.75)';
    cx.font = (14 / zoom) + 'px sans-serif';
    cx.textAlign = 'center';
    cx.fillText(distanceLabel, mid.x, mid.y - 8 / zoom);
  }

  cx.restore();
  updateDetailPanel();
}

function drawEdges() {
  var lw = Math.max(2.5, 3.5 / zoom);
  function drawOne(edge, val) {
    if (val === EDGE_NONE || edgeIsHidden(edge, val)) return;
    var meta = getEdgeMeta(edge) || {};
    if (val === EDGE_SECRET_WALL && meta.open) return;
    var a, b;
    if (edge.dir === 'h') {
      a = { x: edge.x * CELL, y: edge.yEdge * CELL };
      b = { x: (edge.x + 1) * CELL, y: edge.yEdge * CELL };
    } else {
      a = { x: edge.xEdge * CELL, y: edge.y * CELL };
      b = { x: edge.xEdge * CELL, y: (edge.y + 1) * CELL };
    }
    var isDoor = isDoorEdge(val);
    var opened = val === EDGE_DOOR_O || val === EDGE_SECRET_DOOR_O || !!meta.open;
    var color = '#c62828', width = lw, dash = [];
    if (val === EDGE_SECRET_WALL) { color = '#ab47bc'; dash = [5 / zoom, 3 / zoom]; }
    else if (val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) color = opened ? 'rgba(142,36,170,0.38)' : '#8e24aa';
    else if (val === EDGE_LOCKED_DOOR) color = opened ? '#81c784' : '#42a5f5';
    else if (val === EDGE_JAMMED_DOOR) color = opened ? '#81c784' : '#ff8f00';
    else if (val === EDGE_ILLUSION_WALL) {
      if (meta.detected) { color = '#26c6da'; dash = [3 / zoom, 4 / zoom]; }
      else color = '#c62828'; // antes de ser percebida, parece uma parede comum.
    }
    else if (val === EDGE_FORCE_WALL) { color = '#80deea'; width = lw * 1.5; dash = [2 / zoom, 3 / zoom]; }
    else if (val === EDGE_MAGIC_WALL) { color = '#7e57c2'; width = lw * 1.5; }
    else if (val === EDGE_MURO) color = '#c62828';
    else if (isDoor) { color = opened ? 'rgba(141,110,99,0.45)' : '#8d6e63'; if (opened) dash = [6 / zoom, 4 / zoom]; }
    cx.save();
    cx.strokeStyle = color; cx.lineWidth = width;
    if ((val === EDGE_SECRET_DOOR_O || (isDoor && opened)) && !dash.length) dash = [6 / zoom, 4 / zoom];
    if (dash.length) cx.setLineDash(dash);
    cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
    cx.setLineDash([]);
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    if (isDoor) {
      cx.fillStyle = color; cx.beginPath(); cx.arc(mx, my, 4.5 / zoom, 0, Math.PI * 2); cx.fill();
      if (val === EDGE_LOCKED_DOOR && !opened) {
        cx.fillStyle = '#e3f2fd'; cx.font = 'bold ' + (10 / zoom) + 'px sans-serif'; cx.textAlign = 'center'; cx.fillText('🔒', mx, my - 7 / zoom);
      }
      if ((val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) && meta.detected) {
        cx.fillStyle = '#f3e5f5'; cx.font = 'bold ' + (9 / zoom) + 'px sans-serif'; cx.textAlign = 'center'; cx.fillText('✦', mx, my - 7 / zoom);
      }
    } else if (val === EDGE_SECRET_WALL || val === EDGE_FORCE_WALL || val === EDGE_MAGIC_WALL ||
        (val === EDGE_ILLUSION_WALL && meta.detected)) {
      cx.fillStyle = color; cx.beginPath(); cx.arc(mx, my, 3.5 / zoom, 0, Math.PI * 2); cx.fill();
    }
    cx.restore();
  }
  for (var ye = 0; ye <= ROWS; ye++) for (var x = 0; x < COLS; x++) drawOne({ dir: 'h', x: x, yEdge: ye }, getH(x, ye));
  for (var y = 0; y < ROWS; y++) for (var xe = 0; xe <= COLS; xe++) drawOne({ dir: 'v', xEdge: xe, y: y }, getV(xe, y));
  (state.customEdges || []).forEach(function(item){
    var val=item.val, meta=item.meta||{}; if(!val || edgeIsHidden({custom:item},val)) return;
    if(val===EDGE_SECRET_WALL && meta.open) return;
    var isDoor=isDoorEdge(val), opened=val===EDGE_DOOR_O || val===EDGE_SECRET_DOOR_O || !!meta.open;
    var color=val===EDGE_MURO?'#c62828':val===EDGE_SECRET_WALL?'#ab47bc':val===EDGE_SECRET_DOOR_C||val===EDGE_SECRET_DOOR_O?'#8e24aa':val===EDGE_LOCKED_DOOR?'#42a5f5':val===EDGE_JAMMED_DOOR?'#ff8f00':val===EDGE_ILLUSION_WALL?'#26c6da':val===EDGE_FORCE_WALL?'#80deea':val===EDGE_MAGIC_WALL?'#7e57c2':(opened?'rgba(141,110,99,0.45)':'#8d6e63');
    cx.save(); cx.strokeStyle=color; cx.lineWidth=Math.max(2.5,3.5/zoom);
    if(val===EDGE_SECRET_WALL || val===EDGE_FORCE_WALL || val===EDGE_ILLUSION_WALL || opened) cx.setLineDash([6/zoom,4/zoom]);
    cx.beginPath(); cx.moveTo(item.x1,item.y1); cx.lineTo(item.x2,item.y2); cx.stroke(); cx.setLineDash([]);
    if(isDoor){cx.fillStyle=color;cx.beginPath();cx.arc((item.x1+item.x2)/2,(item.y1+item.y2)/2,4.5/zoom,0,Math.PI*2);cx.fill();}
    cx.restore();
  });
}

function isCurrentlyVisible(x, y, px, py, r) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
  if (isHexMap()) return true;
  if (!dynLight) return !state.fog[idx(x, y)];
  if (px < 0) return false;
  var dist;
  if (isHexMap()) dist = hexDistance({ x: x, y: y }, { x: px, y: py });
  else { var dx = x - px, dy = y - py; dist = Math.sqrt(dx * dx + dy * dy); }
  if (dist > r + 0.01) return false;
  return hasLOS(px, py, x, y);
}

function isTokenVisible(t) {
  if (!t) return false;
  if (isHexMap() || t.tipo === 'player') return true;
  var player = currentPlayer();
  if (!player) return false;
  var sq = t.raio || 1;
  var radius = player.luz || lightRadius;
  if (isHexMap()) return isCurrentlyVisible(t.x, t.y, player.x, player.y, radius);
  for (var dy = 0; dy < sq; dy++) {
    for (var dx = 0; dx < sq; dx++) {
      if (!isCurrentlyVisible(t.x + dx, t.y + dy, player.x, player.y, radius)) return false;
    }
  }
  return true;
}

function currentPlayer() {
  return state.tokens.find(function (t) { return t.tipo === 'player'; }) || state.tokens[0] || null;
}

function setMapSpawn(cell, player) {
  if (!cell) return;
  var point = {
    x: Math.max(0, Math.min(COLS - 1, Math.round(cell.x))),
    y: Math.max(0, Math.min(ROWS - 1, Math.round(cell.y)))
  };
  state.spawn = point;
  MAPINFO.spawn = { x: point.x, y: point.y };
  if (MAPINFO.custom) persistCustomMaps();
  if (player) { player.x = point.x; player.y = point.y; }
  save();
}

function findWorldPortalAt(x, y) {
  if (!isHexMap() || !Array.isArray(state.portals)) return null;
  return state.portals.find(function (portal) { return !!portal.destMapId && portal.x === x && portal.y === y; }) || null;
}

function findLocalPortalAt(x, y) {
  if (!Array.isArray(state.portals)) return null;
  return state.portals.find(function (portal) {
    if (portal.destMapId || !isFinite(Number(portal.destX)) || !isFinite(Number(portal.destY))) return false;
    return (portal.x === x && portal.y === y) || (portal.destX === x && portal.destY === y);
  }) || null;
}

function localPortalDestination(portal, x, y) {
  if (!portal || portal.destMapId) return null;
  if (portal.x === x && portal.y === y) return { x: portal.destX, y: portal.destY };
  if (portal.destX === x && portal.destY === y) return { x: portal.x, y: portal.y };
  return null;
}

function portalCellIsOccupied(x, y) {
  return !!findWorldPortalAt(x, y) || !!findLocalPortalAt(x, y);
}

function teleportPlayerWithinMap(portal, player) {
  if (!portal || !player) return false;
  var destination = localPortalDestination(portal, player.x, player.y);
  if (!destination) return false;
  player.x = destination.x;
  player.y = destination.y;
  selected = player;
  if (!isHexMap()) {
    if (dynLight) revealAround(player.x, player.y, player.luz || lightRadius);
    checkPassiveSecretDetection(player);
  }
  save();
  draw();
  return true;
}

function closePortalDialog(overlay) {
  if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
}

function createPortalDialog(titleText, descriptionText) {
  var root = R && R.querySelector('#mp-root');
  if (!root) return null;
  var overlay = document.createElement('div');
  overlay.className = 'mp-portal-dialog-overlay';
  var panel = document.createElement('div');
  panel.className = 'mp-portal-dialog';
  var title = document.createElement('h3');
  title.textContent = titleText;
  var description = document.createElement('p');
  description.textContent = descriptionText;
  panel.appendChild(title);
  panel.appendChild(description);
  overlay.appendChild(panel);
  root.appendChild(overlay);
  return { overlay: overlay, panel: panel };
}

function showPortalColorPicker(initialColor, onApply, onCancel) {
  var dialog = createPortalDialog('Cor do teleporte', 'Escolha a cor que vai marcar os dois pontos ligados.');
  if (!dialog) return;
  var colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = /^#[0-9a-f]{6}$/i.test(String(initialColor || '')) ? initialColor : '#36a9e1';
  colorInput.className = 'mp-portal-color-input';
  colorInput.setAttribute('aria-label', 'Escolher cor do hexágono do teleporte');
  dialog.panel.appendChild(colorInput);

  var actions = document.createElement('div');
  actions.className = 'mp-portal-dialog-actions';
  var cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.textContent = 'Cancelar';
  cancel.onclick = function () {
    closePortalDialog(dialog.overlay);
    if (typeof onCancel === 'function') onCancel();
  };
  var apply = document.createElement('button');
  apply.type = 'button';
  apply.className = 'primary';
  apply.textContent = 'Confirmar cor';
  apply.onclick = function () {
    var chosenColor = colorInput.value;
    closePortalDialog(dialog.overlay);
    if (typeof onApply === 'function') onApply(chosenColor);
  };
  actions.appendChild(cancel);
  actions.appendChild(apply);
  dialog.panel.appendChild(actions);
  colorInput.click();
}

function showExistingPortalActions(portal) {
  var destinationName = (MAPS[portal.destMapId] && MAPS[portal.destMapId].nome) || portal.destMapId;
  var dialog = createPortalDialog('Teleporte existente', 'Destino: ' + destinationName + '. Você pode mudar a cor deste hexágono ou remover o teleporte.');
  if (!dialog) return;
  var actions = document.createElement('div');
  actions.className = 'mp-portal-dialog-actions mp-portal-dialog-actions-stack';

  var recolor = document.createElement('button');
  recolor.type = 'button';
  recolor.className = 'primary';
  recolor.textContent = '🎨 Mudar cor';
  recolor.onclick = function () {
    closePortalDialog(dialog.overlay);
    showPortalColorPicker(portal.color || '#36a9e1', function (color) {
      portal.color = color;
      save(); draw();
    });
  };

  var remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'danger';
  remove.textContent = '🗑 Remover teleporte';
  remove.onclick = function () {
    closePortalDialog(dialog.overlay);
    if (appConfirmMessage('msg067', 'Remover o teleporte deste hexágono?')) {
      state.portals = state.portals.filter(function (item) { return item !== portal; });
      save(); draw();
    }
  };

  var cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.textContent = 'Cancelar';
  cancel.onclick = function () { closePortalDialog(dialog.overlay); };

  actions.appendChild(recolor);
  actions.appendChild(remove);
  actions.appendChild(cancel);
  dialog.panel.appendChild(actions);
}

function showExistingLocalPortalActions(portal) {
  var dialog = createPortalDialog('Teleporte interno', 'Este par liga os pontos A e B do mapa atual. Você pode mudar a cor ou remover os dois lados.');
  if (!dialog) return;
  var actions = document.createElement('div');
  actions.className = 'mp-portal-dialog-actions mp-portal-dialog-actions-stack';

  var recolor = document.createElement('button');
  recolor.type = 'button';
  recolor.className = 'primary';
  recolor.textContent = '🎨 Mudar cor';
  recolor.onclick = function () {
    closePortalDialog(dialog.overlay);
    showPortalColorPicker(portal.color || '#36a9e1', function (color) {
      portal.color = color;
      save(); draw();
    });
  };

  var remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'danger';
  remove.textContent = '🗑 Remover os dois pontos';
  remove.onclick = function () {
    closePortalDialog(dialog.overlay);
    if (appConfirmMessage('msg068', 'Remover este par de teleporte? Os pontos A e B serão apagados.')) {
      state.portals = state.portals.filter(function (item) { return item !== portal; });
      save(); draw();
    }
  };

  var cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.textContent = 'Cancelar';
  cancel.onclick = function () { closePortalDialog(dialog.overlay); };

  actions.appendChild(recolor);
  actions.appendChild(remove);
  actions.appendChild(cancel);
  dialog.panel.appendChild(actions);
}

function placeLocalPortal(cell) {
  if (!cell) return;
  if (!Array.isArray(state.portals)) state.portals = [];

  var existingLocal = findLocalPortalAt(cell.x, cell.y);
  if (existingLocal) {
    if (pendingLocalPortal) { appAlertMessage('msg069', 'Este local já faz parte de outro teleporte. Escolha um ponto B diferente.'); return; }
    showExistingLocalPortalActions(existingLocal);
    return;
  }
  var existingWorld = findWorldPortalAt(cell.x, cell.y);
  if (existingWorld) {
    if (pendingLocalPortal) { appAlertMessage('msg070', 'Este local já possui um teleporte para outro mapa. Escolha outro ponto.'); return; }
    showExistingPortalActions(existingWorld);
    return;
  }
  var placementPlayer = currentPlayer();
  if (blockMove && !canOccupy(cell.x, cell.y, placementPlayer)) {
    appAlertMessage('msg071', 'Não é possível criar um teleporte em uma célula bloqueada. Escolha um espaço livre.');
    return;
  }

  if (!pendingLocalPortal) {
    pendingLocalPortal = { x: cell.x, y: cell.y };
    draw();
    appAlertMessage('msg072', 'Ponto A definido. Agora clique no local do ponto B para concluir o teleporte. Pressione Esc para cancelar.');
    return;
  }

  if (pendingLocalPortal.x === cell.x && pendingLocalPortal.y === cell.y) {
    appAlertMessage('msg073', 'Escolha um ponto B diferente do ponto A.');
    return;
  }
  if (portalCellIsOccupied(cell.x, cell.y)) {
    appAlertMessage('msg074', 'Este local já possui um teleporte. Escolha outro ponto para B.');
    return;
  }

  var pointA = pendingLocalPortal;
  showPortalColorPicker('#36a9e1', function (color) {
    state.portals.push({
      id: 'local-portal-' + Date.now().toString(36),
      type: 'local',
      x: pointA.x,
      y: pointA.y,
      destX: cell.x,
      destY: cell.y,
      color: color
    });
    pendingLocalPortal = null;
    setTool('select');
    save(); draw();
  }, function () {
    pendingLocalPortal = null;
    setTool('select');
    draw();
  });
}

function placeWorldPortal(cell) {
  if (!isHexMap() || !cell) return;
  if (!Array.isArray(state.portals)) state.portals = [];
  var existingLocal = findLocalPortalAt(cell.x, cell.y);
  if (existingLocal) { showExistingLocalPortalActions(existingLocal); return; }
  var existing = findWorldPortalAt(cell.x, cell.y);
  if (existing) {
    showExistingPortalActions(existing);
    return;
  }
  var options = Object.keys(MAPS).filter(function (id) { return id !== mapId; });
  if (!options.length) { appAlertMessage('msg075', 'Adicione outro mapa primeiro usando o botão + do seletor.'); return; }
  var menu = options.map(function (id, index) { return (index + 1) + '. ' + MAPS[id].nome; }).join('\n');
  var answer = appPromptMessage('msg076', 'Escolha o mapa de destino digitando o número:\n\n' + menu, '1');
  if (answer == null || !String(answer).trim()) return;
  var destination = options[Number(answer) - 1];
  if (!destination) {
    destination = options.find(function (id) {
      return id.toLowerCase() === String(answer).trim().toLowerCase() || MAPS[id].nome.toLowerCase() === String(answer).trim().toLowerCase();
    });
  }
  if (!destination) { appAlertMessage('msg077', 'Destino inválido. Nenhum teleporte foi criado.'); return; }
  showPortalColorPicker('#36a9e1', function (color) {
    state.portals.push({
      id: 'portal-' + Date.now().toString(36),
      x: cell.x,
      y: cell.y,
      destMapId: destination,
      color: color
    });
    save(); draw();
  });
}

function teleportThroughWorldPortal(portal) {
  if (!portal || !MAPS[portal.destMapId]) {
    appAlertMessage('msg078', 'O mapa de destino deste teleporte não está disponível. Atualize o catálogo mapas/mapas.json.');
    draw();
    return;
  }
  var destinationId = portal.destMapId;
  var host = R;
  save();
  stopWorldTravel(false);
  tool = 'select';
  preferredMapId = destinationId;
  try { localStorage.setItem(MAP_ID_KEY, destinationId); } catch (e) {}
  unmount();
  applyMap(destinationId);
  state = migrateFlanaessState(load() || defaultState());
  loadRepositoryMapState(function () {
    if (!host || !MAPS[destinationId] || mapId !== destinationId) return;
    var spawn = state.spawn || MAPINFO.spawn || { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) };
    spawn = {
      x: Math.max(0, Math.min(COLS - 1, Math.round(Number(spawn.x) || 0))),
      y: Math.max(0, Math.min(ROWS - 1, Math.round(Number(spawn.y) || 0)))
    };
    state.spawn = { x: spawn.x, y: spawn.y };
    MAPINFO.spawn = { x: spawn.x, y: spawn.y };
    var player = currentPlayer();
    if (!player) {
      player = { id: 'p1', nome: 'Aventureiro', tipo: 'player', x: spawn.x, y: spawn.y, cor: '#4fc3f7', raio: 1, luz: 6, hp: null, hpMax: null };
      state.tokens.unshift(player);
    } else {
      player.x = spawn.x; player.y = spawn.y;
      if (!player.tipo) player.tipo = 'player';
    }
    selected = player;
    save();
    mountNow(host);
  });
}

function previewCell() {
  if (!previewPointer) return null;
  return worldToCell(previewPointer.x, previewPointer.y);
}

function previewHoveredToken(cell) {
  if (!cell) return null;
  for (var i = state.tokens.length - 1; i >= 0; i--) {
    var t = state.tokens[i], sq = t.raio || 1;
    if (!isTokenVisible(t)) continue;
    if (cell.x >= t.x && cell.x < t.x + sq && cell.y >= t.y && cell.y < t.y + sq) return t;
  }
  return null;
}

function previewEdge() {
  if (!previewPointer) return null;
  return nearestEdge(previewPointer.x, previewPointer.y);
}

function previewDoorEdge() {
  if (isHexMap() || !previewPointer) return null;
  var gx = previewPointer.x / CELL, gy = previewPointer.y / CELL;
  var fx = Math.abs(gx - Math.round(gx)), fy = Math.abs(gy - Math.round(gy));
  if (Math.min(fx, fy) >= 0.12) return null;
  var edge = previewEdge(), value = edge ? getEdgeVal(edge) : EDGE_NONE;
  return isDoorEdge(value) ? edge : null;
}

function drawPreviewCell(cell, fill, stroke) {
  if (!cell) return;
  cx.save();
  cx.setLineDash([5 / zoom, 3 / zoom]);
  if (isHexMap()) hexPath(cx, cellCenter(cell.x, cell.y), fill, stroke, 2 / zoom);
  else {
    cx.fillStyle = fill;
    cx.fillRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2);
    cx.strokeStyle = stroke;
    cx.lineWidth = 2 / zoom;
    cx.strokeRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2);
  }
  cx.setLineDash([]);
  cx.restore();
}

function drawEdgePreview(edge, color, door) {
  if (!edge) return;
  var run = door && isDoorEdge(getEdgeVal(edge)) ? getDoorRun(edge) : [edge];
  var first = run[0], last = run[run.length - 1];
  cx.save();
  cx.strokeStyle = color;
  cx.fillStyle = color;
  cx.lineWidth = Math.max(4, 5 / zoom);
  cx.setLineDash([7 / zoom, 4 / zoom]);
  if (edge.dir === 'h') {
    var x0 = first.x * CELL, y0 = first.yEdge * CELL;
    var x1 = (last.x + 1) * CELL;
    cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y0); cx.stroke();
    if (door) { cx.setLineDash([]); cx.beginPath(); cx.arc((x0 + x1) / 2, y0, 5 / zoom, 0, Math.PI * 2); cx.fill(); }
  } else {
    var xx = first.xEdge * CELL, yy0 = first.y * CELL;
    var yy1 = (last.y + 1) * CELL;
    cx.beginPath(); cx.moveTo(xx, yy0); cx.lineTo(xx, yy1); cx.stroke();
    if (door) { cx.setLineDash([]); cx.beginPath(); cx.arc(xx, (yy0 + yy1) / 2, 5 / zoom, 0, Math.PI * 2); cx.fill(); }
  }
  cx.restore();
}

function drawToolPreview() {
  if (!previewPointer || !cv) return;
  var cell = previewCell();
  var edge = previewEdge();
  var center = cellCenter(cell.x, cell.y);
  var ghost;

  // Na ferramenta Apagar linha, destaca a linha inteira sob o cursor.
  // O mesmo helper é usado no clique, então a prévia nunca aponta para outra linha.
  if (tool === 'eraseedge') {
    var erasePreviewEdge = findEraseEdgeAt(previewPointer.x, previewPointer.y);
    if (erasePreviewEdge) {
      if (erasePreviewEdge.custom) {
        var eraseItem = erasePreviewEdge.custom;
        cx.save();
        cx.strokeStyle = '#ff1744';
        cx.fillStyle = '#ff1744';
        cx.lineWidth = Math.max(7, 9 / zoom);
        cx.setLineDash([8 / zoom, 4 / zoom]);
        cx.shadowColor = 'rgba(255, 23, 68, 0.95)';
        cx.shadowBlur = 10 / zoom;
        cx.beginPath();
        cx.moveTo(eraseItem.x1, eraseItem.y1);
        cx.lineTo(eraseItem.x2, eraseItem.y2);
        cx.stroke();
        cx.setLineDash([]);
        var eraseMidX = (eraseItem.x1 + eraseItem.x2) / 2;
        var eraseMidY = (eraseItem.y1 + eraseItem.y2) / 2;
        cx.beginPath();
        cx.arc(eraseMidX, eraseMidY, 5 / zoom, 0, Math.PI * 2);
        cx.fill();
        cx.restore();
      } else {
        drawEdgePreview(erasePreviewEdge, '#ff1744', false);
      }
    }
    return;
  }

  var lineTools=['muro','porta','paredeSecreta','portaSecreta','portaTrancada','portaEmperrada','paredeIlusoria','muralhaForca','paredeMagica'];
  if (lineTools.indexOf(tool)>=0) {
    var target=snapGridPoint(previewPointer.x,previewPointer.y);
    var start=pendingStructureStart || target;
    var lineColor=tool==='porta'||tool.indexOf('porta')===0?'#ffb74d':tool==='paredeSecreta'?'#ab47bc':tool==='paredeIlusoria'?'#26c6da':tool==='muralhaForca'?'#80deea':tool==='paredeMagica'?'#7e57c2':tool==='eraseedge'?'#80deea':'#ff5252';
    cx.save(); cx.strokeStyle=lineColor; cx.fillStyle=lineColor; cx.lineWidth=Math.max(4,5/zoom); cx.setLineDash([7/zoom,4/zoom]);
    cx.beginPath(); cx.moveTo(start.x,start.y); cx.lineTo(target.x,target.y); cx.stroke(); cx.setLineDash([]);
    cx.beginPath(); cx.arc(start.x,start.y,5/zoom,0,Math.PI*2); cx.fill(); cx.beginPath(); cx.arc(target.x,target.y,5/zoom,0,Math.PI*2); cx.fill(); cx.restore();
    return;
  }

  if (tool === 'wall') drawPreviewCell(cell, 'rgba(229,57,53,0.38)', '#ff5252');
  else if (tool === 'erasewall') drawPreviewCell(cell, 'rgba(102,187,106,0.28)', '#81c784');
  else if (tool === 'reveal' || tool === 'hide') {
    cx.save();
    cx.fillStyle = tool === 'reveal' ? 'rgba(255,235,59,0.22)' : 'rgba(0,0,0,0.5)';
    cx.strokeStyle = tool === 'reveal' ? '#fff176' : '#b0bec5';
    cx.lineWidth = 2 / zoom;
    cx.setLineDash([5 / zoom, 3 / zoom]);
    if (isHexMap()) {
      for (var fy = cell.y - 1; fy <= cell.y + 1; fy++) for (var fx = cell.x - 1; fx <= cell.x + 1; fx++) {
        var fc = { x: fx, y: fy };
        if (fx >= 0 && fy >= 0 && fx < COLS && fy < ROWS && hexDistance(cell, fc) <= 1) hexPath(cx, cellCenter(fx, fy), cx.fillStyle, cx.strokeStyle, cx.lineWidth);
      }
    } else {
      cx.fillRect((cell.x - 1) * CELL, (cell.y - 1) * CELL, CELL * 3, CELL * 3);
      cx.strokeRect((cell.x - 1) * CELL, (cell.y - 1) * CELL, CELL * 3, CELL * 3);
    }
    cx.restore();
  } else if (tool === 'spawn') {
    var player = currentPlayer();
    var radius = (player && player.luz) || lightRadius;
    cx.save();
    cx.fillStyle = 'rgba(255,213,79,0.08)';
    cx.strokeStyle = 'rgba(255,213,79,0.9)';
    cx.lineWidth = 2 / zoom;
    cx.setLineDash([8 / zoom, 5 / zoom]);
    cx.beginPath(); cx.arc(center.x, center.y, radius * CELL, 0, Math.PI * 2); cx.fill(); cx.stroke();
    cx.restore();
    ghost = { nome: 'J', tipo: 'player', x: cell.x, y: cell.y, cor: '#4fc3f7', raio: 1 };
    cx.save(); cx.globalAlpha = 0.55; drawToken(ghost, false); cx.restore();
  } else if (tool === 'token') {
    var m = pendingMonster;
    ghost = m ? {
      nome: m.nome, tipo: 'npc', x: cell.x, y: cell.y,
      cor: colorForMonster(m), raio: sizeSquares(m), hp: m.pontosVida,
      hpMax: m.pontosVida
    } : { nome: '?', tipo: 'npc', x: cell.x, y: cell.y, cor: '#e57373', raio: 1 };
    cx.save(); cx.globalAlpha = 0.48; drawToken(ghost, false); cx.restore();
  } else if (tool === 'measure') {
    if (measurePts && measurePts.length === 1) {
      var start = cellCenter(measurePts[0].x, measurePts[0].y);
      var distanceLabel = formatMapDistance(measurePts[0], cell);
      cx.save();
      cx.strokeStyle = '#ffeb3b'; cx.lineWidth = 2 / zoom;
      cx.setLineDash(isHexMap() ? [] : [6 / zoom, 4 / zoom]);
      var liveRoute = null;
      if (isHexMap()) {
        liveRoute = hexRoute(measurePts[0], cell);
        if (liveRoute) {
          cx.beginPath();
          liveRoute.forEach(function (part, i) { var pt = cellCenter(part.x, part.y); if (!i) cx.moveTo(pt.x, pt.y); else cx.lineTo(pt.x, pt.y); });
          cx.stroke();
        } else { cx.strokeStyle = '#ef5350'; cx.setLineDash([6 / zoom, 4 / zoom]); cx.beginPath(); cx.moveTo(start.x, start.y); cx.lineTo(center.x, center.y); cx.stroke(); }
      } else { cx.beginPath(); cx.moveTo(start.x, start.y); cx.lineTo(center.x, center.y); cx.stroke(); }
      cx.setLineDash([]);
      cx.fillStyle = 'rgba(0,0,0,0.8)';
      cx.font = (14 / zoom) + 'px sans-serif'; cx.textAlign = 'center';
      var liveMid = isHexMap() && liveRoute && liveRoute.length ? cellCenter(liveRoute[Math.floor((liveRoute.length - 1) / 2)].x, liveRoute[Math.floor((liveRoute.length - 1) / 2)].y) : { x: (start.x + center.x) / 2, y: (start.y + center.y) / 2 };
      cx.fillText(distanceLabel, liveMid.x, liveMid.y - 8 / zoom);
      cx.restore();
    } else drawPreviewCell(cell, 'rgba(255,235,59,0.14)', '#ffeb3b');
  } else if (tool === 'select') {
    var doorEdge = previewDoorEdge();
    var hovered = previewHoveredToken(cell);
    if (doorEdge) drawEdgePreview(doorEdge, '#ffb74d', true);
    else if (hovered) {
      var sq = hovered.raio || 1;
      cx.save(); cx.strokeStyle = '#ffeb3b'; cx.lineWidth = 3 / zoom;
      cx.setLineDash([5 / zoom, 3 / zoom]);
      if (isHexMap()) hexPath(cx, cellCenter(hovered.x, hovered.y), null, '#ffeb3b', 3 / zoom);
      else cx.strokeRect(hovered.x * CELL + 2, hovered.y * CELL + 2, sq * CELL - 4, sq * CELL - 4);
      cx.restore();
    } else drawPreviewCell(cell, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.65)');
  }

}

function drawFogAndLight(viewW, viewH) {
  var player = state.tokens.find(function (t) { return t.tipo === 'player'; }) || state.tokens[0];
  var px = player ? player.x : -1;
  var py = player ? player.y : -1;
  var r = player ? (player.luz || lightRadius) : 0;

  var fogBounds = visibleCellBounds(viewW, viewH);
  if (isHexMap()) {
    var hmFog = hexMetrics();
    cx.beginPath();
    for (var fy = fogBounds.y0; fy <= fogBounds.y1; fy++) for (var fx = fogBounds.x0; fx <= fogBounds.x1; fx++) {
      if (state.fog[idx(fx, fy)] && !isCurrentlyVisible(fx, fy, px, py, r)) appendHexPath(cx, cellCenter(fx, fy), hmFog);
    }
    cx.fillStyle = 'rgba(0,0,0,1)'; cx.fill();
    if (dynLight) {
      cx.beginPath();
      for (var dy = fogBounds.y0; dy <= fogBounds.y1; dy++) for (var dx = fogBounds.x0; dx <= fogBounds.x1; dx++) {
        if (!state.fog[idx(dx, dy)] && !isCurrentlyVisible(dx, dy, px, py, r)) appendHexPath(cx, cellCenter(dx, dy), hmFog);
      }
      cx.fillStyle = 'rgba(0,0,0,0.5)'; cx.fill();
    }
  } else {
    for (var y = fogBounds.y0; y <= fogBounds.y1; y++) for (var x = fogBounds.x0; x <= fogBounds.x1; x++) {
      if (isCurrentlyVisible(x, y, px, py, r)) continue;
      if (state.fog[idx(x, y)]) { cx.fillStyle = 'rgba(0,0,0,1)'; cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5); }
      else if (dynLight) { cx.fillStyle = 'rgba(0,0,0,0.5)'; cx.fillRect(x * CELL, y * CELL, CELL + 0.5, CELL + 0.5); }
    }
  }

  if (dynLight && player) {
    var c = (!isHexMap() && keyMoveVis && player === currentPlayer()) ? keyMoveVis : cellCenter(px, py);
    var rPx = r * CELL;
    var grd = cx.createRadialGradient(c.x, c.y, rPx * 0.12, c.x, c.y, rPx);
    grd.addColorStop(0, 'rgba(255,220,140,0.16)');
    grd.addColorStop(0.65, 'rgba(255,180,80,0.05)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = grd;
    cx.beginPath();
    cx.arc(c.x, c.y, rPx, 0, Math.PI * 2);
    cx.fill();
  }
}

function drawToken(t, sel) {
  var sq = t.raio || 1;
  var c = isHexMap()
    ? ((worldTravelPos && t === currentPlayer()) ? worldTravelPos : cellCenter(t.x, t.y))
    : ((keyMoveVis && t === currentPlayer()) ? keyMoveVis : cellCenter(t.x + (sq - 1) / 2, t.y + (sq - 1) / 2));
  var r = isHexMap() ? CELL * 0.31 * Math.max(1, Math.sqrt(sq)) : sq * CELL * 0.42;
  cx.beginPath();
  cx.arc(c.x, c.y, r, 0, Math.PI * 2);
  cx.fillStyle = t.cor || '#e57373';
  cx.fill();
  if (sel) {
    cx.strokeStyle = '#fff';
    cx.lineWidth = 3 / zoom;
    cx.stroke();
  } else {
    cx.strokeStyle = 'rgba(0,0,0,0.55)';
    cx.lineWidth = 1.5 / zoom;
    cx.stroke();
  }
  cx.fillStyle = '#111';
  cx.font = 'bold ' + Math.max(10, (11 + sq * 2) / zoom) + 'px sans-serif';
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.fillText((t.nome || '?').charAt(0).toUpperCase(), c.x, c.y + 1);

  if (t.hpMax != null && t.hp != null && t.hpMax > 0) {
    var pct = Math.max(0, Math.min(1, t.hp / t.hpMax));
    var bw = sq * CELL * 0.7, bh = 4 / zoom;
    var bx = c.x - bw / 2, by = c.y + r + 3 / zoom;
    cx.fillStyle = 'rgba(0,0,0,0.6)';
    cx.fillRect(bx, by, bw, bh);
    cx.fillStyle = pct > 0.5 ? '#66bb6a' : pct > 0.25 ? '#ffb74d' : '#ef5350';
    cx.fillRect(bx, by, bw * pct, bh);
  }
}

function updateDetailPanel() {
  var box = $('#mp-detail');
  if (!box) return;
  var t = selected;
  if (!t) {
    box.innerHTML = '<div class="mp-detail-empty">Selecione um token no mapa.</div>';
    return;
  }
  var hpHtml = '';
  if (t.hpMax != null) {
    hpHtml = '<div class="mp-hp-row">' +
      '<label>PV <input type="number" id="mp-hp" value="' + (t.hp != null ? t.hp : t.hpMax) + '" min="0" style="width:56px">' +
      ' / ' + t.hpMax + '</label>' +
      '<button type="button" id="mp-hp-full">Máx</button></div>';
  }
  var extra = '';
  var passiveHtml = t.tipo === 'player'
    ? '<div class="mp-hp-row"><span>Percepção passiva: <b>' + (t.percepcaoPassiva != null ? Number(t.percepcaoPassiva) : 10) + '</b></span> <button type="button" id="mp-passive-perception">Editar</button></div>'
    : '';
  if (t.monsterId && window.MONSTERS) {
    var m = (window.MONSTERS || []).find(function (x) { return x.id === t.monsterId; });
    if (m) {
      extra = '<div class="mp-stat-grid">' +
        '<span>CA <b>' + esc(m.classeArmadura) + '</b></span>' +
        '<span>PV <b>' + esc(m.pontosVida) + '</b></span>' +
        '<span>ND <b>' + esc(m.nd) + '</b></span>' +
        '<span>' + esc(m.tamanho) + ' · ' + esc(m.tipo) + '</span></div>';
      if (m.acoes && m.acoes.length) {
        extra += '<div class="mp-actions"><b>Ações</b><ul>' +
          m.acoes.slice(0, 4).map(function (a) {
            var desc = a.description || a.descricao || '';
            return '<li><b>' + esc(a.name || a.nome) + '</b>' +
              (desc ? ': ' + esc(String(desc).slice(0, 110)) + (String(desc).length > 110 ? '…' : '') : '') +
              '</li>';
          }).join('') + '</ul></div>';
      }
    }
  }
  box.innerHTML =
    '<div class="mp-detail-head"><strong>' + esc(t.nome) + '</strong>' +
    (t.nd != null ? '<span class="card-tag">ND ' + esc(t.nd) + '</span>' : '') + '</div>' +
    hpHtml + passiveHtml + extra +
    '<div class="mp-detail-tools">' +
    (t.tipo !== 'player' ? '<button type="button" id="mp-del-tok">Remover token</button>' : '') +
    '</div>';

  var hpIn = $('#mp-hp');
  if (hpIn) hpIn.onchange = function () { t.hp = +this.value; save(); draw(); };
  var passiveButton = $('#mp-passive-perception');
  if (passiveButton) passiveButton.onclick = function () {
    var value = numberPrompt('Valor de Sabedoria (Percepção) passiva do personagem:', t.percepcaoPassiva != null ? t.percepcaoPassiva : 10, 0, 40);
    if (value == null) return;
    t.percepcaoPassiva = value; save(); draw();
  };
  var hpFull = $('#mp-hp-full');
  if (hpFull) hpFull.onclick = function () { t.hp = t.hpMax; save(); draw(); };
  var del = $('#mp-del-tok');
  if (del) del.onclick = function () {
    state.tokens = state.tokens.filter(function (x) { return x !== t; });
    selected = null; save(); draw();
  };
}

function renderMonsterList(query) {
  var list = $('#mp-ml');
  if (!list) return;
  var q = (query || '').trim().toLowerCase();
  var monsters = window.MONSTERS || [];
  var filtered = monsters.filter(function (m) {
    if (!q) return true;
    return [m.nome, m.nomeEn, m.tipo, m.nd, m.id].join(' ').toLowerCase().indexOf(q) >= 0;
  }).slice(0, 50);
  if (!monsters.length) { list.innerHTML = '<small>Carregando bestiário…</small>'; return; }
  if (!filtered.length) { list.innerHTML = '<small>Nenhum monstro encontrado.</small>'; return; }
  list.innerHTML = filtered.map(function (m) {
    return '<button type="button" class="mp-mbtn" data-id="' + esc(m.id) + '">' +
      '<span class="mp-mn">' + esc(m.nome) + '</span>' +
      '<small>ND ' + esc(m.nd) + ' · ' + esc(m.tamanho) + '</small></button>';
  }).join('');
}

function placeMonsterFromId(id, cell) {
  var m = (window.MONSTERS || []).find(function (x) { return x.id === id; });
  if (!m) return;
  if (blockMove && isCellWall(cell.x, cell.y)) return;
  var sq = sizeSquares(m);
  var tok = {
    id: 't' + Date.now().toString(36),
    monsterId: m.id, nome: m.nome, tipo: 'npc',
    x: cell.x, y: cell.y, cor: colorForMonster(m), raio: sq, luz: 0,
    nd: m.nd, hp: m.pontosVida, hpMax: m.pontosVida
  };
  state.tokens.push(tok);
  selected = tok;
  pendingMonster = null;
  setTool('select');
  save();
  draw();
}

function canOccupy(x, y, token) {
  // Os limites do mapa sempre bloqueiam a passagem; desativar colisões
  // permite atravessar paredes, mas não sair da área física do mapa.
  var sq = (token && token.raio) || 1;
  if (x < 0 || y < 0 || x + sq > COLS || y + sq > ROWS) return false;
  if (!blockMove) return true;
  for (var dy = 0; dy < sq; dy++) {
    for (var dx = 0; dx < sq; dx++) {
      if (isCellWall(x + dx, y + dy)) return false;
    }
  }
  return true;
}

function edgesBetweenStep(x0, y0, x1, y1) {
  var found = [];
  if (x0 !== x1 && y0 !== y1) {
    found.push({ dir: 'v', xEdge: Math.max(x0, x1), y: y0 });
    found.push({ dir: 'h', x: x0, yEdge: Math.max(y0, y1) });
  } else if (x0 !== x1) found.push({ dir: 'v', xEdge: Math.max(x0, x1), y: y0 });
  else if (y0 !== y1) found.push({ dir: 'h', x: x0, yEdge: Math.max(y0, y1) });
  return found;
}
function canStep(fromX, fromY, toX, toY, token, detectTouch) {
  if (!canOccupy(toX, toY, token)) return false;
  if (isHexMap()) return !!hexRoute({ x: fromX, y: fromY }, { x: toX, y: toY });
  if (Math.abs(toX - fromX) <= 1 && Math.abs(toY - fromY) <= 1) {
    var crossedEdges = edgesBetweenStep(fromX, fromY, toX, toY);
    // A detecção por toque só ocorre no passo que o jogador realmente tenta dar,
    // nunca durante a busca automática de rotas do algoritmo A*.
    if (detectTouch && token && token.tipo === 'player') {
      crossedEdges.forEach(function (edge) {
        var val = getEdgeVal(edge), meta = getEdgeMeta(edge);
        if (val === EDGE_ILLUSION_WALL && meta && !meta.detected) {
          meta.detected = true;
          window.setTimeout(function () { if (cv) { save(); draw(); appAlertMessage('msg079', 'Ao tocar a parede, você percebe que ela é uma ilusão e pode atravessá-la.'); } }, 0);
        }
        if (val === EDGE_FORCE_WALL && meta && !meta.detected) {
          meta.detected = true;
          window.setTimeout(function () { if (cv) { save(); draw(); appAlertMessage('msg080', 'Você toca uma barreira invisível: Muralha de Energia.'); } }, 0);
        }
      });
    }
    // A Muralha de Energia é uma barreira absoluta mesmo quando o Mestre desativa
    // a colisão geral para reposicionar tokens ou facilitar a edição do mapa.
    if (crossedEdges.some(function (edge) { return getEdgeVal(edge) === EDGE_FORCE_WALL; })) return false;
    if (!blockMove) return true;
    if (blocksBetween(fromX, fromY, toX, toY)) return false;
    return true;
  }
  return !blockMove;
}

function applyWallBrush(cx, cy, val, radius) {
  var r = radius == null ? 0 : radius;
  if (!state.wallMeta) state.wallMeta = makeArr(COLS * ROWS, null);
  for (var dy = -r; dy <= r; dy++) {
    for (var dx = -r; dx <= r; dx++) {
      var x = cx + dx, y = cy + dy;
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
      var i = idx(x, y);
      state.walls[i] = val;
      if (val) { if (!state.wallMeta[i]) state.wallMeta[i] = makeStructureMeta('pedra', 'wall', 2); }
      else state.wallMeta[i] = null;
    }
  }
}

function applyFogBrush(cx, cy, val) {
  for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
      var x = cx + dx, y = cy + dy;
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
      if (isHexMap() && hexDistance({ x: cx, y: cy }, { x: x, y: y }) > 1) continue;
      state.fog[idx(x, y)] = val;
    }
  }
}

function revealAround(cx, cy, radius) {
  var r = Math.ceil(radius);
  for (var dy = -r; dy <= r; dy++) {
    for (var dx = -r; dx <= r; dx++) {
      if (isHexMap() ? (hexDistance({ x: cx, y: cy }, { x: cx + dx, y: cy + dy }) > radius) : (dx * dx + dy * dy > radius * radius + 0.5)) continue;
      var x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
      if (hasLOS(cx, cy, x, y)) state.fog[idx(x, y)] = 0;
    }
  }
}

function onPointerDown(e) {
  // No Editor, a câmera pode ser arrastada em qualquer tipo de mapa.
  if (appMode === 'editor' && (tool === 'pan' || e.button === 1 || e.button === 2 || space)) {
    e.preventDefault();
    if (cv.setPointerCapture) cv.setPointerCapture(e.pointerId);
    drag = { pan: true, startX: e.clientX, startY: e.clientY, originX: ox, originY: oy };
    cv.style.cursor = 'grabbing';
    return;
  }
  if (appMode !== 'editor') tool = 'select';
  if (isHexMap()) {
    e.preventDefault();
    var worldRect = cv.getBoundingClientRect();
    var worldPoint = screenToWorld(e.clientX - worldRect.left, e.clientY - worldRect.top);
    if (worldPoint.x < 0 || worldPoint.y < 0 || worldPoint.x > MAP_W || worldPoint.y > MAP_H) return;
    var worldCell = worldToCell(worldPoint.x, worldPoint.y);
    if (tool === 'portal') { placeWorldPortal(worldCell); return; }
    if (tool === 'localPortal') { placeLocalPortal(worldCell); return; }
    if (tool === 'spawn') {
      stopWorldTravel(false);
      var worldPlayer = currentPlayer();
      if (!worldPlayer) {
        worldPlayer = { id: 'p1', nome: 'Aventureiro', tipo: 'player', x: worldCell.x, y: worldCell.y, cor: '#4fc3f7', raio: 1, luz: 6, percepcaoPassiva: 10, hp: null, hpMax: null };
        state.tokens.unshift(worldPlayer);
      }
      setMapSpawn(worldCell, worldPlayer);
      selected = worldPlayer;
      draw();
      return;
    }
    if (tool === 'select') startWorldTravel(worldCell);
    return;
  }
  cv.setPointerCapture(e.pointerId);
  var previewRect = cv.getBoundingClientRect();
  previewPointer = screenToWorld(e.clientX - previewRect.left, e.clientY - previewRect.top);
  var rect = cv.getBoundingClientRect();
  var world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
  var cell = worldToCell(world.x, world.y);

  if (tool === 'localPortal') { placeLocalPortal(cell); return; }


  // O modo Editar seleciona uma única estrutura e abre seu editor individual.
  if (tool === 'editStructure') {
    var structureEdge = customEdgeAt(world.x, world.y, Math.max(8 / zoom, CELL * 0.18));
    if (!structureEdge) {
      var nearGrid = Math.min(Math.abs(world.x / CELL - Math.round(world.x / CELL)), Math.abs(world.y / CELL - Math.round(world.y / CELL))) * CELL;
      if (nearGrid <= Math.max(8 / zoom, CELL * 0.18)) structureEdge = nearestEdge(world.x, world.y);
    }
    if (structureEdge && getEdgeVal(structureEdge) !== EDGE_NONE) openStructureEditor(structureEdge);
    else appAlertMessage('msg064', 'Não há parede ou porta nesta linha.');
    return;
  }

  // Apaga a linha inteira com um único clique diretamente sobre ela.
  if (tool === 'eraseedge') {
    var edgeToErase = findEraseEdgeAt(world.x, world.y);
    if (edgeToErase) {
      setEdgeVal(edgeToErase, EDGE_NONE);
      save();
      draw();
    }
    return;
  }

  // Clicar fora da imagem manda o personagem caminhar até a borda mais próxima
  // na direção do clique. A troca para o mapa-múndi ocorre só depois do último passo.
  if (!isHexMap() && tool === 'select' && !pendingMonster && currentPlayer() &&
      (world.x < 0 || world.y < 0 || world.x >= MAP_W || world.y >= MAP_H)) {
    startClickExit(world);
    return;
  }


  if (!isHexMap() && ['muro','porta','paredeSecreta','portaSecreta','portaTrancada','portaEmperrada','paredeIlusoria','muralhaForca','paredeMagica'].indexOf(tool) >= 0) {
    var point = snapGridPoint(world.x, world.y);
    if (!pendingStructureStart) { pendingStructureStart = point; draw(); return; }
    var firstPoint = pendingStructureStart; pendingStructureStart = null;
    createCustomStructure(firstPoint, point, tool); return;
  }
  if (!isHexMap() && tool === 'searchSecret') { performActiveSecretSearch(cell); setTool('select'); return; }
  if (!isHexMap() && tool === 'investigateMechanism') { investigateEdgeMechanism(customEdgeAt(world.x,world.y) || nearestEdge(world.x, world.y)); setTool('select'); return; }
  if (!isHexMap() && tool === 'damageStructure') {
    var damageEdge = customEdgeAt(world.x,world.y) || nearestEdge(world.x, world.y);
    var gxDamage = world.x / CELL, gyDamage = world.y / CELL;
    var nearDamageLine = Math.min(Math.abs(gxDamage - Math.round(gxDamage)), Math.abs(gyDamage - Math.round(gyDamage))) < 0.12;
    if ((damageEdge && damageEdge.custom || nearDamageLine) && getEdgeVal(damageEdge) !== EDGE_NONE) damageEdgeStructure(damageEdge);
    else damageCellWall(cell);
    setTool('select'); return;
  }


  if (tool === 'wall') {
    drag = { wall: true, val: 1 };
    applyWallBrush(cell.x, cell.y, 1, 0);
    draw();
    return;
  }
  if (tool === 'erasewall') {
    drag = { wall: true, val: 0 };
    applyWallBrush(cell.x, cell.y, 0, 0);
    draw();
    return;
  }

  if (tool === 'spawn') {
    var player = state.tokens.find(function (t) { return t.tipo === 'player'; });
    if (!player) {
      player = { id: 'p1', nome: 'Aventureiro', tipo: 'player', x: cell.x, y: cell.y, cor: '#4fc3f7', raio: 1, luz: lightRadius, percepcaoPassiva: 10, hp: null, hpMax: null };
      state.tokens.unshift(player);
    } else {
      if (blockMove && isCellWall(cell.x, cell.y)) {
        appAlertMessage('msg081', 'Não é possível iniciar em cima de uma parede.');
        return;
      }
      player.x = cell.x;
      player.y = cell.y;
    }
    selected = player;
    setMapSpawn(cell, player);
    if (dynLight) revealAround(player.x, player.y, player.luz || lightRadius);
    save();
    draw();
    return;
  }

  if (pendingMonster && (tool === 'token' || tool === 'select')) {
    placeMonsterFromId(pendingMonster.id, cell);
    return;
  }

  if (tool === 'select') {
    var edge2 = isHexMap() ? null : (customEdgeAt(world.x,world.y) || nearestEdge(world.x, world.y));
    var ev = edge2 ? getEdgeVal(edge2) : EDGE_NONE;
    if (edge2 && edge2.custom) { interactWithEdge(edge2); return; }
    var gx = world.x / CELL, gy = world.y / CELL;
    var fx = Math.abs(gx - Math.round(gx)), fy = Math.abs(gy - Math.round(gy));
    var nearLine = !isHexMap() && Math.min(fx, fy) < 0.12;
    if (nearLine && (ev === EDGE_DOOR_C || ev === EDGE_DOOR_O)) {
      setDoorRunValue(edge2, doorRunIsClosed(edge2) ? EDGE_DOOR_O : EDGE_DOOR_C);
      save(); draw(); return;
    }
    if (nearLine && isDoorEdge(ev)) { interactWithEdge(edge2); return; }
    if (nearLine && (ev === EDGE_SECRET_WALL || ev === EDGE_ILLUSION_WALL || ev === EDGE_FORCE_WALL || ev === EDGE_MAGIC_WALL || ev === EDGE_MURO)) {
      interactWithEdge(edge2); return;
    }

    var hit = null;
    for (var i = state.tokens.length - 1; i >= 0; i--) {
      var t = state.tokens[i];
      if (!isTokenVisible(t)) continue;
      var sq = t.raio || 1;
      if (cell.x >= t.x && cell.x < t.x + sq && cell.y >= t.y && cell.y < t.y + sq) {
        hit = t; break;
      }
    }
    selected = hit;
    if (hit) {
      if (appMode === 'editor' || hit.tipo === 'player') {
        drag = { moveToken: hit, fromX: hit.x, fromY: hit.y };
      }
    } else {
      // Em mapas de aventura, clicar em um espaço vazio iluminado traça uma rota
      // até ele. Áreas fora da luz atual não aceitam destino de movimento.
      var movingPlayer = currentPlayer();
      if (movingPlayer && isCurrentlyVisible(cell.x, cell.y, movingPlayer.x, movingPlayer.y, movingPlayer.luz || lightRadius)) {
        startClickMove(cell);
      }
    }
    draw();
    return;
  }

  if (tool === 'reveal' || tool === 'hide') {
    drag = { brush: true, mode: tool };
    applyFogBrush(cell.x, cell.y, tool === 'reveal' ? 0 : 1);
    draw();
    return;
  }

  if (tool === 'token' && !pendingMonster) {
    var nome = appPromptMessage('msg082', 'Nome do token:', 'Criatura');
    if (!nome) return;
    if (blockMove && isCellWall(cell.x, cell.y)) return;
    var tok = {
      id: 't' + Date.now().toString(36),
      nome: nome, tipo: 'npc', x: cell.x, y: cell.y,
      cor: '#e57373', raio: 1, luz: 0, hp: null, hpMax: null
    };
    state.tokens.push(tok);
    selected = tok;
    save();
    draw();
    return;
  }

  if (tool === 'measure') {
    if (!measurePts) measurePts = [cell];
    else if (measurePts.length === 1) { measurePts.push(cell); draw(); }
    else { measurePts = [cell]; draw(); }
  }
}

function onPointerMove(e) {
  if (drag && drag.pan) {
    ox = drag.originX + (e.clientX - drag.startX);
    oy = drag.originY + (e.clientY - drag.startY);
    draw();
    return;
  }
  if (isHexMap()) return;
  var previewRect = cv.getBoundingClientRect();
  previewPointer = screenToWorld(e.clientX - previewRect.left, e.clientY - previewRect.top);
  if (!drag) { draw(); return; }
  if (drag.pan) {
    // Pan da câmera com o mouse desativado.
    return;
  }
  if (drag.edgePaint && !isHexMap()) {
    var rectE = cv.getBoundingClientRect();
    var worldE = screenToWorld(e.clientX - rectE.left, e.clientY - rectE.top);
    var edge = nearestEdge(worldE.x, worldE.y);
    if (drag.mode === 'muro') setEdgeVal(edge, EDGE_MURO);
    else if (drag.mode === 'porta') {
      var c = getEdgeVal(edge);
      if (c === EDGE_NONE) setEdgeVal(edge, EDGE_DOOR_C);
    } else {
      var eraseVal = getEdgeVal(edge);
      if (eraseVal === EDGE_DOOR_C || eraseVal === EDGE_DOOR_O) setDoorRunValue(edge, EDGE_NONE);
      else setEdgeVal(edge, EDGE_NONE);
    }
    draw();
    return;
  }
  if (drag.wall) {
    var rect = cv.getBoundingClientRect();
    var world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    var cell = worldToCell(world.x, world.y);
    applyWallBrush(cell.x, cell.y, drag.val, 0);
    draw();
    return;
  }
  if (drag.moveToken) {
    var rect2 = cv.getBoundingClientRect();
    var world2 = screenToWorld(e.clientX - rect2.left, e.clientY - rect2.top);
    var cell2 = worldToCell(world2.x, world2.y);
    var t = drag.moveToken;
    if (canStep(t.x, t.y, cell2.x, cell2.y, t, true)) {
      t.x = cell2.x;
      t.y = cell2.y;
      if (t.tipo === 'player') checkPassiveSecretDetection(t);
      if (t.tipo === 'player' && dynLight) {
        revealAround(cell2.x, cell2.y, t.luz || lightRadius);
      }
    }
    draw();
    return;
  }
  if (drag.brush) {
    var rect3 = cv.getBoundingClientRect();
    var world3 = screenToWorld(e.clientX - rect3.left, e.clientY - rect3.top);
    var cell3 = worldToCell(world3.x, world3.y);
    applyFogBrush(cell3.x, cell3.y, drag.mode === 'reveal' ? 0 : 1);
    draw();
  }
}

function onPointerUp() {
  var teleported = false;
  if (drag && drag.moveToken && drag.moveToken.tipo === 'player') {
    var localPortal = findLocalPortalAt(drag.moveToken.x, drag.moveToken.y);
    if (localPortal) teleported = teleportPlayerWithinMap(localPortal, drag.moveToken);
  }
  if (drag && (drag.moveToken || drag.brush || drag.wall || drag.edgePaint)) save();
  drag = null;
  if (cv) cv.style.cursor = tool === 'pan' && appMode === 'editor' ? 'grab' : (tool === 'select' ? 'pointer' : 'crosshair');
  if (teleported) draw();
}

function onPointerLeave() {
  if (!drag) { previewPointer = null; draw(); }
}

function onWheel(e) {
  e.preventDefault();
  if (!e.deltaY) return;
  // No Editor o zoom é livre nos dois mapas e acompanha a posição do cursor.
  if (appMode === 'editor') {
    var rect = cv.getBoundingClientRect();
    changeCameraZoom(Math.exp(-e.deltaY * 0.0015), e.clientX - rect.left, e.clientY - rect.top);
    return;
  }
  // No modo Jogador, o mapa-múndi mantém o zoom automático.
  if (isHexMap()) { zoom = FLANAESS_ZOOM; draw(); return; }
  changeCameraZoom(Math.exp(-e.deltaY * 0.0015));
}

// ---------- Movimento por clique em tiles visíveis (mapas de quadrados) ----------
function findVisiblePath(start, goal, token, allowUnseenForExit) {
  if (!start || !goal || isHexMap()) return null;
  if (goal.x < 0 || goal.y < 0 || goal.x >= COLS || goal.y >= ROWS) return null;
  var radius = (token && token.luz) || lightRadius;
  if (!allowUnseenForExit && !isCurrentlyVisible(goal.x, goal.y, start.x, start.y, radius)) return null;
  if (start.x === goal.x && start.y === goal.y) return [start];

  var dirs = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];
  function key(x, y) { return x + ',' + y; }
  function heuristic(x, y) {
    var dx = Math.abs(goal.x - x), dy = Math.abs(goal.y - y);
    return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
  }

  var open = [], cameFrom = {}, gScore = {}, closed = {};
  var startKey = key(start.x, start.y), goalKey = key(goal.x, goal.y);
  gScore[startKey] = 0;
  heapPush(open, { x: start.x, y: start.y, g: 0, f: heuristic(start.x, start.y) });
  var visited = 0, maxVisited = Math.min(COLS * ROWS, 12000);

  while (open.length && visited < maxVisited) {
    var current = heapPop(open);
    var currentKey = key(current.x, current.y);
    if (closed[currentKey]) continue;
    if (currentKey === goalKey) {
      var path = [{ x: goal.x, y: goal.y }];
      var cursor = goalKey;
      while (cursor !== startKey) {
        cursor = cameFrom[cursor];
        if (!cursor) return null;
        var parts = cursor.split(',');
        path.push({ x: Number(parts[0]), y: Number(parts[1]) });
      }
      path.reverse();
      return path;
    }
    closed[currentKey] = true;
    visited++;

    for (var i = 0; i < dirs.length; i++) {
      var nx = current.x + dirs[i][0], ny = current.y + dirs[i][1];
      var nextKey = key(nx, ny);
      if (closed[nextKey]) continue;
      if (!allowUnseenForExit && !isCurrentlyVisible(nx, ny, start.x, start.y, radius)) continue;
      if (!canStep(current.x, current.y, nx, ny, token)) continue;
      var tentative = current.g + (dirs[i][0] && dirs[i][1] ? Math.SQRT2 : 1);
      if (gScore[nextKey] != null && tentative >= gScore[nextKey]) continue;
      cameFrom[nextKey] = currentKey;
      gScore[nextKey] = tentative;
      heapPush(open, { x: nx, y: ny, g: tentative, f: tentative + heuristic(nx, ny) });
    }
  }
  return null;
}

function startClickMove(destination, exitAfterArrival) {
  var player = currentPlayer();
  if (!player || isHexMap() || !destination) return false;
  var path = findVisiblePath({ x: player.x, y: player.y }, destination, player, !!exitAfterArrival);
  if (!path) return false;
  stopKeyMove();
  if (path.length < 2) {
    if (exitAfterArrival) return returnToWorldMapFromExit();
    var standingLocalPortal = findLocalPortalAt(player.x, player.y);
    if (standingLocalPortal) return teleportPlayerWithinMap(standingLocalPortal, player);
    return false;
  }
  clickMovePath = path.slice(1);
  clickMoveExitPending = !!exitAfterArrival;
  if (keyMoveRaf == null) keyMoveRaf = window.requestAnimationFrame(keyMoveFrame);
  return true;
}

// Encontra onde a trajetória do clique externo cruza o limite do mapa,
// considerando também o tamanho (raio) do token do jogador.
function mapExitBorderCell(outsideWorldPoint, player) {
  var sq = Math.max(1, player && player.raio || 1);
  var maxX = Math.max(0, COLS - sq), maxY = Math.max(0, ROWS - sq);
  var sx = player.x, sy = player.y;
  var tx = outsideWorldPoint.x / CELL - 0.5 - (sq - 1) / 2;
  var ty = outsideWorldPoint.y / CELL - 0.5 - (sq - 1) / 2;
  var dx = tx - sx, dy = ty - sy;
  var hitT = Infinity, hitSide = '';
  var epsilon = 1e-9;
  if (dx < -epsilon) {
    var leftT = (0 - sx) / dx;
    if (leftT >= 0 && leftT < hitT) { hitT = leftT; hitSide = 'left'; }
  } else if (dx > epsilon) {
    var rightT = (maxX - sx) / dx;
    if (rightT >= 0 && rightT < hitT) { hitT = rightT; hitSide = 'right'; }
  }
  if (dy < -epsilon) {
    var topT = (0 - sy) / dy;
    if (topT >= 0 && topT < hitT) { hitT = topT; hitSide = 'top'; }
  } else if (dy > epsilon) {
    var bottomT = (maxY - sy) / dy;
    if (bottomT >= 0 && bottomT < hitT) { hitT = bottomT; hitSide = 'bottom'; }
  }
  if (!isFinite(hitT)) return null;
  var x = Math.max(0, Math.min(maxX, Math.round(sx + dx * hitT)));
  var y = Math.max(0, Math.min(maxY, Math.round(sy + dy * hitT)));
  if (hitSide === 'left') x = 0;
  else if (hitSide === 'right') x = maxX;
  else if (hitSide === 'top') y = 0;
  else if (hitSide === 'bottom') y = maxY;
  return { x: x, y: y };
}

function startClickExit(outsideWorldPoint) {
  var player = currentPlayer();
  if (!player || !outsideWorldPoint || isHexMap()) return false;
  var borderCell = mapExitBorderCell(outsideWorldPoint, player);
  if (!borderCell) return false;
  // A rota de saída respeita paredes/portas e colisões, mas o comando explícito
  // de sair pode atravessar trechos ainda escuros até alcançar a borda escolhida.
  return startClickMove(borderCell, true);
}

// ---------- Movimento do personagem com setas ----------
function tokenAnchor(t, x, y) {
  var sq = t.raio || 1;
  return cellCenter(x + (sq - 1) / 2, y + (sq - 1) / 2);
}

function heldDirection() {
  var dx = (keysHeld.ArrowRight ? 1 : 0) - (keysHeld.ArrowLeft ? 1 : 0);
  var dy = (keysHeld.ArrowDown ? 1 : 0) - (keysHeld.ArrowUp ? 1 : 0);
  return (dx || dy) ? { dx: dx, dy: dy } : null;
}

// Diagonal bloqueada? Tenta deslizar só na horizontal ou só na vertical.
function pickKeyStep(pl, dir) {
  var cands = [];
  if (dir.dx && dir.dy) cands.push({ x: pl.x + dir.dx, y: pl.y + dir.dy }, { x: pl.x + dir.dx, y: pl.y }, { x: pl.x, y: pl.y + dir.dy });
  else cands.push({ x: pl.x + dir.dx, y: pl.y + dir.dy });
  for (var i = 0; i < cands.length; i++) {
    if (canStep(pl.x, pl.y, cands[i].x, cands[i].y, pl, true)) return cands[i];
  }
  return null;
}

// As setas escolhem quatro direções estáveis na grade pointy-top:
// esquerda/direita são horizontais; cima/baixo seguem o mesmo eixo diagonal.
function pickHexKeyStep(pl) {
  var next = null, odd = pl.y & 1;
  if (keysHeld.ArrowLeft) next = { x: pl.x - 1, y: pl.y };
  else if (keysHeld.ArrowRight) next = { x: pl.x + 1, y: pl.y };
  else if (keysHeld.ArrowUp) next = { x: pl.x + (odd ? 1 : 0), y: pl.y - 1 };
  else if (keysHeld.ArrowDown) next = { x: pl.x + (odd ? 0 : -1), y: pl.y + 1 };
  return next && canStep(pl.x, pl.y, next.x, next.y, pl) ? next : null;
}

function keyMoveWouldExitMap(pl, dir) {
  if (!pl || !dir || isHexMap()) return false;
  var sq = (pl.raio || 1);
  var nx = pl.x + dir.dx, ny = pl.y + dir.dy;
  return nx < 0 || ny < 0 || nx + sq > COLS || ny + sq > ROWS;
}

// Ao sair pela borda de um mapa de aventura, retorna ao Flanaess na
// última posição salva (normalmente o hexágono de onde o portal foi usado).
function returnToWorldMapFromExit() {
  if (isHexMap() || !MAPS.flanaess) return false;
  var host = R;
  save();
  stopKeyMove();
  stopWorldTravel(false);
  selected = null;
  pendingMonster = null;
  measurePts = null;
  drag = null;
  tool = 'select';
  preferredMapId = 'flanaess';
  try { localStorage.setItem(MAP_ID_KEY, 'flanaess'); } catch (e) {}
  unmount();
  mount(host);
  return true;
}

// Mantém a câmera travada no personagem durante todo o deslocamento,
// sem margem morta: qualquer movimento do personagem move a câmera junto.
function followKeyMove() {
  if (!cv) return;
  if (isHexMap()) focusCameraOnPlayer();
  else centerCameraOnPlayer();
}

function stopKeyMove() {
  if (keyMoveRaf != null) { window.cancelAnimationFrame(keyMoveRaf); keyMoveRaf = null; }
  keyMoveStep = null; keyMoveVis = null; keyMoveCarry = null; clickMovePath = []; keysHeld = {};
  clickMoveExitPending = false;
  worldTravelPos = null;
}

function keyMoveFrame(now) {
  keyMoveRaf = null;
  var pl = currentPlayer();
  var hexMode = isHexMap();
  if (!pl || !cv) { stopKeyMove(); return; }

  while (true) {
    if (!keyMoveStep) {
      if (!hexMode) checkPassiveSecretDetection(pl);
      var dir = heldDirection();
      var next = hexMode
        ? pickHexKeyStep(pl)
        : (dir ? pickKeyStep(pl, dir) : (clickMovePath.length ? clickMovePath.shift() : null));
      if (!next) {
        if (!hexMode && clickMoveExitPending && clickMovePath.length === 0) {
          clickMoveExitPending = false;
          if (returnToWorldMapFromExit()) return;
        }
        if (!hexMode && keyMoveWouldExitMap(pl, dir) && returnToWorldMapFromExit()) return;
        break;
      }
      if (!canStep(pl.x, pl.y, next.x, next.y, pl, true)) {
        if (!hexMode) { clickMovePath = []; clickMoveExitPending = false; }
        break;
      }
      var from = tokenAnchor(pl, pl.x, pl.y), to = tokenAnchor(pl, next.x, next.y);
      var cells = Math.sqrt(Math.pow(next.x - pl.x, 2) + Math.pow(next.y - pl.y, 2));
      keyMoveStep = { from: from, to: to, dur: (hexMode ? HEX_KEY_STEP_MS : KEY_STEP_MS) * cells, t0: keyMoveCarry != null ? keyMoveCarry : now };
      keyMoveCarry = null;
      // A posição lógica avança no início do passo; a posição visual desliza até o centro.
      pl.x = next.x; pl.y = next.y; selected = pl;
      if (!hexMode) checkPassiveSecretDetection(pl);
      if (dynLight && !hexMode) revealAround(pl.x, pl.y, pl.luz || lightRadius);
    }
    var st = keyMoveStep;
    var p = (now - st.t0) / st.dur;
    if (p >= 1) {
      keyMoveCarry = st.t0 + st.dur;
      keyMoveStep = null;
      var reachedLocalPortal = findLocalPortalAt(pl.x, pl.y);
      if (reachedLocalPortal) {
        var localDestination = localPortalDestination(reachedLocalPortal, pl.x, pl.y);
        if (localDestination) {
          pl.x = localDestination.x; pl.y = localDestination.y;
          selected = pl;
          keyMoveVis = null;
          clickMovePath = [];
          clickMoveExitPending = false;
          if (hexMode) worldTravelPos = null;
          else {
            if (dynLight) revealAround(pl.x, pl.y, pl.luz || lightRadius);
            checkPassiveSecretDetection(pl);
          }
          save(); draw();
          continue;
        }
      }
      if (hexMode) {
        worldTravelPos = null;
        var reachedPortal = findWorldPortalAt(pl.x, pl.y);
        if (reachedPortal) {
          stopKeyMove();
          teleportThroughWorldPortal(reachedPortal);
          return;
        }
      }
      continue;
    }
    keyMoveVis = { x: st.from.x + (st.to.x - st.from.x) * p, y: st.from.y + (st.to.y - st.from.y) * p };
    if (hexMode) worldTravelPos = keyMoveVis;
    followKeyMove();
    if (now - keyMoveLastSave > 1000) { save(); keyMoveLastSave = now; }
    draw();
    keyMoveRaf = window.requestAnimationFrame(keyMoveFrame);
    return;
  }

  keyMoveVis = null; keyMoveCarry = null;
  if (hexMode) worldTravelPos = null;
  save();
  draw();
}

function onKey(e) {
  if (e.key === 'Escape' && menuIsOpen()) { setMenu(false); return; }
  if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName || '')) return;
  if (MOVE_KEYS[e.code] && !e.ctrlKey && !e.metaKey && !e.altKey) {
    if (isHexMap()) {
      e.preventDefault();
      // No mapa-múndi, as setas só movem o personagem quando as ferramentas estão desativadas.
      if (tool !== 'select' || drag || !currentPlayer()) return;
      if (keyMoveRaf == null) stopWorldTravel(false);
    } else {
      e.preventDefault();
      if (drag || !currentPlayer()) return;
      clickMovePath = [];
      clickMoveExitPending = false;
    }
    keysHeld[e.code] = true;
    if (keyMoveRaf == null) keyMoveRaf = window.requestAnimationFrame(keyMoveFrame);
    return;
  }
  if (appMode === 'editor' && e.code === 'Space') { space = true; e.preventDefault(); return; }
  if (appMode !== 'editor') {
    if (e.key === 'Escape' && isHexMap()) haltWorldTravel();
    return;
  }
  if (isHexMap()) {
    if (e.key === 'Escape') {
      if (tool === 'portal' || tool === 'spawn' || tool === 'localPortal') setTool('select');
      else haltWorldTravel();
    }
    return;
  }
  if (e.key === 'Escape' && pendingStructureStart) { pendingStructureStart = null; draw(); return; }
  if (e.key === 'Escape' && tool === 'localPortal') { pendingLocalPortal = null; setTool('select'); return; }
  if ((e.key === 'Delete' || e.key === 'Backspace') && selected && selected.tipo !== 'player') {
    state.tokens = state.tokens.filter(function (t) { return t !== selected; });
    selected = null; save(); draw();
  }
  if (e.key === 'g' || e.key === 'G') { showGrid = !showGrid; draw(); }
  if (e.key === 'f' || e.key === 'F') { showFog = !showFog; draw(); }
  if (e.key === 'l' || e.key === 'L') { dynLight = !dynLight; draw(); }
  if (e.key === 'w' || e.key === 'W') { showWalls = !showWalls; draw(); }
  if (e.key === 'Escape') { pendingMonster = null; selected = null; measurePts = null; draw(); }
}

function onKeyUp(e) {
  if (e.code === 'Space') space = false;
  if (MOVE_KEYS[e.code]) delete keysHeld[e.code];
}
function onWindowBlur() { keysHeld = {}; space = false; if (drag && drag.pan) drag = null; }

function setTool(t) {
  if (appMode !== 'editor' && t !== 'select') t = 'select';
  if (isHexMap() && ['select', 'pan', 'spawn', 'portal', 'localPortal'].indexOf(t) < 0) t = 'select';
  tool = t;
  pendingStructureStart = null;
  measurePts = null;
  if (t !== 'token') pendingMonster = null;
  R.querySelectorAll('#mp-tools button').forEach(function (b) {
    b.classList.toggle('on', b.dataset.t === t);
  });
  if (t !== 'localPortal') pendingLocalPortal = null;
  var worldSpawnButton = R.querySelector('#mp-world-spawn');
  var worldPortalButton = R.querySelector('#mp-world-portal');
  var worldLocalPortalButton = R.querySelector('#mp-world-local-portal');
  var worldMoveButton = R.querySelector('#mp-world-move');
  if (worldSpawnButton) worldSpawnButton.classList.toggle('active', t === 'spawn');
  if (worldPortalButton) worldPortalButton.classList.toggle('active', t === 'portal');
  if (worldLocalPortalButton) worldLocalPortalButton.classList.toggle('active', t === 'localPortal');
  if (worldMoveButton) worldMoveButton.classList.toggle('active', t === 'select');
  if (cv) cv.style.cursor = t === 'pan' && appMode === 'editor' ? 'grab' : t === 'select' ? 'pointer' : 'crosshair';
  draw();
}


// ---------- Ações do personagem: ficha, rolagens automáticas e área de visão ----------
// Lê a ficha montada no index.html (S, CL, BG e os mesmos cálculos usados na ficha).
// O mapa e o criador de personagens são carregados na mesma página; não há cópia manual
// dos bônus quando a ficha já está preenchida.
var RPG_SKILL_ABILITIES = {
  'Acrobacia':'DES','Adestrar Animais':'SAB','Arcanismo':'INT','Atletismo':'FOR',
  'Atuação':'CAR','Enganação':'CAR','Furtividade':'DES','História':'INT',
  'Intimidação':'CAR','Intuição':'SAB','Investigação':'INT','Medicina':'SAB',
  'Natureza':'INT','Percepção':'SAB','Persuasão':'CAR','Prestidigitação':'DES',
  'Religião':'INT','Sobrevivência':'SAB'
};
function getCharacterSheetActionData() {
  try {
    if (typeof S === 'undefined' || !S || S.cls == null) return null;
    var classes = (typeof CL !== 'undefined' && Array.isArray(CL)) ? CL : window.CLASSES;
    var backgrounds = (typeof BG !== 'undefined' && Array.isArray(BG)) ? BG : window.BACKGROUNDS;
    var cls = classes && classes[S.cls];
    if (!cls) return null;
    var bg = backgrounds && S.bg != null ? backgrounds[S.bg] : null;
    function base(attr) {
      if (S.method === 'std' || S.method === 'rnd') return S.std && S.std[attr] != null ? Number(S.std[attr]) : 10;
      if (S.method === 'pb') return S.pb && S.pb[attr] != null ? Number(S.pb[attr]) : 8;
      return S.man && S.man[attr] != null ? Number(S.man[attr]) : 10;
    }
    function originBonus(attr) {
      if (!bg || !Array.isArray(bg.a) || bg.a.indexOf(attr) < 0) return 0;
      if (S.mode === '111') return 1;
      return attr === S.p2 ? 2 : attr === S.p1 ? 1 : 0;
    }
    var scores = {}, abilityMods = {};
    ['FOR','DES','CON','INT','SAB','CAR'].forEach(function (attr) {
      scores[attr] = Math.min(20, base(attr) + originBonus(attr));
      abilityMods[attr] = Math.floor((scores[attr] - 10) / 2);
    });
    var proficiencyBonus = cls ? 2 : 0; // a ficha atual do repositório está no nível 1.
    var proficiencies = new Set((Array.isArray(S.skills) ? S.skills : []).concat(bg && Array.isArray(bg.s) ? bg.s : []));
    var skillBonuses = {};
    Object.keys(RPG_SKILL_ABILITIES).forEach(function (skill) {
      var ability = RPG_SKILL_ABILITIES[skill];
      skillBonuses[skill] = abilityMods[ability] + (proficiencies.has(skill) ? proficiencyBonus : 0);
    });
    var toolsBonus = abilityMods.DES + (bg && normalizeRpgText(bg.i || '') === 'ferramentas de ladrao' ? proficiencyBonus : 0);
    return {
      name: String(S.name || 'Personagem'), className: cls.n || '',
      scores: scores, abilityMods: abilityMods, skillBonuses: skillBonuses,
      proficiencies: Array.from(proficiencies), proficiencyBonus: proficiencyBonus,
      passivePerception: 10 + skillBonuses['Percepção'],
      meleeAttack: abilityMods.FOR + proficiencyBonus,
      rangedAttack: abilityMods.DES + proficiencyBonus,
      toolsBonus: toolsBonus,
      hp: Math.max(1, Number(cls.d || 0) + abilityMods.CON),
      armorClass: 10 + abilityMods.DES
    };
  } catch (e) { return null; }
}
function playerActionProfile(player) {
  if (!player) return null;
  if (!player.actionProfile || typeof player.actionProfile !== 'object') player.actionProfile = {};
  var profile = player.actionProfile;
  var previousConfigVersion = profile.configVersion;
  var defaults = {
    perception: 0, investigation: 0, attack: 0, athletics: 0, tools: 0,
    skillBonuses: {}, damage: '1d8+0', attackRange: 0, weaponId: '', weaponMode: 'melee', damageOverride: '',
    useSheet: true, configVersion: 2
  };
  Object.keys(defaults).forEach(function (key) {
    if (profile[key] == null) profile[key] = defaults[key];
  });
  if (!profile.skillBonuses || typeof profile.skillBonuses !== 'object') profile.skillBonuses = {};
  // Migra os três bônus que versões anteriores guardavam separadamente.
  if (profile.skillBonuses['Percepção'] == null) profile.skillBonuses['Percepção'] = Number(profile.perception) || 0;
  if (profile.skillBonuses['Investigação'] == null) profile.skillBonuses['Investigação'] = Number(profile.investigation) || 0;
  if (profile.skillBonuses['Atletismo'] == null) profile.skillBonuses['Atletismo'] = Number(profile.athletics) || 0;
  // Migra o perfil antigo: 1d8+0 e 6 quadrículas eram apenas valores padrão.
  if (previousConfigVersion !== 2) {
    if (profile.damage && profile.damage !== '1d8+0') profile.damageOverride = profile.damage;
    if (Number(profile.attackRange) === 6) profile.attackRange = 0;
    profile.weaponId = profile.weaponId || '';
    profile.configVersion = 2;
  }
  var sheet = getCharacterSheetActionData();
  if (sheet) {
    profile.useSheet = true;
    profile.perception = sheet.skillBonuses['Percepção'];
    profile.investigation = sheet.skillBonuses['Investigação'];
    profile.athletics = sheet.skillBonuses['Atletismo'];
    profile.tools = sheet.toolsBonus;
    player.percepcaoPassiva = sheet.passivePerception;
    profile.sheetName = sheet.name;
  }
  return profile;
}
function normalizeRpgText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
function playerWeaponCatalog() {
  var items = window.ITEMS || window.EQUIPMENT || [];
  return Array.isArray(items) ? items.filter(function (item) {
    return item && item.categoria === 'Armas' && item.dano && !item.magico;
  }) : [];
}
function playerWeaponById(id) {
  if (!id) return null;
  return playerWeaponCatalog().find(function (item) { return item.id === id; }) || null;
}
function playerWeaponRange(item, weaponMode) {
  var props = normalizeRpgText(item && item.propriedades || '');
  var use = normalizeRpgText((item && item.uso || '') + ' ' + (item && item.tipo || ''));
  var ammo = props.match(/Municao\s*\(\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*([0-9]+(?:[.,][0-9]+)?)\s*m/i);
  var thrown = props.match(/Arremesso\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*([0-9]+(?:[.,][0-9]+)?)\s*m/i);
  function cells(meters) { return Math.max(1, Math.ceil(Number(String(meters).replace(',', '.')) / 1.5)); }
  if (ammo) return { normal: cells(ammo[1]), max: cells(ammo[2]), ranged: true, thrown: false };
  var listedAsRanged = /a distancia|ataque a distancia/.test(use);
  if (thrown && (listedAsRanged || weaponMode === 'thrown')) {
    // Armas corpo a corpo com Arremesso usam o alcance de arremesso só quando esse modo é escolhido.
    // O atributo continua sendo o mesmo do ataque corpo a corpo (Força, salvo Acuidade).
    return { normal: cells(thrown[1]), max: cells(thrown[2]), ranged: listedAsRanged, thrown: true };
  }
  var reach = props.indexOf('alcance') >= 0 ? 2 : 1;
  return { normal: reach, max: reach, ranged: listedAsRanged, thrown: !!thrown };
}
function playerWeaponDamageDice(item) {
  var raw = String(item && item.dano || '');
  var match = raw.match(/(?:^|\s)(\d*d\d+|\d+)(?=\s|$)/i);
  return match ? match[1] : '';
}
function resolvePlayerAttackData(player, profile) {
  var sheet = getCharacterSheetActionData();
  var weapon = playerWeaponById(profile.weaponId);
  if (!weapon) return {
    weapon: null, sheet: sheet,
    bonus: sheet ? sheet.meleeAttack : (Number(profile.attack) || 0),
    damage: String(profile.damageOverride || profile.damage || '1d8+0'),
    normalRange: Number(profile.attackRange) || 6,
    maxRange: Number(profile.attackRange) || 6,
    ranged: false, ability: 'FOR'
  };
  var range = playerWeaponRange(weapon, profile.weaponMode);
  var props = normalizeRpgText(weapon.propriedades || '');
  var finesse = props.indexOf('acuidade') >= 0;
  var ability = range.ranged ? 'DES' : 'FOR';
  if (finesse && sheet) ability = sheet.abilityMods.DES > sheet.abilityMods.FOR ? 'DES' : 'FOR';
  var abilityMod = sheet ? sheet.abilityMods[ability] : 0;
  var dice = playerWeaponDamageDice(weapon) || '1d4';
  var derivedDamage = dice + (abilityMod > 0 ? '+' + abilityMod : abilityMod < 0 ? String(abilityMod) : '');
  var customRange = Number(profile.attackRange) > 0;
  return {
    weapon: weapon, sheet: sheet,
    bonus: sheet ? abilityMod + sheet.proficiencyBonus : Number(profile.attack) || 0,
    damage: String(profile.damageOverride || derivedDamage),
    normalRange: customRange ? Number(profile.attackRange) : range.normal,
    maxRange: customRange ? Number(profile.attackRange) : range.max,
    ranged: range.ranged, thrown: range.thrown, ability: ability, abilityMod: abilityMod
  };
}
function playerSkillOptionsHtml() {
  return Object.keys(RPG_SKILL_ABILITIES).map(function (skill) {
    return '<option value="' + esc(skill) + '">' + esc(skill) + ' (' + RPG_SKILL_ABILITIES[skill] + ')</option>';
  }).join('');
}
function rollDie(sides) { return 1 + Math.floor(Math.random() * Math.max(2, Number(sides) || 20)); }
function rollCheck(bonus) {
  var die = rollDie(20), mod = Number(bonus) || 0;
  return { die: die, bonus: mod, total: die + mod };
}
function rollDamageExpression(expression, critical) {
  var raw = String(expression || '1d8').trim();
  var constant = raw.match(/^([0-9]+)\s*([+-]\s*\d+)?$/);
  if (constant) {
    var flat = Number(constant[1]) + (Number(String(constant[2] || '0').replace(/\s/g, '')) || 0);
    return { rolls: [], modifier: 0, total: Math.max(0, flat), formula: raw, critical: !!critical };
  }
  var match = raw.match(/^\s*(\d*)d(\d+)\s*([+-]\s*\d+)?\s*$/i);
  if (!match) return null;
  var count = Math.max(1, Math.min(20, Number(match[1] || 1)));
  var sides = Math.max(2, Math.min(100, Number(match[2] || 8)));
  var modifier = Number(String(match[3] || '0').replace(/\s/g, '')) || 0;
  var rolls = [];
  for (var i = 0; i < count; i++) rolls.push(rollDie(sides));
  var diceTotal = rolls.reduce(function (sum, value) { return sum + value; }, 0);
  return { rolls: rolls, modifier: modifier, total: diceTotal * (critical ? 2 : 1) + modifier, formula: count + 'd' + sides + (modifier ? (modifier > 0 ? '+' : '') + modifier : ''), critical: !!critical };
}
function playerVisionRadius(player) {
  return Math.max(1, Number(player && player.luz) || Number(lightRadius) || 6);
}
function edgeInPlayerVision(edge, player, range) {
  if (!edge || !player || isHexMap()) return false;
  // A própria parede/porta bloqueia a visão para a célula do outro lado, então o ponto médio
  // (que cai exatamente na divisa) não pode ser usado sozinho. A estrutura é visível se ao
  // menos uma das células que encostam nela estiver visível ao personagem.
  var cells = [];
  if (edge.custom) {
    var c = edge.custom, mid = edgeMidpoint(edge);
    var ex = c.x2 - c.x1, ey = c.y2 - c.y1, len = Math.sqrt(ex * ex + ey * ey) || 1;
    var nx = -ey / len * CELL * 0.3, ny = ex / len * CELL * 0.3;
    cells.push(worldToCell(mid.x + nx, mid.y + ny), worldToCell(mid.x - nx, mid.y - ny), worldToCell(mid.x, mid.y));
  } else if (edge.dir === 'h') {
    cells.push({ x: edge.x, y: edge.yEdge - 1 }, { x: edge.x, y: edge.yEdge });
  } else {
    cells.push({ x: edge.xEdge - 1, y: edge.y }, { x: edge.xEdge, y: edge.y });
  }
  return cells.some(function (cell) {
    return cell && cell.x >= 0 && cell.y >= 0 && cell.x < COLS && cell.y < ROWS &&
      isCurrentlyVisible(cell.x, cell.y, player.x, player.y, range) &&
      hasLOS(player.x, player.y, cell.x, cell.y);
  });
}
function visibleEdgesForPlayer(player, range) {
  if (!player || isHexMap()) return [];
  return nearbyEdgesForCell({ x: player.x, y: player.y }, range + 0.5).filter(function (item) {
    return item.val !== EDGE_NONE && edgeInPlayerVision(item.edge, player, range);
  });
}
function playerActionResult(title, lines) {
  var dlg = createPortalDialog(title, 'Resultado automático — a rolagem foi aplicada aos alvos dentro da visão do personagem.');
  if (!dlg) return;
  dlg.panel.style.width = 'min(620px,100%)';
  dlg.panel.style.maxHeight = '86%';
  dlg.panel.style.overflow = 'auto';
  var list = document.createElement('div');
  list.style.cssText = 'display:flex;flex-direction:column;gap:7px;margin:10px 0 14px;max-height:55vh;overflow:auto;';
  (lines || []).forEach(function (line) {
    var item = document.createElement('div');
    item.style.cssText = 'padding:8px 10px;border:1px solid rgba(255,255,255,.12);border-radius:7px;background:rgba(255,255,255,.045);font-size:13px;line-height:1.45;white-space:pre-wrap;';
    item.textContent = String(line);
    list.appendChild(item);
  });
  dlg.panel.appendChild(list);
  var actions = document.createElement('div'); actions.className = 'mp-portal-dialog-actions';
  var close = document.createElement('button'); close.type = 'button'; close.className = 'primary'; close.textContent = 'Fechar';
  close.onclick = function () { closePortalDialog(dlg.overlay); };
  actions.appendChild(close); dlg.panel.appendChild(actions);
}
function configurePlayerActionProfile(player) {
  if (!player) return;
  var profile = playerActionProfile(player);
  var sheet = getCharacterSheetActionData();
  var dlg = createPortalDialog('Configurar ações do personagem', sheet
    ? 'Os bônus de perícias e atributos vêm diretamente da ficha aberta no site. Escolha a arma usada no Ataque; dano e alcance serão calculados pelo catálogo.'
    : 'Preencha os bônus manuais ou conclua a ficha do personagem para sincronizar os atributos e perícias automaticamente.');
  if (!dlg) return;
  dlg.panel.style.width = 'min(560px,100%)';
  dlg.panel.style.maxHeight = '88%'; dlg.panel.style.overflow = 'auto';
  var form = document.createElement('div');
  form.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:10px 0 14px;';
  var inputs = {};
  function addField(captionText, key, type, value, full) {
    var label = document.createElement('label');
    label.style.cssText = 'display:flex;flex-direction:column;gap:4px;color:#d5d9e2;font-size:12px;' + (full ? 'grid-column:1/-1;' : '');
    var caption = document.createElement('span'); caption.textContent = captionText; label.appendChild(caption);
    var input = document.createElement('input'); input.type = type; input.value = value == null ? '' : value;
    input.style.cssText = 'width:100%;min-width:0;box-sizing:border-box;padding:8px;border:1px solid #555d6c;border-radius:6px;background:#252a34;color:#fff;';
    if (type === 'number') { input.step = '1'; input.min = key === 'attackRange' ? '0' : '-20'; input.max = key === 'attackRange' ? '120' : '30'; }
    inputs[key] = input; label.appendChild(input); form.appendChild(label);
  }
  if (sheet) {
    var summary = document.createElement('div');
    summary.style.cssText = 'grid-column:1/-1;padding:10px;border:1px solid rgba(100,190,230,.3);border-radius:7px;background:rgba(38,92,125,.18);font-size:12px;line-height:1.55;color:#e9f5fc;';
    summary.textContent = 'Ficha sincronizada: ' + sheet.name + (sheet.className ? ' · ' + sheet.className : '') + '. Percepção ' + signed(sheet.skillBonuses['Percepção']) + ' (passiva ' + sheet.passivePerception + '), Investigação ' + signed(sheet.skillBonuses['Investigação']) + ', Atletismo ' + signed(sheet.skillBonuses['Atletismo']) + ', ataque corpo a corpo ' + signed(sheet.meleeAttack) + ' e à distância ' + signed(sheet.rangedAttack) + '.';
    form.appendChild(summary);
  } else {
    addField('Bônus de Ataque','attack','number',profile.attack);
    addField('Bônus de Ferramentas de Ladrão','tools','number',profile.tools);
    Object.keys(RPG_SKILL_ABILITIES).forEach(function (skill) {
      var legacyKey = skill === 'Percepção' ? 'perception' : skill === 'Investigação' ? 'investigation' : skill === 'Atletismo' ? 'athletics' : null;
      var value = legacyKey ? profile[legacyKey] : profile.skillBonuses[skill];
      addField('Bônus de ' + skill + ' (' + RPG_SKILL_ABILITIES[skill] + ')', 'skillBonus_' + skill, 'number', value);
    });
  }
  var weaponLabel = document.createElement('label');
  weaponLabel.style.cssText = 'grid-column:1/-1;display:flex;flex-direction:column;gap:4px;color:#d5d9e2;font-size:12px;';
  var weaponCaption = document.createElement('span'); weaponCaption.textContent = 'Arma usada no Ataque'; weaponLabel.appendChild(weaponCaption);
  var weaponSelect = document.createElement('select'); weaponSelect.style.cssText = 'width:100%;padding:8px;border:1px solid #555d6c;border-radius:6px;background:#252a34;color:#fff;';
  var emptyOption = document.createElement('option'); emptyOption.value = ''; emptyOption.textContent = 'Sem arma selecionada (usar configuração manual)'; weaponSelect.appendChild(emptyOption);
  playerWeaponCatalog().forEach(function (item) {
    var option = document.createElement('option'); option.value = item.id;
    option.textContent = item.n + ' — ' + item.dano + (item.uso ? ' · ' + item.uso.replace('Arma de ataque ','') : '');
    weaponSelect.appendChild(option);
  });
  weaponSelect.value = profile.weaponId || '';
  inputs.weaponId = weaponSelect; weaponLabel.appendChild(weaponSelect); form.appendChild(weaponLabel);
  var weaponModeLabel = document.createElement('label');
  weaponModeLabel.style.cssText = 'grid-column:1/-1;display:flex;flex-direction:column;gap:4px;color:#d5d9e2;font-size:12px;';
  var weaponModeCaption = document.createElement('span'); weaponModeCaption.textContent = 'Armas com propriedade Arremesso'; weaponModeLabel.appendChild(weaponModeCaption);
  var weaponModeSelect = document.createElement('select'); weaponModeSelect.style.cssText = 'width:100%;padding:8px;border:1px solid #555d6c;border-radius:6px;background:#252a34;color:#fff;';
  [{value:'melee',label:'Usar corpo a corpo'},{value:'thrown',label:'Arremessar (usar alcance de arremesso)'}].forEach(function (entry) {
    var option = document.createElement('option'); option.value = entry.value; option.textContent = entry.label; weaponModeSelect.appendChild(option);
  });
  weaponModeSelect.value = profile.weaponMode || 'melee';
  inputs.weaponMode = weaponModeSelect; weaponModeLabel.appendChild(weaponModeSelect); form.appendChild(weaponModeLabel);
  addField('Alcance personalizado (quadrículas; 0 = automático)','attackRange','number',Number(profile.attackRange) || 0);
  addField('Dano personalizado (vazio = automático)','damageOverride','text',profile.damageOverride || '');
  weaponSelect.addEventListener('change', function () {
    var item = playerWeaponById(weaponSelect.value);
    if (!item) return;
    var selectedProfile = Object.assign({}, profile, { weaponId: item.id, weaponMode: weaponModeSelect.value, attackRange: 0, damageOverride: '' });
    var resolved = resolvePlayerAttackData(player, selectedProfile);
    inputs.attackRange.value = '';
    inputs.damageOverride.value = '';
    var preview = dlg.panel.querySelector('#mp-weapon-preview');
    if (!preview) { preview = document.createElement('p'); preview.id = 'mp-weapon-preview'; preview.style.cssText = 'grid-column:1/-1;margin:0;color:#aebdcb;font-size:11px;'; form.appendChild(preview); }
    preview.textContent = 'Cálculo da arma: ataque ' + signed(resolved.bonus) + ', dano ' + resolved.damage + ', alcance normal ' + resolved.normalRange + ' e máximo ' + resolved.maxRange + ' quadrículas.';
  });
  weaponModeSelect.addEventListener('change', function () { weaponSelect.dispatchEvent(new Event('change')); });
  var note = document.createElement('p');
  note.style.cssText = 'grid-column:1/-1;margin:0;color:#aeb5c0;font-size:11px;line-height:1.4;';
  note.textContent = 'As ações usam a área iluminada/visível ao redor do personagem e respeitam paredes e linha de visão. Ataque faz uma rolagem para cada criatura visível no alcance.';
  form.appendChild(note);
  dlg.panel.appendChild(form);
  if (weaponSelect.value) weaponSelect.dispatchEvent(new Event('change'));
  var actions = document.createElement('div'); actions.className = 'mp-portal-dialog-actions';
  var cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = 'Cancelar'; cancel.onclick = function () { closePortalDialog(dlg.overlay); };
  var saveBtn = document.createElement('button'); saveBtn.type = 'button'; saveBtn.className = 'primary'; saveBtn.textContent = 'Salvar';
  saveBtn.onclick = function () {
    profile.useSheet = true;
    if (!sheet) {
      ['attack','tools'].forEach(function (key) {
        if (inputs[key]) profile[key] = Math.max(-20, Math.min(30, Math.round(Number(inputs[key].value) || 0)));
      });
      Object.keys(RPG_SKILL_ABILITIES).forEach(function (skill) {
        var key = 'skillBonus_' + skill;
        if (!inputs[key]) return;
        var value = Math.max(-20, Math.min(30, Math.round(Number(inputs[key].value) || 0)));
        profile.skillBonuses[skill] = value;
        if (skill === 'Percepção') profile.perception = value;
        else if (skill === 'Investigação') profile.investigation = value;
        else if (skill === 'Atletismo') profile.athletics = value;
      });
    }
    profile.weaponId = String(inputs.weaponId.value || '');
    profile.weaponMode = String(inputs.weaponMode.value || 'melee');
    profile.attackRange = Math.max(0, Math.min(120, Math.round(Number(inputs.attackRange.value) || 0)));
    profile.damageOverride = String(inputs.damageOverride.value || '').trim();
    if (profile.damageOverride && !rollDamageExpression(profile.damageOverride, false)) {
      appAlertMessage('msg014', 'Informe um dano válido, como 1d8+3 ou 2d6.'); return;
    }
    save(); closePortalDialog(dlg.overlay); draw();
  };
  actions.appendChild(cancel); actions.appendChild(saveBtn); dlg.panel.appendChild(actions);
}
function signed(value) { var n = Number(value) || 0; return (n >= 0 ? '+' : '') + n; }
function runPlayerPerception(player, profile, range) {
  var check = rollCheck(profile.perception), found = [], edges = visibleEdgesForPlayer(player, range);
  edges.forEach(function (item) {
    if (item.val !== EDGE_SECRET_WALL && item.val !== EDGE_SECRET_DOOR_C && item.val !== EDGE_SECRET_DOOR_O) return;
    var meta = getEdgeMeta(item.edge);
    if (!meta || meta.detected) return;
    var dc = Number(meta.dcDetection || 15);
    if (check.total >= dc) {
      meta.detected = true;
      found.push((meta.kind === 'secretDoor' || item.val === EDGE_SECRET_DOOR_C || item.val === EDGE_SECRET_DOOR_O ? 'Porta secreta' : 'Parede secreta') + ' descoberta (CD ' + dc + ').');
    }
  });
  var lines = ['Percepção: 1d20 (' + check.die + ') + ' + check.bonus + ' = ' + check.total + '.'];
  if (found.length) lines = lines.concat(found);
  else lines.push(isHexMap() ? 'Nenhuma estrutura secreta deste tipo está cadastrada neste mapa.' : 'Nenhum segredo com CD igual ou inferior ao resultado foi encontrado na área visível.');
  save(); draw(); playerActionResult('👁 Percepção', lines);
}
function runPlayerInvestigation(player, profile, range) {
  var check = rollCheck(profile.investigation), found = [], edges = visibleEdgesForPlayer(player, range);
  edges.forEach(function (item) {
    var meta = getEdgeMeta(item.edge);
    if (!meta) return;
    if (item.val === EDGE_ILLUSION_WALL && !meta.detected) {
      var illusionDc = Number(meta.dcDetection || 15);
      if (check.total >= illusionDc) {
        meta.detected = true;
        found.push('Parede ilusória identificada (CD ' + illusionDc + '); ela não bloqueia a passagem.');
      }
    } else if ((item.val === EDGE_SECRET_WALL || item.val === EDGE_SECRET_DOOR_C || item.val === EDGE_SECRET_DOOR_O) && meta.detected && !meta.mechanismKnown) {
      var mechanismDc = Number(meta.dcMechanism || 15);
      if (check.total >= mechanismDc) {
        meta.mechanismKnown = true;
        found.push('Mecanismo descoberto (CD ' + mechanismDc + ').' + (meta.mechanismHint ? ' Como acionar: ' + meta.mechanismHint : ''));
      }
    }
  });
  var lines = ['Investigação: 1d20 (' + check.die + ') + ' + check.bonus + ' = ' + check.total + '.'];
  if (found.length) lines = lines.concat(found);
  else lines.push('Nenhuma ilusão ou mecanismo detectado pôde ser identificado na área visível.');
  save(); draw(); playerActionResult('🔎 Investigação', lines);
}
function tokenDistanceInCells(target, player) {
  var size = Math.max(1, Number(target && target.raio) || 1);
  var tx = target.x + (size - 1) / 2;
  var ty = target.y + (size - 1) / 2;
  if (isHexMap()) return hexDistance({ x: player.x, y: player.y }, { x: Math.round(tx), y: Math.round(ty) });
  var dx = tx - player.x, dy = ty - player.y;
  return Math.sqrt(dx * dx + dy * dy);
}
function tokenInPlayerVision(target, player, range) {
  if (!target || target === player || target.tipo === 'player') return false;
  var size = Math.max(1, Number(target.raio) || 1);
  var tx = Math.round(target.x + (size - 1) / 2);
  var ty = Math.round(target.y + (size - 1) / 2);
  if (tokenDistanceInCells(target, player) > range + 0.01) return false;
  if (isHexMap()) return hasLOS(player.x, player.y, tx, ty);
  return isCurrentlyVisible(tx, ty, player.x, player.y, range) && hasLOS(player.x, player.y, tx, ty);
}
function isAttackableNpc(token) {
  return !!(token && token.tipo !== 'player' && (token.monsterId || token.tipo === 'npc' || token.tipo === 'enemy'));
}
function monsterStatsForToken(token) {
  if (!token || !token.monsterId || !window.MONSTERS) return null;
  return (window.MONSTERS || []).find(function (monster) { return monster.id === token.monsterId; }) || null;
}
function rollAttackCheck(bonus, disadvantage) {
  var first = rollDie(20), second = disadvantage ? rollDie(20) : null;
  var die = disadvantage ? Math.min(first, second) : first;
  return { die: die, dice: disadvantage ? [first, second] : [first], bonus: Number(bonus) || 0, total: die + (Number(bonus) || 0), disadvantage: !!disadvantage };
}
function runPlayerAttack(player, profile, visionRange) {
  var attackData = resolvePlayerAttackData(player, profile);
  if (!attackData.weapon && !profile.damageOverride) {
    configurePlayerActionProfile(player);
    return;
  }
  var range = Math.max(1, Math.min(Number(attackData.maxRange) || 1, Number(visionRange) || 1));
  var targets = state.tokens.filter(function (token) {
    return isAttackableNpc(token) && tokenInPlayerVision(token, player, range);
  });
  var lines = [];
  if (!targets.length) {
    playerActionResult('⚔ Ataque', ['Nenhuma criatura inimiga está dentro do alcance e da linha de visão (' + range + ' quadrículas).']);
    return;
  }
  targets.forEach(function (target) {
    var monster = monsterStatsForToken(target);
    var ac = Number(target.classeArmadura || target.ca || (monster && monster.classeArmadura) || 10);
    var distance = tokenDistanceInCells(target, player);
    var longRange = distance > attackData.normalRange + 0.01;
    var check = rollAttackCheck(attackData.bonus, longRange);
    var hit = check.die === 20 || (check.die !== 1 && check.total >= ac);
    var rollText = '1d20 (' + check.dice.join(' e ') + (check.disadvantage ? ', desvantagem: menor' : '') + ') + ' + check.bonus + ' = ' + check.total;
    if (!hit) {
      lines.push((target.nome || 'Criatura') + ': ' + rollText + ' contra CA ' + ac + ' — errou.');
      return;
    }
    var critical = check.die === 20;
    var damage = rollDamageExpression(attackData.damage, critical);
    if (!damage) {
      lines.push((target.nome || 'Criatura') + ': acertou, mas a expressão de dano configurada é inválida.');
      return;
    }
    if (target.hpMax == null && monster && Number(monster.pontosVida) > 0) {
      target.hpMax = Number(monster.pontosVida); target.hp = target.hp == null ? target.hpMax : target.hp;
    }
    var hpText = '';
    if (target.hpMax != null) {
      target.hp = Math.max(0, Number(target.hp == null ? target.hpMax : target.hp) - damage.total);
      hpText = ' PV: ' + target.hp + '/' + target.hpMax + (target.hp <= 0 ? ' — derrotado.' : '.');
    } else hpText = ' Dano rolado; este token não possui PV cadastrados.';
    lines.push((target.nome || 'Criatura') + ': ' + rollText + ' contra CA ' + ac + ' — acertou; dano ' + damage.formula + ' (' + damage.rolls.join(' + ') + (critical ? ', crítico: dados dobrados' : '') + ') = ' + damage.total + '.' + hpText);
  });
  save(); draw();
  playerActionResult('⚔ Ataque automático na área visível' + (attackData.weapon ? ' — ' + attackData.weapon.n : ''), lines);
}
function runPlayerDoorCheck(player, profile, range, useTools) {
  // Forçar ou destrancar exige proximidade física: procura portas adjacentes visíveis,
  // sem exigir que o jogador clique em cada uma.
  var edges = visibleEdgesForPlayer(player, Math.min(1.5, range)), relevant = edges.filter(function (item) {
    return useTools ? item.val === EDGE_LOCKED_DOOR : (item.val === EDGE_LOCKED_DOOR || item.val === EDGE_JAMMED_DOOR);
  });
  var label = useTools ? 'Ferramentas de Ladrão' : 'Atletismo';
  var check = rollCheck(useTools ? profile.tools : profile.athletics);
  var lines = [label + ': 1d20 (' + check.die + ') + ' + check.bonus + ' = ' + check.total + '.'];
  if (!relevant.length) lines.push('Nenhuma porta compatível com esta ação está adjacente e visível.');
  relevant.forEach(function (item) {
    var meta = ensureEdgeStructureMeta(item.edge);
    var dc = useTools ? Number(meta.lockDC || 15) : Number(meta.dcForce || 18);
    if (meta.arcaneLock) dc += 10;
    if (meta.barred && !useTools) {
      lines.push('Porta barrada por dentro: é necessário alcançar a barra pelo lado correto; o teste de Atletismo não a abre automaticamente.');
      return;
    }
    if (check.die === 20 || (check.die !== 1 && check.total >= dc)) {
      meta.open = true;
      if (!meta.arcaneLock) meta.locked = false;
      lines.push(edgeActionLabel(item.val, meta) + ': sucesso contra CD ' + dc + '; porta aberta.');
    } else lines.push(edgeActionLabel(item.val, meta) + ': falha contra CD ' + dc + '; continua fechada.');
  });
  save(); draw(); playerActionResult(useTools ? '🗝 Ferramentas de Ladrão' : '💪 Atletismo', lines);
}
function runPlayerSkill(player, profile) {
  var selector = R && R.querySelector('#mp-player-skill');
  var skill = selector ? selector.value : 'Percepção';
  var sheet = getCharacterSheetActionData();
  var ability = RPG_SKILL_ABILITIES[skill] || 'SAB';
  var bonus = sheet && sheet.skillBonuses[skill] != null ? sheet.skillBonuses[skill] : 0;
  if (!sheet) {
    if (profile.skillBonuses && profile.skillBonuses[skill] != null) bonus = Number(profile.skillBonuses[skill]) || 0;
    else if (skill === 'Percepção') bonus = Number(profile.perception) || 0;
    else if (skill === 'Investigação') bonus = Number(profile.investigation) || 0;
    else if (skill === 'Atletismo') bonus = Number(profile.athletics) || 0;
  }
  var check = rollCheck(bonus);
  playerActionResult('🎲 ' + skill, [skill + ' (' + ability + '): 1d20 (' + check.die + ') + ' + signed(check.bonus) + ' = ' + check.total + '.', 'O teste foi rolado automaticamente.']);
}
function runPlayerInteract(player, range) {
  var edges = visibleEdgesForPlayer(player, Math.min(1.5, range)), changed = [], lines = [];
  edges.forEach(function (item) {
    var val = item.val, meta = getEdgeMeta(item.edge);
    if ((val === EDGE_SECRET_WALL || val === EDGE_SECRET_DOOR_C || val === EDGE_SECRET_DOOR_O) && meta && meta.detected && meta.mechanismKnown) {
      if (val === EDGE_SECRET_WALL) {
        meta.open = !meta.open;
        changed.push(meta.open ? 'Passagem secreta aberta.' : 'Passagem secreta fechada.');
      } else {
        var open = val !== EDGE_SECRET_DOOR_O;
        setEdgeVal(item.edge, open ? EDGE_SECRET_DOOR_O : EDGE_SECRET_DOOR_C);
        setEdgeMeta(item.edge, meta);
        changed.push(open ? 'Porta secreta aberta.' : 'Porta secreta fechada.');
      }
    }
  });
  lines.push(changed.length ? changed.join(' ') : 'Nenhum mecanismo secreto descoberto está ao alcance imediato.');
  save(); draw(); playerActionResult('✋ Interagir', lines);
}
function runPlayerAction(action) {
  if (appMode !== 'player') return;
  var player = currentPlayer();
  if (!player || player.tipo !== 'player') {
    playerActionResult('Ações do personagem', ['Não há um personagem jogador neste mapa.']); return;
  }
  var profile = playerActionProfile(player), range = playerVisionRadius(player);
  if (action === 'perception') runPlayerPerception(player, profile, range);
  else if (action === 'investigation') runPlayerInvestigation(player, profile, range);
  else if (action === 'attack') runPlayerAttack(player, profile, range);
  else if (action === 'athletics') runPlayerDoorCheck(player, profile, range, false);
  else if (action === 'tools') runPlayerDoorCheck(player, profile, range, true);
  else if (action === 'interact') runPlayerInteract(player, range);
  else if (action === 'skill') runPlayerSkill(player, profile);
}


function updateModeUi() {
  if (!R) return;
  var root = R.querySelector('#mp-root');
  if (root) {
    root.classList.toggle('player-mode', appMode === 'player');
    root.classList.toggle('editor-mode', appMode === 'editor');
  }
  // A barra de ferramentas e todos os controles de edição devem sumir no Jogador.
  // O estilo inline com !important evita que regras de layout do grid reexibam a barra.
  var editorOnlyNodes = R.querySelectorAll('.mp-editor-only');
  editorOnlyNodes.forEach(function (node) {
    if (appMode === 'player') {
      node.style.setProperty('display', 'none', 'important');
      node.setAttribute('aria-hidden', 'true');
      node.setAttribute('inert', '');
    } else {
      node.style.removeProperty('display');
      node.removeAttribute('aria-hidden');
      node.removeAttribute('inert');
    }
  });
  var actionTray = R.querySelector('#mp-player-actions');
  if (actionTray) actionTray.style.display = appMode === 'player' ? 'block' : 'none';
  var playerButton = R.querySelector('#mp-mode-player');
  var editorButton = R.querySelector('#mp-mode-editor');
  if (playerButton) playerButton.classList.toggle('active', appMode === 'player');
  if (editorButton) editorButton.classList.toggle('active', appMode === 'editor');
  var gridButton = R.querySelector('#mp-grid');
  var fogButton = R.querySelector('#mp-fog');
  var lightButton = R.querySelector('#mp-light');
  var wallsButton = R.querySelector('#mp-walls-vis');
  var secretsButton = R.querySelector('#mp-secret-view');
  if (gridButton) gridButton.classList.toggle('on', showGrid);
  if (fogButton) fogButton.classList.toggle('on', showFog);
  if (lightButton) lightButton.classList.toggle('on', dynLight);
  if (wallsButton) wallsButton.classList.toggle('on', showWalls);
  if (secretsButton) secretsButton.classList.toggle('on', showSecrets);
  var block = R.querySelector('#mp-block');
  if (block) block.checked = blockMove;
  var radius = R.querySelector('#mp-lr');
  if (radius) radius.value = lightRadius;
}

function setMode(nextMode) {
  appMode = nextMode === 'editor' ? 'editor' : 'player';
  // Presets de visão pedidos: Jogador sem grade/segredos; Editor com visão completa.
  showGrid = appMode === 'editor';
  showSecrets = appMode === 'editor';
  showFog = true;
  dynLight = true;
  showWalls = true;
  blockMove = true;
  pendingStructureStart = null;
  pendingLocalPortal = null;
  pendingMonster = null;
  measurePts = null;
  selected = null;
  if (appMode === 'player') {
    stopKeyMove();
    stopWorldTravel(false);
  }
  if (R) {
    setTool('select');
    updateModeUi();
    draw();
  }
}

function menuIsOpen() {
  var d = R && R.querySelector('#mp-drawer');
  return !!(d && d.classList.contains('open'));
}

function setMenu(open) {
  if (!R) return;
  var d = R.querySelector('#mp-drawer'), b = R.querySelector('#mp-burger');
  if (!d || !b) return;
  d.classList.toggle('open', open);
  b.classList.toggle('open', open);
  b.setAttribute('aria-expanded', open ? 'true' : 'false');
  b.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  d.setAttribute('aria-hidden', open ? 'false' : 'true');
}

var mountRequestId = 0;
function mount(el) {
  var requestId = ++mountRequestId;
  if (el) el.innerHTML = '<div class="empty-state" style="padding:24px">Carregando mapas e dados salvos…</div>';
  loadRepositoryMapCatalog(function () {
    if (requestId !== mountRequestId) return;
    var desiredMap = preferredMapId;
    try { desiredMap = localStorage.getItem(MAP_ID_KEY) || preferredMapId; } catch (e) {}
    applyMap(MAPS[desiredMap] ? desiredMap : 'tumba');
    state = migrateFlanaessState(load() || defaultState());
    loadRepositoryMapState(function () {
      if (requestId !== mountRequestId) return;
      mountNow(el);
    });
  });
}


function closeMessageEditor(overlay) {
  if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
}
function openMessageEditor() {
  if (!R) return;
  var root = R.querySelector('#mp-root');
  if (!root || root.querySelector('.mp-message-editor-overlay')) return;
  var overlay = document.createElement('div');
  overlay.className = 'mp-message-editor-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Personalizar mensagens');
  var panel = document.createElement('div');
  panel.className = 'mp-message-editor';
  var heading = document.createElement('div');
  heading.className = 'mp-message-editor-heading';
  heading.innerHTML = '<div><h3>Personalizar mensagens</h3><p>Edite os avisos, confirmações e perguntas do mapa. Deixe o campo vazio para remover o texto da mensagem. Confirmações e perguntas continuam exibindo os botões/campo necessários.</p><p>Em mensagens variáveis, use <code>{mensagem}</code> para inserir o texto original com os valores calculados.</p></div><button type="button" class="mp-message-close" aria-label="Fechar">×</button>';
  var filters = document.createElement('div');
  filters.className = 'mp-message-filters';
  filters.innerHTML = '<input type="search" id="mp-message-search" placeholder="Buscar mensagem…"><select id="mp-message-type"><option value="all">Todos os tipos</option><option value="alert">Avisos</option><option value="confirm">Confirmações</option><option value="prompt">Perguntas / entradas</option></select><span id="mp-message-count"></span>';
  var list = document.createElement('div');
  list.className = 'mp-message-list';
  list.id = 'mp-message-list';
  MESSAGE_CATALOG.forEach(function (entry, index) {
    var item = document.createElement('div');
    item.className = 'mp-message-item';
    item.setAttribute('data-message-item', entry.id);
    var label = document.createElement('label');
    label.setAttribute('for', 'mp-message-' + entry.id);
    var typeName = entry.type === 'alert' ? 'Aviso' : entry.type === 'confirm' ? 'Confirmação' : 'Pergunta / entrada';
    label.textContent = (index + 1) + '. ' + typeName + ' · ' + (entry.dynamic ? 'Mensagem variável' : (entry.pattern || 'Mensagem'));
    var area = document.createElement('textarea');
    area.id = 'mp-message-' + entry.id;
    area.setAttribute('data-message-id', entry.id);
    area.rows = 2;
    area.value = Object.prototype.hasOwnProperty.call(MESSAGE_OVERRIDES, entry.id)
      ? String(MESSAGE_OVERRIDES[entry.id] == null ? '' : MESSAGE_OVERRIDES[entry.id])
      : entry.default;
    var hint = document.createElement('small');
    hint.textContent = entry.dynamic
      ? 'Texto padrão variável: ' + (entry.pattern || 'definido pelo contexto')
      : 'Texto padrão';
    item.appendChild(label);
    item.appendChild(area);
    item.appendChild(hint);
    list.appendChild(item);
  });
  var footer = document.createElement('div');
  footer.className = 'mp-message-editor-footer';
  footer.innerHTML = '<button type="button" id="mp-message-reset" class="secondary">Restaurar padrões</button><span></span><button type="button" id="mp-message-cancel" class="secondary">Cancelar</button><button type="button" id="mp-message-save" class="primary">Salvar mensagens</button>';
  panel.appendChild(heading);
  panel.appendChild(filters);
  panel.appendChild(list);
  panel.appendChild(footer);
  overlay.appendChild(panel);
  root.appendChild(overlay);

  function applyMessageFilter() {
    var q = String(filters.querySelector('#mp-message-search').value || '').toLocaleLowerCase();
    var type = filters.querySelector('#mp-message-type').value;
    var shown = 0;
    Array.prototype.forEach.call(list.querySelectorAll('[data-message-item]'), function (item) {
      var id = item.getAttribute('data-message-item');
      var entry = MESSAGE_CATALOG.find(function (candidate) { return candidate.id === id; });
      var area = item.querySelector('textarea');
      var text = (item.textContent + ' ' + (area ? area.value : '')).toLocaleLowerCase();
      var visible = (!q || text.indexOf(q) >= 0) && (type === 'all' || (entry && entry.type === type));
      item.style.display = visible ? '' : 'none';
      if (visible) shown++;
    });
    filters.querySelector('#mp-message-count').textContent = shown + ' de ' + MESSAGE_CATALOG.length + ' mensagens';
  }
  filters.querySelector('#mp-message-search').addEventListener('input', applyMessageFilter);
  filters.querySelector('#mp-message-type').addEventListener('change', applyMessageFilter);
  list.addEventListener('input', function (event) {
    if (event.target && event.target.matches('textarea[data-message-id]')) applyMessageFilter();
  });
  heading.querySelector('.mp-message-close').onclick = function () { closeMessageEditor(overlay); };
  footer.querySelector('#mp-message-cancel').onclick = function () { closeMessageEditor(overlay); };
  footer.querySelector('#mp-message-reset').onclick = function () {
    if (!appConfirmMessage('msg092', 'Restaurar os textos originais de todas as mensagens?')) return;
    MESSAGE_OVERRIDES = {};
    try { localStorage.removeItem(MESSAGE_SETTINGS_KEY); } catch (e) {}
    closeMessageEditor(overlay);
  };
  footer.querySelector('#mp-message-save').onclick = function () {
    var next = {};
    Array.prototype.forEach.call(list.querySelectorAll('textarea[data-message-id]'), function (area) {
      next[area.getAttribute('data-message-id')] = area.value;
    });
    MESSAGE_OVERRIDES = next;
    try {
      localStorage.setItem(MESSAGE_SETTINGS_KEY, JSON.stringify(MESSAGE_OVERRIDES));
    } catch (e) {
      appAlertMessage('msg093', 'Não foi possível salvar as mensagens neste navegador.');
    }
    closeMessageEditor(overlay);
  };
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) closeMessageEditor(overlay);
  });
  applyMessageFilter();
  var search = filters.querySelector('#mp-message-search');
  if (search) search.focus();
}

function mountNow(el) {
  R = el;
  R.innerHTML =
    '<div class="mp vtt" id="mp-root">' +
    '<div class="mp-wrap vtt-wrap">' +
    '<div class="mp-main">' +
    '<canvas id="mp-cv"></canvas>' +
    '<button type="button" id="mp-burger" class="mp-burger" title="Menu" aria-label="Abrir menu" aria-expanded="false" aria-controls="mp-drawer"><span></span><span></span><span></span></button>' +
    '<div class="mp-mode-switch" role="group" aria-label="Modo do mapa"><button type="button" id="mp-mode-player" class="active" title="Modo Jogador: sem ferramentas de edição">♟ Jogador</button><button type="button" id="mp-mode-editor" title="Modo Editor: liberar ferramentas e câmera livre">✎ Editor</button></div>' +
    '<div id="mp-drawer" class="mp-drawer" aria-hidden="true">' +
    '<section id="mp-player-actions" class="mp-player-actions" aria-label="Ações do personagem">' +
    '<div class="mp-player-actions-head"><strong>🎲 Ações do personagem</strong><button type="button" id="mp-action-config" title="Configurar bônus e dano">⚙</button></div>' +
    '<div class="mp-player-actions-buttons">' +
    '<button type="button" data-player-action="perception">👁 Percepção</button>' +
    '<button type="button" data-player-action="investigation">🔎 Investigação</button>' +
    '<button type="button" data-player-action="attack">⚔ Ataque</button>' +
    '<button type="button" data-player-action="athletics">💪 Atletismo</button>' +
    '<button type="button" data-player-action="tools">🗝 Ferramentas</button>' +
    '<button type="button" data-player-action="interact">✋ Interagir</button>' +
    '</div><div class="mp-player-skill-row"><select id="mp-player-skill" aria-label="Escolher perícia">' + playerSkillOptionsHtml() + '</select><button type="button" data-player-action="skill">🎲 Rolar perícia</button></div>' +
    '<small>Percepção, Investigação e ações de interação verificam automaticamente os objetos na visão. Ataque aplica rolagens e dano às criaturas visíveis no alcance.</small></section>' +
    '<div class="mp-bar">' +
    '<div class="mp-map-selector"><select id="mp-map" class="mp-title" title="Trocar de mapa">' + mapOptions() + '</select>' +
    '<button type="button" id="mp-add-map" class="mp-map-add" title="Adicionar mapa" aria-label="Adicionar mapa">＋</button></div>' +
    '<input type="file" id="mp-add-map-file" accept="image/*" style="display:none">' +
    '<button type="button" id="mp-export" title="Baixar os dados deste mapa em JSON">⬇ Salvar mapa</button>' +
    '<button type="button" id="mp-export-catalog" title="Baixar o catálogo para publicar os mapas adicionados">🗂 Baixar catálogo de mapas</button>' +
    '<label id="mp-hex-wrap" class="mp-luz" style="display:none">Hexágono <select id="mp-hex-size" disabled><option value="small" selected>Pequeno · 6 mi</option></select></label>' +
    '<label id="mp-speed-wrap" class="mp-luz" style="display:none">Velocidade <input id="mp-speed" type="number" min="0.1" step="0.1" placeholder="mi/dia" style="width:62px"></label>' +
    '<button type="button" id="mp-world-move" class="mp-world-action active" title="Desativa os modos de início e teleporte; use as setas ou clique para mover o personagem">🧭 Desativar ferramentas</button>' +
    '<button type="button" id="mp-world-spawn" class="mp-world-action" title="Definir o ponto de início deste mapa">📍 Definir início</button>' +
    '<button type="button" id="mp-world-portal" class="mp-world-action" title="No modo Editor: adicionar um teleporte para outro mapa">🌀 Teleporte para outro mapa</button>' +
    '<button type="button" id="mp-world-local-portal" class="mp-world-action" title="No modo Editor: clique no ponto A e depois no ponto B para criar um teleporte dentro deste mapa">🌀 Teleporte neste mapa</button>' +
    '<div class="mp-g" id="mp-tools">' +
    '<button data-t="wall" title="Posicionar parede em uma quadrícula">🧱 Parede</button>' +
    '<button data-t="muro" title="Desenhar muro: clique em um canto e depois em outro">─ Muro</button>' +
    '<button data-t="porta" title="Desenhar porta: clique em um canto e depois em outro">🚪 Porta</button>' +
    '<button data-t="editStructure" title="Clique em uma parede, muro ou porta para editar somente aquela estrutura">⚙ Editar</button>' +
    '</div>' +
    '<button id="mp-grid" title="Grid (G)">Grid</button>' +
    '<button id="mp-fog" title="Névoa (F)">Névoa</button>' +
    '<button id="mp-light" title="Luz dinâmica (L)">Luz</button>' +
    '<button id="mp-walls-vis" title="Mostrar paredes/muros (W)">Ver muros</button>' +
    '<button id="mp-secret-view" title="Alternar a visão do Mestre para estruturas secretas ainda não descobertas">👁 Segredos (Mestre)</button>' +
    '<label class="mp-luz"><input id="mp-block" type="checkbox" checked> Bloquear movimento</label>' +
    '<label class="mp-luz">Raio <input id="mp-lr" type="number" min="0" max="20" value="6" style="width:44px"></label>' +
    '<button id="mp-reset-fog" title="Cobrir novamente todas as áreas do mapa">Reset Névoa</button>' +
    '<button id="mp-clear-fog" title="Remover a névoa de todo o mapa (pede confirmação)">Revelar Tudo</button>' +
    '<button id="mp-clear-walls" title="Remover todas as paredes (pede confirmação)">Limpar paredes</button>' +
    '<button id="mp-clear-edges" title="Remover todos os muros e portas das linhas (pede confirmação)">Limpar muros/portas</button>' +
    '<button id="mp-zo">−</button><button id="mp-zi">+</button>' +
    '</div>' +
    '<aside class="mp-side" id="mp-side">' +
    '<h4>Bestiário</h4>' +
    '<input id="mp-q" type="search" placeholder="Buscar monstro…" style="width:100%;margin-bottom:6px">' +
    '<div id="mp-ml" class="mp-ml"></div>' +
    '<h4 style="margin-top:12px">Token selecionado</h4>' +
    '<div id="mp-detail" class="mp-detail"><div class="mp-detail-empty">Selecione um token.</div></div>' +
    '<small style="display:block;margin-top:10px;color:var(--mute)">' +
    (isHexMap() ? '<b>Parede</b> = hexágono bloqueado.<br><b>Flanaess</b> usa deslocamento e medição em hexágonos; muros e portas lineares ficam desativados.' : '<b>Parede</b> = quadrícula bloqueada.<br><b>Segredos:</b> Percepção passiva/Busca ativa encontra; Investigação descobre o mecanismo.<br><b>Trancadas:</b> Ferramentas de Ladrão; <b>emperradas:</b> Atletismo.<br><b>Estruturas:</b> Atacar estrutura usa CA, PV e limiar de dano. Ilusões não bloqueiam; Muralha de Energia só cai com Desintegrar.') + '</small>' +
    '</aside>' +
    '<div class="mp-menu-footer"><button type="button" id="mp-delete-map" class="mp-delete-map" title="Excluir somente mapas adicionados pelo botão +">🗑 Excluir mapa</button></div>' +
    '</div>' + // fim do menu lateral (drawer)
    '</div></div></div>';

  var menuStyle = document.createElement('style');
  menuStyle.textContent =
    '#mp-root{flex:1 1 0;min-height:0;}' +
    '#mp-root .mp-wrap{display:block !important;position:relative !important;flex:1 1 0 !important;height:auto !important;min-height:0 !important;}' +
    '#mp-root .mp-main{display:block !important;position:absolute !important;top:0 !important;right:0 !important;bottom:0 !important;left:0 !important;width:auto !important;height:auto !important;min-width:0 !important;min-height:0 !important;overflow:hidden;}' +
    '#mp-root #mp-cv{display:block;width:100%;height:100%;}' +
    '#mp-root .mp-burger{position:absolute;top:10px;left:10px;z-index:30;width:44px;height:44px;padding:0;border-radius:10px;' +
      'border:1px solid rgba(255,255,255,.28);background:rgba(15,15,18,.82);cursor:pointer;display:flex;flex-direction:column;' +
      'justify-content:center;align-items:center;gap:5px;}' +
    '#mp-root .mp-burger:hover{background:rgba(40,40,46,.92);}' +
    '#mp-root .mp-mode-switch{position:absolute;top:10px;right:10px;z-index:35;display:flex;gap:5px;padding:4px;border:1px solid rgba(255,255,255,.2);border-radius:11px;background:rgba(15,15,18,.88);backdrop-filter:blur(8px);}' +
    '#mp-root .mp-mode-switch button{min-height:34px;padding:7px 11px;border:1px solid transparent;border-radius:7px;background:transparent;color:#e8eaf0;font-weight:600;cursor:pointer;}' +
    '#mp-root .mp-mode-switch button.active{background:rgba(55,145,190,.38);border-color:#66c8ed;color:#fff;}' +
    '#mp-root .mp-player-actions{position:static;width:auto;box-sizing:border-box;margin:0 0 14px;padding:10px;border:1px solid rgba(255,255,255,.2);border-radius:11px;background:rgba(255,255,255,.04);color:#f3f6fb;}' +
    '#mp-root .mp-player-actions-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px;font-size:13px;}' +
    '#mp-root .mp-player-actions-head button{width:30px;height:28px;border:1px solid rgba(255,255,255,.2);border-radius:6px;background:#30343e;color:#fff;cursor:pointer;}' +
    '#mp-root .mp-player-actions-buttons{display:flex;flex-wrap:wrap;gap:6px;}' +
    '#mp-root .mp-player-actions-buttons button{flex:1 1 calc(50% - 6px);min-width:0;min-height:34px;padding:7px 9px;border:1px solid rgba(100,180,220,.35);border-radius:7px;background:rgba(38,92,125,.28);color:#eef8ff;font-size:12px;font-weight:600;cursor:pointer;}' +
    '#mp-root .mp-player-actions-buttons button:hover{background:rgba(48,125,165,.48);}' +
    '#mp-root .mp-player-actions small{display:block;margin-top:7px;color:#aab5c4;font-size:10px;line-height:1.35;}' +
    '#mp-root .mp-player-skill-row{display:flex;gap:6px;margin-top:7px;}' +
    '#mp-root .mp-player-skill-row select{flex:1;min-width:0;padding:7px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:#252a34;color:#eef8ff;font-size:12px;}' +
    '#mp-root .mp-player-skill-row button{padding:7px 10px;border:1px solid rgba(100,180,220,.35);border-radius:7px;background:rgba(38,92,125,.28);color:#eef8ff;font-size:12px;font-weight:600;cursor:pointer;}' +
    '#mp-root.editor-mode .mp-player-actions{display:none !important;}' +
    '#mp-root.player-mode .mp-editor-only{display:none !important;}' +
    '#mp-root.player-mode .mp-drawer .mp-g.mp-editor-only{display:none !important;}' +
    '#mp-root .mp-canvas-pan{cursor:grab;}' +
    '#mp-root .mp-map-selector{display:flex;align-items:stretch;gap:6px;width:100%;}' +
    '#mp-root .mp-map-selector select{flex:1 1 auto;min-width:0;width:auto !important;}' +
    '#mp-root .mp-map-selector .mp-map-add{flex:0 0 44px;width:44px !important;min-width:44px;height:42px;padding:0;font-size:24px;line-height:1;' +
      'border:1px solid rgba(255,255,255,.25);border-radius:8px;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;}' +
    '#mp-root .mp-map-selector .mp-map-add:hover{background:rgba(255,255,255,.17);}' +
    '#mp-root #mp-export,#mp-root #mp-export-catalog{width:100%;box-sizing:border-box;}' +
    '#mp-root .mp-burger span{display:block;width:22px;height:2px;border-radius:2px;background:#fff;transition:transform .2s,opacity .2s;}' +
    '#mp-root .mp-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}' +
    '#mp-root .mp-burger.open span:nth-child(2){opacity:0;}' +
    '#mp-root .mp-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}' +
    '#mp-root .mp-drawer{position:absolute;top:0;left:0;bottom:0;z-index:25;box-sizing:border-box;width:min(330px,88vw);' +
      'padding:64px 12px 16px;overflow-y:auto;background:rgba(14,14,17,.97);border-right:1px solid rgba(255,255,255,.14);' +
      'box-shadow:4px 0 18px rgba(0,0,0,.45);transform:translateX(-104%);visibility:hidden;' +
      'transition:transform .22s ease,visibility 0s linear .22s;}' +
    '#mp-root .mp-drawer.open{transform:none;visibility:visible;transition:transform .22s ease,visibility 0s;}' +
    '#mp-root .mp-drawer .mp-bar{display:flex !important;flex-direction:column !important;flex-wrap:nowrap !important;align-items:stretch !important;' +
      'gap:8px !important;position:static !important;width:auto !important;height:auto !important;margin:0 !important;padding:0 !important;' +
      'background:none !important;border:0 !important;}' +
    '#mp-root .mp-drawer .mp-bar > button,#mp-root .mp-drawer .mp-bar > select,#mp-root .mp-drawer .mp-bar > label{width:100%;box-sizing:border-box;}' +
    '#mp-root:not(.mp-world-map) .mp-drawer .mp-g{display:grid !important;grid-template-columns:1fr 1fr;gap:6px;}' +
    '#mp-root .mp-drawer .mp-g button{width:100%;box-sizing:border-box;}' +
    '#mp-root .mp-drawer .mp-side{position:static !important;width:auto !important;height:auto !important;max-height:none !important;' +
      'overflow:visible !important;margin:14px 0 0 !important;padding:12px 0 0 !important;border:0 !important;border-top:1px solid rgba(255,255,255,.14) !important;}' +
    '#mp-root .mp-menu-footer{margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,.14);}' +
    '#mp-root .mp-world-action{display:none;width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid rgba(90,210,235,.45);border-radius:8px;background:rgba(35,125,150,.18);color:#d9fbff;font-weight:600;cursor:pointer;}' +
    '#mp-root .mp-world-action:hover{background:rgba(35,155,180,.3);}' +
    '#mp-root .mp-world-action.active{background:rgba(35,155,180,.48);border-color:#55e6ff;}' +
    '#mp-root .mp-delete-map{display:block;width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid rgba(220,70,70,.65);border-radius:8px;' +
      'background:rgba(150,35,35,.2);color:#ffb6b6;font-weight:600;cursor:pointer;}' +
    '#mp-root .mp-delete-map:hover:not(:disabled){background:rgba(180,45,45,.38);}' +
    '#mp-root .mp-delete-map:disabled{opacity:.42;cursor:not-allowed;}' +
    '#mp-root .mp-portal-dialog-overlay{position:absolute;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;background:rgba(0,0,0,.72);}' +
    '#mp-root .mp-portal-dialog{width:min(340px,100%);box-sizing:border-box;padding:18px;border:1px solid rgba(255,255,255,.2);border-radius:12px;background:#17191f;color:#f4f5f7;box-shadow:0 12px 40px rgba(0,0,0,.55);}' +
    '#mp-root .mp-portal-dialog h3{margin:0 0 8px;font-size:17px;}' +
    '#mp-root .mp-portal-dialog p{margin:0 0 14px;color:#c5c9d2;font-size:13px;line-height:1.45;}' +
    '#mp-root .mp-portal-color-input{display:block;width:100%;height:48px;margin:4px 0 16px;padding:3px;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:#252832;cursor:pointer;}' +
    '#mp-root .mp-portal-dialog-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;}' +
    '#mp-root .mp-portal-dialog-actions-stack{flex-direction:column;}' +
    '#mp-root .mp-portal-dialog-actions button{min-height:38px;padding:8px 12px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:#30343e;color:#fff;cursor:pointer;}' +
    '#mp-root .mp-portal-dialog-actions button.primary{border-color:#3c9bc7;background:#17688f;}' +
    '#mp-root .mp-message-editor-overlay{position:absolute;inset:0;z-index:140;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;background:rgba(0,0,0,.78);}' +
    '#mp-root .mp-message-editor{display:flex;flex-direction:column;width:min(900px,96vw);max-height:92%;min-height:0;box-sizing:border-box;padding:16px;border:1px solid rgba(255,255,255,.2);border-radius:12px;background:#17191f;color:#f4f5f7;box-shadow:0 12px 40px rgba(0,0,0,.6);}' +
    '#mp-root .mp-message-editor-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}' +
    '#mp-root .mp-message-editor-heading h3{margin:0 0 6px;font-size:18px;}' +
    '#mp-root .mp-message-editor-heading p{margin:0 0 6px;color:#c5c9d2;font-size:12px;line-height:1.4;}' +
    '#mp-root .mp-message-close{flex:0 0 34px;width:34px;height:34px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:#30343e;color:#fff;font-size:22px;cursor:pointer;}' +
    '#mp-root .mp-message-filters{display:flex;gap:8px;align-items:center;margin:10px 0;}' +
    '#mp-root .mp-message-filters input{flex:1 1 auto;min-width:80px;}' +
    '#mp-root .mp-message-filters select{flex:0 0 190px;max-width:45%;}' +
    '#mp-root #mp-message-count{flex:0 0 auto;color:#aeb6c4;font-size:11px;white-space:nowrap;}' +
    '#mp-root .mp-message-list{flex:1 1 auto;min-height:0;overflow:auto;padding:2px 4px 2px 0;}' +
    '#mp-root .mp-message-item{display:flex;flex-direction:column;gap:4px;margin:0 0 10px;padding:9px;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:rgba(255,255,255,.035);}' +
    '#mp-root .mp-message-item label{font-size:12px;font-weight:600;color:#e4e8ef;line-height:1.35;}' +
    '#mp-root .mp-message-item textarea{width:100%;min-height:42px;max-height:110px;box-sizing:border-box;resize:vertical;padding:7px;border:1px solid rgba(255,255,255,.18);border-radius:6px;background:#242832;color:#fff;font:12px/1.4 inherit;}' +
    '#mp-root .mp-message-item small{font-size:10px;color:#9ea8b7;}' +
    '#mp-root .mp-message-editor-footer{display:flex;align-items:center;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.12);}' +
    '#mp-root .mp-message-editor-footer span{flex:1;}' +
    '#mp-root .mp-message-editor-footer button{min-height:36px;padding:7px 11px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:#30343e;color:#fff;cursor:pointer;}' +
    '#mp-root .mp-message-editor-footer button.primary{border-color:#3c9bc7;background:#17688f;}' +
    '#mp-root .mp-message-editor-footer button:hover{filter:brightness(1.15);}' +
    '@media(max-width:600px){#mp-root .mp-message-filters{flex-wrap:wrap;}#mp-root .mp-message-filters input{flex-basis:100%;}#mp-root .mp-message-filters select{max-width:none;flex:1;}#mp-root .mp-message-editor-footer{flex-wrap:wrap;}#mp-root .mp-message-editor-footer span{display:none;}#mp-root .mp-message-editor-footer button{flex:1;}}' +
    '#mp-root .mp-portal-dialog-actions button.danger{border-color:#9a3b3b;background:#742d35;}';
  R.querySelector('#mp-root').appendChild(menuStyle);

  // Tudo que altera o mapa ou seus dados fica disponível apenas no Editor.
  [
    '.mp-map-selector', '#mp-add-map', '#mp-add-map-file', '#mp-export', '#mp-export-catalog',
    '#mp-tools', '#mp-grid', '#mp-fog', '#mp-light', '#mp-walls-vis', '#mp-secret-view',
    '#mp-block', '#mp-lr', '#mp-reset-fog', '#mp-clear-fog', '#mp-clear-walls', '#mp-clear-edges',
    '#mp-zo', '#mp-zi', '#mp-side', '#mp-delete-map', '.mp-menu-footer',
    '#mp-world-move', '#mp-world-spawn', '#mp-world-portal', '#mp-world-local-portal'
  ].forEach(function (selector) {
    var node = R.querySelector(selector);
    if (!node) return;
    if (selector === '#mp-block' || selector === '#mp-lr') node = node.parentElement;
    if (node) node.classList.add('mp-editor-only');
  });
  var worldActionButtons = R.querySelectorAll('.mp-world-action');
  worldActionButtons.forEach(function (node) { node.classList.add('mp-editor-only'); });
  var editStructureButton = R.querySelector('#mp-tools button[data-t="editStructure"]');
  if (editStructureButton) editStructureButton.onclick = function () { setTool('editStructure'); setMenu(false); };
  $('#mp-mode-player').onclick = function () { setMode('player'); setMenu(false); };
  $('#mp-mode-editor').onclick = function () { setMode('editor'); setMenu(false); };
  var playerActionTray = R.querySelector('#mp-player-actions');
  if (playerActionTray) {
    playerActionTray.addEventListener('click', function (event) {
      var actionButton = event.target.closest('button[data-player-action]');
      if (actionButton) { setMenu(false); runPlayerAction(actionButton.getAttribute('data-player-action')); return; }
      if (event.target.closest('#mp-action-config')) configurePlayerActionProfile(currentPlayer());
    });
  }

  cv = $('#mp-cv');
  cx = cv.getContext('2d');
  if ('imageSmoothingQuality' in cx) cx.imageSmoothingQuality = 'high';

  // Se o menu estiver aberto, o primeiro toque no mapa só fecha o menu (não pinta/move nada).
  cv.addEventListener('pointerdown', function (e) {
    if (menuIsOpen()) { e.preventDefault(); e.stopImmediatePropagation(); setMenu(false); }
  });
  $('#mp-burger').onclick = function () { setMenu(!menuIsOpen()); };
  $('#mp-export').onclick = function () {
    save();
    exportMapFile();
  };
  $('#mp-export-catalog').style.display = customMapEntries().length ? '' : 'none';
  $('#mp-export-catalog').onclick = function () { exportMapCatalog(); };
  var deleteMapButton = $('#mp-delete-map');
  deleteMapButton.disabled = !MAPINFO.custom;
  deleteMapButton.title = MAPINFO.custom
    ? 'Excluir este mapa personalizado do seletor'
    : 'Os mapas originais do projeto não podem ser excluídos';
  deleteMapButton.onclick = function () { deleteCurrentCustomMap(); };
  $('#mp-add-map').onclick = function () { $('#mp-add-map-file').click(); };
  $('#mp-add-map-file').onchange = function () {
    var file = this.files && this.files[0];
    this.value = '';
    if (file) createCustomMapFromFile(file);
  };
  $('#mp-world-move').onclick = function () {
    if (!isHexMap()) return;
    setTool('select'); setMenu(false);
  };
  $('#mp-world-spawn').onclick = function () {
    if (!isHexMap()) return;
    setTool('spawn'); setMenu(false);
  };
  $('#mp-world-portal').onclick = function () {
    if (!isHexMap()) return;
    setTool('portal'); setMenu(false);
  };
  $('#mp-world-local-portal').onclick = function () {
    if (!isHexMap()) return;
    setTool('localPortal'); setMenu(false);
  };
  cv.addEventListener('pointerdown', onPointerDown);
  cv.addEventListener('pointermove', onPointerMove);
  cv.addEventListener('pointerleave', onPointerLeave);
  cv.addEventListener('pointerup', onPointerUp);
  cv.addEventListener('pointercancel', onPointerUp);
  cv.addEventListener('wheel', onWheel, { passive: false });
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  $('#mp-map').onchange = function () {
    var host = R, id = this.value;
    stopWorldTravel(false);
    save();
    tool = 'select';
    try { localStorage.setItem(MAP_ID_KEY, id); } catch (e) {}
    unmount();
    applyMap(id);
    zoom = isHexMap() ? FLANAESS_ZOOM : 0.35; ox = 40; oy = 40;
    if (isHexMap() && ['muro', 'porta', 'eraseedge'].indexOf(tool) >= 0) tool = 'select';
    state = migrateFlanaessState(load() || defaultState());
    selected = null; pendingMonster = null; measurePts = null; drag = null;
    mount(host);
  };
  if ($('#mp-hex-wrap')) $('#mp-hex-wrap').style.display = 'none';
  if ($('#mp-speed-wrap')) $('#mp-speed-wrap').style.display = isHexMap() ? 'inline-flex' : 'none';
  if (isHexMap()) {
    var worldRoot = $('#mp-root');
    worldRoot.classList.add('mp-world-map');
    var worldStyle = document.createElement('style');
    worldStyle.textContent =
      '#mp-root.mp-world-map #mp-fog,' +
      '#mp-root.mp-world-map #mp-light,' +
      '#mp-root.mp-world-map #mp-walls-vis,' +
      '#mp-root.mp-world-map #mp-secret-view,' +
      '#mp-root.mp-world-map #mp-speed-wrap,' +
      '#mp-root.mp-world-map #mp-reset-fog,' +
      '#mp-root.mp-world-map #mp-clear-fog,' +
      '#mp-root.mp-world-map #mp-clear-walls,' +
      '#mp-root.mp-world-map #mp-clear-edges,' +
      '#mp-root.mp-world-map #mp-block,' +
      '#mp-root.mp-world-map #mp-lr,'+
      '#mp-root.mp-world-map #mp-hex-wrap {display:none !important;}' +
      '#mp-root.mp-world-map.editor-mode .mp-world-action {display:block !important;}' +
      '#mp-root.editor-mode #mp-world-local-portal {display:block !important;}' +
      '#mp-root:not(.mp-world-map).editor-mode #mp-world-move,' +
      '#mp-root:not(.mp-world-map).editor-mode #mp-world-spawn,' +
      '#mp-root:not(.mp-world-map).editor-mode #mp-world-portal {display:none !important;}' +
      '#mp-root.mp-world-map.editor-mode #mp-tools {display:grid !important;grid-template-columns:1fr 1fr;gap:6px;}' +
      '#mp-root.mp-world-map.editor-mode #mp-tools button {width:100%;box-sizing:border-box;}' +
      '#mp-root.mp-world-map #mp-side {display:none !important;}' +
      '#mp-root.mp-world-map #mp-world-move.active{background:rgba(35,155,100,.32);border-color:#70d6a2;}' +
      '#mp-root.mp-world-map #mp-cv {display:block;width:100%;height:100%;cursor:crosshair;touch-action:manipulation;}';
    worldRoot.appendChild(worldStyle);
    var blockLabel = $('#mp-block'); if (blockLabel && blockLabel.parentElement) blockLabel.parentElement.style.display = 'none';
    var radiusInput = $('#mp-lr'); if (radiusInput && radiusInput.parentElement) radiusInput.parentElement.style.display = 'none';
    var speedWrap = $('#mp-speed-wrap'); if (speedWrap) speedWrap.style.display = 'none';
    if (appMode !== 'editor') zoom = FLANAESS_ZOOM;
  }
  // O Flanaess não oferece mais seletor: o tamanho pequeno é fixo.
  if ($('#mp-speed')) $('#mp-speed').oninput = function () {
    travelSpeedMilesPerDay = Math.max(0, Number(this.value) || 0);
    draw();
  };

  $('#mp-tools').onclick = function (e) {
    var b = e.target.closest('button');
    if (b) { setTool(b.dataset.t); setMenu(false); }
  };
  $('#mp-grid').onclick = function () { showGrid = !showGrid; this.classList.toggle('on', showGrid); draw(); };
  $('#mp-fog').onclick = function () { showFog = !showFog; this.classList.toggle('on', showFog); draw(); };
  $('#mp-light').onclick = function () { dynLight = !dynLight; this.classList.toggle('on', dynLight); draw(); };
  $('#mp-walls-vis').onclick = function () { showWalls = !showWalls; this.classList.toggle('on', showWalls); draw(); };
  $('#mp-block').onchange = function () { blockMove = this.checked; };
  $('#mp-lr').onchange = function () {
    lightRadius = +this.value || 0;
    var p = state.tokens.find(function (t) { return t.tipo === 'player'; });
    if (p) { p.luz = lightRadius; save(); }
    centerCameraOnPlayer();
    draw();
  };
  $('#mp-reset-fog').onclick = function () {
    if (appConfirmMessage('msg083', 'Cobrir o mapa com névoa novamente?')) {
      state.fog = makeGrid(1); save(); draw();
    }
  };
  $('#mp-clear-fog').onclick = function () {
    if (appConfirmMessage('msg084', 'Revelar o mapa inteiro? A névoa será removida de todas as células.')) {
      state.fog = makeGrid(0); save(); draw();
    }
  };
  $('#mp-clear-walls').onclick = function () {
    if (appConfirmMessage('msg085', 'Apagar todas as paredes das células?')) {
      state.walls = makeGrid(0);
      state.wallMeta = makeArr(COLS * ROWS, null);
      save(); draw();
    }
  };
  $('#mp-clear-edges').onclick = function () {
    if (appConfirmMessage('msg086', 'Apagar todos os muros e portas de linha?')) {
      state.hEdges = makeArr(COLS * (ROWS + 1), 0);
      state.vEdges = makeArr((COLS + 1) * ROWS, 0);
      state.hEdgeMeta = makeArr(COLS * (ROWS + 1), null);
      state.vEdgeMeta = makeArr((COLS + 1) * ROWS, null);
      save(); draw();
    }
  };
  var secretViewButton = $('#mp-secret-view');
  if (secretViewButton) {
    secretViewButton.style.display = isHexMap() ? 'none' : '';
    secretViewButton.classList.toggle('on', showSecrets);
    secretViewButton.onclick = function () { showSecrets = !showSecrets; this.classList.toggle('on', showSecrets); draw(); };
  }
  $('#mp-zo').onclick = function () { if (appMode === 'editor') changeCameraZoom(1 / 1.2); else if (isHexMap()) { zoom = FLANAESS_ZOOM; draw(); } else changeCameraZoom(1 / 1.2); };
  $('#mp-zi').onclick = function () { if (appMode === 'editor') changeCameraZoom(1.2); else if (isHexMap()) { zoom = FLANAESS_ZOOM; draw(); } else changeCameraZoom(1.2); };

  $('#mp-q').oninput = function () { renderMonsterList(this.value); };
  $('#mp-ml').onclick = function (e) {
    var b = e.target.closest('button[data-id]');
    if (!b) return;
    var m = (window.MONSTERS || []).find(function (x) { return x.id === b.dataset.id; });
    if (!m) return;
    pendingMonster = m;
    setTool('token');
    R.querySelectorAll('#mp-ml button').forEach(function (btn) { btn.classList.toggle('on', btn === b); });
    setMenu(false);
  };

  document.addEventListener('keydown', onKey);
  document.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('resize', onWindowResize);

  [
    'wall', 'erasewall', 'muro', 'porta', 'paredeSecreta', 'portaSecreta', 'portaTrancada',
    'portaEmperrada', 'paredeIlusoria', 'muralhaForca', 'paredeMagica', 'searchSecret',
    'investigateMechanism', 'damageStructure', 'eraseedge', 'editStructure', 'reveal', 'hide', 'token', 'measure',
    'spawn', 'localPortal'
  ].forEach(function (name) {
    var btn = R.querySelector('#mp-tools button[data-t="' + name + '"]');
    if (btn) btn.style.display = isHexMap() ? 'none' : '';
  });
  var clearEdgesButton = $('#mp-clear-edges');
  if (clearEdgesButton) clearEdgesButton.style.display = isHexMap() ? 'none' : '';
  // A página abre em Jogador; ao trocar de mapa o modo atual é preservado.
  setMode(appMode);
  $('#mp-grid').classList.toggle('on', showGrid);
  $('#mp-fog').classList.toggle('on', showFog);
  $('#mp-light').classList.toggle('on', dynLight);
  $('#mp-walls-vis').classList.toggle('on', showWalls);

  function tryMonsters() { renderMonsterList($('#mp-q') ? $('#mp-q').value : ''); }
  tryMonsters();
  if (window.MONSTERS_READY) window.MONSTERS_READY.then(tryMonsters);

  loadBackgrounds(function () {
    if (!cv) return;
    if (isHexMap()) {
      if (appMode !== 'editor') zoom = FLANAESS_ZOOM;
      focusCameraOnPlayer(null, null, true);
    } else {
      centerCameraOnPlayer(null, null, true);
    }
    draw();
  });
  if (!isHexMap()) {
    centerCameraOnPlayer(null, null, true);
    checkPassiveSecretDetection(currentPlayer());
    window.requestAnimationFrame(function () { centerCameraOnPlayer(null, null, true); draw(); });
  }
  draw();
}

function unmount() {
  mountRequestId++;
  stopWorldTravel(false);
  stopKeyMove();
  pendingLocalPortal = null;
  document.removeEventListener('keydown', onKey);
  document.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('blur', onWindowBlur);
  window.removeEventListener('resize', onWindowResize);
  R = null; cv = null; cx = null; bgImages = []; detailCache = {}; previewPointer = null;
}

window.MapEditor = { mount: mount, unmount: unmount };
})();
