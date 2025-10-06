#!/usr/bin/env node

/**
 * Automated Constants Refactoring Script
 *
 * This script helps refactor service and controller files to use centralized constants
 *
 * Usage: node scripts/refactor-constants.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Replacement patterns
const replacements = [
  // HTTP Status Codes
  { pattern: /\bres\.status\(201\)/g, replacement: 'res.status(HTTP_STATUS.CREATED)' },
  { pattern: /\bres\.status\(200\)/g, replacement: 'res.status(HTTP_STATUS.OK)' },
  { pattern: /\bres\.status\(204\)/g, replacement: 'res.status(HTTP_STATUS.NO_CONTENT)' },
  { pattern: /\bres\.status\(400\)/g, replacement: 'res.status(HTTP_STATUS.BAD_REQUEST)' },
  { pattern: /\bres\.status\(401\)/g, replacement: 'res.status(HTTP_STATUS.UNAUTHORIZED)' },
  { pattern: /\bres\.status\(403\)/g, replacement: 'res.status(HTTP_STATUS.FORBIDDEN)' },
  { pattern: /\bres\.status\(404\)/g, replacement: 'res.status(HTTP_STATUS.NOT_FOUND)' },
  { pattern: /\bres\.status\(409\)/g, replacement: 'res.status(HTTP_STATUS.CONFLICT)' },
  { pattern: /\bres\.status\(500\)/g, replacement: 'res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)' },

  // AppError with status codes
  { pattern: /AppError\(['"](.*?) not found['"], 404\)/g, replacement: "AppError(ERROR_MESSAGES.NOT_FOUND('$1'), HTTP_STATUS.NOT_FOUND)" },
  { pattern: /AppError\(['"](.*?) already exists['"], 400\)/g, replacement: "AppError(ERROR_MESSAGES.ALREADY_EXISTS('$1'), HTTP_STATUS.BAD_REQUEST)" },

  // Pagination defaults
  { pattern: /\bpage\s*=\s*1\b/g, replacement: 'page = PAGINATION.DEFAULT_PAGE' },
  { pattern: /\blimit\s*=\s*20\b/g, replacement: 'limit = PAGINATION.DEFAULT_LIMIT' },

  // Query modes
  { pattern: /mode:\s*['"]insensitive['"]/g, replacement: 'mode: QUERY_MODE.INSENSITIVE' },

  // Sort orders
  { pattern: /orderBy:\s*\{\s*createdAt:\s*['"]desc['"]\s*\}/g, replacement: 'orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }' },
  { pattern: /orderBy:\s*\{\s*visitDate:\s*['"]desc['"]\s*\}/g, replacement: 'orderBy: { [FIELDS.VISIT_DATE]: SORT_ORDER.DESC }' },
  { pattern: /orderBy:\s*\{\s*startTime:\s*['"]desc['"]\s*\}/g, replacement: 'orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC }' },
  { pattern: /orderBy:\s*\{\s*name:\s*['"]asc['"]\s*\}/g, replacement: 'orderBy: { name: SORT_ORDER.ASC }' },

  // Take limits
  { pattern: /\btake:\s*10\b/g, replacement: 'take: QUERY_LIMITS.RECENT_ITEMS' },
  { pattern: /\btake:\s*5\b/g, replacement: 'take: QUERY_LIMITS.APPOINTMENTS' },

  // Status checks
  { pattern: /status:\s*\{\s*not:\s*['"]cancelled['"]\s*\}/g, replacement: 'status: { not: STATUS.CANCELLED }' },
  { pattern: /status:\s*['"]active['"]/g, replacement: 'status: STATUS.ACTIVE' },
  { pattern: /status:\s*['"]pending['"]/g, replacement: 'status: STATUS.PENDING' },
];

// Import statement to add if not present
const requiredImports = {
  services: "import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, QUERY_LIMITS, STATUS } from '../constants';",
  controllers: "import { HTTP_STATUS } from '../constants';",
};

function refactorFile(filePath, fileType) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Check if constants are already imported
  const hasConstantsImport = content.includes("from '../constants'") || content.includes('from "../constants"');

  // Apply replacements
  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  // Add import if modified and not already present
  if (modified && !hasConstantsImport) {
    const importStatement = requiredImports[fileType] || requiredImports.services;

    // Find the last import statement
    const importLines = content.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex >= 0) {
      importLines.splice(lastImportIndex + 1, 0, importStatement);
      content = importLines.join('\n');
    }
  }

  // Write back if modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Refactored: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }

  return false;
}

// Main execution
console.log('Starting constants refactoring...\n');

let totalFiles = 0;
let modifiedFiles = 0;

// Refactor services
console.log('Refactoring services...');
glob.sync('backend/src/services/**/*.service.ts').forEach(file => {
  totalFiles++;
  if (refactorFile(file, 'services')) {
    modifiedFiles++;
  }
});

// Refactor controllers
console.log('\nRefactoring controllers...');
glob.sync('backend/src/controllers/**/*.controller.ts').forEach(file => {
  totalFiles++;
  if (refactorFile(file, 'controllers')) {
    modifiedFiles++;
  }
});

console.log(`\n✓ Complete! Modified ${modifiedFiles} out of ${totalFiles} files.`);
console.log('\nNote: Please review the changes and run type checking.');
console.log('Run: cd backend && npm run typecheck');
