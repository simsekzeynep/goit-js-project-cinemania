const modal = document.querySelector('#team-modal');
const openBtn = document.querySelector('.footer-team-button');
const closeBtn = document.querySelector('.team-modal__close');

if (modal && openBtn) {
  openBtn.addEventListener('click', () => {
    modal.showModal();
  });

  closeBtn.addEventListener('click', () => {
    modal.close();
  });

  modal.addEventListener('click', event => {
    if (event.target === modal) modal.close();
  });
}
