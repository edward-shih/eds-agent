import { getMetadata } from '../../scripts/aem.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  // dual-fetch: localhost/aem up serves the content path; DA/EDS serves footerPath.plain.html
  let navBase = '/content/';
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${footerPath}.plain.html`);
    navBase = `${footerPath.substring(0, footerPath.lastIndexOf('/') + 1)}`;
  }
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  // resolve relative image paths against the footer document location
  fragment.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith('/')) {
      img.setAttribute('src', navBase + src);
    }
  });

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  const sections = [...fragment.children];
  sections.forEach((section, i) => {
    if (i === 0) section.classList.add('footer-brand');
    else section.classList.add('footer-nav');
    footer.append(section);
  });

  block.append(footer);
}
