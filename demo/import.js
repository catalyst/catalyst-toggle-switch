// Import the helpers.
import '../node_modules/@polymer/iron-demo-helpers/demo-snippet.js';

// Import the element.
import { CatalystToggleSwitch } from '../node_modules/@catalyst-elements/catalyst-toggle-switch/dist/catalyst-toggle-switch.module.js';

// Register the element.
if (window.WebComponents === undefined || window.WebComponents.ready) {
  CatalystToggleSwitch.register();
} else {
  window.addEventListener('WebComponentsReady', () => {
    CatalystToggleSwitch.register();
  });
}
