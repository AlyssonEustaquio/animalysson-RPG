C.incapacitado = incapacitado;

C.ehJogador = ehJogador;

C.pontosDeVidaTexto = pontosDeVidaTexto;

C.nomeDe = nomeDe;

C.viva = viva;

C.monstro = monstro;

C.bonusPericia = bonusPericia;

C.registrar = registrar;

C.novaEco = novaEco;

function verificarFim() {
      var vivos = toks().filter(function(t) {
        return viva(t) && faccao(t) === "monstros" && t.hp > 0;
      });
      var herois = toks().filter(function(t) {
        return viva(t) && faccao(t) === "jogadores" && (t.hp > 0 || ehJogador(t) && !t.estavel);
      });
      if (!vivos.length) return "vitoria";
      if (!herois.length) return "derrota";
      return null;
    }

C.iniciar = function(opts) {
      opts = opts || {};
      var s = est(), L = [];
      var lista = toks().filter(function(t) {
        return !t.morto && (t.tipo === "player" || t.monsterId || t.tipo === "npc" || t.tipo === "enemy" || t.hpMax != null);
      });
      if (typeof opts.filtro === "function") lista = lista.filter(opts.filtro);
      if (!lista.length) return ["Não há criaturas no mapa para entrar em combate."];
      var rolagens = lista.map(function(t) {
        var st = preparar(t);
        t.eco = novaEco();
        t.efeitos = {};
        t.escondido = false;
        var r = d20(t.surpreso ? -1 : 0);
        var bonus = st.iniciativa + (Number(t.bonusIniciativa) || 0) - 2 * (t.exaustao || 0);
        return { id: t.id, nome: nomeDe(t), valor: r.dado + bonus, des: st.mods.DES, desempate: Math.random() };
      });
      rolagens.sort(function(a, b) {
        return b.valor - a.valor || b.des - a.des || b.desempate - a.desempate;
      });
      if (opts.primeiro) {
        var ip = rolagens.findIndex(function(x) {
          return x.id === opts.primeiro;
        });
        if (ip > 0) {
          var topo = Math.max.apply(null, rolagens.map(function(x) {
            return x.valor;
          }));
          var pri = rolagens.splice(ip, 1)[0];
          pri.valor = topo;
          rolagens.unshift(pri);
        }
      }
      s.ativo = true;
      s.rodada = 1;
      s.turno = 0;
      s.ordem = rolagens.map(function(x) {
        return { id: x.id, valor: x.valor };
      });
      s.registro = [];
      s.xpGanho = 0;
      lista.forEach(function(t) {
        delete t.surpreso;
      });
      L.push("Combate iniciado! Iniciativa: " + rolagens.map(function(x) {
        return x.nome + " " + x.valor;
      }).join(", ") + ".");
      L.push("— Rodada 1 —");
      var primeiro = C.atual();
      if (primeiro) L.push.apply(L, iniciarTurno(primeiro));
      registrar(L);
      return L;
    };

C.encerrar = function(motivo) {
      var s = est(), L = [];
      if (!s.ativo) return L;
      s.ativo = false;
      toks().forEach(function(t) {
        t.eco = novaEco();
        if (t.efeitos) {
          delete t.efeitos.lento;
          delete t.efeitos.sap;
          delete t.efeitos.vex;
          delete t.efeitos.ajudadoPor;
          delete t.efeitos.distraido;
        }
      });
      if (motivo === "vitoria") {
        var xp = 0;
        toks().forEach(function(t) {
          if (t.morto && t.monsterId) {
            var m = monstro(t);
            if (m) xp += XP_POR_ND[String(m.ndNumerico)] || 0;
          }
        });
        L.push("Vitória! Todos os inimigos foram derrotados." + (xp ? " XP total dos inimigos: " + xp + "." : ""));
      } else if (motivo === "derrota") L.push("O grupo foi derrotado.");
      else L.push("Combate encerrado.");
      registrar(L);
      return L;
    };

C.proximoTurno = function() {
      var s = est(), L = [];
      if (!s.ativo) return L;
      var cur = C.atual();
      if (cur) L.push.apply(L, encerrarTurno(cur));
      var fim = verificarFim();
      if (fim) {
        L.push.apply(L, C.encerrar(fim));
        registrar(L);
        return L;
      }
      var guarda = 0;
      while (guarda++ < s.ordem.length + 2) {
        s.turno += 1;
        if (s.turno >= s.ordem.length) {
          s.turno = 0;
          s.rodada += 1;
          L.push("— Rodada " + s.rodada + " —");
        }
        var cand = porId(s.ordem[s.turno].id);
        if (!cand || cand.morto) continue;
        var ls = iniciarTurno(cand);
        L.push.apply(L, ls);
        if (ehJogador(cand) && cand.hp <= 0) {
          if (cand.morto) {
            var f2 = verificarFim();
            if (f2) {
              L.push.apply(L, C.encerrar(f2));
              registrar(L);
              return L;
            }
          }
          continue;
        }
        break;
      }
      var fim2 = verificarFim();
      if (fim2) L.push.apply(L, C.encerrar(fim2));
      registrar(L);
      return L;
    };

C.entrarNoCombate = function(t) {
      var s = est(), L = [];
      if (!s.ativo || s.ordem.some(function(x) {
        return x.id === t.id;
      })) return L;
      var st = preparar(t);
      var r = d20(0), valor = r.dado + st.iniciativa;
      var atual = C.atual();
      s.ordem.push({ id: t.id, valor });
      var idAtual = atual ? atual.id : null;
      s.ordem.sort(function(a, b) {
        return b.valor - a.valor;
      });
      s.turno = Math.max(0, s.ordem.findIndex(function(x) {
        return x.id === idAtual;
      }));
      L.push(nomeDe(t) + " entra no combate com iniciativa " + valor + ".");
      registrar(L);
      return L;
    };

C.gastar = function(t, tipo) {
      if (!est().ativo) return { ok: true };
      var atual = C.atual();
            if (tipo !== "reacao" && atual && atual !== t) return { ok: false, motivo: "Não é o turno de " + nomeDe(t) + "." };
      if (incapacitado(t)) return { ok: false, motivo: nomeDe(t) + " está incapacitado." };
      if (!t.eco) t.eco = novaEco();
      if (!t.eco[tipo]) return { ok: false, motivo: tipo === "acao" ? "A ação deste turno já foi usada." : tipo === "bonus" ? "A ação bônus deste turno já foi usada." : "A reação já foi usada." };
      t.eco[tipo] = false;
      return { ok: true };
    };

C.devolver = function(t, tipo) {
      if (est().ativo && t.eco) t.eco[tipo] = true;
    };

C.podeAgir = function(t, tipo) {
      if (!est().ativo) return true;
      var atual = C.atual();
      if (tipo !== "reacao" && atual && atual !== t) return false;
      return !incapacitado(t) && !!(t.eco && t.eco[tipo]);
    };

function raio(t) {
      return Math.max(1, t.raio || 1);
    }

function atqDeMonstro(a, modo) {
      var m = modo || (a.modo === "distancia" ? "distancia" : "corpo");
      var danos = a.dano || [];
      if (a.modo === "ambos" && danos.length > 1) danos = [m === "corpo" ? danos[0] : danos[1]];
      return {
        nome: a.nome,
        bonus: a.bonus,
        distancia: m === "distancia",
        alcanceNormal: m === "corpo" ? a.alcanceCorpo : a.alcanceNormal || a.alcanceCorpo,
        alcanceMax: m === "corpo" ? a.alcanceCorpo : a.alcanceMax || a.alcanceCorpo,
        dano: danos,
        extra: a.extra,
        magico: !!a.magico,
        arma: false,
        atributoMod: null
      };
    }

function alcanceCorpoDe(t) {
      var s = stats(t);
      if (s.tipo === "pc") {
        var a = env.pcAtaquePadrao ? env.pcAtaquePadrao(t) : null;
        return a && !a.distancia ? a.alcanceMax || 1 : 1;
      }
      var r = 0;
      (s.ataques || []).forEach(function(x) {
        if (x.tipo === "ataque" && x.modo !== "distancia") r = Math.max(r, x.alcanceCorpo || 1);
      });
      return r;
    }

function ataqueOportunidade(e) {
      var s = stats(e);
      if (s.tipo === "pc") return env.pcAtaquePadrao ? env.pcAtaquePadrao(e) : null;
      var melhor = null, mm = -1;
      (s.ataques || []).forEach(function(x) {
        if (x.tipo !== "ataque" || x.modo === "distancia") return;
        var m = (x.dano || []).reduce(function(acc, p) {
          return acc + mediaDano(p.dados);
        }, 0);
        if (m > mm) {
          mm = m;
          melhor = x;
        }
      });
      return melhor ? atqDeMonstro(melhor, "corpo") : null;
    }

function ataquesDeOportunidade(mover, de, para) {
      var L = [];
      if (mover.eco && mover.eco.desengajou) return L;
      toks().slice().forEach(function(e) {
        if (e === mover || !viva(e) || !hostis(e, mover) || incapacitado(e) || !mover || mover.morto) return;
        if (!e.eco || !e.eco.reacao) return;
        var alc = alcanceCorpoDe(e);
        if (!alc) return;
        var antes = pegadaDist(de.x, de.y, raio(mover), e.x, e.y, raio(e));
        var depois = pegadaDist(para.x, para.y, raio(mover), e.x, e.y, raio(e));
        if (antes > alc || depois <= alc) return;
        var atq = ataqueOportunidade(e);
        if (!atq) return;
        e.eco.reacao = false;
        L.push(nomeDe(e) + " usa a reação para um ataque de oportunidade contra " + nomeDe(mover) + ".");
        var px = mover.x, py = mover.y;
        mover.x = de.x;
        mover.y = de.y;
        var r = atacar(e, mover, atq, { ignorarVisao: true });
        mover.x = px;
        mover.y = py;
        L.push.apply(L, r.linhas);
      });
      return L;
    }

C.podeMover = function(t, de, para) {
      if (!est().ativo) return { ok: true, custo: 0 };
      var s = est();
      if (s.ordem.every(function(x) {
        return x.id !== t.id;
      })) return { ok: true, custo: 0 };
      var atual = C.atual();
      if (atual && atual !== t) return { ok: false, motivo: "Não é o turno de " + nomeDe(t) + "." };
      if (incapacitado(t) || t.hp <= 0) return { ok: false, motivo: nomeDe(t) + " não pode se mover." };
      if (!t.eco) t.eco = novaEco();
      var custo = tem(t, "caido") ? 2 : 1;
      if (movimentoRestante(t) < custo) return { ok: false, motivo: "Sem deslocamento restante neste turno." };
      if (tem(t, "amedrontado")) {
        var f = porId(condicaoFonte(t, "amedrontado"));
        if (f && pegadaDist(para.x, para.y, raio(t), f.x, f.y, raio(f)) < pegadaDist(de.x, de.y, raio(t), f.x, f.y, raio(f))) return { ok: false, motivo: nomeDe(t) + " está amedrontado e não se aproxima da fonte do medo." };
      }
      return { ok: true, custo };
    };

C.aposMover = function(t, de, para, custo) {
      var L = [];
      if (!est().ativo || !t.eco) return L;
      var dx = Math.abs(para.x - de.x), dy = Math.abs(para.y - de.y);
      t.eco.mov += (custo || 1) * Math.max(1, Math.max(dx, dy));
      L = ataquesDeOportunidade(t, de, para);
      if (L.length) registrar(L);
      return L;
    };

C.levantar = function(t) {
      if (!tem(t, "caido") || tem(t, "inconsciente")) return ["Não é possível se levantar agora."];
      var custo = Math.floor(stats(t).veloc / 2);
      if (est().ativo && movimentoRestante(t) < custo) return ["Deslocamento insuficiente para se levantar (" + custo + " quadrículas)."];
      if (est().ativo && t.eco) t.eco.mov += custo;
      removerCondicao(t, "caido");
      return [nomeDe(t) + " se levanta" + (est().ativo ? " (gasta " + mts(custo) + " m de deslocamento)" : "") + "."];
    };

function usar(t, tipo, fn) {
      preparar(t);
      var g = C.gastar(t, tipo);
      if (!g.ok) return { ok: false, linhas: [g.motivo] };
      var L = fn() || [];
      registrar(L);
      return { ok: true, linhas: L };
    }

C.disparada = function(t) {
      return usar(t, "acao", function() {
        if (est().ativo) t.eco.movExtra += Math.max(0, veloc(t));
        return [nomeDe(t) + " usa Disparada: deslocamento adicional de " + mts(Math.max(0, veloc(t))) + " m neste turno."];
      });
    };

C.desengajar = function(t) {
      return usar(t, "acao", function() {
        t.eco.desengajou = true;
        return [nomeDe(t) + " usa Desengajar: seu movimento não provoca ataques de oportunidade neste turno."];
      });
    };

C.esquivar = function(t) {
      return usar(t, "acao", function() {
        t.eco.esquiva = true;
        return [nomeDe(t) + " usa Esquivar: ataques contra ele têm desvantagem e ele tem vantagem em salvaguardas de Destreza até o início do próximo turno."];
      });
    };

C.ajudar = function(t, alvo, tipo) {
      return usar(t, "acao", function() {
        if (!alvo.efeitos) alvo.efeitos = {};
        if (tipo === "distrair") {
          alvo.efeitos.distraido = t.id;
          return [nomeDe(t) + " usa Ajudar: o próximo ataque de um aliado contra " + nomeDe(alvo) + " tem vantagem."];
        }
        alvo.efeitos.ajudadoPor = t.id;
        return [nomeDe(t) + " usa Ajudar: " + nomeDe(alvo) + " terá vantagem no próximo ataque ou teste de habilidade."];
      });
    };

C.esconder = function(t) {
      return usar(t, "acao", function() {
        var b = bonusPericia(t, "Furtividade", "DES") - 2 * (t.exaustao || 0);
        var armaduraPesada = env.armaduraDesvantagem ? env.armaduraDesvantagem(t) : false;
        var r = d20(armaduraPesada ? -1 : 0);
        var total = r.dado + b;
        if (total >= 15) {
          t.escondido = true;
          t.escondidoCD = total;
          return [nomeDe(t) + " usa Esconder: Furtividade " + textoD20(r, b, total) + " contra CD 15 — sucesso; está escondido."];
        }
        return [nomeDe(t) + " usa Esconder: Furtividade " + textoD20(r, b, total) + " contra CD 15 — falha."];
      });
    };

C.procurar = function(t) {
      return usar(t, "acao", function() {
        var b = bonusPericia(t, "Percepção", "SAB") - 2 * (t.exaustao || 0);
        var r = d20(0), total = r.dado + b, L = [nomeDe(t) + " usa Procurar: Percepção " + textoD20(r, b, total) + "."];
        var achou = false;
        toks().forEach(function(o) {
          if (o.escondido && hostis(t, o) && env.linhaVisao(t, o)) {
            if (total >= (o.escondidoCD || 15)) {
              o.escondido = false;
              achou = true;
              L.push(nomeDe(o) + " foi encontrado.");
            }
          }
        });
        if (!achou) L.push("Nenhuma criatura escondida foi encontrada.");
        return L;
      });
    };

C.preparar_acao = function(t, descricao) {
      return usar(t, "acao", function() {
        t.preparada = descricao || "ação preparada";
        return [nomeDe(t) + " prepara uma ação: " + t.preparada + ". Usa a reação quando o gatilho ocorrer."];
      });
    };

C.usarPreparada = function(t) {
      if (!t.preparada) return { ok: false, linhas: ["Não há ação preparada."] };
      var g = C.gastar(t, "reacao");
      if (!g.ok) return { ok: false, linhas: [g.motivo] };
      var texto = t.preparada;
      t.preparada = null;
      var L = [nomeDe(t) + " executa a ação preparada: " + texto + "."];
      registrar(L);
      return { ok: true, linhas: L };
    };

C.utilizar = function(t, descricao) {
      return usar(t, "acao", function() {
        return [nomeDe(t) + " usa Utilizar: " + (descricao || "interage com um objeto") + "."];
      });
    };

C.interagirObjeto = function(t, descricao) {
      preparar(t);
      if (est().ativo && t.eco.interacao) return { ok: false, linhas: ["A interação gratuita com objeto deste turno já foi usada. Use a ação Utilizar."] };
      if (est().ativo) t.eco.interacao = true;
      var L = [nomeDe(t) + " interage com um objeto: " + (descricao || "saca ou guarda um item") + "."];
      registrar(L);
      return { ok: true, linhas: L };
    };

C.testePericia = function(t, pericia, attr, cd, tipoAcao, rotulo) {
      return usar(t, tipoAcao || "acao", function() {
        var v = [], ds = [];
        if (t.efeitos && t.efeitos.ajudadoPor) {
          v.push("ajudado");
          delete t.efeitos.ajudadoPor;
        }
        if (tem(t, "envenenado")) ds.push("envenenado");
        if (tem(t, "amedrontado")) ds.push("amedrontado");
        var b = bonusPericia(t, pericia, attr) - 2 * (t.exaustao || 0);
        var r = d20(modoFinal(v, ds)), total = r.dado + b;
        var txt = nomeDe(t) + " usa " + (rotulo || pericia) + ": " + pericia + " " + textoD20(r, b, total);
        if (cd) txt += " contra CD " + cd + " — " + (total >= cd ? "sucesso" : "falha");
        return [txt + "."];
      });
    };
