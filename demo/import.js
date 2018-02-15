// Import the element.
import { CatalystToggleButton } from '../../catalyst-toggle-button/dist/catalyst-toggle-button.module.js';

/**
 * Load the polymer elements.
 */
function loadPolymerElements() {
  import('../../../@polymer/iron-demo-helpers/demo-snippet.js');
}

// Register the element.
if (window.WebComponents === undefined || window.WebComponents.ready) {
  CatalystToggleButton.register();
  loadPolymerElements();
} else {
  window.addEventListener('WebComponentsReady', () => {
    CatalystToggleButton.register();
    loadPolymerElements();
  });
}
