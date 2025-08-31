import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
  type GridRenderCellParams,
} from '@mui/x-data-grid'
import { Box, Chip, Paper, Typography } from '@mui/material'
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
import type { AcademicYear } from '../types/academicYear'

const ListView = () => {
  const dispatch = useDispatch()
  const academicYears = useSelector(selectAllAcademicYears)
  const { currentPage, pageSize, totalRecords, sortField, sortOrder, loading } = useSelector(selectAcademicYearsState)

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

  const { data, error, isLoading } = useGetAcademicYearsQuery(requestPayload)

  useEffect(() => {
    dispatch(setLoading(isLoading))
  }, [dispatch, isLoading])

  useEffect(() => {
    if (data) {
      const mappedData = data.Data.map((item: AcademicYear) => ({ ...item, id: item.AcademicYearPK }))
      dispatch(setAcademicYears({ data: mappedData, totalRecords: data.Total }))
    }
  }, [dispatch, data])

  const columns: GridColDef[] = [
    {
      field: 'academicYearPK',
      headerName: 'ID',
      width: 300,
    },
    {
      field: 'academicYear',
      headerName: 'Academic Year',
      width: 200,
      flex: 1,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 150,
      renderCell: (params: GridRenderCellParams<AcademicYear>) => {
        return new Date(params.value).toLocaleDateString()
      },
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 150,
      renderCell: (params: GridRenderCellParams<AcademicYear>) => {
        return new Date(params.value).toLocaleDateString()
      },
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams<AcademicYear>) => {
        return (
          <Chip
            label={params.value ? 'Active' : 'Inactive'}
            color={params.value ? 'success' : 'default'}
            size="small"
          />
        )
      },
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      width: 150,
      renderCell: (params: GridRenderCellParams<AcademicYear>) => {
        return new Date(params.value).toLocaleDateString()
      },
    },
  ]

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    if (model.page !== currentPage) {
      dispatch(setPage(model.page))
    }
    if (model.pageSize !== pageSize) {
      dispatch(setPageSize(model.pageSize))
    }
  }

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length > 0) {
      const sort = model[0]
      dispatch(setSorting({ field: sort.field, order: sort.sort as 'asc' | 'desc' | null }))
    } else {
      dispatch(setSorting({ field: null, order: null }))
    }
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography color="error">Error loading academic years data</Typography>
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