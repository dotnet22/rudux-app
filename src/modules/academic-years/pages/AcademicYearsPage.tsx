import { Typography, Box } from '@mui/material'
import ListView from '../components/AcademicYearsListView'

const AcademicYearsPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Academic Years Management
      </Typography>
      <ListView />
    </Box>
  )
}

export default AcademicYearsPage