/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-azure-explore.js
  var import_azure_explore_exports = {};
  __export(import_azure_explore_exports, {
    default: () => import_azure_explore_default
  });

  // tools/importer/parsers/hero-azure.js
  function parse(element, { document }) {
    const cells = [];
    const bgImg = element.querySelector('img[src*="Hero-Background"], picture img');
    if (bgImg) {
      const img = document.createElement("img");
      img.src = bgImg.src;
      img.alt = bgImg.alt || "";
      cells.push([img]);
    } else {
      cells.push([""]);
    }
    const heading = element.querySelector("h1");
    const description = element.querySelector('h1 ~ p, .hero-description, [class*="hero"] p');
    const contentCell = document.createElement("div");
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      contentCell.append(h1);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      contentCell.append(p);
    }
    cells.push([contentCell]);
    const tabLinks = element.querySelectorAll('a[href*="explore"], nav a, .tabs a, [role="tablist"] a');
    if (tabLinks.length > 0) {
      const tabCell = document.createElement("div");
      tabLinks.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        tabCell.append(a);
        tabCell.append(document.createTextNode(" "));
      });
      cells.push([tabCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-azure",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse2(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll('[class*="card"], [class*="feature"] > div, article, li');
    cards.forEach((card) => {
      const row = [];
      const img = card.querySelector("img");
      if (img) {
        const image = document.createElement("img");
        image.src = img.src;
        image.alt = img.alt || "";
        row.push(image);
      } else {
        row.push("");
      }
      const heading = card.querySelector('h2, h3, h4, [class*="heading"], [class*="title"]');
      const headingText = heading ? heading.textContent.trim() : "";
      const desc = card.querySelector('p, [class*="description"], [class*="text"]');
      const descText = desc ? desc.textContent.trim() : "";
      const link = card.querySelector("a");
      const contentCell = document.createElement("div");
      if (headingText) {
        const h3 = document.createElement("h3");
        h3.textContent = headingText;
        contentCell.append(h3);
      }
      if (descText) {
        const p = document.createElement("p");
        p.textContent = descText;
        contentCell.append(p);
      }
      if (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim() || "Learn more";
        contentCell.append(a);
      }
      row.push(contentCell);
      cells.push(row);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-feature",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-metrics.js
  function parse3(element, { document }) {
    const cells = [];
    const caseStudyEl = element.querySelector('[class*="case-study"], [class*="promo"], blockquote');
    if (caseStudyEl) {
      const row = [];
      const caseCard = caseStudyEl.closest('[class*="card"]') || caseStudyEl.parentElement;
      const img = caseCard ? caseCard.querySelector("img") : null;
      if (img) {
        const image = document.createElement("img");
        image.src = img.src;
        image.alt = img.alt || "";
        row.push(image);
      }
      const contentCell = document.createElement("div");
      const quote = caseCard ? caseCard.querySelector('blockquote, [class*="quote"], p') : null;
      if (quote) {
        const bq = document.createElement("blockquote");
        bq.textContent = quote.textContent.trim();
        contentCell.append(bq);
      }
      const source = caseCard ? caseCard.querySelector('[class*="source"], cite, small') : null;
      if (source) {
        const cite = document.createElement("p");
        cite.innerHTML = `<em>${source.textContent.trim()}</em>`;
        contentCell.append(cite);
      }
      row.push(contentCell);
      cells.push(row);
    }
    const statElements = element.querySelectorAll('[class*="stat"], [class*="metric"], [class*="number"]');
    statElements.forEach((stat) => {
      const row = [];
      const value = stat.querySelector('h2, h3, [class*="value"], [class*="number"], strong');
      const desc = stat.querySelector('p, [class*="description"], [class*="label"], span');
      const contentCell = document.createElement("div");
      if (value) {
        const h3 = document.createElement("h3");
        h3.textContent = value.textContent.trim();
        contentCell.append(h3);
      }
      if (desc && desc !== value) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        contentCell.append(p);
      }
      row.push(contentCell);
      cells.push(row);
    });
    if (cells.length === 0) {
      const allElements = element.querySelectorAll("*");
      allElements.forEach((el) => {
        const text = el.textContent.trim();
        if (/^\d+[%+]?$/.test(text) && el.children.length === 0) {
          const row = [];
          const contentCell = document.createElement("div");
          const h3 = document.createElement("h3");
          h3.textContent = text;
          contentCell.append(h3);
          const sibling = el.nextElementSibling || el.parentElement.querySelector("p, span");
          if (sibling && sibling !== el) {
            const p = document.createElement("p");
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
      name: "columns-metrics",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse4(element, { document }) {
    const cells = [];
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
          const questionCell = document.createElement("div");
          const h3 = document.createElement("h3");
          h3.textContent = question.textContent.trim();
          questionCell.append(h3);
          row.push(questionCell);
          const answerCell = document.createElement("div");
          if (answer) {
            const p = document.createElement("p");
            p.textContent = answer.textContent.trim();
            answerCell.append(p);
            const link = item.querySelector("a[href]");
            if (link) {
              const a = document.createElement("a");
              a.href = link.href;
              a.textContent = link.textContent.trim() || "Learn more";
              answerCell.append(a);
            }
          }
          row.push(answerCell);
          cells.push(row);
        }
      });
    }
    if (cells.length === 0) {
      const dts = element.querySelectorAll("dt");
      dts.forEach((dt) => {
        const dd = dt.nextElementSibling;
        if (dd && dd.tagName === "DD") {
          const row = [];
          const questionCell = document.createElement("div");
          const h3 = document.createElement("h3");
          h3.textContent = dt.textContent.trim();
          questionCell.append(h3);
          row.push(questionCell);
          const answerCell = document.createElement("div");
          const p = document.createElement("p");
          p.textContent = dd.textContent.trim();
          answerCell.append(p);
          row.push(answerCell);
          cells.push(row);
        }
      });
    }
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "accordion-faq",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-customer.js
  function parse5(element, { document }) {
    const cells = [];
    const stories = element.querySelectorAll(
      '[class*="case-study"], [class*="customer"] [class*="card"], [class*="carousel"] [class*="item"], [class*="story"], [class*="slide"]'
    );
    stories.forEach((story) => {
      const row = [];
      const headerImg = story.querySelector('img[class*="header"], img[class*="hero"], img:first-of-type');
      if (headerImg) {
        const img = document.createElement("img");
        img.src = headerImg.src;
        img.alt = headerImg.alt || "";
        row.push(img);
      } else {
        row.push("");
      }
      const logos = story.querySelectorAll("img");
      const logoImg = logos.length > 1 ? logos[1] : null;
      if (logoImg) {
        const img = document.createElement("img");
        img.src = logoImg.src;
        img.alt = logoImg.alt || "";
        row.push(img);
      } else {
        row.push("");
      }
      const headline = story.querySelector('h2, h3, h4, [class*="headline"], [class*="title"]');
      const desc = story.querySelector('p, [class*="description"], [class*="excerpt"]');
      const contentCell = document.createElement("div");
      if (headline) {
        const h3 = document.createElement("h3");
        h3.textContent = headline.textContent.trim();
        contentCell.append(h3);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        contentCell.append(p);
      }
      row.push(contentCell);
      const metaCell = document.createElement("div");
      const products = story.querySelectorAll('[class*="product"], [class*="tag"], [class*="badge"]');
      if (products.length > 0) {
        const productList = document.createElement("p");
        const productNames = [];
        products.forEach((prod) => productNames.push(prod.textContent.trim()));
        productList.textContent = productNames.join(", ");
        metaCell.append(productList);
      }
      const cta = story.querySelector('a[href*="customer"], a[href*="story"], a:last-of-type');
      if (cta) {
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim() || "Read the story";
        metaCell.append(a);
      }
      row.push(metaCell);
      cells.push(row);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-customer",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/azure-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      const { document } = payload;
      const removeSelectors = [
        "header",
        "footer",
        "nav",
        // Cookie consent
        ".oc-cookie-consent",
        "#cookie-consent",
        "#msccBannerV2",
        "#uhfCookieAlert",
        '[class*="cookie"]',
        // Microsoft universal header/footer
        '[class*="c-uhf"]',
        ".c-uhfh",
        "#headerArea",
        "#headerRegion",
        "#headerUniversalHeader",
        ".universalheader",
        "#uhf-footer",
        '[class*="uhf"]',
        // Tracking pixels
        'img[src*="demdex"]',
        'img[src*="everesttech"]',
        'img[src*="doubleclick"]',
        'img[src*="facebook"]',
        'img[src*="analytics"]',
        'img[width="1"][height="1"]',
        'img[width="0"][height="0"]',
        // Script remnants
        "script",
        "noscript",
        'link[rel="stylesheet"]',
        "style",
        // Skip to main content links
        ".m-skip-to-main",
        "#uhfSkipToMain",
        // Hidden/utility elements
        ".d-none",
        ".x-hidden",
        ".geo-info",
        "#modalsRenderedAfterPageLoad",
        "#page-top"
      ];
      removeSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      });
      document.querySelectorAll("div:empty").forEach((el) => el.remove());
    }
  }

  // tools/importer/transformers/azure-sections.js
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      const { document } = payload;
      const mainContent = document.querySelector('main, [role="main"], .root, body');
      if (!mainContent) return;
      const sectionSelectors = [
        '[class*="section"]',
        '[class*="blade"]',
        '[class*="band"]',
        '[class*="module"]',
        "section",
        "[data-module]",
        '[class*="aem-GridColumn"]'
      ];
      const sections = [];
      sectionSelectors.forEach((selector) => {
        const elements = mainContent.querySelectorAll(selector);
        elements.forEach((el) => {
          if (el.parentElement === mainContent || el.parentElement.parentElement === mainContent) {
            if (!sections.includes(el)) {
              sections.push(el);
            }
          }
        });
      });
      sections.sort((a, b) => {
        const pos = a.compareDocumentPosition(b);
        if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });
      sections.forEach((section, index) => {
        if (index > 0) {
          const hr = document.createElement("hr");
          section.parentElement.insertBefore(hr, section);
        }
      });
    }
  }

  // tools/importer/import-azure-explore.js
  var PAGE_TEMPLATE = {
    name: "azure-explore",
    urls: [
      "https://azure.microsoft.com/en-us/explore/"
    ],
    description: "Azure Explore landing page with hero, product categories, customer stories, and call-to-action sections",
    blocks: [
      {
        name: "hero-azure",
        selector: ".section-master--blade-hero-slim",
        parse
      },
      {
        name: "cards-feature",
        selector: ".three-up-cards, .block-feature",
        parse: parse2
      },
      {
        name: "columns-metrics",
        selector: ".card-grid--disable-card-promo",
        parse: parse3
      },
      {
        name: "accordion-faq",
        selector: ".ocr-faq",
        parse: parse4
      },
      {
        name: "cards-customer",
        selector: ".carousel--type-case-study",
        parse: parse5
      }
    ]
  };
  function findBlocksOnPage(document) {
    const found = [];
    PAGE_TEMPLATE.blocks.forEach((blockDef) => {
      const selectors = blockDef.selector.split(",").map((s) => s.trim());
      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          found.push({ element, blockDef });
        });
      });
    });
    return found;
  }
  function executeTransformers(hookName, element, payload) {
    transform(hookName, element, payload);
    transform2(hookName, element, payload);
  }
  var import_azure_explore_default = {
    transform: ({ document, url, html, params }) => {
      const main = document.body;
      const payload = { document, url, html, params, template: PAGE_TEMPLATE };
      executeTransformers("beforeTransform", main, payload);
      const blocksFound = findBlocksOnPage(document);
      blocksFound.forEach(({ element, blockDef }) => {
        try {
          blockDef.parse(element, { document });
        } catch (e) {
          console.error(`Failed to parse ${blockDef.name}:`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: blocksFound.map((b) => b.blockDef.name)
        }
      }];
    }
  };
  return __toCommonJS(import_azure_explore_exports);
})();
