// Load config.
const config = require('./config');
const wctConfig = require('../wct.conf');

// Libraries.
const gulp = require('gulp');
const fs = require('graceful-fs');
const wct = require('web-component-tester').test;

// Test the built component.
gulp.task('test', done => {
  if (!fs.existsSync(`./${config.dist.path}`)) {
    done(`No ${config.dist.path}/ path exists.`);
    return;
  }

  wct(wctConfig);
  done();
});
