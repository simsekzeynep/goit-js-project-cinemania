import{o as p,g as b,c as h,a as E}from"./assets/main-DFP32JwT.js";import"./assets/team-modal-DAON_gtt.js";import"./assets/vendor-D5rSzIS2.js";const m=9,s=document.querySelector("#genreSelect"),M=document.querySelector(".custom-select__title"),d=document.querySelector(".custom-select__options"),a=document.querySelector(".custom-select__trigger"),g=document.querySelector(".library-filter"),i=document.querySelector("#libraryMoviesList"),v=document.querySelector(".library-empty"),l=document.querySelector("#loadMoreBtn"),y=document.querySelector("#movie-modal");let c="",u=m;function S(){const e=d.querySelectorAll("li[data-value]"),t=Array.from(e).find(n=>n.dataset.value===c);e.forEach(n=>{const o=n===t;n.classList.toggle("is-selected",o),n.setAttribute("aria-selected",String(o))}),M.textContent=(t==null?void 0:t.textContent.trim())||"Genre"}function L(e){d.innerHTML=`
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
  `,S()}function k(e){return c?e.filter(t=>{var n;return(n=t.genres)==null?void 0:n.some(o=>String(o.id)===String(c))}):e}function w(){g.classList.add("is-hidden"),i.classList.add("is-hidden"),l.classList.add("is-hidden"),v.classList.remove("is-hidden")}function q(){g.classList.remove("is-hidden"),i.classList.remove("is-hidden"),v.classList.add("is-hidden")}function G(){i.innerHTML=`
    <li class="library-no-results">
      No movies found for this genre.
    </li>
  `,l.classList.add("is-hidden")}function A(e){const t=u<e;l.classList.toggle("is-hidden",!t)}function r(){const e=b();if(e.length===0){w();return}q();const t=k(e);if(t.length===0){G();return}const n=t.slice(0,u);i.innerHTML=n.map(h).join(""),A(t.length)}function _(){s.classList.add("is-open"),a.setAttribute("aria-expanded","true")}function f(e=!1){s.classList.remove("is-open"),a.setAttribute("aria-expanded","false"),e&&a.focus()}async function x(){try{const e=await E();L(Array.isArray(e)?e:[])}catch{L([])}}async function T(){await x(),r()}a.addEventListener("click",()=>{if(s.classList.contains("is-open")){f();return}_()});d.addEventListener("click",e=>{const t=e.target.closest("li[data-value]");t&&(c=t.dataset.value||"",u=m,S(),f(!0),r())});d.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const t=e.target.closest("li[data-value]");t&&(e.preventDefault(),t.click())});document.addEventListener("click",e=>{s.contains(e.target)||f()});document.addEventListener("keydown",e=>{e.key==="Escape"&&s.classList.contains("is-open")&&f(!0)});l.addEventListener("click",()=>{u+=m,r()});i.addEventListener("click",e=>{const t=e.target.closest(".movie-card");t&&p(Number(t.dataset.id))});i.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const t=e.target.closest(".movie-card");!t||e.repeat||(e.preventDefault(),p(Number(t.dataset.id)))});y==null||y.addEventListener("close",r);window.addEventListener("pageshow",r);T();
//# sourceMappingURL=library.js.map
