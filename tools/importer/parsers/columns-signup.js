/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-signup. Base: columns.
 * Source: https://www.kellanovaawayfromhome.com/
 * "Stay ahead of the Crave" signup: a single 2-column row.
 * Cell 1: heading + paragraph copy. Cell 2: the "Sign Up" CTA.
 * Source uses a <button> (JS-driven modal, no navigable target) — represent it as
 * a CTA link when a target exists, otherwise as plain CTA text.
 */
export default function parse(element, { document }) {
  // Left column: heading + descriptive paragraph(s).
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  const paragraphs = Array.from(element.querySelectorAll('p'));

  const copyCell = [];
  if (heading) copyCell.push(heading);
  copyCell.push(...paragraphs);

  // Right column: the Sign Up CTA. Prefer an existing link; otherwise convert
  // the <button> into a CTA link/text (no backend action to preserve).
  const ctaLink = element.querySelector('a');
  const ctaButton = element.querySelector('button');
  let ctaCell = '';
  if (ctaLink) {
    ctaCell = ctaLink;
  } else if (ctaButton) {
    const label = ctaButton.textContent.trim();
    const link = document.createElement('a');
    link.href = '#signup';
    link.textContent = label || 'Sign Up';
    ctaCell = link;
  }

  if (!copyCell.length && !ctaCell) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single 2-column row: [heading + paragraph] | [Sign Up CTA].
  const cells = [[copyCell, ctaCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns (signup)', cells });
  element.replaceWith(block);
}
