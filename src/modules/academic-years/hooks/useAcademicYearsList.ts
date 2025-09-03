import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { type GridPaginationModel, type GridSortModel } from '@mui/x-data-grid'
import { useGetAcademicYearsQuery, useDeleteAcademicYearMutation, useGetAcademicYearViewQuery } from '../store/api/academicYearsApi'
import {
  selectAllAcademicYears,
  selectAcademicYearsState,
  setPage,
  setPageSize,
  setSorting,
  setAcademicYears,
} from '../store/slices/academicYearsSlice'
import { useApiError } from '../../../core/api/error-handling'
import type { AcademicYear } from '../types/academicYear'

export const useAcademicYearsList = () => {
  const dispatch = useDispatch()
  const academicYears = useSelector(selectAllAcademicYears)
  const { currentPage, pageSize, totalRecords, sortField, sortOrder } = useSelector(selectAcademicYearsState)
  const { processError } = useApiError()

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    academicYear: AcademicYear | null
  }>({
    open: false,
    academicYear: null,
  })

  const [detailAcademicYearId, setDetailAcademicYearId] = useState<string>('')
  
  const [detailModalState, setDetailModalState] = useState<{
    open: boolean
    selectedAcademicYear?: AcademicYear
  }>({
    open: false
  })

  const [deleteAcademicYear, { isLoading: isDeleting, error: deleteError }] = useDeleteAcademicYearMutation()

  // Query for fetching individual academic year data for detail view
  const { data: detailAcademicYearData, error: detailAcademicYearError, isLoading: isLoadingDetailAcademicYear, refetch: refetchDetailData } = useGetAcademicYearViewQuery(
    detailAcademicYearId, 
    { skip: !detailAcademicYearId }
  )


  const requestPayload = useMemo(() => ({
    pageOffset: currentPage,
    pageSize,
    sortField,
    sortOrder,
    filterModel: {
      ProgramName: "dd",
      UniversityPK: "oxqFAadpCZzPLp8-72Ux3Q",
      CoursePK: "OeB1sJTFVztnx9ONDok4RQ",
      FacultyPK: "1yKCWcJvKfokc5MlH6jWPA",
      SpecializationPK: "u725SYy6D5tncoEbPIOpHw"
    },
    ProgramName: "dd",
    UniversityPK: "oxqFAadpCZzPLp8-72Ux3Q",
    CoursePK: "OeB1sJTFVztnx9ONDok4RQ",
    FacultyPK: "1yKCWcJvKfokc5MlH6jWPA",
    SpecializationPK: "u725SYy6D5tncoEbPIOpHw"
  }), [currentPage, pageSize, sortField, sortOrder])

  const { data, error, isLoading, refetch } = useGetAcademicYearsQuery(requestPayload)

  const handleDeleteClick = useCallback((academicYear: AcademicYear) => {
    setDeleteDialog({
      open: true,
      academicYear,
    })
  }, [])

  const handleDeleteClose = useCallback(() => {
    setDeleteDialog({
      open: false,
      academicYear: null,
    })
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteDialog.academicYear) return

    try {
      await deleteAcademicYear(deleteDialog.academicYear.AcademicYearPK).unwrap()
      toast.success(`Academic Year "${deleteDialog.academicYear.AcademicYearName}" has been deleted successfully`)
      handleDeleteClose()
      refetch()
    } catch (error) {
      const processedError = processError(error)
      toast.error(`Failed to delete academic year: ${processedError.title || 'Unknown error'}`)
    }
  }, [deleteDialog.academicYear, deleteAcademicYear, handleDeleteClose, refetch, processError])

  const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
    if (model.page !== currentPage) {
      dispatch(setPage(model.page))
    }
    if (model.pageSize !== pageSize) {
      dispatch(setPageSize(model.pageSize))
    }
  }, [dispatch, currentPage, pageSize])

  const handleSortModelChange = useCallback((model: GridSortModel) => {
    if (model.length > 0) {
      const sort = model[0]
      const newField = sort.field
      const newOrder = sort.sort as 'asc' | 'desc' | null
      
      // Only update if sorting actually changed
      if (newField !== sortField || newOrder !== sortOrder) {
        dispatch(setSorting({ field: newField, order: newOrder }))
      }
    } else {
      // Only clear sorting if there was sorting before
      if (sortField !== null || sortOrder !== null) {
        dispatch(setSorting({ field: null, order: null }))
      }
    }
  }, [dispatch, sortField, sortOrder])

  const handleNavigateToView = useCallback((academicYearPK: string) => {
    console.log('View academic year:', academicYearPK)
  }, [])

  const handleDetailAcademicYear = useCallback((academicYearPK: string) => {
    setDetailAcademicYearId(academicYearPK)
  }, [])

  const handleClearDetailAcademicYear = useCallback(() => {
    setDetailAcademicYearId('')
  }, [])

  // Detail Modal Handlers
  const handleOpenDetailModal = useCallback((academicYear: AcademicYear) => {
    setDetailModalState({ open: true, selectedAcademicYear: academicYear })
    handleDetailAcademicYear(academicYear.AcademicYearPK)
  }, [handleDetailAcademicYear])

  const handleCloseDetailModal = useCallback(() => {
    setDetailModalState({ open: false, selectedAcademicYear: undefined })
    handleClearDetailAcademicYear()
  }, [handleClearDetailAcademicYear])


  const mappedData = useMemo(() => {
    if (!data?.Data) return []
    return data.Data.map((item: AcademicYear) => ({ ...item, id: item.AcademicYearPK }))
  }, [data])

  useEffect(() => {
    if (data && mappedData.length > 0) {
      dispatch(setAcademicYears({ data: mappedData, totalRecords: data.Total }))
    }
  }, [dispatch, data, mappedData])

  return {
    // State
    academicYears,
    currentPage,
    pageSize,
    totalRecords,
    loading: isLoading,
    deleteDialog,
    isDeleting,
    
    // Detail Academic Year State
    detailAcademicYearId,
    detailAcademicYearData,
    detailAcademicYearError,
    isLoadingDetailAcademicYear,
    
    // Modal States
    detailModalState,
    
    // API State
    error,
    deleteError,
    
    // Actions
    handleDeleteClick,
    handleDeleteClose,
    handleDeleteConfirm,
    handlePaginationModelChange,
    handleSortModelChange,
    handleNavigateToView,
    handleDetailAcademicYear,
    handleClearDetailAcademicYear,
    refetchDetailData,
    
    // Detail Modal Handlers
    handleOpenDetailModal,
    handleCloseDetailModal,
    
    refetch,
    processError,
  }
}