import { useSelector } from 'react-redux'
import { Card, CardContent, Typography, Chip, Box } from '@mui/material'
import { memo } from 'react'
import { selectProgramsState } from '../store/slices/programsSlice'

export const ProgramsFilterDisplay = memo(() => {
  const { friendlyFilter } = useSelector(selectProgramsState)

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Active Filters
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {Object.entries(friendlyFilter).map(([key, filter]) => (
            <Chip
              key={key}
              label={`${key.replace('PK', '')}: ${filter.Label}`}
              variant={filter.Value ? "filled" : "outlined"}
              size="small"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
})

ProgramsFilterDisplay.displayName = 'ProgramsFilterDisplay'