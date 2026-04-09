/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-stats. Base: columns.
 * Source: https://www.directlinegroup.co.uk/en/index.html
 * DOM: div.teaser-inner.default.plain-background .parsys_column.column_3_33-33-33
 * Each column: div.parsys_column.column_3_33-33-33-cN > div.pull-out-statistic
 *   Contains: h3.statistic-title (with span for value, sup for prefix)
 *             span.statistic-text1 (label)
 * Target: 1 row with 3 columns, each containing stat heading + label text
 */
export default function parse(element, { document }) {
  // Find the 3-column container
  // DOM: <div class="parsys_column column_3_33-33-33">
  const columnContainer = element.querySelector('.parsys_column[class*="column_3"]');
  if (!columnContainer) return;

  // Find individual column cells
  // DOM: <div class="parsys_column column_3_33-33-33-c0">, -c1, -c2
  const columnDivs = columnContainer.querySelectorAll('[class*="column_3_33-33-33-c"]');
  if (columnDivs.length === 0) return;

  const row = [];

  columnDivs.forEach((colDiv) => {
    const cellContent = [];

    // Extract statistic: prefix (sup) + value (span) in h3
    // DOM: <h3 class="statistic-title"><sup>over</sup><span>9,000</span></h3>
    const statTitle = colDiv.querySelector('h3.statistic-title, .statistic-title');
    if (statTitle) {
      const h3 = document.createElement('h3');
      const sup = statTitle.querySelector('sup');
      const valueSpan = statTitle.querySelector('span');
      if (sup && sup.textContent.trim()) {
        h3.textContent = sup.textContent.trim() + ' ';
      }
      if (valueSpan) {
        h3.textContent += valueSpan.textContent.trim();
      } else {
        h3.textContent += statTitle.textContent.trim();
      }
      cellContent.push(h3);
    }

    // Extract label text
    // DOM: <span class="statistic-text1">auto repair centres</span>
    const labelSpan = colDiv.querySelector('.statistic-text1, .statistic-text');
    if (labelSpan) {
      const p = document.createElement('p');
      p.textContent = labelSpan.textContent.trim();
      cellContent.push(p);
    }

    row.push(cellContent);
  });

  if (row.length === 0) return;

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}
