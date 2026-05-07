import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const carousel = document.createElement('div');
  carousel.classList.add('cards-customer-carousel');

  const track = document.createElement('div');
  track.classList.add('cards-customer-track');

  rows.forEach((row) => {
    const cols = [...row.children];
    const card = document.createElement('div');
    card.classList.add('cards-customer-card');

    cols.forEach((col, i) => {
      if (i === 0) col.classList.add('cards-customer-image');
      else if (i === 1) col.classList.add('cards-customer-logo');
      else if (i === 2) col.classList.add('cards-customer-content');
      else if (i === 3) col.classList.add('cards-customer-meta');
      card.append(col);
    });

    track.append(card);
    row.remove();
  });

  carousel.append(track);

  // Optimize images
  carousel.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  // Navigation buttons
  const nav = document.createElement('div');
  nav.classList.add('cards-customer-nav');
  nav.innerHTML = '<button class="cards-customer-prev" aria-label="Previous">&lt;</button><button class="cards-customer-next" aria-label="Next">&gt;</button>';
  carousel.append(nav);

  // Carousel behavior
  const prevBtn = nav.querySelector('.cards-customer-prev');
  const nextBtn = nav.querySelector('.cards-customer-next');
  let currentIndex = 0;

  function updateCarousel() {
    const cards = track.querySelectorAll('.cards-customer-card');
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= cards.length - 1;
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    const cards = track.querySelectorAll('.cards-customer-card');
    if (currentIndex < cards.length - 1) {
      currentIndex += 1;
      updateCarousel();
    }
  });

  block.replaceChildren(carousel);
  updateCarousel();
}
