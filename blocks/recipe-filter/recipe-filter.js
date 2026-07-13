// Recipe filter: search box + faceted checkboxes that filter the sibling
// `.cards.feature` recipe grid entirely client-side. Facet options are derived
// from each recipe card's hidden "tags:" line (Group: Value; Group: Value ...).

const GROUP_ORDER = ['Course', 'Brand', 'Category', 'Segment'];

/** Parse a card's hidden tags line into { group: [values] }. */
function parseTags(text) {
  const groups = {};
  text.replace(/^\s*tags:\s*/i, '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const idx = pair.indexOf(':');
      if (idx < 0) return;
      const group = pair.slice(0, idx).trim();
      const value = pair.slice(idx + 1).trim();
      if (!group || !value) return;
      (groups[group] ||= []).push(value);
    });
  return groups;
}

/** Run cb once the cards block has been decorated into a <ul> of <li> cards. */
function onCardsReady(grid, cb) {
  if (grid.querySelector('li')) { cb(); return; }
  const obs = new MutationObserver(() => {
    if (grid.querySelector('li')) { obs.disconnect(); cb(); }
  });
  obs.observe(grid, { childList: true, subtree: true });
}

function build(block, grid) {
  const cards = [...grid.querySelectorAll(':scope > ul > li')];
  const facets = {}; // group -> Set(values)

  cards.forEach((card) => {
    const body = card.querySelector('.cards-card-body') || card;
    // the tags line is the paragraph whose text starts with "tags:"
    const tagP = [...body.querySelectorAll('p')].find((p) => /^\s*tags:/i.test(p.textContent));
    const tags = tagP ? parseTags(tagP.textContent) : {};
    if (tagP) tagP.remove();

    // store normalized tags on the card for filtering
    const flat = [];
    Object.entries(tags).forEach(([group, values]) => {
      values.forEach((v) => {
        flat.push(`${group}||${v}`);
        (facets[group] ||= new Set()).add(v);
      });
    });
    card.dataset.tags = flat.join('§');
    const title = card.querySelector('h1,h2,h3,h4,h5,h6');
    card.dataset.title = (title ? title.textContent : card.textContent).toLowerCase();
  });

  // build UI
  block.textContent = '';
  const form = document.createElement('form');
  form.className = 'recipe-filter-form';
  form.setAttribute('role', 'search');

  const searchWrap = document.createElement('div');
  searchWrap.className = 'recipe-filter-search';
  const search = document.createElement('input');
  search.type = 'search';
  search.placeholder = 'Type your search here';
  search.setAttribute('aria-label', 'Search recipes');
  searchWrap.append(search);
  form.append(searchWrap);

  const facetsWrap = document.createElement('div');
  facetsWrap.className = 'recipe-filter-facets';

  GROUP_ORDER.filter((g) => facets[g]).forEach((group) => {
    const fs = document.createElement('fieldset');
    fs.className = 'recipe-filter-group';
    const legend = document.createElement('legend');
    legend.textContent = group;
    fs.append(legend);
    [...facets[group]].sort().forEach((value) => {
      const id = `rf-${group}-${value}`.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      const label = document.createElement('label');
      label.setAttribute('for', id);
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.id = id;
      cb.value = `${group}||${value}`;
      cb.dataset.group = group;
      label.append(cb, document.createTextNode(value));
      fs.append(label);
    });
    facetsWrap.append(fs);
  });
  form.append(facetsWrap);

  const status = document.createElement('p');
  status.className = 'recipe-filter-count';
  status.setAttribute('role', 'status');
  form.append(status);

  block.append(form);

  const apply = () => {
    const term = search.value.trim().toLowerCase();
    // collect checked values grouped
    const checkedByGroup = {};
    form.querySelectorAll('input[type="checkbox"]:checked').forEach((cb) => {
      (checkedByGroup[cb.dataset.group] ||= []).push(cb.value);
    });
    let visible = 0;
    cards.forEach((card) => {
      const cardTags = (card.dataset.tags || '').split('§');
      const matchesSearch = !term || (card.dataset.title || '').includes(term);
      // AND across groups, OR within a group
      const matchesFacets = Object.values(checkedByGroup).every(
        (vals) => vals.some((v) => cardTags.includes(v)),
      );
      const show = matchesSearch && matchesFacets;
      card.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });
    status.textContent = `Showing ${visible} of ${cards.length} recipes`;
  };

  form.addEventListener('input', apply);
  form.addEventListener('submit', (e) => e.preventDefault());
  apply();
}

export default function decorate(block) {
  const main = block.closest('main');
  const grid = main && main.querySelector('.cards');
  if (!grid) { block.textContent = ''; return; }

  // Do not await card decoration here — that would deadlock section load
  // (this block and the cards block are in the same section). Build the UI
  // once the cards have been decorated into <li> items.
  onCardsReady(grid, () => build(block, grid));
}
