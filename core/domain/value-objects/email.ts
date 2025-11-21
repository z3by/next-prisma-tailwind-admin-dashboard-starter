import { ValidationError } from '../errors/domain-error';

/**
 * Email Value Object
 * Represents a valid email address
 */
export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  /**
   * Creates a new Email instance
   * @param email - The email string to validate and create
   * @returns Email instance
   * @throws ValidationError if email is invalid
   */
  static create(email: string): Email {
    if (!email) {
      throw new ValidationError('Email is required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!this.isValidEmail(normalizedEmail)) {
      throw new ValidationError('Invalid email format');
    }

    return new Email(normalizedEmail);
  }

  /**
   * Validates email format using regex
   * @param email - The email to validate
   * @returns true if valid, false otherwise
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Returns the email value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compares two email instances
   * @param other - The other email to compare with
   * @returns true if emails are equal
   */
  equals(other: Email): boolean {
    return this.value === other.value;
  }

  /**
   * String representation of the email
   */
  toString(): string {
    return this.value;
  }
}

