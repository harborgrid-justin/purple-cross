const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '..', 'backend', 'src', 'controllers');

// Get all controller files
const files = fs.readdirSync(controllersDir).filter((file) => file.endsWith('.controller.ts'));

files.forEach((file) => {
  const filePath = path.join(controllersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add Promise<void> return type to async controller methods
  // Pattern: async methodName(req: Request, res: Response) {
  content = content.replace(
    /async\s+(\w+)\s*\(\s*req:\s*Request\s*,\s*res:\s*Response\s*\)\s*{/g,
    'async $1(req: Request, res: Response): Promise<void> {'
  );

  // Also handle methods with NextFunction
  content = content.replace(
    /async\s+(\w+)\s*\(\s*req:\s*Request\s*,\s*res:\s*Response\s*,\s*next:\s*NextFunction\s*\)\s*{/g,
    'async $1(req: Request, res: Response, next: NextFunction): Promise<void> {'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Fixed ${file}`);
});

console.log(`\n✅ Fixed ${files.length} controller files`);
