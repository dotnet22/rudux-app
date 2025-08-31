import type { ComboBoxItem, University } from '../../types/comboBox'

/**
 * Field resolver types for different kinds of filter fields in React Query context
 */
export type QueryFieldType = 'dropdown' | 'boolean' | 'string' | 'date' | 'custom'

/**
 * Configuration for resolving a single field to a friendly label using React Query
 */
export interface QueryFieldResolver<T = unknown> {
  type: QueryFieldType
  dataSource?: ComboBoxItem[] | University[]
  queryKey?: readonly unknown[] // For React Query integration
  customResolver?: (value: T) => string
  dateFormat?: string
  booleanLabels?: { 
    true: string
    false: string 
    null: string 
  }
}

/**
 * Complete field resolver configuration for a filter model with React Query
 */
export type QueryFieldResolverConfig<T> = {
  [K in keyof T]?: QueryFieldResolver<T[K]>
}

/**
 * Friendly filter model structure for React Query
 */
export type QueryFriendlyFilterModel = {
  Label: string
  Value: string | number | boolean | Date | null
}

/**
 * Complete friendly filter record for a filter model type
 */
export type QueryFriendlyFilterRecord<T> = Record<keyof T, QueryFriendlyFilterModel>

/**
 * Configuration for the generic React Query friendly filter resolver
 */
export interface QueryFriendlyFilterConfig<T> {
  filterModel: T
  fieldResolvers: QueryFieldResolverConfig<T>
  dateFormat?: string
}

/**
 * Return type for the memoization variant of the hook
 */
export interface QueryFriendlyFilterWithMemoization<T> {
  friendlyFilter: QueryFriendlyFilterRecord<T>
  primitives: (string | number | boolean | Date | null)[]
  queryKeys: readonly unknown[][]
}

/**
 * Query data source configuration for dropdown fields
 */
export interface QueryDataSourceConfig {
  queryKey: readonly unknown[]
  enabled?: boolean
  staleTime?: number
}

/**
 * Extended query field resolver with React Query specific options
 */
export interface ExtendedQueryFieldResolver<T = unknown> extends QueryFieldResolver<T> {
  queryDataSource?: QueryDataSourceConfig
  invalidateOnChange?: boolean
}