/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-customer block.
 * Matches: .carousel--type-case-study, customer story cards
 */
export default function parse(element, { document }) {
  const cells = [];

  const stories = element.querySelectorAll(
    '[class*="case-study"], [class*="customer"] [class*="card"], [class*="carousel"] [class*="item"], [class*="story"], [class*="slide"]'
  );

  stories.forEach((story) => {
    const row = [];

    // Column 1: Customer header image
    const headerImg = story.querySelector('img[class*="header"], img[class*="hero"], img:first-of-type');
    if (headerImg) {
      const img = document.createElement('img');
      img.src = headerImg.src;
      img.alt = headerImg.alt || '';
      row.push(img);
    } else {
      row.push('');
    }

    // Column 2: Customer logo/thumbnail
    const logos = story.querySelectorAll('img');
    const logoImg = logos.length > 1 ? logos[1] : null;
    if (logoImg) {
      const img = document.createElement('img');
      img.src = logoImg.src;
      img.alt = logoImg.alt || '';
      row.push(img);
    } else {
      row.push('');
    }

    // Column 3: Headline + description
    const headline = story.querySelector('h2, h3, h4, [class*="headline"], [class*="title"]');
    const desc = story.querySelector('p, [class*="description"], [class*="excerpt"]');
    const contentCell = document.createElement('div');
    if (headline) {
      const h3 = document.createElement('h3');
      h3.textContent = headline.textContent.trim();
      contentCell.append(h3);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCell.append(p);
    }
    row.push(contentCell);

    // Column 4: Products + CTA
    const metaCell = document.createElement('div');
    const products = story.querySelectorAll('[class*="product"], [class*="tag"], [class*="badge"]');
    if (products.length > 0) {
      const productList = document.createElement('p');
      const productNames = [];
      products.forEach((prod) => productNames.push(prod.textContent.trim()));
      productList.textContent = productNames.join(', ');
      metaCell.append(productList);
    }
    const cta = story.querySelector('a[href*="customer"], a[href*="story"], a:last-of-type');
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim() || 'Read the story';
      metaCell.append(a);
    }
    row.push(metaCell);

    cells.push(row);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-customer',
    cells,
  });

  element.replaceWith(block);
}
