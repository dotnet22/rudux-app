import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Configuration for cache operations
 */
export interface CacheOperationConfig<T> {
  queryKey: string[]
  predicate?: (data: T) => boolean
  selector?: (data: T) => unknown
}

/**
 * Configuration for the generic cache manager
 */
export interface GenericCacheManagerConfig {
  enabled?: boolean
  staleTime?: number
  gcTime?: number
}

/**
 * Result from cache manager operations
 */
export interface CacheManagerResult<T = unknown> {
  invalidateCache: (queryKey: string[]) => Promise<void>
  removeCache: (queryKey: string[]) => void
  setCache: (queryKey: string[], data: T) => void
  prefetchCache: (queryKey: string[], fetcher: () => Promise<T>) => Promise<T | undefined>
  getCacheSnapshot: (queryKey: string[]) => T | undefined
  getAllCacheKeys: () => string[][]
  clearAllCache: () => void
}

/**
 * Generic hook for managing TanStack Query cache operations.
 * Provides comprehensive cache management utilities similar to the
 * filter resolver pattern but for cache operations.
 * 
 * @param config Configuration object for cache management
 * @returns Cache manager result with operation methods
 */
export const useGenericCacheManager = <T = unknown>(
  config: GenericCacheManagerConfig = {}
): CacheManagerResult<T> => {
  const queryClient = useQueryClient()
  const { enabled = true, staleTime, gcTime } = config

  return useMemo(() => {
    if (!enabled) {
      return {
        invalidateCache: async () => {},
        removeCache: () => {},
        setCache: () => {},
        prefetchCache: async () => undefined,
        getCacheSnapshot: () => undefined,
        getAllCacheKeys: () => [],
        clearAllCache: () => {}
      }
    }

    const invalidateCache = async (queryKey: string[]) => {
      await queryClient.invalidateQueries({ queryKey })
    }

    const removeCache = (queryKey: string[]) => {
      queryClient.removeQueries({ queryKey })
    }

    const setCache = (queryKey: string[], data: T) => {
      queryClient.setQueryData(queryKey, data)
    }

    const prefetchCache = async (queryKey: string[], fetcher: () => Promise<T>) => {
      try {
        return await queryClient.fetchQuery({
          queryKey,
          queryFn: fetcher,
          staleTime,
          gcTime
        })
      } catch (error) {
        console.error('Cache prefetch failed:', error)
        return undefined
      }
    }

    const getCacheSnapshot = (queryKey: string[]): T | undefined => {
      return queryClient.getQueryData<T>(queryKey)
    }

    const getAllCacheKeys = (): string[][] => {
      return queryClient.getQueryCache().getAll().map(query => query.queryKey as string[])
    }

    const clearAllCache = () => {
      queryClient.clear()
    }

    return {
      invalidateCache,
      removeCache,
      setCache,
      prefetchCache,
      getCacheSnapshot,
      getAllCacheKeys,
      clearAllCache
    }
  }, [queryClient, enabled, staleTime, gcTime])
}

/**
 * Hook for batch cache operations.
 * Use this when you need to perform multiple cache operations efficiently.
 */
export const useBatchCacheManager = <T = unknown>(
  config: GenericCacheManagerConfig = {}
) => {
  const cacheManager = useGenericCacheManager<T>(config)
  
  const batchOperations = useMemo(() => ({
    invalidateMultiple: async (queryKeys: string[][]) => {
      await Promise.all(queryKeys.map(key => cacheManager.invalidateCache(key)))
    },
    
    removeMultiple: (queryKeys: string[][]) => {
      queryKeys.forEach(key => cacheManager.removeCache(key))
    },
    
    setMultiple: (entries: Array<{ queryKey: string[], data: T }>) => {
      entries.forEach(({ queryKey, data }) => cacheManager.setCache(queryKey, data))
    },
    
    prefetchMultiple: async (
      entries: Array<{ queryKey: string[], fetcher: () => Promise<T> }>
    ) => {
      return Promise.all(
        entries.map(({ queryKey, fetcher }) => 
          cacheManager.prefetchCache(queryKey, fetcher)
        )
      )
    }
  }), [cacheManager])

  return {
    ...cacheManager,
    batchOperations
  }
}