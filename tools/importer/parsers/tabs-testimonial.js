/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site (homepage)
 * Generated: 2026-07-08
 *
 * Block library structure (Tabs): 2 columns; first row = block name; each
 * subsequent row is one tab: [Tab Label | Tab Content].
 *
 * Source layout:
 *   - .tabs-content > .tab-pane (one per tab) holds the tab content:
 *       image + name + role + quote.
 *   - .tab-menu > button.tab-menu-link (one per tab) holds the tab label
 *       (avatar + name + role). The name is used as the tab label text.
 * Panes and buttons pair up by order/index.
 */
export default function parse(element, { document }) {
  const panes = Array.from(
    element.querySelectorAll('.tabs-content > .tab-pane, .tab-pane'),
  );
  const buttons = Array.from(
    element.querySelectorAll('.tab-menu .tab-menu-link, button.tab-menu-link'),
  );

  // Empty-block guard.
  if (panes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  panes.forEach((pane, i) => {
    // Tab label: prefer the matching menu button's name (first strong text),
    // fall back to the pane's own name, then a generic label.
    const button = buttons[i];
    let label = '';
    if (button) {
      const nameEl = button.querySelector('strong');
      label = nameEl ? nameEl.textContent.trim() : button.textContent.trim();
    }
    if (!label) {
      const paneName = pane.querySelector('strong');
      label = paneName ? paneName.textContent.trim() : `Tab ${i + 1}`;
    }

    // Tab content: the entire pane inner content (image + name + role + quote).
    const contentSource = pane.querySelector(':scope > .grid-layout') || pane;
    const content = Array.from(contentSource.children);

    cells.push([label, content.length ? content : contentSource]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
