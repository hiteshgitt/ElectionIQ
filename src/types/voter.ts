/**
 * Represents the input context for checking voter eligibility.
 */
export interface UserContext {
  /** The age of the user in years. */
  age: number | string;
  /** Whether the user is voting for the first time. */
  isFirstTimeVoter: boolean;
  /** The State or Union Territory where the user resides. */
  state: string;
}

/**
 * Represents the outcome of an eligibility check.
 */
export interface EligibilityResult {
  /** Whether the user is eligible to vote. */
  isEligible: boolean;
  /** A human-readable reason for the eligibility status. */
  reason: string;
  /** Optional educational content for ineligible users (e.g., those under 18). */
  educationalInfo?: string;
}
