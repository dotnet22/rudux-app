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

export const useProgramsList = () => {
  const dispatch = useDispatch()
  const programs = useSelector(selectAllPrograms)
  const { currentPage, pageSize, totalRecords, sortField, sortOrder, loading, filters } = useSelector(selectProgramsState)

  // Memoize requestPayload to prevent RTK Query cache misses
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

  // Memoize expensive data transformation
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