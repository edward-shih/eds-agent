/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-imagecopy. Base: columns.
 * Source: https://www.kellanovaawayfromhome.com/
 * "Our Food" image + copy: a single 2-column row.
 * Cell 1: the image. Cell 2: heading + paragraph(s) + CTA link.
 */
export default function parse(element, { document }) {
  // Image (left column) — prefer <picture>, fall back to a bare <img>.
  const imageContainer = element.querySelector('.block-image') || element;
  const image = imageContainer.querySelector('picture') || imageContainer.querySelector('img');

  // Copy (right column) — heading, body paragraphs, and CTA link.
  const copyContainer = element.querySelector('.rich-text') || element.querySelector('.block-caption') || element;
  const heading = copyContainer.querySelector('h1, h2, h3, h4, h5, h6');
  const paragraphs = Array.from(copyContainer.querySelectorAll('p'));
  const ctas = Array.from(copyContainer.querySelectorAll('a'));

  const copyCell = [];
  if (heading) copyCell.push(heading);
  copyCell.push(...paragraphs);
  copyCell.push(...ctas);

  if (!image && !copyCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single 2-column row: [image] | [heading + paragraphs + CTA].
  const cells = [[image || '', copyCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns (imagecopy)', cells });
  element.replaceWith(block);
}
