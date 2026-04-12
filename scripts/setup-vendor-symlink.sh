#!/usr/bin/env bash

set -euo pipefail

echo "Setting up baicai-vibe global/project-level symlinks..."
echo ""

VENDOR_DIR=".opencode/_vendor"
TARGET_DIR="$VENDOR_DIR/baicai-vibe"
GLOBAL_BAICAI_VIBE="$HOME/.config/opencode"
BAICAI_VIBE_REPO="$HOME/programming/baicai-vibe/.opencode"

# Step 1: Check global installation
echo "Step 1: Checking global baicai-vibe installation..."
if [ -d "$GLOBAL_BAICAI_VIBE" ]; then
  echo "✓ Global baicai-vibe found at: $GLOBAL_BAICAI_VIBE"
  if [ -L "$GLOBAL_BAICAI_VIBE" ]; then
    echo "  (symlink pointing to: $(readlink "$GLOBAL_BAICAI_VIBE"))"
  fi
else
  echo "⚠ Global baicai-vibe not found at: $GLOBAL_BAICAI_VIBE"
  echo ""
  echo "Step 1a: Installing baicai-vibe globally..."
  
  # Check if baicai-vibe repo exists
  if [ ! -d "$BAICAI_VIBE_REPO" ]; then
    echo "❌ ERROR: baicai-vibe repo not found at: $BAICAI_VIBE_REPO"
    echo ""
    echo "Please clone baicai-vibe repo to ~/programming/baicai-vibe/"
    echo "Then run this script again."
    exit 1
  fi
  
  # Create global symlink
  mkdir -p "$HOME/.config"
  ln -s "$BAICAI_VIBE_REPO" "$GLOBAL_BAICAI_VIBE"
  echo "✓ Global symlink created: $GLOBAL_BAICAI_VIBE -> $BAICAI_VIBE_REPO"
fi

echo ""

# Step 2: Create project-level symlink
echo "Step 2: Creating project-level symlink..."
# Remove existing symlink
if [ -e "$TARGET_DIR" ] || [ -L "$TARGET_DIR" ]; then
  echo "Removing existing project symlink..."
  rm -rf "$TARGET_DIR"
fi

# Create project symlink pointing to global
mkdir -p "$VENDOR_DIR"
cd "$VENDOR_DIR"
ln -s "$GLOBAL_BAICAI_VIBE" baicai-vibe
cd - > /dev/null

echo "✓ Project symlink created: $TARGET_DIR -> $GLOBAL_BAICAI_VIBE"
echo ""

# Step 3: Verify symlinks work
echo "Step 3: Verifying symlinks..."
if [ -d "$TARGET_DIR" ]; then
  echo "✓ Project symlink resolves correctly"
  echo "✓ Files accessible through symlinks"
  echo ""
  echo "Available directories:"
  ls -la "$TARGET_DIR" | grep -E "^d" | awk '{print "  -", $NF}'
else
  echo "❌ ERROR: Project symlink does not resolve correctly"
  exit 1
fi

echo ""
echo "Setup complete!"
echo ""
echo "Summary:"
echo "  Global:     $GLOBAL_BAICAI_VIBE → $BAICAI_VIBE_REPO"
echo "  Project:    $TARGET_DIR → $GLOBAL_BAICAI_VIBE"
echo ""
echo "Note: Both symlinks are ignored in .gitignore"
