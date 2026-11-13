/*
 * Catálogo de magias de D&D 5e — SRD 5.1 (regras de 2014).
 *
 * Dados indexáveis: nome em PT-BR, nome original, nível, escola, classes,
 * tempo de conjuração, alcance, concentração e ritual.
 *
 * ESCOPO E PROCEDÊNCIA:
 * - Contém 319 magias do SRD 5.1 (regras de 2014), não o catálogo completo
 *   do Livro do Jogador 2024 nem de suplementos.
 * - A terminologia PT-BR foi consultada na lista pública do Boteco do RPG
 *   (https://botecodorpg.com.br/sistemas/dnd-5e/magias). Essa tradução é
 *   comunitária/não oficial e pode diferir da edição brasileira oficial.
 * - Não inclui os textos integrais das magias.
 * - A classe Patrulheiro (Ranger) é exposta como Guardião para combinar com
 *   classes.js deste projeto.
 *
 * Atribuição SRD 5.1 (CC BY 4.0):
 * This work includes material taken from the System Reference Document 5.1
 * ("SRD 5.1") by Wizards of the Coast LLC, available at
 * https://dnd.wizards.com/resources/systems-reference-document.
 * The SRD 5.1 is licensed under the Creative Commons Attribution 4.0
 * International License: https://creativecommons.org/licenses/by/4.0/.
 */
(function () {
  const CLASSES = {
    B: 'Bardo', Br: 'Bruxo', C: 'Clérigo', D: 'Druida', F: 'Feiticeiro',
    M: 'Mago', P: 'Paladino', R: 'Guardião'
  };

  // formato: nome PT|nome EN|nível|escola|classes (códigos)|tempo|alcance|flags
  // flags: C = concentração; R = ritual
  const RAW = `
Ataque Certeiro|True Strike|0|Adivinhação|B,Br,F,M|1 ação|9 m|C
Bordão Místico|Shillelagh|0|Transmutação|D|1 ação bônus|toque|-
Borrifo Ácido|Acid Splash|0|Conjuração|F,M|1 ação|18 m|-
Chama Sagrada|Sacred Flame|0|Evocação|C|1 ação|18 m|-
Consertar|Mending|0|Transmutação|B,C,D,F,M|1 minuto|toque|-
Criar Chamas|Produce Flame|0|Conjuração|D|1 ação|pessoal|-
Druidismo|Druidcraft|0|Transmutação|D|1 ação|9 m|-
Estabilizar|Spare the Dying|0|Necromancia|C|1 ação|toque|-
Globos de Luz|Dancing Lights|0|Evocação|B,F,M|1 ação|36 m|C
Ilusão Menor|Minor Illusion|0|Ilusão|B,Br,F,M|1 ação|9 m|-
Luz|Light|0|Evocação|B,C,F,M|1 ação|toque|-
Mãos Mágicas|Mage Hand|0|Conjuração|B,Br,F,M|1 ação|9 m|-
Mensagem|Message|0|Transmutação|B,F,M|1 ação|36 m|-
Orientação|Guidance|0|Adivinhação|C,D|1 ação|toque|C
Prestidigitação|Prestidigitation|0|Transmutação|B,Br,F,M|1 ação|3 m|-
Raio de Fogo|Fire Bolt|0|Evocação|F,M|1 ação|36 m|-
Raio de Gelo|Ray of Frost|0|Evocação|F,M|1 ação|18 m|-
Rajada de Veneno|Poison Spray|0|Conjuração|Br,D,F,M|1 ação|3 m|-
Rajada Mística|Eldritch Blast|0|Evocação|Br|1 ação|36 m|-
Resistência|Resistance|0|Abjuração|C,D|1 ação|toque|C
Taumaturgia|Thaumaturgy|0|Transmutação|C|1 ação|9 m|-
Toque Arrepiante|Chill Touch|0|Necromancia|Br,F,M|1 ação|36 m|-
Toque Chocante|Shocking Grasp|0|Evocação|F,M|1 ação|toque|-
Zombaria Viciosa|Vicious Mockery|0|Encantamento|B|1 ação|18 m|-

Alarme|Alarm|1|Abjuração|M,R|1 minuto|9 m|R
Amizade Animal|Animal Friendship|1|Encantamento|B,D,R|1 ação|9 m|-
Armadura Arcana|Mage Armor|1|Abjuração|F,M|1 ação|toque|-
Auxílio Divino|Divine Favor|1|Evocação|P|1 ação bônus|pessoal|C
Bênção|Bless|1|Encantamento|C,P|1 ação|9 m|C
Bom Fruto|Goodberry|1|Transmutação|D,R|1 ação|toque|-
Comando|Command|1|Encantamento|C,P|1 ação|18 m|-
Compreender Idiomas|Comprehend Languages|1|Adivinhação|B,Br,F,M|1 ação|pessoal|R
Constrição|Entangle|1|Conjuração|D|1 ação|27 m|C
Convocar Familiar|Find Familiar|1|Conjuração|M|1 hora|3 m|R
Criar ou Destruir Água|Create or Destroy Water|1|Transmutação|C,D|1 ação|9 m|-
Curar Ferimentos|Cure Wounds|1|Evocação|B,C,D,P,R|1 ação|toque|-
Detectar Magia|Detect Magic|1|Adivinhação|B,C,D,F,M,P,R|1 ação|pessoal|CR
Detectar o Bem e Mal|Detect Evil and Good|1|Adivinhação|C,P|1 ação|pessoal|C
Detectar Veneno e Doença|Detect Poison and Disease|1|Adivinhação|C,D,P,R|1 ação|pessoal|CR
Disco Flutuante|Floating Disk|1|Conjuração|M|1 ação|9 m|R
Disfarçar-se|Disguise Self|1|Ilusão|B,F,M|1 ação|pessoal|-
Enfeitiçar Pessoa|Charm Person|1|Encantamento|B,Br,D,F,M|1 ação|9 m|-
Escrita Ilusória|Illusory Script|1|Ilusão|B,Br,M|1 minuto|toque|R
Escudo Arcano|Shield|1|Abjuração|F,M|1 reação|pessoal|-
Escudo da Fé|Shield of Faith|1|Abjuração|C,P|1 ação bônus|18 m|C
Falar com Animais|Speak with Animals|1|Adivinhação|B,D,R|1 ação|pessoal|R
Fogo das Fadas|Faerie Fire|1|Evocação|D|1 ação|18 m|C
Graxa|Grease|1|Conjuração|M|1 ação|18 m|-
Heroísmo|Heroism|1|Encantamento|B,P|1 ação|toque|C
Identificação|Identify|1|Adivinhação|B,M|1 minuto|toque|R
Imagem Silenciosa|Silent Image|1|Ilusão|B,F,M|1 ação|18 m|C
Infligir Ferimentos|Inflict Wounds|1|Necromancia|C|1 ação|toque|-
Leque Cromático|Color Spray|1|Ilusão|F,M|1 ação|pessoal|-
Mãos Flamejantes|Burning Hands|1|Evocação|F,M|1 ação|pessoal|-
Marca do Caçador|Hunter's Mark|1|Adivinhação|R|1 ação bônus|27 m|C
Mísseis Mágicos|Magic Missile|1|Evocação|F,M|1 ação|36 m|-
Névoa Obscurecente|Fog Cloud|1|Conjuração|D,F,M,R|1 ação|36 m|C
Onda Trovejante|Thunderwave|1|Evocação|B,D,F,M|1 ação|pessoal|-
Palavra Curativa|Healing Word|1|Evocação|B,C,D|1 ação bônus|18 m|-
Passos Longos|Longstrider|1|Transmutação|B,D,M,R|1 ação|toque|-
Perdição|Bane|1|Encantamento|B,C|1 ação|9 m|C
Proteção contra o Bem e Mal|Protection from Evil and Good|1|Abjuração|Br,C,M,P|1 ação|toque|C
Purificar Alimentos|Purify Food and Drink|1|Transmutação|C,D,P|1 ação|3 m|R
Queda Suave|Feather Fall|1|Transmutação|B,F,M|1 reação|18 m|-
Raio Guiador|Guiding Bolt|1|Evocação|C|1 ação|36 m|-
Recuo Acelerado|Expeditious Retreat|1|Transmutação|Br,F,M|1 ação bônus|pessoal|C
Repreensão Infernal|Hellish Rebuke|1|Evocação|Br|1 reação|18 m|-
Riso Histérico|Hideous Laughter|1|Encantamento|B,M|1 ação|9 m|C
Salto|Jump|1|Transmutação|D,F,M,R|1 ação|toque|-
Santuário|Sanctuary|1|Abjuração|C|1 ação bônus|9 m|-
Servo Invisível|Unseen Servant|1|Conjuração|B,Br,M|1 ação|18 m|R
Sono|Sleep|1|Encantamento|B,F,M|1 ação|27 m|-
Vitalidade Falsa|False Life|1|Necromancia|F,M|1 ação|pessoal|-

Acalmar Emoções|Calm Emotions|2|Encantamento|B,C|1 ação|18 m|C
Ajuda|Aid|2|Abjuração|C,P|1 ação|9 m|-
Alterar-se|Alter Self|2|Transmutação|F,M|1 ação|pessoal|C
Aprimorar Habilidade|Enhance Ability|2|Transmutação|B,C,D,F|1 ação|toque|C
Arma Espiritual|Spiritual Weapon|2|Evocação|C|1 ação bônus|18 m|-
Arma Mágica|Magic Weapon|2|Transmutação|M,P|1 ação bônus|toque|C
Arrombar|Knock|2|Transmutação|B,F,M|1 ação|18 m|-
Augúrio|Augury|2|Adivinhação|C|1 minuto|pessoal|R
Aumentar/Reduzir|Enlarge/Reduce|2|Transmutação|F,M|1 ação|9 m|C
Aura Mágica de Arcanista|Arcanist's Magic Aura|2|Ilusão|M|1 ação|toque|-
Boca Encantada|Magic Mouth|2|Ilusão|B,M|1 minuto|9 m|R
Cativar|Enthrall|2|Encantamento|B,Br|1 ação|18 m|-
Cegueira/Surdez|Blindness/Deafness|2|Necromancia|B,C,F,M|1 ação|9 m|-
Chama Contínua|Continual Flame|2|Evocação|C,M|1 ação|toque|-
Convocar Montaria|Find Steed|2|Conjuração|P|10 minutos|9 m|-
Crescer Espinhos|Spike Growth|2|Transmutação|D,R|1 ação|45 m|C
Despedaçar|Shatter|2|Evocação|B,Br,F,M|1 ação|18 m|-
Detectar Pensamentos|Detect Thoughts|2|Adivinhação|B,F,M|1 ação|pessoal|C
Encontrar Armadilhas|Find Traps|2|Adivinhação|C,D,R|1 ação|36 m|-
Escuridão|Darkness|2|Evocação|Br,F,M|1 ação|18 m|C
Esfera Flamejante|Flaming Sphere|2|Conjuração|D,M|1 ação|18 m|C
Esquentar Metal|Heat Metal|2|Transmutação|B,D|1 ação|18 m|C
Flecha Ácida|Acid Arrow|2|Evocação|M|1 ação|27 m|-
Imagem Espelhada|Mirror Image|2|Ilusão|Br,F,M|1 ação|pessoal|-
Imobilizar Pessoa|Hold Person|2|Encantamento|B,Br,C,D,F,M|1 ação|18 m|C
Invisibilidade|Invisibility|2|Ilusão|B,Br,F,M|1 ação|toque|C
Lâmina Flamejante|Flame Blade|2|Evocação|D|1 ação bônus|pessoal|C
Levitação|Levitate|2|Transmutação|F,M|1 ação|18 m|C
Localizar Animais ou Plantas|Locate Animals or Plants|2|Adivinhação|B,D,R|1 ação|pessoal|R
Localizar Objeto|Locate Object|2|Adivinhação|B,C,D,M,P,R|1 ação|pessoal|C
Lufada de Vento|Gust of Wind|2|Evocação|D,F,M|1 ação|pessoal|C
Marca da Punição|Branding Smite|2|Evocação|P|1 ação bônus|pessoal|C
Mensageiro Animal|Animal Messenger|2|Encantamento|B,D,R|1 ação|9 m|R
Nublar|Blur|2|Ilusão|F,M|1 ação|pessoal|C
Oração Curativa|Prayer of Healing|2|Evocação|C|10 minutos|9 m|-
Passo Nebuloso|Misty Step|2|Conjuração|Br,F,M|1 ação bônus|pessoal|-
Passos sem Pegadas|Pass Without Trace|2|Abjuração|D,R|1 ação|pessoal|C
Patas de Aranha|Spider Climb|2|Transmutação|Br,F,M|1 ação|toque|C
Pele de Árvore|Barkskin|2|Transmutação|D,R|1 ação|toque|C
Proteção Contra Veneno|Protection from Poison|2|Abjuração|C,D,P,R|1 ação|toque|-
Raio Ardente|Scorching Ray|2|Evocação|F,M|1 ação|36 m|-
Raio do Enfraquecimento|Ray of Enfeeblement|2|Necromancia|Br,M|1 ação|18 m|C
Raio Lunar|Moonbeam|2|Evocação|D|1 ação|36 m|C
Repouso Tranquilo|Gentle Repose|2|Necromancia|C,M|1 ação|toque|R
Restauração Menor|Lesser Restoration|2|Abjuração|B,C,D,P,R|1 ação|toque|-
Silêncio|Silence|2|Ilusão|B,C,R|1 ação|36 m|CR
Sugestão|Suggestion|2|Encantamento|B,Br,F,M|1 ação|9 m|C
Teia|Web|2|Conjuração|F,M|1 ação|18 m|C
Tranca Arcana|Arcane Lock|2|Abjuração|M|1 ação|toque|-
Truque de Corda|Rope Trick|2|Transmutação|M|1 ação|toque|-
Ver o Invisível|See Invisibility|2|Adivinhação|B,F,M|1 ação|pessoal|-
Vínculo Protetor|Warding Bond|2|Abjuração|C|1 ação|toque|-
Visão no Escuro|Darkvision|2|Transmutação|D,F,M,R|1 ação|toque|-
Zona da Verdade|Zone of Truth|2|Encantamento|B,C,P|1 ação|18 m|-

Ampliar Plantas|Plant Growth|3|Transmutação|B,D,R|1 ação|45 m|-
Andar na Água|Water Walk|3|Transmutação|C,D,F,R|1 ação|9 m|R
Animar Mortos|Animate Dead|3|Necromancia|C,M|1 minuto|3 m|-
Bola de Fogo|Fireball|3|Evocação|F,M|1 ação|45 m|-
Círculo Mágico|Magic Circle|3|Abjuração|Br,C,M,P|1 minuto|3 m|-
Clarividência|Clairvoyance|3|Adivinhação|B,C,F,M|10 minutos|1,6 km|C
Conjurar Animais|Conjure Animals|3|Conjuração|D,R|1 ação|18 m|C
Contramágica|Counterspell|3|Abjuração|Br,F,M|1 reação|18 m|-
Convocar Relâmpagos|Call Lightning|3|Conjuração|D|1 ação|36 m|C
Criar Alimentos|Create Food and Water|3|Conjuração|C,D,P|1 ação|9 m|-
Dificultar Detecção|Nondetection|3|Abjuração|B,M,R|1 ação|toque|-
Dissipar Magia|Dispel Magic|3|Abjuração|B,Br,C,D,F,M,P|1 ação|36 m|-
Enviar Mensagem|Sending|3|Evocação|B,C,M|1 ação|ilimitado|-
Espíritos Guardiões|Spirit Guardians|3|Conjuração|C|1 ação|pessoal|C
Falar com os Mortos|Speak with Dead|3|Necromancia|B,C|1 ação|3 m|-
Falar com Plantas|Speak with Plants|3|Transmutação|B,D,R|1 ação|pessoal|-
Forma Gasosa|Gaseous Form|3|Transmutação|Br,F,M|1 ação|toque|C
Glifo de Vigilância|Glyph of Warding|3|Abjuração|B,C,M|1 hora|toque|-
Idiomas|Tongues|3|Adivinhação|B,Br,C,F,M|1 ação|toque|-
Imagem Maior|Major Image|3|Ilusão|B,Br,F,M|1 ação|36 m|C
Lentidão|Slow|3|Transmutação|F,M|1 ação|36 m|C
Luz do Dia|Daylight|3|Evocação|C,D,F,P,R|1 ação|18 m|-
Medo|Fear|3|Ilusão|B,Br,F,M|1 ação|pessoal|C
Mesclar-se às Rochas|Meld Into Stone|3|Transmutação|C|1 ação|toque|R
Montaria Fantasmagórica|Phantom Steed|3|Ilusão|M|1 minuto|9 m|R
Muralha de Vento|Wind Wall|3|Evocação|D,R|1 ação|36 m|C
Névoa Fétida|Stinking Cloud|3|Conjuração|B,F,M|1 ação|27 m|C
Padrão Hipnótico|Hypnotic Pattern|3|Ilusão|B,Br,F,M|1 ação|36 m|C
Palavra Curativa em Massa|Mass Healing Word|3|Evocação|C|1 ação bônus|18 m|-
Pequena Cabana|Tiny Hut|3|Evocação|B,M|1 minuto|pessoal|R
Piscar|Blink|3|Transmutação|F,M|1 ação|pessoal|-
Proteção Contra Energia|Protection From Energy|3|Abjuração|C,D,F,M,R|1 ação|toque|C
Relâmpago|Lightning Bolt|3|Evocação|F,M|1 ação|pessoal|-
Remover Maldição|Remove Curse|3|Abjuração|Br,C,M,P|1 ação|toque|-
Respirar na Água|Water Breathing|3|Transmutação|D,F,M,R|1 ação|9 m|R
Revivificar|Revivify|3|Conjuração|C,P|1 ação|toque|-
Rogar Maldição|Bestow Curse|3|Necromancia|B,C,M|1 ação|toque|C
Sinal de Esperança|Beacon of Hope|3|Abjuração|C|1 ação|9 m|C
Tempestade de Granizo|Sleet Storm|3|Conjuração|D,F,M|1 ação|45 m|C
Toque Vampírico|Vampiric Touch|3|Necromancia|Br,M|1 ação|pessoal|C
Velocidade|Haste|3|Transmutação|F,M|1 ação|9 m|C
Voo|Fly|3|Transmutação|Br,F,M|1 ação|toque|C

Adivinhação|Divination|4|Adivinhação|D|1 ação|pessoal|R
Arca Secreta|Secret Chest|4|Conjuração|M|1 ação|toque|-
Assassino Fantasmagórico|Phantasmal Killer|4|Ilusão|M|1 ação|36 m|C
Banimento|Banishment|4|Abjuração|Br,C,F,M,P|1 ação|18 m|C
Cão Fiel|Faithful Hound|4|Conjuração|M|1 ação|9 m|-
Compulsão|Compulsion|4|Encantamento|B|1 ação|9 m|C
Confusão|Confusion|4|Encantamento|B,D,F,M|1 ação|27 m|C
Conjurar Elementais Menores|Conjure Minor Elementals|4|Conjuração|D,M|1 minuto|27 m|C
Conjurar Seres da Floresta|Conjure Woodland Beings|4|Conjuração|D,R|1 ação|18 m|C
Controlar a Água|Control Water|4|Transmutação|C,D,M|1 ação|90 m|C
Dominar Besta|Dominate Beast|4|Encantamento|D,F|1 ação|18 m|C
Escudo de Fogo|Fire Shield|4|Evocação|M|1 ação|pessoal|-
Esfera Resiliente|Resilient Sphere|4|Evocação|M|1 ação|9 m|C
Fabricar|Fabricate|4|Transmutação|M|10 minutos|36 m|-
Guardião da Fé|Guardian of Faith|4|Conjuração|C|1 ação|9 m|-
Inseto Gigante|Giant Insect|4|Transmutação|D|1 ação|9 m|C
Invisibilidade Maior|Greater Invisibility|4|Ilusão|B,F,M|1 ação|toque|C
Localizar Criatura|Locate Creature|4|Adivinhação|B,C,D,M,P,R|1 ação|pessoal|C
Malogro|Blight|4|Necromancia|Br,D,F,M|1 ação|9 m|-
Metamorfose|Polymorph|4|Transmutação|B,D,F,M|1 ação|18 m|C
Moldar Rochas|Stone Shape|4|Transmutação|C,D,M|1 ação|toque|-
Movimentação Livre|Freedom of Movement|4|Abjuração|B,C,D,R|1 ação|toque|-
Muralha de Fogo|Wall of Fire|4|Evocação|D,F,M|1 ação|36 m|C
Olho Arcano|Arcane Eye|4|Adivinhação|C,M|1 ação|9 m|C
Pele de Pedra|Stoneskin|4|Abjuração|D,F,M,R|1 ação|toque|C
Porta Dimensional|Dimension Door|4|Conjuração|B,Br,F,M|1 ação|150 m|-
Proteção contra a Morte|Death Ward|4|Abjuração|C,P|1 ação|toque|-
Santuário Particular|Private Sanctum|4|Abjuração|M|10 minutos|36 m|-
Tempestade de Gelo|Ice Storm|4|Evocação|D,F,M|1 ação|90 m|-
Tentáculos Negros|Black Tentacles|4|Conjuração|M|1 ação|27 m|C
Terreno Alucinógeno|Hallucinatory Terrain|4|Ilusão|B,Br,D,M|10 minutos|90 m|-

Animar Objetos|Animate Objects|5|Transmutação|B,F,M|1 ação|36 m|C
Aparência|Seeming|5|Ilusão|B,F,M|1 ação|9 m|-
Círculo de Teletransporte|Teleportation Circle|5|Conjuração|B,F,M|1 minuto|3 m|-
Coluna de Chamas|Flame Strike|5|Evocação|C|1 ação|18 m|-
Comunhão|Commune|5|Adivinhação|C|1 minuto|pessoal|R
Comunhão com a Natureza|Commune With Nature|5|Adivinhação|D,R|1 minuto|pessoal|R
Cone de Frio|Cone of Cold|5|Evocação|F,M|1 ação|pessoal|-
Conhecimento Lendário|Legend Lore|5|Adivinhação|B,C,M|10 minutos|pessoal|-
Conjurar Elemental|Conjure Elemental|5|Conjuração|D,M|1 minuto|27 m|C
Consagrar|Hallow|5|Evocação|C|24 horas|toque|-
Contágio|Contagion|5|Necromancia|C,D|1 ação|toque|-
Contato Extraplanar|Contact Other Plane|5|Adivinhação|Br,M|1 minuto|pessoal|R
Criação|Creation|5|Ilusão|F,M|1 minuto|9 m|-
Criar Passagem|Passwall|5|Transmutação|M|1 ação|9 m|-
Cúpula Antivida|Antilife Shell|5|Abjuração|D|1 ação|pessoal|C
Curar Ferimentos em Massa|Mass Cure Wounds|5|Conjuração|B,C,D|1 ação|18 m|-
Despertar|Awaken|5|Transmutação|B,D|8 horas|toque|-
Despistar|Mislead|5|Ilusão|B,M|1 ação|pessoal|C
Dissipar o Bem e Mal|Dispel Evil and Good|5|Abjuração|C,P|1 ação|pessoal|C
Dominar Pessoa|Dominate Person|5|Encantamento|B,F,M|1 ação|18 m|C
Imobilizar Monstro|Hold Monster|5|Encantamento|B,Br,F,M|1 ação|27 m|C
Ligação Telepática|Telepathic Bond|5|Adivinhação|M|1 ação|9 m|R
Mão Arcana|Arcane Hand|5|Evocação|M|1 ação|36 m|C
Missão|Geas|5|Encantamento|B,C,D,M,P|1 minuto|18 m|-
Modificar Memória|Modify Memory|5|Encantamento|B,M|1 ação|9 m|C
Muralha de Energia|Wall of Force|5|Evocação|M|1 ação|36 m|C
Muralha de Pedra|Wall of Stone|5|Evocação|D,F,M|1 ação|36 m|C
Névoa Mortal|Cloudkill|5|Conjuração|F,M|1 ação|36 m|C
Passo Arbóreo|Tree Stride|5|Conjuração|D,R|1 ação|pessoal|C
Praga de Insetos|Insect Plague|5|Conjuração|C,D,F|1 ação|90 m|C
Reencarnação|Reincarnate|5|Transmutação|D|1 hora|toque|-
Restauração Maior|Greater Restoration|5|Abjuração|B,C,D|1 ação|toque|-
Reviver os Mortos|Raise Dead|5|Necromancia|B,C,P|1 hora|toque|-
Sonho|Dream|5|Ilusão|B,Br,M|1 minuto|especial|-
Telecinésia|Telekinesis|5|Transmutação|F,M|1 ação|18 m|C
Vidência|Scrying|5|Adivinhação|B,Br,C,D,M|10 minutos|pessoal|C
Vínculo Planar|Planar Binding|5|Abjuração|B,C,D,M|1 hora|18 m|-

Aliado Planar|Planar Ally|6|Conjuração|C|10 minutos|18 m|-
Banquete de Heróis|Heroes' Feast|6|Conjuração|C,D|10 minutos|9 m|-
Barreira de Lâminas|Blade Barrier|6|Evocação|C|1 ação|27 m|C
Caminhar no Vento|Wind Walk|6|Transmutação|D|1 minuto|9 m|-
Carne para Pedra|Flesh to Stone|6|Transmutação|Br,M|1 ação|18 m|C
Círculo da Morte|Circle of Death|6|Necromancia|Br,F,M|1 ação|45 m|-
Conjurar Feérico|Conjure Fey|6|Conjuração|Br,D|1 minuto|27 m|C
Contingência|Contingency|6|Evocação|M|10 minutos|pessoal|-
Corrente de Relâmpagos|Chain Lightning|6|Evocação|F,M|1 ação|45 m|-
Criar Mortos-Vivos|Create Undead|6|Necromancia|Br,C,M|1 minuto|3 m|-
Cura Completa|Heal|6|Evocação|C,D|1 ação|18 m|-
Dança Irresistível|Irresistible Dance|6|Encantamento|B,M|1 ação|9 m|C
Desintegrar|Disintegrate|6|Transmutação|F,M|1 ação|18 m|-
Doença Plena|Harm|6|Necromancia|C|1 ação|18 m|-
Encontrar o Caminho|Find the Path|6|Adivinhação|B,C,D|1 minuto|pessoal|C
Esfera Congelante|Freezing Sphere|6|Evocação|M|1 ação|90 m|-
Globo de Invulnerabilidade|Globe of Invulnerability|6|Abjuração|F,M|1 ação|pessoal|C
Ilusão Programada|Programmed Illusion|6|Ilusão|B,M|1 ação|36 m|-
Invocação Instantânea|Instant Summons|6|Conjuração|M|1 minuto|toque|R
Mover Terra|Move Earth|6|Transmutação|D,F,M|1 ação|36 m|C
Muralha de Espinhos|Wall of Thorns|6|Conjuração|D|1 ação|36 m|C
Muralha de Gelo|Wall of Ice|6|Evocação|M|1 ação|36 m|C
Olhar Voraz|Eyebite|6|Necromancia|B,Br,F,M|1 ação|pessoal|C
Palavra de Recordação|Word of Recall|6|Conjuração|C|1 ação|1,5 m|-
Proibição|Forbiddance|6|Abjuração|C|10 minutos|toque|R
Proteger Fortaleza|Guards and Wards|6|Abjuração|B,M|10 minutos|toque|-
Raio Solar|Sunbeam|6|Evocação|D,F,M|1 ação|pessoal|C
Recipiente Arcano|Magic Jar|6|Necromancia|M|1 minuto|pessoal|-
Sugestão em Massa|Mass Suggestion|6|Encantamento|B,Br,F,M|1 ação|18 m|-
Teletransporte por Árvores|Transport via Plants|6|Conjuração|D|1 ação|3 m|-
Visão da Verdade|True Seeing|6|Adivinhação|B,Br,C,F,M|1 ação|toque|-

Bola de Fogo Controlável|Delayed Blast Fireball|7|Evocação|F,M|1 ação|45 m|C
Conjurar Celestial|Conjure Celestial|7|Conjuração|C|1 minuto|27 m|C
Dedo da Morte|Finger of Death|7|Necromancia|Br,F,M|1 ação|18 m|-
Espada Arcana|Arcane Sword|7|Evocação|B,M|1 ação|18 m|C
Forma Etérea|Etherealness|7|Transmutação|B,Br,C,F,M|1 ação|pessoal|-
Inverter a Gravidade|Reverse Gravity|7|Transmutação|D,F,M|1 ação|30 m|C
Isolamento|Sequester|7|Transmutação|M|1 ação|toque|-
Jaula de Força|Forcecage|7|Evocação|B,Br,M|1 ação|30 m|-
Mansão Magnífica|Magnificent Mansion|7|Conjuração|B,M|1 minuto|90 m|-
Miragem Arcana|Mirage Arcane|7|Ilusão|B,D,M|10 minutos|visão|-
Palavra Divina|Divine Word|7|Evocação|C|1 ação bônus|9 m|-
Projetar Imagem|Project Image|7|Ilusão|B,M|1 ação|800 km|C
Rajada Prismática|Prismatic Spray|7|Evocação|F,M|1 ação|pessoal|-
Regeneração|Regenerate|7|Transmutação|B,C,D|1 minuto|toque|-
Ressurreição|Resurrection|7|Necromancia|B,C|1 hora|toque|-
Símbolo|Symbol|7|Abjuração|B,C,M|1 minuto|toque|-
Simulacro|Simulacrum|7|Ilusão|M|12 horas|toque|-
Teletransporte|Teleport|7|Conjuração|B,F,M|1 ação|3 m|-
Tempestade de Fogo|Fire Storm|7|Evocação|C,D,F|1 ação|45 m|-
Viagem Planar|Plane Shift|7|Conjuração|Br,C,D,F,M|1 ação|toque|-

Antipatia/Simpatia|Antipathy/Sympathy|8|Encantamento|D,M|1 hora|18 m|-
Aura Sagrada|Holy Aura|8|Abjuração|C|1 ação|pessoal|C
Campo Antimagia|Antimagic Field|8|Abjuração|C,M|1 ação|pessoal|C
Clone|Clone|8|Necromancia|M|1 hora|toque|-
Controlar o Clima|Control Weather|8|Transmutação|C,D,M|10 minutos|pessoal|C
Dominar Monstro|Dominate Monster|8|Encantamento|B,Br,F,M|1 ação|18 m|C
Enfraquecer Intelecto|Feeblemind|8|Encantamento|B,Br,D,M|1 ação|45 m|-
Explosão Solar|Sunburst|8|Evocação|D,F,M|1 ação|45 m|-
Formas Animais|Animal Shapes|8|Transmutação|D|1 ação|9 m|C
Labirinto|Maze|8|Conjuração|M|1 ação|18 m|C
Limpar a Mente|Mind Blank|8|Abjuração|B,M|1 ação|toque|-
Loquacidade|Glibness|8|Transmutação|B,Br|1 ação|pessoal|-
Nuvem Incendiária|Incendiary Cloud|8|Conjuração|F,M|1 ação|45 m|C
Palavra de Poder Atordoar|Power Word Stun|8|Encantamento|B,Br,F,M|1 ação|18 m|-
Semiplano|Demiplane|8|Conjuração|Br,M|1 ação|18 m|-
Terremoto|Earthquake|8|Evocação|C,D,F|1 ação|150 m|C

Alterar Forma|Shapechange|9|Transmutação|D,M|1 ação|pessoal|C
Aprisionamento|Imprisonment|9|Abjuração|Br,M|1 minuto|9 m|-
Chuva de Meteoros|Meteor Swarm|9|Evocação|F,M|1 ação|1,6 km|-
Cura Completa em Massa|Mass Heal|9|Conjuração|C|1 ação|18 m|-
Desejo|Wish|9|Conjuração|F,M|1 ação|pessoal|-
Encarnação Fantasmagórica|Weird|9|Ilusão|M|1 ação|36 m|C
Metamorfose Verdadeira|True Polymorph|9|Transmutação|B,Br,M|1 ação|9 m|C
Muralha Prismática|Prismatic Wall|9|Abjuração|M|1 ação|18 m|-
Palavra de Poder Matar|Power Word Kill|9|Encantamento|B,Br,F,M|1 ação|18 m|-
Parar o Tempo|Time Stop|9|Transmutação|F,M|1 ação|pessoal|-
Portal|Gate|9|Conjuração|C,F,M|1 ação|18 m|C
Projeção Astral|Astral Projection|9|Necromancia|Br,C,M|1 hora|3 m|-
Ressurreição Verdadeira|True Resurrection|9|Necromancia|C,D|1 hora|toque|-
Sexto Sentido|Foresight|9|Adivinhação|B,Br,D,M|1 minuto|toque|-
Tempestade da Vingança|Storm of Vengeance|9|Conjuração|D|1 ação|visão|C
`;

  window.SPELLS = RAW.trim().split(/\n+/).map(function (line) {
    const [n, en, level, school, classCodes, time, range, flags] = line.split('|');
    return {
      n: n.trim(),
      en: en.trim(),
      lvl: Number(level),
      escola: school.trim(),
      classes: classCodes.split(',').map(function (code) { return CLASSES[code]; }),
      tempo: time.trim(),
      alcance: range.trim(),
      concentracao: flags.includes('C'),
      ritual: flags.includes('R'),
      edicao: '2014',
      fonte: 'SRD 5.1'
    };
  });

  window.SPELLS_META = {
    total: 319,
    edicao: 'D&D 5e (2014)',
    documento: 'SRD 5.1',
    traducao: 'PT-BR comunitária de referência; não oficial',
    fonteTraducao: 'https://botecodorpg.com.br/sistemas/dnd-5e/magias',
    licencaConteudoBase: 'CC BY 4.0',
    observacao: 'Não inclui o catálogo completo do Livro do Jogador 2024 nem suplementos.'
  };

  window.SPELLS.sort(function (a, b) {
    return a.lvl - b.lvl || a.n.localeCompare(b.n, 'pt-BR');
  });

  // Índices e consultas simples para o criador de personagem.
  window.SPELLS_BY_LEVEL = window.SPELLS.reduce(function (index, spell) {
    (index[spell.lvl] ||= []).push(spell);
    return index;
  }, {});

  window.findSpell = function (query) {
    const q = String(query || '').trim().toLocaleLowerCase('pt-BR');
    if (!q) return [];
    return window.SPELLS.filter(function (spell) {
      return spell.n.toLocaleLowerCase('pt-BR').includes(q) ||
        spell.en.toLocaleLowerCase('en').includes(q);
    });
  };

  window.getSpells = function (filters) {
    const f = filters || {};
    return window.SPELLS.filter(function (spell) {
      if (f.nivel !== undefined && spell.lvl !== Number(f.nivel)) return false;
      if (f.classe && !spell.classes.includes(f.classe)) return false;
      if (f.escola && spell.escola !== f.escola) return false;
      if (f.ritual !== undefined && spell.ritual !== Boolean(f.ritual)) return false;
      if (f.concentracao !== undefined && spell.concentracao !== Boolean(f.concentracao)) return false;
      return true;
    });
  };
})();
