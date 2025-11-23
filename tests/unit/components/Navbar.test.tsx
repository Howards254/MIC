import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import Navbar from '../../components/layout/Navbar';

describe('Navbar Component', () => {
  it('renders the logo and brand name', () => {
    render(<Navbar />, {
      authProps: { user: null }
    });
    
    expect(screen.getByText('MIC')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />, {
      authProps: { user: null }
    });
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Explore Projects')).toBeInTheDocument();
    expect(screen.getByText('Jobs')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('shows Sign In and Sign Up buttons when not authenticated', () => {
    render(<Navbar />, {
      authProps: { user: null }
    });
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows user profile when authenticated', () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockProfile = { full_name: 'John Doe', role: 'innovator' };
    
    render(<Navbar />, {
      authProps: { 
        user: mockUser, 
        profile: mockProfile 
      }
    });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('innovator')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('shows Admin Panel link for admin users', () => {
    const mockUser = { id: '1', email: 'admin@example.com' };
    const mockProfile = { full_name: 'Admin User', role: 'admin' };
    
    render(<Navbar />, {
      authProps: { 
        user: mockUser, 
        profile: mockProfile 
      }
    });
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('calls signOut when Sign Out button is clicked', async () => {
    const user = userEvent.setup();
    const mockSignOut = vi.fn();
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockProfile = { full_name: 'John Doe', role: 'innovator' };
    
    render(<Navbar />, {
      authProps: { 
        user: mockUser, 
        profile: mockProfile,
        signOut: mockSignOut 
      }
    });
    
    await user.click(screen.getByText('Sign Out'));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('does not show Admin Panel for non-admin users', () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const mockProfile = { full_name: 'John Doe', role: 'innovator' };
    
    render(<Navbar />, {
      authProps: { 
        user: mockUser, 
        profile: mockProfile 
      }
    });
    
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });
});
