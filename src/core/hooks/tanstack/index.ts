/**
 * TanStack Query Cache Data Access Utilities
 * 
 * This module provides hooks for accessing cached data from TanStack Query
 * specifically for use with the filter resolver system. These utilities support
 * both single dropdown fields and cascading dropdown patterns.
 */

// Basic cache data access hooks
export {
  useCacheDataResolver,
  type CacheDataConfig,
  type CacheDataResult
} from './useCacheDataResolver'

// Single field friendly filter with cache integration
export {
  useFriendlyFilterWithCache
} from './useFriendlyFilterWithCache'

// Cascading dropdown cache resolution
export {
  useCascadingCacheDataResolver,
  type CascadingFieldConfig,
  type CascadingCacheConfig,
  type CascadingCacheResult
} from './useCascadingCacheDataResolver'

// Cascading friendly filter with cache integration
export {
  useFriendlyFilterWithCascadingCache,
  type FriendlyFilterWithCascadingCacheConfig
} from './useFriendlyFilterWithCascadingCache'