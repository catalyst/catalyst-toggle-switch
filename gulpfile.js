/* eslint-env node */

// The name of the element.
const tagName = 'catalyst-toggle-switch';

// The name of the class.
const className = 'CatalystToggleSwitch';

// The name of the analysis file.
const analysisFilename = 'analysis';

// Paths.
const srcPath = './src';
const distPath = './dist';
const tmpPath = './tmp';
const docsPath = './docs';
const demoPath = './demo';

// Libraries.
const gulp = require('gulp');
const {Analyzer, generateAnalysis} = require('polymer-analyzer');
const analyzer = Analyzer.createForDirectory('./');
const Builder = require('polymer-build').PolymerProject;
const del = require('del');
const escodegen = require('escodegen');
const eslint = require('gulp-eslint');
const esprima = require('esprima');
const file = require('gulp-file');
const foreach = require('gulp-foreach');
const fs = require('graceful-fs')
const globby = require('globby');
const htmlExtract = require('gulp-html-extract');
const htmlmin = require('gulp-htmlmin');
const inject = require('gulp-inject');
const mergeStream = require('merge-stream');
const modifyFile = require('gulp-modify-file');
const named = require('vinyl-named');
const path = require('path');
const replace = require('gulp-replace');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const through = require('through2');
const webpack = require('webpack');
const webpackClosureCompilerPlugin = require('webpack-closure-compiler');
const webpackStream = require('webpack-stream');

let packageInfo = JSON.parse(fs.readFileSync('./package.json'));

/**
 * Transform function that returns the contents of the given file.
 *
 * @param {string} filePath
 * @param {File} file
 */
function transformGetFileContents(filePath, file) {
  return file.contents.toString('utf8')
}

/**
 * Create the element module file.
 */
function createElementModule() {
  return gulp.src(`${srcPath}/element.js`)
    .pipe(modifyFile((content) => {
      content = content.replace(/\.\.\/node_modules\/@catalyst-elements\//g, '../../');
      return content;
    }))
    .pipe(rename({
      basename: tagName,
      extname: '.js'
    }))
    .pipe(gulp.dest(tmpPath));
}

/**
 * Create the element file.
 */
function createElementScript() {
  return gulp.src(`${srcPath}/element.js`)
    .pipe(modifyFile((content) => {
      // Parse the code.
      let parsed = esprima.parseModule(content);

      // Get info about the code.
      let codeIndexesToRemove = [];
      let catalystImports = {};
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

      // Generate the updated code.
      content = escodegen.generate(parsed);

      return `(() => {
  /**
   * Namespace for all the Catalyst Elements.
   *
   * @namespace CatalystElements
   */
  window.CatalystElements = window.CatalystElements || {};
${content}
    // Make the class globally accessible under the \`CatalystElements\` object.
    window.CatalystElements.${className} = ${className};
})();`;
    }))
    .pipe(rename({
      basename: tagName,
      extname: '.script.js'
    }))
    .pipe(gulp.dest(tmpPath));
}

/**
 * Inject the template into the element.
 *
 * @param {Boolean} forModule
 */
function injectTemplate(forModule) {
  return gulp.src(forModule ? `${tmpPath}/${tagName}.js` : `${tmpPath}/${tagName}.script.js`)
    // Inject the template html.
    .pipe(inject(gulp.src(`${tmpPath}/template.html`), {
      starttag: '[[inject:template]]',
      endtag: '[[endinject]]',
      removeTags: true,
      transform: transformGetFileContents
    }))
    // Inject the style css.
    .pipe(inject(gulp.src(`${tmpPath}/style.css`), {
      starttag: '[[inject:style]]',
      endtag: '[[endinject]]',
      removeTags: true,
      transform: transformGetFileContents
    }))
    .pipe(gulp.dest(tmpPath));
}

// Lint JS
gulp.task('lint:js', () => {
  return gulp.src([
      '*.js',
      'src/**/*.js',
      'test/**/*.js',
      'demo/**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Lint JS in HTML
gulp.task('lint:js-html', () => {
  return gulp.src([
      '*.html',
      'src/**/*.html',
      'test/**/*.html',
      'demo/**/*.html'
    ])
    .pipe(htmlExtract({
      sel: 'script',
      strip: true
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Lint SCSS
gulp.task('lint:scss', () => {
  return gulp.src('src/**/*.scss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

// Lint the project
gulp.task('lint', gulp.parallel('lint:js', 'lint:js-html', 'lint:scss'));

// Minify HTML.
gulp.task('html-min', () => {
  return gulp.src(`${srcPath}/**/*.html`)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(replace('\n', ''))
    .pipe(gulp.dest(tmpPath));
});

// Compile Sass.
gulp.task('sass-compile', () => {
  return gulp.src(`${srcPath}/**/*.scss`)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss())
    .pipe(replace('\n', ''))
    .pipe(gulp.dest(tmpPath));
});

// Clean the dist path.
gulp.task('clean-dist', (done) => {
  del(distPath).then(() => { done(); });
});

// Clean the tmp path.
gulp.task('clean-tmp', (done) => {
  del(tmpPath).then(() => { done(); });
});

// Clean the docs path.
gulp.task('clean-docs', (done) => {
  del(docsPath).then(() => { done(); });
});

gulp.task('create-element:module', () => {
  return createElementModule();
});

gulp.task('create-element:script', () => {
  return createElementScript();
});

gulp.task('inject:template:module', () => {
  return injectTemplate(true);
});

gulp.task('inject:template:script', () => {
  return injectTemplate(false);
});

// Build the es6 module version of the component.
gulp.task('build-module', gulp.series('create-element:module', 'inject:template:module', () => {
  return gulp.src(`${tmpPath}/${tagName}.js`)
    .pipe(gulp.dest(distPath));
}));

// Build the es5 script version of the component.
gulp.task('build-script', gulp.series('create-element:script', 'inject:template:script', () => {
  return gulp.src(`${tmpPath}/${tagName}.script.js`)
    .pipe(webpackStream({
      target: 'web',
      mode: 'production',
      output: {
        chunkFilename: `${tagName}.[id].es5.min.js`,
        filename: `${tagName}.es5.min.js`
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
    .pipe(gulp.dest(distPath));
}));

// Analyze the elements file.
gulp.task('create-analysis', () => {
  return analyzer.analyze([`${distPath}/${tagName}.js`]).then((analysis) => {
    let analysisFileContents = JSON.stringify(generateAnalysis(analysis, analyzer.urlResolver));
    return file(`${analysisFilename}.json`, analysisFileContents, { src: true })
      .pipe(gulp.dest('./'));
  });
});

// Clone all the dependencies needed for docs.
gulp.task('docs-clone-dependencies', gulp.series(() => {
  return gulp.src('node_modules/**', { follow: true }).pipe(gulp.dest(`${tmpPath}/scripts`));
}, () => {
  return gulp.src([
    'index.html',
    'docs-imports.js',
    'analysis.json',
    'docs-build-config.json'
  ]).pipe(gulp.dest(`${tmpPath}`));
}, () => {
  return gulp.src([`${distPath}/**`, `${demoPath}/**`], { base: './' }).pipe(gulp.dest(`${tmpPath}/scripts/${packageInfo.name}/`));
}));

// Update analysis.
gulp.task('docs-update-analysis', gulp.series(() => {
  return gulp.src(`${tmpPath}/analysis.json`, { base: './' })
    .pipe(modifyFile((content) => {
      let analysis = JSON.parse(content);
      if (analysis.elements) {
        for (let i = 0; i < analysis.elements.length; i++) {
          if (analysis.elements[i].demos) {
            for (let j = 0; j < analysis.elements[i].demos.length; j++) {
              analysis.elements[i].demos[j].url = `scripts/${packageInfo.name}/${analysis.elements[i].demos[j].url}`;
            }
          }
        }
      }
      return JSON.stringify(analysis);
    }))
    .pipe(gulp.dest('./'));
}));

// Build the docs index.
gulp.task('docs-build-index', gulp.series((done) => {
  let content = '<script src="../../@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>';
  fs.writeFileSync(`${tmpPath}/custom-elements-es5-adapter-import.html`, content);
  done();
}, () => {
  return gulp.src(`${tmpPath}/index.html`, { base: './' })
    .pipe(inject(gulp.src(`${tmpPath}/custom-elements-es5-adapter-import.html`), {
      starttag: '<!-- [[inject:custom-elements-es5-adapter]] -->',
      endtag: '<!-- [[endinject]] -->',
      removeTags: true,
      transform: transformGetFileContents
    }))
    .pipe(gulp.dest('./'));
}, () => {
  return gulp.src(`${tmpPath}/index.html`, { base: './' })
    .pipe(modifyFile((content) => {
      content = content.replace(/\.\.\/\.\.\//g, './scripts/');
      return content.replace(/<script type="module"/g, '<script');
    }))
    .pipe(gulp.dest('./'));
}));

// Build the docs imports.
gulp.task('docs-build-imports', gulp.series(() => {
  return gulp.src(`${tmpPath}/docs-imports.js`, { base: './' })
    .pipe(modifyFile((content) => {
      return content.replace(/\.\.\/\.\.\//g, './scripts/');
    }))
    .pipe(gulp.dest('./'));
}, () => {
  return gulp.src(`${tmpPath}/docs-imports.js`, { base: tmpPath })
    .pipe(named())
    .pipe(webpackStream({
      target: 'web',
      mode: 'production',
      output: {
        chunkFilename: 'docs-imports.[id].js',
        filename: 'docs-imports.js'
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
    .pipe(foreach(function(stream, file) {
      return stream
        .pipe(modifyFile((content) => {
          return content.replace(/\\\\\$/g, '$');
        }))
        .pipe(rename({
          basename: path.basename(file.path, '.js'),
        }))
        .pipe(gulp.dest(tmpPath));
    }));
}));

// Build the demos.
gulp.task('docs-build-demos', gulp.series(() => {
  return gulp.src(`${tmpPath}/scripts/${packageInfo.name}/demo/**/*.html`, { base: './' })
    .pipe(foreach(function(stream, file) {
      let relPath = path.relative(path.join(file.cwd, file.base), file.path);
      let dir = path.dirname(relPath);
      let es5AdapterFile = `${dir}/custom-elements-es5-adapter-import.html`;
      let es5AdapterSrc = path.relative(dir, `${tmpPath}/scripts/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js`);

      let content = `<script src="${es5AdapterSrc}"></script>`;
      fs.writeFileSync(es5AdapterFile, content);

      return stream
        .pipe(inject(gulp.src(es5AdapterFile, { base: './' }), {
          starttag: '<!-- [[inject:custom-elements-es5-adapter]] -->',
          endtag: '<!-- [[endinject]] -->',
          removeTags: true,
          transform: transformGetFileContents
        }))
        .pipe(through.obj(function(file, enc, cb) {
          del(es5AdapterFile);
          this.push(file);
          cb();
        }))
        .pipe(gulp.dest('./'));
    }));
}, () => {
  return gulp.src(`${tmpPath}/scripts/${packageInfo.name}/demo/*.html`, { base: './' })
    .pipe(modifyFile((content) => {
      return content.replace(/<script type="module"/g, '<script');
    }))
    .pipe(gulp.dest('./'));
}));

// Build the imports for each demo.
gulp.task('docs-build-demo-imports', () => {
  return gulp.src(`${tmpPath}/scripts/@catalyst-elements/*/demo/import.js`)
    .pipe(foreach(function(stream, file) {
      let output = path.dirname(file.path);
      return stream
        .pipe(webpackStream({
          target: 'web',
          mode: 'production',
          output: {
            chunkFilename: 'import.[id].js',
            filename: 'import.js'
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
        .pipe(foreach(function(stream, file) {
          return stream
            .pipe(modifyFile((content) => {
              return content.replace(/\\\\\$/g, '$');
            }))
            .pipe(rename({
              basename: path.basename(file.path, '.js'),
            }))
            .pipe(gulp.dest(output));
        }));
    }));
});

// Generate the docs.
gulp.task('docs-generate', gulp.series(async () => {
  let buildConfig = require(`${tmpPath}/docs-build-config.json`);

  let builtFiles = await globby(['docs-imports.js', 'docs-imports.*.js'], { cwd: tmpPath });

  for (let i = 0; i < builtFiles.length; i++) {
    buildConfig.extraDependencies.push(builtFiles[i]);
  }
  fs.writeFileSync(`${tmpPath}/docs-build-config.json`, JSON.stringify(buildConfig));
}, () => {
  const docBuilder = new Builder(`${tmpPath}/docs-build-config.json`);
  return mergeStream(docBuilder.sources(), docBuilder.dependencies())
    .pipe(gulp.dest(docsPath));
}, () => {
  return gulp.src(`${docsPath}/${tmpPath}/**`)
    .pipe(gulp.dest(docsPath));
}, (done) => {
  del(`${docsPath}/${tmpPath}/`).then(() => {
    done();
  });
}));

// Build all the component's versions.
gulp.task('build', gulp.series('clean-dist', gulp.parallel('html-min', 'sass-compile'), gulp.parallel('build-module', 'build-script'), 'clean-tmp'));

// Build the docs.
gulp.task('build-docs', gulp.series(
  'clean-docs',
  'docs-clone-dependencies',
  'docs-update-analysis',
  'docs-build-index',
  'docs-build-imports',
  'docs-build-demos',
  'docs-build-demo-imports',
  'docs-generate',
  'clean-tmp'));

// Analyze the component.
gulp.task('analyze', gulp.series('create-analysis', 'clean-tmp'));

// Default task.
gulp.task('default', gulp.series('build'));
