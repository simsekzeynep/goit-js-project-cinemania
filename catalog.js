import{a as $,s as _,h as q,b as I,c as x,o as M}from"./assets/main-DpvR5aMy.js";import"./assets/vendor-D5rSzIS2.js";const D="https://image.tmdb.org/t/p/w500",B="https://image.tmdb.org/t/p/original",R=1900,T=document.querySelector("#catalogSearchForm"),i=document.querySelector("#catalogSearchInput"),y=document.querySelector("#catalogClearBtn"),S=document.querySelector("#catalogYearSelect"),l=document.querySelector("#catalogList"),g=document.querySelector("#catalogMessage"),s=document.querySelector("#catalogPagination"),f=document.querySelector("#catalogHero"),b=document.querySelector("#catalogHeroContent"),Y=document.querySelector("#catalogHeroTitle"),P=document.querySelector("#catalogHeroRating"),A=document.querySelector("#catalogHeroDescription"),u=document.querySelector("#catalogHeroMessage"),N=document.querySelector("#catalogHeroDetailsBtn");let h=[],o=1,c="",p="",d=null;function F(){const t=new Date().getFullYear();for(let e=t;e>=R;e-=1){const a=document.createElement("option");a.value=e,a.textContent=e,S.append(a)}}function v(){const t=i.value.trim()==="";y.classList.toggle("is-hidden",t)}function U(){i.value="",y.classList.add("is-hidden"),i.focus()}function G(t=[]){return t.map(e=>{var a;return(a=h.find(n=>n.id===e))==null?void 0:a.name}).filter(Boolean).slice(0,2).join(", ")}function K(t){return t?t.slice(0,4):"Unknown"}function C(t){return typeof t=="number"?t.toFixed(1):"0.0"}function O(t){if(!t){d=null,b.hidden=!0,u.hidden=!1,u.textContent="We are sorry, but we could not find a movie for today.",f.style.backgroundImage="none";return}d=t.id,u.hidden=!0,b.hidden=!1,Y.textContent=t.title||"Unknown movie",A.textContent=t.overview||"No description available.",P.textContent=`★ ${C(t.vote_average)}`,f.style.backgroundImage=t.backdrop_path?`url("${B}${t.backdrop_path}")`:"none"}function j(t){if(!(t!=null&&t.length))return null;const e=new Date,a=new Date(e.getFullYear(),0,0),r=Math.floor((e-a)/864e5)%t.length;return t[r]}function V(t){const e=t.poster_path?`${D}${t.poster_path}`:"",a=G(t.genre_ids),n=K(t.release_date),r=C(t.vote_average),w=`catalog-movie-title-${t.id}`;return`
    <li
      class="catalog-card"
      data-id="${t.id}"
      tabindex="0"
      role="button"
      aria-labelledby="${w}"
    >
      <div class="catalog-card-image-wrapper">

        ${e?`
              <img
                class="catalog-card-image"
                src="${e}"
                alt="${t.title}"
                loading="lazy"
              />
            `:`
              <div class="catalog-card-no-image">
                Poster unavailable
              </div>
            `}

        <div class="catalog-card-overlay">

          <div class="catalog-card-info">

            <h2
              class="catalog-card-title"
              id="${w}"
            >
              ${t.title}
            </h2>

            <p class="catalog-card-meta">
              ${a||"Unknown"} | ${n}
            </p>

          </div>

          <p class="catalog-card-rating">
            ${r}
          </p>

        </div>
      </div>
    </li>
  `}function H(t){l.innerHTML="",s.innerHTML="",g.textContent=t,g.hidden=!1}function W(t){if(!(t!=null&&t.length)){H("We are sorry, but we could not find any results.");return}g.hidden=!0,l.innerHTML=t.map(V).join("")}function z(t){const e=document.createElement("button");return e.type="button",e.textContent=t,e.dataset.page=t,t===o&&e.classList.add("is-active"),e}function Q(t,e){if(o=t,s.innerHTML="",e<=1)return;const a=Math.max(1,o-2),n=Math.min(e,o+2);for(let r=a;r<=n;r+=1)s.append(z(r))}async function L(t,e,a={}){_();try{const n=await t();W(n.results),Q(n.page,n.total_pages),a.updateHero&&O(j(n.results))}catch{H(e)}finally{q()}}function m(t=1){return L(()=>I(t),"Something went wrong while loading movies.",{updateHero:t===1})}function k(t,e,a=1){return L(()=>x(t,e,a),"Something went wrong while searching movies.")}function E(t){if(!t)return;const e=Number(t.dataset.id);M(e)}function J(t){const e=t.target.closest(".catalog-card");E(e)}function X(t){const e=t.target.closest(".catalog-card");!e||!(t.key==="Enter"||t.key===" ")||(t.preventDefault(),E(e))}async function Z(t){if(t.preventDefault(),c=i.value.trim(),p=S.value,o=1,!c){await m(1);return}await k(c,p,o)}function tt(){d&&M(d)}async function et(t){const e=t.target.closest("button");e&&(o=Number(e.dataset.page),c?await k(c,p,o):await m(o),window.scrollTo({top:f.offsetHeight,behavior:"smooth"}))}function at(){i.addEventListener("input",v),y.addEventListener("click",U),T.addEventListener("submit",Z),l.addEventListener("click",J),l.addEventListener("keydown",X),N.addEventListener("click",tt),s.addEventListener("click",et)}async function nt(){try{h=await $()}catch{h=[]}}async function ot(){F(),v(),at(),await nt(),await m()}ot();
//# sourceMappingURL=catalog.js.map
