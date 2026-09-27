import{o as L,g as $,a as A}from"./assets/main-DpvR5aMy.js";import"./assets/teamModal-DAON_gtt.js";import"./assets/vendor-D5rSzIS2.js";const w="https://image.tmdb.org/t/p/w500",h=5,G={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};function n(e=""){return String(e).replace(/[&<>"']/g,t=>G[t])}function q(e){return e?String(e).slice(0,4):"Unknown"}function N(e){return Array.isArray(e.genres)?e.genres.map(t=>t==null?void 0:t.name).filter(Boolean).slice(0,2).join(", "):""}function T(e){const t=Number(e);return Number.isFinite(t)?Math.max(0,Math.min(h,Math.round(t/2))):0}function x(e){const t=T(e);return Array.from({length:h},(i,r)=>`
      <span
        class="movie-card__star ${r<t?"movie-card__star--filled":""}"
        aria-hidden="true"
      >
        ★
      </span>
    `).join("")}function R(e){const t=e.title||"Untitled movie",i=e.poster_path?`${w}${e.poster_path}`:"",r=N(e)||"Unknown",v=q(e.release_date),E=`${r} | ${v}`,y=Number(e.vote_average),k=Number.isFinite(y)?(y/2).toFixed(1):"0.0";return`
    <li
      class="movie-card"
      data-id="${n(e.id)}"
      tabindex="0"
      role="button"
      aria-haspopup="dialog"
      aria-label="${n(t)} — View details"
    >
      <div class="movie-card__media">
        ${i?`
              <img
                class="movie-card__image"
                src="${n(i)}"
                alt="${n(t)}"
                loading="lazy"
              />
            `:`
              <div class="movie-card__placeholder">
                Poster unavailable
              </div>
            `}

        <div class="movie-card__overlay">
          <div class="movie-card__info">
            <h2 class="movie-card__title">
              ${n(t)}
            </h2>

            <p class="movie-card__meta">
              ${n(E)}
            </p>
          </div>

          <div
            class="movie-card__rating"
            aria-label="${k} out of 5 stars"
          >
            ${x(e.vote_average)}
          </div>
        </div>
      </div>
    </li>
  `}const p=9,a=document.querySelector("#genreSelect"),F=document.querySelector(".custom-select__title"),d=document.querySelector(".custom-select__options"),c=document.querySelector(".custom-select__trigger"),b=document.querySelector(".library-filter"),s=document.querySelector("#libraryMoviesList"),S=document.querySelector(".library-empty"),u=document.querySelector("#loadMoreBtn"),g=document.querySelector("#movie-modal");let l="",m=p;function M(){const e=d.querySelectorAll("li[data-value]"),t=Array.from(e).find(i=>i.dataset.value===l);e.forEach(i=>{const r=i===t;i.classList.toggle("is-selected",r),i.setAttribute("aria-selected",String(r))}),F.textContent=(t==null?void 0:t.textContent.trim())||"Genre"}function _(e){d.innerHTML=`
    <li
      data-value=""
      role="option"
      tabindex="0"
      aria-selected="true"
    >
      All Genres
    </li>

    ${e.map(t=>`
          <li
            data-value="${t.id}"
            role="option"
            tabindex="0"
            aria-selected="false"
          >
            ${t.name}
          </li>
        `).join("")}
  `,M()}function B(e){return l?e.filter(t=>{var i;return(i=t.genres)==null?void 0:i.some(r=>String(r.id)===String(l))}):e}function C(){b.classList.add("is-hidden"),s.classList.add("is-hidden"),u.classList.add("is-hidden"),S.classList.remove("is-hidden")}function H(){b.classList.remove("is-hidden"),s.classList.remove("is-hidden"),S.classList.add("is-hidden")}function I(){s.innerHTML=`
    <li class="library-no-results">
      No movies found for this genre.
    </li>
  `,u.classList.add("is-hidden")}function O(e){const t=m<e;u.classList.toggle("is-hidden",!t)}function o(){const e=$();if(e.length===0){C();return}H();const t=B(e);if(t.length===0){I();return}const i=t.slice(0,m);s.innerHTML=i.map(R).join(""),O(t.length)}function U(){a.classList.add("is-open"),c.setAttribute("aria-expanded","true")}function f(e=!1){a.classList.remove("is-open"),c.setAttribute("aria-expanded","false"),e&&c.focus()}async function j(){try{const e=await A();_(Array.isArray(e)?e:[])}catch{_([])}}async function P(){await j(),o()}c.addEventListener("click",()=>{if(a.classList.contains("is-open")){f();return}U()});d.addEventListener("click",e=>{const t=e.target.closest("li[data-value]");t&&(l=t.dataset.value||"",m=p,M(),f(!0),o())});d.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const t=e.target.closest("li[data-value]");t&&(e.preventDefault(),t.click())});document.addEventListener("click",e=>{a.contains(e.target)||f()});document.addEventListener("keydown",e=>{e.key==="Escape"&&a.classList.contains("is-open")&&f(!0)});u.addEventListener("click",()=>{m+=p,o()});s.addEventListener("click",e=>{const t=e.target.closest(".movie-card");t&&L(Number(t.dataset.id))});s.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const t=e.target.closest(".movie-card");!t||e.repeat||(e.preventDefault(),L(Number(t.dataset.id)))});g==null||g.addEventListener("close",o);window.addEventListener("pageshow",o);P();
//# sourceMappingURL=library.js.map
