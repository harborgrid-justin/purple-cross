module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'dist',
    'node_modules',
    'coverage',
    'prisma',
    'tests',
    'examples',
    '**/*.d.ts',
    '**/*.js',
    '**/*.js.map',
  ],
  rules: {
    // Type Safety - Requirements 2, 3, 4 (relaxed to warnings for gradual migration)
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',

    // Strictness - Requirement 1
    '@typescript-eslint/strict-boolean-expressions': 'off', // Can be too strict for Express
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          arguments: false, // Allow async functions in Express route handlers
          attributes: false,
        },
      },
    ],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/unbound-method': 'off', // Disabled for Express controller methods
    '@typescript-eslint/require-await': 'warn', // Allow async without await for consistency

    // Code Quality - Requirements 6, 12
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/prefer-readonly': 'warn',
    'prefer-const': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // Naming Conventions - Requirement 6
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      {
        selector: 'enum',
        format: ['PascalCase'],
      },
      {
        selector: 'variable',
        modifiers: ['const', 'global'],
        format: ['UPPER_CASE', 'camelCase'],
      },
    ],

    // General
    '@typescript-eslint/interface-name-prefix': 'off',
    'prettier/prettier': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
