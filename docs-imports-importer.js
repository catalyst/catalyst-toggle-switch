// Make sure the polyfills are ready (if they are being used).
new Promise((resolve) => {
  if (window.WebComponents === undefined || window.WebComponents.ready) {
    resolve();
  } else {
    window.addEventListener('WebComponentsReady', () => resolve());
  }
}).then(() => {
  // Import the things.
  import('./docs-imports.js');
});
