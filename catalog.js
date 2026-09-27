import{a as x,s as T,g as $}from"./assets/tmdb-api-DV4RryLi.js";import{o as M,s as b,h as H}from"./assets/main-CVX_Gtpg.js";import"./assets/vendor-D5rSzIS2.js";const k="https://image.tmdb.org/t/p/w500",E="https://image.tmdb.org/t/p/original",B=document.querySelector("#catalogSearchForm"),l=document.querySelector("#catalogSearchInput"),h=document.querySelector("#catalogClearBtn"),L=document.querySelector("#catalogYearSelect"),d=document.querySelector("#catalogList"),c=document.querySelector("#catalogMessage"),i=document.querySelector("#catalogPagination"),u=document.querySelector("#catalogHero"),w=document.querySelector("#catalogHeroContent"),I=document.querySelector("#catalogHeroTitle"),P=document.querySelector("#catalogHeroRating"),Y=document.querySelector("#catalogHeroDescription"),f=document.querySelector("#catalogHeroMessage"),D=document.querySelector("#catalogHeroDetailsBtn");let m=[],o=1,p=0,s="",y="",g=null;function N(){const t=new Date().getFullYear(),e=1900;for(let a=t;a>=e;a-=1){const n=document.createElement("option");n.value=a,n.textContent=a,L.append(n)}}function S(){const t=l.value.trim()==="";h.classList.toggle("is-hidden",t)}function F(t=[]){return t.map(e=>{var a;return(a=m.find(n=>n.id===e))==null?void 0:a.name}).filter(Boolean).slice(0,2).join(", ")}function R(t){return t?t.slice(0,4):"Unknown"}function U(t){if(!t){g=null,w.hidden=!0,f.textContent="We are sorry, but we could not find a movie for today.",f.hidden=!1,u.style.backgroundImage="none";return}g=t.id,f.hidden=!0,w.hidden=!1,I.textContent=t.title||"Unknown movie",Y.textContent=t.overview||"No description available.";const e=typeof t.vote_average=="number"?t.vote_average.toFixed(1):"0.0";P.textContent=`★ ${e}`,t.backdrop_path?u.style.backgroundImage=`url("${E}${t.backdrop_path}")`:u.style.backgroundImage="none"}function A(t){if(!t||t.length===0)return null;const e=new Date,a=new Date(e.getFullYear(),0,0),r=Math.floor((e-a)/864e5)%t.length;return t[r]}function G(t){const e=t.poster_path?`${k}${t.poster_path}`:"",a=F(t.genre_ids),n=R(t.release_date),r=typeof t.vote_average=="number"?t.vote_average.toFixed(1):"0.0";return`
    <li
      class="catalog-card"
      data-id="${t.id}"
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

            <h2 class="catalog-card-title">
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
  `}function C(t){if(!t||t.length===0){d.innerHTML="",i.innerHTML="",c.textContent="We are sorry, but we could not find any results.",c.hidden=!1;return}c.hidden=!0,d.innerHTML=t.map(e=>G(e)).join("")}function O(t){const e=document.createElement("button");return e.type="button",e.textContent=t,e.dataset.page=t,t===o&&e.classList.add("is-active"),e}function _(t,e){if(o=t,p=e,i.innerHTML="",p<=1)return;const a=Math.max(1,o-2),n=Math.min(p,o+2);for(let r=a;r<=n;r+=1)i.append(O(r))}async function v(t=1){b();try{const e=await x(t);if(C(e.results),_(e.page,e.total_pages),t===1){const a=A(e.results);U(a)}}catch{d.innerHTML="",i.innerHTML="",c.textContent="Something went wrong while loading movies.",c.hidden=!1}finally{H()}}async function q(t,e,a=1){b();try{const n=await T(t,e,a);C(n.results),_(n.page,n.total_pages)}catch{d.innerHTML="",i.innerHTML="",c.textContent="Something went wrong while searching movies.",c.hidden=!1}finally{H()}}l.addEventListener("input",S);h.addEventListener("click",()=>{l.value="",h.classList.add("is-hidden"),l.focus()});B.addEventListener("submit",async t=>{if(t.preventDefault(),s=l.value.trim(),y=L.value,o=1,!s){await v(1);return}await q(s,y,o)});d.addEventListener("click",t=>{const e=t.target.closest(".catalog-card");if(!e)return;const a=Number(e.dataset.id);M(a)});D.addEventListener("click",()=>{g&&M(g)});i.addEventListener("click",async t=>{const e=t.target.closest("button");e&&(o=Number(e.dataset.page),s?await q(s,y,o):await v(o),window.scrollTo({top:u.offsetHeight,behavior:"smooth"}))});async function j(){N(),S();try{m=await $()}catch{m=[]}await v()}j();
//# sourceMappingURL=catalog.js.map
