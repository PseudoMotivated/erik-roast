#!/bin/bash
set -e

REPO_DIR="/home/app/erik-roast"
BRANCH="master"

echo "=== Starting Deployment for Erik OS ==="

if [ ! -d "$REPO_DIR" ]; then
    echo "Cloning repository..."
    git clone https://github.com/PseudoMotivated/erik-roast.git "$REPO_DIR"
else
    echo "Updating repository..."
    cd "$REPO_DIR"
    git fetch origin
    git reset --hard "origin/$BRANCH"
fi

cd "$REPO_DIR"

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Restarting service..."
sudo systemctl restart erik-roast

echo "=== Deployment Complete ==="
