/* monsters.js — gerado automaticamente a partir de monsters.json (PT-BR).
 * Não editar à mão; rode translate-monsters.py novamente.
 */
(function () {
  'use strict';
  var RAW = [
  {
    "id": "srd:awakened-shrub",
    "name": "Arbusto Desperto",
    "name_en": "Awakened Shrub",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Planta",
    "type_en": "plant",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 9,
    "hp_max": 10,
    "hp_formula": "3d6",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 11,
        "dex": 8,
        "int": 10,
        "str": 3,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 1,
          "damage": [
            {
              "dice": "1d4-1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +1 para acertar, alcance 1,5 m, um alvo. Acerto: 1 (1d4 - 1) de dano cortante.",
          "name": "Ancinho"
        }
      ],
      "damage_resistances": [
        "perfurante"
      ],
      "damage_vulnerabilities": [
        "fogo"
      ],
      "languages": [
        "one language known by its creator"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "Embora o arbusto permaneça imóvel, é indistinguível de um arbusto normal.",
          "name": "Aparência Falsa"
        }
      ]
    }
  },
  {
    "id": "srd:baboon",
    "name": "Babuíno",
    "name_en": "Baboon",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 12,
    "hp_max": 3,
    "hp_formula": "1d6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 11,
        "dex": 14,
        "int": 4,
        "str": 8,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 1,
          "damage": [
            {
              "dice": "1d4-1",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +1 para acertar, alcance 1,5 m, um alvo. Acerto: 1 (1d4 - 1) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 11
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O babuíno tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do babuíno estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:badger",
    "name": "Texugo",
    "name_en": "Badger",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 10,
    "hp_max": 3,
    "hp_formula": "1d4+1",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 12,
        "dex": 11,
        "int": 2,
        "str": 4,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 2,
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 11
      },
      "speed": {
        "escavação": 5,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O texugo tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        }
      ]
    }
  },
  {
    "id": "srd:bat",
    "name": "Bastão",
    "name_en": "Bat",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 12,
    "hp_max": 1,
    "hp_formula": "1d4-1",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 8,
        "dex": 15,
        "int": 2,
        "str": 2,
        "wis": 12
      },
      "actions": [
        {
          "description": "Ataque Corpo a Corpo com Arma: +0 para acertar, alcance 1,5 m, uma criatura. Acerto: 1 dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 11
      },
      "speed": {
        "voo": 30,
        "deslocamento": 5
      },
      "traits": [
        {
          "description": "O morcego não pode usar sua visão cega enquanto estiver surdo.",
          "name": "Ecolocalização"
        },
        {
          "description": "O morcego tem vantagem em testes de Sabedoria (Percepção) que dependem da audição.",
          "name": "Audição Aguçada"
        }
      ]
    }
  },
  {
    "id": "srd:cat",
    "name": "Gato",
    "name_en": "Cat",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 12,
    "hp_max": 2,
    "hp_formula": "1d4",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 10,
        "dex": 15,
        "int": 3,
        "str": 3,
        "wis": 12
      },
      "actions": [
        {
          "description": "Ataque corpo a corpo com arma: +0 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano cortante.",
          "name": "Garras"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 4
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O gato tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        }
      ]
    }
  },
  {
    "id": "srd:commoner",
    "name": "Plebeu",
    "name_en": "Commoner",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 10,
    "hp_max": 4,
    "hp_formula": "1d8",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 10,
        "dex": 10,
        "int": 10,
        "str": 10,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d4+0",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, um alvo. Acerto: 2 (1d4) de dano de concussão.",
          "name": "Clube"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:crab",
    "name": "Caranguejo",
    "name_en": "Crab",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 11,
    "hp_max": 2,
    "hp_formula": "1d4",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 2,
        "con": 10,
        "dex": 11,
        "int": 1,
        "str": 2,
        "wis": 8
      },
      "actions": [
        {
          "description": "Ataque corpo a corpo com arma: +0 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano de concussão.",
          "name": "Garra"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "percepção passiva": 9
      },
      "skills": {
        "Furtividade": 2
      },
      "speed": {
        "natação": 20,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O caranguejo pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:deer",
    "name": "Cervo",
    "name_en": "Deer",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 13,
    "hp_max": 4,
    "hp_formula": "1d8",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 11,
        "dex": 16,
        "int": 2,
        "str": 11,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d4+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, um alvo. Acerto: 2 (1d4) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 12
      },
      "speed": {
        "deslocamento": 50
      }
    }
  },
  {
    "id": "srd:eagle",
    "name": "Águia",
    "name_en": "Eagle",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 12,
    "hp_max": 3,
    "hp_formula": "1d6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 10,
        "dex": 15,
        "int": 2,
        "str": 6,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d4 + 2) de dano cortante.",
          "name": "Garras"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "voo": 60,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "A águia tem vantagem em testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Visão Aguçada"
        }
      ]
    }
  },
  {
    "id": "srd:frog",
    "name": "Sapo",
    "name_en": "Frog",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 11,
    "hp_max": 1,
    "hp_formula": "1d4-1",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 8,
        "dex": 13,
        "int": 1,
        "str": 1,
        "wis": 8
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 11
      },
      "skills": {
        "Percepção": 1,
        "Furtividade": 3
      },
      "speed": {
        "natação": 20,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O sapo pode respirar ar e água",
          "name": "Anfíbio"
        },
        {
          "description": "O salto em distância do sapo é de até 10 pés e seu salto em altura é de até 5 pés, com ou sem corrida.",
          "name": "Salto em pé"
        }
      ]
    }
  },
  {
    "id": "srd:giant-fire-beetle",
    "name": "Besouro de Fogo Gigante",
    "name_en": "Giant Fire Beetle",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 13,
    "hp_max": 4,
    "hp_formula": "1d6+1",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 12,
        "dex": 10,
        "int": 1,
        "str": 8,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 1,
          "damage": [
            {
              "dice": "1d6-1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +1 para acertar, alcance 1,5 m, um alvo. Acerto: 2 (1d6 - 1) de dano cortante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "percepção passiva": 8
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O besouro emite luz brilhante em um raio de 3 metros e luz fraca por mais 3 metros adicionais.",
          "name": "Iluminação"
        }
      ]
    }
  },
  {
    "id": "srd:goat",
    "name": "Cabra",
    "name_en": "Goat",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 10,
    "hp_max": 4,
    "hp_formula": "1d8",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 11,
        "dex": 10,
        "int": 2,
        "str": 12,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d4+1",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 3 (1d4 + 1) de dano de concussão.",
          "name": "Bater"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se a cabra se mover pelo menos 6 metros em linha reta em direção a um alvo e então acertá-lo com um ataque de aríete no mesmo turno, o alvo sofre 2 (1d4) de dano de concussão extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 10 ou será derrubado.",
          "name": "Cobrar"
        },
        {
          "description": "A cabra tem vantagem nos testes de resistência de Força e Destreza feitos contra efeitos que a derrubariam.",
          "name": "Firme"
        }
      ]
    }
  },
  {
    "id": "srd:hawk",
    "name": "Falcão",
    "name_en": "Hawk",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 13,
    "hp_max": 1,
    "hp_formula": "1d4-1",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 8,
        "dex": 16,
        "int": 2,
        "str": 5,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 5,
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano cortante.",
          "name": "Garras"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "voo": 60,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O falcão tem vantagem em testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Visão Aguçada"
        }
      ]
    }
  },
  {
    "id": "srd:homunculus",
    "name": "Homúnculo",
    "name_en": "Homunculus",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Constructo",
    "type_en": "construct",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 13,
    "hp_max": 5,
    "hp_formula": "2d4",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 11,
        "dex": 15,
        "int": 10,
        "str": 4,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 1 dano perfurante e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 10 ou ficará envenenado por 1 minuto. Se o teste de resistência falhar por 5 ou mais, o alvo fica envenenado por 5 (1d10) minutos e fica inconsciente enquanto estiver envenenado desta forma.",
          "name": "Morder"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "understands the languages of its creator but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "voo": 40,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "Embora o homúnculo esteja no mesmo plano de existência que seu mestre, ele pode transmitir magicamente o que sente ao seu mestre, e os dois podem se comunicar telepaticamente.",
          "name": "Vínculo Telepático"
        }
      ]
    }
  },
  {
    "id": "srd:hyena",
    "name": "Hiena",
    "name_en": "Hyena",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 11,
    "hp_max": 5,
    "hp_formula": "1d8+1",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 12,
        "dex": 13,
        "int": 2,
        "str": 11,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d6+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, um alvo. Acerto: 3 (1d6) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "A hiena tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados da hiena estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:jackal",
    "name": "Chacal",
    "name_en": "Jackal",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 12,
    "hp_max": 3,
    "hp_formula": "1d6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 11,
        "dex": 15,
        "int": 3,
        "str": 8,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 1,
          "damage": [
            {
              "dice": "1d4-1",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +1 para acertar, alcance 1,5 m, um alvo. Acerto: 1 (1d4 - 1) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O chacal tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        },
        {
          "description": "O chacal tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do chacal estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:lemure",
    "name": "Lêmure",
    "name_en": "Lemure",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 7,
    "hp_max": 13,
    "hp_formula": "3d8",
    "initiative_modifier": -3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 11,
        "dex": 5,
        "int": 1,
        "str": 10,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d4+0",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 2 (1d4) de dano de concussão.",
          "name": "Punho"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "frio"
      ],
      "languages": [
        "understands infernal but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 15
      },
      "traits": [
        {
          "description": "A escuridão mágica não impede a visão no escuro do lêmure.",
          "name": "Visão do Diabo"
        },
        {
          "description": "Um lêmure que morre nos Nove Infernos volta à vida com todos os seus pontos de vida em 1d10 dias, a menos que seja morto por uma criatura de tendência boa com um feitiço de bênção lançado naquela criatura ou seus restos sejam borrifados com água benta.",
          "name": "Rejuvenescimento Infernal"
        }
      ]
    }
  },
  {
    "id": "srd:lizard",
    "name": "Lagarto",
    "name_en": "Lizard",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 10,
    "hp_max": 2,
    "hp_formula": "1d4",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 10,
        "dex": 11,
        "int": 1,
        "str": 2,
        "wis": 8
      },
      "actions": [
        {
          "description": "Ataque corpo a corpo com arma: +0 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 9
      },
      "speed": {
        "escalada": 20,
        "deslocamento": 20
      }
    }
  },
  {
    "id": "srd:octopus",
    "name": "Polvo",
    "name_en": "Octopus",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 12,
    "hp_max": 3,
    "hp_formula": "1d6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 11,
        "dex": 15,
        "int": 3,
        "str": 4,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano de concussão e o alvo é agarrado (CD de fuga 10). Até que a luta termine, o polvo não poderá usar seus tentáculos em outro alvo.",
          "name": "Tentáculos"
        },
        {
          "description": "Uma nuvem de tinta com 1,5 metro de raio se estende ao redor do polvo se ele estiver debaixo d'água. A área fica fortemente obscurecida por 1 minuto, embora uma corrente significativa possa dispersar a tinta. Depois de liberar a tinta, o polvo pode usar a ação Dash como ação bônus.",
          "name": "Nuvem de tinta (recarrega após um descanso curto ou longo)"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2,
        "Furtividade": 4
      },
      "speed": {
        "natação": 30,
        "deslocamento": 5
      },
      "traits": [
        {
          "description": "Fora da água, o polvo consegue prender a respiração por 30 minutos.",
          "name": "Prenda a respiração"
        },
        {
          "description": "O polvo tem vantagem em testes de Destreza (Furtividade) feitos enquanto estiver debaixo d'água.",
          "name": "Camuflagem Subaquática"
        },
        {
          "description": "O polvo só consegue respirar debaixo d'água.",
          "name": "Respiração na Água"
        }
      ]
    }
  },
  {
    "id": "srd:owl",
    "name": "Coruja",
    "name_en": "Owl",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 11,
    "hp_max": 1,
    "hp_formula": "1d4-1",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 8,
        "dex": 13,
        "int": 2,
        "str": 3,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 3,
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano cortante.",
          "name": "Garras"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 3
      },
      "speed": {
        "voo": 60,
        "deslocamento": 5
      },
      "traits": [
        {
          "description": "A coruja não provoca ataques de oportunidade quando voa para fora do alcance do inimigo.",
          "name": "Sobrevôo"
        },
        {
          "description": "A coruja tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou visão.",
          "name": "Audição e visão aguçadas"
        }
      ]
    }
  },
  {
    "id": "srd:quipper",
    "name": "Quiper",
    "name_en": "Quipper",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 13,
    "hp_max": 1,
    "hp_formula": "1d4-1",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 2,
        "con": 9,
        "dex": 16,
        "int": 1,
        "str": 2,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 5,
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 8
      },
      "speed": {
        "natação": 40
      },
      "traits": [
        {
          "description": "O quipper tem vantagem em jogadas de ataque corpo a corpo contra qualquer criatura que não tenha todos os seus pontos de vida.",
          "name": "Frenesi de Sangue"
        },
        {
          "description": "O quipper só consegue respirar debaixo d'água.",
          "name": "Respiração na Água"
        }
      ]
    }
  },
  {
    "id": "srd:rat",
    "name": "Rato",
    "name_en": "Rat",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 10,
    "hp_max": 1,
    "hp_formula": "1d4-1",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 9,
        "dex": 11,
        "int": 2,
        "str": 2,
        "wis": 10
      },
      "actions": [
        {
          "description": "Ataque corpo a corpo com arma: +0 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O rato tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        }
      ]
    }
  },
  {
    "id": "srd:raven",
    "name": "Corvo",
    "name_en": "Raven",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 12,
    "hp_max": 1,
    "hp_formula": "1d4-1",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 8,
        "dex": 14,
        "int": 2,
        "str": 2,
        "wis": 12
      },
      "actions": [
        {
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano perfurante.",
          "name": "Bico"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "voo": 50,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O corvo pode imitar sons simples que ouviu, como o sussurro de uma pessoa, o choro de um bebê ou o chilrear de um animal. Uma criatura que ouve os sons pode dizer que são imitações com um teste bem-sucedido de Sabedoria (Intuição) CD 10.",
          "name": "Mimetismo"
        }
      ]
    }
  },
  {
    "id": "srd:scorpion",
    "name": "Escorpião",
    "name_en": "Scorpion",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 11,
    "hp_max": 1,
    "hp_formula": "1d4-1",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 2,
        "con": 8,
        "dex": 11,
        "int": 1,
        "str": 2,
        "wis": 8
      },
      "actions": [
        {
          "attack_bonus": 2,
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, uma criatura. Acerto: 1 dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 9, sofrendo 4 (1d8) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso.",
          "name": "Picada"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 9
      },
      "speed": {
        "deslocamento": 10
      }
    }
  },
  {
    "id": "srd:sea-horse",
    "name": "Cavalo Marinho",
    "name_en": "Sea Horse",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 11,
    "hp_max": 1,
    "hp_formula": "1d4-1",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 2,
        "con": 8,
        "dex": 12,
        "int": 1,
        "str": 1,
        "wis": 10
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "natação": 20
      },
      "traits": [
        {
          "description": "O cavalo-marinho só consegue respirar debaixo d'água.",
          "name": "Respiração na Água"
        }
      ]
    }
  },
  {
    "id": "srd:shrieker",
    "name": "Gritador",
    "name_en": "Shrieker",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Planta",
    "type_en": "plant",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 5,
    "hp_max": 13,
    "hp_formula": "3d8",
    "initiative_modifier": -5,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 10,
        "dex": 1,
        "int": 1,
        "str": 1,
        "wis": 3
      },
      "actions": [
        {
          "description": "Quando uma luz brilhante ou uma criatura está a até 9 metros do gritador, ela emite um grito audível a até 90 metros dele. O gritador continua a gritar até que a perturbação saia do alcance e durante 1d4 turnos do gritador depois disso",
          "name": "Gritar"
        }
      ],
      "condition_immunities": [
        "Cego",
        "Surdo",
        "Amedrontado"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "percepção passiva": 6
      },
      "speed": {
        "deslocamento": 0
      },
      "traits": [
        {
          "description": "Embora o grito permaneça imóvel, ele é indistinguível de um fungo comum.",
          "name": "Aparência Falsa"
        }
      ]
    }
  },
  {
    "id": "srd:spider",
    "name": "Aranha",
    "name_en": "Spider",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 12,
    "hp_max": 1,
    "hp_formula": "1d4-1",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 2,
        "con": 8,
        "dex": 14,
        "int": 1,
        "str": 2,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 1 dano perfurante e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 9 ou sofrerá 2 (1d4) de dano venenoso.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 12
      },
      "skills": {
        "Furtividade": 4
      },
      "speed": {
        "escalada": 20,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "A aranha pode escalar superfícies difíceis, inclusive de cabeça para baixo em tetos, sem precisar fazer um teste de habilidade.",
          "name": "Escalada de aranha"
        },
        {
          "description": "Enquanto estiver em contato com uma teia, a aranha sabe a localização exata de qualquer outra criatura em contato com a mesma teia.",
          "name": "Sentido da Web"
        },
        {
          "description": "A aranha ignora as restrições de movimento causadas pelas teias.",
          "name": "Caminhante da Web"
        }
      ]
    }
  },
  {
    "id": "srd:vulture",
    "name": "Abutre",
    "name_en": "Vulture",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 10,
    "hp_max": 5,
    "hp_formula": "1d8+1",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 13,
        "dex": 10,
        "int": 2,
        "str": 7,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d4+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, um alvo. Acerto: 2 (1d4) de dano perfurante.",
          "name": "Bico"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "voo": 50,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O abutre tem vantagem em testes de Sabedoria (Percepção) que dependem da visão ou do olfato.",
          "name": "Visão e olfato aguçados"
        },
        {
          "description": "O abutre tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do abutre estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:weasel",
    "name": "Doninha",
    "name_en": "Weasel",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "0",
    "cr_numeric": 0.0,
    "armor_class": 13,
    "hp_max": 1,
    "hp_formula": "1d4-1",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 8,
        "dex": 16,
        "int": 2,
        "str": 3,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, uma criatura. Acerto: 1 dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 5
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A doninha tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        }
      ]
    }
  },
  {
    "id": "srd:bandit",
    "name": "Bandido",
    "name_en": "Bandit",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 12,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 12,
        "dex": 12,
        "int": 10,
        "str": 11,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d6 + 1) de dano cortante.",
          "name": "Cimitarra"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d8+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +3 para acertar, alcance 80/320 pés, um alvo. Acerto: 5 (1d8 + 1) de dano perfurante.",
          "name": "Besta Leve"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:blood-hawk",
    "name": "Falcão de Sangue",
    "name_en": "Blood Hawk",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 12,
    "hp_max": 7,
    "hp_formula": "2d6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 10,
        "dex": 14,
        "int": 3,
        "str": 6,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d4 + 2) de dano perfurante.",
          "name": "Bico"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "voo": 60,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O falcão tem vantagem em testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Visão Aguçada"
        },
        {
          "description": "O falcão tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do falcão estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:camel",
    "name": "Camelo",
    "name_en": "Camel",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 9,
    "hp_max": 15,
    "hp_formula": "2d10+4",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 14,
        "dex": 8,
        "int": 2,
        "str": 16,
        "wis": 8
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d4+0",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 2 (1d4) de dano de concussão.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 9
      },
      "speed": {
        "deslocamento": 50
      }
    }
  },
  {
    "id": "srd:cultist",
    "name": "Cultista",
    "name_en": "Cultist",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 12,
    "hp_max": 9,
    "hp_formula": "2d8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 10,
        "dex": 12,
        "int": 10,
        "str": 11,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, uma criatura. Acerto: 4 (1d6 + 1) de dano cortante.",
          "name": "Cimitarra"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "skills": {
        "Enganação": 2,
        "Religião": 2
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O cultista tem vantagem nos testes de resistência contra ficar encantado ou assustado.",
          "name": "Devoção Negra"
        }
      ]
    }
  },
  {
    "id": "srd:flying-snake",
    "name": "Cobra Voadora",
    "name_en": "Flying Snake",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 14,
    "hp_max": 5,
    "hp_formula": "2d4",
    "initiative_modifier": 4,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 11,
        "dex": 18,
        "int": 2,
        "str": 4,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 6,
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano perfurante mais 7 (3d4) de dano venenoso.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 11
      },
      "speed": {
        "voo": 60,
        "natação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A cobra não provoca ataques de oportunidade quando voa para fora do alcance do inimigo.",
          "name": "Sobrevôo"
        }
      ]
    }
  },
  {
    "id": "srd:giant-crab",
    "name": "Caranguejo Gigante",
    "name_en": "Giant Crab",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 15,
    "hp_max": 13,
    "hp_formula": "3d8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 11,
        "dex": 15,
        "int": 1,
        "str": 13,
        "wis": 9
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d6 + 1) de dano de concussão e o alvo é agarrado (CD de fuga 11). O caranguejo tem duas garras, cada uma das quais pode agarrar apenas um alvo.",
          "name": "Garra"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "percepção passiva": 9
      },
      "skills": {
        "Furtividade": 4
      },
      "speed": {
        "natação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O caranguejo pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:giant-rat",
    "name": "Rato Gigante",
    "name_en": "Giant Rat",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 12,
    "hp_max": 7,
    "hp_formula": "2d6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 11,
        "dex": 15,
        "int": 2,
        "str": 7,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d4 + 2) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O rato tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        },
        {
          "description": "O rato tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do rato estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:giant-rat-diseased",
    "name": "Rato Gigante (Doente)",
    "name_en": "Giant Rat (Diseased)",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 12,
    "hp_max": 7,
    "hp_formula": "2d6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 11,
        "dex": 15,
        "int": 2,
        "str": 7,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Constituição CD 10 ou contrairá uma doença. Até que a doença seja curada, o alvo não pode recuperar pontos de vida exceto por meios mágicos, e o máximo de pontos de vida do alvo diminui em 3 (1d6) a cada 24 horas. Se o máximo de pontos de vida do alvo cair para 0 como resultado desta doença, o alvo morre.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:giant-weasel",
    "name": "Doninha Gigante",
    "name_en": "Giant Weasel",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 13,
    "hp_max": 9,
    "hp_formula": "2d8",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 10,
        "dex": 16,
        "int": 4,
        "str": 11,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d4+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d4 + 3) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 5
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "A doninha tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        }
      ]
    }
  },
  {
    "id": "srd:guard",
    "name": "Guarda",
    "name_en": "Guard",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 16,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 12,
        "dex": 12,
        "int": 10,
        "str": 13,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma corpo a corpo ou de longo alcance: +3 para acertar, alcance 1,5 m ou alcance de 6/18 m, um alvo. Acerto: 4 (1d6 + 1) de dano perfurante, ou 5 (1d8 + 1) de dano perfurante se usado com as duas mãos para fazer um ataque corpo a corpo.",
          "name": "Lança"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2
      },
      "speed": {
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:kobold",
    "name": "Kobold",
    "name_en": "Kobold",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 12,
    "hp_max": 5,
    "hp_formula": "2d6-2",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 9,
        "dex": 15,
        "int": 8,
        "str": 7,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d4 + 2) de dano perfurante.",
          "name": "Punhal"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 30/120 pés, um alvo. Acerto: 4 (1d4 + 2) de dano de concussão.",
          "name": "Funda"
        }
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 8
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Enquanto estiver sob a luz do sol, o kobold tem desvantagem nas jogadas de ataque, bem como nos testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Sensibilidade à luz solar"
        },
        {
          "description": "O kobold tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do kobold estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:mastiff",
    "name": "Mastim",
    "name_en": "Mastiff",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 12,
    "hp_max": 5,
    "hp_formula": "1d8+1",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 12,
        "dex": 14,
        "int": 3,
        "str": 13,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d6 + 1) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 11 ou será derrubado.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O mastim tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        }
      ]
    }
  },
  {
    "id": "srd:merfolk",
    "name": "Tritão",
    "name_en": "Merfolk",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 11,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 12,
        "dex": 13,
        "int": 11,
        "str": 10,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d6+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma corpo a corpo ou de longo alcance: +2 para acertar, alcance 1,5 m ou alcance de 6/18 m, um alvo. Acerto: 3 (1d6) de dano perfurante, ou 4 (1d8) de dano perfurante se usado com as duas mãos para fazer um ataque corpo a corpo.",
          "name": "Lança"
        }
      ],
      "languages": [
        "Aquan",
        "Comum"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2
      },
      "speed": {
        "natação": 40,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "Os tritões podem respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:mule",
    "name": "Mula",
    "name_en": "Mule",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 10,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 13,
        "dex": 10,
        "int": 2,
        "str": 14,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d4 + 2) de dano de concussão.",
          "name": "Cascos"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "A mula é considerada um animal de grande porte para fins de determinação de sua capacidade de carga.",
          "name": "Besta de Carga"
        },
        {
          "description": "A mula tem vantagem nos testes de resistência de Força e Destreza feitos contra efeitos que a derrubariam.",
          "name": "Firme"
        }
      ]
    }
  },
  {
    "id": "srd:noble",
    "name": "Nobre",
    "name_en": "Noble",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 15,
    "hp_max": 9,
    "hp_formula": "2d8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 11,
        "dex": 12,
        "int": 12,
        "str": 11,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d8+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d8 + 1) de dano perfurante.",
          "name": "Florete"
        }
      ],
      "languages": [
        "any two languages"
      ],
      "reactions": [
        {
          "description": "O nobre adiciona 2 à sua CA contra um ataque corpo a corpo que o acerte. Para fazer isso, o nobre deve ver o atacante e estar empunhando uma arma branca.",
          "name": "Desviar"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 12
      },
      "skills": {
        "Enganação": 5,
        "Intuição": 4,
        "Persuasão": 5
      },
      "speed": {
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:poisonous-snake",
    "name": "Cobra Venenosa",
    "name_en": "Poisonous Snake",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 13,
    "hp_max": 2,
    "hp_formula": "1d4",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 11,
        "dex": 16,
        "int": 1,
        "str": 2,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 5,
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 10, sofrendo 5 (2d4) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 10
      },
      "speed": {
        "natação": 30,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:pony",
    "name": "Pônei",
    "name_en": "Pony",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 10,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 13,
        "dex": 10,
        "int": 2,
        "str": 15,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d4+2",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (2d4 + 2) de dano de concussão.",
          "name": "Cascos"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:stirge",
    "name": "Mexa",
    "name_en": "Stirge",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 14,
    "hp_max": 2,
    "hp_formula": "1d4",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 11,
        "dex": 16,
        "int": 2,
        "str": 4,
        "wis": 8
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d4+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, uma criatura. Acerto: 5 (1d4 + 3) de dano perfurante e o movimento se fixa no alvo. Enquanto anexado, o Stirge não ataca. Em vez disso, no início de cada turno do Stirge, o alvo perde 5 (1d4 + 3) pontos de vida devido à perda de sangue.\nO Stirge pode se separar gastando 1,5 metro de seu movimento. Isso acontece depois de drenar 10 pontos de vida de sangue do alvo ou o alvo morrer. Uma criatura, incluindo o alvo, pode usar sua ação para separar o movimento.",
          "name": "Drenagem de Sangue"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 9
      },
      "speed": {
        "voo": 40,
        "deslocamento": 10
      }
    }
  },
  {
    "id": "srd:tribal-warrior",
    "name": "Guerreiro Tribal",
    "name_en": "Tribal Warrior",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/8",
    "cr_numeric": 0.125,
    "armor_class": 12,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 12,
        "dex": 11,
        "int": 8,
        "str": 13,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma corpo a corpo ou de longo alcance: +3 para acertar, alcance 1,5 m ou alcance de 6/18 m, um alvo. Acerto: 4 (1d6 + 1) de dano perfurante, ou 5 (1d8 + 1) de dano perfurante se usado com as duas mãos para fazer um ataque corpo a corpo.",
          "name": "Lança"
        }
      ],
      "languages": [
        "any one language"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O guerreiro tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do guerreiro estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:acolyte",
    "name": "Acólito",
    "name_en": "Acolyte",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 10,
    "hp_max": 9,
    "hp_formula": "2d8",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 10,
        "dex": 10,
        "int": 10,
        "str": 10,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d4+0",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, um alvo. Acerto: 2 (1d4) de dano de concussão.",
          "name": "Clube"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 12
      },
      "skills": {
        "Medicina": 4,
        "Religião": 2
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O acólito é um conjurador de 1º nível. Sua habilidade de lançar feitiços é Sabedoria (resistência de feitiço CD 12, +4 para acertar com ataques de feitiço). O acólito tem os seguintes feitiços de clérigo preparados:\n\n* Truques (à vontade): luz, chama sagrada, taumaturgia\n* 1º nível (3 espaços): abençoar, curar feridas, santuário",
          "name": "Feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:axe-beak",
    "name": "Bico de Machado",
    "name_en": "Axe Beak",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 11,
    "hp_max": 19,
    "hp_formula": "3d10+3",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 12,
        "dex": 12,
        "int": 2,
        "str": 14,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d8 + 2) de dano cortante.",
          "name": "Bico"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 50
      }
    }
  },
  {
    "id": "srd:blink-dog",
    "name": "Cachorro Pisca",
    "name_en": "Blink Dog",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fada",
    "type_en": "fey",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 13,
    "hp_max": 22,
    "hp_formula": "4d8+4",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 12,
        "dex": 17,
        "int": 10,
        "str": 12,
        "wis": 13
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d6 + 1) de dano perfurante.",
          "name": "Morder"
        },
        {
          "description": "O cão se teletransporta magicamente, junto com qualquer equipamento que esteja usando ou carregando, até 12 metros para um espaço desocupado que possa ver. Antes ou depois do teletransporte, o cão pode fazer um ataque de mordida.",
          "name": "Teletransporte (recarga 4-6)"
        }
      ],
      "languages": [
        "Blink Dog",
        "understands Sylvan but can't speak it"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 5
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O cão tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        }
      ]
    }
  },
  {
    "id": "srd:boar",
    "name": "Javali",
    "name_en": "Boar",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 11,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 12,
        "dex": 11,
        "int": 2,
        "str": 13,
        "wis": 9
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d6 + 1) de dano cortante.",
          "name": "Presa"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 9
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o javali se mover pelo menos 6 metros em linha reta em direção a um alvo e então acertá-lo com um ataque de presa no mesmo turno, o alvo sofre 3 (1d6) de dano cortante extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 11 ou será derrubado.",
          "name": "Cobrar"
        },
        {
          "description": "Se o javali sofrer 7 pontos de dano ou menos que o reduziriam a 0 pontos de vida, ele será reduzido a 1 ponto de vida.",
          "name": "Implacável (recarrega após um descanso curto ou longo)"
        }
      ]
    }
  },
  {
    "id": "srd:constrictor-snake",
    "name": "Cobra Constritora",
    "name_en": "Constrictor Snake",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 12,
    "hp_max": 13,
    "hp_formula": "2d10+2",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 12,
        "dex": 14,
        "int": 1,
        "str": 15,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 6 (1d8 + 2) de dano de concussão e o alvo é agarrado (CD de fuga 14). Até que esta luta termine, a criatura estará contida e a cobra não poderá constringir outro alvo.",
          "name": "Contrair"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 10
      },
      "speed": {
        "natação": 30,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:draft-horse",
    "name": "Cavalo de tração",
    "name_en": "Draft Horse",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 10,
    "hp_max": 19,
    "hp_formula": "3d10+3",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 12,
        "dex": 10,
        "int": 2,
        "str": 18,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d4+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (2d4 + 4) de dano de concussão.",
          "name": "Cascos"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:dretch",
    "name": "Dretch",
    "name_en": "Dretch",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 11,
    "hp_max": 18,
    "hp_formula": "4d6+4",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 12,
        "dex": 11,
        "int": 5,
        "str": 11,
        "wis": 8
      },
      "actions": [
        {
          "description": "O dretch faz dois ataques: um com a mordida e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d6+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, um alvo. Acerto: 3 (1d6) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "2d4+0",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (2d4) de dano cortante.",
          "name": "Garras"
        },
        {
          "description": "Um raio de 3 metros de gás verde nojento se estende da poça. O gás se espalha pelos cantos e sua área fica levemente obscurecida. Dura 1 minuto ou até que um vento forte o disperse. Qualquer criatura que comece seu turno naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 11 ou ficará envenenada até o início de seu próximo turno. Enquanto estiver envenenado desta forma, o alvo pode realizar uma ação ou uma ação bônus em seu turno, não ambas, e não pode realizar reações.",
          "name": "Nuvem Fétida (1/Dia)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "frio",
        "fogo",
        "elétrico"
      ],
      "languages": [
        "Abissal",
        "telepathy 60 ft. (works only with creatures that understand Abyssal)"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 9
      },
      "speed": {
        "deslocamento": 20
      }
    }
  },
  {
    "id": "srd:drow",
    "name": "Drow",
    "name_en": "Drow",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 15,
    "hp_max": 13,
    "hp_formula": "3d8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 10,
        "dex": 14,
        "int": 11,
        "str": 10,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Espada curta"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 30/120 pés, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 13 ou será envenenado por 1 hora. Se o teste de resistência falhar por 5 ou mais, o alvo também ficará inconsciente enquanto estiver envenenado desta forma. O alvo acorda se sofrer dano ou se outra criatura realizar uma ação para acordá-lo.",
          "name": "Besta de mão"
        }
      ],
      "languages": [
        "Élfico",
        "Subcomum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2,
        "Furtividade": 4
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O drow tem vantagem nos testes de resistência contra ser enfeitiçado, e a magia não pode fazer o drow dormir.",
          "name": "Ancestrais Feéricos"
        },
        {
          "description": "A habilidade de conjuração do drow é Carisma (resistência ao feitiço CD 11). Ele pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\nÀ vontade: luzes dançantes\n1/dia cada: escuridão, fogo das fadas",
          "name": "Feitiço Inato"
        },
        {
          "description": "Enquanto estiver sob a luz do sol, o drow tem desvantagem nas jogadas de ataque, bem como nos testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Sensibilidade à luz solar"
        }
      ]
    }
  },
  {
    "id": "srd:elk",
    "name": "Alce",
    "name_en": "Elk",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 10,
    "hp_max": 13,
    "hp_formula": "2d10+2",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 12,
        "dex": 10,
        "int": 2,
        "str": 16,
        "wis": 10
      },
      "actions": [
        {
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano de concussão.",
          "name": "Bater"
        },
        {
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, uma criatura caída. Acerto: 8 (2d4 + 3) de dano de concussão.",
          "name": "Cascos"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "Se o alce se mover pelo menos 6 metros em linha reta em direção a um alvo e então acertá-lo com um ataque de aríete no mesmo turno, o alvo sofre 7 (2d6) de dano extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 13 ou será derrubado.",
          "name": "Cobrar"
        }
      ]
    }
  },
  {
    "id": "srd:flying-sword",
    "name": "Espada Voadora",
    "name_en": "Flying Sword",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Constructo",
    "type_en": "construct",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 17,
    "hp_max": 17,
    "hp_formula": "5d6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 11,
        "dex": 15,
        "int": 1,
        "str": 12,
        "wis": 5
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d8+1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d8 + 1) de dano cortante.",
          "name": "Espada Longa"
        }
      ],
      "condition_immunities": [
        "Cego",
        "Enfeitiçado",
        "Surdo",
        "Amedrontado",
        "Paralisado",
        "Petrificado",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno",
        "psíquico"
      ],
      "saving_throws": {
        "dex": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 7
      },
      "speed": {
        "voo": 50,
        "pairar": true
      },
      "traits": [
        {
          "description": "A espada fica incapacitada enquanto estiver na área de um campo antimagia. Se for alvo de dissipar magia, a espada deve ser bem sucedida em um teste de resistência de Constituição contra a CD de resistência do feitiço do conjurador ou ficará inconsciente por 1 minuto.",
          "name": "Suscetibilidade Antimágica"
        },
        {
          "description": "Embora a espada permaneça imóvel e não voe, ela é indistinguível de uma espada normal.",
          "name": "Aparência Falsa"
        }
      ]
    }
  },
  {
    "id": "srd:giant-badger",
    "name": "Texugo Gigante",
    "name_en": "Giant Badger",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 10,
    "hp_max": 13,
    "hp_formula": "2d8+4",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 15,
        "dex": 10,
        "int": 2,
        "str": 13,
        "wis": 12
      },
      "actions": [
        {
          "description": "O texugo faz dois ataques: um com a mordida e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d6 + 1) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "2d4+1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (2d4 + 1) de dano cortante.",
          "name": "Garras"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 11
      },
      "speed": {
        "escavação": 10,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O texugo tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        }
      ]
    }
  },
  {
    "id": "srd:giant-bat",
    "name": "Morcego Gigante",
    "name_en": "Giant Bat",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 13,
    "hp_max": 22,
    "hp_formula": "4d10",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 11,
        "dex": 16,
        "int": 2,
        "str": 15,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 11
      },
      "speed": {
        "voo": 60,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O morcego não pode usar sua visão cega enquanto estiver surdo.",
          "name": "Ecolocalização"
        },
        {
          "description": "O morcego tem vantagem em testes de Sabedoria (Percepção) que dependem da audição.",
          "name": "Audição Aguçada"
        }
      ]
    }
  },
  {
    "id": "srd:giant-centipede",
    "name": "Centopéia Gigante",
    "name_en": "Giant Centipede",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 13,
    "hp_max": 4,
    "hp_formula": "1d6+1",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 12,
        "dex": 14,
        "int": 1,
        "str": 5,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 4 (1d4 + 2) de dano perfurante, e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 11 ou sofrerá 10 (3d6) de dano venenoso. Se o dano de veneno reduzir o alvo a 0 pontos de vida, o alvo fica estável, mas envenenado por 1 hora, mesmo após recuperar pontos de vida, e fica paralisado enquanto estiver envenenado desta forma.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "percepção passiva": 8
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:giant-frog",
    "name": "Sapo Gigante",
    "name_en": "Giant Frog",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 11,
    "hp_max": 18,
    "hp_formula": "4d8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 11,
        "dex": 13,
        "int": 2,
        "str": 12,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d6 + 1) de dano perfurante e o alvo é agarrado (CD de fuga 11). Até que a luta termine, o alvo fica contido e o sapo não pode morder outro alvo.",
          "name": "Morder"
        },
        {
          "description": "O sapo realiza um ataque de mordida contra um alvo Pequeno ou menor que esteja agarrando. Se o ataque acertar, o alvo é engolido e a luta termina. O alvo engolido fica cego e contido, tem cobertura total contra ataques e outros efeitos externos ao sapo e sofre 5 (2d4) de dano ácido no início de cada turno do sapo. O sapo pode ter apenas um alvo engolido por vez. Se o sapo morrer, a criatura engolida não será mais contida por ele e poderá escapar do cadáver usando 1,5 metro de movimento, saindo caída.",
          "name": "Engolir"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2,
        "Furtividade": 3
      },
      "speed": {
        "natação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O sapo pode respirar ar e água",
          "name": "Anfíbio"
        },
        {
          "description": "O salto em distância do sapo é de até 20 pés e seu salto em altura é de até 10 pés, com ou sem corrida.",
          "name": "Salto em pé"
        }
      ]
    }
  },
  {
    "id": "srd:giant-lizard",
    "name": "Lagarto Gigante",
    "name_en": "Giant Lizard",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 12,
    "hp_max": 19,
    "hp_formula": "3d10+3",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 13,
        "dex": 12,
        "int": 2,
        "str": 15,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d8 + 2) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 10
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O lagarto pode prender a respiração por 15 minutos. (Um lagarto que possui essa característica também possui um deslocamento de natação de 9 metros.)",
          "name": "Variante: Prenda a Respiração"
        },
        {
          "description": "O lagarto pode escalar superfícies difíceis, inclusive tetos de cabeça para baixo, sem precisar fazer um teste de habilidade.",
          "name": "Variante: Escalada de Aranha"
        }
      ]
    }
  },
  {
    "id": "srd:giant-owl",
    "name": "Coruja Gigante",
    "name_en": "Giant Owl",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 12,
    "hp_max": 19,
    "hp_formula": "3d10+3",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 12,
        "dex": 15,
        "int": 8,
        "str": 13,
        "wis": 13
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "2d6+1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (2d6 + 1) de dano cortante.",
          "name": "Garras"
        }
      ],
      "languages": [
        "Giant Owl",
        "understands Common",
        "Élfico",
        "and Sylvan but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 15
      },
      "skills": {
        "Percepção": 5,
        "Furtividade": 4
      },
      "speed": {
        "voo": 60,
        "deslocamento": 5
      },
      "traits": [
        {
          "description": "A coruja não provoca ataques de oportunidade quando voa para fora do alcance do inimigo.",
          "name": "Sobrevôo"
        },
        {
          "description": "A coruja tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou visão.",
          "name": "Audição e visão aguçadas"
        }
      ]
    }
  },
  {
    "id": "srd:giant-poisonous-snake",
    "name": "Cobra Venenosa Gigante",
    "name_en": "Giant Poisonous Snake",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 14,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 4,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 13,
        "dex": 18,
        "int": 2,
        "str": 10,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d4+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 metros, um alvo. Acerto: 6 (1d4 + 4) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 11, sofrendo 10 (3d6) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2
      },
      "speed": {
        "natação": 30,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:giant-wolf-spider",
    "name": "Aranha Lobo Gigante",
    "name_en": "Giant Wolf Spider",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 13,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 13,
        "dex": 16,
        "int": 3,
        "str": 12,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, uma criatura. Acerto: 4 (1d6 + 1) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 11, sofrendo 7 (2d6) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso. Se o dano de veneno reduzir o alvo a 0 pontos de vida, o alvo fica estável, mas envenenado por 1 hora, mesmo após recuperar pontos de vida, e fica paralisado enquanto estiver envenenado desta forma.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 7
      },
      "speed": {
        "escalada": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "A aranha pode escalar superfícies difíceis, inclusive de cabeça para baixo em tetos, sem precisar fazer um teste de habilidade.",
          "name": "Escalada de aranha"
        },
        {
          "description": "Enquanto estiver em contato com uma teia, a aranha sabe a localização exata de qualquer outra criatura em contato com a mesma teia.",
          "name": "Sentido da Web"
        },
        {
          "description": "A aranha ignora as restrições de movimento causadas pelas teias.",
          "name": "Caminhante da Web"
        }
      ]
    }
  },
  {
    "id": "srd:goblin",
    "name": "Duende",
    "name_en": "Goblin",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 15,
    "hp_max": 7,
    "hp_formula": "2d6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 10,
        "dex": 14,
        "int": 10,
        "str": 8,
        "wis": 8
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano cortante.",
          "name": "Cimitarra"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 80/320 pés, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Arco curto"
        }
      ],
      "languages": [
        "Comum",
        "Goblin"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 9
      },
      "skills": {
        "Furtividade": 6
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O goblin pode realizar a ação Desengajar ou Esconder-se como uma ação bônus em cada um de seus turnos.",
          "name": "Fuga ágil"
        }
      ]
    }
  },
  {
    "id": "srd:grimlock",
    "name": "Grimlock",
    "name_en": "Grimlock",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 11,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 12,
        "dex": 12,
        "int": 9,
        "str": 16,
        "wis": 8
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d4+1d4+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d4 + 3) de dano contundente mais 2 (1d4) de dano perfurante.",
          "name": "Clube de Ossos Cravados"
        }
      ],
      "condition_immunities": [
        "Cego"
      ],
      "languages": [
        "Subcomum"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "percepção passiva": 13
      },
      "skills": {
        "Atletismo": 5,
        "Percepção": 3,
        "Furtividade": 3
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O grimlock não pode usar sua visão cega enquanto estiver surdo e incapaz de cheirar.",
          "name": "Sentidos cegos"
        },
        {
          "description": "O grimlock tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        },
        {
          "description": "O grimlock tem vantagem em testes de Destreza (Furtividade) feitos para se esconder em terreno rochoso.",
          "name": "Camuflagem de Pedra"
        }
      ]
    }
  },
  {
    "id": "srd:panther",
    "name": "Pantera",
    "name_en": "Panther",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 12,
    "hp_max": 13,
    "hp_formula": "3d8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 10,
        "dex": 15,
        "int": 3,
        "str": 14,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d4 + 2) de dano cortante.",
          "name": "Garra"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 6
      },
      "speed": {
        "escalada": 40,
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "A pantera tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        },
        {
          "description": "Se a pantera se mover pelo menos 6 metros em linha reta em direção a uma criatura e então acertá-la com um ataque de garra no mesmo turno, o alvo deve ser bem sucedido em um teste de resistência de Força CD 12 ou será derrubado. Se o alvo estiver caído, a pantera pode realizar um ataque de mordida contra ele como uma ação bônus.",
          "name": "Atacar"
        }
      ]
    }
  },
  {
    "id": "srd:pseudodragon",
    "name": "Pseudodragão",
    "name_en": "Pseudodragon",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 13,
    "hp_max": 7,
    "hp_formula": "2d4+2",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 13,
        "dex": 15,
        "int": 10,
        "str": 6,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d4 + 2) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 4 (1d4 + 2) de dano perfurante e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 11 ou ficará envenenado por 1 hora. Se o teste de resistência falhar por 5 ou mais, o alvo fica inconsciente pela mesma duração, ou até sofrer dano ou outra criatura usar uma ação para acordá-lo.",
          "name": "Picada"
        }
      ],
      "languages": [
        "understands Common and Draconic but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 4
      },
      "speed": {
        "voo": 60,
        "deslocamento": 15
      },
      "traits": [
        {
          "description": "O pseudodragão tem vantagem em testes de Sabedoria (Percepção) que dependem de visão, audição ou olfato.",
          "name": "Sentidos aguçados"
        },
        {
          "description": "O pseudodragão tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "O pseudodragão pode comunicar magicamente ideias, emoções e imagens simples telepaticamente com qualquer criatura a até 30 metros dele que possa entender um idioma.",
          "name": "Telepatia Limitada"
        },
        {
          "description": "O pseudodragão pode servir a outra criatura como familiar, formando um vínculo mágico e telepático com aquele companheiro voluntário. Enquanto os dois estão ligados, o companheiro pode sentir o que o pseudodragão sente, desde que estejam a 1,6 km um do outro. Enquanto o pseudodragão estiver a até 3 metros de seu companheiro, o companheiro compartilha a característica Resistência Mágica do pseudodragão. A qualquer momento e por qualquer motivo, o pseudodragão pode encerrar seu serviço como familiar, encerrando o vínculo telepático.",
          "name": "Variante: Familiar"
        }
      ]
    }
  },
  {
    "id": "srd:riding-horse",
    "name": "Andar a cavalo",
    "name_en": "Riding Horse",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 10,
    "hp_max": 13,
    "hp_formula": "2d10+2",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 12,
        "dex": 10,
        "int": 2,
        "str": 16,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d4+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (2d4 + 3) de dano de concussão.",
          "name": "Cascos"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 60
      }
    }
  },
  {
    "id": "srd:skeleton",
    "name": "Esqueleto",
    "name_en": "Skeleton",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 13,
    "hp_max": 13,
    "hp_formula": "2d8+4",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 15,
        "dex": 14,
        "int": 6,
        "str": 10,
        "wis": 8
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Espada curta"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 80/320 pés, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Arco curto"
        }
      ],
      "condition_immunities": [
        "Exausto",
        "Envenenado"
      ],
      "damage_resistances": [
        "veneno"
      ],
      "damage_vulnerabilities": [
        "contundente"
      ],
      "languages": [
        "understands the languages it knew in life but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 9
      },
      "speed": {
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:sprite",
    "name": "Sprite",
    "name_en": "Sprite",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Fada",
    "type_en": "fey",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 15,
    "hp_max": 2,
    "hp_formula": "1d4",
    "initiative_modifier": 4,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 10,
        "dex": 18,
        "int": 14,
        "str": 3,
        "wis": 13
      },
      "actions": [
        {
          "attack_bonus": 2,
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, um alvo. Acerto: 1 dano cortante.",
          "name": "Espada Longa"
        },
        {
          "attack_bonus": 6,
          "description": "Ataque com arma de longo alcance: +6 para acertar, alcance 40/160 pés, um alvo. Acerto: 1 dano perfurante e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 10 ou ficará envenenado por 1 minuto. Se o resultado do teste de resistência for 5 ou menos, o alvo envenenado fica inconsciente pela mesma duração, ou até sofrer dano ou outra criatura realizar uma ação para acordá-lo.",
          "name": "Arco curto"
        },
        {
          "description": "O sprite toca uma criatura e conhece magicamente o estado emocional atual da criatura. Se o alvo falhar em um teste de resistência de Carisma CD 10, o sprite também conhece a tendência da criatura. Celestiais, demônios e mortos-vivos falham automaticamente no teste de resistência.",
          "name": "Visão do coração"
        },
        {
          "description": "O sprite fica invisível magicamente até atacar ou lançar um feitiço, ou até que sua concentração termine (como se estivesse se concentrando em um feitiço). Qualquer equipamento que o sprite use ou carregue fica invisível com ele.",
          "name": "Invisibilidade"
        }
      ],
      "languages": [
        "Comum",
        "Élfico",
        "Silvestre"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 8
      },
      "speed": {
        "voo": 40,
        "deslocamento": 10
      }
    }
  },
  {
    "id": "srd:steam-mephit",
    "name": "Vapor Mephit",
    "name_en": "Steam Mephit",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 10,
    "hp_max": 21,
    "hp_formula": "6d6",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 10,
        "dex": 11,
        "int": 11,
        "str": 5,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "2d4+0",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, uma criatura. Acerto: 2 (1d4) de dano cortante mais 2 (1d4) de dano de fogo.",
          "name": "Garras"
        },
        {
          "description": "O mephit exala um cone de vapor escaldante de 4,5 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Destreza CD 10, sofrendo 4 (1d8) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Respiração a Vapor (Recarga 6)"
        },
        {
          "description": "O mephit tem 25% de chance de invocar 1d4 mephits desse tipo. Um mephit invocado aparece em um espaço desocupado a até 18 metros de seu invocador, atua como um aliado de seu invocador e não pode invocar outros mephits. Ela permanece por 1 minuto, até que ela ou seu invocador morra, ou até que seu invocador a dispense como uma ação.",
          "name": "Variante: Convocar Mephits (1/dia)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "languages": [
        "Aquan",
        "Ignan"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "voo": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Quando o mephit morre, ele explode em uma nuvem de vapor. Cada criatura a até 1,5 metro do mephit deve ser bem sucedida em um teste de resistência de Destreza CD 10 ou sofrerá 4 (1d8) de dano de fogo.",
          "name": "Explosão da Morte"
        },
        {
          "description": "O mephit pode lançar _blur_ inatamente, não necessitando de componentes materiais. Sua habilidade inata de lançar feitiços é Carisma.",
          "name": "Conjuração Inata (1/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:swarm-of-bats",
    "name": "Enxame de Morcegos",
    "name_en": "Swarm of Bats",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 12,
    "hp_max": 22,
    "hp_formula": "5d8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 10,
        "dex": 15,
        "int": 2,
        "str": 5,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d4+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 0 pés, uma criatura no espaço do enxame. Acerto: 5 (2d4) de dano perfurante, ou 2 (1d4) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos.",
          "name": "Mordidas"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Caído",
        "Impedido",
        "Atordoado"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "cortante"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 11
      },
      "speed": {
        "voo": 30
      },
      "traits": [
        {
          "description": "O enxame não pode usar sua visão cega enquanto estiver surdo.",
          "name": "Ecolocalização"
        },
        {
          "description": "O enxame tem vantagem em testes de Sabedoria (Percepção) que dependem da audição.",
          "name": "Audição Aguçada"
        },
        {
          "description": "O enxame pode ocupar o espaço de outra criatura e vice-versa, e o enxame pode se mover através de qualquer abertura grande o suficiente para um morcego minúsculo. O enxame não pode recuperar pontos de vida nem ganhar pontos de vida temporários.",
          "name": "Enxame"
        }
      ]
    }
  },
  {
    "id": "srd:swarm-of-rats",
    "name": "Enxame de Ratos",
    "name_en": "Swarm of Rats",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 10,
    "hp_max": 24,
    "hp_formula": "7d8-7",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 9,
        "dex": 11,
        "int": 2,
        "str": 9,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "2d6+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 0 pés, um alvo no espaço do enxame. Acerto: 7 (2d6) de dano perfurante, ou 3 (1d6) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos.",
          "name": "Mordidas"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Caído",
        "Impedido",
        "Atordoado"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "cortante"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O enxame tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        },
        {
          "description": "O enxame pode ocupar o espaço de outra criatura e vice-versa, e o enxame pode se mover através de qualquer abertura grande o suficiente para um rato minúsculo. O enxame não pode recuperar pontos de vida nem ganhar pontos de vida temporários.",
          "name": "Enxame"
        }
      ]
    }
  },
  {
    "id": "srd:swarm-of-ravens",
    "name": "Enxame de Corvos",
    "name_en": "Swarm of Ravens",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 12,
    "hp_max": 24,
    "hp_formula": "7d8-7",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 8,
        "dex": 14,
        "int": 3,
        "str": 6,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d6+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +4 para acertar, alcance 1,5 m, um alvo no espaço do enxame. Acerto: 7 (2d6) de dano perfurante, ou 3 (1d6) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos.",
          "name": "Bicos"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Caído",
        "Impedido",
        "Atordoado"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "cortante"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 15
      },
      "speed": {
        "voo": 50,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O enxame pode ocupar o espaço de outra criatura e vice-versa, e o enxame pode se mover através de qualquer abertura grande o suficiente para um Corvo Minúsculo. O enxame não pode recuperar pontos de vida nem ganhar pontos de vida temporários.",
          "name": "Enxame"
        }
      ]
    }
  },
  {
    "id": "srd:violet-fungus",
    "name": "Fungo Violeta",
    "name_en": "Violet Fungus",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Planta",
    "type_en": "plant",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 5,
    "hp_max": 18,
    "hp_formula": "4d8",
    "initiative_modifier": -5,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 10,
        "dex": 1,
        "int": 1,
        "str": 3,
        "wis": 3
      },
      "actions": [
        {
          "description": "O fungo realiza 1d4 ataques de Rotting Touch.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d8+0",
              "type": "necrotic"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +2 para acertar, alcance 3 metros, uma criatura. Acerto: 4 (1d8) de dano necrótico.",
          "name": "Toque podre"
        }
      ],
      "condition_immunities": [
        "Cego",
        "Surdo",
        "Amedrontado"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "percepção passiva": 6
      },
      "speed": {
        "deslocamento": 5
      },
      "traits": [
        {
          "description": "Embora o fungo violeta permaneça imóvel, é indistinguível de um fungo comum.",
          "name": "Aparência Falsa"
        }
      ]
    }
  },
  {
    "id": "srd:wolf",
    "name": "Lobo",
    "name_en": "Wolf",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 13,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 12,
        "dex": 15,
        "int": 3,
        "str": 12,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (2d4 + 2) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 11 ou será derrubado.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 4
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O lobo tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        },
        {
          "description": "O lobo tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do lobo estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:zombie",
    "name": "Zumbi",
    "name_en": "Zombie",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "1/4",
    "cr_numeric": 0.25,
    "armor_class": 8,
    "hp_max": 22,
    "hp_formula": "3d8+9",
    "initiative_modifier": -2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 16,
        "dex": 6,
        "int": 3,
        "str": 13,
        "wis": 6
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d6 + 1) de dano de concussão.",
          "name": "Bater"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "languages": [
        "understands the languages it knew in life but can't speak"
      ],
      "saving_throws": {
        "wis": 0
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 8
      },
      "speed": {
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "Se o dano reduzir o zumbi a 0 pontos de vida, ele deve realizar um teste de resistência de Constituição com CD 5 + o dano recebido, a menos que o dano seja radiante ou de um acerto crítico. Com um sucesso, o zumbi cai para 1 ponto de vida.",
          "name": "Fortaleza dos mortos-vivos"
        }
      ]
    }
  },
  {
    "id": "srd:ape",
    "name": "Macaco",
    "name_en": "Ape",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 19,
    "hp_formula": "3d8+6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 14,
        "dex": 14,
        "int": 6,
        "str": 16,
        "wis": 12
      },
      "actions": [
        {
          "description": "O macaco faz dois ataques com os punhos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano de concussão.",
          "name": "Punho"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque com arma de longo alcance: +5 para acertar, alcance 25/50 pés, um alvo. Acerto: 6 (1d6 + 3) de dano de concussão.",
          "name": "Pedra"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Atletismo": 5,
        "Percepção": 3
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:black-bear",
    "name": "Urso Negro",
    "name_en": "Black Bear",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 11,
    "hp_max": 19,
    "hp_formula": "3d8+6",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 14,
        "dex": 10,
        "int": 2,
        "str": 15,
        "wis": 12
      },
      "actions": [
        {
          "description": "O urso faz dois ataques: um com a mordida e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "2d4+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (2d4 + 2) de dano cortante.",
          "name": "Garras"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O urso tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        }
      ]
    }
  },
  {
    "id": "srd:cockatrice",
    "name": "Basilisco",
    "name_en": "Cockatrice",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 11,
    "hp_max": 27,
    "hp_formula": "6d6+6",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 12,
        "dex": 12,
        "int": 2,
        "str": 6,
        "wis": 13
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d4+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, uma criatura. Acerto: 3 (1d4 + 1) de dano perfurante, e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 11 contra ser petrificado magicamente. Se falhar na resistência, a criatura começa a virar pedra e é contida. Ele deve repetir o teste de resistência no final do próximo turno. Com um sucesso, o efeito termina. Em caso de falha, a criatura fica petrificada por 24 horas.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 11
      },
      "speed": {
        "voo": 40,
        "deslocamento": 20
      }
    }
  },
  {
    "id": "srd:crocodile",
    "name": "Crocodilo",
    "name_en": "Crocodile",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 19,
    "hp_formula": "3d10+3",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 13,
        "dex": 10,
        "int": 2,
        "str": 15,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d10+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 7 (1d10 + 2) de dano perfurante e o alvo é agarrado (CD de fuga 12). Até que esta luta termine, o alvo fica contido e o crocodilo não pode morder outro alvo.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "skills": {
        "Furtividade": 2
      },
      "speed": {
        "natação": 20,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O crocodilo pode prender a respiração por 15 minutos.",
          "name": "Prenda a respiração"
        }
      ]
    }
  },
  {
    "id": "srd:darkmantle",
    "name": "Manto Negro",
    "name_en": "Darkmantle",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 11,
    "hp_max": 22,
    "hp_formula": "5d6+5",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 13,
        "dex": 12,
        "int": 2,
        "str": 16,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, uma criatura. Acerto: 6 (1d6 + 3) de dano de concussão e o manto negro é fixado no alvo. Se o alvo for Médio ou menor e o manto negro tiver vantagem na jogada de ataque, ele se fixa engolindo a cabeça do alvo, e o alvo também fica cego e incapaz de respirar enquanto o manto negro estiver preso dessa forma.\nEnquanto estiver preso ao alvo, o manto negro não pode atacar nenhuma outra criatura exceto o alvo, mas tem vantagem em suas jogadas de ataque. A velocidade do manto negro também se torna 0, ele não pode se beneficiar de nenhum bônus em sua velocidade e se move com o alvo.\nUma criatura pode separar o manto negro fazendo um teste bem-sucedido de Força CD 13 como uma ação. Por sua vez, o manto negro pode se separar do alvo usando 1,5 metro de movimento.",
          "name": "Crush"
        },
        {
          "description": "Um raio de 4,5 metros de escuridão mágica se estende do manto negro, move-se com ele e se espalha pelos cantos. A escuridão dura enquanto o manto negro mantiver a concentração, até 10 minutos (como se estivesse se concentrando em um feitiço). A visão no escuro não consegue penetrar nesta escuridão e nenhuma luz natural pode iluminá-la. Se alguma escuridão se sobrepõe a uma área de luz criada por uma magia de 2º nível ou inferior, a magia que cria a luz é dissipada.",
          "name": "Aura da Escuridão (1/dia)"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 10
      },
      "skills": {
        "Furtividade": 3
      },
      "speed": {
        "voo": 30,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O manto negro não pode usar sua visão cega enquanto estiver surdo.",
          "name": "Ecolocalização"
        },
        {
          "description": "Embora o manto escuro permaneça imóvel, é indistinguível de uma formação de caverna, como uma estalactite ou estalagmite.",
          "name": "Aparência Falsa"
        }
      ]
    }
  },
  {
    "id": "srd:deep-gnome-svirfneblin",
    "name": "Gnomo das Profundezas (Svirfneblin)",
    "name_en": "Deep Gnome (Svirfneblin)",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 15,
    "hp_max": 16,
    "hp_formula": "3d6+6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 9,
        "con": 14,
        "dex": 14,
        "int": 12,
        "str": 15,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d8 + 2) de dano perfurante.",
          "name": "Escolha de Guerra"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 30/120 pés, uma criatura. Acerto: 4 (1d4 + 2) de dano perfurante, e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 12 ou será envenenado por 1 minuto. O alvo pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso.",
          "name": "Dardo Envenenado"
        }
      ],
      "languages": [
        "Gnômico",
        "Terran",
        "Subcomum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 12
      },
      "skills": {
        "Investigação": 3,
        "Percepção": 2,
        "Furtividade": 4
      },
      "speed": {
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O gnomo tem vantagem em testes de Destreza (Furtividade) feitos para se esconder em terreno rochoso.",
          "name": "Camuflagem de Pedra"
        },
        {
          "description": "O gnomo tem vantagem em testes de resistência de Inteligência, Sabedoria e Carisma contra magia.",
          "name": "Gnomo Astuto"
        },
        {
          "description": "A habilidade inata de conjuração do gnomo é Inteligência (resistência de magia CD 11). Ele pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\nÀ vontade: não detecção (somente para si mesmo)\n1/dia cada: cegueira/surdez, desfoque, disfarce",
          "name": "Feitiço Inato"
        }
      ]
    }
  },
  {
    "id": "srd:dust-mephit",
    "name": "Poeira Mephit",
    "name_en": "Dust Mephit",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 17,
    "hp_formula": "5d6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 10,
        "dex": 14,
        "int": 9,
        "str": 5,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 4 (1d4 + 2) de dano cortante.",
          "name": "Garras"
        },
        {
          "description": "O mephit exala um cone de poeira ofuscante de 4,5 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Destreza CD 10 ou ficará cega por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.",
          "name": "Respiração Cegante (Recarga 6)"
        },
        {
          "description": "O mephit tem 25% de chance de invocar 1d4 mephits desse tipo. Um mephit invocado aparece em um espaço desocupado a até 18 metros de seu invocador, atua como um aliado de seu invocador e não pode invocar outros mephits. Ela permanece por 1 minuto, até que ela ou seu invocador morra, ou até que seu invocador a dispense como uma ação.",
          "name": "Variante: Convocar Mephits (1/dia)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_vulnerabilities": [
        "fogo"
      ],
      "languages": [
        "Auran",
        "Terran"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2,
        "Furtividade": 4
      },
      "speed": {
        "voo": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Quando o mephit morre, ele explode em uma explosão de poeira. Cada criatura a até 1,5 metro dele deve ser bem sucedida em um teste de resistência de Constituição CD 10 ou ficará cega por 1 minuto. Uma criatura cega pode repetir o teste de resistência em cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.",
          "name": "Explosão da Morte"
        },
        {
          "description": "O mephit pode conjurar _sono_ inatamente, sem precisar de componentes materiais. Sua habilidade inata de lançar feitiços é Carisma.",
          "name": "Conjuração Inata (1/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:giant-goat",
    "name": "Cabra Gigante",
    "name_en": "Giant Goat",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 11,
    "hp_max": 19,
    "hp_formula": "3d10+3",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 12,
        "dex": 11,
        "int": 3,
        "str": 17,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d4+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (2d4 + 3) de dano de concussão.",
          "name": "Bater"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 11
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se a cabra se mover pelo menos 6 metros em linha reta em direção a um alvo e então acertá-lo com um ataque de aríete no mesmo turno, o alvo sofre 5 (2d4) de dano de concussão extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 13 ou será derrubado.",
          "name": "Cobrar"
        },
        {
          "description": "A cabra tem vantagem nos testes de resistência de Força e Destreza feitos contra efeitos que a derrubariam.",
          "name": "Firme"
        }
      ]
    }
  },
  {
    "id": "srd:giant-sea-horse",
    "name": "Cavalo Marinho Gigante",
    "name_en": "Giant Sea Horse",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 13,
    "hp_max": 16,
    "hp_formula": "3d10",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 11,
        "dex": 15,
        "int": 2,
        "str": 12,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d6 + 1) de dano de concussão.",
          "name": "Bater"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 11
      },
      "speed": {
        "natação": 40
      },
      "traits": [
        {
          "description": "Se o cavalo-marinho se mover pelo menos 6 metros em linha reta em direção a um alvo e então acertá-lo com um ataque de aríete no mesmo turno, o alvo sofre 7 (2d6) de dano de concussão extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 11 ou será derrubado.",
          "name": "Cobrar"
        },
        {
          "description": "O cavalo-marinho só consegue respirar debaixo d'água.",
          "name": "Respiração na Água"
        }
      ]
    }
  },
  {
    "id": "srd:giant-wasp",
    "name": "Vespa Gigante",
    "name_en": "Giant Wasp",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 13,
    "hp_formula": "3d8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 10,
        "dex": 14,
        "int": 1,
        "str": 10,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 5 (1d6 + 2) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 11, sofrendo 10 (3d6) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso. Se o dano de veneno reduzir o alvo a 0 pontos de vida, o alvo fica estável, mas envenenado por 1 hora, mesmo após recuperar pontos de vida, e fica paralisado enquanto estiver envenenado desta forma.",
          "name": "Picada"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "voo": 50,
        "deslocamento": 10
      }
    }
  },
  {
    "id": "srd:gnoll",
    "name": "Gnoll",
    "name_en": "Gnoll",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 15,
    "hp_max": 22,
    "hp_formula": "5d8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 11,
        "dex": 12,
        "int": 6,
        "str": 14,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 4 (1d4 + 2) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma corpo a corpo ou de longo alcance: +4 para acertar, alcance 1,5 m ou alcance de 6/18 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante, ou 6 (1d8 + 2) de dano perfurante se usado com as duas mãos para fazer um ataque corpo a corpo.",
          "name": "Lança"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d8+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +3 para acertar, alcance 150/600 pés, um alvo. Acerto: 5 (1d8 + 1) de dano perfurante.",
          "name": "Arco longo"
        }
      ],
      "languages": [
        "Gnoll"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Quando o gnoll reduz uma criatura a 0 pontos de vida com um ataque corpo a corpo em seu turno, o gnoll pode realizar uma ação bônus para se mover até metade de seu deslocamento e realizar um ataque de mordida.",
          "name": "Fúria"
        }
      ]
    }
  },
  {
    "id": "srd:gray-ooze",
    "name": "Lodo Cinzento",
    "name_en": "Gray Ooze",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Gosma",
    "type_en": "ooze",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 8,
    "hp_max": 22,
    "hp_formula": "3d8+9",
    "initiative_modifier": -2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 2,
        "con": 16,
        "dex": 6,
        "int": 1,
        "str": 12,
        "wis": 6
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d6 + 1) de dano de concussão mais 7 (2d6) de dano de ácido, e se o alvo estiver usando uma armadura de metal não-mágica, sua armadura será parcialmente corroída e sofrerá uma penalidade permanente e cumulativa de -1 na CA que oferece. A armadura é destruída se a penalidade reduzir sua CA para 10.",
          "name": "Pseudópode"
        }
      ],
      "condition_immunities": [
        "Cego",
        "Enfeitiçado",
        "Surdo",
        "Exausto",
        "Amedrontado",
        "Caído"
      ],
      "damage_resistances": [
        "ácido",
        "frio",
        "fogo"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 8
      },
      "skills": {
        "Furtividade": 2
      },
      "speed": {
        "escalada": 10,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "A lama pode se mover através de um espaço tão estreito quanto 1 polegada de largura sem ser comprimida.",
          "name": "Amorfo"
        },
        {
          "description": "Qualquer arma não-mágica feita de metal que atinja a lama corrói. Depois de causar dano, a arma sofre uma penalidade permanente e cumulativa de -1 nas jogadas de dano. Se a penalidade cair para -5, a arma é destruída. Munições não mágicas feitas de metal que atingem a lama são destruídas após causar dano.\nA gosma pode consumir metal não mágico de 5 cm de espessura em 1 rodada.",
          "name": "Corroer Metal"
        },
        {
          "description": "Embora o lodo permaneça imóvel, é indistinguível de uma poça oleosa ou de uma rocha molhada.",
          "name": "Aparência Falsa"
        }
      ]
    }
  },
  {
    "id": "srd:hobgoblin",
    "name": "Duende Macabro",
    "name_en": "Hobgoblin",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 18,
    "hp_max": 11,
    "hp_formula": "2d8+2",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 9,
        "con": 12,
        "dex": 12,
        "int": 10,
        "str": 13,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d8+1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d8 + 1) de dano cortante ou 6 (1d10 + 1) de dano cortante se usado com as duas mãos.",
          "name": "Espada Longa"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d8+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +3 para acertar, alcance 150/600 pés, um alvo. Acerto: 5 (1d8 + 1) de dano perfurante.",
          "name": "Arco longo"
        }
      ],
      "languages": [
        "Comum",
        "Goblin"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Uma vez por turno, o hobgoblin pode causar 7 (2d6) de dano extra a uma criatura que atingir com um ataque com arma se essa criatura estiver a até 1,5 metro de um aliado do hobgoblin que não esteja incapacitado.",
          "name": "Vantagem Marcial"
        }
      ]
    }
  },
  {
    "id": "srd:ice-mephit",
    "name": "Mephit de gelo",
    "name_en": "Ice Mephit",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 11,
    "hp_max": 21,
    "hp_formula": "6d6",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 10,
        "dex": 13,
        "int": 9,
        "str": 7,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d4+1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, uma criatura. Acerto: 3 (1d4 + 1) de dano cortante mais 2 (1d4) de dano de frio.",
          "name": "Garras"
        },
        {
          "description": "O mephit exala um cone de ar frio de 4,5 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Destreza CD 10, sofrendo 5 (2d4) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Respiração Gélida (Recarga 6)"
        },
        {
          "description": "O mephit tem 25% de chance de invocar 1d4 mephits desse tipo. Um mephit invocado aparece em um espaço desocupado a até 18 metros de seu invocador, atua como um aliado de seu invocador e não pode invocar outros mephits. Ela permanece por 1 minuto, até que ela ou seu invocador morra, ou até que seu invocador a dispense como uma ação.",
          "name": "Variante: Convocar Mephits (1/dia)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "frio",
        "veneno"
      ],
      "damage_vulnerabilities": [
        "contundente",
        "fogo"
      ],
      "languages": [
        "Aquan",
        "Auran"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2,
        "Furtividade": 3
      },
      "speed": {
        "voo": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Quando o mephit morre, ele explode em uma explosão de gelo irregular. Cada criatura a até 1,5 metro dele deve realizar um teste de resistência de Destreza CD 10, sofrendo 4 (1d8) de dano cortante se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Explosão da Morte"
        },
        {
          "description": "Embora o mephit permaneça imóvel, ele é indistinguível de um pedaço de gelo comum.",
          "name": "Aparência Falsa"
        },
        {
          "description": "O mephit pode lançar _nuvem de neblina_ inatamente, sem precisar de componentes materiais. Sua habilidade inata de lançar feitiços é Carisma.",
          "name": "Conjuração Inata (1/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:lizardfolk",
    "name": "Povo Lagarto",
    "name_en": "Lizardfolk",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 15,
    "hp_max": 22,
    "hp_formula": "4d8+4",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 13,
        "dex": 10,
        "int": 7,
        "str": 15,
        "wis": 12
      },
      "actions": [
        {
          "description": "O povo lagarto faz dois ataques corpo a corpo, cada um com uma arma diferente.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano de concussão.",
          "name": "Clube Pesado"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma corpo a corpo ou de longo alcance: +4 para acertar, alcance 1,5 m ou alcance 9/36 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Dardo"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Escudo Cravado"
        }
      ],
      "languages": [
        "Dracônico"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 4,
        "Sobrevivência": 5
      },
      "speed": {
        "natação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O povo lagarto pode prender a respiração por 15 minutos.",
          "name": "Prenda a respiração"
        }
      ]
    }
  },
  {
    "id": "srd:magma-mephit",
    "name": "Magma Mephit",
    "name_en": "Magma Mephit",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 11,
    "hp_max": 22,
    "hp_formula": "5d6+5",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 12,
        "dex": 12,
        "int": 7,
        "str": 8,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d4+1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, uma criatura. Acerto: 3 (1d4 + 1) de dano cortante mais 2 (1d4) de dano de fogo.",
          "name": "Garras"
        },
        {
          "description": "O mephit exala um cone de fogo de 4,5 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 11, sofrendo 7 (2d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro de Fogo (Recarga 6)"
        },
        {
          "description": "O mephit tem 25% de chance de invocar 1d4 mephits desse tipo. Um mephit invocado aparece em um espaço desocupado a até 18 metros de seu invocador, atua como um aliado de seu invocador e não pode invocar outros mephits. Ela permanece por 1 minuto, até que ela ou seu invocador morra, ou até que seu invocador a dispense como uma ação.",
          "name": "Variante: Convocar Mephits (1/dia)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_vulnerabilities": [
        "frio"
      ],
      "languages": [
        "Ignan",
        "Terran"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "skills": {
        "Furtividade": 3
      },
      "speed": {
        "voo": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Quando o mephit morre, ele explode em uma explosão de lava. Cada criatura a até 1,5 metro dele deve realizar um teste de resistência de Destreza CD 11, sofrendo 7 (2d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Explosão da Morte"
        },
        {
          "description": "Embora o mephit permaneça imóvel, é indistinguível de um monte comum de magma.",
          "name": "Aparência Falsa"
        },
        {
          "description": "O mephit pode conjurar _aquecer metal_ inatamente (resistência ao feitiço CD 10), não necessitando de componentes materiais. Sua habilidade inata de lançar feitiços é Carisma.",
          "name": "Conjuração Inata (1/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:magmin",
    "name": "Magmin",
    "name_en": "Magmin",
    "size": "Pequeno",
    "size_en": "Small",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 14,
    "hp_max": 9,
    "hp_formula": "2d6+2",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 12,
        "dex": 15,
        "int": 8,
        "str": 7,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d6+0",
              "type": "fire"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (2d6) de dano de fogo. Se o alvo for uma criatura ou objeto inflamável, ele se inflama. Até que um alvo realize uma ação para apagar o fogo, o alvo sofre 3 (1d6) de dano de fogo no final de cada um de seus turnos.",
          "name": "Tocar"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Ignan"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Quando o magmin morre, ele explode em uma explosão de fogo e magma. Cada criatura a até 3 metros dele deve realizar um teste de resistência de Destreza CD 11, sofrendo 7 (2d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso. Objetos inflamáveis ​​que não estão sendo usados ​​ou carregados naquela área são incendiados.",
          "name": "Explosão da Morte"
        },
        {
          "description": "Como uma ação bônus, o magmin pode incendiar-se ou extinguir suas chamas. Enquanto está em chamas, o magmin emite luz brilhante em um raio de 3 metros e luz fraca por mais 3 metros.",
          "name": "Iluminação acesa"
        }
      ]
    }
  },
  {
    "id": "srd:orc",
    "name": "Orc",
    "name_en": "Orc",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 13,
    "hp_max": 15,
    "hp_formula": "2d8+6",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 16,
        "dex": 12,
        "int": 7,
        "str": 16,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d12+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (1d12 + 3) de dano cortante.",
          "name": "Machado Grande"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma corpo a corpo ou de longo alcance: +5 para acertar, alcance 1,5 m ou alcance 9/36 m, um alvo. Acerto: 6 (1d6 + 3) de dano perfurante.",
          "name": "Dardo"
        }
      ],
      "languages": [
        "Comum",
        "Orc"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "skills": {
        "Intimidação": 2
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Como uma ação bônus, o orc pode se mover até sua velocidade em direção a uma criatura hostil que ele possa ver.",
          "name": "Agressivo"
        }
      ]
    }
  },
  {
    "id": "srd:reef-shark",
    "name": "Tubarão de recife",
    "name_en": "Reef Shark",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 22,
    "hp_formula": "4d8+1",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 13,
        "dex": 13,
        "int": 1,
        "str": 14,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d8 + 2) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2
      },
      "speed": {
        "natação": 40
      },
      "traits": [
        {
          "description": "O tubarão tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do tubarão estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        },
        {
          "description": "O tubarão só consegue respirar debaixo d'água.",
          "name": "Respiração na Água"
        }
      ]
    }
  },
  {
    "id": "srd:rust-monster",
    "name": "Monstro da Ferrugem",
    "name_en": "Rust Monster",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 14,
    "hp_max": 27,
    "hp_formula": "5d8+5",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 13,
        "dex": 12,
        "int": 2,
        "str": 13,
        "wis": 13
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d8+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d8 + 1) de dano perfurante.",
          "name": "Morder"
        },
        {
          "description": "O monstro enferrujado corrói um objeto de metal ferroso não mágico que pode ver a até 1,5 metro dele. Se o objeto não estiver sendo usado ou carregado, o toque destrói um cubo de 30 centímetros dele. Se o objeto estiver sendo usado ou carregado por uma criatura, a criatura pode realizar um teste de resistência de Destreza CD 11 para evitar o toque do monstro enferrujado.\nSe o objeto tocado for uma armadura de metal ou um escudo de metal sendo usado ou carregado, ele sofrerá uma penalidade permanente e cumulativa de -1 na CA que oferece. Armadura reduzida a uma CA de 10 ou um escudo que caia para um bônus de +0 é destruído. Se o objeto tocado for uma arma de metal empunhada, ela enferruja conforme descrito na característica Ferrugem Metal.",
          "name": "Antenas"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 11
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O monstro da ferrugem pode identificar, pelo cheiro, a localização de metal ferroso a até 9 metros dele.",
          "name": "Aroma de Ferro"
        },
        {
          "description": "Qualquer arma não-mágica feita de metal que atinja o monstro enferrujado será corroída. Depois de causar dano, a arma sofre uma penalidade permanente e cumulativa de -1 nas jogadas de dano. Se a penalidade cair para -5, a arma é destruída. A munição não mágica feita de metal que atinge o monstro enferrujado é destruída após causar dano.",
          "name": "Metal enferrujado"
        }
      ]
    }
  },
  {
    "id": "srd:sahuagin",
    "name": "Sahuagin",
    "name_en": "Sahuagin",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 22,
    "hp_formula": "4d8+4",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 9,
        "con": 12,
        "dex": 11,
        "int": 12,
        "str": 13,
        "wis": 13
      },
      "actions": [
        {
          "description": "O sahuagin faz dois ataques corpo a corpo: um com sua mordida e outro com suas garras ou lança.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d4+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 3 (1d4 + 1) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d4+1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 3 (1d4 + 1) de dano cortante.",
          "name": "Garras"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d6+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma corpo a corpo ou de longo alcance: +3 para acertar, alcance 1,5 m ou alcance de 6/18 m, um alvo. Acerto: 4 (1d6 + 1) de dano perfurante, ou 5 (1d8 + 1) de dano perfurante se usado com as duas mãos para fazer um ataque corpo a corpo.",
          "name": "Lança"
        }
      ],
      "languages": [
        "Sahuagin"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 15
      },
      "skills": {
        "Percepção": 5
      },
      "speed": {
        "natação": 40,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O sahuagin tem vantagem em jogadas de ataque corpo a corpo contra qualquer criatura que não tenha todos os seus pontos de vida.",
          "name": "Frenesi de Sangue"
        },
        {
          "description": "O sahuagin pode respirar ar e água, mas precisa ser submerso pelo menos uma vez a cada 4 horas para evitar sufocamento.",
          "name": "Anfíbio Limitado"
        },
        {
          "description": "O sahuagin pode comandar magicamente qualquer tubarão a até 36 metros dele, usando telepatia limitada.",
          "name": "Telepatia de Tubarão"
        }
      ]
    }
  },
  {
    "id": "srd:satyr",
    "name": "Sátiro",
    "name_en": "Satyr",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fada",
    "type_en": "fey",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 14,
    "hp_max": 31,
    "hp_formula": "7d8",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 14,
        "con": 11,
        "dex": 16,
        "int": 12,
        "str": 12,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "2d4+1",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (2d4 + 1) de dano de concussão.",
          "name": "Bater"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano perfurante.",
          "name": "Espada curta"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +5 para acertar, alcance 80/320 pés, um alvo. Acerto: 6 (1d6 + 3) de dano perfurante.",
          "name": "Arco curto"
        },
        {
          "description": "Canção de ninar suave. A criatura adormece e fica inconsciente por 1 minuto. O efeito termina se a criatura sofrer dano ou se alguém realizar uma ação para acordar a criatura.",
          "name": "Variante: Panpipes"
        }
      ],
      "languages": [
        "Comum",
        "Élfico",
        "Silvestre"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2,
        "Atuação": 6,
        "Furtividade": 5
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O sátiro tem vantagem em testes de resistência contra magias e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:scout",
    "name": "Escoteiro",
    "name_en": "Scout",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 13,
    "hp_max": 16,
    "hp_formula": "3d8+3",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 12,
        "dex": 14,
        "int": 11,
        "str": 11,
        "wis": 13
      },
      "actions": [
        {
          "description": "O batedor faz dois ataques corpo a corpo ou dois ataques à distância.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Espada curta"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 150/600 pés, um alvo. Acerto: 6 (1d8 + 2) de dano perfurante.",
          "name": "Arco longo"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 15
      },
      "skills": {
        "Natureza": 4,
        "Percepção": 5,
        "Furtividade": 6,
        "Sobrevivência": 5
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O batedor tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou visão.",
          "name": "Audição e visão aguçadas"
        }
      ]
    }
  },
  {
    "id": "srd:shadow",
    "name": "Sombra",
    "name_en": "Shadow",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 16,
    "hp_formula": "3d8+3",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 13,
        "dex": 14,
        "int": 6,
        "str": 6,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d6+2",
              "type": "necrotic"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 9 (2d6 + 2) de dano necrótico e o valor de Força do alvo é reduzido em 1d4. O alvo morre se isso reduzir sua Força a 0. Caso contrário, a redução dura até que o alvo termine um descanso curto ou longo.\nSe um humanóide não-maligno morrer devido a este ataque, uma nova sombra surgirá do cadáver 1d4 horas depois.",
          "name": "Dreno de Força"
        }
      ],
      "condition_immunities": [
        "Exausto",
        "Amedrontado",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Envenenado",
        "Caído",
        "Impedido"
      ],
      "damage_immunities": [
        "necrótico",
        "veneno"
      ],
      "damage_resistances": [
        "ácido",
        "frio",
        "fogo",
        "elétrico",
        "thunder; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "damage_vulnerabilities": [
        "radiante"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "skills": {
        "Furtividade": 4
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "A sombra pode se mover através de um espaço estreito de até 2,5 cm de largura sem se comprimir.",
          "name": "Amorfo"
        },
        {
          "description": "Enquanto estiver na penumbra ou na escuridão, a sombra pode realizar a ação Esconder-se como uma ação bônus.",
          "name": "Sombra Furtiva"
        },
        {
          "description": "Enquanto estiver sob a luz do sol, a sombra tem desvantagem em jogadas de ataque, testes de habilidade e testes de resistência.",
          "name": "Fraqueza à luz solar"
        }
      ]
    }
  },
  {
    "id": "srd:swarm-of-beetles",
    "name": "Enxame de Besouros",
    "name_en": "Swarm of Beetles",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 22,
    "hp_formula": "5d8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 10,
        "dex": 13,
        "int": 1,
        "str": 3,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "4d4+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +3 para acertar, alcance 0 pés, um alvo no espaço do enxame. Acerto: 10 (4d4) de dano perfurante, ou 5 (2d4) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos.",
          "name": "Mordidas"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Caído",
        "Impedido",
        "Atordoado"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "cortante"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 8
      },
      "speed": {
        "escavação": 5,
        "escalada": 20,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O enxame pode ocupar o espaço de outra criatura e vice-versa, e o enxame pode se mover através de qualquer abertura grande o suficiente para um Inseto Minúsculo. O enxame não pode recuperar pontos de vida nem ganhar pontos de vida temporários.",
          "name": "Enxame"
        }
      ]
    }
  },
  {
    "id": "srd:swarm-of-centipedes",
    "name": "Enxame de Centopeias",
    "name_en": "Swarm of Centipedes",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 22,
    "hp_formula": "5d8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 10,
        "dex": 13,
        "int": 1,
        "str": 3,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "4d4+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +3 para acertar, alcance 0 pés, um alvo no espaço do enxame. Acerto: 10 (4d4) de dano perfurante, ou 5 (2d4) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos.\nUma criatura reduzida a 0 pontos de vida por um enxame de centopéias fica estável, mas envenenada por 1 hora, mesmo depois de recuperar pontos de vida, e paralisada enquanto estiver envenenada desta forma.",
          "name": "Mordidas"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Caído",
        "Impedido",
        "Atordoado"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "cortante"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 8
      },
      "speed": {
        "escalada": 20,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O enxame pode ocupar o espaço de outra criatura e vice-versa, e o enxame pode se mover através de qualquer abertura grande o suficiente para um Inseto Minúsculo. O enxame não pode recuperar pontos de vida nem ganhar pontos de vida temporários.",
          "name": "Enxame"
        }
      ]
    }
  },
  {
    "id": "srd:swarm-of-insects",
    "name": "Enxame de insetos",
    "name_en": "Swarm of Insects",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 22,
    "hp_formula": "5d8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 10,
        "dex": 13,
        "int": 1,
        "str": 3,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "4d4+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +3 para acertar, alcance 0 pés, um alvo no espaço do enxame. Acerto: 10 (4d4) de dano perfurante, ou 5 (2d4) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos.",
          "name": "Mordidas"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Caído",
        "Impedido",
        "Atordoado"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "cortante"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 8
      },
      "speed": {
        "escalada": 20,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O enxame pode ocupar o espaço de outra criatura e vice-versa, e o enxame pode se mover através de qualquer abertura grande o suficiente para um Inseto Minúsculo. O enxame não pode recuperar pontos de vida nem ganhar pontos de vida temporários.",
          "name": "Enxame"
        }
      ]
    }
  },
  {
    "id": "srd:swarm-of-spiders",
    "name": "Enxame de Aranhas",
    "name_en": "Swarm of Spiders",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 22,
    "hp_formula": "5d8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 10,
        "dex": 13,
        "int": 1,
        "str": 3,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "4d4+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +3 para acertar, alcance 0 pés, um alvo no espaço do enxame. Acerto: 10 (4d4) de dano perfurante, ou 5 (2d4) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos.",
          "name": "Mordidas"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Paralisado",
        "Petrificado",
        "Caído",
        "Impedido",
        "Atordoado"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "cortante"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 8
      },
      "speed": {
        "escalada": 20,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O enxame pode ocupar o espaço de outra criatura e vice-versa, e o enxame pode se mover através de qualquer abertura grande o suficiente para um Inseto Minúsculo. O enxame não pode recuperar pontos de vida nem ganhar pontos de vida temporários.",
          "name": "Enxame"
        },
        {
          "description": "O enxame pode escalar superfícies difíceis, inclusive de cabeça para baixo em tetos, sem precisar fazer um teste de habilidade.",
          "name": "Escalada de aranha"
        },
        {
          "description": "Enquanto estiver em contato com uma teia, o enxame sabe a localização exata de qualquer outra criatura em contato com a mesma teia.",
          "name": "Sentido da Web"
        },
        {
          "description": "O enxame ignora as restrições de movimento causadas pelas teias.",
          "name": "Caminhante da Web"
        }
      ]
    }
  },
  {
    "id": "srd:swarm-of-wasps",
    "name": "Enxame de Vespas",
    "name_en": "Swarm of Wasps",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 12,
    "hp_max": 22,
    "hp_formula": "5d8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 10,
        "dex": 13,
        "int": 1,
        "str": 3,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "4d4+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +3 para acertar, alcance 0 pés, um alvo no espaço do enxame. Acerto: 10 (4d4) de dano perfurante, ou 5 (2d4) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos.",
          "name": "Mordidas"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Caído",
        "Impedido",
        "Atordoado"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "cortante"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 8
      },
      "speed": {
        "voo": 30,
        "deslocamento": 5
      },
      "traits": [
        {
          "description": "O enxame pode ocupar o espaço de outra criatura e vice-versa, e o enxame pode se mover através de qualquer abertura grande o suficiente para um Inseto Minúsculo. O enxame não pode recuperar pontos de vida nem ganhar pontos de vida temporários.",
          "name": "Enxame"
        }
      ]
    }
  },
  {
    "id": "srd:thug",
    "name": "Bandido",
    "name_en": "Thug",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 11,
    "hp_max": 32,
    "hp_formula": "5d8+10",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 14,
        "dex": 11,
        "int": 10,
        "str": 15,
        "wis": 10
      },
      "actions": [
        {
          "description": "O bandido faz dois ataques corpo a corpo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 5 (1d6 + 2) de dano de concussão.",
          "name": "Mace"
        },
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d10+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +2 para acertar, alcance 100/400 pés, um alvo. Acerto: 5 (1d10) de dano perfurante.",
          "name": "Besta Pesada"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "skills": {
        "Intimidação": 2
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O bandido tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do bandido estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:warhorse",
    "name": "Cavalo de Guerra",
    "name_en": "Warhorse",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 11,
    "hp_max": 19,
    "hp_formula": "3d10+3",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 13,
        "dex": 12,
        "int": 2,
        "str": 18,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano de concussão.",
          "name": "Cascos"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 11
      },
      "speed": {
        "deslocamento": 60
      },
      "traits": [
        {
          "description": "Se o cavalo se mover pelo menos 6 metros em linha reta em direção a uma criatura e então acertá-la com um ataque de cascos no mesmo turno, o alvo deve ser bem sucedido em um teste de resistência de Força CD 14 ou será derrubado. Se o alvo estiver caído, o cavalo pode fazer outro ataque com os cascos contra ele como uma ação bônus.",
          "name": "Carga de atropelamento"
        }
      ]
    }
  },
  {
    "id": "srd:warhorse-skeleton",
    "name": "Esqueleto de Cavalo de Guerra",
    "name_en": "Warhorse Skeleton",
    "size": "Grande",
    "size_en": "Large",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 13,
    "hp_max": 22,
    "hp_formula": "3d10+6",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 15,
        "dex": 12,
        "int": 2,
        "str": 18,
        "wis": 8
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano de concussão.",
          "name": "Cascos"
        }
      ],
      "condition_immunities": [
        "Exausto",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_vulnerabilities": [
        "contundente"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 9
      },
      "speed": {
        "deslocamento": 60
      }
    }
  },
  {
    "id": "srd:worg",
    "name": "Worg",
    "name_en": "Worg",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "1/2",
    "cr_numeric": 0.5,
    "armor_class": 13,
    "hp_max": 26,
    "hp_formula": "4d10+4",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 13,
        "dex": 13,
        "int": 7,
        "str": 16,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 13 ou será derrubado.",
          "name": "Morder"
        }
      ],
      "languages": [
        "Goblin",
        "Worg"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "O worg tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        }
      ]
    }
  },
  {
    "id": "srd:animated-armor",
    "name": "Armadura Animada",
    "name_en": "Animated Armor",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Constructo",
    "type_en": "construct",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 18,
    "hp_max": 33,
    "hp_formula": "6d8+6",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 13,
        "dex": 11,
        "int": 1,
        "str": 14,
        "wis": 3
      },
      "actions": [
        {
          "description": "A armadura faz dois ataques corpo a corpo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano de concussão.",
          "name": "Bater"
        }
      ],
      "condition_immunities": [
        "Cego",
        "Enfeitiçado",
        "Surdo",
        "Exausto",
        "Amedrontado",
        "Paralisado",
        "Petrificado",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno",
        "psíquico"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 6
      },
      "speed": {
        "deslocamento": 25
      },
      "traits": [
        {
          "description": "A armadura fica incapacitada enquanto estiver na área de um campo antimagia. Se for alvo de dissipar magia, a armadura deve ser bem sucedida em um teste de resistência de Constituição contra a CD de resistência do feitiço do conjurador ou ficará inconsciente por 1 minuto.",
          "name": "Suscetibilidade Antimágica"
        },
        {
          "description": "Enquanto a armadura permanece imóvel, ela é indistinguível de uma armadura normal.",
          "name": "Aparência Falsa"
        }
      ]
    }
  },
  {
    "id": "srd:brass-dragon-wyrmling",
    "name": "Dragão de Latão Wyrmling",
    "name_en": "Brass Dragon Wyrmling",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 16,
    "hp_max": 16,
    "hp_formula": "3d8+3",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 13,
        "con": 13,
        "dex": 10,
        "int": 10,
        "str": 15,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d10+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d10 + 2) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "4d6+0",
              "type": "fire"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro de Fogo.** O dragão exala fogo em uma linha de 6 metros com 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 11, sofrendo 14 (4d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração do Sono.** O dragão exala gás do sono em um cone de 4,5 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 11 ou ficará inconsciente por 1 minuto. Este efeito termina para uma criatura se ela sofrer dano ou se alguém usar uma ação para acordá-la.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 3,
        "con": 3,
        "dex": 2,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 2
      },
      "speed": {
        "escavação": 15,
        "voo": 60,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:brown-bear",
    "name": "Urso Pardo",
    "name_en": "Brown Bear",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 11,
    "hp_max": 34,
    "hp_formula": "4d10+12",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 16,
        "dex": 10,
        "int": 2,
        "str": 19,
        "wis": 13
      },
      "actions": [
        {
          "description": "O urso faz dois ataques: um com a mordida e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (1d8 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.",
          "name": "Garras"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O urso tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        }
      ]
    }
  },
  {
    "id": "srd:bugbear",
    "name": "Pesadelo",
    "name_en": "Bugbear",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 16,
    "hp_max": 27,
    "hp_formula": "5d8+5",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 9,
        "con": 13,
        "dex": 14,
        "int": 8,
        "str": 15,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d8 + 2) de dano perfurante.",
          "name": "Estrela da Manhã"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma corpo a corpo ou de longo alcance: +4 para acertar, alcance 1,5 m ou alcance 9/36 m, um alvo. Acerto: 9 (2d6 + 2) de dano perfurante em combate corpo a corpo ou 5 (1d6 + 2) de dano perfurante à distância.",
          "name": "Dardo"
        }
      ],
      "languages": [
        "Comum",
        "Goblin"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "skills": {
        "Furtividade": 6,
        "Sobrevivência": 2
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Uma arma corpo a corpo causa um dado extra de dano quando o bugbear a atinge (incluído no ataque).",
          "name": "Bruto"
        },
        {
          "description": "Se o bugbear surpreender uma criatura e acertá-la com um ataque durante a primeira rodada de combate, o alvo sofre 7 (2d6) de dano extra pelo ataque.",
          "name": "Ataque surpresa"
        }
      ]
    }
  },
  {
    "id": "srd:copper-dragon-wyrmling",
    "name": "Dragão de Cobre Wyrmling",
    "name_en": "Copper Dragon Wyrmling",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 16,
    "hp_max": 22,
    "hp_formula": "4d8+4",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 13,
        "con": 13,
        "dex": 12,
        "int": 14,
        "str": 15,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d10+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d10 + 2) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "4d8+0",
              "type": "acid"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro Ácido.** O dragão exala ácido em uma linha de 6 metros com 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 11, sofrendo 18 (4d8) de dano de ácido se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração lenta.** O dragão exala gás em um cone de 1,5 metro. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 11. Se falhar, a criatura não pode usar reações, sua velocidade é reduzida à metade e ela não pode realizar mais de um ataque por turno. Além disso, a criatura pode usar uma ação ou uma ação bônus no seu turno, mas não ambas. Esses efeitos duram 1 minuto. A criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma com um teste de resistência bem-sucedido.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "ácido"
      ],
      "languages": [
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 3,
        "con": 3,
        "dex": 3,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 3
      },
      "speed": {
        "escalada": 30,
        "voo": 60,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:death-dog",
    "name": "Cão da Morte",
    "name_en": "Death Dog",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 12,
    "hp_max": 39,
    "hp_formula": "6d8+12",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 14,
        "dex": 14,
        "int": 3,
        "str": 15,
        "wis": 13
      },
      "actions": [
        {
          "description": "O cachorro faz dois ataques de mordida.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Constituição CD 12 contra doenças ou ficará envenenado até que a doença seja curada. A cada 24 horas decorridas, a criatura deve repetir o teste de resistência, reduzindo seu máximo de pontos de vida em 5 (1d10) em caso de falha. Essa redução dura até a cura da doença. A criatura morre se a doença reduzir seu máximo de pontos de vida a 0.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 15
      },
      "skills": {
        "Percepção": 5,
        "Furtividade": 4
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O cão tem vantagem em testes de Sabedoria (Percepção) e em testes de resistência contra ficar cego, enfeitiçado, ensurdecido, assustado, atordoado ou nocauteado.",
          "name": "Duas cabeças"
        }
      ]
    }
  },
  {
    "id": "srd:dire-wolf",
    "name": "Lobo Terrível",
    "name_en": "Dire Wolf",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 14,
    "hp_max": 37,
    "hp_formula": "5d10+10",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 15,
        "dex": 15,
        "int": 3,
        "str": 17,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 13 ou será derrubado.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 4
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "O lobo tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        },
        {
          "description": "O lobo tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do lobo estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:dryad",
    "name": "Dríade",
    "name_en": "Dryad",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fada",
    "type_en": "fey",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 11,
    "hp_max": 22,
    "hp_formula": "5d8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 18,
        "con": 11,
        "dex": 12,
        "int": 14,
        "str": 10,
        "wis": 15
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d4+0",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +2 para acertar (+6 para acertar com shillelagh), alcance 1,5 m, um alvo. Acerto: 2 (1d4) de dano de concussão ou 8 (1d8 + 4) de dano de concussão com shillelagh.",
          "name": "Clube"
        },
        {
          "description": "A dríade tem como alvo um humanóide ou fera que ela possa ver a até 9 metros dela. Se o alvo puder ver a dríade, ele deverá ter sucesso em um teste de resistência de Sabedoria CD 14 ou será enfeitiçado magicamente. A criatura encantada considera a dríade um amigo confiável a ser respeitado e protegido. Embora o alvo não esteja sob o controle da dríade, ele atende aos pedidos ou ações da dríade da maneira mais favorável possível.\nCada vez que a dríade ou seus aliados fizerem algo prejudicial ao alvo, ela poderá repetir o teste de resistência, encerrando o efeito sobre si mesma em caso de sucesso. Caso contrário, o efeito dura 24 horas ou até que a dríade morra, esteja em um plano de existência diferente do alvo ou termine o efeito como uma ação bônus. Se o teste de resistência de um alvo for bem-sucedido, o alvo ficará imune ao Feitiço Feérico da dríade pelas próximas 24 horas.\nA dríade não pode ter mais do que um humanóide e até três feras encantadas ao mesmo tempo.",
          "name": "Feitiço Feérico"
        }
      ],
      "languages": [
        "Élfico",
        "Silvestre"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 5
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A habilidade inata de conjuração da dríade é Carisma (resistência ao feitiço CD 14). A dríade pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\n\nÀ vontade: druidcraft\n3/dia cada: emaranhado, goodberry\n1/dia cada: casca de árvore, passe sem deixar vestígios, shillelagh",
          "name": "Feitiço Inato"
        },
        {
          "description": "A dríade tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "A dríade pode se comunicar com feras e plantas como se elas compartilhassem uma língua.",
          "name": "Fale com feras e plantas"
        },
        {
          "description": "Uma vez em seu turno, a dríade pode usar 3 metros de seu movimento para pisar magicamente em uma árvore viva ao seu alcance e emergir de uma segunda árvore viva a até 18 metros da primeira árvore, aparecendo em um espaço desocupado a 1,5 metro da segunda árvore. Ambas as árvores devem ser grandes ou maiores.",
          "name": "Passo da árvore"
        }
      ]
    }
  },
  {
    "id": "srd:duergar",
    "name": "Duergar",
    "name_en": "Duergar",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 16,
    "hp_max": 26,
    "hp_formula": "4d8+8",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 9,
        "con": 14,
        "dex": 11,
        "int": 11,
        "str": 14,
        "wis": 10
      },
      "actions": [
        {
          "description": "Por 1 minuto, o duergar aumenta magicamente de tamanho, junto com qualquer coisa que esteja vestindo ou carregando. Enquanto aumentado, o duergar é Grande, dobra seus dados de dano em ataques com armas baseados em Força (incluídos nos ataques) e faz testes de Força e testes de resistência de Força com vantagem. Se o duergar não tiver espaço para se tornar Grande, ele atingirá o tamanho máximo possível no espaço disponível.",
          "name": "Ampliar (recarrega após um descanso curto ou longo)"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d8 + 2) de dano perfurante ou 11 (2d8 + 2) de dano perfurante enquanto estiver ampliado.",
          "name": "Escolha de Guerra"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma corpo a corpo ou de longo alcance: +4 para acertar, alcance 1,5 m ou alcance 9/36 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante ou 9 (2d6 + 2) de dano perfurante enquanto estiver ampliado.",
          "name": "Dardo"
        },
        {
          "description": "O duergar fica invisível magicamente até atacar, lançar uma magia ou usar seu Ampliar, ou até que sua concentração seja quebrada, por até 1 hora (como se estivesse se concentrando em uma magia). Qualquer equipamento que o duergar use ou carregue fica invisível junto com ele.",
          "name": "Invisibilidade (recarrega após um descanso curto ou longo)"
        }
      ],
      "damage_resistances": [
        "veneno"
      ],
      "languages": [
        "Anão",
        "Subcomum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 25
      },
      "traits": [
        {
          "description": "O duergar tem vantagem em testes de resistência contra venenos, magias e ilusões, bem como para resistir a ser enfeitiçado ou paralisado.",
          "name": "Resiliência Duergar"
        },
        {
          "description": "Enquanto estiver sob a luz do sol, o duergar tem desvantagem nas jogadas de ataque, bem como nos testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Sensibilidade à luz solar"
        }
      ]
    }
  },
  {
    "id": "srd:ghoul",
    "name": "Carniçal",
    "name_en": "Ghoul",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 12,
    "hp_max": 22,
    "hp_formula": "5d8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 10,
        "dex": 15,
        "int": 7,
        "str": 13,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "2d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, uma criatura. Acerto: 9 (2d6 + 2) de dano perfurante.",
          "name": "Morder"
        },
        {
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (2d4 + 2) de dano cortante. Se o alvo for uma criatura que não seja um elfo ou morto-vivo, ele deve ser bem sucedido em um teste de resistência de Constituição CD 10 ou ficará paralisado por 1 minuto. O alvo pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso.",
          "name": "Garras"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "Comum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:giant-eagle",
    "name": "Águia Gigante",
    "name_en": "Giant Eagle",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 13,
    "hp_max": 26,
    "hp_formula": "4d10+4",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 13,
        "dex": 17,
        "int": 8,
        "str": 16,
        "wis": 14
      },
      "actions": [
        {
          "description": "A águia faz dois ataques: um com o bico e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano perfurante.",
          "name": "Bico"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano cortante.",
          "name": "Garras"
        }
      ],
      "languages": [
        "Giant Eagle",
        "understands Common and Auran but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "voo": 80,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "A águia tem vantagem em testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Visão Aguçada"
        }
      ]
    }
  },
  {
    "id": "srd:giant-hyena",
    "name": "Hiena Gigante",
    "name_en": "Giant Hyena",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 12,
    "hp_max": 45,
    "hp_formula": "6d10+12",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 14,
        "dex": 14,
        "int": 2,
        "str": 16,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "Quando a hiena reduz uma criatura a 0 pontos de vida com um ataque corpo a corpo em seu turno, a hiena pode realizar uma ação bônus para se mover até metade de seu deslocamento e realizar um ataque de mordida.",
          "name": "Fúria"
        }
      ]
    }
  },
  {
    "id": "srd:giant-octopus",
    "name": "Polvo Gigante",
    "name_en": "Giant Octopus",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 11,
    "hp_max": 52,
    "hp_formula": "8d10+8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 13,
        "dex": 13,
        "int": 4,
        "str": 17,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 4,5 metros, um alvo. Acerto: 10 (2d6 + 3) de dano de concussão. Se o alvo for uma criatura, ele será agarrado (CD 16 para escapar). Até que a luta termine, o alvo fica contido e o polvo não pode usar seus tentáculos em outro alvo.",
          "name": "Tentáculos"
        },
        {
          "description": "Uma nuvem de tinta com 6 metros de raio se estende ao redor do polvo se ele estiver debaixo d'água. A área fica fortemente obscurecida por 1 minuto, embora uma corrente significativa possa dispersar a tinta. Depois de liberar a tinta, o polvo pode usar a ação Dash como ação bônus.",
          "name": "Nuvem de tinta (recarrega após um descanso curto ou longo)"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 5
      },
      "speed": {
        "natação": 60,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "Fora da água, o polvo pode prender a respiração por 1 hora.",
          "name": "Prenda a respiração"
        },
        {
          "description": "O polvo tem vantagem em testes de Destreza (Furtividade) feitos enquanto estiver debaixo d'água.",
          "name": "Camuflagem Subaquática"
        },
        {
          "description": "O polvo só consegue respirar debaixo d'água.",
          "name": "Respiração na Água"
        }
      ]
    }
  },
  {
    "id": "srd:giant-spider",
    "name": "Aranha Gigante",
    "name_en": "Giant Spider",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 14,
    "hp_max": 26,
    "hp_formula": "4d10+4",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 12,
        "dex": 16,
        "int": 2,
        "str": 14,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, uma criatura. Acerto: 7 (1d8 + 3) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 11, sofrendo 9 (2d8) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso. Se o dano de veneno reduzir o alvo a 0 pontos de vida, o alvo fica estável, mas envenenado por 1 hora, mesmo após recuperar pontos de vida, e fica paralisado enquanto estiver envenenado desta forma.",
          "name": "Morder"
        },
        {
          "attack_bonus": 5,
          "description": "Ataque com arma de longo alcance: +5 para acertar, alcance 30/60 pés, uma criatura. Acerto: O alvo é contido por uma teia. Como uma ação, o alvo contido pode fazer um teste de Força CD 12, rompendo a teia se obtiver sucesso. A teia também pode ser atacada e destruída (CA 10; PV 5; vulnerabilidade a dano de fogo; imunidade a concussão, veneno e dano psíquico).",
          "name": "Teia (recarga 5-6)"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "skills": {
        "Furtividade": 7
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A aranha pode escalar superfícies difíceis, inclusive de cabeça para baixo em tetos, sem precisar fazer um teste de habilidade.",
          "name": "Escalada de aranha"
        },
        {
          "description": "Enquanto estiver em contato com uma teia, a aranha sabe a localização exata de qualquer outra criatura em contato com a mesma teia.",
          "name": "Sentido da Web"
        },
        {
          "description": "A aranha ignora as restrições de movimento causadas pelas teias.",
          "name": "Caminhante da Web"
        }
      ]
    }
  },
  {
    "id": "srd:giant-toad",
    "name": "Sapo Gigante",
    "name_en": "Giant Toad",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 11,
    "hp_max": 39,
    "hp_formula": "6d10+6",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 13,
        "dex": 13,
        "int": 2,
        "str": 15,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d10+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d10 + 2) de dano perfurante mais 5 (1d10) de dano venenoso, e o alvo é agarrado (CD de fuga 13). Até que esta luta termine, o alvo fica contido e o sapo não pode morder outro alvo.",
          "name": "Morder"
        },
        {
          "description": "O sapo realiza um ataque de mordida contra um alvo Médio ou menor que esteja agarrando. Se o ataque acertar, o alvo é engolido e a luta termina. O alvo engolido fica cego e contido, tem cobertura total contra ataques e outros efeitos fora do sapo e sofre 10 (3d6) de dano ácido no início de cada turno do sapo. O sapo só pode engolir um alvo por vez.\nSe o sapo morrer, a criatura engolida não será mais contida por ele e poderá escapar do cadáver usando 1,5 metro de movimento, saindo caída.",
          "name": "Engolir"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 10
      },
      "speed": {
        "natação": 40,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O sapo pode respirar ar e água",
          "name": "Anfíbio"
        },
        {
          "description": "O salto em distância do sapo é de até 20 pés e seu salto em altura é de até 10 pés, com ou sem corrida.",
          "name": "Salto em pé"
        }
      ]
    }
  },
  {
    "id": "srd:giant-vulture",
    "name": "Abutre Gigante",
    "name_en": "Giant Vulture",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 10,
    "hp_max": 22,
    "hp_formula": "3d10+6",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 15,
        "dex": 10,
        "int": 6,
        "str": 15,
        "wis": 12
      },
      "actions": [
        {
          "description": "O abutre faz dois ataques: um com o bico e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (2d4 + 2) de dano perfurante.",
          "name": "Bico"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d6+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (2d6 + 2) de dano cortante.",
          "name": "Garras"
        }
      ],
      "languages": [
        "understands Common but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "voo": 60,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O abutre tem vantagem em testes de Sabedoria (Percepção) que dependem da visão ou do olfato.",
          "name": "Visão e olfato aguçados"
        },
        {
          "description": "O abutre tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do abutre estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:harpy",
    "name": "Harpia",
    "name_en": "Harpy",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 11,
    "hp_max": 38,
    "hp_formula": "7d8+7",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 13,
        "con": 12,
        "dex": 13,
        "int": 7,
        "str": 12,
        "wis": 10
      },
      "actions": [
        {
          "description": "A harpia faz dois ataques: um com as garras e outro com a clava.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "2d4+1",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (2d4 + 1) de dano cortante.",
          "name": "Garras"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d4+1",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, um alvo. Acerto: 3 (1d4 + 1) de dano de concussão.",
          "name": "Clube"
        },
        {
          "description": "A harpia canta uma melodia mágica. Todo humanóide e gigante a até 90 metros da harpia que puder ouvir a música deve ter sucesso em um teste de resistência de Sabedoria CD 11 ou ficará enfeitiçado até a música terminar. A harpia deve realizar uma ação bônus nos turnos subsequentes para continuar cantando. Pode parar de cantar a qualquer momento. A música termina se a harpia estiver incapacitada.\nEnquanto estiver encantado pela harpia, o alvo fica incapacitado e ignora as canções das outras harpias. Se o alvo encantado estiver a mais de 1,5 metro de distância da harpia, ele deverá se mover em seu turno em direção à harpia pela rota mais direta. Ele não evita ataques de oportunidade, mas antes de entrar em terreno prejudicial, como lava ou poço, e sempre que sofrer dano de uma fonte diferente da harpia, o alvo pode repetir o teste de resistência. Uma criatura também pode repetir o teste de resistência no final de cada um de seus turnos. Se o teste de resistência de uma criatura for bem sucedido, o efeito nela termina.\nUm alvo que conseguir salvar fica imune ao canto desta harpia pelas próximas 24 horas.",
          "name": "Canção atraente"
        }
      ],
      "languages": [
        "Comum"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "voo": 40,
        "deslocamento": 20
      }
    }
  },
  {
    "id": "srd:hippogriff",
    "name": "Hipogrifo",
    "name_en": "Hippogriff",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 11,
    "hp_max": 19,
    "hp_formula": "3d10+3",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 13,
        "dex": 13,
        "int": 2,
        "str": 17,
        "wis": 12
      },
      "actions": [
        {
          "description": "O hipogrifo faz dois ataques: um com o bico e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d10+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (1d10 + 3) de dano perfurante.",
          "name": "Bico"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano cortante.",
          "name": "Garras"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 15
      },
      "skills": {
        "Percepção": 5
      },
      "speed": {
        "voo": 60,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O hipogrifo tem vantagem em testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Visão Aguçada"
        }
      ]
    }
  },
  {
    "id": "srd:imp",
    "name": "Diabrete",
    "name_en": "Imp",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 13,
    "hp_max": 10,
    "hp_formula": "3d4+3",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 14,
        "con": 13,
        "dex": 17,
        "int": 11,
        "str": 6,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d4+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d4 + 3) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 11, sofrendo 10 (3d6) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso.",
          "name": "Sting (mordida em forma de besta)"
        },
        {
          "description": "O diabrete fica invisível magicamente até atacar ou até que sua concentração termine (como se estivesse se concentrando em um feitiço). Qualquer equipamento que o diabrete use ou carregue fica invisível com ele.",
          "name": "Invisibilidade"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "cold; bludgeoning",
        "perfurante",
        "and slashing from nonmagical/nonsilver weapons"
      ],
      "languages": [
        "Infernal",
        "Comum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 11
      },
      "skills": {
        "Enganação": 4,
        "Intuição": 3,
        "Persuasão": 4,
        "Furtividade": 5
      },
      "speed": {
        "voo": 40,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O diabrete pode usar sua ação para se transformar em uma forma de besta que se assemelha a um rato (velocidade 6 metros), um corvo (6 metros, voar 18 metros) ou uma aranha (6 metros, escalar 6 metros), ou voltar à sua forma verdadeira. Suas estatísticas são as mesmas em cada formulário, exceto pelas alterações de velocidade observadas. Qualquer equipamento que esteja vestindo ou carregando não é transformado. Ele reverte à sua verdadeira forma se morrer.",
          "name": "Metamorfo"
        },
        {
          "description": "A escuridão mágica não impede a visão no escuro do diabrete.",
          "name": "Visão do Diabo"
        },
        {
          "description": "O diabrete tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "O diabrete pode servir outra criatura como familiar, formando um vínculo telepático com seu mestre voluntário. Enquanto os dois estão ligados, o mestre pode sentir o que o diabrete sente, desde que estejam a 1,6 km um do outro. Enquanto o diabrete estiver a até 3 metros de seu mestre, o mestre compartilha a característica Resistência Mágica do diabrete. A qualquer momento e por qualquer motivo, o diabrete pode encerrar seu serviço como familiar, encerrando o vínculo telepático.",
          "name": "Variante: Familiar"
        }
      ]
    }
  },
  {
    "id": "srd:lion",
    "name": "Leão",
    "name_en": "Lion",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 12,
    "hp_max": 26,
    "hp_formula": "4d10+4",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 13,
        "dex": 15,
        "int": 3,
        "str": 17,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d8 + 3) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano cortante.",
          "name": "Garra"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 6
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "O leão tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        },
        {
          "description": "O leão tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do leão estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        },
        {
          "description": "Se o leão se mover pelo menos 6 metros em linha reta em direção a uma criatura e então acertá-la com um ataque de garra no mesmo turno, o alvo deve ser bem sucedido em um teste de resistência de Força CD 13 ou será derrubado. Se o alvo estiver caído, o leão pode realizar um ataque de mordida contra ele como uma ação bônus.",
          "name": "Atacar"
        },
        {
          "description": "Com uma corrida de 3 metros, o leão pode saltar em distância até 7,5 metros.",
          "name": "Salto de corrida"
        }
      ]
    }
  },
  {
    "id": "srd:quasit",
    "name": "Quase",
    "name_en": "Quasit",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 13,
    "hp_max": 7,
    "hp_formula": "3d4",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 10,
        "dex": 17,
        "int": 7,
        "str": 5,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d4 + 3) de dano perfurante, e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 10 ou sofrerá 5 (2d4) de dano de veneno e ficará envenenado por 1 minuto. O alvo pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso.",
          "name": "Garra (mordida em forma de besta)"
        },
        {
          "description": "Uma criatura, à escolha do quasit, a até 6 metros dele, deve ser bem sucedida em um teste de resistência de Sabedoria CD 10 ou ficará assustada por 1 minuto. O alvo pode repetir o teste de resistência no final de cada um de seus turnos, com desvantagem se o quasit estiver dentro da linha de visão, encerrando o efeito sobre si mesmo em caso de sucesso.",
          "name": "Susto (1/dia)"
        },
        {
          "description": "O quasit fica invisível magicamente até atacar ou usar Susto, ou até que sua concentração termine (como se estivesse se concentrando em um feitiço). Qualquer equipamento que o quasit use ou carregue fica invisível com ele.",
          "name": "Invisibilidade"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "frio",
        "fogo",
        "lightning; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Abissal",
        "Comum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 10
      },
      "skills": {
        "Furtividade": 5
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O quasit pode usar sua ação para se transformar em uma forma de besta que se assemelha a um morcego (velocidade 10 pés, voar 40 pés), uma centopéia (12 metros, escalar 12 metros) ou um sapo (12 metros, nadar 12 metros), ou voltar à sua forma verdadeira. Suas estatísticas são as mesmas em cada formulário, exceto pelas alterações de velocidade observadas. Qualquer equipamento que esteja vestindo ou carregando não é transformado. Ele reverte à sua verdadeira forma se morrer.",
          "name": "Metamorfo"
        },
        {
          "description": "O quasit tem vantagem em testes de resistência contra magias e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "O quasit pode servir a outra criatura como familiar, formando um vínculo telepático com seu mestre voluntário. Enquanto os dois estão ligados, o mestre pode sentir o que o quasit sente, desde que estejam a 1,6 km um do outro. Enquanto o quasit estiver a até 3 metros de seu mestre, o mestre compartilha o traço de Resistência Mágica do quasit. A qualquer momento e por qualquer motivo, o quasit pode encerrar seu serviço como familiar, encerrando o vínculo telepático.",
          "name": "Variante: Familiar"
        }
      ]
    }
  },
  {
    "id": "srd:specter",
    "name": "Espectro",
    "name_en": "Specter",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 12,
    "hp_max": 22,
    "hp_formula": "5d8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 11,
        "dex": 14,
        "int": 10,
        "str": 1,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "3d6+0",
              "type": "necrotic"
            }
          ],
          "description": "Ataque Mágico Corpo a Corpo: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 10 (3d6) de dano necrótico. O alvo deve ser bem sucedido em um teste de resistência de Constituição CD 10 ou seu máximo de pontos de vida será reduzido em uma quantidade igual ao dano sofrido. Esta redução dura até a criatura terminar um descanso longo. O alvo morre se este efeito reduzir seu máximo de pontos de vida a 0.",
          "name": "Dreno de Vida"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Envenenado",
        "Caído",
        "Impedido",
        "Inconsciente"
      ],
      "damage_immunities": [
        "necrótico",
        "veneno"
      ],
      "damage_resistances": [
        "ácido",
        "frio",
        "fogo",
        "elétrico",
        "thunder; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "understands all languages it knew in life but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "voo": 50,
        "pairar": true
      },
      "traits": [
        {
          "description": "O espectro pode se mover através de outras criaturas e objetos como se fossem terrenos difíceis. Ele sofre 5 (1d10) de dano de força se terminar seu turno dentro de um objeto.",
          "name": "Movimento Incorpóreo"
        },
        {
          "description": "Enquanto estiver sob a luz do sol, o espectro tem desvantagem nas jogadas de ataque, bem como nos testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Sensibilidade à luz solar"
        }
      ]
    }
  },
  {
    "id": "srd:spy",
    "name": "Espião",
    "name_en": "Spy",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 12,
    "hp_max": 27,
    "hp_formula": "6d8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 10,
        "dex": 15,
        "int": 12,
        "str": 10,
        "wis": 14
      },
      "actions": [
        {
          "description": "O espião faz dois ataques corpo a corpo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Espada curta"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 30/120 pés, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Besta de mão"
        }
      ],
      "languages": [
        "any two languages"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 16
      },
      "skills": {
        "Enganação": 5,
        "Intuição": 4,
        "Investigação": 5,
        "Percepção": 6,
        "Persuasão": 5,
        "Furtividade": 4
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Em cada um de seus turnos, o espião pode usar uma ação bônus para realizar a ação Correr, Desengajar ou Esconder-se.",
          "name": "Ação astuta"
        },
        {
          "description": "O espião causa 7 (2d6) de dano extra quando atinge um alvo com um ataque com arma e tem vantagem na jogada de ataque, ou quando o alvo está a até 1,5 metro de um aliado do espião que não está incapacitado e o espião não tem desvantagem na jogada de ataque.",
          "name": "Ataque Furtivo (1/Turno)"
        }
      ]
    }
  },
  {
    "id": "srd:swarm-of-quippers",
    "name": "Enxame de Quippers",
    "name_en": "Swarm of Quippers",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 13,
    "hp_max": 28,
    "hp_formula": "8d8-8",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 2,
        "con": 9,
        "dex": 16,
        "int": 1,
        "str": 13,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "4d6+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +5 para acertar, alcance 0 pés, uma criatura no espaço do enxame. Acerto: 14 (4d6) de dano perfurante, ou 7 (2d6) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos.",
          "name": "Mordidas"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Caído",
        "Impedido",
        "Atordoado"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "cortante"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 8
      },
      "speed": {
        "natação": 40
      },
      "traits": [
        {
          "description": "O enxame tem vantagem em jogadas de ataque corpo a corpo contra qualquer criatura que não tenha todos os seus pontos de vida.",
          "name": "Frenesi de Sangue"
        },
        {
          "description": "O enxame pode ocupar o espaço de outra criatura e vice-versa, e o enxame pode se mover através de qualquer abertura grande o suficiente para um Tiny Quipper. O enxame não pode recuperar pontos de vida nem ganhar pontos de vida temporários.",
          "name": "Enxame"
        },
        {
          "description": "O enxame só consegue respirar debaixo d'água.",
          "name": "Respiração na Água"
        }
      ]
    }
  },
  {
    "id": "srd:tiger",
    "name": "Tigre",
    "name_en": "Tiger",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "1",
    "cr_numeric": 1.0,
    "armor_class": 12,
    "hp_max": 37,
    "hp_formula": "5d10+10",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 14,
        "dex": 15,
        "int": 3,
        "str": 17,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d10+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (1d10 + 3) de dano perfurante.",
          "name": "Morder"
        },
        {
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d8 + 3) de dano cortante.",
          "name": "Garra"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 6
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O tigre tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        },
        {
          "description": "Se o tigre se mover pelo menos 6 metros em linha reta em direção a uma criatura e então acertá-la com um ataque de garra no mesmo turno, o alvo deve ser bem sucedido em um teste de resistência de Força CD 13 ou será derrubado. Se o alvo estiver caído, o tigre pode realizar um ataque de mordida contra ele como uma ação bônus.",
          "name": "Atacar"
        }
      ]
    }
  },
  {
    "id": "srd:ankheg",
    "name": "Ankheg",
    "name_en": "Ankheg",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 14,
    "hp_max": 39,
    "hp_formula": "6d10+6",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 13,
        "dex": 11,
        "int": 1,
        "str": 17,
        "wis": 13
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+1d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano cortante mais 3 (1d6) de dano ácido. Se o alvo for uma criatura Grande ou menor, ele será agarrado (CD 13 para escapar). Até que o agarrão termine, o ankheg pode morder apenas a criatura agarrada e tem vantagem nas jogadas de ataque para fazê-lo.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "3d6+0",
              "type": "acid"
            }
          ],
          "description": "O ankheg cospe ácido em uma linha de 9 metros de comprimento e 1,5 metros de largura, desde que não haja nenhuma criatura agarrada. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 13, sofrendo 10 (3d6) de dano de ácido se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Spray Ácido (Recarga 6)"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 11,
        "percepção sísmica": 60
      },
      "speed": {
        "escavação": 10,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:awakened-tree",
    "name": "Árvore Desperta",
    "name_en": "Awakened Tree",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Planta",
    "type_en": "plant",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 13,
    "hp_max": 59,
    "hp_formula": "7d12+14",
    "initiative_modifier": -2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 15,
        "dex": 6,
        "int": 10,
        "str": 19,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "3d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 metros, um alvo. Acerto: 14 (3d6 + 4) de dano de concussão.",
          "name": "Bater"
        }
      ],
      "damage_resistances": [
        "contundente",
        "perfurante"
      ],
      "damage_vulnerabilities": [
        "fogo"
      ],
      "languages": [
        "one language known by its creator"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "Enquanto a árvore permanece imóvel, ela é indistinguível de uma árvore normal.",
          "name": "Aparência Falsa"
        }
      ]
    }
  },
  {
    "id": "srd:azer",
    "name": "Azer",
    "name_en": "Azer",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 17,
    "hp_max": 39,
    "hp_formula": "6d8+12",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 15,
        "dex": 12,
        "int": 12,
        "str": 17,
        "wis": 13
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+1d6+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d8 + 3) de dano de concussão, ou 8 (1d10 + 3) de dano de concussão se usado com as duas mãos para fazer um ataque corpo a corpo, mais 3 (1d6) de dano de fogo.",
          "name": "Martelo de guerra"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "languages": [
        "Ignan"
      ],
      "saving_throws": {
        "con": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 11
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Uma criatura que tocar o azer ou acertá-lo com um ataque corpo a corpo enquanto estiver a 1,5 metro dele sofre 5 (1d10) de dano de fogo.",
          "name": "Corpo Aquecido"
        },
        {
          "description": "Quando o azer acerta com uma arma corpo a corpo de metal, ele causa 3 (1d6) de dano de fogo extra (incluído no ataque).",
          "name": "Armas Aquecidas"
        },
        {
          "description": "O azer emite luz brilhante em um raio de 3 metros e luz fraca por mais 3 metros adicionais.",
          "name": "Iluminação"
        }
      ]
    }
  },
  {
    "id": "srd:bandit-captain",
    "name": "Capitão bandido",
    "name_en": "Bandit Captain",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 15,
    "hp_max": 65,
    "hp_formula": "10d8+20",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 14,
        "con": 14,
        "dex": 16,
        "int": 14,
        "str": 15,
        "wis": 11
      },
      "actions": [
        {
          "description": "O capitão realiza três ataques corpo a corpo: dois com a cimitarra e um com a adaga. Ou o capitão faz dois ataques à distância com suas adagas.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano cortante.",
          "name": "Cimitarra"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d4+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma corpo a corpo ou de longo alcance: +5 para acertar, alcance 1,5 m ou alcance de 6/18 m, um alvo. Acerto: 5 (1d4 + 3) de dano perfurante.",
          "name": "Punhal"
        }
      ],
      "languages": [
        "any two languages"
      ],
      "reactions": [
        {
          "description": "O capitão adiciona 2 à sua CA contra um ataque corpo a corpo que o acerte. Para fazer isso, o capitão deve ver o atacante e estar empunhando uma arma branca.",
          "name": "Desviar"
        }
      ],
      "saving_throws": {
        "dex": 5,
        "str": 4,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "skills": {
        "Atletismo": 4,
        "Enganação": 4
      },
      "speed": {
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:berserker",
    "name": "Berserker",
    "name_en": "Berserker",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 13,
    "hp_max": 67,
    "hp_formula": "9d8+27",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 9,
        "con": 17,
        "dex": 12,
        "int": 9,
        "str": 16,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d12+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (1d12 + 3) de dano cortante.",
          "name": "Machado Grande"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "No início de seu turno, o furioso pode ganhar vantagem em todas as jogadas de ataque com armas corpo a corpo durante aquele turno, mas as jogadas de ataque contra ele têm vantagem até o início de seu próximo turno.",
          "name": "Irresponsável"
        }
      ]
    }
  },
  {
    "id": "srd:black-dragon-wyrmling",
    "name": "Dragão Negro Wyrmling",
    "name_en": "Black Dragon Wyrmling",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 17,
    "hp_max": 33,
    "hp_formula": "6d8+6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 13,
        "con": 13,
        "dex": 14,
        "int": 10,
        "str": 15,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d10+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d10 + 2) de dano perfurante mais 2 (1d4) de dano ácido.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "5d8+0",
              "type": "acid"
            }
          ],
          "description": "O dragão exala ácido em uma linha de 4,5 metros com 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 11, sofrendo 22 (5d8) de dano de ácido se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Ácido (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "ácido"
      ],
      "languages": [
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 3,
        "con": 3,
        "dex": 4,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 4
      },
      "speed": {
        "voo": 60,
        "natação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:bronze-dragon-wyrmling",
    "name": "Dragonete de Bronze",
    "name_en": "Bronze Dragon Wyrmling",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 17,
    "hp_max": 32,
    "hp_formula": "5d8+10",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 15,
        "dex": 10,
        "int": 12,
        "str": 17,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d10+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (1d10 + 3) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "3d10+0",
              "type": "lightning"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Lightning Breath.** The dragon exhales lightning in a 40-foot line that is 5 feet wide. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 12, sofrendo 16 (3d10) de dano elétrico se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Repulsion Breath.** The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 12 Strength saving throw. On a failed save, the creature is pushed 30 feet away from the dragon.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "elétrico"
      ],
      "languages": [
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 4,
        "con": 4,
        "dex": 2,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 2
      },
      "speed": {
        "voo": 60,
        "natação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:centaur",
    "name": "Centauro",
    "name_en": "Centaur",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 45,
    "hp_formula": "6d10+12",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 14,
        "dex": 14,
        "int": 9,
        "str": 18,
        "wis": 13
      },
      "actions": [
        {
          "description": "O centauro faz dois ataques: um com a lança e outro com os cascos ou dois com o arco longo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d10+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 metros, um alvo. Acerto: 9 (1d10 + 4) de dano perfurante.",
          "name": "Pique"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano de concussão.",
          "name": "Cascos"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 150/600 pés, um alvo. Acerto: 6 (1d8 + 2) de dano perfurante.",
          "name": "Arco longo"
        }
      ],
      "languages": [
        "Élfico",
        "Silvestre"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Atletismo": 6,
        "Percepção": 3,
        "Sobrevivência": 3
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "Se o centauro se mover pelo menos 9 metros em linha reta em direção a um alvo e então acertá-lo com um ataque de lança no mesmo turno, o alvo sofre 10 (3d6) de dano perfurante extra.",
          "name": "Cobrar"
        }
      ]
    }
  },
  {
    "id": "srd:cult-fanatic",
    "name": "Fanático por Culto",
    "name_en": "Cult Fanatic",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 13,
    "hp_max": 22,
    "hp_formula": "6d8+6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 14,
        "con": 12,
        "dex": 14,
        "int": 10,
        "str": 11,
        "wis": 13
      },
      "actions": [
        {
          "description": "O fanático faz dois ataques corpo a corpo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo ou de longo alcance com arma: +4 para acertar, alcance 1,5 m ou alcance 6/18 m, uma criatura. Acerto: 4 (1d4 + 2) de dano perfurante.",
          "name": "Punhal"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 11
      },
      "skills": {
        "Enganação": 4,
        "Persuasão": 4,
        "Religião": 2
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O fanático tem vantagem nos testes de resistência contra ficar enfeitiçado ou assustado.",
          "name": "Devoção Negra"
        },
        {
          "description": "O fanático é um conjurador de 4º nível. Sua habilidade de lançar feitiços é Sabedoria (CD de resistência de feitiço 11, +3 para acertar com ataques de feitiço). O fanático tem os seguintes feitiços de clérigo preparados:\n\nTruques (à vontade): luz, chama sagrada, taumaturgia\n* 1º nível (4 espaços): comandar, infligir ferimentos, escudo da fé\n* 2º nível (3 slots): segurar pessoa, arma espiritual",
          "name": "Feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:druid",
    "name": "druida",
    "name_en": "Druid",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 11,
    "hp_max": 27,
    "hp_formula": "5d8+5",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 13,
        "dex": 12,
        "int": 12,
        "str": 10,
        "wis": 15
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d6+0",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +2 para acertar (+4 para acertar com shillelagh), alcance 1,5 m, um alvo. Acerto: 3 (1d6) de dano de concussão ou 6 (1d8 + 2) de dano de concussão com shillelagh ou se empunhado com as duas mãos.",
          "name": "Pessoal"
        }
      ],
      "languages": [
        "Druidic plus any two languages"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14
      },
      "skills": {
        "Medicina": 4,
        "Natureza": 3,
        "Percepção": 4
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O druida é um conjurador de 4º nível. Sua habilidade de lançar feitiços é Sabedoria (resistência de feitiço CD 12, +4 para acertar com ataques de feitiço). Possui os seguintes feitiços druidas preparados:\n\n* Truques (à vontade): druidismo, produzir chama, shillelagh\n* 1º nível (4 espaços): enredar, andar longo, falar com animais, onda trovejante\n* 2º nível (3 espaços): mensageiro animal, pele de casca de árvore",
          "name": "Feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:ettercap",
    "name": "Ettercap",
    "name_en": "Ettercap",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 13,
    "hp_max": 44,
    "hp_formula": "8d8+8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 13,
        "dex": 15,
        "int": 7,
        "str": 14,
        "wis": 12
      },
      "actions": [
        {
          "description": "O ettercap faz dois ataques: um com a mordida e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 6 (1d8 + 2) de dano perfurante mais 4 (1d8) de dano venenoso. O alvo deve ser bem sucedido em um teste de resistência de Constituição CD 11 ou ficará envenenado por 1 minuto. A criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.",
          "name": "Morder"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d4+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (2d4 + 2) de dano cortante.",
          "name": "Garras"
        },
        {
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 30/60 pés, uma criatura grande ou menor. Acerto: A criatura é contida por uma teia. Como uma ação, a criatura contida pode fazer um teste de Força CD 11, escapando da teia se obtiver sucesso. O efeito termina se a teia for destruída. A teia tem CA 10, 5 pontos de vida, vulnerabilidade a dano de fogo e imunidade a concussão, veneno e dano psíquico.",
          "name": "Teia (recarga 5-6)"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura Média ou Pequena contra a qual o ettercap tem vantagem na jogada de ataque. Acerto: 4 (1d4 + 2) de dano de concussão e o alvo é agarrado (CD de fuga 12). Até que este agarrão termine, o alvo não pode respirar, e o ettercap tem vantagem nas jogadas de ataque contra ele.",
          "name": "Variante: Web Garrote"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 4,
        "Sobrevivência": 3
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O ettercap pode escalar superfícies difíceis, inclusive de cabeça para baixo em tetos, sem precisar fazer um teste de habilidade.",
          "name": "Escalada de aranha"
        },
        {
          "description": "Enquanto estiver em contato com uma teia, o ettercap sabe a localização exata de qualquer outra criatura em contato com a mesma teia.",
          "name": "Sentido da Web"
        },
        {
          "description": "O ettercap ignora restrições de movimento causadas por correias.",
          "name": "Caminhante da Web"
        }
      ]
    }
  },
  {
    "id": "srd:gargoyle",
    "name": "Gárgula",
    "name_en": "Gargoyle",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 15,
    "hp_max": 52,
    "hp_formula": "7d8+21",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 16,
        "dex": 11,
        "int": 6,
        "str": 15,
        "wis": 11
      },
      "actions": [
        {
          "description": "A gárgula faz dois ataques: um com a mordida e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano cortante.",
          "name": "Garras"
        }
      ],
      "condition_immunities": [
        "Exausto",
        "Petrificado",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks not made with adamantine weapons"
      ],
      "languages": [
        "Terran"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "voo": 60,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Embora a gárgula permaneça sem movimento, ela é indistinguível de uma estátua inanimada.",
          "name": "Aparência Falsa"
        }
      ]
    }
  },
  {
    "id": "srd:gelatinous-cube",
    "name": "Cubo Gelatina",
    "name_en": "Gelatinous Cube",
    "size": "Grande",
    "size_en": "Large",
    "type": "Gosma",
    "type_en": "ooze",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 6,
    "hp_max": 84,
    "hp_formula": "8d10+40",
    "initiative_modifier": -4,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 20,
        "dex": 3,
        "int": 1,
        "str": 14,
        "wis": 6
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "3d6+0",
              "type": "acid"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Sucesso: 10 (3d6) de dano ácido.",
          "name": "Pseudópode"
        },
        {
          "description": "O cubo se move até sua velocidade. Ao fazer isso, ele pode entrar em espaços de criaturas Grandes ou menores. Sempre que o cubo entra no espaço de uma criatura, a criatura deve realizar um teste de resistência de Destreza CD 12.\nSe obtiver sucesso, a criatura pode escolher ser empurrada 1,5 metro para trás ou para o lado do cubo. Uma criatura que escolhe não ser empurrada sofre as consequências de uma falha no teste de resistência.\nSe falhar na resistência, o cubo entra no espaço da criatura, e a criatura sofre 10 (3d6) de dano de ácido e é engolfada. A criatura engolfada não consegue respirar, fica impedida e sofre 21 (6d6) de dano ácido no início de cada turno do cubo. Quando o cubo se move, a criatura engolfada se move com ele.\nUma criatura engolfada pode tentar escapar realizando uma ação para fazer um teste de Força CD 12. Se obtiver sucesso, a criatura escapa e entra em um espaço de sua escolha a até 1,5 metro do cubo.",
          "name": "Engolir"
        }
      ],
      "condition_immunities": [
        "Cego",
        "Enfeitiçado",
        "Surdo",
        "Exausto",
        "Amedrontado",
        "Caído"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 8
      },
      "speed": {
        "deslocamento": 15
      },
      "traits": [
        {
          "description": "O cubo ocupa todo o seu espaço. Outras criaturas podem entrar no espaço, mas uma criatura que o faça estará sujeita ao Engolfo do cubo e terá desvantagem no teste de resistência.\nAs criaturas dentro do cubo podem ser vistas, mas têm cobertura total.\nUma criatura a até 1,5 metro do cubo pode realizar uma ação para puxar uma criatura ou objeto para fora do cubo. Fazer isso requer um teste bem sucedido de Força CD 12, e a criatura que faz a tentativa sofre 10 (3d6) de dano ácido.\nO cubo pode conter apenas uma criatura Grande ou até quatro criaturas Médias ou menores dentro dele por vez.",
          "name": "Cubo de Lodo"
        },
        {
          "description": "Mesmo quando o cubo está à vista, é necessário um teste bem-sucedido de Sabedoria (Percepção) CD 15 para localizar um cubo que não se moveu nem atacou. Uma criatura que tenta entrar no espaço do cubo sem saber da presença do cubo é surpreendida pelo cubo.",
          "name": "Transparente"
        }
      ]
    }
  },
  {
    "id": "srd:ghast",
    "name": "Fantástico",
    "name_en": "Ghast",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 13,
    "hp_max": 36,
    "hp_formula": "8d8",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 10,
        "dex": 17,
        "int": 11,
        "str": 16,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "2d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +3 para acertar, alcance 1,5 m, uma criatura. Acerto: 12 (2d8 + 3) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano cortante. Se o alvo for uma criatura que não seja um morto-vivo, ele deve ser bem sucedido em um teste de resistência de Constituição CD 10 ou ficará paralisado por 1 minuto. O alvo pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso.",
          "name": "Garras"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "necrótico"
      ],
      "languages": [
        "Comum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Qualquer criatura que comece seu turno a até 1,5 metro do fantasma deve ser bem sucedida em um teste de resistência de Constituição CD 10 ou será envenenada até o início de seu próximo turno. Em um teste de resistência bem-sucedido, a criatura fica imune ao Fedor do fantasma por 24 horas.",
          "name": "Fedor"
        },
        {
          "description": "O fantasma e quaisquer carniçais a até 9 metros dele têm vantagem em testes de resistência contra efeitos que expulsam mortos-vivos.",
          "name": "Vire Desafio"
        }
      ]
    }
  },
  {
    "id": "srd:giant-boar",
    "name": "Javali Gigante",
    "name_en": "Giant Boar",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 42,
    "hp_formula": "5d10+15",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 16,
        "dex": 10,
        "int": 2,
        "str": 17,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano cortante.",
          "name": "Presa"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 8
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o javali se mover pelo menos 6 metros em linha reta em direção a um alvo e então acertá-lo com um ataque de presa no mesmo turno, o alvo sofre 7 (2d6) de dano cortante extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 13 ou será derrubado.",
          "name": "Cobrar"
        },
        {
          "description": "Se o javali sofrer 10 pontos de dano ou menos que o reduziriam a 0 pontos de vida, ele será reduzido a 1 ponto de vida.",
          "name": "Implacável (recarrega após um descanso curto ou longo)"
        }
      ]
    }
  },
  {
    "id": "srd:giant-constrictor-snake",
    "name": "Cobra Constritora Gigante",
    "name_en": "Giant Constrictor Snake",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Fera",
    "type_en": "beast",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 60,
    "hp_formula": "8d12+8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 12,
        "dex": 14,
        "int": 1,
        "str": 19,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 metros, uma criatura. Acerto: 11 (2d6 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +6 para acertar, alcance 1,5 m, uma criatura. Acerto: 13 (2d8 + 4) de dano de concussão e o alvo é agarrado (CD de fuga 16). Até que esta luta termine, a criatura estará contida e a cobra não poderá constringir outro alvo.",
          "name": "Contrair"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2
      },
      "speed": {
        "natação": 30,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:giant-elk",
    "name": "Alce Gigante",
    "name_en": "Giant Elk",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Fera",
    "type_en": "beast",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 15,
    "hp_max": 42,
    "hp_formula": "5d12+10",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 14,
        "dex": 16,
        "int": 7,
        "str": 19,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 metros, um alvo. Acerto: 11 (2d6 + 4) de dano de concussão.",
          "name": "Bater"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "4d8+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, uma criatura caída. Acerto: 22 (4d8 + 4) de dano de concussão.",
          "name": "Cascos"
        }
      ],
      "languages": [
        "Giant Elk",
        "understands Common",
        "Élfico",
        "and Sylvan but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "deslocamento": 60
      },
      "traits": [
        {
          "description": "Se o alce se mover pelo menos 6 metros em linha reta em direção a um alvo e então acertá-lo com um ataque de aríete no mesmo turno, o alvo sofre 7 (2d6) de dano extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 14 ou será derrubado.",
          "name": "Cobrar"
        }
      ]
    }
  },
  {
    "id": "srd:gibbering-mouther",
    "name": "Balbuciante tagarela",
    "name_en": "Gibbering Mouther",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Aberração",
    "type_en": "aberration",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 9,
    "hp_max": 67,
    "hp_formula": "9d8+27",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 16,
        "dex": 8,
        "int": 3,
        "str": 10,
        "wis": 10
      },
      "actions": [
        {
          "description": "O abocanhador tagarela faz um ataque de mordida e, se puder, usa sua Cuspe Cegante.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "5d6+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, uma criatura. Acerto: 17 (5d6) de dano perfurante. Se o alvo for Médio ou menor, ele deve ter sucesso em um teste de resistência de Força CD 10 ou será derrubado. Se o alvo for morto por este dano, ele será absorvido pelo abocanhador.",
          "name": "Mordidas"
        },
        {
          "description": "O abocanhador cospe uma bola química em um ponto que pode ser visto a até 4,5 metros dele. A bola explode em um clarão de luz ofuscante com o impacto. Cada criatura a até 1,5 metro do clarão deve ser bem sucedida em um teste de resistência de Destreza CD 13 ou ficará cega até o final do próximo turno do abocanhador.",
          "name": "Cuspe Cegante (Recarga 5-6)"
        }
      ],
      "condition_immunities": [
        "Caído"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "natação": 10,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O solo em um raio de 3 metros ao redor do bocal é um terreno difícil e duro. Cada criatura que iniciar seu turno naquela área deve ser bem sucedida em um teste de resistência de Força CD 10 ou terá seu deslocamento reduzido a 0 até o início de seu próximo turno.",
          "name": "Terreno Aberrante"
        },
        {
          "description": "O abocanhador balbucia incoerentemente enquanto pode ver qualquer criatura e não está incapacitado. Cada criatura que começar seu turno a até 6 metros do abocanhador e puder ouvir a tagarelice deve ser bem sucedida em um teste de resistência de Sabedoria CD 10. Em caso de falha, a criatura não pode realizar reações até o início de seu próximo turno e rola um d8 para determinar o que fará durante seu turno. Num resultado de 1 a 4, a criatura não faz nada. Com um 5 ou 6, a criatura não realiza nenhuma ação ou ação bônus e usa todo o seu movimento para se mover em uma direção determinada aleatoriamente. Com 7 ou 8, a criatura realiza um ataque corpo a corpo contra uma criatura determinada aleatoriamente ao seu alcance ou não faz nada se não puder realizar tal ataque.",
          "name": "Balbuciando"
        }
      ]
    }
  },
  {
    "id": "srd:green-dragon-wyrmling",
    "name": "Dragão Verde Wyrmling",
    "name_en": "Green Dragon Wyrmling",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 17,
    "hp_max": 38,
    "hp_formula": "7d8+7",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 13,
        "con": 13,
        "dex": 12,
        "int": 14,
        "str": 15,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d10+1d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d10 + 2) de dano perfurante mais 3 (1d6) de dano venenoso.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "6d6+0",
              "type": "poison"
            }
          ],
          "description": "O dragão exala gás venenoso em um cone de 4,5 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 11, sofrendo 21 (6d6) de dano de veneno se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Venenoso (Recarga 5-6)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 3,
        "con": 3,
        "dex": 3,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 3
      },
      "speed": {
        "voo": 60,
        "natação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:grick",
    "name": "Grick",
    "name_en": "Grick",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 14,
    "hp_max": 27,
    "hp_formula": "6d8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 11,
        "dex": 14,
        "int": 3,
        "str": 14,
        "wis": 14
      },
      "actions": [
        {
          "description": "O grick faz um ataque com seus tentáculos. Se esse ataque acertar, o grick pode fazer um ataque de bico contra o mesmo alvo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d6+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (2d6 + 2) de dano cortante.",
          "name": "Tentáculos"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Bico"
        }
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 12
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O grick tem vantagem em testes de Destreza (Furtividade) feitos para se esconder em terreno rochoso.",
          "name": "Camuflagem de Pedra"
        }
      ]
    }
  },
  {
    "id": "srd:griffon",
    "name": "Grifo",
    "name_en": "Griffon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 59,
    "hp_formula": "7d10+21",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 16,
        "dex": 15,
        "int": 2,
        "str": 18,
        "wis": 13
      },
      "actions": [
        {
          "description": "O grifo faz dois ataques: um com o bico e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (1d8 + 4) de dano perfurante.",
          "name": "Bico"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.",
          "name": "Garras"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 15
      },
      "skills": {
        "Percepção": 5
      },
      "speed": {
        "voo": 80,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O grifo tem vantagem em testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Visão Aguçada"
        }
      ]
    }
  },
  {
    "id": "srd:hunter-shark",
    "name": "Tubarão Caçador",
    "name_en": "Hunter Shark",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 45,
    "hp_formula": "6d10+12",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 15,
        "dex": 13,
        "int": 1,
        "str": 18,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 30,
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2
      },
      "speed": {
        "natação": 40
      },
      "traits": [
        {
          "description": "O tubarão tem vantagem em jogadas de ataque corpo a corpo contra qualquer criatura que não tenha todos os seus pontos de vida.",
          "name": "Frenesi de Sangue"
        },
        {
          "description": "O tubarão só consegue respirar debaixo d'água.",
          "name": "Respiração na Água"
        }
      ]
    }
  },
  {
    "id": "srd:merrow",
    "name": "Merrow",
    "name_en": "Merrow",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 13,
    "hp_max": 45,
    "hp_formula": "6d10+12",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 9,
        "con": 15,
        "dex": 10,
        "int": 8,
        "str": 18,
        "wis": 10
      },
      "actions": [
        {
          "description": "O merrow faz dois ataques: um com a mordida e outro com as garras ou arpão.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (1d8 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d4+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (2d4 + 4) de dano cortante.",
          "name": "Garras"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo ou de longo alcance com arma: +6 para acertar, alcance 1,5 m ou alcance 6/18 m, um alvo. Acerto: 11 (2d6 + 4) de dano perfurante. Se o alvo for uma criatura Enorme ou menor, ele deve ter sucesso em uma disputa de Força contra o merrow ou será puxado até 6 metros em direção ao merrow.",
          "name": "Arpão"
        }
      ],
      "languages": [
        "Abissal",
        "Aquan"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "natação": 40,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O merrow pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:mimic",
    "name": "Imitar",
    "name_en": "Mimic",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 58,
    "hp_formula": "9d8+18",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 15,
        "dex": 12,
        "int": 5,
        "str": 17,
        "wis": 13
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d8 + 3) de dano de concussão. Se o mímico estiver na forma de objeto, o alvo estará sujeito ao seu traço Adesivo.",
          "name": "Pseudópode"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+1d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d8 + 3) de dano perfurante mais 4 (1d8) de dano ácido.",
          "name": "Morder"
        }
      ],
      "condition_immunities": [
        "Caído"
      ],
      "damage_immunities": [
        "ácido"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 11
      },
      "skills": {
        "Furtividade": 5
      },
      "speed": {
        "deslocamento": 15
      },
      "traits": [
        {
          "description": "O mímico pode usar sua ação para se transformar em um objeto ou voltar à sua forma amorfa verdadeira. Suas estatísticas são as mesmas em cada formulário. Qualquer equipamento que esteja vestindo ou carregando não é transformado. Ele reverte à sua verdadeira forma se morrer.",
          "name": "Metamorfo"
        },
        {
          "description": "O mímico adere a tudo que o toca. Uma criatura Enorme ou menor aderida ao mímico também é agarrada por ele (CD 13 para escapar). Testes de habilidade feitos para escapar deste agarrão têm desvantagem.",
          "name": "Adesivo (somente forma de objeto)"
        },
        {
          "description": "Embora a mímica permaneça imóvel, ela é indistinguível de um objeto comum.",
          "name": "Aparência falsa (somente formulário de objeto)"
        },
        {
          "description": "O mímico tem vantagem nas jogadas de ataque contra qualquer criatura agarrada por ele.",
          "name": "Lutador"
        }
      ]
    }
  },
  {
    "id": "srd:minotaur-skeleton",
    "name": "Esqueleto do Minotauro",
    "name_en": "Minotaur Skeleton",
    "size": "Grande",
    "size_en": "Large",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 67,
    "hp_formula": "9d10+18",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 15,
        "dex": 11,
        "int": 6,
        "str": 18,
        "wis": 8
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d12+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 17 (2d12 + 4) de dano cortante.",
          "name": "Machado Grande"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano perfurante.",
          "name": "Sangrento"
        }
      ],
      "condition_immunities": [
        "Exausto",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_vulnerabilities": [
        "contundente"
      ],
      "languages": [
        "understands Abyssal but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 9
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o esqueleto se mover pelo menos 3 metros em linha reta em direção a um alvo e então acertá-lo com um ataque sangrento no mesmo turno, o alvo sofre 9 (2d8) de dano perfurante extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 14 ou será empurrado até 3 metros de distância e derrubado.",
          "name": "Cobrar"
        }
      ]
    }
  },
  {
    "id": "srd:ochre-jelly",
    "name": "Geléia Ocre",
    "name_en": "Ochre Jelly",
    "size": "Grande",
    "size_en": "Large",
    "type": "Gosma",
    "type_en": "ooze",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 8,
    "hp_max": 45,
    "hp_formula": "6d10+12",
    "initiative_modifier": -2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 14,
        "dex": 6,
        "int": 2,
        "str": 15,
        "wis": 6
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d6+2",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (2d6 + 2) de dano de concussão mais 3 (1d6) de dano de ácido.",
          "name": "Pseudópode"
        }
      ],
      "condition_immunities": [
        "Cego",
        "Enfeitiçado",
        "Surdo",
        "Exausto",
        "Amedrontado",
        "Caído"
      ],
      "damage_immunities": [
        "elétrico",
        "cortante"
      ],
      "damage_resistances": [
        "ácido"
      ],
      "reactions": [
        {
          "description": "Quando uma geleia Média ou maior é submetida a dano elétrico ou cortante, ela se divide em duas novas geleias se tiver pelo menos 10 pontos de vida. Cada nova geleia tem pontos de vida iguais à metade da geleia original, arredondados para baixo. As novas geleias são um tamanho menor que a geleia original.",
          "name": "Dividir"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 8
      },
      "speed": {
        "escalada": 10,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "A geleia pode se mover através de um espaço estreito de até 2,5 cm de largura sem ser comprimida.",
          "name": "Amorfo"
        },
        {
          "description": "A geleia pode escalar superfícies difíceis, inclusive de cabeça para baixo em tetos, sem a necessidade de fazer um teste de habilidade.",
          "name": "Escalada de aranha"
        }
      ]
    }
  },
  {
    "id": "srd:ogre",
    "name": "Ogro",
    "name_en": "Ogre",
    "size": "Grande",
    "size_en": "Large",
    "type": "Gigante",
    "type_en": "giant",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 11,
    "hp_max": 59,
    "hp_formula": "7d10+21",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 16,
        "dex": 8,
        "int": 5,
        "str": 19,
        "wis": 7
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano de concussão.",
          "name": "Grande clube"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo ou de longo alcance com arma: +6 para acertar, alcance 1,5 m ou alcance 9/36 m, um alvo. Acerto: 11 (2d6 + 4) de dano perfurante.",
          "name": "Dardo"
        }
      ],
      "languages": [
        "Comum",
        "Gigante"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 8
      },
      "speed": {
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:ogre-zombie",
    "name": "Ogro Zumbi",
    "name_en": "Ogre Zombie",
    "size": "Grande",
    "size_en": "Large",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 8,
    "hp_max": 85,
    "hp_formula": "9d10+36",
    "initiative_modifier": -2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 18,
        "dex": 6,
        "int": 3,
        "str": 19,
        "wis": 6
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano de concussão.",
          "name": "Estrela da Manhã"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "understands Common and Giant but can't speak"
      ],
      "saving_throws": {
        "wis": 0
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 8
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Se o dano reduzir o zumbi a 0 pontos de vida, ele deve realizar um teste de resistência de Constituição com CD 5 + o dano recebido, a menos que o dano seja radiante ou de um acerto crítico. Com um sucesso, o zumbi cai para 1 ponto de vida.",
          "name": "Fortaleza dos mortos-vivos"
        }
      ]
    }
  },
  {
    "id": "srd:pegasus",
    "name": "Pégaso",
    "name_en": "Pegasus",
    "size": "Grande",
    "size_en": "Large",
    "type": "Celestial",
    "type_en": "celestial",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 59,
    "hp_formula": "7d10+21",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 13,
        "con": 16,
        "dex": 15,
        "int": 10,
        "str": 18,
        "wis": 15
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano de concussão.",
          "name": "Cascos"
        }
      ],
      "languages": [
        "understands Celestial",
        "Comum",
        "Élfico",
        "and Sylvan but can't speak"
      ],
      "saving_throws": {
        "cha": 3,
        "dex": 4,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 16
      },
      "skills": {
        "Percepção": 6
      },
      "speed": {
        "voo": 90,
        "deslocamento": 60
      }
    }
  },
  {
    "id": "srd:plesiosaurus",
    "name": "Plesiossauro",
    "name_en": "Plesiosaurus",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 13,
    "hp_max": 68,
    "hp_formula": "8d10+24",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 16,
        "dex": 15,
        "int": 2,
        "str": 18,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "3d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 metros, um alvo. Acerto: 14 (3d6 + 4) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 4
      },
      "speed": {
        "natação": 40,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O plesiossauro pode prender a respiração por 1 hora.",
          "name": "Prenda a respiração"
        }
      ]
    }
  },
  {
    "id": "srd:polar-bear",
    "name": "Urso polar",
    "name_en": "Polar Bear",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 42,
    "hp_formula": "5d10+15",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 16,
        "dex": 10,
        "int": 2,
        "str": 20,
        "wis": 13
      },
      "actions": [
        {
          "description": "O urso faz dois ataques: um com a mordida e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "1d8+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (1d8 + 5) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+5",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 12 (2d6 + 5) de dano cortante.",
          "name": "Garras"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "natação": 30,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O urso tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        }
      ]
    }
  },
  {
    "id": "srd:priest",
    "name": "Padre",
    "name_en": "Priest",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 13,
    "hp_max": 27,
    "hp_formula": "5d8+5",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 13,
        "con": 12,
        "dex": 10,
        "int": 13,
        "str": 10,
        "wis": 16
      },
      "actions": [
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d6+0",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +2 para acertar, alcance 1,5 m, um alvo. Acerto: 3 (1d6) de dano de concussão.",
          "name": "Mace"
        }
      ],
      "languages": [
        "any two languages"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Medicina": 7,
        "Persuasão": 3,
        "Religião": 5
      },
      "speed": {
        "deslocamento": 25
      },
      "traits": [
        {
          "description": "Como uma ação bônus, o sacerdote pode gastar um espaço de magia para fazer com que seus ataques com armas corpo a corpo causem magicamente 10 (3d6) de dano radiante extra a um alvo ao acertar. Este benefício dura até o final do turno. Se o sacerdote gastar um espaço de magia de 2º nível ou superior, o dano extra aumenta em 1d6 para cada nível acima do 1º.",
          "name": "Eminência Divina"
        },
        {
          "description": "O sacerdote é um conjurador de 5º nível. Sua habilidade de lançar feitiços é Sabedoria (resistência de feitiço CD 13, +5 para acertar com ataques de feitiço). O sacerdote preparou os seguintes feitiços de clérigo:\n\n* Truques (à vontade): luz, chama sagrada, taumaturgia\n* 1º nível (4 espaços): curar ferimentos, parafuso guia, santuário\n* 2º nível (3 slots): restauração menor, arma espiritual\n* 3º nível (2 espaços): dissipar magia, guardiões espirituais",
          "name": "Feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:rhinoceros",
    "name": "Rinoceronte",
    "name_en": "Rhinoceros",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 11,
    "hp_max": 45,
    "hp_formula": "6d10+12",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 15,
        "dex": 8,
        "int": 2,
        "str": 21,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d8+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 14 (2d8 + 5) de dano de concussão.",
          "name": "Sangrento"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 11
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o rinoceronte se mover pelo menos 6 metros em linha reta em direção a um alvo e então acertá-lo com um ataque sangrento no mesmo turno, o alvo sofre 9 (2d8) de dano de concussão extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 15 ou será derrubado.",
          "name": "Cobrar"
        }
      ]
    }
  },
  {
    "id": "srd:rug-of-smothering",
    "name": "Tapete de Sufocamento",
    "name_en": "Rug of Smothering",
    "size": "Grande",
    "size_en": "Large",
    "type": "Constructo",
    "type_en": "construct",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 33,
    "hp_formula": "6d10",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 10,
        "dex": 14,
        "int": 1,
        "str": 17,
        "wis": 3
      },
      "actions": [
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +5 para acertar, alcance 1,5 m, uma criatura Média ou menor. Acerto: A criatura é agarrada (CD 13 para escapar). Até que esta luta termine, o alvo fica contido, cego e corre o risco de sufocar, e o tapete não pode sufocar outro alvo. Além disso, no início de cada turno do alvo, o alvo sofre 10 (2d6 + 3) de dano de concussão.",
          "name": "Sufocar"
        }
      ],
      "condition_immunities": [
        "Cego",
        "Enfeitiçado",
        "Surdo",
        "Amedrontado",
        "Paralisado",
        "Petrificado",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno",
        "psíquico"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 6
      },
      "speed": {
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O tapete fica incapacitado enquanto estiver na área de um campo antimágico. Se for alvo de dissipar magia, o tapete deve ser bem sucedido em um teste de resistência de Constituição contra a CD de resistência do feitiço do conjurador ou ficará inconsciente por 1 minuto.",
          "name": "Suscetibilidade Antimágica"
        },
        {
          "description": "Enquanto estiver agarrando uma criatura, o tapete sofre apenas metade do dano causado a ele, e a criatura agarrada pelo tapete sofre a outra metade.",
          "name": "Transferência de danos"
        },
        {
          "description": "Enquanto o tapete permanece imóvel, é indistinguível de um tapete normal.",
          "name": "Aparência Falsa"
        }
      ]
    }
  },
  {
    "id": "srd:saber-toothed-tiger",
    "name": "Tigre Dente de Sabre",
    "name_en": "Saber-Toothed Tiger",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 52,
    "hp_formula": "7d10+14",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 15,
        "dex": 14,
        "int": 3,
        "str": 18,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d10+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (1d10 + 5) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+5",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 12 (2d6 + 5) de dano cortante.",
          "name": "Garra"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 6
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O tigre tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        },
        {
          "description": "Se o tigre se mover pelo menos 6 metros em linha reta em direção a uma criatura e então acertá-la com um ataque de garra no mesmo turno, o alvo deve ser bem sucedido em um teste de resistência de Força CD 14 ou será derrubado. Se o alvo estiver caído, o tigre pode realizar um ataque de mordida contra ele como uma ação bônus.",
          "name": "Atacar"
        }
      ]
    }
  },
  {
    "id": "srd:sea-hag",
    "name": "Bruxa do Mar",
    "name_en": "Sea Hag",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fada",
    "type_en": "fey",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 14,
    "hp_max": 52,
    "hp_formula": "7d8+21",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 13,
        "con": 16,
        "dex": 13,
        "int": 12,
        "str": 16,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano cortante.",
          "name": "Garras"
        },
        {
          "description": "A bruxa tem como alvo uma criatura assustada que ela possa ver a até 9 metros dela. Se o alvo puder ver a bruxa, ele deve ser bem sucedido em um teste de resistência de Sabedoria CD 11 contra esta magia ou cairá para 0 pontos de vida.",
          "name": "Brilho da Morte"
        },
        {
          "description": "A bruxa cobre a si mesma e a tudo o que ela está vestindo ou carregando com uma ilusão mágica que a faz parecer uma criatura feia de seu tamanho geral e forma humanóide. O efeito termina se a bruxa realizar uma ação bônus para encerrá-lo ou se ela morrer.\nAs mudanças provocadas por este efeito não resistem à inspeção física. Por exemplo, a bruxa pode parecer não ter garras, mas alguém que toque sua mão pode sentir as garras. Caso contrário, uma criatura deve realizar uma ação para inspecionar visualmente a ilusão e ter sucesso em um teste de Inteligência (Investigação) CD 16 para discernir que a bruxa está disfarçada.",
          "name": "Aparência Ilusória"
        }
      ],
      "languages": [
        "Aquan",
        "Comum",
        "Gigante"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 11
      },
      "speed": {
        "natação": 40,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A bruxa pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "Qualquer humanóide que comece seu turno a até 9 metros da bruxa e possa ver sua verdadeira forma deve realizar um teste de resistência de Sabedoria CD 11. Se falhar na resistência, a criatura fica assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, com desvantagem se a bruxa estiver dentro da linha de visão, encerrando o efeito sobre si mesma em caso de sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito dela terminar, a criatura ficará imune à Aparência Horrenda da bruxa pelas próximas 24 horas.\nA menos que o alvo seja surpreendido ou a revelação da verdadeira forma da bruxa seja repentina, o alvo pode desviar os olhos e evitar fazer o teste de resistência inicial. Até o início de seu próximo turno, uma criatura que desviar o olhar terá desvantagem nas jogadas de ataque contra a bruxa.",
          "name": "Aparência horrível"
        },
        {
          "description": "Quando as bruxas precisam trabalhar juntas, elas formam covens, apesar de sua natureza egoísta. Um coven é composto por bruxas de qualquer tipo, todas iguais dentro do grupo. No entanto, cada uma das bruxas continua a desejar mais poder pessoal.\nUm coven consiste em três bruxas para que qualquer discussão entre duas bruxas possa ser resolvida pela terceira. Se mais de três bruxas se unirem, como pode acontecer se dois covens entrarem em conflito, o resultado geralmente é o caos.",
          "name": "Bruxa Coven"
        },
        {
          "description": "Embora todos os três membros de um coven de bruxas estejam a até 9 metros um do outro, cada um deles pode lançar as seguintes magias da lista de magias do mago, mas devem compartilhar os espaços de magia entre si:\n\n* 1º nível (4 espaços): identificar, raio de doença\n* 2º nível (3 slots): segurar pessoa, localizar objeto\n* 3º nível (3 espaços): conceder maldição, contrafeitiço, raio\n* 4º nível (3 slots): assassino fantasma, polimorfo\n* 5º nível (2 espaços): contato com outro plano, vidência\n* 6º nível (1 slot): mordida no olho\n\nPara lançar essas magias, cada bruxa é uma conjuradora de 12º nível que usa Inteligência como sua habilidade de lançar magias. A CD de resistência do feitiço é 12 + o modificador de Inteligência da bruxa, e o bônus de ataque do feitiço é 4 + o modificador de Inteligência da bruxa.",
          "name": "Conjuração Compartilhada (Somente Coven)"
        },
        {
          "description": "Um clã de bruxas pode criar um item mágico chamado olho de bruxa, que é feito de um olho real coberto com verniz e geralmente colocado em um pingente ou outro item vestível. O olho de bruxa geralmente é confiado a um lacaio para guarda e transporte. Uma bruxa no coven pode realizar uma ação para ver o que o olho da bruxa vê se o olho da bruxa estiver no mesmo plano de existência. Um olho de bruxa tem CA 10, 1 ponto de vida e visão no escuro com um raio de 18 metros. Se for destruído, cada membro do coven sofre 3d10 de dano psíquico e fica cego por 24 horas.\nUm clã de bruxas pode ter apenas um olho de bruxa por vez, e a criação de um novo exige que todos os três membros do clã realizem um ritual. O ritual leva 1 hora e as bruxas não podem realizá-lo enquanto estiverem cegas. Durante o ritual, se as bruxas realizarem qualquer ação além de realizar o ritual, elas deverão recomeçar.",
          "name": "Olho de Bruxa (apenas Coven)"
        }
      ]
    }
  },
  {
    "id": "srd:silver-dragon-wyrmling",
    "name": "Dragão de Prata Wyrmling",
    "name_en": "Silver Dragon Wyrmling",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 17,
    "hp_max": 45,
    "hp_formula": "6d8+18",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 17,
        "dex": 10,
        "int": 12,
        "str": 19,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d10+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (1d10 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "4d8+0",
              "type": "cold"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Respiração Fria.** O dragão exala uma explosão gelada em um cone de 4,5 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 13, sofrendo 18 (4d8) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração Paralisante.** O dragão exala gás paralisante em um cone de 4,5 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 13 ou ficará paralisada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "frio"
      ],
      "languages": [
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 4,
        "con": 5,
        "dex": 2,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 2
      },
      "speed": {
        "voo": 60,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:swarm-of-poisonous-snakes",
    "name": "Enxame de cobras venenosas",
    "name_en": "Swarm of Poisonous Snakes",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fera",
    "type_en": "beast",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 14,
    "hp_max": 36,
    "hp_formula": "8d8",
    "initiative_modifier": 4,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 11,
        "dex": 18,
        "int": 1,
        "str": 8,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +6 para acertar, alcance 0 pés, uma criatura no espaço do enxame. Acerto: 7 (2d6) de dano perfurante, ou 3 (1d6) de dano perfurante se o enxame tiver metade de seus pontos de vida ou menos. O alvo deve fazer um teste de resistência de Constituição CD 10, sofrendo 14 (4d6) de dano de veneno se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Mordidas"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Caído",
        "Impedido",
        "Atordoado"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "cortante"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "percepção passiva": 10
      },
      "speed": {
        "natação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O enxame pode ocupar o espaço de outra criatura e vice-versa, e o enxame pode se mover através de qualquer abertura grande o suficiente para uma Cobra Minúscula. O enxame não pode recuperar pontos de vida nem ganhar pontos de vida temporários.",
          "name": "Enxame"
        }
      ]
    }
  },
  {
    "id": "srd:wererat",
    "name": "Homem-rato",
    "name_en": "Wererat",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 12,
    "hp_max": 33,
    "hp_formula": "6d8+6",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 12,
        "dex": 15,
        "int": 11,
        "str": 10,
        "wis": 10
      },
      "actions": [
        {
          "description": "O homem-rato faz dois ataques, dos quais apenas um pode ser uma mordida.",
          "name": "Multiataque (somente forma humanóide ou híbrida)"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 4 (1d4 + 2) de dano perfurante. Se o alvo for um humanóide, ele deve ser bem sucedido em um teste de resistência de Constituição CD 11 ou será amaldiçoado com licantropia de homem-rato.",
          "name": "Mordida (apenas rato ou forma híbrida)."
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Espada curta (somente forma humanóide ou híbrida)"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 30/120 pés, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Besta de mão (somente forma humanóide ou híbrida)"
        }
      ],
      "damage_immunities": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Common (can't speak in rat form)"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2,
        "Furtividade": 4
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O homem-rato pode usar sua ação para se transformar em um híbrido rato-humanóide ou em um rato gigante, ou voltar à sua forma verdadeira, que é humanóide. Suas estatísticas, além do tamanho, são as mesmas em cada formulário. Qualquer equipamento que esteja vestindo ou carregando não é transformado. Ele reverte à sua verdadeira forma se morrer.",
          "name": "Metamorfo"
        },
        {
          "description": "O homem-rato tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        }
      ]
    }
  },
  {
    "id": "srd:white-dragon-wyrmling",
    "name": "Dragão Branco Wyrmling",
    "name_en": "White Dragon Wyrmling",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 16,
    "hp_max": 32,
    "hp_formula": "5d8+10",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 14,
        "dex": 10,
        "int": 5,
        "str": 14,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d10+1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d10 + 2) de dano perfurante mais 2 (1d4) de dano de frio.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "5d8+0",
              "type": "cold"
            }
          ],
          "description": "O dragão exala uma rajada gelada de granizo em um cone de 4,5 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 12, sofrendo 22 (5d8) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Frio (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "frio"
      ],
      "languages": [
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 2,
        "con": 4,
        "dex": 2,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 2
      },
      "speed": {
        "escavação": 15,
        "voo": 60,
        "natação": 30,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:will-o-wisp",
    "name": "Will-o'-Wisp",
    "name_en": "Will-o'-Wisp",
    "size": "Miúdo",
    "size_en": "Tiny",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "2",
    "cr_numeric": 2.0,
    "armor_class": 19,
    "hp_max": 22,
    "hp_formula": "9d4",
    "initiative_modifier": 9,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 10,
        "dex": 28,
        "int": 13,
        "str": 1,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d8+0",
              "type": "lightning"
            }
          ],
          "description": "Ataque Mágico Corpo a Corpo: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 9 (2d8) de dano elétrico.",
          "name": "Choque"
        },
        {
          "description": "O fogo-fátuo e sua luz tornam-se magicamente invisíveis até que ele ataque ou use seu Consumir Vida, ou até que sua concentração termine (como se estivesse se concentrando em um feitiço).",
          "name": "Invisibilidade"
        }
      ],
      "condition_immunities": [
        "Exausto",
        "Agarrado",
        "Paralisado",
        "Envenenado",
        "Caído",
        "Impedido",
        "Inconsciente"
      ],
      "damage_immunities": [
        "elétrico",
        "veneno"
      ],
      "damage_resistances": [
        "ácido",
        "frio",
        "fogo",
        "necrótico",
        "thunder; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "the languages it knew in life"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 12
      },
      "speed": {
        "voo": 50,
        "pairar": true
      },
      "traits": [
        {
          "description": "Como uma ação bônus, o fogo-fátuo pode ter como alvo uma criatura que ele possa ver a até 1,5 metro dele que tenha 0 pontos de vida e ainda esteja viva. O alvo deve ser bem sucedido em um teste de resistência de Constituição CD 10 contra esta magia ou morrerá. Se o alvo morrer, o fogo-fátuo recupera 10 (3d6) pontos de vida.",
          "name": "Consumir Vida"
        },
        {
          "description": "O fogo-fátuo não pode usar ou carregar nada.",
          "name": "Efêmero"
        },
        {
          "description": "O fogo-fátuo pode se mover através de outras criaturas e objetos como se fossem um terreno difícil. Ele sofre 5 (1d10) de dano de força se terminar seu turno dentro de um objeto.",
          "name": "Movimento Incorpóreo"
        },
        {
          "description": "O fogo-fátuo emite luz brilhante em um raio de 1,5 a 6 metros e luz fraca por um número adicional de metros igual ao raio escolhido. O fogo-fátuo pode alterar o raio como uma ação bônus.",
          "name": "Iluminação Variável"
        }
      ]
    }
  },
  {
    "id": "srd:basilisk",
    "name": "Basilisco",
    "name_en": "Basilisk",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 12,
    "hp_max": 52,
    "hp_formula": "8d8+16",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 15,
        "dex": 8,
        "int": 2,
        "str": 16,
        "wis": 8
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+2d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano perfurante mais 7 (2d6) de dano venenoso.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 9
      },
      "speed": {
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "Se uma criatura começar seu turno a até 9 metros do basilisco e os dois puderem se ver, o basilisco pode forçar a criatura a fazer um teste de resistência de Constituição CD 12 se o basilisco não estiver incapacitado. Se falhar na resistência, a criatura magicamente começa a se transformar em pedra e é contida. Ele deve repetir o teste de resistência no final do próximo turno. Com um sucesso, o efeito termina. Em caso de falha, a criatura fica petrificada até ser libertada pelo feitiço de restauração maior ou outra magia.\nUma criatura que não esteja surpresa pode desviar os olhos para evitar o teste de resistência no início do seu turno. Se fizer isso, ele não poderá ver o basilisco até o início do próximo turno, quando poderá desviar os olhos novamente. Se entretanto olhar para o basilisco, deverá fazer o salvamento imediatamente.\nSe o basilisco vir seu reflexo a até 9 metros dele sob luz brilhante, ele se confundirá com um rival e mirará em si mesmo com seu olhar.",
          "name": "Olhar Petrificante"
        }
      ]
    }
  },
  {
    "id": "srd:bearded-devil",
    "name": "Diabo Barbudo",
    "name_en": "Bearded Devil",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 13,
    "hp_max": 52,
    "hp_formula": "8d8+16",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 15,
        "dex": 15,
        "int": 9,
        "str": 16,
        "wis": 11
      },
      "actions": [
        {
          "description": "O diabo faz dois ataques: um com a barba e outro com a glaive.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, uma criatura. Acerto: 6 (1d8 + 2) de dano perfurante, e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 12 ou será envenenado por 1 minuto. Enquanto estiver envenenado desta forma, o alvo não poderá recuperar pontos de vida. O alvo pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso.",
          "name": "Barba"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d10+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 3 metros, um alvo. Acerto: 8 (1d10 + 3) de dano cortante. Se o alvo for uma criatura que não seja um morto-vivo ou um constructo, ele deve ser bem sucedido em um teste de resistência de Constituição CD 12 ou perderá 5 (1d10) pontos de vida no início de cada um de seus turnos devido a um ferimento infernal. Cada vez que o diabo atinge o alvo ferido com este ataque, o dano causado pelo ferimento aumenta em 5 (1d10). Qualquer criatura pode realizar uma ação para estancar o ferimento com um teste bem-sucedido de Sabedoria (Medicina) CD 12. A ferida também fecha se o alvo receber cura mágica.",
          "name": "Gládio"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "cold; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Infernal",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "con": 4,
        "str": 5,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A escuridão mágica não impede a visão no escuro do diabo.",
          "name": "Visão do Diabo"
        },
        {
          "description": "O diabo tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "O diabo não pode ficar assustado enquanto puder ver uma criatura aliada a até 9 metros dele.",
          "name": "Firme"
        }
      ]
    }
  },
  {
    "id": "srd:blue-dragon-wyrmling",
    "name": "Dragonete Azul",
    "name_en": "Blue Dragon Wyrmling",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 17,
    "hp_max": 52,
    "hp_formula": "8d8+16",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 15,
        "dex": 10,
        "int": 12,
        "str": 17,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d10+1d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (1d10 + 3) de dano perfurante mais 3 (1d6) de dano elétrico.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "4d10+0",
              "type": "lightning"
            }
          ],
          "description": "O dragão exala relâmpagos em uma linha de 9 metros e 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 12, sofrendo 22 (4d10) de dano elétrico se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro Relâmpago (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "elétrico"
      ],
      "languages": [
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 4,
        "con": 4,
        "dex": 2,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 2
      },
      "speed": {
        "escavação": 15,
        "voo": 60,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:doppelganger",
    "name": "Sósia",
    "name_en": "Doppelganger",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 14,
    "hp_max": 52,
    "hp_formula": "8d8+16",
    "initiative_modifier": 4,
    "stat_block_json": {
      "ability_scores": {
        "cha": 14,
        "con": 14,
        "dex": 18,
        "int": 11,
        "str": 11,
        "wis": 12
      },
      "actions": [
        {
          "description": "O doppelganger faz dois ataques corpo a corpo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d6 + 4) de dano de concussão.",
          "name": "Bater"
        },
        {
          "description": "O doppelganger lê magicamente os pensamentos superficiais de uma criatura a até 18 metros dele. O efeito pode penetrar barreiras, mas 90 centímetros de madeira ou terra, 60 centímetros de pedra, 5 centímetros de metal ou uma fina folha de chumbo o bloqueiam. Enquanto o alvo estiver ao alcance, o doppelganger pode continuar lendo seus pensamentos, desde que a concentração do doppelganger não seja quebrada (como se estivesse se concentrando em um feitiço). Enquanto lê a mente do alvo, o doppelganger tem vantagem em testes de Sabedoria (Intuição) e Carisma (Enganação, Intimidação e Persuasão) contra o alvo.",
          "name": "Leia pensamentos"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado"
      ],
      "languages": [
        "Comum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 11
      },
      "skills": {
        "Enganação": 6,
        "Intuição": 3
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O doppelganger pode usar sua ação para se transformar em um humanóide Pequeno ou Médio que viu, ou voltar à sua forma verdadeira. Suas estatísticas, além do tamanho, são as mesmas em cada formulário. Qualquer equipamento que esteja vestindo ou carregando não é transformado. Ele reverte à sua verdadeira forma se morrer.",
          "name": "Metamorfo"
        },
        {
          "description": "O doppelganger tem vantagem nas jogadas de ataque contra qualquer criatura que tenha surpreendido.",
          "name": "Emboscador"
        },
        {
          "description": "Se o doppelganger surpreender uma criatura e acertá-la com um ataque durante a primeira rodada de combate, o alvo sofre 10 (3d6) de dano extra pelo ataque.",
          "name": "Ataque surpresa"
        }
      ]
    }
  },
  {
    "id": "srd:giant-scorpion",
    "name": "Escorpião Gigante",
    "name_en": "Giant Scorpion",
    "size": "Grande",
    "size_en": "Large",
    "type": "Fera",
    "type_en": "beast",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 15,
    "hp_max": 52,
    "hp_formula": "7d10+14",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 15,
        "dex": 13,
        "int": 1,
        "str": 15,
        "wis": 9
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d8 + 2) de dano de concussão e o alvo é agarrado (CD de fuga 12). O escorpião tem duas garras, cada uma das quais pode agarrar apenas um alvo.",
          "name": "Garra"
        },
        {
          "description": "O escorpião faz três ataques: dois com as garras e um com o ferrão.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d10+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 7 (1d10 + 2) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 12, sofrendo 22 (4d10) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso.",
          "name": "Picada"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 9
      },
      "speed": {
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:gold-dragon-wyrmling",
    "name": "Dragonete Dourado",
    "name_en": "Gold Dragon Wyrmling",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 17,
    "hp_max": 60,
    "hp_formula": "8d8+24",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 17,
        "dex": 14,
        "int": 14,
        "str": 19,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d10+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (1d10 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "4d10+0",
              "type": "fire"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro de Fogo.** O dragão exala fogo em um cone de 4,5 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 13, sofrendo 22 (4d10) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração Enfraquecedora.** O dragão exala gás em um cone de 4,5 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Força CD 13 ou terá desvantagem em jogadas de ataque baseadas em Força, testes de Força e testes de resistência de Força por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 5,
        "con": 5,
        "dex": 4,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 4
      },
      "speed": {
        "voo": 60,
        "natação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:green-hag",
    "name": "Bruxa Verde",
    "name_en": "Green Hag",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Fada",
    "type_en": "fey",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 17,
    "hp_max": 82,
    "hp_formula": "11d8+33",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 14,
        "con": 16,
        "dex": 12,
        "int": 13,
        "str": 18,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano cortante.",
          "name": "Garras"
        },
        {
          "description": "A bruxa cobre a si mesma e a tudo o que ela está vestindo ou carregando com uma ilusão mágica que a faz parecer outra criatura de seu tamanho geral e forma humanóide. A ilusão termina se a bruxa realizar uma ação bônus para acabar com ela ou se ela morrer.\nAs mudanças provocadas por este efeito não resistem à inspeção física. Por exemplo, a bruxa poderia parecer ter pele lisa, mas alguém que a tocasse sentiria sua carne áspera. Caso contrário, uma criatura deve realizar uma ação para inspecionar visualmente a ilusão e ter sucesso em um teste de Inteligência (Investigação) CD 20 para discernir que a bruxa está disfarçada.",
          "name": "Aparência Ilusória"
        },
        {
          "description": "A bruxa fica invisível magicamente até atacar ou lançar um feitiço, ou até que sua concentração termine (como se estivesse se concentrando em um feitiço). Embora invisível, ela não deixa nenhuma evidência física de sua passagem, então ela só pode ser rastreada por magia. Qualquer equipamento que ela use ou carregue fica invisível para ela.",
          "name": "Passagem Invisível"
        }
      ],
      "languages": [
        "Comum",
        "Dracônico",
        "Silvestre"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Arcanismo": 3,
        "Enganação": 4,
        "Percepção": 4,
        "Furtividade": 3
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A bruxa pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "A habilidade inata de conjuração da bruxa é Carisma (resistência ao feitiço CD 12). Ela pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\n\nÀ vontade: luzes dançantes, pequenas ilusões, zombaria cruel",
          "name": "Feitiço Inato"
        },
        {
          "description": "A bruxa pode imitar sons de animais e vozes humanóides. Uma criatura que ouve os sons pode dizer que são imitações com um teste bem sucedido de Sabedoria (Intuição) CD 14.",
          "name": "Mimetismo"
        },
        {
          "description": "Quando as bruxas precisam trabalhar juntas, elas formam covens, apesar de sua natureza egoísta. Um coven é composto por bruxas de qualquer tipo, todas iguais dentro do grupo. No entanto, cada uma das bruxas continua a desejar mais poder pessoal.\nUm coven consiste em três bruxas para que qualquer discussão entre duas bruxas possa ser resolvida pela terceira. Se mais de três bruxas se unirem, como pode acontecer se dois covens entrarem em conflito, o resultado geralmente é o caos.",
          "name": "Bruxa Coven"
        },
        {
          "description": "Embora todos os três membros de um coven de bruxas estejam a até 9 metros um do outro, cada um deles pode lançar as seguintes magias da lista de magias do mago, mas devem compartilhar os espaços de magia entre si:\n\n* 1º nível (4 espaços): identificar, raio de doença\n* 2º nível (3 slots): segurar pessoa, localizar objeto\n* 3º nível (3 espaços): conceder maldição, contrafeitiço, raio\n* 4º nível (3 slots): assassino fantasma, polimorfo\n* 5º nível (2 espaços): contato com outro plano, vidência\n* 6º nível (1 slot): mordida no olho\n\nPara lançar essas magias, cada bruxa é uma conjuradora de 12º nível que usa Inteligência como sua habilidade de lançar magias. A CD de resistência do feitiço é 12 + o modificador de Inteligência da bruxa, e o bônus de ataque do feitiço é 4 + o modificador de Inteligência da bruxa.",
          "name": "Conjuração Compartilhada (Somente Coven)"
        },
        {
          "description": "Um clã de bruxas pode criar um item mágico chamado olho de bruxa, que é feito de um olho real coberto com verniz e geralmente colocado em um pingente ou outro item vestível. O olho de bruxa geralmente é confiado a um lacaio para guarda e transporte. Uma bruxa no coven pode realizar uma ação para ver o que o olho da bruxa vê se o olho da bruxa estiver no mesmo plano de existência. Um olho de bruxa tem CA 10, 1 ponto de vida e visão no escuro com um raio de 18 metros. Se for destruído, cada membro do coven sofre 3d10 de dano psíquico e fica cego por 24 horas.\nUm clã de bruxas pode ter apenas um olho de bruxa por vez, e a criação de um novo exige que todos os três membros do clã realizem um ritual. O ritual leva 1 hora e as bruxas não podem realizá-lo enquanto estiverem cegas. Durante o ritual, se as bruxas realizarem qualquer ação além de realizar o ritual, elas deverão recomeçar.",
          "name": "Olho de Bruxa (apenas Coven)"
        }
      ]
    }
  },
  {
    "id": "srd:hell-hound",
    "name": "Cão do Inferno",
    "name_en": "Hell Hound",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 15,
    "hp_max": 45,
    "hp_formula": "7d8+14",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 14,
        "dex": 12,
        "int": 6,
        "str": 17,
        "wis": 13
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d8 + 3) de dano perfurante mais 7 (2d6) de dano de fogo.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "6d6+0",
              "type": "fire"
            }
          ],
          "description": "O cão exala fogo em um cone de 4,5 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 12, sofrendo 21 (6d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro de Fogo (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "understands Infernal but can't speak it"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 15
      },
      "skills": {
        "Percepção": 5
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "O cão tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        },
        {
          "description": "O cão de caça tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do cão de caça estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        }
      ]
    }
  },
  {
    "id": "srd:killer-whale",
    "name": "Orca",
    "name_en": "Killer Whale",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Fera",
    "type_en": "beast",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 12,
    "hp_max": 90,
    "hp_formula": "12d12+12",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 13,
        "dex": 10,
        "int": 3,
        "str": 19,
        "wis": 12
      },
      "actions": [
        {
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 21 (5d6 + 4) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 120,
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "natação": 60
      },
      "traits": [
        {
          "description": "A baleia não pode usar a visão cega enquanto estiver surda.",
          "name": "Ecolocalização"
        },
        {
          "description": "A baleia consegue prender a respiração por 30 minutos",
          "name": "Prenda a respiração"
        },
        {
          "description": "A baleia tem vantagem em testes de Sabedoria (Percepção) que dependem da audição.",
          "name": "Audição Aguçada"
        }
      ]
    }
  },
  {
    "id": "srd:knight",
    "name": "Cavaleiro",
    "name_en": "Knight",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 18,
    "hp_max": 52,
    "hp_formula": "8d8+16",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 14,
        "dex": 11,
        "int": 11,
        "str": 16,
        "wis": 11
      },
      "actions": [
        {
          "description": "O cavaleiro faz dois ataques corpo a corpo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano cortante.",
          "name": "Espada larga"
        },
        {
          "attack_bonus": 2,
          "damage": [
            {
              "dice": "1d10+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +2 para acertar, alcance 100/400 pés, um alvo. Acerto: 5 (1d10) de dano perfurante.",
          "name": "Besta Pesada"
        },
        {
          "description": "Por 1 minuto, o cavaleiro pode proferir um comando especial ou aviso sempre que uma criatura não hostil que ele possa ver a até 9 metros dele fizer uma jogada de ataque ou teste de resistência. A criatura pode adicionar um d4 ao seu teste, desde que possa ouvir e compreender o cavaleiro. Uma criatura só pode se beneficiar de um dado de Liderança por vez. Este efeito termina se o cavaleiro estiver incapacitado.",
          "name": "Liderança (recarrega após um descanso curto ou longo)"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "reactions": [
        {
          "description": "O cavaleiro adiciona 2 à sua CA contra um ataque corpo a corpo que o acerte. Para fazer isso, o cavaleiro deve ver o atacante e estar empunhando uma arma branca.",
          "name": "Desviar"
        }
      ],
      "saving_throws": {
        "con": 4,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O cavaleiro tem vantagem nos testes de resistência contra ficar assustado.",
          "name": "Corajoso"
        }
      ]
    }
  },
  {
    "id": "srd:manticore",
    "name": "Manticora",
    "name_en": "Manticore",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 14,
    "hp_max": 68,
    "hp_formula": "8d10+24",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 17,
        "dex": 16,
        "int": 7,
        "str": 17,
        "wis": 12
      },
      "actions": [
        {
          "description": "A manticora faz três ataques: um com a mordida e dois com as garras ou três com as pontas da cauda.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d8 + 3) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +5 para acertar, alcance 30/60 metros, um alvo. Acerto: 7 (1d8 + 3) de dano perfurante.",
          "name": "Ponta da cauda"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 11
      },
      "speed": {
        "voo": 50,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A manticora tem vinte e quatro pontas na cauda. Os espinhos usados ​​voltam a crescer quando a manticora termina um descanso longo.",
          "name": "Crescimento da ponta da cauda"
        }
      ]
    }
  },
  {
    "id": "srd:minotaur",
    "name": "Minotauro",
    "name_en": "Minotaur",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 14,
    "hp_max": 76,
    "hp_formula": "9d10+27",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 9,
        "con": 16,
        "dex": 11,
        "int": 6,
        "str": 18,
        "wis": 16
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d12+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 17 (2d12 + 4) de dano cortante.",
          "name": "Machado Grande"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano perfurante.",
          "name": "Sangrento"
        }
      ],
      "languages": [
        "Abissal"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 17
      },
      "skills": {
        "Percepção": 7
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o minotauro se mover pelo menos 3 metros em linha reta em direção a um alvo e então acertá-lo com um ataque sangrento no mesmo turno, o alvo sofre 9 (2d8) de dano perfurante extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 14 ou será empurrado até 3 metros de distância e derrubado.",
          "name": "Cobrar"
        },
        {
          "description": "O minotauro pode recordar perfeitamente qualquer caminho que tenha percorrido.",
          "name": "Recordação Labiríntica"
        },
        {
          "description": "No início de seu turno, o minotauro pode ganhar vantagem em todas as jogadas de ataque com arma corpo a corpo que fizer durante aquele turno, mas as jogadas de ataque contra ele têm vantagem até o início de seu próximo turno.",
          "name": "Irresponsável"
        }
      ]
    }
  },
  {
    "id": "srd:mummy",
    "name": "Múmia",
    "name_en": "Mummy",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 11,
    "hp_max": 58,
    "hp_formula": "9d8+18",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 15,
        "dex": 8,
        "int": 6,
        "str": 16,
        "wis": 10
      },
      "actions": [
        {
          "description": "A múmia pode usar seu brilho terrível e fazer um ataque com seu punho podre.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano de concussão mais 10 (3d6) de dano necrótico. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Constituição CD 12 ou será amaldiçoado com podridão de múmia. O alvo amaldiçoado não pode recuperar pontos de vida e seu máximo de pontos de vida diminui em 10 (3d6) a cada 24 horas decorridas. Se a maldição reduzir o máximo de pontos de vida do alvo a 0, o alvo morre e seu corpo vira pó. A maldição dura até ser removida pelo feitiço remover maldição ou outra magia.",
          "name": "Punho Apodrecido"
        },
        {
          "description": "A múmia tem como alvo uma criatura que ela possa ver a até 18 metros dela. Se o alvo puder ver a múmia, ele deverá ser bem sucedido em um teste de resistência de Sabedoria CD 11 contra esta magia ou ficará assustado até o final do próximo turno da múmia. Se o alvo falhar no teste de resistência por 5 ou mais, ele também ficará paralisado pela mesma duração. Um alvo que obtiver sucesso no teste de resistência fica imune ao Brilho Terrível de todas as múmias (mas não dos senhores das múmias) pelas próximas 24 horas.",
          "name": "Brilho Terrível"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado",
        "Paralisado",
        "Envenenado"
      ],
      "damage_immunities": [
        "necrótico",
        "veneno"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "damage_vulnerabilities": [
        "fogo"
      ],
      "languages": [
        "the languages it knew in life"
      ],
      "saving_throws": {
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 20
      }
    }
  },
  {
    "id": "srd:nightmare",
    "name": "Pesadelo",
    "name_en": "Nightmare",
    "size": "Grande",
    "size_en": "Large",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 13,
    "hp_max": 68,
    "hp_formula": "8d10+24",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 16,
        "dex": 15,
        "int": 10,
        "str": 18,
        "wis": 13
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d8+2d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano de concussão mais 7 (2d6) de dano de fogo.",
          "name": "Cascos"
        },
        {
          "description": "O pesadelo e até três criaturas voluntárias a até 1,5 metro dele entram magicamente no Plano Etéreo vindo do Plano Material, ou vice-versa.",
          "name": "Passo Etéreo"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "understands Abyssal",
        "Comum",
        "and Infernal but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 11
      },
      "speed": {
        "voo": 90,
        "deslocamento": 60
      },
      "traits": [
        {
          "description": "O pesadelo pode conceder resistência a danos de fogo a qualquer um que o pilote.",
          "name": "Conferir resistência ao fogo"
        },
        {
          "description": "O pesadelo emite luz brilhante em um raio de 3 metros e luz fraca por mais 3 metros adicionais.",
          "name": "Iluminação"
        }
      ]
    }
  },
  {
    "id": "srd:owlbear",
    "name": "Urso Coruja",
    "name_en": "Owlbear",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 13,
    "hp_max": 59,
    "hp_formula": "7d10+21",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 17,
        "dex": 12,
        "int": 3,
        "str": 20,
        "wis": 12
      },
      "actions": [
        {
          "description": "O urso-coruja faz dois ataques: um com o bico e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "1d10+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +7 para acertar, alcance 1,5 m, uma criatura. Acerto: 10 (1d10 + 5) de dano perfurante.",
          "name": "Bico"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d8+5",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Sucesso: 14 (2d8 + 5) de dano cortante.",
          "name": "Garras"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O urso-coruja tem vantagem em testes de Sabedoria (Percepção) que dependem da visão ou do olfato.",
          "name": "Visão e olfato aguçados"
        }
      ]
    }
  },
  {
    "id": "srd:phase-spider",
    "name": "Aranha Fase",
    "name_en": "Phase Spider",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 13,
    "hp_max": 32,
    "hp_formula": "5d10+5",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 12,
        "dex": 15,
        "int": 6,
        "str": 15,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d10+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 7 (1d10 + 2) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 11, sofrendo 18 (4d8) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso. Se o dano de veneno reduzir o alvo a 0 pontos de vida, o alvo fica estável, mas envenenado por 1 hora, mesmo após recuperar pontos de vida, e fica paralisado enquanto estiver envenenado desta forma.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "skills": {
        "Furtividade": 6
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Como uma ação bônus, a aranha pode mudar magicamente do Plano Material para o Plano Etéreo, ou vice-versa.",
          "name": "Passeio Etéreo"
        },
        {
          "description": "A aranha pode escalar superfícies difíceis, inclusive de cabeça para baixo em tetos, sem precisar fazer um teste de habilidade.",
          "name": "Escalada de aranha"
        },
        {
          "description": "A aranha ignora as restrições de movimento causadas pelas teias.",
          "name": "Caminhante da Web"
        }
      ]
    }
  },
  {
    "id": "srd:veteran",
    "name": "Veterano",
    "name_en": "Veteran",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 17,
    "hp_max": 58,
    "hp_formula": "9d8+18",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 14,
        "dex": 13,
        "int": 10,
        "str": 16,
        "wis": 11
      },
      "actions": [
        {
          "description": "O veterano faz dois ataques com espada longa. Se tiver uma espada curta empunhada, também pode fazer um ataque com espada curta.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d8 + 3) de dano cortante, ou 8 (1d10 + 3) de dano cortante se usado com as duas mãos.",
          "name": "Espada Longa"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano perfurante.",
          "name": "Espada curta"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d10+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +3 para acertar, alcance 100/400 pés, um alvo. Acerto: 6 (1d10 + 1) de dano perfurante.",
          "name": "Besta Pesada"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 12
      },
      "skills": {
        "Atletismo": 5,
        "Percepção": 2
      },
      "speed": {
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:werewolf",
    "name": "Lobisomem",
    "name_en": "Werewolf",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 11,
    "hp_max": 58,
    "hp_formula": "9d8+18",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 14,
        "dex": 13,
        "int": 10,
        "str": 15,
        "wis": 11
      },
      "actions": [
        {
          "description": "O lobisomem realiza dois ataques: dois com sua lança (forma humanóide) ou um com sua mordida e outro com suas garras (forma híbrida).",
          "name": "Multiataque (somente forma humanóide ou híbrida)"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d8 + 2) de dano perfurante. Se o alvo for um humanóide, ele deve ser bem sucedido em um teste de resistência de Constituição CD 12 ou será amaldiçoado com licantropia lobisomem.",
          "name": "Mordida (somente forma de lobo ou híbrida)"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "2d4+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 7 (2d4 + 2) de dano cortante.",
          "name": "Garras (somente forma híbrida)"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6-2",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo ou de longo alcance com arma: +4 para acertar, alcance 1,5 m ou alcance 6/18 m, uma criatura. Acerto: 5 (1d6 + 2) de dano perfurante, ou 6 (1d8 + 2) de dano perfurante se usado com as duas mãos para fazer um ataque corpo a corpo.",
          "name": "Lança (somente forma humanóide)"
        }
      ],
      "damage_immunities": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Common (can't speak in wolf form)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O lobisomem pode usar sua ação para se transformar em um híbrido lobo-humanóide ou em um lobo, ou voltar à sua forma verdadeira, que é humanóide. Suas estatísticas, exceto seu AC, são as mesmas em cada formulário. Qualquer equipamento que esteja vestindo ou carregando não é transformado. Ele reverte à sua verdadeira forma se morrer.",
          "name": "Metamorfo"
        },
        {
          "description": "O lobisomem tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        }
      ]
    }
  },
  {
    "id": "srd:wight",
    "name": "Pessoa",
    "name_en": "Wight",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 14,
    "hp_max": 45,
    "hp_formula": "6d8+18",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 16,
        "dex": 14,
        "int": 10,
        "str": 15,
        "wis": 13
      },
      "actions": [
        {
          "description": "A criatura faz dois ataques com espada longa ou dois ataques com arco longo. Ele pode usar seu Life Drain no lugar de um ataque de espada longa.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "necrotic"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, uma criatura. Acerto: 5 (1d6 + 2) de dano necrótico. O alvo deve ser bem sucedido em um teste de resistência de Constituição CD 13 ou seu máximo de pontos de vida será reduzido em uma quantidade igual ao dano sofrido. Esta redução dura até o alvo terminar um descanso longo. O alvo morre se este efeito reduzir seu máximo de pontos de vida a 0.\nUm humanóide morto por este ataque ressuscita 24 horas depois como um zumbi sob o controle da criatura, a menos que o humanóide seja restaurado à vida ou seu corpo seja destruído. A criatura não pode ter mais do que doze zumbis sob seu controle ao mesmo tempo.",
          "name": "Dreno de Vida"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +4 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d8 + 2) de dano cortante ou 7 (1d10 + 2) de dano cortante se usado com as duas mãos.",
          "name": "Espada Longa"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 150/600 pés, um alvo. Acerto: 6 (1d8 + 2) de dano perfurante.",
          "name": "Arco longo"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "necrotic; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "the languages it knew in life"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 4
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Enquanto estiver sob a luz do sol, a criatura tem desvantagem nas jogadas de ataque, bem como nos testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Sensibilidade à luz solar"
        }
      ]
    }
  },
  {
    "id": "srd:winter-wolf",
    "name": "Lobo de inverno",
    "name_en": "Winter Wolf",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "3",
    "cr_numeric": 3.0,
    "armor_class": 13,
    "hp_max": 75,
    "hp_formula": "10d10+20",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 14,
        "dex": 13,
        "int": 7,
        "str": 18,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 14 ou será derrubado.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "4d8+0",
              "type": "cold"
            }
          ],
          "description": "O lobo exala uma rajada de vento gelado em um cone de 4,5 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 12, sofrendo 18 (4d8) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Frio (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "frio"
      ],
      "languages": [
        "Comum",
        "Gigante",
        "Winter Wolf"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 15
      },
      "skills": {
        "Percepção": 5,
        "Furtividade": 3
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "O lobo tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        },
        {
          "description": "O lobo tem vantagem em uma jogada de ataque contra uma criatura se pelo menos um dos aliados do lobo estiver a até 1,5 metro da criatura e o aliado não estiver incapacitado.",
          "name": "Táticas de matilha"
        },
        {
          "description": "O lobo tem vantagem em testes de Destreza (Furtividade) feitos para se esconder em terreno nevado.",
          "name": "Camuflagem de neve"
        }
      ]
    }
  },
  {
    "id": "srd:black-pudding",
    "name": "Morcela",
    "name_en": "Black Pudding",
    "size": "Grande",
    "size_en": "Large",
    "type": "Gosma",
    "type_en": "ooze",
    "cr": "4",
    "cr_numeric": 4.0,
    "armor_class": 7,
    "hp_max": 85,
    "hp_formula": "10d10+30",
    "initiative_modifier": -3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 16,
        "dex": 5,
        "int": 1,
        "str": 16,
        "wis": 6
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+4d8+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano de concussão mais 18 (4d8) de dano de ácido. Além disso, a armadura não-mágica usada pelo alvo é parcialmente dissolvida e sofre uma penalidade permanente e cumulativa de -1 na CA que oferece. A armadura é destruída se a penalidade reduzir sua CA para 10.",
          "name": "Pseudópode"
        }
      ],
      "condition_immunities": [
        "Cego",
        "Enfeitiçado",
        "Surdo",
        "Exausto",
        "Amedrontado",
        "Caído"
      ],
      "damage_immunities": [
        "ácido",
        "frio",
        "elétrico",
        "cortante"
      ],
      "reactions": [
        {
          "description": "Quando um pudim Médio ou maior é sujeito a dano elétrico ou cortante, ele se divide em dois novos pudins se tiver pelo menos 10 pontos de vida. Cada novo pudim tem pontos de vida iguais à metade do pudim original, arredondado para baixo. Os pudins novos são um tamanho menor que o pudim original.",
          "name": "Dividir"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 8
      },
      "speed": {
        "escalada": 20,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O pudim pode se mover por um espaço estreito de até 2,5 cm de largura sem apertar.",
          "name": "Amorfo"
        },
        {
          "description": "Uma criatura que tocar o pudim ou acertá-lo com um ataque corpo a corpo enquanto estiver a 1,5 metro dele sofre 4 (1d8) de dano de ácido. Qualquer arma não-mágica feita de metal ou madeira que atinja o pudim sofre corrosão. Depois de causar dano, a arma sofre uma penalidade permanente e cumulativa de -1 nas jogadas de dano. Se a penalidade cair para -5, a arma é destruída. Munições não mágicas feitas de metal ou madeira que atingem o pudim são destruídas após causar dano. O pudim pode comer madeira ou metal não mágico de 5 cm de espessura em uma rodada.",
          "name": "Forma Corrosiva"
        },
        {
          "description": "O pudim pode escalar superfícies difíceis, inclusive de cabeça para baixo em tetos, sem a necessidade de um teste de habilidade.",
          "name": "Escalada de aranha"
        }
      ]
    }
  },
  {
    "id": "srd:chuul",
    "name": "Chuul",
    "name_en": "Chuul",
    "size": "Grande",
    "size_en": "Large",
    "type": "Aberração",
    "type_en": "aberration",
    "cr": "4",
    "cr_numeric": 4.0,
    "armor_class": 16,
    "hp_max": 93,
    "hp_formula": "11d10+33",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 16,
        "dex": 10,
        "int": 5,
        "str": 19,
        "wis": 11
      },
      "actions": [
        {
          "description": "O chuul faz dois ataques de pinça. Se o chuul estiver agarrando uma criatura, ele também poderá usar seus tentáculos uma vez.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 metros, um alvo. Acerto: 11 (2d6 + 4) de dano de concussão. O alvo é agarrado (CD 14 para escapar) se for uma criatura Grande ou menor e o chuul não tiver outras duas criaturas agarradas.",
          "name": "Pinça"
        },
        {
          "description": "Uma criatura agarrada pelo chuul deve ser bem sucedida em um teste de resistência de Constituição CD 13 ou será envenenada por 1 minuto. Até que este veneno acabe, o alvo fica paralisado. O alvo pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso.",
          "name": "Tentáculos"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "understands Deep Speech but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "natação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O chuul pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "O chuul sente magia a até 36 metros dele à vontade. Essa característica funciona como a magia detectar magia, mas não é mágica em si.",
          "name": "Sentir Magia"
        }
      ]
    }
  },
  {
    "id": "srd:couatl",
    "name": "Couatl",
    "name_en": "Couatl",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Celestial",
    "type_en": "celestial",
    "cr": "4",
    "cr_numeric": 4.0,
    "armor_class": 19,
    "hp_max": 97,
    "hp_formula": "13d8+39",
    "initiative_modifier": 5,
    "stat_block_json": {
      "ability_scores": {
        "cha": 18,
        "con": 17,
        "dex": 20,
        "int": 18,
        "str": 16,
        "wis": 20
      },
      "actions": [
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "1d6+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +8 para acertar, alcance 1,5 m, uma criatura. Acerto: 8 (1d6 + 5) de dano perfurante, e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 13 ou será envenenado por 24 horas. Até que este veneno acabe, o alvo fica inconsciente. Outra criatura pode usar uma ação para despertar o alvo.",
          "name": "Morder"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +6 para acertar, alcance 3 metros, uma criatura Média ou menor. Acerto: 10 (2d6 + 3) de dano de concussão e o alvo é agarrado (CD de fuga 15). Até que este agarrão termine, o alvo estará contido e o couatl não poderá constringir outro alvo.",
          "name": "Contrair"
        },
        {
          "description": "O couatl se transforma magicamente em um humanóide ou besta que tem um nível de desafio igual ou menor que o seu, ou volta à sua forma verdadeira. Ele reverte à sua verdadeira forma se morrer. Qualquer equipamento que ele esteja usando ou carregando é absorvido ou suportado pela nova forma (a escolha do couatl).\nEm uma nova forma, o couatl mantém suas estatísticas de jogo e habilidade de falar, mas sua CA, modos de movimento, Força, Destreza e outras ações são substituídas pelas da nova forma, e ele ganha quaisquer estatísticas e capacidades (exceto características de classe, ações lendárias e ações de covil) que a nova forma possui, mas que falta. Se a nova forma tiver um ataque de mordida, o couatl poderá usar sua mordida nessa forma.",
          "name": "Alterar forma"
        }
      ],
      "damage_immunities": [
        "psychic; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "damage_resistances": [
        "radiante"
      ],
      "languages": [
        "all",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "cha": 6,
        "con": 5,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 15,
        "visão verdadeira": 120
      },
      "speed": {
        "voo": 90,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A habilidade de conjuração do couatl é Carisma (resistência de magia CD 14). Ele pode lançar inatamente os seguintes feitiços, exigindo apenas componentes verbais:\n\nÀ vontade: detecte o mal e o bem, detecte magia, detecte pensamentos\n3/dia cada: abençoar, criar comida e água, curar feridas, restauração menor, proteção contra veneno, santuário, escudo\n1/dia cada: sonho, restauração maior, vidência",
          "name": "Feitiço Inato"
        },
        {
          "description": "Os ataques com armas do couatl são mágicos.",
          "name": "Armas Mágicas"
        },
        {
          "description": "O couatl é imune à vidência e a qualquer efeito que possa sentir suas emoções, ler seus pensamentos ou detectar sua localização.",
          "name": "Mente Protegida"
        }
      ]
    }
  },
  {
    "id": "srd:elephant",
    "name": "Elefante",
    "name_en": "Elephant",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Fera",
    "type_en": "beast",
    "cr": "4",
    "cr_numeric": 4.0,
    "armor_class": 12,
    "hp_max": 76,
    "hp_formula": "8d12+24",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 17,
        "dex": 9,
        "int": 3,
        "str": 22,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "3d8+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1,5 m, um alvo. Acerto: 19 (3d8 + 6) de dano perfurante.",
          "name": "Sangrento"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "3d10+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1,5 m, uma criatura caída. Acerto: 22 (3d10 + 6) de dano de concussão.",
          "name": "Pisar"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o elefante se mover pelo menos 6 metros em linha reta em direção a uma criatura e então acertá-la com um ataque sangrento no mesmo turno, o alvo deve ser bem sucedido em um teste de resistência de Força CD 12 ou será derrubado. Se o alvo estiver caído, o elefante pode fazer um ataque de pisada contra ele como uma ação bônus.",
          "name": "Carga de atropelamento"
        }
      ]
    }
  },
  {
    "id": "srd:ettin",
    "name": "Ettin",
    "name_en": "Ettin",
    "size": "Grande",
    "size_en": "Large",
    "type": "Gigante",
    "type_en": "giant",
    "cr": "4",
    "cr_numeric": 4.0,
    "armor_class": 12,
    "hp_max": 85,
    "hp_formula": "10d10+30",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 17,
        "dex": 8,
        "int": 6,
        "str": 21,
        "wis": 10
      },
      "actions": [
        {
          "description": "O ettin faz dois ataques: um com seu machado de batalha e outro com sua estrela da manhã.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d8+5",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Sucesso: 14 (2d8 + 5) de dano cortante.",
          "name": "Machado de batalha"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d8+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 14 (2d8 + 5) de dano perfurante.",
          "name": "Estrela da Manhã"
        }
      ],
      "languages": [
        "Gigante",
        "Orc"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O ettin tem vantagem em testes de Sabedoria (Percepção) e em testes de resistência contra ficar cego, enfeitiçado, surdo, assustado, atordoado e inconsciente.",
          "name": "Duas cabeças"
        },
        {
          "description": "Quando uma das cabeças do ettin está dormindo, a outra cabeça está acordada.",
          "name": "Acordado"
        }
      ]
    }
  },
  {
    "id": "srd:ghost",
    "name": "Fantasma",
    "name_en": "Ghost",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "4",
    "cr_numeric": 4.0,
    "armor_class": 11,
    "hp_max": 45,
    "hp_formula": "10d8",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 17,
        "con": 10,
        "dex": 13,
        "int": 10,
        "str": 7,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "4d6+3",
              "type": "necrotic"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 17 (4d6 + 3) de dano necrótico.",
          "name": "Toque fulminante"
        },
        {
          "description": "O fantasma entra no Plano Etéreo vindo do Plano Material, ou vice-versa. É visível no Plano Material enquanto está na Fronteira Etérea, e vice-versa, mas não pode afetar ou ser afetado por nada no outro plano.",
          "name": "Etéreo"
        },
        {
          "description": "Cada criatura não-morta a até 18 metros do fantasma que puder vê-lo deve ser bem sucedida em um teste de resistência de Sabedoria CD 13 ou ficará assustada por 1 minuto. Se o salvamento falhar por 5 ou mais, o alvo também envelhece 1d4 x 10 anos. Um alvo assustado pode repetir o teste de resistência no final de cada um de seus turnos, encerrando a condição de assustado em caso de sucesso. Se o teste de resistência de um alvo for bem-sucedido ou o efeito terminar, o alvo ficará imune ao Rosto Horripilante deste fantasma pelas próximas 24 horas. O efeito de envelhecimento pode ser revertido com um feitiço de restauração maior, mas somente dentro de 24 horas após sua ocorrência.",
          "name": "Rosto horrível"
        },
        {
          "description": "Um humanóide que o fantasma possa ver a até 1,5 metro dele deve ter sucesso em um teste de resistência de Carisma CD 13 ou será possuído pelo fantasma; o fantasma então desaparece e o alvo fica incapacitado e perde o controle de seu corpo. O fantasma agora controla o corpo, mas não priva o alvo da consciência. O fantasma não pode ser alvo de nenhum ataque, magia ou outro efeito, exceto aqueles que expulsam mortos-vivos, e ele mantém sua tendência, Inteligência, Sabedoria, Carisma e imunidade a ser enfeitiçado e assustado. Caso contrário, ele usa as estatísticas do alvo possuído, mas não obtém acesso ao conhecimento, características de classe ou proficiências do alvo.\nA possessão dura até que o corpo caia para 0 pontos de vida, o fantasma a termine como uma ação bônus, ou o fantasma seja expulso ou forçado a sair por um efeito como a magia dissipar o mal e o bem. Quando a possessão termina, o fantasma reaparece em um espaço desocupado a até 1,5 metro do corpo. O alvo fica imune à Possessão deste fantasma por 24 horas após ter sucesso no teste de resistência ou após o término da posse.",
          "name": "Possessão (Recarga 6)"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Envenenado",
        "Caído",
        "Impedido"
      ],
      "damage_immunities": [
        "frio",
        "necrótico",
        "veneno"
      ],
      "damage_resistances": [
        "ácido",
        "fogo",
        "elétrico",
        "thunder; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "any languages it knew in life"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 11
      },
      "speed": {
        "voo": 40,
        "pairar": true
      },
      "traits": [
        {
          "description": "O fantasma pode ver 18 metros no Plano Etéreo quando está no Plano Material e vice-versa.",
          "name": "Visão Etérea"
        },
        {
          "description": "O fantasma pode se mover através de outras criaturas e objetos como se fossem terrenos difíceis. Ele sofre 5 (1d10) de dano de força se terminar seu turno dentro de um objeto.",
          "name": "Movimento Incorpóreo"
        }
      ]
    }
  },
  {
    "id": "srd:lamia",
    "name": "Lâmia",
    "name_en": "Lamia",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "4",
    "cr_numeric": 4.0,
    "armor_class": 13,
    "hp_max": 97,
    "hp_formula": "13d10+26",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 15,
        "dex": 13,
        "int": 14,
        "str": 16,
        "wis": 15
      },
      "actions": [
        {
          "description": "A lâmia realiza dois ataques: um com suas garras e outro com sua adaga ou Toque Intoxicante.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d10+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Sucesso: 14 (2d10 + 3) de dano cortante.",
          "name": "Garras"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d4+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d4 + 3) de dano perfurante.",
          "name": "Punhal"
        },
        {
          "description": "Ataque Mágico Corpo a Corpo: +5 para acertar, alcance 1,5 m, uma criatura. Acerto: O alvo é amaldiçoado magicamente por 1 hora. Até que a maldição termine, o alvo terá desvantagem nos testes de resistência de Sabedoria e em todos os testes de habilidade.",
          "name": "Toque Intoxicante"
        }
      ],
      "languages": [
        "Abissal",
        "Comum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 12
      },
      "skills": {
        "Enganação": 7,
        "Intuição": 4,
        "Furtividade": 3
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A habilidade inata de conjuração da lâmia é Carisma (resistência de magia CD 13). Ele pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais.\n\nÀ vontade: disfarçar-se (qualquer forma humanóide), imagem principal\n3/dia cada: encantar pessoa, imagem espelhada, vidência, sugestão\n1/dia: geas",
          "name": "Feitiço Inato"
        }
      ]
    }
  },
  {
    "id": "srd:red-dragon-wyrmling",
    "name": "Dragão Vermelho Wyrmling",
    "name_en": "Red Dragon Wyrmling",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "4",
    "cr_numeric": 4.0,
    "armor_class": 17,
    "hp_max": 75,
    "hp_formula": "10d8+30",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 17,
        "dex": 10,
        "int": 12,
        "str": 19,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d10+1d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (1d10 + 4) de dano perfurante mais 3 (1d6) de dano de fogo.",
          "name": "Morder"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "7d6+0",
              "type": "fire"
            }
          ],
          "description": "O dragão exala fogo em um cone de 4,5 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 13, sofrendo 24 (7d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro de Fogo (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 4,
        "con": 5,
        "dex": 2,
        "wis": 2
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4,
        "Furtividade": 2
      },
      "speed": {
        "escalada": 30,
        "voo": 60,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:succubusincubus",
    "name": "Súcubo/Íncubo",
    "name_en": "Succubus/Incubus",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "4",
    "cr_numeric": 4.0,
    "armor_class": 15,
    "hp_max": 66,
    "hp_formula": "12d8+12",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 20,
        "con": 13,
        "dex": 17,
        "int": 15,
        "str": 8,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano cortante.",
          "name": "Garra (somente forma de demônio)"
        },
        {
          "description": "Um humanóide que o demônio possa ver a até 9 metros dele deve ter sucesso em um teste de resistência de Sabedoria CD 15 ou ficará magicamente enfeitiçado por 1 dia. O alvo encantado obedece aos comandos verbais ou telepáticos do demônio. Se o alvo sofrer algum dano ou receber um comando suicida, ele pode repetir o teste de resistência, encerrando o efeito em caso de sucesso. Se o alvo resistir com sucesso contra o efeito, ou se o efeito sobre ele terminar, o alvo ficará imune ao Feitiço deste demônio pelas próximas 24 horas.\nO demônio pode ter apenas um alvo encantado por vez. Se encantar outro, o efeito no alvo anterior termina.",
          "name": "Charme"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "5d10+5",
              "type": "psychic"
            }
          ],
          "description": "O demônio beija uma criatura encantada por ele ou uma criatura voluntária. O alvo deve fazer um teste de resistência de Constituição CD 15 contra esta magia, sofrendo 32 (5d10 + 5) de dano psíquico se falhar na resistência, ou metade do dano se obtiver sucesso. O máximo de pontos de vida do alvo é reduzido em uma quantidade igual ao dano recebido. Esta redução dura até o alvo terminar um descanso longo. O alvo morre se este efeito reduzir seu máximo de pontos de vida a 0.",
          "name": "Drenando Beijo"
        },
        {
          "description": "O demônio entra magicamente no Plano Etéreo vindo do Plano Material, ou vice-versa.",
          "name": "Etéreo"
        }
      ],
      "damage_resistances": [
        "frio",
        "fogo",
        "elétrico",
        "poison; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Abissal",
        "Comum",
        "Infernal",
        "telepathy 60 ft."
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 15
      },
      "skills": {
        "Enganação": 9,
        "Intuição": 5,
        "Percepção": 5,
        "Persuasão": 9,
        "Furtividade": 7
      },
      "speed": {
        "voo": 60,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O demônio ignora a restrição de alcance de sua telepatia ao se comunicar com uma criatura que tenha encantado. Os dois nem precisam estar no mesmo plano de existência.",
          "name": "Vínculo Telepático"
        },
        {
          "description": "O demônio pode usar sua ação para se transformar em um humanóide Pequeno ou Médio, ou voltar à sua forma verdadeira. Sem asas, o demônio perde a velocidade de vôo. Além do tamanho e da velocidade, suas estatísticas são as mesmas em todos os formulários. Qualquer equipamento que esteja vestindo ou carregando não é transformado. Ele reverte à sua verdadeira forma se morrer.",
          "name": "Metamorfo"
        }
      ]
    }
  },
  {
    "id": "srd:wereboar",
    "name": "Homem-javali",
    "name_en": "Wereboar",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "4",
    "cr_numeric": 4.0,
    "armor_class": 10,
    "hp_max": 78,
    "hp_formula": "12d8+24",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 15,
        "dex": 10,
        "int": 10,
        "str": 17,
        "wis": 11
      },
      "actions": [
        {
          "description": "O homem-javali faz dois ataques, dos quais apenas um pode ser feito com suas presas.",
          "name": "Multiataque (somente forma humanóide ou híbrida)"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano de concussão.",
          "name": "Maul (somente forma humanóide ou híbrida)"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano cortante. Se o alvo for um humanóide, ele deve ser bem sucedido em um teste de resistência de Constituição CD 12 ou será amaldiçoado com licantropia de homem-javali.",
          "name": "Presas (somente javali ou forma híbrida)"
        }
      ],
      "damage_immunities": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Common (can't speak in boar form)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O homem-javali pode usar sua ação para se transformar em um híbrido javali-humanóide ou em um javali, ou de volta à sua forma verdadeira, que é humanóide. Suas estatísticas, exceto seu AC, são as mesmas em cada formulário. Qualquer equipamento que esteja vestindo ou carregando não é transformado. Ele reverte à sua verdadeira forma se morrer.",
          "name": "Metamorfo"
        },
        {
          "description": "Se o homem-javali se mover pelo menos 4,5 metros em linha reta em direção a um alvo e então acertá-lo com suas presas no mesmo turno, o alvo sofre 7 (2d6) de dano cortante extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 13 ou será derrubado.",
          "name": "Carga (apenas Javali ou Forma Híbrida)"
        },
        {
          "description": "Se o homem-javali sofrer 14 pontos de dano ou menos que o reduziriam a 0 pontos de vida, ele será reduzido a 1 ponto de vida.",
          "name": "Implacável (recarrega após um descanso curto ou longo)"
        }
      ]
    }
  },
  {
    "id": "srd:weretiger",
    "name": "Homem Tigre",
    "name_en": "Weretiger",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "4",
    "cr_numeric": 4.0,
    "armor_class": 12,
    "hp_max": 120,
    "hp_formula": "16d8+48",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 16,
        "dex": 15,
        "int": 10,
        "str": 17,
        "wis": 13
      },
      "actions": [
        {
          "description": "Na forma humanóide, o homem-tigre faz dois ataques de cimitarra ou dois ataques de arco longo. Na forma híbrida, pode atacar como um humanóide ou fazer dois ataques de garras.",
          "name": "Multiataque (somente forma humanóide ou híbrida)"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d10+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (1d10 + 3) de dano perfurante. Se o alvo for um humanóide, ele deve ser bem sucedido em um teste de resistência de Constituição CD 13 ou será amaldiçoado com licantropia homem-tigre.",
          "name": "Mordida (apenas tigre ou forma híbrida)"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d8 + 3) de dano cortante.",
          "name": "Garra (apenas tigre ou forma híbrida)"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano cortante.",
          "name": "Cimitarra (somente forma humanóide ou híbrida)"
        },
        {
          "attack_bonus": 4,
          "damage": [
            {
              "dice": "1d8+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +4 para acertar, alcance 150/600 pés, um alvo. Acerto: 6 (1d8 + 2) de dano perfurante.",
          "name": "Arco longo (somente forma humanóide ou híbrida)"
        }
      ],
      "damage_immunities": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Common (can't speak in tiger form)"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 15
      },
      "skills": {
        "Percepção": 5,
        "Furtividade": 4
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O homem-tigre pode usar sua ação para se transformar em um híbrido tigre-humanóide ou em um tigre, ou voltar à sua forma verdadeira, que é humanóide. Suas estatísticas, além do tamanho, são as mesmas em cada formulário. Qualquer equipamento que esteja vestindo ou carregando não é transformado. Ele reverte à sua verdadeira forma se morrer.",
          "name": "Metamorfo"
        },
        {
          "description": "O homem-tigre tem vantagem em testes de Sabedoria (Percepção) que dependem de audição ou olfato.",
          "name": "Audição e olfato aguçados"
        },
        {
          "description": "Se o homem-tigre se mover pelo menos 4,5 metros em linha reta em direção a uma criatura e então acertá-la com um ataque de garra no mesmo turno, aquele alvo deve ser bem sucedido em um teste de resistência de Força CD 14 ou será derrubado. Se o alvo estiver caído, o homem-tigre pode realizar um ataque de mordida contra ele como uma ação bônus.",
          "name": "Pounce (apenas tigre ou forma híbrida)"
        }
      ]
    }
  },
  {
    "id": "srd:air-elemental",
    "name": "Elemental do Ar",
    "name_en": "Air Elemental",
    "size": "Grande",
    "size_en": "Large",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 15,
    "hp_max": 90,
    "hp_formula": "12d10+24",
    "initiative_modifier": 5,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 14,
        "dex": 20,
        "int": 6,
        "str": 14,
        "wis": 10
      },
      "actions": [
        {
          "description": "O elemental faz dois ataques violentos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "2d8+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1,5 m, um alvo. Acerto: 14 (2d8 + 5) de dano de concussão.",
          "name": "Bater"
        },
        {
          "description": "Cada criatura no espaço do elemental deve realizar um teste de resistência de Força CD 13. Em caso de falha, o alvo sofre 15 (3d8 + 2) de dano de concussão e é arremessado a 6 metros de distância do elemental em uma direção aleatória e derrubado. Se um alvo arremessado atingir um objeto, como uma parede ou chão, o alvo sofre 3 (1d6) de dano de concussão para cada 3 metros que foi arremessado. Se o alvo for lançado em outra criatura, essa criatura deve ser bem sucedida em um teste de resistência de Destreza CD 13 ou sofrerá o mesmo dano e será derrubada.\nSe o teste de resistência for bem-sucedido, o alvo sofre metade do dano de concussão e não é arremessado nem derrubado.",
          "name": "Redemoinho (recarga 4-6)"
        }
      ],
      "condition_immunities": [
        "Exausto",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Envenenado",
        "Caído",
        "Impedido",
        "Inconsciente"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "elétrico",
        "thunder; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Auran"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "voo": 90,
        "pairar": true
      },
      "traits": [
        {
          "description": "O elemental pode entrar no espaço de uma criatura hostil e parar ali. Ele pode se mover através de um espaço tão estreito quanto 1 polegada de largura sem apertar.",
          "name": "Forma Aérea"
        }
      ]
    }
  },
  {
    "id": "srd:barbed-devil",
    "name": "Diabo farpado",
    "name_en": "Barbed Devil",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 15,
    "hp_max": 110,
    "hp_formula": "13d8+52",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 14,
        "con": 18,
        "dex": 17,
        "int": 12,
        "str": 16,
        "wis": 14
      },
      "actions": [
        {
          "description": "O diabo faz três ataques corpo a corpo: um com a cauda e dois com as garras. Alternativamente, ele pode usar Hurl Flame duas vezes.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano perfurante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano perfurante.",
          "name": "Cauda"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "3d6+0",
              "type": "fire"
            }
          ],
          "description": "Ataque Mágico à Distância: +5 para acertar, alcance de 150 pés, um alvo. Acerto: 10 (3d6) de dano de fogo. Se o alvo for um objeto inflamável que não esteja sendo usado ou carregado, ele também pegará fogo.",
          "name": "Lançar Chama"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "cold; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Infernal",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "cha": 5,
        "con": 7,
        "str": 6,
        "wis": 5
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 18
      },
      "skills": {
        "Enganação": 5,
        "Intuição": 5,
        "Percepção": 8
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "No início de cada um de seus turnos, o diabo farpado causa 5 (1d10) de dano perfurante a qualquer criatura que o agarre.",
          "name": "Couro Farpado"
        },
        {
          "description": "A escuridão mágica não impede a visão no escuro do diabo.",
          "name": "Visão do Diabo"
        },
        {
          "description": "O diabo tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:bulette",
    "name": "Bulette",
    "name_en": "Bulette",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 17,
    "hp_max": 94,
    "hp_formula": "9d10+45",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 21,
        "dex": 11,
        "int": 2,
        "str": 19,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "4d12+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 30 (4d12 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "description": "Se o bulette saltar pelo menos 4,5 metros como parte de seu movimento, ele poderá usar esta ação para cair de pé em um espaço que contenha uma ou mais outras criaturas. Cada uma dessas criaturas deve ser bem sucedida em um teste de resistência de Força ou Destreza CD 16 (escolha do alvo) ou será derrubada e sofrerá 14 (3d6 + 4) de dano de concussão mais 14 (3d6 + 4) de dano cortante. Se obtiver sucesso, a criatura sofre apenas metade do dano, não é derrubada e é empurrada 1,5 metro para fora do espaço do bulette, para um espaço desocupado à escolha da criatura. Se nenhum espaço desocupado estiver dentro do alcance, a criatura cai no espaço do bulette.",
          "name": "Salto mortal"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 16,
        "percepção sísmica": 60
      },
      "skills": {
        "Percepção": 6
      },
      "speed": {
        "escavação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O salto em distância do bulette é de até 30 pés e seu salto em altura é de até 15 pés, com ou sem corrida.",
          "name": "Salto em pé"
        }
      ]
    }
  },
  {
    "id": "srd:earth-elemental",
    "name": "Elemental da Terra",
    "name_en": "Earth Elemental",
    "size": "Grande",
    "size_en": "Large",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 17,
    "hp_max": 126,
    "hp_formula": "12d10+60",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 20,
        "dex": 8,
        "int": 5,
        "str": 20,
        "wis": 10
      },
      "actions": [
        {
          "description": "O elemental faz dois ataques violentos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "2d8+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 metros, um alvo. Acerto: 14 (2d8 + 5) de dano de concussão.",
          "name": "Bater"
        }
      ],
      "condition_immunities": [
        "Exausto",
        "Paralisado",
        "Petrificado",
        "Envenenado",
        "Inconsciente"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "damage_vulnerabilities": [
        "trovejante"
      ],
      "languages": [
        "Terran"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10,
        "percepção sísmica": 60
      },
      "speed": {
        "escavação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O elemental pode escavar através de terra e pedra não-mágica e não trabalhada. Ao fazer isso, o elemental não perturba o material através do qual se move.",
          "name": "Deslizamento da Terra"
        },
        {
          "description": "O elemental causa o dobro de dano a objetos e estruturas.",
          "name": "Monstro de Cerco"
        }
      ]
    }
  },
  {
    "id": "srd:fire-elemental",
    "name": "Elemental do Fogo",
    "name_en": "Fire Elemental",
    "size": "Grande",
    "size_en": "Large",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 13,
    "hp_max": 102,
    "hp_formula": "12d10+36",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 16,
        "dex": 17,
        "int": 6,
        "str": 10,
        "wis": 10
      },
      "actions": [
        {
          "description": "O elemental faz dois ataques de toque.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "fire"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano de fogo. Se o alvo for uma criatura ou objeto inflamável, ele se inflama. Até que uma criatura realize uma ação para apagar o fogo, o alvo sofre 5 (1d10) de dano de fogo no início de cada um de seus turnos.",
          "name": "Tocar"
        }
      ],
      "condition_immunities": [
        "Exausto",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Envenenado",
        "Caído",
        "Impedido",
        "Inconsciente"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Ignan"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "O elemental pode se mover através de um espaço tão estreito quanto 1 polegada de largura sem se apertar. Uma criatura que tocar o elemental ou acertá-lo com um ataque corpo a corpo enquanto estiver a 1,5 metro dele sofre 5 (1d10) de dano de fogo. Além disso, o elemental pode entrar no espaço de uma criatura hostil e parar ali. Na primeira vez que entrar no espaço de uma criatura em um turno, aquela criatura sofre 5 (1d10) de dano de fogo e pega fogo; até que alguém realize uma ação para apagar o fogo, a criatura sofre 5 (1d10) de dano de fogo no início de cada um de seus turnos.",
          "name": "Forma de Fogo"
        },
        {
          "description": "O elemental emite luz brilhante em um raio de 9 metros e luz fraca em 9 metros adicionais.",
          "name": "Iluminação"
        },
        {
          "description": "Para cada 1,5 metro que o elemental se move na água, ou para cada galão de água espirrado nele, ele sofre 1 dano de frio.",
          "name": "Suscetibilidade à Água"
        }
      ]
    }
  },
  {
    "id": "srd:flesh-golem",
    "name": "Golem de Carne",
    "name_en": "Flesh Golem",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Constructo",
    "type_en": "construct",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 9,
    "hp_max": 93,
    "hp_formula": "11d8+44",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 18,
        "dex": 9,
        "int": 6,
        "str": 19,
        "wis": 10
      },
      "actions": [
        {
          "description": "O golem faz dois ataques violentos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano de concussão.",
          "name": "Bater"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado",
        "Paralisado",
        "Petrificado",
        "Envenenado"
      ],
      "damage_immunities": [
        "elétrico",
        "poison; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with adamantine weapons"
      ],
      "languages": [
        "understands the languages of its creator but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Sempre que o golem começar seu turno com 40 pontos de vida ou menos, jogue um d6. Com um 6, o golem fica furioso. Em cada um de seus turnos enquanto estiver furioso, o golem ataca a criatura mais próxima que puder ver. Se nenhuma criatura estiver próxima o suficiente para se mover e atacar, o golem ataca um objeto, com preferência por um objeto menor que ele. Uma vez que o golem enlouquece, ele continua assim até ser destruído ou recuperar todos os seus pontos de vida.\nO criador do golem, se estiver a até 18 metros do golem furioso, pode tentar acalmá-lo falando com firmeza e persuasão. O golem deve ser capaz de ouvir seu criador, que deve realizar uma ação para realizar um teste de Carisma (Persuasão) CD 15. Se o teste for bem-sucedido, o golem deixa de ficar furioso. Se sofrer dano enquanto ainda estiver com 40 pontos de vida ou menos, o golem poderá ficar furioso novamente.",
          "name": "Furioso"
        },
        {
          "description": "Se o golem sofrer dano de fogo, ele terá desvantagem nas jogadas de ataque e testes de habilidade até o final do próximo turno.",
          "name": "Aversão ao Fogo"
        },
        {
          "description": "O golem é imune a qualquer feitiço ou efeito que altere sua forma.",
          "name": "Forma Imutável"
        },
        {
          "description": "Sempre que o golem for sujeito a dano elétrico, ele não sofrerá nenhum dano e, em vez disso, recuperará um número de pontos de vida igual ao dano elétrico causado.",
          "name": "Absorção de Raios"
        },
        {
          "description": "O golem tem vantagem em testes de resistência contra magias e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Os ataques com armas do golem são mágicos.",
          "name": "Armas Mágicas"
        }
      ]
    }
  },
  {
    "id": "srd:giant-crocodile",
    "name": "Crocodilo Gigante",
    "name_en": "Giant Crocodile",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Fera",
    "type_en": "beast",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 14,
    "hp_max": 85,
    "hp_formula": "9d12+27",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 17,
        "dex": 9,
        "int": 2,
        "str": 21,
        "wis": 10
      },
      "actions": [
        {
          "description": "O crocodilo faz dois ataques: um com a mordida e outro com a cauda.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "3d10+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1,5 m, um alvo. Acerto: 21 (3d10 + 5) de dano perfurante e o alvo é agarrado (CD de fuga 16). Até que esta luta termine, o alvo fica contido e o crocodilo não pode morder outro alvo.",
          "name": "Morder"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "2d8+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 metros, um alvo não agarrado pelo crocodilo. Acerto: 14 (2d8 + 5) de dano de concussão. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 16 ou será derrubado.",
          "name": "Cauda"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "skills": {
        "Furtividade": 5
      },
      "speed": {
        "natação": 50,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O crocodilo pode prender a respiração por 30 minutos.",
          "name": "Prenda a respiração"
        }
      ]
    }
  },
  {
    "id": "srd:giant-shark",
    "name": "Tubarão Gigante",
    "name_en": "Giant Shark",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Fera",
    "type_en": "beast",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 13,
    "hp_max": 126,
    "hp_formula": "11d12+55",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 21,
        "dex": 11,
        "int": 1,
        "str": 23,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "3d10+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +9 para acertar, alcance 1,5 m, um alvo. Acerto: 22 (3d10 + 6) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3
      },
      "speed": {
        "natação": 50
      },
      "traits": [
        {
          "description": "O tubarão tem vantagem em jogadas de ataque corpo a corpo contra qualquer criatura que não tenha todos os seus pontos de vida.",
          "name": "Frenesi de Sangue"
        },
        {
          "description": "O tubarão só consegue respirar debaixo d'água.",
          "name": "Respiração na Água"
        }
      ]
    }
  },
  {
    "id": "srd:gladiator",
    "name": "Gladiador",
    "name_en": "Gladiator",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 16,
    "hp_max": 112,
    "hp_formula": "15d8+45",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 16,
        "dex": 15,
        "int": 10,
        "str": 18,
        "wis": 12
      },
      "actions": [
        {
          "description": "O gladiador realiza três ataques corpo a corpo ou dois ataques à distância.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo ou de longo alcance com arma: +7 para acertar, alcance 1,5 m ou alcance 6/18 m, um alvo. Acerto: 11 (2d6 + 4) de dano perfurante, ou 13 (2d8 + 4) de dano perfurante se usado com as duas mãos para fazer um ataque corpo a corpo.",
          "name": "Lança"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d4+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +7 para acertar, alcance 1,5 m, uma criatura. Acerto: 9 (2d4 + 4) de dano de concussão. Se o alvo for uma criatura Média ou menor, ele deverá ser bem sucedido em um teste de resistência de Força CD 15 ou será derrubado.",
          "name": "Golpe de Escudo"
        }
      ],
      "languages": [
        "any one language (usually Common)"
      ],
      "reactions": [
        {
          "description": "O gladiador adiciona 3 à sua CA contra um ataque corpo a corpo que o acerte. Para fazer isso, o gladiador deve ver o atacante e estar empunhando uma arma branca.",
          "name": "Desviar"
        }
      ],
      "saving_throws": {
        "con": 6,
        "dex": 5,
        "str": 7
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 11
      },
      "skills": {
        "Atletismo": 10,
        "Intimidação": 5
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O gladiador tem vantagem nos testes de resistência contra ficar assustado.",
          "name": "Corajoso"
        },
        {
          "description": "Uma arma corpo a corpo causa um dado extra de dano quando o gladiador a acerta (incluído no ataque).",
          "name": "Bruto"
        }
      ]
    }
  },
  {
    "id": "srd:gorgon",
    "name": "Górgona",
    "name_en": "Gorgon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 19,
    "hp_max": 114,
    "hp_formula": "12d10+48",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 18,
        "dex": 11,
        "int": 2,
        "str": 20,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "2d12+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1,5 m, um alvo. Acerto: 18 (2d12 + 5) de dano perfurante.",
          "name": "Sangrento"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "2d10+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1,5 m, um alvo. Acerto: 16 (2d10 + 5) de dano de concussão.",
          "name": "Cascos"
        },
        {
          "description": "A górgona exala gás petrificante em um cone de 9 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 13. Se falhar na resistência, o alvo começa a virar pedra e é contido. O alvo contido deve repetir o teste de resistência no final do seu próximo turno. Com um sucesso, o efeito termina no alvo. Em caso de falha, o alvo fica petrificado até ser libertado pela magia restauração maior ou outra magia.",
          "name": "Respiração Petrificante (Recarga 5-6)"
        }
      ],
      "condition_immunities": [
        "Petrificado"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se a górgona se mover pelo menos 6 metros em linha reta em direção a uma criatura e então acertá-la com um ataque sangrento no mesmo turno, o alvo deve ser bem sucedido em um teste de resistência de Força CD 16 ou será derrubado. Se o alvo estiver caído, a górgona pode realizar um ataque com seus cascos contra ele como uma ação bônus.",
          "name": "Carga de atropelamento"
        }
      ]
    }
  },
  {
    "id": "srd:half-red-dragon-veteran",
    "name": "Veterano do Dragão Meio Vermelho",
    "name_en": "Half-Red Dragon Veteran",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 18,
    "hp_max": 65,
    "hp_formula": "10d8+20",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 14,
        "dex": 13,
        "int": 10,
        "str": 16,
        "wis": 11
      },
      "actions": [
        {
          "description": "O veterano faz dois ataques com espada longa. Se tiver uma espada curta empunhada, também pode fazer um ataque com espada curta.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d8 + 3) de dano cortante, ou 8 (1d10 + 3) de dano cortante se usado com as duas mãos.",
          "name": "Espada Longa"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano perfurante.",
          "name": "Espada curta"
        },
        {
          "attack_bonus": 3,
          "damage": [
            {
              "dice": "1d10+1",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +3 para acertar, alcance 100/400 pés, um alvo. Acerto: 6 (1d10 + 1) de dano perfurante.",
          "name": "Besta Pesada"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "7d6+0",
              "type": "fire"
            }
          ],
          "description": "O veterano exala fogo em um cone de 4,5 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 15, sofrendo 24 (7d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro de Fogo (Recarga 5-6)"
        }
      ],
      "damage_resistances": [
        "fogo"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 12
      },
      "speed": {
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:hill-giant",
    "name": "Gigante da Colina",
    "name_en": "Hill Giant",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Gigante",
    "type_en": "giant",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 13,
    "hp_max": 105,
    "hp_formula": "10d12+40",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 19,
        "dex": 8,
        "int": 5,
        "str": 21,
        "wis": 9
      },
      "actions": [
        {
          "description": "O gigante faz dois grandes ataques com tacos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "3d8+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 metros, um alvo. Acerto: 18 (3d8 + 5) de dano de concussão.",
          "name": "Grande clube"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "3d10+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque com arma de longo alcance: +8 para acertar, alcance 60/240 pés, um alvo. Acerto: 21 (3d10 + 5) de dano de concussão.",
          "name": "Pedra"
        }
      ],
      "languages": [
        "Gigante"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2
      },
      "speed": {
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:night-hag",
    "name": "Bruxa da Noite",
    "name_en": "Night Hag",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 17,
    "hp_max": 112,
    "hp_formula": "15d8+45",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 16,
        "dex": 15,
        "int": 16,
        "str": 18,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano cortante.",
          "name": "Garras (somente forma de bruxa)"
        },
        {
          "description": "A bruxa se transforma magicamente em uma humanóide feminina pequena ou média, ou volta à sua forma verdadeira. Suas estatísticas são as mesmas em cada formulário. Qualquer equipamento que ela esteja usando ou carregando não é transformado. Ela volta à sua verdadeira forma se morrer.",
          "name": "Alterar forma"
        },
        {
          "description": "A bruxa entra magicamente no Plano Etéreo vindo do Plano Material, ou vice-versa. Para fazer isso, a bruxa deve ter uma pedra-coração em sua posse.",
          "name": "Etéreo"
        },
        {
          "description": "Enquanto está no Plano Etéreo, a bruxa toca magicamente um humanóide adormecido no Plano Material. Um feitiço de proteção contra o mal e o bem lançado no alvo evita esse contato, assim como um círculo mágico. Enquanto o contato persistir, o alvo terá visões terríveis. Se essas visões durarem pelo menos 1 hora, o alvo não ganha nenhum benefício com seu descanso e seu máximo de pontos de vida é reduzido em 5 (1d10). Se este efeito reduzir o máximo de pontos de vida do alvo a 0, o alvo morre, e se o alvo for mau, sua alma fica presa na bolsa de almas da bruxa. A redução do ponto de vida máximo do alvo dura até ser removida pelo feitiço de restauração maior ou magia similar.",
          "name": "Pesadelo Assombrado (1/Dia)"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado"
      ],
      "damage_resistances": [
        "frio",
        "fire; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Abissal",
        "Comum",
        "Infernal",
        "Primordial"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 16
      },
      "skills": {
        "Enganação": 7,
        "Intuição": 6,
        "Percepção": 6,
        "Furtividade": 6
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A habilidade inata de conjuração da bruxa é Carisma (resistência de magia CD 14, +6 para acertar com ataques de magia). Ela pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\n\nÀ vontade: detectar magia, míssil mágico\n2/dia cada: mudança de avião (somente para si), raio de debilidade, sono",
          "name": "Feitiço Inato"
        },
        {
          "description": "A bruxa tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Uma bruxa noturna carrega dois itens mágicos muito raros que ela deve criar para si mesma. Se um dos objetos for perdido, a bruxa noturna fará de tudo para recuperá-lo, pois criar uma nova ferramenta leva tempo e esforço.\nHeartstone: Esta gema negra brilhante permite que uma bruxa noturna se torne etérea enquanto estiver em sua posse. O toque de uma pedra do coração também cura qualquer doença. Criar uma pedra-coração leva 30 dias.\nSaco de Alma: Quando um humanóide maligno morre como resultado da Assombração do Pesadelo de uma bruxa noturna, a bruxa pega a alma neste saco preto feito de carne costurada. Um saco de almas pode conter apenas uma alma maligna por vez, e apenas a bruxa noturna que criou o saco pode capturar uma alma com ele. A confecção de uma bolsa de almas leva 7 dias e um sacrifício humanóide (cuja carne é usada para fazer a bolsa).",
          "name": "Itens da Bruxa Noturna"
        },
        {
          "description": "Quando as bruxas precisam trabalhar juntas, elas formam covens, apesar de sua natureza egoísta. Um coven é composto por bruxas de qualquer tipo, todas iguais dentro do grupo. No entanto, cada uma das bruxas continua a desejar mais poder pessoal.\nUm coven consiste em três bruxas para que qualquer discussão entre duas bruxas possa ser resolvida pela terceira. Se mais de três bruxas se unirem, como pode acontecer se dois covens entrarem em conflito, o resultado geralmente é o caos.",
          "name": "Bruxa Coven"
        },
        {
          "description": "Embora todos os três membros de um coven de bruxas estejam a até 9 metros um do outro, cada um deles pode lançar as seguintes magias da lista de magias do mago, mas devem compartilhar os espaços de magia entre si:\n\n* 1º nível (4 espaços): identificar, raio de doença\n* 2º nível (3 slots): segurar pessoa, localizar objeto\n* 3º nível (3 espaços): conceder maldição, contrafeitiço, raio\n* 4º nível (3 slots): assassino fantasma, polimorfo\n* 5º nível (2 espaços): contato com outro plano, vidência\n* 6º nível (1 slot): mordida no olho\n\nPara lançar essas magias, cada bruxa é uma conjuradora de 12º nível que usa Inteligência como sua habilidade de lançar magias. A CD de resistência do feitiço é 12 + o modificador de Inteligência da bruxa, e o bônus de ataque do feitiço é 4 + o modificador de Inteligência da bruxa.",
          "name": "Conjuração Compartilhada (Somente Coven)"
        },
        {
          "description": "Um clã de bruxas pode criar um item mágico chamado olho de bruxa, que é feito de um olho real coberto com verniz e geralmente colocado em um pingente ou outro item vestível. O olho de bruxa geralmente é confiado a um lacaio para guarda e transporte. Uma bruxa no coven pode realizar uma ação para ver o que o olho da bruxa vê se o olho da bruxa estiver no mesmo plano de existência. Um olho de bruxa tem CA 10, 1 ponto de vida e visão no escuro com um raio de 18 metros. Se for destruído, cada membro do coven sofre 3d10 de dano psíquico e fica cego por 24 horas.\nUm clã de bruxas pode ter apenas um olho de bruxa por vez, e a criação de um novo exige que todos os três membros do clã realizem um ritual. O ritual leva 1 hora e as bruxas não podem realizá-lo enquanto estiverem cegas. Durante o ritual, se as bruxas realizarem qualquer ação além de realizar o ritual, elas deverão recomeçar.",
          "name": "Olho de Bruxa (apenas Coven)"
        }
      ]
    }
  },
  {
    "id": "srd:otyugh",
    "name": "Otyugh",
    "name_en": "Otyugh",
    "size": "Grande",
    "size_en": "Large",
    "type": "Aberração",
    "type_en": "aberration",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 14,
    "hp_max": 114,
    "hp_formula": "12d10+48",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 19,
        "dex": 11,
        "int": 6,
        "str": 16,
        "wis": 13
      },
      "actions": [
        {
          "description": "O otyugh faz três ataques: um com a mordida e dois com os tentáculos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 12 (2d8 + 3) de dano perfurante. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Constituição CD 15 contra doenças ou ficará envenenado até que a doença seja curada. A cada 24 horas decorridas, o alvo deve repetir o teste de resistência, reduzindo seu máximo de pontos de vida em 5 (1d10) em caso de falha. A doença é curada com sucesso. O alvo morre se a doença reduzir seu máximo de pontos de vida para 0. Essa redução no máximo de pontos de vida do alvo dura até que a doença seja curada.",
          "name": "Morder"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 metros, um alvo. Acerto: 7 (1d8 + 3) de dano contundente mais 4 (1d8) de dano perfurante. Se o alvo for Médio ou menor, ele será agarrado (CD 13 para escapar) e contido até o agarrão terminar. O otyugh tem dois tentáculos, cada um dos quais pode agarrar um alvo.",
          "name": "Tentáculo"
        },
        {
          "description": "O otyugh bate as criaturas agarradas por ele umas nas outras ou em uma superfície sólida. Cada criatura deve ser bem sucedida em um teste de resistência de Constituição CD 14 ou sofrerá 10 (2d6 + 3) de dano de concussão e ficará atordoada até o final do próximo turno do otyugh. Se obtiver sucesso, o alvo sofre metade do dano de concussão e não fica atordoado.",
          "name": "Golpe do Tentáculo"
        }
      ],
      "languages": [
        "Otyugh"
      ],
      "saving_throws": {
        "con": 7
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 11
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O otyugh pode transmitir magicamente mensagens e imagens simples para qualquer criatura a até 36 metros dele que possa entender um idioma. Esta forma de telepatia não permite que a criatura receptora responda telepaticamente.",
          "name": "Telepatia Limitada"
        }
      ]
    }
  },
  {
    "id": "srd:roper",
    "name": "Roper",
    "name_en": "Roper",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 20,
    "hp_max": 93,
    "hp_formula": "11d10+33",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 17,
        "dex": 8,
        "int": 7,
        "str": 18,
        "wis": 16
      },
      "actions": [
        {
          "description": "O estrangulador faz quatro ataques com suas gavinhas, usa Reel e faz um ataque com sua mordida.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "4d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 22 (4d8 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 15 metros, uma criatura. Acerto: O alvo é agarrado (CD 15 para escapar). Até o agarrão terminar, o alvo fica impedido e tem desvantagem em testes de Força e testes de resistência de Força, e o laçador não pode usar a mesma gavinha em outro alvo.",
          "name": "Gavinha"
        },
        {
          "description": "O estrangulador puxa cada criatura agarrada por ele até 7,5 metros em direção a ele.",
          "name": "Carretel"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 16
      },
      "skills": {
        "Percepção": 6,
        "Furtividade": 5
      },
      "speed": {
        "escalada": 10,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "Embora o laçador permaneça imóvel, ele é indistinguível de uma formação normal de caverna, como uma estalagmite.",
          "name": "Aparência Falsa"
        },
        {
          "description": "O laçador pode ter até seis gavinhas por vez. Cada gavinha pode ser atacada (CA 20; 10 pontos de vida; imunidade a veneno e dano psíquico). Destruir uma gavinha não causa dano ao laçador, que pode expulsar uma gavinha substituta em seu próximo turno. Uma gavinha também pode ser quebrada se uma criatura realizar uma ação e for bem-sucedida em um teste de Força CD 15 contra ela.",
          "name": "Agarrando gavinhas"
        },
        {
          "description": "O laçador pode escalar superfícies difíceis, inclusive de cabeça para baixo em tetos, sem precisar fazer um teste de habilidade.",
          "name": "Escalada de aranha"
        }
      ]
    }
  },
  {
    "id": "srd:salamander",
    "name": "Salamandra",
    "name_en": "Salamander",
    "size": "Grande",
    "size_en": "Large",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 15,
    "hp_max": 90,
    "hp_formula": "12d10+24",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 15,
        "dex": 14,
        "int": 11,
        "str": 18,
        "wis": 10
      },
      "actions": [
        {
          "description": "A salamandra faz dois ataques: um com a lança e outro com a cauda.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo ou de longo alcance com arma: +7 para acertar, alcance 1,5 m ou alcance 6/18 m, um alvo. Acerto: 11 (2d6 + 4) de dano perfurante, ou 13 (2d8 + 4) de dano perfurante se usado com as duas mãos para fazer um ataque corpo a corpo, mais 3 (1d6) de dano de fogo.",
          "name": "Lança"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+2d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 metros, um alvo. Acerto: 11 (2d6 + 4) de dano de concussão mais 7 (2d6) de dano de fogo, e o alvo é agarrado (CD de fuga 14). Até que esta luta termine, o alvo fica contido, a salamandra pode acertá-lo automaticamente com sua cauda e a salamandra não pode fazer ataques de cauda contra outros alvos.",
          "name": "Cauda"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "damage_vulnerabilities": [
        "frio"
      ],
      "languages": [
        "Ignan"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Uma criatura que tocar a salamandra ou acertá-la com um ataque corpo a corpo enquanto estiver a 1,5 metro dela sofre 7 (2d6) de dano de fogo.",
          "name": "Corpo Aquecido"
        },
        {
          "description": "Qualquer arma corpo-a-corpo de metal que a salamandra empunha causa 3 (1d6) de dano de fogo extra ao acertar (incluído no ataque).",
          "name": "Armas Aquecidas"
        }
      ]
    }
  },
  {
    "id": "srd:shambling-mound",
    "name": "Monte Cambaleante",
    "name_en": "Shambling Mound",
    "size": "Grande",
    "size_en": "Large",
    "type": "Planta",
    "type_en": "plant",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 15,
    "hp_max": 136,
    "hp_formula": "16d10+48",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 16,
        "dex": 8,
        "int": 5,
        "str": 18,
        "wis": 10
      },
      "actions": [
        {
          "description": "O monte cambaleante faz dois ataques violentos. Se ambos os ataques atingirem um alvo Médio ou menor, o alvo é agarrado (CD 14 para escapar) e o monte cambaleante usa seu Engolfar nele.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano de concussão.",
          "name": "Bater"
        },
        {
          "description": "O monte cambaleante engole uma criatura Média ou menor agarrada por ele. O alvo engolfado fica cego, contido e incapaz de respirar, e deve ser bem sucedido em um teste de resistência de Constituição CD 14 no início de cada um dos turnos do monte ou sofrerá 13 (2d8 + 4) de dano de concussão. Se o monte se mover, o alvo engolfado se moverá com ele. O monte só pode ter uma criatura engolida por vez.",
          "name": "Engolir"
        }
      ],
      "condition_immunities": [
        "Cego",
        "Surdo",
        "Exausto"
      ],
      "damage_immunities": [
        "elétrico"
      ],
      "damage_resistances": [
        "frio",
        "fogo"
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "percepção passiva": 10
      },
      "skills": {
        "Furtividade": 2
      },
      "speed": {
        "natação": 20,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "Sempre que o monte cambaleante for sujeito a dano elétrico, ele não sofre dano e recupera um número de pontos de vida igual ao dano elétrico causado.",
          "name": "Absorção de Raios"
        }
      ]
    }
  },
  {
    "id": "srd:triceratops",
    "name": "Tricerátopo",
    "name_en": "Triceratops",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Fera",
    "type_en": "beast",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 13,
    "hp_max": 95,
    "hp_formula": "10d12+30",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 17,
        "dex": 9,
        "int": 2,
        "str": 22,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "4d8+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +9 para acertar, alcance 1,5 m, um alvo. Acerto: 24 (4d8 + 6) de dano perfurante.",
          "name": "Sangrento"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "3d10+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1,5 m, uma criatura caída. Acerto: 22 (3d10 + 6) de dano de concussão.",
          "name": "Pisar"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "Se o tricerátopo se mover pelo menos 6 metros em linha reta em direção a uma criatura e então acertá-la com um ataque sangrento no mesmo turno, o alvo deve ser bem sucedido em um teste de resistência de Força CD 13 ou será derrubado. Se o alvo estiver caído, o tricerátopo pode realizar um ataque de pisada contra ele como uma ação bônus.",
          "name": "Carga de atropelamento"
        }
      ]
    }
  },
  {
    "id": "srd:troll",
    "name": "troll",
    "name_en": "Troll",
    "size": "Grande",
    "size_en": "Large",
    "type": "Gigante",
    "type_en": "giant",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 15,
    "hp_max": 84,
    "hp_formula": "8d10+40",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 20,
        "dex": 13,
        "int": 7,
        "str": 18,
        "wis": 9
      },
      "actions": [
        {
          "description": "O troll faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "1d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d6 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.",
          "name": "Garra"
        }
      ],
      "languages": [
        "Gigante"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 12
      },
      "skills": {
        "Percepção": 2
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O troll tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        },
        {
          "description": "O troll recupera 10 pontos de vida no início do seu turno. Se o troll sofrer dano de ácido ou fogo, esta característica não funcionará no início do próximo turno do troll. O troll morre apenas se começar seu turno com 0 pontos de vida e não se regenerar.",
          "name": "Regeneração"
        },
        {
          "description": "Sempre que o troll sofrer pelo menos 15 danos cortantes de uma só vez, jogue um d20 para determinar o que mais acontece com ele:\n\n**1-10:** Nada mais acontece.\n**11-14:** Uma perna é cortada do troll se ele ainda tiver pernas.\n**15-18:** Um braço é decepado do troll se ele ainda tiver braços restantes.\n**19-20:** O troll é decapitado, mas só morre se não conseguir se regenerar. Se morrer, a cabeça decepada também morrerá.\n\nSe o troll terminar um descanso curto ou longo sem recolocar um membro ou cabeça decepada, a parte crescerá novamente. Nesse ponto, a parte cortada morre. Até então, uma parte decepada atua por iniciativa do troll e tem ação e movimento próprios. Uma parte cortada tem CA 13, 10 pontos de vida e a característica Regeneração do troll.\nUma **perna decepada** é incapaz de atacar e tem um deslocamento de 1,5 metro.\nUm **braço decepado** tem deslocamento de 1,5 metro e pode realizar um ataque de garra em seu turno, com desvantagem na jogada de ataque, a menos que o troll possa ver o braço e seu alvo. Cada vez que o troll perde um braço, ele perde um ataque de garra.\nSe sua cabeça for decepada, o troll perde seu ataque de mordida e seu corpo fica cego, a menos que sua cabeça possa vê-lo. A **cabeça decepada** tem uma velocidade de 0 pés e a característica Cheiro Aguçado do troll. Ele pode realizar um ataque de mordida, mas apenas contra um alvo em seu espaço.\nA velocidade do troll é reduzida pela metade se lhe faltar uma perna. Se perder as duas pernas, ficará caído. Se tiver os dois braços, pode rastejar. Com apenas um braço, ele ainda pode rastejar, mas sua velocidade é reduzida pela metade. Sem braços ou pernas, sua velocidade é 0 e não pode se beneficiar de bônus de velocidade.",
          "name": "Variante: Membros Repugnantes"
        }
      ]
    }
  },
  {
    "id": "srd:unicorn",
    "name": "Unicórnio",
    "name_en": "Unicorn",
    "size": "Grande",
    "size_en": "Large",
    "type": "Celestial",
    "type_en": "celestial",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 12,
    "hp_max": 67,
    "hp_formula": "9d10+18",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 15,
        "dex": 14,
        "int": 11,
        "str": 18,
        "wis": 17
      },
      "actions": [
        {
          "description": "O unicórnio faz dois ataques: um com os cascos e outro com o chifre.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano de concussão.",
          "name": "Cascos"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "1d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (1d8 + 4) de dano perfurante.",
          "name": "Buzina"
        },
        {
          "description": "O unicórnio toca outra criatura com seu chifre. O alvo recupera magicamente 11 (2d8 + 2) pontos de vida. Além disso, o toque remove todas as doenças e neutraliza todos os venenos que afetam o alvo.",
          "name": "Toque de Cura (3/dia)"
        },
        {
          "description": "O unicórnio se teletransporta magicamente e até três criaturas voluntárias que ele pode ver a até 1,5 metro dele, junto com qualquer equipamento que estejam vestindo ou carregando, para um local com o qual o unicórnio esteja familiarizado, a até 1,6 km de distância.",
          "name": "Teletransporte (1/dia)"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Paralisado",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "Celestial",
        "Élfico",
        "Silvestre",
        "telepathy 60 ft."
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O unicórnio faz um ataque com os cascos.",
            "name": "Cascos"
          },
          {
            "cost": 2,
            "description": "O unicórnio cria um campo mágico e cintilante em torno de si ou de outra criatura que ele possa ver a até 18 metros dele. O alvo ganha +2 de bônus na CA até o final do próximo turno do unicórnio.",
            "name": "Escudo Cintilante (custa 2 ações)"
          },
          {
            "cost": 3,
            "description": "O unicórnio recupera magicamente 11 (2d8 + 2) pontos de vida.",
            "name": "Curar a si mesmo (custa 3 ações)"
          }
        ],
        "description": "O Unicórnio pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 13
      },
      "speed": {
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "Se o unicórnio se mover pelo menos 6 metros em linha reta em direção a um alvo e então acertá-lo com um ataque de chifre no mesmo turno, o alvo sofre 9 (2d8) de dano perfurante extra. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 15 ou será derrubado.",
          "name": "Cobrar"
        },
        {
          "description": "A habilidade inata de conjuração do unicórnio é Carisma (resistência ao feitiço CD 14). O unicórnio pode conjurar inatamente os seguintes feitiços, sem necessidade de componentes:\n\nÀ vontade: detectar o mal e o bem, druidismo, passar sem deixar rastros\n1/dia cada: acalmar emoções, dissipar o mal e o bem, emaranhar",
          "name": "Feitiço Inato"
        },
        {
          "description": "O unicórnio tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Os ataques com armas do unicórnio são mágicos.",
          "name": "Armas Mágicas"
        }
      ]
    }
  },
  {
    "id": "srd:vampire-spawn",
    "name": "Cria de Vampiros",
    "name_en": "Vampire Spawn",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 15,
    "hp_max": 82,
    "hp_formula": "11d8+33",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 16,
        "dex": 16,
        "int": 11,
        "str": 16,
        "wis": 10
      },
      "actions": [
        {
          "description": "O vampiro faz dois ataques, dos quais apenas um pode ser um ataque de mordida.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 61,
          "description": "Ataque Corpo a Corpo com Arma: +6 para atingir, alcance 1,5 m, uma criatura voluntária ou uma criatura que esteja agarrada pelo vampiro, incapacitada ou contida. Acerto: 6 (1d6 + 3) de dano perfurante mais 7 (2d6) de dano necrótico. O máximo de pontos de vida do alvo é reduzido em uma quantidade igual ao dano necrótico recebido, e o vampiro recupera pontos de vida iguais a essa quantidade. A redução dura até o alvo terminar um descanso longo. O alvo morre se este efeito reduzir seu máximo de pontos de vida a 0.",
          "name": "Morder"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d4+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +6 para acertar, alcance 1,5 m, uma criatura. Acerto: 8 (2d4 + 3) de dano cortante. Em vez de causar dano, o vampiro pode agarrar o alvo (CD 13 para escapar).",
          "name": "Garras"
        }
      ],
      "damage_resistances": [
        "necrotic; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "the languages it knew in life"
      ],
      "saving_throws": {
        "dex": 6,
        "wis": 3
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 13
      },
      "skills": {
        "Percepção": 3,
        "Furtividade": 6
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O vampiro recupera 10 pontos de vida no início do seu turno se tiver pelo menos 1 ponto de vida e não estiver sob a luz do sol ou em água corrente. Se o vampiro sofrer dano radiante ou de água benta, esta característica não funciona no início do próximo turno do vampiro.",
          "name": "Regeneração"
        },
        {
          "description": "O vampiro pode escalar superfícies difíceis, inclusive tetos de cabeça para baixo, sem precisar fazer um teste de habilidade.",
          "name": "Escalada de aranha"
        },
        {
          "description": "O vampiro tem as seguintes falhas:\nProibição. O vampiro não pode entrar numa residência sem convite de um dos ocupantes.\nPrejudicado por água corrente. O vampiro sofre 20 de dano ácido quando termina seu turno em água corrente.\nAposte no coração. O vampiro é destruído se uma arma perfurante feita de madeira for cravada em seu coração enquanto ele estiver incapacitado em seu local de descanso.\nHipersensibilidade à luz solar. O vampiro sofre 20 de dano radiante quando inicia seu turno sob a luz do sol. Enquanto estiver sob a luz do sol, tem desvantagem em jogadas de ataque e testes de habilidade.",
          "name": "Fraquezas dos Vampiros"
        }
      ]
    }
  },
  {
    "id": "srd:water-elemental",
    "name": "Elemental da Água",
    "name_en": "Water Elemental",
    "size": "Grande",
    "size_en": "Large",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 14,
    "hp_max": 114,
    "hp_formula": "12d10+48",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 18,
        "dex": 14,
        "int": 5,
        "str": 18,
        "wis": 10
      },
      "actions": [
        {
          "description": "O elemental faz dois ataques violentos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano de concussão.",
          "name": "Bater"
        },
        {
          "description": "Cada criatura no espaço do elemental deve realizar um teste de resistência de Força CD 15. Em caso de falha, o alvo sofre 13 (2d8 + 4) de dano de concussão. Se for Grande ou menor, ele também será agarrado (CD 14 para escapar). Até que esta luta termine, o alvo fica contido e incapaz de respirar, a menos que consiga respirar água. Se o teste de resistência for bem sucedido, o alvo é empurrado para fora do espaço do elemental.\nO elemental pode agarrar uma criatura Grande ou até duas criaturas Médias ou menores ao mesmo tempo. No início de cada turno do elemental, cada alvo agarrado por ele sofre 13 (2d8 + 4) de dano de concussão. Uma criatura a até 1,5 metro do elemental pode puxar uma criatura ou objeto para fora dele realizando uma ação para fazer uma Força CD 14 e obtendo sucesso.",
          "name": "Whelm (Recarga 4-6)"
        }
      ],
      "condition_immunities": [
        "Exausto",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Envenenado",
        "Caído",
        "Impedido",
        "Inconsciente"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "acid; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Aquan"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "natação": 90,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O elemental pode entrar no espaço de uma criatura hostil e parar ali. Ele pode se mover através de um espaço tão estreito quanto 1 polegada de largura sem apertar.",
          "name": "Forma de água"
        },
        {
          "description": "Se o elemental sofrer dano de frio, ele congela parcialmente; sua velocidade é reduzida em 6 metros até o final do próximo turno.",
          "name": "Congelar"
        }
      ]
    }
  },
  {
    "id": "srd:werebear",
    "name": "Homem Urso",
    "name_en": "Werebear",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 10,
    "hp_max": 135,
    "hp_formula": "18d8+54",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 17,
        "dex": 10,
        "int": 11,
        "str": 19,
        "wis": 12
      },
      "actions": [
        {
          "description": "Na forma de urso, o homem-urso faz dois ataques de garras. Na forma humanóide, ele faz dois ataques com machado grande. Na forma híbrida, pode atacar como um urso ou um humanóide.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d10+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 15 (2d10 + 4) de dano perfurante. Se o alvo for um humanóide, ele deve ser bem sucedido em um teste de resistência de Constituição CD 14 ou será amaldiçoado com licantropia.",
          "name": "Mordida (somente forma de urso ou híbrida)"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano cortante.",
          "name": "Garra (somente forma de urso ou híbrida)"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "1d12+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (1d12 + 4) de dano cortante.",
          "name": "Greataxe (somente forma humanóide ou híbrida)"
        }
      ],
      "damage_immunities": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Common (can't speak in bear form)"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 17
      },
      "skills": {
        "Percepção": 7
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O homem-urso pode usar sua ação para se transformar em um híbrido grande urso-humanóide ou em um grande urso, ou voltar à sua forma verdadeira, que é humanóide. Suas estatísticas, exceto tamanho e AC, são as mesmas em cada formulário. Qualquer equipamento dele. está vestindo ou carregando não é transformado. Ele reverte à sua verdadeira forma se morrer.",
          "name": "Metamorfo"
        },
        {
          "description": "O homem-urso tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        }
      ]
    }
  },
  {
    "id": "srd:wraith",
    "name": "Espectro",
    "name_en": "Wraith",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 13,
    "hp_max": 67,
    "hp_formula": "9d8+27",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 16,
        "dex": 16,
        "int": 12,
        "str": 6,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "4d8+3",
              "type": "necrotic"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +6 para acertar, alcance 1,5 m, uma criatura. Acerto: 21 (4d8 + 3) de dano necrótico. O alvo deve ser bem sucedido em um teste de resistência de Constituição CD 14 ou seu máximo de pontos de vida será reduzido em uma quantidade igual ao dano sofrido. Esta redução dura até o alvo terminar um descanso longo. O alvo morre se este efeito reduzir seu máximo de pontos de vida a 0.",
          "name": "Dreno de Vida"
        },
        {
          "description": "O espectro tem como alvo um humanóide a até 3 metros dele que esteja morto há não mais que 1 minuto e tenha morrido violentamente. O espírito do alvo surge como um espectro no espaço de seu cadáver ou no espaço desocupado mais próximo. O espectro está sob o controle do espectro. O espectro não pode ter mais do que sete espectros sob seu controle ao mesmo tempo.",
          "name": "Criar Espectro"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Envenenado",
        "Caído",
        "Impedido"
      ],
      "damage_immunities": [
        "necrótico",
        "veneno"
      ],
      "damage_resistances": [
        "ácido",
        "frio",
        "fogo",
        "elétrico",
        "thunder; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "the languages it knew in life"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 12
      },
      "speed": {
        "voo": 60,
        "pairar": true
      },
      "traits": [
        {
          "description": "O espectro pode se mover através de outras criaturas e objetos como se fossem terrenos difíceis. Ele sofre 5 (1d10) de dano de força se terminar seu turno dentro de um objeto.",
          "name": "Movimento Incorpóreo"
        },
        {
          "description": "Enquanto estiver sob a luz do sol, o espectro tem desvantagem nas jogadas de ataque, bem como nos testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Sensibilidade à luz solar"
        }
      ]
    }
  },
  {
    "id": "srd:xorn",
    "name": "Xorn",
    "name_en": "Xorn",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "5",
    "cr_numeric": 5.0,
    "armor_class": 19,
    "hp_max": 73,
    "hp_formula": "7d8+42",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 22,
        "dex": 10,
        "int": 11,
        "str": 17,
        "wis": 10
      },
      "actions": [
        {
          "description": "O xorn faz três ataques de garra e um ataque de mordida.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "3d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (3d6 + 3) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano cortante.",
          "name": "Garra"
        }
      ],
      "damage_resistances": [
        "piercing and slashing from nonmagical attacks not made with adamantine weapons"
      ],
      "languages": [
        "Terran"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 16,
        "percepção sísmica": 60
      },
      "skills": {
        "Percepção": 6,
        "Furtividade": 3
      },
      "speed": {
        "escavação": 20,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O xorn pode escavar através de terra e pedra não-mágica e não trabalhada. Ao fazer isso, o xorn não perturba o material através do qual se move.",
          "name": "Deslizamento da Terra"
        },
        {
          "description": "O xorn tem vantagem em testes de Destreza (Furtividade) feitos para se esconder em terreno rochoso.",
          "name": "Camuflagem de Pedra"
        },
        {
          "description": "O xorn pode identificar, através do cheiro, a localização de metais e pedras preciosas, como moedas e pedras preciosas, em um raio de 18 metros dele.",
          "name": "Sentido do Tesouro"
        }
      ]
    }
  },
  {
    "id": "srd:chimera",
    "name": "Quimera",
    "name_en": "Chimera",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "6",
    "cr_numeric": 6.0,
    "armor_class": 14,
    "hp_max": 114,
    "hp_formula": "12d10+48",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 19,
        "dex": 11,
        "int": 3,
        "str": 19,
        "wis": 14
      },
      "actions": [
        {
          "description": "A quimera faz três ataques: um com a mordida, outro com os chifres e outro com as garras. Quando seu sopro de fogo está disponível, ele pode usá-lo no lugar de sua mordida ou chifres.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "1d12+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (1d12 + 4) de dano de concussão.",
          "name": "Chifres"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.",
          "name": "Garras"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "7d8+0",
              "type": "fire"
            }
          ],
          "description": "A cabeça do dragão exala fogo em um cone de 4,5 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 15, sofrendo 31 (7d8) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro de Fogo (Recarga 5-6)"
        }
      ],
      "languages": [
        "understands Draconic but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 18
      },
      "skills": {
        "Percepção": 8
      },
      "speed": {
        "voo": 60,
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:drider",
    "name": "Drider",
    "name_en": "Drider",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "6",
    "cr_numeric": 6.0,
    "armor_class": 19,
    "hp_max": 123,
    "hp_formula": "13d10+52",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 18,
        "dex": 16,
        "int": 13,
        "str": 16,
        "wis": 14
      },
      "actions": [
        {
          "description": "O drider faz três ataques, seja com sua espada longa ou com seu arco longo. Pode substituir um desses ataques por um ataque de mordida.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +6 para acertar, alcance 1,5 m, uma criatura. Acerto: 2 (1d4) de dano perfurante mais 9 (2d8) de dano venenoso.",
          "name": "Morder"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d8 + 3) de dano cortante, ou 8 (1d10 + 3) de dano cortante se usado com as duas mãos.",
          "name": "Espada Longa"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +6 para acertar, alcance 150/600 pés, um alvo. Acerto: 7 (1d8 + 3) de dano perfurante mais 4 (1d8) de dano venenoso.",
          "name": "Arco longo"
        }
      ],
      "languages": [
        "Élfico",
        "Subcomum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 15
      },
      "skills": {
        "Percepção": 5,
        "Furtividade": 9
      },
      "speed": {
        "escalada": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O drider tem vantagem nos testes de resistência contra ser enfeitiçado, e a magia não pode fazer o drider dormir.",
          "name": "Ancestrais Feéricos"
        },
        {
          "description": "A habilidade inata de conjuração do drider é Sabedoria (resistência de magia CD 13). O drider pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\nÀ vontade: luzes dançantes\n1/dia cada: escuridão, fogo das fadas",
          "name": "Feitiço Inato"
        },
        {
          "description": "O drider pode escalar superfícies difíceis, inclusive tetos de cabeça para baixo, sem precisar fazer um teste de habilidade.",
          "name": "Escalada de aranha"
        },
        {
          "description": "Enquanto estiver sob a luz do sol, o drider tem desvantagem nas jogadas de ataque, bem como nos testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Sensibilidade à luz solar"
        },
        {
          "description": "O drider ignora as restrições de movimento causadas pela teia.",
          "name": "Caminhante da Web"
        }
      ]
    }
  },
  {
    "id": "srd:invisible-stalker",
    "name": "Perseguidor Invisível",
    "name_en": "Invisible Stalker",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "6",
    "cr_numeric": 6.0,
    "armor_class": 14,
    "hp_max": 104,
    "hp_formula": "16d8+32",
    "initiative_modifier": 4,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 14,
        "dex": 19,
        "int": 10,
        "str": 16,
        "wis": 15
      },
      "actions": [
        {
          "description": "O perseguidor faz dois ataques violentos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano de concussão.",
          "name": "Bater"
        }
      ],
      "condition_immunities": [
        "Exausto",
        "Agarrado",
        "Paralisado",
        "Petrificado",
        "Envenenado",
        "Caído",
        "Impedido",
        "Inconsciente"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Auran",
        "understands Common but doesn't speak it"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 18
      },
      "skills": {
        "Percepção": 8,
        "Furtividade": 10
      },
      "speed": {
        "voo": 50,
        "pairar": true,
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "O perseguidor é invisível.",
          "name": "Invisibilidade"
        },
        {
          "description": "O perseguidor recebe uma presa de seu invocador. O perseguidor sabe a direção e a distância até sua presa, desde que os dois estejam no mesmo plano de existência. O perseguidor também sabe a localização de seu invocador.",
          "name": "Rastreador impecável"
        }
      ]
    }
  },
  {
    "id": "srd:mage",
    "name": "Mago",
    "name_en": "Mage",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "6",
    "cr_numeric": 6.0,
    "armor_class": 12,
    "hp_max": 40,
    "hp_formula": "9d8",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 11,
        "dex": 14,
        "int": 17,
        "str": 9,
        "wis": 12
      },
      "actions": [
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma corpo a corpo ou de longo alcance: +5 para acertar, alcance 1,5 m ou alcance de 6/18 m, um alvo. Acerto: 4 (1d4 + 2) de dano perfurante.",
          "name": "Punhal"
        }
      ],
      "languages": [
        "any four languages"
      ],
      "saving_throws": {
        "int": 6,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 11
      },
      "skills": {
        "Arcanismo": 6,
        "História": 6
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O mago é um conjurador de 9º nível. Sua habilidade de lançar feitiços é Inteligência (CD de resistência de feitiço 14, +6 para acertar com ataques de feitiço). O mago tem os seguintes feitiços de mago preparados:\n\n* Truques (à vontade): raio de fogo, luz, mão mágica, prestidigitação\n* 1º nível (4 slots): detectar magia, armadura mágica, míssil mágico, escudo\n* 2º nível (3 slots): passo enevoado, sugestão\n* 3º nível (3 espaços): contrafeitiço, bola de fogo, mosca\n* 4º nível (3 slots): maior invisibilidade, tempestade de gelo\n* 5º nível (1 slot): cone de frio",
          "name": "Feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:mammoth",
    "name": "Mamute",
    "name_en": "Mammoth",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Fera",
    "type_en": "beast",
    "cr": "6",
    "cr_numeric": 6.0,
    "armor_class": 13,
    "hp_max": 126,
    "hp_formula": "11d12+55",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 21,
        "dex": 9,
        "int": 3,
        "str": 24,
        "wis": 11
      },
      "actions": [
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "4d8+7",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 metros, um alvo. Acerto: 25 (4d8 + 7) de dano perfurante.",
          "name": "Sangrento"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "4d10+7",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1,5 m, uma criatura caída. Acerto: 29 (4d10 + 7) de dano de concussão.",
          "name": "Pisar"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o mamute se mover pelo menos 6 metros em linha reta em direção a uma criatura e então acertá-la com um ataque sangrento no mesmo turno, o alvo deve ser bem sucedido em um teste de resistência de Força CD 18 ou será derrubado. Se o alvo estiver caído, o mamute pode fazer um ataque de pisada contra ele como uma ação bônus.",
          "name": "Carga de atropelamento"
        }
      ]
    }
  },
  {
    "id": "srd:medusa",
    "name": "Medusa",
    "name_en": "Medusa",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "6",
    "cr_numeric": 6.0,
    "armor_class": 15,
    "hp_max": 127,
    "hp_formula": "17d8+51",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 16,
        "dex": 15,
        "int": 12,
        "str": 10,
        "wis": 13
      },
      "actions": [
        {
          "description": "A medusa faz três ataques corpo a corpo - um com seu cabelo de cobra e dois com sua espada curta - ou dois ataques à distância com seu arco longo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, uma criatura. Acerto: 4 (1d4 + 2) de dano perfurante mais 14 (4d6) de dano venenoso.",
          "name": "Cabelo de cobra"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "1d6+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.",
          "name": "Espada curta"
        },
        {
          "attack_bonus": 5,
          "damage": [
            {
              "dice": "2d6+0",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +5 para acertar, alcance 150/600 pés, um alvo. Acerto: 6 (1d8 + 2) de dano perfurante mais 7 (2d6) de dano venenoso.",
          "name": "Arco longo"
        }
      ],
      "languages": [
        "Comum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Enganação": 5,
        "Intuição": 4,
        "Percepção": 4,
        "Furtividade": 5
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Quando uma criatura que pode ver os olhos da medusa começa seu turno a até 9 metros da medusa, a medusa pode forçá-la a fazer um teste de resistência de Constituição CD 14 se a medusa não estiver incapacitada e puder ver a criatura. Se o teste de resistência falhar por 5 ou mais, a criatura fica instantaneamente petrificada. Caso contrário, uma criatura que falhe no teste começa a virar pedra e fica impedida. A criatura contida deve repetir o teste de resistência no final do seu próximo turno, ficando petrificada em caso de falha ou encerrando o efeito em caso de sucesso. A petrificação dura até que a criatura seja libertada pelo feitiço de restauração maior ou outra magia.\nA menos que seja surpreendida, uma criatura pode desviar os olhos para evitar o teste de resistência no início do seu turno. Se a criatura fizer isso, ela não poderá ver a medusa até o início de seu próximo turno, quando poderá desviar os olhos novamente. Se a criatura olhar para a medusa nesse meio tempo, ela deverá fazer um teste imediatamente.\nSe a medusa se vê refletida em uma superfície polida a até 9 metros dela e em uma área de luz brilhante, a medusa é, devido à sua maldição, afetada por seu próprio olhar.",
          "name": "Olhar Petrificante"
        }
      ]
    }
  },
  {
    "id": "srd:vrock",
    "name": "Vrock",
    "name_en": "Vrock",
    "size": "Grande",
    "size_en": "Large",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "6",
    "cr_numeric": 6.0,
    "armor_class": 15,
    "hp_max": 104,
    "hp_formula": "11d10+44",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 8,
        "con": 18,
        "dex": 15,
        "int": 8,
        "str": 17,
        "wis": 13
      },
      "actions": [
        {
          "description": "O vrock faz dois ataques: um com o bico e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d6 + 3) de dano perfurante.",
          "name": "Bico"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d10+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Sucesso: 14 (2d10 + 3) de dano cortante.",
          "name": "Garras"
        },
        {
          "description": "Uma nuvem de esporos tóxicos com 4,5 metros de raio se estende do vrock. Os esporos se espalharam pelos cantos. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 14 ou ficará envenenada. Enquanto estiver envenenado desta forma, o alvo sofre 5 (1d10) de dano de veneno no início de cada um de seus turnos. Um alvo pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso. Esvaziar um frasco de água benta no alvo também encerra o efeito nele.",
          "name": "Esporos (Recarga 6)"
        },
        {
          "description": "O vrock emite um grito horrível. Cada criatura a até 6 metros dele que possa ouvi-lo e que não seja um demônio deve ser bem sucedida em um teste de resistência de Constituição CD 14 ou ficará atordoada até o final do próximo turno do vrock.",
          "name": "Grito impressionante (1/dia)"
        },
        {
          "description": "O demônio escolhe o que invocar e tenta uma invocação mágica.\nUm vrock tem 30% de chance de invocar 2d4 dretches ou um vrock.\nUm demônio invocado aparece em um espaço desocupado a até 18 metros de seu invocador, age como um aliado de seu invocador e não pode invocar outros demônios. Ela permanece por 1 minuto, até que ela ou seu invocador morra, ou até que seu invocador a dispense como uma ação.",
          "name": "Variante: Convocar Demônio (1/Dia)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "frio",
        "fogo",
        "lightning; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Abissal",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "cha": 2,
        "dex": 5,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 11
      },
      "speed": {
        "voo": 60,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O vrock tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:wyvern",
    "name": "Wyvern",
    "name_en": "Wyvern",
    "size": "Grande",
    "size_en": "Large",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "6",
    "cr_numeric": 6.0,
    "armor_class": 13,
    "hp_max": 110,
    "hp_formula": "13d10+39",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 6,
        "con": 16,
        "dex": 10,
        "int": 5,
        "str": 19,
        "wis": 12
      },
      "actions": [
        {
          "description": "O wyvern faz dois ataques: um com a mordida e outro com o ferrão. Enquanto voa, ele pode usar suas garras no lugar de outro ataque.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 metros, uma criatura. Acerto: 11 (2d6 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano cortante.",
          "name": "Garras"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 metros, uma criatura. Acerto: 11 (2d6 + 4) de dano perfurante. O alvo deve realizar um teste de resistência de Constituição CD 15, sofrendo 24 (7d6) de dano de veneno se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Ferrão"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "voo": 80,
        "deslocamento": 20
      }
    }
  },
  {
    "id": "srd:young-brass-dragon",
    "name": "Dragão de Latão Jovem",
    "name_en": "Young Brass Dragon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "6",
    "cr_numeric": 6.0,
    "armor_class": 17,
    "hp_max": 110,
    "hp_formula": "13d10+39",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 17,
        "dex": 10,
        "int": 12,
        "str": 19,
        "wis": 11
      },
      "actions": [
        {
          "description": "O dragão faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d10+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d10 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "12d6+0",
              "type": "fire"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro de Fogo.** O dragão exala fogo em uma linha de 12 metros com 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 14, sofrendo 42 (12d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração do Sono.** O dragão exala gás do sono em um cone de 9 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 14 ou ficará inconsciente por 5 minutos. Este efeito termina para uma criatura se ela sofrer dano ou se alguém usar uma ação para acordá-la.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 5,
        "con": 6,
        "dex": 3,
        "wis": 3
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "visão no escuro": 120,
        "percepção passiva": 16
      },
      "skills": {
        "Percepção": 6,
        "Persuasão": 5,
        "Furtividade": 3
      },
      "speed": {
        "escavação": 20,
        "voo": 80,
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:young-white-dragon",
    "name": "Jovem Dragão Branco",
    "name_en": "Young White Dragon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "6",
    "cr_numeric": 6.0,
    "armor_class": 17,
    "hp_max": 133,
    "hp_formula": "14d10+56",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 18,
        "dex": 10,
        "int": 6,
        "str": 18,
        "wis": 11
      },
      "actions": [
        {
          "description": "O dragão faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d10+1d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d10 + 4) de dano perfurante mais 4 (1d8) de dano de frio.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "10d8+0",
              "type": "cold"
            }
          ],
          "description": "O dragão exala uma explosão gelada em um cone de 9 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 15, sofrendo 45 (10d8) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Frio (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "frio"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 4,
        "con": 7,
        "dex": 3,
        "wis": 3
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "visão no escuro": 120,
        "percepção passiva": 16
      },
      "skills": {
        "Percepção": 6,
        "Furtividade": 3
      },
      "speed": {
        "escavação": 20,
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode se mover e escalar superfícies geladas sem precisar fazer um teste de habilidade. Além disso, terreno difícil composto de gelo ou neve não custa movimento extra.",
          "name": "Caminhada no Gelo"
        }
      ]
    }
  },
  {
    "id": "srd:giant-ape",
    "name": "Macaco Gigante",
    "name_en": "Giant Ape",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Fera",
    "type_en": "beast",
    "cr": "7",
    "cr_numeric": 7.0,
    "armor_class": 12,
    "hp_max": 157,
    "hp_formula": "15d12+60",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 18,
        "dex": 14,
        "int": 7,
        "str": 23,
        "wis": 12
      },
      "actions": [
        {
          "description": "O macaco faz dois ataques com os punhos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "3d10+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 metros, um alvo. Acerto: 22 (3d10 + 6) de dano de concussão.",
          "name": "Punho"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "7d6+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque com arma de longo alcance: +9 para acertar, alcance 50/100 pés, um alvo. Acerto: 30 (7d6 + 6) de dano de concussão.",
          "name": "Pedra"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14
      },
      "skills": {
        "Atletismo": 9,
        "Percepção": 4
      },
      "speed": {
        "escalada": 40,
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:oni",
    "name": "Oni",
    "name_en": "Oni",
    "size": "Grande",
    "size_en": "Large",
    "type": "Gigante",
    "type_en": "giant",
    "cr": "7",
    "cr_numeric": 7.0,
    "armor_class": 16,
    "hp_max": 110,
    "hp_formula": "13d10+39",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 16,
        "dex": 11,
        "int": 14,
        "str": 19,
        "wis": 12
      },
      "actions": [
        {
          "description": "O oni faz dois ataques, seja com suas garras ou com sua glaive.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "1d8+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (1d8 + 4) de dano cortante.",
          "name": "Garra (apenas formulário Oni)"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d10+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d10 + 4) de dano cortante, ou 9 (1d10 + 4) de dano cortante na forma Pequena ou Média.",
          "name": "Gládio"
        },
        {
          "description": "O oni se transforma magicamente em um humanóide Pequeno ou Médio, em um gigante Grande ou de volta à sua forma verdadeira. Além do tamanho, suas estatísticas são as mesmas em todos os formulários. O único equipamento que é transformado é o seu glaive, que encolhe para poder ser manejado em forma humanóide. Se o oni morrer, ele volta à sua forma verdadeira e seu glaive volta ao tamanho normal.",
          "name": "Alterar forma"
        }
      ],
      "languages": [
        "Comum",
        "Gigante"
      ],
      "saving_throws": {
        "cha": 5,
        "con": 6,
        "dex": 3,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Arcanismo": 5,
        "Enganação": 8,
        "Percepção": 4
      },
      "speed": {
        "voo": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A habilidade inata de conjuração do oni é Carisma (resistência ao feitiço CD 13). O oni pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\n\nÀ vontade: escuridão, invisibilidade\n1/dia cada: encantar pessoa, cone de frio, forma gasosa, dormir",
          "name": "Feitiço Inato"
        },
        {
          "description": "Os ataques com armas do oni são mágicos.",
          "name": "Armas Mágicas"
        },
        {
          "description": "O oni recupera 10 pontos de vida no início do seu turno se tiver pelo menos 1 ponto de vida.",
          "name": "Regeneração"
        }
      ]
    }
  },
  {
    "id": "srd:shield-guardian",
    "name": "Guardião do Escudo",
    "name_en": "Shield Guardian",
    "size": "Grande",
    "size_en": "Large",
    "type": "Constructo",
    "type_en": "construct",
    "cr": "7",
    "cr_numeric": 7.0,
    "armor_class": 17,
    "hp_max": 142,
    "hp_formula": "15d10+60",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 3,
        "con": 18,
        "dex": 8,
        "int": 7,
        "str": 18,
        "wis": 10
      },
      "actions": [
        {
          "description": "O guardião faz dois ataques com os punhos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano de concussão.",
          "name": "Punho"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado",
        "Paralisado",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "understands commands given in any language but can't speak"
      ],
      "reactions": [
        {
          "description": "Quando uma criatura faz um ataque contra o usuário do amuleto do guardião, o guardião concede um bônus de +2 à CA do usuário se o guardião estiver a até 1,5 metro do usuário.",
          "name": "Escudo"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 10,
        "visão no escuro": 60,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O guardião do escudo está magicamente ligado a um amuleto. Enquanto o guardião e seu amuleto estiverem no mesmo plano de existência, o usuário do amuleto pode chamar telepaticamente o guardião para viajar até ele, e o guardião sabe a distância e a direção do amuleto. Se o guardião estiver a até 18 metros do usuário do amuleto, metade de qualquer dano que o usuário sofrer (arredondado para cima) será transferido para o guardião.",
          "name": "Vinculado"
        },
        {
          "description": "O guardião do escudo recupera 10 pontos de vida no início do seu turno se tiver pelo menos 1 golpe. apontar.",
          "name": "Regeneração"
        },
        {
          "description": "Um conjurador que usa o amuleto do guardião do escudo pode fazer com que o guardião armazene uma magia de 4º nível ou inferior. Para fazer isso, o usuário deve lançar o feitiço no guardião. O feitiço não tem efeito, mas é armazenado no guardião. Quando comandado pelo usuário ou quando surge uma situação que foi predefinida pelo conjurador, o guardião lança o feitiço armazenado com quaisquer parâmetros definidos pelo conjurador original, não necessitando de componentes. Quando a magia é lançada ou uma nova magia é armazenada, qualquer magia armazenada anteriormente é perdida.",
          "name": "Armazenamento de feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:stone-giant",
    "name": "Gigante de Pedra",
    "name_en": "Stone Giant",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Gigante",
    "type_en": "giant",
    "cr": "7",
    "cr_numeric": 7.0,
    "armor_class": 17,
    "hp_max": 126,
    "hp_formula": "11d12+55",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 9,
        "con": 20,
        "dex": 15,
        "int": 10,
        "str": 23,
        "wis": 12
      },
      "actions": [
        {
          "description": "O gigante faz dois grandes ataques com tacos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "3d8+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 4,5 metros, um alvo. Acerto: 19 (3d8 + 6) de dano de concussão.",
          "name": "Grande clube"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "4d10+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque com arma de longo alcance: +9 para acertar, alcance 60/240 pés, um alvo. Acerto: 28 (4d10 + 6) de dano de concussão. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 17 ou será derrubado.",
          "name": "Pedra"
        }
      ],
      "languages": [
        "Gigante"
      ],
      "reactions": [
        {
          "description": "Se uma pedra ou objeto similar for arremessado contra o gigante, o gigante pode, com um teste de resistência bem sucedido de Destreza CD 10, pegar o míssil e não sofrer nenhum dano de concussão dele.",
          "name": "Captura de rocha"
        }
      ],
      "saving_throws": {
        "con": 8,
        "dex": 5,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "Atletismo": 12,
        "Percepção": 4
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O gigante tem vantagem em testes de Destreza (Furtividade) feitos para se esconder em terreno rochoso.",
          "name": "Camuflagem de Pedra"
        }
      ]
    }
  },
  {
    "id": "srd:young-black-dragon",
    "name": "Jovem Dragão Negro",
    "name_en": "Young Black Dragon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "7",
    "cr_numeric": 7.0,
    "armor_class": 18,
    "hp_max": 127,
    "hp_formula": "15d10+45",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 17,
        "dex": 14,
        "int": 12,
        "str": 19,
        "wis": 11
      },
      "actions": [
        {
          "description": "O dragão faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d10+1d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d10 + 4) de dano perfurante mais 4 (1d8) de dano ácido.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "11d8+0",
              "type": "acid"
            }
          ],
          "description": "O dragão exala ácido em uma linha de 9 metros e 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 14, sofrendo 49 (11d8) de dano de ácido se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Ácido (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "ácido"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 5,
        "con": 6,
        "dex": 5,
        "wis": 3
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "visão no escuro": 120,
        "percepção passiva": 16
      },
      "skills": {
        "Percepção": 6,
        "Furtividade": 5
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:young-copper-dragon",
    "name": "Dragão de Cobre Jovem",
    "name_en": "Young Copper Dragon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "7",
    "cr_numeric": 7.0,
    "armor_class": 17,
    "hp_max": 119,
    "hp_formula": "14d10+42",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 17,
        "dex": 12,
        "int": 16,
        "str": 19,
        "wis": 13
      },
      "actions": [
        {
          "description": "O dragão faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d10+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d10 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "9d8+0",
              "type": "acid"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro Ácido.** O dragão exala ácido em uma linha de 12 metros com 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 14, sofrendo 40 (9d8) de dano de ácido se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração lenta.** O dragão exala gás em um cone de 9 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 14. Se falhar, a criatura não pode usar reações, sua velocidade é reduzida à metade e ela não pode realizar mais de um ataque por turno. Além disso, a criatura pode usar uma ação ou uma ação bônus no seu turno, mas não ambas. Esses efeitos duram 1 minuto. A criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma com um teste de resistência bem-sucedido.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "ácido"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 5,
        "con": 6,
        "dex": 4,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "visão no escuro": 120,
        "percepção passiva": 17
      },
      "skills": {
        "Enganação": 5,
        "Percepção": 7,
        "Furtividade": 4
      },
      "speed": {
        "escalada": 40,
        "voo": 80,
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:assassin",
    "name": "Assassino",
    "name_en": "Assassin",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "8",
    "cr_numeric": 8.0,
    "armor_class": 15,
    "hp_max": 78,
    "hp_formula": "12d8+24",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 10,
        "con": 14,
        "dex": 16,
        "int": 13,
        "str": 11,
        "wis": 11
      },
      "actions": [
        {
          "description": "O assassino faz dois ataques com espadas curtas.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 1,5 m, um alvo. Acerto: 6 (1d6 + 3) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 15, sofrendo 24 (7d6) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso.",
          "name": "Espada curta"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +6 para acertar, alcance 80/320 pés, um alvo. Acerto: 7 (1d8 + 3) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 15, sofrendo 24 (7d6) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso.",
          "name": "Besta Leve"
        }
      ],
      "damage_resistances": [
        "veneno"
      ],
      "languages": [
        "Thieves' cant plus any two languages"
      ],
      "saving_throws": {
        "dex": 6,
        "int": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Acrobacia": 6,
        "Enganação": 3,
        "Percepção": 3,
        "Furtividade": 9
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Durante seu primeiro turno, o assassino tem vantagem nas jogadas de ataque contra qualquer criatura que não tenha jogado o turno. Qualquer acerto obtido pelo assassino contra uma criatura surpresa é um acerto crítico.",
          "name": "Assassinar"
        },
        {
          "description": "Se o assassino for submetido a um efeito que lhe permita realizar um teste de resistência de Destreza para sofrer apenas metade do dano, o assassino não sofrerá nenhum dano se tiver sucesso no teste de resistência, e apenas metade do dano se falhar.",
          "name": "Evasão"
        },
        {
          "description": "O assassino causa 13 (4d6) de dano extra quando atinge um alvo com um ataque com arma e tem vantagem na jogada de ataque, ou quando o alvo está a até 1,5 metro de um aliado do assassino que não está incapacitado e o assassino não tem desvantagem na jogada de ataque.",
          "name": "Ataque Furtivo (1/Turno)"
        }
      ]
    }
  },
  {
    "id": "srd:cloaker",
    "name": "Capa",
    "name_en": "Cloaker",
    "size": "Grande",
    "size_en": "Large",
    "type": "Aberração",
    "type_en": "aberration",
    "cr": "8",
    "cr_numeric": 8.0,
    "armor_class": 14,
    "hp_max": 78,
    "hp_formula": "12d10+12",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 14,
        "con": 12,
        "dex": 15,
        "int": 13,
        "str": 17,
        "wis": 12
      },
      "actions": [
        {
          "description": "O manto faz dois ataques: um com a mordida e outro com a cauda.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "2d6+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +6 para acertar, alcance 1,5 m, uma criatura. Acerto: 10 (2d6 + 3) de dano perfurante e, se o alvo for Grande ou menor, o manto é anexado a ele. Se o manto tiver vantagem contra o alvo, o manto é preso à cabeça do alvo, e o alvo fica cego e incapaz de respirar enquanto o manto estiver preso. Enquanto anexado, o cloaker pode fazer este ataque apenas contra o alvo e tem vantagem na jogada de ataque. O manto pode se separar gastando 1,5 metro de seu movimento. Uma criatura, incluindo o alvo, pode realizar sua ação para separar o manto sendo bem-sucedida em um teste de Força CD 16.",
          "name": "Morder"
        },
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d8+3",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +6 para acertar, alcance 3 metros, uma criatura. Acerto: 7 (1d8 + 3) de dano cortante.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura a até 18 metros do manto que possa ouvir seu gemido e que não seja uma aberração deve ser bem sucedida em um teste de resistência de Sabedoria CD 13 ou ficará assustada até o final do próximo turno do manto. Se o teste de resistência de uma criatura for bem-sucedido, a criatura ficará imune ao gemido do manto pelas próximas 24 horas.",
          "name": "Gemer"
        },
        {
          "description": "O manto cria magicamente três duplicatas ilusórias de si mesmo se não estiver sob luz forte. As duplicatas se movem com ele e imitam suas ações, mudando de posição de modo a impossibilitar rastrear qual cloaker é o real. Se o cloaker estiver em uma área de luz forte, as duplicatas desaparecem.\nSempre que qualquer criatura tiver como alvo o manto com um ataque ou uma magia prejudicial enquanto uma duplicata permanecer, aquela criatura rola aleatoriamente para determinar se ela tem como alvo o manto ou uma das duplicatas. Uma criatura não é afetada por este efeito mágico se não puder ver ou se depender de outros sentidos além da visão.\nUma duplicata possui a CA do cloaker e usa seus testes de resistência. Se um ataque atingir uma duplicata, ou se uma duplicata falhar em um teste de resistência contra um efeito que causa dano, a duplicata desaparece.",
          "name": "Fantasmas (recarrega após um descanso curto ou longo)"
        }
      ],
      "languages": [
        "Dialeto Obscuro",
        "Subcomum"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 11
      },
      "skills": {
        "Furtividade": 5
      },
      "speed": {
        "voo": 40,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "Enquanto estiver anexado a uma criatura, o manto sofre apenas metade do dano causado a ela (arredondado para baixo). e essa criatura fica com a outra metade.",
          "name": "Transferência de danos"
        },
        {
          "description": "Embora a capa permaneça imóvel sem a parte inferior exposta, ela é indistinguível de uma capa de couro escuro.",
          "name": "Aparência Falsa"
        },
        {
          "description": "Enquanto estiver sob luz brilhante, o manto tem desvantagem em jogadas de ataque e testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Sensibilidade à luz"
        }
      ]
    }
  },
  {
    "id": "srd:frost-giant",
    "name": "Gigante de Gelo",
    "name_en": "Frost Giant",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Gigante",
    "type_en": "giant",
    "cr": "8",
    "cr_numeric": 8.0,
    "armor_class": 15,
    "hp_max": 138,
    "hp_formula": "12d12+60",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 21,
        "dex": 9,
        "int": 9,
        "str": 23,
        "wis": 10
      },
      "actions": [
        {
          "description": "O gigante faz dois ataques com machado grande.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "3d12+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 metros, um alvo. Acerto: 25 (3d12 + 6) de dano cortante.",
          "name": "Machado Grande"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "4d10+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque com arma de longo alcance: +9 para acertar, alcance 60/240 pés, um alvo. Acerto: 28 (4d10 + 6) de dano de concussão.",
          "name": "Pedra"
        }
      ],
      "damage_immunities": [
        "frio"
      ],
      "languages": [
        "Gigante"
      ],
      "saving_throws": {
        "cha": 4,
        "con": 8,
        "wis": 3
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "skills": {
        "Atletismo": 9,
        "Percepção": 3
      },
      "speed": {
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:hezrou",
    "name": "Hezrou",
    "name_en": "Hezrou",
    "size": "Grande",
    "size_en": "Large",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "8",
    "cr_numeric": 8.0,
    "armor_class": 16,
    "hp_max": 136,
    "hp_formula": "13d10+65",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 13,
        "con": 20,
        "dex": 17,
        "int": 5,
        "str": 19,
        "wis": 12
      },
      "actions": [
        {
          "description": "O hezrou faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d10+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 15 (2d10 + 4) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.",
          "name": "Garras"
        },
        {
          "description": "O demônio escolhe o que invocar e tenta uma invocação mágica.\nUm hezrou tem 30% de chance de invocar 2d6 dretches ou um hezrou.\nUm demônio invocado aparece em um espaço desocupado a até 18 metros de seu invocador, age como um aliado de seu invocador e não pode invocar outros demônios. Ela permanece por 1 minuto, até que ela ou seu invocador morra, ou até que seu invocador a dispense como uma ação.",
          "name": "Variante: Convocar Demônio (1/Dia)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "frio",
        "fogo",
        "lightning; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Abissal",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "con": 8,
        "str": 7,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 11
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O hezrou tem vantagem em testes de resistência contra magias e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Qualquer criatura que comece seu turno a até 3 metros do hezrou deve ser bem sucedida em um teste de resistência de Constituição CD 14 ou será envenenada até o início de seu próximo turno. Em um teste de resistência bem-sucedido, a criatura fica imune ao fedor do hezrou por 24 horas.",
          "name": "Fedor"
        }
      ]
    }
  },
  {
    "id": "srd:hydra",
    "name": "Hidra",
    "name_en": "Hydra",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "8",
    "cr_numeric": 8.0,
    "armor_class": 15,
    "hp_max": 172,
    "hp_formula": "15d12+75",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 7,
        "con": 20,
        "dex": 12,
        "int": 2,
        "str": 20,
        "wis": 10
      },
      "actions": [
        {
          "description": "A hidra faz tantos ataques de mordida quanto cabeças.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "1d10+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 metros, um alvo. Acerto: 10 (1d10 + 5) de dano perfurante.",
          "name": "Morder"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 16
      },
      "skills": {
        "Percepção": 6
      },
      "speed": {
        "natação": 30,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A hidra pode prender a respiração por 1 hora.",
          "name": "Prenda a respiração"
        },
        {
          "description": "A hidra tem cinco cabeças. Embora tenha mais de uma cabeça, a hidra tem vantagem em testes de resistência contra ficar cega, enfeitiçada, surda, assustada, atordoada e inconsciente.\nSempre que a hidra sofre 25 ou mais de dano em um único turno, uma de suas cabeças morre. Se todas as suas cabeças morrerem, a hidra morre.\nNo final do seu turno, surgem duas cabeças para cada uma das cabeças que morreram desde o último turno, a menos que tenha sofrido dano de fogo desde o último turno. A hidra recupera 10 pontos de vida para cada cabeça regenerada dessa forma.",
          "name": "Várias cabeças"
        },
        {
          "description": "Para cada cabeça que a hidra tiver além de uma, ela obtém uma reação extra que pode ser usada apenas para ataques de oportunidade.",
          "name": "Cabeças reativas"
        },
        {
          "description": "Enquanto a hidra dorme, pelo menos uma de suas cabeças fica acordada.",
          "name": "Acordado"
        }
      ]
    }
  },
  {
    "id": "srd:spirit-naga",
    "name": "Espírito Naga",
    "name_en": "Spirit Naga",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "8",
    "cr_numeric": 8.0,
    "armor_class": 15,
    "hp_max": 75,
    "hp_formula": "10d10+20",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 14,
        "dex": 17,
        "int": 16,
        "str": 18,
        "wis": 15
      },
      "actions": [
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "1d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 metros, uma criatura. Acerto: 7 (1d6 + 4) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 13, sofrendo 31 (7d8) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso.",
          "name": "Morder"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "Abissal",
        "Comum"
      ],
      "saving_throws": {
        "cha": 6,
        "con": 5,
        "dex": 6,
        "wis": 5
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 12
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se morrer, a naga volta à vida em 1d6 dias e recupera todos os seus pontos de vida. Somente um feitiço de desejo pode impedir que essa característica funcione.",
          "name": "Rejuvenescimento"
        },
        {
          "description": "A naga é uma conjuradora de 10º nível. Sua habilidade de conjurar magias é Inteligência (CD para resistência de magia 14, +6 para acertar com ataques de magia), e ele precisa apenas de componentes verbais para lançar suas magias. Possui os seguintes feitiços de mago preparados:\n\n* Truques (à vontade): mão mágica, ilusão menor, raio de gelo\n* 1º nível (4 espaços): encantar pessoa, detectar magia, dormir\n* 2º nível (3 slots): detectar pensamentos, segurar pessoa\n* 3º nível (3 espaços): raio, respiração na água\n* 4º nível (3 slots): praga, porta dimensional\n* 5º nível (2 slots): dominar pessoa",
          "name": "Feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:tyrannosaurus-rex",
    "name": "Tiranossauro Rex",
    "name_en": "Tyrannosaurus Rex",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Fera",
    "type_en": "beast",
    "cr": "8",
    "cr_numeric": 8.0,
    "armor_class": 13,
    "hp_max": 136,
    "hp_formula": "13d12+52",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 9,
        "con": 19,
        "dex": 10,
        "int": 2,
        "str": 25,
        "wis": 12
      },
      "actions": [
        {
          "description": "O tiranossauro faz dois ataques: um com a mordida e outro com a cauda. Não pode realizar ambos os ataques contra o mesmo alvo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "4d12+7",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 metros, um alvo. Acerto: 33 (4d12 + 7) de dano perfurante. Se o alvo for uma criatura Média ou menor, ele será agarrado (CD 17 para escapar). Até que esta luta termine, o alvo fica contido e o tiranossauro não pode morder outro alvo.",
          "name": "Morder"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "3d8+7",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 metros, um alvo. Acerto: 20 (3d8 + 7) de dano de concussão.",
          "name": "Cauda"
        }
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "deslocamento": 50
      }
    }
  },
  {
    "id": "srd:young-bronze-dragon",
    "name": "Dragão de Bronze Jovem",
    "name_en": "Young Bronze Dragon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "8",
    "cr_numeric": 8.0,
    "armor_class": 18,
    "hp_max": 142,
    "hp_formula": "15d10+60",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 17,
        "con": 19,
        "dex": 10,
        "int": 14,
        "str": 21,
        "wis": 13
      },
      "actions": [
        {
          "description": "O dragão faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "2d10+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 metros, um alvo. Acerto: 16 (2d10 + 5) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "2d6+5",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1,5 m, um alvo. Acerto: 12 (2d6 + 5) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "10d10+0",
              "type": "lightning"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro Relâmpago.** O dragão exala relâmpagos em uma linha de 18 metros com 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 15, sofrendo 55 (10d10) de dano elétrico se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Sopro de Repulsão.** O dragão exala energia de repulsão em um cone de 9 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Força CD 15. Se falhar na resistência, a criatura é empurrada para 12 metros de distância do dragão.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "elétrico"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 6,
        "con": 7,
        "dex": 3,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "visão no escuro": 120,
        "percepção passiva": 17
      },
      "skills": {
        "Intuição": 4,
        "Percepção": 7,
        "Furtividade": 3
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:young-green-dragon",
    "name": "Jovem Dragão Verde",
    "name_en": "Young Green Dragon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "8",
    "cr_numeric": 8.0,
    "armor_class": 18,
    "hp_max": 136,
    "hp_formula": "16d10+48",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 17,
        "dex": 12,
        "int": 16,
        "str": 19,
        "wis": 13
      },
      "actions": [
        {
          "description": "O dragão faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d10+2d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d10 + 4) de dano perfurante mais 7 (2d6) de dano venenoso.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 11 (2d6 + 4) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "12d6+0",
              "type": "poison"
            }
          ],
          "description": "O dragão exala gás venenoso em um cone de 9 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 14, sofrendo 42 (12d6) de dano de veneno se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Venenoso (Recarga 5-6)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 5,
        "con": 6,
        "dex": 4,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "visão no escuro": 120,
        "percepção passiva": 17
      },
      "skills": {
        "Enganação": 5,
        "Percepção": 7,
        "Furtividade": 4
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:bone-devil",
    "name": "Diabo Osso",
    "name_en": "Bone Devil",
    "size": "Grande",
    "size_en": "Large",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "9",
    "cr_numeric": 9.0,
    "armor_class": 19,
    "hp_max": 142,
    "hp_formula": "15d10+60",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 18,
        "dex": 16,
        "int": 13,
        "str": 18,
        "wis": 14
      },
      "actions": [
        {
          "description": "O diabo faz três ataques: dois com suas garras e um com seu ferrão.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "1d8+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 metros, um alvo. Acerto: 8 (1d8 + 4) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 metros, um alvo. Acerto: 13 (2d8 + 4) de dano perfurante mais 17 (5d6) de dano venenoso, e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 14 ou ficará envenenado por 1 minuto. O alvo pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso.",
          "name": "Picada"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "cold; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Infernal",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "cha": 7,
        "int": 5,
        "wis": 6
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 9
      },
      "skills": {
        "Enganação": 7,
        "Intuição": 6
      },
      "speed": {
        "voo": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "A escuridão mágica não impede a visão no escuro do diabo.",
          "name": "Visão do Diabo"
        },
        {
          "description": "O diabo tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:clay-golem",
    "name": "Golem de Argila",
    "name_en": "Clay Golem",
    "size": "Grande",
    "size_en": "Large",
    "type": "Constructo",
    "type_en": "construct",
    "cr": "9",
    "cr_numeric": 9.0,
    "armor_class": 14,
    "hp_max": 133,
    "hp_formula": "14d10+56",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 18,
        "dex": 9,
        "int": 3,
        "str": 20,
        "wis": 8
      },
      "actions": [
        {
          "description": "O golem faz dois ataques violentos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "2d10+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1,5 m, um alvo. Acerto: 16 (2d10 + 5) de dano de concussão. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Constituição CD 15 ou terá seu máximo de pontos de vida reduzido em uma quantidade igual ao dano sofrido. O alvo morre se este ataque reduzir seu máximo de pontos de vida a 0. A redução dura até ser removida pelo feitiço de restauração maior ou outra magia.",
          "name": "Bater"
        },
        {
          "description": "Até o final do próximo turno, o golem ganha magicamente um bônus de +2 em sua CA, tem vantagem em testes de resistência de Destreza e pode usar seu ataque de impacto como uma ação bônus.",
          "name": "Aceleração (Recarga 5-6)"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado",
        "Paralisado",
        "Petrificado",
        "Envenenado"
      ],
      "damage_immunities": [
        "ácido",
        "veneno",
        "psychic; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with adamantine weapons"
      ],
      "languages": [
        "understands the languages of its creator but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 9
      },
      "speed": {
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "Sempre que o golem for submetido a dano ácido, ele não sofrerá dano e, em vez disso, recuperará um número de pontos de vida igual ao dano ácido causado.",
          "name": "Absorção de Ácido"
        },
        {
          "description": "Sempre que o golem começar seu turno com 60 pontos de vida ou menos, jogue um d6. Com um 6, o golem fica furioso. Em cada um de seus turnos enquanto estiver furioso, o golem ataca a criatura mais próxima que puder ver. Se nenhuma criatura estiver próxima o suficiente para se mover e atacar, o golem ataca um objeto, com preferência por um objeto menor que ele. Uma vez que o golem enlouquece, ele continua assim até ser destruído ou recuperar todos os seus pontos de vida.",
          "name": "Furioso"
        },
        {
          "description": "O golem é imune a qualquer feitiço ou efeito que altere sua forma.",
          "name": "Forma Imutável"
        },
        {
          "description": "O golem tem vantagem em testes de resistência contra magias e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Os ataques com armas do golem são mágicos.",
          "name": "Armas Mágicas"
        }
      ]
    }
  },
  {
    "id": "srd:cloud-giant",
    "name": "Gigante das Nuvens",
    "name_en": "Cloud Giant",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Gigante",
    "type_en": "giant",
    "cr": "9",
    "cr_numeric": 9.0,
    "armor_class": 14,
    "hp_max": 200,
    "hp_formula": "16d12+96",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 22,
        "dex": 10,
        "int": 12,
        "str": 27,
        "wis": 16
      },
      "actions": [
        {
          "description": "O gigante faz dois ataques Morningstar.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 12,
          "damage": [
            {
              "dice": "3d8+8",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 3 metros, um alvo. Acerto: 21 (3d8 + 8) de dano perfurante.",
          "name": "Estrela da Manhã"
        },
        {
          "attack_bonus": 12,
          "damage": [
            {
              "dice": "4d10+8",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque com arma de longo alcance: +12 para acertar, alcance 60/240 pés, um alvo. Acerto: 30 (4d10 + 8) de dano de concussão.",
          "name": "Pedra"
        }
      ],
      "languages": [
        "Comum",
        "Gigante"
      ],
      "saving_throws": {
        "cha": 7,
        "con": 10,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 17
      },
      "skills": {
        "Intuição": 7,
        "Percepção": 7
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O gigante tem vantagem em testes de Sabedoria (Percepção) que dependem do olfato.",
          "name": "Cheiro Aguçado"
        },
        {
          "description": "A habilidade inata de conjuração do gigante é Carisma. Ele pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\n\nÀ vontade: detectar magia, nuvem de neblina, luz\n3/dia cada: queda de penas, voo, passo enevoado, telecinesia\n1/dia cada: controle do clima, forma gasosa",
          "name": "Feitiço Inato"
        }
      ]
    }
  },
  {
    "id": "srd:fire-giant",
    "name": "Gigante de Fogo",
    "name_en": "Fire Giant",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Gigante",
    "type_en": "giant",
    "cr": "9",
    "cr_numeric": 9.0,
    "armor_class": 18,
    "hp_max": 162,
    "hp_formula": "13d12+78",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 13,
        "con": 23,
        "dex": 9,
        "int": 10,
        "str": 25,
        "wis": 14
      },
      "actions": [
        {
          "description": "O gigante faz dois ataques com espada larga.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "6d6+7",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 metros, um alvo. Acerto: 28 (6d6 + 7) de dano cortante.",
          "name": "Espada larga"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "4d10+7",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque com arma de longo alcance: +11 para acertar, alcance 60/240 pés, um alvo. Acerto: 29 (4d10 + 7) de dano de concussão.",
          "name": "Pedra"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Gigante"
      ],
      "saving_throws": {
        "cha": 5,
        "con": 10,
        "dex": 3
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 16
      },
      "skills": {
        "Atletismo": 11,
        "Percepção": 6
      },
      "speed": {
        "deslocamento": 30
      }
    }
  },
  {
    "id": "srd:glabrezu",
    "name": "Glabrezu",
    "name_en": "Glabrezu",
    "size": "Grande",
    "size_en": "Large",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "9",
    "cr_numeric": 9.0,
    "armor_class": 17,
    "hp_max": 157,
    "hp_formula": "15d10+75",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 21,
        "dex": 15,
        "int": 19,
        "str": 20,
        "wis": 17
      },
      "actions": [
        {
          "description": "O glabrezu faz quatro ataques: dois com a pinça e dois com os punhos. Alternativamente, ele faz dois ataques com suas pinças e lança um feitiço.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "2d10+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 metros, um alvo. Acerto: 16 (2d10 + 5) de dano de concussão. Se o alvo for uma criatura Média ou menor, ele será agarrado (CD 15 para escapar). O glabrezu possui duas pinças, cada uma das quais pode atingir apenas um alvo.",
          "name": "Pinça"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "2d4+2",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +9 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (2d4 + 2) de dano de concussão.",
          "name": "Punho"
        },
        {
          "description": "O demônio escolhe o que invocar e tenta uma invocação mágica.\nUm glabrezu tem 30% de chance de invocar 1d3 vrocks, 1d2 hezrous ou um glabrezu.\nUm demônio invocado aparece em um espaço desocupado a até 18 metros de seu invocador, age como um aliado de seu invocador e não pode invocar outros demônios. Ela permanece por 1 minuto, até que ela ou seu invocador morra, ou até que seu invocador a dispense como uma ação.",
          "name": "Variante: Convocar Demônio (1/Dia)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "frio",
        "fogo",
        "lightning; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Abissal",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "cha": 7,
        "con": 9,
        "str": 9,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13,
        "visão verdadeira": 120
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "A habilidade de conjuração do glabrezu é Inteligência (resistência ao feitiço CD 16). O glabrezu pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\nÀ vontade: escuridão, detectar magia, dissipar magia\n1/dia cada: confusão, mosca, atordoamento com palavra de poder",
          "name": "Feitiço Inato"
        },
        {
          "description": "O glabrezu tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:treant",
    "name": "Ente",
    "name_en": "Treant",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Planta",
    "type_en": "plant",
    "cr": "9",
    "cr_numeric": 9.0,
    "armor_class": 16,
    "hp_max": 138,
    "hp_formula": "12d12+60",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 21,
        "dex": 8,
        "int": 12,
        "str": 23,
        "wis": 16
      },
      "actions": [
        {
          "description": "O ente faz dois ataques de impacto.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "3d6+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1,5 m, um alvo. Acerto: 16 (3d6 + 6) de dano de concussão.",
          "name": "Bater"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "4d10+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque com arma de longo alcance: +10 para acertar, alcance 60/180 pés, um alvo. Acerto: 28 (4d10 + 6) de dano de concussão.",
          "name": "Pedra"
        },
        {
          "description": "O ente anima magicamente uma ou duas árvores que ele possa ver a até 18 metros dele. Essas árvores têm as mesmas estatísticas de um ente, exceto que possuem valores de Inteligência e Carisma de 1, não podem falar e têm apenas a opção de ação Slam. Uma árvore animada atua como aliada do ente. A árvore permanece animada por 1 dia ou até morrer; até que o ente morra ou esteja a mais de 36 metros da árvore; ou até que o ente realize uma ação bônus para transformá-lo novamente em uma árvore inanimada. A árvore então cria raízes, se possível.",
          "name": "Animar árvores (1/dia)"
        }
      ],
      "damage_resistances": [
        "contundente",
        "perfurante"
      ],
      "damage_vulnerabilities": [
        "fogo"
      ],
      "languages": [
        "Comum",
        "Druidic",
        "Élfico",
        "Silvestre"
      ],
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Enquanto o ente permanece imóvel, ele é indistinguível de uma árvore normal.",
          "name": "Aparência Falsa"
        },
        {
          "description": "O ente causa o dobro de dano a objetos e estruturas.",
          "name": "Monstro de Cerco"
        }
      ]
    }
  },
  {
    "id": "srd:young-blue-dragon",
    "name": "Jovem Dragão Azul",
    "name_en": "Young Blue Dragon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "9",
    "cr_numeric": 9.0,
    "armor_class": 18,
    "hp_max": 152,
    "hp_formula": "16d10+64",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 17,
        "con": 19,
        "dex": 10,
        "int": 14,
        "str": 21,
        "wis": 13
      },
      "actions": [
        {
          "description": "O dragão faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "2d10+1d10+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 metros, um alvo. Acerto: 16 (2d10 + 5) de dano perfurante mais 5 (1d10) de dano elétrico.",
          "name": "Morder"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "2d6+5",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +9 para acertar, alcance 1,5 m, um alvo. Acerto: 12 (2d6 + 5) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "10d10+0",
              "type": "lightning"
            }
          ],
          "description": "O dragão exala relâmpagos em uma linha de 18 metros e 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 16, sofrendo 55 (10d10) de dano elétrico se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro Relâmpago (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "elétrico"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 7,
        "con": 8,
        "dex": 4,
        "wis": 5
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "visão no escuro": 120,
        "percepção passiva": 19
      },
      "skills": {
        "Percepção": 9,
        "Furtividade": 4
      },
      "speed": {
        "escavação": 40,
        "voo": 80,
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:young-silver-dragon",
    "name": "Jovem Dragão Prateado",
    "name_en": "Young Silver Dragon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "9",
    "cr_numeric": 9.0,
    "armor_class": 18,
    "hp_max": 168,
    "hp_formula": "16d10+80",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 19,
        "con": 21,
        "dex": 10,
        "int": 14,
        "str": 23,
        "wis": 11
      },
      "actions": [
        {
          "description": "O dragão faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d10+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 metros, um alvo. Acerto: 17 (2d10 + 6) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d6+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d6 + 6) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "12d8+0",
              "type": "cold"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Respiração Fria.** O dragão exala uma explosão gelada em um cone de 9 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 17, sofrendo 54 (12d8) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração Paralisante.** O dragão exala gás paralisante em um cone de 9 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 17 ou ficará paralisada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "frio"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 8,
        "con": 9,
        "dex": 4,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "visão no escuro": 120,
        "percepção passiva": 18
      },
      "skills": {
        "Arcanismo": 6,
        "História": 6,
        "Percepção": 8,
        "Furtividade": 4
      },
      "speed": {
        "voo": 80,
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:aboleth",
    "name": "Aboleth",
    "name_en": "Aboleth",
    "size": "Grande",
    "size_en": "Large",
    "type": "Aberração",
    "type_en": "aberration",
    "cr": "10",
    "cr_numeric": 10.0,
    "armor_class": 17,
    "hp_max": 135,
    "hp_formula": "18d10+36",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 18,
        "con": 15,
        "dex": 9,
        "int": 18,
        "str": 21,
        "wis": 15
      },
      "actions": [
        {
          "description": "O aboleth faz três ataques de tentáculos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "2d6+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 metros, um alvo. Acerto: 12 (2d6 + 5) de dano de concussão. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Constituição CD 14 ou ficará doente. A doença não tem efeito por 1 minuto e pode ser removida por qualquer magia que cure a doença. Após 1 minuto, a pele da criatura doente torna-se translúcida e viscosa, a criatura não pode recuperar pontos de vida a menos que esteja debaixo d’água e a doença só pode ser removida por cura ou outra magia de cura de doenças de 6º nível ou superior. Quando a criatura está fora de um corpo de água, ela sofre 6 (1d12) de dano ácido a cada 10 minutos, a menos que umidade seja aplicada à pele antes de 10 minutos terem passado.",
          "name": "Tentáculo"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "3d6+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 metros, um alvo. Acerto: 15 (3d6 + 5) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "O aboleth tem como alvo uma criatura que ele possa ver a até 9 metros dele. O alvo deve ser bem sucedido em um teste de resistência de Sabedoria CD 14 ou ficará magicamente encantado pelo aboleth até que o aboleth morra ou até que esteja em um plano de existência diferente do alvo. O alvo encantado está sob o controle do aboleth e não pode reagir, e o aboleth e o alvo podem se comunicar telepaticamente um com o outro a qualquer distância.\nSempre que o alvo encantado sofrer dano, o alvo pode repetir o teste de resistência. Com um sucesso, o efeito termina. Não mais do que uma vez a cada 24 horas, o alvo também pode repetir o teste de resistência quando estiver a pelo menos 1,6 km de distância do aboleth.",
          "name": "Escravizar (3/dia)"
        }
      ],
      "languages": [
        "Dialeto Obscuro",
        "telepathy 120 ft."
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O aboleth faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O aboleth faz um ataque com a cauda.",
            "name": "Deslizar a cauda"
          },
          {
            "cost": 2,
            "description": "Uma criatura encantada pelo aboleth sofre 10 (3d6) de dano psíquico, e o aboleth recupera pontos de vida iguais ao dano que a criatura sofre.",
            "name": "Dreno Psíquico (custa 2 ações)"
          }
        ],
        "description": "O Aboleth pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "con": 6,
        "int": 8,
        "wis": 6
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 20
      },
      "skills": {
        "História": 12,
        "Percepção": 10
      },
      "speed": {
        "natação": 40,
        "deslocamento": 10
      },
      "traits": [
        {
          "description": "O aboleth pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "Enquanto está debaixo d'água, o aboleth é cercado por muco transformador. Uma criatura que tocar o aboleth ou que o atingir com um ataque corpo a corpo enquanto estiver a 1,5 metro dele deve realizar um teste de resistência de Constituição CD 14. Se falhar, a criatura fica doente por 1d4 horas. A criatura doente só pode respirar debaixo d'água.",
          "name": "Nuvem Mucosa"
        },
        {
          "description": "Se uma criatura se comunica telepaticamente com o aboleth, o aboleth aprende os maiores desejos da criatura se o aboleth puder ver a criatura.",
          "name": "Sondando Telepatia"
        }
      ]
    }
  },
  {
    "id": "srd:deva",
    "name": "Deva",
    "name_en": "Deva",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Celestial",
    "type_en": "celestial",
    "cr": "10",
    "cr_numeric": 10.0,
    "armor_class": 17,
    "hp_max": 136,
    "hp_formula": "16d8+64",
    "initiative_modifier": 4,
    "stat_block_json": {
      "ability_scores": {
        "cha": 20,
        "con": 18,
        "dex": 18,
        "int": 17,
        "str": 18,
        "wis": 20
      },
      "actions": [
        {
          "description": "O deva faz dois ataques corpo a corpo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "1d6+4d8+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1,5 m, um alvo. Acerto: 7 (1d6 + 4) de dano de concussão mais 18 (4d8) de dano radiante.",
          "name": "Mace"
        },
        {
          "description": "O deva toca outra criatura. O alvo recupera magicamente 20 (4d8 + 2) pontos de vida e fica livre de qualquer maldição, doença, veneno, cegueira ou surdez.",
          "name": "Toque de Cura (3/dia)"
        },
        {
          "description": "O deva se transforma magicamente em um humanóide ou besta que tem um nível de desafio igual ou menor que o seu, ou volta à sua forma verdadeira. Ele reverte à sua verdadeira forma se morrer. Qualquer equipamento que ele esteja vestindo ou carregando é absorvido ou suportado pela nova forma (a escolha do deva).\nEm uma nova forma, o deva mantém suas estatísticas de jogo e habilidade de falar, mas sua CA, modos de movimento, Força, Destreza e sentidos especiais são substituídos pelos da nova forma, e ele ganha quaisquer estatísticas e capacidades (exceto características de classe, ações lendárias e ações de covil) que a nova forma possui, mas que falta.",
          "name": "Alterar forma"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado"
      ],
      "damage_resistances": [
        "radiant; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "all",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "cha": 9,
        "wis": 9
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 19
      },
      "skills": {
        "Intuição": 9,
        "Percepção": 9
      },
      "speed": {
        "voo": 90,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Os ataques com armas do deva são mágicos. Quando o deva ataca com qualquer arma, a arma causa 4d8 de dano radiante extra (incluído no ataque).",
          "name": "Armas Angelicais"
        },
        {
          "description": "A habilidade de conjuração do deva é Carisma (resistência ao feitiço CD 17). O deva pode conjurar inatamente os seguintes feitiços, exigindo apenas componentes verbais:\nÀ vontade: detecte o mal e o bem\n1/dia cada: comungar, ressuscitar mortos",
          "name": "Feitiço Inato"
        },
        {
          "description": "O deva tem vantagem em testes de resistência contra magias e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:guardian-naga",
    "name": "Guardião Naga",
    "name_en": "Guardian Naga",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "10",
    "cr_numeric": 10.0,
    "armor_class": 18,
    "hp_max": 127,
    "hp_formula": "15d10+45",
    "initiative_modifier": 4,
    "stat_block_json": {
      "ability_scores": {
        "cha": 18,
        "con": 16,
        "dex": 18,
        "int": 16,
        "str": 19,
        "wis": 19
      },
      "actions": [
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "1d8+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 metros, uma criatura. Acerto: 8 (1d8 + 4) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 15, sofrendo 45 (10d8) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso.",
          "name": "Morder"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "10d8+0",
              "type": "poison"
            }
          ],
          "description": "Ataque com arma de longo alcance: +8 para acertar, alcance 15/30 pés, uma criatura. Acerto: O alvo deve realizar um teste de resistência de Constituição CD 15, sofrendo 45 (10d8) de dano de veneno se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Cuspir Veneno"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "Celestial",
        "Comum"
      ],
      "saving_throws": {
        "cha": 8,
        "con": 7,
        "dex": 8,
        "int": 7,
        "wis": 8
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se morrer, a naga volta à vida em 1d6 dias e recupera todos os seus pontos de vida. Somente um feitiço de desejo pode impedir que essa característica funcione.",
          "name": "Rejuvenescimento"
        },
        {
          "description": "A naga é uma conjuradora de 11º nível. Sua habilidade de lançar feitiços é Sabedoria (CD para resistência de feitiços 16, +8 para acertar com ataques de feitiços), e ele precisa apenas de componentes verbais para lançar seus feitiços. Possui os seguintes feitiços de clérigo preparados:\n\n* Truques (à vontade): remendar, chama sagrada, taumaturgia\n* 1º nível (4 espaços): comando, curar feridas, escudo da fé\n* 2º nível (3 espaços): acalmar emoções, segurar pessoa\n* 3º nível (3 espaços): conceder maldição, clarividência\n* 4º nível (3 slots): banimento, liberdade de movimento\n* 5º nível (2 slots): ataque de chamas, geas\n* 6º nível (1 slot): visão da verdade",
          "name": "Feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:stone-golem",
    "name": "Golem de Pedra",
    "name_en": "Stone Golem",
    "size": "Grande",
    "size_en": "Large",
    "type": "Constructo",
    "type_en": "construct",
    "cr": "10",
    "cr_numeric": 10.0,
    "armor_class": 17,
    "hp_max": 178,
    "hp_formula": "17d10+85",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 20,
        "dex": 9,
        "int": 3,
        "str": 22,
        "wis": 11
      },
      "actions": [
        {
          "description": "O golem faz dois ataques violentos.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "3d8+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1,5 m, um alvo. Acerto: 19 (3d8 + 6) de dano de concussão.",
          "name": "Bater"
        },
        {
          "description": "O golem tem como alvo uma ou mais criaturas que ele possa ver a até 3 metros dele. Cada alvo deve realizar um teste de resistência de Sabedoria CD 17 contra esta magia. Se falhar, o alvo não pode usar reações, sua velocidade é reduzida à metade e ele não pode realizar mais de um ataque por turno. Além disso, o alvo pode realizar uma ação ou uma ação bônus no seu turno, não ambas. Esses efeitos duram 1 minuto. Um alvo pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso.",
          "name": "Lento (recarga 5-6)"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado",
        "Paralisado",
        "Petrificado",
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno",
        "psychic; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with adamantine weapons"
      ],
      "languages": [
        "understands the languages of its creator but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O golem é imune a qualquer feitiço ou efeito que altere sua forma.",
          "name": "Forma Imutável"
        },
        {
          "description": "O golem tem vantagem em testes de resistência contra magias e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Os ataques com armas do golem são mágicos.",
          "name": "Armas Mágicas"
        }
      ]
    }
  },
  {
    "id": "srd:young-gold-dragon",
    "name": "Dragão Dourado Jovem",
    "name_en": "Young Gold Dragon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "10",
    "cr_numeric": 10.0,
    "armor_class": 18,
    "hp_max": 178,
    "hp_formula": "17d10+85",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 20,
        "con": 21,
        "dex": 14,
        "int": 16,
        "str": 23,
        "wis": 13
      },
      "actions": [
        {
          "description": "O dragão faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d10+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 metros, um alvo. Acerto: 17 (2d10 + 6) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d6+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d6 + 6) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "10d10+0",
              "type": "fire"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro de Fogo.** O dragão exala fogo em um cone de 9 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 17, sofrendo 55 (10d10) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração Enfraquecedora.** O dragão exala gás em um cone de 9 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Força CD 17 ou terá desvantagem em jogadas de ataque baseadas em Força, testes de Força e testes de resistência de Força por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 9,
        "con": 9,
        "dex": 6,
        "wis": 5
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "visão no escuro": 120,
        "percepção passiva": 19
      },
      "skills": {
        "Intuição": 5,
        "Percepção": 9,
        "Persuasão": 9,
        "Furtividade": 6
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:young-red-dragon",
    "name": "Jovem Dragão Vermelho",
    "name_en": "Young Red Dragon",
    "size": "Grande",
    "size_en": "Large",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "10",
    "cr_numeric": 10.0,
    "armor_class": 18,
    "hp_max": 178,
    "hp_formula": "17d10+85",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 19,
        "con": 21,
        "dex": 10,
        "int": 14,
        "str": 23,
        "wis": 11
      },
      "actions": [
        {
          "description": "O dragão faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d10+1d6+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 metros, um alvo. Acerto: 17 (2d10 + 6) de dano perfurante mais 3 (1d6) de dano de fogo.",
          "name": "Morder"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d6+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d6 + 6) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "16d6+0",
              "type": "fire"
            }
          ],
          "description": "O dragão exala fogo em um cone de 9 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 17, sofrendo 56 (16d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro de Fogo (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "saving_throws": {
        "cha": 8,
        "con": 9,
        "dex": 4,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "visão no escuro": 120,
        "percepção passiva": 18
      },
      "skills": {
        "Percepção": 8,
        "Furtividade": 4
      },
      "speed": {
        "escalada": 40,
        "voo": 80,
        "deslocamento": 40
      }
    }
  },
  {
    "id": "srd:behir",
    "name": "Behir",
    "name_en": "Behir",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "11",
    "cr_numeric": 11.0,
    "armor_class": 17,
    "hp_max": 168,
    "hp_formula": "16d12+64",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 18,
        "dex": 16,
        "int": 7,
        "str": 23,
        "wis": 14
      },
      "actions": [
        {
          "description": "O behir faz dois ataques: um com a mordida e outro para contrair.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "3d10+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 metros, um alvo. Acerto: 22 (3d10 + 6) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d10+2d10+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +10 para acertar, alcance 1,5 m, uma criatura Grande ou menor. Acerto: 17 (2d10 + 6) de dano de concussão mais 17 (2d10 + 6) de dano cortante. O alvo é agarrado (CD 16 para escapar) se o behir ainda não estiver restringindo uma criatura, e o alvo fica impedido até o agarrão terminar.",
          "name": "Contrair"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "12d10+0",
              "type": "lightning"
            }
          ],
          "description": "O behir exala uma linha de relâmpago de 6 metros de comprimento e 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 16, sofrendo 66 (12d10) de dano elétrico se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro Relâmpago (Recarga 5-6)"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "6d6+0",
              "type": "acid"
            }
          ],
          "description": "O behir realiza um ataque de mordida contra um alvo Médio ou menor que esteja agarrando. Se o ataque acertar, o alvo também é engolido e a luta termina. Enquanto engolido, o alvo fica cego e contido, tem cobertura total contra ataques e outros efeitos fora do behir e sofre 21 (6d6) de dano ácido no início de cada turno do behir. Um behir pode ter apenas uma criatura engolida por vez.\nSe o behir sofrer 30 pontos de dano ou mais em um único turno da criatura engolida, o behir deve ser bem sucedido em um teste de resistência de Constituição CD 14 no final daquele turno ou regurgitar a criatura, que cai no chão em um espaço a até 3 metros do behir. Se o behir morrer, a criatura engolida não será mais contida por ele e poderá escapar do cadáver usando 4,5 metros de movimento, saindo caída.",
          "name": "Engolir"
        }
      ],
      "damage_immunities": [
        "elétrico"
      ],
      "languages": [
        "Dracônico"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 90,
        "percepção passiva": 16
      },
      "skills": {
        "Percepção": 6,
        "Furtividade": 7
      },
      "speed": {
        "escalada": 40,
        "deslocamento": 50
      }
    }
  },
  {
    "id": "srd:chain-devil",
    "name": "Diabo das Correntes",
    "name_en": "Chain Devil",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "11",
    "cr_numeric": 11.0,
    "armor_class": 16,
    "hp_max": 85,
    "hp_formula": "10d8+40",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 14,
        "con": 18,
        "dex": 15,
        "int": 11,
        "str": 18,
        "wis": 12
      },
      "actions": [
        {
          "description": "O diabo faz dois ataques com suas correntes.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "2d6+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 3 metros, um alvo. Acerto: 11 (2d6 + 4) de dano cortante. O alvo é agarrado (CD 14 para escapar) se o diabo ainda não estiver agarrando uma criatura. Até que esta luta termine, o alvo fica contido e sofre 7 (2d6) de dano perfurante no início de cada um de seus turnos.",
          "name": "Corrente"
        },
        {
          "description": "Até quatro correntes que o diabo pode ver a até 18 metros dele brotam magicamente farpas afiadas e se animam sob o controle do diabo, desde que as correntes não estejam sendo usadas ou carregadas.\nCada corrente animada é um objeto com CA 20, 20 pontos de vida, resistência a dano perfurante e imunidade a dano psíquico e trovejante. Quando o diabo usa Ataque Múltiplo em seu turno, ele pode usar cada cadeia animada para fazer um ataque em cadeia adicional. Uma corrente animada pode agarrar uma criatura própria, mas não pode realizar ataques enquanto luta. Uma corrente animada reverte ao seu estado inanimado se for reduzida a 0 pontos de vida ou se o diabo estiver incapacitado ou morrer.",
          "name": "Animate Chains (recarrega após um descanso curto ou longo)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "cold; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Infernal",
        "telepathy 120 ft."
      ],
      "reactions": [
        {
          "description": "Quando uma criatura que o diabo pode ver começa seu turno a até 9 metros do diabo, o diabo pode criar a ilusão de que se parece com um dos entes queridos que partiram ou com um inimigo ferrenho da criatura. Se a criatura puder ver o diabo, ela deverá ser bem sucedida num teste de resistência de Sabedoria CD 14 ou ficará assustada até o final do seu turno.",
          "name": "Máscara enervante"
        }
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 8
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "A escuridão mágica não impede a visão no escuro do diabo.",
          "name": "Visão do Diabo"
        },
        {
          "description": "O diabo tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:djinni",
    "name": "Djinni",
    "name_en": "Djinni",
    "size": "Grande",
    "size_en": "Large",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "11",
    "cr_numeric": 11.0,
    "armor_class": 17,
    "hp_max": 161,
    "hp_formula": "14d10+84",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 20,
        "con": 22,
        "dex": 15,
        "int": 15,
        "str": 21,
        "wis": 16
      },
      "actions": [
        {
          "description": "O djinni faz três ataques de cimitarra.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "2d6+1d6+5",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +9 para acertar, alcance 1,5 m, um alvo. Acerto: 12 (2d6 + 5) de dano cortante mais 3 (1d6) de dano elétrico ou trovejante (à escolha do djinni).",
          "name": "Cimitarra"
        },
        {
          "description": "Um cilindro de ar rodopiante com 1,5 metro de raio e 9 metros de altura se forma magicamente em um ponto que o djinni pode ver a até 36 metros dele. O redemoinho dura enquanto o djinni mantiver a concentração (como se estivesse concentrado em um feitiço). Qualquer criatura, exceto o djinni, que entrar no redemoinho deve ser bem sucedida em um teste de resistência de Força CD 18 ou será restringida por ele. O djinni pode mover o redemoinho até 18 metros com uma ação, e as criaturas contidas pelo redemoinho se movem com ele. O redemoinho termina se o djinni o perder de vista.\nUma criatura pode usar sua ação para libertar uma criatura contida pelo redemoinho, incluindo ela mesma, sendo bem-sucedida em um teste de Força CD 18. Se o teste for bem-sucedido, a criatura não estará mais contida e se moverá para o espaço mais próximo fora do redemoinho.",
          "name": "Criar redemoinho"
        }
      ],
      "damage_immunities": [
        "elétrico",
        "trovejante"
      ],
      "languages": [
        "Auran"
      ],
      "saving_throws": {
        "cha": 9,
        "dex": 6,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 13
      },
      "speed": {
        "voo": 90,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Se o djinni morrer, seu corpo se desintegrará em uma brisa quente, deixando para trás apenas o equipamento que o djinni estava usando ou carregando.",
          "name": "Morte Elemental"
        },
        {
          "description": "A habilidade inata de conjuração do djinni é Carisma (resistência de magia CD 17, +9 para acertar com ataques de magia). Ele pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\n\nÀ vontade: detecte o mal e o bem, detecte magia, onda trovejante\n3/dia cada: criar comida e água (pode criar vinho em vez de água), línguas, andar no vento\n1/dia cada: conjurar elemental (somente elemental do ar), criação, forma gasosa, invisibilidade, imagem principal, mudança de plano",
          "name": "Feitiço Inato"
        },
        {
          "description": "Os gênios possuem uma variedade de capacidades mágicas, incluindo feitiços. Alguns têm poderes ainda maiores que lhes permitem alterar a sua aparência ou a natureza da realidade.\n\n**Disfarces.** Alguns gênios podem se disfarçar de ilusão para se passarem por outras criaturas de formato semelhante. Esses gênios podem conjurar inatamente a magia disfarçar-se à vontade, muitas vezes com uma duração mais longa do que o normal para aquela magia. Gênios mais poderosos podem lançar o feitiço polimorfo verdadeiro uma a três vezes por dia, possivelmente com uma duração mais longa que o normal. Esses gênios podem mudar apenas sua própria forma, mas alguns raros também podem usar o feitiço em outras criaturas e objetos.\n**Desejos.** O poder do gênio de conceder desejos é lendário entre os mortais. Somente os gênios mais poderosos, como os da nobreza, podem fazê-lo. Um gênio específico que possui esse poder pode conceder de um a três desejos a uma criatura que não seja um gênio. Uma vez que um gênio tenha concedido seu limite de desejos, ele não poderá realizar desejos novamente por um certo período de tempo (geralmente 1 ano). e a lei cósmica determina que o mesmo gênio pode gastar seu limite de desejos em uma criatura específica apenas uma vez na existência dessa criatura.\nPara realizar um desejo, uma criatura a até 18 metros do gênio declara um efeito desejado para ele. O gênio pode então lançar o feitiço desejo em nome da criatura para provocar o efeito. Dependendo da natureza do gênio, o gênio pode tentar perverter a intenção do desejo, explorando a formulação pobre do desejo. A perversão do texto geralmente é elaborada para beneficiar o gênio.",
          "name": "Variante: Poderes do Gênio"
        }
      ]
    }
  },
  {
    "id": "srd:efreeti",
    "name": "Efreeti",
    "name_en": "Efreeti",
    "size": "Grande",
    "size_en": "Large",
    "type": "Elemental",
    "type_en": "elemental",
    "cr": "11",
    "cr_numeric": 11.0,
    "armor_class": 17,
    "hp_max": 200,
    "hp_formula": "16d10+112",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 24,
        "dex": 12,
        "int": 16,
        "str": 22,
        "wis": 15
      },
      "actions": [
        {
          "description": "O efreeti faz dois ataques de cimitarra ou usa seu Hurl Flame duas vezes.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d6+2d6+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d6 + 6) de dano cortante mais 7 (2d6) de dano de fogo.",
          "name": "Cimitarra"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "5d6+0",
              "type": "fire"
            }
          ],
          "description": "Ataque Mágico à Distância: +7 para acertar, alcance de 36 metros, um alvo. Acerto: 17 (5d6) de dano de fogo.",
          "name": "Lançar Chama"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Ignan"
      ],
      "saving_throws": {
        "cha": 7,
        "int": 7,
        "wis": 6
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 12
      },
      "speed": {
        "voo": 60,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o efreeti morrer, seu corpo se desintegra em um clarão de fogo e fumaça, deixando para trás apenas o equipamento que o djinni estava usando ou carregando.",
          "name": "Morte Elemental"
        },
        {
          "description": "A habilidade inata de lançar feitiços do efreeti é Carisma (resistência de feitiço CD 15, +7 para acertar com ataques de feitiço). Ele pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\n\nÀ vontade: detectar magia\n3/dia cada: ampliar/reduzir, línguas\n1/dia cada: conjurar elemental (somente elemental do fogo), forma gasosa, invisibilidade, imagem principal, mudança de plano, parede de fogo",
          "name": "Feitiço Inato"
        },
        {
          "description": "Os gênios possuem uma variedade de capacidades mágicas, incluindo feitiços. Alguns têm poderes ainda maiores que lhes permitem alterar a sua aparência ou a natureza da realidade.\n\n**Disfarces.** Alguns gênios podem se disfarçar de ilusão para se passarem por outras criaturas de formato semelhante. Esses gênios podem conjurar inatamente a magia disfarçar-se à vontade, muitas vezes com uma duração mais longa do que o normal para aquela magia. Gênios mais poderosos podem lançar o feitiço polimorfo verdadeiro uma a três vezes por dia, possivelmente com uma duração mais longa que o normal. Esses gênios podem mudar apenas sua própria forma, mas alguns raros também podem usar o feitiço em outras criaturas e objetos.\n**Desejos.** O poder do gênio de conceder desejos é lendário entre os mortais. Somente os gênios mais poderosos, como os da nobreza, podem fazê-lo. Um gênio específico que possui esse poder pode conceder de um a três desejos a uma criatura que não seja um gênio. Uma vez que um gênio tenha concedido seu limite de desejos, ele não poderá realizar desejos novamente por um certo período de tempo (geralmente 1 ano). e a lei cósmica determina que o mesmo gênio pode gastar seu limite de desejos em uma criatura específica apenas uma vez na existência dessa criatura.\nPara realizar um desejo, uma criatura a até 18 metros do gênio declara um efeito desejado para ele. O gênio pode então lançar o feitiço desejo em nome da criatura para provocar o efeito. Dependendo da natureza do gênio, o gênio pode tentar perverter a intenção do desejo, explorando a formulação pobre do desejo. A perversão do texto geralmente é elaborada para beneficiar o gênio.",
          "name": "Variante: Poderes do Gênio"
        }
      ]
    }
  },
  {
    "id": "srd:gynosphinx",
    "name": "Ginoesfinge",
    "name_en": "Gynosphinx",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "11",
    "cr_numeric": 11.0,
    "armor_class": 17,
    "hp_max": 136,
    "hp_formula": "16d10+48",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 18,
        "con": 16,
        "dex": 15,
        "int": 18,
        "str": 18,
        "wis": 18
      },
      "actions": [
        {
          "description": "A esfinge faz dois ataques de garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano cortante.",
          "name": "Garra"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado"
      ],
      "damage_immunities": [
        "psíquico"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Comum",
        "Sphinx"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "A esfinge faz um ataque de garra.",
            "name": "Ataque de garra"
          },
          {
            "cost": 2,
            "description": "A esfinge se teletransporta magicamente, junto com qualquer equipamento que esteja usando ou carregando, até 36 metros para um espaço desocupado que possa ver.",
            "name": "Teleporte (custa 2 ações)"
          },
          {
            "cost": 3,
            "description": "A esfinge conjura uma magia de sua lista de magias preparadas, usando um espaço de magia normalmente.",
            "name": "Lançar um feitiço (custa 3 ações)"
          }
        ],
        "description": "A Gynosphinx pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 18,
        "visão verdadeira": 120
      },
      "skills": {
        "Arcanismo": 12,
        "História": 12,
        "Percepção": 8,
        "Religião": 8
      },
      "speed": {
        "voo": 60,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "A esfinge é imune a qualquer efeito que possa sentir suas emoções ou ler seus pensamentos, bem como qualquer feitiço de adivinhação que ela recuse. Testes de Sabedoria (Intuição) feitos para verificar as intenções ou sinceridade da esfinge têm desvantagem.",
          "name": "Inescrutável"
        },
        {
          "description": "Os ataques com armas da esfinge são mágicos.",
          "name": "Armas Mágicas"
        },
        {
          "description": "A esfinge é uma conjuradora de 9º nível. Sua habilidade de lançar feitiços é Inteligência (resistência de feitiço CD 16, +8 para acertar com ataques de feitiço). Não requer componentes materiais para lançar seus feitiços. A esfinge tem os seguintes feitiços de mago preparados:\n\n* Truques (à vontade): mão mágica, ilusão menor, prestidigitação\n* 1º nível (4 slots): detectar magia, identificar, proteger\n* 2º nível (3 slots): escuridão, localizar objeto, sugestão\n* 3º nível (3 espaços): dissipar magia, remover maldição, línguas\n* 4º nível (3 slots): banimento, maior invisibilidade\n* 5º nível (1 slot): tradição lendária",
          "name": "Feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:horned-devil",
    "name": "Diabo Chifrudo",
    "name_en": "Horned Devil",
    "size": "Grande",
    "size_en": "Large",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "11",
    "cr_numeric": 11.0,
    "armor_class": 18,
    "hp_max": 178,
    "hp_formula": "17d10+85",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 17,
        "con": 21,
        "dex": 17,
        "int": 12,
        "str": 22,
        "wis": 16
      },
      "actions": [
        {
          "description": "O diabo faz três ataques corpo a corpo: dois com o garfo e um com a cauda. Ele pode usar Hurl Flame no lugar de qualquer ataque corpo a corpo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d8+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d8 + 6) de dano perfurante.",
          "name": "Garfo"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "1d8+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 metros, um alvo. Acerto: 10 (1d8 + 6) de dano perfurante. Se o alvo for uma criatura que não seja um morto-vivo ou um constructo, ele deve ser bem sucedido em um teste de resistência de Constituição CD 17 ou perderá 10 (3d6) pontos de vida no início de cada um de seus turnos devido a um ferimento infernal. Cada vez que o diabo atinge o alvo ferido com este ataque, o dano causado pelo ferimento aumenta em 10 (3d6). Qualquer criatura pode realizar uma ação para estancar o ferimento com um teste bem-sucedido de Sabedoria (Medicina) CD 12. A ferida também fecha se o alvo receber cura mágica.",
          "name": "Cauda"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "4d6+0",
              "type": "fire"
            }
          ],
          "description": "Ataque Mágico à Distância: +7 para acertar, alcance de 150 pés, um alvo. Acerto: 14 (4d6) de dano de fogo. Se o alvo for um objeto inflamável que não esteja sendo usado ou carregado, ele também pegará fogo.",
          "name": "Lançar Chama"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "cold; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Infernal",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "cha": 7,
        "dex": 7,
        "str": 10,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 13
      },
      "speed": {
        "voo": 60,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "A escuridão mágica não impede a visão no escuro do diabo.",
          "name": "Visão do Diabo"
        },
        {
          "description": "O diabo tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:remorhaz",
    "name": "Remorház",
    "name_en": "Remorhaz",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "11",
    "cr_numeric": 11.0,
    "armor_class": 17,
    "hp_max": 195,
    "hp_formula": "17d12+85",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 5,
        "con": 21,
        "dex": 13,
        "int": 4,
        "str": 24,
        "wis": 10
      },
      "actions": [
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "6d10+3d6+7",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 metros, um alvo. Acerto: 40 (6d10 + 7) de dano perfurante mais 10 (3d6) de dano de fogo. Se o alvo for uma criatura, ele será agarrado (CD 17 para escapar). Até o agarrão terminar, o alvo fica contido e o remorhaz não pode morder outro alvo.",
          "name": "Morder"
        },
        {
          "description": "O remorhaz realiza um ataque de mordida contra uma criatura Média ou menor que esteja agarrando. Se o ataque acertar, aquela criatura sofre o dano da mordida e é engolida, e a luta termina. Enquanto engolida, a criatura fica cega e contida, tem cobertura total contra ataques e outros efeitos fora do remorhaz e sofre 21 (6d6) de dano de ácido no início de cada turno do remorhaz.\nSe o remorhaz sofrer 30 pontos de dano ou mais em um único turno de uma criatura dentro dele, o remorhaz deve ter sucesso em um teste de resistência de Constituição CD 15 no final daquele turno ou regurgitar todas as criaturas engolidas, que caem prostradas em um espaço a até 3 metros do remorhaz. Se o remorhaz morrer, uma criatura engolida não será mais contida por ele e poderá escapar do cadáver usando 4,5 metros de movimento, saindo caída.",
          "name": "Engolir"
        }
      ],
      "damage_immunities": [
        "frio",
        "fogo"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 10,
        "percepção sísmica": 60
      },
      "speed": {
        "escavação": 20,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Uma criatura que tocar o remorhaz ou acertá-lo com um ataque corpo a corpo enquanto estiver a 1,5 metro dele sofre 10 (3d6) de dano de fogo.",
          "name": "Corpo Aquecido"
        }
      ]
    }
  },
  {
    "id": "srd:roc",
    "name": "Roca",
    "name_en": "Roc",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "11",
    "cr_numeric": 11.0,
    "armor_class": 15,
    "hp_max": 248,
    "hp_formula": "16d20+80",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 9,
        "con": 20,
        "dex": 10,
        "int": 3,
        "str": 28,
        "wis": 10
      },
      "actions": [
        {
          "description": "A roca faz dois ataques: um com o bico e outro com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 13,
          "damage": [
            {
              "dice": "4d8+9",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 3 metros, um alvo. Acerto: 27 (4d8 + 9) de dano perfurante.",
          "name": "Bico"
        },
        {
          "attack_bonus": 13,
          "damage": [
            {
              "dice": "4d6+9",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 1,5 m, um alvo. Acerto: 23 (4d6 + 9) de dano cortante e o alvo é agarrado (CD de fuga 19). Até que este agarrão termine, o alvo fica contido e a roca não pode usar suas garras em outro alvo.",
          "name": "Garras"
        }
      ],
      "saving_throws": {
        "cha": 3,
        "con": 9,
        "dex": 4,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14
      },
      "skills": {
        "Percepção": 4
      },
      "speed": {
        "voo": 120,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O roc tem vantagem em testes de Sabedoria (Percepção) que dependem da visão.",
          "name": "Visão Aguçada"
        }
      ]
    }
  },
  {
    "id": "srd:archmage",
    "name": "Arquimago",
    "name_en": "Archmage",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Humanoide",
    "type_en": "humanoid",
    "cr": "12",
    "cr_numeric": 12.0,
    "armor_class": 12,
    "hp_max": 99,
    "hp_formula": "18d8+18",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 12,
        "dex": 14,
        "int": 20,
        "str": 10,
        "wis": 15
      },
      "actions": [
        {
          "attack_bonus": 6,
          "damage": [
            {
              "dice": "1d4+2",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo ou de longo alcance com arma: +6 para acertar, alcance 1,5 m ou alcance 6/18 m, um alvo. Acerto: 4 (1d4 + 2) de dano perfurante.",
          "name": "Punhal"
        }
      ],
      "damage_resistances": [
        "damage from spells; non magical bludgeoning",
        "perfurante",
        "and slashing (from stoneskin)"
      ],
      "languages": [
        "any six languages"
      ],
      "saving_throws": {
        "int": 9,
        "wis": 6
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 12
      },
      "skills": {
        "Arcanismo": 13,
        "História": 13
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "O arquimago tem vantagem em testes de resistência contra magias e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "O arquimago é um conjurador de 18º nível. Sua habilidade de lançar feitiços é Inteligência (resistência de feitiço CD 17, +9 para acertar com ataques de feitiço). O arquimago pode lançar disfarce e invisibilidade à vontade e tem as seguintes magias de mago preparadas:\n\n* Truques (à vontade): raio de fogo, luz, mão mágica, prestidigitação, aperto chocante\n* 1º nível (4 espaços): detectar magia, identificar, armadura mágica*, míssil mágico\n* 2º nível (3 espaços): detectar pensamentos, imagem espelhada, passo enevoado\n* 3º nível (3 espaços): contrafeitiço, mosca, raio\n* 4º nível (3 espaços): banimento, escudo de fogo, pele rochosa*\n* 5º nível (3 espaços): cone de frio, vidência, parede de força\n* 6º nível (1 slot): globo de invulnerabilidade\n* 7º nível (1 slot): teletransporte\n*8º nível (1 slot): mente em branco*\n* 9º nível (1 slot): parada no tempo\n* O arquimago lança essas magias em si mesmo antes do combate.",
          "name": "Feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:erinyes",
    "name": "Erínias",
    "name_en": "Erinyes",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "12",
    "cr_numeric": 12.0,
    "armor_class": 18,
    "hp_max": 153,
    "hp_formula": "18d8+72",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 18,
        "con": 18,
        "dex": 16,
        "int": 14,
        "str": 18,
        "wis": 14
      },
      "actions": [
        {
          "description": "As erínias fazem três ataques",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 8,
          "damage": [
            {
              "dice": "1d8+3d8+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +8 para acertar, alcance 1,5 m, um alvo. Acerto: 8 (1d8 + 4) de dano cortante, ou 9 (1d10 + 4) de dano cortante se usado com as duas mãos, mais 13 (3d8) de dano venenoso.",
          "name": "Espada Longa"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "1d8+3d8+3",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +7 para acertar, alcance 150/600 pés, um alvo. Acerto: 7 (1d8 + 3) de dano perfurante mais 13 (3d8) de dano venenoso, e o alvo deve ser bem sucedido em um teste de resistência de Constituição CD 14 ou será envenenado. O veneno dura até ser removido pelo feitiço de restauração menor ou magia similar.",
          "name": "Arco longo"
        },
        {
          "description": "Algumas erínias carregam uma corda emaranhada (detalhada no Dungeon Master's Guide). Quando tal erínia usa seu Ataque Múltiplo, as erínias podem usar a corda no lugar de dois dos ataques.",
          "name": "Variante: Corda do Emaranhamento"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "cold; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Infernal",
        "telepathy 120 ft."
      ],
      "reactions": [
        {
          "description": "As erínias adicionam 4 à sua CA contra um ataque corpo a corpo que a atingiria. Para fazer isso, as erínias devem ver o atacante e estar empunhando uma arma branca.",
          "name": "Desviar"
        }
      ],
      "saving_throws": {
        "cha": 8,
        "con": 8,
        "dex": 7,
        "wis": 6
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 12,
        "visão verdadeira": 120
      },
      "speed": {
        "voo": 60,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Os ataques com armas das erínias são mágicos e causam 13 (3d8) de dano de veneno extra em um acerto (incluído nos ataques).",
          "name": "Armas Infernais"
        },
        {
          "description": "As erínias têm vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:adult-brass-dragon",
    "name": "Dragão de latão adulto",
    "name_en": "Adult Brass Dragon",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "13",
    "cr_numeric": 13.0,
    "armor_class": 18,
    "hp_max": 172,
    "hp_formula": "15d12+75",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 17,
        "con": 21,
        "dex": 10,
        "int": 14,
        "str": 23,
        "wis": 13
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d10+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 metros, um alvo. Acerto: 17 (2d10 + 6) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d6+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d6 + 6) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d8+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 4,5 metros, um alvo. Acerto: 15 (2d8 + 6) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 16 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "13d6+0",
              "type": "fire"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro de Fogo.** O dragão exala fogo em uma linha de 18 metros com 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 18, sofrendo 45 (13d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração do Sono.** O dragão exala gás do sono em um cone de 18 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 18 ou ficará inconsciente por 10 minutos. Este efeito termina para uma criatura se ela sofrer dano ou se alguém usar uma ação para acordá-la.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 3 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 19 ou sofrerá 13 (2d6 + 6) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Dragão de Bronze Adulto pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 8,
        "con": 10,
        "dex": 5,
        "wis": 6
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 21
      },
      "skills": {
        "História": 7,
        "Percepção": 11,
        "Persuasão": 8,
        "Furtividade": 5
      },
      "speed": {
        "escavação": 40,
        "voo": 80,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:adult-white-dragon",
    "name": "Dragão Branco Adulto",
    "name_en": "Adult White Dragon",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "13",
    "cr_numeric": 13.0,
    "armor_class": 18,
    "hp_max": 200,
    "hp_formula": "16d12+96",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 22,
        "dex": 10,
        "int": 8,
        "str": 22,
        "wis": 12
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d10+1d8+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 metros, um alvo. Acerto: 17 (2d10 + 6) de dano perfurante mais 4 (1d8) de dano de frio.",
          "name": "Morder"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d6+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d6 + 6) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d8+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 4,5 metros, um alvo. Acerto: 15 (2d8 + 6) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 14 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "12d8+0",
              "type": "cold"
            }
          ],
          "description": "O dragão exala uma explosão gelada em um cone de 18 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 19, sofrendo 54 (12d8) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Frio (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "frio"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 3 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 19 ou sofrerá 13 (2d6 + 6) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Dragão Branco Adulto pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 6,
        "con": 11,
        "dex": 5,
        "wis": 6
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 21
      },
      "skills": {
        "Percepção": 11,
        "Furtividade": 5
      },
      "speed": {
        "escavação": 30,
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode se mover e escalar superfícies geladas sem precisar fazer um teste de habilidade. Além disso, terreno difícil composto de gelo ou neve não custa movimento extra.",
          "name": "Caminhada no Gelo"
        },
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:nalfeshnee",
    "name": "Nalfeshnee",
    "name_en": "Nalfeshnee",
    "size": "Grande",
    "size_en": "Large",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "13",
    "cr_numeric": 13.0,
    "armor_class": 18,
    "hp_max": 184,
    "hp_formula": "16d10+96",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 15,
        "con": 22,
        "dex": 10,
        "int": 19,
        "str": 21,
        "wis": 12
      },
      "actions": [
        {
          "description": "O nalfeshnee usa Horror Nimbus se puder. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "5d10+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1,5 m, um alvo. Acerto: 32 (5d10 + 5) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "3d6+5",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 metros, um alvo. Acerto: 15 (3d6 + 5) de dano cortante.",
          "name": "Garra"
        },
        {
          "description": "O nalfeshnee emite magicamente luz cintilante e multicolorida. Cada criatura a até 4,5 metros do nalfeshnee que puder ver a luz deve ser bem sucedida em um teste de resistência de Sabedoria CD 15 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune ao Horror Nimbus do nalfeshnee pelas próximas 24 horas.",
          "name": "Horror Nimbus (recarga 5-6)"
        },
        {
          "description": "O nalfeshnee se teletransporta magicamente, junto com qualquer equipamento que esteja usando ou carregando, até 36 metros para um espaço desocupado que possa ver.",
          "name": "Teleporte"
        },
        {
          "description": "O demônio escolhe o que invocar e tenta uma invocação mágica.\nUm nalfeshnee tem 50% de chance de invocar 1d4 vrocks, 1d3 hezrous, 1d2 glabrezus ou um nalfeshnee.\nUm demônio invocado aparece em um espaço desocupado a até 18 metros de seu invocador, age como um aliado de seu invocador e não pode invocar outros demônios. Ela permanece por 1 minuto, até que ela ou seu invocador morra, ou até que seu invocador a dispense como uma ação.",
          "name": "Variante: Convocar Demônio (1/Dia)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "frio",
        "fogo",
        "lightning; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Abissal",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "cha": 7,
        "con": 11,
        "int": 9,
        "wis": 6
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 11,
        "visão verdadeira": 120
      },
      "speed": {
        "voo": 30,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O nalfeshnee tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:rakshasa",
    "name": "Rakshasa",
    "name_en": "Rakshasa",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "13",
    "cr_numeric": 13.0,
    "armor_class": 16,
    "hp_max": 110,
    "hp_formula": "13d8+52",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 20,
        "con": 18,
        "dex": 17,
        "int": 13,
        "str": 14,
        "wis": 16
      },
      "actions": [
        {
          "description": "O rakshasa faz dois ataques de garra",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "2d6+2",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 9 (2d6 + 2) de dano cortante e o alvo é amaldiçoado se for uma criatura. A maldição mágica entra em vigor sempre que o alvo faz um descanso curto ou longo, enchendo os pensamentos do alvo com imagens e sonhos horríveis. O alvo amaldiçoado não ganha nenhum benefício ao terminar um descanso curto ou longo. A maldição dura até ser eliminada por um feitiço de remoção de maldição ou magia semelhante.",
          "name": "Garra"
        }
      ],
      "damage_immunities": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "damage_vulnerabilities": [
        "piercing from magic weapons wielded by good creatures"
      ],
      "languages": [
        "Comum",
        "Infernal"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 13
      },
      "skills": {
        "Enganação": 10,
        "Intuição": 8
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O rakshasa não pode ser afetado ou detectado por magias de 6º nível ou inferior, a menos que deseje. Tem vantagem em testes de resistência contra todos os outros feitiços e efeitos mágicos.",
          "name": "Imunidade Mágica Limitada"
        },
        {
          "description": "A habilidade inata de conjuração do rakshasa é Carisma (resistência de magia CD 18, +10 para acertar com ataques de magia). O rakshasa pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\n\nÀ vontade: detectar pensamentos, disfarçar-se, mão mágica, ilusão menor\n3/dia cada: encantar pessoa, detectar magia, invisibilidade, imagem principal, sugestão\n1/dia cada: dominar pessoa, voar, mudar de avião, ver a verdade",
          "name": "Feitiço Inato"
        }
      ]
    }
  },
  {
    "id": "srd:storm-giant",
    "name": "Gigante da Tempestade",
    "name_en": "Storm Giant",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Gigante",
    "type_en": "giant",
    "cr": "13",
    "cr_numeric": 13.0,
    "armor_class": 16,
    "hp_max": 230,
    "hp_formula": "20d12+100",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 18,
        "con": 20,
        "dex": 14,
        "int": 16,
        "str": 29,
        "wis": 18
      },
      "actions": [
        {
          "description": "O gigante faz dois ataques com espada larga.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "6d6+9",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 metros, um alvo. Acerto: 30 (6d6 + 9) de dano cortante.",
          "name": "Espada larga"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "4d12+9",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque com arma de longo alcance: +14 para acertar, alcance 60/240 pés, um alvo. Acerto: 35 (4d12 + 9) de dano de concussão.",
          "name": "Pedra"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "12d8+0",
              "type": "lightning"
            }
          ],
          "description": "O gigante lança um raio mágico em um ponto que pode ver, a até 150 metros dele. Cada criatura a até 3 metros desse ponto deve realizar um teste de resistência de Destreza CD 17, sofrendo 54 (12d8) de dano elétrico se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Relâmpago (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "elétrico",
        "trovejante"
      ],
      "damage_resistances": [
        "frio"
      ],
      "languages": [
        "Comum",
        "Gigante"
      ],
      "saving_throws": {
        "cha": 9,
        "con": 10,
        "str": 14,
        "wis": 9
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 19
      },
      "skills": {
        "Arcanismo": 8,
        "Atletismo": 14,
        "História": 8,
        "Percepção": 9
      },
      "speed": {
        "natação": 50,
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "O gigante pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "A habilidade inata de conjuração do gigante é Carisma (resistência de magia CD 17). Ele pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\n\nÀ vontade: detectar magia, queda de penas, levitar, iluminar\n3/dia cada: controle o clima, respiração na água",
          "name": "Feitiço Inato"
        }
      ]
    }
  },
  {
    "id": "srd:vampire",
    "name": "Vampiro",
    "name_en": "Vampire",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "13",
    "cr_numeric": 13.0,
    "armor_class": 16,
    "hp_max": 144,
    "hp_formula": "17d8+68",
    "initiative_modifier": 4,
    "stat_block_json": {
      "ability_scores": {
        "cha": 18,
        "con": 18,
        "dex": 18,
        "int": 17,
        "str": 18,
        "wis": 15
      },
      "actions": [
        {
          "description": "O vampiro faz dois ataques, dos quais apenas um pode ser um ataque de mordida.",
          "name": "Multiataque (somente forma de vampiro)"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "1d8+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 1,5 m, uma criatura. Acerto: 8 (1d8 + 4) de dano de concussão. Em vez de causar dano, o vampiro pode agarrar o alvo (CD 18 para escapar).",
          "name": "Ataque Desarmado (Somente na Forma de Vampiro)"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "1d6+3d6+4",
              "type": "piercing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +9 para atingir, alcance 1,5 m, uma criatura voluntária ou uma criatura que esteja agarrada pelo vampiro, incapacitada ou contida. Acerto: 7 (1d6 + 4) de dano perfurante mais 10 (3d6) de dano necrótico. O máximo de pontos de vida do alvo é reduzido em uma quantidade igual ao dano necrótico recebido, e o vampiro recupera pontos de vida iguais a essa quantidade. A redução dura até o alvo terminar um descanso longo. O alvo morre se este efeito reduzir seu máximo de pontos de vida para 0. Um humanóide morto desta forma e então enterrado no chão ressuscita na noite seguinte como um vampiro gerado sob o controle do vampiro.",
          "name": "Mordida (somente na forma de morcego ou vampiro)"
        },
        {
          "description": "O vampiro tem como alvo um humanóide que possa ver a até 9 metros dele. Se o alvo puder ver o vampiro, o alvo deve ser bem sucedido em um teste de resistência de Sabedoria CD 17 contra esta magia ou será enfeitiçado pelo vampiro. O alvo encantado considera o vampiro um amigo confiável que deve ser respeitado e protegido. Embora o alvo não esteja sob o controle do vampiro, ele atende aos pedidos ou ações do vampiro da maneira mais favorável possível e é um alvo voluntário para o ataque de mordida do vampiro.\nCada vez que o vampiro ou seus companheiros fizerem algo prejudicial ao alvo, ele poderá repetir o teste de resistência, encerrando o efeito sobre si mesmo com sucesso. Caso contrário, o efeito dura 24 horas ou até que o vampiro seja destruído, esteja em um plano de existência diferente do alvo ou execute uma ação bônus para encerrar o efeito.",
          "name": "Charme"
        },
        {
          "description": "O vampiro invoca magicamente 2d4 enxames de morcegos ou ratos, desde que o sol ainda não tenha nascido. Enquanto estiver ao ar livre, o vampiro pode chamar 3d6 lobos. As criaturas chamadas chegam em 1d4 rodadas, agindo como aliadas do vampiro e obedecendo aos seus comandos falados. As feras permanecem por 1 hora, até que o vampiro morra, ou até que o vampiro as dispense como uma ação bônus.",
          "name": "Filhos da Noite (1/Dia)"
        }
      ],
      "damage_resistances": [
        "necrotic; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "the languages it knew in life"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O vampiro se move até sua velocidade sem provocar ataques de oportunidade.",
            "name": "Mover"
          },
          {
            "cost": 1,
            "description": "O vampiro desfere um ataque desarmado.",
            "name": "Ataque Desarmado"
          },
          {
            "cost": 2,
            "description": "O vampiro faz um ataque de mordida.",
            "name": "Mordida (custa 2 ações)"
          }
        ],
        "description": "O Vampiro pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 9,
        "dex": 9,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 17
      },
      "skills": {
        "Percepção": 7,
        "Furtividade": 9
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Se o vampiro não estiver sob a luz do sol ou em água corrente, ele pode usar sua ação para se transformar em um morcego minúsculo ou em uma nuvem média de névoa, ou retornar à sua forma verdadeira.\nEnquanto estiver na forma de morcego, o vampiro não pode falar, seu deslocamento de caminhada é de 1,5 metro e seu deslocamento de vôo é de 9 metros. Suas estatísticas, exceto tamanho e velocidade, permanecem inalteradas. Qualquer coisa que ele esteja vestindo se transforma com ele, mas nada que ele esteja carregando o faz. Ele reverte à sua verdadeira forma se morrer.\nEnquanto estiver na forma de névoa, o vampiro não pode realizar nenhuma ação, falar ou manipular objetos. Ele não tem peso, tem deslocamento de vôo de 6 metros, pode pairar e entrar no espaço de uma criatura hostil e parar ali. Além disso, se o ar puder passar através de um espaço, a névoa poderá fazê-lo sem ser comprimida e não poderá passar pela água. Ele tem vantagem nos testes de resistência de Força, Destreza e Constituição, e é imune a todos os danos não mágicos, exceto o dano que sofre da luz solar.",
          "name": "Metamorfo"
        },
        {
          "description": "Se o vampiro falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        },
        {
          "description": "Quando ele cai a 0 pontos de vida fora de seu local de descanso, o vampiro se transforma em uma nuvem de névoa (como na característica Metamorfo) em vez de cair inconsciente, desde que não esteja sob a luz do sol ou em água corrente. Se não puder se transformar, será destruído.\nEmbora tenha 0 pontos de vida na forma de névoa, ele não pode voltar à sua forma de vampiro e deve chegar ao seu local de descanso dentro de 2 horas ou será destruído. Uma vez em seu local de descanso, ele volta à sua forma de vampiro. Ele fica então paralisado até recuperar pelo menos 1 ponto de vida. Após passar 1 hora em seu local de descanso com 0 pontos de vida, ele recupera 1 ponto de vida.",
          "name": "Fuga Enevoada"
        },
        {
          "description": "O vampiro recupera 20 pontos de vida no início do seu turno se tiver pelo menos 1 ponto de vida e não estiver exposto à luz do sol ou em água corrente. Se o vampiro sofrer dano radiante ou de água benta, esta característica não funciona no início do próximo turno do vampiro.",
          "name": "Regeneração"
        },
        {
          "description": "O vampiro pode escalar superfícies difíceis, inclusive tetos de cabeça para baixo, sem precisar fazer um teste de habilidade.",
          "name": "Escalada de aranha"
        },
        {
          "description": "O vampiro tem as seguintes falhas:\nProibição. O vampiro não pode entrar numa residência sem convite de um dos ocupantes.\nPrejudicado por água corrente. O vampiro sofre 20 de dano ácido se terminar seu turno em água corrente.\nAposte no coração. Se uma arma perfurante feita de madeira for cravada no coração do vampiro enquanto o vampiro estiver incapacitado em seu local de descanso, o vampiro ficará paralisado até que a estaca seja removida.\nHipersensibilidade à luz solar. O vampiro sofre 20 de dano radiante quando inicia seu turno sob a luz do sol. Enquanto estiver sob a luz do sol, tem desvantagem em jogadas de ataque e testes de habilidade.",
          "name": "Fraquezas dos Vampiros"
        }
      ]
    }
  },
  {
    "id": "srd:adult-black-dragon",
    "name": "Dragão Negro Adulto",
    "name_en": "Adult Black Dragon",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "14",
    "cr_numeric": 14.0,
    "armor_class": 19,
    "hp_max": 195,
    "hp_formula": "17d12+85",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 17,
        "con": 21,
        "dex": 14,
        "int": 14,
        "str": 23,
        "wis": 13
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d10+1d8+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 metros, um alvo. Acerto: 17 (2d10 + 6) de dano perfurante mais 4 (1d8) de dano ácido.",
          "name": "Morder"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d6+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d6 + 6) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d8+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 4,5 metros, um alvo. Acerto: 15 (2d8 + 6) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 16 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "12d8+0",
              "type": "acid"
            }
          ],
          "description": "O dragão exala ácido em uma linha de 18 metros e 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 18, sofrendo 54 (12d8) de dano de ácido se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Ácido (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "ácido"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 3 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 19 ou sofrerá 13 (2d6 + 6) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Dragão Negro Adulto pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 8,
        "con": 10,
        "dex": 7,
        "wis": 6
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 21
      },
      "skills": {
        "Percepção": 11,
        "Furtividade": 7
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:adult-copper-dragon",
    "name": "Dragão de Cobre Adulto",
    "name_en": "Adult Copper Dragon",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "14",
    "cr_numeric": 14.0,
    "armor_class": 18,
    "hp_max": 184,
    "hp_formula": "16d12+80",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 17,
        "con": 21,
        "dex": 12,
        "int": 18,
        "str": 23,
        "wis": 15
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d10+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 metros, um alvo. Acerto: 17 (2d10 + 6) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d6+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d6 + 6) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d8+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 4,5 metros, um alvo. Acerto: 15 (2d8 + 6) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 16 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "12d8+0",
              "type": "acid"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro Ácido.** O dragão exala ácido em uma linha de 18 metros com 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 18, sofrendo 54 (12d8) de dano de ácido se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração lenta.** O dragão exala gás em um cone de 18 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 18. Se falhar, a criatura não pode usar reações, sua velocidade é reduzida à metade e ela não pode realizar mais de um ataque por turno. Além disso, a criatura pode usar uma ação ou uma ação bônus no seu turno, mas não ambas. Esses efeitos duram 1 minuto. A criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma com um teste de resistência bem-sucedido.",
          "name": "Armas de Sopro (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "ácido"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 3 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 19 ou sofrerá 13 (2d6 + 6) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Dragão de Cobre Adulto pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 8,
        "con": 10,
        "dex": 6,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 22
      },
      "skills": {
        "Enganação": 8,
        "Percepção": 12,
        "Furtividade": 6
      },
      "speed": {
        "escalada": 40,
        "voo": 80,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:ice-devil",
    "name": "Diabo de Gelo",
    "name_en": "Ice Devil",
    "size": "Grande",
    "size_en": "Large",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "14",
    "cr_numeric": 14.0,
    "armor_class": 18,
    "hp_max": 180,
    "hp_formula": "19d10+76",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 18,
        "con": 18,
        "dex": 14,
        "int": 18,
        "str": 21,
        "wis": 15
      },
      "actions": [
        {
          "description": "O diabo faz três ataques: um com a mordida, outro com as garras e outro com a cauda.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d6+3d6+5",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1,5 m, um alvo. Acerto: 12 (2d6 + 5) de dano perfurante mais 10 (3d6) de dano de frio.",
          "name": "Morder"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d4+3d6+5",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 1,5 m, um alvo. Acerto: 10 (2d4 + 5) de dano cortante mais 10 (3d6) de dano de frio.",
          "name": "Garras"
        },
        {
          "attack_bonus": 10,
          "damage": [
            {
              "dice": "2d6+3d6+5",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +10 para acertar, alcance 3 metros, um alvo. Acerto: 12 (2d6 + 5) de dano de concussão mais 10 (3d6) de dano de frio.",
          "name": "Cauda"
        },
        {
          "description": "O diabo forma magicamente uma parede opaca de gelo em uma superfície sólida que pode ver a até 18 metros dela. A parede tem 30 centímetros de espessura e até 9 metros de comprimento e 3 metros de altura, ou é uma cúpula hemisférica de até 6 metros de diâmetro.\nQuando a parede aparece, cada criatura em seu espaço é empurrada para fora dela pelo caminho mais curto. A criatura escolhe em que lado da parede irá parar, a menos que a criatura esteja incapacitada. A criatura então faz um teste de resistência de Destreza CD 17, sofrendo 35 (10d6) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso.\nA parede dura 1 minuto ou até que o demônio fique incapacitado ou morra. A parede pode ser danificada e rompida; cada seção de 3 metros tem CA 5, 30 pontos de vida, vulnerabilidade a dano de fogo e imunidade a dano ácido, frio, necrótico, venenoso e psíquico. Se uma seção for destruída, ela deixa para trás uma camada de ar gelado no espaço que a parede ocupava. Sempre que uma criatura termina de se mover pelo ar gelado em um turno, voluntariamente ou não, a criatura deve realizar um teste de resistência de Constituição CD 17, sofrendo 17 (5d6) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso. O ar gelado se dissipa quando o resto da parede desaparece.",
          "name": "Parede de Gelo"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "contundente",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Infernal",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "cha": 9,
        "con": 9,
        "dex": 7,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 12
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "A escuridão mágica não impede a visão no escuro do diabo.",
          "name": "Visão do Diabo"
        },
        {
          "description": "O diabo tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:adult-bronze-dragon",
    "name": "Dragão de Bronze Adulto",
    "name_en": "Adult Bronze Dragon",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "15",
    "cr_numeric": 15.0,
    "armor_class": 19,
    "hp_max": 212,
    "hp_formula": "17d12+102",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 19,
        "con": 23,
        "dex": 10,
        "int": 16,
        "str": 25,
        "wis": 15
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 12,
          "damage": [
            {
              "dice": "2d10+7",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 3 metros, um alvo. Acerto: 18 (2d10 + 7) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 12,
          "damage": [
            {
              "dice": "2d6+7",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 1,5 m, um alvo. Acerto: 14 (2d6 + 7) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 12,
          "damage": [
            {
              "dice": "2d8+7",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 4,5 metros, um alvo. Acerto: 16 (2d8 + 7) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 17 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "12d10+0",
              "type": "lightning"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro Relâmpago.** O dragão exala relâmpagos em uma linha de 27 metros com 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 19, sofrendo 66 (12d10) de dano elétrico se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Sopro de Repulsão.** O dragão exala energia de repulsão em um cone de 9 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Força CD 19. Se falhar na resistência, a criatura é empurrada para 18 metros de distância do dragão.",
          "name": "Armas de Sopro (Recarga 5-6)"
        },
        {
          "description": "O dragão se transforma magicamente em um humanóide ou besta que tem um nível de desafio não superior ao seu, ou retorna à sua forma verdadeira. Ele reverte à sua verdadeira forma se morrer. Qualquer equipamento que ele esteja vestindo ou carregando é absorvido ou suportado pela nova forma (a escolha do dragão).\nEm uma nova forma, o dragão mantém seu alinhamento, pontos de vida, Dados de Vida, habilidade de falar, proficiências, Resistência Lendária, ações de covil e valores de Inteligência, Sabedoria e Carisma, bem como esta ação. Suas estatísticas e capacidades serão substituídas pelas da nova forma, exceto quaisquer características de classe ou ações lendárias dessa forma.",
          "name": "Alterar forma"
        }
      ],
      "damage_immunities": [
        "elétrico"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 3 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 20 ou sofrerá 14 (2d6 + 7) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Dragão de Bronze Adulto pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 9,
        "con": 11,
        "dex": 5,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 22
      },
      "skills": {
        "Intuição": 7,
        "Percepção": 12,
        "Furtividade": 5
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:adult-green-dragon",
    "name": "Dragão Verde Adulto",
    "name_en": "Adult Green Dragon",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "15",
    "cr_numeric": 15.0,
    "armor_class": 19,
    "hp_max": 207,
    "hp_formula": "18d12+90",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 17,
        "con": 21,
        "dex": 12,
        "int": 18,
        "str": 23,
        "wis": 15
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d10+2d6+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 3 metros, um alvo. Acerto: 17 (2d10 + 6) de dano perfurante mais 7 (2d6) de dano venenoso.",
          "name": "Morder"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d6+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d6 + 6) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 11,
          "damage": [
            {
              "dice": "2d8+6",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +11 para acertar, alcance 4,5 metros, um alvo. Acerto: 15 (2d8 + 6) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 16 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "16d6+0",
              "type": "poison"
            }
          ],
          "description": "O dragão exala gás venenoso em um cone de 18 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 18, sofrendo 56 (16d6) de dano de veneno se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Venenoso (Recarga 5-6)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 3 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 19 ou sofrerá 13 (2d6 + 6) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Dragão Verde Adulto pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 8,
        "con": 10,
        "dex": 6,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 22
      },
      "skills": {
        "Enganação": 8,
        "Intuição": 7,
        "Percepção": 12,
        "Persuasão": 8,
        "Furtividade": 6
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:mummy-lord",
    "name": "Senhor múmia",
    "name_en": "Mummy Lord",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "15",
    "cr_numeric": 15.0,
    "armor_class": 17,
    "hp_max": 97,
    "hp_formula": "13d8+39",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 17,
        "dex": 10,
        "int": 11,
        "str": 18,
        "wis": 18
      },
      "actions": [
        {
          "description": "A múmia pode usar seu brilho terrível e fazer um ataque com seu punho podre.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "3d6+6d6+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +9 para acertar, alcance 1,5 m, um alvo. Acerto: 14 (3d6 + 4) de dano de concussão mais 21 (6d6) de dano necrótico. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Constituição CD 16 ou será amaldiçoado com podridão de múmia. O alvo amaldiçoado não pode recuperar pontos de vida e seu máximo de pontos de vida diminui em 10 (3d6) a cada 24 horas decorridas. Se a maldição reduzir o máximo de pontos de vida do alvo a 0, o alvo morre e seu corpo vira pó. A maldição dura até ser removida pelo feitiço remover maldição ou outra magia.",
          "name": "Punho Apodrecido"
        },
        {
          "description": "O senhor múmia tem como alvo uma criatura que ele possa ver a até 18 metros dele. Se o alvo puder ver o senhor múmia, ele deverá ser bem sucedido em um teste de resistência de Sabedoria CD 16 contra esta magia ou ficará assustado até o final do próximo turno da múmia. Se o alvo falhar no teste de resistência por 5 ou mais, ele também ficará paralisado pela mesma duração. Um alvo bem-sucedido no teste de resistência fica imune ao Brilho Terrível de todas as múmias e senhores das múmias pelas próximas 24 horas.",
          "name": "Brilho Terrível"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado",
        "Paralisado",
        "Envenenado"
      ],
      "damage_immunities": [
        "necrótico",
        "poison; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "damage_vulnerabilities": [
        "contundente"
      ],
      "languages": [
        "the languages it knew in life"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O senhor múmia faz um ataque com seu punho podre ou usa seu brilho terrível.",
            "name": "Ataque"
          },
          {
            "cost": 1,
            "description": "Poeira e areia ofuscantes giram magicamente em torno do senhor múmia. Cada criatura a até 1,5 metro do senhor múmia deve ser bem sucedida em um teste de resistência de Constituição CD 16 ou ficará cega até o final do próximo turno da criatura.",
            "name": "Poeira Cegante"
          },
          {
            "cost": 2,
            "description": "O senhor múmia pronuncia uma palavra blasfema. Cada criatura não-morta a até 3 metros do senhor múmia que puder ouvir a expressão mágica deve ser bem sucedida em um teste de resistência de Constituição CD 16 ou ficará atordoada até o final do próximo turno do senhor múmia.",
            "name": "Palavra Blasfema (custa 2 ações)"
          },
          {
            "cost": 2,
            "description": "O senhor múmia libera magicamente energia negativa. Criaturas a até 18 metros do senhor múmia, incluindo aquelas atrás de barreiras e em cantos, não podem recuperar pontos de vida até o final do próximo turno do senhor múmia.",
            "name": "Canalizar energia negativa (custa 2 ações)"
          },
          {
            "cost": 2,
            "description": "O senhor múmia transforma-se magicamente em um redemoinho de areia, move-se até 18 metros e volta à sua forma normal. Enquanto estiver na forma de redemoinho, o senhor múmia é imune a todos os danos e não pode ser agarrado, petrificado, derrubado, contido ou atordoado. Equipamentos usados ​​ou carregados pelo senhor múmia permanecem em sua posse.",
            "name": "Redemoinho de Areia (custa 2 ações)"
          }
        ],
        "description": "O Lorde Múmia pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 8,
        "con": 8,
        "int": 5,
        "wis": 9
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 60,
        "percepção passiva": 14
      },
      "skills": {
        "História": 5,
        "Religião": 5
      },
      "speed": {
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O senhor múmia tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Um lorde múmia destruído ganha um novo corpo em 24 horas se seu coração estiver intacto, recuperando todos os seus pontos de vida e tornando-se ativo novamente. O novo corpo aparece a 1,5 metro do coração do senhor múmia.",
          "name": "Rejuvenescimento"
        },
        {
          "description": "O senhor múmia é um feiticeiro de 10º nível. Sua habilidade de lançar feitiços é Sabedoria (resistência de feitiço CD 17, +9 para acertar com ataques de feitiço). O senhor múmia preparou os seguintes feitiços de clérigo:\n\n* Truques (à vontade): chama sagrada, taumaturgia\n* 1º nível (4 slots): comando, parafuso guia, escudo da fé\n* 2º nível (3 slots): segurar pessoa, silêncio, arma espiritual\n* 3º nível (3 espaços): animar mortos, dissipar magia\n* 4º nível (3 espaços): adivinhação, guardião da fé\n* 5º nível (2 espaços): contágio, praga de insetos\n* 6º nível (1 slot): dano",
          "name": "Feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:purple-worm",
    "name": "Verme Roxo",
    "name_en": "Purple Worm",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "15",
    "cr_numeric": 15.0,
    "armor_class": 18,
    "hp_max": 247,
    "hp_formula": "15d20+90",
    "initiative_modifier": -2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 4,
        "con": 22,
        "dex": 7,
        "int": 1,
        "str": 28,
        "wis": 8
      },
      "actions": [
        {
          "description": "O verme faz dois ataques: um com a mordida e outro com o ferrão.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "3d8+9",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 metros, um alvo. Acerto: 22 (3d8 + 9) de dano perfurante. Se o alvo for uma criatura Grande ou menor, ele deve ser bem sucedido em um teste de resistência de Destreza CD 19 ou será engolido pelo verme. Uma criatura engolida fica cega e impedida, tem cobertura total contra ataques e outros efeitos fora do verme e sofre 21 (6d6) de dano ácido no início de cada turno do verme.\nSe o verme sofrer 30 de dano ou mais em um único turno de uma criatura dentro dele, o verme deve ser bem sucedido em um teste de resistência de Constituição CD 21 no final daquele turno ou regurgitar todas as criaturas engolidas, que cairão prostradas em um espaço a até 3 metros do verme. Se o verme morrer, a criatura engolida não será mais contida por ele e poderá escapar do cadáver usando 6 metros de movimento, saindo caída.",
          "name": "Morder"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "3d6+9",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 metros, uma criatura. Acerto: 19 (3d6 + 9) de dano perfurante, e o alvo deve realizar um teste de resistência de Constituição CD 19, sofrendo 42 (12d6) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso.",
          "name": "Ferrão de cauda"
        }
      ],
      "saving_throws": {
        "con": 11,
        "wis": 4
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 30,
        "percepção passiva": 9,
        "percepção sísmica": 60
      },
      "speed": {
        "escavação": 30,
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "O verme pode escavar rocha sólida com metade de sua velocidade de escavação e deixar um túnel de 3 metros de diâmetro em seu rastro.",
          "name": "Tunelizador"
        }
      ]
    }
  },
  {
    "id": "srd:adult-blue-dragon",
    "name": "Dragão Azul Adulto",
    "name_en": "Adult Blue Dragon",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "16",
    "cr_numeric": 16.0,
    "armor_class": 19,
    "hp_max": 225,
    "hp_formula": "18d12+108",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 19,
        "con": 23,
        "dex": 10,
        "int": 16,
        "str": 25,
        "wis": 15
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 12,
          "damage": [
            {
              "dice": "2d10+1d10+7",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 3 metros, um alvo. Acerto: 18 (2d10 + 7) de dano perfurante mais 5 (1d10) de dano elétrico.",
          "name": "Morder"
        },
        {
          "attack_bonus": 12,
          "damage": [
            {
              "dice": "2d6+7",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 1,5 m, um alvo. Acerto: 14 (2d6 + 7) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 12,
          "damage": [
            {
              "dice": "2d8+7",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 4,5 metros, um alvo. Acerto: 16 (2d8 + 7) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 17 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "12d10+0",
              "type": "lightning"
            }
          ],
          "description": "O dragão exala relâmpagos em uma linha de 27 metros com 1,5 metro de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 19, sofrendo 66 (12d10) de dano elétrico se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro Relâmpago (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "elétrico"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 3 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 20 ou sofrerá 14 (2d6 + 7) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Dragão Azul Adulto pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 9,
        "con": 11,
        "dex": 5,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 22
      },
      "skills": {
        "Percepção": 12,
        "Furtividade": 5
      },
      "speed": {
        "escavação": 30,
        "voo": 80,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:adult-silver-dragon",
    "name": "Dragão Prateado Adulto",
    "name_en": "Adult Silver Dragon",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "16",
    "cr_numeric": 16.0,
    "armor_class": 19,
    "hp_max": 243,
    "hp_formula": "18d12+126",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 21,
        "con": 25,
        "dex": 10,
        "int": 16,
        "str": 27,
        "wis": 13
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 13,
          "damage": [
            {
              "dice": "2d10+8",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 3 metros, um alvo. Acerto: 19 (2d10 + 8) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 13,
          "damage": [
            {
              "dice": "2d6+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 1,5 m, um alvo. Acerto: 15 (2d6 + 8) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 13,
          "damage": [
            {
              "dice": "2d8+8",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 4,5 metros, um alvo. Acerto: 17 (2d8 + 8) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 18 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "13d8+0",
              "type": "cold"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Respiração Fria.** O dragão exala uma explosão gelada em um cone de 18 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 20, sofrendo 58 (13d8) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração Paralisante.** O dragão exala gás paralisante em um cone de 18 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 20 ou ficará paralisada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.",
          "name": "Armas de Sopro (Recarga 5-6)"
        },
        {
          "description": "O dragão se transforma magicamente em um humanóide ou besta que tem um nível de desafio não superior ao seu, ou retorna à sua forma verdadeira. Ele reverte à sua verdadeira forma se morrer. Qualquer equipamento que ele esteja vestindo ou carregando é absorvido ou suportado pela nova forma (a escolha do dragão).\nEm uma nova forma, o dragão mantém seu alinhamento, pontos de vida, Dados de Vida, habilidade de falar, proficiências, Resistência Lendária, ações de covil e valores de Inteligência, Sabedoria e Carisma, bem como esta ação. Suas estatísticas e capacidades serão substituídas pelas da nova forma, exceto quaisquer características de classe ou ações lendárias dessa forma.",
          "name": "Alterar forma"
        }
      ],
      "damage_immunities": [
        "frio"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 3 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 22 ou sofrerá 15 (2d6 + 8) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Dragão Prateado Adulto pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 10,
        "con": 12,
        "dex": 5,
        "wis": 6
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 21
      },
      "skills": {
        "Arcanismo": 8,
        "História": 8,
        "Percepção": 11,
        "Furtividade": 5
      },
      "speed": {
        "voo": 80,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:iron-golem",
    "name": "Golem de Ferro",
    "name_en": "Iron Golem",
    "size": "Grande",
    "size_en": "Large",
    "type": "Constructo",
    "type_en": "construct",
    "cr": "16",
    "cr_numeric": 16.0,
    "armor_class": 20,
    "hp_max": 210,
    "hp_formula": "20d10+100",
    "initiative_modifier": -1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 1,
        "con": 20,
        "dex": 9,
        "int": 3,
        "str": 24,
        "wis": 11
      },
      "actions": [
        {
          "description": "O golem faz dois ataques corpo a corpo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 13,
          "damage": [
            {
              "dice": "3d8+7",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 1,5 m, um alvo. Acerto: 20 (3d8 + 7) de dano de concussão.",
          "name": "Bater"
        },
        {
          "attack_bonus": 13,
          "damage": [
            {
              "dice": "3d10+7",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 3 metros, um alvo. Sucesso: 23 (3d10 + 7) de dano cortante.",
          "name": "Espada"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "10d8+0",
              "type": "poison"
            }
          ],
          "description": "O golem exala gás venenoso em um cone de 4,5 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 19, sofrendo 45 (10d8) de dano de veneno se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Venenoso (Recarga 5-6)"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado",
        "Paralisado",
        "Petrificado",
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno",
        "psychic; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with adamantine weapons"
      ],
      "languages": [
        "understands the languages of its creator but can't speak"
      ],
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Sempre que o golem for sujeito a dano de fogo, ele não sofrerá nenhum dano e, em vez disso, recuperará um número de pontos de vida igual ao dano de fogo causado.",
          "name": "Absorção de Fogo"
        },
        {
          "description": "O golem é imune a qualquer feitiço ou efeito que altere sua forma.",
          "name": "Forma Imutável"
        },
        {
          "description": "O golem tem vantagem em testes de resistência contra magias e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Os ataques com armas do golem são mágicos.",
          "name": "Armas Mágicas"
        }
      ]
    }
  },
  {
    "id": "srd:marilith",
    "name": "Marilith",
    "name_en": "Marilith",
    "size": "Grande",
    "size_en": "Large",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "16",
    "cr_numeric": 16.0,
    "armor_class": 18,
    "hp_max": 189,
    "hp_formula": "18d10+90",
    "initiative_modifier": 5,
    "stat_block_json": {
      "ability_scores": {
        "cha": 20,
        "con": 20,
        "dex": 20,
        "int": 18,
        "str": 18,
        "wis": 16
      },
      "actions": [
        {
          "description": "A Marilith pode fazer sete ataques: seis com espadas longas e um com cauda.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "2d8+4",
              "type": "slashing"
            }
          ],
          "description": "Ataque Corpo a Corpo com Arma: +9 para acertar, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano cortante.",
          "name": "Espada Longa"
        },
        {
          "attack_bonus": 9,
          "damage": [
            {
              "dice": "2d10+4",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +9 para acertar, alcance 3 metros, uma criatura. Acerto: 15 (2d10 + 4) de dano de concussão. Se o alvo for Médio ou menor, ele será agarrado (CD 19 para escapar). Até que esta luta termine, o alvo fica contido, a marilith pode acertá-lo automaticamente com sua cauda e a marilith não pode fazer ataques de cauda contra outros alvos.",
          "name": "Cauda"
        },
        {
          "description": "A marilith se teletransporta magicamente, junto com qualquer equipamento que esteja usando ou carregando, até 36 metros para um espaço desocupado que possa ver.",
          "name": "Teleporte"
        },
        {
          "description": "O demônio escolhe o que invocar e tenta uma invocação mágica.\nUma Marilith tem 50% de chance de invocar 1d6 vrocks, 1d4 hezrous, 1d3 glabrezus, 1d2 nalfeshnees ou uma marilith.\nUm demônio invocado aparece em um espaço desocupado a até 18 metros de seu invocador, age como um aliado de seu invocador e não pode invocar outros demônios. Ela permanece por 1 minuto, até que ela ou seu invocador morra, ou até que seu invocador a dispense como uma ação.",
          "name": "Variante: Convocar Demônio (1/Dia)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "damage_resistances": [
        "frio",
        "fogo",
        "lightning; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Abissal",
        "telepathy 120 ft."
      ],
      "reactions": [
        {
          "description": "A Marilith adiciona 5 à sua CA contra um ataque corpo a corpo que a atingiria. Para fazer isso, a Marilith deve ver o atacante e estar empunhando uma arma branca.",
          "name": "Desviar"
        }
      ],
      "saving_throws": {
        "cha": 10,
        "con": 10,
        "str": 9,
        "wis": 8
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13,
        "visão verdadeira": 120
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "A Marilith tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Os ataques com armas da Marilith são mágicos.",
          "name": "Armas Mágicas"
        },
        {
          "description": "A Marilith pode realizar uma reação a cada turno de combate.",
          "name": "Reativo"
        }
      ]
    }
  },
  {
    "id": "srd:planetar",
    "name": "Planetário",
    "name_en": "Planetar",
    "size": "Grande",
    "size_en": "Large",
    "type": "Celestial",
    "type_en": "celestial",
    "cr": "16",
    "cr_numeric": 16.0,
    "armor_class": 19,
    "hp_max": 200,
    "hp_formula": "16d10+112",
    "initiative_modifier": 5,
    "stat_block_json": {
      "ability_scores": {
        "cha": 25,
        "con": 24,
        "dex": 20,
        "int": 19,
        "str": 24,
        "wis": 22
      },
      "actions": [
        {
          "description": "O planetário faz dois ataques corpo a corpo.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 12,
          "damage": [
            {
              "dice": "4d6+5d8+7",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 1,5 m, um alvo. Acerto: 21 (4d6 + 7) de dano cortante mais 22 (5d8) de dano radiante.",
          "name": "Espada larga"
        },
        {
          "description": "O planetário toca outra criatura. O alvo recupera magicamente 30 (6d8 + 3) pontos de vida e fica livre de qualquer maldição, doença, veneno, cegueira ou surdez.",
          "name": "Toque de Cura (4/dia)"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado"
      ],
      "damage_resistances": [
        "radiant; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "all",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "cha": 12,
        "con": 12,
        "wis": 11
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 21,
        "visão verdadeira": 120
      },
      "skills": {
        "Percepção": 11
      },
      "speed": {
        "voo": 120,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Os ataques com armas do planetário são mágicos. Quando o planetário atinge qualquer arma, a arma causa 5d8 de dano radiante extra (incluído no ataque).",
          "name": "Armas Angelicais"
        },
        {
          "description": "O planetário sabe se ouve uma mentira.",
          "name": "Consciência Divina"
        },
        {
          "description": "A habilidade de conjuração do planetário é Carisma (resistência ao feitiço CD 20). O planetário pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\nÀ vontade: detectar o mal e o bem, invisibilidade (somente para si mesmo)\n3/dia cada: barreira de lâmina, dissipar o mal e o bem, golpe de chamas, ressuscitar mortos\n1/dia cada: comuna, controle do clima, praga de insetos",
          "name": "Feitiço Inato"
        },
        {
          "description": "O planetário tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:adult-gold-dragon",
    "name": "Dragão Dourado Adulto",
    "name_en": "Adult Gold Dragon",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "17",
    "cr_numeric": 17.0,
    "armor_class": 19,
    "hp_max": 256,
    "hp_formula": "19d12+133",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 24,
        "con": 25,
        "dex": 14,
        "int": 16,
        "str": 27,
        "wis": 15
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d10+8",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 metros, um alvo. Acerto: 19 (2d10 + 8) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d6+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 1,5 m, um alvo. Acerto: 15 (2d6 + 8) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d8+8",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 4,5 metros, um alvo. Acerto: 17 (2d8 + 8) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 21 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "12d10+0",
              "type": "fire"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro de Fogo.** O dragão exala fogo em um cone de 18 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 21, sofrendo 66 (12d10) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração Enfraquecedora.** O dragão exala gás em um cone de 18 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Força CD 21 ou terá desvantagem em jogadas de ataque baseadas em Força, testes de Força e testes de resistência de Força por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.",
          "name": "Armas de Sopro (Recarga 5-6)"
        },
        {
          "description": "O dragão se transforma magicamente em um humanóide ou besta que tem um nível de desafio não superior ao seu, ou retorna à sua forma verdadeira. Ele reverte à sua verdadeira forma se morrer. Qualquer equipamento que ele esteja vestindo ou carregando é absorvido ou suportado pela nova forma (a escolha do dragão).\nEm uma nova forma, o dragão mantém seu alinhamento, pontos de vida, Dados de Vida, habilidade de falar, proficiências, Resistência Lendária, ações de covil e valores de Inteligência, Sabedoria e Carisma, bem como esta ação. Suas estatísticas e capacidades serão substituídas pelas da nova forma, exceto quaisquer características de classe ou ações lendárias dessa forma.",
          "name": "Alterar forma"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 3 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 22 ou sofrerá 15 (2d6 + 8) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Dragão Dourado Adulto pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 13,
        "con": 13,
        "dex": 8,
        "wis": 8
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 24
      },
      "skills": {
        "Intuição": 8,
        "Percepção": 14,
        "Persuasão": 13,
        "Furtividade": 8
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:adult-red-dragon",
    "name": "Dragão Vermelho Adulto",
    "name_en": "Adult Red Dragon",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "17",
    "cr_numeric": 17.0,
    "armor_class": 19,
    "hp_max": 256,
    "hp_formula": "19d12+133",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 21,
        "con": 25,
        "dex": 10,
        "int": 16,
        "str": 27,
        "wis": 13
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d10+2d6+8",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 metros, um alvo. Acerto: 19 (2d10 + 8) de dano perfurante mais 7 (2d6) de dano de fogo.",
          "name": "Morder"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d6+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 1,5 m, um alvo. Acerto: 15 (2d6 + 8) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d8+8",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 4,5 metros, um alvo. Acerto: 17 (2d8 + 8) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 19 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "18d6+0",
              "type": "fire"
            }
          ],
          "description": "O dragão exala fogo em um cone de 18 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 21, sofrendo 63 (18d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro de Fogo (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 3 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 22 ou sofrerá 15 (2d6 + 8) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Dragão Vermelho Adulto pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 11,
        "con": 13,
        "dex": 6,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 23
      },
      "skills": {
        "Percepção": 13,
        "Furtividade": 6
      },
      "speed": {
        "escalada": 40,
        "voo": 80,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:androsphinx",
    "name": "Androesfinge",
    "name_en": "Androsphinx",
    "size": "Grande",
    "size_en": "Large",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "17",
    "cr_numeric": 17.0,
    "armor_class": 17,
    "hp_max": 199,
    "hp_formula": "19d10+95",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 23,
        "con": 20,
        "dex": 10,
        "int": 16,
        "str": 22,
        "wis": 18
      },
      "actions": [
        {
          "description": "A esfinge faz dois ataques de garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 12,
          "damage": [
            {
              "dice": "2d10+6",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +12 para acertar, alcance 1,5 m, um alvo. Acerto: 17 (2d10 + 6) de dano cortante.",
          "name": "Garra"
        },
        {
          "description": "A esfinge emite um rugido mágico. Cada vez que ele ruge antes de terminar um descanso longo, o rugido fica mais alto e o efeito é diferente, conforme detalhado a seguir. Cada criatura a até 150 metros da esfinge e capaz de ouvir o rugido deve fazer um teste de resistência.\n**Primeiro Rugido.** Cada criatura que falhar em um teste de resistência de Sabedoria CD 18 fica assustada por 1 minuto. Uma criatura assustada pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.\n**Segundo Rugido.** Cada criatura que falhar em um teste de resistência de Sabedoria CD 18 fica ensurdecida e assustada por 1 minuto. Uma criatura assustada fica paralisada e pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.\n**Terceiro Rugido.** Cada criatura realiza um teste de resistência de Constituição CD 18. Se falhar na resistência, a criatura sofre 44 (8d10) de dano trovejante e é derrubada. Se obtiver sucesso, a criatura sofre metade do dano e não é derrubada.",
          "name": "Rugido (3/dia)"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado"
      ],
      "damage_immunities": [
        "psychic; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Comum",
        "Sphinx"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "A esfinge faz um ataque de garra.",
            "name": "Ataque de garra"
          },
          {
            "cost": 2,
            "description": "A esfinge se teletransporta magicamente, junto com qualquer equipamento que esteja usando ou carregando, até 36 metros para um espaço desocupado que possa ver.",
            "name": "Teleporte (custa 2 ações)"
          },
          {
            "cost": 3,
            "description": "A esfinge conjura uma magia de sua lista de magias preparadas, usando um espaço de magia normalmente.",
            "name": "Lançar um feitiço (custa 3 ações)"
          }
        ],
        "description": "A Androsfinge pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "con": 11,
        "dex": 6,
        "int": 9,
        "wis": 10
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 20,
        "visão verdadeira": 120
      },
      "skills": {
        "Arcanismo": 9,
        "Percepção": 10,
        "Religião": 15
      },
      "speed": {
        "voo": 60,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "A esfinge é imune a qualquer efeito que possa sentir suas emoções ou ler seus pensamentos, bem como qualquer feitiço de adivinhação que ela recuse. Testes de Sabedoria (Intuição) feitos para verificar as intenções ou sinceridade da esfinge têm desvantagem.",
          "name": "Inescrutável"
        },
        {
          "description": "Os ataques com armas da esfinge são mágicos.",
          "name": "Armas Mágicas"
        },
        {
          "description": "A esfinge é uma conjuradora de 12º nível. Sua habilidade de lançar feitiços é Sabedoria (resistência de feitiço CD 18, +10 para acertar com ataques de feitiço). Não requer componentes materiais para lançar seus feitiços. A esfinge possui os seguintes feitiços de clérigo preparados:\n\n* Truques (à vontade): chama sagrada, poupar os moribundos, taumaturgia\n* 1º nível (4 slots): comandar, detectar o mal e o bem, detectar magia\n* 2º nível (3 slots): restauração menor, zona da verdade\n* 3º nível (3 espaços): dissipar magia, línguas\n* 4º nível (3 slots): banimento, liberdade de movimento\n* 5º nível (2 espaços): ataque de chamas, restauração maior\n* 6º nível (1 slot): banquete dos heróis",
          "name": "Feitiços"
        }
      ]
    }
  },
  {
    "id": "srd:dragon-turtle",
    "name": "Tartaruga Dragão",
    "name_en": "Dragon Turtle",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "17",
    "cr_numeric": 17.0,
    "armor_class": 20,
    "hp_max": 341,
    "hp_formula": "22d20+110",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 12,
        "con": 20,
        "dex": 10,
        "int": 10,
        "str": 25,
        "wis": 12
      },
      "actions": [
        {
          "description": "A tartaruga dragão faz três ataques: um com a mordida e dois com as garras. Ele pode fazer um ataque de cauda no lugar de seus dois ataques de garra.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 13,
          "damage": [
            {
              "dice": "3d12+7",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 4,5 metros, um alvo. Acerto: 26 (3d12 + 7) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 13,
          "damage": [
            {
              "dice": "2d8+7",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 3 metros, um alvo. Sucesso: 16 (2d8 + 7) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 13,
          "damage": [
            {
              "dice": "3d12+7",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +13 para acertar, alcance 4,5 metros, um alvo. Acerto: 26 (3d12 + 7) de dano de concussão. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 20 ou será empurrado até 3 metros de distância da tartaruga dragão e derrubado.",
          "name": "Cauda"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "15d6+0",
              "type": "fire"
            }
          ],
          "description": "A tartaruga dragão exala vapor escaldante em um cone de 18 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 18, sofrendo 52 (15d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso. Estar debaixo d'água não concede resistência contra esse dano.",
          "name": "Respiração a Vapor (Recarga 5-6)"
        }
      ],
      "damage_resistances": [
        "fogo"
      ],
      "languages": [
        "Aquan",
        "Dracônico"
      ],
      "saving_throws": {
        "con": 11,
        "dex": 6,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "visão no escuro": 120,
        "percepção passiva": 11
      },
      "speed": {
        "natação": 40,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "A tartaruga dragão pode respirar ar e água.",
          "name": "Anfíbio"
        }
      ]
    }
  },
  {
    "id": "srd:balor",
    "name": "Balor",
    "name_en": "Balor",
    "size": "Enorme",
    "size_en": "Huge",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "19",
    "cr_numeric": 19.0,
    "armor_class": 19,
    "hp_max": 262,
    "hp_formula": "21d12+126",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 22,
        "con": 22,
        "dex": 15,
        "int": 20,
        "str": 26,
        "wis": 16
      },
      "actions": [
        {
          "description": "O balor faz dois ataques: um com sua espada longa e outro com seu chicote.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "3d8+3d8+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 metros, um alvo. Acerto: 21 (3d8 + 8) de dano cortante mais 13 (3d8) de dano elétrico. Se o balor obtiver um acerto crítico, ele lançará os dados de dano três vezes, em vez de duas.",
          "name": "Espada Longa"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d6+3d6+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 9 metros, um alvo. Acerto: 15 (2d6 + 8) de dano cortante mais 10 (3d6) de dano de fogo, e o alvo deve ser bem sucedido em um teste de resistência de Força CD 20 ou será puxado até 7,5 metros em direção ao balor.",
          "name": "Chicote"
        },
        {
          "description": "O balor se teletransporta magicamente, junto com qualquer equipamento que esteja usando ou carregando, até 36 metros para um espaço desocupado que possa ver.",
          "name": "Teleporte"
        },
        {
          "description": "O demônio escolhe o que invocar e tenta uma invocação mágica.\nUm balor tem 50% de chance de invocar 1d8 vrocks, 1d6 hezrous, 1d4 glabrezus, 1d3 nalfeshnees, 1d2 mariliths ou um goristro.\nUm demônio invocado aparece em um espaço desocupado a até 18 metros de seu invocador, age como um aliado de seu invocador e não pode invocar outros demônios. Ela permanece por 1 minuto, até que ela ou seu invocador morra, ou até que seu invocador a dispense como uma ação.",
          "name": "Variante: Convocar Demônio (1/Dia)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "frio",
        "lightning; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "Abissal",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "cha": 12,
        "con": 12,
        "str": 14,
        "wis": 9
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 13,
        "visão verdadeira": 120
      },
      "speed": {
        "voo": 80,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Quando o balor morre, ele explode, e cada criatura a até 9 metros dele deve realizar um teste de resistência de Destreza CD 20, sofrendo 70 (20d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso. A explosão incendeia objetos inflamáveis ​​naquela área que não estão sendo usados ​​ou carregados e destrói as armas do balor.",
          "name": "Agonizantes da Morte"
        },
        {
          "description": "No início de cada turno do balor, cada criatura a até 1,5 metro dele sofre 10 (3d6) de dano de fogo e objetos inflamáveis ​​na aura que não estão sendo usados ​​ou carregados se incendeiam. Uma criatura que tocar o balor ou acertá-lo com um ataque corpo a corpo enquanto estiver a 1,5 metro dele sofre 10 (3d6) de dano de fogo.",
          "name": "Aura de Fogo"
        },
        {
          "description": "O balor tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Os ataques com armas do balor são mágicos.",
          "name": "Armas Mágicas"
        }
      ]
    }
  },
  {
    "id": "srd:ancient-brass-dragon",
    "name": "Dragão de Latão Antigo",
    "name_en": "Ancient Brass Dragon",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "20",
    "cr_numeric": 20.0,
    "armor_class": 20,
    "hp_max": 297,
    "hp_formula": "17d20+119",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 19,
        "con": 25,
        "dex": 10,
        "int": 16,
        "str": 27,
        "wis": 15
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d10+8",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 4,5 metros, um alvo. Acerto: 19 (2d10 + 8) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d6+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d6 + 8) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d8+8",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 6 metros, um alvo. Acerto: 17 (2d8 + 8) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 18 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "16d6+0",
              "type": "fire"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro:\n**Sopro de Fogo.** O dragão exala fogo em uma linha de 27 metros com 3 metros de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 21, sofrendo 56 (16d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração do Sono.** O dragão exala gás do sono em um cone de 27 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 21 ou ficará inconsciente por 10 minutos. Este efeito termina para uma criatura se ela sofrer dano ou se alguém usar uma ação para acordá-la.",
          "name": "Armas de Sopro (Recarga 5-6)"
        },
        {
          "description": "O dragão se transforma magicamente em um humanóide ou besta que tem um nível de desafio não superior ao seu, ou retorna à sua forma verdadeira. Ele reverte à sua verdadeira forma se morrer. Qualquer equipamento que ele esteja vestindo ou carregando é absorvido ou suportado pela nova forma (a escolha do dragão).\nEm uma nova forma, o dragão mantém seu alinhamento, pontos de vida, Dados de Vida, habilidade de falar, proficiências, Resistência Lendária, ações de covil e valores de Inteligência, Sabedoria e Carisma, bem como esta ação. Suas estatísticas e capacidades serão substituídas pelas da nova forma, exceto quaisquer características de classe ou ações lendárias dessa forma.",
          "name": "Alterar forma"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 4,5 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 22 ou sofrerá 15 (2d6 + 8) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Dragão Ancestral de Bronze pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 10,
        "con": 13,
        "dex": 6,
        "wis": 8
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 24
      },
      "skills": {
        "História": 9,
        "Percepção": 14,
        "Persuasão": 10,
        "Furtividade": 6
      },
      "speed": {
        "escavação": 40,
        "voo": 80,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:ancient-white-dragon",
    "name": "Dragão Branco Antigo",
    "name_en": "Ancient White Dragon",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "20",
    "cr_numeric": 20.0,
    "armor_class": 20,
    "hp_max": 333,
    "hp_formula": "18d20+144",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 14,
        "con": 26,
        "dex": 10,
        "int": 10,
        "str": 26,
        "wis": 13
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d10+2d8+8",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 4,5 metros, um alvo. Acerto: 19 (2d10 + 8) de dano perfurante mais 9 (2d8) de dano de frio.",
          "name": "Morder"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d6+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d6 + 8) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d8+8",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 6 metros, um alvo. Acerto: 17 (2d8 + 8) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 16 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "16d8+0",
              "type": "cold"
            }
          ],
          "description": "O dragão exala uma explosão gelada em um cone de 27 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 22, sofrendo 72 (16d8) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Frio (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "frio"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 4,5 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 22 ou sofrerá 15 (2d6 + 8) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Antigo Dragão Branco pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 8,
        "con": 14,
        "dex": 6,
        "wis": 7
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 23
      },
      "skills": {
        "Percepção": 13,
        "Furtividade": 6
      },
      "speed": {
        "escavação": 40,
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode se mover e escalar superfícies geladas sem precisar fazer um teste de habilidade. Além disso, terreno difícil composto de gelo ou neve não custa movimento extra.",
          "name": "Caminhada no Gelo"
        },
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:pit-fiend",
    "name": "Demônio do Poço",
    "name_en": "Pit Fiend",
    "size": "Grande",
    "size_en": "Large",
    "type": "Ínfero",
    "type_en": "fiend",
    "cr": "20",
    "cr_numeric": 20.0,
    "armor_class": 19,
    "hp_max": 300,
    "hp_formula": "24d10+168",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 24,
        "con": 24,
        "dex": 14,
        "int": 22,
        "str": 26,
        "wis": 18
      },
      "actions": [
        {
          "description": "O pit fiend faz quatro ataques: um com a mordida, um com a garra, um com a maça e um com a cauda.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "4d6+8",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 1,5 m, um alvo. Acerto: 22 (4d6 + 8) de dano perfurante. O alvo deve ser bem sucedido em um teste de resistência de Constituição CD 21 ou ficará envenenado. Enquanto estiver envenenado desta forma, o alvo não pode recuperar pontos de vida e sofre 21 (6d6) de dano de veneno no início de cada um de seus turnos. O alvo envenenado pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso.",
          "name": "Morder"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d8+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 metros, um alvo. Sucesso: 17 (2d8 + 8) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "2d6+8",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d6 + 8) de dano de concussão mais 21 (6d6) de dano de fogo.",
          "name": "Mace"
        },
        {
          "attack_bonus": 14,
          "damage": [
            {
              "dice": "3d10+8",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +14 para acertar, alcance 3 metros, um alvo. Acerto: 24 (3d10 + 8) de dano de concussão.",
          "name": "Cauda"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "veneno"
      ],
      "damage_resistances": [
        "cold; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks not made with silvered weapons"
      ],
      "languages": [
        "Infernal",
        "telepathy 120 ft."
      ],
      "saving_throws": {
        "con": 13,
        "dex": 8,
        "wis": 10
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14,
        "visão verdadeira": 120
      },
      "speed": {
        "voo": 60,
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Qualquer criatura hostil ao pit fiend que comece seu turno a até 6 metros dele deve realizar um teste de resistência de Sabedoria CD 21, a menos que o pit fiend esteja incapacitado. Se falhar na resistência, a criatura fica assustada até o início do seu próximo turno. Se o teste de resistência de uma criatura for bem-sucedido, a criatura ficará imune à Aura de Medo do pit fiend pelas próximas 24 horas.",
          "name": "Aura do Medo"
        },
        {
          "description": "O pit fiend tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Os ataques com armas do pit fiend são mágicos.",
          "name": "Armas Mágicas"
        },
        {
          "description": "A habilidade de lançar feitiços do pit fiend é Carisma (resistência ao feitiço CD 21). O pit fiend pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\nÀ vontade: detectar magia, bola de fogo\n3/dia cada: segurar monstro, parede de fogo",
          "name": "Feitiço Inato"
        }
      ]
    }
  },
  {
    "id": "srd:ancient-black-dragon",
    "name": "Dragão Negro Antigo",
    "name_en": "Ancient Black Dragon",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "21",
    "cr_numeric": 21.0,
    "armor_class": 22,
    "hp_max": 367,
    "hp_formula": "21d20+147",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 19,
        "con": 25,
        "dex": 14,
        "int": 16,
        "str": 27,
        "wis": 15
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 15,
          "damage": [
            {
              "dice": "2d10+2d8+8",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 4,5 metros, um alvo. Acerto: 19 (2d10 + 8) de dano perfurante mais 9 (2d8) de dano ácido.",
          "name": "Morder"
        },
        {
          "attack_bonus": 15,
          "damage": [
            {
              "dice": "2d6+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d6 + 8) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 15,
          "damage": [
            {
              "dice": "2d8+8",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 6 metros, um alvo. Acerto: 17 (2d8 + 8) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 19 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "description": "O dragão exala ácido em uma linha de 27 metros com 3 metros de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 22, sofrendo 67 (15d8) de dano de ácido se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Ácido (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "ácido"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 4,5 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 23 ou sofrerá 15 (2d6 + 8) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Antigo Dragão Negro pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 11,
        "con": 14,
        "dex": 9,
        "wis": 9
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 26
      },
      "skills": {
        "Percepção": 16,
        "Furtividade": 9
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:ancient-copper-dragon",
    "name": "Dragão de Cobre Antigo",
    "name_en": "Ancient Copper Dragon",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "21",
    "cr_numeric": 21.0,
    "armor_class": 21,
    "hp_max": 350,
    "hp_formula": "20d20+140",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 19,
        "con": 25,
        "dex": 12,
        "int": 20,
        "str": 27,
        "wis": 17
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 15,
          "damage": [
            {
              "dice": "2d10+8",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 4,5 metros, um alvo. Acerto: 19 (2d10 + 8) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 15,
          "damage": [
            {
              "dice": "2d6+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 3 metros, um alvo. Acerto: 15 (2d6 + 8) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 15,
          "damage": [
            {
              "dice": "2d8+8",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 6 metros, um alvo. Acerto: 17 (2d8 + 8) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 19 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "14d8+0",
              "type": "acid"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro Ácido.** O dragão exala ácido em uma linha de 27 metros com 3 metros de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 22, sofrendo 63 (14d8) de dano de ácido se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração lenta.** O dragão exala gás em um cone de 27 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 22. Se falhar, a criatura não pode usar reações, sua velocidade é reduzida à metade e ela não pode realizar mais de um ataque por turno. Além disso, a criatura pode usar uma ação ou uma ação bônus no seu turno, mas não ambas. Esses efeitos duram 1 minuto. A criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma com um teste de resistência bem-sucedido.",
          "name": "Armas de Sopro (Recarga 5-6)"
        },
        {
          "description": "O dragão se transforma magicamente em um humanóide ou besta que tem um nível de desafio não superior ao seu, ou retorna à sua forma verdadeira. Ele reverte à sua verdadeira forma se morrer. Qualquer equipamento que ele esteja vestindo ou carregando é absorvido ou suportado pela nova forma (a escolha do dragão).\nEm uma nova forma, o dragão mantém seu alinhamento, pontos de vida, Dados de Vida, habilidade de falar, proficiências, Resistência Lendária, ações de covil e valores de Inteligência, Sabedoria e Carisma, bem como esta ação. Suas estatísticas e capacidades serão substituídas pelas da nova forma, exceto quaisquer características de classe ou ações lendárias dessa forma.",
          "name": "Alterar forma"
        }
      ],
      "damage_immunities": [
        "ácido"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 4,5 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 23 ou sofrerá 15 (2d6 + 8) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Antigo Dragão de Cobre pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 11,
        "con": 14,
        "dex": 8,
        "wis": 10
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 27
      },
      "skills": {
        "Enganação": 11,
        "Percepção": 17,
        "Furtividade": 8
      },
      "speed": {
        "escalada": 40,
        "voo": 80,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:lich",
    "name": "Lich",
    "name_en": "Lich",
    "size": "Médio",
    "size_en": "Medium",
    "type": "Morto-vivo",
    "type_en": "undead",
    "cr": "21",
    "cr_numeric": 21.0,
    "armor_class": 17,
    "hp_max": 135,
    "hp_formula": "18d8+54",
    "initiative_modifier": 3,
    "stat_block_json": {
      "ability_scores": {
        "cha": 16,
        "con": 16,
        "dex": 16,
        "int": 20,
        "str": 11,
        "wis": 14
      },
      "actions": [
        {
          "attack_bonus": 12,
          "damage": [
            {
              "dice": "3d6+0",
              "type": "cold"
            }
          ],
          "description": "Ataque Mágico Corpo a Corpo: +12 para acertar, alcance 1,5 m, uma criatura. Acerto: 10 (3d6) de dano de frio. O alvo deve ser bem sucedido em um teste de resistência de Constituição CD 18 ou ficará paralisado por 1 minuto. O alvo pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso.",
          "name": "Toque Paralisante"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado",
        "Paralisado",
        "Envenenado"
      ],
      "damage_immunities": [
        "poison; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "damage_resistances": [
        "frio",
        "elétrico",
        "necrótico"
      ],
      "languages": [
        "Common plus up to five other languages"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O lich lança um truque.",
            "name": "Truque"
          },
          {
            "cost": 2,
            "description": "O lich usa seu Toque Paralisante.",
            "name": "Toque Paralisante (custa 2 ações)"
          },
          {
            "cost": 2,
            "description": "O lich fixa seu olhar em uma criatura que possa ver a até 3 metros dele. O alvo deve ser bem sucedido em um teste de resistência de Sabedoria CD 18 contra esta magia ou ficará assustado por 1 minuto. O alvo assustado pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesmo se obtiver sucesso. Se o teste de resistência de um alvo for bem sucedido ou o efeito terminar, o alvo fica imune ao olhar do lich pelas próximas 24 horas.",
            "name": "Olhar Assustador (custa 2 ações)"
          },
          {
            "cost": 3,
            "description": "Cada criatura não-morta a até 6 metros do lich deve realizar um teste de resistência de Constituição CD 18 contra esta magia, sofrendo 21 (6d6) de dano necrótico se falhar na resistência, ou metade do dano se obtiver sucesso.",
            "name": "Perturbar a vida (custa 3 ações)"
          }
        ],
        "description": "O Lich pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "con": 10,
        "int": 12,
        "wis": 9
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 19,
        "visão verdadeira": 120
      },
      "skills": {
        "Arcanismo": 19,
        "História": 12,
        "Intuição": 9,
        "Percepção": 9
      },
      "speed": {
        "deslocamento": 30
      },
      "traits": [
        {
          "description": "Se o lich falhar em um teste de resistência, ele pode optar por ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        },
        {
          "description": "Se possuir um filactério, um lich destruído ganha um novo corpo em 1d10 dias, recuperando todos os seus pontos de vida e tornando-se ativo novamente. O novo corpo aparece a 1,5 metro do filactério.",
          "name": "Rejuvenescimento"
        },
        {
          "description": "O lich é um conjurador de 18º nível. Sua habilidade de lançar feitiços é Inteligência (CD de resistência de feitiço 20, +12 para acertar com ataques de feitiço). O lich tem os seguintes feitiços de mago preparados:\n\n* Truques (à vontade): mão mágica, prestidigitação, raio de gelo\n* 1º nível (4 slots): detectar magia, míssil mágico, escudo, onda trovejante\n* 2º nível (3 slots): detectar pensamentos, invisibilidade, flecha ácida, imagem espelhada\n* 3º nível (3 espaços): animar mortos, contrafeitiço, dissipar magia, bola de fogo\n* 4º nível (3 slots): praga, porta dimensional\n* 5º nível (3 slots): Cloudkill, Vidência\n* 6º nível (1 slot): desintegrar, globo de invulnerabilidade\n* 7º nível (1 slot): dedo da morte, mudança de plano\n* 8º nível (1 slot): dominar monstro, palavra de poder atordoar\n* 9º nível (1 slot): palavra de poder matar",
          "name": "Feitiços"
        },
        {
          "description": "O lich tem vantagem em testes de resistência contra qualquer efeito que expulse mortos-vivos.",
          "name": "Resistência de giro"
        }
      ]
    }
  },
  {
    "id": "srd:solar",
    "name": "Solar",
    "name_en": "Solar",
    "size": "Grande",
    "size_en": "Large",
    "type": "Celestial",
    "type_en": "celestial",
    "cr": "21",
    "cr_numeric": 21.0,
    "armor_class": 21,
    "hp_max": 243,
    "hp_formula": "18d10+144",
    "initiative_modifier": 6,
    "stat_block_json": {
      "ability_scores": {
        "cha": 30,
        "con": 26,
        "dex": 22,
        "int": 25,
        "str": 26,
        "wis": 25
      },
      "actions": [
        {
          "description": "O solar faz dois ataques com espada larga.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 15,
          "damage": [
            {
              "dice": "4d6+6d8+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 1,5 m, um alvo. Acerto: 22 (4d6 + 8) de dano cortante mais 27 (6d8) de dano radiante.",
          "name": "Espada larga"
        },
        {
          "attack_bonus": 13,
          "damage": [
            {
              "dice": "2d8+6d8+6",
              "type": "piercing"
            }
          ],
          "description": "Ataque com arma de longo alcance: +13 para acertar, alcance 150/600 pés, um alvo. Acerto: 15 (2d8 + 6) de dano perfurante mais 27 (6d8) de dano radiante. Se o alvo for uma criatura que tenha 190 pontos de vida ou menos, ele deverá ser bem sucedido em um teste de resistência de Constituição CD 15 ou morrerá.",
          "name": "Matando Arco Longo"
        },
        {
          "description": "O solar libera sua espada larga para pairar magicamente em um espaço desocupado a até 1,5 metro dele. Se o solar puder ver a espada, o solar pode comandá-la mentalmente como uma ação bônus para voar até 15 metros e fazer um ataque contra um alvo ou retornar às mãos do solar. Se a espada flutuante for alvo de algum efeito, considera-se que o solar a está segurando. A espada flutuante cai se o solar morrer.",
          "name": "Espada Voadora"
        },
        {
          "description": "O solar toca outra criatura. O alvo recupera magicamente 40 (8d8 + 4) pontos de vida e fica livre de qualquer maldição, doença, veneno, cegueira ou surdez.",
          "name": "Toque de Cura (4/dia)"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Exausto",
        "Amedrontado",
        "Envenenado"
      ],
      "damage_immunities": [
        "necrótico",
        "veneno"
      ],
      "damage_resistances": [
        "radiant; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "all",
        "telepathy 120 ft."
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O solar se teletransporta magicamente, junto com qualquer equipamento que esteja usando ou carregando, até 36 metros para um espaço desocupado que possa ver.",
            "name": "Teleporte"
          },
          {
            "cost": 2,
            "description": "O solar emite energia mágica e divina. Cada criatura de sua escolha em um raio de 3 metros deve realizar um teste de resistência de Destreza CD 23, sofrendo 14 (4d6) de dano de fogo mais 14 (4d6) de dano radiante se falhar na resistência, ou metade desse dano se obtiver sucesso.",
            "name": "Explosão Abrasadora (custa 2 ações)"
          },
          {
            "cost": 3,
            "description": "O solar tem como alvo uma criatura que possa ver a até 9 metros dele. Se o alvo puder vê-lo, ele deve ser bem sucedido em um teste de resistência de Constituição CD 15 ou ficará cego até que magia como a magia restauração menor remova a cegueira.",
            "name": "Olhar Cegante (custa 3 ações)"
          }
        ],
        "description": "O Solar pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 17,
        "int": 14,
        "wis": 14
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 24,
        "visão verdadeira": 120
      },
      "skills": {
        "Percepção": 14
      },
      "speed": {
        "voo": 150,
        "deslocamento": 50
      },
      "traits": [
        {
          "description": "Os ataques com armas do solar são mágicos. Quando o solar atinge qualquer arma, a arma causa 6d8 de dano radiante extra (incluído no ataque).",
          "name": "Armas Angelicais"
        },
        {
          "description": "O solar sabe se ouve uma mentira.",
          "name": "Consciência Divina"
        },
        {
          "description": "A habilidade de lançar feitiços do solar é Carisma (resistência ao feitiço CD 25). Ele pode conjurar inatamente os seguintes feitiços, não necessitando de componentes materiais:\nÀ vontade: detectar o mal e o bem, invisibilidade (somente para si mesmo)\n3/dia cada: barreira de lâmina, dissipar o mal e o bem, ressurreição\n1/dia cada: comuna, controle do clima",
          "name": "Feitiço Inato"
        },
        {
          "description": "O solar tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        }
      ]
    }
  },
  {
    "id": "srd:ancient-bronze-dragon",
    "name": "Dragão de Bronze Antigo",
    "name_en": "Ancient Bronze Dragon",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "22",
    "cr_numeric": 22.0,
    "armor_class": 22,
    "hp_max": 444,
    "hp_formula": "24d20+192",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 21,
        "con": 27,
        "dex": 10,
        "int": 18,
        "str": 29,
        "wis": 17
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 16,
          "damage": [
            {
              "dice": "2d10+9",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 4,5 metros, um alvo. Acerto: 20 (2d10 + 9) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 16,
          "damage": [
            {
              "dice": "1d6+9",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 3 metros, um alvo. Acerto: 16 (2d6 + 9) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 16,
          "damage": [
            {
              "dice": "2d8+9",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 6 metros, um alvo. Acerto: 18 (2d8 + 9) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 20 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "16d10+0",
              "type": "lightning"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro Relâmpago.** O dragão exala relâmpagos em uma linha de 36 metros com 3 metros de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 23, sofrendo 88 (16d10) de dano elétrico se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Sopro de Repulsão.** O dragão exala energia de repulsão em um cone de 9 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Força CD 23. Se falhar na resistência, a criatura é empurrada para 18 metros de distância do dragão.",
          "name": "Armas de Sopro (Recarga 5-6)"
        },
        {
          "description": "O dragão se transforma magicamente em um humanóide ou besta que tem um nível de desafio não superior ao seu, ou retorna à sua forma verdadeira. Ele reverte à sua verdadeira forma se morrer. Qualquer equipamento que ele esteja vestindo ou carregando é absorvido ou suportado pela nova forma (a escolha do dragão).\nEm uma nova forma, o dragão mantém seu alinhamento, pontos de vida, Dados de Vida, habilidade de falar, proficiências, Resistência Lendária, ações de covil e valores de Inteligência, Sabedoria e Carisma, bem como esta ação. Suas estatísticas e capacidades serão substituídas pelas da nova forma, exceto quaisquer características de classe ou ações lendárias dessa forma.",
          "name": "Alterar forma"
        }
      ],
      "damage_immunities": [
        "elétrico"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 4,5 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 24 ou sofrerá 16 (2d6 + 9) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Antigo Dragão de Bronze pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 12,
        "con": 15,
        "dex": 7,
        "wis": 10
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 27
      },
      "skills": {
        "Intuição": 10,
        "Percepção": 17,
        "Furtividade": 7
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:ancient-green-dragon",
    "name": "Dragão Verde Antigo",
    "name_en": "Ancient Green Dragon",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "22",
    "cr_numeric": 22.0,
    "armor_class": 21,
    "hp_max": 385,
    "hp_formula": "22d20+154",
    "initiative_modifier": 1,
    "stat_block_json": {
      "ability_scores": {
        "cha": 19,
        "con": 25,
        "dex": 12,
        "int": 20,
        "str": 27,
        "wis": 17
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 15,
          "damage": [
            {
              "dice": "2d10+3d6+9",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 4,5 metros, um alvo. Acerto: 19 (2d10 + 8) de dano perfurante mais 10 (3d6) de dano venenoso.",
          "name": "Morder"
        },
        {
          "attack_bonus": 15,
          "damage": [
            {
              "dice": "4d6+8",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 3 metros, um alvo. Acerto: 22 (4d6 + 8) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 15,
          "damage": [
            {
              "dice": "2d8+8",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +15 para acertar, alcance 6 metros, um alvo. Acerto: 17 (2d8 + 8) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 19 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "22d6+0",
              "type": "poison"
            }
          ],
          "description": "O dragão exala gás venenoso em um cone de 27 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 22, sofrendo 77 (22d6) de dano de veneno se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Hálito Venenoso (Recarga 5-6)"
        }
      ],
      "condition_immunities": [
        "Envenenado"
      ],
      "damage_immunities": [
        "veneno"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 4,5 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 23 ou sofrerá 15 (2d6 + 8) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Antigo Dragão Verde pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 11,
        "con": 14,
        "dex": 8,
        "wis": 10
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 27
      },
      "skills": {
        "Enganação": 11,
        "Intuição": 10,
        "Percepção": 17,
        "Persuasão": 11,
        "Furtividade": 8
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:ancient-blue-dragon",
    "name": "Dragão Azul Antigo",
    "name_en": "Ancient Blue Dragon",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "23",
    "cr_numeric": 23.0,
    "armor_class": 22,
    "hp_max": 481,
    "hp_formula": "26d20+208",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 21,
        "con": 27,
        "dex": 10,
        "int": 18,
        "str": 29,
        "wis": 17
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 16,
          "damage": [
            {
              "dice": "2d10+2d10+9",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 4,5 metros, um alvo. Acerto: 20 (2d10 + 9) de dano perfurante mais 11 (2d10) de dano elétrico.",
          "name": "Morder"
        },
        {
          "attack_bonus": 16,
          "damage": [
            {
              "dice": "2d6+9",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 3 metros, um alvo. Acerto: 16 (2d6 + 9) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 16,
          "damage": [
            {
              "dice": "2d8+9",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +16 para acertar, alcance 6 metros, um alvo. Acerto: 18 (2d8 + 9) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 20 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "16d10+0",
              "type": "lightning"
            }
          ],
          "description": "O dragão exala relâmpagos em uma linha de 36 metros com 3 metros de largura. Cada criatura naquela linha deve realizar um teste de resistência de Destreza CD 23, sofrendo 88 (16d10) de dano elétrico se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro Relâmpago (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "elétrico"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 4,5 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 24 ou sofrerá 16 (2d6 + 9) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Antigo Dragão Azul pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 12,
        "con": 15,
        "dex": 7,
        "wis": 10
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 27
      },
      "skills": {
        "Percepção": 17,
        "Furtividade": 7
      },
      "speed": {
        "escavação": 40,
        "voo": 80,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:ancient-silver-dragon",
    "name": "Dragão Prateado Antigo",
    "name_en": "Ancient Silver Dragon",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "23",
    "cr_numeric": 23.0,
    "armor_class": 22,
    "hp_max": 487,
    "hp_formula": "25d20+225",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 23,
        "con": 29,
        "dex": 10,
        "int": 18,
        "str": 30,
        "wis": 15
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 17,
          "damage": [
            {
              "dice": "2d10+10",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 4,5 metros, um alvo. Acerto: 21 (2d10 + 10) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 17,
          "damage": [
            {
              "dice": "2d6+10",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 3 metros, um alvo. Acerto: 17 (2d6 + 10) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 17,
          "damage": [
            {
              "dice": "2d8+10",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 6 metros, um alvo. Acerto: 19 (2d8 + 10) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 21 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "15d8+0",
              "type": "cold"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n\n**Respiração Fria.** O dragão exala uma explosão gelada em um cone de 27 metros. Cada criatura naquela área deve realizar um teste de resistência de Constituição CD 24, sofrendo 67 (15d8) de dano de frio se falhar na resistência, ou metade desse dano se obtiver sucesso.\n\n **Respiração Paralisante.** O dragão exala gás paralisante em um cone de 27 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Constituição CD 24 ou ficará paralisada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.",
          "name": "Armas de Sopro (Recarga 5-6)"
        },
        {
          "description": "O dragão se transforma magicamente em um humanóide ou besta que tem um nível de desafio não superior ao seu, ou retorna à sua forma verdadeira. Ele reverte à sua verdadeira forma se morrer. Qualquer equipamento que ele esteja vestindo ou carregando é absorvido ou suportado pela nova forma (a escolha do dragão).\nEm uma nova forma, o dragão mantém seu alinhamento, pontos de vida, Dados de Vida, habilidade de falar, proficiências, Resistência Lendária, ações de covil e valores de Inteligência, Sabedoria e Carisma, bem como esta ação. Suas estatísticas e capacidades serão substituídas pelas da nova forma, exceto quaisquer características de classe ou ações lendárias dessa forma.",
          "name": "Alterar forma"
        }
      ],
      "damage_immunities": [
        "frio"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 4,5 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 25 ou sofrerá 17 (2d6 + 10) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Antigo Dragão Prateado pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 13,
        "con": 16,
        "dex": 7,
        "wis": 9
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 26
      },
      "skills": {
        "Arcanismo": 11,
        "História": 11,
        "Percepção": 16,
        "Furtividade": 7
      },
      "speed": {
        "voo": 80,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:kraken",
    "name": "Kraken",
    "name_en": "Kraken",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "23",
    "cr_numeric": 23.0,
    "armor_class": 18,
    "hp_max": 472,
    "hp_formula": "27d20+189",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 20,
        "con": 25,
        "dex": 11,
        "int": 22,
        "str": 30,
        "wis": 18
      },
      "actions": [
        {
          "description": "O kraken faz três ataques de tentáculos, cada um dos quais pode ser substituído por um uso de Arremesso.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "3d8+10",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 1,5 m, um alvo. Acerto: 23 (3d8 + 10) de dano perfurante. Se o alvo for uma criatura Grande ou menor agarrada pelo kraken, essa criatura é engolida e a luta termina. Enquanto engolida, a criatura fica cega e contida, tem cobertura total contra ataques e outros efeitos fora do kraken e sofre 42 (12d6) de dano ácido no início de cada turno do kraken. Se o kraken sofrer 50 de dano ou mais em um único turno de uma criatura dentro dele, o kraken deve ser bem sucedido em um teste de resistência de Constituição CD 25 no final daquele turno ou regurgitar todas as criaturas engolidas, que caem prostradas em um espaço a até 3 metros do kraken. Se o kraken morrer, uma criatura engolida não será mais contida por ele e poderá escapar do cadáver usando 4,5 metros de movimento, saindo caída.",
          "name": "Morder"
        },
        {
          "attack_bonus": 7,
          "damage": [
            {
              "dice": "3d6+10",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +7 para acertar, alcance 9 metros, um alvo. Acerto: 20 (3d6 + 10) de dano de concussão e o alvo é agarrado (CD 18 para escapar). Até que esta luta termine, o alvo está contido. O kraken tem dez tentáculos, cada um dos quais pode agarrar um alvo.",
          "name": "Tentáculo"
        },
        {
          "description": "Um objeto grande ou menor segurado ou uma criatura agarrada pelo kraken é arremessado até 18 metros em uma direção aleatória e derrubado. Se um alvo arremessado atingir uma superfície sólida, o alvo sofre 3 (1d6) de dano de concussão para cada 3 metros que foi arremessado. Se o alvo for lançado em outra criatura, aquela criatura deve ser bem sucedida em um teste de resistência de Destreza CD 18 ou sofrerá o mesmo dano e será derrubada.",
          "name": "Arremesso"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "4d10+0",
              "type": "lightning"
            }
          ],
          "description": "O kraken cria magicamente três raios, cada um dos quais pode atingir um alvo que o kraken possa ver a até 36 metros dele. Um alvo deve fazer um teste de resistência de Destreza CD 23, sofrendo 22 (4d10) de dano elétrico se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Tempestade de raios"
        }
      ],
      "condition_immunities": [
        "Amedrontado",
        "Paralisado"
      ],
      "damage_immunities": [
        "lightning; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "languages": [
        "understands Abyssal",
        "Celestial",
        "Infernal",
        "and Primordial but can't speak",
        "telepathy 120 ft."
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O kraken faz um ataque de tentáculo ou usa seu Arremesso.",
            "name": "Ataque ou arremesso de tentáculo"
          },
          {
            "cost": 2,
            "description": "O kraken usa Lightning Storm.",
            "name": "Tempestade de raios (custa 2 ações)"
          },
          {
            "cost": 3,
            "description": "Enquanto está submerso, o kraken expele uma nuvem de tinta em um raio de 18 metros. A nuvem se espalha pelos cantos e essa área fica fortemente obscurecida para outras criaturas além do kraken. Cada criatura, exceto o kraken, que termina seu turno lá, deve ser bem sucedida em um teste de resistência de Constituição CD 23, sofrendo 16 (3d10) de dano de veneno se falhar na resistência, ou metade do dano se obtiver sucesso. Uma forte corrente dispersa a nuvem, que de outra forma desaparece no final do próximo turno do kraken.",
            "name": "Nuvem de tinta (custa 3 ações)"
          }
        ],
        "description": "O Kraken pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "con": 14,
        "dex": 7,
        "int": 13,
        "str": 17,
        "wis": 11
      },
      "schema_version": 1,
      "senses": {
        "percepção passiva": 14,
        "visão verdadeira": 120
      },
      "speed": {
        "natação": 60,
        "deslocamento": 20
      },
      "traits": [
        {
          "description": "O kraken pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "O kraken ignora terrenos difíceis e os efeitos mágicos não podem reduzir sua velocidade ou fazer com que ele seja restringido. Ele pode gastar 1,5 metro de movimento para escapar de restrições não-mágicas ou ser agarrado.",
          "name": "Liberdade de movimento"
        },
        {
          "description": "O kraken causa dano duplo a objetos e estruturas.",
          "name": "Monstro de Cerco"
        }
      ]
    }
  },
  {
    "id": "srd:ancient-gold-dragon",
    "name": "Dragão Dourado Antigo",
    "name_en": "Ancient Gold Dragon",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "24",
    "cr_numeric": 24.0,
    "armor_class": 22,
    "hp_max": 546,
    "hp_formula": "28d20+252",
    "initiative_modifier": 2,
    "stat_block_json": {
      "ability_scores": {
        "cha": 28,
        "con": 29,
        "dex": 14,
        "int": 18,
        "str": 30,
        "wis": 17
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 17,
          "damage": [
            {
              "dice": "2d10+10",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 4,5 metros, um alvo. Acerto: 21 (2d10 + 10) de dano perfurante.",
          "name": "Morder"
        },
        {
          "attack_bonus": 17,
          "damage": [
            {
              "dice": "2d6+10",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 3 metros, um alvo. Acerto: 17 (2d6 + 10) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 17,
          "damage": [
            {
              "dice": "2d8+10",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 6 metros, um alvo. Acerto: 19 (2d8 + 10) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 24 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "13d10+0",
              "type": "fire"
            }
          ],
          "description": "O dragão usa uma das seguintes armas de sopro.\n**Sopro de Fogo.** O dragão exala fogo em um cone de 27 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 24, sofrendo 71 (13d10) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.\n**Respiração Enfraquecedora.** O dragão exala gás em um cone de 27 metros. Cada criatura naquela área deve ser bem sucedida em um teste de resistência de Força CD 24 ou terá desvantagem em jogadas de ataque baseadas em Força, testes de Força e testes de resistência de Força por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso.",
          "name": "Armas de Sopro (Recarga 5-6)"
        },
        {
          "description": "O dragão se transforma magicamente em um humanóide ou besta que tem um nível de desafio não superior ao seu, ou retorna à sua forma verdadeira. Ele reverte à sua verdadeira forma se morrer. Qualquer equipamento que ele esteja vestindo ou carregando é absorvido ou suportado pela nova forma (a escolha do dragão).\nEm uma nova forma, o dragão mantém seu alinhamento, pontos de vida, Dados de Vida, habilidade de falar, proficiências, Resistência Lendária, ações de covil e valores de Inteligência, Sabedoria e Carisma, bem como esta ação. Suas estatísticas e capacidades serão substituídas pelas da nova forma, exceto quaisquer características de classe ou ações lendárias dessa forma.",
          "name": "Alterar forma"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 4,5 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 25 ou sofrerá 17 (2d6 + 10) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Antigo Dragão Dourado pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 16,
        "con": 16,
        "dex": 9,
        "wis": 10
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 27
      },
      "skills": {
        "Intuição": 10,
        "Percepção": 17,
        "Persuasão": 16,
        "Furtividade": 9
      },
      "speed": {
        "voo": 80,
        "natação": 40,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "O dragão pode respirar ar e água.",
          "name": "Anfíbio"
        },
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:ancient-red-dragon",
    "name": "Dragão Vermelho Antigo",
    "name_en": "Ancient Red Dragon",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Dragão",
    "type_en": "dragon",
    "cr": "24",
    "cr_numeric": 24.0,
    "armor_class": 22,
    "hp_max": 546,
    "hp_formula": "28d20+252",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 23,
        "con": 29,
        "dex": 10,
        "int": 18,
        "str": 30,
        "wis": 15
      },
      "actions": [
        {
          "description": "O dragão pode usar sua Presença Assustadora. Em seguida, faz três ataques: um com a mordida e dois com as garras.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 17,
          "damage": [
            {
              "dice": "2d10+4d6+10",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 4,5 metros, um alvo. Acerto: 21 (2d10 + 10) de dano perfurante mais 14 (4d6) de dano de fogo.",
          "name": "Morder"
        },
        {
          "attack_bonus": 17,
          "damage": [
            {
              "dice": "2d6+10",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 3 metros, um alvo. Acerto: 17 (2d6 + 10) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 17,
          "damage": [
            {
              "dice": "2d8+10",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +17 para acertar, alcance 6 metros, um alvo. Acerto: 19 (2d8 + 10) de dano de concussão.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do dragão, que esteja a até 36 metros do dragão e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 21 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, encerrando o efeito sobre si mesma se obtiver sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do dragão pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "attack_bonus": 0,
          "damage": [
            {
              "dice": "26d6+0",
              "type": "fire"
            }
          ],
          "description": "O dragão exala fogo em um cone de 27 metros. Cada criatura naquela área deve realizar um teste de resistência de Destreza CD 24, sofrendo 91 (26d6) de dano de fogo se falhar na resistência, ou metade desse dano se obtiver sucesso.",
          "name": "Sopro de Fogo (Recarga 5-6)"
        }
      ],
      "damage_immunities": [
        "fogo"
      ],
      "languages": [
        "Comum",
        "Dracônico"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O dragão faz um teste de Sabedoria (Percepção).",
            "name": "Detectar"
          },
          {
            "cost": 1,
            "description": "O dragão faz um ataque com a cauda.",
            "name": "Ataque de cauda"
          },
          {
            "cost": 2,
            "description": "O dragão bate suas asas. Cada criatura a até 4,5 metros do dragão deve ser bem sucedida em um teste de resistência de Destreza CD 25 ou sofrerá 17 (2d6 + 10) de dano de concussão e será derrubada. O dragão pode então voar até metade de sua velocidade de vôo.",
            "name": "Ataque de Asa (custa 2 ações)"
          }
        ],
        "description": "O Antigo Dragão Vermelho pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 13,
        "con": 16,
        "dex": 7,
        "wis": 9
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 60,
        "visão no escuro": 120,
        "percepção passiva": 26
      },
      "skills": {
        "Percepção": 16,
        "Furtividade": 7
      },
      "speed": {
        "escalada": 40,
        "voo": 80,
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o dragão falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        }
      ]
    }
  },
  {
    "id": "srd:tarrasque",
    "name": "Tarrasque",
    "name_en": "Tarrasque",
    "size": "Imenso",
    "size_en": "Gargantuan",
    "type": "Monstruosidade",
    "type_en": "monstrosity",
    "cr": "30",
    "cr_numeric": 30.0,
    "armor_class": 25,
    "hp_max": 676,
    "hp_formula": "33d20+330",
    "initiative_modifier": 0,
    "stat_block_json": {
      "ability_scores": {
        "cha": 11,
        "con": 30,
        "dex": 11,
        "int": 3,
        "str": 30,
        "wis": 11
      },
      "actions": [
        {
          "description": "O tarrasque pode usar sua Presença Assustadora. Em seguida, ele faz cinco ataques: um com a mordida, dois com as garras, um com os chifres e um com a cauda. Ele pode usar sua andorinha em vez de sua mordida.",
          "name": "Multiataque"
        },
        {
          "attack_bonus": 19,
          "damage": [
            {
              "dice": "4d12+10",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +19 para acertar, alcance 3 metros, um alvo. Acerto: 36 (4d12 + 10) de dano perfurante. Se o alvo for uma criatura, ele será agarrado (CD 20 para escapar). Até o agarrão terminar, o alvo fica contido e o tarrasque não pode morder outro alvo.",
          "name": "Morder"
        },
        {
          "attack_bonus": 19,
          "damage": [
            {
              "dice": "4d8+10",
              "type": "slashing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +19 para acertar, alcance 4,5 metros, um alvo. Acerto: 28 (4d8 + 10) de dano cortante.",
          "name": "Garra"
        },
        {
          "attack_bonus": 19,
          "damage": [
            {
              "dice": "4d10+10",
              "type": "piercing"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +19 para acertar, alcance 3 metros, um alvo. Acerto: 32 (4d10 + 10) de dano perfurante.",
          "name": "Chifres"
        },
        {
          "attack_bonus": 19,
          "damage": [
            {
              "dice": "4d6+10",
              "type": "bludgeoning"
            }
          ],
          "description": "Ataque corpo a corpo com arma: +19 para acertar, alcance 6 metros, um alvo. Acerto: 24 (4d6 + 10) de dano de concussão. Se o alvo for uma criatura, ele deve ser bem sucedido em um teste de resistência de Força CD 20 ou será derrubado.",
          "name": "Cauda"
        },
        {
          "description": "Cada criatura, à escolha do tarrasque, a até 36 metros dele e ciente disso, deve ser bem sucedida em um teste de resistência de Sabedoria CD 17 ou ficará assustada por 1 minuto. Uma criatura pode repetir o teste de resistência no final de cada um de seus turnos, com desvantagem se o tarrasque estiver dentro da linha de visão, encerrando o efeito sobre si mesma em caso de sucesso. Se o teste de resistência de uma criatura for bem-sucedido ou o efeito terminar, a criatura ficará imune à Presença Aterrorizante do tarrasque pelas próximas 24 horas.",
          "name": "Presença assustadora"
        },
        {
          "description": "O tarrasque realiza um ataque de mordida contra uma criatura Grande ou menor que esteja agarrando. Se o ataque acertar, o alvo sofre o dano da mordida, o alvo é engolido e a luta termina. Enquanto engolida, a criatura fica cega e contida, tem cobertura total contra ataques e outros efeitos fora do tarrasque e sofre 56 (16d6) de dano ácido no início de cada turno do tarrasque.\nSe o tarrasque sofrer 60 de dano ou mais em um único turno de uma criatura dentro dele, o tarrasque deve ser bem sucedido em um teste de resistência de Constituição CD 20 no final daquele turno ou regurgitar todas as criaturas engolidas, que caem prostradas em um espaço a até 3 metros do tarrasque. Se o tarrasque morrer, uma criatura engolida não será mais contida por ele e poderá escapar do cadáver usando 9 metros de movimento, saindo caída.",
          "name": "Engolir"
        }
      ],
      "condition_immunities": [
        "Enfeitiçado",
        "Amedrontado",
        "Paralisado",
        "Envenenado"
      ],
      "damage_immunities": [
        "fogo",
        "poison; bludgeoning",
        "perfurante",
        "and slashing from nonmagical attacks"
      ],
      "legendary_actions": {
        "actions": [
          {
            "cost": 1,
            "description": "O tarrasque faz um ataque de garra ou ataque de cauda.",
            "name": "Ataque"
          },
          {
            "cost": 1,
            "description": "O tarrasque move-se até metade da sua velocidade.",
            "name": "Mover"
          },
          {
            "cost": 2,
            "description": "O tarrasque faz um ataque de mordida ou usa sua andorinha.",
            "name": "Chomp (custa 2 ações)"
          }
        ],
        "description": "O Tarrasque pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção de ação lendária pode ser usada por vez e somente no final do turno de outra criatura. A criatura recupera ações lendárias gastas no início de seu turno.",
        "per_round": 3
      },
      "saving_throws": {
        "cha": 9,
        "int": 5,
        "wis": 9
      },
      "schema_version": 1,
      "senses": {
        "percepção às cegas": 120,
        "percepção passiva": 10
      },
      "speed": {
        "deslocamento": 40
      },
      "traits": [
        {
          "description": "Se o tarrasque falhar em um teste de resistência, ele pode escolher ter sucesso.",
          "name": "Resistência Lendária (3/dia)"
        },
        {
          "description": "O tarrasque tem vantagem em testes de resistência contra feitiços e outros efeitos mágicos.",
          "name": "Resistência Mágica"
        },
        {
          "description": "Sempre que o tarrasque for alvo de um feitiço de míssil mágico, um feitiço de linha ou um feitiço que exija uma jogada de ataque à distância, jogue um d6. Num 1 a 5, o tarrasque não é afetado. Com um 6, o tarrasque não é afetado e o efeito é refletido de volta para o conjurador como se tivesse se originado do tarrasque, transformando o conjurador no alvo.",
          "name": "Carapaça Reflexiva"
        },
        {
          "description": "O tarrasque causa dano duplo a objetos e estruturas.",
          "name": "Monstro de Cerco"
        }
      ]
    }
  }
];
  function normalizeMonster(m) {
    var s = m.stat_block_json || {};
    return {
      id: m.id,
      nome: m.name,
      nomePt: m.name,
      nomeEn: m.name_en || m.name,
      traducaoPtDisponivel: true,
      tamanho: m.size,
      tamanhoEn: m.size_en || m.size,
      tipo: m.type,
      tipoEn: m.type_en || m.type,
      nd: m.cr,
      ndNumerico: m.cr_numeric,
      classeArmadura: m.armor_class,
      pontosVida: m.hp_max,
      formulaVida: m.hp_formula,
      iniciativa: m.initiative_modifier,
      atributos: s.ability_scores || {},
      deslocamento: s.speed || {},
      salvaguardas: s.saving_throws || {},
      pericias: s.skills || {},
      sentidos: s.senses || {},
      idiomas: s.languages || [],
      resistenciasDano: s.damage_resistances || [],
      vulnerabilidadesDano: s.damage_vulnerabilities || [],
      imunidadesDano: s.damage_immunities || [],
      imunidadesCondicao: s.condition_immunities || [],
      tracos: s.traits || [],
      acoes: s.actions || [],
      acoesBonus: s.bonus_actions || [],
      reacoes: s.reactions || [],
      acoesLendarias: s.legendary_actions || [],
      fonte: 'SRD 5.2.1 (PT-BR)',
      licenca: 'CC BY 4.0',
      dados: s
    };
  }
  window.MONSTERS = RAW.map(normalizeMonster);
  window.SRD_MONSTERS = window.MONSTERS;
  window.MONSTER_MANUAL_URL = 'https://www.dndbeyond.com/sources/dnd/mm-2024';
  window.MONSTERS_ERROR = null;
  window.MONSTERS_META = {
    sistema: 'Dungeons & Dragons 5e', srd: '5.2.1',
    blocosCompletosCarregados: window.MONSTERS.length,
    fonte: 'Embutido e traduzido', licenca: 'CC BY 4.0', idioma: 'PT-BR',
    cacheLocal: 'Nenhum (offline).',
    aviso: 'Gerado por translate-monsters.py.'
  };
  window.MONSTERS_READY = Promise.resolve(window.MONSTERS);
  window.getMonsters = async function (f) {
    var L = await window.MONSTERS_READY; f = f || {};
    return L.filter(function (m) {
      if (f.nd && String(m.nd) !== String(f.nd)) return false;
      if (f.tipo && m.tipoEn !== f.tipo && m.tipo !== f.tipo) return false;
      if (f.tamanho && m.tamanhoEn !== f.tamanho && m.tamanho !== f.tamanho) return false;
      if (f.minND !== undefined && Number(m.ndNumerico) < Number(f.minND)) return false;
      if (f.maxND !== undefined && Number(m.ndNumerico) > Number(f.maxND)) return false;
      return true;
    });
  };
  window.findMonster = async function (q) {
    var L = await window.MONSTERS_READY;
    q = String(q || '').trim().toLocaleLowerCase('pt-BR');
    if (!q) return [];
    return L.filter(function (m) {
      return [m.nome, m.nomeEn, m.tipo, m.nd].filter(Boolean)
        .some(function (v) { return String(v).toLocaleLowerCase('pt-BR').includes(q); });
    });
  };
  window.getMonster = async function (q) {
    var ms = await window.findMonster(q);
    var q2 = String(q || '').trim().toLocaleLowerCase('pt-BR');
    return ms.find(function (m) {
      return String(m.nome).toLocaleLowerCase('pt-BR') === q2
          || String(m.nomeEn).toLocaleLowerCase('pt-BR') === q2;
    }) || ms[0] || null;
  };
})();
