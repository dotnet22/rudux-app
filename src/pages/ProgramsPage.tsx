import { Container, Typography } from '@mui/material'
import ProgramsListView from '../components/ProgramsListView'

const ProgramsPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Programs Management
      </Typography>
      <ProgramsListView />
    </Container>
  )
}

export default ProgramsPage