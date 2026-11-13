https://alyssoneustaquio.github.io/animalysson-RPG/

Catálogo adicional: `monsters.js` carrega os 322 blocos completos de monstros do SRD 5.2.1 sob CC BY 4.0 por CDN (requer internet). O Livro dos Monstros revisado (2025) tem 510 criaturas, mas seus blocos comerciais completos não estão incluídos no SRD. Consulte o índice oficial em https://www.dndbeyond.com/sources/dnd/mm-2024.

Uso de `monsters.js`: aguarde `await MONSTERS_READY` antes de ler `MONSTERS`. Exemplos: `await findMonster('dragão')`, `await getMonster('Goblin')` e `await getMonsters({ tipo: 'dragão', maxND: 5 })`. O catálogo é carregado pela internet; se estiver offline, `MONSTERS_ERROR` informa a falha e os outros recursos da ficha continuam disponíveis.
