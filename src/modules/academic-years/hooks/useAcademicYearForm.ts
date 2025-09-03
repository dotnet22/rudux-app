import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateAcademicYearMutation, useCreateAcademicYearMutation, useGetAcademicYearByIdQuery } from '../store/api/academicYearsApi'
import { academicYearFormSchema, type AcademicYearFormData } from '../schema'
import type { AcademicYear } from '../types/academicYear'
import { transformAcademicYearFormData } from '../utils/transforms'
import { useFormErrorHandler } from '../../../core/hooks/useFormErrorHandler'
import { formatDateForInput, formatDateForSubmission } from '../../../core/utils'

interface UseAcademicYearFormOptions {
  onSuccess?: () => void
  onRefetch?: () => void
}

export const useAcademicYearFormView = ({ onSuccess, onRefetch }: UseAcademicYearFormOptions = {}) => {
  // Stable references for callbacks to prevent unnecessary re-renders
  const onSuccessRef = useRef(onSuccess)
  const onRefetchRef = useRef(onRefetch)
  
  // Update refs when props change
  useEffect(() => {
    onSuccessRef.current = onSuccess
    onRefetchRef.current = onRefetch
  }, [onSuccess, onRefetch])

  // Modal state management
  const [modalState, setModalState] = useState<{
    open: boolean
    mode: 'create' | 'edit'
    selectedAcademicYear?: AcademicYear
  }>({
    open: false,
    mode: 'create'
  })

  // API mutations
  const [updateAcademicYear, { isLoading: isUpdating }] = useUpdateAcademicYearMutation()
  const [createAcademicYear, { isLoading: isCreating }] = useCreateAcademicYearMutation()
  
  // Data fetching for edit mode
  const { data: editAcademicYearData, error: editAcademicYearError, isLoading: isLoadingEditData } = useGetAcademicYearByIdQuery(
    modalState.selectedAcademicYear?.AcademicYearPK || '', 
    { skip: modalState.mode !== 'edit' || !modalState.selectedAcademicYear?.AcademicYearPK }
  )

  // Memoize expensive computations
  const isLoading = useMemo(() => isUpdating || isCreating, [isUpdating, isCreating])
  const initialData = useMemo(() => 
    modalState.mode === 'edit' ? editAcademicYearData : undefined, 
    [modalState.mode, editAcademicYearData]
  )
  const isEditing = useMemo(() => modalState.mode === 'edit', [modalState.mode])

  // Memoize default values to prevent unnecessary form resets
  const defaultValues = useMemo(() => getDefaultValues(initialData), [initialData])

  const form = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearFormSchema),
    defaultValues,
  })

  const { reset, setError } = form
  
  // Memoize form error handler configuration to prevent recreation
  const formErrorConfig = useMemo(() => ({
    setError,
    successMessage: {
      create: 'Academic year created successfully',
      update: 'Academic year updated successfully'
    },
    errorMessage: {
      noChanges: 'No changes were made to the academic year',
      general: 'Failed to save academic year. Please try again.'
    }
  }), [setError])
  
  const { handleSuccess, handleError } = useFormErrorHandler(formErrorConfig)

  useEffect(() => {
    if (initialData) {
      reset(defaultValues)
    }
  }, [initialData, reset, defaultValues])


  // Modal handlers
  const handleOpenModal = useCallback((mode: 'create' | 'edit', academicYear?: AcademicYear) => {
    setModalState({ open: true, mode, selectedAcademicYear: academicYear })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalState({ open: false, mode: 'create', selectedAcademicYear: undefined })
  }, [])

  const handleFormSuccess = useCallback(() => {
    handleCloseModal()
    onSuccessRef.current?.()
    onRefetchRef.current?.()
  }, [handleCloseModal])

  // Memoize onSubmit to prevent unnecessary re-renders
  const onSubmit = useCallback(async (data: AcademicYearFormData) => {
    try {
      const academicYearData = transformAcademicYearFormData(data)

      const result = isEditing 
        ? await updateAcademicYear(academicYearData).unwrap()
        : await createAcademicYear(academicYearData).unwrap()

      const success = handleSuccess(isEditing, result.RowsAffected)
      if (success) {
        handleFormSuccess()
      }
    } catch (error) {
      handleError(error)
    }
  }, [isEditing, updateAcademicYear, createAcademicYear, handleSuccess, handleFormSuccess, handleError])

  // Memoize utility functions to prevent new references
  const memoizedFormatDateForInput = useCallback(formatDateForInput, [])
  const memoizedFormatDateForSubmission = useCallback(formatDateForSubmission, [])

  // Memoize return object to prevent unnecessary re-renders of consuming components
  return useMemo(() => ({
    // Form related
    form,
    isLoading,
    isEditing,
    onSubmit,
    formatDateForInput: memoizedFormatDateForInput,
    formatDateForSubmission: memoizedFormatDateForSubmission,
    
    // Modal related
    modalState,
    editAcademicYearData,
    editAcademicYearError,
    isLoadingEditData,
    handleOpenModal,
    handleCloseModal,
    handleFormSuccess,
  }), [
    form,
    isLoading,
    isEditing,
    onSubmit,
    memoizedFormatDateForInput,
    memoizedFormatDateForSubmission,
    modalState,
    editAcademicYearData,
    editAcademicYearError,
    isLoadingEditData,
    handleOpenModal,
    handleCloseModal,
    handleFormSuccess,
  ])
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