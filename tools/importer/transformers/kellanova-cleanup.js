/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kellanova Away From Home — site-wide cleanup.
 *
 * Source is classic AEM (responsivegrid). The scraped cleaned.html already
 * narrows to <main id="skip-main-content">, so the site header/top-nav, footer,
 * skip-link, and cookie-consent are typically absent — but we defensively strip
 * any stray occurrences so imported content never contains EDS-owned chrome
 * (header/footer are auto-populated by EDS).
 *
 * All selectors below were verified against migration-work/cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Non-authorable site chrome: EDS auto-populates header/footer/nav, so any
    // stray occurrences must not survive into imported content.
    // (Not present in cleaned.html today; removed defensively per site policy.)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '.skip-link',
      '#onetrust-consent-sdk',
      '#CybotCookiebotDialog',
      '[class*="cookie-consent"]',
      '[id*="cookie-consent"]',
      // Contact form JS-only chrome: hidden success/error toasts and spinner.
      // The migrated form block renders its own status message, so these
      // source-only elements must not survive into imported content.
      '.message',
      '.message-error',
      '.loader',
    ]);

    // NOTE: cleaned.html has an empty leading <div class="markuptext ...">.
    // It is intentionally NOT removed here: the section transformer
    // (kellanova-sections.js) relies on :nth-of-type() selectors from
    // page-templates.json that count this div in their ordinals. Removing it in
    // beforeTransform would shift every nth-of-type index and break section
    // detection. The empty div carries no authorable content and collapses to
    // nothing in EDS, so it is harmless to leave in place.
  }

  if (hookName === TransformHook.afterTransform) {
    // Safe leftover element removal (present as <source> inside <picture> in DOM).
    WebImporter.DOMUtils.remove(element, [
      'source',
      'iframe',
      'link',
      'noscript',
    ]);

    // Strip AEM grid/viewport wrapper helper classes and tracking data-* attrs.
    // Verified in cleaned.html: aem-GridColumn* classes, section--in-viewport
    // helper class, and data-tracking on .segment-nav / .track anchors.
    element.querySelectorAll('*').forEach((el) => {
      // Remove tracking attributes.
      el.removeAttribute('data-tracking');

      // Remove AEM grid + in-viewport helper classes without touching real classes.
      if (el.classList && el.classList.length) {
        const toRemove = [];
        el.classList.forEach((cls) => {
          if (cls.startsWith('aem-GridColumn') || cls === 'aem-Grid' || cls === 'section--in-viewport') {
            toRemove.push(cls);
          }
        });
        toRemove.forEach((cls) => el.classList.remove(cls));
        if (el.classList.length === 0) {
          el.removeAttribute('class');
        }
      }
    });
  }
}
