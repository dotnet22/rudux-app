import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'
import { transformToComboBox } from '../../core/api/transforms'
import type { ComboBoxResponse } from '../../core/types/combo-box'

export const facultyApi = createApi({
  reducerPath: 'facultyApi',
  baseQuery,
  tagTypes: ['Faculty'],
  endpoints: (builder) => ({
    getFaculties: builder.query<ComboBoxResponse, string>({
      query: (universityId) => `/INS_Faculty/selectComboBoxByUniversityPK/${universityId}`,
      transformResponse: transformToComboBox,
      providesTags: (result, __, universityId) =>
        result?.data?.length
          ? [
              { type: 'Faculty', id: `LIST_${universityId}` },
              ...result.data.map((item) => ({ type: 'Faculty', id: item.value })),
            ]
          : [{ type: 'Faculty', id: `LIST_${universityId}` }],
    }),
  }),
})

export const { useGetFacultiesQuery } = facultyApi