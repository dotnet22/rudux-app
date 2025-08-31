import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
} from '@mui/x-data-grid'
import { Box, Chip, Paper, Typography } from '@mui/material'
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

const ProgramsListView = () => {
  const dispatch = useDispatch()
  const programs = useSelector(selectAllPrograms)
  const { currentPage, pageSize, totalRecords, sortField, sortOrder, loading, filters } = useSelector(selectProgramsState)

  const requestPayload: ProgramListRequest = {
    pageOffset: currentPage,
    pageSize,
    sortField,
    sortOrder,
    filterModel: filters
  }

  const { data, error, isLoading } = useGetProgramsQuery(requestPayload)

  useEffect(() => {
    dispatch(setLoading(isLoading))
  }, [dispatch, isLoading])

  useEffect(() => {
    if (data) {
      const mappedData = data.Data.map((item: Program) => ({ ...item, id: item.ProgramPK }))
      dispatch(setPrograms({ data: mappedData, totalRecords: data.Total }))
      dispatch(setLoading(false))
    }
  }, [dispatch, data])

  const columns: GridColDef[] = [
    {
      field: 'ProgramPK',
      headerName: 'Program ID',
      width: 300,
    },
    {
      field: 'ProgramName',
      headerName: 'Program Name',
      width: 250,
      flex: 1,
    },
    {
      field: 'ProgramCode',
      headerName: 'Code',
      width: 120,
    },
    {
      field: 'UniversityShortName',
      headerName: 'University',
      width: 120,
    },
    {
      field: 'CourseShortName',
      headerName: 'Course',
      width: 150,
    },
    {
      field: 'InstituteShortName',
      headerName: 'Institute',
      width: 120,
    },
    {
      field: 'DepartmentShortName',
      headerName: 'Department',
      width: 120,
    },
    {
      field: 'FacultyShortName',
      headerName: 'Faculty',
      width: 120,
    },
    {
      field: 'SpecializationShortName',
      headerName: 'Specialization',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: () => {
        return (
          <Chip
            label='Active'
            color='success'
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
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography color="error">Error loading programs data</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Programs
      </Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={programs}
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

export default ProgramsListView