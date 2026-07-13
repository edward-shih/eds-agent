/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://www.kellanovaawayfromhome.com/
 * Each slide (`.hero-slide`) becomes one carousel row: [image] | [optional CTA link].
 * Slides may be an <a class="hero-slide"> (linked) or a <div class="hero-slide"> (no link).
 */
export default function parse(element, { document }) {
  // Slides carry class `hero-slide`; the tns slider may clone/wrap them at runtime,
  // so search descendants (not only direct children) and drop tns clones.
  let slides = Array.from(element.querySelectorAll('.hero-slide'))
    .filter((s) => !s.closest('.tns-slide-cloned') && !s.classList.contains('tns-slide-cloned'));

  // Fallback: if no `.hero-slide` markers exist, treat each direct <a>/<div> holding an image as a slide.
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll(':scope > a, :scope > div'))
      .filter((s) => s.querySelector('img'));
  }

  // Note: WebImporter.Blocks.createBlock() prepends the block-name header row,
  // so `cells` must contain only slide rows (no manual header).
  const cells = [];

  slides.forEach((slide) => {
    // Image (mandatory) - prefer the <picture>, fall back to the <img>.
    const image = slide.querySelector('picture') || slide.querySelector('img');

    // Optional CTA: if the slide itself is a link, build a CTA link from its href.
    let ctaCell = '';
    const href = slide.tagName === 'A' ? slide.getAttribute('href') : null;
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      const img = slide.querySelector('img');
      link.textContent = (img && img.getAttribute('alt')) || href;
      ctaCell = link;
    }

    if (image) {
      cells.push([image, ctaCell]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel (hero)', cells });
  element.replaceWith(block);
}
