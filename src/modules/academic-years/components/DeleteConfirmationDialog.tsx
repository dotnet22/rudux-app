import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Typography,
  Box,
  Divider,
  Card,
  CardContent,
  Stack,
  Avatar,
} from '@mui/material'
import { Warning, ErrorOutline, Delete } from '@mui/icons-material'
import type { AcademicYear } from '../types/academicYear'

interface DeleteConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  academicYear: AcademicYear | null
  isDeleting?: boolean
  error?: string | null
}

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  academicYear,
  isDeleting = false,
  error = null,
}: DeleteConfirmationDialogProps) => {
  if (!academicYear) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
            <Warning fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" color="error.main" fontWeight="bold">
              Confirm Deletion
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 3 }}>
        <DialogContentText sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to permanently delete this academic year?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action will permanently remove all associated data and cannot be reversed.
          </Typography>
        </DialogContentText>
        
        <Card 
          variant="outlined" 
          sx={{ 
            bgcolor: 'error.50',
            borderColor: 'error.200',
            '&:hover': {
              bgcolor: 'error.100',
            }
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <ErrorOutline color="error" sx={{ mt: 0.5 }} />
              <Box flex={1}>
                <Typography variant="h6" color="error.main" gutterBottom>
                  {academicYear.AcademicYearName}
                </Typography>
                
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Academic Year:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {academicYear.AcademicYear}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      ID:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" fontFamily="monospace" sx={{ fontSize: '0.75rem' }}>
                      {academicYear.AcademicYearPK.slice(0, 8)}...
                    </Typography>
                  </Box>
                  
                  {academicYear.Description && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Description:
                      </Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {academicYear.Description}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {error && (
          <Alert 
            severity="error" 
            variant="outlined" 
            sx={{ mt: 3 }}
            icon={<ErrorOutline />}
          >
            <Typography variant="h6" gutterBottom>
              Deletion Failed
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        )}
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={isDeleting}
          variant="outlined"
          size="large"
          sx={{ minWidth: 120 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
          disabled={isDeleting}
          size="large"
          startIcon={isDeleting ? undefined : <Delete />}
          sx={{ minWidth: 160 }}
        >
          {isDeleting ? 'Deleting...' : 'Delete Permanently'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog