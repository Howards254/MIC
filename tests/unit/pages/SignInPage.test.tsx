import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignInPage from '../../pages/SignInPage';
import * as useAuthHook from '../../hooks/useAuth';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSignIn = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthHook.default).mockReturnValue({
      signIn: mockSignIn,
      user: null,
      profile: null,
      loading: false,
    } as any);
  });

  it('renders sign in form', () => {
    render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('has link to sign up page', () => {
    render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
    );

    const signUpLink = screen.getByText('Sign Up');
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('validates password length before submission', async () => {
    render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } }); // Less than 6 characters
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('submits form with valid credentials', async () => {
    mockSignIn.mockResolvedValue({ user: { id: '123', email: 'test@example.com' } });

    render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on failed sign in', async () => {
    mockSignIn.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows loading state during sign in', async () => {
    mockSignIn.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Signing In...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  it('requires email and password fields', () => {
    render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
    expect(passwordInput).toHaveAttribute('minLength', '6');
  });

  it('clears error message when user starts typing', async () => {
    mockSignIn.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // First, trigger an error
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Then submit again - error should be cleared
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });
});
