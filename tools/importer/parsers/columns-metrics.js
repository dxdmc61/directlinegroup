/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-metrics block.
 * Matches: statistic/number patterns, .card-grid--disable-card-promo
 */
export default function parse(element, { document }) {
  const cells = [];

  // Look for case study cards (image + quote)
  const caseStudyEl = element.querySelector('[class*="case-study"], [class*="promo"], blockquote');
  if (caseStudyEl) {
    const row = [];
    const caseCard = caseStudyEl.closest('[class*="card"]') || caseStudyEl.parentElement;

    const img = caseCard ? caseCard.querySelector('img') : null;
    if (img) {
      const image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt || '';
      row.push(image);
    }

    const contentCell = document.createElement('div');
    const quote = caseCard ? caseCard.querySelector('blockquote, [class*="quote"], p') : null;
    if (quote) {
      const bq = document.createElement('blockquote');
      bq.textContent = quote.textContent.trim();
      contentCell.append(bq);
    }
    const source = caseCard ? caseCard.querySelector('[class*="source"], cite, small') : null;
    if (source) {
      const cite = document.createElement('p');
      cite.innerHTML = `<em>${source.textContent.trim()}</em>`;
      contentCell.append(cite);
    }
    row.push(contentCell);
    cells.push(row);
  }

  // Look for stat cards (large numbers)
  const statElements = element.querySelectorAll('[class*="stat"], [class*="metric"], [class*="number"]');
  statElements.forEach((stat) => {
    const row = [];
    const value = stat.querySelector('h2, h3, [class*="value"], [class*="number"], strong');
    const desc = stat.querySelector('p, [class*="description"], [class*="label"], span');

    const contentCell = document.createElement('div');
    if (value) {
      const h3 = document.createElement('h3');
      h3.textContent = value.textContent.trim();
      contentCell.append(h3);
    }
    if (desc && desc !== value) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCell.append(p);
    }
    row.push(contentCell);
    cells.push(row);
  });

  // Fallback: look for elements with large numeric content
  if (cells.length === 0) {
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      const text = el.textContent.trim();
      if (/^\d+[%+]?$/.test(text) && el.children.length === 0) {
        const row = [];
        const contentCell = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = text;
        contentCell.append(h3);

        const sibling = el.nextElementSibling || el.parentElement.querySelector('p, span');
        if (sibling && sibling !== el) {
          const p = document.createElement('p');
          p.textContent = sibling.textContent.trim();
          contentCell.append(p);
        }
        row.push(contentCell);
        cells.push(row);
      }
    });
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-metrics',
    cells,
  });

  element.replaceWith(block);
}
