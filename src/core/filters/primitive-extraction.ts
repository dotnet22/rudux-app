import type { FriendlyFilterRecord } from '../../modules/programs/types/program'

/**
 * Extracts primitive values from a friendly filter record for optimal memoization.
 * This maintains the same performance as manually listing all Label/Value pairs
 * in React dependency arrays.
 * 
 * @param friendlyFilter The friendly filter record to extract primitives from
 * @returns Array of primitive values for use in dependency arrays
 */
export const extractFriendlyFilterPrimitives = <T>(
  friendlyFilter: FriendlyFilterRecord<T>
): (string | number | boolean | Date | null)[] => {
  const primitives: (string | number | boolean | Date | null)[] = []
  
  // Extract Label and Value for each field in consistent order
  for (const key in friendlyFilter) {
    const filter = friendlyFilter[key]
    if (filter) {
      primitives.push(filter.Label, filter.Value)
    }
  }
  
  return primitives
}

/**
 * Creates a stable hash from primitive values for deep comparison.
 * Useful when you need a single value for comparison instead of spreading primitives.
 * 
 * @param friendlyFilter The friendly filter record to hash
 * @returns A stable string representation of all primitive values
 */
export const createFriendlyFilterHash = <T>(
  friendlyFilter: FriendlyFilterRecord<T>
): string => {
  const primitives = extractFriendlyFilterPrimitives(friendlyFilter)
  return JSON.stringify(primitives)
}

/**
 * Compares two friendly filter records by their primitive values.
 * More efficient than deep object comparison.
 * 
 * @param prev Previous friendly filter record
 * @param next Next friendly filter record  
 * @returns True if primitive values are identical
 */
export const areFriendlyFiltersEqual = <T>(
  prev: FriendlyFilterRecord<T>,
  next: FriendlyFilterRecord<T>
): boolean => {
  const prevPrimitives = extractFriendlyFilterPrimitives(prev)
  const nextPrimitives = extractFriendlyFilterPrimitives(next)
  
  if (prevPrimitives.length !== nextPrimitives.length) {
    return false
  }
  
  return prevPrimitives.every((value, index) => value === nextPrimitives[index])
}