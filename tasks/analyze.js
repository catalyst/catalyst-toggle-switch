// Load config.
const config = require('./config.js');

// Libraries.
const gulp = require('gulp');
const { Analyzer, generateAnalysis } = require('polymer-analyzer');
const file = require('gulp-file');
const globby = require('globby');
const rename = require('gulp-rename');

// Copy this element and its dependencies over to the temp folder for analysis.
gulp.task('get-elements-for-analysis', () => {
  return gulp
    .src([
      `./${config.dist.path}/**/*.js`,
      `./${config.element.nodeScopePath}/*/${config.dist.path}/**/*.js`,
      '!**/*.min*'
    ])
    .pipe(
      rename({
        dirname: '/'
      })
    )
    .pipe(gulp.dest(`./${config.temp.path}/elements`));
});

// Analyze the elements file.
gulp.task('create-analysis', async () => {
  const analyzer = Analyzer.createForDirectory('./');

  await globby(`./${config.temp.path}/elements/**/*.js`)
    .then(elements => {
      return analyzer.analyze(elements);
    })
    .then(analysis => {
      const analysisFileContents = JSON.stringify(
        generateAnalysis(analysis, analyzer.urlResolver)
      );
      return file(config.docs.analysisFilename, analysisFileContents, {
        src: true
      }).pipe(gulp.dest('./'));
    });
});

// Analyze the component.
gulp.task(
  'analyze',
  gulp.series('get-elements-for-analysis', 'create-analysis', 'clean-tmp')
);
