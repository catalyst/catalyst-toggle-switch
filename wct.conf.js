/* eslint-env node */

module.exports = {
  'plugins': {
    'local': {
      'browsers': [
        'chrome',
        'firefox'
      ],
      'browserOptions': {
        'chrome': [
          'headless',
          'disable-gpu',
          'no-sandbox'
        ],
        'firefox': [
          '--headless'
        ]
      }
    }
  }
};
