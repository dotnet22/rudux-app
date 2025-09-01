import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Typography, Box, IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { AcademicYearForm } from '../components/AcademicYearForm'
import type { AcademicYear } from '../types/academicYear'

const AcademicYearFormPage = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const [initialData] = useState<AcademicYear | undefined>(undefined) // TODO: Fetch existing data if editing

  const isEditMode = Boolean(id)

  const handleSuccess = () => {
    navigate('/academic-years')
  }

  const handleCancel = () => {
    navigate('/academic-years')
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleCancel} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Academic Year' : 'Create Academic Year'}
        </Typography>
      </Box>
      
      <AcademicYearForm
        initialData={initialData}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Box>
  )
}

export default AcademicYearFormPage