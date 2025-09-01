import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

const baseQueryRaw = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'https://api-iqac.darshanums.in/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('content-type', 'application/json')
    return headers
  },
})

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQueryRaw(args, api, extraOptions)
  
  // Enhanced error logging
  if (result.error) {
    console.error('API Error Details:', {
      status: result.error.status,
      data: result.error.data,
      fullError: result.error,
      args,
      responseDataStringified: JSON.stringify(result.error.data, null, 2)
    })
  }
  
  // Log successful responses too to understand structure
  if (result.data) {
    console.log('API Success Response:', {
      data: result.data,
      dataStringified: JSON.stringify(result.data, null, 2)
    })
  }
  
  return result
}

export const createModuleApi = <T extends string>(
  reducerPath: T,
  tagTypes: readonly string[]
) => {
  return {
    reducerPath,
    baseQuery,
    tagTypes,
    endpoints: () => ({})
  }
}