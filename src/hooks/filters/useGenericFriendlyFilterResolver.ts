import { useMemo } from 'react'
import type { FriendlyFilterRecord } from '../../modules/programs/types/program'
import type { FieldResolverConfig } from '../../utils/filters/fieldResolvers'
import { resolveFieldValue } from '../../utils/filters/fieldResolvers'
import { createFriendlyFilterValue } from '../../utils/friendlyFilter'

/**
 * Configuration for the generic friendly filter resolver
 */
export interface GenericFriendlyFilterConfig<T> {
  filterModel: T
  fieldResolvers: FieldResolverConfig<T>
  dateFormat?: string
}

/**
 * Generic hook for resolving any filter model to friendly filter labels.
 * This hook provides the same performance characteristics as the original
 * useFriendlyFilterResolver but works with any filter model type.
 * 
 * @param config Configuration object with filter model and field resolvers
 * @returns Friendly filter record with resolved labels
 */
export const useGenericFriendlyFilterResolver = <T>(
  config: GenericFriendlyFilterConfig<T>
): FriendlyFilterRecord<T> => {
  const { filterModel, fieldResolvers, dateFormat = 'MM/DD/YYYY' } = config

  return useMemo(() => {
    const result = {} as FriendlyFilterRecord<T>

    for (const key in filterModel) {
      const value = filterModel[key]
      const resolver = fieldResolvers[key]
      
      // Resolve the field value to a friendly label
      const label = resolveFieldValue(value, resolver, dateFormat)
      
      // Create the friendly filter value
      result[key] = createFriendlyFilterValue(label, value as string | number | boolean | Date | null)
    }

    return result
  }, [filterModel, fieldResolvers, dateFormat])
}

/**
 * Simplified version that automatically detects field types.
 * Use this when you don't need custom field resolvers.
 */
export const useAutoFriendlyFilterResolver = <T>(
  filterModel: T,
  dateFormat = 'MM/DD/YYYY'
): FriendlyFilterRecord<T> => {
  return useGenericFriendlyFilterResolver({
    filterModel,
    fieldResolvers: {}, // Empty resolvers, will use default behavior
    dateFormat
  })
}

/**
 * Hook that provides memoization utilities for the friendly filter results.
 * Use this when you need to optimize useEffect dependencies.
 */
export const useGenericFriendlyFilterWithMemoization = <T>(
  config: GenericFriendlyFilterConfig<T>
) => {
  const friendlyFilter = useGenericFriendlyFilterResolver(config)
  
  // Pre-compute primitives for memoization
  const primitives = useMemo(() => {
    const values: (string | number | boolean | Date | null)[] = []
    for (const key in friendlyFilter) {
      const filter = friendlyFilter[key]
      if (filter) {
        values.push(filter.Label, filter.Value)
      }
    }
    return values
  }, [friendlyFilter])

  return {
    friendlyFilter,
    primitives
  }
}