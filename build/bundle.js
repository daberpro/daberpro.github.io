var app=function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function o(){return Object.create(null)}function s(t){t.forEach(n)}function r(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}const l="undefined"!=typeof window;let a=l?()=>window.performance.now():()=>Date.now(),c=l?t=>requestAnimationFrame(t):t;const u=new Set;function d(t){u.forEach((e=>{e.c(t)||(u.delete(e),e.f())})),0!==u.size&&c(d)}function f(t,e){t.appendChild(e)}function p(t,e,n){t.insertBefore(e,n||null)}function h(t){t.parentNode.removeChild(t)}function m(t){return document.createElement(t)}function g(t){return document.createTextNode(t)}function v(){return g(" ")}function b(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function $(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function w(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function x(t,e,n){t.classList[n?"add":"remove"](e)}const y=new Set;let _,k=0;function T(t,e,n,o,s,r,i,l=0){const a=16.666/o;let c="{\n";for(let t=0;t<=1;t+=a){const o=e+(n-e)*r(t);c+=100*t+`%{${i(o,1-o)}}\n`}const u=c+`100% {${i(n,1-n)}}\n}`,d=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(u)}_${l}`,f=t.ownerDocument;y.add(f);const p=f.__svelte_stylesheet||(f.__svelte_stylesheet=f.head.appendChild(m("style")).sheet),h=f.__svelte_rules||(f.__svelte_rules={});h[d]||(h[d]=!0,p.insertRule(`@keyframes ${d} ${u}`,p.cssRules.length));const g=t.style.animation||"";return t.style.animation=`${g?`${g}, `:""}${d} ${o}ms linear ${s}ms 1 both`,k+=1,d}function C(t,e){const n=(t.style.animation||"").split(", "),o=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),s=n.length-o.length;s&&(t.style.animation=o.join(", "),k-=s,k||c((()=>{k||(y.forEach((t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}})),y.clear())})))}function j(t){_=t}const R=[],E=[],H=[],M=[],L=Promise.resolve();let S=!1;function A(t){H.push(t)}let F=!1;const I=new Set;function D(){if(!F){F=!0;do{for(let t=0;t<R.length;t+=1){const e=R[t];j(e),N(e.$$)}for(j(null),R.length=0;E.length;)E.pop()();for(let t=0;t<H.length;t+=1){const e=H[t];I.has(e)||(I.add(e),e())}H.length=0}while(R.length);for(;M.length;)M.pop()();S=!1,F=!1,I.clear()}}function N(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(A)}}let O;function B(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const P=new Set;let q;function z(){q={r:0,c:[],p:q}}function J(){q.r||s(q.c),q=q.p}function W(t,e){t&&t.i&&(P.delete(t),t.i(e))}function V(t,e,n,o){if(t&&t.o){if(P.has(t))return;P.add(t),q.c.push((()=>{P.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}const Y={duration:0};function G(n,o,i,l){let f=o(n,i),p=l?0:1,h=null,m=null,g=null;function v(){g&&C(n,g)}function b(t,e){const n=t.b-p;return e*=Math.abs(n),{a:p,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function $(o){const{delay:r=0,duration:i=300,easing:l=e,tick:$=t,css:w}=f||Y,x={start:a()+r,b:o};o||(x.group=q,q.r+=1),h||m?m=x:(w&&(v(),g=T(n,p,o,i,r,l,w)),o&&$(0,1),h=b(x,i),A((()=>B(n,o,"start"))),function(t){let e;0===u.size&&c(d),new Promise((n=>{u.add(e={c:t,f:n})}))}((t=>{if(m&&t>m.start&&(h=b(m,i),m=null,B(n,h.b,"start"),w&&(v(),g=T(n,p,h.b,h.duration,0,l,f.css))),h)if(t>=h.end)$(p=h.b,1-p),B(n,h.b,"end"),m||(h.b?v():--h.group.r||s(h.group.c)),h=null;else if(t>=h.start){const e=t-h.start;p=h.a+h.d*l(e/h.duration),$(p,1-p)}return!(!h&&!m)})))}return{run(t){r(f)?(O||(O=Promise.resolve(),O.then((()=>{O=null}))),O).then((()=>{f=f(),$(t)})):$(t)},end(){v(),h=m=null}}}function K(t){t&&t.c()}function Q(t,e,o){const{fragment:i,on_mount:l,on_destroy:a,after_update:c}=t.$$;i&&i.m(e,o),A((()=>{const e=l.map(n).filter(r);a?a.push(...e):s(e),t.$$.on_mount=[]})),c.forEach(A)}function U(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function X(t,e){-1===t.$$.dirty[0]&&(R.push(t),S||(S=!0,L.then(D)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Z(e,n,r,i,l,a,c=[-1]){const u=_;j(e);const d=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:l,bound:o(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:o(),dirty:c,skip_bound:!1};let f=!1;if(d.ctx=r?r(e,n.props||{},((t,n,...o)=>{const s=o.length?o[0]:n;return d.ctx&&l(d.ctx[t],d.ctx[t]=s)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](s),f&&X(e,t)),n})):[],d.update(),f=!0,s(d.before_update),d.fragment=!!i&&i(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(h)}else d.fragment&&d.fragment.c();n.intro&&W(e.$$.fragment),Q(e,n.target,n.anchor),D()}j(u)}class tt{$destroy(){U(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function et(t){const e=t-1;return e*e*e+1}function nt(t,{delay:e=0,duration:n=400,easing:o=et}={}){const s=getComputedStyle(t),r=+s.opacity,i=parseFloat(s.height),l=parseFloat(s.paddingTop),a=parseFloat(s.paddingBottom),c=parseFloat(s.marginTop),u=parseFloat(s.marginBottom),d=parseFloat(s.borderTopWidth),f=parseFloat(s.borderBottomWidth);return{delay:e,duration:n,easing:o,css:t=>`overflow: hidden;opacity: ${Math.min(20*t,1)*r};height: ${t*i}px;padding-top: ${t*l}px;padding-bottom: ${t*a}px;margin-top: ${t*c}px;margin-bottom: ${t*u}px;border-top-width: ${t*d}px;border-bottom-width: ${t*f}px;`}}function ot(t){let e,n,o;return{c(){e=m("div"),e.innerHTML='<li class="svelte-wu9had">Home</li> \n\t\t<li class="svelte-wu9had">Contact</li> \n\t\t<button class="svelte-wu9had">certificate</button>',$(e,"class","menu svelte-wu9had")},m(t,n){p(t,e,n),o=!0},i(t){o||(A((()=>{n||(n=G(e,nt,{},!0)),n.run(1)})),o=!0)},o(t){n||(n=G(e,nt,{},!1)),n.run(0),o=!1},d(t){t&&h(e),t&&n&&n.end()}}}function st(t){let e,n,o,s,r,i,l,a,c,u,d,w,y,_,k,T,C=t[1]&&ot();return{c(){e=m("div"),n=m("div"),n.innerHTML='<b class="svelte-wu9had">Daber</b>',o=v(),s=m("div"),r=m("li"),r.textContent="Home",i=v(),l=m("li"),l.textContent="Contact",a=v(),c=m("button"),c.textContent="certificate",u=v(),d=m("button"),d.innerHTML='<i class="fas fa-bars"></i>',w=v(),C&&C.c(),y=g(""),$(n,"class","navbar-start svelte-wu9had"),$(r,"class","svelte-wu9had"),$(l,"class","svelte-wu9had"),$(c,"class","svelte-wu9had"),$(d,"id","burger"),$(d,"class","svelte-wu9had"),$(s,"class","navbar-end svelte-wu9had"),$(e,"class","navbar svelte-wu9had"),x(e,"navbar-shadow",t[0]&&!t[1]),x(e,"navbar-shadow2",t[1])},m(h,m){p(h,e,m),f(e,n),f(e,o),f(e,s),f(s,r),f(s,i),f(s,l),f(s,a),f(s,c),f(s,u),f(s,d),p(h,w,m),C&&C.m(h,m),p(h,y,m),_=!0,k||(T=b(d,"click",t[2]),k=!0)},p(t,[n]){3&n&&x(e,"navbar-shadow",t[0]&&!t[1]),2&n&&x(e,"navbar-shadow2",t[1]),t[1]?C?2&n&&W(C,1):(C=ot(),C.c(),W(C,1),C.m(y.parentNode,y)):C&&(z(),V(C,1,1,(()=>{C=null})),J())},i(t){_||(W(C),_=!0)},o(t){V(C),_=!1},d(t){t&&h(e),t&&h(w),C&&C.d(t),t&&h(y),k=!1,T()}}}function rt(t,e,n){let o=!1,s=!1;return window.onscroll=t=>{t.path[1].window.scrollY>=50?n(0,o=!0):n(0,o=!1)},[o,s,()=>{n(1,s=!s)}]}class it extends tt{constructor(t){super(),Z(this,t,rt,st,i,{})}}function lt(e){let n;return{c(){n=m("div"),n.innerHTML='<div class="image svelte-1tpm13g"><img src="/my icon.jpg" alt="daber logo" class="svelte-1tpm13g"/></div> \n\t<div class="intro-text svelte-1tpm13g"><h1 class="svelte-1tpm13g">Hello My Name Is Daber</h1> \n\t\t<p class="svelte-1tpm13g">this is my portofolio</p></div>',$(n,"class","info svelte-1tpm13g")},m(t,e){p(t,n,e)},p:t,i:t,o:t,d(t){t&&h(n)}}}class at extends tt{constructor(t){super(),Z(this,t,null,lt,i,{})}}function ct(e){let n,o,s,r,i,l,a,c,u,d,y,_,k=e[0].title+"",T=e[0].description+"",C=e[0].title+"";return{c(){n=m("div"),o=m("b"),s=g(k),r=v(),i=m("p"),l=g(T),a=v(),c=m("button"),u=g("see "),d=g(C),$(o,"class","svelte-1w41exi"),$(i,"class","svelte-1w41exi"),$(c,"class","svelte-1w41exi"),$(n,"class","card svelte-1w41exi"),x(n,"hvr-bounce-to-right",e[0].bgToRight),x(n,"hvr-bounce-to-bottom",void 0===e[0].bgToRight),x(n,"hvr-bounce-to-left",!e[0].bgToRight)},m(t,h){p(t,n,h),f(n,o),f(o,s),f(n,r),f(n,i),f(i,l),f(n,a),f(n,c),f(c,u),f(c,d),y||(_=b(c,"click",e[1]),y=!0)},p(t,[e]){1&e&&k!==(k=t[0].title+"")&&w(s,k),1&e&&T!==(T=t[0].description+"")&&w(l,T),1&e&&C!==(C=t[0].title+"")&&w(d,C),1&e&&x(n,"hvr-bounce-to-right",t[0].bgToRight),1&e&&x(n,"hvr-bounce-to-bottom",void 0===t[0].bgToRight),1&e&&x(n,"hvr-bounce-to-left",!t[0].bgToRight)},i:t,o:t,d(t){t&&h(n),y=!1,_()}}}function ut(t,e,n){let{cardInfo:o={}}=e;return t.$$set=t=>{"cardInfo"in t&&n(0,o=t.cardInfo)},[o,function(){o?.location&&(location.href=o?.location)}]}class dt extends tt{constructor(t){super(),Z(this,t,ut,ct,i,{cardInfo:0})}}function ft(t,e,n){const o=t.slice();return o[1]=e[n],o}function pt(e){let n,o;return n=new dt({props:{cardInfo:e[1]}}),{c(){K(n.$$.fragment)},m(t,e){Q(n,t,e),o=!0},p:t,i(t){o||(W(n.$$.fragment,t),o=!0)},o(t){V(n.$$.fragment,t),o=!1},d(t){U(n,t)}}}function ht(t){let e,n,o,s,r,i,l=t[0],a=[];for(let e=0;e<l.length;e+=1)a[e]=pt(ft(t,l,e));const c=t=>V(a[t],1,1,(()=>{a[t]=null}));return{c(){e=m("div"),n=m("h1"),n.textContent="my project",o=v(),s=m("p"),s.textContent="this is my project ever i made",r=v();for(let t=0;t<a.length;t+=1)a[t].c();$(n,"class","svelte-19l5x45"),$(s,"class","svelte-19l5x45"),$(e,"class","card-list svelte-19l5x45")},m(t,l){p(t,e,l),f(e,n),f(e,o),f(e,s),f(e,r);for(let t=0;t<a.length;t+=1)a[t].m(e,null);i=!0},p(t,[n]){if(1&n){let o;for(l=t[0],o=0;o<l.length;o+=1){const s=ft(t,l,o);a[o]?(a[o].p(s,n),W(a[o],1)):(a[o]=pt(s),a[o].c(),W(a[o],1),a[o].m(e,null))}for(z(),o=l.length;o<a.length;o+=1)c(o);J()}},i(t){if(!i){for(let t=0;t<l.length;t+=1)W(a[t]);i=!0}},o(t){a=a.filter(Boolean);for(let t=0;t<a.length;t+=1)V(a[t]);i=!1},d(t){t&&h(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(a,t)}}}function mt(t){return[[{title:"seleku",description:"seleku is a framework inspired by svelte",bgToRight:!0,location:"https://github.com/daberpro/seleku"},{title:"joss",description:"joss is a framework inspired by tailwind"},{title:"daber engine",description:"daber engine is a engine for make a game using javascript",bgToRight:!1},{title:"seleku native",description:"seleku native is a framework use like a compiler supported by node js",bgToRight:!0},{title:"jscp native",description:"jscp is a software system write in c++ and use the xml to make a cross platform mobile apps"},{title:"daber preproject",description:"daber preproject is an app to help manage the code",bgToRight:!1}]]}class gt extends tt{constructor(t){super(),Z(this,t,mt,ht,i,{})}}function vt(e){let n;return{c(){n=m("div"),n.innerHTML='<b class="svelte-w6du6r">I am working with</b> \n\t<div class="info svelte-w6du6r"><div class="img svelte-w6du6r"><i class="fab fa-html5 svelte-w6du6r"></i></div> \n\t\t<p class="svelte-w6du6r">HTML</p></div> \n\t<div class="info svelte-w6du6r"><div class="img svelte-w6du6r"><i class="fab fa-css3-alt svelte-w6du6r"></i></div> \n\t\t<p class="svelte-w6du6r">CSS</p></div> \n\t<div class="info svelte-w6du6r"><div class="img svelte-w6du6r"><i class="fab fa-js-square svelte-w6du6r"></i></div> \n\t\t<p class="svelte-w6du6r">JAVASCRIPT</p></div> \n\t<div class="info svelte-w6du6r"><div class="img svelte-w6du6r"><i class="fab fa-node-js svelte-w6du6r"></i></div> \n\t\t<p class="svelte-w6du6r">NODE JS</p></div>',$(n,"class","list svelte-w6du6r")},m(t,e){p(t,n,e)},p:t,i:t,o:t,d(t){t&&h(n)}}}class bt extends tt{constructor(t){super(),Z(this,t,null,vt,i,{})}}function $t(e){let n,o,s,r,i,l,a,c,u,d,g,b;return s=new it({}),i=new at({}),a=new bt({}),u=new gt({}),{c(){n=m("style"),n.textContent="html,body{\n\t\t\tmargin:0px;\n\t\t\tpadding:0px;\n\t\t\tscroll-behavior: smooth;\n\t\t}\n\t\t/* width */\n\t\t::-webkit-scrollbar {\n\t\t  width: 5px;\n\t\t}\n\n\t\t/* Track */\n\t\t::-webkit-scrollbar-track {\n\t\t  background: transparent;\n\t\t}\n\n\t\t/* Handle */\n\t\t::-webkit-scrollbar-thumb {\n\t\t  background: transparent;\n\t\t  border-radius: 5px;\n\t\t}\n\n\t\t/* Handle on hover */\n\t\t::-webkit-scrollbar-thumb:hover {\n\t\t  background: #5ddef4;\n\t\t}",o=v(),K(s.$$.fragment),r=v(),K(i.$$.fragment),l=v(),K(a.$$.fragment),c=v(),K(u.$$.fragment),d=v(),g=m("footer"),g.textContent="© Daber",$(g,"class","my-footer svelte-1y8c9h")},m(t,e){f(document.head,n),p(t,o,e),Q(s,t,e),p(t,r,e),Q(i,t,e),p(t,l,e),Q(a,t,e),p(t,c,e),Q(u,t,e),p(t,d,e),p(t,g,e),b=!0},p:t,i(t){b||(W(s.$$.fragment,t),W(i.$$.fragment,t),W(a.$$.fragment,t),W(u.$$.fragment,t),b=!0)},o(t){V(s.$$.fragment,t),V(i.$$.fragment,t),V(a.$$.fragment,t),V(u.$$.fragment,t),b=!1},d(t){h(n),t&&h(o),U(s,t),t&&h(r),U(i,t),t&&h(l),U(a,t),t&&h(c),U(u,t),t&&h(d),t&&h(g)}}}return new class extends tt{constructor(t){super(),Z(this,t,null,$t,i,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
