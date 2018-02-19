/**
 * Load the polymer elements.
 */
function loadPolymerElements() {
  import('../../@polymer/iron-component-page/iron-component-page.js');
}

// If not using web component polyfills or if polyfills are ready, register all the Catalyst Elements.
if (window.WebComponents === undefined || window.WebComponents.ready) {
  loadPolymerElements();
}
// Otherwise wait until the polyfills are ready.
else {
  window.addEventListener('WebComponentsReady', () => {
    loadPolymerElements();
  });
}
