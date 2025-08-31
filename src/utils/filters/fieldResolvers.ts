import dayjs from 'dayjs'
import type { ComboBoxItem, University } from '../../types/comboBox'

/**
 * Field resolver types for different kinds of filter fields
 */
export type FieldType = 'dropdown' | 'boolean' | 'string' | 'date' | 'custom'

/**
 * Configuration for resolving a single field to a friendly label
 */
export interface FieldResolver<T = unknown> {
  type: FieldType
  dataSource?: ComboBoxItem[] | University[]
  customResolver?: (value: T) => string
  dateFormat?: string
  booleanLabels?: { 
    true: string
    false: string 
    null: string 
  }
}

/**
 * Complete field resolver configuration for a filter model
 */
export type FieldResolverConfig<T> = {
  [K in keyof T]?: FieldResolver<T[K]>
}

/**
 * Resolves a dropdown field value to its label using combo box data
 */
export const resolveDropdownField = (
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
 * Resolves a boolean field with custom labels
 */
export const resolveBooleanField = (
  value: boolean | null,
  labels?: { true: string, false: string, null: string }
): string => {
  if (value === null) return labels?.null || 'All'
  return value ? (labels?.true || 'Active') : (labels?.false || 'Inactive')
}

/**
 * Resolves a string field value
 */
export const resolveStringField = (value: string | null): string => {
  if (!value || value.trim() === '') return 'All'
  return `"${value}"`
}

/**
 * Resolves a date field with custom format
 */
export const resolveDateField = (
  value: Date | null, 
  format = 'MM/DD/YYYY'
): string => {
  if (!value) return 'All'
  return dayjs(value).format(format)
}

/**
 * Automatically detects the field type based on the value
 */
export const detectFieldType = <T>(value: T): FieldType => {
  if (value === null || value === undefined) return 'string'
  if (typeof value === 'boolean') return 'boolean'
  if (value instanceof Date) return 'date'
  if (typeof value === 'string') return 'string'
  return 'custom'
}

/**
 * Resolves a field value using its resolver configuration
 */
export const resolveFieldValue = <T>(
  value: T,
  resolver?: FieldResolver<T>,
  defaultDateFormat?: string
): string => {
  if (!resolver) {
    return String(value || 'All')
  }

  switch (resolver.type) {
    case 'dropdown':
      return resolveDropdownField(value as string | null, resolver.dataSource)
    
    case 'boolean':
      return resolveBooleanField(value as boolean | null, resolver.booleanLabels)
    
    case 'string':
      return resolveStringField(value as string | null)
    
    case 'date':
      return resolveDateField(
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