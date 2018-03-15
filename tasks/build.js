// Load config.
const config = require('./config.js');

// Load util.
const util = require('./util.js');

// Libraries.
const gulp = require('gulp');
const escodegen = require('escodegen');
const esprima = require('esprima');
const inject = require('gulp-inject');
const htmlmin = require('gulp-htmlmin');
const modifyFile = require('gulp-modify-file');
const postcss = require('gulp-postcss');
const prettier = require('prettier');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const webpack = require('webpack');
const webpackClosureCompilerPlugin = require('webpack-closure-compiler');
const webpackStream = require('webpack-stream');

/**
 * Create the element module file.
 */
function createElementModule() {
  return gulp.src(`./${config.src.path}/${config.src.entrypoint}`)
    .pipe(modifyFile((content) => {
      return content.replace(new RegExp(`../node_modules/${config.element.scope}/`, 'g'), '../');
    }))
    .pipe(rename({
      basename: config.element.tag,
      extname: '.js'
    }))
    .pipe(gulp.dest(`./${config.temp.path}`));
}

/**
 * Create the element file.
 */
function createElementScript() {
  return gulp.src(`./${config.src.path}/${config.src.entrypoint}`)
    .pipe(modifyFile((content) => {
      // Parse the code.
      let parsed = esprima.parseModule(content);

      // Get info about the code.
      let codeIndexesToRemove = [];
      let catalystImports = {};
      let catalystExports = {};
      for (let i = 0; i < parsed.body.length; i++) {
        switch (parsed.body[i].type) {
          case 'ImportDeclaration':
            for (let j = 0; j < parsed.body[i].specifiers.length; j++) {
              if ((parsed.body[i].specifiers[j].type === 'ImportDefaultSpecifier' && parsed.body[i].specifiers[j].local.name.startsWith('Catalyst')) ||
                  (parsed.body[i].specifiers[j].type === 'ImportSpecifier'        && parsed.body[i].specifiers[j].imported.name.startsWith('Catalyst'))) {
                catalystImports[i] = parsed.body[i];
                codeIndexesToRemove.push(i);
              }
            }
            break;

          case 'ExportDefaultDeclaration':
          case 'ExportNamedDeclaration':
            catalystExports[i] = parsed.body[i];
            codeIndexesToRemove.push(i);
            break;
        }
      }

      // Remove imports and exports.
      parsed.body = parsed.body.filter((e, i) => !codeIndexesToRemove.includes(i));

      // Replace catalyst element's imports with globally accessible object import.
      for (let i in catalystImports) {
        for (let j = catalystImports[i].specifiers.length - 1; j >=0 ; j--) {
          let localName = catalystImports[i].specifiers[j].local.name;
          let importedName = catalystImports[i].specifiers[j].imported ? catalystImports[i].specifiers[j].imported.name : localName;

          if (importedName.startsWith('Catalyst')) {
            parsed.body.splice(i, 0, esprima.parseScript(`let ${localName} = window.CatalystElements.${importedName};`));
          }
        }
      }

      // Replace exports with globally accessible object exports.
      for (let i in catalystExports) {
        if (catalystExports[i].declaration === null) {
          for (let j = catalystExports[i].specifiers.length - 1; j >=0 ; j--) {
            let localName = catalystExports[i].specifiers[j].local.name;
            let exportedName = catalystExports[i].specifiers[j].imported ? catalystExports[i].specifiers[j].imported.name : localName;

            parsed.body.splice(i, 0, esprima.parseScript(`window.CatalystElements.${exportedName} = ${localName};`));
          }
        } else if (catalystExports[i].declaration.type === 'Identifier') {
          parsed.body.splice(i, 0, esprima.parseScript(`window.CatalystElements.${catalystExports[i].declaration.type.name} = ${catalystExports[i].declaration.type.name};`));
        } else {
          console.error(`Cannot automatically process declaration in ${catalystExports[i].type}.`); // eslint-disable-line no-console
        }
      }

      // Generate the updated code.
      content = escodegen.generate(parsed);

      return `window.CatalystElements = window.CatalystElements || {};${content}`;
    }))
    .pipe(rename({
      basename: config.element.tag,
      extname: '.script.js'
    }))
    .pipe(gulp.dest(`./${config.temp.path}`));
}

/**
 * Inject the template into the element.
 *
 * @param {Boolean} forModule
 */
function injectTemplate(forModule) {
  return gulp.src(forModule ? `./${config.temp.path}/${config.element.tag}.js` : `./${config.temp.path}/${config.element.tag}.script.js`)
    // Inject the template html.
    .pipe(inject(gulp.src(`./${config.temp.path}/${config.src.template.html}`), {
      starttag: '[[inject:template]]',
      endtag: '[[endinject]]',
      removeTags: true,
      transform: util.transforms.getFileContents
    }))
    // Inject the style css.
    .pipe(inject(gulp.src(`./${config.temp.path}/${config.src.template.css}`), {
      starttag: '[[inject:style]]',
      endtag: '[[endinject]]',
      removeTags: true,
      transform: util.transforms.getFileContents
    }))
    .pipe(gulp.dest(`./${config.temp.path}`));
}

// Minify HTML.
gulp.task('html-min', () => {
  return gulp.src(`./${config.src.path}/**/[^_]*.html`)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(replace('\n', ''))
    .pipe(gulp.dest(`./${config.temp.path}`));
});

// Compile Sass.
gulp.task('sass-compile', () => {
  return gulp.src(`./${config.src.path}/**/[^_]*.scss`)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss())
    .pipe(replace('\n', ''))
    .pipe(gulp.dest(`./${config.temp.path}`));
});

// Create the module file.
gulp.task('create-element:module', gulp.series(() => {
  return createElementModule();
}, () => {
  return injectTemplate(true);
}));

// Create the script file.
gulp.task('create-element:script', gulp.series(() => {
  return createElementScript();
}, () => {
  return injectTemplate(false);
}));

// Build the es6 module version of the component.
gulp.task('build-module', gulp.series('create-element:module', () => {
  return gulp.src(`./${config.temp.path}/${config.element.tag}.js`)
    .pipe(gulp.dest(`./${config.dist.path}`));
}));

// Build the es5 script version of the component.
gulp.task('build-script', gulp.series('create-element:script', () => {
  return gulp.src(`./${config.temp.path}/${config.element.tag}.script.js`)
    .pipe(webpackStream({
      target: 'web',
      mode: 'production',
      output: {
        chunkFilename: `${config.element.tag}.part-[id].es5.min.js`,
        filename: `${config.element.tag}.es5.min.js`
      },
      plugins: [
        new webpackClosureCompilerPlugin({
          compiler: {
            language_in: 'ECMASCRIPT6',
            language_out: 'ECMASCRIPT5',
            compilation_level: 'SIMPLE',
            assume_function_wrapper: true,
            output_wrapper: '(function(){%output%}).call(this)'
          }
        })
      ]
    }, webpack))
    .pipe(gulp.dest(`./${config.dist.path}`));
}));

gulp.task(
  'build-finalize',
  gulp.parallel(
    () => {
      return gulp
        .src(['README.md', 'LICENSE'])
        .pipe(gulp.dest(`./${config.dist.path}`));
    },
    () => {
      return gulp
        .src('package.json')
        .pipe(
          modifyFile(content => {
            const json = JSON.parse(content);
            json.main = `${config.element.tag}.js`;
            json.scripts = {
              prepublishOnly:
                "node -e \"assert.equal(require('./package.json').version, require('../package.json').version)\""
            };
            delete json.directories;
            delete json.engines;
            return prettier.format(JSON.stringify(json), { parser: 'json' });
          })
        )
        .pipe(gulp.dest(`./${config.dist.path}`));
    }
  )
);

// Build all the component's versions.
gulp.task('build', gulp.series('clean-dist', gulp.parallel('html-min', 'sass-compile'), gulp.parallel('build-module', 'build-script'), gulp.parallel('build-finalize', 'clean-tmp')));
