import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { Faculty } from '../../types/comboBox'

export interface FacultyState {
  loading: boolean
  error: string | null
  selectedUniversityId: string | null
}

const facultyAdapter = createEntityAdapter<Faculty>({
  sortComparer: (a: Faculty, b: Faculty) => a.Value.localeCompare(b.Value),
})

const initialState = facultyAdapter.getInitialState<FacultyState>({
  loading: false,
  error: null,
  selectedUniversityId: null,
})

const facultySlice = createSlice({
  name: 'faculty',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setSelectedUniversityId: (state, action: PayloadAction<string | null>) => {
      state.selectedUniversityId = action.payload
    },
    setFaculties: (state, action: PayloadAction<Faculty[]>) => {
      facultyAdapter.setAll(state, action.payload)
    },
    clearFaculties: (state) => {
      facultyAdapter.removeAll(state)
    },
  },
})

export const { setLoading, setError, setSelectedUniversityId, setFaculties, clearFaculties } = facultySlice.actions

export const {
  selectAll: selectAllFaculties,
  selectById: selectFacultyById,
  selectIds: selectFacultyIds,
} = facultyAdapter.getSelectors((state: RootState) => state.faculty)

export const selectFacultyState = (state: RootState) => state.faculty

export default facultySlice.reducer