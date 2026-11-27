const CSS = `
.inv,.inv-dlg{--f:var(--bg,#121212);--p:var(--card,#1e1e20);--p2:var(--box,#252528);--b:var(--line,#3a3a3f);--t:var(--ink,#f2f2f2);--s:var(--mute,#a0a0a6);--d:var(--red,#c53131);--g:var(--ok,#5bbf8f);--a:#e0a84a;--r:#ff6f64;--on:var(--redink,#fff)}
.inv{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;color:var(--t);font:14px/1.4 Roboto,system-ui,-apple-system,"Segoe UI",sans-serif;box-sizing:border-box}
.inv *{box-sizing:border-box}
.inv button,.inv input,.inv select,.inv textarea,.inv-dlg button,.inv-dlg input,.inv-dlg select,.inv-dlg textarea{font:inherit;color:inherit}
.inv-topo{display:flex;flex-direction:column;gap:8px}
.inv-resumo{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
.inv-card{background:var(--p);border:1px solid var(--b);border-radius:8px;padding:8px 12px;min-width:0}
.inv-card small{display:block;color:var(--s);font-size:12px}
.inv-card strong{font-size:20px;font-weight:600}
.inv-peso{grid-column:span 2}
.inv-barra{height:8px;border-radius:4px;background:var(--f);margin-top:6px;overflow:hidden}
.inv-barra i{display:block;height:100%;background:var(--g);transition:width .2s}
.inv-barra.alto i{background:var(--a)}
.inv-barra.excesso i{background:var(--r)}
.inv-avisos{display:flex;flex-wrap:wrap;gap:6px}
.inv-aviso{font-size:12px;border:1px solid var(--a);color:var(--a);border-radius:6px;padding:4px 8px}
.inv-aviso.perigo{border-color:var(--r);color:var(--r)}
.inv-corpo{display:grid;grid-template-columns:minmax(220px,280px) minmax(0,1fr) minmax(190px,230px);gap:10px;min-height:0}
.inv-col{background:var(--p);border:1px solid var(--b);border-radius:8px;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.inv-col>h3{margin:0;padding:10px 12px;font-size:15px;font-weight:600;border-bottom:1px solid var(--b)}
.inv-abas{display:flex;border-bottom:1px solid var(--b)}
.inv-abas button{flex:1;background:transparent;border:0;border-bottom:2px solid transparent;padding:10px;cursor:pointer;font-weight:600;color:var(--s)}
.inv-abas button.on{color:var(--t);border-bottom-color:var(--d)}
.inv-painel{display:flex;flex-direction:column;min-height:0;flex:1}
.inv-rolagem{overflow:auto;min-height:0;flex:1;padding:10px}
.inv-slot{width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px;text-align:left;background:var(--p2);border:1px dashed var(--b);border-radius:6px;padding:7px 10px;margin-bottom:6px;cursor:pointer}
.inv-slot span{color:var(--s);font-size:12px;flex:none}
.inv-slot b{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.inv-slot.cheio{border-style:solid;border-color:var(--d)}
.inv-slot:hover,.inv button:hover{border-color:var(--d)}
.inv-barra-ferr{display:flex;gap:6px;padding:10px;border-bottom:1px solid var(--b);flex-wrap:wrap;align-items:center}
.inv-barra-ferr input,.inv-barra-ferr select{background:var(--f);border:1px solid var(--b);border-radius:6px;padding:6px 8px;min-width:0}
.inv-barra-ferr input{flex:1 1 140px}
.inv-btn{background:var(--p2);border:1px solid var(--b);border-radius:6px;padding:6px 10px;cursor:pointer}
.inv-btn.pri{background:var(--d);border-color:var(--d);color:var(--on);font-weight:600}
.inv-btn.mini{padding:3px 8px;font-size:12px}
.inv-btn.perigo:hover{border-color:var(--r);color:var(--r)}
.inv-btn.on{border-color:var(--d);color:var(--d)}
.inv-btn:disabled{opacity:.48;cursor:not-allowed;filter:saturate(.55)}
.inv-btn:disabled:hover{border-color:var(--b)}
.inv-item{border:1px solid var(--b);border-radius:6px;padding:8px 10px;margin-bottom:6px;background:var(--p2)}
.inv-item.eqp{border-left:3px solid var(--d)}
.inv-linha1{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.inv-nome{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.inv-meta{color:var(--s);font-size:12px;margin-top:2px}
.inv-acoes{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;align-items:center}
.inv-qtd{display:inline-flex;align-items:center;gap:2px}
.inv-qtd span{min-width:28px;text-align:center}
.inv-tag{display:inline-block;font-size:11px;border:1px solid var(--b);border-radius:10px;padding:0 7px;margin-left:4px;color:var(--s)}
.inv-tag.sint{border-color:var(--a);color:var(--a)}
.inv-tag.mont{border-color:var(--g);color:var(--g)}
.inv-vazio{color:var(--s);text-align:center;padding:24px 8px}
.inv-mont{border:1px solid var(--b);border-radius:8px;padding:10px;margin-bottom:10px;background:var(--p2)}
.inv-mont.ativa{border-color:var(--g)}
.inv-mont h4{margin:0;font-size:15px;display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.inv-mont .inv-item{background:var(--p);margin:6px 0 0}
.inv-moeda{display:flex;align-items:center;gap:6px;margin-bottom:8px}
.inv-moeda label{width:54px;color:var(--s);font-size:12px}
.inv-moeda input{width:100%;min-width:0;background:var(--f);border:1px solid var(--b);border-radius:6px;padding:5px 8px;text-align:right}
.inv-dlg{font:14px/1.4 Roboto,system-ui,sans-serif;background:var(--p);color:var(--t);border:1px solid var(--b);border-radius:10px;padding:0;width:min(560px,94vw);max-height:90vh}
.inv-dlg *{box-sizing:border-box}
.inv-dlg::backdrop{background:rgba(0,0,0,.6)}
.inv-dlg-c{padding:14px;max-height:90vh;overflow:auto;display:flex;flex-direction:column;gap:10px}
.inv-dlg h3{margin:0;font-size:16px}
.inv-dlg h4{margin:8px 0 2px;font-size:14px}
.inv-dlg ul{margin:0;padding-left:18px}
.inv-dlg li{margin-bottom:3px}
.inv-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.inv-grid label{display:flex;flex-direction:column;gap:3px;color:var(--s);font-size:12px}
.inv-grid label[hidden]{display:none}
.inv-grid .l{grid-column:1/-1}
.inv-grid input,.inv-grid select,.inv-grid textarea{background:var(--f);border:1px solid var(--b);border-radius:6px;padding:6px 8px;color:var(--t)}
.inv-chk{flex-direction:row!important;align-items:center;gap:6px!important;color:var(--t)!important;font-size:14px!important}
.inv-dlg-rod{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}
.inv-cat{display:flex;justify-content:space-between;gap:8px;align-items:center;border:1px solid var(--b);border-radius:6px;padding:6px 10px;background:var(--p2)}
.inv-cat small{color:var(--s)}
.inv button:focus-visible,.inv input:focus-visible,.inv select:focus-visible,.inv-dlg button:focus-visible,.inv-dlg input:focus-visible,.inv-dlg select:focus-visible,.inv-dlg textarea:focus-visible{outline:2px solid var(--d);outline-offset:1px}
@media (max-width:900px){
.inv{height:auto;min-height:100%;display:block}
.inv-corpo{display:flex;flex-direction:column;margin-top:10px}
.inv-col{max-height:none}
.inv-peso{grid-column:auto}
}
`;
