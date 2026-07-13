/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the "Power of our Brands" download grid on the Core Assortment page.
 * Base: cards, variant: feature. Source: core-assortment.html.
 *
 * Cards convention — 2-column table, one card per row:
 *   cell 1: image (mandatory)
 *   cell 2: text content — title (heading) + Download call-to-action (linked)
 * Each `.featured-item` is a brand tile: a logo thumbnail linking to a
 * downloadable .zip, with a title and a "Download" CTA.
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

    // Cell 2: text content — title as heading + Download CTA link.
    const body = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = title;
    const cta = document.createElement('a');
    if (href) cta.href = href;
    cta.setAttribute('target', '_blank');
    cta.textContent = 'Download';
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
