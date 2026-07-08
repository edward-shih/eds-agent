/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-gallery. Base: columns.
 * Source: https://wknd-trendsetters.site (homepage)
 * Generated: 2026-07-08
 *
 * Block library structure (Columns): first row = block name; subsequent rows
 * have one cell per column. This variant is an image-only gallery laid out on a
 * 4-column desktop grid (desktop-4-column). The 8 gallery images are grouped
 * into rows of 4 cells to match the 4-column layout; every row keeps the same
 * column count.
 */
export default function parse(element, { document }) {
  const COLUMNS = 4;

  // Each direct-child div is one gallery cell (holds a cover image).
  let items = Array.from(element.querySelectorAll(':scope > div'));
  // Fallback: if no wrapper divs, use the images directly.
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('img.cover-image, img'));
  }

  // Empty-block guard.
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  for (let i = 0; i < items.length; i += COLUMNS) {
    const row = items.slice(i, i + COLUMNS);
    // Pad the final row so every row has the same number of columns.
    while (row.length < COLUMNS) row.push('');
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-gallery', cells });
  element.replaceWith(block);
}
