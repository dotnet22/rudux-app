import { Card, CardContent, Typography, Chip, Box } from '@mui/material'
import { memo } from 'react'
import type { ProgramFilterModel } from '../types/program'

interface ProgramsFilterDisplayProps {
  friendlyFilter: Record<string, { Label: string; Value: unknown }>
  onFriendlyFilterChange?: (fieldKey: keyof ProgramFilterModel) => void
}

export const ProgramsFilterDisplay = memo((props: ProgramsFilterDisplayProps) => {
  const { friendlyFilter, onFriendlyFilterChange } = props

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Active Filters
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {Object.entries(friendlyFilter).map(([key, filter]) => {
            const filterItem = filter as { Label: string; Value: unknown }
            const hasValue = filterItem.Value !== null && filterItem.Value !== undefined && filterItem.Value !== ''
            
            return (
              <Chip
                key={key}
                label={`${key.replace('PK', '')}: ${filterItem.Label}`}
                variant={hasValue ? "filled" : "outlined"}
                size="small"
                onDelete={hasValue && onFriendlyFilterChange ? () => onFriendlyFilterChange(key as keyof ProgramFilterModel) : undefined}
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