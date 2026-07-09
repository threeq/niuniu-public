<div align="center">

# 🐮 牛牛 Niuniu

### 给定一个目标，AI 团队并行把它做完

> 中文 | [English](./README.en.md)

[![Stars](https://img.shields.io/github/stars/threeq/niuniu-public?style=flat&logo=github&color=f5a623)](https://github.com/threeq/niuniu-public/stargazers)
[![Latest release](https://img.shields.io/github/v/release/threeq/niuniu-public?display_name=tag&logo=github)](https://github.com/threeq/niuniu-public/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/threeq/niuniu-public/total?logo=github&label=downloads)](https://github.com/threeq/niuniu-public/releases)
[![License](https://img.shields.io/github/license/threeq/niuniu-public)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue)](https://www.niu6ai.com)
[![Website](https://img.shields.io/badge/官网-niu6ai.com-2e7d32?logo=astro&logoColor=white)](https://www.niu6ai.com)

</div>

牛牛是一款**目标驱动**的本地优先 AI 工作平台：把要做的事写成 issue，多个 agent 在 **Claude Code / Codex / 任意模型**上自主规划、**并行执行**、自动验证，跨项目、跨仓库协作 —— 只在真正阻塞时回到你这里确认。它最初用于并行驱动多个编码 agent，如今已扩展到**软件开发、泛办公、数据分析与内容创作**。

## 🎬 Demo

把单开 Claude Code 的「你亲自驱动的一个会话」，变成**多 workspace 同屏并行跑 agent**：

<div align="center">

![牛牛:多个 workspace 各跑一个 agent,按看板配置自选阶段并行自主闭环](./docs/assets/demo.gif)

<sub>3 个 workspace 各自驱动一个 issue,agent 并行推进、隔离互不干扰,各自到点收尾</sub>

<sub><i>示意动画(非桌面 app 实拍);静态截图见下方「关于牛牛」与<a href="https://www.niu6ai.com">官网</a>。动画由 <a href="./scripts/make-demo-gif.py"><code>scripts/make-demo-gif.py</code></a> 生成。</i></sub>

</div>

> 真实工作站截图:
>
> <img src="./website/public/images/dashboard-preview.png" alt="牛牛工作站界面:任务列表、并行对话面板、仓库提交记录与终端" width="760" />

## ⚡ 牛牛 vs 单开 Claude Code / Cursor

|  | 🐮 牛牛 | 单开 Claude Code / Cursor |
|---|---|---|
| **工作单元** | 一个**目标 / issue** | 一次对话 |
| **并发** | **多 workspace 并行**跑多个 agent | 单会话驱动,可起并行子 agent |
| **隔离** | 每个 workspace 独立 git worktree + 独立会话,互不踩踏 | 共用同一工作区,易相互干扰 |
| **自主度** | 自主规划 → 执行 → 验证闭环,阻塞才找你 | 每一步都要你盯着推进 |
| **跨项目 / 跨仓库** | 原生支持,统一看板调度 | 手动切换上下文 |
| **进度跟踪** | 内置 Kanban:issue / checklist / 评论 / 时间线 | 散落在聊天记录里 |
| **执行流程** | 按看板配置的处理阶段,AI 自动选择执行流程(实现 / AI 审查 / 人工审查 / 完成) | 固定手动步骤 |
| **状态访问** | Claude Code 经 MCP 直接读取牛牛上下文 | 无 |

> 一句话:Claude Code / Cursor 即便能并行起子 agent,核心仍是**你亲自驱动的一个会话**;牛牛是从看板**并行调度多个独立 workspace、各自一支 agent 团队**的工作站。

## ✨ 能力全景

一个平台，横跨软件 · 办公 · 数据 · 内容:

- **目标驱动 · 自动托管闭环** — 写下目标,agent 自主规划 → 执行 → 验证 → 收尾;自动托管看门狗无人值守持续推进,阻塞才回到你这里。
- **多 Workspace 并行 · worktree 隔离** — 每个 workspace 一个独立 git worktree + 独立 agent 会话,跨项目、跨仓库并行,互不踩踏。
- **多引擎 · 任意模型不锁厂商** — 驱动 Claude Code / Codex / Qwen Code,并可经场景预设指向 GLM(智谱)/ DeepSeek / MiniMax / Kimi 等任意兼容端点,按 workspace 切换。
- **Kanban + Harness 工程规范** — issue / 清单 / 评论 / 时间线一站跟踪;Harness 把 lint / 测试 / AI 评审串成提交前门禁。
- **场景(Scene):一键工作模式** — 18 个内置场景横跨软件 / 办公 / 数据 / 内容,声明式注入 MCP + 插件 + 快捷指令,自动推荐、可分层可 fork。
- **数据智能:接库查询 + 实时看板** — 连接 SQL / Redis / Mongo / ES / HTTP,受治理只读查询,图表内联并可固定为持续刷新的看板。
- **知识库 + 项目记忆** — 摄取本地目录建知识库供 agent 检索;白盒项目记忆沉淀模式、决策与踩坑,可搜索、合并、恢复。
- **IM 机器人:飞书 / 钉钉 / Telegram** — 从群聊双向对话式驱动工作,图文入站、markdown 出站,一个 bot 多项目分流。
- **无人值守 · 定时执行管理** — 为 workspace 配 cron 定时任务,到点自动触发 agent,执行历史与运行记录可回看。

## 链接

- 🌐 官网与文档:<https://www.niu6ai.com>
- 📦 桌面 app 下载:[Releases](https://github.com/threeq/niuniu-public/releases/latest)
- 📝 博客:<https://www.niu6ai.com/blog>
- 📜 更新日志:<https://www.niu6ai.com/changelog>
- 🐛 反馈 bug:[New Bug Report](https://github.com/threeq/niuniu-public/issues/new?template=bug_report_zh.yml)
- 💡 功能建议:[New Feature Request](https://github.com/threeq/niuniu-public/issues/new?template=feature_request_zh.yml)

## 关于牛牛

这个公开仓库包含官网源码、桌面应用发布、issue 跟踪与社区反馈;应用源码保留在私有仓库。完整介绍请见 [官网](https://www.niu6ai.com)。

牛牛把工作的最小单元从「一次对话」抬升到「一个目标」:每个 workspace 对应一个 issue,自带独立的 git worktree、独立的 Claude 会话与 shell 环境,agent 自主闭环这个目标,多个 workspace 互不干扰地并行推进。

## 提 issue 须知

- 本仓库的 issue 区由维护者主动跟踪,但**修复发生在私有仓库**中,issue 的关闭可能滞后于实际修复。
- 安全相关问题(漏洞、信息泄露等)**请勿公开提交**,通过官网联系方式发送邮件。
- 提交 bug 时请尽量附上桌面 app 版本号、操作系统、复现步骤,模板会引导你填。

## 官方网站

官网源码位于本仓库的 [`website/`](./website/) 目录,基于 [Astro](https://astro.build/) 构建,部署到 [www.niu6ai.com](https://www.niu6ai.com)。

本地开发:

```bash
cd website && pnpm install && pnpm dev
```

部署到生产:

```bash
bash deploy.sh
```

## 许可

[MIT](./LICENSE)
