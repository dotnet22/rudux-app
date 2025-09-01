import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'
import { transformToComboBox } from '../../core/api/transforms'
import type { ComboBoxResponse } from '../../core/types/combo-box'

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery,
  tagTypes: ['Course'],
  endpoints: (builder) => ({
    getCourses: builder.query<ComboBoxResponse, string>({
      query: (facultyId) => `/INS_Course/SelectComboBoxByFacultyPK/${facultyId}`,
      transformResponse: transformToComboBox,
      providesTags: ['Course'],
    }),
  }),
})

export const { useGetCoursesQuery } = courseApi