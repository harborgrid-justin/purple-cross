# JSDoc Validation Guide

## Overview

This guide explains how to add JSDoc validation to the project's CI/CD pipeline and development workflow. This is an optional enhancement mentioned in PR #62's future enhancements list.

## Current State

**What We Have:**
- ✅ ESLint configured with TypeScript support
- ✅ CI pipeline runs `npm run lint` on all PRs
- ✅ Prettier formatting enforced
- ✅ TypeScript type checking

**What's Missing:**
- ❌ No JSDoc completeness requirements
- ❌ No JSDoc format validation
- ❌ No enforcement of documentation standards

## Why Add JSDoc Validation?

### Benefits

1. **Consistency**: Ensures all functions have documentation
2. **Quality**: Enforces documentation standards
3. **Maintenance**: Prevents undocumented code from being merged
4. **Onboarding**: New developers see documentation requirements immediately
5. **IDE Support**: Better IntelliSense and tooltips

### Drawbacks

1. **Development friction**: Requires more work per function
2. **False positives**: May flag intentional omissions
3. **Maintenance overhead**: Rules need updating as patterns evolve

## Implementation Options

### Option 1: ESLint JSDoc Plugin (Recommended)

**Plugin**: `eslint-plugin-jsdoc`

**Pros**:
- Comprehensive JSDoc validation
- Configurable rules
- Good documentation
- Active maintenance

**Cons**:
- Adds dependency
- Can be strict

**Installation**:

```bash
cd frontend
npm install --save-dev eslint-plugin-jsdoc
```

**Configuration** (add to `frontend/.eslintrc.cjs`):

```javascript
module.exports = {
  // ... existing config
  plugins: ['react-refresh', '@typescript-eslint', 'prettier', 'jsdoc'],
  rules: {
    // ... existing rules
    
    // JSDoc Requirements
    'jsdoc/require-jsdoc': [
      'warn', // Use 'error' to enforce strictly
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false, // Don't require for arrow functions
          FunctionExpression: false,
        },
        contexts: [
          'TSInterfaceDeclaration', // Require JSDoc on interfaces
          'TSTypeAliasDeclaration', // Require JSDoc on type aliases
          'ExportNamedDeclaration > FunctionDeclaration', // Exported functions
          'ExportNamedDeclaration > VariableDeclaration', // Exported consts
        ],
      },
    ],
    
    // Require @param tags
    'jsdoc/require-param': ['warn', {
      checkDestructured: false, // Don't require destructured params to be documented separately
    }],
    
    // Require @param descriptions
    'jsdoc/require-param-description': 'warn',
    
    // Require @returns
    'jsdoc/require-returns': ['warn', {
      checkGetters: false,
    }],
    
    // Require @returns descriptions
    'jsdoc/require-returns-description': 'warn',
    
    // Check param names match
    'jsdoc/check-param-names': 'error',
    
    // Check tag names are valid
    'jsdoc/check-tag-names': 'error',
    
    // Check types are valid
    'jsdoc/check-types': 'warn',
    
    // Require hyphen before param description
    'jsdoc/require-hyphen-before-param-description': ['warn', 'always'],
    
    // Multiline comment style
    'jsdoc/multiline-blocks': ['warn', {
      noSingleLineBlocks: true,
    }],
    
    // Empty tags not allowed
    'jsdoc/empty-tags': 'warn',
    
    // Require example tags for exported functions (optional)
    // 'jsdoc/require-example': ['warn', {
    //   contexts: ['ExportNamedDeclaration'],
    // }],
  },
};
```

### Option 2: TypeDoc (Documentation Generation)

**Tool**: `typedoc`

**Pros**:
- Generates documentation website
- Validates JSDoc format
- Shows coverage gaps
- Great for public APIs

**Cons**:
- More setup required
- Separate tool from ESLint
- Documentation site needs hosting

**Installation**:

```bash
cd frontend
npm install --save-dev typedoc
```

**Configuration** (`frontend/typedoc.json`):

```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "plugin": ["typedoc-plugin-missing-exports"],
  "exclude": [
    "**/node_modules/**",
    "**/*.test.ts",
    "**/*.test.tsx"
  ],
  "excludePrivate": true,
  "excludeProtected": true,
  "validation": {
    "notExported": true,
    "invalidLink": true,
    "notDocumented": true
  }
}
```

**Add npm script** (`frontend/package.json`):

```json
{
  "scripts": {
    "docs": "typedoc",
    "docs:validate": "typedoc --validation.notDocumented true"
  }
}
```

### Option 3: Custom Validation Script

Create a simple script to check JSDoc presence:

**File**: `scripts/validate-jsdoc.js`

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Find all TypeScript files
const files = glob.sync('frontend/src/**/*.{ts,tsx}', {
  ignore: ['**/*.test.ts', '**/*.test.tsx', '**/node_modules/**']
});

let errors = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find exported functions/classes
  const exportMatches = content.match(/export (const|function|class) (\w+)/g);
  
  if (!exportMatches) return;
  
  exportMatches.forEach(match => {
    const name = match.split(' ')[2];
    const index = content.indexOf(match);
    const before = content.substring(Math.max(0, index - 500), index);
    
    // Check if there's JSDoc before the export
    if (!before.includes('/**')) {
      console.error(`Missing JSDoc for ${name} in ${file}`);
      errors++;
    }
  });
});

if (errors > 0) {
  console.error(`\n❌ Found ${errors} exports without JSDoc`);
  process.exit(1);
} else {
  console.log('✅ All exports have JSDoc');
}
```

**Add to package.json**:

```json
{
  "scripts": {
    "validate:jsdoc": "node scripts/validate-jsdoc.js"
  }
}
```

## Phased Rollout Strategy

### Phase 1: Warning Mode (Recommended Start)

1. Add ESLint JSDoc plugin
2. Configure all rules as `'warn'` instead of `'error'`
3. Don't fail CI on warnings
4. Give developers time to add documentation

**CI Configuration** (`.github/workflows/ci.yml`):

```yaml
- name: Lint (with warnings)
  working-directory: ./frontend
  run: npm run lint -- --max-warnings 1000  # Allow warnings temporarily
```

### Phase 2: Error Mode for New Code

1. Change rules to `'error'` for specific contexts
2. Focus on new files/functions (use git diff)
3. Fail CI only for new code

**Pre-commit hook** (`.husky/pre-commit`):

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Get changed TypeScript files
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$')

if [ ! -z "$CHANGED_FILES" ]; then
  # Run ESLint only on changed files
  cd frontend && npx eslint $CHANGED_FILES
fi
```

### Phase 3: Full Enforcement

1. Change all JSDoc rules to `'error'`
2. Fix all existing violations
3. Enforce in CI with no warnings allowed

**CI Configuration**:

```yaml
- name: Lint (strict)
  working-directory: ./frontend
  run: npm run lint -- --max-warnings 0
```

## Recommended Configuration

For the Purple Cross project, we recommend:

### Minimal (Start Here)

```javascript
{
  plugins: ['jsdoc'],
  rules: {
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/require-param': 'warn',
    'jsdoc/require-returns': 'warn',
  }
}
```

### Moderate (After Phase 1 Complete)

```javascript
{
  plugins: ['jsdoc'],
  rules: {
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-returns': 'error',
    'jsdoc/require-returns-description': 'warn',
    'jsdoc/require-jsdoc': ['warn', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
      }
    }],
  }
}
```

### Strict (After All Documentation Complete)

```javascript
{
  plugins: ['jsdoc'],
  rules: {
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/check-types': 'error',
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'error',
    'jsdoc/require-returns': 'error',
    'jsdoc/require-returns-description': 'error',
    'jsdoc/require-jsdoc': ['error', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
      },
      contexts: [
        'ExportNamedDeclaration > FunctionDeclaration',
        'ExportNamedDeclaration > VariableDeclaration',
      ]
    }],
    'jsdoc/require-example': ['warn', {
      contexts: ['ExportNamedDeclaration'],
      exemptedBy: ['internal', 'private'],
    }],
  }
}
```

## IDE Integration

### VS Code

**Extension**: `vscode-eslint`

With ESLint plugin configured, JSDoc issues will show inline:

1. Install "ESLint" extension
2. Add to `.vscode/settings.json`:

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### JetBrains IDEs (WebStorm, IntelliJ)

Built-in JSDoc support with ESLint integration:

1. Enable ESLint in Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Set "Run eslint --fix on save"

## Testing the Configuration

### Test Command

```bash
# Test on a single file
cd frontend
npx eslint src/hooks/usePatients.ts

# Test on all hooks
npx eslint src/hooks/*.ts

# Test and auto-fix
npx eslint src/hooks/*.ts --fix
```

### CI Test

Create a test PR with:
1. A new function without JSDoc
2. Verify CI catches it
3. Add JSDoc
4. Verify CI passes

## Exceptions and Overrides

For files where JSDoc validation should be disabled:

```typescript
/* eslint-disable jsdoc/require-jsdoc */

// ... code without JSDoc requirements

/* eslint-enable jsdoc/require-jsdoc */
```

For specific functions:

```typescript
// eslint-disable-next-line jsdoc/require-jsdoc
export const helperFunction = () => {
  // Internal helper, no JSDoc needed
};
```

## Migration Path

### Step 1: Add Plugin (Week 1)

```bash
cd frontend
npm install --save-dev eslint-plugin-jsdoc
```

Update `.eslintrc.cjs` with minimal rules in warning mode.

### Step 2: Document High-Priority Files (Weeks 2-4)

Focus on:
- All hooks (31 files)
- All components (9 files)
- Main API client

### Step 3: Enforce for New Code (Week 5)

Add pre-commit hook to check new/modified files.

### Step 4: Document Remaining Files (Weeks 6-10)

Service modules and pages.

### Step 5: Full Enforcement (Week 11+)

Switch all rules to `'error'` and enforce in CI.

## Monitoring

Track documentation coverage:

```bash
# Count functions with JSDoc
grep -r "@param\|@returns" frontend/src/**/*.ts | wc -l

# Count exported functions
grep -r "export const\|export function" frontend/src/**/*.ts | wc -l
```

Create a coverage badge or dashboard showing JSDoc completion percentage.

## Related Documentation

- **Agent Specifications**: `.github/agents/jsdoc-*-functions.md`
- **Completion Guide**: `JSDOC_PHASE2_COMPLETION_GUIDE.md`
- **PR #62 Summary**: `JSDOC_GENERATION_SUMMARY.md`

## Resources

- [eslint-plugin-jsdoc Documentation](https://github.com/gajus/eslint-plugin-jsdoc)
- [TypeDoc Documentation](https://typedoc.org/)
- [JSDoc Reference](https://jsdoc.app/)
- [TSDoc Standard](https://tsdoc.org/)

---

**Last Updated**: 2025-10-23  
**Status**: Implementation Guide Ready  
**Priority**: Optional Enhancement (Post Function-Level Documentation)
