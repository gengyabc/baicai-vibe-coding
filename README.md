# baicai-vibe-coding

Project-level OpenCode runtime.

This repo owns the local planning pipeline, step contracts, review loops, and project-specific files under `.opencode`.

## Layout

- Project source: `~/programming/baicai-vibe-coding/.opencode`
- Global shared source: `~/programming/baicai-vibe/.opencode`
- Project vendor link: `.opencode/_vendor/baicai-vibe -> ~/.config/opencode`

## Setup

Run:

```bash
./scripts/setup-vendor-symlink.sh
```

This ensures:

```text
~/.config/opencode -> ~/programming/baicai-vibe/.opencode
~/programming/baicai-flow/baicai-flow/.opencode -> ~/programming/baicai-vibe-coding/.opencode
~/programming/baicai-vibe-coding/.opencode/_vendor/baicai-vibe -> ~/.config/opencode
```

## Check

```bash
ls -la .opencode/_vendor/baicai-vibe
```
