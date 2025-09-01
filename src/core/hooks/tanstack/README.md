# TanStack Query Cache Data Access for Filters

Advanced React hooks for accessing cached data from TanStack Query with full cascading dropdown support and friendly filter integration. Designed to work seamlessly with `@lukemorales/query-key-factory` and provide the same functionality as the existing Redux-based filter system.

## Overview

This module provides comprehensive cache data access utilities:

- **Single Field Cache Access** - Simple dropdown data retrieval
- **Cascading Dropdown Support** - Parent-child dropdown dependencies (University → Faculty → Course)
- **Friendly Filter Integration** - Convert cache data to user-friendly filter labels
- **Query Key Factory Support** - Native integration with `@lukemorales/query-key-factory`
- **Custom Field Names** - Configurable friendly names for any field
- **Smart Data Transformation** - Single transformer for all fields with auto-detection fallbacks

## Installation & Setup

Ensure you have the required packages installed:

```bash
npm install @tanstack/react-query @lukemorales/query-key-factory
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

### Query Key Factory Setup (Recommended)

```tsx
// queries/index.ts
import { createQueryKeys } from '@lukemorales/query-key-factory'

export const queries = createQueryKeys('academic', {
  universities: null,
  faculties: (universityId: string) => ({
    queryKey: ['faculties', universityId]
  }),
  courses: (facultyId: string) => ({
    queryKey: ['courses', facultyId]
  })
})
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

Handles cascading dropdown patterns where child dropdowns depend on parent selections, with full query-key-factory support and custom friendly names.

```tsx
import { useCascadingCacheDataResolver } from '@/core/hooks/tanstack'
import { queries } from './queries'

const CascadingDropdowns = () => {
  const [filterModel, setFilterModel] = useState({
    universityId: 'univ-123',
    facultyId: null,
    courseId: null
  })

  const { 
    dataByField, 
    getFieldData, 
    isFieldAvailable, 
    getFieldFriendlyName 
  } = useCascadingCacheDataResolver({
    filterModel,
    fieldConfigs: [
      // Universities (independent)
      {
        fieldName: 'universityId',
        queryKey: queries.universities.queryKey,
        friendlyName: 'Educational Institution' // Custom friendly name
      },
      // Faculties (depends on university)
      {
        fieldName: 'facultyId',
        queryKey: (universityId) => queries.faculties(universityId).queryKey, // Query key factory
        parentField: 'universityId',
        friendlyName: 'Academic School' // Custom friendly name
      },
      // Courses (depends on faculty)
      {
        fieldName: 'courseId',
        queryKey: (facultyId) => queries.courses(facultyId).queryKey, // Query key factory
        parentField: 'facultyId',
        friendlyName: 'Study Program' // Custom friendly name
      }
    ],
    // Single data transformer for all fields - much cleaner!
    dataTransformer: (data, fieldName) => {
      if (Array.isArray(data)) {
        return data.map(item => ({
          Value: item.id,
          Label: item.name
        }))
      }
      return []
    }
  })

  return (
    <div>
      <Autocomplete
        label={getFieldFriendlyName('universityId')} // Uses custom friendly name
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
        label={getFieldFriendlyName('facultyId')} // Uses custom friendly name
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
        label={getFieldFriendlyName('courseId')} // Uses custom friendly name
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

Combines cascading cache data with friendly filter resolution. Works with query-key-factory and supports custom friendly names for clean filter display.

```tsx
import { useFriendlyFilterWithCascadingCache } from '@/core/hooks/tanstack'
import { queries } from './queries'

const CascadingFilterDisplay = () => {
  const [filterModel, setFilterModel] = useState({
    universityId: 'univ-123',
    facultyId: 'fac-456',
    courseId: null,
    isActive: true,
    searchTerm: 'computer science'
  })

  // Get friendly labels with cascading cache data - much cleaner API!
  const friendlyFilters = useFriendlyFilterWithCascadingCache({
    filterModel,
    cascadingFields: [
      {
        fieldName: 'universityId',
        queryKey: queries.universities.queryKey,
        friendlyName: 'Institution' // Custom display name
      },
      {
        fieldName: 'facultyId',
        queryKey: (universityId) => queries.faculties(universityId).queryKey, // Query key factory
        parentField: 'universityId',
        friendlyName: 'School' // Custom display name
      },
      {
        fieldName: 'courseId',
        queryKey: (facultyId) => queries.courses(facultyId).queryKey, // Query key factory
        parentField: 'facultyId',
        friendlyName: 'Program' // Custom display name
      }
    ],
    // Single data transformer for all cascading fields
    dataTransformer: (data, fieldName) => {
      if (Array.isArray(data)) {
        return data.map(item => ({
          Value: item.id,
          Label: item.name
        }))
      }
      return []
    },
    // Field resolvers for non-cascading fields
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
            label={filter.Label} // Uses resolved friendly labels
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

For the common cascading pattern, use the simplified hook with query-key-factory:

```tsx
import { useUniversityFacultyCourseFriendlyFilter } from '@/core/hooks/tanstack'
import { queries } from './queries'

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
      universities: queries.universities.queryKey,
      faculties: (universityId) => queries.faculties(universityId).queryKey,
      courses: (facultyId) => queries.courses(facultyId).queryKey
    },
    {
      friendlyNames: {
        university: 'Educational Institution',
        faculty: 'Academic School',
        course: 'Study Program'
      },
      dataTransformer: (data, fieldName) => {
        if (Array.isArray(data)) {
          return data.map(item => ({
            Value: item.id,
            Label: item.name
          }))
        }
        return []
      },
      otherFieldResolvers: {
        isActive: { 
          type: 'boolean',
          booleanLabels: {
            true: 'Active Programs',
            false: 'Inactive Programs',
            null: 'All Programs'
          }
        }
      }
    }
  )

  return (
    <div>
      {Object.entries(friendlyFilters).map(([key, filter]) => 
        filter.Value !== null && (
          <Chip key={key} label={filter.Label} />
        )
      )}
    </div>
  )
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

### 1. Use query-key-factory for better organization
```tsx
// Recommended: Centralized query key management
import { createQueryKeys } from '@lukemorales/query-key-factory'

const queries = createQueryKeys('academic', {
  universities: null,
  faculties: (universityId: string) => ({ queryKey: ['faculties', universityId] }),
  courses: (facultyId: string) => ({ queryKey: ['courses', facultyId] })
})

// Usage in hooks
const { getFieldData } = useCascadingCacheDataResolver({
  filterModel,
  fieldConfigs: [
    {
      fieldName: 'universityId',
      queryKey: queries.universities.queryKey // Type-safe and centralized
    }
  ]
})
```

### 2. Use single dataTransformer instead of multiple selectors
```tsx
// Recommended: Single transformer for all fields
const commonDataTransformer = (data: unknown, fieldName: string): ComboBoxItem[] => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      Value: item.id || item.pk || item.value,
      Label: item.name || item.title || item.label
    }))
  }
  return []
}

// Apply to all hooks
const friendlyFilters = useFriendlyFilterWithCascadingCache({
  filterModel,
  cascadingFields: [...],
  dataTransformer: commonDataTransformer // Reuse everywhere
})
```

### 3. Provide meaningful friendly names
```tsx
// Good: Descriptive friendly names
{
  fieldName: 'universityId',
  queryKey: queries.universities.queryKey,
  friendlyName: 'Educational Institution' // Clear and descriptive
}

// Avoid: Generic or technical names
{
  fieldName: 'universityId',
  queryKey: queries.universities.queryKey,
  friendlyName: 'University ID' // Too technical
}
```

### 4. Handle auto-detection gracefully
```tsx
// The hooks provide smart auto-detection as fallback
const { getFieldData } = useCascadingCacheDataResolver({
  filterModel,
  fieldConfigs: [...],
  // No dataTransformer provided - will auto-detect:
  // Value: item.Value || item.value || item.id
  // Label: item.Label || item.label || item.name || item.title
})
```

### 5. Use const assertions for type safety
```tsx
// Good: Prevents accidental mutations and improves type inference
const { data } = useCacheDataResolver({
  queryKey: ['universities', 'active'] as const
})

// Better: Use query-key-factory (automatically const)
const { data } = useCacheDataResolver({
  queryKey: queries.universities.queryKey // Already const from factory
})
```