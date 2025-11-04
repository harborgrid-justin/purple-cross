import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

/**
 * Final comprehensive fix script
 */

const NESTJS_SRC = path.join(__dirname, '../src');

function fixFile(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  const fileName = path.basename(filePath);
  
  // Remove singleton export statements
  if (content.includes('export const') && content.includes('= new')) {
    const singletonPattern = /export\s+const\s+\w+(?:Service|Controller)\s+=\s+new\s+\w+(?:Service|Controller)\(\);?\s*$/gm;
    if (singletonPattern.test(content)) {
      content = content.replace(singletonPattern, '');
      modified = true;
    }
  }
  
  // Fix req.params references in controllers
  if (fileName.endsWith('.controller.ts')) {
    if (content.includes('req.params')) {
      // This should have been converted by decorators, but if not, let's comment it out
      content = content.replace(/req\.params\.(\w+)/g, 'FIXME_$1');
      modified = true;
    }
    
    // Fix methods that don't have proper parameter extraction
    // Find methods that reference variables not in their signature
    const methodPattern = /async\s+(\w+)\s*\([^)]*\)\s*{([^}]+)}/gs;
    const matches = [...content.matchAll(methodPattern)];
    
    for (const match of matches) {
      const methodBody = match[2];
      const methodDef = match[0];
      
      // If body references 'body' but it's not in parameters
      if (methodBody.includes('body') && !methodDef.includes('@Body')) {
        // Likely needs fixing but we'll skip for now as it requires context
      }
      
      // If references 'id' but not in parameters
      if (methodBody.includes('await') && methodBody.includes('(id') && !methodDef.includes('@Param')) {
        // Likely needs fixing
      }
    }
  }
  
  // Fix service files - remove singleton exports
  if (fileName.endsWith('.service.ts')) {
    const exportPattern = /\nexport\s+(?:const|default)\s+.*?Service.*?;?\s*$/gm;
    if (exportPattern.test(content)) {
      content = content.replace(exportPattern, '');
      modified = true;
    }
    
    // Fix data: any types to be more specific where possible
    // For now, keep as 'any' since proper DTOs will be added later
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

console.log('🔧 Running final fixes...\n');

const tsFiles = glob.sync(path.join(NESTJS_SRC, '**/*.ts'), {
  ignore: ['**/node_modules/**', '**/dist/**']
});

console.log(`📝 Processing ${tsFiles.length} files...`);
let fixedCount = 0;

tsFiles.forEach(file => {
  if (fixFile(file)) {
    console.log(`✓ Fixed ${path.basename(file)}`);
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
console.log('\n📝 Manual fixes still needed:');
console.log('- Controller methods with missing parameter decorators');
console.log('- Type mismatches in Prisma calls');
console.log('- Null safety checks');
