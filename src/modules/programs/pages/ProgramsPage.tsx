import { Typography, Box } from '@mui/material'
import ProgramsListView from '../components/ProgramsListView'
import ProgramsFilter from '../components/ProgramsFilter'
import { ProgramsFilterDisplay } from '../components/ProgramsFilterDisplay'
import { useProgramsFilter } from '../hooks/useProgramsFilter'
import { useProgramsFilterDisplay } from '../hooks/useProgramsFilterDisplay'

const ProgramsPage = () => {
  const filterProps = useProgramsFilter()
  const filterDisplayProps = useProgramsFilterDisplay()

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Programs Management
      </Typography>
      <ProgramsListView
        slots={{
          filter: ProgramsFilter,
          filterDisplay: ProgramsFilterDisplay
        }}
        slotProps={{
          filter: filterProps,
          filterDisplay: filterDisplayProps
        }}
      />
    </Box>
  )
}

export default ProgramsPage