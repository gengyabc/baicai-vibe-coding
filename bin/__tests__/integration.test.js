const { test, expect, describe, beforeEach, afterEach } = require('bun:test');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const ownedPaths = require('../owned-paths');

describe('postinstall script', () => {
  test('exits early in self-install mode', () => {
    const result = spawnSync('bun', [path.resolve(__dirname, '../postinstall.js')], {
      env: { ...process.env, INIT_CWD: path.resolve(__dirname, '../..') },
      encoding: 'utf8',
    });
    expect(result.stdout).toContain('local package mode, skipping postinstall copy');
    expect(result.status).toBe(0);
  });
});

describe('preuninstall script', () => {
  test('exits early in self-install mode', () => {
    const result = spawnSync('bun', [path.resolve(__dirname, '../preuninstall.js')], {
      env: { ...process.env, INIT_CWD: path.resolve(__dirname, '../..') },
      encoding: 'utf8',
    });
    expect(result.stdout).toContain('local package mode, skipping preuninstall cleanup');
    expect(result.status).toBe(0);
  });
});

describe('owned-paths module', () => {
  test('contains baicai-vc paths', () => {
    expect(ownedPaths).toContain('agents/baicai-vc');
    expect(ownedPaths).toContain('commands/baicai-vc');
    expect(ownedPaths).toContain('rules/baicai-vc');
    expect(ownedPaths).toContain('skills/baicai-vc');
    expect(ownedPaths).toContain('workflows/baicai-vc');
  });

  test('contains baicai-vibe paths', () => {
    expect(ownedPaths).toContain('agents/baicai-vibe');
    expect(ownedPaths).toContain('commands/baicai-vibe');
    expect(ownedPaths).toContain('plugins/baicai-vibe');
    expect(ownedPaths).toContain('rules/baicai-vibe');
    expect(ownedPaths).toContain('skills/baicai-vibe');
    expect(ownedPaths).toContain('workflows/baicai-vibe');
  });

  test('baicai-vc paths match actual directory structure', () => {
    const opencodeDir = path.resolve(__dirname, '../../.opencode');
    const vcPaths = ownedPaths.filter(p => p.includes('baicai-vc'));
    vcPaths.forEach(relPath => {
      const fullPath = path.join(opencodeDir, relPath);
      expect(fs.existsSync(fullPath)).toBe(true);
    });
  });
});

describe('link script validation', () => {
  test('link.js has correct shebang', () => {
    const linkPath = path.resolve(__dirname, '../link.js');
    const content = fs.readFileSync(linkPath, 'utf8');
    expect(content.startsWith('#!/usr/bin/env node')).toBe(true);
  });

  test('unlink.js has correct shebang', () => {
    const unlinkPath = path.resolve(__dirname, '../unlink.js');
    const content = fs.readFileSync(unlinkPath, 'utf8');
    expect(content.startsWith('#!/usr/bin/env node')).toBe(true);
  });
});

describe('integration tests', () => {
  test('backup and restore workflow', () => {
    const utils = require('../install-utils');
    const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-test-'));
    const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-backup-'));
    
    fs.mkdirSync(path.join(testDir, 'agents/baicai-vc'), { recursive: true });
    fs.writeFileSync(path.join(testDir, 'agents/baicai-vc', 'test.md'), '# Test');
    
    const backedUp = utils.backupOwnedContent(testDir, backupDir, ownedPaths);
    expect(backedUp).toBe(true);
    expect(fs.existsSync(path.join(backupDir, 'agents/baicai-vc', 'test.md'))).toBe(true);
    
    utils.removeOwnedContent(testDir, ownedPaths);
    expect(fs.existsSync(path.join(testDir, 'agents/baicai-vc'))).toBe(false);
    
    fs.rmSync(testDir, { recursive: true, force: true });
    fs.rmSync(backupDir, { recursive: true, force: true });
  });

  test('syncDir creates correct directory structure', () => {
    const utils = require('../install-utils');
    const srcDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-src-'));
    const destDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-dest-'));
    
    fs.mkdirSync(path.join(srcDir, 'agents/baicai-vc'), { recursive: true });
    fs.mkdirSync(path.join(srcDir, 'commands/baicai-vc'), { recursive: true });
    fs.writeFileSync(path.join(srcDir, 'agents/baicai-vc', 'agent.md'), 'agent');
    fs.writeFileSync(path.join(srcDir, 'commands/baicai-vc', 'cmd.md'), 'cmd');
    
    utils.syncDir(srcDir, destDir);
    
    expect(fs.existsSync(path.join(destDir, 'agents/baicai-vc', 'agent.md'))).toBe(true);
    expect(fs.existsSync(path.join(destDir, 'commands/baicai-vc', 'cmd.md'))).toBe(true);
    
    fs.rmSync(srcDir, { recursive: true, force: true });
    fs.rmSync(destDir, { recursive: true, force: true });
  });

  test('full install simulation', () => {
    const utils = require('../install-utils');
    const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-project-'));
    const opencodeDir = path.join(projectDir, '.opencode');
    const srcDir = path.resolve(__dirname, '../../.opencode');
    
    utils.syncDir(srcDir, opencodeDir);
    
    expect(fs.existsSync(path.join(opencodeDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(opencodeDir, 'bun.lock'))).toBe(true);
    expect(fs.existsSync(path.join(opencodeDir, 'agents/baicai-vc'))).toBe(true);
    expect(fs.existsSync(path.join(opencodeDir, 'commands/baicai-vc'))).toBe(true);
    
    utils.removeOwnedContent(opencodeDir, ownedPaths);
    expect(fs.existsSync(path.join(opencodeDir, 'package.json'))).toBe(false);
    expect(fs.existsSync(path.join(opencodeDir, 'bun.lock'))).toBe(false);
    expect(fs.existsSync(path.join(opencodeDir, 'agents/baicai-vc'))).toBe(false);
    
    fs.rmSync(projectDir, { recursive: true, force: true });
  });

  test('removes both baicai-vc and baicai-vibe', () => {
    const utils = require('../install-utils');
    const opencodeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-opencode-'));
    
    fs.mkdirSync(path.join(opencodeDir, 'agents/baicai-vc'), { recursive: true });
    fs.mkdirSync(path.join(opencodeDir, 'agents/baicai-vibe'), { recursive: true });
    fs.writeFileSync(path.join(opencodeDir, 'agents/baicai-vc', 'vc.md'), 'vc');
    fs.writeFileSync(path.join(opencodeDir, 'agents/baicai-vibe', 'vibe.md'), 'vibe');
    
    utils.removeOwnedContent(opencodeDir, ownedPaths);
    
    expect(fs.existsSync(path.join(opencodeDir, 'agents/baicai-vc'))).toBe(false);
    expect(fs.existsSync(path.join(opencodeDir, 'agents/baicai-vibe'))).toBe(false);
    
    fs.rmSync(opencodeDir, { recursive: true, force: true });
  });

  test('backups both baicai-vc and baicai-vibe', () => {
    const utils = require('../install-utils');
    const opencodeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-opencode-'));
    const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-backup-'));
    
    fs.mkdirSync(path.join(opencodeDir, 'agents/baicai-vc'), { recursive: true });
    fs.mkdirSync(path.join(opencodeDir, 'agents/baicai-vibe'), { recursive: true });
    fs.writeFileSync(path.join(opencodeDir, 'agents/baicai-vc', 'vc.md'), 'vc');
    fs.writeFileSync(path.join(opencodeDir, 'agents/baicai-vibe', 'vibe.md'), 'vibe');
    
    const backedUp = utils.backupOwnedContent(opencodeDir, backupDir, ownedPaths);
    
    expect(backedUp).toBe(true);
    expect(fs.existsSync(path.join(backupDir, 'agents/baicai-vc', 'vc.md'))).toBe(true);
    expect(fs.existsSync(path.join(backupDir, 'agents/baicai-vibe', 'vibe.md'))).toBe(true);
    
    fs.rmSync(opencodeDir, { recursive: true, force: true });
    fs.rmSync(backupDir, { recursive: true, force: true });
  });

  test('preserves non-owned content', () => {
    const utils = require('../install-utils');
    const opencodeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'baicai-vc-opencode-'));
    
    fs.mkdirSync(path.join(opencodeDir, 'agents/baicai-vc'), { recursive: true });
    fs.mkdirSync(path.join(opencodeDir, 'agents/custom'), { recursive: true });
    fs.writeFileSync(path.join(opencodeDir, 'agents/baicai-vc', 'vc.md'), 'vc');
    fs.writeFileSync(path.join(opencodeDir, 'agents/custom', 'custom.md'), 'custom');
    
    utils.removeOwnedContent(opencodeDir, ownedPaths);
    
    expect(fs.existsSync(path.join(opencodeDir, 'agents/baicai-vc'))).toBe(false);
    expect(fs.existsSync(path.join(opencodeDir, 'agents/custom'))).toBe(true);
    expect(fs.existsSync(path.join(opencodeDir, 'agents/custom', 'custom.md'))).toBe(true);
    
    fs.rmSync(opencodeDir, { recursive: true, force: true });
  });
});
