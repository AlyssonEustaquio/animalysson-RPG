(function(){
if(window.__mobileFix)return;
window.__mobileFix=true;
var vp=document.querySelector('meta[name=viewport]');
if(vp)vp.setAttribute('content','width=device-width, initial-scale=1, viewport-fit=cover');
var css=`
html,body{-webkit-text-size-adjust:100%;overscroll-behavior:none}
button,.opt,.item,.catalog-card,.section-tab,.pm,.mp-mbtn{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.modal-bg{overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
@media(max-width:800px){
input,select,textarea{font-size:16px}
.rail-slot{right:calc(10px + env(safe-area-inset-right,0px))}
.modal-bg{padding:10px 8px}
.modal{padding:14px}
}
@media(hover:none){
.box.clickable .edit,.f-field.clickable .edit{opacity:.7;color:var(--red)}
.catalog-card:hover{transform:none;box-shadow:none}
.box.clickable:hover,.f-field.clickable:hover{box-shadow:none}
}
@media(pointer:coarse){
.pm{width:42px;height:42px}
.btn,.item,.opt,.mapa-subtabs button{min-height:44px}
.sk label{min-height:44px}
input[type=checkbox]{width:22px;height:22px}
.rail-toggle{min-width:44px;height:44px}
.section-tab{min-height:46px}
.modal .close-x{font-size:2rem;padding:4px 12px}
}
`;
var st=document.createElement('style');
st.textContent=css;
document.head.appendChild(st);

document.addEventListener('pointerdown',function(e){
var s=document.getElementById('rail-slot');
if(s&&!s.classList.contains('collapsed')&&!s.contains(e.target)&&typeof setRail==='function')setRail(false);
},true);

window.addEventListener('orientationchange',function(){
setTimeout(function(){window.dispatchEvent(new Event('resize'))},250);
});

function iniciar(){
if(typeof S==='undefined'||typeof render!=='function')return;
var PKEYS=['name','cls','sp','bg','mode','p2','p1','method','std','pb','man','skills','rolled','lang','align'];
var VIEWS=['character','items','inventory','monsters','maps'];
var LS='animalysson-ficha';
function salvar(){
try{
var o={view:ACTIVE_VIEW};
PKEYS.forEach(function(k){o[k]=S[k]});
localStorage.setItem(LS,JSON.stringify(o));
}catch(_){}
}
function restaurar(){
try{
var o=JSON.parse(localStorage.getItem(LS)||'null');
if(!o)return false;
PKEYS.forEach(function(k){if(o[k]!==undefined)S[k]=o[k]});
if(S.cls!==null&&!CL[S.cls])S.cls=null;
if(S.sp!==null&&!SP[S.sp])S.sp=null;
if(S.bg!==null&&!BG[S.bg])S.bg=null;
if(VIEWS.indexOf(o.view)>-1)ACTIVE_VIEW=o.view;
return true;
}catch(_){return false}
}
var renderBase=window.render;
window.render=function(){renderBase.apply(this,arguments);salvar()};
var modalBase=window.renderModal;
if(typeof modalBase==='function'){
window.renderModal=function(){
var bg=document.querySelector('.modal-bg');
var sd=bg&&bg.querySelector('.side');
var a=bg?bg.scrollTop:0,b=sd?sd.scrollTop:0;
modalBase.apply(this,arguments);
bg=document.querySelector('.modal-bg');
if(bg){
bg.scrollTop=a;
sd=bg.querySelector('.side');
if(sd)sd.scrollTop=b;
}
};
}
if(restaurar())window.render();
}

if(window.__appPronto)iniciar();
else window.addEventListener('animalysson:pronto',iniciar,{once:true});
})();
