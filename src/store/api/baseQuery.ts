import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL || 'https://api-iqac.darshanums.in/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('content-type', 'application/json')
    return headers
  },
})

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