import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../../../store/api/baseQuery'
import type { AcademicYearListRequest, AcademicYearListResponse, AcademicYear, OperationResponse } from '../../types/academicYear'

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
      // Remove transform since API doesn't follow expected wrapper format
      // transformResponse: noTransform,
      providesTags: ['AcademicYear'],
    }),
    updateAcademicYear: builder.mutation<OperationResponse, AcademicYear>({
      query: (body) => ({
        url: '/MST_AcademicYear/update',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AcademicYear'],
    }),
  }),
})

export const { useGetAcademicYearsQuery, useUpdateAcademicYearMutation } = academicYearsApi