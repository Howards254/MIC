import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthContext } from '../../contexts/AuthContext';

interface AuthProviderProps {
  user?: any;
  profile?: any;
  loading?: boolean;
  signIn?: any;
  signUp?: any;
  signOut?: any;
  updateProfile?: any;
  refreshProfile?: any;
}

const MockAuthProvider = ({ 
  children, 
  user = null, 
  profile = null, 
  loading = false,
  signIn = vi.fn(),
  signUp = vi.fn(),
  signOut = vi.fn(),
  updateProfile = vi.fn(),
  refreshProfile = vi.fn(),
}: AuthProviderProps & { children: React.ReactNode }) => {
  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authProps?: AuthProviderProps;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  { authProps = {}, route = '/', ...renderOptions }: CustomRenderOptions = {}
) {
  if (route !== '/') {
    window.history.pushState({}, 'Test page', route);
  }

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <MockAuthProvider {...authProps}>
        {children}
      </MockAuthProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { renderWithProviders as render };
