import { describe, it, expect } from 'vitest';
import { validateAge, validateState, validateFullName } from './validation';

describe('Validation Utility', () => {
  describe('validateAge', () => {
    it('should return valid for 18', () => {
      expect(validateAge('18').isValid).toBe(true);
    });
    it('should return invalid for 0', () => {
      expect(validateAge('0').isValid).toBe(false);
    });
    it('should return invalid for non-numbers', () => {
      expect(validateAge('abc').isValid).toBe(false);
    });
  });

  describe('validateState', () => {
    it('should return valid for non-empty string', () => {
      expect(validateState('Maharashtra').isValid).toBe(true);
    });
    it('should return invalid for empty string', () => {
      expect(validateState('').isValid).toBe(false);
    });
  });

  describe('validateFullName', () => {
    it('should return valid for long names', () => {
      expect(validateFullName('John Doe').isValid).toBe(true);
    });
    it('should return invalid for short names', () => {
      expect(validateFullName('Jo').isValid).toBe(false);
    });
  });
});
