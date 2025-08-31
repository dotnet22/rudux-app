import { Container, Typography } from '@mui/material'
import ProgramsListView from '../components/ProgramsListView'
import ProgramsFilter from '../components/ProgramsFilter'
import { ProgramsFilterDisplay } from '../components/ProgramsFilterDisplay'

const ProgramsPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Programs Management
      </Typography>
      <ProgramsListView
        slots={{
          filter: ProgramsFilter,
          filterDisplay: ProgramsFilterDisplay
        }}
      />
    </Container>
  )
}

export default ProgramsPage