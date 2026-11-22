const SP = window.SPECIES;
const CL = window.CLASSES;
const CLD = window.CLASS_DESC;
const BG = window.BACKGROUNDS;
const ITEMS = window.ITEMS;
const MAGIC_ITEMS = window.MAGIC_ITEMS;
if (!Array.isArray(SP) || !SP.length) throw new Error("Não foi possível carregar especies.js");
if (!Array.isArray(CL) || !CL.length) throw new Error("Não foi possível carregar classes.js");
if (!Array.isArray(BG) || !BG.length) throw new Error("Não foi possível carregar antecedentes.js");
if (!Array.isArray(ITEMS) || !ITEMS.length) throw new Error("Não foi possível carregar itens.js");
const AB = ["FOR", "DES", "CON", "INT", "SAB", "CAR"];
const ABN = { FOR: "Força", DES: "Destreza", CON: "Constituição", INT: "Inteligência", SAB: "Sabedoria", CAR: "Carisma" };
const SK = { "Acrobacia": "DES", "Adestrar Animais": "SAB", "Arcanismo": "INT", "Atletismo": "FOR", "Atuação": "CAR", "Enganação": "CAR", "Furtividade": "DES", "História": "INT", "Intimidação": "CAR", "Intuição": "SAB", "Investigação": "INT", "Medicina": "SAB", "Natureza": "INT", "Percepção": "SAB", "Persuasão": "CAR", "Prestidigitação": "DES", "Religião": "INT", "Sobrevivência": "SAB" };
const ALL = Object.keys(SK);
const SK_BY_AB = { FOR: ["Atletismo"], DES: ["Acrobacia", "Prestidigitação", "Furtividade"], CON: [], INT: ["Arcanismo", "História", "Investigação", "Natureza", "Religião"], SAB: ["Adestrar Animais", "Intuição", "Medicina", "Percepção", "Sobrevivência"], CAR: ["Atuação", "Enganação", "Intimidação", "Persuasão"] };
CL.forEach((c) => {
  if (c.l === null) c.l = ALL;
});
const STD = [15, 14, 13, 12, 10, 8], COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const S = {
  name: "",
  cls: null,
  sp: null,
  bg: null,
  mode: "21",
  p2: "",
  p1: "",
  method: "std",
  raceQuery: "",
  std: {},
  pb: { FOR: 8, DES: 8, CON: 8, INT: 8, SAB: 8, CAR: 8 },
  man: { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 },
  skills: [],
  rolled: [],
  lang: [],
  align: "",
  modal: null
};
const SUG = { "Artífice": [8, 13, 14, 15, 12, 10], "Bárbaro": [15, 13, 14, 10, 12, 8], "Bardo": [8, 14, 12, 13, 10, 15], "Clérigo": [14, 8, 13, 10, 15, 12], "Druida": [8, 12, 14, 13, 15, 10], "Guerreiro": [15, 14, 13, 8, 10, 12], "Monge": [12, 15, 13, 10, 14, 8], "Paladino": [15, 10, 13, 8, 12, 14], "Guardião": [12, 15, 13, 8, 14, 10], "Ladino": [12, 15, 13, 14, 10, 8], "Feiticeiro": [10, 13, 14, 8, 12, 15], "Bruxo": [8, 14, 13, 12, 10, 15], "Mago": [8, 12, 13, 15, 14, 10] };
const SC = { "Artífice": "INT", "Bardo": "CAR", "Bruxo": "CAR", "Clérigo": "SAB", "Druida": "SAB", "Feiticeiro": "CAR", "Guardião": "SAB", "Mago": "INT", "Paladino": "CAR" };
const ALN = ["Leal e Bom", "Neutro e Bom", "Caótico e Bom", "Leal e Neutro", "Neutro", "Caótico e Neutro", "Leal e Mau", "Neutro e Mau", "Caótico e Mau"];
const LANG = ["Língua de Sinais Comum", "Dracônico", "Anão", "Élfico", "Gigante", "Gnômico", "Goblin", "Halfling", "Orc"];
