// Load config.
const config = require('./config.js');

// Libraries.
const gulp = require('gulp');
const {Analyzer, generateAnalysis} = require('polymer-analyzer');
const file = require('gulp-file');

// Analyze the elements file.
gulp.task('create-analysis', () => {
  const analyzer = Analyzer.createForDirectory('./');

  return analyzer.analyze([`./${config.dist.path}/${config.element.tag}.js`]).then((analysis) => {
    let analysisFileContents = JSON.stringify(generateAnalysis(analysis, analyzer.urlResolver));
    return file(config.docs.analysisFilename, analysisFileContents, { src: true })
      .pipe(gulp.dest('./'));
  });
});

// Analyze the component.
gulp.task('analyze', gulp.series('create-analysis', 'clean-tmp'));
