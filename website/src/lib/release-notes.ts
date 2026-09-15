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
};
