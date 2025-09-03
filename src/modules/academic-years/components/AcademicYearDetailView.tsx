import { Box, Typography, Stack, Divider, Alert, Button, CircularProgress, Card, CardContent, Chip, Avatar } from '@mui/material'
import { CalendarToday, Person, Schedule, AccountBalance, Event, Info, DateRange } from '@mui/icons-material'
import { formatDate, formatDateTime } from '../../../core/utils'
import type { AcademicYear } from '../types/academicYear'

export interface AcademicYearDetailViewProps {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, p: 3 }}>
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={50} />
          <Typography variant="h6">Loading academic year details...</Typography>
          <Typography variant="body2" color="text.secondary">Please wait while we fetch the information</Typography>
        </Stack>
      </Box>
    )
  }

  // Show error state when API call fails
  if (error) {
    return (
      <Alert 
        severity="error" 
        variant="outlined"
        sx={{ m: 2 }}
        action={
          onRetry && (
            <Button color="inherit" size="small" variant="outlined" onClick={onRetry}>
              Retry
            </Button>
          )
        }
      >
        <Typography variant="h6" gutterBottom>
          Failed to Load Academic Year Details
        </Typography>
        <Typography variant="body2">
          Unable to retrieve the academic year information. Please check your connection and try again.
        </Typography>
      </Alert>
    )
  }

  if (!data) {
    return (
      <Alert severity="info" variant="outlined" sx={{ m: 2 }}>
        <Typography variant="h6" gutterBottom>
          No Data Available
        </Typography>
        <Typography variant="body2">
          No academic year information is currently available to display.
        </Typography>
      </Alert>
    )
  }

  // Calculate status
  const now = new Date()
  const startDate = new Date(data.AcademicYearFromDate)
  const endDate = new Date(data.AcademicYearToDate)
  
  const isActive = now >= startDate && now <= endDate
  const isPast = now > endDate
  const isFuture = now < startDate
  
  const status = isActive ? 'Active' : isPast ? 'Past' : 'Future'
  const statusColor = isActive ? 'success' : isPast ? 'default' : 'info'


  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      {/* Header with Status */}
      <Card elevation={2}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
            <Box>
              <Typography variant="h4" color="primary" gutterBottom>
                {data.AcademicYearName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Academic Year {data.AcademicYear}
              </Typography>
            </Box>
            <Chip
              label={status}
              color={statusColor}
              size="medium"
              variant={isActive ? 'filled' : 'outlined'}
              sx={{ fontSize: '1rem', px: 2, py: 1 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Main Content Cards */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        {/* Left Column */}
        <Box flex={1}>
          <Stack spacing={3}>
            {/* Basic Information Card */}
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Info />
                  </Avatar>
                  <Typography variant="h6">
                    Basic Information
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Academic Year
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {data.AcademicYear}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Unique Identifier
                    </Typography>
                    <Typography variant="body1" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                      {data.AcademicYearPK}
                    </Typography>
                  </Box>
                  {data.Description && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {data.Description}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Academic Year Period Card */}
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <Event />
                  </Avatar>
                  <Typography variant="h6">
                    Academic Year Period
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Start Date
                      </Typography>
                      <Typography variant="h6">
                        {formatDate(data.AcademicYearFromDate)}
                      </Typography>
                    </Box>
                    <DateRange color="disabled" />
                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        End Date
                      </Typography>
                      <Typography variant="h6">
                        {formatDate(data.AcademicYearToDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        {/* Right Column */}
        <Box flex={1}>
          <Stack spacing={3}>
            {/* Financial Year Card */}
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <AccountBalance />
                  </Avatar>
                  <Typography variant="h6">
                    Financial Year Period
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Start Date
                      </Typography>
                      <Typography variant="h6">
                        {formatDate(data.FinancialYearFromDate)}
                      </Typography>
                    </Box>
                    <DateRange color="disabled" />
                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        End Date
                      </Typography>
                      <Typography variant="h6">
                        {formatDate(data.FinancialYearToDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Calendar Year Card */}
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <CalendarToday />
                  </Avatar>
                  <Typography variant="h6">
                    Calendar Year Period
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Start Date
                      </Typography>
                      <Typography variant="h6">
                        {formatDate(data.CalendarYearFromDate)}
                      </Typography>
                    </Box>
                    <DateRange color="disabled" />
                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        End Date
                      </Typography>
                      <Typography variant="h6">
                        {formatDate(data.CalendarYearToDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Stack>

      {/* Audit Information Card */}
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Avatar sx={{ bgcolor: 'warning.main' }}>
              <Person />
            </Avatar>
            <Typography variant="h6">
              Audit Information
            </Typography>
          </Box>
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Box flex={1}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Created Information
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body1" fontWeight="medium">
                  {data.CreatedByUserName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(data.Created)}
                </Typography>
              </Box>
            </Box>
            
            <Box flex={1}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Last Modified Information
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body1" fontWeight="medium">
                  {data.ModifiedByUserName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(data.Modified)}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      </Stack>
  )
}

export default AcademicYearDetailView