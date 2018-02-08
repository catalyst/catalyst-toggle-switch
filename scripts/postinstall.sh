#!/bin/bash

# Only run if not in node_modules.
if [ \"${PWD##*/}\" != node_modules ]
then
  # Create bower_components symlink.
  # Needed for running the web component tester on the command line.
  ln -sf ./node_modules/@bower_components ./bower_components
fi
