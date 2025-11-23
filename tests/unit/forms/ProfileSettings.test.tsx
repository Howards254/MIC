import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileSettings from '../../pages/dashboard/ProfileSettings';
import { supabase } from '../../supabaseClient';
import * as useAuthHook from '../../hooks/useAuth';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn(),
    })),
  },
}));

vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

describe('ProfileSettings Form Validation', () => {
  const mockUser = { id: '123', email: 'test@example.com' };
  const mockProfile = {
    id: '123',
    email: 'test@example.com',
    full_name: 'John Doe',
    role: 'innovator',
    bio: 'Test bio',
    location: 'Nairobi, Kenya',
    phone: '+254123456789',
    website: 'https://example.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: mockUser,
      profile: mockProfile,
      loading: false,
    } as any);
  });

  it('renders all profile fields', () => {
    render(<ProfileSettings />);

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Website')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn Profile')).toBeInTheDocument();
  });

  it('populates form with existing profile data', () => {
    render(<ProfileSettings />);

    expect(screen.getByLabelText('Full Name')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Bio')).toHaveValue('Test bio');
    expect(screen.getByLabelText('Location')).toHaveValue('Nairobi, Kenya');
    expect(screen.getByLabelText('Phone')).toHaveValue('+254123456789');
    expect(screen.getByLabelText('Website')).toHaveValue('https://example.com');
    expect(screen.getByLabelText('LinkedIn Profile')).toHaveValue('https://linkedin.com/in/johndoe');
  });

  it('displays user email and role (read-only)', () => {
    render(<ProfileSettings />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('innovator')).toBeInTheDocument();
  });

  it('requires full name field', () => {
    render(<ProfileSettings />);

    const fullNameInput = screen.getByLabelText('Full Name');
    expect(fullNameInput).toBeRequired();
  });

  it('allows updating profile fields', async () => {
    render(<ProfileSettings />);

    const bioInput = screen.getByLabelText('Bio');
    fireEvent.change(bioInput, { target: { value: 'Updated bio content' } });

    expect(bioInput).toHaveValue('Updated bio content');
  });

  it('validates phone field type', () => {
    render(<ProfileSettings />);

    const phoneInput = screen.getByLabelText('Phone');
    expect(phoneInput).toHaveAttribute('type', 'tel');
  });

  it('validates website URL field type', () => {
    render(<ProfileSettings />);

    const websiteInput = screen.getByLabelText('Website');
    expect(websiteInput).toHaveAttribute('type', 'url');
  });

  it('validates LinkedIn URL field type', () => {
    render(<ProfileSettings />);

    const linkedinInput = screen.getByLabelText('LinkedIn Profile');
    expect(linkedinInput).toHaveAttribute('type', 'url');
  });

  it('successfully updates profile', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockUpdate = vi.fn().mockReturnThis();
    const mockFrom = vi.fn(() => ({
      update: mockUpdate,
      eq: mockEq,
    }));
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<ProfileSettings />);

    const fullNameInput = screen.getByLabelText('Full Name');
    const bioInput = screen.getByLabelText('Bio');
    const submitButton = screen.getByRole('button', { name: /save changes/i });

    fireEvent.change(fullNameInput, { target: { value: 'Jane Smith' } });
    fireEvent.change(bioInput, { target: { value: 'Updated bio' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockUpdate).toHaveBeenCalledWith({
        full_name: 'Jane Smith',
        bio: 'Updated bio',
        location: 'Nairobi, Kenya',
        phone: '+254123456789',
        website: 'https://example.com',
        linkedin: 'https://linkedin.com/in/johndoe',
      });
      expect(mockEq).toHaveBeenCalledWith('id', '123');
      expect(alertSpy).toHaveBeenCalledWith('Profile updated successfully!');
    });

    alertSpy.mockRestore();
  });

  it('shows loading state during update', async () => {
    const mockEq = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
    );
    const mockUpdate = vi.fn().mockReturnThis();
    const mockFrom = vi.fn(() => ({
      update: mockUpdate,
      eq: mockEq,
    }));
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    render(<ProfileSettings />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  it('handles empty profile gracefully', () => {
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: mockUser,
      profile: null,
      loading: false,
    } as any);

    render(<ProfileSettings />);

    expect(screen.getByLabelText('Full Name')).toHaveValue('');
    expect(screen.getByLabelText('Bio')).toHaveValue('');
    expect(screen.getByLabelText('Location')).toHaveValue('');
  });

  it('updates form when profile changes', () => {
    const { rerender } = render(<ProfileSettings />);

    expect(screen.getByLabelText('Full Name')).toHaveValue('John Doe');

    // Update mock to return different profile
    const updatedProfile = { ...mockProfile, full_name: 'Jane Doe', bio: 'New bio' };
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: mockUser,
      profile: updatedProfile,
      loading: false,
    } as any);

    rerender(<ProfileSettings />);

    expect(screen.getByLabelText('Full Name')).toHaveValue('Jane Doe');
    expect(screen.getByLabelText('Bio')).toHaveValue('New bio');
  });

  it('allows clearing optional fields', async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockUpdate = vi.fn().mockReturnThis();
    const mockFrom = vi.fn(() => ({
      update: mockUpdate,
      eq: mockEq,
    }));
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    render(<ProfileSettings />);

    const websiteInput = screen.getByLabelText('Website');
    const linkedinInput = screen.getByLabelText('LinkedIn Profile');
    const submitButton = screen.getByRole('button', { name: /save changes/i });

    fireEvent.change(websiteInput, { target: { value: '' } });
    fireEvent.change(linkedinInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          website: '',
          linkedin: '',
        })
      );
    });
  });

  it('shows Save icon in submit button', () => {
    render(<ProfileSettings />);

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    expect(submitButton).toBeInTheDocument();
    // The lucide-react Save icon is rendered
    expect(submitButton.querySelector('svg')).toBeInTheDocument();
  });
});
