#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Cleaning up unused imports...\n');

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

function cleanupImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Find the constants import line
  const importMatch = content.match(/import \{ ([^}]+) \} from ['"]\.\.\/constants['"]/);

  if (!importMatch) {
    return false;
  }

  const imports = importMatch[1].split(',').map((s) => s.trim());
  const usedImports = [];

  // Check which imports are actually used
  for (const imp of imports) {
    // Create regex to find usage (not in the import line itself)
    const usagePattern = new RegExp(`\\b${imp}\\b`, 'g');
    const matches = content.match(usagePattern);

    // If used more than once (once for import, more for usage), keep it
    if (matches && matches.length > 1) {
      usedImports.push(imp);
    }
  }

  if (usedImports.length === 0) {
    // Remove the entire import line
    content = content.replace(/import \{ [^}]+ \} from ['"]\.\.\/constants['"];?\n?/, '');
  } else if (usedImports.length < imports.length) {
    // Update with only used imports
    const newImport = `import { ${usedImports.join(', ')} } from '../constants';`;
    content = content.replace(/import \{ [^}]+ \} from ['"]\.\.\/constants['"];?/, newImport);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

// Clean up services
const servicesDir = path.join('backend', 'src', 'services');
const serviceFiles = getAllFiles(servicesDir, '.service.ts');
let cleaned = 0;

for (const file of serviceFiles) {
  if (cleanupImports(file)) {
    console.log(`  ✓ Cleaned: ${path.relative(process.cwd(), file)}`);
    cleaned++;
  }
}

// Clean up controllers
const controllersDir = path.join('backend', 'src', 'controllers');
const controllerFiles = getAllFiles(controllersDir, '.controller.ts');

for (const file of controllerFiles) {
  if (cleanupImports(file)) {
    console.log(`  ✓ Cleaned: ${path.relative(process.cwd(), file)}`);
    cleaned++;
  }
}

console.log(`\n✓ Cleanup complete! Processed ${cleaned} files\n`);
