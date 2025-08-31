import { configureStore } from '@reduxjs/toolkit'
import { academicYearsApi } from './api/academicYearsApi'
import academicYearsReducer from './slices/academicYearsSlice'

export const store = configureStore({
  reducer: {
    academicYears: academicYearsReducer,
    [academicYearsApi.reducerPath]: academicYearsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(academicYearsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch