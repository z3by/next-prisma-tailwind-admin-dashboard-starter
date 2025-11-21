# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
- Detailed documentation (README, ARCHITECTURE, PROJECT_PLAN, CONTRIBUTING)
- MIT License

### Security
- Password hashing with bcrypt (12 salt rounds)
- Password validation (min 8 chars, uppercase, lowercase, number, special char)
- Email validation with proper regex
- Type-safe environment variables
- SQL injection protection via Prisma

### Documentation
- Comprehensive README with quick start guide
- Architecture documentation explaining Clean Architecture and DDD
- Detailed project plan with roadmap
- Contributing guidelines for new contributors
- Code examples and best practices

## [0.1.0] - 2025-01-21

### Added
- Initial release
- Project scaffolding and basic structure

