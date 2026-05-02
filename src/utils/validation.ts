/**
 * Validation utility for ElectionIQ forms.
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates the age input.
 * @param age The age to validate.
 * @returns A ValidationResult object.
 */
export function validateAge(age: string | number): ValidationResult {
  const num = typeof age === 'string' ? parseInt(age, 10) : age;
  if (isNaN(num)) return { isValid: false, message: "Please enter a valid number for age." };
  if (num < 1) return { isValid: false, message: "Age must be at least 1." };
  if (num > 120) return { isValid: false, message: "Please enter a realistic age (max 120)." };
  return { isValid: true };
}

/**
 * Validates the state selection.
 * @param state The selected state.
 * @returns A ValidationResult object.
 */
export function validateState(state: string): ValidationResult {
  if (!state || state.trim() === "") {
    return { isValid: false, message: "Please select a State or Union Territory." };
  }
  return { isValid: true };
}

/**
 * Validates the full name input.
 * @param name The name to validate.
 * @returns A ValidationResult object.
 */
export function validateFullName(name: string): ValidationResult {
  if (!name || name.trim().length < 3) {
    return { isValid: false, message: "Full name must be at least 3 characters long." };
  }
  return { isValid: true };
}
