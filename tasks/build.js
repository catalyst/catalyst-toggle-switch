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
const WebpackClosureCompilerPlugin = require('webpack-closure-compiler');
const webpackStream = require('webpack-stream');

/**
 * Create the element module file.
 *
 * @returns {NodeJS.ReadWriteStream}
 */
function createElementModule() {
  return gulp
    .src(`./${config.src.path}/${config.src.entrypoint}`)
    .pipe(
      modifyFile(content => {
        return content.replace(
          new RegExp(`../node_modules/${config.element.scope}/`, 'g'),
          '../'
        );
      })
    )
    .pipe(
      rename({
        basename: config.element.tag,
        extname: '.js'
      })
    )
    .pipe(gulp.dest(`./${config.temp.path}`));
}

/**
 * Create the element file.
 *
 * @returns {NodeJS.ReadWriteStream}
 */
function createElementScript() {
  return gulp
    .src(`./${config.src.path}/${config.src.entrypoint}`)
    .pipe(
      modifyFile(content => {
        /**
         * Strip the imports and exports out of the parse code and return them.
         *
         * @param {Program} parsedCode
         *   The parsed code.
         * @returns {{imports:Map<number,Object>, exports:Map<number,Object>}}
         */
        const stripImportsAndExports = parsedCode => {
          // Get info about the code.
          const codeIndexesToRemove = [];
          const imports = new Map();
          const exports = new Map();
          for (const [nodeIndex, node] of parsedCode.body.entries()) {
            switch (node.type) {
              case 'ImportDeclaration':
                for (const specifiers of node.specifiers) {
                  let importedName;
                  if (specifiers.type === 'ImportDefaultSpecifier') {
                    importedName = specifiers.local.name;
                  } else if (specifiers.type === 'ImportSpecifier') {
                    importedName = specifiers.imported.name;
                  }

                  if (
                    importedName != null &&
                    importedName.toLowerCase().startsWith('catalyst')
                  ) {
                    imports.set(nodeIndex, node);
                    codeIndexesToRemove.push(nodeIndex);
                  } else {
                    throw new Error(
                      `Cannot automatically process import "${importedName}."`
                    );
                  }
                }
                break;

              case 'ExportDefaultDeclaration':
              case 'ExportNamedDeclaration':
                exports.set(nodeIndex, parsedCode.body[nodeIndex]);
                codeIndexesToRemove.push(nodeIndex);
                break;

              // Different type? Do nothing.
              default:
            }
          }

          // Remove imports and exports.
          parsedCode.body = parsedCode.body.filter(
            (e, i) => !codeIndexesToRemove.includes(i)
          );

          return {
            imports: imports,
            exports: exports
          };
        };

        /**
         * Replace catalyst element's imports with globally accessible object import.
         *
         * @param {Program} parsedCode
         *   The parsed code with the imports already stripped out.
         * @param {Map<number,Object>} imports
         *   The imports that have been stripped out of the parsed code.
         */
        const processImports = (parsedCode, imports) => {
          for (const [importDefIndex, importDef] of imports) {
            for (const specifier of Object.values(importDef.specifiers)) {
              const localName = specifier.local.name;
              const importedName = specifier.imported
                ? specifier.imported.name
                : localName;

              if (importedName.toLowerCase().startsWith('catalyst')) {
                parsedCode.body.splice(
                  importDefIndex,
                  0,
                  esprima.parseScript(
                    `let ${localName} = window.CatalystElements.${importedName};`
                  )
                );
              } else {
                throw new Error(
                  `Cannot automatically process import "${importedName}."`
                );
              }
            }
          }
        };

        /**
         * Replace exports with globally accessible object exports.
         *
         * @param {Program} parsedCode
         *   The parsed code with the exports already stripped out.
         * @param {Map<number,Object>} exports
         *   The exports that have been stripped out of the parsed code.
         */
        const processExports = (parsedCode, exports) => {
          const exportNamesUsed = [];

          // Replace exports with globally accessible object exports.
          for (const [exportDefIndex, exportDef] of exports) {
            if (exportDef.declaration === null) {
              for (const specifier of Object.values(exportDef.specifiers)) {
                const localName = specifier.local.name;
                const exportedName = specifier.imported
                  ? specifier.imported.name
                  : localName;

                if (!exportNamesUsed.includes(exportedName)) {
                  parsedCode.body.splice(
                    exportDefIndex,
                    0,
                    esprima.parseScript(
                      `window.CatalystElements.${exportedName} = ${localName};`
                    )
                  );
                  exportNamesUsed.push(exportedName);
                }
              }
            } else if (exportDef.declaration.type === 'Identifier') {
              if (!exportNamesUsed.includes(exportDef.declaration.name)) {
                parsedCode.body.splice(
                  exportDefIndex,
                  0,
                  esprima.parseScript(
                    `window.CatalystElements.${exportDef.declaration.name} = ${
                      exportDef.declaration.name
                    };`
                  )
                );
                exportNamesUsed.push(exportDef.declaration.name);
              }
            } else {
              console.error(
                `Cannot automatically process declaration in ${exportDef.type}.`
              );
            }
          }
        };

        // Parse the code.
        const parsedCode = esprima.parseModule(content);

        // Run functions defined above.
        const { imports, exports } = stripImportsAndExports(parsedCode);
        processImports(parsedCode, imports);
        processExports(parsedCode, exports);

        // Generate the updated code.
        return (
          'window.CatalystElements = window.CatalystElements || {};\n' +
          `${escodegen.generate(parsedCode)}`
        );
      })
    )
    .pipe(
      rename({
        basename: config.element.tag,
        extname: '.script.js'
      })
    )
    .pipe(gulp.dest(`./${config.temp.path}`));
}

/**
 * Inject the template into the element.
 *
 * @param {boolean} forModule
 *   States whether or not the injection is for the module.
 *   If not, it is assumed to be for the script.
 * @returns {NodeJS.ReadWriteStream}
 */
function injectTemplate(forModule) {
  return (
    gulp
      .src(
        forModule
          ? `./${config.temp.path}/${config.element.tag}.js`
          : `./${config.temp.path}/${config.element.tag}.script.js`
      )

      // Inject the template html.
      .pipe(
        inject(gulp.src(`./${config.temp.path}/${config.src.template.html}`), {
          starttag: '[[inject:template]]',
          endtag: '[[endinject]]',
          removeTags: true,
          transform: util.transforms.getFileContents
        })
      )

      // Inject the style css.
      .pipe(
        inject(gulp.src(`./${config.temp.path}/${config.src.template.css}`), {
          starttag: '[[inject:style]]',
          endtag: '[[endinject]]',
          removeTags: true,
          transform: util.transforms.getFileContents
        })
      )
      .pipe(gulp.dest(`./${config.temp.path}`))
  );
}

// Minify HTML.
gulp.task('html-min', () => {
  return gulp
    .src(`./${config.src.path}/**/[^_]*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(replace('\n', ''))
    .pipe(gulp.dest(`./${config.temp.path}`));
});

// Compile Sass.
gulp.task('sass-compile', () => {
  return gulp
    .src(`./${config.src.path}/**/[^_]*.scss`)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(postcss())
    .pipe(replace('\n', ''))
    .pipe(gulp.dest(`./${config.temp.path}`));
});

// Create the module file.
gulp.task(
  'create-element:module',
  gulp.series(
    () => {
      return createElementModule();
    },
    () => {
      return injectTemplate(true);
    }
  )
);

// Create the script file.
gulp.task(
  'create-element:script',
  gulp.series(
    () => {
      return createElementScript();
    },
    () => {
      return injectTemplate(false);
    }
  )
);

// Build the es6 module version of the component.
gulp.task(
  'build-module',
  gulp.series('create-element:module', () => {
    return gulp
      .src(`./${config.temp.path}/${config.element.tag}.js`)
      .pipe(gulp.dest(`./${config.dist.path}`));
  })
);

// Build the es5 script version of the component.
gulp.task(
  'build-script',
  gulp.series('create-element:script', () => {
    return gulp
      .src(`./${config.temp.path}/${config.element.tag}.script.js`)
      .pipe(
        webpackStream(
          {
            target: 'web',
            mode: 'production',
            output: {
              chunkFilename: `${config.element.tag}.part-[id].es5.min.js`,
              filename: `${config.element.tag}.es5.min.js`
            },
            plugins: [
              new WebpackClosureCompilerPlugin({
                compiler: {
                  language_in: 'ECMASCRIPT_NEXT',
                  language_out: 'ECMASCRIPT5',
                  compilation_level: 'SIMPLE',
                  assume_function_wrapper: true,
                  output_wrapper: '(function(){%output%}).call(this)'
                }
              })
            ]
          },
          webpack
        )
      )
      .pipe(gulp.dest(`./${config.dist.path}`));
  })
);

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
            delete json.devDependencies;
            return prettier.format(JSON.stringify(json), { parser: 'json' });
          })
        )
        .pipe(gulp.dest(`./${config.dist.path}`));
    }
  )
);

gulp.task('build-symlinks', () => {
  return gulp
    .src(`./${config.dist.path}/${config.element.tag}**.js`)
    .pipe(gulp.symlink('./'));
});

// Build all the component's versions.
gulp.task(
  'build',
  gulp.series(
    'clean-dist',
    gulp.parallel('html-min', 'sass-compile'),
    gulp.parallel('build-module', 'build-script'),
    gulp.parallel('build-finalize', 'clean-tmp'),
    'build-symlinks'
  )
);
