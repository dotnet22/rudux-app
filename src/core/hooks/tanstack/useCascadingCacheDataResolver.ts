import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { ComboBoxItem } from '../../types/combo-box'

/**
 * Function type for building query keys, compatible with query-key-factory
 */
export type QueryKeyBuilder = (parentValue: string) => readonly unknown[]

/**
 * Configuration for a single cascading field
 */
export interface CascadingFieldConfig {
  /** The field name this config applies to */
  readonly fieldName: string
  /** Query key for independent fields, or query key factory for dependent fields */
  readonly queryKey: readonly unknown[] | QueryKeyBuilder
  /** Parent field that this field depends on (if this is a dependent field) */
  readonly parentField?: string
  /** Custom friendly name for this field in filter display */
  readonly friendlyName?: string
  /** Whether this field should be enabled (default: true) */
  readonly enabled?: boolean
}

/**
 * Configuration for cascading cache data resolver
 */
export interface CascadingCacheConfig<T extends Record<string, unknown>> {
  /** The filter model containing all field values */
  readonly filterModel: T
  /** Configuration for each cascading field */
  readonly fieldConfigs: readonly CascadingFieldConfig[]
  /** Optional global data transformer - converts any cached data to ComboBoxItem[] */
  readonly dataTransformer?: (data: unknown, fieldName: string) => ComboBoxItem[]
  /** Whether the entire resolver is enabled */
  readonly enabled?: boolean
}

/**
 * Cache data result for a single field
 */
export interface FieldCacheResult {
  /** The resolved combo box items, empty array if not available */
  readonly data: readonly ComboBoxItem[]
  /** Whether cached data exists and is available */
  readonly isAvailable: boolean
  /** Whether the data array is empty (even if available) */
  readonly isEmpty: boolean
  /** Custom friendly name for this field */
  readonly friendlyName: string
}

/**
 * Result from cascading cache data resolver
 */
export interface CascadingCacheResult {
  /** Cache data results keyed by field name */
  readonly dataByField: Record<string, FieldCacheResult>
  /** Convenience method to get data for a specific field */
  readonly getFieldData: (fieldName: string) => readonly ComboBoxItem[]
  /** Convenience method to check if field data is available */
  readonly isFieldAvailable: (fieldName: string) => boolean
  /** Convenience method to get friendly name for a field */
  readonly getFieldFriendlyName: (fieldName: string) => string
  /** Whether any field is currently loading */
  readonly isAnyLoading: boolean
}

/**
 * Hook for resolving cascading dropdown data from TanStack Query cache.
 * This handles the cascading pattern where child dropdowns depend on parent selections.
 * 
 * @template T The type of the filter model object
 * @param config Configuration for cascading fields and their cache dependencies
 * @returns Cascading cache result with data for all fields
 * 
 * @example
 * ```tsx
 * // With query-key-factory
 * import { createQueryKeys } from '@lukemorales/query-key-factory'
 * 
 * const queries = createQueryKeys('academic', {
 *   universities: null,
 *   faculties: (universityId: string) => ({ queryKey: ['faculties', universityId] }),
 *   courses: (facultyId: string) => ({ queryKey: ['courses', facultyId] })
 * })
 * 
 * const { dataByField, getFieldData, getFieldFriendlyName } = useCascadingCacheDataResolver({
 *   filterModel: { universityId: 'univ-123', facultyId: null, courseId: null },
 *   fieldConfigs: [
 *     {
 *       fieldName: 'universityId',
 *       queryKey: queries.universities.queryKey,
 *       friendlyName: 'University'
 *     },
 *     {
 *       fieldName: 'facultyId',
 *       queryKey: (universityId) => queries.faculties(universityId).queryKey,
 *       parentField: 'universityId',
 *       friendlyName: 'Faculty'
 *     },
 *     {
 *       fieldName: 'courseId',
 *       queryKey: (facultyId) => queries.courses(facultyId).queryKey,
 *       parentField: 'facultyId',
 *       friendlyName: 'Course'
 *     }
 *   ],
 *   dataTransformer: (data, fieldName) => {
 *     // Single transformer for all field types
 *     if (Array.isArray(data)) {
 *       return data.map(item => ({
 *         Value: item.id || item.value,
 *         Label: item.name || item.label || item.title
 *       }))
 *     }
 *     return []
 *   }
 * })
 * ```
 */
export const useCascadingCacheDataResolver = <T extends Record<string, unknown>>(
  config: CascadingCacheConfig<T>
): CascadingCacheResult => {
  const queryClient = useQueryClient()
  const { filterModel, fieldConfigs, dataTransformer, enabled = true } = config

  // Resolve all field data using direct query client access (avoiding conditional hooks)
  const resolverResults = useMemo((): Record<string, FieldCacheResult> => {
    if (!enabled) {
      const emptyResults: Record<string, FieldCacheResult> = {}
      fieldConfigs.forEach(config => {
        emptyResults[config.fieldName] = {
          data: [],
          isAvailable: false,
          isEmpty: true,
          friendlyName: config.friendlyName || config.fieldName
        }
      })
      return emptyResults
    }

    const results: Record<string, FieldCacheResult> = {}

    for (const fieldConfig of fieldConfigs) {
      const { fieldName, queryKey, parentField, enabled: fieldEnabled = true, friendlyName } = fieldConfig

      if (!fieldEnabled) {
        results[fieldName] = {
          data: [],
          isAvailable: false,
          isEmpty: true,
          friendlyName: friendlyName || fieldName
        }
        continue
      }

      // Determine the query key to use
      let finalQueryKey: readonly unknown[]

      // If this field has a parent dependency, build dynamic query key
      if (parentField && typeof queryKey === 'function') {
        const parentValue = filterModel[parentField] as string | null
        
        // If parent has no value, this field is disabled
        if (!parentValue) {
          results[fieldName] = {
            data: [],
            isAvailable: false,
            isEmpty: true,
            friendlyName: friendlyName || fieldName
          }
          continue
        }

        // Build dynamic query key using the function
        finalQueryKey = queryKey(parentValue)
      } else if (Array.isArray(queryKey)) {
        // Static query key
        finalQueryKey = queryKey
      } else {
        // Invalid configuration
        results[fieldName] = {
          data: [],
          isAvailable: false,
          isEmpty: true,
          friendlyName: friendlyName || fieldName
        }
        continue
      }

      // Get cached data directly from query client
      const cachedData = queryClient.getQueryData(finalQueryKey as unknown[])

      if (!cachedData) {
        results[fieldName] = {
          data: [],
          isAvailable: false,
          isEmpty: true,
          friendlyName: friendlyName || fieldName
        }
        continue
      }

      // Transform cached data using the global transformer or assume it's ComboBoxItem[]
      let comboBoxItems: ComboBoxItem[] = []
      
      if (dataTransformer) {
        comboBoxItems = dataTransformer(cachedData, fieldName)
      } else if (Array.isArray(cachedData)) {
        // Try to auto-detect common patterns
        comboBoxItems = cachedData.map((item: unknown) => {
          if (item && typeof item === 'object') {
            const itemObj = item as Record<string, unknown>
            const value = String(itemObj.Value || itemObj.value || itemObj.id || item)
            const label = String(itemObj.Label || itemObj.label || itemObj.name || itemObj.title || item)
            return {
              id: value,
              Value: value,
              Label: label
            }
          }
          const stringValue = String(item)
          return { id: stringValue, Value: stringValue, Label: stringValue }
        })
      }

      results[fieldName] = {
        data: comboBoxItems,
        isAvailable: true,
        isEmpty: comboBoxItems.length === 0,
        friendlyName: friendlyName || fieldName
      }
    }

    return results
  }, [queryClient, filterModel, fieldConfigs, dataTransformer, enabled])

  // Convenience methods
  const getFieldData = useMemo(() => 
    (fieldName: string): readonly ComboBoxItem[] => 
      resolverResults[fieldName]?.data || []
  , [resolverResults])

  const isFieldAvailable = useMemo(() =>
    (fieldName: string): boolean =>
      resolverResults[fieldName]?.isAvailable || false
  , [resolverResults])

  const getFieldFriendlyName = useMemo(() =>
    (fieldName: string): string =>
      resolverResults[fieldName]?.friendlyName || fieldName
  , [resolverResults])

  const isAnyLoading = useMemo(() =>
    Object.values(resolverResults).some(result => !result.isAvailable && !result.isEmpty)
  , [resolverResults])

  return useMemo(() => ({
    dataByField: resolverResults,
    getFieldData,
    isFieldAvailable,
    getFieldFriendlyName,
    isAnyLoading
  }), [resolverResults, getFieldData, isFieldAvailable, getFieldFriendlyName, isAnyLoading])
}

/**
 * Simplified cascading resolver for common university -> faculty -> course pattern
 * Works with query-key-factory or simple query keys
 */
export const useUniversityFacultyCourseResolver = <T extends Record<string, unknown>>(
  filterModel: T,
  fieldNames: {
    university: keyof T
    faculty: keyof T
    course: keyof T
  },
  queryKeys: {
    universities: readonly unknown[]
    faculties: QueryKeyBuilder
    courses: QueryKeyBuilder
  },
  options?: {
    friendlyNames?: {
      university?: string
      faculty?: string
      course?: string
    }
    dataTransformer?: (data: unknown, fieldName: string) => ComboBoxItem[]
  }
) => {
  return useCascadingCacheDataResolver({
    filterModel,
    fieldConfigs: [
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
    dataTransformer: options?.dataTransformer
  })
}