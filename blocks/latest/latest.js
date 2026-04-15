import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];

  // 👉 Heading
  const headingRow = rows.shift();
  const headingText = headingRow?.textContent;

  const h2 = document.createElement('h2');
  h2.textContent = headingText || '';

  // 👉 Grid container
  const grid = document.createElement('div');
  grid.className = 'latest-grid';

  rows.forEach((row) => {
    const cols = [...row.children];

    const card = document.createElement('div');
    card.className = 'latest-card';

    // Title
    const title = document.createElement('h3');
    title.textContent = cols[0]?.textContent || '';

    // Image
    const img = cols[1]?.querySelector('img');
    let picture;
    if (img) {
      picture = createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [{ width: '750' }]
      );
    }

    // Link
    const link = document.createElement('a');
    link.textContent = 'View more';
    const href = cols[2]?.querySelector('a')?.href;
    if (href) link.href = href;

    // Append
    card.append(title);
    if (picture) card.append(picture);
    card.append(link);

    grid.append(card);
  }); 
 
  block.textContent = '';
  block.append(h2, grid);
}