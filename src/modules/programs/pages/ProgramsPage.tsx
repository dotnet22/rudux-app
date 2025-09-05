import { Typography, Box, Chip } from '@mui/material'
import ProgramsListView from '../components/ProgramsListView'
import ProgramsFilter from '../components/ProgramsFilter'
import { ProgramsFilterDisplay } from '../components/ProgramsFilterDisplay'
import { useProgramsFilter } from '../hooks/useProgramsFilter'
import { useProgramsFilterDisplay } from '../hooks/useProgramsFilterDisplay'
import { useProgramsList } from '../hooks/useProgramsList'
import type { GridColDef } from '@mui/x-data-grid'

const ProgramsPage = () => {
  const gridProps = useProgramsList();
  const filterProps = useProgramsFilter()
  const filterDisplayProps = useProgramsFilterDisplay();

  const columns: GridColDef[] = [
    {
      field: 'ProgramPK',
      headerName: 'Program ID',
      minWidth: 200,
      flex: 0.8,
    },
    {
      field: 'ProgramName',
      headerName: 'Program Name',
      minWidth: 180,
      flex: 1.2,
    },
    {
      field: 'ProgramCode',
      headerName: 'Code',
      minWidth: 80,
      flex: 0.4,
    },
    {
      field: 'UniversityShortName',
      headerName: 'University',
      minWidth: 80,
      flex: 0.4,
    },
    {
      field: 'CourseShortName',
      headerName: 'Course',
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: 'InstituteShortName',
      headerName: 'Institute',
      minWidth: 80,
      flex: 0.4,
    },
    {
      field: 'DepartmentShortName',
      headerName: 'Department',
      minWidth: 80,
      flex: 0.4,
    },
    {
      field: 'FacultyShortName',
      headerName: 'Faculty',
      minWidth: 80,
      flex: 0.4,
    },
    {
      field: 'SpecializationShortName',
      headerName: 'Specialization',
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 0.5,
      renderCell: () => {
        return (
          <Chip
            label='Active'
            color='success'
            size="small"
          />
        )
      },
    },
  ]

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
          dataGridProps: {
            ...gridProps,
            columns: columns,
          },
          filterProps: filterProps,
          filterDisplayProps: {
            ...filterDisplayProps,
            onFriendlyFilterChange: filterProps.onFriendlyFilterChange
          }
        }}
      />
    </Box>
  )
}

export default ProgramsPage