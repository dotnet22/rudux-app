import { useMemo } from 'react'
import type { FriendlyFilterRecord } from '../../../modules/programs/types/program'
import type { FieldResolverConfig, FieldResolver } from '../../filters/field-resolvers'
import { resolveFieldValue } from '../../filters/field-resolvers'
import { createFriendlyFilterValue } from '../../filters/friendly-filters'
import { useCascadingCacheDataResolver, type CascadingFieldConfig } from './useCascadingCacheDataResolver'
import type { ComboBoxItem } from '../../types/combo-box'

/**
 * Configuration for friendly filter with cascading cache data
 * @template T The filter model type
 * @template TItem The type of dropdown item (defaults to ComboBoxItem)
 */
export interface FriendlyFilterWithCascadingCacheConfig<T extends Record<string, unknown>, TItem = ComboBoxItem> {
  /** The filter model containing all field values */
  readonly filterModel: T
  /** Configuration for cascading cache fields */
  readonly cascadingFields: readonly CascadingFieldConfig<TItem>[]
  /** Field resolvers for non-cascading fields */
  readonly fieldResolvers?: FieldResolverConfig<T>
  /** Global data transformer for cache data */
  readonly dataTransformer?: (data: unknown, fieldName: string) => TItem[]
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
 * @template TItem The type of dropdown item (defaults to ComboBoxItem)
 * @param config Configuration object with filter model and cascading field configs
 * @returns Friendly filter record with resolved labels from cascading cache
 * 
 * @example
 * ```tsx
 * const friendlyFilter = useFriendlyFilterWithCascadingCache({
 *   filterModel: { universityId: 'univ-123', isActive: true },
 *   cascadingFields: [{
 *     fieldName: 'universityId',
 *     queryKey: ['universities'],
 *     friendlyName: 'Institution'
 *   }],
 *   fieldResolvers: { isActive: { type: 'boolean' } }
 * })
 * ```
 */
export const useFriendlyFilterWithCascadingCache = <
  T extends Record<string, unknown>,
  TItem = ComboBoxItem
>(
  config: FriendlyFilterWithCascadingCacheConfig<T, TItem>
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
  const { dataByField } = useCascadingCacheDataResolver<T, TItem>({
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
            dataSource: [...cacheData.data] as unknown as ComboBoxItem[], // Type assertion needed for compatibility
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
