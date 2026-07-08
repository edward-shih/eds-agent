/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site (homepage)
 * Generated: 2026-07-08
 *
 * Block library structure (Cards): 2 columns; first row = block name; each
 * subsequent row is one card: [Image | Text content].
 *   - Cell 1: card image.
 *   - Cell 2: category tag + date (meta) + title. The card links to a blog
 *     post, so a CTA link to that post is appended to preserve the href.
 */
export default function parse(element, { document }) {
  // Each card is an <a class="article-card">.
  const cards = Array.from(
    element.querySelectorAll(':scope > a.article-card, a.article-card, :scope > .article-card'),
  );

  // Empty-block guard.
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cards.forEach((card) => {
    // Cell 1 — image.
    const image = card.querySelector('.article-card-image img, img');

    // Cell 2 — text content (meta + title + CTA link).
    const textCell = [];
    const meta = card.querySelector('.article-card-meta');
    if (meta) textCell.push(meta);
    const heading = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
    if (heading) textCell.push(heading);

    // Preserve the card's link target as a CTA.
    const href = card.getAttribute('href');
    if (href) {
      const cta = document.createElement('a');
      cta.setAttribute('href', href);
      cta.textContent = heading ? heading.textContent.trim() : 'Read more';
      textCell.push(cta);
    }

    cells.push([image || '', textCell.length ? textCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
