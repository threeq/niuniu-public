# 提交牛牛到 awesome 清单 — 投递包与执行手册

> 关联 issue: #433（Epic #431 子任务）。本文件是**可直接投递的素材 + 人工执行步骤**。
> 牛牛定位：目标驱动、本地优先的桌面工作站，编排一支 Claude Code agent 舰队，
> 把任务写成 issue 后并行规划/执行/验证，跨项目跨仓库协作。

## 为什么是「人工投递」而不是 agent 自动提 PR

调研后确认，这批清单无法由 agent 用当前凭据自动完成，必须人工经 GitHub 网页 UI 操作：

1. **awesome-claude-code 明文禁止机器人/`gh` CLI 投递**：投递必须由「人类」经网页 issue 表单完成，
   表单含「I am primarily composed of human-y stuff and not electrical circuits」勾选项，
   并设有严厉封禁的反垃圾机制。agent 自动投递会被自动关闭并可能**封禁 threeq 账号**。
2. **当前 fine-grained PAT 无法 fork 外部仓库**（`gh repo fork` 返回 `403 Resource not accessible`），
   因此 agent 无法对外部 awesome 仓库发起跨仓库 PR。
3. 这些是高信任度社区、且以 threeq 的真实身份对外发布，属于需要本人把关的对外动作。

因此本文件把每个目标研究清楚、写好可直接粘贴的文案，剩下的只是**人工点几下**。

---

## 目标清单一览（已做可行性核对）

| 目标 | 仓库 | 结论 | 动作 |
|---|---|---|---|
| awesome-claude-code | `hesreallyhim/awesome-claude-code`（约 28.5k★） | ✅ 高度契合，**最高价值** | 人工填网页表单（见 A） |
| awesome-devtools / awesome-ai-coding | `jamesmurdza/awesome-ai-devtools` | ✅ 契合「Multi-Agent Orchestration」分类 | 人工 fork+PR（见 B） |
| awesome-ai-coding（原定 sourcegraph） | `sourcegraph/awesome-code-ai` | ❌ 仓库**已 archived**，不再收 PR | 跳过，由 B 覆盖该意图 |
| awesome-agents | `kyrolabs/awesome-agents` | ❌ **要求开源 + 已有 traction**，自动关闭全新/闭源 PR | 不投递（牛牛闭源且全新，不合规） |
| awesome-agents（备选） | `e2b-dev/awesome-ai-agents` | ⚠️ 偏开源自治 agent 框架（AutoGPT 类），牛牛契合度弱 | 不建议；如投递需本人判断 |

> 说明：牛牛桌面应用为**闭源商业产品**（公开仓库仅含官网源码与发布物，应用源码在私有仓库）。
> 多数「awesome-agents」类清单要求开源，故不适用；而 awesome-claude-code 与 jamesmurdza
> 两个清单都收录闭源/商业工具（如 Cursor、Conductor、Superset、Google Antigravity），是正确落点。

---

## A. awesome-claude-code（人工网页表单投递）

- 投递入口（**必须用网页打开、由本人填写**）:
  <https://github.com/hesreallyhim/awesome-claude-code/issues/new?template=recommend-resource.yml>
- 投递前**必读**：`docs/CONTRIBUTING.md` 与 `docs/CODE_OF_CONDUCT.md`（该仓库下）。
- 分类落点：牛牛是「跑多个 Claude Code agent 并行 + 工作区隔离」的编排器 → **Category: Tooling / Sub-Category: Tooling: Orchestrators**。

### 表单逐字段填写

| 字段 | 填写内容 |
|---|---|
| Display Name | `Niuniu` |
| Category | `Tooling` |
| Sub-Category | `Tooling: Orchestrators` |
| Primary Link | `https://github.com/threeq/niuniu-public` （表单要求有 repo+官网时填 repo） |
| Author Name | `threeq` |
| Author Link | `https://github.com/threeq` |
| License | 选 `Other (specify below)`，在 Other License 填：`Public repo MIT; desktop app proprietary`（**如实说明，闭源工具务必诚实，该仓库以安全为重**） |
| Description | 见下方「Description」 |
| Validate Claims | 见下方 |
| Specific Task(s) | 见下方 |
| Specific Prompt(s) | 见下方 |

**Description（1–3 句，无 emoji，描述性而非推广式，不要对读者喊话）：**

```
Niuniu is a goal-driven, local-first desktop workstation that orchestrates a fleet of Claude Code agents. Work is written as issues on a kanban board; agents plan, execute in parallel across isolated git worktrees, verify the result, and only escalate to the user when genuinely blocked.
```

**Validate Claims：**

```
Each issue runs in its own git worktree, so multiple agents work in parallel without touching each other's files. You can watch several Claude Code sessions advance different issues on the same board at once, then review and merge each independently.
```

**Specific Task(s)：**

```
Create two unrelated issues on the board (e.g. "add a /health endpoint" and "write README usage section") and let Niuniu run them in parallel, each in its own worktree, then verify and merge both.
```

**Specific Prompt(s)：**

```
Add a GET /health endpoint that returns {"status":"ok"} with a test; and separately, write a Usage section in README.md. Run them as two parallel issues and verify each before merging.
```

### 投递前必须确认（人工核对）

- [ ] **≥1 周公开历史**：表单强制勾选「首次公开提交已超过一周」。`threeq/niuniu-public` 仓库虽创建于
      2026-05-05，但当前可见提交历史显示为 2026-06-21（疑似近期重建/强推历史）。**投递前请确认
      公开提交历史确已满 1 周**，否则等满 1 周再投，避免被判违规。
- [ ] 本人在该仓库**没有其它 open issue**（表单要求）。
- [ ] 由**本人**经网页 UI 提交（勿用 `gh`/脚本）。
- [ ] README 已认真打磨（维护者会看 README 质量；建议 demo GIF/视频，配合 issue #432）。

### 收录后

把徽章加到 `README.md` / `README.en.md`：

```markdown
[![Mentioned in Awesome Claude Code](https://awesome.re/mentioned-badge.svg)](https://github.com/hesreallyhim/awesome-claude-code)
```

---

## B. jamesmurdza/awesome-ai-devtools（人工 fork + PR）

- 仓库：<https://github.com/jamesmurdza/awesome-ai-devtools>
- 贡献规则（PR 模板 4 项 checklist，牛牛全部满足）：
  - [x] 该条目是**使用 AI** 的工具
  - [x] 面向**开发者**的工具
  - [x] 描述清晰无歧义
  - [x] 描述风格与现有条目一致
- 落点分类：`Agent Infrastructure → Multi-Agent Orchestration`
  （现有同类条目：Conductor、Superset、Vibe Kanban、OpenASE、Stoneforge —— 牛牛与之高度同类）。
- 该分类小标题原文：*"Platforms for running multiple AI coding agents in parallel with workspace isolation"* —— 正中牛牛定位。

### 待加入的条目（追加到该分类**末尾**，紧接 Stoneforge 之后）

```markdown
- [Niuniu](https://www.niu6ai.com/en) — Goal-driven, local-first desktop workstation that runs a fleet of Claude Code agents to plan, execute, and verify issues in parallel across projects and repositories, each isolated in its own git worktree.
```

### 人工执行步骤

1. 用浏览器打开 <https://github.com/jamesmurdza/awesome-ai-devtools>，点 `README.md` → 铅笔图标编辑
   （GitHub 会自动为你 fork）。
2. 定位到 `### Multi-Agent Orchestration` 分类，在该分类**最后一条**之后追加上面的条目。
3. 提交说明（commit / PR 标题）建议：`Add Niuniu to Multi-Agent Orchestration`。
4. PR 描述里简述：本地优先、把任务写成 issue、多 Claude Code agent 在隔离 worktree 中并行执行+验证。
5. 创建 PR，勾选模板里的 4 项 checklist。

> 备选英文落点链接也可用 GitHub 仓库 `https://github.com/threeq/niuniu-public`；
> 但该清单同类条目（Conductor/Superset）多用官网，故首选官网 `https://www.niu6ai.com/en`。

---

## 备用文案（其它清单/场景复用）

**一句话英文（slogan）：**
```
Niuniu — run a fleet of Claude Code agents in parallel, one isolated git worktree per issue.
```

**两句话英文：**
```
Niuniu is a goal-driven, local-first desktop workstation that orchestrates multiple Claude Code agents. Write work as issues on a board; agents plan, run in parallel across isolated git worktrees, verify, and only return to you when blocked.
```

---

## 进度与后续

- 本文件已把 4 个 checklist 目标全部研究并备好素材；**实际投递需本人按上面 A/B 步骤完成**。
- 不适用项已如实标注（sourcegraph 已归档、kyrolabs 要求开源、e2b 契合弱）。
- 建议优先级：**A（awesome-claude-code）> B（jamesmurdza）**。A 是 28.5k★ 高信任清单，长期被动曝光价值最大。
- 配合 issue #432（优化 README + demo）一起做，收录通过率更高。
