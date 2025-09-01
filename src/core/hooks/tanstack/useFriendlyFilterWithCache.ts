import { useMemo } from 'react'
import type { FriendlyFilterRecord } from '../../../modules/programs/types/program'
import type { FieldResolverConfig } from '../../filters/field-resolvers'
import { resolveFieldValue } from '../../filters/field-resolvers'
import { createFriendlyFilterValue } from '../../filters/friendly-filters'
import { useCacheDataResolver } from './useCacheDataResolver'
import type { CacheDataConfig } from './useCacheDataResolver'

/**
 * Hook for creating friendly filters using cached dropdown data.
 * This integrates the existing filter resolver system with TanStack Query cache
 * to resolve dropdown values to their friendly labels.
 * 
 * @template T The type of the filter model object
 * @template K The key of the field that uses cached data (constrained to keys of T)
 * @template TCacheData The type of the cached data
 * @param filterModel The filter model object
 * @param fieldKey The field that uses cached dropdown data (must be a key of T)
 * @param cacheConfig Configuration for accessing cached data
 * @param fieldResolvers Optional field resolvers for other fields
 * @returns Friendly filter record with resolved labels from cache
 * 
 * @example
 * ```tsx
 * const friendlyFilter = useFriendlyFilterWithCache(
 *   { universityId: 'univ-123', isActive: true },
 *   'universityId' as const,
 *   {
 *     queryKey: ['universities', 'list'] as const,
 *     dataSelector: (unis: University[]) => unis.map(u => ({ Value: u.id, Label: u.name }))
 *   },
 *   { isActive: { type: 'boolean' } }
 * )
 * ```
 */
export const useFriendlyFilterWithCache = <
  T extends Record<string, unknown>,
  K extends keyof T,
  TCacheData = unknown
>(
  filterModel: T,
  fieldKey: K,
  cacheConfig: CacheDataConfig<TCacheData>,
  fieldResolvers: FieldResolverConfig<T> = {}
): FriendlyFilterRecord<T> => {
  // Get cached data for the dropdown field
  const { data: cacheData, isAvailable } = useCacheDataResolver<TCacheData>(cacheConfig)

  return useMemo((): FriendlyFilterRecord<T> => {
    const result = {} as FriendlyFilterRecord<T>

    // Iterate through all keys in the filter model with proper typing
    for (const key in filterModel) {
      if (!Object.prototype.hasOwnProperty.call(filterModel, key)) continue
      
      const value = filterModel[key]
      let resolver = fieldResolvers[key]
      
      // If this is the cache-dependent field and cache data is available
      if (key === String(fieldKey) && isAvailable) {
        resolver = {
          type: 'dropdown' as const,
          dataSource: [...cacheData], // Create a copy for immutability
          ...resolver
        }
      }
      
      // Resolve the field value to a friendly label
      const label = resolveFieldValue(value, resolver)
      
      // Create the friendly filter value with proper typing
      result[key] = createFriendlyFilterValue(
        label, 
        value as string | number | boolean | Date | null
      )
    }

    return result
  }, [filterModel, fieldKey, cacheData, isAvailable, fieldResolvers])
}