import { Card, CardContent, Typography, Chip, Box } from '@mui/material'
import { memo } from 'react'

interface ProgramsFilterDisplayProps {
  friendlyFilter: Record<string, { Label: string; Value: unknown }>
}

export const ProgramsFilterDisplay = memo((props: ProgramsFilterDisplayProps) => {
  const { friendlyFilter } = props

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

export type { ProgramsFilterDisplayProps }