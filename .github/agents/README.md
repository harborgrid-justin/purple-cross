# JSDoc Expert Agents

This directory contains 6 specialized expert agents for generating and maintaining JSDoc documentation across the Purple Cross frontend codebase.

## Overview

These agents were created to ensure comprehensive, consistent, and high-quality JSDoc documentation for all 335 frontend TypeScript files. Each agent specializes in a specific category of files and follows enterprise-grade documentation standards.

## Agent Descriptions

### 1. Pages & Components Agent
**File**: `jsdoc-pages-components.md`

**Responsibility**: React components in `pages/` and `components/` directories

**Coverage**: 223 files (66.6% of codebase)

**Expertise**:
- React component documentation patterns
- Props interface documentation
- Component state management
- Event handlers and side effects
- Usage examples with code snippets
- Navigation and routing patterns

**Key Features**:
- Documents component purpose and behavior
- Explains prop types and constraints
- Includes practical usage examples
- Notes related components and dependencies

---

### 2. Hooks Agent
**File**: `jsdoc-hooks.md`

**Responsibility**: React hooks in `hooks/` directory

**Coverage**: 31 files (9.3% of codebase)

**Expertise**:
- TanStack Query (React Query) patterns
- Custom hook documentation
- Query key structure
- Mutation patterns and invalidation
- Caching strategies
- Parameter and return value documentation

**Key Features**:
- Documents query/mutation behavior
- Explains cache invalidation patterns
- Shows real-world usage examples
- Notes enabled/disabled conditions

---

### 3. Services Agent
**File**: `jsdoc-services.md`

**Responsibility**: API services in `services/` directory

**Coverage**: 25 files (7.5% of codebase)

**Expertise**:
- API service architecture
- HTTP methods (GET, POST, PUT, DELETE)
- Error handling and retry logic
- Circuit breakers and resilience
- Request/response transformations
- Validation schemas

**Key Features**:
- Documents API operations thoroughly
- Explains error handling strategies
- Notes retry and circuit breaker config
- Documents CSRF and security patterns

---

### 4. Store Agent
**File**: `jsdoc-store.md`

**Responsibility**: Redux store files in `store/` directory

**Coverage**: 29 files (8.7% of codebase)

**Expertise**:
- Redux Toolkit patterns
- Slice documentation
- Action creators and reducers
- Async thunks
- Selectors
- State shape documentation

**Key Features**:
- Documents state management patterns
- Explains action creators and their effects
- Shows async thunk behavior
- Documents selector usage

---

### 5. Utilities Agent
**File**: `jsdoc-utilities.md`

**Responsibility**: Types, constants, routes, and utility files

**Coverage**: 20 files (6.0% of codebase)

**Expertise**:
- TypeScript type definitions
- Interface documentation
- Constants and enums
- Configuration objects
- Route definitions
- Utility functions

**Key Features**:
- Documents type structures thoroughly
- Explains constant values and significance
- Notes configuration options
- Shows utility function examples

---

### 6. Tests Agent
**File**: `jsdoc-tests.md`

**Responsibility**: Test files in `__tests__/` directory

**Coverage**: 7 files (2.1% of codebase)

**Expertise**:
- Test suite documentation
- Test case organization
- Mock data documentation
- Assertion patterns
- Component testing
- Integration testing

**Key Features**:
- Documents what is being tested
- Explains test coverage areas
- Notes mock/fixture data
- Documents test setup/teardown

---

## Usage Guidelines

### When to Use Which Agent

1. **Creating a new React component?** → Use Pages & Components Agent
2. **Creating a new custom hook?** → Use Hooks Agent
3. **Creating a new API service?** → Use Services Agent
4. **Creating a new Redux slice?** → Use Store Agent
5. **Defining new types or constants?** → Use Utilities Agent
6. **Writing new tests?** → Use Tests Agent

### Documentation Standards

All agents follow this file-level header pattern:

```typescript
/**
 * WF-COMP-XXX | [filename] - [Brief description]
 * Purpose: [Detailed purpose]
 * Dependencies: [List of dependencies]
 * Last Updated: YYYY-MM-DD | File Type: .ts/.tsx
 */
```

### Quality Standards

Each agent ensures:
- ✅ Clear, concise descriptions
- ✅ Comprehensive parameter documentation
- ✅ Return value documentation
- ✅ Usage examples where appropriate
- ✅ Error condition documentation
- ✅ Dependency tracking
- ✅ Type safety awareness

## Statistics

As of 2025-10-23:

| Metric | Value |
|--------|-------|
| Total Frontend Files | 335 |
| Files with JSDoc | 335 (100%) |
| Newly Documented | 201 files |
| Already Documented | 134 files |

### Coverage by Agent

| Agent | Files Handled | Percentage |
|-------|--------------|------------|
| Pages & Components | 223 | 66.6% |
| Hooks | 31 | 9.3% |
| Services | 25 | 7.5% |
| Store | 29 | 8.7% |
| Utilities | 20 | 6.0% |
| Tests | 7 | 2.1% |

## Maintenance

### Adding New Files

When adding new files to the codebase:

1. Identify which agent category the file belongs to
2. Refer to that agent's documentation patterns
3. Add the file-level JSDoc header following the pattern
4. Document functions, types, and exports appropriately
5. Include usage examples for public APIs

### Updating Documentation

When updating existing files:

1. Update the "Last Updated" date in the file header
2. Ensure JSDoc reflects any API changes
3. Update examples if behavior has changed
4. Maintain consistency with agent patterns

### Generating Documentation

The initial documentation was generated using an automated Python script that:
- Analyzes file content
- Infers purpose from imports and code structure
- Identifies dependencies
- Generates appropriate JSDoc headers
- Preserves existing documentation

## Benefits

### For Developers
- Quick understanding of file purpose
- Clear dependency tracking
- Consistent documentation patterns
- Better IDE support (IntelliSense, hover tooltips)

### For Codebase
- 100% documentation coverage
- Standardized format
- Easier maintenance
- Better code reviews
- Simplified onboarding

### For Tooling
- Enhanced auto-completion
- Better type inference
- Improved navigation
- Documentation generation ready

## Related Documentation

- **JSDOC_GENERATION_SUMMARY.md** - Complete statistics and implementation details
- **CLAUDE.md** - Project guidelines and standards
- **docs/TYPESCRIPT_GUIDELINES.md** - TypeScript standards and patterns

## Future Enhancements

Potential improvements to consider:

1. **Function-level JSDoc**: Detailed docs for all public functions
2. **Automated validation**: Script to verify JSDoc completeness
3. **Documentation site**: Generate browsable docs from JSDoc
4. **Pre-commit hooks**: Ensure new files have JSDoc
5. **VSCode snippets**: Quick JSDoc templates
6. **ESLint rules**: Enforce JSDoc requirements

---

**Last Updated**: 2025-10-23  
**Maintained By**: Development Team  
**Related Issues**: PR #[number]
