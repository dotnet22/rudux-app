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
      providesTags: (result, __, facultyId) =>
        result?.length
          ? [
              { type: 'Course', id: `LIST_${facultyId}` },
              ...result.map((item) => ({ type: 'Course', id: item.Value })),
            ]
          : [{ type: 'Course', id: `LIST_${facultyId}` }],
    }),
  }),
})

export const { useGetCoursesQuery } = courseApi