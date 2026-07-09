import { getMetadata } from '../../scripts/aem.js';

// media query that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/** Collapse all open dropdowns. */
function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
  });
}

/** Toggle the mobile drawer open/closed. */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  if (expanded || isDesktop.matches) closeAllDropdowns(nav);
}

/** Reset nav state when crossing the desktop/mobile boundary. */
function handleViewportChange(nav) {
  closeAllDropdowns(nav);
  if (isDesktop.matches) {
    nav.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
    const button = nav.querySelector('.nav-hamburger button');
    if (button) button.setAttribute('aria-label', 'Open navigation');
  }
}

/** Wire a dropdown li: hover opens on desktop; click on the label toggles (mobile + a11y). */
function decorateDrop(li, nav) {
  li.classList.add('nav-drop');
  li.setAttribute('aria-expanded', 'false');

  li.addEventListener('mouseenter', () => {
    if (isDesktop.matches) {
      closeAllDropdowns(nav);
      li.setAttribute('aria-expanded', 'true');
    }
  });
  li.addEventListener('mouseleave', () => {
    if (isDesktop.matches) li.setAttribute('aria-expanded', 'false');
  });

  // chevron toggle button (does not navigate) — added next to the top link
  const toggle = li.querySelector(':scope > .nav-drop-toggle');
  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = li.getAttribute('aria-expanded') === 'true';
      if (!isDesktop.matches) closeAllDropdowns(nav);
      li.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('header') || getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/header';

  // dual-fetch: localhost/aem up serves the content path; DA/EDS serves navPath.plain.html
  let navBase = '/content/';
  let resp = await fetch('/content/header.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${navPath}.plain.html`);
    navBase = `${navPath.substring(0, navPath.lastIndexOf('/') + 1)}`;
  }
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  // resolve relative image paths against the nav document location
  fragment.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith('/')) {
      img.setAttribute('src', navBase + src);
    }
  });

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // three sections: utility bar, brand, main nav
  const classes = ['utility', 'brand', 'sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((li) => {
      const submenu = li.querySelector(':scope > ul');
      if (submenu) {
        submenu.classList.add('nav-dropdown');
        // add a chevron toggle button after the top-level link
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'nav-drop-toggle';
        toggle.setAttribute('aria-label', 'Toggle submenu');
        // the top-level link may be wrapped in a <p> (DA export) or be a direct child
        const topLink = li.querySelector(':scope > a, :scope > p > a');
        (topLink.closest('p') || topLink).after(toggle);
        decorateDrop(li, nav);
      }
    });
  }

  // search icon button (built in JS per contract — not in the plain fragment)
  const navTools = document.createElement('div');
  navTools.className = 'nav-tools';
  navTools.innerHTML = '<button type="button" class="nav-search" aria-label="Search"><span class="nav-search-icon"></span></button>';
  nav.append(navTools);

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  if (navSections) closeAllDropdowns(nav);
  isDesktop.addEventListener('change', () => handleViewportChange(nav));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
