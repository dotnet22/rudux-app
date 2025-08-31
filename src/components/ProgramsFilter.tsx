import {
  Paper,
  Button,
  Box,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
} from '@mui/material'
import { useProgramsFilter, type ProgramFilterFormData } from '../hooks/useProgramsFilter'
import type { ProgramFilterModel } from '../types/program'

interface ProgramsFilterProps {
  onFilterChange: (filters: ProgramFilterModel) => void
  initialFilters?: ProgramFilterModel
}

const ProgramsFilter = ({ onFilterChange, initialFilters }: ProgramsFilterProps) => {
  const {
    control,
    handleSubmit,
    handleClear,
    universities,
    faculties,
    courses,
    isLoadingUniversities,
    isLoadingFaculties,
    isLoadingCourses,
    Controller,
    UniversityPK,
    FacultyPK,
  } = useProgramsFilter({ onFilterChange, initialFilters })

  const onSubmit = (data: ProgramFilterFormData) => {
    onFilterChange({
      UniversityPK: data.UniversityPK || null,
      CoursePK: data.CoursePK || null,
      FacultyPK: data.FacultyPK || null,
    })
  }

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
              <Autocomplete
                {...field}
                options={universities}
                getOptionLabel={(option) => option.Label}
                getOptionKey={(option) => option.Value}
                value={universities.find(u => u.Value === field.value) || null}
                onChange={(_, value) => field.onChange(value?.Value || null)}
                loading={isLoadingUniversities}
                sx={{ flex: '1 1 300px', minWidth: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="University"
                    placeholder="Select University"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingUniversities ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          />
          <Controller
            name="FacultyPK"
            control={control}
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                options={faculties}
                getOptionLabel={(option) => option.Label}
                getOptionKey={(option) => option.Value}
                value={faculties.find(f => f.Value === field.value) || null}
                onChange={(_, value) => field.onChange(value?.Value || null)}
                loading={isLoadingFaculties}
                disabled={!UniversityPK}
                sx={{ flex: '1 1 300px', minWidth: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Faculty"
                    placeholder="Select Faculty"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingFaculties ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          />
          <Controller
            name="CoursePK"
            control={control}
            render={({ field, fieldState }) => (
              <Autocomplete
                {...field}
                options={courses}
                getOptionLabel={(option) => option.Label}
                getOptionKey={(option) => option.Value}
                value={courses.find(c => c.Value === field.value) || null}
                onChange={(_, value) => field.onChange(value?.Value || null)}
                loading={isLoadingCourses}
                disabled={!FacultyPK}
                sx={{ flex: '1 1 300px', minWidth: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Course"
                    placeholder="Select Course"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingCourses ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
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