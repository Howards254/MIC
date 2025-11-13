# Project Structure

## Overview
This is a React + TypeScript + Vite application with Supabase backend integration.

## Directory Structure

```
MIC/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── donations/       # Donation-related components
│   │   ├── investments/     # Investment-related components
│   │   ├── layout/          # Layout components (Navbar, Footer, etc.)
│   │   └── ui/              # Base UI components (Button, Input, Modal, etc.)
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx  # Authentication context
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.ts       # Authentication hook
│   ├── lib/                 # Utility libraries and configurations
│   │   └── supabase.ts      # Supabase client configuration
│   ├── pages/               # Page components
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── blog/            # Blog pages
│   │   └── dashboard/       # User dashboard pages
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Centralized type exports
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── database/                # SQL migration files
├── docs/                    # Project documentation
├── scripts/                 # Build and utility scripts
├── public/                  # Static assets
└── dist/                    # Production build output

```

## Key Technologies

- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.4.2** - Build tool and dev server
- **React Router 7.9.5** - Client-side routing
- **Supabase 2.80.0** - Backend as a Service (Auth, Database, Storage)
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Icon library

## TypeScript Configuration

The project uses three TypeScript configuration files:

- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - Application-specific configuration
- `tsconfig.node.json` - Node/build tool configuration

## Type System

All types are centralized in `src/types/index.ts` including:

- **Database Types**: Profile, Project, Job, Event, BlogPost, Investment, Donation, Message, Notification
- **Auth Types**: AuthContextType
- **Component Props**: ButtonProps, InputProps, TextareaProps, ModalProps, CardProps
- **Form Types**: SignUpFormData, SignInFormData, ProjectFormData, InvestmentFormData

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Environment Variables

Required environment variables (see `.env.example`):

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Code Organization Best Practices

1. **Components**: Small, reusable, single-responsibility components
2. **Types**: Centralized type definitions for consistency
3. **Hooks**: Custom hooks for shared logic
4. **Contexts**: Global state management for auth and other cross-cutting concerns
5. **Pages**: Route-level components that compose smaller components

## Migration from JavaScript

All `.jsx` and `.js` files have been converted to `.tsx` and `.ts`:

- Updated all imports to use TypeScript extensions
- Added proper type annotations
- Centralized Supabase client in `src/lib/supabase.ts`
- Created comprehensive type definitions in `src/types/index.ts`

## Next Steps

1. Run `npm run dev` to start the development server
2. Run `npm run typecheck` to verify TypeScript compilation
3. Review and update component props with proper TypeScript types as needed
4. Add additional type definitions for any missing interfaces
