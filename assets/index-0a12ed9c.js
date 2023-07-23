var hl=Object.defineProperty;var pl=(e,t,l)=>t in e?hl(e,t,{enumerable:!0,configurable:!0,writable:!0,value:l}):e[t]=l;var Ze=(e,t,l)=>(pl(e,typeof t!="symbol"?t+"":t,l),l);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const h of r.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&n(h)}).observe(document,{childList:!0,subtree:!0});function l(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=l(s);fetch(s.href,r)}})();function F(){}const Ye=e=>e;function Wt(e){return e()}function mt(){return Object.create(null)}function x(e){e.forEach(Wt)}function De(e){return typeof e=="function"}function xe(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function gl(e){return Object.keys(e).length===0}const Yt=typeof window<"u";let xt=Yt?()=>window.performance.now():()=>Date.now(),et=Yt?e=>requestAnimationFrame(e):F;const pe=new Set;function el(e){pe.forEach(t=>{t.c(e)||(pe.delete(t),t.f())}),pe.size!==0&&et(el)}function tl(e){let t;return pe.size===0&&et(el),{promise:new Promise(l=>{pe.add(t={c:e,f:l})}),abort(){pe.delete(t)}}}function _(e,t){e.appendChild(t)}function ll(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function ml(e){const t=y("style");return t.textContent="/* empty */",bl(ll(e),t),t.sheet}function bl(e,t){return _(e.head||e,t),t.sheet}function I(e,t,l){e.insertBefore(t,l||null)}function L(e){e.parentNode&&e.parentNode.removeChild(e)}function H(e,t){for(let l=0;l<e.length;l+=1)e[l]&&e[l].d(t)}function y(e){return document.createElement(e)}function Ee(e){return document.createTextNode(e)}function S(){return Ee(" ")}function nl(){return Ee("")}function te(e,t,l,n){return e.addEventListener(t,l,n),()=>e.removeEventListener(t,l,n)}function o(e,t,l){l==null?e.removeAttribute(t):e.getAttribute(t)!==l&&e.setAttribute(t,l)}function G(e){return e===""?null:+e}function vl(e){return Array.from(e.childNodes)}function tt(e,t){t=""+t,e.data!==t&&(e.data=t)}function J(e,t){e.value=t??""}function _e(e,t,l,n){l==null?e.style.removeProperty(t):e.style.setProperty(t,l,n?"important":"")}function bt(e,t,l){e.classList.toggle(t,!!l)}function kl(e,t,{bubbles:l=!1,cancelable:n=!1}={}){return new CustomEvent(e,{detail:t,bubbles:l,cancelable:n})}const Me=new Map;let Te=0;function zl(e){let t=5381,l=e.length;for(;l--;)t=(t<<5)-t^e.charCodeAt(l);return t>>>0}function wl(e,t){const l={stylesheet:ml(t),rules:{}};return Me.set(e,l),l}function sl(e,t,l,n,s,r,h,a=0){const p=16.666/n;let i=`{
`;for(let z=0;z<=1;z+=p){const k=t+(l-t)*r(z);i+=z*100+`%{${h(k,1-k)}}
`}const d=i+`100% {${h(l,1-l)}}
}`,f=`__svelte_${zl(d)}_${a}`,E=ll(e),{stylesheet:m,rules:g}=Me.get(E)||wl(E,e);g[f]||(g[f]=!0,m.insertRule(`@keyframes ${f} ${d}`,m.cssRules.length));const A=e.style.animation||"";return e.style.animation=`${A?`${A}, `:""}${f} ${n}ms linear ${s}ms 1 both`,Te+=1,f}function Ge(e,t){const l=(e.style.animation||"").split(", "),n=l.filter(t?r=>r.indexOf(t)<0:r=>r.indexOf("__svelte")===-1),s=l.length-n.length;s&&(e.style.animation=n.join(", "),Te-=s,Te||yl())}function yl(){et(()=>{Te||(Me.forEach(e=>{const{ownerNode:t}=e.stylesheet;t&&L(t)}),Me.clear())})}let $e;function ye(e){$e=e}function rl(){if(!$e)throw new Error("Function called outside component initialization");return $e}function $l(e){rl().$$.on_mount.push(e)}function El(e){rl().$$.after_update.push(e)}const de=[],vt=[];let ge=[];const kt=[],Al=Promise.resolve();let Je=!1;function Cl(){Je||(Je=!0,Al.then(il))}function le(e){ge.push(e)}const Ue=new Set;let ae=0;function il(){if(ae!==0)return;const e=$e;do{try{for(;ae<de.length;){const t=de[ae];ae++,ye(t),Sl(t.$$)}}catch(t){throw de.length=0,ae=0,t}for(ye(null),de.length=0,ae=0;vt.length;)vt.pop()();for(let t=0;t<ge.length;t+=1){const l=ge[t];Ue.has(l)||(Ue.add(l),l())}ge.length=0}while(de.length);for(;kt.length;)kt.pop()();Je=!1,Ue.clear(),ye(e)}function Sl(e){if(e.fragment!==null){e.update(),x(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(le)}}function Ol(e){const t=[],l=[];ge.forEach(n=>e.indexOf(n)===-1?t.push(n):l.push(n)),l.forEach(n=>n()),ge=t}let ze;function ol(){return ze||(ze=Promise.resolve(),ze.then(()=>{ze=null})),ze}function Ve(e,t,l){e.dispatchEvent(kl(`${t?"intro":"outro"}${l}`))}const Pe=new Set;let Y;function fl(){Y={r:0,c:[],p:Y}}function cl(){Y.r||x(Y.c),Y=Y.p}function W(e,t){e&&e.i&&(Pe.delete(e),e.i(t))}function he(e,t,l,n){if(e&&e.o){if(Pe.has(e))return;Pe.add(e),Y.c.push(()=>{Pe.delete(e),n&&(l&&e.d(1),n())}),e.o(t)}else n&&n()}const ul={duration:0};function al(e,t,l){const n={direction:"in"};let s=t(e,l,n),r=!1,h,a,p=0;function i(){h&&Ge(e,h)}function d(){const{delay:E=0,duration:m=300,easing:g=Ye,tick:A=F,css:z}=s||ul;z&&(h=sl(e,0,1,m,E,g,z,p++)),A(0,1);const k=xt()+E,$=k+m;a&&a.abort(),r=!0,le(()=>Ve(e,!0,"start")),a=tl(O=>{if(r){if(O>=$)return A(1,0),Ve(e,!0,"end"),i(),r=!1;if(O>=k){const v=g((O-k)/m);A(v,1-v)}}return r})}let f=!1;return{start(){f||(f=!0,Ge(e),De(s)?(s=s(n),ol().then(d)):d())},invalidate(){f=!1},end(){r&&(i(),r=!1)}}}function dl(e,t,l){const n={direction:"out"};let s=t(e,l,n),r=!0,h;const a=Y;a.r+=1;let p;function i(){const{delay:d=0,duration:f=300,easing:E=Ye,tick:m=F,css:g}=s||ul;g&&(h=sl(e,1,0,f,d,E,g));const A=xt()+d,z=A+f;le(()=>Ve(e,!1,"start")),"inert"in e&&(p=e.inert,e.inert=!0),tl(k=>{if(r){if(k>=z)return m(0,1),Ve(e,!1,"end"),--a.r||x(a.c),!1;if(k>=A){const $=E((k-A)/f);m(1-$,$)}}return r})}return De(s)?ol().then(()=>{s=s(n),i()}):i(),{end(d){d&&"inert"in e&&(e.inert=p),d&&s.tick&&s.tick(1,0),r&&(h&&Ge(e,h),r=!1)}}}function q(e){return(e==null?void 0:e.length)!==void 0?e:Array.from(e)}function zt(e){e&&e.c()}function Qe(e,t,l){const{fragment:n,after_update:s}=e.$$;n&&n.m(t,l),le(()=>{const r=e.$$.on_mount.map(Wt).filter(De);e.$$.on_destroy?e.$$.on_destroy.push(...r):x(r),e.$$.on_mount=[]}),s.forEach(le)}function We(e,t){const l=e.$$;l.fragment!==null&&(Ol(l.after_update),x(l.on_destroy),l.fragment&&l.fragment.d(t),l.on_destroy=l.fragment=null,l.ctx=[])}function jl(e,t){e.$$.dirty[0]===-1&&(de.push(e),Cl(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function lt(e,t,l,n,s,r,h,a=[-1]){const p=$e;ye(e);const i=e.$$={fragment:null,ctx:[],props:r,update:F,not_equal:s,bound:mt(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(p?p.$$.context:[])),callbacks:mt(),dirty:a,skip_bound:!1,root:t.target||p.$$.root};h&&h(i.root);let d=!1;if(i.ctx=l?l(e,t.props||{},(f,E,...m)=>{const g=m.length?m[0]:E;return i.ctx&&s(i.ctx[f],i.ctx[f]=g)&&(!i.skip_bound&&i.bound[f]&&i.bound[f](g),d&&jl(e,f)),E}):[],i.update(),d=!0,x(i.before_update),i.fragment=n?n(i.ctx):!1,t.target){if(t.hydrate){const f=vl(t.target);i.fragment&&i.fragment.l(f),f.forEach(L)}else i.fragment&&i.fragment.c();t.intro&&W(e.$$.fragment),Qe(e,t.target,t.anchor),il()}ye(p)}class nt{constructor(){Ze(this,"$$");Ze(this,"$$set")}$destroy(){We(this,1),this.$destroy=F}$on(t,l){if(!De(l))return F;const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(l),()=>{const s=n.indexOf(l);s!==-1&&n.splice(s,1)}}$set(t){this.$$set&&!gl(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const ql="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(ql);function Nl(e){let t;return{c(){t=y("div"),t.innerHTML='<div class="left svelte-pbe0zq"><b class="svelte-pbe0zq">LPSolver</b></div> <div class="middle svelte-pbe0zq"><div class="menu svelte-pbe0zq"><li class="svelte-pbe0zq">About</li> <li class="svelte-pbe0zq">Source Code <i class="fa-brands fa-github"></i></li></div></div> <div class="right svelte-pbe0zq"><div class="profile"><img src=""/> <span></span></div></div>',o(t,"class","navbar svelte-pbe0zq")},m(l,n){I(l,t,n)},p:F,i:F,o:F,d(l){l&&L(t)}}}class Ll extends nt{constructor(t){super(),lt(this,t,null,Nl,xe,{})}}function Il(e){let t;return{c(){t=y("div"),t.innerHTML='<h1 class="svelte-1xidzia">Linear Programming Solver</h1> <h2 class="svelte-1xidzia">By Ari Susanto</h2>',o(t,"class","header svelte-1xidzia")},m(l,n){I(l,t,n)},p:F,i:F,o:F,d(l){l&&L(t)}}}class Pl extends nt{constructor(t){super(),lt(this,t,null,Il,xe,{})}}function Be(e,{delay:t=0,duration:l=400,easing:n=Ye}={}){const s=+getComputedStyle(e).opacity;return{delay:t,duration:l,easing:n,css:r=>`opacity: ${r*s}`}}function Ie(e=[],t=[]){let l="",n=0;for(let s of e){let r="",h=0;for(let a of s)r+=` ${a}x_${h} ${h!==s.length?"+":""}`,h++;l+=r+` \\le ${t[n]} 
`,n++}return l}function Re(e=[]){let t=" Z =";for(let l of e){let n=1;for(let s of l)t+=` ${s}x_${n} ${n!==l.length?"+":""}`,n++}return t}function Ml(e=[],t=[]){const l=[];for(let n=0;n<t[0];n++)l.push(-e[n]);for(let n=0;n<t[1];n++)l.push(0);return{result:l}}function we(e=[[]],t=[]){const l=[],n=[];let s=0;for(let h of e){const a=[];a.push(...h,...e.map((p,i)=>i===s?1:0),t[s]),n.push([...h.map((p,i)=>`${p}x_${i}`),...e.map((p,i)=>i===s?1:0).map((p,i)=>`${p}s_${i}`),t[s]]),l.push(a),s++}const r=[e[0].length,e.length];return{raw_result:l,shape:r,result:n,constrait_value:t,debug(h){const a={};n[0].forEach((i,d)=>{typeof i=="string"&&(a[i.replace(/^\d/igm,"")]=h.result[d])});const p={Z:{...a,nk:0}};l.forEach((i,d)=>{const f={};n[0].forEach((E,m)=>{typeof E=="string"&&(f[E.replace(/^\d/igm,"")]=i[m])}),f.nk=i[i.length-1],p[`s_${d}`]=f}),console.table(p)}}}function _l(e,t,l,n){var g,A,z,k,$,O;const{raw_result:s}=e,{result:r}=t;if([...r].sort((v,C)=>v-C)[0]>=0)return;let[[a,p]]=r.map((v,C)=>[C,v]).sort(([v,C],[b,w])=>C-w);const i=[r[a]];for(let v of s)i.push(v[a]);r[s[0].length-1]===void 0?s.unshift([...r,0]):s.unshift(r);const d=[];i.forEach((v,C)=>{d.push(s[C][s[C].length-1]/v)});let[[f,E]]=d.slice(1,d.length).map((v,C)=>[C,v]).sort(([v,C],[b,w])=>C-w),m=s[f+1][a];return(A=(g=n==null?void 0:n.wayback)==null?void 0:g.push)==null||A.call(g,s.map(v=>[...v])),(k=(z=n==null?void 0:n.rows)==null?void 0:z.push)==null||k.call(z,f+1),(O=($=n==null?void 0:n.column)==null?void 0:$.push)==null||O.call($,a),l&&console.table(s),s[f+1].forEach((v,C)=>{s[f+1][C]=v/m}),s.forEach((v,C)=>{C!==f+1&&v.forEach((b,w)=>{s[C][w]=b-s[f+1][w]*i[C]})}),l&&console.table(s),_l({raw_result:s.slice(1,s.length)},{result:s.slice(0,1)[0]},l,n),{results:s}}function wt(e,t,l){const n=e.slice();return n[22]=t[l],n[24]=l,n}function yt(e,t,l){const n=e.slice();return n[25]=t[l],n[27]=l,n}function $t(e,t,l){const n=e.slice();return n[22]=t[l],n[24]=l,n}function Et(e,t,l){const n=e.slice();return n[29]=t[l],n[31]=l,n}function At(e,t,l){const n=e.slice();return n[22]=t[l],n[24]=l,n}function Ct(e,t,l){const n=e.slice();return n[25]=t[l],n[27]=l,n}function St(e,t,l){const n=e.slice();return n[22]=t[l],n[24]=l,n}function Ot(e,t,l){const n=e.slice();return n[22]=t[l],n[24]=l,n}function jt(e,t,l){const n=e.slice();return n[36]=t[l],n[37]=t,n[38]=l,n}function qt(e,t,l){const n=e.slice();return n[39]=t[l],n[40]=t,n[41]=l,n}function Nt(e,t,l){const n=e.slice();return n[36]=t[l],n[42]=t,n[43]=l,n}function Lt(e,t,l){const n=e.slice();return n[39]=t[l],n}function It(e,t,l){const n=e.slice();return n[46]=t[l],n[47]=t,n[48]=l,n}function Pt(e){let t,l,n;function s(){e[17].call(t,e[48])}return{c(){t=y("input"),o(t,"placeholder","X"+e[48]),o(t,"type","number"),o(t,"class","svelte-b4zsdk")},m(r,h){I(r,t,h),J(t,e[9][0][e[48]]),l||(n=[te(t,"input",s),te(t,"input",Vl)],l=!0)},p(r,h){e=r,h[0]&512&&G(t.value)!==e[9][0][e[48]]&&J(t,e[9][0][e[48]])},d(r){r&&L(t),l=!1,x(n)}}}function Mt(e){let t,l;return{c(){t=y("th"),o(t,"dp",l="C_"+e[39]),o(t,"class","svelte-b4zsdk")},m(n,s){I(n,t,s)},p(n,s){s[0]&4&&l!==(l="C_"+n[39])&&o(t,"dp",l)},d(n){n&&L(t)}}}function Tt(e){let t,l,n,s,r;function h(){e[18].call(l,e[43],e[41])}return{c(){t=y("td"),l=y("input"),o(l,"placeholder",n="...Insert total C"+e[36]+" in X"+e[39]),o(l,"type","number"),o(l,"name",""),o(l,"class","svelte-b4zsdk"),o(t,"class","svelte-b4zsdk")},m(a,p){I(a,t,p),_(t,l),J(l,e[3][e[43]][e[41]]),s||(r=te(l,"input",h),s=!0)},p(a,p){e=a,p[0]&6&&n!==(n="...Insert total C"+e[36]+" in X"+e[39])&&o(l,"placeholder",n),p[0]&8&&G(l.value)!==e[3][e[43]][e[41]]&&J(l,e[3][e[43]][e[41]])},d(a){a&&L(t),s=!1,r()}}}function Vt(e){let t,l,n,s,r=q(e[2]),h=[];for(let a=0;a<r.length;a+=1)h[a]=Tt(Nt(e,r,a));return{c(){t=y("tr"),l=y("td"),s=S();for(let a=0;a<h.length;a+=1)h[a].c();o(l,"dp",n="x_"+e[39]),o(l,"class","svelte-b4zsdk")},m(a,p){I(a,t,p),_(t,l),_(t,s);for(let i=0;i<h.length;i+=1)h[i]&&h[i].m(t,null)},p(a,p){if(p[0]&2&&n!==(n="x_"+a[39])&&o(l,"dp",n),p[0]&14){r=q(a[2]);let i;for(i=0;i<r.length;i+=1){const d=Nt(a,r,i);h[i]?h[i].p(d,p):(h[i]=Tt(d),h[i].c(),h[i].m(t,null))}for(;i<h.length;i+=1)h[i].d(1);h.length=r.length}},d(a){a&&L(t),H(h,a)}}}function Bt(e){let t,l,n,s,r;function h(){e[19].call(l,e[38])}return{c(){t=y("td"),l=y("input"),n=S(),o(l,"placeholder","...Insert source limit"),o(l,"type","number"),o(l,"name",""),o(l,"class","svelte-b4zsdk"),o(t,"class","svelte-b4zsdk")},m(a,p){I(a,t,p),_(t,l),J(l,e[4][e[38]]),_(t,n),s||(r=te(l,"input",h),s=!0)},p(a,p){e=a,p[0]&16&&G(l.value)!==e[4][e[38]]&&J(l,e[4][e[38]])},d(a){a&&L(t),s=!1,r()}}}function Rt(e){let t,l,n,s,r,h,a,p,i;return{c(){t=y("tr"),l=y("td"),l.textContent=`${e[24]+1}`,n=S(),s=y("td"),h=S(),a=y("td"),i=S(),_e(l,"background","transparent"),_e(l,"color","#009688"),o(l,"class","svelte-b4zsdk"),o(s,"dp",r=e[22]),o(s,"class","svelte-b4zsdk"),o(a,"dp",p=we(e[3],e[4]).result[e[24]].slice(0,we(e[3],e[4]).result[e[24]].length-1).join("+")+`= ${e[4][e[24]]}`),o(a,"class","svelte-b4zsdk")},m(d,f){I(d,t,f),_(t,l),_(t,n),_(t,s),_(t,h),_(t,a),_(t,i)},p(d,f){f[0]&24&&r!==(r=d[22])&&o(s,"dp",r),f[0]&24&&p!==(p=we(d[3],d[4]).result[d[24]].slice(0,we(d[3],d[4]).result[d[24]].length-1).join("+")+`= ${d[4][d[24]]}`)&&o(a,"dp",p)},d(d){d&&L(t)}}}function Dt(e){let t,l,n,s,r,h,a,p,i,d,f,E,m=q(e[14].wayback),g=[];for(let v=0;v<m.length;v+=1)g[v]=Zt(Et(e,m,v));const A=v=>he(g[v],1,1,()=>{g[v]=null});let z=q(e[12](e[9],e[3]).replace(/(\+|-|=|\d$)/igm,"~").split("~")),k=[];for(let v=0;v<z.length;v+=1)k[v]=Gt($t(e,z,v));let $=q(e[10]),O=[];for(let v=0;v<$.length;v+=1)O[v]=Qt(wt(e,$,v));return{c(){for(let v=0;v<g.length;v+=1)g[v].c();t=S(),l=y("div"),n=y("table"),s=y("tr"),r=y("th"),r.textContent="Variabel",h=S();for(let v=0;v<k.length;v+=1)k[v].c();a=S(),p=y("th"),i=S();for(let v=0;v<O.length;v+=1)O[v].c();o(r,"class","svelte-b4zsdk"),o(p,"dp","NK"),o(p,"class","svelte-b4zsdk"),o(n,"class","op svelte-b4zsdk"),o(l,"class","table svelte-b4zsdk")},m(v,C){for(let b=0;b<g.length;b+=1)g[b]&&g[b].m(v,C);I(v,t,C),I(v,l,C),_(l,n),_(n,s),_(s,r),_(s,h);for(let b=0;b<k.length;b+=1)k[b]&&k[b].m(s,null);_(s,a),_(s,p),_(n,i);for(let b=0;b<O.length;b+=1)O[b]&&O[b].m(n,null);E=!0},p(v,C){if(e=v,C[0]&22024){m=q(e[14].wayback);let b;for(b=0;b<m.length;b+=1){const w=Et(e,m,b);g[b]?(g[b].p(w,C),W(g[b],1)):(g[b]=Zt(w),g[b].c(),W(g[b],1),g[b].m(t.parentNode,t))}for(fl(),b=m.length;b<g.length;b+=1)A(b);cl()}if(C[0]&4616){z=q(e[12](e[9],e[3]).replace(/(\+|-|=|\d$)/igm,"~").split("~"));let b;for(b=0;b<z.length;b+=1){const w=$t(e,z,b);k[b]?k[b].p(w,C):(k[b]=Gt(w),k[b].c(),k[b].m(s,a))}for(;b<k.length;b+=1)k[b].d(1);k.length=z.length}if(C[0]&3072){$=q(e[10]);let b;for(b=0;b<$.length;b+=1){const w=wt(e,$,b);O[b]?O[b].p(w,C):(O[b]=Qt(w),O[b].c(),O[b].m(n,null))}for(;b<O.length;b+=1)O[b].d(1);O.length=$.length}},i(v){if(!E){for(let C=0;C<m.length;C+=1)W(g[C]);v&&le(()=>{E&&(f&&f.end(1),d=al(l,Be,{duration:1e3,delay:e[14].wayback.length*1e3}),d.start())}),E=!0}},o(v){g=g.filter(Boolean);for(let C=0;C<g.length;C+=1)he(g[C]);d&&d.invalidate(),v&&(f=dl(l,Be,{})),E=!1},d(v){v&&(L(t),L(l)),H(g,v),H(k,v),H(O,v),v&&f&&f.end()}}}function Ht(e){let t,l;return{c(){t=y("th"),o(t,"dp",l=e[22].replace(/\d*x_/igm,"x_").replace(/\d*s_/igm,"s_")),o(t,"class","svelte-b4zsdk")},m(n,s){I(n,t,s)},p(n,s){s[0]&520&&l!==(l=n[22].replace(/\d*x_/igm,"x_").replace(/\d*s_/igm,"s_"))&&o(t,"dp",l)},d(n){n&&L(t)}}}function Ft(e){let t=e[24]!==0&&e[24]<e[12](e[9],e[3]).replace(/(\+|-|=|\d$)/igm,"~").split("~").length-2,l,n=t&&Ht(e);return{c(){n&&n.c(),l=nl()},m(s,r){n&&n.m(s,r),I(s,l,r)},p(s,r){r[0]&520&&(t=s[24]!==0&&s[24]<s[12](s[9],s[3]).replace(/(\+|-|=|\d$)/igm,"~").split("~").length-2),t?n?n.p(s,r):(n=Ht(s),n.c(),n.m(l.parentNode,l)):n&&(n.d(1),n=null)},d(s){s&&L(l),n&&n.d(s)}}}function Kt(e){let t;return{c(){t=y("td"),t.textContent=`${e[25]}`,o(t,"class","svelte-b4zsdk"),bt(t,"key",e[14].rows[e[31]]===e[24]&&e[14].column[e[31]]===e[27]),bt(t,"selected",e[14].rows[e[31]]===e[24]||e[14].column[e[31]]===e[27])},m(l,n){I(l,t,n)},p:F,d(l){l&&L(t)}}}function Xt(e){var i;let t,l,n=e[22]+"",s,r,h,a=q(((i=e[14].wayback[e[31]])==null?void 0:i[e[24]])||[]),p=[];for(let d=0;d<a.length;d+=1)p[d]=Kt(Ct(e,a,d));return{c(){t=y("tr"),l=y("td"),s=Ee(n),h=S();for(let d=0;d<p.length;d+=1)p[d].c();o(l,"dp",r=e[22]),o(l,"class","svelte-b4zsdk")},m(d,f){I(d,t,f),_(t,l),_(l,s),_(t,h);for(let E=0;E<p.length;E+=1)p[E]&&p[E].m(t,null)},p(d,f){var E;if(f[0]&1024&&n!==(n=d[22]+"")&&tt(s,n),f[0]&1024&&r!==(r=d[22])&&o(l,"dp",r),f[0]&16384){a=q(((E=d[14].wayback[d[31]])==null?void 0:E[d[24]])||[]);let m;for(m=0;m<a.length;m+=1){const g=Ct(d,a,m);p[m]?p[m].p(g,f):(p[m]=Kt(g),p[m].c(),p[m].m(t,null))}for(;m<p.length;m+=1)p[m].d(1);p.length=a.length}},d(d){d&&L(t),H(p,d)}}}function Zt(e){let t,l,n,s,r,h,a,p,i,d,f,E=q(e[12](e[9],e[3]).replace(/(\+|-|=|\d$)/igm,"~").split("~")),m=[];for(let z=0;z<E.length;z+=1)m[z]=Ft(St(e,E,z));let g=q(e[10]),A=[];for(let z=0;z<g.length;z+=1)A[z]=Xt(At(e,g,z));return{c(){t=y("div"),l=y("table"),n=y("tr"),s=y("th"),s.textContent="Variabel",r=S();for(let z=0;z<m.length;z+=1)m[z].c();h=S(),a=y("th"),p=S();for(let z=0;z<A.length;z+=1)A[z].c();o(s,"class","svelte-b4zsdk"),o(a,"dp","NK"),o(a,"class","svelte-b4zsdk"),o(l,"class","op svelte-b4zsdk"),o(t,"class","table svelte-b4zsdk")},m(z,k){I(z,t,k),_(t,l),_(l,n),_(n,s),_(n,r);for(let $=0;$<m.length;$+=1)m[$]&&m[$].m(n,null);_(n,h),_(n,a),_(l,p);for(let $=0;$<A.length;$+=1)A[$]&&A[$].m(l,null);f=!0},p(z,k){if(k[0]&4616){E=q(z[12](z[9],z[3]).replace(/(\+|-|=|\d$)/igm,"~").split("~"));let $;for($=0;$<E.length;$+=1){const O=St(z,E,$);m[$]?m[$].p(O,k):(m[$]=Ft(O),m[$].c(),m[$].m(n,h))}for(;$<m.length;$+=1)m[$].d(1);m.length=E.length}if(k[0]&17408){g=q(z[10]);let $;for($=0;$<g.length;$+=1){const O=At(z,g,$);A[$]?A[$].p(O,k):(A[$]=Xt(O),A[$].c(),A[$].m(l,null))}for(;$<A.length;$+=1)A[$].d(1);A.length=g.length}},i(z){f||(z&&le(()=>{f&&(d&&d.end(1),i=al(t,Be,{duration:1e3,delay:1e3*e[31]}),i.start())}),f=!0)},o(z){i&&i.invalidate(),z&&(d=dl(t,Be,{})),f=!1},d(z){z&&L(t),H(m,z),H(A,z),z&&d&&d.end()}}}function Ut(e){let t,l;return{c(){t=y("th"),o(t,"dp",l=e[22].replace(/\d*x_/igm,"x_").replace(/\d*s_/igm,"s_")),o(t,"class","svelte-b4zsdk")},m(n,s){I(n,t,s)},p(n,s){s[0]&520&&l!==(l=n[22].replace(/\d*x_/igm,"x_").replace(/\d*s_/igm,"s_"))&&o(t,"dp",l)},d(n){n&&L(t)}}}function Gt(e){let t=e[24]!==0&&e[24]<e[12](e[9],e[3]).replace(/(\+|-|=|\d$)/igm,"~").split("~").length-2,l,n=t&&Ut(e);return{c(){n&&n.c(),l=nl()},m(s,r){n&&n.m(s,r),I(s,l,r)},p(s,r){r[0]&520&&(t=s[24]!==0&&s[24]<s[12](s[9],s[3]).replace(/(\+|-|=|\d$)/igm,"~").split("~").length-2),t?n?n.p(s,r):(n=Ut(s),n.c(),n.m(l.parentNode,l)):n&&(n.d(1),n=null)},d(s){s&&L(l),n&&n.d(s)}}}function Jt(e){let t,l=e[25]+"",n;return{c(){t=y("td"),n=Ee(l),o(t,"class","svelte-b4zsdk")},m(s,r){I(s,t,r),_(t,n)},p(s,r){r[0]&2048&&l!==(l=s[25]+"")&&tt(n,l)},d(s){s&&L(t)}}}function Qt(e){var d;let t,l,n=e[22]+"",s,r,h,a,p=q(((d=e[11])==null?void 0:d[e[24]])||[]),i=[];for(let f=0;f<p.length;f+=1)i[f]=Jt(yt(e,p,f));return{c(){t=y("tr"),l=y("td"),s=Ee(n),h=S();for(let f=0;f<i.length;f+=1)i[f].c();a=S(),o(l,"dp",r=e[22]),o(l,"class","svelte-b4zsdk")},m(f,E){I(f,t,E),_(t,l),_(l,s),_(t,h);for(let m=0;m<i.length;m+=1)i[m]&&i[m].m(t,null);_(t,a)},p(f,E){var m;if(E[0]&1024&&n!==(n=f[22]+"")&&tt(s,n),E[0]&1024&&r!==(r=f[22])&&o(l,"dp",r),E[0]&2048){p=q(((m=f[11])==null?void 0:m[f[24]])||[]);let g;for(g=0;g<p.length;g+=1){const A=yt(f,p,g);i[g]?i[g].p(A,E):(i[g]=Jt(A),i[g].c(),i[g].m(t,a))}for(;g<i.length;g+=1)i[g].d(1);i.length=p.length}},d(f){f&&L(t),H(i,f)}}}function Tl(e){let t,l,n,s,r,h,a,p,i,d,f,E,m,g,A,z,k,$,O,v,C,b,w,K,j,X,Ae,Ce,st,me,Se,rt,Oe,Z,ne,je,it,ot,He,se,Fe,ft,ct,qe,U,Ke,ut,ee,re,at,be,Ne,dt,ve,Le,_t,ht,ke,pt,Q,Xe,gt;t=new Ll({}),n=new Pl({});let ie=q(e[0]),M=[];for(let c=0;c<ie.length;c+=1)M[c]=Pt(It(e,ie,c));let oe=q(e[2]),T=[];for(let c=0;c<oe.length;c+=1)T[c]=Mt(Lt(e,oe,c));let fe=q(e[1]),V=[];for(let c=0;c<fe.length;c+=1)V[c]=Vt(qt(e,fe,c));let ce=q(e[2]),B=[];for(let c=0;c<ce.length;c+=1)B[c]=Bt(jt(e,ce,c));let ue=q(Ie(e[3],e[4]).split(`
`).slice(0,Ie(e[3],e[4]).split(`
`).length-1)),R=[];for(let c=0;c<ue.length;c+=1)R[c]=Rt(Ot(e,ue,c));let P=e[11].length>0&&Dt(e);return{c(){zt(t.$$.fragment),l=S(),zt(n.$$.fragment),s=S(),r=y("div"),h=y("fieldset"),a=y("legend"),a.textContent="Configuration",p=S(),i=y("div"),d=y("label"),d.textContent="Total Target",f=S(),E=y("span"),E.textContent="total of product will produce",m=S(),g=y("input"),z=S(),k=y("div"),$=y("label"),$.textContent="Total Input",O=S(),v=y("span"),v.textContent="total of material to produce each product",C=S(),b=y("input"),K=S(),j=y("div"),X=y("label"),X.textContent="Objective",Ae=S(),Ce=y("span"),Ce.textContent="Objective of production or coefficient",st=S(),me=y("div");for(let c=0;c<M.length;c+=1)M[c].c();rt=S(),Oe=y("div"),Z=y("table"),ne=y("tr"),je=y("th"),it=S();for(let c=0;c<T.length;c+=1)T[c].c();ot=S();for(let c=0;c<V.length;c+=1)V[c].c();He=S(),se=y("tr"),Fe=y("td"),ft=S();for(let c=0;c<B.length;c+=1)B[c].c();ct=S(),qe=y("div"),U=y("table"),Ke=y("tr"),Ke.innerHTML='<th class="svelte-b4zsdk">No</th> <th class="svelte-b4zsdk">Linear Equation</th> <th class="svelte-b4zsdk">Standard Simplex Equation</th>',ut=S(),ee=y("tr"),re=y("td"),re.textContent="0",at=S(),be=y("td"),dt=S(),ve=y("td"),_t=S();for(let c=0;c<R.length;c+=1)R[c].c();ht=S(),ke=y("button"),ke.textContent="Start Solving",pt=S(),P&&P.c(),o(a,"class","svelte-b4zsdk"),o(d,"for","tt"),o(d,"class","svelte-b4zsdk"),o(E,"class","svelte-b4zsdk"),o(g,"type","number"),o(g,"min","2"),o(g,"id","tt"),o(g,"placeholder","Dependen Variabel"),o(g,"class","svelte-b4zsdk"),o(i,"style",A=`--c1: ${e[6]}%;`),o(i,"class","input svelte-b4zsdk"),o($,"for","ti"),o($,"class","svelte-b4zsdk"),o(v,"class","svelte-b4zsdk"),o(b,"type","number"),o(b,"min","2"),o(b,"id","ti"),o(b,"placeholder","Independen Variabel"),o(b,"class","svelte-b4zsdk"),o(k,"style",w=`--c2: ${e[7]}%;`),o(k,"class","input svelte-b4zsdk"),_e(X,"width","100%"),_e(X,"text-align","left"),o(X,"class","svelte-b4zsdk"),o(Ce,"class","svelte-b4zsdk"),o(me,"class","custom-i svelte-b4zsdk"),o(j,"style",Se=`--c3: ${e[8]}%;`),o(j,"class","input svelte-b4zsdk"),o(h,"class","panel svelte-b4zsdk"),o(je,"dp","Variabel"),o(je,"class","svelte-b4zsdk"),o(Fe,"class","svelte-b4zsdk"),o(Z,"id","tb"),o(Z,"class","svelte-b4zsdk"),o(Oe,"class","table svelte-b4zsdk"),_e(re,"background","transparent"),_e(re,"color","#009688"),o(re,"class","svelte-b4zsdk"),o(be,"dp",Ne=Re(e[9])),o(be,"class","svelte-b4zsdk"),o(ve,"dp",Le=e[12](e[9],e[3])),o(ve,"class","svelte-b4zsdk"),o(U,"id","lf"),o(U,"class","svelte-b4zsdk"),o(qe,"class","table svelte-b4zsdk"),o(ke,"class","dbtn svelte-b4zsdk"),o(r,"class","main svelte-b4zsdk")},m(c,N){Qe(t,c,N),I(c,l,N),Qe(n,c,N),I(c,s,N),I(c,r,N),_(r,h),_(h,a),_(h,p),_(h,i),_(i,d),_(i,f),_(i,E),_(i,m),_(i,g),J(g,e[5].dependen),_(h,z),_(h,k),_(k,$),_(k,O),_(k,v),_(k,C),_(k,b),J(b,e[5].independen),_(h,K),_(h,j),_(j,X),_(j,Ae),_(j,Ce),_(j,st),_(j,me);for(let u=0;u<M.length;u+=1)M[u]&&M[u].m(me,null);_(r,rt),_(r,Oe),_(Oe,Z),_(Z,ne),_(ne,je),_(ne,it);for(let u=0;u<T.length;u+=1)T[u]&&T[u].m(ne,null);_(Z,ot);for(let u=0;u<V.length;u+=1)V[u]&&V[u].m(Z,null);_(Z,He),_(Z,se),_(se,Fe),_(se,ft);for(let u=0;u<B.length;u+=1)B[u]&&B[u].m(se,null);_(r,ct),_(r,qe),_(qe,U),_(U,Ke),_(U,ut),_(U,ee),_(ee,re),_(ee,at),_(ee,be),_(ee,dt),_(ee,ve),_(U,_t);for(let u=0;u<R.length;u+=1)R[u]&&R[u].m(U,null);_(r,ht),_(r,ke),_(r,pt),P&&P.m(r,null),Q=!0,Xe||(gt=[te(g,"input",e[15]),te(b,"input",e[16]),te(ke,"click",e[13])],Xe=!0)},p(c,N){if(N[0]&32&&G(g.value)!==c[5].dependen&&J(g,c[5].dependen),(!Q||N[0]&64&&A!==(A=`--c1: ${c[6]}%;`))&&o(i,"style",A),N[0]&32&&G(b.value)!==c[5].independen&&J(b,c[5].independen),(!Q||N[0]&128&&w!==(w=`--c2: ${c[7]}%;`))&&o(k,"style",w),N[0]&513){ie=q(c[0]);let u;for(u=0;u<ie.length;u+=1){const D=It(c,ie,u);M[u]?M[u].p(D,N):(M[u]=Pt(D),M[u].c(),M[u].m(me,null))}for(;u<M.length;u+=1)M[u].d(1);M.length=ie.length}if((!Q||N[0]&256&&Se!==(Se=`--c3: ${c[8]}%;`))&&o(j,"style",Se),N[0]&4){oe=q(c[2]);let u;for(u=0;u<oe.length;u+=1){const D=Lt(c,oe,u);T[u]?T[u].p(D,N):(T[u]=Mt(D),T[u].c(),T[u].m(ne,null))}for(;u<T.length;u+=1)T[u].d(1);T.length=oe.length}if(N[0]&14){fe=q(c[1]);let u;for(u=0;u<fe.length;u+=1){const D=qt(c,fe,u);V[u]?V[u].p(D,N):(V[u]=Vt(D),V[u].c(),V[u].m(Z,He))}for(;u<V.length;u+=1)V[u].d(1);V.length=fe.length}if(N[0]&20){ce=q(c[2]);let u;for(u=0;u<ce.length;u+=1){const D=jt(c,ce,u);B[u]?B[u].p(D,N):(B[u]=Bt(D),B[u].c(),B[u].m(se,null))}for(;u<B.length;u+=1)B[u].d(1);B.length=ce.length}if((!Q||N[0]&512&&Ne!==(Ne=Re(c[9])))&&o(be,"dp",Ne),(!Q||N[0]&520&&Le!==(Le=c[12](c[9],c[3])))&&o(ve,"dp",Le),N[0]&24){ue=q(Ie(c[3],c[4]).split(`
`).slice(0,Ie(c[3],c[4]).split(`
`).length-1));let u;for(u=0;u<ue.length;u+=1){const D=Ot(c,ue,u);R[u]?R[u].p(D,N):(R[u]=Rt(D),R[u].c(),R[u].m(U,null))}for(;u<R.length;u+=1)R[u].d(1);R.length=ue.length}c[11].length>0?P?(P.p(c,N),N[0]&2048&&W(P,1)):(P=Dt(c),P.c(),W(P,1),P.m(r,null)):P&&(fl(),he(P,1,1,()=>{P=null}),cl())},i(c){Q||(W(t.$$.fragment,c),W(n.$$.fragment,c),W(P),Q=!0)},o(c){he(t.$$.fragment,c),he(n.$$.fragment,c),he(P),Q=!1},d(c){c&&(L(l),L(s),L(r)),We(t,c),We(n,c),H(M,c),H(T,c),H(V,c),H(B,c),H(R,c),P&&P.d(),Xe=!1,x(gt)}}}const Vl=({target:e})=>{e.value.length===0?e.style.width=`${e.value.length+10}ch`:e.style.width=`${e.value.length+5}ch`};function Bl(e,t,l){function n(w,K){let j=" Z ";for(let X of Re(w).split(" ").slice(3,Re(w).split(" ").length-1))X!=="+"&&(j+=` - ${X}`);return K.forEach((X,Ae)=>j+=` - 0s_${Ae}`),j+=" = 0",j}function s(){var j;const w=we(f,m),K=Ml(E[0],w.shape);l(11,A=((j=_l(w,K,!1,z))==null?void 0:j.results)||[])}let r=30,h=30,a=33,p=[],i=[],d=[],f=[],E=[],m=[],g=[],A=[],z={wayback:[],rows:[],column:[]};const k={dependen:2,independen:3};$l(()=>{}),El(()=>{try{document.querySelectorAll(".op").forEach(K=>{K.querySelectorAll("th").forEach(j=>{j.hasAttribute("dp")&&katex.render(j.getAttribute("dp"),j,{throwOnError:!1})}),K.querySelectorAll("td").forEach(j=>{j.hasAttribute("dp")&&katex.render(j.getAttribute("dp"),j,{throwOnError:!1})})})}catch{}lf.querySelectorAll("td").forEach(w=>{w.hasAttribute("dp")&&katex.render(w.getAttribute("dp"),w,{throwOnError:!1})}),tb.querySelectorAll("th").forEach(w=>{katex.render(w.getAttribute("dp"),w,{throwOnError:!1})}),tb.querySelectorAll("td").forEach(w=>{w.hasAttribute("dp")&&katex.render(w.getAttribute("dp"),w,{throwOnError:!1})}),l(10,g=n(E,f).trim().replace(/(\+|-|=|\d$|\d.*x_\d*)/igm,"~").split("~").filter(w=>w.length>0&&w!==" ").map(w=>w.replace(/\d*s_/igm,"s_")))}),window.p=()=>{};function $(){k.dependen=G(this.value),l(5,k)}function O(){k.independen=G(this.value),l(5,k)}function v(w){E[0][w]=G(this.value),l(9,E),l(3,f),l(5,k),l(2,d),l(4,m)}function C(w,K){f[w][K]=G(this.value),l(3,f),l(5,k),l(2,d),l(4,m)}function b(w){m[w]=G(this.value),l(4,m),l(3,f),l(5,k),l(2,d)}return e.$$.update=()=>{e.$$.dirty[0]&32&&(w=>{k.dependen>4&&(l(6,r=50),l(7,h=50),l(8,a=100))})(),e.$$.dirty[0]&33&&(()=>{l(0,p=[]);for(let w=0;w<k.dependen;w++)l(0,p=[...p,w])})(),e.$$.dirty[0]&34&&(()=>{l(1,i=[]);for(let w=0;w<k.dependen;w++)l(1,i=[...i,w])})(),e.$$.dirty[0]&60&&(()=>{l(2,d=[]),(f.length!==parseInt(k.independen)||f[0].length!==parseInt(k.dependen))&&(l(9,E=[new Array(k.dependen).fill("")]),l(3,f=[]),l(4,m=[]));for(let w=0;w<k.independen;w++)l(2,d=[...d,w]),(f.length!==parseInt(k.independen)||f[0].length!==parseInt(k.dependen))&&(l(3,f=[...f,new Array(parseInt(k.dependen||0)).fill(0)]),l(4,m=[...m,0]))})()},[p,i,d,f,m,k,r,h,a,E,g,A,n,s,z,$,O,v,C,b]}class Rl extends nt{constructor(t){super(),lt(this,t,Bl,Tl,xe,{},null,[-1,-1])}}new Rl({target:document.getElementById("app")});
