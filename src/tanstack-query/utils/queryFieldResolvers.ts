import dayjs from 'dayjs'
import type { ComboBoxItem, University } from '../../types/comboBox'
import type { 
  QueryFieldType, 
  QueryFieldResolver,
  QueryFieldResolverConfig 
} from '../types/queryFilter.types'

/**
 * Resolves a dropdown field value to its label using combo box data with React Query
 */
export const resolveQueryDropdownField = (
  value: string | null,
  dataSource: ComboBoxItem[] | University[] = []
): string => {
  if (!value || !dataSource?.length) {
    return 'All'
  }
  
  const item = dataSource.find(item => 
    'Value' in item ? item.Value === value : false
  )
  
  return item?.Label || 'Unknown'
}

/**
 * Resolves a boolean field with custom labels for React Query
 */
export const resolveQueryBooleanField = (
  value: boolean | null,
  labels?: { true: string, false: string, null: string }
): string => {
  if (value === null) return labels?.null || 'All'
  return value ? (labels?.true || 'Active') : (labels?.false || 'Inactive')
}

/**
 * Resolves a string field value for React Query
 */
export const resolveQueryStringField = (value: string | null): string => {
  if (!value || value.trim() === '') return 'All'
  return `"${value}"`
}

/**
 * Resolves a date field with custom format for React Query
 */
export const resolveQueryDateField = (
  value: Date | null, 
  format = 'MM/DD/YYYY'
): string => {
  if (!value) return 'All'
  return dayjs(value).format(format)
}

/**
 * Automatically detects the field type based on the value for React Query
 */
export const detectQueryFieldType = <T>(value: T): QueryFieldType => {
  if (value === null || value === undefined) return 'string'
  if (typeof value === 'boolean') return 'boolean'
  if (value instanceof Date) return 'date'
  if (typeof value === 'string') return 'string'
  return 'custom'
}

/**
 * Type guard to check if a value is a valid field type
 */
const isValidFieldValue = (value: unknown): value is string | number | boolean | Date | null => {
  return value === null || 
         typeof value === 'string' || 
         typeof value === 'number' || 
         typeof value === 'boolean' || 
         value instanceof Date
}

/**
 * Strongly typed field value resolver for React Query
 */
export const resolveQueryFieldValue = <T, K extends keyof T>(
  value: T[K],
  resolver?: QueryFieldResolver<T[K]>,
  defaultDateFormat?: string
): string => {
  // Type guard to ensure we're working with valid field values
  if (!isValidFieldValue(value)) {
    return 'Invalid'
  }

  if (!resolver) {
    return String(value || 'All')
  }

  switch (resolver.type) {
    case 'dropdown':
      return resolveQueryDropdownField(value as string | null, resolver.dataSource)
    
    case 'boolean':
      return resolveQueryBooleanField(value as boolean | null, resolver.booleanLabels)
    
    case 'string':
      return resolveQueryStringField(value as string | null)
    
    case 'date':
      return resolveQueryDateField(
        value as Date | null, 
        resolver.dateFormat || defaultDateFormat
      )
    
    case 'custom':
      return resolver.customResolver 
        ? resolver.customResolver(value) 
        : String(value || 'All')
    
    default:
      return String(value || 'All')
  }
}

/**
 * Create a strongly typed field resolver configuration with defaults
 */
export const createQueryFieldResolverConfig = <T>(
  partialConfig: Partial<QueryFieldResolverConfig<T>>
): QueryFieldResolverConfig<T> => {
  return partialConfig as QueryFieldResolverConfig<T>
}

/**
 * Utility to extract query keys from field resolvers for React Query dependencies
 */
export const extractQueryKeysFromResolvers = <T>(
  resolvers: QueryFieldResolverConfig<T>
): readonly unknown[][] => {
  const queryKeys: readonly unknown[][] = []
  
  for (const key in resolvers) {
    const resolver = resolvers[key]
    if (resolver?.queryKey) {
      queryKeys.push(resolver.queryKey)
    }
  }
  
  return queryKeys
}

/**
 * Type-safe resolver factory for common field types
 */
export const createQueryFieldResolver = <T>() => ({
  dropdown: (
    dataSource?: ComboBoxItem[] | University[],
    queryKey?: readonly unknown[]
  ): QueryFieldResolver<T> => ({
    type: 'dropdown' as const,
    dataSource,
    queryKey,
  }),

  boolean: (
    labels?: { true: string, false: string, null: string }
  ): QueryFieldResolver<T> => ({
    type: 'boolean' as const,
    booleanLabels: labels,
  }),

  string: (): QueryFieldResolver<T> => ({
    type: 'string' as const,
  }),

  date: (
    dateFormat?: string,
    queryKey?: readonly unknown[]
  ): QueryFieldResolver<T> => ({
    type: 'date' as const,
    dateFormat,
    queryKey,
  }),

  custom: (
    customResolver: (value: T) => string,
    queryKey?: readonly unknown[]
  ): QueryFieldResolver<T> => ({
    type: 'custom' as const,
    customResolver,
    queryKey,
  }),
})

/**
 * Helper to validate resolver configuration at runtime
 */
export const validateQueryFieldResolver = <T, K extends keyof T>(
  fieldName: K,
  resolver: QueryFieldResolver<T[K]>
): boolean => {
  if (!resolver.type) return false
  
  if (resolver.type === 'dropdown' && !resolver.dataSource && !resolver.queryKey) {
    console.warn(`Dropdown resolver for field '${String(fieldName)}' has no data source or query key`)
    return false
  }
  
  if (resolver.type === 'custom' && !resolver.customResolver) {
    console.warn(`Custom resolver for field '${String(fieldName)}' has no custom resolver function`)
    return false
  }
  
  return true
}