/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsSegmentsParser from './parsers/cards-segments.js';
import columnsImagecopyParser from './parsers/columns-imagecopy.js';
import cardsLogosParser from './parsers/cards-logos.js';
import carouselRecipeParser from './parsers/carousel-recipe.js';
import columnsSignupParser from './parsers/columns-signup.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/kellanova-cleanup.js';
import sectionsTransformer from './transformers/kellanova-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Kellanova Away From Home homepage: hero carousel, segments icon grid, Our Food image+copy block, brands logo grid, recipe inspiration carousel, and a newsletter signup CTA',
  urls: [
    'https://www.kellanovaawayfromhome.com/',
  ],
  blocks: [
    { name: 'carousel-hero', instances: ['#skip-main-content > div.hero div.js-slider'] },
    { name: 'cards-segments', instances: ['#skip-main-content div.segment-nav'] },
    { name: 'columns-imagecopy', instances: ['#skip-main-content > div.image-copy-block'] },
    { name: 'cards-logos', instances: ['#skip-main-content > div.mannualfeaturelist'] },
    { name: 'carousel-recipe', instances: ['#skip-main-content > div.featureditemlistautomatic'] },
    { name: 'columns-signup', instances: ['#skip-main-content div.email-signup-row'] },
  ],
  sections: [
    { id: 'rc2c4c2', name: 'Hero carousel', selector: '#skip-main-content > div.hero', style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 'rc2c4c3', name: 'Segments intro', selector: '#skip-main-content > div.markuptext.section--in-viewport:nth-of-type(3)', style: null, blocks: [], defaultContent: ['#skip-main-content > div.markuptext.section--in-viewport:nth-of-type(3) h2', '#skip-main-content > div.markuptext.section--in-viewport:nth-of-type(3) p'] },
    { id: 'rc2c4c4', name: 'Segments icon grid', selector: '#skip-main-content > div.markuptext.section--in-viewport:nth-of-type(4)', style: null, blocks: ['cards-segments'], defaultContent: [] },
    { id: 'rc2c4c5', name: 'Our Food image + copy', selector: '#skip-main-content > div.image-copy-block', style: null, blocks: ['columns-imagecopy'], defaultContent: [] },
    { id: 'rc2c4c6', name: 'Brands intro', selector: '#skip-main-content > div.markuptext:nth-of-type(6)', style: null, blocks: [], defaultContent: ['#skip-main-content > div.markuptext:nth-of-type(6) h2', '#skip-main-content > div.markuptext:nth-of-type(6) p'] },
    { id: 'rc2c4c7', name: 'Brands logo grid', selector: '#skip-main-content > div.mannualfeaturelist', style: null, blocks: ['cards-logos'], defaultContent: [] },
    { id: 'rc2c4c8', name: 'Explore Our Brands button', selector: '#skip-main-content > div.markuptext:nth-of-type(8)', style: null, blocks: [], defaultContent: ['#skip-main-content > div.markuptext:nth-of-type(8) a'] },
    { id: 'rc2c4c9', name: 'Menu inspiration heading', selector: '#skip-main-content > div.markuptext:nth-of-type(9)', style: null, blocks: [], defaultContent: ['#skip-main-content > div.markuptext:nth-of-type(9) h2'] },
    { id: 'rc2c4c10', name: 'Recipes carousel', selector: '#skip-main-content > div.featureditemlistautomatic', style: null, blocks: ['carousel-recipe'], defaultContent: [] },
    { id: 'rc2c4c11', name: 'Signup CTA', selector: '#skip-main-content > div.markuptext:last-of-type', style: null, blocks: ['columns-signup'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-segments': cardsSegmentsParser,
  'columns-imagecopy': columnsImagecopyParser,
  'cards-logos': cardsLogosParser,
  'carousel-recipe': carouselRecipeParser,
  'columns-signup': columnsSignupParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name, selector, element, section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
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

    // 4. afterTransform (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (root '/' -> '/index' to avoid empty-path resolution)
    let pathname = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    if (!pathname) {
      pathname = '/index';
    }
    const path = WebImporter.FileUtils.sanitizePath(pathname);

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
