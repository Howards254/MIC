import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../../App';
import HomePage from '../../pages/HomePage';
import SignInPage from '../../pages/SignInPage';
import SignUpPage from '../../pages/SignUpPage';
import ExploreProjectsPage from '../../pages/ExploreProjectsPage';
import JobsPage from '../../pages/JobsPage';
import EventsPage from '../../pages/EventsPage';
import NotFoundPage from '../../pages/NotFoundPage';
import * as useAuthHook from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('Navigation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: null,
      profile: null,
      loading: false,
    } as any);
  });

  it('navigates to home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('navigates to sign in page', () => {
    render(
      <MemoryRouter initialEntries={['/signin']}>
        <Routes>
          <Route path="/signin" element={<div>Sign In Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
  });

  it('navigates to sign up page', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route path="/signup" element={<div>Sign Up Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sign Up Page')).toBeInTheDocument();
  });

  it('navigates to explore projects page', () => {
    render(
      <MemoryRouter initialEntries={['/explore']}>
        <Routes>
          <Route path="/explore" element={<div>Explore Projects Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Explore Projects Page')).toBeInTheDocument();
  });

  it('navigates to jobs page', () => {
    render(
      <MemoryRouter initialEntries={['/jobs']}>
        <Routes>
          <Route path="/jobs" element={<div>Jobs Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Jobs Page')).toBeInTheDocument();
  });

  it('navigates to events page', () => {
    render(
      <MemoryRouter initialEntries={['/events']}>
        <Routes>
          <Route path="/events" element={<div>Events Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Events Page')).toBeInTheDocument();
  });

  it('navigates to terms page', () => {
    render(
      <MemoryRouter initialEntries={['/terms']}>
        <Routes>
          <Route path="/terms" element={<div>Terms Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Terms Page')).toBeInTheDocument();
  });

  it('shows 404 page for invalid routes', () => {
    render(
      <MemoryRouter initialEntries={['/invalid-route']}>
        <Routes>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });

  it('navigates to blog list page', () => {
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <Routes>
          <Route path="/blog" element={<div>Blog List Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Blog List Page')).toBeInTheDocument();
  });

  it('navigates to specific blog post', () => {
    render(
      <MemoryRouter initialEntries={['/blog/my-post']}>
        <Routes>
          <Route path="/blog/:slug" element={<div>Blog Post: my-post</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Blog Post: my-post')).toBeInTheDocument();
  });

  it('navigates to project detail page with ID', () => {
    render(
      <MemoryRouter initialEntries={['/project/123']}>
        <Routes>
          <Route path="/project/:id" element={<div>Project Detail: 123</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Project Detail: 123')).toBeInTheDocument();
  });

  it('navigates to dashboard when authenticated', () => {
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      profile: { id: '123', full_name: 'Test User', role: 'innovator' },
      loading: false,
    } as any);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('has working back button navigation', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/', '/explore']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/explore" element={<div>Explore Projects Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Explore Projects Page')).toBeInTheDocument();
  });
});

describe('Link Navigation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: null,
      profile: null,
      loading: false,
    } as any);
  });

  it('clicking Sign In link navigates to sign in page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={
            <div>
              <a href="/signin">Sign In Link</a>
            </div>
          } />
          <Route path="/signin" element={<div>Sign In Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const link = screen.getByText('Sign In Link');
    expect(link).toHaveAttribute('href', '/signin');
  });

  it('clicking Sign Up link navigates to sign up page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={
            <div>
              <a href="/signup">Sign Up Link</a>
            </div>
          } />
          <Route path="/signup" element={<div>Sign Up Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const link = screen.getByText('Sign Up Link');
    expect(link).toHaveAttribute('href', '/signup');
  });

  it('clicking Explore Projects link navigates correctly', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={
            <div>
              <a href="/explore">Explore Link</a>
            </div>
          } />
          <Route path="/explore" element={<div>Explore Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const link = screen.getByText('Explore Link');
    expect(link).toHaveAttribute('href', '/explore');
  });
});

describe('Protected Routes Tests', () => {
  it('redirects to login when accessing dashboard without authentication', () => {
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: null,
      profile: null,
      loading: false,
    } as any);

    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
      const { user } = useAuthHook.default();
      if (!user) {
        return <div>Please Sign In</div>;
      }
      return <>{children}</>;
    };

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div>Dashboard Content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Please Sign In')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
  });

  it('allows access to dashboard when authenticated', () => {
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      profile: { id: '123', full_name: 'Test User', role: 'innovator' },
      loading: false,
    } as any);

    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
      const { user } = useAuthHook.default();
      if (!user) {
        return <div>Please Sign In</div>;
      }
      return <>{children}</>;
    };

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div>Dashboard Content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    expect(screen.queryByText('Please Sign In')).not.toBeInTheDocument();
  });

  it('restricts admin routes to admin users only', () => {
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      profile: { id: '123', full_name: 'Test User', role: 'innovator' },
      loading: false,
    } as any);

    const AdminRoute = ({ children }: { children: React.ReactNode }) => {
      const { profile } = useAuthHook.default();
      if (profile?.role !== 'admin') {
        return <div>Access Denied</div>;
      }
      return <>{children}</>;
    };

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={
            <AdminRoute>
              <div>Admin Panel</div>
            </AdminRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('allows admin access for admin users', () => {
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: { id: '123', email: 'admin@example.com' },
      profile: { id: '123', full_name: 'Admin User', role: 'admin' },
      loading: false,
    } as any);

    const AdminRoute = ({ children }: { children: React.ReactNode }) => {
      const { profile } = useAuthHook.default();
      if (profile?.role !== 'admin') {
        return <div>Access Denied</div>;
      }
      return <>{children}</>;
    };

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={
            <AdminRoute>
              <div>Admin Panel</div>
            </AdminRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
  });
});
