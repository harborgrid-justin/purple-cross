# `.claude/` — Claude Code configuration

This directory configures how [Claude Code](https://code.claude.com/docs) works
on Purple Cross. For the full enterprise guidance (token economy, model
selection, workflow, governance, upstream-issue safeguards) see
[`docs/LLM_ENGINEERING_GUIDE.md`](../docs/LLM_ENGINEERING_GUIDE.md).

## Layout

| Path | Purpose | Committed? |
| --- | --- | --- |
| `settings.json` | Team-shared [settings](https://code.claude.com/docs/en/settings): permission allow/deny lists, hooks | yes |
| `settings.local.json` | Personal, machine-specific overrides | no (gitignored) |
| `agents/*.md` | [Subagents](https://code.claude.com/docs/en/sub-agents) — roster + authoring rules in `agents/README.md` | yes |
| `skills/<name>/SKILL.md` | [Skills](https://code.claude.com/docs/en/skills): on-demand domain workflows | yes |
| `hooks/*.sh` | Deterministic [hook](https://code.claude.com/docs/en/hooks) scripts wired in `settings.json` | yes |

The canonical project memory lives at the repo root: [`CLAUDE.md`](../CLAUDE.md)
(loaded every session — kept under ~200 lines per
[Anthropic's guidance](https://code.claude.com/docs/en/memory); details live in
linked docs and skills, which load on demand).

## Configured safeguards

- **`hooks/protect-migrations.sh`** (PreToolUse Edit|Write) — blocks edits to
  applied Prisma migrations (immutable; edit-in-place causes drift).
- **`hooks/filter-test-output.sh`** (PreToolUse Bash) — rewrites bare full-suite
  test runs to surface only failures + summary, keeping thousands of lines of
  passing output out of the context window.
- **Permission deny rules** — force-push, hard reset, `git clean`, `rm -rf`,
  `prisma migrate reset` / force-reset, and reads of `.env*` secret files and
  private keys are denied at the harness level (not just by convention).

## When to use what

- **CLAUDE.md** — rules that apply to *every* session (broad conventions).
- **Skill** — knowledge/workflow that's only *sometimes* relevant (loaded on demand, so it doesn't bloat context).
- **Subagent** — an isolated, focused worker with its own context window and tool allowlist (research, specialized implementation, review).
- **Hook** — something that must happen *deterministically* every time (guards, output filtering).

See [Extend Claude Code](https://code.claude.com/docs/en/features-overview) for
choosing between skills, subagents, hooks, and MCP.
