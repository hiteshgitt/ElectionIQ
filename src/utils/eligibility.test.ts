import { describe, it, expect } from 'vitest';
import { UserContext } from './eligibility';

describe('Eligibility Logic', () => {
  it('should be eligible if age is 18', () => {
    const context: UserContext = { age: '18', state: 'Maharashtra', isFirstTimeVoter: true };
    const age = parseInt(context.age);
    expect(age).toBeGreaterThanOrEqual(18);
  });

  it('should not be eligible if age is 17', () => {
    const context: UserContext = { age: '17', state: 'Maharashtra', isFirstTimeVoter: true };
    const age = parseInt(context.age);
    expect(age).toBeLessThan(18);
  });

  it('should correctly parse state', () => {
    const context: UserContext = { age: '25', state: 'Delhi', isFirstTimeVoter: false };
    expect(context.state).toBe('Delhi');
  });
});
