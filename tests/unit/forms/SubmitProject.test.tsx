import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SubmitProject from '../../pages/dashboard/SubmitProject';
import { supabase } from '../../supabaseClient';
import * as useAuthHook from '../../hooks/useAuth';

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
    from: vi.fn(() => ({
      insert: vi.fn(),
    })),
  },
}));

vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

describe('SubmitProject Form Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      profile: null,
      loading: false,
    } as any);
  });

  it('renders all required form fields', () => {
    render(
      <BrowserRouter>
        <SubmitProject />
      </BrowserRouter>
    );

    expect(screen.getByLabelText('Project Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Funding Goal ($)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit project/i })).toBeInTheDocument();
  });

  it('requires title field', async () => {
    render(
      <BrowserRouter>
        <SubmitProject />
      </BrowserRouter>
    );

    const titleInput = screen.getByLabelText('Project Title');
    expect(titleInput).toBeRequired();
  });

  it('requires description field', async () => {
    render(
      <BrowserRouter>
        <SubmitProject />
      </BrowserRouter>
    );

    const descriptionInput = screen.getByLabelText('Description');
    expect(descriptionInput).toBeRequired();
  });

  it('requires funding goal with minimum value', async () => {
    render(
      <BrowserRouter>
        <SubmitProject />
      </BrowserRouter>
    );

    const fundingInput = screen.getByLabelText('Funding Goal ($)');
    expect(fundingInput).toBeRequired();
    expect(fundingInput).toHaveAttribute('min', '1000');
  });

  it('allows selecting different categories', () => {
    render(
      <BrowserRouter>
        <SubmitProject />
      </BrowserRouter>
    );

    const categorySelect = screen.getByLabelText('Category');
    fireEvent.change(categorySelect, { target: { value: 'Energy' } });
    expect(categorySelect).toHaveValue('Energy');

    fireEvent.change(categorySelect, { target: { value: 'Agriculture' } });
    expect(categorySelect).toHaveValue('Agriculture');
  });

  it('successfully submits form with valid data', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn(() => ({
      insert: mockInsert,
    }));
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    render(
      <BrowserRouter>
        <SubmitProject />
      </BrowserRouter>
    );

    const titleInput = screen.getByLabelText('Project Title');
    const descriptionInput = screen.getByLabelText('Description');
    const categorySelect = screen.getByLabelText('Category');
    const fundingInput = screen.getByLabelText('Funding Goal ($)');
    const submitButton = screen.getByRole('button', { name: /submit project/i });

    fireEvent.change(titleInput, { target: { value: 'Eco-Friendly Building Material' } });
    fireEvent.change(descriptionInput, { target: { value: 'A sustainable alternative to concrete' } });
    fireEvent.change(categorySelect, { target: { value: 'Building Materials' } });
    fireEvent.change(fundingInput, { target: { value: '50000' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          innovator_id: '123',
          title: 'Eco-Friendly Building Material',
          description: 'A sustainable alternative to concrete',
          category: 'Building Materials',
          funding_goal: 50000,
          status: 'pending',
        }),
      ]);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/projects');
    });
  });

  it('fills optional fields correctly', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn(() => ({
      insert: mockInsert,
    }));
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    render(
      <BrowserRouter>
        <SubmitProject />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Project Title'), { target: { value: 'Test Project' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });
    fireEvent.change(screen.getByLabelText('Funding Goal ($)'), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText('Problem Statement'), { target: { value: 'Deforestation problem' } });
    fireEvent.change(screen.getByLabelText('Solution'), { target: { value: 'Plant more trees' } });
    fireEvent.change(screen.getByLabelText('Target Market'), { target: { value: 'Construction companies' } });
    fireEvent.change(screen.getByLabelText('Business Model'), { target: { value: 'B2B sales' } });

    fireEvent.click(screen.getByRole('button', { name: /submit project/i }));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          problem_statement: 'Deforestation problem',
          solution: 'Plant more trees',
          target_market: 'Construction companies',
          business_model: 'B2B sales',
        }),
      ]);
    });
  });

  it('shows loading state during submission', async () => {
    const mockInsert = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
    );
    const mockFrom = vi.fn(() => ({
      insert: mockInsert,
    }));
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    render(
      <BrowserRouter>
        <SubmitProject />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Project Title'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Funding Goal ($)'), { target: { value: '5000' } });

    const submitButton = screen.getByRole('button', { name: /submit project/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  it('handles submission errors', async () => {
    const mockError = { message: 'Database error' };
    const mockInsert = vi.fn().mockResolvedValue({ error: mockError });
    const mockFrom = vi.fn(() => ({
      insert: mockInsert,
    }));
    vi.mocked(supabase.from).mockImplementation(mockFrom as any);

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <SubmitProject />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Project Title'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Funding Goal ($)'), { target: { value: '5000' } });

    fireEvent.click(screen.getByRole('button', { name: /submit project/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error submitting project: Database error');
    });

    alertSpy.mockRestore();
  });

  it('validates number fields accept numeric input only', () => {
    render(
      <BrowserRouter>
        <SubmitProject />
      </BrowserRouter>
    );

    const fundingInput = screen.getByLabelText('Funding Goal ($)');
    const teamSizeInput = screen.getByLabelText('Team Size (Optional)');

    expect(fundingInput).toHaveAttribute('type', 'number');
    expect(teamSizeInput).toHaveAttribute('type', 'number');
  });

  it('includes all category options', () => {
    render(
      <BrowserRouter>
        <SubmitProject />
      </BrowserRouter>
    );

    const categorySelect = screen.getByLabelText('Category');
    const options = Array.from(categorySelect.querySelectorAll('option')).map(option => option.textContent);

    expect(options).toContain('Building Materials');
    expect(options).toContain('Furniture');
    expect(options).toContain('Packaging');
    expect(options).toContain('Textiles');
    expect(options).toContain('Energy');
    expect(options).toContain('Agriculture');
    expect(options).toContain('Other');
  });
});
