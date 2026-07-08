/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site (homepage)
 * Generated: 2026-07-08
 *
 * Block library structure (Accordion): 2 columns; first row = block name; each
 * subsequent row is one accordion item: [Title | Content].
 *
 * Source layout: .faq-list > details.faq-item, each with
 *   - summary.faq-question (the question) -> Title cell
 *   - .faq-answer (the answer) -> Content cell
 */
export default function parse(element, { document }) {
  const items = Array.from(
    element.querySelectorAll(':scope > details.faq-item, details.faq-item, .faq-item'),
  );

  // Empty-block guard.
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    const question = item.querySelector('.faq-question, summary');
    const answer = item.querySelector('.faq-answer');

    // Prefer the inner text span for the title if present (drop the summary
    // marker/chrome), otherwise use the question element itself.
    let titleCell = '';
    if (question) {
      const span = question.querySelector('span');
      titleCell = span || question;
    }

    cells.push([titleCell, answer || '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
