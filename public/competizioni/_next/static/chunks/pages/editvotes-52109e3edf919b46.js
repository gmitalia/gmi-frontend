(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[714],{8025:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/editvotes",function(){return t(9630)}])},8040:function(e,n,t){"use strict";t.d(n,{Z:function(){return s}});var r=t(5893);t(7294);function s(e){var n=e.disabled||!1;return(0,r.jsx)("button",{disabled:n,className:"".concat(e.className," inline-block px-6 py-2.5 bg-primary text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-secondary hover:shadow-lg focus:bg-secondary focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out disabled:cursor-not-allowed disabled:bg-gray-700 disabled:opacity-20"),onClick:null===e||void 0===e?void 0:e.onClick,children:e.children})}},9630:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return y}});var r=t(5893),s=t(6042);function o(e,n){return n=null!=n?n:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):function(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})),e}var i=t(797),a=t(7294),c=t(1163),l=t(7288),u=t(5684),d=t(8040),m=function(e){return e.length>3},f=function(e){return e.length>3},h=function(e,n){return e.length+n.length<2};function p(e){var n=function(e){o(Math.max(0,Math.min(100,e.target.value))),C(!1)},t=(0,a.useState)(e.score),s=t[0],o=t[1],c=(0,a.useState)(e.pros),l=c[0],p=c[1],v=(0,a.useState)(e.cons),g=v[0],x=v[1],b=(0,a.useState)(e.comment),j=b[0],y=b[1],N=(0,a.useState)(e.voted),w=N[0],O=N[1],S=(0,a.useState)(!0),_=S[0],C=S[1],Z=(0,a.useState)(null),A=Z[0],I=Z[1],k=u.prosList.map((function(e,n){return(0,r.jsx)("option",{value:n,children:e},n)})),P=l.map((function(e,n){return(0,r.jsxs)("div",{className:"m-2 border-b",children:[(0,r.jsx)("select",{type:"button",value:e,onChange:function(e){return function(e,n){var t=(0,i.Z)(l);t[n]=e.target.value,p(t),C(!1)}(e,n)},children:k}),(0,r.jsx)("input",{className:"px-3",type:"button",value:" X ",onClick:function(){return function(e){var n=(0,i.Z)(l);n.splice(e,1),p(n),C(!1)}(n)}})]},n)})),E=u.consList.map((function(e,n){return(0,r.jsx)("option",{value:n,children:e},n)})),D=g.map((function(e,n){return(0,r.jsxs)("div",{className:"m-2 border-b",children:[(0,r.jsx)("select",{type:"button",value:e,onChange:function(e){return function(e,n){var t=(0,i.Z)(g);t[n]=e.target.value,x(t),C(!1)}(e,n)},children:E}),(0,r.jsx)("input",{type:"button",value:" X ",onClick:function(){return function(e){var n=(0,i.Z)(g);n.splice(e,1),x(n),C(!1)}(n)}})]},n)})),L=w?"":(0,r.jsx)("div",{className:"h5",children:"DA VOTARE"});return(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{className:"my-3",children:L}),(0,r.jsxs)("div",{className:"my-3",children:[(0,r.jsx)("label",{className:"h6",children:"Voto"}),(0,r.jsxs)("div",{children:[(0,r.jsx)("input",{type:"number",className:"pl-2 border",min:"0",max:"100",value:s,onChange:n}),(0,r.jsx)("input",{type:"range",className:"ml-3",min:"0",max:"100",value:s,onChange:n})]})]}),(0,r.jsxs)("div",{className:"my-3",children:[(0,r.jsx)("div",{className:"h6",children:"Commento"}),(0,r.jsx)("textarea",{className:"p-3 border w-full",defaultValue:j,onChange:function(e){y(e.target.value),C(!1)},rows:8})]}),(0,r.jsxs)("div",{className:"my-3 flex flex-row",children:[(0,r.jsxs)("div",{className:"border p-2 mb-2 mr-2",children:[(0,r.jsxs)("div",{className:"flex flex-col grow",children:[(0,r.jsx)("div",{className:"h6",children:"Pro"}),P]}),(0,r.jsx)(d.Z,{disabled:_,onClick:function(){l.length>=3||(p((0,i.Z)(l).concat([0])),C(!1))},children:(0,r.jsx)("i",{className:"fa fa-plus fa-1x"})})]}),(0,r.jsxs)("div",{className:"border p-2 mb-2 ml-2",children:[(0,r.jsxs)("div",{className:"flex flex-col",children:[(0,r.jsx)("div",{className:"h6",children:"Contro"}),D]}),(0,r.jsx)(d.Z,{disabled:_,onClick:function(){g.length>=3||(x((0,i.Z)(g).concat([0])),C(!1))},children:(0,r.jsx)("i",{className:"fa fa-plus fa-1x"})})]})]}),(0,r.jsx)("div",{className:"my-3 row",children:(0,r.jsxs)("div",{children:[(0,r.jsx)(d.Z,{disabled:_,onClick:function(){O(!0);var n={score:s,pros:l,cons:g,comment:j,game_id:e.game_id,voted:w};if(0==function(e){e.score;var n=e.pros,t=e.cons;return e.comment,e.voted,I(void 0),h(n,t)?(I("Inserire almeno 2 pro/contro"),!1):m(n)?(I("impossibile inserire pi\xf9 di 3 pro"),!1):!f(t)||(I("impossibile inserire pi\xf9 di 3 contro"),!1)}(n))return null;e.onChange(n,e.index,(function(e){return C(e)}))},children:"Salva"}),(0,r.jsx)("span",{class:"ml-3",style:{color:"green"},children:_&&"Salvato"}),(0,r.jsx)("span",{class:"ml-3",style:{color:"red"},children:A})]})})]})}var v=t(9871),g=t(8764).lW;function x(e){var n=function(e,n,r){var s=(0,i.Z)(w);s[n]=e,O(s),t(e,r)},t=function(e,n){v.Z.getInstance().setVote(m.contest,e,(function(e){n(e.success),e.success||C(e.error)}))},u=(0,c.useRouter)(),m=(0,l.getQuery)(u),f=(0,a.useState)(!1),h=f[0],x=f[1],b=(0,a.useState)(),j=b[0],y=b[1],N=(0,a.useState)(),w=N[0],O=N[1],S=(0,a.useState)(),_=S[0],C=S[1];(0,a.useEffect)((function(){v.Z.getInstance().getGames(m.contest,(function(e){return y(e.games)}))}),[m.contest]),(0,a.useEffect)((function(){j&&v.Z.getInstance().getVotes(m.contest,null,(function(e){var n=function(n){var r=j[n].id,s=e.votes.findIndex((function(e){return e.game_id===r}));if(s>=0){var o=e.votes[s];o.pros=JSON.parse(o.pros),o.cons=JSON.parse(o.cons),Array.isArray(o.pros)||(o.pros=[]),Array.isArray(o.cons)||(o.cons=[]),o.voted=!0,t[n]=o}else t[n]={game_id:j[n].id,score:0,comment:"",pros:[],cons:[],voted:!1}};if(!e.success)return C(e.error),void console.error(e.error);for(var t=new Array(j.length),r=0;r<t.length;r++)n(r);O(t),x(!0),console.debug("received games and votes",j,t)}))}),[j,m.contest]);var Z="Loading",A="Loading";return _?(A=_,Z=""):h&&(Z=w.map((function(e,n){return{game:j[n],vote:w[n]}})).sort((function(e,n){return parseInt(n.vote.score)-parseInt(e.vote.score)})).map((function(e,n){return(0,r.jsxs)("li",{children:[(0,r.jsx)("b",{children:e.vote.score})," ",e.game.name,"  "]})})),A=j.map((function(e,t){var i=w[t],a="";try{a=g.from(e.authors,"base64").toString("ascii"),a=(a=JSON.parse(a)).map((function(e){return(0,r.jsx)("input",{type:"button",value:e.name},e.id)}))}catch(l){console.error(e.authors,l)}var c=v.Z.getInstance().imageURL+"/thumbnail.png";return e.image_url&&(c=e.image_url.indexOf("http")>=0?e.image_url:v.Z.getInstance().imageURL+e.image_url+"?"+Date.now().toString()),(0,r.jsx)("div",{className:"shadow border p-3 mb-3",children:(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{className:"div-image",children:(0,r.jsx)("img",{className:"image-centered h-60",alt:"",src:c,layout:"fill",objectfit:"cover"})}),(0,r.jsxs)("div",{className:"",children:[(0,r.jsxs)("p",{children:[(0,r.jsx)("b",{children:e.name})," ",(0,r.jsxs)("span",{className:"author",children:[" di ",a]})]}),(0,r.jsx)("p",{children:e.short_description}),(0,r.jsxs)("p",{children:[(0,r.jsx)("b",{children:"Download"}),": ",(0,r.jsx)("a",{href:e.download_url,children:e.download_url})]})]}),(0,r.jsx)(p,o((0,s.Z)({},i),{onChange:n,index:t}))]})},e.id)}))),(0,r.jsxs)("div",{className:"shadow border p-3",children:[(0,r.jsx)("b",{children:"Votazione"}),A,(0,r.jsx)("br",{}),(0,r.jsx)("hr",{}),(0,r.jsx)("b",{children:"La tua classifica"}),(0,r.jsx)("ul",{children:Z}),(0,r.jsx)("br",{}),(0,r.jsx)(d.Z,{onClick:function(){return u.push("/contest?contest="+m.contest)},children:"Indietro"})]})}var b=t(9008),j=t.n(b);function y(){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(j(),{children:(0,r.jsx)("title",{children:"Edit Votes"})}),(0,r.jsx)(x,{})]})}},7288:function(e){"use strict";var n=["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];e.exports={getQuery:function(e){var n=e.asPath.lastIndexOf("?"),t=e.asPath.substring(n+1);return Object.fromEntries(new URLSearchParams(t))},getItalianDate:function(e){return e.getDate()+" "+n[e.getMonth()]}}},797:function(e,n,t){"use strict";function r(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function s(e){return function(e){if(Array.isArray(e))return r(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,n){if(e){if("string"===typeof e)return r(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(t):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?r(e,n):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}t.d(n,{Z:function(){return s}})}},function(e){e.O(0,[764,774,888,179],(function(){return n=8025,e(e.s=n);var n}));var n=e.O();_N_E=n}]);