(function(){
if(window.__mobileFix)return;
window.__mobileFix=true;
var vp=document.querySelector('meta[name=viewport]');
if(vp)vp.setAttribute('content','width=device-width, initial-scale=1, viewport-fit=cover');
var css=`
html,body{-webkit-text-size-adjust:100%;overscroll-behavior:none}
button,.opt,.item,.catalog-card,.section-tab,.pm,.mp-mbtn{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.modal-bg{overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
@supports(height:100dvh){
@media(min-width:801px){
.mp-wrap{height:calc(100dvh - 230px)}
.vtt-wrap,.mp.vtt .mp-main{height:calc(100dvh - 180px)}
}
@media(max-width:800px){
.mp-main,.vtt-wrap .mp-main,.mp.vtt .mp-main{height:55dvh;min-height:320px}
.mp-side,.vtt-wrap .mp-side{max-height:36dvh}
}
}
@media(max-width:800px){
#app.view-maps{overflow-y:auto}
#app #mp-root{flex:none}
input,select,textarea{font-size:16px}
.rail-slot{right:calc(10px + env(safe-area-inset-right,0px))}
.ficha *{font-size:.9rem}
.ficha .lbl{font-size:.68rem}
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
#mb-pad{position:fixed;left:calc(14px + env(safe-area-inset-left,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:80;display:none;grid-template-columns:repeat(3,56px);grid-template-rows:repeat(3,56px);gap:6px;user-select:none;-webkit-user-select:none;touch-action:none;opacity:.88}
#mb-pad button{width:56px;height:56px;border-radius:12px;border:1px solid var(--line);background:rgba(30,30,32,.92);color:var(--ink);font:700 1.4rem/1 "Roboto Condensed",system-ui,sans-serif;touch-action:none;-webkit-touch-callout:none}
#mb-pad button:active,#mb-pad button.on{background:var(--red);border-color:var(--red)}
#mb-tog{position:fixed;left:calc(14px + env(safe-area-inset-left,0px));bottom:calc(210px + env(safe-area-inset-bottom,0px));z-index:80;display:none;width:44px;height:44px;border-radius:10px;border:1px solid var(--line);background:rgba(30,30,32,.92);color:var(--ink);font-size:1.2rem}
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

if(typeof S!=='undefined'&&typeof render==='function'){
var PKEYS=['name','cls','sp','bg','mode','p2','p1','method','std','pb','man','skills','rolled','lang','align'];
var VIEWS=['character','items','inventory','monsters','maps'];
var LS='animalysson-ficha';
function saveFicha(){
try{
var o={view:ACTIVE_VIEW};
PKEYS.forEach(function(k){o[k]=S[k]});
localStorage.setItem(LS,JSON.stringify(o));
}catch(_){}
}
function restoreFicha(){
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
var baseRender=window.render;
window.render=function(){baseRender.apply(this,arguments);saveFicha()};
var baseModal=window.renderModal;
if(typeof baseModal==='function'){
window.renderModal=function(){
var bg=document.querySelector('.modal-bg');
var sd=bg&&bg.querySelector('.side');
var a=bg?bg.scrollTop:0,b=sd?sd.scrollTop:0;
baseModal.apply(this,arguments);
bg=document.querySelector('.modal-bg');
if(bg){
bg.scrollTop=a;
sd=bg.querySelector('.side');
if(sd)sd.scrollTop=b;
}
};
}
if(restoreFicha())window.render();
}

var touch=matchMedia('(pointer:coarse)').matches||('ontouchstart' in window);
if(!touch)return;

var KEYS={
up:{key:'ArrowUp',code:'ArrowUp',kc:38,label:'▲'},
left:{key:'ArrowLeft',code:'ArrowLeft',kc:37,label:'◀'},
down:{key:'ArrowDown',code:'ArrowDown',kc:40,label:'▼'},
right:{key:'ArrowRight',code:'ArrowRight',kc:39,label:'▶'}
};
var POS={up:'1/2',left:'2/1',down:'3/2',right:'2/3'};

function fire(type,k,rep){
var t=document.getElementById('mp-cv')||document.body;
var e=new KeyboardEvent(type,{key:k.key,code:k.code,bubbles:true,cancelable:true,repeat:!!rep});
try{
Object.defineProperty(e,'keyCode',{get:function(){return k.kc}});
Object.defineProperty(e,'which',{get:function(){return k.kc}});
}catch(_){}
t.dispatchEvent(e);
}

var pad=document.createElement('div');
pad.id='mb-pad';
Object.keys(KEYS).forEach(function(name){
var k=KEYS[name],b=document.createElement('button'),timer=null,down=false;
b.type='button';
b.textContent=k.label;
var pos=POS[name].split('/');
b.style.gridRow=pos[0];
b.style.gridColumn=pos[1];
function stop(){
if(!down)return;
down=false;
b.classList.remove('on');
clearInterval(timer);
fire('keyup',k);
}
b.addEventListener('pointerdown',function(e){
e.preventDefault();
if(down)return;
down=true;
b.classList.add('on');
try{b.setPointerCapture(e.pointerId)}catch(_){}
fire('keydown',k,false);
timer=setInterval(function(){fire('keydown',k,true)},70);
});
b.addEventListener('pointerup',stop);
b.addEventListener('pointercancel',stop);
b.addEventListener('lostpointercapture',stop);
b.addEventListener('contextmenu',function(e){e.preventDefault()});
pad.appendChild(b);
});
document.body.appendChild(pad);

var tog=document.createElement('button');
tog.id='mb-tog';
tog.type='button';
tog.textContent='🎮';
tog.setAttribute('aria-label','Mostrar ou esconder o direcional');
var padOn=true;
tog.addEventListener('click',function(){padOn=!padOn;sync()});
document.body.appendChild(tog);

var app=document.getElementById('app');
function sync(){
var maps=!!app&&app.className.indexOf('view-maps')>-1;
pad.style.display=maps&&padOn?'grid':'none';
tog.style.display=maps?'block':'none';
tog.style.opacity=padOn?'1':'.6';
}
if(app)new MutationObserver(sync).observe(app,{attributes:true,attributeFilter:['class']});
sync();

var pts={},lastDist=0,pinching=false;
function canvasOf(e){var t=e.target;return t&&t.id==='mp-cv'?t:null}
function dist(){var k=Object.keys(pts);if(k.length<2)return 0;var a=pts[k[0]],b=pts[k[1]];return Math.hypot(a.x-b.x,a.y-b.y)}
function mid(){var k=Object.keys(pts),a=pts[k[0]],b=pts[k[1]];return{x:(a.x+b.x)/2,y:(a.y+b.y)/2}}
document.addEventListener('pointerdown',function(e){
var cv=canvasOf(e);
if(!cv||e.pointerType==='mouse')return;
pts[e.pointerId]={x:e.clientX,y:e.clientY};
if(Object.keys(pts).length===2){
pinching=true;
lastDist=dist();
Object.keys(pts).forEach(function(id){
try{cv.dispatchEvent(new PointerEvent('pointercancel',{pointerId:+id,pointerType:'touch',bubbles:true}))}catch(_){}
});
e.stopImmediatePropagation();
e.preventDefault();
}
},true);
document.addEventListener('pointermove',function(e){
if(!pts[e.pointerId])return;
pts[e.pointerId]={x:e.clientX,y:e.clientY};
if(!pinching)return;
e.stopImmediatePropagation();
e.preventDefault();
var cv=document.getElementById('mp-cv');
if(!cv)return;
var d=dist();
if(!lastDist||Math.abs(d-lastDist)<2)return;
var m=mid();
cv.dispatchEvent(new WheelEvent('wheel',{deltaY:-(d-lastDist)*4,deltaMode:0,clientX:m.x,clientY:m.y,bubbles:true,cancelable:true}));
lastDist=d;
},true);
function up(e){
if(!pts[e.pointerId])return;
delete pts[e.pointerId];
if(pinching){
e.stopImmediatePropagation();
if(Object.keys(pts).length<2){pinching=false;lastDist=0}
if(!Object.keys(pts).length)pts={};
}
}
document.addEventListener('pointerup',up,true);
document.addEventListener('pointercancel',up,true);
})();
