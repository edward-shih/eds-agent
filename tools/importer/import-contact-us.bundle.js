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

  // tools/importer/import-contact-us.js
  var import_contact_us_exports = {};
  __export(import_contact_us_exports, {
    default: () => import_contact_us_default
  });

  // tools/importer/parsers/form.js
  function parse(element, { document }) {
    const form = element.matches("form") ? element : element.querySelector("form");
    if (!form) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const controls = [...form.querySelectorAll("input, select, textarea")];
    const labelFor = (el) => {
      if (el.id) {
        const l = form.querySelector(`label[for="${el.id}"]`);
        if (l) return l.textContent.trim();
      }
      return (el.getAttribute("placeholder") || el.getAttribute("aria-label") || el.getAttribute("name") || "").trim();
    };
    const rows = [];
    controls.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const type = el.getAttribute("type") || (tag === "textarea" ? "textarea" : tag === "select" ? "select" : "text");
      const label = labelFor(el);
      if (tag === "select") {
        const optsWrapper = document.createElement("div");
        [...el.options].forEach((o) => {
          const p = document.createElement("p");
          p.textContent = o.textContent.trim();
          optsWrapper.append(p);
        });
        rows.push(["select", label, optsWrapper]);
      } else if (tag === "textarea") {
        rows.push(["textarea", label]);
      } else {
        rows.push([type, label]);
      }
    });
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button');
    const submitLabel = submitBtn ? submitBtn.textContent.trim() || submitBtn.value || "Submit" : "Submit";
    rows.push(["submit", submitLabel]);
    const cells = [["form"], ...rows];
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
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
        '[id*="cookie-consent"]',
        // Contact form JS-only chrome: hidden success/error toasts and spinner.
        // The migrated form block renders its own status message, so these
        // source-only elements must not survive into imported content.
        ".message",
        ".message-error",
        ".loader"
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

  // tools/importer/import-contact-us.js
  var PAGE_TEMPLATE = {
    name: "contact-us",
    description: "Contact Us page: centered intro heading + paragraph with phone number, followed by a multi-field contact form",
    urls: [
      "https://www.kellanovaawayfromhome.com/en-us/contact-us.html"
    ],
    blocks: [
      { name: "form", instances: ["#skip-main-content div.contact-field.contact-us-style"] }
    ],
    sections: [
      { id: "cu-intro", name: "Intro", selector: "#skip-main-content div.content_wrapper", style: null, blocks: [], defaultContent: ["#skip-main-content div.content_wrapper h1", "#skip-main-content div.content_wrapper p"] },
      { id: "cu-form", name: "Contact form", selector: "#skip-main-content div.contact-field.contact-us-style", style: null, blocks: ["form"], defaultContent: [] }
    ]
  };
  var parsers = {
    form: parse
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
  var import_contact_us_default = {
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
  return __toCommonJS(import_contact_us_exports);
})();
