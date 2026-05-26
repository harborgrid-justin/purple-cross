# `.claude/` — Claude Code configuration

This directory configures how [Claude Code](https://code.claude.com/docs) works
on Purple Cross. For the full enterprise guidance (token economy, model
selection, workflow, governance) see
[`docs/LLM_ENGINEERING_GUIDE.md`](../docs/LLM_ENGINEERING_GUIDE.md).

## Layout

| Path | Purpose | Committed? |
| --- | --- | --- |
| `settings.json` | Team-shared [settings](https://code.claude.com/docs/en/settings): permission allowlist, hooks, env | yes |
| `settings.local.json` | Personal, machine-specific overrides | should be gitignored |
| `agents/*.md` | [Subagents](https://code.claude.com/docs/en/sub-agents) — see `agents/README.md` | yes |
| `skills/<name>/SKILL.md` | [Skills](https://code.claude.com/docs/en/skills): on-demand domain workflows | yes |

The canonical project memory lives at the repo root: [`CLAUDE.md`](../CLAUDE.md)
(loaded every session — kept deliberately short per
[Anthropic's guidance](https://code.claude.com/docs/en/memory)).

## When to use what

- **CLAUDE.md** — rules that apply to *every* session (broad conventions).
- **Skill** — knowledge/workflow that's only *sometimes* relevant (loaded on demand, so it doesn't bloat context).
- **Subagent** — an isolated, focused worker with its own context window and tool allowlist (research, specialized implementation, review).
- **Hook** — something that must happen *deterministically* every time (lint, typecheck, blocked paths).

See [Extend Claude Code](https://code.claude.com/docs/en/features-overview) for
choosing between skills, subagents, hooks, and MCP.
