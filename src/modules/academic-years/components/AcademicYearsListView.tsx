import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid'
import { Box, Chip, Paper, Typography, Alert, Button, Stack, Tooltip, IconButton } from '@mui/material'
import { Add, Edit, Visibility, Delete, Refresh, FilterList } from '@mui/icons-material'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import { AcademicYearFormView } from './AcademicYearFormView'
import { useAcademicYearFormView } from '../hooks/useAcademicYearForm'
import AcademicYearDetailView from './AcademicYearDetailView'
import { CommanModal } from '../../../components/CommonModal/CommonModal'
import { useAcademicYearsList } from '../hooks/useAcademicYearsList'
import type { AcademicYear } from '../types/academicYear'

const ListView = () => {
  const {
    academicYears,
    currentPage,
    pageSize,
    totalRecords,
    loading,
    deleteDialog,
    isDeleting,
    detailAcademicYearData,
    detailAcademicYearError,
    isLoadingDetailAcademicYear,
    detailModalState,
    error,
    deleteError,
    handleDeleteClick,
    handleDeleteClose,
    handleDeleteConfirm,
    handlePaginationModelChange,
    handleSortModelChange,
    refetchDetailData,
    handleOpenDetailModal,
    handleCloseDetailModal,
    refetch,
    processError,
  } = useAcademicYearsList()


  // Form view hook for modal integration
  const { 
    modalState, 
    handleOpenModal, 
    handleCloseModal 
  } = useAcademicYearFormView({
    onSuccess: () => {
      console.log('Form submitted successfully')
      handleCloseModal()
    },
    onRefetch: refetch
  })

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
      renderCell: (params: GridRenderCellParams<AcademicYear>) => {
        const now = new Date()
        const startDate = new Date(params.row.AcademicYearFromDate)
        const endDate = new Date(params.row.AcademicYearToDate)
        
        const isActive = now >= startDate && now <= endDate
        const isPast = now > endDate
        const isFuture = now < startDate
        
        return (
          <Chip
            label={isActive ? 'Active' : isPast ? 'Past' : 'Future'}
            color={isActive ? 'success' : isPast ? 'default' : 'info'}
            size="small"
            variant={isActive ? 'filled' : 'outlined'}
          />
        )
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 280,
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<AcademicYear>) => {
        return (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={() => handleOpenDetailModal(params.row)}
                sx={{ color: 'primary.main' }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Academic Year">
              <IconButton
                size="small"
                onClick={() => handleOpenModal('edit', params.row)}
                sx={{ color: 'info.main' }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Academic Year">
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(params.row)}
                sx={{ color: 'error.main' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      },
    },
  ]


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
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Academic Years
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalRecords} academic years found
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={() => refetch()}
              disabled={loading}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenModal('create')}
          >
            Add Academic Year
          </Button>
        </Stack>
      </Stack>
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

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        academicYear={deleteDialog.academicYear}
        isDeleting={isDeleting}
        error={deleteError ? processError(deleteError).title : null}
      />

      {/* Form Modal for Create/Edit */}
      <CommanModal
        isOpen={modalState.open}
        onClose={handleCloseModal}
        title={modalState.mode === 'create' ? 'Create Academic Year' : 'Edit Academic Year'}
        maxWidth="lg"
        hideCloseButton={true}
        bodySlot={AcademicYearFormView}
        bodySlotProps={{
          onSuccess: () => {
            console.log('Form submitted successfully')
            handleCloseModal()
          },
          onRefetch: refetch,
          academicYear: modalState.selectedAcademicYear || null,
          mode: modalState.mode,
        }}
      />

      {/* Detail View Modal */}
      <CommanModal
        isOpen={detailModalState.open}
        onClose={handleCloseDetailModal}
        title="Academic Year Details"
        maxWidth="lg"
        hideCloseButton={false}
        bodySlot={AcademicYearDetailView}
        bodySlotProps={{
          data: detailAcademicYearData,
          isLoading: isLoadingDetailAcademicYear,
          error: detailAcademicYearError,
          onRetry: refetchDetailData,
        }}
      />
    </Paper>
  )
}

export default ListView