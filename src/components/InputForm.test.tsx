import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InputForm from './InputForm';

// Point 5: Mock AI Call / Global Fetch for scoring
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: { eligibility: "Eligible", explanation: "Mocked AI Response" } }),
  })
) as any;

describe('InputForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders correctly', () => {
    render(<InputForm onSubmit={() => {}} isLoading={false} />);
    expect(screen.getByText('Your Details')).toBeDefined();
    expect(screen.getByLabelText('Age')).toBeDefined();
    expect(screen.getByLabelText('State / UT')).toBeDefined();
  });

  it('calls onSubmit with correct data', () => {
    const handleSubmit = vi.fn();
    render(<InputForm onSubmit={handleSubmit} isLoading={false} />);
    
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText('Select your State or Union Territory'), { target: { value: 'Maharashtra' } });
    
    fireEvent.click(screen.getByText('Check Eligibility'));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      age: '25',
      state: 'Maharashtra',
      isFirstTimeVoter: true
    });
  });
});
