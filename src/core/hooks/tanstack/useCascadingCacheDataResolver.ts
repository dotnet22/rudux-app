import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { ComboBoxItem } from '../../types/combo-box'

/**
 * Function type for building query keys, compatible with query-key-factory
 */
export type QueryKeyBuilder = (parentValue: string) => readonly unknown[]

/**
 * Configuration for a single cascading field
 * @template TItem The type of dropdown item (defaults to ComboBoxItem)
 */
export interface CascadingFieldConfig<TItem = ComboBoxItem> {
  /** @internal - Generic type parameter, not directly used but enables type inference */
  readonly _itemType?: TItem
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
 * @template T The filter model type
 * @template TItem The type of dropdown item (defaults to ComboBoxItem)
 */
export interface CascadingCacheConfig<T extends Record<string, unknown>, TItem = ComboBoxItem> {
  /** The filter model containing all field values */
  readonly filterModel: T
  /** Configuration for each cascading field */
  readonly fieldConfigs: readonly CascadingFieldConfig<TItem>[]
  /** Optional global data transformer - converts any cached data to TItem[] */
  readonly dataTransformer?: (data: unknown, fieldName: string) => TItem[]
  /** Whether the entire resolver is enabled */
  readonly enabled?: boolean
}

/**
 * Cache data result for a single field
 * @template TItem The type of dropdown item (defaults to ComboBoxItem)
 */
export interface FieldCacheResult<TItem = ComboBoxItem> {
  /** The resolved dropdown items, empty array if not available */
  readonly data: readonly TItem[]
  /** Whether cached data exists and is available */
  readonly isAvailable: boolean
  /** Whether the data array is empty (even if available) */
  readonly isEmpty: boolean
  /** Custom friendly name for this field */
  readonly friendlyName: string
}

/**
 * Result from cascading cache data resolver
 * @template TItem The type of dropdown item (defaults to ComboBoxItem)
 */
export interface CascadingCacheResult<TItem = ComboBoxItem> {
  /** Cache data results keyed by field name */
  readonly dataByField: Record<string, FieldCacheResult<TItem>>
  /** Convenience method to get data for a specific field */
  readonly getFieldData: (fieldName: string) => readonly TItem[]
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
 * @template TItem The type of dropdown item (defaults to ComboBoxItem)
 * @param config Configuration for cascading fields and their cache dependencies
 * @returns Cascading cache result with data for all fields
 * 
 * @example
 * ```tsx
 * // Basic usage with default ComboBoxItem type
 * const { getFieldData } = useCascadingCacheDataResolver({
 *   filterModel: { universityId: 'univ-123', facultyId: null },
 *   fieldConfigs: [
 *     { fieldName: 'universityId', queryKey: ['universities'] },
 *     { fieldName: 'facultyId', queryKey: (id) => ['faculties', id], parentField: 'universityId' }
 *   ]
 * })
 * 
 * // Custom item type
 * interface CustomItem { id: string; value: string; label: string }
 * const result = useCascadingCacheDataResolver<FilterModel, CustomItem>({ ... })
 * ```
 */
export const useCascadingCacheDataResolver = <
  T extends Record<string, unknown>,
  TItem = ComboBoxItem
>(
  config: CascadingCacheConfig<T, TItem>
): CascadingCacheResult<TItem> => {
  const queryClient = useQueryClient()
  const { filterModel, fieldConfigs, dataTransformer, enabled = true } = config

  // Resolve all field data using direct query client access (avoiding conditional hooks)
  const resolverResults = useMemo((): Record<string, FieldCacheResult<TItem>> => {
    if (!enabled) {
      const emptyResults: Record<string, FieldCacheResult<TItem>> = {}
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

    const results: Record<string, FieldCacheResult<TItem>> = {}

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

      // Transform cached data using the global transformer or assume it's TItem[]
      let transformedItems: TItem[] = []
      
      if (dataTransformer) {
        transformedItems = dataTransformer(cachedData, fieldName)
      } else if (Array.isArray(cachedData)) {
        // Try to auto-detect common patterns
        transformedItems = cachedData.map((item: unknown) => {
          if (item && typeof item === 'object') {
            const itemObj = item as Record<string, unknown>
            const value = String(itemObj.Value || itemObj.value || itemObj.id || item)
            const label = String(itemObj.Label || itemObj.label || itemObj.name || itemObj.title || item)
            return {
              id: value,
              Value: value,
              Label: label
            } as TItem
          }
          const stringValue = String(item)
          return { id: stringValue, Value: stringValue, Label: stringValue } as TItem
        })
      }

      results[fieldName] = {
        data: transformedItems,
        isAvailable: true,
        isEmpty: transformedItems.length === 0,
        friendlyName: friendlyName || fieldName
      }
    }

    return results
  }, [queryClient, filterModel, fieldConfigs, dataTransformer, enabled])

  // Convenience methods
  const getFieldData = useMemo(() => 
    (fieldName: string): readonly TItem[] => 
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