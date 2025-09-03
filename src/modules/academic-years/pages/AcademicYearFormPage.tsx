import { useParams, useNavigate } from 'react-router'
import { Typography, Box, IconButton, CircularProgress, Alert } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { AcademicYearFormView } from '../components/AcademicYearFormView'
import { useGetAcademicYearByIdQuery } from '../store/api/academicYearsApi'

const AcademicYearFormPage = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const {
    data: initialData,
    isLoading,
    error,
  } = useGetAcademicYearByIdQuery(id!, {
    skip: !isEditMode,
    refetchOnMountOrArgChange: true,
  })

  const handleSuccess = () => {
    navigate('/academic-years')
  }

  const handleCancel = () => {
    navigate('/academic-years')
  }

  if (isEditMode && isLoading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handleCancel} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Edit Academic Year
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    )
  }

  if (isEditMode && error) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handleCancel} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Edit Academic Year
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load academic year data. Please try again or go back to the list.
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleCancel} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Academic Year' : 'Create Academic Year'}
        </Typography>
      </Box>
      
      <AcademicYearFormView
        academicYear={initialData || null}
        mode={isEditMode ? 'edit' : 'create'}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Box>
  )
}

export default AcademicYearFormPage