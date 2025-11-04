import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

/**
 * Script to fix common issues from automated conversion
 */

const NESTJS_SRC = path.join(__dirname, '../src');

function fixControllerFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Fix return statements with trailing commas and semicolons
  // Pattern: return variable,\n    ;
  const returnCommaPattern = /return\s+(\w+),\s*\n\s*;/g;
  if (returnCommaPattern.test(content)) {
    content = content.replace(returnCommaPattern, 'return $1;');
    modified = true;
  }
  
  // Fix incomplete lines ending with opening parenthesis
  // Pattern: const x = await service.method(\n    query
  const incompleteCallPattern = /const\s+(\w+)\s+=\s+await\s+(\w+Service)\.(\w+)\(\s*\n\s*query/g;
  if (incompleteCallPattern.test(content)) {
    content = content.replace(incompleteCallPattern, 'const $1 = await $2.$3(query');
    modified = true;
  }
  
  // Fix service variable names - ensure they match the constructor parameter
  // Find constructor parameter name
  const constructorMatch = content.match(/constructor\([^)]*private readonly (\w+):\s*(\w+)Service[^)]*\)/);
  if (constructorMatch) {
    const correctServiceVar = constructorMatch[1];
    const serviceClassName = constructorMatch[2];
    
    // Find all incorrect references to service (like 'patientService' instead of 'patientsService')
    const incorrectServicePattern = new RegExp(`\\b${serviceClassName.charAt(0).toLowerCase() + serviceClassName.slice(1, -7)}Service\\b`, 'g');
    if (content.match(incorrectServicePattern)) {
      content = content.replace(incorrectServicePattern, correctServiceVar);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed ${path.basename(filePath)}`);
    return true;
  }
  
  return false;
}

function fixServiceFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Fix data parameter typing for Prisma create/update operations
  // Replace Record<string, unknown> with any for now (proper DTOs will be added later)
  const dataParamPattern = /async\s+\w+\s*\([^)]*data:\s*Record<string,\s*unknown>/g;
  if (dataParamPattern.test(content)) {
    content = content.replace(/data:\s*Record<string,\s*unknown>/g, 'data: any');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed ${path.basename(filePath)}`);
    return true;
  }
  
  return false;
}

function fixModuleFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Fix service class name mismatches in module imports
  // e.g., InvoicesService vs InvoiceService
  const importMatch = content.match(/import\s*{\s*(\w+)Service\s*}\s*from\s*['"]\.\/([^'"]+)\.service['"]/);
  if (importMatch) {
    const importedName = importMatch[1];
    const fileName = importMatch[2];
    
    // Read the service file to find the actual class name
    const serviceFilePath = path.join(path.dirname(filePath), `${fileName}.service.ts`);
    if (fs.existsSync(serviceFilePath)) {
      const serviceContent = fs.readFileSync(serviceFilePath, 'utf-8');
      const classMatch = serviceContent.match(/export\s+class\s+(\w+Service)/);
      if (classMatch) {
        const actualClassName = classMatch[1];
        if (actualClassName !== importedName + 'Service') {
          // Fix the import
          content = content.replace(
            new RegExp(`\\b${importedName}Service\\b`, 'g'),
            actualClassName
          );
          modified = true;
        }
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed ${path.basename(filePath)}`);
    return true;
  }
  
  return false;
}

console.log('🔧 Fixing conversion issues...\n');

// Find all controller files
const controllerFiles = glob.sync(path.join(NESTJS_SRC, '**/*.controller.ts'));
console.log(`📝 Processing ${controllerFiles.length} controller files...`);
let fixedControllers = 0;
controllerFiles.forEach(file => {
  if (fixControllerFile(file)) fixedControllers++;
});

// Find all service files
const serviceFiles = glob.sync(path.join(NESTJS_SRC, '**/*.service.ts')).filter(f => !f.includes('prisma.service'));
console.log(`\n📝 Processing ${serviceFiles.length} service files...`);
let fixedServices = 0;
serviceFiles.forEach(file => {
  if (fixServiceFile(file)) fixedServices++;
});

// Find all module files
const moduleFiles = glob.sync(path.join(NESTJS_SRC, '**/*.module.ts')).filter(f => !f.includes('app.module') && !f.includes('prisma.module'));
console.log(`\n📝 Processing ${moduleFiles.length} module files...`);
let fixedModules = 0;
moduleFiles.forEach(file => {
  if (fixModuleFile(file)) fixedModules++;
});

console.log(`\n✅ Fixed ${fixedControllers} controllers, ${fixedServices} services, ${fixedModules} modules`);
