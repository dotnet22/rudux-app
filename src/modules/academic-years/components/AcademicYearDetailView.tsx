import { Box, Typography, Stack, Divider, Alert, Button, CircularProgress } from '@mui/material'
import { CalendarToday, Person, Schedule } from '@mui/icons-material'
import { formatDate, formatDateTime } from '../../../core/utils'
import type { AcademicYear } from '../types/academicYear'

interface AcademicYearDetailViewProps {
  data?: AcademicYear
  isLoading?: boolean
  error?: unknown
  onRetry?: () => void
}

const AcademicYearDetailView = ({ 
  data, 
  isLoading: externalLoading = false, 
  error,
  onRetry 
}: AcademicYearDetailViewProps) => {
  // Show loading state when fetching data
  if (externalLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography>Loading academic year details...</Typography>
        </Stack>
      </Box>
    )
  }

  // Show error state when API call fails
  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )
        }
      >
        Failed to load academic year details. Please try again.
      </Alert>
    )
  }

  if (!data) {
    return (
      <Alert severity="info">
        No academic year data available
      </Alert>
    )
  }


  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" color="primary" gutterBottom>
          {data.AcademicYearName}
        </Typography>
      </Box>

        <Divider />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box flex={1}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Basic Information
                </Typography>
                <Box sx={{ pl: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Academic Year: <strong>{data.AcademicYear}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: <strong>{data.AcademicYearPK}</strong>
                  </Typography>
                  {data.Description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Description: <strong>{data.Description}</strong>
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Academic Year Period
                </Typography>
                <Box sx={{ pl: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    From: <strong>{formatDate(data.AcademicYearFromDate)}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    To: <strong>{formatDate(data.AcademicYearToDate)}</strong>
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>

          <Box flex={1}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Financial Year Period
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    From: <strong>{formatDate(data.FinancialYearFromDate)}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    To: <strong>{formatDate(data.FinancialYearToDate)}</strong>
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Calendar Year Period
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    From: <strong>{formatDate(data.CalendarYearFromDate)}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    To: <strong>{formatDate(data.CalendarYearToDate)}</strong>
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Stack>

        <Divider />

        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
            Audit Information
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ pl: 2 }}>
            <Box flex={1}>
              <Typography variant="body2" color="text.secondary">
                Created By: <strong>{data.CreatedByUserName}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: <strong>{formatDateTime(data.Created)}</strong>
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="body2" color="text.secondary">
                Modified By: <strong>{data.ModifiedByUserName}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Modified: <strong>{formatDateTime(data.Modified)}</strong>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
  )
}

export default AcademicYearDetailView