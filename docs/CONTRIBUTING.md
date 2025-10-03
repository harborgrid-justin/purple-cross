# Contributing to Purple Cross

Thank you for considering contributing to Purple Cross! This document outlines the process and guidelines for contributing to the project.

## Code of Conduct

We expect all contributors to:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

Before creating a bug report, please:
1. Check if the issue has already been reported
2. Ensure you're using the latest version
3. Check the documentation to confirm it's actually a bug

When creating a bug report, include:
- Clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:
- Use a clear, descriptive title
- Provide detailed description of the proposed feature
- Explain why this enhancement would be useful
- Include mockups or examples if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `master`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Ensure CI passes** (linting, tests, build)
6. **Submit a pull request** with a clear description

#### Pull Request Process

1. Update the README.md or documentation with details of changes if applicable
2. Update tests to cover your changes
3. Ensure all tests pass
4. Update the CHANGELOG.md (if applicable)
5. Your PR will be reviewed by maintainers
6. Address any review comments
7. Once approved, a maintainer will merge your PR

## Development Setup

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development setup instructions.

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Avoid `any` types - use proper typing
- Use interfaces for object shapes
- Use enums for constant values
- Document complex types with JSDoc comments

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  role: UserRole;
}

// ❌ Bad
const user: any = { id: '123', email: 'test@example.com' };
```

### File Naming

- Use kebab-case for file names: `patient-service.ts`
- Use PascalCase for component files: `PatientList.tsx`
- Use camelCase for utility files: `dateHelpers.ts`

### Code Style

We use ESLint and Prettier for code formatting. Run before committing:

```bash
npm run lint:fix
npm run format
```

#### Backend Guidelines

- One class per file
- Services contain business logic
- Controllers handle HTTP requests/responses
- Repositories handle database operations
- Use dependency injection where applicable
- Handle errors with proper error classes
- Always validate input data

```typescript
// ✅ Good
export class PatientService {
  async createPatient(data: CreatePatientDto) {
    this.validatePatientData(data);
    return prisma.patient.create({ data });
  }
}

// ❌ Bad
export function createPatient(data: any) {
  return prisma.patient.create({ data });
}
```

#### Frontend Guidelines

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper TypeScript types for props
- Handle loading and error states
- Use CSS modules or styled-components

```typescript
// ✅ Good
interface PatientListProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, onSelect }) => {
  return (
    <div>
      {patients.map(patient => (
        <div key={patient.id} onClick={() => onSelect(patient)}>
          {patient.name}
        </div>
      ))}
    </div>
  );
};

// ❌ Bad
export function PatientList(props: any) {
  return <div>{props.patients.map(p => <div>{p.name}</div>)}</div>;
}
```

### Git Commit Messages

Follow conventional commit format:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(patients): add patient search functionality

Add search bar component that filters patients by name, species, or owner.
Includes debouncing to improve performance.

Closes #123
```

```
fix(api): correct patient age calculation

The age calculation was off by one year due to timezone handling.
Now uses UTC for consistent results.

Fixes #456
```

### Testing

- Write tests for new features
- Maintain test coverage above 70%
- Test edge cases and error conditions
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

```typescript
describe('PatientService', () => {
  describe('createPatient', () => {
    it('should create a patient with valid data', async () => {
      // Arrange
      const patientData = { name: 'Max', species: 'Dog', ownerId: '123' };
      
      // Act
      const result = await patientService.createPatient(patientData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe('Max');
    });

    it('should throw error when owner does not exist', async () => {
      // Arrange
      const patientData = { name: 'Max', species: 'Dog', ownerId: 'invalid' };
      
      // Act & Assert
      await expect(patientService.createPatient(patientData))
        .rejects.toThrow('Owner not found');
    });
  });
});
```

### Documentation

- Document all public APIs
- Use JSDoc for functions and classes
- Keep README.md up to date
- Add inline comments for complex logic
- Update CHANGELOG.md for significant changes

```typescript
/**
 * Creates a new patient record
 * 
 * @param data - Patient creation data
 * @returns Created patient with assigned ID
 * @throws {AppError} When owner is not found
 * 
 * @example
 * ```typescript
 * const patient = await createPatient({
 *   name: 'Max',
 *   species: 'Dog',
 *   ownerId: '123'
 * });
 * ```
 */
async createPatient(data: CreatePatientDto): Promise<Patient> {
  // Implementation
}
```

## Review Process

All submissions require review. We use GitHub pull requests for this purpose.

### Review Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass and coverage is maintained
- [ ] Documentation is updated
- [ ] No console.log or debugging code
- [ ] Error handling is appropriate
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Backwards compatibility maintained

## Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Run full test suite
5. Create GitHub release
6. Deploy to staging
7. Deploy to production

## Questions?

- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for development setup
- Open a GitHub Discussion for questions
- Join our community chat (if applicable)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
