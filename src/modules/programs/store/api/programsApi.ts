import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../../../store/api/baseQuery'
import { noTransform } from '../../../../core/api/transforms'
import type { ProgramListRequest, ProgramListResponse } from '../../types/program'

export const programsApi = createApi({
  reducerPath: 'programsApi',
  baseQuery,
  tagTypes: ['Program'],
  endpoints: (builder) => ({
    getPrograms: builder.query<ProgramListResponse, ProgramListRequest>({
      query: (body) => {
        const { filterModel, ...rest } = body
        return {
          url: '/INS_Program/list',
          method: 'POST',
          body: {
            ...rest,
            ...filterModel
          },
        }
      },
      transformResponse: noTransform,
      providesTags: (result) =>
        result?.data?.length
          ? [
              { type: 'Program', id: 'LIST' },
              ...result.data.map((item) => ({ type: 'Program', id: item.PK_ProgramID })),
            ]
          : [{ type: 'Program', id: 'LIST' }],
    }),
  }),
})

export const { useGetProgramsQuery } = programsApi