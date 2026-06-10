# Subagent roster

[Subagents](https://code.claude.com/docs/en/sub-agents) are specialized Claude
assistants, each with its own context window, system prompt, tool allowlist, and
model. They **preserve the main context window** (a side task runs in isolation
and returns only its summary) and let us route work to focused experts and to
cheaper models.

Delegate explicitly, e.g. *"Use the `database-architect` subagent to design the
migration"* — or let Claude pick based on each agent's `description`.

## Available agents

| Agent | Model | Use it for |
| --- | --- | --- |
| `typescript-architect` | opus | Hard type-system problems, advanced TS implementation, rigorous review |
| `typescript-orchestrator` | opus | Multi-domain features needing decomposition + delegation across workstreams |
| `database-architect` | sonnet | Prisma schema, migrations, indexing/query optimization, tenancy wiring |
| `api-architect` | sonnet | REST endpoint design, auth patterns, API review |
| `swagger-api-documentation-architect` | haiku | `@openapi` route annotations, spec fixes |
| `react-component-architect` | sonnet | React components/pages, hooks, component architecture |
| `state-management-architect` | sonnet | TanStack Query / Zustand data flow, cache + re-render performance |
| `ui-ux-architect` | sonnet | UX flows, information architecture, interaction patterns |
| `css-styling-architect` | sonnet | Plain-CSS conventions, design tokens, styling refactors |
| `accessibility-architect` | sonnet | WCAG 2.1 AA, ARIA, keyboard/screen-reader fixes |
| `frontend-performance-architect` | sonnet | Bundle size, code-splitting, Core Web Vitals |
| `frontend-testing-architect` | sonnet | Vitest/RTL + Jest/integration test strategy and tests |
| `jsdoc-typescript-architect` | haiku | JSDoc documentation passes |
| `server-management-architect` | sonnet | Docker/CI/CD, observability wiring, prod troubleshooting |
| `code-reviewer` | sonnet | **Read-only** diff review for correctness/edge-cases/consistency |
| `security-reviewer` | opus | **Read-only** security review (injection, authz, tenancy, PHI/PII) — proactive after auth/data changes |

The two reviewers are **read-only** (`tools: Read, Grep, Glob, Bash`) — the
least-privilege pattern. The architects omit `tools` (inherit all) because they
implement as well as design.

## Authoring rules (token economy)

Every agent's `description` is loaded into **every** session's context so the
main agent can route work; the body is loaded for every invocation. Budget both:

- **`description`: 1–2 sentences, ≤ ~50 words.** Say *what it does* and *when
  to use it* (add "Use proactively…" for auto-trigger agents). **Never include
  `<example>` blocks or dialogue transcripts** — they cost hundreds of tokens
  per agent in every session and add no routing signal a good sentence doesn't.
- **Body: ≤ ~60 lines**, repo-grounded. Reference this repo's actual files,
  commands, and patterns instead of generic competency lists. Generic expertise
  is already in the model; only project specifics earn their tokens.
- **No file-based coordination protocols** (`.temp/` trackers, status JSON,
  cross-agent file references). Claude Code's built-in task tracking does this;
  file protocols burn tokens and leave litter in the repo.
- **Model routing is a primary cost lever**: `haiku` for formulaic/high-volume
  work, `opus` only for genuinely hard reasoning, `sonnet` otherwise.
- **Least-privilege `tools`** for agents that shouldn't write (reviewers).
- Every agent ends with an **Output contract**: the caller sees only the final
  message, so it must carry decisions, file:line references, and verification
  results — concisely.

Template:

```markdown
---
name: my-agent
description: One sentence on what it does; one on when to use it.
tools: Read, Grep, Glob, Bash   # only if restricting; omit to inherit all
model: sonnet                    # opus | sonnet | haiku | inherit
---
You are <role> for Purple Cross (<relevant stack slice>).

## Scope / rules (repo-grounded)
...

## Working method & output
- Read only what the task needs; targeted verification (typecheck, single test).
- Final message: decisions, files touched (file:line), verification results.
```

> Note: `../../.github/agents/` holds separate agent sets (JSDoc-documentation
> agents and a `code-review/` set) used by CI; this `.claude/agents/` directory
> is for interactive development subagents.
>
> On-demand workflows live in [`../skills/`](../skills/) — e.g.
> `add-backend-endpoint` and `add-frontend-crud` encode this repo's layered
> backend and CRUD-page patterns.
