// Placeholder submission endpoint — swap in the real form service URL later.
const FORM_ENDPOINT = 'FORM_ENDPOINT';

let fieldCounter = 0;

/** Split a cell into non-empty trimmed lines (one per <p>/<br> or newline). */
function readLines(cell) {
  if (!cell) return [];
  const fromParas = [...cell.querySelectorAll('p, li')].map((p) => p.textContent.trim());
  const lines = fromParas.length
    ? fromParas
    : cell.textContent.split('\n').map((s) => s.trim());
  return lines.filter(Boolean);
}

/** A label ending in * is required; return the clean label and the flag. */
function parseLabel(raw) {
  const required = /\*\s*$/.test(raw);
  return { label: raw.replace(/\*\s*$/, '').trim(), required };
}

/** Build one labelled control and return its wrapper element. */
function buildField(type, labelRaw, options, doc) {
  fieldCounter += 1;
  const id = `form-field-${fieldCounter}`;
  const { label, required } = parseLabel(labelRaw);

  const wrapper = doc.createElement('div');
  wrapper.className = `form-field form-field-${type}`;

  if (type === 'checkbox') {
    const input = doc.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.name = id;
    if (required) input.required = true;
    const lab = doc.createElement('label');
    lab.setAttribute('for', id);
    lab.textContent = label;
    wrapper.append(input, lab);
    return wrapper;
  }

  const lab = doc.createElement('label');
  lab.setAttribute('for', id);
  lab.textContent = label;
  if (required) lab.classList.add('required');
  wrapper.append(lab);

  let control;
  if (type === 'select') {
    control = doc.createElement('select');
    options.forEach((opt, i) => {
      const o = doc.createElement('option');
      o.textContent = opt;
      if (i === 0) { o.value = ''; o.disabled = true; o.selected = true; }
      control.append(o);
    });
  } else if (type === 'textarea') {
    control = doc.createElement('textarea');
    control.rows = 5;
  } else {
    control = doc.createElement('input');
    control.type = type;
  }
  control.id = id;
  control.name = id;
  if (required) control.required = true;
  wrapper.append(control);
  return wrapper;
}

/**
 * loads and decorates the form
 * @param {Element} block The form block element
 */
export default function decorate(block) {
  const doc = document;
  const rows = [...block.children];

  const form = doc.createElement('form');
  form.className = 'form-fields';
  form.noValidate = false;

  let submitLabel = 'Submit';

  const fieldTypes = new Set([
    'text', 'email', 'tel', 'number', 'url', 'password',
    'date', 'textarea', 'select', 'checkbox',
  ]);

  rows.forEach((row) => {
    const cells = [...row.children];
    const type = (cells[0]?.textContent || '').trim().toLowerCase();
    if (!type) return;

    if (type === 'submit') {
      submitLabel = (cells[1]?.textContent || 'Submit').trim() || 'Submit';
      return;
    }

    // Ignore the block-name marker row and any unrecognized row.
    if (!fieldTypes.has(type)) return;

    const labelRaw = (cells[1]?.textContent || '').trim();
    const options = readLines(cells[2]);
    form.append(buildField(type, labelRaw, options, doc));
  });

  const actions = doc.createElement('div');
  actions.className = 'form-actions';
  const submit = doc.createElement('button');
  submit.type = 'submit';
  submit.textContent = submitLabel;
  actions.append(submit);
  form.append(actions);

  const status = doc.createElement('p');
  status.className = 'form-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  form.append(status);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    submit.disabled = true;
    status.textContent = 'Sending…';
    try {
      const resp = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!resp.ok) throw new Error(`Request failed: ${resp.status}`);
      status.textContent = 'Thank you — your message has been sent.';
      form.reset();
    } catch (err) {
      status.textContent = 'Sorry, something went wrong. Please try again or call us.';
    } finally {
      submit.disabled = false;
    }
  });

  block.textContent = '';
  block.append(form);
}
