import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to migrate all Express modules to NestJS
 * This reads the backend services and generates equivalent NestJS modules
 */

const BACKEND_SRC = path.join(__dirname, '../../backend/src');
const NESTJS_SRC = path.join(__dirname, '../src');

// List of all modules to migrate
const modules = [
  'patients',
  'clients',
  'appointments',
  'medical-records',
  'prescriptions',
  'inventory',
  'invoices',
  'lab-tests',
  'staff',
  'communications',
  'documents',
  'analytics',
  'breed-info',
  'patient-relationships',
  'patient-reminders',
  'client-portal',
  'loyalty-programs',
  'feedback',
  'waitlist',
  'time-blocks',
  'estimates',
  'payment-plans',
  'purchase-orders',
  'equipment',
  'insurance-claims',
  'refunds',
  'marketing-campaigns',
  'policies',
  'report-templates',
  'document-templates',
  'webhooks',
  'workflows',
  'workflow-templates',
  'workflow-executions',
];

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function generateServiceTemplate(moduleName: string): string {
  const className = `${toPascalCase(moduleName)}Service`;
  const backendServicePath = path.join(BACKEND_SRC, 'services', `${moduleName}.service.ts`);
  
  return `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS } from '../common/constants';

@Injectable()
export class ${className} {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: Migrate methods from ${backendServicePath}
  // Service implementation will be migrated from Express backend
}
`;
}

function generateControllerTemplate(moduleName: string): string {
  const className = `${toPascalCase(moduleName)}Controller`;
  const serviceName = `${toPascalCase(moduleName)}Service`;
  const serviceVar = toCamelCase(moduleName) + 'Service';
  
  return `import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ${serviceName} } from './${moduleName}.service';

@Controller('${moduleName}')
export class ${className} {
  constructor(private readonly ${serviceVar}: ${serviceName}) {}

  // TODO: Migrate controller methods from backend/src/controllers/${moduleName}.controller.ts
}
`;
}

function generateModuleTemplate(moduleName: string): string {
  const className = `${toPascalCase(moduleName)}Module`;
  const controllerName = `${toPascalCase(moduleName)}Controller`;
  const serviceName = `${toPascalCase(moduleName)}Service`;
  
  return `import { Module } from '@nestjs/common';
import { ${controllerName} } from './${moduleName}.controller';
import { ${serviceName} } from './${moduleName}.service';

@Module({
  controllers: [${controllerName}],
  providers: [${serviceName}],
  exports: [${serviceName}],
})
export class ${className} {}
`;
}

function generateModule(moduleName: string) {
  const moduleDir = path.join(NESTJS_SRC, moduleName);
  
  // Create module directory
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }
  
  // Create dto directory
  const dtoDir = path.join(moduleDir, 'dto');
  if (!fs.existsSync(dtoDir)) {
    fs.mkdirSync(dtoDir, { recursive: true });
  }
  
  // Generate service
  const servicePath = path.join(moduleDir, `${moduleName}.service.ts`);
  if (!fs.existsSync(servicePath)) {
    fs.writeFileSync(servicePath, generateServiceTemplate(moduleName));
    console.log(`✓ Created ${servicePath}`);
  }
  
  // Generate controller
  const controllerPath = path.join(moduleDir, `${moduleName}.controller.ts`);
  if (!fs.existsSync(controllerPath)) {
    fs.writeFileSync(controllerPath, generateControllerTemplate(moduleName));
    console.log(`✓ Created ${controllerPath}`);
  }
  
  // Generate module
  const modulePath = path.join(moduleDir, `${moduleName}.module.ts`);
  if (!fs.existsSync(modulePath)) {
    fs.writeFileSync(modulePath, generateModuleTemplate(moduleName));
    console.log(`✓ Created ${modulePath}`);
  }
}

console.log('🚀 Starting NestJS module migration...\n');

modules.forEach(module => {
  console.log(`\n📦 Generating ${module} module...`);
  generateModule(module);
});

console.log('\n\n✅ Module generation complete!');
console.log('\n📝 Next steps:');
console.log('1. Update each service with actual business logic from Express backend');
console.log('2. Create DTOs for each module');
console.log('3. Update controllers with proper endpoints and validation');
console.log('4. Import all modules in the main AppModule');
