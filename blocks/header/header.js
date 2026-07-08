import { getMetadata } from '../../scripts/aem.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Collapse all open nav dropdowns/megamenus.
 * @param {Element} navSections The sections container
 */
function closeAllSections(navSections) {
  navSections.querySelectorAll(':scope .nav-drop[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toggle the mobile menu open/closed.
 * @param {Element} nav
 * @param {Element} navSections
 * @param {boolean|null} forceExpanded
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
  if (expanded || isDesktop.matches) closeAllSections(navSections);
}

/**
 * Reset nav state when the viewport crosses the desktop/mobile boundary.
 * @param {Element} nav
 * @param {Element} navSections
 */
function handleViewportChange(nav, navSections) {
  closeAllSections(navSections);
  if (isDesktop.matches) {
    // leaving mobile: ensure drawer is closed and body scroll restored
    nav.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
    const button = nav.querySelector('.nav-hamburger button');
    if (button) button.setAttribute('aria-label', 'Open navigation');
  }
}

/**
 * Wire dropdown/megamenu behavior for a section item.
 * Desktop: hover opens, pointer-leave closes. All viewports: click toggles.
 * @param {Element} li
 * @param {Element} navSections
 */
function decorateDrop(li, navSections) {
  li.setAttribute('aria-expanded', 'false');

  li.addEventListener('mouseenter', () => {
    if (isDesktop.matches) {
      closeAllSections(navSections);
      li.setAttribute('aria-expanded', 'true');
    }
  });
  li.addEventListener('mouseleave', () => {
    if (isDesktop.matches) li.setAttribute('aria-expanded', 'false');
  });

  // Click on the label toggles (needed for mobile; harmless on desktop)
  const label = li.querySelector(':scope > .nav-drop-label');
  if (label) {
    label.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = li.getAttribute('aria-expanded') === 'true';
      if (!isDesktop.matches) closeAllSections(navSections);
      li.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // resolve nav path (metadata override, else default doc)
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  // dual-fetch: localhost/aem up serves the content path; DA/EDS serves navPath.plain.html
  let navBase = '/content/';
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${navPath}.plain.html`);
    navBase = `${navPath.substring(0, navPath.lastIndexOf('/') + 1)}`;
  }
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  // resolve relative image paths (e.g. images/foo.svg) against the nav document location
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

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((li) => {
      const submenu = li.querySelector(':scope > ul');
      if (submenu) {
        li.classList.add('nav-drop');
        // wrap the leading text label (before the submenu) so it is clickable/styleable
        const label = document.createElement('a');
        label.setAttribute('role', 'button');
        label.setAttribute('tabindex', '0');
        label.className = 'nav-drop-label';
        while (li.firstChild && li.firstChild !== submenu) {
          label.append(li.firstChild);
        }
        li.prepend(label);
        // classify the submenu: megamenu if it contains column headings (h3)
        if (submenu.querySelector(':scope > li > h3')) {
          submenu.classList.add('nav-megamenu');
        } else {
          submenu.classList.add('nav-dropdown');
        }
        decorateDrop(li, navSections);
      }
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // start collapsed; adapt on viewport change
  if (navSections) closeAllSections(navSections);
  isDesktop.addEventListener('change', () => handleViewportChange(nav, navSections));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
