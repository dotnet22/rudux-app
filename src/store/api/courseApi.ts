import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ComboBoxResponse } from '../../types/comboBox'

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api-iqac.darshanums.in/api',
    prepareHeaders: (headers) => {
      headers.set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJnaXZlbl9uYW1lIjoiR2xvYmFsIEFkbWluIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy91c2VyZGF0YSI6IntcImVtYWlsXCI6XCJhZG1pbkBsb2NhbGhvc3QuY29tXCIsXCJSb2xlSWRcIjpcIjFcIixcIlJvbGVcIjpcIlN1cGVyQWRtaW5cIixcInBhdGhcIjpcIi9hZG1pbnBhbmVsXCIsXCJkaXNwbGF5TmFtZVwiOlwiR2xvYmFsIEFkbWluXCJ9IiwiZXhwIjoxNzU2Nzk1MDM4LCJpc3MiOiJodHRwczovL2FwaS1pcWFjLmRhcnNoYW51bXMuaW4vIiwiYXVkIjoiaHR0cHM6Ly9hcGktaXFhYy5kYXJzaGFudW1zLmluLyJ9.cCZUsC8ckA87Czo4p3Bqia0rpgm8Hq2Z8mWe-oWx44Y')
      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Course'],
  endpoints: (builder) => ({
    getCourses: builder.query<ComboBoxResponse, string>({
      query: (facultyId) => ({
        url: `/INS_Course/SelectComboBoxByFacultyPK/${facultyId}`,
        method: 'GET',
      }),
      transformResponse: (response: { Value: string; Label: string }[]) => 
        response.map(item => ({ ...item, id: item.Value })),
      providesTags: ['Course'],
    }),
  }),
})

export const { useGetCoursesQuery } = courseApi