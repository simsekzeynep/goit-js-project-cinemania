import { getMovieTrailer } from './tmdb-api.js';

const dialog = document.createElement('dialog');
dialog.className = 'trailer-modal';
dialog.setAttribute('aria-labelledby', 'trailer-modal-title');

const heading = document.createElement('h2');
heading.id = 'trailer-modal-title';
heading.className = 'trailer-modal-title';
heading.textContent = 'Movie trailer';

const closeButton = document.createElement('button');
closeButton.type = 'button';
closeButton.className = 'trailer-modal-close';
closeButton.textContent = '×';
closeButton.setAttribute('aria-label', 'Close trailer');

const content = document.createElement('div');
content.className = 'trailer-modal-content';
content.setAttribute('aria-live', 'polite');

dialog.append(heading, closeButton, content);
document.body.append(dialog);

let requestId = 0;
let previousOverflow = '';

function showMessage(message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  content.replaceChildren(paragraph);
}

closeButton.addEventListener('click', () => dialog.close());

dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();

  const isOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (event.target === dialog && isOutside) {
    dialog.close();
  }
});

// Escape ile kapatıldığında da çalışır.
dialog.addEventListener('close', () => {
  requestId += 1;

  // Videoyu kaldırarak oynatmayı ve sesi durdur.
  content.replaceChildren();
  document.body.style.overflow = previousOverflow;
});

export async function openTrailerModal(movieId) {
  if (dialog.open) return;

  const currentRequest = ++requestId;

  heading.textContent = 'Movie trailer';
  showMessage('Loading trailer…');

  previousOverflow = document.body.style.overflow;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  closeButton.focus();

  try {
    const trailer = await getMovieTrailer(movieId);

    // Pencere kapatıldıysa eski isteğin sonucunu gösterme.
    if (currentRequest !== requestId || !dialog.open) return;

    if (!trailer?.key) {
      showMessage('Sorry, no trailer is available for this movie.');
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.className = 'trailer-modal-video';
    iframe.src =
      `https://www.youtube.com/embed/${encodeURIComponent(trailer.key)}`;
    iframe.title = trailer.name || 'Movie trailer';
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';

    const youtubeLink = document.createElement('a');
    youtubeLink.className = 'trailer-youtube-link';
    youtubeLink.href =
      `https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`;
    youtubeLink.target = '_blank';
    youtubeLink.rel = 'noopener noreferrer';
    youtubeLink.textContent = 'Watch on YouTube';

    content.replaceChildren(iframe, youtubeLink);
  } catch {
    if (currentRequest !== requestId || !dialog.open) return;

    showMessage(
      'The trailer could not be loaded. Please try again later.'
    );
  }
}