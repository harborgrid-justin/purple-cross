import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

/**
 * Script to fix remaining conversion issues
 */

const NESTJS_SRC = path.join(__dirname, '../src');

function fixFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  const fileName = path.basename(filePath);
  
  // Fix service variable references in controllers
  // Read the file to find constructor and fix method calls
  const constructorMatch = content.match(/constructor\([^)]*private readonly (\w+):\s*(\w+)Service[^)]*\)/);
  if (constructorMatch) {
    const correctServiceVar = constructorMatch[1];
    const serviceClassName = constructorMatch[2];
    
    // Create patterns for incorrect service variable names
    const incorrectPatterns = [
      // singular version (e.g., 'marketingCampaignService' when it should be 'marketingCampaignsService')
      new RegExp(`\\b${serviceClassName.replace('s$', '')}Service\\b`, 'gi'),
      // without 's' at the end
      new RegExp(`\\b${serviceClassName.toLowerCase()}service\\b`, 'gi'),
    ];
    
    incorrectPatterns.forEach(pattern => {
      if (content.match(pattern) && !content.match(new RegExp(`\\b${correctServiceVar}\\b`))) {
        // Only replace if the correct variable is not already being used
        content = content.replace(pattern, correctServiceVar);
        modified = true;
      }
    });
  }
  
  // Fix module imports - check if service class name matches what's being imported
  if (fileName.endsWith('.module.ts')) {
    const serviceMatch = content.match(/import\s*{\s*(\w+)\s*}\s*from\s*['"]\.\/([^'"]+)\.service['"]/);
    if (serviceMatch) {
      const importedName = serviceMatch[1];
      const serviceFileName = serviceMatch[2];
      
      // Read the actual service file
      const serviceFilePath = path.join(path.dirname(filePath), `${serviceFileName}.service.ts`);
      if (fs.existsSync(serviceFilePath)) {
        const serviceContent = fs.readFileSync(serviceFilePath, 'utf-8');
        const actualClassMatch = serviceContent.match(/export\s+class\s+(\w+Service)/);
        if (actualClassMatch) {
          const actualClassName = actualClassMatch[1];
          if (actualClassName !== importedName) {
            // Replace all occurrences of the imported name with the actual class name
            content = content.replace(new RegExp(`\\b${importedName}\\b`, 'g'), actualClassName);
            modified = true;
          }
        }
      }
    }
    
    // Fix controller imports similarly
    const controllerMatch = content.match(/import\s*{\s*(\w+)\s*}\s*from\s*['"]\.\/([^'"]+)\.controller['"]/);
    if (controllerMatch) {
      const importedName = controllerMatch[1];
      const controllerFileName = controllerMatch[2];
      
      const controllerFilePath = path.join(path.dirname(filePath), `${controllerFileName}.controller.ts`);
      if (fs.existsSync(controllerFilePath)) {
        const controllerContent = fs.readFileSync(controllerFilePath, 'utf-8');
        const actualClassMatch = controllerContent.match(/export\s+class\s+(\w+Controller)/);
        if (actualClassMatch) {
          const actualClassName = actualClassMatch[1];
          if (actualClassName !== importedName) {
            content = content.replace(new RegExp(`\\b${importedName}\\b`, 'g'), actualClassName);
            modified = true;
          }
        }
      }
    }
  }
  
  // Fix controller imports
  if (fileName.endsWith('.controller.ts')) {
    const serviceMatch = content.match(/import\s*{\s*(\w+)\s*}\s*from\s*['"]\.\/([^'"]+)\.service['"]/);
    if (serviceMatch) {
      const importedName = serviceMatch[1];
      const serviceFileName = serviceMatch[2];
      
      const serviceFilePath = path.join(path.dirname(filePath), `${serviceFileName}.service.ts`);
      if (fs.existsSync(serviceFilePath)) {
        const serviceContent = fs.readFileSync(serviceFilePath, 'utf-8');
        const actualClassMatch = serviceContent.match(/export\s+class\s+(\w+Service)/);
        if (actualClassMatch) {
          const actualClassName = actualClassMatch[1];
          if (actualClassName !== importedName) {
            content = content.replace(new RegExp(`\\b${importedName}\\b`, 'g'), actualClassName);
            modified = true;
          }
        }
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed ${fileName}`);
    return true;
  }
  
  return false;
}

console.log('🔧 Fixing remaining issues...\n');

// Process all TypeScript files
const tsFiles = glob.sync(path.join(NESTJS_SRC, '**/*.ts'), {
  ignore: ['**/node_modules/**', '**/dist/**']
});

console.log(`📝 Processing ${tsFiles.length} files...`);
let fixedCount = 0;

tsFiles.forEach(file => {
  if (fixFile(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
