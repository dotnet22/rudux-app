import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../../../store/api/baseQuery'
import type { AcademicYearListRequest, AcademicYearListResponse, AcademicYear, AcademicYearDetails, OperationResponse } from '../../types/academicYear'

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
    getAcademicYearById: builder.query<AcademicYear, string>({
      query: (id) => ({
        url: `/MST_AcademicYear/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'AcademicYear', id }],
    }),
    getAcademicYearView: builder.query<AcademicYearDetails, string>({
      query: (id) => ({
        url: `/MST_AcademicYear/view/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'AcademicYear', id }],
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

export const { useGetAcademicYearsQuery, useGetAcademicYearByIdQuery, useGetAcademicYearViewQuery, useUpdateAcademicYearMutation } = academicYearsApi