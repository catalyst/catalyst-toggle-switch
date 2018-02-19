// Import the element.
import '../../catalyst-toggle-switch/dist/catalyst-toggle-switch.module.js';

/**
 * Load the polymer elements.
 */
function loadPolymerElements() {
  import('../../../@polymer/iron-demo-helpers/demo-snippet.js');
}

// Register the element.
if (window.WebComponents === undefined || window.WebComponents.ready) {
  loadPolymerElements();
} else {
  window.addEventListener('WebComponentsReady', () => {
    loadPolymerElements();
  });
}
