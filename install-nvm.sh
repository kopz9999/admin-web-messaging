#!/bin/bash

sudo apt-get update
sudo apt-get install build-essential libssl-dev
sudo apt-get install -y git-core curl
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
