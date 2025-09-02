import { useCallback } from 'react'
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form'
import { toast } from 'sonner'
import { useApiError } from '../api/error-handling'

interface UseFormErrorHandlerOptions<TFieldValues extends FieldValues> {
  setError: UseFormSetError<TFieldValues>
  successMessage?: {
    create: string
    update: string
  }
  errorMessage?: {
    noChanges: string
    general: string
  }
}

/**
 * Hook to handle API errors in forms with standardized error handling and toast messages
 */
export const useFormErrorHandler = <TFieldValues extends FieldValues>({
  setError,
  successMessage = {
    create: 'Created successfully',
    update: 'Updated successfully'
  },
  errorMessage = {
    noChanges: 'No changes were made',
    general: 'Failed to save. Please try again.'
  }
}: UseFormErrorHandlerOptions<TFieldValues>) => {
  const { processError, getFieldError } = useApiError()

  const handleSuccess = useCallback((isEditing: boolean, rowsAffected?: number) => {
    if (rowsAffected !== undefined && rowsAffected > 0) {
      toast.success(isEditing ? successMessage.update : successMessage.create)
      return true
    } else if (rowsAffected === 0) {
      toast.error(errorMessage.noChanges)
      return false
    }
    // If rowsAffected is undefined, assume success
    toast.success(isEditing ? successMessage.update : successMessage.create)
    return true
  }, [successMessage, errorMessage])

  const handleError = useCallback((error: unknown) => {
    console.error('Form submission error:', error)
    
    const processedError = processError(error)
    
    if (processedError.type === 'validation' && processedError.fields) {
      // Set field-specific errors using react-hook-form's setError
      Object.keys(processedError.fields).forEach((fieldName) => {
        const fieldError = getFieldError(processedError.fields, fieldName)
        if (fieldError) {
          setError(fieldName as Path<TFieldValues>, {
            type: 'server',
            message: fieldError
          })
        }
      })
      
      // Show general validation error toast
      toast.error(processedError.title || 'Please check the form for validation errors')
    } else {
      // Show general error toast for non-validation errors
      toast.error(processedError.title || errorMessage.general)
    }
  }, [processError, getFieldError, setError, errorMessage])

  return {
    handleSuccess,
    handleError
  }
}