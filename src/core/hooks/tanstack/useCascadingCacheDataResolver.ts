import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { ComboBoxItem } from '../../types/combo-box'
import { useCacheDataResolver, type CacheDataConfig, type CacheDataResult } from './useCacheDataResolver'

/**
 * Configuration for a single cascading field
 */
export interface CascadingFieldConfig<TCacheData = unknown> {
  /** The field name this config applies to */
  readonly fieldName: string
  /** Cache configuration for this field */
  readonly cacheConfig: CacheDataConfig<TCacheData>
  /** Parent field that this field depends on */
  readonly parentField?: string
  /** Function to build query key based on parent value */
  readonly buildQueryKey?: (parentValue: string | null) => readonly string[]
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
  /** Whether the entire resolver is enabled */
  readonly enabled?: boolean
}

/**
 * Result from cascading cache data resolver
 */
export interface CascadingCacheResult {
  /** Cache data results keyed by field name */
  readonly dataByField: Record<string, CacheDataResult>
  /** Convenience method to get data for a specific field */
  readonly getFieldData: (fieldName: string) => readonly ComboBoxItem[]
  /** Convenience method to check if field data is available */
  readonly isFieldAvailable: (fieldName: string) => boolean
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
 * const { dataByField, getFieldData } = useCascadingCacheDataResolver({
 *   filterModel: { universityId: 'univ-123', facultyId: null, courseId: null },
 *   fieldConfigs: [
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
 *         queryKey: [], // Will be built dynamically
 *         dataSelector: (faculties: Faculty[]) => faculties.map(f => ({ Value: f.id, Label: f.name }))
 *       },
 *       parentField: 'universityId',
 *       buildQueryKey: (universityId) => ['faculties', 'by-university', universityId]
 *     },
 *     {
 *       fieldName: 'courseId',
 *       cacheConfig: {
 *         queryKey: [],
 *         dataSelector: (courses: Course[]) => courses.map(c => ({ Value: c.id, Label: c.name }))
 *       },
 *       parentField: 'facultyId',
 *       buildQueryKey: (facultyId) => ['courses', 'by-faculty', facultyId]
 *     }
 *   ]
 * })
 * ```
 */
export const useCascadingCacheDataResolver = <T extends Record<string, unknown>>(
  config: CascadingCacheConfig<T>
): CascadingCacheResult => {
  const queryClient = useQueryClient()
  const { filterModel, fieldConfigs, enabled = true } = config

  // Resolve all field data using direct query client access (avoiding conditional hooks)
  const resolverResults = useMemo((): Record<string, CacheDataResult> => {
    if (!enabled) {
      const emptyResults: Record<string, CacheDataResult> = {}
      fieldConfigs.forEach(config => {
        emptyResults[config.fieldName] = {
          data: [],
          isAvailable: false,
          isEmpty: true
        }
      })
      return emptyResults
    }

    const results: Record<string, CacheDataResult> = {}

    for (const fieldConfig of fieldConfigs) {
      const { fieldName, cacheConfig, parentField, buildQueryKey, enabled: fieldEnabled = true } = fieldConfig

      if (!fieldEnabled) {
        results[fieldName] = {
          data: [],
          isAvailable: false,
          isEmpty: true
        }
        continue
      }

      // Determine the query key to use
      let finalQueryKey: readonly string[] = cacheConfig.queryKey

      // If this field has a parent dependency, build dynamic query key
      if (parentField && buildQueryKey) {
        const parentValue = filterModel[parentField] as string | null
        
        // If parent has no value, this field is disabled
        if (!parentValue) {
          results[fieldName] = {
            data: [],
            isAvailable: false,
            isEmpty: true
          }
          continue
        }

        // Build dynamic query key based on parent value
        finalQueryKey = buildQueryKey(parentValue)
      }

      // Get cached data directly from query client
      const cachedData = queryClient.getQueryData(finalQueryKey as string[])

      if (!cachedData) {
        results[fieldName] = {
          data: [],
          isAvailable: false,
          isEmpty: true
        }
        continue
      }

      // Transform cached data using selector
      const comboBoxItems = cacheConfig.dataSelector 
        ? cacheConfig.dataSelector(cachedData) 
        : (cachedData as unknown as ComboBoxItem[])
      
      const items = Array.isArray(comboBoxItems) ? comboBoxItems : []

      results[fieldName] = {
        data: items,
        isAvailable: true,
        isEmpty: items.length === 0
      }
    }

    return results
  }, [queryClient, filterModel, fieldConfigs, enabled])

  // Convenience methods
  const getFieldData = useMemo(() => 
    (fieldName: string): readonly ComboBoxItem[] => 
      resolverResults[fieldName]?.data || []
  , [resolverResults])

  const isFieldAvailable = useMemo(() =>
    (fieldName: string): boolean =>
      resolverResults[fieldName]?.isAvailable || false
  , [resolverResults])

  const isAnyLoading = useMemo(() =>
    Object.values(resolverResults).some(result => !result.isAvailable && !result.isEmpty)
  , [resolverResults])

  return useMemo(() => ({
    dataByField: resolverResults,
    getFieldData,
    isFieldAvailable,
    isAnyLoading
  }), [resolverResults, getFieldData, isFieldAvailable, isAnyLoading])
}

/**
 * Simplified cascading resolver for common university -> faculty -> course pattern
 */
export const useUniversityFacultyCourseResolver = <T extends Record<string, unknown>>(
  filterModel: T,
  fieldNames: {
    university: keyof T
    faculty: keyof T
    course: keyof T
  },
  cacheSelectors: {
    universities: (data: any) => ComboBoxItem[]
    faculties: (data: any) => ComboBoxItem[]
    courses: (data: any) => ComboBoxItem[]
  }
) => {
  return useCascadingCacheDataResolver({
    filterModel,
    fieldConfigs: [
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
    ]
  })
}