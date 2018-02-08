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

// Libraries.
const gulp = require('gulp');
const {Analyzer, generateAnalysis} = require('polymer-analyzer');
const analyzer = Analyzer.createForDirectory('./');
const Builder = require('polymer-build').PolymerProject;
const docBuilder = new Builder(require('./polymer.json'));
const clean = require('gulp-clean');
const closureCompiler = require('google-closure-compiler').gulp();
const eslint = require('gulp-eslint');
const file = require('gulp-file');
const htmlExtract = require('gulp-html-extract');
const htmlmin = require('gulp-htmlmin');
const indent = require('gulp-indent');
const inject = require('gulp-inject');
const mergeStream = require('merge-stream');
const modifyFile = require('gulp-modify-file');
const replace = require('gulp-replace');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');

/**
 * Fix issues with the automatically generated analysis.
 *
 * * @param {object} analysis
 */
function fixAnalysis(analysis) {
  // If `namespaces` is defined.
  if (analysis.namespaces) {
    for (let i = 0; i < analysis.namespaces.length; i++) {
      // For the `CatalystElements` namespace.
      if (analysis.namespaces[i].name === 'CatalystElements') {

        // If `elements` is defined.
        if (analysis.namespaces[i].elements) {
          // For each element.
          for (let j = 0; j < analysis.namespaces[i].elements.length; j++) {

            // If the element's tag name is not set for this element, set it.
            if (analysis.namespaces[i].elements[j].tagname === undefined && analysis.namespaces[i].elements[j].name.endsWith(className)) {
              analysis.namespaces[i].elements[j].tagname = tagName;
            }

            // If `events` is defined
            if (analysis.namespaces[i].elements[j].events) {
              // For each event.
              for (let k = 0; k < analysis.namespaces[i].elements[j].events.length; k++) {
                // Fix up event descriptions.
                // Remove the name of the event from the beginning of its description.
                analysis.namespaces[i].elements[j].events[k].description = analysis.namespaces[i].elements[j].events[k].description.replace(new RegExp('^' + analysis.namespaces[i].elements[j].events[k].name), '').trim();
              }
            }
          }
        }
      }
    }
  }

  return analysis;
}

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
 * Create the element file.
 *
 * @param {Boolean} forModule
 */
function createElement(forModule) {
  return gulp.src(`${srcPath}/element.js`)
    .pipe(indent({
      tabs: false,
      amount: forModule ? 0 : 4
    }))
    .pipe(modifyFile((content) => {
      if (forModule) {
        const postfix = `
// Export the element.
export { ${className} };
`;

        return `${content}${postfix}`;
      }
      else {
        return `(() => {
  /**
   * Namespace for all the Catalyst Elements.
   *
   * @namespace CatalystElements
   */
  window.CatalystElements = window.CatalystElements || {};

  /**
   * Create the custom element
   */
  function createElement() {
${content}
    // Make the class globally accessible under the \`CatalystElements\` object.
    window.CatalystElements.${className} = ${className};

    // Register the element.
    ${className}.register();
  }

  // If the \`${className}\` hasn't already been defined, define it.
  if (window.CatalystElements.${className} === undefined) {
    // If not using web component polyfills or if polyfills are ready, create the element.
    if (window.WebComponents === undefined || window.WebComponents.ready) {
      createElement();
    }
    // Otherwise wait until the polyfills is ready.
    else {
      window.addEventListener('WebComponentsReady', () => {
        createElement();
      });
    }
  } else {
    console.warn('${className} has already been defined, cannot redefine.');
  }
})();`;
      }
    }))
    .pipe(rename({
      basename: tagName,
      extname: forModule ? '.module.js' : '.js'
    }))
    .pipe(gulp.dest(tmpPath));
}

/**
 * Inject the template into the element.
 *
 * @param {Boolean} forModule
 */
function injectTemplate(forModule) {
  return gulp.src(forModule ? `${tmpPath}/${tagName}.module.js` : `${tmpPath}/${tagName}.js`)
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
    .pipe(gulp.dest(distPath));
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
gulp.task('clean-dist', () => {
  return gulp.src(distPath, {read: false, allowEmpty: true}).pipe(clean());
});

// Clean the tmp path.
gulp.task('clean-tmp', () => {
  return gulp.src(tmpPath, {read: false, allowEmpty: true}).pipe(clean());
});

gulp.task('create-element:module', () => {
  return createElement(true);
});

gulp.task('create-element', () => {
  return createElement(false);
});

gulp.task('inject:template:module', () => {
  return injectTemplate(true);
});

gulp.task('inject:template', () => {
  return injectTemplate(false);
});

// Build the module version of the components.
gulp.task('build-es6-module', gulp.series('create-element:module', gulp.parallel('html-min', 'sass-compile'), 'inject:template:module'));

// Build the es6 version of the components.
gulp.task('build-es6', gulp.series('create-element', gulp.parallel('html-min', 'sass-compile'), 'inject:template'));

// Build the minified es6 version of the component.
gulp.task('build-es6-min', () => {
  return gulp.src(`${distPath}/${tagName}.js`)
    .pipe(closureCompiler({
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      warning_level: 'QUIET',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT6_STRICT',
      output_wrapper: '(()=>{%output%})()',
      js_output_file: `${tagName}.min.js`
    }))
    .pipe(gulp.dest(distPath));
});

// Build the minified es5 version of the component.
gulp.task('build-es5-min', () => {
  return gulp.src(`${distPath}/${tagName}.js`)
    .pipe(closureCompiler({
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      warning_level: 'QUIET',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT5_STRICT',
      output_wrapper: '(function(){%output%}).call(this)',
      js_output_file: `${tagName}.es5.min.js`
    }))
    .pipe(gulp.dest(distPath));
});
// Analyze the elements file.
gulp.task('create-analysis', () => {
  return analyzer.analyze([`${distPath}/${tagName}.js`]).then((analysis) => {
    let analysisFileContents = JSON.stringify(fixAnalysis(generateAnalysis(analysis, analyzer.urlResolver)));
    return file(`${analysisFilename}.json`, analysisFileContents, { src: true })
      .pipe(gulp.dest('./'));
  });
});

// Build all the components' versions.
gulp.task('build', gulp.series('clean-dist', gulp.parallel('build-es6-module', 'build-es6'), gulp.parallel('build-es6-min', 'build-es5-min')));

// Build the docs for all the components' versions.
gulp.task('build-docs', () => {
  return mergeStream(docBuilder.sources(), docBuilder.dependencies())
    .pipe(gulp.dest('docs'));
});

// Analyze all the components.
gulp.task('analyze', gulp.series('build-es6', 'create-analysis', 'clean-tmp'));

// Default task.
gulp.task('default', gulp.series('build', 'clean-tmp'));
