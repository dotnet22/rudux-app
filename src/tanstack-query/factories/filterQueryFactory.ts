import { createQueryKeys } from '@lukemorales/query-key-factory'
import type { ComboBoxItem, University } from '../../types/comboBox'

/**
 * Strongly typed query key factory for filter-related queries
 * Uses @lukemorales/query-key-factory for type-safe query key management
 */
export const filterQueryFactory = createQueryKeys('filter', {
  /**
   * Universities query for dropdown data sources
   */
  universities: () => ({
    queryKey: ['universities'],
    contextQueries: {
      all: () => ({
        queryKey: ['all'],
      }),
      byId: (id: string) => ({
        queryKey: [id],
      }),
    },
  }),

  /**
   * Faculties query for dropdown data sources
   */
  faculties: (universityId?: string | null) => ({
    queryKey: [universityId],
    contextQueries: {
      all: () => ({
        queryKey: ['all'],
      }),
      byUniversity: () => ({
        queryKey: ['by-university'],
      }),
    },
  }),

  /**
   * Courses query for dropdown data sources
   */
  courses: (facultyId?: string | null) => ({
    queryKey: [facultyId],
    contextQueries: {
      all: () => ({
        queryKey: ['all'],
      }),
      byFaculty: () => ({
        queryKey: ['by-faculty'],
      }),
    },
  }),

  /**
   * Generic data source query for any filter field
   */
  dataSource: <T = ComboBoxItem[] | University[]>(key: string, params?: Record<string, unknown>) => ({
    queryKey: [key, params],
    contextQueries: {
      list: () => ({
        queryKey: ['list'],
      }),
      item: (id: string) => ({
        queryKey: ['item', id],
      }),
    },
  }),

  /**
   * Filter-specific queries for data resolution
   */
  filterData: <T>(filterModel: T) => ({
    queryKey: [filterModel],
    contextQueries: {
      resolved: (fieldName: keyof T) => ({
        queryKey: ['resolved', fieldName],
      }),
      dependencies: (dependencies: string[]) => ({
        queryKey: ['dependencies', dependencies],
      }),
    },
  }),
})

/**
 * Type-safe query key getters for common filter operations
 */
export const getFilterQueryKeys = {
  /**
   * Get query key for universities data
   */
  universities: () => filterQueryFactory.universities().queryKey,
  
  /**
   * Get query key for faculties by university
   */
  faculties: (universityId?: string | null) => 
    filterQueryFactory.faculties(universityId).queryKey,
  
  /**
   * Get query key for courses by faculty
   */
  courses: (facultyId?: string | null) => 
    filterQueryFactory.courses(facultyId).queryKey,
  
  /**
   * Get query key for generic data source
   */
  dataSource: <T>(key: string, params?: Record<string, unknown>) => 
    filterQueryFactory.dataSource<T>(key, params).queryKey,
  
  /**
   * Get query key for filter data resolution
   */
  filterData: <T>(filterModel: T) => 
    filterQueryFactory.filterData(filterModel).queryKey,
} as const

/**
 * Query key matchers for invalidation patterns
 */
export const filterQueryMatchers = {
  /**
   * Match all filter-related queries
   */
  all: () => filterQueryFactory._def,
  
  /**
   * Match all universities queries
   */
  universities: () => filterQueryFactory.universities._def,
  
  /**
   * Match faculties queries by university
   */
  faculties: (universityId?: string | null) => 
    filterQueryFactory.faculties(universityId)._def,
  
  /**
   * Match courses queries by faculty
   */
  courses: (facultyId?: string | null) => 
    filterQueryFactory.courses(facultyId)._def,
  
  /**
   * Match data source queries
   */
  dataSource: (key?: string) => 
    key ? filterQueryFactory.dataSource(key)._def : filterQueryFactory._def,
} as const

/**
 * Type exports for consumer usage
 */
export type FilterQueryFactory = typeof filterQueryFactory
export type FilterQueryKeys = typeof getFilterQueryKeys
export type FilterQueryMatchers = typeof filterQueryMatchers