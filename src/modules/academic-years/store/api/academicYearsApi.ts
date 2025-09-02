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
        result?.data?.length 
          ? [
              { type: 'AcademicYear', id: 'LIST' },
              ...result.data.map((item) => ({ type: 'AcademicYear', id: item.PK_AcademicYearID })),
            ]
          : [{ type: 'AcademicYear', id: 'LIST' }],
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
      invalidatesTags: [{ type: 'AcademicYear', id: 'LIST' }],
    }),
    deleteAcademicYear: builder.mutation<OperationResponse, string>({
      query: (id) => ({
        url: `/MST_AcademicYear/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AcademicYear', id: 'LIST' }],
    }),
    getAcademicYearInsertTemplate: builder.query<AcademicYear, void>({
      query: () => ({
        url: '/MST_AcademicYear/insert',
        method: 'GET',
      }),
      providesTags: [{ type: 'AcademicYear', id: 'TEMPLATE' }],
    }),
    createAcademicYear: builder.mutation<OperationResponse, AcademicYear>({
      query: (body) => ({
        url: '/MST_AcademicYear/insert',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AcademicYear', id: 'LIST' }],
    }),
  }),
})

export const { useGetAcademicYearsQuery, useGetAcademicYearByIdQuery, useGetAcademicYearViewQuery, useUpdateAcademicYearMutation, useDeleteAcademicYearMutation, useGetAcademicYearInsertTemplateQuery, useCreateAcademicYearMutation } = academicYearsApi