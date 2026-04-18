#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const packageName = 'baicai-vc';
const sourceRoot = path.resolve(__dirname, '..');
const targetRoot = path.resolve(process.argv[2] || process.cwd());

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function resolvePostinstall() {
  const localPath = path.join(targetRoot, 'node_modules', packageName, 'bin', 'postinstall.js');

  if (fs.existsSync(localPath)) {
    return localPath;
  }

  return path.join(__dirname, 'postinstall.js');
}

try {
  if (path.resolve(sourceRoot) === path.resolve(targetRoot)) {
    throw new Error('target project cannot be the baicai-vc repo itself');
  }

  run('bun', ['link'], sourceRoot);
  run('bun', ['link', packageName], targetRoot);
  run('bun', [resolvePostinstall()], targetRoot);
} catch (err) {
  console.error('baicai-vc link error:', err.message);
  process.exit(1);
}
