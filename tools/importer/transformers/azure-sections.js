/* eslint-disable */
/* global WebImporter */

/**
 * Section breaks transformer for Azure pages.
 * Adds section break markers (---) between major content sections.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const { document } = payload;

    const mainContent = document.querySelector('main, [role="main"], .root, body');
    if (!mainContent) return;

    // Look for major section boundaries
    const sectionSelectors = [
      '[class*="section"]',
      '[class*="blade"]',
      '[class*="band"]',
      '[class*="module"]',
      'section',
      '[data-module]',
      '[class*="aem-GridColumn"]',
    ];

    // Find top-level section containers
    const sections = [];
    sectionSelectors.forEach((selector) => {
      const elements = mainContent.querySelectorAll(selector);
      elements.forEach((el) => {
        // Only consider direct children or near-top-level elements
        if (el.parentElement === mainContent || el.parentElement.parentElement === mainContent) {
          if (!sections.includes(el)) {
            sections.push(el);
          }
        }
      });
    });

    // Sort sections by document order
    sections.sort((a, b) => {
      const pos = a.compareDocumentPosition(b);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });

    // Insert section break markers between sections
    sections.forEach((section, index) => {
      if (index > 0) {
        const hr = document.createElement('hr');
        section.parentElement.insertBefore(hr, section);
      }
    });
  }
}
