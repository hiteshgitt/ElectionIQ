import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputForm from './InputForm';

describe('InputForm Component', () => {
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
