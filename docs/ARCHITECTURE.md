# Architecture Documentation

## Table of Contents

- [Overview](#overview)
- [Clean Architecture](#clean-architecture)
- [Domain-Driven Design](#domain-driven-design)
- [Layer Responsibilities](#layer-responsibilities)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Best Practices](#best-practices)

## Overview

This project implements **Clean Architecture** with **Domain-Driven Design (DDD)** principles. The architecture is designed to be:

- **Independent of frameworks**: Business logic doesn't depend on Next.js, Prisma, or any external library
- **Testable**: Business logic can be tested without UI, database, or external services
- **Independent of database**: Can switch from PostgreSQL to MySQL, MongoDB, etc. without changing business logic
- **Independent of UI**: Can change from Next.js to another framework without touching business logic
- **Maintainable**: Clear separation of concerns makes code easy to understand and modify

## Clean Architecture

### The Four Layers

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Presentation Layer (app/)                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Next.js Pages, API Routes, React Components        │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓ ↑                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Application Layer (core/application/)               │    │
│  │  ┌───────────────────────────────────────────────┐  │    │
│  │  │  Use Cases, DTOs, Application Services        │  │    │
│  │  └───────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓ ↑                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Domain Layer (core/domain/)                         │    │
│  │  ┌───────────────────────────────────────────────┐  │    │
│  │  │  Entities, Value Objects, Domain Logic        │  │    │
│  │  └───────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ↓ ↑                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Infrastructure Layer (core/infrastructure/)         │    │
│  │  ┌───────────────────────────────────────────────┐  │    │
│  │  │  Repositories, Database, External Services    │  │    │
│  │  └───────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Rule

**Dependencies point inward**: Outer layers depend on inner layers, but inner layers never depend on outer layers.

- ✅ **Domain** has no dependencies
- ✅ **Application** depends on Domain
- ✅ **Infrastructure** depends on Domain and Application
- ✅ **Presentation** depends on Application and Infrastructure

## Domain-Driven Design

### Building Blocks

#### 1. Entities

Entities are objects with identity that persist over time. They contain business logic and behavior.

**Example: User Entity**

```typescript
// core/domain/entities/user.entity.ts
export class User {
  private props: UserProps;

  // Business methods
  changePassword(newPassword: Password): void {
    /* ... */
  }
  verifyEmail(): void {
    /* ... */
  }
  suspend(): void {
    /* ... */
  }

  // Validation logic
  isActive(): boolean {
    /* ... */
  }
  canPerformAdminActions(): boolean {
    /* ... */
  }
}
```

**Key Characteristics:**

- Has unique identifier (`id`)
- Contains business logic
- Encapsulates state changes
- Validates invariants
- Self-contained

#### 2. Value Objects

Value Objects are immutable objects that represent concepts with no identity.

**Example: Email Value Object**

```typescript
// core/domain/value-objects/email.ts
export class Email {
  private readonly value: string;

  static create(email: string): Email {
    // Validation logic
    if (!this.isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }
    return new Email(email.toLowerCase());
  }

  getValue(): string {
    return this.value;
  }
}
```

**Key Characteristics:**

- Immutable (cannot be changed after creation)
- No identity (two emails with same value are equal)
- Self-validating
- Encapsulates validation rules

#### 3. Repositories

Repositories abstract data persistence, providing a collection-like interface.

**Example: User Repository Interface**

```typescript
// core/domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  // ... other methods
}
```

**Key Characteristics:**

- Interface in Domain layer
- Implementation in Infrastructure layer
- Hides persistence details
- Returns domain entities

#### 4. Domain Events

Domain Events represent something that happened in the domain.

**Example: UserCreated Event**

```typescript
// core/domain/events/user-created.event.ts
export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly occurredOn: Date
  ) {}
}
```

## Layer Responsibilities

### 1. Domain Layer (`core/domain/`)

**Purpose**: Contains pure business logic and rules.

**Contents**:

- **Entities** (`entities/`): Business objects with identity
- **Value Objects** (`value-objects/`): Immutable validated objects
- **Repository Interfaces** (`repositories/`): Data access contracts
- **Domain Errors** (`errors/`): Business exceptions
- **Domain Events** (`events/`): Business occurrences

**Rules**:

- ❌ No dependencies on other layers
- ❌ No framework dependencies
- ❌ No external library dependencies (except utilities)
- ✅ Contains only business logic
- ✅ Framework-agnostic
- ✅ Fully testable in isolation

**Example Structure**:

```
core/domain/
├── entities/
│   └── user.entity.ts
├── value-objects/
│   ├── email.ts
│   └── password.ts
├── repositories/
│   └── user.repository.interface.ts
└── errors/
    └── domain-error.ts
```

### 2. Application Layer (`core/application/`)

**Purpose**: Orchestrates domain objects to perform use cases.

**Contents**:

- **Use Cases** (`use-cases/`): Application-specific business rules
- **DTOs** (`dtos/`): Data transfer objects for boundaries
- **Ports** (`ports/`): Interfaces for external services

**Rules**:

- ✅ Depends on Domain layer
- ❌ No direct dependencies on frameworks
- ✅ Coordinates domain objects
- ✅ Handles transactions
- ✅ Transforms data between layers

**Example Structure**:

```
core/application/
├── use-cases/
│   ├── create-user.use-case.ts
│   ├── get-user.use-case.ts
│   ├── update-user.use-case.ts
│   └── delete-user.use-case.ts
├── dtos/
│   └── user.dto.ts
└── ports/
    └── email.service.interface.ts
```

**Use Case Example**:

```typescript
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // 1. Validate input and create value objects
    const email = Email.create(dto.email);
    const password = await Password.create(dto.password);

    // 2. Check business rules
    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      throw new ConflictError('Email already exists');
    }

    // 3. Create entity
    const user = User.create({ email, password /* ... */ });

    // 4. Persist
    const savedUser = await this.userRepository.save(user);

    // 5. Return DTO
    return this.toDto(savedUser);
  }
}
```

### 3. Infrastructure Layer (`core/infrastructure/`)

**Purpose**: Implements technical concerns and external dependencies.

**Contents**:

- **Repository Implementations** (`repositories/`): Concrete data access
- **Database Setup** (`database/`): Prisma client, connections
- **External Services** (`services/`): Email, file storage, etc.

**Rules**:

- ✅ Implements Domain interfaces
- ✅ Contains framework-specific code
- ✅ Handles technical details
- ❌ No business logic

**Example Structure**:

```
core/infrastructure/
├── database/
│   └── prisma.ts
├── repositories/
│   └── prisma-user.repository.ts
└── services/
    └── email.service.ts
```

**Repository Implementation Example**:

```typescript
export class PrismaUserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    const data = user.toPersistence();
    const created = await prisma.user.create({ data });
    return this.toDomain(created);
  }

  private toDomain(prismaUser: any): User {
    return User.fromPersistence({
      id: prismaUser.id,
      email: Email.create(prismaUser.email),
      password: Password.fromHash(prismaUser.password),
      // ... other fields
    });
  }
}
```

### 4. Presentation Layer (`app/`)

**Purpose**: Handles HTTP requests, renders UI, and user interactions.

**Contents**:

- **Pages** (`app/`): Next.js route handlers
- **API Routes** (`app/api/`): RESTful endpoints
- **Components** (`components/`): React UI components
- **Layouts** (`components/layouts/`): Page layouts

**Rules**:

- ✅ Depends on Application layer
- ✅ Handles HTTP concerns
- ✅ Validates input
- ✅ Transforms DTOs to UI models
- ❌ No business logic

**Example API Route**:

```typescript
// app/api/users/route.ts
export async function POST(request: Request) {
  try {
    // 1. Parse and validate input
    const body = await request.json();

    // 2. Call use case
    const userRepository = new PrismaUserRepository();
    const createUser = new CreateUserUseCase(userRepository);
    const user = await createUser.execute(body);

    // 3. Return response
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    // 4. Handle errors
    return handleError(error);
  }
}
```

## Data Flow

### Request Flow (Top to Bottom)

```
User Request
    ↓
Presentation Layer (API Route / Page)
    ↓
Application Layer (Use Case)
    ↓
Domain Layer (Entity / Value Object)
    ↓
Infrastructure Layer (Repository)
    ↓
Database
```

### Response Flow (Bottom to Top)

```
Database
    ↓
Infrastructure Layer (Repository → Entity)
    ↓
Application Layer (Entity → DTO)
    ↓
Presentation Layer (DTO → JSON)
    ↓
User Response
```

### Example: Create User Flow

```typescript
// 1. PRESENTATION LAYER
// app/api/users/route.ts
POST /api/users
  ↓
  Parse JSON body
  ↓
// 2. APPLICATION LAYER
// core/application/use-cases/create-user.use-case.ts
CreateUserUseCase.execute(dto)
  ↓
  Validate email & password (creates Value Objects)
  ↓
  Check if email exists (via Repository)
  ↓
// 3. DOMAIN LAYER
// core/domain/entities/user.entity.ts
User.create(props) → new User entity
  ↓
// 4. INFRASTRUCTURE LAYER
// core/infrastructure/repositories/prisma-user.repository.ts
UserRepository.save(user)
  ↓
  prisma.user.create(data)
  ↓
  Convert Prisma model → Domain entity
  ↓
// RESPONSE FLOW
  Return User entity
  ↓
  Convert to DTO
  ↓
  Return JSON response
```

## Design Patterns

### 1. Repository Pattern

**Purpose**: Abstracts data persistence logic.

**Benefits**:

- Database-agnostic domain layer
- Easy to switch databases
- Simplifies testing
- Encapsulates query logic

**Implementation**:

```typescript
// Interface (Domain)
interface IUserRepository {
  save(user: User): Promise<User>;
}

// Implementation (Infrastructure)
class PrismaUserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    /* ... */
  }
}
```

### 2. Use Case Pattern

**Purpose**: Encapsulates application-specific business rules.

**Benefits**:

- Single responsibility
- Easy to understand
- Reusable
- Testable

**Implementation**:

```typescript
class CreateUserUseCase {
  constructor(private repo: IUserRepository) {}
  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    /* ... */
  }
}
```

### 3. Value Object Pattern

**Purpose**: Represents concepts without identity.

**Benefits**:

- Immutability
- Self-validation
- Type safety
- Reusability

**Implementation**:

```typescript
class Email {
  private constructor(private value: string) {}

  static create(email: string): Email {
    if (!this.isValid(email)) throw new ValidationError();
    return new Email(email.toLowerCase());
  }
}
```

### 4. DTO Pattern

**Purpose**: Transfers data between layers.

**Benefits**:

- Decouples layers
- Prevents leaking domain models
- Allows different representations
- Simplifies serialization

**Implementation**:

```typescript
interface CreateUserDto {
  email: string;
  password: string;
}

interface UserResponseDto {
  id: string;
  email: string;
  // ... no sensitive data
}
```

## Best Practices

### 1. Dependency Injection

**Always inject dependencies** rather than creating them:

```typescript
// ❌ BAD
class CreateUserUseCase {
  execute() {
    const repo = new PrismaUserRepository(); // Hard dependency
  }
}

// ✅ GOOD
class CreateUserUseCase {
  constructor(private readonly repo: IUserRepository) {} // Injected
}
```

### 2. Return DTOs, Not Entities

**Never expose domain entities** to the presentation layer:

```typescript
// ❌ BAD
async function execute(): Promise<User> {
  return user; // Exposes entity
}

// ✅ GOOD
async function execute(): Promise<UserResponseDto> {
  return this.toDto(user); // Returns DTO
}
```

### 3. Validate at Boundaries

**Validate input** at system boundaries:

```typescript
// Value Objects validate on creation
const email = Email.create(input.email); // Throws if invalid

// DTOs can use Zod schemas
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### 4. Keep Domain Pure

**Domain layer should have zero dependencies**:

```typescript
// ❌ BAD
import { NextRequest } from 'next/server'; // Framework dependency

// ✅ GOOD
// No imports from frameworks or external libraries
```

### 5. Single Responsibility

**Each class/function should do one thing**:

```typescript
// ✅ One use case per class
class CreateUserUseCase {
  /* ... */
}
class UpdateUserUseCase {
  /* ... */
}
class DeleteUserUseCase {
  /* ... */
}

// ❌ Avoid god classes
class UserService {
  createUser() {}
  updateUser() {}
  deleteUser() {}
  // ... 20 more methods
}
```

### 6. Immutability

**Use immutable objects where possible**:

```typescript
// ✅ Value Objects are immutable
class Email {
  private readonly value: string; // Cannot be changed
}

// ✅ Create new instances for changes
const newEmail = Email.create('new@email.com');
```

### 7. Explicit Over Implicit

**Be explicit about behavior**:

```typescript
// ❌ Implicit
user.status = 'ACTIVE';

// ✅ Explicit
user.activate();
```

### 8. Fail Fast

**Validate early and throw descriptive errors**:

```typescript
if (!email) {
  throw new ValidationError('Email is required');
}

if (emailExists) {
  throw new ConflictError('Email already exists');
}
```

## Testing Strategy

### Domain Layer Tests

Test entities and value objects in isolation:

```typescript
describe('User Entity', () => {
  it('should create user with valid data', () => {
    const user = User.create({
      /* valid data */
    });
    expect(user).toBeDefined();
  });

  it('should throw error for invalid email', () => {
    expect(() => Email.create('invalid')).toThrow(ValidationError);
  });
});
```

### Application Layer Tests

Test use cases with mocked repositories:

```typescript
describe('CreateUserUseCase', () => {
  it('should create user successfully', async () => {
    const mockRepo = {
      save: jest.fn(),
      emailExists: jest.fn().mockResolvedValue(false),
    };

    const useCase = new CreateUserUseCase(mockRepo);
    await useCase.execute({
      /* data */
    });

    expect(mockRepo.save).toHaveBeenCalled();
  });
});
```

### Infrastructure Layer Tests

Test repositories with real database (integration tests):

```typescript
describe('PrismaUserRepository', () => {
  it('should save user to database', async () => {
    const repo = new PrismaUserRepository();
    const user = User.create({
      /* data */
    });

    const saved = await repo.save(user);

    expect(saved.id).toBeDefined();
  });
});
```

## Conclusion

This architecture provides:

- ✅ **Separation of Concerns**: Each layer has clear responsibilities
- ✅ **Testability**: Business logic can be tested without frameworks
- ✅ **Flexibility**: Easy to change databases, frameworks, or UI
- ✅ **Maintainability**: Clear structure makes code easy to understand
- ✅ **Scalability**: Can grow without becoming messy
- ✅ **Best Practices**: Follows SOLID, DDD, and Clean Architecture principles

By following these principles, the codebase remains clean, maintainable, and adaptable to changing requirements.
