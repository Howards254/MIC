import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from '../../pages/SignUpPage';
import { supabase } from '../../supabaseClient';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn(),
    })),
  },
}));

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign up form', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Innovator')).toBeInTheDocument();
    expect(screen.getByText('Investor')).toBeInTheDocument();
  });

  it('has link to sign in page', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const signInLink = screen.getByText('Sign In');
    expect(signInLink).toBeInTheDocument();
    expect(signInLink.closest('a')).toHaveAttribute('href', '/signin');
  });

  it('allows selecting innovator role', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const innovatorButton = screen.getByText('Innovator').closest('button');
    fireEvent.click(innovatorButton!);

    expect(innovatorButton).toHaveClass('border-green-600');
  });

  it('allows selecting investor role', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const investorButton = screen.getByText('Investor').closest('button');
    fireEvent.click(investorButton!);

    expect(investorButton).toHaveClass('border-green-600');
  });

  it('validates full name length', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const termsCheckbox = screen.getByLabelText(/I agree to the/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'A' } }); // Too short
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Innovator').closest('button')!);
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter your full name')).toBeInTheDocument();
    });
  });

  it('validates role selection', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const termsCheckbox = screen.getByLabelText(/I agree to the/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);
    // Don't select a role
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please select your role')).toBeInTheDocument();
    });
  });

  it('validates password length', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const termsCheckbox = screen.getByLabelText(/I agree to the/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } }); // Too short
    fireEvent.click(screen.getByText('Innovator').closest('button')!);
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('validates terms acceptance', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Innovator').closest('button')!);
    // Don't check terms
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please accept the terms and conditions')).toBeInTheDocument();
    });
  });

  it('successfully signs up a new user', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null,
    } as any);

    const mockFrom = vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }));
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const termsCheckbox = screen.getByLabelText(/I agree to the/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Innovator').closest('button')!);
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Account created successfully! Redirecting...')).toBeInTheDocument();
    });
  });

  it('handles duplicate email error', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'User already registered' } as any,
    } as any);

    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const termsCheckbox = screen.getByLabelText(/I agree to the/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Innovator').closest('button')!);
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/This email is already registered/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during sign up', async () => {
    vi.mocked(supabase.auth.signUp).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: { user: null, session: null }, error: null } as any), 100))
    );

    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const termsCheckbox = screen.getByLabelText(/I agree to the/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Innovator').closest('button')!);
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    expect(screen.getByText('Creating Account...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalled();
    });
  });

  it('creates profile after successful signup', async () => {
    const mockUser = { id: '456', email: 'newuser@example.com' };
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null,
    } as any);

    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn(() => ({
      insert: mockInsert,
    }));
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const termsCheckbox = screen.getByLabelText(/I agree to the/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Investor').closest('button')!);
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockInsert).toHaveBeenCalledWith({
        id: '456',
        email: 'newuser@example.com',
        full_name: 'Jane Smith',
        role: 'investor',
      });
    });
  });
});
