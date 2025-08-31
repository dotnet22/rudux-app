import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { AcademicYear } from '../../types/academicYear'

export interface AcademicYearsState {
  currentPage: number
  pageSize: number
  totalRecords: number
  sortField: string | null
  sortOrder: 'asc' | 'desc' | null
  loading: boolean
}

const academicYearsAdapter = createEntityAdapter<AcademicYear & { id: string }>({
  sortComparer: (a: AcademicYear & { id: string }, b: AcademicYear & { id: string }) => a.AcademicYear.toString().localeCompare(b.AcademicYear.toString()),
})

const initialState = academicYearsAdapter.getInitialState<AcademicYearsState>({
  currentPage: 0,
  pageSize: 20,
  totalRecords: 0,
  sortField: null,
  sortOrder: null,
  loading: false,
})

const academicYearsSlice = createSlice({
  name: 'academicYears',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.currentPage = 0
    },
    setSorting: (state, action: PayloadAction<{ field: string | null; order: 'asc' | 'desc' | null }>) => {
      state.sortField = action.payload.field
      state.sortOrder = action.payload.order
    },
    setAcademicYears: (state, action: PayloadAction<{ data: (AcademicYear & { id: string })[]; totalRecords: number }>) => {
      academicYearsAdapter.setAll(state, action.payload.data)
      state.totalRecords = action.payload.totalRecords
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setPage, setPageSize, setSorting, setAcademicYears, setLoading } = academicYearsSlice.actions

export const {
  selectAll: selectAllAcademicYears,
  selectById: selectAcademicYearById,
  selectIds: selectAcademicYearIds,
} = academicYearsAdapter.getSelectors((state: RootState) => state.academicYears)

export const selectAcademicYearsState = (state: RootState) => state.academicYears

export default academicYearsSlice.reducer