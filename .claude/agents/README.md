# Subagent roster

[Subagents](https://code.claude.com/docs/en/sub-agents) are specialized Claude
assistants, each with its own context window, system prompt, tool allowlist, and
model. They **preserve the main context window** (a side task runs in isolation
and returns only its summary) and let us route work to focused experts and to
cheaper models.

Delegate explicitly, e.g. *"Use the `database-architect` subagent to design the
migration"* — or let Claude pick based on each agent's `description`.

## Available agents

| Agent | Use it for |
| --- | --- |
| `typescript-architect` | Advanced TypeScript implementation, type-system design, rigorous review |
| `typescript-orchestrator` | Multi-domain features that need coordination across parallel workstreams |
| `database-architect` | Prisma schema, migrations, indexing/query optimization, multi-tenancy |
| `api-architect` | REST/GraphQL endpoint design, auth patterns, API review |
| `swagger-api-documentation-architect` | OpenAPI/Swagger specs, `@openapi` route annotations |
| `react-component-architect` | React components, hooks, component architecture |
| `state-management-architect` | TanStack Query / Zustand data flow, re-render performance |
| `ui-ux-architect` | UX flows, information architecture, interaction patterns |
| `css-styling-architect` | Styling architecture, design tokens, Tailwind/CSS systems |
| `accessibility-architect` | WCAG 2.1+ compliance, ARIA, assistive technology |
| `frontend-performance-architect` | Bundle size, Core Web Vitals, lazy-loading |
| `frontend-testing-architect` | Jest/Vitest/RTL/Playwright/Cypress strategy and tests |
| `jsdoc-typescript-architect` | TypeScript with comprehensive JSDoc documentation |
| `server-management-architect` | Deployment infra, scaling, server troubleshooting |

## Authoring / editing an agent

Each agent is a Markdown file with YAML frontmatter + a system-prompt body:

```markdown
---
name: security-reviewer
description: Reviews code for security vulnerabilities. Use proactively after auth/data changes.
tools: Read, Grep, Glob, Bash       # least-privilege: only what the task needs
model: opus                          # opus | sonnet | haiku | inherit
---
You are a senior security engineer. Review for injection (SQL/XSS/command),
authn/authz flaws, secrets in code, and insecure data handling. Cite file:line
and suggest fixes.
```

Guidelines:
- **Focused responsibility** — one clear job per agent.
- **Least-privilege tools** — list only the tools the task needs (omit `tools` to inherit all).
- **Model routing for cost** — `haiku` for read/search-heavy or high-volume agents, `opus` for hard reasoning, `sonnet`/`inherit` otherwise.
- **A precise `description`** — Claude uses it to decide when to delegate; include "use proactively" for agents that should trigger automatically.

> Note: `../../.github/agents/` holds the separate automated **code-review** agent
> set used in CI; this directory is for interactive development subagents.
