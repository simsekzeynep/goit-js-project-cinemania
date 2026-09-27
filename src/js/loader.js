const loader = document.querySelector('#loader');

let activeRequests = 0;

export function showLoader() {
  activeRequests += 1;

  if (loader) {
    loader.hidden = false;
  }
}

export function hideLoader() {
  activeRequests = Math.max(0, activeRequests - 1);

  if (loader) {
    loader.hidden = activeRequests === 0;
  }
}