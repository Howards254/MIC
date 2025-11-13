import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../components/ui/Input';

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Email" id="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('accepts text input', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" id="name" />);
    
    const input = screen.getByLabelText('Name');
    await user.type(input, 'John Doe');
    
    expect(input).toHaveValue('John Doe');
  });

  it('calls onChange handler', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<Input label="Name" id="name" onChange={handleChange} />);
    await user.type(screen.getByLabelText('Name'), 'A');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with placeholder', () => {
    render(<Input label="Email" id="email" placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('renders as required field', () => {
    render(<Input label="Email" id="email" required />);
    expect(screen.getByLabelText('Email')).toBeRequired();
  });

  it('renders different input types', () => {
    const { rerender } = render(<Input label="Email" id="email" type="email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    
    rerender(<Input label="Password" id="password" type="password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('enforces minLength validation', () => {
    render(<Input label="Password" id="password" minLength={6} />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('minlength', '6');
  });

  it('can be disabled', () => {
    render(<Input label="Email" id="email" disabled />);
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('accepts initial value', () => {
    render(<Input label="Email" id="email" value="test@example.com" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
  });
});
