import"./assets/styles-gd6xVleH.js";import"./assets/main-2qJmFDgw.js";import{a as T,b as D,s as P,g as Y}from"./assets/tmdb-api-CbsiljfK.js";import"./assets/vendor-D5rSzIS2.js";const f=document.querySelector("#loader");function w(){f&&(f.hidden=!1)}function M(){f&&(f.hidden=!0)}const F="https://image.tmdb.org/t/p/w500",i=document.querySelector("#movie-modal"),A=document.querySelector(".movie-modal__close"),g=document.querySelector("#movie-poster"),N=document.querySelector("#movie-title"),R=document.querySelector("#movie-vote"),U=document.querySelector("#movie-votes"),G=document.querySelector("#movie-popularity"),j=document.querySelector("#movie-genre"),O=document.querySelector("#movie-overview"),C=document.querySelector("#library-btn");let H=null;i&&(A.addEventListener("click",()=>i.close()),i.addEventListener("click",t=>{t.target===i&&i.close()}),C.addEventListener("click",()=>{x(H)}));async function _(t){w();try{const e=await T(t);W(e),i.showModal()}catch(e){console.error("Film detaylari alinamadi:",e)}finally{M()}}function W(t){H=t,t.poster_path?(g.src=`${F}${t.poster_path}`,g.hidden=!1):g.hidden=!0,g.alt=t.title,N.textContent=t.title,R.textContent=t.vote_average.toFixed(1),U.textContent=t.vote_count,G.textContent=t.popularity.toFixed(1),j.textContent=t.genres.map(e=>e.name).join(" "),O.textContent=t.overview,x(t)}function z(t){return!1}function x(t){t&&(C.textContent=z(t.id)?"Remove from my library":"Add to my library")}const K="https://image.tmdb.org/t/p/w500",Q="https://image.tmdb.org/t/p/original",V=document.querySelector("#catalogSearchForm"),d=document.querySelector("#catalogSearchInput"),v=document.querySelector("#catalogClearBtn"),E=document.querySelector("#catalogYearSelect"),u=document.querySelector("#catalogList"),c=document.querySelector("#catalogMessage"),l=document.querySelector("#catalogPagination"),y=document.querySelector("#catalogHero"),q=document.querySelector("#catalogHeroContent"),J=document.querySelector("#catalogHeroTitle"),X=document.querySelector("#catalogHeroRating"),Z=document.querySelector("#catalogHeroDescription"),p=document.querySelector("#catalogHeroMessage"),tt=document.querySelector("#catalogHeroDetailsBtn");let S=[],a=1,h=0,s="",b="",m=null;function et(){const t=new Date().getFullYear(),e=1900;for(let n=t;n>=e;n-=1){const o=document.createElement("option");o.value=n,o.textContent=n,E.append(o)}}function k(){const t=d.value.trim()==="";v.classList.toggle("is-hidden",t)}function nt(t=[]){return t.map(e=>{var n;return(n=S.find(o=>o.id===e))==null?void 0:n.name}).filter(Boolean).slice(0,2).join(", ")}function ot(t){return t?t.slice(0,4):"Unknown"}function at(t){if(!t){m=null,q.hidden=!0,p.textContent="We are sorry, but we could not find a movie for today.",p.hidden=!1,y.style.backgroundImage="none";return}m=t.id,p.hidden=!0,q.hidden=!1,J.textContent=t.title||"Unknown movie",Z.textContent=t.overview||"No description available.";const e=typeof t.vote_average=="number"?t.vote_average.toFixed(1):"0.0";X.textContent=`★ ${e}`,t.backdrop_path?y.style.backgroundImage=`url("${Q}${t.backdrop_path}")`:y.style.backgroundImage="none"}function rt(t){if(!t||t.length===0)return null;const e=new Date,n=new Date(e.getFullYear(),0,0),r=Math.floor((e-n)/864e5)%t.length;return t[r]}function ct(t){const e=t.poster_path?`${K}${t.poster_path}`:"",n=nt(t.genre_ids),o=ot(t.release_date),r=typeof t.vote_average=="number"?t.vote_average.toFixed(1):"0.0";return`
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
              ${n||"Unknown"} | ${o}
            </p>

          </div>

          <p class="catalog-card-rating">
            ${r}
          </p>

        </div>
      </div>
    </li>
  `}function $(t){if(!t||t.length===0){u.innerHTML="",l.innerHTML="",c.textContent="We are sorry, but we could not find any results.",c.hidden=!1;return}c.hidden=!0,u.innerHTML=t.map(e=>ct(e)).join("")}function it(t){const e=document.createElement("button");return e.type="button",e.textContent=t,e.dataset.page=t,t===a&&e.classList.add("is-active"),e}function B(t,e){if(a=t,h=e,l.innerHTML="",h<=1)return;const n=Math.max(1,a-2),o=Math.min(h,a+2);for(let r=n;r<=o;r+=1)l.append(it(r))}async function L(t=1){w();try{const e=await D(t);if($(e.results),B(e.page,e.total_pages),t===1){const n=rt(e.results);at(n)}}catch{u.innerHTML="",l.innerHTML="",c.textContent="Something went wrong while loading movies.",c.hidden=!1}finally{M()}}async function I(t,e,n=1){w();try{const o=await P(t,e,n);$(o.results),B(o.page,o.total_pages)}catch{u.innerHTML="",l.innerHTML="",c.textContent="Something went wrong while searching movies.",c.hidden=!1}finally{M()}}d.addEventListener("input",k);v.addEventListener("click",()=>{d.value="",v.classList.add("is-hidden"),d.focus()});V.addEventListener("submit",async t=>{if(t.preventDefault(),s=d.value.trim(),b=E.value,a=1,!s){await L(1);return}await I(s,b,a)});u.addEventListener("click",t=>{const e=t.target.closest(".catalog-card");if(!e)return;const n=Number(e.dataset.id);_(n)});tt.addEventListener("click",()=>{m&&_(m)});l.addEventListener("click",async t=>{const e=t.target.closest("button");e&&(a=Number(e.dataset.page),s?await I(s,b,a):await L(a),window.scrollTo({top:y.offsetHeight,behavior:"smooth"}))});async function lt(){et(),k();try{S=await Y()}catch{S=[]}await L()}lt();
//# sourceMappingURL=catalog.js.map
