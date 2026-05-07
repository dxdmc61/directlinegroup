/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq block.
 * Matches: .ocr-faq, FAQ containers, accordion elements
 */
export default function parse(element, { document }) {
  const cells = [];

  // Try to find FAQ items by various patterns
  const faqItems = element.querySelectorAll(
    '[class*="faq"] [class*="item"], [class*="accordion"] [class*="item"], details, [class*="question"]'
  );

  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(
        'h2, h3, h4, summary, [class*="question"], [class*="title"], button'
      );
      const answer = item.querySelector(
        '[class*="answer"], [class*="content"], [class*="body"], p, dd'
      );

      if (question) {
        const row = [];

        // Column 1: Question
        const questionCell = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = question.textContent.trim();
        questionCell.append(h3);
        row.push(questionCell);

        // Column 2: Answer
        const answerCell = document.createElement('div');
        if (answer) {
          const p = document.createElement('p');
          p.textContent = answer.textContent.trim();
          answerCell.append(p);

          // Look for learn more link
          const link = item.querySelector('a[href]');
          if (link) {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.textContent.trim() || 'Learn more';
            answerCell.append(a);
          }
        }
        row.push(answerCell);

        cells.push(row);
      }
    });
  }

  // Fallback: look for dt/dd pairs
  if (cells.length === 0) {
    const dts = element.querySelectorAll('dt');
    dts.forEach((dt) => {
      const dd = dt.nextElementSibling;
      if (dd && dd.tagName === 'DD') {
        const row = [];
        const questionCell = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = dt.textContent.trim();
        questionCell.append(h3);
        row.push(questionCell);

        const answerCell = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = dd.textContent.trim();
        answerCell.append(p);
        row.push(answerCell);

        cells.push(row);
      }
    });
  }

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'accordion-faq',
    cells,
  });

  element.replaceWith(block);
}
