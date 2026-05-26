#!/usr/bin/env bash
# PreToolUse(Edit) guard: applied Prisma migrations are immutable. Editing an
# existing migration causes schema/DB drift (create a NEW migration instead).
# This blocks Edit on existing files under prisma/migrations/. Creating a new
# migration (Write to a new path) is unaffected.
#
# Fails OPEN: any parsing/error path exits 0 with no decision, so it can never
# block unrelated edits.

input="$(cat 2>/dev/null || true)"

fp=""
if command -v jq >/dev/null 2>&1; then
  fp="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"
fi
if [ -z "$fp" ]; then
  fp="$(printf '%s' "$input" \
    | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' \
    | head -1 | sed -E 's/.*"file_path"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/' 2>/dev/null || true)"
fi

case "$fp" in
  */prisma/migrations/*)
    if [ -n "$fp" ] && [ -e "$fp" ]; then
      printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Applied Prisma migrations are immutable. Create a NEW migration (prisma migrate diff / dev) instead of editing %s."}}\n' "$fp"
      exit 0
    fi
    ;;
esac

exit 0
