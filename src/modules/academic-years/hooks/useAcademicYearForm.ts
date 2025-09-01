import { useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useUpdateAcademicYearMutation } from '../store/api/academicYearsApi'
import { academicYearFormSchema, type AcademicYearFormData } from '../schema'
import type { AcademicYear } from '../types/academicYear'
import { transformAcademicYearFormData } from '../utils/transforms'

interface UseAcademicYearFormOptions {
  initialData?: AcademicYear
  onSuccess?: () => void
}

export const useAcademicYearForm = ({ initialData, onSuccess }: UseAcademicYearFormOptions = {}) => {
  const [updateAcademicYear, { isLoading }] = useUpdateAcademicYearMutation()

  const form = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearFormSchema),
    defaultValues: getDefaultValues(initialData),
  })

  const { reset } = form

  useEffect(() => {
    if (initialData) {
      reset(getDefaultValues(initialData))
    }
  }, [initialData, reset])

  const formatDateForInput = useCallback((dateString: string) => {
    if (!dateString) return null
    try {
      return new Date(dateString)
    } catch {
      return null
    }
  }, [])

  const formatDateForSubmission = useCallback((date: Date | null) => {
    if (!date) return ''
    return date.toISOString()
  }, [])

  const onSubmit = async (data: AcademicYearFormData) => {
    try {
      const academicYearData = transformAcademicYearFormData(data)

      const result = await updateAcademicYear(academicYearData).unwrap()

      if (result.rowsAffected > 0) {
        toast.success(
          initialData
            ? 'Academic year updated successfully'
            : 'Academic year created successfully'
        )
        onSuccess?.()
      } else {
        toast.error('No changes were made to the academic year')
      }
    } catch (error) {
      console.error('Error saving academic year:', error)
      toast.error('Failed to save academic year. Please try again.')
    }
  }

  const isEditing = !!initialData

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