import { Container, Typography } from '@mui/material'
import ListView from '../components/AcademicYearsListView'

const AcademicYearsPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Academic Years Management
      </Typography>
      <ListView />
    </Container>
  )
}

export default AcademicYearsPage