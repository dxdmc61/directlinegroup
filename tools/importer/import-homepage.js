/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsBrandParser from './parsers/cards-brand.js';
import columnsStatsParser from './parsers/columns-stats.js';

// TRANSFORMER IMPORTS
import dlgCleanupTransformer from './transformers/dlg-cleanup.js';
import dlgSectionsTransformer from './transformers/dlg-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-brand': cardsBrandParser,
  'columns-stats': columnsStatsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Direct Line Group corporate homepage with hero, key content sections, and corporate links',
  urls: [
    'https://www.directlinegroup.co.uk/en/index.html',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: [
        'div.banner.imagecarousel',
      ],
    },
    {
      name: 'cards-brand',
      instances: [
        'section.brand-section div.teaser-carousels .pageteaser.teaser',
        'section.main-section div.main-par .parsys_column.column_3_33-33-33 .pageteaser.teaser',
      ],
    },
    {
      name: 'columns-stats',
      instances: [
        'div.teaser-inner.default.plain-background .parsys_column.column_3_33-33-33',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero',
      selector: 'div.banner.imagecarousel',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2-brands',
      name: 'Our Brands',
      selector: 'section.brand-section',
      style: null,
      blocks: ['cards-brand'],
      defaultContent: [
        'div.brand-page-teaser h2',
        'div.brand-page-teaser .teaser-content p',
      ],
    },
    {
      id: 'section-3-at-a-glance',
      name: 'DLG At A Glance',
      selector: 'div.teaser-inner.default.plain-background',
      style: 'dark',
      blocks: ['columns-stats'],
      defaultContent: [
        'div.teaser-inner.default.plain-background h2',
        'div.teaser-inner.default.plain-background .default a',
      ],
    },
    {
      id: 'section-4-our-latest',
      name: 'Our Latest',
      selector: 'section.main-section div.main-par',
      style: null,
      blocks: ['cards-brand'],
      defaultContent: [
        'div.main-par > .text h2',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  dlgCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [dlgSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });

  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using template selectors
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
