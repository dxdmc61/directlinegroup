/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-azure block.
 * Matches: .section-master--blade-hero-slim or first section with gradient background
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: Background image
  const bgImg = element.querySelector('img[src*="Hero-Background"], picture img');
  if (bgImg) {
    const img = document.createElement('img');
    img.src = bgImg.src;
    img.alt = bgImg.alt || '';
    cells.push([img]);
  } else {
    cells.push(['']);
  }

  // Row 2: Heading + description
  const heading = element.querySelector('h1');
  const description = element.querySelector('h1 ~ p, .hero-description, [class*="hero"] p');
  const contentCell = document.createElement('div');
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.append(h1);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentCell.append(p);
  }
  cells.push([contentCell]);

  // Row 3: Tab links
  const tabLinks = element.querySelectorAll('a[href*="explore"], nav a, .tabs a, [role="tablist"] a');
  if (tabLinks.length > 0) {
    const tabCell = document.createElement('div');
    tabLinks.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      tabCell.append(a);
      tabCell.append(document.createTextNode(' '));
    });
    cells.push([tabCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-azure',
    cells,
  });

  element.replaceWith(block);
}
