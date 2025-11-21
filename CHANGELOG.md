# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Initial Setup

- Initial project setup with Next.js 15
- Clean Architecture with DDD principles
- Domain layer with User entity, Email and Password value objects
- Application layer with user management use cases (Create, Get, List, Update, Delete)
- Infrastructure layer with Prisma repository implementation
- PostgreSQL database schema with user authentication models
- Type-safe environment configuration with @t3-oss/env-nextjs
- Comprehensive TypeScript configuration with strict mode
- ESLint and Prettier setup with Tailwind CSS plugin
- Vitest configuration for unit and integration testing
- Zod validation schemas for user-related inputs
- Application constants and error messages
- MIT License

#### RBAC System

- Configurable Role-Based Access Control (RBAC)
- Permission entity with resource:action format
- Role entity with permission management
- Multi-role support per user
- Permission checking through roles
- 50+ pre-defined permissions
- 3 system roles (SUPER_ADMIN, ADMIN, USER)
- Role and Permission repositories with full CRUD
- Authorization guards and middleware
- `withAuthorization()` HOF for API route protection
- Comprehensive RBAC validation schemas
- RBAC database schema (4 new tables)

#### Code Quality & CI/CD

- Automated code quality checks with Husky
- Pre-commit hooks (format + lint + type-check on staged files)
- Pre-push hooks (run all tests)
- lint-staged configuration for fast checks
- GitHub Actions CI workflow with 5 jobs:
  - Code quality (format, lint, type-check)
  - Tests with coverage
  - Production build verification
  - Security audit
  - All checks validation
- GitHub Actions PR checks workflow:
  - PR title validation
  - PR size analysis
  - Commit message linting
  - Dependency change detection
- VS Code configuration files
- Pull request template
- Issue templates (bug report, feature request)
- Commit message template

### Security

- Password hashing with bcrypt (12 salt rounds)
- Password validation (min 8 chars, uppercase, lowercase, number, special char)
- Email validation with proper regex
- Type-safe environment variables
- SQL injection protection via Prisma
- Fine-grained permission-based authorization
- Role-based access control
- Ownership-based access checks

### Documentation

- Comprehensive README with quick start guide
- Architecture documentation explaining Clean Architecture and DDD
- Detailed project plan with roadmap
- Contributing guidelines for new contributors
- Code examples and best practices
- Complete RBAC guide (400+ lines)
- RBAC setup guide
- RBAC implementation summary
- Code quality and CI/CD guide
- Getting started guide

## [0.1.0] - 2025-01-21

### Added

- Initial release
- Project scaffolding and basic structure
