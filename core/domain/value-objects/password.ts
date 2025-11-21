import bcrypt from 'bcryptjs';
import { ValidationError } from '../errors/domain-error';

/**
 * Password Value Object
 * Represents a secure password with validation and hashing
 */
export class Password {
  private readonly hashedValue: string;
  private static readonly SALT_ROUNDS = 12;
  private static readonly MIN_LENGTH = 8;

  private constructor(hashedPassword: string) {
    this.hashedValue = hashedPassword;
  }

  /**
   * Creates a new Password from a plain text password
   * Validates and hashes the password
   * @param plainPassword - The plain text password
   * @returns Promise<Password> instance
   * @throws ValidationError if password is invalid
   */
  static async create(plainPassword: string): Promise<Password> {
    this.validate(plainPassword);
    const hashedPassword = await this.hash(plainPassword);
    return new Password(hashedPassword);
  }

  /**
   * Creates a Password instance from an already hashed password
   * Use this when retrieving from database
   * @param hashedPassword - The already hashed password
   * @returns Password instance
   */
  static fromHash(hashedPassword: string): Password {
    if (!hashedPassword) {
      throw new ValidationError('Hashed password is required');
    }
    return new Password(hashedPassword);
  }

  /**
   * Validates password requirements
   * @param password - The password to validate
   * @throws ValidationError if password doesn't meet requirements
   */
  private static validate(password: string): void {
    if (!password) {
      throw new ValidationError('Password is required');
    }

    if (password.length < this.MIN_LENGTH) {
      throw new ValidationError(`Password must be at least ${this.MIN_LENGTH} characters long`);
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      throw new ValidationError('Password must contain at least one uppercase letter');
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      throw new ValidationError('Password must contain at least one lowercase letter');
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      throw new ValidationError('Password must contain at least one number');
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new ValidationError('Password must contain at least one special character');
    }
  }

  /**
   * Hashes a plain text password
   * @param plainPassword - The password to hash
   * @returns Promise<string> hashed password
   */
  private static async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.SALT_ROUNDS);
  }

  /**
   * Compares a plain text password with the hashed password
   * @param plainPassword - The plain text password to compare
   * @returns Promise<boolean> true if passwords match
   */
  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.hashedValue);
  }

  /**
   * Returns the hashed password value
   * Use this when storing to database
   */
  getValue(): string {
    return this.hashedValue;
  }
}

