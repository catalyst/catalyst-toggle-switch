// Libraries.
const fs = require('graceful-fs');

// Load package.json
let packageInfo = JSON.parse(fs.readFileSync('./package.json'));

let scope = packageInfo.name.substring(0, packageInfo.name.lastIndexOf('/'));
if (scope === '') {
  scope = null;
}

module.exports = {
  element: {
    tag: 'catalyst-toggle-switch',
    scope: scope,
    nodeScopePath: 'node_modules' + (scope === null ? '' : `/${scope}`)
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
    path: 'dist'
  },

  demos: {
    path: 'demo',
    importsFilename: 'imports.js',
    importsImporterFilename: 'imports-importer.js'
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
    path: 'tasks'
  },

  test: {
    path: 'test'
  },

  temp: {
    path: 'tmp'
  },

  package: packageInfo
};
