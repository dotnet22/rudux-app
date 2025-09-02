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
      providesTags: (result) => 
        result?.Data?.length 
          ? [
              { type: 'AcademicYear' as const, id: 'LIST' },
              ...result.Data.map((item) => ({ type: 'AcademicYear' as const, id: item.AcademicYearPK })),
            ]
          : [{ type: 'AcademicYear' as const, id: 'LIST' }],
    }),
    getAcademicYearById: builder.query<AcademicYear, string>({
      query: (id) => ({
        url: `/MST_AcademicYear/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'AcademicYear' as const, id }],
    }),
    getAcademicYearView: builder.query<AcademicYearDetails, string>({
      query: (id) => ({
        url: `/MST_AcademicYear/view/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'AcademicYear' as const, id }],
    }),
    updateAcademicYear: builder.mutation<OperationResponse, AcademicYear>({
      query: (body) => ({
        url: '/MST_AcademicYear/update',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AcademicYear' as const, id: 'LIST' }],
    }),
    deleteAcademicYear: builder.mutation<OperationResponse, string>({
      query: (id) => ({
        url: `/MST_AcademicYear/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AcademicYear' as const, id: 'LIST' }],
    }),
    getAcademicYearInsertTemplate: builder.query<AcademicYear, void>({
      query: () => ({
        url: '/MST_AcademicYear/insert',
        method: 'GET',
      }),
      providesTags: [{ type: 'AcademicYear' as const, id: 'TEMPLATE' }],
    }),
    createAcademicYear: builder.mutation<OperationResponse, AcademicYear>({
      query: (body) => ({
        url: '/MST_AcademicYear/insert',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AcademicYear' as const, id: 'LIST' }],
    }),
  }),
})

export const { useGetAcademicYearsQuery, useGetAcademicYearByIdQuery, useGetAcademicYearViewQuery, useUpdateAcademicYearMutation, useDeleteAcademicYearMutation, useGetAcademicYearInsertTemplateQuery, useCreateAcademicYearMutation } = academicYearsApi