(async () => {
  // Make sure the polyfills are ready (if they are being used).
  await new Promise(resolve => {
    if (window.WebComponents == null || window.WebComponents.ready) {
      resolve();
    } else {
      window.addEventListener('WebComponentsReady', () => resolve(), {
        once: true
      });
    }
  });

  // Import the things.
  import('./imports.js');
})();
