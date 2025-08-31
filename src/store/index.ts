import { configureStore } from '@reduxjs/toolkit'
import { academicYearsApi } from '../modules/academic-years/store/api/academicYearsApi'
import { programsApi } from '../modules/programs/store/api/programsApi'
import { universityApi } from './api/universityApi'
import { facultyApi } from './api/facultyApi'
import { courseApi } from './api/courseApi'
import academicYearsReducer from '../modules/academic-years/store/slices/academicYearsSlice'
import programsReducer from '../modules/programs/store/slices/programsSlice'
import universityReducer from './slices/universitySlice'
import facultyReducer from './slices/facultySlice'
import courseReducer from './slices/courseSlice'

export const store = configureStore({
  reducer: {
    academicYears: academicYearsReducer,
    programs: programsReducer,
    university: universityReducer,
    faculty: facultyReducer,
    course: courseReducer,
    [academicYearsApi.reducerPath]: academicYearsApi.reducer,
    [programsApi.reducerPath]: programsApi.reducer,
    [universityApi.reducerPath]: universityApi.reducer,
    [facultyApi.reducerPath]: facultyApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      academicYearsApi.middleware,
      programsApi.middleware,
      universityApi.middleware,
      facultyApi.middleware,
      courseApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch