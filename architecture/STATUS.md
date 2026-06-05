# `architecture/` — Folder Status

> _Last audited: 2026-06-05 · DoDAF 2.02 architecture description for the
> **Purple Cross** veterinary practice management platform._

This folder holds the enterprise architecture description for Purple Cross,
expressed in **DoDAF 2.02** viewpoints. It is documentation / scaffold only —
no shippable code lives here. Treat its contents as the architectural plan and
supporting material that traces back to the running `backend/` (Express +
Prisma) and `frontend/` (Vite + React) stack.

## At a glance

| Metric | Value |
|---|---|
| DoDAF viewpoints covered | 6 (AV, CV, DIV, OV, SV, SvcV) |
| Architecture models | 47 |
| Architecture artifacts (`template.*.md`, non-ITTO) | 47 |
| ITTO companions (`template.*.itto.md`) | 47 |
| Index / status docs | 2 (`README.md`, `STATUS.md`) |
| TypeScript files | 0 |
| Folder README | ✅ [`README.md`](README.md) |

## What's going on here

- **No TypeScript here** — this folder is documentation only. The architecture
  it describes is implemented under [`../backend/`](../backend) and
  [`../frontend/`](../frontend).
- Each model ships as a **filled artifact** (`template.<MODEL>.md`) plus an
  **ITTO** process companion (`template.<MODEL>.itto.md`).
- Views are **grounded in the current codebase** and are honest about the gap
  between shipped and aspirational capabilities. The authoritative real-vs-plan
  assessment is [`../docs/PRODUCTION_GAP_ANALYSIS.md`](../docs/PRODUCTION_GAP_ANALYSIS.md).

> ⚠️ **Keep these in sync.** When a module, Prisma model, middleware, or
> integration changes materially, refresh the affected views (the ITTO
> companion lists which inputs feed each one). Start at [`README.md`](README.md)
> for the full viewpoint index.

## Inventory

| Viewpoint | Models | Status |
|-----------|--------|--------|
| All Viewpoint (AV) | AV-1, AV-2 | Baseline drafted |
| Capability (CV) | CV-1 … CV-7 | Baseline drafted |
| Data & Information (DIV) | DIV-1, DIV-2, DIV-3 | Baseline drafted |
| Operational (OV) | OV-1, OV-2, OV-3, OV-4, OV-5a/5b, OV-6a/6b/6c | Baseline drafted |
| Systems (SV) | SV-1 … SV-10c | Baseline drafted |
| Services (SvcV) | SvcV-1 … SvcV-10c | Baseline drafted |
