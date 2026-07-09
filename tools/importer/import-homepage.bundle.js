/* eslint-disable */
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
    let slides = Array.from(element.querySelectorAll(".hero-slide")).filter((s) => !s.closest(".tns-slide-cloned") && !s.classList.contains("tns-slide-cloned"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(":scope > a, :scope > div")).filter((s) => s.querySelector("img"));
    }
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector("picture") || slide.querySelector("img");
      let ctaCell = "";
      const href = slide.tagName === "A" ? slide.getAttribute("href") : null;
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        const img = slide.querySelector("img");
        link.textContent = img && img.getAttribute("alt") || href;
        ctaCell = link;
      }
      if (image) {
        cells.push([image, ctaCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-segments.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll("a")).filter((a) => a.querySelector("img"));
    const cells = [];
    items.forEach((item) => {
      const icon = item.querySelector("img");
      const labelText = (item.querySelector("span") || item).textContent.trim();
      const href = item.getAttribute("href");
      let textCell;
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = labelText;
        textCell = link;
      } else {
        textCell = labelText;
      }
      if (icon) {
        cells.push([icon, textCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-segments", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-imagecopy.js
  function parse3(element, { document }) {
    const imageContainer = element.querySelector(".block-image") || element;
    const image = imageContainer.querySelector("picture") || imageContainer.querySelector("img");
    const copyContainer = element.querySelector(".rich-text") || element.querySelector(".block-caption") || element;
    const heading = copyContainer.querySelector("h1, h2, h3, h4, h5, h6");
    const paragraphs = Array.from(copyContainer.querySelectorAll("p"));
    const ctas = Array.from(copyContainer.querySelectorAll("a"));
    const copyCell = [];
    if (heading) copyCell.push(heading);
    copyCell.push(...paragraphs);
    copyCell.push(...ctas);
    if (!image && !copyCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[image || "", copyCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-imagecopy", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-logos.js
  function parse4(element, { document }) {
    let items = Array.from(element.querySelectorAll(".featured-item"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll("a")).filter((a) => a.querySelector("img"));
    }
    const cells = [];
    items.forEach((item) => {
      const anchor = item.matches("a") ? item : item.querySelector("a");
      const img = item.querySelector("img");
      if (!img) return;
      let imageCell = img;
      if (anchor) {
        const link = document.createElement("a");
        const href = anchor.getAttribute("href");
        if (href) link.href = href;
        const target = anchor.getAttribute("target");
        if (target) link.setAttribute("target", target);
        link.appendChild(img);
        imageCell = link;
      }
      cells.push([imageCell, ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-recipe.js
  function parse5(element, { document }) {
    let items = Array.from(element.querySelectorAll(".featured-item"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll("a")).filter((a) => a.querySelector("img"));
    }
    const cells = [];
    items.forEach((item) => {
      const anchor = item.matches("a") ? item : item.querySelector("a");
      const image = item.querySelector("picture") || item.querySelector("img");
      const titleText = (item.querySelector(".featured-item-title, .featured-item-description") || anchor || item).textContent.trim();
      const href = anchor ? anchor.getAttribute("href") : null;
      let titleCell;
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = titleText;
        titleCell = link;
      } else {
        titleCell = titleText;
      }
      if (image) {
        cells.push([image, titleCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-recipe", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-signup.js
  function parse6(element, { document }) {
    const heading = element.querySelector("h1, h2, h3, h4, h5, h6");
    const paragraphs = Array.from(element.querySelectorAll("p"));
    const copyCell = [];
    if (heading) copyCell.push(heading);
    copyCell.push(...paragraphs);
    const ctaLink = element.querySelector("a");
    const ctaButton = element.querySelector("button");
    let ctaCell = "";
    if (ctaLink) {
      ctaCell = ctaLink;
    } else if (ctaButton) {
      const label = ctaButton.textContent.trim();
      const link = document.createElement("a");
      link.href = "#signup";
      link.textContent = label || "Sign Up";
      ctaCell = link;
    }
    if (!copyCell.length && !ctaCell) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[copyCell, ctaCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-signup", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/kellanova-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        ".skip-link",
        "#onetrust-consent-sdk",
        "#CybotCookiebotDialog",
        '[class*="cookie-consent"]',
        '[id*="cookie-consent"]'
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "source",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-tracking");
        if (el.classList && el.classList.length) {
          const toRemove = [];
          el.classList.forEach((cls) => {
            if (cls.startsWith("aem-GridColumn") || cls === "aem-Grid" || cls === "section--in-viewport") {
              toRemove.push(cls);
            }
          });
          toRemove.forEach((cls) => el.classList.remove(cls));
          if (el.classList.length === 0) {
            el.removeAttribute("class");
          }
        }
      });
    }
  }

  // tools/importer/transformers/kellanova-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      const sections = template && Array.isArray(template.sections) ? template.sections : [];
      if (sections.length < 2) return;
      const doc = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section || !section.selector) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const meta = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(meta);
        }
        if (i > 0 && sectionEl.previousElementSibling) {
          sectionEl.before(doc.createElement("hr"));
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Kellanova Away From Home homepage: hero carousel, segments icon grid, Our Food image+copy block, brands logo grid, recipe inspiration carousel, and a newsletter signup CTA",
    urls: [
      "https://www.kellanovaawayfromhome.com/"
    ],
    blocks: [
      { name: "carousel-hero", instances: ["#skip-main-content > div.hero div.js-slider"] },
      { name: "cards-segments", instances: ["#skip-main-content div.segment-nav"] },
      { name: "columns-imagecopy", instances: ["#skip-main-content > div.image-copy-block"] },
      { name: "cards-logos", instances: ["#skip-main-content > div.mannualfeaturelist"] },
      { name: "carousel-recipe", instances: ["#skip-main-content > div.featureditemlistautomatic"] },
      { name: "columns-signup", instances: ["#skip-main-content div.email-signup-row"] }
    ],
    sections: [
      { id: "rc2c4c2", name: "Hero carousel", selector: "#skip-main-content > div.hero", style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "rc2c4c3", name: "Segments intro", selector: "#skip-main-content > div.markuptext.section--in-viewport:nth-of-type(3)", style: null, blocks: [], defaultContent: ["#skip-main-content > div.markuptext.section--in-viewport:nth-of-type(3) h2", "#skip-main-content > div.markuptext.section--in-viewport:nth-of-type(3) p"] },
      { id: "rc2c4c4", name: "Segments icon grid", selector: "#skip-main-content > div.markuptext.section--in-viewport:nth-of-type(4)", style: null, blocks: ["cards-segments"], defaultContent: [] },
      { id: "rc2c4c5", name: "Our Food image + copy", selector: "#skip-main-content > div.image-copy-block", style: null, blocks: ["columns-imagecopy"], defaultContent: [] },
      { id: "rc2c4c6", name: "Brands intro", selector: "#skip-main-content > div.markuptext:nth-of-type(6)", style: null, blocks: [], defaultContent: ["#skip-main-content > div.markuptext:nth-of-type(6) h2", "#skip-main-content > div.markuptext:nth-of-type(6) p"] },
      { id: "rc2c4c7", name: "Brands logo grid", selector: "#skip-main-content > div.mannualfeaturelist", style: null, blocks: ["cards-logos"], defaultContent: [] },
      { id: "rc2c4c8", name: "Explore Our Brands button", selector: "#skip-main-content > div.markuptext:nth-of-type(8)", style: null, blocks: [], defaultContent: ["#skip-main-content > div.markuptext:nth-of-type(8) a"] },
      { id: "rc2c4c9", name: "Menu inspiration heading", selector: "#skip-main-content > div.markuptext:nth-of-type(9)", style: null, blocks: [], defaultContent: ["#skip-main-content > div.markuptext:nth-of-type(9) h2"] },
      { id: "rc2c4c10", name: "Recipes carousel", selector: "#skip-main-content > div.featureditemlistautomatic", style: null, blocks: ["carousel-recipe"], defaultContent: [] },
      { id: "rc2c4c11", name: "Signup CTA", selector: "#skip-main-content > div.markuptext:last-of-type", style: null, blocks: ["columns-signup"], defaultContent: [] }
    ]
  };
  var parsers = {
    "carousel-hero": parse,
    "cards-segments": parse2,
    "columns-imagecopy": parse3,
    "cards-logos": parse4,
    "carousel-recipe": parse5,
    "columns-signup": parse6
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let pathname = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      if (!pathname) {
        pathname = "/index";
      }
      const path = WebImporter.FileUtils.sanitizePath(pathname);
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
