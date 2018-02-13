#!/bin/bash

# Only run if not in node_modules.
if [ \"${PWD##*/}\" != node_modules ]
then
  # Fix bad dependency links
  # These should only be temp fixes until Polymer 3.0 is released.

  # `prism` should be `prismjs`
  ln -sf ./prismjs ./node_modules/prism

  # `test-fixture` is being loaded from the wrong place.
  ln -sf ./@polymer/test-fixture ./node_modules/test-fixture

  # Fix path to async.js
  mkdir -p ./node_modules/async/lib
  ln -sf ../dist/async.js ./node_modules/async/lib/async.js

  # Fix path to sinon.js
  mkdir -p ./node_modules/sinonjs
  ln -sf ../sinon/pkg/sinon.js ./node_modules/sinonjs/sinon.js
fi
