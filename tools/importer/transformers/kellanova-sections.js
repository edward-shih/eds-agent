/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kellanova Away From Home — section structure.
 *
 * Inserts EDS section breaks (<hr>) between the 10 content sections of the
 * homepage template. Section selectors are taken verbatim from
 * tools/importer/page-templates.json (each verified against
 * migration-work/cleaned.html).
 *
 * All sections have style === null, so NO Section Metadata blocks are created.
 * The two red blocks (Our Food, Signup CTA) carry their background in their own
 * block variants, not via section metadata.
 *
 * Section breaks: one <hr> before every section except the first
 * (expected count = sections.length - 1).
 *
 * Runs in afterTransform only.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;

    const doc = element.ownerDocument;

    // Process in reverse so inserted <hr>/metadata never shift later selectors.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Section Metadata block only when the section defines a style.
      // All Kellanova homepage sections have style === null, so this is a no-op
      // here but kept for correctness/reuse across templates.
      if (section.style) {
        const meta = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(meta);
      }

      // Section break before every non-first section, when content precedes it.
      if (i > 0 && sectionEl.previousElementSibling) {
        sectionEl.before(doc.createElement('hr'));
      }
    }
  }
}
