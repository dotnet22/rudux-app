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
│   ├── hooks/              # Core shared hooks
│   │   └── tanstack/       # TanStack Query cache integration hooks
│   └── types/             # Shared type definitions
├── modules/               # Feature modules (self-contained domains)
│   ├── academic-years/
│   └── programs/
│       ├── components/    # Module-specific UI components
│       ├── hooks/         # Module-specific custom hooks
│       ├── pages/         # Module page components
│       ├── store/         # Module state (API + slices)
│       ├── types/         # Module type definitions
│       ├── schema/        # Module validation schemas
│       └── utils/         # Module-specific utilities (transforms, helpers)
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

The application includes a sophisticated filter system with multiple approaches:

**1. Core Filter System** (`src/core/filters/`):
- Generic field resolvers for different data types
- Friendly filter transformations for UI display
- Primitive extraction for performance optimization

**2. Module-Specific Hooks** (`src/hooks/filters/`):
- `useGenericFriendlyFilterResolver`: Generic hook for any filter model
- `useGenericFriendlyFilterChange`: Handles filter state changes
- Performance-optimized with memoization strategies

**3. TanStack Query Cache Integration** (`src/core/hooks/tanstack/`):
- `useCacheDataResolver`: Access cached dropdown data from TanStack Query
- `useCascadingCacheDataResolver`: Handle cascading dropdowns (University → Faculty → Course)
- `useFriendlyFilterWithCache`: Single field cache integration with friendly filters
- `useFriendlyFilterWithCascadingCache`: Full cascading cache integration with friendly filters
- Full support for `@lukemorales/query-key-factory`
- Custom friendly names for any field
- Smart data transformation with auto-detection fallbacks

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

**Data Transformation** (`src/core/api/transforms.ts`):
- Generic `sanitizeFormData` utility for form-to-entity transformations
- Handles common patterns: primary key defaults, empty string to null conversion
- Type-safe with generic constraints for reusability across modules

### Component Patterns

**Layout**: AppShell pattern with Sidebar and TopNavigation
**Pages**: Feature-based pages in module directories
**Forms**: React Hook Form + Zod validation
**Data Display**: MUI DataGrid for list views
**Filtering**: Integrated filter components with friendly display

## Key Conventions

### General Conventions
- Use existing Material-UI components and follow MUI patterns
- Module APIs should extend the base RTK Query setup
- Error handling should use the centralized `useApiError` hook
- Type definitions should be co-located with their respective modules
- Use the established folder structure for new features
- For form-to-entity transformations, use the `sanitizeFormData` utility from `src/core/api/transforms.ts`
- Module-specific transformers should be placed in `modules/{module}/utils/transforms.ts`

### Filter System Conventions
- **For Redux-based filters**: Use the generic resolver system (`useGenericFriendlyFilterResolver`)
- **For TanStack Query cache filters**: Use the TanStack cache integration hooks (`useFriendlyFilterWithCascadingCache`)
- **Query Key Management**: Use `@lukemorales/query-key-factory` for centralized query key management
- **Data Transformation**: Prefer single `dataTransformer` functions over multiple field-specific selectors
- **Friendly Names**: Provide meaningful friendly names for all filter fields using the `friendlyName` property
- **Cascading Dropdowns**: Use the cascading cache resolver hooks for parent-child dropdown dependencies

### TanStack Query Cache Integration
- **Cache Data Access**: Use `useCacheDataResolver` for simple dropdown data retrieval
- **Cascading Dropdowns**: Use `useCascadingCacheDataResolver` for University → Faculty → Course patterns
- **Friendly Filters**: Use `useFriendlyFilterWithCascadingCache` for complete filter label resolution
- **Query Keys**: Leverage query-key-factory for type-safe, centralized query key management
- **Data Transformation**: Implement common `dataTransformer` functions that work across all fields
- **Auto-Detection**: Rely on smart auto-detection for standard field patterns when possible

## Environment Setup

- Node.js project with npm/pnpm
- TypeScript strict mode enabled
- ESLint configuration with React and TypeScript rules
- Vite for build tooling and development server

## Key Dependencies

### Core Dependencies
- **React 19** + TypeScript + Vite
- **Material-UI v7** for UI components
- **Redux Toolkit** with RTK Query for state management
- **React Hook Form** + Zod for form handling
- **React Router v7** for routing

### Optional TanStack Query Integration
- **@tanstack/react-query** for alternative cache management
- **@lukemorales/query-key-factory** for type-safe query key management
- Hooks available in `src/core/hooks/tanstack/` for cache-based filtering

The application supports both Redux Toolkit (primary) and TanStack Query (optional) approaches for state management and caching, with specialized hooks for integrating TanStack Query cache data with the existing filter system.
- Instructions while testing app using playwright-mcp
dont' open browser in incognito mode, else you won' get access to jwt token stored in localStorage
dont' open app on port other than 8081, else you will get CORS error