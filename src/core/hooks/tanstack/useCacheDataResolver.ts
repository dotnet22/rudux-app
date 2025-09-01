import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { ComboBoxItem } from '../../types/combo-box'

/**
 * Configuration for cache data access with strong typing
 */
export interface CacheDataConfig<T = unknown> {
  /** The query key used to identify cached data */
  readonly queryKey: readonly string[]
  /** Optional function to transform cached data into ComboBoxItem[] format */
  readonly dataSelector?: (cachedData: T) => ComboBoxItem[]
  /** Whether the cache data resolver is enabled */
  readonly enabled?: boolean
}

/**
 * Result from cache data resolver with comprehensive metadata
 */
export interface CacheDataResult {
  /** The resolved combo box items, empty array if not available */
  readonly data: readonly ComboBoxItem[]
  /** Whether cached data exists and is available */
  readonly isAvailable: boolean
  /** Whether the data array is empty (even if available) */
  readonly isEmpty: boolean
}

/**
 * Hook for accessing cached data to use in friendly filter resolution.
 * This hook retrieves dropdown/combo box data from TanStack Query cache
 * for use with the existing filter resolver system.
 * 
 * @template T The type of the cached data
 * @param config Configuration object with query key and data selector
 * @returns Cache data result with combo box items and metadata
 * 
 * @example
 * ```tsx
 * const { data, isAvailable } = useCacheDataResolver({
 *   queryKey: ['universities', 'list'] as const,
 *   dataSelector: (response: ApiResponse<University[]>) => 
 *     response.data.map(u => ({ Value: u.id, Label: u.name })),
 *   enabled: true
 * })
 * ```
 */
export const useCacheDataResolver = <T = unknown>(
  config: CacheDataConfig<T>
): CacheDataResult => {
  const queryClient = useQueryClient()
  const { queryKey, dataSelector, enabled = true } = config

  return useMemo((): CacheDataResult => {
    if (!enabled) {
      return {
        data: [],
        isAvailable: false,
        isEmpty: true
      } as const
    }

    // Get cached data with proper typing
    const cachedData = queryClient.getQueryData<T>(queryKey as string[])
    
    if (!cachedData) {
      return {
        data: [],
        isAvailable: false,
        isEmpty: true
      } as const
    }

    // Extract combo box items using selector or assume it's already in the right format
    const comboBoxItems = dataSelector 
      ? dataSelector(cachedData) 
      : (cachedData as unknown as ComboBoxItem[])
    
    // Ensure we have a valid array
    const items = Array.isArray(comboBoxItems) ? comboBoxItems : []

    return {
      data: items,
      isAvailable: true,
      isEmpty: items.length === 0
    } as const
  }, [queryClient, queryKey, dataSelector, enabled])
}

