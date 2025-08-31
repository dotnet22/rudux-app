/**
 * Usage examples for the Generic Friendly Filter Resolver system.
 * 
 * This file demonstrates how to use the new generic filter system
 * with different filter models and configurations.
 */

import type { ProgramFilterModel } from '../../types/program'
import type { FilterModel } from '../../types/academicYear'
import type { ComboBoxItem, University } from '../../types/comboBox'
import { 
  useGenericFriendlyFilterResolver,
  useAutoFriendlyFilterResolver
} from './index'
import { extractFriendlyFilterPrimitives } from '../../utils/filters/primitiveExtraction'

// ============================================================================
// Example 1: Basic Usage with ProgramFilterModel
// ============================================================================

export const useProgramFilterExample = (
  programFilters: ProgramFilterModel,
  universities: University[],
  faculties: ComboBoxItem[],
  courses: ComboBoxItem[]
) => {
  // Use the generic resolver directly - no presets needed
  const friendlyFilter = useGenericFriendlyFilterResolver({
    filterModel: programFilters,
    fieldResolvers: {
      UniversityPK: { type: 'dropdown', dataSource: universities },
      FacultyPK: { type: 'dropdown', dataSource: faculties },
      CoursePK: { type: 'dropdown', dataSource: courses },
      IsActive: { 
        type: 'boolean',
        booleanLabels: { true: 'Active', false: 'Inactive', null: 'All' }
      },
      SearchTerm: { type: 'string' },
      CreatedAfter: { type: 'date', dateFormat: 'MM/DD/YYYY' }
    },
    dateFormat: 'MM/DD/YYYY'
  })

  // For performance optimization in useEffect
  const primitives = extractFriendlyFilterPrimitives(friendlyFilter)
  
  return { friendlyFilter, primitives }
}

// ============================================================================
// Example 2: Academic Year Filter Model
// ============================================================================

export const useAcademicYearFilterExample = (
  academicYearFilters: FilterModel,
  universities: University[],
  faculties: ComboBoxItem[],
  courses: ComboBoxItem[],
  specializations: ComboBoxItem[]
) => {
  return useGenericFriendlyFilterResolver({
    filterModel: academicYearFilters,
    fieldResolvers: {
      ProgramName: { type: 'string' },
      UniversityPK: { type: 'dropdown', dataSource: universities },
      CoursePK: { type: 'dropdown', dataSource: courses },
      FacultyPK: { type: 'dropdown', dataSource: faculties },
      SpecializationPK: { type: 'dropdown', dataSource: specializations }
    }
  })
}

// ============================================================================
// Example 3: Custom Filter Model with Custom Resolvers
// ============================================================================

interface CustomFilterModel {
  priority: number
  status: 'draft' | 'published' | 'archived'
  tags: string[]
  createdDate: Date | null
  isUrgent: boolean | null
}

export const useCustomFilterExample = (customFilters: CustomFilterModel) => {
  return useGenericFriendlyFilterResolver({
    filterModel: customFilters,
    fieldResolvers: {
      priority: {
        type: 'custom',
        customResolver: (value: unknown) => {
          const num = value as number
          if (num >= 8) return 'High Priority'
          if (num >= 5) return 'Medium Priority'
          return 'Low Priority'
        }
      },
      status: {
        type: 'custom',
        customResolver: (value: unknown) => {
          const str = value as string
          return str.charAt(0).toUpperCase() + str.slice(1)
        }
      },
      tags: {
        type: 'custom',
        customResolver: (value: unknown) => {
          const arr = value as string[]
          return arr && arr.length > 0 ? arr.join(', ') : 'No tags'
        }
      },
      createdDate: {
        type: 'date',
        dateFormat: 'YYYY-MM-DD'
      },
      isUrgent: {
        type: 'boolean',
        booleanLabels: {
          true: 'Urgent',
          false: 'Normal',
          null: 'All'
        }
      }
    }
  })
}

// ============================================================================
// Example 4: Auto-detection with Minimal Configuration
// ============================================================================

interface SimpleFilterModel {
  searchTerm: string | null
  isActive: boolean | null
  createdAfter: Date | null
}

export const useAutoDetectionExample = (simpleFilters: SimpleFilterModel) => {
  // This will automatically handle most field types
  return useAutoFriendlyFilterResolver(simpleFilters, 'MM/DD/YYYY')
}

// ============================================================================
// Example 5: Using Common Field Resolvers
// ============================================================================

export const useCommonResolversExample = (
  filters: ProgramFilterModel,
  universities: University[],
  faculties: ComboBoxItem[],
  courses: ComboBoxItem[]
) => {
  return useGenericFriendlyFilterResolver({
    filterModel: filters,
    fieldResolvers: {
      UniversityPK: { type: 'dropdown', dataSource: universities },
      FacultyPK: { type: 'dropdown', dataSource: faculties },
      CoursePK: { type: 'dropdown', dataSource: courses },
      IsActive: { 
        type: 'boolean',
        booleanLabels: { true: 'Active', false: 'Inactive', null: 'All' }
      },
      SearchTerm: { type: 'string' },
      CreatedAfter: { type: 'date', dateFormat: 'MM/DD/YYYY' }
    }
  })
}

// ============================================================================
// Example 6: Performance Optimization in React Components
// ============================================================================

export const performanceOptimizationExample = () => {
  // In a React component, you would use it like this:
  /*
  
  const YourComponent = ({ filterModel, universities, faculties, courses }) => {
    const friendlyFilter = useGenericFriendlyFilterResolver({
      filterModel,
      fieldResolvers: createProgramFilterResolverConfig(
        universities, 
        faculties, 
        courses
      )
    })

    // Extract primitives for optimal memoization
    const primitives = extractFriendlyFilterPrimitives(friendlyFilter)

    // Use in useEffect with primitive dependencies (same performance as manual approach)
    useEffect(() => {
      dispatch(setFriendlyFilters(friendlyFilter))
    }, [dispatch, ...primitives])

    return <YourFilterDisplay filters={friendlyFilter} />
  }

  */
}

// ============================================================================
// Performance Comparison
// ============================================================================

/*
BEFORE (Manual approach):
useEffect(() => {
  dispatch(setFriendlyFilters(friendlyFilter))
}, [
  dispatch,
  friendlyFilter.UniversityPK?.Label,
  friendlyFilter.UniversityPK?.Value,
  friendlyFilter.FacultyPK?.Label, 
  friendlyFilter.FacultyPK?.Value,
  friendlyFilter.CoursePK?.Label,
  friendlyFilter.CoursePK?.Value,
  friendlyFilter.IsActive?.Label,
  friendlyFilter.IsActive?.Value,
  friendlyFilter.SearchTerm?.Label,
  friendlyFilter.SearchTerm?.Value,
  friendlyFilter.CreatedAfter?.Label,
  friendlyFilter.CreatedAfter?.Value,
])

AFTER (Generic approach with same performance):
const primitives = extractFriendlyFilterPrimitives(friendlyFilter)
useEffect(() => {
  dispatch(setFriendlyFilters(friendlyFilter))
}, [dispatch, ...primitives])
*/