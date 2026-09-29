import { getMovieTrailer } from './tmdb-api.js';

const dialog = document.createElement('dialog');
dialog.className = 'movie-modal trailer-modal';
dialog.setAttribute('aria-label', 'Movie trailer');

const modalBox = document.createElement('div');
modalBox.className = 'movie-modal__box trailer-modal__box';

const closeButton = document.createElement('button');
closeButton.type = 'button';
closeButton.className = 'movie-modal__close trailer-modal__close';
closeButton.setAttribute('aria-label', 'Close trailer');

closeButton.innerHTML = `
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
`;

const content = document.createElement('div');
content.className = 'trailer-modal__content';
content.setAttribute('aria-live', 'polite');

modalBox.append(closeButton, content);
dialog.append(modalBox);
document.body.append(dialog);

let requestId = 0;
let previousOverflow = '';

function showMessage(message) {
  const paragraph = document.createElement('p');

  paragraph.className = 'trailer-modal__message';
  paragraph.textContent = message;

  content.replaceChildren(paragraph);
}

function createTrailerIframe(trailer) {
  const iframe = document.createElement('iframe');

  const videoKey = encodeURIComponent(trailer.key);

  const parameters = new URLSearchParams({
    autoplay: '1',
    controls: '1',
    fs: '1',
    rel: '0',
    iv_load_policy: '3',
    playsinline: '1',
  });

  iframe.className = 'trailer-modal__video';
  iframe.src = `https://www.youtube.com/embed/${videoKey}?${parameters.toString()}`;
  iframe.title = trailer.name || 'Movie trailer';

  iframe.allow =
    "autoplay; encrypted-media; fullscreen; picture-in-picture 'none'; web-share 'none'";

  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';

  return iframe;
}

function closeTrailerModal() {
  if (dialog.open) {
    dialog.close();
  }
}

closeButton.addEventListener('click', closeTrailerModal);

dialog.addEventListener('click', event => {
  if (event.target !== dialog) {
    return;
  }

  const bounds = modalBox.getBoundingClientRect();

  const isOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (isOutside) {
    closeTrailerModal();
  }
});

dialog.addEventListener('close', () => {
  requestId += 1;

  // iframe kaldırıldığında oynatma ve ses tamamen durur.
  content.replaceChildren();

  document.body.style.overflow = previousOverflow;
});

export async function openTrailerModal(movieId) {
  if (dialog.open) {
    return;
  }

  const currentRequest = ++requestId;

  showMessage('Loading trailer…');

  previousOverflow = document.body.style.overflow;

  dialog.showModal();
  document.body.style.overflow = 'hidden';

  closeButton.focus();

  try {
    const trailer = await getMovieTrailer(movieId);

    const isRequestObsolete =
      currentRequest !== requestId || !dialog.open;

    if (isRequestObsolete) {
      return;
    }

    if (!trailer?.key) {
      showMessage('Sorry, no trailer is available for this movie.');
      return;
    }

    const iframe = createTrailerIframe(trailer);

    content.replaceChildren(iframe);
  } catch {
    const isRequestObsolete =
      currentRequest !== requestId || !dialog.open;

    if (isRequestObsolete) {
      return;
    }

    showMessage('The trailer could not be loaded. Please try again later.');
  }
}