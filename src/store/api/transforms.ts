import type { ApiResponse, OperationResponse } from './types'

/**
 * Extract apiData from ApiResponse wrapper
 */
export const extractApiData = <T>(response: ApiResponse<T>): T => {
  if (response.apiData !== undefined) {
    return response.apiData
  }
  throw new Error(response.title || 'API response missing data')
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
) => (response: ApiResponse<T>): R => {
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
export const noTransform = <T>(response: ApiResponse<T>): T => 
  extractApiData(response)

