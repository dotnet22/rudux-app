import type { ApiResponse, OperationResponse } from './types'

/**
 * Extract apiData from ApiResponse wrapper or return direct response
 */
export const extractApiData = <T>(response: ApiResponse<T> | T): T => {
  // If response is already the data type (direct response)
  if (response && typeof response === 'object' && !('apiData' in response)) {
    return response as T
  }
  
  // If response is wrapped in ApiResponse
  const apiResponse = response as ApiResponse<T>
  if (apiResponse.apiData !== undefined) {
    return apiResponse.apiData
  }
  
  throw new Error(apiResponse.title || 'API response missing data')
}

/**
 * Handle mutation responses with OperationResponse
 */
export const handleMutationResponse = (response: ApiResponse<OperationResponse>) => {
  const operationData = extractApiData(response)
  return {
    success: operationData.rowsAffected > 0,
    id: operationData.id,
    rowsAffected: operationData.rowsAffected
  }
}

/**
 * Generic transform function for ApiResponse data
 */
export const transformApiResponse = <T, R>(
  transformer: (data: T) => R
) => (response: ApiResponse<T> | T): R => {
  const data = extractApiData(response)
  return transformer(data)
}

/**
 * Transform API response to combo box format with id field
 */
export const transformToComboBox = transformApiResponse(
  (response: { Value: string; Label: string }[]) =>
    response.map(item => ({ ...item, id: item.Value }))
)

/**
 * Pass-through transformer for when no transformation is needed
 */
export const noTransform = <T>(response: unknown): T => 
  extractApiData(response as ApiResponse<T> | T)

/**
 * Generic form data sanitizer that handles common form-to-entity transformations
 * 
 * This utility helps clean up form data before sending to APIs by handling:
 * - Setting default values for primary key fields
 * - Converting empty strings to null for specified fields
 * 
 * @example
 * ```typescript
 * const sanitized = sanitizeFormData(formData, {
 *   pkField: 'AcademicYearPK',
 *   pkDefault: '',
 *   emptyStringToNull: ['Description']
 * })
 * ```
 * 
 * @param formData - The form data object to sanitize
 * @param options - Configuration options for sanitization
 * @param options.pkField - Primary key field to apply defaults to
 * @param options.pkDefault - Default value for primary key (defaults to empty string)
 * @param options.emptyStringToNull - Array of fields to convert empty strings to null
 * @returns Sanitized form data
 */
export const sanitizeFormData = <T extends Record<string, unknown>>(
  formData: T,
  options: {
    pkField?: keyof T
    pkDefault?: string
    emptyStringToNull?: (keyof T)[]
  } = {}
): T => {
  const {
    pkField,
    pkDefault = '',
    emptyStringToNull = []
  } = options

  const sanitized = { ...formData }

  // Handle primary key default
  if (pkField && !sanitized[pkField]) {
    sanitized[pkField] = pkDefault as T[keyof T]
  }

  // Convert empty strings to null for specified fields
  emptyStringToNull.forEach(field => {
    if (sanitized[field] === '') {
      sanitized[field] = null as T[keyof T]
    }
  })

  return sanitized
}

