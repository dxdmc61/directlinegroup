/* eslint-disable */
/* global WebImporter */

import parseHeroAzure from './parsers/hero-azure.js';
import parseCardsFeature from './parsers/cards-feature.js';
import parseColumnsMetrics from './parsers/columns-metrics.js';
import parseAccordionFaq from './parsers/accordion-faq.js';
import parseCardsCustomer from './parsers/cards-customer.js';
import transformAzureCleanup from './transformers/azure-cleanup.js';
import transformAzureSections from './transformers/azure-sections.js';

const PAGE_TEMPLATE = {
  name: 'azure-explore',
  urls: [
    'https://azure.microsoft.com/en-us/explore/',
  ],
  description: 'Azure Explore landing page with hero, product categories, customer stories, and call-to-action sections',
  blocks: [
    {
      name: 'hero-azure',
      selector: '.section-master--blade-hero-slim',
      parse: parseHeroAzure,
    },
    {
      name: 'cards-feature',
      selector: '.three-up-cards, .block-feature',
      parse: parseCardsFeature,
    },
    {
      name: 'columns-metrics',
      selector: '.card-grid--disable-card-promo',
      parse: parseColumnsMetrics,
    },
    {
      name: 'accordion-faq',
      selector: '.ocr-faq',
      parse: parseAccordionFaq,
    },
    {
      name: 'cards-customer',
      selector: '.carousel--type-case-study',
      parse: parseCardsCustomer,
    },
  ],
};

/**
 * Find blocks on the page using the template selectors.
 */
function findBlocksOnPage(document) {
  const found = [];
  PAGE_TEMPLATE.blocks.forEach((blockDef) => {
    const selectors = blockDef.selector.split(',').map((s) => s.trim());
    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        found.push({ element, blockDef });
      });
    });
  });
  return found;
}

/**
 * Execute all transformers in sequence.
 */
function executeTransformers(hookName, element, payload) {
  transformAzureCleanup(hookName, element, payload);
  transformAzureSections(hookName, element, payload);
}

export default {
  transform: ({ document, url, html, params }) => {
    const main = document.body;
    const payload = { document, url, html, params, template: PAGE_TEMPLATE };

    // Pre-transform cleanup
    executeTransformers('beforeTransform', main, payload);

    // Find and parse blocks
    const blocksFound = findBlocksOnPage(document);
    blocksFound.forEach(({ element, blockDef }) => {
      try {
        blockDef.parse(element, { document });
      } catch (e) {
        console.error(`Failed to parse ${blockDef.name}:`, e);
      }
    });

    // Post-transform section breaks
    executeTransformers('afterTransform', main, payload);

    // Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // Generate path under /content/microsoft
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: blocksFound.map((b) => b.blockDef.name),
      },
    }];
  },
};
