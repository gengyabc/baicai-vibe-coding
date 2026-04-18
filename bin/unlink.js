#!/usr/bin/env node

const path = require('path');
const utils = require('./install-utils');
const ownedPaths = require('./owned-paths');

const args = process.argv.slice(2);
const isGlobalFlag = args.includes('--global') || args.includes('-g');

const pkgDir = utils.resolvePkgDir();
const installScope = isGlobalFlag ? 'global' : (utils.isGlobalInstall() ? 'global' : 'project');
const projectRoot = utils.resolveProjectRoot(pkgDir);

if (utils.isSelfInstall(pkgDir, projectRoot)) {
  console.log('baicai-vc: local package mode, skipping unlink');
  process.exit(0);
}

const targetDir = installScope === 'global' ? utils.resolveGlobalDir() : path.join(projectRoot, '.opencode');

async function main() {
  const lockPath = await utils.acquireLock(targetDir);

  try {
    const hasContent = utils.hasBaicaiVcContent(targetDir);

    if (!hasContent) {
      console.log('baicai-vc: No baicai-vc content to clean up');
      return;
    }

    console.log('\nbaicai-vc: Unlinking');
    console.log('  This will remove baicai-vc artifacts from .opencode/');
    console.log('');

    const answer = await utils.prompt('Remove baicai-vc content? [y/N]: ');

    if (answer !== 'y' && answer !== 'yes') {
      console.log('baicai-vc: Unlink cancelled, content preserved');
      return;
    }

    utils.removeOwnedContent(targetDir, ownedPaths);

    console.log('✓ baicai-vc unlinked');
  } finally {
    utils.releaseLock(lockPath);
  }
}

main().catch(err => {
  console.error('baicai-vc unlink error:', err.message);
  process.exit(1);
});
