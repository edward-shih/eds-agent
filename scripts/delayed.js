// add delayed functionality here

// Google Tag Manager — loaded in the delayed phase to protect LCP/performance.
// Replace GTM-XXXXXXX with your real container ID.
const GTM_ID = 'GTM-XXXXXXX';

// Scope analytics to the index (home) page only.
const INDEX_PATHS = ['/', '/index', '/content/index', '/en-us/home'];

function loadGTM(id) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.append(script);

  // GTM <noscript> fallback for users without JavaScript.
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${id}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  noscript.append(iframe);
  document.body.prepend(noscript);
}

const path = window.location.pathname.replace(/\.html$/, '');
if (GTM_ID && GTM_ID !== 'GTM-XXXXXXX' && INDEX_PATHS.includes(path)) {
  loadGTM(GTM_ID);
}
