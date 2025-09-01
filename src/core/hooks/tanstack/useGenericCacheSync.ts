import { useMemo, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Configuration for cache synchronization
 */
export interface CacheSyncConfig<T> {
  sourceKey: string[]
  targetKeys: string[][]
  transformer?: (sourceData: T) => unknown
  syncCondition?: (sourceData: T) => boolean
  enabled?: boolean
}

/**
 * Configuration for the generic cache sync manager
 */
export interface GenericCacheSyncConfig<T> {
  syncConfigs: CacheSyncConfig<T>[]
  debounceMs?: number
  onSyncComplete?: (synced: number) => void
  onSyncError?: (error: Error) => void
}

/**
 * Result from cache sync operations
 */
export interface CacheSyncResult {
  syncNow: () => Promise<void>
  syncSpecific: (sourceKey: string[]) => Promise<void>
  getSyncStatus: () => { syncing: boolean, lastSync: number | null }
  clearSyncTargets: (sourceKey: string[]) => void
}

/**
 * Generic hook for synchronizing cache data between different query keys.
 * This follows the same pattern as the filter resolver but manages cache sync.
 * 
 * @param config Configuration object with sync rules and options
 * @returns Cache sync result with sync operation methods
 */
export const useGenericCacheSync = <T = unknown>(
  config: GenericCacheSyncConfig<T>
): CacheSyncResult => {
  const queryClient = useQueryClient()
  const { syncConfigs, debounceMs = 300, onSyncComplete, onSyncError } = config

  // Track sync state
  const syncState = useMemo(() => ({
    syncing: false,
    lastSync: null as number | null
  }), [])

  const performSync = useCallback(async (sourceKey?: string[]) => {
    if (syncState.syncing) return
    
    try {
      syncState.syncing = true
      let syncedCount = 0

      const configsToProcess = sourceKey 
        ? syncConfigs.filter(sc => JSON.stringify(sc.sourceKey) === JSON.stringify(sourceKey))
        : syncConfigs

      for (const syncConfig of configsToProcess) {
        const { sourceKey: srcKey, targetKeys, transformer, syncCondition, enabled = true } = syncConfig

        if (!enabled) continue

        const sourceData = queryClient.getQueryData<T>(srcKey)
        if (!sourceData) continue

        // Check sync condition
        if (syncCondition && !syncCondition(sourceData)) continue

        // Transform data if transformer provided
        const dataToSync = transformer ? transformer(sourceData) : sourceData

        // Sync to all target keys
        for (const targetKey of targetKeys) {
          queryClient.setQueryData(targetKey, dataToSync)
          syncedCount++
        }
      }

      syncState.lastSync = Date.now()
      onSyncComplete?.(syncedCount)
    } catch (error) {
      onSyncError?.(error as Error)
    } finally {
      syncState.syncing = false
    }
  }, [queryClient, syncConfigs, onSyncComplete, onSyncError, syncState])

  // Debounced sync function
  const debouncedSync = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (sourceKey?: string[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => performSync(sourceKey), debounceMs)
    }
  }, [performSync, debounceMs])

  const clearSyncTargets = useCallback((sourceKey: string[]) => {
    const relevantConfigs = syncConfigs.filter(sc => 
      JSON.stringify(sc.sourceKey) === JSON.stringify(sourceKey)
    )

    for (const config of relevantConfigs) {
      for (const targetKey of config.targetKeys) {
        queryClient.removeQueries({ queryKey: targetKey })
      }
    }
  }, [queryClient, syncConfigs])

  return useMemo(() => ({
    syncNow: () => performSync(),
    syncSpecific: (sourceKey: string[]) => performSync(sourceKey),
    getSyncStatus: () => ({ ...syncState }),
    clearSyncTargets
  }), [performSync, syncState, clearSyncTargets])
}

/**
 * Simplified version for single source to multiple targets sync.
 * Use this when you have a simple sync scenario.
 */
export const useSimpleCacheSync = <T = unknown>(
  sourceKey: string[],
  targetKeys: string[][],
  transformer?: (data: T) => unknown
): CacheSyncResult => {
  return useGenericCacheSync({
    syncConfigs: [{
      sourceKey,
      targetKeys,
      transformer,
      enabled: true
    }]
  })
}

/**
 * Hook that provides automatic cache sync with memoization utilities.
 * Use this when you need to optimize sync operations with dependencies.
 */
export const useGenericCacheSyncWithMemoization = <T = unknown>(
  config: GenericCacheSyncConfig<T>
) => {
  const syncResult = useGenericCacheSync(config)
  
  // Pre-compute primitives for memoization
  const primitives = useMemo(() => {
    const status = syncResult.getSyncStatus()
    return [
      status.syncing,
      status.lastSync,
      config.syncConfigs.length,
      JSON.stringify(config.syncConfigs.map(sc => sc.sourceKey))
    ]
  }, [syncResult, config.syncConfigs])

  return {
    syncResult,
    primitives
  }
}