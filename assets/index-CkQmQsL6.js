(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const dt=(e,t)=>e===t,ee=Symbol("solid-proxy"),Fe=typeof Proxy=="function",te={equals:dt};let ht=Ye;const I=1,ne=2,Ie={owned:null,cleanups:null,context:null,owner:null};var p=null;let ce=null,mt=null,b=null,C=null,B=null,oe=0;function Ue(e,t){const n=b,s=p,r=e.length===0,o=t===void 0?s:t,l=r?Ie:{owned:null,cleanups:null,context:o?o.context:null,owner:o},i=r?e:()=>e(()=>O(()=>M(l)));p=l,b=null;try{return R(i,!0)}finally{b=n,p=s}}function k(e,t){t=t?Object.assign({},te,t):te;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},s=r=>(typeof r=="function"&&(r=r(n.value)),He(n,r));return[Ve.bind(n),s]}function _(e,t,n){const s=Me(e,t,!1,I);ie(s)}function S(e,t,n){n=n?Object.assign({},te,n):te;const s=Me(e,t,!0,0);return s.observers=null,s.observerSlots=null,s.comparator=n.equals||void 0,ie(s),Ve.bind(s)}function gt(e){return R(e,!1)}function O(e){if(b===null)return e();const t=b;b=null;try{return e()}finally{b=t}}function we(e,t,n){const s=Array.isArray(e);let r,o=n&&n.defer;return l=>{let i;if(s){i=Array(e.length);for(let c=0;c<e.length;c++)i[c]=e[c]()}else i=e();if(o)return o=!1,l;const a=O(()=>t(i,r,l));return r=i,a}}function De(e){return p===null||(p.cleanups===null?p.cleanups=[e]:p.cleanups.push(e)),e}function qe(){return p}function We(e,t){const n=p,s=b;p=e,b=null;try{return R(t,!0)}catch(r){Ee(r)}finally{p=n,b=s}}function pt(e){const t=b,n=p;return Promise.resolve().then(()=>{b=t,p=n;let s;return R(e,!1),b=p=null,s?s.done:void 0})}function Ke(e,t){const n=Symbol("context");return{id:n,Provider:vt(n),defaultValue:e}}function ve(e){let t;return p&&p.context&&(t=p.context[e.id])!==void 0?t:e.defaultValue}function Ae(e){const t=S(e),n=S(()=>he(t()));return n.toArray=()=>{const s=n();return Array.isArray(s)?s:s!=null?[s]:[]},n}function Ve(){if(this.sources&&this.state)if(this.state===I)ie(this);else{const e=C;C=null,R(()=>re(this),!1),C=e}if(b){const e=this.observers?this.observers.length:0;b.sources?(b.sources.push(this),b.sourceSlots.push(e)):(b.sources=[this],b.sourceSlots=[e]),this.observers?(this.observers.push(b),this.observerSlots.push(b.sources.length-1)):(this.observers=[b],this.observerSlots=[b.sources.length-1])}return this.value}function He(e,t,n){let s=e.value;return(!e.comparator||!e.comparator(s,t))&&(e.value=t,e.observers&&e.observers.length&&R(()=>{for(let r=0;r<e.observers.length;r+=1){const o=e.observers[r],l=ce&&ce.running;l&&ce.disposed.has(o),(l?!o.tState:!o.state)&&(o.pure?C.push(o):B.push(o),o.observers&&Xe(o)),l||(o.state=I)}if(C.length>1e6)throw C=[],new Error},!1)),t}function ie(e){if(!e.fn)return;M(e);const t=oe;yt(e,e.value,t)}function yt(e,t,n){let s;const r=p,o=b;b=p=e;try{s=e.fn(t)}catch(l){return e.pure&&(e.state=I,e.owned&&e.owned.forEach(M),e.owned=null),e.updatedAt=n+1,Ee(l)}finally{b=o,p=r}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?He(e,s):e.value=s,e.updatedAt=n)}function Me(e,t,n,s=I,r){const o={fn:e,state:s,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:p,context:p?p.context:null,pure:n};return p===null||p!==Ie&&(p.owned?p.owned.push(o):p.owned=[o]),o}function Ge(e){if(e.state===0)return;if(e.state===ne)return re(e);if(e.suspense&&O(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<oe);)e.state&&t.push(e);for(let n=t.length-1;n>=0;n--)if(e=t[n],e.state===I)ie(e);else if(e.state===ne){const s=C;C=null,R(()=>re(e,t[0]),!1),C=s}}function R(e,t){if(C)return e();let n=!1;t||(C=[]),B?n=!0:B=[],oe++;try{const s=e();return bt(n),s}catch(s){n||(B=null),C=null,Ee(s)}}function bt(e){if(C&&(Ye(C),C=null),e)return;const t=B;B=null,t.length&&R(()=>ht(t),!1)}function Ye(e){for(let t=0;t<e.length;t++)Ge(e[t])}function re(e,t){e.state=0;for(let n=0;n<e.sources.length;n+=1){const s=e.sources[n];if(s.sources){const r=s.state;r===I?s!==t&&(!s.updatedAt||s.updatedAt<oe)&&Ge(s):r===ne&&re(s,t)}}}function Xe(e){for(let t=0;t<e.observers.length;t+=1){const n=e.observers[t];n.state||(n.state=ne,n.pure?C.push(n):B.push(n),n.observers&&Xe(n))}}function M(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),s=e.sourceSlots.pop(),r=n.observers;if(r&&r.length){const o=r.pop(),l=n.observerSlots.pop();s<r.length&&(o.sourceSlots[l]=s,r[s]=o,n.observerSlots[s]=l)}}if(e.tOwned){for(t=e.tOwned.length-1;t>=0;t--)M(e.tOwned[t]);delete e.tOwned}if(e.owned){for(t=e.owned.length-1;t>=0;t--)M(e.owned[t]);e.owned=null}if(e.cleanups){for(t=e.cleanups.length-1;t>=0;t--)e.cleanups[t]();e.cleanups=null}e.state=0}function wt(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function Ee(e,t=p){throw wt(e)}function he(e){if(typeof e=="function"&&!e.length)return he(e());if(Array.isArray(e)){const t=[];for(let n=0;n<e.length;n++){const s=he(e[n]);Array.isArray(s)?t.push.apply(t,s):t.push(s)}return t}return e}function vt(e,t){return function(s){let r;return _(()=>r=O(()=>(p.context={...p.context,[e]:s.value},Ae(()=>s.children))),void 0),r}}function A(e,t){return O(()=>e(t||{}))}function z(){return!0}const me={get(e,t,n){return t===ee?n:e.get(t)},has(e,t){return t===ee?!0:e.has(t)},set:z,deleteProperty:z,getOwnPropertyDescriptor(e,t){return{configurable:!0,enumerable:!0,get(){return e.get(t)},set:z,deleteProperty:z}},ownKeys(e){return e.keys()}};function ue(e){return(e=typeof e=="function"?e():e)?e:{}}function At(){for(let e=0,t=this.length;e<t;++e){const n=this[e]();if(n!==void 0)return n}}function ge(...e){let t=!1;for(let l=0;l<e.length;l++){const i=e[l];t=t||!!i&&ee in i,e[l]=typeof i=="function"?(t=!0,S(i)):i}if(Fe&&t)return new Proxy({get(l){for(let i=e.length-1;i>=0;i--){const a=ue(e[i])[l];if(a!==void 0)return a}},has(l){for(let i=e.length-1;i>=0;i--)if(l in ue(e[i]))return!0;return!1},keys(){const l=[];for(let i=0;i<e.length;i++)l.push(...Object.keys(ue(e[i])));return[...new Set(l)]}},me);const n={},s=Object.create(null);for(let l=e.length-1;l>=0;l--){const i=e[l];if(!i)continue;const a=Object.getOwnPropertyNames(i);for(let c=a.length-1;c>=0;c--){const u=a[c];if(u==="__proto__"||u==="constructor")continue;const d=Object.getOwnPropertyDescriptor(i,u);if(!s[u])s[u]=d.get?{enumerable:!0,configurable:!0,get:At.bind(n[u]=[d.get.bind(i)])}:d.value!==void 0?d:void 0;else{const f=n[u];f&&(d.get?f.push(d.get.bind(i)):d.value!==void 0&&f.push(()=>d.value))}}}const r={},o=Object.keys(s);for(let l=o.length-1;l>=0;l--){const i=o[l],a=s[i];a&&a.get?Object.defineProperty(r,i,a):r[i]=a?a.value:void 0}return r}function Et(e,...t){if(Fe&&ee in e){const r=new Set(t.length>1?t.flat():t[0]),o=t.map(l=>new Proxy({get(i){return l.includes(i)?e[i]:void 0},has(i){return l.includes(i)&&i in e},keys(){return l.filter(i=>i in e)}},me));return o.push(new Proxy({get(l){return r.has(l)?void 0:e[l]},has(l){return r.has(l)?!1:l in e},keys(){return Object.keys(e).filter(l=>!r.has(l))}},me)),o}const n={},s=t.map(()=>({}));for(const r of Object.getOwnPropertyNames(e)){const o=Object.getOwnPropertyDescriptor(e,r),l=!o.get&&!o.set&&o.enumerable&&o.writable&&o.configurable;let i=!1,a=0;for(const c of t)c.includes(r)&&(i=!0,l?s[a][r]=o.value:Object.defineProperty(s[a],r,o)),++a;i||(l?n[r]=o.value:Object.defineProperty(n,r,o))}return[...s,n]}const Pt=e=>`Stale read from <${e}>.`;function ze(e){const t=e.keyed,n=S(()=>e.when,void 0,{equals:(s,r)=>t?s===r:!s==!r});return S(()=>{const s=n();if(s){const r=e.children;return typeof r=="function"&&r.length>0?O(()=>r(t?s:()=>{if(!O(n))throw Pt("Show");return e.when})):r}return e.fallback},void 0,void 0)}const St=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","hidden","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected"],Ct=new Set(["className","value","readOnly","formNoValidate","isMap","noModule","playsInline",...St]),Lt=new Set(["innerHTML","textContent","innerText","children"]),$t=Object.assign(Object.create(null),{className:"class",htmlFor:"for"}),xt=Object.assign(Object.create(null),{class:"className",formnovalidate:{$:"formNoValidate",BUTTON:1,INPUT:1},ismap:{$:"isMap",IMG:1},nomodule:{$:"noModule",SCRIPT:1},playsinline:{$:"playsInline",VIDEO:1},readonly:{$:"readOnly",INPUT:1,TEXTAREA:1}});function Ot(e,t){const n=xt[e];return typeof n=="object"?n[t]?n.$:void 0:n}const _t=new Set(["beforeinput","click","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"]);function Rt(e,t,n){let s=n.length,r=t.length,o=s,l=0,i=0,a=t[r-1].nextSibling,c=null;for(;l<r||i<o;){if(t[l]===n[i]){l++,i++;continue}for(;t[r-1]===n[o-1];)r--,o--;if(r===l){const u=o<s?i?n[i-1].nextSibling:n[o-i]:a;for(;i<o;)e.insertBefore(n[i++],u)}else if(o===i)for(;l<r;)(!c||!c.has(t[l]))&&t[l].remove(),l++;else if(t[l]===n[o-1]&&n[i]===t[r-1]){const u=t[--r].nextSibling;e.insertBefore(n[i++],t[l++].nextSibling),e.insertBefore(n[--o],u),t[r]=n[o]}else{if(!c){c=new Map;let d=i;for(;d<o;)c.set(n[d],d++)}const u=c.get(t[l]);if(u!=null)if(i<u&&u<o){let d=l,f=1,m;for(;++d<r&&d<o&&!((m=c.get(t[d]))==null||m!==u+f);)f++;if(f>u-i){const w=t[l];for(;i<u;)e.insertBefore(n[i++],w)}else e.replaceChild(n[i++],t[l++])}else l++;else t[l++].remove()}}}const Re="_$DX_DELEGATE";function Tt(e,t,n,s={}){let r;return Ue(o=>{r=o,t===document?e():$(t,e(),t.firstChild?null:void 0,n)},s.owner),()=>{r(),t.textContent=""}}function U(e,t,n){let s;const r=()=>{const l=document.createElement("template");return l.innerHTML=e,l.content.firstChild},o=()=>(s||(s=r())).cloneNode(!0);return o.cloneNode=o,o}function Je(e,t=window.document){const n=t[Re]||(t[Re]=new Set);for(let s=0,r=e.length;s<r;s++){const o=e[s];n.has(o)||(n.add(o),t.addEventListener(o,Wt))}}function pe(e,t,n){n==null?e.removeAttribute(t):e.setAttribute(t,n)}function Nt(e,t,n){n?e.setAttribute(t,""):e.removeAttribute(t)}function jt(e,t){t==null?e.removeAttribute("class"):e.className=t}function kt(e,t,n,s){if(s)Array.isArray(n)?(e[`$$${t}`]=n[0],e[`$$${t}Data`]=n[1]):e[`$$${t}`]=n;else if(Array.isArray(n)){const r=n[0];e.addEventListener(t,n[0]=o=>r.call(e,n[1],o))}else e.addEventListener(t,n,typeof n!="function"&&n)}function Bt(e,t,n={}){const s=Object.keys(t||{}),r=Object.keys(n);let o,l;for(o=0,l=r.length;o<l;o++){const i=r[o];!i||i==="undefined"||t[i]||(Te(e,i,!1),delete n[i])}for(o=0,l=s.length;o<l;o++){const i=s[o],a=!!t[i];!i||i==="undefined"||n[i]===a||!a||(Te(e,i,!0),n[i]=a)}return n}function Ft(e,t,n){if(!t)return n?pe(e,"style"):t;const s=e.style;if(typeof t=="string")return s.cssText=t;typeof n=="string"&&(s.cssText=n=void 0),n||(n={}),t||(t={});let r,o;for(o in n)t[o]==null&&s.removeProperty(o),delete n[o];for(o in t)r=t[o],r!==n[o]&&(s.setProperty(o,r),n[o]=r);return n}function It(e,t={},n,s){const r={};return _(()=>r.children=G(e,t.children,r.children)),_(()=>typeof t.ref=="function"&&Ut(t.ref,e)),_(()=>Dt(e,t,n,!0,r,!0)),r}function Ut(e,t,n){return O(()=>e(t,n))}function $(e,t,n,s){if(n!==void 0&&!s&&(s=[]),typeof t!="function")return G(e,t,s,n);_(r=>G(e,t(),r,n),s)}function Dt(e,t,n,s,r={},o=!1){t||(t={});for(const l in r)if(!(l in t)){if(l==="children")continue;r[l]=Ne(e,l,null,r[l],n,o,t)}for(const l in t){if(l==="children")continue;const i=t[l];r[l]=Ne(e,l,i,r[l],n,o,t)}}function qt(e){return e.toLowerCase().replace(/-([a-z])/g,(t,n)=>n.toUpperCase())}function Te(e,t,n){const s=t.trim().split(/\s+/);for(let r=0,o=s.length;r<o;r++)e.classList.toggle(s[r],n)}function Ne(e,t,n,s,r,o,l){let i,a,c,u,d;if(t==="style")return Ft(e,n,s);if(t==="classList")return Bt(e,n,s);if(n===s)return s;if(t==="ref")o||n(e);else if(t.slice(0,3)==="on:"){const f=t.slice(3);s&&e.removeEventListener(f,s,typeof s!="function"&&s),n&&e.addEventListener(f,n,typeof n!="function"&&n)}else if(t.slice(0,10)==="oncapture:"){const f=t.slice(10);s&&e.removeEventListener(f,s,!0),n&&e.addEventListener(f,n,!0)}else if(t.slice(0,2)==="on"){const f=t.slice(2).toLowerCase(),m=_t.has(f);if(!m&&s){const w=Array.isArray(s)?s[0]:s;e.removeEventListener(f,w)}(m||n)&&(kt(e,f,n,m),m&&Je([f]))}else t.slice(0,5)==="attr:"?pe(e,t.slice(5),n):t.slice(0,5)==="bool:"?Nt(e,t.slice(5),n):(d=t.slice(0,5)==="prop:")||(c=Lt.has(t))||(u=Ot(t,e.tagName))||(a=Ct.has(t))||(i=e.nodeName.includes("-")||"is"in l)?(d&&(t=t.slice(5),a=!0),t==="class"||t==="className"?jt(e,n):i&&!a&&!c?e[qt(t)]=n:e[u||t]=n):pe(e,$t[t]||t,n);return n}function Wt(e){let t=e.target;const n=`$$${e.type}`,s=e.target,r=e.currentTarget,o=a=>Object.defineProperty(e,"target",{configurable:!0,value:a}),l=()=>{const a=t[n];if(a&&!t.disabled){const c=t[`${n}Data`];if(c!==void 0?a.call(t,c,e):a.call(t,e),e.cancelBubble)return}return t.host&&typeof t.host!="string"&&!t.host._$host&&t.contains(e.target)&&o(t.host),!0},i=()=>{for(;l()&&(t=t._$host||t.parentNode||t.host););};if(Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return t||document}}),e.composedPath){const a=e.composedPath();o(a[0]);for(let c=0;c<a.length-2&&(t=a[c],!!l());c++){if(t._$host){t=t._$host,i();break}if(t.parentNode===r)break}}else i();o(s)}function G(e,t,n,s,r){for(;typeof n=="function";)n=n();if(t===n)return n;const o=typeof t,l=s!==void 0;if(e=l&&n[0]&&n[0].parentNode||e,o==="string"||o==="number"){if(o==="number"&&(t=t.toString(),t===n))return n;if(l){let i=n[0];i&&i.nodeType===3?i.data!==t&&(i.data=t):i=document.createTextNode(t),n=W(e,n,s,i)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t}else if(t==null||o==="boolean")n=W(e,n,s);else{if(o==="function")return _(()=>{let i=t();for(;typeof i=="function";)i=i();n=G(e,i,n,s)}),()=>n;if(Array.isArray(t)){const i=[],a=n&&Array.isArray(n);if(ye(i,t,n,r))return _(()=>n=G(e,i,n,s,!0)),()=>n;if(i.length===0){if(n=W(e,n,s),l)return n}else a?n.length===0?je(e,i,s):Rt(e,n,i):(n&&W(e),je(e,i));n=i}else if(t.nodeType){if(Array.isArray(n)){if(l)return n=W(e,n,s,t);W(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}}return n}function ye(e,t,n,s){let r=!1;for(let o=0,l=t.length;o<l;o++){let i=t[o],a=n&&n[e.length],c;if(!(i==null||i===!0||i===!1))if((c=typeof i)=="object"&&i.nodeType)e.push(i);else if(Array.isArray(i))r=ye(e,i,a)||r;else if(c==="function")if(s){for(;typeof i=="function";)i=i();r=ye(e,Array.isArray(i)?i:[i],Array.isArray(a)?a:[a])||r}else e.push(i),r=!0;else{const u=String(i);a&&a.nodeType===3&&a.data===u?e.push(a):e.push(document.createTextNode(u))}}return r}function je(e,t,n=null){for(let s=0,r=t.length;s<r;s++)e.insertBefore(t[s],n)}function W(e,t,n,s){if(n===void 0)return e.textContent="";const r=s||document.createTextNode("");if(t.length){let o=!1;for(let l=t.length-1;l>=0;l--){const i=t[l];if(r!==i){const a=i.parentNode===e;!o&&!l?a?e.replaceChild(r,i):e.insertBefore(r,n):a&&i.remove()}else o=!0}}else e.insertBefore(r,n);return[r]}const Kt=!1;function Ze(){let e=new Set;function t(r){return e.add(r),()=>e.delete(r)}let n=!1;function s(r,o){if(n)return!(n=!1);const l={to:r,options:o,defaultPrevented:!1,preventDefault:()=>l.defaultPrevented=!0};for(const i of e)i.listener({...l,from:i.location,retry:a=>{a&&(n=!0),i.navigate(r,{...o,resolve:!1})}});return!l.defaultPrevented}return{subscribe:t,confirm:s}}let be;function Pe(){(!window.history.state||window.history.state._depth==null)&&window.history.replaceState({...window.history.state,_depth:window.history.length-1},""),be=window.history.state._depth}Pe();function Vt(e){return{...e,_depth:window.history.state&&window.history.state._depth}}function Ht(e,t){let n=!1;return()=>{const s=be;Pe();const r=s==null?null:be-s;if(n){n=!1;return}r&&t(r)?(n=!0,window.history.go(-r)):e()}}const Mt=/^(?:[a-z0-9]+:)?\/\//i,Gt=/^\/+|(\/)\/+$/g,Qe="http://sr";function F(e,t=!1){const n=e.replace(Gt,"$1");return n?t||/^[?#]/.test(n)?n:"/"+n:""}function Q(e,t,n){if(Mt.test(t))return;const s=F(e),r=n&&F(n);let o="";return!r||t.startsWith("/")?o=s:r.toLowerCase().indexOf(s.toLowerCase())!==0?o=s+r:o=r,(o||"/")+F(t,!o)}function Yt(e,t){if(e==null)throw new Error(t);return e}function Xt(e,t){return F(e).replace(/\/*(\*.*)?$/g,"")+F(t)}function et(e){const t={};return e.searchParams.forEach((n,s)=>{s in t?Array.isArray(t[s])?t[s].push(n):t[s]=[t[s],n]:t[s]=n}),t}function zt(e,t,n){const[s,r]=e.split("/*",2),o=s.split("/").filter(Boolean),l=o.length;return i=>{const a=i.split("/").filter(Boolean),c=a.length-l;if(c<0||c>0&&r===void 0&&!t)return null;const u={path:l?"":"/",params:{}},d=f=>n===void 0?void 0:n[f];for(let f=0;f<l;f++){const m=o[f],w=m[0]===":",h=w?a[f]:a[f].toLowerCase(),g=w?m.slice(1):m.toLowerCase();if(w&&fe(h,d(g)))u.params[g]=h;else if(w||!fe(h,g))return null;u.path+=`/${h}`}if(r){const f=c?a.slice(-c).join("/"):"";if(fe(f,d(r)))u.params[r]=f;else return null}return u}}function fe(e,t){const n=s=>s===e;return t===void 0?!0:typeof t=="string"?n(t):typeof t=="function"?t(e):Array.isArray(t)?t.some(n):t instanceof RegExp?t.test(e):!1}function Jt(e){const[t,n]=e.pattern.split("/*",2),s=t.split("/").filter(Boolean);return s.reduce((r,o)=>r+(o.startsWith(":")?2:3),s.length-(n===void 0?0:1))}function tt(e){const t=new Map,n=qe();return new Proxy({},{get(s,r){return t.has(r)||We(n,()=>t.set(r,S(()=>e()[r]))),t.get(r)()},getOwnPropertyDescriptor(){return{enumerable:!0,configurable:!0}},ownKeys(){return Reflect.ownKeys(e())}})}function nt(e){let t=/(\/?\:[^\/]+)\?/.exec(e);if(!t)return[e];let n=e.slice(0,t.index),s=e.slice(t.index+t[0].length);const r=[n,n+=t[1]];for(;t=/^(\/\:[^\/]+)\?/.exec(s);)r.push(n+=t[1]),s=s.slice(t[0].length);return nt(s).reduce((o,l)=>[...o,...r.map(i=>i+l)],[])}const Zt=100,rt=Ke(),Se=Ke(),Ce=()=>Yt(ve(rt),"<A> and 'use' router primitives can be only used inside a Route."),Qt=()=>ve(Se)||Ce().base,en=e=>{const t=Qt();return S(()=>t.resolvePath(e()))},tn=e=>{const t=Ce();return S(()=>{const n=e();return n!==void 0?t.renderPath(n):n})},nn=()=>Ce().location;function rn(e,t=""){const{component:n,preload:s,load:r,children:o,info:l}=e,i=!o||Array.isArray(o)&&!o.length,a={key:e,component:n,preload:s||r,info:l};return st(e.path).reduce((c,u)=>{for(const d of nt(u)){const f=Xt(t,d);let m=i?f:f.split("/*",1)[0];m=m.split("/").map(w=>w.startsWith(":")||w.startsWith("*")?w:encodeURIComponent(w)).join("/"),c.push({...a,originalPath:u,pattern:m,matcher:zt(m,!i,e.matchFilters)})}return c},[])}function sn(e,t=0){return{routes:e,score:Jt(e[e.length-1])*1e4-t,matcher(n){const s=[];for(let r=e.length-1;r>=0;r--){const o=e[r],l=o.matcher(n);if(!l)return null;s.unshift({...l,route:o})}return s}}}function st(e){return Array.isArray(e)?e:[e]}function ot(e,t="",n=[],s=[]){const r=st(e);for(let o=0,l=r.length;o<l;o++){const i=r[o];if(i&&typeof i=="object"){i.hasOwnProperty("path")||(i.path="");const a=rn(i,t);for(const c of a){n.push(c);const u=Array.isArray(i.children)&&i.children.length===0;if(i.children&&!u)ot(i.children,c.pattern,n,s);else{const d=sn([...n],s.length);s.push(d)}n.pop()}}}return n.length?s:s.sort((o,l)=>l.score-o.score)}function de(e,t){for(let n=0,s=e.length;n<s;n++){const r=e[n].matcher(t);if(r)return r}return[]}function on(e,t,n){const s=new URL(Qe),r=S(u=>{const d=e();try{return new URL(d,s)}catch{return console.error(`Invalid path ${d}`),u}},s,{equals:(u,d)=>u.href===d.href}),o=S(()=>r().pathname),l=S(()=>r().search,!0),i=S(()=>r().hash),a=()=>"",c=we(l,()=>et(r()));return{get pathname(){return o()},get search(){return l()},get hash(){return i()},get state(){return t()},get key(){return a()},query:n?n(c):tt(c)}}let j;function ln(){return j}function an(e,t,n,s={}){const{signal:[r,o],utils:l={}}=e,i=l.parsePath||(y=>y),a=l.renderPath||(y=>y),c=l.beforeLeave||Ze(),u=Q("",s.base||"");if(u===void 0)throw new Error(`${u} is not a valid base path`);u&&!r().value&&o({value:u,replace:!0,scroll:!1});const[d,f]=k(!1);let m;const w=(y,v)=>{v.value===h()&&v.state===E()||(m===void 0&&f(!0),j=y,m=v,pt(()=>{m===v&&(g(m.value),P(m.state),N[1](L=>L.filter(D=>D.pending)))}).finally(()=>{m===v&&gt(()=>{j=void 0,y==="navigate"&&ut(m),f(!1),m=void 0})}))},[h,g]=k(r().value),[E,P]=k(r().state),T=on(h,E,l.queryWrapper),x=[],N=k([]),K=S(()=>typeof s.transformUrl=="function"?de(t(),s.transformUrl(T.pathname)):de(t(),T.pathname)),xe=()=>{const y=K(),v={};for(let L=0;L<y.length;L++)Object.assign(v,y[L].params);return v},lt=l.paramsWrapper?l.paramsWrapper(xe,t):tt(xe),Oe={pattern:u,path:()=>u,outlet:()=>null,resolvePath(y){return Q(u,y)}};return _(we(r,y=>w("native",y),{defer:!0})),{base:Oe,location:T,params:lt,isRouting:d,renderPath:a,parsePath:i,navigatorFactory:ct,matches:K,beforeLeave:c,preloadRoute:ft,singleFlight:s.singleFlight===void 0?!0:s.singleFlight,submissions:N};function at(y,v,L){O(()=>{if(typeof v=="number"){v&&(l.go?l.go(v):console.warn("Router integration does not support relative routing"));return}const D=!v||v[0]==="?",{replace:le,resolve:q,scroll:ae,state:V}={replace:!1,resolve:!D,scroll:!0,...L},X=q?y.resolvePath(v):Q(D&&T.pathname||"",v);if(X===void 0)throw new Error(`Path '${v}' is not a routable path`);if(x.length>=Zt)throw new Error("Too many redirects");const _e=h();(X!==_e||V!==E())&&(Kt||c.confirm(X,L)&&(x.push({value:_e,replace:le,scroll:ae,state:E()}),w("navigate",{value:X,state:V})))})}function ct(y){return y=y||ve(Se)||Oe,(v,L)=>at(y,v,L)}function ut(y){const v=x[0];v&&(o({...y,replace:v.replace,scroll:v.scroll}),x.length=0)}function ft(y,v){const L=de(t(),y.pathname),D=j;j="preload";for(let le in L){const{route:q,params:ae}=L[le];q.component&&q.component.preload&&q.component.preload();const{preload:V}=q;v&&V&&We(n(),()=>V({params:ae,location:{pathname:y.pathname,search:y.search,hash:y.hash,query:et(y),state:null,key:""},intent:"preload"}))}j=D}}function cn(e,t,n,s){const{base:r,location:o,params:l}=e,{pattern:i,component:a,preload:c}=s().route,u=S(()=>s().path);a&&a.preload&&a.preload();const d=c?c({params:l,location:o,intent:j||"initial"}):void 0;return{parent:t,pattern:i,path:u,outlet:()=>a?A(a,{params:l,location:o,data:d,get children(){return n()}}):n(),resolvePath(m){return Q(r.path(),m,u())}}}const un=e=>t=>{const{base:n}=t,s=Ae(()=>t.children),r=S(()=>ot(s(),t.base||""));let o;const l=an(e,r,()=>o,{base:n,singleFlight:t.singleFlight,transformUrl:t.transformUrl});return e.create&&e.create(l),A(rt.Provider,{value:l,get children(){return A(fn,{routerState:l,get root(){return t.root},get preload(){return t.rootPreload||t.rootLoad},get children(){return[S(()=>(o=qe())&&null),A(dn,{routerState:l,get branches(){return r()}})]}})}})};function fn(e){const t=e.routerState.location,n=e.routerState.params,s=S(()=>e.preload&&O(()=>{e.preload({params:n,location:t,intent:ln()||"initial"})}));return A(ze,{get when(){return e.root},keyed:!0,get fallback(){return e.children},children:r=>A(r,{params:n,location:t,get data(){return s()},get children(){return e.children}})})}function dn(e){const t=[];let n;const s=S(we(e.routerState.matches,(r,o,l)=>{let i=o&&r.length===o.length;const a=[];for(let c=0,u=r.length;c<u;c++){const d=o&&o[c],f=r[c];l&&d&&f.route.key===d.route.key?a[c]=l[c]:(i=!1,t[c]&&t[c](),Ue(m=>{t[c]=m,a[c]=cn(e.routerState,a[c-1]||e.routerState.base,ke(()=>s()[c+1]),()=>e.routerState.matches()[c])}))}return t.splice(r.length).forEach(c=>c()),l&&i?l:(n=a[0],a)}));return ke(()=>s()&&n)()}const ke=e=>()=>A(ze,{get when(){return e()},keyed:!0,children:t=>A(Se.Provider,{value:t,get children(){return t.outlet()}})}),H=e=>{const t=Ae(()=>e.children);return ge(e,{get children(){return t()}})};function hn([e,t],n,s){return[e,r=>t(s(r))]}function mn(e){let t=!1;const n=r=>typeof r=="string"?{value:r}:r,s=hn(k(n(e.get()),{equals:(r,o)=>r.value===o.value&&r.state===o.state}),void 0,r=>(!t&&e.set(r),r));return e.init&&De(e.init((r=e.get())=>{t=!0,s[1](n(r)),t=!1})),un({signal:s,create:e.create,utils:e.utils})}function gn(e,t,n){return e.addEventListener(t,n),()=>e.removeEventListener(t,n)}function pn(e,t){const n=e&&document.getElementById(e);n?n.scrollIntoView():t&&window.scrollTo(0,0)}const yn=new Map;function bn(e=!0,t=!1,n="/_server",s){return r=>{const o=r.base.path(),l=r.navigatorFactory(r.base);let i,a;function c(h){return h.namespaceURI==="http://www.w3.org/2000/svg"}function u(h){if(h.defaultPrevented||h.button!==0||h.metaKey||h.altKey||h.ctrlKey||h.shiftKey)return;const g=h.composedPath().find(K=>K instanceof Node&&K.nodeName.toUpperCase()==="A");if(!g||t&&!g.hasAttribute("link"))return;const E=c(g),P=E?g.href.baseVal:g.href;if((E?g.target.baseVal:g.target)||!P&&!g.hasAttribute("state"))return;const x=(g.getAttribute("rel")||"").split(/\s+/);if(g.hasAttribute("download")||x&&x.includes("external"))return;const N=E?new URL(P,document.baseURI):new URL(P);if(!(N.origin!==window.location.origin||o&&N.pathname&&!N.pathname.toLowerCase().startsWith(o.toLowerCase())))return[g,N]}function d(h){const g=u(h);if(!g)return;const[E,P]=g,T=r.parsePath(P.pathname+P.search+P.hash),x=E.getAttribute("state");h.preventDefault(),l(T,{resolve:!1,replace:E.hasAttribute("replace"),scroll:!E.hasAttribute("noscroll"),state:x?JSON.parse(x):void 0})}function f(h){const g=u(h);if(!g)return;const[E,P]=g;r.preloadRoute(P,E.getAttribute("preload")!=="false")}function m(h){clearTimeout(i);const g=u(h);if(!g)return a=null;const[E,P]=g;a!==E&&(i=setTimeout(()=>{r.preloadRoute(P,E.getAttribute("preload")!=="false"),a=E},20))}function w(h){if(h.defaultPrevented)return;let g=h.submitter&&h.submitter.hasAttribute("formaction")?h.submitter.getAttribute("formaction"):h.target.getAttribute("action");if(!g)return;if(!g.startsWith("https://action/")){const P=new URL(g,Qe);if(g=r.parsePath(P.pathname+P.search),!g.startsWith(n))return}if(h.target.method.toUpperCase()!=="POST")throw new Error("Only POST forms are supported for Actions");const E=yn.get(g);if(E){h.preventDefault();const P=new FormData(h.target,h.submitter);E.call({r,f:h.target},h.target.enctype==="multipart/form-data"?P:new URLSearchParams(P))}}Je(["click","submit"]),document.addEventListener("click",d),e&&(document.addEventListener("mousemove",m,{passive:!0}),document.addEventListener("focusin",f,{passive:!0}),document.addEventListener("touchstart",f,{passive:!0})),document.addEventListener("submit",w),De(()=>{document.removeEventListener("click",d),e&&(document.removeEventListener("mousemove",m),document.removeEventListener("focusin",f),document.removeEventListener("touchstart",f)),document.removeEventListener("submit",w)})}}function wn(e){const t=e.replace(/^.*?#/,"");if(!t.startsWith("/")){const[,n="/"]=window.location.hash.split("#",2);return`${n}#${t}`}return t}function vn(e){const t=()=>window.location.hash.slice(1),n=Ze();return mn({get:t,set({value:s,replace:r,scroll:o,state:l}){r?window.history.replaceState(Vt(l),"","#"+s):window.history.pushState(l,"","#"+s);const i=s.indexOf("#"),a=i>=0?s.slice(i+1):"";pn(a,o),Pe()},init:s=>gn(window,"hashchange",Ht(s,r=>!n.confirm(r&&r<0?r:t()))),create:bn(e.preload,e.explicitLinks,e.actionBase),utils:{go:s=>window.history.go(s),renderPath:s=>`#${s}`,parsePath:wn,beforeLeave:n}})(e)}var An=U("<a>");function J(e){e=ge({inactiveClass:"inactive",activeClass:"active"},e);const[,t]=Et(e,["href","state","class","activeClass","inactiveClass","end"]),n=en(()=>e.href),s=tn(n),r=nn(),o=S(()=>{const l=n();if(l===void 0)return[!1,!1];const i=F(l.split(/[?#]/,1)[0]).toLowerCase(),a=decodeURI(F(r.pathname).toLowerCase());return[e.end?i===a:a.startsWith(i+"/")||a===i,i===a]});return(()=>{var l=An();return It(l,ge(t,{get href(){return s()||e.href},get state(){return JSON.stringify(e.state)},get classList(){return{...e.class&&{[e.class]:!0},[e.inactiveClass]:!o()[0],[e.activeClass]:o()[0],...t.classList}},link:"",get"aria-current"(){return o()[1]?"page":void 0}}),!1),l})()}const $e=class $e{static add(t,n){try{const s=Object.entries(n).map(([r,o])=>`${this.camelToKebab(r)}: ${o};`).join(" ");this.styleSheet.insertRule(`${t} { ${s} }`,this.styleSheet.cssRules.length)}catch(s){console.error(s)}}static camelToKebab(t){return t.replace(/[A-Z]/g,n=>`-${n.toLowerCase()}`)}};$e.styleSheet=(()=>{const t=document.createElement("style");return document.head.appendChild(t),t.sheet})();let se=$e,it={welcome:"Welcome",menu_home:"Home",menu_form_editor:"Form Editor",menu_tests:"Tests",menu_about:"About"},En={...it,welcome:"Bienvenue",menu_home:"Accueil",menu_form_editor:"Éditeur de formulaire",menu_tests:"Tests",menu_about:"À propos"},Le=navigator.language.toLowerCase().startsWith("fr")?"fr":"en",Z=Le=="fr"?En:it;document.documentElement.setAttribute("lang",Le);console.log("Language:",Le);var Pn=U("<nav class=main-nav>");se.add("nav.main-nav",{padding:"5px"});se.add("nav.main-nav > A",{margin:"5px"});function Y(){return(()=>{var e=Pn();return $(e,A(J,{href:"/",activeClass:"active",get children(){return Z.menu_home}}),null),$(e,A(J,{href:"/form-editor",get children(){return Z.menu_form_editor}}),null),$(e,A(J,{href:"/tests",get children(){return Z.menu_tests}}),null),$(e,A(J,{href:"/about",get children(){return Z.menu_about}}),null),e})()}var Sn=U("<div class=container><h1>Formulaire Bleu</h1><p>Formulaire Bleu est une librairie de formulaires qui vous permet de créer des formulaires pour vos pages web ou vos applications Google Apps en toute simplicité. Avec Formulaire Bleu, vous prenez soin à la fois du créateur du formulaire et de ses utilisateurs.");function Cn(){return(()=>{var e=Sn(),t=e.firstChild;return $(e,A(Y,{}),t),e})()}var Ln=U("<div class=container><h1>A propos de Formulaire Bleu</h1><p>Formulaire bleu est développé par Pascal GANAYE</p><p>Formulaire Bleu ne stocke pas vos données sur des serveurs externes. Vos formulaires et leurs données résident sur votre propre fichier Google Docs ou sur votre serveur.</p><p>Formulaire Bleu est entièrement gratuit et open source. Distribué sur <a href=https://github.com/paganaye/formulairebleu>github.com</a> sous une licence permissive (MIT License), il vous permet de l'utiliser, de le modifier et de le redistribuer librement, que ce soit dans des projets personnels ou commerciaux.</p><p>Si vous avez une suggestion d’amélioration, si vous rencontrez un bug ou si vous souhaitez me contacter, veuillez <a href=https://github.com/paganaye/formulairebleu/issues/new>créer un ticket");function $n(){return(()=>{var e=Ln(),t=e.firstChild;return $(e,A(Y,{}),t),e})()}var xn=U("<div class=container><h1>Éditeur de formulaire");function On(){return(()=>{var e=xn(),t=e.firstChild;return $(e,A(Y,{}),t),e})()}var _n=U("<div class=container><h1>Cette page n'existe pas");function Rn(){return(()=>{var e=_n(),t=e.firstChild;return $(e,A(Y,{}),t),e})()}const Tn="modulepreload",Nn=function(e,t){return new URL(e,t).href},Be={},jn=function(t,n,s){let r=Promise.resolve();if(n&&n.length>0){const l=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),a=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));r=Promise.allSettled(n.map(c=>{if(c=Nn(c,s),c in Be)return;Be[c]=!0;const u=c.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(!!s)for(let w=l.length-1;w>=0;w--){const h=l[w];if(h.href===c&&(!u||h.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${d}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":Tn,u||(m.as="script"),m.crossOrigin="",m.href=c,a&&m.setAttribute("nonce",a),document.head.appendChild(m),u)return new Promise((w,h)=>{m.addEventListener("load",w),m.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(l){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=l,window.dispatchEvent(i),!i.defaultPrevented)throw l}return r.then(l=>{for(const i of l||[])i.status==="rejected"&&o(i.reason);return t().catch(o)})};var kn=U("<div class=container><h1>Tests</h1><div>Cette page utilise la version <!> de la librairie Formulaire Bleu.<p class=error>");function Bn(){let[e,t]=k("..."),[n,s]=k("");return(async()=>{try{let r=await jn(()=>import("./package-BUdwH1e3.js"),[],import.meta.url);t(r.version)}catch(r){t(r.message)}})(),(()=>{var r=kn(),o=r.firstChild,l=o.nextSibling,i=l.firstChild,a=i.nextSibling,c=a.nextSibling,u=c.nextSibling;return $(r,A(Y,{}),o),$(l,e,a),$(u,n),r})()}function Fn(){function e(){const n=document.createElement("div");n.className="container",document.body.appendChild(n);const s=window.getComputedStyle(n).marginLeft!=="0px";return document.body.removeChild(n),s}function t(){return typeof window.bootstrap<"u"}if(!e()){const n=document.createElement("link");n.href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",n.rel="stylesheet",n.integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",n.crossOrigin="anonymous",document.head.appendChild(n)}if(!t()){const n=document.createElement("script");n.src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",n.integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",n.crossOrigin="anonymous",n.defer=!0,document.body.appendChild(n),n.onload=s=>setTimeout(()=>{console.log("loaded")})}console.log("Bootstrap loaded")}Fn();function In(){return A(vn,{get children(){return[A(H,{path:"/",component:Cn}),A(H,{path:"/about",component:$n}),A(H,{path:"/form-editor",component:On}),A(H,{path:"/tests",component:Bn}),A(H,{path:"*404",component:Rn})]}})}const Un=document.getElementById("root");Tt(()=>A(In,{}),Un);
