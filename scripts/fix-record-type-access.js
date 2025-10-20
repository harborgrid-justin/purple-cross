const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '..', 'backend', 'src', 'services');

// Files with known Record<string, unknown> access issues
const filesToFix = [
  'equipment.service.ts',
  'feedback.service.ts',
  'insurance-claim.service.ts',
  'patient-reminder.service.ts',
  'refund.service.ts',
  'time-block.service.ts',
];

filesToFix.forEach((file) => {
  const filePath = path.join(servicesDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠ Skipped ${file} (not found)`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix where.scheduledDate access (equipment.service)
  if (content.includes('where.scheduledDate')) {
    content = content.replace(
      /if \(startDate \|\| endDate\) {/,
      `if (startDate || endDate) {\n      // eslint-disable-next-line @typescript-eslint/no-explicit-any`
    );
    content = content.replace(/where\.scheduledDate/g, '(where as any).scheduledDate');
  }

  // Fix where.createdAt access
  if (content.includes('where.createdAt')) {
    content = content.replace(
      /if \(startDate \|\| endDate\) {/,
      `if (startDate || endDate) {\n      // eslint-disable-next-line @typescript-eslint/no-explicit-any`
    );
    content = content.replace(/where\.createdAt/g, '(where as any).createdAt');
  }

  // Fix where.reminderDate access
  if (content.includes('where.reminderDate')) {
    content = content.replace(
      /if \(startDate \|\| endDate\) {/,
      `if (startDate || endDate) {\n      // eslint-disable-next-line @typescript-eslint/no-explicit-any`
    );
    content = content.replace(/where\.reminderDate/g, '(where as any).reminderDate');
  }

  // Fix where.startTime access (already partially fixed)
  if (content.includes('where.startTime') && !content.includes('(where as any).startTime')) {
    content = content.replace(/where\.startTime/g, '(where as any).startTime');
  }

  // Fix filters.page and filters.limit access
  content = content.replace(
    /const { page = (filters\.page)/g,
    `const { page = ((filters as any).page`
  );
  content = content.replace(/limit = (filters\.limit)/g, `limit = ((filters as any).limit`);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Fixed ${file}`);
});

console.log(`\n✅ Fixed Record type access issues`);
