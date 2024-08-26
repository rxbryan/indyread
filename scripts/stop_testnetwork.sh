#!/bin/bash

if [[ -d "tmp/von-network" ]]; then
  pushd tmp/von-network
  ./manage down
else
  echo "run `./scripts setup_testnetwork` first" 
fi