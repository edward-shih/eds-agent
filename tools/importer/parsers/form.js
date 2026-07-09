/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the form block. Base: new block.
 * Source: https://www.kellanovaawayfromhome.com/en-us/contact-us.html
 * Reads the source <form> controls and emits a table where each row is:
 *   [ field-type, label(+* if required), options (one per line, selects only) ]
 * A trailing [ 'submit', <button label> ] row carries the submit button text.
 * The block JS (blocks/form/form.js) rebuilds a working <form> from this table.
 */
export default function parse(element, { document }) {
  const form = element.matches('form') ? element : element.querySelector('form');
  if (!form) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const controls = [...form.querySelectorAll('input, select, textarea')];

  const labelFor = (el) => {
    if (el.id) {
      const l = form.querySelector(`label[for="${el.id}"]`);
      if (l) return l.textContent.trim();
    }
    return (
      el.getAttribute('placeholder')
      || el.getAttribute('aria-label')
      || el.getAttribute('name')
      || ''
    ).trim();
  };

  const rows = [];
  controls.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const type = el.getAttribute('type') || (tag === 'textarea' ? 'textarea' : tag === 'select' ? 'select' : 'text');
    const label = labelFor(el);

    if (tag === 'select') {
      const optsWrapper = document.createElement('div');
      [...el.options].forEach((o) => {
        const p = document.createElement('p');
        p.textContent = o.textContent.trim();
        optsWrapper.append(p);
      });
      rows.push(['select', label, optsWrapper]);
    } else if (tag === 'textarea') {
      rows.push(['textarea', label]);
    } else {
      rows.push([type, label]);
    }
  });

  const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button');
  const submitLabel = submitBtn ? (submitBtn.textContent.trim() || submitBtn.value || 'Submit') : 'Submit';
  rows.push(['submit', submitLabel]);

  const cells = [['form'], ...rows];
  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
