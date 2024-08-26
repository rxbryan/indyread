#!/bin/bash
export VON_NETWORK_REPO=https://github.com/bcgov/von-network.git
export WORKDIR=tmp/

if [[ ! -d "${WORKDIR}/von-network" ]]; then
  mkdir -p $WORKDIR
  pushd $WORKDIR
  git clone $VON_NETWORK_REPO
  pushd von-network
else
  pushd "${WORKDIR}/von-network"
fi

./manage build

mkdir tmp
chmod a+rws tmp cli-scripts

export DHOST=$(./manage dockerhost | sed '/^$/d;s~DockerHost:[[:space:]]~~') && echo "DHOST set to ${DHOST}"
export key=$(./manage generateSecrets | grep -o "Key: .*" | cut -d " " -f 2-)

./manage start

sleep 10

for (( i=0; i<3; i++ )); do
  # Register DIDs
  SEED=\"$(./manage generateSecrets | grep -o "Seed: .*" | cut -d " " -f 2-)\"
  curl --header "Content-Type: application/json"   --request POST   --data "{\"seed\":${SEED}}" http://localhost:9000/register

done
