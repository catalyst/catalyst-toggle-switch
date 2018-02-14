// Import the element.
import { CatalystToggleSwitch } from '../node_modules/@catalyst-elements/catalyst-toggle-switch/dist/catalyst-toggle-switch.module.js';

/**
 * Load the polymer elements.
 */
function loadPolymerElements() {
  import('../node_modules/@polymer/iron-demo-helpers/demo-snippet.js');
}

// Register the element.
if (window.WebComponents === undefined || window.WebComponents.ready) {
  CatalystToggleSwitch.register();
  loadPolymerElements();
} else {
  window.addEventListener('WebComponentsReady', () => {
    CatalystToggleSwitch.register();
    loadPolymerElements();
  });
}
