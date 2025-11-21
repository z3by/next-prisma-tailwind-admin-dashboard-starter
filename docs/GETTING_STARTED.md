# Getting Started Guide

This guide will help you get the Next.js Admin Dashboard up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

### Optional Tools

- **Prisma Studio** for database management (included with Prisma)
- **VS Code** with recommended extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd next-prisma-tailwind-admin-dashboard-starter
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, Tailwind CSS, and development tools.

### 3. Set Up Environment Variables

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database URL (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/admin_dashboard?schema=public"

# NextAuth.js Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-here"

# Application URL
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

**Generate a secure NextAuth secret:**

```bash
openssl rand -base64 32
```

### 4. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create a new database
createdb admin_dashboard

# Or use psql
psql -U postgres
CREATE DATABASE admin_dashboard;
\q
```

#### Option B: Docker PostgreSQL

If you prefer Docker:

```bash
docker run --name postgres-admin \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=admin_dashboard \
  -p 5432:5432 \
  -d postgres:15
```

### 5. Run Database Migrations

Generate Prisma Client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

This will:

- Generate the Prisma Client
- Create all necessary tables in your database
- Set up the schema

### 6. (Optional) Seed the Database

Add sample data for development:

```bash
npm run db:seed
```

### 7. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Verifying the Installation

### Check Database Connection

Open Prisma Studio to verify the database connection:

```bash
npm run db:studio
```

This opens a browser interface at [http://localhost:5555](http://localhost:5555) where you can:

- View all tables
- Browse data
- Add/edit records manually

### Run Tests

Verify everything is working by running tests:

```bash
npm run test
```

### Check Code Quality

Run linting and type checking:

```bash
npm run check
```

This runs:

- Prettier (code formatting check)
- ESLint (linting)
- TypeScript (type checking)

## Common Commands

### Development

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
```

### Database

```bash
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database
npm run db:reset         # Reset database (DANGER!)
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check formatting
npm run type-check       # TypeScript type check
npm run check            # Run all checks
```

### Testing

```bash
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

## Project Structure

```
├── app/                    # Next.js App Router
├── core/                   # Core business logic
│   ├── domain/            # Domain entities and logic
│   ├── application/       # Use cases
│   └── infrastructure/    # Technical implementation
├── components/            # React components
├── lib/                   # Shared utilities
├── prisma/                # Prisma schema and migrations
├── docs/                  # Documentation
└── types/                 # TypeScript types
```

## Next Steps

### 1. Understand the Architecture

Read the architecture documentation:

```bash
cat docs/ARCHITECTURE.md
```

Key concepts:

- **Clean Architecture**: Separation of concerns
- **Domain-Driven Design**: Business logic in the domain layer
- **Repository Pattern**: Data access abstraction

### 2. Explore the Domain Layer

Look at the domain entities and value objects:

- `core/domain/entities/user.entity.ts` - User business logic
- `core/domain/value-objects/email.ts` - Email validation
- `core/domain/value-objects/password.ts` - Password validation

### 3. Review Use Cases

Check out the application use cases:

- `core/application/use-cases/create-user.use-case.ts`
- `core/application/use-cases/get-user.use-case.ts`
- `core/application/use-cases/list-users.use-case.ts`

### 4. Add Your First Feature

Follow this process to add a new feature:

1. **Domain Layer**: Create entities, value objects, repository interface
2. **Application Layer**: Create use case
3. **Infrastructure Layer**: Implement repository
4. **Presentation Layer**: Create API route or page

Example: Adding a "Profile" feature:

```bash
# 1. Create domain entity
touch core/domain/entities/profile.entity.ts

# 2. Create use case
touch core/application/use-cases/update-profile.use-case.ts

# 3. Create API route
touch app/api/profile/route.ts

# 4. Create UI page
touch app/(dashboard)/profile/page.tsx
```

## Troubleshooting

### Database Connection Issues

**Problem**: `Can't reach database server`

**Solution**:

1. Check PostgreSQL is running: `pg_isready`
2. Verify DATABASE_URL in `.env`
3. Check PostgreSQL logs

### Port Already in Use

**Problem**: `Port 3000 is already in use`

**Solution**:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Prisma Client Not Generated

**Problem**: `Cannot find module '@prisma/client'`

**Solution**:

```bash
npm run db:generate
```

### Migration Errors

**Problem**: `Migration failed to apply`

**Solution**:

```bash
# Reset database (DANGER: deletes all data)
npm run db:reset

# Or manually fix and rerun
npx prisma migrate resolve --applied <migration-name>
npm run db:migrate
```

### TypeScript Errors

**Problem**: `Type 'X' is not assignable to type 'Y'`

**Solution**:

1. Run `npm run type-check` to see all errors
2. Check for missing type definitions
3. Verify import paths are correct

## Development Tips

### Hot Reload Not Working

If changes aren't reflected:

1. Restart the dev server
2. Clear Next.js cache: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

### Database Schema Changes

When modifying the Prisma schema:

```bash
# 1. Update schema.prisma
# 2. Create migration
npm run db:migrate

# 3. If needed, create a custom migration
npx prisma migrate dev --create-only
# Edit the migration file
npx prisma migrate dev
```

### Debugging

Use VS Code debugger:

1. Set breakpoints in your code
2. Press F5 or use Debug panel
3. Choose "Next.js: debug server-side" or "Next.js: debug client-side"

### Performance Monitoring

Use Next.js built-in tools:

```bash
# Development
npm run dev -- --turbo  # Enable Turbopack (experimental)

# Production
npm run build
npm run start
```

## Getting Help

- **Documentation**: Check `docs/` directory
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Examples**: See example use cases in `core/application/use-cases/`

## What's Next?

1. ✅ **Complete Setup**: You're done with basic setup!
2. 📚 **Read Documentation**: Explore `docs/ARCHITECTURE.md`
3. 🎨 **Customize Theme**: Modify `tailwind.config.ts`
4. 🔐 **Set Up Auth**: Implement login/register pages
5. 👥 **Build User Management**: Create admin dashboard
6. 🧪 **Write Tests**: Add tests for your features

Happy coding! 🚀
