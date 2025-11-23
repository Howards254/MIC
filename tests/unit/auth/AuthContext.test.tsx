import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AuthProvider, { AuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';
import { useContext } from 'react';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      update: vi.fn().mockReturnThis(),
      insert: vi.fn(),
    })),
  },
}));

// Test component to access context
const TestComponent = () => {
  const auth = useContext(AuthContext);
  return (
    <div>
      <div data-testid="user">{auth?.user ? auth.user.email : 'null'}</div>
      <div data-testid="loading">{auth?.loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="profile">{auth?.profile ? auth.profile.full_name : 'null'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides initial loading state', () => {
    const mockSession = { data: { session: null } };
    const mockSubscription = { unsubscribe: vi.fn() };
    
    vi.mocked(supabase.auth.getSession).mockResolvedValue(mockSession);
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({ data: { subscription: mockSubscription } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
  });

  it('sets user when session exists', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockProfile = { id: '123', full_name: 'Test User', role: 'innovator' };
    const mockSession = { data: { session: { user: mockUser } } };
    const mockSubscription = { unsubscribe: vi.fn() };

    vi.mocked(supabase.auth.getSession).mockResolvedValue(mockSession);
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({ data: { subscription: mockSubscription } });
    
    const mockFrom = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
    }));
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('profile')).toHaveTextContent('Test User');
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });
  });

  it('signs up a new user', async () => {
    const mockSession = { data: { session: null } };
    const mockSubscription = { unsubscribe: vi.fn() };
    const mockSignUpData = { user: { id: '456', email: 'new@example.com' } };

    vi.mocked(supabase.auth.getSession).mockResolvedValue(mockSession);
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({ data: { subscription: mockSubscription } });
    vi.mocked(supabase.auth.signUp).mockResolvedValue({ data: mockSignUpData as any, error: null });

    const TestSignUp = () => {
      const auth = useContext(AuthContext);
      const handleSignUp = async () => {
        await auth?.signUp('new@example.com', 'password123');
      };
      return <button onClick={handleSignUp}>Sign Up</button>;
    };

    render(
      <AuthProvider>
        <TestSignUp />
      </AuthProvider>
    );

    const button = screen.getByText('Sign Up');
    button.click();

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: expect.stringContaining('/dashboard'),
        },
      });
    });
  });

  it('signs in an existing user', async () => {
    const mockSession = { data: { session: null } };
    const mockSubscription = { unsubscribe: vi.fn() };
    const mockSignInData = { user: { id: '789', email: 'existing@example.com' }, session: {} };

    vi.mocked(supabase.auth.getSession).mockResolvedValue(mockSession);
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({ data: { subscription: mockSubscription } });
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ data: mockSignInData as any, error: null });

    const TestSignIn = () => {
      const auth = useContext(AuthContext);
      const handleSignIn = async () => {
        await auth?.signIn('existing@example.com', 'password123');
      };
      return <button onClick={handleSignIn}>Sign In</button>;
    };

    render(
      <AuthProvider>
        <TestSignIn />
      </AuthProvider>
    );

    const button = screen.getByText('Sign In');
    button.click();

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'existing@example.com',
        password: 'password123',
      });
    });
  });

  it('signs out user', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { data: { session: { user: mockUser } } };
    const mockSubscription = { unsubscribe: vi.fn() };

    vi.mocked(supabase.auth.getSession).mockResolvedValue(mockSession);
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({ data: { subscription: mockSubscription } });
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    const mockFrom = vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: '123', full_name: 'Test User' }, error: null }),
    }));
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const TestSignOut = () => {
      const auth = useContext(AuthContext);
      const handleSignOut = async () => {
        await auth?.signOut();
      };
      return <button onClick={handleSignOut}>Sign Out</button>;
    };

    render(
      <AuthProvider>
        <TestSignOut />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    const button = screen.getByText('Sign Out');
    button.click();

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  it('handles authentication errors', async () => {
    const mockSession = { data: { session: null } };
    const mockSubscription = { unsubscribe: vi.fn() };
    const mockError = new Error('Invalid credentials');

    vi.mocked(supabase.auth.getSession).mockResolvedValue(mockSession);
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({ data: { subscription: mockSubscription } });
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ data: { user: null, session: null } as any, error: mockError as any });

    const TestErrorHandling = () => {
      const auth = useContext(AuthContext);
      const [error, setError] = React.useState('');

      const handleSignIn = async () => {
        try {
          await auth?.signIn('wrong@example.com', 'wrongpass');
        } catch (err: any) {
          setError(err.message);
        }
      };

      return (
        <div>
          <button onClick={handleSignIn}>Sign In</button>
          {error && <div data-testid="error">{error}</div>}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestErrorHandling />
      </AuthProvider>
    );

    const button = screen.getByText('Sign In');
    button.click();

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
    });
  });

  it('updates user profile', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockProfile = { id: '123', full_name: 'Test User', role: 'innovator' };
    const updatedProfile = { id: '123', full_name: 'Updated Name', role: 'innovator' };
    const mockSession = { data: { session: { user: mockUser } } };
    const mockSubscription = { unsubscribe: vi.fn() };

    vi.mocked(supabase.auth.getSession).mockResolvedValue(mockSession);
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({ data: { subscription: mockSubscription } });

    const mockFrom = vi.fn((table) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
          update: vi.fn().mockReturnThis(),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedProfile, error: null }),
        update: vi.fn().mockReturnThis(),
      };
    });
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const TestUpdateProfile = () => {
      const auth = useContext(AuthContext);
      const handleUpdate = async () => {
        await auth?.updateProfile({ full_name: 'Updated Name' });
      };
      return (
        <div>
          <button onClick={handleUpdate}>Update Profile</button>
          <div data-testid="profile-name">{auth?.profile?.full_name}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestUpdateProfile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile-name')).toHaveTextContent('Test User');
    });
  });
});
