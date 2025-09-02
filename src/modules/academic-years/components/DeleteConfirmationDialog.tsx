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
} from '@mui/material'
import { Warning } from '@mui/icons-material'
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
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Warning color="warning" />
          <Typography variant="h6">
            Delete Academic Year
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this academic year? This action cannot be undone.
        </DialogContentText>
        
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            Academic Year: {academicYear.AcademicYearName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Year: {academicYear.AcademicYear}
          </Typography>
          {academicYear.Description && (
            <Typography variant="body2" color="text.secondary">
              Description: {academicYear.Description}
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Failed to delete academic year: {error}
            </Typography>
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog