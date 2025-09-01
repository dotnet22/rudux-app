# TanStack Query Cache Management Utilities

A comprehensive set of React hooks for managing TanStack Query cache operations, following the same architectural patterns as the project's filter resolver system. These utilities provide type-safe, performant cache management with memoization optimizations.

## Overview

This module provides three main categories of cache management hooks:

- **Cache Resolution** - Retrieve and observe cached data with metadata
- **Cache Management** - Perform cache operations (invalidate, remove, set, prefetch)
- **Cache Synchronization** - Synchronize data between different query keys

## Installation & Setup

Ensure you have TanStack Query installed and configured in your project:

```bash
npm install @tanstack/react-query
```

```tsx
// In your app root
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  )
}
```

## Cache Resolution Hooks

### `useGenericCacheResolver`

The primary hook for resolving cached data with metadata and performance optimizations.

```tsx
import { useGenericCacheResolver } from '@/core/hooks/tanstack'

const UserProfile = ({ userId }: { userId: string }) => {
  const { data, exists, isStale, lastUpdated } = useGenericCacheResolver({
    queryKey: {
      baseKey: 'users',
      customKey: ['users', userId, 'profile']
    },
    selector: (userData: User) => userData.profile,
    enabled: !!userId
  })

  if (!exists) return <div>No cached data</div>
  if (isStale) return <div>Data is stale (last updated: {lastUpdated})</div>

  return <div>{data?.name}</div>
}
```

#### Configuration Options

```tsx
interface GenericCacheResolverConfig<T, TData> {
  queryKey: CacheKeyConfig<T>
  selector?: (data: TData) => unknown
  enabled?: boolean
}

interface CacheKeyConfig<T> {
  baseKey: string
  keyResolver?: (params: T) => string[]
  customKey?: string[]
}
```

### `useSimpleCacheResolver`

Simplified version for basic cache resolution with string-based query keys.

```tsx
import { useSimpleCacheResolver } from '@/core/hooks/tanstack'

const SimpleDataDisplay = () => {
  const { data, exists } = useSimpleCacheResolver(
    ['posts', 'featured'],
    (posts: Post[]) => posts.filter(p => p.featured)
  )

  return exists ? <PostList posts={data} /> : <div>No cached posts</div>
}
```

### `useGenericCacheResolverWithMemoization`

Optimized version with pre-computed primitives for memoization in useEffect dependencies.

```tsx
import { useGenericCacheResolverWithMemoization } from '@/core/hooks/tanstack'

const OptimizedComponent = () => {
  const { cacheResult, primitives } = useGenericCacheResolverWithMemoization({
    queryKey: { baseKey: 'users', customKey: ['users', 'list'] }
  })

  // Use primitives in useEffect dependencies for optimal performance
  useEffect(() => {
    console.log('Cache changed:', cacheResult.data)
  }, [primitives]) // Optimized dependencies
}
```

## Cache Management Hooks

### `useGenericCacheManager`

Comprehensive cache management operations with error handling and configuration.

```tsx
import { useGenericCacheManager } from '@/core/hooks/tanstack'

const CacheManager = () => {
  const {
    invalidateCache,
    removeCache,
    setCache,
    prefetchCache,
    getCacheSnapshot,
    getAllCacheKeys,
    clearAllCache
  } = useGenericCacheManager({
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000    // 10 minutes
  })

  const handleRefreshUser = async (userId: string) => {
    await invalidateCache(['users', userId])
  }

  const handlePreloadUserData = async (userId: string) => {
    await prefetchCache(['users', userId], () => 
      fetch(`/api/users/${userId}`).then(r => r.json())
    )
  }

  const handleCacheUserLocally = (userId: string, userData: User) => {
    setCache(['users', userId], userData)
  }

  return (
    <div>
      <button onClick={() => handleRefreshUser('123')}>
        Refresh User 123
      </button>
      <button onClick={() => handlePreloadUserData('456')}>
        Preload User 456
      </button>
      <button onClick={clearAllCache}>
        Clear All Cache
      </button>
    </div>
  )
}
```

### `useBatchCacheManager`

Efficient batch operations for multiple cache keys.

```tsx
import { useBatchCacheManager } from '@/core/hooks/tanstack'

const BatchCacheManager = () => {
  const { batchOperations } = useBatchCacheManager()

  const handleBulkRefresh = async () => {
    await batchOperations.invalidateMultiple([
      ['users', 'list'],
      ['posts', 'recent'],
      ['notifications', 'unread']
    ])
  }

  const handleBulkCache = () => {
    batchOperations.setMultiple([
      { queryKey: ['app', 'theme'], data: 'dark' },
      { queryKey: ['app', 'language'], data: 'en' },
      { queryKey: ['app', 'timezone'], data: 'UTC' }
    ])
  }

  return (
    <div>
      <button onClick={handleBulkRefresh}>Bulk Refresh</button>
      <button onClick={handleBulkCache}>Bulk Cache Settings</button>
    </div>
  )
}
```

## Cache Synchronization Hooks

### `useGenericCacheSync`

Synchronize data between different query keys with transformation and conditional logic.

```tsx
import { useGenericCacheSync } from '@/core/hooks/tanstack'

const UserDataSync = () => {
  const { syncNow, syncSpecific, getSyncStatus } = useGenericCacheSync({
    syncConfigs: [
      {
        sourceKey: ['users', 'current'],
        targetKeys: [
          ['dashboard', 'user'],
          ['profile', 'user'],
          ['settings', 'user']
        ],
        transformer: (userData: User) => ({
          ...userData,
          lastSynced: Date.now()
        }),
        syncCondition: (userData: User) => userData.isActive,
        enabled: true
      }
    ],
    debounceMs: 500,
    onSyncComplete: (syncedCount) => {
      console.log(`Synced to ${syncedCount} cache keys`)
    },
    onSyncError: (error) => {
      console.error('Sync failed:', error)
    }
  })

  const status = getSyncStatus()

  return (
    <div>
      <button onClick={() => syncNow()} disabled={status.syncing}>
        {status.syncing ? 'Syncing...' : 'Sync Now'}
      </button>
      <button onClick={() => syncSpecific(['users', 'current'])}>
        Sync User Data
      </button>
      {status.lastSync && (
        <p>Last sync: {new Date(status.lastSync).toLocaleString()}</p>
      )}
    </div>
  )
}
```

### `useSimpleCacheSync`

Simplified synchronization for basic use cases.

```tsx
import { useSimpleCacheSync } from '@/core/hooks/tanstack'

const SimpleSync = () => {
  const { syncNow } = useSimpleCacheSync(
    ['users', 'profile'],           // Source key
    [['users', 'avatar'], ['users', 'settings']], // Target keys
    (profile: UserProfile) => ({    // Transformer
      id: profile.id,
      name: profile.name,
      email: profile.email
    })
  )

  return <button onClick={() => syncNow()}>Sync Profile</button>
}
```

## Advanced Patterns

### Cascading Cache Updates

Handle dependent data relationships with automatic cache synchronization.

```tsx
const CascadingCacheExample = () => {
  const { syncNow } = useGenericCacheSync({
    syncConfigs: [
      // University selection affects faculty and course caches
      {
        sourceKey: ['filters', 'university'],
        targetKeys: [['filters', 'faculty'], ['filters', 'course']],
        transformer: () => null, // Clear dependent filters
        syncCondition: (universityId: string) => !!universityId
      },
      // Faculty selection affects course cache
      {
        sourceKey: ['filters', 'faculty'],
        targetKeys: [['filters', 'course']],
        transformer: () => null,
        syncCondition: (facultyId: string) => !!facultyId
      }
    ]
  })

  // Automatically sync when university changes
  useEffect(() => {
    syncNow()
  }, [universityId])
}
```

### Performance-Optimized Cache Resolution

Combine multiple cache management hooks with memoization.

```tsx
const OptimizedCacheComponent = () => {
  // Memoized cache resolution
  const { cacheResult, primitives } = useGenericCacheResolverWithMemoization({
    queryKey: { baseKey: 'users', customKey: ['users', 'active'] },
    selector: (users: User[]) => users.filter(u => u.isActive)
  })

  // Memoized cache sync
  const { syncResult, primitives: syncPrimitives } = useGenericCacheSyncWithMemoization({
    syncConfigs: [{
      sourceKey: ['users', 'active'],
      targetKeys: [['dashboard', 'activeUsers']]
    }]
  })

  // Optimized effect with combined primitives
  useEffect(() => {
    if (cacheResult.data) {
      syncResult.syncNow()
    }
  }, [...primitives, ...syncPrimitives])

  return <UserList users={cacheResult.data} />
}
```

## Best Practices

### 1. Query Key Consistency

Use consistent query key patterns across your application:

```tsx
// Good: Consistent structure
['entity', 'action', ...params]
['users', 'list', { page: 1, limit: 10 }]
['users', 'detail', userId]
['posts', 'list', { category: 'tech' }]

// Avoid: Inconsistent patterns
['getUsersList', page, limit]
[userId, 'user']
['posts-tech-category']
```

### 2. Selective Memoization

Only memoize performance-critical operations:

```tsx
const Component = () => {
  const { data } = useGenericCacheResolver({
    // Memoize complex query keys
    queryKey: useMemo(() => ({
      baseKey: 'users',
      customKey: buildComplexKey(filters, sorting, pagination)
    }), [filters, sorting, pagination]),
    
    // Memoize expensive selectors
    selector: useCallback((data: User[]) => 
      expensiveDataTransformation(data)
    , [dependencies])
  })
}
```

### 3. Error Handling

Implement proper error handling for cache operations:

```tsx
const CacheWithErrorHandling = () => {
  const { prefetchCache } = useGenericCacheManager({
    onError: (error) => {
      console.error('Cache operation failed:', error)
      // Report to error tracking service
    }
  })

  const handlePrefetch = async (key: string[]) => {
    try {
      await prefetchCache(key, fetcherFunction)
    } catch (error) {
      // Handle specific prefetch errors
      showErrorToast('Failed to preload data')
    }
  }
}
```

### 4. Memory Management

Be mindful of cache size and cleanup:

```tsx
const MemoryEfficientCache = () => {
  const { removeCache, getAllCacheKeys } = useGenericCacheManager({
    gcTime: 5 * 60 * 1000 // Short garbage collection time
  })

  // Cleanup old cache entries
  useEffect(() => {
    const cleanup = () => {
      const allKeys = getAllCacheKeys()
      const oldKeys = allKeys.filter(isOldCacheKey)
      oldKeys.forEach(removeCache)
    }

    const interval = setInterval(cleanup, 10 * 60 * 1000) // Every 10 minutes
    return () => clearInterval(interval)
  }, [])
}
```

## Integration with Existing Patterns

These hooks integrate seamlessly with the project's existing patterns:

### With Filter System

```tsx
// Combine with filter resolver hooks
const FilteredListWithCache = () => {
  const { friendlyFilter } = useGenericFriendlyFilterResolver(filterConfig)
  const { data } = useGenericCacheResolver({
    queryKey: {
      baseKey: 'filteredData',
      customKey: ['data', JSON.stringify(friendlyFilter)]
    }
  })

  return <DataList data={data} filters={friendlyFilter} />
}
```

### With RTK Query

```tsx
// Use alongside existing RTK Query setup
const HybridCacheComponent = () => {
  // RTK Query for server state
  const { data: serverData } = useGetUsersQuery()
  
  // TanStack cache for derived/computed state
  const { setCache } = useGenericCacheManager()
  
  useEffect(() => {
    if (serverData) {
      // Cache processed data
      const processedData = processUserData(serverData)
      setCache(['users', 'processed'], processedData)
    }
  }, [serverData])
}
```

## TypeScript Support

All hooks are fully typed with generic support:

```tsx
interface User {
  id: string
  name: string
  email: string
}

// Type-safe cache operations
const TypedCacheExample = () => {
  const { data } = useGenericCacheResolver<{userId: string}, User>({
    queryKey: { baseKey: 'users' },
    selector: (user: User) => user.name // Type-safe selector
  })

  const { setCache } = useGenericCacheManager<User>()
  
  // Type-safe cache operations
  setCache(['users', '123'], {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com'
  })
}
```

This documentation provides comprehensive coverage of the TanStack Query cache management utilities, following the same patterns and conventions as the existing filter resolver system in your codebase.