/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-brand. Base: cards.
 * Source: https://www.directlinegroup.co.uk/en/index.html
 * DOM: section.brand-section .teaser-carousels .pageteaser.teaser
 *      Also: section.main-section .parsys_column .pageteaser.teaser
 * Each card has: .image-wrapper img, h2 heading (with optional link), .link-wrapper a
 * Target: 2-column table per card: [image | heading + link]
 */
export default function parse(element, { document }) {
  // Find all teaser/card items within the element
  // DOM: <div class="pageteaser teaser parbase section">
  const teasers = element.querySelectorAll('.pageteaser.teaser, .teaser-inner');

  // If element itself is a teaser (single card instance)
  const items = teasers.length > 0 ? teasers : [element];
  const cells = [];

  items.forEach((teaser) => {
    // Extract image
    // DOM: <div class="image-wrapper"> <a><img class="cq-dd-teaserimage"></a> </div>
    const img = teaser.querySelector('.image-wrapper img, img.cq-dd-teaserimage, img');
    const imageCell = [];
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src || img.getAttribute('src') || '';
      newImg.alt = img.alt || '';
      imageCell.push(newImg);
    }

    // Extract heading and link
    // DOM: <h2><a href="...">Brand Name</a></h2> or <h2>Brand Name</h2>
    // DOM: <div class="link-wrapper"><a href="..." class="internal">View More</a></div>
    const contentCell = [];

    const heading = teaser.querySelector('h2');
    if (heading) contentCell.push(heading.cloneNode(true));

    // Extract description if present
    const description = teaser.querySelector('.teaser-content p');
    if (description && description.textContent.trim()) {
      contentCell.push(description.cloneNode(true));
    }

    const link = teaser.querySelector('.link-wrapper a, a.internal, a.asset');
    if (link) {
      const p = document.createElement('p');
      p.appendChild(link.cloneNode(true));
      contentCell.push(p);
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', contentCell]);
    }
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-brand', cells });
  element.replaceWith(block);
}
