import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { Program, ProgramFilterModel } from '../../types/program'

export interface ProgramsState {
  currentPage: number
  pageSize: number
  totalRecords: number
  sortField: string | null
  sortOrder: 'asc' | 'desc' | null
  loading: boolean
  filters: ProgramFilterModel
}

const programsAdapter = createEntityAdapter<Program & { id: string }>({
  sortComparer: (a: Program & { id: string }, b: Program & { id: string }) => a.ProgramName.localeCompare(b.ProgramName),
})

const initialState = programsAdapter.getInitialState<ProgramsState>({
  currentPage: 0,
  pageSize: 20,
  totalRecords: 0,
  sortField: null,
  sortOrder: null,
  loading: false,
  filters: {
    UniversityPK: null,
    CoursePK: null,
    FacultyPK: null,
  },
})

const programsSlice = createSlice({
  name: 'programs',
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
    setPrograms: (state, action: PayloadAction<{ data: (Program & { id: string })[]; totalRecords: number }>) => {
      programsAdapter.setAll(state, action.payload.data)
      state.totalRecords = action.payload.totalRecords
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setFilters: (state, action: PayloadAction<ProgramFilterModel>) => {
      state.filters = action.payload
      state.currentPage = 0
    },
  },
})

export const { setPage, setPageSize, setSorting, setPrograms, setLoading, setFilters } = programsSlice.actions

export const {
  selectAll: selectAllPrograms,
  selectById: selectProgramById,
  selectIds: selectProgramIds,
} = programsAdapter.getSelectors((state: RootState) => state.programs)

export const selectProgramsState = (state: RootState) => state.programs

export default programsSlice.reducer