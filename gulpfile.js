/* eslint-env node */

require('./tasks/clean.js');

require('./tasks/build.js');  // Task: build
require('./tasks/analyze');   // Task: analyze
require('./tasks/docs.js');   // Task: build-docs
require('./tasks/lint.js');   // Task: lint
require('./tasks/test.js'); // Task: test
require('./tasks/fix-dependencies.js'); // Task: fix-dependencies
