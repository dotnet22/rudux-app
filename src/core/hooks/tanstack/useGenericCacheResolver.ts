import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Configuration for cache key resolution
 */
export interface CacheKeyConfig<T> {
  baseKey: string
  keyResolver?: (params: T) => string[]
  customKey?: string[]
}

/**
 * Configuration for the generic cache resolver
 */
export interface GenericCacheResolverConfig<T, TData> {
  queryKey: CacheKeyConfig<T>
  selector?: (data: TData) => unknown
  enabled?: boolean
}

/**
 * Result from cache resolver
 */
export interface CacheResolverResult<TData> {
  data: TData | undefined
  exists: boolean
  isStale: boolean
  lastUpdated: number | undefined
}

/**
 * Generic hook for resolving cached data from TanStack Query cache.
 * This hook provides the same performance characteristics as the original
 * filter resolver but works with any cache data type.
 * 
 * @param config Configuration object with query key and optional selector
 * @returns Cache resolver result with data and metadata
 */
export const useGenericCacheResolver = <T, TData = unknown>(
  config: GenericCacheResolverConfig<T, TData>
): CacheResolverResult<TData> => {
  const queryClient = useQueryClient()
  const { queryKey, selector, enabled = true } = config

  return useMemo(() => {
    if (!enabled) {
      return {
        data: undefined,
        exists: false,
        isStale: false,
        lastUpdated: undefined
      }
    }

    // Build the query key
    const finalKey = queryKey.customKey || [queryKey.baseKey]
    
    // Get cache data
    const cachedData = queryClient.getQueryData<TData>(finalKey)
    const queryState = queryClient.getQueryState(finalKey)
    
    // Apply selector if provided
    const resolvedData = selector && cachedData ? selector(cachedData) as TData : cachedData

    return {
      data: resolvedData,
      exists: cachedData !== undefined,
      isStale: queryState?.isStale ?? false,
      lastUpdated: queryState?.dataUpdatedAt
    }
  }, [queryClient, queryKey.baseKey, queryKey.customKey, selector, enabled])
}

/**
 * Simplified version that works with string-based query keys.
 * Use this when you have simple cache key requirements.
 */
export const useSimpleCacheResolver = <TData = unknown>(
  queryKey: string[],
  selector?: (data: TData) => unknown
): CacheResolverResult<TData> => {
  return useGenericCacheResolver({
    queryKey: {
      baseKey: '',
      customKey: queryKey
    },
    selector,
    enabled: true
  })
}

/**
 * Hook that provides memoization utilities for cache resolution results.
 * Use this when you need to optimize useEffect dependencies.
 */
export const useGenericCacheResolverWithMemoization = <T, TData = unknown>(
  config: GenericCacheResolverConfig<T, TData>
) => {
  const cacheResult = useGenericCacheResolver(config)
  
  // Pre-compute primitives for memoization
  const primitives = useMemo(() => {
    return [
      cacheResult.exists,
      cacheResult.isStale,
      cacheResult.lastUpdated,
      // Stringify data for comparison (careful with circular references)
      cacheResult.data ? JSON.stringify(cacheResult.data) : null
    ]
  }, [cacheResult])

  return {
    cacheResult,
    primitives
  }
}