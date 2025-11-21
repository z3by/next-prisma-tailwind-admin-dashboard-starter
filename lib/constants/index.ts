/**
 * Application Constants
 * Centralized location for all application-wide constants
 */

// ============================================================================
// User Constants
// ============================================================================

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

// ============================================================================
// Pagination Constants
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// ============================================================================
// Password Constants
// ============================================================================

export const PASSWORD = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  SALT_ROUNDS: 12,
} as const;

// ============================================================================
// Session Constants
// ============================================================================

export const SESSION = {
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
  UPDATE_AGE: 24 * 60 * 60, // 1 day in seconds
} as const;

// ============================================================================
// API Constants
// ============================================================================

export const API = {
  VERSION: 'v1',
  BASE_PATH: '/api',
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_SUSPENDED: 'Your account has been suspended',
  ACCOUNT_INACTIVE: 'Your account is inactive',
  EMAIL_NOT_VERIFIED: 'Please verify your email address',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  
  // User
  USER_NOT_FOUND: 'User not found',
  EMAIL_EXISTS: 'Email already exists',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PASSWORD: 'Invalid password',
  
  // General
  INTERNAL_ERROR: 'An internal error occurred',
  VALIDATION_ERROR: 'Validation error',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
} as const;

// ============================================================================
// Route Constants
// ============================================================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  USERS: '/dashboard/users',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

