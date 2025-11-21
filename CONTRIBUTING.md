# Contributing to Next.js Admin Dashboard Starter

Thank you for considering contributing to this project! We welcome contributions from everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Architecture Guidelines](#architecture-guidelines)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

1. **Fork the repository**

2. **Clone your fork**
```bash
git clone https://github.com/your-username/next-prisma-tailwind-admin-dashboard-starter.git
cd next-prisma-tailwind-admin-dashboard-starter
```

3. **Install dependencies**
```bash
npm install
```

4. **Set up environment variables**
```bash
cp .env.example .env
```

5. **Set up the database**
```bash
npx prisma migrate dev
```

6. **Run the development server**
```bash
npm run dev
```

## Development Workflow

1. **Create a new branch** for your feature or bug fix:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

2. **Make your changes** following our coding standards

3. **Test your changes**:
```bash
npm run test
npm run lint
npm run type-check
```

4. **Commit your changes** with a descriptive message:
```bash
git commit -m "feat: add user profile page"
```

5. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request** from your fork to our `main` branch

## Architecture Guidelines

This project follows **Clean Architecture** and **Domain-Driven Design** principles. Please adhere to these guidelines:

### Layer Structure

```
core/
├── domain/          # Business logic (no dependencies)
├── application/     # Use cases (depends on domain)
└── infrastructure/  # Technical implementation (depends on domain & application)
```

### Key Principles

1. **Dependencies flow inward**: Domain has no dependencies, Application depends on Domain, Infrastructure implements Domain interfaces

2. **Domain Layer**:
   - Pure business logic
   - No framework dependencies
   - Entities, Value Objects, Repository interfaces
   - Domain errors

3. **Application Layer**:
   - Use Cases (one per business operation)
   - DTOs for data transfer
   - Port interfaces for external services

4. **Infrastructure Layer**:
   - Repository implementations (Prisma)
   - External service integrations
   - Database configuration

### Adding New Features

When adding a new feature, follow this order:

1. **Domain Layer**: Create entities, value objects, repository interfaces
2. **Application Layer**: Create use cases and DTOs
3. **Infrastructure Layer**: Implement repositories
4. **Presentation Layer**: Create API routes and UI components

## Coding Standards

### TypeScript

- Use **strict mode**
- Prefer **interfaces** over types for public APIs
- Use **explicit return types** for functions
- Avoid `any` - use `unknown` if type is truly unknown

### Naming Conventions

- **Files**: `kebab-case.ts` (e.g., `user-repository.ts`)
- **Classes**: `PascalCase` (e.g., `UserRepository`)
- **Interfaces**: `PascalCase` with `I` prefix (e.g., `IUserRepository`)
- **Functions/Variables**: `camelCase` (e.g., `getUserById`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_LOGIN_ATTEMPTS`)

### Code Organization

- One class per file
- Group related files in directories
- Use barrel exports (`index.ts`) for public APIs
- Keep files under 300 lines

### Comments

- Write self-documenting code
- Add JSDoc comments for public APIs
- Explain "why", not "what"
- Keep comments up-to-date

Example:
```typescript
/**
 * Creates a new user in the system
 * @param dto - User creation data
 * @returns Created user
 * @throws ConflictError if email already exists
 */
async execute(dto: CreateUserDto): Promise<UserResponseDto> {
  // Implementation
}
```

## Testing Guidelines

### Test Structure

- **Unit Tests**: Test domain entities, value objects, and use cases in isolation
- **Integration Tests**: Test repositories with real database
- **E2E Tests**: Test complete user flows

### Test Files

- Place test files next to source files: `user.entity.test.ts`
- Use descriptive test names: `it('should throw error when email is invalid')`

### Test Coverage

- Aim for **>80% coverage**
- All domain entities must have tests
- All use cases must have happy and unhappy path tests

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { Email } from './email';
import { ValidationError } from '../errors/domain-error';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create email with valid address', () => {
      const email = Email.create('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should throw ValidationError for invalid email', () => {
      expect(() => Email.create('invalid-email')).toThrow(ValidationError);
    });

    it('should normalize email to lowercase', () => {
      const email = Email.create('TEST@EXAMPLE.COM');
      expect(email.getValue()).toBe('test@example.com');
    });
  });
});
```

## Pull Request Process

1. **Update documentation** if you're changing functionality

2. **Add tests** for new features

3. **Ensure all checks pass**:
   - Tests pass
   - Linter passes
   - Type check passes
   - Build succeeds

4. **Update CHANGELOG.md** with your changes

5. **Request review** from maintainers

6. **Address review comments** if any

7. **Squash commits** if requested before merging

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console.log or debugging code
- [ ] Linter and type checks pass
- [ ] Commit messages follow guidelines
- [ ] PR description explains what and why

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(auth): add password reset functionality

Implement password reset flow with email verification
and token generation. Includes use cases, repository
methods, and API endpoints.

Closes #123
```

```bash
fix(user): correct email validation regex

The previous regex didn't handle plus signs in email
addresses correctly. Updated to support RFC 5322 format.
```

```bash
docs(readme): add installation instructions

Added step-by-step setup guide for new contributors
including database setup and environment configuration.
```

## Questions?

If you have questions or need help, feel free to:

- Open an issue with the `question` label
- Start a discussion in GitHub Discussions
- Contact the maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉

