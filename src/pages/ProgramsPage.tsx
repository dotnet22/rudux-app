import { Container, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import ProgramsListView from '../components/ProgramsListView'
import ProgramsFilter from '../components/ProgramsFilter'
import { setFilters, selectProgramsState } from '../store/slices/programsSlice'
import type { ProgramFilterModel } from '../types/program'
import { ProgramsFilterDisplay } from '../components/ProgramsFilterDisplay'

const ProgramsPage = () => {
  const dispatch = useDispatch()
  const { filters } = useSelector(selectProgramsState)

  const handleFilterChange = (newFilters: ProgramFilterModel) => {
    dispatch(setFilters(newFilters))
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Programs Management
      </Typography>
      <ProgramsFilter 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
      <ProgramsFilterDisplay/>
      <ProgramsListView />
    </Container>
  )
}

export default ProgramsPage