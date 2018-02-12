#!/bin/bash
wct=node_modules/web-component-tester/bin/wct

# detect if xvfb-run is present
if [[ -x `command -v xvfb-run` ]]; then
  xvfb-run node $wct --npm
else
  node $wct --npm
fi
