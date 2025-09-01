import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { toast } from 'sonner'
import { useUpdateAcademicYearMutation } from '../store/api/academicYearsApi'
import { academicYearFormSchema, type AcademicYearFormData } from '../schema'
import type { AcademicYear } from '../types/academicYear'

interface AcademicYearFormProps {
  initialData?: AcademicYear
  onSuccess?: () => void
  onCancel?: () => void
}

export const AcademicYearForm: React.FC<AcademicYearFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const [updateAcademicYear, { isLoading }] = useUpdateAcademicYearMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearFormSchema),
    defaultValues: {
      AcademicYearPK: initialData?.AcademicYearPK || '',
      AcademicYearName: initialData?.AcademicYearName || '',
      AcademicYear: initialData?.AcademicYear || new Date().getFullYear(),
      AcademicYearFromDate: initialData?.AcademicYearFromDate || '',
      AcademicYearToDate: initialData?.AcademicYearToDate || '',
      FinancialYearFromDate: initialData?.FinancialYearFromDate || '',
      FinancialYearToDate: initialData?.FinancialYearToDate || '',
      CalendarYearFromDate: initialData?.CalendarYearFromDate || '',
      CalendarYearToDate: initialData?.CalendarYearToDate || '',
      Description: initialData?.Description || '',
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({
        AcademicYearPK: initialData.AcademicYearPK,
        AcademicYearName: initialData.AcademicYearName,
        AcademicYear: initialData.AcademicYear,
        AcademicYearFromDate: initialData.AcademicYearFromDate,
        AcademicYearToDate: initialData.AcademicYearToDate,
        FinancialYearFromDate: initialData.FinancialYearFromDate,
        FinancialYearToDate: initialData.FinancialYearToDate,
        CalendarYearFromDate: initialData.CalendarYearFromDate,
        CalendarYearToDate: initialData.CalendarYearToDate,
        Description: initialData.Description || '',
      })
    }
  }, [initialData, reset])

  const onSubmit = async (data: AcademicYearFormData) => {
    try {
      const academicYearData: AcademicYear = {
        AcademicYearPK: data.AcademicYearPK || '',
        AcademicYearName: data.AcademicYearName,
        AcademicYear: data.AcademicYear,
        AcademicYearFromDate: data.AcademicYearFromDate,
        AcademicYearToDate: data.AcademicYearToDate,
        FinancialYearFromDate: data.FinancialYearFromDate,
        FinancialYearToDate: data.FinancialYearToDate,
        CalendarYearFromDate: data.CalendarYearFromDate,
        CalendarYearToDate: data.CalendarYearToDate,
        Description: data.Description || null,
      }

      const result = await updateAcademicYear(academicYearData).unwrap()

      if (result.rowsAffected > 0) {
        toast.success(
          initialData
            ? 'Academic year updated successfully'
            : 'Academic year created successfully'
        )
        onSuccess?.()
      } else {
        toast.error('No changes were made to the academic year')
      }
    } catch (error) {
      console.error('Error saving academic year:', error)
      toast.error('Failed to save academic year. Please try again.')
    }
  }

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return null
    try {
      return new Date(dateString)
    } catch {
      return null
    }
  }

  const formatDateForSubmission = (date: Date | null) => {
    if (!date) return ''
    return date.toISOString()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {initialData ? 'Edit Academic Year' : 'Create Academic Year'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
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
                  : initialData
                  ? 'Update Academic Year'
                  : 'Create Academic Year'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </LocalizationProvider>
  )
}