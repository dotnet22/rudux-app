import type { FieldResolverConfig } from '../../utils/filters/fieldResolvers'
import type { ProgramFilterModel } from '../../types/program'
import type { FilterModel } from '../../types/academicYear'
import type { ComboBoxItem, University } from '../../types/comboBox'

/**
 * Preset configuration for ProgramFilterModel
 * This maintains compatibility with the existing useFriendlyFilterResolver
 */
export const createProgramFilterResolverConfig = (
  universities: University[] = [],
  faculties: ComboBoxItem[] = [],
  courses: ComboBoxItem[] = []
): FieldResolverConfig<ProgramFilterModel> => ({
  UniversityPK: { 
    type: 'dropdown', 
    dataSource: universities 
  },
  FacultyPK: { 
    type: 'dropdown', 
    dataSource: faculties 
  },
  CoursePK: { 
    type: 'dropdown', 
    dataSource: courses 
  },
  IsActive: { 
    type: 'boolean',
    booleanLabels: { 
      true: 'Active', 
      false: 'Inactive', 
      null: 'All' 
    }
  },
  SearchTerm: { 
    type: 'string' 
  },
  CreatedAfter: { 
    type: 'date', 
    dateFormat: 'MM/DD/YYYY' 
  }
})

/**
 * Preset configuration for AcademicYear FilterModel
 * Example configuration for the academic year filter
 */
export const createAcademicYearFilterResolverConfig = (
  universities: University[] = [],
  faculties: ComboBoxItem[] = [],
  courses: ComboBoxItem[] = [],
  specializations: ComboBoxItem[] = []
): FieldResolverConfig<FilterModel> => ({
  ProgramName: { 
    type: 'string' 
  },
  UniversityPK: { 
    type: 'dropdown', 
    dataSource: universities 
  },
  CoursePK: { 
    type: 'dropdown', 
    dataSource: courses 
  },
  FacultyPK: { 
    type: 'dropdown', 
    dataSource: faculties 
  },
  SpecializationPK: { 
    type: 'dropdown', 
    dataSource: specializations 
  }
})

/**
 * Common field resolver configurations that can be reused
 */
export const commonFieldResolvers = {
  /**
   * Standard university dropdown resolver
   */
  universityDropdown: (universities: University[]) => ({
    type: 'dropdown' as const,
    dataSource: universities
  }),

  /**
   * Standard faculty dropdown resolver
   */
  facultyDropdown: (faculties: ComboBoxItem[]) => ({
    type: 'dropdown' as const,
    dataSource: faculties
  }),

  /**
   * Standard course dropdown resolver
   */
  courseDropdown: (courses: ComboBoxItem[]) => ({
    type: 'dropdown' as const,
    dataSource: courses
  }),

  /**
   * Standard active/inactive boolean resolver
   */
  activeBoolean: {
    type: 'boolean' as const,
    booleanLabels: { 
      true: 'Active', 
      false: 'Inactive', 
      null: 'All' 
    }
  },

  /**
   * Standard published/draft boolean resolver
   */
  publishedBoolean: {
    type: 'boolean' as const,
    booleanLabels: { 
      true: 'Published', 
      false: 'Draft', 
      null: 'All' 
    }
  },

  /**
   * Standard search term resolver
   */
  searchTerm: {
    type: 'string' as const
  },

  /**
   * Standard date resolver with MM/DD/YYYY format
   */
  standardDate: {
    type: 'date' as const,
    dateFormat: 'MM/DD/YYYY'
  },

  /**
   * ISO date resolver with YYYY-MM-DD format
   */
  isoDate: {
    type: 'date' as const,
    dateFormat: 'YYYY-MM-DD'
  }
}

/**
 * Builder function for creating custom field resolver configurations
 */
export const createCustomFieldResolvers = <T>(): {
  dropdown: (dataSource: ComboBoxItem[] | University[]) => FieldResolverConfig<T>[keyof T]
  boolean: (labels?: { true: string, false: string, null: string }) => FieldResolverConfig<T>[keyof T]
  string: () => FieldResolverConfig<T>[keyof T]
  date: (format?: string) => FieldResolverConfig<T>[keyof T]
  custom: (resolver: (value: unknown) => string) => FieldResolverConfig<T>[keyof T]
} => ({
  dropdown: (dataSource) => ({ type: 'dropdown', dataSource }),
  boolean: (labels) => ({ type: 'boolean', booleanLabels: labels }),
  string: () => ({ type: 'string' }),
  date: (format = 'MM/DD/YYYY') => ({ type: 'date', dateFormat: format }),
  custom: (resolver) => ({ type: 'custom', customResolver: resolver })
})