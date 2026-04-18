const { test, expect, describe, beforeEach, afterEach } = require('bun:test');
const fs = require('fs');
const path = require('path');
const os = require('os');

const utils = require('../install-utils');
const ownedPaths = require('../owned-paths');

describe('resolvePkgDir', () => {
  test('returns the package directory', () => {
    const result = utils.resolvePkgDir();
    expect(result).toBe(path.resolve(__dirname, '../..'));
  });
});

describe('resolveProjectRoot', () => {
  test('uses INIT_CWD when set', () => {
    process.env.INIT_CWD = '/some/project';
    const result = utils.resolveProjectRoot('/some/path');
    expect(result).toBe('/some/project');
    delete process.env.INIT_CWD;
  });

  test('extracts project root from node_modules path', () => {
    const pkgDir = '/project/node_modules/baicai-vc';
    const result = utils.resolveProjectRoot(pkgDir);
    expect(result).toBe('/project');
  });

  test('extracts project root from nested node_modules path', () => {
    const pkgDir = '/project/node_modules/some-package/node_modules/baicai-vc';
    const result = utils.resolveProjectRoot(pkgDir);
    expect(result).toBe('/project');
  });

  test('returns cwd when not in node_modules and no INIT_CWD', () => {
    const originalInitCwd = process.env.INIT_CWD;
    delete process.env.INIT_CWD;
    const pkgDir = '/some/other/path';
    const result = utils.resolveProjectRoot(pkgDir);
    expect(result).toBe(process.cwd());
    if (originalInitCwd) process.env.INIT_CWD = originalInitCwd;
  });
});

describe('isGlobalInstall', () => {
  test('returns true when npm_config_global is true', () => {
    process.env.npm_config_global = 'true';
    expect(utils.isGlobalInstall()).toBe(true);
    delete process.env.npm_config_global;
  });

  test('returns true when BAICAI_VC_INSTALL_SCOPE is global', () => {
    process.env.BAICAI_VC_INSTALL_SCOPE = 'global';
    expect(utils.isGlobalInstall()).toBe(true);
    delete process.env.BAICAI_VC_INSTALL_SCOPE;
  });

  test('returns false when neither flag is set', () => {
    delete process.env.npm_config_global;
    delete process.env.BAICAI_VC_INSTALL_SCOPE;
    expect(utils.isGlobalInstall()).toBe(false);
  });
});

describe('resolveGlobalDir', () => {
  test('returns APPDATA/opencode when APPDATA is set', () => {
    process.env.APPDATA = '/Users/test/AppData/Roaming';
    const result = utils.resolveGlobalDir();
    expect(result).toBe('/Users/test/AppData/Roaming/opencode');
    delete process.env.APPDATA;
  });

  test('returns ~/.config/opencode when APPDATA is not set', () => {
    const originalAppData = process.env.APPDATA;
    delete process.env.APPDATA;
    const result = utils.resolveGlobalDir();
    expect(result).toBe(path.join(os.homedir(), '.config', 'opencode'));
    process.env.APPDATA = originalAppData;
  });
});

describe('isSelfInstall', () => {
  test('returns true when pkgDir equals projectRoot', () => {
    expect(utils.isSelfInstall('/project', '/project')).toBe(true);
  });

  test('returns false when paths differ', () => {
    expect(utils.isSelfInstall('/project/package', '/project')).toBe(false);
  });
});

describe('resolveBackupDir', () => {
  test('appends .baicai-vc-backup to target', () => {
    const result = utils.resolveBackupDir('/path/to/.opencode');
    expect(result).toBe('/path/to/.opencode.baicai-vc-backup');
  });
});

describe('resolveLockPath', () => {
  test('appends .baicai-vc.lock to target', () => {
    const result = utils.resolveLockPath('/path/to/.opencode');
    expect(result).toBe('/path/to/.opencode.baicai-vc.lock');
  });
});

describe('isNonInteractive', () => {
  test('returns true when CI is true', () => {
    process.env.CI = 'true';
    expect(utils.isNonInteractive()).toBe(true);
    delete process.env.CI;
  });

  test('returns true when BAICAI_VC_FORCE is true', () => {
    process.env.BAICAI_VC_FORCE = 'true';
    expect(utils.isNonInteractive()).toBe(true);
    delete process.env.BAICAI_VC_FORCE;
  });

  test('returns true when stdin is not TTY', () => {
    const originalIsTTY = process.stdin.isTTY;
    Object.defineProperty(process.stdin, 'isTTY', { value: false, writable: true });
    expect(utils.isNonInteractive()).toBe(true);
    Object.defineProperty(process.stdin, 'isTTY', { value: originalIsTTY, writable: true });
  });
});

describe('filesAreDifferent', () => {
  let testDir;

  afterEach(() => {
    if (testDir) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('returns true when dest does not exist', () => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
    const file1 = path.join(testDir, 'exists.txt');
    fs.writeFileSync(file1, 'content');
    const result = utils.filesAreDifferent(file1, path.join(testDir, 'nonexistent.txt'));
    expect(result).toBe(true);
  });

  test('returns false when files are identical', () => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
    const file1 = path.join(testDir, 'file1.txt');
    const file2 = path.join(testDir, 'file2.txt');
    fs.writeFileSync(file1, 'same content');
    fs.writeFileSync(file2, 'same content');

    expect(utils.filesAreDifferent(file1, file2)).toBe(false);
  });

  test('returns true when files differ', () => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
    const file1 = path.join(testDir, 'file1.txt');
    const file2 = path.join(testDir, 'file2.txt');
    fs.writeFileSync(file1, 'content a');
    fs.writeFileSync(file2, 'content b');

    expect(utils.filesAreDifferent(file1, file2)).toBe(true);
  });
});

describe('syncDir', () => {
  let tempDir;
  let srcDir;
  let destDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
    srcDir = path.join(tempDir, 'src');
    destDir = path.join(tempDir, 'dest');
    fs.mkdirSync(srcDir);
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('creates dest directory if not exists', () => {
    utils.syncDir(srcDir, destDir);
    expect(fs.existsSync(destDir)).toBe(true);
  });

  test('copies files from src to dest', () => {
    fs.writeFileSync(path.join(srcDir, 'test.txt'), 'hello');
    utils.syncDir(srcDir, destDir);
    expect(fs.readFileSync(path.join(destDir, 'test.txt'), 'utf8')).toBe('hello');
  });

  test('copies nested directories', () => {
    fs.mkdirSync(path.join(srcDir, 'nested'));
    fs.writeFileSync(path.join(srcDir, 'nested', 'file.txt'), 'nested content');
    utils.syncDir(srcDir, destDir);
    expect(fs.readFileSync(path.join(destDir, 'nested', 'file.txt'), 'utf8')).toBe('nested content');
  });

  test('excludes node_modules', () => {
    fs.mkdirSync(path.join(srcDir, 'node_modules'));
    fs.writeFileSync(path.join(srcDir, 'node_modules', 'pkg.txt'), 'should not copy');
    fs.writeFileSync(path.join(srcDir, 'include.txt'), 'should copy');
    utils.syncDir(srcDir, destDir);
    expect(fs.existsSync(path.join(destDir, 'node_modules'))).toBe(false);
    expect(fs.existsSync(path.join(destDir, 'include.txt'))).toBe(true);
  });

  test('excludes .DS_Store', () => {
    fs.writeFileSync(path.join(srcDir, '.DS_Store'), 'store');
    fs.writeFileSync(path.join(srcDir, 'file.txt'), 'content');
    utils.syncDir(srcDir, destDir);
    expect(fs.existsSync(path.join(destDir, '.DS_Store'))).toBe(false);
    expect(fs.existsSync(path.join(destDir, 'file.txt'))).toBe(true);
  });

  test('skips symbolic links', () => {
    fs.writeFileSync(path.join(srcDir, 'real.txt'), 'real');
    fs.symlinkSync(path.join(srcDir, 'real.txt'), path.join(srcDir, 'link.txt'));
    utils.syncDir(srcDir, destDir);
    expect(fs.existsSync(path.join(destDir, 'link.txt'))).toBe(false);
    expect(fs.existsSync(path.join(destDir, 'real.txt'))).toBe(true);
  });

  test('does not overwrite identical files', () => {
    fs.writeFileSync(path.join(srcDir, 'file.txt'), 'same');
    fs.mkdirSync(destDir);
    fs.writeFileSync(path.join(destDir, 'file.txt'), 'same');
    const beforeMtime = fs.statSync(path.join(destDir, 'file.txt')).mtimeMs;

    utils.syncDir(srcDir, destDir);

    const afterMtime = fs.statSync(path.join(destDir, 'file.txt')).mtimeMs;
    expect(afterMtime).toBe(beforeMtime);
  });
});

describe('removeOwnedContent', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('removes specified paths', () => {
    const testPaths = ['agents/baicai-vc', 'commands/baicai-vc'];
    fs.mkdirSync(path.join(tempDir, 'agents/baicai-vc'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'commands/baicai-vc'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'agents/baicai-vc', 'test.txt'), 'test');

    utils.removeOwnedContent(tempDir, testPaths);

    expect(fs.existsSync(path.join(tempDir, 'agents/baicai-vc'))).toBe(false);
    expect(fs.existsSync(path.join(tempDir, 'commands/baicai-vc'))).toBe(false);
  });

  test('does not remove non-owned paths', () => {
    const testPaths = ['agents/baicai-vc'];
    fs.mkdirSync(path.join(tempDir, 'agents/baicai-vc'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'agents/baicai-vibe'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'agents/baicai-vc', 'test.txt'), 'test');
    fs.writeFileSync(path.join(tempDir, 'agents/baicai-vibe', 'test.txt'), 'test');

    utils.removeOwnedContent(tempDir, testPaths);

    expect(fs.existsSync(path.join(tempDir, 'agents/baicai-vc'))).toBe(false);
    expect(fs.existsSync(path.join(tempDir, 'agents/baicai-vibe'))).toBe(true);
  });

  test('removes empty parent directories', () => {
    const testPaths = ['agents/baicai-vc'];
    fs.mkdirSync(path.join(tempDir, 'agents/baicai-vc'), { recursive: true });

    utils.removeOwnedContent(tempDir, testPaths);

    expect(fs.existsSync(path.join(tempDir, 'agents'))).toBe(false);
  });

  test('preserves non-empty parent directories', () => {
    const testPaths = ['agents/baicai-vc'];
    fs.mkdirSync(path.join(tempDir, 'agents/baicai-vc'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'agents/other'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'agents/other', 'file.txt'), 'test');

    utils.removeOwnedContent(tempDir, testPaths);

    expect(fs.existsSync(path.join(tempDir, 'agents/baicai-vc'))).toBe(false);
    expect(fs.existsSync(path.join(tempDir, 'agents/other'))).toBe(true);
  });
});

describe('hasBaicaiVcContent', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('returns false for non-existent directory', () => {
    expect(utils.hasBaicaiVcContent('/nonexistent/path')).toBe(false);
  });

  test('returns false when no owned content exists', () => {
    expect(utils.hasBaicaiVcContent(tempDir)).toBe(false);
  });

  test('returns true when owned content exists', () => {
    fs.mkdirSync(path.join(tempDir, 'agents/baicai-vc'), { recursive: true });
    expect(utils.hasBaicaiVcContent(tempDir, ownedPaths)).toBe(true);
  });
});

describe('backupOwnedContent', () => {
  let tempDir;
  let backupDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
    backupDir = path.join(tempDir, 'backup');
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('returns false when nothing to backup', () => {
    const result = utils.backupOwnedContent(tempDir, backupDir, ['agents/baicai-vc']);
    expect(result).toBe(false);
    expect(fs.existsSync(backupDir)).toBe(false);
  });

  test('backs up existing content', () => {
    const testPaths = ['agents/baicai-vc'];
    fs.mkdirSync(path.join(tempDir, 'agents/baicai-vc'), { recursive: true });
    fs.writeFileSync(path.join(tempDir, 'agents/baicai-vc', 'test.txt'), 'test');

    const result = utils.backupOwnedContent(tempDir, backupDir, testPaths);

    expect(result).toBe(true);
    expect(fs.existsSync(path.join(backupDir, 'agents/baicai-vc', 'test.txt'))).toBe(true);
    expect(fs.readFileSync(path.join(backupDir, 'agents/baicai-vc', 'test.txt'), 'utf8')).toBe('test');
  });
});

describe('lock mechanism', () => {
  let tempDir;
  let lockPath;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
    lockPath = path.join(tempDir, '.lock');
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('acquireLock creates lock file with PID', async () => {
    const acquired = await utils.acquireLock(tempDir);
    expect(fs.existsSync(acquired)).toBe(true);
    const pid = parseInt(fs.readFileSync(acquired, 'utf8'), 10);
    expect(pid).toBe(process.pid);
    utils.releaseLock(acquired);
  });

  test('releaseLock removes lock file', async () => {
    const acquired = await utils.acquireLock(tempDir);
    utils.releaseLock(acquired);
    expect(fs.existsSync(acquired)).toBe(false);
  });

  test('acquireLock cleans up stale lock from dead process', async () => {
    const fakePid = 99999999;
    fs.writeFileSync(lockPath, `${fakePid}\n`);
    
    const acquired = await utils.acquireLock(tempDir, 100);
    expect(fs.existsSync(acquired)).toBe(true);
    expect(parseInt(fs.readFileSync(acquired, 'utf8'), 10)).toBe(process.pid);
    utils.releaseLock(acquired);
  });

  test('acquireLock times out when lock is held by same process', async () => {
    const lockFile = await utils.acquireLock(tempDir);
    
    await expect(utils.acquireLock(tempDir, 50)).rejects.toThrow('Timed out waiting for lock');
    
    utils.releaseLock(lockFile);
  });

  test('acquireLock retries when lock is released during wait', async () => {
    const firstLock = await utils.acquireLock(tempDir);
    
    const acquirePromise = utils.acquireLock(tempDir, 500);
    
    setTimeout(() => utils.releaseLock(firstLock), 50);
    
    const secondLock = await acquirePromise;
    expect(fs.existsSync(secondLock)).toBe(true);
    utils.releaseLock(secondLock);
  });

  test('acquireLock handles malformed lock file', async () => {
    fs.writeFileSync(lockPath, 'not-a-number\n');
    
    const acquired = await utils.acquireLock(tempDir, 100);
    expect(fs.existsSync(acquired)).toBe(true);
    utils.releaseLock(acquired);
  });

  test('acquireLock handles empty lock file', async () => {
    fs.writeFileSync(lockPath, '\n');
    
    const acquired = await utils.acquireLock(tempDir, 100);
    expect(fs.existsSync(acquired)).toBe(true);
    utils.releaseLock(acquired);
  });
});

describe('owned-paths', () => {
  test('exports array of paths', () => {
    expect(Array.isArray(ownedPaths)).toBe(true);
    expect(ownedPaths.length).toBeGreaterThan(0);
  });

  test('all paths use forward slashes', () => {
    ownedPaths.forEach(p => {
      expect(p).not.toContain('\\');
    });
  });

  test('paths do not start with slash', () => {
    ownedPaths.forEach(p => {
      expect(p.startsWith('/')).toBe(false);
    });
  });
});

describe('prompt', () => {
  test('returns "yes" in non-interactive mode when CI=true', async () => {
    process.env.CI = 'true';
    const result = await utils.prompt('Question?');
    expect(result).toBe('yes');
    delete process.env.CI;
  });

  test('returns "yes" in non-interactive mode when BAICAI_VC_FORCE=true', async () => {
    process.env.BAICAI_VC_FORCE = 'true';
    const result = await utils.prompt('Question?');
    expect(result).toBe('yes');
    delete process.env.BAICAI_VC_FORCE;
  });
});

describe('runInstall', () => {
  test('returns false when no package.json exists', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
    const result = utils.runInstall(tempDir, () => {});
    expect(result).toBe(false);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('uses bun when bun.lockb exists', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
    fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
    fs.writeFileSync(path.join(tempDir, 'bun.lockb'), '');

    let calledWith = null;
    const mockExec = (cmd) => { calledWith = cmd; };

    utils.runInstall(tempDir, mockExec);
    expect(calledWith).toContain('bun install');

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('uses npm when bun.lockb does not exist', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
    fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');

    let calledWith = null;
    const mockExec = (cmd) => { calledWith = cmd; };

    utils.runInstall(tempDir, mockExec);
    expect(calledWith).toContain('npm install');

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('returns false when install fails', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
    fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');

    const mockExec = () => { throw new Error('Install failed'); };
    const result = utils.runInstall(tempDir, mockExec);
    expect(result).toBe(false);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});