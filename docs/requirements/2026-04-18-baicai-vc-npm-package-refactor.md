# baicai-vc npm 包重构

## 状态
ready

## 标题
将 baicai-vibe-coding 项目重构为可发布的 npm 包 baicai-vc

## 聚焦点
参照 baicai-vibe(https://github.com/gengyabc/baicai-vibe) 的结构，将本项目改造为可发布的 npm 包 baicai-vc，支持 bun link 本地开发，将 baicai-vibe 作为依赖，整理 .opencode 内的项目特有文件到 baicai-vc 子目录

## 范围内

### 1. 创建基础包结构
- 创建根目录 package.json，配置 npm 包元数据（name: baicai-vc）
- 添加 baicai-vibe 作为依赖
- 配置 .npmignore 排除测试/开发文件

### 2. 创建 bin 脚本
- link.js - 本地开发链接脚本
- unlink.js - 清理链接脚本
- postinstall.js - 安装后处理脚本
- preuninstall.js - 卸载前清理脚本
- owned-paths.js - 定义包拥有的路径
- install-utils.js - 安装工具函数

### 3. 整理 .opencode 内容到 baicai-vc 子目录

**agents (2 个文件)**
- quality-review.md → agents/baicai-vc/
- requirements-review.md → agents/baicai-vc/

**commands (11 个文件)**
- archive-phase.md → commands/baicai-vc/
- decide-step-specs.md → commands/baicai-vc/
- discover-requirements.md → commands/baicai-vc/
- implement-from-plan.md → commands/baicai-vc/
- lookup-archive-context.md → commands/baicai-vc/
- plan-step.md → commands/baicai-vc/
- recover-phase-log.md → commands/baicai-vc/
- review-quality.md → commands/baicai-vc/
- review-requirements.md → commands/baicai-vc/
- write-step-e2e.md → commands/baicai-vc/
- update-step-tracking.md（如有）→ commands/baicai-vc/

**rules (15 个文件)**
- archive-safety.md → rules/baicai-vc/
- decision-artifact.md → rules/baicai-vc/
- discover-requirements-output.md → rules/baicai-vc/
- naming-layout.md → rules/baicai-vc/
- planning-memory.md → rules/baicai-vc/
- review-artifact.md → rules/baicai-vc/
- review-flow.md → rules/baicai-vc/
- review-quality.md → rules/baicai-vc/
- scope.md → rules/baicai-vc/
- step-delta-artifact.md → rules/baicai-vc/
- subagent-failure-response.md → rules/baicai-vc/
- tdd.md → rules/baicai-vc/
- test-checklist-artifact.md → rules/baicai-vc/
- test-layer-mode.md → rules/baicai-vc/

**skills (4 个目录)**
- quality-review/ (含 SKILL.md 和 references/) → skills/baicai-vc/
- step-spec-gate/ → skills/baicai-vc/
- tdd-review-implementation/ → skills/baicai-vc/
- write-step-e2e/ → skills/baicai-vc/

**workflows (14 个文件 + 2 个子目录)**
- archive-phase.md → workflows/baicai-vc/
- decide-step-specs.md → workflows/baicai-vc/
- discover-requirements.md → workflows/baicai-vc/
- discover-requirements-local.md → workflows/baicai-vc/
- implement-from-plan.md → workflows/baicai-vc/
- lookup-archive-context.md → workflows/baicai-vc/
- recover-phase-log.md → workflows/baicai-vc/
- review-quality.md → workflows/baicai-vc/
- review-requirements.md → workflows/baicai-vc/
- write-step-e2e.md → workflows/baicai-vc/
- update-step-tracking.md → workflows/baicai-vc/
- plan-step/ (含 common.md, continue-after.md, index.md, initial.md, replan-from.md) → workflows/baicai-vc/
- phase-log-memory/ (含 archive-preflight.md, read-context.md, recover.md, review-note.md, topic-sync.md, update.md) → workflows/baicai-vc/

### 4. 创建文档
- README.md - 包说明、安装方法、使用指南
- AGENTS.md - AI Agent 指南

## 范围外

1. 修改 baicai-vibe 包本身
2. 迁移 plugins 目录（目前只有 baicai-vibe 子目录）
3. 修改 .opencode/opencode.json 配置内容（模型配置等）
4. 实际发布到 npm registry（仅准备发布能力）
5. 更新已存在文件的内部引用路径（需要后续验证）

## 约束条件

1. **结构一致性** - 必须保持与 baicai-vibe 相同的结构模式（子目录命名和组织方式）
2. **安装脚本行为** - postinstall 脚本必须：
   - 支持覆盖提示（交互式）
   - 支持 CI 非交互模式（CI=true 或 BAICAI_VC_FORCE=true）
   - 支持 global/project 安装 scope
3. **本地开发兼容** - bun link 必须工作，且 postinstall 自动运行（通过 bin/link.js helper）
4. **npm pack 验证** - 必须通过 npm pack --dry-run 验证输出正确

## 假设

1. baicai-vibe 已发布到 npm registry 或可通过 bun link 使用
2. 当前 .opencode/baicai-vibe 子目录是已安装的 baicai-vibe 内容（应保留不动）
3. 项目特有文件可被整理且整理后不破坏内部引用关系
4. 使用 bun 作为包管理器（与 baicai-vibe 一致）

## 成功标准

1. `bun link baicai-vc` 成功，且 postinstall 脚本自动运行
2. `npm pack --dry-run` 输出包含：
   - .opencode/baicai-vc/ 所有子目录
   - bin/*.js 所有脚本
   - README.md, AGENTS.md
   - 不包含 node_modules, .git, 测试文件
3. `.opencode/{agents,commands,rules,skills,workflows}/baicai-vc/` 目录结构完整
4. 文档（README.md, AGENTS.md）清晰描述包用途、安装、使用方法

## 任务分解

### D1: 创建基础包结构
- 创建 package.json（name, version, description, license, files, bin, scripts, dependencies）
- 添加 baicai-vibe 依赖
- 创建 .npmignore

### D2: 创建 bin 脚本
- 复制/改编 baicai-vibe 的 bin/link.js
- 复制/改编 baicai-vibe 的 bin/unlink.js
- 复制/改编 baicai-vibe 的 bin/postinstall.js
- 复制/改编 baicai-vibe 的 bin/preuninstall.js
- 复制/改编 baicai-vibe 的 bin/owned-paths.js
- 复制/改编 baicai-vibe 的 bin/install-utils.js
- 适配 baicai-vc 的包名和路径

### D3: 整理 agents
- 创建 agents/baicai-vc/ 目录
- 移动 quality-review.md
- 移动 requirements-review.md

### D4: 整理 commands
- 创建 commands/baicai-vc/ 目录
- 移动 11 个命令文件

### D5: 整理 rules
- 创建 rules/baicai-vc/ 目录
- 移动 15 个规则文件

### D6: 整理 skills
- 创建 skills/baicai-vc/ 目录
- 移动 quality-review/ 目录（含 SKILL.md 和 references/）
- 移动 step-spec-gate/ 目录
- 移动 tdd-review-implementation/ 目录
- 移动 write-step-e2e/ 目录

### D7: 整理 workflows
- 创建 workflows/baicai-vc/ 目录
- 移动 14 个工作流文件
- 移动 plan-step/ 子目录
- 移动 phase-log-memory/ 子目录

### D8: 创建文档
- 创建 README.md（参考 baicai-vibe README）
- 创建 AGENTS.md

### D9: 验证完整性
- 运行 npm pack --dry-run
- 测试 bun link 流程

## 关键文件清单

### 需要移动的文件

**agents → agents/baicai-vc/**
- quality-review.md
- requirements-review.md

**commands → commands/baicai-vc/**
- archive-phase.md
- decide-step-specs.md
- discover-requirements.md
- implement-from-plan.md
- lookup-archive-context.md
- plan-step.md
- recover-phase-log.md
- review-quality.md
- review-requirements.md
- write-step-e2e.md

**rules → rules/baicai-vc/**
- archive-safety.md
- decision-artifact.md
- discover-requirements-output.md
- naming-layout.md
- planning-memory.md
- review-artifact.md
- review-flow.md
- review-quality.md
- scope.md
- step-delta-artifact.md
- subagent-failure-response.md
- tdd.md
- test-checklist-artifact.md
- test-layer-mode.md

**skills → skills/baicai-vc/**
- quality-review/SKILL.md
- quality-review/references/review-result-schema.md
- step-spec-gate/SKILL.md
- tdd-review-implementation/SKILL.md
- write-step-e2e/SKILL.md

**workflows → workflows/baicai-vc/**
- archive-phase.md
- decide-step-specs.md
- discover-requirements.md
- discover-requirements-local.md
- implement-from-plan.md
- lookup-archive-context.md
- recover-phase-log.md
- review-quality.md
- review-requirements.md
- write-step-e2e.md
- update-step-tracking.md
- plan-step/common.md
- plan-step/continue-after.md
- plan-step/index.md
- plan-step/initial.md
- plan-step/replan-from.md
- phase-log-memory/archive-preflight.md
- phase-log-memory/read-context.md
- phase-log-memory/recover.md
- phase-log-memory/review-note.md
- phase-log-memory/topic-sync.md
- phase-log-memory/update.md