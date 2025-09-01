import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'
import { transformToComboBox } from './transforms'
import type { ComboBoxResponse } from '../../types/comboBox'

export const facultyApi = createApi({
  reducerPath: 'facultyApi',
  baseQuery,
  tagTypes: ['Faculty'],
  endpoints: (builder) => ({
    getFaculties: builder.query<ComboBoxResponse, string>({
      query: (universityId) => `/INS_Faculty/selectComboBoxByUniversityPK/${universityId}`,
      transformResponse: transformToComboBox,
      providesTags: ['Faculty'],
    }),
  }),
})

export const { useGetFacultiesQuery } = facultyApi