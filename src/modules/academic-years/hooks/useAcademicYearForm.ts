import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateAcademicYearMutation, useCreateAcademicYearMutation } from '../store/api/academicYearsApi'
import { academicYearFormSchema, type AcademicYearFormData } from '../schema'
import type { AcademicYear } from '../types/academicYear'
import { transformAcademicYearFormData } from '../utils/transforms'
import { useFormErrorHandler } from '../../../core/hooks/useFormErrorHandler'
import { formatDateForInput, formatDateForSubmission } from '../../../core/utils'

interface UseAcademicYearFormOptions {
  initialData?: AcademicYear
  onSuccess?: () => void
}

export const useAcademicYearForm = ({ initialData, onSuccess }: UseAcademicYearFormOptions = {}) => {
  const [updateAcademicYear, { isLoading: isUpdating }] = useUpdateAcademicYearMutation()
  const [createAcademicYear, { isLoading: isCreating }] = useCreateAcademicYearMutation()
  
  const isLoading = isUpdating || isCreating
  const isEditing = !!initialData

  const form = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearFormSchema),
    defaultValues: getDefaultValues(initialData),
  })

  const { reset, setError } = form
  
  const { handleSuccess, handleError } = useFormErrorHandler({
    setError,
    successMessage: {
      create: 'Academic year created successfully',
      update: 'Academic year updated successfully'
    },
    errorMessage: {
      noChanges: 'No changes were made to the academic year',
      general: 'Failed to save academic year. Please try again.'
    }
  })

  useEffect(() => {
    if (initialData) {
      reset(getDefaultValues(initialData))
    }
  }, [initialData, reset])


  const onSubmit = async (data: AcademicYearFormData) => {
    try {
      const academicYearData = transformAcademicYearFormData(data)

      const result = isEditing 
        ? await updateAcademicYear(academicYearData).unwrap()
        : await createAcademicYear(academicYearData).unwrap()

      const success = handleSuccess(isEditing, result.RowsAffected)
      if (success) {
        onSuccess?.()
      }
    } catch (error) {
      handleError(error)
    }
  }

  return {
    form,
    isLoading,
    isEditing,
    onSubmit,
    formatDateForInput,
    formatDateForSubmission,
  }
}

function getDefaultValues(initialData?: AcademicYear): Partial<AcademicYearFormData> {
  return {
    AcademicYearPK: initialData?.AcademicYearPK || '',
    AcademicYearName: initialData?.AcademicYearName || '',
    AcademicYear: initialData?.AcademicYear || new Date().getFullYear(),
    AcademicYearFromDate: initialData?.AcademicYearFromDate || '',
    AcademicYearToDate: initialData?.AcademicYearToDate || '',
    FinancialYearFromDate: initialData?.FinancialYearFromDate || '',
    FinancialYearToDate: initialData?.FinancialYearToDate || '',
    CalendarYearFromDate: initialData?.CalendarYearFromDate || '',
    CalendarYearToDate: initialData?.CalendarYearToDate || '',
    Description: initialData?.Description || '',
  }
}