# TanStack Query Cache Data Access for Filters

Simple React hooks for accessing cached data from TanStack Query to use with the existing filter resolver system. These utilities allow you to retrieve dropdown/combo box data from cache to create friendly filter labels.

## Overview

This module provides two focused hooks:

- **Cache Data Access** - Retrieve dropdown data from TanStack Query cache
- **Friendly Filter Integration** - Use cached data with the existing filter resolver system

## Installation & Setup

Ensure you have TanStack Query installed and configured in your project:

```bash
npm install @tanstack/react-query
```

```tsx
// In your app root
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  )
}
```

## Core Hooks

### `useCacheDataResolver`

The primary hook for accessing cached dropdown/combo box data.

```tsx
import { useCacheDataResolver } from '@/core/hooks/tanstack'

const FilterForm = () => {
  const { data: universities, isAvailable } = useCacheDataResolver({
    queryKey: ['universities', 'list'],
    dataSelector: (response: ApiResponse<University[]>) => response.data.map(u => ({
      Value: u.id,
      Label: u.name
    })),
    enabled: true
  })

  if (!isAvailable) return <div>Loading universities...</div>

  return (
    <Autocomplete
      options={universities}
      getOptionLabel={(option) => option.Label}
      // ... other props
    />
  )
}
```

#### Configuration Options

```tsx
interface CacheDataConfig<T> {
  queryKey: string[]
  dataSelector?: (cachedData: T) => ComboBoxItem[]
  enabled?: boolean
}

interface CacheDataResult {
  data: ComboBoxItem[]
  isAvailable: boolean
  isEmpty: boolean
}
```

### `useFriendlyFilterWithCache`

Hook that integrates cached dropdown data with the existing filter resolver system.

```tsx
import { useFriendlyFilterWithCache } from '@/core/hooks/tanstack'

const ProgramsFilter = () => {
  const [filterModel, setFilterModel] = useState({
    universityId: '123',
    facultyId: '456',
    isActive: true,
    searchTerm: 'computer'
  })

  // Get friendly filter labels with cached university data
  const friendlyFilter = useFriendlyFilterWithCache(
    filterModel,
    'universityId', // Field that uses cached data
    {
      queryKey: ['universities', 'list'],
      dataSelector: (response: ApiResponse<University[]>) => 
        response.data.map(u => ({ Value: u.id, Label: u.name }))
    },
    {
      // Other field resolvers
      facultyId: { type: 'dropdown', dataSource: facultyOptions },
      isActive: { type: 'boolean' },
      searchTerm: { type: 'string' }
    }
  )

  return (
    <div>
      <h3>Active Filters:</h3>
      {Object.entries(friendlyFilter).map(([key, filter]) => 
        filter.Value && (
          <Chip key={key} label={`${key}: ${filter.Label}`} />
        )
      )}
    </div>
  )
}
```

## Usage Examples

### Basic Cache Data Access

```tsx
import { useCacheDataResolver } from '@/core/hooks/tanstack'

// For simple cache data that's already in ComboBoxItem format
const SimpleDropdown = () => {
  const { data: options, isAvailable } = useCacheDataResolver({
    queryKey: ['dropdown', 'simple'],
    enabled: true
  })

  return (
    <Autocomplete
      options={options}
      loading={!isAvailable}
      getOptionLabel={(option) => option.Label}
      getOptionKey={(option) => option.Value}
    />
  )
}

// For complex API responses that need transformation
const ComplexDropdown = () => {
  const { data: universities, isAvailable } = useCacheDataResolver({
    queryKey: ['universities', 'all'],
    dataSelector: (response: { data: University[], meta: any }) => 
      response.data.map(university => ({
        Value: university.id,
        Label: `${university.name} (${university.code})`
      })),
    enabled: true
  })

  return (
    <Autocomplete
      options={universities}
      loading={!isAvailable}
      getOptionLabel={(option) => option.Label}
    />
  )
}
```

## Cascading Dropdown Support

### `useCascadingCacheDataResolver`

Handles cascading dropdown patterns where child dropdowns depend on parent selections, just like the existing Redux solution.

```tsx
import { useCascadingCacheDataResolver } from '@/core/hooks/tanstack'

const CascadingDropdowns = () => {
  const [filterModel, setFilterModel] = useState({
    universityId: 'univ-123',
    facultyId: null,
    courseId: null
  })

  const { dataByField, getFieldData, isFieldAvailable } = useCascadingCacheDataResolver({
    filterModel,
    fieldConfigs: [
      // Universities (independent)
      {
        fieldName: 'universityId',
        cacheConfig: {
          queryKey: ['universities', 'list'] as const,
          dataSelector: (unis: University[]) => 
            unis.map(u => ({ Value: u.id, Label: u.name }))
        }
      },
      // Faculties (depends on university)
      {
        fieldName: 'facultyId',
        cacheConfig: {
          queryKey: [] as const, // Will be built dynamically
          dataSelector: (faculties: Faculty[]) => 
            faculties.map(f => ({ Value: f.id, Label: f.name }))
        },
        parentField: 'universityId',
        buildQueryKey: (universityId) => ['faculties', 'by-university', universityId] as const
      },
      // Courses (depends on faculty)
      {
        fieldName: 'courseId',
        cacheConfig: {
          queryKey: [] as const,
          dataSelector: (courses: Course[]) => 
            courses.map(c => ({ Value: c.id, Label: c.name }))
        },
        parentField: 'facultyId',
        buildQueryKey: (facultyId) => ['courses', 'by-faculty', facultyId] as const
      }
    ]
  })

  return (
    <div>
      <Autocomplete
        options={getFieldData('universityId')}
        value={filterModel.universityId}
        onChange={(_, value) => setFilterModel(prev => ({ 
          ...prev, 
          universityId: value,
          facultyId: null, // Reset dependent fields
          courseId: null 
        }))}
      />
      
      <Autocomplete
        options={getFieldData('facultyId')}
        value={filterModel.facultyId}
        disabled={!isFieldAvailable('facultyId')}
        onChange={(_, value) => setFilterModel(prev => ({ 
          ...prev, 
          facultyId: value,
          courseId: null // Reset dependent fields
        }))}
      />
      
      <Autocomplete
        options={getFieldData('courseId')}
        value={filterModel.courseId}
        disabled={!isFieldAvailable('courseId')}
        onChange={(_, value) => setFilterModel(prev => ({ 
          ...prev, 
          courseId: value
        }))}
      />
    </div>
  )
}
```

### `useFriendlyFilterWithCascadingCache`

Combines cascading cache data with friendly filter resolution, providing the same functionality as the Redux-based solution.

```tsx
import { useFriendlyFilterWithCascadingCache } from '@/core/hooks/tanstack'

const CascadingFilterDisplay = () => {
  const [filterModel, setFilterModel] = useState({
    universityId: 'univ-123',
    facultyId: 'fac-456',
    courseId: null,
    isActive: true,
    searchTerm: 'computer science'
  })

  // Get friendly labels with cascading cache data
  const friendlyFilters = useFriendlyFilterWithCascadingCache({
    filterModel,
    cascadingFields: [
      {
        fieldName: 'universityId',
        cacheConfig: {
          queryKey: ['universities', 'list'] as const,
          dataSelector: (unis: University[]) => unis.map(u => ({ Value: u.id, Label: u.name }))
        }
      },
      {
        fieldName: 'facultyId',
        cacheConfig: {
          queryKey: [] as const,
          dataSelector: (faculties: Faculty[]) => faculties.map(f => ({ Value: f.id, Label: f.name }))
        },
        parentField: 'universityId',
        buildQueryKey: (universityId) => ['faculties', 'by-university', universityId] as const
      },
      {
        fieldName: 'courseId',
        cacheConfig: {
          queryKey: [] as const,
          dataSelector: (courses: Course[]) => courses.map(c => ({ Value: c.id, Label: c.name }))
        },
        parentField: 'facultyId',
        buildQueryKey: (facultyId) => ['courses', 'by-faculty', facultyId] as const
      }
    ],
    fieldResolvers: {
      isActive: { 
        type: 'boolean',
        booleanLabels: {
          true: 'Active Only',
          false: 'Inactive Only',
          null: 'All Programs'
        }
      },
      searchTerm: { type: 'string' }
    }
  })

  return (
    <div>
      <Typography variant="h6">Active Filters:</Typography>
      {Object.entries(friendlyFilters).map(([key, filter]) => 
        filter.Value !== null && (
          <Chip 
            key={key}
            label={`${key}: ${filter.Label}`}
            onDelete={() => {
              // Handle cascading resets
              if (key === 'universityId') {
                setFilterModel(prev => ({ ...prev, universityId: null, facultyId: null, courseId: null }))
              } else if (key === 'facultyId') {
                setFilterModel(prev => ({ ...prev, facultyId: null, courseId: null }))
              } else {
                setFilterModel(prev => ({ ...prev, [key]: null }))
              }
            }}
          />
        )
      )}
    </div>
  )
}
```

### Simplified University-Faculty-Course Pattern

For the common cascading pattern, use the simplified hook:

```tsx
import { useUniversityFacultyCourseFriendlyFilter } from '@/core/hooks/tanstack'

const SimplifiedCascadingFilter = () => {
  const filterModel = {
    universityId: 'univ-123',
    facultyId: 'fac-456', 
    courseId: null,
    isActive: true
  }

  const friendlyFilters = useUniversityFacultyCourseFriendlyFilter(
    filterModel,
    {
      university: 'universityId',
      faculty: 'facultyId',
      course: 'courseId'
    },
    {
      universities: (unis: University[]) => unis.map(u => ({ Value: u.id, Label: u.name })),
      faculties: (faculties: Faculty[]) => faculties.map(f => ({ Value: f.id, Label: f.name })),
      courses: (courses: Course[]) => courses.map(c => ({ Value: c.id, Label: c.name }))
    },
    {
      isActive: { type: 'boolean' }
    }
  )

  // Use friendlyFilters...
}
```

### Integration with Filter System

```tsx
import { useFriendlyFilterWithCache } from '@/core/hooks/tanstack'

interface ProgramFilter {
  universityId: string | null
  facultyId: string | null  
  isActive: boolean | null
  searchTerm: string | null
}

const ProgramFilterDisplay = () => {
  const [filter, setFilter] = useState<ProgramFilter>({
    universityId: 'univ-123',
    facultyId: null,
    isActive: true,
    searchTerm: 'computer science'
  })

  // Get friendly labels with cached university data
  const friendlyFilters = useFriendlyFilterWithCache(
    filter,
    'universityId',
    {
      queryKey: ['universities', 'list'],
      dataSelector: (response: ApiResponse<University[]>) => 
        response.data.map(u => ({ 
          Value: u.id, 
          Label: u.name 
        }))
    },
    {
      facultyId: { 
        type: 'dropdown', 
        dataSource: facultyOptions 
      },
      isActive: { 
        type: 'boolean',
        booleanLabels: {
          true: 'Active Programs',
          false: 'Inactive Programs', 
          null: 'All Programs'
        }
      },
      searchTerm: { 
        type: 'string' 
      }
    }
  )

  return (
    <div>
      <Typography variant="h6">Active Filters:</Typography>
      {Object.entries(friendlyFilters).map(([key, filterValue]) => 
        filterValue.Value !== null && (
          <Chip 
            key={key}
            label={`${key}: ${filterValue.Label}`}
            onDelete={() => setFilter(prev => ({ ...prev, [key]: null }))}
          />
        )
      )}
    </div>
  )
}
```

## TypeScript Support & IntelliSense

All hooks provide full type safety and excellent IDE support:

```tsx
// Define your API response types
interface University {
  id: string
  name: string
  code: string
  country: string
}

interface ApiResponse<T> {
  data: T
  meta: {
    total: number
    page: number
  }
}

// Use with full type safety
const TypeSafeExample = () => {
  // Full type inference for the data selector
  const { data, isAvailable } = useCacheDataResolver<ApiResponse<University[]>>({
    queryKey: ['universities', 'all'],
    dataSelector: (response) => {
      // TypeScript knows response is ApiResponse<University[]>
      return response.data.map(university => ({
        // IDE will autocomplete university properties
        Value: university.id,
        Label: `${university.name} - ${university.code}`
      }))
    },
    enabled: true
  })

  // TypeScript ensures ComboBoxItem structure
  return (
    <Autocomplete
      options={data} // Type: ComboBoxItem[]
      getOptionLabel={(option) => option.Label} // Autocomplete works
      getOptionKey={(option) => option.Value}   // Type-safe access
    />
  )
}

// Filter model with strict typing
interface StrictProgramFilter {
  readonly universityId: string | null
  readonly facultyId: string | null
  readonly courseLevel: 'undergraduate' | 'graduate' | null
  readonly isActive: boolean | null
}

const StrictlyTypedFilter = () => {
  const [filter, setFilter] = useState<StrictProgramFilter>({
    universityId: null,
    facultyId: null,
    courseLevel: null,
    isActive: null
  })

  // Full type safety with filter keys
  const friendlyFilter = useFriendlyFilterWithCache(
    filter,
    'universityId' as const, // TypeScript ensures this key exists in filter
    {
      queryKey: ['universities', 'dropdown'] as const,
      dataSelector: (unis: University[]) => unis.map(u => ({
        Value: u.id,
        Label: u.name
      }))
    },
    {
      facultyId: { type: 'dropdown' },
      courseLevel: { 
        type: 'dropdown',
        dataSource: [
          { Value: 'undergraduate', Label: 'Undergraduate' },
          { Value: 'graduate', Label: 'Graduate' }
        ]
      },
      isActive: { type: 'boolean' }
    }
  )

  // Return type is FriendlyFilterRecord<StrictProgramFilter>
  return (
    <div>
      {/* TypeScript knows all possible keys */}
      <Chip label={friendlyFilter.universityId.Label} />
      <Chip label={friendlyFilter.courseLevel.Label} />
    </div>
  )
}
```

## Best Practices

### 1. Use const assertions for query keys
```tsx
// Good: Prevents accidental mutations and improves type inference
const { data } = useCacheDataResolver({
  queryKey: ['universities', 'active'] as const
})

// Avoid: Mutable array type
const { data } = useCacheDataResolver({
  queryKey: ['universities', 'active'] 
})
```

### 2. Define reusable selector functions
```tsx
// Create typed selector functions
const selectUniversityOptions = (response: ApiResponse<University[]>): ComboBoxItem[] =>
  response.data.map(university => ({
    Value: university.id,
    Label: `${university.name} (${university.code})`
  }))

// Reuse across components
const UniversityDropdown = () => {
  const { data } = useCacheDataResolver({
    queryKey: ['universities', 'all'] as const,
    dataSelector: selectUniversityOptions
  })
}
```

### 3. Use discriminated unions for field types
```tsx
interface FilterField<T = any> {
  type: 'dropdown' | 'boolean' | 'string' | 'date'
  value: T
}

interface DropdownField extends FilterField<string | null> {
  type: 'dropdown'
  options: ComboBoxItem[]
}

interface BooleanField extends FilterField<boolean | null> {
  type: 'boolean'
  labels?: { true: string, false: string, null: string }
}

type TypedFilterField = DropdownField | BooleanField
```