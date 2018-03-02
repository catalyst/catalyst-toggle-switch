// Load config.
const config = require('./config.js');

// Libraries.
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const htmlExtract = require('gulp-html-extract');
const sassLint = require('gulp-sass-lint');

// Lint JS
gulp.task('lint:js', () => {
  return gulp.src([
      './*.js',
      `./${config.src.path}/**/*.js`,
      `./${config.test.path}/**/*.js`,
      `./${config.demos.path}/**/*.js`,
      `./${config.tasks.path}/**/*.js`
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Lint JS in HTML
gulp.task('lint:js-in-html', () => {
  return gulp.src([
      './*.html',
      `./${config.src.path}/**/*.html`,
      `./${config.test.path}/**/*.html`,
      `./${config.demos.path}/**/*.html`,
      `./${config.tasks.path}/**/*.html`
    ])
    .pipe(htmlExtract({
      sel: 'script',
      strip: true
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Lint SASS
gulp.task('lint:sass', () => {
  return gulp.src(`./${config.src.path}/**/*.scss`)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

// Lint the project
gulp.task('lint', gulp.parallel('lint:js', 'lint:js-in-html', 'lint:sass'));
