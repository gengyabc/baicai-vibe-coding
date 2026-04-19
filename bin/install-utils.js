const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const ownedPaths = require('./owned-paths');

const syncExcludes = [
  'node_modules',
  '.DS_Store',
  '.gitignore',
  'package.json',
  'package-lock.json',
  'bun.lock',
  'bun.lockb',
  'pnpm-lock.yaml',
  'yarn.lock',
  'opencode.json',
  '.venv',
  '__pycache__',
];
const LOCK_POLL_MS = 100;
const LOCK_TIMEOUT_MS = 30000;

function resolvePkgDir() {
  return path.resolve(__dirname, '..');
}

function resolveProjectRoot(pkgDir) {
  if (process.env.INIT_CWD) {
    return process.env.INIT_CWD;
  }

  const cwd = process.cwd();
  const normalizedPkgDir = path.resolve(pkgDir);
  const nodeModulesMarker = `${path.sep}node_modules${path.sep}`;

  if (normalizedPkgDir.includes(nodeModulesMarker)) {
    return normalizedPkgDir.split(nodeModulesMarker)[0];
  }

  // When running from the source tree, infer the repo root from bin/.
  if (normalizedPkgDir === __dirname) {
    return path.resolve(normalizedPkgDir, '..');
  }

  return cwd;
}

function isGlobalInstall() {
  const flag = process.env.npm_config_global || process.env.BAICAI_VC_INSTALL_SCOPE;
  return flag === 'true' || flag === '1' || flag === 'global';
}

function resolveGlobalDir() {
  if (process.env.APPDATA) {
    return path.join(process.env.APPDATA, 'opencode');
  }

  return path.join(os.homedir(), '.config', 'opencode');
}

function isSelfInstall(pkgDir, projectRoot) {
  return path.resolve(pkgDir) === path.resolve(projectRoot);
}

function resolveBackupDir(targetDir) {
  return `${targetDir}.baicai-vc-backup`;
}

function resolveLockPath(targetDir) {
  return `${targetDir}.baicai-vc.lock`;
}

function isNonInteractive() {
  if (process.env.CI === 'true') return true;
  if (process.env.BAICAI_VC_FORCE === 'true') return true;
  if (!process.stdin.isTTY) return true;
  return false;
}

function fileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function filesAreDifferent(srcPath, destPath) {
  if (!fs.existsSync(destPath)) return true;

  return fileHash(srcPath) !== fileHash(destPath);
}

function copyPath(srcPath, destPath) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.cpSync(srcPath, destPath, { recursive: true, force: true, dereference: false });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function readLockPid(lockPath) {
  try {
    const pid = Number.parseInt(fs.readFileSync(lockPath, 'utf8'), 10);
    return Number.isInteger(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function acquireLock(targetDir, timeoutMs = LOCK_TIMEOUT_MS) {
  const lockPath = resolveLockPath(targetDir);
  const startedAt = Date.now();

  while (true) {
    try {
      fs.writeFileSync(lockPath, `${process.pid}\n`, { flag: 'wx' });
      return lockPath;
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;

      const pid = readLockPid(lockPath);
      if (pid === null || !isProcessAlive(pid)) {
        fs.rmSync(lockPath, { force: true });
        continue;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        throw new Error(`Timed out waiting for lock: ${lockPath}`);
      }

      await sleep(LOCK_POLL_MS);
    }
  }
}

function releaseLock(lockPath) {
  fs.rmSync(lockPath, { force: true });
}

function backupOwnedContent(dir, backupDir, paths = ownedPaths) {
  let backedUp = false;

  for (const rel of paths) {
    const srcPath = path.join(dir, rel);

    if (!fs.existsSync(srcPath)) continue;

    copyPath(srcPath, path.join(backupDir, rel));
    backedUp = true;
  }

  return backedUp;
}

function prompt(question) {
  if (isNonInteractive()) {
    console.log(`${question} (auto: yes)`);
    return Promise.resolve('yes');
  }

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

function syncDir(src, dest, exclude = syncExcludes) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (const entry of fs.readdirSync(src)) {
    if (exclude.includes(entry)) continue;
    if (entry.endsWith('.lock')) continue;

    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);

    if (fs.lstatSync(srcPath).isSymbolicLink()) {
      continue;
    }

    if (fs.statSync(srcPath).isDirectory()) {
      syncDir(srcPath, destPath, exclude);
    } else if (filesAreDifferent(srcPath, destPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeOwnedContent(dir, paths = ownedPaths) {
  for (const rel of paths) {
    const relPath = path.join(dir, rel);

    if (fs.existsSync(relPath)) {
      fs.rmSync(relPath, { recursive: true, force: true });
      let parentDir = path.dirname(relPath);
      const stopDir = path.resolve(dir);

      while (path.resolve(parentDir) !== stopDir) {
        if (!fs.existsSync(parentDir)) break;

        const entries = fs.readdirSync(parentDir);
        if (entries.length > 0) break;

        fs.rmdirSync(parentDir);
        parentDir = path.dirname(parentDir);
      }
    }
  }
}

function hasBaicaiVcContent(dir, paths = ownedPaths) {
  if (!fs.existsSync(dir)) return false;

  return paths.some(rel => fs.existsSync(path.join(dir, rel)));
}

module.exports = {
  resolvePkgDir,
  resolveProjectRoot,
  isGlobalInstall,
  resolveGlobalDir,
  isSelfInstall,
  resolveBackupDir,
  resolveLockPath,
  isNonInteractive,
  filesAreDifferent,
  backupOwnedContent,
  acquireLock,
  releaseLock,
  prompt,
  syncDir,
  removeOwnedContent,
  hasBaicaiVcContent,
};
