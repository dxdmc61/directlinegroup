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
  nav.innerHTML = `
    <button class="cards-customer-prev" aria-label="Previous slide">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="cards-customer-next" aria-label="Next slide">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  `;
  carousel.append(nav);

  // Dots indicator
  const cards = track.querySelectorAll('.cards-customer-card');
  const dots = document.createElement('div');
  dots.classList.add('cards-customer-dots');
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('cards-customer-dot');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dots.append(dot);
  });
  carousel.append(dots);

  // Carousel behavior
  const prevBtn = nav.querySelector('.cards-customer-prev');
  const nextBtn = nav.querySelector('.cards-customer-next');
  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= cards.length - 1;
    dots.querySelectorAll('.cards-customer-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex += 1;
      updateCarousel();
    }
  });

  dots.querySelectorAll('.cards-customer-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateCarousel();
    });
  });

  block.replaceChildren(carousel);
  updateCarousel();
}
