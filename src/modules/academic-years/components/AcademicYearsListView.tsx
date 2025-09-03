import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid'
import { Box, Chip, Paper, Typography, Alert, Button, Stack } from '@mui/material'
import { Add, Edit, Visibility, Delete } from '@mui/icons-material'
import { useState } from 'react'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import { AcademicYearFormView } from './AcademicYearFormView'
import AcademicYearDetailView from './AcademicYearDetailView'
import { CommanModal } from '../../../components/CommonModal/CommonModal'
import { useAcademicYearsList } from '../hooks/useAcademicYearsList'
import type { AcademicYear } from '../types/academicYear'

type FormModalMode = 'create' | 'edit'

interface FormModalState {
  open: boolean
  mode: FormModalMode
  selectedAcademicYear?: AcademicYear
}

interface DetailModalState {
  open: boolean
  selectedAcademicYear?: AcademicYear
}

const ListView = () => {
  const [formModalState, setFormModalState] = useState<FormModalState>({
    open: false,
    mode: 'create'
  })
  
  const [detailModalState, setDetailModalState] = useState<DetailModalState>({
    open: false
  })

  const {
    academicYears,
    currentPage,
    pageSize,
    totalRecords,
    loading,
    deleteDialog,
    isDeleting,
    editAcademicYearData,
    editAcademicYearError,
    isLoadingEditAcademicYear,
    error,
    deleteError,
    handleDeleteClick,
    handleDeleteClose,
    handleDeleteConfirm,
    handlePaginationModelChange,
    handleSortModelChange,
    handleEditAcademicYear,
    handleClearEditAcademicYear,
    refetch,
    processError,
  } = useAcademicYearsList()

  const handleOpenFormModal = (mode: FormModalMode, academicYear?: AcademicYear) => {
    setFormModalState({ open: true, mode, selectedAcademicYear: academicYear })
    if (mode === 'edit' && academicYear) {
      handleEditAcademicYear(academicYear.AcademicYearPK)
    }
  }

  const handleCloseFormModal = () => {
    setFormModalState({ open: false, mode: 'create', selectedAcademicYear: undefined })
    handleClearEditAcademicYear()
  }

  const handleOpenDetailModal = (academicYear: AcademicYear) => {
    setDetailModalState({ open: true, selectedAcademicYear: academicYear })
  }

  const handleCloseDetailModal = () => {
    setDetailModalState({ open: false, selectedAcademicYear: undefined })
  }

  const handleFormSuccess = () => {
    handleCloseFormModal()
    refetch()
  }

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
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 280,
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<AcademicYear>) => {
        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Visibility />}
              onClick={() => handleOpenDetailModal(params.row)}
            >
              View
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              onClick={() => handleOpenFormModal('edit', params.row)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<Delete />}
              onClick={() => handleDeleteClick(params.row)}
            >
              Delete
            </Button>
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
        <Typography variant="h5">
          Academic Years
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenFormModal('create')}
        >
          Add Academic Year
        </Button>
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
        isOpen={formModalState.open}
        onClose={handleCloseFormModal}
        title={formModalState.mode === 'create' ? 'Create Academic Year' : 'Edit Academic Year'}
        maxWidth="lg"
        hideCloseButton={true}
        bodySlot={AcademicYearFormView}
        bodySlotProps={{
          initialData: formModalState.mode === 'edit' ? editAcademicYearData : undefined,
          isLoading: formModalState.mode === 'edit' ? isLoadingEditAcademicYear : false,
          error: formModalState.mode === 'edit' ? editAcademicYearError : undefined,
          onSuccess: handleFormSuccess,
          onCancel: handleCloseFormModal,
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
          academicYearId: detailModalState.selectedAcademicYear?.AcademicYearPK,
        }}
      />
    </Paper>
  )
}

export default ListView