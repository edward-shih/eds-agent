/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the Recipes search results grid.
 * Base: cards, variant: feature. Source: recipes.html (search app; results captured statically).
 *
 * Cards convention — 2-column table, one card per row:
 *   cell 1: image (mandatory)
 *   cell 2: text content — title (heading) + "View Recipe" call-to-action (linked)
 * Each `.featured-item` is a recipe tile: a photo linking to the recipe page,
 * a title, and a "View Recipe" CTA.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.featured-item'));

  const cells = [];
  items.forEach((item) => {
    const anchor = item.querySelector('a');
    const img = item.querySelector('img');
    if (!img || !anchor) return;

    const href = anchor.getAttribute('href');
    const titleEl = item.querySelector('.featured-item-title');
    const title = (titleEl ? titleEl.textContent : img.getAttribute('alt') || '').trim();

    // Cell 1: image (mandatory).
    const imageCell = img;

    // Cell 2: text content — title as heading + View Recipe CTA link.
    const body = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = title;
    const cta = document.createElement('a');
    if (href) cta.href = href;
    cta.textContent = 'View Recipe';
    body.append(heading, cta);

    cells.push([imageCell, body]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards (feature)', cells });
  element.replaceWith(block);
}
