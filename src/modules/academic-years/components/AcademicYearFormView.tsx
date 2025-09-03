import { Controller } from 'react-hook-form'
import {
  Box,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Typography,
  Card,
  CardContent,
  FormHelperText,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { CalendarToday, School, AccountBalance, Event } from '@mui/icons-material'
import { useAcademicYearFormView } from '../hooks/useAcademicYearForm'
import { memo } from 'react'
import type { AcademicYear } from '../types/academicYear'

interface AcademicYearFormViewProps {
  onSuccess?: () => void
  onRefetch?: () => void
  academicYear?: AcademicYear | null
  mode?: 'create' | 'edit'
}

const AcademicYearFormViewComponent: React.FC<AcademicYearFormViewProps> = ({
  onSuccess,
  onRefetch,
  academicYear = null,
  mode = 'create',
}) => {
  const {
    form: { control, handleSubmit, formState: { errors, isDirty } },
    isLoading,
    isEditing,
    onSubmit,
    formatDateForInput,
    formatDateForSubmission,
    editAcademicYearError,
    isLoadingEditData,
  } = useAcademicYearFormView({ onSuccess, onRefetch, academicYear, mode })

  // Show loading state when fetching data for edit mode
  if (isLoadingEditData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={40} />
          <Typography variant="body1">Loading academic year data...</Typography>
        </Stack>
      </Box>
    )
  }

  // Show error state when API call fails
  if (editAcademicYearError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        <Typography variant="h6" gutterBottom>
          Failed to Load Data
        </Typography>
        <Typography variant="body2">
          Unable to load academic year data. Please check your connection and try again.
        </Typography>
      </Alert>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 1 }}>
          <Stack spacing={4}>
            {/* Basic Information Section */}
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <School color="primary" />
                    <Typography variant="h6" color="primary">
                      Basic Information
                    </Typography>
                  </Box>
                  
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
                          helperText={errors.AcademicYearName?.message || "e.g., 2023-24"}
                          InputProps={{
                            startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
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
                          helperText={errors.AcademicYear?.message || "Numeric year value"}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      )}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Academic Year Period Section */}
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Event color="primary" />
                    <Typography variant="h6" color="primary">
                      Academic Year Period
                    </Typography>
                  </Box>
                  
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
                              helperText: errors.AcademicYearFromDate?.message || "Start date of academic year",
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
                              helperText: errors.AcademicYearToDate?.message || "End date of academic year",
                            },
                          }}
                        />
                      )}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Financial Year Period Section */}
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccountBalance color="primary" />
                    <Typography variant="h6" color="primary">
                      Financial Year Period
                    </Typography>
                  </Box>
                  
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
                              helperText: errors.FinancialYearFromDate?.message || "Financial year start date",
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
                              helperText: errors.FinancialYearToDate?.message || "Financial year end date",
                            },
                          }}
                        />
                      )}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Calendar Year Period Section */}
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarToday color="primary" />
                    <Typography variant="h6" color="primary">
                      Calendar Year Period
                    </Typography>
                  </Box>
                  
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
                              helperText: errors.CalendarYearFromDate?.message || "Calendar year start date",
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
                              helperText: errors.CalendarYearToDate?.message || "Calendar year end date",
                            },
                          }}
                        />
                      )}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Description Section */}
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" color="primary">
                    Additional Information
                  </Typography>
                  
                  <Controller
                    name="Description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        error={!!errors.Description}
                        helperText={errors.Description?.message || "Optional description or notes about this academic year"}
                        placeholder="Enter any additional information about this academic year..."
                        variant="outlined"
                      />
                    )}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end',
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading || !isDirty}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                sx={{ minWidth: 200 }}
              >
                {isLoading
                  ? 'Saving...'
                  : isEditing
                  ? 'Update Academic Year'
                  : 'Create Academic Year'}
              </Button>
              {!isDirty && !isLoading && (
                <FormHelperText>
                  Make changes to enable save button
                </FormHelperText>
              )}
            </Box>
          </Stack>
        </Box>
    </LocalizationProvider>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const AcademicYearFormView = memo(AcademicYearFormViewComponent)
AcademicYearFormView.displayName = 'AcademicYearFormView'