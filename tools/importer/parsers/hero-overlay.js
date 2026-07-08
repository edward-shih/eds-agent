/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://wknd-trendsetters.site (homepage)
 * Generated: 2026-07-08
 *
 * Block library structure (Hero): 1 column, 3 rows.
 *   Row 1: block name
 *   Row 2: Background Image (optional) — the full-bleed banner image
 *   Row 3: Title (heading), Subheading, Call-to-Action
 */
export default function parse(element, { document }) {
  // Background image (the overlay banner image).
  const bgImage = element.querySelector(
    'img.cover-image, img[class*="overlay"], img',
  );

  // Foreground content lives in the card body over the overlay.
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subhead"], p');
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a, a.button'),
  );

  // Empty-block guard.
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2 — background image.
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3 — title, subheading, CTA(s) in a single cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
