/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-feature. Base: hero.
 * Source: https://wknd-trendsetters.site (homepage)
 * Generated: 2026-07-08
 *
 * Block library structure (Hero): 1 column, 3 rows.
 *   Row 1: block name
 *   Row 2: Background Image(s) (optional)
 *   Row 3: Title (heading), Subheading, Call-to-Action(s)
 */
export default function parse(element, { document }) {
  // The hero content is split into two grid columns in the source:
  //   - a text column (heading + subheading + button group)
  //   - an image column (one or more cover images)
  // Text column: prefer the div that holds the heading/subheading/buttons.
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subhead"], p');
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a, a.button'),
  );
  // Image column: all hero/cover images.
  const images = Array.from(
    element.querySelectorAll('img.cover-image, img[class*="cover"], img'),
  );

  // Empty-block guard.
  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2 — background/hero image(s).
  if (images.length > 0) {
    cells.push([images]);
  }

  // Row 3 — title, subheading, CTAs (single cell holding all elements).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-feature', cells });
  element.replaceWith(block);
}
