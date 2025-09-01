import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../../../store/api/baseQuery'
import { noTransform } from '../../../../store/api/transforms'
import type { AcademicYearListRequest, AcademicYearListResponse } from '../../types/academicYear'

export const academicYearsApi = createApi({
  reducerPath: 'academicYearsApi',
  baseQuery,
  tagTypes: ['AcademicYear'],
  endpoints: (builder) => ({
    getAcademicYears: builder.query<AcademicYearListResponse, AcademicYearListRequest>({
      query: (body) => ({
        url: '/MST_AcademicYear/list',
        method: 'POST',
        body,
      }),
      transformResponse: noTransform,
      providesTags: ['AcademicYear'],
    }),
  }),
})

export const { useGetAcademicYearsQuery } = academicYearsApi