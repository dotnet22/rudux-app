import { useCallback, useMemo } from 'react'
import type { FieldValues, UseFormSetValue } from 'react-hook-form'
import { extractFriendlyFilterPrimitives } from '../../utils/filters'
import type { CascadingFieldConfig } from '../../utils/form/useCascadingFields'

/**
 * Configuration for generic friendly filter change handler
 */
export interface GenericFriendlyFilterChangeConfig<T extends FieldValues> {
  /** Current filter values */
  currentFilterValues: T
  /** Form setValue function from React Hook Form */
  setValue: UseFormSetValue<T>
  /** Function to handle filter state changes */
  onFilterChange: (newFilters: T) => void
  /** Cascading field configuration for dependent field resets */
  cascadingConfig?: CascadingFieldConfig<T>[]
}

/**
 * Generic hook for creating optimized friendly filter change handlers.
 * Works with any filter model type and uses extractFriendlyFilterPrimitives
 * for optimal performance.
 * 
 * @param config Configuration object with filter values, form handlers, and cascading rules
 * @returns Optimized handleFriendlyFilterChange function
 */
export const useGenericFriendlyFilterChange = <T extends Record<string, unknown>>(
  config: GenericFriendlyFilterChangeConfig<T>
) => {
  const { currentFilterValues, setValue, onFilterChange, cascadingConfig = [] } = config

  // Create cascading map for O(1) lookups - memoized for performance
  const cascadingMap = useMemo(() => {
    const map = new Map<keyof T, (keyof T)[]>()
    cascadingConfig.forEach(({ parent, children }) => {
      map.set(parent, children)
    })
    return map
  }, [cascadingConfig])

  // Generic method to find cascading children for any field type
  const getCascadingChildren = useCallback((fieldKey: keyof T): readonly (keyof T)[] => {
    return cascadingMap.get(fieldKey) || []
  }, [cascadingMap])

  // Extract primitives from current filter values for optimal memoization
  const filterPrimitives = useMemo(() => {
    // Convert filter values to friendly filter format for primitive extraction
    const friendlyFilterLike = {} as Record<keyof T, { Label: string; Value: string | number | boolean | Date | null }>

    for (const key in currentFilterValues) {
      friendlyFilterLike[key] = {
        Label: String(currentFilterValues[key] ?? 'All'),
        Value: currentFilterValues[key] as string | number | boolean | Date | null
      }
    }

    return extractFriendlyFilterPrimitives(friendlyFilterLike)
  }, [currentFilterValues])

  // Optimized generic filter change handler
  const handleFriendlyFilterChange = useCallback((fieldKey: keyof T) => {
    const cascadingChildren = getCascadingChildren(fieldKey)

    // Build filter updates object with minimal operations
    const filterUpdates: Partial<T> = { [fieldKey]: null } as Partial<T>
    const fieldsToReset: (keyof T)[] = [fieldKey]

    // Add cascading children to both update objects
    for (const child of cascadingChildren) {
      filterUpdates[child] = null as T[typeof child]
      fieldsToReset.push(child)
    }

    // Build complete filter state only once using nullish coalescing
    const updatedFilters = {} as T
    for (const key in currentFilterValues) {
      updatedFilters[key] = filterUpdates[key] ?? currentFilterValues[key]
    }

    // Batch form state updates to minimize rerenders
    fieldsToReset.forEach(field => setValue(field as any, null as any))

    // Single state update
    onFilterChange(updatedFilters)
  }, [getCascadingChildren, setValue, onFilterChange, currentFilterValues, ...filterPrimitives])

  return {
    handleFriendlyFilterChange,
    cascadingMap,
    filterPrimitives
  }
}

/**
 * Simplified version for filters without cascading dependencies
 */
export const useSimpleFriendlyFilterChange = <T extends Record<string, unknown>>(
  currentFilterValues: T,
  setValue: UseFormSetValue<T>,
  onFilterChange: (newFilters: T) => void
) => {
  return useGenericFriendlyFilterChange({
    currentFilterValues,
    setValue,
    onFilterChange,
    cascadingConfig: []
  })
}