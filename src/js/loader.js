const loader = document.querySelector('#loader');

export function showLoader() {
  if (loader) loader.hidden = false;
}

export function hideLoader() {
  if (loader) loader.hidden = true;
}
