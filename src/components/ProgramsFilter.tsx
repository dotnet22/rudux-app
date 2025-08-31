import { useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material'
import type { ProgramFilterModel } from '../types/program'

const programFilterSchema = z.object({
  UniversityPK: z.string().optional().nullable(),
  CoursePK: z.string().optional().nullable(),
  FacultyPK: z.string().optional().nullable(),
})

export type ProgramFilterFormData = z.infer<typeof programFilterSchema>

interface ProgramsFilterProps {
  onFilterChange: (filters: ProgramFilterModel) => void
  initialFilters?: ProgramFilterModel
}

const ProgramsFilter = ({ onFilterChange, initialFilters }: ProgramsFilterProps) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<ProgramFilterFormData>({
    resolver: zodResolver(programFilterSchema),
    defaultValues: {
      UniversityPK: initialFilters?.UniversityPK || null,
      CoursePK: initialFilters?.CoursePK || null,
      FacultyPK: initialFilters?.FacultyPK || null,
    },
  })

  const onSubmit = useCallback((data: ProgramFilterFormData) => {
    onFilterChange({
      UniversityPK: data.UniversityPK || null,
      CoursePK: data.CoursePK || null,
      FacultyPK: data.FacultyPK || null,
    })
  }, [onFilterChange])

  const handleClear = () => {
    const clearedFilters = {
      UniversityPK: null,
      CoursePK: null,
      FacultyPK: null,
    }
    reset(clearedFilters)
    onFilterChange(clearedFilters)
  }

  // Watch for changes and auto-submit (optional - you can remove this if you prefer manual submit)
  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)())
    return () => subscription.unsubscribe()
  }, [handleSubmit, watch, onSubmit])

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filter Programs
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Controller
            name="UniversityPK"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="University ID"
                placeholder="Enter University Primary Key"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value || null)}
                sx={{ flex: '1 1 300px', minWidth: 300 }}
              />
            )}
          />
          <Controller
            name="CoursePK"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Course ID"
                placeholder="Enter Course Primary Key"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value || null)}
                sx={{ flex: '1 1 300px', minWidth: 300 }}
              />
            )}
          />
          <Controller
            name="FacultyPK"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Faculty ID"
                placeholder="Enter Faculty Primary Key"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value || null)}
                sx={{ flex: '1 1 300px', minWidth: 300 }}
              />
            )}
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Apply Filters
          </Button>
          <Button type="button" variant="outlined" onClick={handleClear}>
            Clear Filters
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default ProgramsFilter