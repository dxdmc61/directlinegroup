/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature block.
 * Matches: .block-feature, .three-up-cards, or feature card grids
 */
export default function parse(element, { document }) {
  const cells = [];
  const cards = element.querySelectorAll('[class*="card"], [class*="feature"] > div, article, li');

  cards.forEach((card) => {
    const row = [];

    // Image
    const img = card.querySelector('img');
    if (img) {
      const image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt || '';
      row.push(image);
    } else {
      row.push('');
    }

    // Heading
    const heading = card.querySelector('h2, h3, h4, [class*="heading"], [class*="title"]');
    const headingText = heading ? heading.textContent.trim() : '';

    // Description
    const desc = card.querySelector('p, [class*="description"], [class*="text"]');
    const descText = desc ? desc.textContent.trim() : '';

    // Link
    const link = card.querySelector('a');
    const contentCell = document.createElement('div');
    if (headingText) {
      const h3 = document.createElement('h3');
      h3.textContent = headingText;
      contentCell.append(h3);
    }
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      contentCell.append(p);
    }
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim() || 'Learn more';
      contentCell.append(a);
    }
    row.push(contentCell);

    cells.push(row);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-feature',
    cells,
  });

  element.replaceWith(block);
}
