import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { 
  QueryFriendlyFilterRecord,
  QueryFriendlyFilterConfig,
  QueryFriendlyFilterWithMemoization
} from '../types/queryFilter.types'
import { createQueryFriendlyFilterRecord, extractQueryKeysFromFriendlyFilter } from '../utils/queryFriendlyFilter'
import { extractQueryKeysFromResolvers } from '../utils/queryFieldResolvers'

/**
 * Generic hook for resolving any filter model to friendly filter labels using React Query.
 * This hook provides the same performance characteristics as the RTK Query version
 * but integrates with TanStack React Query and the query-key-factory pattern.
 * 
 * @param config Configuration object with filter model and field resolvers
 * @returns Friendly filter record with resolved labels
 */
export const useQueryFriendlyFilterResolver = <T>(
  config: QueryFriendlyFilterConfig<T>
): QueryFriendlyFilterRecord<T> => {
  const { filterModel, fieldResolvers, dateFormat = 'MM/DD/YYYY' } = config
  
  return useMemo(() => {
    return createQueryFriendlyFilterRecord(filterModel, fieldResolvers, dateFormat)
  }, [filterModel, fieldResolvers, dateFormat])
}

/**
 * Simplified version that automatically detects field types for React Query.
 * Use this when you don't need custom field resolvers.
 * 
 * @param filterModel The filter model to resolve
 * @param dateFormat Optional date format (defaults to 'MM/DD/YYYY')
 * @returns Friendly filter record with auto-detected field types
 */
export const useAutoQueryFriendlyFilterResolver = <T>(
  filterModel: T,
  dateFormat = 'MM/DD/YYYY'
): QueryFriendlyFilterRecord<T> => {
  return useQueryFriendlyFilterResolver({
    filterModel,
    fieldResolvers: {}, // Empty resolvers, will use default behavior
    dateFormat
  })
}

/**
 * Hook that provides memoization utilities for the friendly filter results with React Query integration.
 * Use this when you need to optimize useEffect dependencies and integrate with query cache.
 * 
 * @param config Configuration object with filter model and field resolvers
 * @returns Object with friendly filter, primitives for memoization, and query keys
 */
export const useQueryFriendlyFilterWithMemoization = <T>(
  config: QueryFriendlyFilterConfig<T>
): QueryFriendlyFilterWithMemoization<T> => {
  const queryClient = useQueryClient()
  const friendlyFilter = useQueryFriendlyFilterResolver(config)
  
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

  // Extract query keys from field resolvers for React Query integration
  const queryKeys = useMemo(() => {
    return extractQueryKeysFromResolvers(config.fieldResolvers)
  }, [config.fieldResolvers])

  return {
    friendlyFilter,
    primitives,
    queryKeys
  }
}

/**
 * Advanced hook that provides React Query cache integration for friendly filters.
 * This version allows you to invalidate related queries when filter values change.
 * 
 * @param config Configuration object with filter model and field resolvers
 * @param options Additional options for cache management
 * @returns Extended friendly filter result with cache utilities
 */
export const useQueryFriendlyFilterWithCache = <T>(
  config: QueryFriendlyFilterConfig<T>,
  options?: {
    invalidateOnChange?: boolean
    staleTime?: number
  }
) => {
  const queryClient = useQueryClient()
  const result = useQueryFriendlyFilterWithMemoization(config)
  
  // Cache invalidation utilities
  const cacheUtils = useMemo(() => ({
    /**
     * Invalidate all queries associated with this filter
     */
    invalidateAll: async () => {
      await Promise.all(
        result.queryKeys.map(queryKey => 
          queryClient.invalidateQueries({ queryKey })
        )
      )
    },
    
    /**
     * Invalidate specific query keys
     */
    invalidateSpecific: async (queryKeys: readonly unknown[][]) => {
      await Promise.all(
        queryKeys.map(queryKey => 
          queryClient.invalidateQueries({ queryKey })
        )
      )
    },
    
    /**
     * Get cached data for field resolvers
     */
    getCachedData: <U>(queryKey: readonly unknown[]) => {
      return queryClient.getQueryData<U>(queryKey)
    },
    
    /**
     * Set cached data for field resolvers
     */
    setCachedData: <U>(queryKey: readonly unknown[], data: U) => {
      queryClient.setQueryData(queryKey, data)
    },
  }), [queryClient, result.queryKeys])

  return {
    ...result,
    cacheUtils,
    queryClient,
  }
}

/**
 * Utility hook for creating field resolver configurations with React Query integration.
 * Helps with type-safe configuration of field resolvers.
 * 
 * @returns Factory functions for creating field resolvers
 */
export const useQueryFieldResolverFactory = () => {
  const queryClient = useQueryClient()
  
  return useMemo(() => ({
    /**
     * Create a dropdown resolver with query integration
     */
    dropdown: <T>(queryKey: readonly unknown[]) => ({
      type: 'dropdown' as const,
      queryKey,
      dataSource: queryClient.getQueryData(queryKey) as T,
    }),
    
    /**
     * Create a boolean resolver
     */
    boolean: (labels?: { true: string, false: string, null: string }) => ({
      type: 'boolean' as const,
      booleanLabels: labels,
    }),
    
    /**
     * Create a string resolver
     */
    string: () => ({
      type: 'string' as const,
    }),
    
    /**
     * Create a date resolver
     */
    date: (dateFormat?: string) => ({
      type: 'date' as const,
      dateFormat,
    }),
    
    /**
     * Create a custom resolver
     */
    custom: <T>(customResolver: (value: T) => string) => ({
      type: 'custom' as const,
      customResolver,
    }),
  }), [queryClient])
}