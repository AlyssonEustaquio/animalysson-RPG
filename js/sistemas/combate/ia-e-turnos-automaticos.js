function expandirMultiataque(multi, atkAcoes) {
      var seq = [];
      if (!atkAcoes.length) return seq;
      var texto = multi.texto || "";
      atkAcoes.forEach(function(a) {
        var tronco = norm(a.nome).slice(0, 4);
        var pos = tronco.length >= 3 ? texto.indexOf(tronco) : -1;
        if (pos < 0) return;
        var antes = texto.slice(Math.max(0, pos - 22), pos);
        var mm = antes.match(/(um|uma|dois|duas|tres|quatro|cinco|seis)\s+(?:ataques?\s+)?(?:com\s+)?(?:a|as|o|os|sua|suas|seu|seus)?\s*$/);
        var n = mm ? PALAVRAS_NUM[mm[1]] : 1;
        for (var i = 0; i < n; i++) seq.push(a);
      });
      var total = multi.qtd && multi.qtd.dados ? (rolar(multi.qtd.dados, false) || { total: 2 }).total : multi.qtd && multi.qtd.n || 2;
      if (!seq.length) {
        var ordenados = atkAcoes.slice().sort(function(a, b) {
          return somaMedia(b) - somaMedia(a);
        });
        for (var j = 0; j < total; j++) seq.push(ordenados[j % ordenados.length]);
      } else if (seq.length < total) {
        while (seq.length < total) seq.push(seq[seq.length - 1]);
      }
      return seq.slice(0, 8);
    }
function somaMedia(a) {
      return (a.dano || []).reduce(function(acc, p) {
        return acc + mediaDano(p.dados);
      }, 0);
    }
function escolherAlvoIA(t) {
      var cand = toks().filter(function(o) {
        return o !== t && viva(o) && hostis(t, o) && o.hp > 0 && !o.escondido;
      });
      if (!cand.length) cand = toks().filter(function(o) {
        return o !== t && viva(o) && hostis(t, o) && ehJogador(o) && o.hp <= 0 && !o.estavel;
      });
      if (!cand.length) return null;
      cand.sort(function(a, b) {
        return dist(t, a) - dist(t, b) || a.hp - b.hp;
      });
      return cand[0];
    }
function passoIA(t, cel, L) {
      var de = { x: t.x, y: t.y }, custo = tem(t, "caido") ? 2 : 1;
      if (movimentoRestante(t) < custo) return false;
      env.mover(t, cel.x, cel.y);
      t.eco.mov += custo;
      var oa = ataquesDeOportunidade(t, de, { x: cel.x, y: cel.y });
      if (oa.length) L.push.apply(L, oa);
      return !t.morto;
    }
C.turnoIA = function(t) {
      var L = [], s = preparar(t);
      if (incapacitado(t) || t.hp <= 0) {
        L.push(nomeDe(t) + " está incapacitado e perde o turno.");
        registrar(L);
        return L;
      }
      if (tem(t, "caido")) {
        L.push.apply(L, C.levantar(t));
      }
      var alvo = escolherAlvoIA(t);
      if (!alvo) {
        registrar(L);
        return L;
      }
      var acoes = s.ataques || [];
      var atkAcoes = acoes.filter(function(a) {
        return a.tipo === "ataque";
      });
      var salvaAcoes = acoes.filter(function(a) {
        return a.tipo === "salva" && a.recarga && t.recargas[a.nome] !== false;
      });
      var usouSalva = false;
      salvaAcoes.forEach(function(a) {
        if (usouSalva) return;
        var raioAcao = a.area || 6;
        var alvos = toks().filter(function(o) {
          return o !== t && viva(o) && hostis(t, o) && o.hp > 0 && dist(t, o) <= raioAcao && env.linhaVisao(t, o);
        });
        if (!alvos.length) return;
        usouSalva = true;
        t.recargas[a.nome] = false;
        t.eco.acao = false;
        L.push(nomeDe(t) + " usa " + a.nome + ".");
        alvos.forEach(function(o) {
          L.push.apply(L, aplicarAcaoSalva(t, o, a));
        });
      });
      if (usouSalva) {
        registrar(L);
        return L;
      }
      var seq = [], multi = acoes.find(function(a) {
        return a.tipo === "multi";
      });
      if (atkAcoes.length) {
        if (multi) seq = expandirMultiataque(multi, atkAcoes);
        if (!seq.length) {
          var melhor = atkAcoes.slice().sort(function(a, b) {
            return somaMedia(b) - somaMedia(a);
          })[0];
          seq = [melhor];
        }
      }
      if (!seq.length) {
        var salvaLivre = acoes.find(function(a) {
          return a.tipo === "salva" && !a.recarga && a.area;
        });
        if (salvaLivre) {
          var area = toks().filter(function(o) {
            return o !== t && viva(o) && hostis(t, o) && o.hp > 0 && dist(t, o) <= salvaLivre.area && env.linhaVisao(t, o);
          });
          if (area.length) {
            L.push(nomeDe(t) + " usa " + salvaLivre.nome + ".");
            area.forEach(function(o) {
              L.push.apply(L, aplicarAcaoSalva(t, o, salvaLivre));
            });
          }
        }
        if (!L.length) L.push(nomeDe(t) + " não tem ataques utilizáveis e aguarda.");
        registrar(L);
        return L;
      }
      var primeira = seq[0];
      var distancia = dist(t, alvo);
      var modoPrim = primeira.modo === "ambos" ? distancia <= primeira.alcanceCorpo ? "corpo" : "distancia" : primeira.modo === "distancia" ? "distancia" : "corpo";
      var alcNec = modoPrim === "corpo" ? primeira.alcanceCorpo : primeira.alcanceNormal;
      if (distancia > alcNec) {
        var rota = env.caminho ? env.caminho(t, alvo, alcNec, 200) : null;
        if (rota && rota.length) {
          var passos = 0;
          for (var i = 0; i < rota.length; i++) {
            if (movimentoRestante(t) < (tem(t, "caido") ? 2 : 1)) {
              if (t.eco.acao && !t.eco.dash && i < rota.length && veloc(t) > 0) {
                t.eco.dash = true;
                t.eco.movExtra += veloc(t);
                t.eco.acao = false;
                L.push(nomeDe(t) + " usa Disparada.");
              } else break;
            }
            if (!passoIA(t, rota[i], L)) break;
            passos++;
            if (pegadaDist(t.x, t.y, raio(t), alvo.x, alvo.y, raio(alvo)) <= alcNec) break;
          }
          if (passos) L.unshift(nomeDe(t) + " avança " + mts(passos) + " m.");
        }
        distancia = dist(t, alvo);
      }
      if (t.morto) {
        registrar(L);
        return L;
      }
      if (!t.eco.acao) {
        registrar(L);
        return L;
      }
      t.eco.acao = false;
      var alvoAtual = alvo;
      var fez = false;
      seq.forEach(function(a) {
        if (t.morto || incapacitado(t)) return;
        if (alvoAtual.morto || alvoAtual.hp <= 0 && !ehJogador(alvoAtual)) {
          var novo = escolherAlvoIA(t);
          if (!novo) return;
          alvoAtual = novo;
        }
        var d0 = dist(t, alvoAtual);
        var modo = a.modo === "ambos" ? d0 <= a.alcanceCorpo ? "corpo" : "distancia" : a.modo === "distancia" ? "distancia" : "corpo";
        var atq = atqDeMonstro(a, modo);
        var r = atacar(t, alvoAtual, atq, {});
        if (!r.ok && /fora do alcance|linha de visão/.test(r.linhas[0])) {
          if (!fez) L.push(r.linhas[0]);
          return;
        }
        fez = true;
        L.push.apply(L, r.linhas);
      });
      registrar(L);
      return L;
    };
function aplicarAcaoSalva(t, alvo, a) {
      var L = [];
      var rs = salvar(alvo, a.atributo, a.cd, { magico: false });
      L.push(rs.texto);
      var parts = [];
      (a.dano || []).forEach(function(p) {
        var r = rolar(p.dados, false);
        if (!r) return;
        var val = rs.sucesso ? a.metade ? Math.floor(r.total / 2) : 0 : r.total;
        if (val > 0) parts.push({ valor: val, tipo: p.tipo });
      });
      if (parts.length) L.push.apply(L, aplicarDano(alvo, parts, { fonte: t, magico: false }).linhas);
      if (!rs.sucesso && a.condicao && !alvo.morto) {
        var m = aplicarCondicao(alvo, a.condicao, { fonte: t.id, rodadas: a.rodadas == null ? 10 : a.rodadas, salva: a.repete ? { atributo: a.atributo, cd: a.cd, desvDeVisao: true } : null });
        if (m) L.push(m);
      }
      return L;
    }
C.aplicarAcaoSalva = aplicarAcaoSalva;
C.controladoPorIA = function(t) {
      if (!t || ehJogador(t)) return false;
      return est().autoIA !== false;
    };
C.executarTurnosAutomaticos = function() {
      var s = est(), L = [], guarda = 0;
      while (s.ativo && guarda++ < s.ordem.length * 2 + 2) {
        var cur = C.atual();
        if (!cur || !C.controladoPorIA(cur)) break;
        L.push.apply(L, C.turnoIA(cur));
        if (est().ativo) L.push.apply(L, C.proximoTurno());
      }
      return L;
    };
C.encerrarTurnoAtual = function() {
      var L = C.proximoTurno();
      if (est().ativo) L.push.apply(L, C.executarTurnosAutomaticos());
      return L;
    };
C.iniciarCombate = function(opts) {
      var L = C.iniciar(opts);
      if (est().ativo) L.push.apply(L, C.executarTurnosAutomaticos());
      return L;
    };
C.resumoOrdem = function() {
      var s = est();
      return s.ordem.map(function(x, i) {
        var t = porId(x.id);
        return { id: x.id, nome: t ? nomeDe(t) : "?", valor: x.valor, atual: i === s.turno && s.ativo, morto: !t || !!t.morto, caido: !!t && t.hp <= 0 && !t.morto, token: t };
      });
    };
return C;
