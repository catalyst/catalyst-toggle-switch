// Load config.
const config = require('./config.js');

// Libraries.
const gulp = require('gulp');
const del = require('del');

// Clean the dist path.
gulp.task('clean-dist', async () => {
  await del(`./${config.dist.path}`);
});

// Clean the tmp path.
gulp.task('clean-tmp', async () => {
  await del(`./${config.temp.path}`);
});

// Clean the docs path.
gulp.task('clean-docs', async () => {
  await del(`./${config.docs.path}`);
});
