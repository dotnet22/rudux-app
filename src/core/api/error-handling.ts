import { useCallback } from 'react'
import type { ApiResponse, ValidationErrors } from './types'

// RTK Query error types
interface RTKQueryError {
  data?: ApiResponse<unknown>
  status?: number | string
  error?: string
}

// Type guard to check if error is RTK Query error
const isRTKQueryError = (error: unknown): error is RTKQueryError => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'data' in error &&
    typeof (error as RTKQueryError).data === 'object'
  )
}

export interface ProcessedApiError {
  type: 'validation' | 'general' | 'unknown'
  title?: string
  status?: number
  traceId?: string
  fields?: ValidationErrors
}

/**
 * Hook for processing API errors consistently across the application
 */
export const useApiError = () => {
  const processError = useCallback((error: unknown): ProcessedApiError => {
    if (isRTKQueryError(error) && error.data) {
      const apiError = error.data
      
      // Handle validation errors
      if (apiError.modelErrors && apiError.errors) {
        return {
          type: 'validation',
          title: apiError.title || 'Validation failed',
          status: apiError.status,
          traceId: apiError.traceId,
          fields: apiError.errors
        }
      }
      
      // Handle general API errors
      return {
        type: 'general',
        title: apiError.title || 'An error occurred',
        status: apiError.status,
        traceId: apiError.traceId
      }
    }
    
    // Unknown error format
    return {
      type: 'unknown',
      title: 'An unexpected error occurred'
    }
  }, [])
  
  const getFieldError = useCallback((fields: ValidationErrors | undefined, fieldName: string): string | undefined => {
    if (!fields || !fields[fieldName]) return undefined
    
    const fieldError = fields[fieldName]
    
    if (typeof fieldError === 'string') {
      return fieldError
    }
    
    if (Array.isArray(fieldError)) {
      return fieldError.join(', ')
    }
    
    if (typeof fieldError === 'object' && 'message' in fieldError) {
      return fieldError.message
    }
    
    return undefined
  }, [])
  
  return {
    processError,
    getFieldError
  }
}

