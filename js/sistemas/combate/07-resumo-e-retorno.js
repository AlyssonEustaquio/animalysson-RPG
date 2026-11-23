C.resumoOrdem = function() {
      var s = est();
      return s.ordem.map(function(x, i) {
        var t = porId(x.id);
        return { id: x.id, nome: t ? nomeDe(t) : "?", valor: x.valor, atual: i === s.turno && s.ativo, morto: !t || !!t.morto, caido: !!t && t.hp <= 0 && !t.morto, token: t };
      });
    };

return C;
