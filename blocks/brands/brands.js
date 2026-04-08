import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Intro section
  const introRow = rows.shift();
  const intro = document.createElement('div');
  intro.className = 'brands-intro';

  if (introRow) {
    const [heading, desc] = [...introRow.children];
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent;
      intro.append(h2);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      intro.append(p);
    }
  }

  // Cards container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'brands-cards';

  rows.forEach((row) => {
    const cols = [...row.children];

    const card = document.createElement('div');
    card.className = 'brand-card';

    // Image
    const img = cols[0]?.querySelector('img');
    if (img) {
      const picture = createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [{ width: '750' }]
      );
      card.append(picture);
    }

    // Content overlay
    const content = document.createElement('div');
    content.className = 'brand-content';

    // Title
    const title = document.createElement('div');
    title.className = 'brand-title';
    title.textContent = cols[1]?.textContent || '';

    // Link
    const link = document.createElement('a');
    link.className = 'brand-link';
    link.textContent = 'View More';

    const linkHref = cols[2]?.querySelector('a')?.href;
    if (linkHref) link.href = linkHref;

    content.append(title, link);
    card.append(content);

    cardsContainer.append(card);
  });

  // Wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'brands-wrapper';

  wrapper.append(intro, cardsContainer);

  block.replaceChildren(wrapper);
}