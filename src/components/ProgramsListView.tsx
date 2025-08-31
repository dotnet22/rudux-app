import {
  DataGrid,
  type GridColDef,
} from '@mui/x-data-grid'
import { Box, Chip, Paper, Typography } from '@mui/material'
import { useProgramsList } from '../hooks/useProgramsList'

const ProgramsListView = () => {
  const {
    programs,
    currentPage,
    pageSize,
    totalRecords,
    loading,
    error,
    handlePaginationModelChange,
    handleSortModelChange,
  } = useProgramsList()

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