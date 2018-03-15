/* eslint-env node */

module.exports = {
  plugins: {
    local: {
      browsers: ['chrome', 'firefox'],
      browserOptions: {
        chrome: ['headless', 'disable-gpu'],
        firefox: ['-headless']
      }
    }
  },
  npm: true
};
