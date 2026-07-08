/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site (homepage)
 * Generated: 2026-07-08
 *
 * Block library structure (Columns): first row = block name; subsequent rows
 * have one cell per column based on the natural visual grouping.
 * This variant is a featured article laid out in two columns:
 *   - Column 1: cover image
 *   - Column 2: breadcrumb + heading + author/date meta
 */
export default function parse(element, { document }) {
  // The grid holds the columns as its direct children.
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard.
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // One content row where each direct-child div becomes a column cell.
  cells.push(columns);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
