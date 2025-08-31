import { configureStore } from '@reduxjs/toolkit'
import { academicYearsApi } from './api/academicYearsApi'
import { programsApi } from './api/programsApi'
import academicYearsReducer from './slices/academicYearsSlice'
import programsReducer from './slices/programsSlice'

export const store = configureStore({
  reducer: {
    academicYears: academicYearsReducer,
    programs: programsReducer,
    [academicYearsApi.reducerPath]: academicYearsApi.reducer,
    [programsApi.reducerPath]: programsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(academicYearsApi.middleware, programsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch