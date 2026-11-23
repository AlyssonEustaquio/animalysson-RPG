function aplicarDano(t, partes, ctx) {
      ctx = ctx || {};
      var L = [], s = preparar(t), totalCausado = 0, detalhes = [];
      if (t.morto) return { linhas: [nomeDe(t) + " já está derrotado."], total: 0 };
      var restante = 0;
      (partes || []).forEach(function(p) {
        var v = Math.max(0, Math.round(Number(p.valor) || 0));
        if (!v) return;
        var tipo = p.tipo || null, nota = "";
        var imune = tipo && s.defesas.imune[tipo] && (!s.defesas.imune[tipo].naoMagico || !ctx.magico);
        var res = tipo && s.defesas.resist[tipo] && (!s.defesas.resist[tipo].naoMagico || !ctx.magico);
        var vul = tipo && s.defesas.vuln[tipo];
        if (t.efeitos && t.efeitos.furia && FISICOS.indexOf(tipo) >= 0) res = true;
        if (tem(t, "petrificado")) res = true;
        if (imune) {
          v = 0;
          nota = " (imune)";
        } else {
          if (res) {
            v = Math.floor(v / 2);
            nota = " (resistência)";
          }
          if (vul) {
            v = v * 2;
            nota = res ? " (resistência e vulnerabilidade)" : " (vulnerabilidade)";
          }
        }
        restante += v;
        detalhes.push(v + " " + nomeTipo(tipo) + nota);
      });
      totalCausado = restante;
      if (!totalCausado) {
        L.push(nomeDe(t) + " não sofre dano" + (detalhes.length ? " [" + detalhes.join(", ") + "]" : "") + ".");
        return { linhas: L, total: 0 };
      }
      if (t.efeitos) t.efeitos.furiaAtividade = true;
      var jaCaido = t.hp <= 0;
      if (t.hpTemp > 0) {
        var abs = Math.min(t.hpTemp, restante);
        t.hpTemp -= abs;
        restante -= abs;
        if (abs) detalhes.push(abs + " absorvidos pelos PV temporários");
      }
      L.push(nomeDe(t) + " sofre " + totalCausado + " de dano [" + detalhes.join(", ") + "].");
      if (!restante) {
        L.push(pontosDeVidaTexto(t) + ".");
        return { linhas: L, total: totalCausado };
      }
      if (ehJogador(t) && jaCaido) {
        if (restante >= t.hpMax) {
          derrotar(t, L);
          L[L.length - 1] = nomeDe(t) + " morre por dano maciço.";
          return { linhas: L, total: totalCausado };
        }
        t.mortes.f += ctx.critico ? 2 : 1;
        t.estavel = false;
        L.push(nomeDe(t) + " sofre dano com 0 PV: " + (ctx.critico ? "2 falhas" : "1 falha") + " na salvaguarda contra a morte (" + t.mortes.f + "/3).");
        if (t.mortes.f >= 3) {
          derrotar(t, L);
          L[L.length - 1] = nomeDe(t) + " morre.";
        }
        return { linhas: L, total: totalCausado };
      }
      var novo = t.hp - restante;
      if (novo > 0) {
        t.hp = novo;
        L.push(pontosDeVidaTexto(t) + ".");
        if (t.concentracao) {
          var cd = Math.min(30, Math.max(10, Math.floor(totalCausado / 2)));
          var rs = C.salvar(t, "CON", cd, { chave: "concentracao" });
          L.push(rs.texto + " (Concentração em " + t.concentracao + ")");
          if (!rs.sucesso) {
            L.push(nomeDe(t) + " perde a concentração em " + t.concentracao + ".");
            t.concentracao = null;
          }
        }
        return { linhas: L, total: totalCausado };
      }
      var excesso = -novo;
      t.hp = 0;
      if (ehJogador(t)) {
        t.concentracao = null;
        if (excesso >= t.hpMax) {
          derrotar(t, L);
          L[L.length - 1] = nomeDe(t) + " morre por dano maciço.";
        } else {
          t.mortes = { s: 0, f: 0 };
          t.estavel = false;
          aplicarCondicao(t, "inconsciente", {});
          if (!tem(t, "caido")) aplicarCondicao(t, "caido", {});
          if (t.efeitos) {
            delete t.efeitos.furia;
          }
          L.push(nomeDe(t) + " cai a 0 PV e fica inconsciente.");
        }
      } else derrotar(t, L);
      return { linhas: L, total: totalCausado };
    }

function curar(t, valor) {
      var L = [];
      if (t.morto) return [nomeDe(t) + " está morto e não pode ser curado desta forma."];
      var v = Math.max(0, Math.round(valor));
      var estava0 = t.hp <= 0;
      t.hp = Math.min(t.hpMax, t.hp + v);
      if (estava0 && t.hp > 0) {
        removerCondicao(t, "inconsciente");
        t.mortes = { s: 0, f: 0 };
        t.estavel = false;
        L.push(nomeDe(t) + " recupera a consciência.");
      }
      L.unshift(nomeDe(t) + " recupera " + v + " PV. " + pontosDeVidaTexto(t) + ".");
      return L;
    }

function salvar(t, atributo, cd, opts) {
      opts = opts || {};
      var s = stats(t), set = condSet(t);
      var texto;
      if ((atributo === "FOR" || atributo === "DES") && (set.paralisado || set.petrificado || set.atordoado || set.inconsciente)) {
        texto = nomeDe(t) + ": salvaguarda de " + NOME_ATTR[atributo] + " falha automaticamente.";
        return { sucesso: false, auto: true, dado: 0, total: 0, texto };
      }
      var v = [], ds = [];
      if (opts.vantagem) v.push("efeito");
      if (opts.desvantagem) ds.push("efeito");
      if (t.efeitos && t.efeitos.furia && atributo === "FOR") v.push("fúria");
      if (set.contido && atributo === "DES") ds.push("contido");
      if (opts.magico && (s.tracos || []).some(function(tr) {
        return /resist[eê]ncia (m[aá]gica|[àa] magia)|magic resistance/i.test(tr.name || tr.nome || "");
      })) v.push("Resistência Mágica");
      var r = d20(modoFinal(v, ds));
      var b = (s.salvas[atributo] != null ? s.salvas[atributo] : s.mods[atributo]) - 2 * (t.exaustao || 0);
      var total = r.dado + b;
      var ok = total >= cd;
      texto = nomeDe(t) + ": salvaguarda de " + NOME_ATTR[atributo] + " " + textoD20(r, b, total) + " contra CD " + cd + " — " + (ok ? "sucesso" : "falha") + ".";
      return { sucesso: ok, auto: false, dado: r.dado, total, texto };
    }

C.salvar = salvar;

function salvaContraMorte(t) {
      var r = d(20), L = [];
      if (r === 20) {
        t.hp = 1;
        t.mortes = { s: 0, f: 0 };
        t.estavel = false;
        removerCondicao(t, "inconsciente");
        L.push(nomeDe(t) + ": salvaguarda contra a morte (20) — recupera 1 PV e a consciência.");
        return L;
      }
      if (r === 1) {
        t.mortes.f += 2;
        L.push(nomeDe(t) + ": salvaguarda contra a morte (1) — 2 falhas (" + t.mortes.f + "/3).");
      } else if (r >= 10) {
        t.mortes.s += 1;
        L.push(nomeDe(t) + ": salvaguarda contra a morte (" + r + ") — sucesso (" + t.mortes.s + "/3).");
      } else {
        t.mortes.f += 1;
        L.push(nomeDe(t) + ": salvaguarda contra a morte (" + r + ") — falha (" + t.mortes.f + "/3).");
      }
      if (t.mortes.f >= 3) {
        derrotar(t, L);
        L[L.length - 1] = nomeDe(t) + " morre.";
      } else if (t.mortes.s >= 3) {
        t.estavel = true;
        L.push(nomeDe(t) + " está estável.");
      }
      return L;
    }

function aplicarEfeitosAcerto(att, alvo, atq, L) {
      var ex = atq.extra;
      if (!ex) return;
      if (ex.danoAdicional) {
        var rd = rolar(ex.danoAdicional, false);
        if (rd) L.push.apply(L, aplicarDano(alvo, [{ valor: rd.total, tipo: ex.tipoAdicional }], { magico: !!atq.magico, fonte: att }).linhas);
      }
      if (ex.salva) {
        var rs = salvar(alvo, ex.salva.atributo, ex.salva.cd, { magico: !!atq.magico });
        L.push(rs.texto);
        var parts = [];
        if (ex.dano) {
          var rdx = rolar(ex.dano, false);
          if (rdx) {
            var val = rs.sucesso ? ex.metade ? Math.floor(rdx.total / 2) : 0 : rdx.total;
            if (val > 0) parts.push({ valor: val, tipo: ex.tipo });
          }
        }
        if (parts.length) L.push.apply(L, aplicarDano(alvo, parts, { magico: !!atq.magico, fonte: att }).linhas);
        if (!rs.sucesso && ex.condicao && !alvo.morto) {
          var msg = aplicarCondicao(alvo, ex.condicao, { fonte: att.id, rodadas: ex.rodadas, salva: ex.repete ? { atributo: ex.salva.atributo, cd: ex.salva.cd } : null });
          if (msg) L.push(msg);
        }
      } else if (ex.condicao === "agarrado" && !alvo.morto) {
        var msg2 = aplicarCondicao(alvo, "agarrado", { fonte: att.id, rodadas: null });
        var cg = (alvo.condicoes || []).find(function(c) {
          return c.id === "agarrado" && c.fonte === att.id;
        });
        if (cg && ex.escape) cg.escape = ex.escape;
        if (msg2) L.push(msg2 + (ex.escape ? " CD de escape " + ex.escape + "." : ""));
      }
    }

function nomeMaestria(txt) {
      var n = norm(txt);
      var mapa = { cleave: "cleave", nick: "nick", vex: "vex", sap: "sap", lento: "lento", slow: "lento", empurrar: "empurrar", push: "empurrar", derrubar: "derrubar", topple: "derrubar", raspar: "raspar", graze: "raspar" };
      return mapa[n] || null;
    }

function atacar(att, alvo, atq, opts) {
      opts = opts || {};
      var L = [];
      var sa = preparar(att), sd = preparar(alvo);
      var nA = nomeDe(att), nD = nomeDe(alvo);
      var falha = function(m) {
        return { ok: false, linhas: [m], acertou: false, critico: false, dano: 0 };
      };
      if (alvo.morto) return falha(nD + " já foi derrotado.");
      if (incapacitado(att)) return falha(nA + " está incapacitado e não pode atacar.");
      if (tem(att, "enfeiticado") && condicaoFonte(att, "enfeiticado") === alvo.id) return falha(nA + " está enfeitiçado e não pode atacar " + nD + ".");
      var distancia = dist(att, alvo);
      var alcMax = atq.alcanceMax || atq.alcanceNormal || 1;
      if (distancia > alcMax) return falha(nD + " está fora do alcance de " + atq.nome + " (" + distancia + " > " + alcMax + " quadrículas).");
      if (!opts.ignorarVisao && !env.linhaVisao(att, alvo)) return falha(nA + " não tem linha de visão para " + nD + ".");
      if (alvo.cobertura >= 99) return falha(nD + " tem cobertura total.");
      var vant = vantagemAtaque(att, alvo, atq, distancia);
      var r = d20(vant.modo);
      var bonus = (Number(atq.bonus) || 0) - 2 * (att.exaustao || 0);
      var total = r.dado + bonus;
      var ca = sd.ca + (alvo.cobertura === 2 || alvo.cobertura === 5 ? alvo.cobertura : 0);
      var natCrit = r.dado === 20, natFalha = r.dado === 1;
      var acertou = natCrit || !natFalha && total >= ca;
      var razoes = vant.modo === 1 ? " [vantagem: " + vant.v.join(", ") + "]" : vant.modo === -1 ? " [desvantagem: " + vant.ds.join(", ") + "]" : vant.v.length && vant.ds.length ? " [vantagem e desvantagem se anulam]" : "";
      L.push(nA + " ataca " + nD + " com " + atq.nome + ": " + textoD20(r, bonus, total) + " contra CA " + ca + (alvo.cobertura === 2 ? " (cobertura parcial)" : alvo.cobertura === 5 ? " (cobertura de três quartos)" : "") + razoes + ".");
      var maestriaAtiva = sa.maestria && atq.arma && atq.maestria ? nomeMaestria(atq.maestria) : null;
      var resultado = { ok: true, acertou, critico: false, dano: 0 };
      var haviaVex = att.efeitos && att.efeitos.vex && att.efeitos.vex.alvo === alvo.id;
      var eraVant = vant.modo === 1;
      var haviaAliado = toks().some(function(o) {
        return o !== att && viva(o) && faccao(o) === faccao(att) && !incapacitado(o) && dist(o, alvo) <= 1;
      });
      consumirEfeitosDeAtaque(att, alvo);
      if (!acertou) {
        L.push(natFalha ? "Falha crítica: o ataque erra." : "O ataque erra.");
        if (maestriaAtiva === "raspar" && atq.modAtributo > 0 && atq.dano && atq.dano[0]) {
          L.push.apply(L, aplicarDano(alvo, [{ valor: atq.modAtributo, tipo: atq.dano[0].tipo }], { magico: !!atq.magico, fonte: att }).linhas);
          L[L.length - 1] += " (Raspar)";
        }
        return Object.assign(resultado, { linhas: L });
      }
      var crit = natCrit || distancia <= 1 && (tem(alvo, "paralisado") || tem(alvo, "inconsciente"));
      resultado.critico = crit;
      if (crit) L.push(natCrit ? "Acerto crítico!" : "Acerto crítico automático (alvo indefeso ao alcance).");
      var partes = [], textoDano = [];
      (atq.dano || []).forEach(function(p) {
        var rd = rolar(p.dados, crit);
        if (!rd) return;
        partes.push({ valor: rd.total, tipo: p.tipo });
        textoDano.push(rd.total + " " + nomeTipo(p.tipo) + " (" + p.dados + (crit ? ", dados dobrados" : "") + (rd.dados.length ? ": " + rd.dados.join("+") : "") + ")");
      });
      var tipoBase = atq.dano && atq.dano[0] ? atq.dano[0].tipo : null;
      if (att.efeitos && att.efeitos.furia && atq.arma && !atq.distancia && atq.atributoMod === "FOR") {
        partes.push({ valor: Math.max(2, 2 + Math.floor(((sa.nivel || 1) - 1) / 8)), tipo: tipoBase });
        textoDano.push("+2 de Fúria");
      }
      if (sa.classe === "Ladino" && atq.arma && !att.eco.furtivo && (atq.acuidade || atq.distancia) && !(vant.modo === -1)) {
        if (eraVant || haviaVex || !eraVant && haviaAliado) {
          var dadosFurtivo = Math.ceil((sa.nivel || 1) / 2) + "d6";
          var rf = rolar(dadosFurtivo, crit);
          if (rf) {
            partes.push({ valor: rf.total, tipo: tipoBase });
            textoDano.push(rf.total + " de Ataque Furtivo (" + dadosFurtivo + ")");
            att.eco.furtivo = true;
          }
        }
      }
      if (textoDano.length) L.push("Dano: " + textoDano.join(" + ") + ".");
      var res = aplicarDano(alvo, partes, { critico: crit, magico: !!atq.magico, fonte: att });
      L.push.apply(L, res.linhas);
      resultado.dano = res.total;
      if (!alvo.morto) aplicarEfeitosAcerto(att, alvo, atq, L);
      if (maestriaAtiva && res.total > 0 && !alvo.morto) {
        if (maestriaAtiva === "vex") {
          att.efeitos.vex = { alvo: alvo.id, turnos: 2 };
          L.push("Maestria Vex: vantagem no próximo ataque de " + nA + " contra " + nD + ".");
        } else if (maestriaAtiva === "sap") {
          alvo.efeitos.sap = { fonte: att.id };
          L.push("Maestria Sap: " + nD + " terá desvantagem no próximo ataque.");
        } else if (maestriaAtiva === "lento") {
          alvo.efeitos.lento = { fonte: att.id, celulas: 2 };
          L.push("Maestria Lento: deslocamento de " + nD + " reduzido em 3 m.");
        } else if (maestriaAtiva === "empurrar") {
          if (sd.tam <= 2 && env.empurrar) {
            var n = env.empurrar(alvo, att, 2);
            L.push("Maestria Empurrar: " + nD + (n ? " é empurrado " + mts(n) + " m." : " não pode ser empurrado (obstáculo)."));
          } else L.push("Maestria Empurrar: " + nD + " é grande demais para ser empurrado.");
        } else if (maestriaAtiva === "derrubar") {
          var cdT = 8 + (atq.modAtributo || 0) + sa.prof;
          var rt = salvar(alvo, "CON", cdT, {});
          L.push("Maestria Derrubar: " + rt.texto);
          if (!rt.sucesso) {
            var mq = aplicarCondicao(alvo, "caido", {});
            if (mq) L.push(mq);
          }
        } else if (maestriaAtiva === "cleave" && !att.eco.cleave && atq.pesada && !opts.semCleave) {
          var outro = toks().find(function(o) {
            return o !== alvo && o !== att && viva(o) && hostis(att, o) && dist(o, alvo) <= 1 && dist(att, o) <= alcMax;
          });
          if (outro) {
            att.eco.cleave = true;
            var atqC = Object.assign({}, atq, { dano: (atq.dano || []).map(function(p) {
              return { dados: p.dados.replace(/[+-]\d+$/, ""), tipo: p.tipo };
            }), nome: atq.nome + " (Cleave)" });
            var rc = atacar(att, outro, atqC, { semCleave: true });
            L.push.apply(L, rc.linhas);
          }
        }
      }
      return Object.assign(resultado, { linhas: L });
    }

C.atacar = atacar;

C.aplicarDano = aplicarDano;

C.curar = curar;

C.salvaContraMorte = salvaContraMorte;

C.alvosPossiveis = function(att, atq, incluirAliados) {
      var alcMax = atq.alcanceMax || atq.alcanceNormal || 1;
      return toks().filter(function(o) {
        if (o === att || !viva(o)) return false;
        if (!incluirAliados && !hostis(att, o)) return false;
        if (o.cobertura >= 99) return false;
        if (dist(att, o) > alcMax) return false;
        return env.linhaVisao(att, o);
      }).map(function(o) {
        return { token: o, distancia: dist(att, o) };
      }).sort(function(a, b) {
        return a.distancia - b.distancia;
      });
    };

function limparEfeitosDaFonte(id) {
      toks().forEach(function(o) {
        if (!o.efeitos) return;
        if (o.efeitos.lento && o.efeitos.lento.fonte === id) delete o.efeitos.lento;
        if (o.efeitos.sap && o.efeitos.sap.fonte === id) delete o.efeitos.sap;
        if (o.efeitos.ajudadoPor === id) delete o.efeitos.ajudadoPor;
        if (o.efeitos.distraido === id) delete o.efeitos.distraido;
      });
    }

function iniciarTurno(t) {
      var L = [], s = preparar(t);
      var recarga = t.recargas || {};
      t.eco = novaEco();
      limparEfeitosDaFonte(t.id);
      L.push("— Turno de " + nomeDe(t) + " —");
      if (t.efeitos && t.efeitos.furia) {
        if (!t.efeitos.furiaAtividade) {
          delete t.efeitos.furia;
          L.push(nomeDe(t) + " não atacou nem sofreu dano desde o último turno: a Fúria termina.");
        }
        t.efeitos.furiaAtividade = false;
      }
      (s.ataques || []).forEach(function(a) {
        if (a.recarga && recarga[a.nome] === false) {
          var r = d(6);
          if (r >= a.recarga) {
            recarga[a.nome] = true;
            L.push(a.nome + " recarregou (d6 = " + r + ").");
          } else L.push(a.nome + " não recarregou (d6 = " + r + ").");
        }
      });
      t.recargas = recarga;
      if (ehJogador(t) && t.hp <= 0 && !t.morto && !t.estavel) L.push.apply(L, salvaContraMorte(t));
      return L;
    }

function encerrarTurno(t) {
      var L = [];
      (t.condicoes || []).slice().forEach(function(c) {
        if (c.salva) {
          var fonte = porId(c.fonte);
          var rs = salvar(t, c.salva.atributo, c.salva.cd, { desvantagem: c.id === "amedrontado" && fonte && env.linhaVisao(t, fonte) && c.salva.desvDeVisao });
          L.push(rs.texto);
          if (rs.sucesso) {
            t.condicoes = t.condicoes.filter(function(x) {
              return x !== c;
            });
            L.push(CONDICOES[c.id] + " termina em " + nomeDe(t) + ".");
            return;
          }
        }
        if (c.rodadas != null) {
          c.rodadas -= 1;
          if (c.rodadas <= 0) {
            t.condicoes = t.condicoes.filter(function(x) {
              return x !== c;
            });
            L.push(CONDICOES[c.id] + " termina em " + nomeDe(t) + ".");
          }
        }
      });
      if (t.efeitos && t.efeitos.vex) {
        t.efeitos.vex.turnos -= 1;
        if (t.efeitos.vex.turnos <= 0) delete t.efeitos.vex;
      }
      return L;
    }

C.atual = function() {
      var s = est();
      if (!s.ativo || !s.ordem.length) return null;
      var item = s.ordem[s.turno];
      return item ? porId(item.id) : null;
    };

C.ativo = function() {
      return !!est().ativo;
    };

C.preparar = preparar;

C.stats = stats;

C.veloc = veloc;

C.movimentoRestante = movimentoRestante;

C.condicoesDe = function(t) {
      return Object.keys(condSet(t));
    };

C.tem = tem;

C.aplicarCondicao = aplicarCondicao;

C.removerCondicao = removerCondicao;

C.faccao = faccao;

C.hostis = hostis;

C.dist = dist;
