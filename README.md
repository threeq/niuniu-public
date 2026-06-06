# 牛牛

> 中文 | [English](./README.en.md)

**牛牛**的公开仓库 —— 包含官网源码、桌面应用发布、issue 跟踪与社区反馈。
应用源码保留在私有仓库。

## 链接

- 🌐 官网与文档:<https://www.niu6ai.com>
- 📦 桌面 app 下载:[Releases](https://github.com/threeq/niuniu-public/releases/latest)
- 📜 更新日志:<https://www.niu6ai.com/changelog>
- 🐛 反馈 bug:[New Bug Report](https://github.com/threeq/niuniu-public/issues/new?template=bug_report_zh.yml)
- 💡 功能建议:[New Feature Request](https://github.com/threeq/niuniu-public/issues/new?template=feature_request_zh.yml)

## 关于牛牛

牛牛是一款**目标驱动**的本地优先 AI 开发工作站：把要做的事写成 issue，多个 Claude Code agent 自主规划、并行执行、自动验证，跨项目、跨仓库协作 —— 只在真正阻塞时回到你这里确认。
完整介绍请见 [官网](https://www.niu6ai.com)。

## 提 issue 须知

- 本仓库的 issue 区由维护者主动跟踪,但**修复发生在私有仓库**中,issue 的关闭可能滞后于实际修复。
- 安全相关问题(漏洞、信息泄露等)**请勿公开提交**,通过官网联系方式发送邮件。
- 提交 bug 时请尽量附上桌面 app 版本号、操作系统、复现步骤,模板会引导你填。

## 官方网站

官网源码位于本仓库的 [`website/`](./website/) 目录，基于 [Astro](https://astro.build/) 构建，部署到 [www.niu6ai.com](https://www.niu6ai.com)。

本地开发：

```bash
cd website && pnpm install && pnpm dev
```

部署到生产：

```bash
bash deploy.sh
```

## 许可

[MIT](./LICENSE)
