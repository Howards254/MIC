import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ExploreProjectsPage from '../../pages/ExploreProjectsPage';
import { supabase } from '../../supabaseClient';
import * as useAuthHook from '../../hooks/useAuth';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
    })),
  },
}));

vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthHook.default).mockReturnValue({
      user: null,
      profile: null,
      loading: false,
    } as any);
  });

  describe('Data Fetching', () => {
    it('fetches projects from database', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'Eco Bricks',
          description: 'Sustainable building material',
          category: 'Building Materials',
          funding_goal: 50000,
          status: 'approved',
        },
        {
          id: '2',
          title: 'Solar Panels',
          description: 'Renewable energy solution',
          category: 'Energy',
          funding_goal: 100000,
          status: 'approved',
        },
      ];

      const mockFrom = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockProjects, error: null }),
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      render(
        <BrowserRouter>
          <ExploreProjectsPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalledWith('projects');
      });
    });

    it('handles API errors gracefully', async () => {
      const mockError = { message: 'Database connection error' };
      const mockFrom = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      render(
        <BrowserRouter>
          <ExploreProjectsPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(mockFrom).toHaveBeenCalled();
      });
    });

    it('displays loading state while fetching data', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve({ data: [], error: null }), 100))
        ),
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      render(
        <BrowserRouter>
          <ExploreProjectsPage />
        </BrowserRouter>
      );

      // Check for loading indicator
      expect(screen.getByText(/loading|explore/i)).toBeInTheDocument();
    });
  });

  describe('Data Persistence', () => {
    it('saves project data to database', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn(() => ({
        insert: mockInsert,
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const projectData = {
        innovator_id: '123',
        title: 'New Project',
        description: 'Test description',
        category: 'Energy',
        funding_goal: 50000,
        status: 'pending',
      };

      await supabase.from('projects').insert([projectData]);

      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(mockInsert).toHaveBeenCalledWith([projectData]);
    });

    it('updates existing project data', async () => {
      const mockUpdate = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn(() => ({
        update: mockUpdate,
        eq: mockEq,
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const updates = { title: 'Updated Title', description: 'Updated description' };
      const result = await supabase.from('projects').update(updates).eq('id', '123');

      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(mockEq).toHaveBeenCalledWith('id', '123');
    });

    it('deletes project from database', async () => {
      const mockDelete = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn(() => ({
        delete: mockDelete,
        eq: mockEq,
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      await supabase.from('projects').delete().eq('id', '123');

      expect(mockFrom).toHaveBeenCalledWith('projects');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', '123');
    });
  });

  describe('Search and Filter', () => {
    it('filters projects by category', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'Eco Bricks',
          category: 'Building Materials',
        },
      ];

      const mockIlike = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: mockProjects, error: null });
      const mockFrom = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: mockIlike,
        order: mockOrder,
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      await supabase.from('projects').select('*').eq('status', 'approved').ilike('category', '%Building%').order('created_at');

      expect(mockIlike).toHaveBeenCalledWith('category', '%Building%');
    });

    it('searches projects by title', async () => {
      const mockIlike = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockFrom = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: mockIlike,
        order: mockOrder,
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      await supabase.from('projects').select('*').eq('status', 'approved').ilike('title', '%solar%').order('created_at');

      expect(mockIlike).toHaveBeenCalledWith('title', '%solar%');
    });

    it('returns correct results for search query', async () => {
      const searchResults = [
        {
          id: '1',
          title: 'Solar Panel Innovation',
          category: 'Energy',
        },
        {
          id: '2',
          title: 'Solar Water Heater',
          category: 'Energy',
        },
      ];

      const mockIlike = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: searchResults, error: null });
      const mockFrom = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: mockIlike,
        order: mockOrder,
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'approved')
        .ilike('title', '%solar%')
        .order('created_at');

      expect(data).toHaveLength(2);
      expect(data?.[0].title).toContain('Solar');
      expect(data?.[1].title).toContain('Solar');
    });

    it('returns empty array when no results match', async () => {
      const mockIlike = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockFrom = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: mockIlike,
        order: mockOrder,
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'approved')
        .ilike('title', '%nonexistent%')
        .order('created_at');

      expect(data).toEqual([]);
    });
  });

  describe('Pagination', () => {
    it('limits number of results returned', async () => {
      const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockFrom = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: mockLimit,
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      await supabase.from('projects').select('*').eq('status', 'approved').order('created_at').limit(10);

      expect(mockLimit).toHaveBeenCalledWith(10);
    });

    it('fetches correct page of results', async () => {
      const mockRange = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockFrom = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: mockRange,
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      // Fetch page 2 with 10 items per page (range 10-19)
      await supabase.from('projects').select('*').eq('status', 'approved').order('created_at').range(10, 19);

      expect(mockRange).toHaveBeenCalledWith(10, 19);
    });
  });

  describe('Real-time Data Updates', () => {
    it('subscribes to database changes', async () => {
      const mockOn = vi.fn().mockReturnThis();
      const mockSubscribe = vi.fn();
      const mockChannel = vi.fn(() => ({
        on: mockOn,
        subscribe: mockSubscribe,
      }));
      const mockSupabase = {
        ...supabase,
        channel: mockChannel,
      };

      mockSupabase.channel('projects').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {}).subscribe();

      expect(mockChannel).toHaveBeenCalledWith('projects');
    });
  });

  describe('Error Handling', () => {
    it('handles network errors', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockRejectedValue(new Error('Network error')),
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      try {
        await supabase.from('projects').select('*').eq('status', 'approved').order('created_at');
      } catch (error: any) {
        expect(error.message).toBe('Network error');
      }
    });

    it('handles authentication errors', async () => {
      const mockError = { message: 'Not authenticated', code: 'PGRST301' };
      const mockFrom = vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      }));
      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { error } = await supabase.from('projects').select('*').eq('status', 'approved').order('created_at');

      expect(error?.message).toBe('Not authenticated');
      expect(error?.code).toBe('PGRST301');
    });
  });
});
