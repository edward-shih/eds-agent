/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-segments. Base: cards.
 * Source: https://www.kellanovaawayfromhome.com/
 * Segment icon grid: each `.segment-nav > a` is one card.
 * 2-column cards row: [icon image] | [linked label]. Label link reuses the card's href.
 */
export default function parse(element, { document }) {
  // Each segment is an anchor containing an <img> icon and a <span> label.
  const items = Array.from(element.querySelectorAll('a'))
    .filter((a) => a.querySelector('img'));

  const cells = [];

  items.forEach((item) => {
    const icon = item.querySelector('img');
    const labelText = (item.querySelector('span') || item).textContent.trim();
    const href = item.getAttribute('href');

    // Text cell: label as a linked CTA (preserves destination for the card).
    let textCell;
    if (href) {
      const link = document.createElement('a');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-segments', cells });
  element.replaceWith(block);
}
