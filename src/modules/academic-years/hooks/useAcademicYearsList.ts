import { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { type GridPaginationModel, type GridSortModel } from '@mui/x-data-grid'
import { useGetAcademicYearsQuery, useDeleteAcademicYearMutation } from '../store/api/academicYearsApi'
import {
  selectAllAcademicYears,
  selectAcademicYearsState,
  setPage,
  setPageSize,
  setSorting,
  setAcademicYears,
  setLoading,
} from '../store/slices/academicYearsSlice'
import { useApiError } from '../../../store/api/errorHandling'
import type { AcademicYear } from '../types/academicYear'

export const useAcademicYearsList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const academicYears = useSelector(selectAllAcademicYears)
  const { currentPage, pageSize, totalRecords, sortField, sortOrder, loading } = useSelector(selectAcademicYearsState)
  const { processError } = useApiError()

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    academicYear: AcademicYear | null
  }>({
    open: false,
    academicYear: null,
  })

  const [deleteAcademicYear, { isLoading: isDeleting, error: deleteError }] = useDeleteAcademicYearMutation()

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

  const handleNavigateToView = useCallback((academicYearPK: string) => {
    navigate(`/academic-years/${academicYearPK}/view`)
  }, [navigate])

  const handleNavigateToEdit = useCallback((academicYearPK: string) => {
    navigate(`/academic-years/${academicYearPK}/edit`)
  }, [navigate])

  const handleNavigateToNew = useCallback(() => {
    navigate('/academic-years/new')
  }, [navigate])

  useEffect(() => {
    dispatch(setLoading(isLoading))
  }, [dispatch, isLoading])

  const mappedData = useMemo(() => {
    if (!data?.Data) return []
    return data.Data.map((item: AcademicYear) => ({ ...item, id: item.AcademicYearPK }))
  }, [data])

  useEffect(() => {
    if (data && mappedData.length > 0) {
      dispatch(setAcademicYears({ data: mappedData, totalRecords: data.Total }))
      dispatch(setLoading(false))
    }
  }, [dispatch, data, mappedData])

  return {
    // State
    academicYears,
    currentPage,
    pageSize,
    totalRecords,
    loading,
    deleteDialog,
    isDeleting,
    
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
    handleNavigateToEdit,
    handleNavigateToNew,
    refetch,
    processError,
  }
}