/**
 * TanStack Query Cache Management Utilities
 * 
 * This module provides a comprehensive set of hooks for managing TanStack Query cache
 * following the same patterns as the filter resolver system. These utilities offer:
 * 
 * - Generic cache resolution and data retrieval
 * - Cache management operations (invalidate, remove, set, prefetch)
 * - Cache synchronization between different query keys
 * - Performance optimizations with memoization
 */

// Cache resolution hooks
export {
  useGenericCacheResolver,
  useSimpleCacheResolver,
  useGenericCacheResolverWithMemoization,
  type CacheKeyConfig,
  type GenericCacheResolverConfig,
  type CacheResolverResult
} from './useGenericCacheResolver'

// Cache management hooks
export {
  useGenericCacheManager,
  useBatchCacheManager,
  type CacheOperationConfig,
  type GenericCacheManagerConfig,
  type CacheManagerResult
} from './useGenericCacheManager'

// Cache synchronization hooks
export {
  useGenericCacheSync,
  useSimpleCacheSync,
  useGenericCacheSyncWithMemoization,
  type CacheSyncConfig,
  type GenericCacheSyncConfig,
  type CacheSyncResult
} from './useGenericCacheSync'