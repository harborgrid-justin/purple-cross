const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '..', 'backend', 'src', 'services');

// Get all service files
const files = fs.readdirSync(servicesDir).filter((file) => file.endsWith('.service.ts'));

files.forEach((file) => {
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace 'data: any' with 'data: Record<string, unknown>'
  if (content.includes('data: any')) {
    content = content.replace(/data:\s*any/g, 'data: Record<string, unknown>');
    modified = true;
  }

  // Replace 'filters?: any' with 'filters?: Record<string, unknown>'
  if (content.includes('filters?: any')) {
    content = content.replace(/filters\?:\s*any/g, 'filters?: Record<string, unknown>');
    modified = true;
  }

  // Replace 'where: any' with 'where: Record<string, unknown>'
  if (content.includes('where: any')) {
    content = content.replace(/where:\s*any/g, 'where: Record<string, unknown>');
    modified = true;
  }

  // Replace 'options: any' with 'options: Record<string, unknown>'
  if (content.includes('options: any')) {
    content = content.replace(/options:\s*any/g, 'options: Record<string, unknown>');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed ${file}`);
  }
});

console.log(`\n✅ Fixed service type annotations`);
