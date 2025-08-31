import { Card, CardContent, Typography, Chip, Box } from '@mui/material'
import { memo } from 'react'
import { useProgramsFilterDisplay } from '../hooks/useProgramsFilterDisplay'

export const ProgramsFilterDisplay = memo(() => {
  const { friendlyFilter } = useProgramsFilterDisplay()

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Active Filters
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {Object.entries(friendlyFilter).map(([key, filter]) => {
            const filterItem = filter as { Label: string; Value: unknown }
            return (
              <Chip
                key={key}
                label={`${key.replace('PK', '')}: ${filterItem.Label}`}
                variant={filterItem.Value ? "filled" : "outlined"}
                size="small"
              />
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
})

ProgramsFilterDisplay.displayName = 'ProgramsFilterDisplay'