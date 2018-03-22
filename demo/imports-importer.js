(async () => {
  // Make sure the polyfills are ready (if they are being used).
  await new Promise(resolve => {
    if (window.WebComponents === undefined || window.WebComponents.ready) {
      resolve();
    } else {
      window.addEventListener('WebComponentsReady', () => resolve());
    }
  });

  // Import the things.
  import('./imports.js');
})();
