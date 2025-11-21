# Next.js Admin Dashboard Starter 🚀

A production-ready, enterprise-grade admin dashboard starter built with **Next.js 15**, **Prisma**, **Tailwind CSS**, and **Clean Architecture** principles. This starter provides a solid foundation for building scalable admin dashboards with secure authentication, user management, and best practices baked in.

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🏗️ Architecture & Code Quality
- **Clean Architecture** with clear separation of concerns (Domain, Application, Infrastructure)
- **Domain-Driven Design (DDD)** principles
- **SOLID principles** throughout the codebase
- **TypeScript** with strict mode for type safety
- **Repository Pattern** for data access abstraction
- **Value Objects** for domain validation
- **Use Cases** for business logic encapsulation

### 🔐 Authentication & Security
- **NextAuth.js v5** for secure authentication
- **Password hashing** with bcrypt (configurable salt rounds)
- **Role-Based Access Control (RBAC)** with USER, ADMIN, and SUPER_ADMIN roles
- **Email verification** support
- **Session management** with secure cookies
- **Type-safe environment variables** with validation

### 👥 User Management
- Complete CRUD operations for users
- User status management (Active, Inactive, Suspended)
- Role assignment and management
- Profile management
- Password change functionality
- Email verification flow

### 🎨 UI & Styling
- **Tailwind CSS** for utility-first styling
- **Custom theme** support with CSS variables
- **Dark mode** ready (infrastructure in place)
- **Responsive design** out of the box
- **shadcn/ui** compatible structure
- **Lucide Icons** for consistent iconography

### 📦 Database
- **Prisma ORM** for type-safe database access
- **PostgreSQL** as default database (easily switchable)
- **Migration system** for version control
- **Seed data** for development
- **Connection pooling** configured

### 🧪 Testing (Structure Ready)
- **Vitest** for unit testing
- **Testing Library** for component testing
- Test structure following clean architecture layers
- Domain entity and value object tests
- Use case tests
- Integration test setup

### 🛠️ Developer Experience
- **Hot Module Replacement** with Fast Refresh
- **ESLint** configuration with Next.js rules
- **Prettier** with Tailwind CSS plugin
- **Husky** for git hooks (optional)
- **TypeScript path aliases** for cleaner imports
- **Comprehensive documentation**

## 📁 Project Structure

```
.
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                  # Authentication routes
│   ├── (dashboard)/             # Dashboard routes
│   ├── api/                     # API routes
│   └── layout.tsx               # Root layout
│
├── core/                        # Core business logic (Clean Architecture)
│   ├── domain/                  # Domain Layer
│   │   ├── entities/           # Business entities (User, etc.)
│   │   ├── value-objects/      # Value objects (Email, Password)
│   │   ├── repositories/       # Repository interfaces
│   │   └── errors/             # Domain errors
│   │
│   ├── application/            # Application Layer
│   │   ├── use-cases/          # Use cases (CreateUser, etc.)
│   │   ├── dtos/               # Data Transfer Objects
│   │   └── ports/              # Port interfaces
│   │
│   └── infrastructure/         # Infrastructure Layer
│       ├── database/           # Database setup (Prisma client)
│       ├── repositories/       # Repository implementations
│       └── services/           # External services
│
├── components/                  # React components
│   ├── ui/                     # Base UI components
│   ├── features/               # Feature-specific components
│   └── layouts/                # Layout components
│
├── lib/                        # Shared utilities
│   ├── utils/                  # Helper functions
│   ├── validations/            # Zod schemas
│   ├── constants/              # App constants
│   └── env.ts                  # Environment configuration
│
├── prisma/                     # Prisma schema and migrations
│   └── schema.prisma           # Database schema
│
├── types/                      # TypeScript type definitions
│
└── docs/                       # Documentation
    ├── PROJECT_PLAN.md         # Detailed project plan
    └── ARCHITECTURE.md         # Architecture documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** 14.x or higher (or Docker)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd next-prisma-tailwind-admin-dashboard-starter
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and configure your database connection:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database (dangerous!)

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

## 🏛️ Architecture Overview

This project follows **Clean Architecture** principles with clear separation between layers:

### Domain Layer (Core Business Logic)
- **Entities**: Encapsulate business rules (e.g., `User`)
- **Value Objects**: Immutable objects with validation (e.g., `Email`, `Password`)
- **Repository Interfaces**: Define data access contracts
- **Domain Errors**: Business-specific exceptions

### Application Layer (Use Cases)
- **Use Cases**: Orchestrate business logic (e.g., `CreateUserUseCase`)
- **DTOs**: Data transfer between layers
- **Ports**: Interfaces for external services

### Infrastructure Layer (Technical Details)
- **Repository Implementations**: Concrete data access (e.g., `PrismaUserRepository`)
- **Database Configuration**: Prisma client setup
- **External Services**: Third-party integrations

### Presentation Layer (Next.js App)
- **Pages**: Next.js route handlers
- **Components**: React UI components
- **API Routes**: RESTful endpoints

## 🔒 Security Best Practices

This starter implements enterprise-grade security:

- ✅ **Password hashing** with bcrypt (12 salt rounds)
- ✅ **Password validation** (min 8 chars, uppercase, lowercase, number, special char)
- ✅ **SQL injection protection** via Prisma parameterized queries
- ✅ **XSS protection** via React's built-in escaping
- ✅ **CSRF protection** via NextAuth.js
- ✅ **Type-safe environment variables** with runtime validation
- ✅ **Session security** with HTTP-only cookies
- ✅ **Role-based access control** for authorization
- ✅ **Rate limiting** ready (implementation in progress)

## 🎨 Styling & Theming

### Tailwind CSS Configuration

The project uses Tailwind CSS with a custom configuration:

- **Custom color palette** (easily customizable)
- **Dark mode support** with CSS variables
- **Consistent spacing** system
- **Typography** scale
- **Responsive breakpoints**

### Adding Custom Themes

Edit `tailwind.config.ts` to customize your theme:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary colors
      },
      secondary: {
        // Your secondary colors
      },
    },
  },
}
```

## 🗄️ Database

### Default Database: PostgreSQL

The starter uses PostgreSQL by default, but can be easily switched to:
- MySQL
- SQLite
- SQL Server
- MongoDB (with Prisma connector)
- CockroachDB

### Changing Database Provider

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"  // or "sqlite", "sqlserver", etc.
  url      = env("DATABASE_URL")
}
```

2. Update connection string in `.env`
3. Run migrations: `npx prisma migrate dev`

### Prisma Studio

View and edit your data in the browser:

```bash
npx prisma studio
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test user.entity.test.ts

# Run with coverage
npm run test:coverage
```

### Testing Philosophy

- **Domain entities** and **value objects** have unit tests
- **Use cases** have integration tests
- **API routes** have end-to-end tests
- Mock external dependencies, not internal ones

## 📖 Documentation

For more detailed information, see:

- [Project Plan](./docs/PROJECT_PLAN.md) - Detailed roadmap and features
- [Architecture Guide](./docs/ARCHITECTURE.md) - Deep dive into architecture
- [API Documentation](./docs/API.md) - API endpoints and usage
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute

## 🛣️ Roadmap

See [PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) for the detailed roadmap.

**Upcoming Features:**
- [ ] Complete authentication UI (login, register, password reset)
- [ ] User management dashboard
- [ ] Role management UI
- [ ] Audit logging
- [ ] Email notifications
- [ ] File upload support
- [ ] Advanced search and filters
- [ ] Export functionality (CSV, PDF)
- [ ] API documentation with Swagger
- [ ] Comprehensive E2E tests

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components

## 📬 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/repo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/repo/discussions)

---

**Made with ❤️ for the developer community**

*Star ⭐ this repository if you find it helpful!*
