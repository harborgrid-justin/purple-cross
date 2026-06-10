#!/usr/bin/env bash
# PreToolUse(Bash) hook: token-economy guard from Anthropic's cost guidance
# (https://code.claude.com/docs/en/costs). When Claude runs a full test suite,
# rewrite the command so only failures + the summary reach the context window
# instead of thousands of lines of passing-test output.
#
# Fails OPEN: any parsing/error path exits 0 with no decision, so it can never
# block or alter unrelated commands.

input="$(cat 2>/dev/null || true)"
command -v jq >/dev/null 2>&1 || exit 0

cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null || true)"
[ -z "$cmd" ] && exit 0

# Already filtered or redirected by the caller — leave it alone.
case "$cmd" in
  *"|"*|*">"*) exit 0 ;;
esac

# Only rewrite bare full-suite runs. Single-file runs (npm test -- foo.test.ts)
# are already small and are left untouched.
case "$cmd" in
  "npm test"|"npm run test"|"npx jest"|"npx vitest run"|"npm run test:integration"|"npm run test:e2e")
    filtered="$cmd 2>&1 | grep -E -A 4 -i '(FAIL|✕|✗|error|Tests:|Test Suites:|Test Files|Duration)' | tail -150"
    jq -cn --arg c "$filtered" \
      '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"allow",updatedInput:{command:$c}}}'
    exit 0
    ;;
esac

exit 0
