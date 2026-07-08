/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section breaks + section metadata.
 *
 * Driven by payload.template.sections from tools/importer/page-templates.json.
 * The homepage template defines 7 sections (rc2..rc8). For each section:
 *   - insert an <hr> section break before it (except the first section)
 *   - append a "Section Metadata" block when section.style is set
 *
 * Sections with a style (from the template): rc2 "secondary", rc4 "secondary",
 * rc6 "secondary" => 3 Section Metadata blocks. Section breaks => 7 - 1 = 6 <hr>.
 *
 * Section selectors are the template's `selector` values, all verified against
 * migration-work/cleaned.html.
 *
 * Runs in afterTransform only (section structure is post-parse).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const sections = payload && payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Process in reverse so inserting nodes does not shift not-yet-processed sections.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const target = element.querySelector(section.selector);
    if (!target) {
      // eslint-disable-next-line no-console
      console.warn(`Section selector did not match: ${section.selector}`);
      continue;
    }

    // Append Section Metadata block for sections that declare a style.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      target.append(metaBlock);
    }

    // Insert a section break before every section except the first.
    if (i > 0) {
      target.before(doc.createElement('hr'));
    }
  }
}
