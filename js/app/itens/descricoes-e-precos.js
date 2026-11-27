function itemIcon(item) {
  const t = norm((item.categoria || "") + " " + (item.tipo || ""));
  if (t.includes("arma")) return "⚔";
  if (t.includes("armadura")) return "🛡";
  if (t.includes("pocao") || t.includes("poção")) return "⚗";
  if (t.includes("ferramenta")) return "🧰";
  if (item.magico) return "✦";
  if (t.includes("montaria") || t.includes("veiculo")) return "🐎";
  return "◇";
}
function formatItemPrice(value) {
  return String(value || "Não informado").replace(/\b(CP|SP|EP|GP|PP)\b/g, (c) => ({ CP: "PC", SP: "PP", EP: "PE", GP: "PO", PP: "PL" })[c]);
}
function formatItemWeight(value) {
  return String(value || "Não especificado").replace(/\blb\b/gi, "lb (libras)");
}
function magicPriceByRarity(item) {
  const rarity = (item.raridade || "").toLowerCase();
  const values = { "comum": 100, "incomum": 400, "rara": 4e3, "muito rara": 4e4, "lendária": 2e5, "lendaria": 2e5 };
  if (!values[rarity]) return "Definido pelo Mestre";
  let v = values[rarity];
  const en = (item.en || "").toLowerCase();
  if (/potion|ammunition|bead|elixir|consumable/.test(en) && !/spell scroll/.test(en)) v = Math.round(v / 2);
  return v.toLocaleString("pt-BR") + " PO (estimativa)";
}
function weaponPropertyExplanation(item) {
  const raw = String(item.propriedades || "");
  if (!raw || raw === "—") return "";
  const rules = [
    [/Acuidade/i, "Acuidade", "Você pode usar Força ou Destreza nas jogadas de ataque e dano com esta arma."],
    [/Leve/i, "Leve", "Ao realizar a ação Atacar e atacar com uma arma Leve, você pode fazer um ataque extra com outra arma Leve como ação bônus no mesmo turno. Esse ataque extra não adiciona seu modificador de atributo ao dano, a menos que ele seja negativo."],
    [/Arremesso/i, "Arremesso", "Você pode arremessar a arma para realizar um ataque à distância. Se ela for uma arma corpo a corpo, use o mesmo modificador de atributo usado no ataque corpo a corpo."],
    [/Duas mãos/i, "Duas mãos", "A arma exige as duas mãos quando você faz um ataque com ela."],
    [/Versátil/i, "Versátil", "A arma pode ser usada com uma ou duas mãos. O valor entre parênteses indica o dano quando usada com as duas mãos."],
    [/Munição/i, "Munição", "Você precisa ter a munição apropriada para cada ataque à distância. Sacar a munição faz parte do ataque; ao fim do combate, você recupera metade da munição gasta se dedicar um minuto à busca."],
    [/Carregamento/i, "Carregamento", "Por causa do tempo necessário para carregar a arma, você só pode disparar uma unidade de munição por ação, ação bônus ou reação usada para dispará-la, independentemente do número de ataques que normalmente poderia fazer."],
    [/Pesada/i, "Pesada", "Criaturas Pequenas ou Miúdas têm desvantagem nas jogadas de ataque com esta arma."],
    [/Alcance/i, "Alcance", "A arma aumenta em 1,5 m o alcance que você pode atingir com ela."]
  ];
  const found = rules.filter(([rx]) => rx.test(raw));
  if (!found.length) return "";
  return '<details class="original-details"><summary>Como funcionam as propriedades</summary>' + found.map(([, name, desc]) => `<div class="detail-line"><b>${name}:</b> ${desc}</div>`).join("") + "</details>";
}
function weaponMasteryExplanation(value) {
  const key = String(value || "").toLowerCase().normalize("NFD").replace(/[\̀-\ͯ]/g, "");
  const rules = {
    "cleave": "Uma vez por turno, quando acertar uma criatura, você pode fazer um ataque corpo a corpo contra uma segunda criatura a até 1,5 m da primeira e dentro do seu alcance. Em um acerto, role o dano da arma, mas não adicione o modificador de atributo ao dano, a menos que ele seja negativo.",
    "raspar": "Se errar uma criatura com esta arma, você ainda pode causar dano a ela igual ao modificador de atributo usado na jogada de ataque. O dano é do mesmo tipo da arma.",
    "graze": "Se errar uma criatura com esta arma, você ainda pode causar dano a ela igual ao modificador de atributo usado na jogada de ataque. O dano é do mesmo tipo da arma.",
    "nick": "Quando fizer o ataque extra concedido pela propriedade Leve, você pode fazê-lo como parte da ação Atacar, em vez de uma ação bônus. Você só pode fazer esse ataque extra uma vez por turno.",
    "empurrar": "Quando acertar uma criatura com esta arma, você pode empurrá-la até 3 m para longe de você, desde que ela seja Grande ou menor.",
    "push": "Quando acertar uma criatura com esta arma, você pode empurrá-la até 3 m para longe de você, desde que ela seja Grande ou menor.",
    "sap": "Quando acertar uma criatura com esta arma, ela tem desvantagem na próxima jogada de ataque que fizer antes do início do seu próximo turno.",
    "lento": "Quando acertar uma criatura com esta arma e causar dano, o deslocamento dela é reduzido em 3 m até o início do seu próximo turno. Se acertar novamente, a redução não aumenta.",
    "slow": "Quando acertar uma criatura com esta arma e causar dano, o deslocamento dela é reduzido em 3 m até o início do seu próximo turno. Se acertar novamente, a redução não aumenta.",
    "derrubar": "Quando acertar uma criatura com esta arma, você pode forçá-la a fazer uma salvaguarda de Constituição (CD 8 + seu modificador do atributo usado no ataque + bônus de proficiência). Se falhar, ela fica Caída.",
    "topple": "Quando acertar uma criatura com esta arma, você pode forçá-la a fazer uma salvaguarda de Constituição (CD 8 + seu modificador do atributo usado no ataque + bônus de proficiência). Se falhar, ela fica Caída.",
    "vex": "Quando acertar uma criatura com esta arma e causar dano, você tem vantagem na próxima jogada de ataque contra ela antes do fim do seu próximo turno."
  };
  return rules[key] || "";
}
