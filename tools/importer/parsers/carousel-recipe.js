/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-recipe. Base: carousel.
 * Source: https://www.kellanovaawayfromhome.com/
 * Recipe slider: each `.featured-item` is one slide — an <a> wrapping a recipe
 * image and a title.
 * 2-column carousel row: [recipe image] | [linked title].
 */
export default function parse(element, { document }) {
  // Each recipe slide is a `.featured-item` holding an anchor with image + title.
  let items = Array.from(element.querySelectorAll('.featured-item'));
  // Fallback: any anchor that wraps an image.
  if (!items.length) {
    items = Array.from(element.querySelectorAll('a')).filter((a) => a.querySelector('img'));
  }

  const cells = [];

  items.forEach((item) => {
    const anchor = item.matches('a') ? item : item.querySelector('a');
    const image = item.querySelector('picture') || item.querySelector('img');
    const titleText = (item.querySelector('.featured-item-title, .featured-item-description') || anchor || item)
      .textContent.trim();
    const href = anchor ? anchor.getAttribute('href') : null;

    // Title cell: linked title (reuses the slide's recipe URL).
    let titleCell;
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = titleText;
      titleCell = link;
    } else {
      titleCell = titleText;
    }

    if (image) {
      cells.push([image, titleCell]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel (recipe)', cells });
  element.replaceWith(block);
}
