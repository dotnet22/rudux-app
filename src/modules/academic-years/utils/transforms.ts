import { sanitizeFormData } from '../../../core/api/transforms'
import type { AcademicYear } from '../types/academicYear'
import type { AcademicYearFormData } from '../schema'

/**
 * Transform Academic Year form data to API entity format
 * 
 * This function sanitizes Academic Year form data for API submission by:
 * - Setting empty AcademicYearPK to empty string (for new records)
 * - Converting empty Description fields to null
 * 
 * @param formData - The validated form data from React Hook Form
 * @returns Sanitized AcademicYear entity ready for API submission
 * 
 * @example
 * ```typescript
 * const onSubmit = async (data: AcademicYearFormData) => {
 *   const academicYearData = transformAcademicYearFormData(data)
 *   await updateAcademicYear(academicYearData)
 * }
 * ```
 */
export const transformAcademicYearFormData = (formData: AcademicYearFormData): AcademicYear => {
  return sanitizeFormData(formData, {
    pkField: 'AcademicYearPK',
    pkDefault: '',
    emptyStringToNull: ['Description']
  }) as AcademicYear
}