import { Typography, Box, Button, Stack } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router'
import AcademicYearDetailView from '../components/AcademicYearDetailView'

const AcademicYearDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Error: Academic Year ID not provided
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/academic-years')}
          variant="outlined"
        >
          Back to Academic Years
        </Button>
        <Typography variant="h4" component="h1">
          Academic Year Details
        </Typography>
      </Stack>
      <AcademicYearDetailView academicYearId={id} />
    </Box>
  )
}

export default AcademicYearDetailPage