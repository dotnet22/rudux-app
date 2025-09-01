import { sanitizeFormData } from '../../../core/api/transforms'
import type { AcademicYear } from '../types/academicYear'
import type { AcademicYearFormData } from '../schema'

/**
 * Transform Academic Year form data to API entity format
 */
export const transformAcademicYearFormData = (formData: AcademicYearFormData): AcademicYear => {
  return sanitizeFormData(formData, {
    pkField: 'AcademicYearPK',
    pkDefault: '',
    emptyStringToNull: ['Description']
  }) as AcademicYear
}