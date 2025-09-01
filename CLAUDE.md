# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs on port 8081)
- **Build**: `npm run build` (TypeScript compile + Vite build)
- **Lint**: `npm run lint` (ESLint)
- **Test**: `npm run test` (Playwright tests)
- **Test UI**: `npm run test:ui` (Playwright test UI)
- **Preview**: `npm run preview` (preview built application)

## Architecture

This is a React + TypeScript application with Redux Toolkit for state management, using a modular architecture pattern.

### Core Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **State Management**: Redux Toolkit with RTK Query for API calls
- **UI Framework**: Material-UI (MUI) v7 + Emotion for styling
- **Routing**: React Router v7
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Playwright for E2E testing

### Project Structure

The codebase follows a feature-based module structure:

```
src/
├── core/                    # Core shared utilities and abstractions
│   ├── api/                # Base API utilities, error handling, transforms
│   ├── filters/            # Filter system (field resolvers, friendly filters)
│   └── types/             # Shared type definitions
├── modules/               # Feature modules (self-contained domains)
│   ├── academic-years/
│   └── programs/
│       ├── components/    # Module-specific UI components
│       ├── hooks/         # Module-specific custom hooks
│       ├── pages/         # Module page components
│       ├── store/         # Module state (API + slices)
│       ├── types/         # Module type definitions
│       └── schema/        # Module validation schemas
├── store/                 # Global store configuration and shared APIs
├── components/            # Shared/global components
├── hooks/                 # Shared/global hooks
├── pages/                 # Global page components (legacy)
└── utils/                 # General utilities
```

### State Management Architecture

**RTK Query Pattern**: Each module has its own API slice with standardized structure:
- Base query configuration in `src/store/api/baseQuery.ts`
- Module APIs follow pattern: `modules/{module}/store/api/{module}Api.ts`
- Global APIs in `src/store/api/`
- Slices for local state management alongside RTK Query

**Store Configuration**: Centralized in `src/store/index.ts` with:
- Module reducers and API reducers
- Middleware setup for RTK Query
- Type exports for RootState and AppDispatch

### Filter System Architecture

The application includes a sophisticated filter system with two main approaches:

**1. Core Filter System** (`src/core/filters/`):
- Generic field resolvers for different data types
- Friendly filter transformations for UI display
- Primitive extraction for performance optimization

**2. Module-Specific Hooks** (`src/hooks/filters/`):
- `useGenericFriendlyFilterResolver`: Generic hook for any filter model
- `useGenericFriendlyFilterChange`: Handles filter state changes
- Performance-optimized with memoization strategies

### API Integration

**Base Configuration**:
- Default API URL: `https://api-iqac.darshanums.in/api`
- Configurable via `VITE_API_URL` environment variable
- Bearer token authentication from localStorage
- Comprehensive error handling and logging

**Error Handling** (`src/core/api/error-handling.ts`):
- Standardized error processing with `useApiError` hook
- Support for validation errors and general API errors
- Field-level error extraction for forms

### Component Patterns

**Layout**: AppShell pattern with Sidebar and TopNavigation
**Pages**: Feature-based pages in module directories
**Forms**: React Hook Form + Zod validation
**Data Display**: MUI DataGrid for list views
**Filtering**: Integrated filter components with friendly display

## Key Conventions

- Use existing Material-UI components and follow MUI patterns
- Module APIs should extend the base RTK Query setup
- Filter hooks should use the generic resolver system when possible
- Error handling should use the centralized `useApiError` hook
- Type definitions should be co-located with their respective modules
- Use the established folder structure for new features

## Environment Setup

- Node.js project with npm/pnpm
- TypeScript strict mode enabled
- ESLint configuration with React and TypeScript rules
- Vite for build tooling and development server