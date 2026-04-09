var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll("li.slide-image, .slick-slide");
    const cells = [];
    slides.forEach((slide) => {
      const slideInner = slide.querySelector('.slideinner, [style*="background-image"]');
      let imageCell = [];
      if (slideInner) {
        const bgStyle = slideInner.getAttribute("style") || "";
        const bgMatch = bgStyle.match(/url\(([^)]+)\)/);
        if (bgMatch) {
          const imgUrl = bgMatch[1].replace(/['"]/g, "");
          const img = document.createElement("img");
          img.src = imgUrl;
          img.alt = "";
          imageCell.push(img);
        }
      }
      if (imageCell.length === 0) {
        const img = slide.querySelector("img");
        if (img) imageCell.push(img);
      }
      const contentCell = [];
      const heading = slide.querySelector(".carousel-text h1, .carousel-text-inner h1, h1");
      if (heading) contentCell.push(heading);
      const subheading = slide.querySelector(".carousel-text-2 h2, .carousel-text-inner h2, h2");
      if (subheading) contentCell.push(subheading);
      const ctaLinks = slide.querySelectorAll(".carousel-links a, .link1 a, .link2 a");
      ctaLinks.forEach((link) => {
        const p = document.createElement("p");
        p.appendChild(link.cloneNode(true));
        contentCell.push(p);
      });
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell.length > 0 ? imageCell : "", contentCell]);
      }
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-brand.js
  function parse2(element, { document }) {
    const teasers = element.querySelectorAll(".pageteaser.teaser, .teaser-inner");
    const items = teasers.length > 0 ? teasers : [element];
    const cells = [];
    items.forEach((teaser) => {
      const img = teaser.querySelector(".image-wrapper img, img.cq-dd-teaserimage, img");
      const imageCell = [];
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src || img.getAttribute("src") || "";
        newImg.alt = img.alt || "";
        imageCell.push(newImg);
      }
      const contentCell = [];
      const heading = teaser.querySelector("h2");
      if (heading) contentCell.push(heading.cloneNode(true));
      const description = teaser.querySelector(".teaser-content p");
      if (description && description.textContent.trim()) {
        contentCell.push(description.cloneNode(true));
      }
      const link = teaser.querySelector(".link-wrapper a, a.internal, a.asset");
      if (link) {
        const p = document.createElement("p");
        p.appendChild(link.cloneNode(true));
        contentCell.push(p);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell.length > 0 ? imageCell : "", contentCell]);
      }
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-brand", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function parse3(element, { document }) {
    const columnContainer = element.querySelector('.parsys_column[class*="column_3"]');
    if (!columnContainer) return;
    const columnDivs = columnContainer.querySelectorAll('[class*="column_3_33-33-33-c"]');
    if (columnDivs.length === 0) return;
    const row = [];
    columnDivs.forEach((colDiv) => {
      const cellContent = [];
      const statTitle = colDiv.querySelector("h3.statistic-title, .statistic-title");
      if (statTitle) {
        const h3 = document.createElement("h3");
        const sup = statTitle.querySelector("sup");
        const valueSpan = statTitle.querySelector("span");
        if (sup && sup.textContent.trim()) {
          h3.textContent = sup.textContent.trim() + " ";
        }
        if (valueSpan) {
          h3.textContent += valueSpan.textContent.trim();
        } else {
          h3.textContent += statTitle.textContent.trim();
        }
        cellContent.push(h3);
      }
      const labelSpan = colDiv.querySelector(".statistic-text1, .statistic-text");
      if (labelSpan) {
        const p = document.createElement("p");
        p.textContent = labelSpan.textContent.trim();
        cellContent.push(p);
      }
      row.push(cellContent);
    });
    if (row.length === 0) return;
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/dlg-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        '[class*="cookie"]'
      ]);
      WebImporter.DOMUtils.remove(element, [".dg-alert"]);
      WebImporter.DOMUtils.remove(element, ["#navmenumobile"]);
      WebImporter.DOMUtils.remove(element, ["#backingpanel", ".backinghighlight"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.site-header-wrapper",
        "footer.site-footer-wrapper",
        "header",
        "footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "nav",
        ".topnavmultimenu",
        ".mobilemenu"
      ]);
      WebImporter.DOMUtils.remove(element, [".shareprice"]);
      WebImporter.DOMUtils.remove(element, [".searchfield"]);
      WebImporter.DOMUtils.remove(element, ["#downbutton"]);
      WebImporter.DOMUtils.remove(element, ["section.insights-section"]);
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript"]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-emptytext");
      });
    }
  }

  // tools/importer/transformers/dlg-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload || {};
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const doc = element.ownerDocument || document;
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== template.sections[0].id) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "cards-brand": parse2,
    "columns-stats": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Direct Line Group corporate homepage with hero, key content sections, and corporate links",
    urls: [
      "https://www.directlinegroup.co.uk/en/index.html"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [
          "div.banner.imagecarousel"
        ]
      },
      {
        name: "cards-brand",
        instances: [
          "section.brand-section div.teaser-carousels .pageteaser.teaser",
          "section.main-section div.main-par .parsys_column.column_3_33-33-33 .pageteaser.teaser"
        ]
      },
      {
        name: "columns-stats",
        instances: [
          "div.teaser-inner.default.plain-background .parsys_column.column_3_33-33-33"
        ]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero",
        selector: "div.banner.imagecarousel",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2-brands",
        name: "Our Brands",
        selector: "section.brand-section",
        style: null,
        blocks: ["cards-brand"],
        defaultContent: [
          "div.brand-page-teaser h2",
          "div.brand-page-teaser .teaser-content p"
        ]
      },
      {
        id: "section-3-at-a-glance",
        name: "DLG At A Glance",
        selector: "div.teaser-inner.default.plain-background",
        style: "dark",
        blocks: ["columns-stats"],
        defaultContent: [
          "div.teaser-inner.default.plain-background h2",
          "div.teaser-inner.default.plain-background .default a"
        ]
      },
      {
        id: "section-4-our-latest",
        name: "Our Latest",
        selector: "section.main-section div.main-par",
        style: null,
        blocks: ["cards-brand"],
        defaultContent: [
          "div.main-par > .text h2"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
