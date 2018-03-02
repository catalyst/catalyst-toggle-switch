// Libraries.
const fs = require('graceful-fs');

// Load package.json
let packageInfo = JSON.parse(fs.readFileSync('./package.json'));

module.exports = {

  element: {
    tag: 'catalyst-toggle-switch',
    class: 'CatalystToggleSwitch',
    scope: packageInfo.name.substring(0, packageInfo.name.lastIndexOf('/')),
  },

  src: {
    path: 'src',
    entrypoint: 'element.js',
    template: {
      html: 'template.html',
      css: 'style.css'
    }
  },

  dist: {
    path: 'dist',
  },

  demos: {
    path: 'demo',
  },

  docs: {
    path: 'docs',
    indexPage: 'index.html',
    nodeModulesPath: 'scripts',
    importsFilename: 'docs-imports.js',
    importsImporterFilename: 'docs-imports-importer.js',
    analysisFilename: 'analysis.json'
  },

  tasks: {
    path: 'tasks',
  },

  test: {
    path: 'test'
  },

  temp: {
    path: 'tmp'
  },

  package: packageInfo
};
