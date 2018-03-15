/* eslint-env node */

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      features: {
        customProperties: false
      }
    },
    cssnano: {
      autoprefixer: false
    },
    'postcss-reporter': {}
  }
};
