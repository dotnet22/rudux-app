import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { Course } from '../../types/comboBox'

export interface CourseState {
  loading: boolean
  error: string | null
  selectedFacultyId: string | null
}

const courseAdapter = createEntityAdapter<Course>({
  selectId: (course) => course.Value,
  sortComparer: (a, b) => a.Label.localeCompare(b.Label),
})

const initialState = courseAdapter.getInitialState<CourseState>({
  loading: false,
  error: null,
  selectedFacultyId: null,
})

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setSelectedFacultyId: (state, action: PayloadAction<string | null>) => {
      state.selectedFacultyId = action.payload
    },
    setCourses: (state, action: PayloadAction<Course[]>) => {
      courseAdapter.setAll(state, action.payload)
    },
    clearCourses: (state) => {
      courseAdapter.removeAll(state)
    },
  },
})

export const { setLoading, setError, setSelectedFacultyId, setCourses, clearCourses } = courseSlice.actions

export const {
  selectAll: selectAllCourses,
  selectById: selectCourseById,
  selectIds: selectCourseIds,
} = courseAdapter.getSelectors((state: RootState) => state.course)

export const selectCourseState = (state: RootState) => state.course

export default courseSlice.reducer