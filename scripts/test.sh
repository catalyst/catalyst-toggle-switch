#!/bin/bash
wct=node_modules/@bower_components/web-component-tester/bin/wct

# detect if xvfb-run is present
if [[ -x `command -v xvfb-run` ]]; then
  xvfb-run node $wct
else
  node $wct
fi
