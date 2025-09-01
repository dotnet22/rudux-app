import { useMemo } from 'react'
import type { FriendlyFilterRecord } from '../../../modules/programs/types/program'
import type { FieldResolverConfig } from '../../filters/field-resolvers'
import { resolveFieldValue } from '../../filters/field-resolvers'
import { createFriendlyFilterValue } from '../../filters/friendly-filters'
import { useCascadingCacheDataResolver, type CascadingFieldConfig } from './useCascadingCacheDataResolver'

/**
 * Configuration for friendly filter with cascading cache data
 */
export interface FriendlyFilterWithCascadingCacheConfig<T extends Record<string, unknown>> {
  /** The filter model containing all field values */
  readonly filterModel: T
  /** Configuration for cascading cache fields */
  readonly cascadingFields: readonly CascadingFieldConfig[]
  /** Field resolvers for non-cascading fields */
  readonly fieldResolvers?: FieldResolverConfig<T>
  /** Default date format for date fields */
  readonly dateFormat?: string
  /** Whether the resolver is enabled */
  readonly enabled?: boolean
}

/**
 * Hook for creating friendly filters with cascading dropdown data from TanStack Query cache.
 * This integrates cascading cache data resolution with the existing filter resolver system.
 * 
 * @template T The type of the filter model object
 * @param config Configuration object with filter model and cascading field configs
 * @returns Friendly filter record with resolved labels from cascading cache
 * 
 * @example
 * ```tsx
 * const friendlyFilter = useFriendlyFilterWithCascadingCache({
 *   filterModel: {
 *     universityId: 'univ-123',
 *     facultyId: 'fac-456',
 *     courseId: null,
 *     isActive: true,
 *     searchTerm: 'computer'
 *   },
 *   cascadingFields: [
 *     {
 *       fieldName: 'universityId',
 *       cacheConfig: {
 *         queryKey: ['universities', 'list'] as const,
 *         dataSelector: (unis: University[]) => unis.map(u => ({ Value: u.id, Label: u.name }))
 *       }
 *     },
 *     {
 *       fieldName: 'facultyId',
 *       cacheConfig: {
 *         queryKey: [] as const,
 *         dataSelector: (faculties: Faculty[]) => faculties.map(f => ({ Value: f.id, Label: f.name }))
 *       },
 *       parentField: 'universityId',
 *       buildQueryKey: (universityId) => ['faculties', 'by-university', universityId] as const
 *     },
 *     {
 *       fieldName: 'courseId',
 *       cacheConfig: {
 *         queryKey: [] as const,
 *         dataSelector: (courses: Course[]) => courses.map(c => ({ Value: c.id, Label: c.name }))
 *       },
 *       parentField: 'facultyId',
 *       buildQueryKey: (facultyId) => ['courses', 'by-faculty', facultyId] as const
 *     }
 *   ],
 *   fieldResolvers: {
 *     isActive: { type: 'boolean' },
 *     searchTerm: { type: 'string' }
 *   }
 * })
 * ```
 */
export const useFriendlyFilterWithCascadingCache = <T extends Record<string, unknown>>(
  config: FriendlyFilterWithCascadingCacheConfig<T>
): FriendlyFilterRecord<T> => {
  const { 
    filterModel, 
    cascadingFields, 
    fieldResolvers = {}, 
    dateFormat = 'MM/DD/YYYY',
    enabled = true
  } = config

  // Get cascading cache data for all configured fields
  const { dataByField } = useCascadingCacheDataResolver({
    filterModel,
    fieldConfigs: cascadingFields,
    enabled
  })

  // Create field name set for quick lookup
  const cascadingFieldNames = useMemo(() => 
    new Set(cascadingFields.map(field => field.fieldName))
  , [cascadingFields])

  return useMemo((): FriendlyFilterRecord<T> => {
    const result = {} as FriendlyFilterRecord<T>

    // Iterate through all keys in the filter model with proper typing
    for (const key in filterModel) {
      if (!Object.prototype.hasOwnProperty.call(filterModel, key)) continue
      
      const value = filterModel[key]
      let resolver = fieldResolvers[key]
      
      // If this is a cascading field, use the cached data
      if (cascadingFieldNames.has(key)) {
        const cacheData = dataByField[key]
        
        if (cacheData?.isAvailable) {
          resolver = {
            type: 'dropdown' as const,
            dataSource: [...cacheData.data], // Create a copy for immutability
            ...resolver // Allow override of resolver properties
          }
        }
      }
      
      // Resolve the field value to a friendly label
      const label = resolveFieldValue(value, resolver, dateFormat)
      
      // Create the friendly filter value with proper typing
      result[key] = createFriendlyFilterValue(
        label, 
        value as string | number | boolean | Date | null
      )
    }

    return result
  }, [filterModel, dataByField, cascadingFieldNames, fieldResolvers, dateFormat])
}

/**
 * Simplified hook for the common university -> faculty -> course cascading pattern
 */
export const useUniversityFacultyCourseFriendlyFilter = <
  T extends Record<string, unknown>
>(
  filterModel: T,
  fieldNames: {
    university: keyof T
    faculty: keyof T
    course: keyof T
  },
  cacheSelectors: {
    universities: (data: any) => Array<{ Value: string, Label: string }>
    faculties: (data: any) => Array<{ Value: string, Label: string }>
    courses: (data: any) => Array<{ Value: string, Label: string }>
  },
  otherFieldResolvers: FieldResolverConfig<T> = {}
) => {
  return useFriendlyFilterWithCascadingCache({
    filterModel,
    cascadingFields: [
      {
        fieldName: String(fieldNames.university),
        cacheConfig: {
          queryKey: ['universities', 'list'] as const,
          dataSelector: cacheSelectors.universities
        }
      },
      {
        fieldName: String(fieldNames.faculty),
        cacheConfig: {
          queryKey: [] as const,
          dataSelector: cacheSelectors.faculties
        },
        parentField: String(fieldNames.university),
        buildQueryKey: (universityId) => ['faculties', 'by-university', universityId] as const
      },
      {
        fieldName: String(fieldNames.course),
        cacheConfig: {
          queryKey: [] as const,
          dataSelector: cacheSelectors.courses
        },
        parentField: String(fieldNames.faculty),
        buildQueryKey: (facultyId) => ['courses', 'by-faculty', facultyId] as const
      }
    ],
    fieldResolvers: otherFieldResolvers
  })
}