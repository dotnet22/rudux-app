import { Controller } from 'react-hook-form'
import {
  Box,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import type { AcademicYear } from '../types/academicYear'
import type { UseFormReturn } from 'react-hook-form'
import type { AcademicYearFormData } from '../schema'

interface AcademicYearFormViewProps {
  // Form-related props from the hook
  form: UseFormReturn<AcademicYearFormData>
  isLoading: boolean
  isEditing: boolean
  onSubmit: (data: AcademicYearFormData) => Promise<void>
  formatDateForInput: (date: string | null | undefined) => Date | null
  formatDateForSubmission: (date: Date | null) => string
  
  // Additional props
  initialData?: AcademicYear
  isLoadingExternal?: boolean
  error?: unknown
  onSuccess?: () => void
  onCancel?: () => void
}

export const AcademicYearFormView: React.FC<AcademicYearFormViewProps> = ({
  form: { control, handleSubmit, formState: { errors, isDirty } },
  isLoading: formIsLoading,
  isEditing,
  onSubmit,
  formatDateForInput,
  formatDateForSubmission,
  isLoadingExternal = false,
  error,
  onCancel,
}) => {
  // Use form loading state or external loading state
  const isLoading = formIsLoading || isLoadingExternal

  // Show loading state when fetching data for edit mode
  if (isLoadingExternal) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    )
  }

  // Show error state when API call fails
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Failed to load academic year data. Please try again.
        </Alert>
      </Box>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Controller
                name="AcademicYearName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Academic Year Name"
                    error={!!errors.AcademicYearName}
                    helperText={errors.AcademicYearName?.message}
                    placeholder="e.g., 2023-24"
                  />
                )}
              />

              <Controller
                name="AcademicYear"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Academic Year"
                    error={!!errors.AcademicYear}
                    helperText={errors.AcademicYear?.message}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                )}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Controller
                name="AcademicYearFromDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Academic Year From Date"
                    value={formatDateForInput(field.value)}
                    onChange={(newValue: Date | null) => {
                      field.onChange(formatDateForSubmission(newValue))
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.AcademicYearFromDate,
                        helperText: errors.AcademicYearFromDate?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="AcademicYearToDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Academic Year To Date"
                    value={formatDateForInput(field.value)}
                    onChange={(newValue: Date | null) => {
                      field.onChange(formatDateForSubmission(newValue))
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.AcademicYearToDate,
                        helperText: errors.AcademicYearToDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Controller
                name="FinancialYearFromDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Financial Year From Date"
                    value={formatDateForInput(field.value)}
                    onChange={(newValue: Date | null) => {
                      field.onChange(formatDateForSubmission(newValue))
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.FinancialYearFromDate,
                        helperText: errors.FinancialYearFromDate?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="FinancialYearToDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Financial Year To Date"
                    value={formatDateForInput(field.value)}
                    onChange={(newValue: Date | null) => {
                      field.onChange(formatDateForSubmission(newValue))
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.FinancialYearToDate,
                        helperText: errors.FinancialYearToDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Controller
                name="CalendarYearFromDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Calendar Year From Date"
                    value={formatDateForInput(field.value)}
                    onChange={(newValue: Date | null) => {
                      field.onChange(formatDateForSubmission(newValue))
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.CalendarYearFromDate,
                        helperText: errors.CalendarYearFromDate?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="CalendarYearToDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Calendar Year To Date"
                    value={formatDateForInput(field.value)}
                    onChange={(newValue: Date | null) => {
                      field.onChange(formatDateForSubmission(newValue))
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.CalendarYearToDate,
                        helperText: errors.CalendarYearToDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Stack>

            <Controller
              name="Description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  error={!!errors.Description}
                  helperText={errors.Description?.message}
                  placeholder="Optional description"
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {onCancel && (
                <Button onClick={onCancel} disabled={isLoading}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || !isDirty}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading
                  ? 'Saving...'
                  : isEditing
                  ? 'Update Academic Year'
                  : 'Create Academic Year'}
              </Button>
            </Box>
          </Stack>
        </Box>
    </LocalizationProvider>
  )
}