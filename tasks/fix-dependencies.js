// Libraries.
const gulp = require('gulp');
const fs = require('graceful-fs');

gulp.task('fix-dependencies:prismjs', async () => {
  await new Promise(resolve => {
    const good = fs.existsSync('./node_modules/prismjs');
    const bad = fs.existsSync('./node_modules/prism');

    if (good && !bad) {
      fs.symlinkSync('./prismjs', './node_modules/prism', 'dir');
    }

    resolve();
  });
});

gulp.task('fix-dependencies:test-fixture', async () => {
  await new Promise(resolve => {
    const good = fs.existsSync('./node_modules/@polymer/test-fixture');
    const bad = fs.existsSync('./node_modules/test-fixture');

    if (good && !bad) {
      fs.symlinkSync(
        './@polymer/test-fixture',
        './node_modules/test-fixture',
        'dir'
      );
    }

    resolve();
  });
});

gulp.task('fix-dependencies:async.js', async () => {
  await new Promise(resolve => {
    const good = fs.existsSync('./node_modules/async/dist/async.js');
    const bad = fs.existsSync('./node_modules/async/lib/async.js');

    if (good && !bad) {
      fs.mkdirSync('./node_modules/async/lib/');
      fs.symlinkSync(
        '../dist/async.js',
        './node_modules/async/lib/async.js',
        'file'
      );
    }

    resolve();
  });
});

gulp.task('fix-dependencies:sinon.js', async () => {
  await new Promise(resolve => {
    const good = fs.existsSync('./node_modules/sinon/pkg/sinon.js');
    const bad = fs.existsSync('./node_modules/sinonjs/sinon.js');

    if (good && !bad) {
      fs.mkdirSync('./node_modules/sinonjs');
      fs.symlinkSync(
        '../sinon/pkg/sinon.js',
        './node_modules/sinonjs/sinon.js',
        'file'
      );
    }

    resolve();
  });
});

// Fix dependencies paths.
gulp.task(
  'fix-dependencies',
  gulp.parallel(
    'fix-dependencies:prismjs',
    'fix-dependencies:test-fixture',
    'fix-dependencies:async.js',
    'fix-dependencies:sinon.js'
  )
);
