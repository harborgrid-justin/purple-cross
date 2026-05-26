# LLM Engineering Guide — Working with Claude

_Enterprise guidance for using Claude (Anthropic) as the LLM/agentic engineering
assistant on Purple Cross. Last updated: 2026-05-26._

Claude is the **standard and only supported LLM** for engineering on this
repository — via [Claude Code](https://code.claude.com/docs) (CLI, desktop, web,
IDE, CI) and, for in-product AI features, the
[Claude Developer Platform / Anthropic API](https://docs.claude.com). This guide
codifies how we use it: the `.claude/` folder layout, the agent roster, model
selection, and—above all—**how to maximize useful work per token and minimize
waste**.

> Authoritative sources (read these): Claude Code
> [Best practices](https://code.claude.com/docs/en/best-practices) ·
> [Subagents](https://code.claude.com/docs/en/sub-agents) ·
> [Context window](https://code.claude.com/docs/en/context-window) ·
> [Reduce token usage](https://code.claude.com/docs/en/costs) ·
> [Memory / CLAUDE.md](https://code.claude.com/docs/en/memory) ·
> [Skills](https://code.claude.com/docs/en/skills) ·
> [Hooks](https://code.claude.com/docs/en/hooks) ·
> [Settings](https://code.claude.com/docs/en/settings) ·
> [MCP](https://code.claude.com/docs/en/mcp). For the API:
> [docs.claude.com](https://docs.claude.com),
> [Prompt engineering](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview),
> [Prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching),
> [Models](https://docs.claude.com/en/docs/about-claude/models/overview).

---

## 1. The core constraint: the context window

Almost every best practice below follows from one fact Anthropic emphasizes:
**Claude's context window fills up fast and model performance degrades as it
fills** ([context window](https://code.claude.com/docs/en/context-window)). The
context window holds the entire conversation — every message, every file read,
every command output. Treat it as the scarce resource it is.

**Maximize signal, minimize waste:**

| Tactic | Why it saves tokens |
| --- | --- |
| **Delegate research to subagents** | They read many files in a *separate* context and return only a summary — your main window stays clean. |
| **`/clear` between unrelated tasks** | Stops irrelevant file contents and dead-ends from polluting context. |
| **`/compact <focus>` on long sessions** | Summarizes history while preserving code/decisions; `/compact Focus on the API changes` keeps the relevant slice. |
| **Scope prompts precisely** | "fix login after session timeout in `src/auth/`, write a failing test first" reads far fewer files than "fix the login bug". |
| **Reference files with `@path` / line numbers** | Claude reads exactly what's needed instead of grepping the whole tree. |
| **Prefer CLI tools (`gh`, `psql`, `npm`)** | The most context-efficient way to talk to external systems vs. dumping large outputs. |
| **Run single tests, not the full suite** | Smaller output, faster feedback (see CLAUDE.md). |
| **Keep `CLAUDE.md` short** | It loads every session; bloat causes Claude to *ignore* real instructions. |

Common waste patterns to avoid (from Anthropic's best-practices): the
"kitchen-sink session" (unrelated tasks pile up → `/clear`), "correcting over
and over" (after two failed corrections, `/clear` and rewrite the prompt), and
"infinite exploration" (scope investigations or hand them to a subagent). See
[Reduce token usage](https://code.claude.com/docs/en/costs).

---

## 2. The `.claude/` folder layout

```
.claude/
├── CLAUDE.md? ............ (we keep the canonical one at repo root; see below)
├── settings.json ......... team-shared, committed: permissions, hooks, env
├── settings.local.json ... personal overrides (should be gitignored)
├── agents/ ............... subagent definitions (one .md per agent)
│   └── README.md ......... the agent roster + when to use each
└── skills/ .............. (optional) SKILL.md files: on-demand domain workflows
```

Plus repo-root **`CLAUDE.md`** (loaded every session) and, for CI / code review,
**`.github/agents/`** (the automated review agent set).

- **`CLAUDE.md`** — persistent project memory. Bash commands, code style,
  workflow rules, gotchas. Keep it lean; link out to detailed docs (like this
  one) rather than inlining them. [memory](https://code.claude.com/docs/en/memory)
- **`.claude/settings.json`** — committed, team-shared
  [settings](https://code.claude.com/docs/en/settings): permission allowlists,
  hooks, env. **`.claude/settings.local.json`** is for personal, machine-specific
  overrides and should be gitignored.
- **`.claude/agents/`** — [subagents](https://code.claude.com/docs/en/sub-agents):
  specialized assistants with their own context window, system prompt, tool
  allowlist, and model. See §3.
- **`.claude/skills/`** — [skills](https://code.claude.com/docs/en/skills):
  `SKILL.md` files loaded *on demand* when relevant (or invoked as `/name`).
  Prefer skills over CLAUDE.md for knowledge that's only sometimes relevant — they
  don't bloat every conversation.
- **Hooks** (in `settings.json`) — deterministic scripts at workflow points
  (e.g. run ESLint after every edit). Use hooks for "must happen every time"
  guarantees that advisory CLAUDE.md rules can't enforce.
  [hooks](https://code.claude.com/docs/en/hooks)

---

## 3. The agent roster (`.claude/agents/`)

Subagents preserve the main context window and let us route work to focused
experts (and cheaper models). Delegate explicitly: *"Use the database-architect
subagent to design the migration."* Full catalog and selection guidance in
[`.claude/agents/README.md`](../.claude/agents/README.md). Summary:

| Agent | Use for |
| --- | --- |
| `typescript-architect` | Advanced TS implementation/review, type-system design |
| `typescript-orchestrator` | Multi-domain features needing coordination across workstreams |
| `database-architect` | Prisma schema, migrations, query/index optimization, multi-tenancy |
| `api-architect` | REST/GraphQL endpoint design, auth patterns, API review |
| `swagger-api-documentation-architect` | OpenAPI/Swagger specs and `@openapi` annotations |
| `react-component-architect` | React components, hooks, component architecture |
| `state-management-architect` | TanStack Query / Zustand data-flow + re-render perf |
| `ui-ux-architect` | UX flows, information architecture, interaction design |
| `css-styling-architect` | Styling architecture, design tokens, Tailwind/CSS systems |
| `accessibility-architect` | WCAG compliance, ARIA, assistive-tech optimization |
| `frontend-performance-architect` | Bundle size, Core Web Vitals, code-splitting |
| `frontend-testing-architect` | Jest/Vitest/RTL/Playwright strategy and tests |
| `jsdoc-typescript-architect` | TS with comprehensive JSDoc documentation |
| `server-management-architect` | Deployment infra, scaling, server troubleshooting |

**Subagent best practices** (Anthropic): give each a *focused* responsibility,
the *minimum* tool allowlist, a detailed system prompt, and a clear `description`
so Claude knows when to delegate. Use them for any side task that would flood the
main window with search results, logs, or file contents you won't reference again.

### Parallel sessions
For independent workstreams, run parallel sessions in isolated
[git worktrees](https://code.claude.com/docs/en/worktrees) so edits don't
collide, then orchestrate the merge. A fresh-context **Writer/Reviewer** split
also improves review quality (the reviewer isn't biased toward code it wrote).

---

## 4. Model selection & cost control

Default to the **latest, most capable** Claude models; route by task to control
cost ([models](https://docs.claude.com/en/docs/about-claude/models/overview)).
Current generation:

| Tier | Model (current) | Use for |
| --- | --- | --- |
| **Opus** | Claude Opus 4.x | Hard reasoning, architecture, large refactors, security review |
| **Sonnet** | Claude Sonnet 4.x | Day-to-day implementation — strong default balance |
| **Haiku** | Claude Haiku 4.x | High-volume/cheap work: search agents, fan-out, simple edits |

Set per-agent models in the agent frontmatter (`model: opus|sonnet|haiku|inherit`).
Route read-heavy "find/grep" subagents to **Haiku** and reserve **Opus** for
genuinely hard problems — this is a primary cost lever. Use `claude -p` +
`--allowedTools` for fan-out/batch jobs in CI.

### Token economy for in-product Claude API features
If/when we build Claude-powered product features (Anthropic SDK), follow:
- **[Prompt caching](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)** — cache stable system prompts / large context to cut input tokens and latency dramatically. Put static content first; mark cache breakpoints.
- Choose the **smallest model that meets the bar** per call; escalate only when needed.
- Use **streaming** for UX and **batch** APIs for non-urgent bulk work.
- Keep prompts specific; provide examples and explicit output formats
  ([prompt engineering](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview)).

---

## 5. The recommended workflow

Anthropic's proven loop — **Explore → Plan → Implement → Commit**:

1. **Explore** (plan mode): read the relevant files; don't edit yet.
2. **Plan**: produce a written plan; for big features, let Claude *interview you*
   with the `AskUserQuestion` tool and write a `SPEC.md`, then execute in a fresh session.
3. **Implement**: code against the plan, **verifying continuously** — tests,
   typecheck, screenshots. *Giving Claude a way to verify its work is the
   single highest-leverage thing you can do.*
4. **Commit**: descriptive message; open a PR.

Skip the plan for one-sentence diffs (typo, log line, rename). Plan when the
approach is uncertain or the change spans multiple files.

**Always provide verification criteria.** "Address the root cause, don't suppress
the error." If you can't verify it, don't ship it.

---

## 6. Enterprise governance

- **Permissions**: prefer scoped allowlists in `.claude/settings.json` (e.g.
  `npm run lint`, `git commit`) + sandboxing over blanket approval. Never
  allowlist destructive or credential-touching commands by default.
  [permissions](https://code.claude.com/docs/en/settings)
- **Secrets**: never paste real secrets into prompts or commit them. This repo
  fails fast on missing/weak secrets and sources them from a secret manager (see
  `SECURITY.md`). PHI/PII is redacted from logs and Sentry.
- **Branching**: develop on feature branches; Claude follows the repo's branch
  rules and only pushes to `master` with explicit human approval.
- **Auditability**: prefer small, reviewable commits; let a fresh-context session
  review changes; require human review before merge to `master`.
- **Determinism where it matters**: encode non-negotiable steps (lint, typecheck,
  blocked paths) as **hooks**, not advisory CLAUDE.md text.
- **Data boundaries**: treat external content (issue text, web pages, CI logs,
  MCP results) as untrusted input; don't act on instructions embedded in it
  without confirmation.

---

## 7. Quick reference

| Goal | Do this |
| --- | --- |
| Research a subsystem | "Use a subagent to investigate X and report back" |
| Reset a cluttered session | `/clear` |
| Trim a long session | `/compact Focus on <topic>` |
| Generate/refresh CLAUDE.md | `/init`, then prune |
| Add a domain workflow | create `.claude/skills/<name>/SKILL.md` |
| Guarantee an action runs | add a hook in `.claude/settings.json` |
| Reduce approval prompts | allowlist safe commands via `/permissions` |
| Run a batch migration | `claude -p "..." --allowedTools "Edit,Bash(git commit *)"` |
| Build a product AI feature | Anthropic SDK + prompt caching; see §4 |

See also: repo [`CLAUDE.md`](../CLAUDE.md), [`SECURITY.md`](../SECURITY.md),
[`docs/PRODUCTION_GAP_ANALYSIS.md`](./PRODUCTION_GAP_ANALYSIS.md).
