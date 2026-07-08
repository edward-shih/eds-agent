/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 *
 * All selectors below are taken from the captured DOM in
 * migration-work/cleaned.html for https://wknd-trendsetters.site.
 *
 * Removes non-authorable site chrome (skip-link, navbar/header, footer),
 * strips inline base64/data-uri SVG icon <img> tags (nav carets, logos,
 * social icons, breadcrumb chevron, FAQ +/- icons) that are decorative and
 * not authorable, and cleans leftover Astro build attributes.
 *
 * NOTE: The top-level `#main-content > header.section.secondary-section` is
 * authorable page content (the hero intro section, rc2) — it is intentionally
 * NOT removed. Only the standalone `.navbar` chrome and the site `<footer>`
 * are removed.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Strip decorative base64/data-uri SVG icons before block parsing so
    // parsers do not pick up inline SVG data-uris as content images.
    // Found in captured DOM: <img src="data:image/svg+xml;base64,...">
    element.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => img.remove());
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome (auto-populated header/footer + skip link).
    // Found in captured DOM:
    //   <a href="#main-content" class="skip-link">Skip to main content</a>
    //   <div class="navbar"> ... </div>            (header/nav shell — auto-populated)
    //   <footer class="footer inverse-footer"> ... </footer>  (auto-populated)
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer',
    ]);

    // Clean leftover Astro build data attributes.
    // Found in captured DOM: data-astro-cid-37fxchfa (body),
    // data-astro-cid-rbygaycu (FAQ svg/line elements).
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-cid-')) {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
