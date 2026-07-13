/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-logos. Base: cards.
 * Source: https://www.kellanovaawayfromhome.com/
 * Brand logo grid: each `.featured-item` is one card — a brand logo <img>
 * wrapped in an external link, with no caption text.
 * 2-column cards row: [logo image linked] | [empty text cell].
 */
export default function parse(element, { document }) {
  // Each brand is a `.featured-item` holding an anchor around a logo image.
  let items = Array.from(element.querySelectorAll('.featured-item'));
  // Fallback: any anchor that wraps an image.
  if (!items.length) {
    items = Array.from(element.querySelectorAll('a')).filter((a) => a.querySelector('img'));
  }

  const cells = [];

  items.forEach((item) => {
    const anchor = item.matches('a') ? item : item.querySelector('a');
    const img = item.querySelector('img');
    if (!img) return;

    // Keep the logo linked: reuse the source anchor around the image.
    let imageCell = img;
    if (anchor) {
      const link = document.createElement('a');
      const href = anchor.getAttribute('href');
      if (href) link.href = href;
      const target = anchor.getAttribute('target');
      if (target) link.setAttribute('target', target);
      link.appendChild(img);
      imageCell = link;
    }

    // No caption on these cards — second cell is intentionally empty.
    cells.push([imageCell, '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards (logos)', cells });
  element.replaceWith(block);
}
