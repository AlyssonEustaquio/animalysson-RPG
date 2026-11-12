/*
 * Catálogo de classes oficiais de D&D (regras 2024): as 12 classes do Livro do Jogador 2024
 * + Artífice (Eberron: Forge of the Artificer, regras 2024).
 * Campos: n (nome), d (dado de vida), p (atributo principal),
 *         s (salvaguardas), k (nº de perícias), l (lista de perícias).
 */
window.CLASSES = [
  {n:'Artífice',d:8,p:'Inteligência',s:['CON','INT'],k:2,l:['Arcanismo','História','Investigação','Medicina','Natureza','Percepção','Prestidigitação']},
  {n:'Bárbaro',d:12,p:'Força',s:['FOR','CON'],k:2,l:['Adestrar Animais','Atletismo','Intimidação','Natureza','Percepção','Sobrevivência']},
  {n:'Bardo',d:8,p:'Carisma',s:['DES','CAR'],k:3,l:null},
  {n:'Bruxo',d:8,p:'Carisma',s:['SAB','CAR'],k:2,l:['Arcanismo','Enganação','História','Intimidação','Investigação','Natureza','Religião']},
  {n:'Clérigo',d:8,p:'Sabedoria',s:['SAB','CAR'],k:2,l:['História','Intuição','Medicina','Persuasão','Religião']},
  {n:'Druida',d:8,p:'Sabedoria',s:['INT','SAB'],k:2,l:['Arcanismo','Adestrar Animais','Intuição','Medicina','Natureza','Percepção','Religião','Sobrevivência']},
  {n:'Feiticeiro',d:6,p:'Carisma',s:['CON','CAR'],k:2,l:['Arcanismo','Enganação','Intimidação','Intuição','Persuasão','Religião']},
  {n:'Guardião',d:10,p:'Destreza e Sabedoria',s:['FOR','DES'],k:3,l:['Adestrar Animais','Atletismo','Furtividade','Intuição','Investigação','Natureza','Percepção','Sobrevivência']},
  {n:'Guerreiro',d:10,p:'Força ou Destreza',s:['FOR','CON'],k:2,l:['Acrobacia','Adestrar Animais','Atletismo','História','Intimidação','Intuição','Percepção','Persuasão','Sobrevivência']},
  {n:'Ladino',d:8,p:'Destreza',s:['DES','INT'],k:4,l:['Acrobacia','Atletismo','Atuação','Enganação','Furtividade','Intimidação','Intuição','Investigação','Percepção','Persuasão','Prestidigitação']},
  {n:'Mago',d:6,p:'Inteligência',s:['INT','SAB'],k:2,l:['Arcanismo','História','Intuição','Investigação','Medicina','Natureza','Religião']},
  {n:'Monge',d:8,p:'Destreza e Sabedoria',s:['FOR','DES'],k:2,l:['Acrobacia','Atletismo','Furtividade','História','Intuição','Religião']},
  {n:'Paladino',d:10,p:'Força e Carisma',s:['SAB','CAR'],k:2,l:['Atletismo','Intimidação','Intuição','Medicina','Persuasão','Religião']}
];

window.CLASS_DESC = {
  'Artífice':'Inventor mágico que infunde itens e engenhocas com magia, usando ferramentas como foco de conjuração.',
  'Bárbaro':'Guerreiro movido pela fúria, resistente e devastador no corpo a corpo.',
  'Bardo':'Artista inspirador que usa música e palavras para moldar a magia.',
  'Bruxo':'Conjurador que obteve poder por meio de um pacto com uma entidade poderosa.',
  'Clérigo':'Canal do poder divino, capaz de curar aliados e punir inimigos.',
  'Druida':'Guardião da natureza que conjura magia primal e assume formas selvagens.',
  'Feiticeiro':'Conjurador cujo poder mágico vem de uma herança ou força inata.',
  'Guardião':'Rastreador e caçador que combina combate, exploração e magia da natureza.',
  'Guerreiro':'Mestre das armas e armaduras, versátil e confiável em qualquer combate.',
  'Ladino':'Especialista em furtividade, precisão e perícias, ataca onde o inimigo é mais fraco.',
  'Mago':'Estudioso das artes arcanas com o maior repertório de magias.',
  'Monge':'Lutador disciplinado que canaliza o próprio corpo em golpes rápidos e precisos.',
  'Paladino':'Guerreiro sagrado movido por um juramento, une combate e magia divina.'
};
