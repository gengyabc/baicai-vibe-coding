// Manual list of owned paths - sync when adding/removing artifacts
// Used by postinstall/preuninstall to track what we install/remove
// Includes both baicai-vc and its dependency baicai-vibe
module.exports = [
  'package.json',
  'bun.lock',
  'agents/baicai-vc',
  'commands/baicai-vc',
  'rules/baicai-vc',
  'skills/baicai-vc',
  'workflows/baicai-vc',
  'agents/baicai-vibe',
  'commands/baicai-vibe',
  'plugins/baicai-vibe',
  'rules/baicai-vibe',
  'skills/baicai-vibe',
  'workflows/baicai-vibe',
];
