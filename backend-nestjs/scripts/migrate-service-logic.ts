import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to migrate service logic from Express to NestJS
 * This reads Express services and converts them to NestJS format
 */

const BACKEND_SERVICES = path.join(__dirname, '../../backend/src/services');
const NESTJS_SRC = path.join(__dirname, '../src');

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function convertServiceToNestJS(expressServiceCode: string, moduleName: string): string {
  const className = `${toPascalCase(moduleName)}Service`;
  
  // Remove Express imports and replace with NestJS imports
  let nestjsCode = expressServiceCode;
  
  // Replace prisma import
  nestjsCode = nestjsCode.replace(
    /import\s*{\s*prisma\s*}\s*from\s*['"].*?database['"];?/g,
    ''
  );
  
  // Replace AppError import
  nestjsCode = nestjsCode.replace(
    /import\s*{\s*AppError\s*}\s*from\s*['"].*?error-handler['"];?/g,
    "import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';"
  );
  
  // Replace constants import
  nestjsCode = nestjsCode.replace(
    /import\s*{[^}]*}\s*from\s*['"].*?constants['"];?/g,
    "import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS } from '../common/constants';"
  );
  
  // Replace domain events import - keep it for now
  nestjsCode = nestjsCode.replace(
    /import\s*{\s*domainEvents\s*}\s*from\s*['"].*?domain-events.service['"];?/g,
    "// TODO: Migrate domain events to NestJS event emitter"
  );
  
  // Convert class declaration to use @Injectable and constructor injection
  nestjsCode = nestjsCode.replace(
    /export\s+class\s+(\w+Service)\s*{/,
    `import { Injectable } from '@nestjs/common';\nimport { PrismaService } from '../prisma/prisma.service';\n\n@Injectable()\nexport class $1 {\n  constructor(private readonly prisma: PrismaService) {}`
  );
  
  // Replace all prisma. with this.prisma.
  nestjsCode = nestjsCode.replace(/\bprisma\./g, 'this.prisma.');
  
  // Replace AppError with NestJS exceptions
  nestjsCode = nestjsCode.replace(
    /throw\s+new\s+AppError\(ERROR_MESSAGES\.NOT_FOUND\((.*?)\),\s*HTTP_STATUS\.NOT_FOUND\)/g,
    'throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND($1))'
  );
  
  nestjsCode = nestjsCode.replace(
    /throw\s+new\s+AppError\(ERROR_MESSAGES\.ALREADY_EXISTS\((.*?)\),\s*HTTP_STATUS\.BAD_REQUEST\)/g,
    'throw new ConflictException(ERROR_MESSAGES.ALREADY_EXISTS($1))'
  );
  
  nestjsCode = nestjsCode.replace(
    /throw\s+new\s+AppError\((.*?),\s*HTTP_STATUS\.BAD_REQUEST\)/g,
    'throw new BadRequestException($1)'
  );
  
  // Remove export default new Service()
  nestjsCode = nestjsCode.replace(/export\s+default\s+new\s+\w+Service\(\);?/g, '');
  
  // Comment out domain events for now
  nestjsCode = nestjsCode.replace(
    /domainEvents\.emit\(/g,
    '// TODO: Implement event emitter\n    // domainEvents.emit('
  );
  
  return nestjsCode;
}

function migrateService(serviceFileName: string) {
  const moduleName = serviceFileName.replace('.service.ts', '');
  const expressServicePath = path.join(BACKEND_SERVICES, serviceFileName);
  const nestjsServicePath = path.join(NESTJS_SRC, moduleName, `${moduleName}.service.ts`);
  
  // Check if Express service exists
  if (!fs.existsSync(expressServicePath)) {
    console.log(`⚠️  Express service not found: ${expressServicePath}`);
    return;
  }
  
  // Check if NestJS module directory exists
  const nestjsModuleDir = path.join(NESTJS_SRC, moduleName);
  if (!fs.existsSync(nestjsModuleDir)) {
    console.log(`⚠️  NestJS module directory not found: ${nestjsModuleDir}`);
    return;
  }
  
  try {
    // Read Express service
    const expressServiceCode = fs.readFileSync(expressServicePath, 'utf-8');
    
    // Convert to NestJS
    const nestjsServiceCode = convertServiceToNestJS(expressServiceCode, moduleName);
    
    // Write to NestJS service
    fs.writeFileSync(nestjsServicePath, nestjsServiceCode);
    console.log(`✓ Migrated ${moduleName} service`);
  } catch (error) {
    console.error(`✗ Error migrating ${moduleName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

console.log('🚀 Starting service logic migration...\n');

// Get all service files from Express backend
const serviceFiles = fs.readdirSync(BACKEND_SERVICES).filter(file => file.endsWith('.service.ts'));

serviceFiles.forEach(serviceFile => {
  migrateService(serviceFile);
});

console.log('\n✅ Service logic migration complete!');
console.log('\n📝 Next steps:');
console.log('1. Review each migrated service for correctness');
console.log('2. Implement domain events using NestJS EventEmitter');
console.log('3. Add proper type definitions for DTOs');
console.log('4. Test each service');
