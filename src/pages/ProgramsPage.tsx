import { Container, Typography } from '@mui/material'
import ProgramsListView from '../components/ProgramsListView'
import ProgramsFilter from '../components/ProgramsFilter'
import { ProgramsFilterDisplay } from '../components/ProgramsFilterDisplay'
import { useProgramsFilter } from '../hooks/useProgramsFilter'
import { useProgramsFilterDisplay } from '../hooks/useProgramsFilterDisplay'

const ProgramsPage = () => {
  const filterHookData = useProgramsFilter()
  const filterDisplayHookData = useProgramsFilterDisplay()

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
        slotProps={{
          filter: filterHookData,
          filterDisplay: filterDisplayHookData
        }}
      />
    </Container>
  )
}

export default ProgramsPage