import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
  type GridRenderCellParams,
} from '@mui/x-data-grid'
import { Box, Chip, Paper, Typography, Alert, Button } from '@mui/material'
import { useGetAcademicYearsQuery } from '../store/api/academicYearsApi'
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

const ListView = () => {
  const dispatch = useDispatch()
  const academicYears = useSelector(selectAllAcademicYears)
  const { currentPage, pageSize, totalRecords, sortField, sortOrder, loading } = useSelector(selectAcademicYearsState)
  const { processError } = useApiError()

  const requestPayload = {
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
  }

  const { data, error, isLoading, refetch } = useGetAcademicYearsQuery(requestPayload)

  useEffect(() => {
    dispatch(setLoading(isLoading))
  }, [dispatch, isLoading])

  useEffect(() => {
    if (data) {
      const mappedData = data.Data.map((item: AcademicYear) => ({ ...item, id: item.AcademicYearPK }))
      dispatch(setAcademicYears({ data: mappedData, totalRecords: data.Total }))
      dispatch(setLoading(false))
    }
  }, [dispatch, data])

  const columns: GridColDef[] = [
    {
      field: 'AcademicYearPK',
      headerName: 'ID',
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'AcademicYear',
      headerName: 'Academic Year',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'AcademicYearFromDate',
      headerName: 'Start Date',
      minWidth: 120,
      flex: 1,
      renderCell: (params: GridRenderCellParams<AcademicYear>) => {
        return new Date(params.value).toLocaleDateString()
      },
    },
    {
      field: 'AcademicYearToDate',
      headerName: 'End Date',
      minWidth: 120,
      flex: 1,
      renderCell: (params: GridRenderCellParams<AcademicYear>) => {
        return new Date(params.value).toLocaleDateString()
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 1,
      renderCell: () => {
        return (
          <Chip
            label='Inactive'
            color='default'
            size="small"
          />
        )
      },
    },
  ]

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.page !== currentPage) {
      dispatch(setLoading(true))
      dispatch(setPage(model.page))
    }
    if (model.pageSize !== pageSize) {
      dispatch(setLoading(true))
      dispatch(setPageSize(model.pageSize))
    }
  }

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length > 0) {
      const sort = model[0]
      dispatch(setLoading(true))
      dispatch(setSorting({ field: sort.field, order: sort.sort as 'asc' | 'desc' | null }))
    } else {
      dispatch(setLoading(true))
      dispatch(setSorting({ field: null, order: null }))
    }
  }

  if (error) {
    const processedError = processError(error)
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" gutterBottom>
            {processedError.title || 'Error loading academic years data'}
          </Typography>
          {processedError.status && (
            <Typography variant="body2" color="text.secondary">
              Status Code: {processedError.status}
            </Typography>
          )}
          {processedError.traceId && (
            <Typography variant="body2" color="text.secondary">
              Trace ID: {processedError.traceId}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please check your network connection and try again. If the problem persists, contact support.
          </Typography>
        </Alert>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Academic Years
      </Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={academicYears}
          columns={columns}
          paginationMode="server"
          sortingMode="server"
          paginationModel={{ page: currentPage, pageSize }}
          onPaginationModelChange={handlePaginationModelChange}
          onSortModelChange={handleSortModelChange}
          rowCount={totalRecords}
          loading={loading}
          pageSizeOptions={[10, 20, 50, 100]}
          disableRowSelectionOnClick
          slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton',
            },
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e0e0e0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid #e0e0e0',
            },
          }}
        />
      </Box>
    </Paper>
  )
}

export default ListView