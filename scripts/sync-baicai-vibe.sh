#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <baicai-vibe-opencode-source-dir>"
  echo "Example: $0 node_modules/baicai-vibe/dist/opencode"
  exit 1
fi

SOURCE_DIR="$1"
TARGET_DIR=".opencode/_vendor/baicai-vibe"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Source directory does not exist: $SOURCE_DIR"
  exit 1
fi

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
cp -R "$SOURCE_DIR/." "$TARGET_DIR/"

echo "Synced baicai-vibe artifacts into $TARGET_DIR"
