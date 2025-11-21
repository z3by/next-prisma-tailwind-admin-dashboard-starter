# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ running
- Git installed

## Setup Steps

### 1. Install Dependencies (30 seconds)

```bash
npm install
```

### 2. Configure Environment (1 minute)

```bash
# Copy example env file
cp .env.example .env

# Generate secret
openssl rand -base64 32

# Edit .env with your database URL and secret
vim .env
```

**Minimum required**:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/admin_dashboard"
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Set Up Database (1 minute)

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed data
npm run db:seed
```

### 4. Start Development Server (5 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## What You Get

### ✅ Automatic Code Quality

**Every commit**:

- Auto-formats with Prettier
- Auto-fixes ESLint issues
- Type-checks TypeScript

**Every push**:

- Runs all tests

**Every PR**:

- Full CI pipeline on GitHub

### ✅ Clean Architecture

```
core/
├── domain/          # Pure business logic
├── application/     # Use cases
└── infrastructure/  # Database, services
```

### ✅ RBAC System

```typescript
// Check permissions
user.hasPermission('users:create');

// Protect routes
export const POST = withAuthorization(
  async (request, { user }) => {
    // Handler
  },
  { permission: 'users:create' }
);
```

### ✅ Complete User Management

- Create, read, update, delete users
- Role and permission management
- Multi-role support
- Fine-grained permissions

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production

# Database
npm run db:studio        # Visual database editor

# Code Quality
npm run check            # Run all checks
npm run format           # Format code
npm run lint:fix         # Fix linting

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
```

## Next Steps

1. 📚 **Read the docs**:
   - [Architecture Guide](./ARCHITECTURE.md)
   - [RBAC Guide](./RBAC_GUIDE.md)
   - [Code Quality Guide](./CODE_QUALITY.md)

2. 🎨 **Customize**:
   - Update `tailwind.config.ts` for your theme
   - Add your brand colors
   - Customize components

3. 🔐 **Set up auth**:
   - Implement login/register pages
   - Configure NextAuth.js
   - Add OAuth providers

4. 👥 **Build features**:
   - Use existing use cases as examples
   - Follow clean architecture
   - Add tests for new code

## Need Help?

- 📖 **Documentation**: Check `docs/` folder
- 🐛 **Issues**: Open a GitHub issue
- 💬 **Discussions**: Use GitHub Discussions

---

**You're all set!** Start building your admin dashboard. 🚀
