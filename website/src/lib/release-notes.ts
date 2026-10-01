// Curated bilingual release notes for the official-site /changelog pages.
//
// The GitHub release body is the primary source (renderBody already understands
// <!-- niuniu-{zh,en}:start --> markers), but early releases of threeq/niuniu
// shipped with bare auto-generated bodies (a compare link, no real notes).
// Entries here take precedence so the site always shows real, localized notes.
//
// For future releases EITHER author the GitHub body with zh/en markers OR add
// an entry here — an entry here also keeps the desktop app's update-notes feed
// and the site in sync once the same text is patched into the GitHub release.
export const RELEASE_NOTES: Record<string, { zh: string; en: string }> = {
  'v0.8.7': {
    zh: `## 🖥️ 全新桌面端 v2 —— 从 Wails v3 整体迁移到 Tauri v2

- 原生壳内置 server + MCP sidecar，单文件安装包：Windows / macOS（Intel 与 Apple 芯片）/ Linux
- 托盘菜单、全局快捷键、AI 服务窗口 Win32 停靠、单实例抬升
- 检测到已运行的 server / 数据库被占用时拒绝重复启动（probe），不再卡启动画面
- 修复启动白屏、窗口不显示、WebView2 数据目录漂移等一系列问题

## 🤖 第六个 agent 引擎：Cursor

- 通过 ACP 协议接入 cursor agent，与 Claude Code / Codex / Qwen Code / omp / goose 并列
- one-shot 运行时重构为注册表派发，引擎枚举收敛为单一事实来源

## 🧩 Skill 管理与场景

- 全新 Skill 管理：跨 agent 安装 / 启用 / 更新 / 卸载（安装 ≠ 启用）
- 场景自带 skill 自动安装，重开工作空间自动核对安装完成
- viz-architecture 场景收编 archify 并支持仓库场景（本地化，不再联网更新）
- 内置技能镜像与源码树双向校验，杜绝静默漂移；HTML 预览支持触发下载

## 🗂️ 仓库文件：搜索与变更历史

- 仓库文件 tab 支持文件名 + 内容搜索，命中可跳转并标记目标行
- 打开文件即可查看 git 变更历史（跨重命名跟随），右侧可关闭的历史边栏

## 📚 知识库重构

- 升级为一级资源的主从界面：可拖拽侧边栏、文档阅读器、重建索引、分页与服务端筛选
- 修复上传 PDF / Office 文件被静默丢弃的问题

## 🛠️ 工程规范（Harness）

- 修复列闸执行丢失类型化字段导致静默放行
- 新增 issue 符合度 judge；底线收敛为项目级单字段；闸失败对用户可见

## 🔄 更新体验

- 应用内版本检测优先走 GitHub Releases（国内自动降级 niu6ai.com 镜像）
- 新版本提示直接展示「优化点清单」，升级内容一目了然

## 🏢 团队版

- 数据源支持归属组织：任意成员可创建组织数据源并在项目中共享使用，个人源不泄漏团队

## ⚙️ 其他

- 创建工作空间的权限模式默认值改为跳过权限（bypassPermissions）
- git 提交署名按「个人设置 > 仓库设置 > 全局配置」优先级生效，未配置时不再被合成身份覆盖
- 修复 Windows cgo 构建导致图片上传 WebP 优化崩溃；release workflow 构建修复

**Full Changelog**: https://github.com/threeq/niuniu/compare/v0.8.6...v0.8.7`,
    en: `## 🖥️ Brand-new desktop app v2 — full migration from Wails v3 to Tauri v2

- Native shell with the server + MCP sidecar embedded: single-file installers for Windows / macOS (Intel & Apple Silicon) / Linux
- Tray menu, global shortcuts, Win32-docked AI service windows, single-instance raise
- Refuses to double-start when a running server / occupied database is detected (probe) — no more stuck splash
- Fixed a series of launch issues: white screen, missing windows, WebView2 data-dir drift

## 🤖 Sixth agent engine: Cursor

- cursor agent integrated via the ACP protocol, alongside Claude Code / Codex / Qwen Code / omp / goose
- one-shot runtime refactored to registry-based dispatch; engine enum unified to a single source of truth

## 🧩 Skill management & scenes

- New Skill management: install / enable / update / uninstall across agents (installing ≠ enabling)
- Scene-bundled skills auto-install; reopening a workspace re-verifies installation
- archify vendored into the viz-architecture scene with repo-scene support (fully local, no online updates)
- Built-in skill mirror is verified both ways against the source tree; HTML preview can trigger downloads

## 🗂️ Repo files: search & change history

- File tab supports filename + content search with jump-to-line hit markers
- Open any file to inspect its git change history (follows renames) in a closable side panel

## 📚 Knowledge base rebuilt

- Promoted to a first-class master-detail UI: draggable sidebar, document reader, index rebuild, pagination & server-side filtering
- Fixed uploaded PDF / Office files being silently dropped

## 🛠️ Harness (engineering gates)

- Fixed silent gate passes caused by lost typed fields during column-gate execution
- New issue-conformance judge; guardrails consolidated to a single project-level field; gate failures are now visible

## 🔄 Update experience

- In-app update checks now prefer GitHub Releases (automatic fallback to the niu6ai.com mirror in mainland China)
- New-version prompts show a plain-language changelist of improvements

## 🏢 Team edition

- Data sources can be owned by an org: any member can create org-owned sources and share them across projects; personal sources never leak to the team

## ⚙️ Other

- New workspaces now default to the bypassPermissions mode
- Git commit identity follows Personal settings > Repo settings > Global config; no longer overridden by a synthetic identity when unset
- Fixed a Windows cgo build issue that crashed image upload WebP optimization; release workflow build fixes

**Full Changelog**: https://github.com/threeq/niuniu/compare/v0.8.6...v0.8.7`,
  },
  'v0.8.6': {
    zh: `## What's Changed

* 授权体系调整：从 MIT 改为 **Source-Available（NSL）** —— 个人/非商业使用免费，商用或团队/组织使用需商业授权 by @threeq in https://github.com/threeq/niuniu/pull/2
* 多租户组织功能分级 —— 个人版禁用，企业版按 license 开启 by @threeq in https://github.com/threeq/niuniu/pull/1

**Full Changelog**: https://github.com/threeq/niuniu/commits/v0.8.6`,
    en: `## What's Changed

* feat(license): 多租户组织功能分级 —— 开源版禁用，企业版按 license 开启 by @threeq in https://github.com/threeq/niuniu/pull/1
* feat(license): 从 MIT 改为 Source-Available (NSL) —— 商用/团队使用需授权 by @threeq in https://github.com/threeq/niuniu/pull/2

**Full Changelog**: https://github.com/threeq/niuniu/commits/v0.8.6`,
  },
  'v0.8.9': {
    zh: `## 🤖 全新自研 agent 引擎：niuniu-agent（第七引擎）

- 零依赖自研运行时：双协议模型层（Anthropic / OpenAI 兼容端点）、完整工具集（文件编辑、Bash、LSP 代码导航、Monitor 后台任务、WebFetch / WebSearch 含 SSRF 防护）与权限层
- 原生记忆系统：双层存储 + 评分召回注入 + 自动反思提炼与同主题整合
- 子 agent：进程内并行、上下文叠加或隔离可配、内置预设 + 声明式自定义类型
- 深度思考全链路回传（thinking / reasoning）、token 级流式输出、图片多模态输入
- 长任务：后台 Bash、会话恢复、结构化 compact 摘要（跨次合并 + 磁盘持久化，根治连锁压缩失真）、Anthropic 原生 context editing 与历史归档检索回注
- 安装即用：桌面端内嵌 niuniu-agent sidecar，选择 niuniu 引擎即可运行
- MCP client：自动拉起 .mcp.json 中的各 server，工具以 mcp__<server>__<tool> 注册
- eval 评估体系：任务集 + 沙箱 runner + 基线对比（首轮 20 任务 90% 通过）；RSI 自进化实验通道（经验沉淀 + 适应度门控 + 动态提示词）

## 🔀 模型中转对 codex 真正生效

- 官方式 CODEX_HOME 接入，兼容最新 codex-cli（0.154+ 实测）；provider 支持 codex 专用模型
- 中转密钥随工作空间删除自动清理，不残留

## 🧭 体验细节

- chat 状态栏实时显示当前模型供应商并跟随切换；关于页显示服务端真实版本号
- 超长输入（超 10 万字符）自动转文件引用，不再撑爆会话
- 工作空间支持不关联 issue 独立使用

## 🛡️ 稳定性

- 流式空闲看门狗（协议心跳不误判）：网关半途断流不再永久挂起会话
- 权限审批 120 秒超时兜底 + 进程树强杀，无人审批不再永久挂起
- macOS GUI 启动自动增补 PATH（修复 nvm / Homebrew 工具检测不到），同步支持 Linux 桌面启动
- agent 全链路文件日志 + SSE 重连修复，卡死回合可离线诊断`,
    en: `## 🤖 New built-in agent engine: niuniu-agent (the 7th engine)

- Zero-dependency in-house runtime: dual-protocol model layer (Anthropic / OpenAI-compatible endpoints), full toolset (file editing, Bash, LSP code navigation, Monitor for background tasks, WebFetch / WebSearch with SSRF protection) and a permission layer
- Native memory system: two-tier storage + scored-recall injection + automatic reflection, distillation and same-topic consolidation
- Subagents: in-process parallelism, context share-or-isolate, built-in presets plus declarative custom types
- Full-chain thinking / reasoning pass-through, token-level streaming, image (multimodal) input
- Long tasks: background Bash, session resume, structured compact summaries (merged across compactions and persisted — no more compaction-of-compaction drift), Anthropic-native context editing and archive re-injection
- Works out of the box: the desktop app bundles the niuniu-agent sidecar — pick the niuniu engine and go
- MCP client: launches servers from .mcp.json automatically, tools registered as mcp__<server>__<tool>
- eval harness: task suites + sandboxed runner + baseline comparison (first run: 18/20 tasks passed); RSI self-improvement experimental channel (experience grounding + fitness-gated evolution + dynamic prompts)

## 🔀 Provider relay now really works for codex

- Official-style CODEX_HOME integration, compatible with the latest codex-cli (verified on 0.154+); providers support a codex-specific model
- Relay keys are cleaned up automatically when a workspace is deleted

## 🧭 Experience polish

- The chat status bar shows the active model provider live and follows switches; About page shows the real server version
- Oversized input (>100k characters) is auto-converted to a file reference instead of blowing up the session
- Workspaces can now be used without attaching an issue

## 🛡️ Stability

- Stream-idle watchdog (heartbeat-aware): a gateway mid-stream disconnect no longer hangs the session forever
- Permission approvals time out after 120s with process-tree kill — unattended prompts can no longer hang forever
- macOS GUI launches now repair PATH automatically (fixes nvm / Homebrew tools not being found); Linux desktop launches covered too
- Full-chain file logging for the agent + SSE reconnect fixes — hung turns are diagnosable offline`,
  },
  'v0.8.8': {
    zh: `## 🛡️ codex 稳定性专项

- 修复 codex 启动即「exited unexpectedly」：事件循环空闲误判退出 + 批量事务自死锁；启动失败时附带 stderr 真实原因
- 修复 turn 完成事件被丢弃导致工作区永久卡「运行中」、后续消息全部排队；修复回复后永久卡「执行中」
- 修复到期定时任务不触发恢复导致状态滞留；TodoWrite 状态值统一归一，不再因非法值丢弃整个任务更新
- codex 事件批量写库 + 通知队列扩容，长任务高频事件不再丢失

## 🚄 卡顿治理

- sidebar-git 与 /diff 查询加缓存（TTL + 并发合并计算），agent 工作时不再背靠背全量重算，切换工作空间不再卡顿

## ⏱️ 长命令与卡死保护

- 工具执行宽限：构建 / 测试等长命令不再被 15 分钟无输出误杀，六引擎统一判定
- one-shot 引擎补齐无输出兜底，进程僵死不再永久占用工作区

## 🖥️ 桌面端多窗口修复

- 修复多窗口并发创建挂死（webview 串行闸门 + ABBA 死锁）与 hub 重开后内容区空白
- 修复窗口首次打开超出屏幕下边缘 / 遮挡任务栏（按显示器可用区夹取，兼容 macOS 菜单栏/Dock、Linux 面板与 Wayland）

## 其他

- MFA 重复开启不再报错，可刷新二维码重新绑定
- chat 消息流支持直接渲染 agent 输出的数据图表（含混合形态）`,
    en: `## 🛡️ Codex stability

- Fixed codex dying instantly with "exited unexpectedly" (idle-gap misread as exit + batch-transaction self-deadlock); launch failures now include the real stderr reason
- Fixed dropped turn-completion events leaving workspaces stuck at "running" with all messages queued; fixed replies never leaving "working" state
- Fixed expired scheduled wakeups never resuming (stuck status); TodoWrite statuses are normalized instead of dropping the whole task update
- Batched codex event persistence + larger notification queue — no more lost events on long, chatty tasks

## 🚄 UI lag fixes

- sidebar-git and /diff queries now cache (TTL + single-flight): no more back-to-back full recomputes while the agent works, and switching workspaces no longer stutters

## ⏱️ Long-command & hang protection

- Tool-execution grace: long builds / test suites are no longer killed by the 15-minute inactivity watchdog, judged uniformly across all six engines
- one-shot engines gained an inactivity fallback so a wedged process can no longer hold a workspace forever

## 🖥️ Desktop multi-window fixes

- Fixed multi-window concurrent creation hangs (serialized webview gate + ABBA deadlock) and blank content after reopening the hub
- Fixed windows opening off-screen / covering the taskbar (clamped to the monitor work area; macOS menu bar/Dock, Linux panels and Wayland compatible)

## Other

- MFA re-enrollment no longer errors — the QR code can be refreshed
- Chat stream renders agent-produced data charts (mixed forms included) inline`,
  },
};
