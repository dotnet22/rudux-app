import { createEntityAdapter, createSlice, type PayloadAction, type EntityId } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { University } from '../../types/comboBox'

export interface UniversityState {
  loading: boolean
  error: string | null
}

const universityAdapter = createEntityAdapter<University, EntityId>({
  selectId: (university: University) => university.Value,
  sortComparer: (a: University, b: University) => a.Value.localeCompare(b.Value),
})

const initialState = universityAdapter.getInitialState<UniversityState>({
  loading: false,
  error: null,
})

const universitySlice = createSlice({
  name: 'university',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setUniversities: (state, action: PayloadAction<University[]>) => {
      universityAdapter.setAll(state, action.payload)
    },
    clearUniversities: (state) => {
      universityAdapter.removeAll(state)
    },
  },
})

export const { setLoading, setError, setUniversities, clearUniversities } = universitySlice.actions

export const {
  selectAll: selectAllUniversities,
  selectById: selectUniversityById,
  selectIds: selectUniversityIds,
} = universityAdapter.getSelectors((state: RootState) => state.university)

export const selectUniversityState = (state: RootState) => state.university

export default universitySlice.reducer