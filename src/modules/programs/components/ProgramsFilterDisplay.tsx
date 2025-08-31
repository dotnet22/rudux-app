import { Card, CardContent, Typography, Chip, Box } from '@mui/material'
import { memo, useCallback, useMemo } from 'react'
import type { ProgramFilterModel } from '../types/program'

interface ProgramsFilterDisplayProps {
  friendlyFilter: Record<string, { Label: string; Value: unknown }>
  onFriendlyFilterChange?: (fieldKey: keyof ProgramFilterModel) => void
}

// Individual chip component to prevent unnecessary rerenders of sibling chips
const FilterChip = memo(({ 
  fieldKey, 
  filter, 
  onDelete 
}: {
  fieldKey: string
  filter: { Label: string; Value: unknown }
  onDelete?: () => void
}) => {
  const hasValue = filter.Value !== null && filter.Value !== undefined && filter.Value !== ''
  const label = `${fieldKey.replace('PK', '')}: ${filter.Label}`
  
  return (
    <Chip
      key={fieldKey}
      label={label}
      variant={hasValue ? "filled" : "outlined"}
      size="small"
      onDelete={hasValue ? onDelete : undefined}
    />
  )
})

FilterChip.displayName = 'FilterChip'

export const ProgramsFilterDisplay = memo((props: ProgramsFilterDisplayProps) => {
  const { friendlyFilter, onFriendlyFilterChange } = props

  // Memoize delete handlers to prevent recreation
  const deleteHandlers = useMemo(() => {
    if (!onFriendlyFilterChange) return {}
    
    const handlers: Record<string, () => void> = {}
    for (const key of Object.keys(friendlyFilter)) {
      handlers[key] = () => onFriendlyFilterChange(key as keyof ProgramFilterModel)
    }
    return handlers
  }, [onFriendlyFilterChange, friendlyFilter])

  // Memoize chip list to prevent unnecessary recalculations
  const chipList = useMemo(() => {
    return Object.entries(friendlyFilter).map(([key, filter]) => (
      <FilterChip
        key={key}
        fieldKey={key}
        filter={filter as { Label: string; Value: unknown }}
        onDelete={deleteHandlers[key]}
      />
    ))
  }, [friendlyFilter, deleteHandlers])

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Active Filters
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {chipList}
        </Box>
      </CardContent>
    </Card>
  )
})

ProgramsFilterDisplay.displayName = 'ProgramsFilterDisplay'

export type { ProgramsFilterDisplayProps }