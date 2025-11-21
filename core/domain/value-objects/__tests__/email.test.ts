import { describe, it, expect } from 'vitest';
import { Email } from '../email';
import { ValidationError } from '../../errors/domain-error';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create email with valid address', () => {
      const email = Email.create('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = Email.create('TEST@EXAMPLE.COM');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  test@example.com  ');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should throw ValidationError when email is empty', () => {
      expect(() => Email.create('')).toThrow(ValidationError);
      expect(() => Email.create('')).toThrow('Email is required');
    });

    it('should throw ValidationError for invalid email format', () => {
      expect(() => Email.create('invalid-email')).toThrow(ValidationError);
      expect(() => Email.create('invalid-email')).toThrow('Invalid email format');
    });

    it('should throw ValidationError for email without @', () => {
      expect(() => Email.create('invalidemail.com')).toThrow(ValidationError);
    });

    it('should throw ValidationError for email without domain', () => {
      expect(() => Email.create('test@')).toThrow(ValidationError);
    });

    it('should throw ValidationError for email without local part', () => {
      expect(() => Email.create('@example.com')).toThrow(ValidationError);
    });

    it('should accept email with plus sign', () => {
      const email = Email.create('test+tag@example.com');
      expect(email.getValue()).toBe('test+tag@example.com');
    });

    it('should accept email with subdomain', () => {
      const email = Email.create('test@mail.example.com');
      expect(email.getValue()).toBe('test@mail.example.com');
    });
  });

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });

    it('should handle case insensitivity in comparison', () => {
      const email1 = Email.create('TEST@EXAMPLE.COM');
      const email2 = Email.create('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return email value as string', () => {
      const email = Email.create('test@example.com');
      expect(email.toString()).toBe('test@example.com');
    });
  });
});
