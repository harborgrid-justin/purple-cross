#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Starting bulk refactoring of all service and controller files...\n');

const CONSTANTS_IMPORT_SERVICES =
  "import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, QUERY_LIMITS, STATUS } from '../constants';";
const CONSTANTS_IMPORT_CONTROLLERS = "import { HTTP_STATUS } from '../constants';";

// Replacement patterns
const SERVICE_REPLACEMENTS = [
  // Error messages with status codes
  {
    pattern: /throw new AppError\('([^']+) not found', 404\)/g,
    replacement: "throw new AppError(ERROR_MESSAGES.NOT_FOUND('$1'), HTTP_STATUS.NOT_FOUND)",
  },
  {
    pattern: /throw new AppError\("([^"]+) not found", 404\)/g,
    replacement: "throw new AppError(ERROR_MESSAGES.NOT_FOUND('$1'), HTTP_STATUS.NOT_FOUND)",
  },
  {
    pattern: /throw new AppError\('([^']+) already exists', 400\)/g,
    replacement: "throw new AppError(ERROR_MESSAGES.ALREADY_EXISTS('$1'), HTTP_STATUS.BAD_REQUEST)",
  },
  {
    pattern: /throw new AppError\("([^"]+) already exists", 400\)/g,
    replacement: "throw new AppError(ERROR_MESSAGES.ALREADY_EXISTS('$1'), HTTP_STATUS.BAD_REQUEST)",
  },

  // Pagination
  {
    pattern: /\bpage = 1, limit = 20\b/g,
    replacement: 'page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT',
  },
  { pattern: /\bpage = 1\b/g, replacement: 'page = PAGINATION.DEFAULT_PAGE' },
  { pattern: /\blimit = 20\b/g, replacement: 'limit = PAGINATION.DEFAULT_LIMIT' },

  // Query modes
  { pattern: /mode: 'insensitive'/g, replacement: 'mode: QUERY_MODE.INSENSITIVE' },
  { pattern: /mode: "insensitive"/g, replacement: 'mode: QUERY_MODE.INSENSITIVE' },

  // Order by patterns
  {
    pattern: /orderBy: \{ createdAt: 'desc' \}/g,
    replacement: 'orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }',
  },
  {
    pattern: /orderBy: \{ createdAt: "desc" \}/g,
    replacement: 'orderBy: { [FIELDS.CREATED_AT]: SORT_ORDER.DESC }',
  },
  {
    pattern: /orderBy: \{ visitDate: 'desc' \}/g,
    replacement: 'orderBy: { [FIELDS.VISIT_DATE]: SORT_ORDER.DESC }',
  },
  {
    pattern: /orderBy: \{ visitDate: "desc" \}/g,
    replacement: 'orderBy: { [FIELDS.VISIT_DATE]: SORT_ORDER.DESC }',
  },
  {
    pattern: /orderBy: \{ startTime: 'desc' \}/g,
    replacement: 'orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC }',
  },
  {
    pattern: /orderBy: \{ startTime: "desc" \}/g,
    replacement: 'orderBy: { [FIELDS.START_TIME]: SORT_ORDER.DESC }',
  },
  {
    pattern: /orderBy: \{ invoiceDate: 'desc' \}/g,
    replacement: 'orderBy: { [FIELDS.INVOICE_DATE]: SORT_ORDER.DESC }',
  },
  {
    pattern: /orderBy: \{ invoiceDate: "desc" \}/g,
    replacement: 'orderBy: { [FIELDS.INVOICE_DATE]: SORT_ORDER.DESC }',
  },
  {
    pattern: /orderBy: \{ name: 'asc' \}/g,
    replacement: 'orderBy: { [FIELDS.NAME]: SORT_ORDER.ASC }',
  },
  {
    pattern: /orderBy: \{ name: "asc" \}/g,
    replacement: 'orderBy: { [FIELDS.NAME]: SORT_ORDER.ASC }',
  },

  // Status checks
  { pattern: /status: \{ not: 'cancelled' \}/g, replacement: 'status: { not: STATUS.CANCELLED }' },
  { pattern: /status: \{ not: "cancelled" \}/g, replacement: 'status: { not: STATUS.CANCELLED }' },

  // Take limits
  { pattern: /\btake: 10\b/g, replacement: 'take: QUERY_LIMITS.RECENT_ITEMS' },
  { pattern: /\btake: 5\b/g, replacement: 'take: QUERY_LIMITS.APPOINTMENTS' },
];

const CONTROLLER_REPLACEMENTS = [
  { pattern: /res\.status\(201\)/g, replacement: 'res.status(HTTP_STATUS.CREATED)' },
  { pattern: /res\.status\(200\)/g, replacement: 'res.status(HTTP_STATUS.OK)' },
  { pattern: /res\.status\(204\)/g, replacement: 'res.status(HTTP_STATUS.NO_CONTENT)' },
  { pattern: /res\.status\(400\)/g, replacement: 'res.status(HTTP_STATUS.BAD_REQUEST)' },
  { pattern: /res\.status\(404\)/g, replacement: 'res.status(HTTP_STATUS.NOT_FOUND)' },
];

function addImportIfNeeded(content, importStatement) {
  // Check if import already exists
  if (content.includes("from '../constants'") || content.includes('from "../constants"')) {
    return content;
  }

  // Find last import line
  const lines = content.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, importStatement);
    return lines.join('\n');
  }

  return content;
}

function refactorFile(filePath, replacements, importStatement) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let modified = false;

  // Apply all replacements
  for (const { pattern, replacement } of replacements) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  }

  // Add import if modified
  if (modified) {
    content = addImportIfNeeded(content, importStatement);
  }

  // Write back if changed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function getAllFiles(dir, ext) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, ext));
    } else if (item.endsWith(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

// Refactor services
console.log('Refactoring service files...');
const servicesDir = path.join('backend', 'src', 'services');
const serviceFiles = getAllFiles(servicesDir, '.service.ts');
let serviceModified = 0;

for (const file of serviceFiles) {
  if (refactorFile(file, SERVICE_REPLACEMENTS, CONSTANTS_IMPORT_SERVICES)) {
    console.log(`  ✓ ${path.relative(process.cwd(), file)}`);
    serviceModified++;
  }
}

console.log(`\nServices: Modified ${serviceModified} of ${serviceFiles.length} files\n`);

// Refactor controllers
console.log('Refactoring controller files...');
const controllersDir = path.join('backend', 'src', 'controllers');
const controllerFiles = getAllFiles(controllersDir, '.controller.ts');
let controllerModified = 0;

for (const file of controllerFiles) {
  if (refactorFile(file, CONTROLLER_REPLACEMENTS, CONSTANTS_IMPORT_CONTROLLERS)) {
    console.log(`  ✓ ${path.relative(process.cwd(), file)}`);
    controllerModified++;
  }
}

console.log(`\nControllers: Modified ${controllerModified} of ${controllerFiles.length} files\n`);

console.log('✓ Refactoring complete!');
console.log(`Total: ${serviceModified + controllerModified} files modified`);
console.log('\nRun "cd backend && npm run typecheck" to verify changes');
