import * as fs from 'fs';
import * as path from 'path';

/**
 * Comprehensive migration script from Express to NestJS
 * This migrates services, controllers, and creates proper module structure
 */

const BACKEND_SRC = path.join(__dirname, '../../backend/src');
const NESTJS_SRC = path.join(__dirname, '../src');

// Map from backend service names to NestJS module names
const serviceModuleMap: Record<string, string> = {
  'patient': 'patients',
  'client': 'clients',
  'appointment': 'appointments',
  'medical-record': 'medical-records',
  'prescription': 'prescriptions',
  'inventory': 'inventory',
  'invoice': 'invoices',
  'lab-test': 'lab-tests',
  'staff': 'staff',
  'communication': 'communications',
  'document': 'documents',
  'analytics': 'analytics',
  'breed-info': 'breed-info',
  'patient-relationship': 'patient-relationships',
  'patient-reminder': 'patient-reminders',
  'client-portal': 'client-portal',
  'loyalty-program': 'loyalty-programs',
  'feedback': 'feedback',
  'waitlist': 'waitlist',
  'time-block': 'time-blocks',
  'estimate': 'estimates',
  'payment-plan': 'payment-plans',
  'purchase-order': 'purchase-orders',
  'equipment': 'equipment',
  'insurance-claim': 'insurance-claims',
  'refund': 'refunds',
  'marketing-campaign': 'marketing-campaigns',
  'policy': 'policies',
  'report-template': 'report-templates',
  'document-template': 'document-templates',
  'webhook': 'webhooks',
  'workflow': 'workflows',
  'workflow-template': 'workflow-templates',
  'workflow-execution': 'workflow-executions',
};

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

function convertServiceToNestJS(expressServiceCode: string, moduleName: string): string {
  let code = expressServiceCode;
  
  // Add NestJS imports at the top
  const imports = `import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION, QUERY_MODE, SORT_ORDER, FIELDS, WORKFLOW_EVENTS, QUERY_LIMITS } from '../common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

`;
  
  // Remove old imports
  code = code.replace(/^import\s+{[^}]*}\s+from\s+['"][^'"]*['"];?\s*$/gm, '');
  code = code.replace(/^import\s+\w+\s+from\s+['"][^'"]*['"];?\s*$/gm, '');
  
  // Convert class to use @Injectable decorator and constructor injection
  const className = code.match(/export\s+class\s+(\w+Service)/)?.[1] || `${toPascalCase(moduleName)}Service`;
  
  code = code.replace(
    /export\s+class\s+(\w+Service)\s*{/,
    `@Injectable()\nexport class ${className} {\n  constructor(\n    private readonly prisma: PrismaService,\n    private readonly eventEmitter: EventEmitter2,\n  ) {}`
  );
  
  // Replace prisma with this.prisma
  code = code.replace(/\bprisma\./g, 'this.prisma.');
  
  // Replace AppError with NestJS exceptions
  code = code.replace(
    /throw\s+new\s+AppError\(ERROR_MESSAGES\.NOT_FOUND\(([^)]+)\),\s*HTTP_STATUS\.NOT_FOUND\)/g,
    'throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND($1))'
  );
  
  code = code.replace(
    /throw\s+new\s+AppError\(ERROR_MESSAGES\.ALREADY_EXISTS\(([^)]+)\),\s*HTTP_STATUS\.BAD_REQUEST\)/g,
    'throw new ConflictException(ERROR_MESSAGES.ALREADY_EXISTS($1))'
  );
  
  code = code.replace(
    /throw\s+new\s+AppError\(([^,]+),\s*HTTP_STATUS\.BAD_REQUEST\)/g,
    'throw new BadRequestException($1)'
  );
  
  code = code.replace(
    /throw\s+new\s+AppError\(([^,]+),\s*[^)]+\)/g,
    'throw new BadRequestException($1)'
  );
  
  // Replace domain events with EventEmitter
  code = code.replace(
    /domainEvents\.emit\(([^,]+),\s*({[^}]*})\)/g,
    'this.eventEmitter.emit($1, $2)'
  );
  
  // Remove export default
  code = code.replace(/export\s+default\s+new\s+\w+Service\(\);?\s*$/m, '');
  
  return imports + code.trim();
}

function convertControllerToNestJS(expressControllerCode: string, moduleName: string): string {
  let code = expressControllerCode;
  
  const className = `${toPascalCase(moduleName)}Controller`;
  const serviceName = `${toPascalCase(moduleName)}Service`;
  const serviceVar = toCamelCase(moduleName) + 'Service';
  
  // Add NestJS imports
  const imports = `import {
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
  ValidationPipe,
} from '@nestjs/common';
import { ${serviceName} } from './${moduleName}.service';

`;
  
  // Remove old imports
  code = code.replace(/^import\s+{[^}]*}\s+from\s+['"][^'"]*['"];?\s*$/gm, '');
  code = code.replace(/^import\s+\w+\s+from\s+['"][^'"]*['"];?\s*$/gm, '');
  
  // Convert class to use @Controller decorator
  code = code.replace(
    /export\s+class\s+(\w+Controller)\s*{/,
    `@Controller('${moduleName}')\nexport class ${className} {\n  constructor(private readonly ${serviceVar}: ${serviceName}) {}`
  );
  
  // Convert methods to use decorators
  code = code.replace(
    /async\s+create\s*\(\s*req:\s*Request,\s*res:\s*Response\s*\):\s*Promise<void>\s*{/g,
    `@Post()\n  @HttpCode(HttpStatus.CREATED)\n  async create(@Body(ValidationPipe) body: any) {`
  );
  
  code = code.replace(
    /async\s+getById\s*\(\s*req:\s*Request,\s*res:\s*Response\s*\):\s*Promise<void>\s*{/g,
    `@Get(':id')\n  async getById(@Param('id', ParseUUIDPipe) id: string) {`
  );
  
  code = code.replace(
    /async\s+getAll\s*\(\s*req:\s*Request,\s*res:\s*Response\s*\):\s*Promise<void>\s*{/g,
    `@Get()\n  async getAll(@Query() query: any) {`
  );
  
  code = code.replace(
    /async\s+update\s*\(\s*req:\s*Request,\s*res:\s*Response\s*\):\s*Promise<void>\s*{/g,
    `@Put(':id')\n  async update(@Param('id', ParseUUIDPipe) id: string, @Body(ValidationPipe) body: any) {`
  );
  
  code = code.replace(
    /async\s+delete\s*\(\s*req:\s*Request,\s*res:\s*Response\s*\):\s*Promise<void>\s*{/g,
    `@Delete(':id')\n  @HttpCode(HttpStatus.NO_CONTENT)\n  async delete(@Param('id', ParseUUIDPipe) id: string) {`
  );
  
  // Replace req.body with body
  code = code.replace(/req\.body/g, 'body');
  
  // Replace req.params.id with id
  code = code.replace(/req\.params\.id/g, 'id');
  
  // Replace req.query with query
  code = code.replace(/req\.query/g, 'query');
  
  // Replace service calls - remove 'Service' from variable name
  const oldServiceVar = toCamelCase(moduleName.replace(/-/g, '')) + 'Service';
  code = code.replace(new RegExp(`\\b${oldServiceVar}\\b`, 'g'), serviceVar);
  
  // Remove res.status().json() wrapping, just return the data
  code = code.replace(
    /res\.status\([^)]+\)\.json\(\s*{\s*status:\s*['"]success['"],\s*data:\s*([^}]+)\s*}\s*\);?/g,
    'return $1;'
  );
  
  code = code.replace(
    /res\.status\([^)]+\)\.json\(\s*{\s*status:\s*['"]success['"],\s*\.\.\.([^}]+)\s*}\s*\);?/g,
    'return $1;'
  );
  
  code = code.replace(
    /res\.status\([^)]+\)\.send\(\);?/g,
    'return;'
  );
  
  // Remove export default
  code = code.replace(/export\s+default\s+new\s+\w+Controller\(\);?\s*$/m, '');
  
  // Fix return types
  code = code.replace(/:\s*Promise<void>/g, '');
  
  return imports + code.trim();
}

function createModule(serviceName: string, moduleName: string) {
  const moduleDir = path.join(NESTJS_SRC, moduleName);
  const className = `${toPascalCase(moduleName)}Module`;
  const controllerName = `${toPascalCase(moduleName)}Controller`;
  const serviceClassName = `${toPascalCase(moduleName)}Service`;
  
  // Create module directory
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }
  
  // Create dto directory
  const dtoDir = path.join(moduleDir, 'dto');
  if (!fs.existsSync(dtoDir)) {
    fs.mkdirSync(dtoDir, { recursive: true });
  }
  
  // Read and convert service
  const expressServicePath = path.join(BACKEND_SRC, 'services', `${serviceName}.service.ts`);
  if (fs.existsSync(expressServicePath)) {
    const expressServiceCode = fs.readFileSync(expressServicePath, 'utf-8');
    const nestjsServiceCode = convertServiceToNestJS(expressServiceCode, moduleName);
    fs.writeFileSync(path.join(moduleDir, `${moduleName}.service.ts`), nestjsServiceCode);
    console.log(`✓ Migrated ${moduleName} service`);
  } else {
    console.log(`⚠️  Service not found: ${expressServicePath}`);
  }
  
  // Read and convert controller
  const expressControllerPath = path.join(BACKEND_SRC, 'controllers', `${serviceName}.controller.ts`);
  if (fs.existsSync(expressControllerPath)) {
    const expressControllerCode = fs.readFileSync(expressControllerPath, 'utf-8');
    const nestjsControllerCode = convertControllerToNestJS(expressControllerCode, moduleName);
    fs.writeFileSync(path.join(moduleDir, `${moduleName}.controller.ts`), nestjsControllerCode);
    console.log(`✓ Migrated ${moduleName} controller`);
  } else {
    console.log(`⚠️  Controller not found: ${expressControllerPath}`);
  }
  
  // Create module file
  const moduleCode = `import { Module } from '@nestjs/common';
import { ${controllerName} } from './${moduleName}.controller';
import { ${serviceClassName} } from './${moduleName}.service';

@Module({
  controllers: [${controllerName}],
  providers: [${serviceClassName}],
  exports: [${serviceClassName}],
})
export class ${className} {}
`;
  
  fs.writeFileSync(path.join(moduleDir, `${moduleName}.module.ts`), moduleCode);
  console.log(`✓ Created ${moduleName} module\n`);
}

console.log('🚀 Starting comprehensive Express to NestJS migration...\n');

for (const [serviceName, moduleName] of Object.entries(serviceModuleMap)) {
  console.log(`📦 Migrating ${serviceName} → ${moduleName}...`);
  createModule(serviceName, moduleName);
}

console.log('\n✅ Migration complete!');
console.log('\n📝 Next steps:');
console.log('1. Create proper DTOs for each module');
console.log('2. Update AppModule to import all modules');
console.log('3. Install @nestjs/event-emitter and configure it');
console.log('4. Review and test each module');
