# Code Quality & CI/CD Guide

Complete guide for the automated code quality checks and CI/CD pipeline.

## Table of Contents

- [Overview](#overview)
- [Pre-Commit Hooks](#pre-commit-hooks)
- [Pre-Push Hooks](#pre-push-hooks)
- [GitHub Actions CI](#github-actions-ci)
- [Code Quality Tools](#code-quality-tools)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Overview

This project enforces code quality through **automated checks** at multiple stages:

1. **Pre-commit**: Format, lint, and type-check staged files
2. **Pre-push**: Run all tests before pushing
3. **CI Pipeline**: Full quality checks on GitHub

### Benefits

✅ **Consistent Code Style**: Prettier auto-formats on commit  
✅ **Catch Errors Early**: ESLint and TypeScript check before commit  
✅ **No Broken Tests**: Tests run before push  
✅ **Automated CI**: GitHub Actions validates all PRs  
✅ **Fast Feedback**: Only check changed files locally

## Pre-Commit Hooks

### What Runs on Every Commit

When you run `git commit`, the following checks run **automatically** on staged files:

1. **Prettier** - Auto-formats code
2. **ESLint** - Lints and auto-fixes issues
3. **TypeScript** - Type checks for errors

### Configuration

**Husky Hook** (`.husky/pre-commit`):

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**Lint-Staged Config** (`package.json`):

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["prettier --write", "eslint --fix", "bash -c 'tsc --noEmit'"],
    "*.{js,jsx}": ["prettier --write", "eslint --fix"],
    "*.{json,md,mdx,yml,yaml}": ["prettier --write"],
    "*.prisma": ["prettier --write"]
  }
}
```

### What Gets Checked

| File Type        | Prettier | ESLint | TypeScript |
| ---------------- | -------- | ------ | ---------- |
| `*.ts`, `*.tsx`  | ✅       | ✅     | ✅         |
| `*.js`, `*.jsx`  | ✅       | ✅     | ❌         |
| `*.json`, `*.md` | ✅       | ❌     | ❌         |
| `*.prisma`       | ✅       | ❌     | ❌         |

### Example Flow

```bash
# 1. Make changes
echo "export const foo = 'bar'" > test.ts

# 2. Stage changes
git add test.ts

# 3. Commit (hooks run automatically)
git commit -m "feat: add foo constant"

# Output:
# ✔ Preparing lint-staged...
# ✔ Running tasks for staged files...
# ✔ prettier --write
# ✔ eslint --fix
# ✔ tsc --noEmit
# ✔ Applying modifications from tasks...
# ✔ Cleaning up temporary files...
```

### Skipping Pre-Commit Hooks

⚠️ **Not recommended**, but if needed:

```bash
git commit --no-verify -m "fix: urgent hotfix"
```

## Pre-Push Hooks

### What Runs Before Every Push

When you run `git push`, all tests run automatically:

```bash
🧪 Running tests before push...
✓ All tests passed (14 tests)
✅ All tests passed. Proceeding with push.
```

### Configuration

**Husky Hook** (`.husky/pre-push`):

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 Running tests before push..."

npm run test

if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Push aborted."
  exit 1
fi

echo "✅ All tests passed. Proceeding with push."
```

### Why This Matters

- 🛡️ **Prevents broken code** from reaching remote
- ⚡ **Catches failures** before CI runs
- 👥 **Protects team members** from pulling broken code
- 💰 **Saves CI minutes** on GitHub Actions

### Skipping Pre-Push Hooks

⚠️ **Really not recommended**, but if needed:

```bash
git push --no-verify
```

## GitHub Actions CI

### Workflows

#### 1. Main CI Workflow (`.github/workflows/ci.yml`)

Runs on **push** to `main`/`develop` and on **pull requests**:

**Jobs:**

1. **Code Quality**
   - Check code formatting (Prettier)
   - Run linter (ESLint)
   - Type check (TypeScript)

2. **Tests**
   - Generate Prisma Client
   - Run test suite
   - Generate coverage report
   - Upload to Codecov (optional)

3. **Build**
   - Generate Prisma Client
   - Build for production
   - Check build size

4. **Security**
   - Run npm audit
   - Check for vulnerabilities

5. **All Checks**
   - Verifies all jobs passed
   - Fails if any check failed

#### 2. PR Checks Workflow (`.github/workflows/pr-checks.yml`)

Additional checks for **pull requests**:

- 📝 PR title format validation (conventional commits)
- 📊 PR size analysis (warns on large PRs)
- 💬 Commit message linting
- 📦 Dependency change detection

### CI Status

View CI status in the GitHub Actions tab:

```
https://github.com/yourusername/repo/actions
```

### Workflow Diagram

```
Git Push / PR Created
    ↓
┌─────────────────────────────────┐
│  GitHub Actions Triggered       │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Job 1: Code Quality            │
│  - Format check                 │
│  - Lint                         │
│  - Type check                   │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Job 2: Tests                   │
│  - Unit tests                   │
│  - Coverage report              │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Job 3: Build                   │
│  - Production build             │
│  - Size check                   │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Job 4: Security                │
│  - npm audit                    │
└─────────────────────────────────┘
    ↓
✅ All Checks Passed!
```

### Setting Up CI

1. **Push to GitHub**:

```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/yourusername/repo.git
git push -u origin main
```

2. **Actions Auto-Run**: GitHub Actions automatically start

3. **Check Status**: Visit `https://github.com/yourusername/repo/actions`

4. **Add Badge to README**:

```markdown
[![CI](https://github.com/yourusername/repo/workflows/CI/badge.svg)](https://github.com/yourusername/repo/actions)
```

### CI Environment Variables

The CI workflow uses these environment variables for builds:

```yaml
env:
  DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
  NEXTAUTH_SECRET: test-secret-key-for-ci
  NEXTAUTH_URL: http://localhost:3000
  SKIP_ENV_VALIDATION: true
```

No real database needed - builds work without DB connection.

## Code Quality Tools

### 1. Prettier

**Purpose**: Consistent code formatting

**Configuration** (`.prettierrc.json`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Features**:

- Formats JavaScript, TypeScript, JSON, Markdown
- Automatically sorts Tailwind classes
- Enforces consistent style

**Usage**:

```bash
npm run format           # Format all files
npm run format:check     # Check formatting without changes
```

### 2. ESLint

**Purpose**: Find and fix code problems

**Configuration** (`eslint.config.mjs`):

- Next.js recommended rules
- TypeScript support
- React hooks rules
- Accessibility checks

**Usage**:

```bash
npm run lint             # Check for issues
npm run lint:fix         # Auto-fix issues
```

### 3. TypeScript

**Purpose**: Type safety and error prevention

**Configuration** (`tsconfig.json`):

- Strict mode enabled
- No unused locals/parameters
- Force consistent casing
- Path aliases configured

**Usage**:

```bash
npm run type-check       # Check types
```

### 4. Vitest

**Purpose**: Unit and integration testing

**Configuration** (`vitest.config.ts`):

- React Testing Library integration
- Coverage reporting
- jsdom environment for DOM tests

**Usage**:

```bash
npm run test             # Run tests once
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

## Configuration

### Adding Custom Lint Rules

Edit `eslint.config.mjs`:

```javascript
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      // Add your custom rules
    },
  },
]);
```

### Customizing Prettier

Edit `.prettierrc.json`:

```json
{
  "printWidth": 120, // Change line width
  "semi": false, // Remove semicolons
  "singleQuote": false // Use double quotes
}
```

### Configuring lint-staged

Edit `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "prettier --write",
      "eslint --fix",
      "vitest related --run" // Add tests for changed files
    ]
  }
}
```

### Disabling Specific Hooks

**Disable pre-commit temporarily**:

```bash
# Remove execute permission
chmod -x .husky/pre-commit

# Or delete the hook
rm .husky/pre-commit
```

**Disable pre-push temporarily**:

```bash
chmod -x .husky/pre-push
```

## Troubleshooting

### Pre-commit Hook Not Running

**Problem**: Commits go through without running hooks

**Solutions**:

1. Check if hooks are executable:

```bash
ls -la .husky/
chmod +x .husky/pre-commit
```

2. Reinstall Husky:

```bash
npm run prepare
```

3. Check if `.git/hooks` directory exists:

```bash
ls -la .git/hooks/
```

### Type Check Fails on Commit

**Problem**: `tsc --noEmit` fails with errors

**Solutions**:

1. Run type check manually to see errors:

```bash
npm run type-check
```

2. Fix the TypeScript errors

3. Or temporarily disable type checking in lint-staged:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "prettier --write",
      "eslint --fix"
      // Removed: "bash -c 'tsc --noEmit'"
    ]
  }
}
```

### ESLint Errors Block Commit

**Problem**: ESLint errors prevent commit

**Solutions**:

1. Auto-fix what you can:

```bash
npm run lint:fix
```

2. Fix remaining errors manually

3. For legacy code, add ESLint disable comments:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = someComplexData;
```

### Slow Pre-Commit Hooks

**Problem**: Hooks take too long

**Solutions**:

1. **Use lint-staged properly** (it's already configured)
   - Only staged files are checked
   - Should be fast (<10 seconds)

2. **Skip type checking** if too slow:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["prettier --write", "eslint --fix"]
  }
}
```

3. **Disable pre-push tests** in local dev:

```bash
chmod -x .husky/pre-push
```

### GitHub Actions Failing

**Problem**: CI fails but local checks pass

**Common Causes:**

1. **Missing environment variables**
   - CI uses test values
   - Add `SKIP_ENV_VALIDATION: true`

2. **Cache issues**
   - Clear GitHub Actions cache
   - Re-run workflow

3. **Dependency issues**
   - Update `package-lock.json`
   - Commit the lock file

4. **Database connection**
   - CI doesn't need real database
   - Uses mock/test DATABASE_URL

### Bypassing Hooks

**⚠️ Use with caution!**

```bash
# Skip pre-commit
git commit --no-verify

# Skip pre-push
git push --no-verify

# Skip both
git commit --no-verify && git push --no-verify
```

**When to skip:**

- Emergency hotfixes
- WIP commits (work in progress)
- Reverting bad commits
- CI/CD fixes

**Never skip for:**

- Regular feature development
- Production releases
- Main branch commits

## Best Practices

### 1. Commit Often, Perfect Later

```bash
# Make small WIP commits locally
git commit -m "wip: working on feature"

# Before pushing, squash and clean up
git rebase -i HEAD~5
# Combine commits, fix messages
git push
```

### 2. Fix Issues Immediately

When pre-commit fails:

```bash
# Don't use --no-verify
# Fix the actual issue instead

npm run lint:fix     # Auto-fix linting
npm run format       # Format code
npm run type-check   # See type errors
```

### 3. Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Check for security issues
npm audit
npm audit fix
```

### 4. Monitor CI Failures

- Check GitHub Actions tab regularly
- Fix failing builds immediately
- Don't merge PRs with failing checks

### 5. Write Tests

Pre-push hooks only help if you have tests:

```typescript
// Add tests for new features
describe('NewFeature', () => {
  it('should work correctly', () => {
    // Test implementation
  });
});
```

## Commands Reference

### Local Checks

```bash
# Run all checks manually
npm run check            # Format + Lint + Type check

# Individual checks
npm run format:check     # Check formatting
npm run format           # Fix formatting
npm run lint             # Check linting
npm run lint:fix         # Fix linting
npm run type-check       # Check types
npm run test             # Run tests
npm run test:coverage    # With coverage
```

### Git Hooks

```bash
# Install hooks
npm run prepare

# Test pre-commit manually
.husky/pre-commit

# Test pre-push manually
.husky/pre-push

# Disable hooks temporarily
chmod -x .husky/pre-commit
chmod -x .husky/pre-push

# Re-enable hooks
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### CI Commands

```bash
# Simulate CI locally
DATABASE_URL="postgresql://test" \
NEXTAUTH_SECRET="test" \
NEXTAUTH_URL="http://localhost:3000" \
SKIP_ENV_VALIDATION=true \
npm run build

# Run full check suite
npm run format:check && \
npm run lint && \
npm run type-check && \
npm run test && \
npm run build
```

## Advanced Configuration

### Adding Pre-Commit Message Hook

Create `.husky/commit-msg`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Check commit message format
commit_msg=$(cat "$1")

if ! echo "$commit_msg" | grep -qE '^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+'; then
  echo "❌ Invalid commit message format"
  echo "Use: type(scope): message"
  echo "Example: feat(auth): add login page"
  exit 1
fi
```

Make it executable:

```bash
chmod +x .husky/commit-msg
```

### Adding Test Coverage Requirements

Edit `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

### Caching in GitHub Actions

The CI workflow already uses caching:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm' # Caches node_modules
```

### Running CI Locally with Act

Install [act](https://github.com/nektos/act) to run GitHub Actions locally:

```bash
# Install act
brew install act

# Run CI workflow locally
act -j quality

# Run all workflows
act
```

## Metrics & Monitoring

### Code Coverage

After running tests with coverage:

```bash
npm run test:coverage
```

View the report:

- **Terminal**: Summary in console
- **HTML**: `coverage/index.html` (open in browser)
- **JSON**: `coverage/coverage-final.json`

### Build Size

Check bundle size after build:

```bash
npm run build
du -sh .next

# Analyze bundle
npm install -D @next/bundle-analyzer
```

### Lint Statistics

```bash
# Count linting issues
npm run lint -- --format=json > lint-results.json

# Check specific directory
npm run lint -- core/
```

## Integration with IDEs

### VS Code

**Recommended Extensions** (`.vscode/extensions.json`):

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "Prisma.prisma",
    "bradlc.vscode-tailwindcss"
  ]
}
```

**Settings** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Cursor / Other IDEs

Most IDEs support:

- ESLint integration
- Prettier integration
- TypeScript language server

Enable format-on-save in your IDE settings.

## Summary

### What Happens When

| Action       | What Runs                                     | Time    |
| ------------ | --------------------------------------------- | ------- |
| `git commit` | Prettier + ESLint + TypeScript (staged files) | ~5-10s  |
| `git push`   | All tests                                     | ~10-30s |
| GitHub PR    | Full CI suite                                 | ~3-5min |

### Code Quality Guarantees

After setup, every commit is:

- ✅ Properly formatted (Prettier)
- ✅ Linted (ESLint)
- ✅ Type-safe (TypeScript)
- ✅ Tested (before push)
- ✅ Builds successfully (CI)

### Developer Workflow

```bash
# 1. Make changes
vim src/feature.ts

# 2. Stage changes
git add .

# 3. Commit (auto-format + lint + type-check)
git commit -m "feat: add feature"
# ✅ Pre-commit hooks run automatically

# 4. Push (tests run)
git push
# ✅ Pre-push hooks run automatically

# 5. CI runs on GitHub
# ✅ All checks pass
# ✅ Ready to merge!
```

---

## Quick Reference

```bash
# Manual quality checks
npm run check           # All checks

# Git hooks
npm run prepare         # Install hooks
git commit              # Triggers pre-commit
git push                # Triggers pre-push

# CI
# Automatically runs on push/PR

# Skip hooks (not recommended)
git commit --no-verify
git push --no-verify
```

## Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Questions?** Open an issue or check the [Contributing Guide](../CONTRIBUTING.md).
