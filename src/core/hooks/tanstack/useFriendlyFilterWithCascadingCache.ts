import { useMemo } from 'react'
import type { FriendlyFilterRecord } from '../../../modules/programs/types/program'
import type { FieldResolverConfig, FieldResolver } from '../../filters/field-resolvers'
import { resolveFieldValue } from '../../filters/field-resolvers'
import { createFriendlyFilterValue } from '../../filters/friendly-filters'
import { useCascadingCacheDataResolver, type CascadingFieldConfig } from './useCascadingCacheDataResolver'
import type { ComboBoxItem } from '../../types/combo-box'

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
  /** Global data transformer for cache data */
  readonly dataTransformer?: (data: unknown, fieldName: string) => ComboBoxItem[]
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
 * // With query-key-factory and custom friendly names
 * import { createQueryKeys } from '@lukemorales/query-key-factory'
 * 
 * const queries = createQueryKeys('academic', {
 *   universities: null,
 *   faculties: (universityId: string) => ({ queryKey: ['faculties', universityId] }),
 *   courses: (facultyId: string) => ({ queryKey: ['courses', facultyId] })
 * })
 * 
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
 *       queryKey: queries.universities.queryKey,
 *       friendlyName: 'Institution' // Custom name
 *     },
 *     {
 *       fieldName: 'facultyId',
 *       queryKey: (universityId) => queries.faculties(universityId).queryKey,
 *       parentField: 'universityId',
 *       friendlyName: 'School' // Custom name
 *     },
 *     {
 *       fieldName: 'courseId',
 *       queryKey: (facultyId) => queries.courses(facultyId).queryKey,
 *       parentField: 'facultyId',
 *       friendlyName: 'Program' // Custom name
 *     }
 *   ],
 *   dataTransformer: (data, fieldName) => {
 *     // Single transformer for all fields
 *     if (Array.isArray(data)) {
 *       return data.map(item => ({
 *         Value: item.id,
 *         Label: item.name
 *       }))
 *     }
 *     return []
 *   },
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
    dataTransformer,
    dateFormat = 'MM/DD/YYYY',
    enabled = true
  } = config

  // Get cascading cache data for all configured fields
  const { dataByField } = useCascadingCacheDataResolver({
    filterModel,
    fieldConfigs: cascadingFields,
    dataTransformer,
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
      let resolver = (fieldResolvers as Record<string, FieldResolver<unknown>>)[key] as FieldResolver<unknown> | undefined
      let friendlyLabel = ''
      
      // If this is a cascading field, use the cached data and friendly name
      if (cascadingFieldNames.has(key)) {
        const cacheData = dataByField[key]
        
        if (cacheData?.isAvailable) {
          resolver = {
            type: 'dropdown' as const,
            dataSource: [...cacheData.data], // Create a copy for immutability
            ...(resolver as unknown as Record<string, unknown> || {}) // Allow override of resolver properties
          }
        }
        
        // Resolve the field value to a friendly label using cache data
        friendlyLabel = resolveFieldValue(value, resolver, dateFormat)
        
        // Field friendly name is available via getFieldFriendlyName if needed for UI display
      } else {
        // Non-cascading field, use standard resolution
        friendlyLabel = resolveFieldValue(value, resolver, dateFormat)
      }
      
      // Create the friendly filter value with proper typing
      result[key] = createFriendlyFilterValue(
        friendlyLabel, 
        value as string | number | boolean | Date | null
      )
    }

    return result
  }, [filterModel, dataByField, cascadingFieldNames, fieldResolvers, dateFormat])
}

/**
 * Simplified hook for the common university -> faculty -> course cascading pattern
 * Works with query-key-factory and supports custom friendly names
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
  queryKeys: {
    universities: readonly unknown[]
    faculties: (universityId: string) => readonly unknown[]
    courses: (facultyId: string) => readonly unknown[]
  },
  options?: {
    friendlyNames?: {
      university?: string
      faculty?: string
      course?: string
    }
    dataTransformer?: (data: unknown, fieldName: string) => ComboBoxItem[]
    otherFieldResolvers?: FieldResolverConfig<T>
  }
) => {
  return useFriendlyFilterWithCascadingCache({
    filterModel,
    cascadingFields: [
      {
        fieldName: String(fieldNames.university),
        queryKey: queryKeys.universities,
        friendlyName: options?.friendlyNames?.university || 'University'
      },
      {
        fieldName: String(fieldNames.faculty),
        queryKey: queryKeys.faculties,
        parentField: String(fieldNames.university),
        friendlyName: options?.friendlyNames?.faculty || 'Faculty'
      },
      {
        fieldName: String(fieldNames.course),
        queryKey: queryKeys.courses,
        parentField: String(fieldNames.faculty),
        friendlyName: options?.friendlyNames?.course || 'Course'
      }
    ],
    dataTransformer: options?.dataTransformer,
    fieldResolvers: options?.otherFieldResolvers
  })
}