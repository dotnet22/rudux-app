import dayjs from 'dayjs'
import type { ComboBoxItem, University } from '../../types/comboBox'
import type { 
  QueryFriendlyFilterModel, 
  QueryFriendlyFilterRecord,
  QueryFieldResolverConfig
} from '../types/queryFilter.types'
import { resolveQueryFieldValue } from './queryFieldResolvers'

/**
 * Creates a friendly filter value object for React Query
 */
export const createQueryFriendlyFilterValue = (
  label: string,
  value: string | number | boolean | Date | null
): QueryFriendlyFilterModel => ({
  Label: label,
  Value: value,
})

/**
 * Resolves label from ComboBox data for React Query (legacy compatibility)
 */
export const resolveQueryLabelFromComboBoxData = (
  value: string | null,
  comboBoxData: ComboBoxItem[] | University[]
): string => {
  if (!value || !comboBoxData?.length) {
    return 'All'
  }
  
  const item = comboBoxData.find(item => 
    'Value' in item ? item.Value === value : false
  )
  
  return item?.Label || 'Unknown'
}

/**
 * Resolves boolean label for React Query (legacy compatibility)
 */
export const resolveQueryBooleanLabel = (value: boolean | null): string => {
  if (value === null) return 'All'
  return value ? 'Active' : 'Inactive'
}

/**
 * Resolves string label for React Query (legacy compatibility)
 */
export const resolveQueryStringLabel = (value: string | null): string => {
  if (!value || value.trim() === '') return 'All'
  return `"${value}"`
}

/**
 * Resolves date label for React Query (legacy compatibility)
 */
export const resolveQueryDateLabel = (value: Date | null, format = 'MM/DD/YYYY'): string => {
  if (!value) return 'All'
  return dayjs(value).format(format)
}

/**
 * Creates an empty friendly filter for React Query
 */
export const createEmptyQueryFriendlyFilter = (): QueryFriendlyFilterModel => 
  createQueryFriendlyFilterValue('All', null)

/**
 * Strongly typed function to create a friendly filter record for React Query
 */
export const createQueryFriendlyFilterRecord = <T>(
  filterModel: T,
  fieldResolvers: QueryFieldResolverConfig<T>,
  dateFormat = 'MM/DD/YYYY'
): QueryFriendlyFilterRecord<T> => {
  const result = {} as QueryFriendlyFilterRecord<T>
  
  for (const key in filterModel) {
    const value = filterModel[key]
    const resolver = fieldResolvers[key]
    
    // Use the strongly typed resolver
    const label = resolveQueryFieldValue(value, resolver, dateFormat)
    
    // Type-safe creation of friendly filter value
    result[key] = createQueryFriendlyFilterValue(
      label, 
      value as string | number | boolean | Date | null
    )
  }
  
  return result
}

/**
 * Type-safe utility to extract primitive values from friendly filter
 */
export const extractQueryFriendlyFilterPrimitives = <T>(
  friendlyFilter: QueryFriendlyFilterRecord<T>
): (string | number | boolean | Date | null)[] => {
  const values: (string | number | boolean | Date | null)[] = []
  
  for (const key in friendlyFilter) {
    const filter = friendlyFilter[key]
    if (filter) {
      values.push(filter.Label, filter.Value)
    }
  }
  
  return values
}

/**
 * Utility to extract query keys from friendly filter configuration
 */
export const extractQueryKeysFromFriendlyFilter = <T>(
  fieldResolvers: QueryFieldResolverConfig<T>
): readonly unknown[][] => {
  const queryKeys: readonly unknown[][] = []
  
  for (const key in fieldResolvers) {
    const resolver = fieldResolvers[key]
    if (resolver?.queryKey) {
      queryKeys.push(resolver.queryKey)
    }
  }
  
  return queryKeys
}

/**
 * Type-safe validator for friendly filter record
 */
export const validateQueryFriendlyFilterRecord = <T>(
  record: QueryFriendlyFilterRecord<T>,
  filterModel: T
): boolean => {
  for (const key in filterModel) {
    if (!(key in record)) {
      console.warn(`Missing friendly filter for field: ${String(key)}`)
      return false
    }
    
    const filter = record[key]
    if (!filter || typeof filter.Label !== 'string') {
      console.warn(`Invalid friendly filter for field: ${String(key)}`)
      return false
    }
  }
  
  return true
}

/**
 * Utility to merge friendly filter records (for composition)
 */
export const mergeQueryFriendlyFilterRecords = <T, U>(
  record1: QueryFriendlyFilterRecord<T>,
  record2: QueryFriendlyFilterRecord<U>
): QueryFriendlyFilterRecord<T & U> => {
  return { ...record1, ...record2 } as QueryFriendlyFilterRecord<T & U>
}

/**
 * Helper to create a partial friendly filter record
 */
export const createPartialQueryFriendlyFilterRecord = <T, K extends keyof T>(
  filterModel: Pick<T, K>,
  fieldResolvers: Pick<QueryFieldResolverConfig<T>, K>,
  dateFormat = 'MM/DD/YYYY'
): Pick<QueryFriendlyFilterRecord<T>, K> => {
  const result = {} as Pick<QueryFriendlyFilterRecord<T>, K>
  
  for (const key in filterModel) {
    const value = filterModel[key]
    const resolver = fieldResolvers[key]
    
    const label = resolveQueryFieldValue(value, resolver, dateFormat)
    
    result[key] = createQueryFriendlyFilterValue(
      label, 
      value as string | number | boolean | Date | null
    )
  }
  
  return result
}