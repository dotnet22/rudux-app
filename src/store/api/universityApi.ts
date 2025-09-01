import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './baseQuery'
import { noTransform } from '../../core/api/transforms'
import type { University } from '../../core/types/combo-box'

export const universityApi = createApi({
  reducerPath: 'universityApi',
  baseQuery,
  tagTypes: ['University'],
  endpoints: (builder) => ({
    getUniversities: builder.query<University[], void>({
      query: () => '/INS_University/comboBox',
      transformResponse: noTransform,
      providesTags: ['University'],
    }),
  }),
})

export const { useGetUniversitiesQuery } = universityApi