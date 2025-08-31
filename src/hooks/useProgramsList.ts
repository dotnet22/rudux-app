import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { useGetProgramsQuery } from '../store/api/programsApi'
import {
  selectAllPrograms,
  selectProgramsState,
  setPage,
  setPageSize,
  setSorting,
  setPrograms,
  setLoading,
} from '../store/slices/programsSlice'
import type { Program, ProgramListRequest } from '../types/program'

/**
 * Custom hook for managing programs list state and operations
 * 
 * Performance Optimizations:
 * - useMemo for requestPayload: Prevents unnecessary RTK Query cache misses by maintaining stable object reference
 * - useCallback for event handlers: Prevents DataGrid re-renders by maintaining stable function references
 * - useMemo for data mapping: Memoizes expensive .map() operation that transforms API data with IDs
 * - Optimized Redux selectors: Uses pre-memoized selectors from RTK slice
 * 
 * Benefits:
 * - Reduces component render frequency
 * - Eliminates cascading re-renders from prop changes
 * - Improves RTK Query cache hit ratio
 * - Better React DevTools Profiler performance metrics
 */

export const useProgramsList = () => {
  const dispatch = useDispatch()
  const programs = useSelector(selectAllPrograms)
  const { currentPage, pageSize, totalRecords, sortField, sortOrder, loading, filters } = useSelector(selectProgramsState)

  // Memoize requestPayload to prevent RTK Query cache misses
  // Without this, new object reference on every render would trigger unnecessary API calls
  const requestPayload: ProgramListRequest = useMemo(() => ({
    pageOffset: currentPage,
    pageSize,
    sortField,
    sortOrder,
    filterModel: filters
  }), [currentPage, pageSize, sortField, sortOrder, filters])

  const { data, error, isLoading } = useGetProgramsQuery(requestPayload)

  useEffect(() => {
    dispatch(setLoading(isLoading))
  }, [dispatch, isLoading])

  // Memoize expensive data transformation to avoid re-computation on every render
  // DataGrid requires 'id' field, so we map ProgramPK to id for each item
  const mappedData = useMemo(() => {
    return data?.Data.map((item: Program) => ({ ...item, id: item.ProgramPK })) || []
  }, [data])

  useEffect(() => {
    if (data && mappedData.length > 0) {
      dispatch(setPrograms({ data: mappedData, totalRecords: data.Total }))
      dispatch(setLoading(false))
    }
  }, [dispatch, data, mappedData])

  // Memoize event handlers to prevent DataGrid re-renders
  // Without useCallback, new function references would cause DataGrid to re-render unnecessarily
  const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
    if (model.page !== currentPage) {
      dispatch(setLoading(true))
      dispatch(setPage(model.page))
    }
    if (model.pageSize !== pageSize) {
      dispatch(setLoading(true))
      dispatch(setPageSize(model.pageSize))
    }
  }, [dispatch, currentPage, pageSize])

  const handleSortModelChange = useCallback((model: GridSortModel) => {
    if (model.length > 0) {
      const sort = model[0]
      dispatch(setLoading(true))
      dispatch(setSorting({ field: sort.field, order: sort.sort as 'asc' | 'desc' | null }))
    } else {
      dispatch(setLoading(true))
      dispatch(setSorting({ field: null, order: null }))
    }
  }, [dispatch])

  return {
    programs,
    currentPage,
    pageSize,
    totalRecords,
    loading,
    error,
    handlePaginationModelChange,
    handleSortModelChange,
  }
}