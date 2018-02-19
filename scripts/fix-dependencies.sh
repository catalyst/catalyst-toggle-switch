#!/bin/bash

# Fix bad dependency links
# These should only be temp fixes until Polymer 3.0 is released.

# `prism` should be `prismjs`
if [ ! -e ./node_modules/prism ] && [ -e ./node_modules/prismjs ]; then
  ln -s ./prismjs ./node_modules/prism
fi

# `test-fixture` is being loaded from the wrong place.
if [ ! -e ./node_modules/test-fixture ] && [ -e ./node_modules/@polymer/test-fixture ]; then
  ln -s ./@polymer/test-fixture ./node_modules/test-fixture
fi

# Fix link to async.js
if [ ! -e ./node_modules/async/lib ] && [ -e ./node_modules/async/dist/async.js ]; then
  mkdir -p ./node_modules/async/lib
  ln -s ../dist/async.js ./node_modules/async/lib/async.js
fi

# Fix link to sinon.js
if [ ! -e ./node_modules/sinonjs ] && [ -e ./node_modules/sinon/pkg/sinon.js ]; then
  mkdir -p ./node_modules/sinonjs
  ln -s ../sinon/pkg/sinon.js ./node_modules/sinonjs/sinon.js
fi
