import { UserContext, EligibilityResult } from '@/types/voter';

/**
 * Core decision logic engine for determining voter eligibility in India.
 * Priority: Logic BEFORE AI.
 */
export function checkEligibility(context: UserContext): EligibilityResult {
  const age = typeof context.age === 'string' ? parseInt(context.age, 10) : context.age;

  if (isNaN(age)) {
    return {
      isEligible: false,
      reason: "Invalid age provided.",
    };
  }

  if (age < 18) {
    return {
      isEligible: false,
      reason: "Not Eligible. You must be at least 18 years old to vote in India.",
      educationalInfo: "While you cannot vote right now, you can learn about the democratic process. Once you turn 18, you can apply for a Voter ID card (EPIC) through the Election Commission of India's National Voters' Services Portal (NVSP). Participating in elections is a fundamental duty of a citizen.",
    };
  }

  // Add more conditions here if necessary (e.g., NRI status, specific state rules if any, though general rule is age >= 18)

  return {
    isEligible: true,
    reason: "You are eligible to vote. Let's start your election journey!",
  };
}
